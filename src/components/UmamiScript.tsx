import Script from "next/script";

export function UmamiScript() {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  if (!websiteId) {
    return null;
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_UMAMI_BASE_URL ?? "https://analytics.fighter132456.pl";

  return (
    <Script
      defer
      src={`${baseUrl}/script.js`}
      data-website-id={websiteId}
      strategy="afterInteractive"
    />
  );
}
