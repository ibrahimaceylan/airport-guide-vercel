import Link from "next/link";

import { resolveIcon } from "@/styles/design-tokens";

export type PreTravelAction = {
  label: string;
  href: string;
  icon?: string;
};

type PreTravelStripProps = {
  title: string;
  subtitle?: string;
  actions: PreTravelAction[];
};

export function PreTravelStrip({ title, subtitle, actions }: PreTravelStripProps) {
  if (!actions.length) return null;

  return (
    <section className="rounded-xl border border-white/40 bg-white/85 p-6 shadow-md shadow-slate-200/60 backdrop-blur">
      <div className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600">{title}</p>
            {subtitle ? <p className="mt-1 text-sm text-slate-600">{subtitle}</p> : null}
          </div>
        </div>
        <div className="relative">
          <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2">
            {actions.map((action, index) => {
              const Icon = resolveIcon(action.icon ?? "default");
              const isExternal = action.href.startsWith("http");
              const isPrimary = index === 0;
              return (
                <Link
                  key={`${action.label}-${action.href}`}
                  href={action.href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className={[
                    "snap-start rounded-xl px-5 py-3 text-sm font-semibold transition",
                    isPrimary
                      ? "bg-sky-500 text-white shadow-[0_18px_32px_-20px_rgba(14,165,233,0.5)] hover:bg-sky-400"
                      : "border border-slate-200 bg-white text-slate-700 shadow-[0_10px_25px_-15px_rgba(15,23,42,0.3)] hover:border-sky-200 hover:text-sky-600 hover:shadow-[0_18px_28px_-16px_rgba(15,23,42,0.35)]",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-2">
                    <Icon
                      className={`h-4 w-4 ${isPrimary ? "text-white" : "text-sky-600"}`}
                      aria-hidden
                    />
                    <span>{action.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default PreTravelStrip;
