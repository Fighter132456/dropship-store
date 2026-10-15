import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AnalyticsLoader } from "@/components/AnalyticsLoader";
import { CookieConsent } from "@/components/CookieConsent";
import { JsonLd } from "@/components/JsonLd";
import { SentryLoader } from "@/components/SentryLoader";
import { getTenantSupportEmail } from "@/lib/faq-content";
import { isPolishLegal } from "@/lib/legal-content";
import { tenantOgImageUrl } from "@/lib/seo-meta";
import { buildOrganizationSchema, buildWebSiteSchema } from "@/lib/schema";
import { getSiteOrigin } from "@/lib/site-url";
import { getTenant } from "@/lib/tenant";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenant();
  const title = tenant?.name ?? "Dropship Store";
  const description =
    tenant?.theme_json.copy?.tagline ?? "Multi-tenant dropship storefront";
  const domain = tenant?.domain;
  const siteOrigin = tenant && domain ? `https://${domain}` : null;
  const ogImage =
    tenant && siteOrigin ? tenantOgImageUrl(tenant, siteOrigin) : undefined;

  return {
    title: { default: title, template: `%s · ${title}` },
    description,
    ...(domain && siteOrigin
      ? {
          metadataBase: new URL(siteOrigin),
          openGraph: {
            title,
            description,
            siteName: title,
            locale: tenant?.theme_json.copy?.locale === "pl" ? "pl_PL" : "en_US",
            type: "website",
            ...(ogImage ? { images: [{ url: ogImage, alt: `${title} logo` }] } : {}),
          },
          twitter: {
            card: ogImage ? "summary_large_image" : "summary",
            title,
            description,
            ...(ogImage ? { images: [ogImage] } : {}),
          },
        }
      : {}),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const tenant = await getTenant();
  const bg = tenant?.theme_json.colors?.background ?? "#f8fafc";
  const text = tenant?.theme_json.colors?.text ?? "#0f172a";
  const primary = tenant?.theme_json.colors?.primary ?? "#2563eb";
  const umamiId =
    tenant?.theme_json.umami_website_id ??
    (tenant?.slug === "store1"
      ? process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID
      : tenant?.slug === "store2"
        ? (process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID_STORE2 ??
          "aff7de94-597b-41df-afc8-3d81fab4f609")
        : undefined);
  const umamiBase =
    process.env.NEXT_PUBLIC_UMAMI_BASE_URL ?? "https://analytics.fighter132456.pl";

  const siteOrigin = tenant ? await getSiteOrigin(tenant) : null;
  const globalSchema =
    tenant && siteOrigin
      ? [
          buildOrganizationSchema(tenant, siteOrigin, getTenantSupportEmail(tenant)),
          buildWebSiteSchema(tenant, siteOrigin),
        ]
      : null;

  return (
    <html
      lang="pl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col"
        style={{ backgroundColor: bg, color: text }}
      >
        {globalSchema ? <JsonLd data={globalSchema} /> : null}
        <AnalyticsLoader websiteId={umamiId} baseUrl={umamiBase} />
        <SentryLoader
          dsn={process.env.NEXT_PUBLIC_SENTRY_DSN}
          environment={process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development"}
        />
        <CookieConsent
          primaryColor={primary}
          polish={tenant ? isPolishLegal(tenant) : false}
        />
        {children}
      </body>
    </html>
  );
}
