'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { usePlayer } from '@/contexts/PlayerContext';

export function MiniPlayer() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    currentSong,
    currentVideoId,
    playerState,
    hasActivePlayer,
    getCurrentTime,
    getDuration,
    play,
    pause,
    seekTo,
    goToNext,
    goToPrevious,
  } = usePlayer();

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);

  // Don't show on player page or if no active player
  const isPlayerPage = pathname?.startsWith('/player');
  const shouldShow = hasActivePlayer && !isPlayerPage && playerState !== 'LOADING';

  // Update time display
  useEffect(() => {
    if (!shouldShow) return;

    const updateTime = () => {
      setCurrentTime(getCurrentTime());
      setDuration(getDuration());
    };

    updateTime();
    const interval = setInterval(updateTime, 250);
    return () => clearInterval(interval);
  }, [shouldShow, getCurrentTime, getDuration]);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || duration === 0) return;
    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    seekTo(percent * duration);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNavigateToPlayer = () => {
    if (currentVideoId) {
      router.push(`/player/${currentVideoId}`);
    }
  };

  if (!shouldShow) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isPlaying = playerState === 'PLAYING';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-900 border-t border-zinc-800 animate-slide-up">
      {/* Progress bar */}
      <div
        ref={progressRef}
        className="h-1 bg-zinc-800 cursor-pointer group"
        onClick={handleSeek}
      >
        <div
          className="h-full bg-white/80 group-hover:bg-white transition-colors relative"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      <div className="flex items-center gap-4 px-4 py-3">
        {/* Song info - clickable to navigate */}
        <button
          onClick={handleNavigateToPlayer}
          className="flex-1 min-w-0 text-left hover:bg-zinc-800/50 -m-2 p-2 rounded transition-colors"
        >
          <div className="truncate text-sm font-medium text-white">
            {currentSong?.title || 'Unknown'}
          </div>
          <div className="truncate text-xs text-zinc-400">
            {currentSong?.artist || 'Unknown Artist'}
          </div>
        </button>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevious}
            className="p-2 text-zinc-400 hover:text-white transition-colors"
            aria-label="Previous"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </button>

          <button
            onClick={isPlaying ? pause : play}
            className="p-2 bg-white text-black rounded-full hover:bg-zinc-200 transition-colors"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <button
            onClick={() => goToNext(true)}
            className="p-2 text-zinc-400 hover:text-white transition-colors"
            aria-label="Next"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
            </svg>
          </button>
        </div>

        {/* Time */}
        <div className="text-xs text-zinc-500 font-mono w-20 text-right">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>
    </div>
  );
}
