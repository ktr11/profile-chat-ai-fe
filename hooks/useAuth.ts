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

/** Cognito でログイン済みのユーザー情報 */
export type AuthUser = {
  username: string;
  userId: string;
};

/** Cognito Unauthenticated Identity を使った試用ユーザー情報 */
export type TrialUser = {
  identityId: string;
};

/**
 * 認証状態を表す discriminated union。
 *
 * - `loading`        : 初期化中（Cognito セッション確認前）
 * - `unauthenticated`: 未ログイン・試用もしていない
 * - `trial`          : 試用中（Cookie に identityId を保持）
 * - `authenticated`  : ログイン済み
 *
 * `trial` と `authenticated` は排他。`startTrial()` 呼び出し後は
 * `login()` を呼ぶと `authenticated` に遷移し、試用 Cookie は `logout()` で削除される。
 */
export type AuthState =
  | { type: "loading" }
  | { type: "unauthenticated" }
  | { type: "trial"; user: TrialUser }
  | { type: "authenticated"; user: AuthUser };

/**
 * アプリ全体の認証状態を管理するフック。
 *
 * マウント時に Cookie → Cognito セッションの順で状態を復元する。
 * 試用 Cookie が存在する場合は Cognito 確認をスキップして `trial` 状態で開始する。
 *
 * @returns `authState` と、状態を遷移させる各操作関数
 */
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

  /**
   * ログアウトする。試用 Cookie も同時に削除するため、
   * `trial` 状態からでも呼び出せる。
   */
  const logout = useCallback(async () => {
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

  /**
   * 試用を開始し `trial` 状態へ遷移する。
   *
   * 本番では Cognito Unauthenticated Identity から identityId を取得して
   * Cookie に保存する。ローカル開発（`NEXT_PUBLIC_MOCK_TRIAL=true`）では
   * ランダムなダミー ID を使用する（cognito-local が Identity Pool 未対応のため）。
   */
  const startTrial = useCallback(async () => {
    let identityId: string;
    if (process.env.NEXT_PUBLIC_MOCK_TRIAL === "true") {
      identityId = "mock-identity-" + Math.random().toString(36).slice(2, 10);
    } else {
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
