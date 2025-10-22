#!/bin/bash
set -e

echo "[Phase 2 Verification]"

if test -f "./src/app/(dashboard)/admin/page.tsx"; then
  echo "✅ Admin dashboard found"
else
  echo "❌ Admin dashboard missing"; exit 1
fi

if test -f "./src/app/(dashboard)/editor/page.tsx"; then
  echo "✅ Editor dashboard found"
else
  echo "❌ Editor dashboard missing"; exit 1
fi

if test -f "./src/components/dashboard/DashboardLayout.tsx"; then
  echo "✅ DashboardLayout found"
else
  echo "❌ DashboardLayout missing"; exit 1
fi

if test -f "./src/components/dashboard/ContentList.tsx" && test -f "./src/components/dashboard/ContentEditor.tsx"; then
  echo "✅ Content components found"
else
  echo "❌ Content components missing"; exit 1
fi

if test -f "./src/app/api/content/route.ts" && test -f "./src/app/api/content/[id]/route.ts"; then
  echo "✅ Content API routes found"
else
  echo "❌ Content API routes missing"; exit 1
fi

if test -f "./prisma/schema.prisma" && grep -q "model Content" ./prisma/schema.prisma; then
  echo "✅ Prisma Content model added"
else
  echo "❌ Prisma Content model missing"; exit 1
fi

echo "Verification complete."
