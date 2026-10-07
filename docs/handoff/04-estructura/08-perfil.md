[← Índice del handoff](../README.md)

## 4.10 Perfil (`Perfil.dc.html`)

**Ruta propuesta:** `/perfil/:usuario` para el perfil de otra persona (p. ej. `/perfil/camivargas`) y `/yo` para el perfil propio, variante "Mi perfil" (H46). La pestaña activa no cambia la URL en el prototipo. En producción conviene reflejarla (p. ej. `/perfil/camivargas?pestana=recuerdos`) para que el enlace "Recuerdos" del menú de Inicio abra directo esa pestaña. Esto último es una recomendación, no está en el prototipo. · **Quién la ve:** usuario con sesión. Si el perfil se ve sin sesión está por decidir, y H30 pide que los planes y el barrio no sean públicos por defecto. · **Propósito:** mostrar quién es una persona en Fulleventos: portada, avatar, nombre, @usuario y barrio, una biografía corta, 5 estadísticas y sus gustos. Desde ahí se la puede seguir o escribirle. Tres pestañas cierran el ciclo "descubrir → decidir con amigos → ir → recordar" (decisión 2.3): **Próximos planes** (a qué va), **Recuerdos** (a qué fue) y **Reseñas** (qué opinó).

> **Ficha técnica del archivo**
> - `<html lang="es">`, `<title>Fulleventos · Perfil</title>`. En el lienzo, el tablero se llama "8 · Perfil de usuario" y la vista previa es de 1280 × 1040 (`data-props='{"$preview":{"width":1280,"height":1040}}'`; en `canvas.json`: `"w": 1280, "h": 1040`). A 1280 px el **contenido** mide 1005 px de alto (la captura `Perfil-1280.jpg` es de 1280 × 1005); en el tablero de 1040 px la página llega a 1040 solo porque el contenedor raíz tiene `min-height: 100vh`.
> - Fuentes (Google Fonts, `display=swap`): **Archivo** 800 y 900, y **DM Sans** con eje óptico `opsz 9..40` en 400, 500 y 700. La pantalla solo usa Archivo 900, no usa el 800.
> - Reglas globales del `<helmet>`. Son las únicas de hoja de estilo; todo lo demás va inline:
>   - `body{margin:0;background:#FBF7F3}`
>   - `a{color:#17120F;text-decoration:none}a:hover{color:#C23A24}`
>   - `button{font-family:inherit;cursor:pointer}`. Solo hereda la familia: `font-size`, `color` y `line-height` del botón vienen inline o del navegador.
> - El archivo **no tiene** `@media`, `@container`, `:focus-visible`, `transition`, `animation`, `prefers-reduced-motion` ni `<meta name="viewport">` (H35). Todo el responsive sale de `flex-wrap`, de bases `flex` y de dos rejillas `auto-fill`.
> - Estado (`this.state`): `{ tab: 'planes', follow: false }`. No hay más estado ni almacenamiento: al recargar o volver a la pantalla se reinicia.
> - En Chromium no hubo errores ni advertencias de consola en ningún estado.
> - Alto total del contenido medido (con una ventana más baja que el contenido; si la ventana es más alta, `min-height: 100vh` estira la página hasta el alto de la ventana):
>
>   | Pestaña | 390 px | 768 px | 1280 px |
>   |---|---|---|---|
>   | "Próximos planes" | 2939 px | 1391 px | 1005 px |
>   | "Recuerdos" | 3934 px | 1483 px | 1184 px |
>   | "Reseñas" | 1410 px | 1015 px | 950 px |
>
> - Elementos enfocables: 14 en "Próximos planes" (4 del encabezado, "Seguir", "Mensaje", 3 pestañas y 5 títulos de evento), 17 en "Recuerdos" y 11 en "Reseñas".
> - Referencias de línea: encabezado `:21-34`, `main` `:36`, tarjeta de perfil `:38-68`, pestañas `:70-74`, panel "Próximos planes" `:76-95`, panel "Recuerdos" `:97-105`, panel "Reseñas" `:107-120` y lógica `:124-185`.

### Navegación de entrada y salida

**Entradas** (de dónde llega el usuario al Perfil; todas apuntan a `Perfil.dc.html`, que siempre muestra a Camila):

| Elemento | Destino | Notas |
|---|---|---|
| Avatar "CV" del encabezado (`aria-label="Tu perfil"`) en Main `:67`, Agenda `:62`, Mapa `:68`, Evento `:49` y Chat `:72` | `/yo` (Mi perfil) | Círculo de 40 px #8FD3D0. H59 pide que su nombre accesible empiece por el texto visible: "CV, tu perfil". |
| Tarjeta de cuenta de Inicio (avatar 48 px + "Camila Vargas" + "@camivargas", `Main.dc.html:76`) | `/yo` | |
| Menú lateral de Inicio, "Guardados" (`Main.dc.html:98`) | Hoy abre Perfil en "Próximos planes" | En el Perfil no existe "Guardados". Debe abrir la vista "Guardados" de "Mi perfil" (H46). |
| Menú lateral de Inicio, "Recuerdos" (`Main.dc.html:100`) | Hoy abre Perfil en "Próximos planes" | Debe abrir `/yo` con la pestaña "Recuerdos" seleccionada. |
| Avatar y nombre del autor de cada publicación del feed (`Main.dc.html:185`, `:187`; avatar con `aria-label="Perfil de {nombre}"`) | `/perfil/:usuario` | Todos abren el perfil de Camila (H46). |
| "Gente con tus gustos": avatar y nombre (`Main.dc.html:293-294`) | `/perfil/:usuario` | Ídem. |
| Avatar de cada mensaje del Chat (`Chat.dc.html:241`, `aria-label="Perfil de {nombre}"`) | `/perfil/:usuario` | Ídem. |
| "Ver perfil" / "Ver perfil del organizador" del panel de información del Chat (`Chat.dc.html:369`, texto en `:831`) | `/perfil/:usuario`; el del organizador va al perfil de organizador | Hoy abre a Camila. El perfil de organizador no está diseñado (H14, H48). |
| Avatares del muro del Evento (`Evento.dc.html:339`, `aria-label="Perfil de {nombre}"`) | `/perfil/:usuario` | Ídem. |
| "Ver las 128 fotos" (`Evento.dc.html:504`) | Hoy abre Perfil | Es un error de destino: debe abrir la galería del evento (por diseñar). |
| "Ver mis boletas" (paso 4 de la compra, `Evento.dc.html:841-842`) | Hoy abre Perfil, donde no hay boletas | H20: debe ir a la pantalla "Mis boletas" (`/mis-boletas`, por diseñar). |

**Salidas** (lo que hay dentro de esta pantalla):

| Elemento | Destino | Notas |
|---|---|---|
| "Volver al feed" (encabezado) | `Main.dc.html` → `/inicio` | Siempre va a Inicio. H41 pide que "Volver" regrese a la pantalla de origen: historial del navegador, con `/inicio` como respaldo si no hay historial. |
| Logo "fulleventos" | `Main.dc.html` → `/inicio` | |
| "Mapa" (píldora del encabezado) | `Mapa.dc.html` → `/mapa` | Abre en "Toda Colombia". |
| Ícono de mensajes (`aria-label="Mensajes, 3 sin leer"`) | `Chat.dc.html` → `/mensajes` | Desde 900 px abre con la conversación "Salseros de jueves" a la vista, que es el estado inicial del Chat (`openId: 'salseros'`). Por debajo de 900 px abre la **lista** de conversaciones, porque el estado inicial es `pane: 'list'` y `@media (max-width: 899px)` oculta la conversación con `[data-pane="list"] [data-ch~="conv"]{display:none}`. |
| "Seguir" / "Siguiendo" | Ninguno | Alterna el estado (ver "Estados e interacciones"). |
| "Mensaje" | `Chat.dc.html` → hoy `/mensajes` en "Salseros de jueves" (o en la lista, por debajo de 900 px) | Debe abrir la conversación directa con esa persona, creándola si no existe: `/mensajes/:conversacion`. Es el mismo problema que H42 describe para "Escribir al organizador". En "Mi perfil" no debe existir (H46). |
| Pestañas "Próximos planes", "Recuerdos" y "Reseñas" | Estado interno (`tab`) | No navegan ni cambian la URL. |
| Título de cada tarjeta de "Próximos planes" (5 enlaces) | `Evento.dc.html` → `/evento/:ciudad/:slug` de ese evento | En el prototipo los 5 abren la misma página, "Noche de salsa y boleros en vivo" (H36). Ni la foto ni la tarjeta completa son enlace: solo el título. |
| Cada mosaico de "Recuerdos" (8 enlaces) | `Evento.dc.html` → página del evento pasado | Todo el mosaico es el enlace. Los 8 abren la misma página (H36). |
| Título de cada reseña (2 enlaces) | `Evento.dc.html` → página del evento reseñado | Ídem. |

### Estructura sección por sección

**Contenedor raíz:** `div` con `min-height: 100vh; background: #FBF7F3; color: #17120F; font-family: 'DM Sans', system-ui, sans-serif; font-size: 15px; line-height: 1.5`. Las medidas en `rem` se calculan sobre la raíz del documento (16 px), **no** sobre estos 15 px: `.92rem` = 14,72 px, por ejemplo. El texto que no define tamaño (biografía, @usuario, textos de reseña) se ve a 15 px con `line-height` 22,5 px.

**`<main>`:** `max-width: 1240px; margin: 0 auto; padding: 24px 24px 64px; display: flex; flex-direction: column; gap: 24px`. El `max-width` se aplica a la caja de contenido (`content-box`), así que el ancho total llega a 1288 px. El ancho útil es `min(ancho de ventana − 48, 1240)`: 342 px a 390, 720 px a 768, 1232 px a 1280 y 1240 px desde 1288. A 1440 px el contenido empieza en x = 100. El margen lateral es 24 px en todos los anchos; otras pantallas usan `clamp(16px, 4vw, 24px)` (H41).

**Qué se reutiliza del código base y qué hay que crear** (`diseno/referencia/preview-demo.html`):

| Pieza del Perfil | Del código base | Qué hacer |
|---|---|---|
| Tokens de color | `:root`: `--bg #FBF7F3`, `--surface #FFFFFF`, `--ink #17120F`, `--muted #6E6259`, `--line #EAE1D8`, `--brand #D9452F`, `--yellow #F6DC6A`, `--peach #F3B27E`, `--pink #EE93BC`. Colores de avatar `.c1 #F3B27E`, `.c2 #A3A8F0`, `.c3 #EE93BC`, `.c4 #B9E07A`, `.c5 #F6DC6A`, `.c6 #8FD3D0`. | **Reutilizar.** **Crear** los tokens que no existen allí: `#C23A24` (rojo de acción: hover de enlaces, subrayado de pestaña, categoría, insignia; ojo: el código base tiene `--brand-hover: #BF3923`, que es **otro** color, y su `.cat` usa `--brand` #D9452F, no #C23A24), `#2A1A16` (base de la portada; el código base lo usa en `.feature .img`), `#8A5A00` (calificación), `#E2D8D0` (texto secundario sobre la franja oscura), `rgba(20,14,16,.72)` (franja de los recuerdos) y los dos colores de la portada `rgba(238,147,188,.7)` y `rgba(246,220,106,.6)`. |
| Contenedor | `.wrap` (`max-width: 1240px; margin: 0 auto; padding-inline: 24px`) | **Reutilizar** para el encabezado y el `main`. Unificar el margen lateral con el resto del producto (H41). |
| Logo | `.logo` (DM Sans 700, `1.6rem`, `-0.03em`, `--brand`) | **Reutilizar**, pero aquí mide `1.55rem`, como en Agenda, Chat, Evento, Main y Mapa. Usar 1.55rem en la app con sesión. |
| Encabezado | `.top` (sticky, 76 px) | **No** se reutiliza tal cual. Hay que usar el componente único "encabezado de la app con sesión, variante detalle" que pide H41 (ver sección 1). |
| Tarjeta de plan | `.card` + `.img` + `.date` + `.cat` + `h3` + `.where` | **Reutilizar como variante "perfil"** del componente único "tarjeta de evento". Sin `.save`, `.going` ni `.buy`; en lugar de `.save` lleva la etiqueta de estado. El prototipo perdió el `h3`, el `text-wrap: balance` y el hover `translateY(-3px)` con sombra (ver sección 8). |
| Botón "Seguir" | Patrón `.join[aria-pressed]` | **Crear** un componente "BotónSeguir" compartido. Lo usan Perfil (44 px, `0 22px`, `.92rem`), Inicio "Gente con tus gustos" (36 px, `0 14px`, `.8rem`), Evento "Organiza" (38 px, `0 14px`, `.82rem`) y Registro paso 3 (40 px, `0 16px`, `.84rem`). Los colores son iguales en las 4 pantallas. Ojo: la lógica de color es la **inversa** de `.join` del código base. En `.join`, apagado es transparente con borde #EAE1D8 y pulsado es oscuro; en "Seguir", apagado es oscuro (#17120F, texto blanco) y pulsado ("Siguiendo") es blanco con borde #17120F. Además, `.join` tiene hover oscuro y "Seguir" no tiene hover. |
| Gustos | `.chip` (borde, fondo blanco, `9px 16px`, `.9rem`) | **No** es el mismo componente: los chips del código base son filtros que se pueden pulsar, y los gustos del perfil son etiquetas estáticas de color. **Crear** "EtiquetaGusto". |
| Pestañas | — | **Crear** un componente "Pestañas" compartido con Evento ("Parches / Muro", `Evento.dc.html:304-308`), que tiene exactamente el mismo estilo. |
| Foco | `:focus-visible { outline: 3px solid var(--brand); outline-offset: 2px; }` | **Recuperar**: esta pantalla lo perdió (H51). Usar `#C23A24`, como Evento, Chat y Mapa. |
| Portada, avatar XL, estadísticas, mosaico de recuerdos, tarjeta de reseña, insignia de no leídos | — | **Crear.** La insignia de no leídos y la píldora "Mapa" también existen en otras pantallas: hacer un solo componente. |

#### 1. Encabezado

- **Layout:**
  - `<header>` a todo el ancho: `background: #FBF7F3; border-bottom: 1px solid #EAE1D8`. **No es sticky ni fixed**, a diferencia de Evento, Main, Agenda y Mapa. No tiene sombra ni `z-index`.
  - Contenedor interno: `max-width: 1240px; margin: 0 auto; padding: 12px 24px; display: flex; flex-wrap: wrap; align-items: center; gap: 12px 20px`.
  - Alto medido: **69 px** desde 485 px de ancho (12 + 44 + 12 + 1 de borde); **125 px** entre 317 y 484 px (2 filas); **174 px** por debajo de 317 px (3 filas).
- **Contenido en orden:**
  1. **"Volver al feed"** (`<a href="Main.dc.html">`): `display: flex; align-items: center; gap: 8px; height: 44px`, DM Sans 700, `.92rem` (14,72 px), `line-height` 22,08 px, color #17120F. Mide 123,3 × 44 px.
     - Ícono a la izquierda: chevrón hacia la izquierda (`<path d="M15 18l-6-6 6-6">`), 18 × 18, `viewBox 0 0 24 24`, `fill="none" stroke="currentColor" stroke-width="2"`, terminaciones y uniones redondeadas, `aria-hidden="true"`.
  2. **Logo "fulleventos"** (`<a href="Main.dc.html">`): DM Sans 700, `1.55rem` (24,8 px), `letter-spacing: -0.03em` (−0,744 px), `line-height` 37,2 px, color **#D9452F**, `margin-inline: auto`, que lo centra en el espacio libre de su fila. Mide 124,9 × 37,2 px. Va en minúsculas, tal cual.
  3. **Grupo de acciones** (`<div>`, no `<nav>`): `display: flex; align-items: center; gap: 8px`.
     - **"Mapa"** (`<a href="Mapa.dc.html">`):
       - Caja: `height: 44px; box-sizing: border-box; border-radius: 999px; padding: 0 16px; border: 1px solid #EAE1D8; background: #FFFFFF; display: inline-flex; align-items: center; gap: 6px`.
       - Texto: DM Sans 700, `.88rem` (14,08 px), #17120F. Mide 96,2 × 44 px.
       - Ícono: mapa plegado (`<path d="M9 4 3 6.5V20l6-2.5 6 2.5 6-2.5V4l-6 2.5z">` + `<path d="M9 4v13.5M15 6.5V20">`), 18 × 18, trazo 2, redondeado.
     - **Mensajes** (`<a href="Chat.dc.html" aria-label="Mensajes, 3 sin leer">`):
       - Caja: `position: relative; width: 44px; height: 44px; box-sizing: border-box; border-radius: 50%; border: 1px solid #EAE1D8; background: #FFFFFF; display: grid; place-items: center`.
       - Ícono: globo de diálogo (`<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z">`), **20 × 20**, trazo 2.
       - **Insignia "3"** (`<span aria-hidden="true">`): `position: absolute; top: -3px; right: -3px; min-width: 18px; height: 18px; box-sizing: border-box; border-radius: 9px; background: #C23A24; color: #FFFFFF; font-size: .66rem` (10,56 px); 700; `line-height: 1; display: grid; place-items: center; padding: 0 4px`. Sobresale 3 px por arriba y por la derecha del círculo.
- **Datos dinámicos:** ninguno. El "3" de la insignia y del `aria-label` es texto fijo. En producción es el conteo de conversaciones con mensajes sin leer, y la insignia se oculta cuando es 0. Con 10 o más crece en ancho gracias a `min-width` + `padding`. Hace falta definir el tope (p. ej. "9+"), que no está en el prototipo.
- **Componente:** es la quinta variante de encabezado del producto (H41). Comparado con el de Evento (`Evento.dc.html:26-52`), que es la otra variante "detalle":
  - aquí no es sticky;
  - el padding es fijo de 24 px en lugar de `clamp(16px, 4vw, 24px)`;
  - las acciones van en un `div` y no en un `<nav aria-label="Principal">`;
  - solo hay "Mapa" (píldora con texto) y Mensajes (círculo con borde), sin Inicio, Agenda, Notificaciones ni avatar;
  - la insignia va en `top/right: -3px`, en lugar de `6px`.

  En producción se usa el encabezado único con sesión de H41 (variante detalle) y, en celular, la barra inferior con "Inicio, Agenda, Mapa, Mensajes y Perfil" de H40, con "Perfil" marcado como actual.

#### 2. Tarjeta de perfil (`<section aria-label="Perfil">`, contenedor)

- **Layout:** `background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 28px; overflow: hidden`. Sin sombra. Dentro, en flujo normal (bloque), van 4 hijos: la portada (sección 3), la fila de identidad (4), la fila de biografía y estadísticas (5) y la fila de gustos (6). Cada fila de texto tiene `padding: 0 32px 28px`: no tiene padding arriba, así que la separación entre filas son los 28 px de abajo de la anterior. Medidas:

  | Ancho de ventana | Tarjeta (ancho × alto) |
  |---|---|
  | 1280 | 1232 × 445,4 |
  | 1024 | 976 × 445,4 |
  | 768 | 720 × 510,4 |
  | 390 | 342 × 804,6 |
  | 320 | 272 × 992,5 |

  Con "Siguiendo" activo, entre 754 y 779 px la tarjeta crece a 570,4 px (ver sección 4).
- **Contenido en orden:** portada → identidad → biografía y estadísticas → gustos.
- **Datos dinámicos:** solo "Seguidores" y el botón "Seguir" (ver sección 4 y 5).
- **Componente:** nuevo ("TarjetaPerfil"). Usa el mismo radio de 28 px que el `.hero` del código base.

#### 3. Portada

- **Layout:** `<div role="img" aria-label="[Foto de portada]">` con `height: 200px` a todo el ancho de la tarjeta (1230 px a 1280, 718 a 768, 340 a 390, con 1 px de borde a cada lado). Las esquinas superiores salen redondeadas (28 px) por el `overflow: hidden` de la tarjeta. Sin borde propio.
  - Fondo, en este orden de capas:
    `radial-gradient(circle at 20% 40%, rgba(238,147,188,.7) 0, transparent 30%), radial-gradient(circle at 80% 60%, rgba(246,220,106,.6) 0, transparent 28%), #2A1A16`.
  - Resultado: una mancha rosada (#EE93BC al 70 %) a la izquierda y otra amarilla (#F6DC6A al 60 %) a la derecha, sobre café muy oscuro. Como son `circle` con radio en %, a 1280 px las manchas se ven grandes y difusas, y a 390 px más pequeñas.
- **Contenido en orden:** ninguno visible. Es un marcador de la foto de portada que el usuario sube.
- **Datos dinámicos:** en producción, la imagen de portada del usuario. Si no ha subido ninguna, se muestra este degradado como portada por defecto.
- **Producción:** imagen real con `object-fit: cover`, alto fijo de 200 px (evita CLS, H57), AVIF o WebP con varios tamaños. Como el nombre ya está en el `h1`, la foto puede ser decorativa (`alt=""`). Si se describe, que no sea "[Foto de portada]" con corchetes.

#### 4. Identidad y acciones (avatar, nombre, "Seguir", "Mensaje")

- **Layout:** `div` con `padding: 0 32px 28px; display: flex; flex-wrap: wrap; align-items: flex-end; gap: 16px 24px`. Tres hijos:
  1. **Avatar**: 128 px fijos.
  2. **Bloque de nombre**: `flex: 1 1 260px; min-width: 0; padding-top: 12px`.
  3. **Grupo de botones**: `display: flex; gap: 10px`, sin `flex-wrap` propio, de 203,8 px con "Seguir" y 229,7 px con "Siguiendo".

  Con `align-items: flex-end`, cuando los tres caben en una línea sus bordes inferiores quedan alineados: el borde inferior de los botones coincide con el del @usuario.
- **Contenido en orden:**
  1. **Avatar "CV"** (`<span>`):
     - Caja: `width: 128px; height: 128px; margin-top: -64px; border-radius: 50%; border: 5px solid #FFFFFF; background: #8FD3D0; display: grid; place-items: center; box-sizing: border-box`.
     - Texto "CV": Archivo 900, `2.4rem` (38,4 px), #17120F (heredado).
     - El `margin-top: -64px` hace que la mitad superior del avatar se monte sobre la portada. El borde blanco de 5 px lo separa de la foto.
  2. **Nombre `<h1>` "Camila Vargas"**: `margin: 0`; Archivo 900; `font-size: 2rem` (32 px); `letter-spacing: -0.03em` (−0,96 px); `line-height: 1.05` (33,6 px); color #17120F. Es el **único** encabezado de la página.
  3. **Línea "@camivargas · Chapinero, Bogotá"** (`<p>`): `margin: 2px 0 0`; DM Sans 400, 15 px, `line-height` 22,5 px, color #6E6259. El separador es " · ": espacio, punto medio U+00B7 y espacio.
  4. **Botón "Seguir"** (`<button aria-pressed="false">`, sin `type`):
     - Caja: `height: 44px; border-radius: 999px; padding: 0 22px; border: 1px solid #17120F`.
     - Texto: DM Sans 700, `.92rem` (14,72 px), `line-height` normal.
     - Apagado: fondo #17120F, texto #FFFFFF, "Seguir", 91,4 × 44 px.
     - Activo: fondo #FFFFFF, texto #17120F, "Siguiendo", 117,3 × 44 px.
  5. **"Mensaje"** (`<a href="Chat.dc.html">`, con aspecto de botón secundario):
     - Caja: `height: 44px; box-sizing: border-box; border-radius: 999px; padding: 0 20px; border: 1px solid #EAE1D8; background: #FFFFFF; display: inline-flex; align-items: center`.
     - Texto: DM Sans 700, `.92rem`, #17120F. Mide 102,3 × 44 px. Sin ícono.
- **Datos dinámicos:**
  - `followLabel = follow ? 'Siguiendo' : 'Seguir'`
  - `followBg = follow ? '#FFFFFF' : '#17120F'`
  - `followFg = follow ? '#17120F' : '#FFFFFF'`
  - `followPressed = follow ? 'true' : 'false'`
  - `toggleFollow = () => setState({ follow: !follow })`

  El nombre, el @usuario, el barrio y la ciudad son texto fijo. En producción vienen del usuario. Mejor como campos separados: `nombre`, `usuario`, `barrio` (opcional) y `ciudad`. La línea se arma como `"@" + usuario + " · " + [barrio + ", "] + ciudad`. El barrio solo se muestra a quien el usuario autorice (H30). Las iniciales del avatar salen de nombre y apellido ("CV"), y el color del avatar es fijo por usuario (#8FD3D0 es el de Camila en todo el producto).
- **Componente:** "AvatarXL" (nuevo, misma familia que `.av` del código base pero de 128 px y con Archivo 900), "BotónSeguir" (nuevo y compartido) y "BotónSecundario píldora" (borde #EAE1D8 y fondo blanco, igual que "Mapa" del encabezado).

#### 5. Biografía y estadísticas

- **Layout:** `div` con `padding: 0 32px 28px; display: flex; flex-wrap: wrap; gap: 20px 40px; align-items: flex-start`. Dos hijos:
  - la biografía (`flex: 1 1 320px; max-width: 56ch`);
  - la lista de estadísticas `<dl>` (`margin: 0; display: flex; flex-wrap: wrap; gap: 12px 28px`), que mide 380,2 px de ancho en una sola línea.

  `56ch` a 15 px de DM Sans equivale a **575,4 px**. Desde 855 px de ventana la lista se pone **a la derecha** de la biografía, pegada a ella con 40 px de separación. No se alinea a la derecha de la tarjeta: a 1280 px empieza en x = 672 y termina en x = 1052, y deja 171 px libres a su derecha.
- **Contenido en orden:**
  1. **Biografía** (`<p style="margin: 0">`), DM Sans 400, 15 px, `line-height` 22,5 px, #17120F:
     "Salsera de jueves, rockera de sábado. Si hay concierto gratis en un parque, ahí estoy. Siempre busco gente para armar parche."
     Ocupa 2 líneas a 768 y 1280 px y 4 líneas a 390 px.
  2. **Estadísticas.** Cada una es un `<div>` con `<dt>` (etiqueta) y `<dd>` (número). Van en este orden exacto:

     | `<dt>` (DM Sans 400, `.78rem` = 12,48 px, `line-height` 18,72 px, #6E6259) | `<dd>` (Archivo 900, `1.6rem` = 25,6 px, `line-height` 38,4 px, #17120F, `margin: 0`) |
     |---|---|
     | "Eventos" | "38" |
     | "Ciudades" | "5" |
     | "Seguidores" | "412" (o "413" si se pulsó "Seguir") |
     | "Siguiendo" | "289" |
     | "Parches" | "7" |

     Cada bloque mide 57,1 px de alto. Anchos a 1280 px: 46,1 / 54,8 / 64,5 / 56,9 / 45,9 px.
- **Datos dinámicos:**
  - `followers = 412 + (follow ? 1 : 0)`. Es el único número calculado.
  - La estadística "Ciudades" se agregó con la decisión 2.8 (alcance nacional, "Toda Colombia"), que la nombra entre los cambios: "estadística 'Ciudades' en el Perfil".
  - Los demás son fijos. En producción hay que definir qué cuenta cada uno; el prototipo no lo dice y queda **por decidir con producto**. Propuesta: "Eventos" = eventos a los que fue o va; "Ciudades" = ciudades distintas de esos eventos; "Seguidores" y "Siguiendo" = relaciones de seguimiento; "Parches" = parches de los que es miembro.
  - Formato con miles en `es-CO` (`1.250`), igual que el resto del producto. Usar `font-variant-numeric: tabular-nums` (lo usa el código base en `.price`) para que "412" → "413" no mueva nada.
- **Componente:** nuevo, "Estadísticas de perfil" (`<dl>`). En Inicio, la tarjeta de cuenta muestra 3 de estas cifras con otro estilo y otro orden (número arriba, etiqueta abajo): "38 / Planes", "412 / Seguidores" y "289 / Siguiendo", en una rejilla `repeat(3, minmax(0, 1fr))` centrada, con el número en `<b>` DM Sans 700 de 1.05rem y la etiqueta de .74rem #6E6259 (`Main.dc.html:80-83`). No usa `<dl>`. Ver la inconsistencia "Planes" frente a "Eventos" en H37.

#### 6. Gustos

- **Layout:** `div` con `padding: 0 32px 28px; display: flex; flex-wrap: wrap; gap: 8px`.
- **Contenido en orden:** 5 `<span>` estáticos, que **no son botones ni enlaces**. Estilo común: `border-radius: 999px; padding: 6px 14px; font-size: .84rem` (13,44 px); 500; `line-height` 20,16 px; texto #17120F (heredado). Cada uno mide 32,2 px de alto.

  | Texto | Fondo | Ancho a 1280 | Contraste del texto |
  |---|---|---|---|
  | "Salsa" | #F3B27E (durazno, `.c1`) | 61 px | 10,16:1 |
  | "Rock" | #A3A8F0 (lavanda, `.c2`) | 58,7 px | 8,33:1 |
  | "Planes gratis" | #B9E07A (verde lima, `.c4`) | 108,5 px | 12,4:1 |
  | "Stand-up" | #EE93BC (rosado, `.c3`) | 89,1 px | 8,44:1 |
  | "Fútbol" | #F6DC6A (amarillo, `.c5`) | 68,4 px | 13,6:1 |

- **Datos dinámicos:** fijos en el prototipo. En producción son los gustos que el usuario eligió en el paso 2 del Registro. Los 5 están entre los 12 de `Registro.dc.html:141`: "Salsa", "Rock", "Electrónica", "Reguetón", "Jazz", "Conciertos", "Fútbol", "Stand-up", "Teatro", "Comida", "Planes gratis" y "Festivales". El color se asigna por posición, en el ciclo #F3B27E → #A3A8F0 → #B9E07A → #EE93BC → #F6DC6A, que es el orden del prototipo y se repite desde el sexto. Es una regla deducida del orden, no está escrita en el código. Hay que decidir si se muestran todos los gustos o un máximo; Registro exige mínimo 3 y no tiene máximo.
- **Componente:** nuevo, "EtiquetaGusto" (estática). No confundir con el chip de filtro del código base ni con el chip de Registro (que se puede pulsar: blanco con borde #D9CEC3, o #17120F cuando está elegido).

#### 7. Pestañas

- **Layout:** `<div role="tablist" aria-label="Contenido del perfil">` con `display: flex; gap: 4px; overflow-x: auto; box-shadow: inset 0 -1px 0 #EAE1D8`.
  - La línea base gris de 1 px se dibuja con una sombra interior, no con un borde. Por eso el subrayado de 3 px de la pestaña activa se pinta encima de ella.
  - Alto: 48 px. No es sticky. Entre la tarjeta de perfil y las pestañas hay 24 px (`gap` del `main`), y otros 24 px hasta el panel.
- **Contenido en orden:** 3 `<button role="tab">` (sin `type`), cada uno con `aria-selected`.
  - Estilo: `flex-shrink: 0; white-space: nowrap; height: 48px; border: 0; background: transparent; padding: 0 16px; font-size: .95rem` (15,2 px); 700; `line-height` normal. Color de texto y `border-bottom: 3px solid` según el estado:
    - **Seleccionada:** texto #17120F, subrayado #C23A24, `aria-selected="true"`.
    - **No seleccionada:** texto #6E6259, subrayado `transparent`, `aria-selected="false"`.
  - Textos y anchos: "Próximos planes" (153,7 px), "Recuerdos" (111,3 px) y "Reseñas" (93,8 px). En total, 366,8 px con los dos huecos de 4 px.
- **Datos dinámicos:**

  ```js
  tabs = [{id:'planes',label:'Próximos planes'},{id:'recuerdos',label:'Recuerdos'},{id:'resenas',label:'Reseñas'}]
    .map(t => ({ ...t,
      selected: tab === t.id ? 'true' : 'false',
      fg:   tab === t.id ? '#17120F' : '#6E6259',
      line: tab === t.id ? '#C23A24' : 'transparent',
      pick: () => setState({ tab: t.id }) }))
  ```

  La pestaña inicial es `'planes'`. `showPlanes`, `showRecuerdos` y `showResenas` montan un solo panel a la vez: los otros dos se quitan del DOM.
- **Componente:** nuevo, "Pestañas", compartido con Evento (`Evento.dc.html:304-308`, mismo estilo, 2 pestañas "Parches (3)" y "Muro (24)"). Ver en "Correcciones obligatorias" lo que le falta para ser un patrón de pestañas ARIA completo.

#### 8. Panel "Próximos planes" (pestaña inicial)

- **Layout de la rejilla:** `<div>` (sin rol) con `display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 20px`. Columnas según el ancho de ventana:

  | Ventana | Columnas | Con 5 tarjetas |
  |---|---|---|
  | menos de 488 px | 1 | 5 apiladas |
  | 488 a 717 px | 2 | 2 + 2 + 1 |
  | 718 a 947 px | 3 | 3 + 2 (H61) |
  | 948 a 1177 px | 4 | 4 + 1 |
  | 1178 px o más | 5 | una sola fila |

  6 columnas nunca caben: harían falta 1360 px de contenido. Las filas se estiran a la tarjeta más alta de la fila.
- **Tarjeta** (`<article>`): `background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 18px; overflow: hidden; display: flex; flex-direction: column`. Sin sombra y sin hover. Medidas: 230,4 × 306,8 px a 1280; 226,7 × 304 a 768; 342 × 349,2 a 390 (tarjeta de 1 línea de título).
  1. **Foto** (`<div role="img" aria-label="[Foto del evento]">`): `position: relative; aspect-ratio: 4 / 3`.
     - Fondo: `radial-gradient(circle at 70% 30%, {bg1} 0, transparent 55%), {bg2}`, con los colores de cada evento (ver "Datos de ejemplo").
     - Alto: 171,3 px a 1280, 168,5 a 768 y 255 a 390.
     - **Fecha** (esquina superior izquierda): `<span>` con `position: absolute; top: 12px; left: 12px; background: #FFFFFF; border-radius: 10px; padding: 5px 9px 4px; text-align: center; line-height: 1; min-width: 44px`. Mide 62 × 43,2 px.
       - Día `<b>` `{{e.d}}`: `display: block`; Archivo 900; `1.2rem` (19,2 px); #17120F.
       - Mes `<span>` "oct", que se ve "OCT": `font-size: .64rem` (10,24 px); 700; `text-transform: uppercase; letter-spacing: .06em` (0,61 px); #6E6259.
     - **Estado** (esquina superior derecha): `<span>` con `position: absolute; top: 12px; right: 12px; background: #17120F; color: #FFFFFF; border-radius: 999px; padding: 4px 10px; font-size: .74rem` (11,84 px); 700; `line-height` 17,76 px. Texto `{{e.status}}`: "Va", "Le interesa" o "En parche". "Va" mide 34,6 × 25,8 px.
  2. **Cuerpo** (`<div>`): `padding: 14px 16px 16px; display: flex; flex-direction: column; gap: 2px`. No tiene `flex: 1`; el fondo blanco del `article` cubre el sobrante.
     - **Categoría** (`<span>`): `font-size: .7rem` (11,2 px); 700; `letter-spacing: .1em` (1,12 px); `text-transform: uppercase`; color #C23A24 (contraste 5,35:1). Texto `{{e.cat}}`: "Rumba" se ve "RUMBA".
     - **Título** (`<a href="Evento.dc.html">`, no es encabezado): DM Sans 700, `1.05rem` (16,8 px), `line-height: 1.25` (21 px), #17120F. Hace salto de línea normal, sin truncar. A 1280 px, 4 de los 5 títulos ocupan 2 líneas ("Santa Fe vs. Millonarios" ocupa 1). A 390 px todos ocupan 1 línea; a 320 px el primero ocupa 2.
     - **Lugar** (`<span>`): `.85rem` (13,6 px), `line-height` 20,4 px, #6E6259. Texto `{{e.place}}`, p. ej. "Galería Café Libro · Zona T · Bogotá". A 1280 px ocupa 2 líneas, sin truncar.
- **Datos dinámicos:**
  - `place = e.v + ' · ' + cityNames[e.city]`, con `cityNames = { bogota: 'Bogotá', medellin: 'Medellín', barranquilla: 'Barranquilla' }`.
  - Orden cronológico ascendente (9 → 12 de octubre).
  - El día sale de `e.d`. El mes "oct" está **escrito fijo en la plantilla**, no viene de los datos.
  - En producción, la fecha sale de la fecha del evento con zona America/Bogota y el mes se escribe en minúscula ("oct") para que el CSS lo pase a mayúsculas.
  - Comentario del código: "Próximos planes: mismos eventos de la agenda nacional compartida (fin de semana del 9 al 12 de octubre)".
- **Estados que no existen en el prototipo:**
  - **Vacío.** Hay que diseñarlo: el código base tiene el patrón `.empty` (centrado, #6E6259, `padding: 40px 0`). Textos propuestos, por validar: "Camila todavía no tiene planes a la vista" en un perfil ajeno, y "Aún no tienes planes. Explora la agenda" con enlace a `/agenda` en Mi perfil.
  - **Carga y error** (H17: esqueletos y "Reintentar").
  - **Planes ocultos por privacidad** (H30).
- **Componente:** tarjeta de evento, variante "perfil".

#### 9. Panel "Recuerdos"

- **Layout de la rejilla:** `<div>` (sin rol) con `display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px`. Columnas según el ancho de ventana:

  | Ventana | Columnas | Con 8 mosaicos |
  |---|---|---|
  | menos de 460 px | 1 | 8 apilados |
  | 460 a 671 px | 2 | 2 + 2 + 2 + 2 |
  | 672 a 883 px | 3 | 3 + 3 + 2 |
  | 884 a 1095 px | 4 | 4 + 4 |
  | 1096 px o más | 5 | 5 + 3 |

  Mosaicos cuadrados: 236,8 px a 1280, 232 px a 768 y 342 × 342 px a 390.
- **Mosaico** (`<a href="Evento.dc.html" aria-label="{{r.label}}">`, todo el cuadro es el enlace):
  - Caja: `position: relative; aspect-ratio: 1; border-radius: 16px; overflow: hidden; display: flex; align-items: flex-end`.
  - Fondo: `radial-gradient(circle at 40% 35%, {bg1} 0, transparent 55%), {bg2}`. Fíjate que la mancha está en 40 % / 35 %, no en 70 % / 30 % como en las tarjetas de plan.
  - **Franja inferior** (`<span>`): `width: 100%; padding: 10px 12px; background: rgba(20,14,16,.72); color: #FFFFFF; font-size: .8rem` (12,8 px); `line-height: 1.3` (16,64 px). Mide unos 53 px de alto. Contiene:
    - `<b>{{r.t}}</b>` en 700, blanco. Ejemplo: "Techno hasta el amanecer".
    - `<span style="display: block; color: #E2D8D0">{{r.when}}</span>` en 400. Ejemplo: "Bogotá · Sep 2026".
  - Contraste: blanco sobre la franja da entre 9,03:1 (sobre el amarillo de "Feria de las Flores") y 19,2:1; #E2D8D0 da entre 6,43:1 y 13,7:1. Cumple en todos.
- **Datos dinámicos:**
  - `when = cityNames[r.city] + ' · ' + r.month`, p. ej. "Medellín · Ago 2026".
  - `label = r.t + ', ' + when`, p. ej. "Feria de las Flores, Medellín · Ago 2026".
  - Orden cronológico descendente (Sep 2026 → Feb 2026). El mes es texto fijo, abreviado con mayúscula inicial, 3 letras y sin punto ("Sep", "Ago", "Jul", "Jun", "May", "Abr", "Mar", "Feb").
- **Componente:** nuevo, "MosaicoRecuerdo". En producción la foto será la del usuario en el evento o la del evento. La franja oscura al 72 % garantiza la legibilidad sobre cualquier foto.

#### 10. Panel "Reseñas"

- **Layout:** `<div>` con `display: flex; flex-direction: column; gap: 14px; max-width: 760px`. Queda alineado a la izquierda y no se centra. Ancho de cada reseña: 760 px a 1280, 720 a 768 y 342 a 390.
- **Reseña** (`<article>`): `background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 18px; padding: 18px 20px`. Mide 118,9 px de alto a 768 y 1280, y 141,4 px a 390.
  1. **Fila superior** (`div`): `display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px; align-items: baseline`.
     - **Título** (`<a href="Evento.dc.html">`): 700, `1.05rem` (16,8 px), `line-height` 25,2 px, #17120F. Ejemplo: "Techno hasta el amanecer".
     - **Calificación** (`<span>`): `font-size: .84rem` (13,44 px); 700; color **#8A5A00** (5,93:1 sobre blanco). Texto `{{v.stars}} de 5`, p. ej. "4 de 5". Es solo texto, **sin íconos de estrella**. Por debajo de 354 px de ventana baja a una segunda línea, alineada a la izquierda.
  2. **Texto** (`<p style="margin: 6px 0 0">`): 15 px, 400, #17120F. Ejemplo: "El sonido estuvo brutal. La fila para entrar fue larga, lleguen antes de las 11."
  3. **Pie** (`<p>`): `margin: 8px 0 0; font-size: .8rem` (12,8 px); `line-height` 19,2 px; color #6E6259. Plantilla `{{v.when}} · {{v.likes}} personas lo encontraron útil`, p. ej. "Sep 2026 · 17 personas lo encontraron útil".
- **Datos dinámicos:** se pintan tal cual. No hay cálculo, singular/plural ni botón para marcar "útil".
- **Componente:** nuevo, "TarjetaReseña". Hay que unificar la calificación con la de Inicio (ver "Detalles finos").

#### 11. Pie de página

- **No existe.** La página termina con los 64 px de padding inferior del `main`. H5 pide un pie legal en **todas** las pantallas, con [RAZÓN SOCIAL], NIT, dirección, teléfono, correo, PQR, enlace a sic.gov.co, Términos y Política de tratamiento. También pide acceso a lo legal desde el perfil (ver "Correcciones obligatorias").

### Datos de ejemplo

**Persona del perfil** (fija en la plantilla; es la usuaria con sesión de todo el prototipo):

| Campo | Valor |
|---|---|
| Nombre | "Camila Vargas" |
| Usuario | "@camivargas" |
| Barrio y ciudad | "Chapinero, Bogotá" |
| Iniciales / color de avatar | "CV" / #8FD3D0 (el mismo en Main, Agenda, Mapa, Evento y Chat) |
| Biografía | "Salsera de jueves, rockera de sábado. Si hay concierto gratis en un parque, ahí estoy. Siempre busco gente para armar parche." |
| Eventos | 38 |
| Ciudades | 5 |
| Seguidores | 412 (413 con "Siguiendo") |
| Siguiendo | 289 |
| Parches | 7 |
| Gustos (orden y color) | Salsa #F3B27E · Rock #A3A8F0 · Planes gratis #B9E07A · Stand-up #EE93BC · Fútbol #F6DC6A |
| Mensajes sin leer (encabezado) | 3 |
| Portada | `radial-gradient(circle at 20% 40%, rgba(238,147,188,.7) 0, transparent 30%), radial-gradient(circle at 80% 60%, rgba(246,220,106,.6) 0, transparent 28%), #2A1A16` |

**Pestañas:**

| id | Etiqueta |
|---|---|
| `planes` | "Próximos planes" (inicial) |
| `recuerdos` | "Recuerdos" |
| `resenas` | "Reseñas" |

**Ciudades usadas** (`cityNames`): `bogota` → "Bogotá", `medellin` → "Medellín" y `barranquilla` → "Barranquilla".

**Próximos planes** (5; los ids coinciden con la agenda nacional compartida de la sección 4.2):

| id | Día (`d`) | Mes (fijo) | Título (`t`) | Categoría (`cat`) | Ciudad | Lugar (`v`) | Texto de lugar calculado (`place`) | Estado (`status`) | `bg1` | `bg2` |
|---|---|---|---|---|---|---|---|---|---|---|
| e1 | 9 | oct | Noche de salsa y boleros en vivo | Rumba | bogota | Galería Café Libro · Zona T | Galería Café Libro · Zona T · Bogotá | Va | `#E8A04F` | `#B5372B` |
| e2 | 10 | oct | Festival de jazz al parque | Conciertos | bogota | Parque El Country · Usaquén | Parque El Country · Usaquén · Bogotá | Va | `#4F6DD8` | `#1E2550` |
| e3 | 10 | oct | Rock en el Movistar Arena | Conciertos | bogota | Movistar Arena · Salitre | Movistar Arena · Salitre · Bogotá | Le interesa | `#D9452F` | `#2B0F12` |
| e4 | 11 | oct | Santa Fe vs. Millonarios | Deporte | bogota | Estadio El Campín · Teusaquillo | Estadio El Campín · Teusaquillo · Bogotá | En parche | `#C4302B` | `#1F3A8A` |
| e8 | 12 | oct | Atlético Nacional vs. Junior | Deporte | medellin | Estadio Atanasio Girardot | Estadio Atanasio Girardot · Medellín | Le interesa | `#3E9B63` | `#0F2A1C` |

Las tarjetas del perfil no muestran precio, boletera, hora ni amigos. En la agenda nacional, e1 es el viernes 9, e2 y e3 el sábado 10, e4 el domingo 11 y e8 el lunes festivo 12.

**Recuerdos** (8, del más reciente al más antiguo):

| # | Título (`t`) | Ciudad | Mes (`month`) | `when` calculado | `aria-label` calculado | `bg1` | `bg2` |
|---|---|---|---|---|---|---|---|
| 1 | Techno hasta el amanecer | bogota | Sep 2026 | Bogotá · Sep 2026 | Techno hasta el amanecer, Bogotá · Sep 2026 | `#6B3FA0` | `#0E0A1A` |
| 2 | Feria de las Flores | medellin | Ago 2026 | Medellín · Ago 2026 | Feria de las Flores, Medellín · Ago 2026 | `#F6DC6A` | `#3E9B63` |
| 3 | Rock al Parque | bogota | Jul 2026 | Bogotá · Jul 2026 | Rock al Parque, Bogotá · Jul 2026 | `#D9452F` | `#2B0F12` |
| 4 | Mercado de las Américas | bogota | Jun 2026 | Bogotá · Jun 2026 | Mercado de las Américas, Bogotá · Jun 2026 | `#F6DC6A` | `#C46A2B` |
| 5 | La casa de Bernarda Alba | bogota | May 2026 | Bogotá · May 2026 | La casa de Bernarda Alba, Bogotá · May 2026 | `#B88A5A` | `#3A2414` |
| 6 | Salsa al Parque | bogota | Abr 2026 | Bogotá · Abr 2026 | Salsa al Parque, Bogotá · Abr 2026 | `#E8A04F` | `#B5372B` |
| 7 | Stand-up en Teatro Libre | bogota | Mar 2026 | Bogotá · Mar 2026 | Stand-up en Teatro Libre, Bogotá · Mar 2026 | `#EE93BC` | `#5A2340` |
| 8 | Carnaval de Barranquilla | barranquilla | Feb 2026 | Barranquilla · Feb 2026 | Carnaval de Barranquilla, Barranquilla · Feb 2026 | `#EE93BC` | `#1E5A7A` |

**Reseñas** (2, de la más reciente a la más antigua):

| Evento (`t`) | Calificación (`stars`) | Se ve | Texto (`text`) | Fecha (`when`) | Útil (`likes`) | Pie calculado |
|---|---|---|---|---|---|---|
| Techno hasta el amanecer | 4 | "4 de 5" | "El sonido estuvo brutal. La fila para entrar fue larga, lleguen antes de las 11." | Sep 2026 | 17 | "Sep 2026 · 17 personas lo encontraron útil" |
| Rock al Parque | 5 | "5 de 5" | "Tres días que no olvido. El parche de la app nos salvó para encontrarnos." | Jul 2026 | 42 | "Jul 2026 · 42 personas lo encontraron útil" |

Las dos reseñas son de eventos que también están en "Recuerdos": cumplen la regla de H37, "reseñas solo después del evento y solo de asistentes".


---
Ver también: [5. Responsive](../05-responsive.md) · [6. Estados interactivos](../06-estados-interactivos.md) · [8. Detalles finos](../08-detalles-finos.md)
