"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { PurchasePanel } from "@/features/commerce/components/PurchasePanel";
import type {
  CommerceProduct,
  CommerceVariant,
} from "@/features/commerce/types";
import { getAsset } from "@/shared/lib/assets";
import { gsap, useGSAP } from "@/shared/lib/motion/gsap";
import {
  MOTION_DESKTOP,
  MOTION_MOBILE,
  MOTION_REDUCED,
} from "@/shared/lib/motion/media";
import { dur, ease } from "@/shared/lib/motion/tokens";

type ColorsSceneProps = {
  title: string;
  body: string;
  product: CommerceProduct;
  shippingLabel: string;
  warrantyLabel: string;
};

function mixTint(hex: string): string {
  return `color-mix(in srgb, ${hex} 14%, var(--color-paper))`;
}

export function ColorsScene({
  title,
  body,
  product,
  shippingLabel,
  warrantyLabel,
}: ColorsSceneProps) {
  const rootRef = useRef<HTMLElement>(null);
  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? "");
  const variant =
    product.variants.find((item) => item.id === variantId) ??
    product.variants[0];

  useEffect(() => {
    if (!rootRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) {
          return;
        }

        for (const item of product.variants) {
          const asset = getAsset(item.imageAssetId);
          const preloader = new window.Image();
          preloader.src = asset.src;
        }

        observer.disconnect();
      },
      { rootMargin: "200px" },
    );

    observer.observe(rootRef.current);

    return () => observer.disconnect();
  }, [product.variants]);

  useGSAP(
    () => {
      const root = rootRef.current;

      if (!root || !variant) {
        return;
      }

      const frames = root.querySelectorAll<HTMLElement>(
        '[data-anim="variant-image"]',
      );
      const mm = gsap.matchMedia();

      const apply = (animate: boolean) => {
        gsap.to(root, {
          backgroundColor: mixTint(variant.colorHex),
          duration: animate ? dur.base : 0,
          ease: ease.out,
        });

        for (const frame of frames) {
          const isActive = frame.dataset.variant === variant.id;
          gsap.to(frame, {
            opacity: isActive ? 1 : 0,
            duration: animate ? dur.base : 0,
            ease: ease.out,
          });
        }
      };

      mm.add(MOTION_DESKTOP, () => apply(true));
      mm.add(MOTION_MOBILE, () => apply(true));
      mm.add(MOTION_REDUCED, () => apply(false));

      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [variantId] },
  );

  if (!variant) {
    return null;
  }

  return (
    <section
      ref={rootRef}
      id="colors"
      aria-labelledby="colors-title"
      className="relative z-[4] bg-paper"
      style={{ backgroundColor: mixTint(variant.colorHex) }}
    >
      <div className="mx-auto grid max-w-[1600px] items-center gap-12 px-[clamp(16px,3vw,40px)] py-24 md:grid-cols-12 md:py-32">
        <div className="md:col-span-7">
          <h2 id="colors-title" className="font-display text-h2 text-ink">
            {title}
          </h2>
          <p className="mt-4 max-w-md text-body text-ink-2">{body}</p>

          <div className="relative mt-10 aspect-[4/5] overflow-hidden bg-paper-2 md:aspect-[5/6]">
            {product.variants.map((item) => (
              <VariantFrame
                key={item.id}
                variant={item}
                active={item.id === variant.id}
              />
            ))}
          </div>
        </div>

        <div className="md:col-span-5">
          <PurchasePanel
            product={product}
            shippingLabel={shippingLabel}
            warrantyLabel={warrantyLabel}
            selectedVariantId={variant.id}
            onVariantChange={setVariantId}
          />
        </div>
      </div>
    </section>
  );
}

function VariantFrame({
  variant,
  active,
}: {
  variant: CommerceVariant;
  active: boolean;
}) {
  const asset = getAsset(variant.imageAssetId);

  return (
    <div
      data-anim="variant-image"
      data-variant={variant.id}
      className="absolute inset-0"
      style={{ opacity: active ? 1 : 0 }}
    >
      <Image
        src={asset.src}
        alt={asset.alt}
        width={asset.width}
        height={asset.height}
        sizes="(min-width: 1024px) 55vw, 100vw"
        placeholder={asset.blurDataURL ? "blur" : undefined}
        blurDataURL={asset.blurDataURL}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
