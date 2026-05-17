"use client";

import { useState, useEffect, useCallback } from "react";

export type AuthState =
  | { type: "loading" }
  | { type: "unauthenticated" }
  | { type: "trial"; chatCount: number; chatLimit: number };

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({ type: "loading" });

  useEffect(() => {
    fetch("/api/auth/trial")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) =>
        setAuthState({ type: "trial", chatCount: data.chatCount, chatLimit: data.chatLimit })
      )
      .catch(() => setAuthState({ type: "unauthenticated" }));
  }, []);

  const startTrial = useCallback(async () => {
    const res = await fetch("/api/auth/trial", { method: "POST" });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error ?? "エラーが発生しました");
    }
    const data = await res.json();
    setAuthState({ type: "trial", chatCount: data.chatCount, chatLimit: data.chatLimit });
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/signout", { method: "POST" }).catch(() => {});
    setAuthState({ type: "unauthenticated" });
  }, []);

  const updateCount = useCallback((chatCount: number, chatLimit: number) => {
    setAuthState((prev) => {
      if (prev.type !== "trial") return prev;
      return { ...prev, chatCount, chatLimit };
    });
  }, []);

  return { authState, startTrial, logout, updateCount };
}
