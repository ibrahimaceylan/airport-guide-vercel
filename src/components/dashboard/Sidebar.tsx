"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
};

export default function Sidebar() {
  const locale = useLocale();
  const t = useTranslations("dashboard");
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { label: t("flights"), href: `/${locale}/admin#flights` },
    { label: t("transport"), href: `/${locale}/admin#transport` },
    { label: t("content"), href: `/${locale}/admin/content` },
    { label: t("partners"), href: `/${locale}/admin/partners` },
    { label: t("titleEditor"), href: `/${locale}/editor` },
  ];

  return (
    <aside className="hidden w-64 flex-col border-r border-gray-200 bg-white shadow-sm md:flex">
      <div className="border-b border-gray-200 px-6 py-5">
        <Link href={`/${locale}/admin`} className="inline-flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Istanbul Airport
          </span>
          <span className="text-xl font-bold text-gray-900 transition hover:text-blue-700">
            {t("titleAdmin")}
          </span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-4 py-6">
        {navItems.map((item) => {
          const [basePath] = item.href.split("#");
          const isActive = pathname === basePath || pathname.startsWith(`${basePath}#`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? "border border-blue-100 bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-gray-100 px-4 py-5 text-xs text-gray-400">
        © {new Date().getFullYear()} IST Operations
      </div>
    </aside>
  );
}
