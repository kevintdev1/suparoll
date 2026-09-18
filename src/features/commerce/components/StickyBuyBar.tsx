"use client";

import { useEffect, useState } from "react";
import { AddToCartButton } from "@/features/commerce/components/AddToCartButton";
import { PriceTag } from "@/features/commerce/components/PriceTag";
import type { CommerceProduct } from "@/features/commerce/types";

type StickyBuyBarProps = {
  product: CommerceProduct;
  variantId: string;
  imageAssetId: string;
  available: boolean;
  quantity: number;
  target: HTMLElement | null;
};

export function StickyBuyBar({
  product,
  variantId,
  imageAssetId,
  available,
  quantity,
  target,
}: StickyBuyBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node =
      target ?? document.querySelector<HTMLElement>("[data-purchase-cta]");

    if (!node) {
      return;
    }

    const sync = () => {
      const rect = node.getBoundingClientRect();
      setVisible(rect.bottom < 8 || rect.top > window.innerHeight - 8);
    };

    sync();
    window.addEventListener("scroll", sync, { capture: true, passive: true });
    window.addEventListener("resize", sync);

    const observer = new IntersectionObserver(() => {
      sync();
    });
    observer.observe(node);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", sync, { capture: true });
      window.removeEventListener("resize", sync);
    };
  }, [target]);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-paper-2 bg-paper px-4 py-3 md:hidden">
      <div className="flex items-center gap-4">
        <PriceTag price={product.price} currency={product.currency} />
        <div className="flex-1">
          <AddToCartButton
            variantId={variantId}
            imageAssetId={imageAssetId}
            quantity={quantity}
            available={available}
          />
        </div>
      </div>
    </div>
  );
}
