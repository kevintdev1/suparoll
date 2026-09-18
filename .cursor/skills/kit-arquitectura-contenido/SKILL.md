---
name: kit-arquitectura-contenido
description: "Fase 03 del kit: define páginas, secciones con IDs, textos y microcopy aprobados, y crea el esqueleto navegable."
disable-model-invocation: true
---

<!-- Generado desde 03-arquitectura-y-contenido.md con scripts/build-skills.mjs. No editar a mano. -->

# PROMPT 03 — Arquitectura de páginas, secciones y contenido

> Invocada con `/kit-arquitectura-contenido`. Empieza cada fase en un chat nuevo. Si el usuario escribió algo junto al comando, tómalo como contexto adicional, no como reemplazo de este protocolo.

## Rol

Eres arquitecto de información y UX writer para e-commerce de producto único. Vas a definir **qué páginas existen, qué secciones tiene cada una, en qué orden y con qué contenido**, a partir de la propuesta de este prompt y las respuestas del usuario.

## Protocolo obligatorio

- Lee `.cursor/rules/proyecto.mdc`, `.cursor/rules/arquitectura.mdc`, `docs/01-brief.md` y `docs/02-direccion-de-arte.md`. Si existe `docs/00-diagnostico.md`, parte de las rutas existentes y marca como nuevo solo lo que se añada.
- Presenta primero el **mapa del sitio** y pide aprobación. Luego recorre la **Home sección por sección**, y después el resto de páginas.
- Para cada sección: muestra objetivo, contenido requerido y pregunta al usuario por los textos. Puedes ofrecer **3 opciones de texto** basadas en el brief (tono y beneficios aprobados); el usuario elige, edita o escribe el suyo. Nunca dejes un texto sin aprobación: si no hay decisión, `[[PENDIENTE]]`.
- No inventes datos (precios, specs, testimonios, políticas): tómalos de `docs/01-brief.md` o márcalos pendientes.

## Mapa del sitio propuesto

| Ruta | Página | Prioridad |
|---|---|---|
| `/` | Home — experiencia de scrollytelling y compra rápida | Imprescindible |
| `/camara` | Página de producto (PDP) con variantes y specs completas | Imprescindible |
| `/carrito` | Drawer lateral global (no página); `/carrito` como fallback sin JS | Imprescindible |
| `/checkout` | Checkout (mock o real, se decide en prompt 08) | Imprescindible |
| `/pelicula` | Película y accesorios | Opcional |
| `/journal` | Historias / galería de fotos de la comunidad | Opcional |
| `/soporte` | FAQ, envíos, devoluciones, garantía, contacto | Imprescindible |
| `/legal/privacidad`, `/legal/terminos` | Legales | Imprescindible si se publica |
| `not-found` | 404 con una instantánea "sin revelar" | Recomendado |

Pregunta: ¿qué opcionales se incluyen? *(recomendado para el workshop: ninguno; construir Home + PDP + carrito + checkout + soporte)*.

## Home — Guion de secciones propuesto

Cada sección tiene un ID que usarán los prompts de motion. No cambies los IDs sin actualizar `docs/`.

| # | ID | Sección | Objetivo | Contenido requerido | Motion (prompt) |
|---|---|---|---|---|---|
| 0 | `preloader` | Preloader | Cargar la secuencia/recursos del hero sin saltos | Contador 0–100, wordmark pequeño | 09 |
| 1 | `hero` | Nombre + cámara | Primer impacto: marca y objeto | Wordmark SUPERROLL, cámara frontal, label de scroll ("Desliza para revelar"), 2 labels mono en esquinas (ej. modelo y año) | 05 |
| 2 | `viewfinder` | A través del visor | Transición: entrar en la cámara y ver el mundo | Foto de paisaje 16:9 / 9:16, texto corto superpuesto (máx. 8 palabras) | 05 |
| 3 | `manifesto` | Manifiesto | Emoción: por qué una foto física | 1 párrafo de 30–50 palabras en `--text-h2`, revelado por líneas | 04/07 |
| 4 | `gallery` | Galería de columnas | Mostrar lo que se captura | Panel izquierdo: wordmark/título + frase + CTA; derecha: 16–24 fotos 4:5 con alt | 06 |
| 5 | `features` | Beneficios | Explicar los 3 beneficios del brief | 3 tarjetas: número, título (≤4 palabras), texto (≤25 palabras), imagen o detalle de la cámara | 07 (tarjetas apiladas) |
| 6 | `develop` | "Se revela en segundos" | Demostrar el revelado instantáneo | Instantánea con marco blanco que pasa de gris/blanco a foto a color con el scroll; contador de tiempo | 07 |
| 7 | `specs` | Especificaciones | Resolver dudas técnicas | Lista de specs del brief, imagen de la cámara de perfil | 07 (cover) |
| 8 | `colors` | Elige tu color | Selección de variante | Variantes del brief, foto por variante, precio, CTA "Añadir al carrito" | 08 |
| 9 | `social` | Comunidad / reseñas | Confianza | Reseñas reales o `[[PENDIENTE]]`; si no hay, se oculta la sección | 06/07 |
| 10 | `faq` | Preguntas frecuentes | Quitar objeciones | 5–7 preguntas en acordeón (datos del brief) | 09 |
| 11 | `cta-final` | Cierre | Conversión | Titular grande, precio, CTA, garantía/envío en label | 07 |
| 12 | `footer` | Footer revelado | Navegación y cierre de marca | Wordmark gigante a sangre, enlaces, redes, newsletter (¿sí/no?), legal | 07 (footer reveal) |

Preguntas sobre la Home:
1. ¿Apruebas este orden? ¿Quitas, agregas o reordenas secciones?
2. ¿La sección `develop` (foto que se revela) se incluye? *(recomendado: sí, es la firma del concepto)*
3. ¿Newsletter en el footer? Si sí, ¿con qué servicio real o solo demostración? (se construye en el prompt 09)
4. Navbar: ¿enlaces a mostrar? *(recomendado: Cámara, Película —si existe—, Soporte, y a la derecha Carrito (n))*.

## Página de producto `/camara` — secciones

1. Galería de producto (imágenes grandes con scroll vertical en la izquierda) + panel de compra sticky a la derecha: nombre, precio, variantes (radio group de color), cantidad, CTA, envío/garantía.
2. "En la caja" (lista con ilustraciones o fotos).
3. Especificaciones completas (tabla o acordeón).
4. Fotos tomadas con la cámara (reutiliza componente de galería en versión estática).
5. FAQ específica del producto.
6. Productos relacionados (si hay accesorios).

Pregunta por los textos de cada una siguiendo el mismo método.

## Microcopy global (pedir aprobación)

Botones y estados: "Añadir al carrito", "Añadido", "Ver carrito", "Ir a pagar", carrito vacío, error de pago, 404, sin stock, label de scroll, textos del preloader. Ofrece opciones en el tono aprobado.

## Entregables

1. `docs/03-arquitectura.md`: mapa del sitio aprobado, tabla de secciones por página con IDs, objetivos y contenido final.
2. `src/content/home.ts`, `src/content/product-page.ts`, `src/content/faq.ts`, `src/content/site.ts` (navbar, footer, microcopy, SEO básico por ruta: title y description), todos tipados.
3. Archivos de rutas vacíos con un componente placeholder por sección (`src/features/landing/sections/<Id>.tsx`) que muestre su ID y nombre, para que la Home ya tenga el esqueleto navegable con alturas aproximadas.
4. Actualiza `docs/pendientes.md` con cada texto e imagen faltante (sección, formato, tamaño).

## Checklist de aceptación
- [ ] Mapa del sitio y orden de la Home aprobados.
- [ ] Ningún texto comercial sin aprobación o sin marca `[[PENDIENTE]]`.
- [ ] El contenido vive en `src/content/`, no dentro del JSX.
- [ ] La Home muestra todas las secciones placeholder en orden.
- [ ] Pendientes actualizados.

Termina con: **"Arquitectura lista. Siguiente paso: `/kit-assets` (prompt 03B)."**
