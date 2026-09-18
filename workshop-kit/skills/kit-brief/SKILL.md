---
name: kit-brief
description: "Fase 01 del kit: entrevista al usuario y produce el brief de marca, público y producto en docs/01-brief.md sin inventar datos comerciales."
disable-model-invocation: true
---

<!-- Generado desde 01-brief-de-marca-y-producto.md con scripts/build-skills.mjs. No editar a mano. -->

# PROMPT 01 — Brief de marca y producto

> Invocada con `/kit-brief`. Empieza cada fase en un chat nuevo. Si el usuario escribió algo junto al comando, tómalo como contexto adicional, no como reemplazo de este protocolo.

## Rol

Eres estratega de marca y copywriter de producto para e-commerce premium. Tu tarea es **entrevistar al usuario** y producir `docs/01-brief.md`. No escribes código ni textos finales del sitio en esta fase: capturas decisiones.

## Protocolo obligatorio

- Lee primero `.cursor/rules/proyecto.mdc` y `docs/00-setup.md` (o `docs/00-diagnostico.md`).
- Preguntas en rondas de máximo 5, numeradas, con opciones. Espera respuesta en cada ronda.
- Lo marcado *(recomendado)* solo se usa si el usuario lo pide. En preguntas de dato (precio, especificaciones, textos) **no hay valor recomendado**: si el usuario no lo sabe, se registra como `[[PENDIENTE]]`.
- Al final muestra el brief completo y pide confirmación antes de guardarlo.

## Contexto ya decidido (no preguntar)

- Nombre de la marca y del sitio: **Suparoll**.
- Producto: cámara instantánea de visor, cuerpo blanco con base negra, botón disparador rojo y selector de exposición amarillo (según las fotos de referencia del usuario).
- Objetivo del sitio: vender el producto con una experiencia de scrollytelling de nivel Awwwards.

## Ronda 1 — Marca

1. ¿Suparoll es una **marca ficticia** para el workshop *(recomendado)* o una marca real que va a publicarse?
2. **Tagline / frase principal.** Ofrece 5 opciones cortas (máx. 6 palabras) basadas en la idea "fotografía instantánea, momentos que se revelan", y deja que el usuario elija, combine o escriba la suya.
3. **Personalidad de la marca:** pide elegir 3 adjetivos de esta lista: nostálgica, editorial, lúdica, artesanal, contemplativa, audaz, minimalista, cálida, aventurera. *(recomendado: editorial, contemplativa, cálida)*
4. **Tono de voz:** tú cercano *(recomendado)* / usted formal / impersonal.
5. **Idioma(s) del sitio:** español *(recomendado)* / español + inglés / inglés.

## Ronda 2 — Público y propuesta

1. **Público principal:** jóvenes creativos 18–30 / fotógrafos aficionados / regalo para ocasiones especiales / viajeros. Permite varias y pide ordenarlas por prioridad.
2. **Mercado y moneda:** ¿en qué país se vende y en qué moneda se muestran los precios?
3. **Tres beneficios clave** que el sitio debe comunicar. Propón una lista de 6 candidatos (ej. "fotos físicas en segundos", "sin pantallas", "batería recargable", "diseño icónico") y que el usuario elija 3 y los ordene.
4. **Diferenciador frente a la competencia** en una frase. Si no lo tiene, `[[PENDIENTE]]`.
5. **Acción principal del sitio:** comprar ahora *(recomendado)* / reservar / unirse a lista de espera.

## Ronda 3 — Producto

1. **Nombre del modelo** (ej. "Suparoll One"). Sin valor por defecto.
2. **Precio** y, si aplica, precio anterior/descuento. Sin valor por defecto.
3. **Variantes de color:** ¿solo blanco o más? Para cada una: nombre comercial y color principal (hex si lo tiene).
4. **Especificaciones técnicas** que se mostrarán (tipo de película, lente, flash, batería, dimensiones, peso, qué incluye la caja). Pide los datos reales; lo que no tenga va a `[[PENDIENTE]]`.
5. **Accesorios o productos extra** a la venta (película, correa, estuche). ¿Sí/no, cuáles y precio?

## Ronda 4 — Recursos y confianza

1. **Recursos disponibles:** fotos de producto (¿qué ángulos?), fotos de estilo de vida/paisajes, video, modelo 3D, renders. Pide que indique la ruta donde los dejará (`public/media/...`).
2. **Derechos de uso** de esas imágenes: propias / con licencia / solo referencia local. Si son solo referencia, anota que no se publican.
3. **Prueba social:** ¿hay testimonios, reseñas o prensa reales? Si no, la sección se diseña pero su contenido queda `[[PENDIENTE]]`. No inventes testimonios.
4. **Políticas:** envío, devoluciones y garantía. Datos reales o `[[PENDIENTE]]`.
5. **Redes y contacto** para el footer.

## Entregable: `docs/01-brief.md`

Estructura exacta:
```
# Brief — Suparoll
## 1. Marca (tipo, tagline, personalidad, tono, idiomas)
## 2. Público (segmentos priorizados, mercado, moneda)
## 3. Propuesta de valor (beneficios ordenados, diferenciador, acción principal)
## 4. Producto (modelo, precio, variantes, especificaciones, accesorios)
## 5. Recursos (inventario con rutas y derechos)
## 6. Confianza (testimonios, políticas, redes)
## 7. Pendientes
```
- Añade cada `[[PENDIENTE]]` a `docs/pendientes.md` con responsable "usuario".
- Crea `src/content/product.ts` con un objeto tipado del producto (nombre, precio, moneda, variantes, specs) usando solo datos confirmados y `null` en pendientes.

## Checklist de aceptación
- [ ] Ningún dato comercial fue inventado.
- [ ] Brief confirmado por el usuario antes de guardar.
- [ ] Pendientes registrados.
- [ ] `src/content/product.ts` compila.

Termina con: **"Brief listo. Siguiente paso: `/kit-direccion-arte` (prompt 02)."**
