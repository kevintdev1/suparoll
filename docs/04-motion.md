# 04 — Sistema de motion

Fuente única de verdad para el lenguaje de movimiento de Suparoll. Los prompts de escenas (05–09) y los componentes animados leen tokens y convenciones definidos aquí.

## Decisiones confirmadas

| Decisión | Valor |
|---|---|
| Intensidad | **Media** — valores del workshop sin ajustes |
| A–D | Aprobados en bloque (prompt 04) |

---

## Parte A — Principios de movimiento

1. **Revelar, no aparecer.** El contenido se descubre con máscaras y recortes (mask/clip-path reveal) más que con fades genéricos.
2. **Lento y preciso.** Movimientos largos con desaceleración marcada; nada rebota. Sin spring con oscilación.
3. **El scroll manda en las escenas; el tiempo manda en los detalles.** Escenas narrativas = scroll-linked (scrub). Textos, UI y microinteracciones = scroll-triggered o por evento, con duración.
4. **Un protagonista por viewport.** Solo una animación grande a la vez; el resto acompaña con stagger sutil.
5. **Física de objeto.** La cámara y las instantáneas se mueven como objetos con peso (perspectiva, sombra que acompaña).
6. **Nunca bloquear.** Todo contenido es legible y todo CTA usable aunque la animación no haya terminado o esté desactivada.

---

## Parte B — Tokens de motion

Implementación: [`src/shared/lib/motion/tokens.ts`](../src/shared/lib/motion/tokens.ts)

| Token | Valor | Uso |
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

**Regla:** ninguna animación usa valores fuera de `tokens.ts`.

---

## Parte C — Convenciones técnicas

1. Importar GSAP solo desde `@/shared/lib/motion/gsap`. Tokens en `src/shared/lib/motion/tokens.ts`.
2. Cada componente animado es `"use client"`, usa `useGSAP(() => {...}, { scope: ref })` y selecciona elementos solo dentro del scope. Nada de `useEffect` para animaciones GSAP.
3. **Responsive y accesibilidad con `gsap.matchMedia()`** en cada escena, con tres contextos (ver [`media.ts`](../src/shared/lib/motion/media.ts)):
   - `(min-width: 1024px) and (prefers-reduced-motion: no-preference)` → versión completa.
   - `(max-width: 1023px) and (prefers-reduced-motion: no-preference)` → versión móvil (menos pin, menos distancia, menos frames).
   - `(prefers-reduced-motion: reduce)` → versión reducida: estado final visible, crossfades cortos, sin pin ni parallax.
4. Solo animar `transform` (x, y, scale, rotate), `opacity`, `clip-path`, `filter` puntual. Nunca `top/left/width/height` en scroll.
5. Un **timeline por escena**; los ScrollTriggers de una escena viven en ese timeline. Etiquetas (`labels`) con nombre de fase para depurar.
6. Pins: definir `end` en unidades relativas (`"+=300%"`), `anticipatePin: 1`, y documentar la altura total que ocupa cada escena.
7. Orden: los ScrollTriggers se crean en el orden visual de la página; si una escena se monta después (imágenes, fuentes), llamar `ScrollTrigger.refresh()` tras la carga, no en cada frame.
8. `markers` solo en desarrollo, controlados por `getDebugMotion()` desde `?debug=motion` en la URL.
9. Textos con `SplitText` usando `mask: "lines"` para reveals por línea; revertir el split en el cleanup y re-splitear en resize (`autoSplit` con `onSplit`).
10. Estado inicial sin parpadeo: los elementos que empiezan ocultos se ocultan vía CSS con `[data-reveal]`; visible si JS no carga (clase `js` en `<html>` + `<noscript>`).
11. Imágenes de escenas con `next/image`, tamaños explícitos y `priority` solo en el hero.

---

## Parte D — Mapa de coreografía de la Home

Toda escena se describe con la fórmula: **término + elemento + activación + evolución + final + adaptación**.

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

Fichas detalladas por escena: [`docs/escenas/`](escenas/README.md).

---

## Componentes base

| Componente | Ruta | Uso |
|---|---|---|
| `RevealText` | `src/shared/components/ui/RevealText.tsx` | Text reveal reutilizable (lines/words/chars) |
| `RevealImage` | `src/shared/components/ui/RevealImage.tsx` | Imagen con clip-path reveal |
