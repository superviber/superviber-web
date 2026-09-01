import type { Metadata } from 'next';
import { PlayerClient } from '@/components/player/PlayerClient';
import type { Playlist } from '@/lib/types';
import playlistData from '@/../public/data/songs.json';

// Load playlist data at build time (for metadata only)
function getPlaylist(): Playlist {
  return playlistData as Playlist;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ videoId?: string[] }>;
}): Promise<Metadata> {
  const { videoId } = await params;
  const playlist = getPlaylist();
  const targetVideoId = videoId?.[0] || playlist.songs[0]?.videoId;
  const song = playlist.songs.find((s) => s.videoId === targetVideoId);

  const title = song
    ? `${song.title} - ${song.artist}`
    : 'Player | SuperViber';
  const description = song
    ? `Listen to ${song.title} by ${song.artist} with synchronized lyrics`
    : 'Listen to music with synchronized lyrics';

  // YouTube thumbnail when we have a video, otherwise the site card. Each has
  // its own dimensions: hqdefault is 480x360, the OG card is 1200x630.
  const image = targetVideoId
    ? {
        url: `https://img.youtube.com/vi/${targetVideoId}/hqdefault.jpg`,
        width: 480,
        height: 360,
      }
    : {
        url: 'https://superviber.com/images/og-card.jpg',
        width: 1200,
        height: 630,
      };

  return {
    title: song ? `${title} | SuperViber` : title,
    description,
    openGraph: {
      title,
      description,
      type: 'music.song',
      siteName: 'SuperViber',
      images: [
        {
          ...image,
          alt: song ? `${song.title} by ${song.artist}` : 'SuperViber',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image.url],
    },
  };
}

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ videoId?: string[] }>;
}) {
  const { videoId } = await params;
  const playlist = getPlaylist();

  // Get the video ID from the URL or default to first song
  const targetVideoId = videoId?.[0] || playlist.songs[0]?.videoId || '';

  // Validate the video ID exists in the playlist
  const songExists = playlist.songs.some((s) => s.videoId === targetVideoId);
  const initialVideoId = songExists ? targetVideoId : playlist.songs[0]?.videoId || '';

  // Track if videoId was explicitly provided in URL (not defaulted)
  const isExplicitVideoId = !!videoId?.[0] && songExists;

  return <PlayerClient initialVideoId={initialVideoId} isExplicitVideoId={isExplicitVideoId} />;
}
