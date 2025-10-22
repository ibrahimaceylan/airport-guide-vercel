'use client';

import { useMemo, useState } from "react";

import Button from "@/components/Button";
import { transitions } from "@/styles/design-tokens";

type HighlightItem = {
  id: number;
  title: string;
  description: string;
  imageUrl?: string | null;
  category?: string | null;
  tags?: string | null;
  spotlight?: boolean | null;
};

type HighlightFilter = {
  id: string;
  label: string;
};

type HighlightsTheme = {
  container?: string;
  heading?: string;
  description?: string;
  filterGroup?: string;
  filterBase?: string;
  filterActive?: string;
  filterInactive?: string;
  card?: string;
  cardHover?: string;
  badge?: string;
  category?: string;
  title?: string;
  body?: string;
};

type HighlightsGridProps = {
  title: string;
  description: string;
  highlights: HighlightItem[];
  filters: HighlightFilter[];
  spotlightLabel?: string;
  theme?: HighlightsTheme;
  metaLabels?: { price: string; duration: string };
};

const defaultTheme: Required<Omit<HighlightsTheme, "cardHover" | "filterInactive" | "title">> & {
  cardHover: string;
  filterInactive: string;
  title: string;
} = {
  container: "space-y-6 rounded-xl border border-white/40 bg-white/85 p-6 shadow-md shadow-slate-200/50 backdrop-blur",
  heading: "text-xs font-semibold uppercase tracking-[0.4em] text-sky-600",
  description: "text-sm text-slate-600",
  filterGroup: "flex flex-wrap gap-2",
  filterBase: "rounded-lg px-4 py-2 text-sm font-semibold",
  filterActive: "bg-sky-600 text-white shadow-sm",
  filterInactive: "bg-slate-100 text-slate-700 hover:bg-slate-200",
  card: "relative overflow-hidden rounded-xl bg-white",
  cardHover: "hover:-translate-y-0.5 hover:shadow-md hover:shadow-slate-200/60",
  badge: "absolute right-4 top-4 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white",
  category: "text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500",
  title: "text-lg font-semibold text-slate-900",
  body: "text-sm text-slate-600",
};

const toTags = (highlight: HighlightItem) =>
  (highlight.tags || "")
    .split(/[,;]+/)
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);

const extractMetadata = (highlight: HighlightItem) => {
  const rawTags = (highlight.tags || "")
    .split(/[,;]+/)
    .map((tag) => tag.trim())
    .filter(Boolean);

  return rawTags.reduce<{ price?: string; duration?: string }>((meta, entry) => {
    const [key, ...rest] = entry.split(":");
    if (!rest.length) {
      return meta;
    }
    const normalizedKey = key.trim().toLowerCase();
    const value = rest.join(":").trim();
    if (!value) return meta;
    if (normalizedKey === "price") {
      meta.price = value;
    } else if (normalizedKey === "duration") {
      meta.duration = value;
    }
    return meta;
  }, {});
};

export default function HighlightsGrid({
  title,
  description,
  highlights,
  filters,
  spotlightLabel = "Spotlight",
  theme,
  metaLabels = { price: "Price", duration: "Duration" },
}: HighlightsGridProps) {
  const appearance = { ...defaultTheme, ...(theme ?? {}) };
  const [activeFilter, setActiveFilter] = useState<string>(filters[0]?.id ?? "all");

  const filteredHighlights = useMemo(() => {
    if (activeFilter === "all") return highlights;
    return highlights.filter((highlight) => {
      const tags = toTags(highlight);
      return highlight.category?.toLowerCase() === activeFilter || tags.includes(activeFilter);
    });
  }, [activeFilter, highlights]);

  if (!highlights.length) {
    return null;
  }

  return (
    <section className={appearance.container}>
      <header className="space-y-2">
        <span className={appearance.heading}>{title}</span>
        <p className={appearance.description}>{description}</p>
      </header>

      <div className={appearance.filterGroup}>
        {filters.map((filter) => {
          const isActive = filter.id === activeFilter;
          return (
            <Button
              key={filter.id}
              type="button"
              variant="unstyled"
              label={filter.label}
              onClick={() => setActiveFilter(filter.id)}
              className={[
                appearance.filterBase,
                transitions.base,
                isActive ? appearance.filterActive : appearance.filterInactive,
              ].join(" ")}
            />
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {filteredHighlights.map((item) => (
          <article
            key={item.id}
            className={[appearance.card, transitions.base, appearance.cardHover].join(" ")}
          >
            {item.spotlight ? <span className={appearance.badge}>{spotlightLabel}</span> : null}
            {item.imageUrl ? (
              <div
                className="h-40 w-full overflow-hidden bg-slate-200"
                style={{
                  backgroundImage: `url(${item.imageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                aria-hidden
              />
            ) : null}
            <div className="space-y-3 p-5">
              {item.category ? <span className={appearance.category}>{item.category}</span> : null}
              <h3 className={appearance.title}>{item.title}</h3>
              <p className={appearance.body}>{item.description}</p>
              {(() => {
                const metadata = extractMetadata(item);
                if (!metadata.price && !metadata.duration) {
                  return null;
                }
                return (
                  <dl className="flex flex-wrap gap-4 text-xs text-slate-500">
                    {metadata.price ? (
                      <div className="space-y-1">
                        <dt className="font-semibold uppercase tracking-[0.25em] text-slate-400">
                          {metaLabels.price}
                        </dt>
                        <dd className="text-sm font-medium text-slate-700">{metadata.price}</dd>
                      </div>
                    ) : null}
                    {metadata.duration ? (
                      <div className="space-y-1">
                        <dt className="font-semibold uppercase tracking-[0.25em] text-slate-400">
                          {metaLabels.duration}
                        </dt>
                        <dd className="text-sm font-medium text-slate-700">{metadata.duration}</dd>
                      </div>
                    ) : null}
                  </dl>
                );
              })()}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
