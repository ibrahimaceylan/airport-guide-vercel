const highlights = [
  {
    title: "Iconic Architecture",
    detail: "A terminal inspired by Ottoman design with futuristic flow.",
  },
  {
    title: "World-Class Shopping",
    detail: "Luxury brands, local artisans, and duty-free exclusives.",
  },
  {
    title: "Culinary Experiences",
    detail: "Taste Istanbul with gourmet dining and street-food favorites.",
  },
];

export default function Highlights() {
  return (
    <section id="highlights" className="space-y-6">
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-[0.4em] text-sky-300">
          Highlights
        </span>
        <h3 className="text-2xl font-semibold text-slate-100">
          Why travelers love Istanbul Airport
        </h3>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {highlights.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 shadow-lg"
          >
            <h4 className="text-lg font-semibold text-slate-50">{item.title}</h4>
            <p className="mt-2 text-sm text-slate-300">{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
