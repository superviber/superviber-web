import { NextResponse } from 'next/server';
import { writeFile, mkdir, readFile } from 'fs/promises';
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

    // Extract title and artist from LRC metadata
    const titleMatch = lrc.match(/^\[ti:(.+)\]$/im);
    const artistMatch = lrc.match(/^\[ar:(.+)\]$/im);
    const title = titleMatch ? titleMatch[1].trim() : null;
    const artist = artistMatch ? artistMatch[1].trim() : null;

    // Update songs.json with title/artist if found
    if (title || artist) {
      const songsPath = join(process.cwd(), 'public', 'data', 'songs.json');
      try {
        const songsContent = await readFile(songsPath, 'utf-8');
        const data = JSON.parse(songsContent);
        data.songs = data.songs.map((song: { videoId: string; title: string; artist: string }) => {
          if (song.videoId === videoId) {
            return {
              ...song,
              title: title || song.title,
              artist: artist || song.artist,
            };
          }
          return song;
        });
        await writeFile(songsPath, JSON.stringify(data, null, 2) + '\n');
      } catch (err) {
        console.error('Failed to update songs.json:', err);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save lyrics:', error);
    return NextResponse.json(
      { error: 'Failed to save' },
      { status: 500 }
    );
  }
}
