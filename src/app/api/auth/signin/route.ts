import { NextRequest, NextResponse } from "next/server";
import { InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";
import { cognitoClient, computeSecretHash } from "@/lib/cognito";
import { setAuthCookies } from "@/lib/cookies";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  const result = await cognitoClient.send(
    new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: process.env.COGNITO_CLIENT_ID!,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        SECRET_HASH: computeSecretHash(email),
      },
    })
  );

  const auth = result.AuthenticationResult;
  if (!auth?.AccessToken || !auth.RefreshToken) {
    return NextResponse.json({ error: "認証に失敗しました" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  setAuthCookies(response, auth.AccessToken, auth.RefreshToken);
  return response;
}
