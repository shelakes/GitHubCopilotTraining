---
mode: agent
description: Load and transform data from a JSON source into the RiskGuard data layer
tools: ['read', 'edit', 'search', 'execute']
---

# Load & Transform JSON Data

You are adding or updating data in the RiskGuard Dashboard data layer.
Follow this workflow step by step. Do not skip steps.

## Step 1 — Identify the source

Ask the user (or infer from context):
- What entity is being loaded? (customers, transactions, alerts, risk trends)
- Is the data in `data/transactions.json` or `data/mock-data.js`?
- What fields are required?

Read the existing data file to understand the current schema and format.

## Step 2 — Validate against the schema

Read `BLUEPRINT.md` and `.github/instructions/business-logic.instructions.md`
for the canonical field list and constraints:
- Required fields and their types
- Enum values (merchantCategory, status, severity, etc.)
- Referential integrity rules (e.g. every `customerId` must exist in CUSTOMERS)
- Risk score range: 0–100

If the source data does not match, list the discrepancies before proceeding.

## Step 3 — Transform and insert

Apply these rules when writing data:
- All data lives in a single file (`data/transactions.json` or `data/mock-data.js`) — never scatter across files.
- Global arrays (`CUSTOMERS`, `TRANSACTIONS`, `ALERTS`) are the single source of truth.
- Use consistent formatting: one object per line in compact arrays, or pretty-printed for readability.
- Ensure referential integrity: cross-check foreign keys against existing arrays.
- Risk scores must fall within the 0–100 range.
- Spread records across all four risk tiers (Low 0–30, Medium 31–60, High 61–85, Critical 86–100).

## Step 4 — Verify

After inserting the data:
1. Confirm the array length matches expectations.
2. Spot-check 2–3 records for field completeness.
3. Verify referential integrity (e.g. all `customerId` values resolve).
4. If tests exist, run them: `npx jest --verbose --no-cache`

Report a summary: records added, any integrity issues found, tier distribution.
