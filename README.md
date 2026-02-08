# Agent Decision Records (AgDR)

[![SkillShield](https://skillshield.io/api/v1/badge/1daff16083a7aeed.svg)](https://skillshield.io/report/1daff16083a7aeed)

**A standard for documenting technical decisions made by AI coding agents.**

AgDR extends the proven [Architecture Decision Record](https://github.com/joelparkerhenderson/architecture-decision-record) (ADR) format for AI-assisted software development. When AI agents make technical choices—selecting libraries, choosing patterns, designing architecture—those decisions need the same rigor and traceability as human decisions.

## Why AgDR?

AI coding agents (Claude Code, GitHub Copilot, Cursor, Windsurf, etc.) increasingly make technical decisions autonomously. Without documentation:

- **Decisions are invisible** - No record of why the agent chose React over Vue
- **Context is lost** - Next session starts fresh with no memory
- **Teams can't audit** - PR reviews miss the reasoning behind choices
- **Knowledge doesn't transfer** - Onboarding devs can't understand AI-made decisions

AgDR solves this by requiring agents to document decisions in a structured, human-readable format that lives with your code.

## Key Differences from ADR

| Aspect | ADR | AgDR |
|--------|-----|------|
| **Author** | Human architect | AI agent |
| **Trigger** | Design meetings, RFCs | Detected decision patterns during coding |
| **Timing** | Before/after implementation | Real-time, as decisions are made |
| **Metadata** | Optional | Required (model, session, timestamp) |
| **Enforcement** | Manual process | Automated via hooks, skills, or prompts |
| **Location** | `docs/adr/` | `docs/agdr/` (per-project) |

## Quick Start

### Install as Claude Code Plugin

```bash
/plugin marketplace add me2resh/agent-decision-record
/plugin install agent-decision-record@agent-decision-record
```

Then use:

```bash
/agent-decision-record:decide which testing framework to use
```

### Using Claude Code (manual)

Copy [commands/decide.md](commands/decide.md) to your project's `.claude/commands/decide.md`:

```bash
/decide which testing framework to use
```

### Using System Prompts (any AI)

Add to your AI assistant's context:

```
Before making any technical decision (choosing libraries, patterns, or architecture),
create an AgDR document following the template at:
https://github.com/me2resh/agent-decision-record
```

### Output

```markdown
---
id: AgDR-0001
timestamp: 2026-01-30T18:45:00Z
agent: claude-code
model: claude-opus-4-5-20251101
trigger: user-prompt
status: executed
---

# Use Vitest for unit testing

> In the context of a new TypeScript project, facing the need for fast test execution,
> I decided to use Vitest to achieve rapid feedback loops, accepting that it's newer
> than Jest with a smaller ecosystem.

## Context
- New TypeScript monorepo with Vite build system
- Team prioritizes fast feedback during development
- Existing Jest knowledge on team

## Options Considered
| Option | Pros | Cons |
|--------|------|------|
| Jest | Industry standard, huge ecosystem | Slower, complex config with ESM |
| Vitest | Native Vite support, fast, Jest-compatible API | Newer, smaller ecosystem |

## Decision
Chosen: **Vitest**, because it integrates natively with our Vite setup and provides
significantly faster test execution while maintaining Jest API compatibility.

## Consequences
- Tests run 3-5x faster than Jest equivalent
- Team can reuse Jest knowledge (compatible API)
- May need workarounds for some Jest plugins
```

## AgDR Template

See [agdr-template.md](agdr-template.md) for the full template.

### Required Fields

| Field | Description | Example |
|-------|-------------|---------|
| `id` | Unique identifier | `AgDR-0001` |
| `timestamp` | ISO-8601 with time | `2026-01-30T18:45:00Z` |
| `agent` | Agent that made the decision | `claude-code`, `copilot`, `cursor` |
| `model` | Model identifier | `claude-opus-4-5-20251101` |
| `trigger` | What initiated the decision | `user-prompt`, `hook`, `automation` |
| `status` | Decision status | `proposed`, `executed`, `superseded` |

### The Y-Statement

Every AgDR must include a one-line summary following the Y-statement format:

> In the context of **[situation]**, facing **[concern]**, I decided **[decision]** to achieve **[goal]**, accepting **[tradeoff]**.

## Directory Structure

AgDRs are stored **per-project**, not centralized:

```
your-project/
├── docs/
│   └── agdr/
│       ├── AgDR-0001-use-vitest-for-testing.md
│       ├── AgDR-0002-jwt-for-authentication.md
│       └── README.md  # Index of decisions
├── src/
└── ...
```

**Why per-project?**
- Decisions travel with the code they affect
- Each project has its own ID sequence
- PRs can reference AgDRs in the same repo
- History preserved if project is forked

## Tools & Integrations

| Tool | Format | Location |
|------|--------|----------|
| **Claude Code** | Plugin + `/decide` command | [commands/](commands/) |
| **Cursor** | `.cursor/rules/agdr.mdc` | [tools/cursor/](tools/cursor/) |
| **GitHub Copilot** | `.github/copilot-instructions.md` + `.instructions.md` | [tools/copilot/](tools/copilot/) |
| **Windsurf** | `.windsurf/rules/agdr.md` | [tools/windsurf/](tools/windsurf/) |
| **Any AI** | System prompt | [tools/system-prompts/](tools/system-prompts/) |
| **Git** | Pre-commit hook | [tools/git-hooks/](tools/git-hooks/) |

### Claude Code

Install as a plugin for the namespaced `/agent-decision-record:decide` command, or copy [commands/decide.md](commands/decide.md) to your project's `.claude/commands/` for the shorter `/decide` name. See [Quick Start](#quick-start) for details.

### Cursor

MDC rule with `alwaysApply: true` for Cursor's modern `.cursor/rules/` format. Also includes legacy `.cursorrules` for backward compatibility: [tools/cursor/](tools/cursor/)

### GitHub Copilot

Repository-wide instructions (`.github/copilot-instructions.md`) plus path-specific instructions for AgDR files (`.github/instructions/agdr.instructions.md`): [tools/copilot/](tools/copilot/)

### Windsurf

Cascade rule with `trigger: always_on` for Windsurf's `.windsurf/rules/` format: [tools/windsurf/](tools/windsurf/)

### System Prompts

Generic prompts for any AI assistant: [tools/system-prompts/](tools/system-prompts/)

### Git Hooks

Pre-commit hooks to enforce AgDR creation: [tools/git-hooks/](tools/git-hooks/)

## Examples

Real-world AgDRs from production projects (anonymised):

| Example | Domain | Key Decision |
|---------|--------|-------------|
| [Auth Provider Choice](examples/AgDR-0001-auth-provider-choice.md) | Auth / Serverless | Cognito vs Auth0 vs Firebase vs Custom |
| [DynamoDB Key Design](examples/AgDR-0002-dynamo-partition-key-design.md) | Database | Workspace-partitioned vs entity-first keys |
| [Data Migration Strategy](examples/AgDR-0003-data-migration-strategy.md) | Migration | Copy-on-login vs script vs lazy dual-read |
| [MVVM Architecture](examples/AgDR-0004-mvvm-clean-architecture.md) | Mobile | MVVM vs MVI vs MVP for Android |
| [Release Workflow](examples/AgDR-0005-github-actions-release-workflow.md) | CI/CD | Manual dispatch vs tag-triggered vs Fastlane |
| [Image Loading Library](examples/AgDR-0006-coil-for-image-loading.md) | Mobile | Coil vs Glide for Compose |

[See all examples](examples/)

## When to Create an AgDR

Create an AgDR when the AI agent:

| Trigger | Example |
|---------|---------|
| Compares options | "Should we use X or Y?" |
| Chooses a library | Adding a new dependency |
| Selects a pattern | "Let's use the repository pattern" |
| Makes architecture choices | "I'll structure this as microservices" |
| Picks a convention | "We'll use kebab-case for file names" |

**Don't create AgDRs for:**
- Trivial choices (variable names, formatting)
- Following existing project conventions
- Bug fixes with obvious solutions

## Adopters

Organizations using AgDR:

| Organization | Description |
|--------------|-------------|
| [ApexScript](https://apexscript.com) | AI-first software consultancy |

*Want to be listed? Open a PR!*

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for release history.

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

Ideas for contribution:
- Templates for specific domains (security, data, ML)
- Integrations with other AI tools
- Translations to other languages
- Case studies and examples

## Credits & Attribution

AgDR builds on the foundational work of:

- **[Architecture Decision Records](https://github.com/joelparkerhenderson/architecture-decision-record)** by Joel Parker Henderson - The comprehensive ADR resource that inspired this project
- **[MADR](https://adr.github.io/madr/)** - Markdown Any Decision Records format
- **[Michael Nygard](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)** - Original ADR proposal (2011)
- **[ADR GitHub Organization](https://adr.github.io/)** - Community standards for ADRs

## License

[CC BY 4.0](LICENSE) - Creative Commons Attribution 4.0 International

You are free to share and adapt this material with appropriate credit.

---

Created by [me2resh](https://github.com/me2resh)
