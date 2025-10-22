import { resolveIcon } from "@/styles/design-tokens";

const defaultSteps = [
  { title: "Plan", description: "Search flights and secure your transfer.", icon: "plane-takeoff" },
  { title: "Travel", description: "Follow live updates and breeze through security.", icon: "tram-front" },
  { title: "Arrive", description: "Find currency exchange, onward travel, and lounges.", icon: "map" },
];

type TimelineStep = {
  title: string;
  description: string;
  icon?: string;
};

type ItineraryTimelineProps = {
  steps?: TimelineStep[];
};

export function ItineraryTimeline({ steps = defaultSteps }: ItineraryTimelineProps) {
  if (!steps.length) return null;

  return (
    <section className="overflow-hidden rounded-xl border border-white/40 bg-white/80 p-6 shadow-md shadow-slate-200/50 backdrop-blur">
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
        <div className="absolute left-5 top-10 hidden h-[2px] w-[calc(100%-40px)] bg-gradient-to-r from-brand-gold/80 via-sky-500/60 to-transparent sm:block" />
        {steps.map((step, index) => {
          const Icon = resolveIcon(step.icon ?? defaultSteps[index % defaultSteps.length].icon);
          return (
            <div
              key={`${step.title}-${index}`}
              className="relative flex flex-1 flex-col gap-3 rounded-xl bg-white/90 p-4 shadow-[0_12px_30px_-18px_rgba(15,23,42,0.4)] transition hover:-translate-y-1 hover:shadow-[0_18px_36px_-20px_rgba(15,23,42,0.45)]"
            >
              <div className="flex items-center gap-2 text-slate-700">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <span className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
              <p className="text-sm text-slate-600">{step.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default ItineraryTimeline;
