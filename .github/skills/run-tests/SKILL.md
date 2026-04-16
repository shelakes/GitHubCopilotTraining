---
name: run-tests
description: >
  Runs the project test suite with the correct command, flags, and structured
  output. Ensures every agent executes tests the same way — right runner,
  right config, machine-readable results.
---

# Skill: Run Tests

## When to Use

Any agent that needs to verify tests — after implementation, during TDD
red/green/refactor, or when validating acceptance criteria — **must** use this
skill instead of inventing its own test command.

## Prerequisites

The project uses **Jest** (dev-only; never shipped to production).
Before running tests, ensure dependencies are installed:

```
npm install --save-dev jest
```

If `package.json` does not exist yet, initialise it first:

```
npm init -y
npm install --save-dev jest
```

## How to Run

Use the provided script for your platform:

| Platform | Script | Command |
|----------|--------|---------|
| Unix/macOS/Git Bash | `run-tests.sh` | `bash .github/skills/run-tests/run-tests.sh` |
| Windows PowerShell | `run-tests.ps1` | `powershell -File .github/skills/run-tests/run-tests.ps1` |

Both scripts:
1. Run `npx jest --verbose --no-cache` from the project root
2. Print a structured summary block at the end:
   ```
   === TEST SUMMARY ===
   Total:   <n>
   Passed:  <n>
   Failed:  <n>
   Exit:    <0 or 1>
   ===  END SUMMARY ===
   ```
3. Exit with Jest's exit code (0 = all passed, 1 = failures)

## Rules

1. **Never** run bare `jest` — always use `npx jest` to use the local install.
2. **Always** pass `--verbose` so individual test names appear in output.
3. **Always** pass `--no-cache` to avoid stale results after file changes.
4. **Do not** add `--watch` or `--watchAll` — agents run tests non-interactively.
5. **Do not** add `--coverage` unless explicitly requested — it slows execution.
6. To run a **single test file**, append `-- <path>`:
   ```
   npx jest --verbose --no-cache -- tests/app.test.js
   ```
7. Interpret the structured summary to decide pass/fail — do not parse Jest's
   raw output with regex.

## Jest Configuration

Tests live in `tests/` and follow the naming convention `*.test.js`.
Jest should be configured (in `package.json` or `jest.config.js`) with:

```json
{
  "testMatch": ["**/tests/**/*.test.js"],
  "testEnvironment": "jsdom"
}
```

`jsdom` is required because app code references DOM APIs.
