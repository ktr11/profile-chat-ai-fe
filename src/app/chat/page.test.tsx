import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { server } from "@/test/server";
import ChatPage from "./page";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe("ChatPage", () => {
  it("認証済みのとき初期メッセージが表示される", async () => {
    server.use(
      http.get("/api/auth/trial", () => {
        return HttpResponse.json({ chatCount: 0, chatLimit: 10 });
      })
    );

    render(<ChatPage />);

    await waitFor(() => {
      expect(
        screen.getByText(/ポートフォリオに関する質問に答えるAIアシスタント/)
      ).toBeInTheDocument();
    });
  });

  it("unauthenticated のとき /login へリダイレクトする", async () => {
    server.use(
      http.get("/api/auth/trial", () => {
        return HttpResponse.json({ error: "No trial session" }, { status: 401 });
      })
    );

    render(<ChatPage />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });

  it("メッセージ送信後に AI の返答が表示される", async () => {
    server.use(
      http.get("/api/auth/trial", () => {
        return HttpResponse.json({ chatCount: 0, chatLimit: 10 });
      }),
      http.post("/api/chat", () => {
        return HttpResponse.json({ reply: "AIの返答です", chat_count: 1, chat_limit: 10 });
      })
    );

    render(<ChatPage />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText("メッセージを入力...")).toBeInTheDocument();
    });

    await userEvent.type(screen.getByPlaceholderText("メッセージを入力..."), "質問です");
    await userEvent.click(screen.getByRole("button", { name: "送信" }));

    await waitFor(() => {
      expect(screen.getByText("AIの返答です")).toBeInTheDocument();
    });
  });

  it("/api/chat が 401 を返したとき /login へリダイレクトする", async () => {
    server.use(
      http.get("/api/auth/trial", () => {
        return HttpResponse.json({ chatCount: 0, chatLimit: 10 });
      }),
      http.post("/api/chat", () => {
        return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });
      })
    );

    render(<ChatPage />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText("メッセージを入力...")).toBeInTheDocument();
    });

    await userEvent.type(screen.getByPlaceholderText("メッセージを入力..."), "hello");
    await userEvent.click(screen.getByRole("button", { name: "送信" }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });

  it("/api/chat が 403 を返したとき上限メッセージが表示される", async () => {
    server.use(
      http.get("/api/auth/trial", () => {
        return HttpResponse.json({ chatCount: 0, chatLimit: 10 });
      }),
      http.post("/api/chat", () => {
        return HttpResponse.json({ error: "forbidden" }, { status: 403 });
      })
    );

    render(<ChatPage />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText("メッセージを入力...")).toBeInTheDocument();
    });

    await userEvent.type(screen.getByPlaceholderText("メッセージを入力..."), "hello");
    await userEvent.click(screen.getByRole("button", { name: "送信" }));

    await waitFor(() => {
      expect(screen.getByText(/お試し利用の上限に達しました/)).toBeInTheDocument();
    });
  });
});
