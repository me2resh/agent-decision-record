# @agent-decision-record/validator

Portable AgDR Markdown checks with a matching command-line interface.

The package validates YAML frontmatter against the published `schema/agdr.schema.json`,
then checks the filename, Y-statement, and required body sections. The package schema
is synchronized with the repository schema by the package test suite.

```js
import { validateAgdr } from '@agent-decision-record/validator';

const diagnostics = validateAgdr(markdown, { filename: 'AgDR-0014-auth.md' });
// [] means the record conforms to the package checks.
```

The core module can be bundled into a browser or editor extension. It does not read
files, access the network, or depend on Node APIs. The CLI is a separate Node entry
point for local checks and CI:

The CLI uses the same core:

```sh
npx agdr-validate AgDR-0014-auth.md
```

An automation skill can call the same CLI after creating or changing an AgDR:

```sh
npx agdr-validate docs/agdr/AgDR-0014-auth-provider.md
```

The repository validator remains the complete repository conformance check. It adds
cross-file duplicate-ID detection and recursive directory validation. Use it in CI
for a repository; use this package when validating one record in a browser, editor,
or CLI process.
