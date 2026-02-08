# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-02-08

### Added

- **Claude Code plugin packaging** — installable via `/plugin marketplace add me2resh/agent-decision-record`
- `.claude-plugin/plugin.json` — plugin manifest for Claude Code recognition
- `.claude-plugin/marketplace.json` — marketplace catalog for registry auto-discovery (e.g. claude-plugins.dev)
- `commands/decide.md` — user-invoked `/decide` slash command
- `skills/decide/SKILL.md` — model-invoked skill with YAML frontmatter for registry indexing

### Changed

- Updated README with plugin install instructions in Quick Start section

## [1.0.0] - 2026-02-05

### Added

- Initial release of the AgDR standard
- Full and short AgDR templates (`agdr-template.md`, `agdr-template-short.md`)
- 6 real-world examples (auth, DynamoDB, migration, MVVM, CI/CD, image loading)
- Tool integrations for Claude Code, Cursor, GitHub Copilot, Windsurf, and generic system prompts
- Pre-commit hook for AgDR enforcement
- Contributing guidelines and CC BY 4.0 license
