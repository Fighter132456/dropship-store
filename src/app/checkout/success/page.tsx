import { Header } from "@/components/Header";
import { getTenant } from "@/lib/tenant";
import { PurchaseSuccess } from "./PurchaseSuccess";

type SuccessPageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const tenant = await getTenant();
  const params = await searchParams;
  const primary = tenant?.theme_json.colors?.primary ?? "#2563eb";

  return (
    <>
      {tenant ? <Header tenant={tenant} /> : null}
      <PurchaseSuccess sessionId={params.session_id} primaryColor={primary} />
    </>
  );
}
