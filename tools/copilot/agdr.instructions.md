---
applyTo: "docs/agdr/**"
---

## Writing Agent Decision Records

When creating or editing AgDR files, follow this format strictly.

Use YAML frontmatter with these required fields: `id`, `timestamp` (ISO-8601), `agent` (copilot), `model`, `trigger` (user-prompt, hook, or automation), `status` (proposed, executed, superseded).

Start with a Y-statement as a blockquote: "In the context of [situation], facing [concern], I decided [decision] to achieve [goal], accepting [tradeoff]."

Include a Context section with 2-4 bullet points of decision-relevant context only.

Include an Options Considered table with at least 2 options, each with Pros and Cons columns.

Include a Decision section starting with "Chosen: **{Option}**, because" followed by specific justification.

Include a Consequences section listing what changes and what tradeoffs are accepted.

File naming: `AgDR-{NNNN}-{slug}.md` where NNNN is zero-padded and slug is lowercase hyphenated (max 50 chars).

Template:

```markdown
---
id: AgDR-{NNNN}
timestamp: {YYYY-MM-DDTHH:MM:SSZ}
agent: copilot
model: {model-id}
trigger: user-prompt
status: executed
---

# {Short descriptive title}

> In the context of {situation}, facing {concern}, I decided {decision} to achieve {goal}, accepting {tradeoff}.

## Context
- {Decision-relevant context}

## Options Considered
| Option | Pros | Cons |
|--------|------|------|
| **Option A** | ... | ... |
| **Option B** | ... | ... |

## Decision
Chosen: **{Option}**, because {justification}.

## Consequences
- {Consequence 1}
- {Consequence 2}
```
