#!/usr/bin/env node
/**
 * Genera las skills /kit-* a partir de los prompts del kit, para que haya una sola fuente de verdad.
 * Uso (desde la raíz del kit): node scripts/build-skills.mjs
 * Edita siempre los prompts .md y vuelve a ejecutar este script; no edites skills/kit-* a mano.
 */
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SKILLS = [
	["01-brief-de-marca-y-producto.md", "kit-brief", "Fase 01 del kit: entrevista al usuario y produce el brief de marca, público y producto en docs/01-brief.md sin inventar datos comerciales."],
	["02-direccion-de-arte.md", "kit-direccion-arte", "Fase 02 del kit: presenta y aprueba bloque a bloque la dirección de arte (paleta, tipografía, retícula, texturas, fotografía) y la convierte en tokens."],
	["03-arquitectura-y-contenido.md", "kit-arquitectura-contenido", "Fase 03 del kit: define páginas, secciones con IDs, textos y microcopy aprobados, y crea el esqueleto navegable."],
	["03b-imagenes-y-assets.md", "kit-assets", "Fase 03B del kit: lista los huecos de imagen, inventaria y evalúa imágenes existentes, decide fuentes, escribe prompts de IA coherentes y procesa imágenes y secuencias de frames."],
	["04-sistema-de-motion.md", "kit-motion", "Fase 04 del kit: define principios, tokens, convenciones técnicas y mapa de coreografía de motion con GSAP, y crea componentes base de reveal."],
	["05-escena-hero-camara.md", "kit-escena-hero", "Fase 05 del kit: construye por fases la escena hero de scroll (nombre, giro de la cámara, acercamiento al visor, paisaje y tarjeta)."],
	["06-galeria-de-columnas.md", "kit-galeria-columnas", "Fase 06 del kit: construye la galería split-screen con columnas de fotos en parallax de direcciones opuestas."],
	["07-transiciones-entre-secciones.md", "kit-transiciones", "Fase 07 del kit: define e implementa transiciones entre secciones (cover, reveal, sticky card stacking, revelado de foto, footer reveal)."],
	["08-producto-y-ecommerce.md", "kit-ecommerce", "Fase 08 del kit: página de producto, variantes, carrito y checkout accesibles, con mock o reutilizando un backend existente."],
	["09-ui-global-y-microinteracciones.md", "kit-ui-global", "Fase 09 del kit: preloader, navbar, cursor, botones, newsletter, acordeón y transiciones entre páginas."],
	["10-calidad-rendimiento-accesibilidad.md", "kit-calidad", "Fase 10 del kit: audita fidelidad al plan, rendimiento, motion, accesibilidad, SEO, assets y prepara el despliegue."],
	["plantilla-especificar-una-escena.md", "kit-nueva-escena", "Especifica e implementa una escena o transición nueva con la fórmula término + elemento + activación + evolución + final + adaptación."],
];

const root = process.cwd();
for (const [file, name, description] of SKILLS) {
	const source = join(root, file);
	if (!existsSync(source)) throw new Error(`No existe ${file}`);
	const text = readFileSync(source, "utf8");
	const title = text.match(/^#\s+(.+)$/m)?.[1] ?? name;
	const separator = text.indexOf("\n---\n");
	const body = separator >= 0 ? text.slice(separator + 5).trimStart() : text;

	const dir = join(root, "skills", name);
	if (existsSync(dir)) rmSync(dir, { recursive: true });
	mkdirSync(dir, { recursive: true });
	writeFileSync(
		join(dir, "SKILL.md"),
		`---
name: ${name}
description: ${JSON.stringify(description)}
disable-model-invocation: true
---

<!-- Generado desde ${file} con scripts/build-skills.mjs. No editar a mano. -->

# ${title}

> Invocada con \`/${name}\`. Empieza cada fase en un chat nuevo. Si el usuario escribió algo junto al comando, tómalo como contexto adicional, no como reemplazo de este protocolo.

${body}`,
	);

	if (name === "kit-assets") {
		cpSync(join(root, "scripts", "assets"), join(dir, "scripts"), { recursive: true });
	}
	console.log(`✓ /${name}`);
}

const orphans = readdirSync(join(root, "skills")).filter(
	(d) => d.startsWith("kit-") && !SKILLS.some(([, n]) => n === d),
);
for (const d of orphans) console.warn(`! skills/${d} no corresponde a ningún prompt; revísala o bórrala.`);
