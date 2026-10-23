import type { HeroScene, HeroVariant } from "@/content/hero";
import { gsap } from "@/shared/lib/motion/gsap";
import { ease, scrub, stagger } from "@/shared/lib/motion/tokens";
import { rectCenter } from "./hero-geometry";
import type { HeroRenderer } from "./hero-renderer";

type HeroTimelineOptions = {
  stage: HTMLElement;
  scene: HeroScene;
  variant: HeroVariant;
  renderer: HeroRenderer;
  turnEndFrame: number;
  wordmark: HTMLElement;
  corners: HTMLElement[];
  camera: HTMLElement;
  landscape: HTMLElement;
  landscapeImage: HTMLElement;
  overlayLines: Element[];
  progressBar: HTMLElement | null;
  markers: boolean;
  onProgress: (progress: number) => void;
  onRefresh: (progress: number) => void;
};

export function findPhaseLabel(
  labels: HeroScene["progressLabels"],
  progress: number,
): string {
  let current = labels[0]?.label ?? "";

  for (const entry of labels) {
    if (progress >= entry.from) {
      current = entry.label;
    }
  }

  return current;
}

export function cameraFadeStart(phases: HeroScene["phases"]): number {
  return phases.sangre + (phases.tarjeta - phases.sangre) * 0.2;
}

export function buildHeroTimeline({
  stage,
  scene,
  variant,
  renderer,
  turnEndFrame,
  wordmark,
  corners,
  camera,
  landscape,
  landscapeImage,
  overlayLines,
  progressBar,
  markers,
  onProgress,
  onRefresh,
}: HeroTimelineOptions): gsap.core.Timeline {
  const { phases } = scene;
  const { state } = renderer;
  const viewfinderCenter = rectCenter(scene.viewfinderRect);
  const giro = phases.acercamiento - phases.giro;
  const acercamiento = phases.visor - phases.acercamiento;
  const visor = phases.sangre - phases.visor;
  const apertura = phases.tarjeta - phases.sangre;
  const tarjeta = 1 - phases.tarjeta;

  gsap.set(landscape, { autoAlpha: 0 });
  gsap.set(landscapeImage, { scale: 1.4 });
  gsap.set(camera, { autoAlpha: 1 });
  gsap.set(overlayLines, { yPercent: 110 });

  const timeline = gsap.timeline({
    defaults: { ease: ease.scrub },
    onUpdate: () => renderer.render(timeline.progress()),
    scrollTrigger: {
      trigger: stage,
      start: "top top",
      end: variant.scrollLength,
      pin: true,
      anticipatePin: 1,
      scrub: scrub.scene,
      invalidateOnRefresh: true,
      markers,
      onUpdate: (self) => onProgress(self.progress),
      onRefresh: (self) => onRefresh(self.progress),
    },
  });

  timeline
    .addLabel("f1-giro", phases.giro)
    .to(state, { frame: turnEndFrame, duration: giro }, phases.giro)
    .to(wordmark, { xPercent: -14, opacity: 0.15, duration: giro }, phases.giro)
    .addLabel("f2-acercamiento", phases.acercamiento)
    .to(
      state,
      {
        zoom: () => renderer.zoomTarget(),
        focusX: viewfinderCenter.x,
        focusY: viewfinderCenter.y,
        duration: acercamiento,
      },
      phases.acercamiento,
    )
    .to(
      [wordmark, ...corners],
      { autoAlpha: 0, duration: acercamiento * 0.8 },
      phases.acercamiento,
    )
    .addLabel("f3-visor", phases.visor)
    .to(landscape, { autoAlpha: 1, duration: 0.02 }, phases.visor)
    .to(
      state,
      {
        zoom: () => renderer.zoomTarget() * scene.exitZoomFactor,
        duration: visor,
      },
      phases.visor,
    )
    .to(landscapeImage, { scale: 1.12, duration: visor }, phases.visor)
    .addLabel("f4-sangre", phases.sangre)
    .to(state, { reveal: 1, duration: apertura }, phases.sangre)
    .to(landscapeImage, { scale: 1, duration: apertura }, phases.sangre)
    .to(
      camera,
      { autoAlpha: 0, duration: apertura * 0.4 },
      cameraFadeStart(phases),
    )
    .to(
      overlayLines,
      {
        yPercent: 0,
        duration: apertura * 0.5,
        stagger: stagger.lines,
        ease: ease.out,
      },
      phases.sangre + apertura * 0.5,
    )
    .addLabel("f5-tarjeta", phases.tarjeta)
    .to(state, { card: 1, duration: tarjeta }, phases.tarjeta)
    .to(landscapeImage, { scale: 1.06, duration: tarjeta }, phases.tarjeta);

  if (progressBar) {
    timeline.fromTo(
      progressBar,
      { scaleX: 0 },
      { scaleX: 1, duration: 1, ease: ease.scrub },
      0,
    );
  }

  return timeline;
}
