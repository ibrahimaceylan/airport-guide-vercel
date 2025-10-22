import Link from "next/link";

import { AlertTriangle } from "lucide-react";

import { transitions } from "@/styles/design-tokens";

type InstantAlert = {
  id: number;
  title: string;
  message: string;
  severity?: string | null;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
};

type InstantAlertsProps = {
  label: string;
  alerts: InstantAlert[];
  viewAll?: { label: string; href: string } | null;
};

const severityTone = (severity?: string | null) => {
  switch (severity) {
    case "CRITICAL":
      return "bg-rose-100 text-rose-700";
    case "WARNING":
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-sky-100 text-sky-700";
  }
};

export default function InstantAlerts({ label, alerts, viewAll }: InstantAlertsProps) {
  if (!alerts.length) return null;

  const [primary, ...rest] = alerts;

  const primaryText = [primary.title, primary.message].filter(Boolean).join(" — ");

  return (
    <div
      className="relative z-50 border-b border-amber-100/60 bg-gradient-to-r from-[#fff7eb] via-[#fffaf1] to-[#f6fbff] text-slate-800"
      role="region"
      aria-label={label}
      aria-live="polite"
    >
      <div className="flex w-full flex-col gap-2 px-4 py-2 sm:flex-row sm:items-center sm:gap-4 sm:px-6 lg:px-10">
        <span className="inline-flex w-max items-center gap-2 rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-600 shadow-sm shadow-amber-100">
          <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
          {label}
        </span>
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-3 rounded-lg border border-amber-200/70 bg-white/90 px-3 py-2 shadow-sm shadow-amber-100/60">
            <span
              className={`inline-flex shrink-0 items-center rounded-full px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.22em] ${severityTone(primary.severity)}`}
            >
              {primary.severity ?? "INFO"}
            </span>
            <p className="min-w-0 truncate text-sm font-semibold text-slate-900" title={primaryText}>
              {primaryText}
            </p>
            {primary.ctaLabel && primary.ctaUrl ? (
              <Link
                href={primary.ctaUrl}
                target={primary.ctaUrl.startsWith("http") ? "_blank" : undefined}
                rel={primary.ctaUrl.startsWith("http") ? "noopener noreferrer" : undefined}
                className={["shrink-0 text-xs font-semibold text-amber-600 underline-offset-4", transitions.base, "hover:text-amber-500 hover:underline"].join(" ")}
              >
                {primary.ctaLabel}
              </Link>
            ) : null}
          </div>

          {rest.length ? (
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600">
              {rest.map((alert) => {
                const secondaryText = [alert.title, alert.message].filter(Boolean).join(" — ");
                return (
                  <span
                    key={alert.id}
                    className={`inline-flex items-center gap-2 rounded-full border border-amber-100/70 bg-white/75 px-3 py-1 ${severityTone(alert.severity)}`}
                    title={secondaryText}
                  >
                    <span className="text-[9px] font-semibold uppercase tracking-[0.2em]">
                      {alert.severity ?? "INFO"}
                    </span>
                    <span className="truncate text-[11px] font-medium text-slate-700" title={secondaryText}>
                      {alert.title}
                    </span>
                  </span>
                );
              })}
            </div>
          ) : null}
        </div>
        {viewAll ? (
          <Link
            href={viewAll.href}
            className={["shrink-0 text-xs font-semibold text-amber-600 underline-offset-4", transitions.base, "hover:text-amber-500 hover:underline"].join(" ")}
          >
            {viewAll.label}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
