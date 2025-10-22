import Link from "next/link";

import { Plane, Search } from "lucide-react";

import { ctaIcon as CtaIcon, gradients, resolveIcon, transitions } from "@/styles/design-tokens";
import Button from "@/components/Button";

type PlannerAction = {
  label: string;
  href: string;
  icon?: string;
};

type PlannerStripProps = {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryCta?: { label: string; href: string };
    greeting?: string;
    media?: { imageUrl?: string | null; alt?: string | null };
  };
  plannerCopy: {
    searchLabel: string;
    searchPlaceholder: string;
    searchCta: string;
    supporting: string;
    shortcutsLabel: string;
    secondaryHeading: string;
    secondaryOverflow: string;
  };
  searchAction: string;
  primaryActions: {
    arrivals: PlannerAction;
    departures: PlannerAction;
  };
  transportAction: PlannerAction;
  secondaryActions: PlannerAction[];
  quickLinksLabel: string;
  partnerPromotion?: {
    label: string;
    headline: string;
    subheadline?: string | null;
    cta: { label: string; href: string };
  } | null;
};

const QuickActionPill = ({ action }: { action: PlannerAction }) => {
  const IconComponent = resolveIcon(action.icon ?? "default");
  const isExternal = action.href.startsWith("http");
  return (
    <Link
      href={action.href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={[
        "flex items-center gap-2 rounded-none border border-sky-100 bg-white/90 px-4 py-2 text-sm font-semibold text-sky-700 shadow-sm shadow-sky-100",
        transitions.base,
        "hover:border-sky-200 hover:shadow-md hover:shadow-sky-200",
      ].join(" ")}
    >
      <IconComponent className="h-4 w-4" aria-hidden />
      <span>{action.label}</span>
      <span aria-hidden className="ml-auto text-base text-sky-500">
        ↗
      </span>
    </Link>
  );
};

const SecondaryQuickLink = ({ action }: { action: PlannerAction }) => {
  const IconComponent = resolveIcon(action.icon ?? "default");
  const isExternal = action.href.startsWith("http");
  return (
    <Link
      href={action.href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={[
        "flex items-center gap-3 rounded-none border border-slate-200/60 bg-white/90 px-4 py-3 text-sm text-slate-700",
        transitions.base,
        "hover:border-sky-200 hover:bg-white hover:text-slate-900",
      ].join(" ")}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-none bg-sky-100 text-sky-600">
        <IconComponent className="h-4 w-4" aria-hidden />
      </span>
      <span className="font-medium">{action.label}</span>
    </Link>
  );
};

const HeroFlightLink = ({ action }: { action: PlannerAction }) => {
  const isExternal = action.href.startsWith("http");
  const IconComponent = resolveIcon(action.icon ?? "plane");
  return (
    <Link
      href={action.href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={[
        "inline-flex items-center gap-3 rounded-none border border-sky-100 bg-white/95 px-4 py-2 text-sm font-semibold text-sky-700 shadow-sm shadow-sky-100",
        transitions.base,
        "hover:border-sky-200 hover:text-sky-600",
      ].join(" ")}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-none bg-sky-50 text-sky-600">
        <IconComponent className="h-4 w-4" aria-hidden />
      </span>
      <span>{action.label}</span>
      <span aria-hidden className="ml-auto text-base text-sky-400">↗</span>
    </Link>
  );
};

export function PlannerStrip({
  hero,
  plannerCopy,
  searchAction,
  primaryActions,
  transportAction,
  secondaryActions,
  quickLinksLabel,
  partnerPromotion,
}: PlannerStripProps) {
  const featuredQuickLinks = [transportAction, ...secondaryActions.slice(0, 2)];
  const remainingSecondary = secondaryActions.filter((action) =>
    featuredQuickLinks.every((featured) => featured.href !== action.href)
  );
  const secondaryPool = remainingSecondary.length ? remainingSecondary : secondaryActions;
  const secondaryLimit = 4;
  const trimmedSecondary = secondaryPool.slice(0, secondaryLimit);
  const hasMoreSecondary = secondaryPool.length > secondaryLimit;

  const supportingId = "planner-search-supporting";

  return (
    <section className="relative">
      <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-white/70 via-white to-transparent" aria-hidden />
      <div className="relative w-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="relative overflow-hidden rounded-none bg-gradient-to-br from-sky-300 via-sky-200 to-sky-100 text-sky-900 shadow-[0_45px_100px_-70px_rgba(14,116,203,0.35)]">
            <div className="absolute inset-0">
              {hero.media?.imageUrl ? (
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${hero.media.imageUrl})` }}
                  role="img"
                  aria-label={hero.media.alt ?? hero.title}
                />
              ) : (
                <div className={`absolute inset-0 bg-gradient-to-br ${gradients.hero}`} aria-hidden />
              )}
              <div className={`absolute inset-0 bg-gradient-to-br ${gradients.heroOverlay}`} aria-hidden />
            </div>

            <div className="relative z-10 flex h-full flex-col justify-between gap-8 p-8 sm:p-10">
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-none bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-800 shadow-sm">
                    <Plane className="h-4 w-4" aria-hidden />
                    {hero.eyebrow}
                  </span>
                  {hero.greeting ? (
                    <span className="inline-flex items-center rounded-none bg-white/65 px-3 py-1 text-xs font-semibold text-sky-700">
                      {hero.greeting}
                    </span>
                  ) : null}
                </div>
                <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
                  {hero.title}
                </h1>
                <p className="max-w-xl text-base text-white/85 sm:text-lg">{hero.subtitle}</p>
                {hero.primaryCta ? (
                  <Link
                    href={hero.primaryCta.href}
                    className="inline-flex items-center gap-2 rounded-none bg-white px-5 py-2 text-sm font-semibold text-sky-800 shadow-sm shadow-sky-200 transition duration-200 hover:text-sky-600"
                  >
                    {hero.primaryCta.label}
                    <CtaIcon className="h-4 w-4" aria-hidden />
                  </Link>
                ) : null}
              </div>

              <div className="self-end w-full max-w-[650px] rounded-none border border-slate-100 bg-white p-6 text-slate-900 shadow-[0_28px_55px_-32px_rgba(15,23,42,0.35)]">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                      {plannerCopy.searchLabel}
                    </p>
                    <p id={supportingId} className="text-sm text-slate-600">
                      {plannerCopy.supporting}
                    </p>
                  </div>
                  <form
                    action={searchAction}
                    method="get"
                    className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                  >
                    <label className="flex items-center gap-3 rounded-none border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm shadow-slate-900/5 focus-within:border-sky-300 focus-within:ring-1 focus-within:ring-sky-200">
                      <Search className="h-4 w-4 text-sky-500" aria-hidden />
                      <input
                        className="w-full border-none bg-transparent text-base font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
                        placeholder={plannerCopy.searchPlaceholder}
                        aria-label={plannerCopy.searchLabel}
                        aria-describedby={supportingId}
                        name="q"
                        required
                        autoComplete="off"
                        maxLength={80}
                      />
                    </label>
                    <Button
                      type="submit"
                      icon={<Search className="h-4 w-4 text-white" aria-hidden />}
                      label={plannerCopy.searchCta}
                      className="w-full rounded-none sm:w-auto sm:self-stretch"
                    />
                  </form>
                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">
                      {plannerCopy.shortcutsLabel}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {[primaryActions.departures, primaryActions.arrivals].map((action) => (
                        <HeroFlightLink key={`${action.label}-${action.href}`} action={action} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="space-y-5 rounded-none border border-slate-200/60 bg-white/95 p-6 shadow-[0_35px_80px_-65px_rgba(15,23,42,0.28)]">
              <div className="space-y-1">
                <span className="text-sm font-semibold text-slate-700">{quickLinksLabel}</span>
                <p className="text-xs text-slate-500">{plannerCopy.secondaryHeading}</p>
              </div>
              {featuredQuickLinks.length ? (
                <div className="flex flex-wrap gap-2">
                  {featuredQuickLinks.map((action) => (
                    <QuickActionPill key={`${action.label}-${action.href}`} action={action} />
                  ))}
                </div>
              ) : null}
              <div className="grid gap-3 sm:grid-cols-2">
                {trimmedSecondary.map((action) => (
                  <SecondaryQuickLink key={`${action.label}-${action.href}`} action={action} />
                ))}
              </div>
              {hasMoreSecondary ? (
                <p className="text-xs text-slate-500">{plannerCopy.secondaryOverflow}</p>
              ) : null}

              {partnerPromotion ? (
                <div className="space-y-3 rounded-none border border-brand-gold/40 bg-gradient-to-br from-brand-gold/15 via-white to-brand-gold/10 p-5 text-slate-900 shadow-sm shadow-brand-gold/20">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold/80">
                    {partnerPromotion.label}
                  </span>
                  <div className="space-y-2">
                    <p className="text-base font-semibold">{partnerPromotion.headline}</p>
                    {partnerPromotion.subheadline ? (
                      <p className="text-sm text-slate-600">{partnerPromotion.subheadline}</p>
                    ) : null}
                  </div>
                  <Link
                    href={partnerPromotion.cta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 underline-offset-4 transition hover:text-sky-600 hover:underline"
                  >
                    {partnerPromotion.cta.label}
                    <CtaIcon className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PlannerStrip;
