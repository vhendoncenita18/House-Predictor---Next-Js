import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { sectionCardClassName } from "@/components/user-dashboard/containerCards";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { isAdminRole } from "@/lib/auth-role";
import prisma from "@/lib/prisma";

import { AdminPageIntro } from "../admin-page-intro";
import { AdminShell } from "../admin-shell";
import { UsersTable } from "./users-table";

export default async function AdminManageUsersPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { utype?: string } | undefined)?.utype;
  const currentUserId = (session?.user as { id?: string } | undefined)?.id;

  if (!isAdminRole(role)) {
    redirect("/user/dashboard");
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      username: true,
      utype: true,
      createdAt: true,
      _count: {
        select: {
          predictions: true,
        },
      },
    },
  });

  return (
    <AdminShell>
      <AdminPageIntro
        eyebrow="Admin users"
        title="Manage users"
        description="Review accounts, roles, and how active each member is across the prediction workflow."
      />

      <section className={sectionCardClassName}>
        <UsersTable
          users={users.map((user:any) => ({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            utype: user.utype,
            createdAt: user.createdAt.toISOString(),
            predictionCount: user._count.predictions,
          }))}
          currentUserId={currentUserId}
        />
      </section>
    </AdminShell>
  );
}
