import { cookies, headers } from "next/headers";
import type { Tenant, TenantTheme } from "@/types/store";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const DEFAULT_THEME: TenantTheme = {
  colors: {
    primary: "#2563eb",
    secondary: "#1e40af",
    background: "#f8fafc",
    text: "#0f172a",
  },
  copy: {
    tagline: "Quality products, fast delivery",
    footer: "All rights reserved.",
  },
};

export async function getTenantId(): Promise<string | null> {
  const headerStore = await headers();
  const fromHeader = headerStore.get("x-tenant-id");
  if (fromHeader) return fromHeader;

  const cookieStore = await cookies();
  return cookieStore.get("tenant-id")?.value ?? null;
}

export async function getTenantSlug(): Promise<string | null> {
  const headerStore = await headers();
  const fromHeader = headerStore.get("x-tenant-slug");
  if (fromHeader) return fromHeader;

  const cookieStore = await cookies();
  return cookieStore.get("tenant-slug")?.value ?? null;
}

export async function getTenant(): Promise<Tenant | null> {
  const tenantId = await getTenantId();
  if (!tenantId) return null;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("tenants")
    .select("id, slug, domain, name, theme_json, status")
    .eq("id", tenantId)
    .eq("status", "active")
    .maybeSingle();

  if (error || !data) return null;

  return {
    ...data,
    theme_json: { ...DEFAULT_THEME, ...(data.theme_json as TenantTheme) },
  };
}

export async function createTenantScopedClient() {
  const tenantId = await getTenantId();
  if (!tenantId) {
    throw new Error("Tenant context missing");
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("set_tenant", {
    tenant_uuid: tenantId,
  });

  if (error) {
    throw new Error(`Failed to set tenant context: ${error.message}`);
  }

  return supabase;
}

export function resolveTenantLookup(
  host: string,
  tenantParam: string | null,
): { field: "slug" | "domain"; value: string } | null {
  const hostname = host.split(":")[0]?.toLowerCase() ?? "";

  if (tenantParam) {
    return { field: "slug", value: tenantParam.toLowerCase() };
  }

  if (hostname.endsWith(".localhost")) {
    const slug = hostname.replace(".localhost", "");
    if (slug) return { field: "slug", value: slug };
  }

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return { field: "slug", value: "store1" };
  }

  return { field: "domain", value: hostname };
}
