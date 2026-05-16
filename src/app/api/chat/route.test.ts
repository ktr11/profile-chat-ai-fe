import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { http, HttpResponse } from "msw";
import { server } from "@/test/server";
import { POST } from "./route";

const PYTHON_API_URL = "http://localhost:8000";

beforeEach(() => {
  process.env.PYTHON_API_URL = PYTHON_API_URL;
});

describe("POST /api/chat", () => {
  it("trial_uuid クッキーがない場合は 401 を返す", async () => {
    const request = new NextRequest("http://localhost/api/chat", {
      method: "POST",
      body: JSON.stringify({ message: "hello" }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.error).toBe("Unauthorized");
  });

  it("PYTHON_API_URL が未設定の場合は 500 を返す", async () => {
    delete process.env.PYTHON_API_URL;

    const request = new NextRequest("http://localhost/api/chat", {
      method: "POST",
      body: JSON.stringify({ message: "hello" }),
      headers: {
        "Content-Type": "application/json",
        Cookie: "trial_uuid=test-uuid",
      },
    });

    const response = await POST(request);

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe("PYTHON_API_URL is not set");
  });

  it("Python API が正常レスポンスを返した場合はそのまま返す", async () => {
    const request = new NextRequest("http://localhost/api/chat", {
      method: "POST",
      body: JSON.stringify({ message: "hello" }),
      headers: {
        "Content-Type": "application/json",
        Cookie: "trial_uuid=test-uuid",
      },
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.reply).toBe("こんにちは！");
    expect(data.chat_count).toBe(1);
    expect(data.chat_limit).toBe(10);
  });

  it("Python API がエラーを返した場合はそのステータスを返す", async () => {
    server.use(
      http.post(`${PYTHON_API_URL}/chat`, () => {
        return HttpResponse.json({ error: "forbidden" }, { status: 403 });
      })
    );

    const request = new NextRequest("http://localhost/api/chat", {
      method: "POST",
      body: JSON.stringify({ message: "hello" }),
      headers: {
        "Content-Type": "application/json",
        Cookie: "trial_uuid=test-uuid",
      },
    });

    const response = await POST(request);

    expect(response.status).toBe(403);
  });
});
