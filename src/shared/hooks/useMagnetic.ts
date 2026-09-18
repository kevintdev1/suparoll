"use client";

import { type MouseEvent, useRef } from "react";
import { MOTION_REDUCED } from "@/shared/lib/motion/media";

const MAGNETIC_RADIUS = 80;
const MAGNETIC_MAX = 8;

export function useMagnetic(enabled: boolean) {
  const ref = useRef<HTMLElement>(null);

  const onMouseMove = (event: MouseEvent<HTMLElement>) => {
    if (!enabled) {
      return;
    }

    const reduced = window.matchMedia(MOTION_REDUCED).matches;
    const coarse = window.matchMedia("(hover: none)").matches;

    if (reduced || coarse) {
      return;
    }

    const node = ref.current;

    if (!node) {
      return;
    }

    const rect = node.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = event.clientX - centerX;
    const dy = event.clientY - centerY;
    const distance = Math.hypot(dx, dy);

    if (distance > MAGNETIC_RADIUS) {
      node.style.transform = "";
      return;
    }

    const pull = 1 - distance / MAGNETIC_RADIUS;
    const x = (dx / distance || 0) * MAGNETIC_MAX * pull;
    const y = (dy / distance || 0) * MAGNETIC_MAX * pull;

    node.style.transform = `translate(${x}px, ${y}px)`;
  };

  const onMouseLeave = () => {
    const node = ref.current;

    if (node) {
      node.style.transform = "";
    }
  };

  return { ref, onMouseMove, onMouseLeave };
}
