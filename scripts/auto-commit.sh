#!/bin/bash
BRANCH=$(git rev-parse --abbrev-ref HEAD)
PHASE=$(basename "$BRANCH" | tr '[:upper:]' '[:lower:]')
MESSAGE=${1:-"Auto commit for $PHASE"}

echo "🧩 Running auto commit on branch: $BRANCH"
git add .
git commit -m "$MESSAGE"
git push origin "$BRANCH"
