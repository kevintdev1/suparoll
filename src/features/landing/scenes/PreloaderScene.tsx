"use client";

import { useRef } from "react";
import {
  formatPreloaderCounter,
  usePreloader,
} from "@/features/landing/hooks/usePreloader";
import {
  PRELOADER_NOSCRIPT_STYLE,
  PRELOADER_SEEN_SCRIPT,
} from "@/features/landing/lib/preloader-gate";
import type { PreloaderAssets } from "@/features/landing/lib/preloader-progress";
import { useHydrated } from "@/shared/hooks/useHydrated";

type PreloaderSceneProps = {
  wordmark: string;
  assets: PreloaderAssets;
};

export function PreloaderScene({ wordmark, assets }: PreloaderSceneProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const visible = usePreloader(rootRef, assets);
  const hydrated = useHydrated();

  if (!visible) {
    return null;
  }

  return (
    <>
      <div
        ref={rootRef}
        data-preloader="root"
        aria-hidden="true"
        suppressHydrationWarning
        className="fixed inset-0 z-100"
      >
        <div
          data-preloader="curtain"
          className="absolute inset-0 flex items-center justify-center bg-paper"
        >
          <p className="font-display text-h3 text-ink">{wordmark}</p>
          <p
            data-preloader="counter"
            className="absolute right-(--margin-page) bottom-(--margin-page) font-mono-label tabular-nums text-ink-2"
          >
            {formatPreloaderCounter(0)}
          </p>
        </div>
      </div>
      {!hydrated && <script>{PRELOADER_SEEN_SCRIPT}</script>}
      <noscript>
        <style>{PRELOADER_NOSCRIPT_STYLE}</style>
      </noscript>
    </>
  );
}
