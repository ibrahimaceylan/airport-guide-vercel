"use client";

import { Dialog } from "@headlessui/react";
import type { VersionAction } from "@prisma/client";
import { useTranslations } from "next-intl";

export type VersionAuthor = {
  id: number;
  name: string | null;
  email: string;
};

export type VersionRecord = {
  id: number;
  recordId: number | null;
  action: VersionAction;
  createdAt: string;
  publishedAt: string | null;
  restoredFromId: number | null;
  data: Record<string, unknown>;
  author: VersionAuthor | null;
};

type VersionHistoryModalProps = {
  open: boolean;
  onClose: () => void;
  versions?: VersionRecord[];
  isLoading: boolean;
  error?: Error;
  onRestore: (versionId: number) => void;
  restoringId: number | null;
};

const actionLabels: Record<VersionAction, string> = {
  CREATED: "Created",
  UPDATED: "Updated",
  DELETED: "Deleted",
  RESTORED: "Restored",
};

const formatTimestamp = (value: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
};

const previewText = (data: Record<string, unknown>) => {
  const primaryKeys = ["title", "label", "name", "mode", "subtitle"];
  for (const key of primaryKeys) {
    const candidate = data[key];
    if (typeof candidate === "string" && candidate.trim().length) {
      return candidate;
    }
  }
  return JSON.stringify(data);
};

export default function VersionHistoryModal({
  open,
  onClose,
  versions,
  isLoading,
  error,
  onRestore,
  restoringId,
}: VersionHistoryModalProps) {
  if (!open) return null;

  const t = useTranslations("versionHistory");
  const actionLabels: Record<VersionAction, string> = {
    CREATED: t("actions.CREATED"),
    UPDATED: t("actions.UPDATED"),
    DELETED: t("actions.DELETED"),
    RESTORED: t("actions.RESTORED"),
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-3xl rounded-xl bg-white p-6 shadow-xl">
          <Dialog.Title className="mb-4 text-lg font-semibold">{t("title")}</Dialog.Title>

          {isLoading && (
            <div className="rounded border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              {t("loading")}
            </div>
          )}

          {error && !isLoading && (
            <div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error.message || t("error")}
            </div>
          )}

          {!isLoading && !error && (!versions || versions.length === 0) && (
            <div className="rounded border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
              {t("empty")}
            </div>
          )}

          {versions && versions.length > 0 && (
            <div className="max-h-96 space-y-3 overflow-y-auto pr-1">
              {versions.map((version) => (
                <div
                  key={version.id}
                  className="rounded border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {actionLabels[version.action]}{" "}
                        <span className="font-normal text-slate-500">#{version.recordId ?? "—"}</span>
                      </p>
                      <p className="text-xs text-slate-500">
                        {previewText(version.data)}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span>{t("createdAt", { time: formatTimestamp(version.createdAt) })}</span>
                      <span>{t("publishedAt", { time: formatTimestamp(version.publishedAt) })}</span>
                      <span>
                        {t("byAuthor", {
                          author: version.author?.name || version.author?.email || t("unknownAuthor"),
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => onRestore(version.id)}
                      disabled={restoringId === version.id}
                      className="rounded bg-emerald-600 px-3 py-2 text-xs font-medium text-white shadow hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {restoringId === version.id ? t("restoring") : t("restore")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="rounded border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              {t("close")}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
