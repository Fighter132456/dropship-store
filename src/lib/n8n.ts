import type { FulfillPayload } from "@/lib/orders";

export async function triggerOrderFulfill(payload: FulfillPayload): Promise<void> {
  const url = process.env.N8N_ORDER_FULFILL_WEBHOOK_URL;
  if (!url) {
    console.warn("[n8n] N8N_ORDER_FULFILL_WEBHOOK_URL not set — skipping fulfill trigger");
    return;
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const secret = process.env.N8N_ORDER_FULFILL_SECRET;
  if (secret) {
    headers["X-Webhook-Secret"] = secret;
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`n8n fulfill webhook failed (${response.status}): ${body.slice(0, 200)}`);
  }
}
