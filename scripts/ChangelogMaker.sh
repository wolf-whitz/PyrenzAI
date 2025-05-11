#!/bin/bash

changelogPath="CHANGELOG.md"
rm -f "$changelogPath"

echo "# 📜 Project Changelog" >> "$changelogPath"
echo "" >> "$changelogPath"

git log --pretty=format:"%ad|[%h] %s - %an" --date=short | sort -r | while IFS='|' read -r commitDate commitMsg; do
    if [[ "$lastDate" != "$commitDate" ]]; then
        echo "" >> "$changelogPath"
        echo "## $commitDate" >> "$changelogPath"
        echo "" >> "$changelogPath"
        lastDate="$commitDate"
    fi
    echo "- $commitMsg" >> "$changelogPath"
done

echo ""
echo "✅ Pretty Markdown changelog written to $changelogPath"
