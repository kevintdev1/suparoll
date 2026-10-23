"use client";

import { ShoppingBag } from "lucide-react";
import { commerceContent } from "@/content/commerce";
import { CART_DRAWER_ID } from "@/features/commerce/components/cart-ids";
import { useCart } from "@/features/commerce/hooks/useCart";
import { describeCart } from "@/features/commerce/lib";

export function CartTrigger() {
  const { cart, isOpen, toggleCart } = useCart();
  const count = cart.itemCount;

  return (
    <button
      type="button"
      onClick={toggleCart}
      aria-expanded={isOpen}
      aria-controls={CART_DRAWER_ID}
      className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-pill border border-current/30 px-3 focus-visible:focus-ring md:px-4"
    >
      <span
        data-cart-icon
        className="inline-flex size-5 items-center justify-center"
      >
        <ShoppingBag aria-hidden="true" className="size-4" />
      </span>
      <span aria-hidden="true" className="font-mono-label max-md:hidden">
        {commerceContent.cart.title}
        <span data-cart-count className="inline-block">
          {count > 0 ? ` (${count})` : ""}
        </span>
      </span>
      <span className="sr-only">
        {commerceContent.cart.title}. {describeCart(cart)}
      </span>
    </button>
  );
}
