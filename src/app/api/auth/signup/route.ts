import { NextRequest, NextResponse } from "next/server";
import { SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { cognitoClient, computeSecretHash } from "@/lib/cognito";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  await cognitoClient.send(
    new SignUpCommand({
      ClientId: process.env.COGNITO_CLIENT_ID!,
      Username: email,
      Password: password,
      SecretHash: computeSecretHash(email),
      UserAttributes: [{ Name: "email", Value: email }],
    })
  );

  return NextResponse.json({ ok: true });
}
