'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { LyricsPanel } from './LyricsPanel';
import { PlayerControls } from './PlayerControls';
import { PlaylistSidebar } from './PlaylistSidebar';
import { usePlayer } from '@/contexts/PlayerContext';
import { useLyricSync } from '@/hooks/useLyricSync';
import { parseLRC, type ParsedLRC } from '@/lib/lrc-parser';

interface PlayerClientProps {
  initialVideoId: string;
  isExplicitVideoId: boolean;
}

export function PlayerClient({ initialVideoId, isExplicitVideoId }: PlayerClientProps) {
  const {
    playlist,
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

  // Use callback ref to register video container when DOM node is available
  const videoContainerRef = useCallback(
    (node: HTMLDivElement | null) => {
      setVideoTarget(node);
    },
    [setVideoTarget]
  );

  // Track if this is initial mount - URL should take precedence over localStorage
  const isInitialMountRef = useRef(true);

  // Select video from URL on initial mount
  useEffect(() => {
    if (!playlist || !initialVideoId) return;

    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      // Only select the URL's video if:
      // 1. The URL explicitly specified a videoId, OR
      // 2. There's no current video yet (truly initial state)
      const shouldSelectFromUrl = isExplicitVideoId || !currentVideoId;
      if (shouldSelectFromUrl && currentVideoId !== initialVideoId) {
        selectSong(initialVideoId, false);
      }
    }
  }, [playlist, initialVideoId, isExplicitVideoId, currentVideoId, selectSong]);

  // Update URL when song changes
  useEffect(() => {
    if (currentVideoId) {
      window.history.replaceState({}, '', `/player/${currentVideoId}`);
    }
    if (currentSong) {
      document.title = `${currentSong.title} - ${currentSong.artist} | SuperViber`;
    }
  }, [currentVideoId, currentSong]);

  // Lyrics sync
  const { currentLineIndex } = useLyricSync({
    lines: lyrics.lines,
    playerState,
    getCurrentTime,
  });

  // Load lyrics when song changes
  useEffect(() => {
    let cancelled = false;

    async function loadLyrics() {
      setIsLoadingLyrics(true);
      setLyrics({ lines: [] });

      if (!currentSong?.hasLyrics || !currentVideoId) {
        setIsLoadingLyrics(false);
        return;
      }

      try {
        const response = await fetch(`/data/lyrics/${currentVideoId}.lrc`);
        if (cancelled) return;
        if (response.ok) {
          const lrcContent = await response.text();
          if (cancelled) return;
          const parsed = parseLRC(lrcContent);
          setLyrics(parsed);
        }
      } catch (error) {
        if (cancelled) return;
        console.error('Failed to load lyrics:', error);
      } finally {
        if (!cancelled) {
          setIsLoadingLyrics(false);
        }
      }
    }

    loadLyrics();

    return () => {
      cancelled = true;
    };
  }, [currentVideoId, currentSong?.hasLyrics]);

  const handleSelectSong = useCallback((videoId: string) => {
    selectSong(videoId, true);
  }, [selectSong]);

  // Show loading state while playlist loads
  if (!playlist) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-zinc-500">Loading...</div>
      </div>
    );
  }

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
