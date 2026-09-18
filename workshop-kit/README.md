# Workshop: Interfaces estilo Awwwards con Cursor — Proyecto "Suparoll"

Kit de prompts para construir, paso a paso y con Cursor como copiloto, el sitio de venta de **Suparoll**, una cámara instantánea (marca ficticia para el workshop). Stack: **Next.js (App Router) + TypeScript + Tailwind CSS + GSAP (ScrollTrigger, SplitText, CustomEase) + Lenis + GSAP Skills oficiales**.

## Idea central del workshop

La IA no adivina: **pregunta, documenta y luego construye**. Cada prompt obliga al agente a entrevistar al usuario antes de escribir código y a guardar las decisiones en `docs/`. Esa carpeta es la fuente única de verdad: los prompts siguientes la leen, así que nada se inventa ni se sale del plan.

## Contenido del kit

```
suparoll-workshop/
├─ README.md
├─ 00a-setup-desde-cero.md                 # Camino A (se pega en el chat)
├─ 00b-escaneo-proyecto-existente.md       # Camino B (se pega en el chat)
├─ 01 … 10, 03b                            # Prompts de cada fase (fuente de las skills /kit-*)
├─ plantilla-especificar-una-escena.md
├─ anexo-arquitectura-frontend.md          # Estructura features/shared, Server/Client, formularios
├─ guia-pack-suparoll.md                  # Para el instructor: cómo producir el pack de imágenes con Flow
├─ skills/
│  ├─ gsap-scroll-mastery/                 # Metodología de escenas de scroll (se aplica sola)
│  └─ kit-*/                               # Una skill por fase, se invocan con /
└─ scripts/
   ├─ build-skills.mjs                     # Regenera skills/kit-* desde los prompts
   ├─ assets/process-images.mjs            # Optimiza imágenes y crea placeholders
   ├─ assets/extract-frames.mjs            # Video → secuencia de frames + manifest
   ├─ setup-linter.sh / .ps1               # Migración ESLint/Prettier → Biome (proyectos existentes)
   └─ biome-migrate.cjs
```

## Dos caminos de inicio

| | Camino A — Desde cero | Camino B — Proyecto existente |
|---|---|---|
| Para quién | Quien construye todo el sitio | Quien parte de una base: el storefront de Medusa (con el backend ya levantado en otra sesión), una plantilla o un sitio propio |
| Primer paso | Pegar `00a-setup-desde-cero.md` | Pegar `00b-escaneo-proyecto-existente.md` |
| Qué hace | Crea el proyecto, instala stack, skills y reglas | Escanea sin modificar, genera `docs/00-diagnostico.md` con evidencia y línea base, decide qué mejorar e integra la base de motion sin tocar la lógica |
| Después | `/kit-brief` → … → `/kit-calidad` | Las skills que indique el plan del diagnóstico |

Antes del primer paso se copian `skills/`, `scripts/` y `anexo-arquitectura-frontend.md` a una carpeta `workshop-kit/` dentro del proyecto.

El kit no depende del tipo de sitio. Suparoll es el caso práctico; las fases de diseño, motion y calidad sirven igual para un portafolio, un evento o un SaaS, y `/kit-ecommerce` solo aplica si el sitio vende.

## Cómo se usa: prompts y skills

- **00A y 00B se pegan** en el chat (modo Agent): son los que instalan todo lo demás.
- **Desde la fase 01 se invocan con `/`**: en un chat nuevo escribe `/kit-brief`, `/kit-direccion-arte`, etc. Estas skills tienen `disable-model-invocation: true`, así que nunca se activan solas.
- Los `.md` numerados siguen existiendo: son la fuente de las skills (se regeneran con `node scripts/build-skills.mjs`) y el material para explicar cada fase en la charla. Quien prefiera, puede seguir pegándolos.
- Responde las preguntas del agente. `usa lo recomendado` = el valor marcado *(recomendado)*, nunca uno inventado.
- Un chat nuevo por fase. El contexto vive en `docs/` y `.cursor/rules/`, no en el historial.

### Skills del proyecto

| Tipo | Qué es | Cómo llega |
|---|---|---|
| Fases del kit (`/kit-*`) | El protocolo de cada fase | Copiadas desde `workshop-kit/skills/` |
| `gsap-scroll-mastery` | Metodología de escenas de scroll | Copiada; se aplica automáticamente |
| Skills del stack | Next.js, React, Tailwind, GSAP… | `npx autoskills --dry-run`, revisión y aprobación antes de instalar |
| `find-skills` | Buscar skills cuando surge una necesidad nueva | `npx skills add` desde `vercel-labs/skills` |

Regla del proyecto: ninguna skill nueva se instala sin mostrar su fuente, qué hace y obtener aprobación.

## Orden de las fases

| # | Invocación | Archivo fuente | Qué produce | Tiempo aprox. |
|---|---|---|---|---|
| 00A | (pegar) | `00a-setup-desde-cero.md` | Proyecto, Biome, GSAP, skills, reglas, arquitectura base | 25 min |
| 00B | (pegar) | `00b-escaneo-proyecto-existente.md` | Diagnóstico, decisiones, integración mínima, plan | 30–45 min |
| 01 | `/kit-brief` | `01-brief-de-marca-y-producto.md` | `docs/01-brief.md` | 15 min |
| 02 | `/kit-direccion-arte` | `02-direccion-de-arte.md` | Dirección de arte + tokens | 25 min |
| 03 | `/kit-arquitectura-contenido` | `03-arquitectura-y-contenido.md` | Páginas, secciones, textos | 20 min |
| 03B | `/kit-assets` | `03b-imagenes-y-assets.md` | Manifest de imágenes, pack integrado, placeholders, prompts de IA, frames | 20 min con pack |
| 04 | `/kit-motion` | `04-sistema-de-motion.md` | Sistema de motion | 20 min |
| 05 | `/kit-escena-hero` | `05-escena-hero-camara.md` | Hero con secuencia de la cámara | 45 min |
| 06 | `/kit-galeria-columnas` | `06-galeria-de-columnas.md` | Galería de columnas | 30 min |
| 07 | `/kit-transiciones` | `07-transiciones-entre-secciones.md` | Cover, reveal, stacking, footer reveal | 30 min |
| 08 | `/kit-ecommerce` | `08-producto-y-ecommerce.md` | Producto, carrito, checkout | 40 min |
| 09 | `/kit-ui-global` | `09-ui-global-y-microinteracciones.md` | Preloader, navbar, cursor, newsletter, transiciones | 30 min |
| 10 | `/kit-calidad` | `10-calidad-rendimiento-accesibilidad.md` | Auditoría y deploy | 25 min |
| — | `/kit-nueva-escena` | `plantilla-especificar-una-escena.md` | Escenas propias con la fórmula | — |

Recorrido mínimo en un workshop corto: **00A o 00B → 02 → 03B → 04 → 05 → 06 → 07**.

## Imágenes

1. **Pack Suparoll** (preparado por el instructor con `guia-pack-suparoll.md`): video del giro de la cámara ya convertido en frames, paisaje, galería y detalles, con su `assets.json`. Los asistentes lo copian a `assets-inbox/` y `/kit-assets` lo integra.
2. **Placeholders**: cualquier hueco sin imagen se rellena con un SVG con su proporción y etiqueta. Nada se bloquea.
3. **Prompts de IA opcionales**: `/kit-assets` escribe prompts coherentes con la dirección de arte para quien quiera generar sus propias imágenes después (Google Flow u otra herramienta).
4. **Camino B**: las fotos de producto vienen del backend; solo se consiguen las de la landing.

Todas las imágenes del sitio se registran en `src/content/assets.json` y los componentes solo las leen desde ahí.

## La fórmula para describir movimiento

Tomada del diccionario de UI/UX del workshop. Un nombre de patrón ("parallax", "reveal") no basta; toda animación se especifica con seis piezas:

**Término + elemento + activación + evolución + final + adaptación**

> Ejemplo: *Section cover transition* para la sección Especificaciones; se activa cuando su borde superior toca el 100% del viewport; sube por encima de la galería mientras la galería queda anclada, escala a 0.94 y se oscurece con un scrim al 40%; termina cuando Especificaciones cubre todo el viewport y la galería se libera; en móvil no hay anclaje y la galería solo se desvanece; con reduced motion, corte directo sin escala.

Todos los prompts de motion (04–07) usan esta fórmula en sus tablas.

## Distinciones que el grupo debe dominar

- **Scroll-triggered** dispara una animación que avanza con el tiempo. **Scroll-linked / scrub** ata el progreso a la posición del scroll.
- **Sticky** es posicionamiento CSS. **Pinning** es anclar durante un tramo definido de scroll (ScrollTrigger `pin`).
- **Cover** = la nueva sección entra por delante. **Reveal/uncover** = la anterior se retira y descubre la de atrás. Siempre hay que decir qué capa se mueve.
- **Parallax** = velocidades distintas. **Overlap** = superposición (puede ser estática).
- **Stagger** coordina varios elementos. **Easing** controla cómo progresa cada uno.

## Estructura final esperada (camino A)

```
suparoll/
├─ .cursor/
│  ├─ rules/proyecto.mdc           # forma de trabajar del agente
│  ├─ rules/arquitectura.mdc       # anexo de arquitectura
│  └─ skills/                      # kit-*, gsap-scroll-mastery, stack, find-skills
├─ docs/                           # decisiones: fuente única de verdad
│  ├─ 00-setup.md | 00-diagnostico.md
│  ├─ 01-brief.md … 04-motion.md
│  ├─ assets.md, guia-visual-imagenes.md, prompts-imagenes.md
│  ├─ escenas/                     # una ficha por escena
│  └─ pendientes.md
├─ assets-inbox/                   # originales (ignorado en git)
├─ public/media/                   # imágenes optimizadas y frames
└─ src/
   ├─ app/                         # rutas: solo componen
   ├─ features/
   │  ├─ landing/{sections,scenes}
   │  ├─ commerce/                 # solo si el sitio vende
   │  └─ newsletter/
   ├─ shared/
   │  ├─ components/{ui,ui/forms,layout}
   │  ├─ lib/{motion,utils}
   │  └─ hooks, validations
   └─ content/                     # textos, datos y assets.json
```

En el camino B se respeta la estructura del proyecto existente salvo que el usuario decida otra cosa.

## Nota sobre la marca y las imágenes de referencia

Las fotos de la cámara que se usan como referencia pertenecen a un producto real de otra marca. Para un sitio que se vaya a publicar, Suparoll debe tener identidad propia: no uses su logotipo, su nombre, su franja de colores ni fotos sin licencia. Para el workshop en local, las referencias sirven para practicar; el prompt 01 le pregunta al usuario qué recursos tiene y con qué derechos.
