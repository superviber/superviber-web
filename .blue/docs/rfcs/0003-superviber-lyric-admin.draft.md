# RFC 0003: Superviber Lyric Admin

| | |
|---|---|
| **Status** | Draft |
| **Date** | 2026-01-30 |
| **Dialogue** | [SuperViber.com Architecture](../dialogues/2026-01-30T1516Z-superviber-com-architecture.dialogue.recorded.md) |
| **Related RFCs** | RFC-0001 (landing), RFC-0002 (lyric-player) |
| **Depends On** | RFC-0000 (infrastructure) |

---

## Summary

Build an admin tool for creating and syncing lyrics to YouTube videos. Features: video URL validation, click-to-mark timestamp editing, LRC export. Data stored as JSON files in the repo, deployed via git push to AWS Amplify.

## Problem

Admins need to:
- Add songs to the SuperViber playlist
- Create synchronized lyrics by marking timestamps while watching the video
- Export lyrics in LRC format
- Deploy updates via git

## Architecture

### Data Storage

**Location**: JSON files in superviber-web repo

```
superviber-web/
├── data/
│   ├── songs.json           # Playlist metadata
│   └── lyrics/
│       ├── dQw4w9WgXcQ.lrc  # LRC file per video
│       └── ...
```

**Why JSON files in repo**:
- Zero backend complexity
- Git history = version control + audit trail
- PRs = review process for content changes
- Works with static hosting (AWS Amplify)
- Scales easily to ~100 songs

**Deployment Flow**:
```
Admin creates/edits lyrics locally
    ↓
git add data/ && git commit && git push
    ↓
Amplify auto-deploys
    ↓
New lyrics live on superviber.com
```

### songs.json Schema

```json
{
  "playlist": [
    {
      "videoId": "dQw4w9WgXcQ",
      "title": "Never Gonna Give You Up",
      "artist": "Rick Astley",
      "lrcFile": "dQw4w9WgXcQ.lrc",
      "addedAt": "2026-01-30T15:00:00Z",
      "lastVerified": "2026-01-30T15:00:00Z"
    }
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| videoId | string | YouTube video ID (11 chars) |
| title | string | Song title (from YouTube or manual) |
| artist | string | Artist name |
| lrcFile | string | Filename in data/lyrics/ |
| addedAt | ISO8601 | When song was added |
| lastVerified | ISO8601 | Last time video availability was checked |

### LRC Format

Standard LRC format (industry standard):

```
[ti:Never Gonna Give You Up]
[ar:Rick Astley]
[00:00.00]
[00:18.00] We're no strangers to love
[00:22.50] You know the rules and so do I
[00:27.00] A full commitment's what I'm thinking of
```

**Why LRC**:
- Industry standard, widely supported
- Simple format: `[mm:ss.xx] lyric line`
- Importable from existing sources
- Human-readable and git-diffable

### Admin Workflow

```
┌─────────────────────────────────────────────────────────────┐
│  1. ADD SONG                                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Paste YouTube URL: [_________________________]      │   │
│  │                    [Validate]                        │   │
│  │                                                      │   │
│  │ Title: Never Gonna Give You Up (auto-filled)        │   │
│  │ Artist: Rick Astley                                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  2. SYNC LYRICS                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  ┌──────────────┐  ┌──────────────────────────┐    │   │
│  │  │              │  │ Lyrics Editor             │    │   │
│  │  │  YouTube     │  │                          │    │   │
│  │  │  Player      │  │ We're no strangers...    │    │   │
│  │  │              │  │ You know the rules...    │    │   │
│  │  │              │  │ [Click line while video  │    │   │
│  │  │  [▶ 0:18]    │  │  plays to mark time]     │    │   │
│  │  └──────────────┘  └──────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  3. EXPORT & SAVE                                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ [Preview LRC]  [Download LRC]  [Copy to Clipboard]  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Admin Tool Hosting

**Option A: Local development tool only** (Recommended for MVP)
- Run `npm run admin` locally
- Outputs files to `data/` directory
- Commit and push to deploy

**Option B: Protected route on site**
- `/admin` route with password protection
- Generates files for download
- Admin manually commits to repo

**Recommendation**: Start with Option A (simpler). The admin tool is a local dev script that helps create LRC files. No server-side auth needed.

### Features

#### 1. Add Song
- Paste YouTube URL or video ID
- Validate via YouTube oEmbed (no API key needed)
- Auto-fill title, thumbnail, duration
- Handle invalid/private/unavailable videos with clear error

#### 2. Sync Lyrics
- Paste or type lyrics (plain text, one line per lyric)
- Play video, click lyric line to mark timestamp
- Visual indicator of current playback position
- Preview mode: see lyrics sync in real-time
- Edit timestamps manually if needed

#### 3. Export & Save
- Preview LRC output
- Download LRC file
- Copy to clipboard
- Save directly to `data/` directory (if running locally)

#### 4. Import (Optional)
- Import existing LRC files
- Paste LRC content or upload file
- Parse and display for editing

### Video Validation

**Primary**: YouTube oEmbed endpoint (no API key required)
```
GET https://www.youtube.com/oembed?url=https://youtube.com/watch?v={videoId}&format=json
```

Returns: title, thumbnail, author_name (channel)
404 = video unavailable

### Authentication

**For local admin tool**: None needed (runs on your machine)

**For web-based admin (if implemented later)**:
- Simple password via environment variable
- Basic auth or password form
- No user management, no OAuth

### Video Availability Monitoring

- `lastVerified` timestamp per song
- Manual check: run a script that calls oEmbed for each video
- Update status in songs.json
- No automated background jobs

```bash
# Example check script
npm run check-videos
# Output:
# ✓ dQw4w9WgXcQ - Never Gonna Give You Up
# ✗ abc123xyz - Video unavailable
```

## Non-Goals

- User accounts / RBAC
- Automated lyrics fetching from third-party services
- Timeline drag-to-adjust (v2 feature)
- Bulk import
- Lyrics licensing / third-party API integration
- Server-side admin panel (keep it simple with local tooling)

## Lyrics Source Policy

**User-provided only**. No integration with licensed providers (MusixMatch, Genius).

Admin manually enters or pastes lyrics. This sidesteps licensing complexity entirely.

Disclaimer in UI: "Lyrics provided by site administrators."

## Test Plan

- [ ] Can add song via YouTube URL
- [ ] Invalid URLs show clear error
- [ ] Can type/paste lyrics
- [ ] Click-to-mark timestamps works
- [ ] Timestamps are accurate (±100ms of click time)
- [ ] LRC preview shows correct format
- [ ] LRC download works
- [ ] Generated files are valid and work with player (RFC-0002)

## Success Criteria

- Admin can add a new song with synced lyrics
- Lyrics export correctly in LRC format
- Changes can be deployed via git push to Amplify

## Tasks

- [ ] Create admin tool as local dev script (npm run admin)
- [ ] Implement YouTube URL validation (oEmbed)
- [ ] Build lyrics editor UI with click-to-mark
- [ ] Implement LRC parser and generator
- [ ] Add preview mode with live sync
- [ ] Build export/download functionality
- [ ] Create video availability check script
- [ ] Add LRC import feature (optional)
- [ ] Document admin workflow in README

---

*"Right then. Let's get to it."*

— Blue
