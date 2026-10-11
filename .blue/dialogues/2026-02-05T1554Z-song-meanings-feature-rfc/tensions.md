# Tensions — Song Meanings Feature RFC

| ID | Tension | Status | Resolution |
|----|---------|--------|------------|
| T01 | **Granularity mismatch**: Lyrics are line-granular but meanings often span verse/chorus sections | ✅ Resolved | Anchor-line model: meanings attach to primary line with `lineSpan` indicating coverage |
| T02 | **Data structure divergence**: Inline vs parallel file | ✅ Resolved | Hybrid: parallel `.meanings.json` for storage, merged into enriched `LyricLine[]` at runtime |
| T03 | **AI generation timing**: Pre-generate vs on-demand | ✅ Resolved | Pre-generate at import with `source: 'ai'|'admin'` flags; admin "Regenerate" button |
| T04 | **Accessibility: ARIA live region conflicts** | ✅ Resolved | `aria-live="polite"` with 1-2s delay; single announcement per meaning group |

## Convergence Points

All tensions resolved in Round 1. Unanimous convergence (8/8 experts).

### Architecture Decisions

1. **Data Model**:
   - Parallel `.meanings.json` file (not embedded in LRC)
   - Keyed by anchor line index
   - Fields: `{ meaning: string, lineSpan?: number, source: 'ai'|'admin', reviewed: boolean }`
   - Merged into `LyricLine[]` at load time for rendering

2. **Mobile UX**: Tap-to-reveal (bottom sheet or inline expansion)

3. **Desktop UX**: Right panel alongside lyrics

4. **Admin Tooling**:
   - Fork of LyricsEditor as MeaningsEditor
   - Anchor line + span selection
   - "Regenerate with Claude" button per meaning

5. **Accessibility**:
   - Keyboard: Enter/Space to expand, Escape to collapse
   - Screen readers: `aria-live="polite"`, announce once per group transition
