"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/shared/lib/motion/gsap";
import { MOTION_REDUCED } from "@/shared/lib/motion/media";

const CURSOR_LABELS: Record<string, string> = {
  view: "Ver",
  drag: "Arrastra",
  slide: "Desliza",
};

const NATIVE_CURSOR_SELECTOR =
  'input, textarea, select, button, a, [contenteditable="true"], [data-native-cursor]';

export function CustomCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const hoverCapable = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    );
    const reduced = window.matchMedia(MOTION_REDUCED);

    const updateEnabled = () => {
      setEnabled(hoverCapable.matches && !reduced.matches);
    };

    updateEnabled();
    hoverCapable.addEventListener("change", updateEnabled);
    reduced.addEventListener("change", updateEnabled);

    return () => {
      hoverCapable.removeEventListener("change", updateEnabled);
      reduced.removeEventListener("change", updateEnabled);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const root = rootRef.current;
    const labelEl = labelRef.current;

    if (!root || !labelEl) {
      return;
    }

    const xTo = gsap.quickTo(root, "x", { duration: 0.35, ease: "power3.out" });
    const yTo = gsap.quickTo(root, "y", { duration: 0.35, ease: "power3.out" });

    const setDefault = () => {
      gsap.to(root, {
        width: 12,
        height: 12,
        duration: 0.25,
        ease: "power3.out",
      });
      labelEl.textContent = "";
      gsap.to(labelEl, { autoAlpha: 0, duration: 0.15 });
    };

    const onMove = (event: MouseEvent) => {
      xTo(event.clientX);
      yTo(event.clientY);

      const target = event.target;

      if (!(target instanceof Element)) {
        setDefault();
        root.style.opacity = "1";
        return;
      }

      if (target.closest(NATIVE_CURSOR_SELECTOR)) {
        root.style.opacity = "0";
        return;
      }

      root.style.opacity = "1";

      const cursorTarget = target.closest<HTMLElement>("[data-cursor]");
      const mode = cursorTarget?.dataset.cursor ?? "default";

      if (mode === "default") {
        setDefault();
        return;
      }

      gsap.to(root, {
        width: 64,
        height: 64,
        duration: 0.25,
        ease: "power3.out",
      });
      labelEl.textContent = CURSOR_LABELS[mode] ?? "";
      gsap.to(labelEl, { autoAlpha: 1, duration: 0.15 });
    };

    window.addEventListener("mousemove", onMove);

    return () => {
      window.removeEventListener("mousemove", onMove);
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[90] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ink mix-blend-difference"
      style={{ width: 12, height: 12 }}
    >
      <span
        ref={labelRef}
        className="font-mono text-[10px] uppercase tracking-wider text-paper opacity-0"
      />
    </div>
  );
}
