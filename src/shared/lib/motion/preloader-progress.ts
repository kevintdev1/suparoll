"use client";

import { homeContent } from "@/content/home";
import {
  buildFrameUrls,
  createFrameLoader,
} from "@/features/landing/lib/frame-sequence";
import { getAsset, getSequence } from "@/shared/lib/assets";

const FONT_WEIGHT = 0.2;
const IMAGE_WEIGHT = 0.3;
const FRAMES_WEIGHT = 0.5;

export function trackPreloaderProgress(
  onProgress: (pct: number) => void,
): () => void {
  let disposed = false;
  let fontDone = false;
  let imagesDone = false;
  let framesProgress = 0;
  let loaderDispose: (() => void) | undefined;

  const report = () => {
    if (disposed) {
      return;
    }

    const fontPart = fontDone ? FONT_WEIGHT : 0;
    const imagePart = imagesDone ? IMAGE_WEIGHT : 0;
    const framePart = framesProgress * FRAMES_WEIGHT;
    const pct = Math.min(
      100,
      Math.round((fontPart + imagePart + framePart) * 100),
    );

    onProgress(pct);
  };

  void document.fonts.ready.then(() => {
    fontDone = true;
    report();
  });

  const { viewfinder, hero } = homeContent;
  const imageUrls: string[] = [];

  if (viewfinder.landscapeAssetId) {
    imageUrls.push(getAsset(viewfinder.landscapeAssetId).src);
  }

  if (viewfinder.landscapeMobileAssetId) {
    imageUrls.push(getAsset(viewfinder.landscapeMobileAssetId).src);
  }

  if (hero.cameraAssetId) {
    imageUrls.push(getAsset(hero.cameraAssetId).src);
  }

  if (imageUrls.length === 0) {
    imagesDone = true;
    report();
  } else {
    let loadedImages = 0;

    for (const src of imageUrls) {
      const img = new Image();

      const onImageDone = () => {
        loadedImages += 1;

        if (loadedImages >= imageUrls.length) {
          imagesDone = true;
        }

        report();
      };

      img.onload = onImageDone;
      img.onerror = onImageDone;
      img.src = src;
    }
  }

  if (hero.sequenceAssetId) {
    const sequence = getSequence(hero.sequenceAssetId);
    const variant = window.matchMedia("(min-width: 1024px)").matches
      ? sequence.desktop
      : sequence.mobile;
    const frameUrls = buildFrameUrls(variant);
    const loader = createFrameLoader(frameUrls);

    loaderDispose = () => loader.dispose();

    loader.start((loaded, total) => {
      framesProgress = total > 0 ? loaded / total : 1;
      report();
    });
  } else {
    framesProgress = 1;
    report();
  }

  return () => {
    disposed = true;
    loaderDispose?.();
  };
}
