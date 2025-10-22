#!/bin/bash
PHASE=$1
NAME=$2
if [ -z "$PHASE" ] || [ -z "$NAME" ]; then
  echo "Usage: scripts/create-phase-branch.sh <phase> <name>"
  exit 1
fi
BRANCH="phase-${PHASE}-${NAME}"
git checkout development
git pull origin development
git checkout -b "$BRANCH"
cat << JSON > .codex/meta/branch-${PHASE}.json
{
  "phase": "${PHASE}",
  "branch": "${BRANCH}",
  "created": "$(date)",
  "status": "in-progress",
  "createdBy": "$(git config user.name)"
}
JSON
echo "✅ Created and switched to $BRANCH"
