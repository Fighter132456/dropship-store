import { test, expect } from "@playwright/test";

test("storefront shows products shell with empty catalog", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { name: "Products" })).toBeVisible();
  await expect(page.getByText("No products available yet.")).toBeVisible();
});

test("privacy policy renders under mock tenant", async ({ page }) => {
  const response = await page.goto("/privacy-policy");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { name: "Privacy Policy" })).toBeVisible();
});
