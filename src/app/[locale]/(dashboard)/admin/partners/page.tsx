"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import PartnerCampaignModal, { type PartnerCampaignFormValues } from "@/components/admin/modals/PartnerCampaignModal";
import { fetchPartnerCampaigns, type PartnerCampaignResponse } from "@/lib/api/partners";
import { CAMPAIGN_PLACEMENTS, type CampaignPlacementValue } from "@/lib/campaigns";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useTranslations } from "next-intl";

const statusBadgeStyles: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-700",
  LIVE: "bg-emerald-100 text-emerald-700",
  PAUSED: "bg-amber-100 text-amber-700",
  ARCHIVED: "bg-rose-100 text-rose-700",
};

const fetcher = () => fetchPartnerCampaigns();

const mapToFormValues = (campaign: PartnerCampaignResponse): PartnerCampaignFormValues => ({
  name: campaign.name,
  slug: campaign.slug,
  headline: campaign.headline,
  subheadline: campaign.subheadline ?? undefined,
  imageUrl: campaign.imageUrl ?? undefined,
  ctaText: campaign.ctaText,
  destinationUrl: campaign.destinationUrl,
  utmSource: campaign.utmSource ?? undefined,
  utmMedium: campaign.utmMedium ?? undefined,
  utmCampaign: campaign.utmCampaign ?? undefined,
  locale: campaign.locale,
  status: campaign.status,
  startDate: campaign.startDate ?? undefined,
  endDate: campaign.endDate ?? undefined,
  placements: campaign.placements.map((placement) => placement.placement as CampaignPlacementValue),
});

export default function PartnerCampaignManager() {
  const t = useTranslations("partnerManager");
  const { data, error, isLoading, mutate } = useSWR("partner-campaigns", fetcher);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<PartnerCampaignResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const placementLabels = useMemo(() => {
    const labels: Record<CampaignPlacementValue, string> = {
      HERO_TILE: t("placements.HERO_TILE"),
      QUICK_LINK: t("placements.QUICK_LINK"),
      BANNER: t("placements.BANNER"),
      FEATURED_SECTION: t("placements.FEATURED_SECTION"),
      FOOTER_TILE: t("placements.FOOTER_TILE"),
    };
    return labels;
  }, [t]);

  const handleCloseModal = () => {
    setEditingCampaign(null);
    setModalOpen(false);
  };

  const handleCreate = () => {
    setEditingCampaign(null);
    setModalOpen(true);
  };

  const handleEdit = (campaign: PartnerCampaignResponse) => {
    setEditingCampaign(campaign);
    setModalOpen(true);
  };

  const handleDelete = async (campaign: PartnerCampaignResponse) => {
    if (!window.confirm(t("deleteConfirm", { name: campaign.name }))) return;
    setSubmitting(true);
    try {
      const response = await fetch(`/api/partners/campaigns/${campaign.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete");
      await mutate();
    } catch (deleteError) {
      console.error(deleteError);
      alert(t("deleteError"));
    } finally {
      setSubmitting(false);
    }
  };

  const upsertCampaign = async (values: PartnerCampaignFormValues) => {
    setSubmitting(true);
    try {
      const payload = {
        ...values,
        placements: values.placements.map((placement, index) => ({ placement, sortOrder: index })),
        startDate: values.startDate ? new Date(values.startDate).toISOString() : null,
        endDate: values.endDate ? new Date(values.endDate).toISOString() : null,
      };

      const url = editingCampaign ? `/api/partners/campaigns/${editingCampaign.id}` : "/api/partners/campaigns";
      const method = editingCampaign ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const message = await response.json().catch(() => ({}));
        throw new Error(message?.error ? JSON.stringify(message.error) : "Failed to save campaign");
      }

      await mutate();
    } catch (saveError) {
      console.error(saveError);
      alert(t("saveError"));
    } finally {
      setSubmitting(false);
    }
  };

  const actions = (
    <button
      onClick={handleCreate}
      className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-sky-500"
    >
      {t("create")}
    </button>
  );

  return (
    <DashboardLayout title={t("title")} subtitle={t("subtitle")} actions={actions}>
      {error ? (
        <div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">{t("loadError")}</div>
      ) : null}

      {isLoading ? (
        <div className="rounded border border-slate-200 bg-white p-6 text-sm text-slate-500">{t("loading")}</div>
      ) : null}

      {data && data.length === 0 ? (
        <div className="rounded border border-slate-200 bg-white p-6 text-sm text-slate-500">{t("empty")}</div>
      ) : null}

      {data && data.length ? (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left">{t("table.campaign", { defaultValue: "Campaign" })}</th>
                <th className="px-4 py-3 text-left">{t("table.locale", { defaultValue: "Locale" })}</th>
                <th className="px-4 py-3 text-left">{t("table.placements", { defaultValue: "Placements" })}</th>
                <th className="px-4 py-3 text-left">{t("table.status", { defaultValue: "Status" })}</th>
                <th className="px-4 py-3 text-left">{t("table.schedule", { defaultValue: "Schedule" })}</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{campaign.name}</div>
                    <div className="text-xs text-slate-500">/{campaign.slug}</div>
                    <div className="mt-1 text-xs text-slate-600">{campaign.headline}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{campaign.locale.toUpperCase()}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {campaign.placements.map((placement) => (
                        <span
                          key={placement.id}
                          className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                        >
                          {placementLabels[placement.placement as CampaignPlacementType] ?? placement.placement}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeStyles[campaign.status] ?? "bg-slate-100 text-slate-700"}`}>
                      {t(`status.${campaign.status}` as const)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {campaign.startDate ? new Date(campaign.startDate).toLocaleDateString() : "Live"} →
                    {" "}
                    {campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : "Open"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(campaign)}
                        className="rounded border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                      >
                        {t("editAction", { defaultValue: "Edit" })}
                      </button>
                      <button
                        onClick={() => handleDelete(campaign)}
                        disabled={submitting}
                        className="rounded border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {t("deleteAction", { defaultValue: "Delete" })}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <PartnerCampaignModal
        open={modalOpen}
        onClose={handleCloseModal}
        mode={editingCampaign ? "edit" : "create"}
        initialValues={editingCampaign ? mapToFormValues(editingCampaign) : undefined}
        onSubmit={async (values) => {
          try {
            await upsertCampaign(values);
          } catch (saveError) {
            console.error(saveError);
            alert(t("saveError"));
          }
        }}
      />
    </DashboardLayout>
  );
}
