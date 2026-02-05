# Git Hooks for AgDR

Git hooks to help enforce AgDR creation in your workflow.

## Available Hooks

### pre-commit-agdr-check.sh

Warns when dependency files are changed without a corresponding AgDR.

**Installation:**

```bash
# Copy to your project
cp pre-commit-agdr-check.sh /path/to/your/project/.git/hooks/pre-commit
chmod +x /path/to/your/project/.git/hooks/pre-commit
```

**What it checks:**
- `package.json` / `package-lock.json` (Node.js)
- `build.gradle` / `build.gradle.kts` (Android/Java)
- `pom.xml` (Maven)
- `Cargo.toml` (Rust)
- `go.mod` (Go)
- `requirements.txt` (Python)
- `Gemfile` (Ruby)

**Behavior:**
- Shows a warning if dependency files changed without AgDR
- Does NOT block the commit (warning only)
- To make it blocking, edit the script and uncomment `exit 1`

## Using with Husky (Node.js)

If you use [Husky](https://typicode.github.io/husky/), add to `.husky/pre-commit`:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Check for AgDR when dependencies change
STAGED=$(git diff --cached --name-only)
if echo "$STAGED" | grep -q "package.json"; then
    if ! echo "$STAGED" | grep -q "docs/agdr/AgDR-"; then
        echo "⚠️  Warning: package.json changed without AgDR"
        echo "Consider documenting any new dependency decisions."
    fi
fi
```

## Using with pre-commit (Python)

Add to `.pre-commit-config.yaml`:

```yaml
repos:
  - repo: local
    hooks:
      - id: agdr-check
        name: Check for AgDR
        entry: bash -c 'if git diff --cached --name-only | grep -q "requirements.txt"; then if ! git diff --cached --name-only | grep -q "docs/agdr/"; then echo "Warning: Consider adding AgDR for dependency changes"; fi; fi'
        language: system
        pass_filenames: false
```

## Customization

Edit the `DECISION_PATTERNS` array in the script to match your project's dependency files.
