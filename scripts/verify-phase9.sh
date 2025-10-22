#!/bin/bash
echo "[Phase 9 Verification]"

echo "→ Checking documentation..."
test -f ./docs/phase-9.md && echo "✅ docs/phase-9.md exists" || echo "❌ Missing docs/phase-9.md"
grep -Fq "Partnerships & Commerce Integrations" ./docs/project-roadmap.md && echo "✅ Project roadmap updated" || echo "⚠️ Roadmap missing phase 9 entry"
test -f ./docs/versions/roadmap-v1.9.0.md && echo "✅ Versioned roadmap v1.9.0 present" || echo "⚠️ Missing roadmap snapshot v1.9.0"

echo "→ Checking Codex metadata..."
test -f ./.codex/meta/phase-9.json && echo "✅ phase-9 meta file exists" || echo "❌ Missing .codex/meta/phase-9.json"
grep -q "verify-phase9.sh" ./.codex/meta/phase-9.json && echo "✅ Verification script referenced in meta" || echo "⚠️ phase-9 meta missing verification script reference"

echo "→ Checking project structure..."
grep -q "Partner" ./docs/phase-9.md && echo "✅ Phase 9 document outlines partner plan" || echo "⚠️ Phase 9 doc lacks partner details"
test -f ./src/app/go/[slug]/route.ts && echo "✅ Tracking redirect route present" || echo "⚠️ Missing tracking redirect route"
test -f ./src/app/api/partners/campaigns/route.ts && echo "✅ Partner campaigns API route present" || echo "⚠️ Missing campaigns API route"
test -f "./src/app/[locale]/(dashboard)/admin/partners/page.tsx" && echo "✅ Admin partner manager page present" || echo "⚠️ Missing admin partner manager page"

echo "Phase 9 verification checks completed."
