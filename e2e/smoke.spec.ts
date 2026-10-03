import { test, expect } from "@playwright/test";

test("storefront responds with products or tenant-not-found shell", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);

  const heading = page.getByRole("heading", { name: /Products|Store not found/i });
  await expect(heading).toBeVisible();
});

test("legal route without tenant returns 404", async ({ page }) => {
  const response = await page.goto("/privacy-policy");
  expect(response?.status()).toBe(404);
});
