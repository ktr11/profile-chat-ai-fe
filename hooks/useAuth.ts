"use client";

import { useState, useEffect, useCallback } from "react";
import {
  signIn,
  signOut,
  signUp,
  confirmSignUp,
  resetPassword,
  confirmResetPassword,
  getCurrentUser,
  fetchAuthSession,
} from "aws-amplify/auth";

export type AuthUser = {
  username: string;
  userId: string;
};

export type TrialUser = {
  identityId: string;
};

export type AuthState =
  | { type: "loading" }
  | { type: "unauthenticated" }
  | { type: "trial"; user: TrialUser }
  | { type: "authenticated"; user: AuthUser };

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({ type: "loading" });

  useEffect(() => {
    getCurrentUser()
      .then((user) =>
        setAuthState({ type: "authenticated", user: { username: user.username, userId: user.userId } })
      )
      .catch(() => setAuthState({ type: "unauthenticated" }));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await signIn({ username: email, password });
    const user = await getCurrentUser();
    setAuthState({ type: "authenticated", user: { username: user.username, userId: user.userId } });
  }, []);

  const logout = useCallback(async () => {
    await signOut();
    setAuthState({ type: "unauthenticated" });
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    await signUp({ username: email, password, options: { userAttributes: { email } } });
  }, []);

  const confirmRegistration = useCallback(async (email: string, code: string) => {
    await confirmSignUp({ username: email, confirmationCode: code });
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    await resetPassword({ username: email });
  }, []);

  const confirmForgotPassword = useCallback(
    async (email: string, code: string, newPassword: string) => {
      await confirmResetPassword({ username: email, confirmationCode: code, newPassword });
    },
    []
  );

  const startTrial = useCallback(async () => {
    // ローカル開発時はダミー Identity ID を使用（cognito-local は Identity Pool 未サポート）
    if (process.env.NEXT_PUBLIC_MOCK_TRIAL === "true") {
      const mockIdentityId = "mock-identity-" + Math.random().toString(36).slice(2, 10);
      setAuthState({ type: "trial", user: { identityId: mockIdentityId } });
      return;
    }
    // 本番: Cognito Unauthenticated Identity から Identity ID を取得
    const session = await fetchAuthSession({ forceRefresh: true });
    const identityId = session.identityId;
    if (!identityId) throw new Error("Identity ID を取得できませんでした");
    setAuthState({ type: "trial", user: { identityId } });
  }, []);

  return {
    authState,
    login,
    logout,
    register,
    confirmRegistration,
    forgotPassword,
    confirmForgotPassword,
    startTrial,
  };
}
