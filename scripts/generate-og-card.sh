#!/usr/bin/env bash
# Regenerates the Open Graph cards in public/images/ from scripts/og-card.html.
#
#   ./scripts/generate-og-card.sh            # all variants
#   ./scripts/generate-og-card.sh alignment  # just one
#
# Renders each variant at 1200x630 with headless Chromium, then encodes to
# JPEG (macOS `sips`). JPEG rather than PNG because the art is a smooth
# gradient: ~105KB vs ~445KB, with no visible difference at preview sizes.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$ROOT/scripts/og-card.html"

# variant:output-basename
VARIANTS=(
  "home:og-card"
  "alignment:og-alignment"
)

# Prefer a Playwright-cached headless shell; fall back to system Chrome.
CHROME=""
for candidate in \
  "$HOME"/Library/Caches/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-*/chrome-headless-shell \
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  "$(command -v chromium || true)"
do
  if [ -x "$candidate" ]; then CHROME="$candidate"; break; fi
done

if [ -z "$CHROME" ]; then
  echo "No Chromium found. Install one with: npx playwright install chromium" >&2
  exit 1
fi

only="${1:-}"

for entry in "${VARIANTS[@]}"; do
  variant="${entry%%:*}"
  basename="${entry##*:}"

  if [ -n "$only" ] && [ "$only" != "$variant" ]; then continue; fi

  tmp_png="$(mktemp -t "og-$variant").png"
  out="$ROOT/public/images/$basename.jpg"

  "$CHROME" --headless --disable-gpu --hide-scrollbars \
    --force-device-scale-factor=1 \
    --window-size=1200,630 \
    --virtual-time-budget=8000 \
    --screenshot="$tmp_png" \
    "file://$SRC?v=$variant" >/dev/null 2>&1

  sips -s format jpeg -s formatOptions 92 "$tmp_png" --out "$out" >/dev/null
  rm -f "$tmp_png"

  echo "Wrote public/images/$basename.jpg ($(du -h "$out" | cut -f1))"
done
