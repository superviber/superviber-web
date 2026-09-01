#!/usr/bin/env bash
# Regenerates public/images/og-card.jpg (1200x630) from scripts/og-card.html.
#
#   ./scripts/generate-og-card.sh
#
# Renders with headless Chromium, then encodes to JPEG (macOS `sips`). JPEG
# rather than PNG because the card is a smooth gradient: ~105KB vs ~445KB with
# no visible difference at social-preview sizes.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$ROOT/scripts/og-card.html"
TMP_PNG="$(mktemp -t og-card).png"
OUT="$ROOT/public/images/og-card.jpg"

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

"$CHROME" --headless --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=1 \
  --window-size=1200,630 \
  --virtual-time-budget=8000 \
  --screenshot="$TMP_PNG" \
  "file://$SRC" >/dev/null 2>&1

sips -s format jpeg -s formatOptions 92 "$TMP_PNG" --out "$OUT" >/dev/null
rm -f "$TMP_PNG"

echo "Wrote public/images/og-card.jpg ($(du -h "$OUT" | cut -f1))"
