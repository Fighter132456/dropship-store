import type { Metadata } from "next";
import type { Product, Tenant } from "@/types/store";
import { formatPrice } from "@/lib/format";
import { isPolishLegal } from "@/lib/legal-content";
import type { LegalPageId } from "@/lib/legal-content";
import { legalPageTitle } from "@/lib/legal-content";

export function tenantOgImageUrl(tenant: Tenant, siteOrigin: string): string | undefined {
  const logo = tenant.theme_json.logo;
  if (!logo) {
    return undefined;
  }
  return logo.startsWith("http") ? logo : `${siteOrigin}${logo}`;
}

export function homePageTitle(tenant: Tenant): string {
  const custom = tenant.theme_json.copy?.meta_home_title;
  if (custom) {
    return custom;
  }
  if (isPolishLegal(tenant)) {
    return `${tenant.name} — akcesoria dla psów i kotów`;
  }
  return tenant.name;
}

export function homePageH1(tenant: Tenant): string {
  const hero = tenant.theme_json.copy?.hero;
  if (hero?.subheadline) {
    return hero.subheadline;
  }
  if (hero?.headline) {
    return hero.headline;
  }
  return isPolishLegal(tenant) ? "Produkty" : "Products";
}

export function productMetaDescription(product: Product, tenant: Tenant): string {
  const price = formatPrice(product.price_cents);
  const snippet = product.description?.replace(/\s+/g, " ").trim().slice(0, 100);
  if (isPolishLegal(tenant)) {
    const lead = snippet ? `${snippet}… ` : "";
    return `${lead}${product.title} — od ${price}. Kup w ${tenant.name}. Wysyłka PL i UE, zwrot 14 dni.`;
  }
  const lead = snippet ? `${snippet}… ` : "";
  return `${lead}${product.title} — from ${price}. Shop at ${tenant.name}.`;
}

export function buildLegalMetadata(
  tenant: Tenant,
  page: LegalPageId,
  pathname: string,
): Metadata {
  const title = legalPageTitle(tenant, page);
  const polish = isPolishLegal(tenant);
  const description = polish
    ? `${title} sklepu ${tenant.name} (${tenant.domain}).`
    : `${title} for ${tenant.name} (${tenant.domain}).`;

  return {
    title,
    description,
    alternates: { canonical: pathname },
    openGraph: {
      title: `${title} · ${tenant.name}`,
      description,
      type: "website",
      locale: polish ? "pl_PL" : "en_US",
    },
    robots: { index: true, follow: true },
  };
}

export function noIndexMetadata(title: string): Metadata {
  return {
    title,
    robots: { index: false, follow: false },
  };
}
