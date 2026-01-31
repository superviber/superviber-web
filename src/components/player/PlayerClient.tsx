'use client';

import { useState, useEffect, useCallback } from 'react';
import { VideoPlayer } from './VideoPlayer';
import { LyricsPanel } from './LyricsPanel';
import { PlayerControls } from './PlayerControls';
import { useYouTubePlayer } from '@/hooks/useYouTubePlayer';
import { useLyricSync } from '@/hooks/useLyricSync';
import { parseLRC, type ParsedLRC } from '@/lib/lrc-parser';
import type { Playlist } from '@/lib/types';

interface PlayerClientProps {
  playlist: Playlist;
  initialVideoId: string;
}

export function PlayerClient({ playlist, initialVideoId }: PlayerClientProps) {
  const [currentVideoId, setCurrentVideoId] = useState(initialVideoId);
  const [lyrics, setLyrics] = useState<ParsedLRC>({ lines: [] });
  const [isLoadingLyrics, setIsLoadingLyrics] = useState(true);
  const [shouldAutoplay, setShouldAutoplay] = useState(false);

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
        {/* Video + Controls section */}
        <div
          className="flex-shrink-0 flex flex-col lg:self-start"
          style={{ contain: 'layout' }}
        >
          {/* Video player */}
          <div className="w-full lg:w-[560px] xl:w-[640px] lg:p-6 lg:pb-0">
            <VideoPlayer ref={containerRef} />
          </div>

          {/* Player controls - below video */}
          <div className="lg:px-6 lg:pb-6">
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
        </div>

        {/* Lyrics section */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden border-t lg:border-t-0 lg:border-l border-white/10">
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
