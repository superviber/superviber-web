# Alignment Dialogue: SuperViber.com Architecture

**Draft**: Dialogue 0001
**Date**: 2026-01-30 15:16Z
**Status**: ✅ CONVERGED
**Participants**: 💙 Judge, 🧁 Muffin, 🧁 Cupcake, 🧁 Scone, 🧁 Eclair, 🧁 Donut, 🧁 Brioche

## Expert Panel

| Agent | Role | Tier | Relevance | Emoji |
|-------|------|------|-----------|-------|
| 💙 Judge | Orchestrator | — | — | 💙 |
| 🧁 Muffin | Systems Architect | Core | 0.95 | 🧁 |
| 🧁 Cupcake | Systems Thinker | Core | 0.90 | 🧁 |
| 🧁 Scone | Domain Expert | Adjacent | 0.70 | 🧁 |
| 🧁 Eclair | Devil's Advocate | Adjacent | 0.65 | 🧁 |
| 🧁 Donut | Integration Specialist | Adjacent | 0.60 | 🧁 |
| 🧁 Brioche | Risk Analyst | Wildcard | 0.40 | 🧁 |

## Alignment Scoreboard — Final

| Agent | Wisdom | Consistency | Truth | Relationships | **Total** |
|-------|--------|-------------|-------|---------------|-----------|
| 🧁 Muffin | 9 | 7 | 8 | 9 | **33** |
| 🧁 Cupcake | 10 | 9 | 8 | 7 | **34** |
| 🧁 Scone | 9 | 9 | 8 | 7 | **33** |
| 🧁 Eclair | 9 | 7 | 9 | 7 | **32** |
| 🧁 Donut | 10 | 9 | 10 | 7 | **36** |
| 🧁 Brioche | 12 | 8 | 9 | 10 | **39** |

**Total ALIGNMENT: 207**

**Velocity Trend**: +63 → +87 → +57 (converging)

## Perspectives Inventory

| ID | Agent | Perspective | Round |
|----|-------|-------------|-------|
| P01 | 🧁 Muffin | Three-RFC separation by deployment boundary | 0 |
| P02 | 🧁 Muffin | Hearth integration requires contract definition | 0 |
| P03 | 🧁 Muffin | Hearth contract proposal (infra only) | 1 |
| P04 | 🧁 Cupcake | Lyric sync is a 5-state temporal state machine | 0,1 |
| P05 | 🧁 Scone | Minimal song metadata schema | 1 |
| P06 | 🧁 Eclair | Side-by-side layout for YouTube ToS compliance | 1 |
| P07 | 🧁 Donut | YouTube Data API v3 integration spec | 1 |
| P08 | 🧁 Donut | Playlist as ordered song array | 1 |
| P09 | 🧁 Brioche | Simple video availability monitoring | 1 |
| P10 | 🧁 Brioche | Single shared password auth for MVP | 1 |
| P11 | 🧁 Muffin | RFC dependency graph (A→C→B implementation order) | 2 |
| P12 | 🧁 Scone | LRC import/export for portability | 2 |
| P13 | 🧁 Eclair | Explicit non-goals for RFC clarity | 2 |
| P14 | 🧁 Donut | Tech stack recommendation (SSG framework) | 2 |
| P15 | 🧁 Brioche | RFC naming convention | 2 |
| P16 | 🧁 Brioche | Success metrics per RFC | 2 |

## Tensions Tracker

| ID | Tension | Status | Raised | Resolved |
|----|---------|--------|--------|----------|
| T01 | Monorepo vs multi-repo structure | ✅ RESOLVED | 🧁 Muffin R0 | Separate repo, hearth as deployment target |
| T02 | Real-time sync precision | ✅ RESOLVED | 🧁 Cupcake R0 | ±100ms via requestAnimationFrame polling |
| T03 | Lyrics licensing complexity | ✅ RESOLVED | 🧁 Scone R0 | User-provided only, no third-party integration |
| T04 | Hearth infrastructure coupling | ✅ RESOLVED | 🧁 Eclair R0 | Hearth = deployment platform, not app service |
| T05 | Offline/PWA vs YouTube dependency | ✅ RESOLVED | 🧁 Donut R0 | Online-only MVP, YouTube is hard requirement |
| T06 | Single RFC vs RFC family | ✅ RESOLVED | 🧁 Brioche R0 | 3-RFC family confirmed |
| T07 | Data persistence strategy | ✅ RESOLVED | 🧁 Eclair R1 | JSON files in repo (songs.json + .lrc) |

---

## Round 0: Opening Arguments

### 🧁 Muffin

[PERSPECTIVE P01: Three-RFC separation by deployment boundary]
The webapp naturally decomposes into three RFCs: (1) superviber-web core (landing, about, contact as static/SSR pages), (2) lyric-player component (YouTube embed + lyric sync runtime), (3) lyric-admin tool (authoring interface for timestamp data). This separation aligns with distinct deployment cadences.

[PERSPECTIVE P02: Hearth integration requires contract definition]
The "../hearth" reference implies shared infrastructure but the integration contract is undefined. The RFC must specify: Does hearth provide DNS/routing, authentication, database, or just deployment targets?

[TENSION T01: Monorepo vs multi-repo unclear]
Should superviber-web live inside hearth's repo or as a separate repo with hearth as deployment target?

### 🧁 Cupcake

[PERSPECTIVE P04: Lyric sync is a temporal state machine]
The core complexity isn't the YouTube player—it's synchronizing discrete lyric events to continuous video time. This is a state machine problem: current lyric, next lyric, seek handling, pause/resume, playback rate changes.

[TENSION T02: Real-time sync precision vs browser limitations]
JavaScript timers and YouTube's time reporting have inherent latency. The RFC should specify acceptable sync tolerance (±50ms? ±200ms?).

### 🧁 Scone

[PERSPECTIVE: LRC format is the industry standard]
Lyric synchronization has a well-established format: LRC. Simple, widely supported, importable from existing sources.

[TENSION T03: Lyrics licensing is legally complex]
Song lyrics are copyrighted. Displaying synced lyrics may require licensing agreements or expose the site to DMCA claims.

### 🧁 Eclair

[PERSPECTIVE: YouTube embed restrictions conflict with custom player UX]
YouTube's IFrame Player API has strict terms prohibiting UI modifications that obscure branding. The RFC should specify layout approach.

[TENSION T04: Hearth infrastructure coupling undefined]
"Hosted in ../hearth" suggests filesystem-level coupling without defining the boundary.

### 🧁 Donut

[PERSPECTIVE: YouTube IFrame API is the integration contract]
The player must use YouTube's IFrame Player API, which provides getCurrentTime(), getPlayerState(), event callbacks.

[TENSION T05: Offline/PWA capability vs YouTube dependency]
If the player requires YouTube embeds, it cannot work offline. Should scope include offline support?

### 🧁 Brioche

[PERSPECTIVE: YouTube video availability is fragile]
YouTube videos get deleted, made private, or region-blocked without notice. RFC should specify monitoring and fallback.

[PERSPECTIVE: Admin authentication scope creep risk]
"Admin tool" implies auth. RFC should constrain the auth model.

[TENSION T06: Single RFC vs RFC family]
The scope spans three distinct concerns. One RFC risks becoming unwieldy; multiple RFCs risk coordination gaps.

---

## Round 1: Integration & Resolution

### 🧁 Muffin

[RESOLVED T01] Separate repo with hearth as deployment target. Loose coupling, independent versioning.

[RESOLVED T04] Hearth provides infrastructure (DNS, hosting, auth gateway) not application services.

[PERSPECTIVE P03: Hearth contract proposal]
Hearth provides: DNS routing, shared auth if needed, deployment target. No database or runtime coupling.

### 🧁 Cupcake

[RESOLVED T02] ±100ms acceptable. Use requestAnimationFrame polling at 60fps with getCurrentTime().

[PERSPECTIVE P04: State machine specification]
5 states: LOADING, READY, PLAYING, PAUSED, SEEKING. Transitions triggered by YouTube events.

[CONCESSION] LRC format is the obvious choice.

### 🧁 Scone

[RESOLVED T03] User-provided lyrics only. No third-party integration. Sidesteps licensing.

[PERSPECTIVE P05: Minimal metadata schema]
{ videoId, title, artist, lrc, addedAt }. Thumbnail from YouTube. Keep it simple.

### 🧁 Eclair

[PERSPECTIVE P06: YouTube ToS compliance path]
Side-by-side layout complies with YouTube ToS. Document explicitly in RFC.

[TENSION T07: Data persistence strategy]
Where do songs/lyrics live? JSON files, SQLite, or Postgres?

### 🧁 Donut

[RESOLVED T05] Online-only MVP. YouTube connectivity is hard requirement.

[PERSPECTIVE P07: YouTube Data API integration spec]
Admin tool uses Data API v3 for video validation and metadata fetch.

[PERSPECTIVE P08: Playlist as ordered song array]
Single playlist, admin-ordered. No complex playlist management in MVP.

### 🧁 Brioche

[RESOLVED T06] 3-RFC family confirmed with clear dependencies.

[PERSPECTIVE P09: Video availability monitoring]
Simple "last verified" timestamp. Manual check sufficient for small playlist.

[PERSPECTIVE P10: Auth model]
Single shared password for MVP. No user management, no roles.

---

## Round 2: Final Convergence

### 🧁 Muffin
[RESOLVED T07] JSON files in repo. Git = version control.
[CONVERGENCE CONFIRMED]
[PERSPECTIVE P11: RFC dependency graph] A→C→B implementation order.

### 🧁 Cupcake
[RESOLVED T07] Static files simplify deployment.
[CONVERGENCE CONFIRMED]
[REFINEMENT] Admin MVP: paste URL, type lyrics, click to mark, export LRC, save.

### 🧁 Scone
[RESOLVED T07] JSON + LRC files. Proven, portable.
[CONVERGENCE CONFIRMED]
[PERSPECTIVE P12: Import/export for portability]

### 🧁 Eclair
[RESOLVED T07] Withdrawing database options. JSON wins for this scale.
[CONVERGENCE CONFIRMED]
[PERSPECTIVE P13: Explicit non-goals] No user accounts, no public submission, no mobile app, no offline, no sharing.

### 🧁 Donut
[RESOLVED T07] No runtime API calls from player. Static files only.
[CONVERGENCE CONFIRMED]
[PERSPECTIVE P14: Tech stack] SSG framework (Next.js/Astro).

### 🧁 Brioche
[RESOLVED T07] Git history = audit trail, PRs = review.
[CONVERGENCE CONFIRMED]
[PERSPECTIVE P15: RFC naming] RFC-0001-superviber-landing, RFC-0002-superviber-lyric-player, RFC-0003-superviber-lyric-admin
[PERSPECTIVE P16: Success metrics per RFC]

---

## Converged Architecture

### RFC Family
| RFC | Scope | Dependencies |
|-----|-------|--------------|
| RFC-0001-superviber-landing | Landing, about, contact pages | None |
| RFC-0002-superviber-lyric-player | YouTube embed + LRC sync | Data schema |
| RFC-0003-superviber-lyric-admin | Lyrics authoring tool | None |

### Key Decisions
- **Repo**: Separate from hearth, hearth as deployment target
- **Data**: JSON files in repo (songs.json + data/lyrics/*.lrc)
- **Lyric format**: LRC (industry standard)
- **Sync**: ±100ms via requestAnimationFrame polling
- **Player states**: LOADING → READY → PLAYING ↔ PAUSED ↔ SEEKING
- **Layout**: Side-by-side (YouTube ToS compliant)
- **Offline**: Not supported (online-only MVP)
- **Auth**: Single shared password
- **Framework**: SSG (Next.js or Astro)

### Non-Goals
- User accounts
- Public lyric submission
- Mobile app
- Offline mode
- Playlist sharing
- Social features

### Success Criteria
- **RFC-1**: superviber.com live, contact emails to hello@superviber.com
- **RFC-2**: Player syncs lyrics to YouTube playback
- **RFC-3**: Admin can add songs, sync lyrics, deploy via git
