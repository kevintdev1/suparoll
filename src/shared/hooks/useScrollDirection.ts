"use client";

import { useEffect, useState } from "react";

export type ScrollDirection = "up" | "down";

export function useScrollDirection(threshold = 8): ScrollDirection {
  const [direction, setDirection] = useState<ScrollDirection>("up");

  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY;

      if (Math.abs(delta) < threshold) {
        return;
      }

      lastY = y;
      setDirection(delta > 0 ? "down" : "up");
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return direction;
}
