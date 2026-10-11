[PERSPECTIVE P01: LRC format extension for time-synced meanings]
The existing LRC parser and `LyricLine` interface already handle time-to-text mapping. Extend the LRC format with a companion `.meanings.lrc` file using the same timestamp conventions, where each line maps to a meaning segment. This preserves the battle-tested sync logic in `useLyricSync` and `findCurrentLineIndex` without modification, and the admin `LyricsEditor` can be forked to create a parallel `MeaningsEditor` with identical timestamp-marking UX.

[PERSPECTIVE P02: Mobile demands a toggle, not a separate view]
The current `LyricsPanel` uses `flex-1` and scrolls vertically. On mobile, a side panel is impossible. Rather than a sheet or modal, implement a single-tap toggle on any lyric line that swaps its display from lyrics to meaning in-place, preserving scroll position and sync. This avoids layout thrash and reuses the existing line-ref array for smooth transitions.

[TENSION T01: Meaning granularity mismatch]
Lyrics are line-granular but meanings often span verse/chorus sections. Forcing 1:1 line-meaning mapping produces redundant "see above" placeholders or awkward splits. Need a `meaningId` grouping mechanism so multiple lyric lines reference a single meaning block.
