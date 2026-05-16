import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: [
    {
      command: "MOCK_API_URL=http://localhost:18000 pnpm tsx e2e/mock-server.ts",
      url: "http://localhost:18000",
      reuseExistingServer: false,
      timeout: 10000,
    },
    {
      command: "PYTHON_API_URL=http://localhost:18000 pnpm dev",
      url: "http://localhost:3000",
      reuseExistingServer: !process.env.CI,
      timeout: 30000,
    },
  ],
});
