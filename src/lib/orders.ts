import type Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export type OrderItemInput = {
  productId: string;
  qty: number;
};

export type FulfillLineItem = {
  product_id: string;
  sku: string;
  title: string;
  qty: number;
  unit_price_cents: number;
  cj_product_id: string | null;
};

export type FulfillPayload = {
  order_id: string;
  tenant_id: string;
  stripe_session_id: string;
  customer_email: string | null;
  total_cents: number;
  shipping_json: Record<string, unknown>;
  items: FulfillLineItem[];
};

type ProductRow = {
  id: string;
  sku: string;
  title: string;
  price_cents: number;
  cj_product_id: string | null;
};

function parseOrderItems(metadata: Stripe.Metadata | null): OrderItemInput[] {
  const raw = metadata?.order_items;
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((entry) => {
        if (!entry || typeof entry !== "object") {
          return null;
        }
        const row = entry as { productId?: string; qty?: number };
        if (!row.productId || typeof row.qty !== "number" || row.qty < 1) {
          return null;
        }
        return { productId: row.productId, qty: row.qty };
      })
      .filter((item): item is OrderItemInput => item !== null);
  } catch {
    return [];
  }
}

function buildShippingJson(session: Stripe.Checkout.Session): Record<string, unknown> {
  const details = session.customer_details;
  const extended = session as Stripe.Checkout.Session & {
    shipping_details?: { name?: string | null; address?: Stripe.Address | null };
    collected_information?: { shipping_details?: { name?: string | null; address?: Stripe.Address | null } };
  };
  const shipping = extended.shipping_details ?? extended.collected_information?.shipping_details;

  return {
    name: details?.name ?? shipping?.name ?? null,
    email: details?.email ?? session.customer_email ?? null,
    phone: details?.phone ?? null,
    address: shipping?.address ?? details?.address ?? null,
  };
}

export async function createPaidOrderFromSession(
  session: Stripe.Checkout.Session,
): Promise<{ order: FulfillPayload; created: boolean }> {
  const tenantId = session.metadata?.tenant_id;
  if (!tenantId) {
    throw new Error("Missing tenant_id in checkout session metadata");
  }

  const sessionId = session.id;
  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from("orders")
    .select("id, tenant_id, stripe_session_id, status, total_cents, customer_email, shipping_json")
    .eq("stripe_session_id", sessionId)
    .maybeSingle();

  if (existing) {
    const { data: existingItems } = await supabase
      .from("order_items")
      .select("product_id, qty, unit_price_cents")
      .eq("order_id", existing.id);

    const existingProductIds = (existingItems ?? []).map((row) => row.product_id);
    const { data: existingProducts } =
      existingProductIds.length > 0
        ? await supabase
            .from("products")
            .select("id, sku, title, cj_product_id")
            .in("id", existingProductIds)
        : { data: [] as ProductRow[] };

    const existingProductMap = new Map(
      (existingProducts ?? []).map((p) => [p.id, p as ProductRow]),
    );

    const items: FulfillLineItem[] = (existingItems ?? []).map((row) => {
      const p = existingProductMap.get(row.product_id);
      return {
        product_id: row.product_id,
        sku: p?.sku ?? "",
        title: p?.title ?? "",
        qty: row.qty,
        unit_price_cents: row.unit_price_cents,
        cj_product_id: p?.cj_product_id ?? null,
      };
    });

    return {
      created: false,
      order: {
        order_id: existing.id,
        tenant_id: existing.tenant_id,
        stripe_session_id: existing.stripe_session_id ?? sessionId,
        customer_email: existing.customer_email,
        total_cents: existing.total_cents,
        shipping_json: (existing.shipping_json as Record<string, unknown>) ?? {},
        items,
      },
    };
  }

  const orderItems = parseOrderItems(session.metadata ?? null);
  if (orderItems.length === 0) {
    throw new Error("Missing order_items in checkout session metadata");
  }

  const productIds = orderItems.map((item) => item.productId);
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, tenant_id, sku, title, price_cents, cj_product_id")
    .in("id", productIds)
    .eq("tenant_id", tenantId)
    .eq("active", true);

  if (productsError) {
    throw new Error(productsError.message);
  }

  const productMap = new Map((products ?? []).map((p) => [p.id, p as ProductRow]));
  let totalCents = 0;
  const lineRows: FulfillLineItem[] = [];

  for (const item of orderItems) {
    const product = productMap.get(item.productId);
    if (!product) {
      throw new Error(`Product not found for tenant: ${item.productId}`);
    }
    totalCents += product.price_cents * item.qty;
    lineRows.push({
      product_id: product.id,
      sku: product.sku,
      title: product.title,
      qty: item.qty,
      unit_price_cents: product.price_cents,
      cj_product_id: product.cj_product_id,
    });
  }

  const amountTotal = session.amount_total ?? totalCents;
  const customerEmail = session.customer_details?.email ?? session.customer_email ?? null;
  const shippingJson = buildShippingJson(session);

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      tenant_id: tenantId,
      stripe_session_id: sessionId,
      status: "paid",
      total_cents: amountTotal,
      customer_email: customerEmail,
      shipping_json: shippingJson,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    throw new Error(orderError?.message ?? "Failed to insert order");
  }

  const { error: itemsError } = await supabase.from("order_items").insert(
    lineRows.map((line) => ({
      order_id: order.id,
      product_id: line.product_id,
      qty: line.qty,
      unit_price_cents: line.unit_price_cents,
    })),
  );

  if (itemsError) {
    throw new Error(itemsError.message);
  }

  return {
    created: true,
    order: {
      order_id: order.id,
      tenant_id: tenantId,
      stripe_session_id: sessionId,
      customer_email: customerEmail,
      total_cents: amountTotal,
      shipping_json: shippingJson,
      items: lineRows,
    },
  };
}
