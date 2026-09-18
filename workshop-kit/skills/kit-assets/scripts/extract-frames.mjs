#!/usr/bin/env node
/**
 * Convierte un video (p. ej. el giro de la cámara generado en Flow) en una secuencia de frames WebP
 * para animar en canvas con ScrollTrigger. Genera versión desktop y móvil + manifest.json.
 *
 * Requisitos: Node 18+ y ffmpeg/ffprobe en el PATH (https://ffmpeg.org/download.html).
 *
 * Uso:
 *   node extract-frames.mjs --input assets-inbox/hero-turntable.mp4 --out public/media/hero/frames
 * Opciones:
 *   --frames 120          frames de la versión desktop (móvil usa la mitad)
 *   --width 1920          ancho desktop en px (móvil usa la mitad)
 *   --start 0 --end 8     recorte del video en segundos (por defecto: todo)
 *   --quality 80          calidad WebP (0-100)
 *   --reverse             invierte el orden (si el video gira al revés de lo que necesita la escena)
 */
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const args = Object.fromEntries(
	process.argv.slice(2).reduce((acc, cur, i, arr) => {
		if (cur.startsWith("--")) {
			const next = arr[i + 1];
			acc.push([cur.slice(2), next && !next.startsWith("--") ? next : true]);
		}
		return acc;
	}, []),
);

function fail(msg) {
	console.error(`x ${msg}`);
	process.exit(1);
}

for (const bin of ["ffmpeg", "ffprobe"]) {
	if (spawnSync(bin, ["-version"], { stdio: "ignore" }).status !== 0) {
		fail(`${bin} no está disponible. Instálalo desde https://ffmpeg.org/download.html y reinicia la terminal.`);
	}
}

const input = args.input;
const out = args.out ?? "public/media/hero/frames";
if (!input || !existsSync(input)) fail("Indica un video existente con --input <ruta>.");

const totalFrames = Number(args.frames ?? 120);
const width = Number(args.width ?? 1920);
const quality = Number(args.quality ?? 80);
const reverse = args.reverse === true;

const duration = Number(
	execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", input]).toString().trim(),
);
const start = Number(args.start ?? 0);
const end = Math.min(Number(args.end ?? duration), duration);
if (!(end > start)) fail(`Rango inválido: start=${start}, end=${end}, duración=${duration.toFixed(2)}s.`);

function extract(variant, count, w) {
	const dir = join(out, variant);
	if (existsSync(dir)) rmSync(dir, { recursive: true });
	mkdirSync(dir, { recursive: true });
	const fps = count / (end - start);
	const filters = [`fps=${fps}`, `scale=${w}:-2:flags=lanczos`];
	if (reverse) filters.push("reverse");
	const result = spawnSync(
		"ffmpeg",
		[
			"-v", "error", "-y",
			"-ss", String(start), "-to", String(end), "-i", input,
			"-vf", filters.join(","),
			"-frames:v", String(count),
			"-c:v", "libwebp", "-quality", String(quality), "-an",
			join(dir, "%04d.webp"),
		],
		{ stdio: "inherit" },
	);
	if (result.status !== 0) fail(`ffmpeg falló al generar la variante ${variant}.`);
	const files = readdirSync(dir).filter((f) => f.endsWith(".webp")).sort();
	const [wOut, hOut] = execFileSync("ffprobe", [
		"-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0:s=x", join(dir, files[0]),
	]).toString().trim().split("x").map(Number);
	return { path: `/${dir.replace(/^public\//, "").replaceAll("\\", "/")}`, pattern: "%04d.webp", count: files.length, width: wOut, height: hOut };
}

function sampleBackground() {
	// Promedia una esquina del primer frame para igualar el color de fondo de la escena con el del video.
	const raw = execFileSync("ffmpeg", [
		"-v", "error", "-ss", String(start), "-i", input, "-frames:v", "1",
		"-vf", "crop=iw*0.04:ih*0.04:0:0,scale=1:1:flags=area", "-f", "rawvideo", "-pix_fmt", "rgb24", "pipe:1",
	]);
	return `#${[...raw.subarray(0, 3)].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

const desktop = extract("desktop", totalFrames, width);
const mobile = extract("mobile", Math.max(2, Math.round(totalFrames / 2)), Math.round(width / 2));
const manifest = {
	source: input.replaceAll("\\", "/"),
	range: { start, end },
	reversed: reverse,
	background: sampleBackground(),
	desktop,
	mobile,
	generatedAt: new Date().toISOString(),
};
writeFileSync(join(out, "manifest.json"), `${JSON.stringify(manifest, null, "\t")}\n`);

console.log(`✓ ${desktop.count} frames desktop (${desktop.width}x${desktop.height}) y ${mobile.count} móvil (${mobile.width}x${mobile.height})`);
console.log(`  Fondo muestreado: ${manifest.background} → úsalo como fondo de la escena para que no se note el borde del video.`);
console.log(`  Manifest: ${join(out, "manifest.json")}`);
