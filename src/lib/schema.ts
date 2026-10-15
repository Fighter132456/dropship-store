import type { FaqItemContent } from "@/lib/faq-content";
import { isPolishLegal } from "@/lib/legal-content";
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
  const logoPath = tenant.theme_json.logo;
  const schema: JsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: tenant.name,
    url: siteOrigin,
    email: supportEmail,
  };

  if (logoPath) {
    schema.logo = logoPath.startsWith("http") ? logoPath : `${siteOrigin}${logoPath}`;
  }

  return schema;
}

export function buildWebSiteSchema(tenant: Tenant, siteOrigin: string): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: tenant.name,
    url: siteOrigin,
    inLanguage: isPolishLegal(tenant) ? "pl-PL" : "en",
  };
}

export function buildItemListSchema(
  products: Product[],
  siteOrigin: string,
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: product.title,
      url: `${siteOrigin}/products/${product.id}`,
    })),
  };
}

export function buildProductBreadcrumbSchema(
  tenant: Tenant,
  product: Product,
  siteOrigin: string,
): JsonLd {
  const productUrl = `${siteOrigin}/products/${product.id}`;
  const homeLabel = isPolishLegal(tenant) ? "Strona główna" : "Home";

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: homeLabel,
        item: siteOrigin,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: product.title,
        item: productUrl,
      },
    ],
  };
}

function merchantReturnPolicy(siteOrigin: string, polish: boolean): JsonLd {
  return {
    "@type": "MerchantReturnPolicy",
    merchantReturnLink: `${siteOrigin}/refund-policy`,
    applicableCountry: polish ? "PL" : "US",
    returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: 14,
    returnMethod: "https://schema.org/ReturnByMail",
    returnFees: "https://schema.org/ReturnShippingFees",
  };
}

function offerShippingDetails(polish: boolean): JsonLd {
  const region = polish
    ? { "@type": "DefinedRegion", addressCountry: ["PL", "DE", "FR", "NL", "ES", "IT"] }
    : { "@type": "DefinedRegion", addressCountry: "US" };

  return {
    "@type": "OfferShippingDetails",
    shippingDestination: region,
    deliveryTime: {
      "@type": "ShippingDeliveryTime",
      handlingTime: {
        "@type": "QuantitativeValue",
        minValue: 1,
        maxValue: 3,
        unitCode: "DAY",
      },
      transitTime: {
        "@type": "QuantitativeValue",
        minValue: 5,
        maxValue: 14,
        unitCode: "DAY",
      },
    },
  };
}

export function buildProductSchema(
  product: Product,
  tenant: Tenant,
  siteOrigin: string,
  currency = "PLN",
): JsonLd {
  const productUrl = `${siteOrigin}/products/${product.id}`;
  const images = product.images_json.map((img) => img.url).filter(Boolean);
  const polish = isPolishLegal(tenant);

  const schema: JsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    sku: product.sku,
    url: productUrl,
    brand: {
      "@type": "Brand",
      name: tenant.name,
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: currency,
      price: (product.price_cents / 100).toFixed(2),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: tenant.name,
        url: siteOrigin,
      },
      shippingDetails: offerShippingDetails(polish),
      hasMerchantReturnPolicy: merchantReturnPolicy(siteOrigin, polish),
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
