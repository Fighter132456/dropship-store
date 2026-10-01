/**
 * Re-run store1 product seed against remote Supabase.
 * Usage: npx tsx scripts/seed-products.ts
 * Requires SUPABASE_SERVICE_ROLE_KEY + NEXT_PUBLIC_SUPABASE_URL in env.
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { join } from "node:path";

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const sql = readFileSync(
    join(process.cwd(), "supabase/migrations/002_seed_store1.sql"),
    "utf8",
  );

  const supabase = createClient(url, key);

  // Supabase JS has no raw SQL — use REST rpc or apply via dashboard.
  // This script documents the seed; run migration via Supabase CLI or MCP.
  console.log("Seed SQL path: supabase/migrations/002_seed_store1.sql");
  console.log("Apply via: supabase db push OR Supabase MCP apply_migration");
  console.log("Tenant slug: store1 — 5 CJ test products");

  const { data: tenant } = await supabase
    .from("tenants")
    .select("id, slug, domain")
    .eq("slug", "store1")
    .maybeSingle();

  if (tenant) {
    const { count } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", tenant.id);

    console.log(`store1 tenant OK — ${count ?? 0} products in DB`);
  } else {
    console.warn("store1 tenant not found — run 002_seed_store1.sql first");
  }
}

main().catch(console.error);
