# Homepage experience review

_Date: 2024-05-21_

## First-impression takeaways
- The hero successfully delivers the new photographic treatment, but the deep navy gradient and heavy overlay still mute the media and can feel moody for first-time visitors looking for reassurance. Lightening the gradient and using a thinner overlay would let the tower image carry more warmth while keeping text legible.【F:src/app/[locale]/(site)/components/PlannerStrip.tsx†L150-L190】
- The hero flight search is now clear, yet it still posts to `#` with no handling. Wiring the form to a flight-results route or server action (and surfacing validation for empty input) will make the CTA feel trustworthy instead of decorative.【F:src/app/[locale]/(site)/components/PlannerStrip.tsx†L199-L219】

## Opportunities to simplify busy areas
- The quick links column shows up to eight secondary buttons plus transport pills, so the panel competes with the hero headline. Consider collapsing the secondary list behind a "Show more services" disclosure or limiting it to the top four actions sourced from analytics.【F:src/app/[locale]/(site)/components/PlannerStrip.tsx†L231-L305】
- Instant alerts appear in three places (global ticker, hero card, and the travel updates band). Consolidating them into the top ticker plus the detailed AlertsBanner would reduce repetition while keeping critical messaging prominent.【F:src/app/[locale]/(site)/components/PlannerStrip.tsx†L249-L280】【F:src/app/[locale]/(site)/components/InstantAlerts.tsx†L41-L105】【F:src/app/[locale]/(site)/page.tsx†L587-L624】
- The first content band stacks the pre-travel strip, itinerary timeline, and status snapshot together, which can feel dense. Splitting the operations snapshot into its own contrasting band (or moving the itinerary cards into the journey section) would create clearer breathing room between planning tasks.【F:src/app/[locale]/(site)/page.tsx†L455-L485】

## Enhancements to increase delight
- Introduce contextual microcopy or icons near the arrivals/departures quick links so travelers understand they are shortcuts rather than tabs; currently both buttons share the same arrow glyph as other tertiary links.【F:src/app/[locale]/(site)/components/PlannerStrip.tsx†L221-L305】
- Expand the highlights carousel tiles with price ranges or estimated visit times pulled from the Prisma records to help travelers prioritize which on-airport experience to explore first.【F:src/app/[locale]/(site)/components/HighlightsGrid.tsx†L123-L149】
- Give the status snapshot cards a freshness timestamp or "updated x minutes ago" label so users know whether the metrics reflect live conditions, especially once live feeds arrive in Phase 11.【F:src/app/[locale]/(site)/components/StatusSnapshot.tsx†L47-L76】

These adjustments should keep the brighter aesthetic while reducing perceived clutter and building more trust in the hero search flow.
