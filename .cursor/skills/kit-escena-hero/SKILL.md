---
name: kit-escena-hero
description: "Fase 05 del kit: construye por fases la escena hero de scroll (nombre, giro de la cámara, acercamiento al visor, paisaje y tarjeta)."
disable-model-invocation: true
---

<!-- Generado desde 05-escena-hero-camara.md con scripts/build-skills.mjs. No editar a mano. -->

# PROMPT 05 — Escena hero: SUPERROLL → cámara gira → visor → paisaje → tarjeta

> Invocada con `/kit-escena-hero`. Empieza cada fase en un chat nuevo. Si el usuario escribió algo junto al comando, tómalo como contexto adicional, no como reemplazo de este protocolo.

## Rol

Eres creative developer especializado en scrollytelling con GSAP ScrollTrigger (y canvas/WebGL si hace falta). Construyes la escena de apertura de Suparoll exactamente según el guion de este prompt, **fase por fase**, pidiendo validación al usuario al final de cada fase.

## Protocolo obligatorio

- Lee `.cursor/rules/proyecto.mdc`, `docs/02-direccion-de-arte.md`, `docs/03-arquitectura.md`, `docs/assets.md`, `docs/04-motion.md` y aplica la skill `gsap-scroll-mastery`; consulta las skills oficiales de GSAP (ScrollTrigger, timelines, React).
- Obtén imágenes y secuencias solo con `getAsset` / `getSequence` de `src/shared/lib/assets.ts`.
- Primero haz las rondas de preguntas. Luego escribe la ficha `docs/escenas/hero.md` y pide aprobación. Solo entonces programa.
- Implementa por fases (F0 → F5). Al terminar cada fase: detente, di cómo probarla y espera "ok" del usuario.

## Guion de la escena (visión aprobada por el cliente)

1. Al entrar aparece primero el nombre **SUPERROLL**.
2. La cámara se ve **de frente**.
3. Con el scroll, **la cámara gira**.
4. Una vez girada, **la vista se acerca al visor (mirilla)**.
5. **A través del visor se ve un paisaje**.
6. El paisaje crece, **se convierte en una tarjeta con borde redondeado** y a partir de ahí **continúa el scroll normal** hacia el resto del sitio.

## Ronda 1 — Técnica de la cámara (decisión más importante)

**Atajo:** si existe `public/media/hero/frames/manifest.json` (pack Suparoll o secuencia ya extraída), la técnica **A** está decidida: no hagas esta ronda. Lee el manifest (cantidad de frames, tamaños desktop/móvil y color `background`), informa al usuario lo que encontraste y pasa a la Ronda 2. Si además existe `public/media/hero/frames-zoom/manifest.json`, hay secuencia de acercamiento.

Si no hay secuencia, explica las tres opciones con pros y contras y pide elegir:

| Opción | Cómo funciona | Qué necesita el usuario | Realismo | Dificultad |
|---|---|---|---|---|
| **A. Secuencia de imágenes en canvas** | Un video del giro (generado con fotograma inicial y final en Google Flow, o renderizado desde 3D) se convierte en 120–180 frames con `extract-frames.mjs`; el scroll elige qué frame dibujar (técnica de páginas de producto de Apple) | Video del giro con fondo liso, o el pack Suparoll | Máximo | Media |
| **B. Modelo 3D en tiempo real** | Modelo `.glb` con React Three Fiber; el scroll mueve la rotación del modelo y la cámara virtual | Modelo `.glb` optimizado (< 5 MB) | Muy alto, interactivo | Alta |
| **C. 2.5D con fotos** | Se usan las fotos frontal y de 3/4 del usuario: rotación en `rotateY` con perspectiva + crossfade entre fotos, luego zoom con `scale` y `transform-origin` en el visor | Fotos PNG sin fondo: frontal, 3/4 y (idealmente) perfil y trasera | Medio | Baja |

*(recomendado: A con el pack Suparoll; C si solo hay fotos y no hay tiempo de generar video)*. No instales nada de 3D sin que el usuario elija B.

## Ronda 2 — Detalles del guion

1. **¿Cuánto gira la cámara?** Con A lo define el video: usa todos los frames *(recomendado)* o solo un tramo (indica el rango). Con C: 35° a vista de 3/4 *(recomendado)* / 90° a perfil.
2. **¿A qué "mirilla" entramos?** Ocular trasero del visor, visible en el último frame *(recomendado con A)* / ventana frontal del visor, el cuadrado de arriba a la derecha *(recomendado con C)* / el lente principal.
   Con A, **¿cómo se hace el acercamiento?** Con la secuencia `frames-zoom` si existe *(recomendado si pasó el control de calidad)* / escalando el canvas en código con `transform-origin` en el ocular.
3. **¿Qué pasa con el wordmark SUPERROLL durante el giro?** Queda detrás de la cámara y se desplaza en horizontal más lento que la cámara (parallax) *(recomendado)* / se desvanece / se divide y sus mitades salen a los lados.
4. **Paisaje:** ¿qué imagen? (ruta en `public/media/hero/`) ¿Hay versión vertical para móvil? ¿Lleva texto superpuesto? ¿Cuál? (del `docs/03-arquitectura.md`).
5. **Tarjeta final:** ¿qué tamaño ocupa al terminar? 88% del ancho con margen lateral y radio 24px *(recomendado)* / tamaño de una foto de la galería siguiente (transición continua hacia el prompt 06) / otro.

## Ronda 3 — Ritmo

1. **Duración de la escena en scroll:** corta 300% / media 450% *(recomendado)* / larga 600% de la altura del viewport.
2. **Fondo de la escena:** con A, el color `background` del manifest para que no se note el borde del video *(recomendado; registra la diferencia con `--color-paper` en `docs/assets.md`)*; con C, papel `--color-paper` *(recomendado)* / pasa a tinta cuando entramos al visor.
3. **¿Indicador de progreso?** Línea fina de progreso en el borde inferior + label mono con la fase ("01 — Encuadra", "02 — Mira", "03 — Revela") *(recomendado)* / nada.

## Ficha de escena (escríbela en `docs/escenas/hero.md` y pide aprobación)

Rellénala con las respuestas. Plantilla con los valores recomendados como referencia:

### Capas (de atrás hacia delante)
| z | Capa | Elemento |
|---|---|---|
| 0 | Fondo | Superficie papel |
| 10 | Wordmark | `h1` SUPERROLL en `--text-mega` (texto real para SEO, no imagen) |
| 20 | Cámara | Canvas (A) / escena R3F (B) / pila de fotos con perspectiva (C) |
| 30 | Paisaje | Imagen dentro de un contenedor con `clip-path` que empieza con la forma y posición exacta del visor |
| 40 | UI | Labels de esquina, indicador de progreso, label de scroll |

### Fases (timeline con pin, progreso 0 → 1 de la escena)

| Fase | Progreso | Término | Qué ocurre |
|---|---|---|---|
| **F0 Intro** | por tiempo, antes del scroll | Split-text (chars) + scale + fade | Tras el preloader: letras de SUPERROLL suben desde máscara (`stagger.chars`, `ease.reveal`); 0.3s después la cámara frontal pasa de `scale 0.92, opacity 0` a `1, 1`; aparecen labels y el "Desliza para revelar". Scroll bloqueado hasta terminar la intro (máx. 1.8s) |
| **F1 Giro** | 0.00 → 0.30 | Scrubbing + rotación | La cámara gira hasta el ángulo elegido. (A) avanza frames. (C) `rotateY` de 0° al ángulo con `perspective: 1200px` y crossfade frontal→3/4 entre 40–60% de la fase; la sombra se desplaza en sentido contrario. El wordmark se mueve en X a 0.4× la velocidad (parallax) y baja su opacidad a 0.15. Label de scroll desaparece al 5% |
| **F2 Acercamiento** | 0.30 → 0.55 | Scale / zoom de cámara virtual | La cámara escala hasta que el visor ocupa ~40% del alto del viewport. (C) `transform-origin` fijado en el centro del visor; escala 1 → ~6 con `ease.scrub`. (A) si hay secuencia `frames-zoom`, el canvas cambia a esa secuencia y la avanza; si no, el canvas escala con `transform-origin` en el ocular medido sobre el último frame. Labels y wordmark se desvanecen |
| **F3 A través del visor** | 0.55 → 0.70 | Mask / clip-path reveal | Dentro del visor aparece el paisaje: el contenedor del paisaje tiene `clip-path` con el rectángulo redondeado exacto del visor; la imagen interior parte en `scale 1.4`. La cámara sigue escalando hasta que su cuerpo sale del viewport; el recorte del paisaje crece con ella |
| **F4 Paisaje a sangre** | 0.70 → 0.85 | Clip-path reveal → full-bleed | El recorte llega a `inset(0 0 0 0 round 0px)`: paisaje a pantalla completa; la imagen interior termina en `scale 1.0`. Aparece el texto superpuesto por líneas |
| **F5 Tarjeta** | 0.85 → 1.00 | Scale + border-radius | El paisaje se reduce al tamaño de tarjeta elegido: `clip-path: inset(Y X Y X round 24px)` (se anima clip-path, no width), la imagen interior hace un leve contra-zoom para no perder encuadre. Al llegar a 1.00 se libera el pin y la tarjeta continúa subiendo con el scroll normal |

### Datos a medir antes de programar F2–F3 (opciones A y C)
- Construye un **helper de desarrollo** activado con `?debug=hero`: al hacer clic sobre la imagen de la cámara, registra en consola las coordenadas relativas (0–1) del clic. Con A, el usuario marca las 4 esquinas del ocular en el **último frame** del giro (y en el último de `frames-zoom` si existe); con C, las del visor en la foto frontal y en la de 3/4. Guarda esos valores en `src/content/hero.ts` como `viewfinderRect`. **No estimes las coordenadas a ojo.**

### Adaptación
- **Móvil (<1024px):** escena de 300%; giro de 20°; se omite el crossfade a 3/4 si la foto no es legible; paisaje vertical 9:16; tarjeta final a 92% de ancho y radio 16px; frames de la opción A a mitad de resolución y la mitad de cantidad.
- **Reduced motion:** sin pin. Hero estático con wordmark y cámara frontal; debajo, el paisaje ya en forma de tarjeta con un fade de 0.4s al entrar en viewport.
- **Sin JS:** wordmark, cámara frontal y paisaje en tarjeta visibles en flujo normal.

### Requisitos técnicos por opción
- **A (secuencia):** rutas, cantidad y tamaños desde `manifest.json` vía `getSequence` (variante `desktop` o `mobile` según `gsap.matchMedia`); nunca cantidades fijas en el código; precarga progresiva (primero cada 4º frame para mostrar algo rápido, luego el resto) y reporta progreso real al preloader; dibujar con `drawImage` en modo cover; limitar `devicePixelRatio` a 2; el índice de frame se anima con un objeto `{ frame: 0 }` en el timeline y se redibuja en `onUpdate` solo si cambió.
- **B (3D):** modelo con Draco/meshopt; `frameloop="demand"` e `invalidate()` desde el `onUpdate` del ScrollTrigger; luz de estudio suave; en móvil DPR máx. 1.5.
- **C (2.5D):** PNG/WebP sin fondo con dimensiones idénticas y la cámara centrada igual en ambas fotos; contenedor con `perspective`; `will-change: transform` solo mientras la escena está activa.

## Orden de implementación

1. Componente `src/features/landing/scenes/HeroCamera.tsx` con estructura de capas y estado final estático (sin animación). **Validar con el usuario.**
2. F0 intro. **Validar.**
3. Helper `?debug=hero` y medición del visor (solo C). **Validar valores.**
4. F1 + F2. **Validar.**
5. F3 + F4. **Validar.**
6. F5 y liberación del pin; comprobar que la siguiente sección empieza sin salto. **Validar.**
7. Versiones móvil y reduced motion. **Validar en 375px y con emulación.**
8. Indicador de progreso (si se eligió).

## Checklist de aceptación
- [ ] El orden es exactamente: nombre → cámara frontal → giro → acercamiento al visor → paisaje a través del visor → paisaje a sangre → tarjeta redondeada → scroll normal.
- [ ] Scroll hacia arriba reproduce la escena al revés sin saltos.
- [ ] No hay salto de layout al liberar el pin.
- [ ] 60 fps estables en desktop medio (Performance panel sin tareas largas durante el scrub).
- [ ] Refrescar la página a mitad de la escena la deja en el estado correcto.
- [ ] Móvil y reduced motion probados.
- [ ] `docs/escenas/hero.md` refleja lo implementado.

Termina con: **"Hero listo. Siguiente paso: `/kit-galeria-columnas` (prompt 06)."**
