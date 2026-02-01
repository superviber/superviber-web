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

  return {
    title: song
      ? `${song.title} - ${song.artist} | SuperViber`
      : 'Player | SuperViber',
    description: song
      ? `Listen to ${song.title} by ${song.artist} with synchronized lyrics`
      : 'Listen to music with synchronized lyrics',
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

  return <PlayerClient initialVideoId={initialVideoId} />;
}
