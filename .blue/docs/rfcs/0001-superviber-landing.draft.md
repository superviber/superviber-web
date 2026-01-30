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

Create the landing page for superviber.com with about and contact sections. Static pages deployed to AWS Amplify in SuperViber's own AWS account.

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
├── amplify.yml           # Amplify build config
└── package.json
```

### Hosting

**Platform:** AWS Amplify (see RFC-0000)

| Aspect | Configuration |
|--------|---------------|
| AWS Account | superviber (773474260280) |
| Hosting | AWS Amplify |
| Domain | superviber.com (PowerDNS in hearth) |
| SSL | Automatic via Amplify |
| CI/CD | Amplify auto-deploys from GitHub main branch |

**Deployment Flow:**
```
git push origin main
    ↓
GitHub webhook triggers Amplify
    ↓
Amplify runs: npm ci → npm run build
    ↓
Static files deployed to CDN
    ↓
Live at superviber.com
```

### Tech Stack

- **Framework**: Next.js or Astro (SSG mode)
- **Styling**: TBD (Tailwind, CSS modules, etc.)
- **Hosting**: AWS Amplify
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
- [ ] Amplify deploys successfully on git push

## Success Criteria

- superviber.com is live and accessible
- All three pages render correctly
- Contact emails route to hello@superviber.com

## Tasks

- [ ] Initialize superviber-web repo with SSG framework
- [ ] Create amplify.yml build configuration
- [ ] Create landing page with hero and navigation
- [ ] Create about page
- [ ] Create contact page with email link/form
- [ ] Connect repo to Amplify (after RFC-0000 complete)
- [ ] Verify custom domain works
- [ ] Deploy to production

---

*"Right then. Let's get to it."*

— Blue
