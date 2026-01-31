'use client';

import { useState, useEffect, useRef } from 'react';

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
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error' | null>(null);
  const [mode, setMode] = useState<'edit' | 'sync'>('sync'); // Start in sync mode
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');
  const [plainTextDirty, setPlainTextDirty] = useState(false); // Track if user edited text
  const [lrcTitle, setLrcTitle] = useState('');
  const [lrcArtist, setLrcArtist] = useState('');

  const playerRef = useRef<YT.Player | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeUpdateRef = useRef<number | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoadRef = useRef(true);

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

  // Auto-save effect - debounced save when lines change
  useEffect(() => {
    // Skip initial load
    if (isInitialLoadRef.current) {
      return;
    }

    // Only save if we have a song selected and at least one timed line
    if (!selectedSong || lines.length === 0) {
      return;
    }

    const timedLines = lines.filter(l => l.time !== null);
    if (timedLines.length === 0) {
      return;
    }

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Debounce save by 500ms
    saveTimeoutRef.current = setTimeout(() => {
      autoSave();
    }, 500);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [lines, selectedSong, lrcTitle, lrcArtist]);

  async function autoSave() {
    if (!selectedSong) return;

    const timedLines = lines.filter(l => l.time !== null);
    if (timedLines.length === 0) return;

    setSaveStatus('saving');

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

      // Update local state with new title/artist
      const updatedSong = {
        ...selectedSong,
        title: lrcTitle,
        artist: lrcArtist,
        hasLyrics: true,
      };
      setSelectedSong(updatedSong);
      setSongs(prev =>
        prev.map(s =>
          s.videoId === selectedSong.videoId ? updatedSong : s
        )
      );

      // Update songs.json hasLyrics if not already set
      if (!selectedSong.hasLyrics) {
        await fetch('/api/admin/update-song-lyrics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            videoId: selectedSong.videoId,
            hasLyrics: true,
          }),
        });
      }

      setSaveStatus('saved');
      // Clear status after 2 seconds
      setTimeout(() => setSaveStatus(null), 2000);
    } catch (err) {
      setSaveStatus('error');
    }
  }

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
    isInitialLoadRef.current = true; // Mark as loading
    setSelectedSong(song);
    setLines([]);
    setPlainText('');
    setPlainTextDirty(false);
    setMode('sync'); // Start in sync mode to show timestamps
    setSaveStatus(null);
    setLrcTitle(song.title);
    setLrcArtist(song.artist);

    // Try to load existing LRC
    try {
      const res = await fetch(`/data/lyrics/${song.videoId}.lrc`);
      if (res.ok) {
        const lrc = await res.text();
        parseLrc(lrc, song);
      }
    } catch (err) {
      // No existing lyrics
    }

    // Allow auto-save after initial load completes
    setTimeout(() => {
      isInitialLoadRef.current = false;
    }, 100);
  }

  function parseLrc(lrc: string, song: Song) {
    const parsed: LyricLine[] = [];
    // Match various LRC timestamp formats:
    // [mm:ss.xx], [mm:ss:xx], [mm:ss], [m:ss.xx]
    const lineRegex = /^\[(\d{1,2}):(\d{2})(?:[.:](\d{2,3}))?\]\s*(.*)$/;
    // Match metadata tags like [ti:Title] and [ar:Artist]
    const titleRegex = /^\[ti:(.+)\]$/i;
    const artistRegex = /^\[ar:(.+)\]$/i;

    let foundTitle = song.title;
    let foundArtist = song.artist;

    for (const line of lrc.split('\n')) {
      const titleMatch = line.match(titleRegex);
      if (titleMatch) {
        foundTitle = titleMatch[1].trim();
        continue;
      }
      const artistMatch = line.match(artistRegex);
      if (artistMatch) {
        foundArtist = artistMatch[1].trim();
        continue;
      }

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

    // Update title/artist state
    setLrcTitle(foundTitle);
    setLrcArtist(foundArtist);

    // Update songs list to reflect LRC metadata
    const updatedSong = { ...song, title: foundTitle, artist: foundArtist };
    setSelectedSong(updatedSong);
    setSongs(prev =>
      prev.map(s => s.videoId === song.videoId ? updatedSong : s)
    );

    const sorted = sortLinesByTime(parsed);
    setLines(sorted);
    setPlainText(sorted.map(l => l.text).join('\n'));
    setPlainTextDirty(false);
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
          parseLrc(data.syncedLyrics, selectedSong);
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
    const updated = lines.map((line, i) => (i === index ? { ...line, time } : line));
    const sorted = sortLinesByTime(updated);
    setLines(sorted);
    setPlainText(sorted.map(l => l.text).join('\n'));
  }

  function sortLinesByTime(linesToSort: LyricLine[]): LyricLine[] {
    // Separate timed and untimed lines
    const timed = linesToSort.filter(l => l.time !== null);
    const untimed = linesToSort.filter(l => l.time === null);

    // Sort timed lines by timestamp
    timed.sort((a, b) => a.time! - b.time!);

    // Append untimed lines at the end
    return [...timed, ...untimed];
  }

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  }

  function generateLrc(): string {
    if (!selectedSong) return '';

    let lrc = `[ti:${lrcTitle}]\n[ar:${lrcArtist}]\n\n`;

    for (const line of lines) {
      if (line.time !== null) {
        lrc += `[${formatTime(line.time)}] ${line.text}\n`;
      }
    }

    return lrc;
  }


  function deleteLine(index: number) {
    const newLines = lines.filter((_, i) => i !== index);
    setLines(newLines);
    setPlainText(newLines.map(l => l.text).join('\n'));
  }

  function splitLine(index: number) {
    // Insert a new empty line after the current one
    const newLines = [...lines];
    const currentLine = newLines[index];
    newLines.splice(index + 1, 0, { time: null, text: '' });
    setLines(newLines);
    setPlainText(newLines.map(l => l.text).join('\n'));
  }

  function updateLineText(index: number, text: string) {
    const newLines = [...lines];
    newLines[index] = { ...newLines[index], text };
    setLines(newLines);
    setPlainText(newLines.map(l => l.text).join('\n'));
  }

  function saveEdit() {
    if (editingIndex !== null) {
      const textLines = editingText.split('\n').map(t => t.trim());

      if (textLines.length === 1) {
        // Single line - just update
        updateLineText(editingIndex, textLines[0]);
      } else {
        // Multiple lines - replace current line and insert new ones
        const newLines = [...lines];
        const currentTime = newLines[editingIndex].time;

        // Replace the current line with first text line
        newLines[editingIndex] = { time: currentTime, text: textLines[0] };

        // Insert remaining lines after
        for (let i = 1; i < textLines.length; i++) {
          newLines.splice(editingIndex + i, 0, { time: null, text: textLines[i] });
        }

        setLines(newLines);
        setPlainText(newLines.map(l => l.text).join('\n'));
      }

      setEditingIndex(null);
      setEditingText('');
    }
  }

  const timedCount = lines.filter(l => l.time !== null).length;

  // Find the current line based on playback time
  const currentLineIndex = (() => {
    if (!isPlaying && currentTime === 0) return -1;
    let lastIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].time !== null && lines[i].time! <= currentTime) {
        lastIndex = i;
      }
    }
    return lastIndex;
  })();

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
            <div className="px-4 py-3 border-t border-zinc-800 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={lrcTitle}
                  onChange={e => setLrcTitle(e.target.value)}
                  className="w-full bg-transparent font-medium focus:outline-none focus:bg-zinc-800 px-1 -mx-1 rounded"
                  placeholder="Title"
                />
                <input
                  type="text"
                  value={lrcArtist}
                  onChange={e => setLrcArtist(e.target.value)}
                  className="w-full bg-transparent text-sm text-zinc-500 focus:outline-none focus:bg-zinc-800 focus:text-zinc-300 px-1 -mx-1 rounded"
                  placeholder="Artist"
                />
              </div>
              <div className="text-sm font-mono text-zinc-400 flex-shrink-0">
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
                    // Only re-parse if user actually edited the text
                    if (mode === 'edit' && plainTextDirty) {
                      // Merge edited text with existing timestamps
                      // Build a map of text -> list of timestamps (to handle duplicates)
                      const timestampMap = new Map<string, number[]>();
                      lines.forEach(l => {
                        if (l.time !== null && l.text) {
                          const existing = timestampMap.get(l.text) || [];
                          existing.push(l.time);
                          timestampMap.set(l.text, existing);
                        }
                      });

                      // Parse plainText and preserve timestamps for matching lines
                      const usedTimestamps = new Map<string, number>();
                      const newLines = plainText.split('\n').map(text => {
                        const trimmed = text.trim();
                        const timestamps = timestampMap.get(trimmed);
                        let time: number | null = null;
                        if (timestamps && timestamps.length > 0) {
                          const usedCount = usedTimestamps.get(trimmed) || 0;
                          if (usedCount < timestamps.length) {
                            time = timestamps[usedCount];
                            usedTimestamps.set(trimmed, usedCount + 1);
                          }
                        }
                        return { time, text: trimmed };
                      });

                      setLines(newLines);
                      setPlainTextDirty(false);
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
                <>
                  <button
                    onClick={() => {
                      if (!playerRef.current?.getCurrentTime) return;
                      const currentTime = playerRef.current.getCurrentTime();

                      // Find the right position to insert (sorted by time)
                      let insertIndex = 0;
                      for (let i = 0; i < lines.length; i++) {
                        if (lines[i].time !== null && lines[i].time! <= currentTime) {
                          insertIndex = i + 1;
                        }
                      }

                      const newLines = [...lines];
                      newLines.splice(insertIndex, 0, { time: currentTime, text: '' });
                      setLines(newLines);
                      setPlainText(newLines.map(l => l.text).join('\n'));
                    }}
                    className="px-2 py-1 text-xs bg-zinc-800 hover:bg-zinc-700 rounded"
                    title="Add instrumental break at current time"
                  >
                    + ♪
                  </button>
                  <div className="text-xs text-zinc-500">
                    {timedCount}/{lines.length} timed
                  </div>
                </>
              )}

              {/* Auto-save status indicator */}
              {saveStatus && (
                <div className={`text-xs px-2 py-1 rounded ${
                  saveStatus === 'saving' ? 'text-zinc-400' :
                  saveStatus === 'saved' ? 'text-green-400' :
                  'text-red-400'
                }`}>
                  {saveStatus === 'saving' ? 'Saving...' :
                   saveStatus === 'saved' ? '✓ Saved' :
                   '✕ Save failed'}
                </div>
              )}
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
                  onChange={e => {
                    setPlainText(e.target.value);
                    setPlainTextDirty(true);
                  }}
                  placeholder="Paste lyrics here, one line per row..."
                  className="w-full h-full bg-transparent resize-none focus:outline-none text-sm font-mono"
                />
              ) : (
                <div className="space-y-1">
                  {lines.map((line, i) => {
                    const isCurrent = i === currentLineIndex;
                    return (
                    <div
                      key={i}
                      className={`rounded transition-colors flex items-start gap-2 ${
                        isCurrent
                          ? 'bg-violet-600/30 ring-1 ring-violet-500'
                          : line.time !== null
                          ? 'bg-green-600/10 hover:bg-green-600/20'
                          : 'bg-zinc-800/50 hover:bg-zinc-800'
                      }`}
                    >
                      {/* Timestamp button */}
                      <button
                        onClick={() => markTimestamp(i)}
                        className="px-3 py-2 text-xs font-mono w-20 text-zinc-500 hover:text-white hover:bg-white/10 rounded-l"
                        title="Click to set timestamp"
                      >
                        {line.time !== null ? formatTime(line.time) : '--:--.--'}
                      </button>

                      {/* Text - editable or display */}
                      {editingIndex === i ? (
                        <textarea
                          value={editingText}
                          onChange={e => setEditingText(e.target.value)}
                          onBlur={saveEdit}
                          onKeyDown={e => {
                            if (e.key === 'Enter' && e.metaKey) {
                              e.preventDefault();
                              saveEdit();
                            }
                            if (e.key === 'Escape') {
                              setEditingIndex(null);
                              setEditingText('');
                            }
                          }}
                          autoFocus
                          rows={Math.max(2, editingText.split('\n').length)}
                          className="flex-1 bg-zinc-700 px-2 py-1 text-sm rounded outline-none resize-none"
                          placeholder="Enter lyrics (one line per row, ⌘+Enter to save)"
                        />
                      ) : (
                        <span
                          className="flex-1 text-sm cursor-pointer hover:text-violet-300 py-2"
                          onClick={() => {
                            setEditingIndex(i);
                            setEditingText(line.text);
                          }}
                          title="Click to edit"
                        >
                          {line.text || '♪'}
                        </span>
                      )}

                      {/* Action buttons */}
                      <div className="flex gap-1 pr-2">
                        <button
                          onClick={() => splitLine(i)}
                          className="p-1 text-zinc-500 hover:text-white hover:bg-white/10 rounded text-xs"
                          title="Insert line after"
                        >
                          ↵
                        </button>
                        <button
                          onClick={() => deleteLine(i)}
                          className="p-1 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded text-xs"
                          title="Delete line"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );})}
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
