"use client";

import Image from "next/image";
import { useRef } from "react";
import { getAsset } from "@/shared/lib/assets";
import { gsap, useGSAP } from "@/shared/lib/motion/gsap";
import {
  MOTION_DESKTOP,
  MOTION_MOBILE,
  MOTION_REDUCED,
} from "@/shared/lib/motion/media";
import { dur, ease } from "@/shared/lib/motion/tokens";

type OrderSnapshotProps = {
  assetId: string;
  fallbackAlt: string;
};

export function OrderSnapshot({ assetId, fallbackAlt }: OrderSnapshotProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const asset = getAsset(assetId);

  useGSAP(
    () => {
      const overlay = rootRef.current?.querySelector(
        '[data-anim="order-overlay"]',
      );

      if (!overlay) {
        return;
      }

      const mm = gsap.matchMedia();
      const fade = (duration: number) =>
        gsap.fromTo(
          overlay,
          { opacity: 1 },
          { opacity: 0, duration, ease: ease.out },
        );

      mm.add(MOTION_DESKTOP, () => fade(dur.reveal));
      mm.add(MOTION_MOBILE, () => fade(dur.base));
      mm.add(MOTION_REDUCED, () => gsap.set(overlay, { opacity: 0 }));

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="mx-auto max-w-sm">
      <div className="instant-frame relative overflow-hidden">
        <Image
          src={asset.src}
          alt={asset.alt || fallbackAlt}
          width={asset.width}
          height={asset.height}
          sizes="24rem"
          className="h-auto w-full"
        />
        <div
          data-anim="order-overlay"
          className="absolute inset-0 bg-paper-2"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
