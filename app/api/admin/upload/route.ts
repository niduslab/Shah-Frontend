import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

// Persistent, writable location for runtime uploads.
// In standalone production builds, files written into the build-time `public/`
// snapshot are NOT served as static assets, so we store uploads here and serve
// them back through the /api/uploads/[...path] route instead of a static path.
const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");

const IMAGE_TYPES = ["image/png", "image/jpeg", "image/gif", "image/webp", "image/avif"];
const VIDEO_TYPES = ["video/mp4", "video/webm"];

// The box this runs on is memory- and disk-constrained, and uploads are read into
// a Buffer before being written. Cap them so a single large file cannot exhaust it.
const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_BYTES = 50 * 1024 * 1024; // 50MB

function mb(bytes: number) {
  return Math.round(bytes / (1024 * 1024));
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "misc";

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const isVideo = VIDEO_TYPES.includes(file.type);
    const isImage = IMAGE_TYPES.includes(file.type);

    if (!isVideo && !isImage) {
      return NextResponse.json(
        {
          error:
            `Unsupported file type "${file.type || "unknown"}". ` +
            `Allowed: PNG, JPEG, GIF, WebP, AVIF, MP4, WebM.`,
        },
        { status: 415 }
      );
    }

    const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
    if (file.size > maxBytes) {
      return NextResponse.json(
        {
          error:
            `File is ${mb(file.size)}MB, which exceeds the ` +
            `${mb(maxBytes)}MB limit for ${isVideo ? "videos" : "images"}.`,
        },
        { status: 413 }
      );
    }

    // Sanitize folder to prevent path traversal
    const safeFolder = folder
      .split("/")
      .map((seg) => seg.replace(/[^a-zA-Z0-9_-]/g, ""))
      .filter(Boolean)
      .join("/");

    const uploadDir = path.join(UPLOAD_ROOT, safeFolder);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const ext = path.extname(file.name);
    const nameWithoutExt = path
      .basename(file.name, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "-");
    const filename = `${timestamp}-${nameWithoutExt}${ext}`;
    const filePath = path.join(uploadDir, filename);

    // Save file
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    // Return a URL served by our API route (works in standalone production).
    const publicUrl = `/api/uploads/${safeFolder}/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: filename,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
