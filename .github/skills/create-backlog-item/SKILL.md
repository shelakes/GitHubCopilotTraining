---
name: create-backlog-item
description: >
  Produces a structured backlog item from a raw task. Ensures every item has
  a consistent format with title, description, acceptance criteria, TDD plan,
  file-scope estimate, and definition of done — regardless of which agent
  creates it.
---

# Skill: Create Backlog Item

When producing a backlog item, **always** load and fill in the template at
[backlog-item-template.md](backlog-item-template.md). Do not omit sections
or invent new ones.

## Rules

1. **Title** must be action-oriented (starts with a verb): "Implement …", "Add …", "Fix …", "Refactor …".
2. **Size** must reflect the scoped work. If estimated size exceeds L, split into smaller items.
3. **Acceptance Criteria** use checkbox syntax so they can be tracked in markdown.
4. **TDD Requirements** table must map 1-to-1 to acceptance criteria at minimum, plus edge cases.
5. **Blocked by** must reference concrete item IDs, not vague descriptions.
6. **Assigned agent** must be one of the project's domain specialist agents — never the PM agent itself.
7. **Domain** must match one of the project's defined domains.
8. **Files in Scope** must list exact file paths relative to the project root.
