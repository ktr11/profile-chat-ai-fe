import { NextRequest, NextResponse } from "next/server";
import { ForgotPasswordCommand } from "@aws-sdk/client-cognito-identity-provider";
import { cognitoClient, computeSecretHash } from "@/lib/cognito";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  await cognitoClient.send(
    new ForgotPasswordCommand({
      ClientId: process.env.COGNITO_CLIENT_ID!,
      Username: email,
      SecretHash: computeSecretHash(email),
    })
  );

  return NextResponse.json({ ok: true });
}
