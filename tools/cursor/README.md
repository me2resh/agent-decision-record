# AgDR for Cursor AI

## Installation (Recommended: MDC format)

Copy `agdr.mdc` to your project's `.cursor/rules/` directory:

```bash
mkdir -p /path/to/your/project/.cursor/rules
cp agdr.mdc /path/to/your/project/.cursor/rules/agdr.mdc
```

This uses Cursor's modern MDC rule format with `alwaysApply: true`, so the AgDR enforcement is active in every conversation.

### Legacy: .cursorrules (deprecated but supported)

If your project still uses the legacy `.cursorrules` format:

```bash
cp .cursorrules /path/to/your/project/.cursorrules
```

Or append to your existing file:

```bash
cat .cursorrules >> /path/to/your/project/.cursorrules
```

## What It Does

When Cursor detects a technical decision during coding (choosing a library, picking an architecture pattern, etc.), it will:

1. Stop before implementing
2. Present options with pros/cons
3. Create an AgDR file at `docs/agdr/AgDR-NNNN-slug.md`
4. Then proceed with implementation

## Example

You ask Cursor: "Add a state management library to this React app"

Instead of just installing Redux, Cursor will:
1. Compare options (Redux, Zustand, Jotai, Context API)
2. Create `docs/agdr/AgDR-0001-state-management-library.md`
3. Then install and configure the chosen library

## Learn More

- [AgDR Repository](https://github.com/me2resh/agent-decision-record)
- [Full Template](../../agdr-template.md)
- [Examples](../../examples/)
