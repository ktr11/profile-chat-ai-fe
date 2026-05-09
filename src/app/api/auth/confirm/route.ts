import { NextRequest, NextResponse } from "next/server";
import { ConfirmSignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { cognitoClient, computeSecretHash } from "@/lib/cognito";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const { email, code } = await request.json();

  await cognitoClient.send(
    new ConfirmSignUpCommand({
      ClientId: process.env.COGNITO_CLIENT_ID!,
      Username: email,
      ConfirmationCode: code,
      SecretHash: computeSecretHash(email),
    })
  );

  return NextResponse.json({ ok: true });
}
