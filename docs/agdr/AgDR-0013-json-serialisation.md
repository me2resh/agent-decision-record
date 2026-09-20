# Define JSON as an additional AgDR serialisation

> In the context of extending AgDR for APIs and agent tooling, facing a need for machine-readable transport without changing the repository-native format, I decided to define JSON as a serialisation of the existing AgDR information model, accepting a second schema and conversion maintenance.

## Options Considered
| Option | Pros | Cons |
| --- | --- | --- |
| Add JSON as a representation of the current model | Preserves Markdown compatibility and enables tooling | Requires mapping and round-trip documentation |
| Create a separate JSON standard | Simple initial schema | Splits semantics and creates incompatible records |

## Decision
Define JSON as an additional serialisation of the existing AgDR information model because it enables programmatic use while keeping Markdown records valid and primary for repository review. Use `application/vnd.agdr+json` as the media type and validate the shared Markdown/JSON example in CI.

## Consequences
- Markdown and JSON must preserve the same decision semantics.
- The JSON schema and examples require CI validation.
- Any information that cannot round-trip must be documented.
- Markdown and JSON field mappings and loss limits are defined in SPEC.md §9.
