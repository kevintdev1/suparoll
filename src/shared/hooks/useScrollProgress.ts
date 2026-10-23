"use client";

import { type RefObject, useEffect } from "react";

export function useScrollProgress(targetRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const target = targetRef.current;

    if (!target) {
      return;
    }

    let maxScroll = 0;

    const render = () => {
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      target.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
    };

    const measure = () => {
      maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      render();
    };

    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", render, { passive: true });
    measure();

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", render);
    };
  }, [targetRef]);
}
