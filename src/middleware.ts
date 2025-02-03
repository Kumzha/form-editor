import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const authToken = req.cookies.get("authToken")?.value || ""; // Fetch token from cookies (localStorage is not accessible here)

  const protectedRoutes = ["/dashboard", "/profile", "/settings", "/"];

  if (protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
    if (!authToken) {
      console.log("Redirecting to login due to unauthenticated access...");
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
