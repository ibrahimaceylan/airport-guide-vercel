import Link from "next/link";

import Button from "@/components/Button";
import { resolveIcon, transitions } from "@/styles/design-tokens";

type HeaderLink = {
  label: string;
  href: string;
  icon?: string;
};

type HeaderProps = {
  locale: string;
  brand: {
    name: string;
    tagline: string;
    href: string;
  };
  nav: HeaderLink[];
  utility: HeaderLink[];
  cta?: HeaderLink;
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

export default function Header({ locale, brand, nav, utility, cta }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-sky-100/60 bg-white/95 text-slate-900 shadow-[0_20px_45px_-28px_rgba(14,165,233,0.25)] backdrop-blur">
      <div className="border-b border-sky-100/60 bg-gradient-to-r from-white/90 via-[#f1f8ff] to-[#fff5ec] text-slate-600">
        <div className="flex w-full items-center justify-between gap-4 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.25em] sm:px-6 lg:px-10">
          <span className="hidden text-slate-500 sm:inline-flex">{brand.tagline}</span>
          <div className="flex flex-1 justify-end gap-3 text-[11px] text-slate-600">
            {utility.map((item) => {
              const Icon = resolveIcon(item.icon ?? "default");
              const linkProps = getLinkProps(item.href);
              return (
                <Link
                  key={`${item.label}-${item.href}`}
                  href={item.href}
                  {...linkProps}
                  className="inline-flex items-center gap-1 transition hover:text-sky-600"
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden />
                  <span className="hidden md:inline">{item.label}</span>
                  <span className="md:hidden">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col gap-3 px-4 py-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between gap-4">
          <Link
            href={brand.href}
            className="inline-flex items-center gap-3 text-lg font-semibold tracking-[0.2em] text-slate-900 transition hover:text-sky-600"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sky-500 text-white shadow-[0_12px_24px_-18px_rgba(14,165,233,0.6)]">
              {brand.name.slice(0, 2)}
            </span>
            <span className="flex flex-col leading-tight">
              <span>{brand.name}</span>
              <span className="text-[11px] font-medium uppercase tracking-[0.4em] text-slate-400">{locale.toUpperCase()}</span>
            </span>
          </Link>

          <div className="hidden items-center gap-3 lg:flex">
            {nav.map((item) => {
              const linkProps = getLinkProps(item.href);
              return (
                <Link
                  key={`${item.label}-${item.href}`}
                  href={item.href}
                  {...linkProps}
                  className="text-sm font-semibold text-slate-600 transition hover:text-sky-600"
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            {cta ? (
              <Link
                href={cta.href}
                {...getLinkProps(cta.href)}
                className={[
                  "hidden items-center gap-2 rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_15px_28px_-18px_rgba(14,165,233,0.55)] transition hover:bg-sky-400 lg:inline-flex",
                  transitions.base,
                ].join(" ")}
              >
                <span>{cta.label}</span>
              </Link>
            ) : null}
            <Button
              type="button"
              variant="unstyled"
              aria-label="Navigation menu"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300/70 px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600 transition hover:border-sky-400 hover:text-sky-600 lg:hidden"
            >
              <span>Menu</span>
            </Button>
          </div>
        </div>

        <div className="-mx-4 flex overflow-x-auto pb-0 lg:hidden">
          <nav className="flex gap-3 px-4">
            {nav.map((item) => {
              const linkProps = getLinkProps(item.href);
              return (
                <Link
                  key={`${item.label}-${item.href}`}
                  href={item.href}
                  {...linkProps}
                  className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 transition hover:border-sky-300 hover:text-sky-600"
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
