# RiskGuard — Transaction Risk Alert Dashboard

## Domain

**Financial Services — Fraud Risk Management & Anti-Money Laundering (AML) Operations**

This project is a Transaction Monitoring System (TMS) / Fraud Operations Dashboard used by fraud analysts in the first line of defense at financial institutions.

### Sub-domains

| Sub-domain | How this project touches it |
|---|---|
| **Transaction Monitoring** | 24-hour timeline, flagged transactions, velocity/geo/merchant anomalies |
| **Risk Scoring & Tiering** | Weighted fraud signal aggregation into GREEN/YELLOW/RED tiers |
| **Fraud Signal Detection** | Velocity anomalies, geo-anomalies, high-risk merchants, high-value spikes |
| **KYC / Customer Due Diligence** | Customer profiles, KYC status, PEP screening, sanctions checks |
| **Alert Triage & Case Management** | Alerts with status workflow (New → Investigating → Resolved) |
| **Compliance Reporting** | Audit trail for compliance team, risk calculation transparency |

### Domain Terminology

- **Risk Score / Risk Tier** — Numeric score (0–100) mapped to GREEN/YELLOW/RED tiers indicating account fraud risk
- **PEP (Politically Exposed Person)** — Individuals in prominent public positions who require enhanced due diligence
- **KYC (Know Your Customer)** — Verification process to confirm customer identity and assess risk
- **Sanctioned** — Individuals or entities on government/international sanctions lists
- **Velocity Anomaly** — Unusual spike in transaction frequency for an account
- **Geo-Anomaly** — Transactions originating from unexpected countries or regions
- **Merchant Category Risk** — Elevated risk from high-risk merchant types (gambling, crypto)
- **High-Value Spike** — Transaction amounts exceeding the account's typical range

### Industry Alignment

Governed by regulations including BSA/AML, EU AMLD, and FATF guidelines. Maps to tools used by fraud operations analysts at banks and financial institutions.
