export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/80">
      <div className="flex w-full flex-col gap-2 px-4 py-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} Istanbul Airport Guide (v2). All rights reserved.</p>
        <p className="text-slate-500">
          Phase 1 — Single-site setup powered by Next.js, Tailwind CSS, and Prisma.
        </p>
      </div>
    </footer>
  );
}
