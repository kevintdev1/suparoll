"use client";

import type { RefObject } from "react";
import type { HeroScene } from "@/content/hero";
import {
  acquireFrameLoader,
  buildFrameUrls,
} from "@/features/landing/lib/frame-sequence";
import { attachViewfinderPicker } from "@/features/landing/lib/hero-debug";
import { createHeroIntro } from "@/features/landing/lib/hero-intro";
import {
  createHeroRenderer,
  HERO_CANVAS_QUALITY,
} from "@/features/landing/lib/hero-renderer";
import {
  buildHeroTimeline,
  cameraFadeStart,
  findPhaseLabel,
} from "@/features/landing/lib/hero-timeline";
import type { SequenceVariant } from "@/shared/lib/assets";
import { getDebugHero, getDebugMotion } from "@/shared/lib/motion/debug";
import {
  gsap,
  ScrollTrigger,
  SplitText,
  useGSAP,
} from "@/shared/lib/motion/gsap";
import {
  MOTION_DESKTOP,
  MOTION_MOBILE,
  MOTION_REDUCED,
} from "@/shared/lib/motion/media";
import { waitForPreloaderComplete } from "@/shared/lib/motion/preloader";
import { dur, ease } from "@/shared/lib/motion/tokens";

type HeroSceneOptions = {
  scene: HeroScene;
  frames: { desktop: SequenceVariant; mobile: SequenceVariant };
};

function queryHero<T extends HTMLElement>(root: HTMLElement, name: string) {
  return root.querySelector<T>(`[data-hero="${name}"]`);
}

function revealLayers(root: HTMLElement) {
  for (const element of root.querySelectorAll("[data-reveal]")) {
    element.setAttribute("data-revealed", "");
  }
}

function fadeScrollHint(hint: HTMLElement, visible: boolean) {
  gsap.to(hint, {
    autoAlpha: visible ? 1 : 0,
    duration: dur.base,
    ease: ease.out,
    overwrite: "auto",
  });
}

export function useHeroScene(
  rootRef: RefObject<HTMLElement | null>,
  { scene, frames }: HeroSceneOptions,
) {
  useGSAP(
    () => {
      const root = rootRef.current;

      if (!root) {
        return;
      }

      const stage = queryHero<HTMLDivElement>(root, "stage");
      const canvas = queryHero<HTMLCanvasElement>(root, "canvas");
      const camera = queryHero<HTMLDivElement>(root, "camera");
      const fallback = queryHero<HTMLDivElement>(root, "fallback");
      const wordmark = queryHero<HTMLHeadingElement>(root, "wordmark");
      const landscape = queryHero<HTMLDivElement>(root, "landscape");
      const landscapeImage = queryHero<HTMLDivElement>(root, "landscape-image");
      const overlay = queryHero<HTMLParagraphElement>(root, "overlay");
      const overlayFrame = queryHero<HTMLDivElement>(root, "overlay-frame");
      const scrollHint = queryHero<HTMLParagraphElement>(root, "scroll-hint");
      const progressBar = queryHero<HTMLSpanElement>(root, "progress-bar");
      const phaseLabel = queryHero<HTMLParagraphElement>(root, "phase");
      const corners = gsap.utils.toArray<HTMLElement>(
        '[data-hero="corner"]',
        root,
      );

      if (
        !stage ||
        !canvas ||
        !camera ||
        !wordmark ||
        !landscape ||
        !landscapeImage ||
        !overlay
      ) {
        return;
      }

      const debug = getDebugHero();
      const markers = debug || getDebugMotion();

      const setupScene = (variantName: "desktop" | "mobile") => {
        revealLayers(root);

        const variant = scene[variantName];
        const frameVariant = frames[variantName];
        const { loader, release } = acquireFrameLoader(
          buildFrameUrls(frameVariant),
        );
        const renderer = createHeroRenderer({
          stage,
          canvas,
          fallback,
          landscape,
          overlayFrame,
          scene,
          variant,
          image: { width: frameVariant.width, height: frameVariant.height },
          loader,
          quality: HERO_CANVAS_QUALITY,
          debug,
        });
        const overlaySplit = SplitText.create(overlay, {
          type: "lines",
          mask: "lines",
          aria: "none",
        });
        const intro = createHeroIntro({
          wordmark,
          camera,
          labels: scrollHint ? [...corners, scrollHint] : corners,
        });
        let lastPhase = "";
        let cancelled = false;

        const setPhase = (progress: number) => {
          const next = findPhaseLabel(scene.progressLabels, progress);

          if (phaseLabel && next !== lastPhase) {
            phaseLabel.textContent = next;
            lastPhase = next;
          }
        };

        const syncResumedScene = (progress: number) => {
          if (progress <= 0.001) {
            return;
          }

          if (scrollHint) {
            gsap.set(scrollHint, { autoAlpha: 0 });
          }

          if (progress < cameraFadeStart(scene.phases)) {
            gsap.set(camera, { autoAlpha: 1, scale: 1 });
          }
        };

        const timeline = buildHeroTimeline({
          stage,
          scene,
          variant,
          renderer,
          turnEndFrame: Math.round((loader.count - 1) * scene.turnEndRatio),
          wordmark,
          corners,
          camera,
          landscape,
          landscapeImage,
          overlayLines: overlaySplit.lines,
          progressBar,
          markers,
          onProgress: setPhase,
          onRefresh: (progress) => {
            renderer.measure();
            renderer.render(progress);
            setPhase(progress);
            syncResumedScene(progress);
          },
        });

        const unsubscribe = loader.subscribe(() => renderer.render());

        const hintTrigger = scrollHint
          ? ScrollTrigger.create({
              trigger: stage,
              start: "top top",
              onEnter: () => fadeScrollHint(scrollHint, false),
              onLeaveBack: () => fadeScrollHint(scrollHint, true),
            })
          : null;

        const atSceneStart = () =>
          (timeline.scrollTrigger?.progress ?? 0) <= 0.001 &&
          window.scrollY <= 2 &&
          Math.abs(stage.getBoundingClientRect().top) < 4;

        const scheduleIntro = async () => {
          if (!atSceneStart()) {
            return;
          }

          intro.prepare();
          await waitForPreloaderComplete();

          if (cancelled) {
            return;
          }

          if (atSceneStart()) {
            intro.play(true);
            return;
          }

          intro.complete();
          syncResumedScene(timeline.scrollTrigger?.progress ?? 0);
        };

        void scheduleIntro();

        const detachPicker = debug
          ? attachViewfinderPicker(canvas, renderer.frameRect)
          : undefined;

        return () => {
          cancelled = true;
          detachPicker?.();
          unsubscribe();
          hintTrigger?.kill();
          intro.dispose();
          overlaySplit.revert();
          renderer.dispose();
          release();
        };
      };

      const setupStatic = () => {
        revealLayers(root);
        gsap.set(camera, { autoAlpha: 1 });
        gsap.set(landscapeImage, { scale: 1 });
        gsap.set(landscape, { clipPath: "none" });
        gsap.from(landscape, {
          autoAlpha: 0,
          duration: dur.base,
          ease: ease.out,
          scrollTrigger: { trigger: landscape, start: "top 85%", once: true },
        });
      };

      const mm = gsap.matchMedia();

      mm.add(MOTION_DESKTOP, () => setupScene("desktop"));
      mm.add(MOTION_MOBILE, () => setupScene("mobile"));
      mm.add(MOTION_REDUCED, setupStatic);

      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [scene, frames] },
  );
}
