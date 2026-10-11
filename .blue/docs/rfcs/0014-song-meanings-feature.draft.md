# RFC 0014: Song Meanings Feature

**Status**: Approved
**Created**: 2026-02-05
**Dialogue**: [2026-02-05T1554Z-song-meanings-feature-rfc.dialogue.recorded.md](../dialogues/2026-02-05T1554Z-song-meanings-feature-rfc.dialogue.recorded.md)
**ALIGNMENT Score**: 184 (2 rounds, 8 experts, 100% convergence)

## Summary

Add a Genius.com-style "song meaning" feature to SuperViber with Claude-generated annotations, admin editing tools, time-synced display alongside lyrics, and responsive mobile support.

## Motivation

Users want deeper engagement with lyrics beyond just reading them. Song meanings provide:
- Context for metaphors, references, and cultural significance
- Artist intent and background information
- Enhanced learning experience for music appreciation

## Design

### Data Model

#### Meanings File Structure

```
/data/meanings/{videoId}.json
```

```typescript
interface MeaningEntry {
  anchorLine: number;        // Line index that owns this meaning
  lineSpan?: number;         // How many lines this meaning covers (default: 1)
  meaning: string;           // The annotation text
  source: 'ai' | 'admin';    // Who created it
  reviewed: boolean;         // Has admin reviewed this?
}

interface MeaningsFile {
  songTitle?: string;
  artist?: string;
  meanings: MeaningEntry[];
}
```

#### Runtime Merge

At load time, merge `meanings.json` into enriched `LyricLine[]`:

```typescript
interface EnrichedLyricLine extends LyricLine {
  meaning?: string;          // Populated from meanings file
  meaningAnchor?: number;    // If part of a span, points to anchor line
}
```

### UI Components

#### Desktop (Wide View)

- **Layout**: Right panel alongside lyrics (flex: lyrics 60%, meanings 40%)
- **Behavior**: Meaning panel updates as playback progresses
- **Display**: Show meaning for current anchor line's span
- **Sync**: Reuse existing `useLyricSync` hook — meanings display when any line in span is current

#### Mobile (Narrow View)

- **Layout**: Lyrics only by default (preserve karaoke aesthetic)
- **Interaction**: Tap current lyric line → bottom sheet or inline expansion reveals meaning
- **Behavior**: Auto-collapse when line changes (optional setting)
- **Affordance**: Visual indicator (icon/badge) on lines that have meanings

### Admin Tooling

#### MeaningsEditor Component

Fork of `LyricsEditor.tsx` with:

1. **Anchor Selection**: Click a lyric line to set as meaning anchor
2. **Span Selection**: Drag or shift-click to define line span
3. **Meaning Editor**: Text area for annotation content
4. **Source Badge**: Visual indicator for AI vs admin-created
5. **Review Toggle**: Mark meanings as reviewed

#### Claude Integration

1. **Generate Button**: "Generate meanings with Claude" triggers API call
2. **Prompt**: Send full lyrics + song metadata → receive structured meanings
3. **Storage**: Save with `source: 'ai', reviewed: false`
4. **Regenerate**: Per-meaning "Regenerate" button for selective refresh

### Accessibility

1. **ARIA Live Regions**:
   - Meanings panel: `aria-live="polite"`
   - Delay 1-2 seconds after lyric announcement
   - Single announcement per meaning group (not per line)

2. **Keyboard Navigation**:
   - Enter/Space on focused lyric line → expand meaning
   - Escape → collapse
   - Tab navigation through lyrics respects meaning state

3. **Screen Readers**:
   - Announce: "[Lyric text]" then after delay "[Meaning text]"
   - Group announcements: "Verse meaning: [text]" not repeated per line

## Implementation Plan

### Phase 1: Data Model & Parser

- [ ] Create `MeaningEntry` and `MeaningsFile` types in `lib/types.ts`
- [ ] Create `meanings-parser.ts` with load/merge functions
- [ ] Add `hasMeanings: boolean` to `Song` interface in `songs.json`

### Phase 2: Desktop Display

- [ ] Create `MeaningsPanel.tsx` component
- [ ] Modify `PlayerClient.tsx` to add meanings panel on wide views
- [ ] Add meaning sync logic (reuse `useLyricSync` pattern)
- [ ] Style to match karaoke aesthetic

### Phase 3: Mobile Display

- [ ] Add tap handler to `LyricsPanel.tsx` for current line
- [ ] Create `MeaningSheet.tsx` bottom sheet component
- [ ] Add visual indicator for lines with meanings
- [ ] Implement auto-collapse on line change

### Phase 4: Admin Tooling

- [ ] Create `MeaningsEditor.tsx` component
- [ ] Add "Meanings" tab to AdminTool
- [ ] Implement anchor/span selection UI
- [ ] Add save endpoint `/api/admin/save-meanings`

### Phase 5: Claude Integration

- [ ] Create Claude prompt template for meaning generation
- [ ] Add "Generate" button to MeaningsEditor
- [ ] Implement `/api/admin/generate-meanings` endpoint
- [ ] Add source/reviewed tracking

### Phase 6: Accessibility

- [ ] Add `aria-live` regions with appropriate delays
- [ ] Implement keyboard handlers for tap-to-reveal
- [ ] Test with screen readers (VoiceOver, NVDA)

## File Changes

### New Files

- `src/lib/meanings-parser.ts` — Load and merge meanings
- `src/components/player/MeaningsPanel.tsx` — Desktop meanings display
- `src/components/player/MeaningSheet.tsx` — Mobile bottom sheet
- `src/components/admin/MeaningsEditor.tsx` — Admin editing tool
- `src/app/api/admin/save-meanings/route.ts` — Save meanings endpoint
- `src/app/api/admin/generate-meanings/route.ts` — Claude generation endpoint

### Modified Files

- `src/lib/types.ts` — Add MeaningEntry, EnrichedLyricLine types
- `src/components/player/PlayerClient.tsx` — Add meanings panel layout
- `src/components/player/LyricsPanel.tsx` — Add tap handlers, meaning indicators
- `src/components/admin/AdminTool.tsx` — Add Meanings tab
- `public/data/songs.json` — Add hasMeanings field

### Data Files

- `public/data/meanings/{videoId}.json` — One per song with meanings

## Open Questions

1. **Meaning depth**: Should meanings be brief (1-2 sentences) or comprehensive (paragraphs)?
2. **Versioning**: Should we track meaning edit history?
3. **User contributions**: Future feature for user-submitted meanings?

## References

- [Dialogue Record](../dialogues/2026-02-05T1554Z-song-meanings-feature-rfc.dialogue.recorded.md)
- [ADR 0001: Lyrics Scroll Behavior](../adrs/0001-lyrics-scroll-behavior.md)
- Genius.com annotation patterns
- Apple Music lyrics interaction model
