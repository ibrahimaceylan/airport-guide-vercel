#!/bin/bash
echo "[Phase 7C Verification]"
echo "→ Checking admin content manager page..."
if [ -f "./src/app/[locale]/(dashboard)/admin/content/page.tsx" ]; then
  echo "✅ Content Manager page found"
else
  echo "❌ Missing content page"
fi
if grep -q "HeroModal" "./src/app/[locale]/(dashboard)/admin/content/page.tsx"; then
  echo "✅ Modals integrated"
else
  echo "⚠️ Modals not linked"
fi
echo "Verification complete for Phase 7C."
