import type { SequenceVariant } from "@/shared/lib/assets";
import type { Rect, Size } from "./hero-geometry";

const CONCURRENCY = 6;
const FIRST_PASS_STEP = 4;
const FRAME_PATTERN_TOKEN = /%0(\d+)d/;

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

export type LoadedFrame = {
  index: number;
  source: HTMLImageElement;
};

export type FrameProgress = {
  loaded: number;
  total: number;
  firstPassLoaded: number;
  firstPassTotal: number;
};

export type FrameLoader = {
  count: number;
  frameAt: (index: number) => LoadedFrame | undefined;
  subscribe: (listener: (progress: FrameProgress) => void) => () => void;
};

type LoaderEntry = {
  loader: FrameLoader;
  dispose: () => void;
  refs: number;
};

const loaders = new Map<string, LoaderEntry>();

function firstPassIndices(count: number): number[] {
  const indices: number[] = [];

  for (let index = 0; index < count; index += FIRST_PASS_STEP) {
    indices.push(index);
  }

  if (count > 0 && indices[indices.length - 1] !== count - 1) {
    indices.push(count - 1);
  }

  return indices;
}

function loadOrder(count: number, firstPass: number[]): number[] {
  const queued = new Uint8Array(count);

  for (const index of firstPass) {
    queued[index] = 1;
  }

  const rest: number[] = [];

  for (let index = 0; index < count; index++) {
    if (!queued[index]) {
      rest.push(index);
    }
  }

  return [...firstPass, ...rest];
}

async function decodeImage(
  url: string,
  priority: "high" | "low",
): Promise<HTMLImageElement | null> {
  const image = new Image();
  image.decoding = "async";
  image.fetchPriority = priority;
  image.src = url;

  try {
    await image.decode();
    return image;
  } catch {
    return null;
  }
}

function createFrameLoader(urls: string[]): LoaderEntry {
  const count = urls.length;
  const images = new Array<HTMLImageElement | undefined>(count);
  const firstPass = firstPassIndices(count);
  const firstPassSet = new Set(firstPass);
  const order = loadOrder(count, firstPass);
  const listeners = new Set<(progress: FrameProgress) => void>();
  const progress: FrameProgress = {
    loaded: 0,
    total: count,
    firstPassLoaded: 0,
    firstPassTotal: firstPass.length,
  };
  let cursor = 0;
  let disposed = false;

  const notify = () => {
    for (const listener of listeners) {
      listener(progress);
    }
  };

  const frameAt = (index: number): LoadedFrame | undefined => {
    for (let offset = 0; offset < count; offset++) {
      const before = images[index - offset];

      if (before) {
        return { index: index - offset, source: before };
      }

      const after = images[index + offset];

      if (after) {
        return { index: index + offset, source: after };
      }
    }

    return undefined;
  };

  const next = (): void => {
    if (disposed || cursor >= order.length) {
      return;
    }

    const index = order[cursor];
    cursor += 1;

    void decodeImage(
      urls[index],
      firstPassSet.has(index) ? "high" : "low",
    ).then((image) => {
      if (disposed) {
        return;
      }

      if (image) {
        images[index] = image;
      }

      progress.loaded += 1;

      if (firstPassSet.has(index)) {
        progress.firstPassLoaded += 1;
      }

      notify();
      next();
    });
  };

  for (let worker = 0; worker < CONCURRENCY; worker++) {
    next();
  }

  return {
    refs: 0,
    loader: {
      count,
      frameAt,
      subscribe(listener) {
        listeners.add(listener);
        listener(progress);

        return () => {
          listeners.delete(listener);
        };
      },
    },
    dispose() {
      disposed = true;
      listeners.clear();
      images.fill(undefined);
    },
  };
}

export function acquireFrameLoader(urls: string[]): {
  loader: FrameLoader;
  release: () => void;
} {
  const key = urls.join("|");
  let entry = loaders.get(key);

  if (!entry) {
    entry = createFrameLoader(urls);
    loaders.set(key, entry);
  }

  const owned = entry;
  let released = false;

  owned.refs += 1;

  return {
    loader: owned.loader,
    release() {
      if (released) {
        return;
      }

      released = true;
      owned.refs -= 1;

      if (owned.refs === 0) {
        owned.dispose();
        loaders.delete(key);
      }
    },
  };
}

export type CanvasQuality = {
  maxDpr: number;
  smoothing: ImageSmoothingQuality;
};

export function resizeCanvas(
  canvas: HTMLCanvasElement,
  viewport: Size,
  quality: CanvasQuality,
): CanvasRenderingContext2D | null {
  const dpr = Math.min(window.devicePixelRatio || 1, quality.maxDpr);
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
  ctx.imageSmoothingQuality = quality.smoothing;

  return ctx;
}

export function drawFrame(
  ctx: CanvasRenderingContext2D,
  source: HTMLImageElement,
  rect: Rect,
  viewport: Size,
): void {
  const size = { width: source.naturalWidth, height: source.naturalHeight };

  if (size.width === 0 || size.height === 0) {
    return;
  }

  if (rect.y > 0) {
    ctx.drawImage(
      source,
      0,
      0,
      size.width,
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
      source,
      0,
      size.height - 1,
      size.width,
      1,
      rect.x,
      bottom - 1,
      rect.width,
      viewport.height - bottom + 1,
    );
  }

  ctx.drawImage(source, rect.x, rect.y, rect.width, rect.height);
}
