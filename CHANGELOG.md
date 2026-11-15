# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-07-04

### Added

- **CI: AgDR self-validation** — `.github/workflows/validate-agdr.yml` runs `scripts/validate-agdr.js` against `schema/agdr.schema.json` on every push/PR, checking required frontmatter fields, `trigger`/`status` enums, `id`-matches-filename, cross-file ID uniqueness, Y-statement shape, and required body sections
- `schema/agdr.schema.json` — the JSON Schema for AgDR frontmatter
- **CI: markdown link check** — `.github/workflows/link-check.yml` (lychee) runs on every push/PR and weekly on a schedule
- **CI: changelog/manifest lockstep check** — `.github/workflows/changelog-lockstep.yml` fails a PR that bumps `.claude-plugin/plugin.json`'s version without a matching `CHANGELOG.md` entry; also asserts `plugin.json` and `marketplace.json` report the same version
- `SPEC.md` — the single normative reference for the AgDR format (RFC 2119 MUST/SHOULD), consolidating rules that were previously smeared across `README.md`, `agdr-template.md`, and the `tools/*` integrations
- `.github/CODEOWNERS`, PR template, and two issue-form templates (example contribution, spec question)
- "Confirm it" step in the README quickstart — run the validator against your own first AgDR

### Changed

- `agdr-template.md` now points to `SPEC.md` for field/status/trigger/naming/Y-statement rules instead of duplicating them, and keeps only the copy-paste template bodies and non-normative tips
- `agdr-template-short.md` is now a redirect stub into `agdr-template.md#short-template` (same content, one home)
- Removed the duplicate `tools/claude-code/decide.md` — `commands/decide.md` is now the single canonical `/decide` command file; `tools/claude-code/README.md` links to it instead of shipping its own copy
- `examples/*.md` no longer hardcode a Jan-2026-dated `model: claude-opus-4-5-20251101` snapshot (read as abandoned); undated `model: claude-opus-4-5` instead
- README's illustrative "Output" sample now uses the `{model-id}` placeholder, consistent with the templates

### Fixed

- Retroactively logs the Codex integration and SkillShield badge (both shipped in commits after the 1.1.0 entry above was written, without a version bump or changelog entry — the exact drift this release's CI now catches going forward)

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
