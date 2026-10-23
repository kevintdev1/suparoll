"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/shared/lib/motion/gsap";
import {
  MOTION_DESKTOP,
  MOTION_MOBILE,
  MOTION_REDUCED,
} from "@/shared/lib/motion/media";
import { dur, ease } from "@/shared/lib/motion/tokens";

const REVEAL_OPACITY = 0.55;

export function NotFoundReveal() {
  const rootRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const reveal = revealRef.current;

      if (!root || !reveal) {
        return;
      }

      const mm = gsap.matchMedia();

      mm.add(MOTION_REDUCED, () => {
        gsap.set(reveal, { opacity: 0.35, "--r": 150 });
      });

      mm.add(MOTION_MOBILE, () => {
        gsap.fromTo(
          reveal,
          { opacity: 0, "--r": 0 },
          {
            opacity: REVEAL_OPACITY,
            "--r": 28,
            duration: dur.reveal,
            ease: ease.reveal,
          },
        );
      });

      mm.add(MOTION_DESKTOP, () => {
        gsap.set(reveal, { opacity: 0, "--x": 50, "--y": 50 });

        const moveX = gsap.quickTo(reveal, "--x", {
          duration: dur.micro,
          ease: ease.out,
        });
        const moveY = gsap.quickTo(reveal, "--y", {
          duration: dur.micro,
          ease: ease.out,
        });
        let rect = root.getBoundingClientRect();

        const onEnter = () => {
          rect = root.getBoundingClientRect();
          gsap.to(reveal, {
            opacity: REVEAL_OPACITY,
            duration: dur.micro,
            ease: ease.out,
          });
        };

        const onLeave = () => {
          gsap.to(reveal, { opacity: 0, duration: dur.base, ease: ease.out });
        };

        const onMove = (event: PointerEvent) => {
          moveX(((event.clientX - rect.left) / rect.width) * 100);
          moveY(((event.clientY - rect.top) / rect.height) * 100);
        };

        root.addEventListener("pointerenter", onEnter);
        root.addEventListener("pointerleave", onLeave);
        root.addEventListener("pointermove", onMove);

        return () => {
          root.removeEventListener("pointerenter", onEnter);
          root.removeEventListener("pointerleave", onLeave);
          root.removeEventListener("pointermove", onMove);
        };
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="instant-frame relative aspect-4/5 w-[min(320px,80vw)] overflow-hidden"
    >
      <div className="absolute inset-0 bg-paper-2" />
      <div
        ref={revealRef}
        className="absolute inset-0 bg-linear-145 from-ink-2/50 via-paper-2 to-ink-2/80 opacity-0 [clip-path:circle(calc(var(--r,28)*1%)_at_calc(var(--x,50)*1%)_calc(var(--y,50)*1%))]"
      />
    </div>
  );
}
