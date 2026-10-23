import type { HeroScene } from "@/content/hero";
import { projectRect, type Rect } from "./hero-geometry";

function readColor(token: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(token)
    .trim();
}

export function drawDebugBoxes(
  ctx: CanvasRenderingContext2D,
  frameRect: Rect,
  scene: HeroScene,
): void {
  const ocular = projectRect(scene.viewfinderRect, frameRect);
  const body = projectRect(scene.cameraBox, frameRect);

  ctx.save();
  ctx.lineWidth = 2;
  ctx.strokeStyle = readColor("--color-shutter");
  ctx.strokeRect(ocular.x, ocular.y, ocular.width, ocular.height);
  ctx.strokeStyle = readColor("--color-exposure");
  ctx.strokeRect(body.x, body.y, body.width, body.height);
  ctx.restore();
}

export function attachViewfinderPicker(
  canvas: HTMLCanvasElement,
  getFrameRect: () => Rect,
): () => void {
  const clicks: { x: number; y: number }[] = [];

  const onClick = (event: MouseEvent) => {
    const bounds = canvas.getBoundingClientRect();
    const frameRect = getFrameRect();
    const x = (event.clientX - bounds.left - frameRect.x) / frameRect.width;
    const y = (event.clientY - bounds.top - frameRect.y) / frameRect.height;

    clicks.push({ x, y });
    console.info(
      `[hero] esquina ${clicks.length}: x=${x.toFixed(3)} y=${y.toFixed(3)}`,
    );

    if (clicks.length < 2) {
      return;
    }

    const xs = clicks.map((point) => point.x);
    const ys = clicks.map((point) => point.y);
    const minX = Math.min(...xs);
    const minY = Math.min(...ys);

    console.info(
      "[hero] viewfinderRect:",
      JSON.stringify({
        x: Number(minX.toFixed(3)),
        y: Number(minY.toFixed(3)),
        width: Number((Math.max(...xs) - minX).toFixed(3)),
        height: Number((Math.max(...ys) - minY).toFixed(3)),
      }),
    );
  };

  canvas.addEventListener("click", onClick);

  return () => canvas.removeEventListener("click", onClick);
}
