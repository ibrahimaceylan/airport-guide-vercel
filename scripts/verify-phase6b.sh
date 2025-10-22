#!/bin/bash
echo "[Phase 6B Verification]"

# Component checks
test -f ./src/components/dashboard/AnalyticsPanel.tsx && echo "✅ AnalyticsPanel found" || echo "❌ Missing AnalyticsPanel.tsx"

# Env var checks
grep -q "FLIGHTS_API_URL" ./src/lib/api/flights.ts && echo "✅ FLIGHTS_API_URL env usage detected" || echo "⚠️ API URL not referenced"

# SWR + Chart usage
grep -q "SWR" ./src/components/dashboard/AnalyticsPanel.tsx && echo "✅ SWR data refresh in analytics" || echo "⚠️ No SWR found"
grep -q "Chart" ./src/components/dashboard/AnalyticsPanel.tsx && echo "✅ Chart component usage detected" || echo "⚠️ No chart usage found"

# Dependency verification
echo "→ Checking dependencies..."
if yarn list recharts >/dev/null 2>&1; then
  echo "✅ Recharts package installed"
else
  echo "❌ Missing Recharts dependency"
fi

if yarn list swr >/dev/null 2>&1; then
  echo "✅ SWR package installed"
else
  echo "❌ Missing SWR dependency"
fi

echo "Verification complete for Phase 6B readiness."
