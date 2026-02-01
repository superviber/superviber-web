'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
} from 'react';
import type { Playlist, Song, PlayerState } from '@/lib/types';

const STORAGE_KEY = 'superviber-player-state';

interface SavedPlayerState {
  videoId: string;
  time: number;
  timestamp: number;
}

interface PlayerContextValue {
  // Playlist state
  playlist: Playlist | null;
  setPlaylist: (playlist: Playlist) => void;
  currentVideoId: string | null;
  currentSong: Song | null;
  currentIndex: number;

  // Player state
  playerState: PlayerState;
  hasPlayedOnce: boolean;
  hasActivePlayer: boolean;

  // Time functions
  getCurrentTime: () => number;
  getDuration: () => number;

  // Controls
  play: () => void;
  pause: () => void;
  seekTo: (time: number) => void;
  selectSong: (videoId: string, autoplay?: boolean) => void;
  goToNext: (autoplay?: boolean) => void;
  goToPrevious: () => void;

  // Portal target for video
  videoTarget: HTMLDivElement | null;
  setVideoTarget: (target: HTMLDivElement | null) => void;

  // Internal - used by GlobalPlayer
  _setPlayerState: (state: PlayerState) => void;
  _setHasPlayedOnce: (value: boolean) => void;
  _playerRef: React.MutableRefObject<YT.Player | null>;
  _shouldAutoplay: boolean;
  _setShouldAutoplay: (value: boolean) => void;
  _onEnd: () => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}

export function usePlayerOptional() {
  return useContext(PlayerContext);
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

interface PlayerProviderProps {
  children: ReactNode;
}

export function PlayerProvider({ children }: PlayerProviderProps) {
  const [playlist, setPlaylistState] = useState<Playlist | null>(null);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [playerState, setPlayerState] = useState<PlayerState>('LOADING');
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const [videoTarget, setVideoTarget] = useState<HTMLDivElement | null>(null);

  const playerRef = useRef<YT.Player | null>(null);
  const saveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pendingSeekRef = useRef<number | null>(null);

  // Computed values
  const currentSong = playlist?.songs.find((s) => s.videoId === currentVideoId) || null;
  const currentIndex = playlist?.songs.findIndex((s) => s.videoId === currentVideoId) ?? -1;
  const hasActivePlayer = currentVideoId !== null && playlist !== null;

  // Set playlist and optionally restore saved state
  const setPlaylist = useCallback((newPlaylist: Playlist) => {
    setPlaylistState(newPlaylist);

    // If no current video, try to restore from saved state or use first song
    if (!currentVideoId && newPlaylist.songs.length > 0) {
      const saved = getSavedState();
      if (saved && newPlaylist.songs.some((s) => s.videoId === saved.videoId)) {
        setCurrentVideoId(saved.videoId);
        pendingSeekRef.current = saved.time;
      } else {
        // Default to first song (cued, not autoplaying)
        setCurrentVideoId(newPlaylist.songs[0].videoId);
      }
    }
  }, [currentVideoId]);

  // Time functions
  const getCurrentTime = useCallback((): number => {
    if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
      return playerRef.current.getCurrentTime();
    }
    return 0;
  }, []);

  const getDuration = useCallback((): number => {
    if (playerRef.current && typeof playerRef.current.getDuration === 'function') {
      return playerRef.current.getDuration();
    }
    return 0;
  }, []);

  // Controls
  const play = useCallback(() => {
    if (!playerRef.current) return;
    playerRef.current.playVideo();
  }, []);

  const pause = useCallback(() => {
    playerRef.current?.pauseVideo();
  }, []);

  const seekTo = useCallback((seconds: number) => {
    playerRef.current?.seekTo(seconds, true);
  }, []);

  // Track whether next song should autoplay (use state for proper batching)
  const [shouldAutoplay, setShouldAutoplay] = useState(false);

  const selectSong = useCallback((videoId: string, autoplay = true) => {
    if (videoId === currentVideoId) return;
    setShouldAutoplay(autoplay);
    setCurrentVideoId(videoId);
    setHasPlayedOnce(false);
  }, [currentVideoId]);

  const goToNext = useCallback((autoplay = true) => {
    if (!playlist || playlist.songs.length === 0) return;
    const nextIndex = (currentIndex + 1) % playlist.songs.length;
    const nextSong = playlist.songs[nextIndex];
    selectSong(nextSong.videoId, autoplay);
  }, [playlist, currentIndex, selectSong]);

  const goToPrevious = useCallback(() => {
    if (!playlist || playlist.songs.length === 0) return;
    const prevIndex = (currentIndex - 1 + playlist.songs.length) % playlist.songs.length;
    const prevSong = playlist.songs[prevIndex];
    selectSong(prevSong.videoId, false);
  }, [playlist, currentIndex, selectSong]);

  const _onEnd = useCallback(() => {
    goToNext(true);
  }, [goToNext]);

  // Handle pending seek after player ready
  useEffect(() => {
    if (pendingSeekRef.current === null) return;
    if (playerState !== 'READY' && playerState !== 'PAUSED' && playerState !== 'PLAYING') return;

    const pendingSeek = pendingSeekRef.current;
    let attempts = 0;
    const maxAttempts = 50;

    const trySeek = () => {
      const duration = getDuration();
      if (duration > 0 && pendingSeek < duration) {
        seekTo(pendingSeek);
        pendingSeekRef.current = null;
        return true;
      }
      return false;
    };

    if (trySeek()) return;

    const interval = setInterval(() => {
      attempts++;
      if (trySeek() || attempts >= maxAttempts) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [playerState, getDuration, seekTo]);

  // Save state periodically while playing
  useEffect(() => {
    if (!currentVideoId) return;

    if (playerState === 'PLAYING') {
      saveState(currentVideoId, getCurrentTime());
      saveIntervalRef.current = setInterval(() => {
        saveState(currentVideoId, getCurrentTime());
      }, 5000);
    } else {
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

  // Save state on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentVideoId) {
        const time = getCurrentTime();
        if (time > 0) {
          saveState(currentVideoId, time);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentVideoId, getCurrentTime]);

  const value: PlayerContextValue = {
    playlist,
    setPlaylist,
    currentVideoId,
    currentSong,
    currentIndex,
    playerState,
    hasPlayedOnce,
    hasActivePlayer,
    getCurrentTime,
    getDuration,
    play,
    pause,
    seekTo,
    selectSong,
    goToNext,
    goToPrevious,
    videoTarget,
    setVideoTarget,
    _setPlayerState: setPlayerState,
    _setHasPlayedOnce: setHasPlayedOnce,
    _playerRef: playerRef,
    _shouldAutoplay: shouldAutoplay,
    _setShouldAutoplay: setShouldAutoplay,
    _onEnd,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
}
