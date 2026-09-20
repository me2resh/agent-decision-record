# @agent-decision-record/validator

Browser-safe AgDR Markdown checks with a matching command-line interface.

```js
import { validateAgdr } from '@agent-decision-record/validator';

const diagnostics = validateAgdr(markdown, { filename: 'AgDR-0014-auth.md' });
```

The CLI uses the same core:

```sh
npx agdr-validate AgDR-0014-auth.md
```

The package reports structural diagnostics. The repository validator remains the complete conformance check, including JSON Schema validation and cross-file duplicate-ID detection.
