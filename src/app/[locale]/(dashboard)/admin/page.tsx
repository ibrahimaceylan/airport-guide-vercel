import AnalyticsPanel from "@/components/dashboard/AnalyticsPanel";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardCard from "@/components/dashboard/DashboardCard";
import FlightsList from "@/components/flights/FlightsList";
import TransportOverview from "@/components/transport/TransportOverview";
import { getTranslations } from "next-intl/server";

export default async function AdminDashboard() {
  const t = await getTranslations("dashboard");

  return (
    <DashboardLayout
      title={t("titleAdmin")}
      subtitle={t("subtitleAdmin")}
    >
      <AnalyticsPanel />

      <DashboardCard
        id="flights"
        title={t("flightsSection")}
        description="Live departures sourced from current API data."
      >
        <FlightsList />
      </DashboardCard>

      <DashboardCard
        id="transport"
        title={t("transportSection")}
        description="Quick status cards for on-ground transport services."
      >
        <TransportOverview />
      </DashboardCard>
    </DashboardLayout>
  );
}
