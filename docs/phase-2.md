# Phase 2 — Dashboard + Content Modules

## 🎯 Objective
Develop Admin and Editor dashboards with modular content tooling backed by Prisma.

---

## 🧱 Deliverables
- Admin & Editor pages under `(dashboard)/`
- Shared `DashboardLayout`, `Sidebar`, `ContentList`, `ContentEditor`
- Prisma `Content` model related to `User`
- CRUD API routes under `/api/content`
- Verification script + Codex metadata

---

## ⚙️ Implementation Summary
| Component | Location | Description |
|:--|:--|:--|
| Admin dashboard | `src/app/(dashboard)/admin/page.tsx` | Wraps content modules inside `DashboardLayout` |
| Editor workspace | `src/app/(dashboard)/editor/page.tsx` | Mirrors admin view with editor messaging |
| Layout & Sidebar | `src/components/dashboard/*` | Provides shared navigation and responsive layout |
| Content CRUD | `src/app/api/content/*` | Authenticated routes leveraging Prisma `Content` model |
| Verification | `scripts/verify-phase2.sh` | Ensures scaffold pieces exist |

---

## 🧾 Verification
Run:
```bash
scripts/verify-phase2.sh
```

---

## 🚧 Notes
- `npx prisma generate` currently requires Node ≥ v18; update local runtime (target 20.19.0) before running migrations.
- API routes assume authenticated sessions (`auth()`), returning `401` when user context is missing.
- Author linkage derives from the session email; seed data should include matching users for testing.

---

## 🔜 Next Steps
1. Add client-side optimistic updates + toasts for Content editor.
2. Enforce role-based permissions (e.g., editors cannot delete admin content).
3. Extend Prisma model with status (`draft`, `published`) and category fields.
4. Introduce dashboard analytics widgets (traffic, engagement) in Phase 2-B.
