# RFC 0013: Blog Strategy for Alignment Dialogue Development

| | |
|---|---|
| **Status** | Draft |
| **Date** | 2026-02-05 |
| **Depends On** | RFC 0012 (SEO & Site Architecture) |
| **Content Sources** | Blue RFC 0051 (Global Perspective Tracking), RFC 0054 (Calibrated Alignment) |

---

## Summary

Build authority through a development blog documenting the alignment dialogue system's evolution. Starting with RFC 0051 (Global Perspective & Tension Tracking) and continuing with RFC 0054 (Calibrated Alignment), the blog serves as both technical documentation and thought leadership content.

## Problem Statement

The alignment dialogue system represents significant R&D with no public visibility. The work documented in:
- **RFC 0051**: Global Perspective & Tension Tracking — DB-first architecture, two-phase ID assignment, first-class entities (P, R, T, E, C)
- **RFC 0054**: Calibrated Alignment — Principles, Tenets, Constraints hierarchy synthesized into Ethos/Charter

...exists only in internal documentation. This represents missed opportunity for:
- Domain authority in multi-agent systems
- Backlinks from AI/ML community
- Demonstrating technical depth to potential clients
- Documenting design decisions for future contributors

## Content Strategy

### Pillar 1: Development Journal Posts (RFC → Blog)

Transform internal RFCs into accessible blog posts that explain the "why" behind design decisions.

| Source RFC | Blog Post Title | Target Keywords |
|------------|-----------------|-----------------|
| RFC 0051 | "Building a Database for Multi-Agent Deliberation" | multi-agent architecture, dialogue tracking |
| RFC 0051 | "Two-Phase ID Assignment: Making Agent Output Traceable" | agent traceability, LLM attribution |
| RFC 0054 | "Calibrating AI Deliberation: From Principles to Constraints" | AI alignment, calibrated reasoning |
| RFC 0054 | "Domain-Specific Reasoning: Teaching Agents Your Organization's Values" | enterprise AI, custom AI constraints |

### Pillar 2: Technical Deep-Dives

Evergreen content explaining core concepts.

| Topic | Title | Keywords |
|-------|-------|----------|
| ALIGNMENT Scoring | "Wisdom + Consistency + Truth + Relationships: A Scoring Framework" | AI evaluation, agent scoring |
| Expert Pool Design | "Designing Expert Panels: Tiers, Relevance, and Rotation" | expert systems, agent coordination |
| Tension Lifecycle | "From Disagreement to Resolution: Tracking Tensions Across Rounds" | conflict resolution, multi-perspective |
| Convergence | "Detecting Consensus: When to Stop the Dialogue" | convergence detection, stopping criteria |

### Pillar 3: Case Studies

Narrative content showing the system in action.

| Case | Title | Keywords |
|------|-------|----------|
| NVIDIA Investment | "8 Experts, 4 Rounds, 1 Decision: Inside an Investment Dialogue" | AI investment analysis, portfolio management |
| Fiduciary Analysis | "Calibrating for Fiduciary Duty: A Real-World Example" | fiduciary AI, financial compliance |
| (Future) | "Architecture Review by Committee: Technical Decision Dialogues" | technical review, ADR |

## Content Calendar (12-Week Plan)

| Week | Content | Type | Source |
|------|---------|------|--------|
| 1 | "Introducing Alignment Dialogues: Multi-Expert Deliberation for Complex Decisions" | Launch post | Overview |
| 2 | "Building a Database for Multi-Agent Deliberation" | Dev journal | RFC 0051 |
| 3 | "Two-Phase ID Assignment: Making Agent Output Traceable" | Dev journal | RFC 0051 |
| 4 | "Wisdom + Consistency + Truth + Relationships: A Scoring Framework" | Deep-dive | ALIGNMENT |
| 5 | "8 Experts, 4 Rounds, 1 Decision: Inside an Investment Dialogue" | Case study | Demo |
| 6 | "Calibrating AI Deliberation: From Principles to Constraints" | Dev journal | RFC 0054 |
| 7 | "Domain-Specific Reasoning: Teaching Agents Your Organization's Values" | Dev journal | RFC 0054 |
| 8 | "Designing Expert Panels: Tiers, Relevance, and Rotation" | Deep-dive | Expert Pools |
| 9 | "From Disagreement to Resolution: Tracking Tensions Across Rounds" | Deep-dive | Tensions |
| 10 | "Calibrating for Fiduciary Duty: A Real-World Example" | Case study | RFC 0054 |
| 11 | "Detecting Consensus: When to Stop the Dialogue" | Deep-dive | Convergence |
| 12 | Retrospective + Q2 planning | Internal | — |

## Blog Post Template

Each post follows a consistent structure:

### Front Matter
```yaml
---
title: "Building a Database for Multi-Agent Deliberation"
date: "2026-02-10"
author: "Eric Garcia"
authorUrl: "https://muffinlabs.ai/about"
tags: ["alignment", "multi-agent", "architecture"]
summary: "How we designed a DB-first architecture for tracking perspectives, tensions, and convergence across dialogue rounds."
seo:
  title: "Building a Database for Multi-Agent Deliberation | Alignment Dialogues"
  description: "Learn how to structure data for multi-agent deliberation systems with global IDs, lifecycle tracking, and JSON export."
---
```

### Post Structure
1. **Hook** (2-3 sentences) — Why this matters
2. **Problem** — What we were trying to solve
3. **Design** — The solution architecture
4. **Implementation** — Key code/schema snippets
5. **Lessons** — What we learned
6. **What's Next** — Teaser for future posts
7. **CTA** — "See it in action" → /alignment/demo

### Formatting Guidelines
- Code blocks with syntax highlighting
- Diagrams where helpful (Mermaid or images)
- Internal links to /alignment and other posts
- External links to relevant resources (with caution)
- Pull quotes for key insights

## RFC 0051 → Blog Post Breakdown

### Post 1: "Building a Database for Multi-Agent Deliberation"

**Source sections**: Problem, Schema, Dialogue ID Collision Handling

**Key points**:
- Why file-based storage fails at scale
- Schema design for dialogues, rounds, experts
- How we handle ID collisions
- Why single source of truth matters

**Code snippets**:
- Core tables (dialogues, rounds, perspectives, tensions)
- Collision handling algorithm

**Diagram**: Entity relationship diagram

---

### Post 2: "Two-Phase ID Assignment: Making Agent Output Traceable"

**Source sections**: Core Principle: Two-Phase ID Assignment, Schema (refs table)

**Key points**:
- Problem: agent output is free-form, traceability is hard
- Solution: agents write local IDs, Judge registers global IDs
- How display IDs encode round+sequence
- The refs table for cross-entity relationships

**Code snippets**:
- Local ID format: `MUFFIN-P0001`
- Global ID format: `P0001`, `P0102`
- Refs table schema with constraint checks

**Diagram**: ID flow from agent → Judge → database

## RFC 0054 → Blog Post Breakdown

### Post 1: "Calibrating AI Deliberation: From Principles to Constraints"

**Source sections**: Hierarchy, Definitions, ID Scheme

**Key points**:
- Why uncalibrated dialogues aren't enough
- The hierarchy: Principles → Tenets → Constraints → Ethos
- How each level scopes differently
- ID scheme avoiding collisions (PR, TN, CN, CH)

**Code snippets**:
- Hierarchy diagram (ASCII or Mermaid)
- Example principles, tenets, constraints

**Diagram**: Hierarchy visualization

---

### Post 2: "Domain-Specific Reasoning: Teaching Agents Your Organization's Values"

**Source sections**: Authoring via /charter Skill, Schema, Calibration Injection

**Key points**:
- How domains encapsulate organizational knowledge
- Lenses for client-specific configurations
- Charter synthesis: detecting and resolving conflicts
- Injection into expert prompts and Judge protocol

**Code snippets**:
- Domain + tenet schema
- Charter synthesis workflow
- Expert prompt injection example

**Diagram**: /charter skill workflow

## Distribution Strategy

### Primary: superviber.com/blog
- Canonical home for all content
- Full SEO optimization
- Internal linking to /alignment

### Secondary: Syndication
- **Dev.to**: Republish with canonical back to us
- **Hashnode**: Republish with canonical
- **LinkedIn articles**: Summarized versions with link
- **Twitter/X threads**: Key insights with link

### Outreach
- **HackerNews**: "Show HN: Alignment Dialogues" for launch post
- **Reddit**: r/MachineLearning, r/artificial (genuine participation)
- **AI newsletters**: Pitch to relevant curators

## Technical Blog Implementation

### MDX Setup

```typescript
// src/app/blog/[slug]/page.tsx
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getPostBySlug, getAllPosts } from '@/lib/blog';

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map(post => ({ slug: post.slug }));
}

export default async function BlogPost({ params }) {
  const post = await getPostBySlug(params.slug);
  return (
    <article>
      <header>
        <h1>{post.title}</h1>
        <AuthorCard author={post.author} />
        <time>{post.date}</time>
      </header>
      <MDXRemote source={post.content} />
      <RelatedPosts posts={post.related} />
    </article>
  );
}
```

### Components for MDX
- `<Callout type="info|warning|insight" />`
- `<CodeBlock language="sql|typescript|json" />`
- `<Diagram src="/diagrams/..." alt="..." />`
- `<DemoLink />` — styled CTA to /alignment/demo
- `<AuthorCard />` — links to muffinlabs.ai/about

### RSS Feed
```typescript
// src/app/blog/rss.xml/route.ts
// Generate RSS feed for blog posts
```

## Success Metrics

| Metric | Baseline | 90-Day Target |
|--------|----------|---------------|
| Blog posts published | 0 | 10+ |
| Organic blog traffic | 0 | 300 sessions/month |
| Newsletter subscribers | 0 | 50+ |
| Backlinks from blog | 0 | 10+ |
| Social shares | 0 | 50+ total |
| HN/Reddit front page | 0 | 1+ |

## Implementation Tasks

### Phase 1: Infrastructure
- [ ] Set up MDX blog infrastructure
- [ ] Create blog post template components
- [ ] Implement RSS feed
- [ ] Add blog to navigation
- [ ] Create Open Graph images for posts

### Phase 2: Initial Content (Weeks 1-4)
- [ ] Write launch post: "Introducing Alignment Dialogues"
- [ ] Write RFC 0051 post 1: "Building a Database..."
- [ ] Write RFC 0051 post 2: "Two-Phase ID Assignment..."
- [ ] Write ALIGNMENT scoring deep-dive

### Phase 3: Continued Content (Weeks 5-8)
- [ ] Write NVIDIA case study
- [ ] Write RFC 0054 post 1: "Calibrating AI Deliberation..."
- [ ] Write RFC 0054 post 2: "Domain-Specific Reasoning..."
- [ ] Write Expert Pools deep-dive

### Phase 4: Distribution (Ongoing)
- [ ] Syndicate to Dev.to
- [ ] Share on LinkedIn
- [ ] Submit launch post to HN
- [ ] Engage in relevant Reddit discussions

## Test Plan

- [ ] MDX rendering works with all components
- [ ] RSS feed validates
- [ ] Blog posts include proper schema markup
- [ ] Internal links to /alignment work
- [ ] Author cards link to muffinlabs.ai
- [ ] Mobile responsive
- [ ] Lighthouse performance score 90+

---

*"Document the journey. The destination will follow."*

— Blue
