# Transiciones entre secciones

> **Término:** Section transitions (cover, reveal, stacking, footer reveal)  
> **Prompt:** 07  
> **Estado:** En implementación

---

## Mapa de fronteras

| Frontera | Tipo | Capa que se mueve | Capa anclada | Tratamiento de la capa de atrás |
|----------|------|-------------------|--------------|--------------------------------|
| `hero/viewfinder` → `manifesto` | Flujo normal | La tarjeta de paisaje sube con el scroll | — | — |
| `manifesto` → `gallery` | Flujo normal | — | — | — |
| `gallery` → `features` | **Section cover** | `features` sube por encima | `gallery` (últimos 100vh) | `scale: 0.94`, scrim `opacity: 0.45`, `border-radius: 24px` |
| `features` (interna) | **Sticky card stacking** | Cada tarjeta nueva | Tarjetas anteriores | `scale: 1 - 0.04 × capasEncima`, `filter: brightness(0.7)` |
| `features` → `develop` | **Section cover** | `develop` (fondo `ink`) | Última tarjeta | scrim `opacity: 0.6` |
| `develop` (interna) | **Pin + scrub** | Foto instantánea | Sección | Filter reveal (ver ficha abajo) |
| `develop` → `specs` | **Section reveal** | `develop` sube y se va | `specs` estaba fija detrás | — |
| `specs` → `colors` | Flujo normal | — | — | Crossfade de fondo `paper` → `paper-2` al 50% |
| `colors` → `social` | Flujo normal | — | — | — |
| `social` → `faq` | Flujo normal | — | — | — |
| `faq` → `cta-final` | **Section cover** | `cta-final` (fondo `ink`) | `faq` | `scale: 0.96`, scrim `opacity: 0.4` |
| `cta-final` → `footer` | **Footer reveal** | `cta-final` sube y se va | `footer` fijo detrás | Wordmark gigante `yPercent: 30 → 0` |

---

## Tabla de z-index

```
Capa              z-index   Notas
────────────────────────────────────────────────────────────
footer            0         position: fixed; bottom: 0
gallery           1         Se ancla al hacer cover
faq               1         Se ancla al hacer cover
specs             5         Recibe reveal de develop
features          10        Sube sobre gallery
develop           15        Sube sobre features, hace reveal a specs
cta-final         20        Sube sobre faq
main              1         Fondo sólido, tapa footer hasta el final
```

**Regla:** las secciones que "suben" tienen `position: relative`, `z-index` mayor y **fondo sólido** para tapar la capa de atrás.

---

## Ficha: Section cover (`gallery` → `features`)

| Campo | Valor |
|-------|-------|
| **Término** | Section cover |
| **Elemento** | `section#gallery` (capa de atrás), `section#features` (capa que sube) |
| **Activación** | `start: "bottom bottom"` — cuando el borde inferior de gallery toca el bottom del viewport |
| **Evolución** | Gallery: `scale: 1 → 0.94`, `border-radius: 0 → 24px`, scrim `opacity: 0 → 0.45` |
| **Final** | Gallery queda detrás con tratamiento; features cubre completamente |
| **Duración** | `end: "+=100%"` (1 viewport de scroll) |
| **Móvil** | Cover sin pin (gallery no se ancla, solo se atenúa con IntersectionObserver o scroll-triggered) |
| **Reduced motion** | Flujo normal sin escala ni scrim |

### Implementación

```typescript
// Pin de gallery con pinSpacing: false
scrollTrigger: {
  trigger: galleryEl,
  start: "bottom bottom",
  end: "+=100%",
  pin: true,
  pinSpacing: false,
  scrub: 1,
  anticipatePin: 1,
  invalidateOnRefresh: true,
}

// Timeline de tratamiento (hijos, no el trigger)
tl.to('[data-anim="gallery-inner"]', { scale: 0.94, borderRadius: 24 })
  .to('[data-anim="gallery-scrim"]', { opacity: 0.45 }, 0);
```

---

## Ficha: Sticky card stacking (`features` interna)

| Campo | Valor |
|-------|-------|
| **Término** | Sticky card stacking |
| **Elemento** | `article.feature-card` × 3 dentro de contenedor `.features-track` |
| **Activación** | Cada tarjeta se ancla cuando su top llega a `80px + (índice × 48px)` |
| **Evolución** | Tarjetas anteriores: `scale: 1 - 0.04 × capasEncima`, `filter: brightness(0.7)` |
| **Final** | Al anclarse la última, se mantiene 50vh y se libera todo el grupo |
| **Móvil** | Tarjetas en flujo normal con leve `scale: 0.95 → 1` al entrar (scroll-triggered) |
| **Reduced motion** | Flujo normal sin escala |

### Estructura HTML

```html
<section id="features" class="relative z-10 bg-paper">
  <div data-anim="features-track" class="relative">
    <article data-anim="feature-card" data-index="0" class="sticky top-20">
      <!-- número, título, body, imagen -->
    </article>
    <article data-anim="feature-card" data-index="1" class="sticky top-[128px]">
      <!-- 80px + 48px -->
    </article>
    <article data-anim="feature-card" data-index="2" class="sticky top-[176px]">
      <!-- 80px + 96px -->
    </article>
  </div>
</section>
```

### Offset visible

Las tarjetas de atrás asoman 48px (su header) para indicar profundidad de pila.

---

## Ficha: Develop reveal (`develop` interna)

| Campo | Valor |
|-------|-------|
| **Término** | Pin + scrub de revelado |
| **Elemento** | Foto instantánea con marco blanco dentro de `section#develop` |
| **Activación** | `start: "top top"` |
| **Evolución** | Ver fases abajo |
| **Duración** | `end: "+=200%"` (2 viewports de scroll) |
| **Móvil** | Igual con `end: "+=150%"` |
| **Reduced motion** | Foto ya revelada con fade simple |

### Fases del timeline

| Progreso | Acción |
|----------|--------|
| 0 → 0.25 | Instantánea entra desde `yPercent: 60`, `rotation: -6 → 0` (como expulsada por la cámara) |
| 0.25 → 0.85 | Revelado: `filter: saturate(0) brightness(1.8) contrast(0.6)` → valores normales **o** capa blanca `opacity: 1 → 0` |
| 0.85 → 1.0 | Texto aparece por líneas (RevealText) |

### Nota de rendimiento

Animar `filter` en una imagen grande puede ser costoso. Implementación preferida:
- Dos capas: foto a color (debajo) + capa blanca/gris con `mix-blend-mode: normal` y `opacity` (encima)
- Animar solo `opacity` de la capa superior

Usar `filter` solo si el rendimiento en móvil es aceptable tras pruebas.

### Contador (opcional)

Si hay dato de tiempo de revelado: mostrar contador mono `00:00 → 00:15` sincronizado con el progreso.

---

## Ficha: Section reveal (`develop` → `specs`)

| Campo | Valor |
|-------|-------|
| **Término** | Section reveal / uncover |
| **Elemento** | `section#develop` (se retira), `section#specs` (estaba fija detrás) |
| **Activación** | `start: "bottom bottom"` de develop |
| **Evolución** | Develop: `yPercent: 0 → -100` |
| **Final** | Specs queda visible |
| **Duración** | `end: "+=100%"` |
| **Móvil** | Igual |
| **Reduced motion** | Flujo normal |

### Implementación

```typescript
// specs debe tener position: sticky o z-index bajo para estar "detrás"
// develop tiene z-15 y se retira hacia arriba

scrollTrigger: {
  trigger: developEl,
  start: "bottom bottom",
  end: "+=100%",
  scrub: 1,
  pin: true,
  pinSpacing: false,
}

tl.to(developEl, { yPercent: -100 });
```

---

## Ficha: Section cover (`faq` → `cta-final`)

| Campo | Valor |
|-------|-------|
| **Término** | Section cover |
| **Elemento** | `section#faq` (atrás), `section#cta-final` (sube) |
| **Activación** | `start: "bottom bottom"` de faq |
| **Evolución** | Faq: `scale: 1 → 0.96`, scrim `opacity: 0 → 0.4` |
| **Final** | cta-final cubre completamente |
| **Duración** | `end: "+=100%"` |
| **Móvil** | Cover sin pin |
| **Reduced motion** | Flujo normal |

---

## Ficha: Footer reveal (`cta-final` → `footer`)

| Campo | Valor |
|-------|-------|
| **Término** | Footer reveal |
| **Elemento** | `section#cta-final` (se retira), `footer` (fijo detrás) |
| **Activación** | `start: "bottom bottom"` de cta-final |
| **Evolución** | cta-final: `yPercent: 0 → -30`; wordmark del footer: `yPercent: 30 → 0` |
| **Final** | Footer completamente visible |
| **Duración** | `end: "+=100%"` |
| **Móvil** | Desactivar si altura de footer > 90% del viewport |
| **Reduced motion** | Flujo normal |

### Estructura CSS

```css
footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 0;
}

main {
  position: relative;
  z-index: 1;
  background: var(--color-paper);
  margin-bottom: var(--footer-height); /* medido con ResizeObserver */
}
```

---

## Requisitos técnicos

### Contextos de apilamiento

- `transform`, `filter` y `opacity < 1` crean contextos de apilamiento nuevos
- Verificar que el scrim y la escala no hagan que la sección de atrás se pinte por encima de la nueva
- Los scrims son `<div>` con `pointer-events: none`, no `box-shadow`

### Orden de creación

1. Crear ScrollTriggers en orden visual (top → bottom)
2. `ScrollTrigger.refresh()` **una vez** después de cargar imágenes
3. Usar `refreshPriority` si se montan async (número menor = refresca primero)

### Accesibilidad

- Secciones cubiertas con `inert` mientras están tapadas
- El foco del teclado nunca debe quedar en una sección cubierta
- Verificar navegación con Tab manualmente

### gsap.matchMedia

```typescript
gsap.matchMedia().add({
  "(min-width: 1024px)": () => {
    // Desktop: todas las transiciones con pin
  },
  "(max-width: 1023px)": () => {
    // Móvil: cover sin pin + footer reveal
  },
  "(prefers-reduced-motion: reduce)": () => {
    // Flujo normal sin animaciones
  },
});
```

---

## Checklist de aceptación

- [ ] En cada frontera se entiende qué capa se mueve y cuál queda atrás
- [ ] Ningún elemento anclado tapa CTAs o texto de la sección nueva
- [ ] Sin saltos al entrar/salir de pins; la barra de scroll no "brinca"
- [ ] El foco del teclado nunca queda en una sección cubierta
- [ ] Móvil y reduced motion probados
- [ ] Recorrido completo de arriba abajo y de abajo arriba validado
