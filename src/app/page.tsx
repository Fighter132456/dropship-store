import { ProductCard } from "@/components/ProductCard";
import { StoreShell } from "@/components/StoreShell";
import { TenantNotFound } from "@/components/TenantNotFound";
import { getProductsForCurrentTenant } from "@/lib/products";
import { getTenant } from "@/lib/tenant";

export default async function HomePage() {
  const tenant = await getTenant();

  if (!tenant) {
    return <TenantNotFound />;
  }

  const products = await getProductsForCurrentTenant();
  const primary = tenant.theme_json.colors?.primary ?? "#2563eb";

  return (
    <StoreShell tenant={tenant}>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">Products</h1>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} primaryColor={primary} />
            ))}
          </div>
        ) : (
          <p className="text-slate-600">No products available yet.</p>
        )}
      </main>
    </StoreShell>
  );
}
