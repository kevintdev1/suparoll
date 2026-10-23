"use client";

import Image from "next/image";
import { useState } from "react";
import { PurchasePanel } from "@/features/commerce/components/PurchasePanel";
import { StickyBuyBar } from "@/features/commerce/components/StickyBuyBar";
import type { CommerceProduct } from "@/features/commerce/types";
import type { Asset } from "@/shared/lib/assets";

type ProductHeroProps = {
  product: CommerceProduct;
  images: Asset[];
  shippingLabel: string;
  warrantyLabel: string;
};

export function ProductHero({
  product,
  images,
  shippingLabel,
  warrantyLabel,
}: ProductHeroProps) {
  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const [ctaNode, setCtaNode] = useState<HTMLDivElement | null>(null);
  const variant =
    product.variants.find((item) => item.id === variantId) ??
    product.variants[0];

  if (!variant) {
    return null;
  }

  return (
    <section className="page-margin bg-paper pt-24 pb-16 md:pt-32">
      <div className="content-max grid gap-10 md:grid-cols-12 md:items-start">
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto md:col-span-7 md:snap-none md:flex-col md:overflow-visible">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="aspect-4/5 w-[min(80vw,32rem)] shrink-0 snap-center overflow-hidden bg-paper-2 md:w-full"
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                sizes="(min-width: 64rem) 55vw, min(80vw, 32rem)"
                preload={index === 0}
                placeholder={image.blurDataURL ? "blur" : undefined}
                blurDataURL={image.blurDataURL}
                className="size-full object-cover"
              />
            </div>
          ))}
        </div>

        <div className="md:sticky md:top-24 md:col-span-5">
          <PurchasePanel
            product={product}
            headingLevel="h1"
            shippingLabel={shippingLabel}
            warrantyLabel={warrantyLabel}
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
        variant={variant}
        quantity={quantity}
        target={ctaNode}
      />
    </section>
  );
}
