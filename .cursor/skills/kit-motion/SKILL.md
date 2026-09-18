---
name: kit-motion
description: "Fase 04 del kit: define principios, tokens, convenciones técnicas y mapa de coreografía de motion con GSAP, y crea componentes base de reveal."
disable-model-invocation: true
---

<!-- Generado desde 04-sistema-de-motion.md con scripts/build-skills.mjs. No editar a mano. -->

# PROMPT 04 — Sistema de motion (reglas, tokens y coreografía global)

> Invocada con `/kit-motion`. Empieza cada fase en un chat nuevo. Si el usuario escribió algo junto al comando, tómalo como contexto adicional, no como reemplazo de este protocolo.

## Rol

Eres motion designer y creative developer especializado en GSAP/ScrollTrigger. Antes de construir cualquier escena, defines el **lenguaje de movimiento** del sitio: principios, tokens, convenciones técnicas y un mapa de coreografía de toda la Home. Consulta las **GSAP Skills** instaladas antes de proponer código.

## Protocolo obligatorio

- Lee `.cursor/rules/proyecto.mdc` y todo `docs/` (01, 02, 03).
- Presenta cada parte (A → E), explica brevemente y pide aprobación. No generes código hasta aprobar A–D.
- Toda animación se describe con la fórmula: **término + elemento + activación + evolución + final + adaptación**.
- Usa la terminología del diccionario del workshop y respeta sus distinciones: scroll-triggered ≠ scroll-linked; sticky ≠ pinning; cover ≠ reveal; parallax ≠ overlap.

## Parte A — Principios de movimiento propuestos

1. **Revelar, no aparecer.** El contenido se descubre con máscaras y recortes (mask/clip-path reveal) más que con fades genéricos.
2. **Lento y preciso.** Movimientos largos con desaceleración marcada; nada rebota. Sin spring con oscilación.
3. **El scroll manda en las escenas; el tiempo manda en los detalles.** Escenas narrativas = scroll-linked (scrub). Textos, UI y microinteracciones = scroll-triggered o por evento, con duración.
4. **Un protagonista por viewport.** Solo una animación grande a la vez; el resto acompaña con stagger sutil.
5. **Física de objeto.** La cámara y las instantáneas se mueven como objetos con peso (perspectiva, sombra que acompaña).
6. **Nunca bloquear.** Todo contenido es legible y todo CTA usable aunque la animación no haya terminado o esté desactivada.

Pregunta: ¿apruebas los principios? ¿Intensidad general: sutil / media *(recomendado)* / expresiva?

## Parte B — Tokens de motion

| Token | Valor propuesto | Uso |
|---|---|---|
| `ease.reveal` | `CustomEase "0.77, 0, 0.175, 1"` | Máscaras, textos, entradas importantes |
| `ease.out` | `power3.out` | UI, hover, entradas pequeñas |
| `ease.inOut` | `power2.inOut` | Transiciones de página, drawers |
| `ease.scrub` | `none` | Todo lo que es scroll-linked (el suavizado lo da `scrub`) |
| `dur.micro` | 0.25s | Hover, focus, toggles |
| `dur.base` | 0.6s | Botones, drawers, toasts |
| `dur.reveal` | 1.1s | Textos por línea, imágenes con máscara |
| `dur.page` | 0.9s | Transiciones entre rutas |
| `stagger.chars` | 0.02s | Wordmark por caracteres |
| `stagger.lines` | 0.08s | Párrafos por líneas |
| `stagger.items` | 0.06s | Listas, tarjetas, specs |
| `scrub.scene` | `1` (1s de alcance) | Escenas grandes con pin |
| `scrub.parallax` | `true` | Parallax de columnas (sin retardo extra) |

Pregunta si aprueba o ajusta.

## Parte C — Convenciones técnicas (obligatorias en todo el proyecto)

1. Importar solo desde `@/shared/lib/motion/gsap`. Tokens en `src/shared/lib/motion/tokens.ts`.
2. Cada componente animado es `"use client"`, usa `useGSAP(() => {...}, { scope: ref })` y selecciona elementos solo dentro del scope. Nada de `useEffect` para animaciones GSAP.
3. **Responsive y accesibilidad con `gsap.matchMedia()`** en cada escena, con tres contextos:
   - `(min-width: 1024px) and (prefers-reduced-motion: no-preference)` → versión completa.
   - `(max-width: 1023px) and (prefers-reduced-motion: no-preference)` → versión móvil (menos pin, menos distancia, menos frames).
   - `(prefers-reduced-motion: reduce)` → versión reducida: estado final visible, crossfades cortos, sin pin ni parallax.
4. Solo animar `transform` (x, y, scale, rotate), `opacity`, `clip-path`, `filter` puntual. Nunca `top/left/width/height` en scroll.
5. Un **timeline por escena**; los ScrollTriggers de una escena viven en ese timeline. Etiquetas (`labels`) con nombre de fase para depurar.
6. Pins: definir `end` en unidades relativas (`"+=300%"`), `anticipatePin: 1`, y documentar la altura total que ocupa cada escena.
7. Orden: los ScrollTriggers se crean en el orden visual de la página; si una escena se monta después (imágenes, fuentes), llamar `ScrollTrigger.refresh()` tras la carga, no en cada frame.
8. `markers` solo en desarrollo, controlados por una constante `DEBUG_MOTION` desde `?debug=motion` en la URL.
9. Textos con `SplitText` usando `mask: "lines"` para reveals por línea; revertir el split en el cleanup y re-splitear en resize (`autoSplit` con `onSplit`).
10. Estado inicial sin parpadeo: los elementos que empiezan ocultos se ocultan vía CSS con una clase (`[data-reveal]`) que se elimina si JS no carga (`<noscript>` o clase `js` en `<html>`).
11. Imágenes de escenas con `next/image`, tamaños explícitos y `priority` solo en el hero.

## Parte D — Mapa de coreografía de la Home

Presenta esta tabla usando los IDs del prompt 03 y pide aprobación fila por fila (o en bloque si el usuario lo prefiere):

| Sección | Tipo | Término | Activación | Evolución | Final | Móvil / reduced |
|---|---|---|---|---|---|---|
| `preloader` | Tiempo | Counter + mask reveal | Carga de página | Contador 0→100 ligado al progreso real de carga; cortina sube con `ease.reveal` | Libera el hero y dispara su intro | Igual / fade simple |
| `hero` intro | Tiempo | Split-text (chars) + scale | Fin del preloader | Letras de SUPERROLL suben desde máscara con stagger; cámara escala 0.9→1 y opacidad 0→1 | Todo en reposo, label de scroll parpadea suave | Igual más corto / sin movimiento |
| `hero` → `viewfinder` | Scroll-linked, pin | Pinning + scrubbing + mask reveal | Hero en top del viewport | Ver prompt 05 | Tarjeta de paisaje con radio, se libera el pin | Pin más corto / crossfade |
| `manifesto` | Scroll-triggered | Text reveal por líneas | Top de la sección al 75% del viewport | Líneas suben desde máscara con `stagger.lines`; la palabra clave cambia a color acento | Texto estático | Igual / visible sin animación |
| `gallery` | Scroll-linked | Parallax de columnas | Sección entra en viewport | Ver prompt 06 | Columnas detenidas | 2 columnas, menos distancia / estático |
| `gallery` → `features` | Scroll-linked | Section cover transition | Top de `features` en 100% | Ver prompt 07 | `features` cubre todo | Sin pin / corte |
| `features` | Scroll-linked, pin | Sticky card stacking | Ver prompt 07 | | | |
| `develop` | Scroll-linked, pin | Filter/opacity scrub | Ver prompt 07 | | | |
| `specs` | Scroll-triggered | Stagger de filas + imagen con clip-path reveal | Top al 70% | Filas entran con `stagger.items` | | |
| `colors` | Evento | Crossfade + shared element | Clic en variante | Ver prompt 08 | | |
| `cta-final` → `footer` | Scroll-linked | Section reveal (footer reveal) | Ver prompt 07 | | | |

## Parte E — Implementación base (tras aprobar A–D)

1. `docs/04-motion.md` con A–D en su versión aprobada.
2. `src/shared/lib/motion/tokens.ts` con eases (registrar CustomEase), duraciones, staggers y scrubs.
3. `src/shared/lib/motion/media.ts` con las tres queries de `matchMedia` como constantes.
4. `src/shared/lib/motion/debug.ts` con `DEBUG_MOTION`.
5. `src/shared/components/ui/RevealText.tsx`: componente reutilizable de text reveal (props: `as`, `split: "lines" | "words" | "chars"`, `trigger: "scroll" | "mount"`, `delay`), con variantes reduced/móvil.
6. `src/shared/components/ui/RevealImage.tsx`: imagen con clip-path reveal de abajo hacia arriba e imagen interior que escala 1.2→1.
7. Aplica `RevealText` a la sección `manifesto` placeholder como prueba.
8. Crea la carpeta `docs/escenas/` con un `README.md` que explique que cada escena tendrá su ficha con la fórmula.

## Checklist de aceptación
- [ ] Principios, tokens, convenciones y mapa aprobados.
- [ ] Ninguna animación usa valores fuera de `tokens.ts`.
- [ ] `RevealText` funciona en desktop, móvil y con reduced motion (probar desde DevTools → Rendering → Emulate prefers-reduced-motion).
- [ ] `?debug=motion` muestra markers; sin el parámetro no.
- [ ] Sin parpadeo del contenido antes de animar.

Termina con: **"Sistema de motion listo. Siguiente paso: `/kit-escena-hero` (prompt 05)."**
