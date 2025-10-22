const options = [
  {
    mode: "Metro (M11)",
    info: "Direct to Gayrettepe and Kagithane in under 30 minutes.",
  },
  {
    mode: "Havaist Coaches",
    info: "Comfortable shuttles to Taksim, Kadiköy, and key districts.",
  },
  {
    mode: "Intercity Buses",
    info: "Connections across Türkiye from the on-site coach terminal.",
  },
  {
    mode: "Car & Rideshare",
    info: "Smart parking, EV charging, and licensed taxis 24/7.",
  },
];

export default function Transport() {
  return (
    <section id="transport" className="space-y-6">
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-[0.4em] text-sky-300">
          Getting to & from IST
        </span>
        <h3 className="text-2xl font-semibold text-slate-100">
          Transport choices at a glance
        </h3>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {options.map((option) => (
          <article
            key={option.mode}
            className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-lg"
          >
            <h4 className="text-lg font-semibold text-slate-50">{option.mode}</h4>
            <p className="mt-2 text-sm text-slate-300">{option.info}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
