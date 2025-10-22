# Phase 8 — Deployment & CMS Enhancements

## 🎯 Objective
Ship Istanbul Airport Guide (v2) to production with a repeatable Vercel deployment workflow and introduce versioned homepage content so admins can audit and restore changes safely.

---

## 🧱 Deliverables

| Category | Deliverable | Description |
|----------|-------------|-------------|
| 🚀 **Deployment** | Vercel project setup | Document staging + production projects, build command, and required environment variables. |
| 🗳️ **Secrets Management** | Env var checklist | List Prisma, NextAuth, analytics, and API keys with guidance for Vercel UI / CLI. |
| 🗂️ **Content Versioning** | Prisma models + migrations | Add version tables for homepage sections with publish/restore metadata. |
| 🧰 **Admin UI Updates** | Version history surface | Allow admins to inspect previous versions and restore a selection. |
| 🔄 **API Updates** | Version-aware routes | Extend `/api/content` endpoints to read/write version metadata. |
| ✅ **Verification** | `scripts/verify-phase8.sh` | Ensure deployment docs, version schema, and Codex meta exist. |

---

## ⚙️ Implementation Plan
1. **Branch & Schema**
   - Create Prisma migration adding `ContentVersion` models keyed to each homepage section.
   - Introduce publish status flags and timestamps for audit logs.
2. **API Layer**
   - Extend existing `/api/content/[section]` handlers with version creation on write.
   - Add restore endpoint or query parameter for selecting historic versions.
3. **Admin Experience**
   - Add version history drawer/modal in Admin panel with restore CTA gated to Admin role.
   - Display current publish state and author details.
4. **Deployment Playbook**
   - Document Vercel project creation, environment variable mapping, build command, and migration steps.
   - Add deployment checklist covering smoke tests and rollback procedure.
5. **Verification**
   - Implement `scripts/verify-phase8.sh` to confirm docs, Codex meta, and schema files are in place.

---

## ✅ Implementation Summary
- Added `SectionVersion`, `SectionType`, and `VersionAction` to `prisma/schema.prisma` with audit metadata (author, publish timestamp, restore linkage).
- Extended `/api/content/[section]` CRUD handlers to capture version entries on create/update/delete actions.
- Introduced `/api/content/[section]/versions` endpoint for listing history (GET) and restoring previous versions (POST) with Admin role gating.
- Built `VersionHistoryModal` and wired it into the Admin Content Manager so editors can browse history, preview changes, and restore entries.
- Created `scripts/verify-phase8.sh` to assert docs/meta/schema/UI wiring for versioning.
- Replaced static homepage sections with locale-aware Prisma reads so `/[locale]` serves live Hero, Quick Links, Highlights, Transport, and CTA content seeded via `prisma/seed.js`.

---

## 🚀 Deployment Playbook
1. **Projects**
   - Create two Vercel projects: `airport-guide-staging` and `airport-guide-production`.
   - Link both to the GitHub repo; restrict production to the `development` (or release) branch.
2. **Build Settings**
   - Build command: `yarn install --frozen-lockfile && yarn build`.
   - Output directory: `.next`.
   - Install command runs automatically; set Node version to `20.19.0`.
3. **Runtime Environment**
   - Configure the following environment variables in both projects (staging can point to a separate SQLite / Postgres instance):

| Variable | Purpose | Scope |
|----------|---------|-------|
| `DATABASE_URL` | Prisma connection string (prefer managed Postgres in production). | All |
| `NEXTAUTH_SECRET` | Auth secret for session encryption. | All |
| `NEXTAUTH_URL` | Base URL per environment (e.g., `https://airport-guide-staging.vercel.app`). | All |
| `FLIGHTS_API_URL` | External flights API endpoint. | All |
| `TRANSPORT_API_URL` | Ground transport API endpoint. | All |
| `ANALYTICS_API_KEY` | Token for analytics provider (optional). | All |
4. **Deploy Workflow**
   - Push branch → Vercel creates preview deployment.
   - For staging/production promote via Vercel UI or CLI (`vercel deploy --prod`).
   - Run migrations on each deploy with `npx prisma migrate deploy`.
   - Run post-deploy smoke tests: `yarn test:smoke` (or manual routes `/`, `/en/admin`, `/api/content/hero`).
5. **Rollback Procedure**
   - Use Vercel “Roll Back” to previous deployment.
   - Re-run `npx prisma migrate deploy` only if schema changed (else `prisma migrate reset --force` on staging).
   - For CMS, use Version History modal to restore prior content snapshots.

---

## 🔄 Versioning Workflow
- CRUD operations on homepage sections automatically capture a `SectionVersion` entry with author, action, and serialized payload.
- Admins can open “View History” in the Content Manager to see the last 50 changes, inspect metadata, and trigger a restore.
- Restore requests upsert the stored payload back into Prisma, log a `RESTORED` action, and refresh the live homepage data.

---

## 🧾 Verification
Run:

```bash
scripts/verify-phase8.sh
```

Expected checks:

- `docs/phase-8.md` exists.
- Deployment checklist present in docs.
- Prisma schema includes version models.
- `.codex/meta/phase-8.json` references the new verification script.

---

## 📚 References
- Vercel environment variables: https://vercel.com/docs/projects/environment-variables
- Prisma migrations: https://www.prisma.io/docs/concepts/components/prisma-migrate
- Codex workflow overview: `docs/project-roadmap.md`

---

## 🗺️ Status
**In Progress** — deployment dry-runs pending; schema + UI versioning implemented.

---

## ⚠️ Notes
- Anytime we add new Prisma models/tables, ship a companion seed routine **and** update the documentation so future phases can bootstrap fixtures quickly (`npx prisma db seed` should stay green after every schema change).
- `npx prisma generate` requires Node ≥ 18 — upgrade local toolchain before running migrations or regenerating the Prisma client.
