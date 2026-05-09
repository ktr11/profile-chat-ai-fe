import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { createHmac } from "crypto";

export const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.COGNITO_REGION ?? "ap-northeast-1",
});

export function computeSecretHash(username: string): string {
  return createHmac("sha256", process.env.COGNITO_CLIENT_SECRET!)
    .update(username + process.env.COGNITO_CLIENT_ID!)
    .digest("base64");
}

export type TokenSet = {
  accessToken: string;
  refreshToken: string;
};

export async function refreshAccessToken(refreshToken: string): Promise<TokenSet> {
  const clientId = process.env.COGNITO_CLIENT_ID!;
  const secretHash = computeSecretHash(clientId);

  const result = await cognitoClient.send(
    new InitiateAuthCommand({
      AuthFlow: "REFRESH_TOKEN_AUTH",
      ClientId: clientId,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
        SECRET_HASH: secretHash,
      },
    })
  );

  const auth = result.AuthenticationResult;
  if (!auth?.AccessToken) {
    throw new Error("トークンのリフレッシュに失敗しました");
  }

  return {
    accessToken: auth.AccessToken,
    refreshToken: auth.RefreshToken ?? refreshToken,
  };
}
