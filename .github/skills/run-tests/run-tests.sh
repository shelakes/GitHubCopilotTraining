#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────
# run-tests.sh — deterministic Jest runner with structured output
# Usage:  bash .github/skills/run-tests/run-tests.sh [optional test path]
# ──────────────────────────────────────────────────────────────
set -euo pipefail

# Resolve project root (two levels up from .github/skills/run-tests/)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
cd "$PROJECT_ROOT"

# Ensure node_modules exist
if [ ! -d "node_modules/.package-lock.json" ] && [ ! -d "node_modules" ]; then
  echo "ERROR: node_modules not found. Run 'npm install' first." >&2
  exit 2
fi

# Build command
JEST_ARGS=(--verbose --no-cache)
if [ $# -gt 0 ]; then
  JEST_ARGS+=(-- "$@")
fi

# Capture Jest output and exit code
JEST_OUTPUT=$(npx jest "${JEST_ARGS[@]}" 2>&1) || JEST_EXIT=$?
JEST_EXIT=${JEST_EXIT:-0}

# Print full Jest output
echo "$JEST_OUTPUT"

# Parse counts from Jest summary lines
#   Tests:  X failed, Y passed, Z total
TOTAL=$(echo "$JEST_OUTPUT"  | grep -oP 'Tests:\s+.*?(\d+)\s+total'  | grep -oP '\d+(?=\s+total)')  || TOTAL=0
PASSED=$(echo "$JEST_OUTPUT" | grep -oP '(\d+)\s+passed' | grep -oP '^\d+') || PASSED=0
FAILED=$(echo "$JEST_OUTPUT" | grep -oP '(\d+)\s+failed' | grep -oP '^\d+') || FAILED=0

# Structured summary
echo ""
echo "=== TEST SUMMARY ==="
echo "Total:   ${TOTAL}"
echo "Passed:  ${PASSED}"
echo "Failed:  ${FAILED}"
echo "Exit:    ${JEST_EXIT}"
echo "===  END SUMMARY ==="

exit "$JEST_EXIT"
