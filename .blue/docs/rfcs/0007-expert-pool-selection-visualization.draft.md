# RFC 0007: Expert Pool Selection Visualization

| | |
|---|---|
| **Status** | Draft |
| **Date** | 2026-02-01 |
| **Extends** | RFC 0006 (Alignment Demo Page) |

---

## Summary

Extend the alignment demo page to visualize the expert pool and selection process. Show users how 12 experts are selected from a larger pool (20 experts) using tier-based weighted sampling. This demonstrates the stochastic nature of expert panel assembly and the Core/Adjacent/Wildcard tier distribution algorithm.

## Problem

The current demo shows 12 fixed experts but doesn't explain:

1. Where these experts come from (what's the larger pool?)
2. How they were selected (what algorithm? what probabilities?)
3. Why the tier distribution matters (Core vs Adjacent vs Wildcard)
4. That selection is stochastic (different panels possible for same question)

Users seeing the demo ask: "Why these 12 experts?" and "Would a different panel reach the same conclusion?"

## Non-Goals

This RFC does NOT address:

- Per-round expert rotation (the Blue MCP architecture uses fixed panels)
- Dynamic expert selection based on emerging tensions (future enhancement)
- Calibrated dialogues (handled separately)

## Architecture Alignment

Per Blue MCP implementation (`blue-mcp/src/handlers/dialogue.rs`):

1. **All N experts participate in ALL rounds** (no rotation)
2. **Tier distribution**: For N > 5 experts: ~33% Core, ~42% Adjacent, ~25% Wildcard
3. **Relevance scores**: Core (0.95-0.80), Adjacent (0.70-0.50), Wildcard (0.40-0.25)
4. **Parallel execution**: All experts respond simultaneously per round

## Expert Pool Design

### Investment Domain Pool (20 experts)

#### Core Tier (6 experts)
| ID | Role | Base Relevance | Focus |
|----|------|----------------|-------|
| `value` | Value Analyst | 0.95 | Intrinsic value, DCF, margin of safety |
| `growth` | Growth Analyst | 0.93 | TAM expansion, revenue acceleration |
| `risk` | Risk Manager | 0.90 | Downside scenarios, position sizing |
| `sector` | Tech Sector Analyst | 0.88 | AI/quantum industry dynamics |
| `fundamental` | Fundamental Analyst | 0.87 | Financial statement analysis |
| `portfolio` | Portfolio Strategist | 0.85 | Allocation, concentration, rebalancing |

#### Adjacent Tier (8 experts)
| ID | Role | Base Relevance | Focus |
|----|------|----------------|-------|
| `esg` | ESG Analyst | 0.75 | Environmental, social, governance |
| `income` | Income Analyst | 0.72 | Dividend yield, cash flow |
| `quant` | Quant Strategist | 0.70 | Factor exposure, statistical analysis |
| `technical` | Technical Analyst | 0.68 | Price patterns, momentum |
| `credit` | Credit Analyst | 0.65 | Balance sheet strength |
| `behavioral` | Behavioral Analyst | 0.63 | Market psychology, sentiment |
| `macro` | Macro Economist | 0.60 | Interest rates, cycle positioning |
| `governance` | Governance Specialist | 0.58 | Board quality, incentives |

#### Wildcard Tier (6 experts)
| ID | Role | Base Relevance | Focus |
|----|------|----------------|-------|
| `contrarian` | Contrarian | 0.45 | Challenge consensus |
| `historian` | Market Historian | 0.42 | Historical analogues |
| `options` | Options Strategist | 0.38 | Implied vol, hedging |
| `geopolitical` | Geopolitical Analyst | 0.35 | Country risk, supply chain |
| `ethicist` | Investment Ethicist | 0.32 | Fiduciary duty |
| `academic` | Academic Researcher | 0.28 | Theoretical frameworks |

## Selection Algorithm

### Tier Distribution (for 12 experts)

```typescript
// Blue MCP tier_split() algorithm
function tierSplit(count: number): [core: number, adjacent: number, wildcard: number] {
  if (count <= 2) return [count, 0, 0];
  if (count <= 5) {
    const core = Math.ceil(count / 3);
    const remaining = count - core;
    return [core, Math.ceil(remaining / 2), remaining - Math.ceil(remaining / 2)];
  }
  const core = Math.ceil(count / 3);           // 4 for 12 experts
  const adjacent = Math.ceil((count - core) * 0.6);  // 5 for 12 experts
  const wildcard = count - core - adjacent;    // 3 for 12 experts
  return [core, adjacent, wildcard];
}
```

### Weighted Sampling (stochastic)

```typescript
function sampleFromTier(pool: Expert[], count: number): Expert[] {
  const weights = pool.map(e => e.baseRelevance);
  const totalWeight = weights.reduce((a, b) => a + b, 0);

  const selected: Expert[] = [];
  const remaining = [...pool];

  for (let i = 0; i < count; i++) {
    const r = Math.random() * totalWeight;
    let cumulative = 0;
    for (let j = 0; j < remaining.length; j++) {
      cumulative += remaining[j].baseRelevance;
      if (r <= cumulative) {
        selected.push(remaining[j]);
        remaining.splice(j, 1);
        break;
      }
    }
  }
  return selected;
}
```

## UI Components

### 1. Expert Pool Panel

Collapsible panel showing the full pool organized by tier:

```
┌─────────────────────────────────────────────────────────────┐
│  EXPERT POOL                                       20 total │
│  ─────────────────────────────────────────────────────────  │
│  Question: "Should we add 5% QNTM ($50K) from cash?"       │
├─────────────────────────────────────────────────────────────┤
│  CORE (6)           ████████████████████  relevance 95-85%  │
│  ADJACENT (8)       ████████████████      relevance 75-58%  │
│  WILDCARD (6)       ████████████          relevance 45-28%  │
├─────────────────────────────────────────────────────────────┤
│  For 12 experts: 4 Core + 5 Adjacent + 3 Wildcard          │
│  [🎲 Resample Panel]                                        │
└─────────────────────────────────────────────────────────────┘
```

### 2. Selection Probability Bars

Show selection probability for each expert within their tier:

```
CORE TIER SELECTION (4 of 6)

📊 Value Analyst        ████████████████████  18.2% → ✓
🚀 Growth Analyst       ██████████████████    17.8% → ✓
⚠️  Risk Manager         █████████████████    17.2% → ✓
💻 Tech Sector          ████████████████      16.9% → ✓
📈 Fundamental          ███████████████       16.7% → (not selected)
🎯 Portfolio Strategy   ██████████████        16.3% → (not selected)
```

### 3. Selected Panel Display

Shows the 12 selected experts with pastry names:

```
SELECTED PANEL (12 experts) — All participate in all rounds

┌────┬────┬────┬────┐  ┌────┬────┬────┬────┬────┐  ┌────┬────┬────┐
│📊  │🚀  │⚠️  │💻  │  │🌱  │🔢  │💰  │📈  │🧠  │  │🔄  │📚  │🎲  │
│.95 │.90 │.85 │.80 │  │.70 │.65 │.60 │.55 │.50 │  │.40 │.35 │.30 │
│Muf │Cup │Sco │Ecl │  │Don │Bri │Cro │Mac │Can │  │Str │Bei │Chu │
└────┴────┴────┴────┘  └────┴────┴────┴────┴────┘  └────┴────┴────┘
     CORE (33%)              ADJACENT (42%)           WILDCARD (25%)
```

### 4. Resample Button

Allows users to re-run selection to see different panels:

```
[🎲 Resample Panel]

Each click re-runs weighted random selection.
Notice how Core experts are more likely to be chosen,
but Wildcards still appear to provide fresh thinking.
```

## Data Schema Changes

### expert-pool.json (expanded)

```typescript
interface ExpertPool {
  domain: "investment";
  version: "1.0";

  experts: Array<{
    id: string;
    name: string;
    emoji: string;
    tier: "Core" | "Adjacent" | "Wildcard";
    baseRelevance: number;
    focus: string;
    bias: string;
    keyQuestions: string[];
  }>;

  selectionConfig: {
    defaultPanelSize: 12;
    tierDistribution: {
      core: { count: 4, ofTotal: 6 };
      adjacent: { count: 5, ofTotal: 8 };
      wildcard: { count: 3, ofTotal: 6 };
    };
  };
}
```

### metadata.json (add selection field)

```typescript
interface DialogueMetadata {
  // ... existing fields ...

  selection: {
    seed: number;  // For reproducibility
    panelSize: 12;
    selected: Array<{
      id: string;
      tier: string;
      relevance: number;
      probability: number;
      pastryName: string;
    }>;
    notSelected: Array<{
      id: string;
      tier: string;
      relevance: number;
      probability: number;
    }>;
  };
}
```

## Implementation Tasks

1. **Expand expert-pool.json** to 20 experts with full metadata
2. **Add selection field** to metadata.json showing current selection
3. **Create ExpertPoolPanel component** with tier visualization
4. **Create SelectionProbabilityBars component**
5. **Add resample logic** to demo page (client-side weighted sampling)
6. **Integrate with existing demo** as collapsible panel above round navigator

## Test Plan

- [ ] Pool panel shows all 20 experts organized by tier
- [ ] Selection probabilities sum to 100% within each tier
- [ ] Resample button produces different panels (verify stochasticity)
- [ ] Same 12 experts appear in all rounds (no rotation)
- [ ] Tier distribution matches algorithm: 4 Core, 5 Adjacent, 3 Wildcard
- [ ] Mobile responsive (stacked layout)

## Future Enhancements

### Phase 2: Topic-Based Relevance Adjustment

Adjust base relevance scores based on question keywords:
- "ESG" in question → ESG Analyst relevance boosted
- "macro" in question → Macro Economist boosted
- etc.

### Phase 3: Per-Round Expert Rotation

If/when Blue MCP implements rotation, update demo to show:
- Which experts are retained (high ALIGNMENT contribution)
- Which are rotated out
- Which new experts are brought in (tension matching)

---

*"The demo should answer: Why these experts? And: Would different experts reach the same conclusion?"*

— Blue
