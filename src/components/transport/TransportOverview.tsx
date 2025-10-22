"use client";

import useSWR from "swr";
import { useTranslations } from "next-intl";

import { fetchTransportStatuses, type TransportStatus } from "@/lib/api/transport";

const fetcher = () => fetchTransportStatuses();

const MODE_TONE: Record<TransportStatus["mode"], string> = {
  Taxi: "bg-amber-50 text-amber-700 border-amber-100",
  Metro: "bg-blue-50 text-blue-700 border-blue-100",
  Bus: "bg-green-50 text-green-700 border-green-100",
  Parking: "bg-purple-50 text-purple-700 border-purple-100",
};

export default function TransportOverview() {
  const t = useTranslations("dashboard");
  const { data, error, isLoading } = useSWR<TransportStatus[]>("transport", fetcher, {
    refreshInterval: 20_000,
  });

  if (isLoading) {
    return (
      <p className="animate-pulse text-sm text-gray-500">
        {t("transportLoading", { defaultValue: "Loading transport data..." })}
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-sm font-medium text-red-600">
        {t("transportError", { defaultValue: "Failed to load transport updates." })}
      </p>
    );
  }

  if (!data || data.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        {t("transportEmpty", { defaultValue: "No transport data available." })}
      </p>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {data.map((item) => (
        <article
          key={item.mode}
          className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
        >
          <div
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase ${MODE_TONE[item.mode]}`}
          >
            {item.mode}
          </div>
          <p className="mt-3 text-sm text-gray-700">
            {item.active
              ? t("transportStatus.active", {
                  defaultValue: "Service running normally",
                })
              : t("transportStatus.inactive", {
                  defaultValue: "Service temporarily unavailable",
                })}
          </p>
          <p className="mt-2 text-xs text-gray-400">
            {t("transportUpdated", {
              defaultValue: "Updated: {time}",
              time: new Intl.DateTimeFormat(undefined, {
                hour: "2-digit",
                minute: "2-digit",
              }).format(new Date(item.lastUpdate)),
            })}
          </p>
        </article>
      ))}
    </div>
  );
}
