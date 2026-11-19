import { test, expect } from "@playwright/test";
test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});
test("restores a draft after reload", async ({ page }) => {
  await page.getByLabel("Your name").fill("Alex");
  await page.getByLabel("Message").fill("Connection interrupted");
  await expect(page.getByText("Draft saved on this device")).toBeVisible();
  await page.reload();
  await expect(page.getByLabel("Your name")).toHaveValue("Alex");
  await expect(page.getByLabel("Message")).toHaveValue("Connection interrupted");
});
test("discard removes the persisted draft", async ({ page }) => {
  await page.getByLabel("Message").fill("Temporary text");
  await page.getByRole("button", { name: "Discard draft" }).click();
  await expect(page.getByLabel("Message")).toHaveValue("");
  await page.reload();
  await expect(page.getByLabel("Message")).toHaveValue("");
});
test("preview does not claim server submission", async ({ page }) => {
  await page.getByRole("button", { name: "Preview submission" }).click();
  await expect(page.getByText("Demo only — no data was sent to a server.")).toBeVisible();
});
