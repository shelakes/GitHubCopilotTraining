BLUEPRINT.md
---
# Transaction Risk Alert Dashboard — Project Blueprint

## 1. Purpose & User Scenarios

### Primary User: Fraud Operations Analyst
- **Role**: Assess account risk and make rapid escalation/approval decisions
- **Scenario 1 - Account Review**: Analyst receives alert about suspicious activity, searches account by ID, views risk tier and top fraud signals
- **Scenario 2 - Customer Query**: Customer calls with account issue; analyst searches by customer name, reviews transaction timeline to explain anomalies
- **Scenario 3 - Risk Trend Analysis**: Analyst checks 24-hour transaction pattern to identify whether risk is escalating or normalizing

### Secondary User: Compliance Team
- **Role**: Audit and monitoring
- **Scenario**: Review flagged accounts, verify risk calculations align with fraud indicators

### What They Need to See
- Risk tier (GREEN/YELLOW/RED) at a glance with clear visual distinction
- Top 3–5 contributing fraud signals in plain language
- Recent transaction history (last 24 hours)
- Transaction amount and risk score trends over time
- Merchant categories and geographies involved in suspicious activity

---

## 2. Feature List

### A. Account Search & Discovery
- **Search by Account ID**: Exact match lookup
- **Search by Customer Name**: Fuzzy or partial match
- **No Results Handling**: Clear message, suggested next steps
- **Empty History Handling**: Graceful display when account has no transactions

### B. Fraud Signal Detection & Display
- **Velocity Anomaly**: Unusual transaction frequency spike
- **Geo-Anomaly**: Transactions from unexpected countries/regions
- **Unusual Merchant Category**: High-risk merchant types (gambling, crypto) for profile
- **High-Value Spike**: Transaction amount exceeds typical range
- **Signal Counts**: Display which signals are active for the account

### C. Risk Score Calculation & Visualization
- **Overall Risk Tier**: GREEN (0–40), YELLOW (41–70), RED (71–100)
- **Weighted Scoring**: Aggregate fraud signals into single risk score
- **Contributing Factors**: Ranked list of primary risk drivers
- **Last Assessment Time**: Timestamp of most recent calculation
- **Account Metadata**: Customer name, account ID, recent transaction count

### D. 24-Hour Transaction Timeline
- **Time-Series Data**: Transactions filtered to past 24 hours
- **Bar Chart/Sparkline**: Transaction count by hour
- **Risk Score Trend**: Line chart showing risk evolution over 24 hours
- **Amount Trend**: Stacked or line visualization of transaction amounts
- **Anomaly Highlighting**: Visual markers on time windows with elevated risk
- **Interactive Details**: Click/hover to see individual transaction details

### E. Transaction Details Panel
- **Transaction List**: Show individual transactions in 24-hour window
- **Key Fields**: Amount, merchant, category, country, timestamp, status
- **Risk Score Per Transaction**: Individual transaction risk indicators
- **Fraud Flags**: Which fraud indicators apply to each transaction

---

## 3. Data Model

### Core Entity: Transaction


## 4. API Surface

### Data Retrieval Layer (JavaScript interfaces)

#### `loadTransactions(): Promise<Transaction[]>`
- Loads and parses `data/transactions.json`
- Returns: Array of all transactions

#### `searchAccountByID(accountId: String): AccountRiskProfile`
- Filters transactions by account ID
- Calculates risk profile
- Returns: AccountRiskProfile or null

#### `searchAccountByName(customerName: String): AccountRiskProfile[]`
- Filters transactions by partial/fuzzy name match
- Returns: Array of matching profiles

#### `getTransactions24h(accountId: String): Transaction[]`
- Returns transactions for given account in past 24 hours
- Sorted by timestamp descending

#### `calculateRiskTier(signals: Array<Enum>): { tier: Enum, score: Integer }`
- Aggregates fraud signals into risk score and tier
- Returns: { tier: GREEN|YELLOW|RED, score: 0–100 }

#### `getHourlyTimeline(accountId: String): HourlyAggregation[]`
- Returns hourly aggregations for 24-hour period
- Sorted by hour ascending

#### `getTopSignals(accountId: String, limit: Integer = 5): Array<{ type: String, weight: Number, count: Integer }>`
- Returns weighted fraud signals for account
- Sorted by impact descending

---

## 5. Constraints

### Data Constraints
- **No External APIs**: All data is static mock JSON; no real-time feeds or backend calls
- **In-Memory Only**: Load transactions into memory; no persistence required
- **Static File Source**: Single source of truth is `data/transactions.json`
- **No Database**: Mock endpoint or local storage—no external database

### Functional Constraints
- **24-Hour Window**: Timeline analysis is fixed to 24-hour lookback (not configurable)
- **Mock Data Only**: No live fraud feeds; all data is pre-defined
- **Synchronous Calculations**: All risk calculations happen instantly in the browser
- **No Authentication**: No login or user management required

### Technical Constraints
- **Frontend Only**: No Node.js backend, no API server, no database server
- **Browser Environment**: Must work in modern browser (ES6+, no build step unless specified)
- **Static Assets**: All HTML, CSS, JS must be deliverable from simple HTTP server
- **No External Libraries**: Use vanilla JavaScript unless specified otherwise

### Non-Functional Requirements
- **Performance**: Account search and risk calculation must complete in <500ms
- **Responsiveness**: UI must remain interactive during data load and calculations
- **Graceful Degradation**: Missing or malformed data should not crash the app
- **Accessibility**: Follow basic a11y (semantic HTML, contrast, keyboard navigation)

---

## 6. Implementation Roadmap

1. **Data Layer** → Load and parse `data/transactions.json`
2. **Logic Layer** → Implement search, filtering, risk calculation functions
3. **Presentation Layer** → Build UI components (search, risk display, timeline charts)
4. **Integration** → Wire components together; test end-to-end flows
5. **Polish** → Error handling, edge cases, styling, performance