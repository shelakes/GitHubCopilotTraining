/**
 * RiskGuard Dashboard — Mock Customer Data
 *
 * Single source of truth for customer account records.
 * Consumed by js/app.js as a global constant.
 *
 * Each customer's `id` and `name` match `accountId` / `customerName`
 * values in data/transactions.json to ensure referential integrity.
 *
 * Risk-tier distribution (0–100):
 *   Low (0–30):      ACC-002, ACC-004, ACC-006, ACC-009
 *   Medium (31–60):  ACC-003, ACC-011
 *   High (61–85):    ACC-007, ACC-012
 *   Critical (86–100): ACC-001, ACC-005, ACC-008, ACC-010
 */

const CUSTOMERS = [
  {
    id: 'ACC-001',
    name: 'Marcus Lindqvist',
    type: 'Corporate',
    country: 'Sweden',
    riskScore: 88,
    accountOpenDate: '2022-03-10',
    lastReviewDate: '2025-08-15',
    kycStatus: 'Expired',
    pep: false,
    sanctioned: false,
    totalBalance: 284500,
    currency: 'EUR'
  },
  {
    id: 'ACC-002',
    name: 'Anna Korhonen',
    type: 'Individual',
    country: 'Finland',
    riskScore: 12,
    accountOpenDate: '2023-06-15',
    lastReviewDate: '2026-01-20',
    kycStatus: 'Verified',
    pep: false,
    sanctioned: false,
    totalBalance: 14320,
    currency: 'EUR'
  },
  {
    id: 'ACC-003',
    name: 'Hans Weber',
    type: 'Corporate',
    country: 'Germany',
    riskScore: 52,
    accountOpenDate: '2021-11-02',
    lastReviewDate: '2025-12-05',
    kycStatus: 'Verified',
    pep: false,
    sanctioned: false,
    totalBalance: 198750,
    currency: 'EUR'
  },
  {
    id: 'ACC-004',
    name: 'Sofia Bergström',
    type: 'Individual',
    country: 'Sweden',
    riskScore: 8,
    accountOpenDate: '2024-01-22',
    lastReviewDate: '2026-02-10',
    kycStatus: 'Verified',
    pep: false,
    sanctioned: false,
    totalBalance: 42800,
    currency: 'SEK'
  },
  {
    id: 'ACC-005',
    name: 'Roberto Ferraro',
    type: 'Corporate',
    country: 'Italy',
    riskScore: 96,
    accountOpenDate: '2023-02-18',
    lastReviewDate: '2025-06-30',
    kycStatus: 'Expired',
    pep: false,
    sanctioned: true,
    totalBalance: 1245000,
    currency: 'EUR'
  },
  {
    id: 'ACC-006',
    name: 'Emma Patel',
    type: 'Individual',
    country: 'UK',
    riskScore: 15,
    accountOpenDate: '2023-09-01',
    lastReviewDate: '2026-03-12',
    kycStatus: 'Verified',
    pep: false,
    sanctioned: false,
    totalBalance: 28900,
    currency: 'GBP'
  },
  {
    id: 'ACC-007',
    name: 'Karim Al-Hassan',
    type: 'Corporate',
    country: 'Netherlands',
    riskScore: 78,
    accountOpenDate: '2022-07-14',
    lastReviewDate: '2025-11-20',
    kycStatus: 'Under Review',
    pep: true,
    sanctioned: false,
    totalBalance: 567000,
    currency: 'EUR'
  },
  {
    id: 'ACC-008',
    name: 'Leila Nasser',
    type: 'Corporate',
    country: 'Lebanon',
    riskScore: 90,
    accountOpenDate: '2023-04-05',
    lastReviewDate: '2025-07-18',
    kycStatus: 'Expired',
    pep: false,
    sanctioned: true,
    totalBalance: 892000,
    currency: 'USD'
  },
  {
    id: 'ACC-009',
    name: 'Bjorn Nilsson',
    type: 'Individual',
    country: 'Sweden',
    riskScore: 14,
    accountOpenDate: '2024-05-10',
    lastReviewDate: '2026-04-01',
    kycStatus: 'Verified',
    pep: false,
    sanctioned: false,
    totalBalance: 67500,
    currency: 'SEK'
  },
  {
    id: 'ACC-010',
    name: 'Chen Wei',
    type: 'Corporate',
    country: 'Hong Kong',
    riskScore: 93,
    accountOpenDate: '2022-12-01',
    lastReviewDate: '2025-05-22',
    kycStatus: 'Under Review',
    pep: false,
    sanctioned: false,
    totalBalance: 2150000,
    currency: 'EUR'
  },
  {
    id: 'ACC-011',
    name: 'Ingrid Johansson',
    type: 'Individual',
    country: 'Sweden',
    riskScore: 48,
    accountOpenDate: '2023-08-20',
    lastReviewDate: '2026-02-28',
    kycStatus: 'Verified',
    pep: false,
    sanctioned: false,
    totalBalance: 105400,
    currency: 'SEK'
  },
  {
    id: 'ACC-012',
    name: 'Dimitri Volkov',
    type: 'Corporate',
    country: 'Finland',
    riskScore: 74,
    accountOpenDate: '2022-05-30',
    lastReviewDate: '2025-10-15',
    kycStatus: 'Under Review',
    pep: true,
    sanctioned: false,
    totalBalance: 438000,
    currency: 'EUR'
  }
];

/**
 * Raw transaction data — sourced from data/transactions.json schema.
 * Transformed by js/app.js at startup into the TRANSACTIONS, ALERTS,
 * and RISK_TRENDS globals the rendering layer consumes.
 */
const TRANSACTIONS_RAW = [
  {"transactionId":"550e8400-e29b-41d4-a716-446655440001","accountId":"ACC-001","customerName":"Marcus Lindqvist","amount":4850.00,"currency":"EUR","merchantName":"CryptoNow Exchange","merchantCategory":"CRYPTO_EXCHANGE","originCountry":"SE","destinationCountry":"MT","riskScore":87,"fraudIndicators":["VELOCITY_ANOMALY","UNUSUAL_MERCHANT"],"timestamp":"2026-04-11T08:14:22Z","status":"PENDING_REVIEW"},
  {"transactionId":"550e8400-e29b-41d4-a716-446655440002","accountId":"ACC-001","customerName":"Marcus Lindqvist","amount":4990.00,"currency":"EUR","merchantName":"BetWorld Online","merchantCategory":"GAMBLING","originCountry":"SE","destinationCountry":"CY","riskScore":92,"fraudIndicators":["VELOCITY_ANOMALY","UNUSUAL_MERCHANT","HIGH_VALUE_SPIKE"],"timestamp":"2026-04-11T09:02:11Z","status":"BLOCKED"},
  {"transactionId":"550e8400-e29b-41d4-a716-446655440003","accountId":"ACC-002","customerName":"Anna Korhonen","amount":42.50,"currency":"EUR","merchantName":"Prisma Helsinki","merchantCategory":"RETAIL","originCountry":"FI","destinationCountry":"FI","riskScore":7,"fraudIndicators":[],"timestamp":"2026-04-10T14:31:05Z","status":"APPROVED"},
  {"transactionId":"550e8400-e29b-41d4-a716-446655440004","accountId":"ACC-003","customerName":"Hans Weber","amount":1280.00,"currency":"EUR","merchantName":"Emirates Airlines","merchantCategory":"TRAVEL","originCountry":"DE","destinationCountry":"AE","riskScore":44,"fraudIndicators":["GEO_ANOMALY"],"timestamp":"2026-04-10T19:55:30Z","status":"APPROVED"},
  {"transactionId":"550e8400-e29b-41d4-a716-446655440005","accountId":"ACC-004","customerName":"Sofia Bergström","amount":89.00,"currency":"SEK","merchantName":"Vattenfall","merchantCategory":"UTILITIES","originCountry":"SE","destinationCountry":"SE","riskScore":5,"fraudIndicators":[],"timestamp":"2026-04-09T10:00:00Z","status":"APPROVED"},
  {"transactionId":"550e8400-e29b-41d4-a716-446655440006","accountId":"ACC-005","customerName":"Roberto Ferraro","amount":18500.00,"currency":"EUR","merchantName":"OffshoreVault Ltd","merchantCategory":"CRYPTO_EXCHANGE","originCountry":"IT","destinationCountry":"VG","riskScore":96,"fraudIndicators":["GEO_ANOMALY","HIGH_VALUE_SPIKE","UNUSUAL_MERCHANT"],"timestamp":"2026-04-11T06:03:47Z","status":"BLOCKED"},
  {"transactionId":"550e8400-e29b-41d4-a716-446655440007","accountId":"ACC-005","customerName":"Roberto Ferraro","amount":9750.00,"currency":"EUR","merchantName":"OffshoreVault Ltd","merchantCategory":"CRYPTO_EXCHANGE","originCountry":"IT","destinationCountry":"VG","riskScore":91,"fraudIndicators":["VELOCITY_ANOMALY","HIGH_VALUE_SPIKE"],"timestamp":"2026-04-11T06:47:19Z","status":"BLOCKED"},
  {"transactionId":"550e8400-e29b-41d4-a716-446655440008","accountId":"ACC-003","customerName":"Hans Weber","amount":320.00,"currency":"USD","merchantName":"Marriott Hotels","merchantCategory":"TRAVEL","originCountry":"AE","destinationCountry":"AE","riskScore":38,"fraudIndicators":[],"timestamp":"2026-04-11T11:20:00Z","status":"APPROVED"},
  {"transactionId":"550e8400-e29b-41d4-a716-446655440009","accountId":"ACC-006","customerName":"Emma Patel","amount":155.75,"currency":"GBP","merchantName":"Amazon UK","merchantCategory":"RETAIL","originCountry":"GB","destinationCountry":"GB","riskScore":11,"fraudIndicators":[],"timestamp":"2026-04-11T13:45:22Z","status":"APPROVED"},
  {"transactionId":"550e8400-e29b-41d4-a716-446655440010","accountId":"ACC-007","customerName":"Karim Al-Hassan","amount":9800.00,"currency":"EUR","merchantName":"FX Global Transfer","merchantCategory":"OTHER","originCountry":"NL","destinationCountry":"AE","riskScore":78,"fraudIndicators":["VELOCITY_ANOMALY","HIGH_VALUE_SPIKE"],"timestamp":"2026-04-11T07:30:15Z","status":"PENDING_REVIEW"},
  {"transactionId":"550e8400-e29b-41d4-a716-446655440011","accountId":"ACC-001","customerName":"Marcus Lindqvist","amount":4750.00,"currency":"EUR","merchantName":"BitFlow Pro","merchantCategory":"CRYPTO_EXCHANGE","originCountry":"SE","destinationCountry":"MT","riskScore":85,"fraudIndicators":["VELOCITY_ANOMALY","UNUSUAL_MERCHANT"],"timestamp":"2026-04-11T10:15:00Z","status":"BLOCKED"},
  {"transactionId":"550e8400-e29b-41d4-a716-446655440012","accountId":"ACC-001","customerName":"Marcus Lindqvist","amount":4820.00,"currency":"EUR","merchantName":"CryptoNow Exchange","merchantCategory":"CRYPTO_EXCHANGE","originCountry":"SE","destinationCountry":"CY","riskScore":89,"fraudIndicators":["VELOCITY_ANOMALY","UNUSUAL_MERCHANT","HIGH_VALUE_SPIKE"],"timestamp":"2026-04-11T11:05:00Z","status":"BLOCKED"},
  {"transactionId":"550e8400-e29b-41d4-a716-446655440013","accountId":"ACC-001","customerName":"Marcus Lindqvist","amount":4900.00,"currency":"EUR","merchantName":"FastCoin Ltd","merchantCategory":"CRYPTO_EXCHANGE","originCountry":"SE","destinationCountry":"VG","riskScore":93,"fraudIndicators":["VELOCITY_ANOMALY","UNUSUAL_MERCHANT","HIGH_VALUE_SPIKE"],"timestamp":"2026-04-11T12:42:00Z","status":"BLOCKED"},
  {"transactionId":"550e8400-e29b-41d4-a716-446655440014","accountId":"ACC-001","customerName":"Marcus Lindqvist","amount":120.00,"currency":"EUR","merchantName":"ICA Supermarket","merchantCategory":"RETAIL","originCountry":"SE","destinationCountry":"SE","riskScore":12,"fraudIndicators":[],"timestamp":"2026-04-10T09:30:00Z","status":"APPROVED"},
  {"transactionId":"550e8400-e29b-41d4-a716-446655440015","accountId":"ACC-002","customerName":"Anna Korhonen","amount":55.00,"currency":"EUR","merchantName":"K-Market Tampere","merchantCategory":"RETAIL","originCountry":"FI","destinationCountry":"FI","riskScore":5,"fraudIndicators":[],"timestamp":"2026-04-11T07:00:00Z","status":"APPROVED"},
  {"transactionId":"550e8400-e29b-41d4-a716-446655440016","accountId":"ACC-002","customerName":"Anna Korhonen","amount":89.90,"currency":"EUR","merchantName":"Elisa Telecom","merchantCategory":"UTILITIES","originCountry":"FI","destinationCountry":"FI","riskScore":4,"fraudIndicators":[],"timestamp":"2026-04-11T08:15:00Z","status":"APPROVED"},
  {"transactionId":"550e8400-e29b-41d4-a716-446655440017","accountId":"ACC-002","customerName":"Anna Korhonen","amount":34.50,"currency":"EUR","merchantName":"Prisma Helsinki","merchantCategory":"RETAIL","originCountry":"FI","destinationCountry":"FI","riskScore":6,"fraudIndicators":[],"timestamp":"2026-04-11T12:00:00Z","status":"APPROVED"},
  {"transactionId":"550e8400-e29b-41d4-a716-446655440018","accountId":"ACC-003","customerName":"Hans Weber","amount":550.00,"currency":"EUR","merchantName":"Hilton Dubai","merchantCategory":"TRAVEL","originCountry":"AE","destinationCountry":"AE","riskScore":41,"fraudIndicators":["GEO_ANOMALY"],"timestamp":"2026-04-11T06:00:00Z","status":"APPROVED"},
  {"transactionId":"550e8400-e29b-41d4-a716-446655440019","accountId":"ACC-003","customerName":"Hans Weber","amount":210.00,"currency":"USD","merchantName":"Carrefour Dubai","merchantCategory":"RETAIL","originCountry":"AE","destinationCountry":"AE","riskScore":30,"fraudIndicators":["GEO_ANOMALY"],"timestamp":"2026-04-11T10:30:00Z","status":"APPROVED"},
  {"transactionId":"550e8400-e29b-41d4-a716-446655440020","accountId":"ACC-004","customerName":"Sofia Bergström","amount":125.00,"currency":"SEK","merchantName":"Telia Sverige","merchantCategory":"UTILITIES","originCountry":"SE","destinationCountry":"SE","riskScore":4,"fraudIndicators":[],"timestamp":"2026-04-11T07:45:00Z","status":"APPROVED"},
  {"transactionId":"550e8400-e29b-41d4-a716-446655440021","accountId":"ACC-004","customerName":"Sofia Bergström","amount":67.00,"currency":"SEK","merchantName":"Hemköp","merchantCategory":"RETAIL","originCountry":"SE","destinationCountry":"SE","riskScore":3,"fraudIndicators":[],"timestamp":"2026-04-11T12:20:00Z","status":"APPROVED"},
  {"transactionId":"550e8400-e29b-41d4-a716-446655440022","accountId":"ACC-005","customerName":"Roberto Ferraro","amount":9600.00,"currency":"EUR","merchantName":"OffshoreVault Ltd","merchantCategory":"CRYPTO_EXCHANGE","originCountry":"IT","destinationCountry":"VG","riskScore":94,"fraudIndicators":["GEO_ANOMALY","HIGH_VALUE_SPIKE","VELOCITY_ANOMALY"],"timestamp":"2026-04-11T07:20:00Z","status":"BLOCKED"},
  {"transactionId":"550e8400-e29b-41d4-a716-446655440023","accountId":"ACC-005","customerName":"Roberto Ferraro","amount":9400.00,"currency":"EUR","merchantName":"OffshoreVault Ltd","merchantCategory":"CRYPTO_EXCHANGE","originCountry":"IT","destinationCountry":"KY","riskScore":96,"fraudIndicators":["GEO_ANOMALY","HIGH_VALUE_SPIKE","VELOCITY_ANOMALY","UNUSUAL_MERCHANT"],"timestamp":"2026-04-11T08:10:00Z","status":"BLOCKED"},
  {"transactionId":"550e8400-e29b-41d4-a716-446655440024","accountId":"ACC-005","customerName":"Roberto Ferraro","amount":9200.00,"currency":"EUR","merchantName":"DarkVault Exchange","merchantCategory":"CRYPTO_EXCHANGE","originCountry":"IT","destinationCountry":"VG","riskScore":98,"fraudIndicators":["GEO_ANOMALY","HIGH_VALUE_SPIKE","VELOCITY_ANOMALY","UNUSUAL_MERCHANT"],"timestamp":"2026-04-11T09:00:00Z","status":"BLOCKED"},
  {"transactionId":"550e8400-e29b-41d4-a716-446655440025","accountId":"ACC-005","customerName":"Roberto Ferraro","amount":8900.00,"currency":"EUR","merchantName":"OffshoreVault Ltd","merchantCategory":"CRYPTO_EXCHANGE","originCountry":"IT","destinationCountry":"VG","riskScore":97,"fraudIndicators":["GEO_ANOMALY","HIGH_VALUE_SPIKE","VELOCITY_ANOMALY"],"timestamp":"2026-04-11T09:55:00Z","status":"BLOCKED"},
  {"transactionId":"550e8400-e29b-41d4-a716-446655440026","accountId":"ACC-005","customerName":"Roberto Ferraro","amount":9100.00,"currency":"EUR","merchantName":"OffshoreVault Ltd","merchantCategory":"CRYPTO_EXCHANGE","originCountry":"IT","destinationCountry":"MT","riskScore":95,"fraudIndicators":["GEO_ANOMALY","HIGH_VALUE_SPIKE","VELOCITY_ANOMALY"],"timestamp":"2026-04-11T10:50:00Z","status":"BLOCKED"},
  {"transactionId":"550e8400-e29b-41d4-a716-446655440027","accountId":"ACC-006","customerName":"Emma Patel","amount":89.99,"currency":"GBP","merchantName":"Marks & Spencer","merchantCategory":"RETAIL","originCountry":"GB","destinationCountry":"GB","riskScore":8,"fraudIndicators":[],"timestamp":"2026-04-11T09:00:00Z","status":"APPROVED"},
  {"transactionId":"550e8400-e29b-41d4-a716-446655440028","accountId":"ACC-006","customerName":"Emma Patel","amount":45.00,"currency":"GBP","merchantName":"British Gas","merchantCategory":"UTILITIES","originCountry":"GB","destinationCountry":"GB","riskScore":5,"fraudIndicators":[],"timestamp":"2026-04-11T10:30:00Z","status":"APPROVED"},
  {"transactionId":"550e8400-e29b-41d4-a716-446655440029","accountId":"ACC-007","customerName":"Karim Al-Hassan","amount":9700.00,"currency":"EUR","merchantName":"FX Global Transfer","merchantCategory":"OTHER","originCountry":"NL","destinationCountry":"AE","riskScore":80,"fraudIndicators":["VELOCITY_ANOMALY","HIGH_VALUE_SPIKE"],"timestamp":"2026-04-11T08:45:00Z","status":"PENDING_REVIEW"},
  {"transactionId":"550e8400-e29b-41d4-a716-446655440030","accountId":"ACC-007","customerName":"Karim Al-Hassan","amount":9500.00,"currency":"EUR","merchantName":"FX Global Transfer","merchantCategory":"OTHER","originCountry":"NL","destinationCountry":"QA","riskScore":82,"fraudIndicators":["VELOCITY_ANOMALY","HIGH_VALUE_SPIKE","GEO_ANOMALY"],"timestamp":"2026-04-11T10:00:00Z","status":"PENDING_REVIEW"},
  {"transactionId":"550e8400-e29b-41d4-a716-446655440031","accountId":"ACC-007","customerName":"Karim Al-Hassan","amount":9300.00,"currency":"EUR","merchantName":"FX Global Transfer","merchantCategory":"OTHER","originCountry":"NL","destinationCountry":"AE","riskScore":75,"fraudIndicators":["VELOCITY_ANOMALY","HIGH_VALUE_SPIKE"],"timestamp":"2026-04-11T11:15:00Z","status":"PENDING_REVIEW"},
  {"transactionId":"550e8400-e29b-41d4-a716-446655440032","accountId":"ACC-008","customerName":"Leila Nasser","amount":9800.00,"currency":"USD","merchantName":"GoldEx Trading","merchantCategory":"OTHER","originCountry":"LB","destinationCountry":"CH","riskScore":88,"fraudIndicators":["HIGH_VALUE_SPIKE","GEO_ANOMALY"],"timestamp":"2026-04-11T06:30:00Z","status":"PENDING_REVIEW"},
  {"transactionId":"550e8400-e29b-41d4-a716-446655440033","accountId":"ACC-008","customerName":"Leila Nasser","amount":9600.00,"currency":"USD","merchantName":"GoldEx Trading","merchantCategory":"OTHER","originCountry":"LB","destinationCountry":"AE","riskScore":90,"fraudIndicators":["HIGH_VALUE_SPIKE","GEO_ANOMALY","VELOCITY_ANOMALY"],"timestamp":"2026-04-11T07:30:00Z","status":"BLOCKED"},
  {"transactionId":"550e8400-e29b-41d4-a716-446655440034","accountId":"ACC-008","customerName":"Leila Nasser","amount":9400.00,"currency":"USD","merchantName":"GoldEx Trading","merchantCategory":"OTHER","originCountry":"LB","destinationCountry":"CH","riskScore":92,"fraudIndicators":["HIGH_VALUE_SPIKE","GEO_ANOMALY","VELOCITY_ANOMALY","UNUSUAL_MERCHANT"],"timestamp":"2026-04-11T08:20:00Z","status":"BLOCKED"},
  {"transactionId":"550e8400-e29b-41d4-a716-446655440035","accountId":"ACC-009","customerName":"Bjorn Nilsson","amount":240.00,"currency":"SEK","merchantName":"Systembolaget","merchantCategory":"RETAIL","originCountry":"SE","destinationCountry":"SE","riskScore":9,"fraudIndicators":[],"timestamp":"2026-04-11T14:00:00Z","status":"APPROVED"},
  {"transactionId":"550e8400-e29b-41d4-a716-446655440036","accountId":"ACC-009","customerName":"Bjorn Nilsson","amount":580.00,"currency":"SEK","merchantName":"SAS Airlines","merchantCategory":"TRAVEL","originCountry":"SE","destinationCountry":"NO","riskScore":18,"fraudIndicators":[],"timestamp":"2026-04-11T16:00:00Z","status":"APPROVED"},
  {"transactionId":"550e8400-e29b-41d4-a716-446655440037","accountId":"ACC-010","customerName":"Chen Wei","amount":9780.00,"currency":"EUR","merchantName":"HK Crypto Partners","merchantCategory":"CRYPTO_EXCHANGE","originCountry":"HK","destinationCountry":"VG","riskScore":91,"fraudIndicators":["VELOCITY_ANOMALY","UNUSUAL_MERCHANT","GEO_ANOMALY"],"timestamp":"2026-04-11T01:00:00Z","status":"BLOCKED"},
  {"transactionId":"550e8400-e29b-41d4-a716-446655440038","accountId":"ACC-010","customerName":"Chen Wei","amount":9650.00,"currency":"EUR","merchantName":"HK Crypto Partners","merchantCategory":"CRYPTO_EXCHANGE","originCountry":"HK","destinationCountry":"KY","riskScore":93,"fraudIndicators":["VELOCITY_ANOMALY","UNUSUAL_MERCHANT","GEO_ANOMALY","HIGH_VALUE_SPIKE"],"timestamp":"2026-04-11T02:30:00Z","status":"BLOCKED"},
  {"transactionId":"550e8400-e29b-41d4-a716-446655440039","accountId":"ACC-010","customerName":"Chen Wei","amount":9500.00,"currency":"EUR","merchantName":"HK Crypto Partners","merchantCategory":"CRYPTO_EXCHANGE","originCountry":"HK","destinationCountry":"VG","riskScore":95,"fraudIndicators":["VELOCITY_ANOMALY","UNUSUAL_MERCHANT","GEO_ANOMALY","HIGH_VALUE_SPIKE"],"timestamp":"2026-04-11T04:15:00Z","status":"BLOCKED"},
  {"transactionId":"550e8400-e29b-41d4-a716-446655440040","accountId":"ACC-010","customerName":"Chen Wei","amount":9320.00,"currency":"EUR","merchantName":"HK Crypto Partners","merchantCategory":"CRYPTO_EXCHANGE","originCountry":"HK","destinationCountry":"MT","riskScore":90,"fraudIndicators":["VELOCITY_ANOMALY","UNUSUAL_MERCHANT","GEO_ANOMALY"],"timestamp":"2026-04-11T05:45:00Z","status":"BLOCKED"}
];
