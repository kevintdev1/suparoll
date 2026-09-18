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
};

export function OrderSnapshot({ assetId }: OrderSnapshotProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const asset = getAsset(assetId);

  useGSAP(
    () => {
      const overlay = rootRef.current?.querySelector<HTMLElement>(
        '[data-anim="order-overlay"]',
      );

      if (!overlay) {
        return;
      }

      const mm = gsap.matchMedia();

      mm.add(MOTION_DESKTOP, () => {
        gsap.fromTo(
          overlay,
          { opacity: 1 },
          { opacity: 0, duration: dur.reveal, ease: ease.out },
        );
      });

      mm.add(MOTION_MOBILE, () => {
        gsap.fromTo(
          overlay,
          { opacity: 1 },
          { opacity: 0, duration: dur.base, ease: ease.out },
        );
      });

      mm.add(MOTION_REDUCED, () => {
        gsap.set(overlay, { opacity: 0 });
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="mx-auto w-full max-w-sm">
      <div className="instant-frame relative overflow-hidden">
        <Image
          src={asset.src}
          alt={asset.alt || "Instantánea del pedido"}
          width={asset.width}
          height={asset.height}
          className="h-auto w-full"
        />
        <div
          data-anim="order-overlay"
          className="absolute inset-0 bg-[#c9c6bf]"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
