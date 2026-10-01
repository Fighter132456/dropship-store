"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

type AnalyticsLoaderProps = {
  websiteId?: string;
  baseUrl?: string;
};

function hasAnalyticsConsent(): boolean {
  return /(?:^|; )cookie-consent=analytics(?:;|$)/.test(document.cookie);
}

export function AnalyticsLoader({
  websiteId,
  baseUrl = "https://analytics.fighter132456.pl",
}: AnalyticsLoaderProps) {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const sync = () => setAllowed(hasAnalyticsConsent());
    sync();
    window.addEventListener("cookie-consent-update", sync);
    return () => window.removeEventListener("cookie-consent-update", sync);
  }, []);

  if (!websiteId || !allowed) {
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
