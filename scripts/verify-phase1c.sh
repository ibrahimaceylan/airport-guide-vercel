#!/bin/bash
echo "[Phase 1-C Verification]"
test -f ./src/app/\(auth\)/login/page.tsx && echo "✅ Login page found"
test -f ./src/app/\(auth\)/register/page.tsx && echo "✅ Register page found"
test -f ./src/app/api/register/route.ts && echo "✅ Register API found"
grep -q "react-hook-form" package.json && echo "✅ React Hook Form installed"
echo "Verification complete."
