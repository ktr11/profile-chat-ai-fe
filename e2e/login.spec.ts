import { test, expect } from "@playwright/test";

test.describe("ログインフロー", () => {
  test("未認証で /chat に直接アクセスすると /login にリダイレクトされる", async ({ page }) => {
    await page.goto("/chat");
    await expect(page).toHaveURL("/login");
  });

  test("「試してみる」ボタンを押すと /chat に遷移する", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: "試してみる" }).click();
    await expect(page).toHaveURL("/chat");
  });
});
