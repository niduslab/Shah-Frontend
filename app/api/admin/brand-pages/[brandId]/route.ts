import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CONTENT_DIR = path.join(process.cwd(), 'public', 'content', 'brand-pages');

// Ensure directory exists
if (!fs.existsSync(CONTENT_DIR)) {
  fs.mkdirSync(CONTENT_DIR, { recursive: true });
}

export async function GET(
  request: NextRequest,
  { params }: { params: { brandId: string } }
) {
  try {
    const { brandId } = params;
    const filePath = path.join(CONTENT_DIR, `${brandId}.json`);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ content: null }, { status: 200 });
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error reading brand page content:', error);
    return NextResponse.json(
      { error: 'Failed to read brand page content' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { brandId: string } }
) {
  try {
    const { brandId } = params;
    const body = await request.json();
    const { content } = body;

    const filePath = path.join(CONTENT_DIR, `${brandId}.json`);

    const data = {
      brandId,
      content,
      updatedAt: new Date().toISOString(),
    };

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');

    return NextResponse.json(
      { message: 'Brand page content saved successfully', data },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error saving brand page content:', error);
    return NextResponse.json(
      { error: 'Failed to save brand page content' },
      { status: 500 }
    );
  }
}
