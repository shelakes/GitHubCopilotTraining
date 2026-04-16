---
name: Tests Domain
description: Conventions for unit tests, integration tests, and test structure
type: instructions
applyTo: "tests/**, **/*.test.js, **/*.spec.js"
---

# Tests Domain

**Glob pattern**: `tests/**`, `**/*.test.js`, `**/*.spec.js`

**Key concerns**: Test independence, coverage of edge cases, clarity of test names, repeatability, and isolation from external dependencies.

> **Note**: The "no Node.js" constraint in the base instructions applies to the production app deliverable. Tests run in a development-only Node.js context using Jest. Jest and its dependencies are dev-only and never shipped to production.

---

## What to Always Do

### 1. Arrange-Act-Assert (AAA) Pattern
- Structure every test into three clear phases:
  ```javascript
  test('getRiskLabel returns Critical for scores >= 86', () => {
    // Arrange: set up test data
    const score = 86;

    // Act: call the function
    const label = getRiskLabel(score);

    // Assert: verify the result
    expect(label).toBe('Critical');
  });
  ```
- This pattern makes tests readable and maintainable.

### 2. Descriptive Test Names
- Test names should describe the behavior, not the implementation:
  - ✓ `test('filterCustomersByRisk returns only High and Critical customers')`
  - ❌ `test('filterCustomersByRisk works')`
- Use the format: `{function} {does what} {when condition}` or `{function} returns {expected} for {input}`.

### 3. Edge Cases & Boundaries
- Test boundary values for risk scores (0, 30, 31, 60, 61, 85, 86, 100):
  ```javascript
  test('getRiskClass returns low for score 30', () => {
    expect(getRiskClass(30)).toBe('low');
  });
  test('getRiskClass returns medium for score 31', () => {
    expect(getRiskClass(31)).toBe('medium');
  });
  ```
- Test empty/null/undefined inputs:
  ```javascript
  test('filterCustomers returns empty array when input is empty', () => {
    expect(filterCustomers([], { risk: 'high' })).toEqual([]);
  });
  ```
- Test data mutation (confirm no side effects):
  ```javascript
  test('filterCustomers does not mutate input array', () => {
    const original = [...CUSTOMERS];
    filterCustomers(CUSTOMERS, { risk: 'high' });
    expect(CUSTOMERS).toEqual(original);
  });
  ```

### 4. One Assertion Per Behavior
- Prefer focused tests over broad ones:
  ```javascript
  // ✓ GOOD - one assertion per test
  test('getRiskScore includes velocity signal weight', () => {
    const score = getRiskScore(customer, signals);
    expect(score).toBeGreaterThan(50);
  });

  test('getRiskScore includes geo-anomaly signal weight', () => {
    const score = getRiskScore(customer, signals);
    expect(score).toBeGreaterThan(45);
  });

  // ❌ AVOID - multiple unrelated assertions
  test('getRiskScore is correct', () => {
    const score = getRiskScore(customer, signals);
    expect(score).toBeGreaterThan(50);
    expect(score).toBeLessThan(100);
    expect(customer.name).toBe('John');
  });
  ```

### 5. Mock External Dependencies
- Mock Chart.js, DOM, and global data arrays to isolate logic:
  ```javascript
  jest.mock('chart.js');
  
  test('renderCharts initializes doughnut chart', () => {
    renderCharts();
    expect(Chart).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
      type: 'doughnut'
    }));
  });
  ```
- Mock `CUSTOMERS`, `TRANSACTIONS`, `ALERTS` in tests to control input:
  ```javascript
  beforeEach(() => {
    global.CUSTOMERS = [
      { id: 'C1', name: 'Alice', riskScore: 25 },
      { id: 'C2', name: 'Bob', riskScore: 75 }
    ];
  });
  ```

### 6. Test Isolation
- Each test must be independent; no shared mutable state between tests:
  ```javascript
  // ✓ GOOD - reset state before each test
  beforeEach(() => {
    global.CUSTOMERS = [...mockCustomersData];
    global.alertStatus = 'Pending'; // reset
  });

  // ❌ BAD - test depends on order or shared state
  // Don't assume previous tests ran or didn't modify globals
  ```
- Use `beforeEach` to set up fresh fixtures; use `afterEach` to clean up.

### 7. Readable Assertions
- Use matchers that clearly state expectations:
  ```javascript
  expect(array).toHaveLength(5);
  expect(score).toBeInRange(0, 100);
  expect(func).toThrow('Invalid customer ID');
  expect(alerts).toEqual(expectedAlerts);
  ```

### 8. Test File Organization
- One test file per module:
  ```
  js/app.js              → tests/app.test.js
  ```
- Organize tests by function/feature:
  ```javascript
  describe('getRiskLabel', () => {
    test('returns Low for scores 0-30', () => { ... });
    test('returns Medium for scores 31-60', () => { ... });
    test('returns High for scores 61-85', () => { ... });
    test('returns Critical for scores 86+', () => { ... });
  });

  describe('filterCustomers', () => {
    test('filters by risk tier', () => { ... });
    test('filters by customer type', () => { ... });
    test('returns empty array for no matches', () => { ... });
  });
  ```

### 9. Data Integrity Tests
- Verify mock data is well-formed and consistent:
  ```javascript
  test('all customers have required fields', () => {
    CUSTOMERS.forEach(c => {
      expect(c).toHaveProperty('id');
      expect(c).toHaveProperty('name');
      expect(c).toHaveProperty('riskScore');
      expect(c.riskScore).toBeGreaterThanOrEqual(0);
      expect(c.riskScore).toBeLessThanOrEqual(100);
    });
  });

  test('all transactions reference valid customers', () => {
    const customerIds = new Set(CUSTOMERS.map(c => c.id));
    TRANSACTIONS.forEach(t => {
      expect(customerIds.has(t.customerId)).toBe(true);
    });
  });
  ```

---

## What to Never Do

### 1. Anti-Pattern: Testing Implementation Details
- ❌ Do NOT test private/internal functions; test public API:
  ```javascript
  // ❌ BAD - tests internal helper
  test('_calculateWeight returns 0.3 for velocity signal', () => { ... });

  // ✓ GOOD - test final result
  test('getRiskScore weighs velocity signal at 30%', () => { ... });
  ```
- **Why**: Internal implementation changes break tests even if behavior doesn't.
- **Fix**: Test the public function's behavior and output.

### 2. Anti-Pattern: Shared Mutable Test State
- ❌ Do NOT store test fixtures in global variables across tests:
  ```javascript
  // ❌ BAD - shared state
  const testCustomer = { id: 'C1', riskScore: 50 };

  test('increments risk score', () => {
    testCustomer.riskScore++;
    expect(testCustomer.riskScore).toBe(51);
  });

  test('checks risk score', () => {
    // testCustomer is now 51, not 50! ❌
    expect(testCustomer.riskScore).toBe(50);
  });

  // ✓ GOOD - reset in beforeEach
  beforeEach(() => {
    testCustomer = { id: 'C1', riskScore: 50 };
  });
  ```

### 3. Anti-Pattern: Testing Too Many Things in One Test
- ❌ Do NOT write integration tests masquerading as unit tests:
  ```javascript
  // ❌ TOO BROAD
  test('dashboard initialization works', () => {
    renderKPIs();
    renderCharts();
    renderCustomersTable();
    renderTransactionsTable();
    renderAlertsTable();
    expect(document.getElementById('kpiTotalCustomers')).toHaveTextContent('42');
    // ...many more assertions...
  });

  // ✓ FOCUSED - one test per function
  test('renderKPIs sets total customer count', () => {
    renderKPIs();
    expect(document.getElementById('kpiTotalCustomers')).toHaveTextContent('42');
  });
  ```

### 4. Anti-Pattern: Ignoring Error Cases
- ❌ Do NOT test only the happy path:
  ```javascript
  // ✓ TEST ERROR CASES TOO
  test('getRiskLabel throws error for negative score', () => {
    expect(() => getRiskLabel(-5)).toThrow();
  });

  test('filterCustomers handles null filter object', () => {
    expect(filterCustomers(CUSTOMERS, null)).toEqual(CUSTOMERS);
  });
  ```

### 5. Anti-Pattern: Brittle Date/Time Tests
- ❌ Do NOT hardcode dates in tests; they break after time passes:
  ```javascript
  // ❌ BRITTLE
  test('transactions from today appear first', () => {
    const today = new Date('2026-04-16');
    expect(sortByDate(txns)[0].date).toBe(today);
  });

  // ✓ ROBUST - use relative dates
  test('transactions sort by date descending', () => {
    const sorted = sortByDate(txns);
    for (let i = 0; i < sorted.length - 1; i++) {
      expect(new Date(sorted[i].date).getTime())
        .toBeGreaterThanOrEqual(new Date(sorted[i + 1].date).getTime());
    }
  });
  ```

### 6. Anti-Pattern: No Test Names (Anonymous Tests)
- ❌ Do NOT use vague test names:
  ```javascript
  // ❌ NOT DESCRIPTIVE
  test('test 1', () => { ... });
  test('works', () => { ... });

  // ✓ CLEAR & SPECIFIC
  test('calculateRiskScore aggregates fraud signals into 0-100 range', () => { ... });
  ```

### 7. Anti-Pattern: Testing Without Assertions
- ❌ Do NOT write tests that only set up data but don't assert:
  ```javascript
  // ❌ INCOMPLETE
  test('loading customer data', () => {
    const customer = loadCustomer('C1');
    // forgot to assert anything!
  });

  // ✓ COMPLETE
  test('loadCustomer returns customer with matching ID', () => {
    const customer = loadCustomer('C1');
    expect(customer.id).toBe('C1');
  });
  ```

### 8. Anti-Pattern: Ignoring Async/Promise Errors
- ❌ Do NOT forget to `return` or `await` promises:
  ```javascript
  // ❌ BAD - test ends before promise resolves
  test('loadTransactions fetches data', () => {
    loadTransactions().then(data => {
      expect(data).toHaveLength(100);
    });
    // test finishes immediately!
  });

  // ✓ GOOD - return promise or await
  test('loadTransactions fetches data', async () => {
    const data = await loadTransactions();
    expect(data).toHaveLength(100);
  });
  ```

---

## Test Coverage Goals

### Coverage by Category

| Category | Coverage Goal | Examples |
|---|---|---|
| **Business Logic** | 80%+ | Risk scoring, filtering, calculations |
| **Data Validation** | 100% | Input sanitization, type checks, boundaries |
| **Presentation** | 60%+ | Table rendering, modal display, filter UI |
| **Error Handling** | 100% | Edge cases, null/undefined, invalid data |

### Critical Paths (Must Test)
- ✓ Risk score calculation (all tiers: 0, 30, 31, 60, 61, 85, 86, 100)
- ✓ Customer/transaction/alert filtering (each filter type)
- ✓ Data integrity (all mock data well-formed)
- ✓ XSS prevention (escaping in rendering)
- ✓ Modal/table rendering and user interactions

---

## Jest Configuration & Setup

### Sample `jest.config.js`
```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/tests/setup.js'],
  collectCoverageFrom: ['js/**/*.js', '!js/**/*.test.js'],
  coverageThreshold: {
    global: { branches: 60, functions: 60, lines: 60, statements: 60 }
  }
};
```

### Sample `tests/setup.js`
```javascript
// Load mock data before tests
global.CUSTOMERS = require('../data/mock-data').CUSTOMERS;
global.TRANSACTIONS = require('../data/mock-data').TRANSACTIONS;
global.ALERTS = require('../data/mock-data').ALERTS;
```

---

## Test Quality Checklist

Before marking a test task complete:
- [ ] All tests pass (`npm test` exits 0)
- [ ] No console errors or warnings (except intentional logs)
- [ ] Coverage >= 60% (goal 80% for business logic)
- [ ] Tests are independent (no shared mutable state)
- [ ] Edge cases covered (boundaries, empty, null, invalid)
- [ ] Test names are descriptive and searchable
- [ ] Each test has one main assertion (AAA pattern)
- [ ] Mock data is realistic and consistent with production schema
- [ ] Tests run in <5 seconds (or document why slower)
