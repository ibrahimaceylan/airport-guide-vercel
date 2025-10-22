import Link from "next/link";

type FlightRow = {
  id: number;
  flightNo: string;
  destination: string;
  departure: string;
  status: string;
};

type FlightsSnapshotProps = {
  title: string;
  description: string;
  empty: string;
  cta: { label: string; href: string };
  headers: {
    flight: string;
    destination: string;
    departure: string;
    status: string;
  };
  flights: FlightRow[];
};

const statusBadgeClass = (status: string) => {
  const normalized = status.toLowerCase();
  if (normalized.includes("delay")) {
    return "bg-rose-100 text-rose-700";
  }
  if (normalized.includes("board")) {
    return "bg-amber-100 text-amber-700";
  }
  return "bg-emerald-100 text-emerald-700";
};

export function FlightsSnapshot({ title, description, empty, cta, headers, flights }: FlightsSnapshotProps) {
  return (
    <section className="space-y-4">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.4em] text-sky-600">{title}</span>
          <p className="text-sm text-slate-600">{description}</p>
        </div>
        <Link
          href={cta.href}
          target={cta.href.startsWith("http") ? "_blank" : undefined}
          rel={cta.href.startsWith("http") ? "noopener noreferrer" : undefined}
          className="inline-flex items-center gap-2 text-sm font-semibold text-sky-600 underline-offset-4 hover:text-sky-500 hover:underline"
        >
          {cta.label}
          <span aria-hidden>↗</span>
        </Link>
      </header>
      <div className="overflow-hidden rounded-xl bg-white shadow-sm shadow-slate-200/50">
        <table className="min-w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-100 text-xs uppercase tracking-[0.2em] text-slate-500">
            <tr>
              <th className="px-4 py-3">{headers.flight}</th>
              <th className="px-4 py-3">{headers.destination}</th>
              <th className="px-4 py-3">{headers.departure}</th>
              <th className="px-4 py-3">{headers.status}</th>
            </tr>
          </thead>
          <tbody>
            {flights.map((flight) => (
              <tr key={flight.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium text-slate-900">{flight.flightNo}</td>
                <td className="px-4 py-3">{flight.destination}</td>
                <td className="px-4 py-3 text-slate-600">{flight.departure}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClass(
                      flight.status,
                    )}`}
                  >
                    {flight.status}
                  </span>
                </td>
              </tr>
            ))}
            {!flights.length ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                  {empty}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default FlightsSnapshot;
