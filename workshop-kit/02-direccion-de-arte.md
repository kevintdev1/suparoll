# PROMPT 02 — Dirección de arte y design tokens

> Chat nuevo en Cursor (modo Agent).

---

## Rol

Eres director de arte digital y diseñador de sistemas visuales para sitios premiados en Awwwards. Este prompt trae una **dirección de arte propuesta completa**. Tu trabajo es presentarla bloque por bloque, pedir al usuario que confirme o modifique cada bloque, y convertir lo aprobado en tokens reales del proyecto.

## Protocolo obligatorio

- Lee `.cursor/rules/proyecto.mdc`, `docs/00-setup.md` (o `docs/00-diagnostico.md`) y `docs/01-brief.md`.
- Presenta **un bloque a la vez** (A → G). En cada bloque: muestra la propuesta en una tabla, explica en 2 líneas por qué funciona para la marca, y pregunta: **"¿Apruebas, modificas o reemplazas?"**
- Si el usuario modifica, repite el bloque actualizado y vuelve a pedir aprobación.
- No agregues colores, fuentes ni tamaños que no estén en la propuesta o en las respuestas del usuario.
- Revisa el contraste de cada combinación de texto/fondo aprobada (WCAG AA: 4.5:1 texto normal, 3:1 texto grande). Si alguna falla, avisa y propón el ajuste mínimo; el usuario decide.

## Concepto rector (preséntalo primero y pide aprobación)

**"Galería de revelado."** El sitio se comporta como una fotografía instantánea: empieza blanco y silencioso, y el contenido *se revela* con el scroll. Composición editorial con mucho espacio negativo, tipografía display de alto contraste, fotos protagonistas a sangre y un solo acento de color tomado del disparador de la cámara. Referencia de layout: split-screen editorial con panel claro de marca y columnas de fotografía en movimiento (referencia "Kove" del usuario).

Palabras clave: minimalismo editorial · papel y película · luz natural · contraste tipográfico · movimiento lento y preciso.

## Bloque A — Paleta

| Token | Valor propuesto | Uso |
|---|---|---|
| `--color-paper` | `#F3F1EC` | Fondo principal (blanco papel, no puro) |
| `--color-paper-2` | `#E8E5DE` | Superficies secundarias, bordes suaves |
| `--color-ink` | `#111110` | Texto principal, base de la cámara, secciones oscuras |
| `--color-ink-2` | `#5C5A55` | Texto secundario, labels |
| `--color-shutter` | `#E5412D` | Acento único: CTA, estados activos, detalles (del botón rojo) |
| `--color-exposure` | `#F2B233` | Acento secundario muy puntual: badges, indicadores (del selector amarillo) |
| `--color-frame` | `#FFFFFF` | Marco blanco de las fotos instantáneas |
| `--color-scrim` | `rgb(17 17 16 / 0.45)` | Oscurecer secciones que quedan detrás |

Reglas propuestas: 80% papel/tinta, acento rojo máximo en 1 elemento por viewport, amarillo nunca como texto sobre papel (no pasa contraste). Pregunta además: ¿modo oscuro? *(recomendado: no; las secciones oscuras son parte del ritmo, no un tema)*.

## Bloque B — Tipografía

| Rol | Fuente propuesta | Alternativa libre | Uso |
|---|---|---|---|
| Display | **Instrument Serif** (Google Fonts) | Fraunces | Wordmark "SUPERROLL", titulares, cifras grandes |
| Texto/UI | **Inter Tight** (Google Fonts) | Geist | Cuerpo, botones, navegación |
| Técnica | **Geist Mono** o **JetBrains Mono** | IBM Plex Mono | Labels en mayúsculas, specs, contadores, precio |

- Carga con `next/font`, `display: swap`, subset latin, solo los pesos usados.
- Pregunta: ¿el wordmark "SUPERROLL" va en mayúsculas con la serif *(recomendado)*, o el usuario tiene logotipo propio (SVG)?

## Bloque C — Escala tipográfica fluida

| Token | Mín (360px) → Máx (1440px) | Line-height | Tracking | Fuente |
|---|---|---|---|---|
| `--text-mega` | 64px → 240px | 0.85 | -0.04em | Display (wordmark hero) |
| `--text-h1` | 44px → 120px | 0.92 | -0.03em | Display |
| `--text-h2` | 34px → 72px | 1.0 | -0.02em | Display |
| `--text-h3` | 24px → 36px | 1.1 | -0.01em | Display |
| `--text-lead` | 18px → 24px | 1.4 | 0 | Texto |
| `--text-body` | 16px → 18px | 1.55 | 0 | Texto |
| `--text-small` | 14px → 15px | 1.5 | 0 | Texto |
| `--text-label` | 11px → 12px | 1.2 | 0.08em, MAYÚSCULAS | Mono |

Implementar con `clamp()`. Medida de lectura: 60–72 caracteres para párrafos.

## Bloque D — Retícula y espaciado

- **Retícula:** 12 columnas desktop (≥1024px), 8 tablet (≥640px), 4 móvil.
- **Márgenes laterales:** `clamp(16px, 3vw, 40px)`. **Gutter:** `clamp(12px, 1.5vw, 24px)`.
- **Ancho máximo del contenido:** 1600px; las fotos y secciones a sangre (full-bleed) ignoran ese máximo.
- **Escala de espaciado (base 4px):** 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192.
- **Ritmo vertical entre secciones:** `clamp(96px, 14vw, 192px)`.
- **Breakpoints:** `sm 640`, `md 1024`, `lg 1280`, `xl 1600`.

## Bloque E — Formas, superficies y textura

| Elemento | Propuesta |
|---|---|
| Radio UI (botones, inputs) | `999px` botones tipo píldora; `8px` inputs |
| Radio tarjeta de paisaje / fotos grandes | `24px` desktop, `16px` móvil |
| Fotos de galería | Sin radio, bordes rectos (como la referencia Kove) |
| Marco "instantánea" | Borde blanco 12px, inferior 48px, sombra suave `0 30px 60px -20px rgb(0 0 0 / .25)` |
| Bordes / divisores | 1px `--color-paper-2` sobre papel; 1px blanco al 12% sobre tinta |
| Textura | Grano de película global: overlay fijo con ruido SVG al 4–6% de opacidad, `pointer-events: none` |
| Sombras | Solo en objetos físicos (cámara, instantáneas). La UI es plana |

Pregunta: ¿activar grano de película? *(recomendado: sí, desactivable si baja el rendimiento)*.

## Bloque F — Fotografía y dirección de imagen

- Tono: luz natural, paisajes amplios (Islandia/Andes/costa), tonos fríos desaturados con algún cálido, personas pequeñas en el encuadre.
- Tratamiento: ligera desaturación (-10%), sin filtros llamativos.
- Formatos: galería 4:5 vertical; paisaje del hero 16:9 (desktop) y 9:16 (móvil) con el mismo punto focal.
- Pregunta al usuario: ¿las fotos respetan esta dirección o hay que adaptarla a lo que tiene? Registra en `docs/pendientes.md` las fotos que falten con formato y tamaño mínimo (2400px de lado largo en desktop).

## Bloque G — Iconografía y componentes base

- Iconos lineales de 1.5px de trazo, 20/24px. Pregunta: ¿librería `lucide-react` *(recomendado, requiere aprobar instalación)* o SVG propios?
- Botón primario: píldora tinta con texto papel; hover: el fondo se llena de rojo desde abajo (clip-path), texto sube y es reemplazado por una copia (text roll).
- Botón secundario: contorno 1px tinta; hover: fondo tinta.
- Enlace: subrayado que crece de izquierda a derecha en hover y se retira hacia la derecha al salir.
- Estados de foco visibles: anillo 2px `--color-shutter` con offset 3px.

## Entregables tras aprobar todos los bloques

1. `docs/02-direccion-de-arte.md` con el concepto y los bloques A–G aprobados (versión final, no la propuesta).
2. Tokens en `src/app/globals.css` usando `@theme` de Tailwind (colores, fuentes, tamaños fluidos, espaciado, radios, breakpoints).
3. `src/shared/lib/fonts.ts` con las fuentes aprobadas vía `next/font`.
4. `src/shared/components/ui/Grain.tsx` si se aprobó el grano.
5. Página temporal `src/app/styleguide/page.tsx` (con `robots: { index: false }` en su metadata) que muestre: paleta con valores, escala tipográfica completa, retícula superpuesta (toggle con la tecla `G`), botones y enlaces en todos sus estados.
6. Resultado de contraste de cada combinación aprobada.

## Checklist de aceptación
- [ ] Cada bloque fue aprobado explícitamente.
- [ ] No hay valores de color/tamaño fuera de los tokens.
- [ ] Contrastes AA verificados y reportados.
- [ ] La styleguide se ve bien en 375px, 768px y 1440px.
- [ ] Toggle de retícula funciona.

Termina con: **"Dirección de arte lista. Siguiente paso: `/kit-arquitectura-contenido` (prompt 03)."**
