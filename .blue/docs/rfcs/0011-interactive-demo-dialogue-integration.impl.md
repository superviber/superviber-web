# RFC 0011: Interactive Demo Dialogue Integration

| | |
|---|---|
| **Status** | Implemented |
| **Date** | 2026-02-03 |

---

## Summary

Integrate the new dialogue export format into the interactive demo page with:
- Single source of truth (`nvidia-dialogue-export.json`)
- Dynamic WCTR scoreboard that updates per round
- Raw agent markdown viewer (click to expand)
- Preloaded content for instant switching

## Problem

The current demo page (`src/app/demo/alignment/page.tsx`) fetches from 4 separate JSON files:
- `dialogue.json` - dialogue metadata and rounds
- `expert-pool.json` - panel configuration
- `content.json` - preprocessed expert content
- `nvidia-candidate.json` - portfolio context

This fragmentation:
1. Requires manual synchronization between files
2. Loses raw agent output fidelity
3. Makes exporting/importing dialogues cumbersome
4. Doesn't reflect actual dialogue run structure

## Solution

### New Data Architecture

**Single Export File**: `/public/demo/nvidia-dialogue-export.json`

```typescript
interface DialogueExport {
  dialogue: {
    id: string;
    title: string;
    date: string;
    status: "converged" | "in_progress" | "abandoned";
    domain: string;
    question: string;
  };
  convergence: {
    achieved: boolean;
    rounds: number;
    total_alignment: number;
    breakdown: { wisdom: number; consistency: number; truth: number; relationships: number };
    final_velocity: number;
    final_convergence_percent: number;
    experts_converged: number;
    experts_total: number;
  };
  panel: Array<{
    name: string;
    role: string;
    tier: "Core" | "Adjacent" | "Wildcard";
    total_score: number;
  }>;
  tensions_resolved: Array<{
    id: string;
    label: string;
    resolution: string;
    round_resolved: number;
  }>;
  rounds: Array<{
    round: number;
    score: number;
    open_tensions: number;
    new_perspectives: number;
    velocity: number;
    convergence_percent: number;
    summary: string;
    // NEW: per-round WCTR breakdown
    breakdown?: { wisdom: number; consistency: number; truth: number; relationships: number };
  }>;
  verdict: {
    type: string;
    recommendation: string;
    description: string;
    confidence: string;
    grounds: string[];
    conditional_recommendation?: object;
    default_action: string;
  };
  key_perspectives: Array<{
    id: string;
    agent: string;
    label: string;
    content: string;
    round: number;
  }>;
  data_directory: string; // path to raw files
}
```

**Raw Agent Content**: `/public/demo/dialogues/{id}/raw/`

```
raw/
├── expert-pool.json
├── scoreboard.md
├── tensions.md
├── round-0/
│   ├── panel.json
│   ├── muffin.md
│   ├── cupcake.md
│   └── ... (all 8 agents)
├── round-0.summary.md
├── round-1/
│   └── ...
└── ...
```

### UI Changes

#### 1. Dynamic Scoreboard (Top Section)

Replace the current static sidebar scoreboard with a prominent top scoreboard:

```
┌─────────────────────────────────────────────────────────────┐
│  ALIGNMENT Score                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Round 2       Score: 130       Velocity: +2         │   │
│  │  ┌─────┬─────┬─────┬─────┐                          │   │
│  │  │  W  │  C  │  T  │  R  │                          │   │
│  │  │ 35  │ 32  │ 32  │ 31  │                          │   │
│  │  └─────┴─────┴─────┴─────┘                          │   │
│  │  Cumulative: 386 / 418     Convergence: 62.5%       │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  Round: [0] [1] [●2] [3]    ← clickable round selector      │
└─────────────────────────────────────────────────────────────┘
```

- Shows current round's WCTR breakdown
- Velocity change indicator (green +, red -)
- Cumulative total vs final total
- Convergence percentage bar
- Clickable round pills to switch rounds

#### 2. Expert Cards with Raw Output Viewer

When clicking an expert:

```
┌────────────────────────────────────────────────────────────┐
│  🧁 Muffin  Value Analyst  [Core]        Total: 49         │
│  R0: 14  R1: 15  R2: 16  R3: 4                             │
├────────────────────────────────────────────────────────────┤
│  [Summary]  [Raw Output]  ← toggle tabs                    │
│                                                            │
│  Raw Output (Round 2):                                     │
│  ┌────────────────────────────────────────────────────┐   │
│  │ [PERSPECTIVE P01: NVAI as Optionality Premium]      │   │
│  │ Trimming NVAI to fund NVDA swaps proven dominance   │   │
│  │ for speculative upside. NVAI has delivered 67.6%... │   │
│  │                                                      │   │
│  │ [PERSPECTIVE P02: Tech Concentration Already...]    │   │
│  │ ...                                                  │   │
│  │                                                      │   │
│  │ [TENSION T01: Conviction vs. Diversification...]    │   │
│  │ ...                                                  │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
│  ← Round 1    Round 3 →                                   │
└────────────────────────────────────────────────────────────┘
```

#### 3. Preload Strategy

On page mount:
1. Fetch `nvidia-dialogue-export.json` (metadata)
2. Parallel fetch all `round-N/*.md` files from `data_directory`
3. Store in `expertContent: Record<round, Record<agentName, markdown>>`

```typescript
useEffect(() => {
  const loadDialogue = async () => {
    // 1. Load export
    const exportData = await fetch("/demo/nvidia-dialogue-export.json").then(r => r.json());
    setDialogue(exportData);

    // 2. Preload all raw content
    const rawBase = `/demo/dialogues/nvidia-uncalibrated/raw`;
    const content: Record<number, Record<string, string>> = {};

    for (let round = 0; round < exportData.convergence.rounds; round++) {
      content[round] = {};
      const promises = exportData.panel.map(async (expert) => {
        const name = expert.name.toLowerCase();
        const res = await fetch(`${rawBase}/round-${round}/${name}.md`);
        content[round][name] = await res.text();
      });
      await Promise.all(promises);
    }

    setExpertContent(content);
  };
  loadDialogue();
}, []);
```

### Data Migration

Delete these files (replaced by export):
- `/public/demo/dialogues/nvidia-uncalibrated/dialogue.json`
- `/public/demo/dialogues/nvidia-uncalibrated/expert-pool.json`
- `/public/demo/dialogues/nvidia-uncalibrated/content.json`

Keep:
- `/public/demo/nvidia-dialogue-export.json` (new single source)
- `/public/demo/dialogues/nvidia-uncalibrated/raw/` (raw agent output)
- `/public/demo/nvidia-candidate.json` (portfolio context, separate concern)

### Markdown Rendering

**Strategy**: Extend existing `renderExpertContent()` parser with missing markers.

**Current markers handled:**
- `[PERSPECTIVE P01: label]` → violet tag
- `[TENSION T01: label]` → amber tag
- `[CONCESSION: label]` → cyan tag
- `[CONVERGENCE CONFIRMED]` → emerald tag
- `[REFINEMENT P01: label]` → fuchsia tag
- `[RESOLVED T01]` → emerald tag

**Markers to add:**
- `[MOVE:CONVERGE]` → emerald "CONVERGE" pill (18 occurrences in raw files)
- `[FINAL POSITION]` → white/bold section header (8 occurrences)

**Content stripping**: Remove any frontmatter or metadata headers before rendering.

### Component Interface Changes

```typescript
// New interfaces aligned to export format
interface DialogueExport {
  dialogue: DialogueMetadata;
  convergence: ConvergenceData;
  panel: PanelExpert[];
  tensions_resolved: ResolvedTension[];
  rounds: RoundSummary[];
  verdict: Verdict;
  key_perspectives: KeyPerspective[];
  data_directory: string;
}

interface RoundSummary {
  round: number;
  score: number;
  breakdown?: { wisdom: number; consistency: number; truth: number; relationships: number };
  open_tensions: number;
  new_perspectives: number;
  velocity: number;
  convergence_percent: number;
  summary: string;
}

interface PanelExpert {
  name: string;
  role: string;
  tier: "Core" | "Adjacent" | "Wildcard";
  total_score: number;
  round_scores?: number[]; // Added for per-round breakdown
}
```

## Tasks

- [ ] Add per-round WCTR breakdown to export JSON
- [ ] Create new `ScoreboardHeader` component with WCTR display
- [ ] Update page to use single export file
- [ ] Implement preload logic for raw markdown files
- [ ] Add `[MOVE:CONVERGE]` marker handler to renderExpertContent
- [ ] Add `[FINAL POSITION]` marker handler to renderExpertContent
- [ ] Add "Raw Output" tab to expert detail view
- [ ] Add round selector pills to scoreboard
- [ ] Delete deprecated JSON files
- [ ] Add loading states for preload phase
- [ ] Test round switching updates scoreboard correctly

## Test Plan

- [ ] Scoreboard shows correct WCTR for each round when clicked
- [ ] Expert raw markdown loads and displays formatting (PERSPECTIVE, TENSION tags)
- [ ] All 4 rounds accessible, content preloaded without delay
- [ ] Convergence round (3) shows final verdict
- [ ] Mobile layout handles scoreboard compactly
- [ ] No console errors, all fetches succeed

## Alternatives Considered

1. **Keep separate JSON files** - Rejected: synchronization burden, export complexity
2. **Embed markdown in export** - Rejected: bloats JSON, harder to edit raw content
3. **Load markdown on demand** - Rejected: user preference for instant switching

---

*"Single source. Zero fragmentation."*

— Blue
