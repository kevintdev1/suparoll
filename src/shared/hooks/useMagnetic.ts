"use client";

import { type MouseEvent, useRef } from "react";
import { MEDIA_FINE_POINTER, MOTION_OK } from "@/shared/lib/motion/media";

const MAGNETIC_RADIUS = 80;
const MAGNETIC_MAX = 8;

type Center = { x: number; y: number };

export function useMagnetic<T extends HTMLElement>(enabled: boolean) {
  const ref = useRef<T>(null);
  const centerRef = useRef<Center | null>(null);

  const reset = () => {
    centerRef.current = null;

    if (ref.current) {
      ref.current.style.transform = "";
    }
  };

  const onMouseEnter = () => {
    const node = ref.current;

    if (
      !enabled ||
      !node ||
      !window.matchMedia(`${MEDIA_FINE_POINTER} and ${MOTION_OK}`).matches
    ) {
      centerRef.current = null;
      return;
    }

    node.style.transform = "";
    const rect = node.getBoundingClientRect();
    centerRef.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  };

  const onMouseMove = (event: MouseEvent<T>) => {
    const node = ref.current;
    const center = centerRef.current;

    if (!node || !center) {
      return;
    }

    const dx = event.clientX - center.x;
    const dy = event.clientY - center.y;
    const distance = Math.hypot(dx, dy);

    if (distance > MAGNETIC_RADIUS) {
      node.style.transform = "";
      return;
    }

    const pull = (1 - distance / MAGNETIC_RADIUS) * MAGNETIC_MAX;
    const x = (dx / distance || 0) * pull;
    const y = (dy / distance || 0) * pull;

    node.style.transform = `translate(${x}px, ${y}px)`;
  };

  return { ref, onMouseEnter, onMouseMove, onMouseLeave: reset };
}
