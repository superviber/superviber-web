[PERSPECTIVE P01: Extend LyricLine rather than create parallel structures]
The existing `LyricLine` interface in `lrc-parser.ts` and `LyricsPanel.tsx` already carries `time` and `text` per line. Adding an optional `meaning?: string` field directly to `LyricLine` preserves the existing sync infrastructure, keeps a single source of truth, and allows meanings to inherit the proven auto-scroll and highlight logic without duplication. The admin editor (`LyricsEditor.tsx`) can add a meaning column alongside its existing timestamp column with minimal new code.

[PERSPECTIVE P02: Mobile-first progressive disclosure via tap-to-reveal]
On narrow views, a dedicated right panel is impossible without sacrificing lyrics readability. Tapping the current highlighted lyric line to reveal its meaning in a bottom sheet or inline expansion follows mobile convention (see Apple Music lyrics interaction) and avoids the cognitive split of side-by-side panels. This pattern also works for accessibility since it does not require simultaneous visual attention on two regions.

[TENSION T01: Scope boundary for Claude-generated content]
Whether meanings are generated at ingest time (batch, stored in LRC or parallel JSON) versus on-demand (live API call during playback) significantly affects caching, cost, latency, and admin editability. The architecture files show a static `/data/lyrics/` folder pattern which suggests pre-generated is the path of least resistance, but this locks in generation quality at publish time rather than allowing model improvements to propagate.
