# AgDR Template

Use this template when documenting AI agent decisions.

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

## Field Reference

### Metadata Fields

| Field | Required | Description |
|-------|----------|-------------|
| `id` | Yes | Format: `AgDR-NNNN` (zero-padded, e.g., `AgDR-0001`) |
| `timestamp` | Yes | ISO-8601 format with timezone: `2026-01-30T18:45:00Z` |
| `agent` | Yes | Identifier for the AI agent: `claude-code`, `copilot`, `cursor`, `windsurf` |
| `model` | Yes | Specific model used: `claude-opus-4-5-20251101`, `gpt-4-turbo` |
| `session` | No | Session identifier if available (for traceability) |
| `trigger` | Yes | What initiated: `user-prompt`, `hook`, `automation` |
| `status` | Yes | Current state: `proposed`, `executed`, `superseded`, `deprecated` |
| `supersedes` | No | ID of AgDR this replaces (if any) |

### Status Values

| Status | Meaning |
|--------|---------|
| `proposed` | Decision documented but not yet implemented |
| `executed` | Decision made and implemented |
| `superseded` | Replaced by a newer AgDR (link in `supersedes`) |
| `deprecated` | No longer valid, not replaced |

### Trigger Values

| Trigger | When Used |
|---------|-----------|
| `user-prompt` | User explicitly asked to make a decision |
| `hook` | Pre-commit or CI hook detected a decision |
| `automation` | Automated pipeline triggered the decision |
| `self-initiated` | Agent proactively documented during coding |

## Naming Convention

File name format: `AgDR-{NNNN}-{slug}.md`

- `NNNN`: Zero-padded number (0001, 0002, ...)
- `slug`: Lowercase, hyphenated summary (max 50 chars)

Examples:
- `AgDR-0001-use-vitest-for-testing.md`
- `AgDR-0002-jwt-for-authentication.md`
- `AgDR-0015-postgres-over-mysql.md`

## The Y-Statement

The Y-statement is a one-line summary that captures the essence of the decision:

```
In the context of [situation],
facing [concern],
I decided [decision]
to achieve [goal],
accepting [tradeoff].
```

### Examples

**Good:**
> In the context of a React Native app, facing slow list rendering with 1000+ items, I decided to use FlashList to achieve 60fps scrolling, accepting the learning curve of a new API.

**Too vague:**
> In the context of our app, facing performance issues, I decided to use a better library to achieve better performance, accepting some tradeoffs.

## Tips for Writing Good AgDRs

1. **Be specific** - "3x faster" beats "much faster"
2. **List real options** - Don't create strawman alternatives
3. **Justify with evidence** - Benchmarks, docs, team experience
4. **Own the tradeoffs** - Every decision has downsides
5. **Keep it brief** - If it's too long, the decision might be too big
6. **Link artifacts** - Connect to PRs, commits, issues
