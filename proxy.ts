import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authCookieName, verifyAuthToken } from "@/src/lib/auth-session";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(authCookieName)?.value;
  const session = token ? await verifyAuthToken(token) : null;

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/favorites/:path*"],
};
