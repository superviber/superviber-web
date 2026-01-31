# Spike: Lyrics Auto Fetch Options

| | |
|---|---|
| **Status** | Resolved |
| **Date** | 2026-01-31 |
| **Time Box** | 30 minutes |
| **Outcome** | Recommends Implementation |
| **RFC** | [RFC-0003 Superviber Lyric Admin](../rfcs/0003-superviber-lyric-admin.draft.md) |

---

## Question

What are the viable options for automatically fetching lyrics? Evaluate MusixMatch API, Genius API, and other services for availability, pricing, licensing, and ease of integration.

---

## Findings

Investigated four APIs for automatic lyrics fetching:

### 1. LRCLIB ✓ Recommended
- **URL**: `https://lrclib.net/api/get?artist_name={artist}&track_name={track}`
- **Auth**: None required
- **Cost**: Free
- **Features**: Returns synchronized LRC format with timestamps, ~3M song database
- **Best for**: Direct import of pre-timed lyrics

### 2. Lyrics.ovh ✓ Recommended (fallback)
- **URL**: `https://api.lyrics.ovh/v1/{artist}/{track}`
- **Auth**: None required
- **Cost**: Free
- **Best for**: Plain-text lyrics when LRCLIB doesn't have the song

### 3. Genius API
- **Auth**: API key required (free tier available)
- **Limitation**: Returns song metadata/URLs, not lyrics directly
- **Workaround**: `genius-lyrics-api` npm package scrapes lyrics from pages
- **Verdict**: Unnecessary complexity given LRCLIB/Lyrics.ovh options

### 4. MusixMatch API ✗ Not Recommended
- **Auth**: API key required
- **Cost**: 2,000 requests/day free tier; commercial requires sales contact
- **Limitation**: Free tier returns only 30% of lyrics
- **Verdict**: Commercial restrictions make it unsuitable

---

## Recommendation

**Tiered approach for admin tool:**

1. **LRCLIB first** — synchronized lyrics with timestamps, zero manual effort
2. **Lyrics.ovh fallback** — plain lyrics, needs manual timestamp marking
3. **Manual paste** — copy/paste from any source (already in RFC 0003)

This approach is implemented in RFC 0003, Feature 6: Lyrics Auto-Fetch.

---

*— Blue*
