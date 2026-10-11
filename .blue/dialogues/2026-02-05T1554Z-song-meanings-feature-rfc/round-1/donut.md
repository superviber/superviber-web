[PERSPECTIVE P01: Resolve T01 with hybrid: line-anchored meanings with optional grouping]
T01 (granularity mismatch) dissolves if meanings attach to a primary line index but carry an optional `lineSpan: number` indicating how many subsequent lines share the annotation. This gives admins precise control: verse-level meaning on the first line with `lineSpan: 4` versus line-specific annotations with no span. The UI shows the meaning when any line in the span is current, avoiding flicker. This bridges Muffin's `meaningId` grouping with Cupcake's line-indexed simplicity.

[PERSPECTIVE P02: Parallel file wins for admin velocity]
T02 should resolve toward Macaron/Muffin's parallel structure (`.meanings.json`). Embedding meanings in LRC burdens the existing parser and couples lyric corrections with meaning edits. A separate file indexed by line number lets admins regenerate or swap meanings without retiming lyrics. The `LyricsEditor` fork becomes `MeaningsEditor` with independent save cycles.

[REFINEMENT: T03 resolves to pre-generate with regenerate button]
The pre-generate path dominates given static file architecture. Add a "Regenerate with Claude" button in admin tooling that overwrites the meanings file but marks it as AI-generated (vs human-edited) for future audit. This addresses Croissant's staleness concern while preserving editorial control.

[RESOLVED T04]
Scone's ARIA delay pattern is implementation-ready and orthogonal to T01/T02 decisions. Accept it.

[MOVE:CONVERGE]

---
