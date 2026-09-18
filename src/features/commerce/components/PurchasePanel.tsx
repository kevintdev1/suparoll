"use client";

import { useEffect, useId, useState } from "react";
import { site } from "@/content/site";
import { AddToCartButton } from "@/features/commerce/components/AddToCartButton";
import { PriceTag } from "@/features/commerce/components/PriceTag";
import { VariantPicker } from "@/features/commerce/components/VariantPicker";
import type { CommerceProduct } from "@/features/commerce/types";
import { getDebugSoldOut } from "@/shared/lib/motion/debug";

type PurchasePanelProps = {
  product: CommerceProduct;
  shippingLabel: string;
  warrantyLabel: string;
  quantityLabel?: string;
  showQuantity?: boolean;
  selectedVariantId?: string;
  onVariantChange?: (id: string) => void;
  quantity?: number;
  onQuantityChange?: (quantity: number) => void;
  ctaRef?: (node: HTMLDivElement | null) => void;
};

export function PurchasePanel({
  product,
  shippingLabel,
  warrantyLabel,
  quantityLabel,
  showQuantity = false,
  selectedVariantId,
  onVariantChange,
  quantity: quantityProp,
  onQuantityChange,
  ctaRef,
}: PurchasePanelProps) {
  const variantLabelId = useId();
  const [internalVariantId, setInternalVariantId] = useState(
    product.variants[0]?.id ?? "",
  );
  const [internalQuantity, setInternalQuantity] = useState(1);
  const [soldOut, setSoldOut] = useState(false);

  useEffect(() => {
    setSoldOut(getDebugSoldOut());
  }, []);

  const variantId = selectedVariantId ?? internalVariantId;
  const setVariantId = onVariantChange ?? setInternalVariantId;
  const quantity = quantityProp ?? internalQuantity;
  const setQuantity = onQuantityChange ?? setInternalQuantity;
  const variant =
    product.variants.find((item) => item.id === variantId) ??
    product.variants[0];

  if (!variant) {
    return null;
  }

  const available = variant.available && !soldOut;
  const displayName =
    product.model ?? "[[PENDIENTE: nombre comercial del modelo]]";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="font-mono text-label uppercase tracking-wider text-ink-2">
          {product.brand}
        </p>
        <p className="mt-2 font-display text-h3 text-ink">{displayName}</p>
        <PriceTag
          price={product.price}
          currency={product.currency}
          className="mt-4"
        />
        <p className="mt-2 font-mono text-label uppercase tracking-wider text-ink-2">
          {available ? site.microcopy.inStock : site.microcopy.outOfStock}
        </p>
      </div>

      <div>
        <p
          id={variantLabelId}
          className="mb-3 font-mono text-label uppercase tracking-wider text-ink-2"
        >
          Color
        </p>
        <VariantPicker
          variants={product.variants}
          value={variant.id}
          onChange={setVariantId}
          labelledBy={variantLabelId}
        />
      </div>

      {showQuantity ? (
        <div>
          <p className="mb-3 font-mono text-label uppercase tracking-wider text-ink-2">
            {quantityLabel}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex size-10 items-center justify-center rounded-pill border border-paper-2 focus-visible:focus-ring"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              aria-label={site.microcopy.decreaseQuantity}
            >
              −
            </button>
            <span className="min-w-8 text-center font-mono text-label">
              {quantity}
            </span>
            <button
              type="button"
              className="flex size-10 items-center justify-center rounded-pill border border-paper-2 focus-visible:focus-ring"
              onClick={() => setQuantity(quantity + 1)}
              aria-label={site.microcopy.increaseQuantity}
            >
              +
            </button>
          </div>
        </div>
      ) : null}

      <div ref={ctaRef} data-purchase-cta>
        <AddToCartButton
          variantId={variant.id}
          imageAssetId={variant.imageAssetId}
          quantity={quantity}
          available={available}
        />
      </div>

      <p className="text-small text-ink-2">
        {shippingLabel}
        <span className="mx-2" aria-hidden="true">
          ·
        </span>
        {warrantyLabel}
      </p>
    </div>
  );
}
