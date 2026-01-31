'use client';

import { useState, useEffect } from 'react';

interface Song {
  videoId: string;
  title: string;
  artist: string;
  hasLyrics: boolean;
}

interface SongsData {
  playlistId: string;
  songs: Song[];
}

interface SyncResult {
  added: Song[];
  removed: Song[];
  unchanged: Song[];
  reordered: boolean;
  merged: Song[];
}

export function PlaylistSync() {
  const [songsData, setSongsData] = useState<SongsData | null>(null);
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [removedAction, setRemovedAction] = useState<Record<string, 'keep' | 'remove'>>({});

  // Load current songs.json on mount
  useEffect(() => {
    loadSongsData();
  }, []);

  async function loadSongsData() {
    try {
      const res = await fetch('/data/songs.json');
      if (res.ok) {
        const data = await res.json();
        setSongsData(data);
        if (data.playlistId) {
          setPlaylistUrl(`https://www.youtube.com/playlist?list=${data.playlistId}`);
        }
      }
    } catch (err) {
      console.error('Failed to load songs.json:', err);
    }
  }

  function extractPlaylistId(url: string): string | null {
    const match = url.match(/[?&]list=([^&]+)/);
    return match ? match[1] : null;
  }

  async function handleSync() {
    const playlistId = extractPlaylistId(playlistUrl);
    if (!playlistId) {
      setError('Invalid playlist URL. Expected format: https://www.youtube.com/playlist?list=...');
      return;
    }

    setSyncing(true);
    setError(null);
    setSyncResult(null);

    try {
      // Fetch playlist data from our API
      const res = await fetch(`/api/admin/fetch-playlist?playlistId=${playlistId}`);
      if (!res.ok) {
        throw new Error('Failed to fetch playlist');
      }

      const playlistSongs: Song[] = await res.json();
      const currentSongs = songsData?.songs || [];

      // Compare playlists
      const currentMap = new Map(currentSongs.map(s => [s.videoId, s]));
      const playlistMap = new Map(playlistSongs.map(s => [s.videoId, s]));

      const added = playlistSongs.filter(s => !currentMap.has(s.videoId));
      const removed = currentSongs.filter(s => !playlistMap.has(s.videoId));
      const unchanged = playlistSongs.filter(s => currentMap.has(s.videoId));

      // Check if order changed
      const currentOrder = currentSongs.map(s => s.videoId).join(',');
      const newOrder = playlistSongs.filter(s => currentMap.has(s.videoId)).map(s => s.videoId).join(',');
      const reordered = currentOrder !== newOrder && unchanged.length > 0;

      // Merge: use playlist order, preserve title/artist/hasLyrics from current
      const merged = playlistSongs.map(s => {
        const existing = currentMap.get(s.videoId);
        return {
          ...s,
          title: existing?.title ?? s.title,
          artist: existing?.artist ?? s.artist,
          hasLyrics: existing?.hasLyrics ?? false,
        };
      });

      // Initialize removed action to 'remove' by default
      const defaultActions: Record<string, 'keep' | 'remove'> = {};
      removed.forEach(s => {
        defaultActions[s.videoId] = 'remove';
      });
      setRemovedAction(defaultActions);

      setSyncResult({ added, removed, unchanged, reordered, merged });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sync failed');
    } finally {
      setSyncing(false);
    }
  }

  async function applyChanges() {
    if (!syncResult) return;

    setLoading(true);
    setError(null);

    try {
      // Build final song list
      let finalSongs = [...syncResult.merged];

      // Add back any removed songs that user wants to keep
      const songsToKeep = (syncResult.removed || []).filter(
        s => removedAction[s.videoId] === 'keep'
      );
      finalSongs = [...finalSongs, ...songsToKeep];

      const playlistId = extractPlaylistId(playlistUrl);
      const newData: SongsData = {
        playlistId: playlistId || songsData?.playlistId || '',
        songs: finalSongs,
      };

      // Save to API
      const res = await fetch('/api/admin/save-songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData),
      });

      if (!res.ok) {
        throw new Error('Failed to save songs.json');
      }

      // Reload data
      setSongsData(newData);
      setSyncResult(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to apply changes');
    } finally {
      setLoading(false);
    }
  }

  const lyricsCount = songsData?.songs.filter(s => s.hasLyrics).length || 0;
  const totalSongs = songsData?.songs.length || 0;

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
        <h2 className="text-lg font-medium mb-4">Current Playlist</h2>

        {songsData ? (
          <div className="space-y-3">
            <div className="flex items-center gap-4 text-sm">
              <span className="text-zinc-400">Playlist ID:</span>
              <code className="bg-zinc-800 px-2 py-1 rounded text-xs">
                {songsData.playlistId || 'Not set'}
              </code>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-zinc-400">Songs:</span>
              <span>{totalSongs}</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-zinc-400">With lyrics:</span>
              <span className="text-green-400">{lyricsCount}</span>
              <span className="text-zinc-500">({totalSongs - lyricsCount} need lyrics)</span>
            </div>
          </div>
        ) : (
          <p className="text-zinc-500">Loading...</p>
        )}
      </div>

      {/* Sync Controls */}
      <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
        <h2 className="text-lg font-medium mb-4">Sync Playlist</h2>

        <div className="flex gap-3">
          <input
            type="text"
            value={playlistUrl}
            onChange={e => setPlaylistUrl(e.target.value)}
            placeholder="https://www.youtube.com/playlist?list=..."
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm
                     focus:outline-none focus:border-zinc-600 placeholder:text-zinc-500"
          />
          <button
            onClick={handleSync}
            disabled={syncing || !playlistUrl}
            className="px-6 py-2 bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-700
                     disabled:text-zinc-400 rounded-lg text-sm font-medium transition-colors"
          >
            {syncing ? 'Syncing...' : 'Resync'}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Sync Results */}
      {syncResult && (
        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
          <h2 className="text-lg font-medium mb-4">Changes Detected</h2>

          <div className="space-y-4">
            {/* Added */}
            {syncResult.added.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-green-400 mb-2">
                  + {syncResult.added.length} new songs
                </h3>
                <ul className="space-y-1 text-sm text-zinc-300">
                  {syncResult.added.slice(0, 10).map(s => (
                    <li key={s.videoId} className="flex items-center gap-2">
                      <span className="text-green-500">•</span>
                      {s.title} — {s.artist}
                    </li>
                  ))}
                  {syncResult.added.length > 10 && (
                    <li className="text-zinc-500">
                      ...and {syncResult.added.length - 10} more
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Reordered */}
            {syncResult.reordered && (
              <div className="text-sm text-amber-400">
                ↕ Song order has changed (will be updated)
              </div>
            )}

            {/* Removed */}
            {syncResult.removed.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-red-400 mb-2">
                  - {syncResult.removed.length} songs removed from playlist
                </h3>
                <ul className="space-y-2 text-sm">
                  {syncResult.removed.map(s => (
                    <li key={s.videoId} className="flex items-center justify-between gap-4">
                      <span className="text-zinc-300">
                        <span className="text-red-500">•</span> {s.title} — {s.artist}
                        {s.hasLyrics && (
                          <span className="ml-2 text-xs text-amber-400">(has lyrics)</span>
                        )}
                      </span>
                      <div className="flex gap-2 text-xs">
                        <button
                          onClick={() => setRemovedAction(prev => ({ ...prev, [s.videoId]: 'keep' }))}
                          className={`px-2 py-1 rounded ${
                            removedAction[s.videoId] === 'keep'
                              ? 'bg-zinc-600 text-white'
                              : 'bg-zinc-800 text-zinc-400 hover:text-white'
                          }`}
                        >
                          Keep
                        </button>
                        <button
                          onClick={() => setRemovedAction(prev => ({ ...prev, [s.videoId]: 'remove' }))}
                          className={`px-2 py-1 rounded ${
                            removedAction[s.videoId] === 'remove'
                              ? 'bg-red-600/50 text-white'
                              : 'bg-zinc-800 text-zinc-400 hover:text-white'
                          }`}
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Unchanged */}
            <div className="text-sm text-zinc-400">
              ✓ {syncResult.unchanged.length} songs unchanged
              {syncResult.unchanged.filter(s => s.hasLyrics).length > 0 && (
                <span className="text-green-400">
                  {' '}({syncResult.unchanged.filter(s => s.hasLyrics).length} have lyrics)
                </span>
              )}
            </div>

            {/* LRC Note */}
            <div className="mt-4 p-3 bg-zinc-800 rounded-lg text-xs text-zinc-400">
              LRC files are preserved. If a removed song returns later, its lyrics will reconnect automatically.
            </div>

            {/* Apply Button */}
            <div className="flex justify-end pt-4 border-t border-zinc-800">
              <button
                onClick={applyChanges}
                disabled={loading}
                className="px-6 py-2 bg-green-600 hover:bg-green-500 disabled:bg-zinc-700
                         disabled:text-zinc-400 rounded-lg text-sm font-medium transition-colors"
              >
                {loading ? 'Saving...' : 'Apply Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Song List */}
      {songsData && songsData.songs.length > 0 && !syncResult && (
        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
          <h2 className="text-lg font-medium mb-4">Songs ({totalSongs})</h2>

          <div className="space-y-1 max-h-96 overflow-y-auto">
            {songsData.songs.map((song, i) => (
              <div
                key={song.videoId}
                className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-zinc-800/50"
              >
                <span className="text-zinc-500 text-xs w-6">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm truncate">{song.title}</div>
                  <div className="text-xs text-zinc-500 truncate">{song.artist}</div>
                </div>
                {song.hasLyrics ? (
                  <span className="text-xs text-green-400">✓ lyrics</span>
                ) : (
                  <span className="text-xs text-zinc-600">no lyrics</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
