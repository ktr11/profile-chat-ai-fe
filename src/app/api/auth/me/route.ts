import { NextRequest, NextResponse } from "next/server";
import { GetUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import { cognitoClient } from "@/lib/cognito";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const result = await cognitoClient.send(
    new GetUserCommand({ AccessToken: accessToken })
  );

  const email = result.UserAttributes?.find((a) => a.Name === "email")?.Value ?? "";

  return NextResponse.json({
    authenticated: true,
    username: result.Username,
    email,
  });
}
