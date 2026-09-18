"use client";

import { useRef } from "react";
import { getDebugMotion } from "@/shared/lib/motion/debug";
import { gsap, useGSAP } from "@/shared/lib/motion/gsap";
import {
  MOTION_DESKTOP,
  MOTION_MOBILE,
  MOTION_REDUCED,
} from "@/shared/lib/motion/media";
import { ease, scrub } from "@/shared/lib/motion/tokens";

export function GalleryCover() {
  const markerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const marker = markerRef.current;
      const section = marker?.closest("section");

      if (!marker || !section) {
        return;
      }

      const innerEl = section.querySelector('[data-anim="gallery-inner"]');
      const scrimEl = section.querySelector('[data-anim="gallery-scrim"]');

      if (!innerEl || !scrimEl) {
        return;
      }

      const mm = gsap.matchMedia();

      mm.add(MOTION_DESKTOP, () => {
        gsap.set(innerEl, { transformOrigin: "center center" });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "bottom bottom",
            end: "+=100%",
            pin: true,
            pinSpacing: false,
            scrub: scrub.scene,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            markers: getDebugMotion(),
          },
        });

        tl.to(
          innerEl,
          {
            scale: 0.94,
            borderRadius: 24,
            ease: ease.scrub,
          },
          0,
        );

        tl.to(
          scrimEl,
          {
            opacity: 1,
            ease: ease.scrub,
          },
          0,
        );

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      mm.add(MOTION_MOBILE, () => {
        gsap.set(innerEl, { transformOrigin: "center center" });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "bottom bottom",
            end: "+=50%",
            scrub: scrub.scene,
            markers: getDebugMotion(),
          },
        });

        tl.to(
          innerEl,
          {
            scale: 0.96,
            borderRadius: 16,
            ease: ease.scrub,
          },
          0,
        );

        tl.to(
          scrimEl,
          {
            opacity: 1,
            ease: ease.scrub,
          },
          0,
        );

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      mm.add(MOTION_REDUCED, () => {
        return () => {};
      });

      return () => {
        mm.revert();
      };
    },
    { scope: markerRef },
  );

  return <div ref={markerRef} className="sr-only" aria-hidden="true" />;
}
