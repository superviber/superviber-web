[PERSPECTIVE P01: Resolve T01 via hybrid grouping with pointer inheritance]
The granularity mismatch resolves if we allow line-level meanings (Eclair/Croissant's inline approach) with an optional `meaningGroupId` pointer: lines sharing the same `meaningGroupId` display a single verse-level meaning. First line in the group holds the full text; subsequent lines inherit via pointer. This satisfies both camps: inline for simple cases, grouping for verses, no parallel file required.

[PERSPECTIVE P02: Admin UI drives the granularity decision]
The admin editor should let curators choose granularity per annotation: "apply to this line" vs "apply to lines 3-8." The data model follows the UX need, not vice versa. This makes T01 a UI problem, not a data structure debate.

[REFINEMENT: Cupcake's line-indexed model + grouping]
Cupcake's sparse array `meanings: (string | null)[]` remains valid if we add a `meaningGroupStart?: number` field to non-null entries, indicating the first line of a group. Lines within that range display the group's meaning. Indexing stays line-based; grouping becomes metadata.

[RESOLVED T04]
Scone's ARIA pattern (1-2s delay, `aria-live="polite"` on meanings) is orthogonal to data structure decisions. Accept and implement regardless of T01/T02 outcome.

[MOVE:CONVERGE]
