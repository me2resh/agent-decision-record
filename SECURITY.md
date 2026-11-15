# Security Policy

## Scope

This repository holds the **Agent Decision Record (AgDR) specification**, its
templates, and the reference `tools/` integrations. It is documentation and
tooling — there is no hosted service. The realistic security surface is:

- The `tools/` integrations (scripts/config that run in a contributor's or
  adopter's environment)
- Template or spec content that, if maliciously altered, could induce an
  automated agent to take an unsafe action
- Supply-chain concerns in any dependencies the tooling pulls in

## Supported Versions

Security fixes are applied to the latest tagged release and to `main`. Older
tags are not back-patched — upgrade to the latest version.

| Version | Supported |
|---------|-----------|
| latest release / `main` | ✅ |
| older tags | ❌ |

## Reporting a Vulnerability

**Please do not open a public issue for a security vulnerability.**

Report it privately through GitHub's
[private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability)
on this repository (Security → Report a vulnerability), or by contacting the
maintainer directly.

When reporting, please include:

- A description of the issue and its potential impact
- Steps to reproduce (a proof of concept if you have one)
- The affected file(s), tool integration, or version

## What to Expect

- **Acknowledgement** within 5 business days.
- An initial assessment and severity triage shortly after.
- Coordinated disclosure once a fix is available — we will credit reporters who
  wish to be named.

Thank you for helping keep the AgDR ecosystem and its adopters safe.
