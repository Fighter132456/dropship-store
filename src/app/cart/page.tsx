import Link from "next/link";
import { CartView } from "@/components/CartView";
import { StoreShell } from "@/components/StoreShell";
import { getProductsForCurrentTenant } from "@/lib/products";
import { getTenant } from "@/lib/tenant";
import { notFound } from "next/navigation";

export default async function CartPage() {
  const tenant = await getTenant();
  if (!tenant) notFound();

  const products = await getProductsForCurrentTenant();
  const primary = tenant.theme_json.colors?.primary ?? "#2563eb";

  return (
    <StoreShell tenant={tenant}>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Cart</h1>
          <Link href="/" className="text-sm" style={{ color: primary }}>
            Continue shopping
          </Link>
        </div>
        <CartView products={products} primaryColor={primary} />
      </main>
    </StoreShell>
  );
}
