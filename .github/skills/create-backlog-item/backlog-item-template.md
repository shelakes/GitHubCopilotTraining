## [ITEM-<number>] <Title>

**Domain:** `<data-layer | business-logic | frontend | api-layer>`
**Priority:** `<Critical | High | Medium | Low>`
**Size:** `<XS (< 1 hr) | S (1–2 hr) | M (2–4 hr) | L (4–8 hr)>`
**Blocked by:** <list of ITEM-IDs or "None">
**Assigned agent:** `<data-architect | business-logic | presentation | test>`

### Description
One to three sentences explaining what must be built or changed and why.

### Files in Scope
- `path/to/file.ext` — what changes here

Limit to ≤ 5 files. If more are needed, split into multiple items.

### Acceptance Criteria
- [ ] AC-1: <observable, testable outcome>
- [ ] AC-2: …
- [ ] AC-3: …

Each criterion must be independently verifiable — no subjective language ("looks good", "works well").

### TDD Requirements
Write these tests **before** implementation:

| # | Test description | Expected result |
|---|-----------------|-----------------|
| 1 | … | … |
| 2 | … | … |
| 3 | … | … |

Minimum 3 tests per item. Cover at least: happy path, one boundary/edge case, one negative/error case.

### Definition of Done
- [ ] All acceptance criteria pass
- [ ] All TDD requirements have passing tests
- [ ] No lint or console errors introduced
- [ ] Code reviewed by at least one other agent or human

### Out of Scope
- Bullet list of things this item explicitly does NOT cover (to prevent scope creep).

### Notes
Optional context, links to BLUEPRINT.md sections, or cross-references to related items.
