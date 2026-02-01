'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { usePlayer } from '@/contexts/PlayerContext';

declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: () => void;
  }
}

export function GlobalPlayer() {
  const pathname = usePathname();
  const {
    currentVideoId,
    videoTarget,
    _setPlayerState,
    _setHasPlayedOnce,
    _playerRef,
    _shouldAutoplay,
    _setShouldAutoplay,
    _onEnd,
  } = usePlayer();

  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isAPIReady, setIsAPIReady] = useState(false);
  const currentVideoIdRef = useRef<string | null>(null);
  const hasInitializedRef = useRef(false);
  const pendingAutoplayRef = useRef(false);

  // Use refs for callbacks to avoid recreating player when callbacks change
  const onEndRef = useRef(_onEnd);
  const setPlayerStateRef = useRef(_setPlayerState);
  const setHasPlayedOnceRef = useRef(_setHasPlayedOnce);
  const playerRefLocal = useRef(_playerRef);

  // Keep refs in sync
  onEndRef.current = _onEnd;
  setPlayerStateRef.current = _setPlayerState;
  setHasPlayedOnceRef.current = _setHasPlayedOnce;
  playerRefLocal.current = _playerRef;

  const isPlayerPage = pathname?.startsWith('/player');

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
          setPlayerStateRef.current('READY');
        },
        onStateChange: (event) => {
          switch (event.data) {
            case window.YT.PlayerState.PLAYING:
              setPlayerStateRef.current('PLAYING');
              setHasPlayedOnceRef.current(true);
              break;
            case window.YT.PlayerState.PAUSED:
              setPlayerStateRef.current('PAUSED');
              break;
            case window.YT.PlayerState.ENDED:
              console.log('Song ENDED, calling onEnd');
              setPlayerStateRef.current('ENDED');
              onEndRef.current();
              break;
            case window.YT.PlayerState.CUED:
            case -1: // UNSTARTED
              setPlayerStateRef.current('READY');
              // If we have a pending autoplay, trigger play now
              if (pendingAutoplayRef.current) {
                console.log('Video CUED/UNSTARTED with pending autoplay, calling playVideo');
                pendingAutoplayRef.current = false;
                playerRefLocal.current.current?.playVideo();
              }
              break;
            case window.YT.PlayerState.BUFFERING:
              // Keep current state during buffering
              break;
            default:
              setPlayerStateRef.current('LOADING');
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
  }, [isAPIReady, currentVideoId, _playerRef]); // Removed callback dependencies

  // Handle video ID changes
  useEffect(() => {
    if (!_playerRef.current || !currentVideoId) return;
    if (currentVideoIdRef.current === currentVideoId) return;

    currentVideoIdRef.current = currentVideoId;
    setPlayerStateRef.current('LOADING');

    const player = _playerRef.current as YT.Player & {
      loadVideoById: (videoId: string) => void;
      cueVideoById: (videoId: string) => void;
    };

    // Set pending autoplay flag - we'll trigger play when video is CUED
    // This is more reliable than loadVideoById's auto-play behavior
    if (_shouldAutoplay) {
      console.log('Setting pendingAutoplayRef for', currentVideoId);
      pendingAutoplayRef.current = true;
      _setShouldAutoplay(false);
    }

    // Always use cueVideoById and let the CUED handler trigger play if needed
    player.cueVideoById(currentVideoId);
  }, [currentVideoId, _shouldAutoplay, _playerRef, _setShouldAutoplay]);

  // Position the player wrapper to match the video target
  useEffect(() => {
    if (!wrapperRef.current) return;

    const updatePosition = () => {
      if (!wrapperRef.current) return;

      if (isPlayerPage && videoTarget) {
        const rect = videoTarget.getBoundingClientRect();
        wrapperRef.current.style.position = 'fixed';
        wrapperRef.current.style.top = `${rect.top}px`;
        wrapperRef.current.style.left = `${rect.left}px`;
        wrapperRef.current.style.width = `${rect.width}px`;
        wrapperRef.current.style.height = `${rect.height}px`;
        wrapperRef.current.style.zIndex = '10';
        wrapperRef.current.style.pointerEvents = 'auto';
      } else {
        // Hidden but still playing
        wrapperRef.current.style.position = 'fixed';
        wrapperRef.current.style.top = '-9999px';
        wrapperRef.current.style.left = '-9999px';
        wrapperRef.current.style.width = '640px';
        wrapperRef.current.style.height = '360px';
        wrapperRef.current.style.zIndex = '-1';
        wrapperRef.current.style.pointerEvents = 'none';
      }
    };

    updatePosition();

    // Update on scroll/resize when on player page
    if (isPlayerPage && videoTarget) {
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);

      // Use ResizeObserver to track target size changes
      const resizeObserver = new ResizeObserver(updatePosition);
      resizeObserver.observe(videoTarget);

      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
        resizeObserver.disconnect();
      };
    }
  }, [isPlayerPage, videoTarget]);

  // Don't render anything if no video selected
  if (!currentVideoId) return null;

  return (
    <div
      ref={wrapperRef}
      className="fixed -top-[9999px] -left-[9999px] w-[640px] h-[360px] pointer-events-none"
    >
      <div
        ref={containerRef}
        className="absolute inset-0 [&>iframe]:absolute [&>iframe]:inset-0 [&>iframe]:!w-full [&>iframe]:!h-full"
      />
    </div>
  );
}
