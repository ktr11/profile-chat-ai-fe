"use client";

import { useState, useEffect, useCallback } from "react";

export type TrialUser = {
  identityId: string;
};

export type AuthState =
  | { type: "loading" }
  | { type: "unauthenticated" }
  | { type: "trial"; user: TrialUser };

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({ type: "loading" });

  useEffect(() => {
    fetch("/api/auth/trial")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setAuthState({ type: "trial", user: { identityId: data.identityId } }))
      .catch(() => setAuthState({ type: "unauthenticated" }));
  }, []);

  const startTrial = useCallback(async () => {
    const res = await fetch("/api/auth/trial", { method: "POST" });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error ?? "エラーが発生しました");
    }
    const data = await res.json();
    setAuthState({ type: "trial", user: { identityId: data.identityId } });
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/signout", { method: "POST" }).catch(() => {});
    setAuthState({ type: "unauthenticated" });
  }, []);

  return { authState, startTrial, logout };
}
