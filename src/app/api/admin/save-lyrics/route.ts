import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Not available in production' },
      { status: 403 }
    );
  }

  try {
    const { videoId, lrc } = await request.json();

    if (!videoId || !lrc) {
      return NextResponse.json(
        { error: 'Missing videoId or lrc' },
        { status: 400 }
      );
    }

    const lyricsDir = join(process.cwd(), 'public', 'data', 'lyrics');

    // Ensure directory exists
    await mkdir(lyricsDir, { recursive: true });

    const filePath = join(lyricsDir, `${videoId}.lrc`);
    await writeFile(filePath, lrc);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save lyrics:', error);
    return NextResponse.json(
      { error: 'Failed to save' },
      { status: 500 }
    );
  }
}
