"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { PurchasePanel } from "@/features/commerce/components/PurchasePanel";
import { StickyBuyBar } from "@/features/commerce/components/StickyBuyBar";
import type { CommerceProduct } from "@/features/commerce/types";
import type { Asset } from "@/shared/lib/assets";
import { getDebugSoldOut } from "@/shared/lib/motion/debug";

type ProductHeroProps = {
  product: CommerceProduct;
  images: Asset[];
  shippingLabel: string;
  warrantyLabel: string;
  quantityLabel: string;
};

export function ProductHero({
  product,
  images,
  shippingLabel,
  warrantyLabel,
  quantityLabel,
}: ProductHeroProps) {
  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const [ctaNode, setCtaNode] = useState<HTMLDivElement | null>(null);
  const [soldOut, setSoldOut] = useState(false);
  const variant =
    product.variants.find((item) => item.id === variantId) ??
    product.variants[0];

  useEffect(() => {
    setSoldOut(getDebugSoldOut());
  }, []);

  if (!variant) {
    return null;
  }

  return (
    <section className="relative bg-paper px-[clamp(16px,3vw,40px)] pt-24 pb-16 md:pt-32">
      <div className="mx-auto grid max-w-[1600px] gap-10 md:grid-cols-12 md:items-start">
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto md:col-span-7 md:snap-none md:flex-col md:overflow-visible">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative aspect-[4/5] w-[min(80vw,32rem)] shrink-0 snap-center overflow-hidden bg-paper-2 md:w-full"
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                sizes="(min-width: 1024px) 55vw, 80vw"
                placeholder={image.blurDataURL ? "blur" : undefined}
                blurDataURL={image.blurDataURL}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>

        <div className="md:sticky md:top-24 md:col-span-5">
          <PurchasePanel
            product={product}
            shippingLabel={shippingLabel}
            warrantyLabel={warrantyLabel}
            quantityLabel={quantityLabel}
            showQuantity
            selectedVariantId={variant.id}
            onVariantChange={setVariantId}
            quantity={quantity}
            onQuantityChange={setQuantity}
            ctaRef={setCtaNode}
          />
        </div>
      </div>

      <StickyBuyBar
        product={product}
        variantId={variant.id}
        imageAssetId={variant.imageAssetId}
        available={variant.available && !soldOut}
        quantity={quantity}
        target={ctaNode}
      />
    </section>
  );
}
