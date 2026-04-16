# Skill: Create Backlog Item

Use this template whenever producing a backlog item. Every item must follow this exact structure. Do not omit sections or invent new ones.

## Template

```markdown
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

### Out of Scope
- Bullet list of things this item explicitly does NOT cover (to prevent scope creep).

### Notes
Optional context, links to BLUEPRINT.md sections, or cross-references to related items.
```

## Rules

1. **Title** must be action-oriented (starts with a verb): "Implement …", "Add …", "Fix …", "Refactor …".
2. **Size** must reflect the scoped work. If estimated size exceeds L, split into smaller items.
3. **Acceptance Criteria** use checkbox syntax so they can be tracked in markdown.
4. **TDD Requirements** table must map 1-to-1 to acceptance criteria at minimum, plus edge cases.
5. **Blocked by** must reference concrete item IDs, not vague descriptions.
6. **Assigned agent** must be one of the project's domain specialist agents — never the PM agent itself.
7. **Domain** must match one of the project's defined domains.
8. **Files in Scope** must list exact file paths relative to the project root.
