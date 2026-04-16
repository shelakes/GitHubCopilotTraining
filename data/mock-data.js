// Mock data for bank transaction risk dashboard

const RISK_LEVELS = {
  LOW: { label: 'Low', color: '#22c55e', threshold: 30 },
  MEDIUM: { label: 'Medium', color: '#f59e0b', threshold: 60 },
  HIGH: { label: 'High', color: '#ef4444', threshold: 85 },
  CRITICAL: { label: 'Critical', color: '#991b1b', threshold: 100 }
};

function getRiskLevel(score) {
  if (score <= RISK_LEVELS.LOW.threshold) return RISK_LEVELS.LOW;
  if (score <= RISK_LEVELS.MEDIUM.threshold) return RISK_LEVELS.MEDIUM;
  if (score <= RISK_LEVELS.HIGH.threshold) return RISK_LEVELS.HIGH;
  return RISK_LEVELS.CRITICAL;
}

const CUSTOMERS = [
  {
    id: 'CUST-001',
    name: 'Acme Corporation',
    type: 'Corporate',
    country: 'United States',
    riskScore: 23,
    accountOpenDate: '2019-03-15',
    lastReviewDate: '2025-11-20',
    kycStatus: 'Verified',
    pep: false,
    sanctioned: false,
    totalBalance: 2450000,
    currency: 'USD'
  },
  {
    id: 'CUST-002',
    name: 'Orion Trading Ltd',
    type: 'Corporate',
    country: 'United Kingdom',
    riskScore: 67,
    accountOpenDate: '2021-07-01',
    lastReviewDate: '2025-09-10',
    kycStatus: 'Verified',
    pep: false,
    sanctioned: false,
    totalBalance: 890000,
    currency: 'GBP'
  },
  {
    id: 'CUST-003',
    name: 'Elena Voronova',
    type: 'Individual',
    country: 'Russia',
    riskScore: 88,
    accountOpenDate: '2023-01-22',
    lastReviewDate: '2025-06-05',
    kycStatus: 'Under Review',
    pep: true,
    sanctioned: false,
    totalBalance: 3200000,
    currency: 'USD'
  },
  {
    id: 'CUST-004',
    name: 'Pacific Freight Inc',
    type: 'Corporate',
    country: 'Singapore',
    riskScore: 42,
    accountOpenDate: '2020-11-30',
    lastReviewDate: '2026-01-15',
    kycStatus: 'Verified',
    pep: false,
    sanctioned: false,
    totalBalance: 5670000,
    currency: 'SGD'
  },
  {
    id: 'CUST-005',
    name: 'Hassan Al-Rashid',
    type: 'Individual',
    country: 'UAE',
    riskScore: 55,
    accountOpenDate: '2022-04-18',
    lastReviewDate: '2025-12-01',
    kycStatus: 'Verified',
    pep: false,
    sanctioned: false,
    totalBalance: 1120000,
    currency: 'AED'
  },
  {
    id: 'CUST-006',
    name: 'Nova Pharmaceuticals',
    type: 'Corporate',
    country: 'Switzerland',
    riskScore: 15,
    accountOpenDate: '2018-08-10',
    lastReviewDate: '2026-02-28',
    kycStatus: 'Verified',
    pep: false,
    sanctioned: false,
    totalBalance: 12400000,
    currency: 'CHF'
  },
  {
    id: 'CUST-007',
    name: 'Golden Horizon Exports',
    type: 'Corporate',
    country: 'Nigeria',
    riskScore: 92,
    accountOpenDate: '2024-02-14',
    lastReviewDate: '2025-08-20',
    kycStatus: 'Expired',
    pep: false,
    sanctioned: true,
    totalBalance: 340000,
    currency: 'USD'
  },
  {
    id: 'CUST-008',
    name: 'Maria Gonzalez',
    type: 'Individual',
    country: 'Mexico',
    riskScore: 35,
    accountOpenDate: '2020-06-25',
    lastReviewDate: '2025-10-30',
    kycStatus: 'Verified',
    pep: false,
    sanctioned: false,
    totalBalance: 78000,
    currency: 'USD'
  },
  {
    id: 'CUST-009',
    name: 'Stellar Minerals AG',
    type: 'Corporate',
    country: 'Germany',
    riskScore: 48,
    accountOpenDate: '2019-12-01',
    lastReviewDate: '2026-03-10',
    kycStatus: 'Verified',
    pep: false,
    sanctioned: false,
    totalBalance: 7800000,
    currency: 'EUR'
  },
  {
    id: 'CUST-010',
    name: 'Chen Wei Holdings',
    type: 'Corporate',
    country: 'Hong Kong',
    riskScore: 74,
    accountOpenDate: '2022-09-05',
    lastReviewDate: '2025-07-15',
    kycStatus: 'Under Review',
    pep: true,
    sanctioned: false,
    totalBalance: 4560000,
    currency: 'HKD'
  },
  {
    id: 'CUST-011',
    name: 'Atlas Shipping Co',
    type: 'Corporate',
    country: 'Panama',
    riskScore: 81,
    accountOpenDate: '2023-05-20',
    lastReviewDate: '2025-04-12',
    kycStatus: 'Expired',
    pep: false,
    sanctioned: false,
    totalBalance: 1950000,
    currency: 'USD'
  },
  {
    id: 'CUST-012',
    name: 'Takahashi Yuki',
    type: 'Individual',
    country: 'Japan',
    riskScore: 12,
    accountOpenDate: '2017-01-10',
    lastReviewDate: '2026-01-05',
    kycStatus: 'Verified',
    pep: false,
    sanctioned: false,
    totalBalance: 250000,
    currency: 'JPY'
  }
];

const TRANSACTIONS = [
  { id: 'TXN-10001', customerId: 'CUST-001', date: '2026-04-15', amount: 125000, currency: 'USD', type: 'Wire Transfer', direction: 'Outgoing', counterparty: 'Global Supplies Inc', counterpartyCountry: 'Canada', riskScore: 15, flags: [] },
  { id: 'TXN-10002', customerId: 'CUST-001', date: '2026-04-14', amount: 50000, currency: 'USD', type: 'ACH', direction: 'Incoming', counterparty: 'Revenue Stream LLC', counterpartyCountry: 'United States', riskScore: 8, flags: [] },
  { id: 'TXN-10003', customerId: 'CUST-002', date: '2026-04-15', amount: 340000, currency: 'GBP', type: 'Wire Transfer', direction: 'Outgoing', counterparty: 'Unnamed Entity', counterpartyCountry: 'Cayman Islands', riskScore: 78, flags: ['High-risk jurisdiction', 'Large value'] },
  { id: 'TXN-10004', customerId: 'CUST-002', date: '2026-04-13', amount: 89000, currency: 'GBP', type: 'Wire Transfer', direction: 'Incoming', counterparty: 'Eurofinance SA', counterpartyCountry: 'Luxembourg', riskScore: 45, flags: ['Unusual pattern'] },
  { id: 'TXN-10005', customerId: 'CUST-003', date: '2026-04-15', amount: 500000, currency: 'USD', type: 'Wire Transfer', direction: 'Outgoing', counterparty: 'Offshore Holdings BVI', counterpartyCountry: 'British Virgin Islands', riskScore: 95, flags: ['PEP involved', 'High-risk jurisdiction', 'Large value', 'Structured pattern'] },
  { id: 'TXN-10006', customerId: 'CUST-003', date: '2026-04-14', amount: 490000, currency: 'USD', type: 'Wire Transfer', direction: 'Outgoing', counterparty: 'Bermuda Trust Co', counterpartyCountry: 'Bermuda', riskScore: 91, flags: ['PEP involved', 'High-risk jurisdiction', 'Structured pattern'] },
  { id: 'TXN-10007', customerId: 'CUST-003', date: '2026-04-12', amount: 510000, currency: 'USD', type: 'Wire Transfer', direction: 'Incoming', counterparty: 'Unknown Source', counterpartyCountry: 'Cyprus', riskScore: 88, flags: ['PEP involved', 'Unknown source', 'Large value'] },
  { id: 'TXN-10008', customerId: 'CUST-004', date: '2026-04-15', amount: 780000, currency: 'SGD', type: 'Trade Finance', direction: 'Outgoing', counterparty: 'Eastern Logistics Pte', counterpartyCountry: 'Malaysia', riskScore: 32, flags: [] },
  { id: 'TXN-10009', customerId: 'CUST-004', date: '2026-04-11', amount: 1200000, currency: 'SGD', type: 'Trade Finance', direction: 'Incoming', counterparty: 'Yokohama Trading', counterpartyCountry: 'Japan', riskScore: 20, flags: [] },
  { id: 'TXN-10010', customerId: 'CUST-005', date: '2026-04-14', amount: 200000, currency: 'AED', type: 'Wire Transfer', direction: 'Outgoing', counterparty: 'Dubai Real Estate Corp', counterpartyCountry: 'UAE', riskScore: 40, flags: ['Real estate'] },
  { id: 'TXN-10011', customerId: 'CUST-005', date: '2026-04-10', amount: 95000, currency: 'AED', type: 'Wire Transfer', direction: 'Incoming', counterparty: 'Private Transfer', counterpartyCountry: 'Saudi Arabia', riskScore: 55, flags: ['Vague description'] },
  { id: 'TXN-10012', customerId: 'CUST-006', date: '2026-04-15', amount: 2500000, currency: 'CHF', type: 'Wire Transfer', direction: 'Outgoing', counterparty: 'Roche Supply Chain', counterpartyCountry: 'Switzerland', riskScore: 10, flags: [] },
  { id: 'TXN-10013', customerId: 'CUST-006', date: '2026-04-12', amount: 3100000, currency: 'CHF', type: 'Wire Transfer', direction: 'Incoming', counterparty: 'EU Health Fund', counterpartyCountry: 'Belgium', riskScore: 5, flags: [] },
  { id: 'TXN-10014', customerId: 'CUST-007', date: '2026-04-15', amount: 150000, currency: 'USD', type: 'Wire Transfer', direction: 'Outgoing', counterparty: 'Shell Company Alpha', counterpartyCountry: 'Seychelles', riskScore: 97, flags: ['Sanctioned entity', 'Shell company', 'High-risk jurisdiction'] },
  { id: 'TXN-10015', customerId: 'CUST-007', date: '2026-04-13', amount: 75000, currency: 'USD', type: 'Wire Transfer', direction: 'Incoming', counterparty: 'Anonymous Donor', counterpartyCountry: 'Libya', riskScore: 94, flags: ['Sanctioned entity', 'High-risk jurisdiction', 'Unknown source'] },
  { id: 'TXN-10016', customerId: 'CUST-007', date: '2026-04-10', amount: 48000, currency: 'USD', type: 'Wire Transfer', direction: 'Outgoing', counterparty: 'Rapid Cash Services', counterpartyCountry: 'Somalia', riskScore: 90, flags: ['Sanctioned entity', 'High-risk jurisdiction', 'Cash-intensive'] },
  { id: 'TXN-10017', customerId: 'CUST-008', date: '2026-04-14', amount: 15000, currency: 'USD', type: 'ACH', direction: 'Outgoing', counterparty: 'Rent Payment Co', counterpartyCountry: 'United States', riskScore: 5, flags: [] },
  { id: 'TXN-10018', customerId: 'CUST-008', date: '2026-04-01', amount: 62000, currency: 'USD', type: 'ACH', direction: 'Incoming', counterparty: 'Employer Payroll', counterpartyCountry: 'United States', riskScore: 3, flags: [] },
  { id: 'TXN-10019', customerId: 'CUST-009', date: '2026-04-15', amount: 1800000, currency: 'EUR', type: 'Trade Finance', direction: 'Outgoing', counterparty: 'Mining Corp Africa', counterpartyCountry: 'South Africa', riskScore: 52, flags: ['Extractive industry'] },
  { id: 'TXN-10020', customerId: 'CUST-009', date: '2026-04-09', amount: 950000, currency: 'EUR', type: 'Wire Transfer', direction: 'Incoming', counterparty: 'Deutsche Bank AG', counterpartyCountry: 'Germany', riskScore: 12, flags: [] },
  { id: 'TXN-10021', customerId: 'CUST-010', date: '2026-04-15', amount: 2200000, currency: 'HKD', type: 'Wire Transfer', direction: 'Outgoing', counterparty: 'Macau Gaming Ltd', counterpartyCountry: 'Macau', riskScore: 82, flags: ['PEP involved', 'Gaming industry', 'Large value'] },
  { id: 'TXN-10022', customerId: 'CUST-010', date: '2026-04-12', amount: 1500000, currency: 'HKD', type: 'Wire Transfer', direction: 'Incoming', counterparty: 'Mainland Investments', counterpartyCountry: 'China', riskScore: 65, flags: ['PEP involved', 'Round amount'] },
  { id: 'TXN-10023', customerId: 'CUST-011', date: '2026-04-14', amount: 430000, currency: 'USD', type: 'Wire Transfer', direction: 'Outgoing', counterparty: 'Vessel Repairs Intl', counterpartyCountry: 'Turkey', riskScore: 70, flags: ['Inconsistent with profile', 'High-risk jurisdiction'] },
  { id: 'TXN-10024', customerId: 'CUST-011', date: '2026-04-08', amount: 890000, currency: 'USD', type: 'Wire Transfer', direction: 'Incoming', counterparty: 'Oil Cargo Finance', counterpartyCountry: 'Iran', riskScore: 96, flags: ['Sanctioned country', 'High-risk jurisdiction', 'Large value'] },
  { id: 'TXN-10025', customerId: 'CUST-012', date: '2026-04-13', amount: 30000, currency: 'JPY', type: 'Domestic Transfer', direction: 'Outgoing', counterparty: 'Tokyo Electric Co', counterpartyCountry: 'Japan', riskScore: 3, flags: [] },
  { id: 'TXN-10026', customerId: 'CUST-012', date: '2026-04-01', amount: 450000, currency: 'JPY', type: 'Domestic Transfer', direction: 'Incoming', counterparty: 'Salary - Mitsubishi Corp', counterpartyCountry: 'Japan', riskScore: 2, flags: [] },
  { id: 'TXN-10027', customerId: 'CUST-002', date: '2026-04-10', amount: 150000, currency: 'GBP', type: 'Wire Transfer', direction: 'Outgoing', counterparty: 'Trade Partners FZE', counterpartyCountry: 'UAE', riskScore: 60, flags: ['Free zone entity'] },
  { id: 'TXN-10028', customerId: 'CUST-003', date: '2026-04-08', amount: 250000, currency: 'USD', type: 'Wire Transfer', direction: 'Outgoing', counterparty: 'Luxury Motors AG', counterpartyCountry: 'Switzerland', riskScore: 72, flags: ['PEP involved', 'High-value goods'] },
  { id: 'TXN-10029', customerId: 'CUST-010', date: '2026-04-05', amount: 3800000, currency: 'HKD', type: 'Wire Transfer', direction: 'Outgoing', counterparty: 'Private Art Gallery', counterpartyCountry: 'United Kingdom', riskScore: 70, flags: ['PEP involved', 'Art/luxury goods', 'Large value'] },
  { id: 'TXN-10030', customerId: 'CUST-011', date: '2026-04-03', amount: 220000, currency: 'USD', type: 'Wire Transfer', direction: 'Outgoing', counterparty: 'Fuel Supplies DMCC', counterpartyCountry: 'UAE', riskScore: 58, flags: ['Free zone entity'] }
];

const ALERTS = [
  { id: 'ALT-001', customerId: 'CUST-007', severity: 'Critical', type: 'Sanctions Match', message: 'Customer matched against OFAC sanctions list', date: '2026-04-15', status: 'Open' },
  { id: 'ALT-002', customerId: 'CUST-003', severity: 'High', type: 'Unusual Activity', message: 'Multiple large outgoing transfers to high-risk jurisdictions within 72 hours', date: '2026-04-15', status: 'Open' },
  { id: 'ALT-003', customerId: 'CUST-011', severity: 'High', type: 'Sanctions Proximity', message: 'Incoming transfer from sanctioned country (Iran)', date: '2026-04-08', status: 'Under Review' },
  { id: 'ALT-004', customerId: 'CUST-010', severity: 'High', type: 'PEP Activity', message: 'PEP customer with high-value transfers to gaming and art industries', date: '2026-04-15', status: 'Open' },
  { id: 'ALT-005', customerId: 'CUST-002', severity: 'Medium', type: 'Jurisdiction Risk', message: 'Large transfer to Cayman Islands entity with no prior relationship', date: '2026-04-15', status: 'Open' },
  { id: 'ALT-006', customerId: 'CUST-003', severity: 'High', type: 'Structuring', message: 'Potential structuring detected: multiple transfers near $500K threshold', date: '2026-04-14', status: 'Under Review' },
  { id: 'ALT-007', customerId: 'CUST-011', severity: 'Medium', type: 'Profile Mismatch', message: 'Transaction to vessel repairs inconsistent with shipping company profile', date: '2026-04-14', status: 'Open' },
  { id: 'ALT-008', customerId: 'CUST-005', severity: 'Low', type: 'Vague Description', message: 'Incoming transfer with vague purpose description', date: '2026-04-10', status: 'Resolved' },
  { id: 'ALT-009', customerId: 'CUST-007', severity: 'Critical', type: 'KYC Expired', message: 'Customer KYC documentation has expired - account under sanctions watch', date: '2026-04-01', status: 'Open' },
  { id: 'ALT-010', customerId: 'CUST-009', severity: 'Medium', type: 'Industry Risk', message: 'Large payment to extractive industry entity in Africa', date: '2026-04-15', status: 'Open' }
];

// Historical risk trend data (last 6 months)
const RISK_TRENDS = {
  labels: ['Nov 2025', 'Dec 2025', 'Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026'],
  datasets: {
    highRiskCount: [8, 11, 9, 14, 12, 16],
    mediumRiskCount: [22, 19, 25, 21, 28, 24],
    lowRiskCount: [45, 48, 42, 50, 47, 52],
    totalAlerts: [15, 22, 18, 28, 25, 32],
    resolvedAlerts: [12, 18, 15, 20, 22, 18]
  }
};
