import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./e2e",
  timeout: 30000,
  use: { baseURL: "http://127.0.0.1:4173", ...devices["Desktop Chrome"] },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
  webServer: { command: "npm run demo:dev", url: "http://127.0.0.1:4173", reuseExistingServer: !process.env.CI, timeout: 60000 }
});
