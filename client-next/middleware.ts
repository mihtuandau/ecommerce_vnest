import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwt } from "jose";

const publicPaths = ["/login", "/register", "/forgot-password", "/reset-password"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;

  // 1. Redirect logged-in users away from auth pages
  if (token && publicPaths.some((path) => pathname.startsWith(path))) {
    try {
      const decoded = decodeJwt(token) as { role: string };
      if (decoded.role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.redirect(new URL("/", request.url));
    } catch (error) {
      return NextResponse.next();
    }
  }

  // 2. Allow public paths
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 3. Check auth token for all other paths
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const decoded = decodeJwt(token) as { role: string };

    // 4. Protect admin paths
    if (pathname.startsWith("/admin")) {
      if (decoded.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  } catch (error) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
