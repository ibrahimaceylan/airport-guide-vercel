import { getTranslations } from "next-intl/server";

import prisma from "@/lib/prisma";
import { getActiveCampaignsByPlacement, type CampaignPlacementValue } from "@/lib/campaigns";

import AlertsBanner from "./components/AlertsBanner";
import FlightsSnapshot from "./components/FlightsSnapshot";
import HighlightsGrid from "./components/HighlightsGrid";
import JourneyGrid from "./components/JourneyGrid";
import PartnerCarousel from "./components/PartnerCarousel";
import PlannerStrip from "./components/PlannerStrip";
import PreTravelStrip from "./components/PreTravelStrip";
import ItineraryTimeline from "./components/ItineraryTimeline";
import StatusSnapshot from "./components/StatusSnapshot";
import TransportTabs from "./components/TransportTabs";
import { gradients } from "@/styles/design-tokens";

type LocaleParams = { locale: string };
type ParamsInput = LocaleParams | Promise<LocaleParams>;

async function resolveParams(params: ParamsInput): Promise<LocaleParams> {
  if (typeof (params as Promise<LocaleParams>).then === "function") {
    return params as Promise<LocaleParams>;
  }
  return params as LocaleParams;
}

const fetchHomepageData = async (locale: string) => {
  const [hero, quickLinks, statusMetrics, journeyTiles, transports, highlights, alerts, flights] =
    await Promise.all([
      prisma.hero.findFirst({ orderBy: { id: "asc" } }),
      prisma.quickLink.findMany({ orderBy: { id: "asc" } }),
      prisma.statusMetric.findMany({
        where: {
          active: true,
          OR: [{ locale: "all" }, { locale }],
        },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.journeyTile.findMany({
        where: {
          active: true,
          OR: [{ locale: "all" }, { locale }],
        },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.transport.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.highlight.findMany({
        orderBy: [{ spotlight: "desc" }, { id: "asc" }],
      }),
      prisma.alert.findMany({
        where: {
          active: true,
          OR: [{ locale: "all" }, { locale }],
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.flight.findMany({ orderBy: { departure: "asc" }, take: 10 }),
    ]);

  const campaigns = await getActiveCampaignsByPlacement(locale);

  return {
    hero,
    quickLinks,
    statusMetrics,
    journeyTiles,
    transports,
    highlights,
    alerts,
    flights,
    campaigns,
  };
};

const buildTrackingUrl = (slug: string, placement: CampaignPlacementValue, locale: string) =>
  `/go/${slug}?placement=${placement}&locale=${locale}`;

const filterAlertsBySchedule = (
  alerts: Awaited<ReturnType<typeof fetchHomepageData>>["alerts"]
) => {
  const now = new Date();
  return alerts.filter((alert) => {
    if (alert.startAt && alert.startAt > now) return false;
    if (alert.endAt && alert.endAt < now) return false;
    return true;
  });
};

const normalizeQuickLinks = (
  quickLinks: Awaited<ReturnType<typeof fetchHomepageData>>["quickLinks"]
) => {
  return quickLinks.reduce<Record<string, (typeof quickLinks)[number]>>((acc, link) => {
    acc[link.label.trim().toLowerCase()] = link;
    return acc;
  }, {});
};

const formatFlightTime = (date: Date, locale: string) =>
  new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

const formatRelativeTimeFromNow = (date: Date, locale: string) => {
  const now = Date.now();
  const diff = now - date.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (Math.abs(diff) < minute) {
    return formatter.format(0, "minute");
  }

  if (Math.abs(diff) < hour) {
    return formatter.format(-Math.round(diff / minute), "minute");
  }

  if (Math.abs(diff) < day) {
    return formatter.format(-Math.round(diff / hour), "hour");
  }

  return formatter.format(-Math.round(diff / day), "day");
};

export default async function LocaleHomePage({ params }: { params: ParamsInput }) {
  const { locale } = await resolveParams(params);

  const [
    plannerT,
    statusT,
    journeyT,
    transportT,
    highlightsT,
    alertsT,
    partnersT,
    flightsT,
    preTravelT,
    timelineT,
    bandsT,
  ] = await Promise.all([
    getTranslations({ locale, namespace: "homepage.planner" }),
    getTranslations({ locale, namespace: "homepage.status" }),
    getTranslations({ locale, namespace: "homepage.journey" }),
    getTranslations({ locale, namespace: "homepage.transport" }),
    getTranslations({ locale, namespace: "homepage.highlights" }),
    getTranslations({ locale, namespace: "homepage.alerts" }),
    getTranslations({ locale, namespace: "homepage.partners" }),
    getTranslations({ locale, namespace: "homepage.flights" }),
    getTranslations({ locale, namespace: "homepage.pretravel" }),
    getTranslations({ locale, namespace: "homepage.timeline" }),
    getTranslations({ locale, namespace: "homepage.bands" }),
  ]);

  const {
    hero,
    quickLinks,
    statusMetrics,
    journeyTiles,
    transports,
    highlights,
    alerts,
    flights,
    campaigns,
  } = await fetchHomepageData(locale);

  const quickLinkLookup = normalizeQuickLinks(quickLinks);

  const plannerActions = plannerT.raw("actions") as {
    arrivals: { label: string; href?: string; icon?: string };
    departures: { label: string; href?: string; icon?: string };
  };
  const plannerSecondary = plannerT.raw("secondary") as Array<{
    label: string;
    href?: string;
    icon?: string;
  }>;
  const plannerTransport = plannerT.raw("transport") as {
    label: string;
    icon?: string;
    fallbackCta?: string;
  };

  const plannerHero = {
    eyebrow: plannerT("eyebrow"),
    title: hero?.title ?? plannerT("title"),
    subtitle: hero?.subtitle ?? plannerT("subtitle"),
    primaryCta:
      hero?.ctaText && hero?.ctaLink ? { label: hero.ctaText, href: hero.ctaLink } : undefined,
    greeting: plannerT("greeting"),
    media: hero?.imageUrl
      ? {
          imageUrl: hero.imageUrl,
          alt: plannerT("heroImageAlt"),
        }
      : {
          imageUrl: "/images/hero-airport-tower.svg",
          alt: plannerT("heroImageAlt"),
        },
  };

  const plannerQuickLinksLabel = plannerT("quickLinksLabel");

  const flightSearchAction = `/${locale}/flights`;

  const plannerCopy = {
    searchLabel: plannerT("searchLabel"),
    searchPlaceholder: plannerT("searchPlaceholder"),
    supporting: plannerT("supporting"),
    searchCta: plannerT("searchCta"),
    shortcutsLabel: plannerT("shortcutsLabel"),
    secondaryHeading: plannerT("secondaryHeading"),
    secondaryOverflow: plannerT("secondaryOverflow"),
  };

  const resolveLink = (action: { label: string; href?: string; icon?: string }) => {
    const fallback = quickLinkLookup[action.label.trim().toLowerCase()];
    return {
      label: action.label,
      href: action.href ?? fallback?.url ?? "#",
      icon: action.icon ?? fallback?.icon ?? "plane",
    };
  };

  const primaryActions = {
    arrivals: resolveLink(plannerActions.arrivals),
    departures: resolveLink(plannerActions.departures),
  };

  const transportOffer = transports.find((transport) => transport.ctaText && transport.ctaUrl);
  const transportFallbackLink =
    quickLinks.find((link) => link.label.toLowerCase().includes("transport")) ??
    quickLinks.find((link) => link.label.toLowerCase().includes("shuttle"));

  const transportAction = {
    label: transportOffer?.ctaText ?? plannerTransport.label,
    href: transportOffer?.ctaUrl ?? transportFallbackLink?.url ?? "#",
    icon: plannerTransport.icon ?? "bus-front",
  };

  const secondaryActions = plannerSecondary
    .map(resolveLink)
    .filter((action) => action.href !== transportAction.href);

  const preTravelConfig = preTravelT.raw("actions") as Array<{
    label: string;
    icon?: string;
    match?: string;
    fallbackUrl?: string;
  }>;

  const lookupQuickLink = (match?: string) => {
    if (!match) return undefined;
    const normalized = match.toLowerCase();
    return quickLinks.find((link) => link.label.toLowerCase().includes(normalized));
  };

  const preTravelActions = preTravelConfig
    .map((action) => {
      const fallback = lookupQuickLink(action.match);
      return {
        label: action.label,
        icon: action.icon,
        href: action.fallbackUrl ?? fallback?.url ?? "#",
      };
    })
    .filter((action) => action.href && action.href !== "#");

  const combinedPreTravelActions = [transportAction, ...preTravelActions];
  const uniquePreTravelActions = Array.from(
    new Map(combinedPreTravelActions.map((action) => [action.href, action])).values(),
  );

  const timelineSteps = (timelineT.raw("steps") as Array<{
    title: string;
    description: string;
    icon?: string;
  }>) ?? [];

  const heroCampaign = campaigns.HERO_TILE?.[0]
    ? {
        ...campaigns.HERO_TILE[0],
        trackingUrl: buildTrackingUrl(
          campaigns.HERO_TILE[0].slug,
          campaigns.HERO_TILE[0].placement.placement,
          locale
        ),
      }
    : null;

  const statusFallback = statusT.raw("fallback") as {
    departures: { title: string; unit?: string; trend?: string };
    security: { title: string; unit?: string; trend?: string };
    parking: { title: string; unit?: string; trend?: string };
  };

  let statusSnapshotMetrics =
    statusMetrics.length > 0
      ? statusMetrics.map((metric) => ({
          id: `${metric.type}-${metric.id}`,
          title: metric.title,
          metric: metric.metric,
          unit: metric.unit,
          trendLabel: metric.trendLabel ?? metric.trendValue ?? undefined,
          icon: metric.icon ?? undefined,
          updatedLabel: metric.updatedAt
            ? statusT("updated", { time: formatRelativeTimeFromNow(metric.updatedAt, locale) })
            : undefined,
        }))
      : [
          {
            id: "departures-fallback",
            title: statusFallback.departures.title,
            metric: String(flights.length || 0),
            unit: statusFallback.departures.unit,
            trendLabel: statusFallback.departures.trend,
            icon: "plane-takeoff",
            updatedLabel: null,
          },
          {
            id: "security-fallback",
            title: statusFallback.security.title,
            metric: "15",
            unit: statusFallback.security.unit,
            trendLabel: statusFallback.security.trend,
            icon: "shield-alert",
            updatedLabel: null,
          },
          {
            id: "parking-fallback",
            title: statusFallback.parking.title,
            metric: "72%",
            unit: statusFallback.parking.unit,
            trendLabel: statusFallback.parking.trend,
            icon: "parking-circle",
            updatedLabel: null,
          },
        ];

  if (transportOffer) {
    statusSnapshotMetrics = [
      {
        id: `transport-offer-${transportOffer.id}`,
        title: transportT("highlight.title"),
        metric: transportOffer.badgeText ?? transportOffer.mode,
        unit: transportOffer.frequency ?? undefined,
        trendLabel: transportOffer.ctaText ?? transportT("highlight.cta"),
        icon: transportAction.icon,
        updatedLabel: null,
      },
      ...statusSnapshotMetrics,
    ];
  }

  const journeyBefore = journeyTiles
    .filter((tile) => tile.stage === "BEFORE_FLIGHT")
    .map((tile) => ({
      id: tile.id,
      stage: "before" as const,
      title: tile.title,
      description: tile.description,
      icon: tile.icon ?? undefined,
      ctaLabel: tile.ctaLabel ?? undefined,
      ctaUrl: tile.ctaUrl ?? undefined,
      partnerTag: tile.partnerSlug ?? undefined,
    }));

  const journeyArrival = journeyTiles
    .filter((tile) => tile.stage === "ON_ARRIVAL")
    .map((tile) => ({
      id: tile.id,
      stage: "arrival" as const,
      title: tile.title,
      description: tile.description,
      icon: tile.icon ?? undefined,
      ctaLabel: tile.ctaLabel ?? undefined,
      ctaUrl: tile.ctaUrl ?? undefined,
      partnerTag: tile.partnerSlug ?? undefined,
    }));

  const transportOptions = transports.map((transport) => ({
    id: transport.id,
    mode: transport.mode,
    status: transport.status,
    description: transport.description,
    badgeText: transport.badgeText ?? undefined,
    nextDeparture: transport.nextDeparture ?? undefined,
    frequency: transport.frequency ?? undefined,
    ctaText: transport.ctaText ?? undefined,
    ctaUrl: transport.ctaUrl ?? undefined,
  }));

  const transportFeatured = transportOffer
    ? {
        label: transportT("banner.label"),
        description: transportOffer.description ?? "",
        cta: {
          label: transportT("banner.cta"),
          href: transportOffer.ctaUrl ?? "#",
        },
      }
    : undefined;

  const highlightFilters =
    (highlightsT.raw("filters") as Array<{ id: string; label: string }>) ?? [];

  const filteredAlerts = filterAlertsBySchedule(alerts);

  const quickLinkCampaigns = (campaigns.QUICK_LINK ?? []).map((campaign) => ({
    ...campaign,
    trackingUrl: buildTrackingUrl(campaign.slug, campaign.placement.placement, locale),
  }));

  const featuredCampaigns = (campaigns.FEATURED_SECTION ?? []).map((campaign) => ({
    ...campaign,
    trackingUrl: buildTrackingUrl(campaign.slug, campaign.placement.placement, locale),
  }));

  const flightsSnapshot = flights.map((flight) => ({
    id: flight.id,
    flightNo: flight.flightNo,
    destination: flight.destination,
    status: flight.status,
    departure: formatFlightTime(flight.departure, locale),
  }));

  const bandCopy = {
    planAhead: {
      eyebrow: bandsT("planAhead.eyebrow"),
      title: bandsT("planAhead.title"),
      description: bandsT("planAhead.description"),
    },
    planJourney: {
      eyebrow: bandsT("planJourney.eyebrow"),
      title: bandsT("planJourney.title"),
      description: bandsT("planJourney.description"),
    },
    atAirport: {
      eyebrow: bandsT("atAirport.eyebrow"),
      title: bandsT("atAirport.title"),
      description: bandsT("atAirport.description"),
    },
    travelUpdates: {
      eyebrow: bandsT("travelUpdates.eyebrow"),
      title: bandsT("travelUpdates.title"),
      description: bandsT("travelUpdates.description"),
    },
  };

  const highlightsSpotlightLabel = highlightsT("spotlightLabel");

  return (
    <div className={`flex flex-col gap-0 bg-gradient-to-b ${gradients.pageBackground} text-slate-800`}>
      <section className="bg-gradient-to-b from-sky-100 via-white to-white">
        <div className="mx-auto w-full">
          <PlannerStrip
            hero={plannerHero}
            plannerCopy={plannerCopy}
            searchAction={flightSearchAction}
            primaryActions={primaryActions}
            transportAction={transportAction}
            secondaryActions={secondaryActions}
            quickLinksLabel={plannerQuickLinksLabel}
            partnerPromotion={
              heroCampaign
                ? {
                    label: partnersT("slotLabel"),
                    headline: heroCampaign.headline,
                    subheadline: heroCampaign.subheadline,
                    cta: { label: heroCampaign.ctaText, href: heroCampaign.trackingUrl },
                  }
                : null
            }
          />
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="w-full space-y-10 px-4 py-16 sm:px-6 lg:px-10">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-600">
              {bandCopy.planAhead.eyebrow}
            </span>
            <h2 className="text-3xl font-semibold text-slate-900">{bandCopy.planAhead.title}</h2>
            <p className="text-sm text-slate-600">{bandCopy.planAhead.description}</p>
          </div>
          <PreTravelStrip
            title={preTravelT("title")}
            subtitle={preTravelT("subtitle")}
            actions={uniquePreTravelActions}
          />
        </div>
      </section>

      <section className="border-b border-slate-200 bg-gradient-to-br from-white via-sky-50 to-sky-100">
        <div className="w-full px-4 py-16 sm:px-6 lg:px-10">
          <StatusSnapshot
            title={statusT("title")}
            description={statusT("description")}
            metrics={statusSnapshotMetrics}
            className="mx-auto max-w-6xl border-sky-100 bg-white/95 shadow-[0_35px_80px_-55px_rgba(14,116,203,0.35)]"
            eyebrowClassName="text-sky-600"
            descriptionClassName="text-slate-600"
          />
        </div>
      </section>

      <section className="bg-gradient-to-br from-sky-50 via-blue-50 to-white text-slate-800">
        <div className="w-full space-y-10 px-4 py-16 sm:px-6 lg:px-10">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-600">
              {bandCopy.planJourney.eyebrow}
            </span>
            <h2 className="text-3xl font-semibold text-slate-900">{bandCopy.planJourney.title}</h2>
            <p className="text-sm text-slate-600">{bandCopy.planJourney.description}</p>
          </div>
          <JourneyGrid
            beforeFlight={journeyBefore}
            onArrival={journeyArrival}
            labels={{
              beforeTitle: journeyT("beforeTitle"),
              beforeDescription: journeyT("beforeDescription"),
              arrivalTitle: journeyT("arrivalTitle"),
              arrivalDescription: journeyT("arrivalDescription"),
              partnerTag: journeyT("partnerTag"),
            }}
            theme={{
              section: "grid gap-6 lg:grid-cols-2",
              column: "space-y-4 rounded-3xl border border-sky-100 bg-white/90 p-6 shadow-[0_25px_60px_-40px_rgba(14,165,233,0.25)]",
              heading: "text-xl font-semibold text-slate-900",
              description: "text-sm text-slate-600",
              tile: "rounded-xl border border-sky-100 bg-sky-50/70 p-4 shadow-sm shadow-sky-100",
              tileHover: "hover:-translate-y-0.5 hover:border-sky-200 hover:bg-white",
              iconWrapper: "mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-sky-100",
              iconColor: "text-sky-600",
              tagBackground: "bg-sky-100",
              tagColor: "text-sky-700",
              cta: "text-sky-600 hover:text-sky-500",
              bodyText: "text-sm text-slate-600",
            }}
          />
          <ItineraryTimeline
            steps={timelineSteps.map((step, index) => ({
              title: step.title,
              description: step.description,
              icon: step.icon ?? ["plane-takeoff", "tram-front", "map"][index] ?? "plane",
            }))}
          />
          <TransportTabs
            title={transportT("title")}
            description={transportT("description")}
            options={transportOptions}
            featuredOffer={transportFeatured}
            labels={{
              statusDetail: transportT("labels.statusDetail"),
              nextDeparture: transportT("labels.nextDeparture"),
              frequency: transportT("labels.frequency"),
              bookingLead: transportT("labels.bookingLead"),
              book: transportT("labels.book"),
            }}
            className="border-sky-100 bg-white/95 shadow-[0_35px_80px_-45px_rgba(14,165,233,0.35)]"
          />
        </div>
      </section>

      <section className="bg-gradient-to-br from-amber-50 via-white to-sky-50">
        <div className="w-full space-y-10 px-4 py-16 sm:px-6 lg:px-10">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-600">
              {bandCopy.atAirport.eyebrow}
            </span>
            <h2 className="text-3xl font-semibold text-slate-900">{bandCopy.atAirport.title}</h2>
            <p className="text-sm text-slate-600">{bandCopy.atAirport.description}</p>
          </div>
          <HighlightsGrid
            title={highlightsT("title")}
            description={highlightsT("description")}
            highlights={highlights}
            filters={highlightFilters.length ? highlightFilters : [{ id: "all", label: "All" }]}
            spotlightLabel={highlightsSpotlightLabel}
            metaLabels={{
              price: highlightsT("meta.price"),
              duration: highlightsT("meta.duration"),
            }}
            theme={{
              container:
                "space-y-6 rounded-3xl border border-amber-100/70 bg-white/90 p-8 shadow-[0_30px_75px_-45px_rgba(251,191,36,0.6)] backdrop-blur",
              heading: "text-xs font-semibold uppercase tracking-[0.35em] text-amber-600",
              description: "text-sm text-slate-600",
              filterGroup: "flex flex-wrap gap-3",
              filterBase: "rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em]",
              filterActive: "bg-amber-500 text-white shadow",
              filterInactive: "bg-white text-slate-700 border border-amber-200 hover:bg-amber-50",
              card:
                "relative overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-[0_22px_55px_-40px_rgba(251,191,36,0.65)]",
              cardHover: "hover:-translate-y-1 hover:shadow-[0_30px_70px_-45px_rgba(251,191,36,0.65)]",
              badge:
                "absolute right-4 top-4 rounded-full bg-brand-gold px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-900",
              category: "text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-600",
              title: "text-lg font-semibold text-slate-900",
              body: "text-sm text-slate-600",
            }}
          />
          <PartnerCarousel
            campaigns={[...featuredCampaigns, ...quickLinkCampaigns]}
            locale={locale}
            labels={{
              title: partnersT("sectionTitle"),
              subtitle: partnersT("sectionSubtitle"),
              viewAll: partnersT("viewAll"),
              previous: partnersT("carousel.previous"),
              next: partnersT("carousel.next"),
            }}
          />
        </div>
      </section>

      <section className="bg-white">
        <div className="w-full space-y-10 px-4 py-16 sm:px-6 lg:px-10">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-600">
              {bandCopy.travelUpdates.eyebrow}
            </span>
            <h2 className="text-3xl font-semibold text-slate-900">{bandCopy.travelUpdates.title}</h2>
            <p className="text-sm text-slate-600">{bandCopy.travelUpdates.description}</p>
          </div>
          <div className="grid gap-8 lg:grid-cols-[0.95fr,1.05fr]">
            <AlertsBanner
              title={alertsT("title")}
              description={alertsT("description")}
              alerts={filteredAlerts.map((alert) => ({
                id: alert.id,
                title: alert.title,
                message: alert.message,
                severity: alert.severity,
                ctaLabel: alert.ctaLabel ?? undefined,
                ctaUrl: alert.ctaUrl ?? undefined,
                dismissible: alert.dismissible ?? undefined,
              }))}
              emptyMessage={alertsT("empty")}
            />
            <FlightsSnapshot
              title={flightsT("title")}
              description={flightsT("description")}
              empty={flightsT("empty")}
              cta={{ label: flightsT("cta.label"), href: flightsT("cta.href") }}
              headers={{
                flight: flightsT("headers.flight"),
                destination: flightsT("headers.destination"),
                departure: flightsT("headers.departure"),
                status: flightsT("headers.status"),
              }}
              flights={flightsSnapshot}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
