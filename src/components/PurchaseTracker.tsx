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

        window.umami?.track("purchase", {
          revenue: data.total_cents / 100,
          currency: (data.currency ?? "pln").toUpperCase(),
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
