---
trigger: always_on
description: Agent Decision Records - enforces structured documentation of technical decisions before implementation
---

# Agent Decision Records (AgDR)

Forces structured documentation of technical decisions made during AI-assisted coding. Creates auditable records at `docs/agdr/` for every non-trivial choice.

Reference: https://github.com/me2resh/agent-decision-record

## Decision Detection

Before writing any code, scan your planned response for these patterns. If any match, STOP and document the decision first:

- "I'll use X" or "Let's go with X"
- Comparing "X vs Y" or "X or Y"
- Choosing a library, framework, or tool
- Picking an implementation approach
- Making an architectural choice
- Adding a new dependency

**Test:** If someone asked "why did you choose X over Y?" and you'd need to explain trade-offs, that's a decision. Document it.

## When to Create an AgDR

- Library/framework selection
- Architecture pattern choice
- Database/schema design decisions
- API design decisions
- Infrastructure choices
- Testing strategy decisions
- Any choice between 2+ viable alternatives

## When NOT to Create

- Trivial choices (variable names, formatting)
- Following existing project conventions
- Bug fixes with a single obvious solution

## Workflow

1. Detect decision point in your response
2. STOP — don't write implementation code yet
3. Present options to user with pros/cons table
4. Get confirmation on the choice
5. Create the AgDR file at `docs/agdr/AgDR-{NNNN}-{slug}.md`
6. Then proceed with implementation

## Template

```markdown
---
id: AgDR-{NNNN}
timestamp: {YYYY-MM-DDTHH:MM:SSZ}
agent: windsurf
model: {model-id}
trigger: user-prompt
status: executed
---

# {Short descriptive title}

> In the context of {situation}, facing {concern}, I decided {decision} to achieve {goal}, accepting {tradeoff}.

## Context
- {What problem are we solving?}
- {What constraints exist?}

## Options Considered
| Option | Pros | Cons |
|--------|------|------|
| **Option A** | Pro 1, Pro 2 | Con 1, Con 2 |
| **Option B** | Pro 1, Pro 2 | Con 1, Con 2 |

## Decision
Chosen: **{Option}**, because {specific justification}.

## Consequences
- {What changes as a result}
- {What tradeoffs we accept}
```

## Rules

1. ALWAYS create AgDR BEFORE implementing the decision
2. Compare at least 2 real options (no strawmen)
3. Y-statement summary is required (the blockquote line)
4. "because" clause is mandatory in the Decision section
5. Be specific — "3x faster" beats "much faster"
6. Document real tradeoffs — every decision has downsides
7. Create `docs/agdr/` directory if it doesn't exist
