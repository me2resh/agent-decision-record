# AgDR for GitHub Copilot

## Installation

GitHub Copilot supports two instruction formats. Use both for full coverage.

### 1. Repository-Wide Instructions

Copy `copilot-instructions.md` to your project's `.github/` directory:

```bash
mkdir -p /path/to/your/project/.github
cp copilot-instructions.md /path/to/your/project/.github/copilot-instructions.md
```

Or append to your existing file:

```bash
cat copilot-instructions.md >> /path/to/your/project/.github/copilot-instructions.md
```

This applies AgDR enforcement to all Copilot interactions in the repository.

### 2. Path-Specific Instructions (for AgDR file editing)

Copy `agdr.instructions.md` to your project's `.github/instructions/` directory:

```bash
mkdir -p /path/to/your/project/.github/instructions
cp agdr.instructions.md /path/to/your/project/.github/instructions/agdr.instructions.md
```

This provides the AgDR template and format rules when editing files in `docs/agdr/`.

## What It Does

When Copilot detects a technical decision during coding, it will:

1. Stop before implementing
2. Compare at least 2 real options
3. Create an AgDR file at `docs/agdr/AgDR-NNNN-slug.md`
4. Then proceed with implementation

## Files

| File | Purpose | Location in your project |
|------|---------|------------------------|
| `copilot-instructions.md` | Global AgDR enforcement | `.github/copilot-instructions.md` |
| `agdr.instructions.md` | AgDR format rules for `docs/agdr/` | `.github/instructions/agdr.instructions.md` |

## Learn More

- [AgDR Repository](https://github.com/me2resh/agent-decision-record)
- [GitHub Copilot Custom Instructions Docs](https://docs.github.com/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot)
- [Full Template](../../agdr-template.md)
- [Examples](../../examples/)
