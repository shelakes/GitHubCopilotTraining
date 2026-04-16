# RiskGuard — Developer Task List

> Each task is scoped to ≤5 files, has a testable acceptance criterion, a TDD requirement, and a domain tag.

---

## Task 1: Create CUSTOMERS mock data array

**Domain:** `data-layer`
**Files:** `data/mock-data.js`
**Priority:** Critical (blocker)

**Description:**
Define a `CUSTOMERS` global array in `data/mock-data.js` with at least 10 customer records. Each record must include: `id`, `name`, `type` (Corporate/Individual), `country`, `riskScore` (0–100), `accountOpenDate`, `lastReviewDate`, `kycStatus`, `pep`, `sanctioned`, `totalBalance`, and `currency`. Spread records across all four risk tiers (Low, Medium, High, Critical).

**Acceptance Criteria:**
- `CUSTOMERS` is a global array accessible from `js/app.js`
- Every record has all required fields with valid types
- At least 2 customers per risk tier
- Risk scores stay within 0–100

**TDD — Tests before done:**
- `CUSTOMERS` array has ≥10 entries
- Every entry contains all required fields (no `undefined`)
- `riskScore` values fall within 0–100 for all entries
- At least one customer with `pep: true` and one with `sanctioned: true`

---

## Task 2: Create TRANSACTIONS mock data array

**Domain:** `data-layer`
**Files:** `data/mock-data.js`
**Priority:** Critical (blocker)

**Description:**
Define a `TRANSACTIONS` global array with at least 30 transaction records. Each record must include: `id`, `customerId` (references a `CUSTOMERS.id`), `amount`, `currency`, `merchant`, `merchantCategory` (RETAIL, GAMBLING, CRYPTO_EXCHANGE, UTILITIES, TRAVEL, OTHER), `originCountry`, `destinationCountry`, `riskScore`, `flags` (array of fraud indicator strings), `timestamp`, `status` (APPROVED, PENDING_REVIEW, BLOCKED), and `direction` (inbound/outbound).

**Acceptance Criteria:**
- `TRANSACTIONS` is a global array accessible from `js/app.js`
- Every `customerId` references a valid `CUSTOMERS` entry
- All merchant categories and statuses use the defined enums
- Transactions span the last 30 days with some clustering in the last 24 hours

**TDD — Tests before done:**
- `TRANSACTIONS` array has ≥30 entries
- Every `customerId` maps to a valid `CUSTOMERS[].id`
- `riskScore` values are 0–100
- `flags` is always an array (even if empty)
- `merchantCategory` is one of the six allowed enum values
- `status` is one of APPROVED, PENDING_REVIEW, BLOCKED

---

## Task 3: Create ALERTS mock data array

**Domain:** `data-layer`
**Files:** `data/mock-data.js`
**Priority:** Critical (blocker)

**Description:**
Define an `ALERTS` global array with at least 15 alert records. Each record must include: `id`, `customerId`, `customerName`, `type` (alert description), `severity` (Low, Medium, High, Critical), `status` (New, Investigating, Resolved), `createdDate`, `assignedTo`, and `riskScore`. Alerts should correlate to high-risk customers and flagged transactions.

**Acceptance Criteria:**
- `ALERTS` is a global array accessible from `js/app.js`
- Every `customerId` references a valid `CUSTOMERS` entry
- Alerts cover all severity levels and statuses
- At least 3 alerts have `status: 'New'` (to populate the badge count)

**TDD — Tests before done:**
- `ALERTS` array has ≥15 entries
- Every `customerId` maps to a valid `CUSTOMERS[].id`
- `severity` is one of Low, Medium, High, Critical
- `status` is one of New, Investigating, Resolved
- At least 3 alerts have `status === 'New'`

---

## Task 4: Create RISK_TRENDS mock data

**Domain:** `data-layer`
**Files:** `data/mock-data.js`
**Priority:** High

**Description:**
Define a `RISK_TRENDS` global array with 6 months of monthly aggregated data. Each entry: `month` (string label), `low`, `medium`, `high`, `critical` (counts per tier). Used by the Alert Trends chart on the dashboard.

**Acceptance Criteria:**
- `RISK_TRENDS` has exactly 6 entries (one per month)
- Each entry contains `month`, `low`, `medium`, `high`, `critical` as numbers
- Values are plausible (trending upward for high/critical to match the fraud-rising scenario)

**TDD — Tests before done:**
- `RISK_TRENDS` has 6 entries
- All numeric fields are non-negative integers
- Every entry has all five required fields

---

## Task 5: Implement KPI rendering with live data

**Domain:** `frontend`
**Files:** `js/app.js`, `data/mock-data.js`
**Priority:** High

**Description:**
Wire the `renderKPIs()` function to compute values from the `CUSTOMERS`, `TRANSACTIONS`, and `ALERTS` arrays. KPI cards: Total Customers, High/Critical Risk count, Open Alerts count, Flagged Transactions count. Also update the sidebar alert badge.

**Acceptance Criteria:**
- All four KPI cards display correct computed values on page load
- Alert badge shows the open alert count
- Values update if underlying data changes (re-calling `renderKPIs()`)

**TDD — Tests before done:**
- `renderKPIs()` sets `kpiTotalCustomers` to `CUSTOMERS.length`
- High/Critical count equals customers with `riskScore > 60`
- Open alerts count equals alerts where `status !== 'Resolved'`
- Flagged transactions count equals transactions with non-empty `flags`

---

## Task 6: Implement dashboard chart rendering

**Domain:** `frontend`
**Files:** `js/app.js`
**Priority:** High

**Description:**
Wire the four Chart.js visualizations on the dashboard view: Risk Distribution (doughnut), Alert Trends (bar, 6-month), Transaction Risk Breakdown (bar by category), and Risk by Country (horizontal bar). All charts must pull data from the global mock arrays.

**Acceptance Criteria:**
- All four charts render without errors on page load
- Risk Distribution doughnut shows correct counts per tier
- Alert Trends bar chart uses `RISK_TRENDS` data
- Charts are responsive and use the dark-theme color palette

**TDD — Tests before done:**
- Chart data arrays have correct length and values matching mock data
- Risk distribution counts match `CUSTOMERS` grouped by tier
- Alert trends data matches `RISK_TRENDS` array
- No Chart.js console errors on render

---

## Task 7: Implement customer table with filtering and sorting

**Domain:** `frontend`
**Files:** `js/app.js`, `index.html`
**Priority:** High

**Description:**
Render the customers table from the `CUSTOMERS` array. Support filtering by risk tier, customer type, and KYC status. Support column sorting (ascending/descending). Display risk score with color-coded badges. All text must be escaped via `escapeHtml()` before DOM insertion.

**Acceptance Criteria:**
- Table shows all customers on load with all columns populated
- Selecting a risk filter shows only matching customers
- Clicking a column header toggles sort direction
- Risk badges use the correct tier color

**TDD — Tests before done:**
- Unfiltered table row count equals `CUSTOMERS.length`
- Filtering by "High" risk shows only customers with `riskScore` 61–85
- Sorting by risk score ascending puts lowest first
- All customer names are HTML-escaped in output

---

## Task 8: Implement transaction table with filtering and search

**Domain:** `frontend`
**Files:** `js/app.js`, `index.html`
**Priority:** High

**Description:**
Render the transactions table from `TRANSACTIONS`. Support filtering by risk level, transaction direction, and flagged-only toggle. Support global search by merchant name or customer name. Format amounts with `Intl.NumberFormat` and dates with `toLocaleDateString`.

**Acceptance Criteria:**
- Table displays all transactions on load
- Filtering by "Flagged Only" shows only transactions with non-empty `flags`
- Search by merchant name returns matching rows
- Currency amounts are properly formatted

**TDD — Tests before done:**
- Unfiltered row count equals `TRANSACTIONS.length`
- "Flagged Only" filter count matches `TRANSACTIONS.filter(t => t.flags.length > 0).length`
- Search for a known merchant name returns ≥1 result
- Amount column values match `Intl.NumberFormat` output

---

## Task 9: Implement alerts table with resolve action

**Domain:** `frontend`
**Files:** `js/app.js`, `index.html`
**Priority:** Medium

**Description:**
Render the alerts table from `ALERTS`. Support filtering by severity and status. Implement a "Resolve" button that changes an alert's status to "Resolved" and re-renders the table and badge count. Use `escapeHtml()` for all text.

**Acceptance Criteria:**
- Table shows all alerts on load
- Clicking "Resolve" on a New/Investigating alert changes its status to Resolved
- Alert badge in sidebar updates after resolving
- Filtering by severity and status works correctly

**TDD — Tests before done:**
- Unfiltered row count equals `ALERTS.length`
- After resolving an alert, its status is `'Resolved'`
- Badge count decreases by 1 after resolving a non-resolved alert
- Filtering by "Critical" severity shows correct subset

---

## Task 10: Implement customer detail modal

**Domain:** `frontend`
**Files:** `js/app.js`, `index.html`
**Priority:** Medium

**Description:**
Clicking a customer row opens a detail modal showing: customer metadata, risk score gauge (canvas), recent transactions for that customer, and active alerts. The risk gauge should be drawn on a `<canvas>` element with the correct tier color.

**Acceptance Criteria:**
- Clicking a customer row opens the modal with correct data
- Risk gauge renders with the appropriate tier color
- Recent transactions list shows only that customer's transactions
- Modal closes on backdrop click or close button

**TDD — Tests before done:**
- Modal becomes visible after clicking a customer row
- Customer name and ID in modal match the clicked row
- Transaction list in modal contains only transactions with matching `customerId`
- Risk gauge color matches `getRiskColor()` for that customer's score

---

## Task 11: Implement global search across all views

**Domain:** `frontend`
**Files:** `js/app.js`
**Priority:** Medium

**Description:**
The top-bar search input should filter the active view's table. On the dashboard, it should switch to the most relevant view. Search should be case-insensitive and match against customer name, account ID, or merchant name depending on the active view.

**Acceptance Criteria:**
- Typing in search filters the currently visible table in real time
- Search is case-insensitive
- Clearing search restores the full table
- No results shows an empty-state message

**TDD — Tests before done:**
- Searching a known customer name in customers view returns ≥1 row
- Search is case-insensitive (uppercase input matches lowercase data)
- Empty search string returns all rows
- Non-matching search returns 0 rows with empty state visible

---

## Task 12: Implement 24-hour transaction timeline chart

**Domain:** `frontend`
**Files:** `js/app.js`, `index.html`, `data/mock-data.js`
**Priority:** Medium

**Description:**
Add a 24-hour hourly breakdown chart (bar + line overlay) to the dashboard or transaction detail view. Group transactions by hour, show transaction count as bars and average risk score as a line. Highlight hours with elevated risk (average score > 60).

**Acceptance Criteria:**
- Chart renders 24 bars (one per hour)
- Bar height represents transaction count for that hour
- Line overlay shows average risk score
- Hours with average risk > 60 are visually highlighted

**TDD — Tests before done:**
- Hourly aggregation produces exactly 24 buckets
- Each bucket count matches `TRANSACTIONS` filtered to that hour
- Average risk per bucket is correctly computed
- Highlight threshold correctly identifies buckets with avg > 60

---

## Task 13: Add risk score calculation from fraud signals

**Domain:** `api-layer`
**Files:** `js/app.js`, `data/mock-data.js`
**Priority:** Low

**Description:**
Implement `calculateRiskTier(signals)` that takes an array of fraud indicator enums and returns `{ tier, score }`. Weight each signal: VELOCITY_ANOMALY (25), GEO_ANOMALY (20), UNUSUAL_MERCHANT (15), HIGH_VALUE_SPIKE (20). Cap total at 100. Map to tier using existing thresholds.

**Acceptance Criteria:**
- Function returns correct tier and score for any combination of signals
- Empty signals array returns `{ tier: 'Low', score: 0 }`
- All four signals together return `{ tier: 'High', score: 80 }`
- Score never exceeds 100

**TDD — Tests before done:**
- Empty array → score 0, tier Low
- Single signal → correct weight and tier
- All signals → score 80, tier High
- Duplicate signals are handled (counted once or accumulated — define and test)

---

## Task 14: Responsive layout and mobile navigation

**Domain:** `frontend`
**Files:** `css/styles.css`, `js/app.js`, `index.html`
**Priority:** Low

**Description:**
Ensure sidebar collapses to a hamburger menu on screens ≤768px. Tables should horizontally scroll on small screens. KPI cards should stack vertically. Modal should be full-width on mobile.

**Acceptance Criteria:**
- Sidebar is hidden by default on ≤768px and toggles via hamburger
- Tables are scrollable, not clipped
- KPI grid stacks to single column
- Modal is usable on 375px-wide viewport

**TDD — Tests before done:**
- At 768px viewport, sidebar has `display: none` or equivalent
- Menu toggle button is visible at 768px
- KPI grid computed style shows single column at 375px
- Table wrapper has `overflow-x: auto`

---

## Summary

| # | Task | Domain | Priority | Blocker? |
|---|------|--------|----------|----------|
| 1 | CUSTOMERS mock data | `data-layer` | Critical | Yes |
| 2 | TRANSACTIONS mock data | `data-layer` | Critical | Yes |
| 3 | ALERTS mock data | `data-layer` | Critical | Yes |
| 4 | RISK_TRENDS mock data | `data-layer` | High | — |
| 5 | KPI rendering | `frontend` | High | Tasks 1–3 |
| 6 | Dashboard charts | `frontend` | High | Tasks 1–4 |
| 7 | Customer table + filters | `frontend` | High | Task 1 |
| 8 | Transaction table + search | `frontend` | High | Task 2 |
| 9 | Alerts table + resolve | `frontend` | Medium | Task 3 |
| 10 | Customer detail modal | `frontend` | Medium | Tasks 1–3 |
| 11 | Global search | `frontend` | Medium | Tasks 7–9 |
| 12 | 24-hour timeline chart | `frontend` | Medium | Task 2 |
| 13 | Risk calculation function | `api-layer` | Low | — |
| 14 | Responsive layout | `frontend` | Low | — |
