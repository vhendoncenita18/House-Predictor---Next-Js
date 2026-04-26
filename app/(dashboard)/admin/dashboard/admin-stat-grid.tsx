import { sectionCardClassName } from "@/components/user-dashboard/containerCards";

import type { AdminDashboardStat } from "./dashboard-types";

type AdminStatGridProps = {
  stats: AdminDashboardStat[];
};

export function AdminStatGrid({ stats }: AdminStatGridProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <article key={stat.label} className={sectionCardClassName}>
          <p className="text-xs uppercase tracking-[0.28em] text-white/45">{stat.label}</p>
          <p className="mt-4 text-3xl font-semibold tracking-tight text-white">{stat.value}</p>
          <p className="mt-3 text-sm text-white/60">{stat.hint}</p>
        </article>
      ))}
    </section>
  );
}
