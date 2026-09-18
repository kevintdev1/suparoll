---
name: gsap-scroll-mastery
description: Metodología para diseñar e implementar experiencias web basadas en scroll con GSAP y ScrollTrigger (scrollytelling, pinning, scrubbing, parallax, mask/clip-path reveals, secuencias de imágenes, video scrubbing, transiciones entre secciones) en React/Next.js. Úsala antes de escribir cualquier animación ligada al scroll, al planificar una escena estilo Awwwards/Apple, o al revisar rendimiento y accesibilidad de animaciones. Complementa las skills oficiales de GSAP, que cubren la API.
---

# GSAP Scroll Mastery

Marco de decisiones para escenas de scroll de alto nivel. No sustituye la documentación de la API: para sintaxis y opciones concretas consulta las skills oficiales de GSAP (core, timeline, ScrollTrigger, React, performance).

## 1. Antes de escribir código: especifica

Toda escena se describe con seis piezas. Si falta una, pregunta al usuario; no la inventes.

**Término + elemento + activación + evolución + final + adaptación**

Responde además:
- ¿Qué historia cuenta la sección de principio a fin? ¿Cuáles son sus estados clave (inicio, medio, fin)?
- ¿Es **scroll-linked** (`scrub`, el progreso depende del scroll) o **scroll-triggered** (se dispara y avanza con el tiempo)?
- ¿El usuario queda **anclado** mientras ocurre la acción o el contenido fluye?
- ¿Qué capa se mueve y cuál queda quieta? (cover ≠ reveal, parallax ≠ overlap)
- ¿Cómo se ve en móvil, con `prefers-reduced-motion` y sin JavaScript?
- ¿Qué es decorativo y qué debe leer un lector de pantalla?

Guarda la especificación en `docs/escenas/<id>.md` y pide aprobación antes de implementar.

## 2. Arquitectura

- **Registro central:** un solo archivo importa GSAP y plugins, llama a `gsap.registerPlugin()` una vez y reexporta. Los componentes nunca importan `gsap` directamente.
- **Tokens:** eases, duraciones, staggers y valores de scrub en un archivo de tokens. Nada de números mágicos en los componentes.
- **Selectores inmunes:** anima elementos marcados con `data-*` (`data-anim="lens"`), buscados dentro del `scope` del componente. Las clases son para estilo.
- **Separación:** el markup define estructura semántica; el CSS define el estado estático inicial y el estado final para reduced motion; el script solo construye timelines.
- **React/Next.js:** Client Components en las hojas; `useGSAP` con `scope` (limpieza automática); nada de `useEffect` para crear animaciones GSAP; los datos llegan por props desde componentes de servidor.
- **Lógica pura aparte:** cálculos de progreso por índice, rangos de fases o mapeos de frames van en funciones puras testeables, sin DOM.

## 3. Maquetar una escena anclada

Dos formas válidas; elige una por escena y documéntala:

| Técnica | Cómo | Cuándo |
|---|---|---|
| **Track + stage (CSS sticky)** | Padre alto (`height: 500vh`) = duración; hijo `position: sticky; top: 0; height: 100svh; overflow: hidden`. El ScrollTrigger usa el padre como `trigger` con `start: "top top"`, `end: "bottom bottom"` y `scrub` | Escenas autocontenidas; menos saltos al refrescar; el alto es visible en el CSS |
| **ScrollTrigger `pin`** | Sección de `100svh` con `pin: true`, `end: "+=400%"`, `anticipatePin: 1` | Cuando la duración depende de cálculos, o para transiciones entre secciones con `pinSpacing: false` |

Reglas comunes: usa `svh` para evitar saltos por la barra del navegador móvil; en reduced motion el track colapsa a `auto`/`100svh` y se muestra el estado final.

## 4. Metodología de animación

- **Timeline por escena**, conectada a un único ScrollTrigger. Usa `labels` con nombre de fase para depurar.
- **Scrub** de `0.5` a `1.5` para escenas narrativas (suavizado); `true` para parallax que debe sentirse pegado al scroll.
- **Sincronía:** posición absoluta (`tl.to(a, {...}, "fase2")` o `, 0`) para lo que ocurre a la vez; `"<"` para encadenar con el inicio del tween anterior.
- **Fases por rangos:** con una timeline de duración total 1, cada fase ocupa un rango (0–0.3, 0.3–0.55…). Facilita ajustar el ritmo sin reescribir.
- **Texto:** SplitText por `lines` (con `mask: "lines"`), `words` o `chars`; revierte el split al limpiar y re-splitea en resize.
- **Revelados:** `clip-path: inset(... round Npx)` para rectángulos y bordes redondeados (se anima sin tocar width/height). Para formas complejas, textos que recortan video o "agujeros" (keyhole), usa `<mask>` en SVG.
- **Secuencias de imágenes:** canvas + objeto `{ frame: 0 }` animado; redibuja en `onUpdate` solo si cambió el índice; precarga progresiva (primero cada N frames); limita `devicePixelRatio` a 2.
- **Video scrubbing:** descarga el video completo como Blob y usa `URL.createObjectURL()`; hacer seek sobre un video servido por peticiones Range parciales produce saltos. Exporta el video con keyframes muy frecuentes (idealmente todos los fotogramas clave) para que el seek sea preciso.

## 5. Accesibilidad

- **Reduced motion:** construye las escenas dentro de `gsap.matchMedia()` con un contexto `(prefers-reduced-motion: reduce)` que no crea pins ni scrubs; el CSS muestra el estado final legible. Nunca dejes la pantalla vacía.
- **Texto real primero:** el contenido va en HTML semántico. Si la versión visual está fragmentada (SplitText, SVG), asegúrate de que el lector de pantalla recibe el texto completo una sola vez (`aria-label` en el contenedor y fragmentos `aria-hidden`, o la opción de accesibilidad del plugin).
- **Decorativos:** SVG, máscaras, canvas y duplicados visuales con `aria-hidden="true"`.
- **Foco:** lo que aún no se ve o quedó cubierto no debe recibir Tab: `inert` o `visibility: hidden` según el estado de la timeline, restaurado al mostrarse.
- Sin destellos de más de 3 por segundo.

## 6. Rendimiento

- Anima `transform`, `opacity` y `clip-path`. Evita `width`, `height`, `top`, `left`, `margin` en el loop de scroll; `filter` solo con medición en móvil.
- `will-change: transform` **solo mientras la escena está activa** (actívalo en `onToggle`/`onEnter`, retíralo al salir). Aplicarlo de forma permanente a muchas imágenes grandes consume memoria de GPU.
- Crea los ScrollTriggers en orden visual; llama `ScrollTrigger.refresh()` después de que carguen imágenes y fuentes, no en cada frame.
- Con smooth scroll (Lenis), sincroniza con el ticker de GSAP y pausa el scroll suave en modales.
- Verifica en el panel Performance: sin tareas largas durante el scrub.

## 7. Flujo de trabajo

1. Especificación aprobada (sección 1).
2. Markup semántico mínimo con `data-*` en las partes móviles.
3. CSS del estado inicial, estado final y caso reduced motion.
4. Track/stage o pin.
5. Timeline con fases y labels, con `markers` activados solo en modo debug.
6. Variante móvil y reduced motion con `gsap.matchMedia()`.
7. Ajuste de easings, solapamientos y ritmo con el usuario.
8. Pruebas: scroll rápido, hacia atrás, recarga a mitad de escena, resize, teclado.

> La buena animación no se nota como un añadido: se siente como la interfaz respirando.
