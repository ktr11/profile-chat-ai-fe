import { describe, it, expect } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "@/test/server";
import { useAuth } from "./useAuth";

describe("useAuth", () => {
  it("マウント時に既存セッションがあれば trial 状態になる", async () => {
    server.use(
      http.get("/api/auth/trial", () => {
        return HttpResponse.json({ chatCount: 3, chatLimit: 10 });
      })
    );

    const { result } = renderHook(() => useAuth());

    expect(result.current.authState.type).toBe("loading");

    await waitFor(() => {
      expect(result.current.authState.type).toBe("trial");
    });

    if (result.current.authState.type === "trial") {
      expect(result.current.authState.chatCount).toBe(3);
      expect(result.current.authState.chatLimit).toBe(10);
    }
  });

  it("マウント時にセッションがなければ unauthenticated 状態になる", async () => {
    server.use(
      http.get("/api/auth/trial", () => {
        return HttpResponse.json({ error: "No trial session" }, { status: 401 });
      })
    );

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.authState.type).toBe("unauthenticated");
    });
  });

  it("startTrial() 成功で trial 状態になる", async () => {
    server.use(
      http.get("/api/auth/trial", () => {
        return HttpResponse.json({ error: "No trial session" }, { status: 401 });
      }),
      http.post("/api/auth/trial", () => {
        return HttpResponse.json({ chatCount: 0, chatLimit: 10 });
      })
    );

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.authState.type).toBe("unauthenticated");
    });

    await result.current.startTrial();

    await waitFor(() => {
      expect(result.current.authState.type).toBe("trial");
    });

    if (result.current.authState.type === "trial") {
      expect(result.current.authState.chatCount).toBe(0);
      expect(result.current.authState.chatLimit).toBe(10);
    }
  });

  it("logout() 成功で unauthenticated 状態になる", async () => {
    server.use(
      http.get("/api/auth/trial", () => {
        return HttpResponse.json({ chatCount: 2, chatLimit: 10 });
      }),
      http.post("/api/auth/signout", () => {
        return HttpResponse.json({ ok: true });
      })
    );

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.authState.type).toBe("trial");
    });

    await result.current.logout();

    await waitFor(() => {
      expect(result.current.authState.type).toBe("unauthenticated");
    });
  });
});
