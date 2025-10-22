'use client';

import Link from "next/link";
import { useMemo, useState } from "react";

import Button from "@/components/Button";
import { resolveIcon, transitions } from "@/styles/design-tokens";

type TransportOption = {
  id: number;
  mode: string;
  status: string;
  description: string;
  badgeText?: string | null;
  nextDeparture?: string | null;
  frequency?: string | null;
  ctaText?: string | null;
  ctaUrl?: string | null;
};

type TransportTabsProps = {
  title: string;
  description: string;
  options: TransportOption[];
  featuredOffer?: {
    label: string;
    description: string;
    cta?: { label: string; href: string };
  };
  labels: {
    statusDetail: string;
    nextDeparture: string;
    frequency: string;
    bookingLead: string;
    book: string;
  };
  className?: string;
};

const statusTone = (status: string) => {
  const normalized = status.toLowerCase();
  if (normalized.includes("limited") || normalized.includes("delay")) {
    return "bg-amber-100 text-amber-700";
  }
  if (normalized.includes("closed") || normalized.includes("suspended")) {
    return "bg-rose-100 text-rose-700";
  }
  return "bg-emerald-100 text-emerald-700";
};

export default function TransportTabs({ title, description, options, featuredOffer, labels, className }: TransportTabsProps) {
  const [activeMode, setActiveMode] = useState<string>(options[0]?.mode ?? "");

  const activeOption = useMemo(
    () => options.find((option) => option.mode === activeMode) ?? options[0],
    [options, activeMode],
  );

  if (!options.length) {
    return null;
  }

  return (
    <section
      className={[
        "space-y-6 rounded-xl border border-white/40 bg-white/85 p-6 shadow-md shadow-slate-200/50 backdrop-blur",
        className ?? "",
      ].join(" ")}
    >
      <header className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-[0.4em] text-sky-600">{title}</span>
        <p className="text-sm text-slate-600">{description}</p>
      </header>

        {featuredOffer ? (
          <div className="rounded-xl border border-sky-200 bg-sky-50/70 p-5 text-slate-800 shadow-sm shadow-sky-100">
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-sky-600">{featuredOffer.label}</span>
            <p className="mt-2 text-sm text-slate-700">{featuredOffer.description}</p>
            {featuredOffer.cta ? (
              <Link
                href={featuredOffer.cta.href}
                target={featuredOffer.cta.href.startsWith("http") ? "_blank" : undefined}
                rel={featuredOffer.cta.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2 text-xs font-semibold text-white shadow-[0_10px_20px_-12px_rgba(14,165,233,0.6)] transition hover:bg-sky-400"
              >
                {featuredOffer.cta.label}
                <span aria-hidden>↗</span>
              </Link>
            ) : null}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const Icon = resolveIcon(option.mode.toLowerCase());
          const isActive = option.mode === activeMode;
          return (
            <Button
              key={option.mode}
              type="button"
              variant="unstyled"
              onClick={() => setActiveMode(option.mode)}
              className={[
                "inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold",
                transitions.base,
                isActive
                  ? "border-sky-500 bg-sky-500 text-white shadow-sm"
                  : "border-transparent bg-slate-100 text-slate-700 hover:border-sky-200 hover:text-sky-600",
              ].join(" ")}
            >
              <Icon className="h-4 w-4" aria-hidden />
              <span>{option.mode}</span>
            </Button>
          );
        })}
      </div>

      {activeOption ? (
        <article
          className={[
            "grid gap-6 rounded-xl bg-white p-6 shadow-sm shadow-slate-200/50 md:grid-cols-[2fr,1fr]",
          ].join(" ")}
        >
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">{activeOption.mode}</h3>
                <p className="text-sm text-slate-600">{activeOption.description}</p>
              </div>
              <span className={`rounded-full px-4 py-2 text-xs font-semibold ${statusTone(activeOption.status)}`}>
                {activeOption.status}
              </span>
            </div>
            <dl className="grid gap-4 sm:grid-cols-2">
              {activeOption.badgeText ? (
                <StatusDetail label={labels.statusDetail} value={activeOption.badgeText} icon={activeOption.mode} />
              ) : null}
              {activeOption.nextDeparture ? (
                <StatusDetail label={labels.nextDeparture} value={activeOption.nextDeparture} icon="schedule" />
              ) : null}
              {activeOption.frequency ? (
                <StatusDetail label={labels.frequency} value={activeOption.frequency} icon="schedule" />
              ) : null}
            </dl>
          </div>
          <aside className="flex flex-col gap-4 rounded-lg bg-sky-50 p-5 text-slate-800 shadow-sm shadow-slate-200/40">
            <p className="text-sm text-slate-600">{labels.bookingLead}</p>
            {activeOption.ctaText && activeOption.ctaUrl ? (
              <Link
                href={activeOption.ctaUrl}
                target={activeOption.ctaUrl.startsWith("http") ? "_blank" : undefined}
                rel={activeOption.ctaUrl.startsWith("http") ? "noopener noreferrer" : undefined}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_24px_-15px_rgba(14,165,233,0.5)] transition hover:bg-sky-400"
              >
                {activeOption.ctaText}
                <span aria-hidden>↗</span>
              </Link>
            ) : null}
            <p className="text-xs text-slate-500">{labels.book}</p>
          </aside>
        </article>
      ) : null}
    </section>
  );
}

const StatusDetail = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: string;
}) => {
  const Icon = resolveIcon(icon ?? "default");
  return (
    <div className="flex items-center gap-3 rounded-lg bg-slate-100 px-4 py-3">
      <Icon className="h-4 w-4 text-sky-600" aria-hidden />
      <div>
        <dt className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">{label}</dt>
        <dd className="text-sm font-medium text-slate-800">{value}</dd>
      </div>
    </div>
  );
};
