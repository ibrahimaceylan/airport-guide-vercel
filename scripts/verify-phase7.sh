#!/bin/bash
echo "[Phase 7 Verification]"
echo "→ Checking Prisma models..."
grep -q "model Hero" ./prisma/schema.prisma && echo "✅ Hero model found" || echo "❌ Hero missing"
grep -q "model QuickLink" ./prisma/schema.prisma && echo "✅ QuickLink model found" || echo "❌ QuickLink missing"
grep -q "model Highlight" ./prisma/schema.prisma && echo "✅ Highlight model found" || echo "❌ Highlight missing"
grep -q "model Transport" ./prisma/schema.prisma && echo "✅ Transport model found" || echo "❌ Transport missing"
grep -q "model AtAirport" ./prisma/schema.prisma && echo "✅ AtAirport model found" || echo "❌ AtAirport missing"
grep -q "model CTAStrip" ./prisma/schema.prisma && echo "✅ CTAStrip model found" || echo "❌ CTAStrip missing"

echo "→ Checking for content API routes..."
test -d ./src/app/api/content && echo "✅ Content API directory exists" || echo "⚠️ Missing API content folder"

echo "→ Checking middleware access logic..."
grep -q "role" ./src/middleware.ts && echo "✅ Role-based check found" || echo "⚠️ No role validation detected"

echo "→ Checking admin modal components..."
test -f ./src/components/admin/modals/HeroModal.tsx && echo "✅ HeroModal found" || echo "❌ HeroModal missing"
test -f ./src/components/admin/modals/QuickLinkModal.tsx && echo "✅ QuickLinkModal found" || echo "❌ QuickLinkModal missing"
test -f ./src/components/admin/modals/HighlightModal.tsx && echo "✅ HighlightModal found" || echo "❌ HighlightModal missing"
test -f ./src/components/admin/modals/TransportModal.tsx && echo "✅ TransportModal found" || echo "❌ TransportModal missing"
test -f ./src/components/admin/modals/AtAirportModal.tsx && echo "✅ AtAirportModal found" || echo "❌ AtAirportModal missing"
test -f ./src/components/admin/modals/CTAStripModal.tsx && echo "✅ CTAStripModal found" || echo "❌ CTAStripModal missing"

echo "Verification complete for Phase 7 (CRUD modals)."
