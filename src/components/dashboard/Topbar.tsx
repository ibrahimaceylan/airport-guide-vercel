"use client";

import { useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { signOut } from "next-auth/react";

import LanguageSwitcher from "@/components/LanguageSwitcher";
import { cn } from "@/lib/utils";

type Locale = "en" | "tr" | "ar";

type TopbarProps = {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
};

export default function Topbar({ title, subtitle, actions }: TopbarProps) {
  const t = useTranslations("dashboard");
  const locale = useLocale() as Locale;

  const subtitleText = subtitle ?? (title ? undefined : t("subtitleAdmin"));
  const avatarLabel = locale === "ar" ? "ن" : "IST";
  const isRtl = locale === "ar";

  return (
    <header
      className={cn(
        "flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 rtl:flex-row-reverse",
        isRtl && "flex-row-reverse"
      )}
    >
      <div
        className={cn(
          "flex flex-col rtl:text-right",
          isRtl ? "items-end text-right" : "items-start text-left"
        )}
      >
        <h1 className="text-lg font-semibold text-gray-900">
          {title ?? t("titleAdmin")}
        </h1>
        {subtitleText && (
          <p className="text-sm text-gray-500">{subtitleText}</p>
        )}
      </div>
      <div
        className={cn(
          "flex items-center gap-3 md:gap-4 rtl:flex-row-reverse",
          isRtl && "flex-row-reverse"
        )}
      >
        {actions}
        <LanguageSwitcher />
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="hidden rounded border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-800 sm:inline-flex"
        >
          {t("signOut")}
        </button>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
          {avatarLabel}
        </div>
      </div>
    </header>
  );
}
