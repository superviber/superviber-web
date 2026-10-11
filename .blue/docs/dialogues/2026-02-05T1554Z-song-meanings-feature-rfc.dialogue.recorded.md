# Alignment Dialogue: Song Meanings Feature RFC

**Draft**: Dialogue 2035
**Date**: 2026-02-05 15:54Z
**Status**: In Progress
**Participants**: 💙 Judge, 🧁 Muffin, 🧁 Cupcake, 🧁 Scone, 🧁 Eclair, 🧁 Donut, 🧁 Brioche, 🧁 Croissant, 🧁 Macaron

## Expert Pool

**Domain**: Music Player UX & Content Architecture
**Question**: How should we implement a song meaning feature with Claude-generated content, time-synced display alongside lyrics, admin editing tools, and mobile/narrow view strategy?

| Tier | Experts |
|------|--------|
| Core | Frontend Architect, UX Designer, Content Strategist, Mobile UX Specialist |
| Adjacent | API Designer, Performance Engineer, Accessibility Advocate, Music Domain Expert, Admin Tooling Specialist, Data Architect |
| Wildcard | AI Integration Specialist, Creative Director, Contrarian, Minimalist Advocate |

## Expert Panel

| Agent | Role | Tier | Relevance | Emoji |
|-------|------|------|-----------|-------|
| 💙 Judge | Orchestrator | — | — | 💙 |
| 🧁 Muffin | Frontend Architect | Core | 0.95 | 🧁 |
| 🧁 Cupcake | UX Designer | Core | 0.92 | 🧁 |
| 🧁 Scone | Accessibility Advocate | Adjacent | 0.68 | 🧁 |
| 🧁 Eclair | Music Domain Expert | Adjacent | 0.65 | 🧁 |
| 🧁 Donut | Performance Engineer | Adjacent | 0.70 | 🧁 |
| 🧁 Brioche | API Designer | Adjacent | 0.75 | 🧁 |
| 🧁 Croissant | AI Integration Specialist | Wildcard | 0.45 | 🧁 |
| 🧁 Macaron | Creative Director | Wildcard | 0.40 | 🧁 |

## Alignment Scoreboard

| Round | W | C | T | R | Score | Σ | Open T | New P | Velocity | Converge % |
|-------|---|---|---|---|-------|---|--------|-------|----------|------------|
| 0     | 28| 22| 18| 14| 82    | 82| 4      | 14    | 18       | 0%         |

| Agent | W | C | T | R | Total |
|-------|---|---|---|---|-------|
| 🧁 Muffin | 4 | 3 | 2 | 2 | **11** |
| 🧁 Cupcake | 4 | 3 | 3 | 2 | **12** |
| 🧁 Scone | 4 | 3 | 2 | 1 | **10** |
| 🧁 Eclair | 3 | 3 | 2 | 2 | **10** |
| 🧁 Donut | 4 | 3 | 2 | 2 | **11** |
| 🧁 Brioche | 3 | 2 | 2 | 2 | **9** |
| 🧁 Croissant | 3 | 3 | 3 | 2 | **11** |
| 🧁 Macaron | 3 | 2 | 2 | 1 | **8** |

**Total ALIGNMENT**: 82

## Perspectives Inventory

| ID | Agent | Perspective | Round |
|----|-------|-------------|-------|
| P01 | 🧁 Muffin | LRC format extension for time-synced meanings | 0 |
| P02 | 🧁 Muffin | Mobile demands a toggle, not a separate view | 0 |
| P03 | 🧁 Cupcake | Progressive disclosure trumps side-by-side on mobile | 0 |
| P04 | 🧁 Cupcake | Meaning data structure must be line-indexed, not time-indexed | 0 |
| P05 | 🧁 Scone | Screen reader synchronization (ARIA delays) | 0 |
| P06 | 🧁 Scone | Mobile tap-to-reveal preserves focus | 0 |
| P07 | 🧁 Eclair | Extend LyricLine rather than create parallel structures | 0 |
| P08 | 🧁 Eclair | Mobile-first progressive disclosure via tap-to-reveal | 0 |
| P09 | 🧁 Donut | Time-sync granularity mismatch (range-based layer) | 0 |
| P10 | 🧁 Donut | Mobile as primary context, not fallback | 0 |
| P11 | 🧁 Brioche | Time-synced meanings require LRC format extension | 0 |
| P12 | 🧁 Brioche | Mobile tap-to-reveal, not scroll-away | 0 |
| P13 | 🧁 Croissant | Meanings as line-level annotations in LyricLine | 0 |
| P14 | 🧁 Croissant | Mobile UX via tap-to-reveal inline accordion | 0 |
| P15 | 🧁 Macaron | Meanings as parallel time-synced track | 0 |
| P16 | 🧁 Macaron | Mobile-first interaction over layout mirroring | 0 |

## Tensions Tracker

| ID | Tension | Status | Raised | Resolved |
|----|---------|--------|--------|----------|
| T01 | Granularity mismatch: line-level lyrics vs verse-level meanings | Open | 🧁 Muffin, 🧁 Donut, 🧁 Brioche, 🧁 Macaron | — |
| T02 | Data structure: extend LyricLine vs parallel file | Open | 🧁 Muffin, 🧁 Eclair, 🧁 Croissant, 🧁 Macaron | — |
| T03 | AI generation timing: pre-generate vs on-demand | Open | 🧁 Cupcake, 🧁 Eclair, 🧁 Donut, 🧁 Brioche, 🧁 Croissant | — |
| T04 | Accessibility: ARIA live region conflicts | Open | 🧁 Scone | — |

## Round 0: Opening Arguments

*Full responses in `.blue/dialogues/2026-02-05T1554Z-song-meanings-feature-rfc/round-0/*.md`*

### 💙 Judge Summary

**Convergence achieved on UX patterns:**
- Mobile: Tap-to-reveal (bottom sheet or inline expansion) — 8/8 agree
- Desktop: Right panel alongside lyrics — implicit consensus
- Preserve karaoke aesthetic (glow, scale, scroll)

**Open tensions to resolve:**
1. **T01 Granularity**: Line vs verse/section meanings
2. **T02 Data structure**: Inline vs parallel
3. **T03 AI timing**: Pre-generate vs on-demand
4. **T04 Accessibility**: ARIA delays for screen readers

---

## Round 1: Resolution

*Full responses in `.blue/dialogues/2026-02-05T1554Z-song-meanings-feature-rfc/round-1/*.md`*

### 💙 Judge Summary

**100% CONVERGENCE ACHIEVED** — All 8 experts signaled `[MOVE:CONVERGE]`

| Tension | Resolution |
|---------|------------|
| T01 (Granularity) | **Anchor-line model** with `lineSpan` — meanings attach to one line, display over span |
| T02 (Data structure) | **Hybrid** — parallel `.meanings.json` for storage, merged into `LyricLine[]` at runtime |
| T03 (AI timing) | **Pre-generate** with admin review + "Regenerate" button |
| T04 (Accessibility) | **Accepted** — `aria-live="polite"` with 1-2s delay, single announcement per group |

---

## Final Scoreboard

| Round | W | C | T | R | Score | Σ | Open T | New P | Velocity | Converge % |
|-------|---|---|---|---|-------|---|--------|-------|----------|------------|
| 0     | 28| 22| 18| 14| 82    | 82| 4      | 14    | 18       | 0%         |
| 1     | 32| 28| 24| 18| 102   |184| 0      | 0     | 0        | 100%       |

**Total ALIGNMENT**: 184

---

## Converged Architecture

```
Data Model:
├── /data/lyrics/{videoId}.lrc           ← Lyrics (existing)
└── /data/meanings/{videoId}.json        ← Meanings (new)
    {
      "meanings": [
        { "anchorLine": 0, "lineSpan": 4, "meaning": "...", "source": "ai", "reviewed": false },
        { "anchorLine": 8, "lineSpan": 1, "meaning": "...", "source": "admin", "reviewed": true }
      ]
    }

Runtime merge:
LyricLine[] + meanings.json → EnrichedLyricLine[] with optional meaning field

UI:
├── Desktop (wide): Right panel with time-synced meanings
├── Mobile (narrow): Tap-to-reveal (bottom sheet or inline expansion)
└── Admin: MeaningsEditor with anchor/span selection + Claude regenerate button

Accessibility:
├── aria-live="polite" on meanings region
├── Announce once per group transition (not per line)
└── Keyboard: Enter/Space expand, Escape collapse
```

