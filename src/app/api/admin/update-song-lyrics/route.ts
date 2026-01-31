import { NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
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
    const { videoId, hasLyrics } = await request.json();

    if (!videoId || typeof hasLyrics !== 'boolean') {
      return NextResponse.json(
        { error: 'Missing videoId or hasLyrics' },
        { status: 400 }
      );
    }

    const filePath = join(process.cwd(), 'public', 'data', 'songs.json');
    const content = await readFile(filePath, 'utf-8');
    const data = JSON.parse(content);

    // Update the song's hasLyrics status
    data.songs = data.songs.map((song: { videoId: string; hasLyrics: boolean }) =>
      song.videoId === videoId ? { ...song, hasLyrics } : song
    );

    await writeFile(filePath, JSON.stringify(data, null, 2) + '\n');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update song:', error);
    return NextResponse.json(
      { error: 'Failed to update' },
      { status: 500 }
    );
  }
}
