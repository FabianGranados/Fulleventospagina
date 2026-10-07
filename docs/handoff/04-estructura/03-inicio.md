[← Índice del handoff](../README.md)

## 4.5 Inicio (feed) (`Main.dc.html`)

**Ruta propuesta:** `/inicio` (el filtro de pestaña y de ciudad hoy es estado interno y la URL no cambia; se recomienda reflejarlo como `/inicio?pestana=parches&ciudad=medellin` para poder compartir y volver al mismo punto, ver H42) · **Quién la ve:** usuario con sesión (en el ejemplo, Camila Vargas, `@camivargas`). Un visitante sin sesión nunca debe llegar aquí: debe ir a `/` o a la pantalla "Entrar" (H33, H12) · **Propósito:** es la pantalla principal del usuario con sesión: ver a qué planes va su gente (publicaciones con un evento adjunto), unirse a parches abiertos, marcar "Voy", filtrar el feed por tipo y por ciudad, y saltar a la agenda, el mapa, los mensajes y el perfil. En el lienzo el tablero se llama "3 · Inicio · Feed social" (1280 × 2520, `data-props='{"$preview":{"width":1280,"height":2520}}'`).

- `<title>`: "Fulleventos · Inicio". `<html lang="es">`.
- Fuentes (Google Fonts, `display=swap`, con `preconnect` solo a `fonts.googleapis.com`): **Archivo** 800 y 900; **DM Sans** con eje óptico `opsz 9..40` en pesos 400, 500 y 700. No se carga nada más.
- Estilos globales del `<helmet>` (las únicas reglas de hoja de estilo; todo lo demás es inline):
  - `body{margin:0;background:#FBF7F3}`
  - `a{color:#17120F;text-decoration:none}a:hover{color:#C23A24}` (el hover solo se ve en los enlaces que **no** tienen `color` inline; ver "Estados e interacciones").
  - `button{font-family:inherit;cursor:pointer}` (no hereda `font-size` ni `line-height`).
  - `input,select{font-family:inherit}` (no heredan `color`).
- **No hay** `@media`, `@container`, `transition`, `animation`, `prefers-reduced-motion`, reglas de `:focus-visible` ni `<meta name="viewport">` (H35). Todo el comportamiento responsive sale de `flex-wrap` y de las bases `flex` (ver "Comportamiento responsive").
- **No hay** `* { box-sizing: border-box }`: casi todo usa `content-box`, así que varios tamaños renderizados son mayores que el valor del código (anillo de historia 74 px, placa de fecha 62 × 43 px, avatares de "van" 28 px). Este documento da siempre el código **y** el tamaño renderizado; en producción hay que reproducir el tamaño renderizado.
- **Unidades:** el contenedor raíz fija `font-size: 15px`, pero los `rem` se calculan sobre la raíz del documento (16 px). Por eso `.95rem` = 15,2 px y no 14,25 px. Todas las conversiones de este documento usan 16 px por rem.

### Navegación de entrada y salida

| Elemento | Destino | Notas |
|---|---|---|
| **Entrada:** "Entrar" en el encabezado de Bienvenida (`Bienvenida.dc.html:53`) y en el bloque "¿Ya tienes cuenta? Entrar" (`:260`) | `Main.dc.html` → `/inicio` | En el prototipo entra directo al feed, sin inicio de sesión. Producción: pasar por `/entrar` (H12, H33). |
| **Entrada:** "Entrar" del encabezado de Registro (`Registro.dc.html:24`) | `/inicio` | Igual que el anterior. |
| **Entrada:** "Ir a mi feed" (paso 3 de Registro, `Registro.dc.html:104`) | `/inicio` | Final del registro. |
| **Entrada:** logo "fulleventos" de Agenda, Mapa, Chat, Evento y Perfil | `/inicio` | En Bienvenida y Registro el logo lleva a `/`. |
| **Entrada:** ícono "Inicio" del encabezado de Agenda, Mapa, Chat y Evento | `/inicio` | |
| **Entrada:** "Volver al feed" (Evento `:29`, Perfil `:23`) | `/inicio` | Siempre va a Inicio aunque el usuario venga de otra pantalla (H41: debe volver al origen). |
| **Entrada:** "Ver en mi feed" del aviso de repost de Agenda (`Agenda.dc.html:112`) | `/inicio` | El repost no aparece en el feed del prototipo (en producción sí debe aparecer). |
| Logo "fulleventos" | `Main.dc.html` (la misma pantalla) | Recarga Inicio. |
| Ícono "Inicio" del encabezado (`aria-current="page"`) | `Main.dc.html` | Página actual. |
| Ícono "Agenda de eventos" | `Agenda.dc.html` → `/agenda` | |
| Ícono "Mapa de eventos" | `Mapa.dc.html` → `/mapa` | |
| Ícono "Mensajes, 3 sin leer" | `Chat.dc.html` → `/mensajes` | El Chat abre con la conversación "Salseros de jueves" (`openId: 'salseros'`) y, en celular, en la lista. |
| Botón "Notificaciones" (campana) | Ninguno | Sin `onClick` (H38, H54). |
| Botón "Crear evento" | Ninguno | Sin `onClick` ni `type="button"` (H38, H14). |
| Avatar "CV" del encabezado (`aria-label="Tu perfil"`) | `Perfil.dc.html` → `/perfil/camivargas` (propio: `/yo`, H46) | Perfil se ve como perfil ajeno, con "Seguir" (H46). |
| Tarjeta de perfil de la columna izquierda (avatar + "Camila Vargas" + "@camivargas") | `Perfil.dc.html` | Todo el bloque es un solo enlace. |
| Menú "Secciones" → "Inicio" (`aria-current="page"`) | `Main.dc.html` | |
| Menú → "Explorar agenda" | `Agenda.dc.html` | |
| Menú → "Mapa de eventos" (insignia "Nuevo") | `Mapa.dc.html` | |
| Menú → "Mis parches" | `#parches` (ancla en la misma página) | Salta a la tarjeta "Tus parches" de la columna izquierda. La tarjeta queda **debajo** del encabezado fijo (ver "Detalles finos"). |
| Menú → "Mensajes" (`aria-label="Mensajes, 3 sin leer"`) | `Chat.dc.html` | |
| Menú → "Guardados" | `Perfil.dc.html` | Perfil **no** tiene pestaña "Guardados": abre en "Próximos planes". |
| Menú → "Recuerdos" | `Perfil.dc.html` | Abre en "Próximos planes", no en "Recuerdos" (el estado inicial de Perfil es `tab: 'planes'`). |
| "Tus parches": "Salseros de jueves", "Rockeros del Arena", "Clásico capitalino" | `Chat.dc.html` | Los tres abren el Chat en "Salseros de jueves". Producción: la conversación de cada parche, `/mensajes/:conversacion` (H42). |
| Historias (8, incluida "Tu plan") | `Evento.dc.html` → `/evento/:ciudad/:slug` | Todas abren el mismo evento (la salsa). "Sube tu plan" también abre Evento en lugar del compositor (H36). |
| Avatar y nombre del autor de cada publicación | `Perfil.dc.html` | Todos abren el perfil de Camila (H46). |
| Título del evento adjunto en cada publicación | `Evento.dc.html` | Siempre el mismo evento (H36). La foto del evento **no** es enlace. |
| "Ver en el mapa" (franja de ciudad) | `Mapa.dc.html` | Abre en "Toda Colombia", no en la ciudad elegida (H42). |
| "Ver todo Colombia" (franja de ciudad y estado vacío) | Estado interno: `city = 'all'` | No navega. Texto a corregir (H62). |
| "Ver {ciudad} en el mapa" (estado vacío) | `Mapa.dc.html` | Abre en "Toda Colombia" (H42). |
| "Más opciones", "Comentarios", "Compartir", "Guardar evento" (cada publicación) | Ninguno | Sin `onClick` (H38). |
| "Etiquetar evento", "Armar parche", "Foto", "Reseña", "Publicar" (compositor) | Ninguno | Sin `onClick` (H38). |
| "Tu semana": 3 planes | `Evento.dc.html` | Los tres abren el mismo evento (H36). |
| Tarjeta "Mapa de eventos" (mini-mapa + "Ver qué pasa en todo el país") | `Mapa.dc.html` | Un solo enlace que envuelve el mini-mapa y el botón. |
| "Gente con tus gustos": avatar y nombre | `Perfil.dc.html` | Abren el perfil de Camila (H46). |
| "Tendencias en Colombia" (5 enlaces) | `Agenda.dc.html` | Sin filtro: Agenda abre en "Toda Colombia" y "Todo". Producción (propuesta, no la pide la auditoría): Agenda con la ciudad de la tendencia (`/agenda?ciudad=…`, parámetro ya propuesto para Agenda junto con `categoria` y `fecha`); los temas ("Fútbol", "Salsa", "Gratis"…) no coinciden con las categorías de Agenda, así que hay que definir cómo se filtran. |

### Estructura sección por sección

**Contenedor raíz (envuelve todo):** `div` con `min-height: 100vh; background: #FBF7F3; color: #17120F; font-family: 'DM Sans', system-ui, sans-serif; font-size: 15px; line-height: 1.5` (22,5 px). Alto total de la página: 2519 px a 1280; 4771 px a 768; 6224 px a 390.

**Orden de los bloques:** encabezado fijo → `<main>` con tres columnas: `aside "Tu cuenta"` (perfil, menú, parches) → `section "Feed"` (historias, compositor, pestañas, franja de ciudad o estado vacío, publicaciones) → `aside "Descubre"` (Tu semana, mapa, gente, tendencias, texto legal). **No hay `<footer>`.**

**Mapa de componentes: qué se reutiliza del código base y qué se crea**

El código base del cliente es `diseno/referencia/preview-demo.html`. De ahí se reutilizan:
- los tokens de `:root`: `--bg #FBF7F3`, `--surface #FFFFFF`, `--ink #17120F`, `--muted #6E6259`, `--line #EAE1D8`, `--brand #D9452F`, `--yellow #F6DC6A`, `--peach #F3B27E`, `--pink #EE93BC`, `--hero #140E10`, `--display` (Archivo) y `--ui` (DM Sans);
- `.wrap` (`max-width: 1240px` + 24 px laterales);
- la regla `:focus-visible { outline: 3px solid var(--brand); outline-offset: 2px; }`, cambiando el color a `#C23A24` como en `Evento.dc.html:19`.

**Ojo al reutilizar el código base** (diferencias de fondo con el prototipo de Inicio):
- El código base tiene `* { box-sizing: border-box; margin: 0; padding: 0; }` y `body { font-size: 16px; line-height: 1.5 }`. El prototipo de Inicio no tiene reset (todo en `content-box`) y fija 15 px en el contenedor raíz. Al usar el reset del código base hay que recalcular las medidas para conservar lo renderizado (ver "Detalles finos", punto 3) y fijar 15 px como tamaño base de esta pantalla.
- El código base trae estados *hover* que el prototipo **no** tiene: `.chip:hover { border-color: var(--ink) }`, `.btn-dark:hover { background: #33291F }`, `.join:hover` (igual que presionado: tinta) y `--brand-hover: #BF3923` en `.search .go:hover`. Si se reutilizan esas clases, decidir explícitamente si se conservan (el prototipo solo tiene `a:hover { color: #C23A24 }`).
- El buscador del código base pinta el placeholder en `#9A8E85` (3,19:1 sobre blanco, no cumple); el prototipo usa el gris por defecto (#757575) y la auditoría pide #6E6259 (H52). No heredar `#9A8E85`.

| Componente | Origen | Dónde se usa en Inicio | Notas |
|---|---|---|---|
| Encabezado de la app con sesión | **Adaptar** `.top`, `.logo`, `.search`, `.city` y `.btn-dark` del código base | Sección 1 | Es el mismo encabezado de Agenda, Mapa y Chat (solo cambian el placeholder y el ícono marcado). Un solo componente para todos (H41). Diferencias con el código base: `.logo` pasa de 1.6rem a 1.55rem; `.search` pierde el botón `.go`, la sombra `0 1px 2px rgba(23,18,15,.04)` y su `padding: 5px 5px 5px 18px` (aquí `0 6px 0 16px` con alto fijo de 44 px), y su `max-width` pasa de 480 a 500 px; `.search .city` pasa de `gap: 6px; padding-left: 14px` a `gap: 4px; padding-left: 10px` y cambia el texto fijo de ciudad por un `<select>`; `.top` tiene `z-index: 20` y `top: env(safe-area-inset-top, 0px)` en el código base frente a `z-index: 5` y `top: 0` aquí, y aquí se agrega `border-bottom: 1px solid #EAE1D8`; la altura deja de ser fija (76 px) y sale del padding (68 px + borde). El código base ya trae un comportamiento móvil útil para H40: a ≤ 820 px oculta `.nav a` y manda el buscador a una fila propia (`order: 3; flex-basis: 100%`), y a ≤ 520 px baja el margen lateral a 16 px y oculta el texto de ciudad. |
| Botón de ícono de navegación (44 × 44, radio 12) con estado actual | **Nuevo** | Sección 1 | Variante "actual": fondo #17120F e ícono blanco. |
| Insignia de conteo (rojo #C23A24) | **Nuevo** | Secciones 1 y 4 | Dos tamaños: 18 px (sobre ícono) y 22 px (en menú). |
| Avatar de iniciales (círculo) | **Reutilizar** `.av` y las clases `.c1`–`.c6` | Secciones 1, 3, 6, 7, 11 y 14 | Colores: `.c1` #F3B27E, `.c2` #A3A8F0, `.c3` #EE93BC, `.c4` #B9E07A, `.c5` #F6DC6A, `.c6` #8FD3D0. Tamaños usados: 40, 42 y 48 px. En el código base `.av` mide 34 px, lleva `border: 2px solid var(--hero)`, `margin-left: -9px` y `font-size: .72rem`: en Inicio los avatares sueltos no tienen borde ni margen negativo (anularlos). |
| Avatar cuadrado de parche (36 px, radio 10, Archivo 900) | **Nuevo** | Sección 5 | El Chat usa el mismo patrón para los grupos (cuadrado, Archivo 900, mismo color por parche), pero a 44–48 px con radio 14 px (`Chat.dc.html:706`). Un solo componente con tamaños. |
| Grupo de avatares superpuestos | **Reutilizar** `.avs` y `.going .av` | Sección 11 | En el código base el solape es −7 px; en Inicio es −8 px. El contenedor `.going` del código base usa `font-size: .78rem` y `margin-top: 10px`; en Inicio, `.8rem` y `margin-top: 8px` (en la fila padre). En Inicio los círculos no llevan iniciales. |
| Chip de filtro con `aria-pressed` | **Reutilizar** `.chip` y `.chip[aria-pressed="true"]` | Sección 8 | Inicio usa `height: 38px; padding: 0 16px; font-size: .88rem`; el código base usa `padding: 9px 16px; font-size: .9rem`. |
| Botón píldora alternable ("Voy/Vas", "Seguir/Siguiendo") | **Adaptar** `.join` | Secciones 11 y 14 | Ojo: en "Seguir" la lógica de colores está **invertida** respecto a `.join` (apagado = tinta, encendido = blanco). Es el mismo patrón de "Seguir" de Registro (40 px), Perfil (44 px) y Evento (38 px): crear un único componente con tamaños. |
| Tarjeta blanca de columna (`--surface`, borde `--line`, radio 20) | **Reutilizar** `.people` | Secciones 3, 5, 7, 13, 14 y 15 | `.people` usa `padding: 20px` y `align-self: start`; en Inicio el padding es 18 px (16 px 18 px en el compositor). |
| Fila de persona con botón | **Adaptar** `.act` | Sección 14 | `.act` del código base: `padding-block: 12px`, `border-top: 1px solid var(--line)`, `align-items: flex-start`, avatar de 36 px y texto .88rem. En Inicio: `padding: 8px 0`, **sin** borde superior, `align-items: center`, avatar de 40 px, nombre .9rem y motivo .78rem. |
| Marcador de foto con degradado radial + placa de fecha | **Reutilizar** `.card .img` y `.date` | Sección 11 | Degradado: 58 % en Inicio frente a 55 % en el código base. Placa: `min-width: 44px`, `top/left: 10px`, día 1.2rem y mes .64rem en Inicio, frente a 46 px, 12 px, 1.25rem y .66rem. La foto del código base usa `aspect-ratio: 4 / 3`; en Inicio es `min-height: 150px` y se estira al alto de la información. |
| Categoría en mayúsculas | **Reutilizar** `.cat` | Sección 11 | Color #C23A24 en lugar de `--brand` #D9452F. |
| Lugar del evento | **Reutilizar** `.where` | Sección 11 | |
| Antetítulo en mayúsculas | **Reutilizar** `.eyebrow` | Sección 5 ("Tus parches") | .78rem en lugar de .74rem; color #C23A24. |
| Etiqueta amarilla | **Reutilizar** `.tag` | Sección 12 ("Tu semana") | .8rem, `padding: 3px 9px`, sin `margin-left` ni `letter-spacing`. |
| Nota "Contenido de ejemplo" | **Reutilizar** `.sample` | Sección 16 | .76rem en lugar de .78rem. |
| Ícono de corazón | **Reutilizar** el SVG `heart` del código base | Sección 11 ("Me gusta") | Mismo `path`. |
| Historias (fila con anillo) | **Nuevo** | Sección 6 | |
| Compositor "Publicar un plan" | **Nuevo** | Sección 7 | |
| Tarjeta de publicación (cabecera, texto, calificación, evento adjunto horizontal, bloque de parche, barra de acciones) | **Nuevo** | Sección 11 | El "evento adjunto" es una variante horizontal de la tarjeta de evento de Agenda: compartir los subcomponentes. |
| Barra de progreso de cupos | **Nuevo** | Sección 11 | Comparte estilo con la barra de Registro (allí 6 px; aquí 8 px). |
| Franja de ciudad y estado vacío | **Nuevo** | Secciones 9 y 10 | |
| Tarjeta oscura "Tu semana" | **Nuevo** | Sección 12 | |
| Mini-mapa de Colombia | **Nuevo**, compartido con Bienvenida y Mapa | Sección 13 | Mismo `path` del contorno y las mismas posiciones de ciudad. |
| Lista de tendencias | **Nuevo** | Sección 15 | |
| Pie legal | **Adaptar** el `footer` del código base | No existe en Inicio | Hay que agregarlo (H5). Ojo: el texto del pie del código base ("© 2026 Fulleventos · Bogotá, Colombia" y "Las boletas se compran en las boleteras oficiales. Fulleventos no vende entradas.") contradice el de Inicio ("Compra segura dentro de Fulleventos…"): no copiarlo; el texto depende del modo de compra (H1). |

**Íconos SVG de la pantalla** (todos `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `stroke-width="2"`, `stroke-linecap="round"`, `stroke-linejoin="round"` y `aria-hidden="true"`, salvo donde se indica). Son íconos de trazo, nunca emoji.

| Ícono | Representa | Dónde | Tamaño | Formas |
|---|---|---|---|---|
| Lupa | Buscar | Buscador (trazo #6E6259, sin `linejoin`) y menú "Explorar agenda" | 18 | `circle cx=11 cy=11 r=7` + `path d="m20 20-3.5-3.5"` |
| Pin de ubicación | Ciudad | Selector de ciudad (`currentColor`, sin `linejoin`) y franja de ciudad (trazo #C23A24, sin `linejoin`) | 16 | `M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z` + `circle cx=12 cy=10 r=2.5` |
| Casa | Inicio | Encabezado (20) y menú (18) | 20/18 | `M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z` |
| Calendario | Agenda / etiquetar evento | Encabezado (20) y compositor (16) | 20/16 | `rect x=3 y=5 width=18 height=16 rx=2` + `M3 10h18M8 3v4M16 3v4` |
| Mapa plegado | Mapa | Encabezado (20), menú (18) y "Ver en el mapa" (15) | 20/18/15 | `M9 4 3 6.5V20l6-2.5 6 2.5 6-2.5V4l-6 2.5z` + `M9 4v13.5M15 6.5V20` |
| Burbuja de chat | Mensajes / comentarios | Encabezado (20), menú (18) y acciones (20) | 20/18 | `M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z` |
| Campana | Notificaciones | Encabezado | 20 | `M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9` + `M10.3 21a1.9 1.9 0 0 0 3.4 0` |
| Dos personas | Mis parches | Menú | 18 | `circle 9,8 r3.5` + `circle 17,9 r2.5` + `M2.5 20a6.5 6.5 0 0 1 13 0M15 14.5a5 5 0 0 1 6.5 5` |
| Marcador | Guardados / guardar evento | Menú (18) y acciones (20) | 18/20 | `M6 3h12v18l-6-4-6 4z` |
| Imagen con montañas | Recuerdos | Menú | 18 | `rect x=3 y=5 width=18 height=14 rx=2` + `m3 15 5-4 4 3 3-2 6 4` |
| Persona con "+" | Armar parche | Compositor | 16 | `circle 9,8 r3.5` + `M2.5 20a6.5 6.5 0 0 1 13 0M19 8v6M16 11h6` |
| Foto | Foto | Compositor | 16 | `rect x=3 y=5 width=18 height=14 rx=2` + `circle 9,10 r1.5` + `m21 16-5-5-9 8` |
| Estrella | Reseña (trazo) y calificación (relleno `currentColor`, sin trazo) | Compositor (16) y publicación (18) | 16/18 | `m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z` |
| Tres puntos | Más opciones | Publicación | 18 | `fill="currentColor"`, sin trazo: `circle cx=5/12/19 cy=12 r=1.8` |
| Corazón | Me gusta | Publicación | 20 | `fill` dinámico, solo `stroke-linejoin="round"` (sin `linecap`): `M12 20s-7-4.4-9.2-8.6C1.3 8.4 3.2 5 6.6 5c2 0 3.4 1.1 4.4 2.5C12 6.1 13.4 5 15.4 5c3.4 0 5.3 3.4 3.8 6.4C19 15.6 12 20 12 20z` |
| Bandeja con flecha | Compartir | Publicación | 20 | `M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v13` |
| Flecha a la derecha | Ir al mapa | Botón "Ver qué pasa en todo el país" | 14 | `stroke-width="2.6"`: `M5 12h14M13 6l6 6-6 6` |

#### 1. Encabezado (`<header>`, fijo)

- **Layout:**
  - `<header>`: `position: sticky; top: 0; z-index: 5; background: #FBF7F3; border-bottom: 1px solid #EAE1D8`. Sin sombra.
  - Contenedor interno: `max-width: 1240px; margin: 0 auto; padding: 12px 24px; display: flex; flex-wrap: wrap; align-items: center; gap: 12px 20px` (12 px entre filas, 20 px entre columnas).
  - Alto renderizado (incluye 1 px de borde): **69 px** desde 908 px de ancho; 125 px de 482 a 906 px; 171 px de 454 a 480 px; 220 px de 432 a 452 px; **224 px** hasta 430 px (a 390 × 844 ocupa el 26,6 % de la pantalla, H40).
- **Contenido en orden:**
  1. **Logo:** enlace con el texto "fulleventos" (en minúsculas en el código) a `Main.dc.html`. DM Sans 700, `font-size: 1.55rem` (24,8 px), `letter-spacing: -0.03em` (−0,744 px), `line-height` 1,5 (37,2 px), color #D9452F. Mide 124,9 × 37,2 px. Es el único uso del rojo de marca #D9452F en la pantalla.
  2. **Buscador** (`div role="search"`): `flex: 1 1 260px; max-width: 500px; min-width: 0; display: flex; align-items: center; gap: 10px; background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 999px; padding: 0 6px 0 16px; height: 44px; box-sizing: border-box`. A 1280 y 768 px mide 500 × 44; a 390 px, 342 × 44.
     - `label` del texto (`flex: 1; min-width: 0; display: flex; align-items: center; gap: 10px`):
       - ícono de lupa de 18 px, trazo #6E6259, `flex-shrink: 0`;
       - `<input type="search" placeholder="Busca planes, gente o lugares" aria-label="Buscar">` con `flex: 1; min-width: 0; border: 0; outline: 0; background: transparent; font-size: .95rem` (15,2 px); color #17120F. El placeholder usa el gris por defecto del navegador (#757575). No tiene `name`, ni formulario, ni manejador: escribir o pulsar Enter no hace nada.
     - `label` de ciudad: `display: flex; align-items: center; gap: 4px; padding-left: 10px; border-left: 1px solid #EAE1D8; font-size: .9rem` (14,4 px); `white-space: nowrap; flex-shrink: 0`. Mide 153 × 36 px.
       - ícono de pin de 16 px (color #17120F);
       - texto oculto "Ciudad" (`position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap`);
       - `<select name="ciudad">` con `height: 36px; max-width: 8.6em` (123,84 px); `border: 0; background: transparent; font-size: .9rem` (14,4 px); `font-weight: 500`; color #17120F; `cursor: pointer`. Flecha nativa del sistema (sin `appearance: none`). Mide 122 × 36 px con "Toda Colombia".
       - Opciones (valor → texto): `all` → "Toda Colombia", `bogota` → "Bogotá", `medellin` → "Medellín", `cali` → "Cali", `barranquilla` → "Barranquilla", `cartagena` → "Cartagena", `santamarta` → "Santa Marta", `bucaramanga` → "Bucaramanga", `pereira` → "Pereira", `villavicencio` → "Villavicencio", `pasto` → "Pasto", `leticia` → "Leticia".
  3. **Navegación** (`<nav aria-label="Principal">`): `margin-left: auto; display: flex; flex-wrap: wrap; justify-content: flex-end; align-items: center; gap: 6px`. Mide 433,3 × 44 px en una fila.
     - **Cuatro enlaces de ícono:** `width: 44px; height: 44px; border-radius: 12px; display: grid; place-items: center`. Íconos de 20 px.
       - "Inicio": `aria-label="Inicio"`, `aria-current="page"`, `background: #17120F; color: #FFFFFF` (casa blanca sobre tinta).
       - "Agenda de eventos": calendario, color #17120F.
       - "Mapa de eventos": mapa plegado.
       - "Mensajes, 3 sin leer": burbuja, `position: relative`. Lleva la insignia `<span aria-hidden="true">3</span>`: `position: absolute; top: 6px; right: 6px; min-width: 18px; height: 18px; box-sizing: border-box; border-radius: 9px; background: #C23A24; color: #FFFFFF; font-size: .66rem` (10,56 px); `font-weight: 700; line-height: 1; display: grid; place-items: center; padding: 0 4px`. Mide 18 × 18 px.
     - **Botón "Notificaciones"** (`aria-label="Notificaciones"`): 44 × 44, `border-radius: 12px; border: 0; background: transparent; color: #17120F; display: grid; place-items: center`. Campana de 20 px. Sin acción.
     - **Botón "Crear evento":** `height: 44px; border: 0; border-radius: 999px; padding: 0 18px; background: #17120F; color: #FFFFFF; font-weight: 700; font-size: .9rem` (14,4 px); `margin-left: 6px` (queda a 12 px de la campana). Mide 127,3 × 44. Sin acción y sin `type="button"`.
     - **Avatar "CV"** (enlace a Perfil, `aria-label="Tu perfil"`): `width: 40px; height: 40px; border-radius: 50%; background: #8FD3D0; display: grid; place-items: center; font-weight: 700; font-size: .78rem` (12,48 px); color #17120F; `margin-left: 4px` (queda a 10 px de "Crear evento").
- **Datos dinámicos:**
  - El `<select>` está atado a `state.city` (`value="{{city}}"`), que arranca en `'all'` ("Toda Colombia"). Al cambiar, `pickCitySelect` hace `if (v) this.setState({ city: v })` con `v = ev.target.value`.
  - El "3" de mensajes y el `aria-label="Mensajes, 3 sin leer"` son fijos. En producción vienen del conteo real de no leídos, que es el mismo número que muestra el menú lateral (sección 4).
  - El placeholder del buscador es distinto en cada pantalla: "Busca planes, gente o lugares" en Inicio y Chat, "Busca eventos, lugares o artistas" en Agenda y Mapa, y "¿Qué plan buscas?" en Bienvenida (H41).
- **Componente:** "Encabezado de la app" (ver el mapa de componentes). Es idéntico al de Agenda salvo el placeholder, el `aria-label` del buscador ("Buscar" frente a "Buscar eventos") y cuál ícono lleva `aria-current`. El de Mapa, además, usa `z-index: 70` (aquí 5) y `padding: 12px clamp(16px, 4vw, 24px)` (aquí 24 px fijos); el de Chat usa `z-index: 5`. Al unificarlo (H41), fijar un solo `z-index` y un solo margen lateral.

#### 2. Contenedor principal y reparto en columnas (`<main>`)

- **Layout:**
  - `<main>`: `max-width: 1240px; margin: 0 auto; padding: 24px 24px 64px; display: flex; flex-wrap: wrap; align-items: flex-start; gap: 24px`. Como `max-width` se aplica en `content-box`, el ancho máximo total es 1288 px; desde ahí el contenido se centra (a 1440 px empieza en x = 100).
  - Tres hijos:

    | Hijo | `flex` | `max-width` | Dirección | Separación interna |
    |---|---|---|---|---|
    | `<aside aria-label="Tu cuenta">` | `1 1 220px` | 260px | columna | `gap: 16px` |
    | `<section aria-label="Feed">` | `999 1 520px` | — (`min-width: 0`) | columna | `gap: 18px` |
    | `<aside aria-label="Descubre">` | `1 1 280px` | 340px | columna | `gap: 16px` |

  - Con `flex-grow` 999 frente a 1, casi todo el espacio sobrante va al feed. Medidas a 1280 px: columna izquierda x = 24, 220,2 px; feed x = 268,2, 683,7 px; columna derecha x = 975,8, 280,2 px. Las tres arrancan en y = 93.
  - Las columnas **no son fijas** (no tienen `sticky`): se desplazan con la página. A 1280 px la izquierda termina en y ≈ 821 y la derecha en y ≈ 1604, mientras el feed sigue hasta y ≈ 2454. Debajo de las columnas laterales queda fondo crema vacío.
- **Contenido en orden:** columna izquierda (secciones 3 a 5), feed (6 a 11), columna derecha (12 a 16).
- **Datos dinámicos:** ninguno.
- **Componente:** "Layout de tres columnas" nuevo, con `.wrap` del código base. Ver en "Correcciones obligatorias" (H15) cómo debe cambiar en celular y tableta.

#### 3. Columna izquierda · Tarjeta de perfil

- **Layout:** `background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 20px; padding: 18px; display: flex; flex-direction: column; gap: 14px`. Sin sombra. Mide 220,2 × 147,7 px a 1280 (260 × 147,7 a 390 y 768).
- **Contenido en orden:**
  1. **Enlace a Perfil** (`display: flex; align-items: center; gap: 12px`), que contiene:
     - el avatar "CV": 48 × 48, `border-radius: 50%`, fondo #8FD3D0, `display: grid; place-items: center; font-weight: 700`, 15 px heredados, color #17120F;
     - una columna (`display: flex; flex-direction: column; line-height: 1.25`) con:
       - "Camila Vargas" en `<b>`: DM Sans 700, 15 px, `line-height` 18,75 px, #17120F;
       - "@camivargas": `color: #6E6259; font-size: .85rem` (13,6 px), `line-height` 17 px.
  2. **Estadísticas** (`display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; text-align: center`). Cada celda tiene:
     - el número en `<b style="display:block; font-size: 1.05rem">` (16,8 px, 700, `line-height` 25,2 px, #17120F);
     - la etiqueta `font-size: .74rem` (11,84 px), #6E6259.

     Valores: "38" "Planes", "412" "Seguidores", "289" "Siguiendo".
- **Datos dinámicos:** ninguno (todo es texto fijo). En producción, nombre, usuario, iniciales, color del avatar y los tres contadores vienen del usuario con sesión. Ojo: Perfil llama "Eventos" a lo que aquí es "Planes" (H37).
- **Componente:** nuevo "Resumen de perfil" con el avatar `.av`/`.c6`.

#### 4. Columna izquierda · Menú "Secciones"

- **Layout:** `<nav aria-label="Secciones">` con `display: flex; flex-direction: column; gap: 2px; font-weight: 500`. Cada enlace: `display: flex; align-items: center; gap: 12px; padding: 11px 14px; border-radius: 12px`, con 15 px y `line-height` 22,5 px heredados, color #17120F e íconos de 18 px.
  - Alto: 44,5 px por ítem. "Inicio" mide 46,5 px por su borde de 1 px.
  - A 1280 px la columna mide 220 px y "Mapa de eventos" se parte en dos líneas ("Mapa de / eventos"): ese ítem mide 67 px y su ícono se comprime a 15,2 px de ancho porque el SVG no tiene `flex-shrink: 0`. A 260 px de ancho (390 y 768) cabe en una línea.
- **Contenido en orden:**
  1. **"Inicio"** (casa) a `Main.dc.html`, con `aria-current="page"`. Estado actual: `background: #FFFFFF; border: 1px solid #EAE1D8; font-weight: 700`.
  2. **"Explorar agenda"** (lupa, no calendario) a `Agenda.dc.html`.
  3. **"Mapa de eventos"** (mapa plegado) a `Mapa.dc.html`, con la insignia "Nuevo": `margin-left: auto; background: #F6DC6A; color: #17120F; border-radius: 999px; padding: 1px 8px; font-size: .7rem` (11,2 px); `font-weight: 700`. Mide 50,7 × 18,8. **No** tiene `aria-hidden`, así que el nombre accesible del enlace es "Mapa de eventos Nuevo".
  4. **"Mis parches"** (dos personas) a `#parches`.
  5. **"Mensajes"** (burbuja) a `Chat.dc.html`, con `aria-label="Mensajes, 3 sin leer"`. Insignia `<span aria-hidden="true">3</span>`: `margin-left: auto; min-width: 22px; height: 22px; box-sizing: border-box; border-radius: 999px; background: #C23A24; color: #FFFFFF; padding: 0 7px; font-size: .72rem` (11,52 px); `font-weight: 700; line-height: 1; display: grid; place-items: center`. Mide 22 × 22.
  6. **"Guardados"** (marcador) a `Perfil.dc.html`.
  7. **"Recuerdos"** (imagen) a `Perfil.dc.html`.
- **Datos dinámicos:** ninguno. El "3" es fijo y debe ser el mismo dato que la insignia del encabezado.
- **Componente:** nuevo "Menú lateral" con ítem actual e insignias (reutiliza la insignia de conteo y una "pastilla Nuevo"). Según H20 hay que agregar "Mis boletas"; según H40, en celular este menú pasa a una barra inferior.

#### 5. Columna izquierda · "Tus parches"

- **Layout:** `<div id="parches">` con `background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 20px; padding: 18px; display: flex; flex-direction: column; gap: 12px`. Mide 220,2 × 200,7 px a 1280.
- **Contenido en orden:**
  1. `<h2>` "Tus parches", que se ve "TUS PARCHES": `margin: 0; font-size: .78rem` (12,48 px); peso 700 (por defecto de `h2`); `letter-spacing: .12em` (1,50 px); `text-transform: uppercase`; color #C23A24; `line-height` 18,72 px.
  2. Tres enlaces a `Chat.dc.html` (`display: flex; align-items: center; gap: 10px`). Cada uno tiene:
     - un avatar cuadrado de 36 × 36 con `border-radius: 10px; display: grid; place-items: center; font-family: 'Archivo'; font-weight: 900; font-size: .8rem` (12,8 px) y texto #17120F;
     - un bloque de texto con `line-height: 1.25`: el nombre en `<b style="font-size: .9rem">` (14,4 px, 700, `line-height` 18 px) y debajo un `span` con `display: block; font-size: .78rem` (12,48 px); color #6E6259.

     | Iniciales | Fondo | Nombre | Subtítulo |
     |---|---|---|---|
     | "SL" | #F6DC6A | "Salseros de jueves" | "12 miembros · 2 nuevos" |
     | "RK" | #A3A8F0 | "Rockeros del Arena" | "8 miembros" |
     | "CC" | #B9E07A | "Clásico capitalino" | "4 de 6 cupos" |

- **Datos dinámicos:** ninguno; es texto fijo. No reacciona al botón "Unirme al parche" del feed: si Camila se une al "Clásico capitalino" desde la publicación, el post pasa a "5 de 6 cupos" y aquí sigue "4 de 6 cupos" (H37). Además, según el Chat, Camila **ya es miembro** de los tres parches.
- **Componente:** nuevo "Lista de parches" (avatar cuadrado + nombre + estado). En producción, el estado sale del parche: miembros, nuevos o cupos usados de cupos totales.

#### 6. Feed · Historias

- **Layout:** fila `display: flex; gap: 14px; overflow-x: auto; padding-bottom: 4px`. Ocupa todo el ancho del feed (683,7 px a 1280; 720 a 768; 342 a 390) y mide 112,4 px de alto.
  - Las 8 historias ocupan siempre **738 px** (8 × 80 + 7 × 14). Como el feed nunca pasa de 692 px, **siempre hay scroll horizontal**: a 1280 px "Dani" queda cortado; a 768 px, cortado por 18 px; a 390 px se ven 3 historias y media.
  - No hay degradado, flechas ni otra pista de que hay más. La barra de scroll no está oculta: en sistemas con barras clásicas (Windows) aparece debajo de la fila.
- **Contenido en orden** (una tarjeta por historia, en el orden de los datos):
  - **Enlace** a `Evento.dc.html` con `aria-label="{{s.aria}}"`: `flex: 0 0 auto; width: 80px; display: flex; flex-direction: column; align-items: center; gap: 6px; text-align: center`. Mide 80 × 108,4 px.
  - **Anillo:** `span` con `width: 68px; height: 68px; border-radius: 50%; padding: 3px; background: {{s.ring}}; display: grid; place-items: center`. En `content-box` mide **74 × 74 px**.
    - Laura, Andrés, Nata y Caro: `linear-gradient(135deg, #F3B27E, #D9452F)` (durazno → rojo de marca).
    - Sebas, Majo, Dani y "Tu plan": `#EAE1D8`.
    - El código no tiene un estado "vista/no vista": el anillo es un dato fijo de cada historia (`ring`). Leerlo como "sin ver" (degradado) y "vista" (gris) es la convención habitual y la interpretación recomendada para producción.
  - **Círculo interior:** `width: 100%; height: 100%; border-radius: 50%; border: 3px solid #FBF7F3; background: {{s.c}}; display: grid; place-items: center; font-weight: 700; font-size: .85rem` (13,6 px); `box-sizing: border-box`; texto #17120F. Mide 68 × 68, con 62 px de color dentro del borde crema. Muestra las iniciales, o "+" en "Tu plan".
  - **Etiqueta:** `font-size: .74rem` (11,84 px); `line-height: 1.2` (14,2 px); color #17120F. Tiene el nombre y debajo la ciudad (`span` con `display: block; color: #6E6259`). "Tu plan" no tiene ciudad: el `span` existe pero va vacío, así que esa etiqueta mide una sola línea.
- **Datos dinámicos:** lista `stories` de `renderVals()` (ver "Datos de ejemplo"). El `aria-label` se calcula así: `st.aria || ('Historia de ' + st.name + ' en ' + st.city)`. Da "Sube tu plan" en la primera y, por ejemplo, "Historia de Laura en Bogotá". El filtro de ciudad **no** afecta las historias.
- **Componente:** nuevo "Fila de historias". La primera ("Tu plan") debe abrir el compositor (H36). En producción, una historia sin ver usaría el anillo en degradado y una vista el anillo #EAE1D8 (interpretación; el prototipo no lo calcula).

#### 7. Feed · Compositor "Publicar un plan"

- **Layout:** `div role="group" aria-label="Publicar un plan"` con `background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 20px; padding: 16px 18px; display: flex; flex-direction: column; gap: 12px`. Mide 683,7 × 126 px a 1280, 720 × 126 a 768 y 342 × 214 a 390.
- **Contenido en orden:**
  1. **Fila superior** (`display: flex; align-items: center; gap: 12px`):
     - avatar "CV": 42 × 42, `flex-shrink: 0`, círculo #8FD3D0, 700, `.8rem` (12,8 px);
     - `<label>` con `flex: 1; min-width: 0`, que contiene:
       - el texto oculto "Publica tu plan" (`position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0)`; aquí **sin** `white-space: nowrap`);
       - `<input type="text" placeholder="¿Qué plan tienes, Camila? Etiqueta un evento con @">` con `width: 100%; box-sizing: border-box; height: 44px; border: 1px solid #EAE1D8; border-radius: 999px; padding: 0 16px; background: #FBF7F3; font-size: .95rem` (15,2 px); `outline: 0`. No define `color`, así que **el texto escrito sale negro #000000**, no #17120F. El placeholder es #757575 sobre crema (4,32:1). A 390 px el placeholder se corta en seco y se lee "¿Qué plan tienes, Camila? Etiq", sin puntos suspensivos.
  2. **Fila de acciones** (`display: flex; flex-wrap: wrap; gap: 8px; align-items: center`). Cuatro botones secundarios con `type="button"`: `height: 36px; border: 1px solid #EAE1D8; background: #FFFFFF; border-radius: 999px; padding: 0 14px; font-size: .84rem` (13,44 px); `font-weight: 500; display: flex; align-items: center; gap: 6px; color: #17120F`. Cada uno lleva un ícono de 16 px a la izquierda:
     - "Etiquetar evento" (calendario), 157,5 px de ancho;
     - "Armar parche" (persona con +), 139,1 px;
     - "Foto" (foto), 80,1 px;
     - "Reseña" (estrella de trazo), 97,6 px.

     Después va el botón principal **"Publicar"** (`type="button"`): `margin-left: auto; height: 36px; border: 0; background: #C23A24; color: #FFFFFF; border-radius: 999px; padding: 0 18px; font-size: .86rem` (13,76 px); `font-weight: 700`. Mide 91,4 × 36 y siempre queda alineado a la derecha de su fila.
     - Reparto: en 1 fila si el feed mide 636 px o más; en 2 filas ("Etiquetar evento", "Armar parche", "Foto", "Reseña" / "Publicar") entre 344 y 635 px. A 390 px va en 3 filas: "Etiquetar evento" / "Armar parche" + "Foto" / "Reseña" … "Publicar".
- **Datos dinámicos:**
  - El nombre del placeholder ("Camila") es fijo; en producción es el nombre de pila del usuario.
  - El campo no está atado al estado (no tiene `value` ni `onChange`): se puede escribir, pero nada se publica. Ninguno de los 5 botones hace nada (H38).
- **Componente:** nuevo "Compositor". La única acción que la auditoría pide conectar aquí es "Armar parche", que abre "Nuevo parche" del Chat (H38); para "Etiquetar evento", "Foto", "Reseña" y "Publicar" pide "Próximamente" o quitarlos mientras no tengan pantalla. El selector de evento de "Etiquetar evento" y el envío de "Publicar" no están diseñados (ver "Correcciones obligatorias").

#### 8. Feed · Pestañas de filtro

- **Layout:** `div role="group" aria-label="Filtrar feed"` con `display: flex; gap: 8px; flex-wrap: wrap`. Va en una fila desde 450 px de feed (498 px de ventana en una columna); a 390 px pasa a dos filas: "Amigos", "Parches abiertos", "Reseñas" / "Cerca de ti". Mide 38 px de alto en una fila y 84 px en dos.
- **Contenido en orden:** cuatro `<button>` (sin atributo `type`) con `aria-pressed`: `height: 38px; border-radius: 999px; padding: 0 16px; font-size: .88rem` (14,08 px); `font-weight: 500; border: 1px solid {{t.border}}; background: {{t.bg}}; color: {{t.fg}}`.

  | Texto | `id` | Ancho a 1280 |
  |---|---|---|
  | "Amigos" | `amigos` | 83,2 px |
  | "Parches abiertos" | `parches` | 145,4 px |
  | "Reseñas" | `resenas` | 88,9 px |
  | "Cerca de ti" | `cerca` | 107,1 px |

  - Activa: `aria-pressed="true"`, fondo #17120F, texto #FFFFFF, borde #17120F.
  - Inactiva: `aria-pressed="false"`, fondo #FFFFFF, texto #17120F, borde #EAE1D8.
- **Datos dinámicos:**
  - `state.tab` arranca en `'amigos'`. Al hacer clic se ejecuta `this.setState({ tab: t.id })`; volver a pulsar la pestaña activa no la apaga.
  - Una publicación se ve si `p.tags.indexOf(s.tab) !== -1` **y** `s.city === 'all' || evById[p.ev].city === s.city` (ver la matriz en "Datos de ejemplo").
  - "Cerca de ti" no usa la ubicación del usuario: es una etiqueta fija de cada publicación. En producción debe calcularse por distancia o por la ciudad del usuario.
- **Componente:** reutilizar `.chip` del código base (sin su `.chip:hover`, que el prototipo no tiene, salvo decisión explícita). La auditoría pide semántica de grupo de opciones excluyentes para las opciones de una sola respuesta (H59, medido en Evento y Mapa); aplicarla también aquí por coherencia.

#### 9. Feed · Franja de ciudad (condicional)

- **Cuándo aparece:** `showCityRow = s.city !== 'all' && !feedEmpty`, es decir, con una ciudad elegida y al menos una publicación visible. Nunca aparece junto con el estado vacío. Va entre las pestañas y la primera publicación.
- **Layout:** `display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px 16px; background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 16px; padding: 10px 10px 10px 16px`. Mide 683,7 × 60 a 1280 (una fila) y 342 × 89,6 a 390 (dos filas: el texto arriba y los botones abajo, alineados a la izquierda).
- **Contenido en orden:**
  1. **Texto** (`display: flex; align-items: center; gap: 8px; font-size: .9rem`, 14,4 px): pin de 16 px con trazo #C23A24 (`flex-shrink: 0`), seguido de "Planes de tu gente en " y el nombre de la ciudad en `<b>` (700), por ejemplo "Planes de tu gente en **Medellín**".
  2. **Botones** (`display: flex; flex-wrap: wrap; gap: 8px`):
     - Enlace **"Ver en el mapa"** a `Mapa.dc.html`: `height: 38px; box-sizing: border-box; display: inline-flex; align-items: center; gap: 6px; padding: 0 14px; border-radius: 999px; border: 1px solid #EAE1D8; font-size: .84rem` (13,44 px); `font-weight: 700`; color #17120F (hereda la regla global). Lleva el ícono de mapa plegado de 15 px a la izquierda. Mide 148,1 × 38.
     - Botón **"Ver todo Colombia"**: `height: 38px; border-radius: 999px; border: 1px solid #17120F; background: #FFFFFF; color: #17120F; padding: 0 14px; font-size: .84rem; font-weight: 700`. Mide 152,4 × 38. Ejecuta `clearCity` (`city = 'all'`).
- **Datos dinámicos:** `cityLabel = s.city === 'all' ? 'Colombia' : cityName[s.city]`. Con ciudad elegida es el nombre con tildes ("Bogotá", "Medellín", "Barranquilla"…).
- **Componente:** nuevo "Aviso de filtro activo". El texto "Ver todo Colombia" debe corregirse (H62) y "Ver en el mapa" debe abrir el mapa en esa ciudad (H42).

#### 10. Feed · Estado vacío (condicional)

- **Cuándo aparece:** `feedEmpty = posts.length === 0`. Con los datos de ejemplo solo pasa con una ciudad elegida (ver la matriz). Reemplaza a las publicaciones y a la franja de ciudad.
- **Layout:** `text-align: center; padding: 36px 16px; background: #FFFFFF; border: 1px dashed #EAE1D8; border-radius: 20px; display: flex; flex-direction: column; align-items: center; gap: 14px`. Mide 683,7 × 177 a 1280 y 342 × 276 a 390.
- **Contenido en orden:**
  1. **Mensaje** `<p>`: `margin: 0; color: #6E6259; max-width: 46ch` (472,6 px), 15 px y `line-height` 22,5 px. Texto: "Todavía nadie de tu gente ha publicado planes en {{cityLabel}} en esta pestaña. Mira lo que hay allá en el mapa o vuelve a todo Colombia." Por ejemplo: "Todavía nadie de tu gente ha publicado planes en Cali en esta pestaña. Mira lo que hay allá en el mapa o vuelve a todo Colombia."
  2. **Botones** (`display: flex; flex-wrap: wrap; justify-content: center; gap: 10px`; a 390 px quedan uno encima del otro, centrados):
     - Botón **"Ver todo Colombia"**: `height: 44px; border-radius: 999px; border: 1px solid #17120F; background: #FFFFFF; color: #17120F; padding: 0 20px; font-size: .9rem` (14,4 px); `font-weight: 700`. Mide 173 × 44. Ejecuta `clearCity`.
     - Enlace **"Ver {{cityLabel}} en el mapa"** a `Mapa.dc.html`: `height: 44px; box-sizing: border-box; display: inline-flex; align-items: center; padding: 0 20px; border-radius: 999px; background: #C23A24; color: #FFFFFF; font-size: .9rem; font-weight: 700`. **Error visible del prototipo:** como el enlace es flex y el nombre de la ciudad es un nodo aparte, se pierden los espacios y se lee **"VerCalien el mapa"** (comprobado en Chromium a 390 y 1280 px). Debe decir "Ver Cali en el mapa".
- **Datos dinámicos:** `emptyMsg = 'Todavía nadie de tu gente ha publicado planes en ' + cityLabel + ' en esta pestaña. Mira lo que hay allá en el mapa o vuelve a todo Colombia.'`. Si el feed quedara vacío con "Toda Colombia" (no pasa con los datos de ejemplo), diría "…en Colombia…", "Ver todo Colombia" no haría nada y el enlace diría "Ver Colombia en el mapa". En producción hay que diseñar ese caso aparte, por ejemplo "Sigue a más gente".
- **Componente:** nuevo "Estado vacío con acciones" (el mismo patrón sirve para Agenda y Mapa).

#### 11. Feed · Publicación (tarjeta de post)

- **Layout de la tarjeta:** `<article>` con `background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 20px; overflow: hidden`. Sin sombra. Separación entre publicaciones: 18 px (el `gap` del feed). Alto a 1280 px:
  - 351,5 px para una publicación simple (Laura, Natalia);
  - 440,3 px con bloque de parche (Andrés, Sofía);
  - 375,5 px con calificación (Juan Pablo).

  La tarjeta no tiene encabezado `<h3>` (H59).
- **Contenido en orden:**

  **11.1 Cabecera** (`padding: 16px 18px 0; display: flex; align-items: flex-start; gap: 12px`):
  1. Avatar enlace a `Perfil.dc.html` con `aria-label="Perfil de {{p.name}}"`: 42 × 42, `flex-shrink: 0; border-radius: 50%; background: {{p.c}}; display: grid; place-items: center; font-weight: 700; font-size: .8rem` (12,8 px); texto #17120F con las iniciales.
  2. Bloque de texto (`flex: 1; min-width: 0; line-height: 1.35`):
     - primera línea: enlace con el nombre (`font-weight: 700`, 15 px, `line-height` 20,25 px, a `Perfil.dc.html`), un espacio y la acción en `span` #6E6259, por ejemplo "**Laura Martínez** va a un evento";
     - segunda línea: tiempo y ciudad, `font-size: .8rem` (12,8 px), #6E6259, por ejemplo "Hace 1 h · Bogotá".

     A 390 px la primera línea se parte ("Laura Martínez va a un / evento").
  3. Botón **"Más opciones"** (`aria-label="Más opciones"`): 36 × 36, `border: 0; background: transparent; border-radius: 50%; color: #6E6259; display: grid; place-items: center`. Tres puntos de 18 px. Sin acción.

  **11.2 Texto:** `<p>` con `margin: 10px 18px 14px; font-size: .97rem` (15,52 px) y `line-height` 1,5 (23,28 px), color #17120F. Sin límite de líneas ni truncado.

  **11.3 Calificación** (solo si `p.hasStars`, hoy solo la reseña de Juan Pablo): `div role="img" aria-label="Calificación 5 de 5"` con `margin: -6px 18px 12px; display: flex; gap: 2px; color: #E0A21B`. Tiene 5 estrellas de 18 px rellenas (`fill="currentColor"`). El margen negativo la deja a 8 px del texto. Siempre son 5 de 5: el número no es un dato.

  **11.4 Evento adjunto:**
  - Contenedor: `margin: 0 18px; border: 1px solid #EAE1D8; border-radius: 16px; overflow: hidden; display: flex; flex-wrap: wrap`.
  - **Foto** (`div role="img" aria-label="[Foto del evento]"`): `flex: 1 1 180px; min-height: 150px; position: relative; background: radial-gradient(circle at 70% 30%, {{p.bg1}} 0, transparent 58%), {{p.bg2}}` (mancha de color arriba a la derecha sobre un fondo liso). A 1280 px mide 237,2 × 150 y se estira al alto de la información (164,7 px si el lugar ocupa dos líneas).
    - **Placa de fecha:** `position: absolute; top: 10px; left: 10px; background: #FFFFFF; border-radius: 10px; padding: 5px 9px 4px; text-align: center; line-height: 1; min-width: 44px`. En `content-box` mide **62 × 43,2 px**.
      - Día en `<b>` con `display: block`: Archivo 900, `1.2rem` (19,2 px), #17120F, por ejemplo "9".
      - Mes en `span`: `font-size: .64rem` (10,24 px); `font-weight: 700; text-transform: uppercase; letter-spacing: .06em` (0,61 px); #6E6259. En el código es "oct" y se ve "OCT".
  - **Información** (`flex: 2 1 260px; padding: 14px 16px; display: flex; flex-direction: column; gap: 4px`), que mide 406,5 px a 1280:
    1. Categoría `span`: `font-size: .7rem` (11,2 px); `font-weight: 700; letter-spacing: .1em` (1,12 px); `text-transform: uppercase`; color #C23A24. Por ejemplo "Rumba" se ve "RUMBA" y "Conciertos · Gratis" se ve "CONCIERTOS · GRATIS".
    2. Título, enlace a `Evento.dc.html`: Archivo 800, `1.15rem` (18,4 px); `letter-spacing: -0.02em` (−0,368 px); `line-height: 1.15` (21,16 px); #17120F. Sin truncado: a 390 px "Noche de salsa y boleros en vivo" ocupa dos líneas.
    3. Fecha, hora y lugar en `span` (`font-size: .85rem`, 13,6 px, #6E6259): "{{p.where}} · " seguido de un `span` con la ciudad en #17120F 700. Por ejemplo "Vie 9 oct · 9:00 p. m. · Galería Café Libro, Zona T · **Bogotá**".
    4. Fila "quién va" (`display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px; margin-top: 8px`):
       - A la izquierda, un `span` con `display: flex; align-items: center; gap: 8px; font-size: .8rem` (12,8 px) y color #6E6259. Contiene 3 círculos superpuestos (`width: 24px; height: 24px; border-radius: 50%; border: 2px solid #FFFFFF`, que renderizan **28 × 28 px**), de colores #F3B27E, #A3A8F0 (`margin-left: -8px`) y #EE93BC (`margin-left: -8px`), siempre los mismos y sin iniciales. Después va el texto, por ejemplo "24 van · 3 amigos".
       - A la derecha, el botón **"Voy" / "Vas"** con `aria-pressed`: `height: 38px; border-radius: 999px; padding: 0 16px; font-size: .84rem` (13,44 px); `font-weight: 700; border: 1px solid #17120F`.
         - Apagado: fondo #FFFFFF, texto #17120F, "Voy" (58,4 px de ancho).
         - Encendido: fondo #17120F, texto #FFFFFF, "Vas" (57,7 px).
       - Por debajo de 320 px de feed el botón baja a otra línea.
  - **Apilado:** si el feed mide menos de 512 px, la foto y la información se apilan. La foto ocupa todo el ancho con 150 px de alto (302 × 150 a 390) y la información va debajo.

  **11.5 Bloque de parche** (solo si la publicación tiene `parche`):
  - Contenedor: `margin: 12px 18px 0; background: #FBF7F3; border-radius: 14px; padding: 12px 14px; display: flex; flex-wrap: wrap; align-items: center; gap: 10px 16px`. Mide 645,7 × 62 a 1280 y 304 × 106,2 a 390.
  - Izquierda (`flex: 1 1 200px`):
    - Fila `display: flex; justify-content: space-between; font-size: .84rem` (13,44 px) con "Parche: {{p.parcheName}}" en `<b>` (700, #17120F), por ejemplo "Parche: Provenza de viernes", y los cupos en `span` #6E6259, por ejemplo "5 de 8 cupos".
    - Barra: riel con `height: 8px; border-radius: 4px; background: #EAE1D8; margin-top: 6px; overflow: hidden`, y relleno con `height: 100%; width: {{p.pct}}%; background: #C23A24; border-radius: 4px`. Sin transición: el ancho cambia de golpe. No tiene `role="progressbar"`; los cupos en texto dan la misma información.
  - Derecha: botón **"Unirme al parche" / "Estás en el parche"** con `aria-pressed`: `height: 38px; border: 0; border-radius: 999px; padding: 0 16px; font-size: .84rem; font-weight: 700; background: {{p.joinBg}}; color: #FFFFFF`.
    - Apagado: #C23A24, "Unirme al parche" (143,9 px de ancho).
    - Encendido: #17120F, "Estás en el parche" (152 px).
    - El botón queda a la derecha de la barra cuando el feed mide 426 px o más; por debajo pasa a otra línea, alineado a la izquierda.

  **11.6 Barra de acciones** (`padding: 10px; display: flex; align-items: center; gap: 4px; margin-top: 8px; border-top: 1px solid #F1EAE3`). Mide 61 px de alto. Botones en este orden:
  1. **Me gusta**, con `aria-pressed` y `aria-label="Me gusta, {{p.likes}}"`: `height: 40px; border: 0; background: transparent; border-radius: 999px; padding: 0 12px; display: flex; align-items: center; gap: 6px; font-size: .86rem` (13,76 px); `font-weight: 700; color: {{p.likeColor}}`. Lleva el corazón de 20 px con `fill="{{p.heartFill}}"` y luego el número.
  2. **Comentarios**, con `aria-label="Comentarios, {{p.comments}}"`: mismo estilo, color #6E6259, burbuja de 20 px y el número. Sin acción.
  3. **Compartir**, con `aria-label="Compartir"`: mismo estilo, color #6E6259, ícono de bandeja con flecha y el texto "Compartir". Sin acción.
  4. **Guardar evento**, con `aria-label="Guardar evento"`: `margin-left: auto; width: 40px; height: 40px; border: 0; background: transparent; border-radius: 50%; color: #6E6259; display: grid; place-items: center`. Marcador de 20 px. Sin acción y sin `aria-pressed`.
- **Datos dinámicos** (de `renderVals()`; `e = evById[p.ev]`):
  - `cat = e.cat + (e.p ? '' : ' · Gratis')`: si el precio es 0 se agrega " · Gratis".
  - `event = e.t`.
  - `where = dayName[e.d] + ' ' + e.d + ' oct · ' + p.hour + ' · ' + e.v.split(' · ').join(', ')`, con `dayName = { 9: 'Vie', 10: 'Sáb', 11: 'Dom', 12: 'Lun' }`. Los " · " internos del lugar pasan a ", ", así que "Galería Café Libro · Zona T" se ve "Galería Café Libro, Zona T".
  - `cityName = cityName[e.city]`; `day = String(e.d)`; `mon = 'oct'` (siempre octubre).
  - `bg1 = e.bg1`; `bg2 = e.bg2`.
  - `likes = p.likes + (liked ? 1 : 0)`; `likeColor = liked ? '#C23A24' : '#6E6259'`; `heartFill = liked ? 'currentColor' : 'none'`.
  - `goingLabel = (p.going + (going ? 1 : 0)) + ' van · 3 amigos'`. "3 amigos" es fijo para todas las publicaciones (H37). Laura arranca con `going: { p1: true }`, así que su publicación arranca en "24 van · 3 amigos" con el botón en "Vas" (dato base 23 + 1).
  - `goingText = going ? 'Vas' : 'Voy'`; `goingBg = going ? '#17120F' : '#FFFFFF'`; `goingFg = going ? '#FFFFFF' : '#17120F'`.
  - `used = (p.cuposUsed || 0) + (joined ? 1 : 0)`; `cupos = used + ' de ' + (p.cuposMax || 0) + ' cupos'`; `pct = p.cuposMax ? Math.round(used / p.cuposMax * 100) : 0`.
    - Provenza: 5/8 da 63 % (`Math.round(62.5)` = 63); al unirse, 6/8 da 75 %.
    - Clásico: 4/6 da 67 %; al unirse, 5/6 da 83 %.
  - `joinText = joined ? 'Estás en el parche' : 'Unirme al parche'`; `joinBg = joined ? '#17120F' : '#C23A24'`.
  - `isParche = !!p.parche`; `hasStars = !!p.stars`.
  - Orden de las publicaciones: el del arreglo `raw` (p1, p4, p2, p5, p3), filtrado. No hay orden por fecha ni por relevancia.
- **Componente:** nuevo "Publicación" con estos subcomponentes: cabecera de autor, texto, calificación, "Evento adjunto horizontal" (que reutiliza `.img`, `.date`, `.cat`, `.where`, `.avs` y el botón "Voy"), "Bloque de parche con barra de cupos" y "Barra de acciones" (que reutiliza el SVG `heart`). Según H41, el marcador es "Guardar" y el corazón es "Me gusta"; Agenda debe alinearse a esto.

#### 12. Columna derecha · "Tu semana"

- **Layout:** `background: #17120F; color: #FFFFFF; border-radius: 20px; padding: 20px; display: flex; flex-direction: column; gap: 10px`. Sin borde ni sombra. Mide 280,2 × 272,4 a 1280 y 340 × 272,4 apilada.
- **Contenido en orden:**
  1. **Etiqueta "Tu semana"**, que se ve "TU SEMANA": `align-self: flex-start; background: #F6DC6A; color: #17120F; font-family: 'Archivo'; font-weight: 800; font-size: .8rem` (12,8 px); `text-transform: uppercase; padding: 3px 9px`; `line-height` 19,2 px. Esquinas rectas. Mide 97,8 × 25,2.
  2. **`<h2>` "3 planes confirmados"**, que se ve "3 PLANES CONFIRMADOS": `margin: 0; font-family: 'Archivo'; font-weight: 900; font-size: 1.5rem` (24 px); `letter-spacing: -0.03em` (−0,72 px); `line-height: 1.05` (25,2 px); `text-transform: uppercase`; #FFFFFF. Ocupa dos líneas a 280 y a 340 px.
  3. **Lista** (`display: flex; flex-direction: column; gap: 10px; margin-top: 4px`). Tres enlaces a `Evento.dc.html` con `display: flex; gap: 12px; align-items: center; color: #FFFFFF` (no cambian con el hover). Cada enlace tiene:
     - Fecha: `span` con `width: 44px; flex-shrink: 0; text-align: center; line-height: 1.1`. Dentro, el día en `<b style="display:block; font-family:'Archivo'; font-size:1.2rem">` (19,2 px). El peso calculado es 700 (por `<b>`), pero como Archivo solo se carga en 800 y 900, el navegador pinta la cara 800. Debajo, el día de la semana en `span` con `font-size: .68rem` (10,88 px), `text-transform: uppercase` y color #D8CEC6.
     - Texto: `span` con `font-size: .88rem` (14,08 px) y `line-height: 1.3`, con el título en #FFFFFF y debajo un `span` con `display: block; color: #D8CEC6; font-size: .78rem` (12,48 px).

     | Día | Semana (código → se ve) | Título | Subtítulo |
     |---|---|---|---|
     | "9" | "vie" → "VIE" | "Noche de salsa y boleros" | "9:00 p. m. · con 3 amigos" |
     | "10" | "sáb" → "SÁB" | "Festival de jazz al parque" | "2:00 p. m. · gratis" |
     | "11" | "dom" → "DOM" | "Santa Fe vs. Millonarios" | "4:00 p. m. · parche de 4" |

- **Datos dinámicos:** ninguno; todo es fijo. No cambia con "Voy" ni con "Unirme al parche" del feed, ni con el filtro de ciudad. El título "Noche de salsa y boleros" está recortado frente al nombre del evento ("Noche de salsa y boleros en vivo"). En producción: planes con "Voy" o boleta del usuario en los próximos 7 días, y "N planes confirmados" con singular y plural ("1 plan confirmado").
- **Componente:** nuevo "Resumen de la semana" (tarjeta oscura). Reutiliza `.tag` del código base. En fondo oscuro, el foco debe ser amarillo #F6DC6A, como en el Mapa (`Mapa.dc.html:20`).

#### 13. Columna derecha · "Mapa de eventos" (mini-mapa)

- **Layout:** tarjeta `background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 20px; padding: 18px; display: flex; flex-direction: column; gap: 12px`. Mide 280,2 × 513,8 a 1280 y 340 × 534,3 apilada.
- **Contenido en orden:**
  1. **Cabecera** (`display: flex; align-items: center; justify-content: space-between; gap: 10px`):
     - `<h2>` "Mapa de eventos": `margin: 0; font-size: 1rem` (16 px), 700, `line-height` 24 px, #17120F.
     - Pastilla "Nuevo": `background: #F6DC6A; color: #17120F; border-radius: 999px; padding: 2px 9px; font-size: .72rem` (11,52 px); `font-weight: 700`. Mide 53,7 × 21,3.
  2. **Resumen** `<p>`: `margin: 0; font-size: .86rem` (13,76 px); color #6E6259; `line-height` 20,64 px. Contiene "**19 planes**" (en `<b>` #17120F) y " este finde en 11 ciudades, de la costa al Amazonas.".
  3. **Enlace a `Mapa.dc.html`** (`display: flex; flex-direction: column; gap: 12px; color: #17120F`), que envuelve:
     - **El mapa** (`span aria-hidden="true"`): `display: block; background-color: #140E10; background-image: radial-gradient(rgba(255,255,255,.08) 1px, transparent 1.5px); background-size: 14px 14px` (rejilla de puntos tenues); `border-radius: 16px; padding: 14px; overflow: hidden`. Mide 242,2 × 316,3 a 1280 y 302 × 351,1 apilado.
       - Marco: `span` con `display: block; position: relative; width: min(100%, 240px); aspect-ratio: 130 / 175; margin: 0 auto`. Mide 214,2 × 288,3 a 1280 y 240 × 323,1 apilado.
       - SVG `viewBox="0 0 130 175"` con `position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible`. Un solo `path` con el contorno de Colombia (empieza en `M21.4 43.2 L26.5 46.0 …`; copiarlo tal cual de `Main.dc.html:275`, que es el mismo de Mapa y Bienvenida): `fill="#2E2220" stroke="#8A6A55" stroke-width="1.2" stroke-linejoin="round" vector-effect="non-scaling-stroke"`.
       - **Pines** (uno por ciudad con eventos, 11): `span` con `position: absolute; left: {{m.left}}%; top: {{m.top}}%; transform: translate(-50%, -50%); width/height: {{m.size}}px; border-radius: 50%; background: #F6DC6A; box-shadow: 0 0 0 2px #140E10; display: grid; place-items: center; font-family: 'Archivo'; font-weight: 900; font-size: {{m.fs}}px; line-height: 1; color: #17120F`. Muestran el número si hay más de un evento. No son botones ni enlaces: todo el mini-mapa es un solo enlace.
       - **Etiquetas** de 5 ciudades: `span` con `position: absolute; left/top` en % de la ciudad; `transform: {{l.tf}}; white-space: nowrap; font-size: .68rem` (10,88 px); `font-weight: 700; line-height: 1.2; color: #FFFFFF; text-shadow: 0 1px 3px rgba(0,0,0,.7)`. Se dibujan después de los pines, así que quedan encima.
     - **Botón visual "Ver qué pasa en todo el país"** (es un `span`, no un `<button>`): `min-height: 44px; box-sizing: border-box; border-radius: 999px; padding: 8px 16px; background: #17120F; color: #FFFFFF; display: flex; align-items: center; justify-content: center; gap: 8px; text-align: center; font-weight: 700; font-size: .88rem` (14,08 px). Lleva la flecha de 14 px (`stroke-width: 2.6`, `flex-shrink: 0`) a la derecha del texto. A 1280 px (tarjeta de 280) el texto se parte en dos líneas ("Ver qué pasa en todo el / país") y el botón mide 58,2 px de alto; apilado, mide 44 px en una línea.
- **Datos dinámicos:**
  - `countBy[ciudad]` = número de eventos de los 19 del arreglo `all` en esa ciudad. `activeCities` = ciudades con al menos 1 evento, en el orden del arreglo `cities` (las 11).
  - Pin: `size = n >= 5 ? 20 : n >= 3 ? 16 : n === 2 ? 13 : 9` (px); `fs = n >= 5 ? 11 : n >= 3 ? 10 : 9` (px); `count = n > 1 ? String(n) : ''`.
  - Orden de dibujo: `sort((a, b) => a.n - b.n)`, de menor a mayor, para que los pines grandes queden encima. Resultado: Barranquilla, Cartagena, Santa Marta, Bucaramanga, Pereira, Villavicencio, Pasto, Leticia (9 px, sin número), Cali (13 px, "2"), Medellín (16 px, "3") y Bogotá (20 px, "6").
  - Etiquetas y su `transform`:
    - Bogotá `translate(12px, -85%)` (a la derecha, un poco arriba);
    - Medellín `translate(calc(-100% - 11px), -50%)` (a la izquierda);
    - Cali `translate(calc(-100% - 10px), -50%)` (a la izquierda);
    - Barranquilla `translate(-50%, calc(-100% - 12px))` (encima, centrada);
    - Leticia `translate(calc(-100% - 9px), -50%)` (a la izquierda).
  - `mapTotal = planes(all.length)` con `planes = (n) => n + (n === 1 ? ' plan' : ' planes')`, que da "19 planes".
  - `mapWhere = 'este finde en ' + activeCities.length + ' ciudades, de la costa al Amazonas.'`, que da "este finde en 11 ciudades, de la costa al Amazonas.". "ciudades" no tiene singular: con 1 diría "1 ciudades".
  - El mini-mapa **no** cambia con el selector de ciudad.
- **Componente:** nuevo "Mini-mapa de Colombia", compartido con Bienvenida (la versión de Bienvenida tiene pines de 20 px que se enciman, H60; la de Inicio ya resuelve eso con un solo enlace). Las posiciones salen de la proyección del Mapa (ver las decisiones globales del mapa).

#### 14. Columna derecha · "Gente con tus gustos"

- **Layout:** tarjeta `background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 20px; padding: 18px; display: flex; flex-direction: column; gap: 4px`. Mide 280,2 × 319,5 a 1280 y 340 × 283,8 apilada.
- **Contenido en orden:**
  1. `<h2>` "Gente con tus gustos": `margin: 0 0 6px; font-size: 1rem` (16 px), 700.
  2. Tres filas (`display: flex; align-items: center; gap: 12px; padding: 8px 0`), cada una con:
     - avatar enlace a `Perfil.dc.html`: 40 × 40, `flex-shrink: 0; border-radius: 50%; background: {{u.c}}; display: grid; place-items: center; font-weight: 700; font-size: .78rem` (12,48 px); iniciales en #17120F;
     - texto (`flex: 1; min-width: 0; line-height: 1.3`): nombre como enlace a `Perfil.dc.html` (`font-weight: 700; font-size: .9rem`, 14,4 px) y debajo el motivo en `span` con `display: block; font-size: .78rem` (12,48 px); #6E6259;
     - botón **"Seguir" / "Siguiendo"** con `aria-pressed`: `height: 36px; border-radius: 999px; padding: 0 14px; font-size: .8rem` (12,8 px); `font-weight: 700; border: 1px solid #17120F`.
       - Apagado: fondo #17120F, texto #FFFFFF, "Seguir" (69,7 px de ancho).
       - Encendido: fondo #FFFFFF, texto #17120F, "Siguiendo" (92,2 px).
  - A 1280 px la columna de texto mide solo 108,5 px: "María F. Gómez" y "Valentina Quintero" se parten en dos líneas y los motivos ocupan 2 o 3 líneas (filas de 84,2, 67,9 y 87,4 px). Apilada (302 px útiles), cada fila mide 67,9 px.
- **Datos dinámicos:** lista `people`. Cada botón ejecuta `this.toggle('follow', u.id)` y calcula `label = on ? 'Siguiendo' : 'Seguir'`, `bg = on ? '#FFFFFF' : '#17120F'` y `fg = on ? '#17120F' : '#FFFFFF'`. Seguir a alguien no cambia los contadores de la tarjeta de perfil.
- **Componente:** reutilizar `.people`, `.act` y `.av` del código base, más el componente único "Botón Seguir" (mismo patrón en Registro, Perfil y Evento).

#### 15. Columna derecha · "Tendencias en Colombia"

- **Layout:** tarjeta `background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 20px; padding: 18px; display: flex; flex-direction: column; gap: 10px`. Mide 280,2 × 286,5.
- **Contenido en orden:**
  1. `<h2>` "Tendencias en Colombia": `margin: 0; font-size: 1rem` (16 px), 700.
  2. Cinco enlaces a `Agenda.dc.html` con `line-height: 1.3` (34,9 px de alto cada uno). Cada enlace tiene:
     - un `span` con `display: block; font-size: .74rem` (11,84 px) y color #6E6259, que contiene la ciudad en `<b style="color:#17120F">` (700), " · " y el tema y conteo, por ejemplo "**Bogotá** · Fútbol · 1.150 planes";
     - el hashtag en `<b>` (15 px, 700, #17120F), por ejemplo "#ClásicoCapitalino".
- **Datos dinámicos:** lista `trends` (fija). El conteo usa punto de miles ("1.150"). En producción, formatear con `toLocaleString('es-CO')`.
- **Componente:** nuevo "Lista de tendencias". La auditoría pide un solo nombre para el alcance nacional: aquí dice "Todo el país" y el selector dice "Toda Colombia" (H62).

#### 16. Columna derecha · Texto legal (no hay pie de página)

- **Layout:** `<p>` con `margin: 0; font-size: .76rem` (12,16 px); color #6E6259; `line-height` 18,24 px. Es el último hijo de la columna derecha. Como no hay `<footer>`, en celular y tableta es lo último de la página.
- **Contenido:** "Compra segura dentro de Fulleventos. Las boletas las emite la boletera oficial del evento o el organizador. · Contenido de ejemplo"
- **Datos dinámicos:** ninguno.
- **Componente:** debe reemplazarse por el pie legal común con razón social, NIT, PQR, enlace a la SIC, Términos y Política de tratamiento (H5), con el texto condicionado al modo de compra (H1). "Contenido de ejemplo" se quita en producción.

### Datos de ejemplo

Todos los datos viven en `renderVals()` o fijos en la plantilla. Fin de semana de ejemplo: viernes 9 a lunes festivo 12 de octubre de 2026.

**Usuario con sesión (fijo en la plantilla)**

| Campo | Valor |
|---|---|
| Nombre | "Camila Vargas" |
| Usuario | "@camivargas" |
| Iniciales / color | "CV" / #8FD3D0 |
| Planes / Seguidores / Siguiendo | 38 / 412 / 289 |
| Mensajes sin leer | 3 |
| Nombre de pila en el compositor | "Camila" |

**Publicaciones (`raw`, en el orden en que se muestran)**

| id | Autor | Inic. | Color | Acción | Tiempo | Texto | Evento (`ev`) | Hora | Pestañas (`tags`) | `going` base | `likes` | `comments` | Parche | `cuposUsed` / `cuposMax` | `stars` |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| p1 | Laura Martínez | LM | #F3B27E | "va a un evento" | "Hace 1 h · Bogotá" | "¿Quién se apunta el viernes? Tengo dos boletas de más y la orquesta en vivo es una locura." | e1 | "9:00 p. m." | amigos, cerca | 23 | 24 | 6 | — | — | — |
| p4 | Andrés Ramírez | AR | #A3A8F0 | "abrió un parche" | "Hace 2 h · Medellín" | "¿Alguien de Bogotá se viene a Medellín por el puente? Armé parche para el viernes en Provenza: nos vemos a las 9 en el parque Lleras y arrancamos." | e7 | "10:00 p. m." | amigos, parches | 34 | 27 | 9 | "Provenza de viernes" | 5 / 8 | — |
| p2 | Sofía Cárdenas | SC | #EE93BC | "armó un parche" | "Hace 3 h · Bogotá" | "Armé parche para el clásico. Nos vemos a las 2 en la tienda de la 57 y caminamos al estadio. Faltan dos." | e4 | "4:00 p. m." | amigos, parches, cerca | 41 | 18 | 11 | "Clásico capitalino" | 4 / 6 | — |
| p5 | Natalia Herrera | NH | #F6DC6A | "compartió un plan gratis" | "Hace 5 h · Barranquilla" | "Para los que vienen a la costa este puente: el sábado hay vallenato gratis en el Malecón, frente al río. Lleguen temprano que se llena." | e12 | "5:00 p. m." | amigos | 112 | 45 | 12 | — | — | — |
| p3 | Juan Pablo Rojas | JP | #B9E07A | "reseñó un evento" | "Ayer · Bogotá" | "Me dolió la barriga de reír. El cierre con improvisación del público vale cada peso. Vayan en grupo." | e5 | "7:00 p. m." | amigos, resenas | 9 | 52 | 14 | — | — | true |

**Valores renderizados en el estado inicial**

| id | Categoría (se ve en mayúsculas) | Título | Línea de lugar | Ciudad | Placa | Foto (bg1 → bg2) | "van" | Botón | Cupos y barra | Me gusta / Comentarios |
|---|---|---|---|---|---|---|---|---|---|---|
| p1 | "Rumba" | "Noche de salsa y boleros en vivo" | "Vie 9 oct · 9:00 p. m. · Galería Café Libro, Zona T" | Bogotá | 9 OCT | #E8A04F → #B5372B | "24 van · 3 amigos" | "Vas" (encendido) | — | 24 / 6 |
| p4 | "Rumba" | "Noche de reguetón en Provenza" | "Vie 9 oct · 10:00 p. m. · Barrio Provenza, El Poblado" | Medellín | 9 OCT | #6B3FA0 → #0E0A1A | "34 van · 3 amigos" | "Voy" | "5 de 8 cupos", 63 % | 27 / 9 |
| p2 | "Deporte" | "Santa Fe vs. Millonarios" | "Dom 11 oct · 4:00 p. m. · Estadio El Campín, Teusaquillo" | Bogotá | 11 OCT | #C4302B → #1F3A8A | "41 van · 3 amigos" | "Voy" | "4 de 6 cupos", 67 % | 18 / 11 |
| p5 | "Conciertos · Gratis" | "Vallenato en el Gran Malecón" | "Sáb 10 oct · 5:00 p. m. · Gran Malecón del Río" | Barranquilla | 10 OCT | #F6DC6A → #1E5A7A | "112 van · 3 amigos" | "Voy" | — | 45 / 12 |
| p3 | "Arte y teatro" | "Stand-up: risas de domingo" | "Dom 11 oct · 7:00 p. m. · Teatro Libre, Chapinero" | Bogotá | 11 OCT | #EE93BC → #5A2340 | "9 van · 3 amigos" | "Voy" | — (5 estrellas) | 52 / 14 |

**Matriz de visibilidad (pestaña × ciudad → publicaciones, en orden)**

| Ciudad | Amigos | Parches abiertos | Reseñas | Cerca de ti |
|---|---|---|---|---|
| Toda Colombia (`all`) | p1, p4, p2, p5, p3 | p4, p2 | p3 | p1, p2 |
| Bogotá | p1, p2, p3 | p2 | p3 | p1, p2 |
| Medellín | p4 | p4 | vacío | vacío |
| Barranquilla | p5 | vacío | vacío | vacío |
| Cali, Cartagena, Santa Marta, Bucaramanga, Pereira, Villavicencio, Pasto, Leticia | vacío | vacío | vacío | vacío |

**Eventos (`all`, 19 registros; Inicio muestra e1, e4, e5, e7 y e12 en el feed y usa los 19 para contar los pines del mini-mapa)**

| id | Título (`t`) | Categoría | Etiquetas | Ciudad | Día (`d`) | Lugar (`v`) | Precio (`p`) | Vende (`b`) | bg1 | bg2 |
|---|---|---|---|---|---|---|---|---|---|---|
| e1 | Noche de salsa y boleros en vivo | Rumba | rumba | bogota | 9 | Galería Café Libro · Zona T | 45000 | TuBoleta | #E8A04F | #B5372B |
| e2 | Festival de jazz al parque | Conciertos | conciertos, gratis | bogota | 10 | Parque El Country · Usaquén | 0 | Idartes | #4F6DD8 | #1E2550 |
| e3 | Rock en el Movistar Arena | Conciertos | conciertos | bogota | 10 | Movistar Arena · Salitre | 180000 | TuBoleta | #D9452F | #2B0F12 |
| e4 | Santa Fe vs. Millonarios | Deporte | deporte | bogota | 11 | Estadio El Campín · Teusaquillo | 60000 | Ticketmaster | #C4302B | #1F3A8A |
| e5 | Stand-up: risas de domingo | Arte y teatro | teatro | bogota | 11 | Teatro Libre · Chapinero | 55000 | TuBoleta | #EE93BC | #5A2340 |
| e6 | Mercado gastronómico de las Américas | Comida | comida, gratis | bogota | 10 | Plaza de los Artesanos | 0 | Entrada libre | #F6DC6A | #C46A2B |
| e7 | Noche de reguetón en Provenza | Rumba | rumba | medellin | 9 | Barrio Provenza · El Poblado | 50000 | Fever | #6B3FA0 | #0E0A1A |
| e8 | Atlético Nacional vs. Junior | Deporte | deporte | medellin | 12 | Estadio Atanasio Girardot | 70000 | Ticketmaster | #3E9B63 | #0F2A1C |
| e9 | Milonga en Manrique | Rumba | rumba | medellin | 10 | Casa del tango · Manrique | 25000 | TuBoleta | #B88A5A | #3A2414 |
| e10 | Viejoteca de salsa caleña | Rumba | rumba | cali | 10 | Juanchito | 40000 | TuBoleta | #F3B27E | #8A2E1F |
| e11 | Concierto de músicas del Pacífico | Conciertos | conciertos | cali | 11 | Teatro Municipal | 35000 | TuBoleta | #8FD3D0 | #12343A |
| e12 | Vallenato en el Gran Malecón | Conciertos | conciertos, gratis | barranquilla | 10 | Gran Malecón del Río | 0 | Entrada libre | #F6DC6A | #1E5A7A |
| e13 | Noche de champeta en Getsemaní | Rumba | rumba | cartagena | 9 | Plaza de la Trinidad · Getsemaní | 30000 | Fever | #EE93BC | #4A1A3A |
| e14 | Atardecer electrónico en la playa | Rumba | rumba | santamarta | 10 | Playa El Rodadero | 90000 | Fever | #F3B27E | #1E2550 |
| e15 | Festival de cerveza artesanal | Comida | comida | bucaramanga | 11 | Parque San Pío | 25000 | TuBoleta | #E8A04F | #5A3A14 |
| e16 | Noche de trova en el lago | Conciertos | conciertos, gratis | pereira | 9 | Parque Lago Uribe Uribe | 0 | Entrada libre | #A3A8F0 | #2A2550 |
| e17 | Joropo en Los Fundadores | Conciertos | conciertos, gratis | villavicencio | 11 | Parque Los Fundadores | 0 | Entrada libre | #B9E07A | #2A3A14 |
| e18 | Concierto andino en la plaza | Conciertos | conciertos, gratis | pasto | 10 | Plaza de Nariño | 0 | Entrada libre | #8FD3D0 | #2A1F3A |
| e19 | Música y comida en el malecón del Amazonas | Comida | comida, gratis | leticia | 11 | Malecón de Leticia | 0 | Entrada libre | #B9E07A | #12343A |

Inicio no muestra precios ni boleteras: de `p` solo usa si es 0 (para " · Gratis"), y `b` no se usa.

**Ciudades (`cities`, posiciones en % del marco del mini-mapa)**

| id | Nombre | left % | top % | Eventos | Pin (px) / letra (px) / número | Etiqueta en el mini-mapa |
|---|---|---|---|---|---|---|
| bogota | Bogotá | 41.8 | 47.4 | 6 | 20 / 11 / "6" | Sí, `translate(12px, -85%)` |
| medellin | Medellín | 30.2 | 38.6 | 3 | 16 / 10 / "3" | Sí, `translate(calc(-100% - 11px), -50%)` |
| cali | Cali | 22.8 | 54.6 | 2 | 13 / 9 / "2" | Sí, `translate(calc(-100% - 10px), -50%)` |
| barranquilla | Barranquilla | 36.2 | 11.7 | 1 | 9 / 9 / — | Sí, `translate(-50%, calc(-100% - 12px))` |
| cartagena | Cartagena | 30.9 | 14.9 | 1 | 9 / 9 / — | No |
| santamarta | Santa Marta | 40.8 | 10.1 | 1 | 9 / 9 / — | No |
| bucaramanga | Bucaramanga | 49.1 | 33.6 | 1 | 9 / 9 / — | No |
| pereira | Pereira | 29.3 | 46.8 | 1 | 9 / 9 / — | No |
| villavicencio | Villavicencio | 45.2 | 50.6 | 1 | 9 / 9 / — | No |
| pasto | Pasto | 17.1 | 67.4 | 1 | 9 / 9 / — | No |
| leticia | Leticia | 73.5 | 97 | 1 | 9 / 9 / — | Sí, `translate(calc(-100% - 9px), -50%)` |

**Historias (`stories`)**

| Orden | Iniciales | Nombre | Ciudad | Color interior | Anillo | `aria-label` |
|---|---|---|---|---|---|---|
| 1 | "+" | "Tu plan" | (vacía) | #FFFFFF | #EAE1D8 | "Sube tu plan" |
| 2 | LM | "Laura" | "Bogotá" | #F3B27E | degradado 135° #F3B27E → #D9452F | "Historia de Laura en Bogotá" |
| 3 | AR | "Andrés" | "Medellín" | #A3A8F0 | degradado | "Historia de Andrés en Medellín" |
| 4 | NH | "Nata" | "Barranquilla" | #F6DC6A | degradado | "Historia de Nata en Barranquilla" |
| 5 | CR | "Caro" | "Cali" | #EE93BC | degradado | "Historia de Caro en Cali" |
| 6 | SB | "Sebas" | "Santa Marta" | #8FD3D0 | #EAE1D8 | "Historia de Sebas en Santa Marta" |
| 7 | MJ | "Majo" | "Pereira" | #B9E07A | #EAE1D8 | "Historia de Majo en Pereira" |
| 8 | DR | "Dani" | "Leticia" | #A3A8F0 | #EAE1D8 | "Historia de Dani en Leticia" |

**Pestañas (`tabDefs`):** `amigos` "Amigos" · `parches` "Parches abiertos" · `resenas` "Reseñas" · `cerca` "Cerca de ti".

**Gente con tus gustos (`people`)**

| id | Iniciales | Nombre | Motivo | Color |
|---|---|---|---|---|
| u1 | MG | "María F. Gómez" | "Bogotá · Va a 4 eventos que te gustan" | #F6DC6A |
| u2 | DT | "Daniel Torres" | "Bogotá · Amigo de Laura y Andrés" | #8FD3D0 |
| u3 | VQ | "Valentina Quintero" | "Medellín · Le encanta el techno" | #A3A8F0 |

**Tendencias (`trends`)**

| Ciudad | Meta | Hashtag |
|---|---|---|
| "Bogotá" | "Fútbol · 1.150 planes" | "#ClásicoCapitalino" |
| "Medellín" | "Rumba · 900 planes" | "#ProvenzaDeViernes" |
| "Todo el país" | "Salsa · 870 planes" | "#ViernesDeSalsa" |
| "Barranquilla" | "Gratis · 640 planes" | "#VallenatoEnElMalecón" |
| "Cali" | "Conciertos · 410 planes" | "#PacíficoEnVivo" |

**Tu semana (fijo en la plantilla):** ver la tabla de la sección 12 (9 vie "Noche de salsa y boleros" "9:00 p. m. · con 3 amigos"; 10 sáb "Festival de jazz al parque" "2:00 p. m. · gratis"; 11 dom "Santa Fe vs. Millonarios" "4:00 p. m. · parche de 4").

**Tus parches (fijo en la plantilla):** ver la tabla de la sección 5. Según el Chat, "Salseros de jueves" está ligado a e1 y tiene 12 miembros; "Clásico capitalino" está ligado a e4, tiene 6 cupos y los miembros son Camila, Sofía, Juan Pablo y Daniel; "Rockeros del Arena" está ligado a e3 y tiene 8 miembros.


---
Ver también: [5. Responsive](../05-responsive.md) · [6. Estados interactivos](../06-estados-interactivos.md) · [8. Detalles finos](../08-detalles-finos.md)
