#!/usr/bin/env bash
# Migra un proyecto EXISTENTE de ESLint/Prettier a Biome.
# Para proyectos nuevos no hace falta: usa `create-next-app --biome`.
# Uso (desde la raíz del proyecto):  bash scripts/setup-linter.sh [--yes]
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HELPER="$SCRIPT_DIR/biome-migrate.cjs"
ASSUME_YES="${1:-}"

step() { printf '\n\033[1;34m> %s\033[0m\n' "$1"; }
warn() { printf '\033[1;33m! %s\033[0m\n' "$1"; }
fail() { printf '\033[0;31mx %s\033[0m\n' "$1"; exit 1; }

[ -f package.json ] || fail "No hay package.json en el directorio actual. Ejecuta desde la raíz del proyecto."
[ -f "$HELPER" ] || fail "Falta $HELPER (debe estar junto a este script)."
command -v node >/dev/null || fail "Node.js no está disponible en el PATH."

step "Detectando gestor de paquetes"
if [ -f pnpm-lock.yaml ]; then PM=pnpm; RM=(pnpm remove); ADD=(pnpm add -D -E); BIOME=(pnpm exec biome)
elif [ -f yarn.lock ]; then PM=yarn; RM=(yarn remove); ADD=(yarn add -D -E); BIOME=(yarn biome)
elif [ -f bun.lock ] || [ -f bun.lockb ]; then PM=bun; RM=(bun remove); ADD=(bun add -d -E); BIOME=(bunx biome)
else PM=npm; RM=(npm uninstall); ADD=(npm install --save-dev -E); BIOME=(npx --no-install biome)
fi
command -v "$PM" >/dev/null || fail "Se detectó $PM por el lockfile, pero no está instalado."
echo "  $PM"

mapfile -t DEPS < <(node "$HELPER" deps)
mapfile -t CONFIGS < <(node "$HELPER" configs)

step "Plan"
echo "  Dependencias a eliminar: ${DEPS[*]:-(ninguna)}"
echo "  Archivos a eliminar:     ${CONFIGS[*]:-(ninguno)}"
echo "  Se instalará @biomejs/biome (versión exacta) y se ajustarán biome.json(c), package.json y .vscode/"
if [ "$ASSUME_YES" != "--yes" ]; then
	read -r -p "¿Continuar? [s/N] " answer
	[[ "$answer" =~ ^[sSyY]$ ]] || { echo "Cancelado. No se modificó nada."; exit 0; }
fi

step "Copia de seguridad"
BACKUP=".linter-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP"
for f in package.json pnpm-lock.yaml yarn.lock bun.lock bun.lockb package-lock.json biome.json biome.jsonc "${CONFIGS[@]}"; do
	[ -f "$f" ] && cp "$f" "$BACKUP/"
done
[ -d .vscode ] && cp -r .vscode "$BACKUP/.vscode"
if ! grep -qs '^\.linter-backup-\*/$' .gitignore; then printf '\n.linter-backup-*/\n' >> .gitignore; fi
echo "  $BACKUP/ (ignorada en .gitignore; bórrala cuando confirmes que todo funciona)"

if [ "${#DEPS[@]}" -gt 0 ]; then
	step "Eliminando dependencias de ESLint/Prettier"
	"${RM[@]}" "${DEPS[@]}"
fi

if [ "${#CONFIGS[@]}" -gt 0 ]; then
	step "Eliminando configuración de ESLint/Prettier"
	for f in "${CONFIGS[@]}"; do rm -f "$f" && echo "  - $f"; done
fi

step "Instalando Biome"
"${ADD[@]}" @biomejs/biome
"${BIOME[@]}" --version

if [ ! -f biome.json ] && [ ! -f biome.jsonc ]; then
	step "Inicializando configuración"
	"${BIOME[@]}" init
fi

step "Configurando Biome, scripts y editor"
set +e
node "$HELPER" configure
CONFIGURE_STATUS=$?
set -e
[ "$CONFIGURE_STATUS" -eq 1 ] && fail "La configuración falló."

step "Aplicando formato y correcciones seguras"
set +e
"${BIOME[@]}" check --write .
step "Comprobación final (sin escribir)"
"${BIOME[@]}" check .
CHECK_STATUS=$?
set -e

echo ""
if [ "$CHECK_STATUS" -ne 0 ]; then
	warn "Biome quedó instalado, pero reporta diagnósticos que hay que corregir (no se ocultan)."
	exit 1
fi
[ "$CONFIGURE_STATUS" -eq 2 ] && { warn "Migración aplicada con pasos manuales pendientes (ver arriba)."; exit 2; }
printf '\033[0;32m✓ Migración a Biome completada y verificada.\033[0m\n'
