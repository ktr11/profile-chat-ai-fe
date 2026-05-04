/**
 * 認証ガードミドルウェア
 *
 * `/chat` と `/api/chat` へのアクセスを保護する。
 * Cognito accessToken Cookie または試用 Cookie（`trial-identity-id`）が
 * 存在しない場合は `/login` へリダイレクトする。
 *
 * 注意: Cookie の存在チェックのみで JWT の署名検証は行わない。
 * 実際の検証は `app/api/chat/route.ts` の `verifyToken` で行う。
 */
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
