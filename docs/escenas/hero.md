# Escena `hero` — SUPAROLL → la cámara gira → visor → paisaje → tarjeta

Escena de apertura de la Home. Cubre las secciones `hero` y `viewfinder` de [`docs/03-arquitectura.md`](../03-arquitectura.md) en un solo pin, como indica el mapa de coreografía de [`docs/04-motion.md`](../04-motion.md).

## Fórmula

| Pieza | Valor |
|---|---|
| Término | Pinning + scrubbing de secuencia de frames + clip-path reveal |
| Elemento | Wordmark SUPAROLL, cámara (canvas con 120 frames), paisaje |
| Activación | Top de la sección en el top del viewport, tras la intro por tiempo |
| Evolución | Giro de la cámara → acercamiento al ocular → paisaje dentro del visor → paisaje a sangre → tarjeta |
| Final | Tarjeta de paisaje al 88% del ancho con radio 24px; se libera el pin y sigue el scroll normal |
| Adaptación | Móvil: 300% de scroll y frames `mobile`. Reduced motion: sin pin, estado final visible |

## Técnica

**Opción A — secuencia de imágenes en canvas.** Decidida por atajo: los manifests ya existen en el pack.

| Dato | Valor |
|---|---|
| Secuencia | `hero-sequence` vía `getSequence` |
| Desktop | 120 frames, 1920×1080, `/media/hero/frames/desktop/%04d.webp` |
| Móvil | 60 frames, 960×540, `/media/hero/frames/mobile/%04d.webp` |
| Fondo de la escena | `#e7e4da` (color muestreado del video, ver [`docs/assets.md`](../assets.md)) |
| Recorrido del giro | Frames 1 → 97 (`turnEndRatio: 0.81`): de la vista frontal a la trasera recta. Los frames siguientes giran de más y no se usan |

`hero-sequence-zoom` **no se usa**: arranca otra vez en la vista frontal y entra por la ventana frontal del visor, así que encadenarla tras el giro daría un salto de trasera a frontal. El acercamiento de F2 se hace escalando el canvas con `transform-origin` en el ocular trasero.

## Capas (de atrás hacia delante)

| z | Capa | Elemento |
|---|---|---|
| 0 | Fondo | Superficie `#e7e4da` |
| 20 | Cámara | `<canvas>` con la secuencia. Debajo, `hero-camera-front` como `<img>` para el estado sin JS y antes del primer dibujo |
| 25 | Wordmark | `h1` SUPAROLL en `--text-mega`, texto real para SEO |
| 30 | Paisaje | `hero-landscape` / `hero-landscape-mobile` dentro de un contenedor con `clip-path` que empieza con la forma y posición del ocular |
| 40 | UI | Labels de esquina, label de scroll, línea de progreso y label de fase |

El wordmark va **por encima** del canvas (z-25) con `mix-blend-mode: multiply`, no por debajo. Los frames son opacos y cubren el viewport, así que una capa inferior quedaría invisible; multiplicando, las letras se leen sobre el fondo claro y se hunden dentro del cuerpo de la cámara, que es el efecto buscado.

Todas las capas viven **dentro** del elemento que se pinea (`[data-hero="stage"]`). Es un requisito, no un detalle: ScrollTrigger envuelve el elemento pineado en su propio `pin-spacer`, y un paisaje hermano del escenario mediría el alto completo de la escena (viewport + 450%), con lo que el `inset()` vertical dejaría de coincidir con lo que se ve.

## Fases

Timeline único con pin y `scrub: scrub.scene`. Duración total: `+=450%` de la altura del viewport en desktop, `+=300%` en móvil.

| Fase | Progreso | Término | Qué ocurre |
|---|---|---|---|
| **F0 Intro** | por tiempo, antes del scroll | Split-text (chars) + scale + fade | Las letras de SUPAROLL suben desde máscara con `stagger.chars` y `ease.reveal`; 0.3s después la cámara frontal pasa de `scale .92 / opacity 0` a `1 / 1`; aparecen los labels y "Desliza para revelar" |
| **F1 Giro** | 0.00 → 0.30 | Scrubbing de frames | El canvas avanza del frame 1 al de la trasera recta (`turnEndRatio`) y el acercamiento empieza con la cámara de frente. El wordmark se desplaza en X (`xPercent: -14`) y baja su opacidad a 0.15. El label de scroll desaparece al 5% |
| **F2 Acercamiento** | 0.30 → 0.55 | Zoom con foco en el ocular | El encaje del frame se recalcula cada tick: el zoom sube hasta que el ocular ocupa el 32% del alto del viewport y el punto focal viaja del centro de la cámara al centro del `viewfinderRect`. Labels de esquina y wordmark se desvanecen |
| **F3 A través del visor** | 0.55 → 0.70 | Clip-path anclado al ocular | El paisaje aparece **dentro** del ocular: el `clip-path: inset()` se recalcula desde la proyección del `viewfinderRect`, así que la ventana queda pegada al hueco real mientras la cámara sigue avanzando (`exitZoomFactor` 1.5). La imagen interior va de `scale 1.4` a `1.12` |
| **F4 Paisaje a sangre** | 0.70 → 0.85 | Clip-path → full-bleed | El recorte interpola del ocular a `inset(0 0 0 0 round 0)`; la imagen interior termina en `scale 1`; la capa de cámara se desvanece por detrás. En la segunda mitad entra el overlay "El mundo, tal como lo ves" por líneas |
| **F5 Tarjeta** | 0.85 → 1.00 | Clip-path + radio | El recorte se cierra a la tarjeta: 88% del ancho con radio 24px (92% y 16px en móvil). Se anima `clip-path`, nunca `width`. La imagen interior hace un contra-zoom leve (`scale 1.06`). Al llegar a 1.00 se libera el pin |

Etiquetas del timeline: `f1-giro`, `f2-acercamiento`, `f3-visor`, `f4-sangre`, `f5-tarjeta`.

El acercamiento **no** usa `transform` ni `transform-origin` sobre el canvas: se anima un objeto de estado `{ frame, zoom, focusX, focusY, reveal, card }` y en cada `onUpdate` se recalcula el rectángulo de dibujo del frame. Así el `clip-path` del paisaje y el frame dibujado se derivan del mismo cálculo y no pueden desincronizarse.

### Intro y bloqueo de scroll

La intro solo bloquea el scroll (vía [`scroll-lock.ts`](../../src/shared/lib/motion/scroll-lock.ts), con `unlock` de seguridad a 1.8s) cuando la escena ya está arriba del viewport al cargar. Hoy la sección `preloader` ocupa la primera pantalla, así que en la práctica la intro se dispara al entrar la escena (`top 65%`) y sin bloqueo; cuando el prompt 09 convierta el preloader en overlay, la rama con bloqueo pasa a ser la habitual.

Si se recarga con la escena ya avanzada, la intro se descarta: sus `from()` devolverían visibilidad a labels y wordmark que el scrub ya había dejado fuera.

### Pie de foto

El texto del overlay vive en un marco (`[data-hero="overlay-frame"]`) a tamaño completo que se desplaza con `translate3d` para anclarse a la esquina inferior izquierda del recorte visible. De lo contrario el pie se corta por el borde del `clip-path` mientras la ventana se abre y, al final, contra el borde de la tarjeta. Su ancho es propio (`w-[min(18ch,72vw)] shrink-0`) para que `SplitText` mida las líneas sobre el ancho definitivo y no sobre el tamaño del ocular.

## Datos medidos

Ambos rectángulos están en [`src/content/hero.ts`](../../src/content/hero.ts), en coordenadas relativas (0–1) sobre la imagen del frame:

| Dato | Valor | Cómo se obtuvo |
|---|---|---|
| `cameraBox` | `x .245  y .26  w .515  h .645` | Unión de la silueta detectada en 9 frames del giro, descartando la sombra proyectada. Sirve para encajar la cámara en el viewport |
| `viewfinderRect` | `x .370  y .333  w .042  h .060` | Hueco oscuro del ocular trasero sobre el frame 97 (trasera recta), ajustado hasta que la caja cae dentro del hueco y no sobre la goma |
| `viewfinderTargetHeight` | `0.32` | Alto del ocular al final de F2, en fracción del viewport. Por encima de ~0.36 el frame se ve blando al ampliarlo |

`?debug=hero` dibuja sobre el canvas la caja proyectada del ocular (rojo) y la de la cámara (amarillo), y registra en consola las coordenadas 0–1 de cada clic más el `viewfinderRect` resultante. Los valores no se estiman a ojo.

La conversión de esos rectángulos a valores de `inset()` de viewport vive en [`src/features/landing/lib/hero-geometry.ts`](../../src/features/landing/lib/hero-geometry.ts) como funciones puras, teniendo en cuenta el encaje del frame y el zoom del momento.

## Indicador de progreso

Línea de progreso de 2px en el borde inferior (`scaleX` de 0 a 1, color `--color-shutter`) más un label mono con la fase. El label se actualiza desde el `onUpdate` del ScrollTrigger, no desde el del timeline: en un refresh con la página ya desplazada, GSAP renderiza el timeline con los callbacks suprimidos y el texto se quedaría en la primera fase.

| Rango | Label |
|---|---|
| 0.00 → 0.30 | `01 — Encuadra` |
| 0.30 → 0.70 | `02 — Mira` |
| 0.70 → 1.00 | `03 — Revela` |

## Adaptación

- **Móvil (<1024px):** escena de 300%; variante `mobile` de la secuencia (60 frames, 960×540); paisaje vertical `hero-landscape-mobile`; tarjeta final al 92% del ancho con radio 16px. La cámara se encaja más ancha y menos alta (`fit: .94 / .52`) para aprovechar el formato vertical.
- **Reduced motion:** sin pin y sin scrub. El escenario pasa a alto automático: la cámara ocupa un bloque de 80svh con el frame inicial y, debajo, el paisaje en forma de tarjeta con un fade de 0.4s al entrar en viewport. Se ocultan el label de scroll, la línea de progreso y el label de fase, que son afordancias de scroll.
- **Sin JS:** wordmark, `hero-camera-front` y el paisaje en tarjeta visibles en el flujo normal. El canvas no dibuja y la imagen de respaldo queda visible.

## Rendimiento

- Precarga progresiva: primero cada 4º frame para poder dibujar algo pronto, después el resto, con concurrencia limitada. El progreso real se expone para el preloader del prompt 09.
- Mientras falta un frame se dibuja el más cercano ya cargado, así el giro nunca se queda en blanco.
- `devicePixelRatio` limitado a 2 en desktop y móvil, con suavizado `high`. El frame se dibuja encajando `cameraBox` en el viewport y estirando los píxeles del borde para cubrir el resto, porque el fondo del video es un degradado y un color plano se notaría.
- Se redibuja solo si cambió el índice entero del frame, el zoom o el punto focal.
- Solo se animan `transform`, `opacity` y `clip-path`.
- `ScrollTrigger.refresh()` una vez cuando termina la precarga inicial, nunca por frame.
- La ruta de los frames se construye en el cliente desde el manifest ya serializado; `src/shared/lib/assets.ts` (con Zod y el inventario completo) se queda en el servidor.
