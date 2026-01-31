'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { findCurrentLineIndex, type LyricLine } from '@/lib/lrc-parser';
import type { PlayerState } from '@/lib/types';

interface UseLyricSyncOptions {
  lines: LyricLine[];
  playerState: PlayerState;
  getCurrentTime: () => number;
}

export function useLyricSync({
  lines,
  playerState,
  getCurrentTime,
}: UseLyricSyncOptions) {
  const [currentLineIndex, setCurrentLineIndex] = useState(-1);
  const rafRef = useRef<number | null>(null);
  const hasPlayedRef = useRef(false);

  const syncLoop = useCallback(() => {
    const time = getCurrentTime();
    const index = findCurrentLineIndex(lines, time);
    setCurrentLineIndex(index);

    rafRef.current = requestAnimationFrame(syncLoop);
  }, [lines, getCurrentTime]);

  useEffect(() => {
    if (playerState === 'PLAYING') {
      // Mark that playback has started
      hasPlayedRef.current = true;
      // Start sync loop
      rafRef.current = requestAnimationFrame(syncLoop);
    } else {
      // Stop sync loop
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      // Update position when paused (but only if we've played before)
      if (playerState === 'PAUSED' && hasPlayedRef.current) {
        const time = getCurrentTime();
        const index = findCurrentLineIndex(lines, time);
        setCurrentLineIndex(index);
      }
    }

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [playerState, syncLoop, lines, getCurrentTime]);

  // Reset when lines change (new song)
  useEffect(() => {
    setCurrentLineIndex(-1);
    hasPlayedRef.current = false;
  }, [lines]);

  return { currentLineIndex };
}
