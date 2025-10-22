import { getTranslations } from "next-intl/server";

import { Search } from "lucide-react";

import FlightsSnapshot from "../components/FlightsSnapshot";

import Button from "@/components/Button";
import prisma from "@/lib/prisma";
import { gradients, transitions } from "@/styles/design-tokens";

type LocaleParams = { locale: string };
type ParamsInput = LocaleParams | Promise<LocaleParams>;

async function resolveParams(params: ParamsInput): Promise<LocaleParams> {
  if (typeof (params as Promise<LocaleParams>).then === "function") {
    return params as Promise<LocaleParams>;
  }
  return params as LocaleParams;
}

const formatFlightTime = (date: Date, locale: string) =>
  new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

const buildSearchQuery = (value: string | string[] | undefined) => {
  if (!value) return "";
  if (Array.isArray(value)) {
    return value[0]?.trim() ?? "";
  }
  return value.trim();
};

export default async function FlightsSearchPage({
  params,
  searchParams,
}: {
  params: ParamsInput;
  searchParams?: { q?: string | string[] };
}) {
  const { locale } = await resolveParams(params);

  const flightsT = await getTranslations({ locale, namespace: "homepage.flights" });
  const flightsPageT = await getTranslations({ locale, namespace: "flightsPage" });

  const query = buildSearchQuery(searchParams?.q);
  const normalizedQuery = query.toLowerCase();

  const flights = await prisma.flight.findMany({
    orderBy: { departure: "asc" },
    take: 50,
  });

  const filteredFlights = normalizedQuery
    ? flights.filter((flight) => {
        const flightNo = flight.flightNo.toLowerCase();
        const destination = flight.destination.toLowerCase();
        const status = flight.status.toLowerCase();
        return (
          flightNo.includes(normalizedQuery) ||
          destination.includes(normalizedQuery) ||
          status.includes(normalizedQuery)
        );
      })
    : flights;

  const flightsSnapshot = filteredFlights.map((flight) => ({
    id: flight.id,
    flightNo: flight.flightNo,
    destination: flight.destination,
    departure: formatFlightTime(flight.departure, locale),
    status: flight.status,
  }));

  const description = query
    ? flightsPageT("results.description", { query, count: filteredFlights.length })
    : flightsPageT("all.description", { count: filteredFlights.length });
  const heading = query
    ? flightsPageT("results.title", { query })
    : flightsPageT("all.title");

  const emptyMessage = query
    ? flightsPageT("results.empty", { query })
    : flightsT("empty");

  return (
    <div className={`min-h-[60vh] bg-gradient-to-b ${gradients.pageBackground}`}>
      <div className="mx-auto w-full max-w-6xl space-y-10 px-4 py-16 sm:px-6 lg:px-10">
        <header className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-600">
              {flightsPageT("eyebrow")}
            </span>
            <h1 className="text-3xl font-semibold text-slate-900">{heading}</h1>
            <p className="text-sm text-slate-600">{description}</p>
          </div>
          <form
            method="get"
            className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
            role="search"
          >
            <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm shadow-slate-900/5 focus-within:border-sky-300 focus-within:ring-1 focus-within:ring-sky-200">
              <Search className="h-4 w-4 text-sky-500" aria-hidden />
              <input
                className="w-full border-none bg-transparent text-base font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
                name="q"
                defaultValue={query}
                placeholder={flightsPageT("form.placeholder")}
                aria-label={flightsPageT("form.label")}
                maxLength={80}
              />
            </label>
            <Button
              type="submit"
              icon={<Search className="h-4 w-4 text-white" aria-hidden />}
              label={flightsPageT("form.cta")}
              className="rounded-xl"
            />
          </form>
        </header>

        <FlightsSnapshot
          title={flightsT("title")}
          description={flightsT("description")}
          empty={emptyMessage}
          cta={{ label: flightsPageT("back"), href: `/${locale}` }}
          headers={{
            flight: flightsT("headers.flight"),
            destination: flightsT("headers.destination"),
            departure: flightsT("headers.departure"),
            status: flightsT("headers.status"),
          }}
          flights={flightsSnapshot}
        />
      </div>
    </div>
  );
}
