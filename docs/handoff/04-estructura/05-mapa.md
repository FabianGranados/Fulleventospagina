[← Índice del handoff](../README.md)

## 4.7 Mapa (`Mapa.dc.html`)

**Ruta propuesta:** `/mapa`. La auditoría pide que la ciudad viaje en la dirección (`/mapa?ciudad=cali`, H42) para que los enlaces "Ver en el mapa" de otras pantallas abran la ciudad correcta. Se recomienda reflejar también la categoría y la fecha (`/mapa?ciudad=medellin&categoria=rumba&fecha=finde`) para poder compartir y volver al mismo punto. En el prototipo todo es estado interno y la URL nunca cambia · **Quién la ve:** en el prototipo, el usuario con sesión (avatar "CV" de Camila Vargas, "Crear evento" e insignia de 3 mensajes). H33 obliga a tener además una versión pública para visitantes: el mapa es una de las páginas que se comparten y que Google posiciona · **Propósito:** mostrar de un vistazo "todo lo que pasa en Colombia este finde": un mapa oscuro con un punto amarillo por ciudad, cuyo tamaño indica cuántos planes hay. Al tocar un punto, el mapa hace zoom sobre la ciudad y el panel lateral lista sus planes con "Comprar" / "Ver plan", "Repostear" y "Guardar". Se puede filtrar por categoría y hay un ranking "Ciudades con más planes".

**Ficha técnica del archivo**
- `<title>`: "Fulleventos · Mapa de eventos". `<html lang="es">`. Tablero del lienzo: 1280 × 1560 (`data-props='{"$preview":{"width":1280,"height":1560}}'`).
- Fuentes (Google Fonts, `display=swap`, `preconnect` solo a `fonts.googleapis.com`): **Archivo** 800 y 900; **DM Sans** con eje óptico `opsz 9..40` en 400, 500 y 700. No se carga nada más.
- Estilos globales del `<helmet>` (las únicas reglas de hoja de estilo; todo lo demás es inline). Copiarlos tal cual:
  - `body{margin:0;background:#FBF7F3}`
  - `a{color:#17120F;text-decoration:none}a:hover{color:#C23A24}`. El hover solo se nota en los enlaces que **no** traen `color` inline (ver "Estados e interacciones").
  - `button{font-family:inherit;cursor:pointer}`
  - `button:disabled{cursor:default;opacity:.4}` (solo lo usan "Alejar" y "Acercar").
  - `input,select{font-family:inherit}`
  - `button:focus-visible,a:focus-visible,select:focus-visible{outline:3px solid #C23A24;outline-offset:2px}`
  - `[data-fe~="dark"] button:focus-visible{outline-color:#F6DC6A}`: dentro del panel oscuro del mapa, el anillo de foco es amarillo.
  - `@container (max-width: 420px){[data-fe~="geo"]{display:none}[data-fe~="sea"] span{font-size:.6rem !important;letter-spacing:.12em !important}}`: el contenedor es el lienzo del mapa, no la ventana.
  - `@media (min-width: 1100px){[data-fe~="side"]{contain:size}[data-fe~="list"]{min-height:0;overflow-y:auto}}`
  - `@media (prefers-reduced-motion: reduce){[data-fx]{transition:none !important}}`: lo cumplen 33 elementos marcados con `data-fx` en el estado inicial (capa del mapa, 7 etiquetas geográficas, 11 anclas de pin, 11 botones de pin y 3 líneas guía; el número baja cuando un filtro quita pines).
- **No hay** `<meta name="viewport">` (H35) ni `* { box-sizing: border-box }`. Los botones y el `select` son `border-box` por defecto del navegador. Las cajas con `box-sizing: border-box` explícito son el buscador, el panel del mapa, los pines, la insignia de mensajes, la placa de fecha de la tarjeta, el botón "Comprar"/"Ver plan" y la burbuja de conteo del ranking. El panel lateral (`aside`) es `content-box`: con su borde mide 382 px a lo ancho, no 380.
- **Unidades:** el contenedor raíz fija `font-size: 15px`, pero los `rem` se calculan sobre la raíz del documento (16 px). Todas las conversiones de este documento usan 16 px por rem.
- **Contenedor raíz:** `div` con `position: relative; min-height: 100vh; background: #FBF7F3; color: #17120F; font-family: 'DM Sans', system-ui, sans-serif; font-size: 15px; line-height: 1.5` (22,5 px). Alto total de la página: 1544 px a 1280 × 900; 5618 px a 768; 6757 px a 390; 7147 px a 360; 8338 px a 320.
- **Comentarios de intención que deja el código** (son las razones de diseño; conservarlas):
  - "ox/oy: desplazamiento del punto (px) cuando el mapa está alejado, para que no se monten las ciudades vecinas. lab: lado donde va el nombre de la ciudad."
  - "Transformación del mapa (origen 0 0, en % de la caja del mapa): la ciudad elegida se acerca y se lleva al centro; sin ciudad, el zoom es hacia el centro."
  - "fe 'sea': siempre visible (más pequeño en mapas angostos); fe 'geo': se oculta en mapas angostos."

### Navegación de entrada y salida

| Elemento | Destino | Notas |
|---|---|---|
| **Entrada:** ícono "Mapa de eventos" del encabezado de Main (`Main.dc.html:56`), Agenda (`:54`), Chat (`:61`) y Evento (`:39`) | `Mapa.dc.html` → `/mapa` | Abre siempre en "Toda Colombia", "Todo", zoom 1×. |
| **Entrada:** pestaña "Mapa" del selector "Lista / Mapa" de Agenda (`Agenda.dc.html:79`) | `/mapa` | En Mapa **no** existe el camino de vuelta "Lista" (H41). La ciudad y la categoría elegidas en Agenda se pierden. |
| **Entrada:** "Ver todos los planes en el mapa" de Agenda (`Agenda.dc.html:120`) | `/mapa` | Pierde el filtro de Agenda (H42). |
| **Entrada:** enlace "Mapa" con insignia "Nuevo" del encabezado de Bienvenida (`Bienvenida.dc.html:51`) | `/mapa` | Un visitante sin cuenta cae en la versión con sesión (H33). |
| **Entrada:** "Abrir el mapa de eventos" (Bienvenida `:128`) y "Ver en el mapa" de "Este finde en Colombia" (`:193`) | `/mapa` | Igual que el anterior. |
| **Entrada:** cada pin del mini-mapa de Bienvenida (`Bienvenida.dc.html:140`, `aria-label` "Ver planes en Bogotá (6 planes este finde)") | `/mapa` | El pin promete una ciudad, pero el mapa abre en "Toda Colombia". Producción: `/mapa?ciudad=bogota` (H42, H60). |
| **Entrada:** menú lateral "Mapa de eventos" con insignia "Nuevo" (Main `:92`), "Ver en el mapa" de la franja de ciudad (`:165`), "Ver {ciudad} en el mapa" del estado vacío (`:177`) y tarjeta del mini-mapa (`:271`) | `/mapa` | "Ver Cali en el mapa" abre "Toda Colombia" (H42). Producción: `/mapa?ciudad=cali`. |
| **Entrada:** "Ver en el mapa" de la ubicación del evento (Evento `:382`) y "Ver más planes en el mapa" (`:470`) | `/mapa` | Debería abrir la ciudad del evento y resaltar su pin (H42). |
| **Entrada:** enlace "Mapa" del encabezado de Perfil (`Perfil.dc.html:27`) | `/mapa` | |
| Logo "fulleventos" | `Main.dc.html` → `/inicio` | Color fijo #D9452F, sin hover. |
| Ícono "Inicio" | `Main.dc.html` → `/inicio` | |
| Ícono "Agenda de eventos" | `Agenda.dc.html` → `/agenda` | No pasa ciudad ni categoría. |
| Ícono "Mapa de eventos" (`aria-current="page"`) | `Mapa.dc.html` (la misma pantalla) | Recarga y reinicia el estado. |
| Ícono "Mensajes, 3 sin leer" | `Chat.dc.html` → `/mensajes` | |
| Botón "Notificaciones" (campana) | Ninguno | Sin `onClick` (H38, H54). |
| Botón "Crear evento" | Ninguno | Sin `onClick` ni `type="button"` (H38, H14). |
| Avatar "CV" (`aria-label="Tu perfil"`) | `Perfil.dc.html` → `/perfil/:usuario` | H46 y H59 (nombre accesible "CV, tu perfil"). |
| Buscador "Busca eventos, lugares o artistas" | Ninguno | Escribir o pulsar Enter no hace nada (H38, H41). |
| Selector de ciudad del encabezado | Estado interno | Elige la ciudad en el mapa (ver "Estados"). No navega. |
| Título de cada evento en el panel | `Evento.dc.html` → `/evento/:slug` | Los 19 abren el mismo evento (H36). |
| "Comprar" / "Ver plan" de cada evento | `Evento.dc.html` → `/evento/:slug` | Mismo destino que el título (`href: 'Evento.dc.html'`, línea `:410`). "Ver plan" de un evento gratis abre un evento pagado (H36). La foto **no** es enlace. |
| "Repostear", "Guardar", "Ver en el mapa", pines, ranking, "Toda Colombia", "Mi ciudad: Bogotá", zoom, filtros, fecha | Estado interno | No navegan. |
| Pie de página | Ninguno | 0 enlaces (H5). |

### Estructura sección por sección

Orden en el DOM: encabezado → `<main>` (cabecera de la página, filtros, fila mapa + panel, "Ciudades con más planes") → pie.

**Componentes del código base que se reutilizan en esta pantalla** (`diseno/referencia/preview-demo.html`):
- Variables de `:root`: `--bg #FBF7F3`, `--surface #FFFFFF`, `--ink #17120F`, `--muted #6E6259`, `--line #EAE1D8`, `--brand #D9452F`, `--yellow #F6DC6A`, `--hero #140E10`, `--display` Archivo y `--ui` DM Sans.
- `.wrap` (máx. 1240 px), la regla `:focus-visible`, `.eyebrow`, `.cat`, `.chips` / `.chip` con `aria-pressed`, `.date` (placa de fecha), `.save` (corazón con `aria-pressed` y `fill: currentColor`), `.price` con `<small>` de boletera, `.ticket` (botón rojo de compra), `.empty` y el fondo oscuro con degradados radiales de `.hero`, que es el origen del panel del mapa.
- El formateador `cop()` (`n === 0 ? 'Gratis' : '$' + n.toLocaleString('es-CO')`, `preview-demo.html:307`). Aquí el prefijo "Desde " se agrega aparte.
- Encabezado `.top` / `.search` / `.city`: es el origen del encabezado de la app.
- **Ojo al reutilizar las clases del código base:** allá `.eyebrow`, `.cat`, `.ticket`, `.save[aria-pressed="true"]` y `:focus-visible` usan `var(--brand)` (#D9452F); en el prototipo todos esos usos pasaron a **#C23A24** (antetítulos, categoría, CTA, corazón guardado, insignia y anillo de foco). Las medidas también cambian en la tarjeta compacta: `.date` del código base mide `min-width: 46px`, `top/left: 12px`, radio 10 px, día en 1.25rem y mes en .66rem (aquí 32 px, 6 px, 8 px, 1rem y .58rem); `.cat` va en .7rem (aquí .68rem); `.price` en .95rem con `tabular-nums` (aquí .88rem, sin `tabular-nums`); `.ticket` usa `padding: 9px 14px` y .82rem (aquí alto fijo de 36 px y .8rem); `.save` va encima de la foto, sin borde y con fondo `rgba(255,255,255,.92)` (aquí va en la fila de acciones, con borde #EAE1D8 y fondo #FFFFFF); `.chip` usa `padding: 9px 16px` (aquí alto fijo de 42 px). El `--brand-hover` (#BF3923) del código base no se usa en esta pantalla.

Tokens que usa esta pantalla y **no existen** en el código base, así que hay que crearlos:
- #C23A24: acento, CTA, antetítulos y pin elegido.
- #F1EAE3: separador entre tarjetas.
- #D8CEC6: texto secundario sobre el panel oscuro.
- #2E2220 y #8A6A55: relleno y contorno del país.
- #7FA3A6: nombres de mares.
- #9C8B80: nombres de países vecinos.
- #8FD3D0: cordilleras y avatar. En el código base existe solo como clase `.c6`.

#### 1. Encabezado (`<header>`, fijo)

- **Layout:**
  - `<header>`: `position: sticky; top: 0; z-index: 70; background: #FBF7F3; border-bottom: 1px solid #EAE1D8`. Sin sombra. **Ojo:** en Agenda, Main y Chat el mismo encabezado usa `z-index: 5`. En Mapa vale 70 para quedar por encima de los pines, que usan `z-index` de hasta 60. El componente común debe usar un valor que gane siempre al contenido del mapa.
  - Contenedor interno: `max-width: 1240px; margin: 0 auto; padding: 12px clamp(16px, 4vw, 24px); display: flex; flex-wrap: wrap; align-items: center; gap: 12px 20px`. El margen lateral vale 16 px hasta 400 px de ancho, 4vw entre 400 y 600, y 24 px desde 600. Agenda, Main y Chat usan 24 px fijos (H41: un margen lateral único).
  - Alto renderizado (incluye 1 px de borde), medido en Chromium:

    | Ancho de ventana | Alto | Filas |
    |---|---|---|
    | 907 px o más | **69 px** | 1 |
    | 471 a 906 px | 125 px | 2: logo + buscador; navegación |
    | 441 a 470 px | 171 px | 3: logo + buscador; íconos + "Crear evento"; avatar |
    | 417 a 440 px | 220 px | 4: logo; buscador; íconos + "Crear evento"; avatar |
    | 416 px o menos | **224 px** | 4: logo; buscador; 5 íconos; "Crear evento" + avatar |

    A 390 × 844 ocupa el 26,5 % de la pantalla (H40).
- **Contenido en orden:**
  1. **Logo:** enlace "fulleventos" (en minúsculas en el código) a `Main.dc.html`. DM Sans 700, `font-size: 1.55rem` (24,8 px), `letter-spacing: -0.03em` (−0,744 px), `line-height` 1,5 (37,2 px), color #D9452F. Mide 124,9 × 37,2 px. Es el único uso de #D9452F en la pantalla.
  2. **Buscador** (`div role="search"`): `flex: 1 1 260px; max-width: 500px; min-width: 0; display: flex; align-items: center; gap: 10px; background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 999px; padding: 0 6px 0 16px; height: 44px; box-sizing: border-box`. Mide 500 × 44 a 1280 y a 768. A 907 px mide 261 × 44 (su base, para caber en una sola fila) y crece 1 px por cada px de ventana hasta llegar a 500 hacia los 1146 px (377,8 a 1024). A 390 mide 358 × 44.
     - `label` del texto (`flex: 1; min-width: 0; display: flex; align-items: center; gap: 10px`):
       - lupa de 18 px (`circle cx=11 cy=11 r=7` + `m20 20-3.5-3.5`), trazo #6E6259, grosor 2, puntas redondas, `flex-shrink: 0`;
       - `<input type="search" placeholder="Busca eventos, lugares o artistas" aria-label="Buscar eventos">` con `flex: 1; min-width: 0; border: 0; outline: 0; background: transparent; font-size: .95rem` (15,2 px) y color #17120F. El placeholder usa el gris por defecto del navegador (#757575; sobre este fondo blanco da unos 4,6:1). H52 pide #6E6259 para todos los placeholders. No tiene `name`, formulario ni manejador. A 390 px el placeholder se corta: "Busca eventos, lug".
     - `label` de ciudad: `display: flex; align-items: center; gap: 4px; padding-left: 10px; border-left: 1px solid #EAE1D8; font-size: .9rem` (14,4 px); `white-space: nowrap; flex-shrink: 0`.
       - pin de 16 px (gota + `circle r=2.5`), `stroke="currentColor"` (#17120F), grosor 2;
       - texto oculto "Ciudad" (`position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap`);
       - `<select name="ciudad">` con `height: 36px; max-width: 8.6em` (123,84 px); `border: 0; background: transparent; font-size: .9rem` (14,4 px); `font-weight: 500`; color #17120F; `cursor: pointer`. Flecha nativa (sin `appearance: none`). Mide 122 × 36 px.
       - Opciones (valor → texto): `all` → "Toda Colombia", `bogota` → "Bogotá", `medellin` → "Medellín", `cali` → "Cali", `barranquilla` → "Barranquilla", `cartagena` → "Cartagena", `santamarta` → "Santa Marta", `bucaramanga` → "Bucaramanga", `pereira` → "Pereira", `villavicencio` → "Villavicencio", `pasto` → "Pasto", `leticia` → "Leticia".
  3. **Navegación** (`<nav aria-label="Principal">`): `margin-left: auto; display: flex; flex-wrap: wrap; justify-content: flex-end; align-items: center; gap: 6px`. Mide 433,3 × 44 en una fila; a 390 px, 358 × 94 en dos filas alineadas a la derecha.
     - **Cuatro enlaces de ícono:** `width: 44px; height: 44px; border-radius: 12px; display: grid; place-items: center`. Íconos de 20 px, trazo 2, puntas y uniones redondas, `currentColor`.
       - "Inicio" (casa) → `Main.dc.html`, color #17120F.
       - "Agenda de eventos" (calendario: `rect x=3 y=5 w=18 h=16 rx=2` + `M3 10h18M8 3v4M16 3v4`) → `Agenda.dc.html`.
       - "Mapa de eventos" (mapa plegado: `M9 4 3 6.5V20l6-2.5 6 2.5 6-2.5V4l-6 2.5z` + `M9 4v13.5M15 6.5V20`) → `Mapa.dc.html`, con `aria-current="page"` y `background: #17120F; color: #FFFFFF` (ícono blanco sobre tinta).
       - "Mensajes, 3 sin leer" (burbuja) → `Chat.dc.html`, `position: relative`. Insignia `<span aria-hidden="true">3</span>`: `position: absolute; top: 6px; right: 6px; min-width: 18px; height: 18px; box-sizing: border-box; border-radius: 9px; background: #C23A24; color: #FFFFFF; font-size: .66rem` (10,56 px); `font-weight: 700; line-height: 1; display: grid; place-items: center; padding: 0 4px`.
     - **Botón "Notificaciones"** (`aria-label="Notificaciones"`): 44 × 44, `border-radius: 12px; border: 0; background: transparent; color: #17120F; display: grid; place-items: center`. Campana de 20 px. Sin acción.
     - **Botón "Crear evento":** `height: 44px; border: 0; border-radius: 999px; padding: 0 18px; background: #17120F; color: #FFFFFF; font-weight: 700; font-size: .9rem` (14,4 px); `margin-left: 6px`. Mide 127,3 × 44. Sin acción y sin `type="button"`.
     - **Avatar "CV"** (enlace a `Perfil.dc.html`, `aria-label="Tu perfil"`): `width: 40px; height: 40px; border-radius: 50%; background: #8FD3D0; display: grid; place-items: center; font-weight: 700; font-size: .78rem` (12,48 px); texto #17120F; `margin-left: 4px`.
- **Datos dinámicos:**
  - El `<select>` está atado a `cityValue` (`sel ? sel.id : 'all'`). Cambia cuando la ciudad se elige desde **cualquier** control (pin, ranking, "Mi ciudad", "Ver en el mapa") y vuelve a "Toda Colombia" al reiniciar.
  - El "3" de mensajes y su `aria-label` son fijos. En producción vienen del conteo real de no leídos.
- **Componente:** "Encabezado de la app". Es el mismo de Agenda, Main y Chat, con tres diferencias que hay que unificar: `z-index` (70 aquí, 5 en Agenda, Main y Chat), margen lateral (`clamp(16px, 4vw, 24px)` aquí, 24 px fijos en Agenda, Main y Chat) y el placeholder y `aria-label` del buscador ("Busca eventos, lugares o artistas" / "Buscar eventos" aquí y en Agenda, "Busca planes, gente o lugares" / "Buscar" en Main y Chat; H41).

#### 2. Contenedor principal (`<main>`)

- **Layout:** `max-width: 1240px; margin: 0 auto; padding: 28px clamp(16px, 4vw, 24px) 48px; display: flex; flex-direction: column; gap: 22px`. Como `max-width` es `content-box`, el ancho total máximo es 1288 px y desde ahí se centra (a 1440 px el contenido arranca en x = 100). Agenda usa `padding: 28px 24px 64px`: el margen inferior aquí es 48 px.
- **Hijos, en orden:** cabecera de la página (sección 3), fila de filtros (4), fila mapa + panel (5 a 12) y "Ciudades con más planes" (13).

#### 3. Cabecera de la página (antetítulo, título, resumen y selector de fecha)

- **Layout:** `div` con `display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 16px`.
  - Bloque de texto: `flex: 1 1 520px; min-width: 0`.
  - Selector de fecha a la derecha, alineado a la base del bloque de texto, solo desde 894 px de ventana. Por debajo baja a su propia línea, alineado a la izquierda.
- **Contenido en orden:**
  1. **Antetítulo** (`<p>`): "Mapa de eventos". `margin: 0 0 8px; display: flex; flex-wrap: wrap; align-items: center; gap: 10px; font-size: .74rem` (11,84 px); `font-weight: 700; letter-spacing: .12em` (1,42 px); `text-transform: uppercase`; color #C23A24. Se ve "MAPA DE EVENTOS". Mide 23,3 px de alto.
     - Dentro va la etiqueta "Nuevo · Todo el país": `background: #F6DC6A; color: #17120F; font-family: 'Archivo', sans-serif; font-weight: 800; font-size: .72rem` (11,52 px); `letter-spacing: .04em` (0,46 px); `padding: 3px 8px`. Sin radio (esquinas rectas). Hereda el `uppercase` del párrafo, así que se lee "NUEVO · TODO EL PAÍS". Mide 159,3 × 23,3 px. El separador es un punto medio "·" (U+00B7).
  2. **Título** (`<h1>`): "Todo lo que pasa en Colombia este finde". `margin: 0; max-width: 21ch; font-family: 'Archivo', sans-serif; font-weight: 900; font-size: clamp(1.9rem, 3.6vw, 2.8rem)` (30,4 a 44,8 px; 44,8 a 1280; 36,86 a 1024; 30,4 a 768 y 390); `letter-spacing: -0.03em; line-height: 1.02`. Ocupa dos líneas ("Todo lo que pasa en / Colombia este finde") desde 360 px, y tres a 320 px (93 px de alto). Es **fijo**: no cambia con la ciudad, la categoría ni la fecha.
  3. **Resumen** (`<p>`): `margin: 8px 0 0; color: #6E6259; max-width: 62ch` (637 px); 15 px, `line-height` 1,5. Texto: `{{introLine}}`.
  4. **Selector de fecha** (`div role="group" aria-label="Fecha"`): `display: flex; background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 999px; padding: 4px`. Mide 309,5 × 48 px. **No** tiene `flex-wrap` ni scroll: a 320 px desborda la página 6 px (H8).
     - Tres botones con `aria-pressed`: "Hoy", "Este finde" y "Próxima semana". Estilo: `height: 38px; border: 0; border-radius: 999px; padding: 0 16px; font-size: .86rem` (13,76 px); `font-weight: 700; white-space: nowrap`.
       - Activo: `background: #17120F; color: #FFFFFF`.
       - Inactivo: `background: transparent; color: #17120F`.
     - Activo por defecto: "Este finde".
- **Datos dinámicos:**
  - `introLine = summary + ', del viernes 9 al lunes festivo 12 de octubre. Toca un punto del mapa para ver qué hay en cada ciudad.'`
  - `summary = planes(total) + ' en ' + ciudades(nCiudadesActivas)`, con `planes(n) = n === 1 ? '1 plan' : n + ' planes'` y `ciudades(n) = n === 1 ? '1 ciudad' : n + ' ciudades'`.
  - `total` es el número de eventos que pasan el filtro de categoría. `nCiudadesActivas` es el número de ciudades con al menos 1 de esos eventos.
  - **No** depende de la ciudad elegida ni de la fecha.
  - Ejemplos: "19 planes en 11 ciudades, del viernes 9 al lunes festivo 12 de octubre. Toca un punto del mapa para ver qué hay en cada ciudad." (Todo); "6 planes en 5 ciudades, …" (Rumba); "1 plan en 1 ciudad, …" (Arte y teatro).
  - El selector de fecha solo cambia cuál botón está marcado (`state.when`). No filtra nada (H39).
- **Componente:** "Cabecera de página" (antetítulo + h1 + bajada). Reutiliza `.eyebrow` del código base y la etiqueta amarilla `.tag`, aquí en versión pequeña. El "Selector segmentado de fecha" es el mismo de Agenda (`Agenda.dc.html:82-86`, mismo estilo).

#### 4. Filtros de categoría

- **Layout:** `div role="group" aria-label="Filtrar por categoría"` con `display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px`. Alto total: 46 px (chips de 42 + 4 de margen). Sin `flex-wrap`: por debajo de 725 px de ventana la fila hace scroll horizontal. La barra de scroll **no** se oculta (el código base sí la ocultaba con `scrollbar-width: none`) y no hay degradado ni flechas que avisen que hay más (H61).
- **Contenido en orden:** 7 botones con `aria-pressed`: "Todo", "Rumba", "Conciertos", "Gratis", "Comida", "Deporte" y "Arte y teatro".
  - Estilo: `flex-shrink: 0; height: 42px; border-radius: 999px; padding: 0 16px; font-size: .9rem` (14,4 px); `font-weight: 500; white-space: nowrap`.
  - Activo: `border: 1px solid #17120F; background: #17120F; color: #FFFFFF`.
  - Inactivo: `border: 1px solid #EAE1D8; background: #FFFFFF; color: #17120F`.
  - "Todo" mide 67,3 × 42 px.
  - Activo por defecto: "Todo".
- **Datos dinámicos:** `filter` vale `all`, `rumba`, `conciertos`, `gratis`, `comida`, `deporte` o `teatro`. Un evento pasa el filtro si `filter === 'all'` o si su lista `tags` contiene el valor. "Gratis" es una etiqueta (`tags: [..., 'gratis']`), no se calcula con el precio.
- **Componente:** "Fila de chips" del código base (`.chips` / `.chip[aria-pressed="true"]`), la misma de Agenda y Bienvenida.

#### 5. Fila mapa + panel lateral

- **Layout:** `div` con `display: flex; flex-wrap: wrap; align-items: stretch; gap: 24px`.
  - Panel del mapa (`<section>`): `flex: 999 1 560px; min-width: 0; box-sizing: border-box`.
  - Panel lateral (`<aside>`): `flex: 1 1 380px; min-width: 0` (`content-box`; con borde, 382 px).
  - Con `flex-grow` 999 contra 1, casi todo el ancho sobrante va al mapa: a 1280 el mapa mide 825,7 px y el panel 382,3 px.
  - Quedan lado a lado desde **1014 px** de ventana (560 + 382 + 24 + 48 de márgenes). Por debajo, el panel baja debajo del mapa a todo el ancho.
  - **Desde 1100 px** (`@media (min-width: 1100px)`), el panel lleva `contain: size`: no aporta alto a la fila, así que se estira al alto del mapa (923,5 px a 1280) y su lista hace scroll interno.
  - **Entre 1014 y 1099 px hay un error del prototipo:** los dos van lado a lado pero sin `contain: size`, así que la fila toma el alto de la lista completa y el panel oscuro del mapa se estira a **4955 px** de alto, con unos 4050 px de oscuro vacío debajo de la leyenda (confirmado a 1024 px: la leyenda termina en y=1236 y el panel en y=5302). En producción el paso a "lista con scroll interno" debe ocurrir en el mismo punto en que se ponen lado a lado.

#### 6. Panel del mapa · controles (`<section aria-label="Mapa de Colombia con los eventos" data-fe="dark">`)

- **Layout del panel completo:**
  - `border-radius: 28px; overflow: hidden; color: #FFFFFF; padding: clamp(14px, 2vw, 20px)` (14 px hasta 700 de ancho, 20 px desde 1000); `display: flex; flex-direction: column; gap: 14px`.
  - Fondo: `radial-gradient(circle at 80% 16%, rgba(214,140,70,.32) 0, transparent 30%), radial-gradient(circle at 14% 90%, rgba(190,70,80,.3) 0, transparent 34%), radial-gradient(ellipse at 4% 8%, rgba(70,30,80,.6) 0, transparent 45%), radial-gradient(circle at 50% 55%, rgba(230,170,80,.1) 0, transparent 42%), #140E10`. Sin borde ni sombra.
  - Tres hijos: controles, lienzo (sección 7) y leyenda (sección 8).
- **Layout de la fila de controles:** `display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px`. Dentro, un grupo izquierdo (`display: flex; flex-wrap: wrap; gap: 8px`) con dos botones y, a la derecha, el grupo de zoom. Alto: 46 px en una fila desde 545 px de ventana; 96 px de 393 a 544 (los dos botones arriba y el zoom abajo); 144 px por debajo de 393 (cada control en su propia línea; así se ve a 390).
- **Contenido en orden:**
  1. **"Toda Colombia"** (`aria-pressed`): `height: 40px; border-radius: 999px; padding: 0 15px; font-size: .84rem` (13,44 px); `font-weight: 700; display: flex; align-items: center; gap: 7px`. Ícono de globo de 16 px (`circle r=9` + `M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18`), trazo 2. Mide 152,8 × 40 px.
     - Marcado (sin ciudad elegida): `border: 1px solid #FFFFFF; background: #FFFFFF; color: #17120F`.
     - Sin marcar (con ciudad): `border: 1px solid rgba(255,255,255,.3); background: rgba(255,255,255,.08); color: #FFFFFF`.
  2. **"Mi ciudad: Bogotá"** (`aria-pressed`): mismo estilo, con ícono de casa de 16 px. Mide 171,7 × 40 px.
     - Marcado solo si la ciudad elegida es Bogotá: blanco con texto #17120F.
     - Si no: translúcido con texto blanco.
     - El texto "Mi ciudad: Bogotá" es **fijo** (H45).
  3. **Grupo de zoom** (`div role="group" aria-label="Zoom del mapa"`): `display: flex; align-items: center; gap: 2px; border: 1px solid rgba(255,255,255,.3); border-radius: 999px; padding: 2px`. Mide 130 × 46 px.
     - "Alejar" (`aria-label="Alejar"`): `width: 40px; height: 40px; border: 0; border-radius: 50%; background: transparent; color: #FFFFFF; display: grid; place-items: center; padding: 0`. Ícono "−" de 18 px (`M5 12h14`), trazo 2,4.
     - Etiqueta de nivel: `<span>` con `min-width: 40px; text-align: center; font-size: .8rem` (12,8 px); `font-weight: 700`; color #D8CEC6. Texto `{{zoomLabel}}`.
     - "Acercar" (`aria-label="Acercar"`): igual, con ícono "+" (`M12 5v14M5 12h14`).
     - Deshabilitado (`disabled`): opacidad 0,4 y cursor normal. "Alejar" en 1× y "Acercar" en 3×.
- **Datos dinámicos:** `zoomLabel = (Z % 1 === 0 ? String(Z) : String(Z).replace('.', ',')) + '×'` → "1×", "1,5×", "2×", "2,5×", "3×". Usa coma decimal y el signo de multiplicar "×" (U+00D7), no la letra "x".
- **Componente:** nuevo "Controles del mapa": botones de alcance tipo pastilla sobre fondo oscuro y un control de zoom segmentado.

#### 7. Panel del mapa · lienzo (silueta, etiquetas, pines y líneas guía)

- **Layout:**
  - **Marco** (`div`): `position: relative; overflow: hidden; border-radius: 20px; padding: 16px 0; border: 1px solid rgba(255,255,255,.07)`. Mide 785,7 × 787,8 a 1280; 689,3 × 787,8 a 768; 330 × 475,5 a 390. **Ojo:** `overflow: hidden` permite que el navegador lo desplace al enfocar un pin fuera de vista (H50: usar `overflow: clip`).
  - **Lienzo** (`div`): `position: relative; width: min(100%, 560px); aspect-ratio: 130 / 175; margin: 0 auto; container-type: inline-size`. Mide 560 × 753,8 cuando hay espacio; 328 × 441,5 a 390; 528 × 710,7 a 1024. Es el contenedor de la consulta `@container` y la base de las unidades `cqw` de los pines.
  - **Capa transformable** (`div data-fx`): `position: absolute; inset: 0; transform-origin: 0 0; transform: {{mapTransform}}; transition: transform 460ms cubic-bezier(.22,.8,.24,1)`. Todo lo que sigue va dentro de esta capa y se mueve con el zoom.
- **Contenido en orden (de atrás hacia adelante):**
  1. **Retícula de puntos** (`aria-hidden`): `position: absolute; inset: -60% -45%; background-image: radial-gradient(rgba(255,255,255,.12) 1px, transparent 1.5px); background-size: 16px 16px`. Se sale del lienzo para que al hacer zoom y desplazar siempre haya puntos. Escala con el zoom: a 3× los puntos se ven 3 veces más grandes y separados.
  2. **Silueta de Colombia** (`<svg viewBox="0 0 130 175" aria-hidden="true">`): `position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; filter: drop-shadow(0 0 22px rgba(243,178,126,.18))`.
     - País: un `path` cerrado (el mismo `d` de 874 caracteres que usan los mini-mapas de Main y Bienvenida; copiarlo literal de `Mapa.dc.html:120`) con `fill="#2E2220" stroke="#8A6A55" stroke-width="1.4" stroke-linejoin="round" vector-effect="non-scaling-stroke"`.
     - Dos líneas de cordillera sin relleno: `stroke="#8FD3D0"` con `stroke-opacity=".32"` y `stroke-width="1.2"` (`:121`), y con `stroke-opacity=".26"` y `stroke-width="1"` (`:122`). Ambas con puntas y uniones redondas y `vector-effect="non-scaling-stroke"`: el grosor del trazo no cambia al hacer zoom.
  3. **Etiquetas geográficas** (7, `aria-hidden`, `data-fe` "sea" o "geo"):
     - Cada una es un ancla de 0 × 0 en `left: {left}%; top: {top}%; z-index: 1; pointer-events: none; transform: scale({inv}); transition: transform 460ms cubic-bezier(.22,.8,.24,1)`.
     - Dentro, un `span` con `position: absolute; left: 0; top: 0; transform: translate(-50%, -50%) rotate({rot}deg); white-space: nowrap; font-size: {fs}; font-weight: 700; letter-spacing: {ls}; text-transform: uppercase; color: {color}`.
     - Mares (#7FA3A6, `.72rem` = 11,52 px, `.22em`): "Mar Caribe" y "Océano Pacífico" (girado −90°).
     - Países (#9C8B80, `.66rem` = 10,56 px, `.14em`): "Panamá", "Venezuela", "Ecuador", "Perú" y "Brasil".
     - Con el lienzo en 420 px o menos (ventana por debajo de 490 px), los países se ocultan y los mares bajan a `.6rem` (9,6 px) con `.12em`.
  4. **Pines** (uno por ciudad con al menos 1 plan con el filtro actual, en el orden de `CITIES`):
     - **Ancla** (`div data-fx`): `position: absolute; left: {left}%; top: {top}%; width: 0; height: 0; z-index: {z}; transform: scale({inv}); transition: transform 460ms cubic-bezier(.22,.8,.24,1)`. El `scale(1/Z)` anula el zoom: los pines y sus nombres miden lo mismo en pantalla a cualquier nivel.
     - **Línea guía** (solo Cartagena, Santa Marta y Villavicencio, que tienen `ox`/`oy` distintos de 0):
       - Segmento (`span aria-hidden data-fx`): `position: absolute; left: 0; top: -1px; height: 2px; width: {lineLen}px; background: rgba(246,220,106,.75); transform-origin: 0 50%; transform: rotate({lineAng}deg); transition: width 460ms ease`.
       - Punto en la ubicación real (`span aria-hidden`): `left: -5px; top: -5px; width: 10px; height: 10px; border-radius: 50%; background: #F6DC6A; box-shadow: 0 0 0 2px #140E10`.
     - **Botón del pin** (`button data-fx` con `aria-label`, `aria-pressed` y `onClick`):
       - `position: absolute; left: {bx}px; top: {by}px; transform: translate(-50%, -50%)`.
       - Tamaño: `width` y `height` `clamp(36px, {cq}cqw, {size}px); box-sizing: border-box; padding: 0; border-radius: 50%; border: 3px solid #140E10`.
       - Color: `background: {bg}; color: {fg}; box-shadow: {ring}`.
       - Texto: `display: grid; place-items: center; font-family: 'Archivo', sans-serif; font-weight: 900; font-size: clamp(13px, {fcq}cqw, {fs}px); line-height: 1`.
       - `transition: left 460ms ease, top 460ms ease, background-color 200ms ease, box-shadow 200ms ease`.
       - Muestra el número de planes (`{{c.count}}`).
     - **Nombre de la ciudad** (`span` **dentro** del botón, así que también es zona de clic): `position: absolute; left: {lx}; top: {ly}; transform: {lt}; white-space: nowrap; background: {labBg}; color: {labFg}; border-radius: 999px; padding: 3px 8px; font-family: 'DM Sans', system-ui, sans-serif; font-size: .72rem` (11,52 px); `font-weight: 700; line-height: 1.3; letter-spacing: 0; box-shadow: 0 2px 8px rgba(0,0,0,.35)`.
- **Datos dinámicos:**
  - **Conteo por ciudad:** `counts[ciudad]` es el número de eventos filtrados de esa ciudad. Solo hay pin si es mayor que 0.
  - **Tamaño:** `size = Math.min(70, 40 + 5 * (n - 1))`, o sea 40 px con 1 plan, 45 con 2, 50 con 3, 65 con 6 y el máximo de 70 desde 7.
    - `cq = (size / 5.6).toFixed(3)`: con el lienzo a 560 px, `cq` cqw es exactamente `size` px.
    - `fs = Math.round(size * 0.36)`: 14, 16, 18 y 23 px. `fcq = (fs / 5.6).toFixed(3)`.
    - En lienzos menores de 560 px, el pin se reduce en proporción, con piso de 36 px y texto con piso de 13 px. A 390 casi todos miden 36 px (Bogotá 38,1); a 1024, 37,7 / 42,4 / 47,1 / 61,3 px.
  - **Desplazamiento anti-choque:** `f = Math.max(0, Math.min(1, (3 - Z) / 2))`, que vale 1 en 1×, 0,75 en 1,5×, 0,5 en 2×, 0,25 en 2,5× y 0 en 3×.
    - `bx = (ox * f).toFixed(1)` y `by = (oy * f).toFixed(1)`, en píxeles de pantalla.
    - `lineLen = (√(ox² + oy²) * f).toFixed(1)` y `lineAng = (atan2(oy, ox) · 180/π).toFixed(1)`.
    - A 1×: Cartagena −38, 18 (línea de 42,0 px a 154,7°); Santa Marta 46, −20 (50,2 px a −23,5°); Villavicencio 28, 30 (41,0 px a 47,0°).
    - A 2×, la mitad. A 3×, 0: el pin vuelve a su sitio real y tapa el punto.
  - **Capas:** `z = elegido ? 60 : 40 - n`. Bogotá 34, Medellín 37, Cali 38 y las de 1 plan 39: los pines chicos quedan encima de los grandes y el elegido encima de todos. Las etiquetas geográficas van en `z-index: 1`.
  - **Colores:**
    - Normal: `bg #F6DC6A`, `fg #17120F`, `ring 0 6px 14px rgba(0,0,0,.4)`, nombre sobre `rgba(20,14,16,.9)` en texto #FFFFFF.
    - Elegido: `bg #C23A24`, `fg #FFFFFF`, `ring 0 0 0 4px rgba(194,58,36,.6), 0 0 0 12px rgba(194,58,36,.22), 0 8px 22px rgba(0,0,0,.45)` (doble halo rojo), nombre sobre #FFFFFF en texto #17120F.
  - **Lado del nombre (`lab`):**

    | `lab` | `left` | `top` | `transform` |
    |---|---|---|---|
    | `right` | `calc(100% + 7px)` | `50%` | `translate(0, -50%)` |
    | `left` | `-7px` | `50%` | `translate(-100%, -50%)` |
    | `below` | `50%` | `calc(100% + 6px)` | `translate(-50%, 0)` |
    | `above` | `50%` | `-6px` | `translate(-50%, -100%)` |

  - **Nombre accesible:** `aria-label = nombre + ', ' + n + (n === 1 ? ' evento' : ' eventos')`, por ejemplo "Bogotá, 6 eventos" y "Leticia, 1 evento". Ojo: dice "evento", mientras el resto de la pantalla dice "plan".
  - **Transformación del mapa** (`mapTransform`):
    - `px = sel ? sel.left : 50`; `py = sel ? sel.top : 50`; `k = sel ? Math.min(1, Math.max(0, Z - 1)) : 0`.
    - `tx = px * (1 - Z) + k * (50 - px)`; `ty = py * (1 - Z) + k * (50 - py)`.
    - Resultado: `'translate(' + tx.toFixed(2) + '%, ' + ty.toFixed(2) + '%) scale(' + Z + ')'`.
    - Sin ciudad, el zoom es hacia el centro: 1,5× → `translate(-25.00%, -25.00%) scale(1.5)`; 3× → `translate(-100.00%, -100.00%) scale(3)`.
    - Con ciudad y Z ≥ 2, la ciudad queda en el centro exacto del lienzo. Con Z = 1,5 queda a medio camino, y con Z = 1 el mapa vuelve al país completo aunque la ciudad siga elegida.
    - `inv = (1 / Z).toFixed(4)` se aplica a pines y etiquetas.
    - No hay límites de paneo: con Leticia a 2× o Barranquilla a 2× se ven zonas vacías (solo retícula) fuera del país.
- **Componente:** nuevo "Mapa de Colombia" con subcomponentes "Silueta" (compartida con los mini-mapas de Main y Bienvenida, mismo `path` y mismas coordenadas de ciudad), "Pin de ciudad con conteo", "Línea guía" y "Etiqueta geográfica". En producción la auditoría sugiere un mapa real con coordenadas (H53 menciona MapLibre, por confirmar) y agrupar marcadores (H47). Si se cambia de motor, conservar el lenguaje visual: fondo #140E10, país #2E2220 con borde #8A6A55, pines amarillos con conteo en Archivo 900 y borde de 3 px #140E10, elegido en rojo con halo, nombres en pastilla oscura y tamaño de pin según el número de planes.

#### 8. Panel del mapa · leyenda

- **Layout:** `div` con `display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px 20px; font-size: .84rem` (13,44 px); color #D8CEC6. Alto: 21,6 px en una línea desde 619 px de ventana; 51 px entre 416 y 618 px y entre 1014 y 1036 px (el total baja a otra línea); 70 px por debajo de 416 (el texto también se parte).
- **Contenido en orden:**
  1. `span` (`display: flex; align-items: center; gap: 10px`) con tres círculos decorativos (`aria-hidden`, `display: flex; align-items: center; gap: 4px`) de 10, 15 y 21 px, todos #F6DC6A con `border-radius: 50%`, seguidos del texto "El tamaño del punto indica cuántos planes hay".
  2. `<b>` con `color: #FFFFFF; font-size: .9rem` (14,4 px), en 700: `{{legendTotal}}`.
- **Datos dinámicos:** `legendTotal = summary` (por ejemplo "19 planes en 11 ciudades"). Cambia con la categoría, no con la ciudad.
- **Componente:** parte del "Mapa de Colombia".

#### 9. Panel lateral · cabecera (`<aside aria-label="Planes en el mapa" data-fe="side">`)

- **Layout del panel:** `background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 24px; overflow: hidden; display: flex; flex-direction: column`. A 1280 mide 382,3 × 923,5 px (mismo alto que el mapa) y la lista hace scroll interno de 790,6 px visibles sobre 4823 px de contenido. Por debajo de 1100 px crece con su contenido (5083 px a 390, 3944 px a 768).
- **Layout de la cabecera:** `div` con `padding: 20px 20px 14px; border-bottom: 1px solid #EAE1D8`. A 1280 mide 380,3 × 130,8 px sin ciudad elegida. Es fija dentro del panel: con scroll interno, solo se mueve la lista.
- **Contenido en orden:**
  1. Antetítulo (`<p>`): `margin: 0 0 4px; font-size: .72rem` (11,52 px); `font-weight: 700; letter-spacing: .12em; text-transform: uppercase`; color #C23A24. Texto `{{panelEyebrow}}`.
  2. Título (`<h2>`): `margin: 0; font-family: 'Archivo', sans-serif; font-weight: 900; font-size: 1.55rem` (24,8 px); `letter-spacing: -0.02em; line-height: 1.1`. Texto `{{panelName}}` seguido de un `span` en DM Sans 700, `font-size: 1rem`, `letter-spacing: 0`, color #6E6259, con "· {{panelCount}}". Se ve "Toda Colombia · 19 planes".
  3. Bajada (`<p>`): `margin: 6px 0 0; font-size: .86rem` (13,76 px); color #6E6259. Texto `{{panelSub}}`.
  4. Solo con ciudad elegida, el botón "Ver todo Colombia": `margin-top: 10px; height: 36px; border-radius: 999px; border: 1px solid #17120F; background: #FFFFFF; color: #17120F; padding: 0 14px; font-size: .82rem` (13,12 px); `font-weight: 700; display: inline-flex; align-items: center; gap: 6px`. Chevrón izquierdo de 15 px (`M15 18l-6-6 6-6`), trazo 2,2. Texto a corregir a "Ver toda Colombia" (H62).
- **Datos dinámicos:**
  - `panelEyebrow`: "Todo el país" sin ciudad (se ve "TODO EL PAÍS") / "Ciudad elegida" con ciudad ("CIUDAD ELEGIDA").
  - `panelName`: "Toda Colombia" / nombre de la ciudad ("Bogotá").
  - `panelCount = planes(list.length)`: número de tarjetas que hay debajo ("19 planes", "6 planes", "1 plan", "0 planes").
  - `panelSub`: sin ciudad, "Ordenados por ciudad y fecha. Usa «Ver en el mapa» para ubicar cada plan." (con comillas angulares « »); con ciudad, `'Lo que hay este finde en ' + nombre + ', por fecha.'`, por ejemplo "Lo que hay este finde en Bogotá, por fecha.".
- **Componente:** nuevo "Panel de resultados del mapa" (cabecera fija + lista con scroll).

#### 10. Panel lateral · estado vacío (condicional)

- **Cuándo aparece:** cuando la lista queda en 0. Con los datos de ejemplo solo pasa si hay una ciudad elegida **y** una categoría sin planes en ella, por ejemplo "Arte y teatro" + Pasto, "Gratis" + Cartagena o "Rumba" + Leticia. Sin ciudad, todas las categorías tienen al menos 1 plan, así que el mensaje sin ciudad no se ve en la demo, pero hay que implementarlo.
- **Layout:** contenedor de lista (`div data-fe="list"`: `position: relative; flex: 1 1 auto; padding: 0 20px 6px`) y, dentro, un bloque con `padding: 36px 6px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 10px`.
- **Contenido en orden:**
  1. Círculo de ícono: `width: 52px; height: 52px; border-radius: 50%; background: #FBF7F3; border: 1px solid #EAE1D8; display: grid; place-items: center; color: #6E6259`, con un mapa plegado de 22 px (`M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z` + `M9 4v14M15 6v14`, algo distinto del ícono de la navegación), trazo 2.
  2. Mensaje (`<p>`, 700, 15 px): `{{emptyMsg}}`.
  3. Pista (`<p>`, `font-size: .86rem`, color #6E6259): `{{emptyHint}}`.
  4. Acciones (`display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-top: 4px`):
     - Si hay categoría activa: "Ver todas las categorías". `height: 40px; border-radius: 999px; border: 0; background: #17120F; color: #FFFFFF; padding: 0 16px; font-size: .84rem; font-weight: 700`.
     - Si hay ciudad elegida: "Ver todo Colombia". Mismo tamaño, con `border: 1px solid #17120F; background: #FFFFFF; color: #17120F`.
- **Datos dinámicos:**
  - `what = filter === 'all' ? 'planes' : (filter === 'gratis' ? 'planes gratis' : 'planes de ' + etiquetaDelChip)`.
  - `emptyMsg = 'No hay ' + what + (sel ? ' en ' + sel.name : '') + ' este finde.'` Ejemplos: "No hay planes de Arte y teatro en Pasto este finde.", "No hay planes gratis en Cartagena este finde.", "No hay planes de Rumba en Leticia este finde.", "No hay planes de Deporte en Leticia este finde.", "No hay planes de Comida en Cali este finde." y "No hay planes de Conciertos en Medellín este finde.". Sin ciudad: "No hay planes de Rumba este finde.". La etiqueta del chip conserva su mayúscula inicial dentro de la frase.
  - `emptyHint`: con ciudad, "Prueba otra categoría o mira todo Colombia." (H62: "toda Colombia"); sin ciudad, "Prueba otra categoría.".
  - En este estado la cabecera dice, por ejemplo, "CIUDAD ELEGIDA / Pasto · 0 planes / Lo que hay este finde en Pasto, por fecha." y repite el botón "Ver todo Colombia". Quedan **dos** botones "Ver todo Colombia" a la vista.
- **Componente:** "Estado vacío con acciones" (el mismo patrón de Main y Agenda).

#### 11. Panel lateral · encabezado de ciudad (condicional)

- **Cuándo aparece:** solo sin ciudad elegida, antes del primer evento de cada ciudad.
- **Layout:** `<h3>` con `margin: 16px 0 0; padding-bottom: 6px; display: flex; align-items: baseline; justify-content: space-between; gap: 10px; font-size: .74rem` (11,84 px); `font-weight: 700; letter-spacing: .1em; text-transform: uppercase`; color #17120F; `border-bottom: 2px solid #17120F`. Mide 340,3 × 25,8 px a 1280.
- **Contenido en orden:**
  - A la izquierda, el nombre de la ciudad ("BOGOTÁ").
  - A la derecha, un `span` en 500 con `letter-spacing: .04em` y color #6E6259 que contiene un texto oculto ", " (para que el lector diga "Bogotá, 6 planes") y el conteo ("6 PLANES", "1 PLAN").
- **Datos dinámicos:** `headCount = planes(counts[ciudad])`, el conteo con el filtro actual.
- **Componente:** nuevo "Separador de grupo" (h3 con regla de 2 px).

#### 12. Panel lateral · tarjeta compacta de evento (`<article>`, una por plan)

- **Orden de la lista:**
  - Se filtra por categoría y, si hay ciudad elegida, por ciudad.
  - Se ordena por el orden fijo de `CITIES` (Bogotá, Medellín, Cali, Barranquilla, Cartagena, Santa Marta, Bucaramanga, Pereira, Villavicencio, Pasto, Leticia) y luego por día (`d`) ascendente. Los empates conservan el orden de `EVENTS`.
  - Resultado sin filtros: e1, e2, e3, e6, e4, e5 | e7, e9, e8 | e10, e11 | e12 | e13 | e14 | e15 | e16 | e17 | e18 | e19.
  - **No** se ordena por número de planes, aunque coincide al principio.
  - No hay paginación: se pintan las 19 (H47).
- **Layout:** `display: flex; gap: 14px; padding: 14px 0; border-bottom: 1px solid #F1EAE3`. A 1280 mide 340,3 × 240,8 px.
  - **Miniatura:** `position: relative; width: 88px; height: 88px; flex-shrink: 0; border-radius: 14px; overflow: hidden`.
    - "Foto": `span role="img" aria-label="[Foto del evento]"` con `position: absolute; inset: 0; background: radial-gradient(circle at 70% 30%, {bg1} 0, transparent 58%), {bg2}`.
    - Placa de fecha: `position: absolute; top: 6px; left: 6px; background: #FFFFFF; border-radius: 8px; padding: 4px 6px 3px; text-align: center; line-height: 1; min-width: 32px; box-sizing: border-box`. Mide 33 × 38 px. Lleva el día (`<b>`, `display: block`, Archivo 900, `font-size: 1rem`) y el mes "oct" (`.58rem` = 9,28 px, 700, `uppercase`, `letter-spacing: .06em`, #6E6259). El mes "oct" está **escrito fijo** en la plantilla.
  - **Columna de texto:** `flex: 1; min-width: 0; display: flex; flex-direction: column`.
- **Contenido en orden (columna de texto):**
  1. Categoría (`span`): `font-size: .68rem` (10,88 px); 700, `letter-spacing: .1em`, `uppercase`, #C23A24. Texto `{{e.cat}}`, por ejemplo "RUMBA".
  2. Título (enlace a `Evento.dc.html`): `font-size: .98rem` (15,68 px); 700; `line-height: 1.25; margin: 2px 0 3px`. Color #17120F (heredado de la regla global `a`). Sin recorte: se parte en las líneas que necesite.
  3. Lugar (`span`): `font-size: .8rem` (12,8 px); `line-height: 1.35`; #6E6259. Texto `{{e.v}} · {{cityName}}`, por ejemplo "Galería Café Libro · Zona T · Bogotá".
  4. Fila de compra (`display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: 8px`):
     - Precio (`span`, 700, `.88rem` = 14,08 px, `line-height: 1.2`): `{{priceLabel}}`. Debajo, un `span` `display: block`, 400, `.7rem` (11,2 px), #6E6259, con la boletera u organizador `{{e.b}}`. Sin `tabular-nums` (el `.price` del código base sí lo tenía).
     - CTA (enlace): `display: inline-flex; align-items: center; height: 36px; box-sizing: border-box; background: #C23A24; color: #FFFFFF; border-radius: 999px; padding: 0 14px; font-size: .8rem` (12,8 px); `font-weight: 700; white-space: nowrap; flex-shrink: 0`. Texto `{{cta}}`, con `aria-label="{{ctaAria}}"`. "Comprar" mide 83,8 × 36.
  5. Fila de acciones (`display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-top: 10px`):
     - **"Repostear" / "Reposteado"** (`aria-pressed`): `height: 36px; border-radius: 999px; border: 1px solid #17120F; padding: 0 12px; font-size: .78rem` (12,48 px); `font-weight: 700; display: flex; align-items: center; gap: 6px`. Ícono de repost de 14 px (dos flechas en bucle), trazo 2,2.
       - Sin repostear: `background: #FFFFFF; color: #17120F`, texto "Repostear" (108,6 × 36 px).
       - Reposteado: `background: #17120F; color: #FFFFFF`, texto "Reposteado".
     - **Guardar** (`aria-label="Guardar {{e.t}}"`, `aria-pressed`): `width: 36px; height: 36px; padding: 0; border-radius: 50%; border: 1px solid #EAE1D8; background: #FFFFFF; display: grid; place-items: center`. Corazón de 16 px, trazo 2, uniones redondas.
       - Sin guardar: color #17120F, `fill="none"`.
       - Guardado: color #C23A24, `fill="currentColor"` (corazón relleno rojo).
       - El borde no cambia.
     - **"Ver en el mapa"** (solo sin ciudad elegida; `aria-label="Ver en el mapa: {{cityName}}"`): `margin-left: auto; height: 36px; border: 0; background: transparent; color: #C23A24; padding: 0 2px; font-size: .78rem; font-weight: 700; display: flex; align-items: center; gap: 4px`. Pin de 14 px, trazo 2,2. Mide 112,3 × 36. Por `margin-left: auto`, va pegado a la derecha. Si no cabe en la línea (en el panel de 380 px y en celular), baja a una segunda línea, también a la derecha.
- **Datos dinámicos:**
  - `priceLabel = e.p ? 'Desde $' + e.p.toLocaleString('es-CO') : 'Gratis'` → "Desde $45.000", "Desde $180.000", "Gratis". `es-CO` agrupa con punto también los números de 4 cifras ("$5.000"). No usar el formato `currency` de `Intl`, que mete un espacio ("$ 45.000").
  - `cta = e.p ? 'Comprar' : 'Ver plan'`.
  - `ctaAria = e.p ? 'Comprar boletas para ' + e.t : 'Ver plan: ' + e.t`.
  - `repostLabel = reposteado ? 'Reposteado' : 'Repostear'`. Arranca reposteado solo e2 ("Festival de jazz al parque").
  - `showMapBtn = !sel`: el botón "Ver en el mapa" desaparece de todas las tarjetas en cuanto hay ciudad elegida (H7 pide no ocultarlo).
- **Componente:** "Tarjeta compacta horizontal de evento". Es la que H47 pide copiar a Agenda en celular (miniatura de 88 px). Reutiliza `.date`, `.cat`, `.price`, `.ticket` y `.save` del código base. Es nuevo el botón "Repostear" de alternancia, que debe unificarse con el de Agenda (H41).

#### 13. "Ciudades con más planes"

- **Layout:** `<section aria-labelledby="fe-ciudades">` con `display: flex; flex-direction: column; gap: 14px; padding-top: 14px` (más los 22 px de separación de `main`).
  - Cabecera: `display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 6px 16px`.
  - Fila de ciudades: `div role="group" aria-label="Ciudades"` con `display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px`. Sin `flex-wrap`, sin degradado y sin flechas. El contenido mide 1499 px con las 11 ciudades y el contenedor nunca pasa de 1240 px, así que con "Todo" la fila **siempre** hace scroll horizontal, en cualquier ancho. A 1280, Villavicencio sale cortada y Pasto y Leticia no se ven (H61). Con filtros que dejan menos ciudades puede caber entera.
- **Contenido en orden:**
  1. `<h2 id="fe-ciudades">` "Ciudades con más planes": Archivo 900, `font-size: clamp(1.4rem, 2.4vw, 1.75rem)` (22,4 a 28 px), `letter-spacing: -0.02em; line-height: 1.1; margin: 0`.
  2. Pista: "Toca una ciudad para verla en el mapa" (`font-size: .86rem`, #6E6259). Desde unos 600 px va a la derecha del título; en celular, debajo.
  3. Un botón por ciudad activa (`aria-pressed`): `flex-shrink: 0; height: 44px; border-radius: 999px; padding: 0 7px 0 16px; font-size: .9rem; font-weight: 700; display: flex; align-items: center; gap: 10px`.
     - Normal: `border: 1px solid #EAE1D8; background: #FFFFFF; color: #17120F`.
     - Elegido: `border: 1px solid #17120F; background: #17120F; color: #FFFFFF`.
     - Dentro, el nombre y una burbuja de conteo: `min-width: 30px; height: 30px; box-sizing: border-box; padding: 0 8px; border-radius: 999px; background: #F6DC6A; color: #17120F; display: grid; place-items: center; font-size: .8rem`. La burbuja sigue amarilla aunque el botón esté elegido.
     - "Bogotá 6" mide 113,9 × 44.
- **Datos dinámicos:** `ranking` son las ciudades activas ordenadas por `counts` de mayor a menor. Los empates conservan el orden de `CITIES` (ordenamiento estable).
  - Con "Todo": Bogotá 6, Medellín 3, Cali 2, Barranquilla 1, Cartagena 1, Santa Marta 1, Bucaramanga 1, Pereira 1, Villavicencio 1, Pasto 1, Leticia 1.
  - Con los demás filtros, ver "Datos de ejemplo".
- **Diferencias con la fila de ciudades de Agenda** (`Agenda.dc.html:91-99`), que hay que unificar: allá miden 42 px, el texto va en 500, la burbuja mide 28 px en `.78rem` con color variable, e incluye "Toda Colombia" con pin. Aquí miden 44 px, el texto va en 700, la burbuja mide 30 px, es siempre amarilla y no hay opción "Toda Colombia".
- **Componente:** "Chip de ciudad con conteo" (compartido con Agenda y Bienvenida).

#### 14. Pie de página

- **Layout:** `<footer style="border-top: 1px solid #EAE1D8">` y, dentro, `max-width: 1240px; margin: 0 auto; padding: 24px clamp(16px, 4vw, 24px) 36px; display: flex; flex-wrap: wrap; gap: 10px 28px; justify-content: space-between; font-size: .85rem` (13,6 px); color #6E6259. Agenda usa `padding: 28px 24px 40px` y `gap: 12px 28px`.
- **Contenido:**
  - "© 2026 Fulleventos · Colombia"
  - "Compra segura dentro de Fulleventos. Las boletas las emite la boletera oficial del evento o el organizador."
  - A 1280 van en una línea, en los extremos. A 390 se apilan (alto del pie: 132 px).
- **Componente:** debe reemplazarse por el pie legal común (H5) con el texto condicionado al modo de compra (H1). Ver "Correcciones".

### Datos de ejemplo

**Ciudades (`CITIES`, en este orden; el orden manda en los pines, la lista y los desempates del ranking).** `left` y `top` son porcentajes del lienzo de 130 × 175. `ox` y `oy` son el desplazamiento del pin en px a 1×. `lab` es el lado del nombre.

| id | name | left | top | ox | oy | lab | Planes (Todo) |
|---|---|---|---|---|---|---|---|
| bogota | Bogotá | 41.8 | 47.4 | 0 | 0 | right | 6 |
| medellin | Medellín | 30.2 | 38.6 | 0 | 0 | left | 3 |
| cali | Cali | 22.8 | 54.6 | 0 | 0 | below | 2 |
| barranquilla | Barranquilla | 36.2 | 11.7 | 0 | 0 | above | 1 |
| cartagena | Cartagena | 30.9 | 14.9 | −38 | 18 | below | 1 |
| santamarta | Santa Marta | 40.8 | 10.1 | 46 | −20 | right | 1 |
| bucaramanga | Bucaramanga | 49.1 | 33.6 | 0 | 0 | right | 1 |
| pereira | Pereira | 29.3 | 46.8 | 0 | 0 | left | 1 |
| villavicencio | Villavicencio | 45.2 | 50.6 | 28 | 30 | right | 1 |
| pasto | Pasto | 17.1 | 67.4 | 0 | 0 | below | 1 |
| leticia | Leticia | 73.5 | 97 | 0 | 0 | right | 1 |

Las mismas coordenadas están en los mini-mapas de Main (`:331`) y Bienvenida (`:283`).

**Eventos (`EVENTS`, 19).** Campos: `id`, `t` (título), `cat` (categoría visible), `tags` (filtros), `city`, `d` (día de octubre de 2026), `v` (lugar), `p` (precio en COP; 0 = gratis), `b` (boletera u organizador) y `bg1` / `bg2` (colores de la "foto"). Las dos últimas columnas son textos derivados.

| id | t | cat | tags | city | d | v | p | b | bg1 | bg2 | Precio visible | CTA |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| e1 | Noche de salsa y boleros en vivo | Rumba | rumba | bogota | 9 | Galería Café Libro · Zona T | 45000 | TuBoleta | #E8A04F | #B5372B | Desde $45.000 | Comprar |
| e2 | Festival de jazz al parque | Conciertos | conciertos, gratis | bogota | 10 | Parque El Country · Usaquén | 0 | Idartes | #4F6DD8 | #1E2550 | Gratis | Ver plan |
| e3 | Rock en el Movistar Arena | Conciertos | conciertos | bogota | 10 | Movistar Arena · Salitre | 180000 | TuBoleta | #D9452F | #2B0F12 | Desde $180.000 | Comprar |
| e4 | Santa Fe vs. Millonarios | Deporte | deporte | bogota | 11 | Estadio El Campín · Teusaquillo | 60000 | Ticketmaster | #C4302B | #1F3A8A | Desde $60.000 | Comprar |
| e5 | Stand-up: risas de domingo | Arte y teatro | teatro | bogota | 11 | Teatro Libre · Chapinero | 55000 | TuBoleta | #EE93BC | #5A2340 | Desde $55.000 | Comprar |
| e6 | Mercado gastronómico de las Américas | Comida | comida, gratis | bogota | 10 | Plaza de los Artesanos | 0 | Entrada libre | #F6DC6A | #C46A2B | Gratis | Ver plan |
| e7 | Noche de reguetón en Provenza | Rumba | rumba | medellin | 9 | Barrio Provenza · El Poblado | 50000 | Fever | #6B3FA0 | #0E0A1A | Desde $50.000 | Comprar |
| e8 | Atlético Nacional vs. Junior | Deporte | deporte | medellin | 12 | Estadio Atanasio Girardot | 70000 | Ticketmaster | #3E9B63 | #0F2A1C | Desde $70.000 | Comprar |
| e9 | Milonga en Manrique | Rumba | rumba | medellin | 10 | Casa del tango · Manrique | 25000 | TuBoleta | #B88A5A | #3A2414 | Desde $25.000 | Comprar |
| e10 | Viejoteca de salsa caleña | Rumba | rumba | cali | 10 | Juanchito | 40000 | TuBoleta | #F3B27E | #8A2E1F | Desde $40.000 | Comprar |
| e11 | Concierto de músicas del Pacífico | Conciertos | conciertos | cali | 11 | Teatro Municipal | 35000 | TuBoleta | #8FD3D0 | #12343A | Desde $35.000 | Comprar |
| e12 | Vallenato en el Gran Malecón | Conciertos | conciertos, gratis | barranquilla | 10 | Gran Malecón del Río | 0 | Entrada libre | #F6DC6A | #1E5A7A | Gratis | Ver plan |
| e13 | Noche de champeta en Getsemaní | Rumba | rumba | cartagena | 9 | Plaza de la Trinidad · Getsemaní | 30000 | Fever | #EE93BC | #4A1A3A | Desde $30.000 | Comprar |
| e14 | Atardecer electrónico en la playa | Rumba | rumba | santamarta | 10 | Playa El Rodadero | 90000 | Fever | #F3B27E | #1E2550 | Desde $90.000 | Comprar |
| e15 | Festival de cerveza artesanal | Comida | comida | bucaramanga | 11 | Parque San Pío | 25000 | TuBoleta | #E8A04F | #5A3A14 | Desde $25.000 | Comprar |
| e16 | Noche de trova en el lago | Conciertos | conciertos, gratis | pereira | 9 | Parque Lago Uribe Uribe | 0 | Entrada libre | #A3A8F0 | #2A2550 | Gratis | Ver plan |
| e17 | Joropo en Los Fundadores | Conciertos | conciertos, gratis | villavicencio | 11 | Parque Los Fundadores | 0 | Entrada libre | #B9E07A | #2A3A14 | Gratis | Ver plan |
| e18 | Concierto andino en la plaza | Conciertos | conciertos, gratis | pasto | 10 | Plaza de Nariño | 0 | Entrada libre | #8FD3D0 | #2A1F3A | Gratis | Ver plan |
| e19 | Música y comida en el malecón del Amazonas | Comida | comida, gratis | leticia | 11 | Malecón de Leticia | 0 | Entrada libre | #B9E07A | #12343A | Gratis | Ver plan |

Calendario: viernes 9, sábado 10, domingo 11 y lunes festivo 12 de octubre de 2026. Los mismos 19 eventos (en sus campos base) están copiados en Agenda, Bienvenida y Main (H53).

**Categorías (`chipDefs`):**

| id | Texto del chip | Planes | Ciudades | Ranking resultante | Orden de la lista |
|---|---|---|---|---|---|
| all | Todo | 19 | 11 | Bogotá 6, Medellín 3, Cali 2, Barranquilla 1, Cartagena 1, Santa Marta 1, Bucaramanga 1, Pereira 1, Villavicencio 1, Pasto 1, Leticia 1 | e1, e2, e3, e6, e4, e5, e7, e9, e8, e10, e11, e12, e13, e14, e15, e16, e17, e18, e19 |
| rumba | Rumba | 6 | 5 | Medellín 2, Bogotá 1, Cali 1, Cartagena 1, Santa Marta 1 | e1, e7, e9, e10, e13, e14 |
| conciertos | Conciertos | 7 | 6 | Bogotá 2, Cali 1, Barranquilla 1, Pereira 1, Villavicencio 1, Pasto 1 | e2, e3, e11, e12, e16, e17, e18 |
| gratis | Gratis | 7 | 6 | Bogotá 2, Barranquilla 1, Pereira 1, Villavicencio 1, Pasto 1, Leticia 1 | e2, e6, e12, e16, e17, e18, e19 |
| comida | Comida | 3 | 3 | Bogotá 1, Bucaramanga 1, Leticia 1 | e6, e15, e19 |
| deporte | Deporte | 2 | 2 | Bogotá 1, Medellín 1 | e4, e8 |
| teatro | Arte y teatro | 1 | 1 | Bogotá 1 | e5 |

Con "Rumba", la lista y los pines siguen el orden de `CITIES` (Bogotá primero), pero el ranking pone a Medellín (2) de primera.

**Fechas (`whens`):** `hoy` → "Hoy"; `finde` → "Este finde" (por defecto); `semana` → "Próxima semana".

**Etiquetas geográficas (`geo`):**

| t | left % | top % | rot | color | fs | ls | fe |
|---|---|---|---|---|---|---|---|
| Mar Caribe | 16 | 7 | 0 | #7FA3A6 | .72rem | .22em | sea |
| Océano Pacífico | 6 | 48 | −90 | #7FA3A6 | .72rem | .22em | sea |
| Panamá | 8 | 24 | 0 | #9C8B80 | .66rem | .14em | geo |
| Venezuela | 86 | 24 | 0 | #9C8B80 | .66rem | .14em | geo |
| Ecuador | 9 | 82 | 0 | #9C8B80 | .66rem | .14em | geo |
| Perú | 44 | 93 | 0 | #9C8B80 | .66rem | .14em | geo |
| Brasil | 90 | 80 | 0 | #9C8B80 | .66rem | .14em | geo |

**Transformación del mapa con cada ciudad elegida** (útil como caso de prueba; a 1× siempre `translate(0.00%, 0.00%) scale(1)`):

| Ciudad | 1,5× | 2× | 2,5× | 3× |
|---|---|---|---|---|
| Bogotá | −16.80%, −22.40% | −33.60%, −44.80% | −54.50%, −68.50% | −75.40%, −92.20% |
| Medellín | −5.20%, −13.60% | −10.40%, −27.20% | −25.50%, −46.50% | −40.60%, −65.80% |
| Cali | 2.20%, −29.60% | 4.40%, −59.20% | −7.00%, −86.50% | −18.40%, −113.80% |
| Barranquilla | −11.20%, 13.30% | −22.40%, 26.60% | −40.50%, 20.75% | −58.60%, 14.90% |
| Cartagena | −5.90%, 10.10% | −11.80%, 20.20% | −27.25%, 12.75% | −42.70%, 5.30% |
| Santa Marta | −15.80%, 14.90% | −31.60%, 29.80% | −52.00%, 24.75% | −72.40%, 19.70% |
| Bucaramanga | −24.10%, −8.60% | −48.20%, −17.20% | −72.75%, −34.00% | −97.30%, −50.80% |
| Pereira | −4.30%, −21.80% | −8.60%, −43.60% | −23.25%, −67.00% | −37.90%, −90.40% |
| Villavicencio | −20.20%, −25.60% | −40.40%, −51.20% | −63.00%, −76.50% | −85.60%, −101.80% |
| Pasto | 7.90%, −42.40% | 15.80%, −84.80% | 7.25%, −118.50% | −1.30%, −152.20% |
| Leticia | −48.50%, −72.00% | −97.00%, −144.00% | −133.75%, −192.50% | −170.50%, −241.00% |

Sin ciudad: 1,5× → −25%, −25%; 2× → −50%, −50%; 2,5× → −75%, −75%; 3× → −100%, −100%.

**Textos fijos de usuario:** "Mi ciudad: Bogotá" (ciudad de Camila), insignia "3" de mensajes y avatar "CV" (#8FD3D0).


---
Ver también: [5. Responsive](../05-responsive.md) · [6. Estados interactivos](../06-estados-interactivos.md) · [8. Detalles finos](../08-detalles-finos.md)
