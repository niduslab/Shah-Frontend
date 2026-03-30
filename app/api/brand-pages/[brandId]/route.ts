import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CONTENT_DIR = path.join(process.cwd(), 'public', 'content', 'brand-pages');

export async function GET(
  request: NextRequest,
  { params }: { params: { brandId: string } }
) {
  try {
    const { brandId } = params;
    const filePath = path.join(CONTENT_DIR, `${brandId}.json`);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Brand page content not found' },
        { status: 404 }
      );
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
