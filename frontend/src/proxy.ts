import { NextRequest, NextResponse } from "next/server";

// Routes that require login
const PROTECTED = [
  "/dashboard",
  "/theme-select",
  "/coding",
  "/aptitude",
  "/mock-interview",
  "/prep-hub",
  "/resume-builder",
  "/skillmap",
  "/linkedin-optimizer",
  "/github-optimizer",
  "/jobs",
  "/admin",
];

// Routes only for guests (redirect logged-in users to dashboard)
const GUEST_ONLY = ["/login", "/register"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isLoggedIn = req.cookies.get("skillora_auth")?.value === "1";

  // Redirect unauthenticated users trying to access protected routes → /login
  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  if (isProtected && !isLoggedIn) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname); // preserve intended destination
    return NextResponse.redirect(url);
  }

  // Redirect logged-in users away from login/register → /dashboard
  const isGuestOnly = GUEST_ONLY.some((p) => pathname.startsWith(p));
  if (isGuestOnly && isLoggedIn) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public assets
     * - api routes (auth callbacks)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.svg$|api/).*)",
  ],
};
