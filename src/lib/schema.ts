import type { FaqItemContent } from "@/lib/faq-content";
import type { Product, Tenant } from "@/types/store";

type JsonLd = Record<string, unknown>;

export function buildFaqPageSchema(items: FaqItemContent[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.schemaAnswer,
      },
    })),
  };
}

export function buildOrganizationSchema(
  tenant: Tenant,
  siteOrigin: string,
  supportEmail: string,
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: tenant.name,
    url: siteOrigin,
    email: supportEmail,
  };
}

export function buildWebSiteSchema(tenant: Tenant, siteOrigin: string): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: tenant.name,
    url: siteOrigin,
    inLanguage: "pl-PL",
  };
}

export function buildProductSchema(
  product: Product,
  siteOrigin: string,
  currency = "PLN",
): JsonLd {
  const productUrl = `${siteOrigin}/products/${product.id}`;
  const images = product.images_json.map((img) => img.url).filter(Boolean);

  const schema: JsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    sku: product.sku,
    url: productUrl,
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: currency,
      price: (product.price_cents / 100).toFixed(2),
      availability: "https://schema.org/InStock",
    },
  };

  if (product.description) {
    schema.description = product.description;
  }

  if (images.length > 0) {
    schema.image = images;
  }

  return schema;
}
