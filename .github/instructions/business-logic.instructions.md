---
name: Business Logic Domain
description: Rules and patterns for risk scoring, data filtering, and fraud signal detection
type: instructions
applyTo: "js/app.js, data/mock-data.js, data/transactions.json"
---

# Business Logic Domain

**Glob pattern**: `js/app.js`, `data/**`

**Key concerns**: Accuracy of risk calculations, consistency across fraud signal detection, input validation, security against injection attacks when processing data.

---

## What to Always Do

### 1. Risk Scoring & Classification
- Use the tiered risk model consistently:
  - **Low**: 0–30
  - **Medium**: 31–60
  - **High**: 61–85
  - **Critical**: 86–100
- All risk score calculations must return values in the 0–100 range.
- Risk scores for customers and transactions are immutable once loaded from mock data; do not modify in-place unless explicitly recalculating due to a business rule change.
- Apply boundary value test logic: verify behavior at thresholds (30/31, 60/61, 85/86, 100).

### 2. Fraud Signal Detection
- Fraud signals (velocity, geo-anomaly, unusual merchant, high-value spike) are independent checks; do not introduce hidden dependencies between them.
- Each signal should have a clear weight/impact value used in the final risk aggregation.
- When aggregating signals into a score, document the weighting formula in a comment (e.g., `// Score = (velocity * 0.3) + (geo * 0.3) + (merchant * 0.2) + (amount * 0.2)`).

### 3. Data Filtering
- Filtering functions (by risk, type, country, status) must return a new array; never mutate the original data.
- Support both exact match (`'all'`) and partial/fuzzy match filters; document which applies.
- Handle empty results gracefully: return an empty array, not null or undefined.

### 4. Input Validation
- Validate all external inputs (search strings, filter values, date ranges) before use.
- Sanitize search strings to prevent injection attacks (already done via `escapeHtml()`, but validate length and character set).
- For numeric inputs (risk scores, amounts), verify they are in expected ranges before processing.

### 5. Data Consistency
- The `CUSTOMERS`, `TRANSACTIONS`, and `ALERTS` arrays (or equivalent JSON structures in `data/transactions.json`) are the single source of truth.
- If data is modified (e.g., alert status changes), ensure all dependent views re-render and KPIs recalculate.
- Document any assumptions about data structure (e.g., "all transactions have a customerId that exists in CUSTOMERS").

---

## What to Never Do

### 1. Anti-Pattern: Mixed Concerns
- ❌ Do NOT implement business logic inside DOM rendering functions.
- ❌ Do NOT call `document.getElementById()` or `querySelector()` inside risk scoring functions.
- **Why**: Mixing concerns makes logic hard to test and reuse. Risk scoring should work in isolation.
- **Fix**: Extract `getRiskScore(customer, signals)` as a pure function; call it from render functions.

### 2. Anti-Pattern: Mutable Shared State
- ❌ Do NOT modify global arrays (`CUSTOMERS`, `TRANSACTIONS`, `ALERTS`) without intent.
- ❌ Do NOT store derived state (e.g., filtered customers) in global variables; recalculate on demand.
- **Why**: Shared mutable state causes bugs when multiple views/filters read it simultaneously.
- **Fix**: Pass filter state through function parameters; rebuild filtered lists on each render.

### 3. Anti-Pattern: Hardcoded Magic Numbers
- ❌ Do NOT use hardcoded thresholds like `60`, `85`, `100` scattered throughout the code.
- **Why**: Changes to risk tiers require editing multiple locations, introducing bugs.
- **Fix**: Define constants at the top of the file:
  ```javascript
  const RISK_THRESHOLDS = {
    LOW: 30,
    MEDIUM: 60,
    HIGH: 85,
    CRITICAL: 100
  };
  ```

### 4. Anti-Pattern: Silent Failures
- ❌ Do NOT ignore null/undefined customers, transactions, or alerts in filtering logic.
- ❌ Do NOT swallow exceptions in data loading or calculation functions.
- **Why**: Silent failures mask bugs; data corruption goes unnoticed.
- **Fix**: Validate inputs explicitly; throw descriptive errors or log warnings.

### 5. Anti-Pattern: Tight Coupling to Mock Data
- ❌ Do NOT assume a specific number of records or hardcode field names in calculation logic.
- ❌ Do NOT assume timestamps are always ISO strings; validate format.
- **Why**: Breaks when transitioning to a real backend or schema changes.
- **Fix**: Use defensive checks; e.g., `if (transaction.date && typeof transaction.date === 'string')`.

---

## Domain-Specific Security Concerns

### 1. Injection Attacks (XSS)
- **Risk**: User-provided search terms or data fields rendered as HTML without escaping.
- **Mitigation**: 
  - All user input (search boxes, filter dropdowns) must pass through `escapeHtml()` before rendering.
  - Use `textContent` instead of `innerHTML` when possible.
  - Document any intentional HTML rendering and ensure it's sanitized.

### 2. Data Tampering
- **Risk**: Frontend risk scores modified by user via dev tools, affecting business decisions.
- **Mitigation**: 
  - Treat all frontend scores as *advisory*; real compliance decisions must be server-side.
  - Log any alert status changes (Resolved/Pending) with timestamp and user for audit.
  - In a production system, validate server-side on any write operation.

### 3. Sensitive Data Exposure
- **Risk**: Customer info (PEP, sanctioned status, balances) logged to console or local storage.
- **Mitigation**:
  - Avoid logging personally identifiable information (PII) in production.
  - If debugging, sanitize logs before sharing.
  - Do not persist customer data to localStorage without encryption (future concern).

---

## Performance Concerns

### 1. Filter/Search Performance
- For large datasets (>10k records), filtering on every keystroke will cause lag.
- **Mitigation**: Debounce search input; batch filter updates into a single render pass.

### 2. Risk Calculation Complexity
- Risk scoring should complete in <100ms per customer for responsive UX.
- **Mitigation**: Memoize risk scores within a single render cycle; recalculate when filters or data change. Do not persist derived scores in global state between renders.

### 3. Data Load Time
- Mock data is loaded into memory at startup; ensure it's <5MB to avoid browser memory pressure.
- **Mitigation**: Lazy-load large datasets if data grows beyond 10k records.
