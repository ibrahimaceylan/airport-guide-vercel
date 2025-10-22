#!/bin/bash
# =========================================
# 🧩 Pre-Dev Hook — Istanbul Airport Guide
# Runs before "yarn dev" to ensure environment sanity
# =========================================

echo "🔍 Running Codex pre-dev verification..."

if [ -f "scripts/verify-node.sh" ]; then
  bash scripts/verify-node.sh || exit 1
else
  echo "⚠️  verify-node.sh not found — skipping."
fi

if [ -f "scripts/verify-devsetup.sh" ]; then
  bash scripts/verify-devsetup.sh
else
  echo "⚠️  verify-devsetup.sh not found — skipping."
fi

echo "✅ Pre-dev verification complete."
