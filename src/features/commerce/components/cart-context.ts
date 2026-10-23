"use client";

import { createContext } from "react";
import type { CheckoutValues } from "@/features/commerce/schemas/checkout.schema";
import type { Cart, CartLine, SimulatedOrder } from "@/features/commerce/types";

export type CartStatus = "ready" | "error";

export type CartContextValue = {
  cart: Cart;
  status: CartStatus;
  error: string | null;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (variantId: string, quantity?: number) => boolean;
  updateLine: (lineId: string, quantity: number) => void;
  removeLine: (lineId: string) => CartLine | null;
  restoreLine: (line: CartLine) => void;
  checkout: (input: CheckoutValues) => SimulatedOrder;
  clearError: () => void;
};

export const CartContext = createContext<CartContextValue | null>(null);
