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

test.describe("ログアウトフロー", () => {
  test("「ログアウト」ボタンを押すと /login に遷移する", async ({ page }) => {
    await page.goto("/chat");
    await page.getByRole("button", { name: "ログアウト" }).click();
    await expect(page).toHaveURL("/login");
  });
});
