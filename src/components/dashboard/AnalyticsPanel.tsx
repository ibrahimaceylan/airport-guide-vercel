"use client";
import { useState } from "react";
import useSWR from "swr";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { fetchFlights } from "@/lib/api/flights";
import { fetchPartnerAnalytics } from "@/lib/api/partners";

const COLORS = ["#16a34a", "#f59e0b", "#ef4444"];
const PLACEMENT_LABELS: Record<string, string> = {
  HERO_TILE: "Hero",
  QUICK_LINK: "Quick link",
  BANNER: "Banner",
  FEATURED_SECTION: "Featured",
  FOOTER_TILE: "Footer",
};

export default function AnalyticsPanel() {
  const [daysRange, setDaysRange] = useState<7 | 14 | 30>(7);
  const {
    data: flights,
    error,
    isLoading,
  } = useSWR("flights", fetchFlights, { refreshInterval: 20000 });

  const {
    data: partnerAnalytics,
    isLoading: partnerLoading,
    error: partnerError,
  } = useSWR(["partner-analytics", daysRange], () => fetchPartnerAnalytics(daysRange), {
    refreshInterval: 60000,
  });

  const downloadCsv = () => {
    if (!partnerAnalytics) return;
    const header = ["Campaign", "Locale", "Total Clicks", "Top Placement", "Days"];
    const rows = partnerAnalytics.campaigns.map((campaign) => {
      const placements = Object.entries(campaign.placements).sort((a, b) => b[1] - a[1]);
      const topPlacement = placements.length
        ? `${PLACEMENT_LABELS[placements[0][0]] ?? placements[0][0]} (${placements[0][1]})`
        : "—";
      return [
        `"${campaign.name.replace(/"/g, '""')}"`,
        campaign.locale.toUpperCase(),
        campaign.total,
        `"${topPlacement}"`,
        daysRange,
      ].join(",");
    });

    const csvContent = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const timestamp = new Date().toISOString().slice(0, 10);
    link.download = `partner-analytics-${daysRange}d-${timestamp}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading)
    return <div className="p-6 bg-white rounded-lg shadow">Loading analytics...</div>;
  if (error)
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-lg shadow">
        Failed to load analytics: {String(error)}
      </div>
    );
  if (!flights)
    return <div className="p-6 bg-white rounded-lg shadow">No data available.</div>;

  const total = flights.length;
  const onTime = flights.filter((f) => f.status === "On Time").length;
  const delayed = flights.filter((f) => f.status === "Delayed").length;
  const cancelled = flights.filter((f) => f.status === "Cancelled").length;

  const dataPie = [
    { name: "On Time", value: onTime },
    { name: "Delayed", value: delayed },
    { name: "Cancelled", value: cancelled },
  ];

  const hourly: Record<string, number> = {};
  flights.forEach((f) => {
    const hour = f.departureTime.slice(0, 2);
    hourly[hour] = (hourly[hour] || 0) + 1;
  });
  const dataBar = Object.entries(hourly).map(([hour, count]) => ({ hour, count }));

  return (
    <div className="p-6 bg-white rounded-lg shadow space-y-6">
      <h2 className="text-xl font-semibold mb-2">Flight Analytics</h2>
      <p className="text-sm text-gray-500 mb-4">Validated live data, refreshed every 20s</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={dataPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {dataPie.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataBar}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" label={{ value: "Hour", position: "insideBottom", offset: -2 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3b82f6" name="Departures" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        Total Flights: <strong>{total}</strong> | On Time: {onTime} | Delayed: {delayed} | Cancelled: {cancelled}
      </div>

      <div className="h-px bg-slate-200" />

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-semibold text-slate-900">Partner Clicks (last {daysRange} days)</h3>
          {partnerAnalytics ? (
            <span className="text-xs text-slate-500">Since {new Date(partnerAnalytics.since).toLocaleDateString()}</span>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {[7, 14, 30].map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => setDaysRange(range as 7 | 14 | 30)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                daysRange === range
                  ? "border-sky-500 bg-sky-50 text-sky-700"
                  : "border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800"
              }`}
            >
              Last {range} days
            </button>
          ))}
          <button
            type="button"
            onClick={downloadCsv}
            disabled={!partnerAnalytics || partnerLoading}
            className="ml-auto inline-flex items-center gap-2 rounded border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Export CSV
          </button>
        </div>
        {partnerError ? (
          <div className="rounded border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            Failed to load partner analytics.
          </div>
        ) : null}
        {partnerLoading && !partnerAnalytics ? (
          <div className="rounded border border-slate-200 bg-slate-50 p-3 text-xs text-slate-500">
            Loading partner performance...
          </div>
        ) : null}
        {partnerAnalytics && partnerAnalytics.campaigns.length === 0 ? (
          <div className="rounded border border-slate-200 bg-slate-50 p-3 text-xs text-slate-500">
            No tracked partner clicks yet.
          </div>
        ) : null}
        {partnerAnalytics && partnerAnalytics.campaigns.length ? (
          <div className="overflow-hidden rounded border border-slate-200">
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-3 py-2 text-left">Campaign</th>
                  <th className="px-3 py-2 text-left">Locale</th>
                  <th className="px-3 py-2 text-left">Clicks</th>
                  <th className="px-3 py-2 text-left">Top placement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {partnerAnalytics.campaigns.slice(0, 5).map((campaign) => {
                  const topPlacement = Object.entries(campaign.placements).sort((a, b) => b[1] - a[1])[0];
                  return (
                    <tr key={campaign.campaignId}>
                      <td className="px-3 py-2 font-medium text-slate-800">{campaign.name}</td>
                      <td className="px-3 py-2 text-slate-600">{campaign.locale.toUpperCase()}</td>
                      <td className="px-3 py-2 text-slate-800">{campaign.total}</td>
                  <td className="px-3 py-2 text-slate-600">
                    {topPlacement
                      ? `${PLACEMENT_LABELS[topPlacement[0]] ?? topPlacement[0]} · ${topPlacement[1]} clicks`
                      : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}
