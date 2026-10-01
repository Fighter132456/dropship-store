import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { getProductsForCurrentTenant } from "@/lib/products";
import { getTenant } from "@/lib/tenant";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tenant = await getTenant();
  if (!tenant) {
    return [];
  }

  const headerStore = await headers();
  const host =
    headerStore.get("x-tenant-domain") ??
    tenant.domain ??
    headerStore.get("host") ??
    "localhost";
  const base = `https://${host.split(":")[0]}`;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/cart`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    {
      url: `${base}/privacy-policy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${base}/terms-of-service`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${base}/refund-policy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  const products = await getProductsForCurrentTenant();
  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${base}/products/${product.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
