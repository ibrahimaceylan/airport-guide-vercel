#!/bin/bash
echo "[Phase 6C Verification]"
grep -q "zod" ./src/lib/validation.ts && echo "✅ Zod validation present" || echo "❌ Missing Zod validation"
grep -q "BarChart" ./src/components/dashboard/AnalyticsPanel.tsx && echo "✅ BarChart integration found" || echo "⚠️ BarChart missing"
grep -q "try" ./src/components/dashboard/AnalyticsPanel.tsx && echo "✅ Error handling present" || echo "⚠️ No error handling"
echo "Verification complete for Phase 6C readiness."
