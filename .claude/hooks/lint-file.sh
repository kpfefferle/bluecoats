#!/usr/bin/env bash
# PostToolUse hook: auto-format and lint a single file after Write/Edit/MultiEdit.
# Reads the tool-call JSON from stdin and dispatches to prettier + the
# language-specific linter (eslint or stylelint) for the affected file.

set -uo pipefail

input=$(cat)
file_path=$(printf '%s' "$input" | /usr/bin/env python3 -c \
  'import json, sys; d=json.load(sys.stdin); print((d.get("tool_input") or {}).get("file_path") or "")' 2>/dev/null) || file_path=""

[ -z "$file_path" ] && exit 0
[ ! -f "$file_path" ] && exit 0

project_root="$(cd "$(dirname "$0")/../.." && pwd)"
case "$file_path" in
  "$project_root"/*) ;;
  *) exit 0 ;;
esac

rel_path="${file_path#"$project_root"/}"

# Skip generated/vendor paths
case "$rel_path" in
  node_modules/*|build/*|.svelte-kit/*|test-results/*|playwright-report/*|pnpm-lock.yaml|*.min.*)
    exit 0
    ;;
esac

cd "$project_root"

failures=0

# Prettier covers most file types we care about (ts, js, svelte, css, md, json, yml).
# --ignore-unknown silently skips file types prettier doesn't handle.
if ! pnpm exec prettier --write --log-level warn --ignore-unknown "$rel_path" 2>&1; then
  failures=1
fi

case "$rel_path" in
  *.ts|*.tsx|*.js|*.jsx|*.mjs|*.cjs|*.svelte)
    if ! pnpm exec eslint --fix "$rel_path" 2>&1; then
      failures=1
    fi
    ;;
  *.css)
    if ! pnpm exec stylelint --fix "$rel_path" 2>&1; then
      failures=1
    fi
    ;;
esac

exit "$failures"
