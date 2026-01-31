export interface LyricLine {
  time: number; // seconds
  text: string;
}

export interface ParsedLRC {
  title?: string;
  artist?: string;
  lines: LyricLine[];
}

/**
 * Parse LRC format lyrics into structured data
 * Format: [mm:ss.xx] Lyric text
 */
export function parseLRC(lrcContent: string): ParsedLRC {
  const lines = lrcContent.split('\n');
  const result: ParsedLRC = { lines: [] };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Parse metadata tags
    const metaMatch = trimmed.match(/^\[([a-z]+):(.+)\]$/i);
    if (metaMatch) {
      const [, tag, value] = metaMatch;
      if (tag === 'ti') result.title = value.trim();
      if (tag === 'ar') result.artist = value.trim();
      continue;
    }

    // Parse timestamp + lyrics
    const lyricMatch = trimmed.match(/^\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)$/);
    if (lyricMatch) {
      const [, minutes, seconds, centiseconds, text] = lyricMatch;
      const time =
        parseInt(minutes) * 60 +
        parseInt(seconds) +
        parseInt(centiseconds.padEnd(3, '0')) / 1000;

      result.lines.push({
        time,
        text: text.trim(),
      });
    }
  }

  // Sort by time (should already be sorted, but ensure it)
  result.lines.sort((a, b) => a.time - b.time);

  return result;
}

/**
 * Find the current lyric line index for a given time
 */
export function findCurrentLineIndex(lines: LyricLine[], currentTime: number): number {
  if (lines.length === 0) return -1;

  // Find the last line that has started
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].time <= currentTime) {
      return i;
    }
  }

  return -1; // Before first line
}
