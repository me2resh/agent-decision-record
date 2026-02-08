---
name: agdr-decide
description: Enforce Agent Decision Record (AgDR) workflow in Codex. Use when making a non-trivial technical decision such as selecting libraries/frameworks/tools, choosing implementation patterns, making architecture choices, or resolving explicit comparisons like "X vs Y". Analyze options first, document the decision in docs/agdr/AgDR-NNNN-slug.md, then implement.
---

# AgDR Decision Gate

Follow this process before implementation whenever the decision is non-trivial.

## 1. Parse the Decision Topic

Extract the specific decision from the user request and restate it clearly.
If ambiguous, ask one short clarifying question.

## 2. Gather Decision Context

Collect only context that influences the decision:

- Problem to solve
- Constraints (performance, cost, timeline, team familiarity, platform)
- Relevant current codebase state

Keep context concise (2-5 bullets).

## 3. Compare Real Options

Compare 2-4 realistic options in a table:

| Option | Pros | Cons |
|--------|------|------|
| Option A | ... | ... |
| Option B | ... | ... |

Avoid strawman options.

## 4. Make the Decision

Pick one option and justify with a clear `because` clause.
Acknowledge at least one tradeoff.

## 5. Create the AgDR File

Create `docs/agdr/AgDR-{NNNN}-{slug}.md` with zero-padded IDs.

Determine `{NNNN}` by scanning existing files:

```bash
mkdir -p docs/agdr
last="$(find docs/agdr -maxdepth 1 -name 'AgDR-*.md' 2>/dev/null | sed -E 's|.*AgDR-([0-9]+)-.*|\1|' | sort -n | tail -1)"
if [ -z "$last" ]; then
  next="0001"
else
  next="$(printf "%04d" "$((10#$last + 1))")"
fi
echo "$next"
```

Use this structure:

```markdown
---
id: AgDR-{NNNN}
timestamp: {YYYY-MM-DDTHH:MM:SSZ}
agent: codex
model: {model-id}
session: {session-id-if-available}
trigger: {user-prompt | hook | automation | self-initiated}
status: {proposed | executed | superseded}
---

# {Short descriptive title}

> In the context of {situation}, facing {concern}, I decided {decision} to achieve {goal}, accepting {tradeoff}.

## Context
- ...
- ...

## Options Considered
| Option | Pros | Cons |
|--------|------|------|
| ... | ... | ... |

## Decision
Chosen: **{option}**, because {justification}.

## Consequences
- ...
- ...
- ...

## Artifacts
- {PR/commit/issue links if available}
```

Build a lowercase hyphenated slug from the title and keep it short.

## 6. Continue Implementation

After writing the AgDR, continue with the chosen implementation path.

## Rules

1. Always document non-trivial technical decisions before implementation.
2. Require at least 2 real options.
3. Require the Y-statement.
4. Keep context minimal and decision-focused.
5. Skip AgDR only for trivial choices or strict existing project conventions.
