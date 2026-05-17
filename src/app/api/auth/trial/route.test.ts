import { describe, it, expect, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { http, HttpResponse } from "msw";
import { server } from "@/test/server";
import { GET, POST } from "./route";

const PYTHON_API_URL = "http://localhost:8000";

beforeEach(() => {
  process.env.PYTHON_API_URL = PYTHON_API_URL;
});

describe("GET /api/auth/trial", () => {
  it("trial_uuid クッキーがない場合は 401 を返す", async () => {
    const request = new NextRequest("http://localhost/api/auth/trial");
    const response = await GET(request);
    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.error).toBe("No trial session");
  });

  it("trial_uuid クッキーがある場合はセッション情報を返す", async () => {
    const request = new NextRequest("http://localhost/api/auth/trial", {
      headers: { Cookie: "trial_uuid=test-uuid" },
    });
    const response = await GET(request);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.chatCount).toBe(1);
    expect(data.chatLimit).toBe(10);
  });

  it("Python API がエラーを返した場合はそのステータスを返す", async () => {
    server.use(
      http.post(`${PYTHON_API_URL}/session`, () => {
        return HttpResponse.json({ error: "server error" }, { status: 500 });
      })
    );
    const request = new NextRequest("http://localhost/api/auth/trial", {
      headers: { Cookie: "trial_uuid=test-uuid" },
    });
    const response = await GET(request);
    expect(response.status).toBe(500);
  });

  it("PYTHON_API_URL が未設定の場合は 500 を返す", async () => {
    delete process.env.PYTHON_API_URL;
    const request = new NextRequest("http://localhost/api/auth/trial", {
      headers: { Cookie: "trial_uuid=test-uuid" },
    });
    const response = await GET(request);
    expect(response.status).toBe(500);
  });
});

describe("POST /api/auth/trial", () => {
  it("新規セッションを作成してクッキーをセットする", async () => {
    server.use(
      http.post(`${PYTHON_API_URL}/session`, () => {
        return HttpResponse.json(
          { chat_count: 0, chat_limit: 10 },
          {
            status: 200,
            headers: { "set-cookie": "trial_uuid=new-uuid; HttpOnly; Path=/" },
          }
        );
      })
    );
    const response = await POST();
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.chatCount).toBe(0);
    expect(data.chatLimit).toBe(10);
    expect(response.headers.get("set-cookie")).toContain("trial_uuid=new-uuid");
  });

  it("set-cookie ヘッダーがない場合もセッション情報を返す", async () => {
    server.use(
      http.post(`${PYTHON_API_URL}/session`, () => {
        return HttpResponse.json({ chat_count: 0, chat_limit: 10 }, { status: 200 });
      })
    );
    const response = await POST();
    expect(response.status).toBe(200);
    expect(response.headers.get("set-cookie")).toBeNull();
  });

  it("Python API がエラーを返した場合はそのステータスを返す", async () => {
    server.use(
      http.post(`${PYTHON_API_URL}/session`, () => {
        return HttpResponse.json({ error: "server error" }, { status: 500 });
      })
    );
    const response = await POST();
    expect(response.status).toBe(500);
  });

  it("PYTHON_API_URL が未設定の場合は 500 を返す", async () => {
    delete process.env.PYTHON_API_URL;
    const response = await POST();
    expect(response.status).toBe(500);
  });
});
