"use client";

import Image from "next/image";
import { useRef } from "react";
import type { HeroScene } from "@/content/hero";
import { useHeroScene } from "@/features/landing/hooks/useHeroScene";
import type { SequenceVariant } from "@/shared/lib/assets";
import { MEDIA_DESKTOP } from "@/shared/lib/motion/media";

export type HeroImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
  blurDataURL?: string;
};

type HeroCameraProps = {
  scene: HeroScene;
  wordmark: string;
  scrollLabel: string;
  cornerLabels: { topLeft: string; bottomRight: string };
  overlayText: string;
  background: string;
  frames: { desktop: SequenceVariant; mobile: SequenceVariant };
  camera: HeroImage;
  landscape: HeroImage;
  landscapeMobile: HeroImage;
};

const NOSCRIPT_STYLES = `
  [data-hero="landscape"] {
    position: relative !important;
    visibility: visible !important;
    opacity: 1 !important;
    clip-path: none !important;
    width: 88% !important;
    margin: calc(var(--spacing) * 16) auto calc(var(--spacing) * 24) !important;
    aspect-ratio: 16 / 9;
    border-radius: var(--radius-card-lg);
  }
  [data-hero="canvas"] { display: none; }
`;

export function HeroCamera({
  scene,
  wordmark,
  scrollLabel,
  cornerLabels,
  overlayText,
  background,
  frames,
  camera,
  landscape,
  landscapeMobile,
}: HeroCameraProps) {
  const rootRef = useRef<HTMLElement>(null);

  useHeroScene(rootRef, { scene, frames });

  return (
    <section
      ref={rootRef}
      id="hero"
      data-theme="light"
      aria-labelledby="hero-title"
      className="relative isolate"
      style={{ backgroundColor: background }}
    >
      <div
        data-hero="stage"
        className="relative h-lvh overflow-hidden motion-reduce:h-auto motion-reduce:overflow-visible"
      >
        <div className="absolute inset-x-0 top-0 z-25 flex h-svh items-center justify-center mix-blend-multiply motion-reduce:h-[80svh]">
          <h1
            id="hero-title"
            data-hero="wordmark"
            data-reveal
            className="page-margin whitespace-nowrap text-center font-display text-mega text-ink max-[22.5rem]:text-[length:18vw]"
          >
            {wordmark}
          </h1>
        </div>

        <div
          data-hero="camera"
          data-reveal
          className="absolute inset-0 z-20 motion-reduce:relative motion-reduce:h-[80svh]"
        >
          <div data-hero="fallback" className="absolute inset-0">
            <Image
              src={camera.src}
              alt={camera.alt}
              fill
              sizes="100vw"
              priority
              placeholder={camera.blurDataURL ? "blur" : "empty"}
              blurDataURL={camera.blurDataURL}
              className="object-cover"
            />
          </div>
          <div aria-hidden="true" className="absolute inset-0">
            <canvas data-hero="canvas" className="block size-full" />
          </div>
        </div>

        <div
          data-hero="landscape"
          id="viewfinder"
          className="absolute inset-0 z-30 overflow-hidden motion-reduce:relative motion-reduce:mx-auto motion-reduce:mt-16 motion-reduce:mb-24 motion-reduce:aspect-9/16 motion-reduce:w-[92%] motion-reduce:rounded-card md:motion-reduce:aspect-video md:motion-reduce:w-[88%] md:motion-reduce:rounded-card-lg"
        >
          <div data-hero="landscape-image" className="absolute inset-0">
            <picture>
              <source
                media={MEDIA_DESKTOP}
                srcSet={landscape.src}
                width={landscape.width}
                height={landscape.height}
              />
              <img
                src={landscapeMobile.src}
                alt={landscape.alt}
                width={landscapeMobile.width}
                height={landscapeMobile.height}
                className="absolute inset-0 size-full object-cover"
              />
            </picture>
          </div>

          <div
            data-hero="overlay-frame"
            className="absolute inset-0 flex items-end p-(--margin-page) pb-12"
          >
            <p className="sr-only">{overlayText}</p>
            <p
              data-hero="overlay"
              aria-hidden="true"
              className="w-[min(18ch,72vw)] shrink-0 font-display text-h2 text-paper"
            >
              {overlayText}
            </p>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-0 z-40 h-svh motion-reduce:h-[80svh]">
          <p
            data-hero="corner"
            data-reveal
            className="absolute top-20 left-(--margin-page) font-mono-label text-ink-2"
          >
            {cornerLabels.topLeft}
          </p>
          <p
            data-hero="corner"
            data-reveal
            className="absolute right-(--margin-page) bottom-16 font-mono-label text-ink-2"
          >
            {cornerLabels.bottomRight}
          </p>
          <p
            data-hero="scroll-hint"
            data-cursor="slide"
            data-reveal
            className="absolute bottom-16 left-1/2 -translate-x-1/2 font-mono-label text-ink-2 motion-reduce:hidden"
          >
            {scrollLabel}
          </p>

          <div className="absolute inset-x-0 bottom-0 motion-reduce:hidden">
            <p
              data-hero="phase"
              data-reveal
              className="page-margin pb-6 font-mono-label text-ink-2"
            >
              {scene.progressLabels[0]?.label}
            </p>
            <div data-reveal className="h-0.5 bg-ink/10">
              <span
                data-hero="progress-bar"
                className="block size-full origin-left scale-x-0 bg-shutter"
              />
            </div>
          </div>
        </div>
      </div>

      <noscript>
        <style>{NOSCRIPT_STYLES}</style>
      </noscript>
    </section>
  );
}
