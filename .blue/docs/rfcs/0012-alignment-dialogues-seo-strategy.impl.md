# RFC 0012: SEO & Site Architecture for Alignment Dialogues

| | |
|---|---|
| **Status** | Implemented |
| **Date** | 2026-02-05 |
| **Depends On** | RFC 0011 (Interactive Demo Dialogue Integration) |
| **Related** | Blue RFC 0051 (Global Perspective Tracking), RFC 0054 (Calibrated Alignment) |

---

## Summary

The alignment dialogue system is a differentiating technology that deserves dedicated content architecture for organic discovery. This RFC defines SEO strategy, site structure, and schema markup to position superviber.com as the authoritative resource for multi-agent alignment deliberation.

## Problem Statement

The current superviber.com has:
- A working interactive demo at `/demo/alignment`
- No dedicated landing page explaining the alignment dialogue concept
- No schema markup for software/technology content
- No blog infrastructure for thought leadership
- Zero organic visibility for alignment-related searches
- No internal linking between demo, docs, and blog content

## Target Audience

**Primary**: Technical decision-makers evaluating multi-agent architectures for:
- Decision support systems
- Investment analysis
- Policy deliberation
- Complex problem decomposition

**Secondary**: AI/ML researchers interested in:
- Agent coordination patterns
- Deliberation convergence
- Multi-perspective synthesis
- Structured disagreement resolution

## Converged Strategy

### 1. Site Architecture

| Route | Purpose |
|-------|---------|
| `/` | SuperViber homepage (existing) |
| `/alignment` | Alignment Dialogues landing page (authority anchor) |
| `/alignment/demo` | Interactive demo (moved from `/demo/alignment`) |
| `/alignment/how-it-works` | Technical explainer |
| `/alignment/use-cases` | Domain-specific applications |
| `/blog` | Technical blog hub |
| `/blog/[slug]` | Individual blog posts |
| `/docs/alignment` | Technical documentation (optional, phase 2) |

### 2. Landing Page: `/alignment`

**Purpose**: Convert curious visitors into engaged readers/users.

**Structure**:
```
Hero Section
├── "Multi-Expert Alignment Dialogues"
├── Tagline: "N experts. Structured disagreement. Emergent truth."
├── CTA: "See It In Action" → /alignment/demo

Problem Section
├── "Complex decisions require diverse perspectives"
├── Pain points: groupthink, analysis paralysis, hidden assumptions
├── Visual: scattered experts → unified insight

Solution Section
├── "How Alignment Dialogues Work"
├── 4-step process visual
│   1. Expert Pool Design
│   2. Parallel Deliberation
│   3. Tension Tracking
│   4. Convergence Detection

Demo Preview
├── Animated preview of dialogue in action
├── "Watch 8 experts reach consensus on NVIDIA investment"
├── CTA: "Explore the Demo"

Use Cases
├── Investment Analysis
├── Policy Deliberation
├── Technical Architecture Review
├── Risk Assessment

Blog Highlights
├── Latest 3 posts from /blog
├── "Read our development journal"
```

### 3. Schema Markup Strategy

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "Alignment Dialogues",
      "applicationCategory": "Decision Support System",
      "operatingSystem": "Web",
      "description": "Multi-expert deliberation system for complex decisions using structured disagreement and convergence tracking",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "author": {
        "@type": "Person",
        "name": "Eric Garcia",
        "url": "https://muffinlabs.ai/about"
      }
    },
    {
      "@type": "TechArticle",
      "headline": "Multi-Expert Alignment Dialogues",
      "description": "Technical architecture for AI-assisted multi-perspective deliberation",
      "author": {
        "@type": "Person",
        "name": "Eric Garcia"
      }
    },
    {
      "@type": "HowTo",
      "name": "How Alignment Dialogues Work",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Design Expert Pool",
          "text": "Create domain-appropriate experts with tiers and relevance scores"
        },
        {
          "@type": "HowToStep",
          "name": "Run Parallel Deliberation",
          "text": "N experts deliberate independently, surfacing perspectives and tensions"
        },
        {
          "@type": "HowToStep",
          "name": "Track Tensions",
          "text": "Judge synthesizes perspectives, tracks tension lifecycle across rounds"
        },
        {
          "@type": "HowToStep",
          "name": "Detect Convergence",
          "text": "Monitor ALIGNMENT velocity until gain approaches zero"
        }
      ]
    }
  ]
}
```

Additionally implement:
- **BlogPosting schema** for blog posts with author linking
- **FAQPage schema** on `/alignment/how-it-works`
- **WebApplication schema** for the interactive demo

### 4. Keyword Strategy

**Primary Keywords** (technology/methodology):
- "multi-agent deliberation"
- "AI decision support"
- "structured disagreement"
- "expert panel deliberation"
- "convergence detection"

**Problem-Aware Keywords**:
- "how to combine expert opinions"
- "multi-perspective analysis"
- "avoiding groupthink in decisions"
- "structured debate framework"

**Technical Keywords**:
- "ALIGNMENT scoring"
- "tension tracking"
- "expert pool design"
- "calibrated deliberation"

### 5. Internal Linking Architecture

```
/alignment (landing)
├── → /alignment/demo (interactive demo)
├── → /alignment/how-it-works (technical explainer)
├── → /blog (latest posts)
├── → muffinlabs.ai/about (founder bio)

/alignment/demo
├── → /alignment (context)
├── → /blog/[rfc-0051] (global tracking post)
├── → /blog/[rfc-0054] (calibrated alignment post)

/blog/[post]
├── → /alignment (landing)
├── → /alignment/demo (see it in action)
├── → related posts
```

### 6. Technical Implementation

#### Route Migration

```typescript
// Move demo route
// FROM: src/app/demo/alignment/page.tsx
// TO:   src/app/alignment/demo/page.tsx

// Redirect for backwards compatibility
// src/app/demo/alignment/page.tsx
import { redirect } from 'next/navigation';
export default function Page() {
  redirect('/alignment/demo');
}
```

#### Per-Page Metadata

```typescript
// src/app/alignment/page.tsx
export const metadata: Metadata = {
  title: "Alignment Dialogues | Multi-Expert Deliberation for Complex Decisions",
  description: "Watch N experts deliberate, disagree, and converge. Structured multi-perspective analysis for investment, policy, and technical decisions.",
  openGraph: {
    title: "Alignment Dialogues",
    description: "Multi-expert deliberation with structured disagreement and convergence tracking",
    images: ["/og/alignment-dialogues.png"],
  },
  alternates: {
    canonical: "https://superviber.com/alignment"
  }
};
```

#### Blog Infrastructure

```typescript
// src/app/blog/page.tsx
// Blog index with post listing

// src/app/blog/[slug]/page.tsx
// MDX-based blog posts with:
// - BlogPosting schema
// - Author card linking to muffinlabs.ai
// - Related posts section
// - Internal links to /alignment
```

## Implementation Tasks

### Phase 1: Foundation (This RFC)
- [x] Create `/alignment` landing page
- [x] Migrate demo to `/alignment/demo` with redirect
- [x] Implement schema markup (SoftwareApplication, HowTo)
- [x] Create `/blog` route infrastructure
- [ ] Add Open Graph images for social sharing

### Phase 2: Content (RFC 0013)
- [ ] Write initial blog posts (RFC 0051, 0054)
- [ ] Create `/alignment/how-it-works` page
- [ ] Create `/alignment/use-cases` page
- [ ] Add internal linking throughout

### Phase 3: Authority (Ongoing)
- [ ] Submit to relevant directories
- [ ] Syndicate posts to Dev.to, Hashnode
- [ ] Create Google Search Console property

## Test Plan

- [ ] Verify schema with Google Rich Results Test
- [ ] Confirm Open Graph renders correctly on Twitter/LinkedIn
- [ ] Validate internal linking with crawl test
- [ ] Test redirect from `/demo/alignment` to `/alignment/demo`
- [ ] Mobile responsive check on all new pages

## Success Metrics

| Metric | Baseline | Target (90 days) |
|--------|----------|------------------|
| Indexed pages | 2 | 10+ |
| Organic impressions | 0 | 500/month |
| Demo page visits | (current) | 2x current |
| Blog post reads | 0 | 200/month |
| Backlinks | 0 | 5+ |

---

*"The architecture serves the content. The content serves the reader."*

— Blue
