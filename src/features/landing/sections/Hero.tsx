import { heroScene } from "@/content/hero";
import { homeContent } from "@/content/home";
import {
  HeroCamera,
  type HeroImage,
} from "@/features/landing/scenes/HeroCamera";
import { type Asset, getAsset, getSequence } from "@/shared/lib/assets";

function toHeroImage(asset: Asset): HeroImage {
  return {
    src: asset.src,
    width: asset.width,
    height: asset.height,
    alt: asset.alt,
    blurDataURL: asset.blurDataURL,
  };
}

export function Hero() {
  const { hero, viewfinder } = homeContent;

  if (
    !hero.sequenceAssetId ||
    !hero.cameraAssetId ||
    !viewfinder.landscapeAssetId ||
    !viewfinder.landscapeMobileAssetId
  ) {
    throw new Error(
      "La escena hero necesita los assets de secuencia, cámara y paisaje en src/content/home.ts.",
    );
  }

  const sequence = getSequence(hero.sequenceAssetId);

  return (
    <HeroCamera
      scene={heroScene}
      wordmark={hero.wordmark}
      scrollLabel={hero.scrollLabel}
      cornerLabels={hero.cornerLabels}
      overlayText={viewfinder.overlayText}
      background={sequence.background}
      frames={{ desktop: sequence.desktop, mobile: sequence.mobile }}
      camera={toHeroImage(getAsset(hero.cameraAssetId))}
      landscape={toHeroImage(getAsset(viewfinder.landscapeAssetId))}
      landscapeMobile={toHeroImage(getAsset(viewfinder.landscapeMobileAssetId))}
    />
  );
}
