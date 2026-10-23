"use client";

import { useEffect, useState } from "react";
import { AddToCartButton } from "@/features/commerce/components/AddToCartButton";
import { PriceTag } from "@/features/commerce/components/PriceTag";
import { useVariantAvailable } from "@/features/commerce/hooks/useVariantAvailable";
import type {
  CommerceProduct,
  CommerceVariant,
} from "@/features/commerce/types";

type StickyBuyBarProps = {
  product: CommerceProduct;
  variant: CommerceVariant;
  quantity: number;
  target: HTMLElement | null;
};

export function StickyBuyBar({
  product,
  variant,
  quantity,
  target,
}: StickyBuyBarProps) {
  const [visible, setVisible] = useState(false);
  const available = useVariantAvailable(variant);

  useEffect(() => {
    if (!target) {
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry ? !entry.isIntersecting : false);
    });

    observer.observe(target);
    return () => observer.disconnect();
  }, [target]);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-paper-2 bg-paper px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:hidden">
      <div className="flex items-center gap-4">
        <PriceTag price={product.price} currency={product.currency} />
        <div className="flex-1">
          <AddToCartButton
            variantId={variant.id}
            imageAssetId={variant.imageAssetId}
            quantity={quantity}
            available={available}
          />
        </div>
      </div>
    </div>
  );
}
