// src/app/dashboard/layout.tsx
import type { ReactNode } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function DashboardGroupLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardLayout title="Dashboard" subtitle="Admin Panel">
      {children}
    </DashboardLayout>
  );
}
