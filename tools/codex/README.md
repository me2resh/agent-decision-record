# AgDR for Codex

## Installation

Copy the skill folder to your Codex skills directory:

```bash
mkdir -p "$CODEX_HOME/skills"
cp -R tools/codex/agdr-decide "$CODEX_HOME/skills/agdr-decide"
```

If `CODEX_HOME` is not set, copy into your local Codex home:

```bash
mkdir -p ~/.codex/skills
cp -R tools/codex/agdr-decide ~/.codex/skills/agdr-decide
```

## Usage

Invoke the skill explicitly in a prompt:

```text
$agdr-decide decide REST vs GraphQL for the new API
```

You can also rely on automatic triggering when a prompt clearly asks for a technical choice.

## What It Does

When Codex is about to make a non-trivial technical decision, the skill will:

1. Stop before implementing
2. Compare at least 2 real options with pros/cons
3. Create an AgDR file at `docs/agdr/AgDR-NNNN-slug.md`
4. Then proceed with implementation

## Files

| File | Purpose |
|------|---------|
| `agdr-decide/SKILL.md` | Skill instructions for Codex decision gating and AgDR generation |

## Learn More

- [AgDR Repository](https://github.com/me2resh/agent-decision-record)
- [Full Template](../../agdr-template.md)
- [Examples](../../examples/)
