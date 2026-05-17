import { test, expect } from "@playwright/test";

test.describe("indexページ", () => {
  test("全セクションが表示される", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("navigation")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Build with Code & AI." })).toBeVisible();
    await expect(page.getByRole("heading", { name: "About Me" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Skills" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Projects" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Contact" })).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
  });

  test("Hero の「AIと話す」ボタンを押すと /login に遷移する", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "AIと話す" }).click();
    await expect(page).toHaveURL("/login");
  });

  test("Contact の「AIチャットで話しかける」ボタンを押すと /login に遷移する", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "AIチャットで話しかける" }).click();
    await expect(page).toHaveURL("/login");
  });
});

test.describe("indexページ（モバイル）", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("ハンバーガーボタンを押すとメニューが開く", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Toggle menu" }).click();
    await expect(page.getByRole("link", { name: "About" })).toBeVisible();
  });

  test("メニューが開いている状態でハンバーガーボタンを押すと閉じる", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Toggle menu" }).click();
    await expect(page.getByRole("link", { name: "About" })).toBeVisible();
    await page.getByRole("button", { name: "Toggle menu" }).click();
    await expect(page.getByRole("link", { name: "About" })).not.toBeVisible();
  });
});
