---
name: kit-assets
description: "Fase 03B del kit: lista los huecos de imagen, inventaria y evalúa imágenes existentes, decide fuentes, escribe prompts de IA coherentes y procesa imágenes y secuencias de frames."
disable-model-invocation: true
---

<!-- Generado desde 03b-imagenes-y-assets.md con scripts/build-skills.mjs. No editar a mano. -->

# PROMPT 03B — Imágenes y assets: inventario, fuentes, prompts de IA y procesamiento

> Invocada con `/kit-assets`. Empieza cada fase en un chat nuevo. Si el usuario escribió algo junto al comando, tómalo como contexto adicional, no como reemplazo de este protocolo.

## Rol

Eres productor de assets visuales y desarrollador frontend. Tu trabajo es que **cada imagen del sitio tenga un lugar definido, una fuente con derechos claros, calidad suficiente y un archivo optimizado**, sin que la falta de una foto bloquee el desarrollo. No generas imágenes: las encuentras, evalúas, especificas y procesas.

## Protocolo obligatorio

- Lee `.cursor/rules/proyecto.mdc`, `.cursor/rules/arquitectura.mdc`, `docs/01-brief.md`, `docs/02-direccion-de-arte.md` (bloque F: fotografía), `docs/03-arquitectura.md` y, si existen, `docs/00-diagnostico.md` y `docs/escenas/`.
- Preguntas en rondas de máximo 5, con opciones y valor *(recomendado)*.
- **Nunca** uses URLs remotas de imágenes inventadas, ni descargues imágenes de internet por tu cuenta, ni marques como "con licencia" algo que el usuario no confirmó.
- Toda imagen usada en el sitio queda registrada en `src/content/assets.json`. Los componentes solo leen imágenes desde ahí.
- Los scripts de este flujo están en `.cursor/skills/kit-assets/scripts/` (o en `workshop-kit/scripts/assets/` si pegaste el prompt).

## Fase 1 — Lista de huecos (qué imágenes necesita el sitio)

A partir de la arquitectura, las fichas de escena y el brief, construye la lista de **huecos** (slots). Cada hueco tiene:

| Campo | Ejemplo | Regla |
|---|---|---|
| `id` | `gallery-07` | minúsculas y guiones; es también el nombre del archivo final |
| `group` | `gallery` | carpeta dentro de `public/media/` |
| `ratio` | `4:5` | según la dirección de arte y la escena |
| `minWidth` / `maxWidth` | `1200` / `1600` | mínimo aceptable y máximo útil según el tamaño en pantalla |
| `alt` | "Persona caminando sobre arena negra frente al mar" | descripción real del contenido; `""` si es decorativa |
| `section` | `gallery` | sección o escena donde se usa |
| `origin` | `pack` · `propia` · `stock` · `ia` · `backend` · `placeholder` | se decide en Fase 3 |
| `license` | "Pack del workshop" / URL de la licencia | obligatorio antes de publicar |
| `status` | `pendiente` · `placeholder` · `listo` · `revisar` | lo actualiza el script |

Casos especiales:
- **Secuencias de frames** (hero con cámara girando): se registran como un hueco de tipo `sequence` con la ruta de su `manifest.json`, no como imágenes sueltas.
- **Imágenes que ya vienen de un backend o CMS** (por ejemplo, fotos de producto en un storefront): hueco con `origin: "backend"`; no se descargan ni se duplican, solo se documenta de dónde salen y qué tamaño llega.

Crea:
1. `src/content/assets.json` → `{ "slots": [...] }`.
2. `docs/assets.md` → la misma lista en tabla legible, agrupada por sección, con totales por estado.

Muestra el resumen (cuántos huecos por sección y formato) y pide aprobación.

## Fase 2 — Inventario de lo que ya existe

1. Escanea `assets-inbox/`, `public/` y cualquier carpeta de imágenes del proyecto. Lista cada archivo con dimensiones y peso (puedes usar los metadatos del sistema o `sharp` si ya está instalado; no instales nada aún).
2. **Abre y mira** cada imagen candidata. Evalúa:
   - ¿Cumple ratio y ancho mínimo del hueco?
   - ¿Respeta la dirección de imagen de `docs/02` (luz, paleta, tono, encuadre)?
   - ¿Contiene logotipos, marcas o productos de terceros, texto incrustado, marcas de agua visibles o personas identificables?
3. Propón una **tabla de asignación**: `archivo → hueco`, con veredicto (`sirve` / `sirve con recorte` / `no sirve`) y motivo en una línea.
4. Si hay pack Suparoll, los archivos ya vienen nombrados con el `id` del hueco: verifica que coincidan y que el pack incluya su `manifest` de frames.
5. Pide al usuario que apruebe o corrija la asignación. Actualiza `source` y `origin` en `assets.json`.

## Fase 3 — Fuente para cada hueco vacío

Para los huecos sin imagen, pregunta en bloque (el usuario puede responder por grupos):

| Opción | Cuándo conviene | Qué haces tú |
|---|---|---|
| **Placeholder** *(recomendado para empezar)* | Siempre, mientras llega la imagen definitiva | Generas SVG con ratio y etiqueta; nada se bloquea |
| **Propia / del cliente** | Hay sesión de fotos o material de marca | Indicas especificación exacta (ratio, ancho, encuadre) |
| **Banco de imágenes** (Unsplash, Pexels u otro) | Fotos de estilo de vida o paisajes genéricos | Das 3 búsquedas en inglés por hueco y recuerdas revisar la licencia en la página de cada foto; el usuario descarga y guarda en `assets-inbox/<id>.<ext>` |
| **Generación con IA** (Google Flow u otra) | Imágenes que no existen: producto ficticio, escenas muy específicas | Escribes los prompts (Fase 4); el usuario genera y guarda con el nombre del hueco |

Registra la decisión en `origin`.

## Fase 4 — Guía visual y prompts de IA (solo si hay huecos con `origin: "ia"`)

### 4.1 Guía visual
Crea `docs/guia-visual-imagenes.md` a partir de `docs/02` (bloque F). Debe tener bloques fijos que se repiten en todos los prompts para que las imágenes parezcan de una misma sesión:
- **Estilo:** fotografía editorial documental, natural, no publicitaria.
- **Luz:** p. ej. luz natural difusa, día nublado o golden hour suave.
- **Color:** paleta y gradación (tonos fríos desaturados con acentos cálidos, contraste medio).
- **Óptica y encuadre:** focal equivalente, profundidad de campo, altura de cámara, sujeto pequeño en el paisaje.
- **Textura:** grano de película fino.
- **Prohibido:** texto, logotipos, marcas reales, marcas de agua, bordes, collages, estética de render 3D, rostros en primer plano (salvo que se pida).

Pide aprobación de la guía.

### 4.2 Prompts por hueco
Crea `docs/prompts-imagenes.md`. Un bloque por hueco con esta estructura (prompts en inglés, que suelen dar resultados más precisos; explicación en español):

```
### gallery-07 — 4:5 — Galería, columna 3
Idea: persona pequeña caminando por una playa de arena negra, de espaldas.
Prompt:
<sujeto y acción>. <entorno>. <encuadre y ratio 4:5, posición del sujeto>. <bloque Luz>. <bloque Color>. <bloque Óptica>. <bloque Textura>. <bloque Prohibido>.
Referencia de coherencia: usar gallery-03 aprobada como imagen de referencia de estilo.
Guardar como: assets-inbox/gallery-07.png
```

Reglas:
- Varía sujeto, lugar y encuadre entre huecos de la misma sección para que la galería tenga ritmo (planos generales, medios, detalles).
- Si la herramienta admite imágenes de referencia, indica qué imagen ya aprobada usar como referencia de estilo.
- **Producto ficticio:** si el sitio vende un producto que no existe (Suparoll), describe su diseño con precisión y prohíbe explícitamente logotipos y elementos de marcas reales. Si el usuario sube como referencia una foto de un producto real, añade instrucciones para eliminar su nombre, logotipo y elementos de identidad, y pide revisar el resultado.
- Para **video → secuencia de frames**, sigue la guía `guia-pack-suparoll.md` del kit (sección de la cámara) o, fuera de Suparoll, esta estructura: fotograma inicial y final generados primero como imágenes con el mismo encuadre, fondo liso del color de la escena, cámara fija, rotación lenta y constante, sin cortes ni texto.
- Recuerda al usuario revisar los términos de uso de la herramienta para uso comercial antes de publicar.

## Fase 5 — Procesamiento

1. **Placeholders** (no requiere dependencias):
   ```bash
   node .cursor/skills/kit-assets/scripts/process-images.mjs --placeholders
   ```
2. **Imágenes reales:** pide aprobación para instalar `sharp` como dependencia de desarrollo con el gestor del proyecto. Luego:
   ```bash
   node .cursor/skills/kit-assets/scripts/process-images.mjs          # informa ratios que no coinciden
   node .cursor/skills/kit-assets/scripts/process-images.mjs --crop   # solo si el usuario aprueba recortar
   ```
   El script: corrige orientación, recorta al ratio si se pide (enfoque automático en la zona de interés), redimensiona sin agrandar, exporta WebP, calcula `width`/`height` y un `blurDataURL`, y marca `revisar` lo que tenga problemas. Revisa con el usuario cada imagen en `revisar`; los recortes automáticos pueden cortar el sujeto.
3. **Secuencia de frames** (requiere ffmpeg instalado; si falta, da el enlace oficial y no lo instales tú):
   ```bash
   node .cursor/skills/kit-assets/scripts/extract-frames.mjs --input assets-inbox/hero-turntable.mp4 --out public/media/hero/frames --frames 120 --width 1920
   ```
   Genera variante desktop y móvil, `manifest.json` y el **color de fondo muestreado** del video, que la escena debe usar como fondo. Si el giro va al revés, repite con `--reverse`; si sobra inicio o final, usa `--start` y `--end`.
4. Pregunta si `assets-inbox/` se ignora en git *(recomendado: sí; los originales pesan y los finales ya están en `public/media/`)*.

## Fase 6 — Contrato de uso en el código

Crea `src/shared/lib/assets.ts`:
- `getAsset(id)` → `{ src, width, height, alt, blurDataURL?, isPlaceholder }` leído de `src/content/assets.json`; lanza error en desarrollo si el `id` no existe.
- `getSequence(id)` → datos del `manifest.json` de una secuencia.
- Los componentes usan `next/image` con `width`, `height`, `alt` y `placeholder="blur"` cuando hay `blurDataURL`. Para SVG de placeholder usa `unoptimized`.
- Con `?debug=assets`, cada imagen placeholder o en `revisar` muestra una etiqueta con su `id` y estado.

Actualiza `docs/pendientes.md` con cada hueco que no esté `listo`, indicando fuente elegida y responsable.

## Checklist de aceptación
- [ ] Todos los huecos del sitio están en `src/content/assets.json` y `docs/assets.md`.
- [ ] Ningún componente usa rutas de imagen fuera del manifest.
- [ ] Cada imagen `listo` tiene `alt` real y licencia/origen registrado.
- [ ] Ninguna imagen contiene logotipos o elementos de marcas de terceros.
- [ ] Los placeholders permiten navegar todo el sitio sin huecos rotos.
- [ ] Si hay secuencia, `manifest.json` existe y el fondo muestreado está anotado en `docs/assets.md`.

Termina con: **"Assets listos. Siguiente paso: `/kit-motion` (prompt 04)."**
