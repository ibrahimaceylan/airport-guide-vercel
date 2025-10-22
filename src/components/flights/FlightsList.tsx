"use client";

import useSWR from "swr";
import { useTranslations } from "next-intl";

import FlightStatusBadge from "./FlightStatusBadge";
import { fetchFlights, type Flight } from "@/lib/api/flights";
import { cn } from "@/lib/utils";

const fetcher = () => fetchFlights();

export default function FlightsList() {
  const t = useTranslations("dashboard");
  const { data, error, isLoading } = useSWR<Flight[]>("flights", fetcher, {
    refreshInterval: 15_000,
  });

  if (isLoading) {
    return (
      <p className="animate-pulse text-sm text-gray-500">
        {t("flightsLoading", { defaultValue: "Loading flight data..." })}
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-sm font-medium text-red-600">
        {t("flightsError", { defaultValue: "Failed to load flights." })}
      </p>
    );
  }

  if (!data || data.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        {t("flightsEmpty", { defaultValue: "No flights to display." })}
      </p>
    );
  }

  const lastUpdated = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-2 text-left">
                {t("flightsTable.flight", { defaultValue: "Flight" })}
              </th>
              <th className="px-4 py-2 text-left">
                {t("flightsTable.airline", { defaultValue: "Airline" })}
              </th>
              <th className="px-4 py-2 text-left">
                {t("flightsTable.destination", { defaultValue: "Destination" })}
              </th>
              <th className="px-4 py-2 text-left">
                {t("flightsTable.departure", { defaultValue: "Departure" })}
              </th>
              <th className="px-4 py-2 text-left">
                {t("flightsTable.status", { defaultValue: "Status" })}
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((flight) => (
              <tr key={flight.id} className="border-t border-gray-100">
                <td className="px-4 py-2 font-semibold text-gray-900">{flight.id}</td>
                <td className="px-4 py-2">{flight.airline}</td>
                <td className="px-4 py-2">{flight.destination}</td>
                <td className="px-4 py-2">{flight.departureTime}</td>
                <td className="px-4 py-2">
                  <FlightStatusBadge status={flight.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="px-4 py-2 text-xs text-gray-400">
        {t("flightsUpdated", { time: lastUpdated, defaultValue: "Last updated at {time}" })}
      </p>
    </div>
  );
}
