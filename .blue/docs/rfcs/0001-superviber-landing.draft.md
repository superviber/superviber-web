# RFC 0001: Superviber Landing

| | |
|---|---|
| **Status** | Draft |
| **Date** | 2026-01-30 |
| **Dialogue** | [SuperViber.com Architecture](../dialogues/2026-01-30T1516Z-superviber-com-architecture.dialogue.recorded.md) |
| **Related RFCs** | RFC-0002 (lyric-player), RFC-0003 (lyric-admin) |
| **Depends On** | RFC-0000 (infrastructure) |

---

## Summary

Create the landing page for superviber.com with about and contact sections. Deployed on Vercel (see RFC-0000).

## Problem

SuperViber needs a public-facing website at superviber.com with:
- Landing page introducing the service
- About section explaining what SuperViber does
- Contact section with hello@superviber.com

## Architecture

### Repository Structure

```
superviber-web/
├── src/
│   ├── pages/
│   │   ├── index.tsx     # Landing page
│   │   ├── about.tsx     # About page
│   │   └── contact.tsx   # Contact page
│   └── components/
│       └── ...           # Shared components
├── public/
│   └── ...               # Static assets
├── data/
│   ├── songs.json        # Playlist data (RFC-0003)
│   └── lyrics/           # LRC files (RFC-0003)
└── package.json          # Vercel auto-detects Next.js, no build config needed
```

### Hosting

**Platform:** Vercel (see RFC-0000)

| Aspect | Configuration |
|--------|---------------|
| Hosting | Vercel (Hobby) |
| Domain | superviber.com (Cloudflare DNS, apex CNAME, DNS-only) |
| SSL | Automatic via Vercel |
| CI/CD | Vercel auto-deploys from GitHub main branch; PRs get previews |

**Deployment Flow:**
```
git push origin main
    ↓
Vercel Git integration triggers a build
    ↓
Vercel runs: install → next build
    ↓
Deployed to Vercel's edge network
    ↓
Live at superviber.com
```

### Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Hosting**: Vercel
- **Contact**: mailto: link or simple form → hello@superviber.com

### Pages

#### Landing Page (`/`)
- Hero section with SuperViber branding
- Brief value proposition
- Link to lyric player (RFC-0002)
- Navigation to About and Contact

#### About Page (`/about`)
- What is SuperViber
- How it works
- Team/mission (if applicable)

#### Contact Page (`/contact`)
- Contact email: hello@superviber.com
- Simple contact form (optional, sends to email)

## Non-Goals

- User accounts
- Database backend
- Dynamic content
- API endpoints
- Mobile app

## Test Plan

- [ ] Landing page renders at superviber.com
- [ ] About page accessible at /about
- [ ] Contact page accessible at /contact
- [ ] Contact form/mailto sends to hello@superviber.com
- [ ] Pages load under 3 seconds on 3G
- [ ] Responsive on mobile, tablet, desktop
- [ ] Vercel deploys successfully on git push

## Success Criteria

- superviber.com is live and accessible
- All three pages render correctly
- Contact emails route to hello@superviber.com

## Tasks

- [ ] Initialize superviber-web repo with SSG framework
- [ ] Create landing page with hero and navigation
- [ ] Create about page
- [ ] Create contact page with email link/form
- [x] Connect repo to Vercel (RFC-0000)
- [x] Verify custom domain works
- [x] Deploy to production

---

*"Right then. Let's get to it."*

— Blue
