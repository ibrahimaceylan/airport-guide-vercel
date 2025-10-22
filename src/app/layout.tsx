import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import SessionProviderWrapper from "@/lib/providers/SessionProviderWrapper";

export const metadata: Metadata = {
  title: "Istanbul Airport Guide",
  description: "Navigating IST with confidence",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className="bg-gray-50 text-gray-900 antialiased">
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
      </body>
    </html>
  );
}
