import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { sectionCardClassName } from "@/components/user-dashboard/containerCards";
import { isAdminRole } from "@/lib/auth-role";

import { AdminPageIntro } from "../admin-page-intro";
import { AdminShell } from "../admin-shell";

const adminPrinciples = [
  "Keep user activity easy to review so admins can understand platform usage quickly.",
  "Surface prediction history in a clear, grouped format rather than isolated records.",
  "Give admins visibility into members, trends, and prediction quality before deeper moderation tools are added.",
];

export default async function AdminAboutPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { utype?: string } | undefined)?.utype;

  if (!isAdminRole(role)) {
    redirect("/user/dashboard");
  }

  return (
    <AdminShell>
      <AdminPageIntro
        eyebrow="Admin about"
        title="About the admin area"
        description="This space is built to help admins monitor users, review prediction history, and understand how the platform is being used."
      />

      <section className={sectionCardClassName}>
        <div className="grid gap-4 md:grid-cols-3">
          {adminPrinciples.map((principle) => (
            <article
              key={principle}
              className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5"
            >
              <p className="text-sm leading-7 text-white/75">{principle}</p>
            </article>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
