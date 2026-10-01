import { NextResponse } from "next/server";
import { getProductsByIds } from "@/lib/products";
import { getStripe } from "@/lib/stripe";
import { getTenantId } from "@/lib/tenant";
import type { CheckoutItem } from "@/types/store";

type CheckoutBody = {
  items?: CheckoutItem[];
};

export async function POST(request: Request) {
  try {
    const tenantId = await getTenantId();
    if (!tenantId) {
      return NextResponse.json({ error: "Tenant context missing" }, { status: 400 });
    }

    const body = (await request.json()) as CheckoutBody;
    const items = body.items ?? [];

    if (items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const productIds = items.map((item) => item.productId);
    const products = await getProductsByIds(productIds);
    const productMap = new Map(products.map((p) => [p.id, p]));

    const lineItems: Array<{
      price_data: {
        currency: string;
        product_data: { name: string };
        unit_amount: number;
      };
      quantity: number;
    }> = [];

    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product || item.qty < 1) {
        return NextResponse.json({ error: "Invalid cart item" }, { status: 400 });
      }

      lineItems.push({
        price_data: {
          currency: "pln",
          product_data: { name: product.title },
          unit_amount: product.price_cents,
        },
        quantity: item.qty,
      });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/cart`,
      metadata: {
        tenant_id: tenantId,
      },
    });

    if (!session.url) {
      return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
