# AgDR Examples

Real-world Agent Decision Records from production projects. All examples are anonymised but based on actual decisions made by AI coding agents.

## Examples

| ID | Decision | Domain | Key Tradeoff |
|----|----------|--------|--------------|
| [AgDR-0001](AgDR-0001-auth-provider-choice.md) | AWS Cognito for Chrome extension auth | Auth / Serverless | Managed security vs vendor lock-in |
| [AgDR-0002](AgDR-0002-dynamo-partition-key-design.md) | Workspace-partitioned DynamoDB keys | Database Design | Aggregate loading vs global query flexibility |
| [AgDR-0003](AgDR-0003-data-migration-strategy.md) | Copy-on-first-login migration | Data Migration | Zero manual steps vs first-call latency |
| [AgDR-0004](AgDR-0004-mvvm-clean-architecture.md) | MVVM + Clean Architecture for Android | Mobile Architecture | Familiar patterns vs strict state management |
| [AgDR-0005](AgDR-0005-github-actions-release-workflow.md) | GitHub Actions with manual dispatch | CI/CD | Automation vs accidental releases |
| [AgDR-0006](AgDR-0006-coil-for-image-loading.md) | Coil for Android image loading | Mobile / Libraries | Modern Kotlin API vs established ecosystem |

## What Makes These Good Examples

- **Real decisions** — not hypothetical scenarios
- **Clear tradeoffs** — every decision has downsides
- **Specific reasoning** — not "it's better", but why
- **Varied domains** — auth, database design, migration, architecture, CI/CD, libraries

## Contributing Examples

We welcome examples from your projects! To contribute:

1. Anonymise any sensitive information (product names, internal URLs, team details)
2. Ensure the decision is real (not hypothetical)
3. Follow the [template](../agdr-template.md)
4. Open a PR with your example

Good examples:
- Show clear reasoning between 2+ real alternatives
- Document actual tradeoffs the agent accepted
- Include context that others can learn from
- Use the Y-statement format in the summary
