export default function Header() {
  return (
    <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <div className="flex w-full items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col">
          <span className="text-sm uppercase tracking-[0.3em] text-sky-400">
            Istanbul Airport Guide
          </span>
          <h1 className="text-xl font-semibold text-slate-100">
            Navigating IST with confidence
          </h1>
        </div>
        <nav className="hidden gap-6 text-sm font-medium text-slate-200 md:flex">
          <a href="#highlights" className="hover:text-sky-300">
            Highlights
          </a>
          <a href="#transport" className="hover:text-sky-300">
            Transport
          </a>
          <a href="#at-airport" className="hover:text-sky-300">
            At the Airport
          </a>
          <a href="#cta" className="hover:text-sky-300">
            Updates
          </a>
        </nav>
      </div>
    </header>
  );
}
