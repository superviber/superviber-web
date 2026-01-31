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
}: PlayerControlsProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragTime, setDragTime] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const isPlaying = playerState === 'PLAYING';
  const isReady = playerState !== 'LOADING';

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

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!progressRef.current || duration === 0) return;
      const rect = progressRef.current.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      setDragTime(Math.max(0, Math.min(1, percent)) * duration);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      onSeek(dragTime);
      setCurrentTime(dragTime);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragTime, duration, onSeek]);

  const displayTime = isDragging ? dragTime : currentTime;
  const progress = duration > 0 ? (displayTime / duration) * 100 : 0;

  return (
    <div className="bg-zinc-900/95 backdrop-blur border-t border-white/10">
      {/* Progress bar */}
      <div
        ref={progressRef}
        className="h-1 bg-zinc-700 cursor-pointer group relative"
        onClick={handleProgressClick}
        onMouseDown={handleMouseDown}
      >
        <div
          className="h-full bg-gradient-to-r from-violet-500 to-pink-500 relative"
          style={{ width: `${progress}%` }}
        >
          {/* Seek handle */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg" />
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

          <button
            onClick={isPlaying ? onPause : onPlay}
            disabled={!isReady}
            className="p-3 bg-white text-black rounded-full hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </button>

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
