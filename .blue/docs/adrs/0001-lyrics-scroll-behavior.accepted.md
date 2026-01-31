# ADR 0001: Lyrics Scroll Behavior

| | |
|---|---|
| **Status** | Accepted |
| **Date** | 2026-01-31 |

---

## Context

The lyrics panel needs intuitive scroll behavior that feels natural to users. Early implementations centered the first line on load and scrolled immediately, which felt jarring. Users expect lyrics to start at the top like reading a document, with scrolling only happening when necessary to keep the active line visible.

## Decision

Implement a "scroll-when-needed" strategy for lyrics synchronization:

1. **Initial state**: Lyrics start scrolled to the top. No centering of the first line.
2. **Before center threshold**: While the active line is in the top half of the container, do not scroll. Let the highlight move naturally down the visible lyrics.
3. **At center threshold**: Once the active line would appear below the vertical center, begin scrolling to center it.
4. **During playback**: Continue centering each newly active line as playback progresses.
5. **Near bottom**: When reaching the end of lyrics, stop centering to avoid unnecessary whitespace at the bottom.

This mimics how a human would read lyrics - starting at the top, then scrolling to keep their place as they progress through the song.

## Consequences

- Natural reading experience - lyrics start at top like a document
- No jarring scroll on initial load
- Smooth transition into scroll-to-center mode mid-song
- Active line always visible once scrolling begins
- Requires tracking container dimensions and line positions
- Must handle edge cases: very short lyrics, window resize, song changes

---

*Recorded by Blue*
