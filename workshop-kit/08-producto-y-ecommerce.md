# PROMPT 08 — Producto, variantes, carrito y checkout

> Chat nuevo en Cursor (modo Agent).

---

## Rol

Eres desarrollador frontend de e-commerce con criterio de UX de conversión. Construyes la sección `colors` de la Home, la página `/camara`, el carrito y el checkout. Aquí la prioridad es **que comprar sea claro, rápido y accesible**; el motion acompaña, nunca estorba.

## Protocolo obligatorio

- Lee `.cursor/rules/proyecto.mdc`, `.cursor/rules/arquitectura.mdc`, todo `docs/`, `src/content/product.ts` y `src/content/product-page.ts`.
- Si existe `docs/00-diagnostico.md` (proyecto existente), la capa de datos, el carrito y el checkout **ya existen**: tu trabajo es mejorar UI, estados y microinteracciones sin cambiar su lógica. Salta la Ronda 1 salvo la pregunta 4 y reutiliza lo existente.
- Rondas de preguntas → `docs/08-commerce.md` → aprobación → implementación con validación.
- Precios, stock, envíos y políticas vienen solo del brief. Si faltan, la UI muestra el estado y el dato queda `[[PENDIENTE]]`.

## Ronda 1 — Backend de compra

1. **¿Cómo se procesa la compra?**
   - Backend existente detectado en `docs/00-diagnostico.md`: reutilizar su capa de datos *(recomendado si existe)*.
   - Mock local: carrito en estado del cliente + checkout simulado con pantalla de confirmación *(recomendado para el workshop si no hay backend)*.
   - MedusaJS como backend de comercio (catálogo, carrito y órdenes reales).
   - Enlace de pago externo (Stripe Payment Links u otro).
   - Otro: ¿cuál?
2. Si es mock: crea el feature `src/features/commerce/` según el anexo de arquitectura, con una **interfaz** en `types/` y la implementación en `lib/` (`getProduct`, `addToCart`, `updateLine`, `removeLine`, `getCart`, `checkout`) y una implementación mock, para poder cambiar después a Medusa u otro sin tocar componentes. ¿Apruebas?
3. **Persistencia del carrito:** `localStorage` *(recomendado en mock)* / servidor / ninguna.
4. **Stock:** ¿se muestra disponibilidad? ¿Hay variantes agotadas para probar el estado?
5. **Envío:** ¿costo fijo, gratis desde un monto, por calcular? (dato del brief o `[[PENDIENTE]]`).

## Ronda 2 — UX de compra

1. **Selector de color:** radio group con muestras circulares + nombre del color visible *(recomendado)* / tarjetas con foto.
2. **Al cambiar de color:** la foto de la cámara hace crossfade y el fondo de la sección cambia sutilmente al tono de la variante *(recomendado)* / solo cambia la foto.
3. **Al añadir al carrito:** se abre el drawer del carrito *(recomendado)* / toast "Añadido" con acción "Ver carrito" / ambos.
4. **Microinteracción de añadir:** una miniatura de la cámara "vuela" desde el botón al ícono del carrito (shared element con `Flip`) y el contador hace un pequeño bump *(recomendado)* / solo cambio de texto del botón a "Añadido ✓".
5. **Checkout:** una página con pasos en acordeón (contacto → envío → pago → revisión) *(recomendado)* / una sola columna larga.

## Especificación de componentes

### Sección `colors` (Home)
- Layout: foto grande de la variante (izquierda, 7 col) + panel (derecha, 5 col) con nombre, precio en mono, radio group, CTA primario, labels de envío/garantía.
- Radio group accesible (flechas cambian opción, `aria-checked`, foco visible).
- Crossfade de imágenes con `dur.base` y `ease.out`; precarga las imágenes de todas las variantes al entrar en viewport.

### Página `/camara`
- Columna izquierda: imágenes del producto en scroll vertical; columna derecha: panel de compra `sticky` (CSS) con los mismos controles de `colors` (reutiliza el componente).
- Móvil: carrusel de imágenes con scroll snap y barra inferior fija con precio + CTA que aparece cuando el CTA principal sale del viewport.
- Secciones de `docs/03-arquitectura.md` con `RevealText` / `RevealImage`.
- Datos estructurados JSON-LD `Product` con precio, moneda y disponibilidad solo si están confirmados.

### Drawer del carrito
- Diálogo modal lateral derecho: foco atrapado, `Esc` cierra, foco vuelve al botón que lo abrió, scroll del body bloqueado (y Lenis pausado).
- Entrada: panel desliza desde la derecha con `dur.base` + `ease.inOut`; scrim con fade; líneas del carrito con `stagger.items`.
- Estados: vacío (texto del microcopy + CTA a `/camara`), cargando, error, líneas con cantidad (+/−), eliminar con posibilidad de deshacer vía toast.
- Resumen: subtotal, envío, total. CTA "Ir a pagar".

### Checkout
- Sigue el patrón de formularios de `.cursor/rules/arquitectura.mdc`: esquema Zod por paso en `schemas/`, tipos inferidos en `types/`, un hook por formulario en `hooks/` (`useForm` + `zodResolver`, envío y errores), componente visual sin lógica y campos de `src/shared/components/ui/forms/`.
- Validación inline por campo al salir del campo (`mode: "onTouched"`) y al enviar; mensajes asociados con `aria-describedby`; al fallar el envío, el foco va al primer campo con error.
- Si hay Server Action, valida de nuevo en el servidor y devuelve `{ ok: false, error }` para errores esperados.
- En mock: nunca pedir datos reales de tarjeta; muestra campos deshabilitados con aviso "Modo demostración" o un botón "Simular pago".
- Confirmación: página con número de orden simulado, resumen y una instantánea que se revela (reutiliza la lógica de `develop` en versión por tiempo).

## Entregables
1. `docs/08-commerce.md` con decisiones.
2. Feature `src/features/commerce/` con solo las carpetas necesarias: `types/` (interfaz del proveedor y tipos), `lib/` (implementación mock), `hooks/` (`useCart`, `useCheckoutForm`), `schemas/` (checkout), `components/`, y `actions/` si hay Server Actions.
3. Componentes del feature: `VariantPicker`, `AddToCartButton`, `CartDrawer`, `CartLine`, `PriceTag`, `CheckoutForm`, `StickyBuyBar`. Compartidos en `src/shared/components/ui/`: `Toast` e inputs de formulario.
4. Rutas `/camara`, `/checkout`, `/checkout/confirmacion`.

## Checklist de aceptación
- [ ] Flujo completo: elegir color → añadir → drawer → cambiar cantidad → checkout → confirmación, solo con teclado.
- [ ] Ningún precio o política inventados.
- [ ] Carrito persiste al recargar (si se eligió).
- [ ] Estados vacío, error y agotado visibles y probados.
- [ ] Cambiar de proveedor de commerce solo requiere tocar `src/features/commerce/lib/`.
- [ ] Los formularios siguen el patrón esquema → hook → componente visual y pasan `lint` y `typecheck`.

Termina con: **"Commerce listo. Siguiente paso: `/kit-ui-global` (prompt 09)."**
