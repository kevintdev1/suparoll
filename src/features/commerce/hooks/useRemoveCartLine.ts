"use client";

import { commerceContent } from "@/content/commerce";
import { useCart } from "@/features/commerce/hooks/useCart";
import type { CartLine } from "@/features/commerce/types";
import { useToast } from "@/shared/components/ui/Toast";

export function useRemoveCartLine(onRemoved?: () => void) {
  const { removeLine, restoreLine } = useCart();
  const { showToast } = useToast();

  return (line: CartLine) => {
    const removed = removeLine(line.id);

    if (!removed) {
      return;
    }

    onRemoved?.();
    showToast(commerceContent.cart.removed, {
      label: commerceContent.cart.undo,
      onAction: () => restoreLine(removed),
    });
  };
}
