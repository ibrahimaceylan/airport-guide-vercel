import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardCard from "@/components/dashboard/DashboardCard";
import FlightsList from "@/components/flights/FlightsList";
import TransportOverview from "@/components/transport/TransportOverview";
import { getTranslations } from "next-intl/server";

export default async function EditorDashboard() {
  const t = await getTranslations("dashboard");

  return (
    <DashboardLayout
      title={t("titleEditor")}
      subtitle={t("subtitleEditor")}
    >
      <DashboardCard
        id="flights"
        title={t("flightsQueue")}
        description="Reference flights while updating announcements."
      >
        <FlightsList />
      </DashboardCard>

      <DashboardCard
        id="transport"
        title={t("transportModules")}
        description="Ensure timely updates across ground transport feeds."
      >
        <TransportOverview />
      </DashboardCard>
    </DashboardLayout>
  );
}
