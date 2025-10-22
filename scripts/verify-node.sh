#!/bin/bash
# ============================================
# Node Version Verification for Codex workflow
# ============================================
REQUIRED="20.19.0"
CURRENT=$(node -v | sed 's/v//')

if [ "$CURRENT" = "$REQUIRED" ]; then
  echo "✅ Node version $CURRENT OK (matches $REQUIRED)"
  exit 0
else
  echo "⚠️  Node version $CURRENT does not match required $REQUIRED"
  echo "Please run: nvm install $REQUIRED && nvm use $REQUIRED"
  exit 1
fi
