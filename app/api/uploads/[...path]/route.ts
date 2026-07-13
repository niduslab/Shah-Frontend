import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Serves files that were uploaded at runtime by /api/admin/upload.
// Reads from disk on each request so it works in standalone production builds,
// where runtime-written files under public/ are not served as static assets.
const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");

const CONTENT_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};

const STREAMABLE = new Set([".mp4", ".webm"]);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: segments } = await params;

    // Reject any traversal attempts
    if (!segments || segments.some((s) => s === ".." || s.includes("\0"))) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }

    const filePath = path.join(UPLOAD_ROOT, ...segments);

    // Ensure the resolved path stays within UPLOAD_ROOT
    const normalized = path.normalize(filePath);
    if (!normalized.startsWith(UPLOAD_ROOT)) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }

    if (!fs.existsSync(normalized) || !fs.statSync(normalized).isFile()) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const ext = path.extname(normalized).toLowerCase();
    const contentType = CONTENT_TYPES[ext] || "application/octet-stream";
    const size = fs.statSync(normalized).size;

    // Video: stream, and honour Range requests. Browsers require 206 responses to
    // seek, and buffering a whole video into memory would be a real risk on a
    // small box. Images stay on the simple read-and-return path.
    if (STREAMABLE.has(ext)) {
      const range = request.headers.get("range");

      if (range) {
        const match = /^bytes=(\d*)-(\d*)$/.exec(range.trim());
        if (!match) {
          return new NextResponse(null, {
            status: 416,
            headers: { "Content-Range": `bytes */${size}` },
          });
        }

        const start = match[1] ? parseInt(match[1], 10) : 0;
        const end = match[2] ? parseInt(match[2], 10) : size - 1;

        if (
          Number.isNaN(start) ||
          Number.isNaN(end) ||
          start > end ||
          start >= size
        ) {
          return new NextResponse(null, {
            status: 416,
            headers: { "Content-Range": `bytes */${size}` },
          });
        }

        const safeEnd = Math.min(end, size - 1);
        const stream = fs.createReadStream(normalized, { start, end: safeEnd });

        return new NextResponse(stream as unknown as ReadableStream, {
          status: 206,
          headers: {
            "Content-Type": contentType,
            "Content-Length": String(safeEnd - start + 1),
            "Content-Range": `bytes ${start}-${safeEnd}/${size}`,
            "Accept-Ranges": "bytes",
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      }

      const stream = fs.createReadStream(normalized);
      return new NextResponse(stream as unknown as ReadableStream, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Content-Length": String(size),
          "Accept-Ranges": "bytes",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    const buffer = fs.readFileSync(normalized);

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error serving uploaded file:", error);
    return NextResponse.json(
      { error: "Failed to serve file" },
      { status: 500 }
    );
  }
}
