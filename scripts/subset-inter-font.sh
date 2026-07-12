#!/usr/bin/env bash
#
# Regenerate the self-hosted Inter font at static/fonts/InterVariable.woff2.
#
# The app only uses the InterVariable (variable) family via `--font-sans`
# (src/app.css) and never renders italic text, so we ship a single roman
# woff2, subset to the characters this English-language site actually uses.
# This takes the upstream 344 KB file down to ~68 KB.
#
# Requirements: Python 3 with fonttools + brotli.
#   python3 -m venv .venv && .venv/bin/pip install fonttools brotli
#
# Usage (from the repo root):
#   ./scripts/subset-inter-font.sh            # uses `pyftsubset` on PATH
#   PYFTSUBSET=.venv/bin/pyftsubset ./scripts/subset-inter-font.sh
#
# Bump INTER_VERSION to update Inter, then commit the regenerated woff2.
set -euo pipefail

INTER_VERSION="4.1"
SRC_URL="https://rsms.me/inter/font-files/InterVariable.woff2?v=${INTER_VERSION}"
OUT="static/fonts/InterVariable.woff2"
PYFTSUBSET="${PYFTSUBSET:-pyftsubset}"

# Latin + Latin-1 + common punctuation/symbols (matches Google Fonts' Inter
# "latin" subset). Covers all rendered text plus accented names.
UNICODES="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

echo "Downloading InterVariable ${INTER_VERSION}..."
curl -sSf -o "$tmp/InterVariable.woff2" "$SRC_URL"

echo "Subsetting to Latin range (variable weight axis preserved)..."
# Default layout features keep kern/liga/calt etc.; the optional cv##/ss##
# stylesets are dropped because the app sets no font-feature-settings.
"$PYFTSUBSET" "$tmp/InterVariable.woff2" \
  --output-file="$OUT" \
  --flavor=woff2 \
  --unicodes="$UNICODES"

echo "Wrote $OUT ($(wc -c < "$OUT") bytes)"
