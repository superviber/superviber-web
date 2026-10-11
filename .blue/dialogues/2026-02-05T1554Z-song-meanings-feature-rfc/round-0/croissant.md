[PERSPECTIVE P01: Meanings as line-level annotations, not separate panel]
The existing `LyricLine` interface (`time: number, text: string`) should extend to include an optional `meaning?: string` field, making annotations atomic to each lyric line rather than a parallel data structure. This enables time-sync for free (same timestamp), simplifies the admin editor (add a meaning field per line in LyricsEditor's sync mode), and eliminates complex multi-panel coordination. The LRC format can extend with custom tags like `[meaning:00:15.00]annotation text` that the parser ignores gracefully if missing.

[PERSPECTIVE P02: Mobile UX via tap-to-reveal, not layout gymnastics]
For narrow views, avoid side panels or bottom sheets that fight the vertical lyric scroll. Instead, tap the current lyric line to expand an inline meaning below it (accordion-style, auto-collapses when line changes). This leverages the existing `isCurrent` state in LyricsPanel and preserves scroll-to-center behavior from ADR 0001.

[TENSION T01: AI generation freshness vs editorial control]
Claude-generated meanings should be pre-generated and stored (for quality review), not generated on-demand, but this creates staleness if song metadata or cultural context evolves. Need a clear regeneration trigger in admin tooling.

---
