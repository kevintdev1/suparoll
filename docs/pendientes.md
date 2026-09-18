# Pendientes

Registro de contenido, assets y decisiones pendientes del proyecto.

## Brief — datos comerciales

| ID | Descripción | Responsable |
|---|---|---|
| brief-001 | País de venta | usuario |
| brief-002 | Moneda de precios | usuario |
| brief-003 | Diferenciador frente a la competencia | usuario |
| brief-004 | Nombre comercial del modelo | usuario |
| brief-005 | Precio de venta | usuario |
| brief-006 | Precio anterior / descuento | usuario |
| brief-007 | Especificaciones técnicas (película, lente, flash, batería, dimensiones, peso, contenido de caja) | usuario |
| brief-008 | Accesorios a la venta (película, correa, estuche) | usuario |
| brief-009 | Derechos de uso de imágenes | usuario |
| brief-010 | Testimonios, reseñas o prensa | usuario |
| brief-011 | Política de envío | usuario |
| brief-012 | Política de devoluciones | usuario |
| brief-013 | Garantía | usuario |
| brief-014 | Redes sociales para footer | usuario |
| brief-015 | Contacto (email / teléfono) | usuario |
| brief-016 | Video de producto (ruta) | usuario |
| brief-017 | Modelo 3D / renders | usuario |

## Assets — fotografía

| ID | Descripción | Formato | Tamaño mínimo | Responsable |
|---|---|---|---|---|
| asset-001 | Fotos de producto (múltiples ángulos) | JPG/WebP | 2400px lado largo | usuario |
| asset-002 | Fotos estilo de vida / paisajes para galería | JPG/WebP, ratio 4:5 | 2400px lado largo | usuario |
| asset-003 | Imagen hero paisaje desktop | JPG/WebP, ratio 16:9 | 2400px lado largo | usuario |
| asset-004 | Imagen hero paisaje móvil | JPG/WebP, ratio 9:16 | 2400px lado largo | usuario |

## Assets — capa de registro

| ID | Descripción | Responsable |
|---|---|---|
| asset-014 | Confirmar los `alt` propuestos de `hero-landscape` y `hero-landscape-mobile` en `src/content/assets.json` | usuario |
| asset-015 | Decidir por grupo si los 23 slots en `revisar` se recortan con `process-images.mjs --crop` o se reemplazan (ratios reales no coinciden con los declarados) | usuario |
| asset-016 | Faltan 4 fotos de galería: hay 16 y `homeContent.gallery.photoCount` declara 20 | usuario |
| asset-017 | Implementar `?debug=assets` (etiqueta con `id` y estado sobre placeholders y slots en `revisar`) | agente |
| asset-018 | Re-extraer `frames-zoom` desde `assets-inbox/hero-zoom.mp4` si se quiere un acercamiento filmado que encadene con el final del giro | usuario |

## Motion — escena hero

| ID | Descripción | Responsable |
|---|---|---|
| motion-001 | El acercamiento de F2 amplía los frames de 1920×1080 unas 3×, así que el ocular se ve blando. Si se quiere más nitidez, re-extraer el giro a mayor resolución desde `assets-inbox/hero-turntable.mp4` (o solo los últimos frames, que son los que se amplían) | usuario |
| motion-002 | El fondo de la escena (`#e7e4da`, muestreado del video) no coincide con `--color-paper` (`#F3F1EC`): al liberarse el pin se nota una franja entre la escena y `manifesto`. Decidir si se iguala el fondo del video o se acepta como cambio de banda | usuario |

## Arquitectura — copy por sección

| ID | Sección | Campo pendiente | Responsable |
|---|---|---|---|
| copy-001 | `hero` | Nombre comercial del modelo (label mono) | usuario |
| copy-002 | `develop` | Tiempo de revelado en segundos | usuario |
| copy-003 | `specs` | Especificaciones técnicas completas | usuario |
| copy-004 | `colors`, `cta-final` | Precio de venta y moneda | usuario |
| copy-005 | `cta-final`, PDP | Label envío y garantía | usuario |
| copy-006 | `social` | Testimonios / reseñas (ocultar si vacío) | usuario |
| copy-007 | FAQ | Respuestas de película, revelado, envío, devoluciones, garantía, batería | usuario |
| copy-008 | Footer | Redes sociales | usuario |
| copy-009 | `/soporte` | Contacto (email / teléfono) | usuario |
| copy-010 | Legales | Política de privacidad y términos | usuario |
| copy-011 | PDP | Contenido de la caja | usuario |
| copy-012 | PDP | Accesorios relacionados | usuario |
| copy-013 | Newsletter | Servicio real de envío (actualmente demo) | usuario |

## Arquitectura — assets por sección

| ID | Sección | Descripción | Formato | Tamaño mínimo | Responsable |
|---|---|---|---|---|---|
| asset-005 | `hero` | Cámara frontal (secuencia o render) | JPG/WebP o frames | 2400px lado largo | usuario |
| asset-006 | `viewfinder` | Paisaje hero desktop | JPG/WebP, 16:9 | 2400px lado largo | usuario |
| asset-007 | `viewfinder` | Paisaje hero móvil | JPG/WebP, 9:16 | 2400px lado largo | usuario |
| asset-008 | `gallery` | 16–24 fotos estilo de vida | JPG/WebP, 4:5 | 2400px lado largo | usuario |
| asset-009 | `features` | Detalle cámara por tarjeta (×3) | JPG/WebP | 1200px lado largo | usuario |
| asset-010 | `develop` | Instantánea para animación revelado | JPG/WebP, marco 4:5 | 1600px lado largo | usuario |
| asset-011 | `specs` | Cámara de perfil | JPG/WebP | 2400px lado largo | usuario |
| asset-012 | `colors` | Foto producto por variante | JPG/WebP | 2400px lado largo | usuario |
| asset-013 | PDP | Galería producto (múltiples ángulos) | JPG/WebP | 2400px lado largo | usuario |
