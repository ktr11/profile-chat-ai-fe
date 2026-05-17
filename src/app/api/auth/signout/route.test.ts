import { describe, it, expect } from "vitest";
import { POST } from "./route";

describe("POST /api/auth/signout", () => {
  it("{ ok: true } を返す", async () => {
    const response = await POST();
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.ok).toBe(true);
  });

  it("trial_uuid クッキーを削除する", async () => {
    const response = await POST();
    const setCookie = response.headers.get("set-cookie");
    expect(setCookie).toContain("trial_uuid=");
    expect(setCookie).toContain("Max-Age=0");
  });
});
