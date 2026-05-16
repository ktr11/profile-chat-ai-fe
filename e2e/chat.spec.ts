import { test, expect } from "@playwright/test";

test.use({
  storageState: undefined,
});

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

test.describe("チャットフロー", () => {
  test("メッセージを送信すると自分の吹き出しが追加される", async ({ page }) => {
    await page.goto("/chat");
    await page.getByRole("textbox").fill("こんにちは");
    await page.getByRole("button", { name: "送信" }).click();
    await expect(page.getByText("こんにちは", { exact: true })).toBeVisible();
  });

  test("AI のレスポンスが吹き出しとして表示される", async ({ page }) => {
    await page.goto("/chat");
    await page.getByRole("textbox").fill("テストメッセージ");
    await page.getByRole("button", { name: "送信" }).click();
    await expect(page.getByText("こんにちは！")).toBeVisible();
  });

  test("送信中は送信ボタンが無効化される", async ({ page }) => {
    await page.goto("/chat");

    let resolveChat: () => void;
    await page.route("**/api/chat", async (route) => {
      await new Promise<void>((resolve) => {
        resolveChat = resolve;
      });
      await route.continue();
    });

    await page.getByRole("textbox").fill("テスト");
    await page.getByRole("button", { name: "送信" }).click();

    await expect(page.getByRole("button", { name: "送信" })).toBeDisabled();
    resolveChat!();
  });
});
