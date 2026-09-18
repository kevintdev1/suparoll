import type { SequenceVariant } from "@/shared/lib/assets";
import type { Rect, Size } from "./hero-geometry";

const CONCURRENCY = 8;
const FIRST_PASS_STEP = 4;
const FRAME_PATTERN_TOKEN = /%0(\d+)d/;

/** Rutas de los frames a partir del patrón del manifest ("%04d.webp", 1-indexado). */
export function buildFrameUrls(variant: SequenceVariant): string[] {
  const match = FRAME_PATTERN_TOKEN.exec(variant.pattern);

  if (!match) {
    throw new Error(
      `Patrón de frames "${variant.pattern}" no reconocido. Se espera algo como "%04d.webp".`,
    );
  }

  const padding = Number(match[1]);
  const urls = new Array<string>(variant.count);

  for (let index = 0; index < variant.count; index++) {
    const name = variant.pattern.replace(
      FRAME_PATTERN_TOKEN,
      String(index + 1).padStart(padding, "0"),
    );
    urls[index] = `${variant.path}/${name}`;
  }

  return urls;
}

export type FrameLoader = {
  count: number;
  start: (onProgress?: (loaded: number, total: number) => void) => void;
  frameAt: (index: number) => HTMLImageElement | undefined;
  dispose: () => void;
};

/** Orden de carga: primero uno de cada cuatro, luego el resto. */
function loadOrder(count: number): number[] {
  const order: number[] = [];
  const queued = new Uint8Array(count);

  for (let index = 0; index < count; index += FIRST_PASS_STEP) {
    order.push(index);
    queued[index] = 1;
  }

  const last = count - 1;

  if (!queued[last]) {
    order.push(last);
    queued[last] = 1;
  }

  for (let index = 0; index < count; index++) {
    if (!queued[index]) {
      order.push(index);
    }
  }

  return order;
}

export function createFrameLoader(urls: string[]): FrameLoader {
  const count = urls.length;
  const images = new Array<HTMLImageElement | undefined>(count);
  const loadedFlags = new Uint8Array(count);
  let loaded = 0;
  let disposed = false;
  let started = false;

  function frameAt(index: number): HTMLImageElement | undefined {
    if (loadedFlags[index]) {
      return images[index];
    }

    for (let offset = 1; offset < count; offset++) {
      const before = index - offset;
      const after = index + offset;

      if (before >= 0 && loadedFlags[before]) {
        return images[before];
      }

      if (after < count && loadedFlags[after]) {
        return images[after];
      }
    }

    return undefined;
  }

  function start(onProgress?: (loaded: number, total: number) => void) {
    if (started) {
      return;
    }

    started = true;
    const order = loadOrder(count);
    let cursor = 0;

    const next = (): void => {
      if (disposed || cursor >= order.length) {
        return;
      }

      const index = order[cursor];
      cursor += 1;

      const image = new Image();
      image.decoding = "async";
      image.src = urls[index];

      const done = () => {
        if (disposed) {
          return;
        }

        loaded += 1;
        onProgress?.(loaded, count);
        next();
      };

      image.onload = () => {
        images[index] = image;
        loadedFlags[index] = 1;
        done();
      };

      image.onerror = done;
    };

    for (let worker = 0; worker < CONCURRENCY; worker++) {
      next();
    }
  }

  return {
    count,
    start,
    frameAt,
    dispose() {
      disposed = true;

      for (const image of images) {
        if (image) {
          image.onload = null;
          image.onerror = null;
        }
      }
    },
  };
}

export function resizeCanvas(
  canvas: HTMLCanvasElement,
  viewport: Size,
  maxDpr = 2,
): CanvasRenderingContext2D | null {
  const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
  const width = Math.round(viewport.width * dpr);
  const height = Math.round(viewport.height * dpr);

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  return ctx;
}

/**
 * Dibuja el frame en `rect`. Si queda hueco arriba o abajo, estira la primera y
 * la última fila de la imagen: el fondo del video tiene degradado y así no
 * aparece ningún borde.
 */
export function drawFrame(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  rect: Rect,
  viewport: Size,
): void {
  const source = { width: image.naturalWidth, height: image.naturalHeight };

  if (source.width === 0 || source.height === 0) {
    return;
  }

  if (rect.y > 0) {
    ctx.drawImage(
      image,
      0,
      0,
      source.width,
      1,
      rect.x,
      0,
      rect.width,
      rect.y + 1,
    );
  }

  const bottom = rect.y + rect.height;

  if (bottom < viewport.height) {
    ctx.drawImage(
      image,
      0,
      source.height - 1,
      source.width,
      1,
      rect.x,
      bottom - 1,
      rect.width,
      viewport.height - bottom + 1,
    );
  }

  ctx.drawImage(image, rect.x, rect.y, rect.width, rect.height);
}
