[← Índice del handoff](../README.md)

## 4.9 Mensajes (chat) (`Chat.dc.html`)

**Ruta propuesta:** `/mensajes` para la bandeja y `/mensajes/:conversacion` para una conversación abierta (por ejemplo `/mensajes/salseros-de-jueves` o `/mensajes/galeria-cafe-libro`). En el prototipo todo es estado interno: la URL nunca cambia, siempre abre en "Salseros de jueves" y por eso "Escribir al organizador" de Evento cae en el parche y no en Galería Café Libro (H42). La conversación abierta debe viajar en la dirección para que los enlaces de Evento, Main y Perfil abran la conversación correcta y para que "Volver" funcione en celular. Las ventanas "Nuevo parche" y "Nuevo chat" pueden quedar como estado de la página · **Quién la ve:** solo el usuario con sesión (avatar "CV" de Camila Vargas, "Crear evento", insignia de chats sin leer). No tiene versión pública: un visitante que llegue a `/mensajes` debe ir a "Entrar" (H12, H33) y volver aquí después · **Propósito:** coordinar los planes. En una sola pantalla se ven la bandeja de conversaciones (personas, parches y cuentas de organizadores verificados), la conversación abierta con su "plan fijado" (el evento del parche y cuántos ya tienen boleta) y un panel de información con los miembros, "Dividir pago del parche", silenciar y salir. Desde aquí se crean parches nuevos ligados a un evento y chats con una persona.

**Ficha técnica del archivo**
- `<title>`: "Fulleventos · Mensajes". `<html lang="es">`. Tablero del lienzo: "7 · Mensajes · Chats y parches", 1280 × 900 (`data-props='{"$preview":{"width":1280,"height":900}}'`). Está pensada para caber exacta en la ventana en escritorio: no hay scroll de página.
- Fuentes (Google Fonts, `display=swap`, `preconnect` solo a `fonts.googleapis.com`; el código base también hacía `preconnect` a `fonts.gstatic.com` con `crossorigin`): **Archivo** 800 y 900; **DM Sans** con eje óptico `opsz 9..40` en 400, 500 y 700. Verificado en Chromium: se cargan exactamente "Archivo 800, Archivo 900, DM Sans 400, DM Sans 500, DM Sans 700".
- Estilos globales del `<helmet>` (las únicas reglas de hoja de estilo; todo lo demás es inline). Copiarlos tal cual:
  - `body{margin:0;background:#FBF7F3}`
  - `a{color:#17120F;text-decoration:none}a:hover{color:#C23A24}`. El hover solo se nota en los enlaces que **no** traen `color` inline (lista exacta en "Estados e interacciones").
  - `button{font-family:inherit;cursor:pointer}`
  - `button:disabled{cursor:default}`. A diferencia de Mapa, **no** baja la opacidad: el aspecto deshabilitado lo dan los colores inline (#EAE1D8 / #6E6259).
  - `input,textarea,select{font-family:inherit}` (no hay ningún `textarea` en la pantalla).
  - `button:focus-visible,a:focus-visible,select:focus-visible,input:focus-visible{outline:3px solid #C23A24;outline-offset:2px}`. La parte `input:focus-visible` **no tiene efecto**: los 4 campos de texto llevan `outline: 0` inline, que gana (H51).
  - `@media (min-width: 900px){[data-ch~="root"]{height:100vh}[data-ch~="shell"]{min-height:520px}[data-ch~="back"]{display:none !important}}`
  - `@media (min-width: 1180px){[data-info-wide="off"]{display:none !important}[data-ch~="tg-narrow"]{display:none !important}}`
  - `@media (max-width: 1179px){[data-ch~="tg-wide"]{display:none !important}[data-info-narrow="off"]{display:none !important}[data-ch~="list"]{width:300px !important}[data-ch~="info"]{position:absolute !important;top:0;right:0;bottom:0;z-index:6;width:min(320px, 100%) !important;box-shadow:-16px 0 40px rgba(23,18,15,.16)}}`
  - `@media (max-width: 899px){[data-ch~="hdr"]{position:static !important}[data-ch~="main"]{padding:12px 16px 16px !important}[data-ch~="shell"]{overflow:visible !important;border-radius:20px !important}[data-ch~="list"]{width:auto !important;flex:1 1 auto !important;border-right:0 !important;border-radius:20px}[data-pane="list"] [data-ch~="conv"]{display:none !important}[data-pane="chat"] [data-ch~="list"]{display:none !important}[data-ch~="conv"]{border-radius:20px}[data-ch~="stream"]{overflow:visible !important;padding:8px 12px 16px !important}[data-ch~="topbar"]{position:sticky;top:0;z-index:4;border-radius:20px 20px 0 0}[data-ch~="composer"]{position:sticky;bottom:0;z-index:4;border-radius:0 0 20px 20px}[data-ch~="info"]{position:fixed !important;inset:0;z-index:30;width:auto !important;box-shadow:none}[data-ch~="send"]{padding:0 !important;width:44px}[data-ch~="sendtxt"]{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}}`
  - `@media (prefers-reduced-motion: reduce){[data-fx]{transition:none !important}}`: lo cumplen 3 tipos de elemento marcados con `data-fx` (barra del plan fijado, relleno de cada opción de encuesta y perilla del interruptor de silenciar).
- **No** hay `<meta name="viewport">` (H35) ni `* { box-sizing: border-box }`. Botones, `select` e `input type="search"` son `border-box` por defecto del navegador; las cajas con `box-sizing: border-box` explícito están indicadas en cada sección. Las tres columnas del "shell" son `content-box`: la lista mide 331 px con su borde derecho (330 + 1) y el panel de información 297 px con su borde izquierdo (296 + 1).
- **Unidades:** el contenedor raíz fija `font-size: 15px` y `line-height: 1.5`, pero los `rem` se calculan sobre la raíz del documento (16 px, verificado). Todas las conversiones de este documento usan 16 px por rem. Como el `line-height` es un número (1,5), cada elemento con tamaño propio hereda 1,5 × su tamaño salvo que fije otro.
- **Contenedor raíz** (`data-ch="root"`): `position: relative; min-height: 100vh; display: flex; flex-direction: column; background: #FBF7F3; color: #17120F; font-family: 'DM Sans', system-ui, sans-serif; font-size: 15px; line-height: 1.5`. Desde 900 px además `height: 100vh`: la página no hace scroll y cada columna tiene su propio scroll. Por debajo de 900 px el alto es libre y la página entera hace scroll.
- **Hoy ficticio:** los datos suponen que hoy es **martes 6 de octubre de 2026** ("Faltan 3 días" para el viernes 9, "Ayer" = lunes 5, "Dom 4 oct", "Sáb 3 oct"). Las fechas relativas y las horas son texto fijo (H53).
- **Comentarios de intención que deja el código** (son las razones de diseño; conservarlas):
  - "Appends Camila's items to a conversation, marks it read and moves it to the top of the list" (lo que hace enviar cualquier cosa).
  - "People (same names, initials and colors as the rest of the canvas)".
  - "Shared events (same data as Agenda / Main / Mapa)".
  - "Conversations. Groups are parches tied to an event; tickets = who already has a boleta."
  - "Shared events with a person = events of the parches you both belong to" (cómo se calcula "Planes en común").
  - "Info panel visibility: wide screens show it by default; narrow screens open it as a drawer".

### Navegación de entrada y salida

| Elemento | Destino | Notas |
|---|---|---|
| **Entrada:** ícono "Mensajes, 3 sin leer" del encabezado de Main (`Main.dc.html:59`), Agenda (`:56`), Mapa (`:62`), Evento (`:42`) y Perfil (`:29`) | `Chat.dc.html` → `/mensajes` | El `aria-label` de las otras pantallas dice "Mensajes, 3 sin leer" (texto fijo); aquí dice "Mensajes, 3 chats sin leer" (calculado). Unificar con el conteo real de **conversaciones** sin leer. |
| **Entrada:** "Mensajes" con insignia "3" del menú lateral de Main (`Main.dc.html:96`) | `/mensajes` | — |
| **Entrada:** "Tus parches" de Main: "Salseros de jueves · 12 miembros · 2 nuevos" (`:106`), "Rockeros del Arena · 8 miembros" (`:109`), "Clásico capitalino · 4 de 6 cupos" (`:112`) | `/mensajes` | Los tres abren siempre "Salseros de jueves". Producción: `/mensajes/:parche`. Main dice "2 nuevos" y aquí Salseros tiene "3 mensajes nuevos" (H37). |
| **Entrada:** "Escribir al organizador" de la tarjeta del organizador en Evento (`Evento.dc.html:396`) | `/mensajes` | Abre "Salseros de jueves" y no la conversación con Galería Café Libro (H42). Producción: `/mensajes/galeria-cafe-libro` (o crearla si no existe). |
| **Entrada:** "Avisar a mi parche" del paso 4 de la compra (`Evento.dc.html:836`) | `/mensajes` | Debería abrir el parche ligado al evento comprado. El aviso de compra debe ser voluntario y sin cantidad ni localidad (H30). |
| **Entrada:** "Mensaje" del perfil (`Perfil.dc.html:48`) | `/mensajes` | Debería abrir o crear el chat con esa persona. |
| Logo "fulleventos" | `Main.dc.html` → `/inicio` | Color inline #D9452F, sin hover. |
| Ícono "Inicio" | `Main.dc.html` → `/inicio` | — |
| Ícono "Agenda de eventos" | `Agenda.dc.html` → `/agenda` | — |
| Ícono "Mapa de eventos" | `Mapa.dc.html` → `/mapa` | — |
| Ícono "Mensajes, N chats sin leer" (actual) | `Chat.dc.html` | `aria-current="page"`; recarga la misma pantalla. |
| Botón "Notificaciones" | — | Sin acción (H38, H54). |
| Botón "Crear evento" | — | Sin acción (H38, H14). Aquí sí tiene `type="button"`. |
| Avatar "CV" ("Tu perfil") | `Perfil.dc.html` → `/perfil/camila` (perfil propio) | H46: el perfil propio no debe mostrar "Seguir" ni "Mensaje". |
| Ícono de boleta "Ver evento" de la barra de la conversación (solo parches con evento) | `Evento.dc.html` | Siempre la salsa (H36). Producción: `/evento/:slug` del evento del parche. |
| Título del plan fijado | `Evento.dc.html` | Igual. |
| "Comprar mi boleta" del plan fijado | `Evento.dc.html` | En "Rockeros del Arena" abre la salsa de $45.000 en lugar del rock de $180.000 (H36). Debe abrir el evento del parche, idealmente con la compra abierta. El texto depende del modo de compra del evento (decisión pendiente P1, H1). |
| "Ya tienes boleta" del plan fijado | `Evento.dc.html` | Lleva a la página del evento. La auditoría pide crear "Mis boletas" (H20); es el destino natural de este botón cuando exista. |
| Título de una tarjeta de evento compartida en el chat | `Evento.dc.html` | Siempre la salsa (H36). |
| Flecha "Ver evento: {título}" de la tarjeta compartida | `Evento.dc.html` | Igual. |
| Avatar de otra persona junto a su mensaje ("Perfil de Laura Martínez") | `Perfil.dc.html` | Abre el perfil de Camila (H46). Producción: `/perfil/:usuario` de esa persona. |
| "Evento del parche" del panel de información | `Evento.dc.html` | Siempre la salsa (H36). |
| "Ver perfil" / "Ver perfil del organizador" del panel | `Perfil.dc.html` | Abre el perfil de Camila (H46). El del organizador debería abrir la página del organizador. |
| Cada evento de "Planes en común" / "Sus próximos eventos" | `Evento.dc.html` | Siempre la salsa (H36). |
| "Sí, salir" (confirmación de salir del parche) | Misma pantalla | El parche desaparece de la lista y se abre la siguiente conversación; en celular vuelve a la lista. |
| "Crear parche" / "Abrir chat" de la ventana | Misma pantalla | Abre la conversación nueva o existente. |

### Estructura sección por sección

Orden en el DOM: encabezado → `<main>` → "shell" blanco con tres columnas (lista de conversaciones, conversación abierta, panel de información) → ventana modal (condicional, fuera del `<main>`). **No hay pie de página** (H5).

**Componentes del código base que se reutilizan en esta pantalla** (`diseno/referencia/preview-demo.html`):
- Variables de `:root`: `--bg #FBF7F3`, `--surface #FFFFFF`, `--ink #17120F`, `--muted #6E6259`, `--line #EAE1D8`, `--brand #D9452F` (solo el logo), `--yellow #F6DC6A`, `--peach #F3B27E`, `--pink #EE93BC`, `--display` Archivo y `--ui` DM Sans.
- Encabezado `.top` / `.wrap` / `.logo` / `.search` / `.city` / `.btn-dark`: origen del encabezado de la app.
- `.av` con `.c1`–`.c6` (círculos de iniciales): los colores de avatar del chat son exactamente esos (`.c1 #F3B27E`, `.c2 #A3A8F0`, `.c3 #EE93BC`, `.c4 #B9E07A`, `.c5 #F6DC6A`, `.c6 #8FD3D0`).
- `.people` (panel blanco con borde y radio 20) y `.act` (fila avatar + texto + botón `.join`): origen de las filas de miembros y de la lista de conversaciones.
- `.join` (píldora con borde que pasa a tinta con `aria-pressed="true"`): origen de "Nuevo chat", "Repostear", "Dividir pago del parche", "Ver perfil" y "Me quedo".
- `.chip[aria-pressed]`: origen de los filtros "Todos / Parches / Personas / No leídos" (aquí dentro de un contenedor segmentado).
- `.card`, `.date`, `.cat`, `.price`, `.ticket`: origen de la tarjeta de evento compartida y del plan fijado (en tamaño reducido).
- `.eyebrow` / `.kicker`: origen de "Plan fijado · Faltan 3 días", "Evento del parche", "Encuesta" e "Info del grupo".
- `.empty`: origen de los estados vacíos.
- La regla `:focus-visible { outline: 3px solid var(--brand); outline-offset: 2px; }` (aquí con #C23A24) y el formateador `cop()` del código base: `n => n === 0 ? 'Gratis' : '$' + n.toLocaleString('es-CO')`. El Chat usa solo la parte de pesos (`'Desde $' + n.toLocaleString('es-CO')`) porque ninguno de sus 4 eventos es gratis; si se reutiliza `cop()`, un evento gratis debe decir "Gratis" y no "Desde $0".

Componentes **nuevos** (no existen en el código base; crearlos como componentes reutilizables): fila de conversación, control segmentado de filtros, barra superior de conversación, plan fijado con barra de progreso, burbuja de mensaje con agrupación, separador de fecha, separador "mensajes nuevos", mensaje del sistema, tarjeta de evento compartido (variante compacta de la tarjeta de evento), encuesta votable, mensaje con foto, chip de reacción, hora con doble check, compositor con bandeja "Compartir", panel lateral / cajón de información, fila de miembro con estado de boleta, interruptor (switch), confirmación en línea, ventana modal (la misma que deben usar Agenda y Evento), selector de amigos (casillas o radios en tarjeta), insignia "Cuenta verificada", punto "En línea" e insignia de no leídos.

Tokens que usa esta pantalla y **no existen** en el código base:
- #C23A24: acento y rellenos con texto blanco (insignias, "Comprar mi boleta", "Enviar", "Crear parche", "Sí, salir"), antetítulos, hora de no leídos, separador de nuevos, insignia verificada, foco.
- #F3ECE5: relleno de las opciones de encuesta no votadas.
- #8FD3D0, #A3A8F0 y #B9E07A: existen en el código base solo como clases `.c6`, `.c2` y `.c4`. Aquí además #B9E07A es "tiene boleta" y punto "En línea", y #8FD3D0 el ícono del pago dividido.
- rgba(23,18,15,.55) (fondo de la ventana), rgba(23,18,15,.66) (rótulo sobre la foto), `0 24px 60px rgba(23,18,15,.3)` (sombra de la ventana), `-16px 0 40px rgba(23,18,15,.16)` (sombra del cajón) y `0 1px 3px rgba(23,18,15,.3)` (perilla del interruptor).

#### 1. Encabezado (`<header data-ch="hdr">`)

- **Layout:**
  - `<header>`: `position: sticky; top: 0; z-index: 5; flex-shrink: 0; background: #FBF7F3; border-bottom: 1px solid #EAE1D8`. Sin sombra. **Por debajo de 900 px pasa a `position: static`**: se va con el scroll (en Main, Agenda y Mapa sigue fijo). Desde 900 px es fijo, pero como la página no hace scroll solo se nota en ventanas de menos de 607 px de alto.
  - Contenedor interno: `max-width: 1240px; margin: 0 auto; padding: 12px 24px; display: flex; flex-wrap: wrap; align-items: center; gap: 12px 20px`. El margen lateral es **24 px fijos** (Mapa usa `clamp(16px, 4vw, 24px)`; H41 pide un margen único).
  - Alto renderizado (incluye 1 px de borde), medido en Chromium:

    | Ancho de ventana | Alto | Filas |
    |---|---|---|
    | 907 px o más | **69 px** | 1 |
    | 482 a 906 px | 125 px | 2: logo + buscador; navegación alineada a la derecha |
    | 453 a 481 px | 171 px | 3: logo + buscador; 5 íconos + "Crear evento"; avatar |
    | 432 a 452 px | 220,2 px | 4: logo; buscador; 5 íconos + "Crear evento"; avatar |
    | 431 px o menos | **224,2 px** | 4: logo; buscador; 5 íconos; "Crear evento" + avatar |

    A 390 × 844 ocupa el 26,6 % de la pantalla y empuja la conversación hacia abajo (H40, H43).
- **Contenido en orden:**
  1. **Logo:** enlace "fulleventos" (en minúsculas) a `Main.dc.html`. DM Sans 700, `font-size: 1.55rem` (24,8 px), `letter-spacing: -0.03em` (−0,744 px), `line-height` 1,5 (37,2 px), color #D9452F. Mide 124,9 × 37,2 px. Es el único uso de #D9452F en la pantalla.
  2. **Buscador** (`div role="search"`): `flex: 1 1 260px; max-width: 500px; min-width: 0; display: flex; align-items: center; gap: 10px; background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 999px; padding: 0 6px 0 16px; height: 44px; box-sizing: border-box`. Mide 500 × 44 a 1280 y 768; 377,8 a 1024; 261 a 907; 342 a 390.
     - `label` del texto (`flex: 1; min-width: 0; display: flex; align-items: center; gap: 10px`): lupa de 18 px (`circle cx=11 cy=11 r=7` + `m20 20-3.5-3.5`), trazo #6E6259, grosor 2, puntas redondas, `flex-shrink: 0`; y `<input type="search" placeholder="Busca planes, gente o lugares" aria-label="Buscar">` con `flex: 1; min-width: 0; border: 0; outline: 0; background: transparent; font-size: .95rem` (15,2 px) y color #17120F. Placeholder en el gris por defecto (#757575). Sin `name`, sin formulario y sin manejador: no busca nada (H38, H41). A 390 px el placeholder se corta en "Busca planes, g".
     - `label` de ciudad: `position: relative; display: flex; align-items: center; gap: 4px; padding-left: 10px; border-left: 1px solid #EAE1D8; font-size: .9rem` (14,4 px); `white-space: nowrap; flex-shrink: 0`.
       - pin de 16 px (gota `M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z` + `circle cx=12 cy=10 r=2.5`), `stroke="currentColor"` (#17120F), grosor 2;
       - texto oculto "Ciudad" (`position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap`);
       - `<select name="ciudad">` con `height: 36px; max-width: 8.6em` (123,84 px); `border: 0; background: transparent; font-size: .9rem` (14,4 px); `font-weight: 500`; color #17120F; `cursor: pointer`. Flecha nativa. Mide 122 × 36 px.
       - Opciones (valor → texto): `all` → "Toda Colombia", `bogota` → "Bogotá", `medellin` → "Medellín", `cali` → "Cali", `barranquilla` → "Barranquilla", `cartagena` → "Cartagena", `santamarta` → "Santa Marta", `bucaramanga` → "Bucaramanga", `pereira` → "Pereira", `villavicencio` → "Villavicencio", `pasto` → "Pasto", `leticia` → "Leticia".
  3. **Navegación** (`<nav aria-label="Principal">`): `margin-left: auto; display: flex; flex-wrap: wrap; justify-content: flex-end; align-items: center; gap: 6px`. Mide 433,3 × 44 en una fila.
     - **Cuatro enlaces de ícono:** `width: 44px; height: 44px; border-radius: 12px; display: grid; place-items: center`. Íconos de 20 px, trazo 2, puntas y uniones redondas, `currentColor`.
       - "Inicio" (casa `M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z`) → `Main.dc.html`.
       - "Agenda de eventos" (calendario: `rect x=3 y=5 w=18 h=16 rx=2` + `M3 10h18M8 3v4M16 3v4`) → `Agenda.dc.html`.
       - "Mapa de eventos" (mapa plegado: `M9 4 3 6.5V20l6-2.5 6 2.5 6-2.5V4l-6 2.5z` + `M9 4v13.5M15 6.5V20`) → `Mapa.dc.html`.
       - **Mensajes** (burbuja `M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z`) → `Chat.dc.html`, con `aria-current="page"`, `position: relative; background: #17120F; color: #FFFFFF` (ícono blanco sobre tinta). `aria-label="{{msgNavAria}}"`.
         - Insignia (solo si hay chats sin leer) `<span aria-hidden="true">{{navUnread}}</span>`: `position: absolute; top: 4px; right: 4px; min-width: 18px; height: 18px; box-sizing: border-box; border-radius: 9px; background: #C23A24; color: #FFFFFF; box-shadow: 0 0 0 2px #17120F; font-size: .66rem` (10,56 px); `font-weight: 700; display: grid; place-items: center; padding: 0 4px`. Mide 18 × 18 en (994,7; 16) a 1280. **Distinta** de las otras pantallas: allí va en `top: 6px; right: 6px`, con `line-height: 1` y sin el anillo `box-shadow` (aquí el anillo tinta la separa del fondo oscuro del ícono activo).
     - **Botón "Notificaciones"** (`type="button" aria-label="Notificaciones"`): 44 × 44, `border-radius: 12px; border: 0; background: transparent; color: #17120F; display: grid; place-items: center`. Campana de 20 px (`M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9` + `M10.3 21a1.9 1.9 0 0 0 3.4 0`). Sin acción.
     - **Botón "Crear evento"** (`type="button"`): `height: 44px; border: 0; border-radius: 999px; padding: 0 18px; background: #17120F; color: #FFFFFF; font-weight: 700; font-size: .9rem` (14,4 px); `margin-left: 6px`. Mide 127,3 × 44. Sin acción.
     - **Avatar "CV"** (enlace a `Perfil.dc.html`, `aria-label="Tu perfil"`): `width: 40px; height: 40px; border-radius: 50%; background: #8FD3D0; display: grid; place-items: center; font-weight: 700; font-size: .78rem` (12,48 px); texto #17120F; `margin-left: 4px`.
- **Datos dinámicos:**
  - `unreadConvs` = número de conversaciones con `unread > 0` (no de mensajes). Al cargar: 3 (Salseros, Laura y Galería).
  - `msgNavAria = unreadConvs ? 'Mensajes, ' + unreadConvs + (unreadConvs === 1 ? ' chat sin leer' : ' chats sin leer') : 'Mensajes'`. Ejemplos: "Mensajes, 3 chats sin leer", "Mensajes, 1 chat sin leer", "Mensajes".
  - `navUnread = String(unreadConvs)`; la insignia solo se pinta si `unreadConvs > 0`.
  - El `<select>` está atado a `state.city` (inicial `all`). Cambiarlo guarda el valor y **no filtra nada** (H38, `Chat.dc.html:1106`).
- **Componente / reutilización:** "Encabezado de la app", el mismo de Main, Agenda y Mapa, con cuatro diferencias a unificar: `position` (aquí deja de ser fijo por debajo de 900 px), `z-index` (5 aquí, en Agenda y Main; 70 en Mapa), margen lateral (24 px fijos aquí) y la insignia de mensajes (posición 4 px y anillo tinta cuando el ícono está activo). Buscador con el mismo placeholder y `aria-label` que Main ("Busca planes, gente o lugares" / "Buscar"); Agenda y Mapa dicen "Busca eventos, lugares o artistas" / "Buscar eventos" (H41). Viene de `.top`, `.logo`, `.search`, `.city` y `.btn-dark` del código base (allí la ciudad era el texto fijo "Bogotá", el buscador tenía un botón rojo `.go` y sombra `0 1px 2px rgba(23,18,15,.04)`, y `.btn-dark:hover` era #33291F).

#### 2. Contenedor principal (`<main data-ch="main">`) y "shell"

- **`<main>`:** `flex: 1 1 auto; min-height: 0; width: 100%; max-width: 1240px; margin: 0 auto; padding: 16px 24px; box-sizing: border-box; display: flex; flex-direction: column`. Por debajo de 900 px: `padding: 12px 16px 16px`.
- **"Shell"** (`div data-ch="shell" data-pane="{{pane}}"`): `position: relative; flex: 1 1 auto; display: flex; background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 24px; overflow: hidden`. Desde 900 px `min-height: 520px`. Por debajo de 900 px: `overflow: visible; border-radius: 20px`.
  - Medidas: a 1280 × 900, `<main>` 1240 × 831 (x = 20) y shell 1192 × 799 en (44, 85). A 1024 × 768, shell 976 × 667. A 1280 × 600 el shell queda en su mínimo (522 px con bordes) y la página hace 7 px de scroll; a 1280 × 500, 107 px.
  - `data-pane` vale `list` o `chat` y solo importa por debajo de 900 px (decide qué columna se ve).
- **Hijos, en orden:** `<section data-ch="list">` (secciones 3 a 5), `<section data-ch="conv">` (6 a 9) y `<aside data-ch="info">` (10 a 16).
- **Componente / reutilización:** "Marco de mensajería" de tres columnas. El código base no tiene nada parecido; el fondo blanco con borde #EAE1D8 es el de `.people` y `.card`.

#### 3. Lista de conversaciones · cabecera (`<section data-ch="list" aria-label="Tus conversaciones">`)

- **Layout de la columna:** `width: 330px; flex-shrink: 0; min-height: 0; display: flex; flex-direction: column; background: #FFFFFF; border-right: 1px solid #EAE1D8`. Entre 900 y 1179 px: `width: 300px`. Por debajo de 900 px: `width: auto; flex: 1 1 auto; border-right: 0; border-radius: 20px` (y **le falta `min-width: 0`**, ver H8).
- **Cabecera:** `div` con `padding: 18px 16px 12px; display: flex; flex-direction: column; gap: 12px; border-bottom: 1px solid #EAE1D8`. Mide 330 × 221,2 px.
- **Contenido en orden:**
  1. **Fila de título:** `display: flex; align-items: baseline; justify-content: space-between; gap: 8px`.
     - `<h1>` "Mensajes": `margin: 0; font-family: 'Archivo', sans-serif; font-weight: 900; font-size: 1.75rem` (28 px); `letter-spacing: -0.03em` (−0,84 px); `line-height: 1`. Mide 138,3 × 28.
     - Resumen `{{unreadSummary}}`: `font-size: .8rem` (12,8 px), color #6E6259. Alineado por la línea base con el título.
  2. **Fila de botones:** `display: flex; gap: 8px`. Dos botones `type="button"` de `flex: 1 1 0; min-width: 0; height: 40px; border-radius: 999px; border: 1px solid #17120F; font-weight: 700; font-size: .84rem` (13,44 px); `display: flex; align-items: center; justify-content: center; gap: 6px; white-space: nowrap; padding: 0 10px`. Miden 145 × 40 a 1280 y 130 × 40 entre 900 y 1179 px.
     - "Nuevo chat": `background: #FFFFFF; color: #17120F`. Ícono de 16 px: burbuja + signo más (`M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z` + `M12 8.5v7M8.5 12h7`), trazo 2, `flex-shrink: 0`. Abre la ventana en modo "Con una persona".
     - "Nuevo parche": `background: #17120F; color: #FFFFFF`. Ícono de 16 px: persona + signo más (`circle cx=9 cy=8 r=3.5` + `M2.5 20a6.5 6.5 0 0 1 13 0M19 8v6M16 11h6`). Abre la ventana en modo "Parche (grupo)".
  3. **Buscador de chats** (`label`): `position: relative; display: flex; align-items: center; gap: 8px; height: 42px; box-sizing: border-box; border: 1px solid #EAE1D8; border-radius: 999px; padding: 0 14px; background: #FBF7F3`. Mide 298 × 42.
     - lupa de 16 px, trazo #6E6259, grosor 2;
     - texto oculto "Buscar en tus chats" (mismo patrón de texto oculto);
     - `<input type="search" placeholder="Busca chats, parches o eventos" autocomplete="off">` con `flex: 1; min-width: 0; border: 0; outline: 0; background: transparent; font-size: .9rem` (14,4 px), color #17120F. Entre 900 y 1179 px el placeholder se corta ("Busca chats, parches o event").
  4. **Filtros** (`div role="group" aria-label="Filtrar chats"`): `display: flex; gap: 2px; overflow-x: auto; background: #FBF7F3; border: 1px solid #EAE1D8; border-radius: 999px; padding: 3px`. Mide 298 × 44.
     - Cuatro botones `type="button"` con `aria-pressed`: "Todos", "Parches", "Personas", "No leídos". Estilo: `flex: 1 0 auto; height: 36px; border: 0; border-radius: 999px; padding: 0 6px; font-size: .8rem` (12,8 px); `font-weight: 700; white-space: nowrap`.
       - Marcado: `background: #17120F; color: #FFFFFF`.
       - Sin marcar: `background: transparent; color: #17120F`.
       - A 1280: 57,6 / 70,7 / 77,7 / 78 px de ancho. Activo por defecto: "Todos".
- **Datos dinámicos:**
  - `unreadSummary = unreadConvs ? (unreadConvs === 1 ? '1 chat sin leer' : unreadConvs + ' chats sin leer') : 'Al día'`. Al cargar: "3 chats sin leer".
  - El buscador escribe en `state.q` en cada tecla. La búsqueda normaliza (`toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')`, es decir, sin mayúsculas ni tildes) y recorta espacios (`q.trim()`), y busca la subcadena en `nombre + ' ' + título del evento del parche`. Solo los parches tienen evento: "salsa" encuentra "Salseros de jueves" (por "Noche de salsa y boleros en vivo"), "millonarios" encuentra "Clásico capitalino", "rock" encuentra "Rockeros del Arena", "GALERÍA" encuentra "Galería Café Libro"; "provenza" y "bogota" no encuentran nada (H41: debe incluir los eventos compartidos en la conversación).
  - Filtros: "Parches" deja `kind === 'group'`; "Personas" deja lo que **no** es grupo (personas **y** la cuenta del organizador); "No leídos" deja las conversaciones con `unread > 0`. Filtro y búsqueda se combinan.
- **Componente / reutilización:** el `h1` es el `h2` del código base en versión compacta (allí `clamp(1.7rem, 3.2vw, 2.4rem)`). Los botones vienen de `.join` / `.btn-dark`. El control segmentado de filtros es nuevo; es el mismo patrón del selector de fecha de Agenda y Mapa y del selector "Tipo de chat" de la ventana: un solo componente "control segmentado".

#### 4. Lista de conversaciones · filas (`<button>` por conversación)

- **Contenedor con scroll** (`div data-ch="scroll"`): `position: relative; flex: 1 1 auto; min-height: 0; overflow-y: auto; padding: 8px; display: flex; flex-direction: column; gap: 2px`. A 1280 × 900 mide 330 × 575,8 y la lista completa (7 filas, 571 px + relleno) hace un poco de scroll. Por debajo de 900 px crece con su contenido.
- **Fila** (`<button type="button" aria-current="true|false">`): `position: relative; width: 100%; flex-shrink: 0; display: flex; align-items: flex-start; gap: 12px; padding: 10px; border-radius: 16px; border: 1px solid {{c.border}}; background: {{c.bg}}; text-align: left; color: #17120F; font-size: .9rem` (14,4 px).
  - Conversación abierta: `border-color: #EAE1D8; background: #FBF7F3; aria-current="true"`. Las demás: borde y fondo `transparent`, `aria-current="false"`.
  - Alto: 70 px (sin píldora), 86,6 px (con píldora de evento), 87,1 px (organizador) y 89,1 px (píldora + contador). Ancho 314 a 1280; 284 entre 900 y 1179.
- **Contenido en orden:**
  1. **Avatar** (`span aria-hidden="true"`): 48 × 48, `flex-shrink: 0; display: grid; place-items: center; font-size: .86rem` (13,76 px); fondo, color, radio, familia y peso según el tipo:

     | Tipo | Radio | Fondo | Texto | Familia y peso |
     |---|---|---|---|---|
     | Parche (`group`) | 14px | color del parche | #17120F | Archivo 900 |
     | Organizador (`org`) | 14px | #17120F | #F6DC6A | Archivo 900 |
     | Persona (`dm`) | 50% | color de la persona | #17120F | DM Sans 700 |

     El cuadrado redondeado distingue grupos y organizadores de las personas (círculo).
  2. **Columna de texto:** `flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; line-height: 1.3`.
     - **Línea 1** (`display: flex; align-items: center; gap: 5px`):
       - nombre `<b>`: `min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: .92rem` (14,72 px; alto de línea 19,14 px). Se corta con "…" ("Galería Café Li…" a 1024).
       - solo organizador: sello "Cuenta verificada" de 15 px (`svg role="img" aria-label="Cuenta verificada"`): estrella dentada `M12 2.5l2.4 1.8 3-.1.9 2.8 2.4 1.8-.9 2.9.9 2.9-2.4 1.8-.9 2.8-3-.1L12 21.5l-2.4-1.8-3 .1-.9-2.8-2.4-1.8.9-2.9-.9-2.9 2.4-1.8.9-2.8 3 .1z` relleno #C23A24 + palomita `m8.5 12.2 2.3 2.3 4.7-4.9` blanca, trazo 2,2.
       - si está silenciada: campana tachada de 14 px (`svg role="img" aria-label="Silenciado"`; `M8.7 3.6A6 6 0 0 1 18 8c0 3.2.6 5.4 1.3 6.8M17 17H3s3-2 3-9c0-.5 0-1 .1-1.4` + `M10.3 21a1.9 1.9 0 0 0 3.4 0` + `m3 3 18 18`), trazo #6E6259, grosor 2. Al cargar solo "Rockeros del Arena".
       - hora `{{c.time}}`: `margin-left: auto; padding-left: 6px; flex-shrink: 0; font-size: .72rem` (11,52 px). Con no leídos: #C23A24, 700. Sin no leídos: #6E6259, 400.
     - **Línea 2** (`display: flex; align-items: center; gap: 8px`):
       - vista previa `{{c.preview}}`: `flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: .84rem` (13,44 px). Con no leídos: #17120F, 700. Sin no leídos: #6E6259, 400.
       - contador (solo si `unread > 0`): `span aria-hidden="true"` con `min-width: 20px; height: 20px; box-sizing: border-box; border-radius: 10px; background: #C23A24; color: #FFFFFF; font-size: .7rem` (11,2 px); `font-weight: 700; display: grid; place-items: center; padding: 0 6px; flex-shrink: 0`. Al lado, un texto oculto para lector de pantalla con `{{c.unreadText}}`.
     - **Píldora de evento** (solo parches con evento): `align-self: flex-start; display: inline-flex; align-items: center; gap: 5px; margin-top: 5px; background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 999px; padding: 2px 9px 2px 7px; font-size: .72rem` (11,52 px); `font-weight: 700`. Ícono de calendario de 12 px, trazo #C23A24, grosor 2,4. Texto `{{c.evPill}}`. Mide 123,5 × 21 ("Vie 9 oct · Salsa").
     - **Píldora de organizador** (solo `org`): `align-self: flex-start; display: inline-flex; align-items: center; gap: 5px; margin-top: 5px; background: #F6DC6A; border-radius: 999px; padding: 2px 9px; font-size: .72rem; font-weight: 700`. Texto fijo "Organizador · Responde en ~1 h". Mide 192,8 × 19.
- **Datos dinámicos:**
  - Orden de la lista: `state.order` (inicial: salseros, laura, galeria, clasico, andres, rockeros, sofia), sin las conversaciones de las que se salió. **No** se ordena por hora: cualquier envío (texto, evento, encuesta, foto, pago dividido) lleva la conversación arriba, y crear un parche o un chat nuevo también.
  - `name`: el nombre del parche o el nombre completo de la persona u organizador.
  - `time`: si Camila ya envió algo en esta sesión, "Ahora"; si no, la hora de la conversación ("9:41 a. m.", "Ayer", "Dom", "Sáb"…).
  - `unread = c.unread && !read[id] && !hayEnviados ? c.unread : 0`. Se marca leída al **tocar** la fila (o al enviar algo). La conversación que abre por defecto (Salseros) **no** se marca leída al cargar: arranca con su "3" visible estando abierta.
  - `unreadText` (oculto): ", 1 mensaje sin leer" o ", N mensajes sin leer".
  - `preview` = último mensaje que no sea separador de fecha:
    - ninguno → "Chat nuevo · escribe el primer mensaje";
    - del sistema → su texto tal cual ("Camila activó el pago dividido: cada uno paga su parte");
    - prefijo `pre`: "Tú: " si es de Camila; en parches, "{nombre corto}: " ("Sofía: ", "Laura: "); en chats de persona u organizador, nada;
    - evento → `pre + 'compartió «' + título + '»'` ("Tú: compartió «Rock en el Movistar Arena»");
    - encuesta → `pre + 'Encuesta: ' + pregunta`;
    - foto → `pre + 'envió una foto'` (aunque tenga pie de foto);
    - texto → `pre + texto`.
  - `evPill = día + ' ' + d + ' oct · ' + etiqueta`: "Vie 9 oct · Salsa", "Dom 11 oct · Fútbol", "Sáb 10 oct · Rock", "Vie 9 oct · Reguetón".
- **Componente / reutilización:** fila de conversación nueva; la estructura avatar + texto viene de `.act` del código base.

#### 5. Lista de conversaciones · estado vacío (condicional)

- Aparece dentro del contenedor con scroll cuando ningún chat pasa el filtro y la búsqueda.
- **Layout:** `padding: 32px 12px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px`. Mide 314 × 137,6.
- **Contenido en orden:**
  1. `<p>` `{{listEmptyMsg}}`: `margin: 0; color: #6E6259; font-size: .9rem` (14,4 px).
  2. Botón "Ver todos los chats": `height: 40px; border-radius: 999px; border: 1px solid #17120F; background: #FFFFFF; color: #17120F; padding: 0 16px; font-size: .84rem` (13,44 px); `font-weight: 700`. Mide 160,1 × 40. Vuelve a "Todos" y borra la búsqueda.
- **Datos dinámicos:** `listEmptyMsg = filtro 'No leídos' y búsqueda vacía ? 'Estás al día: no tienes mensajes sin leer.' : 'No encontramos chats con ese filtro.'`.
- **Componente / reutilización:** "Estado vacío" (mensaje + acción útil), el mismo patrón de Agenda y Bienvenida; el código base solo tenía `.empty` sin botón.

#### 6. Conversación · barra superior (`<section data-ch="conv" aria-label="{{cv.convAria}}">` → `div data-ch="topbar"`)

- **Layout de la columna de conversación:** `flex: 1 1 auto; min-width: 0; min-height: 0; display: flex; flex-direction: column; background: #FBF7F3`. Mide 562 × 797 a 1280 con el panel abierto y 859 × 797 con el panel cerrado. Por debajo de 900 px: `border-radius: 20px`.
- **Barra:** `flex-shrink: 0; display: flex; align-items: center; gap: 10px; min-height: 66px; box-sizing: border-box; padding: 10px 12px 10px 16px; background: #FFFFFF; border-bottom: 1px solid #EAE1D8`. Mide 66 px de alto. Por debajo de 900 px: `position: sticky; top: 0; z-index: 4; border-radius: 20px 20px 0 0` (queda pegada arriba al bajar la página).
- **Contenido en orden:**
  1. **"Volver a tus chats"** (`button data-ch="back" aria-label="Volver a tus chats"`): `width: 40px; height: 40px; flex-shrink: 0; margin-left: -6px; border: 0; border-radius: 50%; background: transparent; color: #17120F; display: grid; place-items: center`. Chevrón de 20 px (`M15 18l-6-6 6-6`), trazo 2,2. **Oculto desde 900 px.**
  2. **Avatar** (`span aria-hidden="true"`): 44 × 44, `flex-shrink: 0; font-size: .82rem` (13,12 px); mismo radio, fondo, color, familia y peso que en la lista.
  3. **Bloque de nombre** (`flex: 1; min-width: 0; line-height: 1.25`):
     - fila (`display: flex; align-items: center; gap: 6px; min-width: 0`) con `<h2>` `{{cv.name}}` (`margin: 0; min-width: 0; font-size: 1.05rem` = 16,8 px, peso por defecto de `h2` = 700, `white-space: nowrap; overflow: hidden; text-overflow: ellipsis`) y, si es organizador, el sello "Cuenta verificada" de 17 px.
     - subtítulo (`span`): `display: flex; align-items: center; gap: 6px; font-size: .8rem` (12,8 px); color #6E6259; `white-space: nowrap; overflow: hidden; text-overflow: ellipsis`. Si `status === 'En línea'`, antes del texto va un punto de 9 × 9 px `border-radius: 50%; background: #B9E07A; box-shadow: 0 0 0 1.5px #17120F` (`aria-hidden`). Texto `{{cv.sub}}`. **Ojo:** como el `span` es `display: flex`, el texto se corta en seco sin "…" (a 390 px se lee "12 miembros ·").
  4. **Acciones** (`display: flex; align-items: center; gap: 2px; flex-shrink: 0`), todas de 44 × 44, `border-radius: 12px; display: grid; place-items: center`, íconos de 20 px trazo 2:
     - **"Ver evento"** (solo parches con evento): enlace a `Evento.dc.html`, `aria-label="Ver evento"`. Ícono de boleta con perforación (`M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4z` + `M14 7v2M14 11v2M14 15v2`).
     - **Info, versión ancha** (`button data-ch="tg-wide"`, visible desde 1180 px) y **versión angosta** (`button data-ch="tg-narrow"`, visible por debajo de 1180 px): mismo ícono (círculo `r=9` + `M12 11v5M12 8h.01`), mismo `aria-label="{{infoLabel}}"`, `border: 0`. Cada una con su `aria-pressed` y su fondo: presionado `background: #17120F; color: #FFFFFF`; suelto `transparent` / #17120F. Al cargar a 1280 la ancha está presionada (panel visible); por debajo de 1180 la angosta está suelta (cajón cerrado).
     - **"Silenciar chat"** (`button aria-label="Silenciar chat" aria-pressed`): `border: 0`. Suelto: campana (`M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9` + `M10.3 21a1.9 1.9 0 0 0 3.4 0`), fondo transparente, #17120F. Presionado: campana tachada, fondo #17120F, ícono #FFFFFF. El nombre accesible no cambia ("Silenciar chat"); el estado lo da `aria-pressed`.
- **Datos dinámicos:**
  - `convAria = 'Conversación con ' + nombre` ("Conversación con Salseros de jueves").
  - `sub`:
    - parche: `total + ' miembros' + (cupos ? ' · ' + (cupos − total) + ' cupos libres' : '') + (evento ? ' · ' + conBoleta + ' con boleta' : '')`. Ejemplos: "12 miembros · 7 con boleta", "4 miembros · 2 cupos libres · 2 con boleta", "8 miembros · 5 con boleta", "4 miembros · 0 con boleta" (parche nuevo con evento), "2 miembros" (parche nuevo sin evento).
    - organizador: su estado, "Organizador verificado · Responde en ~1 h".
    - persona: su estado o, si no tiene, su ciudad: "En línea", "Activo hace 2 h", "Activa hace 20 min", "Bogotá" (chat nuevo con Daniel).
  - `infoLabel`: "Info del grupo" (parches) o "Info del chat" (personas y organizador).
- **Componente / reutilización:** barra superior de conversación, nueva. Los botones de ícono son los mismos del encabezado (44 px, radio 12, estado presionado en tinta).

#### 7. Conversación · plan fijado (solo parches con evento)

- **Layout:** envoltorio `flex-shrink: 0; padding: 12px 14px 0`. Dentro, `<section aria-label="Plan fijado del parche">` con `background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 18px; padding: 12px; display: flex; flex-wrap: wrap; align-items: center; gap: 12px 14px`. El plan **no** hace scroll con los mensajes: queda fijo entre la barra y el historial.
  - Alto medido: 104,1 px en una fila (con el panel cerrado a 1280, a 1179, a 1100 y a 1024; a 768 en celular-tablet); **157,1 px** a 1280 con el panel abierto (el texto se parte en 3 líneas y el botón queda a la derecha); **180,4 px** a 1180 y a 900 (el botón baja a una segunda fila, alineado a la izquierda); **233,4 px** a 390 (tres bloques apilados: foto + texto, y el botón debajo).
- **Contenido en orden:**
  1. **Foto** (`span role="img" aria-label="[Foto del evento]"`): 64 × 64, `flex-shrink: 0; border-radius: 14px; background: radial-gradient(circle at 70% 30%, {{plan.bg1}} 0, transparent 58%), {{plan.bg2}}; display: grid; place-items: center`. Dentro, una placa blanca de fecha: `background: #FFFFFF; border-radius: 9px; padding: 4px 7px 3px; text-align: center; line-height: 1; min-width: 34px; box-sizing: border-box` (mide 35,8 × 38,8) con el día en `<b>` (`display: block; font-family: 'Archivo'; font-weight: 900; font-size: 1.05rem` = 16,8 px) y "oct" (`font-size: .6rem` = 9,6 px; 700; `text-transform: uppercase; letter-spacing: .06em`; #6E6259) → "OCT".
  2. **Texto** (`flex: 1 1 220px; min-width: 0; display: flex; flex-direction: column; gap: 2px; line-height: 1.3`):
     - Antetítulo: `display: flex; align-items: center; gap: 6px; font-size: .68rem` (10,88 px); 700; `letter-spacing: .1em; text-transform: uppercase`; #C23A24. Ícono de chinche de 13 px (`M9 4h6l-1 5 3 3v2H7v-2l3-3z` + `M12 14v6`), trazo 2,4, `currentColor`. Texto "Plan fijado · {{plan.countdown}}" → se ve "PLAN FIJADO · FALTAN 3 DÍAS".
     - Título (enlace a `Evento.dc.html`): `font-family: 'Archivo'; font-weight: 800; font-size: 1.05rem` (16,8 px); `letter-spacing: -0.01em; line-height: 1.2`. Sin truncado: se parte en líneas.
     - Datos: `{{plan.meta}}`, `font-size: .8rem` (12,8 px), #6E6259.
     - Fila de progreso (`display: flex; align-items: center; gap: 8px; margin-top: 5px`):
       - barra (`div role="img" aria-label="{{plan.barAria}}"`): `flex: 0 1 120px; height: 6px; border-radius: 3px; background: #EAE1D8; overflow: hidden` (mide 101,8 px a 1280 con el panel abierto); relleno `height: 100%; width: {{plan.pct}}%; background: #C23A24; border-radius: 3px; transition: width 300ms ease` (`data-fx`).
       - texto `font-size: .78rem` (12,48 px): "<b>{{plan.ticketsLine}}</b> ya tienen boleta" → "**7 de 12** ya tienen boleta".
  3. **Acción** (una de dos):
     - Si Camila **no** tiene boleta: columna `display: flex; flex-direction: column; align-items: center; gap: 3px; flex-shrink: 0` con:
       - enlace "Comprar mi boleta" a `Evento.dc.html`: `height: 44px; box-sizing: border-box; display: inline-flex; align-items: center; gap: 8px; padding: 0 18px; border-radius: 999px; background: #C23A24; color: #FFFFFF; font-weight: 700; font-size: .88rem` (14,08 px); `white-space: nowrap`. Ícono de boleta con perforación de 17 px, trazo 2,2. Mide 190,2 × 44.
       - precio `{{plan.price}}` debajo: `font-size: .72rem` (11,52 px), #6E6259 ("Desde $45.000").
     - Si Camila **ya** tiene boleta (Clásico capitalino): enlace "Ya tienes boleta" a `Evento.dc.html`: `flex-shrink: 0; height: 40px; box-sizing: border-box; display: inline-flex; align-items: center; gap: 7px; padding: 0 14px 0 6px; border-radius: 999px; background: #B9E07A; font-weight: 700; font-size: .84rem` (13,44 px); `white-space: nowrap`; texto #17120F. Empieza con un círculo de 28 px `background: #17120F; color: #FFFFFF` con una palomita de 14 px (`m5 12 5 5L20 7`), trazo 3. Sin precio debajo.
- **Datos dinámicos** (`cEv` = evento del parche; `conBoleta` = miembros con `tickets[k]`; `total` = número de miembros):
  - `countdown = 'Faltan ' + cEv.left + ' días'` (dato fijo por evento: 3, 5, 4, 3). No maneja el singular ("Faltan 1 días") ni "Hoy".
  - `meta = día + ' ' + d + ' oct' + (hora ? ' · ' + hora : '') + ' · ' + lugar + ' · ' + ciudad`: "Vie 9 oct · 8:00 p. m. · Galería Café Libro · Bogotá", "Dom 11 oct · 4:00 p. m. · Estadio El Campín · Bogotá", "Sáb 10 oct · Movistar Arena · Bogotá" (el rock no tiene hora), "Vie 9 oct · 10:00 p. m. · Barrio Provenza · Medellín".
  - `ticketsLine = conBoleta + ' de ' + total`; `barAria = conBoleta + ' de ' + total + ' miembros ya tienen boleta'`.
  - `pct = total ? Math.round(conBoleta / total × 100) : 0`: Salseros 58 %, Clásico 50 %, Rockeros 63 % (62,5 redondea arriba), parche nuevo 0 %.
  - `price = 'Desde $' + p.toLocaleString('es-CO')`: "Desde $45.000", "Desde $60.000", "Desde $180.000", "Desde $50.000". Sin cargo por servicio (H21).
  - `needsTicket = !tickets.me`; `hasTicket = !!tickets.me`.
  - El mes "oct" está escrito en la plantilla, no viene del dato.
- **Componente / reutilización:** "Plan fijado", nuevo. La placa de fecha es `.date` del código base en tamaño reducido; el botón es `.ticket`; el precio es `.price` sin la boletera.

#### 8. Conversación · historial (`div data-ch="stream" role="log" aria-label="Mensajes de {{cv.name}}"`)

- **Layout:** `position: relative; flex: 1 1 auto; min-height: 0; overflow-y: auto; display: flex; flex-direction: column-reverse; padding: 6px 18px 16px`. Dentro, un solo `div` con `display: flex; flex-direction: column` que contiene todos los mensajes en orden cronológico.
  - El `column-reverse` hace que el scroll arranque **abajo**, en el último mensaje (en Chromium, `scrollTop = 0` es el fondo y los valores negativos son hacia arriba). A 1280 × 900 el historial de Salseros mide 562 × 496,9 visible y 1759 px de contenido.
  - Por debajo de 900 px: `overflow: visible; padding: 8px 12px 16px`. El historial ya no tiene scroll propio: crece con su contenido y la que se mueve es la página (H43).
- **Tipos de elemento, en el orden en que pueden aparecer:**

##### 8.1 Separador de fecha (`type: 'date'`)
- `display: flex; align-items: center; gap: 12px; margin: 16px 0 4px; font-size: .7rem` (11,2 px); `font-weight: 700; letter-spacing: .1em; text-transform: uppercase`; #6E6259. A cada lado una línea `flex: 1; height: 1px; background: #EAE1D8`. Mide 16,8 px de alto.
- Textos del dato: "Ayer", "Hoy", "Dom 4 oct", "Sáb 3 oct" → se ven "AYER", "HOY", "DOM 4 OCT", "SÁB 3 OCT".

##### 8.2 Separador "mensajes nuevos" (`type: 'new'`, calculado)
- `display: flex; align-items: center; gap: 12px; margin: 14px 0 0; font-size: .72rem` (11,52 px); `font-weight: 700`; #C23A24; **sin** mayúsculas. Líneas `flex: 1; height: 1.5px; background: #C23A24; opacity: .5`. Mide 17,3 px de alto.
- Texto: "1 mensaje nuevo" o "N mensajes nuevos".
- Se inserta antes de los últimos `newCount` mensajes del dato original (posición `msgs.length − newCount`): en Salseros antes de la encuesta de Sofía (s9), en Laura antes de l4 y en Galería antes de g3. Se muestra mientras Camila no haya enviado nada en esa conversación, **aunque ya la haya leído**.

##### 8.3 Mensaje del sistema (`type: 'system'`)
- Envoltorio `display: flex; justify-content: center; margin: 12px 0 2px`. Píldora `display: inline-flex; align-items: center; gap: 8px; max-width: 100%; box-sizing: border-box; background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 999px; padding: 5px 14px 5px 5px; font-size: .8rem` (12,8 px); `line-height: 1.3`. Mide 336,3 × 36 ("Andrés compró 2 boletas · General · 8:05 a. m.").
- Círculo de ícono de 24 px (`aria-hidden`, `flex-shrink: 0; border-radius: 50%; display: grid; place-items: center`) con ícono de 13 px, trazo 2,4, `currentColor`:
  - `icon: 'ticket'` → fondo #B9E07A, boleta **sin** perforación (`M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4z`);
  - `icon: 'pay'` → fondo #8FD3D0, signo de pesos (`M12 3v18` + `M16.5 7.5c-.8-1.2-2.4-2-4.5-2-2.5 0-4 1.2-4 3s1.6 2.4 4 3 4 1.4 4 3.2-1.7 3-4.2 3c-2.1 0-3.7-.8-4.5-2`);
  - cualquier otro (`'group'`) → fondo #F6DC6A, persona + signo más.
- Texto: `<b>{{m.text}}</b> <span #6E6259>· {{m.time}}</span>` (`min-width: 0`). Ejemplo: "**Andrés compró 2 boletas · General** · 8:05 a. m.".

##### 8.4 Fila de mensaje (`text`, `event`, `poll`, `photo`)
- **Fila:** `display: flex; justify-content: flex-end (de Camila) | flex-start (de otros); align-items: flex-start; gap: 8px; margin-top: 12px` (primer mensaje de una racha) o `3px` (mensaje seguido del mismo autor).
- **Avatar** (solo en parches y solo de otras personas): enlace a `Perfil.dc.html`, `aria-label="Perfil de {nombre completo}"`, 32 × 32, `flex-shrink: 0; border-radius: 50%; background: {color de la persona}; display: grid; place-items: center; font-weight: 700; font-size: .66rem` (10,56 px); #17120F. En los mensajes seguidos del mismo autor ocupa su lugar pero con `visibility: hidden` (y por eso tampoco recibe foco). En chats de persona y de organizador no hay avatar: la burbuja arranca en el borde.
- **Columna:** `max-width: min(78%, 440px); min-width: 0; display: flex; flex-direction: column; align-items: flex-end | flex-start; gap: 4px`.
- **Nombre** (solo en parches, de otras personas, primer mensaje de la racha): `font-size: .76rem` (12,16 px); 700; #6E6259; `padding: 0 4px`. Nombre completo ("Laura Martínez").
- **Burbuja de texto:** `padding: 9px 14px; font-size: .94rem` (15,04 px); `line-height: 1.42` (21,36 px); `overflow-wrap: anywhere`; borde 1 px.
  - De Camila: `background: #17120F; color: #FFFFFF; border-color: #17120F; border-radius: 18px 18px 4px 18px` (pico abajo a la derecha) en todos los casos.
  - De otros, primero de la racha: `background: #FFFFFF; color: #17120F; border-color: #EAE1D8; border-radius: 4px 18px 18px 18px` (pico arriba a la izquierda).
  - De otros, seguido: `border-radius: 18px`.
  - Ancho máximo: 410,3 px a 1280 con el panel abierto (78 % de 526); 440 px cuando hay espacio.
- **Hora** (solo en el último mensaje de una racha y si tiene hora): `display: inline-flex; align-items: center; gap: 4px; font-size: .7rem` (11,2 px); #6E6259; `padding: 0 4px`. Texto `{{m.time}}`. En los de Camila, después va un doble check de 14 px (`m2 13 4 4 8-9M10 15l2 2 9-10`), trazo 2,2, `aria-hidden`. Siempre el mismo ícono: no hay estados de enviado / entregado / leído.
- **Reglas de agrupación** ("racha"): un mensaje continúa la racha si el anterior también es `text`, `event`, `poll` o `photo` y es del mismo autor. Los separadores de fecha, el de "nuevos" y los mensajes del sistema cortan la racha. Ejemplo: en Salseros, el texto s1 y la tarjeta s2 de Laura van juntos: s1 no muestra hora y la tarjeta no muestra nombre ni avatar visible; en Clásico, Daniel escribe c6 y c7 seguidos: c6 muestra sus reacciones pero no su hora.

##### 8.5 Tarjeta de evento compartido (`type: 'event'`)
- `<article>`: `width: 290px; max-width: 100%; background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 18px; overflow: hidden; color: #17120F`. Mide 292 × 260 (`content-box`).
- **Imagen** (`div role="img" aria-label="[Foto del evento]"`): `position: relative; height: 104px; background: radial-gradient(circle at 70% 30%, {{bg1}} 0, transparent 58%), {{bg2}}`. Placa de fecha `position: absolute; top: 10px; left: 10px; background: #FFFFFF; border-radius: 10px; padding: 5px 9px 4px; text-align: center; line-height: 1; min-width: 42px; box-sizing: border-box` (42 × 42,4) con el día (Archivo 900, `1.15rem` = 18,4 px) y "oct" (`.62rem` = 9,92 px; 700; mayúsculas; `letter-spacing: .06em`; #6E6259).
- **Cuerpo:** `padding: 12px 14px 14px; display: flex; flex-direction: column; gap: 2px; line-height: 1.3`:
  1. categoría `{{m.evCat}}`: `.66rem` (10,56 px), 700, `letter-spacing: .1em`, mayúsculas, #C23A24 ("RUMBA", "CONCIERTOS", "DEPORTE").
  2. título (enlace a `Evento.dc.html`): Archivo 800, `1.02rem` (16,32 px), `letter-spacing: -0.01em; line-height: 1.2`.
  3. datos `{{m.evMeta}}`: `.8rem` (12,8 px), #6E6259 → `día d oct · lugar · ciudad` (sin hora): "Vie 9 oct · Galería Café Libro · Bogotá".
  4. precio `{{m.evPrice}}`: `.82rem` (13,12 px), 700, `margin-top: 3px` → "Desde $45.000".
  5. acciones (`display: flex; gap: 8px; margin-top: 10px`):
     - botón "Repostear" / "Reposteado" (`aria-pressed`): `flex: 1; height: 40px; border-radius: 999px; border: 1px solid #17120F; font-size: .82rem` (13,12 px); 700; `display: flex; align-items: center; justify-content: center; gap: 6px`. Ícono de 15 px de flechas en círculo (`M17 2l4 4-4 4` + `M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4` + `M21 13v2a3 3 0 0 1-3 3H3`), trazo 2,2. Suelto: fondo #FFFFFF, texto #17120F, "Repostear". Presionado: fondo #17120F, texto #FFFFFF, "Reposteado". Mide 214 × 40.
     - enlace circular a `Evento.dc.html` con `aria-label="Ver evento: {título}"`: 40 × 40, `box-sizing: border-box; border-radius: 50%; border: 1px solid #EAE1D8`, flecha de 16 px (`M5 12h14M13 6l6 6-6 6`), trazo 2,4.
- **Componente / reutilización:** variante compacta de la tarjeta de evento (`.card`, `.date`, `.cat`, `.price` del código base). El repostear aquí es instantáneo y no cuenta nada; en Agenda abre una ventana y en Mapa también es instantáneo (H41 pide un solo patrón).

##### 8.6 Encuesta (`type: 'poll'`)
- Tarjeta: `width: 300px; max-width: 100%; box-sizing: border-box; background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 18px; padding: 14px; display: flex; flex-direction: column; gap: 8px; color: #17120F`. Mide 300 × 252,9 con 3 opciones.
  1. antetítulo "Encuesta": `display: flex; align-items: center; gap: 6px; font-size: .66rem` (10,56 px); 700; `letter-spacing: .1em`; mayúsculas; #C23A24; ícono de barras de 13 px (`M6 20V11M12 20V5M18 20v-6`), trazo 2,6 → "ENCUESTA".
  2. pregunta `<b>`: `font-size: 1rem` (16 px), `line-height: 1.3`.
  3. opciones (`div role="group" aria-label="{pregunta}"`, `display: flex; flex-direction: column; gap: 6px`). Cada opción es un `<button aria-pressed aria-label="{opción}, {n} voto(s)">`: `position: relative; overflow: hidden; min-height: 44px; border-radius: 12px; border: 1.5px solid (#17120F votada | #EAE1D8); background: #FFFFFF; color: #17120F; padding: 0 12px; display: flex; align-items: center; gap: 10px; text-align: left; font-size: .88rem` (14,08 px); `font-weight: 500`. Mide 270 × 44 (más alto si el texto se parte, como "Donde Laura, en Chapinero" a 390 px).
     - relleno de resultado (`aria-hidden`, `data-fx`): `position: absolute; left: 0; top: 0; bottom: 0; width: {pct}%; background: (#F6DC6A votada | #F3ECE5); transition: width 300ms ease`.
     - círculo de 18 px (`position: relative; box-sizing: border-box; border-radius: 50%; border: 2px solid #17120F; background: (#17120F votada | #FFFFFF); color: #FFFFFF`) con palomita de 10 px trazo 4, `visibility: visible` solo si está votada.
     - texto de la opción: `position: relative; flex: 1; min-width: 0; padding: 8px 0`.
     - conteo: `position: relative; font-weight: 700; font-size: .84rem` (13,44 px).
  4. pie `{{m.pollFoot}}`: `font-size: .76rem` (12,16 px); #6E6259.
- **Datos dinámicos:**
  - `count_k = votos_base_k + (voto de Camila === k ? 1 : 0)`; `sum = Σ count`; `pct_k = sum ? Math.round(count_k / sum × 100) : 0`. Inicial en Salseros: 5 / 3 / 1, suma 9 → 56 % / 33 % / 11 %. Votando "Un bar en la Zona T": 5 / 4 / 1, suma 10 → 50 % / 40 % / 10 %.
  - `aria-label`: "Donde Laura, en Chapinero, 5 votos", "Directo al evento, 1 voto" (sí maneja el singular).
  - `pollFoot`: sin voto → `(sum ? sum + ' votos · ' : '') + 'Toca una opción para votar'` ("9 votos · Toca una opción para votar"; encuesta nueva: "Toca una opción para votar"); con voto → `'Votaste por «' + opción + '» · ' + sum + ' votos · Toca otra opción para cambiar'`. El pie **no** maneja el singular: con un solo voto dice "1 votos".

##### 8.7 Foto (`type: 'photo'`)
- Tarjeta: `width: 260px; max-width: 100%; background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 18px; overflow: hidden` (262 px con borde).
- Imagen (`div role="img" aria-label="{{m.alt}}"`): `position: relative; aspect-ratio: 4 / 3` (260 × 195); `background: radial-gradient(circle at 28% 30%, {{pBg1}} 0, transparent 50%), radial-gradient(circle at 76% 72%, {{pBg3}} 0, transparent 42%), {{pBg2}}`.
- Rótulo sobre la foto (`aria-hidden`, repite el `alt`): `position: absolute; left: 8px; bottom: 8px; max-width: calc(100% - 16px); box-sizing: border-box; background: rgba(23,18,15,.66); border-radius: 999px; padding: 2px 9px; font-size: .68rem` (10,88 px); #FFFFFF; `white-space: nowrap; overflow: hidden; text-overflow: ellipsis` → "[Foto: la pista en la edición pasada]".
- Pie de foto (si hay): `padding: 9px 12px; font-size: .9rem` (14,4 px); `line-height: 1.4`; #17120F.
- Valores por defecto: `alt` "[Foto]", colores #F6DC6A / #5A2340 / #EE93BC. La foto que "envía" Camila usa `alt` "[Foto que compartiste]" y #F6DC6A / #C46A2B / #EE93BC.

##### 8.8 Reacciones (debajo de cualquier mensaje de fila que tenga `rx`)
- Fila `display: flex; flex-wrap: wrap; gap: 6px`. Cada reacción es un `<button aria-pressed aria-label="{nombre}, {n}">`: `height: 36px; border-radius: 999px; padding: 0 11px; border: 1px solid (#17120F marcada | #EAE1D8); background: (#F6DC6A marcada | #FFFFFF); color: #17120F; display: inline-flex; align-items: center; gap: 5px; font-size: .8rem` (12,8 px); 700. Medidas a 1280: "Me encanta, 4" 52,4 × 36; "Prendido, 2" 51,5 × 36; "Me gusta, 3" 51,8 × 36 (el ancho depende del número).
- Íconos de 15 px, trazo 2,2: corazón ("Me encanta", trazo #C23A24, sin relleno), llama ("Prendido", trazo #C23A24) y pulgar ("Me gusta", `currentColor`). Texto: el conteo.
- `n = base + (marcada ? 1 : 0)`. No hay forma de agregar una reacción nueva a un mensaje: solo se alternan las que ya existen en el dato.

##### 8.9 Estado vacío de la conversación
- `margin: 20px auto 0; max-width: 34ch; text-align: center; color: #6E6259; font-size: .9rem` (14,4 px). Se muestra cuando no hay ningún mensaje que no sea separador de fecha.
- Texto: parche → "Arranquen el plan: escriban, compartan un evento o armen una encuesta."; persona → "Escríbele a {nombre corto} para arrancar el plan." ("Escríbele a Daniel para arrancar el plan."). En la práctica solo aparece en los chats nuevos con una persona: los parches nuevos ya nacen con dos mensajes del sistema.
- Como el historial va pegado abajo, el texto aparece abajo, justo encima del compositor.

#### 9. Conversación · compositor (`div data-ch="composer"`)

- **Layout:** `flex-shrink: 0; background: #FFFFFF; border-top: 1px solid #EAE1D8; padding: 10px 12px; display: flex; flex-direction: column; gap: 8px`. Mide 65 px de alto; 115 px con la bandeja "Compartir" abierta. Por debajo de 900 px: `position: sticky; bottom: 0; z-index: 4; border-radius: 0 0 20px 20px`.
- **Contenido en orden:**
  1. **Bandeja "Compartir"** (solo si está abierta; `div role="group" aria-label="Elige un evento para compartir"`): `display: flex; align-items: center; gap: 8px; overflow-x: auto; padding-bottom: 2px`. Hace scroll horizontal (936 px de contenido en 538 visibles a 1280) sin pista visual.
     - rótulo "Compartir:" (`flex-shrink: 0; font-size: .78rem` = 12,48 px; 700; #6E6259);
     - 4 botones (uno por evento, en el orden e1, e4, e3, e7): `flex-shrink: 0; height: 40px; border-radius: 999px; border: 1px solid #EAE1D8; background: #FBF7F3; color: #17120F; padding: 0 14px 0 5px; display: inline-flex; align-items: center; gap: 8px; font-size: .8rem` (12,8 px); 700; `white-space: nowrap`. Empiezan con un círculo de 30 px con el degradado del evento. Textos (nombre corto): "Noche de salsa y boleros", "Santa Fe vs. Millonarios", "Rock en el Movistar Arena", "Reguetón en Provenza".
  2. **Fila de escritura:** `display: flex; flex-wrap: wrap; align-items: center; gap: 8px`.
     - grupo de 3 botones (`display: flex; gap: 2px; flex-shrink: 0`), cada uno de 44 × 44, `border-radius: 50%; border: 0; display: grid; place-items: center`, íconos de 20 px:
       - **"Compartir evento"** (`aria-expanded`): calendario con signo más (`rect x=3 y=5 w=18 h=16 rx=2` + `M3 10h18M8 3v4M16 3v4M12 13v5M9.5 15.5h5`), trazo 2. Cerrada: fondo transparente, #17120F. Abierta: fondo #17120F, ícono #FFFFFF.
       - **"Crear encuesta":** barras (`M6 20V11M12 20V5M18 20v-6`), trazo 2,2, fondo transparente.
       - **"Enviar foto":** imagen (`rect x=3 y=5 w=18 h=14 rx=2` + `circle cx=9 cy=10 r=1.5` + `m21 16-5-5-9 8`), trazo 2, fondo transparente.
     - **Campo** (`label` con `position: relative; flex: 1 1 120px; min-width: 0`; texto oculto "Escribe un mensaje"): `<input type="text" autocomplete="off" placeholder="{{placeholder}}">` con `width: 100%; box-sizing: border-box; height: 44px; border: 1px solid #EAE1D8; border-radius: 999px; padding: 0 16px; background: #FBF7F3; font-size: .95rem` (15,2 px); #17120F; `outline: 0`. Es de **una sola línea** (no `textarea`). Mide 282,4 px a 1280 con el panel abierto; 136 px a 390 (el placeholder se lee "Escríbele al pa").
     - **"Enviar"** (`button data-ch="send"`, `disabled` mientras el borrador esté vacío): `position: relative; height: 44px; min-width: 44px; box-sizing: border-box; flex-shrink: 0; border: 0; border-radius: 999px; padding: 0 18px; font-weight: 700; font-size: .9rem` (14,4 px); `display: inline-flex; align-items: center; justify-content: center; gap: 8px`. Texto "Enviar" (`span data-ch="sendtxt"`) + avión de papel de 16 px (`M22 2 11 13M22 2l-7 20-4-9-9-4z`), trazo 2,2. Habilitado: fondo #C23A24, texto #FFFFFF. Deshabilitado: fondo #EAE1D8, texto #6E6259, cursor normal. Mide 103,6 × 44. Por debajo de 900 px: 44 × 44, solo ícono, y "Enviar" queda como texto oculto (sigue siendo su nombre accesible).
- **Datos dinámicos:**
  - `placeholder`: parche → "Escríbele al parche"; organizador → "Escríbele a Galería Café Libro" (**escrito a mano en el código**, no sale del dato); persona → "Escríbele a {nombre corto}" ("Escríbele a Laura").
  - Hay un borrador por conversación (`drafts[id]`): lo escrito en una conversación se conserva al cambiar a otra y volver.
  - `canSend = borrador.trim().length > 0`: solo espacios no habilitan "Enviar".
- **Componente / reutilización:** compositor nuevo. El campo usa el estilo de buscador de la lista (fondo crema, píldora). H43 pide agrupar los 3 íconos de adjuntar en un solo botón "+" en celular.

#### 10. Panel de información · cabecera (`<aside data-ch="info" aria-label="{{infoLabel}}">`)

- **Layout del panel:** `position: relative; width: 296px; flex-shrink: 0; min-height: 0; overflow-y: auto; background: #FFFFFF; border-left: 1px solid #EAE1D8; display: flex; flex-direction: column`. Mide 297 × 797 a 1280 y su contenido de Salseros mide 1220 px: hace scroll propio.
  - Visible por defecto desde 1180 px. Entre 900 y 1179 px es un **cajón superpuesto** dentro del shell: `position: absolute; top: 0; right: 0; bottom: 0; z-index: 6; width: min(320px, 100%); box-shadow: -16px 0 40px rgba(23,18,15,.16)` (mide 321 × 665 a 1024 × 768 y tapa el lado derecho de la conversación: medido con `elementFromPoint`, quedan debajo del cajón los botones "Ver evento", Info y "Silenciar chat" de la barra superior y el botón "Enviar"; por eso el cajón solo se puede cerrar con "Cerrar información", no volviendo a tocar Info). Por debajo de 900 px es una **pantalla completa**: `position: fixed; inset: 0; z-index: 30; width: auto; box-shadow: none` (390 × 844 a 390; tapa también el encabezado y la barra superior, así que tampoco ahí se puede cerrar con Info). No tiene `role="dialog"` ni se cierra con Escape (H7).
- **Cabecera:** `display: flex; align-items: center; justify-content: space-between; padding: 10px 10px 0 18px` (50 px de alto).
  - rótulo `{{infoLabel}}`: `font-size: .7rem` (11,2 px); 700; `letter-spacing: .12em`; mayúsculas; #6E6259 → "INFO DEL GRUPO" / "INFO DEL CHAT".
  - botón "Cerrar información" (`aria-label="Cerrar información"`): 40 × 40, `border: 0; border-radius: 50%; background: #FBF7F3; color: #17120F`, equis de 16 px (`M6 6l12 12M18 6 6 18`), trazo 2,4. Cierra el panel en cualquier ancho y cancela una confirmación de salida abierta.
- **Componente / reutilización:** "Panel lateral / cajón". Origen visual en `.people` del código base. Debe ser un solo componente con dos modos: columna fija (≥ 1180 px) y cajón modal (< 1180 px, con las reglas de H7).

#### 11. Panel · identidad

- **Layout:** `padding: 4px 18px 18px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 6px; border-bottom: 1px solid #EAE1D8`.
- **Contenido en orden:**
  1. Avatar grande (`aria-hidden`): 72 × 72, `border-radius` 20px (parche y organizador) o 50% (persona), mismo fondo, color, familia y peso que en la lista, `font-size: 1.25rem` (20 px).
  2. `<h2>` `{{cv.name}}`: `margin: 4px 0 0; font-size: 1.15rem` (18,4 px); `line-height: 1.25`; `display: flex; align-items: center; gap: 6px`. Si es organizador, sello verificado de 17 px. Sin truncado.
  3. Subtítulo `{{cv.infoSub}}`: `font-size: .84rem` (13,44 px); #6E6259.
  4. Solo personas y organizador: enlace a `Perfil.dc.html` con `{{cv.profileLabel}}`: `margin-top: 6px; height: 38px; box-sizing: border-box; display: inline-flex; align-items: center; padding: 0 16px; border-radius: 999px; border: 1px solid #17120F; font-size: .84rem` (13,44 px); 700.
- **Datos dinámicos:**
  - `infoSub`: parche → `'Parche · ' + total + ' miembros'` ("Parche · 12 miembros"); organizador → "Organizador verificado · Responde en ~1 h"; persona → `ciudad + ' · ' + (estado || 'Amigo en Fulleventos')` ("Bogotá · En línea", "Medellín · Activo hace 2 h", "Bogotá · Activa hace 20 min", "Bogotá · Amigo en Fulleventos").
  - `profileLabel`: "Ver perfil del organizador" (organizador) o "Ver perfil" (persona).

#### 12. Panel · "Evento del parche" (solo parches con evento)

- **Layout:** `padding: 16px 18px; border-bottom: 1px solid #EAE1D8; display: flex; flex-direction: column; gap: 10px`.
- **Contenido en orden:**
  1. `<h3>` "Evento del parche": `margin: 0; font-size: .7rem` (11,2 px); 700; `letter-spacing: .12em`; mayúsculas; #C23A24 → "EVENTO DEL PARCHE".
  2. Enlace a `Evento.dc.html` (`display: flex; align-items: center; gap: 12px`): miniatura `span role="img" aria-label="[Foto del evento]"` de 52 × 52, `border-radius: 14px`, mismo degradado del plan; y texto (`min-width: 0; line-height: 1.3`) con el título en `<b>` (`display: block; font-size: .92rem` = 14,72 px) y `{{plan.metaShort}}` (`.78rem` = 12,48 px, #6E6259).
- **Datos dinámicos:** `metaShort = día + ' ' + d + ' oct · ' + lugar + ' · ' + ciudad` (sin hora): "Vie 9 oct · Galería Café Libro · Bogotá".

#### 13. Panel · "Miembros" (solo parches)

- **Layout:** `padding: 16px 18px; border-bottom: 1px solid #EAE1D8`.
- **Contenido en orden:**
  1. Fila de título (`display: flex; align-items: baseline; justify-content: space-between; gap: 8px`): `<h3>` "Miembros · {{cv.memberCount}}" (`margin: 0; font-size: .95rem` = 15,2 px; peso por defecto 700) y `{{cv.ticketsShort}}` (`.76rem` = 12,16 px; #6E6259).
  2. `<ul>` (`list-style: none; margin: 8px 0 0; padding: 0; display: flex; flex-direction: column`) con un `<li>` por miembro: `display: flex; align-items: center; gap: 10px; padding: 6px 0` (46 px de alto).
     - avatar `aria-hidden` de 34 × 34, círculo con el color de la persona, `font-weight: 700; font-size: .7rem` (11,2 px);
     - texto (`flex: 1; min-width: 0; line-height: 1.25; font-size: .88rem` = 14,08 px): nombre (`display: block; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`) y, si es quien creó el parche, el rol debajo (`display: block; font-size: .74rem` = 11,84 px; #6E6259). A 1280 los nombres largos se cortan ("Valentina Qui…", "Juan Pablo Roj…").
     - estado de boleta (solo si el parche tiene evento):
       - "Tiene boleta": `flex-shrink: 0; display: inline-flex; align-items: center; gap: 5px; font-size: .74rem` (11,84 px); 700; con un círculo de 20 px #B9E07A y palomita de 11 px trazo 3,4.
       - "Sin boleta": `flex-shrink: 0; font-size: .74rem`; #6E6259.
- **Datos dinámicos:**
  - `memberCount = total`; `ticketsShort = conBoleta + ' de ' + total + ' con boleta'` ("7 de 12 con boleta") o vacío si el parche no tiene evento (el `span` queda vacío).
  - Orden: Camila primero, luego los que tienen boleta y luego los que no; dentro de cada grupo, el orden de la lista de miembros del dato (orden estable).
  - Nombre: Camila aparece como "Tú (Camila)"; los demás con nombre completo.
  - Rol: si el miembro es el administrador, "Creó el parche" (o "Creaste el parche" si es Camila).
- **Componente / reutilización:** "Fila de miembro", derivada de `.act` del código base. H30 pide revisar si mostrar "Tiene boleta" / "Sin boleta" a todos.

#### 14. Panel · "Dividir pago del parche" (solo parches con evento)

- **Layout:** `padding: 16px 18px; border-bottom: 1px solid #EAE1D8`.
- **Contenido en orden:**
  1. Botón de alternancia (`aria-pressed`): `width: 100%; min-height: 44px; border-radius: 999px; border: 1px solid #17120F; font-weight: 700; font-size: .88rem` (14,08 px); `display: flex; align-items: center; justify-content: center; gap: 8px; padding: 0 14px`. Ícono de pesos de 17 px, trazo 2,2. Suelto: fondo #FFFFFF, texto #17120F, "Dividir pago del parche". Presionado: fondo #17120F, texto #FFFFFF, "Pago dividido activo". Mide 260 × 44.
  2. Nota fija: `margin: 8px 0 0; font-size: .8rem` (12,8 px); `line-height: 1.4`; #6E6259: "Cada uno paga su parte de la boleta desde su cuenta: nadie tiene que adelantar la plata de todos."
- **Comportamiento:** al activarlo se publica en el chat el mensaje del sistema "Camila activó el pago dividido: cada uno paga su parte" (ícono de pesos sobre #8FD3D0, hora "Ahora") y la conversación sube al primer lugar de la lista. Al desactivarlo **no** se publica nada. Cualquier miembro puede activarlo (Camila no administra Salseros). H18 y H29 cambian esto en producción (ver "Correcciones").

#### 15. Panel · "Planes en común" / "Sus próximos eventos" (solo personas y organizador)

- **Layout:** `padding: 16px 18px; border-bottom: 1px solid #EAE1D8; display: flex; flex-direction: column; gap: 10px`. Solo aparece si hay al menos un evento.
- **Contenido en orden:**
  1. `<h3>` `{{commonTitle}}` (`margin: 0; font-size: .95rem` = 15,2 px): "Planes en común" (persona) o "Sus próximos eventos" (organizador).
  2. Un enlace a `Evento.dc.html` por evento (`display: flex; align-items: center; gap: 12px`): miniatura de 46 × 46 (`border-radius: 12px`, degradado del evento, `role="img" aria-label="[Foto del evento]"`) y texto (`min-width: 0; line-height: 1.3`) con el título en `<b>` (`display: block; font-size: .88rem` = 14,08 px) y los datos (`.76rem` = 12,16 px; #6E6259).
- **Datos dinámicos:**
  - Organizador: sus eventos del dato (`events: ['e1']`), con datos `día d oct · ciudad`: "Vie 9 oct · Bogotá".
  - Persona: los eventos de los **parches** (que sigan en la lista) donde están Camila y esa persona, sin repetir evento, en el orden de la lista. Datos `día d oct · ciudad · nombre del parche`: "Vie 9 oct · Bogotá · Salseros de jueves". Resultado: Laura → salsa (Salseros) y rock (Rockeros); Andrés → salsa; Sofía → salsa y clásico (Clásico capitalino); un chat nuevo con Daniel → salsa, clásico y rock. Si Camila sale de un parche, ese evento deja de aparecer.

#### 16. Panel · ajustes (silenciar, salir y confirmación)

- **Layout:** `padding: 10px 18px 18px; display: flex; flex-direction: column; gap: 4px`.
- **Contenido en orden:**
  1. **"Silenciar notificaciones"** (botón con `aria-pressed`, comparte el estado con "Silenciar chat" de la barra): `width: 100%; min-height: 48px; border: 0; background: transparent; padding: 0; display: flex; align-items: center; gap: 12px; text-align: left; color: #17120F; font-size: .9rem` (14,4 px); `font-weight: 500`.
     - campana tachada de 19 px, trazo 2;
     - texto `flex: 1` "Silenciar notificaciones";
     - interruptor visual (`aria-hidden`): pista `position: relative; width: 44px; height: 26px; flex-shrink: 0; border-radius: 999px; background: (#17120F encendido | #EAE1D8 apagado)`; perilla `position: absolute; top: 3px; left: (21px encendido | 3px apagado); width: 20px; height: 20px; border-radius: 50%; background: #FFFFFF; box-shadow: 0 1px 3px rgba(23,18,15,.3); transition: left 160ms ease` (`data-fx`). La pista apagada sobre blanco da 1,29:1 (H52).
  2. Solo parches, si no se está confirmando: **"Salir del parche"**: `align-self: flex-start; min-height: 44px; border: 0; background: transparent; padding: 0; color: #C23A24; font-weight: 700; font-size: .9rem` (14,4 px); `display: flex; align-items: center; gap: 12px`. Ícono de salida de 19 px (`M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 17l-5-5 5-5M5 12h11`), trazo 2. Mide 140,4 × 44.
  3. Solo parches, al tocar "Salir del parche": **confirmación en línea** (`div role="group" aria-label="Confirmar salida del parche"`) que reemplaza al botón: `margin-top: 4px; background: #FBF7F3; border: 1px solid #EAE1D8; border-radius: 16px; padding: 14px; display: flex; flex-direction: column; gap: 10px`.
     - `<p>` (`margin: 0; font-size: .86rem` = 13,76 px; `line-height: 1.4`): "¿Seguro que quieres salir de **{nombre del parche}**? Ya no verás los mensajes ni el plan."
     - botones (`display: flex; flex-wrap: wrap; gap: 8px`), ambos `height: 40px; border-radius: 999px; padding: 0 14px; font-size: .84rem` (13,44 px); 700:
       - "Me quedo": `border: 1px solid #17120F; background: #FFFFFF; color: #17120F`.
       - "Sí, salir": `border: 0; background: #C23A24; color: #FFFFFF`.
- Las conversaciones con personas y con el organizador **no** tienen ninguna acción de salir, borrar, bloquear ni reportar (H9).
- **Componente / reutilización:** "Interruptor" nuevo; en Evento hay otro con `role="switch"` y `aria-checked` (46 × 28, perilla de 22) que la auditoría da como bien hecho (H59): unificar en uno solo con ese patrón. "Confirmación en línea" nueva.

#### 17. Ventana "Nuevo parche" / "Nuevo chat" (condicional, fuera del `<main>`)

- **Capa:** `position: fixed; inset: 0; z-index: 40; display: flex; align-items: center; justify-content: center; padding: 16px; box-sizing: border-box`.
  - Fondo (`div aria-hidden="true"`, clicable: cierra): `position: absolute; inset: 0; background: rgba(23,18,15,.55)`.
  - Ventana (`div role="dialog" aria-modal="true" aria-labelledby="ch-modal-title"`, con `onKeyDown` que cierra con Escape): `position: relative; width: 100%; max-width: 540px; max-height: calc(100vh - 32px); overflow-y: auto; background: #FFFFFF; border-radius: 24px; padding: 22px; box-sizing: border-box; display: flex; flex-direction: column; gap: 16px; box-shadow: 0 24px 60px rgba(23,18,15,.3)`.
  - Medidas: "Nuevo parche" 540 × 665,3 a 1280 (694,5 con el aviso del evento); "Nuevo chat" 540 × 487,1. A 390 × 844: 358 de ancho; "Nuevo chat" 723 de alto y "Nuevo parche" llega al máximo (812) con scroll interno (901 px de contenido).
- **Contenido en orden:**
  1. **Cabecera** (`display: flex; align-items: center; justify-content: space-between; gap: 12px`): `<h2 id="ch-modal-title">` `{{modalTitle}}` (`margin: 0; font-family: 'Archivo'; font-weight: 900; font-size: 1.4rem` = 22,4 px; `letter-spacing: -0.02em`) → "Nuevo parche" o "Nuevo chat"; y botón "Cerrar" (`aria-label="Cerrar"`, 40 × 40, `flex-shrink: 0; border: 0; border-radius: 50%; background: #FBF7F3`, equis de 16 px trazo 2,4).
  2. **Tipo de chat** (`div role="group" aria-label="Tipo de chat"`): `display: flex; background: #FBF7F3; border: 1px solid #EAE1D8; border-radius: 999px; padding: 4px`. Dos botones con `aria-pressed`, `flex: 1; height: 38px; border: 0; border-radius: 999px; font-size: .86rem` (13,76 px); 700 (243 × 38 cada uno a 1280): "Parche (grupo)" y "Con una persona". Marcado: fondo #17120F, texto #FFFFFF; sin marcar: transparente, #17120F.
  3. Solo en modo parche:
     - **"Nombre del parche"** (`label`: `display: flex; flex-direction: column; gap: 6px; font-size: .88rem` = 14,08 px; 700): `<input type="text" maxlength="40" placeholder="Ej.: Previa del viernes" autocomplete="off">` con `height: 46px; box-sizing: border-box; border: 1px solid #EAE1D8; border-radius: 14px; padding: 0 14px; font-size: .95rem` (15,2 px); `font-weight: 400; background: #FBF7F3; color: #17120F; outline: 0`.
     - **"Evento del plan (opcional)"** (`label` igual; "(opcional)" en `font-weight: 400; color: #6E6259`): `<select>` con `height: 46px; box-sizing: border-box; border: 1px solid #EAE1D8; border-radius: 14px; padding: 0 12px; font-size: .9rem` (14,4 px); 400; `background: #FBF7F3; color: #17120F; max-width: 100%`. Opciones: "" → "Sin evento por ahora"; `e1` → "Noche de salsa y boleros en vivo · Vie 9 oct · Bogotá"; `e4` → "Santa Fe vs. Millonarios · Dom 11 oct · Bogotá"; `e3` → "Rock en el Movistar Arena · Sáb 10 oct · Bogotá"; `e7` → "Noche de reguetón en Provenza · Vie 9 oct · Medellín".
     - Si se elige un evento: `<p>` (`margin: -6px 0 0; font-size: .8rem` = 12,8 px; #6E6259) "El evento queda fijado arriba del chat y todos ven quién ya tiene boleta."
  4. **Amigos** (`<fieldset>` sin borde ni márgenes, `min-width: 0`): `<legend>` `{{mLegend}}` (`padding: 0; margin-bottom: 8px; font-size: .88rem`; 700) → "¿A quién invitas?" (parche) o "¿Con quién quieres hablar?" (persona). Rejilla `display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 8px` (2 columnas de 244 px a 1280 y 768; 1 columna de 314 a 390).
     - Un botón por amigo (`aria-pressed`): `display: flex; align-items: center; gap: 10px; min-height: 52px; padding: 6px 12px 6px 6px; border-radius: 14px; border: 1.5px solid (#17120F elegido | #EAE1D8); background: (#FBF7F3 elegido | #FFFFFF); color: #17120F; text-align: left` (244 × 52).
       - avatar de 38 × 38 (círculo, color de la persona, 700, `.72rem` = 11,52 px);
       - texto (`flex: 1; min-width: 0; line-height: 1.25`): nombre en `<b>` (`display: block; font-size: .88rem`) y ciudad (`.76rem` = 12,16 px; #6E6259);
       - casilla visual de 22 × 22 (`box-sizing: border-box; border: 2px solid #17120F; background: (#17120F elegido | #FFFFFF)`) con palomita blanca de 12 px trazo 3,6 (visible solo si está elegido). Radio **6px** en modo parche (casilla cuadrada: varios) y **50%** en modo persona (círculo: uno solo).
  5. **Pie** (`display: flex; flex-wrap: wrap; align-items: center; justify-content: flex-end; gap: 10px`):
     - ayuda `{{mHelp}}` (`flex: 1 1 180px; font-size: .8rem` = 12,8 px; #6E6259);
     - "Cancelar": `height: 46px; border: 0; background: transparent; padding: 0 14px; font-weight: 700; color: #17120F` (86,9 px de ancho);
     - principal `{{mPrimaryLabel}}` ("Crear parche" o "Abrir chat"), `disabled` mientras falte algo: `height: 46px; border: 0; border-radius: 999px; padding: 0 22px; font-weight: 700` ("Crear parche" 130 px; "Abrir chat" 109,8 px). Listo: fondo #C23A24, texto #FFFFFF. Incompleto: fondo #EAE1D8, texto #6E6259.
     - **Ojo:** estos dos botones **no fijan `font-size`**: quedan en el tamaño por defecto del navegador para botones, **13,33 px** (medido), más chicos que el resto de botones de texto de la pantalla (12,8 a 14,4 px fijados con `rem`). Al implementar, darles un tamaño explícito (por ejemplo .9rem como "Enviar") y decidirlo a conciencia.
     - A 390 px el botón principal (tanto "Crear parche" como "Abrir chat") baja solo a una segunda línea, alineado a la derecha; "Cancelar" se queda en la primera, junto a la ayuda.
- **Datos dinámicos:**
  - Los amigos que se pueden elegir son siempre los mismos 7 y en este orden: Laura Martínez, Andrés Ramírez, Sofía Cárdenas, Juan Pablo Rojas, María F. Gómez, Daniel Torres, Valentina Quintero.
  - `mHelp` (validación en vivo):
    - parche sin nombre y sin amigos: "Ponle nombre y elige al menos a un amigo.";
    - sin nombre (o solo espacios): "Falta el nombre del parche.";
    - sin amigos: "Elige al menos a un amigo.";
    - listo: "Serán {elegidos + 1} en el parche, contándote a ti." ("Serán 3 en el parche, contándote a ti.");
    - persona sin elegir: "Elige con quién quieres hablar.";
    - persona elegida: "Abrirás tu chat con {nombre corto}." ("Abrirás tu chat con Daniel.").
  - Nombre del parche: máximo 40 caracteres (`maxlength`), se guarda recortado (`trim`).
- **Componente / reutilización:** "Ventana modal" única para todo el producto (la del Chat es la más completa: fondo clicable, Escape, `max-height` con scroll interno; Agenda y Evento tienen variantes). El selector de amigos es nuevo; en modo persona es de opción única y debe implementarse como grupo de radios (H59).

### Datos de ejemplo

**Personas** (`P`; mismos nombres, iniciales y colores que el resto del lienzo):

| Clave | Nombre | Nombre corto | Iniciales | Color | Ciudad |
|---|---|---|---|---|---|
| me | Camila Vargas | Camila | CV | #8FD3D0 | Bogotá |
| lm | Laura Martínez | Laura | LM | #F3B27E | Bogotá |
| ar | Andrés Ramírez | Andrés | AR | #A3A8F0 | Medellín |
| sc | Sofía Cárdenas | Sofía | SC | #EE93BC | Bogotá |
| jp | Juan Pablo Rojas | Juan Pablo | JP | #B9E07A | Bogotá |
| mg | María F. Gómez | Mafe | MG | #F6DC6A | Bogotá |
| dt | Daniel Torres | Daniel | DT | #8FD3D0 | Bogotá |
| vq | Valentina Quintero | Vale | VQ | #A3A8F0 | Medellín |
| nh | Natalia Herrera | Natalia | NH | #F6DC6A | Bogotá |
| cr | Carolina Ruiz | Caro | CR | #EE93BC | Bogotá |
| sb | Sebastián Becerra | Sebas | SB | #8FD3D0 | Bogotá |
| mj | Majo Pineda | Majo | MJ | #B9E07A | Bogotá |
| gc | Galería Café Libro | Galería Café Libro | GC | #17120F | Bogotá |

**Amigos que se pueden elegir en la ventana** (`FRIENDS`, en este orden): lm, ar, sc, jp, mg, dt, vq.

**Eventos** (`EV`; los mismos de Agenda, Main y Mapa, con campos propios del chat). Orden en la bandeja y en la ventana: e1, e4, e3, e7.

| id | Título | Nombre corto (bandeja) | Categoría | Etiqueta (píldora) | Día | Fecha | Hora | Lugar | Zona | Ciudad | Precio | bg1 | bg2 | Faltan |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| e1 | Noche de salsa y boleros en vivo | Noche de salsa y boleros | Rumba | Salsa | Vie | 9 | 8:00 p. m. | Galería Café Libro | Zona T | Bogotá | 45000 | #E8A04F | #B5372B | 3 días |
| e4 | Santa Fe vs. Millonarios | Santa Fe vs. Millonarios | Deporte | Fútbol | Dom | 11 | 4:00 p. m. | Estadio El Campín | Teusaquillo | Bogotá | 60000 | #C4302B | #1F3A8A | 5 días |
| e3 | Rock en el Movistar Arena | Rock en el Movistar Arena | Conciertos | Rock | Sáb | 10 | (vacía) | Movistar Arena | Salitre | Bogotá | 180000 | #D9452F | #2B0F12 | 4 días |
| e7 | Noche de reguetón en Provenza | Reguetón en Provenza | Rumba | Reguetón | Vie | 9 | 10:00 p. m. | Barrio Provenza | El Poblado | Medellín | 50000 | #6B3FA0 | #0E0A1A | 3 días |

El campo `zone` no se muestra en ninguna parte del Chat.

**Conversaciones** (`BASE`, en el orden inicial de la lista):

| id | Tipo | Nombre | Iniciales / color | Evento | Administra | Miembros (en orden) | Con boleta | Cupos | Estado | No leídos / nuevos | Hora en la lista |
|---|---|---|---|---|---|---|---|---|---|---|---|
| salseros | parche | Salseros de jueves | SL / #F6DC6A | e1 | lm | me, lm, ar, vq, jp, sc, mg, dt, nh, cr, sb, mj (12) | lm, ar, vq, jp, sc, mg, dt (7) | — | — | 3 / 3 | 9:41 a. m. |
| laura | persona (lm) | Laura Martínez | LM / #F3B27E | — | — | — | — | — | En línea | 1 / 1 | 9:12 a. m. |
| galeria | organizador (gc) | Galería Café Libro | GC / #17120F con texto #F6DC6A | sus eventos: e1 | — | — | — | — | Organizador verificado · Responde en ~1 h | 1 / 1 | 8:30 a. m. |
| clasico | parche | Clásico capitalino | CC / #B9E07A | e4 | sc | me, sc, jp, dt (4) | sc, me (2) | 6 | — | 0 | Ayer |
| andres | persona (ar) | Andrés Ramírez | AR / #A3A8F0 | — | — | — | — | — | Activo hace 2 h | 0 | Ayer |
| rockeros | parche (silenciado) | Rockeros del Arena | RK / #A3A8F0 | e3 | jp | me, jp, vq, dt, lm, mg, sb, mj (8) | jp, vq, dt, lm, mg (5) | — | — | 0 | Dom |
| sofia | persona (sc) | Sofía Cárdenas | SC / #EE93BC | — | — | — | — | — | Activa hace 20 min | 0 | Sáb |

**Mensajes de "Salseros de jueves"** (Camila **sin** boleta):

| id | Tipo | De | Contenido | Hora | Reacciones |
|---|---|---|---|---|---|
| s0 | fecha | — | Ayer | — | — |
| s1 | texto | lm | ¡Gente! Quedó confirmado: el viernes nos vamos para la noche de salsa y boleros. | 7:02 p. m. (no se ve: sigue s2 de Laura) | — |
| s2 | evento | lm | e1 (Noche de salsa y boleros en vivo) | 7:02 p. m. | — |
| s3 | texto | jp | Me apunto. ¿Hasta qué hora tocan? | 7:15 p. m. | — |
| s4 | texto | lm | La última vez tocaron hasta las 2. Lleven zapatos cómodos. | 7:18 p. m. | Me encanta 4 · Prendido 2 |
| s5 | fecha | — | Hoy | — | — |
| s6 | sistema (boleta) | — | Andrés compró 2 boletas · General | 8:05 a. m. | — |
| s7 | texto | ar | Listo, compré la mía y la de Vale. Llego a Bogotá el jueves. | 8:06 a. m. | Me gusta 3 |
| s8 | texto | me | ¡Qué nivel! Yo compro la mía hoy en la noche. | 8:20 a. m. | — |
| (calculado) | nuevos | — | 3 mensajes nuevos | — | — |
| s9 | encuesta | sc | ¿Dónde hacemos la previa? · o1 "Donde Laura, en Chapinero" 5 · o2 "Un bar en la Zona T" 3 · o3 "Directo al evento" 1 | 9:30 a. m. | — |
| s10 | foto | mg | alt "[Foto: la pista en la edición pasada]" · pie "Así quedó la pista la última vez" · #F3B27E / #5A2340 / #E8A04F | 9:38 a. m. | — |
| s11 | texto | sc | Voto por donde Laura: queda cerca y caminamos juntos. | 9:41 a. m. | — |

**Mensajes de "Laura Martínez"**:

| id | Tipo | De | Contenido | Hora | Reacciones |
|---|---|---|---|---|---|
| l0 | fecha | — | Ayer | — | — |
| l1 | texto | me | Lau, ¿a qué hora es la previa en tu casa el viernes? | 6:40 p. m. | — |
| l2 | texto | lm | Desde las 7:30. Trae algo de picar si puedes. | 6:52 p. m. | Me encanta 1 |
| l3 | fecha | — | Hoy | — | — |
| (calculado) | nuevos | — | 1 mensaje nuevo | — | — |
| l4 | texto | lm | Y compra hoy la boleta, no la dejes para el viernes. | 9:12 a. m. | — |

**Mensajes de "Galería Café Libro"**:

| id | Tipo | De | Contenido | Hora |
|---|---|---|---|---|
| g0 | fecha | — | Ayer | — |
| g1 | texto | me | Hola, ¿a qué hora abren puertas el viernes? | 9:10 p. m. |
| g2 | fecha | — | Hoy | — |
| (calculado) | nuevos | — | 1 mensaje nuevo | — |
| g3 | texto | gc | ¡Hola, Camila! Abrimos a las 8:00 p. m. y la clase de baile gratis arranca a las 8:30 p. m. | 8:30 a. m. |

**Mensajes de "Clásico capitalino"** (Camila **con** boleta; 2 cupos libres):

| id | Tipo | De | Contenido | Hora | Reacciones |
|---|---|---|---|---|---|
| c0 | fecha | — | Ayer | — | — |
| c1 | texto | sc | Armé el parche para el clásico. Nos vemos a las 2 en la tienda de la 57 y caminamos al estadio. | 3:10 p. m. | — |
| c2 | sistema (boleta) | — | Sofía compró 2 boletas · Oriental | 3:12 p. m. | — |
| c3 | texto | me | ¡Gracias, Sofi! Ya te pasé lo mío. | 3:20 p. m. | — |
| c4 | sistema (grupo) | — | Juan Pablo y Daniel se unieron al parche | 5:02 p. m. | — |
| c5 | texto | jp | ¿Todos somos de Santa Fe o hay infiltrados? | 5:10 p. m. | — |
| c6 | texto | dt | Yo soy de Millos, pero voy en paz. | 5:14 p. m. (no se ve: sigue c7 de Daniel) | Prendido 3 |
| c7 | texto | dt | Faltan dos cupos. ¿Invitamos a Mafe? | 6:40 p. m. | — |
| c8 | texto | me | Yo le escribo. | 6:45 p. m. | — |

**Mensajes de "Andrés Ramírez"**:

| id | Tipo | De | Contenido | Hora |
|---|---|---|---|---|
| a0 | fecha | — | Ayer | — |
| a1 | texto | ar | Llego a Bogotá el jueves en la noche para la salsa. | 4:15 p. m. |
| a2 | texto | me | ¡Qué bien! ¿Y cuándo me recibes en Medellín? | 4:20 p. m. |
| a3 | evento | ar | e7 (Noche de reguetón en Provenza) | 4:30 p. m. (no se ve: sigue a4 de Andrés) |
| a4 | texto | ar | Cuando quieras. Nos vemos en el parque Lleras y arrancamos para Provenza. | 4:31 p. m. |

**Mensajes de "Rockeros del Arena"** (Camila sin boleta; silenciado):

| id | Tipo | De | Contenido | Hora | Reacciones |
|---|---|---|---|---|---|
| r0 | fecha | — | Dom 4 oct | — | — |
| r1 | texto | jp | ¿Alguien tiene el setlist de la gira? | 7:10 p. m. | — |
| r2 | texto | vq | Yo llego directo del trabajo. Nos vemos en la entrada. | 7:25 p. m. | — |
| r3 | sistema (boleta) | — | Daniel compró 1 boleta · General | 8:02 p. m. | — |
| r4 | foto | dt | alt "[Foto: la fila del concierto pasado]" · pie "Así estaba la fila la última vez: lleguen temprano." · #D9452F / #2B0F12 / #F3B27E | 8:10 p. m. | — |
| r5 | texto | lm | Yo llevo tapones para los oídos para el que quiera. | 8:30 p. m. | Me gusta 4 |

**Mensajes de "Sofía Cárdenas"**:

| id | Tipo | De | Contenido | Hora | Reacciones |
|---|---|---|---|---|---|
| f0 | fecha | — | Sáb 3 oct | — | — |
| f1 | texto | sc | ¿Vas al clásico del domingo 11? | 11:02 a. m. | — |
| f2 | texto | me | ¡Obvio! Ya estoy en el parche. | 11:05 a. m. | — |
| f3 | texto | sc | Perfecto, te guardo puesto al lado. | 11:06 a. m. | Me encanta 1 |

**Vistas previas iniciales de la lista:** "Sofía: Voto por donde Laura: queda cerca y caminamos juntos." · "Y compra hoy la boleta, no la dejes para el viernes." · "¡Hola, Camila! Abrimos a las 8:00 p. m. y la clase de baile gratis arranca a las 8:30 p. m." · "Tú: Yo le escribo." · "Cuando quieras. Nos vemos en el parque Lleras y arrancamos para Provenza." · "Laura: Yo llevo tapones para los oídos para el que quiera." · "Perfecto, te guardo puesto al lado."

**Otros valores fijos del código:**
- Etiquetas de reacción: `heart` → "Me encanta", `fire` → "Prendido", `like` → "Me gusta".
- Encuesta creada desde el compositor: pregunta por defecto "¿A qué hora nos vemos?"; opciones "7:00 p. m.", "8:00 p. m.", "9:00 p. m."; 0 votos.
- Foto enviada: `alt` "[Foto que compartiste]"; colores #F6DC6A / #C46A2B / #EE93BC. Valores por defecto de cualquier foto: "[Foto]", #F6DC6A / #5A2340 / #EE93BC.
- Paleta de parches nuevos: #F3B27E, #EE93BC, #8FD3D0, #B9E07A, #F6DC6A, #A3A8F0 (índice `seq % 6`).
- Palabras que se saltan para las iniciales de un parche nuevo: de, del, la, el, los, las, y, en.
- Opciones del selector de ciudad del encabezado: las 12 listadas en la sección 1.
- Opciones del selector "Evento del plan": las 5 listadas en la sección 17.


---
Ver también: [5. Responsive](../05-responsive.md) · [6. Estados interactivos](../06-estados-interactivos.md) · [8. Detalles finos](../08-detalles-finos.md)
