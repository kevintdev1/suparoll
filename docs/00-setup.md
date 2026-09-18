# 00 — Setup

Registro de la ejecución del prompt `00a-setup-desde-cero.md`.

## Decisiones confirmadas

| Decisión | Valor |
|---|---|
| Nombre del paquete | `suparoll` |
| Gestor de paquetes | pnpm |
| Linter / formateador | Biome |
| Formularios | Sí — `react-hook-form`, `zod`, `@hookform/resolvers` |
| Iconos | `lucide-react` |
| Smooth scroll | Lenis + ScrollTrigger |
| Dependencias 3D | No instaladas (se decidirá en prompt 05) |
| Git | Inicializado sin commit (por `create-next-app`) |
| Despliegue | Vercel (sin desplegar en este paso) |

## Versiones observadas en el entorno

| Herramienta | Versión |
|---|---|
| Node.js | 24.19.0 |
| pnpm | 12.4.1 |
| Next.js | 16.3.5 |
| React | 19.2.8 |
| TypeScript | 5.9.3 |
| Tailwind CSS | 4.3.3 |
| Biome | 2.4.2 |
| GSAP | 3.15.0 |
| Lenis | 1.3.26 |
| Zod | 4.6.5 |

## Adaptaciones realizadas

- `workshop-kit/` se movió temporalmente fuera del proyecto durante `create-next-app` y se restauró al terminar.
- `create-next-app` inicializó git automáticamente; no se creó commit inicial.
- Biome ya incluía `css.parser.tailwindDirectives: true` en la plantilla generada.
- Se añadió `.node-version` con `24.19.0` y `engines.node` con `>=20.9.0`.
- Se excluyeron `.cursor/`, `.agents/` y `workshop-kit/` del alcance de Biome para evitar falsos positivos en skills y scripts del kit.

## Skills instaladas

### Kit (`.cursor/skills/`)

Copiadas desde `workshop-kit/skills/`:

- `gsap-scroll-mastery` — scroll animations (auto-aplicable)
- `kit-arquitectura-contenido`, `kit-assets`, `kit-brief`, `kit-calidad`, `kit-direccion-arte`, `kit-ecommerce`, `kit-escena-hero`, `kit-galeria-columnas`, `kit-motion`, `kit-nueva-escena`, `kit-transiciones`, `kit-ui-global` — fases del workshop (invocación manual con `/kit-…`)

### Stack (`.agents/skills/` vía autoskills)

Instaladas 23 skills con `npx autoskills -y -a cursor`:

| Skill | Tecnología | Para qué sirve |
|---|---|---|
| react-best-practices | React | Patrones de rendimiento y composición |
| composition-patterns | React | Patrones de composición avanzados |
| next-best-practices | Next.js | Convenciones App Router |
| next-cache-components | Next.js | Cache Components |
| next-upgrade | Next.js | Guía de upgrades |
| tailwind-css-patterns | Tailwind CSS | Patrones de estilos |
| typescript-advanced-types | TypeScript | Tipos avanzados |
| react-hook-form | React Hook Form | Formularios |
| zod | Zod | Validación |
| gsap-core, gsap-scrolltrigger, gsap-performance, gsap-plugins, gsap-timeline, gsap-utils, gsap-frameworks, gsap-react | GSAP | API y patrones de animación |
| nodejs-backend-patterns, nodejs-best-practices | Node.js | Patrones backend |
| bash-defensive-patterns | Bash | Scripts defensivos |
| frontend-design | Frontend | Diseño UI |
| accessibility, seo | Frontend | Calidad web |

**Omisiones:** ninguna en esta ejecución (lista completa aprobada implícitamente al confirmar el plan).

### Descubrimiento (`.agents/skills/find-skills/`)

- `find-skills` — buscar skills adicionales cuando surja una necesidad nueva.

## Bloqueos / pendientes

- **ffmpeg:** no detectado en el entorno. Necesario solo para el prompt 03B (extracción de frames de video).
- **Verificación visual del scroll:** confirmar manualmente que el cuadrado rota suavemente con el scroll y que los markers de ScrollTrigger son visibles en el bloque 2.

## Verificación de esta ejecución

| Comprobación | Resultado |
|---|---|
| `pnpm install --frozen-lockfile` | OK |
| `pnpm lint` | OK (13 archivos; se excluyeron `.cursor/`, `.agents/` y `workshop-kit/` en `biome.json`) |
| `pnpm typecheck` | OK |
| `pnpm build` | OK |
| `pnpm dev` | OK — servidor en http://localhost:3001 (3000 ocupado por otro proceso) |
| Página responde con "suparoll" y "Base lista" | OK (curl) |
| Rotación del cuadrado con scroll | No verificado visualmente — confirmar en el navegador |
