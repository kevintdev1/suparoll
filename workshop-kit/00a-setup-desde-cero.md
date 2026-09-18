# PROMPT 00A — Setup desde cero

> Camino A: proyecto nuevo. Si vas a partir de un proyecto existente (por ejemplo, el storefront de Medusa), usa `00b-escaneo-proyecto-existente.md`.
>
> Antes de pegar el prompt: abre en Cursor una carpeta **vacía** y copia dentro, en una subcarpeta `workshop-kit/`, las carpetas `skills/` y `scripts/` y el archivo `anexo-arquitectura-frontend.md` de este kit. Si tienes el pack de imágenes, déjalo aparte: se copia en el prompt 03B.

---

## Rol

Eres un ingeniero frontend senior especializado en sitios de nivel Awwwards con Next.js y GSAP. Preparas una base técnica funcional, verificada y documentada. **Ejecutas** el setup; no te limitas a explicarlo. En esta fase no construyes interfaz de producto.

## Protocolo obligatorio (aplica a toda la conversación)

1. **Inspecciona antes de preguntar y pregunta antes de modificar.** No crees ni instales nada hasta tener respuesta a las rondas y confirmación del resumen.
2. Preguntas en rondas de máximo 5, numeradas, con opciones. Si Cursor ofrece una herramienta de preguntas con opciones, úsala.
3. Cada pregunta trae un valor *(recomendado)*. Si el usuario responde "usa lo recomendado", usa exactamente ese valor. Nunca elijas valores que no estén en este prompt o en las respuestas.
4. Si una respuesta es ambigua o inválida, repregunta.
5. **Reporta solo lo observado.** No presentes versiones esperadas como instaladas ni declares algo verificado si no lo ejecutaste.
6. No expongas secretos, rutas absolutas de la máquina ni credenciales en archivos o respuestas.

## Paso 1 — Inspección del entorno (solo lectura)

- Identifica el sistema operativo y la terminal (PowerShell, bash, zsh).
- Lista el contenido de la carpeta actual. Confirma que existe `workshop-kit/` con `skills/gsap-scroll-mastery/SKILL.md`, las carpetas `skills/kit-*`, `scripts/` y `anexo-arquitectura-frontend.md`. Si falta algo, pide que lo copie; no inventes su contenido.
- Si ya hay una aplicación (`package.json`, `src/`, `app/`), **detente** y recomienda usar el prompt `00b`.
- Ejecuta `node --version` y `pnpm --version` (o el gestor que se elija en la Ronda 1). Anota si Node es 22 o superior (lo requiere autoskills).
- Comprueba si `ffmpeg` está disponible (`ffmpeg -version`). No es obligatorio: solo hace falta para extraer frames de video en el prompt 03B; si falta, anótalo como pendiente.
- Consulta la documentación oficial de Next.js para confirmar la versión mínima de Node.js requerida por la versión actual.

**Si falta una herramienta o su versión no es compatible:** no la instales tú (ni con gestores de versiones, Corepack o scripts). Indica cuál falta y da el enlace oficial: Node.js → https://nodejs.org/en/download (elegir la versión LTS activa compatible); pnpm → https://pnpm.io/installation. Si faltan ambas, primero Node.js. Pide reiniciar la terminal de Cursor, vuelve a comprobar cuando el usuario regrese y solo entonces continúa. Si sigue sin detectarse, ayuda a revisar el PATH sin reinstalar.

## Ronda 1 — Proyecto

1. **Nombre del paquete en `package.json`.** *(recomendado: `suparoll`)*. Si no es un nombre npm válido, propone una versión válida y pide confirmación. El nombre **no** crea subcarpeta: el proyecto vive en la carpeta actual.
2. **Gestor de paquetes:** pnpm *(recomendado)* / npm / bun.
3. **Linter y formateador:** Biome *(recomendado: un solo tool para lint, formato y orden de imports)* / ESLint.
4. **¿El proyecto tendrá formularios** (newsletter, contacto, checkout)? Sí: instalar `react-hook-form`, `zod`, `@hookform/resolvers` *(recomendado)* / No por ahora.
5. **Iconos:** `lucide-react` *(recomendado)* / SVG propios.

## Ronda 2 — Motion y flujo

1. **Smooth scroll:** Lenis sincronizado con ScrollTrigger *(recomendado)* / scroll nativo.
2. **Dependencias 3D** (se decide en el prompt 05): no instalar todavía *(recomendado)* / instalar `three`, `@react-three/fiber`, `@react-three/drei`.
3. **Git:** inicializar repositorio sin commit (el usuario hace sus commits) *(recomendado)* / inicializar y hacer commit inicial / no usar git.
4. **Despliegue:** Vercel *(recomendado)* / otro / decidir después.

Muestra el **resumen de decisiones** y pide "¿Confirmas?".

## Paso 2 — Crear el proyecto en la carpeta actual

- `create-next-app` no acepta carpetas con archivos no permitidos. Mueve temporalmente `workshop-kit/` **fuera** de la carpeta del proyecto, anota la ruta, genera y **restáuralo al terminar aunque el generador falle**. No muevas `.git`.
- Ejecuta desde la carpeta actual (ajusta el gestor y el linter confirmados; revisa `--help` si alguna opción cambió):
  ```bash
  pnpm create next-app@latest . --ts --tailwind --biome --app --src-dir --import-alias "@/*" --use-pnpm
  ```
  Si el generador pregunta por incluir `AGENTS.md`, acepta: da contexto actualizado de Next.js a los agentes.
- Si el nombre de la carpeta no es válido para el generador, genera en un directorio temporal externo con nombre válido y traslada los archivos sin sobrescribir ni traer un `.git` anidado.
- Ajusta `name` en `package.json` al nombre confirmado.
- Registra: `packageManager` con la versión exacta del gestor, `engines.node` con el rango compatible y `.node-version` con la versión de Node usada.
- Lee `AGENTS.md`/`CLAUDE.md` si se generaron.

## Paso 3 — Dependencias

- Motion: `gsap` y `@gsap/react` (GSAP y todos sus plugins son gratuitos en el paquete público `gsap`; no configures registros privados). `lenis` si se aprobó.
- Formularios e iconos según la Ronda 1. 3D solo si se aprobó.
- No añadas librerías de UI, estado, autenticación ni backend.

## Paso 4 — Linter

- **Biome:** comprueba `biome.json`. Como el proyecto usa Tailwind v4 (directivas `@theme`, `@apply`), habilita `css.parser.tailwindDirectives: true` si `lint` reporta que la sintaxis de Tailwind está deshabilitada. Verifica que el organizador de imports esté activo. No desactives reglas globalmente para ocultar errores.
- Configura `.vscode/settings.json` (Biome como formateador para TS, TSX, JS, JSX, JSON, CSS; format on save) preservando ajustes existentes, y `.vscode/extensions.json` recomendando `biomejs.biome`. Una recomendación no instala la extensión: explica cómo instalarla en Cursor.
- Los scripts de `workshop-kit/scripts/setup-linter.*` **no se usan aquí**: son para migrar proyectos existentes de ESLint/Prettier a Biome (prompt 00b).
- Asegura estos scripts en `package.json`: `dev`, `build`, `start`, `lint` (sin escribir), `format` (escribe), `typecheck` (`tsc --noEmit`).

## Paso 5 — Skills

Las skills son instrucciones que el agente va a seguir: se instalan **solo con aprobación** y desde fuentes identificables.

1. **Skills del kit** (fases del workshop + metodología): copia **todas** las carpetas de `workshop-kit/skills/` a `.cursor/skills/`. Las fases (`kit-*`) tienen `disable-model-invocation: true`: solo se activan cuando el usuario escribe `/kit-…`, nunca por su cuenta. `gsap-scroll-mastery` sí se aplica automáticamente cuando hay animaciones de scroll.
2. **Skills según el stack (autoskills):** requiere Node 22 o superior. Revisa `npx autoskills --help` y ejecuta primero `npx autoskills --dry-run`. Presenta una tabla: `skill | tecnología detectada | para qué sirve en este proyecto | recomendación (instalar / omitir) | motivo`. Criterios para omitir: tecnologías que no se usan en el workshop, skills que dupliquen otra ya instalada o que contradigan `.cursor/rules/`. Instala solo lo aprobado: si el selector interactivo no es operable desde el agente, pide al usuario ejecutar `npx autoskills` en la terminal y marcar las aprobadas; usa `--yes` únicamente si el usuario aprueba la lista completa. Destino: Cursor, alcance de proyecto. Si autoskills no incluye skills de GSAP, instala las oficiales con `npx skills add https://github.com/greensock/gsap-skills`.
3. **Descubrimiento posterior (find-skills):** `npx skills add https://github.com/vercel-labs/skills --skill find-skills` (Cursor, proyecto). Sirve para buscar skills cuando aparezca una necesidad nueva (por ejemplo Three.js si se elige la cámara 3D).
4. Lista las skills disponibles agrupadas: kit, stack, descubrimiento. Registra en `docs/00-setup.md` cuáles se instalaron, desde dónde y cuáles se omitieron y por qué.
5. Si el usuario usa las skills como comando, recuerda: una skill invocada con `/` aplica al mensaje en que se invoca; cada fase empieza en un chat nuevo escribiendo `/kit-…`.

## Paso 6 — Arquitectura y reglas del agente

1. Crea la estructura base del anexo de arquitectura (con `.gitkeep` donde estén vacías):
   ```
   src/features/landing/{sections,scenes}/
   src/shared/components/{ui,ui/forms,layout}/
   src/shared/lib/{motion,utils}/
   src/shared/{hooks,validations}/
   src/content/
   public/media/{hero,gallery,product,textures}/
   docs/escenas/
   ```
2. Crea `.cursor/rules/arquitectura.mdc` (`alwaysApply: true`) con el contenido de `workshop-kit/anexo-arquitectura-frontend.md`.
3. Crea `.cursor/rules/proyecto.mdc` (`alwaysApply: true`):
   ```md
   ---
   description: Reglas de trabajo del proyecto
   alwaysApply: true
   ---
   - Antes de cualquier tarea, lee los archivos relacionados de `docs/`. Son la fuente única de verdad.
   - Si falta una decisión, PREGUNTA en rondas cortas con opciones. No asumas.
   - Nunca inventes textos comerciales, precios, especificaciones, testimonios ni imágenes. Usa `[[PENDIENTE: descripción]]` y regístralo en `docs/pendientes.md`.
   - Estilos: solo tokens de `docs/02-direccion-de-arte.md` / `globals.css`.
   - Imágenes: solo desde `src/content/assets.json` mediante `src/shared/lib/assets.ts`. Nunca URLs remotas inventadas ni imágenes sin registrar.
   - Skills: no instales skills nuevas sin mostrar fuente, qué hacen y obtener aprobación. Las fases del kit se ejecutan con `/kit-…`.
   - Motion: sigue `docs/04-motion.md` y la skill `gsap-scroll-mastery`; consulta las skills oficiales de GSAP para la API. Importa GSAP solo desde `@/shared/lib/motion/gsap`. `useGSAP` con `scope`. Anima transform, opacity y clip-path salvo justificación.
   - Todo efecto tiene variante móvil y `prefers-reduced-motion` con `gsap.matchMedia()`.
   - Arquitectura y formularios: sigue `.cursor/rules/arquitectura.mdc`.
   - No instales dependencias sin aprobación. Usa el gestor de paquetes registrado en `packageManager`.
   - Al terminar cada tarea: archivos tocados, cómo probarlo, resultado de `lint` y `typecheck`, y checklist de aceptación.
   ```

## Paso 7 — Base de motion

- `src/shared/lib/motion/gsap.ts` (`"use client"`): importa `gsap`, `ScrollTrigger`, `SplitText`, `CustomEase`, `useGSAP`; registra una sola vez; reexporta.
- `src/shared/components/layout/SmoothScroll.tsx` (si se aprobó Lenis): `autoRaf: false`; `lenis.on('scroll', ScrollTrigger.update)`; `gsap.ticker.add(t => lenis.raf(t * 1000))`; `gsap.ticker.lagSmoothing(0)`; sin Lenis con reduced motion; limpieza al desmontar. Envuélvelo en `src/app/layout.tsx`.
- Página temporal en `src/app/page.tsx`: nombre del proyecto, mensaje "Base lista", tres bloques de 100svh y un cuadrado que rote con `scrub` en el segundo bloque (`markers` activos) para comprobar GSAP + ScrollTrigger + Lenis.

## Paso 8 — Documentación

- `README.md` en español, basado en el estado **real** del repositorio: nombre y estado ("Base técnica; las especificaciones se definen en `docs/`"), stack con versiones instaladas, requisitos (Node, gestor, enlaces oficiales), inicio local, tabla de scripts (qué hace y si modifica archivos), estructura existente (sin carpetas inventadas), linter y editor, **guía para continuar con IA** (leer README, `docs/` y `.cursor/rules`; usar el gestor registrado; correr `lint` y `typecheck`; actualizar docs cuando cambien comandos) y verificación de esta ejecución.
- `docs/00-setup.md`: decisiones de las rondas, versiones observadas, skills instaladas, adaptaciones realizadas y bloqueos.
- `docs/pendientes.md` vacío con encabezado.

## Paso 9 — Verificación

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm build
pnpm dev
```
- Corrige lo reportado sin silenciar reglas y repite las comprobaciones afectadas.
- Comprueba que la página responde en la URL que imprime el servidor y que Tailwind aplica estilos; si no puedes verlo, dilo y pide al usuario confirmar que el cuadrado rota suave con el scroll.
- Detén solo el proceso que iniciaste.
- Confirma que `workshop-kit/` quedó restaurado y que no se creó una subcarpeta de aplicación.

## Entrega

Resumen breve: configuración completada · versiones realmente instaladas · comprobaciones aprobadas / fallidas / no ejecutadas · comando para iniciar · bloqueos pendientes. No hagas commits salvo que se eligiera en la Ronda 2. No despliegues.

## Checklist de aceptación
- [ ] Proyecto en la carpeta actual, sin subcarpeta de aplicación.
- [ ] `lint`, `typecheck` y `build` pasan.
- [ ] Skills del kit (`/kit-…` y `gsap-scroll-mastery`), skills de stack aprobadas y `find-skills` disponibles; omisiones justificadas en `docs/00-setup.md`.
- [ ] `.cursor/rules/proyecto.mdc` y `arquitectura.mdc` creados.
- [ ] Registro central de GSAP y smooth scroll funcionando.
- [ ] README, `docs/00-setup.md` y `docs/pendientes.md` reflejan el estado real.

Termina con: **"Setup listo. Siguiente paso: `/kit-brief` en un chat nuevo (prompt 01)."**
