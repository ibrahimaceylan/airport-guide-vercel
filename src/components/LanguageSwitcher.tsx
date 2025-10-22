"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import { cn } from "@/lib/utils";

const supportedLanguages = [
  { code: "en", label: "EN" },
  { code: "tr", label: "TR" },
  { code: "ar", label: "AR" },
] as const;

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("dashboard");

  const buildHref = (targetLocale: string) => {
    const trimmedPath = pathname.replace(/^\/(en|tr|ar)/, "");
    const path = `/${targetLocale}${trimmedPath}`;
    const query = searchParams.toString();
    return query ? `${path}?${query}` : path;
  };

  const handleSwitch = (targetLocale: string) => {
    if (targetLocale === locale) return;
    const nextHref = buildHref(targetLocale);
    startTransition(() => {
      router.push(nextHref);
    });
  };

  return (
    <div className="flex items-center gap-2 md:gap-3">
      <span className="hidden text-sm text-gray-500 md:inline">
        🌐 {t("language")}
      </span>
      <div className="flex items-center gap-1 md:gap-2">
        {supportedLanguages.map(({ code, label }) => (
          <button
            key={code}
            type="button"
            onClick={() => handleSwitch(code)}
            disabled={isPending || code === locale}
            aria-label={t("language")}
            aria-pressed={code === locale}
            className={cn(
              "rounded-md px-2 py-1 text-xs font-medium transition-colors duration-150 md:px-3 md:py-1.5 md:text-sm",
              code === locale
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 focus-visible:bg-gray-200",
              isPending && "opacity-70"
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
