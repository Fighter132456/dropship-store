/**
 * S37 smoke: simulate checkout.session.completed → orders + optional n8n trigger.
 * Requires .env.local with Supabase service role + Stripe keys.
 *
 * Usage: npx tsx scripts/smoke-stripe-webhook.ts
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import Stripe from "stripe";
import { createPaidOrderFromSession } from "../src/lib/orders";
import { triggerOrderFulfill } from "../src/lib/n8n";

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

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    throw new Error("STRIPE_SECRET_KEY missing");
  }

  const supabase = await import("../src/lib/supabase/admin").then((m) => m.createAdminClient());
  const { data: tenant } = await supabase
    .from("tenants")
    .select("id")
    .eq("slug", "store1")
    .single();

  if (!tenant?.id) {
    throw new Error("store1 tenant not found");
  }

  const { data: product } = await supabase
    .from("products")
    .select("id, title, price_cents")
    .eq("tenant_id", tenant.id)
    .eq("sku", "CJ-STORE1-001")
    .single();

  if (!product?.id) {
    throw new Error("Seed product CJ-STORE1-001 not found");
  }

  const sessionId = `cs_test_smoke_${Date.now()}`;

  const session = {
    id: sessionId,
    object: "checkout.session",
    payment_status: "paid",
    status: "complete",
    amount_total: product.price_cents,
    currency: "pln",
    customer_email: "smoke-test@fighter132456.pl",
    customer_details: {
      email: "smoke-test@fighter132456.pl",
      name: "Smoke Test",
    },
    metadata: {
      tenant_id: tenant.id,
      order_items: JSON.stringify([{ productId: product.id, qty: 1 }]),
    },
  } as unknown as Stripe.Checkout.Session;

  const { order, created } = await createPaidOrderFromSession(session);
  console.log("[smoke] order", { order_id: order.order_id, created });

  if (process.env.N8N_ORDER_FULFILL_WEBHOOK_URL) {
    await triggerOrderFulfill(order);
    console.log("[smoke] n8n trigger OK");
  } else {
    console.log("[smoke] n8n trigger skipped (N8N_ORDER_FULFILL_WEBHOOK_URL unset)");
  }

  const { data: row } = await supabase
    .from("orders")
    .select("id, status, stripe_session_id, total_cents")
    .eq("id", order.order_id)
    .single();

  console.log("[smoke] supabase verify", row);
}

main().catch((err) => {
  console.error("[smoke] FAIL", err);
  process.exit(1);
});
