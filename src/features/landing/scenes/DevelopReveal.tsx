"use client";

import Image from "next/image";
import { useRef } from "react";
import { getAsset } from "@/shared/lib/assets";
import { getDebugMotion } from "@/shared/lib/motion/debug";
import { gsap, useGSAP } from "@/shared/lib/motion/gsap";
import {
  MOTION_DESKTOP,
  MOTION_MOBILE,
  MOTION_REDUCED,
} from "@/shared/lib/motion/media";
import { dur, ease, scrub, stagger } from "@/shared/lib/motion/tokens";

type DevelopRevealProps = {
  title: string;
  body: string;
  snapshotAssetId: string | null;
  developTime: string | null;
};

export function DevelopReveal({
  title,
  body,
  snapshotAssetId,
  developTime,
}: DevelopRevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  const snapshotSrc = snapshotAssetId
    ? getAsset(snapshotAssetId)?.src
    : undefined;

  useGSAP(
    () => {
      const root = rootRef.current;
      const section = root?.closest("section");

      if (!root || !section) {
        return;
      }

      const stageEl = root.querySelector('[data-anim="develop-stage"]');
      const frameEl = root.querySelector('[data-anim="develop-frame"]');
      const overlayEl = root.querySelector('[data-anim="develop-overlay"]');
      const textEls = root.querySelectorAll('[data-anim="develop-text"]');
      const counterEl = root.querySelector('[data-anim="develop-counter"]');

      if (!stageEl || !frameEl) {
        return;
      }

      const mm = gsap.matchMedia();

      const setupDesktop = (scrollEnd: string) => {
        gsap.set(frameEl, {
          yPercent: 60,
          rotation: -6,
          transformOrigin: "center center",
        });

        if (overlayEl) {
          gsap.set(overlayEl, { opacity: 1 });
        }

        gsap.set(textEls, { opacity: 0, y: 20 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: scrollEnd,
            pin: true,
            pinSpacing: true,
            scrub: scrub.scene,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            markers: getDebugMotion(),
            onUpdate: (self) => {
              if (counterEl && developTime) {
                const maxTime = parseInt(developTime, 10) || 15;
                const currentTime = Math.floor(self.progress * maxTime);
                const formatted = String(currentTime).padStart(2, "0");
                counterEl.textContent = `00:${formatted}`;
              }
            },
          },
        });

        tl.to(
          frameEl,
          {
            yPercent: 0,
            rotation: 0,
            ease: ease.scrub,
            duration: 0.25,
          },
          0,
        );

        if (overlayEl) {
          tl.to(
            overlayEl,
            {
              opacity: 0,
              ease: ease.scrub,
              duration: 0.6,
            },
            0.25,
          );
        }

        tl.to(
          textEls,
          {
            opacity: 1,
            y: 0,
            ease: ease.scrub,
            stagger: stagger.lines,
            duration: 0.15,
          },
          0.85,
        );

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      };

      mm.add(MOTION_DESKTOP, () => {
        return setupDesktop("+=200%");
      });

      mm.add(MOTION_MOBILE, () => {
        return setupDesktop("+=150%");
      });

      mm.add(MOTION_REDUCED, () => {
        gsap.set(frameEl, { yPercent: 0, rotation: 0 });
        gsap.set(textEls, { opacity: 0 });

        if (overlayEl) {
          gsap.set(overlayEl, { opacity: 0 });
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 60%",
            once: true,
            markers: getDebugMotion(),
          },
        });

        tl.to(textEls, {
          opacity: 1,
          duration: dur.base,
          ease: ease.out,
          stagger: stagger.lines,
        });

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      return () => {
        mm.revert();
      };
    },
    { scope: rootRef, dependencies: [snapshotAssetId, developTime] },
  );

  return (
    <div ref={rootRef} className="relative">
      <div
        data-anim="develop-stage"
        className="flex min-h-svh flex-col items-center justify-center overflow-visible px-4 py-24"
      >
        <div
          data-anim="develop-frame"
          className="relative aspect-[3/4] w-full max-w-sm overflow-hidden rounded-sm bg-frame p-3 shadow-2xl md:max-w-md md:p-4"
        >
          <div className="relative h-full w-full overflow-hidden bg-ink">
            {snapshotSrc ? (
              <Image
                src={snapshotSrc}
                alt="Foto instantánea revelándose"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 90vw, 448px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-paper-2">
                <span className="text-small text-ink-2">
                  [[PENDIENTE: imagen de instantánea]]
                </span>
              </div>
            )}

            <div
              data-anim="develop-overlay"
              className="absolute inset-0 bg-gradient-to-b from-paper/90 via-paper/70 to-paper/90"
              aria-hidden="true"
            />
          </div>
        </div>

        <div className="mt-12 max-w-lg text-center">
          {developTime && (
            <p
              data-anim="develop-counter"
              className="font-mono text-label tracking-wider text-paper/70"
              aria-live="polite"
            >
              00:00
            </p>
          )}

          <h3
            data-anim="develop-text"
            className="mt-4 font-display text-h3 text-paper"
          >
            {title}
          </h3>

          <p data-anim="develop-text" className="mt-4 text-lead text-paper/80">
            {body}
          </p>
        </div>
      </div>
    </div>
  );
}
