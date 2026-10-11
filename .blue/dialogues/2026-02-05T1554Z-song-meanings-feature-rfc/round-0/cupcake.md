[PERSPECTIVE P01: Progressive disclosure trumps side-by-side on mobile]
The current LyricsPanel uses center-focused karaoke styling with scale transforms (0.9x-1.25x) and text-shadow glow effects that demand visual breathing room. On narrow views, placing meanings beside lyrics would compress the 20% right padding that enables the current "origin-left" scaling effect, breaking the karaoke aesthetic. Instead, mobile should use tap-to-reveal: tapping the current lyric line slides up a bottom sheet with its meaning, preserving the immersive karaoke experience while making meanings accessible on demand.

[PERSPECTIVE P02: Meaning data structure must be line-indexed, not time-indexed]
The LRC parser produces a flat array of LyricLine objects sorted by time. Meanings should attach to line indices rather than timestamps, because: (1) admin editing in LyricsEditor already operates on array indices, (2) time-shifting features would break time-indexed meanings, (3) not every line needs a meaning - sparse annotations are natural at line level. A parallel sparse array `meanings: (string | null)[]` keeps the data model simple and the admin editing consistent.

[TENSION T01: Claude generation timing vs. admin workflow]
Should Claude generate meanings on first lyrics import (proactive), on admin request (on-demand), or on first user view (lazy)? Each has UX tradeoffs for admin curation workflow and perceived latency.
