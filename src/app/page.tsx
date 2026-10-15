import type { Metadata } from "next";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { ProductCard } from "@/components/ProductCard";
import { StoreShell } from "@/components/StoreShell";
import { TenantNotFound } from "@/components/TenantNotFound";
import { getFaqItems } from "@/lib/faq-content";
import { getProductsForCurrentTenant } from "@/lib/products";
import { buildFaqPageSchema } from "@/lib/schema";
import { getSiteOrigin } from "@/lib/site-url";
import { getTenant } from "@/lib/tenant";

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenant();
  if (!tenant) {
    return { title: "Store not found" };
  }

  const tagline =
    tenant.theme_json.copy?.tagline ??
    "Sklep internetowy — dostawa, zwroty i kontakt w sekcji FAQ.";
  const description = `${tagline} Odpowiedzi na pytania o wysyłkę, zwroty i obsługę klienta.`;

  return {
    title: tenant.name,
    description,
    alternates: { canonical: "/" },
    openGraph: {
      title: tenant.name,
      description,
      type: "website",
      locale: "pl_PL",
    },
  };
}

export default async function HomePage() {
  const tenant = await getTenant();

  if (!tenant) {
    return <TenantNotFound />;
  }

  const siteOrigin = await getSiteOrigin(tenant);
  const faqItems = getFaqItems(tenant, siteOrigin);
  const faqSchema = buildFaqPageSchema(faqItems);

  const products = await getProductsForCurrentTenant();
  const primary = tenant.theme_json.colors?.primary ?? "#2563eb";

  return (
    <StoreShell tenant={tenant}>
      <JsonLd data={faqSchema} />
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
        <FaqSection tenant={tenant} />
      </main>
    </StoreShell>
  );
}
