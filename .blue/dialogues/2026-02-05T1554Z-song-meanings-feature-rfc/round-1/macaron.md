[PERSPECTIVE P01: Resolve T01 with anchor-line model]
The granularity mismatch dissolves if we think of meanings as anchored to a single "representative" line but visually spanning its context. Each meaning block stores: `anchorLineIndex` (which line triggers display), `lineSpan` (how many lines it covers, default 1). When playback reaches the anchor, show the meaning; it remains visible until playback exits the span. This preserves line-level timestamps while supporting verse-level semantics, and the admin editor only needs to mark anchor + span rather than complex range timestamps.

[PERSPECTIVE P02: Data structure is a false dichotomy]
T02 frames inline vs. parallel as mutually exclusive, but the real question is serialization vs. runtime. Store meanings in a parallel `.meanings.json` (independent editing, no LRC format pollution), but at load time merge into an enriched `LyricLine[]` with optional `meaning` fields. The separation exists for authoring; the union exists for rendering. Both camps get what they need.

[REFINEMENT: Cupcake's line-indexed model]
Cupcake's P02 (line-indexed, not time-indexed) is correct but incomplete. Line indices break if lyrics are reordered during editing. Add a stable `lineId` (hash of text+time) so meaning references survive edits.

[RESOLVED T04]
Scone's ARIA delay pattern (lyrics first, meaning 1-2s later with `aria-live="polite"`) works regardless of T01-T03 resolutions. Mark this as accepted.

[MOVE:CONVERGE]
