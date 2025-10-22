# Istanbul Airport Guide (v2) — Roadmap  
**Version:** v1.0.0  **Branch:** phase-1-single-site-setup  **Updated:** $(date)

## 🧭 Overview
Single-site **Next.js 14 + TypeScript + TailwindCSS** app, local auth with NextAuth (Credentials),  
**Prisma + SQLite**, role-based users (Admin / Editor / User), verified by **Codex automation**.

## 🧱 Tech Stack
Next.js 14 (App Router, TS) | TailwindCSS | Lucide React | React Hook Form | NextAuth (Credentials) | Prisma + SQLite | Yarn | ESLint + Prettier | Codex Workflow

## 📂 Canonical Structure
src/app/(auth)/(dashboard)/… components/ lib/auth/ scripts/hooks/ docs/ .codex/meta/

(details identical to full scaffold built in Phase 1)

## 🚀 Phase Plan & Status
| Phase | Name | Summary | Status |
|:--|:--|:--|:--|
| **1** | Single-Site Setup | Base Next.js project + Prisma + Auth + Tooling | ✅ In Review |
| **2** | Dashboard + Content | Admin/Editor dashboards | ⏳ Planned |
| **3** | Flights + Transport | Live widgets + APIs | ⏳ Planned |
| **4** | Localization + UI Polish | i18n + performance | ⏳ Planned |

### Phase 1 Sub-Phases
| Sub | Name | Deliverables | Status |
|:--|:--|:--|:--|
| 1-A | Core Scaffold | Init Next.js, Tailwind, layout | ✅ |
| 1-B | Prisma + Auth + Middleware | Schema + NextAuth + Roles | ✅ |
| 1-DevEnv | Developer Env | Prettier / ESLint / VSCode + Codex hooks | ✅ |
| 1-C | Login / Register UI | React Hook Form + NextAuth UI | 🚧 |

## ✅ Verification Matrix
`scripts/verify-phase1.sh`, `verify-phase1b.sh`, `verify-devsetup.sh`, `hooks/pre-dev.sh`

## 🧾 Codex Meta Files
`.codex/meta/phase-1*.json`, `dev-environment.json`, `dev-automation.json`, `phase-1-doc.json`, `version.json`, `.codex/summary.json`

## 🔧 Environment
Node 20.18.x (pinned `prettier-plugin-tailwindcss@0.6.5`), Yarn v1, branch `phase-1-single-site-setup`

## 🗺️ Next Steps (1-C)
Build /login and /register with React Hook Form → NextAuth Credentials → redirect by role.

_Last updated: $(date)_
