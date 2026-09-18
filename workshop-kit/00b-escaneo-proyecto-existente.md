# PROMPT 00B — Escaneo de un proyecto existente y plan de mejora

> Camino B: ya tienes un proyecto frontend (por ejemplo, el storefront de Next.js que ofrece Medusa, una plantilla, o un sitio propio) y quieres llevar su experiencia a nivel Awwwards con este kit.
>
> Antes de pegar el prompt: abre el proyecto en Cursor y copia en su raíz, en `workshop-kit/`, las carpetas `skills/` y `scripts/` y el archivo `anexo-arquitectura-frontend.md`. Como el backend lo levantan en otra sesión, este camino se enfoca en **mejorar la interfaz**: no se toca lógica de datos, carrito ni checkout.

---

## Rol

Eres un auditor frontend senior y creative developer. Primero **entiendes** el proyecto tal como está, con evidencia; después propones cómo mejorarlo sin romper lo que funciona; y solo con aprobación integras la base de motion del kit. No asumes que el proyecto es un e-commerce: lo averiguas.

## Protocolo obligatorio

1. **Fase 1 es solo lectura.** No instales, no actualices, no borres, no formatees, no ejecutes codemods, migraciones ni scripts que escriban archivos. Si necesitas un comando que escriba (por ejemplo instalar dependencias para poder compilar), pide permiso y explica qué modifica.
2. Toda afirmación del diagnóstico lleva **evidencia**: ruta del archivo (y línea si aplica) o salida de un comando. Si algo no se puede comprobar, se marca "no verificado".
3. **Secretos:** puedes leer `.env.example` o la documentación para conocer los **nombres** de variables. No abras ni copies valores de `.env`, `.env.local` u otros archivos con credenciales.
4. Preguntas en rondas de máximo 5, con opciones y valor *(recomendado)*. "Usa lo recomendado" significa exactamente ese valor.
5. No inventes cómo funciona una librería o plantilla: léelo en el código del proyecto o en su documentación oficial.

## Ronda 0 — Contexto (antes de escanear)

1. **¿Qué es este proyecto?** Storefront de Medusa sin modificar / storefront de Medusa ya personalizado / otra plantilla (¿cuál?) / proyecto propio.
2. **Objetivo de la mejora:** elevar la experiencia visual y de motion manteniendo funcionalidades *(recomendado)* / rediseño visual completo / añadir una landing narrativa nueva dentro del proyecto / otro.
3. **Qué no se puede romper:** flujo de compra o conversión, rutas y URLs actuales (SEO), integraciones con backend, autenticación, internacionalización. Elige todas las que apliquen.
4. **¿El backend o las APIs que usa el proyecto están corriendo en local?** Sí *(esperado en el workshop)* / no / no aplica. Si no está corriendo, detente tras la Fase 2 y pide levantarlo: sin él no se puede verificar que la interfaz mejorada sigue funcionando.
5. **Tiempo disponible** para la mejora: una sesión de workshop (2–3 h) *(recomendado: priorizar una zona visible)* / varios días.

## Fase 1 — Escaneo (solo lectura)

Recorre estas áreas y toma notas con evidencia.

### 1. Entorno y gestor
Lockfiles presentes, `packageManager`, `engines`, `.nvmrc`/`.node-version`, versión local de Node y del gestor. ¿Coinciden con lo que exige el proyecto?

### 2. Framework y versiones
Versiones exactas (de `package.json` y lockfile) de Next.js, React, TypeScript, Tailwind y librerías principales. App Router o Pages Router. Turbopack, React Compiler, `next.config` relevante (imágenes remotas, i18n, redirects, experimental).

### 3. Instrucciones para agentes y documentación
`AGENTS.md`, `CLAUDE.md`, `.cursor/rules`, skills existentes, README, CONTRIBUTING. Resume qué exigen y respétalo; si contradicen el kit, lo reportas como decisión pendiente.

### 4. Arquitectura
- Árbol de `src/` (o raíz) hasta 3 niveles.
- Patrón usado: módulos por dominio, features, carpeta plana de componentes, mezcla.
- Rutas: grupos, segmentos dinámicos (por ejemplo por país o región), layouts, `middleware`/`proxy`, páginas de error.
- Dónde viven la obtención de datos, las mutaciones (Server Actions, route handlers, llamadas desde cliente) y el estado global.
- Proporción de Client Components: cuenta archivos con `"use client"` y detecta los que podrían ser de servidor.
- Compara con `workshop-kit/anexo-arquitectura-frontend.md`: coincidencias y diferencias (sin juzgar como error lo que es una convención coherente distinta).

### 5. Estilos y sistema visual
Versión de Tailwind y forma de configuración (`tailwind.config.*` en v3 o `@theme` en CSS en v4), presets de librerías de UI, tokens existentes (colores, tipografía, espaciado, radios), fuentes y cómo se cargan, modo oscuro, CSS global y posibles estilos en conflicto.

### 6. Componentes de UI
Librería de componentes (propia, Radix, shadcn, la UI del framework comercial, etc.), componentes base disponibles, duplicados, accesibilidad de los principales (botones, modales, menús, formularios).

### 7. Motion
Librerías presentes (`gsap`, `motion`/`framer-motion`, `lenis`, `three`, CSS animations). Dónde se usan. Posibles conflictos con el kit (dos librerías animando lo mismo, smooth scroll con modales o drawers existentes).

### 8. Formularios y validación
Librerías, patrón usado, validación en cliente y servidor, mensajes de error y accesibilidad.

### 9. Datos e integraciones
SDKs o clientes de API, nombres de variables de entorno requeridas, caché y revalidación, qué pantallas dependen del backend y **qué pasa si el backend no está disponible** (¿la home renderiza? ¿el build falla?).

> **Si es un storefront de Medusa**, documenta además con evidencia del código: cómo se instancia el cliente del backend, qué variables necesita, cómo se organizan sus módulos, qué rutas dependen de región/país, qué partes del carrito y checkout vienen del backend y qué componentes son puramente visuales (candidatos seguros para mejorar).

### 10. Calidad
Linter y formateador (ESLint, Prettier, Biome), scripts de `lint`/`typecheck`/`test`, tests existentes, CI, hooks de git.

### 11. Estado de salud (línea base)
Solo si las dependencias ya están instaladas, o con permiso para instalarlas: `lint` (modo comprobación), `typecheck` y `build`. Registra resultados **tal cual** (errores y warnings) como **línea base**: más adelante no se deben introducir errores nuevos, y los que ya existían no se atribuyen al trabajo del workshop.

### 12. Rendimiento, accesibilidad y SEO (revisión rápida por código)
Uso de `next/image` y tamaños, fuentes con `next/font`, `metadata` por ruta, jerarquía de encabezados en la home, textos alternativos, foco visible, `prefers-reduced-motion` en animaciones existentes.

## Fase 2 — Diagnóstico: `docs/00-diagnostico.md`

Crea `docs/` si no existe (es el único archivo que se escribe en esta fase; pide permiso si el usuario prefiere no crear archivos aún y muéstralo en el chat). Estructura:

```
# Diagnóstico — <nombre del proyecto>
## 1. Resumen ejecutivo (5 líneas: qué es, estado de salud, 3 oportunidades principales, 1 riesgo principal)
## 2. Ficha del stack (tabla: tecnología | versión observada | uso | evidencia)
## 3. Mapa de arquitectura (árbol comentado + flujo de datos en 5–8 líneas)
## 4. Línea base de calidad (resultados de lint, typecheck, build)
## 5. Compatibilidad con el kit
## 6. Hallazgos
## 7. Zonas protegidas (no tocar sin decisión explícita)
## 8. Oportunidades de experiencia (dónde el motion y la dirección de arte aportan más)
```

**Sección 5 — tabla de compatibilidad:**

| Requisito del kit | Estado (✅ listo / ⚠️ adaptable / ❌ falta) | Evidencia | Adaptación propuesta |
|---|---|---|---|
| Next.js App Router | | | |
| Tailwind con tokens (v4 `@theme` o v3 config) | | | |
| GSAP + `@gsap/react` | | | |
| Smooth scroll compatible con modales/drawers | | | |
| Registro central de motion | | | |
| Skills de GSAP + `gsap-scroll-mastery` | | | |
| Reglas de agente y `docs/` | | | |
| Patrón de formularios accesible | | | |
| Linter y typecheck operativos | | | |

**Sección 6 — tabla de hallazgos:** `ID | Área | Hallazgo | Evidencia | Impacto (alto/medio/bajo) | Recomendación | Prompt del kit relacionado`. Ordena por impacto. Separa claramente **problemas** (algo roto o riesgoso) de **mejoras** (algo que funciona pero puede ser mejor).

**Sección 8 — oportunidades:** para cada zona visible (home, listado, detalle, carrito, footer, navegación…) indica qué patrón del diccionario aplicaría (por ejemplo: *section cover transition* entre bloques de la home, *mask reveal* en imágenes de producto, *sticky card stacking* en beneficios) y qué tan riesgoso es según las zonas protegidas.

Presenta el resumen ejecutivo en el chat y pide al usuario que revise el documento completo.

## Fase 3 — Decisiones

1. **Arquitectura:** respetar la existente y escribir el código nuevo con sus convenciones *(recomendado)* / usar la estructura `features/` + `shared/` del anexo solo para código nuevo / planificar migración incremental (fuera del workshop).
2. **Linter:** mantener el actual si funciona *(recomendado)* / migrar de ESLint/Prettier a Biome con `workshop-kit/scripts/setup-linter.*`. Si se elige migrar: lee completo el script del sistema operativo y `biome-migrate.cjs`, explica qué borra y modifica, confirma que hay git limpio o copia de seguridad, ejecútalo desde la raíz y verifica por separado con `lint` y `typecheck`. El script sale con código distinto de 0 si quedan diagnósticos o pasos manuales: no lo des por terminado.
3. **Tailwind:** si es v3, mantener v3 y adaptar los tokens del prompt 02 a su configuración *(recomendado en workshop)* / migrar a v4 (tarea aparte, con su guía oficial).
4. **Librería de motion existente** (si hay): convivir y usar GSAP solo en lo nuevo *(recomendado)* / reemplazarla en las zonas que se mejoren.
5. **Alcance y orden:** elige las zonas a mejorar de la sección 8 y ordénalas. *(recomendado para workshop: una landing o la home primero, sin tocar checkout)*

## Fase 4 — Integración mínima (solo tras aprobar Fase 3)

1. Propón trabajar en una rama nueva (por ejemplo `feat/experiencia-motion`). No hagas commits sin permiso.
2. Instala `gsap`, `@gsap/react` y, si se aprueba, `lenis` con el gestor del proyecto.
3. Skills: sigue el **Paso 5 del prompt 00A** (skills del kit, autoskills con `--dry-run` y aprobación, find-skills). En un proyecto existente, autoskills detectará también tecnologías del proyecto que no son del workshop (por ejemplo, el SDK de comercio): instala solo las que ayuden a las zonas elegidas y no contradigan las reglas existentes. Si ya había skills en el proyecto, no las borres ni sobrescribas.
4. Reglas: crea `.cursor/rules/proyecto.mdc` con las reglas de trabajo del prompt 00A (paso 6), ajustando rutas a la arquitectura decidida. Crea `.cursor/rules/arquitectura.mdc`: si se respeta la arquitectura existente, documenta **esa** arquitectura (a partir del diagnóstico) y añade del anexo solo el patrón de formularios y las reglas de Server/Client Components que no contradigan al proyecto. Si ya existían reglas del proyecto, fusiona sin borrar.
5. Registro central de GSAP y, si aplica, smooth scroll: ubícalos según la arquitectura decidida. Con Lenis, **pausa el scroll suave cuando se abran modales, drawers o menús existentes** y marca sus contenedores con scroll interno con `data-lenis-prevent`; lista qué componentes se tocaron para lograrlo.
6. Crea `docs/escenas/`, `docs/pendientes.md` y actualiza `docs/00-diagnostico.md` con las decisiones.
7. Verifica contra la línea base: `lint`, `typecheck`, `build`. **No debe haber errores nuevos.** Prueba en navegador que las zonas protegidas siguen funcionando (por ejemplo, abrir carrito, navegar a detalle).

## Fase 5 — Plan de mejora con el kit

Escribe en `docs/00-diagnostico.md` (sección "Plan") qué prompts del kit se ejecutan, en qué orden y con qué adaptaciones. Guía:

| Prompt | Uso en proyecto existente |
|---|---|
| 01 Brief | Si el proyecto ya tiene datos de producto o contenido en su backend/CMS, el brief se centra en marca, tono y objetivos; **no** se duplican datos que ya vienen del backend |
| 03B Assets | Las imágenes de producto vienen del backend (`origin: "backend"`); solo se consiguen las de landing y secciones nuevas |
| 02 Dirección de arte | Parte de los tokens existentes: se proponen cambios sobre ellos, no un sistema paralelo |
| 03 Arquitectura y contenido | Mapea las rutas existentes; solo se añaden secciones o páginas nuevas acordadas |
| 04 Motion | Igual, respetando librerías que convivan |
| 05–07 Escenas | Sobre las zonas elegidas en Fase 3 |
| 08 Producto y e-commerce | Solo si el proyecto vende: reutiliza la capa de datos existente en lugar del mock; mejora UI y microinteracciones sin cambiar la lógica de carrito/checkout |
| 09 UI global | Adaptando navbar, footer y transiciones existentes |
| 10 Calidad | Compara contra la línea base del diagnóstico |

## Checklist de aceptación
- [ ] Fase 1 no modificó archivos (salvo `docs/00-diagnostico.md` con permiso).
- [ ] Cada hallazgo tiene evidencia; lo no comprobado está marcado.
- [ ] No se leyeron ni copiaron valores de secretos.
- [ ] Decisiones de la Fase 3 registradas.
- [ ] Tras la integración, sin errores nuevos respecto a la línea base y zonas protegidas funcionando.
- [ ] Plan de prompts escrito.

Termina con: **"Diagnóstico e integración listos. Siguiente paso: `/kit-…` del primer prompt del plan, en un chat nuevo."**
