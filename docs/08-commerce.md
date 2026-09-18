# 08 — Producto, carrito y checkout

Fuente única de verdad para el flujo de compra de Suparoll. Precio, moneda, envío y stock reales siguen el brief; si faltan, la UI muestra `[[PENDIENTE]]` y no inventa cifras.

## Decisiones confirmadas

| Tema | Valor |
|---|---|
| Backend | Mock local: interfaz en `src/features/commerce/types/` e implementación en `src/features/commerce/lib/` |
| Persistencia | `localStorage` clave `suparoll:cart:v1` (try/catch; Safari privado no rompe) |
| Pedido simulado | `sessionStorage` clave `suparoll:last-order:v1` |
| Stock | Se muestra. Variante Blanco comprable. Estado agotado solo con `?debug=agotado` |
| Envío | Línea visible con `[[PENDIENTE: política de envío]]`. El total no suma un costo inventado (`shippingStatus: "pending"`) |
| Selector de color | Radio group: muestra circular + nombre visible |
| Cambio de color | Crossfade de la foto (`dur.base`, `ease.out`) + tinte de fondo al `colorHex` |
| Al añadir | Abre el drawer del carrito (sin toast de “Añadido”) |
| Microinteracción | Flip de miniatura al ícono del carrito + bump del contador. `prefers-reduced-motion`: solo texto “Añadido” |
| Checkout | Página con pasos en acordeón: contacto → envío → pago → revisión |
| Pago | Campos de tarjeta deshabilitados + “Simular pago”. No se piden datos reales de tarjeta |
| Fotos de variante | Solo Blanco. `hero-camera-front` en `colors`; galería PDP: `hero-camera-front`, `hero-camera-back`, `specs-camera-side`. `color-blue` y `color-red` no se usan como variantes |
| JSON-LD | `Product` con nombre y marca. Sin `Offer` ni disponibilidad hasta que el brief confirme precio y moneda |
| Navbar | El trigger mínimo del carrito vive en el layout. La barra completa es el prompt 09 |

## Contrato del proveedor

`src/features/commerce/lib/index.ts` es el único punto que el resto del feature importa. Cambiar a Medusa (u otro) implica reimplementar esas funciones, no los componentes.

| Función | Responsabilidad |
|---|---|
| `getProduct` | Catálogo mock desde `src/content/product.ts` |
| `getCart` | Lee el carrito persistido |
| `addToCart` | Añade o incrementa una línea |
| `updateLine` | Cambia cantidad (0 elimina) |
| `removeLine` | Quita una línea |
| `checkout` | Valida carrito, genera `SR-XXXX`, guarda el pedido simulado y vacía el carrito |

Errores esperados: clase `CommerceError` con mensaje para la UI. Errores inesperados se propagan.

## Flags de debug

El query `debug` es exclusivo (un valor). No se combina con `debug=motion`.

| URL | Efecto |
|---|---|
| `?debug=agotado` | La variante actual se trata como agotada (CTA deshabilitado, copy “Agotado”) |
| `?debug=cart-error` | `addToCart` y `checkout` fallan con el microcopy de error de pago |

## Pendientes (no inventar)

| Dato | Estado |
|---|---|
| Precio y moneda | `[[PENDIENTE: precio de venta]]` — `product.price` / `product.currency` null |
| Política de envío | `[[PENDIENTE: política de envío]]` — línea en carrito y checkout, total = subtotal |
| Garantía | `[[PENDIENTE: garantía]]` |
| Nombre del modelo | `[[PENDIENTE: nombre comercial del modelo]]` |
| Specs / caja / accesorios | Siguen el brief; la PDP oculta relacionados si `accessories` está vacío |
