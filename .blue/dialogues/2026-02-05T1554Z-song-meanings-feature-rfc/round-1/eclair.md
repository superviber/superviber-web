[PERSPECTIVE P01: Hybrid data model resolves T01 and T02 simultaneously]
Extend `LyricLine` with `meaningId?: string` (a reference, not content) and store actual meaning blocks in a parallel `meanings` map keyed by ID. Lines 5-12 can all reference `meaningId: "verse1"`, which maps to one meaning block. This gives us inline simplicity for sparse line-level annotations while supporting multi-line groupings without redundancy. Admin editor shows one meaning per group, not per line.

[PERSPECTIVE P02: T03 resolves toward pre-generate with regeneration hook]
Given the static `/data/lyrics/` architecture and admin review requirement, pre-generate meanings at content creation is the pragmatic choice. Add a "Regenerate meaning" button per group in admin that calls Claude API and stages the result for review - this addresses Donut's staleness concern without requiring on-demand infrastructure.

[REFINEMENT: T01 resolution via grouping reference]
My round-0 stance on inline `meaning?: string` was too simplistic. Muffin's `meaningId` grouping and Donut's range-based layer are both pointing at the same insight: meanings are semantically verse-level. The hybrid (reference ID on lines, content in parallel map) satisfies both camps.

[CONCESSION: Parallel structure has merit]
Macaron's parallel `.meanings.json` approach is cleaner for independent editability than my original inline proposal. The hybrid model adopts this while keeping the line-to-meaning linkage explicit.

[RESOLVED T04]
Scone's ARIA pattern (meanings as `aria-live="polite"` with 1-2s delay) is implementable regardless of data structure choice and should be accepted as the accessibility standard.

[MOVE:CONVERGE]
