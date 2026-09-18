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

export function CtaFinalExit() {
  const markerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const marker = markerRef.current;
      const section = marker?.closest("section");
      const footer = document.querySelector("footer");

      if (!marker || !section || !footer) {
        return;
      }

      const wordmarkEl = footer.querySelector('[data-anim="footer-wordmark"]');

      const mm = gsap.matchMedia();

      mm.add(MOTION_DESKTOP, () => {
        if (wordmarkEl) {
          gsap.set(wordmarkEl, { yPercent: 30 });
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "bottom bottom",
            end: "+=100%",
            scrub: scrub.scene,
            markers: getDebugMotion(),
          },
        });

        if (wordmarkEl) {
          tl.to(
            wordmarkEl,
            {
              yPercent: 0,
              ease: ease.scrub,
            },
            0,
          );
        }

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      mm.add(MOTION_MOBILE, () => {
        const footerHeight = footer.offsetHeight;
        const viewportHeight = window.innerHeight;

        if (footerHeight > viewportHeight * 0.9) {
          return () => {};
        }

        if (wordmarkEl) {
          gsap.set(wordmarkEl, { yPercent: 20 });
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "bottom bottom",
            end: "+=50%",
            scrub: scrub.scene,
            markers: getDebugMotion(),
          },
        });

        if (wordmarkEl) {
          tl.to(
            wordmarkEl,
            {
              yPercent: 0,
              ease: ease.scrub,
            },
            0,
          );
        }

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
