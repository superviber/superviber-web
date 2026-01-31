# Alignment Dialogue: Lyrics Scroll Implementation RFC

**Draft**: Dialogue 2027
**Date**: 2026-01-31 00:08Z
**Status**: In Progress
**Participants**: 💙 Judge, 🧁 Muffin, 🧁 Cupcake, 🧁 Scone, 🧁 Eclair, 🧁 Donut, 🧁 Brioche

## Expert Panel

| Agent | Role | Tier | Relevance | Emoji |
|-------|------|------|-----------|-------|
| 💙 Judge | Orchestrator | — | — | 💙 |
| 🧁 Muffin | Technical Writer | Core | 0.95 | 🧁 |
| 🧁 Cupcake | Systems Thinker | Core | 0.90 | 🧁 |
| 🧁 Scone | Domain Expert | Adjacent | 0.70 | 🧁 |
| 🧁 Eclair | Devil's Advocate | Adjacent | 0.65 | 🧁 |
| 🧁 Donut | Integration Specialist | Adjacent | 0.60 | 🧁 |
| 🧁 Brioche | Risk Analyst | Wildcard | 0.40 | 🧁 |

## Alignment Scoreboard

| Agent | Wisdom | Consistency | Truth | Relationships | **Total** |
|-------|--------|-------------|-------|---------------|-----------|
| 🧁 Muffin | 3 | 2 | 2 | 1 | **8** |
| 🧁 Cupcake | 3 | 2 | 2 | 1 | **8** |
| 🧁 Scone | 2 | 2 | 2 | 1 | **7** |
| 🧁 Eclair | 2 | 2 | 2 | 1 | **7** |
| 🧁 Donut | 2 | 2 | 2 | 1 | **7** |
| 🧁 Brioche | 3 | 2 | 2 | 1 | **8** |

**Total ALIGNMENT**: 45
**Velocity**: +45 (Round 0)

## Perspectives Inventory

| ID | Agent | Perspective | Round |
|----|-------|-------------|-------|
| P01 | 🧁 Muffin | Top padding removal contradicts threshold logic | 0 |
| P02 | 🧁 Muffin | Edge case handling needs explicit specification | 0 |
| P03 | 🧁 Cupcake | Scroll state machine needs explicit phases | 0 |
| P04 | 🧁 Cupcake | Cleanup scope includes padding hack | 0 |
| P05 | 🧁 Scone | Padding creates false center | 0 |
| P06 | 🧁 Scone | Container height is the missing threshold | 0 |
| P07 | 🧁 Eclair | Padding-based centering is architectural debt | 0 |
| P08 | 🧁 Eclair | currentLineIndex=-1 creates initialization ambiguity | 0 |
| P09 | 🧁 Donut | Center threshold requires stateful transition tracking | 0 |
| P10 | 🧁 Donut | Top padding conflicts with start-at-top principle | 0 |
| P11 | 🧁 Brioche | Padding hack defeats the threshold | 0 |
| P12 | 🧁 Brioche | Container scroll state lost on song changes | 0 |

## Tensions Tracker

| ID | Tension | Status | Raised | Resolved |
|----|---------|--------|--------|----------|
| T01 | Smooth scroll timing conflicts with rapid line changes | Open | 🧁 Muffin | — |
| T02 | currentLineIndex=-1 creates initialization ambiguity | Open | 🧁 Cupcake, 🧁 Scone, 🧁 Eclair, 🧁 Donut | — |
| T03 | No concrete definition of "center threshold" measurement | Open | 🧁 Brioche | — |
| T04 | Component remount on song change loses scroll state | Open | 🧁 Brioche | — |
| T05 | Oscillation risk during seeks/rewinds | Open | 🧁 Donut | — |

## Round 0: Opening Arguments

### 🧁 Muffin

[PERSPECTIVE P01: Top padding removal contradicts threshold logic]
The current implementation has 128px top padding (line 78) to center the first line, directly violating ADR 0001's "start scrolled to the top" requirement. The RFC must specify removing this padding AND the unconditional centering logic (lines 42-47), replacing it with conditional scroll triggered only when the active line's offsetTop exceeds containerHeight/2.

[PERSPECTIVE P02: Edge case handling needs explicit specification]
ADR 0001 mentions "very short lyrics" and "near bottom" edge cases but the current scroll effect has no guards for these. The RFC should mandate: (1) minimum line count check, (2) detecting near-bottom to prevent padding scrolls, (3) handling currentLineIndex === -1 without triggering scroll.

[TENSION T01: Smooth scroll timing conflicts with rapid line changes]
Lines 44-47 use behavior: 'smooth' which introduces 300-500ms animation that can lag behind rapid lyric transitions.

### 🧁 Cupcake

[PERSPECTIVE P01: Scroll state machine needs explicit phases]
The ADR defines behavioral phases (pre-threshold, at-threshold, during playback) but current implementation treats every line change identically with unconditional centering. An RFC should specify a state machine with explicit threshold detection.

[PERSPECTIVE P02: Cleanup scope includes padding hack]
Lines 78 and 106 use large padding divs (h-32) to enable centering of first/last lines, which conflicts with ADR's "start at top" requirement. Must be removed as part of cleanup.

[TENSION T01: currentLineIndex=-1 ambiguity]
useLyricSync returns -1 before first line activation, but LyricsPanel interprets -1 as "center on first line", contradicting ADR's start-at-top instruction.

### 🧁 Scone

[PERSPECTIVE P01: Padding creates false center]
The current implementation uses top/bottom padding (h-16 lg:h-32) to center lines, which conflicts with ADR 0001's requirement to start at top. The padding allows centering but should only be used after threshold is crossed.

[PERSPECTIVE P02: Container height is the missing threshold]
ADR 0001 specifies "once the active line would appear below the vertical center" but codebase has no logic comparing lineEl.offsetTop against containerHeight/2. The threshold check must precede the scroll decision.

[TENSION T01: Initial state ambiguity]
useLyricSync initializes currentLineIndex to -1, but LyricsPanel's scroll effect treats -1 as "center on first line". Creates immediate scroll on mount.

### 🧁 Eclair

[PERSPECTIVE P01: Padding-based centering is architectural debt]
The h-16/h-32 padding divs couple scroll behavior to DOM structure. ADR 0001's "scroll-when-needed" strategy requires dynamic threshold detection, which cannot be achieved by static padding alone.

[PERSPECTIVE P02: currentLineIndex=-1 creates initialization ambiguity]
useLyricSync returns -1 before playback, but LyricsPanel interprets -1 as "center on first line". Conflicts with ADR 0001's start-at-top requirement.

[TENSION T01: Smooth scrolling may conflict with threshold-based triggering]
The current smooth scroll animation takes time to complete. If threshold is crossed during rapid line changes, queued smooth scrolls could cause visible lag.

### 🧁 Donut

[PERSPECTIVE P01: Center threshold requires stateful transition tracking]
The ADR specifies scrolling should only begin once line is below center, but current implementation always centers. Implementing this requires tracking whether threshold has been crossed to prevent oscillation.

[PERSPECTIVE P02: Top padding conflicts with start-at-top principle]
Lines 78 and 106 add padding to enable centering first/last lines, directly contradicting ADR requirement. Must address removing padding while preserving near-bottom handling.

[TENSION T01: currentLineIndex=-1 initialization hides scroll behavior bug]
The -1 initialization masks the always-center behavior since no line is highlighted initially. RFC needs to clarify scroll-to-top semantics.

### 🧁 Brioche

[PERSPECTIVE P01: The padding hack defeats the threshold]
The padding at top/bottom explicitly centers first/last lines, creating the exact "jarring scroll" behavior ADR 0001 was designed to prevent.

[PERSPECTIVE P02: Container scroll state lost on song changes]
LyricsPanel receives `key={currentVideoId}` which unmounts/remounts component on song change. Any threshold-crossing state will be reset.

[TENSION T01: No definition of "center threshold"]
ADR 0001 specifies scroll begins when line is "below vertical center" but provides no concrete measurement—top edge, center, or bottom edge?

---

## 💙 Judge: Round 0 Synthesis

**Remarkable convergence.** All 6 experts independently identified the same root cause: padding-based centering fundamentally conflicts with ADR 0001.

### Unanimous Agreement
1. Remove padding divs (h-16/h-32 at lines 78, 106)
2. Add threshold check: offsetTop > containerHeight/2
3. Replace unconditional scroll with conditional
4. Fix currentLineIndex=-1 bug

### Open Tensions for Round 1
- T01: Smooth scroll timing vs rapid transitions
- T02: currentLineIndex=-1 semantics
- T03: Threshold measurement definition
- T04: Song change remount state loss
- T05: Seek oscillation prevention

---

## Round 1: Tension Resolution

### 🧁 Muffin

[RESOLVED T02] Treat -1 as explicit "no-op" state. Add early return guard: `if (currentLineIndex < 0) return;`

[CONCESSION] Brioche's threshold measurement (line's top edge) is more precise.

[RESOLVED T03] Threshold check: `const shouldScroll = lineEl.offsetTop > container.clientHeight / 2;`

[RESOLVED T04] Component remount on song change is intentional—provides natural reset.

[PERSPECTIVE P03] RFC must specify implementation order to avoid intermediate broken states.

### 🧁 Cupcake

[RESOLVED T02] -1 means "before playback starts" and should trigger NO scroll behavior. Add `if (currentLineIndex < 0) return`.

[RESOLVED T03] Threshold: `lineElement.offsetTop > containerElement.clientHeight / 2` using top edge.

[CONCESSION] Brioche correctly identified remount issue. Accept reset-on-song-change as correct behavior.

[REFINEMENT] Scroll behavior is now a pure function: `hasPassedThreshold && currentLineIndex >= 0`.

[PERSPECTIVE P03] Implementation order matters: removals before additions.

### 🧁 Scone

[RESOLVED T02] When currentLineIndex=-1, perform NO scroll operation. Remove fallback to 0.

[RESOLVED T03] Threshold formula: `lineEl.offsetTop > containerRef.current.clientHeight / 2`.

[CONCESSION] Donut's state machine prevents seek oscillation.

[REFINEMENT] Use 'smooth' for normal playback, 'instant' when line changes occur within <500ms.

[PERSPECTIVE P03] Minimum conditions: if `lines.length <= 3`, disable centering entirely.

### 🧁 Eclair

[RESOLVED T02] When currentLineIndex === -1, return early without any scroll operation.

[CONCESSION] Brioche's component remount blocks stateful threshold tracking. Threshold must be stateless.

[RESOLVED T03] `lineEl.offsetTop > container.clientHeight / 2` using line's TOP edge.

[RESOLVED T05] Oscillation prevented by line position, not scroll position. Stateless threshold.

[CONCESSION] Cupcake's state machine framing (phases: Pre-threshold, Post-threshold, Not started) is correct.

### 🧁 Donut

[RESOLVED T02] When currentLineIndex === -1, skip scroll logic entirely. -1 means "playback hasn't started, don't interfere."

[RESOLVED T03] `lineEl.offsetTop > containerHeight/2` using line's top edge. Padding removal mandatory for accuracy.

[CONCESSION] Brioche's component remount insight—threshold state is per-song, not persistent.

[PERSPECTIVE P01] Threshold state prevents seek-backward oscillation via latching `hasPassedThreshold`.

### 🧁 Brioche

[RESOLVED T03] Threshold: `lineElement.offsetTop > containerElement.clientHeight / 2` using line's **top edge**.

[RESOLVED T04] Accept reset behavior as correct—each new song should start at top.

[CONCESSION] Muffin/Eclair correctly identified smooth scroll lag risk. Use instant for rapid transitions.

[CONCESSION] Cupcake's state machine framing is architecturally superior.

[REFINEMENT] Add dynamic bottom-proximity check for end-of-song centering.

---

## 💙 Judge: CONVERGENCE DECLARED

**Total ALIGNMENT: 97** (Round 0: 45, Round 1: +52)

### ALL TENSIONS RESOLVED

| Tension | Resolution | Agreement |
|---------|------------|-----------|
| T01 | Conditional smooth/instant based on distance | 4/6 |
| T02 | Add `if (currentLineIndex < 0) return` guard | 6/6 |
| T03 | `lineEl.offsetTop > container.clientHeight / 2` | 6/6 |
| T04 | Ephemeral state is correct, remount = reset | 5/6 |
| T05 | Stateless threshold (line position, not scroll) | 5/6 |

### RFC Implementation Specification

1. **Remove padding divs** at lines 78, 106 (h-16/h-32)
2. **Add -1 guard**: `if (currentLineIndex < 0) return`
3. **Add threshold check**: `const shouldScrollToCenter = lineEl.offsetTop > container.clientHeight / 2`
4. **Conditional scroll behavior**: smooth for <1 viewport, instant for larger
5. **Test edge cases**: first line, last line, rapid transitions, seeks

### Key Architectural Decisions

- Threshold is **stateless** (computed each render from DOM geometry)
- Component remount on song change is **intentional** (provides natural reset)
- currentLineIndex=-1 means **"no scroll action"** (not "scroll to first line")
- Scroll triggers when line's **top edge** crosses container's **vertical center**

---

**Status: CONVERGED**
**Dialogue Complete: 2026-01-31**
