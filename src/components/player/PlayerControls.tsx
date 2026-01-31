'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
} from 'lucide-react';
import type { PlayerState } from '@/lib/types';

interface PlayerControlsProps {
  playerState: PlayerState;
  getCurrentTime: () => number;
  getDuration: () => number;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (seconds: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  songTitle?: string;
  artist?: string;
  hasPlayedOnce: boolean;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function PlayerControls({
  playerState,
  getCurrentTime,
  getDuration,
  onPlay,
  onPause,
  onSeek,
  onPrevious,
  onNext,
  songTitle,
  artist,
  hasPlayedOnce,
}: PlayerControlsProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragTime, setDragTime] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const isPlaying = playerState === 'PLAYING';
  const isReady = playerState !== 'LOADING';

  // Reset time when loading a new video
  useEffect(() => {
    if (playerState === 'LOADING') {
      setCurrentTime(0);
      setDuration(0);
    }
  }, [playerState]);

  // Update time display
  useEffect(() => {
    const updateTime = () => {
      if (!isDragging) {
        setCurrentTime(getCurrentTime());
      }
      setDuration(getDuration());
      rafRef.current = requestAnimationFrame(updateTime);
    };

    if (isReady) {
      rafRef.current = requestAnimationFrame(updateTime);
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isReady, getCurrentTime, getDuration, isDragging]);

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!progressRef.current || duration === 0) return;

      const rect = progressRef.current.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const newTime = percent * duration;
      onSeek(newTime);
      setCurrentTime(newTime);
    },
    [duration, onSeek]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!progressRef.current || duration === 0) return;

      setIsDragging(true);
      const rect = progressRef.current.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      setDragTime(Math.max(0, Math.min(1, percent)) * duration);
    },
    [duration]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!progressRef.current || duration === 0) return;

      setIsDragging(true);
      const rect = progressRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      const percent = (touch.clientX - rect.left) / rect.width;
      setDragTime(Math.max(0, Math.min(1, percent)) * duration);
    },
    [duration]
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!progressRef.current || duration === 0) return;
      const rect = progressRef.current.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      setDragTime(Math.max(0, Math.min(1, percent)) * duration);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!progressRef.current || duration === 0) return;
      const rect = progressRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      const percent = (touch.clientX - rect.left) / rect.width;
      setDragTime(Math.max(0, Math.min(1, percent)) * duration);
    };

    const handleEnd = () => {
      setIsDragging(false);
      onSeek(dragTime);
      setCurrentTime(dragTime);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, dragTime, duration, onSeek]);

  const displayTime = isDragging ? dragTime : currentTime;
  const progress = duration > 0 ? (displayTime / duration) * 100 : 0;

  return (
    <div className="bg-zinc-900/95 backdrop-blur border-t border-white/10">
      {/* Progress bar */}
      <div
        ref={progressRef}
        className="h-6 bg-zinc-700 cursor-pointer group relative flex items-center touch-none select-none"
        style={{ WebkitTapHighlightColor: 'transparent' }}
        onClick={handleProgressClick}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="absolute inset-x-0 h-1 bg-zinc-600">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-pink-500 relative"
            style={{ width: `${progress}%` }}
          >
            {/* Seek handle - always visible on touch devices */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="px-4 py-3 flex items-center gap-4">
        {/* Play controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevious}
            className="p-2 text-zinc-400 hover:text-white transition-colors"
            aria-label="Previous song"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          <div className="relative group">
            <button
              onClick={isPlaying ? onPause : onPlay}
              disabled={!isReady || (!hasPlayedOnce && !isPlaying)}
              className="p-3 bg-white text-black rounded-full hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </button>
            {!hasPlayedOnce && !isPlaying && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-zinc-800 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Click the video to start
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-800" />
              </div>
            )}
          </div>

          <button
            onClick={onNext}
            className="p-2 text-zinc-400 hover:text-white transition-colors"
            aria-label="Next song"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Time display */}
        <div className="text-xs text-zinc-400 tabular-nums min-w-[80px]">
          {formatTime(displayTime)} / {formatTime(duration)}
        </div>

        {/* Song info - grows to fill space */}
        <div className="flex-1 min-w-0 text-right lg:text-center">
          {songTitle && (
            <div className="truncate">
              <span className="text-sm font-medium text-white">{songTitle}</span>
              {artist && (
                <span className="text-sm text-zinc-400"> — {artist}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
