---
mode: agent
description: Create a UI component connected to a data source in the RiskGuard Dashboard
tools: ['read', 'edit', 'search', 'execute']
---

# Create a Data-Connected UI Component

You are building a new UI component for the RiskGuard Dashboard that reads
from the data layer and renders into the DOM. Follow this workflow step by step.

## Step 1 — Understand the requirement

Ask the user (or infer from context):
- What data does this component display? (customers, transactions, alerts, KPIs, charts)
- Where does it appear in the layout? (main content area, sidebar, modal, card)
- Does it need filtering, sorting, or search?
- Does it need to respond to events from other components?

## Step 2 — Read existing code

Before writing anything, read these files:
- `index.html` — find where the component's container element should go
- `js/app.js` — understand the IIFE structure, existing render functions, and cached DOM refs
- `css/styles.css` — review existing component patterns and CSS custom properties
- `data/transactions.json` or `data/mock-data.js` — understand the data shape
- `.github/instructions/presentation-layer.instructions.md` — mandatory rendering rules

Note the patterns already in use (table rendering, badge helpers, event delegation).

## Step 3 — Add HTML structure

In `index.html`, add the component's container markup:
- Use semantic HTML (`<section>`, `<table>`, `<button>`, not generic `<div>` soup)
- Add `id` attributes for elements that `app.js` will reference
- Include `aria-label` on interactive elements
- Place within the correct view/section in the existing layout

## Step 4 — Add CSS styles

In `css/styles.css`:
- Use only CSS custom properties from `:root` — never hardcode colors, spacing, or shadows
- Follow existing naming conventions (BEM-like: `.component`, `.component__element`, `.component--modifier`)
- Use risk-tier variables for color-coded elements: `--risk-low`, `--risk-medium`, `--risk-high`, `--risk-critical`
- Ensure the component is responsive (test at mobile ≤ 768px)

## Step 5 — Add rendering logic

In `js/app.js`, inside the IIFE:
1. **Cache DOM refs** at the top with the other cached refs — do not query on every render
2. **Write a pure data function** if needed (filtering, sorting, aggregation) — no DOM access
3. **Write the render function**:
   - Always escape dynamic data with `escapeHtml()` before inserting into HTML
   - Build HTML strings in memory, then assign to `innerHTML` once (no DOM queries in loops)
   - Format currency with `Intl.NumberFormat`; format dates with `toLocaleDateString`
4. **Wire up events** using event delegation on a stable parent element
5. **Call the render function** from the init block at the bottom of the IIFE

## Step 6 — Connect to data source

- Read from the global data arrays (`CUSTOMERS`, `TRANSACTIONS`, `ALERTS`)
- Filtering/sorting must return new arrays — never mutate the source
- If the component depends on another component's state (e.g. selected customer), accept it as a parameter

## Step 7 — Verify

1. Open `index.html` in a browser and confirm the component renders correctly
2. Check the browser console for errors
3. Verify `escapeHtml()` is used on all dynamic content
4. Confirm CSS custom properties are used (no hardcoded hex values)
5. Test responsive behavior at narrow viewport widths
6. If tests exist, run: `npx jest --verbose --no-cache`

Report: what was added, which files changed, any open issues.
