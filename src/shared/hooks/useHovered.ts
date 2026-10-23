"use client";

import { type RefObject, useEffect, useState } from "react";

export function useHovered(ref: RefObject<HTMLElement | null>): boolean {
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return;
    }

    const onEnter = () => setHovered(true);
    const onLeave = () => setHovered(false);

    node.addEventListener("pointerenter", onEnter);
    node.addEventListener("pointerleave", onLeave);

    return () => {
      node.removeEventListener("pointerenter", onEnter);
      node.removeEventListener("pointerleave", onLeave);
    };
  }, [ref]);

  return hovered;
}
