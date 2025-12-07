// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const TOKEN_NAME = "saasify_token";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // allow all non-dashboard routes
  if (
    pathname === "/" || // login page
    pathname.startsWith("/api/") || // APIs
    pathname.startsWith("/_next/") || // Next internals
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // sirf /dashboard routes protect karna hai
  if (pathname.startsWith("/dashboard")) {
    const token = request.cookies.get(TOKEN_NAME)?.value;

    // agar token nahi hai, login pe bhej do
    if (!token) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // token hai, to proceed
    return NextResponse.next();
  }

  // baaki sab allow
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|static|favicon.ico).*)"],
};