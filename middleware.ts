import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { isAdminRole } from "@/lib/auth-role";

export default withAuth(
  function middleware(req) {
    // The token is automatically decrypted by withAuth
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // 1. Guard for Admin routes
    // If path starts with /admin and the user is NOT an Admin, kick them back to user dashboard
    if (path.startsWith("/admin") && !isAdminRole(token?.utype as string | undefined)) {
      return NextResponse.redirect(new URL("/user/dashboard", req.url));
    }

    // 2. Guard for User routes
    // If path starts with /user and they aren't logged in (handled by 'authorized' below)
    // You can also prevent Admins from seeing user pages here if you want to be strict
  },
  {
    callbacks: {
      // This part ensures the user is logged in. 
      // If 'authorized' returns false, they get sent to /login automatically.
      authorized: ({ token }) => !!token,
    },
  }
);

// 3. The Matcher: This defines which routes this "guard" watches.
export const config = { 
  matcher: [
    "/admin/:path*", 
    "/user/:path*", 
    "/dashboard/:path*"
  ] 
};
