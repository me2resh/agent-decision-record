# Contributing to AgDR

Thank you for your interest in contributing to Agent Decision Records!

## Ways to Contribute

### 1. Add Examples

Share real AgDRs from your projects:

1. Fork this repository
2. Add your example to `examples/`
3. Follow the [template](agdr-template.md)
4. Anonymize any sensitive information
5. Open a PR with a brief description

### 2. Create Tool Integrations

Build integrations for AI tools:

- **Cursor** - Add to `tools/cursor/`
- **GitHub Copilot** - Add to `tools/copilot/`
- **Windsurf** - Add to `tools/windsurf/`
- **Other AI assistants** - Create new directory

### 3. Translations

Translate AgDR documentation:

1. Create `locales/{language-code}/`
2. Translate README.md and templates
3. Open a PR

### 4. Documentation Improvements

- Fix typos or unclear explanations
- Add more examples to existing docs
- Improve the templates

### 5. Domain-Specific Templates

Create templates for specific domains:

- Security decisions
- Data architecture
- ML/AI model choices
- Infrastructure decisions

## Pull Request Process

1. **Fork** the repository
2. **Create a branch** for your changes
3. **Make your changes** following existing style
4. **Test** that markdown renders correctly
5. **Open a PR** with a clear description

## Style Guide

### Markdown

- Use ATX-style headers (`#`, `##`, etc.)
- Use fenced code blocks with language hints
- Keep lines under 100 characters where possible
- Use tables for comparisons

### Examples

- Must be from real projects (not hypothetical)
- Anonymize company/project names if needed
- Include all required AgDR fields
- Show actual reasoning, not generic text

### Templates

- Keep required fields minimal
- Provide clear guidance in comments
- Test with multiple AI tools if possible

## Code of Conduct

- Be respectful and constructive
- Focus on the contribution, not the contributor
- Welcome newcomers

## Questions?

Open an issue or reach out to hello@me2resh.com.
