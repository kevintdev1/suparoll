"use client";

import { use } from "react";
import { CartContext } from "@/features/commerce/components/cart-context";

export function useCart() {
  const value = use(CartContext);

  if (!value) {
    throw new Error("useCart debe usarse dentro de CartProvider.");
  }

  return value;
}
