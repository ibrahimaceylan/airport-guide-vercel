import Link from "next/link";

import Button from "@/components/Button";
import { resolveIcon, transitions } from "@/styles/design-tokens";

type FooterLink = {
  label: string;
  href: string;
  icon?: string;
};

type FooterColumn = {
  title: string;
  links: FooterLink[];
};

type FooterProps = {
  brand: {
    name: string;
    description: string;
  };
  newsletter: {
    title: string;
    description: string;
    cta: string;
    disclaimer: string;
  };
  social: FooterLink[];
  columns: FooterColumn[];
  legal: {
    rights: string;
    links: FooterLink[];
  };
};

const getLinkProps = (href: string) => {
  if (href.startsWith("http")) {
    return {
      target: "_blank" as const,
      rel: "noopener noreferrer",
    };
  }

  return {};
};

export default function Footer({ brand, newsletter, social, columns, legal }: FooterProps) {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-slate-200 bg-gradient-to-b from-sky-50 via-white to-slate-100 text-slate-700">
      <div className="w-full px-4 py-16 sm:px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.1fr,1fr]">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">{brand.name}</h2>
              <p className="mt-2 max-w-md text-sm text-slate-600">{brand.description}</p>
            </div>
            <form className="space-y-3 rounded-2xl border border-sky-100 bg-white/90 p-6 shadow-[0_20px_45px_-30px_rgba(14,165,233,0.35)]" action="#" method="post">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600">{newsletter.title}</p>
                <p className="mt-2 text-sm text-slate-600">{newsletter.description}</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="flex flex-1 items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 focus-within:border-sky-300 focus-within:ring-1 focus-within:ring-sky-200/70">
                  <span className="text-xs uppercase tracking-[0.3em] text-slate-500">Email</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="traveller@example.com"
                    className="w-full border-none bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    aria-label="Email"
                  />
                </label>
                <Button
                  type="submit"
                  variant="unstyled"
                  label={newsletter.cta}
                  className={`${transitions.base} rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-white shadow-[0_18px_32px_-22px_rgba(14,165,233,0.55)] hover:bg-sky-400`}
                />
              </div>
              <p className="text-[11px] text-slate-500">{newsletter.disclaimer}</p>
            </form>
            <div className="flex flex-wrap gap-3">
              {social.map((item) => {
                const Icon = resolveIcon(item.icon ?? "default");
                return (
                  <Link
                    key={`${item.label}-${item.href}`}
                    href={item.href}
                    {...getLinkProps(item.href)}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-sky-300 hover:text-sky-600"
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            {columns.map((column) => (
              <div key={column.title} className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">{column.title}</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  {column.links.map((link) => {
                    const Icon = link.icon ? resolveIcon(link.icon) : null;
                    return (
                      <li key={`${link.label}-${link.href}`}>
                        <Link
                          href={link.href}
                          {...getLinkProps(link.href)}
                          className="inline-flex items-center gap-2 text-slate-600 transition hover:text-sky-600"
                        >
                          {Icon ? <Icon className="h-4 w-4 text-sky-500" aria-hidden /> : null}
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 bg-white/80">
        <div className="flex w-full flex-col gap-4 px-4 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
          <span>{legal.rights.replace("{year}", String(currentYear))}</span>
          <div className="flex flex-wrap gap-3">
            {legal.links.map((link) => (
              <Link
                key={`${link.label}-${link.href}`}
                href={link.href}
                {...getLinkProps(link.href)}
                className="text-slate-500 transition hover:text-sky-600"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
