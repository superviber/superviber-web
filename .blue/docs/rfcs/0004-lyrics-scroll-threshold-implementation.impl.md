# RFC 0004: Lyrics Scroll Threshold Implementation

| | |
|---|---|
| **Status** | Implemented |
| **Date** | 2026-01-31 |
| **ADR** | [0001-lyrics-scroll-behavior](../adrs/0001-lyrics-scroll-behavior.accepted.md) |
| **Dialogue** | [2026-01-31T0008Z-lyrics-scroll-implementation-rfc](../dialogues/2026-01-31T0008Z-lyrics-scroll-implementation-rfc.dialogue.recorded.md) |

---

## Summary

Implement ADR 0001 lyrics scroll behavior: lyrics should start at top, only scroll-to-center when active line passes center threshold, and clean up previous scroll fix attempts (padding hacks, unconditional centering).

## Problem

The current LyricsPanel implementation has several issues:

1. **Padding hack** (lines 78, 106): h-16/h-32 padding divs force centering of first/last lines, contradicting "start at top"
2. **Unconditional centering** (lines 42-47): Every line change triggers scroll-to-center regardless of position
3. **-1 initialization bug** (line 33): `targetIndex = currentLineIndex >= 0 ? currentLineIndex : 0` coerces -1 to 0, causing immediate centering on mount

## Solution

### Core Algorithm

```typescript
// In LyricsPanel scroll effect
useEffect(() => {
  if (!container || lines.length === 0) return;

  // Guard: no scroll action before playback starts
  if (currentLineIndex < 0) return;

  const lineEl = lineRefs.current[currentLineIndex];
  if (!lineEl) return;

  // Threshold check: only scroll when line would appear below center
  const shouldScrollToCenter = lineEl.offsetTop > container.clientHeight / 2;
  if (!shouldScrollToCenter) return;

  // Center the active line
  const targetScroll = lineEl.offsetTop - container.clientHeight / 2 + lineEl.clientHeight / 2;
  container.scrollTo({
    top: Math.max(0, targetScroll),
    behavior: 'smooth',
  });
}, [currentLineIndex, container, lines]);
```

### Implementation Steps

1. **Remove padding divs** at lines 78, 106
   - Delete `<div className="h-16 lg:h-32" />` elements
   - This eliminates the forced centering hack

2. **Add -1 guard** before any scroll logic
   - `if (currentLineIndex < 0) return;`
   - Preserves natural scrollTop=0 on mount

3. **Add threshold check** before scrolling
   - `const shouldScrollToCenter = lineEl.offsetTop > container.clientHeight / 2;`
   - Uses line's top edge crossing container's vertical center

4. **Conditional scroll behavior** (optional enhancement)
   - Use `behavior: 'smooth'` for distance < clientHeight
   - Use `behavior: 'auto'` (instant) for larger jumps

### Key Decisions (from alignment dialogue)

| Decision | Rationale |
|----------|-----------|
| Threshold is **stateless** | Computed each render from DOM geometry; survives component remount |
| -1 means **"no scroll"** | Not "scroll to first line"; container naturally starts at scrollTop=0 |
| Remount on song change is **intentional** | `key={currentVideoId}` provides natural state reset per song |
| Use line's **top edge** | ADR says "would appear below center" = line starts rendering below midpoint |

### Files to Modify

- `src/components/player/LyricsPanel.tsx` - Main scroll logic changes
- `src/hooks/useLyricSync.ts` - No changes needed (already returns -1 correctly)

## Test Plan

- [ ] Initial load: lyrics visible at top, first line NOT centered
- [ ] Before threshold: highlight moves down without scrolling
- [ ] At threshold: scrolling begins when line.offsetTop > container.clientHeight/2
- [ ] During playback: each active line centered after threshold crossed
- [ ] Song change: new song starts at top, re-evaluates threshold
- [ ] Seek backward: scrolling continues (no oscillation)
- [ ] Rapid transitions: no animation queue buildup
- [ ] Short lyrics (<4 lines): no unnecessary scrolling
- [ ] Near bottom: last lines can still be centered

## Cleanup Scope

Remove these artifacts from previous scroll fix attempts:

1. Padding divs (h-16/h-32) at LyricsPanel.tsx lines 78, 106
2. The `targetIndex = currentLineIndex >= 0 ? currentLineIndex : 0` fallback at line 33
3. Any threshold-related state that was added during debugging

---

*Derived from 6-expert alignment dialogue with 100% convergence in 2 rounds.*

— Blue
