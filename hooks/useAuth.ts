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

const TRIAL_IDENTITY_COOKIE = "trial-identity-id";

function readTrialCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )trial-identity-id=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

function writeTrialCookie(identityId: string) {
  const expires = new Date(Date.now() + 30 * 864e5).toUTCString();
  document.cookie = `${TRIAL_IDENTITY_COOKIE}=${encodeURIComponent(identityId)}; expires=${expires}; path=/; SameSite=Strict`;
}

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
  const [authState, setAuthState] = useState<AuthState>(() => {
    const trialId = readTrialCookie();
    if (trialId) return { type: "trial", user: { identityId: trialId } };
    return { type: "loading" };
  });

  useEffect(() => {
    if (authState.type !== "loading") return;
    getCurrentUser()
      .then((user) =>
        setAuthState({ type: "authenticated", user: { username: user.username, userId: user.userId } })
      )
      .catch(() => setAuthState({ type: "unauthenticated" }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await signIn({ username: email, password });
    const user = await getCurrentUser();
    setAuthState({ type: "authenticated", user: { username: user.username, userId: user.userId } });
  }, []);

  const logout = useCallback(async () => {
    // trial Cookie を削除
    document.cookie = `${TRIAL_IDENTITY_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    await signOut().catch(() => {});
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
    let identityId: string;
    if (process.env.NEXT_PUBLIC_MOCK_TRIAL === "true") {
      identityId = "mock-identity-" + Math.random().toString(36).slice(2, 10);
    } else {
      // 本番: Cognito Unauthenticated Identity から Identity ID を取得
      const session = await fetchAuthSession({ forceRefresh: true });
      if (!session.identityId) throw new Error("Identity ID を取得できませんでした");
      identityId = session.identityId;
    }
    writeTrialCookie(identityId);
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
