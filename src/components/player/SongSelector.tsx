'use client';

import { useState, useRef, useEffect } from 'react';
import type { Song } from '@/lib/types';

interface SongSelectorProps {
  songs: Song[];
  currentVideoId: string;
  onSelect: (videoId: string) => void;
  onPrevious: () => void;
  onNext: () => void;
}

export function SongSelector({
  songs,
  currentVideoId,
  onSelect,
  onPrevious,
  onNext,
}: SongSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentSong = songs.find((s) => s.videoId === currentVideoId);
  const currentIndex = songs.findIndex((s) => s.videoId === currentVideoId);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-center gap-4 px-4 py-3 bg-zinc-900/50 border-t border-white/10">
      {/* Previous button */}
      <button
        onClick={onPrevious}
        className="p-2 rounded-full hover:bg-white/10 transition-colors"
        aria-label="Previous song"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Song selector dropdown */}
      <div ref={dropdownRef} className="relative flex-1 max-w-md">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors text-left flex items-center justify-between"
        >
          <div className="truncate">
            <span className="font-medium">
              {currentSong?.title || 'Select a song'}
            </span>
            {currentSong?.artist && (
              <span className="text-zinc-400 ml-2">— {currentSong.artist}</span>
            )}
          </div>
          <svg
            className={`w-5 h-5 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute bottom-full left-0 right-0 mb-2 bg-zinc-800 rounded-lg shadow-xl border border-white/10 max-h-64 overflow-y-auto">
            {songs.map((song, index) => (
              <button
                key={song.videoId}
                onClick={() => {
                  onSelect(song.videoId);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left hover:bg-zinc-700 transition-colors flex items-center gap-3 ${
                  song.videoId === currentVideoId ? 'bg-violet-600/20' : ''
                }`}
              >
                <span className="text-zinc-500 text-sm w-6">{index + 1}</span>
                <div className="flex-1 truncate">
                  <div className="font-medium truncate">{song.title}</div>
                  <div className="text-sm text-zinc-400 truncate">
                    {song.artist}
                  </div>
                </div>
                {song.videoId === currentVideoId && (
                  <span className="text-violet-400">▶</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Next button */}
      <button
        onClick={onNext}
        className="p-2 rounded-full hover:bg-white/10 transition-colors"
        aria-label="Next song"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Track position indicator */}
      <span className="text-zinc-500 text-sm">
        {currentIndex + 1} / {songs.length}
      </span>
    </div>
  );
}
