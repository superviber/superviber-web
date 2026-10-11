# Scoreboard — Song Meanings Feature RFC

| Round | W | C | T | R | Score | Σ | Open T | New P | Velocity | Converge % |
|-------|---|---|---|---|-------|---|--------|-------|----------|------------|
| 0     | 28| 22| 18| 14| 82    | 82| 4      | 14    | 18       | 0%         |
| 1     | 32| 28| 24| 18| 102   |184| 0      | 0     | 0        | 100%       |

## Agent Scores — Cumulative

| Agent | R0 | R1 | Total |
|-------|----|----|-------|
| 🧁 Muffin | 11 | 14 | **25** |
| 🧁 Cupcake | 12 | 14 | **26** |
| 🧁 Scone | 10 | 13 | **23** |
| 🧁 Eclair | 10 | 15 | **25** |
| 🧁 Donut | 11 | 13 | **24** |
| 🧁 Brioche | 9 | 12 | **21** |
| 🧁 Croissant | 11 | 12 | **23** |
| 🧁 Macaron | 8 | 9 | **17** |

**Total ALIGNMENT**: 184

## Convergence Status

✅ **CONVERGED** — Round 1
- Velocity: 0 (no open tensions, no new perspectives)
- Converge %: 100% (8/8 experts signaled `[MOVE:CONVERGE]`)

## Key Resolutions

| Tension | Resolution |
|---------|------------|
| T01 (Granularity) | **Anchor-line model** with `lineSpan` — meanings attach to one line, display over span |
| T02 (Data structure) | **Hybrid** — parallel `.meanings.json` for storage, merged into `LyricLine[]` at runtime |
| T03 (AI timing) | **Pre-generate** with admin review + "Regenerate" button |
| T04 (Accessibility) | **Accepted** — `aria-live="polite"` with 1-2s delay, single announcement per group |
