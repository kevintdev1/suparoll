# 02 — Dirección de arte

Fuente única de verdad para tokens visuales del proyecto Suparoll.

## Concepto rector

**"Galería de revelado."** El sitio se comporta como una fotografía instantánea: empieza blanco y silencioso, y el contenido se revela con el scroll. Composición editorial con mucho espacio negativo, tipografía display de alto contraste, fotos protagonistas a sangre y un solo acento de color tomado del disparador de la cámara. Referencia de layout: split-screen editorial con panel claro de marca y columnas de fotografía en movimiento (referencia "Kove").

Palabras clave: minimalismo editorial · papel y película · luz natural · contraste tipográfico · movimiento lento y preciso.

## Bloque A — Paleta

| Token | Valor | Uso |
|---|---|---|
| `--color-paper` | `#F3F1EC` | Fondo principal |
| `--color-paper-2` | `#E8E5DE` | Superficies secundarias, bordes suaves |
| `--color-ink` | `#111110` | Texto principal, base de la cámara, secciones oscuras |
| `--color-ink-2` | `#5C5A55` | Texto secundario, labels |
| `--color-shutter` | `#E5412D` | Acento único: CTA, estados activos, detalles |
| `--color-exposure` | `#F2B233` | Acento secundario puntual: badges, indicadores |
| `--color-frame` | `#FFFFFF` | Marco blanco de fotos instantáneas |
| `--color-scrim` | `rgb(17 17 16 / 0.45)` | Oscurecer secciones que quedan detrás |

Reglas: 80% papel/tinta; acento rojo máximo en 1 elemento por viewport; amarillo nunca como texto sobre papel. **Modo oscuro:** no — las secciones oscuras son ritmo editorial, no un tema global.

## Bloque B — Tipografía

| Rol | Fuente | Uso |
|---|---|---|
| Display | Instrument Serif | Wordmark "SUPAROLL", titulares, cifras grandes |
| Texto/UI | Inter Tight | Cuerpo, botones, navegación |
| Técnica | Geist Mono | Labels en mayúsculas, specs, contadores, precio |

Wordmark "SUPAROLL" en mayúsculas con la serif display (sin logotipo SVG propio).

Carga: `next/font`, `display: swap`, subset latin, solo pesos usados.

## Bloque C — Escala tipográfica fluida

| Token | Mín (360px) → Máx (1440px) | Line-height | Tracking | Fuente |
|---|---|---|---|---|
| `--text-mega` | 64px → 240px | 0.85 | -0.04em | Display |
| `--text-h1` | 44px → 120px | 0.92 | -0.03em | Display |
| `--text-h2` | 34px → 72px | 1.0 | -0.02em | Display |
| `--text-h3` | 24px → 36px | 1.1 | -0.01em | Display |
| `--text-lead` | 18px → 24px | 1.4 | 0 | Texto |
| `--text-body` | 16px → 18px | 1.55 | 0 | Texto |
| `--text-small` | 14px → 15px | 1.5 | 0 | Texto |
| `--text-label` | 11px → 12px | 1.2 | 0.08em, MAYÚSCULAS | Mono |

Implementación: `clamp()`. Medida de lectura: 60–72 caracteres para párrafos.

## Bloque D — Retícula y espaciado

- **Retícula:** 12 columnas desktop (≥1024px), 8 tablet (≥640px), 4 móvil.
- **Márgenes laterales:** `clamp(16px, 3vw, 40px)`.
- **Gutter:** `clamp(12px, 1.5vw, 24px)`.
- **Ancho máximo contenido:** 1600px; fotos y secciones full-bleed ignoran ese máximo.
- **Escala de espaciado (base 4px):** 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192.
- **Ritmo vertical entre secciones:** `clamp(96px, 14vw, 192px)`.
- **Breakpoints:** `sm 640`, `md 1024`, `lg 1280`, `xl 1600`.

## Bloque E — Formas, superficies y textura

| Elemento | Valor |
|---|---|
| Radio botones | `999px` (píldora) |
| Radio inputs | `8px` |
| Radio tarjeta paisaje / fotos grandes | `24px` desktop, `16px` móvil |
| Fotos de galería | Sin radio, bordes rectos |
| Marco instantánea | Borde blanco 12px, inferior 48px, sombra `0 30px 60px -20px rgb(0 0 0 / .25)` |
| Bordes / divisores | 1px `--color-paper-2` sobre papel; 1px blanco al 12% sobre tinta |
| Textura | Grano de película global: overlay SVG al 5% opacidad, `pointer-events: none` |
| Sombras | Solo en objetos físicos (cámara, instantáneas). UI plana |

## Bloque F — Fotografía y dirección de imagen

- Tono: luz natural, paisajes amplios, tonos fríos desaturados con algún cálido, personas pequeñas en el encuadre.
- Tratamiento: ligera desaturación (-10%), sin filtros llamativos.
- Formatos: galería 4:5 vertical; hero 16:9 desktop y 9:16 móvil con mismo punto focal.
- Assets pendientes registrados en [`docs/pendientes.md`](pendientes.md) (asset-001 a asset-004).

## Bloque G — Iconografía y componentes base

- Iconos: `lucide-react`, trazo 1.5px, tamaños 20/24px.
- Botón primario: píldora tinta con texto papel; hover: fondo rojo desde abajo (clip-path), text roll.
- Botón secundario: contorno 1px tinta; hover: fondo tinta.
- Enlace: subrayado que crece L→R en hover, se retira hacia la derecha al salir.
- Focus visible: anillo 2px `--color-shutter` con offset 3px.

## Contraste WCAG AA (verificado)

| Combinación | Ratio | Resultado |
|---|---|---|
| `--color-ink` sobre `--color-paper` | 16.7:1 | AA ✓ |
| `--color-ink-2` sobre `--color-paper` | 6.1:1 | AA ✓ |
| `--color-paper` sobre `--color-ink` | 16.7:1 | AA ✓ |
| `--color-shutter` sobre `--color-paper` | 3.6:1 | Solo texto grande / acentos, no body |
| `--color-exposure` sobre `--color-paper` | 1.7:1 | No usar como texto sobre papel |
