"use client";

import Image from "next/image";
import { useState } from "react";
import { type CommerceProduct, PurchasePanel } from "@/features/commerce";

export type ColorFrame = {
  variantId: string;
  colorHex: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL?: string;
};

type ColorsSceneProps = {
  product: CommerceProduct;
  frames: ColorFrame[];
  shippingLabel: string;
  warrantyLabel: string;
};

function mixTint(color: string): string {
  return `color-mix(in srgb, ${color} 14%, var(--color-paper))`;
}

export function ColorsScene({
  product,
  frames,
  shippingLabel,
  warrantyLabel,
}: ColorsSceneProps) {
  const [variantId, setVariantId] = useState(frames[0]?.variantId ?? "");
  const activeFrame =
    frames.find((frame) => frame.variantId === variantId) ?? frames[0];

  if (!activeFrame) {
    return null;
  }

  return (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-1 transition-colors duration-600 motion-reduce:transition-none"
        style={{ backgroundColor: mixTint(activeFrame.colorHex) }}
      />

      <div className="relative aspect-4/5 overflow-hidden bg-paper-2 md:col-span-7 md:aspect-5/6">
        {frames.map((frame) => {
          const active = frame.variantId === activeFrame.variantId;

          return (
            <Image
              key={frame.variantId}
              src={frame.src}
              alt={frame.alt}
              aria-hidden={!active || undefined}
              width={frame.width}
              height={frame.height}
              sizes="(min-width: 1024px) 55vw, 100vw"
              placeholder={frame.blurDataURL ? "blur" : undefined}
              blurDataURL={frame.blurDataURL}
              className={`absolute inset-0 size-full object-cover transition-opacity duration-600 motion-reduce:transition-none ${active ? "opacity-100" : "opacity-0"}`}
            />
          );
        })}
      </div>

      <div className="md:col-span-5 md:col-start-8 md:row-span-2 md:row-start-1 md:self-center">
        <PurchasePanel
          product={product}
          shippingLabel={shippingLabel}
          warrantyLabel={warrantyLabel}
          selectedVariantId={activeFrame.variantId}
          onVariantChange={setVariantId}
        />
      </div>
    </>
  );
}
