import { homeContent } from "@/content/home";
import type { PreloaderAssets } from "@/features/landing/lib/preloader-progress";
import { PreloaderScene } from "@/features/landing/scenes/PreloaderScene";
import { getAsset, getSequence } from "@/shared/lib/assets";

function resolvePreloaderAssets(): PreloaderAssets {
  const { hero, viewfinder } = homeContent;
  const sequence = hero.sequenceAssetId
    ? getSequence(hero.sequenceAssetId)
    : null;

  return {
    landscape:
      viewfinder.landscapeAssetId && viewfinder.landscapeMobileAssetId
        ? {
            desktop: getAsset(viewfinder.landscapeAssetId).src,
            mobile: getAsset(viewfinder.landscapeMobileAssetId).src,
          }
        : null,
    frames: sequence
      ? { desktop: sequence.desktop, mobile: sequence.mobile }
      : null,
  };
}

export function Preloader() {
  return (
    <PreloaderScene
      wordmark={homeContent.preloader.wordmark}
      assets={resolvePreloaderAssets()}
    />
  );
}
