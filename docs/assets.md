# Assets — inventario de imágenes

Registro legible de [`src/content/assets.json`](../src/content/assets.json), que es la fuente única de verdad. Ningún componente usa rutas de imagen fuera de ese archivo: se leen con `getAsset(id)` y `getSequence(id)` de [`src/shared/lib/assets.ts`](../src/shared/lib/assets.ts).

Origen de todo el material actual: **pack del workshop**, generado con IA. Licencia registrada por slot como "Generado con IA para el workshop".

## Totales por estado

| Estado | Cantidad | Significado |
|---|---|---|
| `listo` | 6 | Ratio, ancho y contenido correctos |
| `revisar` | 23 | El script marcó ratio o ancho fuera de especificación |
| `pendiente` | 1 | Registrado pero sin usar |
| **Total** | **30** | |

Los 23 `revisar` no bloquean el desarrollo: las imágenes existen y se ven. Vienen del procesamiento sin `--crop`, así que su ratio real no coincide con el declarado. Antes de publicar hay que decidir por grupo si se recortan (`process-images.mjs --crop`) o se reemplazan.

## Hero (`hero`)

| id | Uso | Ratio declarado | Archivo | Estado |
|---|---|---|---|---|
| `hero-sequence` | Giro de la cámara, escena hero (F1) | secuencia | `/media/hero/frames/manifest.json` | `listo` |
| `hero-camera-front` | Cámara frontal sin JS y antes de que el canvas dibuje | 16:9 | `/media/hero/hero-camera-front.webp` | `listo` |
| `hero-camera-back` | Sin uso actual; la trasera sale de la secuencia | 16:9 | `/media/hero/hero-camera-back.webp` | `revisar` |
| `hero-sequence-zoom` | **No se usa** — ver nota abajo | secuencia | `/media/hero/frames-zoom/manifest.json` | `pendiente` |

### Secuencia `hero-sequence`

| Variante | Ruta | Frames | Tamaño |
|---|---|---|---|
| desktop | `/media/hero/frames/desktop` | 120 | 1920×1080 |
| mobile | `/media/hero/frames/mobile` | 60 | 960×540 |

Patrón de archivo `%04d.webp` (1-indexado). El giro va de la vista frontal (frame 1) a la trasera 3/4 (frame 120), donde el ocular queda visible. Cantidades y rutas se leen siempre del manifest, nunca fijas en el código.

**Fondo muestreado del video: `#e7e4da`.** No coincide con `--color-paper` (`#F3F1EC`): es un tono ligeramente más cálido y oscuro. La escena hero usa `#e7e4da` como fondo para que no se note el borde del encuadre del video. No es un token nuevo de la paleta y no debe usarse en ninguna otra sección.

### Nota sobre `hero-sequence-zoom`

La secuencia de acercamiento no encadena con el giro: arranca otra vez en la vista frontal y entra por la ventana frontal del visor, terminando dentro del cristal casi en negro. Usarla después del giro produciría un salto de trasera a frontal. El acercamiento de F2 se hace escalando el canvas con `transform-origin` en el ocular trasero. La secuencia queda registrada por si se re-extrae desde `assets-inbox/hero-zoom.mp4` con otro encuadre.

## Visor (`viewfinder`)

| id | Uso | Ratio declarado | Archivo | Estado |
|---|---|---|---|---|
| `hero-landscape` | Paisaje a través del visor, desktop | 16:9 | `/media/hero/hero-landscape.webp` (2752×1536) | `listo` |
| `hero-landscape-mobile` | Paisaje a través del visor, móvil | 9:16 | `/media/hero/hero-landscape-mobile.webp` (1536×2752) | `listo` |

`alt` escrito a partir de lo que muestran las imágenes (playa de arena negra con una persona caminando). **Pendiente de confirmación del usuario** — registrado en [`docs/pendientes.md`](pendientes.md) como `asset-014`.

## Galería (`gallery`)

| id | Ratio declarado | Ratio real | Estado |
|---|---|---|---|
| `gallery-01` … `gallery-16` | 4:5 | 2752×1536 (horizontal) | `revisar` |

16 fotos disponibles frente a las 20 que declara `homeContent.gallery.photoCount`, y todas son horizontales donde la dirección de arte pide 4:5 vertical. Se resuelve en el prompt 06.

## Beneficios (`features`)

| id | Ratio declarado | Ratio real | Estado |
|---|---|---|---|
| `feature-01` | 4:5 | 2400×1792 | `revisar` |
| `feature-02` | 4:5 | 1792×2400 | `revisar` |
| `feature-03` | 4:5 | 1792×2400 | `revisar` |

## Revelado (`develop`)

| id | Ratio | Archivo | Estado |
|---|---|---|---|
| `develop-photo` | 1:1 | `/media/develop/develop-photo.webp` | `listo` |

## Especificaciones (`specs`)

| id | Ratio | Archivo | Estado |
|---|---|---|---|
| `specs-camera-side` | 4:3 | `/media/product/specs-camera-side.webp` | `listo` |

## Variantes de color (`colors`)

| id | Ratio declarado | Ratio real | Estado |
|---|---|---|---|
| `color-blue` | 4:5 | 1792×2400 | `revisar` |
| `color-red` | 4:5 | 1792×2400 | `revisar` |

La sección declara una sola variante blanca en [`docs/03-arquitectura.md`](03-arquitectura.md); estas dos imágenes son azul y rojo. Se decide en el prompt 08.

## Metadatos (`metadata`)

| id | Ratio declarado | Ratio real | Estado |
|---|---|---|---|
| `og-image` | 1200:630 | 1200×670 | `revisar` |

## Convenciones de uso

- Imágenes con `next/image`, `width`, `height`, `alt` y `placeholder="blur"` cuando el slot tiene `blurDataURL`.
- Los `alt` describen lo que muestra la imagen; `""` solo si es decorativa.
- `getAsset` y `getSequence` lanzan error si el `id` no existe, así que un hueco mal escrito falla en el build, no en producción.
- Marca comercial en los `alt`: "Suparoll". El pack venía con "Superroll One"; el nombre del modelo sigue pendiente (`brief-004`) y no se usa en ningún texto.
- `?debug=assets` (etiquetas sobre placeholders) todavía no está implementado — registrado en pendientes.
- `src/content/assets.json` y los `manifest.json` de `public/media/` los escriben los scripts del kit con tabulaciones, así que están excluidos del formateador en `biome.json`. No editarlos a mano salvo los campos `alt` y `notes`.
