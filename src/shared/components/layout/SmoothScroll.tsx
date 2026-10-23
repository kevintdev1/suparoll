"use client";

import Lenis from "lenis";
import { type ReactNode, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/shared/lib/motion/gsap";
import { refreshOnLayoutChange } from "@/shared/lib/motion/layout-refresh";
import { MOTION_REDUCED } from "@/shared/lib/motion/media";
import { registerScroller } from "@/shared/lib/motion/scroll-lock";
import { registerLenis } from "@/shared/lib/motion/scroller";

type SmoothScrollProps = {
  children: ReactNode;
};

function createLenis(): () => void {
  const lenis = new Lenis({ autoRaf: false, syncTouch: true });
  const raf = (time: number) => lenis.raf(time * 1000);
  const resize = () => lenis.resize();

  lenis.on("scroll", ScrollTrigger.update);
  ScrollTrigger.addEventListener("refresh", resize);
  registerLenis(lenis);
  registerScroller(lenis);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(raf);
    ScrollTrigger.removeEventListener("refresh", resize);
    registerLenis(null);
    registerScroller(null);
    lenis.destroy();
  };
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => refreshOnLayoutChange(document.body), []);

  useEffect(() => {
    if (window.matchMedia(MOTION_REDUCED).matches) {
      return;
    }

    return createLenis();
  }, []);

  return children;
}
