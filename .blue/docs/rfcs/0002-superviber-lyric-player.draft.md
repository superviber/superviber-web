# RFC 0002: Superviber Lyric Player

| | |
|---|---|
| **Status** | Draft |
| **Date** | 2026-01-30 |
| **Dialogue** | [SuperViber.com Architecture](../dialogues/2026-01-30T1516Z-superviber-com-architecture.dialogue.recorded.md) |
| **Related RFCs** | RFC-0001 (landing), RFC-0003 (lyric-admin) |
| **Depends On** | RFC-0000 (infrastructure), Data schema from RFC-0003 |

---

## Summary

Build a YouTube playlist player with karaoke-style synchronized lyrics. Uses YouTube IFrame API with LRC format lyrics. Video at top, lyrics below with auto-scroll. Each song is deep-linkable via URL. Deployed as part of the static site on AWS Amplify.

## Problem

SuperViber needs a custom web player that:
- Plays YouTube videos from a curated playlist
- Displays synchronized lyrics with karaoke-style highlighting (scale + glow)
- Supports deep linking to individual songs (`/player/[videoId]`)
- Works seamlessly on desktop and mobile with responsive layout

## Architecture

### URL Structure

```
/player              → First song in playlist
/player/[videoId]    → Specific song (deep link)

Examples:
/player/D0Un2GTRhHM  → Direct link to specific song
/player/2O1-XNwNq70  → Another song
```

**Playlist ID**: `PL7MpUyhMLCxfpP8viEu0CDLkpYH3GrpA7`

### Responsive Layout

Video always at top (16:9 aspect ratio), lyrics below or beside based on viewport:

```
┌─────────────────────────────────────────────────────────────┐
│  MOBILE (<768px): Stacked                                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  YouTube Player (16:9, full width)                    │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Song Title / Artist                                  │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │  ♪ Previous lyrics (faded)                           │  │
│  │  ♪ Previous lyrics (faded)                           │  │
│  │  ▶ CURRENT LINE (large, glowing)                     │  │
│  │  ♪ Upcoming lyrics (faded)                           │  │
│  │  ♪ Upcoming lyrics (faded)                           │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  [◀ Prev]  Song Selector  [Next ▶]                   │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  TABLET (768px-1024px): Stacked with max-width              │
│  ┌─────────────────────────────────────────┐                │
│  │  YouTube Player (max-width: 640px)      │  ← centered    │
│  └─────────────────────────────────────────┘                │
│  ┌─────────────────────────────────────────┐                │
│  │  Lyrics Panel (max-width: 640px)        │  ← centered    │
│  └─────────────────────────────────────────┘                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  DESKTOP (>1024px): Side-by-side                            │
│  ┌───────────────────────────┐ ┌───────────────────────────┐│
│  │                           │ │                           ││
│  │  YouTube Player           │ │  Lyrics Panel             ││
│  │  (max-width: 640px)       │ │  (flex: 1)                ││
│  │                           │ │                           ││
│  │                           │ │  ▶ CURRENT LINE           ││
│  │                           │ │                           ││
│  └───────────────────────────┘ └───────────────────────────┘│
│  ┌───────────────────────────────────────────────────────┐  │
│  │  [◀ Prev]  Song Selector Dropdown  [Next ▶]          │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Breakpoints**:
| Viewport | Layout | Video Max Width |
|----------|--------|-----------------|
| <768px | Stacked | 100% |
| 768-1024px | Stacked centered | 640px |
| >1024px | Side-by-side | 640px |

**Important**: No overlays on YouTube player. Standard controls always visible (YouTube ToS compliance).

### Karaoke-Style Lyrics Display

The current line is emphasized while surrounding lines fade:

```css
/* Current line: large, glowing, white */
.lyric-current {
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffffff;
  text-shadow: 0 0 20px rgba(139, 92, 246, 0.8),
               0 0 40px rgba(236, 72, 153, 0.6);
  transform: scale(1.1);
  transition: all 0.2s ease-out;
}

/* Adjacent lines: normal size, dimmed */
.lyric-adjacent {
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.5);
}

/* Distant lines: smaller, very faded */
.lyric-distant {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.25);
}
```

**Auto-scroll behavior**: Current line stays vertically centered in the lyrics panel. Panel smoothly scrolls to keep the active line in view.

### Player State Machine

```
        ┌─────────────────────────────────────────┐
        │                                         │
        v                                         │
    LOADING ──────► READY ──────► PLAYING ◄──────┤
        │              │             │ │          │
        │              │             │ └──► PAUSED
        │              │             │        │
        │              │             v        │
        │              │          SEEKING ────┘
        │              │             │
        └──────────────┴─────────────┘
                  (errors return to LOADING)
```

| State | Description | Transitions |
|-------|-------------|-------------|
| LOADING | Fetching LRC file, initializing YouTube player | → READY |
| READY | Video loaded, lyrics parsed, waiting for play | → PLAYING |
| PLAYING | Active sync, lyrics highlighting | → PAUSED, → SEEKING |
| PAUSED | Video paused, lyrics frozen | → PLAYING, → SEEKING |
| SEEKING | User scrubbing timeline, lyrics temporarily desynced | → PLAYING, → PAUSED |

### Sync Engine

**Precision Target**: ±100ms (human perception threshold for speech sync is ~150ms)

**Implementation**:
```javascript
// Poll YouTube time via requestAnimationFrame (60fps = ~16ms intervals)
function syncLoop() {
  const currentTime = player.getCurrentTime();
  const currentLyric = findLyricAtTime(currentTime, parsedLRC);
  if (currentLyric !== displayedLyric) {
    highlightLyric(currentLyric);
  }
  if (state === 'PLAYING') {
    requestAnimationFrame(syncLoop);
  }
}
```

**YouTube Events Handled**:
- `onReady` → transition to READY
- `onStateChange(PLAYING)` → transition to PLAYING, start sync loop
- `onStateChange(PAUSED)` → transition to PAUSED, stop sync loop
- `onStateChange(BUFFERING)` → stay in current state, continue loop
- `onStateChange(ENDED)` → advance to next song or stop

### Data Schema

**songs.json** (created via RFC-0003 admin tool):
```json
{
  "playlistId": "PL7MpUyhMLCxfpP8viEu0CDLkpYH3GrpA7",
  "songs": [
    {
      "videoId": "D0Un2GTRhHM",
      "title": "Song Title",
      "artist": "Artist Name",
      "duration": 234,
      "hasLyrics": true
    },
    {
      "videoId": "2O1-XNwNq70",
      "title": "Another Song",
      "artist": "Another Artist",
      "duration": 187,
      "hasLyrics": true
    }
  ]
}
```

**LRC Format** (`data/lyrics/{videoId}.lrc`):
```
[ti:Song Title]
[ar:Artist Name]
[00:00.00]First line of lyrics
[00:03.50]Second line of lyrics
[00:07.20]Third line continues here
[00:12.00]
[00:15.50]After instrumental break
```

- Empty brackets `[00:12.00]` indicate instrumental sections (no text displayed)
- Timestamps are `[mm:ss.xx]` format (minutes:seconds.centiseconds)
- Each line has exactly one timestamp

### Integration Points

| Component | API/Method |
|-----------|------------|
| YouTube Player | IFrame Player API (`YT.Player`) |
| Time Query | `player.getCurrentTime()` |
| State Events | `player.addEventListener('onStateChange', ...)` |
| Lyrics Data | Static fetch of `/data/songs.json` and `/data/lyrics/*.lrc` |

### Playlist Navigation

**Song Selector**: Dropdown showing all songs in playlist order
- Current song highlighted
- Shows title + artist for each
- Selecting a song navigates to `/player/[videoId]`

**Prev/Next Buttons**: Navigate through playlist order
- Wraps around (last → first, first → last)
- Updates URL to new videoId

**Auto-advance**: When video ends, automatically load next song
- Updates URL via `history.pushState` (no full page reload)
- If last song, optionally loop to first or stop

**Deep linking**:
- `/player` → loads first song in playlist
- `/player/[videoId]` → loads specific song
- Shareable URLs for any song

### Hosting

Deployed as part of superviber-web static site on AWS Amplify (RFC-0000). The player is a client-side React component that fetches static JSON/LRC data.

## Non-Goals

- Offline/PWA support (YouTube requires connectivity)
- User playlists
- Shuffle/repeat modes
- Playback speed adjustment (YouTube controls handle this)
- Multiple playlists

## Test Plan

- [ ] Player loads and displays first song
- [ ] Lyrics sync within ±100ms of video playback
- [ ] Play/pause correctly starts/stops sync loop
- [ ] Seeking updates lyrics to correct position
- [ ] Next/previous song navigation works
- [ ] Responsive layout on mobile
- [ ] Handles missing LRC file gracefully (show "no lyrics available")
- [ ] Handles unavailable YouTube video gracefully

## Success Criteria

- Player loads playlist from static JSON
- Lyrics synchronize with YouTube playback
- Works on desktop and mobile browsers

## Tasks

### Core Player
- [ ] Create `/player/[[...videoId]]/page.tsx` route (catch-all for deep linking)
- [ ] Implement YouTube IFrame API integration (`useYouTubePlayer` hook)
- [ ] Build LRC parser utility (`parseLRC()` function)
- [ ] Implement sync engine with requestAnimationFrame (`useLyricSync` hook)
- [ ] Create player state machine (LOADING → READY → PLAYING ⇄ PAUSED)

### UI Components
- [ ] Build `<VideoPlayer>` component with responsive container
- [ ] Build `<LyricsPanel>` with karaoke-style highlighting
- [ ] Implement auto-scroll to keep current line centered
- [ ] Build `<SongSelector>` dropdown component
- [ ] Build `<PlaylistControls>` (prev/next buttons)
- [ ] Implement responsive layout (stacked vs side-by-side)

### Data & Navigation
- [ ] Create initial `songs.json` with playlist data
- [ ] Implement song navigation with URL updates
- [ ] Handle auto-advance on video end
- [ ] Add error states for missing lyrics/unavailable videos

### Polish
- [ ] Add loading skeleton while video/lyrics load
- [ ] Add "No lyrics available" fallback
- [ ] Test sync accuracy (target: ±100ms)
- [ ] Test responsive breakpoints on real devices

---

*"Right then. Let's get to it."*

— Blue
