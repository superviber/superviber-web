import { NextResponse } from 'next/server';

interface Song {
  videoId: string;
  title: string;
  artist: string;
  hasLyrics: boolean;
}

export async function GET(request: Request) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Not available in production' },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const playlistId = searchParams.get('playlistId');

  if (!playlistId) {
    return NextResponse.json(
      { error: 'Missing playlistId' },
      { status: 400 }
    );
  }

  try {
    // Fetch playlist page to extract video IDs
    // Note: This is a scraping approach that may break if YouTube changes their HTML
    const playlistUrl = `https://www.youtube.com/playlist?list=${playlistId}`;
    const response = await fetch(playlistUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch playlist');
    }

    const html = await response.text();

    // Extract video data from the initial data JSON
    const initialDataMatch = html.match(/var ytInitialData = ({.+?});<\/script>/);
    if (!initialDataMatch) {
      throw new Error('Could not parse playlist data');
    }

    const initialData = JSON.parse(initialDataMatch[1]);

    // Navigate to the playlist items
    const contents = initialData?.contents?.twoColumnBrowseResultsRenderer?.tabs?.[0]
      ?.tabRenderer?.content?.sectionListRenderer?.contents?.[0]
      ?.itemSectionRenderer?.contents?.[0]?.playlistVideoListRenderer?.contents;

    if (!contents || !Array.isArray(contents)) {
      throw new Error('Could not find playlist contents');
    }

    const songs: Song[] = [];

    for (const item of contents) {
      const videoRenderer = item.playlistVideoRenderer;
      if (!videoRenderer) continue;

      const videoId = videoRenderer.videoId;
      const fullTitle = videoRenderer.title?.runs?.[0]?.text || 'Unknown Title';

      // Parse "Artist - Title" format, or use channel name as fallback artist
      let title = fullTitle;
      let artist = videoRenderer.shortBylineText?.runs?.[0]?.text || 'Unknown Artist';

      // Try to extract artist from title if it contains " - "
      const dashMatch = fullTitle.match(/^(.+?)\s*[-–—]\s*(.+)$/);
      if (dashMatch) {
        artist = dashMatch[1].trim();
        title = dashMatch[2].trim();
      }

      // Clean up common suffixes
      title = title
        .replace(/\s*\(Official.*?\)/gi, '')
        .replace(/\s*\[Official.*?\]/gi, '')
        .replace(/\s*\(Lyric.*?\)/gi, '')
        .replace(/\s*\[Lyric.*?\]/gi, '')
        .replace(/\s*\(Audio.*?\)/gi, '')
        .replace(/\s*\[Audio.*?\]/gi, '')
        .trim();

      songs.push({
        videoId,
        title,
        artist,
        hasLyrics: false,
      });
    }

    return NextResponse.json(songs);
  } catch (error) {
    console.error('Failed to fetch playlist:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch playlist' },
      { status: 500 }
    );
  }
}
