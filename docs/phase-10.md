# Phase 10 — Homepage Experience Refresh

## 🎯 Objective
Transform the Istanbul Airport Guide homepage into an information-first, traveler-friendly companion that surfaces the most important tasks (flights, transport, amenities, alerts, partner offers) in a clear, localized layout.

---

## 🧱 Deliverables

| Category | Deliverable | Description |
|----------|-------------|-------------|
| ✈️ **Planner Strip** | Unified hero planner | Flight lookup (number, airline, route) with arrivals/departures CTAs plus quick links to transport planner and airport map. |
| 📊 **Status Snapshot** | Live operations cards | Daily departures, security wait, parking availability powered by CMS overrides + future integrations. |
| 🧭 **Journey Guidance** | Journey grid modules | “Before you fly” and “On arrival” tiles with iconography, deep links, and partner CTA slots. |
| 🚗 **Transport & Parking** | Tabbed transport hub | Metro/Taxi/Shuttle/Parking panels with status badges, schedules, and booking CTAs. |
| 🍽️ **Highlights** | Dining & shopping highlights | Filterable venue grid with partner promotions surfaced in priority rows. |
| 🤝 **Partner Integration** | Anchored carousel | Localized PartnerCarousel repositioned after highlights to support monetization narrative. |
| 🚨 **Alerts Banner** | Dismissible announcements | Security alerts, advisories, and disruptions surfaced in a dedicated banner. |
| 🎨 **Design Tokens** | Theme + interaction polish | Gradient tweaks, shared icon set, card elevation, hover states, and micro-interactions. |
| ✅ **Verification** | `scripts/verify-phase10.sh` | Ensures docs, meta, locale strings, and component scaffolding exist. |

---

## ⚙️ Implementation Plan
1. **Layout Scaffolding**
   - Create server components: `PlannerStrip`, `StatusSnapshot`, `JourneyGrid`, `TransportTabs`, `HighlightsGrid`, `AlertsBanner`, and reposition `PartnerCarousel`.
   - Establish a vertical section hierarchy with responsive breakpoints and accessible landmark semantics.
2. **Data Plumbing**
   - Extend Prisma/CMS models for status metrics, journey tiles, transport feeds, and highlight categories with localized copy.
   - Provide interim static fallbacks while backend integrations finalize.
3. **Styling & Theming**
   - Introduce design tokens for gradients, card shadows, radii, and spacing.
   - Apply shared card styles, hover lifts, CTA ripple interactions, and updated Lucide/Heroicon usage.
4. **Localization & Content**
   - Add `homepage.planner.*`, `homepage.status.*`, `homepage.transport.*`, `homepage.highlights.*`, and alert strings across locales.
   - Ensure CMS-driven text supports EN/TR/AR with RTL-friendly layouts.
5. **QA & Documentation**
   - Update `docs/phase-10.md`, roadmap, and version notes.
   - Expand verification script to assert presence of new components, locale keys, CMS fields, and design tokens.

---

## ✅ Implementation Summary
- Phase 10 merged into the `development` branch with the full refreshed homepage experience: planner strip, status snapshot, journey grid, transport tabs, highlights grid, alerts banner, and anchored partner carousel are all live with updated design tokens and localized copy.
- Prisma models, seed data, and CMS overrides are wired to surface the new modules while preserving static fallbacks where live feeds are still rolling out.
- Verification script, roadmap entry, and Codex metadata were updated alongside the merge to keep automation green.

---

## 🧭 Homepage Modules Overview
- **Planner Strip** sits atop the page, providing immediate flight lookup, arrivals/departures toggles, and quick-access CTAs for transport planner and airport map.
- **Status Snapshot** surfaces operational metrics (departures count, security wait time, parking availability) with dynamic data pipes and manual override fields.
- **Plan Your Journey** splits into “Before you fly” and “On arrival” tiles linking to deeper guides and partner upsells (fast track, lounge, currency, concierge).
- **Transport & Parking** tab set highlights metro, taxi, shuttle, and parking with real-time status badges, ETAs, and booking links.
- **Dining & Shopping Highlights** offers filter chips (Breakfast, Family, Luxury, Duty Free) and curated venue cards with partner promos prioritized.
- **Partner Carousel** follows highlights, reinforcing sponsor offers within the content flow.
- **Alerts & Announcements** provides dismissible security and disruption banners, with CMS control for locale-specific messaging.

---

## 🎨 Theme & Micro-Interactions
- Update hero gradient to a softened palette (e.g., `from-sky-600 via-blue-500 to-blue-700`) with a lighter overlay to improve text contrast.
- Apply section backgrounds using `from-slate-100 via-white to-sky-50` gradients and white cards with subtle elevation.
- Standardize icon usage with a shared Lucide/Heroicon set stored in a centralized `IconMap`.
- Introduce card hover lift, CTA ripple/focus states, and carousel auto-snap behavior for polished interactivity.

---

## 📊 Data & CMS Notes
- Add CMS fields for status metrics with manual override flags until live feeds are connected.
- Introduce highlight categories and partner promotion ordering controls.
- Wire transport data to support future live integrations (e.g., metro GTFS, taxi fleet API) while seeding static schedules for QA.

---

## 🧾 Verification
Run:

```bash
scripts/verify-phase10.sh
```

Expected checks:

- `docs/phase-10.md` exists.
- Roadmap lists Phase 10 with correct status.
- `.codex/meta/phase-10.json` references deliverables and verification script.
- Locale keys under `i18n` contain new homepage namespaces.
- Layout components exist under `src/app/(site)/` (or designated directory) with shared design tokens.

---

## 📚 References
- Istanbul Airport visitor guide benchmarks — `sketchboard/homepage-wireframes.png`.
- Next.js server components documentation: https://nextjs.org/docs/app/building-your-application/rendering/server-components
- Tailwind design tokens pattern: https://tailwindcss.com/docs/theme

---

## 🗺️ Status
✅ Completed — Phase 10 merged to `development` with refreshed homepage modules, design tokens, and supporting content pipelines.

