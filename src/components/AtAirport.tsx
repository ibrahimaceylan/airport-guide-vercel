const amenities = [
  {
    name: "Lounges",
    detail: "Turkish Airlines Business, IGA Lounge, and global partners.",
  },
  {
    name: "Wellness",
    detail: "Sleep pods, showers, and spa services for long layovers.",
  },
  {
    name: "Family",
    detail: "Play zones, family rooms, and priority assistance.",
  },
  {
    name: "Workspace",
    detail: "Co-working lounges, fast Wi-Fi, and private meeting pods.",
  },
];

export default function AtAirport() {
  return (
    <section id="at-airport" className="space-y-6">
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-[0.4em] text-sky-300">
          At the Airport
        </span>
        <h3 className="text-2xl font-semibold text-slate-100">
          Services ready when you are
        </h3>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {amenities.map((item) => (
          <article
            key={item.name}
            className="rounded-2xl bg-gradient-to-br from-blue-950/80 via-slate-950 to-slate-950 p-6 shadow-lg"
          >
            <h4 className="text-lg font-semibold text-slate-50">{item.name}</h4>
            <p className="mt-2 text-sm text-slate-300">{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
