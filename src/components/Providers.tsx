'use client';

import { type ReactNode } from 'react';
import { PlayerProvider } from '@/contexts/PlayerContext';
import { GlobalPlayer } from '@/components/GlobalPlayer';
import { MiniPlayer } from '@/components/MiniPlayer';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <PlayerProvider>
      {children}
      <GlobalPlayer />
      <MiniPlayer />
    </PlayerProvider>
  );
}
