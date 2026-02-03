# RFC 0010: Alignment Dialogue Admin Tool

| | |
|---|---|
| **Status** | Implemented |
| **Date** | 2026-02-02 |
| **Dialogue** | 5-0 Convergence Achieved (3 rounds, ALIGNMENT: 195) |

---

## Summary

The demo page requires manually structured JSON assets (dialogue.json, expert-pool.json, content.json) with proper formatting, global perspective/tension numbering, and per-round summaries. Currently this is done by hand, which is error-prone and tedious. We need an admin tool that reads raw alignment dialogue outputs from `/tmp/blue-dialogue/{slug}/` and generates all required demo assets automatically.

## Verdict (from Alignment Dialogue)

> **A CLI parser tool that transforms raw dialogue files into demo-ready JSON assets with validation, idempotent output, global P/T numbering, tiered visibility, and integrated audit trails.**

## MVP Specification

### Scope: CLI Parser Tool (Post-hoc Demo Generator)

**Command**: `blue dialogue-to-demo --slug <slug>`

### Input Directory: `/tmp/blue-dialogue/{slug}/`

```
├── expert-pool.json           ← Pool definition
├── selection.log.json         ← Algorithm decision trace (if available)
├── round-0/
│   └── *.md                   ← Expert responses
├── round-0.summary.md         ← Judge synthesis
├── round-1/
│   └── *.md
├── round-1.summary.md
├── tensions.md                ← Tension tracker
└── scoreboard.md              ← Final scores
```

### Output Directory: `/public/demo/dialogues/{slug}/`

```
├── dialogue.json              ← Full metadata, rounds, verdict (admin view)
├── dialogue.public.json       ← Stripped for participant view
├── expert-pool.json           ← Enriched with scores, roundScores, selected status
├── content.json               ← All expert content with global P/T numbering
├── selection-rationale.json   ← Algorithm decision trace
└── algorithm-trace.json       ← Selection snapshots per step
```

## Key Requirements

| Requirement | Source | Implementation |
|-------------|--------|----------------|
| Loud validation failures | 🧁 Muffin | Structured warnings on schema violations, not silent omission |
| Idempotent output | 🧁 Muffin | Deterministic P/T IDs from file paths + line offsets |
| CLI-first invocation | 🧁 Cupcake | Batch processing, CI integration, no web server required |
| Selection rationale capture | 🧁 Cupcake | `selection.log.json` emitted during expert selection |
| Formal schema mapping | 🧁 Scone | Input → output transformation contract |
| Global P/T numbering | 🧁 Scone | Cross-round context accumulation (R2's P12 knows R1 yielded P01-P11) |
| Day 1 audit trails | 🧁 Eclair | `_history` arrays in parser output, not retrofitted |
| Tiered visibility | 🧁 Eclair | `dialogue.json` (full) + `dialogue.public.json` (stripped) |
| Reference graph | 🧁 Donut | P/T linkages for cross-round diff view |

## Key Features

1. **Validation with Structured Warnings** — Fail loudly on malformed input
2. **Idempotent Output** — Deterministic IDs, byte-identical reruns
3. **Global P/T Numbering** — Cross-round continuity with reference graph
4. **Tiered Visibility** — Admin vs. public JSON variants
5. **Audit Trail Integration** — `_history` arrays from Day 1
6. **Algorithm Introspection** — Decision trace capture, not reverse-engineering

## Architecture Pattern

1. Parse raw markdown → intermediate AST
2. Accumulate cross-round context (P/T counters, tension resolutions)
3. Transform to output schema with validation
4. Emit tiered JSON (full + public variants)
5. Capture `_history` provenance at each step

## Resolved Tensions

| ID | Tension | Resolution |
|----|---------|------------|
| T01 | Read-only demo vs. read-write admin needs | Post-hoc parser is read-only; admin UI is Phase 2 |
| T02 | Admin flexibility vs. process integrity | Gate enforcement at state boundaries in parser validation |
| T03 | Transparency vs. manipulation risk | Tiered visibility: dialogue.json (full) + dialogue.public.json (stripped) |
| T04 | Real-time vs. batch administration | Batch-first CLI parser; real-time deferred to Phase 2 |

## Phases

### Phase 1 (MVP): CLI Parser
- Parse raw dialogue files
- Generate demo-ready JSON assets
- Validation with structured warnings
- Global P/T numbering

### Phase 2: Admin UI
- Web-based admin interface
- Read-write operations on recorded dialogues
- SWR mutations for bidirectional state
- Real-time updates (WebSocket/SSE)

## Test Plan

- [ ] Parser correctly handles complete dialogue directory
- [ ] Validation fails loudly on missing/malformed files
- [ ] Output is byte-identical across multiple runs (idempotency)
- [ ] Global P/T numbering is correct across rounds
- [ ] Tiered visibility produces correct admin vs. public variants
- [ ] Reference graph correctly links P/T mentions across rounds

---

*"Right then. Let's get to it."*

— Blue
