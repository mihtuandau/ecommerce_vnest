import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwt } from "jose";

const publicPaths = ["/login", "/register", "/forgot-password", "/reset-password"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;

  const isAuthPage = ["/login", "/register", "/forgot-password", "/reset-password"].some(path => pathname.startsWith(path));
  const isAdminPage = pathname.startsWith("/admin");
  const isAccountPage = pathname.startsWith("/account");

  // 1. Redirect logged-in users away from auth pages
  if (token && isAuthPage) {
    try {
      const decoded = decodeJwt(token) as { role: string };
      return NextResponse.redirect(new URL(decoded.role === "ADMIN" ? "/admin" : "/", request.url));
    } catch (error) {
      return NextResponse.next();
    }
  }

  // 2. Protect Admin & Account pages
  if (isAdminPage || isAccountPage) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const decoded = decodeJwt(token) as { role: string };
      if (isAdminPage && decoded.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // 3. All other pages (/, /shop, /checkout, /orders/guest, etc.) are public
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
