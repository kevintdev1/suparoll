# PROMPT 06 — Galería de columnas con parallax opuesto

> Chat nuevo en Cursor (modo Agent).

---

## Rol

Eres creative developer. Construyes la sección `gallery` inspirada en la referencia editorial "Kove" del usuario: **panel de marca a la izquierda y columnas de fotos a la derecha, donde unas columnas suben y otras bajan** mientras se hace scroll.

## Protocolo obligatorio

- Lee `.cursor/rules/proyecto.mdc`, `docs/02`, `docs/03`, `docs/04` y `docs/escenas/hero.md`. Consulta las GSAP Skills.
- Rondas de preguntas → ficha `docs/escenas/gallery.md` → aprobación → implementación por pasos con validación.

## Descripción de la referencia (para alinear al usuario)

Split-screen: a la izquierda un panel claro con el wordmark grande, navegación mínima en labels y un texto pequeño abajo; a la derecha una retícula de 4 columnas de fotos verticales separadas por calles negras finas, con alturas desfasadas, que se desplazan a distinta velocidad y dirección (parallax de columnas).

## Ronda 1 — Composición

1. **Layout:** split 40/60 con panel de marca a la izquierda *(recomendado, igual a la referencia)* / columnas a todo el ancho con texto superpuesto al centro.
2. **Número de columnas desktop:** 3 / 4 *(recomendado)* / 5. Móvil: 2 *(recomendado)*.
3. **Dirección de cada columna** (de izquierda a derecha): arriba · abajo · arriba · abajo *(recomendado)* / otra combinación que el usuario defina.
4. **Contenido del panel izquierdo:** título, frase y CTA de `docs/03-arquitectura.md`. ¿El panel queda anclado mientras las columnas se mueven? Sí *(recomendado)* / no.
5. **Calles entre fotos:** fondo tinta con gutter de 8px (como la referencia) *(recomendado)* / fondo papel.

## Ronda 2 — Movimiento

1. **Modo:** columnas con parallax mientras la sección atraviesa el viewport, sin pin *(recomendado: más natural)* / sección anclada durante 200% y columnas desplazándose dentro.
2. **Intensidad:** sutil (±10%) / media (±25%) *(recomendado)* / fuerte (±40%) del alto de la columna.
3. **Continuidad con el hero:** ¿la tarjeta de paisaje del hero aterriza como una foto de la galería (shared element con `Flip`)? Sí, en la columna 2 / No, la galería entra por debajo de la tarjeta *(recomendado para el workshop; la opción "sí" es un reto avanzado)*.
4. **Hover sobre fotos:** imagen interior escala 1→1.06 y aparece un label mono con lugar/año *(recomendado)* / nada.
5. **Clic en foto:** abre visor a pantalla completa (modal dialog accesible) / nada *(recomendado para el workshop)*.

## Ronda 3 — Imágenes

1. Las fotos salen de `src/content/assets.json` (grupo `gallery`) vía `getAsset`. Comprueba que haya al menos 4 por columna + 2 extra por columna para cubrir el recorrido, en 4:5. Si faltan huecos, detente y sugiere `/kit-assets`; mientras tanto se usan placeholders.
2. `alt` desde el manifest; si hay hover con lugar/año y no está registrado, `[[PENDIENTE]]`. Nunca inventes lugares.
3. ¿Alguna foto debe destacar (doble altura)? ¿Cuál?

## Ficha de escena `docs/escenas/gallery.md` (valores recomendados)

| Pieza | Especificación |
|---|---|
| Término | Parallax scrolling por columnas (scroll-linked, scrub) + sticky del panel |
| Elementos | `aside` panel (40%), `div` retícula de 4 columnas (60%), cada columna es una lista `ul` de `figure` |
| Activación | Desde que el top de la sección toca el bottom del viewport hasta que su bottom toca el top |
| Evolución | Columna 1: `yPercent` 0 → -25. Columna 2: -25 → 0. Columna 3: 0 → -35. Columna 4: -15 → +10. Ease `none`, `scrub: true`. Columnas desfasadas en su posición inicial para que no se alineen las filas |
| Final | Columnas en su posición de salida; el panel se libera al final de la sección |
| Adaptación móvil | 2 columnas (arriba/abajo) a ±12%; panel pasa arriba en flujo normal, no sticky |
| Reduced motion | Retícula estática; fotos con fade al entrar, sin desplazamiento |
| Entrada inicial | Cada foto con `RevealImage` (clip-path desde abajo) con `stagger.items`, disparado una vez por columna |

### Requisitos técnicos
- El panel usa `position: sticky` (CSS) — no pin de GSAP — porque solo necesita anclarse dentro de su contenedor.
- Cada columna es más alta que el viewport para que al desplazarse nunca se vea el final de la lista: calcula la altura mínima según la intensidad elegida y documenta la fórmula.
- `overflow: hidden` en el contenedor de columnas; `will-change: transform` en columnas solo cuando la sección está activa (`onToggle`).
- `next/image` con `sizes` correctos por breakpoint (una columna ≈ 15vw en desktop, 50vw en móvil), `loading="lazy"`.
- El texto del panel usa `RevealText`.

## Orden de implementación
1. Layout estático responsive con fotos reales. **Validar.**
2. Reveal de entrada de las fotos. **Validar.**
3. Parallax de columnas desktop. **Validar.**
4. Móvil y reduced motion. **Validar.**
5. Hover (y visor/Flip si se eligió). **Validar.**

## Checklist de aceptación
- [ ] Nunca se ve un hueco vacío al inicio o final de una columna.
- [ ] Las direcciones coinciden con lo aprobado.
- [ ] Sin CLS al cargar imágenes (dimensiones reservadas).
- [ ] Panel legible en todo momento y CTA clicable.
- [ ] Todas las fotos tienen `alt` aprobado o pendiente registrado.

Termina con: **"Galería lista. Siguiente paso: `/kit-transiciones` (prompt 07)."**
