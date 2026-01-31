'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface Song {
  videoId: string;
  title: string;
  artist: string;
  hasLyrics: boolean;
}

interface LyricLine {
  time: number | null;
  text: string;
}

declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: () => void;
  }
}

export function LyricsEditor() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [lines, setLines] = useState<LyricLine[]>([]);
  const [plainText, setPlainText] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fetchStatus, setFetchStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<'edit' | 'sync'>('edit');

  const playerRef = useRef<YT.Player | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeUpdateRef = useRef<number | null>(null);

  // Load songs on mount
  useEffect(() => {
    loadSongs();
  }, []);

  // Load YouTube API
  useEffect(() => {
    if (!selectedSong) return;

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScript = document.getElementsByTagName('script')[0];
      firstScript.parentNode?.insertBefore(tag, firstScript);

      window.onYouTubeIframeAPIReady = () => initPlayer(selectedSong.videoId);
    } else {
      initPlayer(selectedSong.videoId);
    }

    return () => {
      if (timeUpdateRef.current) {
        cancelAnimationFrame(timeUpdateRef.current);
      }
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [selectedSong?.videoId]);

  function initPlayer(videoId: string) {
    if (playerRef.current) {
      playerRef.current.destroy();
    }

    playerRef.current = new window.YT.Player('yt-player', {
      videoId,
      height: '100%',
      width: '100%',
      playerVars: {
        autoplay: 0,
        controls: 1,
        modestbranding: 1,
        rel: 0,
      },
      events: {
        onStateChange: (e) => {
          setIsPlaying(e.data === window.YT.PlayerState.PLAYING);
          if (e.data === window.YT.PlayerState.PLAYING) {
            updateTime();
          }
        },
      },
    });
  }

  function updateTime() {
    if (playerRef.current?.getCurrentTime) {
      setCurrentTime(playerRef.current.getCurrentTime());
    }
    if (isPlaying) {
      timeUpdateRef.current = requestAnimationFrame(updateTime);
    }
  }

  useEffect(() => {
    if (isPlaying) {
      updateTime();
    }
    return () => {
      if (timeUpdateRef.current) {
        cancelAnimationFrame(timeUpdateRef.current);
      }
    };
  }, [isPlaying]);

  async function loadSongs() {
    try {
      const res = await fetch('/data/songs.json');
      if (res.ok) {
        const data = await res.json();
        setSongs(data.songs || []);
      }
    } catch (err) {
      console.error('Failed to load songs:', err);
    }
  }

  async function selectSong(song: Song) {
    setSelectedSong(song);
    setLines([]);
    setPlainText('');
    setMode('edit');

    // Try to load existing LRC
    try {
      const res = await fetch(`/data/lyrics/${song.videoId}.lrc`);
      if (res.ok) {
        const lrc = await res.text();
        parseLrc(lrc);
      }
    } catch (err) {
      // No existing lyrics
    }
  }

  function parseLrc(lrc: string) {
    const parsed: LyricLine[] = [];
    // Match various LRC timestamp formats:
    // [mm:ss.xx], [mm:ss:xx], [mm:ss], [m:ss.xx]
    const lineRegex = /^\[(\d{1,2}):(\d{2})(?:[.:](\d{2,3}))?\]\s*(.*)$/;

    for (const line of lrc.split('\n')) {
      const match = line.match(lineRegex);
      if (match) {
        const mins = parseInt(match[1]);
        const secs = parseInt(match[2]);
        const ms = match[3] ? parseInt(match[3].padEnd(3, '0')) : 0;
        const time = mins * 60 + secs + ms / 1000;
        parsed.push({ time, text: match[4] });
      } else if (line.trim() && !line.startsWith('[')) {
        // Non-timestamped lines (plain text)
        parsed.push({ time: null, text: line.trim() });
      }
    }

    setLines(parsed);
    setPlainText(parsed.map(l => l.text).join('\n'));
  }

  function parseTextToLines(text: string) {
    const newLines = text.split('\n').map(line => ({
      time: null,
      text: line.trim(),
    }));
    setLines(newLines);
  }

  async function fetchLyrics() {
    if (!selectedSong) return;

    setFetchStatus('Searching LRCLIB...');

    try {
      // Try LRCLIB first
      const lrclibRes = await fetch(
        `https://lrclib.net/api/get?artist_name=${encodeURIComponent(selectedSong.artist)}&track_name=${encodeURIComponent(selectedSong.title)}`
      );

      if (lrclibRes.ok) {
        const data = await lrclibRes.json();
        if (data.syncedLyrics) {
          parseLrc(data.syncedLyrics);
          setFetchStatus('✓ Found synced lyrics (LRCLIB)');
          return;
        } else if (data.plainLyrics) {
          setPlainText(data.plainLyrics);
          parseTextToLines(data.plainLyrics);
          setFetchStatus('Found plain lyrics (LRCLIB) - needs timing');
          return;
        }
      }

      // Try lyrics.ovh
      setFetchStatus('Searching Lyrics.ovh...');
      const ovhRes = await fetch(
        `https://api.lyrics.ovh/v1/${encodeURIComponent(selectedSong.artist)}/${encodeURIComponent(selectedSong.title)}`
      );

      if (ovhRes.ok) {
        const data = await ovhRes.json();
        if (data.lyrics) {
          setPlainText(data.lyrics);
          parseTextToLines(data.lyrics);
          setFetchStatus('Found lyrics (Lyrics.ovh) - needs timing');
          return;
        }
      }

      setFetchStatus('No lyrics found - paste manually');
    } catch (err) {
      setFetchStatus('Fetch failed - paste manually');
    }
  }

  function markTimestamp(index: number) {
    if (!playerRef.current?.getCurrentTime) return;

    const time = playerRef.current.getCurrentTime();
    setLines(prev =>
      prev.map((line, i) => (i === index ? { ...line, time } : line))
    );
  }

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  }

  function generateLrc(): string {
    if (!selectedSong) return '';

    let lrc = `[ti:${selectedSong.title}]\n[ar:${selectedSong.artist}]\n\n`;

    for (const line of lines) {
      if (line.time !== null) {
        lrc += `[${formatTime(line.time)}] ${line.text}\n`;
      }
    }

    return lrc;
  }

  async function saveLyrics() {
    if (!selectedSong) return;

    setSaving(true);

    try {
      const lrc = generateLrc();
      const res = await fetch('/api/admin/save-lyrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId: selectedSong.videoId,
          lrc,
        }),
      });

      if (!res.ok) throw new Error('Save failed');

      // Update songs.json hasLyrics
      await fetch('/api/admin/update-song-lyrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId: selectedSong.videoId,
          hasLyrics: true,
        }),
      });

      // Update local state
      setSelectedSong({ ...selectedSong, hasLyrics: true });
      setSongs(prev =>
        prev.map(s =>
          s.videoId === selectedSong.videoId ? { ...s, hasLyrics: true } : s
        )
      );

      setFetchStatus('✓ Saved');
    } catch (err) {
      setFetchStatus('Save failed');
    } finally {
      setSaving(false);
    }
  }

  const timedCount = lines.filter(l => l.time !== null).length;

  return (
    <div className="flex gap-6 h-[calc(100vh-180px)]">
      {/* Song List */}
      <div className="w-64 flex-shrink-0 bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-zinc-800">
          <h2 className="font-medium">Songs</h2>
          <p className="text-xs text-zinc-500 mt-1">
            {songs.filter(s => s.hasLyrics).length}/{songs.length} have lyrics
          </p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {songs.map(song => (
            <button
              key={song.videoId}
              onClick={() => selectSong(song)}
              className={`w-full text-left px-4 py-3 border-b border-zinc-800/50 transition-colors ${
                selectedSong?.videoId === song.videoId
                  ? 'bg-violet-600/20'
                  : 'hover:bg-zinc-800/50'
              }`}
            >
              <div className="text-sm truncate">{song.title}</div>
              <div className="text-xs text-zinc-500 truncate flex items-center gap-2">
                {song.artist}
                {song.hasLyrics && <span className="text-green-400">✓</span>}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Editor Area */}
      {selectedSong ? (
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {/* Video Player */}
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
            <div className="aspect-video bg-black" ref={containerRef}>
              <div id="yt-player" className="w-full h-full" />
            </div>
            <div className="px-4 py-3 border-t border-zinc-800 flex items-center justify-between">
              <div>
                <div className="font-medium">{selectedSong.title}</div>
                <div className="text-sm text-zinc-500">{selectedSong.artist}</div>
              </div>
              <div className="text-sm font-mono text-zinc-400">
                {formatTime(currentTime)}
              </div>
            </div>
          </div>

          {/* Lyrics Editor */}
          <div className="flex-1 bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden flex flex-col">
            {/* Toolbar */}
            <div className="px-4 py-3 border-b border-zinc-800 flex items-center gap-3">
              <div className="flex gap-1">
                <button
                  onClick={() => setMode('edit')}
                  className={`px-3 py-1 text-xs rounded ${
                    mode === 'edit' ? 'bg-zinc-700' : 'bg-zinc-800 hover:bg-zinc-700'
                  }`}
                >
                  Edit Text
                </button>
                <button
                  onClick={() => {
                    // Only parse plainText if we don't already have lines with timestamps
                    if (mode === 'edit' && !lines.some(l => l.time !== null)) {
                      parseTextToLines(plainText);
                    }
                    setMode('sync');
                  }}
                  className={`px-3 py-1 text-xs rounded ${
                    mode === 'sync' ? 'bg-zinc-700' : 'bg-zinc-800 hover:bg-zinc-700'
                  }`}
                >
                  Sync Timing
                </button>
              </div>

              <div className="flex-1" />

              <button
                onClick={fetchLyrics}
                className="px-3 py-1 text-xs bg-zinc-800 hover:bg-zinc-700 rounded"
              >
                Fetch Lyrics
              </button>

              {mode === 'sync' && (
                <div className="text-xs text-zinc-500">
                  {timedCount}/{lines.length} timed
                </div>
              )}

              <button
                onClick={saveLyrics}
                disabled={saving || timedCount === 0}
                className="px-4 py-1 text-xs bg-green-600 hover:bg-green-500 disabled:bg-zinc-700 disabled:text-zinc-500 rounded"
              >
                {saving ? 'Saving...' : 'Save LRC'}
              </button>
            </div>

            {fetchStatus && (
              <div className="px-4 py-2 bg-zinc-800/50 text-xs text-zinc-400">
                {fetchStatus}
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {mode === 'edit' ? (
                <textarea
                  value={plainText}
                  onChange={e => setPlainText(e.target.value)}
                  placeholder="Paste lyrics here, one line per row..."
                  className="w-full h-full bg-transparent resize-none focus:outline-none text-sm font-mono"
                />
              ) : (
                <div className="space-y-1">
                  {lines.map((line, i) => (
                    <button
                      key={i}
                      onClick={() => markTimestamp(i)}
                      className={`w-full text-left px-3 py-2 rounded transition-colors flex items-center gap-3 ${
                        line.time !== null
                          ? 'bg-green-600/10 hover:bg-green-600/20'
                          : 'bg-zinc-800/50 hover:bg-zinc-800'
                      }`}
                    >
                      <span className="text-xs font-mono w-16 text-zinc-500">
                        {line.time !== null ? formatTime(line.time) : '--:--.--'}
                      </span>
                      <span className="text-sm">{line.text || '♪'}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-zinc-500">
          Select a song to edit lyrics
        </div>
      )}
    </div>
  );
}
