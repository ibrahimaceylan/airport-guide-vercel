#!/bin/bash
echo "[Phase 10 Verification]"

echo "→ Checking documentation..."
test -f ./docs/phase-10.md && echo "✅ docs/phase-10.md exists" || echo "❌ Missing docs/phase-10.md"
grep -Fq "Homepage Experience Refresh" ./docs/project-roadmap.md && echo "✅ Project roadmap references phase 10" || echo "⚠️ Roadmap missing phase 10 entry"
test -f ./docs/versions/roadmap-v1.10.0.md && echo "✅ Versioned roadmap v1.10.0 present" || echo "⚠️ Missing roadmap snapshot v1.10.0"

echo "→ Checking Codex metadata..."
test -f ./.codex/meta/phase-10.json && echo "✅ phase-10 meta file exists" || echo "❌ Missing .codex/meta/phase-10.json"
grep -q "verify-phase10.sh" ./.codex/meta/phase-10.json && echo "✅ Verification script referenced in meta" || echo "⚠️ phase-10 meta missing verification script reference"

echo "→ Checking localization scaffolding..."
grep -q "\"homepage\"" ./src/locales/en.json && echo "✅ Base homepage locale namespace present" || echo "⚠️ homepage namespace missing in en.json"
grep -q "\"planner\"" ./src/locales/en.json && echo "✅ Planner locale keys detected" || echo "⚠️ Planner locale keys not found — add homepage.planner.* entries"

echo "→ Checking component scaffolding..."
test -d "./src/app/[locale]/(site)" && echo "✅ Site module directory exists" || echo "⚠️ Missing ./src/app/[locale]/(site) directory for homepage components"
for component in PlannerStrip StatusSnapshot JourneyGrid TransportTabs HighlightsGrid AlertsBanner PartnerCarousel; do
  test -f "./src/app/[locale]/(site)/components/${component}.tsx" && echo "✅ ${component}.tsx present" || echo "⚠️ ${component}.tsx missing"
done

echo "→ Checking design tokens..."
test -f "./src/styles/design-tokens.ts" && echo "✅ Design tokens file present" || echo "⚠️ Missing src/styles/design-tokens.ts"

echo "Phase 10 verification checks completed."
