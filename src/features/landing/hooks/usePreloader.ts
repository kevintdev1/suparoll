"use client";

import { type RefObject, useState, useSyncExternalStore } from "react";
import {
  type PreloaderAssets,
  trackPreloaderProgress,
} from "@/features/landing/lib/preloader-progress";
import { gsap, useGSAP } from "@/shared/lib/motion/gsap";
import { MOTION_REDUCED } from "@/shared/lib/motion/media";
import {
  dispatchPreloaderComplete,
  hasSeenPreloader,
  markPreloaderSeen,
} from "@/shared/lib/motion/preloader";
import { lockScroll } from "@/shared/lib/motion/scroll-lock";
import { dur, ease } from "@/shared/lib/motion/tokens";

const MIN_VISIBLE_MS = 800;
const MAX_WAIT_MS = 4000;

const subscribeToSession = () => () => {};

export function formatPreloaderCounter(value: number): string {
  return String(Math.min(100, Math.max(0, value))).padStart(3, "0");
}

export function usePreloader(
  rootRef: RefObject<HTMLElement | null>,
  assets: PreloaderAssets,
): boolean {
  const pending = useSyncExternalStore(
    subscribeToSession,
    () => !hasSeenPreloader(),
    () => true,
  );
  const [done, setDone] = useState(false);
  const active = pending && !done;

  useGSAP(
    () => {
      const root = rootRef.current;

      if (!active || !root || hasSeenPreloader()) {
        return;
      }

      const counter = root.querySelector<HTMLElement>(
        '[data-preloader="counter"]',
      );
      const curtain = root.querySelector<HTMLElement>(
        '[data-preloader="curtain"]',
      );
      const releaseScroll = lockScroll();
      const startTime = performance.now();
      let lastPct = 0;
      let exiting = false;
      let stopTracking = () => {};

      const writeCounter = (pct: number) => {
        if (pct === lastPct || !counter) {
          return;
        }

        lastPct = pct;
        counter.textContent = formatPreloaderCounter(pct);
      };

      const finish = () => {
        releaseScroll();
        setDone(true);
      };

      const playExit = () => {
        markPreloaderSeen();
        dispatchPreloaderComplete();

        if (window.matchMedia(MOTION_REDUCED).matches || !curtain) {
          gsap.to(root, {
            autoAlpha: 0,
            duration: dur.micro,
            onComplete: finish,
          });
          return;
        }

        gsap.fromTo(
          curtain,
          { clipPath: "inset(0% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 100% 0%)",
            duration: dur.page,
            ease: ease.reveal,
            onComplete: finish,
          },
        );
      };

      const exit = () => {
        if (exiting) {
          return;
        }

        exiting = true;
        window.clearTimeout(timeout);
        stopTracking();
        writeCounter(100);

        const remaining = MIN_VISIBLE_MS - (performance.now() - startTime);

        gsap.delayedCall(Math.max(0, remaining) / 1000, playExit);
      };

      const timeout = window.setTimeout(exit, MAX_WAIT_MS);

      stopTracking = trackPreloaderProgress(assets, (pct) => {
        writeCounter(pct);

        if (pct >= 100) {
          exit();
        }
      });

      return () => {
        window.clearTimeout(timeout);
        stopTracking();
        releaseScroll();
      };
    },
    { scope: rootRef, dependencies: [active, assets] },
  );

  return active;
}
