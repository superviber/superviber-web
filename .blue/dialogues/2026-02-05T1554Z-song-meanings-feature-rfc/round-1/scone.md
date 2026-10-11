[PERSPECTIVE P01: Keyboard navigation parity for tap-to-reveal]
The converged mobile tap-to-reveal pattern must have keyboard equivalents: Enter/Space on focused lyric line triggers expansion, Escape collapses. Without this, keyboard-only and switch-access users cannot access meanings at all, regardless of data structure decisions.

[PERSPECTIVE P02: Grouping resolves T01 with accessibility benefit]
Muffin's `meaningId` grouping approach (multiple lines referencing one meaning block) actually improves accessibility: screen readers can announce "verse annotation" once rather than repeating for each line, reducing cognitive load. This makes range-based annotations preferable to line-level for both UX consistency and assistive technology.

[REFINEMENT: T04 ARIA pattern adapts to grouping]
If meanings are verse-level (T01 resolution), the ARIA delay pattern simplifies: announce the meaning once when entering a group's first line, stay silent for subsequent lines in the group. This eliminates the "competing announcements" problem entirely rather than just delaying it.

[RESOLVED T04]
The ARIA live region conflict is resolved by combining delayed announcement with verse-level grouping: meanings announce `aria-live="polite"` only on group transitions, not line transitions.

[MOVE:CONVERGE]
