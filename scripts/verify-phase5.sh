#!/bin/bash
echo "[Phase 5 Verification]"
test -f ./src/components/LanguageSwitcher.tsx && echo "✅ LanguageSwitcher component found" || echo "❌ Missing LanguageSwitcher.tsx"
grep -q "useLocale" ./src/components/LanguageSwitcher.tsx && echo "✅ useLocale hook detected" || echo "❌ useLocale not detected"
grep -q "router.push" ./src/components/LanguageSwitcher.tsx && echo "✅ router.push for navigation found" || echo "❌ router.push missing"
grep -q "rtl" ./src/components/dashboard/Topbar.tsx && echo "✅ RTL handling in Topbar detected" || echo "⚠️ RTL classes not found"
echo "Verification complete for Phase 5 readiness."
