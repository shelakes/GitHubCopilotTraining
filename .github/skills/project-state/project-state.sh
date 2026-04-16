#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────
# project-state.sh — deterministic project state collector
# Usage:  bash .github/skills/project-state/project-state.sh
# Must be run from the project root.
# ──────────────────────────────────────────────────────────────
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
cd "$PROJECT_ROOT"

# ── Helpers ──────────────────────────────────────────────────

layer_stats() {
  # $1 = label, $@ after shift = glob patterns
  local label="$1"; shift
  local files=0 lines=0
  for pattern in "$@"; do
    for f in $pattern; do
      [ -f "$f" ] || continue
      files=$((files + 1))
      lines=$((lines + $(wc -l < "$f")))
    done
  done
  printf "Layer: %-13s Files: %-4s Lines: %s\n" "$label" "$files" "$lines"
}

# ── Layer counts ─────────────────────────────────────────────

echo ""
echo "=== PROJECT STATE ==="

layer_stats "data"         data/*.js data/*.json
layer_stats "business"     js/*.js
layer_stats "presentation" index.html
layer_stats "styles"       css/*.css

# Tests
TEST_FILE_COUNT=0
TEST_CASE_COUNT=0
TEST_LINES=0
if [ -d "tests" ]; then
  while IFS= read -r -d '' f; do
    TEST_FILE_COUNT=$((TEST_FILE_COUNT + 1))
    TEST_LINES=$((TEST_LINES + $(wc -l < "$f")))
    TEST_CASE_COUNT=$((TEST_CASE_COUNT + $(grep -cE '\b(test|it)\s*\(' "$f" || true)))
  done < <(find tests -type f \( -name '*.test.js' -o -name '*.spec.js' \) -print0 2>/dev/null)
fi
printf "Layer: %-13s Files: %-4s Lines: %s\n" "tests" "$TEST_FILE_COUNT" "$TEST_LINES"

echo "---"
echo "Test files:    $TEST_FILE_COUNT"
echo "Test cases:    $TEST_CASE_COUNT"

# ── Todo progress ────────────────────────────────────────────

TODO_TOTAL=0
TODO_DONE=0
if [ -f "developer_todo.md" ]; then
  TODO_TOTAL=$(grep -cE '^## Task [0-9]+' developer_todo.md || true)
  TODO_DONE=$(grep -ciE '(✅|\[x\]|Status:\s*Done|Status:\s*Complete)' developer_todo.md || true)
fi
TODO_OPEN=$((TODO_TOTAL - TODO_DONE))

echo "---"
echo "Todo total:    $TODO_TOTAL"
echo "Todo done:     $TODO_DONE"
echo "Todo open:     $TODO_OPEN"

# ── Environment signals ─────────────────────────────────────

if [ -d "node_modules" ]; then
  NODE_MODULES="installed"
else
  NODE_MODULES="missing"
fi

LINT_ERRORS="N/A"
if [ -d "node_modules" ] && [ -x "node_modules/.bin/eslint" ]; then
  LINT_OUTPUT=$(npx eslint js/ --format compact 2>&1 || true)
  LINT_ERRORS=$(echo "$LINT_OUTPUT" | grep -oP '\d+(?= error)' | awk '{s+=$1} END {print s+0}')
fi

echo "---"
echo "Node modules:  $NODE_MODULES"
echo "Lint errors:   $LINT_ERRORS"
echo "=== END STATE ==="
