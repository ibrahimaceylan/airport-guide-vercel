const links = [
  {
    title: "Flight Departures",
    description: "Track departures, gate changes, and security timings.",
  },
  {
    title: "Flight Arrivals",
    description: "Stay updated on arrivals, baggage carousels, and delays.",
  },
  {
    title: "Parking & Transport",
    description: "Compare parking zones, public transport, and ride options.",
  },
  {
    title: "Airport Services",
    description: "Find lounges, fast track, and passenger assistance.",
  },
];

export default function QuickLinks() {
  return (
    <section id="quick-links" className="space-y-6">
      <h3 className="text-2xl font-semibold text-slate-100">Quick Links</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {links.map((link) => (
          <article
            key={link.title}
            className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-lg transition hover:border-sky-400/60 hover:shadow-sky-900/30"
          >
            <h4 className="text-lg font-semibold text-slate-50">{link.title}</h4>
            <p className="mt-2 text-sm text-slate-300">{link.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
