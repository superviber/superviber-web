'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { PlayerState } from '@/lib/types';

declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface UseYouTubePlayerOptions {
  videoId: string;
  autoplay?: boolean;
  onStateChange?: (state: PlayerState) => void;
  onReady?: () => void;
  onEnd?: () => void;
}

export function useYouTubePlayer({
  videoId,
  autoplay = false,
  onStateChange,
  onReady,
  onEnd,
}: UseYouTubePlayerOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YT.Player | null>(null);
  const [isAPIReady, setIsAPIReady] = useState(false);
  const [playerState, setPlayerState] = useState<PlayerState>('LOADING');

  // Use refs for values we need in the effect but don't want as dependencies
  const autoplayRef = useRef(autoplay);
  const onEndRef = useRef(onEnd);
  const onReadyRef = useRef(onReady);
  const onStateChangeRef = useRef(onStateChange);

  // Keep refs in sync
  autoplayRef.current = autoplay;
  onEndRef.current = onEnd;
  onReadyRef.current = onReady;
  onStateChangeRef.current = onStateChange;

  // Load YouTube IFrame API
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      setIsAPIReady(true);
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://www.youtube.com/iframe_api"]'
    );

    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      document.body.appendChild(script);
    }

    window.onYouTubeIframeAPIReady = () => {
      setIsAPIReady(true);
    };

    return () => {
      // Don't remove the script, other components might need it
    };
  }, []);

  // Initialize player when API is ready
  useEffect(() => {
    if (!isAPIReady || !containerRef.current || !videoId) return;

    // Set to loading state during transition
    setPlayerState('LOADING');

    // Destroy existing player if any
    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
    }

    const player = new window.YT.Player(containerRef.current, {
      videoId,
      width: '100%',
      height: '100%',
      playerVars: {
        autoplay: autoplayRef.current ? 1 : 0,
        controls: 0,
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
        disablekb: 1,
        fs: 0,
        iv_load_policy: 3,
      },
      events: {
        onReady: () => {
          setPlayerState('READY');
          onReadyRef.current?.();
        },
        onStateChange: (event) => {
          let newState: PlayerState;
          switch (event.data) {
            case window.YT.PlayerState.PLAYING:
              newState = 'PLAYING';
              break;
            case window.YT.PlayerState.PAUSED:
              newState = 'PAUSED';
              break;
            case window.YT.PlayerState.ENDED:
              newState = 'ENDED';
              onEndRef.current?.();
              break;
            case window.YT.PlayerState.BUFFERING:
              // Keep current state during buffering
              return;
            default:
              newState = 'LOADING';
          }
          setPlayerState(newState);
          onStateChangeRef.current?.(newState);
        },
      },
    });

    playerRef.current = player;

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [isAPIReady, videoId]); // Only recreate player when videoId changes

  const getCurrentTime = useCallback((): number => {
    // Check if player exists and has getCurrentTime method (player might be in transition)
    if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
      return playerRef.current.getCurrentTime();
    }
    return 0;
  }, []);

  const play = useCallback(() => {
    playerRef.current?.playVideo();
  }, []);

  const pause = useCallback(() => {
    playerRef.current?.pauseVideo();
  }, []);

  const seekTo = useCallback((seconds: number) => {
    playerRef.current?.seekTo(seconds, true);
  }, []);

  const getDuration = useCallback((): number => {
    if (playerRef.current && typeof playerRef.current.getDuration === 'function') {
      return playerRef.current.getDuration();
    }
    return 0;
  }, []);

  return {
    containerRef,
    playerState,
    getCurrentTime,
    getDuration,
    play,
    pause,
    seekTo,
    isReady: playerState !== 'LOADING',
  };
}
