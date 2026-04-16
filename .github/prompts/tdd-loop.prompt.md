---
mode: agent
description: Run a full TDD loop — write failing tests, then implement until they pass
tools: ['read', 'edit', 'search', 'execute']
---

# TDD Loop: Red → Green → Refactor

You are implementing a feature using strict Test-Driven Development.
Follow this cycle exactly. Do not skip the red phase.

## Step 1 — Understand what to test

Ask the user (or infer from context):
- What function or behavior is being implemented?
- What are the inputs and expected outputs?
- What edge cases and error conditions matter?

Read the relevant source files and `.github/instructions/tests.instructions.md`
for testing conventions.

## Step 2 — RED: Write failing tests first

Create or update a test file in `tests/` (e.g. `tests/app.test.js`):

- Follow Arrange-Act-Assert pattern for every test
- Use descriptive names: `test('{function} returns {expected} for {input}')`
- Cover at minimum:
  - **Happy path** — normal expected input
  - **Boundary case** — values at tier thresholds (30/31, 60/61, 85/86)
  - **Negative case** — invalid input, empty arrays, missing data
- Mock external dependencies (Chart.js, DOM, global data arrays)
- One assertion per behavior — keep tests focused

### Ensure Jest is set up

If `package.json` or Jest config does not exist:
```
npm init -y
npm install --save-dev jest
```
Add to `package.json`:
```json
{ "scripts": { "test": "jest" }, "jest": { "testMatch": ["**/tests/**/*.test.js"], "testEnvironment": "jsdom" } }
```

### Run and confirm failure

```
npx jest --verbose --no-cache
```

**All new tests MUST fail.** If any pass, the test is not actually testing new
behavior — fix the test before proceeding.

Report: number of tests, all failing, failure reasons match expectations.

## Step 3 — GREEN: Write the minimum implementation

In `js/app.js` (inside the IIFE), implement **only** what is needed to make
the failing tests pass:

- Follow `.github/instructions/business-logic.instructions.md` rules
- Pure functions — no DOM access in logic functions
- Use constants for thresholds (`RISK_THRESHOLDS`), not magic numbers
- Return new arrays from filter/sort — never mutate globals
- Escape all dynamic data before DOM insertion

### Run tests again

```
npx jest --verbose --no-cache
```

**All tests MUST pass.** If any fail:
1. Read the failure output carefully
2. Fix the implementation (not the test) unless the test itself is wrong
3. Re-run until green

Report: all tests passing, implementation summary.

## Step 4 — REFACTOR: Clean up without changing behavior

Review the implementation for:
- Duplicated logic that can be extracted
- Magic numbers that should be constants
- Functions doing too much (split if > ~20 lines)
- Missing `escapeHtml()` on any DOM-bound data

### Run tests one final time

```
npx jest --verbose --no-cache
```

**All tests MUST still pass** after refactoring. If any regress, undo the
refactor and try a smaller change.

Report: final test count, all passing, what was refactored (if anything).

## Step 5 — Summary

Output a structured summary:

```
=== TDD CYCLE COMPLETE ===
Feature:     <what was implemented>
Tests added: <n>
Tests total: <n>
All passing: yes/no
Files changed:
  - tests/<file>.test.js
  - js/app.js
=== END ===
```
