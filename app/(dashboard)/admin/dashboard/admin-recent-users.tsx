import { sectionCardClassName } from "@/components/user-dashboard/containerCards";
import { isAdminRole } from "@/lib/auth-role";

import type { AdminRecentUser } from "./dashboard-types";

type AdminRecentUsersProps = {
  users: AdminRecentUser[];
};

export function AdminRecentUsers({ users }: AdminRecentUsersProps) {
  return (
    <section className={`${sectionCardClassName} min-w-0`}>
      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.24em] text-white/45 sm:tracking-[0.3em]">
            Members
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Recent users</h2>
        </div>
        <p className="max-w-full text-sm leading-6 text-white/55 sm:max-w-48 sm:text-right">
          Newest accounts on the platform.
        </p>
      </div>

      <div className="mt-6 space-y-3">
        {users.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.02] px-5 py-8 text-sm text-white/55">
            No users found yet.
          </div>
        ) : (
          users.map((user) => (
            <article
              key={user.id}
              className="flex min-w-0 flex-col gap-3 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="[overflow-wrap:anywhere] break-words text-base font-medium text-white">
                  {user.firstName} {user.lastName}
                </p>
                <p className="mt-1 [overflow-wrap:anywhere] break-words text-sm text-white/55">
                  @{user.username}
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-3 text-sm">
                <span
                  className={`rounded-full px-3 py-1 ${
                    isAdminRole(user.utype)
                      ? "bg-cyan-400/12 text-cyan-100"
                      : "bg-white/[0.06] text-white/70"
                  }`}
                >
                  {user.utype}
                </span>
                <span className="text-white/50">{user.createdAt.toLocaleDateString()}</span>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
