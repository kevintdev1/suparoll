---
name: kit-transiciones
description: "Fase 07 del kit: define e implementa transiciones entre secciones (cover, reveal, sticky card stacking, revelado de foto, footer reveal)."
disable-model-invocation: true
---

<!-- Generado desde 07-transiciones-entre-secciones.md con scripts/build-skills.mjs. No editar a mano. -->

# PROMPT 07 — Transiciones entre secciones (cover, reveal, stacking, revelado)

> Invocada con `/kit-transiciones`. Empieza cada fase en un chat nuevo. Si el usuario escribió algo junto al comando, tómalo como contexto adicional, no como reemplazo de este protocolo.

## Rol

Eres creative developer especializado en capas y contextos de apilamiento. Defines e implementas **cómo pasa una sección a la siguiente** en toda la Home, y las escenas `features`, `develop` y `footer`. Idea del cliente: *"al bajar, esa sección se pasa por detrás y la otra sección sube por encima"*.

## Protocolo obligatorio

- Lee `.cursor/rules/proyecto.mdc`, todo `docs/` y las fichas de `docs/escenas/`. Consulta las GSAP Skills.
- Para cada frontera entre secciones, especifica **qué capa se mueve y qué capa queda anclada** (el diccionario lo exige: cover ≠ reveal).
- Preguntas → ficha `docs/escenas/transiciones.md` → aprobación → implementación frontera por frontera con validación.

## Conceptos que debes explicar al usuario antes de preguntar (breve)

- **Section cover:** la sección nueva sube *por encima*; la anterior queda anclada detrás (pin con `pinSpacing: false`) y se atenúa.
- **Section reveal / uncover:** la sección actual se retira hacia arriba y *descubre* la de atrás, que ya estaba fija.
- **Sticky card stacking:** tarjetas ancladas que se apilan una encima de otra.
- **Footer reveal:** el footer está fijo detrás del contenido y aparece cuando la última sección se retira.

## Ronda 1 — Mapa de fronteras (aprobar fila por fila)

| Frontera | Tipo propuesto | Capa que se mueve | Capa anclada | Tratamiento de la capa de atrás |
|---|---|---|---|---|
| `hero/viewfinder` → `manifesto` | Flujo normal | La tarjeta de paisaje sube con el scroll | — | — |
| `manifesto` → `gallery` | Flujo normal | — | — | — |
| `gallery` → `features` | **Section cover** | `features` sube por encima | `gallery` (últimos 100vh) | Escala 1 → 0.94, scrim 0 → 45%, `border-radius` 0 → 24px |
| `features` (interna) | **Sticky card stacking** | Cada tarjeta nueva | Tarjetas anteriores | Escala 1 → 0.92 por cada tarjeta que la cubre, brillo 1 → 0.7 |
| `features` → `develop` | **Section cover** con fondo tinta | `develop` | Última tarjeta | Scrim 0 → 60% |
| `develop` (interna) | Pin + scrub de revelado | Foto instantánea | Sección | Ver ficha abajo |
| `develop` → `specs` | **Section reveal** | `develop` sube y se va | `specs` estaba fija detrás | — |
| `specs` → `colors` | Flujo normal con cambio de fondo papel → paper-2 | — | — | Crossfade de color de fondo al 50% |
| `faq` → `cta-final` | **Section cover** | `cta-final` (fondo tinta) | `faq` | Escala 0.96, scrim 40% |
| `cta-final` → `footer` | **Footer reveal** | `cta-final` sube y se va | `footer` fijo detrás | Wordmark gigante del footer sube de `yPercent 30` a 0 |

Preguntas: ¿apruebas cada frontera? ¿Quieres menos transiciones ancladas? *(recomendado para móvil: solo cover sin pin y footer reveal)*.

## Ronda 2 — Escena `features` (tarjetas apiladas)

1. ¿Cuántas tarjetas? (las del brief; recomendado 3).
2. **Visibilidad de las tarjetas de atrás:** se asoma el encabezado de cada una (offset 48px) *(recomendado)* / se cubren por completo.
3. **Contenido de cada tarjeta:** número grande (mono), título display, texto, imagen de detalle de la cámara. ¿Imagen a la derecha *(recomendado)* o de fondo?
4. ¿Qué pasa al terminar? La pila se libera y sube completa *(recomendado)* / la pila se desvanece.

Ficha (valores recomendados): término *Sticky card stacking*; elementos `article.card` × 3 dentro de un contenedor; activación cuando el top de cada tarjeta llega a `top + 80px + (índice × 48px)`; evolución: cada tarjeta se ancla (pin sin spacing) y, mientras la siguiente sube, escala a `1 - 0.04 × tarjetas encima` y baja brillo; final: al anclarse la última, se mantiene 50vh y se libera todo el grupo; móvil: tarjetas en flujo normal con leve escala al entrar; reduced: flujo normal sin escala.

## Ronda 3 — Escena `develop` (la foto que se revela)

Concepto: una fotografía instantánea con marco blanco aparece en el centro, **en blanco/gris como recién salida de la cámara**, y con el scroll **se revela** hasta la imagen a color, mientras un contador mono avanza ("00:00 → 00:15").

1. **Imagen a revelar** (ruta) y texto que acompaña.
2. **Estilo del revelado:** de gris lechoso a color (`filter: saturate(0) brightness(1.8) contrast(0.6)` → normal) *(recomendado)* / de negro a color / con desenfoque inicial.
3. **Movimiento del marco:** la instantánea sale desde abajo como expulsada por la cámara y rota de -6° a 0° *(recomendado)* / estática.
4. **Contador:** tiempo simbólico / sin contador. (No afirmar un tiempo real de revelado si no está en el brief.)
5. **Duración en scroll:** 200% *(recomendado)* / 300%.

Ficha: pin de 200%; 0–0.25 la instantánea entra desde `yPercent 60` con rotación; 0.25–0.85 scrub de filtro y opacidad de una capa blanca encima de la foto (1 → 0); 0.85–1 el texto aparece por líneas; móvil: igual con 150%; reduced: foto ya revelada con fade.

> Nota técnica: animar `filter` en una imagen grande puede ser costoso. Implementación preferida: dos capas (foto a color + capa blanca/gris con `mix-blend-mode` o `opacity`), animando solo `opacity`. Usa `filter` solo si el rendimiento en móvil es aceptable.

## Requisitos técnicos comunes

- Cover: la sección de atrás se ancla con `pin: true, pinSpacing: false` y la nueva sección debe tener `position: relative` y `z-index` mayor. Documenta el orden de `z-index` de todas las secciones en la ficha.
- Cuidado con los **contextos de apilamiento**: `transform`, `filter` y `opacity < 1` crean contextos nuevos; verifica que el scrim y la escala no hagan que la sección de atrás se pinte por encima.
- Footer reveal: el footer es `position: fixed; bottom: 0; z-index: 0` y el `main` tiene `margin-bottom` igual a la altura del footer (medida con ResizeObserver) y fondo sólido. Desactivar en móvil si la altura del footer supera el 90% del viewport.
- Los pins de secciones consecutivas se crean en orden y se refrescan después de que carguen las imágenes.
- Los scrims son elementos `div` con `pointer-events: none`, no `box-shadow`.

## Orden de implementación
1. Tabla de `z-index` y estructura de capas estática. **Validar.**
2. `gallery` → `features` (cover). **Validar.**
3. `features` stacking. **Validar.**
4. `develop` completo. **Validar.**
5. `develop` → `specs` (reveal). **Validar.**
6. `faq` → `cta-final` → `footer`. **Validar.**
7. Recorrido completo de la Home de arriba abajo y de abajo arriba, desktop y móvil, reduced motion. **Validar.**

## Checklist de aceptación
- [ ] En cada frontera se entiende qué capa se mueve y cuál queda atrás.
- [ ] Ningún elemento anclado tapa CTAs o texto de la sección nueva.
- [ ] Sin saltos al entrar/salir de pins; la barra de scroll no "brinca".
- [ ] El foco del teclado nunca queda en una sección cubierta (elementos cubiertos con `inert` mientras están tapados, o verificación manual con Tab).
- [ ] Móvil y reduced motion probados.
- [ ] `docs/escenas/transiciones.md` actualizado.

Termina con: **"Transiciones listas. Siguiente paso: `/kit-ecommerce` si el sitio vende, o `/kit-ui-global` (prompts 08 / 09)."**
