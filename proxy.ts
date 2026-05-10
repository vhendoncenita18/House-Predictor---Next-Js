import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { isAdminRole } from "@/lib/auth-role";

export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (path.startsWith("/admin") && !isAdminRole(token?.utype as string | undefined)) {
      return NextResponse.redirect(new URL("/user/dashboard", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/user/:path*",
    "/dashboard/:path*",
  ],
};
