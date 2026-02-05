# AgDR System Prompts

Generic system prompts for enforcing AgDR creation with any AI coding assistant.

## Installation

Add the contents of `agdr-enforcement.md` to your AI assistant's system prompt, custom instructions, or context window.

This works with any LLM-based coding tool that supports system prompts or custom instructions, including:

- ChatGPT / GPT-4
- Google Gemini
- Local models (Ollama, LM Studio)
- Any AI coding assistant not covered by the dedicated integrations

## Available Prompts

### `agdr-enforcement.md`

Contains three prompt variants:

| Variant | Use Case |
|---------|----------|
| **Basic Prompt** | Core AgDR enforcement — detects decisions and creates records |
| **Extended Prompt** | Basic + code review integration (flags PRs with undocumented decisions) |
| **Cursor-Specific** | Tailored for `.cursorrules` (see [tools/cursor/](../cursor/) for the modern MDC version) |
| **Copilot-Specific** | Tailored for `.github/copilot-instructions.md` (see [tools/copilot/](../copilot/) for the full version) |

## Usage Example

Paste into your AI's system prompt:

```
When making technical decisions during coding, you MUST create an Agent Decision Record (AgDR).

Trigger patterns — STOP if you catch yourself:
- Saying "I'll use X" or "Let's go with X"
- Comparing "X vs Y"
- Choosing a library, framework, or tool
- Making an architectural choice

Create a markdown file at docs/agdr/AgDR-{NNNN}-{slug}.md with:
1. Y-statement summary
2. Options comparison table
3. Decision with "because" justification
```

## Dedicated Integrations

For tools with native rule systems, use the dedicated integrations instead:

- [Claude Code](../claude-code/) — `/decide` slash command
- [Cursor](../cursor/) — `.cursor/rules/agdr.mdc`
- [GitHub Copilot](../copilot/) — `.github/copilot-instructions.md`
- [Windsurf](../windsurf/) — `.windsurf/rules/agdr.md`

## Learn More

- [AgDR Repository](https://github.com/me2resh/agent-decision-record)
- [Full Template](../../agdr-template.md)
- [Examples](../../examples/)
