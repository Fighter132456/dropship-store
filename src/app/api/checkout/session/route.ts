import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "session_id required" }, { status: 400 });
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Session not paid" }, { status: 400 });
    }

    return NextResponse.json({
      session_id: session.id,
      total_cents: session.amount_total ?? 0,
      currency: session.currency ?? "pln",
      customer_email: session.customer_details?.email ?? session.customer_email ?? null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load session";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
