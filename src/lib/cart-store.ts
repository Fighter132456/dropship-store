import type { CartItem } from "@/types/store";

export const CART_KEY = "dropship-cart";

let cachedRaw: string | null = null;
let cachedItems: CartItem[] = [];

/** Stable snapshot for useSyncExternalStore — avoids React #185 infinite re-render. */
export function readCartSnapshot(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY) ?? "";
    if (raw === cachedRaw) return cachedItems;
    cachedRaw = raw;
    cachedItems = raw ? (JSON.parse(raw) as CartItem[]) : [];
    return cachedItems;
  } catch {
    cachedRaw = "";
    cachedItems = [];
    return cachedItems;
  }
}

export function subscribeCart(onStoreChange: () => void): () => void {
  const handler = () => {
    cachedRaw = null;
    onStoreChange();
  };
  window.addEventListener("cart-updated", handler);
  return () => window.removeEventListener("cart-updated", handler);
}

export function writeCart(items: CartItem[]): void {
  const raw = JSON.stringify(items);
  localStorage.setItem(CART_KEY, raw);
  cachedRaw = raw;
  cachedItems = items;
  window.dispatchEvent(new Event("cart-updated"));
}
