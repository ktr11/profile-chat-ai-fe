import { test, expect } from "@playwright/test";

test.beforeEach(async ({ context }) => {
  await context.addCookies([
    {
      name: "trial_uuid",
      value: "test-uuid",
      domain: "localhost",
      path: "/",
    },
  ]);
});

test.describe("上限フロー", () => {
  test("上限到達済みの状態では入力フォームが無効化されている", async ({ page }) => {
    await page.route("**/api/auth/trial", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ chatCount: 10, chatLimit: 10 }),
      });
    });

    await page.goto("/chat");
    await expect(page.getByRole("textbox")).toBeDisabled();
    await expect(page.getByRole("button", { name: "送信" })).toBeDisabled();
  });

  test("/api/chat が 403 を返すと上限メッセージが表示される", async ({ page }) => {
    await page.goto("/chat");

    await page.route("**/api/chat", (route) => {
      route.fulfill({ status: 403 });
    });

    await page.getByRole("textbox").fill("テスト");
    await page.getByRole("button", { name: "送信" }).click();

    await expect(
      page.getByText("お試し利用の上限に達しました。続きをご利用になる場合は、正式ログインをお願いします。")
    ).toBeVisible();
  });
});
