# Plantilla — Especificar una escena o transición

Para que los asistentes practiquen: antes de pedirle una animación a la IA, llenan esta ficha. Si una casilla queda vacía, la IA tendrá que inventarla, y eso es justo lo que queremos evitar.

---

## Prompt para pegar en Cursor

Eres creative developer del proyecto Suparoll. Lee `.cursor/rules/proyecto.mdc`, `docs/02-direccion-de-arte.md` y `docs/04-motion.md`, y consulta las GSAP Skills. Voy a darte una ficha de escena. **Antes de programar**, revisa si alguna casilla está vacía, es ambigua o contradice `docs/`; si es así, pregúntame en una sola ronda con opciones. Cuando no haya dudas, guarda la ficha en `docs/escenas/<id>.md`, implementa por fases y detente tras cada fase para que la valide.

## Ficha

**ID de la escena:**
**Sección donde vive:**
**Objetivo (qué debe sentir o entender el usuario):**

| Pieza | Respuesta |
|---|---|
| **Término** (del diccionario: parallax, pinning, mask reveal, cover…) | |
| **Elemento(s)** (qué se mueve exactamente; qué capa queda quieta) | |
| **Activación** (scroll-triggered o scroll-linked; en qué punto empieza: "top de la sección al 80% del viewport") | |
| **Evolución** (propiedades con valores inicial → final, easing/token, stagger, fases con rangos de progreso) | |
| **Final** (estado en reposo; si se libera un pin; qué pasa al volver hacia arriba) | |
| **Adaptación** móvil / reduced motion / sin JS | |

**Capas y z-index:**
**Recursos necesarios (imágenes, frames, modelos):**
**Criterios de aceptación (cómo sabré que está bien):**

---

## Ejemplo resuelto

**ID:** `specs-image` · **Sección:** `specs` · **Objetivo:** que la cámara de perfil se sienta como un objeto que "entra en escena".

| Pieza | Respuesta |
|---|---|
| Término | Clip-path reveal + scale de imagen interior |
| Elemento(s) | Contenedor de la foto de perfil (se recorta); la imagen interior escala. La lista de specs no se mueve |
| Activación | Scroll-triggered, cuando el top del contenedor llega al 70% del viewport, una sola vez |
| Evolución | Contenedor `clip-path: inset(100% 0 0 0)` → `inset(0 0 0 0)`, `dur.reveal`, `ease.reveal`; imagen `scale 1.2 → 1` en paralelo; filas de specs entran con `y 20 → 0`, `opacity 0 → 1`, `stagger.items`, 0.2s después |
| Final | Todo estático; no se revierte al subir |
| Adaptación | Móvil: igual con `dur.base`. Reduced: fade de 0.3s sin recorte. Sin JS: visible |

**Capas:** imagen z 0, labels z 10. **Recursos:** `public/media/product/perfil.webp` 2400px. **Aceptación:** sin salto de layout, la imagen nunca se ve pixelada, las filas no aparecen antes que la imagen.
