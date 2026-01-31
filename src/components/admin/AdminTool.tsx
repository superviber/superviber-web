'use client';

import { useState } from 'react';
import { PlaylistSync } from './PlaylistSync';
import { LyricsEditor } from './LyricsEditor';

type Tab = 'playlist' | 'lyrics';

export function AdminTool() {
  const [activeTab, setActiveTab] = useState<Tab>('playlist');

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold">SuperViber Admin</h1>
              <span className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-full">
                Local Dev Only
              </span>
            </div>
            <a
              href="/player"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              ← Back to Player
            </a>
          </div>

          {/* Tabs */}
          <nav className="flex gap-1 mt-4">
            <button
              onClick={() => setActiveTab('playlist')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'playlist'
                  ? 'bg-white/10 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Playlist Sync
            </button>
            <button
              onClick={() => setActiveTab('lyrics')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'lyrics'
                  ? 'bg-white/10 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Lyrics Editor
            </button>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {activeTab === 'playlist' && <PlaylistSync />}
        {activeTab === 'lyrics' && <LyricsEditor />}
      </main>
    </div>
  );
}
