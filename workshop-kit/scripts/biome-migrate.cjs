#!/usr/bin/env node
/*
 * Lógica compartida por setup-linter.sh y setup-linter.ps1.
 * Uso:
 *   node biome-migrate.cjs deps       -> dependencias ESLint/Prettier a eliminar (una por línea)
 *   node biome-migrate.cjs configs    -> archivos de configuración ESLint/Prettier presentes (uno por línea)
 *   node biome-migrate.cjs configure  -> ajusta biome.json(c), scripts de package.json y .vscode
 * Código de salida de "configure": 0 = todo aplicado, 2 = aplicado con pasos manuales pendientes.
 * Nunca sobrescribe un archivo que no pudo leer (p. ej. JSON con comentarios): lo reporta como pendiente.
 */
const fs = require("node:fs");

const DEP_PATTERN = /^(eslint|prettier|@typescript-eslint\/|eslint-plugin-|eslint-config-|@eslint\/|@next\/eslint-plugin-next$)/;
const CONFIG_FILES = [
	".eslintrc", ".eslintrc.js", ".eslintrc.cjs", ".eslintrc.yaml", ".eslintrc.yml", ".eslintrc.json",
	"eslint.config.js", "eslint.config.mjs", "eslint.config.cjs", "eslint.config.ts", ".eslintignore",
	".prettierrc", ".prettierrc.json", ".prettierrc.yml", ".prettierrc.yaml", ".prettierrc.json5",
	".prettierrc.js", ".prettierrc.cjs", ".prettierrc.mjs", "prettier.config.js", "prettier.config.cjs",
	"prettier.config.mjs", ".prettierignore",
];

const pending = [];
const log = (msg) => console.log(`  ${msg}`);

function readJson(path) {
	if (!fs.existsSync(path)) return { exists: false, data: null };
	try {
		return { exists: true, data: JSON.parse(fs.readFileSync(path, "utf8")) };
	} catch {
		return { exists: true, data: null };
	}
}

function detectIndent(path) {
	const text = fs.readFileSync(path, "utf8");
	const match = text.match(/\n([ \t]+)"/);
	return match ? match[1] : "\t";
}

function writeJson(path, data) {
	const indent = fs.existsSync(path) ? detectIndent(path) : "\t";
	fs.writeFileSync(path, `${JSON.stringify(data, null, indent)}\n`);
}

function pkg() {
	const { data } = readJson("package.json");
	if (!data) {
		console.error("No se pudo leer package.json.");
		process.exit(1);
	}
	return data;
}

function listDeps() {
	const p = pkg();
	const all = { ...p.dependencies, ...p.devDependencies };
	return Object.keys(all).filter((d) => DEP_PATTERN.test(d));
}

function configureBiome() {
	const path = fs.existsSync("biome.json") ? "biome.json" : fs.existsSync("biome.jsonc") ? "biome.jsonc" : null;
	if (!path) {
		pending.push("No existe biome.json ni biome.jsonc: ejecuta `biome init` y vuelve a correr el script.");
		return;
	}
	const { data } = readJson(path);
	if (!data) {
		pending.push(`${path} no es JSON estricto (¿tiene comentarios?). No se modificó. Aplica a mano: vcs.useIgnoreFile, assist organizeImports y, si usas Tailwind, css.parser.tailwindDirectives.`);
		return;
	}
	data.vcs = { ...data.vcs, enabled: true, clientKind: "git", useIgnoreFile: true };
	data.formatter = { ...data.formatter, enabled: true };
	data.linter = { ...data.linter, enabled: true };
	data.javascript = data.javascript || {};
	data.javascript.formatter = { quoteStyle: "double", ...data.javascript.formatter };
	data.assist = data.assist || {};
	data.assist.enabled = true;
	data.assist.actions = data.assist.actions || {};
	data.assist.actions.source = { ...data.assist.actions.source, organizeImports: "on" };

	const p = pkg();
	const all = { ...p.dependencies, ...p.devDependencies };
	if (all.tailwindcss || all["@tailwindcss/postcss"]) {
		data.css = data.css || {};
		data.css.parser = { ...data.css.parser, tailwindDirectives: true };
		log("Tailwind detectado: css.parser.tailwindDirectives = true");
	}
	writeJson(path, data);
	log(`${path} actualizado.`);
}

function configureScripts() {
	const p = pkg();
	p.scripts = p.scripts || {};
	p.scripts.lint = "biome check .";
	p.scripts.format = "biome format --write .";
	for (const [name, cmd] of Object.entries(p.scripts)) {
		if (/\b(eslint|prettier|next lint)\b/.test(cmd)) {
			pending.push(`El script "${name}" aún invoca ESLint/Prettier: "${cmd}". Revísalo a mano.`);
		}
	}
	writeJson("package.json", p);
	log("package.json: scripts lint y format apuntan a Biome.");
}

function configureVscode() {
	fs.mkdirSync(".vscode", { recursive: true });

	const settingsPath = ".vscode/settings.json";
	const settings = readJson(settingsPath);
	if (settings.exists && !settings.data) {
		pending.push(`${settingsPath} no es JSON estricto (¿comentarios?). No se modificó para no perder ajustes. Configura Biome como formateador a mano.`);
	} else {
		const s = settings.data || {};
		s["editor.defaultFormatter"] = "biomejs.biome";
		s["editor.formatOnSave"] = true;
		s["editor.codeActionsOnSave"] = {
			...s["editor.codeActionsOnSave"],
			"source.organizeImports.biome": "explicit",
			"source.fixAll.biome": "explicit",
		};
		for (const lang of ["typescript", "typescriptreact", "javascript", "javascriptreact", "json", "jsonc", "css"]) {
			s[`[${lang}]`] = { ...s[`[${lang}]`], "editor.defaultFormatter": "biomejs.biome" };
		}
		writeJson(settingsPath, s);
		log(`${settingsPath} actualizado.`);
	}

	const extPath = ".vscode/extensions.json";
	const ext = readJson(extPath);
	if (ext.exists && !ext.data) {
		pending.push(`${extPath} no es JSON estricto. Añade "biomejs.biome" a recommendations a mano.`);
	} else {
		const e = ext.data || {};
		e.recommendations = e.recommendations || [];
		if (!e.recommendations.includes("biomejs.biome")) e.recommendations.push("biomejs.biome");
		writeJson(extPath, e);
		log(`${extPath} recomienda biomejs.biome.`);
	}
}

const cmd = process.argv[2];
if (cmd === "deps") {
	for (const d of listDeps()) console.log(d);
} else if (cmd === "configs") {
	for (const f of CONFIG_FILES) if (fs.existsSync(f)) console.log(f);
} else if (cmd === "configure") {
	configureBiome();
	configureScripts();
	configureVscode();
	if (pending.length) {
		console.log("\nPasos manuales pendientes:");
		for (const p of pending) console.log(`  - ${p}`);
		process.exit(2);
	}
} else {
	console.error("Uso: node biome-migrate.cjs <deps|configs|configure>");
	process.exit(1);
}
