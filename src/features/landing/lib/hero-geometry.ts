import type { HeroFit, NormalizedRect } from "@/content/hero";

export type Size = { width: number; height: number };

export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Point = { x: number; y: number };

export function clamp(value: number, min: number, max: number): number {
  if (value < min) {
    return min;
  }

  return value > max ? max : value;
}

export function lerp(from: number, to: number, amount: number): number {
  return from + (to - from) * amount;
}

/** Progreso 0–1 dentro de un tramo de la escena, recortado en los extremos. */
export function phaseProgress(
  progress: number,
  from: number,
  to: number,
): number {
  if (to <= from) {
    return progress >= to ? 1 : 0;
  }

  return clamp((progress - from) / (to - from), 0, 1);
}

export function rectCenter(rect: NormalizedRect | Rect): Point {
  return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
}

export function lerpRect(from: Rect, to: Rect, amount: number): Rect {
  return {
    x: lerp(from.x, to.x, amount),
    y: lerp(from.y, to.y, amount),
    width: lerp(from.width, to.width, amount),
    height: lerp(from.height, to.height, amount),
  };
}

/**
 * Escala base del frame. Prioriza cubrir el viewport (el fondo del video tiene
 * degradado, así que un borde visible se notaría) pero nunca tanto como para
 * recortar la cámara, y siempre cubre el ancho completo.
 */
export function computeBaseScale(
  viewport: Size,
  image: Size,
  cameraBox: NormalizedRect,
  fit: HeroFit,
): number {
  const cover = Math.max(
    viewport.width / image.width,
    viewport.height / image.height,
  );

  const byWidth =
    (viewport.width * fit.cameraWidth) / (cameraBox.width * image.width);
  const byHeight =
    (viewport.height * fit.cameraHeight) / (cameraBox.height * image.height);

  const focal = Math.min(byWidth, byHeight);

  return Math.max(Math.min(cover, focal), viewport.width / image.width);
}

/**
 * Rectángulo donde se dibuja el frame: el punto `focus` (en coordenadas 0–1 de
 * la imagen) queda en el centro del viewport.
 */
export function computeFrameRect(
  viewport: Size,
  image: Size,
  scale: number,
  focus: Point,
): Rect {
  const width = image.width * scale;
  const height = image.height * scale;

  return {
    x: viewport.width / 2 - focus.x * width,
    y: viewport.height / 2 - focus.y * height,
    width,
    height,
  };
}

/** Lleva un rectángulo en coordenadas 0–1 de la imagen a píxeles de pantalla. */
export function projectRect(rect: NormalizedRect, frame: Rect): Rect {
  return {
    x: frame.x + rect.x * frame.width,
    y: frame.y + rect.y * frame.height,
    width: rect.width * frame.width,
    height: rect.height * frame.height,
  };
}

/** Zoom necesario para que un rectángulo de la imagen alcance un alto dado. */
export function computeZoomForHeight(
  targetHeight: number,
  rect: NormalizedRect,
  image: Size,
  baseScale: number,
): number {
  const current = rect.height * image.height * baseScale;

  if (current <= 0) {
    return 1;
  }

  return targetHeight / current;
}

export function fullBleedRect(viewport: Size): Rect {
  return { x: 0, y: 0, width: viewport.width, height: viewport.height };
}

/** Tarjeta centrada en el viewport, con ancho relativo y proporción fijas. */
export function cardRect(
  viewport: Size,
  widthFraction: number,
  aspect: number,
): Rect {
  const width = viewport.width * widthFraction;
  const height = Math.min(width / aspect, viewport.height * 0.86);

  return {
    x: (viewport.width - width) / 2,
    y: (viewport.height - height) / 2,
    width,
    height: height,
  };
}

/** `inset()` de un rectángulo respecto al viewport, sin valores negativos. */
export function insetFromRect(
  rect: Rect,
  viewport: Size,
  radius: number,
): string {
  const top = Math.max(rect.y, 0);
  const left = Math.max(rect.x, 0);
  const right = Math.max(viewport.width - (rect.x + rect.width), 0);
  const bottom = Math.max(viewport.height - (rect.y + rect.height), 0);

  return `inset(${top.toFixed(1)}px ${right.toFixed(1)}px ${bottom.toFixed(1)}px ${left.toFixed(1)}px round ${Math.max(radius, 0).toFixed(1)}px)`;
}
