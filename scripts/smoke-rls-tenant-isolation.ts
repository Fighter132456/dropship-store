/**
 * S38 RLS regression: store1 vs store2 tenant isolation.
 * Tests RPC path used by storefront (get_products_for_tenant / get_product_for_tenant).
 * Note: set_tenant + separate SELECT does not persist across PostgREST requests.
 *
 * Usage: npx tsx scripts/smoke-rls-tenant-isolation.ts
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  const raw = readFileSync(path, "utf8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing ${name}`);
    process.exit(1);
  }
  return value;
}

async function main() {
  loadEnvLocal();

  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  const serviceKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

  const admin = createClient(url, serviceKey);
  const anon = createClient(url, anonKey);

  const { data: tenants, error: tenantsErr } = await admin
    .from("tenants")
    .select("id, slug")
    .in("slug", ["store1", "store2"]);

  if (tenantsErr || !tenants || tenants.length !== 2) {
    throw new Error(
      `Expected store1 + store2 tenants, got: ${tenantsErr?.message ?? tenants?.length}`,
    );
  }

  const store1 = tenants.find((t) => t.slug === "store1")!;
  const store2 = tenants.find((t) => t.slug === "store2")!;

  const { data: allProducts } = await admin
    .from("products")
    .select("id, tenant_id, sku")
    .in("tenant_id", [store1.id, store2.id]);

  const store1Products =
    allProducts?.filter((p) => p.tenant_id === store1.id) ?? [];
  const store2Products =
    allProducts?.filter((p) => p.tenant_id === store2.id) ?? [];

  console.log("[rls-smoke] seed verify", {
    store1_products: store1Products.length,
    store2_products: store2Products.length,
  });

  if (store1Products.length < 1 || store2Products.length < 1) {
    throw new Error("Each tenant needs at least 1 product — run seed migrations");
  }

  const store1Sample = store1Products[0]!;
  const store2Sample = store2Products[0]!;

  // --- store1 RPC: own products only ---
  const { data: store1Visible, error: s1RpcErr } = await anon.rpc(
    "get_products_for_tenant",
    { tenant_uuid: store1.id },
  );

  if (s1RpcErr) throw new Error(`store1 RPC list: ${s1RpcErr.message}`);

  const s1Skus = (store1Visible ?? []).map((p: { sku: string }) => p.sku);
  if (s1Skus.some((sku) => sku.startsWith("CJ-STORE2-"))) {
    throw new Error(`RLS FAIL: store1 RPC sees store2 SKUs: ${s1Skus.join(", ")}`);
  }
  if (!s1Skus.some((sku) => sku.startsWith("CJ-STORE1-"))) {
    throw new Error("RLS FAIL: store1 RPC sees no store1 products");
  }

  console.log("[rls-smoke] store1 RPC isolation OK", { visible: s1Skus.length });

  // --- store2 RPC: own products only ---
  const { data: store2Visible, error: s2RpcErr } = await anon.rpc(
    "get_products_for_tenant",
    { tenant_uuid: store2.id },
  );

  if (s2RpcErr) throw new Error(`store2 RPC list: ${s2RpcErr.message}`);

  const s2Skus = (store2Visible ?? []).map((p: { sku: string }) => p.sku);
  if (s2Skus.some((sku) => sku.startsWith("CJ-STORE1-"))) {
    throw new Error(`RLS FAIL: store2 RPC sees store1 SKUs: ${s2Skus.join(", ")}`);
  }
  if (!s2Skus.some((sku) => sku.startsWith("CJ-STORE2-"))) {
    throw new Error("RLS FAIL: store2 RPC sees no store2 products");
  }

  console.log("[rls-smoke] store2 RPC isolation OK", { visible: s2Skus.length });

  // --- cross-tenant get_product_for_tenant returns null ---
  const { data: cross1, error: cross1Err } = await anon.rpc(
    "get_product_for_tenant",
    { tenant_uuid: store1.id, product_uuid: store2Sample.id },
  );
  if (cross1Err) throw new Error(`cross-tenant RPC: ${cross1Err.message}`);
  if (cross1?.id) {
    throw new Error("RLS FAIL: store1 context returned store2 product");
  }

  const { data: cross2, error: cross2Err } = await anon.rpc(
    "get_product_for_tenant",
    { tenant_uuid: store2.id, product_uuid: store1Sample.id },
  );
  if (cross2Err) throw new Error(`cross-tenant RPC: ${cross2Err.message}`);
  if (cross2?.id) {
    throw new Error("RLS FAIL: store2 context returned store1 product");
  }

  console.log("[rls-smoke] cross-tenant RPC block OK");

  // --- direct SELECT without tenant context: empty (RLS default deny) ---
  const { data: nakedSelect } = await anon.from("products").select("id");
  if (nakedSelect && nakedSelect.length > 0) {
    throw new Error(
      `RLS FAIL: anon SELECT without tenant returned ${nakedSelect.length} rows`,
    );
  }

  console.log("[rls-smoke] naked anon SELECT blocked OK");
  console.log("[rls-smoke] PASS — tenant isolation verified");
}

main().catch((err) => {
  console.error("[rls-smoke] FAIL", err);
  process.exit(1);
});
