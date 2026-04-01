import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const decodedKey = decodeURIComponent(id);

    // Prevent path traversal
    const sanitizedKey = decodedKey.replace(/\.\./g, '').replace(/^\//, '');
    
    const UPLOAD_DIR =
      process.env.NODE_ENV === 'production'
        ? '/tmp/filelab'
        : path.join(process.cwd(), 'uploads');

    const filePath = path.join(UPLOAD_DIR, sanitizedKey);

    // Ensure the file path is within the upload directory
    const resolvedPath = path.resolve(filePath);
    const resolvedUploadDir = path.resolve(UPLOAD_DIR);
    
    if (!resolvedPath.startsWith(resolvedUploadDir)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file path' },
        { status: 400 }
      );
    }

    if (!existsSync(resolvedPath)) {
      return NextResponse.json(
        { success: false, error: 'File not found or expired' },
        { status: 404 }
      );
    }

    const buffer = await readFile(resolvedPath);
    const fileName = path.basename(resolvedPath);

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { success: false, error: 'Download failed' },
      { status: 500 }
    );
  }
}
