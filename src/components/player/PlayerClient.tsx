'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { LyricsPanel } from './LyricsPanel';
import { PlayerControls } from './PlayerControls';
import { PlaylistSidebar } from './PlaylistSidebar';
import { usePlayer } from '@/contexts/PlayerContext';
import { useLyricSync } from '@/hooks/useLyricSync';
import { parseLRC, type ParsedLRC } from '@/lib/lrc-parser';
import type { Playlist } from '@/lib/types';

interface PlayerClientProps {
  playlist: Playlist;
  initialVideoId: string;
}

export function PlayerClient({ playlist, initialVideoId }: PlayerClientProps) {
  const {
    setPlaylist,
    currentVideoId,
    selectSong,
    currentSong,
    playerState,
    getCurrentTime,
    getDuration,
    play,
    pause,
    seekTo,
    goToNext,
    goToPrevious,
    hasPlayedOnce,
    setVideoTarget,
  } = usePlayer();

  const [lyrics, setLyrics] = useState<ParsedLRC>({ lines: [] });
  const [isLoadingLyrics, setIsLoadingLyrics] = useState(true);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);

  const videoContainerRef = useRef<HTMLDivElement>(null);

  // Initialize playlist and video on mount
  useEffect(() => {
    setPlaylist(playlist);
  }, [playlist, setPlaylist]);

  // Select initial video if none selected
  useEffect(() => {
    if (!currentVideoId && initialVideoId) {
      selectSong(initialVideoId, false);
    }
  }, [currentVideoId, initialVideoId, selectSong]);

  // Register video container as portal target
  useEffect(() => {
    setVideoTarget(videoContainerRef.current);
    return () => setVideoTarget(null);
  }, [setVideoTarget]);

  // Update URL when song changes
  useEffect(() => {
    if (currentVideoId) {
      window.history.replaceState({}, '', `/player/${currentVideoId}`);
    }
  }, [currentVideoId]);

  // Lyrics sync
  const { currentLineIndex } = useLyricSync({
    lines: lyrics.lines,
    playerState,
    getCurrentTime,
  });

  // Load lyrics when song changes
  useEffect(() => {
    async function loadLyrics() {
      setIsLoadingLyrics(true);
      setLyrics({ lines: [] });

      if (!currentSong?.hasLyrics || !currentVideoId) {
        setIsLoadingLyrics(false);
        return;
      }

      try {
        const response = await fetch(`/data/lyrics/${currentVideoId}.lrc`);
        if (response.ok) {
          const lrcContent = await response.text();
          const parsed = parseLRC(lrcContent);
          setLyrics(parsed);
        }
      } catch (error) {
        console.error('Failed to load lyrics:', error);
      } finally {
        setIsLoadingLyrics(false);
      }
    }

    loadLyrics();
  }, [currentVideoId, currentSong?.hasLyrics]);

  const handleSelectSong = useCallback((videoId: string) => {
    selectSong(videoId, true);
  }, [selectSong]);

  return (
    <div className="h-full flex flex-col bg-black overflow-hidden">
      {/* Main content area */}
      <div
        className="flex-1 flex flex-col lg:flex-row min-h-0"
        style={{ overflowAnchor: 'none' }}
      >
        {/* Video + Controls + Playlist section */}
        <div
          className="flex-shrink-0 flex flex-col lg:h-full"
          style={{ contain: 'layout' }}
        >
          {/* Video player */}
          <div className="w-full lg:w-[560px] xl:w-[640px] lg:p-6 lg:pb-0">
            <div className="relative w-full">
              {/* 16:9 aspect ratio container */}
              <div className="relative w-full pt-[56.25%] bg-black lg:rounded-lg overflow-hidden">
                <div
                  ref={videoContainerRef}
                  className="absolute inset-0"
                />
              </div>
            </div>
          </div>

          {/* Player controls - below video */}
          <div className="lg:px-6 lg:pb-0">
            <div className="lg:rounded-b-lg overflow-hidden">
              <PlayerControls
                playerState={playerState}
                getCurrentTime={getCurrentTime}
                getDuration={getDuration}
                onPlay={play}
                onPause={pause}
                onSeek={seekTo}
                onPrevious={goToPrevious}
                onNext={() => goToNext(false)}
                songTitle={lyrics.title || currentSong?.title}
                artist={lyrics.artist || currentSong?.artist}
                hasPlayedOnce={hasPlayedOnce}
              />
            </div>
          </div>

          {/* Desktop: Playlist below controls */}
          <div className="hidden lg:flex lg:flex-col lg:flex-1 lg:min-h-0 lg:px-6 lg:pb-6">
            <div className="lg:rounded-b-lg overflow-hidden flex flex-col flex-1 min-h-0">
              <PlaylistSidebar
                songs={playlist.songs}
                currentVideoId={currentVideoId || ''}
                onSelectSong={handleSelectSong}
                isOpen={isPlaylistOpen}
                onToggle={() => setIsPlaylistOpen(!isPlaylistOpen)}
                onClose={() => setIsPlaylistOpen(false)}
              />
            </div>
          </div>
        </div>

        {/* Lyrics section */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden border-t lg:border-t-0 lg:border-l border-white/10 relative">
          {/* Mobile: Playlist sidebar overlay */}
          <div className="lg:hidden absolute inset-0 z-20 pointer-events-none">
            <PlaylistSidebar
              songs={playlist.songs}
              currentVideoId={currentVideoId || ''}
              onSelectSong={handleSelectSong}
              isOpen={isPlaylistOpen}
              onToggle={() => setIsPlaylistOpen(!isPlaylistOpen)}
              onClose={() => setIsPlaylistOpen(false)}
            />
          </div>

          {isLoadingLyrics ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-zinc-500">Loading lyrics...</div>
            </div>
          ) : (
            <LyricsPanel
              key={currentVideoId}
              lines={lyrics.lines}
              currentLineIndex={currentLineIndex}
              title={lyrics.title || currentSong?.title}
              artist={lyrics.artist || currentSong?.artist}
            />
          )}
        </div>
      </div>
    </div>
  );
}
