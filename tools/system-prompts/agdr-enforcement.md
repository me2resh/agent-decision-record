# AgDR System Prompt

Add this to your AI assistant's system prompt or context to enforce AgDR creation.

## Basic Prompt

```
## Technical Decision Documentation

When making technical decisions during coding, you MUST create an Agent Decision Record (AgDR).

### Trigger Patterns - STOP if you catch yourself:
- Saying "I'll use X" or "Let's go with X"
- Comparing "X vs Y" or "X or Y"
- Choosing a library, framework, or tool
- Picking an implementation approach
- Making an architectural choice

### AgDR Format

Create a markdown file at `docs/agdr/AgDR-{NNNN}-{slug}.md`:

```markdown
---
id: AgDR-{NNNN}
timestamp: {ISO-8601}
agent: {your-agent-name}
model: {your-model-id}
trigger: {what triggered this}
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

### Rules
- ALWAYS create AgDR before implementing the decision
- Compare at least 2 real options
- Include specific justification with "because"
- File goes in the project's docs/agdr/ directory
```

## Extended Prompt (with Code Review Integration)

```
## Technical Decision Documentation

[Include basic prompt above, plus:]

### Code Review Integration

When reviewing PRs, check for undocumented decisions:

1. **New dependencies** in package.json, build.gradle, etc.
   → Should have AgDR explaining the choice

2. **New patterns** introduced (repository, factory, etc.)
   → Should have AgDR explaining why this pattern

3. **Architecture changes** (new modules, services, etc.)
   → Should have AgDR documenting the design decision

If AgDR is missing, request it before approving the PR.
```

## Cursor-Specific Prompt

For Cursor AI, add to `.cursorrules`:

```
# AgDR - Agent Decision Records

Before making any technical decision:
1. Create docs/agdr/ directory if it doesn't exist
2. Find the next AgDR number (or start at 0001)
3. Create AgDR-{NNNN}-{slug}.md with the decision

Technical decisions include:
- Library/framework choices
- Architecture patterns
- API design decisions
- Database schema choices
- Authentication approaches

Always document BEFORE implementing.
```

## GitHub Copilot Instructions

For Copilot, add to `.github/copilot-instructions.md`:

```markdown
## Decision Documentation

When suggesting code that involves technical decisions:

1. If choosing between alternatives, note it as a decision point
2. Suggest creating an AgDR at docs/agdr/
3. Include the reasoning in the AgDR, not just code comments

Example decision points:
- "Using axios over fetch because..."
- "Implementing with Redis instead of in-memory cache..."
- "Choosing PostgreSQL over MongoDB..."
```
