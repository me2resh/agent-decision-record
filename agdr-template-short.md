# AgDR Short Template

A minimal template for straightforward decisions.

```markdown
---
id: AgDR-{NNNN}
timestamp: {YYYY-MM-DDTHH:MM:SSZ}
agent: {agent-name}
model: {model-id}
trigger: {trigger}
status: executed
---

# {Title}

> In the context of {context}, facing {concern}, I decided {decision} to achieve {goal}, accepting {tradeoff}.

## Options Considered
| Option | Pros | Cons |
|--------|------|------|
| A | ... | ... |
| B | ... | ... |

## Decision
Chosen: **{Option}**, because {justification}.
```

## When to Use

Use the short template when:
- Only 2-3 options were considered
- Context is already well understood
- Consequences are straightforward
- No related artifacts to link

Use the [full template](agdr-template.md) for complex decisions with multiple stakeholders or significant consequences.
