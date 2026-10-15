"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, string | number>) => void;
    };
  }
}

type SessionSummary = {
  total_cents: number;
  currency: string;
};

type PurchaseTrackerProps = {
  sessionId?: string;
};

export function PurchaseTracker({ sessionId }: PurchaseTrackerProps) {
  useEffect(() => {
    if (!sessionId) {
      return;
    }

    let cancelled = false;

    async function trackPurchase() {
      const id = sessionId;
      if (!id) {
        return;
      }

      try {
        const response = await fetch(
          `/api/checkout/session?session_id=${encodeURIComponent(id)}`,
        );
        if (!response.ok || cancelled) {
          return;
        }

        const data = (await response.json()) as SessionSummary;
        if (!data.total_cents || cancelled) {
          return;
        }

        const dedupeKey = `umami_purchase_${id}`;
        try {
          if (sessionStorage.getItem(dedupeKey)) {
            return;
          }
          sessionStorage.setItem(dedupeKey, "1");
        } catch {
          // sessionStorage unavailable — still attempt one track
        }

        // Umami custom event "purchase":
        // - store1 website_id: 6ce159dc-88eb-49e8-bcba-7d15934a3760
        // - store2 PawNest website_id: aff7de94-597b-41df-afc8-3d81fab4f609
        // Payload: revenue (major units, number), currency (ISO 4217 uppercase).
        // In Umami → Settings → Events: enable revenue on "purchase"; do not double-count GA4.
        window.umami?.track("purchase", {
          revenue: data.total_cents / 100,
          currency: (data.currency ?? "pln").toUpperCase(),
          checkout_session: id,
        });
      } catch {
        // Analytics must not break checkout success UX
      }
    }

    void trackPurchase();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return null;
}
