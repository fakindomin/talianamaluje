import { NextRequest, NextResponse } from "next/server";
import { STUDIO_COOKIE, sha256 } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const password = process.env.STUDIO_PASSWORD;
  const loginUrl = new URL("/login", request.url);
  if (!password) return NextResponse.redirect(loginUrl);

  const expected = await sha256(password);
  const cookie = request.cookies.get(STUDIO_COOKIE)?.value;
  if (cookie === expected) return NextResponse.next();

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/studio/:path*"]
};
