# RFC 0005: Persistent Mini Player

| | |
|---|---|
| **Status** | Implemented |
| **Date** | 2026-02-01 |

---

## Summary

Currently, navigation away from the player page stops playback. Users should be able to continue listening while browsing other pages, with mini player controls visible at the bottom of the screen.

## Problem

When a user navigates from `/player/[videoId]` to any other page (home, about, contact), the `PlayerClient` component unmounts and the YouTube player is destroyed. Playback stops. Users must return to the player page to resume.

This breaks the expected music player UX where audio continues in the background while browsing.

## Solution

Lift the player state and YouTube iframe to the root layout level. The player persists across all page navigations. When not on the player page, show a compact mini player bar at the bottom of the screen.

**Playlist continuity**: The mini player continues through the entire playlist automatically. When a song ends, it advances to the next track regardless of what page the user is on. The mini player updates to show the new song info.

## Architecture

### New Components

1. **`PlayerProvider`** (context)
   - Wraps the app in root layout
   - Manages: current song, playlist, play/pause state, current time
   - Exposes: `play()`, `pause()`, `seekTo()`, `selectSong()`, `next()`, `prev()`

2. **`GlobalPlayer`** (in root layout)
   - Contains the actual YouTube iframe (hidden when not on player page)
   - Uses `useYouTubePlayer` hook
   - Always mounted, never destroyed during navigation

3. **`MiniPlayer`** (fixed bottom bar)
   - Shows when: playing/paused AND not on `/player/*` route
   - Displays: song title, artist, play/pause, progress bar, next/prev
   - Click expands to full player page
   - Height: ~64px

4. **`PlayerClient`** (refactored)
   - No longer owns the YouTube player
   - Consumes `PlayerContext` for state/controls
   - Shows the full player UI with lyrics

### Component Hierarchy

```
RootLayout
├── PlayerProvider
│   ├── Navigation
│   ├── Main
│   │   └── {children} (pages)
│   ├── Footer
│   ├── GlobalPlayer (iframe + portal logic)
│   └── MiniPlayer (conditionally rendered)
```

### Seamless Player Transitions (Portal Approach)

The YouTube iframe must be the **same instance** across all pages - no remounting, no reload, no audio gap.

**How it works:**

1. `GlobalPlayer` creates and owns the YouTube iframe
2. `PlayerContext` exposes a `setVideoTarget(element | null)` function
3. When `PlayerClient` mounts, it calls `setVideoTarget(containerRef.current)`
4. `GlobalPlayer` uses `createPortal()` to render the iframe into that target
5. When `PlayerClient` unmounts, target becomes `null`, iframe portals back to hidden container

```tsx
// GlobalPlayer.tsx
function GlobalPlayer() {
  const { videoTarget } = usePlayer();
  const iframeContainer = <div ref={iframeRef}>...</div>;

  // Portal to player page target, or render in hidden fallback
  return videoTarget
    ? createPortal(iframeContainer, videoTarget)
    : <div className="hidden">{iframeContainer}</div>;
}

// PlayerClient.tsx
function PlayerClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { setVideoTarget } = usePlayer();

  useEffect(() => {
    setVideoTarget(containerRef.current);
    return () => setVideoTarget(null);
  }, []);

  return <div ref={containerRef} />; // iframe portals here
}
```

**Result**: Navigate to player page - video is already playing in the exact right spot. Navigate away - audio continues, iframe moves to hidden container. Zero interruption.

### State Flow

```
PlayerContext
├── currentVideoId: string | null
├── playlist: Playlist
├── playerState: 'IDLE' | 'READY' | 'PLAYING' | 'PAUSED' | 'BUFFERING' | 'ENDED'
├── getCurrentTime: () => number
├── getDuration: () => number
├── play: () => void
├── pause: () => void
├── seekTo: (time: number) => void
├── selectSong: (videoId: string) => void
├── goToNext: () => void
├── goToPrevious: () => void
└── hasActivePlayer: boolean
```

### Visibility Logic

| Route | Full Player | Mini Player | YouTube iframe |
|-------|-------------|-------------|----------------|
| `/player/*` | Visible | Hidden | Visible in player |
| Other pages (playing) | Hidden | Visible | Hidden but active |
| Other pages (no song) | Hidden | Hidden | Not rendered |

### Mini Player Design

```
┌─────────────────────────────────────────────────────────────┐
│ [Album] Title - Artist          ◄◄  ▶/❚❚  ►►  ━━━●━━━━━ 2:34│
└─────────────────────────────────────────────────────────────┘
```

- Clicking anywhere (except controls) navigates to `/player/[currentVideoId]`
- Subtle slide-up animation on appear
- Dark background matching site theme
- Progress bar is interactive (seek on click)

## File Changes

| File | Change |
|------|--------|
| `src/contexts/PlayerContext.tsx` | New - player state context |
| `src/components/GlobalPlayer.tsx` | New - hidden iframe container |
| `src/components/MiniPlayer.tsx` | New - bottom bar UI |
| `src/app/layout.tsx` | Wrap with PlayerProvider, add GlobalPlayer + MiniPlayer |
| `src/components/player/PlayerClient.tsx` | Refactor to consume context |
| `src/hooks/useYouTubePlayer.ts` | Minor updates for external control |

## Edge Cases

1. **Deep link to player page**: Initialize context from URL, load song
2. **Song ends while on other page**: Auto-advance to next song, mini player updates
3. **User closes mini player**: Add X button? Or just pause?
4. **Mobile viewport**: Mini player should not overlap content; add bottom padding to Main
5. **Admin pages**: Should mini player show? Probably yes.

## Implementation Approach

**Treat as greenfield.** This is a significant architectural change - don't bolt it onto existing code. Take the opportunity to:

- Clean up `PlayerClient.tsx` (currently 320 lines) - extract logic into the new context
- Remove redundant state that will now live in `PlayerContext`
- Delete the localStorage persistence code from `PlayerClient` - it moves to `PlayerProvider`
- Keep components focused: `MiniPlayer` is just UI, `GlobalPlayer` is just the iframe, `PlayerProvider` owns all state

The end result should be a cleaner codebase, not a more complex one.

## Alternatives Considered

1. **Audio-only background playback**: Extract audio URL from YouTube. Violates ToS.
2. **Picture-in-Picture**: Browser PiP API. Limited control, inconsistent UX.
3. **Keep iframe in DOM but hidden**: This is essentially what we're doing, wrapped in proper state management.

## Test Plan

- [ ] Navigate away from player while playing - audio continues
- [ ] Mini player shows with correct song info
- [ ] Mini player controls work (play/pause/seek/next/prev)
- [ ] Clicking mini player navigates to full player
- [ ] Returning to player page shows correct state
- [ ] Song advancement works while on other pages
- [ ] Mobile layout doesn't overlap
- [ ] No duplicate iframes created
- [ ] localStorage state still works for page refresh

---

*"Right then. Let's get to it."*

— Blue
