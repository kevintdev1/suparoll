"use client";

import { CartLine } from "@/features/commerce/components/CartLine";
import { useRemoveCartLine } from "@/features/commerce/hooks/useRemoveCartLine";
import type { CartLine as CartLineType } from "@/features/commerce/types";

type CartLineListProps = {
  lines: CartLineType[];
  onLineRemoved?: () => void;
};

export function CartLineList({ lines, onLineRemoved }: CartLineListProps) {
  const removeLine = useRemoveCartLine(onLineRemoved);

  return (
    <ul>
      {lines.map((line) => (
        <CartLine key={line.id} line={line} onRemove={removeLine} />
      ))}
    </ul>
  );
}
