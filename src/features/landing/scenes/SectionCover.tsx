"use client";

import { type ComponentPropsWithoutRef, useRef } from "react";
import { getDebugMotion } from "@/shared/lib/motion/debug";
import { gsap, useGSAP } from "@/shared/lib/motion/gsap";
import { MOTION_DESKTOP, MOTION_MOBILE } from "@/shared/lib/motion/media";
import { ease, scrub } from "@/shared/lib/motion/tokens";

export type CoverStep = {
  scale: number;
  scrim: number;
  end: string;
  pin?: boolean;
};

type SectionCoverProps = ComponentPropsWithoutRef<"section"> & {
  desktop: CoverStep;
  mobile: CoverStep;
};

const INERT_PROGRESS = 0.9;

function setupCover(section: HTMLElement, step: CoverStep) {
  const inner = section.querySelector('[data-anim="cover-inner"]');
  const scrim = section.querySelector('[data-anim="cover-scrim"]');

  if (!inner || !scrim) {
    return;
  }

  let covered = false;

  const setCovered = (next: boolean) => {
    if (next === covered) {
      return;
    }

    covered = next;
    section.toggleAttribute("inert", next);
  };

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "bottom bottom",
      end: step.end,
      pin: step.pin ?? false,
      pinSpacing: false,
      anticipatePin: step.pin ? 1 : 0,
      scrub: scrub.scene,
      invalidateOnRefresh: true,
      markers: getDebugMotion(),
      onUpdate: step.pin
        ? (self) => setCovered(self.progress >= INERT_PROGRESS)
        : undefined,
    },
  });

  tl.to(inner, { scale: step.scale, ease: ease.scrub }, 0);
  tl.to(scrim, { opacity: step.scrim, ease: ease.scrub }, 0);

  return () => {
    setCovered(false);
  };
}

export function SectionCover({
  desktop,
  mobile,
  className = "",
  children,
  ...props
}: SectionCoverProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;

      if (!section) {
        return;
      }

      const mm = gsap.matchMedia();

      mm.add(MOTION_DESKTOP, () => setupCover(section, desktop));
      mm.add(MOTION_MOBILE, () => setupCover(section, mobile));

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className={`relative ${className}`} {...props}>
      {children}
      <div
        data-anim="cover-scrim"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-ink opacity-0"
      />
    </section>
  );
}
