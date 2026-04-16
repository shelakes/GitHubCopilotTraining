# RiskGuard Dashboard — Copilot Instructions

## Project Overview
Static, frontend-only fraud analyst tool. No backend, no Node.js, no build step.
Deliverable from any simple HTTP server.

## Tech Stack
- Vanilla JavaScript (ES6+), no frameworks
- Chart.js via CDN only: `https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js`
- Files: `index.html`, `css/styles.css`, `js/app.js`, `data/mock-data.js`

## Architecture
- **`data/mock-data.js`**: Global constants (`CUSTOMERS`, `TRANSACTIONS`, `RISK_LEVELS`, etc.). All mock data lives here — do not scatter data across files.
- **`js/app.js`**: All application logic inside a single IIFE. Cache DOM refs at the top, define functions, then init at the bottom.
- **`css/styles.css`**: Dark-theme CSS — all theme values defined as custom properties in `:root`.

## JavaScript Rules
- Wrap all application JS in an IIFE: `(function () { 'use strict'; ... })();`
- Always sanitize before inserting into the DOM: use `escapeHtml()` or `element.textContent`. Never use raw `.innerHTML` with unsanitized data.
- Format currency with `Intl.NumberFormat`; format dates with `Date.toLocaleDateString` / `toLocaleString`.
- Cache DOM references once at the top of the IIFE — do not re-query on every render.

## CSS Rules
- All colors, spacing, border-radius, and shadows must reference CSS custom properties from `:root`. Do not hardcode values.
- Risk-tier colors: `--risk-low`, `--risk-medium`, `--risk-high`, `--risk-critical`.
- Dark palette root: `--bg-primary: #0f172a`, `--bg-secondary: #1e293b`.

## Risk Tier System
Scores 0–100 map to four tiers:

| Tier | Range | CSS var | Hex |
|------|-------|---------|-----|
| Low | 0–30 | `--risk-low` | `#22c55e` |
| Medium | 31–60 | `--risk-medium` | `#f59e0b` |
| High | 61–85 | `--risk-high` | `#ef4444` |
| Critical | 86–100 | `--risk-critical` | `#991b1b` |

## Hard Constraints
- No external libraries beyond Chart.js.
- No backend, no API calls, no localStorage persistence.
- No authentication or login flow.
- All risk calculations are synchronous, in-browser.
