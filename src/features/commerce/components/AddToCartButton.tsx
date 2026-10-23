"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { commerceContent } from "@/content/commerce";
import { useCart } from "@/features/commerce/hooks/useCart";
import { Button } from "@/shared/components/ui/Button";
import { getAsset } from "@/shared/lib/assets";
import { Flip, gsap } from "@/shared/lib/motion/gsap";
import { MOTION_REDUCED } from "@/shared/lib/motion/media";
import { dur, ease } from "@/shared/lib/motion/tokens";

const ADDED_FEEDBACK_MS = 1600;

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
  const flyRef = useRef<HTMLDivElement>(null);
  const image = getAsset(imageAssetId);
  const copy = commerceContent.product;

  useEffect(() => {
    if (!added) {
      return;
    }

    const timer = window.setTimeout(() => setAdded(false), ADDED_FEEDBACK_MS);
    return () => window.clearTimeout(timer);
  }, [added]);

  const flyToCart = () => {
    const source = flyRef.current;
    const target = document.querySelector<HTMLElement>("[data-cart-icon]");
    const count = document.querySelector<HTMLElement>("[data-cart-count]");

    if (!source || !target || window.matchMedia(MOTION_REDUCED).matches) {
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
    <div className="relative">
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
        onClick={() => {
          if (addToCart(variantId, quantity)) {
            setAdded(true);
            flyToCart();
          }

          openCart();
        }}
      >
        {!available ? copy.outOfStock : added ? copy.added : copy.addToCart}
      </Button>
    </div>
  );
}
