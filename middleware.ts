import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let the login page through always
  if (pathname === "/admin/login") return NextResponse.next();

  // Protect all /admin/* routes
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
