## Agent Decision Records (AgDR)

Before making any technical decision, document it as an Agent Decision Record.

Technical decisions include: choosing libraries, designing schemas, picking architecture patterns, selecting auth approaches, adding dependencies, or choosing between implementation strategies.

When you detect a decision point, STOP before implementing. Compare at least 2 real options with pros and cons. Create the AgDR file at `docs/agdr/AgDR-{NNNN}-{slug}.md` before writing implementation code.

Every AgDR must include a Y-statement summary: "In the context of [situation], facing [concern], I decided [decision] to achieve [goal], accepting [tradeoff]."

### Decision Gate Constraints

Before creating an AgDR, resolve these constraints:

- **Do not** document a decision before understanding the real problem
- **Do not** accept the first option — at least 2 viable alternatives must be compared
- **Do not** list pros/cons you haven't verified — base claims on evidence
- **Do not** write "better" or "faster" without specifics — use measurable criteria
- **Do not** proceed without naming the tradeoff you're accepting

Do not create AgDRs for trivial choices like variable names, formatting, or following existing project conventions.

Reference: https://github.com/me2resh/agent-decision-record
