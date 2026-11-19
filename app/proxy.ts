import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  console.log("proxy middleware called");
  const token = request.cookies.get("auth_token")?.value;
  const path = request.nextUrl.pathname;

  const isAuthRoute = path.startsWith("/login") || path.startsWith("/register");
  const isLandingRoute = path.startsWith("/");

  if (!token && !isAuthRoute && !isLandingRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
