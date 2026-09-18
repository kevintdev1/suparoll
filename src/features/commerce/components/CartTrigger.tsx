"use client";

import { ShoppingBag } from "lucide-react";
import { site } from "@/content/site";
import { useCart } from "@/features/commerce/hooks/useCart";
import { formatPrice } from "@/features/commerce/lib";

export function CartTrigger() {
  const { cart, isOpen, toggleCart } = useCart();
  const count = cart.itemCount;
  const countLabel = count > 0 ? ` (${count})` : "";

  return (
    <button
      type="button"
      onClick={toggleCart}
      aria-expanded={isOpen}
      aria-controls="cart-drawer"
      className="fixed top-4 right-4 z-[70] flex items-center gap-2 rounded-pill border border-paper-2 bg-paper px-4 py-2 text-ink shadow-instant focus-visible:focus-ring"
    >
      <span
        data-cart-icon
        className="relative inline-flex size-6 items-center justify-center"
      >
        <ShoppingBag aria-hidden="true" className="size-5" />
      </span>
      <span className="font-mono text-label uppercase tracking-wider">
        {site.navbar.cartLabel}
        <span data-cart-count>{countLabel}</span>
      </span>
      <span className="sr-only">
        {count > 0
          ? `${count} ${count === 1 ? "artículo" : "artículos"}. Total ${formatPrice(cart.total, cart.lines[0]?.currency ?? null)}`
          : site.microcopy.emptyCart}
      </span>
    </button>
  );
}
