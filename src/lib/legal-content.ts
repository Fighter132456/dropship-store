import type { Tenant } from "@/types/store";

type LegalSection = {
  title: string;
  body: string;
};

function supportEmail(tenant: Tenant): string {
  return tenant.theme_json.support_email ?? `support-${tenant.slug}@fighter132456.pl`;
}

export function privacySections(tenant: Tenant): LegalSection[] {
  const email = supportEmail(tenant);
  return [
    {
      title: "Data controller",
      body: `${tenant.name} operates this storefront at ${tenant.domain}. Contact: ${email}.`,
    },
    {
      title: "What we collect",
      body: "Order data (email, shipping address, items purchased) via Stripe Checkout. Essential cookies for cart and tenant routing. Analytics (Umami) only after cookie consent — aggregated, no ad profiling.",
    },
    {
      title: "Legal basis (EU)",
      body: "Contract performance for orders; legitimate interest for security and fraud prevention; consent for analytics cookies.",
    },
    {
      title: "Retention",
      body: "Order records are kept as required for accounting and support. You may request access or deletion via the contact email above.",
    },
    {
      title: "Processors",
      body: "Stripe (payments), Supabase (data storage), Vercel (hosting), CJ Dropshipping (fulfillment when live). Data processed in EU where possible.",
    },
  ];
}

export function termsSections(tenant: Tenant): LegalSection[] {
  const email = supportEmail(tenant);
  return [
    {
      title: "Agreement",
      body: `By using ${tenant.domain} you agree to these terms. ${tenant.name} sells products via this online store.`,
    },
    {
      title: "Orders & payment",
      body: "Prices are shown at checkout. Payment is processed by Stripe. We reserve the right to cancel orders affected by stock or pricing errors.",
    },
    {
      title: "Shipping",
      body: "Delivery times and regions are shown at checkout. Risk passes on delivery to the address you provide.",
    },
    {
      title: "Limitation",
      body: "To the extent permitted by law, liability is limited to the order value. Nothing limits rights under mandatory consumer law.",
    },
    {
      title: "Contact",
      body: `Questions: ${email}.`,
    },
  ];
}

export function refundSections(tenant: Tenant): LegalSection[] {
  const email = supportEmail(tenant);
  return [
    {
      title: "Right of withdrawal (EU)",
      body: "Consumers may withdraw within 14 days of receiving goods, unless exceptions apply (sealed goods opened, custom items).",
    },
    {
      title: "How to request a refund",
      body: `Email ${email} with your order reference and reason. We respond within 14 business days.`,
    },
    {
      title: "Returns",
      body: "Return shipping costs may apply unless the product is defective or not as described. Items must be unused where applicable.",
    },
    {
      title: "Processing",
      body: "Approved refunds are issued to the original payment method via Stripe within 5–10 business days after we receive the return.",
    },
  ];
}
