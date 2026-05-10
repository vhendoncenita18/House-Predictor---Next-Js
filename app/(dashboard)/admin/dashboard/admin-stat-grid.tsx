import { sectionCardClassName } from "@/components/user-dashboard/containerCards";

import type { AdminDashboardStat } from "./dashboard-types";

type AdminStatGridProps = {
  stats: AdminDashboardStat[];
};

export function AdminStatGrid({ stats }: AdminStatGridProps) {
  return (
    <section className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <article key={stat.label} className={`${sectionCardClassName} min-w-0`}>
          <p className="text-xs uppercase tracking-[0.22em] text-white/45 sm:tracking-[0.28em]">
            {stat.label}
          </p>
          <p className="mt-4 min-w-0 [overflow-wrap:anywhere] break-words text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {stat.value}
          </p>
          <p className="mt-3 min-w-0 [overflow-wrap:anywhere] break-words text-sm leading-6 text-white/60">
            {stat.hint}
          </p>
        </article>
      ))}
    </section>
  );
}
