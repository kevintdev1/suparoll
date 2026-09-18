"use client";

import {
  type ReactNode,
  useCallback,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { site } from "@/content/site";
import {
  commerce,
  getCartSnapshot,
  getServerCartSnapshot,
  subscribeCart,
} from "@/features/commerce/lib";
import type { CheckoutValues } from "@/features/commerce/schemas/checkout.schema";
import {
  type CartLine,
  CommerceError,
  type LastAdded,
} from "@/features/commerce/types";
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
  const [lastAdded, setLastAdded] = useState<LastAdded | null>(null);

  const fail = useCallback((caught: unknown) => {
    const message =
      caught instanceof CommerceError
        ? caught.message
        : site.microcopy.cartError;
    setStatus("error");
    setError(message);
  }, []);

  const addToCart = useCallback(
    (variantId: string, quantity = 1) => {
      try {
        const product = commerce.getProduct();
        const variant = product.variants.find((item) => item.id === variantId);

        commerce.addToCart(variantId, quantity);
        setStatus("ready");
        setError(null);

        if (variant) {
          setLastAdded({
            variantId: variant.id,
            imageAssetId: variant.imageAssetId,
          });
        }

        return true;
      } catch (caught) {
        fail(caught);
        return false;
      }
    },
    [fail],
  );

  const updateLine = useCallback(
    (lineId: string, quantity: number) => {
      try {
        commerce.updateLine(lineId, quantity);
        setStatus("ready");
        setError(null);
      } catch (caught) {
        fail(caught);
      }
    },
    [fail],
  );

  const removeLine = useCallback(
    (lineId: string) => {
      const existing = cart.lines.find((line) => line.id === lineId) ?? null;

      try {
        commerce.removeLine(lineId);
        setStatus("ready");
        setError(null);
        return existing;
      } catch (caught) {
        fail(caught);
        return null;
      }
    },
    [cart.lines, fail],
  );

  const restoreLine = useCallback(
    (line: CartLine) => {
      try {
        commerce.addToCart(line.variantId, line.quantity);
        setStatus("ready");
        setError(null);
      } catch (caught) {
        fail(caught);
      }
    },
    [fail],
  );

  const checkout = useCallback(
    (input: CheckoutValues) => {
      try {
        const order = commerce.checkout(input);
        setStatus("ready");
        setError(null);
        setIsOpen(false);
        return order;
      } catch (caught) {
        fail(caught);
        throw caught;
      }
    },
    [fail],
  );

  const value = useMemo(
    () => ({
      cart,
      status,
      error,
      isOpen,
      lastAdded,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      toggleCart: () => setIsOpen((open) => !open),
      addToCart,
      updateLine,
      removeLine,
      restoreLine,
      checkout,
      clearError: () => {
        setError(null);
        setStatus("ready");
      },
    }),
    [
      addToCart,
      cart,
      checkout,
      error,
      isOpen,
      lastAdded,
      removeLine,
      restoreLine,
      status,
      updateLine,
    ],
  );

  return <CartContext value={value}>{children}</CartContext>;
}
