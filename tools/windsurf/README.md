# AgDR for Windsurf

## Installation

Copy `agdr.md` to your project's `.windsurf/rules/` directory:

```bash
mkdir -p /path/to/your/project/.windsurf/rules
cp agdr.md /path/to/your/project/.windsurf/rules/agdr.md
```

The rule uses `trigger: always_on`, so AgDR enforcement is active in every Cascade conversation.

## What It Does

When Windsurf Cascade detects a technical decision during coding (choosing a library, picking an architecture pattern, etc.), it will:

1. Stop before implementing
2. Present options with pros/cons
3. Create an AgDR file at `docs/agdr/AgDR-NNNN-slug.md`
4. Then proceed with implementation

## Example

You ask Cascade: "Add authentication to this API"

Instead of just implementing JWT, Cascade will:
1. Compare options (JWT, OAuth2, API keys, session-based)
2. Create `docs/agdr/AgDR-0001-auth-strategy.md`
3. Then implement the chosen approach

## Note on Character Limits

Windsurf rules have a 6,000 character limit per file and 12,000 combined. The AgDR rule is designed to fit within these limits.

## Learn More

- [AgDR Repository](https://github.com/me2resh/agent-decision-record)
- [Windsurf Rules Documentation](https://docs.windsurf.com/windsurf/cascade)
- [Full Template](../../agdr-template.md)
- [Examples](../../examples/)
