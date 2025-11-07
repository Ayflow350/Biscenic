// PASTE THIS CODE INTO: middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  const originalPathname = request.nextUrl.pathname;
  const lowercasePathname = originalPathname.toLowerCase();

  console.log(`\n--- [Middleware] Path: ${originalPathname} ---`);
  console.log(`- Token Found: ${token ? "Yes" : "No"}`);

  const protectedRoutes = [
    "/Dashboard",
    "/Profile",
    "/Admin",
    "/Payment",
    "/Checkout",
  ];
  const isProtectedRoute = protectedRoutes.some((route) =>
    lowercasePathname.startsWith(route.toLowerCase())
  );
  console.log(`- Is Protected Route? ${isProtectedRoute}`);

  if (isProtectedRoute && !token) {
    const url = new URL("/signin", request.url);
    url.searchParams.set("from", originalPathname);
    console.log(`- Action: REDIRECTING to signin. Destination: ${url.href}`);
    console.log("--------------------------------------------------\n");
    return NextResponse.redirect(url);
  }

  const authRoutes = ["/signup"];
  if (authRoutes.includes(lowercasePathname) && token) {
    const url = new URL("/Dashboard", request.url);
    console.log(`- Action: REDIRECTING to Dashboard (user already logged in).`);
    console.log("--------------------------------------------------\n");
    return NextResponse.redirect(url);
  }

  console.log("- Action: ALLOWED.");
  console.log("--------------------------------------------------\n");
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
