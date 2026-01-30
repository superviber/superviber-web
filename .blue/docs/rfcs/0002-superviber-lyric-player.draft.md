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

Build a YouTube playlist player with synchronized lyrics display. Uses YouTube IFrame API with LRC format lyrics. Side-by-side layout for YouTube ToS compliance. Deployed as part of the static site on AWS Amplify.

## Problem

SuperViber needs a custom web player that:
- Plays YouTube videos from a curated playlist
- Displays synchronized lyrics that highlight in time with the music
- Works seamlessly on desktop and mobile

## Architecture

### Layout (YouTube ToS Compliant)

```
┌─────────────────────────────────────────────────┐
│  Desktop: Side-by-side                          │
│  ┌──────────────────┐  ┌──────────────────┐    │
│  │                  │  │                  │    │
│  │  YouTube Player  │  │  Lyrics Panel    │    │
│  │  (standard UI)   │  │  (synced text)   │    │
│  │                  │  │                  │    │
│  └──────────────────┘  └──────────────────┘    │
│                                                 │
│  Mobile: Stacked                                │
│  ┌──────────────────────────────────────┐      │
│  │  YouTube Player                       │      │
│  └──────────────────────────────────────┘      │
│  ┌──────────────────────────────────────┐      │
│  │  Lyrics Panel                         │      │
│  └──────────────────────────────────────┘      │
└─────────────────────────────────────────────────┘
```

**Important**: No overlays on YouTube player. Standard controls always visible. This complies with YouTube ToS.

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

**songs.json** (from RFC-0003):
```json
{
  "playlist": [
    {
      "videoId": "dQw4w9WgXcQ",
      "title": "Never Gonna Give You Up",
      "artist": "Rick Astley",
      "lrcFile": "dQw4w9WgXcQ.lrc",
      "addedAt": "2026-01-30T15:00:00Z"
    }
  ]
}
```

**LRC Format** (`data/lyrics/{videoId}.lrc`):
```
[00:00.00] Never gonna give you up
[00:03.50] Never gonna let you down
[00:07.20] Never gonna run around and desert you
```

### Integration Points

| Component | API/Method |
|-----------|------------|
| YouTube Player | IFrame Player API (`YT.Player`) |
| Time Query | `player.getCurrentTime()` |
| State Events | `player.addEventListener('onStateChange', ...)` |
| Lyrics Data | Static fetch of `/data/songs.json` and `/data/lyrics/*.lrc` |

### Playlist Navigation

- Single playlist, admin-ordered (no shuffle in MVP)
- Previous/Next buttons
- Song list sidebar or dropdown
- Auto-advance to next song on video end

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

- [ ] Create LyricPlayer React component
- [ ] Implement YouTube IFrame API integration
- [ ] Build LRC parser
- [ ] Implement sync engine with requestAnimationFrame
- [ ] Create state machine with proper transitions
- [ ] Build lyrics display panel with highlighting
- [ ] Add playlist navigation (prev/next, song list)
- [ ] Implement responsive side-by-side/stacked layout
- [ ] Add error handling for missing lyrics/videos
- [ ] Integration tests for sync accuracy

---

*"Right then. Let's get to it."*

— Blue
