"use client";

import { useState, useEffect, useCallback } from "react";

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
  email: string;
};

export type TrialUser = {
  identityId: string;
};

export type AuthState =
  | { type: "loading" }
  | { type: "unauthenticated" }
  | { type: "trial"; user: TrialUser }
  | { type: "authenticated"; user: AuthUser };

async function authFetch(path: string, options?: RequestInit): Promise<Response> {
  const res = await fetch(path, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "エラーが発生しました");
  }
  return res;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const trialId = readTrialCookie();
    if (trialId) return { type: "trial", user: { identityId: trialId } };
    return { type: "loading" };
  });

  useEffect(() => {
    if (authState.type !== "loading") return;
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) =>
        setAuthState({ type: "authenticated", user: { username: data.username, email: data.email } })
      )
      .catch(() => setAuthState({ type: "unauthenticated" }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await authFetch("/api/auth/signin", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const res = await fetch("/api/auth/me");
    const data = await res.json();
    setAuthState({ type: "authenticated", user: { username: data.username, email: data.email } });
  }, []);

  const logout = useCallback(async () => {
    document.cookie = `${TRIAL_IDENTITY_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    await fetch("/api/auth/signout", { method: "POST" }).catch(() => {});
    setAuthState({ type: "unauthenticated" });
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    await authFetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }, []);

  const confirmRegistration = useCallback(async (email: string, code: string) => {
    await authFetch("/api/auth/confirm", {
      method: "POST",
      body: JSON.stringify({ email, code }),
    });
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    await authFetch("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }, []);

  const confirmForgotPassword = useCallback(
    async (email: string, code: string, newPassword: string) => {
      await authFetch("/api/auth/confirm-forgot-password", {
        method: "POST",
        body: JSON.stringify({ email, code, newPassword }),
      });
    },
    []
  );

  const startTrial = useCallback(async () => {
    let identityId: string;
    if (process.env.NEXT_PUBLIC_MOCK_TRIAL === "true") {
      identityId = "mock-identity-" + Math.random().toString(36).slice(2, 10);
    } else {
      throw new Error("Trial は現在準備中です");
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
