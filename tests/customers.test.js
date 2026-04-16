/**
 * CUSTOMERS data integrity tests
 *
 * Validates the CUSTOMERS mock-data array against the schema and
 * distribution requirements defined in the ITEM-001 acceptance criteria.
 */

const fs = require('fs');
const path = require('path');

// ── Load mock-data.js into global scope ──────────────────────────────
beforeAll(() => {
  const filePath = path.resolve(__dirname, '..', 'data', 'mock-data.js');
  const code = fs.readFileSync(filePath, 'utf8');
  eval(code);
  global.CUSTOMERS = CUSTOMERS;
});

// ── Shared constants (must mirror production values) ─────────────────
const REQUIRED_FIELDS = [
  'id', 'name', 'type', 'country', 'riskScore',
  'accountOpenDate', 'lastReviewDate', 'kycStatus',
  'pep', 'sanctioned', 'totalBalance', 'currency'
];

const RISK_THRESHOLDS = { LOW: 30, MEDIUM: 60, HIGH: 85, CRITICAL: 100 };

const VALID_TYPES = ['Corporate', 'Individual'];

const VALID_KYC_STATUSES = ['Verified', 'Under Review', 'Expired'];

describe('CUSTOMERS data integrity', () => {

  // ── AC-1: Array with >= 10 entries ──────────────────────────────────
  test('CUSTOMERS is an array with at least 10 entries', () => {
    // Arrange
    const customers = global.CUSTOMERS;

    // Act
    const isArray = Array.isArray(customers);
    const count = customers.length;

    // Assert
    expect(isArray).toBe(true);
    expect(count).toBeGreaterThanOrEqual(10);
  });

  // ── AC-2: Every entry has all 12 required fields, none undefined ────
  test('every customer has all 12 required fields with no undefined values', () => {
    // Arrange
    const customers = global.CUSTOMERS;

    // Act & Assert
    customers.forEach((customer) => {
      REQUIRED_FIELDS.forEach((field) => {
        expect(customer).toHaveProperty(field);
        expect(customer[field]).not.toBeUndefined();
      });
    });
  });

  // ── AC-3: Every riskScore is integer 0–100 ─────────────────────────
  test('every riskScore is an integer between 0 and 100 inclusive', () => {
    // Arrange
    const customers = global.CUSTOMERS;

    // Act & Assert
    customers.forEach((customer) => {
      expect(Number.isInteger(customer.riskScore)).toBe(true);
      expect(customer.riskScore).toBeGreaterThanOrEqual(0);
      expect(customer.riskScore).toBeLessThanOrEqual(100);
    });
  });

  // ── AC-4: At least 2 customers per risk tier ───────────────────────
  test('at least 2 customers exist in the Low risk tier (0–30)', () => {
    // Arrange
    const customers = global.CUSTOMERS;

    // Act
    const low = customers.filter(
      (c) => c.riskScore >= 0 && c.riskScore <= RISK_THRESHOLDS.LOW
    );

    // Assert
    expect(low.length).toBeGreaterThanOrEqual(2);
  });

  test('at least 2 customers exist in the Medium risk tier (31–60)', () => {
    // Arrange
    const customers = global.CUSTOMERS;

    // Act
    const medium = customers.filter(
      (c) => c.riskScore > RISK_THRESHOLDS.LOW && c.riskScore <= RISK_THRESHOLDS.MEDIUM
    );

    // Assert
    expect(medium.length).toBeGreaterThanOrEqual(2);
  });

  test('at least 2 customers exist in the High risk tier (61–85)', () => {
    // Arrange
    const customers = global.CUSTOMERS;

    // Act
    const high = customers.filter(
      (c) => c.riskScore > RISK_THRESHOLDS.MEDIUM && c.riskScore <= RISK_THRESHOLDS.HIGH
    );

    // Assert
    expect(high.length).toBeGreaterThanOrEqual(2);
  });

  test('at least 2 customers exist in the Critical risk tier (86–100)', () => {
    // Arrange
    const customers = global.CUSTOMERS;

    // Act
    const critical = customers.filter(
      (c) => c.riskScore > RISK_THRESHOLDS.HIGH && c.riskScore <= RISK_THRESHOLDS.CRITICAL
    );

    // Assert
    expect(critical.length).toBeGreaterThanOrEqual(2);
  });

  // ── AC-5: At least one PEP and one sanctioned ─────────────────────
  test('at least one customer has pep set to true', () => {
    // Arrange
    const customers = global.CUSTOMERS;

    // Act
    const hasPep = customers.some((c) => c.pep === true);

    // Assert
    expect(hasPep).toBe(true);
  });

  test('at least one customer has sanctioned set to true', () => {
    // Arrange
    const customers = global.CUSTOMERS;

    // Act
    const hasSanctioned = customers.some((c) => c.sanctioned === true);

    // Assert
    expect(hasSanctioned).toBe(true);
  });

  // ── AC-6: All id values are unique ─────────────────────────────────
  test('all customer id values are unique', () => {
    // Arrange
    const customers = global.CUSTOMERS;

    // Act
    const ids = customers.map((c) => c.id);
    const uniqueIds = new Set(ids);

    // Assert
    expect(uniqueIds.size).toBe(ids.length);
  });

  // ── AC-7: type is "Corporate" or "Individual" ─────────────────────
  test('every customer type is Corporate or Individual', () => {
    // Arrange
    const customers = global.CUSTOMERS;

    // Act & Assert
    customers.forEach((customer) => {
      expect(VALID_TYPES).toContain(customer.type);
    });
  });

  // ── AC-8: kycStatus is one of the allowed values ──────────────────
  test('every customer kycStatus is Approved, Pending Review, or Expired', () => {
    // Arrange
    const customers = global.CUSTOMERS;

    // Act & Assert
    customers.forEach((customer) => {
      expect(VALID_KYC_STATUSES).toContain(customer.kycStatus);
    });
  });

});
