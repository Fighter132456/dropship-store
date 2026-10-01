"use client";

import Script from "next/script";

type SentryLoaderProps = {
  dsn?: string;
  environment?: string;
};

/**
 * Optional Sentry browser SDK (CDN) — no npm dependency.
 * Set NEXT_PUBLIC_SENTRY_DSN in Vercel; free tier only.
 */
export function SentryLoader({ dsn, environment = "production" }: SentryLoaderProps) {
  if (!dsn) {
    return null;
  }

  const initSnippet = `
    Sentry.init({
      dsn: ${JSON.stringify(dsn)},
      environment: ${JSON.stringify(environment)},
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: 0,
    });
  `.trim();

  return (
    <>
      <Script
        src="https://browser.sentry-cdn.com/8.55.0/bundle.min.js"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <Script id="sentry-init" strategy="afterInteractive">
        {initSnippet}
      </Script>
    </>
  );
}
