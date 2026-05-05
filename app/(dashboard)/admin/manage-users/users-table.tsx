"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useState } from "react";

type ManageUserRecord = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  utype: string;
  createdAt: string;
  predictionCount: number;
};

type UsersTableProps = {
  users: ManageUserRecord[];
  currentUserId?: string;
};

export function UsersTable({ users, currentUserId }: UsersTableProps) {
  const router = useRouter();
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleDeleteUser(user: ManageUserRecord) {
    const confirmed = window.confirm(
      `Delete ${user.firstName} ${user.lastName} and ${user.predictionCount} prediction${
        user.predictionCount === 1 ? "" : "s"
      }?`
    );

    if (!confirmed) {
      return;
    }

    setDeletingUserId(user.id);
    setError(null);

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "DELETE",
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Unable to delete user.");
      }

      router.refresh();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete user.");
    } finally {
      setDeletingUserId(null);
    }
  }

  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/3">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left">
          <thead className="bg-white/4">
            <tr className="border-b border-white/10">
              <th className="px-5 py-4 text-xs font-medium uppercase tracking-[0.24em] text-white/45">
                User
              </th>
              <th className="px-5 py-4 text-xs font-medium uppercase tracking-[0.24em] text-white/45">
                Username
              </th>
              <th className="px-5 py-4 text-xs font-medium uppercase tracking-[0.24em] text-white/45">
                Role
              </th>
              <th className="px-5 py-4 text-xs font-medium uppercase tracking-[0.24em] text-white/45">
                Joined
              </th>
              <th className="px-5 py-4 text-xs font-medium uppercase tracking-[0.24em] text-white/45">
                Predictions
              </th>
              <th className="px-5 py-4 text-xs font-medium uppercase tracking-[0.24em] text-white/45">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => {
              const isCurrentAdmin = currentUserId === user.id;
              const isDeleting = deletingUserId === user.id;

              return (
                <tr
                  key={user.id}
                  className="border-b border-white/10 transition last:border-b-0 hover:bg-white/3"
                >
                  <td className="px-5 py-4 align-middle">
                    <p className="text-sm font-semibold text-white">
                      {user.firstName} {user.lastName}
                    </p>
                  </td>

                  <td className="px-5 py-4 align-middle text-sm text-white/65">@{user.username}</td>

                  <td className="px-5 py-4 align-middle">
                    <span className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-cyan-100/80">
                      {user.utype}
                    </span>
                  </td>

                  <td className="px-5 py-4 align-middle text-sm text-white/65">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-5 py-4 align-middle text-sm font-semibold text-white">
                    {user.predictionCount}
                  </td>

                  <td className="px-5 py-4 align-middle">
                    <button
                      type="button"
                      onClick={() => void handleDeleteUser(user)}
                      disabled={isCurrentAdmin || isDeleting}
                      className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-xs font-medium uppercase tracking-[0.18em] text-red-100 transition hover:bg-red-400/16 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Trash2 className="size-3.5" />
                      <span>{isDeleting ? "Deleting..." : "Delete"}</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {error ? (
        <div className="border-t border-red-400/20 bg-red-400/10 px-5 py-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}
    </div>
  );
}
