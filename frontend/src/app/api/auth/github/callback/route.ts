import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) return NextResponse.redirect(new URL("/login?error=no_code", req.url));
  // Forward to backend which handles the token exchange + email
  return NextResponse.redirect(
    new URL(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/auth/github/callback?code=${encodeURIComponent(code)}`)
  );
}
