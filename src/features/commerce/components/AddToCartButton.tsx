"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { site } from "@/content/site";
import { useCart } from "@/features/commerce/hooks/useCart";
import { Button } from "@/shared/components/ui/Button";
import { getAsset } from "@/shared/lib/assets";
import { Flip, gsap, useGSAP } from "@/shared/lib/motion/gsap";
import {
  MOTION_DESKTOP,
  MOTION_MOBILE,
  MOTION_REDUCED,
} from "@/shared/lib/motion/media";
import { dur, ease } from "@/shared/lib/motion/tokens";

type AddToCartButtonProps = {
  variantId: string;
  imageAssetId: string;
  quantity?: number;
  available: boolean;
};

export function AddToCartButton({
  variantId,
  imageAssetId,
  quantity = 1,
  available,
}: AddToCartButtonProps) {
  const { addToCart, openCart } = useCart();
  const [added, setAdded] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const flyRef = useRef<HTMLDivElement>(null);
  const reduceMotionRef = useRef(false);
  const image = getAsset(imageAssetId);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_REDUCED, () => {
        reduceMotionRef.current = true;
      });

      mm.add(MOTION_DESKTOP, () => {
        reduceMotionRef.current = false;
      });

      mm.add(MOTION_MOBILE, () => {
        reduceMotionRef.current = false;
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  const flyToCart = () => {
    const source = flyRef.current;
    const target = document.querySelector<HTMLElement>("[data-cart-icon]");
    const count = document.querySelector<HTMLElement>("[data-cart-count]");

    if (!source || !target || reduceMotionRef.current) {
      return;
    }

    const clone = source.cloneNode(true) as HTMLElement;
    const sourceRect = source.getBoundingClientRect();

    clone.setAttribute("aria-hidden", "true");
    clone.style.position = "fixed";
    clone.style.left = `${sourceRect.left}px`;
    clone.style.top = `${sourceRect.top}px`;
    clone.style.width = `${sourceRect.width}px`;
    clone.style.height = `${sourceRect.height}px`;
    clone.style.zIndex = "80";
    clone.style.pointerEvents = "none";
    clone.style.margin = "0";
    clone.style.opacity = "1";
    document.body.appendChild(clone);

    const state = Flip.getState(clone);
    const targetRect = target.getBoundingClientRect();
    const size = 24;

    gsap.set(clone, {
      left: targetRect.left + targetRect.width / 2 - size / 2,
      top: targetRect.top + targetRect.height / 2 - size / 2,
      width: size,
      height: size,
      borderRadius: 999,
    });

    Flip.from(state, {
      duration: dur.base,
      ease: ease.inOut,
      absolute: true,
      scale: true,
      onComplete: () => {
        clone.remove();
      },
    });

    if (count) {
      gsap.fromTo(
        count,
        { scale: 1 },
        {
          scale: 1.18,
          duration: dur.micro,
          yoyo: true,
          repeat: 1,
          ease: ease.out,
        },
      );
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <div
        ref={flyRef}
        data-anim="fly-thumb"
        className="pointer-events-none absolute top-1/2 left-4 size-8 -translate-y-1/2 overflow-hidden rounded-full opacity-0"
      >
        <Image
          src={image.src}
          alt=""
          width={48}
          height={48}
          className="size-full object-cover"
        />
      </div>
      <Button
        className="w-full"
        disabled={!available}
        aria-disabled={!available}
        onClick={() => {
          if (!available) {
            return;
          }

          const ok = addToCart(variantId, quantity);

          if (!ok) {
            openCart();
            return;
          }

          setAdded(true);
          flyToCart();
          openCart();
          window.setTimeout(() => setAdded(false), 1600);
        }}
      >
        {!available
          ? site.microcopy.outOfStock
          : added
            ? site.microcopy.added
            : site.microcopy.addToCart}
      </Button>
    </div>
  );
}
