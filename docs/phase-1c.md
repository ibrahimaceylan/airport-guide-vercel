# Phase 1-C — Login / Register UI Integration

## 🎯 Objective
Implement user-facing authentication for Istanbul Airport Guide (v2) using **React Hook Form** with **NextAuth (Credentials Provider)** and **Prisma** for persistence.

---

## 🧱 Deliverables
- ✅ `/login` page with validation and error states  
- ✅ `/register` page with name, email, password inputs  
- ✅ `/api/register` route writing to Prisma User model  
- ✅ Password hashing via `bcryptjs`  
- ✅ Redirects based on role (Admin → /admin, Editor → /editor)  
- ✅ Verification script `scripts/verify-phase1c.sh`  
- ✅ Codex meta entry `.codex/meta/phase-1c.json`

---

## ⚙️ Implementation Summary
| Component | Location | Description |
|:--|:--|:--|
| Login Form | `src/app/(auth)/login/page.tsx` | Uses React Hook Form to call `signIn("credentials")`, handles errors, and routes by role |
| Register Form | `src/app/(auth)/register/page.tsx` | Collects name/email/password, posts to `/api/register`, guides success + failure states |
| Register API | `src/app/api/register/route.ts` | Validates payload, hashes passwords with `bcryptjs`, creates Prisma User |
| Verification | `scripts/verify-phase1c.sh` | Confirms files, API route, dependency presence |
| Meta | `.codex/meta/phase-1c.json` | Defines sub-phase objectives, dependencies, verification hook |

---

## 🧾 Verification
Run:
```bash
scripts/verify-phase1c.sh
```

Expected output:
```
[Phase 1-C Verification]
✅ Login page found
✅ Register page found
✅ Register API found
✅ React Hook Form installed
Verification complete.
```

---

## 🚀 Next Steps
1. Enable client-side error surfacing from `/api/register` (duplicate emails, etc.).
2. Implement password strength guidance and confirmation field.
3. Add integration tests around auth flows once Node baseline updated to v20.19.0.
4. Prepare Phase 1-D (Dashboard entry workflows) including protected server actions.
