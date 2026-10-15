import { test, expect } from "@playwright/test";

test("storefront shows products shell with empty catalog", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { name: "Products" })).toBeVisible();
  await expect(page.getByText("No products available yet.")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Najczęściej zadawane pytania" }),
  ).toBeVisible();

  const ldScripts = page.locator('script[type="application/ld+json"]');
  const count = await ldScripts.count();
  let faqPage: { "@type"?: string; mainEntity?: unknown[] } | null = null;
  for (let i = 0; i < count; i++) {
    const raw = (await ldScripts.nth(i).textContent()) ?? "[]";
    const parsed = JSON.parse(raw) as
      | { "@type"?: string; mainEntity?: unknown[] }
      | Array<{ "@type"?: string; mainEntity?: unknown[] }>;
    const nodes = Array.isArray(parsed) ? parsed : [parsed];
    faqPage = nodes.find((node) => node["@type"] === "FAQPage") ?? faqPage;
  }
  expect(faqPage?.["@type"]).toBe("FAQPage");
  expect(faqPage?.mainEntity?.length).toBeGreaterThanOrEqual(5);
});

test("privacy policy renders under mock tenant", async ({ page }) => {
  const response = await page.goto("/privacy-policy");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { name: "Privacy Policy" })).toBeVisible();
});
