# RFC 0000: Superviber Infrastructure

| | |
|---|---|
| **Status** | Draft |
| **Date** | 2026-01-30 |
| **Last Updated** | 2026-06-27 |
| **Dialogue** | [SuperViber.com Architecture](../dialogues/2026-01-30T1516Z-superviber-com-architecture.dialogue.recorded.md) |
| **Related RFCs** | RFC-0001 (landing), RFC-0002 (lyric-player), RFC-0003 (lyric-admin) |
| **Priority** | Must complete first — all other RFCs depend on this |

---

## Summary

Host SuperViber on **Vercel** (Git-integrated, auto-deploy from GitHub), with **DNS on Cloudflare** and **email on Google Workspace**. Chosen over AWS Amplify for zero-config Next.js support and a simpler setup.

## Problem

SuperViber needs its own infrastructure that:
- Can host the Next.js web app with a custom domain
- Has automatic CI/CD and preview deployments
- Is simple and low-cost for an MVP

## Current State

| Aspect | Status |
|--------|--------|
| Vercel project (`superviber-web`) | ✅ Created, Git-integrated, deploying from `main` |
| Production URL | ✅ https://superviber-web.vercel.app |
| Custom domain (superviber.com) | ✅ Valid configuration, HTTPS issued |
| Domain (superviber.com) | ✅ Owned, DNS via Cloudflare |
| Email | ✅ Google Workspace (MX/SPF/DKIM in Cloudflare) |
| AWS Account | ✅ Owned (773474260280) — not used for web hosting |

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Vercel ("Eric Garcia's projects", Hobby)               │
│  └── Project: superviber-web                            │
│      ├── Git: github.com/superviber/superviber-web      │
│      ├── Branch main → Production                       │
│      ├── PRs       → Preview deployments                │
│      └── Custom Domain: superviber.com (HTTPS auto)     │
└─────────────────────────────────────────────────────────┘
            ▲
            │ apex CNAME (flattened), DNS-only
            │
┌─────────────────────────────────────────────────────────┐
│  Cloudflare DNS                                         │
│  └── Zone: superviber.com                              │
│      ├── CNAME @ → eead38fca51f18da.vercel-dns-017.com │
│      │            (Proxy OFF / DNS-only)                │
│      └── MX / SPF / DKIM → Google Workspace             │
└─────────────────────────────────────────────────────────┘
```

## Hosting: Vercel

**Why Vercel (over AWS Amplify):**
- Zero-config Next.js support (made by the Next.js team)
- Built-in CI/CD from GitHub, auto-deploy on push to `main`
- Automatic SSL certificates
- Preview deployments for every PR
- No build config to maintain (Amplify needed `amplify.yml`)

**Configuration:** None required — Vercel auto-detects Next.js. Root directory `./`, no environment variables (content is filesystem markdown).

**Trade-off vs Amplify:** Hosting moves outside the `superviber` AWS account, so it bills separately from AWS. The repo was made **public** so the Hobby plan can deploy it (private org repos require Vercel Pro). The AWS account remains owned but is not used for web hosting.

## DNS Configuration (Cloudflare)

The apex domain points at Vercel via a single CNAME (Cloudflare flattens it to A records at the apex):

| Record | Type | Name | Value | Proxy |
|--------|------|------|-------|-------|
| superviber.com | CNAME | `@` | `eead38fca51f18da.vercel-dns-017.com` | **DNS only (grey cloud)** |

**Important:** Proxy must stay **off (DNS-only)** for Vercel's domain verification and SSL issuance. Turning Cloudflare's orange-cloud proxy on would break cert issuance and put two CDNs in series.

Email records (Google Workspace MX, SPF, DKIM) are managed separately in the same Cloudflare zone and are unrelated to hosting.

## Email: Google Workspace

Email for the domain is on **Google Workspace**, configured via Cloudflare DNS:
- **MX** → `smtp.google.com`
- **TXT (SPF)** → `v=spf1 include:_spf.google.com ~all`
- **TXT (DKIM)** → `google._domainkey`

## Cost Estimate

| Service | Estimated Monthly Cost |
|---------|----------------------|
| Vercel Hobby (hosting) | $0 |
| Cloudflare DNS (free plan) | $0 |
| Google Workspace | ~$6/user/mo |
| **Total** | **~$6/month** |

No AWS/Route 53 costs for web hosting.

## Setup Procedure (completed)

### Phase 1: Create Vercel Project
1. Vercel → New Project → Import Git Repository
2. Connect GitHub, grant access to the `superviber` org
3. Select `superviber/superviber-web`, branch `main`
4. Framework auto-detected as Next.js → Deploy
   - *(Hobby plan requires a public repo to deploy from a GitHub org; the repo was made public.)*

### Phase 2: Configure Custom Domain
1. Project → Settings → Domains → Add `superviber.com`
2. Apex chosen as canonical (www-redirect left unchecked)
3. Vercel shows the required CNAME for Cloudflare
4. Add the CNAME in Cloudflare (Proxy OFF), then Refresh in Vercel
5. SSL certificate issued automatically once verified

### Phase 3: Email (already configured)
Email is on Google Workspace; records live in Cloudflare (see above).

## Non-Goals

- AWS Amplify / Route 53 (chose Vercel + Cloudflare)
- Cloudflare proxy/CDN in front of Vercel (DNS-only for now)
- Multi-region deployment
- Backend services (static/SSG site only)
- WAF/Shield (overkill for MVP)

## Test Plan

- [x] Vercel deploys from GitHub push to `main`
- [x] superviber.com resolves to Vercel
- [x] HTTPS works (certificate valid)
- [x] Email on Google Workspace receives mail

## Success Criteria

- [x] superviber.com points to the Vercel-hosted site
- [x] Deployments happen automatically on git push
- [x] Monthly cost is under $10

## Tasks

- [x] Create Vercel project connected to GitHub
- [x] Deploy from `main`
- [x] Configure custom domain (superviber.com) in Vercel
- [x] Add apex CNAME in Cloudflare (DNS-only)
- [x] Verify HTTPS and DNS propagation
- [ ] (Optional) Add `www.superviber.com` redirect → apex
- [ ] (Optional) Record the Amplify→Vercel decision as a decision doc

---

*"Right then. Let's get to it."*

— Blue
