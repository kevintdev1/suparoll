# suparoll

Base técnica del proyecto. Las especificaciones de producto, diseño y motion se definen en `docs/`.

## Stack

| Tecnología | Versión |
|---|---|
| Next.js | 16.3.5 |
| React | 19.2.8 |
| TypeScript | 5.9.3 |
| Tailwind CSS | 4.3.3 |
| Biome | 2.4.2 |
| GSAP | 3.15.0 |
| Lenis | 1.3.26 |
| React Hook Form | 7.88.0 |
| Zod | 4.6.5 |
| lucide-react | 1.46.0 |

## Requisitos

- **Node.js** >= 20.9.0 (observado: 24.19.0). Descarga: https://nodejs.org/en/download
- **pnpm** 12.4.1 (registrado en `packageManager`). Instalación: https://pnpm.io/installation

## Inicio local

```bash
pnpm install
pnpm dev
```

Abre la URL que imprime el servidor (por defecto http://localhost:3000).

## Scripts

| Script | Qué hace | Modifica archivos |
|---|---|---|
| `pnpm dev` | Servidor de desarrollo | No |
| `pnpm build` | Build de producción | No (genera `.next/`) |
| `pnpm start` | Sirve el build | No |
| `pnpm lint` | Revisa con Biome | No |
| `pnpm format` | Formatea con Biome | Sí |
| `pnpm typecheck` | Comprueba tipos (`tsc --noEmit`) | No |

## Estructura existente

```
src/
├─ app/                    # Rutas Next.js
├─ features/landing/       # Secciones y escenas (vacías, con .gitkeep)
├─ shared/
│  ├─ components/
│  │  ├─ layout/          # SmoothScroll
│  │  └─ ui/forms/        # (vacío)
│  ├─ lib/motion/         # gsap.ts — registro central de GSAP
│  ├─ hooks/
│  └─ validations/
└─ content/
public/media/              # hero, gallery, product, textures
docs/                      # Decisiones del proyecto
.cursor/
├─ rules/                  # arquitectura.mdc, proyecto.mdc
└─ skills/                 # Skills del workshop-kit
workshop-kit/              # Kit del workshop (referencia)
```

## Linter y editor

El proyecto usa **Biome** para lint, formato y organización de imports.

Recomendación de extensión: `biomejs.biome` (ver `.vscode/extensions.json`).

Para instalarla en Cursor: abre la paleta de extensiones, busca "Biome" e instala la extensión oficial. Con `.vscode/settings.json` ya configurado, el formato al guardar funcionará automáticamente.

## Guía para continuar con IA

1. Lee este `README.md`, los archivos de `docs/` y las reglas en `.cursor/rules/`.
2. Usa **pnpm** (el gestor registrado en `packageManager`).
3. Antes de entregar cambios, ejecuta `pnpm lint` y `pnpm typecheck`.
4. Importa GSAP solo desde `@/shared/lib/motion/gsap`.
5. Las fases del workshop se invocan con `/kit-…` en un chat nuevo.
6. Actualiza `docs/` cuando cambien comandos, decisiones o dependencias.

## Verificación del setup (00a)

- Proyecto creado en la carpeta actual (sin subcarpeta de aplicación).
- `workshop-kit/` restaurado tras `create-next-app`.
- Página temporal con 3 bloques de 100svh y cuadrado animado con ScrollTrigger + Lenis.
- Skills del kit, autoskills de stack y `find-skills` instaladas (detalle en `docs/00-setup.md`).

## Pendientes conocidos

- **ffmpeg** no está instalado en el entorno (necesario solo para prompt 03B).
