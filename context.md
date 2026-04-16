build the project 
Project 1 — Transaction Risk Alert Dashboard
Objective
Build a web application that helps a bank's operations team make rapid risk decisions by visualising transaction risk indicators for customer accounts. Mock data is provided as static JSON files — no backend to build.

Goal
Practice the agentic workflow to develop a complete, functional web application from initial specification through to a working frontend — using the provided data/transactions.json as your data source.

Scenario
You are a developer at a fintech company. The fraud operations team needs a tool to assess account risk at a glance. Suspicious transaction activity is rising, and the team wants to see whether an account is GREEN (low risk), YELLOW (review required), or RED (block/escalate). They need to see the key fraud signals driving the score and how transaction behaviour has changed over the past 24 hours.

Required Features
1. Account Search and Data Retrieval
Accept input by account ID or customer name
Load mock transaction data from the provided data/transactions.json file
Display the current fraud indicator signals (velocity anomaly, geo-anomaly, unusual merchant category, high-value spike)
Handle missing accounts and empty transaction histories gracefully
2. Risk Status Visualisation
Calculate and display the overall account risk tier: GREEN / YELLOW / RED
Apply colour-coded indicators based on the weighted fraud signals
Show the top contributing risk factors in plain language
Display account metadata and the timestamp of the most recent assessment
3. 24-Hour Transaction Timeline
Present a timeline of transactions over the past 24 hours
Visualise transaction amount trends and risk score changes over time
Highlight time windows with elevated suspicion
Show transaction count per hour as a bar or sparkline chart
Mock Data Schema
Transaction
  transactionId    : UUID
  accountId        : String
  customerName     : String
  amount           : BigDecimal
  currency         : String (ISO 4217)
  merchantName     : String
  merchantCategory : Enum (RETAIL, GAMBLING, CRYPTO_EXCHANGE, UTILITIES, TRAVEL, OTHER)
  originCountry    : String (ISO 3166)
  destinationCountry : String (ISO 3166)
  riskScore        : Integer (0–100)
  fraudIndicators  : List<Enum> (VELOCITY_ANOMALY, GEO_ANOMALY, UNUSUAL_MERCHANT, HIGH_VALUE_SPIKE)
  timestamp        : Instant
  status           : Enum (APPROVED, PENDING_REVIEW, BLOCKED)
Seed data: Provided as data/transactions.json.

