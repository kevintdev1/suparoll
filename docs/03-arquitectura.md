# 03 — Arquitectura de páginas, secciones y contenido

Fuente única de verdad para la estructura del sitio Suparoll. Los prompts de motion (04–09) y commerce (08) leen los IDs de sección definidos aquí.

## Decisiones confirmadas

| Decisión | Valor |
|---|---|
| Mapa del sitio | Home, `/camara`, carrito (drawer + fallback `/carrito`), `/checkout`, `/soporte`, legales, `not-found` |
| Opcionales excluidos | `/pelicula`, `/journal` |
| Home | 13 secciones en orden propuesto (incluye `develop` y `social`) |
| Newsletter | Sí, modo demostración |
| Navbar | Cámara, Soporte + Carrito `(n)` a la derecha |

---

## Mapa del sitio

| Ruta | Página | Prioridad | Notas |
|---|---|---|---|
| `/` | Home — scrollytelling y compra rápida | Imprescindible | 13 secciones con IDs fijos |
| `/camara` | Página de producto (PDP) | Imprescindible | Variantes, specs, FAQ producto |
| `/carrito` | Fallback sin JS | Imprescindible | Drawer global en prompt 08; esta ruta es respaldo |
| `/checkout` | Checkout | Imprescindible | Mock o real — se decide en prompt 08 |
| `/soporte` | FAQ, envíos, devoluciones, garantía, contacto | Imprescindible | Reutiliza FAQ compartida |
| `/legal/privacidad` | Política de privacidad | Imprescindible | Contenido legal pendiente |
| `/legal/terminos` | Términos y condiciones | Imprescindible | Contenido legal pendiente |
| `not-found` | 404 | Recomendado | Instantánea "sin revelar" |

---

## Home — Secciones

| # | ID | Sección | Objetivo | Motion (prompt) | Contenido final |
|---|---|---|---|---|---|
| 0 | `preloader` | Preloader | Cargar recursos del hero sin saltos | 09 | Wordmark pequeño "SUPAROLL"; contador 0–100 |
| 1 | `hero` | Nombre + cámara | Primer impacto: marca y objeto | 05 | Wordmark "SUPAROLL"; label scroll "Desliza para revelar"; labels mono: `[[PENDIENTE: modelo]]` · `2026` |
| 2 | `viewfinder` | A través del visor | Transición: entrar en la cámara | 05 | Paisaje 16:9 / 9:16; overlay "El mundo, tal como lo ves" |
| 3 | `manifesto` | Manifiesto | Emoción: por qué una foto física | 04/07 | Párrafo de 40 palabras (ver `src/content/home.ts`) |
| 4 | `gallery` | Galería de columnas | Mostrar lo que se captura | 06 | Panel: título "SUPAROLL", frase "Cada instante, se revela", CTA "Conoce la cámara" → `/camara`; 16–24 fotos 4:5 |
| 5 | `features` | Beneficios | Explicar los 3 beneficios | 07 | 3 tarjetas: fotos en segundos / diseño icónico / sin pantallas |
| 6 | `develop` | Se revela en segundos | Demostrar revelado instantáneo | 07 | Instantánea gris→color; contador `[[PENDIENTE: tiempo de revelado]]` |
| 7 | `specs` | Especificaciones | Resolver dudas técnicas | 07 | Lista desde `product.specs` (pendiente brief-007); imagen perfil cámara |
| 8 | `colors` | Elige tu color | Selección de variante | 08 | Variante blanco; precio `[[PENDIENTE]]`; CTA "Añadir al carrito" |
| 9 | `social` | Comunidad / reseñas | Confianza | 06/07 | Reseñas `[[PENDIENTE]]` — se oculta en producción si vacío; placeholder en workshop |
| 10 | `faq` | Preguntas frecuentes | Quitar objeciones | 09 | 7 preguntas en acordeón (`src/content/faq.ts`) |
| 11 | `cta-final` | Cierre | Conversión | 07 | Titular "Tu próximo recuerdo empieza aquí"; precio `[[PENDIENTE]]`; CTA "Comprar ahora"; label envío/garantía `[[PENDIENTE]]` |
| 12 | `footer` | Footer revelado | Navegación y cierre de marca | 07 | Wordmark a sangre; enlaces nav; newsletter demo; legal |

---

## Página de producto `/camara`

| # | Bloque | Contenido |
|---|---|---|
| 1 | Galería + panel compra | Imágenes producto (scroll vertical izq.) + panel sticky: nombre `[[PENDIENTE: modelo]]`, precio `[[PENDIENTE]]`, variantes (radio blanco), cantidad, CTA, envío/garantía `[[PENDIENTE]]` |
| 2 | En la caja | Lista desde `product.specs.inTheBox` — `[[PENDIENTE]]` |
| 3 | Especificaciones | Tabla/acordeón con specs del brief — `[[PENDIENTE]]` |
| 4 | Fotos tomadas | Galería estática (reutiliza componente gallery) |
| 5 | FAQ producto | Subset de FAQ con tag `product` |
| 6 | Relacionados | Accesorios `[[PENDIENTE]]` — oculto si vacío |

---

## Página `/soporte`

| Bloque | Contenido |
|---|---|
| Hero | Titular "¿En qué podemos ayudarte?" |
| FAQ completa | Todas las entradas de `src/content/faq.ts` |
| Envíos | `[[PENDIENTE: política de envío]]` |
| Devoluciones | `[[PENDIENTE: política de devoluciones]]` |
| Garantía | `[[PENDIENTE: garantía]]` |
| Contacto | `[[PENDIENTE: email / teléfono]]` |

---

## Legales

| Ruta | Contenido |
|---|---|
| `/legal/privacidad` | `[[PENDIENTE: política de privacidad]]` |
| `/legal/terminos` | `[[PENDIENTE: términos y condiciones]]` |

---

## Navbar

| Enlace | Ruta | Posición |
|---|---|---|
| Cámara | `/camara` | Izquierda |
| Soporte | `/soporte` | Izquierda |
| Carrito | drawer (fallback `/carrito`) | Derecha, contador `(n)` |

---

## Footer

| Elemento | Contenido |
|---|---|
| Wordmark | SUPAROLL (display, a sangre) |
| Enlaces | Cámara, Soporte, Privacidad, Términos |
| Newsletter | Campo email + botón "Suscribirme" (modo demostración) |
| Redes | `[[PENDIENTE: redes sociales]]` |
| Legal | © Suparoll · Privacidad · Términos |

---

## Microcopy global

| Contexto | Texto |
|---|---|
| Añadir al carrito | Añadir al carrito |
| Añadido | Añadido |
| Ver carrito | Ver carrito |
| Ir a pagar | Ir a pagar |
| Carrito vacío | Tu carrito está vacío. Explora la cámara y guarda tu favorita. |
| Error de pago | No pudimos procesar el pago. Revisa tus datos e inténtalo de nuevo. |
| Sin stock | Agotado |
| Label scroll | Desliza para revelar |
| Preloader | Contador 0–100 + wordmark "SUPAROLL" |
| 404 título | Esta foto aún no se ha revelado |
| 404 cuerpo | La página que buscas no existe o se movió. Vuelve al inicio y sigue explorando. |
| 404 CTA | Volver al inicio |
| Newsletter éxito | ¡Listo! |
| Newsletter placeholder | Tu correo |

---

## Implementación

- Contenido tipado en `src/content/home.ts`, `product-page.ts`, `faq.ts`, `site.ts`.
- Placeholders de sección en `src/features/landing/sections/`.
- Datos de producto en `src/content/product.ts` (no duplicar variantes).
