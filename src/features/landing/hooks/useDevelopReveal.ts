"use client";

import type { RefObject } from "react";
import { getDebugMotion } from "@/shared/lib/motion/debug";
import { gsap, useGSAP } from "@/shared/lib/motion/gsap";
import {
  MOTION_DESKTOP,
  MOTION_MOBILE,
  MOTION_REDUCED,
} from "@/shared/lib/motion/media";
import { dur, ease, scrub, stagger } from "@/shared/lib/motion/tokens";

const SCROLL_LENGTH = { desktop: "+=200%", mobile: "+=150%" } as const;

export function formatDevelopCounter(seconds: number): string {
  return `00:${String(seconds).padStart(2, "0")}`;
}

export function useDevelopReveal(
  rootRef: RefObject<HTMLElement | null>,
  developSeconds: number | null,
) {
  useGSAP(
    () => {
      const root = rootRef.current;
      const frame = root?.querySelector('[data-anim="develop-frame"]');

      if (!root || !frame) {
        return;
      }

      const overlay = root.querySelector('[data-anim="develop-overlay"]');
      const texts = root.querySelectorAll('[data-anim="develop-text"]');
      const counter = root.querySelector('[data-anim="develop-counter"]');
      const markers = getDebugMotion();

      const setupPinned = (end: string) => {
        let lastSecond = 0;

        const updateCounter = (progress: number) => {
          if (!counter || developSeconds === null) {
            return;
          }

          const second = Math.floor(progress * developSeconds);

          if (second !== lastSecond) {
            lastSecond = second;
            counter.textContent = formatDevelopCounter(second);
          }
        };

        gsap.set(frame, { yPercent: 60, rotation: -6 });
        gsap.set(texts, { opacity: 0, y: 20 });

        if (overlay) {
          gsap.set(overlay, { opacity: 1 });
        }

        const timeline = gsap.timeline({
          defaults: { ease: ease.scrub },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end,
            pin: true,
            scrub: scrub.scene,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            markers,
            onUpdate: (self) => updateCounter(self.progress),
          },
        });

        timeline.to(frame, { yPercent: 0, rotation: 0, duration: 0.25 }, 0);

        if (overlay) {
          timeline.to(overlay, { opacity: 0, duration: 0.6 }, 0.25);
        }

        timeline.to(
          texts,
          { opacity: 1, y: 0, stagger: stagger.lines, duration: 0.15 },
          0.85,
        );
      };

      const mm = gsap.matchMedia();

      mm.add(MOTION_DESKTOP, () => setupPinned(SCROLL_LENGTH.desktop));
      mm.add(MOTION_MOBILE, () => setupPinned(SCROLL_LENGTH.mobile));
      mm.add(MOTION_REDUCED, () => {
        if (overlay) {
          gsap.set(overlay, { opacity: 0 });
        }

        gsap.from(texts, {
          opacity: 0,
          duration: dur.base,
          ease: ease.out,
          stagger: stagger.lines,
          scrollTrigger: {
            trigger: root,
            start: "top 60%",
            once: true,
            markers,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [developSeconds] },
  );
}
