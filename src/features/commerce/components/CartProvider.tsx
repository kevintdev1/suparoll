"use client";

import {
  type ReactNode,
  useCallback,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { commerceContent } from "@/content/commerce";
import {
  commerce,
  getCartSnapshot,
  getServerCartSnapshot,
  subscribeCart,
} from "@/features/commerce/lib";
import type { CheckoutValues } from "@/features/commerce/schemas/checkout.schema";
import { type CartLine, CommerceError } from "@/features/commerce/types";
import { CartContext, type CartStatus } from "./cart-context";

export function CartProvider({ children }: { children: ReactNode }) {
  const cart = useSyncExternalStore(
    subscribeCart,
    getCartSnapshot,
    getServerCartSnapshot,
  );
  const [status, setStatus] = useState<CartStatus>("ready");
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const succeed = useCallback(() => {
    setStatus("ready");
    setError(null);
  }, []);

  const fail = useCallback((caught: unknown) => {
    setStatus("error");
    setError(
      caught instanceof CommerceError
        ? caught.message
        : commerceContent.cart.error,
    );
  }, []);

  const run = useCallback(
    (operation: () => void): boolean => {
      try {
        operation();
        succeed();
        return true;
      } catch (caught) {
        fail(caught);
        return false;
      }
    },
    [fail, succeed],
  );

  const addToCart = useCallback(
    (variantId: string, quantity = 1) =>
      run(() => commerce.addToCart(variantId, quantity)),
    [run],
  );

  const updateLine = useCallback(
    (lineId: string, quantity: number) => {
      run(() => commerce.updateLine(lineId, quantity));
    },
    [run],
  );

  const removeLine = useCallback(
    (lineId: string) => {
      const existing = cart.lines.find((line) => line.id === lineId) ?? null;
      return run(() => commerce.removeLine(lineId)) ? existing : null;
    },
    [cart.lines, run],
  );

  const restoreLine = useCallback(
    (line: CartLine) => {
      run(() => commerce.addToCart(line.variantId, line.quantity));
    },
    [run],
  );

  const checkout = useCallback(
    (input: CheckoutValues) => {
      try {
        const order = commerce.checkout(input);
        succeed();
        setIsOpen(false);
        return order;
      } catch (caught) {
        fail(caught);
        throw caught;
      }
    },
    [fail, succeed],
  );

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((open) => !open), []);

  const value = useMemo(
    () => ({
      cart,
      status,
      error,
      isOpen,
      openCart,
      closeCart,
      toggleCart,
      addToCart,
      updateLine,
      removeLine,
      restoreLine,
      checkout,
      clearError: succeed,
    }),
    [
      addToCart,
      cart,
      checkout,
      closeCart,
      error,
      isOpen,
      openCart,
      removeLine,
      restoreLine,
      status,
      succeed,
      toggleCart,
      updateLine,
    ],
  );

  return <CartContext value={value}>{children}</CartContext>;
}
