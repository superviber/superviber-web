'use client';

import { useEffect } from 'react';
import { usePlayer } from '@/contexts/PlayerContext';
import type { Playlist } from '@/lib/types';

export function PlaylistLoader() {
  const { playlist, setPlaylist } = usePlayer();

  useEffect(() => {
    // Only load if not already loaded
    if (playlist) return;

    async function loadPlaylist() {
      try {
        const response = await fetch('/data/songs.json');
        if (response.ok) {
          const data: Playlist = await response.json();
          setPlaylist(data);
        }
      } catch (error) {
        console.error('Failed to load playlist:', error);
      }
    }

    loadPlaylist();
  }, [playlist, setPlaylist]);

  return null;
}
