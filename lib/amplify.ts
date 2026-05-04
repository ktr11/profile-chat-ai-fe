import { Amplify } from "aws-amplify";
import { cognitoUserPoolsTokenProvider } from "aws-amplify/auth/cognito";
import { CookieStorage } from "aws-amplify/utils";

export function configureAmplify() {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
        userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID!,
        signUpVerificationMethod: "code",
      },
    },
  });

  cognitoUserPoolsTokenProvider.setKeyValueStorage(
    new CookieStorage({
      domain:
        typeof window !== "undefined" ? window.location.hostname : "localhost",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    })
  );
}
