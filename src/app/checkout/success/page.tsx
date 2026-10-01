import { StoreShell } from "@/components/StoreShell";
import { getTenant } from "@/lib/tenant";
import { notFound } from "next/navigation";
import { PurchaseSuccess } from "./PurchaseSuccess";

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
