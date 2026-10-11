[PERSPECTIVE P01: Resolve T01 with "anchor line" model]
The granularity mismatch (T01) dissolves if we designate one lyric line per meaning as the "anchor" that owns the annotation, while sibling lines in the same semantic group inherit visibility. When playback enters any line in the group, the meaning panel shows the anchor's annotation. This avoids redundant data ("see above") and preserves line-level indexing: meanings remain a sparse array keyed by anchor line index, with a `groupEndIndex` field to define scope.

[PERSPECTIVE P02: T02 resolves toward inline-with-grouping hybrid]
Eclair's inline camp and Muffin's parallel camp are not mutually exclusive. Extend `LyricLine` with `meaning?: string` for the anchor line AND `meaningAnchor?: number` for grouped lines pointing back to their anchor. This keeps a single file (no `.meanings.json` drift), enables verse-level annotations, and requires zero changes to `useLyricSync` since timestamps remain per-line.

[REFINEMENT: My Round 0 "line-indexed not time-indexed" stance]
I refine my prior position: line-indexing is correct, but must accommodate grouping. The anchor model preserves line-indexing while solving the verse-span problem Donut and Brioche raised.

[RESOLVED T04]
Scone's ARIA pattern (polite + 1-2s delay) is implementable regardless of data structure decisions. No architectural conflict.

[MOVE:CONVERGE]
