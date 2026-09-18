"use client";

import { useRef } from "react";
import type { FeatureCard } from "@/content/home";
import { getDebugMotion } from "@/shared/lib/motion/debug";
import { gsap, useGSAP } from "@/shared/lib/motion/gsap";
import {
  MOTION_DESKTOP,
  MOTION_MOBILE,
  MOTION_REDUCED,
} from "@/shared/lib/motion/media";
import { dur, ease, scrub, stagger } from "@/shared/lib/motion/tokens";

type FeaturesStackProps = {
  cards: FeatureCard[];
};

const CARD_OFFSET = 48;
const TOP_BASE = 80;
const SCALE_STEP = 0.04;
const BRIGHTNESS_DIM = 0.7;

export function FeaturesStack({ cards }: FeaturesStackProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;

      if (!root) {
        return;
      }

      const cardEls = root.querySelectorAll('[data-anim="feature-card"]');

      if (cardEls.length === 0) {
        return;
      }

      const mm = gsap.matchMedia();

      mm.add(MOTION_DESKTOP, () => {
        const timelines: gsap.core.Timeline[] = [];
        const totalCards = cardEls.length;

        cardEls.forEach((cardEl, index) => {
          const cardTop = TOP_BASE + index * CARD_OFFSET;
          const isLast = index === totalCards - 1;
          const faceEl = cardEl.querySelector('[data-anim="feature-face"]');
          const scrimEl = cardEl.querySelector('[data-anim="feature-scrim"]');

          if (faceEl) {
            gsap.set(faceEl, {
              transformOrigin: "center top",
              scale: 1,
              force3D: false,
            });
          }

          if (!isLast) {
            const nextCardEl = cardEls[index + 1];

            if (nextCardEl && faceEl) {
              const tl = gsap.timeline({
                scrollTrigger: {
                  trigger: nextCardEl,
                  start: `top ${cardTop + CARD_OFFSET}px`,
                  end: `top ${cardTop}px`,
                  scrub: scrub.scene,
                  markers: getDebugMotion(),
                },
              });

              const capasEncima = totalCards - index - 1;
              const targetScale = 1 - SCALE_STEP * capasEncima;

              tl.fromTo(
                faceEl,
                { scale: 1 },
                {
                  scale: targetScale,
                  ease: ease.scrub,
                  immediateRender: false,
                  force3D: false,
                },
                0,
              );

              if (scrimEl) {
                tl.fromTo(
                  scrimEl,
                  { opacity: 0 },
                  {
                    opacity: 1 - BRIGHTNESS_DIM,
                    ease: ease.scrub,
                    immediateRender: false,
                  },
                  0,
                );
              }

              timelines.push(tl);
            }
          }
        });

        return () => {
          timelines.forEach((tl) => {
            tl.scrollTrigger?.kill();
            tl.kill();
          });
        };
      });

      mm.add(MOTION_MOBILE, () => {
        gsap.set(cardEls, { opacity: 0, y: 24, scale: 0.95 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top 80%",
            once: true,
            markers: getDebugMotion(),
          },
        });

        tl.to(cardEls, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: dur.reveal,
          ease: ease.reveal,
          stagger: stagger.items,
        });

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      mm.add(MOTION_REDUCED, () => {
        gsap.set(cardEls, { opacity: 1, y: 0, scale: 1 });

        return () => {};
      });

      return () => {
        mm.revert();
      };
    },
    { scope: rootRef, dependencies: [cards] },
  );

  return (
    <div
      ref={rootRef}
      data-anim="features-track"
      className="relative pb-24 md:pb-[50vh]"
    >
      {cards.map((card, index) => (
        <article
          key={card.number}
          data-anim="feature-card"
          data-index={index}
          className="relative mb-6 md:sticky md:mb-0"
          style={{
            top: TOP_BASE + index * CARD_OFFSET,
            zIndex: index + 1,
          }}
        >
          <div
            data-anim="feature-face"
            className="relative min-h-[60vh] rounded-2xl border border-paper-2 bg-paper p-6 shadow-lg md:min-h-[70vh] md:rounded-3xl md:p-10"
          >
            <div
              data-anim="feature-scrim"
              className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] bg-ink opacity-0"
              aria-hidden="true"
            />
            <div className="relative flex h-full flex-col md:flex-row md:items-center md:gap-12">
              <div className="flex-1">
                <p className="font-mono text-label text-shutter">
                  {card.number}
                </p>
                <h3 className="mt-3 font-display text-h2 text-ink">
                  {card.title}
                </h3>
                <p className="mt-4 max-w-prose text-lead text-ink-2">
                  {card.body}
                </p>
              </div>

              {card.imageAssetId && (
                <div className="mt-8 flex-1 md:mt-0">
                  <div className="aspect-[4/3] rounded-xl bg-paper-2" />
                </div>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
