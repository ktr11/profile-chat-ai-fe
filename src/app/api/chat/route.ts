import { NextRequest, NextResponse } from "next/server";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { refreshAccessToken } from "@/lib/cognito";
import { setAuthCookies } from "@/lib/cookies";

const TRIAL_COOKIE = "trial-identity-id";

export const runtime = "nodejs";

async function verifyToken(token: string): Promise<string | null> {
  const verifier = CognitoJwtVerifier.create({
    userPoolId: process.env.COGNITO_USER_POOL_ID!,
    tokenUse: "access",
    clientId: process.env.COGNITO_CLIENT_ID!,
  });
  try {
    const payload = await verifier.verify(token);
    return payload.sub;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const trialId = request.cookies.get(TRIAL_COOKIE)?.value ?? null;
  let accessToken = request.cookies.get("access_token")?.value ?? null;
  const refreshToken = request.cookies.get("refresh_token")?.value ?? null;

  if (!trialId && !accessToken && !refreshToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let newTokenSet: { accessToken: string; refreshToken: string } | null = null;
  let userSub: string | null = null;

  if (!trialId && accessToken) {
    userSub = await verifyToken(accessToken);
    if (!userSub) {
      if (!refreshToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      try {
        newTokenSet = await refreshAccessToken(refreshToken);
        accessToken = newTokenSet.accessToken;
        userSub = await verifyToken(accessToken);
      } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }
  }

  const pythonApiUrl = process.env.PYTHON_API_URL;
  if (!pythonApiUrl) {
    return NextResponse.json({ error: "PYTHON_API_URL is not set" }, { status: 500 });
  }

  const body = await request.json();

  const userId = trialId ? `trial:${trialId}` : userSub ?? "";

  const upstream = await fetch(`${pythonApiUrl}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Internal-API-Key": process.env.INTERNAL_API_KEY ?? "",
      "X-User-Id": userId,
    },
    body: JSON.stringify(body),
  });

  const response = new NextResponse(upstream.body, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("Content-Type") ?? "text/event-stream",
      "Cache-Control": "no-cache",
    },
  });

  if (newTokenSet) {
    setAuthCookies(response, newTokenSet.accessToken, newTokenSet.refreshToken);
  }

  return response;
}
