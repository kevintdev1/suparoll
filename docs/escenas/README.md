# Fichas de escenas

Cada escena animada de la Home tiene (o tendrá) su ficha en esta carpeta: `docs/escenas/<id>.md`.

## Fórmula obligatoria

Antes de implementar cualquier escena, documentar con estas seis piezas:

**término + elemento + activación + evolución + final + adaptación**

Ejemplo (`manifesto`):

| Pieza | Valor |
|---|---|
| Término | Text reveal por líneas |
| Elemento | Párrafo del manifiesto |
| Activación | Top de la sección al 75% del viewport |
| Evolución | Líneas suben desde máscara con `stagger.lines`; palabra clave a color acento |
| Final | Texto estático legible |
| Adaptación | Móvil: igual; reduced: visible sin animación |

## Convenciones

- Tokens, eases y duraciones: [`docs/04-motion.md`](../04-motion.md)
- IDs de sección: [`docs/03-arquitectura.md`](../03-arquitectura.md)
- Implementación: Client Components en `src/features/landing/scenes/`, importando GSAP solo desde `@/shared/lib/motion/gsap`

## Escenas pendientes

| ID | Prompt | Ficha |
|---|---|---|
| `hero` + `viewfinder` | 05 | [`hero.md`](hero.md) |
| `preloader` | 09 | Pendiente |
| `gallery` | 06 | Pendiente |
| `features`, `develop`, `specs`, `cta-final`, `footer` | 07 | Pendiente |
| `colors` | 08 | Pendiente |
