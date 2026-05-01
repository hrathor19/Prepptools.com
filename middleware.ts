import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login page and OAuth callback through
  if (pathname.startsWith("/admin/login") || pathname.startsWith("/admin/auth")) {
    return NextResponse.next();
  }

  // Protect all other /admin/* routes
  const token = request.cookies.get("admin_token")?.value;
  if (!token || token !== process.env.ADMIN_SECRET) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
