import type { Metadata } from "next";
import { StoreShell } from "@/components/StoreShell";
import { isPolishLegal } from "@/lib/legal-content";
import { noIndexMetadata } from "@/lib/seo-meta";
import { getTenant } from "@/lib/tenant";
import { notFound } from "next/navigation";
import { PurchaseSuccess } from "./PurchaseSuccess";

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenant();
  const title =
    tenant && isPolishLegal(tenant) ? "Zamówienie potwierdzone" : "Order confirmed";
  return noIndexMetadata(title);
}

type SuccessPageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const tenant = await getTenant();
  if (!tenant) notFound();

  const params = await searchParams;
  const primary = tenant.theme_json.colors?.primary ?? "#2563eb";

  return (
    <StoreShell tenant={tenant}>
      <PurchaseSuccess sessionId={params.session_id} primaryColor={primary} />
    </StoreShell>
  );
}
