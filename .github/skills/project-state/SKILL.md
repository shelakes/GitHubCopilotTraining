---
name: project-state
description: >
  Collects deterministic project state — source file counts by layer, test
  counts, todo progress, and lint/build signals. The PM agent runs this
  before planning instead of scanning files manually.
---

# Skill: Project State

## When to Use

Run this skill **before any planning session**. It gives the PM agent (or any
agent that needs project context) a machine-readable snapshot of the current
codebase without manual file scanning.

## How to Run

| Platform | Command |
|----------|---------|
| Windows PowerShell | `powershell -File .github/skills/project-state/project-state.ps1` |
| Unix/macOS/Git Bash | `bash .github/skills/project-state/project-state.sh` |

Both scripts must be run from the **project root**.

## What It Reports

The script prints a structured block:

```
=== PROJECT STATE ===
Layer: data          Files: <n>  Lines: <n>
Layer: business      Files: <n>  Lines: <n>
Layer: presentation  Files: <n>  Lines: <n>
Layer: styles        Files: <n>  Lines: <n>
Layer: tests         Files: <n>  Lines: <n>
---
Test files:    <n>
Test cases:    <n>  (grep count of `test(` and `it(`)
---
Todo total:    <n>
Todo done:     <n>  (tasks containing ✅ or [x])
Todo open:     <n>
---
Node modules:  <installed | missing>
Lint errors:   <n or N/A>
=== END STATE ===
```

## Layer Mapping

| Layer | Glob |
|-------|------|
| `data` | `data/**/*.{js,json}` |
| `business` | `js/**/*.js` (excluding tests) |
| `presentation` | `index.html` |
| `styles` | `css/**/*.css` |
| `tests` | `tests/**/*.test.js`, `tests/**/*.spec.js` |

## Rules

1. **Always** run this before planning — do not guess file counts or project state.
2. Parse the structured `=== PROJECT STATE ===` block for decisions; do not
   rely on other script output.
3. The script is **read-only** — it never modifies files.
4. If `node_modules` is missing, note it as a blocker for test-dependent items.
5. Line counts are approximate (physical lines, not logical) — use them for
   relative sizing, not exact estimates.
