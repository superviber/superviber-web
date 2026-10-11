[PERSPECTIVE P01: Time-synced meanings require LRC format extension]
The existing `LyricLine` type only carries `time` and `text`. Song meanings need a parallel data structure (e.g., `MeaningLine`) that shares the same timestamps but can attach to a range of lyric lines rather than a single line. This allows Claude to annotate a verse, not just individual lines. Extending the LRC parser to support custom tags like `[meaning:00:00.00-00:30.00]annotation text` preserves the toolchain admin already uses.

[PERSPECTIVE P02: Mobile treatment should be tap-to-reveal, not scroll-away]
On narrow views, sliding meanings to a secondary scroll region forces context switching and loses the karaoke flow. A tap-on-highlighted-line pattern (similar to Genius mobile) keeps users in the lyric stream while revealing meaning inline via expansion animation. This leverages the existing `lyric-current` glow as a visual affordance for "this line has more."

[TENSION T01: Claude generation latency vs. real-time sync expectation]
Pre-generating meanings at content creation time (admin workflow) sidesteps latency, but users may expect on-demand generation for songs lacking curated meanings. The architecture must decide whether meanings are always pre-computed or can be lazy-loaded mid-playback.

---
