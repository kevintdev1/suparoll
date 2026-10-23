"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/shared/lib/motion/gsap";
import { MEDIA_FINE_POINTER, MOTION_OK } from "@/shared/lib/motion/media";
import { dur, ease } from "@/shared/lib/motion/tokens";

const NATIVE_CURSOR_SELECTOR =
  'input, textarea, select, button, a, [contenteditable="true"], [data-native-cursor]';
const FOLLOW_DURATION = 0.35;
const EXPANDED_SCALE = 64 / 12;

type CustomCursorProps = {
  labels: Record<string, string>;
};

function resolveMode(target: EventTarget | null): string {
  if (!(target instanceof Element)) {
    return "default";
  }

  if (target.closest(NATIVE_CURSOR_SELECTOR)) {
    return "native";
  }

  return (
    target.closest<HTMLElement>("[data-cursor]")?.dataset.cursor ?? "default"
  );
}

export function CustomCursor({ labels }: CustomCursorProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(`${MEDIA_FINE_POINTER} and ${MOTION_OK}`);
    const update = () => setEnabled(query.matches);

    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const dot = dotRef.current;
    const labelEl = labelRef.current;

    if (!enabled || !root || !dot || !labelEl) {
      return;
    }

    const xTo = gsap.quickTo(root, "x", {
      duration: FOLLOW_DURATION,
      ease: ease.out,
    });
    const yTo = gsap.quickTo(root, "y", {
      duration: FOLLOW_DURATION,
      ease: ease.out,
    });
    let currentMode = "";

    const applyMode = (mode: string) => {
      currentMode = mode;
      const label = labels[mode] ?? "";

      gsap.to(root, {
        autoAlpha: mode === "native" ? 0 : 1,
        duration: dur.micro,
        overwrite: "auto",
      });
      gsap.to(dot, {
        scale: label ? EXPANDED_SCALE : 1,
        duration: dur.micro,
        ease: ease.out,
        overwrite: "auto",
      });

      if (label) {
        labelEl.textContent = label;
      }

      gsap.to(labelEl, {
        autoAlpha: label ? 1 : 0,
        duration: dur.micro,
        overwrite: "auto",
      });
    };

    const onMove = (event: MouseEvent) => {
      xTo(event.clientX);
      yTo(event.clientY);

      const mode = resolveMode(event.target);

      if (mode !== currentMode) {
        applyMode(mode);
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      gsap.killTweensOf([root, dot, labelEl]);
    };
  }, [enabled, labels]);

  if (!enabled) {
    return null;
  }

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none invisible fixed top-0 left-0 z-90 mix-blend-difference"
    >
      <span
        ref={dotRef}
        className="absolute size-3 -translate-1/2 rounded-full bg-paper"
      />
      <span
        ref={labelRef}
        className="invisible absolute -translate-1/2 font-mono-label whitespace-nowrap text-ink"
      />
    </div>
  );
}
