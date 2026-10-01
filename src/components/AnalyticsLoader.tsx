"use client";

import Script from "next/script";

type AnalyticsLoaderProps = {
  websiteId?: string;
  baseUrl?: string;
};

/** Umami script.js is cookieless — load on every page view when configured. */
export function AnalyticsLoader({
  websiteId,
  baseUrl = "https://analytics.fighter132456.pl",
}: AnalyticsLoaderProps) {
  if (!websiteId) {
    return null;
  }

  return (
    <Script
      defer
      src={`${baseUrl}/script.js`}
      data-website-id={websiteId}
      strategy="afterInteractive"
    />
  );
}
