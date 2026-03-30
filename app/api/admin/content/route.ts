import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    const contentDir = path.join(process.cwd(), "public/content");
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(contentDir)) {
      fs.mkdirSync(contentDir, { recursive: true });
    }

    const files = fs.readdirSync(contentDir);
    
    const result = files
      .filter(file => file.endsWith(".json"))
      .map(file => {
        const filePath = path.join(contentDir, file);
        const content = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        const stats = fs.statSync(filePath);
        
        return {
          filename: file,
          pageKey: content.pageKey || file.replace(".json", ""),
          pageType: content.pageType || "unknown",
          title: content.title || file,
          lastModified: stats.mtimeMs / 1000,
        };
      });

    return NextResponse.json({
      success: true,
      files: result,
    });
  } catch (error) {
    console.error("Error listing files:", error);
    return NextResponse.json(
      { error: "Failed to list files" },
      { status: 500 }
    );
  }
}
