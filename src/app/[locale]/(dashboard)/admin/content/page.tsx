"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import useSWR from "swr";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import HeroModal from "@/components/admin/modals/HeroModal";
import QuickLinkModal from "@/components/admin/modals/QuickLinkModal";
import HighlightModal from "@/components/admin/modals/HighlightModal";
import TransportModal from "@/components/admin/modals/TransportModal";
import AtAirportModal from "@/components/admin/modals/AtAirportModal";
import CTAStripModal from "@/components/admin/modals/CTAStripModal";
import VersionHistoryModal, { type VersionRecord } from "@/components/admin/VersionHistoryModal";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to load content");
  }
  return response.json();
};

type SectionKey = "hero" | "quicklink" | "highlight" | "transport" | "atairport" | "ctastrip";

type RecordData = {
  id: number;
  title?: string;
  subtitle?: string;
  label?: string;
  name?: string;
  mode?: string;
  [key: string]: unknown;
};

export default function ContentManager() {
  const [section, setSection] = useState<SectionKey>("hero");
  const [openModal, setOpenModal] = useState(false);
  const [editingItem, setEditingItem] = useState<RecordData | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [restoringId, setRestoringId] = useState<number | null>(null);
  const t = useTranslations("contentManager");

  const { data, mutate, error, isLoading } = useSWR<RecordData[]>(`/api/content/${section}`, fetcher);
  const historyKey = historyOpen ? `/api/content/${section}/versions` : null;
  const {
    data: versionHistory,
    mutate: mutateHistory,
    error: historyError,
    isLoading: isHistoryLoading,
  } = useSWR<VersionRecord[]>(historyKey, fetcher);

  useEffect(() => {
    setOpenModal(false);
    setEditingItem(null);
    setHistoryOpen(false);
    setRestoringId(null);
  }, [section]);

  const records = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  const primaryFieldFor = (item: RecordData) =>
    item.title ?? item.label ?? item.name ?? item.mode ?? "—";

  const closeModal = () => {
    setOpenModal(false);
    setEditingItem(null);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setOpenModal(true);
  };

  const handleEdit = (item: RecordData) => {
    setEditingItem(item);
    setOpenModal(true);
  };

  const handleSubmit = async (formData: any) => {
    const method = editingItem ? "PUT" : "POST";
    const payload = editingItem ? { ...formData, id: editingItem.id } : formData;

    const response = await fetch(`/api/content/${section}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const message = await response.text();
      alert(message || t("saveError"));
      return;
    }

    closeModal();
    await mutate();
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t("deleteConfirm"))) return;

    const response = await fetch(`/api/content/${section}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      const message = await response.text();
      alert(message || t("deleteError"));
      return;
    }

    await mutate();
    if (historyOpen) await mutateHistory();
  };

  const handleRestore = async (versionId: number) => {
    try {
      setRestoringId(versionId);
      const response = await fetch(`/api/content/${section}/versions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ versionId }),
      });

      if (!response.ok) {
        const message = await response.text();
        alert(message || t("restoreError"));
        return;
      }

      await mutate();
      await mutateHistory();
      setHistoryOpen(false);
    } finally {
      setRestoringId(null);
    }
  };

  const sanitizedInitialValues = editingItem
    ? Object.fromEntries(
        Object.entries(editingItem).filter(([key]) => !["id", "createdAt", "updatedAt"].includes(key))
      )
    : undefined;

  const renderModal = () => {
    if (!openModal) return null;

    const sharedProps = {
      open: openModal,
      onClose: closeModal,
      onSubmit: handleSubmit,
      initialValues: sanitizedInitialValues,
    } as const;

    switch (section) {
      case "hero":
        return <HeroModal {...sharedProps} mode={editingItem ? "edit" : "create"} />;
      case "quicklink":
        return <QuickLinkModal {...sharedProps} />;
      case "highlight":
        return <HighlightModal {...sharedProps} />;
      case "transport":
        return <TransportModal {...sharedProps} />;
      case "atairport":
        return <AtAirportModal {...sharedProps} />;
      case "ctastrip":
        return <CTAStripModal {...sharedProps} />;
      default:
        return null;
    }
  };

  const sectionLabels: Record<SectionKey, string> = {
    hero: "Hero",
    quicklink: "Quick Links",
    highlight: "Highlights",
    transport: "Transport",
    atairport: "At the Airport",
    ctastrip: "CTA Strip",
  };

  const sectionOptions = (Object.entries(sectionLabels) as [SectionKey, string][]);

  const actions = (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={section}
        onChange={(event) => setSection(event.target.value as SectionKey)}
        className="rounded border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
      >
        {sectionOptions.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <button
        onClick={() => setHistoryOpen(true)}
        className="rounded border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm transition hover:bg-emerald-100"
      >
        {t("viewHistory")}
      </button>
      <button
        onClick={handleAdd}
        className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700"
      >
        {t("addNew")}
      </button>
    </div>
  );

  return (
    <DashboardLayout title={t("title")} subtitle={t("subtitle")} actions={actions}>
      {error && (
        <div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error.message || t("loadError")}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">{t("table.id")}</th>
              <th className="px-4 py-3">{t("table.primaryField")}</th>
              <th className="px-4 py-3">{t("table.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-slate-500">
                  {t("loading")}
                </td>
              </tr>
            ) : records.length ? (
              records.map((item) => (
                <tr key={item.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">{item.id}</td>
                  <td className="px-4 py-3">{primaryFieldFor(item)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="rounded bg-amber-500 px-3 py-2 text-xs font-medium text-white shadow hover:bg-amber-600"
                      >
                        {t("actions.edit")}
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="rounded bg-red-600 px-3 py-2 text-xs font-medium text-white shadow hover:bg-red-700"
                      >
                        {t("actions.delete")}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-slate-500">
                  {t("noRecords")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {renderModal()}

      <VersionHistoryModal
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        versions={versionHistory}
        isLoading={Boolean(historyOpen && isHistoryLoading)}
        error={historyError as Error | undefined}
        onRestore={handleRestore}
        restoringId={restoringId}
      />
    </DashboardLayout>
  );
}
