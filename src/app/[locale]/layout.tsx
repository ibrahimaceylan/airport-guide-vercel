import "../globals.css";
import type { Metadata } from "next";
import IntlProvider from "@/lib/i18n/IntlProvider";
import type { ReactNode } from "react";
import { getMessages, getTranslations } from "next-intl/server";

import prisma from "@/lib/prisma";

import Footer from "./(site)/components/Footer";
import Header from "./(site)/components/Header";
import InstantAlerts from "./(site)/components/InstantAlerts";

export const metadata: Metadata = {
  title: "Istanbul Airport Guide",
  description: "Multilingual Istanbul Airport Guide — EN / TR / AR",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>; // 👈 async params in Next 15
}) {
  const { locale } = await params; // ✅ must await
  const isRtl = locale === "ar";

  // ✅ Pull messages using next-intl + your src/i18n/request.ts
  const messages = await getMessages({ locale });
  const headerT = await getTranslations({ locale, namespace: "layout.header" });
  const footerT = await getTranslations({ locale, namespace: "layout.footer" });

  const activeAlerts = await prisma.alert.findMany({
    where: {
      active: true,
      OR: [{ locale: "all" }, { locale }],
    },
    orderBy: [
      { severity: "desc" },
      { createdAt: "desc" },
    ],
    take: 6,
  });

  const now = new Date();
  const filteredAlerts = activeAlerts.filter((alert) => {
    if (alert.startAt && alert.startAt > now) return false;
    if (alert.endAt && alert.endAt < now) return false;
    return true;
  });

  const severityRank = (severity?: string | null) => {
    switch (severity) {
      case "CRITICAL":
        return 0;
      case "WARNING":
        return 1;
      default:
        return 2;
    }
  };

  const instantAlerts = filteredAlerts
    .sort((a, b) => {
      const rankDifference = severityRank(a.severity) - severityRank(b.severity);
      if (rankDifference !== 0) return rankDifference;
      return (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0);
    })
    .slice(0, 3)
    .map((alert) => ({
      id: alert.id,
      title: alert.title,
      message: alert.message,
      severity: alert.severity ?? undefined,
      ctaLabel: alert.ctaLabel ?? undefined,
      ctaUrl: alert.ctaUrl ?? undefined,
    }));

  const headerData = {
    brand: headerT.raw("brand") as {
      name: string;
      tagline: string;
      href: string;
    },
    nav:
      (headerT.raw("nav") as Array<{ label: string; href: string; icon?: string }> | undefined) ??
      [],
    utility:
      (headerT.raw("utility") as Array<{ label: string; href: string; icon?: string }> | undefined) ??
      [],
    cta: headerT.raw("cta") as { label: string; href: string; icon?: string },
  };

  const instantAlertsCopy = headerT.raw("instantAlerts") as {
    label: string;
    viewAll?: { label: string; href: string } | null;
  };

  const footerData = {
    brand: footerT.raw("brand") as { name: string; description: string },
    newsletter: footerT.raw("newsletter") as {
      title: string;
      description: string;
      cta: string;
      disclaimer: string;
    },
    social:
      (footerT.raw("social") as Array<{ label: string; href: string; icon?: string }> | undefined) ??
      [],
    columns: (footerT.raw("columns") as Array<{
      title: string;
      links: Array<{ label: string; href: string; icon?: string }>;
    }> | undefined) ?? [],
    legal: footerT.raw("legal") as {
      rights: string;
      links: Array<{ label: string; href: string }>;
    },
  };

  return (
    <html lang={locale} dir={isRtl ? "rtl" : "ltr"} suppressHydrationWarning>
      <body className="bg-gray-50 text-gray-900 antialiased">
        <IntlProvider locale={locale} messages={messages}>
          <div className="flex min-h-screen flex-col bg-gray-50">
            <InstantAlerts
              label={instantAlertsCopy.label}
              alerts={instantAlerts}
              viewAll={instantAlertsCopy.viewAll ?? null}
            />
            <Header locale={locale} {...headerData} />
            <main className="flex-1 pt-0">{children}</main>
            <Footer {...footerData} />
          </div>
        </IntlProvider>
      </body>
    </html>
  );
}
