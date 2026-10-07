[← Índice del handoff](../README.md)

## 4.6 Agenda (`Agenda.dc.html`)

**Ruta propuesta:** `/agenda`, con los filtros en la URL (`/agenda?ciudad=medellin&categoria=rumba&fecha=finde`, como propone el mapa de rutas de este handoff y la parte de producción de H42) · **Quién la ve:** usuario con sesión (avatar "CV" de Camila en el encabezado y en la ventana de repost, eyebrow "Agenda para ti", texto "Elegidos por tus gustos", filtro "Lo que repostea tu gente"). Falta diseñar su versión pública para visitantes (H33): hoy "Ver toda la agenda" de Bienvenida trae al visitante a esta pantalla con sesión. · **Propósito:** es el marketplace nacional dentro de la sesión ("4 · Agenda · Marketplace con reposts" en el lienzo). Muestra los planes de "este finde" en toda Colombia, filtrables por ciudad, categoría y fecha. Desde cada tarjeta se puede guardar, comprar o ver el plan y, sobre todo, **repostear** el evento al feed, a un parche o a amigos cercanos, para convertir el descubrimiento en conversación social (decisión 2.7: el cliente pidió "un apartado como el marketplace donde pueda repostear los eventos").

> **Ficha técnica del archivo:** `<html lang="es">`, `<title>Fulleventos · Agenda</title>`, vista previa del lienzo de 1280 × 3140 (`data-props='{"$preview":{"width":1280,"height":3140}}'`; la altura real renderizada es 3132 px). No tiene `<meta name="viewport">` (H35). El `<helmet>` no tiene `@media`, `@container`, `:focus-visible`, `transition`, `animation` ni `prefers-reduced-motion`: todo el comportamiento responsive sale de `flex-wrap`, `clamp()` y de una rejilla `auto-fill`. En Chromium no hubo errores de consola. Alturas totales medidas: 3132 px a 1280, 6089 px a 768 y 11.110 px a 390 (coinciden con las capturas). La página tiene 131 elementos enfocables (10 del encabezado, 26 de controles y filtros, 5 por cada una de las 19 tarjetas). Referencias de línea: encabezado `:22-65`, `main` `:67`, cabecera `:69-88`, filtros `:90-106`, aviso `:108-116`, resultados `:118-121`, vacío `:123-128`, rejilla `:130-171`, pie `:174-179`, ventana `:181-217`, lógica `:220-399`.

### Navegación de entrada y salida

**Entradas a esta pantalla**

| Desde | Elemento | Notas |
|---|---|---|
| Bienvenida (`Bienvenida.dc.html:195`) | "Ver toda la agenda" | Lleva a un visitante sin sesión a esta pantalla con sesión (H33). No pasa la ciudad ni la categoría elegidas en Bienvenida. |
| Main (`Main.dc.html:53`), Mapa (`:58`), Evento (`:36`), Chat (`:59`) | Ícono de calendario "Agenda de eventos" del encabezado | Perfil no tiene este ícono (usa otra variante de encabezado, H41). |
| Main (`Main.dc.html:90`) | "Explorar agenda" (menú lateral, con ícono de lupa) | |
| Main (`Main.dc.html:303`) | Las 5 "Tendencias en Colombia" (p. ej. "Bogotá · Fútbol · 1.150 planes / #ClásicoCapitalino") | Todas abren la Agenda sin filtro. Lo esperable es que abran con ciudad y categoría (p. ej. `/agenda?ciudad=bogota&categoria=deporte`); el prototipo no lo hace (contexto perdido, mismo problema que H42). |
| La propia Agenda (`:52` y `:77`) | Ícono "Agenda de eventos" y opción "Lista" del selector de vista | Se enlazan a sí mismas: recargan la página y **se pierde todo el estado** (filtros, guardados, reposts). |

**Salidas desde esta pantalla** (en orden de aparición)

| Elemento | Destino en el prototipo | Ruta propuesta | Notas |
|---|---|---|---|
| Logo "fulleventos" | `Main.dc.html` | `/inicio` | |
| Campo "Busca eventos, lugares o artistas" | Ninguno | `/buscar?q=` (pantalla por diseñar, H41) | No hay `<form>`: escribir y pulsar Enter no hace nada. |
| Selector de ciudad (`select name="ciudad"`) | Misma página | `/agenda?ciudad=<id>` | Cambia el estado `city`, sincronizado con los chips de ciudad. |
| Ícono "Inicio" | `Main.dc.html` | `/inicio` | |
| Ícono "Agenda de eventos" (activo) | `Agenda.dc.html` | `/agenda` | Recarga la página (ver arriba). |
| Ícono "Mapa de eventos" | `Mapa.dc.html` | `/mapa` | No pasa la ciudad elegida. |
| Ícono "Mensajes, 3 sin leer" | `Chat.dc.html` | `/mensajes` | |
| Botón "Notificaciones" (campana) | Ninguno | Centro de notificaciones (por diseñar, H54) | Clic muerto (H38, `:59`). |
| Botón "Crear evento" | Ninguno | Formulario para organizadores (por diseñar, H14/H38) | Clic muerto (`:61`); además no tiene `type="button"`. |
| Avatar "CV" ("Tu perfil") | `Perfil.dc.html` | `/perfil/:usuario` (el propio, `/yo`, según H46) | |
| Vista "Lista" | `Agenda.dc.html` | `/agenda` | Opción activa; recarga la página. |
| Vista "Mapa" | `Mapa.dc.html` | `/mapa?ciudad=<ciudad>&categoria=<categoría>` | Hoy abre el Mapa en "Toda Colombia" sin filtros. El Mapa no tiene una opción "Lista" para volver (H41). |
| "Hoy" / "Este finde" / "Próxima semana" | Misma página | `/agenda?fecha=hoy/finde/semana` | Solo cambian el botón marcado: no filtran (H39). |
| 12 chips de ciudad | Misma página | `?ciudad=<id>` | Filtran la rejilla. |
| 8 chips de categoría | Misma página | `?categoria=<id>` | Filtran la rejilla y recalculan los conteos de los chips de ciudad. |
| "Ver en mi feed" (aviso de repost) | `Main.dc.html` | `/inicio` | Siempre dice "feed", aunque el repost haya ido a un parche o a amigos cercanos. En el prototipo el repost no aparece en el feed (limitación declarada en la decisión 2.7). |
| "Cerrar aviso" (X del aviso) | Misma página | — | Cierra el aviso. |
| "Ver todos los planes en el mapa" | `Mapa.dc.html` | `/mapa?ciudad=<ciudad>&categoria=<categoría>` | No pasa el filtro activo (mismo problema que H42). |
| "Ver todos los planes del país" (estado vacío) | Misma página | `/agenda` (sin `ciudad` ni `categoria`) | Limpia ciudad y categoría; **no** toca la fecha. |
| Corazón "Guardar {título}" de cada tarjeta | Misma página | — | Alterna guardado local. En producción, persistir en la cuenta. |
| Título de cada tarjeta | `Evento.dc.html` (el mismo para los 19) | `/evento/:slug` | H36. H34 sugiere un slug con ciudad y fecha (p. ej. `/bogota/eventos/noche-de-salsa-y-boleros-2026-10-09`). |
| "Comprar" / "Ver plan" de cada tarjeta | `Evento.dc.html` (`href: 'Evento.dc.html'` en `:328`) | `/evento/:slug` | H36 y H1. Un evento gratis abre hoy un evento pagado con botón "Comprar". |
| "Repostear" de cada tarjeta | Ventana "Repostear evento" | — | Si la tarjeta ya está reposteada ("Reposteado"), el clic **quita** el repost sin abrir nada. |
| "Enviar a un amigo" (avión de papel) | Ninguno | Hoja de compartir con amigos o chats (por diseñar) | Clic muerto (H38, `:165`). |
| Ventana: "Cerrar", "Cancelar" | Cierran la ventana | — | |
| Ventana: "Repostear" | Confirma el repost | — | Muestra el aviso en la misma página. |
| Pie de página | Sin enlaces | — | H5 exige enlaces legales. |

### Estructura sección por sección

#### 0. Contenedor raíz, fuentes y estilos globales

- **Layout:** un `div` raíz con `position: relative; min-height: 100vh; background: #FBF7F3; color: #17120F; font-family: 'DM Sans', system-ui, sans-serif; font-size: 15px; line-height: 1.5`. Ojo: el tamaño base del texto es **15 px** (Bienvenida y Registro usan 16 px; Main, Mapa, Evento, Chat y Perfil usan 15 px). Las medidas en `rem` se calculan contra los **16 px** del `<html>`, no contra los 15 px del `div`: `.9rem` = 14,4 px, `.86rem` = 13,76 px, `.78rem` = 12,48 px, etc. Dentro del raíz: `header` (fijo arriba), `main`, `footer` y, cuando está abierta, la capa de la ventana de repost.
- **Fuentes (Google Fonts, `display=swap`, con `preconnect` a fonts.googleapis.com):** `Archivo` pesos 800 y 900 y `DM Sans` con eje óptico `opsz 9..40` en pesos 400, 500 y 700. En esta pantalla solo se usan Archivo 900 (h1 y número de la fecha de cada tarjeta) y DM Sans 400/500/700 (medido en `document.fonts`). No usar 600.
- **CSS global del `<helmet>` (exacto):**
  ```css
  body{margin:0;background:#FBF7F3}
  a{color:#17120F;text-decoration:none}a:hover{color:#C23A24}
  button{font-family:inherit;cursor:pointer}
  input,textarea,select{font-family:inherit}
  ```
  Es lo único que hay. La regla `a:hover` solo afecta a los enlaces que no tienen `color` en línea (ver "Estados e interacciones").
- **Contrastes medidos de la paleta usada aquí:** `#17120F` sobre `#FFFFFF` 18,59:1 y sobre `#FBF7F3` 17,44:1; `#6E6259` sobre blanco 5,91:1 y sobre crema 5,54:1; blanco sobre `#C23A24` 5,35:1; `#C23A24` sobre crema 5,02:1; `#F6DC6A` sobre `#17120F` 13,6:1; `#17120F` sobre `#F3ECE5` 15,88:1; `#17120F` sobre `#8FD3D0` 10,97:1; `#D9452F` (logo) sobre crema 4,07:1 (texto grande, pasa); placeholder por defecto `#757575` sobre blanco 4,61:1 y sobre crema 4,32:1 (H52); bordes `#EAE1D8` sobre blanco 1,29:1 y sobre crema 1,21:1; separador `#F1EAE3` sobre blanco 1,19:1.
- **Origen / reutilización:** tokens del código base del cliente (`diseno/referencia/preview-demo.html`, `:root`): `--bg #FBF7F3`, `--surface #FFFFFF`, `--ink #17120F`, `--muted #6E6259`, `--line #EAE1D8`, `--brand #D9452F`, `--brand-hover #BF3923`, `--yellow #F6DC6A`, `--peach #F3B27E`, `--pink #EE93BC` (además `--hero #140E10`, que esta pantalla no usa). El código base también tenía un reinicio global `* { box-sizing: border-box; margin: 0; padding: 0; }` que el prototipo **no** tiene: aquí todo lo que no declara `box-sizing` es `content-box` (ver "Detalles finos" sobre avatares y círculo de radio). El prototipo añade `#C23A24` (rojo de acción: botones, eyebrows, contadores, hover de enlaces), `#F3ECE5` (fondo del contador apagado), `#F1EAE3` (separador interno de la tarjeta), `#8FD3D0`, `#A3A8F0` y `#B9E07A` (avatares). El código base tenía `:focus-visible { outline: 3px solid var(--brand); outline-offset: 2px; }`, que esta pantalla **perdió** (ver H51).

#### 1. Encabezado fijo (`<header>`, `:22-65`)

- **Layout:** `<header>` con `position: sticky; top: 0; z-index: 5; background: #FBF7F3; border-bottom: 1px solid #EAE1D8`. Contenedor interno: `max-width: 1240px; margin: 0 auto; padding: 12px 24px; display: flex; flex-wrap: wrap; align-items: center; gap: 12px 20px`. Sin sombra. Alturas medidas (con el borde): **69 px** desde 907 px de ancho (una fila), **125 px** de 482 a 906 px, **171 px** de 453 a 481 px, **220 px** de 432 a 452 px y **224 px** por debajo de 432 px (ver "Comportamiento responsive"). Diferencias con otras pantallas: Mapa usa `z-index: 70` y `padding: 12px clamp(16px, 4vw, 24px)`; Main usa otro placeholder (H41).
- **Contenido en orden:**
  1. **Logo** `<a href="Main.dc.html">` con el texto exacto "fulleventos" (minúsculas): DM Sans 700, `1.55rem` (24,8 px), `letter-spacing: -0.03em` (−0,744 px), color `#D9452F`, line-height 1.5 → caja de 124,9 × 37,2 px. No cambia de color al pasar el mouse (su color en línea gana a `a:hover`). Bienvenida usa `1.6rem`.
  2. **Buscador** `div role="search"`: `flex: 1 1 260px; max-width: 500px; min-width: 0; display: flex; align-items: center; gap: 10px; background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 999px; padding: 0 6px 0 16px; height: 44px; box-sizing: border-box`. Ancho medido: 500 px a 1280 y a 768, 377,8 px a 1024, 342 px a 390. Contiene:
     - `<label>` con `flex: 1; min-width: 0; display: flex; align-items: center; gap: 10px` que envuelve:
       - Ícono lupa 18 × 18 (`viewBox 0 0 24 24`, `fill="none"`, `stroke="#6E6259"`, `stroke-width="2"`, `stroke-linecap="round"`, `aria-hidden`, `flex-shrink: 0`): `<circle cx="11" cy="11" r="7">` + `<path d="m20 20-3.5-3.5">`.
       - `<input type="search" placeholder="Busca eventos, lugares o artistas" aria-label="Buscar eventos">`: `flex: 1; min-width: 0; border: 0; outline: 0; background: transparent; font-size: .95rem` (15,2 px), color `#17120F`. Placeholder con el gris por defecto (`#757575`). Ancho medido: 285 px a 1280/768 y **127 px a 390**, donde el placeholder se corta en "Busca eventos,". `outline: 0` = sin indicador de foco (H51).
     - `<label>` de la ciudad: `display: flex; align-items: center; gap: 4px; padding-left: 10px; border-left: 1px solid #EAE1D8; font-size: .9rem; white-space: nowrap; flex-shrink: 0`. Dentro: ícono pin 16 × 16 (`stroke="currentColor"` → `#17120F`, `stroke-width 2`, `linecap round`, `aria-hidden`): `<path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z">` + `<circle cx="12" cy="10" r="2.5">`; un `<span>` visualmente oculto con el texto "Ciudad" (`position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap`); y `<select name="ciudad">` con `height: 36px; max-width: 8.6em; border: 0; background: transparent; font-size: .9rem` (14,4 px), `font-weight: 500`, color `#17120F`, `cursor: pointer`, flecha nativa del sistema. Ancho medido 122 px. Opciones exactas (valor = texto): `all` = "Toda Colombia", `bogota` = "Bogotá", `medellin` = "Medellín", `cali` = "Cali", `barranquilla` = "Barranquilla", `cartagena` = "Cartagena", `santamarta` = "Santa Marta", `bucaramanga` = "Bucaramanga", `pereira` = "Pereira", `villavicencio` = "Villavicencio", `pasto` = "Pasto", `leticia` = "Leticia".
  3. **Navegación** `<nav aria-label="Principal">`: `margin-left: auto; display: flex; flex-wrap: wrap; justify-content: flex-end; align-items: center; gap: 6px`. Ancho en una línea: 433,3 px. Elementos en orden:
     - `<a href="Main.dc.html" aria-label="Inicio">`: 44 × 44, `border-radius: 12px; display: grid; place-items: center`. Ícono casa 20 × 20 (`stroke="currentColor"`, `stroke-width 2`, `linecap/linejoin round`): `<path d="M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z">`.
     - `<a href="Agenda.dc.html" aria-label="Agenda de eventos" aria-current="page">`: igual, pero **activo**: `background: #17120F; color: #FFFFFF`. Ícono calendario: `<rect x="3" y="5" width="18" height="16" rx="2">` + `<path d="M3 10h18M8 3v4M16 3v4">`.
     - `<a href="Mapa.dc.html" aria-label="Mapa de eventos">`: ícono mapa plegado `<path d="M9 4 3 6.5V20l6-2.5 6 2.5 6-2.5V4l-6 2.5z">` + `<path d="M9 4v13.5M15 6.5V20">`.
     - `<a href="Chat.dc.html" aria-label="Mensajes, 3 sin leer">` con `position: relative`: ícono globo `<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z">` y una insignia `aria-hidden` con el texto "3": `position: absolute; top: 6px; right: 6px; min-width: 18px; height: 18px; box-sizing: border-box; border-radius: 9px; background: #C23A24; color: #FFFFFF; font-size: .66rem` (10,56 px), `font-weight: 700; line-height: 1; display: grid; place-items: center; padding: 0 4px`.
     - `<button aria-label="Notificaciones">`: 44 × 44, `border-radius: 12px; border: 0; background: transparent; color: #17120F`. Ícono campana: `<path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9">` + `<path d="M10.3 21a1.9 1.9 0 0 0 3.4 0">`. Sin acción.
     - `<button>` "Crear evento": `height: 44px; border: 0; border-radius: 999px; padding: 0 18px; background: #17120F; color: #FFFFFF; font-weight: 700; font-size: .9rem` (14,4 px), `margin-left: 6px` → 127,3 × 44 px. Sin acción, sin `type`.
     - `<a href="Perfil.dc.html" aria-label="Tu perfil">` con el texto "CV": `width: 40px; height: 40px; border-radius: 50%; background: #8FD3D0; display: grid; place-items: center; font-weight: 700; font-size: .78rem` (12,48 px), `margin-left: 4px`, texto `#17120F`.
- **Datos dinámicos:** el `<select>` muestra `value="{{city}}"` (estado `city`, inicial `'all'`). `onChange` (`pickCitySelect`) lee `ev.target.value` y, si no está vacío, hace `setState({ city: valor })`: **no** cambia la categoría ni la fecha. La insignia "3" y el `aria-label` "Mensajes, 3 sin leer" son texto fijo.
- **Origen / reutilización:** es el encabezado con sesión que comparten Main, Agenda, Mapa, Chat y Evento con pequeñas diferencias (5 variantes en el producto, H41). En producción debe ser **un solo componente "encabezado con sesión"** con la página activa como propiedad (`aria-current` + fondo `#17120F`). Viene de `.top`, `.logo`, `.search` y `.btn-dark` del código base (allí la ciudad era el texto fijo "Bogotá", el buscador tenía botón rojo `.go` y sombra `0 1px 2px rgba(23,18,15,.04)`, y `.btn-dark:hover` era `#33291F`); el prototipo cambió la ciudad por un `<select>`, quitó el botón de buscar, la sombra y los hover, y pasó la navegación de texto a 5 íconos sin texto.

#### 2. Cabecera de la página: título y controles de vista y fecha (`:69-88`)

- **Layout del `main`:** `max-width: 1240px; margin: 0 auto; padding: 28px 24px 64px; display: flex; flex-direction: column; gap: 22px` (caja de contenido; el ancho máximo con padding es 1288 px). Ancho útil: `min(ancho de ventana − 48, 1240)` → 342 px a 390, 720 px a 768, 1232 px a 1280. El margen lateral es 24 px en todos los anchos.
- **Layout del bloque:** `display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 16px`. Dos hijos:
  - Columna de título: `flex: 1 1 420px; min-width: 0`.
  - Controles: `display: flex; flex-wrap: wrap; align-items: center; gap: 10px` (ancho en una fila: 499,4 px).
  Los controles quedan a la derecha, alineados con la base del texto, desde 984 px de ancho de ventana; por debajo bajan debajo del título.
- **Contenido en orden:**
  1. **Eyebrow** `<p>` con el texto fuente "Agenda para ti" (se ve "AGENDA PARA TI"): `margin: 0 0 6px; font-size: .74rem` (11,84 px), `font-weight: 700; letter-spacing: .12em` (1,42 px), `text-transform: uppercase; color: #C23A24`. Alto 17,8 px.
  2. **`<h1>`** "Este finde en {{cityLabel}}": `margin: 0; font-family: 'Archivo', sans-serif; font-weight: 900; font-size: clamp(1.9rem, 3.6vw, 2.8rem); letter-spacing: -0.03em; line-height: 1.02`, color `#17120F`. Tamaños medidos: 30,4 px hasta 844 px de ancho; 36,86 px a 1024; 44,8 px (tope) desde 1245 px. Ocupa 2 líneas a 390 ("Este finde en / Colombia", 62 px de alto) y 1 línea a 768 (31 px) y 1280 (45,7 px).
  3. **Bajada** `<p>`, texto exacto (fijo): "Elegidos por tus gustos (salsa, rock, fútbol y planes gratis) en todo el país, de la costa al Amazonas, empezando por Bogotá. Repostea los que te gusten para que tu gente los vea." `margin: 6px 0 0; color: #6E6259; max-width: 62ch` (637 px), 15 px, line-height 22,5 px. Ocupa 2 líneas a 1280 y 768, 3 a 1024 y 4 a 390.
  4. **Selector de vista** `<nav aria-label="Vista">`: `display: flex; background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 999px; padding: 4px` → 179,9 × 48 px. Dos enlaces con `height: 38px; box-sizing: border-box; border-radius: 999px; padding: 0 14px; display: inline-flex; align-items: center; gap: 6px; font-size: .86rem` (13,76 px), `font-weight: 700`:
     - "Lista" (`href="Agenda.dc.html"`, `aria-current="page"`): **activo**, `background: #17120F; color: #FFFFFF`. Ícono lista 16 × 16 con `stroke-width="2.2"`, `linecap/linejoin round`: `<path d="M9 6h11M9 12h11M9 18h11">` + `<path d="M4 6h.01M4 12h.01M4 18h.01">` (los puntos son trazos de 0,01). 82,6 × 38 px.
     - "Mapa" (`href="Mapa.dc.html"`): sin fondo, texto `#17120F` (rojo al pasar el mouse). Ícono mapa plegado 16 × 16, `stroke-width 2`. 87,3 × 38 px.
  5. **Selector de fecha** `<div role="group" aria-label="Fecha">`: mismo contenedor que la vista (`display: flex; background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 999px; padding: 4px`) → 309,5 × 48 px. Tres `<button>` con `height: 38px; border: 0; border-radius: 999px; padding: 0 16px; font-size: .86rem` (13,76 px), `font-weight: 700; white-space: nowrap`, `aria-pressed`: "Hoy" (57,9 px), "Este finde" (98,6 px, **marcado al inicio**: `background: #17120F; color: #FFFFFF`), "Próxima semana" (143 px). Apagados: `background: transparent; color: #17120F`.
- **Datos dinámicos:**
  - `cityLabel` = `'Colombia'` si `city === 'all'`; si no, el nombre de la ciudad (`'Bogotá'`, `'Medellín'`, …). Ejemplos: "Este finde en Colombia", "Este finde en Medellín", "Este finde en Leticia".
  - `whens` = `[['hoy','Hoy'], ['finde','Este finde'], ['semana','Próxima semana']]`; `pressed = 'true'` y fondo `#17120F`/texto `#FFFFFF` para el valor de `state.when` (inicial `'finde'`); el resto `transparent`/`#17120F`. El clic hace `setState({ when: id })` y **nada más**: el título sigue diciendo "Este finde", la lista y los conteos no cambian (H39).
  - La bajada no cambia con la ciudad ni con los gustos reales (sigue diciendo "empezando por Bogotá" aunque el filtro sea Leticia).
- **Origen / reutilización:** el eyebrow y el título vienen de `.eyebrow` y `h2` de la sección "Agenda" del código base ("Agenda / Este finde en Bogotá", allí con `clamp(1.7rem, 3.2vw, 2.4rem)` y `text-wrap: balance`). El control segmentado (contenedor blanco redondo con píldoras de 38 px) es **nuevo** y el mismo selector de fecha está en `Mapa.dc.html:82-86` con estilos idénticos: crear un componente "control segmentado" único para ambos.

#### 3. Filtros: chips de ciudad y de categoría (`:90-106`)

- **Layout:** contenedor `display: flex; flex-direction: column; gap: 10px` con dos filas. Cada fila: `display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px` → 46 px de alto (42 px del chip + 4 px reservados para la barra de desplazamiento). No hay `scrollbar-width: none`: en sistemas con barras de desplazamiento clásicas (Windows) se verá una barra horizontal debajo de cada fila. No hay degradado ni flechas que avisen que hay más chips (H61).
- **Fila 1, ciudades** `<div role="group" aria-label="Filtrar por ciudad">`: 12 `<button>` con `aria-pressed` y `aria-label="{{c.aria}}"`. Estilo: `flex-shrink: 0; display: inline-flex; align-items: center; gap: 8px; height: 42px; border-radius: 999px; padding: 0 7px 0 15px; font-size: .9rem` (14,4 px), `font-weight: 500; white-space: nowrap; border: 1px solid {{c.border}}; background: {{c.bg}}; color: {{c.fg}}`.
  - Solo el primero ("Toda Colombia") lleva antes un ícono pin 16 × 16 (`stroke="currentColor"`, `stroke-width 2`, `linecap round`, el mismo trazado del pin del encabezado).
  - Texto: el nombre de la ciudad.
  - Contador al final: `<span>` con `min-width: 28px; height: 28px; box-sizing: border-box; padding: 0 8px; border-radius: 999px; display: inline-grid; place-items: center; font-size: .78rem` (12,48 px), `font-weight: 700; background: {{c.countBg}}; color: #17120F` (el número siempre es tinta oscura, también en el chip marcado). 28,6 × 28 px con dos cifras.
  - Encendido: borde y fondo `#17120F`, texto `#FFFFFF`, contador sobre `#F6DC6A`. Apagado: borde `#EAE1D8`, fondo `#FFFFFF`, texto `#17120F`, contador sobre `#F3ECE5`.
  - Anchos medidos: "Toda Colombia 19" 185,8 px; "Bogotá 6" 107,2; "Medellín 3" 116,8; "Cali 2" 85,5; "Barranquilla 1" 140,3; "Cartagena 1" 130,5; "Santa Marta 1" 142,1; "Bucaramanga 1" 152,9; "Pereira 1" 107,2; "Villavicencio 1" 145,1; "Pasto 1" 97,4; "Leticia 1" 105. La fila completa mide **1604 px**, así que siempre tiene desplazamiento horizontal: a 1280 se ven hasta "Pereira" y quedan ocultos 372 px (Villavicencio, Pasto y Leticia).
- **Fila 2, categorías** `<div role="group" aria-label="Filtrar por categoría">`: 8 `<button>` con `aria-pressed` y estilo `flex-shrink: 0; height: 42px; border-radius: 999px; padding: 0 16px; font-size: .9rem` (14,4 px), `font-weight: 500; white-space: nowrap; border: 1px solid …`, mismos colores encendido/apagado que las ciudades, sin ícono ni contador. Textos exactos en orden: "Para ti" (marcado al inicio), "Lo que repostea tu gente", "Rumba", "Conciertos", "Gratis", "Comida", "Deporte", "Arte y teatro". La fila mide 899 px: cabe completa desde 947 px de ancho de ventana; por debajo, desplaza.
- **Datos dinámicos (fórmulas exactas, `:282-307`):**
  1. Filtro de categoría (`state.filter`, inicial `'all'`): `'all'` ("Para ti") deja pasar todo; `'amigos'` ("Lo que repostea tu gente") deja pasar los eventos con `fr === true`; cualquier otro id deja pasar los eventos cuyo arreglo `tags` contiene ese id (`rumba`, `conciertos`, `gratis`, `comida`, `deporte`, `teatro`). Resultado: `byCat`.
  2. Conteo por ciudad: `countBy[ciudad]` = cuántos eventos de `byCat` hay en esa ciudad. El chip "Toda Colombia" muestra `byCat.length`. **Los conteos dependen de la categoría** (y no de la fecha). Los chips con 0 siguen visibles y activos.
  3. `aria` de cada chip = `nombre + ', ' + planes(n)`, con `planes(n) = n + (n === 1 ? ' plan' : ' planes')`. Ejemplos: "Toda Colombia, 19 planes", "Barranquilla, 1 plan", "Medellín, 0 planes".
  4. Filtro de ciudad (`state.city`, inicial `'all'`): `matching = byCat.filter(e => city === 'all' || e.city === city)`.
  5. Los dos filtros se combinan (Y lógico). El clic en un chip de ciudad hace `setState({ city: id })`; en uno de categoría, `setState({ filter: id })`.
  - Tabla completa de conteos por categoría en "Datos de ejemplo".
- **Origen / reutilización:** vienen de `.chips` / `.chip` del código base (allí: `padding: 9px 16px`, `padding-bottom: 6px` en la fila (aquí 4 px), `scrollbar-width: none` + `::-webkit-scrollbar { display: none }`, `margin-bottom: 22px`, hover `border-color: var(--ink)` y estado `[aria-pressed="true"]` por CSS). El prototipo agregó la fila de ciudades con contador, subió la altura a 42 px y quitó el hover. En el código base las categorías eran "Todo / Rumba / Conciertos / Planes con amigos / Gratis este finde / Comida / Deporte / Arte y teatro"; Agenda las cambió a "Para ti / Lo que repostea tu gente / … / Gratis / …". Bienvenida sigue usando "Todo" y "Planes con amigos", y Mapa "Todo" (inconsistencia, ver "Detalles finos"). Componente a crear una vez: "chip de filtro" con variante "con contador" y variante "con ícono".

#### 4. Aviso de repost (toast, `<sc-if value="{{hasToast}}">`, `:108-116`)

- **Cuándo aparece:** después de confirmar un repost en la ventana. Se queda hasta que el usuario lo cierra o quita cualquier repost (no se cierra solo, no tiene temporizador). **Sobrevive a los cambios de filtro.**
- **Layout:** va dentro del flujo del `main`, entre los filtros y la línea de resultados (no es flotante ni fijo). `<div role="status">` con `display: flex; flex-wrap: wrap; align-items: center; gap: 10px 16px; background: #17120F; color: #FFFFFF; border-radius: 16px; padding: 14px 18px`. El alto depende del largo del mensaje (medido): a 1280, 1232 × 64 px (una fila); a 768, 720 × 64 px con "…en tu feed." (una fila) y 720 × 73 px con "…en el parche Salseros de jueves." (el texto en 2 líneas); a 390, 342 × 119 px con "…en tu feed." (texto en 2 líneas) y 342 × 141,5 px con el parche (texto en 3 líneas). A 390 el enlace y la X siempre bajan a una segunda fila, alineados a la izquierda.
- **Contenido en orden:**
  1. Ícono check 20 × 20, `stroke="#F6DC6A"`, `stroke-width="2.4"`, `linecap/linejoin round`, `aria-hidden`: `<path d="m5 12 5 5L20 7">`.
  2. `<span style="flex: 1 1 240px">` con el mensaje `{{toast}}` (15 px, blanco).
  3. `<a href="Main.dc.html">` "Ver en mi feed": `color: #F6DC6A; font-weight: 700` (no cambia al pasar el mouse porque el color va en línea).
  4. `<button aria-label="Cerrar aviso">`: 36 × 36, `border: 0; border-radius: 50%; background: transparent; color: #FFFFFF; display: grid; place-items: center`. Ícono X 16 × 16, `stroke-width 2.4`, `linecap round`: `<path d="M6 6l12 12M18 6 6 18">`.
- **Datos dinámicos:** plantilla exacta (`:391`): `'Reposteaste «' + título + '» en ' + where + '.'`, con comillas latinas «» y punto final. `where` según el destino elegido: `feed` → "tu feed"; `parche` → "el parche Salseros de jueves"; `amigos` → "tus amigos cercanos". Ejemplos reales:
  - "Reposteaste «Rock en el Movistar Arena» en tu feed."
  - "Reposteaste «Noche de salsa y boleros en vivo» en el parche Salseros de jueves."
  - "Reposteaste «Rock en el Movistar Arena» en tus amigos cercanos." (redacción forzada; ver "Detalles finos").
  - El comentario escrito en la ventana **no** aparece en el aviso ni se guarda.
- **Origen / reutilización:** componente **nuevo** ("aviso de confirmación"); no existe en el código base. Conviene construirlo como componente global reutilizable (ver correcciones H49 y "Detalles finos": hoy no se ve si el usuario está abajo en la lista).

#### 5. Línea de resultados y enlace al mapa (`:118-121`)

- **Layout:** `display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px 16px; margin-bottom: -6px` (el margen negativo deja 16 px reales entre esta línea y la rejilla, en vez de los 22 px del `gap` del `main`). A 1280 y 768: una fila de 24,1 px. Por debajo de 514 px de ancho, el enlace baja a una segunda línea (53,7 px en total a 390).
- **Contenido en orden:**
  1. `<p>` con `margin: 0; font-size: .9rem` (14,4 px), color `#6E6259`: `<b style="color: #17120F">{{resultCount}}</b> {{resultWhere}}`. Ejemplo: "**19 planes** en 11 ciudades este finde".
  2. `<a href="Mapa.dc.html">` "Ver todos los planes en el mapa": `display: inline-flex; align-items: center; gap: 6px; font-size: .88rem` (14,08 px), `font-weight: 700; border-bottom: 2px solid #17120F; padding-bottom: 1px` (subrayado grueso hecho con borde) → 217,1 × 24,1 px. Al pasar el mouse el texto pasa a `#C23A24` pero el borde se queda `#17120F` (el código base sí cambiaba ambos: `.more:hover { color: var(--brand); border-color: var(--brand); }`).
- **Datos dinámicos:**
  - `resultCount = planes(matching.length)` → "19 planes", "1 plan", "0 planes".
  - `cityCount` = número de ciudades con al menos un evento en `matching`.
  - `resultWhere`: si `city === 'all'` → `'en ' + cityCount + (cityCount === 1 ? ' ciudad' : ' ciudades') + ' este finde'`; si no → `'en ' + cityLabel + ' este finde'`. Ejemplos: "en 11 ciudades este finde", "en 5 ciudades este finde", "en 1 ciudad este finde", "en Medellín este finde". El texto "este finde" es fijo aunque se marque "Hoy" o "Próxima semana" (H39).
  - Con 0 resultados la línea sigue visible ("0 planes en Leticia este finde") encima del estado vacío.
- **Origen / reutilización:** el enlace es la clase `.more` del código base (`font-size: .9rem` allí). Es el mismo estilo de "Ver toda la agenda" en Bienvenida: un componente "enlace subrayado".

#### 6. Estado vacío (`<sc-if value="{{empty}}">`, `:123-128`)

- **Cuándo aparece:** cuando `matching.length === 0` (en el demo solo pasa con una ciudad elegida y una categoría sin eventos en ella, p. ej. Medellín + "Arte y teatro", Leticia + "Deporte" o Leticia + "Lo que repostea tu gente").
- **Layout:** `text-align: center; padding: 40px 16px; background: #FFFFFF; border: 1px dashed #EAE1D8; border-radius: 18px`. Medido: 1232 × 162,5 px a 1280; 342 × 207,5 px a 390. La rejilla sigue en el DOM con 0 de alto, así que abajo quedan los 22 px del `gap` más los 64 px de padding inferior del `main`.
- **Contenido en orden:**
  1. `<p>` con `margin: 0 0 14px; color: #6E6259` (15 px). Plantilla exacta: `'Por ahora no hay planes con este filtro en ' + cityLabel + ' este finde. Prueba otra ciudad o mira todo el país.'` Ejemplo: "Por ahora no hay planes con este filtro en Medellín este finde. Prueba otra ciudad o mira todo el país."
  2. `<button>` "Ver todos los planes del país": `height: 44px; border-radius: 999px; border: 1px solid #17120F; background: #FFFFFF; color: #17120F; padding: 0 20px; font-size: .9rem` (14,4 px), `font-weight: 700` → 241,9 × 44 px.
- **Datos dinámicos:** el botón hace `setState({ city: 'all', filter: 'all' })` (no toca `when`, ni guardados, ni reposts, ni el aviso).
- **Origen / reutilización:** el código base solo tenía `.empty` ("No hay planes en esta categoría este finde.", `padding: 40px 0`, sin botón). El patrón con acción útil es el mismo de Bienvenida (`Bienvenida.dc.html:214-215`, mismo botón) pero con otro texto: crear un componente "estado vacío" (mensaje + acción) y unificar los textos.

#### 7. Rejilla y tarjeta de evento (`:130-171`)

- **Layout de la rejilla:** `display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 22px`. Columnas: 1 por debajo de 590 px de ancho de ventana, 2 de 590 a 871, 3 de 872 a 1153 y 4 desde 1154 (5 nunca caben: harían falta 1388 px de contenido y el máximo es 1240). Ancho de tarjeta medido: 291,5 px a 1280 (293,5 a ≥1288), 310,7 a 1024, 349 a 768, 342 a 390, 312 a 360. Las filas se estiran a la tarjeta más alta de la fila, y el bloque de precio y las acciones se pegan abajo gracias a `margin-top: auto`. Con 19 eventos la última fila queda incompleta: 3 tarjetas de 4 a 1280, 1 tarjeta sola de 2 a 768 y 1 de 3 a 1024.
- **Tarjeta** `<article>`: `background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 18px; overflow: hidden; display: flex; flex-direction: column`. Sin sombra y sin efecto al pasar el mouse. Altos medidos: 493,3 / 513,7 px a 1280; 515,5 / 536,5 a 768; 510,2 / 531,2 a 390 (los 21 px de diferencia son un título o un lugar en 2 líneas).
- **Contenido en orden:**
  1. **Zona de imagen** `<div>`: `position: relative; aspect-ratio: 4 / 3` (289,5 × 217,1 px a 1280; 347 × 260,3 a 768; 340 × 255 a 390). Contiene:
     - **Foto (marcador):** `<span role="img" aria-label="[Foto del evento]">` con `position: absolute; inset: 0; background: radial-gradient(circle at 70% 30%, {{e.bg1}} 0, transparent 55%), {{e.bg2}}`. En producción va la foto real del evento (ver "Detalles finos" sobre el texto alternativo).
     - **Fecha:** `<span>` con `position: absolute; top: 12px; left: 12px; background: #FFFFFF; border-radius: 10px; padding: 5px 9px 4px; text-align: center; line-height: 1; min-width: 46px` → 64 × 44 px. Dentro: `<b>` con el día `{{e.d}}` (`display: block; font-family: 'Archivo'; font-size: 1.25rem` (20 px), `font-weight: 900`) y un `<span>` con el texto fijo "oct" (se ve "OCT"): `font-size: .66rem` (10,56 px), `font-weight: 700; text-transform: uppercase; letter-spacing: .06em` (0,63 px), color `#6E6259`.
     - **Guardar:** `<button aria-label="Guardar {{e.t}}" aria-pressed="{{e.savedPressed}}">` con `position: absolute; top: 10px; right: 10px; width: 44px; height: 44px; border-radius: 50%; border: 0; background: rgba(255,255,255,.94); display: grid; place-items: center; color: {{e.saveColor}}`. Ícono corazón 18 × 18, `stroke="currentColor"`, `stroke-width 2`, `stroke-linejoin round`, `fill="{{e.saveFill}}"`: `<path d="M12 20s-7-4.4-9.2-8.6C1.3 8.4 3.2 5 6.6 5c2 0 3.4 1.1 4.4 2.5C12 6.1 13.4 5 15.4 5c3.4 0 5.3 3.4 3.8 6.4C19 15.6 12 20 12 20z">`. Apagado: color `#17120F`, `fill="none"`. Guardado: color `#C23A24`, `fill="currentColor"` (corazón relleno rojo).
     - **Marca "Reposteaste"** (`<sc-if value="{{e.reposted}}">`): `position: absolute; bottom: 10px; left: 10px; display: flex; align-items: center; gap: 6px; background: #F6DC6A; color: #17120F; border-radius: 999px; padding: 4px 10px; font-size: .74rem` (11,84 px), `font-weight: 700` → 111,9 × 25,8 px. Ícono repost 13 × 13, `stroke-width 2.6`, `linecap/linejoin round`: `<path d="M17 2l4 4-4 4">` + `<path d="M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4">` + `<path d="M21 13v2a3 3 0 0 1-3 3H3">`. Texto exacto "Reposteaste".
  2. **Cuerpo** `<div>`: `padding: 14px 16px 16px; display: flex; flex-direction: column; flex: 1`. En orden:
     - **Categoría** `<span>` `{{e.cat}}` (se ve en mayúsculas, p. ej. "RUMBA"): `font-size: .7rem` (11,2 px), `font-weight: 700; letter-spacing: .1em` (1,12 px), `text-transform: uppercase; color: #C23A24`.
     - **Título** `<a href="Evento.dc.html">` `{{e.t}}`: `font-size: 1.05rem` (16,8 px), `font-weight: 700; line-height: 1.25` (21 px), `margin: 4px 0 6px`, color `#17120F` (rojo `#C23A24` al pasar el mouse). No es un encabezado (`h3`) y no tiene `text-wrap: balance` (el código base sí). Se parte en 2 líneas cuando no cabe; no hay truncado.
     - **Lugar y ciudad** `<span>`: `font-size: .85rem` (13,6 px), color `#6E6259`: `{{e.v}} · ` + `<span style="color: #17120F; font-weight: 700">{{e.cityName}}</span>`. Ej.: "Galería Café Libro · Zona T · **Bogotá**". Puede ocupar 2 líneas (p. ej. "Plaza de la Trinidad · Getsemaní · Cartagena" a 1280).
     - **Línea social** `<div>`: `display: flex; align-items: center; gap: 8px; font-size: .78rem` (12,48 px), `color: #6E6259; margin-top: 10px`. Dentro: un grupo `display: flex; flex-shrink: 0` con 2 círculos de `22px` + `border: 2px solid #FFFFFF` (caja real 26 × 26 por no tener `box-sizing`), `border-radius: 50%`, fondos `{{e.c1}}` y `{{e.c2}}`, el segundo con `margin-left: -7px` (se enciman); sin iniciales. Después, `<span>{{e.repostLine}}</span>`.
     - **Precio y compra** `<div>`: `display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-top: auto; padding-top: 14px`.
       - `<span style="font-weight: 700; font-size: .95rem">` (15,2 px) con `{{e.priceLabel}}` y, debajo, `<span style="display: block; font-weight: 400; font-size: .72rem; color: #6E6259">` (11,52 px) con `{{e.b}}` (boletera, "Entrada libre" u organizador). Sin `tabular-nums`.
       - CTA `<a href="{{e.href}}" aria-label="{{e.ctaAria}}">` `{{e.cta}}`: `display: inline-flex; align-items: center; gap: 6px; min-height: 40px; box-sizing: border-box; background: #C23A24; color: #FFFFFF; border-radius: 999px; padding: 10px 14px; font-size: .82rem` (13,12 px), `font-weight: 700; white-space: nowrap` → 85,1 × 40 px con "Comprar". Sin ícono. Sin cambio al pasar el mouse.
     - **Acciones sociales** `<div>`: `display: flex; gap: 8px; margin-top: 12px; padding-top: 12px; border-top: 1px solid #F1EAE3`.
       - `<button aria-pressed="{{e.repostPressed}}">` `{{e.repostLabel}}`: `flex: 1; height: 40px; border-radius: 999px; font-size: .84rem` (13,44 px), `font-weight: 700; border: 1px solid #17120F; background: {{e.repostBg}}; color: {{e.repostFg}}; display: flex; align-items: center; justify-content: center; gap: 6px`. Ícono repost 16 × 16 con `stroke-width 2.2` (mismo trazado de la marca). "Repostear": fondo `#FFFFFF`, texto `#17120F`. "Reposteado": fondo `#17120F`, texto `#FFFFFF`. Ancho 209,5 px a 1280.
       - `<button aria-label="Enviar a un amigo">`: `width: 40px; height: 40px; border-radius: 50%; border: 1px solid #EAE1D8; background: #FFFFFF; color: #17120F; display: grid; place-items: center`. Ícono avión de papel 16 × 16, `stroke-width 2`, `linecap/linejoin round`: `<path d="M22 2 11 13M22 2l-7 20-4-9-9-4z">`. Sin acción.
- **Datos dinámicos (`:309-353`):**
  - **Orden "round-robin" por ciudad** (comentario del código: "Bogotá first, it's your city, so the first row already shows the whole country"): se agrupan los eventos de `matching` por ciudad en el orden de la lista `cities` (Bogotá, Medellín, Cali, Barranquilla, Cartagena, Santa Marta, Bucaramanga, Pereira, Villavicencio, Pasto, Leticia) y se toma el 1.º de cada ciudad, luego el 2.º de cada una, etc. Con todo el país y "Para ti" el orden es: e1, e7, e10, e12, e13, e14, e15, e16, e17, e18, e19, e2, e8, e11, e3, e9, e4, e5, e6. Con una sola ciudad, el orden es el de la lista de datos (no cronológico: en Bogotá, "Mercado gastronómico" del 10 sale después del "Stand-up" del 11).
  - `cityName` = nombre de la ciudad del evento.
  - `priceLabel` = `p ? 'Desde $' + p.toLocaleString('es-CO') : 'Gratis'` → "Desde $45.000", "Desde $180.000", "Gratis" (punto de miles, sin decimales, sin espacio tras `$`).
  - `cta` = `p ? 'Comprar' : 'Ver plan'`; `ctaAria` = `p ? 'Comprar boletas para ' + t : 'Ver plan: ' + t`; `href` = `'Evento.dc.html'` para todos.
  - Repost: `rep = !!state.reposted[id]` (inicial `{ e2: true }`); `count = r + (rep ? 1 : 0)`; `repostLine` = si `rep`: `'Tú, ' + who + ' y ' + (count − 2) + ' más lo repostearon'`; si no: `who + ' y ' + (count − 1) + ' más lo repostearon'`. Ej.: e1 sin repost "Laura y 13 más lo repostearon" → reposteado "Tú, Laura y 13 más lo repostearon" (el número no cambia; se antepone "Tú, "). e2 al inicio: "Tú, Andrés y 30 más lo repostearon".
  - `repostLabel` "Repostear"/"Reposteado"; `repostPressed` `'false'`/`'true'`; `repostBg` `#FFFFFF`/`#17120F`; `repostFg` `#17120F`/`#FFFFFF`; `reposted` muestra la marca amarilla.
  - Guardar: `saved = !!state.saved[id]` (inicial `{}`); `savedPressed`, `saveColor` `#17120F`/`#C23A24`, `saveFill` `none`/`currentColor`; el clic invierte `saved[id]`.
  - El mes "oct" está escrito en la plantilla, no viene del dato.
- **Origen / reutilización:** es la tarjeta `.card` del código base (`.img`, `.date`, `.save`, `.cat`, `h3`, `.where`, `.going`, `.buy`, `.price`, `.ticket`), ampliada. Cambios del prototipo: guardar de 36 → 44 px, `top/right` de 12 → 10 px y fondo de `rgba(255,255,255,.92)` → `.94`; la línea `.going` "N amigo va" / "N amigos van" (círculos de color de 24 px sin iniciales, encimados −7 px, solo si había amigos) → "X y N más lo repostearon" con 2 círculos de color de 22 px (+ borde); "Boletas ↗" externo a tuboleta.com (`target="_blank"`) → "Comprar"/"Ver plan" hacia la página del evento (decisión 2.10); se agregan la marca "Reposteaste" y la fila de acciones; se pierden el `h3`, `text-wrap: balance`, `tabular-nums`, el hover `translateY(-3px)` con sombra `0 12px 28px rgba(23,18,15,.10)` en 200 ms `ease-out` (con su `prefers-reduced-motion`) y el hover `.ticket:hover { background: #BF3923 }`. La misma tarjeta, con variaciones, está en Bienvenida (rejilla `minmax(250px, 1fr)`; en lugar de los avatares y "…lo repostearon" tiene una línea con ícono de persona y el texto "{N} van · {M} parches abiertos"; sin marca "Reposteaste" ni fila de acciones; CTA de `min-height: 44px` y `padding: 11px 15px`), Mapa (compacta, CTA de 36 px, repost instantáneo) y Main. En producción: **un solo componente "tarjeta de evento"** con variantes (completa con acciones sociales, pública sin acciones, compacta horizontal para celular según H47).

#### 8. Pie de página (`<footer>`, `:174-179`)

- **Layout:** `<footer style="border-top: 1px solid #EAE1D8">`; contenedor `max-width: 1240px; margin: 0 auto; padding: 28px 24px 40px; display: flex; flex-wrap: wrap; gap: 12px 28px; justify-content: space-between; font-size: .85rem` (13,6 px), color `#6E6259`. Alto: 89,4 px en una fila (desde 931 px de ancho) y 142,2 px a 390 (el segundo texto ocupa 2 líneas).
- **Contenido en orden:**
  1. "© 2026 Fulleventos · Colombia" (192,4 px).
  2. "Compra segura dentro de Fulleventos. Las boletas las emite la boletera oficial del evento o el organizador." (662,4 px en una línea).
- **Datos dinámicos:** ninguno. Sin enlaces.
- **Origen / reutilización:** `footer` del código base (allí "© 2026 Fulleventos · Bogotá, Colombia" y "Las boletas se compran en las boleteras oficiales. Fulleventos no vende entradas.", con `margin-top: 72px`). El texto cambió por la decisión 2.10. El mismo pie está en Bienvenida, Mapa y Evento: un solo componente "pie legal", que debe ampliarse según H5 y H1.

#### 9. Ventana "Repostear evento" (`<sc-if value="{{modalOpen}}">`, `:181-217`)

- **Cuándo aparece:** al tocar "Repostear" en una tarjeta que no está reposteada (`setState({ modal: e.id, target: 'feed' })`).
- **Layout:**
  - Capa: `position: fixed; inset: 0; z-index: 20; background: rgba(23,18,15,.55); display: flex; align-items: center; justify-content: center; padding: 16px`. Cubre también el encabezado (z-index 5). Sin `overflow` propio y sin bloqueo del scroll de la página: con la ventana abierta, la rueda del mouse sigue desplazando la página de fondo.
  - Ventana `<div role="dialog" aria-modal="true" aria-label="Repostear evento">`: `width: 100%; max-width: 520px; background: #FFFFFF; border-radius: 24px; padding: 22px; box-sizing: border-box; display: flex; flex-direction: column; gap: 16px; box-shadow: 0 24px 60px rgba(23,18,15,.3)`. **Sin `max-height` ni scroll interno.** Medida: 520 × 576,9 px centrada (x 380, y 161,6 a 1280 × 900; y 223,6 a 768 × 1024); 358 × 615,9 px a 390 × 844 (y 114); 328 × 615,9 a 360 × 640 (y 12); 288 × 690 a 320 × 568 (y −61: la X queda fuera de la pantalla); a 844 × 390 (celular horizontal) la ventana arranca en y −93 y el botón "Repostear" termina en y 461, fuera de una pantalla de 390 px: **no se puede confirmar ni cerrar con la X**.
- **Contenido en orden:**
  1. **Cabecera:** `display: flex; align-items: center; justify-content: space-between`.
     - `<h2>` "Repostear evento": `margin: 0; font-size: 1.15rem` (18,4 px), DM Sans 700, line-height 27,6 px. (La ventana del Chat usa Archivo 900 `1.4rem`: inconsistencia.)
     - `<button aria-label="Cerrar">`: 40 × 40, `border: 0; border-radius: 50%; background: #FBF7F3; color: #17120F; display: grid; place-items: center`. Ícono X 16 × 16, `stroke-width 2.4`, `linecap round`.
  2. **Comentario:** `display: flex; gap: 12px; align-items: flex-start`.
     - Avatar `<span>` "CV": `width: 42px; height: 42px; flex-shrink: 0; border-radius: 50%; background: #8FD3D0; display: grid; place-items: center; font-weight: 700; font-size: .8rem` (12,8 px).
     - `<label style="flex: 1; min-width: 0">` con un `<span>` visualmente oculto "Comentario" (`position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0)`) y `<textarea rows="3" placeholder="Añade un comentario. Ej.: ¿Quién se apunta?">`: `width: 100%; box-sizing: border-box; border: 1px solid #EAE1D8; border-radius: 14px; padding: 12px 14px; font-size: .95rem` (15,2 px), `background: #FBF7F3; resize: none; outline: 0` → 422 × 86 px a 1280. Sin `maxlength`, sin contador. No está conectado al estado: lo escrito se pierde al cerrar.
  3. **Vista previa del evento:** `border: 1px solid #EAE1D8; border-radius: 16px; overflow: hidden; display: flex` (476 × 88,5 px a 1280).
     - Imagen `<div role="img" aria-label="[Foto del evento]">`: `width: 110px; flex-shrink: 0; background: radial-gradient(circle at 70% 30%, {{sel.bg1}} 0, transparent 58%), {{sel.bg2}}` (ojo: **58 %** aquí, 55 % en la tarjeta). Su alto lo da el texto.
     - Texto `<div style="padding: 12px 14px; line-height: 1.3">`: categoría `<span>` `{{sel.cat}}` (`font-size: .68rem` = 10,88 px, 700, `letter-spacing: .1em`, mayúsculas, `#C23A24`); título `<b style="display: block; margin: 2px 0">` `{{sel.t}}` (15 px, 700); detalle `<span style="font-size: .82rem; color: #6E6259">` (13,12 px) con la plantilla `{{sel.d}} oct · {{sel.v}} · {{sel.cityName}}` → "9 oct · Galería Café Libro · Zona T · Bogotá".
  4. **Destino** `<fieldset>` (`border: 0; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px`):
     - `<legend>` "¿Dónde lo compartes?": `font-weight: 700; font-size: .88rem` (14,08 px), `margin-bottom: 8px`.
     - 3 `<button aria-pressed>` (476 × 52,3 px a 1280): `display: flex; align-items: center; gap: 12px; text-align: left; min-height: 52px; border-radius: 14px; padding: 8px 14px; border: 1.5px solid {{tg.border}}; background: {{tg.bg}}; color: #17120F`. Dentro: un círculo tipo radio `<span>` de `width/height: 20px` con `flex-shrink: 0; border-radius: 50%; border: 2px solid #17120F` (sin `box-sizing`: mide **24 × 24 px** reales), centrado con `display: grid; place-items: center`, que contiene un punto de `10px` con `border-radius: 50%; background: {{tg.dot}}`; y el texto (`line-height: 1.25`): `<b style="font-size: .9rem">` (14,4 px) con la etiqueta y `<span style="display: block; font-size: .78rem; color: #6E6259">` (12,48 px) con la descripción.
     - Opciones exactas: "En mi feed" / "Lo ven todos tus seguidores" (marcada al abrir); "En un parche" / "Salseros de jueves · 12 miembros"; "Solo a amigos cercanos" / "Una lista que tú eliges".
     - Marcada: borde `#17120F`, fondo `#FBF7F3`, punto `#17120F`. No marcada: borde `#EAE1D8`, fondo `#FFFFFF`, punto `transparent`. El borde de 1,5 px se dibuja de 1 px en pantallas de densidad 1 (medido) y de 1,5 px en pantallas de densidad 2.
  5. **Acciones:** `display: flex; justify-content: flex-end; gap: 10px`.
     - "Cancelar": `height: 46px; border: 0; background: transparent; padding: 0 16px; font-weight: 700; color: #17120F` → 90,9 × 46 px.
     - "Repostear": `height: 46px; border: 0; border-radius: 999px; padding: 0 22px; background: #C23A24; color: #FFFFFF; font-weight: 700` → 110,8 × 46 px.
     - Ninguno de los dos define `font-size`: salen con el tamaño por defecto del navegador para botones (**13,33 px**), más pequeño que el resto de botones de la pantalla. Decidir un tamaño explícito al implementar (ver "Detalles finos").
- **Datos dinámicos:**
  - `sel` = el evento con `id === state.modal` (si no hay ninguno, `all[0]`), más `cityName`.
  - `targets`: para cada destino, `pressed`, `border` (`#17120F`/`#EAE1D8`), `bg` (`#FBF7F3`/`#FFFFFF`), `dot` (`#17120F`/`transparent`); el clic hace `setState({ target: id })`.
  - "Cerrar" y "Cancelar" hacen `setState({ modal: null })` (el destino elegido queda en el estado, pero se reinicia a `'feed'` en la siguiente apertura).
  - "Repostear" (`confirmRepost`): `reposted[modal] = true`, cierra la ventana y pone el aviso `'Reposteaste «' + sel.t + '» en ' + where + '.'`.
- **Origen / reutilización:** ventana **nueva** (no existe en el código base). En el producto hay otras dos ventanas (checkout de Evento y "Nuevo parche" del Chat) con el mismo fondo `rgba(23,18,15,.55)`, el mismo radio 24 px, padding 22 px, gap 16 px y sombra `0 24px 60px rgba(23,18,15,.3)`. La del Chat (`Chat.dc.html:454-456`) es la más completa: capa con `z-index: 40` y `box-sizing: border-box`, fondo clicable que cierra (un `div` `aria-hidden` aparte), `max-height: calc(100vh - 32px); overflow-y: auto`, `aria-labelledby` hacia su `h2` y `onKeyDown` para Escape; ojo: su `max-width` es **540 px** (aquí 520 px) y su botón "Cerrar" sí lleva `type="button"` y `flex-shrink: 0`. Crear **un solo componente "ventana modal"** con esas reglas (más las de H7) y usarlo aquí. La lista de destinos es un grupo de opción única: implementarlo como radio nativo (ver H59).

### Datos de ejemplo

**Fin de semana de ejemplo:** viernes 9 a lunes festivo 12 de octubre de 2026 (verificado: el 9 de octubre de 2026 es viernes). El campo `d` es el día; el mes "oct" está fijo en la plantilla.

**Eventos (`all`, `:260-280`, 19 registros con todos sus campos).** `p` en pesos (0 = gratis); `b` = boletera u organizador mostrado bajo el precio; `bg1`/`bg2` = colores del marcador de foto; `who` = persona que aparece en la línea social; `r` = reposts totales (incluye a `who`); `c1`/`c2` = colores de los 2 avatares; `fr` = "lo repostearon tus amigos cercanos" (filtro "Lo que repostea tu gente").

| id | Título (`t`) | `cat` | `tags` | Ciudad | `d` | Lugar (`v`) | `p` | `b` | `bg1` | `bg2` | `who` | `r` | `c1` | `c2` | `fr` |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| e1 | Noche de salsa y boleros en vivo | Rumba | rumba | bogota (Bogotá) | 9 | Galería Café Libro · Zona T | 45000 | TuBoleta | `#E8A04F` | `#B5372B` | Laura | 14 | `#F3B27E` | `#EE93BC` | true |
| e2 | Festival de jazz al parque | Conciertos | conciertos, gratis | bogota (Bogotá) | 10 | Parque El Country · Usaquén | 0 | Idartes | `#4F6DD8` | `#1E2550` | Andrés | 31 | `#A3A8F0` | `#B9E07A` | true |
| e3 | Rock en el Movistar Arena | Conciertos | conciertos | bogota (Bogotá) | 10 | Movistar Arena · Salitre | 180000 | TuBoleta | `#D9452F` | `#2B0F12` | Daniel | 52 | `#8FD3D0` | `#F6DC6A` | false |
| e4 | Santa Fe vs. Millonarios | Deporte | deporte | bogota (Bogotá) | 11 | Estadio El Campín · Teusaquillo | 60000 | Ticketmaster | `#C4302B` | `#1F3A8A` | Sofía | 88 | `#EE93BC` | `#B9E07A` | true |
| e5 | Stand-up: risas de domingo | Arte y teatro | teatro | bogota (Bogotá) | 11 | Teatro Libre · Chapinero | 55000 | TuBoleta | `#EE93BC` | `#5A2340` | Juan Pablo | 9 | `#B9E07A` | `#F3B27E` | true |
| e6 | Mercado gastronómico de las Américas | Comida | comida, gratis | bogota (Bogotá) | 10 | Plaza de los Artesanos | 0 | Entrada libre | `#F6DC6A` | `#C46A2B` | Mafe | 21 | `#F6DC6A` | `#A3A8F0` | false |
| e7 | Noche de reguetón en Provenza | Rumba | rumba | medellin (Medellín) | 9 | Barrio Provenza · El Poblado | 50000 | Fever | `#6B3FA0` | `#0E0A1A` | Valentina | 17 | `#A3A8F0` | `#8FD3D0` | true |
| e8 | Atlético Nacional vs. Junior | Deporte | deporte | medellin (Medellín) | 12 | Estadio Atanasio Girardot | 70000 | Ticketmaster | `#3E9B63` | `#0F2A1C` | Mateo | 64 | `#B9E07A` | `#8FD3D0` | false |
| e9 | Milonga en Manrique | Rumba | rumba | medellin (Medellín) | 10 | Casa del tango · Manrique | 25000 | TuBoleta | `#B88A5A` | `#3A2414` | Isa | 7 | `#F3B27E` | `#A3A8F0` | false |
| e10 | Viejoteca de salsa caleña | Rumba | rumba | cali (Cali) | 10 | Juanchito | 40000 | TuBoleta | `#F3B27E` | `#8A2E1F` | Caro | 23 | `#EE93BC` | `#F6DC6A` | true |
| e11 | Concierto de músicas del Pacífico | Conciertos | conciertos | cali (Cali) | 11 | Teatro Municipal | 35000 | TuBoleta | `#8FD3D0` | `#12343A` | Felipe | 12 | `#8FD3D0` | `#B9E07A` | false |
| e12 | Vallenato en el Gran Malecón | Conciertos | conciertos, gratis | barranquilla (Barranquilla) | 10 | Gran Malecón del Río | 0 | Entrada libre | `#F6DC6A` | `#1E5A7A` | Nata | 40 | `#F6DC6A` | `#8FD3D0` | false |
| e13 | Noche de champeta en Getsemaní | Rumba | rumba | cartagena (Cartagena) | 9 | Plaza de la Trinidad · Getsemaní | 30000 | Fever | `#EE93BC` | `#4A1A3A` | Laura | 19 | `#F3B27E` | `#A3A8F0` | true |
| e14 | Atardecer electrónico en la playa | Rumba | rumba | santamarta (Santa Marta) | 10 | Playa El Rodadero | 90000 | Fever | `#F3B27E` | `#1E2550` | Sebas | 26 | `#A3A8F0` | `#F3B27E` | true |
| e15 | Festival de cerveza artesanal | Comida | comida | bucaramanga (Bucaramanga) | 11 | Parque San Pío | 25000 | TuBoleta | `#E8A04F` | `#5A3A14` | Tomás | 8 | `#B9E07A` | `#EE93BC` | false |
| e16 | Noche de trova en el lago | Conciertos | conciertos, gratis | pereira (Pereira) | 9 | Parque Lago Uribe Uribe | 0 | Entrada libre | `#A3A8F0` | `#2A2550` | Majo | 5 | `#A3A8F0` | `#F6DC6A` | false |
| e17 | Joropo en Los Fundadores | Conciertos | conciertos, gratis | villavicencio (Villavicencio) | 11 | Parque Los Fundadores | 0 | Entrada libre | `#B9E07A` | `#2A3A14` | Simón | 11 | `#8FD3D0` | `#F3B27E` | false |
| e18 | Concierto andino en la plaza | Conciertos | conciertos, gratis | pasto (Pasto) | 10 | Plaza de Nariño | 0 | Entrada libre | `#8FD3D0` | `#2A1F3A` | Ana María | 6 | `#EE93BC` | `#8FD3D0` | false |
| e19 | Música y comida en el malecón del Amazonas | Comida | comida, gratis | leticia (Leticia) | 11 | Malecón de Leticia | 0 | Entrada libre | `#B9E07A` | `#12343A` | Dani | 4 | `#B9E07A` | `#A3A8F0` | false |

**Textos calculados de cada tarjeta en el estado inicial:**

| id | Precio | CTA | `aria-label` del CTA | Línea social | Botón |
|---|---|---|---|---|---|
| e1 | "Desde $45.000" | "Comprar" | "Comprar boletas para Noche de salsa y boleros en vivo" | "Laura y 13 más lo repostearon" | "Repostear" |
| e2 | "Gratis" | "Ver plan" | "Ver plan: Festival de jazz al parque" | "Tú, Andrés y 30 más lo repostearon" | "Reposteado" (marcado, con marca "Reposteaste") |
| e3 | "Desde $180.000" | "Comprar" | "Comprar boletas para Rock en el Movistar Arena" | "Daniel y 51 más lo repostearon" | "Repostear" |
| e4 | "Desde $60.000" | "Comprar" | "Comprar boletas para Santa Fe vs. Millonarios" | "Sofía y 87 más lo repostearon" | "Repostear" |
| e5 | "Desde $55.000" | "Comprar" | "Comprar boletas para Stand-up: risas de domingo" | "Juan Pablo y 8 más lo repostearon" | "Repostear" |
| e6 | "Gratis" | "Ver plan" | "Ver plan: Mercado gastronómico de las Américas" | "Mafe y 20 más lo repostearon" | "Repostear" |
| e7 | "Desde $50.000" | "Comprar" | "Comprar boletas para Noche de reguetón en Provenza" | "Valentina y 16 más lo repostearon" | "Repostear" |
| e8 | "Desde $70.000" | "Comprar" | "Comprar boletas para Atlético Nacional vs. Junior" | "Mateo y 63 más lo repostearon" | "Repostear" |
| e9 | "Desde $25.000" | "Comprar" | "Comprar boletas para Milonga en Manrique" | "Isa y 6 más lo repostearon" | "Repostear" |
| e10 | "Desde $40.000" | "Comprar" | "Comprar boletas para Viejoteca de salsa caleña" | "Caro y 22 más lo repostearon" | "Repostear" |
| e11 | "Desde $35.000" | "Comprar" | "Comprar boletas para Concierto de músicas del Pacífico" | "Felipe y 11 más lo repostearon" | "Repostear" |
| e12 | "Gratis" | "Ver plan" | "Ver plan: Vallenato en el Gran Malecón" | "Nata y 39 más lo repostearon" | "Repostear" |
| e13 | "Desde $30.000" | "Comprar" | "Comprar boletas para Noche de champeta en Getsemaní" | "Laura y 18 más lo repostearon" | "Repostear" |
| e14 | "Desde $90.000" | "Comprar" | "Comprar boletas para Atardecer electrónico en la playa" | "Sebas y 25 más lo repostearon" | "Repostear" |
| e15 | "Desde $25.000" | "Comprar" | "Comprar boletas para Festival de cerveza artesanal" | "Tomás y 7 más lo repostearon" | "Repostear" |
| e16 | "Gratis" | "Ver plan" | "Ver plan: Noche de trova en el lago" | "Majo y 4 más lo repostearon" | "Repostear" |
| e17 | "Gratis" | "Ver plan" | "Ver plan: Joropo en Los Fundadores" | "Simón y 10 más lo repostearon" | "Repostear" |
| e18 | "Gratis" | "Ver plan" | "Ver plan: Concierto andino en la plaza" | "Ana María y 5 más lo repostearon" | "Repostear" |
| e19 | "Gratis" | "Ver plan" | "Ver plan: Música y comida en el malecón del Amazonas" | "Dani y 3 más lo repostearon" | "Repostear" |

**Ciudades (`cities`, `:230-242`).** Orden = orden de los chips, del `<select>` (después de "Toda Colombia") y del reparto "round-robin". Los campos `left`/`top` (posición del pin en el mapa, en %) se copiaron de Mapa y **no se usan** en esta pantalla.

| id | Nombre | `left` | `top` | Eventos |
|---|---|---|---|---|
| bogota | Bogotá | 41.8 | 47.4 | 6 (e1–e6) |
| medellin | Medellín | 30.2 | 38.6 | 3 (e7–e9) |
| cali | Cali | 22.8 | 54.6 | 2 (e10, e11) |
| barranquilla | Barranquilla | 36.2 | 11.7 | 1 (e12) |
| cartagena | Cartagena | 30.9 | 14.9 | 1 (e13) |
| santamarta | Santa Marta | 40.8 | 10.1 | 1 (e14) |
| bucaramanga | Bucaramanga | 49.1 | 33.6 | 1 (e15) |
| pereira | Pereira | 29.3 | 46.8 | 1 (e16) |
| villavicencio | Villavicencio | 45.2 | 50.6 | 1 (e17) |
| pasto | Pasto | 17.1 | 67.4 | 1 (e18) |
| leticia | Leticia | 73.5 | 97 | 1 (e19) |

**Categorías (`chips`, `:251-257`):**

| id | Texto del chip | Regla |
|---|---|---|
| all | Para ti | Todos los eventos (no hay personalización real en el prototipo) |
| amigos | Lo que repostea tu gente | `fr === true` |
| rumba | Rumba | `tags` incluye `rumba` |
| conciertos | Conciertos | `tags` incluye `conciertos` |
| gratis | Gratis | `tags` incluye `gratis` (coincide con los 7 eventos de `p = 0`) |
| comida | Comida | `tags` incluye `comida` |
| deporte | Deporte | `tags` incluye `deporte` |
| teatro | Arte y teatro | `tags` incluye `teatro` |

**Conteos que muestran los chips de ciudad según la categoría** (medidos en Chromium; la línea de resultados con "Toda Colombia" dice "{total} en {ciudades con eventos}"):

| Categoría | Toda Colombia | Bogotá | Medellín | Cali | Barranquilla | Cartagena | Santa Marta | Bucaramanga | Pereira | Villavicencio | Pasto | Leticia | Línea de resultados |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Para ti | 19 | 6 | 3 | 2 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | "19 planes en 11 ciudades este finde" |
| Lo que repostea tu gente | 8 | 4 | 1 | 1 | 0 | 1 | 1 | 0 | 0 | 0 | 0 | 0 | "8 planes en 5 ciudades este finde" |
| Rumba | 6 | 1 | 2 | 1 | 0 | 1 | 1 | 0 | 0 | 0 | 0 | 0 | "6 planes en 5 ciudades este finde" |
| Conciertos | 7 | 2 | 0 | 1 | 1 | 0 | 0 | 0 | 1 | 1 | 1 | 0 | "7 planes en 6 ciudades este finde" |
| Gratis | 7 | 2 | 0 | 0 | 1 | 0 | 0 | 0 | 1 | 1 | 1 | 1 | "7 planes en 6 ciudades este finde" |
| Comida | 3 | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 1 | "3 planes en 3 ciudades este finde" |
| Deporte | 2 | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | "2 planes en 2 ciudades este finde" |
| Arte y teatro | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | "1 plan en 1 ciudad este finde" |

**Fechas (`whens`):** `hoy` = "Hoy", `finde` = "Este finde" (inicial), `semana` = "Próxima semana". Sin regla de filtrado.

**Destinos del repost (`targetDefs`, `:362-371`):**

| id | Etiqueta | Descripción | Texto en el aviso (`where`) |
|---|---|---|---|
| feed | En mi feed | Lo ven todos tus seguidores | "tu feed" |
| parche | En un parche | Salseros de jueves · 12 miembros | "el parche Salseros de jueves" |
| amigos | Solo a amigos cercanos | Una lista que tú eliges | "tus amigos cercanos" |

"Salseros de jueves" con 12 miembros coincide con el Chat (`Chat.dc.html:609-610`) y con "12 miembros · 2 nuevos" de Main.

**Estado inicial (`:224`):** `{ filter: 'all', city: 'all', when: 'finde', saved: {}, reposted: { e2: true }, modal: null, target: 'feed', toast: '' }`.

**Usuario:** Camila, avatar "CV" con fondo `#8FD3D0` (encabezado y ventana).


---
Ver también: [5. Responsive](../05-responsive.md) · [6. Estados interactivos](../06-estados-interactivos.md) · [8. Detalles finos](../08-detalles-finos.md)
