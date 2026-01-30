# RFC 0000: Superviber Infrastructure

| | |
|---|---|
| **Status** | Draft |
| **Date** | 2026-01-30 |
| **Dialogue** | [SuperViber.com Architecture](../dialogues/2026-01-30T1516Z-superviber-com-architecture.dialogue.recorded.md) |
| **Related RFCs** | RFC-0001 (landing), RFC-0002 (lyric-player), RFC-0003 (lyric-admin) |
| **Priority** | Must complete first — all other RFCs depend on this |

---

## Summary

Set up hosting infrastructure for SuperViber in its own AWS account, separate from muffinlabs/hearth for clean billing and ownership. DNS managed via PowerDNS in hearth.

## Problem

SuperViber needs its own infrastructure that:
- Has separate billing from hearth/muffinlabs
- Can host static web content with custom domain
- Is simple and low-cost for an MVP

## Current State

| Aspect | Status |
|--------|--------|
| AWS Account | ✅ Created (773474260280) |
| AWS Profile | ✅ `superviber` |
| IAM User | ✅ `eric` |
| Region | ✅ `us-east-1` |
| Domain (superviber.com) | ✅ Owned, DNS via PowerDNS in hearth |
| Amplify | ⏳ Not yet configured |

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  AWS Account: superviber (773474260280)                 │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  AWS Amplify (us-east-1)                        │   │
│  │  ├── App: superviber-web                        │   │
│  │  │   ├── Branch: main (production)              │   │
│  │  │   └── Branch: dev (preview)                  │   │
│  │  └── Custom Domain: superviber.com              │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
            │
            │ DNS points to Amplify
            ▼
┌─────────────────────────────────────────────────────────┐
│  Hearth (PowerDNS)                                      │
│  └── Zone: superviber.com                              │
│      ├── A/ALIAS → Amplify CloudFront distribution     │
│      ├── CNAME www → Amplify domain                    │
│      └── MX → Email provider                           │
└─────────────────────────────────────────────────────────┘
```

## Hosting: AWS Amplify

**Why Amplify:**
- Built-in CI/CD from GitHub
- Native Next.js/Astro support
- Automatic SSL certificates
- Preview deployments for PRs
- Simpler setup than S3+CloudFront

**Amplify Configuration:**
```yaml
# amplify.yml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist  # or .next for Next.js
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

## DNS Configuration (PowerDNS in Hearth)

After Amplify app is created, add these records in PowerDNS:

| Record | Type | Value |
|--------|------|-------|
| superviber.com | CNAME | `{amplify-domain}.cloudfront.net` |
| www.superviber.com | CNAME | `{amplify-domain}.cloudfront.net` |
| _acme-challenge.superviber.com | CNAME | Amplify validation record |

The exact values come from Amplify's domain configuration screen.

## Email: hello@superviber.com

Options (simplest first):

| Option | Cost | Complexity |
|--------|------|------------|
| **Email forwarding** (ImprovMX, Cloudflare) | Free-$5/mo | Very low |
| **Google Workspace** | $6/user/mo | Low |

Add MX records to PowerDNS for whichever provider you choose.

## Cost Estimate

| Service | Estimated Monthly Cost |
|---------|----------------------|
| Amplify Hosting (build + hosting) | $0-5 |
| **Total** | **~$0-5/month** |

No Route 53 costs since DNS is in hearth.

## Setup Procedure

### Phase 1: Create Amplify App

```bash
# Via CLI:
aws amplify create-app \
  --name superviber-web \
  --repository https://github.com/YOUR_ORG/superviber-web \
  --profile superviber \
  --region us-east-1

# Or via Console:
# 1. Amplify → Create new app
# 2. Connect GitHub repo
# 3. Select branch: main
# 4. Framework: Auto-detect
# 5. Deploy
```

### Phase 2: Configure Custom Domain

```bash
# In Amplify Console:
# 1. App → Domain management → Add domain
# 2. Enter: superviber.com
# 3. Amplify shows required DNS records
# 4. Add those records to PowerDNS in hearth
# 5. Wait for SSL certificate validation
```

### Phase 3: Email Setup (Optional)

```bash
# Using ImprovMX (free forwarding):
# 1. Go to improvmx.com
# 2. Add domain: superviber.com
# 3. Add MX records to PowerDNS:
#    - MX 10 mx1.improvmx.com
#    - MX 20 mx2.improvmx.com
# 4. Add forward: hello@superviber.com → your-email@gmail.com
```

## Non-Goals

- Route 53 (using PowerDNS in hearth)
- Multi-region deployment
- AWS Organizations integration
- Backend services (static site only)
- WAF/Shield (overkill for MVP)

## Test Plan

- [ ] Amplify app deploys from GitHub push
- [ ] superviber.com resolves to Amplify
- [ ] HTTPS works (certificate valid)
- [ ] hello@superviber.com receives email (if configured)

## Success Criteria

- superviber.com points to Amplify-hosted site
- Deployments happen automatically on git push
- Monthly cost is under $10

## Tasks

- [x] Create AWS account
- [x] Set up IAM user and CLI profile
- [ ] Create Amplify app connected to GitHub
- [ ] Configure custom domain in Amplify
- [ ] Add DNS records to PowerDNS in hearth
- [ ] Verify HTTPS and DNS propagation
- [ ] Set up email forwarding (optional)

---

*"Right then. Let's get to it."*

— Blue
