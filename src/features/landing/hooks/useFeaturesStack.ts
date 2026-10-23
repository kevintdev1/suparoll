"use client";

import type { RefObject } from "react";
import {
  FEATURE_SCRIM_OPACITY,
  featureCardScale,
  featureCardTop,
} from "@/features/landing/lib/features-stack";
import { getDebugMotion } from "@/shared/lib/motion/debug";
import { gsap, useGSAP } from "@/shared/lib/motion/gsap";
import { MOTION_DESKTOP, MOTION_MOBILE } from "@/shared/lib/motion/media";
import { dur, ease, scrub, stagger } from "@/shared/lib/motion/tokens";

export function useFeaturesStack(
  rootRef: RefObject<HTMLElement | null>,
  cardCount: number,
) {
  useGSAP(
    () => {
      const root = rootRef.current;

      if (!root) {
        return;
      }

      const cards = gsap.utils.toArray<HTMLElement>(
        '[data-anim="feature-card"]',
        root,
      );

      if (cards.length === 0) {
        return;
      }

      const markers = getDebugMotion();
      const mm = gsap.matchMedia();

      mm.add(MOTION_DESKTOP, () => {
        cards.forEach((card, index) => {
          const nextCard = cards[index + 1];
          const face = card.querySelector('[data-anim="feature-face"]');
          const scrim = card.querySelector('[data-anim="feature-scrim"]');

          if (!nextCard || !face) {
            return;
          }

          const timeline = gsap.timeline({
            defaults: { ease: ease.scrub },
            scrollTrigger: {
              trigger: nextCard,
              start: "top bottom",
              end: `top ${featureCardTop(index + 1)}px`,
              scrub: scrub.scene,
              markers,
            },
          });

          timeline.fromTo(
            face,
            { scale: 1, transformOrigin: "center top" },
            { scale: featureCardScale(index, cards.length) },
            0,
          );

          if (scrim) {
            timeline.fromTo(
              scrim,
              { opacity: 0 },
              { opacity: FEATURE_SCRIM_OPACITY },
              0,
            );
          }
        });
      });

      mm.add(MOTION_MOBILE, () => {
        gsap.from(cards, {
          opacity: 0,
          y: 24,
          scale: 0.95,
          duration: dur.reveal,
          ease: ease.reveal,
          stagger: stagger.items,
          scrollTrigger: {
            trigger: root,
            start: "top 80%",
            once: true,
            markers,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [cardCount] },
  );
}
