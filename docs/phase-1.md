# Phase 1 — Single-Site Setup (Istanbul Airport Guide v2)

## 🎯 Objective
Build a single-site **Next.js 14 + TypeScript + TailwindCSS** application with local authentication, role-based access, and verified developer tooling — inspired by the Stansted Airport layout.

---

## 🧩 Phase Breakdown

### Phase 1-A — Core Scaffold  
✅ Initialized Next.js project  
✅ Added TailwindCSS and base layout  
✅ Created auth + dashboard routes  
✅ Added Codex verification scripts  

### Phase 1-B — Prisma + Auth + Middleware  
✅ Configured Prisma with SQLite  
✅ Created `User` model + `Role` enum  
✅ Integrated NextAuth (Credentials provider)  
✅ Implemented role-based middleware  
✅ Added phase-1b Codex meta  

### Phase 1-DevEnv — Developer Environment Setup  
✅ Configured Prettier + ESLint (+ Tailwind plugin v0.6.5)  
✅ Added `.vscode/settings.json` and `.gitattributes`  
✅ Created `verify-devsetup.sh` and Codex meta entries  
✅ Hooked auto-verification before `yarn dev`  

---

## 🧾 Verification Scripts
| Script | Purpose |
|:--|:--|
| `scripts/verify-phase1.sh` | Base project scaffold check |
| `scripts/verify-phase1b.sh` | Prisma + Auth integrity check |
| `scripts/verify-devsetup.sh` | Prettier/ESLint validation |
| `scripts/hooks/pre-dev.sh` | Auto-verify before `yarn dev` |

---

## 📂 Codex Meta Summary
| File | Purpose |
|:--|:--|
| `.codex/meta/phase-1.json` | Main Phase definition |
| `.codex/meta/phase-1b.json` | Auth + Prisma sub-phase |
| `.codex/meta/dev-environment.json` | Tooling baseline |
| `.codex/meta/dev-automation.json` | Pre-dev hook automation |

---

## 🚀 Next — Phase 1-C (Login & Register UI)
Implement React Hook Form and NextAuth integration for user login and registration:
- Build `/login` and `/register` pages with Tailwind UI  
- Hook forms into NextAuth Credentials flow  
- Redirect on successful login  
- Add validation and error handling  

---

### ✅ Phase 1 Status
| Sub-phase | Summary | Status |
|:--|:--|:--|
| 1-A | Project Scaffold | ✅ Complete |
| 1-B | Prisma + Auth | ✅ Complete |
| 1-DevEnv | Tooling + Automation | ✅ Complete |
| 1-C | Login / Register UI | 🚧 Next |

_Last updated: $(date)_
