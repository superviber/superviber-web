# Round 0 Summary — Song Meanings Feature RFC

## 💙 Judge Synthesis

Round 0 surfaced **strong convergence on UX patterns** but **architectural tensions on data modeling**.

### What Converged ✓

1. **Mobile: Tap-to-reveal** — All 8 experts reject side-by-side on narrow views. Consensus: tap current lyric line → bottom sheet or inline expansion. Preserves karaoke scroll rhythm.

2. **Desktop: Right panel** — Implicit agreement that wide views show meanings in a dedicated right panel alongside lyrics.

3. **Preserve karaoke aesthetic** — The existing glow effects, scale transforms (0.9x-1.25x), and `origin-left` styling require visual breathing room. Meanings must not compress this.

4. **Leverage existing infrastructure** — Multiple experts advocate reusing `useLyricSync`, `findCurrentLineIndex`, LRC parser, and admin editor patterns.

### Open Tensions ✗

**T01: Granularity mismatch** — The sharpest tension. Lyrics are per-line but meanings are often per-verse/section. Options:
- (a) Force 1:1 line-meaning mapping (redundant, awkward)
- (b) Group lines with `meaningId` (Muffin)
- (c) Separate range-based annotation layer (Donut, Brioche)

**T02: Data structure** — Two camps:
- **Inline camp** (Eclair, Croissant): Extend `LyricLine` with `meaning?: string` — simpler, single source
- **Parallel camp** (Muffin, Macaron): Separate `.meanings.json` or `.meanings.lrc` — independent editability

**T03: AI generation timing** — Pre-generate vs on-demand:
- Pre-generate: Admin can review, static files, but staleness risk
- On-demand: Fresh, but latency and no review
- Most lean toward pre-generate given existing static file architecture

**T04: Accessibility** — Scone raises ARIA live region conflict. Meanings need `aria-live="polite"` with 1-2s delay after lyrics.

### Recommendations for Round 1

1. **Resolve T01 first** — Granularity decision cascades to data structure and admin tooling
2. **Propose hybrid for T02** — Perhaps inline for line-level meanings + optional grouping for verse-level
3. **Defer T03** — Pre-generate is path of least resistance; revisit on-demand later
4. **Accept T04** — Scone's ARIA pattern is implementable regardless of other decisions

### Perspectives Inventory

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

**Velocity: 18** (4 open tensions + 14 new perspectives)
**Converge %: 0%** (no `[MOVE:CONVERGE]` signals yet)
