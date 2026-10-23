"use client";

import { useId, useState } from "react";
import { commerceContent } from "@/content/commerce";
import { AddToCartButton } from "@/features/commerce/components/AddToCartButton";
import { PriceTag } from "@/features/commerce/components/PriceTag";
import { QuantityStepper } from "@/features/commerce/components/QuantityStepper";
import { VariantPicker } from "@/features/commerce/components/VariantPicker";
import { useVariantAvailable } from "@/features/commerce/hooks/useVariantAvailable";
import type {
  CommerceProduct,
  CommerceVariant,
} from "@/features/commerce/types";

type PurchasePanelProps = {
  product: CommerceProduct;
  shippingLabel: string;
  warrantyLabel: string;
  headingLevel?: "h1" | "h2" | "h3";
  showQuantity?: boolean;
  selectedVariantId?: string;
  onVariantChange?: (id: string) => void;
  quantity?: number;
  onQuantityChange?: (quantity: number) => void;
  ctaRef?: (node: HTMLDivElement | null) => void;
};

export function PurchasePanel({
  product,
  headingLevel = "h3",
  selectedVariantId,
  onVariantChange,
  quantity: quantityProp,
  onQuantityChange,
  ...props
}: PurchasePanelProps) {
  const [internalVariantId, setInternalVariantId] = useState(
    product.variants[0]?.id ?? "",
  );
  const [internalQuantity, setInternalQuantity] = useState(1);
  const variantId = selectedVariantId ?? internalVariantId;
  const variant =
    product.variants.find((item) => item.id === variantId) ??
    product.variants[0];

  if (!variant) {
    return null;
  }

  return (
    <PurchasePanelContent
      {...props}
      product={product}
      variant={variant}
      headingLevel={headingLevel}
      onVariantChange={onVariantChange ?? setInternalVariantId}
      quantity={quantityProp ?? internalQuantity}
      onQuantityChange={onQuantityChange ?? setInternalQuantity}
    />
  );
}

type PurchasePanelContentProps = Omit<
  PurchasePanelProps,
  "selectedVariantId" | "headingLevel" | "quantity" | "onQuantityChange"
> & {
  variant: CommerceVariant;
  headingLevel: "h1" | "h2" | "h3";
  onVariantChange: (id: string) => void;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
};

function PurchasePanelContent({
  product,
  variant,
  shippingLabel,
  warrantyLabel,
  headingLevel: Heading,
  showQuantity = false,
  onVariantChange,
  quantity,
  onQuantityChange,
  ctaRef,
}: PurchasePanelContentProps) {
  const variantLabelId = useId();
  const available = useVariantAvailable(variant);
  const displayName = product.model ?? product.brand;
  const copy = commerceContent.product;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="font-mono-label text-ink-2">{product.brand}</p>
        <Heading
          data-page-title={Heading === "h1" ? true : undefined}
          className="mt-2 font-display text-h3 text-ink"
        >
          {displayName}
        </Heading>
        <PriceTag
          price={product.price}
          currency={product.currency}
          className="mt-4"
        />
        <p className="mt-2 font-mono-label text-ink-2">
          {available ? copy.inStock : copy.outOfStock}
        </p>
      </div>

      <div>
        <p id={variantLabelId} className="mb-3 font-mono-label text-ink-2">
          {copy.colorLabel}
        </p>
        <VariantPicker
          variants={product.variants}
          value={variant.id}
          onChange={onVariantChange}
          labelledBy={variantLabelId}
        />
      </div>

      {showQuantity ? (
        <QuantityStepper
          value={quantity}
          onChange={onQuantityChange}
          itemName={`${displayName} ${variant.name}`}
        />
      ) : null}

      <div ref={ctaRef}>
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
