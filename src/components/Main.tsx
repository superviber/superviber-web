'use client';

import { usePathname } from 'next/navigation';
import { usePlayerOptional } from '@/contexts/PlayerContext';

export default function Main({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const player = usePlayerOptional();
  const isPlayer = pathname?.startsWith('/player');

  // Add bottom padding when mini player is visible (active player + not on player page)
  const showMiniPlayer = player?.hasActivePlayer && !isPlayer;

  if (isPlayer) {
    return (
      <main className="pt-16 h-dvh overflow-hidden">
        {children}
      </main>
    );
  }

  return (
    <main className={`pt-16 min-h-screen ${showMiniPlayer ? 'pb-20' : ''}`}>
      {children}
    </main>
  );
}
