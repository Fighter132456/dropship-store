"use client";

import Link from "next/link";
import { PurchaseTracker } from "@/components/PurchaseTracker";

type PurchaseSuccessProps = {
  sessionId?: string;
  primaryColor: string;
};

export function PurchaseSuccess({ sessionId, primaryColor }: PurchaseSuccessProps) {
  return (
    <>
      <PurchaseTracker sessionId={sessionId} />
      <main className="mx-auto max-w-xl flex-1 px-4 py-16 text-center">
        <h1 className="text-3xl font-bold">Payment successful</h1>
        <p className="mt-4 text-slate-600">
          Thank you! Your order is being processed. You will receive a confirmation email shortly.
        </p>
        {sessionId ? (
          <p className="mt-2 text-xs text-slate-400">Ref: {sessionId.slice(0, 20)}…</p>
        ) : null}
        <Link
          href="/"
          className="mt-8 inline-block rounded-lg px-6 py-3 text-sm font-semibold text-white"
          style={{ backgroundColor: primaryColor }}
        >
          Back to shop
        </Link>
      </main>
    </>
  );
}
