# Transaction Risk Alert Dashboard — Developer Todo

## Overview
This document breaks down the project into phased, completable tasks. Each task:
- Touches ≤5 files
- Has testable acceptance criteria
- Includes TDD requirements
- Is tagged by domain (data, logic, frontend, integration)

---

## Phase 1: Data Layer Foundation

### Task 1.1: Load & Parse Mock Data
**Domain**: Data Layer  
**Files Touched**: `data/mock-data.js`, `js/app.js` (or data module)

**Description**:
Create a function to load `data/transactions.json` and parse it into JavaScript objects.

**Acceptance Criteria**:
- ✅ Function `loadTransactions()` returns an array of transaction objects
- ✅ All transaction properties are correctly mapped (transactionId, accountId, amount, etc.)
- ✅ Handles missing/malformed JSON gracefully (returns empty array or error message)
- ✅ Can be called from browser console and logs transaction count

**TDD Requirements**:
```javascript
// Test: Verify loadTransactions() returns array
console.assert(Array.isArray(loadTransactions()), "loadTransactions should return array");

// Test: Verify transaction has required fields
const transactions = loadTransactions();
console.assert(transactions[0]?.transactionId, "Transaction missing transactionId");
console.assert(transactions[0]?.accountId, "Transaction missing accountId");
console.assert(transactions[0]?.amount, "Transaction missing amount");
console.assert(transactions[0]?.fraudIndicators, "Transaction missing fraudIndicators");

// Test: Verify data count
console.log(`Loaded ${transactions.length} transactions`);