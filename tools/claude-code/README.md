# AgDR for Claude Code

## Installation

The canonical command file lives at [`commands/decide.md`](../../commands/decide.md) in the repo root (that's also what the Claude Code plugin installs — see [Quick Start](../../README.md#quick-start)). Copy it to your project's `.claude/commands/` directory:

```bash
mkdir -p /path/to/your/project/.claude/commands
curl -o /path/to/your/project/.claude/commands/decide.md \
  https://raw.githubusercontent.com/me2resh/agent-decision-record/main/commands/decide.md
```

Or, if you've cloned this repo:

```bash
cp commands/decide.md /path/to/your/project/.claude/commands/decide.md
```

This registers `/decide` as a slash command in Claude Code.

(This directory previously shipped its own copy of `decide.md`. It was dropped in favor of the single canonical copy at `commands/decide.md` — two copies of the same command body was exactly the drift trap AgDR itself exists to catch.)

## Usage

```
/decide which testing framework to use
/decide how to handle authentication
/decide REST vs GraphQL for the new API
```

Claude Code will:
1. Analyze your codebase context
2. Present 2-4 options with pros/cons table
3. Make a recommendation with the Y-statement format
4. Create an AgDR file at `docs/agdr/AgDR-NNNN-slug.md`
5. Then proceed with implementation

## Enforcement via CLAUDE.md

For automatic decision detection (without needing to manually invoke `/decide`), add trigger patterns to your project's `CLAUDE.md`:

```markdown
## Technical Decisions

Before making any technical decision, STOP and run /decide.

### Trigger Patterns
If you are about to:
- Say "I'll use X" or "Let's go with X" → STOP, run /decide first
- Compare "X vs Y" → STOP, run /decide first
- Choose a library, framework, or tool → STOP, run /decide first
- Pick an implementation approach → STOP, run /decide first
- Make an architectural choice → STOP, run /decide first
```

## Learn More

- [AgDR Repository](https://github.com/me2resh/agent-decision-record)
- [Full Template](../../agdr-template.md)
- [Examples](../../examples/)
