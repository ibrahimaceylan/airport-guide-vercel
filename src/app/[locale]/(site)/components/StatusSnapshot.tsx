import { resolveIcon, transitions } from "@/styles/design-tokens";

type StatusMetric = {
  id: string;
  title: string;
  metric: string;
  unit?: string | null;
  trendLabel?: string | null;
  icon?: string | null;
  updatedLabel?: string | null;
};

type StatusSnapshotProps = {
  title: string;
  description: string;
  metrics: StatusMetric[];
  className?: string;
  eyebrowClassName?: string;
  descriptionClassName?: string;
};

export function StatusSnapshot({
  title,
  description,
  metrics,
  className,
  eyebrowClassName,
  descriptionClassName,
}: StatusSnapshotProps) {
  return (
    <section
      className={[
        "space-y-4 rounded-xl border border-white/40 bg-white/85 p-6 shadow-md shadow-slate-200/50 backdrop-blur",
        className ?? "",
      ].join(" ")}
    >
      <header className="space-y-2">
        <span
          className={[
            "text-xs font-semibold uppercase tracking-[0.4em] text-sky-600",
            eyebrowClassName ?? "",
          ].join(" ")}
        >
          {title}
        </span>
        <p className={["text-sm text-slate-600", descriptionClassName ?? ""].join(" ")}>{description}</p>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => {
          const Icon = resolveIcon(metric.icon ?? "default");
          return (
            <article
              key={metric.id}
              className={[
                "rounded-xl bg-white p-6 shadow-sm shadow-slate-200/50",
                transitions.base,
                "hover:-translate-y-0.5 hover:shadow-md hover:shadow-slate-200/60",
              ].join(" ")}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sky-700">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">{metric.title}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-semibold text-slate-900">{metric.metric}</span>
                    {metric.unit ? <span className="text-sm text-slate-500">{metric.unit}</span> : null}
                  </div>
                </div>
              </div>
              {metric.trendLabel || metric.updatedLabel ? (
                <div className="mt-4 space-y-1">
                  {metric.trendLabel ? (
                    <p className="text-xs font-medium text-sky-700">{metric.trendLabel}</p>
                  ) : null}
                  {metric.updatedLabel ? (
                    <p className="text-[11px] text-slate-500">{metric.updatedLabel}</p>
                  ) : null}
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default StatusSnapshot;
