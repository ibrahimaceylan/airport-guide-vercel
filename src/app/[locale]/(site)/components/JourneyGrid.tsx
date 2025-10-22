import Link from "next/link";

import { resolveIcon, transitions } from "@/styles/design-tokens";

type JourneyTile = {
  id: number;
  stage: "before" | "arrival";
  title: string;
  description: string;
  icon?: string | null;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
  partnerTag?: string | null;
};

type JourneyTheme = {
  section?: string;
  column?: string;
  heading?: string;
  description?: string;
  tile?: string;
  tileHover?: string;
  iconWrapper?: string;
  iconColor?: string;
  tagBackground?: string;
  tagColor?: string;
  cta?: string;
  bodyText?: string;
};

type JourneyGridProps = {
  beforeFlight: JourneyTile[];
  onArrival: JourneyTile[];
  labels: {
    beforeTitle: string;
    beforeDescription: string;
    arrivalTitle: string;
    arrivalDescription: string;
    partnerTag: string;
  };
  theme?: JourneyTheme;
};

const defaultTheme: Required<JourneyTheme> = {
  section: "grid gap-6 lg:grid-cols-2",
  column: "space-y-4 rounded-xl bg-white p-6 shadow-sm shadow-slate-200/50",
  heading: "text-xl font-semibold text-slate-900",
  description: "text-sm text-slate-600",
  tile: "rounded-lg bg-slate-50/80 p-4 shadow-sm shadow-slate-200/40",
  tileHover: "hover:-translate-y-0.5 hover:shadow-md hover:shadow-slate-200/60",
  iconWrapper: "mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-sky-100",
  iconColor: "text-sky-700",
  tagBackground: "bg-sky-100",
  tagColor: "text-sky-700",
  cta: "text-sky-600 hover:text-sky-500",
  bodyText: "text-sm text-slate-600",
};

export function JourneyGrid({ beforeFlight, onArrival, labels, theme }: JourneyGridProps) {
  const appearance = { ...defaultTheme, ...(theme ?? {}) };
  return (
    <section className={appearance.section}>
      <JourneyColumn
        title={labels.beforeTitle}
        description={labels.beforeDescription}
        tiles={beforeFlight}
        partnerTag={labels.partnerTag}
        appearance={appearance}
      />
      <JourneyColumn
        title={labels.arrivalTitle}
        description={labels.arrivalDescription}
        tiles={onArrival}
        partnerTag={labels.partnerTag}
        appearance={appearance}
      />
    </section>
  );
}

type JourneyColumnProps = {
  title: string;
  description: string;
  tiles: JourneyTile[];
  partnerTag: string;
  appearance: Required<JourneyTheme>;
};

const JourneyColumn = ({ title, description, tiles, partnerTag, appearance }: JourneyColumnProps) => (
  <article className={appearance.column}>
    <header className="space-y-2">
      <h3 className={appearance.heading}>{title}</h3>
      <p className={appearance.description}>{description}</p>
    </header>
    <div className="space-y-3">
      {tiles.map((tile) => {
        const Icon = resolveIcon(tile.icon ?? "default");
        return (
          <div
            key={`${tile.stage}-${tile.id}`}
            className={[appearance.tile, transitions.base, appearance.tileHover].join(" ")}
          >
            <div className="flex items-start gap-3">
              <span className={`${appearance.iconWrapper} ${appearance.iconColor}`}>
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-semibold text-slate-900">{tile.title}</h4>
                  {tile.partnerTag ? (
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] ${appearance.tagBackground} ${appearance.tagColor}`}
                    >
                      {partnerTag}
                    </span>
                  ) : null}
                </div>
                <p className={appearance.bodyText}>{tile.description}</p>
                {tile.ctaLabel && tile.ctaUrl ? (
                  <Link
                    href={tile.ctaUrl}
                    target={tile.ctaUrl.startsWith("http") ? "_blank" : undefined}
                    rel={tile.ctaUrl.startsWith("http") ? "noopener noreferrer" : undefined}
                    className={`inline-flex items-center gap-2 text-xs font-semibold ${appearance.cta}`}
                  >
                    {tile.ctaLabel}
                    <span aria-hidden>↗</span>
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </article>
);

export default JourneyGrid;
