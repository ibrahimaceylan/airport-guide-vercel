#!/bin/bash
echo "[Phase 8 Verification]"

echo "→ Checking documentation..."
test -f ./docs/phase-8.md && echo "✅ docs/phase-8.md exists" || echo "❌ Missing docs/phase-8.md"
grep -Fq "Deployment + CMS Enhancements" ./docs/project-roadmap.md && echo "✅ Project roadmap updated" || echo "⚠️ Project roadmap missing Phase 8 summary"
test -f ./docs/versions/roadmap-v1.8.0.md && echo "✅ Versioned roadmap v1.8.0 present" || echo "⚠️ Missing docs/versions/roadmap-v1.8.0.md"

echo "→ Checking Codex metadata..."
test -f ./.codex/meta/phase-8.json && echo "✅ phase-8 meta file exists" || echo "❌ Missing .codex/meta/phase-8.json"
grep -q "verify-phase8.sh" ./.codex/meta/phase-8.json && echo "✅ Verification script referenced" || echo "⚠️ Verification script not referenced in meta"

echo "→ Checking Prisma schema for version models..."
grep -q "model SectionVersion" ./prisma/schema.prisma && echo "✅ SectionVersion model detected" || echo "⚠️ SectionVersion model missing"
grep -q "enum SectionType" ./prisma/schema.prisma && echo "✅ SectionType enum detected" || echo "⚠️ SectionType enum missing"

echo "→ Checking API routes & UI..."
test -f "./src/app/api/content/[section]/versions/route.ts" && echo "✅ Version history API route present" || echo "⚠️ Missing versions API route"
grep -q "VersionHistoryModal" "./src/app/[locale]/(dashboard)/admin/content/page.tsx" && echo "✅ Admin content UI wired for history" || echo "⚠️ Content UI not hooked to history modal"
test -f "./src/components/admin/VersionHistoryModal.tsx" && echo "✅ VersionHistoryModal component exists" || echo "⚠️ Missing VersionHistoryModal component"

echo "→ Checking scripts directory..."
test -f ./scripts/verify-phase8.sh && echo "✅ verify-phase8.sh in place" || echo "❌ Verification script missing from scripts/"

echo "Phase 8 verification checks completed."
