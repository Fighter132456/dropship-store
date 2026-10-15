import type { Metadata } from "next";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { PawNestHome } from "@/components/PawNestHome";
import { ProductCard } from "@/components/ProductCard";
import { StoreShell } from "@/components/StoreShell";
import { TenantNotFound } from "@/components/TenantNotFound";
import { getFaqItems } from "@/lib/faq-content";
import { getProductsForCurrentTenant } from "@/lib/products";
import { homePageH1, homePageTitle, tenantOgImageUrl } from "@/lib/seo-meta";
import { buildFaqPageSchema, buildItemListSchema } from "@/lib/schema";
import { getSiteOrigin } from "@/lib/site-url";
import { getTenant } from "@/lib/tenant";

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenant();
  if (!tenant) {
    return { title: "Store not found" };
  }

  const description =
    tenant.theme_json.copy?.meta_home_description ??
    (() => {
      const tagline =
        tenant.theme_json.copy?.tagline ??
        "Sklep internetowy — dostawa, zwroty i kontakt w sekcji FAQ.";
      return `${tagline} Odpowiedzi na pytania o wysyłkę, zwroty i obsługę klienta.`;
    })();

  const siteOrigin = await getSiteOrigin(tenant);
  const title = homePageTitle(tenant);
  const ogImage = tenantOgImageUrl(tenant, siteOrigin);

  return {
    title,
    description,
    alternates: { canonical: "/" },
    openGraph: {
      title,
      description,
      type: "website",
      locale: "pl_PL",
      ...(ogImage ? { images: [{ url: ogImage, alt: `${tenant.name} logo` }] } : {}),
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
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
  const itemListSchema =
    products.length > 0 ? buildItemListSchema(products, siteOrigin) : null;
  const homeH1 = homePageH1(tenant);
  const primary = tenant.theme_json.colors?.primary ?? "#2563eb";

  if (tenant.slug === "store2") {
    return (
      <StoreShell tenant={tenant}>
        <JsonLd data={faqSchema} />
        {itemListSchema ? <JsonLd data={itemListSchema} /> : null}
        <PawNestHome tenant={tenant} products={products} homeH1={homeH1} primary={primary} />
      </StoreShell>
    );
  }

  return (
    <StoreShell tenant={tenant}>
      <JsonLd data={faqSchema} />
      {itemListSchema ? <JsonLd data={itemListSchema} /> : null}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <h1 className="mb-6 max-w-3xl text-3xl font-bold leading-tight">{homeH1}</h1>
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
