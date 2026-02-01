'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePlayer } from '@/contexts/PlayerContext';

declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: () => void;
  }
}

export function GlobalPlayer() {
  const {
    currentVideoId,
    videoTarget,
    _setPlayerState,
    _setHasPlayedOnce,
    _playerRef,
    _onEnd,
  } = usePlayer();

  const containerRef = useRef<HTMLDivElement>(null);
  const [isAPIReady, setIsAPIReady] = useState(false);
  const currentVideoIdRef = useRef<string | null>(null);
  const hasInitializedRef = useRef(false);

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
  }, []);

  // Initialize player when API ready and we have a video
  useEffect(() => {
    if (!isAPIReady || !containerRef.current || !currentVideoId) return;
    if (hasInitializedRef.current) return;

    hasInitializedRef.current = true;
    currentVideoIdRef.current = currentVideoId;

    const player = new window.YT.Player(containerRef.current, {
      videoId: currentVideoId,
      width: '100%',
      height: '100%',
      playerVars: {
        autoplay: 0,
        controls: 0,
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
        disablekb: 1,
        fs: 0,
        iv_load_policy: 3,
      } as YT.PlayerVars,
      events: {
        onReady: () => {
          _setPlayerState('READY');
        },
        onStateChange: (event) => {
          switch (event.data) {
            case window.YT.PlayerState.PLAYING:
              _setPlayerState('PLAYING');
              _setHasPlayedOnce(true);
              break;
            case window.YT.PlayerState.PAUSED:
              _setPlayerState('PAUSED');
              break;
            case window.YT.PlayerState.ENDED:
              _setPlayerState('ENDED');
              _onEnd();
              break;
            case window.YT.PlayerState.CUED:
            case -1: // UNSTARTED
              _setPlayerState('READY');
              break;
            case window.YT.PlayerState.BUFFERING:
              // Keep current state during buffering
              break;
            default:
              _setPlayerState('LOADING');
          }
        },
      },
    });

    _playerRef.current = player;

    return () => {
      if (_playerRef.current) {
        _playerRef.current.destroy();
        _playerRef.current = null;
        hasInitializedRef.current = false;
      }
    };
  }, [isAPIReady, currentVideoId, _setPlayerState, _setHasPlayedOnce, _playerRef, _onEnd]);

  // Handle video ID changes
  useEffect(() => {
    if (!_playerRef.current || !currentVideoId) return;
    if (currentVideoIdRef.current === currentVideoId) return;

    _setPlayerState('LOADING');
    currentVideoIdRef.current = currentVideoId;

    const player = _playerRef.current as YT.Player & {
      loadVideoById: (videoId: string) => void;
    };
    player.loadVideoById(currentVideoId);
  }, [currentVideoId, _setPlayerState, _playerRef]);

  // Don't render anything if no video selected
  if (!currentVideoId) return null;

  const iframeContainer = (
    <div
      ref={containerRef}
      className="absolute inset-0 [&>iframe]:absolute [&>iframe]:inset-0 [&>iframe]:!w-full [&>iframe]:!h-full"
    />
  );

  // Portal to video target if available, otherwise render hidden
  if (videoTarget) {
    return createPortal(iframeContainer, videoTarget);
  }

  // Hidden container when not on player page (keeps playing)
  return (
    <div className="fixed -top-[9999px] -left-[9999px] w-[640px] h-[360px] pointer-events-none">
      <div className="relative w-full h-full">
        {iframeContainer}
      </div>
    </div>
  );
}
