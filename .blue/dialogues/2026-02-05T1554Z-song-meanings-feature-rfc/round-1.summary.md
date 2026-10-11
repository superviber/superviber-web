# Round 1 Summary — Song Meanings Feature RFC

## 💙 Judge Synthesis

**100% CONVERGENCE ACHIEVED**

All 8 experts signaled `[MOVE:CONVERGE]`. All 4 tensions resolved.

### Tension Resolutions

**T01 Granularity** → **Anchor-line model**
- Meanings attach to a primary "anchor" line with optional `lineSpan`
- When playback enters any line in the span, the meaning displays
- Avoids redundant data and complex range timestamps
- Admin selects anchor + span, not time ranges

**T02 Data structure** → **Hybrid storage/runtime**
- **Storage**: Parallel `.meanings.json` (independent editing, no LRC pollution)
- **Runtime**: Merged into enriched `LyricLine[]` with optional `meaning` field
- Both camps satisfied: parallel for authoring, inline for rendering

**T03 AI timing** → **Pre-generate with regeneration**
- Pre-generate at content creation (matches static file architecture)
- Store with `source: 'ai'|'admin'` and `reviewed: boolean` flags
- Admin "Regenerate" button overwrites AI output, preserves human edits
- Addresses staleness without requiring on-demand infrastructure

**T04 Accessibility** → **Accepted as standard**
- `aria-live="polite"` on meanings panel
- 1-2s delay after lyric announcement
- Single announcement per meaning group (not per line)
- Keyboard parity: Enter/Space to expand, Escape to collapse

### Converged Architecture

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

### Final Perspectives Inventory (Round 1)

| ID | Agent | Perspective | Round |
|----|-------|-------------|-------|
| P17 | 🧁 Muffin | Hybrid grouping with pointer inheritance | 1 |
| P18 | 🧁 Muffin | Admin UI drives granularity decision | 1 |
| P19 | 🧁 Cupcake | Anchor line model resolves T01 | 1 |
| P20 | 🧁 Cupcake | Inline-with-grouping hybrid resolves T02 | 1 |
| P21 | 🧁 Scone | Keyboard navigation parity | 1 |
| P22 | 🧁 Scone | Grouping improves accessibility | 1 |
| P23 | 🧁 Eclair | Hybrid data model (meaningId refs + map) | 1 |
| P24 | 🧁 Eclair | Pre-generate with regeneration hook | 1 |
| P25 | 🧁 Donut | Line-anchored with optional lineSpan | 1 |
| P26 | 🧁 Donut | Parallel file for admin velocity | 1 |
| P27 | 🧁 Brioche | Line-level storage with groupId | 1 |
| P28 | 🧁 Brioche | Admin workflow gates AI output | 1 |
| P29 | 🧁 Croissant | Hierarchical model (line + section levels) | 1 |
| P30 | 🧁 Croissant | Hybrid inline/parallel by granularity | 1 |
| P31 | 🧁 Macaron | Anchor-line with span count | 1 |
| P32 | 🧁 Macaron | Storage vs runtime false dichotomy | 1 |

**Velocity: 0** (0 open tensions + 0 new perspectives)
**Converge %: 100%** (8/8 `[MOVE:CONVERGE]`)
