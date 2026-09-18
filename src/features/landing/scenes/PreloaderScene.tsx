"use client";

import { useEffect, useRef, useState } from "react";
import { homeContent } from "@/content/home";
import { gsap, useGSAP } from "@/shared/lib/motion/gsap";
import { MOTION_REDUCED } from "@/shared/lib/motion/media";
import {
  dispatchPreloaderComplete,
  hasSeenPreloader,
  markPreloaderSeen,
} from "@/shared/lib/motion/preloader";
import { trackPreloaderProgress } from "@/shared/lib/motion/preloader-progress";
import { lockScroll, unlockScroll } from "@/shared/lib/motion/scroll-lock";
import { dur, ease } from "@/shared/lib/motion/tokens";

const MIN_VISIBLE_MS = 800;

function formatCounter(value: number): string {
  return String(Math.min(100, Math.max(0, value))).padStart(3, "0");
}

export function PreloaderScene() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    setVisible(!hasSeenPreloader());
  }, []);

  useGSAP(
    () => {
      if (!visible) {
        return;
      }

      const root = rootRef.current;

      if (!root) {
        return;
      }

      lockScroll();

      const counterEl = root.querySelector<HTMLElement>(
        '[data-preloader="counter"]',
      );
      const curtainEl = root.querySelector<HTMLElement>(
        '[data-preloader="curtain"]',
      );
      const startTime = performance.now();
      let progress = 0;
      let exitStarted = false;

      const finish = () => {
        markPreloaderSeen();
        dispatchPreloaderComplete();
        unlockScroll();
        setVisible(false);
      };

      const tryExit = async () => {
        if (exitStarted || progress < 100) {
          return;
        }

        exitStarted = true;

        const elapsed = performance.now() - startTime;
        const remaining = MIN_VISIBLE_MS - elapsed;

        if (remaining > 0) {
          await new Promise((resolve) => setTimeout(resolve, remaining));
        }

        const reduced = window.matchMedia(MOTION_REDUCED).matches;

        if (reduced) {
          gsap.to(root, {
            autoAlpha: 0,
            duration: dur.micro,
            onComplete: finish,
          });
          return;
        }

        if (curtainEl) {
          gsap.to(curtainEl, {
            clipPath: "inset(0 0 100% 0)",
            duration: dur.page,
            ease: ease.reveal,
            onComplete: finish,
          });
          return;
        }

        finish();
      };

      const stopTracking = trackPreloaderProgress((pct) => {
        progress = pct;
        setCounter(pct);

        if (counterEl) {
          counterEl.textContent = formatCounter(pct);
        }

        if (pct >= 100) {
          void tryExit();
        }
      });

      return () => {
        stopTracking();
        unlockScroll();
      };
    },
    { scope: rootRef, dependencies: [visible] },
  );

  if (!visible) {
    return null;
  }

  return (
    <div
      ref={rootRef}
      data-preloader="root"
      aria-hidden="true"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-paper"
    >
      <div
        data-preloader="curtain"
        className="absolute inset-0 flex flex-col items-center justify-center bg-paper"
        style={{ clipPath: "inset(0 0 0 0)" }}
      >
        <p className="font-display text-h3 tracking-tight text-ink">
          {homeContent.preloader.wordmark}
        </p>
        <p
          data-preloader="counter"
          className="absolute right-[clamp(16px,3vw,40px)] bottom-[clamp(16px,3vw,40px)] font-mono text-label tabular-nums text-ink-2"
        >
          {formatCounter(counter)}
        </p>
      </div>
    </div>
  );
}
