[← Índice del handoff](../README.md)

## 4.8 Evento y compra (`Evento.dc.html`)

**Ruta propuesta:** `/evento/:slug` (ejemplo: `/evento/noche-de-salsa-y-boleros-2026-10-09`; H34 sugiere incluir la ciudad, `/bogota/eventos/noche-de-salsa-y-boleros-2026-10-09`: hay que elegir una sola forma y usarla en todo el producto). La compra es una ventana encima de la misma página y no cambia la URL en el prototipo. "Ver boleta" abre esa misma ventana en el paso 4 · **Quién la ve:** en el prototipo, el usuario con sesión (Camila Vargas, avatar "CV"). H33 exige además una versión pública para visitantes sin cuenta, con todo el contenido visible y con la cuenta pedida solo al tocar "Comprar", "Voy" o "Unirme" · **Propósito:** es la página de un evento y el lugar donde se compra. Muestra la información del plan (fecha, hora, lugar, edad, precio, programación, plano de localidades, políticas y ubicación) y la capa social (quién va, parches, muro, organizador). Desde aquí se compra sin salir de Fulleventos, en una ventana de 4 pasos (Boletas → Datos → Pago → Listo), solo para uno o "para mi parche" con pago dividido.

- En el lienzo, el tablero se llama "6 · Evento · Compra dentro de la página" (1280 × 3900, `data-props='{"$preview":{"width":1280,"height":3900}}'`). A 1280 × 900 la página real mide 3857 px de alto; a 768, 4788 px; a 390, 7316 px.
- `<title>`: "Fulleventos · Evento" (genérico; H34 pide un título propio por evento). `<html lang="es">`.
- Fuentes (Google Fonts, `display=swap`, `preconnect` solo a `fonts.googleapis.com`): **Archivo** 800 y 900; **DM Sans** con eje óptico `opsz 9..40` en pesos 400, 500 y 700. No se carga nada más.
- Estilos globales del `<helmet>` (`Evento.dc.html:13-23`; son las únicas reglas de hoja de estilo, todo lo demás es inline):
  - `body{margin:0;background:#FBF7F3}`
  - `a{color:#17120F;text-decoration:none}a:hover{color:#C23A24}`: el hover solo se ve en los enlaces **sin** `color` inline (ver "Estados e interacciones").
  - `button{font-family:inherit;cursor:pointer}`: los botones **no** heredan `font-size` ni `line-height`. Los botones que no fijan tamaño quedan en 13,33 px, el valor por defecto de Chromium (ver "Detalles finos").
  - `button:disabled{cursor:default;opacity:.45}`
  - `input,select,textarea{font-family:inherit}`: no heredan `color`. El campo del muro, que no fija color, escribe en negro #000000.
  - `button:focus-visible,a:focus-visible,input:focus-visible,select:focus-visible{outline:3px solid #C23A24;outline-offset:2px}`. Esta es la regla de foco que la auditoría pide copiar a las 8 pantallas (H51).
  - `[data-fe~="buybar"]{display:none}`
  - `@media (min-width: 980px){[data-fe~="buycard"]{position:sticky;top:88px}[data-fe~="secnav"]{position:sticky;top:69px;z-index:4}}`
  - `@media (max-width: 979px){[data-fe~="aside"]{display:none}[data-fe~="buybar"]{display:flex}[data-fe~="root"]{padding-bottom:84px}}`
- **No hay** `transition`, `animation`, `@keyframes`, `@container`, `prefers-reduced-motion`, `tabular-nums`, `tabindex` ni `<meta name="viewport">` (H35). Todos los cambios de estado son instantáneos.
- **Unidades:** el contenedor raíz fija `font-size: 15px; line-height: 1.5`, pero los `rem` se calculan sobre la raíz del documento (16 px). Por eso `.95rem` = 15,2 px y `1.5rem` = 24 px. Todas las conversiones de este documento usan 16 px por rem. El texto que no fija tamaño hereda 15 px.
- **`box-sizing`:** no hay un `* { box-sizing: border-box }` global. Casi todos los elementos con alto, borde y relleno declaran `box-sizing: border-box` inline, y los `<button>` ya son `border-box` en Chromium. **Excepción:** los avatares de "quién va" (`:138-142`) miden 40 px más 3 px de borde por lado, así que se dibujan de **46 × 46 px**. En producción hay que reproducir el tamaño dibujado.
- **Consola:** al cargar aparecen dos errores de `<path d="{{po.d}}">` y `<path d="{{m.d}}">` (íconos con plantilla sin resolver, `:356` y `:693`). Ya dibujada la página, los íconos se ven bien (H58).

### Navegación de entrada y salida

| Elemento | Destino | Notas |
|---|---|---|
| **Entrada:** "Comprar" / "Ver plan" y el título de cada tarjeta en Agenda (`Agenda.dc.html:149`, `:160`), Bienvenida (`:232`, `:238`) y Mapa (`:198`, `:202`) | `/evento/:slug` | En el prototipo, **los 19 eventos** abren este mismo archivo, también los gratis ("Ver plan") y los de otro precio (H36). En producción cada tarjeta abre su propio evento. |
| **Entrada:** historias, títulos de publicación y "Tu semana" de Inicio (`Main.dc.html:122`, `:215`, `:259-261`) | `/evento/:slug` | Mismo problema de H36. |
| **Entrada:** noticias de Bienvenida (`Bienvenida.dc.html:159`, `:170`, `:174`, `:178`) | `/evento/:slug` | Las noticias abren la salsa (H36). |
| **Entrada:** Chat: "Ver evento" (`Chat.dc.html:164`), título del plan del parche (`:191`), "Comprar mi boleta" (`:200`), "Ya tienes boleta" (`:206`), tarjeta de evento compartido (`:260`, `:266`) y panel de información (`:376`, `:417`) | `/evento/:slug` | "Ya tienes boleta" debería abrir la boleta (en producción, "Mis boletas", H20). |
| **Entrada:** próximos planes, recuerdos y reseñas del Perfil (`Perfil.dc.html:89`, `:100`, `:112`) | `/evento/:slug` | |
| "Volver al feed" (encabezado, chevron a la izquierda) | `Main.dc.html` → `/inicio` | Siempre va a Inicio, aunque el usuario venga de Agenda, Mapa, Chat o la landing (H41: debe volver a la pantalla de origen). A un visitante sin sesión lo dejaría en el feed (H33). |
| Logo "fulleventos" | `Main.dc.html` → `/inicio` | Para un visitante debería ir a `/` (H33). |
| Ícono "Inicio" | `/inicio` | |
| Ícono "Agenda de eventos" | `Agenda.dc.html` → `/agenda` | |
| Ícono "Mapa de eventos" | `Mapa.dc.html` → `/mapa` | |
| Ícono "Mensajes, 3 sin leer" | `Chat.dc.html` → `/mensajes` | El Chat abre en "Salseros de jueves". |
| Botón "Notificaciones" (campana) | Ninguno | Sin `onClick` (H38, H54). |
| Avatar "CV" (`aria-label="Tu perfil"`) | `Perfil.dc.html` → `/yo` (perfil propio, H46) | |
| "Ver localidades" (dato clave "Precio") | `#localidades` (ancla) | Salto instantáneo, sin desplazamiento suave. La sección queda a 140 px del borde superior (`scroll-margin-top: 140px`). |
| "Ver parches" (bloque "quién va") | `#parches` | |
| Atajos "Sobre el evento", "Programación", "Localidades", "Parches y muro", "Lo que debes saber", "Ubicación" | `#sobre`, `#programacion`, `#localidades`, `#parches`, `#saber`, `#ubicacion` | Cambian el `hash` de la URL. |
| "Invitar amigos" | Ninguno | Sin `onClick` (H38, H34). |
| Botón "Compartir evento" (ícono) | Ninguno | Sin `onClick` (H38, H34). En producción: hoja nativa de compartir o copiar enlace, con vista previa Open Graph. |
| "Armar parche" | Ninguno | Sin `onClick`. H38 pide conectarlo a "Nuevo parche" del Chat, con este evento ya ligado. |
| "Enviar" (muro) | Ninguno | Sin `onClick`: no publica y no borra el campo (H38). |
| Avatar de cada mensaje del muro (`aria-label="Perfil de {nombre}"`) | `Perfil.dc.html` | Todos abren el perfil de Camila (H46). Producción: `/perfil/:usuario`. |
| "Ver en el mapa" (tarjeta de ubicación) | `Mapa.dc.html` → `/mapa` | Abre el mapa en "Toda Colombia" (`city: null`), no en Bogotá ni en el lugar. Producción: `/mapa?ciudad=bogota` con el lugar resaltado (H42). |
| "Copiar dirección" | Ninguno (estado) | No copia nada al portapapeles en el prototipo. Solo cambia el texto. |
| "Escribir al organizador" | `Chat.dc.html` → `/mensajes` | Abre "Salseros de jueves", no la conversación con Galería Café Libro (H42). Producción: `/mensajes/:organizador`. |
| "Ver más planes en el mapa" (Planes parecidos) | `/mapa` | En producción debería filtrar Rumba y fuera de Bogotá (por ejemplo, `/mapa?categoria=rumba&fecha=finde`). |
| Título de cada plan parecido ("Viejoteca de salsa caleña", etc.) | `Evento.dc.html` (la misma página) | Recarga la salsa (H36). Producción: `/evento/:slug` de cada plan. |
| "Ver las 128 fotos" | `Perfil.dc.html` | No existe una galería. Producción: galería del evento o del organizador (por diseñar). |
| "Comprar boletas" / "Comprar más boletas" (tarjeta lateral) y "Comprar" (barra móvil) | Ventana de compra (estado `open`) | Misma URL. |
| "Ver boleta" (tarjeta lateral y barra móvil, solo después de comprar) | Ventana de compra en el paso 4 | Interrumpe una compra en curso (H26). |
| Ventana de compra → "Avisar a mi parche" (paso 4) | `Chat.dc.html` → `/mensajes` | Es un `<a>` con aspecto de botón rojo. |
| Ventana de compra → "Ver mis boletas" (paso 4) | `Perfil.dc.html` | El Perfil no tiene boletas (H20). Producción: `/mis-boletas` (pantalla por diseñar). |
| Ventana de compra → "Volver al evento" (paso 4), "Cerrar la compra" (X), clic en el fondo oscuro o Escape | Cierra la ventana | Escape solo funciona si el foco ya está dentro de la ventana (H7). |
| "[Términos y condiciones]" y "[Política de tratamiento de datos]" (paso 3) | Ninguno | Texto plano entre corchetes dentro de un botón. En producción deben ser enlaces por fuera de la casilla (H28, H5). |

### Estructura sección por sección

**Contenedor raíz** (`data-fe="root"`, `:25`): `position: relative; min-height: 100vh; background: #FBF7F3; color: #17120F; font-family: 'DM Sans', system-ui, sans-serif; font-size: 15px; line-height: 1.5`. Por debajo de 979 px recibe `padding-bottom: 84px` para que la barra de compra fija no tape el pie.

**Orden en el código:** encabezado → `<main>` (héroe, datos clave, fila de dos columnas [columna de contenido + `<aside>` de compra], bloque inferior [planes parecidos + recuerdos]) → `<footer>` → barra de compra móvil → ventana de compra (solo si `open`).

**`<main>`** (`:54`): `max-width: 1240px; margin: 0 auto; padding: 24px clamp(16px, 4vw, 24px) 64px; display: flex; flex-direction: column; gap: 24px`. Como `max-width` aplica en `content-box`, el ancho total máximo es 1288 px.

**Fila de dos columnas** (`:120`): `display: flex; flex-wrap: wrap; align-items: stretch; gap: 28px`.
- Columna de contenido (`:122`): `flex: 999 1 560px; min-width: 0; display: flex; flex-direction: column; gap: 36px`.
- `<aside>` de compra (`:403`): `flex: 1 1 340px; max-width: 380px; min-width: 0`. Por el `flex-grow` 999 a 1, el aside casi no crece: mide ~340 px en cualquier escritorio (a 1280 px, la columna mide 864 px y el aside 340 px, en x = 916). Por debajo de 980 px se oculta.

**Capas (`z-index`):** encabezado 5 (`sticky`); atajos de sección 4 (`sticky` desde 980 px); barra de compra móvil 15 (`fixed`); ventana de compra 30 (`fixed`); dentro de la ventana, la cabecera y el pie son `sticky` con `z-index: 2`.

**Mapa de componentes: qué se reutiliza del código base y qué se crea**

El código base del cliente es `diseno/referencia/preview-demo.html`. Sus tokens de `:root` son: `--bg #FBF7F3`, `--surface #FFFFFF`, `--ink #17120F`, `--muted #6E6259`, `--line #EAE1D8`, `--brand #D9452F`, `--brand-hover #BF3923`, `--yellow #F6DC6A`, `--peach #F3B27E`, `--pink #EE93BC`, `--hero #140E10`, `--display` (Archivo, 'Arial Black', 'Helvetica Neue', sans-serif) y `--ui` (DM Sans, system-ui, -apple-system, 'Segoe UI', sans-serif). También define `.wrap`, la regla `:focus-visible` (3 px `--brand`, separación 2 px) y las clases de color de avatar `.c1` #F3B27E, `.c2` #A3A8F0, `.c3` #EE93BC, `.c4` #B9E07A, `.c5` #F6DC6A y `.c6` #8FD3D0.

**Tokens que esta pantalla usa y que no existen en el código base** (hay que crearlos): #C23A24 (botones de acción, foco, alertas; el código base usa #D9452F, que con texto blanco da 4,34:1 y no llega a AA para texto normal, mientras #C23A24 da 5,35:1; el logo sigue en #D9452F), #D9CEC3 (borde de campo, pista apagada del interruptor, pasos pendientes, línea punteada de la boleta), #F1EAE3 (divisores finos), los tintes de localidad #E8F4D6 / #E3E5FB / #FBF1C6, el verde de éxito #F1F8E6, la pista #FCE9F2 / #F8DCEA, el mapa #EDE5DC y los colores de degradado #B5372B, #5A2340, #2A1A16, #1E1630, #8A2E1F, #6B3FA0, #0E0A1A y #4A1A3A.

| Componente | Origen | Dónde se usa | Notas |
|---|---|---|---|
| Encabezado fijo | **Reutilizar** la base `.top` (sticky, fondo `--bg`) y `.logo`; **crear** la variante "detalle" | Sección 1 | Logo a 1.55rem (24,8 px) frente a 1.6rem del código base. Sin buscador ni "Crear evento". H41 pide un único encabezado para la app con sesión, con esta variante "detalle". |
| Avatar de iniciales | **Reutilizar** `.av` y `.c1`–`.c6` | Secciones 1, 4, 9, 16 | Tamaños usados: 32, 34, 36, 40 (46 dibujado) y 44 px. |
| Grupo de avatares superpuestos | **Reutilizar** `.avs` | Sección 4 | Aquí: 40 px + borde blanco de 3 px (46 dibujado), solape −12 px. Código base: 34 px, borde 2 px `--hero`, solape −9 px. |
| Héroe con degradados | **Reutilizar** `.hero`, `.photo-note`, `.tag` y `.headline` (con sus dos `span`) | Sección 2 | Valores distintos: `min-height` 380 (no 520), relleno con `clamp`, título `clamp(2.2rem, 5vw, 4.2rem)` (no `clamp(2.3rem, 5.8vw, 4.9rem)`), segundo `span` con `margin-left: 1em` (no 1.15em), etiqueta sin `margin-left: 44px`, a .95rem (no 1.05rem), con `padding: 4px 11px` (no 5px 12px) y sin `letter-spacing: .01em`; `.photo-note` con texto `rgba(255,255,255,.8)` y borde `rgba(255,255,255,.35)` (no .75 y .3); degradados propios de 3 capas (ver sección 2; el código base usa 4 capas con otros colores). Los textos del héroe van abajo (`justify-content: flex-end`, no `center`). |
| Enlace subrayado "Ver …" | **Reutilizar** `.more` | Secciones 3, 4, 13 | Aquí, .86rem / .8rem en lugar de .9rem. El hover del código base (borde `--brand`) **no** está en el prototipo: solo cambia el color del texto. |
| Chips | **Reutilizar** `.chips` / `.chip` | Secciones 5 y 6 | Atajos: 40 px de alto, .88rem, peso 500, son enlaces sin estado. Etiquetas del evento: 34 px, .84rem, peso 400, sin interacción. El código base oculta la barra de scroll (`scrollbar-width: none`) y el prototipo no. |
| Tarjeta de evento con placa de fecha | **Reutilizar** `.card`, `.date`, `.cat`, `.where` y `.price` | Sección 13 | Imagen 16/10 (no 4/3), sin corazón, sin "van", sin botón de compra, sin hover. `.cat` en #C23A24. Placa de fecha a 10 px (no 12), `min-width: 44px` (no 46), día a 1.2rem (no 1.25rem) y mes a .64rem (no .66rem); cuerpo con `padding: 12px 14px 14px` (no 14/16/16); título .98rem (no 1.05rem); lugar .82rem (no .85rem); precio .86rem sin `tabular-nums` (no .95rem). |
| Pie de página | **Reutilizar** `footer` | Sección 14 | Mismos tamaños (.85rem, `--muted`, 28/40 px). Hay que agregar el pie legal de H5. |
| Foco visible | **Reutilizar** `:focus-visible` | Toda la pantalla | Color #C23A24 en lugar de `--brand`. |
| Botón negro tipo píldora | **Reutilizar** `.btn-dark` | "Seguir" del organizador, "Ver en el mapa" | Tamaños propios (38 y 42 px de alto). |
| Botón con `aria-pressed` que se rellena de negro | **Reutilizar** el patrón `.join[aria-pressed="true"]` | "Voy", "Agregar al calendario" | "Seguir" del organizador es el patrón **inverso**: apagado es negro (#17120F con texto blanco) y "Siguiendo" es blanco con texto #17120F. "Unirme" pasa de rojo #C23A24 a negro. |
| Botón rojo de compra | **Reutilizar** la forma de `.ticket` | Tarjeta de compra, barra móvil, ventana | Color #C23A24 y alturas de 48 a 54 px. |
| Datos clave (placa de fecha + íconos de color) | **Crear** | Sección 3 | |
| Línea de tiempo de programación | **Crear** | Sección 7 | |
| Plano de localidades | **Crear** | Sección 8 | |
| Tarjeta-opción de localidad (radio visual) | **Crear** | Secciones 8, 12, 16 | Tres variantes de tamaño. H59: debe ser un grupo de radio real. |
| Tarjeta de parche con barra de cupos | **Crear** (compartida con Inicio y Chat) | Sección 9 | |
| Pestañas | **Crear** | Sección 9 | H59: patrón ARIA completo con flechas, o dos botones normales. |
| Muro (compositor + burbuja) | **Crear** | Sección 9 | |
| Tarjeta de política con ícono | **Crear** | Sección 10 | |
| Mapa estático + tarjeta de organizador | **Crear** | Sección 11 | |
| Tarjeta de compra lateral | **Crear** | Sección 12 | |
| Selector de cantidad (−, número, +) | **Crear** | Secciones 12 y 16 | |
| Barra de compra fija en celular | **Crear** | Sección 15 | |
| Ventana de compra (indicador de pasos, control segmentado, chips de miembros, interruptor, campos, tarjetas de medio de pago, casilla, boleta digital) | **Crear** | Sección 16 | Producción: `<dialog>` con `showModal()`, React Aria o Radix (H7). |
| Galería de recuerdos | **Crear** | Sección 13 | |

#### 1. Encabezado

- **Layout:** `<header>` con `position: sticky; top: 0; z-index: 5; background: #FBF7F3; border-bottom: 1px solid #EAE1D8` (`:27`). Contenedor interno: `max-width: 1240px; margin: 0 auto; padding: 12px clamp(16px, 4vw, 24px); display: flex; flex-wrap: wrap; align-items: center; gap: 12px 20px`. Alto dibujado: **69 px** desde 631 px de ancho (una fila), **125 px** entre 326 y 630 px (dos filas: "Volver al feed" y logo arriba, íconos abajo a la derecha) y **171 px** entre 301 y 325 px, incluido 320 (tres filas).
- **Contenido en orden:**
  1. Enlace **"Volver al feed"**: `display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: .92rem` (14,72 px); `height: 44px`; color #17120F. Ícono chevron a la izquierda (`M15 18l-6-6 6-6`), 18 × 18, trazo 2, extremos y uniones redondeadas, `aria-hidden`.
  2. Logo **"fulleventos"** (en minúscula): DM Sans 700, 1.55rem (24,8 px), `letter-spacing: -0.03em`, color #D9452F, `margin-inline: auto` (queda centrado entre el enlace de volver y los íconos). A 1280 px queda en x = 384–509.
  3. `<nav aria-label="Principal">`: `margin-left: auto; display: flex; flex-wrap: wrap; justify-content: flex-end; align-items: center; gap: 6px`. Contiene:
     - "Inicio" (`aria-label="Inicio"`): casa (`M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z`).
     - "Agenda de eventos": calendario (`rect 3,5 18×16 rx 2` + `M3 10h18M8 3v4M16 3v4`).
     - "Mapa de eventos": mapa plegado (`M9 4 3 6.5V20l6-2.5 6 2.5 6-2.5V4l-6 2.5z` + `M9 4v13.5M15 6.5V20`).
     - "Mensajes, 3 sin leer": globo de chat (`M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z`) con insignia "3": `position: absolute; top: 6px; right: 6px; min-width: 18px; height: 18px; border-radius: 9px; background: #C23A24; color: #FFFFFF; font-size: .66rem` (10,56 px); peso 700; `padding: 0 4px; box-sizing: border-box`; `aria-hidden`.
     - Botón "Notificaciones" (`<button type="button">`, sin acción): campana (`M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9` + `M10.3 21a1.9 1.9 0 0 0 3.4 0`), `border: 0; background: transparent`.
     - Los cinco: 44 × 44 px, `border-radius: 12px`, `display: grid; place-items: center`; íconos de 20 × 20, trazo 2, redondeados, `aria-hidden`. Ninguno lleva `aria-current` (esta pantalla no está en el menú).
     - Avatar **"CV"** (`<a aria-label="Tu perfil">`): 40 × 40, círculo, fondo #8FD3D0, 700, .78rem (12,48 px), `margin-left: 4px`.
- **Datos dinámicos:** ninguno. El "3" es fijo.
- **Componente:** variante "detalle" del encabezado (ver el mapa de componentes). Es distinto de los de Inicio, Agenda y Mapa (que tienen buscador y "Crear evento"); H41 pide unificarlos y H40 pide en celular una sola fila de 56 a 64 px con barra inferior de pestañas.

#### 2. Héroe del evento

- **Layout:** `<section aria-labelledby="fe-title">` (`:56`): `position: relative; border-radius: 28px; overflow: hidden; min-height: 380px; padding: clamp(28px, 5vw, 48px) clamp(20px, 5vw, 56px); box-sizing: border-box; display: flex; flex-direction: column; justify-content: flex-end; gap: 16px; color: #FFFFFF`. Fondo, en este orden de capas:
  1. `radial-gradient(circle at 74% 30%, rgba(232,160,79,.65) 0, transparent 26%)` (#E8A04F al 65 %, el resplandor naranja);
  2. `radial-gradient(circle at 90% 80%, rgba(181,55,43,.6) 0, transparent 30%)` (#B5372B al 60 %);
  3. `radial-gradient(ellipse at 8% 40%, rgba(70,30,80,.55) 0, transparent 45%)` (morado);
  4. `#140E10` (base).

  El relleno se calcula así: vertical 28 px hasta 560 px de ancho, 5vw hasta 960 px y 48 px desde ahí; horizontal 20 px hasta 400 px, 5vw hasta 1120 px y 56 px desde ahí. Medido: 28/20 px a 390, 38,4 px a 768 y 48/56 px a 1280. Alto dibujado: 380 px en los tres anchos.
- **Contenido en orden:**
  1. Marcador de foto **"[Foto del evento]"** (`<span role="img" aria-label="[Foto del evento]">`): `position: absolute; top: 20px; right: 20px; font-size: .72rem` (11,52 px); `color: rgba(255,255,255,.8); border: 1px solid rgba(255,255,255,.35); border-radius: 999px; padding: 4px 10px`. En producción va la foto real del evento como fondo, con los degradados encima para mantener el contraste del texto blanco.
  2. Etiqueta **"Rumba · Vie 9 oct"**: `align-self: flex-start; background: #F6DC6A; color: #17120F`; Archivo 800, .95rem (15,2 px), `text-transform: uppercase` (se ve "RUMBA · VIE 9 OCT"), `padding: 4px 11px`, **sin** radio.
  3. `<h1 id="fe-title">`: Archivo 900, `text-transform: uppercase; letter-spacing: -0.035em; line-height: .98; font-size: clamp(2.2rem, 5vw, 4.2rem)`, color #17120F, `display: flex; flex-direction: column; align-items: flex-start`. Tamaño dibujado: 35,2 px a 390 (mínimo hasta 704 px de ancho), 38,4 px a 768, 64 px a 1280 y 67,2 px como máximo desde 1344 px. Dos `span`:
     - **"Noche de salsa"**, con `background: linear-gradient(90deg, #F3B27E, #EE93BC); padding: .1em .22em .06em`;
     - **"y boleros en vivo"**, con `background: linear-gradient(90deg, #EE93BC, #F3B27E); padding: .1em .22em .06em; margin-left: 1em`.

     Cada `span` se vuelve bloque (es hijo de un flex) y mide lo que su texto. Si el texto se parte en dos líneas (a 390 px: "NOCHE DE / SALSA" y "Y BOLEROS EN / VIVO"), el degradado cubre un **rectángulo** con las dos líneas, no una franja por línea. A 1280 px cada franja mide 73 px de alto (606 y 687 px de ancho).
  4. Fila de datos: `display: flex; flex-wrap: wrap; gap: 8px 22px; font-size: .95rem` (15,2 px); `color: rgba(255,255,255,.92)`. Cada dato: `display: flex; align-items: center; gap: 6px` con un ícono de 16 × 16, trazo 2, `aria-hidden`:
     - reloj (`circle r 9` + `M12 7v5l3 2`): **"Viernes 9 de octubre · Puertas 8:00 p. m."**
     - pin (`M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z` + `circle cy 10 r 2.5`): **"Galería Café Libro · Zona T, Bogotá"**
     - dos personas (`circle 9,8 r 3.5` + `M2.5 20c.8-3.5 3.4-5.5 6.5-5.5s5.7 2 6.5 5.5` + `M16 4.5a3.5 3.5 0 0 1 0 7M18 14.8c2 .7 3.2 2.5 3.6 5.2`): **"{{goingCount}} van · 340 interesados"**.

     Los tres van en una fila desde 960 px de ancho, en dos filas (dos y uno) entre 591 y 959 px, y uno por fila por debajo de 591 px.
- **Datos dinámicos:** `goingCount = 186 + (going ? 1 : 0)`, así que se ve "186 van · 340 interesados" o "187 van · 340 interesados". "340" es fijo y no sube con "Me interesa" (H26).
- **Componente:** `.hero` + `.photo-note` + `.tag` + `.headline` del código base, con los valores de arriba.

#### 3. Datos clave del evento

- **Layout:** `<section aria-label="Datos clave del evento">` (`:70`): `background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 24px; padding: 8px; display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 4px`. Columnas según el ancho (medido en Chromium): 1 por debajo de 394 px, 2 entre 394 y 582, 3 entre 583 y 757, 4 entre 758 y 931, y 5 desde 932 px. A 768 px quedan **4 + 1** (H61) y "Show 9:30 p. m." se parte en dos líneas. Alto: 112 px a 1280, 246 a 768 y 412 a 390.
- **Cada dato** (`:71`, 5 en total): `display: flex; align-items: center; gap: 12px; padding: 12px 14px; min-width: 0`. A la izquierda, un recuadro de 46 × 46 px con `border-radius: 12px` y `flex-shrink: 0`, `aria-hidden`. A la derecha, un bloque de texto con `min-width: 0; line-height: 1.3`:
  - rótulo: `display: block; font-size: .7rem` (11,2 px), 700, `letter-spacing: .1em`, mayúsculas por CSS, color #6E6259;
  - valor: `<b>` en bloque, .94rem (15,04 px), 700, #17120F;
  - línea secundaria: .8rem (12,8 px), #6E6259.
- **Contenido en orden:**

| # | Recuadro (46 × 46) | Rótulo | Valor | Línea secundaria |
|---|---|---|---|---|
| 1 | Placa de fecha: `box-sizing: border-box; border: 1px solid #EAE1D8; border-radius: 12px`, columna centrada, `line-height: 1`; **"9"** en Archivo 900, 1.3rem (20,8 px); **"oct"** en .62rem (9,92 px), 700, mayúsculas, `letter-spacing: .06em`, #6E6259, `margin-top: 2px` | "Fecha" | "Viernes 9 de octubre" | "2026 · este viernes" (texto fijo; en producción "este viernes" se calcula con la fecha del servidor, H53) |
| 2 | Fondo #F3B27E, reloj 22 × 22 (trazo 2) | "Hora" | "Puertas 8:00 p. m." | "Show 9:30 p. m." |
| 3 | Fondo #EE93BC, pin 22 × 22 | "Lugar" | "Galería Café Libro" | "Zona T, Bogotá" |
| 4 | Fondo #A3A8F0, documento de identidad 22 × 22 (`M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM6 10a2 2 0 1 0 4 0a2 2 0 1 0-4 0M5 16c.6-1.4 1.7-2 3-2s2.4.6 3 2M14 10h5M14 14h4`) | "Edad" | "+18" | "Con documento original" |
| 5 | Fondo #B9E07A, boleta 22 × 22 (`M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4z` + línea `M14 6v12` con `stroke-dasharray="2 2"`) | "Precio" | "Desde $45.000" | Enlace **"Ver localidades"** (`href="#localidades"`): `display: inline-block; font-size: .8rem`; 700; `border-bottom: 2px solid #17120F` |

- **Datos dinámicos:** ninguno. "Desde $45.000" es fijo. En producción es el precio mínimo entre las localidades a la venta, en formato COP. H21 pide aclarar el cargo por servicio ("Desde $45.000 + cargo por servicio" o "Desde $48.600 con cargos", igual en todas las pantallas). H4 pide agregar aquí "PULEP: [CÓDIGO]".
- **Componente:** nuevo "Datos clave". La placa de fecha se parece a `.date` del código base, pero con borde y sin sombra.

#### 4. Acciones y "quién va"

- **Layout:** bloque `display: flex; flex-direction: column; gap: 14px` (`:124`) con dos hijos.
- **4a. Fila de acciones** (`:125`): `display: flex; flex-wrap: wrap; gap: 10px; align-items: center`. Cabe en una fila desde 563 px; por debajo queda en dos filas ("Voy" y "Me interesa" arriba; "Invitar amigos" y Compartir abajo).
  1. **"Voy" / "Vas a ir"** (`aria-pressed`): `height: 48px; border-radius: 999px; padding: 0 24px; font-size: .95rem` (15,2 px); 700; `border: 1px solid #17120F`; `display: flex; align-items: center; gap: 8px`. Ícono de visto (`m5 12 5 5L20 7`), 18 × 18, trazo **2.4**, antes del texto. Apagado: fondo #FFFFFF y texto #17120F, "Voy". Encendido: fondo #17120F y texto #FFFFFF, "Vas a ir". Ancho a 1280: 104 px.
  2. **"Me interesa"** (`aria-pressed`): 48 px, `padding: 0 22px`, .95rem, 700, `border: 1px solid #EAE1D8`, fondo #FFFFFF. Estrella (`m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z`), 18 × 18, trazo 2. Apagado: texto e ícono #17120F, estrella sin relleno. Encendido: texto e ícono #C23A24, estrella rellena (`fill: currentColor`). El texto no cambia.
  3. **"Invitar amigos"**: 48 px, `padding: 0 22px`, .95rem, 700, borde #EAE1D8, fondo #FFFFFF, texto #17120F. Avión de papel (`M22 2 11 13M22 2l-7 20-4-9-9-4z`), 18 × 18. Sin acción.
  4. **Compartir** (`aria-label="Compartir evento"`): círculo de 48 × 48, borde #EAE1D8, fondo #FFFFFF. Flecha que sale de una caja (`M12 3v12M7 8l5-5 5 5` + `M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6`), 18 × 18. Sin acción.
- **4b. Tarjeta "quién va"** (`:136`): `background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 20px; padding: 18px 20px; display: flex; flex-wrap: wrap; align-items: center; gap: 14px 20px`.
  1. Avatares superpuestos (`display: flex`): cinco círculos de 40 px con `border: 3px solid #FFFFFF` (46 px dibujados), `font-weight: 700; font-size: .74rem` (11,84 px) y `margin-left: -12px` desde el segundo:
     - "LM" #F3B27E, "AR" #A3A8F0, "SC" #EE93BC, "MG" #F6DC6A;
     - "+9" con fondo #17120F, texto #FFFFFF y .7rem (11,2 px).

     No tienen `aria-hidden` ni nombre: el lector lee "LM AR SC MG +9".
  2. Párrafo (`margin: 0; flex: 1 1 220px`): **"<b>Laura, Andrés, Sofía y 10 amigos más</b> van. <span style="color:#6E6259">{{goingCount}} personas confirmadas · 340 interesadas</span>"**. Hereda 15 px.
  3. Enlace **"Ver parches"** (`#parches`): .86rem (13,76 px), 700, `border-bottom: 2px solid #17120F; padding-bottom: 1px`.

  Los tres van en una fila desde 614 px de ancho (salvo a 980 y 981 px, donde aparece el aside y el enlace baja). Entre 396 y 613 px quedan en dos filas, y por debajo de 396 px (incluido 390) en tres: avatares, texto y enlace, alineados a la izquierda.
- **Datos dinámicos:** `goingCount` igual que en el héroe ("186" o "187"). Los nombres, el "+9" y el "10" son fijos. 4 avatares + 9 = 13 personas = "Laura, Andrés, Sofía" + 10.
- **Componente:** botones píldora nuevos (patrón `.join[aria-pressed]` para "Voy"); `.avs`/`.av` para los avatares; `.more` para "Ver parches".

#### 5. Atajos de sección ("En esta página")

- **Layout:** `<nav aria-label="En esta página" data-fe="secnav">` (`:149`): `display: flex; gap: 8px; overflow-x: auto; padding: 10px 0; margin: -22px 0 -18px; background: #FBF7F3`. Las márgenes negativas acercan la fila al bloque de arriba (36 − 22 = 14 px, más 10 px de relleno) y a "Sobre el evento" (36 − 18 = 18 px, más 10 px). Alto: 60 px. **Desde 980 px** es `position: sticky; top: 69px; z-index: 4` (queda pegada justo debajo del encabezado de 69 px mientras la columna de contenido está en pantalla) y el fondo crema tapa el contenido que pasa por debajo. Por debajo de 980 px no es fija.
- **Contenido en orden:** seis enlaces, cada uno con `flex-shrink: 0; height: 40px; box-sizing: border-box; display: inline-flex; align-items: center; padding: 0 16px; border-radius: 999px; border: 1px solid #EAE1D8; background: #FFFFFF; font-size: .88rem` (14,08 px); `font-weight: 500; white-space: nowrap`:
  "Sobre el evento" · "Programación" · "Localidades" · "Parches y muro" · "Lo que debes saber" · "Ubicación".
- **Desbordamiento:** el ancho total de la fila es 818 px. Hay scroll horizontal por debajo de 866 px y entre 980 y 1233 px (cuando aparece el aside); cabe entre 866 y 979 px y desde 1234 px. No hay degradado, flechas ni pista de que hay más (H61), y la barra de scroll no está oculta.
- **Datos dinámicos:** ninguno. No marca la sección en la que está el usuario (no hay "scroll spy" ni `aria-current`).
- **Componente:** `.chips`/`.chip` del código base, en versión de enlaces.

#### 6. Sobre el evento (`#sobre`)

- **Layout:** `<section id="sobre" aria-labelledby="h-sobre">`: `scroll-margin-top: 140px; display: flex; flex-direction: column; gap: 14px`.
- **Título de sección (igual en las secciones 6, 7, 8, 9, 10, 11 y 13a):** `<h2>` con `margin: 0`, Archivo 900, 1.5rem (24 px), `letter-spacing: -0.03em; line-height: 1.05; text-transform: uppercase`. El texto fuente va en mayúscula inicial; las mayúsculas las pone el CSS.
- **Contenido en orden:**
  1. `<h2 id="h-sobre">` **"Sobre el evento"**.
  2. Bloque de texto: `display: flex; flex-direction: column; gap: 12px; max-width: 66ch; font-size: 1rem` (16 px, interlineado 1.5):
     - **"Una noche para bailar pegadito en Galería Café Libro. La orquesta [NOMBRE DE LA ORQUESTA] toca salsa brava, salsa romántica y boleros de siempre, en vivo y con [NÚMERO DE MÚSICOS] músicos en tarima."**
     - **"¿Nunca has bailado? Llega temprano: a las 8:30 p. m. hay clase de salsa gratis con [NOMBRE DEL PROFESOR O ACADEMIA]. Después, pista abierta hasta el cierre con DJ."**
  3. Etiquetas (`display: flex; flex-wrap: wrap; gap: 8px`), cada una un `<span>` sin interacción: `height: 34px; box-sizing: border-box; display: inline-flex; align-items: center; padding: 0 14px; border-radius: 999px; border: 1px solid #EAE1D8; background: #FFFFFF; font-size: .84rem` (13,44 px), peso 400. Textos: "Salsa" · "Boleros" · "Música en vivo" · "Clase gratis" · "Zona T".
- **Datos dinámicos:** ninguno. En producción, la descripción y las etiquetas vienen del evento.

#### 7. Programación (`#programacion`)

- **Layout:** `<section id="programacion" aria-labelledby="h-prog">` con `scroll-margin-top: 140px`, columna y `gap: 14px`. La lista es un `<ol>` con `list-style: none; margin: 0; padding: 4px 20px; background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 22px`. Alto: 295 px a 1280 y 768, 411 px a 390.
- **Contenido en orden:** `<h2 id="h-prog">` **"Programación"** y, por cada momento (`<li>` con `display: flex; align-items: stretch; gap: 14px`):
  1. Hora: `flex: 0 0 84px; padding-top: 16px; font-weight: 700; font-size: .92rem` (14,72 px).
  2. Riel decorativo (`aria-hidden`): `flex: 0 0 18px`, columna centrada con:
     - línea superior de 20 px × 2 px (transparente en el primer momento, #EAE1D8 en los demás);
     - punto de 18 × 18 px, `box-sizing: border-box; border-radius: 50%; border: 2px solid #17120F`, con el color del momento;
     - línea inferior `flex: 1`, 2 px (transparente en el último, #EAE1D8 en los demás).
  3. Texto: `flex: 1; min-width: 0; padding: 14px 0; border-bottom: 1px solid` #F1EAE3 (transparente en el último); `line-height: 1.35`.
     - Fila de título: `display: flex; flex-wrap: wrap; align-items: center; gap: 4px 10px`, con el título en `<b>` de 1rem (16 px) y, si existe, la etiqueta **"Plato fuerte"**: `background: #17120F; color: #FFFFFF; border-radius: 999px; padding: 2px 9px; font-size: .7rem` (11,2 px); 700; `letter-spacing: .04em`; mayúsculas por CSS ("PLATO FUERTE").
     - Descripción: bloque, .86rem (13,76 px), #6E6259, `margin-top: 2px`.

| Hora | Título | Descripción | Punto | Etiqueta |
|---|---|---|---|---|
| "8:00 p. m." | "Apertura de puertas" | "Entra con tu documento y la boleta en el celular" | #F6DC6A | — |
| "8:30 p. m." | "Clase de salsa gratis" | "Pasos básicos con [NOMBRE DEL PROFESOR O ACADEMIA]" | #F3B27E | — |
| "9:30 p. m." | "Orquesta en vivo" | "[NOMBRE DE LA ORQUESTA] · salsa brava y boleros" | #EE93BC | "Plato fuerte" |
| "1:00 a. m." | "Cierre con DJ" | "[NOMBRE DEL DJ] hasta el cierre · [HORA DE CIERRE]" | #A3A8F0 | — |

- **Datos dinámicos:** `lineTop` = transparente si es el primero; `lineBot` y `sep` = transparente si es el último. En producción, la lista viene del evento, ordenada por hora (el cierre después de medianoche pertenece a la misma noche).
- **Componente:** nueva "Línea de tiempo".

#### 8. Localidades (`#localidades`)

- **Layout:** `<section id="localidades" aria-labelledby="h-loc">` con `scroll-margin-top: 140px`, columna y `gap: 14px`.
  - Cabecera: `display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 6px 16px`, con `<h2 id="h-loc">` **"Localidades"** y la ayuda **"Toca una zona del plano o de la lista para elegirla."** (.88rem = 14,08 px, #6E6259). La ayuda queda a la derecha del título desde 560 px de ancho y debajo de él por debajo de 560 px.
  - Cuerpo: `display: flex; flex-wrap: wrap; gap: 18px; align-items: flex-start` con dos hijos: el plano (`flex: 1 1 320px; min-width: 0`, columna con `gap: 8px`) y la lista (`flex: 1 1 260px; min-width: 0`, columna con `gap: 10px`). Van lado a lado entre 646 y 979 px y desde 1015 px; se apilan por debajo de 646 px y entre 980 y 1014 px. A 1280 px: plano de 453 px y lista de 393 px.
- **8a. Plano** (`<div role="group" aria-label="Plano del lugar: elige una zona">`, `:206`): `background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 22px; padding: 14px; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 2.2fr) minmax(0, 1fr); gap: 8px`. Alto: 455 px. Contenido en orden:
  1. **"Escenario"** (`aria-hidden`): ocupa las 3 columnas; `height: 48px; border-radius: 10px 10px 36px 36px; background: #17120F; color: #FFFFFF; display: grid; place-items: center`; Archivo 900, .9rem (14,4 px), `letter-spacing: .14em`, mayúsculas.
  2. **Mesas VIP izquierda** (botón, `aria-label="Mesas VIP, lado izquierdo del escenario · $320.000 por mesa"`, `aria-pressed`): `position: relative; min-height: 148px; border-radius: 14px; border: 2px solid {borde}; background: {fondo}; box-shadow: {anillo}; padding: 10px 4px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; color: #17120F`. Dentro:
     - una cuadrícula de 2 × 2 cuadrados de 14 px (`gap: 8px`; cada uno con `box-sizing: border-box; border-radius: 4px; border: 2px solid #17120F`);
     - el texto **"Mesas VIP"** en .72rem (11,52 px), 700, `line-height: 1.15`, centrado.

     Todo `aria-hidden`.
  3. **Pista** (`aria-hidden`, no es botón): `border-radius: 14px; border: 2px dashed #EE93BC; background: repeating-linear-gradient(135deg, #FCE9F2 0 10px, #F8DCEA 10px 20px)`; columna centrada, `padding: 10px; gap: 2px`. Textos: **"Pista"** (Archivo 900, .95rem = 15,2 px, mayúsculas, `letter-spacing: .04em`) y **"Para bailar con cualquier boleta"** (.74rem = 11,84 px, #6E6259, `line-height: 1.25`).
  4. **Mesas VIP derecha**: igual que la izquierda, con `aria-label="Mesas VIP, lado derecho del escenario · $320.000 por mesa"`. Las dos se encienden juntas.
  5. **Zona preferencial** (botón, `aria-label="Zona preferencial con mesas compartidas · $70.000 por persona"`): ocupa las 3 columnas; `min-height: 96px; padding: 12px; gap: 10px`. Dentro, 8 círculos de 18 px (`border: 2px solid #17120F`, `display: flex; flex-wrap: wrap; justify-content: center; gap: 10px 16px`) y el texto **"Zona preferencial · mesas compartidas"** (.8rem = 12,8 px, 700, `line-height: 1.2`).
  6. **Zona general** (botón, `aria-label="Zona general, de pie · $45.000 por persona"`): 3 columnas; `min-height: 84px; padding: 12px; gap: 2px`. Textos **"Zona general · de pie"** (.84rem = 13,44 px, 700) y **"Acceso a pista y barra"** (.74rem).
  7. **"Entrada"** (`aria-hidden`): 3 columnas; `display: flex; justify-content: center; align-items: center; gap: 6px; font-size: .7rem` (11,2 px); 700; `letter-spacing: .1em`; mayúsculas; #6E6259. Lleva una flecha hacia arriba (`M12 19V5M6 11l6-6 6 6`) de 14 px, trazo 2.4, antes del texto.

  Colores de cada zona:

  | Zona | Fondo apagada | Fondo encendida | Borde apagada / encendida | Sombra encendida |
  |---|---|---|---|---|
  | General | #E8F4D6 | #B9E07A | transparente / #17120F | `0 6px 18px rgba(23,18,15,.18)` |
  | Preferencial | #E3E5FB | #A3A8F0 | transparente / #17120F | igual |
  | VIP | #FBF1C6 | #F6DC6A | transparente / #17120F | igual |

  La zona encendida muestra además una insignia de visto: `position: absolute`, a `top: 6px; right: 6px` en las VIP y a `top: 8px; right: 8px` en Preferencial y General; círculo de 20 px, #17120F, ícono blanco de 12 px y trazo 3.

  Debajo del plano: **"Plano ilustrativo · [CONFIRMAR DISTRIBUCIÓN CON EL ORGANIZADOR]"** (.76rem = 12,16 px, #6E6259).
- **8b. Lista de precios** (`<div role="group" aria-label="Precios por localidad">`, `:275`): un botón por localidad (`aria-pressed`): `width: 100%; box-sizing: border-box; display: flex; align-items: flex-start; gap: 12px; text-align: left; padding: 14px 16px; border-radius: 18px; border: 1.5px solid {#17120F encendida / #EAE1D8 apagada}; background: {tinte encendida / #FFFFFF apagada}; color: #17120F`. Dentro:
  1. Muestra de color: 16 × 16, `margin-top: 3px; border-radius: 5px; border: 1.5px solid #17120F`, fondo = color de la zona (#B9E07A, #A3A8F0, #F6DC6A). `aria-hidden`.
  2. Bloque (`flex: 1; min-width: 0; line-height: 1.3`): nombre completo en `<b>` de .95rem (15,2 px); descripción en .8rem (12,8 px), #6E6259; y, **solo si la localidad está "caliente"**, la píldora **"Últimas 12"** (`display: inline-block; margin-top: 6px; background: #C23A24; color: #FFFFFF; border-radius: 999px; padding: 2px 10px; font-size: .72rem` = 11,52 px; 700).
  3. Precio (`flex-shrink: 0; text-align: right; line-height: 1.2`): `<b>` de 1rem con el precio y, debajo, la unidad en .72rem, #6E6259 ("por persona" o "por mesa").

  Debajo: **"Precios en pesos colombianos. El cargo por servicio lo ves antes de pagar."** (.78rem = 12,48 px, #6E6259).
- **Datos dinámicos:** la localidad elegida (`loc`, inicial `'general'`) es una sola para el plano, la lista, la tarjeta lateral y la ventana de compra: elegir en cualquiera actualiza las cuatro. Precio: `cop(price)` → "$45.000", "$70.000", "$320.000". Elegir una localidad (`pickLoc`) recorta los amigos elegidos del parche al cupo de esa localidad, sin aviso (ver la sección 16).
- **Componente:** "Plano de localidades" y "Tarjeta-opción de localidad" nuevos. H59 pide que sean un grupo de radio (`role="radiogroup"` o `fieldset` + `input type="radio"`), no botones con `aria-pressed`.

#### 9. Parches y muro (`#parches`)

- **Layout:** `<section id="parches" aria-labelledby="h-parches">` con `scroll-margin-top: 140px`, columna y `gap: 14px`.
  - Cabecera: `display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 10px 16px`. A la izquierda, `<h2 id="h-parches">` **"Parches para este evento"** y el párrafo **"Únete a un grupo para llegar acompañado, o arma el tuyo."** (`margin: 4px 0 0`, 15 px, #6E6259). A la derecha, el botón **"Armar parche"**: `height: 40px; border: 1px solid #17120F; background: #FFFFFF; border-radius: 999px; padding: 0 16px; font-weight: 700; font-size: .86rem` (13,76 px); `display: flex; align-items: center; gap: 6px`; ícono "+" (`M12 5v14M5 12h14`) de 16 px y trazo 2.2. Sin acción (H38).
  - Pestañas (`<div role="tablist" aria-label="Parches y muro">`): `display: flex; gap: 4px; overflow-x: auto; box-shadow: inset 0 -1px 0 #EAE1D8` (línea base de 1 px). Cada pestaña (`<button role="tab" aria-selected>`): `flex-shrink: 0; white-space: nowrap; height: 48px; border: 0; background: transparent; padding: 0 16px; font-size: .95rem` (15,2 px); 700. Seleccionada: texto #17120F y `border-bottom: 3px solid #C23A24`. No seleccionada: texto #6E6259 y borde transparente. Textos fijos: **"Parches (3)"** y **"Muro (24)"**. Ancho dibujado: 117 px ("Parches (3)") y 105 px ("Muro (24)"); cada una mide lo que su texto más 16 px por lado.
- **9a. Panel "Parches"** (visible si `tab === 'parches'`, el inicial; `<div role="tabpanel" aria-label="Parches">`, columna con `gap: 12px`). Cada parche es un `<article>`: `background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 18px; padding: 16px 18px; display: flex; flex-wrap: wrap; align-items: center; gap: 14px 18px`. Dentro:
  1. Avatar cuadrado de 52 × 52, `border-radius: 14px`, fondo del parche, iniciales en Archivo 900 (15 px).
  2. Texto (`flex: 1 1 240px; min-width: 0`):
     - `<h3>` con el nombre (`margin: 0; font-size: 1.02rem` = 16,32 px; 700);
     - descripción (`margin: 2px 0 0; font-size: .86rem`; #6E6259);
     - fila de cupos (`display: flex; align-items: center; gap: 10px; margin-top: 8px`) con una barra (`flex: 0 1 160px; height: 8px; border-radius: 4px; background: #EAE1D8; overflow: hidden`; relleno #C23A24 al `pct %`) y el texto de cupos (.8rem, #6E6259).
  3. Botón **"Unirme" / "Estás dentro"** (`aria-pressed`): `height: 42px; border: 0; border-radius: 999px; padding: 0 18px; font-size: .86rem; font-weight: 700; color: #FFFFFF`; fondo #C23A24 ("Unirme") o #17120F ("Estás dentro").

  Desde 490 px de ancho la tarjeta es una sola fila (108 px de alto a 768 y 1280). Entre 380 y 489 px (incluido 390) el botón baja a su propia fila, alineado a la izquierda, y las tres tarjetas miden 185, 204 y 164 px (según el largo de la descripción); en la segunda ("Primera vez bailando"), "3 de 10 cupos" se parte en dos líneas porque la barra y el texto se encogen juntos. Por debajo de 380 px quedan tres filas. La cabecera de la sección pone "Armar parche" debajo del título por debajo de 613 px, y también justo a 980 px (cuando aparece el aside).
- **9b. Panel "Muro"** (visible si `tab === 'muro'`; `<div role="tabpanel" aria-label="Muro">`, columna con `gap: 14px`):
  1. Compositor (`display: flex; gap: 10px; align-items: center`):
     - avatar "CV" de 40 px, #8FD3D0, 700, .78rem;
     - `<label>` (`position: relative; flex: 1; min-width: 0`) con el texto oculto **"Escribe en el muro"** (`position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap`) y el `<input type="text" placeholder="Pregunta o comenta algo del evento">`: `width: 100%; box-sizing: border-box; height: 44px; border: 1px solid #EAE1D8; border-radius: 999px; padding: 0 16px; background: #FFFFFF; font-size: .95rem` (15,2 px); texto #000000 (no fija color); placeholder #757575 (gris por defecto de Chromium);
     - botón **"Enviar"**: `height: 44px; border: 0; border-radius: 999px; padding: 0 18px; background: #C23A24; color: #FFFFFF; font-weight: 700`, sin tamaño de letra (13,33 px). Sin acción.
  2. Mensajes (3), cada uno `display: flex; gap: 12px`:
     - avatar enlace (`<a href="Perfil.dc.html" aria-label="Perfil de {nombre}">`), 40 px, círculo, color de la persona, 700, .78rem;
     - burbuja: `background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 4px 16px 16px 16px` (la esquina superior izquierda, junto al avatar, es casi recta); `padding: 10px 14px; line-height: 1.4`. No ocupa todo el ancho: mide lo que su texto. Dentro: una línea de .86rem con **"<b>{nombre}</b> <span style="color:#6E6259">· {hace X}</span>"** y el texto del mensaje (15 px).
- **Datos dinámicos:** `cupos = used + ' de ' + max + ' cupos'`, con `used = used_base + (joined ? 1 : 0)`; `pct = Math.round(used / max * 100)`. Valores iniciales: 6/8 = 75 %, 3/10 = 30 %, 3/4 = 75 %. Al unirse a "Salseros de jueves": "7 de 8 cupos" y 88 %. Los conteos "(3)" y "(24)" son fijos: el muro dice 24 pero muestra 3 mensajes.
- **Componente:** "Tarjeta de parche" (compartida con Inicio y Chat), "Pestañas" y "Muro", todos nuevos. H9 pide "Reportar" y "Bloquear" en cada mensaje y parche, y H30 pide parches con aprobación o privados.

#### 10. Lo que debes saber (`#saber`)

- **Layout:** `<section id="saber" aria-labelledby="h-saber">` con `scroll-margin-top: 140px`, columna y `gap: 14px`. Rejilla: `display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px`. Columnas: 1 por debajo de 492 px, 2 entre 492 y 731, 3 entre 732 y 963, 4 entre 964 y 979 (queda 4 + 2), 2 entre 980 y 1100, y 3 desde 1101 px. A 1280 y a 768 px quedan 3 + 3.
- **Contenido en orden:** `<h2 id="h-saber">` **"Lo que debes saber"** y 6 tarjetas: `background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 18px; padding: 16px; display: flex; align-items: flex-start; gap: 12px`. Cada una tiene:
  - recuadro de ícono de 40 × 40, `border-radius: 12px`, fondo de color, `aria-hidden`, con un ícono de 20 px y trazo 2;
  - texto (`min-width: 0; line-height: 1.4`): título en `<b>` de .95rem (15,2 px) y cuerpo de .85rem (13,6 px), #6E6259, `margin-top: 2px`.

| Título | Texto | Fondo del ícono | Ícono |
|---|---|---|---|
| "Documento original" | "Evento para mayores de 18. Presenta cédula, cédula de extranjería o pasaporte en la entrada." | #A3A8F0 | documento de identidad |
| "No hay reingreso" | "Si sales del lugar, la boleta ya no te deja volver a entrar." | #EE93BC | círculo tachado |
| "Parqueadero" | "[CONFIRMAR CON EL ORGANIZADOR]. Si puedes, ven en transporte público o comparte carro con tu parche." | #8FD3D0 | cuadrado con "P" |
| "Accesibilidad" | "Acceso para silla de ruedas y baños accesibles: [CONFIRMAR CON EL ORGANIZADOR]." | #B9E07A | figura humana de accesibilidad |
| "Boleta digital" | "Muestra el QR desde Fulleventos o desde tu correo. No tienes que imprimir nada." | #F6DC6A | código QR |
| "Cambios y devoluciones" | "Si el evento cambia de fecha o se cancela: [POLÍTICA DE LA BOLETERA]." | #F3B27E | flechas circulares |

  (Los trazos exactos de cada ícono están en "Datos de ejemplo". H11 pide quitar "o desde tu correo" del texto de "Boleta digital".)

- **Datos dinámicos:** ninguno (lista fija `politicas`, `:1136-1143`).
- **Componente:** nueva "Tarjeta de política con ícono".

#### 11. Ubicación y organizador (`#ubicacion`)

- **Layout:** `<section id="ubicacion" aria-labelledby="h-ubi">` con `scroll-margin-top: 140px`, columna y `gap: 14px`. `<h2 id="h-ubi">` **"Ubicación y organizador"**. Debajo, `display: flex; flex-wrap: wrap; gap: 16px; align-items: stretch` con dos tarjetas (`flex: 1.3 1 300px` y `flex: 1 1 260px`, ambas con `min-width: 0`). Van lado a lado entre 664 y 979 px y desde 1033 px; en otro caso se apilan. Las dos tienen el mismo alto (297 px a 1280).
- **11a. Tarjeta de ubicación:** `background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 20px; overflow: hidden; display: flex; flex-direction: column`.
  1. Mapa estático (`<div role="img" aria-label="[Mapa de la ubicación]">`): `height: 170px; position: relative`. Fondo: dos "calles" blancas, una vertical entre el 47 % y el 53 % del ancho (`linear-gradient(90deg, transparent 47%, #FFFFFF 47%, #FFFFFF 53%, transparent 53%)`) y una horizontal entre el 58 % y el 63 % medido desde abajo (`linear-gradient(0deg, transparent 58%, #FFFFFF 58%, #FFFFFF 63%, transparent 63%)`), sobre #EDE5DC. Pin relleno #C23A24 de 34 × 34 con círculo interior blanco, en `left: 50%; top: 52%; transform: translate(-50%, -100%)` (la punta toca el 52 %). Rótulo **"[Mapa]"** en `bottom: 10px; left: 12px`, .72rem, #6E6259.
  2. Cuerpo (`padding: 16px 18px; line-height: 1.4; display: flex; flex-direction: column; gap: 10px; flex: 1`):
     - **"Galería Café Libro"** en `<b>` (15 px) y **"Zona T, Bogotá · [DIRECCIÓN]"** (.88rem, #6E6259);
     - fila de botones (`display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-top: auto`):
       - enlace **"Ver en el mapa"**: `height: 42px; box-sizing: border-box; border-radius: 999px; padding: 0 16px; background: #17120F; color: #FFFFFF; display: inline-flex; align-items: center; gap: 6px; font-weight: 700; font-size: .86rem`; ícono de mapa de 16 px, trazo 2.2;
       - botón **"Copiar dirección" / "Dirección copiada"** (`aria-pressed`): `height: 42px; border-radius: 999px; padding: 0 16px; border: 1px solid #EAE1D8; background: #FFFFFF; color: #17120F; font-weight: 700; font-size: .86rem`. Solo cambia el texto; no cambia colores.

       Los dos botones caben en una fila casi siempre. Pasan a dos filas por debajo de 378 px, entre 664 y 740 px, y entre 1033 y 1109 px, cuando la tarjeta queda angosta junto a la del organizador.
- **11b. Tarjeta del organizador:** `background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 20px; padding: 18px; display: flex; flex-direction: column; gap: 14px`.
  1. Fila (`display: flex; align-items: center; gap: 12px`):
     - logo "GC": 48 × 48, `border-radius: 14px`, fondo #17120F, letra #F6DC6A, Archivo 900 (15 px);
     - texto (`flex: 1; min-width: 0; line-height: 1.3`): **"Organiza"** (.72rem, #6E6259, mayúsculas, `letter-spacing: .08em`, 700), **"Galería Café Libro"** (`<b>` en bloque) y **"12,4 mil seguidores"** (.8rem, #6E6259);
     - botón **"Seguir" / "Siguiendo"** (`aria-pressed`): `height: 38px; border-radius: 999px; padding: 0 14px; font-size: .82rem` (13,12 px); 700; `border: 1px solid #17120F`. "Seguir": fondo #17120F y texto #FFFFFF. "Siguiendo": fondo #FFFFFF y texto #17120F.
  2. **"¿Dudas sobre mesas, cumpleaños o accesibilidad? Escríbele directo por el chat de Fulleventos."** (.88rem, #6E6259).
  3. Enlace **"Escribir al organizador"**: `margin-top: auto; height: 46px; box-sizing: border-box; border-radius: 999px; border: 1px solid #17120F; background: #FFFFFF; display: flex; align-items: center; justify-content: center; gap: 8px; font-weight: 700; font-size: .9rem` (14,4 px); globo de chat de 18 px.
- **Datos dinámicos:** `copyLabel`, `orgLabel`, `orgBg` y `orgFg` según el estado. "12,4 mil" usa coma decimal (formato colombiano).
- **Componente:** mapa estático y tarjeta de organizador nuevos ("Seguir" con el estilo de `.btn-dark`). En producción el mapa es MapLibre (cargado solo al verlo, H57) con la dirección y las coordenadas reales. H48 pide mostrar aquí la insignia "Organizador verificado" con su explicación.

#### 12. Tarjeta de compra lateral (`<aside aria-label="Comprar boletas">`, solo desde 980 px)

- **Layout:** el `<aside data-fe="aside">` (`:403`) es la segunda columna de la fila de dos columnas. A 1280 px mide 340 px de ancho y queda en x = 916; arranca a la altura de la fila de acciones (y = 633) y se estira hasta el final de la columna de contenido. Por debajo de 980 px tiene `display: none` y la reemplaza la barra de la sección 15. Dentro está la tarjeta `data-fe="buycard"`: `background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 24px; padding: 20px; display: flex; flex-direction: column; gap: 16px; box-shadow: 0 14px 40px rgba(23,18,15,.07)`. Desde 980 px es `position: sticky; top: 88px`: se queda fija 19 px debajo del encabezado mientras se baja por la columna, y se va con el final del aside. Alto: 577 px antes de comprar.
- **Contenido en orden:**
  1. **Cabecera** (`display: flex; align-items: flex-start; justify-content: space-between; gap: 12px`):
     - a la izquierda (`line-height: 1.2`): **"Boletas"** (bloque, .72rem = 11,52 px, 700, `letter-spacing: .1em`, mayúsculas, #6E6259), **"Desde $45.000"** (`<b>` en bloque, Archivo 900, 1.7rem = 27,2 px, `letter-spacing: -0.02em`, `margin-top: 2px`) y **"+ cargo por servicio"** (.8rem, #6E6259, `margin-top: 2px`);
     - a la derecha, la píldora **"En venta"**: `flex-shrink: 0; background: #B9E07A; border-radius: 999px; padding: 4px 10px; font-size: .74rem` (11,84 px); 700.
  2. **Estado de compra** (solo si ya hay compra; `<div role="status">`): `display: flex; align-items: center; gap: 10px; background: #F1F8E6; border: 1.5px solid #B9E07A; border-radius: 16px; padding: 10px 12px`. Dentro:
     - círculo de 32 px, #17120F, con visto #B9E07A de 16 px y trazo 3 (`aria-hidden`);
     - texto (`flex: 1; min-width: 0; line-height: 1.25`): `<b>` de .92rem (14,72 px) con **"{{purchaseBadge}}"** (ejemplo: "Tienes 2 boletas · General") y debajo .76rem (12,16 px), #6E6259, con **"{{purchaseSub}}"** (ejemplo: "También te llegaron al correo");
     - botón **"Ver boleta"**: `flex-shrink: 0; height: 36px; border: 0; background: transparent; padding: 0 4px; font-size: .82rem; font-weight: 700; color: #17120F; text-decoration: underline; text-underline-offset: 3px`.
  3. **Localidad** (`<div role="group" aria-labelledby="fe-card-loc">`, columna con `gap: 8px`): rótulo `<span id="fe-card-loc">` **"Localidad"** (.72rem, 700, `.1em`, mayúsculas, #6E6259) y una opción por localidad (`aria-pressed`): `width: 100%; box-sizing: border-box; display: flex; align-items: center; gap: 10px; text-align: left; min-height: 56px; padding: 8px 12px; border-radius: 14px; border: 1.5px solid {#17120F / #EAE1D8}; background: {tinte / #FFFFFF}; color: #17120F`. Dentro:
     - radio visual: círculo de 20 px, `box-sizing: border-box; border: 2px solid #17120F`, con un punto de 10 px (#17120F si está elegida, transparente si no);
     - texto (`flex: 1; min-width: 0; line-height: 1.2`): el campo `name` de la localidad (no `short` ni `full`) en `<b>` de .9rem (14,4 px), es decir "General", "Preferencial" o "Mesa VIP para 4"; debajo, la línea de stock (.74rem, 700) en #C23A24 si es "Últimas 12" y en #6E6259 si es "Disponible";
     - precio en `<b>` de .9rem.
  4. **Cantidad** (`display: flex; align-items: center; justify-content: space-between; gap: 12px`):
     - a la izquierda (`line-height: 1.25; min-width: 0`): `<span id="fe-card-qty">` **"Cantidad"** (.72rem, 700, `.1em`, mayúsculas, #6E6259) y la pista **"{{qtyHint}}"** (.78rem = 12,48 px, #6E6259);
     - a la derecha, el selector (`<div role="group" aria-labelledby="fe-card-qty">`): `flex-shrink: 0; display: flex; align-items: center; gap: 4px; border: 1px solid #EAE1D8; border-radius: 999px; padding: 4px` (128 × 50 px dibujado). Contiene:
       - botón "−" (`aria-label="{{decAria}}"`): círculo de 40 px, `border: 0; background: #FBF7F3; color: #17120F`; ícono `M5 12h14` de 16 px y trazo 2.6;
       - número (`aria-live="polite"`): `min-width: 30px; text-align: center; font-weight: 700; font-size: 1.05rem` (16,8 px);
       - botón "+" (`aria-label="{{incAria}}"`): igual, con ícono `M12 5v14M5 12h14`.

       Los botones usan `disabled` (opacidad .45 y cursor normal).
  5. **Subtotal** (`display: flex; justify-content: space-between; align-items: baseline; gap: 10px; padding-top: 14px; border-top: 1px dashed #EAE1D8`): **"Subtotal · {{qtyLine}}"** (.88rem, #6E6259; ejemplo "Subtotal · 2 boletas × $45.000") y **"{{subtotalFmt}}"** en `<b>` de 1.1rem (17,6 px) (ejemplo "$90.000").
  6. **Botón de compra** **"{{buyLabel}}"**: `height: 54px; border: 0; border-radius: 999px; background: #C23A24; color: #FFFFFF; font-weight: 700; font-size: 1rem; display: flex; align-items: center; justify-content: center; gap: 8px`. Lleva el ícono de boleta de 18 px antes del texto. Dice "Comprar boletas" antes de comprar y "Comprar más boletas" después.
  7. **Nota de seguridad** (`<p>` con `display: flex; align-items: flex-start; gap: 8px; font-size: .78rem; color: #6E6259; line-height: 1.4`): candado de 16 px (`rect 5,11 14×10 rx 2` + `M8 11V8a4 4 0 0 1 8 0v3`, `margin-top: 1px`) y **"Pago seguro · Boleta oficial emitida por [BOLETERA]. Compras sin salir de Fulleventos."** (H1 pide quitar el absoluto "sin salir de Fulleventos" y condicionar el texto al canal de venta).
- **Datos dinámicos** (fórmulas exactas en "Estados e interacciones" y "Detalles finos"):
  - `qtyHint`: con "Para mi parche" → "Tú + {k} de Salseros de jueves"; con Mesa VIP → "Una mesa es para 4 personas"; en otro caso → "Máximo 8 por compra".
  - `qtyLine` = `q + ' ' + unidad + ' × ' + cop(precio)`, con unidad "boleta"/"boletas" o "mesa"/"mesas". Ejemplos: "2 boletas × $45.000", "1 boleta × $45.000", "1 mesa × $320.000".
  - `subtotalFmt` = `cop(q × precio)`.
  - `decAria` / `incAria`: "Quitar una boleta" / "Agregar una boleta", o "Quitar una mesa" / "Agregar una mesa" con VIP.
  - `purchaseBadge` = "Tienes " + boletas propias + " boleta"/" boletas" + " · " + nombre corto de la localidad ("General", "Preferencial", "Mesa VIP"). Ejemplos: "Tienes 2 boletas · General", "Tienes 4 boletas · Mesa VIP", "Tienes 1 boleta · General" (pago dividido).
  - `purchaseSub`: con pago dividido → "{n} pago pendiente de tu parche" o "{n} pagos pendientes de tu parche"; sin dividir → "También te llegaron al correo".
- **Componente:** nueva "Tarjeta de compra". En producción, todos los precios, cupos y topes vienen del servidor (H3). H21 pide mostrar el total con cargo ("Total $97.200 (incluye cargo por servicio)"), H22 pide arrancar en 1 boleta, y H59 pide un enlace "Ir a comprar boletas" al principio de la página.

#### 13. Planes parecidos y recuerdos (bloque inferior)

- **Layout:** `<div>` (`:463`) con `display: flex; flex-wrap: wrap; gap: 24px; align-items: flex-start; margin-top: 16px; padding-top: 32px; border-top: 1px solid #EAE1D8`. Con el `gap: 24px` de `<main>`, la línea queda a 40 px del bloque anterior. Hijos: "Planes parecidos" (`flex: 2 1 560px; min-width: 0`) y "Recuerdos" (`flex: 1 1 300px; min-width: 0`). Van lado a lado desde 970 px (a 1280: 767 y 441 px de ancho); por debajo, "Recuerdos" baja a todo el ancho.
- **13a. Planes parecidos en otras ciudades** (`<section aria-labelledby="fe-parecidos">`, columna con `gap: 16px`):
  - Cabecera: `display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 8px 16px`. A la izquierda, `<h2 id="fe-parecidos">` **"Planes parecidos en otras ciudades"** (estilo de título de sección) y **"Rumba este finde por fuera de Bogotá"** (`margin: 4px 0 0`, .88rem, #6E6259). A la derecha, el enlace **"Ver más planes en el mapa"** (`display: inline-flex; align-items: center; gap: 6px; font-size: .86rem; font-weight: 700; border-bottom: 2px solid #17120F; padding-bottom: 1px`) con un ícono de mapa de 16 px. El enlace queda a la derecha entre 785 y 969 px y desde 1236 px; en otros anchos, debajo del título.
  - Rejilla: `display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px`. Por ser `auto-fill`, entre 896 y 969 px aparecen **4 columnas con la cuarta vacía**. Columnas: 1 por debajo de 453 px, 2 entre 453 y 679, 3 entre 680 y 895, 4 (una vacía) entre 896 y 969, 2 entre 970 y 1077 (queda 2 + 1) y 3 desde 1078 px.
  - Tarjeta (`<article>`): `background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 18px; overflow: hidden; display: flex; flex-direction: column`.
    1. Imagen (`position: relative; aspect-ratio: 16 / 10`), con un `<span role="img" aria-label="[Foto del evento]">` que la cubre (`position: absolute; inset: 0; background: radial-gradient(circle at 70% 30%, {bg1} 0, transparent 58%), {bg2}`).
    2. Placa de fecha: `position: absolute; top: 10px; left: 10px; background: #FFFFFF; border-radius: 10px; padding: 5px 9px 4px; text-align: center; line-height: 1; min-width: 44px; box-sizing: border-box`. Contiene el día (`<b>` en bloque, Archivo 900, 1.2rem = 19,2 px) y **"oct"** (.64rem = 10,24 px, 700, mayúsculas, `letter-spacing: .06em`, #6E6259).
    3. Cuerpo (`padding: 12px 14px 14px; display: flex; flex-direction: column; flex: 1; line-height: 1.3`):
       - categoría (.7rem, 700, `.1em`, mayúsculas, #C23A24): "Rumba";
       - título enlace (700, .98rem = 15,68 px, `margin: 4px 0`);
       - lugar (.82rem, #6E6259) con el formato **"{lugar} · <b style="color:#17120F">{ciudad}</b>"**;
       - precio (.86rem, 700, `margin-top: auto; padding-top: 10px`): **"{{priceLabel}}"**.
- **13b. Recuerdos de ediciones pasadas** (`<section aria-labelledby="fe-recuerdos">`): `background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 20px; padding: 18px; display: flex; flex-direction: column; gap: 12px`.
  - `<h2 id="fe-recuerdos">` **"Recuerdos de ediciones pasadas"** con `margin: 0; font-size: 1rem`. Es DM Sans en negrita de `<h2>` (700), **sin** Archivo ni mayúsculas: es distinto de los demás `h2` de la página.
  - Rejilla `display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px` con 6 cuadros `<div role="img" aria-label="[Foto de asistente]">` (`aspect-ratio: 1; border-radius: 10px`) con degradados (ver "Datos de ejemplo"). Miden 130 px a 1280, **223 px a 768** (el bloque ocupa todo el ancho) y 103 px a 390.
  - Enlace **"Ver las 128 fotos"** (.86rem, 700, `align-self: flex-start; border-bottom: 2px solid #17120F`).
- **Datos dinámicos:** `priceLabel = p ? 'Desde ' + cop(p) : 'Gratis'` → "Desde $40.000", "Desde $50.000", "Desde $30.000"; `cityName` sale del mapa `{ medellin: 'Medellín', cali: 'Cali', cartagena: 'Cartagena' }`. "128" es fijo. En producción, los planes parecidos se calculan por categoría y fecha, excluyendo la ciudad del evento.
- **Componente:** la tarjeta reutiliza `.card` + `.date` + `.cat` + `.where` + `.price` del código base (sin el corazón de guardar, sin "van" y sin botón). La galería es nueva.

#### 14. Pie de página

- **Layout:** `<footer style="border-top: 1px solid #EAE1D8">`; contenedor interno `max-width: 1240px; margin: 0 auto; padding: 28px clamp(16px, 4vw, 24px) 40px; display: flex; flex-wrap: wrap; gap: 12px 28px; justify-content: space-between; font-size: .85rem` (13,6 px); color #6E6259. Desde 931 px es una fila (89 px de alto a 1280); por debajo, dos filas (122 px a 768 y 142 px a 390).
- **Contenido en orden:** **"© 2026 Fulleventos · Colombia"** y **"Compra segura dentro de Fulleventos. Las boletas las emite la boletera oficial del evento o el organizador."** No tiene enlaces.
- **Datos dinámicos:** ninguno (el año "2026" es texto fijo).
- **Componente:** `footer` del código base. H5 obliga a agregar el pie legal con [RAZÓN SOCIAL], NIT, dirección, teléfono, correo, PQR, enlace a sic.gov.co, Términos y Política de tratamiento. H1 pide revisar "Compra segura dentro de Fulleventos" según el canal de venta.

#### 15. Barra de compra fija (solo por debajo de 980 px)

- **Layout:** `<div data-fe="buybar" role="region" aria-label="Comprar boletas">` (`:516`): `position: fixed; left: 0; right: 0; bottom: 0; z-index: 15; background: #FFFFFF; border-top: 1px solid #EAE1D8; box-shadow: 0 -10px 30px rgba(23,18,15,.08); padding: 10px clamp(16px, 4vw, 24px); align-items: center; gap: 12px`. El `display: flex` solo se activa por debajo de 980 px (desde 980 px, `display: none`). Alto dibujado: 69 px. El contenedor raíz deja 84 px abajo para que no tape el pie.
- **Contenido en orden:**
  1. Texto (`flex: 1; min-width: 0; line-height: 1.25`): **"Desde $45.000"** (`<b>` en bloque, 1rem) y **"{{barSub}}"** (bloque, .76rem = 12,16 px, #6E6259, `white-space: nowrap; overflow: hidden; text-overflow: ellipsis`). Ejemplo inicial: "General · 2 boletas · $90.000". Después de comprar: "Tienes 2 boletas · General", que a 390 px se corta como "Tienes 2 boletas · Ge…".
  2. Botón **"Ver boleta"** (solo si hay compra): `flex-shrink: 0; height: 44px; border: 1px solid #17120F; border-radius: 999px; padding: 0 14px; background: #FFFFFF; color: #17120F; font-weight: 700; font-size: .86rem`.
  3. Botón **"Comprar"**: `flex-shrink: 0; height: 48px; border: 0; border-radius: 999px; padding: 0 22px; background: #C23A24; color: #FFFFFF; font-weight: 700; font-size: .95rem`. Dice siempre "Comprar", también después de comprar (en la tarjeta lateral cambia a "Comprar más boletas").
- **Datos dinámicos:** `barSub = compra ? purchaseBadge : (loc.name + ' · ' + q + ' ' + unidad + ' · ' + cop(subtotal))`. Ejemplos: "General · 2 boletas · $90.000", "Mesa VIP para 4 · 1 mesa · $320.000", "Preferencial · 8 boletas · $560.000". "Desde $45.000" es fijo.
- **Componente:** nueva "Barra de compra fija". H21 pide "Total $97.200 (incluye cargo por servicio)"; H16 pide `scroll-padding-bottom: 84px` para que el foco no quede tapado; H40 nota que, con el encabezado de 125 px, las dos barras fijas ocupan 194 px de una pantalla de 844.

#### 16. Ventana de compra (checkout)

Se monta solo si `open` es verdadero (`<sc-if value="{{open}}">`, `:527`). Tiene 4 pasos (`step` 1 a 4). En el prototipo, el contenido de cada paso se monta y desmonta con `sc-if`; la cabecera y el pie son fijos (`sticky`) dentro de un solo contenedor con scroll.

- **Datos dinámicos (resumen):** localidades, cantidad (`q`), personas, subtotal, cargo, total, parte por persona, textos de pasos, pistas de validación, `nextLabel`, textos de la compra guardada y boleta (`doneMsg`, `tkLoc`, `tkQty`, `tkHolder`, `emailLine`) y el patrón del QR. Las fórmulas exactas y los ejemplos están en "Estados e interacciones" → "Fórmulas"; los textos fijos (título, subtítulo, "9:58", "#FE-2026-10-00421") no se calculan.

##### 16.1 Capa, fondo y contenedor

- Capa: `position: fixed; inset: 0; z-index: 30`.
- Fondo: `<div aria-hidden="true">` con `position: absolute; inset: 0; background: rgba(23,18,15,.55)`. Al hacer clic, cierra la ventana.
- Ventana: `<div role="dialog" aria-modal="true" aria-labelledby="fe-co-title">`, con `onKeyDown` para Escape. Estilos: `position: absolute; top: 12px; right: 12px; width: min(520px, calc(100% - 24px)); max-height: calc(100% - 24px); overflow-y: auto; background: #FBF7F3; border-radius: 24px; box-shadow: 0 24px 60px rgba(23,18,15,.35)`. En escritorio es un panel de 520 px pegado arriba a la derecha (a 1280 × 900: x = 748, 875 px de alto); en celular ocupa todo el ancho menos 12 px por lado (a 390 × 844: 366 × 820 px). **No** bloquea el scroll de la página de fondo: la rueda del mouse sobre el fondo oscuro mueve la página (de y = 662 a y = 1262 en la prueba).
- Interior: `<div style="position: relative; display: flex; flex-direction: column">` con tres partes: cabecera fija, cuerpo y pie fijo.

##### 16.2 Cabecera fija (pasos 1 a 4)

- **Layout:** `position: sticky; top: 0; z-index: 2; background: #FBF7F3; padding: 18px 20px 14px; border-bottom: 1px solid #EAE1D8; display: flex; flex-direction: column; gap: 14px`. Alto: 205 px a 1280 y 229 px a 390 en los pasos 1 a 3; en el paso 4, sin el temporizador, 155 px a 1280 y 179 px a 390.
- **Contenido en orden:**
  1. Fila (`display: flex; align-items: flex-start; gap: 12px`):
     - miniatura `<span role="img" aria-label="[Foto del evento]">`: 48 × 48, `border-radius: 12px`, fondo `radial-gradient(circle at 70% 30%, rgba(232,160,79,.9) 0, transparent 55%), radial-gradient(circle at 20% 80%, rgba(181,55,43,.8) 0, transparent 50%), #140E10`;
     - texto (`flex: 1; min-width: 0; line-height: 1.25`): `<h2 id="fe-co-title">` **"Compra tus boletas"** (Archivo 900, 1.2rem = 19,2 px, `letter-spacing: -0.02em`, mayúsculas; a 390 px se parte en "COMPRA TUS / BOLETAS") y **"Noche de salsa y boleros en vivo · Vie 9 oct · Galería Café Libro"** (bloque, .82rem = 13,12 px, #6E6259, `margin-top: 2px`);
     - botón **Cerrar** (`aria-label="Cerrar la compra"`): círculo de 44 px, `border: 0; background: #FFFFFF; color: #17120F`; X de 16 px (`M6 6l12 12M18 6 6 18`), trazo 2.4.
  2. Indicador de pasos (`<ol aria-label="Pasos de la compra">`): `list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr))`. Cada `<li aria-current="{step|false}">` (`position: relative; min-width: 0; display: flex; flex-direction: column; align-items: center; gap: 4px; text-align: center`) tiene:
     - conector a la derecha (pasos 1 a 3): `position: absolute; top: 12px; left: calc(50% + 19px); right: calc(-50% + 19px); height: 2px`, color #17120F si el paso ya está hecho y #D9CEC3 si no;
     - círculo de 26 × 26 px (`border-radius: 50%; box-sizing: border-box; border: 1.5px solid`; .78rem = 12,48 px; 700) con el número o, si el paso está hecho, un visto de 13 px y trazo 3;
     - rótulo (`max-width: 100%; font-size: .8rem` = 12,8 px; `white-space: nowrap; overflow: hidden; text-overflow: ellipsis`): "Boletas", "Datos", "Pago", "Listo".

     | Estado del paso | Fondo del círculo | Contenido / color | Borde | Rótulo |
     |---|---|---|---|---|
     | Hecho (`n < step`, o todos en el paso 4) | #B9E07A | visto, #17120F | #17120F | 500, #17120F |
     | Actual | #17120F | número, #FFFFFF | #17120F | **700**, #17120F |
     | Pendiente | #FFFFFF | número, #17120F | #D9CEC3 | 500, #6E6259 |

     En el paso 4 los cuatro aparecen hechos (con visto) y el 4.º lleva `aria-current="step"`.
  3. Temporizador (pasos 1 a 3): `<p>` con `display: flex; align-items: center; gap: 8px; background: #F6DC6A; border-radius: 12px; padding: 8px 12px; font-size: .84rem` (13,44 px). Lleva un cronómetro de 16 px (`circle 12,13 r 8` + `M12 9v4l2.5 1.5M9 2h6`, trazo 2.2) y **"Tus boletas están reservadas por <b>9:58</b>"**. El "9:58" es fijo: no corre (H3, H17).

##### 16.3 Cuerpo: paso 1 · Boletas

- **Layout del cuerpo (todos los pasos):** `position: relative; padding: 20px; display: flex; flex-direction: column; gap: 20px`. Paso 1: columna con `gap: 22px`.
- **Contenido en orden:**
  1. **Localidad** (`role="group" aria-labelledby="fe-co-loc"`, `gap: 8px`): `<h3 id="fe-co-loc">` **"Localidad"** (1rem, 700) y una opción por localidad (`aria-pressed`): `width: 100%; box-sizing: border-box; display: flex; align-items: center; gap: 12px; text-align: left; min-height: 62px; padding: 10px 14px; border-radius: 16px; border: 1.5px solid {#17120F / #EAE1D8}; background: {tinte / #FFFFFF}`. Dentro:
     - radio visual de 20 px con punto de 10 px;
     - texto (`flex: 1; min-width: 0; line-height: 1.25`): nombre completo en `<b>` de .92rem ("General", "Preferencial (mesa compartida)", "Mesa VIP para 4") y descripción en .76rem, #6E6259;
     - columna derecha (`text-align: right; line-height: 1.2`): precio en `<b>` de .92rem y línea de stock en .7rem, 700, #C23A24 ("Últimas 12") o #6E6259 ("Disponible").
  2. **¿Para quién?** (`role="group" aria-labelledby="fe-co-who"`, `gap: 8px`): `<h3>` **"¿Para quién?"** y un control segmentado (`display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 18px; padding: 5px`) con dos botones (`aria-pressed`; `min-height: 58px; border: 0; border-radius: 14px; padding: 8px 10px; line-height: 1.2`):
     - **"Solo para mí"** / **"Tú pagas y recibes las boletas"**;
     - **"Para mi parche"** / **"Elige quién va y dividan"**.

     El título va en `<b>` de .9rem y el subtítulo en .74rem con `margin-top: 2px`. Elegido: fondo #17120F, título #FFFFFF y subtítulo `rgba(255,255,255,.78)`. No elegido: fondo transparente, título #17120F y subtítulo #6E6259. Inicial: "Solo para mí".
  3. **Cantidad** (solo con "Solo para mí"): tarjeta `display: flex; align-items: center; justify-content: space-between; gap: 12px; background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 16px; padding: 12px 14px`. A la izquierda, **"Cantidad"** (`<b id="fe-co-qty">` de .95rem; **no** en mayúsculas, a diferencia de la tarjeta lateral) y **"{{qtyHint}}"** (.78rem, #6E6259). A la derecha, el mismo selector −/número/+ de la sección 12 (`role="group" aria-labelledby="fe-co-qty"`). Comparte el estado con la tarjeta lateral.
  4. **Bloque del parche** (solo con "Para mi parche"): tarjeta `background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 20px; padding: 16px; display: flex; flex-direction: column; gap: 14px`.
     - **Cabecera** (`display: flex; align-items: center; gap: 12px`):
       - avatar "SL" de 44 × 44, `border-radius: 12px`, #F6DC6A, Archivo 900, .9rem;
       - **"Salseros de jueves"** (`<b>` de .95rem) y **"12 miembros · elige quién va contigo"** (.8rem, #6E6259);
       - píldora **"{{peopleLine}}"** = "Van {1+k}" (`background: #FBF7F3; border-radius: 999px; padding: 4px 10px; font-size: .8rem; font-weight: 700`).
     - **Miembros** (`role="group" aria-label="Miembros del parche"`, `display: flex; flex-wrap: wrap; gap: 8px`). Un botón por miembro (`aria-label="{nombre completo}"`, `aria-pressed`, `disabled` cuando ya no hay cupo): `height: 44px; border-radius: 999px; padding: 0 12px 0 5px; display: flex; align-items: center; gap: 8px; border: 1.5px solid {#17120F elegido / #EAE1D8}; background: {#FBF7F3 elegido / #FFFFFF}; color: #17120F; font-size: .86rem; font-weight: 500`. Dentro van el avatar de 32 px (.7rem, 700, color del miembro), el nombre corto y, si está elegido, un visto de 14 px con trazo 3. Inicial: Laura elegida.
     - **Cupo** **"{{capLine}}"** (.78rem, #6E6259):
       - General y Preferencial: "Y 4 miembros más en el parche. Máximo 8 boletas por compra."
       - VIP: "Una mesa VIP es para 4: elige hasta 3 amigos. Y 4 miembros más en el parche."
     - **Interruptor** (`<button role="switch" aria-checked>`, `disabled` si no hay amigos elegidos): `display: flex; align-items: center; gap: 12px; width: 100%; text-align: left; min-height: 52px; background: transparent; border: 0; border-top: 1px solid #F1EAE3; padding: 12px 0 0; color: #17120F`.
       - Pista (`aria-hidden`): 46 × 28, `border-radius: 999px`, #D9CEC3 apagado y #C23A24 encendido.
       - Perilla: 22 px, #FFFFFF, `box-shadow: 0 1px 3px rgba(23,18,15,.3)`, `top: 3px`, `left` 3 px apagado y 21 px encendido. Salta sin transición.
       - Texto: **"Dividir el pago: cada uno paga su parte"** (`<b>` de .9rem) y **"Les llega su link de pago en el chat del parche"** (.76rem, #6E6259).
     - **Nota del pago dividido** (solo si está encendido y hay amigos): `display: flex; align-items: flex-start; gap: 10px; background: #FBF7F3; border-radius: 14px; padding: 12px 14px`, con globo de chat de 18 px (`margin-top: 2px`) y el párrafo (.86rem, `line-height: 1.45`): **"<b>Tú pagas 1 de {{splitN}} · {{shareFmt}}.</b> Cada amigo recibe un link de pago en el chat de Salseros de jueves y paga su parte sin salir de Fulleventos. Sus cupos quedan apartados por [PLAZO DE RESERVA]."**. Ejemplo: "Tú pagas 1 de 2 · $48.600." (H29 pide decir "solicitud de pago dentro de la app" en lugar de "link de pago").

##### 16.4 Cuerpo: paso 2 · Datos

- **Layout:** columna con `gap: 14px`.
- **Contenido en orden:**
  1. `<h3>` **"Tus datos"** (1rem) y **"La boleta sale a tu nombre. Ya llenamos lo que sabemos de tu perfil."** (.84rem, #6E6259, `margin: 2px 0 0`).
  2. Campos. Cada uno es un `<label>` con `display: flex; flex-direction: column; gap: 6px; font-weight: 700; font-size: .86rem` (13,76 px), color #17120F, que envuelve el control. Los controles miden `height: 48px; width: 100%; box-sizing: border-box; border: 1px solid #D9CEC3; border-radius: 12px; padding: 0 14px` (los `select`, `0 10px`); `font-size: 1rem; font-weight: 400; background: #FFFFFF; color: #17120F`.

     | Etiqueta | Control | Valor inicial | Placeholder | Atributos |
     |---|---|---|---|---|
     | "Nombre completo" | `input type="text"` | "Camila Vargas" | — | `autocomplete="name"` |
     | "Tipo de documento" | `select` (su `<label>` lleva `flex: 1 1 120px`) | "CC" | — | opciones: "CC" (`CC`), "CE" (`CE`), "Pasaporte" (`PA`) |
     | "Número de documento" | `input type="text"` (su `<label>` lleva `flex: 2 1 180px`) | vacío | "Sin puntos ni espacios" | `inputmode="numeric"` |
     | "Correo" | `input type="email"` | "camila.vargas@correo.co" | — | `autocomplete="email"` |
     | "Celular" | `input type="tel"` | "300 123 4567" | — | `autocomplete="tel"` |

     "Tipo de documento" y "Número de documento" comparten fila (`display: flex; flex-wrap: wrap; gap: 10px`). Ningún campo tiene `required`, `aria-required`, `aria-invalid` ni `aria-describedby` (H23).
  3. **Asistentes** (solo si la compra es para más de una persona): `display: flex; flex-direction: column; gap: 10px; padding-top: 14px; border-top: 1px solid #EAE1D8`. `<h3>` **"Asistentes"** y la pista **"{{attendeesHint}}"** (.84rem, #6E6259):
     - con pago dividido: "Tus amigos completan sus datos cuando pagan su parte.";
     - sin dividir: "Opcional. También lo puedes completar después desde Mis boletas."

     Luego una fila por cada asistente, de la boleta 2 a la última (el titular es la boleta 1):
     - **Si el asistente es un amigo del parche:** tarjeta `display: flex; align-items: center; gap: 12px; background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 14px; padding: 10px 12px`, con avatar de 36 px (.74rem), **"Boleta {n} · {nombre completo}"** (`<b>` de .9rem) y la nota (.78rem, #6E6259): "Lo completan ellos al pagar su parte" (con pago dividido) o "La boleta queda a su nombre" (sin dividir).
     - **Si no:** campo `<label>` **"Boleta {n} · Nombre del asistente"** con `input type="text"` y placeholder **"Opcional"** (mismo estilo de 48 px).

##### 16.5 Cuerpo: paso 3 · Pago

- **Layout:** columna con `gap: 16px`.
- **Contenido en orden:**
  1. **Medio de pago** (`role="group" aria-labelledby="fe-co-pay"`, `gap: 8px`): `<h3 id="fe-co-pay">` **"¿Cómo quieres pagar?"** y una rejilla `display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 8px` (3 columnas de 155 px a 1280; 2 de 159 px a 390). Cada medio es un botón (`aria-pressed`): `min-height: 92px; box-sizing: border-box; text-align: left; border-radius: 16px; border: 1.5px solid {#17120F / #EAE1D8}; box-shadow: {inset 0 0 0 1px #17120F / none}; background: #FFFFFF; padding: 12px; display: flex; flex-direction: column; align-items: flex-start; gap: 6px`. Elegido, el borde se ve de 2,5 px (1,5 de borde + 1 de sombra interior). Dentro:
     - fila superior (`justify-content: space-between; width: 100%`) con el ícono de 22 px (trazo 2) y un radio de 18 px (`border: 2px solid #17120F`) con punto de 8 px;
     - nombre en `<b>` de .88rem (`line-height: 1.2`);
     - descripción en .74rem, #6E6259, `line-height: 1.25`.

     Medios, en orden: "Nequi" / "Apruebas en tu app"; "PSE" / "Débito a tu cuenta bancaria"; "Tarjeta crédito/débito" / "Crédito a cuotas o débito"; "Daviplata" / "Apruebas en tu app"; "Botón Bancolombia" / "Desde tu cuenta Bancolombia". Inicial: ninguno elegido.
  2. **Panel del medio elegido** (solo uno a la vez):
     - **Tarjeta:** `border: 1.5px dashed #6E6259; border-radius: 18px; padding: 14px; background: #FFFFFF; display: flex; flex-direction: column; gap: 12px`.
       - Nota con candado de 16 px (.8rem, 700, `line-height: 1.35`): **"Campos seguros de [PASARELA] — tus datos de tarjeta no pasan por Fulleventos"**.
       - Campos: etiquetas de .84rem, controles de **46 px** con fondo **#FBF7F3** y sin `value` ni `onChange` (no guardan nada):

         | Etiqueta | Placeholder | Atributos |
         |---|---|---|
         | "Número de tarjeta" | "0000 0000 0000 0000" | `inputmode="numeric"`, `autocomplete="cc-number"` |
         | "Vence" | "MM/AA" | `inputmode="numeric"`, `autocomplete="cc-exp"` |
         | "Código de seguridad" | "CVV" | `inputmode="numeric"`, `autocomplete="cc-csc"` |
         | "Nombre como aparece en la tarjeta" | "CAMILA VARGAS" | `autocomplete="cc-name"` |
         | "Cuotas (solo crédito)" (`select`) | — | "1 cuota", "3 cuotas", "6 cuotas", "12 cuotas", "24 cuotas", "36 cuotas" |

         "Vence" y "Código de seguridad" comparten fila (`flex: 1 1 110px` cada uno). H19 pide cambiar estos campos por un recuadro "Aquí van los campos de [PASARELA]" (iframe o widget de la pasarela).
     - **PSE:** `background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 18px; padding: 14px; display: flex; flex-direction: column; gap: 12px`.
       - **"Banco"** (`select` de 46 px, fondo #FBF7F3): "Elige tu banco" (valor vacío), "Bancolombia", "Banco de Bogotá", "Davivienda", "BBVA", "Banco de Occidente", "Banco Popular", "Banco Caja Social", "Banco AV Villas", "Otro banco".
       - **"Tipo de persona"** (`role="group"`, rótulo .84rem 700): control segmentado (`display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; background: #FBF7F3; border-radius: 14px; padding: 4px`) con **"Natural"** y **"Jurídica"** (`aria-pressed`; `height: 40px; border: 0; border-radius: 10px; font-weight: 700; font-size: .86rem`). Elegido: #17120F con texto #FFFFFF. No elegido: transparente con texto #17120F. Inicial: "Natural".
       - Nota (.78rem, #6E6259): **"Tu banco te pide autorizar el débito en su ventana segura y vuelves aquí al terminar. La lista de bancos la entrega PSE."**
     - **Nequi / Daviplata:** misma tarjeta blanca. Campo `type="tel"` (`autocomplete="tel"`, 46 px, fondo #FBF7F3, valor inicial "300 123 4567") con la etiqueta **"Celular registrado en Nequi"** o **"Celular registrado en Daviplata"**. Debajo, una nota con campana de 16 px (.84rem): **"Te llegará una notificación a tu app Nequi para aprobar el pago."** o **"Te llegará una notificación en Daviplata para aprobar el pago."**
     - **Botón Bancolombia:** tarjeta blanca (.84rem) con **"Se abre la ventana segura de Bancolombia para que apruebes el pago desde tu cuenta, y vuelves aquí al terminar."**
  3. **Casilla de términos** (`<button role="checkbox" aria-checked>`): `display: flex; align-items: flex-start; gap: 10px; text-align: left; background: transparent; border: 0; padding: 4px 0; color: #17120F; font-size: .86rem; line-height: 1.4`.
     - Cuadro de 22 px (`border-radius: 6px; border: 2px solid`): sin marcar, borde #17120F y fondo #FFFFFF; marcada, borde y fondo #C23A24 con un visto blanco de 13 px y trazo 3.2.
     - Texto: **"<b>Acepto términos y política de datos.</b> Leí los [Términos y condiciones] de la compra y la [Política de tratamiento de datos] de Fulleventos y [BOLETERA]."**

     Arranca sin marcar.
  4. **Nota de procesamiento** (.78rem, #6E6259, `line-height: 1.4`, escudo con visto de 16 px): **"Tu pago se procesa por API con [BOLETERA] o con la pasarela de Fulleventos ([PASARELA]). No sales de Fulleventos."** (H1 y H17 piden quitar "No sales de Fulleventos").

##### 16.6 Cuerpo: paso 4 · Listo

- **Layout:** columna con `gap: 18px`. No hay temporizador ni pie fijo.
- **Contenido en orden:**
  1. **Confirmación** (`role="status"`, columna alineada a la izquierda, `gap: 6px`):
     - círculo de 52 px, #B9E07A, `border: 2px solid #17120F`, con visto de 26 px y trazo 2.6;
     - `<h3>` **"¡Listo, Camila! Nos vemos en la pista"** (Archivo 900, 1.55rem = 24,8 px, `letter-spacing: -0.03em; line-height: 1.05`, mayúsculas, `margin: 6px 0 0`);
     - párrafo **"{{doneMsg}}"** (15 px, #6E6259).
  2. **Boleta digital** (`<article aria-label="Tu boleta digital">`): `border-radius: 22px; overflow: hidden; background: #FFFFFF; box-shadow: 0 14px 34px rgba(23,18,15,.14)`.
     - **Parte superior:** `padding: 18px 18px 22px; color: #FFFFFF; background: radial-gradient(circle at 85% 20%, rgba(232,160,79,.6) 0, transparent 40%), radial-gradient(ellipse at 0% 100%, rgba(70,30,80,.7) 0, transparent 55%), #140E10; display: flex; flex-direction: column; gap: 10px`. Contiene:
       - una fila con la etiqueta **"Rumba · Vie 9 oct"** (#F6DC6A, Archivo 800, .78rem, mayúsculas, `padding: 3px 9px`) a la izquierda y **"Boleta oficial"** (.72rem, 700, `.1em`, mayúsculas, `rgba(255,255,255,.8)`) a la derecha;
       - el título **"Noche de salsa y boleros en vivo"** (Archivo 900, 1.35rem = 21,6 px, `line-height: 1.02`, mayúsculas, `letter-spacing: -0.03em`);
       - **"Viernes 9 de octubre 2026 · Puertas 8:00 p. m. · Galería Café Libro, Zona T, Bogotá"** (.84rem, `rgba(255,255,255,.88)`).
     - **Perforación** (`aria-hidden`): `height: 0; border-top: 2px dashed #D9CEC3; margin: 0 18px`, con dos círculos de 24 px del color del fondo de la ventana (#FBF7F3) en `left: -30px` y `right: -30px`, `top: -13px`. Dibujan las muescas de la boleta en los bordes.
     - **Parte inferior:** `padding: 18px; display: flex; flex-wrap: wrap; gap: 16px; align-items: center`.
       - Datos (`flex: 1 1 180px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px 14px; line-height: 1.25`), con rótulos de .68rem (10,88 px), 700, `.1em`, mayúsculas, #6E6259, y valores en `<b>` de .92rem: **"Localidad"** → `tkLoc`; **"Cantidad"** → `tkQty`; **"Titular"** (ocupa las 2 columnas) → `tkHolder`; **"Orden"** (2 columnas) → **"#FE-2026-10-00421"** (fijo).
       - QR (`flex: 0 0 auto`, columna centrada, `gap: 6px`): `<div role="img" aria-label="[QR de la boleta] · dibujo decorativo, no es un código real">` de 124 × 124 px (`padding: 7px; box-sizing: border-box; border: 1px solid #EAE1D8; border-radius: 10px; display: grid`, 17 × 17 celdas) y la leyenda **"[QR de la boleta]"** (.7rem, #6E6259). A 390 px el QR baja debajo de los datos.
     - **Pie de la boleta:** `margin: 0; padding: 10px 18px; background: #FBF7F3; border-top: 1px solid #EAE1D8; font-size: .74rem; color: #6E6259`: **"Emitida por [BOLETERA] · Un ingreso por persona · Presenta tu documento"**.
  3. **Pagos de tu parche** (solo con pago dividido): tarjeta blanca (`border-radius: 18px; padding: 14px 16px; gap: 10px`) con **"Pagos de tu parche"** (`<b>` de .92rem) y una fila por amigo: avatar de 34 px (.72rem), nombre (.9rem, 700) y la píldora **"Link enviado · pendiente"** (#F6DC6A, `border-radius: 999px; padding: 3px 10px; font-size: .74rem; font-weight: 700`).
  4. **Acciones** (columna, `gap: 8px`):
     - enlace **"Avisar a mi parche"**: 52 px, `border-radius: 999px; background: #C23A24; color: #FFFFFF`, 700, .98rem, globo de chat de 18 px;
     - fila (`display: flex; flex-wrap: wrap; gap: 8px`) con el botón **"Agregar al calendario" → "Agregado al calendario"** (`aria-pressed`; `flex: 1 1 180px; height: 48px; border-radius: 999px; border: 1px solid #17120F`; fondo #FFFFFF → #17120F y texto #17120F → #FFFFFF; .9rem, 700; calendario de 16 px) y el enlace **"Ver mis boletas"** (`flex: 1 1 160px`; 48 px; borde #17120F; fondo #FFFFFF; .9rem, 700; ícono de boleta de 16 px).
  5. Línea de correo (.82rem, #6E6259, sobre de 16 px): **"{{emailLine}}"** = "La boleta también te llega al correo " + correo + ".".
  6. Botón **"Volver al evento"**: `align-self: center; height: 44px; border: 0; background: transparent; padding: 0 16px; font-weight: 700; color: #17120F; text-decoration: underline; text-underline-offset: 3px`. No fija tamaño de letra (13,33 px).

##### 16.7 Pie fijo: resumen y botones (pasos 1 a 3)

- **Layout:** `position: sticky; bottom: 0; z-index: 2; background: #FFFFFF; border-top: 1px solid #EAE1D8; padding: 14px 20px 18px; display: flex; flex-direction: column; gap: 12px`. Alto: 174 px sin pista ni fila de pago dividido, 201 px con pista y 215 px con la fila "Tú pagas 1 de N" (medido a 1280 y 390).
- **Contenido en orden:**
  1. Resumen (`role="group" aria-label="Resumen de la compra"`, columna, `gap: 4px; font-size: .86rem`):
     - **"{{sumLine}}"** (#6E6259) y **"{{subtotalFmt}}"**, a los lados (`justify-content: space-between`). Ejemplo: "2 × General ($45.000)" … "$90.000".
     - **"Cargo por servicio (8%)"** (#6E6259) … **"{{feeFmt}}"**. Ejemplo: "$7.200".
     - **"Total"** … **"{{totalFmt}}"**, en 1rem y 700, con `padding-top: 4px`. Ejemplo: "$97.200".
     - Con pago dividido, una fila resaltada (`background: #F6DC6A; border-radius: 10px; padding: 6px 10px; margin-top: 4px`): **"Tú pagas 1 de {{splitN}}"** … **"<b>{{shareFmt}}</b>"**. Ejemplo: "Tú pagas 1 de 2" … "$48.600".
  2. Botones (`display: flex; align-items: center; gap: 10px`):
     - **"Atrás"** (solo en los pasos 2 y 3): `height: 52px; border: 0; background: transparent; padding: 0 14px; font-weight: 700; color: #17120F`, sin tamaño de letra (13,33 px);
     - botón principal **"{{nextLabel}}"**: `flex: 1; height: 52px; border: 0; border-radius: 999px; background: #C23A24; color: #FFFFFF; font-weight: 700; font-size: 1rem; display: flex; align-items: center; justify-content: center; gap: 8px`, con una flecha de 16 px y trazo 2.4 (`M5 12h14M13 6l6 6-6 6`) **después** del texto. Textos: paso 1 "Continuar"; paso 2 "Continuar al pago"; paso 3 "Pagar {cop(share)}" (por ejemplo "Pagar $97.200" o "Pagar $48.600"). Se deshabilita (`disabled`, opacidad .45) cuando falta algo.
  3. Pista (solo cuando el botón está deshabilitado): `<p>` con `margin: -4px 0 0; text-align: center; font-size: .78rem; color: #6E6259` y el mensaje de validación (ver "Estados e interacciones").

### Datos de ejemplo

**Evento (texto fijo en la plantilla):**

| Campo | Valor |
|---|---|
| Nombre | "Noche de salsa y boleros en vivo" |
| Categoría | "Rumba" |
| Fecha | Viernes 9 de octubre de 2026 ("Vie 9 oct", "Viernes 9 de octubre", "2026 · este viernes") |
| Horas | Puertas 8:00 p. m.; clase 8:30 p. m.; show 9:30 p. m.; DJ 1:00 a. m. |
| Lugar | "Galería Café Libro", "Zona T, Bogotá", "[DIRECCIÓN]" |
| Edad | "+18" — "Con documento original" |
| Precio desde | $45.000 |
| Estado de venta | "En venta" |
| Van / interesados | 186 (+1 con "Voy") / 340 |
| Etiquetas | Salsa, Boleros, Música en vivo, Clase gratis, Zona T |
| Organizador | "Galería Café Libro", iniciales "GC", "12,4 mil seguidores" |
| Fotos de ediciones pasadas | 128 |
| Orden | "#FE-2026-10-00421" |
| Temporizador | "9:58" |
| Cargo por servicio | 8 % |
| Marcadores a llenar | [NOMBRE DE LA ORQUESTA], [NÚMERO DE MÚSICOS], [NOMBRE DEL PROFESOR O ACADEMIA], [NOMBRE DEL DJ], [HORA DE CIERRE], [CONFIRMAR DISTRIBUCIÓN CON EL ORGANIZADOR], [CONSUMO INCLUIDO], [CONFIRMAR CON EL ORGANIZADOR], [POLÍTICA DE LA BOLETERA], [DIRECCIÓN], [BOLETERA], [PASARELA], [PLAZO DE RESERVA], [Términos y condiciones], [Política de tratamiento de datos] |

En los datos compartidos de Agenda, Bienvenida, Main y Mapa este evento es `e1` (`city: 'bogota'`, `d: 9`, `v: 'Galería Café Libro · Zona T'`, `p: 45000`, `b: 'TuBoleta'`, `bg1: '#E8A04F'`, `bg2: '#B5372B'`). El Chat le da `hour: '8:00 p. m.'` y `left: 3`.

**Localidades (`LOCS`, `:903-907`):**

| id | name | full | short | price | per | desc | stockLine | hot | max | seats | swatch | tint |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `general` | General | General | General | 45000 | por persona | De pie · acceso a pista y barra | Disponible | false | 8 | 1 | #B9E07A | #E8F4D6 |
| `pref` | Preferencial | Preferencial (mesa compartida) | Preferencial | 70000 | por persona | Silla en mesa compartida, cerca de la pista | Últimas 12 | true | 8 | 1 | #A3A8F0 | #E3E5FB |
| `vip` | Mesa VIP para 4 | Mesa VIP para 4 | Mesa VIP | 320000 | por mesa | Mesa junto al escenario · [CONSUMO INCLUIDO] | Disponible | false | 1 | 4 | #F6DC6A | #FBF1C6 |

**Miembros del parche "Salseros de jueves" para la compra (`MEMBERS`, `:909-917`; el comentario dice "12 en total contando a Camila"):**

| id | ini | color | name | short |
|---|---|---|---|---|
| `lm` | LM | #F3B27E | Laura Martínez | Laura |
| `ar` | AR | #A3A8F0 | Andrés Ramírez | Andrés |
| `sc` | SC | #EE93BC | Sofía Cárdenas | Sofía |
| `jp` | JP | #B9E07A | Juan Pablo Rojas | Juan Pablo |
| `mg` | MG | #F6DC6A | María F. Gómez | María F. |
| `dt` | DT | #8FD3D0 | Daniel Torres | Daniel |
| `vq` | VQ | #A3A8F0 | Valentina Quintero | Valentina |

**Medios de pago (`METHODS`, `:918-924`):**

| id | name | desc | Ícono (`d` del `path`) |
|---|---|---|---|
| `nequi` | Nequi | Apruebas en tu app | celular: `M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM11 18h2` |
| `pse` | PSE | Débito a tu cuenta bancaria | banco: `M3 10h18M5 10v7M9.5 10v7M14.5 10v7M19 10v7M3 20h18M12 3l9 5H3z` |
| `card` | Tarjeta crédito/débito | Crédito a cuotas o débito | tarjeta: `M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM2 10h20M6 15h4` |
| `davi` | Daviplata | Apruebas en tu app | celular (igual a Nequi) |
| `bcol` | Botón Bancolombia | Desde tu cuenta Bancolombia | banco (igual a PSE) |

**Bancos PSE (`:734-743`):** `""` "Elige tu banco"; `bancolombia` "Bancolombia"; `bogota` "Banco de Bogotá"; `davivienda` "Davivienda"; `bbva` "BBVA"; `occidente` "Banco de Occidente"; `popular` "Banco Popular"; `cajasocial` "Banco Caja Social"; `avvillas` "Banco AV Villas"; `otro` "Otro banco". (Según el propio texto, en producción la lista la entrega PSE.)

**Tipos de documento:** `CC` "CC", `CE` "CE", `PA` "Pasaporte" (H23 y H10 piden agregar PPT y, donde aplique, TI). **Cuotas:** 1, 3, 6, 12, 24, 36 ("1 cuota", "3 cuotas", …).

**Parches del evento (`parches`, `:1099-1102`):**

| id | ini | color | name | desc | used | max | Cupos / barra iniciales |
|---|---|---|---|---|---|---|---|
| `g1` | SL | #F6DC6A | Salseros de jueves | Laura M. · Pre en la casa de Laura a las 7:30, luego caminamos | 6 | 8 | "6 de 8 cupos" / 75 % |
| `g2` | PN | #EE93BC | Primera vez bailando | Mafe G. · Para los que llegan a la clase de 8:30 | 3 | 10 | "3 de 10 cupos" / 30 % |
| `g3` | UB | #A3A8F0 | Uber compartido desde Suba | Daniel T. · Salimos 8:15 p. m. | 3 | 4 | "3 de 4 cupos" / 75 % |

**Muro (`wall`, `:1119-1123`):**

| ini | color | name | time | text |
|---|---|---|---|---|
| SC | #EE93BC | Sofía Cárdenas | hace 20 min | ¿Alguien sabe si hay guardarropa? Voy saliendo del trabajo. |
| LM | #F3B27E | Laura Martínez | hace 1 h | La última vez tocaron hasta las 2. Lleven zapatos cómodos. |
| AR | #A3A8F0 | Andrés Ramírez | hace 3 h | Me apunto al parche de Laura. ¿Hay que llevar algo? |

**"Quién va" (fijo):** LM #F3B27E, AR #A3A8F0, SC #EE93BC, MG #F6DC6A y "+9" #17120F.

**Programación:** ver la tabla de la sección 7.

**Políticas (`politicas`, `:1136-1143`), con el `d` de cada ícono:**

| t | c | d |
|---|---|---|
| Documento original | #A3A8F0 | `M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM6 10a2 2 0 1 0 4 0a2 2 0 1 0-4 0M5 16c.6-1.4 1.7-2 3-2s2.4.6 3 2M14 10h5M14 14h4` |
| No hay reingreso | #EE93BC | `M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18zM5.6 5.6l12.8 12.8` |
| Parqueadero | #8FD3D0 | `M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM9 17V7h4a3 3 0 0 1 0 6H9` |
| Accesibilidad | #B9E07A | `M10.5 4.5a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0M5 8l7 1 7-1M12 9v5l-3 6M12 14l3 6` |
| Boleta digital | #F6DC6A | `M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 18h2v2h-2zM14 18h2M18 14h2` |
| Cambios y devoluciones | #F3B27E | `M20 11a8 8 0 0 0-14.9-4M4 4v4h4M4 13a8 8 0 0 0 14.9 4M20 20v-4h-4` |

(Los textos están en la tabla de la sección 10.)

**Planes parecidos (`similares`, `:1146-1153`; coinciden con `e10`, `e7` y `e13` de Agenda):**

| id | t | cat | city → cityName | d | v | p → priceLabel | bg1 | bg2 |
|---|---|---|---|---|---|---|---|---|
| `e10` | Viejoteca de salsa caleña | Rumba | cali → Cali | 10 | Juanchito | 40000 → "Desde $40.000" | #F3B27E | #8A2E1F |
| `e7` | Noche de reguetón en Provenza | Rumba | medellin → Medellín | 9 | Barrio Provenza · El Poblado | 50000 → "Desde $50.000" | #6B3FA0 | #0E0A1A |
| `e13` | Noche de champeta en Getsemaní | Rumba | cartagena → Cartagena | 9 | Plaza de la Trinidad · Getsemaní | 30000 → "Desde $30.000" | #EE93BC | #4A1A3A |

**Recuerdos (6 cuadros, en orden):**
1. `radial-gradient(circle at 30% 30%, #F6DC6A 0, transparent 50%), #B5372B`
2. `radial-gradient(circle at 70% 40%, #EE93BC 0, transparent 55%), #5A2340`
3. `radial-gradient(circle at 50% 70%, #F3B27E 0, transparent 50%), #2A1A16`
4. `radial-gradient(circle at 60% 30%, #A3A8F0 0, transparent 50%), #1E1630`
5. `radial-gradient(circle at 40% 60%, #F3B27E 0, transparent 55%), #8A2E1F`
6. `radial-gradient(circle at 70% 70%, #EE93BC 0, transparent 50%), #140E10`

**Patrón del QR (`QR`, `:926-932`; 17 filas de 17 celdas; "1" = #17120F, "0" = transparente; decorativo, no es un código):**
```
11111110001111111
10000010001000001
10111010101011101
10111010101011101
10111010001011101
10000010101000001
11111110101111111
00000000100000000
10010011101101011
00000000001000001
11111110010101011
10000010101101100
10111010101000100
10111010000000100
10111010001111111
10000010111001101
11111110010100010
```

**Datos de la compradora (paso 2):** "Camila Vargas", CC, documento vacío, "camila.vargas@correo.co", "300 123 4567". El nombre de la tarjeta usa el placeholder "CAMILA VARGAS".


---
Ver también: [5. Responsive](../05-responsive.md) · [6. Estados interactivos](../06-estados-interactivos.md) · [8. Detalles finos](../08-detalles-finos.md)
