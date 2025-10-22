"use client";

type DashboardCardProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  id?: string;
  children: React.ReactNode;
};

export default function DashboardCard({
  title,
  description,
  actions,
  id,
  children,
}: DashboardCardProps) {
  return (
    <section
      id={id}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="font-semibold text-lg text-gray-900">{title}</h2>
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div>{children}</div>
    </section>
  );
}
