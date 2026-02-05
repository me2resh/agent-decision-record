#!/bin/bash
# Pre-commit hook to check for AgDR compliance
#
# Installation:
#   cp tools/git-hooks/pre-commit-agdr-check.sh .git/hooks/pre-commit
#   chmod +x .git/hooks/pre-commit
#
# What it checks:
#   - New dependencies added without AgDR
#   - Architecture-related files changed without AgDR

set -e

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if this is the first commit
if git rev-parse --verify HEAD >/dev/null 2>&1; then
    AGAINST=HEAD
else
    # Initial commit: diff against empty tree
    AGAINST=$(git hash-object -t tree /dev/null)
fi

# Get list of staged files
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM)

# Patterns that suggest a technical decision was made
DECISION_PATTERNS=(
    "package.json"
    "package-lock.json"
    "build.gradle"
    "build.gradle.kts"
    "pom.xml"
    "Cargo.toml"
    "go.mod"
    "requirements.txt"
    "Gemfile"
)

# Check for new dependencies
NEEDS_AGDR=false
DECISION_FILES=""

for pattern in "${DECISION_PATTERNS[@]}"; do
    if echo "$STAGED_FILES" | grep -q "$pattern"; then
        DECISION_FILES="$DECISION_FILES $pattern"
        NEEDS_AGDR=true
    fi
done

# Check if an AgDR was also added
AGDR_ADDED=$(echo "$STAGED_FILES" | grep -c "docs/agdr/AgDR-" || true)

if [ "$NEEDS_AGDR" = true ] && [ "$AGDR_ADDED" -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Warning: Dependency files changed without AgDR${NC}"
    echo ""
    echo "Changed files that may require AgDR:"
    echo "$DECISION_FILES"
    echo ""
    echo "If you made a technical decision (chose a library, framework, etc.),"
    echo "please create an AgDR at docs/agdr/AgDR-NNNN-description.md"
    echo ""
    echo "To skip this check (not recommended):"
    echo "  git commit --no-verify"
    echo ""

    # Warning only - don't block the commit
    # To make it blocking, uncomment the next line:
    # exit 1
fi

exit 0
