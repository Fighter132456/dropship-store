"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import type { CartItem, Product } from "@/types/store";
import { formatPrice } from "@/lib/format";

const CART_KEY = "dropship-cart";

function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function subscribeCart(onStoreChange: () => void) {
  window.addEventListener("cart-updated", onStoreChange);
  return () => window.removeEventListener("cart-updated", onStoreChange);
}

type CartViewProps = {
  products: Product[];
  primaryColor?: string;
};

export function CartView({ products, primaryColor = "#2563eb" }: CartViewProps) {
  const items = useSyncExternalStore(subscribeCart, readCart, () => []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const productMap = new Map(products.map((p) => [p.id, p]));

  const lines = items
    .map((item) => {
      const product = productMap.get(item.productId);
      if (!product) return null;
      return { item, product, lineTotal: product.price_cents * item.qty };
    })
    .filter(Boolean) as Array<{
    item: CartItem;
    product: Product;
    lineTotal: number;
  }>;

  const totalCents = lines.reduce((sum, line) => sum + line.lineTotal, 0);

  async function handleCheckout() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        throw new Error(data.error ?? "Checkout failed");
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setLoading(false);
    }
  }

  if (lines.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
        <p className="mb-4 text-slate-600">Your cart is empty.</p>
        <Link href="/" className="font-medium" style={{ color: primaryColor }}>
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
        {lines.map(({ item, product, lineTotal }) => (
          <li key={product.id} className="flex items-center justify-between gap-4 p-4">
            <div>
              <p className="font-medium text-slate-900">{product.title}</p>
              <p className="text-sm text-slate-500">
                {formatPrice(product.price_cents)} × {item.qty}
              </p>
            </div>
            <p className="font-semibold">{formatPrice(lineTotal)}</p>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
        <span className="text-lg font-semibold">Total</span>
        <span className="text-xl font-bold">{formatPrice(totalCents)}</span>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading}
        className="w-full rounded-lg px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
        style={{ backgroundColor: primaryColor }}
      >
        {loading ? "Redirecting to Stripe…" : "Checkout with Stripe"}
      </button>
    </div>
  );
}
