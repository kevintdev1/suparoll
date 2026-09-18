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
    let left = 0,
      right = 0;
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
  return `minX=${(minX / w).toFixed(3)} maxX=${((maxX + 1) / w).toFixed(3)} minY=${(minY / h).toFixed(3)} maxY=${((maxY + 1) / h).toFixed(3)}`;
}

for (const t of [9, 14, 20, 28, 40]) {
  console.log("threshold", t);
  for (const f of ["0001", "0040", "0080", "0120"]) {
    console.log(
      "  ",
      f,
      bbox(`b-${f === "0040" ? "0045" : f === "0080" ? "0075" : f}.bmp`, t),
    );
  }
}
