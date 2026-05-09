"use client";

import { useState, useEffect, useCallback } from "react";

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
  const [authState, setAuthState] = useState<AuthState>({ type: "loading" });

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) =>
        setAuthState({ type: "authenticated", user: { username: data.username, email: data.email } })
      )
      .catch(() => {
        fetch("/api/auth/trial/check")
          .then((res) => res.ok ? res.json() : Promise.reject())
          .then((data) => setAuthState({ type: "trial", user: { identityId: data.identityId } }))
          .catch(() => setAuthState({ type: "unauthenticated" }));
      });
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
    const res = await authFetch("/api/auth/trial", { method: "POST" });
    const data = await res.json();
    setAuthState({ type: "trial", user: { identityId: data.identityId } });
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
