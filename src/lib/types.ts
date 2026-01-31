export interface Song {
  videoId: string;
  title: string;
  artist: string;
  duration?: number;
  hasLyrics: boolean;
}

export interface Playlist {
  playlistId: string;
  songs: Song[];
}

export type PlayerState = 'LOADING' | 'READY' | 'PLAYING' | 'PAUSED' | 'ENDED';
