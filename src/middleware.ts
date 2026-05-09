import { NextRequest, NextResponse } from "next/server";

const TRIAL_COOKIE = "trial-identity-id";

function isAuthenticated(request: NextRequest): boolean {
  return !!request.cookies.get("access_token")?.value;
}

function isTrial(request: NextRequest): boolean {
  return !!request.cookies.get(TRIAL_COOKIE)?.value;
}

export function middleware(request: NextRequest) {
  if (isAuthenticated(request) || isTrial(request)) {
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/chat", "/api/chat"],
};
