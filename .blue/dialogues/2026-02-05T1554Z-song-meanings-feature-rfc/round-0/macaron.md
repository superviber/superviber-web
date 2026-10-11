[PERSPECTIVE P01: Meanings as parallel time-synced track]
The LRC parser already handles time-indexed lines. Meanings should be a sibling data structure (`.meanings.json` per song) with matching timestamps, not embedded in LRC files. This keeps lyrics and meanings independently editable while the existing `findCurrentLineIndex` function works for both. The LyricsPanel's line-by-line rendering loop can simply look up meanings by index when timestamps align.

[PERSPECTIVE P02: Mobile-first interaction over layout mirroring]
On mobile, don't try to show meanings beside lyrics. Instead, make the current lyric line tappable to reveal its meaning in a bottom sheet or inline expansion. This preserves the karaoke scroll rhythm while making meanings opt-in, respecting that mobile users often listen with screen off.

[TENSION T01: Time granularity mismatch]
Meanings often span multiple lyric lines (verses, choruses) while LRC timestamps are per-line. Need to decide: one meaning per line, or meaning ranges that cover timestamp spans? Both are valid but require different data models and UI behaviors.
