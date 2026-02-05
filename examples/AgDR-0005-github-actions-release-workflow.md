---
id: AgDR-0005
timestamp: 2026-01-31T09:30:00Z
agent: claude-code
model: claude-opus-4-5-20251101
trigger: user-prompt
status: executed
---

# GitHub Actions for Android Release Workflow

> In the context of needing to distribute Android APKs directly, facing the need for automated versioning and release management, I decided to use GitHub Actions with manual workflow_dispatch to achieve controlled releases with automatic version bumping, accepting the dependency on GitHub's infrastructure.

## Context
- Distributing APKs directly (not Play Store initially)
- Need automatic version bumping (semantic versioning)
- Need signed releases for Android installation
- GitHub already hosts the repository

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **GitHub Actions (manual dispatch)** | Native to GitHub, easy secrets management, manual control over releases | Locked to GitHub ecosystem |
| **GitHub Actions (tag-triggered)** | Fully automated on tag push | Less control, easy to trigger accidentally |
| **Fastlane** | Industry standard, rich Android tooling | Additional dependency, more config |
| **Local build script** | Simple, no CI dependency | No automation, manual secrets handling |

## Decision

Chosen: **GitHub Actions with workflow_dispatch**, because it provides the right balance of automation (version bumping, signing, release creation) with control (manual trigger prevents accidental releases).

## Consequences

- Releases are triggered manually via GitHub UI or CLI
- Version is automatically bumped based on selected type (patch/minor/major)
- APK is signed and attached to GitHub Release
- Changelog is auto-generated from commits
- Requires GitHub secrets for keystore credentials
