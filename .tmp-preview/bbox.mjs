import { execFileSync } from "node:child_process";
import fs from "node:fs";

function readBmp(file) {
  const b = fs.readFileSync(file);
  const off = b.readUInt32LE(10);
  const w = b.readInt32LE(18);
  const hRaw = b.readInt32LE(22);
  const bpp = b.readUInt16LE(28) / 8;
  const h = Math.abs(hRaw);
  const topDown = hRaw < 0;
  const row = Math.ceil((w * bpp) / 4) * 4;
  const lum = new Float64Array(w * h);
  for (let y = 0; y < h; y++) {
    const yy = topDown ? y : h - 1 - y;
    for (let x = 0; x < w; x++) {
      const i = off + yy * row + x * bpp;
      lum[y * w + x] = 0.299 * b[i + 2] + 0.587 * b[i + 1] + 0.114 * b[i];
    }
  }
  return { w, h, lum };
}

function bbox(file, threshold) {
  const { w, h, lum } = readBmp(file);
  const margin = Math.round(w * 0.06);
  let minX = w,
    maxX = -1,
    minY = h,
    maxY = -1;
  for (let y = 0; y < h; y++) {
    let left = 0;
    let right = 0;
    for (let i = 0; i < margin; i++) {
      left += lum[y * w + i];
      right += lum[y * w + (w - 1 - i)];
    }
    left /= margin;
    right /= margin;
    for (let x = 0; x < w; x++) {
      const model = left + (right - left) * (x / (w - 1));
      if (Math.abs(lum[y * w + x] - model) > threshold) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  return {
    minX: minX / w,
    maxX: (maxX + 1) / w,
    minY: minY / h,
    maxY: (maxY + 1) / h,
  };
}

const frames = [
  "0001",
  "0015",
  "0030",
  "0045",
  "0060",
  "0075",
  "0090",
  "0105",
  "0120",
];
const union = { minX: 1, maxX: 0, minY: 1, maxY: 0 };
for (const f of frames) {
  const src = `../public/media/hero/frames/desktop/${f}.webp`;
  execFileSync(
    "sips",
    ["-s", "format", "bmp", "-z", "270", "480", src, "--out", `b-${f}.bmp`],
    { stdio: "ignore" },
  );
  const r = bbox(`b-${f}.bmp`, 9);
  union.minX = Math.min(union.minX, r.minX);
  union.maxX = Math.max(union.maxX, r.maxX);
  union.minY = Math.min(union.minY, r.minY);
  union.maxY = Math.max(union.maxY, r.maxY);
  console.log(
    f,
    Object.entries(r)
      .map(([k, v]) => `${k}=${v.toFixed(3)}`)
      .join(" "),
  );
}
console.log(
  "UNION",
  Object.entries(union)
    .map(([k, v]) => `${k}=${v.toFixed(3)}`)
    .join(" "),
);
console.log(
  "BOX",
  JSON.stringify({
    x: Number(union.minX.toFixed(3)),
    y: Number(union.minY.toFixed(3)),
    width: Number((union.maxX - union.minX).toFixed(3)),
    height: Number((union.maxY - union.minY).toFixed(3)),
  }),
);
