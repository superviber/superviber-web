# RFC 0001: Interactive Alignment Demo Page

| | |
|---|---|
| **Status** | Draft |
| **Created** | 2026-02-01 |
| **Author** | 💙 Judge (via Alignment Dialogue) |
| **Dialogue** | [2026-02-01T1628Z-interactive-alignment-demo-page.dialogue.recorded.md](../dialogues/2026-02-01T1628Z-interactive-alignment-demo-page.dialogue.recorded.md) |

## Summary

Create a new page at `/demo/alignment` that walks users through an interactive demonstration of the N+1 Alignment Dialogue architecture using a financial portfolio management example. The demo shows how ADR calibration changes expert recommendations through pre-computed, statically-served dialogue transcripts.

## Motivation

The current landing page sells the *outcome* of alignment dialogues ("Multiple Perspectives. One Decision.") but doesn't show the *process*. Prospective users and stakeholders need to witness how experts converge through rounds of deliberation to understand the architecture's value.

A static demo with pre-computed content solves the cost/latency concerns of live LLM calls while still demonstrating authentic multi-agent deliberation through visible round progression.

## Design

### Core Insight

**Round progression is the authenticity signal, not just the ADR delta.**

Users watching an expert change their position in Round 2 by citing a peer's Round 1 argument experience genuine deliberation—this is unfakeable in practice because writing coherent multi-round narratives where experts cite each other is itself proof of deliberative process.

**The Alignment Panel makes convergence visible.** Users see:
- **Scoreboard**: How each agent's ALIGNMENT score grows across rounds
- **Velocity**: The declining delta that signals convergence
- **Tensions**: How conflicts surface (OPEN), get worked (RESOLVING), and resolve (RESOLVED)
- **Perspectives**: The cumulative inventory of unique viewpoints integrated into the final recommendation

This transforms the demo from "watch experts talk" to "watch alignment happen."

### Scope

| Dimension | Decision |
|-----------|----------|
| Questions | 1 canonical question: "Should we add TechCo to the portfolio?" |
| ADR Bundles | 3 presets: None, Conservative, ESG-First |
| Dialogues | 3 pre-computed dialogue trees (1 per bundle) |
| Rounds | 3-4 rounds per dialogue showing convergence |

This yields a manageable content creation scope while demonstrating the full range of calibration effects.

### Data Architecture

```typescript
interface DialogueDemo {
  question: string;  // "Should we add TechCo to the portfolio?"
  adrBundle: "none" | "conservative" | "esg-first";
  experts: ExpertInfo[];  // Panel composition
  rounds: Round[];
}

interface ExpertInfo {
  agent: string;      // "Value Analyst"
  role: string;       // "Focuses on intrinsic value, P/E ratios"
  tier: "Core" | "Adjacent" | "Wildcard";
  relevance: number;  // 0.0-1.0
}

interface Round {
  number: 0 | 1 | 2 | 3;
  experts: ExpertContribution[];
  synthesis: string;  // Judge's round summary
  state: RoundState;  // Scoreboard/tensions/perspectives at end of round
}

interface RoundState {
  scoreboard: Scoreboard;
  perspectives: Perspective[];  // Cumulative through this round
  tensions: Tension[];          // Status as of this round
}

interface ExpertContribution {
  agent: string;      // "Value Analyst"
  role: string;       // "Focuses on intrinsic value, P/E ratios"
  position: string;   // The expert's stance this round
  peerReferences: PeerReference[];  // MANDATORY in rounds 1+
  moves?: Move[];
  adrDelta?: string;  // What changed due to calibration
}

interface PeerReference {
  agent: string;      // "Risk Manager"
  round: number;      // 1
  claim: string;      // "drawdown scenarios suggest 40% downside"
}

interface Move {
  type: "REFINEMENT" | "CONCESSION" | "RESOLVED";
  description: string;
  citedTension?: string;
}

interface ADRBundle {
  id: "none" | "conservative" | "esg-first";
  name: string;
  description: string;
  adrs: ADR[];
}

interface ADR {
  id: string;         // "ADR-0001"
  title: string;      // "Long-Term Value Orientation"
  constraint: string; // "Minimum 5-year holding horizon"
}

// === ALIGNMENT TRACKING (visible in demo) ===

interface Scoreboard {
  agents: AgentScore[];
  totalAlignment: number;
  velocity: number;  // Change from previous round
}

interface AgentScore {
  agent: string;
  wisdom: number;
  consistency: number;
  truth: number;
  relationships: number;
  total: number;
  delta: number;  // Change from previous round
}

interface Perspective {
  id: string;       // "P01"
  agent: string;    // "Value Analyst"
  label: string;    // "Valuation concerns override growth potential"
  round: number;
}

interface Tension {
  id: string;       // "T01"
  description: string;
  status: "OPEN" | "RESOLVING" | "RESOLVED";
  raisedBy: string;
  raisedRound: number;
  resolvedBy?: string;
  resolvedRound?: number;
  resolution?: string;
}

interface DialogueState {
  scoreboard: Scoreboard;
  perspectives: Perspective[];
  tensions: Tension[];
}
```

### ADR Bundles

**Bundle: None (Uncalibrated)**
- No ADRs applied
- Experts give unconstrained opinions

**Bundle: Conservative**
- ADR-0001: Long-Term Value Orientation
  - "All recommendations must have a minimum 5-year holding horizon. Short-term volatility is not a valid reason to exit."
- ADR-0002: Capital Preservation Priority
  - "No single position may exceed 5% of portfolio. Cash allocation must remain between 10-30%."

**Bundle: ESG-First**
- Includes Conservative bundle, plus:
- ADR-0003: ESG Integration (Non-Negotiable)
  - "Fossil fuel extraction, private prisons, and weapons manufacturing are excluded regardless of valuation. ESG Analyst has veto power."

### UI Pattern

**Route**: `/demo/alignment`

**Desktop Layout** (Three-Panel Design):
```
┌───────────────────────────────────────────────────────────────────────────────┐
│  [Dropdown: Strategy]  None | Conservative | ESG-First                         │
│  Round 0 ──●── Round 1 ──○── Round 2 ──○── Round 3                            │
├───────────────────────────────────┬───────────────────────────────────────────┤
│         DELIBERATION PANEL        │           ALIGNMENT PANEL                 │
│                                   │                                           │
│ ┌─────────────┐ ┌─────────────┐  │  ┌─────────────────────────────────────┐  │
│ │ Value       │ │ Growth      │  │  │ 📊 SCOREBOARD                       │  │
│ │ Analyst     │ │ Analyst     │  │  │ ─────────────────────────────────── │  │
│ │ ─────────── │ │ ─────────── │  │  │ Agent      W  C  T  R  Total   Δ   │  │
│ │ "Strong buy │ │ "AI TAM is  │  │  │ Value      4  3  4  3   14    +14  │  │
│ │  at 5%..."  │ │  massive"   │  │  │ Growth     5  4  4  3   16    +16  │  │
│ │ [REFINEMENT]│ │             │  │  │ Risk       4  4  5  4   17    +17  │  │
│ └─────────────┘ └─────────────┘  │  │ ─────────────────────────────────── │  │
│                                   │  │ Total ALIGNMENT: 91   Velocity: +91│  │
│ ┌─────────────┐ ┌─────────────┐  │  └─────────────────────────────────────┘  │
│ │ Risk        │ │ ESG         │  │                                           │
│ │ Manager     │ │ Analyst     │  │  ┌─────────────────────────────────────┐  │
│ │ ─────────── │ │ ─────────── │  │  │ ⚡ TENSIONS                          │  │
│ │ "40% draw-  │ │ "Passes     │  │  │ ─────────────────────────────────── │  │
│ │  down risk" │ │  screens"   │  │  │ T01 Position sizing        OPEN     │  │
│ │ citing R0   │ │             │  │  │ T02 Income vs growth       RESOLVED │  │
│ └─────────────┘ └─────────────┘  │  └─────────────────────────────────────┘  │
│                                   │                                           │
├───────────────────────────────────┤  ┌─────────────────────────────────────┐  │
│  💙 Judge Synthesis:              │  │ 💡 PERSPECTIVES                     │  │
│  "Convergence forming on 3%..."   │  │ ─────────────────────────────────── │  │
│                                   │  │ P01 Value: Overvalued at 60x        │  │
│                                   │  │ P02 Growth: AI TAM is massive       │  │
│                                   │  │ P03 Risk: 40% drawdown possible     │  │
│                                   │  │ P04 ESG: Passes all screens         │  │
└───────────────────────────────────┴───────────────────────────────────────────┘
```

**Alignment Panel Components**:

1. **Scoreboard** (always visible)
   - Shows all agent scores: Wisdom, Consistency, Truth, Relationships
   - Total ALIGNMENT score with running total
   - Velocity (Δ from previous round) — key convergence indicator
   - Scores animate/update as user progresses through rounds

2. **Tensions Tracker** (collapsible)
   - Lists all tensions raised during dialogue
   - Status badges: OPEN (red), RESOLVING (yellow), RESOLVED (green)
   - Click tension to see which round raised/resolved it
   - Shows resolution summary when resolved

3. **Perspectives Inventory** (collapsible)
   - Lists unique perspectives surfaced
   - Grouped by agent with round indicator
   - Click to jump to that contribution in deliberation panel

**Mobile Layout** (Tab-based):
- **Tab 1: Deliberation** — Vertical card stack, swipe between rounds
- **Tab 2: Scoreboard** — Full scoreboard with animated updates
- **Tab 3: Tensions** — Tension tracker with status filters
- **Tab 4: Perspectives** — Searchable perspective list
- Bottom tab bar for switching views

**Interaction**:
- Scroll-into-view animations (not playback controls) to avoid false interactivity expectations
- Cross-reference links: Click "[citing Risk Manager R1]" scrolls to that contribution
- Strategy dropdown switches between pre-computed dialogue trees
- Scoreboard updates animate when advancing rounds
- Tension status badges update as rounds progress
- Clicking resolved tension shows resolution path

### Content Requirements

1. **3 dialogue trees** (one per ADR bundle)
2. **3-4 rounds each** with visible position evolution
3. **Mandatory peerReferences** in rounds 1+ to enable cross-reference links
4. **Synthetic ADRs** with generic naming (Acme Investment Trust, TechCo)
5. **Disclaimer**: "Demo ADRs are fictional calibrations inspired by common investment philosophy patterns"

**Per-Round State** (for Alignment Panel):
6. **Scoreboard snapshots** — Each round must include updated scores for all agents
7. **Perspectives list** — Cumulative list of perspectives surfaced, with round attribution
8. **Tensions tracker** — Status updates for each tension at each round (OPEN → RESOLVING → RESOLVED)
9. **Velocity calculation** — Delta between consecutive rounds for convergence visualization

### Integration with Existing Codebase

- Link from landing page "How It Works" button to `/demo/alignment`
- Follow existing layout patterns from `Main.tsx` (full-viewport, `h-dvh overflow-hidden`)
- Reuse existing component styling from player components
- Static JSON data files in `/public/demo/` or co-located with page

## Synthetic ADR Examples (Ship with RFC)

### ADR-0001: Long-Term Value Orientation

```markdown
## Context
We believe markets are efficient in the long run but inefficient in the short term.

## Decision
All investment recommendations must have a minimum 5-year holding horizon.
Short-term volatility is not a valid reason to exit a position.

## Consequences
- Experts should ignore quarterly earnings noise
- Focus on durable competitive advantages
- Accept short-term underperformance for long-term compounding
```

### ADR-0002: Capital Preservation Priority

```markdown
## Context
Avoiding permanent loss of capital is more important than maximizing returns.

## Decision
No single position may exceed 5% of portfolio.
Cash allocation must remain between 10-30% at all times.

## Consequences
- Concentration risk is explicitly rejected
- Opportunity cost of cash is accepted
- Experts must identify downside scenarios before upside
```

### ADR-0003: ESG Integration (Non-Negotiable)

```markdown
## Context
We believe sustainable businesses outperform over full market cycles.

## Decision
Fossil fuel extraction, private prisons, and weapons manufacturing
are excluded regardless of valuation.

## Consequences
- Some sectors permanently off-limits
- ESG Analyst has veto power on compliance
- May underperform in certain market regimes (accepted)
```

## Implementation Plan

### Phase 1: Content Creation
- [ ] Author 3 dialogue trees (None, Conservative, ESG-First)
- [ ] Ensure each has 3-4 rounds with authentic position evolution
- [ ] Include mandatory peerReferences for cross-reference linking
- [ ] Review for internal consistency (Round 2 references must match Round 1 content)

### Phase 2: Data Layer
- [ ] Define TypeScript interfaces (as specified above)
- [ ] Create static JSON data files
- [ ] Validate against schema

### Phase 3: UI Implementation
- [ ] Create `/demo/alignment` route
- [ ] Implement strategy dropdown
- [ ] Build expert card components with move markers
- [ ] Add cross-reference link navigation
- [ ] Implement responsive mobile/desktop layouts

**Alignment Panel Components**:
- [ ] Scoreboard component with animated score updates
- [ ] Tensions tracker with status badges (OPEN/RESOLVING/RESOLVED)
- [ ] Perspectives inventory with agent grouping
- [ ] Velocity indicator (convergence visualization)
- [ ] Mobile tab navigation for panel switching

### Phase 4: Integration
- [ ] Update landing page "How It Works" link
- [ ] Add to navigation (if appropriate)
- [ ] Test on mobile devices

## Alternatives Considered

### Live LLM Calls
Rejected. Cost, latency, and unpredictability concerns. Static content with visible round progression achieves authenticity without these risks.

### Multiple Questions
Rejected. NxM explosion (questions × ADR bundles) creates unmanageable content scope. One canonical question with ADR toggles demonstrates the architecture's value sufficiently.

### Playback Controls
Rejected by 🧁 Scone. Creates false interactivity expectation. Scroll-into-view animations are more honest about static nature.

## Open Questions

None. All tensions resolved through alignment dialogue.

## References

- [N+1 Alignment Dialogue Architecture](https://doi.org/10.5281/zenodo.18434186)
- [Financial Portfolio Management Application](../../publications/alignment-dialogue-financial-portfolio-management.md)
- [Alignment Dialogue Record](../dialogues/2026-02-01T1628Z-interactive-alignment-demo-page.dialogue.recorded.md)

---

*This RFC was drafted through a 6-expert alignment dialogue achieving 100% convergence across 3 rounds. Total ALIGNMENT score: 300.*
