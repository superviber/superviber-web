'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { VideoPlayer } from './VideoPlayer';
import { LyricsPanel } from './LyricsPanel';
import { PlayerControls } from './PlayerControls';
import { PlaylistSidebar } from './PlaylistSidebar';
import { useYouTubePlayer } from '@/hooks/useYouTubePlayer';
import { useLyricSync } from '@/hooks/useLyricSync';
import { parseLRC, type ParsedLRC } from '@/lib/lrc-parser';
import type { Playlist } from '@/lib/types';

const STORAGE_KEY = 'superviber-player-state';

interface SavedPlayerState {
  videoId: string;
  time: number;
  timestamp: number;
}

function getSavedState(): SavedPlayerState | null {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    const state = JSON.parse(saved) as SavedPlayerState;
    // Only restore if saved within last 24 hours
    if (Date.now() - state.timestamp > 24 * 60 * 60 * 1000) return null;
    return state;
  } catch {
    return null;
  }
}

function saveState(videoId: string, time: number) {
  if (typeof window === 'undefined') return;
  try {
    const state: SavedPlayerState = { videoId, time, timestamp: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage errors
  }
}

interface PlayerClientProps {
  playlist: Playlist;
  initialVideoId: string;
}

export function PlayerClient({ playlist, initialVideoId }: PlayerClientProps) {
  // Check for saved state on mount (only if no specific video in URL)
  const savedState = useRef(getSavedState());
  const isDefaultVideo = initialVideoId === playlist.songs[0]?.videoId;
  const shouldRestore = isDefaultVideo && savedState.current &&
    playlist.songs.some(s => s.videoId === savedState.current?.videoId);

  const [currentVideoId, setCurrentVideoId] = useState(
    shouldRestore ? savedState.current!.videoId : initialVideoId
  );
  const [lyrics, setLyrics] = useState<ParsedLRC>({ lines: [] });
  const [isLoadingLyrics, setIsLoadingLyrics] = useState(true);
  const [shouldAutoplay, setShouldAutoplay] = useState(false);
  const [pendingSeek, setPendingSeek] = useState<number | null>(
    shouldRestore && savedState.current!.time > 0 ? savedState.current!.time : null
  );
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const saveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update URL if we restored from saved state
  useEffect(() => {
    if (shouldRestore && currentVideoId !== initialVideoId) {
      window.history.replaceState({}, '', `/player/${currentVideoId}`);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const currentSong = playlist.songs.find((s) => s.videoId === currentVideoId);
  const currentIndex = playlist.songs.findIndex(
    (s) => s.videoId === currentVideoId
  );

  // Navigate to next song (autoplay if triggered by song end)
  const goToNext = useCallback(
    (autoplay = false) => {
      const nextIndex = (currentIndex + 1) % playlist.songs.length;
      const nextSong = playlist.songs[nextIndex];
      setShouldAutoplay(autoplay);
      setCurrentVideoId(nextSong.videoId);
      window.history.pushState({}, '', `/player/${nextSong.videoId}`);
    },
    [currentIndex, playlist.songs]
  );

  // Navigate to previous song
  const goToPrevious = useCallback(() => {
    const prevIndex =
      (currentIndex - 1 + playlist.songs.length) % playlist.songs.length;
    const prevSong = playlist.songs[prevIndex];
    setShouldAutoplay(false);
    setCurrentVideoId(prevSong.videoId);
    window.history.pushState({}, '', `/player/${prevSong.videoId}`);
  }, [currentIndex, playlist.songs]);

  // Select specific song from playlist
  const selectSong = useCallback((videoId: string) => {
    if (videoId === currentVideoId) return;
    setShouldAutoplay(false);
    setCurrentVideoId(videoId);
    window.history.pushState({}, '', `/player/${videoId}`);
  }, [currentVideoId]);

  // YouTube player
  const {
    containerRef,
    playerState,
    getCurrentTime,
    getDuration,
    play,
    pause,
    seekTo,
    hasPlayedOnce,
  } = useYouTubePlayer({
    videoId: currentVideoId,
    autoplay: shouldAutoplay,
    onEnd: () => goToNext(true),
  });

  // Lyrics sync
  const { currentLineIndex } = useLyricSync({
    lines: lyrics.lines,
    playerState,
    getCurrentTime,
  });

  // Save state when navigating away
  useEffect(() => {
    const handleBeforeUnload = () => {
      const time = getCurrentTime();
      if (time > 0) {
        saveState(currentVideoId, time);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentVideoId, getCurrentTime]);

  // Seek to saved position when player becomes ready
  useEffect(() => {
    if (pendingSeek === null) return;
    if (playerState !== 'READY' && playerState !== 'PAUSED' && playerState !== 'PLAYING') return;

    // Poll for duration to become available, then seek
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds max

    const trySeek = () => {
      const duration = getDuration();
      if (duration > 0 && pendingSeek < duration) {
        seekTo(pendingSeek);
        setPendingSeek(null);
        return true;
      }
      return false;
    };

    // Try immediately
    if (trySeek()) return;

    // Poll until duration is available
    const interval = setInterval(() => {
      attempts++;
      if (trySeek() || attempts >= maxAttempts) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [playerState, pendingSeek, seekTo, getDuration]);

  // Save player state periodically while playing
  useEffect(() => {
    if (playerState === 'PLAYING') {
      // Save immediately when starting to play
      saveState(currentVideoId, getCurrentTime());

      // Then save every 5 seconds
      saveIntervalRef.current = setInterval(() => {
        saveState(currentVideoId, getCurrentTime());
      }, 5000);
    } else {
      // Save current position when pausing
      if (playerState === 'PAUSED' && hasPlayedOnce) {
        saveState(currentVideoId, getCurrentTime());
      }

      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
        saveIntervalRef.current = null;
      }
    }

    return () => {
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
      }
    };
  }, [playerState, currentVideoId, getCurrentTime, hasPlayedOnce]);

  // Load lyrics when song changes
  useEffect(() => {
    async function loadLyrics() {
      setIsLoadingLyrics(true);
      setLyrics({ lines: [] });

      if (!currentSong?.hasLyrics) {
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

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-black">
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
            <VideoPlayer ref={containerRef} />
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
                currentVideoId={currentVideoId}
                onSelectSong={selectSong}
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
          <div className="lg:hidden">
            <PlaylistSidebar
              songs={playlist.songs}
              currentVideoId={currentVideoId}
              onSelectSong={selectSong}
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
