import { NextRequest, NextResponse } from "next/server";
import { CognitoJwtVerifier } from "aws-jwt-verify";

const COGNITO_COOKIE_PREFIX = "CognitoIdentityServiceProvider";
const TRIAL_COOKIE = "trial-identity-id";

// Node.js Runtime で JWT 完全検証（aws-jwt-verify は Edge Runtime 非対応）
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
