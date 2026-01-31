# RFC 0003: Superviber Lyric Admin

| | |
|---|---|
| **Status** | In Progress |
| **Date** | 2026-01-30 |
| **Dialogue** | [SuperViber.com Architecture](../dialogues/2026-01-30T1516Z-superviber-com-architecture.dialogue.recorded.md) |
| **Related RFCs** | RFC-0001 (landing), RFC-0002 (lyric-player) |
| **Depends On** | RFC-0000 (infrastructure) |
| **Spikes** | [lyrics-auto-fetch-options](../spikes/2026-01-31T0839Z-lyrics-auto-fetch-options.wip.md) |

---

## Summary

Build an admin tool for creating and syncing lyrics to YouTube videos. Features: video URL validation, click-to-mark timestamp editing, LRC export. Data stored as JSON files in the repo, deployed via git push to AWS Amplify.

## Problem

Admins need to:
- Add songs to the SuperViber playlist
- Create synchronized lyrics by marking timestamps while watching the video
- Export lyrics in LRC format
- Deploy updates via git

## Architecture

### Data Storage

**Location**: JSON files in superviber-web repo

```
superviber-web/
├── data/
│   ├── songs.json           # Playlist metadata
│   └── lyrics/
│       ├── dQw4w9WgXcQ.lrc  # LRC file per video
│       └── ...
```

**Why JSON files in repo**:
- Zero backend complexity
- Git history = version control + audit trail
- PRs = review process for content changes
- Works with static hosting (AWS Amplify)
- Scales easily to ~100 songs

**Deployment Flow**:
```
npm run dev
    ↓
Open localhost:3000/admin
    ↓
Create/edit lyrics (saves directly to public/data/)
    ↓
git add public/data/ && git commit && git push
    ↓
Amplify auto-deploys
    ↓
New lyrics live on superviber.com
```

### songs.json Schema

```json
{
  "playlist": [
    {
      "videoId": "dQw4w9WgXcQ",
      "title": "Never Gonna Give You Up",
      "artist": "Rick Astley",
      "lrcFile": "dQw4w9WgXcQ.lrc",
      "addedAt": "2026-01-30T15:00:00Z",
      "lastVerified": "2026-01-30T15:00:00Z"
    }
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| videoId | string | YouTube video ID (11 chars) |
| title | string | Song title (from YouTube or manual) |
| artist | string | Artist name |
| lrcFile | string | Filename in data/lyrics/ |
| addedAt | ISO8601 | When song was added |
| lastVerified | ISO8601 | Last time video availability was checked |

### LRC Format

Standard LRC format (industry standard):

```
[ti:Never Gonna Give You Up]
[ar:Rick Astley]
[00:00.00]
[00:18.00] We're no strangers to love
[00:22.50] You know the rules and so do I
[00:27.00] A full commitment's what I'm thinking of
```

**Why LRC**:
- Industry standard, widely supported
- Simple format: `[mm:ss.xx] lyric line`
- Importable from existing sources
- Human-readable and git-diffable

### Admin Workflow

```
┌─────────────────────────────────────────────────────────────┐
│  1. ADD SONG                                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Paste YouTube URL: [_________________________]      │   │
│  │                    [Validate]                        │   │
│  │                                                      │   │
│  │ Title: Never Gonna Give You Up (auto-filled)        │   │
│  │ Artist: Rick Astley                                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  2. SYNC LYRICS                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  ┌──────────────┐  ┌──────────────────────────┐    │   │
│  │  │              │  │ Lyrics Editor             │    │   │
│  │  │  YouTube     │  │                          │    │   │
│  │  │  Player      │  │ We're no strangers...    │    │   │
│  │  │              │  │ You know the rules...    │    │   │
│  │  │              │  │ [Click line while video  │    │   │
│  │  │  [▶ 0:18]    │  │  plays to mark time]     │    │   │
│  │  └──────────────┘  └──────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  3. EXPORT & SAVE                                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ [Preview LRC]  [Download LRC]  [Copy to Clipboard]  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Admin Tool Hosting

**Route**: `/admin` (local dev only)

The admin tool is a web page at `/admin` that only works in local development:
- Disabled in production builds (returns 404 or redirect)
- No authentication needed — dev mode is inherently local
- Can save files directly to `public/data/` directory
- Admin commits changes to repo and pushes

**Why local-only**:
- Static site can't write files when deployed
- No security surface to protect in production
- Simpler implementation (no auth, no env vars)
- Direct file saves instead of download-then-commit workflow

**Implementation**:
```tsx
// src/app/admin/page.tsx
export default function AdminPage() {
  // Disable in production
  if (process.env.NODE_ENV === 'production') {
    return notFound();
  }

  return <AdminTool />;
}
```

**Local-only API routes** for file operations:
```tsx
// src/app/api/admin/save-lyrics/route.ts
export async function POST(request: Request) {
  if (process.env.NODE_ENV === 'production') {
    return Response.json({ error: 'Not available in production' }, { status: 403 });
  }

  // Write to public/data/lyrics/{videoId}.lrc
  const { videoId, lrc } = await request.json();
  await fs.writeFile(`public/data/lyrics/${videoId}.lrc`, lrc);
  return Response.json({ success: true });
}
```

### Features

#### 1. Add Song
- Paste YouTube URL or video ID
- Validate via YouTube oEmbed (no API key needed)
- Auto-fill title, thumbnail, duration
- Handle invalid/private/unavailable videos with clear error

#### 2. Sync Lyrics
- Paste or type lyrics (plain text, one line per lyric)
- Play video, click lyric line to mark timestamp
- Visual indicator of current playback position
- Preview mode: see lyrics sync in real-time
- Edit timestamps manually if needed

#### 3. Export & Save
- Preview LRC output
- Save directly to `public/data/lyrics/` directory (local dev only)
- Update `songs.json` with new song entry
- Copy to clipboard (for external use)
- Download as backup option

#### 4. Import (Optional)
- Import existing LRC files
- Paste LRC content or upload file
- Parse and display for editing

#### 5. Playlist Sync
Load or resync a YouTube playlist. Handles initial import, reordering, additions, and removals while preserving existing LRC files.

**Core behaviors**:
- Input YouTube playlist URL (or use saved `playlistId` from songs.json)
- Fetch all video metadata from playlist
- Compare with existing songs.json:
  - **New songs**: Added to playlist since last sync
  - **Removed songs**: No longer in playlist (prompt to keep or remove)
  - **Reordered songs**: Order changed (update automatically)
  - **Existing songs**: Unchanged, preserve `hasLyrics` status
- LRC files keyed by video ID — never deleted, always reused

**Playlist Sync Workflow**:
```
┌─────────────────────────────────────────────────────────────┐
│  PLAYLIST SYNC                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Current playlist: PL7MpUyhMLCxfpP8viEu0CDLkpYH3GrpA7│    │
│  │                   [Resync]  [Change Playlist]       │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Playlist: SuperViber Jams (39 songs)                │    │
│  │                                                      │    │
│  │ CHANGES DETECTED:                                    │    │
│  │                                                      │    │
│  │ + 3 new songs                                        │    │
│  │   • New Song Title - Artist Name                    │    │
│  │   • Another New Song - Another Artist               │    │
│  │                                                      │    │
│  │ ↕ 5 songs reordered (positions updated)             │    │
│  │                                                      │    │
│  │ - 1 song removed from playlist                      │    │
│  │   • Old Song - Old Artist                           │    │
│  │   ○ Keep in songs.json  ● Remove                    │    │
│  │                                                      │    │
│  │ ✓ 35 songs unchanged (2 have lyrics)                │    │
│  │                                                      │    │
│  │ [Apply Changes]  [Cancel]                           │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  LRC FILES:                                                  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ ✓ Existing LRC files are never deleted              │    │
│  │ ✓ If a song returns, its lyrics reconnect           │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

**Technical Implementation**:
```typescript
interface SyncResult {
  added: Song[];      // New songs in playlist
  removed: Song[];    // Songs no longer in playlist
  reordered: boolean; // True if order changed
  unchanged: Song[];  // Songs still present
}

async function syncPlaylist(playlistId: string, currentSongs: Song[]) {
  const playlistSongs = await fetchPlaylistVideos(playlistId);
  const currentMap = new Map(currentSongs.map(s => [s.videoId, s]));
  const playlistMap = new Map(playlistSongs.map(s => [s.videoId, s]));

  const added = playlistSongs.filter(s => !currentMap.has(s.videoId));
  const removed = currentSongs.filter(s => !playlistMap.has(s.videoId));

  // Preserve hasLyrics for existing songs
  const merged = playlistSongs.map(s => ({
    ...s,
    hasLyrics: currentMap.get(s.videoId)?.hasLyrics ?? checkLrcExists(s.videoId)
  }));

  return { added, removed, reordered: orderChanged(currentSongs, merged), merged };
}
```

**Key principle**: LRC files are keyed by video ID, independent of songs.json. A song can be removed and re-added later — its LRC file persists.

#### 6. Lyrics Auto-Fetch
Tiered approach to reduce manual effort:

**Primary: LRCLIB** (synchronized lyrics)
```
GET https://lrclib.net/api/get?artist_name={artist}&track_name={track}
```
- No API key required, free
- Returns LRC format with timestamps (~3M song database)
- If found: direct import, no manual timing needed

**Fallback: Lyrics.ovh** (plain lyrics)
```
GET https://api.lyrics.ovh/v1/{artist}/{track}
```
- No API key required, free
- Returns plain text lyrics
- If found: populate editor for manual timestamp marking

**Final Fallback: Manual paste**
- Copy/paste lyrics from any source
- Mark timestamps while watching video (existing feature)

**UI Flow**:
```
┌─────────────────────────────────────────────────────────────┐
│  LYRICS AUTO-FETCH                                           │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Song: Never Gonna Give You Up                        │    │
│  │ Artist: Rick Astley                                  │    │
│  │                                                      │    │
│  │ [🔍 Fetch Lyrics]                                    │    │
│  │                                                      │    │
│  │ Status: ✓ Found synchronized lyrics (LRCLIB)        │    │
│  │         Imported 47 lines with timestamps           │    │
│  │                                                      │    │
│  │ [Import to Editor]  [Preview LRC]                   │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  If not found:                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Status: ⚠ No synced lyrics. Found plain lyrics.     │    │
│  │         You'll need to mark timestamps manually.     │    │
│  │                                                      │    │
│  │ [Import Plain Lyrics]  [Paste Manually Instead]     │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

**Implementation**:
```typescript
async function fetchLyrics(artist: string, track: string) {
  // Try LRCLIB first (synchronized)
  const lrclib = await fetch(
    `https://lrclib.net/api/get?artist_name=${encodeURIComponent(artist)}&track_name=${encodeURIComponent(track)}`
  );
  if (lrclib.ok) {
    const data = await lrclib.json();
    if (data.syncedLyrics) {
      return { type: 'synced', lrc: data.syncedLyrics, source: 'lrclib' };
    }
  }

  // Fallback to lyrics.ovh (plain text)
  const ovh = await fetch(
    `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(track)}`
  );
  if (ovh.ok) {
    const data = await ovh.json();
    return { type: 'plain', text: data.lyrics, source: 'lyrics.ovh' };
  }

  return { type: 'not-found' };
}
```

**Playlist Sync Workflow**:
```
┌─────────────────────────────────────────────────────────────┐
│  PLAYLIST SYNC                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Playlist URL: [________________________________]    │    │
│  │               [Fetch Playlist]                      │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Found 39 songs in playlist                          │    │
│  │                                                      │    │
│  │ + 37 new songs                                       │    │
│  │ ✓ 2 existing songs (unchanged)                      │    │
│  │ - 0 songs removed from playlist                     │    │
│  │                                                      │    │
│  │ NEW SONGS:                                           │    │
│  │ ┌────────────────────────────────────────────────┐  │    │
│  │ │ □ Walden Pond - Atta Boy                       │  │    │
│  │ │ □ 17 - Youth Lagoon                            │  │    │
│  │ │ □ Generator ^ First Floor - Freelance Whales   │  │    │
│  │ │ ...                                            │  │    │
│  │ └────────────────────────────────────────────────┘  │    │
│  │                                                      │    │
│  │ [Select All]  [Deselect All]                        │    │
│  │                                                      │    │
│  │ □ Create placeholder LRC files for new songs        │    │
│  │                                                      │    │
│  │ [Apply Changes]  [Download Updated songs.json]      │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

**Technical Implementation**:
- Use Playwright or YouTube Data API to fetch playlist contents
- Parse video titles to extract song name and artist (heuristics: "Artist - Song", "Song (Lyrics)", etc.)
- Allow manual override of auto-detected title/artist
- Generate diff against current songs.json
- Export updated songs.json for download or direct save

### Video Validation

**Primary**: YouTube oEmbed endpoint (no API key required)
```
GET https://www.youtube.com/oembed?url=https://youtube.com/watch?v={videoId}&format=json
```

Returns: title, thumbnail, author_name (channel)
404 = video unavailable

### Authentication

**None required** — admin page is local dev only.

Running `npm run dev` is the authentication. No password, no env vars, no session management.

### Video Availability Monitoring

- `lastVerified` timestamp per song
- Manual check: run a script that calls oEmbed for each video
- Update status in songs.json
- No automated background jobs

```bash
# Example check script
npm run check-videos
# Output:
# ✓ dQw4w9WgXcQ - Never Gonna Give You Up
# ✗ abc123xyz - Video unavailable
```

## Non-Goals

- User accounts / RBAC (local dev mode is sufficient)
- Remote/production admin access
- Timeline drag-to-adjust (v2 feature)
- Bulk import
- Paid lyrics APIs (MusixMatch commercial, Genius Pro)

## Lyrics Source Policy

**Tiered approach**:
1. LRCLIB - free community database with synchronized lyrics
2. Lyrics.ovh - free plain lyrics API
3. Manual paste - admin copies from any source

We avoid licensed providers (MusixMatch commercial tier, Genius with scraping restrictions) to sidestep licensing complexity.

Disclaimer in UI: "Lyrics sourced from community databases or provided by site administrators."

## Test Plan

- [ ] Can add song via YouTube URL
- [ ] Invalid URLs show clear error
- [ ] Can type/paste lyrics
- [ ] Click-to-mark timestamps works
- [ ] Timestamps are accurate (±100ms of click time)
- [ ] LRC preview shows correct format
- [ ] LRC download works
- [ ] Generated files are valid and work with player (RFC-0002)
- [ ] Playlist sync fetches all videos from playlist
- [ ] Playlist sync correctly identifies new vs existing songs
- [ ] Playlist sync title/artist parsing is reasonable
- [ ] Downloaded songs.json is valid and works with player
- [ ] Lyrics auto-fetch finds synced lyrics from LRCLIB
- [ ] Lyrics auto-fetch falls back to plain lyrics from Lyrics.ovh
- [ ] Lyrics auto-fetch shows "not found" gracefully
- [ ] Imported synced lyrics parse correctly to LRC format
- [ ] Imported plain lyrics populate editor for manual timing

## Success Criteria

- Admin can add a new song with synced lyrics
- Lyrics export correctly in LRC format
- Changes can be deployed via git push to Amplify

## Tasks

### Admin Route
- [ ] Create `/admin/page.tsx` route
- [ ] Add production check (return 404 if `NODE_ENV === 'production'`)
- [ ] Create API routes for local file operations (`/api/admin/save-lyrics`, `/api/admin/save-songs`)

### Song Management
- [ ] Build "Add Song" form with YouTube URL input
- [ ] Implement YouTube oEmbed validation
- [ ] Auto-fill title/artist from oEmbed response
- [ ] Display existing songs in playlist

### Lyrics Sync Tool
- [ ] Build split-view layout (video + lyrics editor)
- [ ] Implement click-to-mark timestamp functionality
- [ ] Show current playback time indicator
- [ ] Allow manual timestamp editing
- [ ] Build preview mode with live sync playback

### Export & Data
- [ ] Implement LRC file generator
- [ ] Add LRC preview panel
- [ ] Build download LRC button
- [ ] Create "Copy to Clipboard" functionality
- [ ] Add LRC import/paste feature

### Playlist Sync
- [ ] Build playlist sync UI with Resync button
- [ ] Store `playlistId` in songs.json for easy resync
- [ ] Implement YouTube playlist fetcher (video IDs, titles, artists)
- [ ] Parse video titles to extract song name and artist
- [ ] Build diff view showing added/removed/reordered songs
- [ ] Handle removed songs (prompt: keep or remove from songs.json)
- [ ] Preserve `hasLyrics` status for existing songs
- [ ] Check filesystem for existing LRC files on sync
- [ ] Save updated songs.json to `public/data/`

### Lyrics Auto-Fetch
- [ ] Build "Fetch Lyrics" button in lyrics sync UI
- [ ] Implement LRCLIB API integration (synchronized lyrics)
- [ ] Implement Lyrics.ovh API fallback (plain lyrics)
- [ ] Show fetch status (searching, found synced, found plain, not found)
- [ ] Import synced lyrics directly to LRC editor
- [ ] Import plain lyrics to text editor for manual timing
- [ ] Handle API errors gracefully

### Utilities
- [ ] Create video availability check script (`npm run check-videos`)
- [ ] Document admin workflow in README

---

*"Right then. Let's get to it."*

— Blue
