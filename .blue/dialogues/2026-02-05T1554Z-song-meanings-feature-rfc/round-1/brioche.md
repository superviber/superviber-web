[PERSPECTIVE P01: Resolve T01 with hybrid granularity - line-level storage, groupId for display]
Store meanings at line granularity (sparse array or inline `meaning?: string`), but add an optional `meaningGroupId?: string` field so consecutive lines sharing the same groupId render as one meaning block. This gives authors flexibility (single-line annotation OR verse-spanning annotation) without requiring a separate range-based data structure or breaking existing LRC sync logic.

[PERSPECTIVE P02: Admin workflow gates AI output - resolve T03]
Pre-generate meanings on lyrics import, but store with `source: 'ai' | 'admin'` and `reviewed: boolean` flags. Admin editor shows AI-generated meanings in a different visual state (e.g., italic, badge). Meanings only render to users after admin review OR if explicit "show unreviewed AI" flag is set. This decouples generation timing from editorial control.

[REFINEMENT: T02 collapses if T01 hybrid is adopted]
If meanings use line indices with optional groupId, the inline-vs-parallel debate becomes a storage detail, not an architectural decision. Either approach works because the semantic unit is still the line; groupId is just a display hint.

[RESOLVED T04]
Scone's ARIA pattern (polite + 1-2s delay) is implementable orthogonally. No architectural dependency on other tensions.

[MOVE:CONVERGE]
