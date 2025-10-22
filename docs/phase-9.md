# Phase 9 — Partnerships & Commerce Integrations

## 🎯 Objective
Monetize the Istanbul Airport Guide by introducing affiliate-ready promotional slots, tracked outbound campaigns, and partner reporting that mirror the commercial funnels on stanstedairport.com (airlines, retail, services).

---

## 🧱 Deliverables

| Category | Deliverable | Description |
|----------|-------------|-------------|
| 🧩 **CMS Promo Slots** | Configurable partner blocks | Add CMS models for airline/shopping campaigns (logo, copy, CTA, tracking params). |
| 🔗 **Tracked Outbound Links** | Click-tracking middleware | Wrap external links through a `/go/[campaign]` endpoint that logs clicks and applies UTM tags. |
| 🛍️ **Promo Surfaces** | Homepage + detail placements | Display partner tiles on homepage hero, quick links, and dedicated landing sections. |
| 📈 **Analytics Metrics** | Dashboard extensions | Record outbound click events (locale, campaign, placement) and surface them in the admin analytics panel. |
| 📄 **Landing Templates** | Optional partner pages | Provide flexible landing-page layouts for airline/retail promos (CMS-driven content blocks). |
| ✅ **Verification** | `scripts/verify-phase9.sh` | Checks for CMS models, tracking route, analytics updates, and docs. |

---

## ⚙️ Implementation Plan
1. **Data Model & CMS**
   - Add Prisma models `PartnerCampaign`, `CampaignPlacement`, and `ClickEvent`.
   - Extend admin CMS to create/edit campaigns, assign placements (hero tile, quick links, banners).
2. **Tracking Layer**
   - Implement `/go/[campaign]/route.ts` that logs click, redirects to external URL with appended query params.
   - Fire analytics events via existing dashboard metrics (SWR, Recharts) and expose aggregated stats.
3. **Frontend Integration**
   - Update homepage to render partner slots (e.g., “Fly with Transavia”, “Shop at Duty Free”) with CTA button hooking into tracking endpoint.
   - Add dedicated “Partner Offers” page using modular content blocks from CMS.
4. **Reporting**
   - Extend `AnalyticsPanel` to include outbound clicks by partner, locale, and timeframe.
   - Provide CSV export or quick stats in admin for marketing teams.
5. **Documentation & Verification**
   - Document partner workflow (create campaign → assign placements → track performance).
   - Add `docs/phase-9.md`, roadmap updates, version snapshot, and new verification script to ensure all pieces exist.

---

## ✅ Implementation Summary
- Added Prisma models (`PartnerCampaign`, `CampaignPlacement`, `CampaignClickEvent`) with supporting enums for status and placement types.
- Implemented secure admin APIs (`/api/partners/campaigns`) plus a tracked redirect handler at `/go/[slug]` that records click metadata and appends UTM tags.
- Extended the admin console with a Partner Campaign manager (create/edit/delete, multi-placement selection) and wired analytics dashboard to show outbound click performance.
- Surfaced campaigns on the localized homepage (hero spotlight, quick link promos, featured offers, banner strip) pulling live data from Prisma.
- Polished the homepage partner experience with localized copy, multi-placement styling, and a carousel for featured deals plus analytics range/CSV export controls.
- Seeded sample campaigns (Transavia, Turkish Airlines Lounge, Duty Free) and updated the verification script/checklists for Phase 9.

---

## 🧭 Usage Notes
1. Navigate to **Admin → Partner Campaigns** to create or update offers. Set placements (hero, quick link, banner, featured, footer) and schedule windows.
2. Public users see live campaigns on `/[locale]`; outbound clicks route via `/go/[slug]?placement=...&locale=...` for tracking.
3. Review performance in the dashboard analytics panel (7-day click totals, top placements). CSV exports can be added later if needed.
4. Use the analytics panel range buttons (7/14/30 days) or export the current dataset as CSV for partner reporting.

Run seeds to load sample campaigns:

```bash
npx prisma db seed
```

---

## Partnerships UX Considerations
- Maintain high accessibility (alt text, focus states) for promotional content.
- Ensure affiliate CTAs open in new tabs with clear “external site” messaging.
- Allow marketing teams to schedule campaigns with start/end dates.

---

## 🧾 Verification
Run:

```bash
scripts/verify-phase9.sh
```

Expected checks:

- `docs/phase-9.md` exists.
- Prisma schema includes partner campaign tables.
- Tracking redirect route present.
- Analytics dashboard references outbound metrics.
- `.codex/meta/phase-9.json` defines deliverables and verification script.

---

## 📚 References
- Stansted Airport promotions: https://www.stanstedairport.com/shopping-and-eating/
- Affiliate link tracking best practices: https://support.google.com/analytics/answer/7275063
- Next.js middleware redirects: https://nextjs.org/docs/app/building-your-application/routing/route-handlers

---

## 🗺️ Status
✅ Completed — partner CMS, tracking, reporting, and homepage integration delivered in Phase 9.
