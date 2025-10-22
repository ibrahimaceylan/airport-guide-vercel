#!/bin/bash
echo "[Phase 4 Verification]"

# --- Verify meta file
if [ -f ".codex/meta/phase-4.json" ]; then
  echo "✅ Codex meta for Phase 4 found"
else
  echo "❌ Missing .codex/meta/phase-4.json"
fi

# --- Check Tailwind config
if [ -f "tailwind.config.ts" ]; then
  grep -q "darkMode" tailwind.config.ts && echo "✅ Tailwind config present" || echo "⚠️ Tailwind config found but missing darkMode field"
else
  echo "❌ tailwind.config.ts missing"
fi

# --- Verify Next.js version
NEXT_VERSION=$(grep '"next":' package.json | cut -d '"' -f4)
echo "→ Next.js version: ${NEXT_VERSION:-unknown}"

# --- Check for i18n-related dependencies
echo "→ Checking i18n dependencies..."
grep -q "next-intl" package.json && echo "✅ next-intl installed" || echo "❌ next-intl missing"
grep -q "tailwindcss" package.json && echo "✅ tailwindcss installed" || echo "❌ tailwindcss missing"

# --- Verify locales directory structure
if [ -d "src/locales" ]; then
  echo "✅ Locales directory exists"
  ls src/locales
  if [ -f "src/locales/ar.json" ]; then
    echo "✅ Arabic locale file present"
  else
    echo "❌ Arabic locale file missing"
  fi
else
  echo "❌ Missing src/locales directory (expected for EN/TR/AR)"
fi

# --- Verify Topbar includes language toggle placeholder
if grep -Eq 'Language|t\("language"\)' src/components/dashboard/Topbar.tsx 2>/dev/null; then
  echo "✅ Topbar has language toggle placeholder"
else
  echo "⚠️ Consider adding language toggle in Topbar for Phase 4"
fi

# --- Completion summary
echo "Verification complete for Phase 4 readiness."
