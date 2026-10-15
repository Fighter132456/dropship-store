import { headers } from "next/headers";
import type { Tenant } from "@/types/store";

/** Canonical HTTPS origin for the current tenant request. */
export async function getSiteOrigin(tenant: Tenant): Promise<string> {
  const headerStore = await headers();
  const host =
    headerStore.get("x-tenant-domain") ??
    tenant.domain ??
    headerStore.get("host") ??
    "localhost";
  return `https://${host.split(":")[0]}`;
}
