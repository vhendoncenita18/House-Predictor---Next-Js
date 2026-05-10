import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { isAdminRole } from "@/lib/auth-role";

export default async function DashboardRoot() {
  const session = await getServerSession(authOptions);
  
  const role = (session?.user as { utype?: string } | undefined)?.utype;

  if (isAdminRole(role)) {
    redirect("/admin/dashboard");
  } else {
    redirect("/user/dashboard");
  }
}
