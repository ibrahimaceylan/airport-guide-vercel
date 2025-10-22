#!/bin/bash
echo "[Phase 6 Verification]"
test -f ./src/lib/api/flights.ts && echo "✅ flights.ts found" || echo "❌ flights.ts missing"
test -f ./src/lib/api/transport.ts && echo "✅ transport.ts found" || echo "❌ transport.ts missing"
grep -q "fetch" ./src/lib/api/flights.ts && echo "✅ Fetch logic detected" || echo "⚠️ No fetch logic"
grep -q "SWR" ./src/components/flights/FlightsList.tsx && echo "✅ SWR hook usage detected" || echo "⚠️ SWR missing"
echo "Verification complete for Phase 6 readiness."
