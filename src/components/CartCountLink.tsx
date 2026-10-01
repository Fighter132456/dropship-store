"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { readCartSnapshot, subscribeCart } from "@/lib/cart-store";

type CartCountLinkProps = {
  primaryColor: string;
};

function cartItemCount(): number {
  return readCartSnapshot().reduce((sum, item) => sum + item.qty, 0);
}

export function CartCountLink({ primaryColor }: CartCountLinkProps) {
  const count = useSyncExternalStore(subscribeCart, cartItemCount, () => 0);

  return (
    <Link
      href="/cart"
      className="rounded-lg px-4 py-2 text-sm font-medium text-white"
      style={{ backgroundColor: primaryColor }}
    >
      Cart ({count})
    </Link>
  );
}
