"use client";

import Image from "next/image";
import { useRef } from "react";
import { getDebugMotion } from "@/shared/lib/motion/debug";
import { gsap, useGSAP } from "@/shared/lib/motion/gsap";
import { MOTION_OK, MOTION_REDUCED } from "@/shared/lib/motion/media";
import { dur, ease } from "@/shared/lib/motion/tokens";

type RevealImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  preload?: boolean;
  className?: string;
  trigger?: "scroll" | "mount";
  scrollStart?: string;
};

export function RevealImage({
  src,
  alt,
  width,
  height,
  sizes,
  preload = false,
  className,
  trigger = "scroll",
  scrollStart = "top 80%",
}: RevealImageProps) {
  const scopeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scopeEl = scopeRef.current;

      if (!scopeEl) {
        return;
      }

      const clipEl = scopeEl.querySelector<HTMLElement>(
        '[data-anim="reveal-clip"]',
      );
      const innerEl = scopeEl.querySelector<HTMLElement>(
        '[data-anim="reveal-inner"]',
      );

      if (!clipEl || !innerEl) {
        return;
      }

      const revealContent = () => {
        scopeEl.style.visibility = "visible";
        scopeEl.setAttribute("data-revealed", "");
        gsap.set(clipEl, { clipPath: "inset(0 0 0 0)" });
        gsap.set(innerEl, { scale: 1 });
      };

      const animateReveal = () => {
        scopeEl.style.visibility = "visible";
        scopeEl.setAttribute("data-revealed", "");
        gsap.set(clipEl, { clipPath: "inset(100% 0 0 0)" });
        gsap.set(innerEl, { scale: 1.2, transformOrigin: "center center" });

        const clipVars = {
          clipPath: "inset(0 0 0 0)",
          duration: dur.reveal,
          ease: ease.reveal,
        };

        const innerVars = {
          scale: 1,
          duration: dur.reveal,
          ease: ease.reveal,
        };

        if (trigger === "mount") {
          return gsap
            .timeline()
            .to(clipEl, clipVars)
            .to(innerEl, innerVars, "<");
        }

        return gsap
          .timeline({
            scrollTrigger: {
              trigger: scopeEl,
              start: scrollStart,
              once: true,
              markers: getDebugMotion(),
            },
          })
          .to(clipEl, clipVars)
          .to(innerEl, innerVars, "<");
      };

      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const tween = animateReveal();

        return () => {
          tween.kill();
        };
      });

      mm.add(MOTION_REDUCED, revealContent);

      return () => {
        mm.revert();
      };
    },
    { scope: scopeRef, dependencies: [trigger, scrollStart, src] },
  );

  return (
    <div
      ref={scopeRef}
      data-reveal
      data-anim="reveal-image"
      className={className}
    >
      <div data-anim="reveal-clip" className="overflow-hidden">
        <div data-anim="reveal-inner">
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes={sizes}
            preload={preload}
            className="size-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
