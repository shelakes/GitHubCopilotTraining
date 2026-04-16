// === RiskGuard Dashboard Application ===

(function () {
  'use strict';

  // --- Global Data (populated from transactions.json) ---
  let TRANSACTIONS = [];
  let ALERTS = [];
  let RISK_TRENDS = { labels: [], datasets: { totalAlerts: [], resolvedAlerts: [] } };

  // --- Utility Helpers ---
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function formatCurrency(amount, currency) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  }

  function getRiskClass(score) {
    if (score <= 30) return 'low';
    if (score <= 60) return 'medium';
    if (score <= 85) return 'high';
    return 'critical';
  }

  function getRiskLabel(score) {
    if (score <= 30) return 'Low';
    if (score <= 60) return 'Medium';
    if (score <= 85) return 'High';
    return 'Critical';
  }

  function getRiskColor(score) {
    if (score <= 30) return '#22c55e';
    if (score <= 60) return '#f59e0b';
    if (score <= 85) return '#ef4444';
    return '#991b1b';
  }

  function getCustomerName(customerId) {
    const c = CUSTOMERS.find(c => c.id === customerId);
    return c ? c.name : customerId;
  }

  // --- Data Loading & Transformation ---
  // Fetches data/transactions.json and transforms field names to match app expectations.
  // Derives ALERTS and RISK_TRENDS from the transaction data.

  function transformTransaction(raw) {
    const originCountry = raw.originCountry || '';
    const destCountry = raw.destinationCountry || '';
    const direction = (originCountry === destCountry) ? 'Incoming' : 'Outgoing';
    return {
      id: raw.transactionId,
      customerId: raw.accountId,
      customerName: raw.customerName,
      amount: raw.amount,
      currency: raw.currency,
      counterparty: raw.merchantName,
      counterpartyCountry: raw.destinationCountry,
      type: raw.merchantCategory,
      flags: raw.fraudIndicators || [],
      date: raw.timestamp,
      riskScore: raw.riskScore,
      status: raw.status,
      direction: direction,
      originCountry: raw.originCountry
    };
  }

  function deriveAlerts(transactions) {
    // Generate alerts from high-risk transactions with fraud indicators
    let alertId = 1;
    const alerts = [];
    const severityTypes = {
      VELOCITY_ANOMALY: 'Velocity Anomaly Detected',
      GEO_ANOMALY: 'Geographic Anomaly Detected',
      UNUSUAL_MERCHANT: 'Unusual Merchant Category',
      HIGH_VALUE_SPIKE: 'High-Value Transaction Spike'
    };

    transactions.forEach(t => {
      if (t.flags.length === 0) return;
      const severity = t.riskScore >= 86 ? 'Critical'
        : t.riskScore >= 61 ? 'High'
        : t.riskScore >= 31 ? 'Medium'
        : 'Low';
      const primaryFlag = t.flags[0];
      const statusVal = t.status === 'BLOCKED' ? 'Investigating'
        : t.status === 'PENDING_REVIEW' ? 'New'
        : 'Resolved';

      alerts.push({
        id: 'ALT-' + String(alertId++).padStart(3, '0'),
        customerId: t.customerId,
        customerName: t.customerName,
        type: severityTypes[primaryFlag] || primaryFlag,
        severity: severity,
        status: statusVal,
        date: t.date,
        message: t.flags.length + ' fraud indicator(s) on ' + formatCurrency(t.amount, t.currency) + ' to ' + escapeHtml(t.counterparty),
        riskScore: t.riskScore
      });
    });

    return alerts;
  }

  function deriveRiskTrends(transactions) {
    // Build a 7-day trend of alerts by day
    const now = new Date();
    const labels = [];
    const totalAlerts = [];
    const resolvedAlerts = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const dayStr = d.toISOString().slice(0, 10);
      labels.push(label);

      const dayTxns = transactions.filter(t => t.date.slice(0, 10) === dayStr);
      const flagged = dayTxns.filter(t => t.flags.length > 0).length;
      const resolved = dayTxns.filter(t => t.flags.length > 0 && t.status === 'APPROVED').length;
      totalAlerts.push(flagged);
      resolvedAlerts.push(resolved);
    }

    return { labels, datasets: { totalAlerts, resolvedAlerts } };
  }

  function loadData() {
    // TRANSACTIONS_RAW is loaded synchronously via <script src="data/mock-data.js">
    // Its content mirrors data/transactions.json (the canonical schema reference).
    TRANSACTIONS = TRANSACTIONS_RAW.map(transformTransaction);
    ALERTS = deriveAlerts(TRANSACTIONS);
    RISK_TRENDS = deriveRiskTrends(TRANSACTIONS);
  }

  // --- DOM Refs ---
  const sidebar = document.getElementById('sidebar');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.querySelectorAll('.nav-link');
  const views = document.querySelectorAll('.view');
  const pageTitle = document.getElementById('pageTitle');
  const globalSearch = document.getElementById('globalSearch');
  const currentTimeEl = document.getElementById('currentTime');
  const alertBadge = document.getElementById('alertBadge');

  // --- Clock ---
  function updateClock() {
    const now = new Date();
    currentTimeEl.textContent = now.toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  }
  updateClock();
  setInterval(updateClock, 1000);

  // --- Navigation ---
  const viewTitles = {
    dashboard: 'Risk Dashboard',
    customers: 'Customer Accounts',
    transactions: 'Transaction Monitor',
    alerts: 'Risk Alerts'
  };

  function switchView(viewName) {
    views.forEach(v => v.classList.remove('active'));
    navLinks.forEach(l => l.classList.remove('active'));

    const target = document.getElementById(viewName + 'View');
    if (target) target.classList.add('active');

    const link = document.querySelector(`.nav-link[data-view="${viewName}"]`);
    if (link) link.classList.add('active');

    pageTitle.textContent = viewTitles[viewName] || 'Dashboard';

    // Close sidebar on mobile
    if (window.innerWidth <= 768) {
      sidebar.classList.remove('open');
    }
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      switchView(link.dataset.view);
    });
  });

  document.querySelectorAll('.view-all-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      switchView(link.dataset.navigate);
    });
  });

  menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });

  // --- KPIs ---
  function renderKPIs() {
    document.getElementById('kpiTotalCustomers').textContent = CUSTOMERS.length;

    const highRisk = CUSTOMERS.filter(c => c.riskScore > 60).length;
    document.getElementById('kpiHighRisk').textContent = highRisk;

    const openAlerts = ALERTS.filter(a => a.status !== 'Resolved').length;
    document.getElementById('kpiOpenAlerts').textContent = openAlerts;
    alertBadge.textContent = openAlerts;

    const flaggedTxn = TRANSACTIONS.filter(t => t.flags.length > 0).length;
    document.getElementById('kpiFlaggedTxn').textContent = flaggedTxn;
  }

  // --- Charts ---
  let charts = {};

  function renderCharts() {
    // Risk Distribution (Doughnut)
    const riskCounts = { Low: 0, Medium: 0, High: 0, Critical: 0 };
    CUSTOMERS.forEach(c => {
      riskCounts[getRiskLabel(c.riskScore)]++;
    });

    charts.riskDistribution = new Chart(
      document.getElementById('riskDistributionChart'),
      {
        type: 'doughnut',
        data: {
          labels: Object.keys(riskCounts),
          datasets: [{
            data: Object.values(riskCounts),
            backgroundColor: ['#22c55e', '#f59e0b', '#ef4444', '#991b1b'],
            borderWidth: 0,
            hoverOffset: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '65%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: { color: '#94a3b8', padding: 16, usePointStyle: true, pointStyleWidth: 10 }
            }
          }
        }
      }
    );

    // Alert Trends (Line)
    charts.alertTrends = new Chart(
      document.getElementById('alertTrendsChart'),
      {
        type: 'line',
        data: {
          labels: RISK_TRENDS.labels,
          datasets: [
            {
              label: 'Total Alerts',
              data: RISK_TRENDS.datasets.totalAlerts,
              borderColor: '#f97316',
              backgroundColor: 'rgba(249,115,22,0.1)',
              fill: true,
              tension: 0.4,
              pointRadius: 4,
              pointHoverRadius: 6
            },
            {
              label: 'Resolved',
              data: RISK_TRENDS.datasets.resolvedAlerts,
              borderColor: '#22c55e',
              backgroundColor: 'rgba(34,197,94,0.1)',
              fill: true,
              tension: 0.4,
              pointRadius: 4,
              pointHoverRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(51,65,85,0.3)' } },
            y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(51,65,85,0.3)' }, beginAtZero: true }
          },
          plugins: {
            legend: {
              labels: { color: '#94a3b8', usePointStyle: true, pointStyleWidth: 10 }
            }
          }
        }
      }
    );

    // Transaction Risk (Bar)
    const txnRiskBuckets = { 'Low (0-30)': 0, 'Medium (31-60)': 0, 'High (61-85)': 0, 'Critical (86+)': 0 };
    TRANSACTIONS.forEach(t => {
      if (t.riskScore <= 30) txnRiskBuckets['Low (0-30)']++;
      else if (t.riskScore <= 60) txnRiskBuckets['Medium (31-60)']++;
      else if (t.riskScore <= 85) txnRiskBuckets['High (61-85)']++;
      else txnRiskBuckets['Critical (86+)']++;
    });

    charts.txnRisk = new Chart(
      document.getElementById('txnRiskChart'),
      {
        type: 'bar',
        data: {
          labels: Object.keys(txnRiskBuckets),
          datasets: [{
            label: 'Transactions',
            data: Object.values(txnRiskBuckets),
            backgroundColor: ['#22c55e', '#f59e0b', '#ef4444', '#991b1b'],
            borderRadius: 6,
            barThickness: 40
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { ticks: { color: '#64748b' }, grid: { display: false } },
            y: { ticks: { color: '#64748b', stepSize: 2 }, grid: { color: 'rgba(51,65,85,0.3)' }, beginAtZero: true }
          },
          plugins: {
            legend: { display: false }
          }
        }
      }
    );

    // Country Risk (Horizontal bar)
    const countryScores = {};
    CUSTOMERS.forEach(c => {
      countryScores[c.country] = (countryScores[c.country] || 0) + c.riskScore;
    });
    const sortedCountries = Object.entries(countryScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);

    charts.countryRisk = new Chart(
      document.getElementById('countryRiskChart'),
      {
        type: 'bar',
        data: {
          labels: sortedCountries.map(e => e[0]),
          datasets: [{
            label: 'Aggregate Risk Score',
            data: sortedCountries.map(e => e[1]),
            backgroundColor: sortedCountries.map(e => getRiskColor(e[1] / 2)),
            borderRadius: 6,
            barThickness: 20
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(51,65,85,0.3)' }, beginAtZero: true },
            y: { ticks: { color: '#94a3b8' }, grid: { display: false } }
          },
          plugins: {
            legend: { display: false }
          }
        }
      }
    );
  }

  // --- Recent Alerts Table (Dashboard) ---
  function renderRecentAlerts() {
    const tbody = document.querySelector('#recentAlertsTable tbody');
    const recent = [...ALERTS].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

    tbody.innerHTML = recent.map(a => `
      <tr>
        <td>${escapeHtml(a.id)}</td>
        <td><span class="severity-badge severity-badge--${escapeHtml(a.severity)}">${escapeHtml(a.severity)}</span></td>
        <td>${escapeHtml(a.type)}</td>
        <td><a href="#" class="customer-link" data-customer="${escapeHtml(a.customerId)}">${escapeHtml(getCustomerName(a.customerId))}</a></td>
        <td>${escapeHtml(a.message)}</td>
        <td>${formatDate(a.date)}</td>
        <td><span class="status-badge status-badge--${a.status.replace(/\s/g, '-')}">${escapeHtml(a.status)}</span></td>
      </tr>
    `).join('');
  }

  // --- Customers Table ---
  function renderCustomersTable(filter = {}) {
    let data = [...CUSTOMERS];

    if (filter.risk && filter.risk !== 'all') {
      data = data.filter(c => getRiskClass(c.riskScore) === filter.risk);
    }
    if (filter.type && filter.type !== 'all') {
      data = data.filter(c => c.type === filter.type);
    }
    if (filter.kyc && filter.kyc !== 'all') {
      data = data.filter(c => c.kycStatus === filter.kyc);
    }
    if (filter.search) {
      const s = filter.search.toLowerCase();
      data = data.filter(c =>
        c.name.toLowerCase().includes(s) ||
        c.id.toLowerCase().includes(s) ||
        c.country.toLowerCase().includes(s)
      );
    }

    if (filter.sortKey) {
      const dir = filter.sortDir === 'desc' ? -1 : 1;
      data.sort((a, b) => {
        const va = a[filter.sortKey];
        const vb = b[filter.sortKey];
        if (typeof va === 'number') return (va - vb) * dir;
        return String(va).localeCompare(String(vb)) * dir;
      });
    }

    const tbody = document.querySelector('#customersTable tbody');

    if (data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" class="no-results">No customers match the selected filters.</td></tr>';
      return;
    }

    tbody.innerHTML = data.map(c => {
      const riskClass = getRiskClass(c.riskScore);
      const riskLabel = getRiskLabel(c.riskScore);
      const flags = [];
      if (c.pep) flags.push('<span class="flag-icon flag-icon--pep">PEP</span>');
      if (c.sanctioned) flags.push('<span class="flag-icon flag-icon--sanctioned">SANCTIONED</span>');

      return `
        <tr>
          <td>${escapeHtml(c.id)}</td>
          <td><a href="#" class="customer-link" data-customer="${escapeHtml(c.id)}">${escapeHtml(c.name)}</a></td>
          <td>${escapeHtml(c.type)}</td>
          <td>${escapeHtml(c.country)}</td>
          <td>
            <span class="risk-badge risk-badge--${riskClass}">
              ${c.riskScore} · ${riskLabel}
            </span>
            <div class="risk-bar"><div class="risk-bar-fill" style="width:${c.riskScore}%;background:${getRiskColor(c.riskScore)}"></div></div>
          </td>
          <td><span class="kyc-badge kyc-badge--${c.kycStatus.replace(/\s/g, '-')}">${escapeHtml(c.kycStatus)}</span></td>
          <td><div class="customer-flags">${flags.join('')}</div></td>
          <td><button class="btn btn--sm btn--primary customer-link" data-customer="${escapeHtml(c.id)}">View</button></td>
        </tr>
      `;
    }).join('');
  }

  // --- Transactions Table ---
  function renderTransactionsTable(filter = {}) {
    let data = [...TRANSACTIONS];

    if (filter.risk && filter.risk !== 'all') {
      data = data.filter(t => getRiskClass(t.riskScore) === filter.risk);
    }
    if (filter.direction && filter.direction !== 'all') {
      data = data.filter(t => t.direction === filter.direction);
    }
    if (filter.flaggedOnly) {
      data = data.filter(t => t.flags.length > 0);
    }
    if (filter.customerId) {
      data = data.filter(t => t.customerId === filter.customerId);
    }
    if (filter.search) {
      const s = filter.search.toLowerCase();
      data = data.filter(t =>
        t.id.toLowerCase().includes(s) ||
        t.counterparty.toLowerCase().includes(s) ||
        getCustomerName(t.customerId).toLowerCase().includes(s)
      );
    }

    if (filter.sortKey) {
      const dir = filter.sortDir === 'desc' ? -1 : 1;
      data.sort((a, b) => {
        const va = a[filter.sortKey];
        const vb = b[filter.sortKey];
        if (typeof va === 'number') return (va - vb) * dir;
        return String(va).localeCompare(String(vb)) * dir;
      });
    } else {
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    const tbody = document.querySelector('#transactionsTable tbody');

    if (data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="9" class="no-results">No transactions match the selected filters.</td></tr>';
      return;
    }

    tbody.innerHTML = data.map(t => {
      const riskClass = getRiskClass(t.riskScore);
      return `
        <tr>
          <td>${escapeHtml(t.id)}</td>
          <td>${formatDate(t.date)}</td>
          <td><a href="#" class="customer-link" data-customer="${escapeHtml(t.customerId)}">${escapeHtml(getCustomerName(t.customerId))}</a></td>
          <td>${formatCurrency(t.amount, t.currency)}</td>
          <td>${escapeHtml(t.type)}</td>
          <td><span class="direction-badge direction-badge--${t.direction}">${t.direction === 'Incoming' ? '↓' : '↑'} ${escapeHtml(t.direction)}</span></td>
          <td>${escapeHtml(t.counterparty)}<br><small style="color:var(--text-muted)">${escapeHtml(t.counterpartyCountry)}</small></td>
          <td>
            <span class="risk-badge risk-badge--${riskClass}">${t.riskScore}</span>
          </td>
          <td>
            <div class="flag-tags">
              ${t.flags.map(f => `<span class="flag-tag">${escapeHtml(f)}</span>`).join('')}
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // --- Alerts Table ---
  function renderAlertsTable(filter = {}) {
    let data = [...ALERTS];

    if (filter.severity && filter.severity !== 'all') {
      data = data.filter(a => a.severity === filter.severity);
    }
    if (filter.status && filter.status !== 'all') {
      data = data.filter(a => a.status === filter.status);
    }
    if (filter.search) {
      const s = filter.search.toLowerCase();
      data = data.filter(a =>
        a.id.toLowerCase().includes(s) ||
        a.message.toLowerCase().includes(s) ||
        getCustomerName(a.customerId).toLowerCase().includes(s)
      );
    }

    if (filter.sortKey) {
      const dir = filter.sortDir === 'desc' ? -1 : 1;
      const severityOrder = { Critical: 4, High: 3, Medium: 2, Low: 1 };
      data.sort((a, b) => {
        let va = a[filter.sortKey];
        let vb = b[filter.sortKey];
        if (filter.sortKey === 'severity') {
          va = severityOrder[va] || 0;
          vb = severityOrder[vb] || 0;
          return (va - vb) * dir;
        }
        return String(va).localeCompare(String(vb)) * dir;
      });
    } else {
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    const tbody = document.querySelector('#alertsTable tbody');

    if (data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" class="no-results">No alerts match the selected filters.</td></tr>';
      return;
    }

    tbody.innerHTML = data.map(a => `
      <tr>
        <td>${escapeHtml(a.id)}</td>
        <td><span class="severity-badge severity-badge--${escapeHtml(a.severity)}">${escapeHtml(a.severity)}</span></td>
        <td>${escapeHtml(a.type)}</td>
        <td><a href="#" class="customer-link" data-customer="${escapeHtml(a.customerId)}">${escapeHtml(getCustomerName(a.customerId))}</a></td>
        <td>${escapeHtml(a.message)}</td>
        <td>${formatDate(a.date)}</td>
        <td><span class="status-badge status-badge--${a.status.replace(/\s/g, '-')}">${escapeHtml(a.status)}</span></td>
        <td>
          ${a.status !== 'Resolved' ? `<button class="btn btn--sm btn--primary resolve-alert" data-alert="${escapeHtml(a.id)}">Resolve</button>` : '<span style="color:var(--text-muted)">—</span>'}
        </td>
      </tr>
    `).join('');
  }

  // --- Customer Detail Modal ---
  function openCustomerModal(customerId) {
    const customer = CUSTOMERS.find(c => c.id === customerId);
    if (!customer) return;

    const modal = document.getElementById('customerModal');
    document.getElementById('modalCustomerName').textContent = customer.name;

    // Detail grid
    const details = document.getElementById('modalCustomerDetails');
    const riskClass = getRiskClass(customer.riskScore);
    details.innerHTML = `
      <div class="detail-item">
        <span class="detail-label">Customer ID</span>
        <span class="detail-value">${escapeHtml(customer.id)}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Type</span>
        <span class="detail-value">${escapeHtml(customer.type)}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Country</span>
        <span class="detail-value">${escapeHtml(customer.country)}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Risk Score</span>
        <span class="detail-value"><span class="risk-badge risk-badge--${riskClass}">${customer.riskScore} · ${getRiskLabel(customer.riskScore)}</span></span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Account Opened</span>
        <span class="detail-value">${formatDate(customer.accountOpenDate)}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Last KYC Review</span>
        <span class="detail-value">${formatDate(customer.lastReviewDate)}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">KYC Status</span>
        <span class="detail-value"><span class="kyc-badge kyc-badge--${customer.kycStatus.replace(/\s/g, '-')}">${escapeHtml(customer.kycStatus)}</span></span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Total Balance</span>
        <span class="detail-value">${formatCurrency(customer.totalBalance, customer.currency)}</span>
      </div>
      ${customer.pep ? '<div class="detail-item"><span class="detail-label">PEP Status</span><span class="detail-value"><span class="flag-icon flag-icon--pep">Politically Exposed Person</span></span></div>' : ''}
      ${customer.sanctioned ? '<div class="detail-item"><span class="detail-label">Sanctions</span><span class="detail-value"><span class="flag-icon flag-icon--sanctioned">SANCTIONED</span></span></div>' : ''}
    `;

    // Risk Gauge
    drawRiskGauge(customer.riskScore);

    // Transactions
    const txns = TRANSACTIONS.filter(t => t.customerId === customerId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    const txnBody = document.querySelector('#modalTransactionsTable tbody');
    txnBody.innerHTML = txns.map(t => {
      const rc = getRiskClass(t.riskScore);
      return `
        <tr>
          <td>${escapeHtml(t.id)}</td>
          <td>${formatDate(t.date)}</td>
          <td>${formatCurrency(t.amount, t.currency)}</td>
          <td>${escapeHtml(t.type)}</td>
          <td>${escapeHtml(t.counterparty)}<br><small style="color:var(--text-muted)">${escapeHtml(t.counterpartyCountry)}</small></td>
          <td><span class="risk-badge risk-badge--${rc}">${t.riskScore}</span></td>
          <td><div class="flag-tags">${t.flags.map(f => `<span class="flag-tag">${escapeHtml(f)}</span>`).join('')}</div></td>
        </tr>
      `;
    }).join('');

    // Alerts
    const alerts = ALERTS.filter(a => a.customerId === customerId);
    const alertsEl = document.getElementById('modalAlerts');
    if (alerts.length === 0) {
      alertsEl.innerHTML = '<p style="color:var(--text-muted);font-size:0.85rem;">No active alerts for this customer.</p>';
    } else {
      alertsEl.innerHTML = alerts.map(a => `
        <div class="alert-card alert-card--${escapeHtml(a.severity)}">
          <span class="severity-badge severity-badge--${escapeHtml(a.severity)}">${escapeHtml(a.severity)}</span>
          <div class="alert-card-content">
            <div class="alert-card-type">${escapeHtml(a.type)} <span class="status-badge status-badge--${a.status.replace(/\s/g, '-')}" style="margin-left:8px;">${escapeHtml(a.status)}</span></div>
            <div class="alert-card-msg">${escapeHtml(a.message)}</div>
          </div>
        </div>
      `).join('');
    }

    modal.classList.add('active');
  }

  function drawRiskGauge(score) {
    const canvas = document.getElementById('modalRiskGauge');
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h - 10;
    const radius = 80;

    ctx.clearRect(0, 0, w, h);

    // Background arc
    ctx.beginPath();
    ctx.arc(cx, cy, radius, Math.PI, 0, false);
    ctx.lineWidth = 16;
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.stroke();

    // Score arc
    const angle = Math.PI + (score / 100) * Math.PI;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, Math.PI, angle, false);
    ctx.lineWidth = 16;
    ctx.lineCap = 'round';
    ctx.strokeStyle = getRiskColor(score);
    ctx.stroke();

    // Score text
    ctx.fillStyle = getRiskColor(score);
    ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(score, cx, cy - 20);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(getRiskLabel(score) + ' Risk', cx, cy - 2);
  }

  // Close modal
  document.getElementById('modalClose').addEventListener('click', () => {
    document.getElementById('customerModal').classList.remove('active');
  });

  document.getElementById('customerModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
      e.currentTarget.classList.remove('active');
    }
  });

  // Modal actions (demo)
  document.getElementById('modalEscalate').addEventListener('click', () => {
    alert('Alert escalated to compliance team (demo).');
  });

  document.getElementById('modalApprove').addEventListener('click', () => {
    alert('Customer marked as reviewed (demo).');
    document.getElementById('customerModal').classList.remove('active');
  });

  // --- Customer links (event delegation) ---
  document.addEventListener('click', (e) => {
    const link = e.target.closest('.customer-link');
    if (link) {
      e.preventDefault();
      const customerId = link.dataset.customer;
      if (customerId) openCustomerModal(customerId);
    }

    const resolveBtn = e.target.closest('.resolve-alert');
    if (resolveBtn) {
      const alertId = resolveBtn.dataset.alert;
      const alert = ALERTS.find(a => a.id === alertId);
      if (alert) {
        alert.status = 'Resolved';
        renderAlertsTable(getCurrentAlertFilters());
        renderRecentAlerts();
        renderKPIs();
      }
    }
  });

  // --- Filter Handlers ---
  let customerSort = { key: null, dir: 'asc' };
  let transactionSort = { key: null, dir: 'asc' };
  let alertSort = { key: null, dir: 'asc' };

  function getCurrentCustomerFilters() {
    return {
      risk: document.getElementById('customerRiskFilter').value,
      type: document.getElementById('customerTypeFilter').value,
      kyc: document.getElementById('customerKycFilter').value,
      search: globalSearch.value,
      sortKey: customerSort.key,
      sortDir: customerSort.dir
    };
  }

  function getCurrentTxnFilters() {
    return {
      risk: document.getElementById('txnRiskFilter').value,
      direction: document.getElementById('txnDirectionFilter').value,
      flaggedOnly: document.getElementById('txnFlaggedFilter').checked,
      search: globalSearch.value,
      sortKey: transactionSort.key,
      sortDir: transactionSort.dir
    };
  }

  function getCurrentAlertFilters() {
    return {
      severity: document.getElementById('alertSeverityFilter').value,
      status: document.getElementById('alertStatusFilter').value,
      search: globalSearch.value,
      sortKey: alertSort.key,
      sortDir: alertSort.dir
    };
  }

  // Customer filters
  ['customerRiskFilter', 'customerTypeFilter', 'customerKycFilter'].forEach(id => {
    document.getElementById(id).addEventListener('change', () => {
      renderCustomersTable(getCurrentCustomerFilters());
    });
  });

  // Transaction filters
  ['txnRiskFilter', 'txnDirectionFilter'].forEach(id => {
    document.getElementById(id).addEventListener('change', () => {
      renderTransactionsTable(getCurrentTxnFilters());
    });
  });
  document.getElementById('txnFlaggedFilter').addEventListener('change', () => {
    renderTransactionsTable(getCurrentTxnFilters());
  });

  // Alert filters
  ['alertSeverityFilter', 'alertStatusFilter'].forEach(id => {
    document.getElementById(id).addEventListener('change', () => {
      renderAlertsTable(getCurrentAlertFilters());
    });
  });

  // Global search
  globalSearch.addEventListener('input', () => {
    const activeView = document.querySelector('.view.active');
    if (activeView.id === 'customersView') renderCustomersTable(getCurrentCustomerFilters());
    else if (activeView.id === 'transactionsView') renderTransactionsTable(getCurrentTxnFilters());
    else if (activeView.id === 'alertsView') renderAlertsTable(getCurrentAlertFilters());
  });

  // --- Sortable table headers ---
  function setupSortableHeaders(tableId, sortState, renderFn, getFiltersFn) {
    document.querySelectorAll(`#${tableId} th[data-sort]`).forEach(th => {
      th.addEventListener('click', () => {
        const key = th.dataset.sort;
        if (sortState.key === key) {
          sortState.dir = sortState.dir === 'asc' ? 'desc' : 'asc';
        } else {
          sortState.key = key;
          sortState.dir = 'asc';
        }

        // Update header classes
        document.querySelectorAll(`#${tableId} th`).forEach(h => {
          h.classList.remove('sort-asc', 'sort-desc');
        });
        th.classList.add(sortState.dir === 'asc' ? 'sort-asc' : 'sort-desc');

        renderFn(getFiltersFn());
      });
    });
  }

  setupSortableHeaders('customersTable', customerSort, renderCustomersTable, getCurrentCustomerFilters);
  setupSortableHeaders('transactionsTable', transactionSort, renderTransactionsTable, getCurrentTxnFilters);
  setupSortableHeaders('alertsTable', alertSort, renderAlertsTable, getCurrentAlertFilters);

  // --- Initialize ---
  // Transform raw transaction data and render all views
  loadData();
  renderKPIs();
  renderCharts();
  renderRecentAlerts();
  renderCustomersTable();
  renderTransactionsTable();
  renderAlertsTable();

})();
