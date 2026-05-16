import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { server } from "@/test/server";
import LoginPage from "./page";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe("LoginPage", () => {
  it("「試してみる」ボタンが表示される", () => {
    render(<LoginPage />);
    expect(screen.getByRole("button", { name: "試してみる" })).toBeInTheDocument();
  });

  it("ボタンをクリックすると /chat へ遷移する", async () => {
    server.use(
      http.get("/api/auth/trial", () => {
        return HttpResponse.json({ error: "No trial session" }, { status: 401 });
      }),
      http.post("/api/auth/trial", () => {
        return HttpResponse.json({ chatCount: 0, chatLimit: 10 });
      })
    );

    render(<LoginPage />);
    await userEvent.click(screen.getByRole("button", { name: "試してみる" }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/chat");
    });
  });

  it("startTrial が失敗したときエラーメッセージが表示される", async () => {
    server.use(
      http.get("/api/auth/trial", () => {
        return HttpResponse.json({ error: "No trial session" }, { status: 401 });
      }),
      http.post("/api/auth/trial", () => {
        return HttpResponse.json({ error: "サーバーエラー" }, { status: 500 });
      })
    );

    render(<LoginPage />);
    await userEvent.click(screen.getByRole("button", { name: "試してみる" }));

    await waitFor(() => {
      expect(screen.getByText("サーバーエラー")).toBeInTheDocument();
    });
  });
});
