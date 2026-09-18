#!/usr/bin/env node
/**
 * Procesa las imágenes del proyecto a partir de src/content/assets.json.
 *
 * Requisitos: Node 18+ y la dependencia de desarrollo `sharp` (solo para el modo por defecto).
 *
 * Uso:
 *   node process-images.mjs                 procesa los huecos con "source" y actualiza el manifest
 *   node process-images.mjs --placeholders  crea SVG temporales para los huecos sin imagen (no requiere sharp)
 *   node process-images.mjs --check         solo informa el estado, sin escribir
 * Opciones:
 *   --manifest src/content/assets.json  --out public/media  --quality 82  --crop (recorta al ratio del hueco si no coincide)
 *
 * Formato de cada hueco en src/content/assets.json → { "slots": [ ... ] }:
 *   { "id": "gallery-01", "group": "gallery", "ratio": "4:5", "minWidth": 1200, "maxWidth": 1600,
 *     "alt": "Persona caminando en una playa de arena negra", "source": "assets-inbox/gallery-01.jpg",
 *     "origin": "pack | propia | stock | ia | placeholder", "license": "texto o URL",
 *     "status": "pendiente | placeholder | listo | revisar", "notes": [] }
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";

const argv = process.argv.slice(2);
const flag = (name) => argv.includes(`--${name}`);
const option = (name, fallback) => {
	const i = argv.indexOf(`--${name}`);
	return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : fallback;
};

const manifestPath = option("manifest", "src/content/assets.json");
const outRoot = option("out", "public/media");
const quality = Number(option("quality", 82));
if (!existsSync(manifestPath)) {
	console.error(`x No existe ${manifestPath}. Créalo con el prompt 03B o la skill /kit-assets.`);
	process.exit(1);
}
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const slots = manifest.slots ?? [];

const parseRatio = (ratio) => {
	const [w, h] = String(ratio).split(":").map(Number);
	return w > 0 && h > 0 ? w / h : null;
};
const publicUrl = (file) => `/${file.replace(/^public[\\/]/, "").replaceAll("\\", "/")}`;

function placeholderSvg(slot) {
	const r = parseRatio(slot.ratio) ?? 1;
	const w = 1200;
	const h = Math.round(w / r);
	const label = `${slot.id} · ${slot.ratio ?? "?"}`.replace(/[<&>]/g, "");
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="Imagen pendiente ${label}">
	<rect width="100%" height="100%" fill="#E8E5DE"/>
	<path d="M0 0L${w} ${h}M${w} 0L0 ${h}" stroke="#D6D2C8" stroke-width="2"/>
	<text x="50%" y="50%" fill="#5C5A55" font-family="ui-monospace, monospace" font-size="${Math.round(w / 28)}" text-anchor="middle" dominant-baseline="middle">${label}</text>
</svg>
`;
}

if (flag("check")) {
	const byStatus = Object.groupBy ? Object.groupBy(slots, (s) => s.status ?? "pendiente") : {};
	for (const [status, list] of Object.entries(byStatus)) console.log(`${status}: ${list.map((s) => s.id).join(", ")}`);
	process.exit(0);
}

if (flag("placeholders")) {
	let created = 0;
	for (const slot of slots) {
		if (slot.status === "listo" || slot.status === "revisar") continue;
		if (slot.source && existsSync(slot.source)) continue;
		const file = join(outRoot, "_placeholders", `${slot.id}.svg`);
		mkdirSync(dirname(file), { recursive: true });
		writeFileSync(file, placeholderSvg(slot));
		const r = parseRatio(slot.ratio) ?? 1;
		Object.assign(slot, { output: publicUrl(file), width: 1200, height: Math.round(1200 / r), status: "placeholder", origin: slot.origin ?? "placeholder" });
		created++;
	}
	writeFileSync(manifestPath, `${JSON.stringify(manifest, null, "\t")}\n`);
	console.log(`✓ ${created} placeholders creados en ${join(outRoot, "_placeholders")}`);
	process.exit(0);
}

let sharp;
try {
	// Resuelve sharp desde el proyecto actual (el script puede vivir en .cursor/skills/...).
	const require = createRequire(join(process.cwd(), "package.json"));
	sharp = (await import(pathToFileURL(require.resolve("sharp")).href)).default;
} catch {
	console.error("x Falta la dependencia de desarrollo `sharp`. Pide aprobación e instálala con el gestor del proyecto (p. ej. `pnpm add -D sharp`).");
	process.exit(1);
}

let processed = 0;
for (const slot of slots) {
	if (!slot.source) continue;
	if (!existsSync(slot.source)) {
		slot.status = "pendiente";
		slot.notes = [`No se encontró ${slot.source}`];
		continue;
	}
	const notes = [];
	let pipeline = sharp(slot.source).rotate();
	const meta = await sharp(slot.source).rotate().metadata();
	const srcW = meta.autoOrient?.width ?? meta.width;
	const srcH = meta.autoOrient?.height ?? meta.height;
	const target = parseRatio(slot.ratio);
	const actual = srcW / srcH;

	let finalW = srcW;
	let finalH = srcH;
	if (target && Math.abs(actual - target) / target > 0.02) {
		if (flag("crop")) {
			finalW = actual > target ? Math.round(srcH * target) : srcW;
			finalH = actual > target ? srcH : Math.round(srcW / target);
			pipeline = pipeline.resize(finalW, finalH, { fit: "cover", position: "attention" });
			notes.push(`Recortada de ${srcW}x${srcH} al ratio ${slot.ratio} (revisar encuadre).`);
		} else {
			notes.push(`Ratio ${srcW}x${srcH} no coincide con ${slot.ratio}. Usa --crop o reemplázala.`);
		}
	}
	const maxW = Number(slot.maxWidth ?? 2400);
	if (finalW > maxW) {
		finalH = Math.round((finalH * maxW) / finalW);
		finalW = maxW;
	}
	if (slot.minWidth && finalW < Number(slot.minWidth)) notes.push(`Ancho ${finalW}px menor al mínimo ${slot.minWidth}px.`);

	const file = join(outRoot, slot.group ?? "misc", `${slot.id}.webp`);
	mkdirSync(dirname(file), { recursive: true });
	const info = await pipeline.resize({ width: finalW, withoutEnlargement: true }).webp({ quality }).toFile(file);
	const blur = await sharp(file).resize(16).webp({ quality: 40 }).toBuffer();

	Object.assign(slot, {
		output: publicUrl(file),
		width: info.width,
		height: info.height,
		blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
		status: notes.length ? "revisar" : "listo",
		notes,
	});
	processed++;
	console.log(`${notes.length ? "!" : "✓"} ${slot.id} → ${slot.output} (${info.width}x${info.height})${notes.length ? `\n    ${notes.join("\n    ")}` : ""}`);
}

writeFileSync(manifestPath, `${JSON.stringify(manifest, null, "\t")}\n`);
console.log(`\n${processed} imágenes procesadas. Estado actualizado en ${manifestPath}.`);
