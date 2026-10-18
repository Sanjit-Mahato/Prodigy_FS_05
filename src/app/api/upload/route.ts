import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const mimeType = file.type;
    const isImage = mimeType.startsWith('image/');
    const isVideo = mimeType.startsWith('video/');

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { success: false, error: 'Unsupported file type. Only images and videos are allowed.' },
        { status: 400 }
      );
    }

    // Limit check: 20MB for images, 50MB for videos
    const maxSize = isVideo ? 50 * 1024 * 1024 : 20 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: `File too large. Max allowed size is ${isVideo ? '50MB' : '20MB'}` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique safe filename
    const ext = path.extname(file.name) || (isImage ? '.jpg' : '.mp4');
    const randomHash = crypto.randomBytes(16).toString('hex');
    const filename = `${Date.now()}-${randomHash}${ext}`;

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      data: {
        url: publicUrl,
        type: isVideo ? 'VIDEO' : 'IMAGE',
        filename,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'File upload failed' },
      { status: 500 }
    );
  }
}
