# AgDR Specification

This is the **single normative reference** for the Agent Decision Record (AgDR) format. `README.md`, `agdr-template.md`, and every integration under `tools/` link back here for the rules — they no longer restate them. If you're looking for the copy-pasteable template itself, see [agdr-template.md](agdr-template.md); if you're looking for real examples, see [examples/](examples/).

The key words **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** in this document follow their [RFC 2119](https://www.ietf.org/rfc/rfc2119.txt) meaning.

This spec is machine-checkable: [`schema/agdr.schema.json`](schema/agdr.schema.json) encodes the frontmatter rules below, and [`scripts/validate-agdr.js`](scripts/validate-agdr.js) enforces the frontmatter schema plus the body-structure rules that a JSON Schema can't express (Y-statement shape, required headings, filename/id consistency, cross-file id uniqueness). CI runs the same validator on every PR — see [.github/workflows/validate-agdr.yml](.github/workflows/validate-agdr.yml).

## 1. File location and naming

- An AgDR MUST be stored per-project at `docs/agdr/AgDR-{NNNN}-{slug}.md` (not centralized — decisions travel with the code they affect).
- `{NNNN}` MUST be a zero-padded, monotonically increasing integer, unique within the project (`0001`, `0002`, …).
- `{slug}` MUST be a lowercase, hyphenated summary, 50 characters or fewer.
- The `id` frontmatter field MUST match the file's `AgDR-{NNNN}` prefix.

Examples: `AgDR-0001-use-vitest-for-testing.md`, `AgDR-0015-postgres-over-mysql.md`.

## 2. Frontmatter fields

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `id` | MUST | `AgDR-NNNN` | Matches the filename (§1). |
| `timestamp` | MUST | ISO-8601 with time and timezone | e.g. `2026-01-30T18:45:00Z`. |
| `agent` | MUST | string | The AI agent that made the decision, e.g. `claude-code`, `codex`, `copilot`, `cursor`, `windsurf`. Not restricted to a fixed list — name the tool you used. |
| `model` | MUST | string | The specific model used, e.g. `claude-opus-4-5-20251101`, `gpt-4-turbo`. Record the model actually in use at decision time; don't leave a placeholder in a real, committed AgDR. |
| `session` | SHOULD | string | Session identifier, when your tooling exposes one — improves traceability. |
| `trigger` | MUST | enum | One of: `user-prompt`, `hook`, `automation`, `self-initiated` (see §3). |
| `status` | MUST | enum | One of: `proposed`, `executed`, `superseded`, `deprecated` (see §4). |
| `supersedes` | MAY | `AgDR-NNNN` | ID of the AgDR this one replaces, when `status: superseded` applies to the *other* record. |

### 3. `trigger` values

| Trigger | When used |
|---------|-----------|
| `user-prompt` | The user explicitly asked the agent to make a decision. |
| `hook` | A pre-commit or CI hook detected a decision pattern. |
| `automation` | An automated pipeline triggered the decision. |
| `self-initiated` | The agent proactively documented a decision while coding, unprompted. |

### 4. `status` values

| Status | Meaning |
|--------|---------|
| `proposed` | Decision documented but not yet implemented. |
| `executed` | Decision made and implemented. |
| `superseded` | Replaced by a newer AgDR (link it via `supersedes` on the newer record). |
| `deprecated` | No longer valid, and not replaced by anything. |

## 5. Body structure

An AgDR body MUST contain:

1. **A title** (`# {Short descriptive title}`) — the first line after frontmatter.
2. **A Y-statement** — a single blockquote line immediately under the title, in the exact shape:

   > In the context of **{situation}**, facing **{concern}**, I decided **{decision}** to achieve **{goal}**, accepting **{tradeoff}**.

   Every clause MUST be filled in with something specific. "I decided to use a better library to achieve better performance, accepting some tradeoffs" is not a Y-statement — it's a sentence-shaped placeholder. See §6 for a good/bad pair.
3. **`## Options Considered`** — a table of at least 2 real options with pros and cons. Don't create strawman alternatives you never seriously considered.
4. **`## Decision`** — the chosen option, with a `because …` justification giving specific reasoning (benchmarks, docs, team experience — not "it's better").

An AgDR SHOULD also contain, when there's substance to put in them:

- **`## Context`** — 2-4 bullets of decision-relevant context only (the problem, the constraints, the current state). Omit anything that doesn't inform the choice.
- **`## Consequences`** — the positive outcomes AND at least one real tradeoff. Every decision has downsides; name yours.
- **`## Artifacts`** — links to the PR, commit, or related AgDRs.

Use the [full template](agdr-template.md) when Context/Consequences/Artifacts earn their place; use the [short template](agdr-template.md#short-template) when they don't (see agdr-template.md for the "when to use short" guidance).

## 6. The Y-statement, good vs. too vague

**Good** — every clause is concrete and falsifiable:

> In the context of a React Native app, facing slow list rendering with 1000+ items, I decided to use FlashList to achieve 60fps scrolling, accepting the learning curve of a new API.

**Too vague** — grammatically a Y-statement, but every clause is a placeholder in disguise:

> In the context of our app, facing performance issues, I decided to use a better library to achieve better performance, accepting some tradeoffs.

## 7. When to create an AgDR

Create one when the agent:

| Trigger situation | Example |
|---------|---------|
| Compares options | "Should we use X or Y?" |
| Chooses a library | Adding a new dependency |
| Selects a pattern | "Let's use the repository pattern" |
| Makes an architecture choice | "I'll structure this as microservices" |
| Picks a convention | "We'll use kebab-case for file names" |

Don't create one for trivial choices (variable names, formatting), for following an existing project convention, or for a bug fix with an obvious, undebatable solution.

## 8. Non-normative guidance

The following are style advice, not requirements the validator enforces:

- Be specific ("3x faster" beats "much faster").
- Justify with evidence (benchmarks, docs, team experience) over assertion.
- Keep it brief — if the AgDR is sprawling, the decision it documents might be too big for one record.
- Link artifacts — connect the record to the PR, commit, or issue that carried it out.

## Change history

Substantive changes to this spec (new required fields, new enum values, tightened body requirements) are breaking for existing validators and MUST be logged in [CHANGELOG.md](CHANGELOG.md).
