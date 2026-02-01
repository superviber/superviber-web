'use client';

import { useRef, useEffect } from 'react';
import { X, List } from 'lucide-react';
import type { Song } from '@/lib/types';

interface PlaylistSidebarProps {
  songs: Song[];
  currentVideoId: string;
  onSelectSong: (videoId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export function PlaylistSidebar({
  songs,
  currentVideoId,
  onSelectSong,
  isOpen,
  onToggle,
  onClose,
}: PlaylistSidebarProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const mobileCurrentRef = useRef<HTMLButtonElement>(null);
  const desktopCurrentRef = useRef<HTMLButtonElement>(null);

  // Scroll to current song when panel opens (mobile)
  useEffect(() => {
    if (isOpen && mobileCurrentRef.current) {
      mobileCurrentRef.current.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  }, [isOpen]);

  // Scroll to current song on mount/change (desktop)
  useEffect(() => {
    if (desktopCurrentRef.current) {
      desktopCurrentRef.current.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  }, [currentVideoId]);

  // Handle click outside to close (mobile only)
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    // Delay adding listener to prevent immediate close from the toggle click
    const timeout = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 10);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Mobile: Purple tab on left side */}
      <button
        onClick={onToggle}
        className="lg:hidden absolute left-0 top-1/2 -translate-y-1/2 z-20
                   bg-purple-600 hover:bg-purple-500 transition-colors
                   rounded-r-lg shadow-lg shadow-purple-900/50
                   flex items-center justify-center w-8 h-20 pointer-events-auto"
        aria-label="Open playlist"
      >
        <List className="w-5 h-5 text-white" />
      </button>

      {/* Mobile: Overlay panel */}
      <div
        ref={panelRef}
        className={`
          lg:hidden absolute left-0 top-0 bottom-0 z-30
          bg-zinc-900/95 backdrop-blur-sm border-r border-purple-500/30
          transition-transform duration-300 ease-out
          w-[80%] max-w-sm flex flex-col pointer-events-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 hover:bg-white/10 rounded-lg transition-colors z-10"
          aria-label="Close playlist"
        >
          <X className="w-5 h-5 text-zinc-400" />
        </button>

        {/* Song list */}
        <div className="overflow-y-auto flex-1">
          {songs.map((song, index) => {
            const isCurrent = song.videoId === currentVideoId;
            return (
              <button
                key={song.videoId}
                ref={isCurrent ? mobileCurrentRef : null}
                onClick={() => onSelectSong(song.videoId)}
                className={`
                  w-full text-left p-4 border-b border-white/5
                  transition-colors
                  ${isCurrent
                    ? 'bg-purple-600/20 border-l-2 border-l-purple-500'
                    : 'hover:bg-white/5'}
                `}
              >
                <div className="flex items-start gap-3">
                  <span className={`
                    text-sm font-mono w-6 flex-shrink-0
                    ${isCurrent ? 'text-purple-400' : 'text-zinc-600'}
                  `}>
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={`
                      truncate font-medium
                      ${isCurrent ? 'text-purple-300' : 'text-zinc-200'}
                    `}>
                      {song.title}
                    </p>
                    <p className="truncate text-sm text-zinc-500">{song.artist}</p>
                  </div>
                  {!song.hasLyrics && (
                    <span className="text-xs text-zinc-600 flex-shrink-0">No lyrics</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop: Always visible below video */}
      <div className="hidden lg:flex lg:flex-col border-t border-white/10 flex-1 min-h-0 overflow-y-auto">
        {songs.map((song, index) => {
          const isCurrent = song.videoId === currentVideoId;
          return (
            <button
              key={song.videoId}
              ref={isCurrent ? desktopCurrentRef : null}
              onClick={() => onSelectSong(song.videoId)}
              className={`
                w-full text-left px-3 py-2 border-b border-white/5
                transition-colors flex items-center gap-2
                ${isCurrent
                  ? 'bg-purple-600/20 border-l-2 border-l-purple-500'
                  : 'hover:bg-white/5 border-l-2 border-l-transparent'}
              `}
            >
              <span className={`
                text-xs font-mono w-5 flex-shrink-0
                ${isCurrent ? 'text-purple-400' : 'text-zinc-600'}
              `}>
                {index + 1}
              </span>
              <p className={`
                truncate text-sm flex-1 min-w-0
                ${isCurrent ? 'text-purple-300 font-medium' : 'text-zinc-300'}
              `}>
                {song.title}
              </p>
              <span className="text-xs text-zinc-600 truncate flex-shrink min-w-0">
                {song.artist}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}
