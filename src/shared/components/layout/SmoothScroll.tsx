"use client";

import Lenis from "lenis";
import { type ReactNode, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/shared/lib/motion/gsap";
import { registerScroller } from "@/shared/lib/motion/scroll-lock";
import { registerLenis } from "@/shared/lib/motion/scroller";

type SmoothScrollProps = {
  children: ReactNode;
};

export function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    const lenis = new Lenis({ autoRaf: false });

    lenis.on("scroll", ScrollTrigger.update);
    registerLenis(lenis);
    registerScroller(lenis);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      registerLenis(null);
      registerScroller(null);
      lenis.destroy();
    };
  }, []);

  return children;
}
