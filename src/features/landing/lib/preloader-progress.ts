import type { SequenceVariant } from "@/shared/lib/assets";
import { MEDIA_DESKTOP, MOTION_REDUCED } from "@/shared/lib/motion/media";
import { acquireFrameLoader, buildFrameUrls } from "./frame-sequence";

export type PreloaderAssets = {
  landscape: { desktop: string; mobile: string } | null;
  frames: { desktop: SequenceVariant; mobile: SequenceVariant } | null;
};

const FONT_WEIGHT = 0.2;
const IMAGE_WEIGHT = 0.3;
const FRAMES_WEIGHT = 0.5;

function loadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = src;
  });
}

export function trackPreloaderProgress(
  assets: PreloaderAssets,
  onProgress: (pct: number) => void,
): () => void {
  const isDesktop = window.matchMedia(MEDIA_DESKTOP).matches;
  const reduced = window.matchMedia(MOTION_REDUCED).matches;
  let disposed = false;
  let fontPart = 0;
  let imagePart = assets.landscape ? 0 : IMAGE_WEIGHT;
  let framePart = 0;

  const report = () => {
    if (!disposed) {
      onProgress(
        Math.min(100, Math.round((fontPart + imagePart + framePart) * 100)),
      );
    }
  };

  void document.fonts.ready.then(() => {
    fontPart = FONT_WEIGHT;
    report();
  });

  if (assets.landscape) {
    void loadImage(
      isDesktop ? assets.landscape.desktop : assets.landscape.mobile,
    ).then(() => {
      imagePart = IMAGE_WEIGHT;
      report();
    });
  }

  if (!assets.frames || reduced) {
    framePart = FRAMES_WEIGHT;
    report();

    return () => {
      disposed = true;
    };
  }

  const { loader, release } = acquireFrameLoader(
    buildFrameUrls(isDesktop ? assets.frames.desktop : assets.frames.mobile),
  );
  const unsubscribe = loader.subscribe((progress) => {
    framePart =
      progress.firstPassTotal > 0
        ? (progress.firstPassLoaded / progress.firstPassTotal) * FRAMES_WEIGHT
        : FRAMES_WEIGHT;
    report();
  });

  return () => {
    disposed = true;
    unsubscribe();
    release();
  };
}
