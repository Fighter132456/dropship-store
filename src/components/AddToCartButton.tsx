"use client";

import { useState } from "react";
import { readCartSnapshot, writeCart } from "@/lib/cart-store";

type AddToCartButtonProps = {
  productId: string;
  primaryColor?: string;
};

export function AddToCartButton({
  productId,
  primaryColor = "#2563eb",
}: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);

  function handleAdd() {
    const cart = [...readCartSnapshot()];
    const existing = cart.find((item) => item.productId === productId);

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ productId, qty: 1 });
    }

    writeCart(cart);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      className="rounded-lg px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
      style={{ backgroundColor: primaryColor }}
    >
      {added ? "Added!" : "Add to cart"}
    </button>
  );
}
