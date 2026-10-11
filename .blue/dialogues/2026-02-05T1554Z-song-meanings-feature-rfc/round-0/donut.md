[PERSPECTIVE P01: Time-sync granularity mismatch]
The existing LRC format stores one timestamp per lyric line, but song meanings require semantic groupings (verse, chorus, bridge) that span multiple lines. Retrofitting line-level timestamps onto paragraph-level annotations will create jarring UX where meanings flicker or repeat. The data model needs a separate annotation layer with range timestamps (startTime, endTime) independent of the lyric line array.

[PERSPECTIVE P02: Mobile as primary context, not fallback]
Lyrics are most consumed on mobile during commutes and workouts. A "narrow view strategy" framing treats mobile as degraded desktop. Invert this: design meanings as tap-to-reveal overlays on mobile first, then derive the desktop side-panel as the progressive enhancement. This matches how Genius mobile works and avoids the common trap of desktop-first layouts that collapse poorly.

[TENSION T01: Admin edit latency vs. AI generation freshness]
Claude-generated meanings could be stale or generic for niche tracks. Admin edits require human review cycles. If both coexist, which source wins at render time, and how do admins know when to override AI output without reading every generated annotation?
