#!/bin/sh
FILES=$(git diff --cached --name-only --diff-filter=ACMR "*.md" | sed 's| |\\ |g')
[ -z "$FILES" ] && exit 0

# Prettify all selected files
echo "start adding table of content"
echo "$FILES" | xargs npm run toc

# Add back the modified/prettified files to staging
echo "$FILES" | xargs git add
echo "adding table of content, Done!"

exit 0
