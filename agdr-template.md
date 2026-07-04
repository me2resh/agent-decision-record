# AgDR Template

Use this template when documenting AI agent decisions. For the normative rules behind every field and section below — required vs. optional, enum values, body-structure requirements — see [SPEC.md](SPEC.md), the single source of truth. This file exists to give you copy-pasteable starting points.

## Full Template

```markdown
---
id: AgDR-{NNNN}
timestamp: {YYYY-MM-DDTHH:MM:SSZ}
agent: {agent-name}
model: {model-id}
session: {session-id-if-available}
trigger: {user-prompt | hook | automation}
status: {proposed | executed | superseded}
supersedes: {AgDR-XXXX if replacing another}
---

# {Short descriptive title}

> In the context of {situation/context}, facing {concern/problem}, I decided {decision} to achieve {goal/benefit}, accepting {tradeoff/downside}.

## Context

{2-4 bullet points of decision-relevant context only}

- What problem are we solving?
- What constraints exist?
- What's the current state?

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| Option A | Pro 1, Pro 2 | Con 1, Con 2 |
| Option B | Pro 1, Pro 2 | Con 1, Con 2 |
| Option C | Pro 1, Pro 2 | Con 1, Con 2 |

## Decision

Chosen: **{Option}**, because {justification with specific reasoning}.

## Consequences

- {Positive consequence 1}
- {Positive consequence 2}
- {Negative consequence / tradeoff}

## Artifacts

- {Link to PR, commit, or related code}
- {Link to related AgDRs}
```

## Short Template

For simpler decisions:

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

## Field Reference, Naming, and the Y-Statement

These are normative rules, not template-specific advice — see [SPEC.md](SPEC.md) for:

- [§1 File location and naming](SPEC.md#1-file-location-and-naming) — the `AgDR-{NNNN}-{slug}.md` convention
- [§2 Frontmatter fields](SPEC.md#2-frontmatter-fields) — required vs. optional, with the `trigger` and `status` enums
- [§5 Body structure](SPEC.md#5-body-structure) and [§6 The Y-statement, good vs. too vague](SPEC.md#6-the-y-statement-good-vs-too-vague)

## When to Use the Short Template

Use the short template when:
- Only 2-3 options were considered
- Context is already well understood
- Consequences are straightforward
- No related artifacts to link

Use the full template for complex decisions with multiple stakeholders or significant consequences.

## Tips for Writing Good AgDRs

1. **Be specific** - "3x faster" beats "much faster"
2. **List real options** - Don't create strawman alternatives
3. **Justify with evidence** - Benchmarks, docs, team experience
4. **Own the tradeoffs** - Every decision has downsides
5. **Keep it brief** - If it's too long, the decision might be too big
6. **Link artifacts** - Connect to PRs, commits, issues
