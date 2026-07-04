import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const isLoginPage = req.nextUrl.pathname === "/admin/login";
  const hasToken = req.cookies.has("admin_token");

  if (!isLoginPage && !hasToken) {
    const loginUrl = new URL("/admin/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginPage && hasToken) {
    const adminUrl = new URL("/admin", req.url);
    return NextResponse.redirect(adminUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
