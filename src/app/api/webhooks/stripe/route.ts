import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createPaidOrderFromSession } from "@/lib/orders";
import { triggerOrderFulfill } from "@/lib/n8n";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  const body = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true, ignored: event.type });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  if (session.payment_status !== "paid" && session.status !== "complete") {
    return NextResponse.json({ received: true, skipped: "unpaid session" });
  }

  try {
    const { order, created } = await createPaidOrderFromSession(session);

    if (created) {
      try {
        await triggerOrderFulfill(order);
      } catch (triggerErr) {
        console.error("[stripe webhook] n8n trigger failed:", triggerErr);
      }
    }

    return NextResponse.json({
      received: true,
      order_id: order.order_id,
      created,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Order persistence failed";
    console.error("[stripe webhook]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
