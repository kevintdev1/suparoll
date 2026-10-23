import type { HeroScene, HeroVariant } from "@/content/hero";
import {
  type CanvasQuality,
  drawFrame,
  type FrameLoader,
  resizeCanvas,
} from "./frame-sequence";
import { drawDebugBoxes } from "./hero-debug";
import {
  cardRect,
  computeBaseScale,
  computeClipShape,
  computeFrameRect,
  computeZoomForHeight,
  insetFromRect,
  projectRect,
  type Rect,
  rectCenter,
  type Size,
} from "./hero-geometry";

export const HERO_CANVAS_QUALITY: CanvasQuality = {
  maxDpr: 2,
  smoothing: "high",
};

export type HeroState = {
  frame: number;
  zoom: number;
  focusX: number;
  focusY: number;
  reveal: number;
  card: number;
};

type HeroRendererOptions = {
  stage: HTMLElement;
  canvas: HTMLCanvasElement;
  fallback: HTMLElement | null;
  landscape: HTMLElement;
  overlayFrame: HTMLElement | null;
  scene: HeroScene;
  variant: HeroVariant;
  image: Size;
  loader: FrameLoader;
  quality: CanvasQuality;
  debug: boolean;
};

export type HeroRenderer = {
  state: HeroState;
  measure: () => void;
  render: (progress?: number) => void;
  zoomTarget: () => number;
  frameRect: () => Rect;
  dispose: () => void;
};

export function createHeroRenderer({
  stage,
  canvas,
  fallback,
  landscape,
  overlayFrame,
  scene,
  variant,
  image,
  loader,
  quality,
  debug,
}: HeroRendererOptions): HeroRenderer {
  const cameraCenter = rectCenter(scene.cameraBox);
  const state: HeroState = {
    frame: 0,
    zoom: 1,
    focusX: cameraCenter.x,
    focusY: cameraCenter.y,
    reveal: 0,
    card: 0,
  };

  let viewport: Size = { width: 0, height: 0 };
  let ctx: CanvasRenderingContext2D | null = null;
  let baseScale = 1;
  let zoomTarget = 1;
  let frameRect: Rect = { x: 0, y: 0, width: 0, height: 0 };
  let lastDrawKey = "";
  let lastClip = "";
  let fallbackHidden = false;
  let sceneProgress = 0;

  const measure = () => {
    viewport = { width: stage.clientWidth, height: stage.clientHeight };
    ctx = resizeCanvas(canvas, viewport, quality);
    baseScale = computeBaseScale(viewport, image, scene.cameraBox, variant.fit);
    zoomTarget = Math.min(
      computeZoomForHeight(
        viewport.height * scene.viewfinderTargetHeight,
        scene.viewfinderRect,
        image,
        baseScale,
      ),
      scene.zoomMax,
    );
    lastDrawKey = "";
    lastClip = "";
  };

  const drawCamera = () => {
    const index = Math.round(state.frame);

    const frame = loader.frameAt(index);

    if (!ctx || !frame) {
      return;
    }

    const drawKey = `${frame.index}|${state.zoom.toFixed(3)}|${state.focusX.toFixed(4)}|${state.focusY.toFixed(4)}`;

    if (drawKey === lastDrawKey) {
      return;
    }

    drawFrame(ctx, frame.source, frameRect, viewport);
    lastDrawKey = drawKey;

    if (!fallbackHidden && fallback) {
      fallbackHidden = true;
      fallback.style.visibility = "hidden";
    }

    if (debug) {
      drawDebugBoxes(ctx, frameRect, scene);
    }
  };

  const updateClip = () => {
    const ocular = projectRect(scene.viewfinderRect, frameRect);
    const shape = computeClipShape(
      ocular,
      Math.min(ocular.width, ocular.height) * scene.viewfinderRadiusRatio,
      viewport,
      {
        rect: cardRect(viewport, variant.cardWidth, variant.cardAspect),
        radius: variant.cardRadius,
      },
      state.reveal,
      state.card,
    );
    const clip = insetFromRect(shape.rect, viewport, shape.radius);

    if (clip === lastClip) {
      return;
    }

    lastClip = clip;
    landscape.style.clipPath = clip;

    if (overlayFrame) {
      const offsetY = shape.rect.y + shape.rect.height - viewport.height;
      overlayFrame.style.transform = `translate3d(${shape.rect.x.toFixed(1)}px, ${offsetY.toFixed(1)}px, 0)`;
    }
  };

  const render = (progress = sceneProgress) => {
    sceneProgress = progress;
    frameRect = computeFrameRect(viewport, image, baseScale * state.zoom, {
      x: state.focusX,
      y: state.focusY,
    });

    drawCamera();

    if (progress >= scene.phases.visor) {
      updateClip();
    }
  };

  measure();

  return {
    state,
    measure,
    render,
    zoomTarget: () => zoomTarget,
    frameRect: () => frameRect,
    dispose() {
      if (fallback) {
        fallback.style.visibility = "";
      }

      landscape.style.clipPath = "";

      if (overlayFrame) {
        overlayFrame.style.transform = "";
      }
    },
  };
}
