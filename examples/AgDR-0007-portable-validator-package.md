---
id: AgDR-0007
timestamp: 2026-09-20T09:00:00Z
agent: codex
model: gpt-6
trigger: user-prompt
status: executed
---

# Publish a portable AgDR validator package

> In the context of the AgDR standard, facing inconsistent validation between repository tooling and future browser or automation clients, I decided to publish a portable validator core with a Node CLI to achieve one reusable conformance path, accepting package maintenance and runtime dependency costs.

## Context

- AgDR records need the same frontmatter and body checks in local tooling, CI, and future interfaces.
- The repository already owns the normative JSON Schema and a complete repository validator.

## Options Considered

| Option | Pros | Cons |
|---|---|---|
| Keep validation only in repository scripts | No package maintenance | Browser and automation clients must duplicate or vendor the implementation. |
| Publish a portable core with a Node CLI | One implementation supports browsers, editors, skills, and CI | Requires package release and dependency maintenance. |
| Use a hosted validation service | Centralized updates | Adds network dependency, service cost, and availability risk. |

## Decision

Chosen: **publish a portable core with a Node CLI**, because clients need local, deterministic validation while the repository remains the source of the complete cross-file conformance check.

## Consequences

- The package carries the normative JSON Schema and tests it against the repository copy.
- `/decide` validates each generated AgDR before reporting completion.
- The repository validator remains responsible for duplicate IDs and repository-wide checks.

## Artifacts

- `packages/validator/`
- `commands/decide.md`
- `skills/decide/SKILL.md`
