# PROMPT 09 — UI global: preloader, navbar, cursor, botones y transiciones de página

> Chat nuevo en Cursor (modo Agent).

---

## Rol

Eres creative developer enfocado en detalles de interacción. Construyes las piezas globales que dan el acabado "premiado": carga, navegación, cursor, estados de botones y enlaces, acordeón de FAQ y transiciones entre rutas.

## Protocolo obligatorio

- Lee `.cursor/rules/proyecto.mdc`, `docs/02`, `docs/03`, `docs/04`. Consulta GSAP Skills.
- Presenta cada componente con su especificación propuesta, pregunta y espera aprobación antes de implementarlo.
- Cada microinteracción se define con la fórmula del workshop y tiene variante táctil y reduced motion.

## 1. Preloader
Propuesta: fondo papel; wordmark pequeño en el centro; contador mono 000 → 100 abajo a la derecha ligado al **progreso real** (fuentes + imagen del hero o frames de la secuencia); al llegar a 100, cortina sube con clip-path (`ease.reveal`, `dur.page`) y dispara la intro del hero.
Preguntas: ¿mostrar preloader solo en la primera visita de la sesión *(recomendado)* o siempre? ¿Tiempo mínimo visible? *(recomendado: 0.8s para evitar parpadeo)*.

## 2. Navbar
Propuesta: barra transparente con labels mono como la referencia (logo a la izquierda, enlaces y carrito a la derecha); se oculta al hacer scroll hacia abajo y reaparece al subir; cambia color de texto automáticamente sobre secciones oscuras (cada sección declara `data-theme="dark|light"`); en móvil, menú a pantalla completa con enlaces grandes en display que suben por líneas.
Preguntas: ¿ocultar al bajar? *(recomendado: sí, excepto durante la escena hero, donde queda visible)*. ¿Menú móvil a pantalla completa o drawer?

## 3. Cursor personalizado
Propuesta: círculo de 12px tinta con `mix-blend-mode: difference` que sigue al puntero con `gsap.quickTo` (0.35s); crece a 64px con texto "Ver" sobre fotos de la galería y "Arrastra"/"Desliza" donde aplique; se oculta en dispositivos táctiles (`(hover: none)`) y con reduced motion; el cursor nativo **nunca** se oculta en campos de formulario ni en el checkout.
Pregunta: ¿incluir cursor personalizado? *(recomendado: sí, solo desktop)*.

## 4. Botones y enlaces
Especificación ya aprobada en `docs/02` (bloque G). Añade:
- **Text roll** en botones: el texto sube y es reemplazado por su copia desde abajo (dos `span`, uno `aria-hidden`).
- **Magnético** opcional en el CTA principal: se desplaza hasta 8px hacia el puntero dentro de un radio de 80px. Pregunta si se incluye *(recomendado: solo en CTA del hero y del cierre)*.
- Estado pressed: escala 0.97 durante `dur.micro`.
- Estados disabled y loading definidos (spinner mono o puntos).

## 5. Acordeón de FAQ
Acordeón accesible (`button` con `aria-expanded` que controla una región); altura animada con GSAP midiendo el contenido (o `height: auto` con la técnica de grid `0fr → 1fr`); icono + que rota a ×; solo uno abierto a la vez *(recomendado)* o varios.

## 6. Transiciones entre páginas
Opciones a presentar:
- **Cortina:** al hacer clic en un enlace interno, un panel tinta cubre la pantalla desde abajo con el nombre de la página destino, cambia la ruta y el panel sale por arriba *(recomendado)*.
- **View Transitions API** del navegador con crossfade y el título como elemento compartido (menor soporte en algunos navegadores; fallback sin animación).
- Ninguna.
Requisitos: no romper el botón atrás ni la restauración de scroll; matar todos los ScrollTriggers de la página saliente y refrescar en la entrante; reiniciar Lenis al top; mover el foco al `h1` de la nueva página.

## 7. Newsletter del footer (si se aprobó en el prompt 03)
Formulario de un campo siguiendo el patrón de `.cursor/rules/arquitectura.mdc` (feature `newsletter`: esquema, hook, componente visual, Server Action como pasarela). Pregunta al usuario el servicio real de envío; si no hay, la acción devuelve un resultado simulado claramente marcado como demostración y se registra en `docs/pendientes.md`. Estados: enviando, éxito (el botón hace text roll a "¡Listo!") y error inline.

## 8. Página 404
Instantánea "sin revelar" (marco blanco con interior gris) que se revela ligeramente al mover el puntero; texto del microcopy aprobado y CTA a inicio.

## 9. Otros detalles a proponer (pregunta cuáles se incluyen)
- Indicador de progreso de scroll global en la navbar.
- Hora local / ubicación en label mono del footer.
- Botón "volver arriba" con scroll suave de Lenis.
- Marquee de texto (cinta infinita) con beneficios entre `specs` y `colors`, que acelera según la velocidad del scroll.
- Sonido de disparador al añadir al carrito (desactivado por defecto, con toggle visible).

## Entregables
- `docs/09-ui-global.md` con decisiones.
- Componentes en `src/shared/components/layout/` y `src/shared/components/ui/`.
- Todo integrado en `layout.tsx` y probado en las rutas existentes.

## Checklist de aceptación
- [ ] Preloader refleja progreso real y no aparece de nuevo al navegar internamente.
- [ ] Navbar legible sobre fondos claros y oscuros.
- [ ] Cursor no aparece en táctil ni interfiere con formularios.
- [ ] Transición de página no rompe atrás/adelante ni deja ScrollTriggers huérfanos (verificar `ScrollTrigger.getAll().length` antes y después).
- [ ] Todo operable con teclado y con foco visible.

Termina con: **"UI global lista. Siguiente paso: `/kit-calidad` (prompt 10)."**
