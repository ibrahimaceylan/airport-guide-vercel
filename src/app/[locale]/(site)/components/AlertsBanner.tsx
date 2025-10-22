import Link from "next/link";

import { transitions } from "@/styles/design-tokens";

type AlertItem = {
  id: number;
  title: string;
  message: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
  ctaLabel?: string | null;
  ctaUrl?: string | null;
  dismissible?: boolean | null;
};

type AlertsBannerProps = {
  title: string;
  description?: string;
  alerts: AlertItem[];
  emptyMessage?: string;
};

const severityTone = (severity: AlertItem["severity"]) => {
  switch (severity) {
    case "CRITICAL":
      return "bg-rose-600 text-white";
    case "WARNING":
      return "bg-amber-500 text-black";
    default:
      return "bg-sky-600 text-white";
  }
};

export function AlertsBanner({ title, description, alerts, emptyMessage }: AlertsBannerProps) {
  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600">{title}</span>
        {description ? <p className="text-sm text-slate-600">{description}</p> : null}
      </header>
      {alerts.length ? (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <article
              key={alert.id}
              className={[
                "flex flex-col gap-3 rounded-lg bg-sky-50 p-4 text-slate-800 shadow-sm shadow-sky-100/60 md:flex-row md:items-center md:justify-between",
                transitions.base,
              ].join(" ")}
            >
              <div className="flex flex-1 items-start gap-3">
                <span className={`mt-1 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${severityTone(alert.severity)}`}>
                  {alert.severity}
                </span>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-900">{alert.title}</p>
                  <p className="text-sm text-slate-600">{alert.message}</p>
                </div>
              </div>
              {alert.ctaLabel && alert.ctaUrl ? (
                <Link
                  href={alert.ctaUrl}
                  target={alert.ctaUrl.startsWith("http") ? "_blank" : undefined}
                  rel={alert.ctaUrl.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center gap-2 rounded-full border border-sky-300 bg-white px-4 py-2 text-sm font-semibold text-sky-700 hover:border-sky-500 hover:text-sky-800"
                >
                  {alert.ctaLabel}
                  <span aria-hidden>↗</span>
                </Link>
              ) : null}
            </article>
          ))}
        </div>
      ) : emptyMessage ? (
        <div className="rounded-lg bg-white/70 p-4 text-sm text-slate-500 shadow-sm shadow-slate-200/40">
          {emptyMessage}
        </div>
      ) : null}
    </section>
  );
}

export default AlertsBanner;
