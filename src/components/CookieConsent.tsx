"use client";

import { useSyncExternalStore } from "react";

const CONSENT_COOKIE = "cookie-consent";

type CookieConsentProps = {
  primaryColor?: string;
};

function readConsent(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]!) : null;
}

function subscribeConsent(callback: () => void): () => void {
  window.addEventListener("cookie-consent-update", callback);
  return () => window.removeEventListener("cookie-consent-update", callback);
}

function setConsent(value: "essential" | "analytics") {
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `${CONSENT_COOKIE}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
  window.dispatchEvent(new Event("cookie-consent-update"));
}

export function CookieConsent({ primaryColor = "#2563eb" }: CookieConsentProps) {
  const consent = useSyncExternalStore(
    subscribeConsent,
    () => readConsent(),
    () => null,
  );

  if (consent !== null) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white p-4 shadow-lg sm:p-6"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-slate-700">
          We use essential cookies for the cart and checkout. Anonymous page analytics
          (Umami, cookieless, no personal data sold) runs on every visit. See our{" "}
          <a href="/privacy-policy" className="underline" style={{ color: primaryColor }}>
            Privacy Policy
          </a>
          .
        </p>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setConsent("essential")}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Essential only
          </button>
          <button
            type="button"
            onClick={() => setConsent("analytics")}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white"
            style={{ backgroundColor: primaryColor }}
          >
            Accept analytics
          </button>
        </div>
      </div>
    </div>
  );
}
