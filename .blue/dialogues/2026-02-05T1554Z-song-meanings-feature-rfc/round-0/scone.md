[PERSPECTIVE P01: Screen reader synchronization]
The current `LyricLine` interface and `useLyricSync` hook assume visual focus follows playback time, but meanings shown in a side panel break this model for screen reader users. When meanings update alongside the current lyric, users relying on ARIA live regions will receive competing announcements: the lyric text and the meaning text simultaneously, creating cognitive overload. Meanings need `aria-live="polite"` with deliberate delays (not `assertive` with lyrics) so the lyric lands first, then the meaning follows after a 1-2 second buffer.

[PERSPECTIVE P02: Mobile tap-to-reveal preserves focus]
For narrow views, a side panel is impossible and inline expansion is problematic for auto-scrolling lyrics. A tap-to-reveal pattern (tapping a lyric pauses playback and reveals its meaning inline) respects the existing scroll mechanics in `LyricsPanel.tsx` while giving users agency. This avoids the trap of shoving meanings below lyrics where they scroll out of view.

[TENSION T01: Time-sync granularity]
The current LRC format stores one timestamp per line, but meanings may apply to phrases within a line or span multiple lines. Extending the data model to support time ranges risks incompatibility with existing lyrics infrastructure.
