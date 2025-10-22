"use client";

import { useRef } from "react";
import Link from "next/link";
import type { CampaignPlacementValue } from "@/lib/campaigns";

type PartnerCampaignCard = {
  id: number;
  name: string;
  slug: string;
  headline: string;
  subheadline?: string | null;
  imageUrl?: string | null;
  ctaText: string;
  locale: string;
  trackingUrl: string;
  placement: {
    placement: CampaignPlacementValue;
    sortOrder: number;
  };
};

type PartnerCarouselProps = {
  campaigns: PartnerCampaignCard[];
  locale: string;
  labels: {
    title: string;
    subtitle: string;
    viewAll: string;
    previous: string;
    next: string;
  };
};

export default function PartnerCarousel({ campaigns, locale, buildUrl, labels }: PartnerCarouselProps) {
  if (!campaigns.length) return null;

  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollBy = (direction: "prev" | "next") => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollAmount = container.clientWidth * 0.9;
    container.scrollBy({
      left: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section id="partner-offers" className="space-y-4">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">{labels.title}</h2>
          <p className="text-sm text-slate-600">{labels.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollBy("prev")}
            aria-label={labels.previous}
            className="rounded-md border border-slate-200 p-2 text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scrollBy("next")}
            aria-label={labels.next}
            className="rounded-md border border-slate-200 p-2 text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
          >
            →
          </button>
          <Link
            href={`/${locale}/admin/partners`}
            className="hidden rounded-md border border-sky-200 px-4 py-2 text-xs font-semibold text-sky-600 transition hover:border-sky-300 hover:text-sky-700 md:inline-flex"
          >
            {labels.viewAll}
          </Link>
        </div>
      </header>

      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2"
        style={{ scrollBehavior: "smooth" }}
      >
        {campaigns.map((campaign) => (
          <article
            key={`${campaign.id}-${campaign.placement.placement}`}
            className="relative flex min-w-[280px] snap-start flex-col rounded-xl border border-slate-200 bg-white shadow-md transition hover:-translate-y-1 hover:shadow-lg md:min-w-[340px]"
          >
            {campaign.imageUrl ? (
              <div className="h-44 overflow-hidden rounded-t-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={campaign.imageUrl}
                  alt={campaign.headline}
                  className="h-full w-full object-cover transition-transform duration-300 ease-out hover:scale-105"
                />
              </div>
            ) : (
              <div className="h-44 rounded-t-xl bg-gradient-to-br from-slate-100 via-white to-sky-100" />
            )}

            <div className="flex flex-1 flex-col gap-3 p-5">
              <div className="flex flex-col gap-2">
                <span className="text-xs uppercase tracking-[0.25em] text-sky-600">
                  {campaign.locale.toUpperCase()} • {campaign.name}
                </span>
                <h3 className="text-lg font-semibold text-slate-900">{campaign.headline}</h3>
                {campaign.subheadline ? (
                  <p className="text-sm text-slate-600">{campaign.subheadline}</p>
                ) : null}
              </div>
              <div className="mt-auto">
                <Link
                  href={campaign.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-sky-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-sky-400"
                >
                  {campaign.ctaText}
                  <span aria-hidden>↗</span>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
