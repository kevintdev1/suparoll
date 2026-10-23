"use client";

import { type ComponentPropsWithoutRef, useRef } from "react";
import { getDebugMotion } from "@/shared/lib/motion/debug";
import { gsap, useGSAP } from "@/shared/lib/motion/gsap";
import { MEDIA_DESKTOP, MOTION_OK } from "@/shared/lib/motion/media";
import { ease, scrub } from "@/shared/lib/motion/tokens";

type CtaFinalExitProps = ComponentPropsWithoutRef<"section"> & {
  footerId: string;
};

export function CtaFinalExit({
  footerId,
  children,
  ...props
}: CtaFinalExitProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const footer = document.getElementById(footerId);
      const wordmark = footer?.querySelector('[data-anim="footer-wordmark"]');

      if (!section || !footer || !wordmark) {
        return;
      }

      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          wordmark,
          {
            yPercent: () =>
              window.matchMedia(MEDIA_DESKTOP).matches ? 30 : 20,
          },
          {
            yPercent: 0,
            ease: ease.scrub,
            scrollTrigger: {
              trigger: section,
              start: "bottom bottom",
              end: () => `+=${footer.offsetHeight}`,
              scrub: scrub.scene,
              invalidateOnRefresh: true,
              markers: getDebugMotion(),
            },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [footerId] },
  );

  return (
    <section ref={sectionRef} {...props}>
      {children}
    </section>
  );
}
