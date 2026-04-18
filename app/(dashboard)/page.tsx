import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function DashboardRoot() {
  const session = await getServerSession();
  
  const role = (session?.user as any).utype;

  if (role === "Admin") {
    redirect("/admin/dashboard");
  } else {
    redirect("/user/dashboard");
  }
}