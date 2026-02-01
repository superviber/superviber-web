# Alignment Dialogue: Interactive Alignment Demo Page

**Draft**: Dialogue 2028
**Date**: 2026-02-01 16:28Z
**Status**: CONVERGED
**Participants**: 💙 Judge, 🧁 Muffin, 🧁 Cupcake, 🧁 Scone, 🧁 Eclair, 🧁 Donut, 🧁 Brioche

## Expert Panel

| Agent | Role | Tier | Relevance | Emoji |
|-------|------|------|-----------|-------|
| 💙 Judge | Orchestrator | — | — | 💙 |
| 🧁 Muffin | Systems Thinker | Core | 0.95 | 🧁 |
| 🧁 Cupcake | Domain Expert | Core | 0.90 | 🧁 |
| 🧁 Scone | Devil's Advocate | Adjacent | 0.70 | 🧁 |
| 🧁 Eclair | Integration Specialist | Adjacent | 0.65 | 🧁 |
| 🧁 Donut | Risk Analyst | Adjacent | 0.60 | 🧁 |
| 🧁 Brioche | First Principles Reasoner | Wildcard | 0.40 | 🧁 |

## Final Alignment Scoreboard

| Agent | Wisdom | Consistency | Truth | Relationships | **Total** |
|-------|--------|-------------|-------|---------------|-----------|
| 🧁 Muffin | 12 | 11 | 12 | 11 | **46** |
| 🧁 Cupcake | 14 | 12 | 12 | 12 | **50** |
| 🧁 Scone | 14 | 12 | 13 | 13 | **52** |
| 🧁 Eclair | 13 | 12 | 12 | 12 | **49** |
| 🧁 Donut | 13 | 12 | 13 | 12 | **50** |
| 🧁 Brioche | 14 | 13 | 13 | 13 | **53** |

**Total ALIGNMENT**: 300
**Velocity**: R0→R1 = +112, R1→R2 = +97 (declining toward convergence)

## Tensions Tracker — FINAL

| ID | Tension | Status | Raised | Resolved |
|----|---------|--------|--------|----------|
| T01 | Static vs. authentic — pre-computed risks scripted feel | **RESOLVED** | R0 | R2 — Round progression + mandatory peerReferences |
| T02 | NxM matrix explosion with selectable questions + ADRs | **RESOLVED** | R0 | R1 — 1 question × 3 ADR bundles |
| T03 | Marketing page vs. educational tool conflict | **RESOLVED** | R0 | R1 — Demo IS education at /demo/alignment |
| T04 | Demo expectations vs. static reality | **RESOLVED** | R0 | R1 — Frame as "Explore how experts reached consensus" |
| T05 | Document classification: source is "Not for Public" | **RESOLVED** | R0 | R2 — Synthetic ADRs ship with RFC |

## Key Perspectives (Selected)

| ID | Agent | Perspective | Round |
|----|-------|-------------|-------|
| P01 | 🧁 Muffin | Static demo paradox — clarify static vs live | 0 |
| P03 | 🧁 Cupcake | Side-by-side calibration comparison is core | 0 |
| P11 | 🧁 Brioche | The delta matters more than the demo | 0 |
| P13 | 🧁 Cupcake | Round progression is the missing authenticity signal | 1 |
| P14 | 🧁 Scone | Round progression is the demo, not the delta | 1 |
| P15 | 🧁 Brioche | Round progression is the authenticity proof | 1 |
| P16 | 🧁 All | Synthetic ADR authorship must be RFC-specified | 2 |

## Round Summaries

### Round 0
Surfaced 5 core tensions. Universal agreement that "the delta is the demo" — showing the same expert under different ADR constraints is the pedagogical value.

### Round 1
Resolved T02-T04. Key insight: **Round progression IS the authenticity signal**. Watching experts change positions citing peers is unfakeable.

### Round 2
Resolved T01 and T05. Universal convergence: **Synthetic ADRs must ship with RFC**, authored in-house, not deferred to implementation.

## Converged Specification

### Data Architecture
```typescript
interface DialogueDemo {
  question: string;
  adrBundle: "none" | "conservative" | "esg-first";
  rounds: Round[];
}

interface ExpertContribution {
  agent: string;
  position: string;
  peerReferences: PeerReference[];  // MANDATORY rounds 1+
  moves?: Move[];
}
```

### Scope
- **1 question**: "Should we add TechCo to the portfolio?"
- **3 ADR bundles**: None, Conservative (ADR-0001+0002), ESG-First (+0003)
- **3-4 rounds per dialogue** showing convergence

### UI Pattern
- Route: `/demo/alignment`
- Mobile: Vertical card stack with swipe
- Desktop: Side-by-side with round stepper
- Cross-reference links for audit trail

> Full agent responses: `/tmp/blue-dialogue/interactive-alignment-demo-page/round-{0,1,2}/*.md`
