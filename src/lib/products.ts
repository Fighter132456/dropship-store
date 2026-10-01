import { createClient } from "@/lib/supabase/server";
import { getTenantId } from "@/lib/tenant";
import type { Product } from "@/types/store";

export async function getProductsForCurrentTenant(): Promise<Product[]> {
  const tenantId = await getTenantId();
  if (!tenantId) return [];

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_products_for_tenant", {
    tenant_uuid: tenantId,
  });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Product[];
}

export async function getProductForCurrentTenant(
  productId: string,
): Promise<Product | null> {
  const tenantId = await getTenantId();
  if (!tenantId) return null;

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_product_for_tenant", {
    tenant_uuid: tenantId,
    product_uuid: productId,
  });

  if (error) {
    throw new Error(error.message);
  }

  return (data as Product | null) ?? null;
}

export async function getProductsByIds(productIds: string[]): Promise<Product[]> {
  const all = await getProductsForCurrentTenant();
  const idSet = new Set(productIds);
  return all.filter((p) => idSet.has(p.id));
}
