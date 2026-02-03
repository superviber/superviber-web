# RFC 0006: Alignment Demo Page

| | |
|---|---|
| **Status** | Draft |
| **Date** | 2026-02-01 |

---

## Summary

Build an interactive demo page that walks users through the QNTM investment decision alignment dialogue. The page shows how 12 investment experts deliberate across 4 rounds, moving from 8-2 skeptical to 12-0 convergence. Users can explore the scoreboard, tensions, and expert perspectives round-by-round. The demo serves as both educational content and a showcase of the alignment dialogue architecture.

## Problem

Users need to understand how alignment dialogues work without reading dense documentation. A live, interactive example using a relatable domain (portfolio management) demonstrates:

1. How diverse expert perspectives surface conflicts
2. How tensions get identified and tracked
3. How synthesis emerges through deliberation
4. How convergence is detected via velocity decline
5. How registered dissent is handled

## Data Architecture

### Pre-computed Static Data

All dialogue data is pre-computed and served statically from `/public/demo/`:

```
public/demo/
├── portfolio.json              # $1M Acme Investment Trust
├── candidate.json              # QNTM stock data
├── adr-bundles.json           # Calibration options (future)
├── experts.json               # 12-expert panel definition
└── dialogues/
    └── qntm-uncalibrated/     # Complete dialogue
        ├── metadata.json      # Demo-consumable metadata
        ├── scoreboard.md      # ALIGNMENT scores
        ├── tensions.md        # Tension registry
        ├── final-recommendation.md
        ├── round-0/           # 12 expert .md files
        ├── round-0.summary.md
        ├── round-1/
        ├── round-1.summary.md
        ├── round-2/
        ├── round-2.summary.md
        ├── round-3/
        └── round-3.summary.md
```

### metadata.json Schema

```typescript
interface DialogueMetadata {
  id: string;
  title: string;
  subtitle: string;
  calibration: "none" | "conservative" | "esg-first";
  question: string;
  finalDecision: string;
  finalDecisionDetail: string;

  convergence: {
    achieved: boolean;
    percentage: number;
    expertsConfirmed: number;
    expertsTotal: number;
    tensionsResolved: number;
    tensionsTotal: number;
    dissentsRegistered: number;
  };

  rounds: Array<{
    number: number;
    score: number;
    velocity: number | null;
    tensionsResolved: number;
    panelPosition: string;
    keyDevelopment: string;
  }>;

  experts: Array<{
    id: string;
    emoji: string;
    role: string;
    stance: string;  // e.g., "skeptical→confirmed"
  }>;

  tensions: Array<{
    id: string;
    label: string;
    status: "resolved" | "subsumed" | "reframed" | "open";
    resolvedRound: number | null;
  }>;

  alignmentScore: {
    final: number;
    dimensions: {
      wisdom: number;
      consistency: number;
      truth: number;
      relationships: number;
    };
  };
}
```

## Page Structure

### Route
`/demo/alignment` or `/alignment-demo`

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Header: "Alignment Dialogue Demo"                          │
│  Subtitle: "Watch 12 experts deliberate on a $50K decision" │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  CONTEXT PANEL                                       │   │
│  │  Portfolio: $1M | Question: Add 5% QNTM?            │   │
│  │  [Expand to see holdings]                            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌───────────────┐  ┌──────────────────────────────────┐   │
│  │  ROUND NAV    │  │  MAIN CONTENT AREA               │   │
│  │               │  │                                  │   │
│  │  [R0] 8-2     │  │  Round 0: Initial Perspectives   │   │
│  │  [R1] →YES    │  │                                  │   │
│  │  [R2] 11-1    │  │  ┌────────┐ ┌────────┐          │   │
│  │  [R3] 12-0 ✓  │  │  │Expert 1│ │Expert 2│ ...      │   │
│  │               │  │  └────────┘ └────────┘          │   │
│  │  ─────────    │  │                                  │   │
│  │  SCOREBOARD   │  │  [View: Grid | List | Flow]     │   │
│  │  Score: 105   │  │                                  │   │
│  │  Vel: —       │  └──────────────────────────────────┘   │
│  │               │                                         │
│  │  ─────────    │  ┌──────────────────────────────────┐   │
│  │  TENSIONS     │  │  TENSIONS PANEL                  │   │
│  │  ○ T01        │  │  T01: Valuation Premium [OPEN]   │   │
│  │  ○ T02        │  │  T02: Position Sizing [OPEN]     │   │
│  │  ○ T03        │  │  ...                             │   │
│  │  ...          │  └──────────────────────────────────┘   │
│  └───────────────┘                                         │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  FINAL DECISION (appears after Round 3)             │   │
│  │  "CONDITIONAL YES: 2.5% NVAI swap + staged entry"   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Components

### 1. ContextPanel
Shows the portfolio and investment question.

```typescript
interface ContextPanelProps {
  portfolio: Portfolio;
  candidate: Candidate;
  question: string;
}
```

- Collapsed by default (shows summary)
- Expandable to show full holdings table
- Highlights key tensions: PETX (ESG D), 14.4% cash, etc.

### 2. RoundNavigator
Vertical stepper showing round progression.

```typescript
interface RoundNavigatorProps {
  rounds: Round[];
  currentRound: number;
  onRoundSelect: (round: number) => void;
}
```

- Visual indicators: position (8-2, 11-1, 12-0)
- Score and velocity at each round
- Checkmark for convergence round

### 3. ScoreboardCard
Live ALIGNMENT score display.

```typescript
interface ScoreboardCardProps {
  score: number;
  velocity: number | null;
  dimensions: { wisdom: number; consistency: number; truth: number; relationships: number };
}
```

- Animated score updates on round change
- Velocity trend indicator (↑ high, → medium, ↓ converging)
- Dimension breakdown (collapsible)

### 4. TensionsPanel
Shows tension status by round.

```typescript
interface TensionsPanelProps {
  tensions: Tension[];
  currentRound: number;
}
```

- Status icons: ○ open, ◐ narrowing, ● resolved
- Click to see tension history
- Resolution attribution (which expert, which round)

### 5. ExpertGrid
Displays expert perspectives for current round.

```typescript
interface ExpertGridProps {
  round: number;
  experts: Expert[];
  perspectives: Record<string, string>;  // expert.id -> markdown content
}
```

- Card per expert with emoji, role, stance
- Click to expand full perspective
- Highlight moves: CONCESSION, REFINEMENT, RESOLVED
- Visual indicator for dissent

### 6. ExpertDetailModal
Full expert perspective view.

```typescript
interface ExpertDetailModalProps {
  expert: Expert;
  content: string;  // markdown
  round: number;
}
```

- Renders markdown from expert file
- Shows perspective labels, tensions raised
- Navigation to previous/next round for same expert

### 7. ConvergenceBanner
Appears when viewing Round 3.

```typescript
interface ConvergenceBannerProps {
  convergence: ConvergenceStatus;
  decision: string;
  dissents: Dissent[];
}
```

- Celebratory but professional
- Shows final decision
- Links to registered dissents

## User Flows

### Primary Flow: Round-by-Round Exploration

1. User lands on page, sees context panel with portfolio/question
2. Round 0 is active by default
3. User sees 12 expert cards in grid view
4. User clicks expert card to read full perspective
5. User clicks Round 1 in navigator
6. Scoreboard animates: 105 → 174, velocity +69
7. Tensions panel updates: T02 now shows "RESOLVED"
8. Expert cards show new perspectives + engagement with others
9. Continue through rounds 2, 3
10. Round 3 shows convergence banner + final decision

### Secondary Flow: Tension Tracking

1. User clicks tension T03 (Tech Concentration)
2. Modal shows tension timeline:
   - R0: Raised by Strudel, Scone
   - R1: NVAI swap proposed (Cupcake)
   - R2: Resolved via NVAI swap consensus
3. User can jump to specific round/expert that affected tension

### Future Flow: Calibration Comparison

1. User sees calibration selector: [None] [Conservative] [ESG-First]
2. Switching calibration loads different dialogue data
3. User can compare how ADR constraints affect:
   - Number of rounds to convergence
   - Which tensions arise/resolve
   - Final decision differences

## Technical Implementation

### Data Loading

```typescript
// Load dialogue metadata
const loadDialogue = async (calibration: string): Promise<DialogueMetadata> => {
  const response = await fetch(`/demo/dialogues/qntm-${calibration}/metadata.json`);
  return response.json();
};

// Load expert perspective for a round
const loadExpertPerspective = async (
  calibration: string,
  round: number,
  expertId: string
): Promise<string> => {
  const response = await fetch(
    `/demo/dialogues/qntm-${calibration}/round-${round}/${expertId}.md`
  );
  return response.text();
};
```

### State Management

```typescript
interface DemoState {
  calibration: "uncalibrated" | "conservative" | "esg-first";
  currentRound: number;
  selectedExpert: string | null;
  selectedTension: string | null;
  metadata: DialogueMetadata | null;
  expertContent: Record<string, Record<number, string>>;  // expert.id -> round -> content
}
```

### Markdown Rendering

Use existing markdown renderer (likely `react-markdown` or similar) with:
- Syntax highlighting for code blocks
- Support for `[PERSPECTIVE P01: label]` formatting
- Visual treatment for `[CONCESSION]`, `[REFINEMENT]`, `[RESOLVED]` tags

## Visual Design

### Color Palette
- Primary: Blue (alignment, convergence)
- Secondary: Amber (tensions, warnings)
- Success: Green (resolved, confirmed)
- Neutral: Gray (pending, inactive)

### Expert Cards
- Emoji prominent (32px)
- Role as subtitle
- Stance badge (skeptical, bullish, cautious, etc.)
- Border color reflects current status

### Animations
- Score counter: Smooth increment on round change
- Tension status: Fade transition
- Card expansion: Slide/fade
- Round transition: Cross-fade content

## Test Plan

- [ ] Page loads with uncalibrated dialogue data
- [ ] Round navigation updates all panels correctly
- [ ] Expert cards expand to show full perspective
- [ ] Markdown renders correctly with custom tags
- [ ] Tension panel shows correct status per round
- [ ] Scoreboard animates on round change
- [ ] Convergence banner appears on Round 3
- [ ] Mobile responsive (stacked layout)
- [ ] Accessibility: keyboard navigation, screen reader support

## Future Enhancements

### Phase 2: Calibrated Dialogues
- Run conservative ADR dialogue (same question, different constraints)
- Run ESG-first ADR dialogue
- Add calibration toggle to compare outcomes

### Phase 3: Interactive Elements
- "What would you decide?" poll before revealing outcome
- Highlight "key moments" in dialogue
- Expert voting visualization

### Phase 4: Multiple Case Studies
- Different questions (sell PETX? rebalance sector weights?)
- Different portfolio contexts
- Template for generating new demos

## Implementation Tasks

1. **Create page route and layout** (`/demo/alignment`)
2. **Build ContextPanel component** (portfolio display)
3. **Build RoundNavigator component** (vertical stepper)
4. **Build ScoreboardCard component** (animated scores)
5. **Build TensionsPanel component** (status tracking)
6. **Build ExpertGrid component** (12-card grid)
7. **Build ExpertDetailModal component** (full perspective)
8. **Build ConvergenceBanner component** (final result)
9. **Wire up data loading** (fetch from /public/demo/)
10. **Add animations and polish**
11. **Mobile responsive pass**
12. **Accessibility audit**

---

*"The demo page should make users feel like they're watching 12 brilliant minds find truth together."*

— Blue

