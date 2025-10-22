#!/bin/bash
echo "[Phase 3 Verification]"
test -f ./src/app/api/flights/route.ts && echo "✅ Flights API route found"
test -f ./src/components/flights/FlightsList.tsx && echo "✅ FlightsList component found"
test -f ./src/components/transport/TaxiWidget.tsx && echo "✅ Transport widgets found"
grep -q "model Flight" ./prisma/schema.prisma && echo "✅ Prisma Flight model added"
echo "Verification complete."
