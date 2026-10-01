/**
 * Verify store1 seed against remote Supabase.
 * Usage: npx tsx scripts/seed-products.ts
 * Requires SUPABASE_SERVICE_ROLE_KEY + NEXT_PUBLIC_SUPABASE_URL in env.
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

async function main() {
  loadEnvLocal();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const supabase = createClient(url, key);

  console.log("Seed SQL: supabase/migrations/002_seed_store1.sql, 004_seed_store2.sql");
  console.log("Apply via Supabase MCP apply_migration or supabase db push");

  for (const slug of ["store1", "store2"] as const) {
    const { data: tenant } = await supabase
      .from("tenants")
      .select("id, slug, domain")
      .eq("slug", slug)
      .maybeSingle();

    if (tenant) {
      const { count } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("tenant_id", tenant.id);

      console.log(`${slug} tenant OK — ${count ?? 0} products (${tenant.domain})`);
    } else {
      console.warn(`${slug} tenant not found — run seed migration first`);
    }
  }
}

main().catch(console.error);
