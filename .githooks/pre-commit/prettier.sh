#!/bin/sh
FILES=$(git diff --cached --name-only --diff-filter=ACMR "*.ts" "*.tsx" "*.js" "*.jsx" "*.md" | sed 's| |\\ |g')
[ -z "$FILES" ] && exit 0

# Prettify all selected files
echo "start prettier"
echo "$FILES" | xargs ./node_modules/.bin/prettier --write

# Add back the modified/prettified files to staging
echo "$FILES" | xargs git add
echo "prettier done"

exit 0
