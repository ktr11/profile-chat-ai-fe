import { NextRequest, NextResponse } from "next/server";
import { GlobalSignOutCommand } from "@aws-sdk/client-cognito-identity-provider";
import { cognitoClient } from "@/lib/cognito";
import { clearAuthCookies } from "@/lib/cookies";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;

  if (accessToken) {
    await cognitoClient.send(
      new GlobalSignOutCommand({ AccessToken: accessToken })
    ).catch(() => {});
  }

  const response = NextResponse.json({ ok: true });
  clearAuthCookies(response);
  response.cookies.set("trial-identity-id", "", { maxAge: 0, path: "/" });
  return response;
}
