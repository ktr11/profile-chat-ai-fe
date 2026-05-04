import { NextRequest, NextResponse } from "next/server";

const COGNITO_COOKIE_PREFIX = "CognitoIdentityServiceProvider";
const TRIAL_COOKIE = "trial-identity-id";

function isAuthenticated(request: NextRequest): boolean {
  for (const key of request.cookies.getAll().map((c) => c.name)) {
    if (key.startsWith(COGNITO_COOKIE_PREFIX) && key.endsWith(".accessToken")) {
      return true;
    }
  }
  return false;
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
