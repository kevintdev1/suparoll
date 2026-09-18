# Escena `gallery` — panel de marca + columnas con parallax opuesto

Sección de galería editorial split-screen inspirada en la referencia "Kove". Panel claro de marca a la izquierda; retícula de fotos verticales a la derecha con calles negras y parallax por columnas.

## Fórmula

| Pieza | Valor |
|---|---|
| Término | Parallax scrolling por columnas (scroll-linked, scrub) + sticky CSS del escenario |
| Elemento | Escenario `100svh` sticky: `aside` panel (40%) + recorte de 4 columnas (60%) |
| Activación | Desde que el top de la sección toca el bottom del viewport hasta que su bottom toca el top |
| Evolución | Direcciones arriba · abajo · arriba · abajo. Deltas de la ficha del kit: -25 / +25 / -35 / +25. Ease `none`, `scrub: true` |
| Final | Columnas en posición de salida; el escenario se libera al terminar la sección |
| Adaptación | Móvil: 2 columnas (arriba/abajo) a ±12%; panel arriba en flujo, recorte `140svh`. Reduced: recorte estático; fade al entrar |

## Layout

| Decisión | Valor |
|---|---|
| Split | 40% panel / 60% retícula |
| Columnas desktop | 4 |
| Columnas móvil | 2 |
| Direcciones (L→R) | arriba · abajo · arriba · abajo |
| Escenario desktop | `position: sticky; top: 0; height: 100svh` en el split (CSS, no pin GSAP) |
| Calles | Fondo `--color-ink`, gutter 8px |
| Fotos | Ratio display 4:5, sin radio |

El recorte de columnas es `overflow: hidden` y **más bajo que las listas**. Cada `ul` empieza con `align-items: start` para no estirarse al alto del recorte: al hacer `yPercent` nunca aparece un hueco de tinta.

## Parallax desktop

Valores aplicados (ficha del kit desplazada -10 para que `yPercent` no sea positivo):

| Columna | Inicio | Fin | Delta |
|---|---|---|---|
| 1 | -10 | -35 | -25 |
| 2 | -35 | -10 | +25 |
| 3 | -10 | -45 | -35 |
| 4 | -25 | 0 | +25 |

ScrollTrigger: `start: "top bottom"`, `end: "bottom top"`, `scrub: true`, `ease: "none"`.

`will-change: transform` en columnas solo cuando la sección está activa (`onToggle`).

## Parallax móvil

| Columna | Inicio | Fin |
|---|---|---|
| 1 | 0 | -12 |
| 2 | -12 | 0 |

## Entrada

Cada foto con clip-path reveal desde abajo, disparado **una vez por columna** con `stagger.items` cuando la sección entra (`top 80%`).

El panel usa `RevealText` para título y frase.

## Interacciones

- **Hover:** la imagen interior escala 1 → 1.06. El label de lugar/año no se pinta mientras el caption sea `[[PENDIENTE: lugar/año]]`.
- **Clic:** visor fullscreen con `<dialog>` accesible.

## Fórmula de altura de columna

```
visibleHeight = 100svh          // recorte desktop
buffer = maxTravelPercent × columnContentHeight
columnContentHeight > visibleHeight + buffer
maxTravelPercent = 0.45         // col 3 tras el desplazamiento -10
```

La sección desktop mide `220svh`: el escenario sticky ocupa `100svh` y el resto es recorrido de scrub.

## Implementación

| Archivo | Rol |
|---|---|
| `src/content/gallery.ts` | Distribución de fotos y config parallax |
| `src/features/landing/sections/Gallery.tsx` | Server Component: track + escenario sticky |
| `src/features/landing/scenes/GalleryPanel.tsx` | Panel de marca |
| `src/features/landing/scenes/GalleryColumns.tsx` | Recorte, parallax y reveal |
| `src/features/landing/components/GalleryPhoto.tsx` | Hover + trigger lightbox |
| `src/features/landing/components/GalleryLightbox.tsx` | Dialog accesible |

## Assets

16 fotos reales (`gallery-01`…`gallery-16`); 24 slots (6 por columna) rotando assets. Faltan fotos únicas — ver `asset-016` en `docs/pendientes.md`. Imágenes horizontales en contenedor 4:5 con `object-cover` hasta `/kit-assets`.
