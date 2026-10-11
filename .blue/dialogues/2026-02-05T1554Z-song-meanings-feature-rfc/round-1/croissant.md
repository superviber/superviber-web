[PERSPECTIVE P01: Resolve T01 with hierarchical data model]
The granularity mismatch dissolves if we model meanings at both levels: `LyricLine.meaning?: string` for line-specific annotations AND a separate `SongSection[]` array with `{ startLineIndex, endLineIndex, sectionMeaning }` for verse/chorus-level annotations. At render time, check for a line-level meaning first; if absent, display the active section meaning. This preserves inline simplicity for single-line annotations while supporting multi-line semantic groupings without redundant "see above" placeholders.

[PERSPECTIVE P02: T02 resolves via hybrid - inline for lines, parallel for sections]
The inline vs. parallel camps (T02) are both right for different granularities. Line meanings belong in `LyricLine` (Eclair's argument holds: single source, simpler sync). Section meanings belong in a parallel structure (Macaron's argument holds: independent editability for verse-level annotations). This hybrid maps to admin workflow: LyricsEditor adds per-line meaning field, a separate SectionEditor handles range-based annotations.

[REFINEMENT: T03 pre-generate with regeneration affordance]
Accepting Donut's concern about staleness: pre-generate at import time, but expose a "Regenerate with Claude" button in admin tooling that overwrites AI output while preserving any human edits as a diff marker. This gives admins control without requiring them to review every AI annotation proactively.

[RESOLVED T04]
Scone's ARIA pattern (polite with 1-2s delay) is implementable regardless of data model decisions and has no blockers from other tensions.

[MOVE:CONVERGE]

---
