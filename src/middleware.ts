import { NextRequest, NextResponse } from "next/server";

const TRIAL_COOKIE = "trial_uuid";

export function middleware(request: NextRequest) {
  if (request.cookies.get(TRIAL_COOKIE)?.value) {
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/chat", "/api/chat"],
};
