"use client";

import Image from "next/image";
import { commerceContent } from "@/content/commerce";
import { QuantityStepper } from "@/features/commerce/components/QuantityStepper";
import { useCart } from "@/features/commerce/hooks/useCart";
import { formatPrice, getLineTotal } from "@/features/commerce/lib";
import type { CartLine as CartLineType } from "@/features/commerce/types";
import { getAsset } from "@/shared/lib/assets";

type CartLineProps = {
  line: CartLineType;
  onRemove: (line: CartLineType) => void;
};

export function CartLine({ line, onRemove }: CartLineProps) {
  const { updateLine } = useCart();
  const image = getAsset(line.imageAssetId);
  const itemName = `${line.name} ${line.variantName}`;

  return (
    <li
      data-anim="cart-line"
      className="grid grid-cols-[4.5rem_1fr_auto] items-center gap-4 border-b border-paper-2 py-4"
    >
      <div className="aspect-square overflow-hidden bg-paper-2">
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes="72px"
          className="size-full object-cover"
        />
      </div>

      <div>
        <p className="text-body text-ink">{line.name}</p>
        <p className="mt-1 font-mono-label text-ink-2">{line.variantName}</p>
        <div className="mt-3">
          <QuantityStepper
            value={line.quantity}
            onChange={(quantity) => updateLine(line.id, quantity)}
            itemName={itemName}
            showLabel={false}
          />
        </div>
      </div>

      <div className="flex flex-col items-end gap-1">
        <p className="font-mono-label text-ink">
          {formatPrice(getLineTotal(line), line.currency)}
        </p>
        <button
          type="button"
          className="min-h-11 text-small text-ink-2 underline-offset-2 hover:text-ink hover:underline focus-visible:focus-ring"
          onClick={() => onRemove(line)}
        >
          {commerceContent.cart.remove}
          <span className="sr-only">: {itemName}</span>
        </button>
      </div>
    </li>
  );
}
