"use client";

import Image from "next/image";
import { site } from "@/content/site";
import { useCart } from "@/features/commerce/hooks/useCart";
import { formatPrice } from "@/features/commerce/lib";
import type { CartLine as CartLineType } from "@/features/commerce/types";
import { useToast } from "@/shared/components/ui/Toast";
import { getAsset } from "@/shared/lib/assets";

type CartLineProps = {
  line: CartLineType;
};

export function CartLine({ line }: CartLineProps) {
  const { updateLine, removeLine, restoreLine } = useCart();
  const { showToast } = useToast();
  const image = getAsset(line.imageAssetId);
  const lineTotal =
    line.unitPrice == null ? null : line.unitPrice * line.quantity;

  return (
    <article
      data-anim="cart-line"
      className="grid grid-cols-[4.5rem_1fr_auto] items-center gap-4 border-b border-paper-2 py-4"
    >
      <div className="relative aspect-square overflow-hidden bg-paper-2">
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          className="h-full w-full object-cover"
        />
      </div>

      <div>
        <p className="text-body text-ink">{line.name}</p>
        <p className="mt-1 font-mono text-label uppercase tracking-wider text-ink-2">
          {line.variantName}
        </p>
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            className="flex size-8 items-center justify-center rounded-pill border border-paper-2 text-ink focus-visible:focus-ring"
            onClick={() => updateLine(line.id, line.quantity - 1)}
            aria-label={site.microcopy.decreaseQuantity}
          >
            −
          </button>
          <span className="min-w-6 text-center font-mono text-label text-ink">
            {line.quantity}
          </span>
          <button
            type="button"
            className="flex size-8 items-center justify-center rounded-pill border border-paper-2 text-ink focus-visible:focus-ring"
            onClick={() => updateLine(line.id, line.quantity + 1)}
            aria-label={site.microcopy.increaseQuantity}
          >
            +
          </button>
        </div>
      </div>

      <div className="flex flex-col items-end gap-3">
        <p className="font-mono text-label uppercase tracking-wider text-ink">
          {formatPrice(lineTotal, line.currency)}
        </p>
        <button
          type="button"
          className="text-small text-ink-2 underline-offset-2 hover:text-ink hover:underline focus-visible:focus-ring"
          onClick={() => {
            const removed = removeLine(line.id);

            if (!removed) {
              return;
            }

            showToast(site.microcopy.removedFromCart, {
              label: site.microcopy.undo,
              onAction: () => restoreLine(removed),
            });
          }}
        >
          Eliminar
        </button>
      </div>
    </article>
  );
}
