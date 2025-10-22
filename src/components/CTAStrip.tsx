export default function CTAStrip() {
  return (
    <section
      id="cta"
      className="rounded-3xl border border-sky-500/40 bg-sky-500/10 p-8 text-slate-100 shadow-lg"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-2xl font-semibold">Stay in the loop</h3>
          <p className="mt-2 text-sm text-slate-200">
            Phase 1 lays the groundwork. Subscribe for updates as we unlock dashboards, transport intelligence, and personalized journeys.
          </p>
        </div>
        <a
          href="mailto:updates@istanbul-airport.com"
          className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-400"
        >
          Join the waitlist
        </a>
      </div>
    </section>
  );
}
