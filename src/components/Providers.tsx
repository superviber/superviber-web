'use client';

import { type ReactNode } from 'react';
import { PlayerProvider } from '@/contexts/PlayerContext';
import { PlaylistLoader } from '@/components/PlaylistLoader';
import { GlobalPlayer } from '@/components/GlobalPlayer';
import { MiniPlayer } from '@/components/MiniPlayer';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <PlayerProvider>
      <PlaylistLoader />
      {children}
      <GlobalPlayer />
      <MiniPlayer />
    </PlayerProvider>
  );
}
