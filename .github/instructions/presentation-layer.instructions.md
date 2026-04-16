---
name: Presentation Layer Domain
description: Patterns for component rendering, DOM manipulation, state management, and user interactions
type: instructions
applyTo: "index.html, js/app.js, css/**"
---

# Presentation Layer Domain

**Glob pattern**: `index.html`, `js/app.js` (rendering functions), `css/**`

**Key concerns**: XSS prevention, accessibility, performance (DOM thrashing), event handling efficiency, responsive design, visual consistency.

---

## What to Always Do

### 1. HTML Escaping & Safe Rendering
- **Always escape user input and dynamic data** before rendering:
  ```javascript
  const html = `<span>${escapeHtml(user.name)}</span>`;  // ✓ Safe
  ```
- Use `escapeHtml()` for all customer names, transaction IDs, messages, and descriptions.
- For Chart.js and canvas elements, ensure labels are also escaped if they come from data.
- Use `textContent` instead of `innerHTML` when rendering plain text (no markup needed).

### 2. Event Delegation
- **Use event delegation for dynamically generated content** to avoid memory leaks:
  ```javascript
  document.addEventListener('click', (e) => {
    const link = e.target.closest('.customer-link');
    if (link) handleCustomerClick(link.dataset.customer);
  });
  ```
- This pattern eliminates the need to re-attach listeners when tables are re-rendered.
- Document event delegation rules in your table/list rendering functions.

### 3. Component State Management
- **Keep component state (`filter`, `sort`, `view`) predictable and centralized**:
  - Use objects like `{ key: 'riskScore', dir: 'desc' }` for sort state.
  - Pass state through function parameters rather than storing in multiple places.
  - Update state and re-render in the same function call to prevent stale UI.

### 4. Reusable Rendering Functions
- **Create helper functions for repeated patterns** (tables, cards, badges):
  ```javascript
  function renderRiskBadge(score) {
    const riskClass = getRiskClass(score);
    return `<span class="risk-badge risk-badge--${riskClass}">${score}</span>`;
  }
  ```
- Keeps markup consistent and reduces duplication across views.

### 5. Responsive Design
- Ensure modal/sidebar/layout adapts to viewport size (mobile <= 768px).
- Test that filter dropdowns and search bars remain usable on small screens.
- Use CSS variables for spacing and colors; avoid hardcoding pixel values.

### 6. Accessibility (a11y)
- Use semantic HTML: `<button>`, `<a>`, `<table>`, `<label>` instead of `<div>` when possible.
- Provide `aria-labels` on icon buttons and regions.
- Ensure color is not the only way to convey information (use text labels alongside risk color badges).
- Keyboard navigation: tabs should navigate through interactive elements in logical order.

### 7. Consistent Styling & Visual Hierarchy
- Use CSS classes from the theme (`--text-primary`, `--bg-secondary`, `--color-critical`, etc.).
- Follow existing badge/button/input styles; do not introduce new components without design review.
- Colors have semantic meaning: Red = Critical/High Risk, Yellow = Medium, Green = Low. Maintain this consistently.

---

## What to Never Do

### 1. Anti-Pattern: Direct String Concatenation for HTML
- ❌ **Do NOT** build HTML with string concatenation without escaping:
  ```javascript
  // ❌ DANGEROUS - XSS vulnerability
  const html = `<span>${user.name}</span>`;
  // ✓ SAFE
  const html = `<span>${escapeHtml(user.name)}</span>`;
  ```
- **Why**: User names may contain `<script>` or `"onclick="` attributes that execute.
- **Fix**: Always use `escapeHtml()` or `textContent`.

### 2. Anti-Pattern: DOM Queries in Loops
- ❌ Do NOT query the DOM repeatedly inside loops:
  ```javascript
  // ❌ SLOW - querySelector called 1000 times
  for (let i = 0; i < 1000; i++) {
    const el = document.querySelector('.row-' + i);
    el.innerHTML = data[i];
  }
  // ✓ FAST - build HTML string first, then insert once
  const html = data.map(d => `<div>${escapeHtml(d)}</div>`).join('');
  document.getElementById('container').innerHTML = html;
  ```
- **Why**: DOM queries are expensive; batch updates avoid reflows.
- **Fix**: Build HTML in memory, then insert once.

### 3. Anti-Pattern: Storing UI State in the DOM
- ❌ Do NOT rely on `element.classList.contains('sorted')` as source of truth:
  ```javascript
  // ❌ BAD - state in DOM
  if (header.classList.contains('sort-desc')) { /* reverse */ }
  // ✓ GOOD - state in JS object
  if (sortState.dir === 'desc') { /* reverse */ }
  ```
- **Why**: DOM state gets out of sync with data during re-renders.
- **Fix**: Keep state in JavaScript objects; use DOM only for display.

### 4. Anti-Pattern: Inline Event Handlers & Dynamic Attributes
- ❌ Do NOT dynamically build `onclick` attributes:
  ```javascript
  // ❌ UNSAFE - event handler as string
  html += `<button onclick="deleteAlert('${alertId}')">Delete</button>`;
  // ✓ SAFE - use event delegation with data attributes
  html += `<button class="delete-alert" data-alert="${escapeHtml(alertId)}">Delete</button>`;
  ```
- **Why**: Inline handlers are XSS vectors; data attributes are safer and re-delegate correctly.
- **Fix**: Use event delegation with `data-*` attributes.

### 5. Anti-Pattern: Global UI Variables
- ❌ Do NOT store component state in globals:
  ```javascript
  // ❌ BAD
  let currentFilter = 'all'; // global
  let selectedCustomer = null; // global
  ```
- **Why**: Global variables are hard to track and cause bugs in complex UIs.
- **Fix**: Pass state through function parameters or encapsulate in an object.

### 6. Anti-Pattern: Unnecessary Re-renders
- ❌ Do NOT re-render the entire dashboard when only one filter changes.
- **Why**: Performance; flashing; potential loss of user focus/scroll position.
- **Fix**: Re-render only the affected table/view.

### 7. Anti-Pattern: Hardcoded Colors & Spacing
- ❌ Do NOT use `style="color:red; margin:10px;"` inline.
- **Why**: Makes theming and maintenance impossible.
- **Fix**: Use CSS classes and CSS variables:
  ```html
  <span class="risk-badge risk-badge--critical">Critical</span>
  ```

---

## DOM Structure & Class Naming Conventions

### BEM (Block-Element-Modifier) Classes
Use BEM for consistent, predictable CSS selectors:
```html
<!-- Block: risk-badge -->
<span class="risk-badge risk-badge--critical">Critical</span>

<!-- Block: customer-link -->
<a href="#" class="customer-link" data-customer="C123">View</a>

<!-- Block: filter-group, Element: select -->
<div class="filter-group">
  <select id="customerRiskFilter" class="filter-group__select">...</select>
</div>
```

### Data Attributes for JavaScript
Use `data-*` attributes for selectors and state:
```html
<button class="resolve-alert" data-alert="ALT_001">Resolve</button>
<tr data-customer="C123" data-risk-score="75">...</tr>
```

---

## Performance Guidelines

### 1. Table Rendering
- For tables with >100 rows, consider lazy-loading or pagination.
- Update one table at a time; avoid re-rendering all views on single filter change.
- Cache column headers and footer DOM references to avoid repeated queries.

### 2. Chart Updates
- Chart.js charts destroy and recreate on every data change. Cache chart instances in a `charts` object.
- Only call `.destroy()` and recreate charts when the dataset fundamentally changes, not on view switch.

### 3. Search/Filter Debouncing
- Debounce search input by 200–300ms before re-rendering:
  ```javascript
  let searchTimeout;
  globalSearch.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => renderTables(filters), 300);
  });
  ```

---

## XSS Prevention Checklist

- [ ] All user input (search, names, IDs) is passed through `escapeHtml()` before rendering.
- [ ] No `innerHTML` assignments with unsanitized data; use `textContent` when possible.
- [ ] No inline event handlers (`onclick=`, `onerror=`); use event delegation.
- [ ] No `eval()` or `Function()` constructors with user input.
- [ ] Data attributes (`data-*`) are sanitized if they contain user input.
- [ ] Modal content is escaped before display.
- [ ] Chart labels from data are escaped.
