import type { MetadataRoute } from "next";
import { headers } from "next/headers";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const headerStore = await headers();
  const host = headerStore.get("x-tenant-domain") ?? headerStore.get("host") ?? "";
  const base = host ? `https://${host.split(":")[0]}` : undefined;

  return {
    rules: { userAgent: "*", allow: "/" },
    ...(base ? { sitemap: `${base}/sitemap.xml` } : {}),
  };
}
