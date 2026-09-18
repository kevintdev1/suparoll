# 09 — UI global y microinteracciones

Fuente única de verdad para preloader, navbar, cursor, botones, acordeón FAQ, transiciones de página, newsletter y 404.

## Decisiones confirmadas

| Tema | Valor |
|---|---|
| Transición de página | Cortina tinta: panel sube con nombre destino → cambia ruta → sale por arriba |
| Extras | Indicador de progreso de scroll en navbar |
| Preloader | Solo primera visita de sesión (`sessionStorage`); mínimo visible 0.8s |
| Navbar | Ocultar al bajar; visible en escena hero; menú móvil pantalla completa |
| Cursor | Desktop `(hover: hover)`; oculto con reduced motion; nativo en formularios |
| CTA magnético | Solo CTA final (radio 80px, desplazamiento máx. 8px) |
| FAQ acordeón | Un solo ítem abierto a la vez |
| Newsletter | Modo demo — servicio real pendiente (`copy-013` en `pendientes.md`) |

---

## Fórmulas de motion

### Preloader

| Campo | Valor |
|---|---|
| Término | Counter + mask reveal |
| Elemento | Overlay fijo, wordmark centro, contador mono abajo-derecha |
| Activación | Montaje en `/` si `!sessionStorage` preloader visto |
| Evolución | Contador 000→100 ligado a progreso real (fuentes 20%, imágenes hero 30%, frames 50%); mínimo 0.8s; cortina sube con `clip-path` |
| Final | Evento `suparoll:preloader-complete`; marca sesión; dispara intro hero |
| Tokens | `ease.reveal`, `dur.page` |
| Móvil | Igual |
| Reduced | Fade simple sin clip-path largo |

### Navbar hide/show

| Campo | Valor |
|---|---|
| Término | Translate Y |
| Elemento | `<header>` fijo |
| Activación | Scroll hacia abajo (>8px delta) |
| Evolución | `y: -100%` con `ease.out`, `dur.base` |
| Final | Reaparece al subir; **sin ocultar** mientras `#hero` intersecta viewport |
| Móvil | Igual |

### Navbar tema

| Campo | Valor |
|---|---|
| Término | Color swap |
| Elemento | Enlaces y logo |
| Activación | `IntersectionObserver` sobre `[data-theme="dark"]` |
| Evolución | Clases `text-paper` / `text-ink` |
| Final | Legible sobre fondos claros y oscuros |

### Cursor personalizado

| Campo | Valor |
|---|---|
| Término | Follow + scale |
| Elemento | Círculo 12px, `mix-blend-mode: difference` |
| Activación | `mousemove` en desktop |
| Evolución | `gsap.quickTo` 0.35s; crece a 64px con label en `[data-cursor]` |
| Final | Reposo 12px |
| Móvil / reduced | No renderiza |

### Botón text roll

| Campo | Valor |
|---|---|
| Término | Text roll |
| Elemento | Dos `span`, uno `aria-hidden` |
| Activación | Hover / focus-visible |
| Evolución | Texto sube; copia entra desde abajo |
| Tokens | `dur.micro`, `ease.out` |

### Botón magnético

| Campo | Valor |
|---|---|
| Término | Magnetic pull |
| Elemento | CTA primario |
| Activación | Puntero dentro de radio 80px |
| Evolución | Desplazamiento hasta 8px hacia cursor |
| Móvil / reduced | Desactivado |

### Acordeón FAQ

| Campo | Valor |
|---|---|
| Término | Height expand + icon rotate |
| Elemento | `button` + región |
| Activación | Click / Enter / Space |
| Evolución | Grid `0fr → 1fr`; icono + rota 45° |
| Final | Un solo ítem abierto |
| Reduced | Toggle instantáneo |

### Transición cortina

| Campo | Valor |
|---|---|
| Término | Panel cover |
| Elemento | Panel tinta full-screen |
| Activación | Click en enlace interno |
| Evolución | Sube desde abajo con label destino → `router.push` → sale por arriba |
| Final | Foco en `h1`; Lenis al top; ST de página saliente eliminados |
| Tokens | `ease.inOut`, `dur.page` |
| popstate | Cleanup instantáneo + refresh ST |

### 404 reveal

| Campo | Valor |
|---|---|
| Término | Hover reveal |
| Elemento | Marco instantánea gris |
| Activación | `mousemove` sobre marco |
| Evolución | Capa color sube opacidad |
| Reduced | Parcialmente revelado estático |

---

## Mapa de archivos

| Ruta | Rol |
|---|---|
| `src/shared/lib/motion/preloader.ts` | Sesión y eventos preloader |
| `src/shared/lib/motion/preloader-progress.ts` | Progreso real de carga |
| `src/shared/lib/motion/navigation-cleanup.ts` | Kill ST, scroll top, foco |
| `src/shared/lib/motion/scroller.ts` | Instancia Lenis compartida |
| `src/features/landing/scenes/PreloaderScene.tsx` | Escena preloader |
| `src/shared/components/layout/Navbar.tsx` | Navegación global |
| `src/shared/components/layout/CustomCursor.tsx` | Cursor desktop |
| `src/shared/components/layout/PageTransition.tsx` | Cortina entre rutas |
| `src/shared/components/ui/Accordion.tsx` | Acordeón accesible |
| `src/features/newsletter/**` | Formulario demo footer |
| `src/features/landing/scenes/NotFoundReveal.tsx` | 404 interactivo |

---

## Checklist de aceptación

- [ ] Preloader refleja progreso real y no reaparece al navegar internamente
- [ ] Navbar legible sobre fondos claros y oscuros
- [ ] Cursor no aparece en táctil ni interfiere con formularios
- [ ] Transición no rompe atrás/adelante ni deja ScrollTriggers huérfanos
- [ ] Todo operable con teclado con foco visible
