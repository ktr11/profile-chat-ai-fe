/**
 * BFF: チャット SSE 中継エンドポイント (`POST /api/chat`)
 *
 * 役割:
 * - 認証ゲート: Cookie の Cognito accessToken を検証し、未認証リクエストを遮断する
 * - 試用ユーザー許可: `trial-identity-id` Cookie があれば JWT 検証をスキップして通過させる
 * - SSE 中継: Python API (`PYTHON_API_URL/chat`) のレスポンス body を
 *   バッファリングせず `ReadableStream` のままクライアントへパイプする
 *
 * Runtime: Node.js（`aws-jwt-verify` が Edge Runtime 非対応のため）
 */
import { NextRequest, NextResponse } from "next/server";
import { CognitoJwtVerifier } from "aws-jwt-verify";

const COGNITO_COOKIE_PREFIX = "CognitoIdentityServiceProvider";
const TRIAL_COOKIE = "trial-identity-id";

export const runtime = "nodejs";

function getAccessTokenFromCookies(request: NextRequest): string | null {
  for (const cookie of request.cookies.getAll()) {
    if (
      cookie.name.startsWith(COGNITO_COOKIE_PREFIX) &&
      cookie.name.endsWith(".accessToken")
    ) {
      return cookie.value;
    }
  }
  return null;
}

async function verifyToken(token: string): Promise<boolean> {
  const verifier = CognitoJwtVerifier.create({
    userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
    tokenUse: "access",
    clientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID!,
  });
  try {
    await verifier.verify(token);
    return true;
  } catch {
    return false;
  }
}

/**
 * 認証状態に応じた2パスの検証を行う。
 * - trial Cookie あり: JWT 検証なしで通過（Identity ID は Python API 側で処理）
 * - accessToken あり: Cognito で署名検証し、失敗なら 401
 * - どちらもなし: 401
 *
 * 認証通過後は Python API へリクエストを転送し、SSE レスポンスをそのままパイプする。
 */
export async function POST(request: NextRequest) {
  const isTrial = !!request.cookies.get(TRIAL_COOKIE)?.value;
  const accessToken = getAccessTokenFromCookies(request);

  if (!isTrial && !accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (accessToken && !(await verifyToken(accessToken))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const pythonApiUrl = process.env.PYTHON_API_URL;
  if (!pythonApiUrl) {
    return NextResponse.json({ error: "PYTHON_API_URL is not set" }, { status: 500 });
  }

  const body = await request.json();

  const upstream = await fetch(`${pythonApiUrl}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Internal-API-Key": process.env.INTERNAL_API_KEY ?? "",
    },
    body: JSON.stringify(body),
  });

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("Content-Type") ?? "text/event-stream",
      "Cache-Control": "no-cache",
    },
  });
}
