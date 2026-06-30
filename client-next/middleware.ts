import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

type AuthPayload = {
  role?: string;
};

// Fix 4: khai báo một lần — thêm role mới chỉ cần sửa đây
const STAFF_ROLES = new Set(["ADMIN", "WAREHOUSE", "SALES"]);

function isStaffRole(role?: string): boolean {
  return !!role && STAFF_ROLES.has(role);
}

async function verifyAccessToken(token: string): Promise<AuthPayload | null> {
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );
    return payload as AuthPayload;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;

  const isAuthPage = ["/login", "/register", "/forgot-password", "/reset-password"].some(path => pathname.startsWith(path));
  const isAdminPage = pathname.startsWith("/admin");
  const isAccountPage = pathname.startsWith("/account");

  // 1. Redirect logged-in users away from auth pages
  if (token && isAuthPage) {
    const payload = await verifyAccessToken(token);
    if (payload) {
      return NextResponse.redirect(new URL(isStaffRole(payload.role) ? "/admin" : "/", request.url));
    }
    return NextResponse.next();
  }

  // 2. Protect Admin & Account pages
  if (isAdminPage || isAccountPage) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const payload = await verifyAccessToken(token);
    if (!payload) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (isAdminPage && !isStaffRole(payload.role)) {
      return NextResponse.redirect(new URL("/", request.url));
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
