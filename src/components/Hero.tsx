export default function Hero() {
  return (
    <section className="flex flex-col gap-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 p-10 text-slate-100 shadow-xl">
      <span className="text-sm uppercase tracking-[0.35em] text-sky-300">
        Welcome to Istanbul Airport
      </span>
      <h2 className="text-4xl font-semibold leading-tight sm:text-5xl">
        Your smarter companion for navigating one of the world&apos;s busiest hubs
      </h2>
      <p className="max-w-2xl text-base text-slate-300">
        Discover tailored guidance, live transport info, and curated experiences inspired by the best airport journeys. Phase 1 focuses on establishing the core scaffolding and structure to build upon.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <a
          href="#quick-links"
          className="inline-flex items-center justify-center rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-400"
        >
          Explore Quick Links
        </a>
        <a
          href="#cta"
          className="inline-flex items-center justify-center rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:border-sky-400 hover:text-sky-300"
        >
          Phase 1 Overview
        </a>
      </div>
    </section>
  );
}
