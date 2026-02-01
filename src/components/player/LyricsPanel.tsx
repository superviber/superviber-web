'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { LyricLine } from '@/lib/lrc-parser';

interface LyricsPanelProps {
  lines: LyricLine[];
  currentLineIndex: number;
  title?: string;
  artist?: string;
}

export function LyricsPanel({
  lines,
  currentLineIndex,
  title,
  artist,
}: LyricsPanelProps) {
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  // Ref callback to get container
  const containerRefCallback = useCallback((node: HTMLDivElement | null) => {
    setContainer(node);
  }, []);

  // Auto-scroll: start at top, only scroll-to-center when line passes center threshold
  // See ADR 0001 and RFC 0004 for rationale
  useEffect(() => {
    if (!container || lines.length === 0) return;

    // Guard: no scroll action before playback starts
    // Container naturally starts at scrollTop=0, preserving "start at top" behavior
    if (currentLineIndex < 0) return;

    const lineEl = lineRefs.current[currentLineIndex];
    if (!lineEl) return;

    // Use getBoundingClientRect for accurate visual position
    const containerRect = container.getBoundingClientRect();
    const lineRect = lineEl.getBoundingClientRect();

    // Calculate where the line currently appears relative to the container
    const lineVisualTop = lineRect.top - containerRect.top;
    const containerHeight = container.clientHeight;

    // Threshold check: only scroll when line visually appears below center
    // This implements ADR 0001's "scroll-when-needed" strategy
    const shouldScrollToCenter = lineVisualTop > containerHeight / 2;
    if (!shouldScrollToCenter) return;

    // Calculate line's position within scrollable content
    // Note: offsetTop is relative to offsetParent (often BODY), not the scroll container
    // So we derive content position from visual position + current scroll
    const lineContentPosition = lineVisualTop + container.scrollTop;
    const lineHeight = lineEl.clientHeight;
    const targetScroll = lineContentPosition - containerHeight / 2 + lineHeight / 2;

    container.scrollTo({
      top: Math.max(0, targetScroll),
      behavior: 'smooth',
    });
  }, [currentLineIndex, container, lines]);

  if (lines.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-500 p-8">
        <div className="text-center">
          <p className="text-lg">No lyrics available</p>
          <p className="text-sm mt-2">Enjoy the music!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      {/* Song info header - hidden on mobile since it's in the selector */}
      {(title || artist) && (
        <div className="hidden lg:block px-6 py-4 border-b border-white/10 flex-shrink-0">
          {title && <h2 className="text-xl font-semibold">{title}</h2>}
          {artist && <p className="text-zinc-400">{artist}</p>}
        </div>
      )}

      {/* Lyrics container - overflow-anchor:none prevents browser scroll anchoring */}
      <div
        ref={containerRefCallback}
        className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-4 min-h-[200px] max-w-full"
        style={{ overflowAnchor: 'none', wordWrap: 'break-word' }}
      >

        {lines.map((line, index) => {
          const isCurrent = index === currentLineIndex;
          const distance = Math.abs(index - currentLineIndex);
          const isAdjacent = distance === 1;
          const isFar = distance > 2;

          return (
            <div
              key={index}
              ref={(el) => {
                lineRefs.current[index] = el;
              }}
              className={`
                py-3 lg:py-4 px-[15%] lg:pl-4 lg:pr-[20%]
                transition-[transform,color,opacity,text-shadow] duration-300 ease-out
                text-center lg:text-left origin-center lg:origin-left
                break-words
                ${isCurrent ? 'lyric-current' : ''}
                ${isAdjacent && !isCurrent ? 'lyric-adjacent' : ''}
                ${isFar && !isCurrent ? 'lyric-distant' : ''}
                ${!isCurrent && !isAdjacent && !isFar ? 'lyric-adjacent' : ''}
              `}
            >
              {line.text || <span className="text-zinc-600">♪</span>}
            </div>
          );
        })}

      </div>
    </div>
  );
}
