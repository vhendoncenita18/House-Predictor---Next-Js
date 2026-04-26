import Link from "next/link";

export function AdminDashboardHero() {
  return (
    <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-white/45">Admin console</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Dashboard overview</h1>
        <p className="max-w-3xl text-sm text-white/65 sm:text-base">
          Monitor platform activity, recent members, and the latest prediction traffic from one place.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/user/dashboard"
          className="inline-flex rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white/80 transition hover:bg-white/[0.08] hover:text-white"
        >
          Open user view
        </Link>
        <Link
          href="/user/predictions"
          className="inline-flex rounded-2xl border border-emerald-400/20 bg-emerald-400/12 px-4 py-2.5 text-sm font-medium text-emerald-100 transition hover:bg-emerald-400/18"
        >
          Review predictions
        </Link>
      </div>
    </section>
  );
}
