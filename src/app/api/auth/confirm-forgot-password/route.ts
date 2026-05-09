import { NextRequest, NextResponse } from "next/server";
import { ConfirmForgotPasswordCommand } from "@aws-sdk/client-cognito-identity-provider";
import { cognitoClient, computeSecretHash } from "@/lib/cognito";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const { email, code, newPassword } = await request.json();

  await cognitoClient.send(
    new ConfirmForgotPasswordCommand({
      ClientId: process.env.COGNITO_CLIENT_ID!,
      Username: email,
      ConfirmationCode: code,
      Password: newPassword,
      SecretHash: computeSecretHash(email),
    })
  );

  return NextResponse.json({ ok: true });
}
