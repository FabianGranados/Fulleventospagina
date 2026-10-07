[← Índice del handoff](README.md)

## 7. Componentes: qué reutilizar del código base y qué crear

Este catálogo dice qué piezas del **código base del cliente** (`diseno/referencia/preview-demo.html`) se reutilizan tal cual, cuáles se reutilizan con cambios y cuáles hay que **crear nuevas** para construir las 8 pantallas del prototipo (`diseno/prototipo/*.dc.html`). Todo valor sale del código; lo que se midió en Chromium con el arnés (`tools/dcharness.js`) se marca como **(medido)**. Lo que el prototipo no diseñó se marca como **No diseñado** y, cuando la auditoría (`docs/auditoria-2026-10-07.md`) lo exige, se cita el hallazgo (H#). Las correcciones que la auditoría pide para el prototipo son **obligatorias** en la implementación.

**Cómo leer las referencias:** `Pantalla.dc.html:línea` apunta al código del prototipo; "original" o "código base" es `preview-demo.html`. Los textos entre comillas son exactos (mayúsculas, tildes y marcadores `[ASÍ]` incluidos). Cuando un texto se arma en JavaScript se da la plantilla con `{llaves}` y un ejemplo.

**Capturas.** Todas las capturas de `diseno/capturas/` coinciden con el código actual (`agenda-repost.jpg` y `mapa-medellin.jpg` se volvieron a tomar al cerrar este documento). Si alguna vez una captura y el código no coinciden, manda el código.

**Tokens que usan los componentes.**

Los nombres con `--` existen en el `:root` del código base; los marcados con *(sugerido)* no existen allí y son nombres propuestos para colores que el prototipo usa en línea; los marcados con *(sin token)* son colores puntuales de un solo componente que el prototipo escribe en línea (se pueden dejar locales al componente).

| Token | Valor | Uso en componentes |
|---|---|---|
| `--bg` | `#FBF7F3` | Fondo de página, campos, fondos suaves de botones de cerrar |
| `--surface` | `#FFFFFF` | Tarjetas, paneles, chips apagados |
| `--ink` | `#17120F` | Texto, botones oscuros, estado presionado |
| `--muted` | `#6E6259` | Texto secundario (5,91:1 sobre blanco; 5,54:1 sobre `--bg`) |
| `--line` | `#EAE1D8` | Bordes de tarjetas y chips (1,29:1 sobre blanco, decorativo) |
| *(sugerido)* `--line-soft` | `#F1EAE3` | Separadores internos de tarjeta y listas |
| *(sugerido)* `--field-line` | `#D9CEC3` | Borde de campos de formulario (Registro y checkout), pasos pendientes, pista del interruptor apagado |
| `--brand` | `#D9452F` | **Solo el logo** (blanco sobre `#D9452F` = 4,34:1, no sirve para texto pequeño) |
| *(sugerido)* `--action` | `#C23A24` | Botones rojos, antetítulos, categoría, insignias de no leídos, foco (blanco encima = 5,35:1; sobre `--bg` = 5,02:1) |
| `--brand-hover` | `#BF3923` | Hover del original (`.go`, `.ticket`); el prototipo no lo usa |
| `--yellow` | `#F6DC6A` | Etiquetas, contadores encendidos, pines, temporizador |
| `--peach` | `#F3B27E` | Degradado del titular, avatar `c1` |
| `--pink` | `#EE93BC` | Degradado del titular, avatar `c3` |
| *(sugerido)* `--lilac` | `#A3A8F0` | Avatar `c2`, íconos de datos clave |
| *(sugerido)* `--green` | `#B9E07A` | Avatar `c4`, "En venta", "Tiene boleta", paso hecho |
| *(sugerido)* `--aqua` | `#8FD3D0` | Avatar `c6` (Camila "CV") |
| `--hero` | `#140E10` | Fondos oscuros (héroe, mapa, boleta) |
| *(sugerido)* `--on-dark-muted` | `#D8CEC6` | Texto secundario sobre fondo oscuro (12,0:1 sobre `#17120F`) |
| *(sugerido)* `--count-off` | `#F3ECE5` | Fondo del contador de chip apagado y del relleno de encuesta |
| *(sin token)* tintes de localidad | `#E8F4D6` (General), `#E3E5FB` (Preferencial), `#FBF1C6` (Mesa VIP) | Zona no elegida del plano y opción de localidad elegida (N30, N39); los colores llenos de cada localidad son `#B9E07A`, `#A3A8F0` y `#F6DC6A` |
| *(sin token)* aviso de compra | `#F1F8E6` (borde `#B9E07A`) | Aviso "Tienes {n} boletas" de la tarjeta de compra (N35) |
| *(sin token)* pista de baile | rayas `#FCE9F2` / `#F8DCEA`, borde punteado `#EE93BC` | Plano de localidades (N30) |
| *(sin token)* calificación | `#E0A21B` (estrellas, Main; 2,25:1 sobre blanco) y `#8A5A00` ("4 de 5", Perfil; 5,93:1) | N66 |
| *(sin token)* texto sobre franja oscura | `#E2D8D0` | Ciudad y mes en los recuerdos del perfil (N65) |
| *(sin token)* deshabilitado de Registro | `#B9AEA4` | Fondo de "Continuar" deshabilitado (2,18:1 con blanco) y borde punteado de "Buscar amigos en mis contactos" (N59) |
| *(sin token)* mapa de ubicación | `#EDE5DC` con calles `#FFFFFF` | Marcador del mapa del evento (N33) |
| *(sin token)* mapa de Colombia | silueta `#2E2220` con borde `#8A6A55` (Mapa, Main) o `#2B2124` con borde `#F3B27E` al 60 % (Bienvenida); ríos `#8FD3D0` (opacidad .32 y .26); mares `#7FA3A6`; países `#9C8B80` | N20, N21 |
| *(sin token)* fondos de foto de ejemplo | `#2A1A16` | Noticia destacada (Bienvenida) y portada del perfil |
| `--display` | `'Archivo', 'Arial Black', 'Helvetica Neue', sans-serif` (800 y 900) | Titulares, cifras, iniciales de parches |
| `--ui` | `'DM Sans', system-ui, -apple-system, 'Segoe UI', sans-serif` (400, 500, 700) | Todo lo demás |

El prototipo escribe la pila corta `'DM Sans', system-ui, sans-serif` y `'Archivo', sans-serif`; en producción usar las pilas completas del código base. Tamaño de letra base: **16 px** en Bienvenida y Registro, **15 px** en Main, Agenda, Mapa, Evento, Chat y Perfil (las medidas en `rem` siempre se calculan sobre 16 px del `html`). `line-height` base 1.5.

**Reglas transversales (aplican a todos los componentes).**

- **R1 · Hover.** El prototipo solo tiene `a{color:#17120F;text-decoration:none} a:hover{color:#C23A24}`. Por eso: los enlaces **sin** `color` en línea pasan a `#C23A24` al pasar el mouse (texto e íconos con `currentColor`, incluidas las iniciales de avatares enlazados); los enlaces **con** color en línea no cambian; **ningún `<button>` ni tarjeta tiene hover** (solo `cursor: pointer`). Los bordes inferiores de los enlaces subrayados siguen `#17120F`. El código base sí tenía hover en `.go`/`.ticket` (`#BF3923`), `.btn-dark` (`#33291F`), `.btn-light` (`#F3ECE6`), `.chip` (borde `--ink`), `.join` (relleno `--ink`), `.more` (texto y borde `--brand`) y `.card` (sube 3 px con sombra). Recuperarlos es una decisión abierta: si se recuperan, usar `#C23A24` en lugar de `--brand` para rellenos con texto blanco y respetar `prefers-reduced-motion`. Las iniciales que se ponen rojas al hover (efecto lateral de R1) no parecen intencionales: limitar el rojo al texto.
- **R2 · Foco.** Evento, Chat y Mapa tienen `button:focus-visible, a:focus-visible, select:focus-visible{outline:3px solid #C23A24; outline-offset:2px}` (Evento y Chat también `input:focus-visible`); Mapa cambia el color a `#F6DC6A` dentro del panel oscuro (`[data-fe~="dark"] button:focus-visible`). Bienvenida, Registro, Main, Agenda y Perfil usan el foco por defecto del navegador (**(medido)** `outline: auto 1px`). Los campos con `outline: 0` en línea no muestran foco (H51, 13 campos). **Obligatorio:** una sola regla global de foco (3 px `#C23A24`, separación 2 px; amarillo `#F6DC6A` sobre fondos oscuros) y borde de 2 px `#C23A24` con `:focus-within` en los campos (H51).
- **R3 · Deshabilitado.** Tres estilos distintos hoy (ver "Inconsistencias"). **Obligatorio (H7):** en Continuar, Pagar, Enviar, Acercar y Quitar usar `aria-disabled="true"` en lugar de `disabled`, conservar la validación al hacer clic y mostrar el motivo.
- **R4 · Alternar.** Todo botón que alterna lleva `aria-pressed="true|false"` y cambia su texto y colores (patrón del original `.save`/`.join`/`.chip`). Las opciones excluyentes (localidad, "¿Para quién?", medio de pago, tipo de persona, fecha) deben ser grupos de radio (`fieldset`/`legend` o `role="radiogroup"`), no botones de alternar (H59).
- **R5 · Movimiento.** Solo Mapa y Chat tienen transiciones, marcadas con `data-fx` y anuladas con `@media (prefers-reduced-motion: reduce){[data-fx]{transition:none !important}}`. Toda transición nueva debe respetar esa preferencia.
- **R6 · Objetivos táctiles.** Los botones del prototipo miden de 36 a 54 px. Excepciones: los pines del mini-mapa de la landing son enlaces de 20 a 26 px (`clamp(20px, 6.5cqw, 26px)`, H60) y varios enlaces son solo texto ("Ver localidades", "Ver parches", "Entrar", "Ver en mi feed"). No bajar de 36 px; preferir 44 px en celular.
- **R7 · Fotos.** Todas las fotos son marcadores con degradado `radial-gradient(circle at 70% 30%, {bg1} 0, transparent 55%|58%), {bg2}` y etiqueta accesible "[Foto del evento]" (o similar). En producción se reemplazan por imágenes reales con `alt` descriptivo; el degradado sirve de color de carga.

### Resumen

| Componente | Estado | Clase o código original | Pantallas donde aparece |
|---|---|---|---|
| Tokens de color y tipografía | Reutilizar con cambios | `:root` | Las 8 |
| Contenedor de ancho máximo | Reutilizar con cambios | `.wrap` | Las 8 |
| Encabezado fijo (base) | Reutilizar con cambios | `.top` | Bienvenida, Main, Agenda, Mapa, Evento, Chat (Perfil y Registro sin fijar) |
| Logo | Reutilizar tal cual (tamaño a unificar) | `.logo` | Las 8 |
| Buscador con ciudad | Reutilizar con cambios | `.search`, `.city`, `.go` | Bienvenida, Main, Agenda, Mapa, Chat |
| Navegación de visitante (texto) | Reutilizar con cambios | `.nav` | Bienvenida |
| Botón oscuro | Reutilizar con cambios | `.btn-dark` | Bienvenida, Main, Agenda, Mapa, Chat, Registro, Evento, Perfil |
| Bloque héroe oscuro | Reutilizar con cambios | `.hero` | Bienvenida, Registro, Evento (y base de los bloques oscuros de Bienvenida, Main, Mapa, boleta) |
| Nota de foto | Reutilizar con cambios | `.photo-note` | Bienvenida, Evento |
| Etiqueta amarilla | Reutilizar con cambios | `.tag` | Bienvenida, Registro, Evento, Main, Mapa |
| Titular con franjas en degradado | Reutilizar con cambios | `.headline span` | Bienvenida, Registro, Evento |
| Pie del héroe | Reutilizar con cambios | `.hero-foot` | Bienvenida |
| Botón claro | Reutilizar con cambios | `.btn-light` | Bienvenida |
| Prueba social con avatares / avatar | Reutilizar con cambios | `.friends`, `.avs`, `.av`, `.c1`–`.c6` | Las 8 (avatar), Bienvenida (prueba social) |
| Sección con espaciado | Reutilizar con cambios | `section.block` | Bienvenida |
| Cabecera de sección | Reutilizar tal cual (con variantes) | `.sec-head` | Bienvenida, Agenda, Mapa, Evento |
| Antetítulo | Reutilizar con cambios | `.eyebrow` | Bienvenida, Agenda, Mapa, Main, Evento, Chat |
| Título de sección | Reutilizar con cambios | `h2` | Bienvenida, Agenda, Mapa, Evento, Registro, Perfil |
| Enlace subrayado | Reutilizar con cambios | `.more` | Bienvenida, Agenda, Evento, Registro |
| Nota "Contenido de ejemplo" | Reutilizar tal cual | `.sample` | Bienvenida, Main |
| Rejilla noticias + gente | Reutilizar con cambios | `.pulse` | Bienvenida (sin la columna de gente) |
| Rejilla de noticias | Reutilizar con cambios | `.news` | Bienvenida |
| Noticia destacada | Reutilizar con cambios | `.feature` | Bienvenida |
| Antetítulo de noticia | Reutilizar con cambios | `.kicker` | Bienvenida |
| Metadatos | Reutilizar con cambios | `.meta` | Bienvenida |
| Lista de noticias | Reutilizar con cambios | `.news-list`, `.news-item` | Bienvenida |
| Actividad de amigos y "Me uno" | Reutilizar con cambios (se convierte en fila de persona y botones de sumarse) | `.people`, `.act`, `.join` | Main, Registro, Evento, Perfil |
| Fila de chips de filtro | Reutilizar con cambios | `.chips`, `.chip` | Bienvenida, Agenda, Mapa, Main, Registro, Evento, Chat |
| Rejilla de tarjetas | Reutilizar con cambios | `.grid` | Bienvenida, Agenda, Perfil, Evento |
| Tarjeta de evento | Reutilizar con cambios | `.card`, `.img`, `.body` | Bienvenida, Agenda, Mapa, Main, Evento, Perfil, Chat |
| Placa de fecha | Reutilizar con cambios | `.date` | Bienvenida, Agenda, Mapa, Main, Evento, Perfil, Chat |
| Botón Guardar | Reutilizar con cambios | `.save` | Bienvenida, Agenda, Mapa (Main lo cambia por marcador) |
| Categoría | Reutilizar con cambios | `.cat` | Bienvenida, Agenda, Mapa, Main, Evento, Perfil, Chat |
| Título de tarjeta | Reutilizar con cambios | `.card h3` | Bienvenida, Agenda, Mapa, Evento, Perfil |
| Lugar | Reutilizar con cambios | `.where` | Bienvenida, Agenda, Mapa, Main, Evento, Perfil |
| Amigos que van | Reutilizar con cambios | `.going` | Bienvenida, Agenda, Main |
| Fila de precio y compra | Reutilizar con cambios | `.buy`, `.price` | Bienvenida, Agenda, Mapa, Evento |
| Botón de compra | Reutilizar con cambios | `.ticket` | Bienvenida, Agenda, Mapa (y CTA rojos en general) |
| Estado vacío | Reutilizar con cambios | `.empty` | Bienvenida, Agenda, Main, Mapa, Chat |
| Pie de página | Reutilizar con cambios (texto legal nuevo + H5) | `footer` | Bienvenida, Agenda, Mapa, Evento (Main como párrafo; Registro, Chat y Perfil sin pie) |
| Foco visible | Reutilizar con cambios | `:focus-visible` | Las 8 |
| Puntos de quiebre | Reutilizar con cambios (reemplazados por `flex-wrap` y rejillas automáticas) | `@media` 1080/820/520 | Las 8 |
| Movimiento reducido | Reutilizar con cambios | `@media (prefers-reduced-motion)` | Mapa, Chat (y toda transición nueva) |
| Datos de eventos | Reutilizar con cambios (modelo nacional) | arreglo `events` | Bienvenida, Agenda, Mapa, Main (copias parciales en Evento, Chat, Perfil) |
| Formato de pesos | Reutilizar con cambios | `cop()` | Bienvenida, Agenda, Mapa, Evento, Chat |
| Render y filtro de la agenda | Reutilizar con cambios | `render(filter)` | Bienvenida, Agenda, Mapa |
| Filtros por chip | Reutilizar con cambios | listeners de `.chip` | Bienvenida, Agenda, Mapa, Main, Chat |
| Alternadores Guardar / Me uno | Reutilizar con cambios | listener de `.save, .join` con `aria-pressed` | Todas las de sesión |
| N1 Encabezado con sesión (y variantes) | Nuevo | — (parte de `.top`) | Main, Agenda, Mapa, Chat, Evento, Perfil |
| N2 Encabezado de visitante | Nuevo (deriva de `.top` + `.nav`) | `.top`, `.nav` | Bienvenida |
| N3 Encabezado mínimo de registro | Nuevo | — | Registro |
| N4 Selector de ciudad | Nuevo (reemplaza `.city`) | `.city` | Bienvenida, Main, Agenda, Mapa, Chat |
| N5 Navegación por íconos con insignia | Nuevo | — | Main, Agenda, Mapa, Chat, Evento, Perfil |
| N6 Insignia de conteo y etiqueta "Nuevo" | Nuevo | — | Main, Agenda, Mapa, Chat, Evento, Perfil, Bienvenida |
| N7 Barra lateral de perfil (cuenta, secciones, tus parches) | Nuevo | — | Main |
| N8 Historias | Nuevo | — | Main |
| N9 Compositor de publicación | Nuevo | — | Main |
| N10 Pestañas de filtro del feed | Nuevo (deriva de `.chip`) | `.chip` | Main |
| N11 Franja de ciudad del feed | Nuevo | — | Main |
| N12 Publicación del feed con evento adjunto | Nuevo | — | Main |
| N13 Bloque de parche con barra de cupos | Nuevo | — | Main, Evento, Chat |
| N14 Columna "Descubre" (Tu semana, mini-mapa, gente, tendencias) | Nuevo | — | Main |
| N15 Tarjeta de evento del marketplace con repost | Nuevo (variante de `.card`) | `.card` | Agenda |
| N16 Ventana de repost | Nuevo | — | Agenda |
| N17 Aviso (toast) | Nuevo | — | Agenda |
| N18 Filtros de ciudad con conteo | Nuevo (variante de `.chip`) | `.chip` | Bienvenida, Agenda, Mapa (ranking) |
| N19 Control segmentado | Nuevo | — | Agenda, Mapa, Chat, Evento |
| N20 Mapa de Colombia con pines y zoom | Nuevo | — | Mapa |
| N21 Mini-mapas | Nuevo | — | Bienvenida, Main |
| N22 Lista de resultados del mapa (tarjeta compacta) | Nuevo | — | Mapa |
| N23 Ranking "Ciudades con más planes" | Nuevo | — | Mapa |
| N24 Bloques de la landing (Cómo funciona, promoción del mapa, Únete) | Nuevo | — | Bienvenida |
| N25 Héroe del evento | Nuevo (deriva de `.hero`) | `.hero` | Evento |
| N26 Ficha de datos clave | Nuevo | — | Evento |
| N27 Acciones del evento y "quién va" | Nuevo | — | Evento |
| N28 Atajos de sección | Nuevo (deriva de `.chip`) | `.chip` | Evento |
| N29 Línea de programación | Nuevo | — | Evento |
| N30 Plano de localidades y lista de precios | Nuevo | — | Evento |
| N31 Muro del evento | Nuevo | — | Evento |
| N32 Tarjetas "Lo que debes saber" | Nuevo | — | Evento |
| N33 Ubicación y organizador | Nuevo | — | Evento |
| N34 Planes parecidos y recuerdos del evento | Nuevo (variante de `.card`) | `.card` | Evento |
| N35 Tarjeta de compra fija | Nuevo | — | Evento |
| N36 Selector de cantidad | Nuevo | — | Evento |
| N37 Barra de compra móvil | Nuevo | — | Evento |
| N38 Checkout en panel lateral (stepper y temporizador) | Nuevo | — | Evento |
| N39 Opción con radio (tarjeta de opción) | Nuevo | — | Evento, Agenda |
| N40 Selector de miembros del parche e interruptor | Nuevo | — | Evento, Chat |
| N41 Campos de formulario | Nuevo | — | Registro, Evento, Chat, Main, Agenda |
| N42 Selector de medio de pago | Nuevo | — | Evento |
| N43 Casilla de términos | Nuevo | — | Evento |
| N44 Resumen del pedido | Nuevo | — | Evento |
| N45 Boleta digital con QR | Nuevo | — | Evento |
| N46 Confirmación de compra | Nuevo | — | Evento |
| N47 Lista de conversaciones | Nuevo | — | Chat |
| N48 Barra superior de conversación | Nuevo | — | Chat |
| N49 Burbujas de chat (propias, ajenas, sistema) y separadores | Nuevo | — | Chat |
| N50 Reacciones | Nuevo | — | Chat |
| N51 Plan fijado | Nuevo | — | Chat |
| N52 Encuesta | Nuevo | — | Chat |
| N53 Tarjeta de evento compartido | Nuevo | — | Chat |
| N54 Mensaje con foto | Nuevo | — | Chat |
| N55 Compositor del chat y bandeja "Compartir" | Nuevo | — | Chat |
| N56 Panel de información del grupo | Nuevo | — | Chat |
| N57 Modal de nuevo parche / nuevo chat | Nuevo | — | Chat |
| N58 Insignia de cuenta verificada | Nuevo | — | Chat |
| N59 Pasos del registro (panel y barra de progreso) | Nuevo | — | Registro |
| N60 Chips de gustos | Nuevo (variante de `.chip`) | `.chip` | Registro (y gustos estáticos en Perfil) |
| N61 Fila de persona con "Seguir" | Nuevo (deriva de `.act` + `.join`) | `.act`, `.join` | Registro, Main, Evento, Perfil |
| N62 Cabecera de perfil con estadísticas | Nuevo | — | Perfil (resumen en Main) |
| N63 Pestañas | Nuevo | — | Perfil, Evento |
| N64 Tarjeta de plan con estado | Nuevo (variante de `.card`) | `.card` | Perfil |
| N65 Tarjetas de recuerdos | Nuevo | — | Perfil, Evento |
| N66 Tarjetas de reseña | Nuevo | — | Perfil (estrellas en Main) |
| N67 Estados vacíos | Nuevo (amplía `.empty`) | `.empty` | Bienvenida, Agenda, Main, Mapa, Chat |
| N68 Ventana modal (base) | Nuevo | — | Agenda, Chat, Evento |
| N69 Botones (sistema completo) | Nuevo (amplía `.btn-dark`, `.btn-light`, `.ticket`, `.join`) | `.btn-dark`, `.btn-light`, `.ticket`, `.join` | Las 8 |
| N70 Componentes exigidos por la auditoría y no dibujados | Nuevo (no diseñado) | — | Ver lista en N70 |

### Componentes del código base

Para cada clase o función del código base: **qué hace hoy** (estilos exactos del original), **dónde aparece en el prototipo**, **qué cambió** y **qué hacer al implementar**. Las medidas del original marcadas **(medido)** salen de renderizar `preview-demo.html` en Chromium a 1280 y 390 px.

#### `:root` (tokens)

- **Hoy:** `color-scheme: light; --bg #FBF7F3; --surface #FFFFFF; --ink #17120F; --muted #6E6259; --line #EAE1D8; --brand #D9452F; --brand-hover #BF3923; --yellow #F6DC6A; --peach #F3B27E; --pink #EE93BC; --hero #140E10; --display 'Archivo', 'Arial Black', 'Helvetica Neue', sans-serif; --ui 'DM Sans', system-ui, -apple-system, 'Segoe UI', sans-serif`. Reset `* { box-sizing: border-box; margin: 0; padding: 0; }`, `body { background: var(--bg); color: var(--ink); font-family: var(--ui); font-size: 16px; line-height: 1.5; }`, `a { color: inherit; text-decoration: none; }`, `button { font-family: inherit; cursor: pointer; }`. Fuentes de Google: Archivo 800 y 900; DM Sans ópticas 9..40, pesos 400, 500 y 700.
- **En el prototipo:** los 8 archivos cargan las mismas fuentes y usan los mismos hex, pero en línea (no hay variables). Reglas globales en `<helmet>`: `body{margin:0;background:#FBF7F3}`, `a{color:#17120F;text-decoration:none}a:hover{color:#C23A24}`, `button{font-family:inherit;cursor:pointer}`, `input,select{font-family:inherit}` (Agenda, Evento y Chat agregan `textarea`).
- **Cambios:** se agregan `#C23A24` (acción), `#A3A8F0`, `#B9E07A`, `#8FD3D0` (ya estaban como colores de avatar `.c2`, `.c4`, `.c6`), `#F1EAE3`, `#D9CEC3`, `#D8CEC6`, `#F3ECE5` y los tonos de zona del plano (ver "Tokens que usan los componentes"). `--brand` queda **solo para el logo**: los rellenos con texto blanco pasan a `#C23A24` porque blanco sobre `#D9452F` da 4,34:1 y no llega a 4,5:1 (decisión 2.4). Base de 15 px en las pantallas con sesión. **Se perdió** la etiqueta `<meta name="viewport" content="width=device-width, initial-scale=1.0">` que sí tenía el código base: ninguna de las 8 pantallas la declara y en un celular real se dibujan a 980 px reducidas (H35, obligatorio recuperarla).
- **Implementar:** recuperar las variables del `:root` y agregar las nuevas. No usar `#D9452F` como fondo de texto blanco ni como texto pequeño sobre `--bg` (4,07:1).

#### `.wrap`

- **Hoy:** `max-width: 1240px; margin: 0 auto; padding-inline: 24px`; a ≤520 px `padding-inline: 16px`.
- **En el prototipo:** cada encabezado, `main` y pie repite `max-width: 1240px; margin: 0 auto` con relleno lateral de **24 px fijos** (Bienvenida, Registro, Main, Agenda, Chat, Perfil) o `clamp(16px, 4vw, 24px)` (Mapa y Evento: 16 px hasta 400 px, 24 px desde 600 px). Chat por debajo de 900 px usa `padding: 12px 16px 16px` en el `main`.
- **Cambios:** se perdió la reducción a 16 px en celular en 6 pantallas (H41).
- **Implementar:** un contenedor único con `max-width: 1240px` y relleno `clamp(16px, 4vw, 24px)` en todas las pantallas.

#### `.top` (encabezado fijo)

- **Hoy:** `position: sticky; top: env(safe-area-inset-top, 0px); z-index: 20; background: var(--bg)`. Fila interna `.wrap` con `display: flex; align-items: center; gap: 24px; height: 76px`. A ≤820 px: `flex-wrap: wrap; height: auto; padding-block: 12px; gap: 12px`. **(medido)** 76 px de alto a 1280; 124,4 px a 390.
- **En el prototipo:** cinco variantes (ver N1, N2, N3 e "Inconsistencias"). Base común: `position: sticky; top: 0; z-index: 5; background: #FBF7F3; border-bottom: 1px solid #EAE1D8` (Bienvenida sin borde; Mapa `z-index: 70`); fila interna `max-width: 1240px; margin: 0 auto; padding: 12px 24px; display: flex; flex-wrap: wrap; align-items: center; gap: 12px 20px` (Bienvenida `padding: 14px 24px; gap: 12px 24px`). Sin alto fijo. Perfil y Registro no son fijos; Chat deja de ser fijo por debajo de 900 px.
- **Alturas (medido):** Bienvenida 214,5 / 134,1 / 78 px (390 / 768 / 1280); Main, Agenda, Mapa y Chat 224,2 / 125 / 69; Evento 125 / 69 / 69; Perfil 125 / 69 / 69; Registro 66,4 en todos.
- **Cambios:** se quitó `env(safe-area-inset-top)`, bajó el `z-index` de 20 a 5, se agregó el borde inferior y desapareció el alto fijo de 76 px.
- **Implementar:** recuperar `top: env(safe-area-inset-top, 0px)`. En celular, encabezado de **una fila de 56 a 64 px** (logo, lupa y avatar) que se esconda al bajar, más barra inferior con 5 pestañas con texto (Inicio, Agenda, Mapa, Mensajes, Perfil) y "Crear" como acción secundaria (H40). Con encabezado fijo, `scroll-padding-top` igual a su alto real por punto de quiebre (H16: Evento `scroll-padding-top: 90px`, 140 px desde 980 px).

#### `.logo`

- **Hoy:** `font-family: var(--ui); font-weight: 700; font-size: 1.6rem; letter-spacing: -0.03em; color: var(--brand)`; texto "fulleventos" en minúsculas. **(medido)** 128,4 × 38,4 px.
- **En el prototipo:** igual, `1.6rem` en Bienvenida y Registro (enlaza a `Bienvenida.dc.html`) y `1.55rem` en Main, Agenda, Mapa, Evento, Chat y Perfil (enlaza a `Main.dc.html`). En Evento y Perfil va centrado con `margin-inline: auto`. Color `#D9452F` en línea: no cambia con el hover (R1).
- **Implementar:** tal cual, con un solo tamaño (`1.6rem` recomendado, el del original) y destino según sesión: visitante → landing; con sesión → Inicio.

#### `.search`, `.city`, `.go` (buscador con ciudad)

- **Hoy:** `<form class="search" role="search" onsubmit="event.preventDefault()">` con `flex: 1; max-width: 480px; display: flex; align-items: center; background: var(--surface); border: 1px solid var(--line); border-radius: 999px; padding: 5px 5px 5px 18px; gap: 10px; box-shadow: 0 1px 2px rgba(23,18,15,.04)`. Lupa SVG 18 px en `--muted`. `input[type=search]` con `flex: 1; min-width: 0; border: 0; outline: 0; background: transparent; font-size: .95rem`, placeholder "¿Qué plan buscas?" en `#9A8E85`, `aria-label="Buscar planes"`. `.city`: `display: flex; align-items: center; gap: 6px; padding-left: 14px; border-left: 1px solid var(--line); font-size: .9rem; white-space: nowrap`, pin SVG 16 + texto fijo "Bogotá" (oculto a ≤520 px). `.go`: botón `type="submit"` de 38 × 38, círculo `--brand`, lupa blanca de 16 px con trazo 2.5, `aria-label="Buscar"`, hover `--brand-hover`. **(medido)** 480 × 50 px a 1280; a ≤820 pasa a la tercera línea a todo el ancho (`order: 3; flex-basis: 100%`).
- **En el prototipo:**
  - **Bienvenida** (`:25-48`): `<div role="search">` con `flex: 1 1 300px; max-width: 520px; padding: 4px 4px 4px 18px; gap: 10px`, sin sombra y **sin `min-width: 0`** (causa del desborde a 473 px en celular, H8). Mismo placeholder "¿Qué plan buscas?" y `aria-label="Buscar planes"`. La ciudad es el selector N4 (`height: 40px`, `padding-left: 12px`). Conserva el botón `.go` como `<button type="button" aria-label="Buscar">` de 40 × 40 en `#C23A24`, **sin acción** (H38).
  - **Main, Agenda, Mapa y Chat:** `<div role="search">` con `flex: 1 1 260px; max-width: 500px; min-width: 0; height: 44px; box-sizing: border-box; padding: 0 6px 0 16px; gap: 10px`, sin botón de buscar. El campo va dentro de `<label>`. Placeholder y nombre: Main y Chat "Busca planes, gente o lugares" / `aria-label="Buscar"`; Agenda y Mapa "Busca eventos, lugares o artistas" / `aria-label="Buscar eventos"`. Selector de ciudad de 36 px con `padding-left: 10px`.
  - En ninguna pantalla la búsqueda filtra ni tiene pantalla de resultados (H38, H41). El campo tiene `outline: 0` en línea (H51).
- **Cambios:** se quitó la sombra, el `<form>` y el envío; la ciudad pasó del texto fijo **"Bogotá"** a un `<select>` con **"Toda Colombia"** y 11 ciudades (decisión 2.8); el placeholder cambió en 4 pantallas.
- **Implementar:** un solo buscador `<form role="search">` con envío real, un único placeholder (recomendado "Busca planes, gente o lugares") y pantalla de resultados con estados vacío y de carga (H41). `min-width: 0` en el contenedor; por debajo de unos 480 px el selector de ciudad pasa a otra línea o a un ícono (H8). Foco visible en el contenedor con `:focus-within` (H51). Placeholder en `#6E6259` (H52: el gris por defecto da 4,32:1).

#### `.nav` (navegación de texto)

- **Hoy:** `margin-left: auto; display: flex; align-items: center; gap: 22px; font-size: .92rem; font-weight: 500`; enlaces "Noticias", "Agenda", "Mis planes", el botón `.btn-dark` "Crear evento" y "Entrar" (`style="display:inline"`). Hover de enlaces `--brand`. A ≤820 px se ocultan los enlaces (`.nav a { display: none }`), salvo "Entrar" porque su `display` en línea gana.
- **En el prototipo:** solo en Bienvenida (N2), con `flex-wrap: wrap; align-items: center; gap: 8px 20px; font-size: .92rem; font-weight: 500` y los enlaces "Cómo funciona" (`#como-funciona`), "Mapa" + insignia "Nuevo" (`Mapa.dc.html`), "Agenda" (`#agenda`), "Entrar" (700, a `Main.dc.html`) y "Crear cuenta" (píldora oscura, a `Registro.dc.html`). En las pantallas con sesión se reemplaza por íconos (N5).
- **Implementar:** como N2 para visitantes; "Entrar" debe abrir una pantalla de inicio de sesión (H12, H33), no el feed.

#### `.btn-dark`

- **Hoy:** `background: var(--ink); color: #fff; border: 0; border-radius: 999px; padding: 10px 18px; font-weight: 700; font-size: .9rem`; hover `#33291F`. **(medido)** 127,3 × 38 px ("Crear evento").
- **En el prototipo:** "Crear evento" en Main, Agenda, Mapa y Chat: `height: 44px; border: 0; border-radius: 999px; padding: 0 18px; background: #17120F; color: #FFFFFF; font-weight: 700; font-size: .9rem; margin-left: 6px`, **sin acción** y sin `type="button"` en Main, Agenda y Mapa (H38, H14). "Crear cuenta" (Bienvenida) es un `<a>` con `padding: 11px 18px`. Otros botones oscuros: "Nuevo parche" (Chat, 40 px), "Ver en el mapa" (Evento, 42 px), "Ver todas las categorías" (Mapa, 40 px), "Seguir" apagado (36–44 px), barra del mini-mapa "Ver qué pasa en todo el país" (≥44 px).
- **Cambios:** alto fijo de 44 px en el encabezado; sin hover.
- **Implementar:** como variante "oscuro" del sistema de botones (N69). "Crear evento" debe abrir algo (formulario de contacto para organizadores, H38).

#### `.hero`

- **Hoy:** `position: relative; border-radius: 28px; overflow: hidden; color: #fff; padding: 56px 64px 52px; min-height: 520px; display: flex; flex-direction: column; justify-content: center` y fondo `radial-gradient(circle at 74% 30%, rgba(214,140,70,.55) 0, transparent 22%), radial-gradient(circle at 92% 78%, rgba(190,70,80,.45) 0, transparent 26%), radial-gradient(circle at 60% 92%, rgba(230,170,80,.25) 0, transparent 18%), radial-gradient(ellipse at 8% 40%, rgba(70,30,80,.55) 0, transparent 45%), var(--hero)`. A ≤820 px: `padding: 64px 22px 32px; min-height: 0; border-radius: 22px`. **(medido)** 1192 × 557,8 px a 1280.
- **En el prototipo:**
  - **Bienvenida** (`:61`): mismo fondo y radio 28; `padding: 56px clamp(22px, 5vw, 64px) 52px; min-height: 520px; box-sizing: border-box`. Sin `@media`: en celular conserva `min-height: 520px` y radio 28. Suma la bajada "Descubre planes en Bogotá, Medellín, Cali, Barranquilla y todo el país, mira quién de tus amigos va y arma parche para no llegar solo." (`margin: 26px 0 0; max-width: 48ch; font-size: 1.1rem; color: rgba(255,255,255,.9)`).
  - **Registro** (`:29`, panel lateral): `radial-gradient(circle at 74% 30%, rgba(214,140,70,.55) 0, transparent 26%), radial-gradient(circle at 80% 85%, rgba(190,70,80,.45) 0, transparent 30%), radial-gradient(ellipse at 8% 40%, rgba(70,30,80,.55) 0, transparent 45%), #140E10`; radio 28; `padding: clamp(28px, 4vw, 48px); min-height: 420px; justify-content: space-between; gap: 28px` (N59).
  - **Evento** (`:56`): N25.
  - El mismo lenguaje (fondo `#140E10` con manchas de color) se repite en el bloque del mapa de Bienvenida, el panel del mapa, "Tu semana" (Main, plano `#17120F`), el bloque "Únete" (plano `#17120F`) y la cabecera de la boleta.
- **Implementar:** un componente "bloque oscuro" con la foto real detrás (los degradados son marcadores, R7) y una capa que garantice contraste del texto blanco. Recuperar el ajuste del original en celular (`min-height: 0`, radio 22) o lo que pida H44 (en la landing, subir "Este finde" justo después del héroe).

#### `.photo-note`

- **Hoy:** `position: absolute; top: 20px; right: 20px; font-size: .72rem; color: rgba(255,255,255,.75); border: 1px solid rgba(255,255,255,.3); border-radius: 999px; padding: 4px 10px`; texto "[Foto real de un evento en Bogotá]".
- **En el prototipo:** Bienvenida igual con `color: rgba(255,255,255,.8)`, borde `rgba(255,255,255,.35)` y texto **"[Foto real de un evento en Colombia]"**. Evento: mismo estilo con `role="img" aria-label="[Foto del evento]"` y texto "[Foto del evento]".
- **Implementar:** es un marcador de diseño. En producción desaparece y entra la foto real con `alt`. Si se conserva un crédito de foto, usar este estilo.

#### `.tag` (etiqueta amarilla)

- **Hoy:** `display: inline-block; align-self: flex-start; background: var(--yellow); color: var(--ink); font-family: var(--display); font-weight: 800; font-size: 1.05rem; letter-spacing: .01em; padding: 5px 12px; margin-left: 44px; text-transform: uppercase`; a ≤820 px `margin-left: 0; font-size: .9rem`. Texto "Arma tu parche". Esquinas rectas.
- **En el prototipo (variantes):**

| Dónde | Texto | Tamaño y relleno | Notas |
|---|---|---|---|
| Bienvenida, héroe | "Arma tu parche" | `1.05rem`; `5px 12px`; `margin-left: clamp(0px, 3vw, 44px)` | Sin `letter-spacing` |
| Bienvenida, mapa | "Nuevo · Mapa de eventos" | `.85rem`; `4px 10px`; `margin-bottom: 14px` | `display: inline-block` |
| Bienvenida, Únete | "Tu gente ya está aquí" | `.85rem`; `4px 10px`; `margin-bottom: 14px` | |
| Registro | "Paso {stepNum} de 3" | `.9rem`; `4px 10px` | Ej.: "Paso 1 de 3" |
| Evento, héroe | "Rumba · Vie 9 oct" | `.95rem`; `4px 11px` | |
| Main, "Tu semana" | "Tu semana" | `.8rem`; `3px 9px` | |
| Mapa, antetítulo | "Nuevo · Todo el país" | `.72rem`; `letter-spacing: .04em`; `3px 8px` | Dentro del antetítulo rojo |
| Boleta | "Rumba · Vie 9 oct" | `.78rem`; `3px 9px` | Sobre fondo oscuro |

- **Implementar:** un componente con tamaños `lg` (1.05rem), `md` (.85–.95rem) y `sm` (.72–.8rem); siempre Archivo 800, mayúsculas, fondo `#F6DC6A`, texto `#17120F` (13,6:1), sin radio.

#### `.headline span` (titular con franjas)

- **Hoy:** `.headline { font-family: var(--display); font-weight: 900; text-transform: uppercase; letter-spacing: -0.035em; line-height: .98; font-size: clamp(2.3rem, 5.8vw, 4.9rem); color: var(--ink); }`; `span { display: block; width: fit-content; max-width: 100%; background: linear-gradient(90deg, var(--peach), var(--pink)); padding: .1em .22em .06em; }`; `span:nth-child(2) { margin-left: 1.15em; background: linear-gradient(90deg, var(--pink), var(--peach)); }`; `span:nth-child(3) { margin-left: .4em; max-width: 13ch; }`; a ≤820 px las sangrías pasan a 0. Texto: "De la rumba" / "del viernes" / "al concierto del sábado".
- **En el prototipo:**
  - **Bienvenida:** mismo texto y tamaño; el `h1` es `display: flex; flex-direction: column; align-items: flex-start` y las sangrías son `margin-left: clamp(0em, 2vw, 1.15em)` (2.ª) y `clamp(0em, 1vw, .4em)` (3.ª, con `max-width: 13ch` y degradado durazno→rosado).
  - **Registro:** `clamp(2rem, 4vw, 3.2rem)`; "Tu próximo" / "plan empieza" (`margin-left: .8em`, degradado invertido) / "aquí".
  - **Evento:** `clamp(2.2rem, 5vw, 4.2rem)`; "Noche de salsa" / "y boleros en vivo" (`margin-left: 1em`, invertido).
- **Implementar:** componente de titular que recibe 2 o 3 líneas. Alterna el degradado en las líneas pares. Sangrías con `clamp()` (sin `@media`). En el evento, el título viene del dato: hay que definir cómo se parte en líneas (por ejemplo, en la palabra más cercana a la mitad).

#### `.hero-foot`

- **Hoy:** `display: flex; flex-wrap: wrap; align-items: center; gap: 18px 22px; margin-top: 34px`; contiene `.btn-light` "Encuentra tu plan" y `.friends`.
- **En el prototipo (Bienvenida `:70-82`):** `gap: 16px 22px; margin-top: 26px` con "Crear mi cuenta gratis" (`.btn-light`, a `Registro.dc.html`) y "Ver la agenda sin registrarme" (`color: #FFFFFF; font-weight: 700; border-bottom: 2px solid #FFFFFF; padding-bottom: 1px`, a `#agenda`). La prueba social baja a su propia fila (`margin-top: 26px`).
- **Implementar:** tal cual.

#### `.btn-light`

- **Hoy:** `background: #fff; color: var(--ink); border: 0; border-radius: 999px; padding: 15px 26px; font-weight: 700; font-size: 1rem`; hover `#F3ECE6`. **(medido)** 191,2 × 54 px.
- **En el prototipo:** "Crear mi cuenta gratis" (`<a>`, `padding: 15px 26px`, 700), "Abrir el mapa de eventos" (`display: inline-flex; align-items: center; gap: 10px` + ícono de mapa 18 px) y "Continuar con Google" del bloque Únete (`height: 52px`, centrado). Sin hover.
- **Implementar:** variante "claro" de N69 para fondos oscuros.

#### `.friends`, `.avs`, `.av`, `.c1`–`.c6` (avatares y prueba social)

- **Hoy:** `.friends { display: flex; align-items: center; gap: 10px; font-size: .88rem; line-height: 1.3; color: rgba(255,255,255,.88); }` con `b` en blanco. `.av { width: 34px; height: 34px; border-radius: 50%; display: grid; place-items: center; font-size: .72rem; font-weight: 700; color: var(--ink); border: 2px solid var(--hero); margin-left: -9px; }` (el primero sin margen). Colores: `.c1 #F3B27E`, `.c2 #A3A8F0`, `.c3 #EE93BC`, `.c4 #B9E07A`, `.c5 #F6DC6A`, `.c6 #8FD3D0`. Texto: "Laura, Andrés y **12 amigos más**" + salto + "tienen plan este finde", con iniciales LM, AR, SC, JP.
- **En el prototipo:**
  - **Prueba social de Bienvenida** (`:74-82`): 4 círculos de 34 px **sin iniciales** (`#F3B27E`, `#A3A8F0`, `#EE93BC`, `#B9E07A`), borde 2 px `#140E10`, solape −9 px, y el texto "**[N] personas** en **[N] ciudades** ya tienen plan este finde" (marcadores porque un visitante no tiene amigos).
  - **Avatar** en todas las pantallas: círculo de color con iniciales DM Sans 700, texto `#17120F`. Tamaños usados: 22 (Agenda, sin iniciales), 24 (pila de "van", sin iniciales), 32 (chat y miembros del checkout), 34 (panel del chat y pagos del parche), 36 (asistentes del checkout), 38 (modal del chat), 40 (encabezado "CV", muro, "Gente con tus gustos", "quién va"), 42 (publicaciones, compositor, ventana de repost), 44 (Registro y barra del chat), 48 (tarjeta de perfil de Main y lista del chat), 68 (historias, con anillo), 72 (panel del chat), 128 (perfil).
  - **Avatar de grupo u organizador:** cuadrado redondeado con iniciales Archivo 900 (radios 10, 12, 14 o 20 según tamaño). Organizador: fondo `#17120F` con letras `#F6DC6A`.
  - **Pila de avatares** ("quién va"): N27; pila de "van" en la publicación: 3 círculos de 24 px, borde 2 px blanco, solape −8 px (Agenda: 2 de 22 px, −7 px).
  - **Asignación de colores a personas** (igual en todas las pantallas): Camila "CV" `#8FD3D0`; Laura "LM" `#F3B27E`; Andrés "AR" `#A3A8F0`; Sofía "SC" `#EE93BC`; Juan Pablo "JP" `#B9E07A`; María F. "MG" `#F6DC6A`; Daniel "DT" `#8FD3D0`; Valentina "VQ" `#A3A8F0`; Natalia "NH" `#F6DC6A`; Carolina "CR" `#EE93BC`; Sebastián "SB" `#8FD3D0`; Majo "MJ" `#B9E07A`; Galería Café Libro "GC" `#17120F`.
- **Implementar:** un componente Avatar con `size`, `shape` (`circle` | `rounded`), `initials`, `color` (de la paleta `.c1`–`.c6`) y `textColor`. **Obligatorio (H52):** definir el color del texto para fondos oscuros: en Registro el avatar de Galería Café Libro tiene fondo `#17120F` y letras `#17120F` (invisibles); usar amarillo `#F6DC6A` como en el Chat. Con foto real, la foto reemplaza el color.

#### `section.block`

- **Hoy:** `padding-block: 64px 8px`.
- **En el prototipo (Bienvenida):** cada sección con `padding-top: 72px` (sin relleno inferior); el bloque Únete con `margin-top: 80px`; el `main` con `padding: 8px 24px 0`.
- **Implementar:** espaciado vertical de sección de 72 px en la landing.

#### `.sec-head`

- **Hoy:** `display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; margin-bottom: 24px; flex-wrap: wrap`. A la izquierda antetítulo + `h2`; a la derecha `.more` o `.sample`.
- **En el prototipo:** Bienvenida (Noticias con `margin-bottom: 24px`; Agenda con `margin-bottom: 20px` y a la derecha "Ver en el mapa" + "Ver toda la agenda"), Agenda (cabecera de página con `gap: 16px`, columna de texto `flex: 1 1 420px`), Mapa ("Ciudades con más planes", `gap: 6px 16px`), Evento ("Localidades" con `gap: 6px 16px`, "Parches para este evento" con `gap: 10px 16px`, "Planes parecidos…" con `gap: 8px 16px`).
- **Implementar:** tal cual; el `gap` vertical varía de 6 a 16 px: unificar en `8px 16px`.

#### `.eyebrow` (antetítulo)

- **Hoy:** `font-size: .74rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--brand); margin-bottom: 6px`.
- **En el prototipo:** mismo estilo con `color: #C23A24; margin: 0 0 6px`. Textos: "Cómo funciona", "Lo que se mueve", "Agenda" (Bienvenida); "Agenda para ti" (Agenda); "Mapa de eventos" con la etiqueta "Nuevo · Todo el país" (Mapa, `margin: 0 0 8px; display: flex; flex-wrap: wrap; align-items: center; gap: 10px`); "Todo el país" / "Ciudad elegida" (panel del mapa, `.72rem`, `margin: 0 0 4px`). Variantes: "Tus parches" (Main, `h2` de `.78rem`), "Evento del parche" (Chat, `h3` de `.7rem`). **Variante gris** (`#6E6259`, `letter-spacing: .1em`): "Fecha", "Hora", "Lugar", "Edad", "Precio" (`.7rem`), "Boletas", "Localidad", "Cantidad" (`.72rem`), "Organiza" (`.72rem`, `.08em`), "Info del grupo" (`.7rem`, `.12em`), etiquetas de la boleta (`.68rem`).
- **Cambios:** `--brand` → `#C23A24` (5,02:1 sobre `--bg`; `#D9452F` da 4,07:1).
- **Implementar:** componente con variantes `accent` (`#C23A24`) y `muted` (`#6E6259`).

#### `h2` (título de sección)

- **Hoy:** `font-family: var(--display); font-weight: 900; font-size: clamp(1.7rem, 3.2vw, 2.4rem); letter-spacing: -0.03em; line-height: 1.05; text-wrap: balance`.
- **En el prototipo (sin `text-wrap: balance` en ningún caso):**

| Variante | Estilo | Textos |
|---|---|---|
| Sección de landing | igual al original, `margin: 0` (o `0 0 28px`) | "Planes mejores, con tu gente", "Noticias de la escena", "Este finde en Colombia" |
| Bloque oscuro | `clamp(1.8rem, 3.6vw, 2.8rem)`, `line-height: 1.02`, mayúsculas | "Todo el país en un mapa", "Ve a qué van tus amigos y súmate al parche" |
| Título de página (`h1`) | `clamp(1.9rem, 3.6vw, 2.8rem)`, `line-height: 1.02` | "Este finde en {cityLabel}" (Agenda; ej. "Este finde en Colombia", "Este finde en Bogotá"), "Todo lo que pasa en Colombia este finde" (Mapa, `max-width: 21ch`) |
| Sección de evento | `1.5rem`, `line-height: 1.05`, mayúsculas | "Sobre el evento", "Programación", "Localidades", "Parches para este evento", "Lo que debes saber", "Ubicación y organizador", "Planes parecidos en otras ciudades" |
| Sección del mapa | `clamp(1.4rem, 2.4vw, 1.75rem)`, `-0.02em`, `line-height: 1.1` | "Ciudades con más planes" |
| Paso de registro | `1.9rem`, `line-height: 1.05` | "Crea tu cuenta", "¿Qué planes te gustan?", "Encuentra a tu gente" |
| Título de tarjeta (DM Sans) | `1rem`, 700, `margin: 0` | "Mapa de eventos", "Gente con tus gustos", "Tendencias en Colombia", "Recuerdos de ediciones pasadas" |

- **Implementar:** escala tipográfica con estas 7 variantes; recuperar `text-wrap: balance`. **Obligatorio (H59):** Main no tiene `h1` (agregar uno oculto "Tu feed") y los posts no tienen encabezado.

#### `.more` (enlace subrayado)

- **Hoy:** `font-size: .9rem; font-weight: 700; border-bottom: 2px solid var(--ink); padding-bottom: 1px`; hover `color: var(--brand); border-color: var(--brand)`. **(medido)** 131,1 × 24,6 px. Texto "Ver toda la agenda".
- **En el prototipo:** "Ver toda la agenda" (Bienvenida, idéntico, a `Agenda.dc.html`); "Ver todos los planes en el mapa" (Agenda, `.88rem`, `inline-flex; gap: 6px`); "Ver parches" (Evento, `.86rem`); "Ver localidades" (Evento, `.8rem`, sin `padding-bottom`, `display: inline-block`); "Ver más planes en el mapa" (Evento, `.86rem` + ícono de mapa 16 px); "Ver las 128 fotos" (Evento, `.86rem`); "Entrar" (Registro, `.9rem` heredado); variante blanca "Ver la agenda sin registrarme" (Bienvenida) y "Entrar" del bloque Únete (`border-bottom: 1px solid #FFFFFF`). Hover: solo el texto pasa a `#C23A24`; **el borde sigue `#17120F`** (R1).
- **Implementar:** recuperar el hover completo del original (texto y borde a `#C23A24`). Tamaño único `.9rem` salvo dentro de textos pequeños.

#### `.sample`

- **Hoy:** `font-size: .78rem; color: var(--muted)`; "Contenido de ejemplo".
- **En el prototipo:** idéntico en Noticias de Bienvenida; en Main al final del texto legal ("· Contenido de ejemplo").
- **Implementar:** tal cual mientras haya contenido de ejemplo. **Obligatorio (H1):** agregar "Contenido de ejemplo" en Agenda y Mapa o reemplazar las marcas reales (TuBoleta, Ticketmaster, Fever, Idartes) por `[BOLETERA]`.

#### `.pulse` y `.news` (rejillas de noticias)

- **Hoy:** `.pulse { display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 1fr); gap: 28px; }` (noticias + "Tu gente"); `.news { display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr); gap: 20px; }`; a ≤1080 `.pulse` 1 columna; a ≤820 `.news` 1 columna.
- **En el prototipo (Bienvenida `:157-183`):** **se quitó la columna "Tu gente"** (un visitante no tiene amigos). Las noticias quedan en `display: flex; flex-wrap: wrap; gap: 24px` con la destacada `flex: 1.25 1 320px` y la lista `flex: 1 1 280px`.
- **Implementar:** flex con esas bases (lado a lado cuando caben 320 + 280 + 24 px). Según H44, Noticias va al final de la landing.

#### `.feature`, `.kicker`, `.meta` (noticia destacada)

- **Hoy:** `.feature { background: var(--surface); border: 1px solid var(--line); border-radius: 20px; overflow: hidden; display: flex; flex-direction: column; }`; `.img { aspect-ratio: 4 / 3; background: radial-gradient(circle at 30% 35%, rgba(246,220,106,.85) 0, transparent 30%), radial-gradient(circle at 75% 65%, rgba(217,69,47,.8) 0, transparent 40%), #2A1A16; }`; `.body { padding: 18px 20px 20px; }`; `.kicker { display: inline-block; font-size: .7rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--brand); margin-bottom: 6px; }`; `h3 { font-family: var(--display); font-weight: 800; font-size: 1.35rem; letter-spacing: -0.02em; line-height: 1.12; margin-bottom: 8px; text-wrap: balance; }`; `p { color: var(--muted); font-size: .93rem; }`; `.meta { font-size: .8rem; color: var(--muted); margin-top: 10px; }`; hover del enlace: `h3` a `--brand`.
- **En el prototipo:** imagen **16 / 9** (antes 4/3) con `role="img" aria-label="[Imagen de la noticia]"`; `.kicker` como `span` en línea `#C23A24` sin margen (el `h3` lleva `margin: 4px 0 8px`); `.meta` con `margin: 10px 0 0`. Textos: "Cartel confirmado · Bogotá", "El festival de noviembre en el Simón Bolívar revela su cartel completo", "Tres escenarios, más de 40 artistas y entrada por días. La preventa abre este jueves.", "Hace 3 horas · 4 min de lectura". Enlaza a `Evento.dc.html` (H36).
- **Implementar:** tal cual con imagen 16/9 y la ciudad en el antetítulo ("{tema} · {ciudad}").

#### `.news-list`, `.news-item`

- **Hoy:** lista `flex` en columna; cada ítem `padding-block: 16px; border-bottom: 1px solid var(--line)` (el primero sin relleno arriba y el último sin borde); `h4 { font-size: 1.02rem; font-weight: 700; line-height: 1.3; text-wrap: balance; }`; hover `h4` a `--brand`.
- **En el prototipo:** cada ítem es un `<a style="display: block">` con `padding: 0 0 16px` / `16px 0` / `16px 0` y borde en los dos primeros; `h4` con `margin: 2px 0 0`; hora `margin: 6px 0 0; font-size: .8rem`. Textos:
  1. "Venta de boletas · Bogotá" — "Se agotó la primera fase para el concierto del Movistar Arena; anuncian segunda fecha" — "Hace 5 horas".
  2. "Nuevo lugar · Medellín" — "Abre en El Poblado un club con programación de electrónica de jueves a sábado" — "Ayer" (original: Chapinero).
  3. "Gratis · Barranquilla" — "Vallenato en vivo en el Gran Malecón del Río todos los sábados de octubre" — "Hace 2 días" (original: "Teatro al aire libre en los parques de Usaquén y Teusaquillo durante todo octubre").
- **Implementar:** tal cual. **H59:** la lista usa `h4` justo después del `h3` destacado (salto de nivel); usar `h3` en todos.

#### `.people`, `.act`, `.join` (actividad de amigos y "Me uno")

- **Hoy:** `.people { background: var(--surface); border: 1px solid var(--line); border-radius: 20px; padding: 20px; align-self: start; }`; `h3 1rem 700` "Tu gente"; `p .85rem muted` "Lo que están planeando tus amigos"; `.act { display: flex; gap: 12px; padding-block: 12px; border-top: 1px solid var(--line); align-items: flex-start; }` con avatar de 36 px sin borde, `.txt { flex: 1; min-width: 0; font-size: .88rem; line-height: 1.35; }` y `small` `.76rem` muted. `.join { border: 1px solid var(--line); background: transparent; border-radius: 999px; padding: 6px 12px; font-size: .78rem; font-weight: 700; flex-shrink: 0; }`; hover y `[aria-pressed="true"]`: fondo y borde `--ink`, texto blanco; el texto alterna "Me uno" ↔ "Vas". **(medido)** `.join` 70,5 × 30 px.
- **En el prototipo:** la columna "Tu gente" desaparece de la landing. El patrón se reparte en:
  - **Fila de persona con "Seguir"** (N61): Main "Gente con tus gustos", Registro paso 3.
  - **Botones de sumarse:** "Voy"/"Vas" de la publicación (38 px, borde `#17120F`, blanco → `#17120F`), "Voy"/"Vas a ir" del evento (48 px), "Unirme al parche"/"Estás en el parche" (38 px, rojo → `#17120F`), "Unirme"/"Estás dentro" (42 px, rojo → `#17120F`).
- **Cambios:** botones de 36 a 48 px (antes 30); el estado encendido de "Seguir" es al revés (oscuro apagado → blanco encendido); hover eliminado.
- **Implementar:** N61 y N69. Conservar `aria-pressed` y el cambio de texto.

#### `.chips`, `.chip` (filtros)

- **Hoy:** `.chips { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 6px; margin-bottom: 22px; scrollbar-width: none; }` + `::-webkit-scrollbar { display: none }`; grupo `role="group" aria-label="Filtrar por categoría"`. `.chip { flex-shrink: 0; border: 1px solid var(--line); background: var(--surface); border-radius: 999px; padding: 9px 16px; font-size: .9rem; font-weight: 500; color: var(--ink); }`; hover `border-color: var(--ink)`; `[aria-pressed="true"]` fondo y borde `--ink`, texto blanco. **(medido)** 38 px de alto (el `button` tiene `line-height: normal`). Opciones: "Todo", "Rumba", "Conciertos", "Planes con amigos", "Gratis este finde", "Comida", "Deporte", "Arte y teatro".
- **En el prototipo:** `height: 42px; padding: 0 16px; font-size: .9rem; font-weight: 500; border-radius: 999px; flex-shrink: 0` con borde, fondo y texto calculados (`#17120F`/`#17120F`/`#FFFFFF` encendido; `#EAE1D8`/`#FFFFFF`/`#17120F` apagado); `white-space: nowrap` en Agenda y Mapa. Contenedor `display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px` (Bienvenida `6px` y `margin-bottom: 22px`). **No declara `scrollbar-width: none`** (la barra de scroll queda a criterio del sistema) y no tiene hover. Opciones por pantalla:
  - Bienvenida: "Todo", "Rumba", "Conciertos", "Planes con amigos", "Gratis este finde", "Comida", "Deporte", "Arte y teatro" (H39: "Planes con amigos" filtra eventos con parches abiertos; renombrar a "Con parches abiertos").
  - Agenda: "Para ti", "Lo que repostea tu gente", "Rumba", "Conciertos", "Gratis", "Comida", "Deporte", "Arte y teatro".
  - Mapa: "Todo", "Rumba", "Conciertos", "Gratis", "Comida", "Deporte", "Arte y teatro".
  - Variantes derivadas: N10 (pestañas del feed, 38 px), N18 (ciudad con conteo, 42 px), N23 (ranking, 44 px), N28 (atajos del evento, 40 px), N60 (gustos, 46 px), etiquetas de "Sobre el evento" (34 px, estáticas) y gustos del perfil (estáticos).
- **Cambios:** de `padding: 9px 16px` (38 px) a **alto fijo de 42 px**; sin hover; sin ocultar la barra de scroll.
- **Implementar:** un componente Chip (`aria-pressed`) de 42 px con variantes `con-contador`, `con-ícono`, `grande` (46 px) y `estático`. Recuperar el hover del original (borde `--ink`). **H61:** cuando la fila se corta, mostrar pista (degradado y flechas) o permitir 2 líneas.

#### `.grid` (rejilla de tarjetas)

- **Hoy:** `display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 22px`; 3 columnas a ≤1080; 2 con `gap: 14px` a ≤820; 1 a ≤520.
- **En el prototipo:** rejillas automáticas: Bienvenida `repeat(auto-fill, minmax(250px, 1fr))` `gap: 22px`; Agenda `minmax(260px, 1fr)` `gap: 22px`; Perfil `minmax(210px, 1fr)` `gap: 20px`; Evento (parecidos) `minmax(200px, 1fr)` `gap: 16px`; recuerdos del perfil `minmax(200px, 1fr)` `gap: 12px`.
- **Implementar:** `auto-fill` con el mínimo de cada bloque; unificar el mínimo de la tarjeta de evento (250 vs 260 px). **H61:** evitar filas sueltas en tableta (Perfil 3+2) eligiendo mínimos por bloque. **H47:** en celular, tarjeta compacta horizontal (como la del mapa, N22).

#### `.card`, `.img`, `.body` (tarjeta de evento)

- **Hoy:** `.card { background: var(--surface); border: 1px solid var(--line); border-radius: 18px; overflow: hidden; display: flex; flex-direction: column; transition: transform 200ms ease-out, box-shadow 200ms ease-out; }`; hover `transform: translateY(-3px); box-shadow: 0 12px 28px rgba(23,18,15,.10)`; sin transición ni movimiento con `prefers-reduced-motion`. `.img { position: relative; aspect-ratio: 4 / 3; }` con fondo `radial-gradient(circle at 70% 30%, {bg0} 0, transparent 55%), {bg1}`. `.body { padding: 14px 16px 16px; display: flex; flex-direction: column; flex: 1; }`. **(medido)** 281,5 × 418,8 px a 1280.
- **En el prototipo:** misma caja (`background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 18px; overflow: hidden; display: flex; flex-direction: column`) **sin transición ni hover**. Variantes: pública (Bienvenida, N15 sin acciones), marketplace con repost (Agenda, N15), compacta horizontal (Mapa, N22), adjunta a publicación (Main, N12), parecida (Evento, N34), con estado (Perfil, N64), compartida en chat (N53). Imagen: Agenda la pone en un `span role="img" aria-label="[Foto del evento]"` con `inset: 0`; Bienvenida pinta el fondo en el propio `div` (sin nombre accesible).
- **Implementar:** **un solo componente TarjetaEvento** con variantes. Recuperar el hover del original (respetando movimiento reducido) es decisión abierta (R1). La foto siempre con `alt`.

#### `.date` (placa de fecha)

- **Hoy:** `position: absolute; top: 12px; left: 12px; background: #fff; border-radius: 10px; padding: 5px 9px 4px; text-align: center; line-height: 1; min-width: 46px`; `b { display: block; font-family: var(--display); font-size: 1.25rem; font-weight: 900; }`; `small { font-size: .66rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--muted); }`. **(medido)** 46 × 45 px. Contenido: día y mes ("9" / "oct").
- **En el prototipo (variantes de tamaño):**

| Dónde | Posición | Caja | Número | Mes |
|---|---|---|---|---|
| Bienvenida, Agenda | `top: 12px; left: 12px` | radio 10, `padding: 5px 9px 4px`, `min-width: 46px` | `1.25rem` | `.66rem` |
| Main (publicación), Evento (parecidos) | `top: 10px; left: 10px` | `min-width: 44px` | `1.2rem` | `.64rem` |
| Perfil | `top: 12px; left: 12px` | `min-width: 44px` | `1.2rem` | `.64rem` |
| Chat (evento compartido) | `top: 10px; left: 10px` | `min-width: 42px` | `1.15rem` | `.62rem` |
| Chat (plan fijado) | centrada en la foto de 64 px | radio 9, `padding: 4px 7px 3px`, `min-width: 34px` | `1.05rem` | `.6rem` |
| Mapa (lista) | `top: 6px; left: 6px` | radio 8, `padding: 4px 6px 3px`, `min-width: 32px` | `1rem` | `.58rem` |
| Evento (datos clave) | ícono de 46 × 46 | borde 1 px `#EAE1D8`, radio 12 | `1.3rem` | `.62rem` (`margin-top: 2px`) |

  El mes es siempre el texto fijo "oct" en mayúsculas por CSS.
- **Implementar:** componente PlacaFecha con tamaños `lg`, `md`, `sm`, `xs` y variante `bordered`. El mes debe venir del dato (en el prototipo está escrito a mano).

#### `.save` (Guardar)

- **Hoy:** `position: absolute; top: 12px; right: 12px; width: 36px; height: 36px; border-radius: 50%; border: 0; background: rgba(255,255,255,.92); display: grid; place-items: center; color: var(--ink)`; `[aria-pressed="true"]` color `--brand` y corazón relleno. `aria-label="Guardar {título}"`. Corazón SVG de 18 px, trazo 2.
- **En el prototipo:** Bienvenida y Agenda: **44 × 44**, `top: 10px; right: 10px; background: rgba(255,255,255,.94)`, color `#C23A24` y relleno `currentColor` al guardar (`#17120F` sin relleno si no). Mapa (lista): 36 × 36 con `border: 1px solid #EAE1D8; background: #FFFFFF`, corazón de 16 px. Main: no usa corazón para guardar sino un **marcador** ("Guardar evento", 40 px, sin acción) porque el corazón es "Me gusta".
- **Cambios:** 36 → 44 px; rojo `#C23A24`.
- **Implementar:** **H41:** usar el ícono de **marcador** para Guardar en todas las pantallas (el corazón queda para "Me gusta"). 44 px sobre foto, 36 px en listas.

#### `.cat` (categoría)

- **Hoy:** `font-size: .7rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--brand)`.
- **En el prototipo:** `#C23A24`; `.7rem` en Bienvenida, Agenda, Main, Perfil y Evento; `.68rem` en Mapa y en la ventana de repost; `.66rem` en el Chat. Main agrega " · Gratis" a los eventos sin precio (ej. "Conciertos · Gratis").
- **Implementar:** un tamaño (`.7rem`) y el sufijo "· Gratis" como regla del dato.

#### `.card h3` (título de tarjeta)

- **Hoy:** `font-size: 1.05rem; font-weight: 700; line-height: 1.25; margin: 4px 0 6px; text-wrap: balance`; es un `h3`.
- **En el prototipo:** **ya no es un encabezado**: es un `<a href="Evento.dc.html">` con el mismo estilo (Bienvenida, Agenda, Perfil). Mapa: `.98rem`, `margin: 2px 0 3px`. Evento (parecidos): `.98rem`, `margin: 4px 0`. Main (adjunto) y Chat usan Archivo 800 (`1.15rem` / `1.02rem`).
- **Implementar:** `h3` que contiene el enlace (recupera la navegación por encabezados, H59) y `text-wrap: balance`. Hacer clicable toda la tarjeta con un solo enlace (no varios).

#### `.where` (lugar)

- **Hoy:** `font-size: .85rem; color: var(--muted)`; texto "{lugar} · {barrio}".
- **En el prototipo:** igual, más " · " y la **ciudad en `#17120F` 700** (ej. "Galería Café Libro · Zona T · **Bogotá**"). Mapa: `.8rem; line-height: 1.35` sin negrita. Main: "{Día} {d} oct · {hora} · {lugar, barrio} · **{ciudad}**".
- **Implementar:** tal cual, con la ciudad en negrita.

#### `.going` (amigos que van)

- **Hoy:** `display: flex; align-items: center; gap: 8px; font-size: .78rem; color: var(--muted); margin-top: 10px`; avatares de 24 px con borde 2 px blanco, solape −7 px, `font-size: .58rem`; texto "{n} amigo va" / "{n} amigos van"; no aparece si `n = 0`.
- **En el prototipo (tres variantes):**
  - **Bienvenida:** ícono de personas de 14 px + "{van} van" + " · {n} parche abierto/parches abiertos" si hay (ej. "186 van · 3 parches abiertos", "1.200 van · 8 parches abiertos", "210 van"); `gap: 6px`.
  - **Agenda:** 2 círculos de 22 px sin iniciales (borde 2 px blanco, solape −7 px) + "{quién} y {r−1} más lo repostearon" (ej. "Laura y 13 más lo repostearon"); si reposteaste: "Tú, {quién} y {r+1−2} más lo repostearon" (ej. "Tú, Andrés y 30 más lo repostearon").
  - **Main:** 3 círculos de 24 px (solape −8 px) + "{van} van · 3 amigos" (`.8rem`; "· 3 amigos" es texto fijo, H37).
- **Implementar:** componente LíneaSocial con variantes `van`, `repost` y `amigos`. Datos reales, no fijos (H37).

#### `.buy`, `.price` (precio y compra)

- **Hoy:** `.buy { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-top: auto; padding-top: 14px; }`; `.price { font-weight: 700; font-size: .95rem; font-variant-numeric: tabular-nums; }`; `small { display: block; font-weight: 400; font-size: .72rem; color: var(--muted); }` con la boletera. Precio "Desde $45.000" o "Gratis".
- **En el prototipo:** igual sin `tabular-nums`. Mapa: `.88rem; line-height: 1.2`, boletera `.7rem`, `margin-top: 8px`. Textos de boletera: "TuBoleta", "Idartes", "Ticketmaster", "Fever", "Entrada libre".
- **Implementar:** recuperar `tabular-nums`. **H21:** el precio mostrado debe aclarar el cargo ("Desde $45.000 + cargo por servicio" o "Desde $48.600 con cargos"), igual en todas las pantallas. **H1:** las marcas reales van como `[BOLETERA]` o con "Contenido de ejemplo"; el texto depende del canal de venta del evento (P1).

#### `.ticket` (botón de compra)

- **Hoy:** `display: inline-flex; align-items: center; gap: 6px; background: var(--brand); color: #fff; border-radius: 999px; padding: 9px 14px; font-size: .82rem; font-weight: 700; white-space: nowrap`; hover `--brand-hover`. Con precio: `<a href="https://www.tuboleta.com" target="_blank" rel="noopener">Boletas</a>` + flecha externa de 13 px; gratis: "Ver plan" (`href="#"`). **(medido)** 95,1 × 37,7 px.
- **En el prototipo:** fondo **`#C23A24`** (contraste 5,35:1 frente a 4,34:1); texto **"Comprar"** (con precio) o **"Ver plan"** (gratis), sin flecha externa, y **lleva a la página del evento** (`Evento.dc.html`), ya no a tuboleta.com (decisión 2.10). Nombre accesible "Comprar boletas para {título}" / "Ver plan: {título}". Alturas: Bienvenida `min-height: 44px; padding: 11px 15px`; Agenda `min-height: 40px; padding: 10px 14px`; Mapa `height: 36px; padding: 0 14px; font-size: .8rem`. Sin hover.
- **Implementar:** variante "primario pequeño" de N69, con un solo alto (recomendado 40 px; 44 px en celular). **H36:** cada tarjeta abre **su** evento. **P1/H1:** el texto depende del modo de compra: "Ver plan" (gratis), "Comprar en [BOLETERA]" (externo, con flecha y aviso de que sale del sitio) o "Comprar" (venta propia).

#### `.empty` (estado vacío)

- **Hoy:** `grid-column: 1 / -1; text-align: center; color: var(--muted); padding: 40px 0`; "No hay planes en esta categoría este finde."
- **En el prototipo:** caja punteada con acción (N67): `text-align: center; padding: 40px 16px; background: #FFFFFF; border: 1px dashed #EAE1D8; border-radius: 18px` + mensaje (`margin: 0 0 14px`) + botón "Ver todos los planes del país".
- **Implementar:** N67.

#### `footer`

- **Hoy:** `margin-top: 72px; border-top: 1px solid var(--line); padding-block: 28px 40px; font-size: .85rem; color: var(--muted)`; fila `.wrap` con `display: flex; flex-wrap: wrap; gap: 12px 28px; justify-content: space-between`. Textos: "© 2026 Fulleventos · Bogotá, Colombia" y "Las boletas se compran en las boleteras oficiales. Fulleventos no vende entradas."
- **En el prototipo:** Bienvenida (`margin-top: 72px`), Agenda y Evento (sin margen superior), Mapa (`padding: 24px clamp(16px, 4vw, 24px) 36px; gap: 10px 28px`). Textos **nuevos**: "© 2026 Fulleventos · Colombia" y "Compra segura dentro de Fulleventos. Las boletas las emite la boletera oficial del evento o el organizador." Main no tiene pie: el texto va como párrafo `.76rem` al final de la columna derecha, con "· Contenido de ejemplo". Registro, Chat y Perfil no tienen pie.
- **Cambios:** alcance nacional y nuevo texto legal (decisión 2.10).
- **Implementar (obligatorio, H5):** pie legal en **todas** las pantallas con `[RAZÓN SOCIAL]`, NIT, dirección, teléfono, correo, PQR, enlace a sic.gov.co, Términos y Política de tratamiento; acceso a lo legal desde el menú o el perfil en Main, Chat y Perfil. **H1:** quitar el absoluto "Compra segura dentro de Fulleventos" si el evento se vende por redirección; condicionar el texto al canal.

#### `:focus-visible`

- **Hoy:** `:focus-visible { outline: 3px solid var(--brand); outline-offset: 2px; }` global.
- **En el prototipo:** ver R2.
- **Implementar:** R2 (color `#C23A24`, amarillo sobre oscuro; `:focus-within` en campos).

#### `@media (max-width: 1080px | 820px | 520px)`

- **Hoy:** 1080: rejilla de 3 columnas y `.pulse` en 1 columna. 820: se ocultan los enlaces de `.nav`, el encabezado hace salto de línea (alto automático, `padding-block: 12px`, `gap: 12px`), el buscador pasa a su propia línea, el héroe compacta su relleno y radio, la etiqueta pierde su sangría, el titular pierde sus sangrías, las noticias pasan a 1 columna y la rejilla a 2 (`gap: 14px`). 520: `.wrap` de 16 px, rejilla de 1 columna y el nombre de la ciudad se oculta.
- **En el prototipo:** casi todo se resuelve con `flex-wrap`, bases `flex`, `auto-fill`/`auto-fit` y `clamp()`. Solo hay `@media` en Chat (`min-width: 900px`, `min-width: 1180px`, `max-width: 1179px`, `max-width: 899px`), Evento (`min-width: 980px`, `max-width: 979px`) y Mapa (`min-width: 1100px` y `@container (max-width: 420px)`). Main no tiene ninguno (H15) y Bienvenida no oculta la ciudad (H8).
- **Implementar:** conservar las rejillas automáticas y agregar los puntos de quiebre que exige la auditoría: encabezado móvil de una fila + barra inferior (H40), feed primero en Main (≈1120 px y tableta, H15), buscador de Bienvenida sin desborde (H8), mapa con hoja inferior por debajo de 980 px (H42), checkout por altura (H6). Ver cada componente.

#### `@media (prefers-reduced-motion: reduce)`

- **Hoy:** `.card { transition: none; } .card:hover { transform: none; }`.
- **En el prototipo:** Mapa y Chat: `[data-fx]{transition:none !important}` (zoom y desplazamiento de pines, líneas guía, barras de progreso y encuesta, interruptor de silenciar).
- **Implementar:** R5.

#### JavaScript: arreglo `events`

- **Hoy:** 8 eventos de Bogotá con `t` (título), `cat`, `tags`, `d` (día), `m` (mes, "oct"), `v` (lugar), `p` (precio), `b` (boletera), `bg` ([color de luz, color de fondo]), `f` (clases de avatar de amigos) y `n` (amigos que van). Incluye "Techno hasta el amanecer" y "Obra: La casa de Bernarda Alba", que el prototipo ya no usa como eventos del finde (aparecen como Recuerdos en Perfil).
- **En el prototipo:** modelo nacional de **19 eventos en 11 ciudades** con `id` (`e1`…`e19`), `t`, `cat`, `tags`, `city`, `d`, `v`, `p`, `b`, `bg1`, `bg2` (copiado en Bienvenida, Agenda, Main y Mapa; copias parciales en Evento, Chat y Perfil, H53). Ciudades con `id`, `name` y posición en porcentaje (`left`, `top`) para el mapa. Datos sociales por pantalla: `social` (van, parches abiertos) en Bienvenida; `who`, `r`, `c1`, `c2`, `fr` (repost) en Agenda. `m` desapareció (el mes "oct" está escrito en la plantilla).
- **Implementar:** un solo modelo de datos en el servidor (evento con zona `America/Bogota`, estado, edad mínima, PULEP, fuente de venta y enlace externo; lugar con coordenadas; ciudad; localidad; parche…) según H53. El detalle de los 19 eventos está en la sección de datos del handoff.

#### JavaScript: `cop()` (formato de pesos)

- **Hoy:** `const cop = n => n === 0 ? 'Gratis' : '$' + n.toLocaleString('es-CO');` y el prefijo "Desde " si hay precio.
- **En el prototipo:** tres formas distintas: en las tarjetas `e.p ? 'Desde $' + e.p.toLocaleString('es-CO') : 'Gratis'` (Bienvenida, Agenda, Mapa); en Evento `cop = (n) => '$' + Math.round(n).toLocaleString('es-CO')` (sin "Gratis") y `'Desde ' + cop(p)` en parecidos; en Chat `fmt = (n) => n.toLocaleString('es-CO')` con "Desde $" escrito a mano. Resultado igual: "$45.000", "$180.000", "$97.200".
- **Implementar:** una sola función `formatCOP(n)` (redondeo, separador de miles con punto, sin decimales) y una `priceLabel(evento)` ("Gratis" / "Desde $45.000" + aclaración de cargo H21). Los montos se calculan en el servidor (H3).

#### JavaScript: `render(filter)` y filtros por chip

- **Hoy:** filtra `events` por `tags.includes(filter)` (o todos con `'all'`), pinta las tarjetas con `innerHTML` y, si no hay resultados, `<p class="empty">No hay planes en esta categoría este finde.</p>`. Los chips: al hacer clic ponen todos en `aria-pressed="false"`, el tocado en `"true"` y llaman a `render(chip.dataset.f)`.
- **En el prototipo:** estado declarativo en `renderVals()`:
  - Filtros combinados: categoría **y** ciudad (chips de ciudad o selector del encabezado sincronizados).
  - "Planes con amigos" (Bienvenida) = eventos con al menos un parche abierto; "Lo que repostea tu gente" (Agenda) = eventos con `fr: true`.
  - **Orden intercalado por ciudad** (Bienvenida y Agenda): se toma el 1.º de cada ciudad en el orden Bogotá, Medellín, Cali, Barranquilla, Cartagena, Santa Marta, Bucaramanga, Pereira, Villavicencio, Pasto, Leticia; luego el 2.º de cada una, etc. Así la primera fila ya muestra el país.
  - Bienvenida limita a **8** tarjetas con "Ver {n} planes más" / "Ver 1 plan más" / "Ver menos planes" (`aria-expanded`); cambiar cualquier filtro vuelve a 8.
  - Mapa ordena por ciudad y luego por día.
  - Conteos por ciudad: en Agenda reflejan la categoría elegida; en Bienvenida son totales (no cambian con la categoría).
- **Implementar:** filtros en la URL (`?ciudad=cali&cat=rumba`, H42), paginación desde la base (unos 20 por página con "Cargar más", H47), y los filtros de fecha **deben filtrar** (H39).

#### JavaScript: alternadores Guardar y Me uno

- **Hoy:** un solo listener en `document` que, para `.save` o `.join`, invierte `aria-pressed`; en `.join` cambia el texto a "Vas" / "Me uno". El estilo sale del atributo (`[aria-pressed="true"]`).
- **En el prototipo:** cada pantalla guarda objetos de estado (`saved`, `liked`, `going`, `joined`, `follow`, `reposted`, `interested`…) y calcula `aria-pressed`, texto y colores. No persisten entre pantallas.
- **Implementar:** conservar el patrón `aria-pressed` + estilo por atributo; persistir en el servidor con actualización optimista y reversión si falla (no diseñado: falta el estado de error, H17).

### Componentes nuevos

Cada componente sigue el mismo orden: **Anatomía**, **Variantes y props**, **Estados**, **Estilos exactos**, **Accesibilidad**, **Pantallas** y **Marcado mínimo**. En "Estados", "No diseñado" significa que el prototipo no lo dibuja; si la auditoría lo exige se cita el hallazgo. El hover y el foco siguen R1 y R2 salvo que se diga otra cosa. El marcado mínimo muestra estructura y atributos de accesibilidad, no estilos (las clases son sugeridas); ya incorpora las correcciones de la auditoría (radios, `<dialog>`, `aria-disabled`, encabezados), por eso puede diferir del marcado del prototipo. Se da para todos los componentes de la lista mínima del catálogo; los bloques que son variantes o partes de otro (por ejemplo N5 dentro de N1, N23 de N18, N64 de N15) remiten al componente base, y en los demás bloques secundarios la anatomía y los estilos exactos hacen las veces de especificación.

---

#### N1 · Encabezado con sesión (y sus variantes)

**Anatomía.** Contenedor fijo con borde inferior → fila (`max-width: 1240px`) con: logo · buscador con ciudad (N4) · navegación por íconos (N5) · botón "Crear evento" · avatar del usuario.

**Variantes y props** (`variant`, `activePage`, `unreadCount`, `backHref`):

| Variante | Pantallas | Contenido | Fijo |
|---|---|---|---|
| `completo` | Main, Agenda, Mapa, Chat | Logo (`1.55rem`, a Inicio) · buscador (`flex: 1 1 260px; max-width: 500px; min-width: 0`) · íconos Inicio, Agenda, Mapa, Mensajes, Notificaciones · "Crear evento" · avatar "CV" | Sí (`z-index: 5`; Mapa `70`; Chat solo desde 900 px) |
| `detalle` | Evento | "Volver al feed" · logo centrado (`margin-inline: auto`) · íconos Inicio, Agenda, Mapa, Mensajes, Notificaciones · avatar (sin buscador ni "Crear evento"; ningún ícono activo) | Sí (`z-index: 5`) |
| `detalle-perfil` | Perfil | "Volver al feed" · logo centrado · píldora "Mapa" · círculo de Mensajes con borde e insignia | **No** |

- "Volver al feed": `<a href="Main.dc.html">` con `display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: .92rem; height: 44px` y chevrón de 18 px (`M15 18l-6-6 6-6`, trazo 2).
- "Crear evento": ver `.btn-dark` (44 px, `padding: 0 18px`, `margin-left: 6px`).
- Avatar: `<a href="Perfil.dc.html" aria-label="Tu perfil">` de 40 × 40, círculo `#8FD3D0`, "CV" DM Sans 700 `.78rem`, `margin-left: 4px`.
- Píldora "Mapa" (Perfil): `height: 44px; box-sizing: border-box; border-radius: 999px; padding: 0 16px; border: 1px solid #EAE1D8; background: #FFFFFF; display: inline-flex; align-items: center; gap: 6px; font-size: .88rem; font-weight: 700` + ícono de mapa 18 px.
- Círculo de Mensajes (Perfil): 44 × 44, `border: 1px solid #EAE1D8; background: #FFFFFF; border-radius: 50%`, insignia en `top: -3px; right: -3px`.

**Estados.**
- Página activa: el ícono correspondiente lleva `aria-current="page"`, fondo `#17120F` y color `#FFFFFF`.
- Hover: R1 (íconos y "Volver al feed" pasan a `#C23A24`; el avatar cambia solo las letras; el activo y el logo no cambian).
- Foco: R2 (en Main y Agenda, foco del navegador).
- "Notificaciones" y "Crear evento": **sin acción** (H38, H54). Necesitan un panel de notificaciones y un destino.
- Cargando / error: No diseñado.

**Estilos exactos.** Contenedor `position: sticky; top: 0; z-index: 5; background: #FBF7F3; border-bottom: 1px solid #EAE1D8`. Fila `max-width: 1240px; margin: 0 auto; padding: 12px 24px` (Mapa y Evento `12px clamp(16px, 4vw, 24px)`); `display: flex; flex-wrap: wrap; align-items: center; gap: 12px 20px`. Nav `margin-left: auto; display: flex; flex-wrap: wrap; justify-content: flex-end; align-items: center; gap: 6px`. En Perfil, el grupo derecho es `display: flex; align-items: center; gap: 8px`.

**Responsive (medido en Agenda y Evento).** `completo`: 1 fila (69 px) desde 907 px; 2 filas (125 px) de 482 a 906 px; 3 filas (171 px) de 453 a 481 px; 4 filas por debajo (220,2 px de 432 a 452 px y 224,2 px hasta 431 px: logo / buscador / 5 íconos / "Crear evento" + avatar). `detalle` (Evento): 1 fila (69 px) desde 631 px, 2 filas (125 px) de 326 a 630 px, 3 filas (171 px) por debajo de 326 px. `detalle-perfil`: 1 fila (69 px) desde 485 px, 2 filas (125 px) por debajo. Chat: `position: static` por debajo de 900 px. **Obligatorio (H40, H41, H16):** un solo componente de encabezado con sesión con variante "detalle"; en celular, una fila de 56 a 64 px (logo, lupa, avatar) que se esconda al bajar + barra inferior de 5 pestañas con texto (Inicio, Agenda, Mapa, Mensajes, Perfil); "Volver" regresa a la pantalla de origen (no siempre al feed); `scroll-padding-top` igual al alto del encabezado.

**Accesibilidad.** `<nav aria-label="Principal">`. Íconos con `aria-label`: "Inicio", "Agenda de eventos", "Mapa de eventos", "Mensajes, 3 sin leer" (Chat: "Mensajes, {n} chats sin leer" / "Mensajes, 1 chat sin leer" / "Mensajes"), "Notificaciones". La insignia es `aria-hidden="true"` (el número va en el nombre del enlace). **H59:** el avatar debe llamarse empezando por el texto visible ("CV, tu perfil"). Agregar enlace "Saltar al contenido" (H59).

**Pantallas.** Main, Agenda, Mapa, Chat (`completo`); Evento (`detalle`); Perfil (`detalle-perfil`).

```html
<header class="app-header" data-variant="completo">
  <div class="wrap">
    <a href="/inicio" class="logo">fulleventos</a>
    <form role="search" class="search">…</form>  <!-- N4 dentro -->
    <nav aria-label="Principal" class="icon-nav">
      <a href="/inicio" aria-label="Inicio" aria-current="page">…</a>
      <a href="/agenda" aria-label="Agenda de eventos">…</a>
      <a href="/mapa" aria-label="Mapa de eventos">…</a>
      <a href="/mensajes" aria-label="Mensajes, 3 sin leer">…<span class="badge" aria-hidden="true">3</span></a>
      <button type="button" aria-label="Notificaciones">…</button>
      <a href="/crear-evento" class="btn btn-dark">Crear evento</a>
      <a href="/perfil" class="avatar" aria-label="CV, tu perfil">CV</a>
    </nav>
  </div>
</header>
```

---

#### N2 · Encabezado de visitante

**Anatomía.** Logo (a la landing) · buscador con ciudad y botón redondo de buscar · navegación de texto ("Cómo funciona", "Mapa" + "Nuevo", "Agenda", "Entrar", "Crear cuenta").

**Variantes y props.** `links`, `ctaHref`. Una sola variante en el prototipo.

**Estados.** Hover R1 en los enlaces de texto ("Crear cuenta" y "Nuevo" no cambian por su color en línea). Foco del navegador (R2). El botón Buscar no hace nada (H38).

**Estilos exactos.** `position: sticky; top: 0; z-index: 5; background: #FBF7F3` (sin borde). Fila `max-width: 1240px; margin: 0 auto; padding: 14px 24px; display: flex; flex-wrap: wrap; align-items: center; gap: 12px 24px`. Logo `1.6rem`. Buscador: ver `.search` (`flex: 1 1 300px; max-width: 520px; padding: 4px 4px 4px 18px; gap: 10px`, sin `min-width: 0`). Nav `margin-left: auto; display: flex; flex-wrap: wrap; align-items: center; gap: 8px 20px; font-size: .92rem; font-weight: 500`. "Mapa" `display: inline-flex; align-items: center; gap: 6px` + insignia "Nuevo" (`background: #F6DC6A; color: #17120F; border-radius: 999px; padding: 1px 7px; font-size: .68rem; font-weight: 700; line-height: 1.4`). "Entrar" `font-weight: 700`. "Crear cuenta" `background: #17120F; color: #FFFFFF; border-radius: 999px; padding: 11px 18px; font-weight: 700`.

**Responsive (medido).** 78 px a 1280, 134,1 px a 768, 214,5 px a 390. **Desborde a 473 px** de 320 a 430 px: el botón Buscar queda fuera de la pantalla y la ciudad se corta (H8). **Obligatorio:** `min-width: 0` en el buscador y, por debajo de unos 480 px, ciudad en otra línea o como ícono; encabezado compacto de una fila en celular o sin `sticky` por debajo de unos 768 px (H16, H40).

**Accesibilidad.** `<nav aria-label="Principal">`; buscador con `aria-label="Buscar planes"`; botón "Buscar" con `aria-label`.

**Pantallas.** Bienvenida. **H33:** también debe usarse en las versiones públicas de Agenda, Mapa y Evento (hoy un visitante cae en pantallas con el avatar de Camila).

```html
<header class="site-header">
  <div class="wrap">
    <a href="/" class="logo">fulleventos</a>
    <form role="search" class="search">…<button type="submit" class="go" aria-label="Buscar">…</button></form>
    <nav aria-label="Principal">
      <a href="#como-funciona">Cómo funciona</a>
      <a href="/mapa">Mapa <span class="pill-new">Nuevo</span></a>
      <a href="#agenda">Agenda</a>
      <a href="/entrar" class="strong">Entrar</a>
      <a href="/registro" class="btn btn-dark">Crear cuenta</a>
    </nav>
  </div>
</header>
```

---

#### N3 · Encabezado mínimo de registro

**Anatomía.** Logo (a la landing) · "¿Ya tienes cuenta? Entrar".

**Estilos exactos.** `<header>` no fijo: `max-width: 1240px; margin: 0 auto; padding: 14px 24px; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px`. Logo `1.6rem`. Texto `font-size: .9rem; color: #6E6259`: "¿Ya tienes cuenta? " + enlace "Entrar" (`font-weight: 700; color: #17120F; border-bottom: 2px solid #17120F`). **(medido)** 66,4 px de alto en los tres anchos.

**Estados.** "Entrar" lleva hoy al feed (`Main.dc.html`); **H12:** debe abrir la pantalla de inicio de sesión.

**Pantallas.** Registro (y futura pantalla "Entrar", H12).

```html
<header class="auth-header">
  <a href="/" class="logo">fulleventos</a>
  <p>¿Ya tienes cuenta? <a href="/entrar" class="more">Entrar</a></p>
</header>
```

---

#### N4 · Selector de ciudad

**Anatomía.** `<label>` con borde izquierdo → pin de 16 px · texto oculto "Ciudad" · `<select name="ciudad">`.

**Variantes y props.** `value` (`all` | id de ciudad), `onChange`, `size` (`md` 36 px | `lg` 40 px en Bienvenida).

Opciones exactas (en este orden): `all` "Toda Colombia", `bogota` "Bogotá", `medellin` "Medellín", `cali` "Cali", `barranquilla` "Barranquilla", `cartagena` "Cartagena", `santamarta` "Santa Marta", `bucaramanga` "Bucaramanga", `pereira` "Pereira", `villavicencio` "Villavicencio", `pasto` "Pasto", `leticia` "Leticia".

**Comportamiento por pantalla.**
- Bienvenida: elige la ciudad de los chips (N18) y vuelve a 8 tarjetas.
- Main: filtra el feed por la ciudad del evento; muestra la franja N11 o el estado vacío.
- Agenda: igual que tocar el chip de ciudad (sincronizados); el título pasa a "Este finde en {Ciudad}".
- Mapa: con una ciudad, la selecciona y hace zoom (como tocar su pin); con "Toda Colombia", reinicia el mapa. El valor mostrado sigue a la ciudad elegida en el mapa.
- Chat: guarda el valor pero **no hace nada** (H38).
- Cada pantalla arranca en "Toda Colombia": la elección no viaja entre pantallas.

**Estados.** Default "Toda Colombia". Foco: `select:focus-visible` con 3 px `#C23A24` en Mapa y Chat; foco del navegador en las demás. Abierto: lista nativa del sistema. Deshabilitado / error: No diseñado.

**Estilos exactos.** Label `display: flex; align-items: center; gap: 4px; padding-left: 10px` (Bienvenida `12px`); `border-left: 1px solid #EAE1D8; font-size: .9rem; white-space: nowrap; flex-shrink: 0`. Texto oculto: `position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap`. Select `height: 36px` (Bienvenida `40px`); `max-width: 8.6em; border: 0; background: transparent; font-size: .9rem; font-weight: 500; color: #17120F; cursor: pointer` (flecha nativa).

**Accesibilidad.** Nombre "Ciudad" por la etiqueta oculta. Al cambiar, anunciar el resultado en una región viva ("Mostrando 6 planes en Bogotá", H49).

**Pantallas.** Bienvenida, Main, Agenda, Mapa, Chat.

**Implementar.** Ciudad global del usuario (persistida y en la URL, H42), coherente con "Mi ciudad" del mapa y con la ciudad pedida en el registro (H45).

```html
<label class="city-select">
  <svg aria-hidden="true">…</svg>
  <span class="sr-only">Ciudad</span>
  <select name="ciudad">
    <option value="all">Toda Colombia</option>
    <option value="bogota">Bogotá</option>
    <!-- … 10 más -->
  </select>
</label>
```

---

#### N5 · Navegación por íconos con insignia

**Anatomía.** Enlaces cuadrados de 44 px con ícono de 20 px (trazo 2, `stroke-linecap/linejoin: round`) + insignia de no leídos en Mensajes + botón de Notificaciones.

**Íconos (rutas SVG exactas, `viewBox="0 0 24 24"`).**
- Inicio: `M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z`.
- Agenda: `<rect x="3" y="5" width="18" height="16" rx="2">` + `M3 10h18M8 3v4M16 3v4`.
- Mapa: `M9 4 3 6.5V20l6-2.5 6 2.5 6-2.5V4l-6 2.5z` + `M9 4v13.5M15 6.5V20`.
- Mensajes: `M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z`.
- Notificaciones: `M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9` + `M10.3 21a1.9 1.9 0 0 0 3.4 0`.

**Variantes y props.** `active` (una página), `unread` (número), `labels` (solo íconos en escritorio; con texto en la barra inferior móvil, H40).

**Estados.** Default (ícono `#17120F`, sin fondo); activo (`aria-current="page"`, fondo `#17120F`, ícono `#FFFFFF`); hover R1 (ícono `#C23A24`, sin fondo); foco R2. Insignia oculta cuando no hay no leídos (solo Chat la calcula; las demás dicen "3" fijo).

**Estilos exactos.** Enlace `width: 44px; height: 44px; border-radius: 12px; display: grid; place-items: center` (Mensajes con `position: relative`). Botón de notificaciones igual + `border: 0; background: transparent; color: #17120F`. Insignia: `position: absolute; top: 6px; right: 6px; min-width: 18px; height: 18px; box-sizing: border-box; border-radius: 9px; background: #C23A24; color: #FFFFFF; font-size: .66rem; font-weight: 700; line-height: 1; display: grid; place-items: center; padding: 0 4px`. En Chat (ícono activo): `top: 4px; right: 4px; box-shadow: 0 0 0 2px #17120F`.

**Accesibilidad.** Ver N1. El conteo va en `aria-label` del enlace; la insignia es `aria-hidden`.

**Pantallas.** Main, Agenda, Mapa, Chat, Evento (Perfil usa la variante con borde, N1).

**Marcado mínimo.** Ver el bloque `<nav aria-label="Principal" class="icon-nav">` de N1.

---

#### N6 · Insignias y etiquetas en píldora

| Insignia | Estilo exacto | Texto | Dónde |
|---|---|---|---|
| Contador de no leídos (encabezado) | ver N5 (18 px) | "3" | Encabezados |
| Contador de no leídos (menú lateral) | `margin-left: auto; min-width: 22px; height: 22px; border-radius: 999px; background: #C23A24; color: #FFFFFF; padding: 0 7px; font-size: .72rem; font-weight: 700; line-height: 1` | "3" | Main |
| Contador de no leídos (lista de chats) | `min-width: 20px; height: 20px; border-radius: 10px; background: #C23A24; color: #FFFFFF; font-size: .7rem; font-weight: 700; padding: 0 6px` | "3", "1" | Chat |
| "Nuevo" (navegación) | `#F6DC6A`, `padding: 1px 7px; font-size: .68rem; font-weight: 700; line-height: 1.4; border-radius: 999px` | "Nuevo" | Bienvenida |
| "Nuevo" (menú lateral) | `margin-left: auto; background: #F6DC6A; border-radius: 999px; padding: 1px 8px; font-size: .7rem; font-weight: 700` | "Nuevo" | Main |
| "Nuevo" (tarjeta) | `background: #F6DC6A; border-radius: 999px; padding: 2px 9px; font-size: .72rem; font-weight: 700` | "Nuevo" | Main (mini-mapa) |
| "En venta" | `background: #B9E07A; border-radius: 999px; padding: 4px 10px; font-size: .74rem; font-weight: 700` | "En venta" | Evento (tarjeta de compra) |
| Estado de plan | `position: absolute; top: 12px; right: 12px; background: #17120F; color: #FFFFFF; border-radius: 999px; padding: 4px 10px; font-size: .74rem; font-weight: 700` | "Va", "Le interesa", "En parche" | Perfil |
| "Plato fuerte" | `background: #17120F; color: #FFFFFF; border-radius: 999px; padding: 2px 9px; font-size: .7rem; font-weight: 700; letter-spacing: .04em; text-transform: uppercase` | "Plato fuerte" | Evento (programación) |
| Pocas boletas | `display: inline-block; margin-top: 6px; background: #C23A24; color: #FFFFFF; border-radius: 999px; padding: 2px 10px; font-size: .72rem; font-weight: 700` | "Últimas 12" | Evento (lista de precios) |
| "Reposteaste" | ver N15 | "Reposteaste" | Agenda |
| Organizador | `background: #F6DC6A; border-radius: 999px; padding: 2px 9px; font-size: .72rem; font-weight: 700` | "Organizador · Responde en ~1 h" | Chat |
| Píldora de evento | ver N47 | "Vie 9 oct · Salsa" | Chat |
| Pago pendiente | `background: #F6DC6A; border-radius: 999px; padding: 3px 10px; font-size: .74rem; font-weight: 700` | "Link enviado · pendiente" | Evento (paso 4) |
| Personas del parche | `background: #FBF7F3; border-radius: 999px; padding: 4px 10px; font-size: .8rem; font-weight: 700` | "Van {n}" (ej. "Van 2") | Evento (checkout) |

**Implementar.** Un componente Badge con `tone` (`accent` rojo, `highlight` amarillo, `success` verde, `dark`, `neutral`) y `size`. **H62:** "Nuevo" aparece en 5 lugares relacionados con el mapa: limitarlo. Toda insignia que cambie un número debe ir acompañada de texto accesible.

---

#### N7 · Barra lateral de perfil (Main, columna izquierda)

**Anatomía.** `<aside aria-label="Tu cuenta">` en columna (`flex: 1 1 220px; max-width: 260px; display: flex; flex-direction: column; gap: 16px`) con tres bloques:

1. **Tarjeta de cuenta** (`background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 20px; padding: 18px; display: flex; flex-direction: column; gap: 14px`):
   - Enlace a Perfil (`display: flex; align-items: center; gap: 12px`): avatar de 48 px `#8FD3D0` "CV" (700) + "Camila Vargas" (`b`) y "@camivargas" (`.85rem`, `#6E6259`) en columna con `line-height: 1.25`.
   - Estadísticas: `display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; text-align: center`; número `b` `display: block; font-size: 1.05rem` + rótulo `.74rem` `#6E6259`: "38" "Planes", "412" "Seguidores", "289" "Siguiendo".
2. **Menú "Secciones"** (`<nav aria-label="Secciones">`, `display: flex; flex-direction: column; gap: 2px; font-weight: 500`). Cada ítem `display: flex; align-items: center; gap: 12px; padding: 11px 14px; border-radius: 12px` con ícono de 18 px:
   - "Inicio" (activo: `aria-current="page"`, `background: #FFFFFF; border: 1px solid #EAE1D8; font-weight: 700`).
   - "Explorar agenda" (ícono de **lupa**; a Agenda).
   - "Mapa de eventos" + insignia "Nuevo" (a Mapa; en dos líneas cuando la columna mide 220 px).
   - "Mis parches" (ancla `#parches`; ícono de personas).
   - "Mensajes" + contador "3" (a Chat; `aria-label="Mensajes, 3 sin leer"`).
   - "Guardados" (ícono de marcador; a Perfil).
   - "Recuerdos" (ícono de foto; a Perfil).
3. **"Tus parches"** (`id="parches"`; tarjeta igual, `gap: 12px`): título `h2` `margin: 0; font-size: .78rem; letter-spacing: .12em; text-transform: uppercase; color: #C23A24`; tres enlaces a Chat (`display: flex; align-items: center; gap: 10px`) con avatar cuadrado de 36 px (`border-radius: 10px`, Archivo 900 `.8rem`) y texto (`line-height: 1.25`; nombre `b .9rem`; detalle `display: block; .78rem; #6E6259`):
   - "SL" `#F6DC6A` — "Salseros de jueves" — "12 miembros · 2 nuevos".
   - "RK" `#A3A8F0` — "Rockeros del Arena" — "8 miembros".
   - "CC" `#B9E07A` — "Clásico capitalino" — "4 de 6 cupos".

**Estados.** Ítem activo (fondo blanco con borde); hover R1 en todos los enlaces (también las iniciales de los avatares); foco del navegador. "Guardados" y "Recuerdos" llevan al perfil general (no hay sección propia). Vacío ("aún no tienes parches"): No diseñado.

**Accesibilidad.** Dos `nav` con nombre distinto ("Principal" y "Secciones"). **H62:** "Mis parches" y "Tus parches" en la misma columna: unificar. **H37:** "Planes 38" aquí vs. "Eventos 38" en el perfil; "4 de 6 cupos" no se actualiza al unirse desde el post. **H20/H46:** falta "Mis boletas" en este menú.

**Responsive (medido).** No tiene reglas propias. Desde 1116 px van las 3 columnas en fila. Entre 812 y 1115 px esta columna **sigue a la izquierda del feed** (solo "Descubre" baja al final). Por debajo de 812 px se apila **encima** del feed, a todo el ancho pero con `max-width: 260px` (primer post en y = 1443 a 390 × 844 px). **Obligatorio (H15):** en tableta y celular este bloque no va antes del feed; el menú pasa a la barra inferior (H40) y "Tus parches" a otra ubicación (por ejemplo, Mensajes).

**Pantallas.** Main.

```html
<aside aria-label="Tu cuenta">
  <section class="card account">…</section>
  <nav aria-label="Secciones">
    <a href="/inicio" aria-current="page">…Inicio</a>
    <a href="/mensajes" aria-label="Mensajes, 3 sin leer">…Mensajes <span class="count" aria-hidden="true">3</span></a>
  </nav>
  <section class="card" id="parches" aria-labelledby="tp"><h2 id="tp">Tus parches</h2>…</section>
</aside>
```

---

#### N8 · Historias

**Anatomía.** Fila con scroll horizontal de enlaces: anillo de 68 px → círculo con iniciales → nombre y ciudad.

**Variantes y props.** `ring`: `nuevo` (degradado `linear-gradient(135deg, #F3B27E, #D9452F)`) o `visto` (`#EAE1D8`); el primer ítem es "Tu plan" (fondo blanco, "+", anillo gris).

Datos exactos (iniciales, nombre, ciudad, color, anillo): "+" "Tu plan" (sin ciudad, `#FFFFFF`, gris, `aria-label="Sube tu plan"`); "LM" "Laura" "Bogotá" `#F3B27E` nuevo; "AR" "Andrés" "Medellín" `#A3A8F0` nuevo; "NH" "Nata" "Barranquilla" `#F6DC6A` nuevo; "CR" "Caro" "Cali" `#EE93BC` nuevo; "SB" "Sebas" "Santa Marta" `#8FD3D0` visto; "MJ" "Majo" "Pereira" `#B9E07A` visto; "DR" "Dani" "Leticia" `#A3A8F0` visto.

**Estados.** Default; hover R1 (las iniciales se ponen rojas; nombre y ciudad no); foco del navegador. Todas llevan a `Evento.dc.html` (H36: "Tu plan" debe abrir el compositor). Visto/no visto solo por color del anillo (no hay texto que lo diga). Vacío: No diseñado.

**Estilos exactos.** Fila `display: flex; gap: 14px; overflow-x: auto; padding-bottom: 4px` (siempre hace scroll: 738 px de contenido). Ítem `<a>` `flex: 0 0 auto; width: 80px; display: flex; flex-direction: column; align-items: center; gap: 6px; text-align: center`. Anillo `width: 68px; height: 68px; border-radius: 50%; padding: 3px; background: {ring}; display: grid; place-items: center`. Círculo `width: 100%; height: 100%; border-radius: 50%; border: 3px solid #FBF7F3; background: {color}; display: grid; place-items: center; font-weight: 700; font-size: .85rem; box-sizing: border-box`. Texto `font-size: .74rem; line-height: 1.2; color: #17120F` + ciudad `display: block; color: #6E6259`.

**Accesibilidad.** `aria-label`: "Historia de {nombre} en {ciudad}" (ej. "Historia de Laura en Bogotá") y "Sube tu plan". Agregar "no vista" al nombre cuando aplique (hoy solo es color).

**Pantallas.** Main.

```html
<div class="stories" role="list">
  <a role="listitem" href="/publicar" aria-label="Sube tu plan">…</a>
  <a role="listitem" href="/historias/laura" aria-label="Historia de Laura en Bogotá, no vista">…</a>
</div>
```

---

#### N9 · Compositor de publicación

**Anatomía.** Tarjeta `role="group" aria-label="Publicar un plan"` → fila (avatar de 42 px + campo en píldora) → fila de acciones (4 botones con ícono + "Publicar").

**Textos exactos.** Etiqueta oculta "Publica tu plan"; placeholder "¿Qué plan tienes, Camila? Etiqueta un evento con @"; botones "Etiquetar evento" (ícono calendario), "Armar parche" (personas con +), "Foto" (imagen), "Reseña" (estrella), "Publicar".

**Estados.** Ninguno de los 5 botones hace nada (H38). Foco del campo invisible (`outline: 0`, H51). Publicando / error / campo vacío: No diseñado. **H38:** "Armar parche" debe abrir "Nuevo parche" (N57).

**Estilos exactos.** Tarjeta `background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 20px; padding: 16px 18px; display: flex; flex-direction: column; gap: 12px`. Fila superior `display: flex; align-items: center; gap: 12px`. Avatar 42 px `#8FD3D0` "CV" `.8rem`. Campo `width: 100%; box-sizing: border-box; height: 44px; border: 1px solid #EAE1D8; border-radius: 999px; padding: 0 16px; background: #FBF7F3; font-size: .95rem; outline: 0`. Fila de acciones `display: flex; flex-wrap: wrap; gap: 8px; align-items: center`. Botón secundario `height: 36px; border: 1px solid #EAE1D8; background: #FFFFFF; border-radius: 999px; padding: 0 14px; font-size: .84rem; font-weight: 500; display: flex; align-items: center; gap: 6px; color: #17120F` con ícono de 16 px. "Publicar" `margin-left: auto; height: 36px; border: 0; background: #C23A24; color: #FFFFFF; border-radius: 999px; padding: 0 18px; font-size: .86rem; font-weight: 700`.

**Responsive (medido).** Acciones en 1 fila con feed ≥ 636 px; 2 filas con feed de 343 a 635 px; 3 filas con feed de 266 a 342 px (ventanas de 314 a 390 px); 4 filas con feed ≤ 265 px (ventanas ≤ 313 px).

**Pantallas.** Main.

```html
<form class="composer" aria-label="Publicar un plan">
  <span class="avatar" aria-hidden="true">CV</span>
  <label><span class="sr-only">Publica tu plan</span>
    <input type="text" placeholder="¿Qué plan tienes, Camila? Etiqueta un evento con @"></label>
  <div class="composer-actions">
    <button type="button">…Etiquetar evento</button>
    <button type="button">…Armar parche</button>
    <button type="button">…Foto</button>
    <button type="button">…Reseña</button>
    <button type="submit" class="btn btn-primary">Publicar</button>
  </div>
</form>
```

---

#### N10 · Pestañas de filtro del feed

**Anatomía.** `role="group" aria-label="Filtrar feed"` con 4 botones de alternar: "Amigos" (por defecto), "Parches abiertos", "Reseñas", "Cerca de ti".

**Comportamiento.** Cada publicación tiene etiquetas (`amigos`, `parches`, `resenas`, `cerca`); se muestran las que tienen la de la pestaña **y** la ciudad elegida. Con "Amigos" salen las 5; "Parches abiertos": Andrés y Sofía; "Reseñas": Juan Pablo; "Cerca de ti": Laura y Sofía.

**Estados.** Presionado `aria-pressed="true"` (fondo y borde `#17120F`, texto blanco); apagado (borde `#EAE1D8`, fondo `#FFFFFF`, texto `#17120F`); sin hover; foco del navegador. Vacío: N67 (variante feed).

**Estilos exactos.** Contenedor `display: flex; gap: 8px; flex-wrap: wrap`. Botón `height: 38px; border-radius: 999px; padding: 0 16px; font-size: .88rem; font-weight: 500; border: 1px solid {borde}`. **(medido)** 1 fila con feed ≥ 449 px; 2 filas por debajo.

**Accesibilidad.** Son filtros (botones con `aria-pressed`), no pestañas ARIA: mantenerlo así. Al cambiar, anunciar el número de publicaciones (H49).

**Pantallas.** Main.

---

#### N11 · Franja de ciudad del feed

**Anatomía.** Aparece cuando hay una ciudad elegida en el encabezado y hay publicaciones: pin rojo + "Planes de tu gente en **{Ciudad}**" · "Ver en el mapa" · "Ver todo Colombia".

**Estilos exactos.** `display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px 16px; background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 16px; padding: 10px 10px 10px 16px`. Texto `display: flex; align-items: center; gap: 8px; font-size: .9rem` con pin de 16 px trazo `#C23A24`. "Ver en el mapa": `<a href="Mapa.dc.html">` `height: 38px; box-sizing: border-box; display: inline-flex; align-items: center; gap: 6px; padding: 0 14px; border-radius: 999px; border: 1px solid #EAE1D8; font-size: .84rem; font-weight: 700` + ícono de mapa 15 px. "Ver todo Colombia": `<button>` `height: 38px; border-radius: 999px; border: 1px solid #17120F; background: #FFFFFF; color: #17120F; padding: 0 14px; font-size: .84rem; font-weight: 700`; vuelve a "Toda Colombia".

**Estados.** Visible solo con ciudad ≠ "Toda Colombia" y feed con resultados. "Ver en el mapa" abre el mapa en "Toda Colombia" (H42: debe abrir la ciudad).

**Correcciones.** **H62:** "Ver todo Colombia" → "Ver toda Colombia".

**Pantallas.** Main.

---

#### N12 · Publicación del feed con evento adjunto

**Anatomía.** `<article>` → cabecera (avatar enlazado, nombre + acción, hora · ciudad, "Más opciones") → texto → estrellas (solo reseñas) → **evento adjunto** (foto con placa de fecha | categoría, título, cuándo y dónde, "N van · 3 amigos", botón Voy/Vas) → bloque de parche opcional (N13) → barra de acciones (Me gusta, Comentarios, Compartir, Guardar).

**Variantes y props.** `kind`: normal, con parche (`parche`, `cuposUsed`, `cuposMax`), reseña (`stars`). Datos exactos de las 5 publicaciones (orden de aparición):

| id | Autor (iniciales, color) | Acción | Hora · ciudad | Texto | Evento | Hora del evento | Van / Me gusta / Comentarios | Extra |
|---|---|---|---|---|---|---|---|---|
| p1 | Laura Martínez (LM, `#F3B27E`) | "va a un evento" | "Hace 1 h · Bogotá" | "¿Quién se apunta el viernes? Tengo dos boletas de más y la orquesta en vivo es una locura." | e1 Noche de salsa y boleros en vivo | "9:00 p. m." | 23 / 24 / 6 | Arranca con "Vas" (estado inicial `going.p1 = true`), así que se ve "24 van · 3 amigos" |
| p4 | Andrés Ramírez (AR, `#A3A8F0`) | "abrió un parche" | "Hace 2 h · Medellín" | "¿Alguien de Bogotá se viene a Medellín por el puente? Armé parche para el viernes en Provenza: nos vemos a las 9 en el parque Lleras y arrancamos." | e7 Noche de reguetón en Provenza | "10:00 p. m." | 34 / 27 / 9 | Parche "Provenza de viernes", 5 de 8 |
| p2 | Sofía Cárdenas (SC, `#EE93BC`) | "armó un parche" | "Hace 3 h · Bogotá" | "Armé parche para el clásico. Nos vemos a las 2 en la tienda de la 57 y caminamos al estadio. Faltan dos." | e4 Santa Fe vs. Millonarios | "4:00 p. m." | 41 / 18 / 11 | Parche "Clásico capitalino", 4 de 6 |
| p5 | Natalia Herrera (NH, `#F6DC6A`) | "compartió un plan gratis" | "Hace 5 h · Barranquilla" | "Para los que vienen a la costa este puente: el sábado hay vallenato gratis en el Malecón, frente al río. Lleguen temprano que se llena." | e12 Vallenato en el Gran Malecón | "5:00 p. m." | 112 / 45 / 12 | Categoría "Conciertos · Gratis" |
| p3 | Juan Pablo Rojas (JP, `#B9E07A`) | "reseñó un evento" | "Ayer · Bogotá" | "Me dolió la barriga de reír. El cierre con improvisación del público vale cada peso. Vayan en grupo." | e5 Stand-up: risas de domingo | "7:00 p. m." | 9 / 52 / 14 | 5 estrellas |

Plantillas: categoría = `{cat}` + (" · Gratis" si precio 0); cuándo y dónde = "{Día} {d} oct · {hora} · {lugar con ', '}" + " · " + **{Ciudad}** (ej. "Vie 9 oct · 9:00 p. m. · Galería Café Libro, Zona T · **Bogotá**"); línea social = "{van + (1 si vas)} van · 3 amigos"; Me gusta = número + 1 si le diste.

**Estados.**
- "Voy" ↔ "Vas" (`aria-pressed`; apagado fondo `#FFFFFF` texto `#17120F`; encendido fondo `#17120F` texto `#FFFFFF`; borde siempre `#17120F`). Suma 1 a "van".
- Me gusta (`aria-pressed`; color `#6E6259` → `#C23A24` y corazón relleno; suma 1).
- Comentarios, Compartir, Guardar y "Más opciones": **sin acción** (H38). **H9:** "Más opciones" debe abrir Reportar / Bloquear. **H41:** Guardar con marcador (ya lo es aquí) y que funcione como en Agenda.
- Hover R1 en avatar, nombre y título del evento; foco del navegador.
- Cargando / error: No diseñado (H17).

**Estilos exactos.**
- Tarjeta `background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 20px; overflow: hidden`.
- Cabecera `padding: 16px 18px 0; display: flex; align-items: flex-start; gap: 12px`. Avatar enlace 42 px `.8rem` 700. Bloque de texto `flex: 1; min-width: 0; line-height: 1.35`: nombre (enlace 700) + acción `#6E6259`; hora `.8rem` `#6E6259`. "Más opciones": `width: 36px; height: 36px; border: 0; background: transparent; border-radius: 50%; color: #6E6259` con 3 puntos (círculos de r=1.8 en x=5, 12, 19).
- Texto `margin: 10px 18px 14px; font-size: .97rem`.
- Estrellas `role="img" aria-label="Calificación 5 de 5"`; `margin: -6px 18px 12px; display: flex; gap: 2px; color: #E0A21B`; 5 estrellas de 18 px rellenas (`m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z`).
- Evento adjunto `margin: 0 18px; border: 1px solid #EAE1D8; border-radius: 16px; overflow: hidden; display: flex; flex-wrap: wrap`. Foto `role="img" aria-label="[Foto del evento]"`, `flex: 1 1 180px; min-height: 150px; position: relative`, fondo `radial-gradient(circle at 70% 30%, {bg1} 0, transparent 58%), {bg2}`, placa de fecha `md` en `top: 10px; left: 10px`. Información `flex: 2 1 260px; padding: 14px 16px; display: flex; flex-direction: column; gap: 4px`: categoría `.7rem`; título `<a>` Archivo 800 `1.15rem`, `-0.02em`, `line-height: 1.15`; dónde `.85rem` `#6E6259` con ciudad `#17120F` 700; fila social `display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px; margin-top: 8px` con 3 círculos de 24 px (`#F3B27E`, `#A3A8F0`, `#EE93BC`, borde 2 px blanco, solape −8 px) + texto `.8rem` `#6E6259`; botón "Voy" `height: 38px; border-radius: 999px; padding: 0 16px; font-size: .84rem; font-weight: 700; border: 1px solid #17120F`.
- Barra de acciones `padding: 10px; display: flex; align-items: center; gap: 4px; margin-top: 8px; border-top: 1px solid #F1EAE3`. Botones `height: 40px; border: 0; background: transparent; border-radius: 999px; padding: 0 12px; display: flex; align-items: center; gap: 6px; font-size: .86rem; font-weight: 700; color: #6E6259` con íconos de 20 px. Guardar `margin-left: auto; width: 40px; height: 40px; border-radius: 50%`.

**Responsive (medido).** Evento adjunto lado a lado con feed ≥ 512 px; si no, foto arriba (100 % × 150 px) e información abajo. "Voy" baja de línea con feed < 318 px.

**Accesibilidad.** Nombres: "Perfil de {nombre}", "Más opciones", "Me gusta, {n}", "Comentarios, {n}", "Compartir", "Guardar evento". **H59:** cada publicación necesita un encabezado (h3) para navegar. **H46:** el avatar de otra persona abre hoy el perfil de Camila.

**Datos (H37, H30, H32).** "Tengo dos boletas de más" invita a reventa informal (H32); "3 amigos" es fijo; la hora del evento difiere entre pantallas (9:00 p. m. aquí, "Puertas 8:00 · Show 9:30" en Evento).

**Pantallas.** Main.

```html
<article class="post" aria-labelledby="post-p1-title">
  <header class="post-head">
    <a href="/u/laura" class="avatar" aria-label="Perfil de Laura Martínez">LM</a>
    <div><a href="/u/laura">Laura Martínez</a> <span>va a un evento</span><div class="meta">Hace 1 h · Bogotá</div></div>
    <button type="button" aria-label="Más opciones" aria-haspopup="menu">…</button>
  </header>
  <p>¿Quién se apunta el viernes? …</p>
  <div class="attached-event">
    <img src="…" alt="…"> <span class="date-plate"><b>9</b><span>oct</span></span>
    <div><span class="cat">Rumba</span><h3 id="post-p1-title"><a href="/eventos/…">Noche de salsa y boleros en vivo</a></h3>
      <p class="where">Vie 9 oct · 9:00 p. m. · Galería Café Libro, Zona T · <b>Bogotá</b></p>
      <div class="social">…24 van · 3 amigos <button type="button" aria-pressed="true">Vas</button></div></div>
  </div>
  <footer class="post-actions">
    <button type="button" aria-pressed="false" aria-label="Me gusta, 24">…24</button>
    <button type="button" aria-label="Comentarios, 6">…6</button>
    <button type="button">…Compartir</button>
    <button type="button" aria-pressed="false" aria-label="Guardar evento">…</button>
  </footer>
</article>
```

---

#### N13 · Bloque de parche con barra de cupos

**Anatomía.** Nombre del parche + "N de M cupos" + barra de progreso + botón de sumarse.

**Variantes y props** (`name`, `used`, `max`, `joined`, `variant`):

| Variante | Dónde | Estructura y estilos |
|---|---|---|
| `post` | Main (dentro de N12) | Caja `margin: 12px 18px 0; background: #FBF7F3; border-radius: 14px; padding: 12px 14px; display: flex; flex-wrap: wrap; align-items: center; gap: 10px 16px`. Texto `flex: 1 1 200px`: fila `display: flex; justify-content: space-between; font-size: .84rem` con "**Parche: {nombre}**" y "{usados} de {máx} cupos" (`#6E6259`). Barra `height: 8px; border-radius: 4px; background: #EAE1D8; margin-top: 6px; overflow: hidden`; relleno `height: 100%; width: {pct}%; background: #C23A24; border-radius: 4px`. Botón `height: 38px; border: 0; border-radius: 999px; padding: 0 16px; font-size: .84rem; font-weight: 700; color: #FFFFFF`; fondo `#C23A24` "Unirme al parche" → `#17120F` "Estás en el parche". |
| `lista` | Evento ("Parches para este evento") | `<article>` `background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 18px; padding: 16px 18px; display: flex; flex-wrap: wrap; align-items: center; gap: 14px 18px`. Avatar cuadrado 52 px `border-radius: 14px` Archivo 900. Texto `flex: 1 1 240px; min-width: 0`: `h3` `1.02rem`; descripción `.86rem` `#6E6259` (`margin: 2px 0 0`); fila `display: flex; align-items: center; gap: 10px; margin-top: 8px` con barra `flex: 0 1 160px; height: 8px; border-radius: 4px; background: #EAE1D8` (relleno `#C23A24` **sin** radio) y "{n} de {m} cupos" `.8rem`. Botón `height: 42px; border: 0; border-radius: 999px; padding: 0 18px; font-size: .86rem; font-weight: 700; color: #FFFFFF`; `#C23A24` "Unirme" → `#17120F` "Estás dentro". |
| `barra` | Chat (plan fijado, N51) | Barra `flex: 0 1 120px; height: 6px; border-radius: 3px; background: #EAE1D8; overflow: hidden` con `role="img"` y nombre "{n} de {m} miembros ya tienen boleta"; relleno `#C23A24` con `border-radius: 3px; transition: width 300ms ease` (`data-fx`). Mide boletas, no cupos. |

Datos de `lista` (Evento): "SL" `#F6DC6A` "Salseros de jueves" — "Laura M. · Pre en la casa de Laura a las 7:30, luego caminamos" — 6 de 8; "PN" `#EE93BC` "Primera vez bailando" — "Mafe G. · Para los que llegan a la clase de 8:30" — 3 de 10; "UB" `#A3A8F0` "Uber compartido desde Suba" — "Daniel T. · Salimos 8:15 p. m." — 3 de 4. Datos de `post`: "Provenza de viernes" 5 de 8, "Clásico capitalino" 4 de 6.

**Estados.** Apagado / unido (`aria-pressed`), suma 1 al conteo y al porcentaje (`Math.round(usados / máx × 100)`). Lleno (usados = máx): No diseñado. Pendiente de aprobación: No diseñado (**H30** pide tres tipos de parche: abierto, con aprobación y privado; **H9** pide invitación que se acepta). **H25:** Camila ya es miembro de "Clásico capitalino" y aún ve "Unirme al parche"; mostrar "Estás dentro". **H30:** las descripciones públicas no deben revelar punto de encuentro ("Pre en la casa de Laura…", "Uber compartido desde Suba · 8:15 p. m."). Barra sin texto alternativo en `post` y `lista`: agregar "{n} de {m} cupos" como texto (ya visible) y ocultar la barra (`aria-hidden`) o darle `role="progressbar"` con valores.

**Responsive (medido).** `post`: botón al lado con feed ≥ 426 px; debajo por menos. `lista`: 1 fila desde 490 px; botón en su fila entre 380 y 489; 3 filas por debajo de 380.

**Pantallas.** Main, Evento, Chat.

```html
<div class="parche-block">
  <div><p><b>Parche: Clásico capitalino</b> <span>4 de 6 cupos</span></p>
    <div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="6" aria-valuenow="4" aria-label="Cupos ocupados"><span style="width:67%"></span></div></div>
  <button type="button" class="btn btn-primary" aria-pressed="false">Unirme al parche</button>
</div>
```

---

#### N14 · Columna "Descubre" (Main, derecha)

**Anatomía.** `<aside aria-label="Descubre">` (`flex: 1 1 280px; max-width: 340px; display: flex; flex-direction: column; gap: 16px`) con: **Tu semana** · **Mapa de eventos** (mini-mapa, N21) · **Gente con tus gustos** (N61) · **Tendencias en Colombia** · texto legal.

**Tu semana.** Caja `background: #17120F; color: #FFFFFF; border-radius: 20px; padding: 20px; display: flex; flex-direction: column; gap: 10px`. Etiqueta "Tu semana" (`.tag` sm). `h2` Archivo 900 `1.5rem`, `-0.03em`, `line-height: 1.05`, mayúsculas: "3 planes confirmados". Lista (`gap: 10px; margin-top: 4px`) de 3 enlaces a Evento (`display: flex; gap: 12px; align-items: center; color: #FFFFFF`): columna de fecha `width: 44px; text-align: center; line-height: 1.1` (número `b` Archivo `1.2rem` + día `.68rem` mayúsculas `#D8CEC6`) y texto `.88rem; line-height: 1.3` + detalle `display: block; color: #D8CEC6; font-size: .78rem`:
- "9" "vie" — "Noche de salsa y boleros" — "9:00 p. m. · con 3 amigos".
- "10" "sáb" — "Festival de jazz al parque" — "2:00 p. m. · gratis".
- "11" "dom" — "Santa Fe vs. Millonarios" — "4:00 p. m. · parche de 4".

**Tendencias en Colombia.** Tarjeta blanca (`border-radius: 20px; padding: 18px; gap: 10px`), `h2` `1rem`, 5 enlaces a Agenda (`line-height: 1.3`): línea `display: block; font-size: .74rem; color: #6E6259` con **ciudad** (`#17120F`) · tema, y la etiqueta en `b`:
- **Bogotá** · Fútbol · 1.150 planes — "#ClásicoCapitalino".
- **Medellín** · Rumba · 900 planes — "#ProvenzaDeViernes".
- **Todo el país** · Salsa · 870 planes — "#ViernesDeSalsa".
- **Barranquilla** · Gratis · 640 planes — "#VallenatoEnElMalecón".
- **Cali** · Conciertos · 410 planes — "#PacíficoEnVivo".

**Texto legal.** `<p>` `margin: 0; font-size: .76rem; color: #6E6259`: "Compra segura dentro de Fulleventos. Las boletas las emite la boletera oficial del evento o el organizador. · Contenido de ejemplo" (reemplazar por el pie legal de H5).

**Estados.** Hover R1 en tendencias (solo la etiqueta; ciudad y tema tienen color propio) y en "Gente con tus gustos". "Tu semana" no cambia (blanco en línea). **H37:** "Tu semana" cuenta como confirmado un evento que en el chat figura "Sin boleta"; diferenciar "Voy" de "Tengo boleta".

**Responsive.** Columna de 340 px máx. Entre 812 y 1115 px baja al final de todo (después del feed); por debajo, también al final con 340 px de ancho. **H15:** hacia 1120 px se oculta o pasa a todo el ancho; en celular, sus tarjetas se intercalan en el feed o van en carrusel.

**Pantallas.** Main.

---

#### N15 · Tarjeta de evento del marketplace (con repost) y variante pública

**Anatomía.** Imagen 4/3 (foto, placa de fecha, Guardar, marca "Reposteaste") → cuerpo: categoría · título · lugar · **ciudad** · línea social · precio + boletera · botón "Comprar"/"Ver plan" → fila de acciones (Repostear + Enviar a un amigo).

**Variantes y props** (`variant`, `event`, `saved`, `reposted`, `social`):
- `marketplace` (Agenda): todo lo anterior.
- `publica` (Bienvenida): sin marca "Reposteaste" ni fila de acciones; la línea social es "{van} van · {n} parches abiertos" con ícono de personas; botón de compra `min-height: 44px; padding: 11px 15px`; la imagen no tiene nombre accesible.

**Estados.**
- Guardar (ver `.save`): `aria-pressed`; corazón `#17120F` sin relleno → `#C23A24` relleno.
- Repostear: apagado "Repostear" (fondo `#FFFFFF`, texto `#17120F`, borde `#17120F`) → abre la ventana N16; tras confirmar, "Reposteado" (fondo `#17120F`, texto `#FFFFFF`), marca amarilla "Reposteaste" sobre la foto, línea "Tú, {quién} y {n} más lo repostearon" y aviso N17. Tocar "Reposteado" **quita el repost sin preguntar** y borra el aviso.
- "Enviar a un amigo": sin acción (H38).
- Hover: solo el título (R1); la tarjeta no se eleva; "Comprar" no cambia.
- Cargando / error: No diseñado (H17 pide esqueletos y "Reintentar").

**Estilos exactos.**
- Caja: ver `.card`.
- Imagen `position: relative; aspect-ratio: 4 / 3` + `span role="img" aria-label="[Foto del evento]"` (`position: absolute; inset: 0`, degradado 55 %). Placa de fecha `lg` (`top: 12px; left: 12px`). Guardar 44 × 44 en `top: 10px; right: 10px`, `background: rgba(255,255,255,.94)`.
- "Reposteaste": `position: absolute; bottom: 10px; left: 10px; display: flex; align-items: center; gap: 6px; background: #F6DC6A; color: #17120F; border-radius: 999px; padding: 4px 10px; font-size: .74rem; font-weight: 700` + ícono de repost 13 px (trazo 2.6).
- Cuerpo `padding: 14px 16px 16px; display: flex; flex-direction: column; flex: 1`. Categoría `.7rem` `#C23A24`. Título `<a>` `1.05rem; 700; line-height: 1.25; margin: 4px 0 6px`. Lugar `.85rem` `#6E6259` + " · " + ciudad `#17120F` 700.
- Línea social `display: flex; align-items: center; gap: 8px; font-size: .78rem; color: #6E6259; margin-top: 10px` (2 círculos de 22 px `{c1}`, `{c2}`, borde 2 px blanco, solape −7 px).
- Precio y compra: `display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-top: auto; padding-top: 14px`; precio `700 .95rem` + boletera `display: block; 400; .72rem; #6E6259`; botón `display: inline-flex; align-items: center; gap: 6px; min-height: 40px; box-sizing: border-box; background: #C23A24; color: #FFFFFF; border-radius: 999px; padding: 10px 14px; font-size: .82rem; font-weight: 700; white-space: nowrap`.
- Fila de acciones `display: flex; gap: 8px; margin-top: 12px; padding-top: 12px; border-top: 1px solid #F1EAE3`. Repostear `flex: 1; height: 40px; border-radius: 999px; font-size: .84rem; font-weight: 700; border: 1px solid #17120F; display: flex; align-items: center; justify-content: center; gap: 6px` + ícono 16 px trazo 2.2 (`M17 2l4 4-4 4`, `M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4`, `M21 13v2a3 3 0 0 1-3 3H3`). Enviar `width: 40px; height: 40px; border-radius: 50%; border: 1px solid #EAE1D8; background: #FFFFFF` + avión de papel 16 px (`M22 2 11 13M22 2l-7 20-4-9-9-4z`).
- Rejilla: Agenda `repeat(auto-fill, minmax(260px, 1fr))`, Bienvenida `minmax(250px, 1fr)`; `gap: 22px`.

**Accesibilidad.** Guardar `aria-label="Guardar {título}"` + `aria-pressed`; Comprar `aria-label="Comprar boletas para {título}"` / "Ver plan: {título}"; Repostear `aria-pressed`; Enviar `aria-label="Enviar a un amigo"`. **H59:** título como `h3`.

**Datos.** Ver la tabla de los 19 eventos en la sección de datos. Línea social de Agenda por evento (quién, reposts): e1 Laura 14, e2 Andrés 31 (arranca reposteado), e3 Daniel 52, e4 Sofía 88, e5 Juan Pablo 9, e6 Mafe 21, e7 Valentina 17, e8 Mateo 64, e9 Isa 7, e10 Caro 23, e11 Felipe 12, e12 Nata 40, e13 Laura 19, e14 Sebas 26, e15 Tomás 8, e16 Majo 5, e17 Simón 11, e18 Ana María 6, e19 Dani 4. Colores de los 2 círculos (`c1` / `c2`): e1 `#F3B27E`/`#EE93BC`, e2 `#A3A8F0`/`#B9E07A`, e3 `#8FD3D0`/`#F6DC6A`, e4 `#EE93BC`/`#B9E07A`, e5 `#B9E07A`/`#F3B27E`, e6 `#F6DC6A`/`#A3A8F0`, e7 `#A3A8F0`/`#8FD3D0`, e8 `#B9E07A`/`#8FD3D0`, e9 `#F3B27E`/`#A3A8F0`, e10 `#EE93BC`/`#F6DC6A`, e11 `#8FD3D0`/`#B9E07A`, e12 `#F6DC6A`/`#8FD3D0`, e13 `#F3B27E`/`#A3A8F0`, e14 `#A3A8F0`/`#F3B27E`, e15 `#B9E07A`/`#EE93BC`, e16 `#A3A8F0`/`#F6DC6A`, e17 `#8FD3D0`/`#F3B27E`, e18 `#EE93BC`/`#8FD3D0`, e19 `#B9E07A`/`#A3A8F0`. Eventos con `fr: true` (los que muestra el chip "Lo que repostea tu gente"): e1, e2, e4, e5, e7, e10, e13 y e14 (8 tarjetas).

**Correcciones obligatorias.** H36 (cada tarjeta abre su evento), H21 (precio con cargo), H1 (boletera real → `[BOLETERA]` o "Contenido de ejemplo"; texto del botón según canal), H41 (un solo patrón de repost en Agenda, Mapa y Chat; Guardar con marcador), H47 (en celular, tarjeta compacta horizontal con miniatura de 88 px, agrupación por día y paginación; hoy cada tarjeta mide 510–530 px a 390).

**Pantallas.** Agenda (`marketplace`), Bienvenida (`publica`).

```html
<article class="event-card">
  <div class="media">
    <img src="…" alt="…">
    <span class="date-plate"><b>10</b><span>oct</span></span>
    <button type="button" class="save" aria-pressed="false" aria-label="Guardar Festival de jazz al parque">…</button>
    <span class="pill-reposted">…Reposteaste</span>
  </div>
  <div class="body">
    <span class="cat">Conciertos</span>
    <h3><a href="/bogota/eventos/festival-de-jazz-al-parque">Festival de jazz al parque</a></h3>
    <p class="where">Parque El Country · Usaquén · <b>Bogotá</b></p>
    <p class="social">…Tú, Andrés y 30 más lo repostearon</p>
    <div class="buy"><span class="price">Gratis<small>[BOLETERA]</small></span>
      <a class="btn btn-primary btn-sm" href="…" aria-label="Ver plan: Festival de jazz al parque">Ver plan</a></div>
    <div class="card-actions">
      <button type="button" aria-pressed="true">…Reposteado</button>
      <button type="button" aria-label="Enviar a un amigo">…</button>
    </div>
  </div>
</article>
```

---

#### N16 · Ventana de repost

**Anatomía.** Fondo oscuro → diálogo: título "Repostear evento" + cerrar · avatar + comentario · vista previa del evento · "¿Dónde lo compartes?" con 3 opciones (N39) · "Cancelar" + "Repostear".

**Textos exactos.** Título "Repostear evento"; cerrar `aria-label="Cerrar"`; etiqueta oculta "Comentario"; placeholder "Añade un comentario. Ej.: ¿Quién se apunta?"; vista previa "{CATEGORÍA}" · **{título}** · "{d} oct · {lugar} · {ciudad}" (ej. "9 oct · Galería Café Libro · Zona T · Bogotá"); leyenda "¿Dónde lo compartes?"; opciones: "En mi feed" / "Lo ven todos tus seguidores"; "En un parche" / "Salseros de jueves · 12 miembros"; "Solo a amigos cercanos" / "Una lista que tú eliges"; botones "Cancelar" y "Repostear".

**Estados.** Al abrir, la opción marcada es "En mi feed". Opción elegida: borde `1.5px #17120F`, fondo `#FBF7F3`, punto `#17120F`; no elegida: borde `#EAE1D8`, fondo `#FFFFFF`, punto transparente. "Repostear" confirma, cierra y muestra el aviso (N17). El comentario **no se guarda** ni aparece en el feed (decisión 2.7: en producción el repost debe aparecer como publicación). Enviando / error: No diseñado.

**Estilos exactos.** Capa `position: fixed; inset: 0; z-index: 20; background: rgba(23,18,15,.55); display: flex; align-items: center; justify-content: center; padding: 16px`. Diálogo `width: 100%; max-width: 520px; background: #FFFFFF; border-radius: 24px; padding: 22px; box-sizing: border-box; display: flex; flex-direction: column; gap: 16px; box-shadow: 0 24px 60px rgba(23,18,15,.3)`. Título `h2` `1.15rem`. Cerrar `width: 40px; height: 40px; border: 0; border-radius: 50%; background: #FBF7F3` + X de 16 px (trazo 2.4). Comentario: fila `display: flex; gap: 12px; align-items: flex-start`, avatar 42 px, `textarea rows="3"` `width: 100%; box-sizing: border-box; border: 1px solid #EAE1D8; border-radius: 14px; padding: 12px 14px; font-size: .95rem; background: #FBF7F3; resize: none; outline: 0`. Vista previa `border: 1px solid #EAE1D8; border-radius: 16px; overflow: hidden; display: flex`; foto `width: 110px` (degradado 58 %); texto `padding: 12px 14px; line-height: 1.3` (categoría `.68rem`; título `b` `display: block; margin: 2px 0`; detalle `.82rem` `#6E6259`). Fieldset sin borde, `gap: 8px`; leyenda `font-weight: 700; font-size: .88rem; margin-bottom: 8px`. Pie `display: flex; justify-content: flex-end; gap: 10px`: "Cancelar" `height: 46px; border: 0; background: transparent; padding: 0 16px; font-weight: 700`; "Repostear" `height: 46px; border: 0; border-radius: 999px; padding: 0 22px; background: #C23A24; color: #FFFFFF; font-weight: 700`.

**Accesibilidad.** `role="dialog" aria-modal="true" aria-label="Repostear evento"`. **Obligatorio (H7):** cerrar con Escape y tocando el fondo; foco al abrir (en "Cerrar" o el comentario), foco atrapado y fondo `inert`; devolver el foco al botón que abrió. **H59:** las opciones son excluyentes → radios.

**Pantallas.** Agenda. **H41:** Mapa y Chat repostean al instante; definir un solo patrón (recomendado: esta ventana en todas).

```html
<dialog class="modal" aria-labelledby="rp-title">
  <header><h2 id="rp-title">Repostear evento</h2><button type="button" aria-label="Cerrar">…</button></header>
  <label><span class="sr-only">Comentario</span>
    <textarea rows="3" placeholder="Añade un comentario. Ej.: ¿Quién se apunta?"></textarea></label>
  <div class="preview"><img src="…" alt="…">
    <div><span class="cat">Rumba</span><b>Noche de salsa y boleros en vivo</b><span>9 oct · Galería Café Libro · Zona T · Bogotá</span></div></div>
  <fieldset><legend>¿Dónde lo compartes?</legend>
    <label class="option"><input type="radio" name="destino" value="feed" checked><b>En mi feed</b><span>Lo ven todos tus seguidores</span></label>
    <label class="option"><input type="radio" name="destino" value="parche"><b>En un parche</b><span>Salseros de jueves · 12 miembros</span></label>
    <label class="option"><input type="radio" name="destino" value="amigos"><b>Solo a amigos cercanos</b><span>Una lista que tú eliges</span></label>
  </fieldset>
  <footer><button type="button">Cancelar</button><button type="submit" class="btn btn-primary">Repostear</button></footer>
</dialog>
```

---

#### N17 · Aviso (toast)

**Anatomía.** Franja oscura: palomita amarilla · mensaje · enlace "Ver en mi feed" · cerrar.

**Textos exactos.** "Reposteaste «{título}» en {destino}." con destino "tu feed" | "el parche Salseros de jueves" | "tus amigos cercanos" (ej. "Reposteaste «Noche de salsa y boleros en vivo» en tu feed."). Enlace "Ver en mi feed" (a Main). Cerrar `aria-label="Cerrar aviso"`.

**Estados.** Visible tras confirmar un repost; se queda hasta cerrarlo o quitar el repost. No se va solo. Sin animación de entrada.

**Estilos exactos.** `role="status"`; `display: flex; flex-wrap: wrap; align-items: center; gap: 10px 16px; background: #17120F; color: #FFFFFF; border-radius: 16px; padding: 14px 18px`. Palomita 20 px trazo `#F6DC6A` 2.4 (`m5 12 5 5L20 7`). Texto `flex: 1 1 240px`. Enlace `color: #F6DC6A; font-weight: 700`. Cerrar `width: 36px; height: 36px; border: 0; border-radius: 50%; background: transparent; color: #FFFFFF` + X 16 px. **Posición:** en el flujo de la página (entre los filtros y la línea de resultados), no flotante.

**Accesibilidad.** **H49:** el `role="status"` aparece junto con el texto y algunos lectores no lo anuncian: usar una región viva **permanente** y vacía donde se escribe el mensaje.

**Pantallas.** Agenda. Reutilizable para cualquier confirmación (copiar dirección, unirse, guardar).

```html
<div class="sr-only" role="status" aria-live="polite" id="live"></div> <!-- permanente -->
<div class="toast">…<span>Reposteaste «Noche de salsa y boleros en vivo» en tu feed.</span>
  <a href="/inicio">Ver en mi feed</a><button type="button" aria-label="Cerrar aviso">…</button></div>
```

---

#### N18 · Filtros de ciudad con conteo

**Anatomía.** Fila con scroll horizontal (`role="group" aria-label="Filtrar por ciudad"`) de chips de 42 px: "Toda Colombia" (con pin) + 11 ciudades, cada uno con un contador redondo.

**Variantes y props.** `counts` (por ciudad), `value`. Conteos de Agenda con "Para ti": Toda Colombia 19, Bogotá 6, Medellín 3, Cali 2, Barranquilla 1, Cartagena 1, Santa Marta 1, Bucaramanga 1, Pereira 1, Villavicencio 1, Pasto 1, Leticia 1. En Agenda los números siguen la categoría elegida (ej. con "Rumba": Toda Colombia 6, Bogotá 1, Medellín 2, Cali 1, Cartagena 1, Santa Marta 1, el resto 0); en Bienvenida son siempre los totales.

**Estados.** Presionado: fondo y borde `#17120F`, texto `#FFFFFF`, contador `#F6DC6A`; apagado: borde `#EAE1D8`, fondo `#FFFFFF`, contador `#F3ECE5`; texto del contador siempre `#17120F`. Ciudad con 0 planes: se puede elegir y muestra el estado vacío (no se deshabilita). Sin hover. Foco R2.

**Estilos exactos.** Fila `display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px` (Bienvenida `6px` y `margin-bottom: 8px`). Chip `flex-shrink: 0; display: inline-flex; align-items: center; gap: 8px; height: 42px; border-radius: 999px; padding: 0 7px 0 15px; font-size: .9rem; font-weight: 500; white-space: nowrap; border: 1px solid {borde}`. Pin 16 px solo en "Toda Colombia". Contador `min-width: 28px; height: 28px; box-sizing: border-box; padding: 0 8px; border-radius: 999px; display: inline-grid; place-items: center; font-size: .78rem; font-weight: 700`.

**Accesibilidad.** `aria-pressed` y `aria-label="{Ciudad}, {n} planes"` (ej. "Bogotá, 6 planes", "Leticia, 1 plan"). Sincronizado con N4.

**Responsive.** A 1280 px la fila esconde 372 px (Villavicencio, Pasto y Leticia) sin pista (H61): agregar degradado y flechas, o permitir 2 líneas.

**Pantallas.** Bienvenida, Agenda. Variante ranking en Mapa (N23).

```html
<div role="group" aria-label="Filtrar por ciudad" class="chip-row">
  <button type="button" class="chip" aria-pressed="true" aria-label="Toda Colombia, 19 planes">…Toda Colombia <span class="count">19</span></button>
  <button type="button" class="chip" aria-pressed="false" aria-label="Bogotá, 6 planes">Bogotá <span class="count">6</span></button>
</div>
```

---

#### N19 · Control segmentado

**Anatomía.** Contenedor en píldora con relleno → 2 o 3 opciones; la elegida va rellena de `#17120F`.

**Variantes:**

| Variante | Dónde | Opciones (exactas) | Contenedor | Opción |
|---|---|---|---|---|
| Fecha | Agenda, Mapa | "Hoy", "Este finde" (por defecto), "Próxima semana" | `role="group" aria-label="Fecha"`; `display: flex; background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 999px; padding: 4px` | `height: 38px; border: 0; border-radius: 999px; padding: 0 16px; font-size: .86rem; font-weight: 700; white-space: nowrap`; elegida `#17120F`/`#FFFFFF`, otra `transparent`/`#17120F` |
| Vista | Agenda | "Lista" (actual, ícono de lista) · "Mapa" (enlace a Mapa) | `<nav aria-label="Vista">`, mismo contenedor | Enlaces `height: 38px; box-sizing: border-box; border-radius: 999px; padding: 0 14px; display: inline-flex; align-items: center; gap: 6px; font-size: .86rem; font-weight: 700` + ícono 16 px; actual con `aria-current="page"` |
| Filtro de chats | Chat | "Todos", "Parches", "Personas", "No leídos" | `role="group" aria-label="Filtrar chats"`; `display: flex; gap: 2px; overflow-x: auto; background: #FBF7F3; border: 1px solid #EAE1D8; border-radius: 999px; padding: 3px` | `flex: 1 0 auto; height: 36px; border: 0; border-radius: 999px; padding: 0 6px; font-size: .8rem; font-weight: 700; white-space: nowrap` |
| ¿Para quién? | Checkout | "Solo para mí" / "Tú pagas y recibes las boletas"; "Para mi parche" / "Elige quién va y dividan" | `display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 18px; padding: 5px` | `min-height: 58px; border: 0; border-radius: 14px; padding: 8px 10px; line-height: 1.2`; título `b .9rem`; detalle `.74rem; margin-top: 2px` en `rgba(255,255,255,.78)` (elegida) o `#6E6259` |
| Tipo de persona | Checkout (PSE) | "Natural" (por defecto), "Jurídica" | `display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; background: #FBF7F3; border-radius: 14px; padding: 4px` | `height: 40px; border: 0; border-radius: 10px; font-weight: 700; font-size: .86rem` |
| Tipo de chat | Chat (modal) | "Parche (grupo)", "Con una persona" | `role="group" aria-label="Tipo de chat"`; `display: flex; background: #FBF7F3; border: 1px solid #EAE1D8; border-radius: 999px; padding: 4px` | `flex: 1; height: 38px; border: 0; border-radius: 999px; font-size: .86rem; font-weight: 700` |

**Estados.** Elegida / no elegida (`aria-pressed`); sin hover; foco R2. **H39:** "Hoy" y "Próxima semana" no filtran: deben filtrar y actualizar título, conteos y el texto "del viernes 9 al lunes festivo 12" o, si no hay planes, mostrar un estado vacío honesto ("Hoy no hay planes en tu ciudad: mira el finde"). **H8:** el de fecha mide 309,5 px fijos y desborda a 320 px (Agenda 14 px, Mapa 6 px): permitir salto de línea o scroll propio. **H41:** Mapa no tiene "Lista / Mapa" para volver.

**Accesibilidad.** **H59:** son opciones excluyentes → `role="radiogroup"` con `role="radio"` y `aria-checked` (o radios nativos) y flechas para moverse. "Vista" es navegación entre páginas: mantener enlaces con `aria-current`.

**Pantallas.** Agenda, Mapa, Chat, Evento.

```html
<div role="radiogroup" aria-label="Fecha" class="segmented">
  <button type="button" role="radio" aria-checked="false">Hoy</button>
  <button type="button" role="radio" aria-checked="true">Este finde</button>
  <button type="button" role="radio" aria-checked="false">Próxima semana</button>
</div>
```

---

#### N20 · Mapa de Colombia con pines y zoom

**Anatomía.** Panel oscuro → barra de controles ("Toda Colombia", "Mi ciudad: Bogotá", grupo de zoom) → marco del mapa (lienzo con fondo de puntos, silueta del país, ríos, rótulos de mares y países, pines con nombre y líneas guía) → leyenda.

**Props.** `cities` (id, nombre, `left`/`top` en % del lienzo 130 × 175, desplazamiento `ox`/`oy` en px y lado del rótulo `lab`), `counts` por ciudad (según la categoría), `selected`, `zoom`.

Ciudades (posición %, desplazamiento, rótulo): Bogotá 41.8/47.4, 0/0, derecha · Medellín 30.2/38.6, 0/0, izquierda · Cali 22.8/54.6, 0/0, abajo · Barranquilla 36.2/11.7, 0/0, arriba · Cartagena 30.9/14.9, −38/18, abajo · Santa Marta 40.8/10.1, 46/−20, derecha · Bucaramanga 49.1/33.6, 0/0, derecha · Pereira 29.3/46.8, 0/0, izquierda · Villavicencio 45.2/50.6, 28/30, derecha · Pasto 17.1/67.4, 0/0, abajo · Leticia 73.5/97, 0/0, derecha. Proyección (decisión 2.8): `x = (lon + 79.5) × 10`, `y = (13 − lat) × 10`.

**Comportamiento.**
- Zoom: mínimo 1, máximo 3, paso 0,5. Etiqueta "1×", "1,5×", "2×", "2,5×", "3×" (coma decimal).
- Tocar un pin: elige la ciudad y sube el zoom a `max(zoom, 2)`, llevándola al centro. Tocar el pin elegido otra vez, "Toda Colombia" o el selector en "Toda Colombia": vuelve a zoom 1 sin ciudad. "Mi ciudad: Bogotá" elige Bogotá.
- Transformación del lienzo (`transform-origin: 0 0`): `translate({tx}%, {ty}%) scale({Z})` con `px, py` = posición de la ciudad elegida (o 50/50), `k = sel ? clamp(Z − 1, 0, 1) : 0`, `tx = px·(1 − Z) + k·(50 − px)`, `ty = py·(1 − Z) + k·(50 − py)`.
- Pines y rótulos se contraescalan con `scale(1/Z)` para mantener su tamaño.
- Los pines desplazados (Cartagena, Santa Marta, Villavicencio) se acercan a su punto real al hacer zoom: factor `f = clamp((3 − Z) / 2, 0, 1)`; la línea guía mide `√(ox² + oy²)·f`.
- Solo aparecen ciudades con al menos un plan en la categoría elegida.

**Estados del pin.**
- Default: fondo `#F6DC6A`, número `#17120F`, sombra `0 6px 14px rgba(0,0,0,.4)`, rótulo con fondo `rgba(20,14,16,.9)` y texto blanco, `z-index: 40 − n`.
- Elegido (`aria-pressed="true"`): fondo `#C23A24`, número blanco, anillo `0 0 0 4px rgba(194,58,36,.6), 0 0 0 12px rgba(194,58,36,.22), 0 8px 22px rgba(0,0,0,.45)`, rótulo blanco con texto `#17120F`, `z-index: 60`.
- Hover: ninguno (solo cursor). Foco: contorno amarillo `#F6DC6A` de 3 px (regla del panel oscuro).
- Botones de zoom deshabilitados en los límites (`disabled`, `opacity: .4`, `cursor: default`); **H7:** usar `aria-disabled`.
- Cargando / error del mapa: No diseñado (H17).

**Estilos exactos.**
- Panel `<section aria-label="Mapa de Colombia con los eventos" data-fe="dark">`: `flex: 999 1 560px; min-width: 0; box-sizing: border-box; border-radius: 28px; overflow: hidden; color: #FFFFFF; padding: clamp(14px, 2vw, 20px); display: flex; flex-direction: column; gap: 14px`; fondo `radial-gradient(circle at 80% 16%, rgba(214,140,70,.32) 0, transparent 30%), radial-gradient(circle at 14% 90%, rgba(190,70,80,.3) 0, transparent 34%), radial-gradient(ellipse at 4% 8%, rgba(70,30,80,.6) 0, transparent 45%), radial-gradient(circle at 50% 55%, rgba(230,170,80,.1) 0, transparent 42%), #140E10`.
- Controles: fila `display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px`. "Toda Colombia" (ícono de globo) y "Mi ciudad: Bogotá" (ícono de casa): `height: 40px; border-radius: 999px; padding: 0 15px; font-size: .84rem; font-weight: 700; display: flex; align-items: center; gap: 7px; border: 1px solid` — encendido: fondo `#FFFFFF`, texto `#17120F`, borde `#FFFFFF`; apagado: fondo `rgba(255,255,255,.08)`, texto `#FFFFFF`, borde `rgba(255,255,255,.3)`. Zoom: `role="group" aria-label="Zoom del mapa"`, `display: flex; align-items: center; gap: 2px; border: 1px solid rgba(255,255,255,.3); border-radius: 999px; padding: 2px`; botones "Alejar" (−) y "Acercar" (+) `width: 40px; height: 40px; border: 0; border-radius: 50%; background: transparent; color: #FFFFFF; padding: 0`, íconos 18 px trazo 2.4; etiqueta `min-width: 40px; text-align: center; font-size: .8rem; font-weight: 700; color: #D8CEC6`.
- Marco: `position: relative; overflow: hidden; border-radius: 20px; padding: 16px 0; border: 1px solid rgba(255,255,255,.07)`. Lienzo `position: relative; width: min(100%, 560px); aspect-ratio: 130 / 175; margin: 0 auto; container-type: inline-size`. Capa transformada `position: absolute; inset: 0; transition: transform 460ms cubic-bezier(.22,.8,.24,1)`.
- Fondo de puntos `position: absolute; inset: -60% -45%; background-image: radial-gradient(rgba(255,255,255,.12) 1px, transparent 1.5px); background-size: 16px 16px`.
- Silueta SVG (`viewBox="0 0 130 175"`, `overflow: visible`, `filter: drop-shadow(0 0 22px rgba(243,178,126,.18))`): `fill: #2E2220; stroke: #8A6A55; stroke-width: 1.4; stroke-linejoin: round; vector-effect: non-scaling-stroke`. Ríos: dos trazos `#8FD3D0` con opacidad .32 (ancho 1.2) y .26 (ancho 1). La ruta exacta del contorno está en `Mapa.dc.html:120`.
- Rótulos geográficos (no interactivos, `aria-hidden`): mares `#7FA3A6`, `.72rem`, `letter-spacing: .22em` ("Mar Caribe" 16/7; "Océano Pacífico" 6/48 rotado −90°); países `#9C8B80`, `.66rem`, `.14em` ("Panamá" 8/24, "Venezuela" 86/24, "Ecuador" 9/82, "Perú" 44/93, "Brasil" 90/80); todos 700 y mayúsculas. Con el lienzo ≤ 420 px (`@container`) se ocultan los países y los mares bajan a `.6rem` / `.12em`.
- Pin: botón `position: absolute; left: {bx}px; top: {by}px; transform: translate(-50%, -50%)`; tamaño base `size = min(70, 40 + 5·(n − 1))` px (1 plan 40, 2 → 45, 3 → 50, 6 → 65) y letra `fs = round(size × .36)`; ancho y alto `clamp(36px, {size/5.6}cqw, {size}px)`; letra `clamp(13px, {fs/5.6}cqw, {fs}px)`; `box-sizing: border-box; padding: 0; border-radius: 50%; border: 3px solid #140E10; display: grid; place-items: center; font-family: Archivo; font-weight: 900; line-height: 1; transition: left 460ms ease, top 460ms ease, background-color 200ms ease, box-shadow 200ms ease`.
- Rótulo del pin (dentro del botón): `position: absolute; white-space: nowrap; border-radius: 999px; padding: 3px 8px; font-family: DM Sans; font-size: .72rem; font-weight: 700; line-height: 1.3; letter-spacing: 0; box-shadow: 0 2px 8px rgba(0,0,0,.35)`; posición derecha `left: calc(100% + 7px); top: 50%; transform: translate(0, -50%)`, izquierda `left: -7px; translate(-100%, -50%)`, arriba `left: 50%; top: -6px; translate(-50%, -100%)`, abajo `left: 50%; top: calc(100% + 6px); translate(-50%, 0)`.
- Línea guía: `height: 2px; width: {len}px; background: rgba(246,220,106,.75); transform-origin: 0 50%; transform: rotate({ángulo}deg); transition: width 460ms ease` + punto real de 10 px `#F6DC6A` con `box-shadow: 0 0 0 2px #140E10`.
- Leyenda: `display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px 20px; font-size: .84rem; color: #D8CEC6`; tres puntos amarillos de 10, 15 y 21 px (`gap: 4px`) + "El tamaño del punto indica cuántos planes hay"; total `b` `#FFFFFF .9rem` "{n} planes en {m} ciudades" (ej. "19 planes en 11 ciudades").

**Responsive (medido).** Lienzo de 560 px cuando cabe; pines con piso de 36 px (a 390 px, Medellín y Pereira casi se tocan). Controles en 3 filas por debajo de 393 px. **Obligatorio:** H42 (en celular, al tocar una ciudad, hoja inferior o botón flotante "Ver 3 planes en Medellín" y desplazar al resultado), H50 (`overflow: clip` en el marco; sacar del orden de Tab los pines fuera de vista o centrar el mapa en el pin con foco), H49 (anunciar "Mostrando 6 planes en Bogotá"). En producción: proveedor de mapas real conservando la estética oscura, pines con conteo y zoom por ciudad (P5); San Andrés y Providencia necesitan recuadro aparte (no diseñado).

**Accesibilidad.** Pines como `<button>` con `aria-label="{Ciudad}, {n} eventos"` (ej. "Bogotá, 6 eventos", "Leticia, 1 evento") y `aria-pressed`. Rótulos geográficos `aria-hidden`. La lista lateral (N22) es la alternativa en texto. Respeta movimiento reducido (R5). **H62:** "Mi ciudad: Bogotá" debe salir de la ciudad del usuario.

**Pantallas.** Mapa.

```html
<section class="map-panel" aria-label="Mapa de Colombia con los eventos">
  <div class="map-toolbar">
    <button type="button" aria-pressed="true">…Toda Colombia</button>
    <button type="button" aria-pressed="false">…Mi ciudad: Bogotá</button>
    <div role="group" aria-label="Zoom del mapa">
      <button type="button" aria-label="Alejar" aria-disabled="true">−</button><span>1×</span>
      <button type="button" aria-label="Acercar">+</button></div>
  </div>
  <div class="map-frame"><div class="map-canvas">
    <svg aria-hidden="true" viewBox="0 0 130 175">…</svg>
    <button type="button" class="pin" aria-label="Bogotá, 6 eventos" aria-pressed="false" style="left:41.8%;top:47.4%">6<span class="pin-label" aria-hidden="true">Bogotá</span></button>
  </div></div>
  <p class="map-legend">…El tamaño del punto indica cuántos planes hay <b>19 planes en 11 ciudades</b></p>
</section>
```

---

#### N21 · Mini-mapas (landing e Inicio)

Dos versiones reducidas del mapa que **llevan al Mapa**.

**Landing (Bienvenida, bloque "Todo el país en un mapa").** Contenedor `flex: 1 1 280px; max-width: 400px; margin: 0 auto`; lienzo `role="group" aria-label="Mapa de Colombia con los planes de este finde por ciudad"`, `position: relative; width: 100%; aspect-ratio: 130 / 175; container-type: inline-size`. SVG con cuadrícula punteada (`M0 43.75H130M0 87.5H130M0 131.25H130M32.5 0V175M65 0V175M97.5 0V175`, blanco opacidad .07, ancho .4, `stroke-dasharray: 1 2`) y silueta `fill: #2B2124; stroke: #F3B27E; stroke-opacity: .6; stroke-width: .6`. Los 11 pines son **enlaces** a `Mapa.dc.html` con `aria-label="Ver planes en {Ciudad} ({n} plan/planes este finde)"` y `title="{Ciudad}: {n} planes este finde"`: `width/height: clamp(20px, 6.5cqw, 26px); border: 2px solid #140E10; background: #F6DC6A; color: #17120F; font-family: Archivo; font-weight: 900; font-size: clamp(.64rem, 2.9cqw, .78rem); line-height: 1; box-shadow: 0 0 0 4px rgba(246,220,106,.2)`. Rótulo dentro (`aria-hidden`), a la derecha o izquierda (`calc(100% + 6px)`) con ajuste vertical (Bogotá −9, Barranquilla −8, Cartagena 5, Santa Marta −2, Villavicencio 5 px): DM Sans 700 `clamp(.62rem, 2.8cqw, .74rem)`, blanco, `text-shadow: 0 0 3px #140E10, 0 0 6px #140E10`. Leyenda: punto de 12 px `#F6DC6A` + "Número de planes este finde por ciudad" (`.8rem`, `#D8CEC6`, centrado, `margin: 14px 0 0`). **H60:** a 390 px 5 pines se enciman (centros a 14 y 16 px): subir el mínimo a 24–28 px y agrupar la costa ("Costa Caribe · 3") si cada pin abre su ciudad, o convertir todo en un solo enlace.

**Inicio (Main, tarjeta "Mapa de eventos").** Tarjeta blanca (`border-radius: 20px; padding: 18px; gap: 12px`) con `h2` "Mapa de eventos" + "Nuevo", texto `.86rem` "**19 planes** este finde en 11 ciudades, de la costa al Amazonas." y un enlace que envuelve el dibujo (`aria-hidden`) y la barra "Ver qué pasa en todo el país" + flecha (`min-height: 44px; box-sizing: border-box; border-radius: 999px; padding: 8px 16px; background: #17120F; color: #FFFFFF; display: flex; align-items: center; justify-content: center; gap: 8px; text-align: center; font-weight: 700; font-size: .88rem`). Marco `background-color: #140E10; background-image: radial-gradient(rgba(255,255,255,.08) 1px, transparent 1.5px); background-size: 14px 14px; border-radius: 16px; padding: 14px`; lienzo `width: min(100%, 240px); aspect-ratio: 130 / 175; margin: 0 auto`; silueta `fill: #2E2220; stroke: #8A6A55; stroke-width: 1.2`. Puntos (no interactivos): `background: #F6DC6A; box-shadow: 0 0 0 2px #140E10`, Archivo 900; tamaño según planes: ≥5 → 20 px (letra 11), ≥3 → 16 px (10), 2 → 13 px (9), 1 → 9 px sin número. Rótulos solo de Bogotá, Medellín, Cali, Barranquilla y Leticia: `.68rem` 700 blanco con `text-shadow: 0 1px 3px rgba(0,0,0,.7)`.

**Pantallas.** Bienvenida, Main.

---

#### N22 · Lista de resultados del mapa (tarjeta compacta)

**Anatomía.** `<aside aria-label="Planes en el mapa">` → cabecera (antetítulo, nombre + conteo, ayuda, "Ver todo Colombia" si hay ciudad) → lista con encabezados por ciudad (solo sin ciudad elegida) y tarjetas compactas → estado vacío.

**Textos exactos.**
- Antetítulo "Todo el país" | "Ciudad elegida".
- Título "Toda Colombia" | "{Ciudad}" + " · {n} plan/planes" (ej. "Toda Colombia · 19 planes").
- Ayuda "Ordenados por ciudad y fecha. Usa «Ver en el mapa» para ubicar cada plan." | "Lo que hay este finde en {Ciudad}, por fecha."
- Botón "Ver todo Colombia" (con chevrón izquierdo; H62 → "Ver toda Colombia").
- Encabezado de ciudad: "{CIUDAD}" + ", " oculto + "{n} planes".

**Tarjeta compacta.** Miniatura 88 × 88 (`border-radius: 14px`, placa de fecha `xs`) · categoría (`.68rem`) · título (`.98rem`, 700, `line-height: 1.25`, `margin: 2px 0 3px`) · "{lugar} · {ciudad}" (`.8rem; line-height: 1.35`) · fila precio (`.88rem` 700 + boletera `.7rem`) y "Comprar"/"Ver plan" (`height: 36px; padding: 0 14px; font-size: .8rem; background: #C23A24`) · fila de acciones (`display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-top: 10px`): Repostear (`height: 36px; border-radius: 999px; border: 1px solid #17120F; padding: 0 12px; font-size: .78rem; font-weight: 700` + ícono 14 px; **alterna al instante**, sin ventana), Guardar (36 px, círculo con `border: 1px solid #EAE1D8; background: #FFFFFF`, corazón 16 px) y "Ver en el mapa" (solo sin ciudad elegida; `margin-left: auto; height: 36px; border: 0; background: transparent; color: #C23A24; padding: 0 2px; font-size: .78rem; font-weight: 700` + pin 14 px; elige esa ciudad en el mapa).

**Estilos exactos.** Panel `flex: 1 1 380px; min-width: 0; background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 24px; overflow: hidden; display: flex; flex-direction: column`. Cabecera `padding: 20px 20px 14px; border-bottom: 1px solid #EAE1D8`: antetítulo `.72rem`; título Archivo 900 `1.55rem`, `-0.02em`, `line-height: 1.1`, conteo DM Sans 700 `1rem` `#6E6259`; ayuda `.86rem` (`margin: 6px 0 0`); botón `margin-top: 10px; height: 36px; border-radius: 999px; border: 1px solid #17120F; background: #FFFFFF; padding: 0 14px; font-size: .82rem; font-weight: 700` + chevrón 15 px. Lista `position: relative; flex: 1 1 auto; padding: 0 20px 6px`. Encabezado de ciudad `h3` `margin: 16px 0 0; padding-bottom: 6px; display: flex; align-items: baseline; justify-content: space-between; gap: 10px; font-size: .74rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: #17120F; border-bottom: 2px solid #17120F` (conteo 500, `.04em`, `#6E6259`). Tarjeta `display: flex; gap: 14px; padding: 14px 0; border-bottom: 1px solid #F1EAE3`.

**Estados.** Repostear y Guardar con `aria-pressed` (mismos colores que N15). Vacío: N67 (variante mapa). Hover R1 en el título. Cargando: No diseñado.

**Responsive (medido).** Desde 1100 px el panel tiene `contain: size` y la lista `min-height: 0; overflow-y: auto` (scroll interno, mismo alto que el mapa). Mapa y panel lado a lado desde 1014 px; **entre 1014 y 1099 px el panel se estira a 4955 px** (sin scroll interno) y, por `align-items: stretch`, el panel oscuro del mapa también mide 4955 px: corregir. Por debajo de 1014 px el panel va debajo del mapa y crece con su contenido (5083 px a 390). **H47:** paginar; **H42:** en celular, el resultado debe quedar a la vista al elegir ciudad. **H7:** no ocultar "Ver en el mapa" al elegir una ciudad: dejarlo y cambiar su texto.

**Accesibilidad.** Guardar `aria-label="Guardar {título}"`; "Ver en el mapa" `aria-label="Ver en el mapa: {Ciudad}"`; CTA como N15. **H49:** anunciar el cambio de la lista (hoy 0 regiones vivas).

**Pantallas.** Mapa. Es también el patrón recomendado para la tarjeta en celular de Agenda (H47).

```html
<aside aria-label="Planes en el mapa" class="map-results">
  <header><p class="eyebrow">Todo el país</p><h2>Toda Colombia <span>· 19 planes</span></h2>
    <p>Ordenados por ciudad y fecha. Usa «Ver en el mapa» para ubicar cada plan.</p></header>
  <div class="list">
    <h3>Bogotá<span class="sr-only">, </span><span>6 planes</span></h3>
    <article class="event-card compact">
      <div class="thumb"><img src="…" alt="…"><span class="date-plate xs"><b>9</b><span>oct</span></span></div>
      <div><span class="cat">Rumba</span>
        <h4><a href="/bogota/eventos/…">Noche de salsa y boleros en vivo</a></h4>
        <p class="where">Galería Café Libro · Zona T · Bogotá</p>
        <div class="buy"><span class="price">Desde $45.000<small>[BOLETERA]</small></span>
          <a class="btn btn-primary btn-sm" href="…" aria-label="Comprar boletas para Noche de salsa y boleros en vivo">Comprar</a></div>
        <div class="actions"><button type="button" aria-pressed="false">…Repostear</button>
          <button type="button" aria-pressed="false" aria-label="Guardar Noche de salsa y boleros en vivo">…</button>
          <button type="button" aria-label="Ver en el mapa: Bogotá">…Ver en el mapa</button></div></div>
    </article>
  </div>
</aside>
```

---

#### N23 · Ranking "Ciudades con más planes"

**Anatomía.** `<section aria-labelledby="fe-ciudades">` → título "Ciudades con más planes" + ayuda "Toca una ciudad para verla en el mapa" → fila con scroll de chips (ciudades con planes, de más a menos).

**Estilos exactos.** Sección `display: flex; flex-direction: column; gap: 14px; padding-top: 14px`. Cabecera `display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 6px 16px`; ayuda `.86rem` `#6E6259`. Fila `role="group" aria-label="Ciudades"`, `display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px`. Chip `flex-shrink: 0; height: 44px; border-radius: 999px; padding: 0 7px 0 16px; border: 1px solid {borde}; font-size: .9rem; font-weight: 700; display: flex; align-items: center; gap: 10px`; contador `min-width: 30px; height: 30px; box-sizing: border-box; padding: 0 8px; border-radius: 999px; background: #F6DC6A; color: #17120F; display: grid; place-items: center; font-size: .8rem` (siempre amarillo).

**Estados.** Elegido igual que N18 (fondo `#17120F`); tocar el elegido reinicia el mapa. Siempre hay scroll horizontal (**(medido)** 1499 px de contenido frente a 1232 px visibles a 1280 px), sin pista (H61).

**Accesibilidad.** `aria-pressed`; **no tiene `aria-label`** (a diferencia de N18): agregar "{Ciudad}, {n} planes".

**Pantallas.** Mapa. **Implementar:** el mismo componente que N18 con variante `ranking` (700, 44 px, contador siempre amarillo).

---

#### N24 · Bloques de la landing (Bienvenida)

**Cómo funciona.** `<section id="como-funciona">` con antetítulo "Cómo funciona", `h2` "Planes mejores, con tu gente" (`margin: 0 0 28px`) y rejilla `repeat(auto-fit, minmax(240px, 1fr))` `gap: 20px` de 3 tarjetas (`background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 20px; padding: 24px; display: flex; flex-direction: column; gap: 10px`): número en cuadro de 48 px (`border-radius: 14px`, Archivo 900 `1.3rem`), `h3` `1.15rem`, texto `#6E6259`.
1. `#F6DC6A` "1" — "Descubre" — "Rumba, conciertos, fútbol, teatro y planes gratis de todo el país, en un solo lugar. Búscalos por ciudad o explóralos en el mapa."
2. `#EE93BC` "2" — "Mira quién va" — "Sigue a tus amigos y ve a qué eventos van, qué guardan y qué recomiendan."
3. `#A3A8F0` "3" — "Arma parche" — "Crea un grupo para ir juntos o únete a uno abierto, y compra tus boletas sin salir de Fulleventos."

H61: a 768 px queda en 2 + 1. H1: "compra tus boletas sin salir de Fulleventos" depende del canal de venta.

**Promoción del mapa.** `<section id="mapa" aria-labelledby="mapa-titulo">` → bloque oscuro (`border-radius: 28px; color: #FFFFFF; padding: clamp(28px, 5vw, 56px); display: flex; flex-wrap: wrap; align-items: center; gap: 36px 48px`; fondo `radial-gradient(circle at 78% 18%, rgba(246,220,106,.16) 0, transparent 32%), radial-gradient(circle at 70% 88%, rgba(238,147,188,.18) 0, transparent 38%), radial-gradient(ellipse at 6% 30%, rgba(70,30,80,.5) 0, transparent 45%), #140E10`). Columna de texto `flex: 1 1 340px`: etiqueta "Nuevo · Mapa de eventos"; `h2` "Todo el país en un mapa"; texto `#D8CEC6` `max-width: 46ch` "De la costa al Amazonas: mira qué planes hay este finde en cada ciudad y a dónde va tu gente, estés donde estés."; lista de 3 (`gap: 12px; font-size: .95rem`) con ícono en cuadro de 36 px (`border-radius: 12px; background: rgba(255,255,255,.08)`, ícono amarillo, rosado o aguamarina): "Toca una ciudad y ve todos sus planes", "Filtra por rumba, conciertos, deporte o planes gratis", "Mira a qué van tus amigos, en tu ciudad o de viaje"; botón claro "Abrir el mapa de eventos" + "**{19 planes}** este finde en **{11 ciudades}**" (`.88rem`, `#D8CEC6`). Columna del mapa: N21.

**Agenda de la landing.** Cabecera ("Agenda" / "Este finde en Colombia" + "Ver en el mapa" en píldora de 42 px con borde `#17120F` + "Ver toda la agenda"), N18, chips de categoría, estado vacío, rejilla de N15 `publica` (8 tarjetas) y botón "Ver {n} planes más" (`height: 48px; border-radius: 999px; border: 1px solid #17120F; background: #FFFFFF; padding: 0 24px; font-size: .92rem; font-weight: 700`, `aria-expanded`, centrado con `margin-top: 28px`): "Ver 11 planes más" → "Ver menos planes". **H44:** subir esta sección justo después del héroe (en celular, carrusel de 4 a 6 tarjetas) y bajar Noticias al final.

**Únete.** `<section aria-label="Únete">` `margin-top: 80px; background: #17120F; color: #FFFFFF; border-radius: 28px; padding: clamp(28px, 5vw, 56px); display: flex; flex-wrap: wrap; align-items: center; gap: 28px`. Texto `flex: 1 1 380px`: etiqueta "Tu gente ya está aquí"; `h2` "Ve a qué van tus amigos y súmate al parche"; texto `#D8CEC6` `max-width: 48ch` "Crea tu cuenta en un minuto, elige tu ciudad y lo que te gusta, y te mostramos los planes de tu gente." Acciones `flex: 1 1 280px; max-width: 360px; display: flex; flex-direction: column; gap: 10px`: "Continuar con Google" (52 px, blanco), "Continuar con mi celular" (52 px, `border: 1px solid rgba(255,255,255,.4)`, texto blanco), y "¿Ya tienes cuenta? **Entrar**" (`.84rem`, `#D8CEC6`, centrado; "Entrar" blanco 700 con `border-bottom: 1px solid #FFFFFF`). Los tres llevan a Registro o al feed sin autenticar (H12). **H45:** el texto promete "elige tu ciudad" y el registro no la pide.

**Pantallas.** Bienvenida.

---

#### N25 · Héroe del evento

**Anatomía.** Bloque oscuro alineado abajo: nota de foto (arriba a la derecha) · etiqueta "{Categoría} · {Día} {d} {mes}" · titular en 2 franjas (`.headline`) · fila de datos con íconos.

**Textos exactos.** Nota "[Foto del evento]" (`role="img" aria-label="[Foto del evento]"`); etiqueta "Rumba · Vie 9 oct"; titular "Noche de salsa" / "y boleros en vivo"; datos: reloj "Viernes 9 de octubre · Puertas 8:00 p. m."; pin "Galería Café Libro · Zona T, Bogotá"; personas "{186 + 1 si vas} van · 340 interesados".

**Estilos exactos.** `<section aria-labelledby="fe-title">` `position: relative; border-radius: 28px; overflow: hidden; min-height: 380px; padding: clamp(28px, 5vw, 48px) clamp(20px, 5vw, 56px); box-sizing: border-box; display: flex; flex-direction: column; justify-content: flex-end; gap: 16px; color: #FFFFFF`; fondo `radial-gradient(circle at 74% 30%, rgba(232,160,79,.65) 0, transparent 26%), radial-gradient(circle at 90% 80%, rgba(181,55,43,.6) 0, transparent 30%), radial-gradient(ellipse at 8% 40%, rgba(70,30,80,.55) 0, transparent 45%), #140E10`. Etiqueta `.95rem`, `padding: 4px 11px`. `h1 id="fe-title"` Archivo 900 `clamp(2.2rem, 5vw, 4.2rem)`, `-0.035em`, `line-height: .98`, `color: #17120F`, franjas con `padding: .1em .22em .06em` (2.ª con `margin-left: 1em` y degradado invertido). Fila de datos `display: flex; flex-wrap: wrap; gap: 8px 22px; font-size: .95rem; color: rgba(255,255,255,.92)`; cada dato `display: flex; align-items: center; gap: 6px` con ícono de 16 px.

**Estados.** "van" suma 1 al marcar "Voy". "340 interesados" no cambia con "Me interesa" (H26). Cargando: No diseñado.

**Responsive (medido).** Título 35,2 px hasta 704 px de ventana, `5vw` hasta 1344, 67,2 px desde ahí; a 390 px el título ocupa 4 líneas ("NOCHE DE / SALSA / Y BOLEROS EN / VIVO"). Datos en 3 filas hasta 590 px, 2 entre 591 y 959, 1 desde 960.

**Datos (H37).** La hora del evento se muestra como "Puertas 8:00 p. m." aquí y en Chat, y "9:00 p. m." en Main. Unificar.

**Pantallas.** Evento.

---

#### N26 · Ficha de datos clave del evento

**Anatomía.** `<section aria-label="Datos clave del evento">` con 5 celdas: ícono en cuadro de 46 px · rótulo · valor · detalle.

| Celda | Ícono | Rótulo | Valor | Detalle |
|---|---|---|---|---|
| Fecha | placa "9" / "oct" con borde | "Fecha" | "Viernes 9 de octubre" | "2026 · este viernes" |
| Hora | reloj, fondo `#F3B27E` | "Hora" | "Puertas 8:00 p. m." | "Show 9:30 p. m." |
| Lugar | pin, fondo `#EE93BC` | "Lugar" | "Galería Café Libro" | "Zona T, Bogotá" |
| Edad | documento, fondo `#A3A8F0` | "Edad" | "+18" | "Con documento original" |
| Precio | boleta, fondo `#B9E07A` | "Precio" | "Desde $45.000" | enlace "Ver localidades" (a `#localidades`) |

**Estilos exactos.** Caja `background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 24px; padding: 8px; display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 4px`. Celda `display: flex; align-items: center; gap: 12px; padding: 12px 14px; min-width: 0`. Ícono `aria-hidden`: `flex-shrink: 0; width: 46px; height: 46px; border-radius: 12px; display: grid; place-items: center` con SVG de 22 px; la fecha usa `box-sizing: border-box; border: 1px solid #EAE1D8; flex-direction: column` con número Archivo 900 `1.3rem` y mes `.62rem` 700 mayúsculas `.06em` `#6E6259` (`margin-top: 2px`). Texto `min-width: 0; line-height: 1.3`: rótulo `display: block; font-size: .7rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: #6E6259`; valor `b` `display: block; font-size: .94rem`; detalle `display: block; font-size: .8rem; color: #6E6259`; enlace `display: inline-block; font-size: .8rem; font-weight: 700; border-bottom: 2px solid #17120F`.

**Estados.** Hover R1 en "Ver localidades". Estático en lo demás.

**Responsive (medido).** 1 / 2 / 3 / 4 / 5 columnas con cortes en 394, 583, 758 y 932 px. **H61:** a 768 px queda en 4 + 1 y "Show 9:30 p. m." se parte: elegir un mínimo que evite la fila suelta.

**Correcciones.** **H21:** "Desde $45.000" debe aclarar el cargo. **H4:** si aplica, "PULEP: [CÓDIGO]" en los datos clave (no diseñado). **H10:** "+18" requiere confirmación en la compra. "2026 · este viernes" es texto fijo (H53: fechas relativas desde el servidor).

**Pantallas.** Evento.

```html
<section aria-label="Datos clave del evento" class="key-facts">
  <div class="fact"><span class="fact-icon" aria-hidden="true">…</span>
    <div><span class="fact-label">Hora</span><b>Puertas 8:00 p. m.</b><span>Show 9:30 p. m.</span></div></div>
</section>
```

---

#### N27 · Acciones del evento y "quién va"

**Anatomía.** Fila de 4 botones ("Voy", "Me interesa", "Invitar amigos", Compartir) + tarjeta "quién va" (pila de avatares, texto, "Ver parches").

**Botones.** Todos `height: 48px; border-radius: 999px; font-size: .95rem; font-weight: 700; display: flex; align-items: center; gap: 8px` con ícono de 18 px.
- "Voy" ↔ "Vas a ir": `padding: 0 24px; border: 1px solid #17120F`; apagado fondo `#FFFFFF` texto `#17120F`; encendido fondo `#17120F` texto `#FFFFFF`; palomita (trazo 2.4). `aria-pressed`. Pagar una boleta lo enciende.
- "Me interesa": `padding: 0 22px; border: 1px solid #EAE1D8; background: #FFFFFF`; encendido el texto y la estrella pasan a `#C23A24` y la estrella se rellena. `aria-pressed`.
- "Invitar amigos": igual de estilo, avión de papel; **sin acción** (H38).
- Compartir: círculo de 48 px, `aria-label="Compartir evento"`, ícono de compartir; **sin acción** (H38, H34).

Fila `display: flex; flex-wrap: wrap; gap: 10px; align-items: center` (2 filas por debajo de 564 px).

**Tarjeta "quién va".** `background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 20px; padding: 18px 20px; display: flex; flex-wrap: wrap; align-items: center; gap: 14px 20px`. Pila: 5 círculos de 40 px con `border: 3px solid #FFFFFF`, solape −12 px, iniciales 700 `.74rem`: LM `#F3B27E`, AR `#A3A8F0`, SC `#EE93BC`, MG `#F6DC6A` y "+9" (`#17120F`, texto blanco, `.7rem`). Texto `flex: 1 1 220px`: "**Laura, Andrés, Sofía y 10 amigos más** van. " + (`#6E6259`) "{186} personas confirmadas · 340 interesadas". Enlace "Ver parches" (`.86rem` 700, `border-bottom: 2px solid #17120F; padding-bottom: 1px`, a `#parches`).

**Estados.** Ver arriba. **H26:** se puede volver de "Vas a ir" a "Voy" teniendo boletas: advertir. **H37:** diferenciar "Voy" de "Tengo boleta".

**Responsive (medido).** Tarjeta en 1 fila desde 614 px, 2 entre 396 y 613, 3 por debajo.

**Pantallas.** Evento.

---

#### N28 · Atajos de sección y "Sobre el evento"

**Atajos.** `<nav aria-label="En esta página">` con 6 enlaces de ancla: "Sobre el evento" (`#sobre`), "Programación" (`#programacion`), "Localidades" (`#localidades`), "Parches y muro" (`#parches`), "Lo que debes saber" (`#saber`), "Ubicación" (`#ubicacion`).
- Estilos: contenedor `display: flex; gap: 8px; overflow-x: auto; padding: 10px 0; margin: -22px 0 -18px; background: #FBF7F3`; desde 980 px `position: sticky; top: 69px; z-index: 4` (debajo del encabezado). Enlace `flex-shrink: 0; height: 40px; box-sizing: border-box; display: inline-flex; align-items: center; padding: 0 16px; border-radius: 999px; border: 1px solid #EAE1D8; background: #FFFFFF; font-size: .88rem; font-weight: 500; white-space: nowrap`.
- Estados: sin estado activo (no marca la sección visible); hover R1; foco R2. Las secciones tienen `scroll-margin-top: 140px`.
- Responsive: scroll horizontal por debajo de 866 px y entre 980 y 1233 px (818 px de contenido), sin pista (H61). **H16:** a 390 px quedan tapados por la barra de compra al navegar con Tab: `scroll-padding-bottom: 84px` por debajo de 980 px.
- Recomendado: marcar con `aria-current="true"` el atajo de la sección visible.

**Sobre el evento** (`#sobre`). `h2` "Sobre el evento"; dos párrafos (`max-width: 66ch; font-size: 1rem; gap: 12px`): "Una noche para bailar pegadito en Galería Café Libro. La orquesta [NOMBRE DE LA ORQUESTA] toca salsa brava, salsa romántica y boleros de siempre, en vivo y con [NÚMERO DE MÚSICOS] músicos en tarima." y "¿Nunca has bailado? Llega temprano: a las 8:30 p. m. hay clase de salsa gratis con [NOMBRE DEL PROFESOR O ACADEMIA]. Después, pista abierta hasta el cierre con DJ."; etiquetas estáticas (`height: 34px; box-sizing: border-box; display: inline-flex; align-items: center; padding: 0 14px; border-radius: 999px; border: 1px solid #EAE1D8; background: #FFFFFF; font-size: .84rem`): "Salsa", "Boleros", "Música en vivo", "Clase gratis", "Zona T". No son enlaces (podrían serlo en producción: decisión abierta).

**Pantallas.** Evento.

---

#### N29 · Línea de programación

**Anatomía.** `<ol>` en tarjeta; cada `<li>`: hora · riel (línea arriba, punto de color, línea abajo) · título (+ etiqueta opcional) y descripción.

**Datos exactos.**

| Hora | Punto | Título | Etiqueta | Descripción |
|---|---|---|---|---|
| "8:00 p. m." | `#F6DC6A` | "Apertura de puertas" | — | "Entra con tu documento y la boleta en el celular" |
| "8:30 p. m." | `#F3B27E` | "Clase de salsa gratis" | — | "Pasos básicos con [NOMBRE DEL PROFESOR O ACADEMIA]" |
| "9:30 p. m." | `#EE93BC` | "Orquesta en vivo" | "Plato fuerte" | "[NOMBRE DE LA ORQUESTA] · salsa brava y boleros" |
| "1:00 a. m." | `#A3A8F0` | "Cierre con DJ" | — | "[NOMBRE DEL DJ] hasta el cierre · [HORA DE CIERRE]" |

**Estilos exactos.** Lista `list-style: none; margin: 0; padding: 4px 20px; background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 22px`. Ítem `display: flex; align-items: stretch; gap: 14px`. Hora `flex: 0 0 84px; padding-top: 16px; font-weight: 700; font-size: .92rem`. Riel `aria-hidden`, `flex: 0 0 18px; display: flex; flex-direction: column; align-items: center`: línea superior `height: 20px; width: 2px` (`transparent` en el primero, `#EAE1D8` en los demás), punto `width: 18px; height: 18px; box-sizing: border-box; border-radius: 50%; border: 2px solid #17120F; background: {color}`, línea inferior `flex: 1; width: 2px` (`transparent` en el último). Contenido `flex: 1; min-width: 0; padding: 14px 0; border-bottom: 1px solid #F1EAE3` (sin borde en el último; `line-height: 1.35`): título `b 1rem` en fila `display: flex; flex-wrap: wrap; align-items: center; gap: 4px 10px` con la etiqueta "Plato fuerte" (N6); descripción `display: block; font-size: .86rem; color: #6E6259; margin-top: 2px`.

**Estados.** Estático. Programa por confirmar: No diseñado (hoy son marcadores `[…]`).

**Accesibilidad.** Lista ordenada; recomendado `<time>` en la hora.

**Pantallas.** Evento.

```html
<ol class="timeline">
  <li><time>8:00 p. m.</time><span class="rail" aria-hidden="true"><span class="dot" style="--c:#F6DC6A"></span></span>
    <div><b>Apertura de puertas</b><span>Entra con tu documento y la boleta en el celular</span></div></li>
  <li><time>9:30 p. m.</time><span class="rail" aria-hidden="true"><span class="dot" style="--c:#EE93BC"></span></span>
    <div><b>Orquesta en vivo</b> <span class="badge badge-dark">Plato fuerte</span><span>[NOMBRE DE LA ORQUESTA] · salsa brava y boleros</span></div></li>
</ol>
```

---

#### N30 · Plano de localidades y lista de precios

**Anatomía.** Dos columnas (`display: flex; flex-wrap: wrap; gap: 18px; align-items: flex-start`): **plano** (`flex: 1 1 320px`) con escenario, zonas seleccionables, pista y entrada, más una nota; **lista de precios** (`flex: 1 1 260px`) con una opción por localidad y una nota. Cabecera de la sección: `h2` "Localidades" + ayuda "Toca una zona del plano o de la lista para elegirla." (`.88rem`, `#6E6259`).

**Localidades (datos exactos).**

| id | Nombre (tarjeta) | Nombre completo (lista y checkout) | Corto | Precio | Unidad | Descripción | Disponibilidad | Máx. | Puestos | Color | Tinte |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `general` | "General" | "General" | "General" | $45.000 | "por persona" | "De pie · acceso a pista y barra" | "Disponible" | 8 | 1 | `#B9E07A` | `#E8F4D6` |
| `pref` | "Preferencial" | "Preferencial (mesa compartida)" | "Preferencial" | $70.000 | "por persona" | "Silla en mesa compartida, cerca de la pista" | "Últimas 12" (destacada) | 8 | 1 | `#A3A8F0` | `#E3E5FB` |
| `vip` | "Mesa VIP para 4" | "Mesa VIP para 4" | "Mesa VIP" | $320.000 | "por mesa" | "Mesa junto al escenario · [CONSUMO INCLUIDO]" | "Disponible" | 1 | 4 | `#F6DC6A` | `#FBF1C6` |

**Plano.** `role="group" aria-label="Plano del lugar: elige una zona"`; `background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 22px; padding: 14px; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 2.2fr) minmax(0, 1fr); gap: 8px`.
- Escenario (`aria-hidden`): `grid-column: 1 / -1; height: 48px; border-radius: 10px 10px 36px 36px; background: #17120F; color: #FFFFFF; display: grid; place-items: center; font-family: Archivo; font-weight: 900; font-size: .9rem; letter-spacing: .14em; text-transform: uppercase` — "Escenario".
- Mesas VIP (2 botones, izquierda y derecha, mismo estado): `position: relative; min-height: 148px; border-radius: 14px; border: 2px solid {borde}; background: {fondo}; box-shadow: {anillo}; padding: 10px 4px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; color: #17120F`; dibujo de 4 mesas (`grid-template-columns: repeat(2, 14px); gap: 8px`, cuadros de 14 px con `border-radius: 4px; border: 2px solid #17120F`); rótulo "Mesas VIP" `.72rem` 700 `line-height: 1.15`. `aria-label`: "Mesas VIP, lado izquierdo del escenario · $320.000 por mesa" y "Mesas VIP, lado derecho del escenario · $320.000 por mesa".
- Pista (`aria-hidden`, no seleccionable): `border-radius: 14px; border: 2px dashed #EE93BC; background: repeating-linear-gradient(135deg, #FCE9F2 0 10px, #F8DCEA 10px 20px); padding: 10px; gap: 2px`, "Pista" (Archivo 900 `.95rem`, mayúsculas, `.04em`) y "Para bailar con cualquier boleta" (`.74rem`, `#6E6259`, `line-height: 1.25`).
- Zona preferencial: `grid-column: 1 / -1; min-height: 96px; padding: 12px; gap: 10px`, 8 círculos de 18 px (`border: 2px solid #17120F`, `gap: 10px 16px`, con salto), rótulo "Zona preferencial · mesas compartidas" (`.8rem` 700). `aria-label="Zona preferencial con mesas compartidas · $70.000 por persona"`.
- Zona general: `grid-column: 1 / -1; min-height: 84px; padding: 12px; gap: 2px`, "Zona general · de pie" (`.84rem` 700) y "Acceso a pista y barra" (`.74rem`). `aria-label="Zona general, de pie · $45.000 por persona"`.
- Entrada (`aria-hidden`): flecha arriba 14 px + "Entrada" (`.7rem` 700, `.1em`, mayúsculas, `#6E6259`), centrado.
- Nota bajo el plano (`.76rem`, `#6E6259`): "Plano ilustrativo · [CONFIRMAR DISTRIBUCIÓN CON EL ORGANIZADOR]".

**Estados de zona.** Elegida: fondo = color de la localidad, `border: 2px solid #17120F`, `box-shadow: 0 6px 18px rgba(23,18,15,.18)` y palomita en círculo de 20 px `#17120F` (arriba a la derecha, 6 px en VIP y 8 px en las demás) con check blanco de 12 px; no elegida: fondo = tinte, borde transparente, sin sombra. `aria-pressed`. Agotada: No diseñado (H17 pide "Se agotó esta localidad").

**Lista de precios.** `role="group" aria-label="Precios por localidad"`, `display: flex; flex-direction: column; gap: 10px`. Opción (`<button aria-pressed>`): `width: 100%; box-sizing: border-box; display: flex; align-items: flex-start; gap: 12px; text-align: left; padding: 14px 16px; border-radius: 18px; border: 1.5px solid {#17120F elegida | #EAE1D8}; background: {tinte elegida | #FFFFFF}`. Muestra cuadrado de color `16 × 16; margin-top: 3px; border-radius: 5px; border: 1.5px solid #17120F`; texto (`line-height: 1.3`): nombre completo `b .95rem`, descripción `.8rem` `#6E6259`, insignia "Últimas 12" si aplica (N6); precio a la derecha `b 1rem` + unidad `.72rem` `#6E6259`. Nota (`.78rem`): "Precios en pesos colombianos. El cargo por servicio lo ves antes de pagar."

**Sincronía.** Elegir una localidad en el plano, en la lista, en la tarjeta de compra (N35) o en el checkout actualiza los cuatro y recorta los amigos elegidos al nuevo cupo (VIP: hasta 3; otras: hasta 7). Por defecto: General.

**Responsive (medido).** Plano y lista lado a lado entre 646 y 979 px y desde 1015 px; apilados en el resto (también entre 980 y 1014 px, cuando aparece la tarjeta de compra).

**Accesibilidad.** **H59:** opciones excluyentes → radios. Recomendado anunciar "Elegiste General · $45.000" (H49).

**Pantallas.** Evento.

```html
<section id="localidades" aria-labelledby="h-loc">
  <h2 id="h-loc">Localidades</h2><p>Toca una zona del plano o de la lista para elegirla.</p>
  <div role="group" aria-label="Plano del lugar: elige una zona" class="venue-plan">
    <div class="stage" aria-hidden="true">Escenario</div>
    <button type="button" aria-pressed="false" aria-label="Mesas VIP, lado izquierdo del escenario · $320.000 por mesa">…</button>
    <div class="dancefloor" aria-hidden="true"><b>Pista</b><span>Para bailar con cualquier boleta</span></div>
    <button type="button" aria-pressed="false" aria-label="Mesas VIP, lado derecho del escenario · $320.000 por mesa">…</button>
    <button type="button" aria-pressed="false" aria-label="Zona preferencial con mesas compartidas · $70.000 por persona">…</button>
    <button type="button" aria-pressed="true" aria-label="Zona general, de pie · $45.000 por persona">…</button>
    <div class="entrance" aria-hidden="true">Entrada</div>
  </div>
  <p class="note">Plano ilustrativo · [CONFIRMAR DISTRIBUCIÓN CON EL ORGANIZADOR]</p>
  <fieldset class="price-list"><legend class="sr-only">Precios por localidad</legend>
    <label class="option"><input type="radio" name="loc" value="general" checked>
      <span><b>General</b><span>De pie · acceso a pista y barra</span></span><span><b>$45.000</b><span>por persona</span></span></label>
    <label class="option"><input type="radio" name="loc" value="pref">
      <span><b>Preferencial (mesa compartida)</b><span>Silla en mesa compartida, cerca de la pista</span><span class="badge badge-accent">Últimas 12</span></span><span><b>$70.000</b><span>por persona</span></span></label>
  </fieldset>
  <p class="note">Precios en pesos colombianos. El cargo por servicio lo ves antes de pagar.</p>
</section>
```

---

#### N31 · Muro del evento (pestañas "Parches / Muro")

**Anatomía.** Cabecera de sección ("Parches para este evento" + "Únete a un grupo para llegar acompañado, o arma el tuyo." + botón "Armar parche") → pestañas N63 ("Parches (3)", "Muro (24)") → panel de parches (N13 `lista`) o panel del muro.

**Botón "Armar parche".** `height: 40px; border: 1px solid #17120F; background: #FFFFFF; border-radius: 999px; padding: 0 16px; font-weight: 700; font-size: .86rem; display: flex; align-items: center; gap: 6px` + "+" de 16 px. **Sin acción** (H38: conectarlo a "Nuevo parche", N57).

**Muro.** `role="tabpanel" aria-label="Muro"`, `display: flex; flex-direction: column; gap: 14px`.
- Compositor: fila `display: flex; gap: 10px; align-items: center`; avatar 40 px "CV"; campo con etiqueta oculta "Escribe en el muro" y placeholder "Pregunta o comenta algo del evento" (`width: 100%; box-sizing: border-box; height: 44px; border: 1px solid #EAE1D8; border-radius: 999px; padding: 0 16px; background: #FFFFFF; font-size: .95rem`); "Enviar" (`height: 44px; border: 0; border-radius: 999px; padding: 0 18px; background: #C23A24; color: #FFFFFF; font-weight: 700`), **sin acción** (H38).
- Mensaje: `display: flex; gap: 12px`; avatar enlazado 40 px (`aria-label="Perfil de {nombre}"`); burbuja `background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 4px 16px 16px 16px; padding: 10px 14px; line-height: 1.4` con "**{nombre}** · {tiempo}" (`.86rem`, tiempo `#6E6259`) y el texto.
- Datos: Sofía Cárdenas "hace 20 min" "¿Alguien sabe si hay guardarropa? Voy saliendo del trabajo."; Laura Martínez "hace 1 h" "La última vez tocaron hasta las 2. Lleven zapatos cómodos."; Andrés Ramírez "hace 3 h" "Me apunto al parche de Laura. ¿Hay que llevar algo?".

**Estados.** Vacío, enviando, error: No diseñado. **H9:** el muro no tiene moderación ni reportar.

**Pantallas.** Evento.

---

#### N32 · Tarjetas "Lo que debes saber"

**Anatomía.** Rejilla `repeat(auto-fit, minmax(220px, 1fr))` `gap: 12px` de tarjetas con ícono en cuadro de color, título y texto.

**Datos exactos.**

| Color | Título | Texto |
|---|---|---|
| `#A3A8F0` | "Documento original" | "Evento para mayores de 18. Presenta cédula, cédula de extranjería o pasaporte en la entrada." |
| `#EE93BC` | "No hay reingreso" | "Si sales del lugar, la boleta ya no te deja volver a entrar." |
| `#8FD3D0` | "Parqueadero" | "[CONFIRMAR CON EL ORGANIZADOR]. Si puedes, ven en transporte público o comparte carro con tu parche." |
| `#B9E07A` | "Accesibilidad" | "Acceso para silla de ruedas y baños accesibles: [CONFIRMAR CON EL ORGANIZADOR]." |
| `#F6DC6A` | "Boleta digital" | "Muestra el QR desde Fulleventos o desde tu correo. No tienes que imprimir nada." |
| `#F3B27E` | "Cambios y devoluciones" | "Si el evento cambia de fecha o se cancela: [POLÍTICA DE LA BOLETERA]." |

**Estilos exactos.** Tarjeta `background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 18px; padding: 16px; display: flex; align-items: flex-start; gap: 12px`. Ícono `aria-hidden` `width: 40px; height: 40px; flex-shrink: 0; border-radius: 12px; background: {color}` con SVG de 20 px (las rutas están en `Evento.dc.html:1137-1142`). Texto `min-width: 0; line-height: 1.4`: título `b` `display: block; font-size: .95rem`; texto `display: block; font-size: .85rem; color: #6E6259; margin-top: 2px`.

**Correcciones.** **H11:** quitar "o desde tu correo" (el correo solo confirma). **H27:** el retracto y las devoluciones deben informarse también antes de pagar (N38, paso 3). **H58:** las rutas de íconos con plantilla generan errores de consola al cargar; en producción, íconos como componentes.

**Responsive (medido).** 1 / 2 / 3 / 4 / 2 / 3 columnas con cortes en 492, 732, 964, 980 y 1102 px.

**Pantallas.** Evento.

---

#### N33 · Ubicación y organizador

**Ubicación.** Tarjeta `flex: 1.3 1 300px; min-width: 0; background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 20px; overflow: hidden; display: flex; flex-direction: column`.
- Mapa marcador `role="img" aria-label="[Mapa de la ubicación]"`: `height: 170px; position: relative; background: linear-gradient(90deg, transparent 47%, #FFFFFF 47%, #FFFFFF 53%, transparent 53%), linear-gradient(0deg, transparent 58%, #FFFFFF 58%, #FFFFFF 63%, transparent 63%), #EDE5DC` (dos calles blancas), pin relleno de 34 px `#C23A24` con centro blanco en `left: 50%; top: 52%; transform: translate(-50%, -100%)`, rótulo "[Mapa]" (`.72rem`, `#6E6259`, abajo a la izquierda).
- Texto (`padding: 16px 18px; line-height: 1.4; gap: 10px; flex: 1`): "**Galería Café Libro**" y "Zona T, Bogotá · [DIRECCIÓN]" (`.88rem`, `#6E6259`).
- Acciones (`margin-top: auto; gap: 8px`, con salto): "Ver en el mapa" (`<a>` a Mapa, `height: 42px; border-radius: 999px; padding: 0 16px; background: #17120F; color: #FFFFFF; gap: 6px; font-weight: 700; font-size: .86rem` + ícono 16 px) y "Copiar dirección" ↔ "Dirección copiada" (`height: 42px; border: 1px solid #EAE1D8; background: #FFFFFF; border-radius: 999px; padding: 0 16px; font-weight: 700; font-size: .86rem`, `aria-pressed`; una vez copiada no vuelve).

**Organizador.** Tarjeta `flex: 1 1 260px; background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 20px; padding: 18px; display: flex; flex-direction: column; gap: 14px`.
- Fila: avatar cuadrado 48 px `border-radius: 14px; background: #17120F; color: #F6DC6A` "GC" (Archivo 900); texto "Organiza" (`.72rem`, 700, `.08em`, mayúsculas, `#6E6259`), "**Galería Café Libro**", "12,4 mil seguidores" (`.8rem`); botón "Seguir" ↔ "Siguiendo" (`height: 38px; border-radius: 999px; padding: 0 14px; font-size: .82rem; font-weight: 700; border: 1px solid #17120F`; apagado `#17120F`/blanco, encendido blanco/`#17120F`; `aria-pressed`).
- Texto `.88rem` `#6E6259`: "¿Dudas sobre mesas, cumpleaños o accesibilidad? Escríbele directo por el chat de Fulleventos."
- "Escribir al organizador" (`<a>` a Chat, `margin-top: auto; height: 46px; box-sizing: border-box; border-radius: 999px; border: 1px solid #17120F; background: #FFFFFF; display: flex; align-items: center; justify-content: center; gap: 8px; font-weight: 700; font-size: .9rem` + ícono de chat 18 px).

**Correcciones.** **H48:** la insignia de verificado que sale en el Chat no aparece aquí ni en el checkout; mostrarla igual en los tres con explicación de qué se verificó. **H42:** "Escribir al organizador" abre hoy el chat "Salseros de jueves"; debe abrir la conversación con Galería Café Libro. "Ver en el mapa" debe abrir Bogotá.

**Responsive (medido).** Lado a lado entre 664 y 979 px y desde 1033 px; apiladas en el resto (también entre 980 y 1032 px).

**Pantallas.** Evento.

---

#### N34 · Planes parecidos y recuerdos del evento

**Contenedor.** `display: flex; flex-wrap: wrap; gap: 24px; align-items: flex-start; margin-top: 16px; padding-top: 32px; border-top: 1px solid #EAE1D8` (lado a lado desde 970 px).

**Planes parecidos** (`flex: 2 1 560px`). Cabecera: `h2` "Planes parecidos en otras ciudades" + "Rumba este finde por fuera de Bogotá" (`.88rem`) y enlace "Ver más planes en el mapa" (ícono de mapa). Rejilla `repeat(auto-fill, minmax(200px, 1fr))` `gap: 16px` de tarjetas (variante `parecida` de TarjetaEvento): imagen `aspect-ratio: 16 / 10` (degradado 58 %, placa `md`); cuerpo `padding: 12px 14px 14px; display: flex; flex-direction: column; flex: 1; line-height: 1.3`: categoría `.7rem`, título `<a>` 700 `.98rem` (`margin: 4px 0`), "{lugar} · **{ciudad}**" (`.82rem`), precio `.86rem` 700 (`margin-top: auto; padding-top: 10px`). Datos: e10 "Viejoteca de salsa caleña" (10 oct, Juanchito, Cali, "Desde $40.000"); e7 "Noche de reguetón en Provenza" (9 oct, Barrio Provenza · El Poblado, Medellín, "Desde $50.000"); e13 "Noche de champeta en Getsemaní" (9 oct, Plaza de la Trinidad · Getsemaní, Cartagena, "Desde $30.000"). Sin Guardar, sin línea social, sin botón. Rejilla **(medido)**: 1 / 2 / 3 / 4 (una vacía) / 2 / 3 columnas con cortes en 453, 680, 896, 970 y 1078 px.

**Recuerdos de ediciones pasadas** (`flex: 1 1 300px`; tarjeta blanca `border-radius: 20px; padding: 18px; gap: 12px`): `h2` `1rem` "Recuerdos de ediciones pasadas"; rejilla `repeat(3, minmax(0, 1fr))` `gap: 6px` de 6 cuadros `aspect-ratio: 1; border-radius: 10px; role="img" aria-label="[Foto de asistente]"` (degradados exactos en `Evento.dc.html:497-502`); enlace "Ver las 128 fotos" (`.86rem` 700, `border-bottom: 2px solid #17120F`, a Perfil). A 768 px los cuadros miden 223 px (bloque muy alto): limitar.

**Pantallas.** Evento.

---

#### N35 · Tarjeta de compra fija

**Anatomía.** `<aside aria-label="Comprar boletas">` (`flex: 1 1 340px; max-width: 380px; min-width: 0`) → tarjeta: precio desde + "En venta" · aviso de compra hecha (opcional) · localidades (N39 variante `tarjeta`) · cantidad (N36) · subtotal · botón de compra · nota de pago seguro.

**Textos exactos.** "Boletas" (rótulo gris `.72rem`); "Desde $45.000" (Archivo 900 `1.7rem`, `-0.02em`, `margin-top: 2px`); "+ cargo por servicio" (`.8rem`); "En venta" (N6); "Localidad"; "Cantidad" + ayuda ("Máximo 8 por compra" | "Una mesa es para 4 personas" | "Tú + {k} de Salseros de jueves"); "Subtotal · {q} {boleta|boletas|mesa|mesas} × {precio}" (ej. "Subtotal · 2 boletas × $45.000") y el monto (`b 1.1rem`, ej. "$90.000"); botón "Comprar boletas" | "Comprar más boletas" (tras comprar); nota con candado: "Pago seguro · Boleta oficial emitida por [BOLETERA]. Compras sin salir de Fulleventos."

**Aviso de compra hecha** (`role="status"`, tras pagar): `display: flex; align-items: center; gap: 10px; background: #F1F8E6; border: 1.5px solid #B9E07A; border-radius: 16px; padding: 10px 12px`; círculo de 32 px `#17120F` con palomita `#B9E07A`; "**Tienes {n} boleta|boletas · {localidad corta}**" (`.92rem`) y detalle (`.76rem`): "También te llegaron al correo" o "{n} pago pendiente|pagos pendientes de tu parche"; botón "Ver boleta" (`height: 36px; border: 0; background: transparent; padding: 0 4px; font-size: .82rem; font-weight: 700; text-decoration: underline; text-underline-offset: 3px`) que abre el checkout en el paso 4.

**Estilos exactos.** Tarjeta `background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 24px; padding: 20px; display: flex; flex-direction: column; gap: 16px; box-shadow: 0 14px 40px rgba(23,18,15,.07)`; desde 980 px `position: sticky; top: 88px`. Grupo de localidades `role="group" aria-labelledby="fe-card-loc"`, `gap: 8px`. Fila de cantidad `display: flex; align-items: center; justify-content: space-between; gap: 12px`. Subtotal `display: flex; justify-content: space-between; align-items: baseline; gap: 10px; padding-top: 14px; border-top: 1px dashed #EAE1D8` (texto `.88rem` `#6E6259`). Botón `height: 54px; border: 0; border-radius: 999px; background: #C23A24; color: #FFFFFF; font-weight: 700; font-size: 1rem; display: flex; align-items: center; justify-content: center; gap: 8px` + boleta 18 px. Nota `display: flex; align-items: flex-start; gap: 8px; font-size: .78rem; color: #6E6259; line-height: 1.4` + candado 16 px.

**Estados.** Sin compra / con compra (ver arriba). Agotado, cargando, error: No diseñado (H17).

**Responsive.** Solo desde 980 px; por debajo se oculta y aparece N37.

**Correcciones.** **H21:** mostrar el total con cargo ("Total $97.200 (incluye cargo por servicio)"). **H22:** cantidad inicial 1. **H26:** acumular órdenes ("Tienes 6 boletas en 2 órdenes") y abrir la boleta en un visor aparte. **H1:** "Compras sin salir de Fulleventos" según el canal. **H48:** insignia del organizador verificado.

**Pantallas.** Evento.

```html
<aside aria-label="Comprar boletas" class="buy-card">
  <div class="buy-head"><div><span class="label">Boletas</span><b class="price">Desde $45.000</b><span>+ cargo por servicio</span></div>
    <span class="badge badge-success">En venta</span></div>
  <div role="status" class="purchase-note"><!-- solo tras pagar -->
    <b>Tienes 2 boletas · General</b><span>También te llegaron al correo</span><button type="button">Ver boleta</button></div>
  <fieldset><legend id="card-loc">Localidad</legend><!-- opciones N39, variante tarjeta --></fieldset>
  <div class="qty"><!-- N36, valor inicial 1 (H22) --></div>
  <p class="subtotal"><span>Subtotal · 1 boleta × $45.000</span><b>$45.000</b></p>
  <button type="button" class="btn btn-primary btn-lg">…Comprar boletas</button>
  <p class="secure">…Pago seguro · Boleta oficial emitida por [BOLETERA]. Compras sin salir de Fulleventos.</p>
</aside>
```

---

#### N36 · Selector de cantidad

**Anatomía.** Rótulo + ayuda a la izquierda; a la derecha, grupo en píldora: botón − · número · botón +.

**Estilos exactos.** Grupo `role="group" aria-labelledby="{id del rótulo}"`, `flex-shrink: 0; display: flex; align-items: center; gap: 4px; border: 1px solid #EAE1D8; border-radius: 999px; padding: 4px`. Botones `width: 40px; height: 40px; border-radius: 50%; border: 0; background: #FBF7F3; color: #17120F; display: grid; place-items: center` con − o + de 16 px (trazo 2.6). Número `aria-live="polite"`, `min-width: 30px; text-align: center; font-weight: 700; font-size: 1.05rem`.

**Variantes.** En la tarjeta (rótulo gris `.72rem` + ayuda `.78rem`); en el checkout, dentro de una caja (`background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 16px; padding: 12px 14px`) con rótulo "Cantidad" `b .95rem`.

**Estados.** Mínimo 1, máximo 8 (General y Preferencial) o 1 (Mesa VIP). En el límite el botón se deshabilita (`disabled`, `opacity: .45`, `cursor: default`); **H7:** usar `aria-disabled`. En modo "Para mi parche" ambos botones quedan deshabilitados (la cantidad es 1 + amigos, o 1 mesa). Nombres: "Quitar una boleta" / "Agregar una boleta" (VIP: "Quitar una mesa" / "Agregar una mesa"). **H22:** valor inicial 2 → **1** (o pedir la cantidad de forma explícita) y subir el selector junto a la localidad: en el paso 1 del checkout, a 390 × 844, hoy queda debajo del primer pantallazo.

**Pantallas.** Evento (tarjeta y checkout).

```html
<div class="qty"><div><span id="qty-l">Cantidad</span><span>Máximo 8 por compra</span></div>
  <div role="group" aria-labelledby="qty-l" class="stepper">
    <button type="button" aria-label="Quitar una boleta" aria-disabled="true">−</button>
    <span aria-live="polite">1</span>
    <button type="button" aria-label="Agregar una boleta">+</button></div></div>
```

---

#### N37 · Barra de compra móvil

**Anatomía.** `role="region" aria-label="Comprar boletas"` fija abajo: precio desde + detalle · "Ver boleta" (si ya compró) · "Comprar".

**Textos exactos.** "Desde $45.000" (`b 1rem`); detalle (`.76rem`, `#6E6259`, una línea con puntos suspensivos): "{localidad} · {q} {unidad} · {subtotal}" (ej. "General · 2 boletas · $90.000") o, tras comprar, "Tienes {n} boletas · {localidad corta}"; botones "Ver boleta" y "Comprar".

**Estilos exactos.** `position: fixed; left: 0; right: 0; bottom: 0; z-index: 15; background: #FFFFFF; border-top: 1px solid #EAE1D8; box-shadow: 0 -10px 30px rgba(23,18,15,.08); padding: 10px clamp(16px, 4vw, 24px); display: flex; align-items: center; gap: 12px` (solo por debajo de 980 px; la página gana `padding-bottom: 84px`). "Ver boleta" `flex-shrink: 0; height: 44px; border: 1px solid #17120F; border-radius: 999px; padding: 0 14px; background: #FFFFFF; font-weight: 700; font-size: .86rem`. "Comprar" `flex-shrink: 0; height: 48px; border: 0; border-radius: 999px; padding: 0 22px; background: #C23A24; color: #FFFFFF; font-weight: 700; font-size: .95rem`. **(medido)** 69 px de alto.

**Correcciones.** **H16:** `scroll-padding-bottom: 84px` para que el foco no quede debajo. **H21:** mostrar el total con cargo. **H59:** enlace "Ir a comprar boletas" al inicio de la página.

**Pantallas.** Evento (celular y tableta).

```html
<div role="region" aria-label="Comprar boletas" class="buy-bar">
  <div><b>Desde $45.000</b><span class="truncate">General · 1 boleta · $45.000</span></div>
  <button type="button" class="btn btn-outline">Ver boleta</button><!-- solo si ya compró -->
  <button type="button" class="btn btn-primary">Comprar</button>
</div>
```

---

#### N38 · Checkout en panel lateral (stepper y temporizador)

**Anatomía.** Fondo oscuro (clic cierra) → panel `role="dialog" aria-modal="true" aria-labelledby="fe-co-title"`: **cabecera fija** (miniatura, título "Compra tus boletas", detalle, cerrar; stepper de 4 pasos; temporizador) → **cuerpo** del paso → **pie fijo** (resumen N44, "Atrás", botón principal, pista del bloqueo). El paso 4 no tiene temporizador ni pie.

**Textos de la cabecera.** "Compra tus boletas" (Archivo 900 `1.2rem`, `-0.02em`, mayúsculas); "Noche de salsa y boleros en vivo · Vie 9 oct · Galería Café Libro" (`.82rem`); cerrar `aria-label="Cerrar la compra"`; pasos "Boletas", "Datos", "Pago", "Listo" (`<ol aria-label="Pasos de la compra">`); temporizador "Tus boletas están reservadas por **9:58**" (texto fijo, no corre).

**Pasos.**
1. **Boletas:** localidad (N39 variante `checkout`, título `h3` "Localidad"); "¿Para quién?" (N19); si "Solo para mí", cantidad (N36); si "Para mi parche", panel del parche con miembros e interruptor de dividir (N40).
2. **Datos:** "Tus datos" + "La boleta sale a tu nombre. Ya llenamos lo que sabemos de tu perfil."; campos (N41): "Nombre completo" (precargado "Camila Vargas"), "Tipo de documento" (CC / CE / Pasaporte), "Número de documento" (placeholder "Sin puntos ni espacios"), "Correo" ("camila.vargas@correo.co"), "Celular" ("300 123 4567"). Si hay más de una persona, bloque "Asistentes" (borde superior, `padding-top: 14px`) con ayuda "Opcional. También lo puedes completar después desde Mis boletas." (o, con pago dividido, "Tus amigos completan sus datos cuando pagan su parte.") y, por cada persona desde la 2.ª: campo "Boleta {n} · Nombre del asistente" (placeholder "Opcional") o, si es un amigo del parche, fila con avatar de 36 px, "Boleta {n} · {Nombre}" y nota "La boleta queda a su nombre" / "Lo completan ellos al pagar su parte".
3. **Pago:** `h3` "¿Cómo quieres pagar?" con el selector de medio (N42) y su panel, casilla de términos (N43) y nota con escudo (`display: flex; align-items: flex-start; gap: 8px; font-size: .78rem; color: #6E6259; line-height: 1.4` + escudo con palomita de 16 px): "Tu pago se procesa por API con [BOLETERA] o con la pasarela de Fulleventos ([PASARELA]). No sales de Fulleventos."
4. **Listo:** confirmación (N46) con boleta (N45).

**Botón principal y pistas.** Texto: "Continuar" (paso 1), "Continuar al pago" (paso 2), "Pagar {monto}" (paso 3; ej. "Pagar $97.200" o, con pago dividido, "Pagar $48.600") + flecha. Bloqueos y pista (debajo del botón, `.78rem`, centrada, `margin: -4px 0 0`):
- Paso 1, para el parche sin amigos: "Elige al menos un amigo del parche."
- Paso 2, sin documento: "Escribe tu número de documento para continuar."; con otro campo vacío: "Completa tus datos para continuar."
- Paso 3: "Elige cómo quieres pagar." → (PSE sin banco) "Elige tu banco para pagar con PSE." → (sin términos) "Acepta los términos y la política de datos para pagar."

"Atrás" aparece desde el paso 2.

**Comportamiento.** Abrir: botón de la tarjeta o de la barra móvil. Cerrar: X, clic en el fondo o Escape (hoy solo si el foco está dentro). Cerrar y reabrir conserva lo escrito; reabrir después de comprar arranca en el paso 1 con términos, medio, banco y división reiniciados. "Ver boleta" abre directo el paso 4. Pagar marca "Vas a ir" y guarda la compra.

**Estilos exactos.**
- Capa `position: fixed; inset: 0; z-index: 30`; fondo `position: absolute; inset: 0; background: rgba(23,18,15,.55)` (`aria-hidden`).
- Panel `position: absolute; top: 12px; right: 12px; width: min(520px, calc(100% - 24px)); max-height: calc(100% - 24px); overflow-y: auto; background: #FBF7F3; border-radius: 24px; box-shadow: 0 24px 60px rgba(23,18,15,.35)`.
- Cabecera `position: sticky; top: 0; z-index: 2; background: #FBF7F3; padding: 18px 20px 14px; border-bottom: 1px solid #EAE1D8; display: flex; flex-direction: column; gap: 14px`. Miniatura 48 px `border-radius: 12px` (`radial-gradient(circle at 70% 30%, rgba(232,160,79,.9) 0, transparent 55%), radial-gradient(circle at 20% 80%, rgba(181,55,43,.8) 0, transparent 50%), #140E10`). Cerrar `width: 44px; height: 44px; border: 0; border-radius: 50%; background: #FFFFFF` + X 16 px.
- Stepper `display: grid; grid-template-columns: repeat(4, minmax(0, 1fr))`. Paso `position: relative; display: flex; flex-direction: column; align-items: center; gap: 4px; text-align: center`, `aria-current="step"` en el actual. Círculo `width: 26px; height: 26px; box-sizing: border-box; border-radius: 50%; font-size: .78rem; font-weight: 700; border: 1.5px solid`: hecho fondo `#B9E07A`, borde `#17120F`, palomita 13 px; actual fondo `#17120F`, texto `#FFFFFF`; pendiente fondo `#FFFFFF`, borde `#D9CEC3`, número `#17120F`. Rótulo `.8rem`, 700 en el actual y 500 en los demás, `#17120F` (hecho y actual) o `#6E6259`, con puntos suspensivos. Conector `position: absolute; top: 12px; left: calc(50% + 19px); right: calc(-50% + 19px); height: 2px` en `#17120F` si el paso está hecho o `#D9CEC3`.
- Temporizador `<p>` `display: flex; align-items: center; gap: 8px; background: #F6DC6A; border-radius: 12px; padding: 8px 12px; font-size: .84rem` + cronómetro 16 px.
- Cuerpo `padding: 20px; display: flex; flex-direction: column; gap: 20px` (paso 1 `gap: 22px`; paso 2 `gap: 14px`; paso 3 `gap: 16px`; paso 4 `gap: 18px`).
- Pie `position: sticky; bottom: 0; z-index: 2; background: #FFFFFF; border-top: 1px solid #EAE1D8; padding: 14px 20px 18px; display: flex; flex-direction: column; gap: 12px`. Fila de botones `display: flex; align-items: center; gap: 10px`: "Atrás" `height: 52px; border: 0; background: transparent; padding: 0 14px; font-weight: 700`; principal `flex: 1; height: 52px; border: 0; border-radius: 999px; background: #C23A24; color: #FFFFFF; font-weight: 700; font-size: 1rem; gap: 8px` + flecha 16 px; deshabilitado con `opacity: .45`.

**Responsive (medido).** 520 px de ancho desde 544 px de ventana; por debajo, todo el ancho menos 24 px (366 px a 390). Cabecera de 205 px (desde 544 px) a 229 px (390), 246 px (360) y 266 px (320). Pie de **174 a 242 px**: 174 sin pista; 201 con la pista de una línea (220 a 320 px, donde la pista ocupa dos); 215 con la fila "Tú pagas 1 de N"; 242 con esa fila y la pista a la vez (pago dividido en los pasos 2 o 3). A 844 × 390 y 640 × 360 el espacio para el contenido es negativo. El `scroll-padding` inferior de 215 px que probó la auditoría (H6) no cubre el caso de 242 px: calcularlo con el alto real del pie.

**Correcciones obligatorias.**
- **H6:** columna flexible con cabecera y pie fuera del scroll y un contenedor con scroll por paso (que arranque arriba); mínimo `scroll-padding: 270px 0 215px`; `@media (max-height: 600–720px)` compacto ("Paso 2 de 4" en una línea, temporizador abajo, resumen "Total $97.200 · Ver detalle"); pantalla completa en celular; probar a 320 × 256 y 640 × 360.
- **H7:** `aria-disabled` en el botón principal (no `disabled`), foco al abrir (en "Cerrar"), fondo `inert`, Escape desde cualquier punto, foco al título de cada paso y anunciar "Paso 2 de 4: Tus datos"; en producción `<dialog>` con `showModal()` y devolver el foco al botón que abrió.
- **H17:** estados "Procesando…", "Aprueba el pago en tu app Nequi o Daviplata (tienes X min)" con cancelar o cambiar de medio, "Te llevamos a tu banco", "Volviste de PSE: estamos confirmando tu pago", "Pago rechazado: intenta con otro medio" (sin perder lo llenado), "Pago en verificación: te avisamos por correo", "Tu reserva venció, ¿la renovamos?" y "Se agotó esta localidad". **No diseñados.**
- **H3/H17:** temporizador real, solo después de elegir localidad y cantidad, con avisos `role="alert"` a los 2 min y a los 30 s.
- **H5:** en el paso 3, bloque "Vendido por [ ] · NIT [ ] · Organiza [ ] · Boleta emitida por [ ]".
- **H1 y H17:** quitar el absoluto "No sales de Fulleventos" de la nota del paso 3 (PSE y Botón Bancolombia abren la ventana del banco) y condicionar el texto al canal de venta del evento.
- **H27:** encima de "Pagar", bloque de retracto y devoluciones ("Retracto: aplica / no aplica porque el evento es el [fecha]"; "Si cancelan o cambian el evento: te devolvemos [%] en [X] días al mismo medio de pago"; quién devuelve; enlace a la política).
- **H10:** en eventos +18, casilla obligatoria en el paso 1: "Confirmo que todos los asistentes son mayores de 18".
- **H23, H28:** ver N41 y N43. **H25:** ver N40. **H24:** mesa VIP con pago dividido (ver N45). **H26:** "Ver boleta" en visor aparte. **H4:** opción "¿Necesitas factura a nombre de empresa?" con NIT, razón social y correo de facturación en el paso 2 (no diseñado).

**Pantallas.** Evento. Capturas: `compra-1-boletas.jpg`, `compra-1b-parche-dividir.jpg`, `compra-2-datos.jpg`, `compra-3-pago.jpg`, `compra-4-listo.jpg`, `compra-celular.jpg`.

```html
<dialog class="checkout" aria-labelledby="co-title">
  <header class="co-head">
    <h2 id="co-title">Compra tus boletas</h2><p>Noche de salsa y boleros en vivo · Vie 9 oct · Galería Café Libro</p>
    <button type="button" aria-label="Cerrar la compra">…</button>
    <ol aria-label="Pasos de la compra">
      <li aria-current="step"><span>1</span> Boletas</li><li><span>2</span> Datos</li><li><span>3</span> Pago</li><li><span>4</span> Listo</li>
    </ol>
    <p class="timer" role="timer">Tus boletas están reservadas por <b>9:58</b></p>
  </header>
  <section class="co-body" tabindex="-1" aria-labelledby="step-title">…</section>
  <footer class="co-foot">
    <div role="group" aria-label="Resumen de la compra">…</div>
    <button type="button">Atrás</button>
    <button type="button" class="btn btn-primary" aria-disabled="true" aria-describedby="co-hint">Continuar al pago</button>
    <p id="co-hint">Escribe tu número de documento para continuar.</p>
  </footer>
</dialog>
```

---

#### N39 · Opción con radio (tarjeta de opción)

**Anatomía.** Botón de ancho completo: círculo de radio · texto (título + detalle) · valor a la derecha (opcional).

**Variantes.**

| Variante | Dónde | Caja | Radio | Texto | Derecha |
|---|---|---|---|---|---|
| `checkout` | Paso 1 | `min-height: 62px; padding: 10px 14px; border-radius: 16px; gap: 12px` | 20 px, borde 2 px `#17120F`, punto 10 px | nombre completo `b .92rem` + descripción `.76rem` `#6E6259` (`line-height: 1.25`) | precio `b .92rem` + disponibilidad `.7rem` 700 (`#C23A24` si es "Últimas 12", si no `#6E6259`) |
| `tarjeta` | N35 | `min-height: 56px; padding: 8px 12px; border-radius: 14px; gap: 10px` | igual | nombre `b .9rem` + disponibilidad `.74rem` 700 (mismo color) | precio `b .9rem` |
| `lista` | N30 | `padding: 14px 16px; border-radius: 18px; gap: 12px; align-items: flex-start` | sin radio: cuadrado de color 16 px | ver N30 | precio + unidad |
| `destino` | N16 | `min-height: 52px; padding: 8px 14px; border-radius: 14px; gap: 12px` | igual (20/10 px) | título `b .9rem` + detalle `.78rem` | — |

Común: `width: 100%; box-sizing: border-box; display: flex; align-items: center; text-align: left; border: 1.5px solid; color: #17120F`. **Elegida:** borde `#17120F`, punto `#17120F`, fondo = tinte de la localidad (`#E8F4D6`, `#E3E5FB`, `#FBF1C6`) o `#FBF7F3` (destino). **No elegida:** borde `#EAE1D8`, punto transparente, fondo `#FFFFFF`.

**Estados.** Elegida / no elegida (`aria-pressed`). Agotada, deshabilitada: No diseñado. Sin hover.

**Accesibilidad.** **H59:** convertir en radios nativos (`<input type="radio">` dentro de `<label>`, en `fieldset` con `legend`) o `role="radiogroup"`/`role="radio"` con flechas.

**Pantallas.** Evento, Agenda.

```html
<fieldset class="options"><legend>Localidad</legend>
  <label class="option"><input type="radio" name="loc" value="general" checked>
    <span><b>General</b><span>De pie · acceso a pista y barra</span></span>
    <span><b>$45.000</b><span>Disponible</span></span></label>
</fieldset>
```

---

#### N40 · Selector de miembros del parche e interruptor

**Panel del parche** (checkout, "Para mi parche"): caja `background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 20px; padding: 16px; display: flex; flex-direction: column; gap: 14px`.
- Cabecera: avatar cuadrado 44 px `border-radius: 12px; background: #F6DC6A` "SL" (Archivo 900 `.9rem`); "**Salseros de jueves**" (`.95rem`) y "12 miembros · elige quién va contigo" (`.8rem`); píldora "Van {1 + k}" (N6).
- Miembros (`role="group" aria-label="Miembros del parche"`, `display: flex; flex-wrap: wrap; gap: 8px`): botón por amigo con `aria-label="{Nombre completo}"` y `aria-pressed`; `height: 44px; border-radius: 999px; padding: 0 12px 0 5px; display: flex; align-items: center; gap: 8px; border: 1.5px solid {#17120F elegido | #EAE1D8}; background: {#FBF7F3 | #FFFFFF}; font-size: .86rem; font-weight: 500`; avatar 32 px (`.7rem`) + nombre corto + palomita 14 px si está elegido. Miembros: Laura (LM), Andrés (AR), Sofía (SC), Juan Pablo (JP), María F. (MG), Daniel (DT), Valentina (VQ). Por defecto: Laura. Al llegar al cupo, los no elegidos se deshabilitan (`opacity: .45`).
- Nota (`.78rem`): "Y 4 miembros más en el parche. Máximo 8 boletas por compra." | (VIP) "Una mesa VIP es para 4: elige hasta 3 amigos. Y 4 miembros más en el parche."
- **Interruptor "Dividir el pago"** (`<button role="switch" aria-checked>`): `display: flex; align-items: center; gap: 12px; width: 100%; text-align: left; min-height: 52px; background: transparent; border: 0; border-top: 1px solid #F1EAE3; padding: 12px 0 0`. Pista `width: 46px; height: 28px; border-radius: 999px; background: {#C23A24 encendido | #D9CEC3 apagado}` con perilla `top: 3px; left: {21px | 3px}; width: 22px; height: 22px; border-radius: 50%; background: #FFFFFF; box-shadow: 0 1px 3px rgba(23,18,15,.3)` (sin transición). Texto "**Dividir el pago: cada uno paga su parte**" (`.9rem`) y "Les llega su link de pago en el chat del parche" (`.76rem`). Deshabilitado sin amigos elegidos.
- **Nota de pago dividido** (encendido): `display: flex; align-items: flex-start; gap: 10px; background: #FBF7F3; border-radius: 14px; padding: 12px 14px` + ícono de chat 18 px; texto `.86rem; line-height: 1.45`: "**Tú pagas 1 de {N} · {parte}.** Cada amigo recibe un link de pago en el chat de Salseros de jueves y paga su parte sin salir de Fulleventos. Sus cupos quedan apartados por [PLAZO DE RESERVA]." (ej. "Tú pagas 1 de 2 · $48.600.").

**Cálculos.** Cantidad = 1 + amigos (o 1 mesa en VIP); parte = `round(total / (1 + amigos))`.

**Interruptor del chat** (N56): mismo patrón visual con `aria-pressed` (no `role="switch"`), pista 44 × 26 (`#17120F` encendido / `#EAE1D8` apagado), perilla 20 px con `transition: left 160ms ease`.

**Correcciones.** **H52:** pistas apagadas con contraste ≥ 3:1 (por ejemplo `#857870`, 4,27:1 sobre blanco) y estado también en texto. **H25:** los 7 amigos elegibles son los que ya tienen boleta según el chat; mostrar "Ya tiene boleta" (deshabilitado) y dejar elegir a los que no. **H24:** avisar cuando se recortan amigos al pasar a VIP. **H29:** cambiar "link de pago" por "solicitud de pago dentro de la app". **H18:** mostrar plazo, recordatorios y qué pasa si un amigo no paga (no diseñado). **H1:** "paga su parte sin salir de Fulleventos" depende del canal de venta.

**Pantallas.** Evento (checkout), Chat (variante interruptor).

---

#### N41 · Campos de formulario

**Anatomía.** `<label>` en columna (rótulo arriba, `gap: 6px`, 700) con el campo dentro.

**Variantes.**

| Variante | Dónde | Campo | Rótulo |
|---|---|---|---|
| `registro` | Registro paso 1 | `height: 48px; border: 1px solid #D9CEC3; border-radius: 12px; padding: 0 14px; font-size: 1rem; font-weight: 400; background: #FBF7F3; outline: 0` | `.9rem` |
| `datos` | Checkout paso 2 | `height: 48px; width: 100%; box-sizing: border-box; border: 1px solid #D9CEC3; border-radius: 12px; padding: 0 14px` (select `0 10px`); `font-size: 1rem; background: #FFFFFF; color: #17120F` | `.86rem` |
| `pago` | Checkout paso 3 | `height: 46px`, igual pero `background: #FBF7F3` | `.84rem` |
| `modal` | Chat (nuevo parche) | `height: 46px; box-sizing: border-box; border: 1px solid #EAE1D8; border-radius: 14px; padding: 0 14px` (select `0 12px`, `.9rem`); `font-size: .95rem; background: #FBF7F3; outline: 0` | `.88rem` |
| `píldora` | Compositor, muro, chat, búsqueda de chats | `height: 44px` (búsqueda 42) `border: 1px solid #EAE1D8; border-radius: 999px; padding: 0 16px` | etiqueta oculta |
| `área` | Ventana de repost | `textarea rows="3"`, ver N16 | etiqueta oculta |

Filas de campos: tipo + número de documento (`flex: 1 1 120px` / `flex: 2 1 180px`, `gap: 10px`); vence + código (`flex: 1 1 110px` cada uno).

**Textos exactos.** Registro: "Nombre" (placeholder "Cómo te llamas", `autocomplete="name"`), "Celular o correo" ("300 123 4567 o tu@correo.com", `autocomplete="email"`), "Barrio o localidad" ("Ej. Chapinero"). Checkout: ver N38 y N42. Chat: "Nombre del parche" ("Ej.: Previa del viernes", `maxlength="40"`), "Evento del plan (opcional)".

**Estados.** Default; foco: invisible en `registro`, `modal` y las píldoras de Main y Chat (`outline: 0`, H51); visible en `datos`, `pago` y el muro de Evento (regla de foco de Evento). Lleno (precargado en el paso 2). **Error, obligatorio, deshabilitado: No diseñados** (H23).

**Correcciones obligatorias.**
- **H51:** foco visible (borde 2 px `#C23A24` con `:focus-within` o regla global).
- **H52:** bordes de campo con ≥ 3:1 (hoy 1,29–1,55:1) y placeholders en `#6E6259`.
- **H23:** errores por campo con `aria-invalid` y `aria-describedby`; reglas: CC solo números de 6 a 10 dígitos; pasaporte alfanumérico; correo con formato válido; celular de 10 dígitos que empiece por 3. Marcar "obligatorio" en la etiqueta. Al intentar continuar, resumen de errores arriba. "MM/AA" como ayuda visible. Exigir el celular de Nequi y Daviplata. Agregar PPT a los tipos de documento (y TI donde aplique, H10).
- **H28:** junto al documento, aviso corto de para qué se pide (boleta nominativa y control de acceso), con quién se comparte ([ORGANIZADOR], [BOLETERA], [PASARELA]), por cuánto tiempo y enlace a la política.
- **H45:** el registro conserva lo escrito entre pasos, pide "Ciudad" como lista y deja el barrio opcional. **H10:** fecha de nacimiento en el registro.
- "Celular o correo" usa `autocomplete="email"`: con celular no aplica; separar o usar `autocomplete="username"`.

**Pantallas.** Registro, Evento, Chat, Main, Agenda.

---

#### N42 · Selector de medio de pago

**Anatomía.** `role="group" aria-labelledby="fe-co-pay"` → `h3` "¿Cómo quieres pagar?" → rejilla de 5 tarjetas → panel del medio elegido.

**Medios (exactos).** "Nequi" — "Apruebas en tu app" (ícono celular); "PSE" — "Débito a tu cuenta bancaria" (banco); "Tarjeta crédito/débito" — "Crédito a cuotas o débito" (tarjeta); "Daviplata" — "Apruebas en tu app" (celular); "Botón Bancolombia" — "Desde tu cuenta Bancolombia" (banco). Sin medio elegido al llegar.

**Tarjeta.** `min-height: 92px; box-sizing: border-box; text-align: left; border-radius: 16px; border: 1.5px solid {#17120F | #EAE1D8}; box-shadow: {inset 0 0 0 1px #17120F | none}; background: #FFFFFF; padding: 12px; display: flex; flex-direction: column; align-items: flex-start; gap: 6px`; fila superior con ícono de 22 px y radio de 18 px (borde 2 px, punto 8 px); nombre `b .88rem; line-height: 1.2`; detalle `.74rem; #6E6259; line-height: 1.25`. Rejilla `repeat(auto-fill, minmax(140px, 1fr))` `gap: 8px` (3 columnas a 520 px, 2 a 366 px).

**Paneles por medio.**
- **Tarjeta:** recuadro `border: 1.5px dashed #6E6259; border-radius: 18px; padding: 14px; background: #FFFFFF; gap: 12px`; nota con candado (`.8rem` 700): "Campos seguros de [PASARELA] — tus datos de tarjeta no pasan por Fulleventos"; campos "Número de tarjeta" ("0000 0000 0000 0000", `inputmode="numeric" autocomplete="cc-number"`), "Vence" ("MM/AA", `cc-exp`), "Código de seguridad" ("CVV", `cc-csc`), "Nombre como aparece en la tarjeta" ("CAMILA VARGAS", `cc-name`), "Cuotas (solo crédito)" ("1 cuota", "3 cuotas", "6 cuotas", "12 cuotas", "24 cuotas", "36 cuotas"). Los campos no guardan nada (correcto). **H19:** en el diseño, reemplazar los 4 campos por un recuadro "Aquí van los campos de [PASARELA]"; en producción, widget o campos en iframe de la pasarela.
- **PSE:** caja blanca (`border: 1px solid #EAE1D8; border-radius: 18px; padding: 14px; gap: 12px`); "Banco" (lista: "Elige tu banco", "Bancolombia", "Banco de Bogotá", "Davivienda", "BBVA", "Banco de Occidente", "Banco Popular", "Banco Caja Social", "Banco AV Villas", "Otro banco"); "Tipo de persona" (N19: "Natural" / "Jurídica"); nota `.78rem`: "Tu banco te pide autorizar el débito en su ventana segura y vuelves aquí al terminar. La lista de bancos la entrega PSE."
- **Nequi / Daviplata:** caja blanca; campo "Celular registrado en Nequi" | "Celular registrado en Daviplata" (precargado "300 123 4567", `type="tel"`); nota con campana (`.84rem`): "Te llegará una notificación a tu app Nequi para aprobar el pago." | "Te llegará una notificación en Daviplata para aprobar el pago."
- **Botón Bancolombia:** caja blanca `.84rem`: "Se abre la ventana segura de Bancolombia para que apruebes el pago desde tu cuenta, y vuelves aquí al terminar."

**Estados.** Elegido / no (`aria-pressed`). Esperando aprobación, rechazado, redirigiendo: No diseñados (H17).

**Accesibilidad.** **H59:** radios. **H56:** exigir accesibilidad a los proveedores (iframes con título).

**Pantallas.** Evento (checkout paso 3).

```html
<fieldset class="pay-methods"><legend>¿Cómo quieres pagar?</legend>
  <label class="pay-option"><input type="radio" name="medio" value="nequi"><svg aria-hidden="true">…</svg><b>Nequi</b><span>Apruebas en tu app</span></label>
  <label class="pay-option"><input type="radio" name="medio" value="pse"><svg aria-hidden="true">…</svg><b>PSE</b><span>Débito a tu cuenta bancaria</span></label>
  <!-- Tarjeta crédito/débito, Daviplata, Botón Bancolombia -->
</fieldset>
<div class="pay-panel"><!-- panel del medio elegido; ej. PSE -->
  <label>Banco <select><option value="">Elige tu banco</option><option value="bancolombia">Bancolombia</option>…</select></label>
  <fieldset><legend>Tipo de persona</legend>
    <label><input type="radio" name="persona" value="natural" checked> Natural</label>
    <label><input type="radio" name="persona" value="juridica"> Jurídica</label></fieldset>
  <p>Tu banco te pide autorizar el débito en su ventana segura y vuelves aquí al terminar. La lista de bancos la entrega PSE.</p>
</div>
```

---

#### N43 · Casilla de términos

**Anatomía.** `<button role="checkbox" aria-checked>` con cuadro de 22 px y texto.

**Texto exacto.** "**Acepto términos y política de datos.** Leí los [Términos y condiciones] de la compra y la [Política de tratamiento de datos] de Fulleventos y [BOLETERA]."

**Estilos exactos.** Botón `display: flex; align-items: flex-start; gap: 10px; text-align: left; background: transparent; border: 0; padding: 4px 0; color: #17120F; font-size: .86rem; line-height: 1.4`. Cuadro `width: 22px; height: 22px; box-sizing: border-box; border-radius: 6px; border: 2px solid {#C23A24 marcada | #17120F}; background: {#C23A24 | #FFFFFF}; color: #FFFFFF` + palomita 13 px (trazo 3.2) cuando está marcada.

**Estados.** Arranca desmarcada y es obligatoria para pagar (correcto, conservar).

**Correcciones obligatorias (H28).** Dos casillas separadas: términos de la compra y autorización de datos (y una tercera opcional si habrá publicidad). Casilla nativa con etiqueta corta y **los enlaces por fuera** (no se permiten enlaces dentro de un botón); los enlaces abren en un panel sin perder lo llenado. Un solo nombre para cada documento legal (H5: "Política de tratamiento" y "Aviso de privacidad" son documentos distintos).

**Pantallas.** Evento. Es el patrón a repetir en el registro (H12).

```html
<div class="consent">
  <label><input type="checkbox" required> Acepto los términos de la compra</label> <a href="/terminos">Leer términos</a>
  <label><input type="checkbox" required> Autorizo el tratamiento de mis datos</label> <a href="/politica-de-tratamiento">Leer política</a>
</div>
```

---

#### N44 · Resumen del pedido

**Anatomía.** `role="group" aria-label="Resumen de la compra"` en el pie del checkout: línea de boletas · cargo · total · (si divide) "Tú pagas 1 de N".

**Textos exactos y ejemplo** (2 × General): "2 × General ($45.000)" — "$90.000"; "Cargo por servicio (8%)" — "$7.200"; "Total" — "$97.200"; (con pago dividido entre 2) "Tú pagas 1 de 2" — "**$48.600**". Plantilla: "{q} × {nombre de la localidad} ({precio})". Cargo = `round(subtotal × 0,08)`; total = subtotal + cargo.

**Estilos exactos.** Grupo `display: flex; flex-direction: column; gap: 4px; font-size: .86rem`. Filas `display: flex; justify-content: space-between; gap: 10px` (rótulos `#6E6259`). Total `font-size: 1rem; font-weight: 700; padding-top: 4px`. Fila dividida `background: #F6DC6A; border-radius: 10px; padding: 6px 10px; margin-top: 4px`.

**Correcciones.** **H21:** "Cargo por servicio (IVA incluido)" o desglose. **H31:** el 8 % es de demostración; el modelo del cargo está pendiente (P4). **H3:** montos calculados en el servidor. **H6:** en ventanas bajas, reducir a "Total $97.200 · Ver detalle".

**Pantallas.** Evento.

```html
<div role="group" aria-label="Resumen de la compra" class="order-summary">
  <p><span>2 × General ($45.000)</span><span>$90.000</span></p>
  <p><span>Cargo por servicio (8%)</span><span>$7.200</span></p>
  <p class="total"><span>Total</span><span>$97.200</span></p>
  <p class="split"><span>Tú pagas 1 de 2</span><b>$48.600</b></p><!-- solo con pago dividido -->
</div>
```

---

#### N45 · Boleta digital con QR

**Anatomía.** `<article aria-label="Tu boleta digital">` → franja oscura (etiqueta, "Boleta oficial", título, fecha y lugar) → perforación con muescas → datos (Localidad, Cantidad, Titular, Orden) + QR → pie.

**Textos exactos.** Etiqueta "Rumba · Vie 9 oct"; "Boleta oficial" (`.72rem`, 700, `.1em`, mayúsculas, `rgba(255,255,255,.8)`); título "Noche de salsa y boleros en vivo" (Archivo 900 `1.35rem`, `line-height: 1.02`, mayúsculas, `-0.03em`); "Viernes 9 de octubre 2026 · Puertas 8:00 p. m. · Galería Café Libro, Zona T, Bogotá" (`.84rem`, `rgba(255,255,255,.88)`). Datos: "Localidad" → nombre completo (ej. "General"); "Cantidad" → "2 boletas" | "1 boleta" | "Tu boleta · 1 de 2" (dividido) | "1 mesa · 4 personas" (VIP); "Titular" → nombre del paso 2 (ej. "Camila Vargas"); "Orden" → "#FE-2026-10-00421" (fijo). QR `role="img" aria-label="[QR de la boleta] · dibujo decorativo, no es un código real"` + "[QR de la boleta]" (`.7rem`). Pie: "Emitida por [BOLETERA] · Un ingreso por persona · Presenta tu documento".

**Estilos exactos.** Caja `border-radius: 22px; overflow: hidden; background: #FFFFFF; box-shadow: 0 14px 34px rgba(23,18,15,.14)`. Franja `padding: 18px 18px 22px; color: #FFFFFF; background: radial-gradient(circle at 85% 20%, rgba(232,160,79,.6) 0, transparent 40%), radial-gradient(ellipse at 0% 100%, rgba(70,30,80,.7) 0, transparent 55%), #140E10; display: flex; flex-direction: column; gap: 10px`. Perforación `aria-hidden`: `position: relative; height: 0; border-top: 2px dashed #D9CEC3; margin: 0 18px` con dos círculos de 24 px `#FBF7F3` en `left: -30px` y `right: -30px`, `top: -13px` (muescas del color del fondo del panel). Datos `padding: 18px; display: flex; flex-wrap: wrap; gap: 16px; align-items: center`: rejilla `flex: 1 1 180px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px 14px; line-height: 1.25` (Titular y Orden ocupan 2 columnas); rótulo `.68rem` 700 `.1em` mayúsculas `#6E6259`; valor `b .92rem`. QR `width: 124px; height: 124px; padding: 7px; box-sizing: border-box; border: 1px solid #EAE1D8; border-radius: 10px; display: grid; grid-template-columns: repeat(17, minmax(0, 1fr)); grid-template-rows: repeat(17, minmax(0, 1fr))` con 289 celdas `#17120F` o transparentes (patrón fijo en `Evento.dc.html:926-932`). Pie `padding: 10px 18px; background: #FBF7F3; border-top: 1px solid #EAE1D8; font-size: .74rem; color: #6E6259`.

**Correcciones obligatorias.**
- **H11:** **una boleta con QR por asistente** ("Boleta 1 de 2" con el nombre de cada titular); en producción, QR firmado de un solo uso.
- **H24:** mientras una mesa VIP dividida no esté pagada, mostrar "Mesa apartada · falta 1 pago · vence [PLAZO]" en lugar de "Boleta oficial" y QR; etiqueta coherente ("pagaste 1 de 2 partes (4 puestos)").
- **H26:** número de orden distinto por compra (lo genera el servidor) y titular real.
- **H56:** número de orden en texto, "Agregar a Apple o Google Wallet" y aviso para subir el brillo.
- **H20:** la boleta debe vivir en "Mis boletas" (no diseñado), con QR a pantalla completa, estado de pagos, "Transferir" (H32) y "Solicitar devolución" (H27).

**Pantallas.** Evento (paso 4).

```html
<article aria-label="Tu boleta digital" class="ticket">
  <div class="ticket-head"><span class="tag tag-sm">Rumba · Vie 9 oct</span><span class="eyebrow-light">Boleta oficial</span>
    <b>Noche de salsa y boleros en vivo</b><span>Viernes 9 de octubre 2026 · Puertas 8:00 p. m. · Galería Café Libro, Zona T, Bogotá</span></div>
  <div class="perforation" aria-hidden="true"></div>
  <dl class="ticket-data">
    <div><dt>Localidad</dt><dd>General</dd></div><div><dt>Cantidad</dt><dd>2 boletas</dd></div>
    <div class="wide"><dt>Titular</dt><dd>Camila Vargas</dd></div><div class="wide"><dt>Orden</dt><dd>#FE-2026-10-00421</dd></div>
  </dl>
  <img class="qr" src="…" alt="Código QR de la boleta, orden #FE-2026-10-00421">
  <p class="ticket-foot">Emitida por [BOLETERA] · Un ingreso por persona · Presenta tu documento</p>
</article>
```

---

#### N46 · Confirmación de compra (paso 4)

**Anatomía.** Bloque `role="status"` (círculo con palomita, titular, mensaje) → boleta (N45) → pagos del parche (si divide) → acciones → correo → "Volver al evento".

**Textos exactos.**
- Titular: "¡Listo, Camila! Nos vemos en la pista" (Archivo 900 `1.55rem`, `-0.03em`, `line-height: 1.05`, mayúsculas, `margin: 6px 0 0`).
- Mensaje (`#6E6259`): "Pagaste {total} con {medio}. Tus boletas ya están en Mis boletas." (ej. "Pagaste $97.200 con Nequi. …") o, dividido, "Pagaste tu parte ({parte}) con {medio}. Tu amigo recibió|Tus amigos recibieron su link de pago en el chat de Salseros de jueves."
- Pagos del parche: caja blanca (`border-radius: 18px; padding: 14px 16px; gap: 10px`) con "**Pagos de tu parche**" (`.92rem`) y, por amigo, avatar de 34 px, nombre (`.9rem` 700) y "Link enviado · pendiente" (N6).
- Acciones: "Avisar a mi parche" (`<a>` a Chat, `height: 52px; border-radius: 999px; background: #C23A24; color: #FFFFFF; gap: 8px; font-weight: 700; font-size: .98rem` + ícono de chat); "Agregar al calendario" ↔ "Agregado al calendario" (`flex: 1 1 180px; height: 48px; border-radius: 999px; border: 1px solid #17120F; font-weight: 700; font-size: .9rem`; apagado blanco, encendido `#17120F` con texto blanco; `aria-pressed`); "Ver mis boletas" (`<a>` a Perfil, `flex: 1 1 160px; height: 48px`, borde `#17120F`, ícono de boleta).
- Correo (`.82rem`, ícono de sobre): "La boleta también te llega al correo {correo}." (ej. "camila.vargas@correo.co").
- "Volver al evento" (`align-self: center; height: 44px; border: 0; background: transparent; padding: 0 16px; font-weight: 700; text-decoration: underline; text-underline-offset: 3px`): cierra el panel.

**Estilos.** Círculo `width: 52px; height: 52px; box-sizing: border-box; border-radius: 50%; background: #B9E07A; border: 2px solid #17120F` + palomita 26 px (trazo 2.6). Bloque de estado `display: flex; flex-direction: column; align-items: flex-start; gap: 6px`.

**Correcciones.** **H26:** el saludo usa "Camila" aunque el titular sea otro: usar el nombre del titular. **H20:** "Ver mis boletas" lleva al perfil sin boletas. **H30:** "Avisar a mi parche" debe ser voluntario y sin cantidad ni localidad (hoy el chat publica la compra solo). **H2/H17:** esta pantalla solo debe salir con el pago **aprobado** por la pasarela; antes, estados de espera. **H54:** el correo prometido no existe (no diseñado). **H6:** a 390 × 844 el titular queda fuera de la vista al llegar: llevar el foco y el scroll al inicio del paso.

**Pantallas.** Evento.

---

#### N47 · Lista de conversaciones

**Anatomía.** `<section aria-label="Tus conversaciones">` → cabecera ("Mensajes", resumen de no leídos, "Nuevo chat" y "Nuevo parche", buscador, filtros N19) → lista con scroll de filas → estado vacío.

**Textos exactos.** Título "Mensajes" (`h1`, Archivo 900 `1.75rem`, `-0.03em`, `line-height: 1`); resumen (`.8rem`, `#6E6259`): "{n} chats sin leer" | "1 chat sin leer" | "Al día"; botones "Nuevo chat" (contorno) y "Nuevo parche" (oscuro); buscador con etiqueta oculta "Buscar en tus chats" y placeholder "Busca chats, parches o eventos"; filtros "Todos", "Parches", "Personas", "No leídos".

**Fila (`<button>`, una por conversación).** Avatar de 48 px (persona: círculo, DM Sans 700 `.86rem`; parche: cuadrado `border-radius: 14px`, Archivo 900; organizador: cuadrado `#17120F` con letras `#F6DC6A`) · nombre (`b .92rem`, una línea con puntos suspensivos) + insignia de verificado (N58, 15 px) si es organizador + ícono "Silenciado" (14 px, `#6E6259`, `role="img" aria-label="Silenciado"`) si está silenciado · hora a la derecha (`.72rem`; `#C23A24` 700 con no leídos, `#6E6259` 400 sin) · vista previa (`.84rem`, una línea; `#17120F` 700 con no leídos, `#6E6259` 400 sin) + contador (N6) con texto oculto ", {n} mensajes sin leer" / ", 1 mensaje sin leer" · píldora del evento del parche (`background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 999px; padding: 2px 9px 2px 7px; font-size: .72rem; font-weight: 700; margin-top: 5px` + calendario 12 px en `#C23A24`; ej. "Vie 9 oct · Salsa") · píldora de organizador "Organizador · Responde en ~1 h".

**Plantillas de la vista previa.** "Tú: {texto}" (mensaje propio); "{Nombre corto}: {texto}" (otro, en parches); "{texto}" (otro, en chats de persona); el texto del sistema tal cual; "{prefijo}compartió «{título}»"; "{prefijo}Encuesta: {pregunta}"; "{prefijo}envió una foto"; "Chat nuevo · escribe el primer mensaje" (sin mensajes). Hora: la del último mensaje o "Ahora" si acabas de escribir.

**Datos (orden inicial).** Salseros de jueves (SL `#F6DC6A`, 3 sin leer, "9:41 a. m.", "Sofía: Voto por donde Laura: queda cerca y caminamos juntos.", "Vie 9 oct · Salsa"); Laura Martínez (1, "9:12 a. m.", "Y compra hoy la boleta, no la dejes para el viernes."); Galería Café Libro (verificado, 1, "8:30 a. m.", "¡Hola, Camila! Abrimos a las 8:00 p. m. y la clase de baile gratis arranca a las 8:30 p. m."); Clásico capitalino (CC `#B9E07A`, "Ayer", "Tú: Yo le escribo.", "Dom 11 oct · Fútbol"); Andrés Ramírez ("Ayer", "Cuando quieras. Nos vemos en el parque Lleras y arrancamos para Provenza."); Rockeros del Arena (RK `#A3A8F0`, silenciado, "Dom", "Laura: Yo llevo tapones para los oídos para el que quiera.", "Sáb 10 oct · Rock"); Sofía Cárdenas ("Sáb", "Perfecto, te guardo puesto al lado.").

**Estados de la fila.** Abierta: `aria-current="true"`, fondo `#FBF7F3`, borde `#EAE1D8`; las demás: fondo y borde transparentes. Con no leídos / leída (abrirla la marca leída). Sin hover. Al enviar algo, la conversación sube al primer lugar.

**Filtros y búsqueda.** "Parches" muestra solo grupos; "Personas" muestra personas y organizador; "No leídos" las que tienen pendientes. La búsqueda ignora mayúsculas y tildes y busca en el nombre y en el título del evento del parche. **H41:** no encuentra conversaciones donde solo se *compartió* un evento (ej. "provenza" no halla el chat con Andrés): incluir eventos compartidos.

**Estilos exactos.** Sección `width: 330px; flex-shrink: 0; min-height: 0; display: flex; flex-direction: column; background: #FFFFFF; border-right: 1px solid #EAE1D8`. Cabecera `padding: 18px 16px 12px; display: flex; flex-direction: column; gap: 12px; border-bottom: 1px solid #EAE1D8`. Botones `flex: 1 1 0; min-width: 0; height: 40px; border-radius: 999px; border: 1px solid #17120F; font-weight: 700; font-size: .84rem; display: flex; align-items: center; justify-content: center; gap: 6px; white-space: nowrap; padding: 0 10px` (íconos de 16 px). Buscador `<label>` `position: relative; display: flex; align-items: center; gap: 8px; height: 42px; box-sizing: border-box; border: 1px solid #EAE1D8; border-radius: 999px; padding: 0 14px; background: #FBF7F3` (lupa 16 px; campo `.9rem`, `outline: 0`, `autocomplete="off"`). Lista `position: relative; flex: 1 1 auto; min-height: 0; overflow-y: auto; padding: 8px; display: flex; flex-direction: column; gap: 2px`. Fila `position: relative; width: 100%; flex-shrink: 0; display: flex; align-items: flex-start; gap: 12px; padding: 10px; border-radius: 16px; border: 1px solid; text-align: left; font-size: .9rem`; texto `flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; line-height: 1.3`.

**Responsive (medido).** 330 px desde 1180; 300 px entre 900 y 1179; por debajo de 900, una sola vista a la vez (lista **o** conversación) y la lista a todo el ancho. **H8: a menos de 708 px la lista mide 690,8 px y desborda la página** (falta `min-width: 0` en `[data-ch~="list"]` dentro de la media de 899 px): obligatorio corregir.

**Accesibilidad.** Filas como botones con `aria-current`; el contador es `aria-hidden` y el texto oculto lo dice. Recomendado: lista (`role="list"`) con el nombre del chat como encabezado.

**Pantallas.** Chat. Capturas `Chat-1280.jpg`, `chat-celular-lista.jpg`.

```html
<section aria-label="Tus conversaciones" class="chat-list">
  <header><h1>Mensajes</h1><span>3 chats sin leer</span>
    <button type="button" class="btn btn-outline">…Nuevo chat</button><button type="button" class="btn btn-dark">…Nuevo parche</button>
    <label><span class="sr-only">Buscar en tus chats</span><input type="search" placeholder="Busca chats, parches o eventos" autocomplete="off"></label>
    <div role="group" aria-label="Filtrar chats" class="segmented"><!-- Todos · Parches · Personas · No leídos --></div></header>
  <ul>
    <li><button type="button" class="chat-row" aria-current="true">
      <span class="avatar avatar-rounded" aria-hidden="true">SL</span>
      <span><b>Salseros de jueves</b><span class="time">9:41 a. m.</span>
        <span class="preview">Sofía: Voto por donde Laura: queda cerca y caminamos juntos.</span>
        <span class="badge" aria-hidden="true">3</span><span class="sr-only">, 3 mensajes sin leer</span>
        <span class="pill">…Vie 9 oct · Salsa</span></span></button></li>
  </ul>
</section>
```

---

#### N48 · Barra superior de la conversación

**Anatomía.** Volver (solo celular) · avatar 44 px · nombre (`h2`) + verificado · estado · acciones: "Ver evento" (si hay plan), Info (dos botones, uno por rango de ancho), "Silenciar chat".

**Textos.** Estado (`.8rem`, `#6E6259`, una línea): parche "{n} miembros" + (" · {m} cupos libres" si hay cupos) + (" · {k} con boleta" si hay evento) (ej. "12 miembros · 7 con boleta"; "4 miembros · 2 cupos libres · 2 con boleta"); persona "En línea" (con punto verde de 9 px `#B9E07A` y anillo `0 0 0 1.5px #17120F`), "Activo hace 2 h", "Activa hace 20 min" o, en un chat nuevo creado desde "Nuevo chat" (sin estado), la ciudad de la persona (ej. "Bogotá", "Medellín"); organizador "Organizador verificado · Responde en ~1 h". Nombres accesibles: "Volver a tus chats", "Ver evento", "Info del grupo" | "Info del chat" (con `aria-pressed`), "Silenciar chat" (con `aria-pressed`).

**Estilos exactos.** `flex-shrink: 0; display: flex; align-items: center; gap: 10px; min-height: 66px; box-sizing: border-box; padding: 10px 12px 10px 16px; background: #FFFFFF; border-bottom: 1px solid #EAE1D8`. Volver `width: 40px; height: 40px; margin-left: -6px; border: 0; border-radius: 50%; background: transparent` + chevrón 20 px (oculto desde 900 px). `h2` `font-size: 1.05rem`, una línea. Acciones `display: flex; align-items: center; gap: 2px`: botones `width: 44px; height: 44px; border-radius: 12px; border: 0`; Info y Silenciar encendidos con fondo `#17120F` y ícono `#FFFFFF`. Ícono de Silenciar: campana (apagado) o campana tachada (encendido).

**Estados.** Info abierto/cerrado; silenciado/no. En celular la barra queda pegada arriba (`position: sticky; top: 0; z-index: 4; border-radius: 20px 20px 0 0`). **H43:** en celular el nombre se corta ("Salseros…"); abrir la conversación a pantalla completa sin el encabezado de la app.

**Accesibilidad.** **H9:** agregar "Reportar" y "Bloquear" (menú) en esta barra o en el panel.

**Pantallas.** Chat.

---

#### N49 · Burbujas de chat (propias, ajenas, sistema) y separadores

**Historial.** Dentro de la columna de la conversación (`<section aria-label="Conversación con {nombre}">`, ej. "Conversación con Salseros de jueves", fondo `#FBF7F3`), `role="log" aria-label="Mensajes de {nombre}"`, `position: relative; flex: 1 1 auto; min-height: 0; overflow-y: auto; display: flex; flex-direction: column-reverse; padding: 6px 18px 16px` (el `column-reverse` ancla la vista en el último mensaje en escritorio). Dentro, una columna con los elementos en orden.

**Fila de mensaje** (texto, evento, encuesta o foto). `display: flex; justify-content: {flex-end propio | flex-start ajeno}; align-items: flex-start; gap: 8px; margin-top: {12px si cambia el autor | 3px si sigue el mismo}`. En parches, los ajenos llevan avatar de 32 px (`.66rem`, enlace a Perfil con `aria-label="Perfil de {nombre}"`; `visibility: hidden` si el anterior es del mismo autor) y el nombre arriba (`.76rem` 700 `#6E6259`, `padding: 0 4px`, solo en el primero del grupo). Columna `max-width: min(78%, 440px); min-width: 0; display: flex; flex-direction: column; align-items: {flex-end | flex-start}; gap: 4px`.

**Burbuja de texto.**
- Propia: `background: #17120F; color: #FFFFFF; border: 1px solid #17120F; border-radius: 18px 18px 4px 18px`.
- Ajena: `background: #FFFFFF; color: #17120F; border: 1px solid #EAE1D8; border-radius: 4px 18px 18px 18px` (primera del grupo) o `18px` (las siguientes).
- Común: `padding: 9px 14px; font-size: .94rem; line-height: 1.42; overflow-wrap: anywhere`.
- Hora: debajo del último mensaje seguido del mismo autor, `display: inline-flex; align-items: center; gap: 4px; font-size: .7rem; color: #6E6259; padding: 0 4px`; en los propios, doble palomita de 14 px (`m2 13 4 4 8-9M10 15l2 2 9-10`), **sin** estado de leído.

**Mensaje del sistema.** Centrado (`display: flex; justify-content: center; margin: 12px 0 2px`), píldora `display: inline-flex; align-items: center; gap: 8px; max-width: 100%; box-sizing: border-box; background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 999px; padding: 5px 14px 5px 5px; font-size: .8rem; line-height: 1.3`, ícono en círculo de 24 px (boleta sobre `#B9E07A`; signo de pesos sobre `#8FD3D0`; personas con + sobre `#F6DC6A`) y "**{texto}** · {hora}" (hora `#6E6259`). Textos: "Andrés compró 2 boletas · General", "Sofía compró 2 boletas · Oriental", "Daniel compró 1 boleta · General", "Juan Pablo y Daniel se unieron al parche", "Camila activó el pago dividido: cada uno paga su parte", "Camila creó el parche «{nombre}»", "Camila añadió a {nombres}" (ej. "Camila añadió a Laura y Vale").

**Separador de fecha.** `display: flex; align-items: center; gap: 12px; margin: 16px 0 4px; font-size: .7rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: #6E6259` con líneas `flex: 1; height: 1px; background: #EAE1D8`. Textos: "Ayer", "Hoy", "Dom 4 oct", "Sáb 3 oct".

**Separador de nuevos.** `margin: 14px 0 0; font-size: .72rem; font-weight: 700; color: #C23A24` con líneas de 1,5 px `#C23A24` al 50 % de opacidad. Texto "{n} mensajes nuevos" | "1 mensaje nuevo"; va antes de los últimos no leídos y desaparece cuando escribes.

**Estados.** Enviando, enviado, leído, error, editado, eliminado: **No diseñados** (H13 pide estados de enviado y leído). Enlaces dentro del texto: no se detectan (H29 pide advertir).

**Correcciones.** **H30:** los mensajes del sistema publican quién compró, cuántas boletas y en qué localidad: avisar de una compra debe ser voluntario y sin cantidad ni localidad. **H29:** tarjeta del sistema "Solicitud de pago · Fulleventos" (monto, evento, localidad, quién pide, fecha límite, "Pagar mi parte") que solo genera el sistema; aviso fijo "Fulleventos nunca te pide pagar por enlaces externos ni transferirle a una persona" (no diseñado). **H43:** en celular, historial con scroll propio (alto `100dvh` menos barra y compositor) conservando `column-reverse`. **H9:** menú por mensaje con "Reportar".

**Pantallas.** Chat. (El muro del evento, N31, usa una burbuja ajena parecida con radio `4px 16px 16px 16px`.)

```html
<div role="log" aria-label="Mensajes de Salseros de jueves" class="stream">
  <div class="sep-date"><span>Hoy</span></div>
  <div class="sys"><span>…<b>Andrés compró 2 boletas · General</b> · 8:05 a. m.</span></div>
  <div class="msg theirs"><a href="/u/andres" class="avatar" aria-label="Perfil de Andrés Ramírez">AR</a>
    <div><span class="who">Andrés Ramírez</span><p class="bubble">Listo, compré la mía y la de Vale…</p><span class="time">8:06 a. m.</span></div></div>
  <div class="msg mine"><div><p class="bubble">¡Qué nivel! Yo compro la mía hoy en la noche.</p><span class="time">8:20 a. m. …</span></div></div>
</div>
```

---

#### N50 · Reacciones

**Anatomía.** Fila de chips debajo del mensaje (`display: flex; flex-wrap: wrap; gap: 6px`): ícono + número.

**Tipos.** "Me encanta" (corazón, trazo `#C23A24`), "Prendido" (llama, trazo `#C23A24`), "Me gusta" (pulgar, `currentColor`). Íconos de 15 px.

**Estilos exactos.** `height: 36px; border-radius: 999px; padding: 0 11px; border: 1px solid {#17120F tuya | #EAE1D8}; background: {#F6DC6A tuya | #FFFFFF}; color: #17120F; display: inline-flex; align-items: center; gap: 5px; font-size: .8rem; font-weight: 700`.

**Estados.** Tuya / no (`aria-pressed`), suma 1. `aria-label="{Tipo}, {n}"` (ej. "Me encanta, 4"). Agregar una reacción nueva a un mensaje sin reacciones: No diseñado.

**Pantallas.** Chat.

---

#### N51 · Plan fijado

**Anatomía.** `<section aria-label="Plan fijado del parche">` arriba del historial: foto de 64 px con placa de fecha · antetítulo con chincheta "Plan fijado · Faltan {n} días" · título (enlace) · cuándo y dónde · barra de boletas + "{k} de {n} ya tienen boleta" · acción: "Comprar mi boleta" + "Desde {precio}" **o** "Ya tienes boleta".

**Datos.** Salseros: "Faltan 3 días", "Noche de salsa y boleros en vivo", "Vie 9 oct · 8:00 p. m. · Galería Café Libro · Bogotá", "**7 de 12** ya tienen boleta", "Comprar mi boleta" / "Desde $45.000". Clásico: "Faltan 5 días", "Santa Fe vs. Millonarios", "Dom 11 oct · 4:00 p. m. · Estadio El Campín · Bogotá", "2 de 4", "Ya tienes boleta". Rockeros: "Faltan 4 días", "Rock en el Movistar Arena", "Sáb 10 oct · Movistar Arena · Bogotá" (sin hora), "5 de 8", "Comprar mi boleta" / "Desde $180.000". Un parche creado con evento usa el mismo bloque; sin evento no se muestra.

**Estilos exactos.** Envoltura `flex-shrink: 0; padding: 12px 14px 0`. Tarjeta `background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 18px; padding: 12px; display: flex; flex-wrap: wrap; align-items: center; gap: 12px 14px`. Foto `width: 64px; height: 64px; border-radius: 14px; display: grid; place-items: center` (placa de fecha en la variante "plan fijado" de `.date`: centrada, radio 9 px, `padding: 4px 7px 3px`, `min-width: 34px`, `1.05rem` / `.6rem`). Texto `flex: 1 1 220px; min-width: 0; display: flex; flex-direction: column; gap: 2px; line-height: 1.3`: antetítulo `display: flex; align-items: center; gap: 6px; font-size: .68rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: #C23A24` + chincheta 13 px; título Archivo 800 `1.05rem`, `-0.01em`, `line-height: 1.2`; cuándo `.8rem` `#6E6259`; fila de boletas `display: flex; align-items: center; gap: 8px; margin-top: 5px` con barra N13 `barra` y texto `.78rem`. "Comprar mi boleta": columna centrada (`gap: 3px`) con `<a>` `height: 44px; box-sizing: border-box; display: inline-flex; align-items: center; gap: 8px; padding: 0 18px; border-radius: 999px; background: #C23A24; color: #FFFFFF; font-weight: 700; font-size: .88rem; white-space: nowrap` (boleta 17 px) y precio `.72rem` `#6E6259`. "Ya tienes boleta": `<a>` `height: 40px; padding: 0 14px 0 6px; border-radius: 999px; background: #B9E07A; font-weight: 700; font-size: .84rem; gap: 7px` con círculo de 28 px `#17120F` y palomita blanca 14 px.

**Responsive (medido).** 157 px de alto a 1280 con el panel abierto (104 px cerrado); a 1180 "Comprar mi boleta" pasa a otra fila; a 390 se apila (233 px).

**Correcciones.** **H36:** "Comprar mi boleta" abre siempre el evento de salsa. **H37:** la hora dice 8:00 p. m. (puertas) y en Main 9:00 p. m. "Faltan {n} días" es fijo (H53).

**Pantallas.** Chat.

```html
<section aria-label="Plan fijado del parche" class="pinned-plan">
  <span class="thumb"><img src="…" alt="…"><span class="date-plate"><b>9</b><span>oct</span></span></span>
  <div><span class="eyebrow">…Plan fijado · Faltan 3 días</span>
    <a href="/bogota/eventos/…">Noche de salsa y boleros en vivo</a>
    <span>Vie 9 oct · 8:00 p. m. · Galería Café Libro · Bogotá</span>
    <div><span class="bar" role="img" aria-label="7 de 12 miembros ya tienen boleta"><span style="width:58%"></span></span>
      <span><b>7 de 12</b> ya tienen boleta</span></div></div>
  <div class="cta"><a class="btn btn-primary" href="…">…Comprar mi boleta</a><span>Desde $45.000</span></div>
</section>
```

---

#### N52 · Encuesta

**Anatomía.** Tarjeta: antetítulo "Encuesta" (ícono de barras) · pregunta · opciones con barra de porcentaje, radio, texto y votos · pie.

**Datos.** "¿Dónde hacemos la previa?" (Sofía): "Donde Laura, en Chapinero" 5, "Un bar en la Zona T" 3, "Directo al evento" 1. Encuesta creada desde el compositor: la pregunta es lo escrito o "¿A qué hora nos vemos?"; opciones "7:00 p. m.", "8:00 p. m.", "9:00 p. m." con 0 votos.

**Pie (plantillas).** Sin voto: "{n} votos · Toca una opción para votar" (sin votos: "Toca una opción para votar"); con voto: "Votaste por «{opción}» · {n} votos · Toca otra opción para cambiar". **Ojo:** con 1 voto dice "1 votos" (no maneja el singular): corregir.

**Estilos exactos.** Tarjeta `width: 300px; max-width: 100%; box-sizing: border-box; background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 18px; padding: 14px; display: flex; flex-direction: column; gap: 8px`. Antetítulo `.66rem` 700 `.1em` mayúsculas `#C23A24` + ícono 13 px. Pregunta `b 1rem; line-height: 1.3`. Opciones `role="group" aria-label="{pregunta}"`, `gap: 6px`. Opción `position: relative; overflow: hidden; min-height: 44px; border-radius: 12px; border: 1.5px solid {#17120F elegida | #EAE1D8}; background: #FFFFFF; padding: 0 12px; display: flex; align-items: center; gap: 10px; text-align: left; font-size: .88rem; font-weight: 500`; relleno `position: absolute; left: 0; top: 0; bottom: 0; width: {pct}%; background: {#F6DC6A elegida | #F3ECE5}; transition: width 300ms ease` (`data-fx`); radio 18 px (borde 2 px `#17120F`; fondo `#17120F` con palomita blanca de 10 px si está elegida, si no `#FFFFFF`); texto `flex: 1; padding: 8px 0`; votos `font-weight: 700; font-size: .84rem`. Pie `.76rem` `#6E6259`.

**Estados.** Votar, cambiar de opción o tocar la misma para quitar el voto (`aria-pressed`). `aria-label` de cada opción: "{opción}, {n} voto|votos". Cerrada, anónima, múltiple: No diseñado. **H59:** opciones excluyentes → radios.

**Pantallas.** Chat.

```html
<div class="poll">
  <span class="eyebrow">…Encuesta</span><b id="poll-q">¿Dónde hacemos la previa?</b>
  <div role="radiogroup" aria-labelledby="poll-q">
    <button type="button" role="radio" aria-checked="false" aria-label="Donde Laura, en Chapinero, 5 votos"><span class="fill" style="width:56%"></span>…<span>Donde Laura, en Chapinero</span><b>5</b></button>
    <button type="button" role="radio" aria-checked="false" aria-label="Un bar en la Zona T, 3 votos">…</button>
    <button type="button" role="radio" aria-checked="false" aria-label="Directo al evento, 1 voto">…</button>
  </div>
  <span class="poll-foot">9 votos · Toca una opción para votar</span>
</div>
```

---

#### N53 · Tarjeta de evento compartido (chat)

**Anatomía.** Foto de 104 px con placa · categoría · título (enlace) · "{Día} {d} oct · {lugar} · {ciudad}" · "Desde {precio}" · "Repostear" + flecha "Ver evento".

**Estilos exactos.** `<article>` `width: 290px; max-width: 100%; background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 18px; overflow: hidden`. Foto `role="img" aria-label="[Foto del evento]"`, `height: 104px` (degradado 58 %, placa `top: 10px; left: 10px`, `min-width: 42px`, `1.15rem` / `.62rem`). Cuerpo `padding: 12px 14px 14px; display: flex; flex-direction: column; gap: 2px; line-height: 1.3`: categoría `.66rem`; título Archivo 800 `1.02rem`, `-0.01em`, `line-height: 1.2`; detalle `.8rem` `#6E6259`; precio `.82rem` 700 `margin-top: 3px`. Acciones `display: flex; gap: 8px; margin-top: 10px`: "Repostear"/"Reposteado" (`flex: 1; height: 40px; border-radius: 999px; border: 1px solid #17120F; font-size: .82rem; font-weight: 700`, ícono 15 px, **instantáneo**, `aria-pressed`) y flecha (`<a>` 40 px círculo `border: 1px solid #EAE1D8`, `aria-label="Ver evento: {título}"`).

**Datos.** "Noche de salsa y boleros en vivo" (Laura, en Salseros) y "Noche de reguetón en Provenza" (Andrés, en su chat; "Desde $50.000").

**Correcciones.** H41 (un solo patrón de repost), H36 (abre su evento), H21 (precio con cargo).

**Pantallas.** Chat.

```html
<article class="shared-event">
  <div class="photo"><img src="…" alt="…"><span class="date-plate"><b>9</b><span>oct</span></span></div>
  <span class="cat">Rumba</span>
  <h3><a href="/bogota/eventos/…">Noche de salsa y boleros en vivo</a></h3>
  <span>Vie 9 oct · Galería Café Libro · Bogotá</span><b>Desde $45.000</b>
  <div class="actions"><button type="button" aria-pressed="false">…Repostear</button>
    <a href="/bogota/eventos/…" aria-label="Ver evento: Noche de salsa y boleros en vivo">…</a></div>
</article>
```

---

#### N54 · Mensaje con foto

**Estilos exactos.** Tarjeta `width: 260px; max-width: 100%; background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 18px; overflow: hidden`. Imagen `role="img" aria-label="{alt}"`, `position: relative; aspect-ratio: 4 / 3`, fondo `radial-gradient(circle at 28% 30%, {bg1} 0, transparent 50%), radial-gradient(circle at 76% 72%, {bg3} 0, transparent 42%), {bg2}` con rótulo del alt (`aria-hidden`, `position: absolute; left: 8px; bottom: 8px; max-width: calc(100% - 16px); background: rgba(23,18,15,.66); border-radius: 999px; padding: 2px 9px; font-size: .68rem; color: #FFFFFF`, una línea). Pie de foto `padding: 9px 12px; font-size: .9rem; line-height: 1.4` (opcional).

**Datos.** "[Foto: la pista en la edición pasada]" — "Así quedó la pista la última vez"; "[Foto: la fila del concierto pasado]" — "Así estaba la fila la última vez: lleguen temprano."; enviada desde el compositor: "[Foto que compartiste]" con lo escrito como pie.

**Estados.** Subiendo, error, ver en grande: No diseñados. **H13:** revisión automática de imágenes en producción.

**Pantallas.** Chat.

---

#### N55 · Compositor del chat y bandeja "Compartir"

**Anatomía.** Bandeja opcional ("Compartir:" + eventos) → fila: 3 botones de ícono (Compartir evento, Crear encuesta, Enviar foto) · campo · "Enviar".

**Textos exactos.** Etiqueta oculta "Escribe un mensaje"; placeholder "Escríbele al parche" | "Escríbele a {nombre corto}" (ej. "Escríbele a Laura") | "Escríbele a Galería Café Libro"; botones `aria-label` "Compartir evento" (`aria-expanded`), "Crear encuesta", "Enviar foto"; "Enviar". Bandeja `role="group" aria-label="Elige un evento para compartir"`: "Compartir:" y los eventos "Noche de salsa y boleros", "Santa Fe vs. Millonarios", "Rock en el Movistar Arena", "Reguetón en Provenza".

**Comportamiento.** Enter (sin Mayúscula) envía; no envía vacío. "Crear encuesta" y "Enviar foto" usan el texto escrito como pregunta o pie y lo vacían. Tocar un evento de la bandeja lo comparte y cierra la bandeja. Cada conversación guarda su borrador.

**Estilos exactos.** Contenedor `flex-shrink: 0; background: #FFFFFF; border-top: 1px solid #EAE1D8; padding: 10px 12px; display: flex; flex-direction: column; gap: 8px`. Bandeja `display: flex; align-items: center; gap: 8px; overflow-x: auto; padding-bottom: 2px`; "Compartir:" `.78rem` 700 `#6E6259`; evento `height: 40px; border-radius: 999px; border: 1px solid #EAE1D8; background: #FBF7F3; padding: 0 14px 0 5px; display: inline-flex; align-items: center; gap: 8px; font-size: .8rem; font-weight: 700; white-space: nowrap` con círculo de 30 px del degradado del evento. Fila `display: flex; flex-wrap: wrap; align-items: center; gap: 8px`. Botones de ícono `width: 44px; height: 44px; border-radius: 50%; border: 0; background: transparent` (Compartir abierto: fondo `#17120F`, ícono blanco). Campo `flex: 1 1 120px`: `width: 100%; box-sizing: border-box; height: 44px; border: 1px solid #EAE1D8; border-radius: 999px; padding: 0 16px; background: #FBF7F3; font-size: .95rem; outline: 0`. "Enviar" `height: 44px; min-width: 44px; box-sizing: border-box; border: 0; border-radius: 999px; padding: 0 18px; font-weight: 700; font-size: .9rem; gap: 8px` + avión 16 px; habilitado `#C23A24`/`#FFFFFF`; vacío `#EAE1D8`/`#6E6259` y `disabled`.

**Responsive (medido).** Por debajo de 900 px queda pegado abajo (`position: sticky; bottom: 0; z-index: 4; border-radius: 0 0 20px 20px`) y "Enviar" es un círculo de 44 px solo con el ícono (texto oculto). A 360 px "Enviar" baja a otra línea; a 320, campo y "Enviar" van abajo.

**Correcciones.** **H7:** "Enviar" con `aria-disabled`. **H51:** foco visible en el campo. **H43:** agrupar los 3 íconos en un botón "+" en celular.

**Pantallas.** Chat.

---

#### N56 · Panel de información del grupo

**Anatomía.** `<aside aria-label="{Info del grupo | Info del chat}">` → cabecera (rótulo + cerrar) → identidad (avatar 72 px, nombre, detalle, "Ver perfil") → "Evento del parche" → "Miembros · {n}" → "Dividir pago del parche" → "Planes en común" / "Sus próximos eventos" → ajustes (silenciar con interruptor, "Salir del parche" y su confirmación).

**Textos exactos.**
- Cabecera: "Info del grupo" | "Info del chat" (`.7rem` 700 `.12em` mayúsculas `#6E6259`); cerrar `aria-label="Cerrar información"`.
- Identidad: detalle "Parche · {n} miembros" | "Organizador verificado · Responde en ~1 h" | "{Ciudad} · {estado o 'Amigo en Fulleventos'}" (ej. "Bogotá · En línea"); botón "Ver perfil" | "Ver perfil del organizador" (no en parches).
- "Evento del parche" (`h3` `.7rem` `.12em` mayúsculas `#C23A24`) + enlace con foto de 52 px, título (`b .92rem`) y "Vie 9 oct · Galería Café Libro · Bogotá" (`.78rem`).
- Bloques condicionales: "Evento del parche" y "Dividir pago del parche" solo aparecen si el parche tiene evento; "Miembros" solo en parches; "Planes en común" / "Sus próximos eventos" solo en chats de persona u organizador y si hay al menos un evento; "Ver perfil" y "Salir del parche" según el tipo (ver abajo).
- "Miembros · 12" (`h3 .95rem`) + "7 de 12 con boleta" (`.76rem`; solo si el parche tiene evento). Miembro: avatar 34 px, nombre (`700`, una línea; "Tú (Camila)" para ti), rol (`.74rem` `#6E6259`: "Creó el parche" | "Creaste el parche") y estado: "Tiene boleta" (círculo de 20 px `#B9E07A` con palomita) o "Sin boleta" (`#6E6259`), solo si el parche tiene evento (en un parche creado "Sin evento por ahora" no se muestra estado). Orden: tú, luego con boleta, luego sin.
- "Dividir pago del parche" ↔ "Pago dividido activo" (botón de contorno, `min-height: 44px; border-radius: 999px; border: 1px solid #17120F; font-weight: 700; font-size: .88rem; gap: 8px` + signo de pesos 17 px; encendido `#17120F` con texto blanco; `aria-pressed`) + nota `.8rem; line-height: 1.4`: "Cada uno paga su parte de la boleta desde su cuenta: nadie tiene que adelantar la plata de todos." Activarlo publica en el chat "Camila activó el pago dividido: cada uno paga su parte"; desactivarlo no avisa.
- "Planes en común" (persona: eventos de los parches que comparten; ej. "Vie 9 oct · Bogotá · Salseros de jueves") o "Sus próximos eventos" (organizador), con foto de 46 px.
- Ajustes: "Silenciar notificaciones" (fila de 48 px con ícono y el interruptor N40 variante chat); "Salir del parche" (solo parches; `min-height: 44px; color: #C23A24; font-weight: 700; font-size: .9rem` + ícono); confirmación (`background: #FBF7F3; border: 1px solid #EAE1D8; border-radius: 16px; padding: 14px; gap: 10px`, `role="group" aria-label="Confirmar salida del parche"`): "¿Seguro que quieres salir de **{nombre}**? Ya no verás los mensajes ni el plan." + "Me quedo" (contorno 40 px) y "Sí, salir" (rojo 40 px). Salir quita la conversación y vuelve a la lista.

**Estilos exactos.** Panel `position: relative; width: 296px; flex-shrink: 0; min-height: 0; overflow-y: auto; background: #FFFFFF; border-left: 1px solid #EAE1D8; display: flex; flex-direction: column`. Cabecera `display: flex; align-items: center; justify-content: space-between; padding: 10px 10px 0 18px`; cerrar 40 px `#FBF7F3`. Identidad `padding: 4px 18px 18px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 6px; border-bottom: 1px solid #EAE1D8` (avatar 72 px con radio 20 px en grupos y organizador; nombre `h2 1.15rem`; detalle `.84rem`; "Ver perfil" `margin-top: 6px; height: 38px; padding: 0 16px; border: 1px solid #17120F; font-size: .84rem; font-weight: 700`). Bloques `padding: 16px 18px; border-bottom: 1px solid #EAE1D8`. Ajustes `padding: 10px 18px 18px; gap: 4px`.

**Responsive (medido).** ≥ 1180 px: columna fija de 296 px, abierta por defecto y que se oculta con el botón Info. 900–1179 px: cajón superpuesto `position: absolute; top: 0; right: 0; bottom: 0; z-index: 6; width: min(320px, 100%); box-shadow: -16px 0 40px rgba(23,18,15,.16)`, cerrado por defecto, sin oscurecer el fondo. < 900 px: pantalla completa `position: fixed; inset: 0; z-index: 30` sin sombra.

**Correcciones obligatorias.** **H7:** en celular el panel cubre la pantalla sin `role="dialog"` ni Escape: darle `role="dialog"`, `aria-modal`, foco y Escape. **H9:** "Reportar", "Bloquear", "Salir y reportar"; que el administrador pueda sacar miembros; entrar a un parche como invitación que se acepta. **H30:** "Tiene boleta" / "Sin boleta" expone la compra de cada miembro: hacerlo voluntario. **H18:** el pago dividido solo desde una compra real, con monto, destinatarios y plazo. **H52:** pista del interruptor apagado `#EAE1D8` da 1,29:1.

**Pantallas.** Chat.

```html
<aside aria-label="Info del grupo" class="chat-info"><!-- en celular: role="dialog" aria-modal="true" y Escape (H7) -->
  <header><span class="eyebrow-muted">Info del grupo</span><button type="button" aria-label="Cerrar información">…</button></header>
  <div class="identity"><span class="avatar avatar-rounded" aria-hidden="true">SL</span><h2>Salseros de jueves</h2><span>Parche · 12 miembros</span></div>
  <section><h3>Evento del parche</h3>
    <a href="/bogota/eventos/…"><img src="…" alt="…"><b>Noche de salsa y boleros en vivo</b><span>Vie 9 oct · Galería Café Libro · Bogotá</span></a></section>
  <section><h3>Miembros · 12</h3><span>7 de 12 con boleta</span>
    <ul><li><span class="avatar" aria-hidden="true">CV</span><span>Tú (Camila)</span><span>Sin boleta</span></li>
      <li><span class="avatar" aria-hidden="true">LM</span><span>Laura Martínez<span>Creó el parche</span></span><span>Tiene boleta</span></li></ul></section>
  <section><button type="button" aria-pressed="false">…Dividir pago del parche</button>
    <p>Cada uno paga su parte de la boleta desde su cuenta: nadie tiene que adelantar la plata de todos.</p></section>
  <div class="settings"><button type="button" role="switch" aria-checked="false">…Silenciar notificaciones</button>
    <button type="button" class="danger">…Salir del parche</button></div>
</aside>
```

---

#### N57 · Modal de nuevo parche / nuevo chat

**Anatomía.** Diálogo: título + cerrar · control segmentado "Parche (grupo)" / "Con una persona" (N19) · (parche) nombre y evento · lista de amigos seleccionables · ayuda + "Cancelar" + botón principal.

**Textos exactos.** Título "Nuevo parche" | "Nuevo chat"; "Nombre del parche" (placeholder "Ej.: Previa del viernes", máx. 40 caracteres); "Evento del plan (opcional)" con opciones "Sin evento por ahora", "Noche de salsa y boleros en vivo · Vie 9 oct · Bogotá", "Santa Fe vs. Millonarios · Dom 11 oct · Bogotá", "Rock en el Movistar Arena · Sáb 10 oct · Bogotá", "Noche de reguetón en Provenza · Vie 9 oct · Medellín"; con evento elegido: "El evento queda fijado arriba del chat y todos ven quién ya tiene boleta." (`.8rem`, `margin: -6px 0 0`); leyenda "¿A quién invitas?" | "¿Con quién quieres hablar?"; amigos (nombre completo y ciudad): Laura Martínez (Bogotá), Andrés Ramírez (Medellín), Sofía Cárdenas (Bogotá), Juan Pablo Rojas (Bogotá), María F. Gómez (Bogotá), Daniel Torres (Bogotá), Valentina Quintero (Medellín). Ayuda: "Ponle nombre y elige al menos a un amigo." | "Falta el nombre del parche." | "Elige al menos a un amigo." | "Serán {n} en el parche, contándote a ti." | "Elige con quién quieres hablar." | "Abrirás tu chat con {nombre corto}."; botones "Cancelar" y "Crear parche" | "Abrir chat".

**Comportamiento.** Parche: varios amigos (casilla cuadrada); persona: uno (círculo). "Crear parche" crea la conversación con iniciales sacadas del nombre (sin "de, del, la, el, los, las, y, en"), color de la paleta (`#F3B27E`, `#EE93BC`, `#8FD3D0`, `#B9E07A`, `#F6DC6A`, `#A3A8F0`), mensajes del sistema "Camila creó el parche «{nombre}»" y "Camila añadió a {nombres}", y la abre. "Abrir chat" abre la conversación existente con esa persona o crea una vacía.

**Estilos exactos.** Capa `position: fixed; inset: 0; z-index: 40; display: flex; align-items: center; justify-content: center; padding: 16px; box-sizing: border-box`; fondo `rgba(23,18,15,.55)` (clic cierra). Diálogo `role="dialog" aria-modal="true" aria-labelledby="ch-modal-title"` con Escape; `position: relative; width: 100%; max-width: 540px; max-height: calc(100vh - 32px); overflow-y: auto; background: #FFFFFF; border-radius: 24px; padding: 22px; box-sizing: border-box; display: flex; flex-direction: column; gap: 16px; box-shadow: 0 24px 60px rgba(23,18,15,.3)`. Título Archivo 900 `1.4rem`, `-0.02em`. Amigos: `fieldset` sin borde (leyenda `.88rem` 700, `margin-bottom: 8px`), rejilla `repeat(auto-fill, minmax(200px, 1fr))` `gap: 8px`; opción `display: flex; align-items: center; gap: 10px; min-height: 52px; padding: 6px 12px 6px 6px; border-radius: 14px; border: 1.5px solid {#17120F | #EAE1D8}; background: {#FBF7F3 | #FFFFFF}; text-align: left` con avatar 38 px (`.72rem`), nombre `b .88rem`, ciudad `.76rem`, y marca de 22 px (`border-radius: 6px` parche o `50%` persona; `border: 2px solid #17120F`; fondo `#17120F` con palomita blanca de 12 px si está elegida). Pie `display: flex; flex-wrap: wrap; align-items: center; justify-content: flex-end; gap: 10px`: ayuda `flex: 1 1 180px; font-size: .8rem`; "Cancelar" `height: 46px; border: 0; background: transparent; padding: 0 14px; font-weight: 700`; principal `height: 46px; border: 0; border-radius: 999px; padding: 0 22px; font-weight: 700`, listo `#C23A24`/blanco, no listo `#EAE1D8`/`#6E6259` y `disabled`.

**Responsive (medido).** A 390 px: "Nuevo chat" 358 × 723 y "Nuevo parche" 358 × 812 con scroll interno; amigos en 1 columna; el pie se parte en dos filas.

**Correcciones.** **H7:** foco al abrir, fondo `inert`, devolver el foco; botón principal con `aria-disabled`. **H9:** los amigos se **invitan** (aceptan la invitación), no quedan adentro directo. **H48:** bloquear nombres con "oficial", "verificado" o "Fulleventos". **H51:** foco visible en el campo.

**Pantallas.** Chat.

```html
<dialog class="modal" aria-labelledby="ch-modal-title">
  <header><h2 id="ch-modal-title">Nuevo parche</h2><button type="button" aria-label="Cerrar">…</button></header>
  <div role="radiogroup" aria-label="Tipo de chat" class="segmented"><!-- Parche (grupo) · Con una persona --></div>
  <label>Nombre del parche <input type="text" maxlength="40" placeholder="Ej.: Previa del viernes" autocomplete="off"></label>
  <label>Evento del plan <span>(opcional)</span>
    <select><option value="">Sin evento por ahora</option><option value="e1">Noche de salsa y boleros en vivo · Vie 9 oct · Bogotá</option>…</select></label>
  <fieldset><legend>¿A quién invitas?</legend>
    <label class="friend"><input type="checkbox" name="amigos" value="lm"><span class="avatar" aria-hidden="true">LM</span><b>Laura Martínez</b><span>Bogotá</span></label>
    <!-- … 6 amigos más; en "Nuevo chat", radios con la leyenda "¿Con quién quieres hablar?" --></fieldset>
  <footer><span id="m-help">Ponle nombre y elige al menos a un amigo.</span>
    <button type="button">Cancelar</button>
    <button type="submit" class="btn btn-primary" aria-disabled="true" aria-describedby="m-help">Crear parche</button></footer>
</dialog>
```

---

#### N58 · Insignia de cuenta verificada

**Estilos exactos.** SVG `role="img" aria-label="Cuenta verificada"` de 15 px (lista) o 17 px (barra y panel): sello `M12 2.5l2.4 1.8 3-.1.9 2.8 2.4 1.8-.9 2.9.9 2.9-2.4 1.8-.9 2.8-3-.1L12 21.5l-2.4-1.8-3 .1-.9-2.8-2.4-1.8.9-2.9-.9-2.9 2.4-1.8.9-2.8 3 .1z` relleno `#C23A24` + palomita `m8.5 12.2 2.3 2.3 4.7-4.9` blanca (trazo 2.2). Va junto al nombre del organizador.

**Correcciones (H48).** Definir qué se verifica (RUT o NIT, cámara de comercio, PULEP del productor, cuenta bancaria a nombre de la empresa); mostrar la insignia igual en el chat, en la tarjeta del organizador del evento y en el checkout, con una explicación "Qué significa verificado" (no diseñada).

**Pantallas.** Chat (y, por H48, Evento).

---

#### N59 · Pasos del registro (panel y barra de progreso)

**Panel lateral.** `<aside>` oscuro (ver `.hero`, variante Registro) con: etiqueta "Paso {n} de 3" · titular "Tu próximo" / "plan empieza" / "aquí" · lista de pasos.

**Lista de pasos.** `<ol>` `margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 12px`. Paso `display: flex; align-items: center; gap: 12px` con círculo de 30 px (`border-radius: 50%; font-weight: 700; font-size: .85rem; color: #17120F`) y rótulo: "Tu cuenta", "Tus gustos", "Tu gente". Estados: **actual** círculo `#F6DC6A` con el número y texto `#FFFFFF`; **hecho** círculo `#FFFFFF` con "✓" (carácter) y texto `#FFFFFF`; **pendiente** círculo transparente con el número en `#17120F` (invisible: 1,03:1, H52) y texto `rgba(255,255,255,.65)`.

**Tarjeta del formulario.** `<section aria-label="Formulario de registro">` `flex: 1.3 1 420px; min-width: 0; background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 28px; padding: clamp(24px, 4vw, 48px); box-sizing: border-box; display: flex; flex-direction: column; gap: 22px`. Barra de progreso `height: 6px; border-radius: 3px; background: #EAE1D8; overflow: hidden` con relleno `#C23A24` (`border-radius: 3px`) de 33 %, 67 % o 100 %.

**Pasos (contenido).**
1. "Crea tu cuenta" / "Gratis. Solo tarda un minuto." · "Continuar con Google" (52 px, contorno `#17120F`, `.95rem`, ícono de Google de trazo 18 px; hoy **también avanza al paso 2**, igual que "Continuar", sin autenticar nada, H12) · separador "o con tus datos" (líneas de 1 px `#EAE1D8`, `.85rem`) · campos (N41) · "Continuar" (52 px, `#C23A24`, 1rem; avanza aunque los campos estén vacíos, H45) · "Al continuar aceptas los [Términos] y la [Política de privacidad]." (`.78rem`). "Atrás" y volver a entrar al paso 1 borra lo escrito (H45).
2. "¿Qué planes te gustan?" / "Elige al menos 3. Así armamos tu agenda." · chips N60 · pie (`display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; margin-top: 8px`): "Atrás" (48 px, transparente, `padding: 0 8px`), "{n} elegidos" (`.88rem`), "Continuar" (52 px, `padding: 0 28px`, `#C23A24` o `#B9AEA4` deshabilitado con menos de 3).
3. "Encuentra a tu gente" / "Sigue a amigos y a personas con tus gustos para ver a qué van." · "Buscar amigos en mis contactos" (48 px, `border-radius: 14px; border: 1px dashed #B9AEA4; background: #FBF7F3; font-weight: 700` + celular 18 px; sin acción) · filas N61 · "Atrás" + "Ir a mi feed" (`<a>` 52 px, `padding: 0 28px`, `#C23A24`, flecha 16 px, a Main).

Títulos `h2` Archivo 900 `1.9rem`, `-0.03em`, `line-height: 1.05`; bajadas `margin: 6px 0 0; color: #6E6259`. Contenedor de paso `gap: 18px` (paso 3 `gap: 14px`).

**Responsive.** Panel `flex: 1 1 340px; min-height: 420px` y formulario lado a lado cuando caben; en celular el panel va primero y ocupa unos 470 px (el primer campo queda en y = 787 a 390 × 844).

**Correcciones obligatorias.** **H45:** en celular, panel reducido a una franja de unos 80 px con "Paso 1 de 3"; conservar lo escrito al volver; validar antes de avanzar (H23); pedir "Ciudad" (lista) y dejar el barrio opcional; "1 elegido" en singular. **H28:** el texto legal va **antes** de los dos botones; pantalla propia para el permiso de contactos (o cambiar "Está en tus contactos"). **H10:** fecha de nacimiento. **H12:** "Continuar con Google" y el celular con código de verificación de verdad; casilla de consentimiento aparte. **H49:** anunciar "Paso 2 de 3: Tus gustos". **H52:** números de pasos pendientes en blanco al 65 % con borde claro. **H7:** "Continuar" con `aria-disabled`.

**Pantallas.** Registro. Capturas `Registro-390.jpg`, `Registro-768.jpg`, `Registro-1280.jpg`.

```html
<main class="signup">
  <aside class="signup-panel"><span class="tag">Paso 1 de 3</span>
    <h1 class="headline"><span>Tu próximo</span><span>plan empieza</span><span>aquí</span></h1>
    <ol><li aria-current="step"><span>1</span>Tu cuenta</li><li><span>2</span>Tus gustos</li><li><span>3</span>Tu gente</li></ol></aside>
  <section aria-label="Formulario de registro" class="signup-form">
    <div class="progress" role="progressbar" aria-valuemin="1" aria-valuemax="3" aria-valuenow="1" aria-label="Paso 1 de 3"><span style="width:33%"></span></div>
    <h2>Crea tu cuenta</h2><p>Gratis. Solo tarda un minuto.</p>
    <p class="legal">Al continuar aceptas los [Términos] y la [Política de privacidad].</p><!-- antes de los botones (H28) -->
    <button type="button" class="btn btn-outline btn-lg">…Continuar con Google</button>
    <div class="divider"><span>o con tus datos</span></div>
    <!-- campos N41: Nombre, Celular o correo, Ciudad (lista, H45), Barrio o localidad (opcional) -->
    <button type="submit" class="btn btn-primary btn-lg">Continuar</button>
  </section>
</main>
```

---

#### N60 · Chips de gustos (y gustos del perfil)

**Seleccionables (Registro).** `role="group" aria-label="Gustos"`, `display: flex; flex-wrap: wrap; gap: 10px`. Chip `height: 46px; border-radius: 999px; padding: 0 18px; font-size: .95rem; font-weight: 500; border: 1px solid {#17120F | #D9CEC3}; background: {#17120F | #FFFFFF}; color: {#FFFFFF | #17120F}; display: flex; align-items: center; gap: 8px`, `aria-pressed`. Opciones: "Salsa", "Rock", "Electrónica", "Reguetón", "Jazz", "Conciertos", "Fútbol", "Stand-up", "Teatro", "Comida", "Planes gratis", "Festivales". Mínimo 3 para continuar.

**Estáticos (Perfil).** Contenedor `padding: 0 32px 28px; display: flex; flex-wrap: wrap; gap: 8px`; etiqueta `border-radius: 999px; padding: 6px 14px; font-size: .84rem; font-weight: 500` con fondo de color: "Salsa" `#F3B27E`, "Rock" `#A3A8F0`, "Planes gratis" `#B9E07A`, "Stand-up" `#EE93BC`, "Fútbol" `#F6DC6A`.

**Estados.** Elegido / no; sin hover. **Implementar:** variante `grande` del Chip (ver `.chip`). Borde apagado `#D9CEC3` (1,55:1) en lugar de `#EAE1D8`: unificar (ver "Inconsistencias").

**Pantallas.** Registro, Perfil.

```html
<div role="group" aria-label="Gustos" class="chip-row chip-row-wrap">
  <button type="button" class="chip chip-lg" aria-pressed="true">Salsa</button>
  <button type="button" class="chip chip-lg" aria-pressed="false">Rock</button>
  <!-- … Electrónica, Reguetón, Jazz, Conciertos, Fútbol, Stand-up, Teatro, Comida, Planes gratis, Festivales -->
</div>
<p aria-live="polite">1 elegido</p><!-- singular corregido (H45) -->

<ul class="tag-list" aria-label="Gustos"><!-- Perfil: estáticos -->
  <li class="tag-static" style="--bg:#F3B27E">Salsa</li><li class="tag-static" style="--bg:#A3A8F0">Rock</li>
</ul>
```

---

#### N61 · Fila de persona con "Seguir"

**Anatomía.** Avatar · nombre + motivo · botón "Seguir" ↔ "Siguiendo".

**Variantes.**
- **Registro paso 3:** fila `display: flex; align-items: center; gap: 12px; padding: 6px 0; border-bottom: 1px solid #F1EAE3`; avatar 44 px (`.8rem`); nombre `b .95rem` + motivo `.8rem` (`line-height: 1.3`); botón `height: 40px; padding: 0 16px; font-size: .84rem`. Datos: "Laura Martínez" — "Está en tus contactos"; "Andrés Ramírez" — "Está en tus contactos"; "Sofía Cárdenas" — "Le gusta la salsa y el fútbol"; "María F. Gómez" — "Va a 4 eventos que te gustan"; "Galería Café Libro" (GC, fondo `#17120F`) — "Lugar · organiza eventos de salsa".
- **Main "Gente con tus gustos":** tarjeta blanca (`border-radius: 20px; padding: 18px; gap: 4px`, `h2` "Gente con tus gustos" con `margin: 0 0 6px`); fila `padding: 8px 0`; avatar enlazado 40 px (`.78rem`); nombre enlace 700 `.9rem` + motivo `.78rem`; botón `height: 36px; padding: 0 14px; font-size: .8rem`. Datos: "María F. Gómez" (MG `#F6DC6A`) — "Bogotá · Va a 4 eventos que te gustan"; "Daniel Torres" (DT `#8FD3D0`) — "Bogotá · Amigo de Laura y Andrés"; "Valentina Quintero" (VQ `#A3A8F0`) — "Medellín · Le encanta el techno".
- **Organizador (Evento)** y **Perfil:** ver N33 y N62.

**Botón.** `border-radius: 999px; font-weight: 700; border: 1px solid #17120F`; "Seguir" fondo `#17120F` texto `#FFFFFF`; "Siguiendo" fondo `#FFFFFF` texto `#17120F`; `aria-pressed`.

**Correcciones.** **H52:** el avatar de Galería Café Libro en Registro tiene letras `#17120F` sobre `#17120F`. **H28:** "Está en tus contactos" sin permiso. **H46:** el avatar de otra persona abre el perfil de Camila. Recomendado: nombre accesible "Seguir a {nombre}".

**Pantallas.** Registro, Main, Evento, Perfil.

---

#### N62 · Cabecera de perfil con estadísticas

**Anatomía.** `<section aria-label="Perfil">` en tarjeta: portada · avatar grande superpuesto · nombre y usuario · "Seguir" y "Mensaje" · bio · estadísticas (`<dl>`) · gustos (N60).

**Textos exactos.** Portada `role="img" aria-label="[Foto de portada]"`; "CV"; "Camila Vargas"; "@camivargas · Chapinero, Bogotá"; "Seguir" ↔ "Siguiendo"; "Mensaje" (a Chat); bio "Salsera de jueves, rockera de sábado. Si hay concierto gratis en un parque, ahí estoy. Siempre busco gente para armar parche."; estadísticas "Eventos" 38, "Ciudades" 5, "Seguidores" 412 (413 al seguir), "Siguiendo" 289, "Parches" 7.

**Estilos exactos.** Tarjeta `background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 28px; overflow: hidden`. Portada `height: 200px; background: radial-gradient(circle at 20% 40%, rgba(238,147,188,.7) 0, transparent 30%), radial-gradient(circle at 80% 60%, rgba(246,220,106,.6) 0, transparent 28%), #2A1A16`. Fila de identidad `padding: 0 32px 28px; display: flex; flex-wrap: wrap; align-items: flex-end; gap: 16px 24px`: avatar `width: 128px; height: 128px; margin-top: -64px; border-radius: 50%; border: 5px solid #FFFFFF; background: #8FD3D0; font-family: Archivo; font-weight: 900; font-size: 2.4rem; box-sizing: border-box`; texto `flex: 1 1 260px; min-width: 0; padding-top: 12px` con `h1` Archivo 900 `2rem`, `-0.03em`, `line-height: 1.05` y usuario `margin: 2px 0 0; color: #6E6259`; acciones `display: flex; gap: 10px`: "Seguir" `height: 44px; border-radius: 999px; padding: 0 22px; font-weight: 700; font-size: .92rem; border: 1px solid #17120F` (apagado oscuro, encendido blanco), "Mensaje" `height: 44px; box-sizing: border-box; border-radius: 999px; padding: 0 20px; font-weight: 700; font-size: .92rem; border: 1px solid #EAE1D8; background: #FFFFFF; display: inline-flex; align-items: center`. Fila bio + estadísticas `padding: 0 32px 28px; display: flex; flex-wrap: wrap; gap: 20px 40px; align-items: flex-start`; bio `flex: 1 1 320px; max-width: 56ch`; `<dl>` `display: flex; flex-wrap: wrap; gap: 12px 28px`; `dt` `.78rem` `#6E6259`; `dd` `margin: 0; font-family: Archivo; font-weight: 900; font-size: 1.6rem`.

**Resumen en Main.** Ver N7 (avatar 48 px y 3 cifras: "Planes", "Seguidores", "Siguiendo").

**Estados.** Seguir / Siguiendo. **H46 (obligatorio):** dos variantes: **"Mi perfil"** (Editar perfil, Mis boletas, Guardados, Ajustes y privacidad; sin "Seguir" ni "Mensaje") y **"Perfil de otra persona"** (Seguir, Mensaje, Reportar o Bloquear). Hoy Camila puede seguirse a sí misma. **H30:** el barrio debe ser visible solo para amigos; ajuste "Quién ve mis planes". **H37:** "Eventos 38" vs "Planes 38".

**Pantallas.** Perfil (resumen en Main).

```html
<section aria-label="Perfil" class="profile-head"><!-- variante "Perfil de otra persona" (H46) -->
  <img class="cover" src="…" alt="">
  <span class="avatar avatar-128" aria-hidden="true">CV</span>
  <div><h1>Camila Vargas</h1><p>@camivargas · Chapinero, Bogotá</p></div>
  <div class="actions"><button type="button" class="btn btn-dark" aria-pressed="false">Seguir</button><a class="btn btn-outline-light" href="/mensajes/…">Mensaje</a></div>
  <p class="bio">Salsera de jueves, rockera de sábado. Si hay concierto gratis en un parque, ahí estoy. Siempre busco gente para armar parche.</p>
  <dl class="stats">
    <div><dt>Eventos</dt><dd>38</dd></div><div><dt>Ciudades</dt><dd>5</dd></div><div><dt>Seguidores</dt><dd>412</dd></div>
    <div><dt>Siguiendo</dt><dd>289</dd></div><div><dt>Parches</dt><dd>7</dd></div>
  </dl>
</section>
```

---

#### N63 · Pestañas

**Anatomía.** `role="tablist"` con botones `role="tab"` y subrayado de 3 px.

**Variantes.** Perfil: `aria-label="Contenido del perfil"` con "Próximos planes" (por defecto), "Recuerdos", "Reseñas". Evento: `aria-label="Parches y muro"` con "Parches (3)" (por defecto), "Muro (24)".

**Estilos exactos.** Lista `display: flex; gap: 4px; overflow-x: auto; box-shadow: inset 0 -1px 0 #EAE1D8`. Pestaña `flex-shrink: 0; white-space: nowrap; height: 48px; border: 0; background: transparent; padding: 0 16px; font-size: .95rem; font-weight: 700; color: {#17120F | #6E6259}; border-bottom: 3px solid {#C23A24 | transparent}`; `aria-selected`.

**Estados.** Seleccionada / no; sin hover; foco R2. **H59 (obligatorio):** patrón ARIA completo: flechas izquierda/derecha, `aria-controls` y paneles `role="tabpanel"` con `aria-labelledby` (Evento tiene `role="tabpanel"` con `aria-label`; Perfil no tiene paneles marcados); o dos botones normales.

**Pantallas.** Perfil, Evento.

```html
<div role="tablist" aria-label="Contenido del perfil">
  <button role="tab" id="t-planes" aria-selected="true" aria-controls="p-planes">Próximos planes</button>
  <button role="tab" id="t-rec" aria-selected="false" aria-controls="p-rec" tabindex="-1">Recuerdos</button>
</div>
<div role="tabpanel" id="p-planes" aria-labelledby="t-planes">…</div>
```

---

#### N64 · Tarjeta de plan con estado (Perfil)

**Anatomía.** Variante de TarjetaEvento: imagen 4/3 con placa de fecha (`md`, `top: 12px; left: 12px`) y estado arriba a la derecha (N6) · categoría · título (enlace) · "{lugar} · {ciudad}".

**Datos.** e1 "Noche de salsa y boleros en vivo" (9, Rumba, "Galería Café Libro · Zona T · Bogotá", "Va"); e2 "Festival de jazz al parque" (10, Conciertos, "Parque El Country · Usaquén · Bogotá", "Va"); e3 "Rock en el Movistar Arena" (10, Conciertos, "Movistar Arena · Salitre · Bogotá", "Le interesa"); e4 "Santa Fe vs. Millonarios" (11, Deporte, "Estadio El Campín · Teusaquillo · Bogotá", "En parche"); e8 "Atlético Nacional vs. Junior" (12, Deporte, "Estadio Atanasio Girardot · Medellín", "Le interesa").

**Estilos exactos.** Rejilla `repeat(auto-fill, minmax(210px, 1fr))` `gap: 20px`. Imagen con `role="img" aria-label="[Foto del evento]"`. Cuerpo `padding: 14px 16px 16px; display: flex; flex-direction: column; gap: 2px`: categoría `.7rem`; título 700 `1.05rem; line-height: 1.25`; lugar `.85rem` `#6E6259` (ciudad sin negrita).

**Correcciones.** H61 (a 768 px queda en 3 + 2), H37 ("Va" aquí, "Vas" en Main, "Vas a ir" en Evento), H30 (planes visibles para todos), H36.

**Pantallas.** Perfil.

---

#### N65 · Tarjetas de recuerdos

**Perfil.** Rejilla `repeat(auto-fill, minmax(200px, 1fr))` `gap: 12px`. Tarjeta `<a>` (a Evento) `aria-label="{título}, {ciudad} · {mes}"`, `position: relative; aspect-ratio: 1; border-radius: 16px; overflow: hidden; display: flex; align-items: flex-end`, fondo `radial-gradient(circle at 40% 35%, {bg1} 0, transparent 55%), {bg2}`. Franja `width: 100%; padding: 10px 12px; background: rgba(20,14,16,.72); color: #FFFFFF; font-size: .8rem; line-height: 1.3` con título `b` y "{ciudad} · {mes}" en `#E2D8D0` (13,61:1 contra `#140E10` puro; como la franja es `rgba(20,14,16,.72)`, sobre la parte clara de una foto real baja a unos 5,5:1: con fotos reales, verificar contraste o subir la opacidad de la franja). Datos: "Techno hasta el amanecer" (Bogotá · Sep 2026), "Feria de las Flores" (Medellín · Ago 2026), "Rock al Parque" (Bogotá · Jul 2026), "Mercado de las Américas" (Bogotá · Jun 2026), "La casa de Bernarda Alba" (Bogotá · May 2026), "Salsa al Parque" (Bogotá · Abr 2026), "Stand-up en Teatro Libre" (Bogotá · Mar 2026), "Carnaval de Barranquilla" (Barranquilla · Feb 2026).

**Evento.** Ver N34 (6 cuadros de 3 columnas, `border-radius: 10px`, "[Foto de asistente]").

**Estados.** Hover: ninguno visible (texto blanco en línea). Vacío: No diseñado. Ver foto en grande: No diseñado.

**Pantallas.** Perfil, Evento.

```html
<ul class="memories">
  <li><a class="memory" href="/bogota/eventos/…" aria-label="Techno hasta el amanecer, Bogotá · Sep 2026">
    <img src="…" alt=""><span class="memory-strip"><b>Techno hasta el amanecer</b><span>Bogotá · Sep 2026</span></span></a></li>
</ul>
```

---

#### N66 · Tarjetas de reseña (y estrellas)

**Perfil.** Lista `display: flex; flex-direction: column; gap: 14px; max-width: 760px`. Tarjeta `background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 18px; padding: 18px 20px`: fila `display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px; align-items: baseline` con título (enlace 700 `1.05rem`) y "{n} de 5" (`.84rem` 700 `#8A5A00`, 5,93:1); texto (`margin: 6px 0 0`); pie `.8rem` `#6E6259` "{mes} · {n} personas lo encontraron útil". Datos: "Techno hasta el amanecer" — "4 de 5" — "El sonido estuvo brutal. La fila para entrar fue larga, lleguen antes de las 11." — "Sep 2026 · 17 personas lo encontraron útil"; "Rock al Parque" — "5 de 5" — "Tres días que no olvido. El parche de la app nos salvó para encontrarnos." — "Jul 2026 · 42 personas lo encontraron útil".

**Main.** Estrellas en la publicación de reseña (ver N12): 5 estrellas rellenas `#E0A21B` de 18 px con `role="img" aria-label="Calificación 5 de 5"`.

**Inconsistencia.** La calificación es texto ("4 de 5") en Perfil y estrellas en Main: unificar (recomendado: estrellas con el texto "4 de 5" accesible). `#E0A21B` sobre blanco da 2,25:1 (bajo el 3:1 de elementos gráficos): oscurecer o acompañar del número. **H37:** reseñas solo después del evento y solo de asistentes (Juan Pablo reseñó "Ayer" un evento del domingo 11).

**Pantallas.** Perfil, Main.

```html
<article class="review">
  <h3><a href="/bogota/eventos/…">Techno hasta el amanecer</a></h3>
  <p class="rating"><span aria-hidden="true">★★★★☆</span> 4 de 5</p>
  <p>El sonido estuvo brutal. La fila para entrar fue larga, lleguen antes de las 11.</p>
  <p class="meta">Sep 2026 · 17 personas lo encontraron útil</p>
</article>
```

---

#### N67 · Estados vacíos

**Base (amplía `.empty`).** Caja centrada con texto `#6E6259` y una acción que deshace el filtro.

| Dónde | Caja | Mensaje (exacto o plantilla) | Acciones |
|---|---|---|---|
| Bienvenida (agenda) | `text-align: center; padding: 40px 16px; background: #FFFFFF; border: 1px dashed #EAE1D8; border-radius: 18px`; texto `margin: 0 0 14px` | "No hay planes de esta categoría en {Ciudad} este finde." / "No hay planes en {Ciudad} este finde." / "No hay planes en esta categoría este finde." | "Ver todos los planes del país" (`height: 44px; border-radius: 999px; border: 1px solid #17120F; background: #FFFFFF; padding: 0 20px; font-size: .9rem; font-weight: 700`): quita ciudad y categoría |
| Agenda | igual | "Por ahora no hay planes con este filtro en {Colombia o la ciudad} este finde. Prueba otra ciudad o mira todo el país." | igual |
| Main (feed) | `padding: 36px 16px; border-radius: 20px; display: flex; flex-direction: column; align-items: center; gap: 14px`, borde punteado; texto `max-width: 46ch` | "Todavía nadie de tu gente ha publicado planes en {Ciudad} en esta pestaña. Mira lo que hay allá en el mapa o vuelve a todo Colombia." | "Ver todo Colombia" (contorno 44 px) y "Ver {Ciudad} en el mapa" (`<a>` 44 px `#C23A24`) |
| Mapa (lista) | `padding: 36px 6px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 10px`; círculo de 52 px `background: #FBF7F3; border: 1px solid #EAE1D8` con mapa de 22 px `#6E6259` | Título 700: "No hay {planes / planes gratis / planes de {Categoría}}{ en {Ciudad}} este finde." (ej. "No hay planes de Rumba en Leticia este finde."); ayuda `.86rem`: "Prueba otra categoría o mira todo Colombia." / "Prueba otra categoría." | "Ver todas las categorías" (oscuro 40 px, si hay categoría) y "Ver todo Colombia" (contorno 40 px, si hay ciudad) |
| Chat (lista) | `padding: 32px 12px; text-align: center; gap: 12px`; texto `.9rem` | "Estás al día: no tienes mensajes sin leer." (No leídos sin búsqueda) / "No encontramos chats con ese filtro." | "Ver todos los chats" (contorno 40 px, `.84rem`) |
| Chat (conversación) | `margin: 20px auto 0; max-width: 34ch; text-align: center; color: #6E6259; font-size: .9rem` | Parche: "Arranquen el plan: escriban, compartan un evento o armen una encuesta."; persona: "Escríbele a {nombre corto} para arrancar el plan." | — |

**Correcciones.** **H62:** "Ver todo Colombia" → "Ver toda Colombia" y un solo nombre para el alcance nacional ("Toda Colombia"). **H39:** estado vacío honesto para fechas sin planes. **No diseñados:** vacíos de "Tus parches", de las pestañas del perfil, de resultados de búsqueda, de notificaciones y de "Mis boletas"; **estados de carga y error** de listas, mapa y chat (H17: esqueletos y "Reintentar").

**Pantallas.** Bienvenida, Agenda, Main, Mapa, Chat.

```html
<div class="empty-state"><!-- variante "en página" -->
  <p>Por ahora no hay planes con este filtro en Bogotá este finde. Prueba otra ciudad o mira todo el país.</p>
  <button type="button" class="btn btn-outline">Ver todos los planes del país</button>
</div>
<div class="empty-state empty-state-panel"><!-- variante "en panel" (Mapa) -->
  <span class="empty-icon" aria-hidden="true">…</span>
  <p><b>No hay planes de Rumba en Leticia este finde.</b></p><p>Prueba otra categoría o mira todo Colombia.</p>
  <button type="button" class="btn btn-dark">Ver todas las categorías</button><button type="button" class="btn btn-outline">Ver todo Colombia</button>
</div>
```

---

#### N68 · Ventana modal (base)

**Variantes actuales.**

| Ventana | Capa | Caja | Cierre |
|---|---|---|---|
| Repostear (Agenda) | `z-index: 20`; centrada; `padding: 16px` | `max-width: 520px; border-radius: 24px; padding: 22px; gap: 16px; box-shadow: 0 24px 60px rgba(23,18,15,.3)`; blanca | Solo "Cerrar" o "Cancelar" (sin Escape ni clic afuera) |
| Nuevo parche / chat | `z-index: 40`; centrada; `padding: 16px` | `max-width: 540px; max-height: calc(100vh - 32px); overflow-y: auto`; mismo radio, relleno y sombra | X, "Cancelar", clic afuera, Escape (con foco dentro) |
| Checkout (Evento) | `z-index: 30`; panel arriba a la derecha (`top: 12px; right: 12px`) | `width: min(520px, calc(100% - 24px)); max-height: calc(100% - 24px)`; fondo `#FBF7F3`; sombra `0 24px 60px rgba(23,18,15,.35)` | X, clic afuera, Escape (con foco dentro), "Volver al evento" |
| Panel de información (Chat, < 900 px) | `position: fixed; inset: 0; z-index: 30` | pantalla completa blanca | Solo "Cerrar información" (sin `role="dialog"`) |

Fondo oscuro común: `rgba(23,18,15,.55)`. Botón cerrar: 40 px `#FBF7F3` (Agenda, Chat) o 44 px `#FFFFFF` (checkout); X de 16 px trazo 2.4.

**Canónica recomendada.** `<dialog>` con `showModal()` (o React Aria / Radix), fondo `rgba(23,18,15,.55)`, caja blanca `border-radius: 24px; padding: 22px; box-shadow: 0 24px 60px rgba(23,18,15,.3)`, cerrar 40 px `#FBF7F3`; en celular, pantalla completa. **Obligatorio (H7):** foco al abrir, foco atrapado, fondo `inert`, Escape desde cualquier punto, clic afuera, devolver el foco al botón que abrió; capas `z-index` en una escala única (encabezado < barras fijas < cajones < modales).

**Pantallas.** Agenda, Chat, Evento.

---

#### N69 · Botones (sistema completo)

Todos: `border-radius: 999px` (salvo íconos cuadrados del encabezado, `12px`), `font-weight: 700`, `font-family: inherit`, `cursor: pointer`, sin hover en el prototipo (R1).

| Variante | Estilo exacto | Alturas y ejemplos |
|---|---|---|
| **Primario** | `background: #C23A24; color: #FFFFFF; border: 0` | 36 ("Publicar", "Comprar" del mapa) · 38 ("Unirme al parche") · 40 ("Comprar" de Agenda, "Sí, salir") · 42 ("Unirme") · 44 ("Comprar" de Bienvenida, "Comprar mi boleta", "Enviar", "Ver {Ciudad} en el mapa") · 46 ("Repostear", "Crear parche") · 48 ("Comprar" de la barra móvil) · 52 ("Continuar" del registro y del checkout, "Pagar …", "Avisar a mi parche", "Ir a mi feed") · 54 ("Comprar boletas") |
| **Oscuro** | `background: #17120F; color: #FFFFFF; border: 0` (o borde `#17120F`) | 36–44 ("Seguir" apagado) · 40 ("Nuevo parche", "Ver todas las categorías") · 42 ("Ver en el mapa" de Evento) · 44 ("Crear evento", "Ver qué pasa en todo el país") · "Crear cuenta" (`padding: 11px 18px`) |
| **Contorno oscuro** | `background: #FFFFFF; color: #17120F; border: 1px solid #17120F` | 36 ("Ver todo Colombia" del mapa, "Repostear" del mapa) · 38 ("Voy" del post, "Ver todo Colombia", "Ver perfil") · 40 ("Repostear", "Nuevo chat", "Armar parche", "Me quedo", "Ver todos los chats") · 42 ("Ver en el mapa" de Bienvenida) · 44 ("Ver todos los planes del país", "Ver boleta", "Dividir pago del parche") · 46 ("Escribir al organizador") · 48 ("Voy" del evento, "Ver {n} planes más", "Agregar al calendario", "Ver mis boletas") · 52 ("Continuar con Google" del registro) |
| **Contorno claro** | `background: #FFFFFF; color: #17120F; border: 1px solid #EAE1D8` | 36 (acciones del compositor; Guardar del mapa, círculo) · 38 ("Ver en el mapa" de la franja) · 40 ("Enviar a un amigo", círculo) · 42 ("Copiar dirección") · 44 ("Mensaje", píldora "Mapa") · 48 ("Me interesa", "Invitar amigos", Compartir en círculo) |
| **Fantasma** | `background: transparent; border: 0` | 36 ("Más opciones", cerrar aviso, "Ver boleta" subrayado, "Ver en el mapa" rojo del mapa) · 40 (acciones del post) · 44 ("Volver al evento" subrayado, "Salir del parche" rojo) · 46 ("Cancelar") · 48/52 ("Atrás") |
| **Claro sobre oscuro** | `background: #FFFFFF; color: #17120F` | "Crear mi cuenta gratis" y "Abrir el mapa de eventos" (`padding: 15px 26px`), "Continuar con Google" (52), "Toda Colombia" encendido del mapa (40) |
| **Contorno sobre oscuro** | `color: #FFFFFF; border: 1px solid rgba(255,255,255,.4)` (mapa: fondo `rgba(255,255,255,.08)`, borde `rgba(255,255,255,.3)`) | "Continuar con mi celular" (52), botones apagados del mapa (40) |
| **Ícono** | cuadrado `width/height: 44px; border-radius: 12px` (encabezado y barra del chat) o círculo `40–48px` | Navegación, Info, Silenciar, cerrar (40 px `#FBF7F3`; 44 px `#FFFFFF` en checkout), zoom (40), cantidad (40 `#FBF7F3`), compositor del chat (44) |

**Alternar (patrones).** "Sumarse": primario rojo → oscuro ("Unirme" → "Estás dentro", "Unirme al parche" → "Estás en el parche"). "Marcar": contorno → oscuro ("Voy" → "Vas"/"Vas a ir", "Repostear" → "Reposteado", "Agregar al calendario" → "Agregado al calendario", "Dividir pago del parche" → "Pago dividido activo", filtros y chips). "Seguir": oscuro → contorno ("Seguir" → "Siguiendo"). "Me interesa" y Me gusta: el color del ícono y texto pasa a `#C23A24` con relleno.

**Deshabilitado (hoy, 3 estilos).** Registro: fondo `#B9AEA4` con texto blanco (2,18:1); Chat ("Enviar", "Crear parche", "Abrir chat"): fondo `#EAE1D8`, texto `#6E6259` (4,57:1); Evento y Mapa: `opacity: .45` / `.4`. **Canónico recomendado:** fondo `#EAE1D8` + texto `#6E6259` (el único legible) con `aria-disabled="true"` (H7).

**Hover y foco.** Ver R1 y R2. Si se recupera el hover del original (decisión abierta): oscuro `#33291F` y claro `#F3ECE6` como en el original; contorno claro con borde `#17120F` (como `.chip:hover`); primario con un tono más oscuro que `#C23A24`, **por definir** (el original oscurecía `#D9452F` a `#BF3923`, que hoy es casi igual a `#C23A24` y no se distinguiría).

---

#### N70 · Componentes exigidos por la auditoría y no dibujados

Ninguno de estos existe en el prototipo; son obligatorios según la auditoría o las decisiones pendientes y **hay que diseñarlos antes de construirlos**:

| Componente | Hallazgo | Qué debe tener (según la auditoría) |
|---|---|---|
| Encabezado móvil de una fila + barra inferior de 5 pestañas | H40, H41 | 56–64 px, se esconde al bajar; pestañas con texto Inicio, Agenda, Mapa, Mensajes, Perfil; "Crear" secundario |
| Pantalla "Entrar" y verificación por código | H12, H33 | Google y celular + código (SMS o WhatsApp), límites de intentos, recuperación |
| Versión pública de Evento, Agenda y Mapa | H33 | Encabezado "Entrar / Crear cuenta"; pedir cuenta solo al tocar Comprar, Voy o Unirme y volver al mismo punto |
| Resultados de búsqueda | H41 | Pantalla con estados vacío y de carga |
| "Mis boletas" | H20 | Próximas y pasadas, QR a pantalla completa, nombre de cada asistente, estado de las partes de pago, "Transferir" (H32), "Solicitar devolución" (H27) |
| "Mi perfil" y "Perfil de otra persona" | H46 | Ver N62 |
| Menú "Reportar / Bloquear" | H9, H13 | En cada mensaje, persona, publicación y parche; motivos; "Salir y reportar" |
| Invitación a un parche | H9 | "Laura te invitó a…" con aceptar |
| Tipos de parche | H30 | Abierto, con aprobación, privado; punto de encuentro solo para miembros |
| Privacidad y datos | H30 | "Quién ve mis planes", descargar, corregir, eliminar cuenta, revocar autorización |
| Tarjeta "Solicitud de pago · Fulleventos" | H29 | Monto, evento, localidad, quién pide, fecha límite, "Pagar mi parte" |
| Estados de pago y reserva | H17 | Ver N38 |
| Modos de compra por evento | H1, P1 | "Voy" (gratis), "Comprar en [BOLETERA]" (externo, con aviso), "Comprar" (venta propia) en tarjetas, evento y checkout |
| Bloque "Vendido por" y pie legal | H5 | Ver N38 y `footer` |
| Bloque de retracto y devoluciones | H27 | Ver N38 |
| Casillas de consentimiento separadas y aviso de privacidad | H28 | Ver N41 y N43 |
| Fecha de nacimiento y confirmación +18 | H10 | Registro y paso 1 del checkout |
| Factura a nombre de empresa y PULEP | H4 | Paso 2 del checkout; datos clave, checkout y boleta |
| Explicación "Qué significa verificado" | H48 | Ver N58 |
| Formulario para organizadores ("Crear evento") | H38, H14 | Sirve de validación comercial |
| Hoja inferior del mapa en celular | H42 | "Ver 3 planes en Medellín" |
| Región viva permanente | H49 | "Mostrando 6 planes en Bogotá", "Paso 2 de 4: Tus datos" |
| "Saltar al contenido" e "Ir a comprar boletas" | H59 | Primer elemento enfocable |
| Centro de notificaciones | H54 | Campana con panel, preferencias por tipo |
| Esqueletos de carga y errores con "Reintentar" | H17 | Listas, mapa, chat |
| Advertencia en enlaces externos del chat | H13, H29 | Detectar enlaces, cuentas y "consigna/transferencia" |
| "Necesito más tiempo" en la reserva | H3 | Solo si la boletera o la pasarela lo permiten |

### Inconsistencias a unificar

El mismo componente aparece con valores distintos según la pantalla. La columna "Canónica recomendada" es la versión a construir; cuando la auditoría la fija se cita el hallazgo, y cuando es una recomendación de este catálogo se dice "recomendado" con el motivo (casi siempre: la variante más usada, la que cumple contraste o la del código base).

#### Navegación y estructura

| Qué | Variantes encontradas | Canónica recomendada | Fuente |
|---|---|---|---|
| Encabezado | **5 variantes** (altos medidos a 1280 / 768 / 390 px): (1) visitante en Bienvenida (buscador con botón rojo, navegación de texto, sin borde, `padding: 14px 24px`, 78/134,1/214,5 px); (2) completo en Main, Agenda, Mapa y Chat (buscador sin botón, 5 íconos, "Crear evento", avatar; 69/125/224,2 px); (3) detalle en Evento ("Volver al feed", logo centrado, íconos sin buscador ni "Crear evento"; 69/69/125 px); (4) detalle en Perfil ("Volver al feed", logo, píldora "Mapa", círculo de mensajes; **no fijo**); (5) mínimo en Registro (logo + "¿Ya tienes cuenta? Entrar"; no fijo; 66,4 px) | Un componente de encabezado con sesión con variante "detalle" (N1) y otro para visitantes (N2); en celular, una fila de 56–64 px que se esconde al bajar + barra inferior de 5 pestañas con texto; "Crear" secundario | H40, H41 |
| Fijación y capas del encabezado | `sticky` + `z-index: 5` (Bienvenida, Main, Agenda, Evento, Chat ≥ 900 px); `z-index: 70` (Mapa); estático (Perfil, Registro, Chat < 900 px). El original: `z-index: 20` y `top: env(safe-area-inset-top, 0px)` | Fijo en todas las pantallas de la app con `top: env(safe-area-inset-top, 0px)`, una escala única de `z-index` (encabezado < barras fijas < cajones < modales) y `scroll-padding-top` igual a su alto | H16, R2; recomendado |
| Botón "Volver" | "Volver al feed" siempre lleva a Main (Evento, Perfil) | "Volver" regresa a la pantalla de origen | H41 |
| Margen lateral | 24 px fijos (Bienvenida, Registro, Main, Agenda, Chat, Perfil) vs `clamp(16px, 4vw, 24px)` (Mapa, Evento); original 24 → 16 px a ≤ 520 | `clamp(16px, 4vw, 24px)` en todas | H41 |
| Logo | `1.6rem` (Bienvenida, Registro) vs `1.55rem` (resto) | `1.6rem` (el del código base) | Recomendado |
| Buscador | Placeholders "¿Qué plan buscas?" (Bienvenida), "Busca planes, gente o lugares" (Main, Chat), "Busca eventos, lugares o artistas" (Agenda, Mapa); nombres "Buscar planes", "Buscar", "Buscar eventos"; botón de buscar solo en Bienvenida; ninguno busca | Un buscador con envío real y pantalla de resultados; un placeholder ("Busca planes, gente o lugares", recomendado por ser el más amplio) y un nombre accesible | H41, H38 |
| Selector de ciudad | Alto 40 px y `padding-left: 12px` (Bienvenida) vs 36 px y 10 px (resto); en Chat no hace nada; cada pantalla arranca en "Toda Colombia" | Un selector (36 px dentro de un buscador de 44 px) con la ciudad del usuario persistida y en la URL | H38, H42; recomendado |
| Insignia de mensajes | `top/right: 6px` (Main, Agenda, Mapa, Evento), `4px` + anillo `#17120F` (Chat, ícono activo), `−3px` sobre círculo con borde (Perfil); número fijo "3" en 5 pantallas (Main, Agenda, Mapa, Evento y Perfil) y calculado en Chat; nombre "Mensajes, 3 sin leer" vs "Mensajes, 3 chats sin leer" | Número calculado en todas, una posición (6 px; con anillo cuando el ícono está activo) y un solo texto ("Mensajes, {n} chats sin leer") | Recomendado |
| Campana y "Crear evento" | Campana en 5 pantallas (no en Perfil); "Crear evento" en 4 (no en Evento ni Perfil); ninguno hace nada | Presentes según la variante del encabezado y con destino real | H38, H54 |
| Pie de página | Pie en Bienvenida, Agenda, Mapa (relleno 24/36 px, `gap: 10px 28px`) y Evento; párrafo en la columna derecha de Main; nada en Registro, Chat y Perfil | Pie legal en todas (con [RAZÓN SOCIAL], NIT, PQR, SIC, documentos) y acceso a lo legal desde el menú en Main, Chat y Perfil | H5 |
| Nombres del alcance nacional | "Toda Colombia", "Todo el país", "Colombia", "todo Colombia" ("Ver todo Colombia" en Main y Mapa) | "Toda Colombia" (y "Ver toda Colombia") con un glosario corto | H62, decisión 2.8 |
| Nombres de secciones | "Mis parches" y "Tus parches" en la misma columna; "Planes 38" (Main) vs "Eventos 38" (Perfil); "Nuevo" repetido en 5 lugares del mapa | Un nombre por concepto; "Nuevo" solo en la entrada principal al mapa | H62, H37 |
| Estado de asistencia | "Vas" (Main), "Vas a ir" (Evento), "Va" (Perfil, en tercera persona sobre el propio perfil) | Botón "Voy" ↔ "Vas"; en perfiles, "Vas" en el propio y "Va" en el de otros; distinguir "Voy" de "Tengo boleta" | H37; recomendado |

#### Filtros y controles

| Qué | Variantes encontradas | Canónica recomendada | Fuente |
|---|---|---|---|
| Alto de chips | 34 px (etiquetas de "Sobre el evento", estáticas), 36 px (filtros del chat), 38 px (pestañas del feed, opciones del control segmentado), 40 px (atajos del evento), 42 px (categorías y ciudades en Bienvenida, Agenda y Mapa), 44 px (ranking del mapa), 46 px (gustos del registro); original 38 px (medido) | Chip de filtro de **42 px** (el más usado); variante grande de 46 px para selección en formularios; 34 px solo para etiquetas no interactivas | `.chip`; recomendado |
| Borde del chip apagado | `#EAE1D8` (casi todos) vs `#D9CEC3` (gustos del registro) | `#EAE1D8` para chips; los bordes de campos de formulario, con ≥ 3:1 | H52; recomendado |
| Desborde de filas de chips | Scroll horizontal sin pista (Bienvenida, Agenda, Mapa, atajos de Evento); salto de línea (pestañas de Main, gustos); el original ocultaba la barra (`scrollbar-width: none`) | Scroll con degradado y flechas, o 2 líneas | H61 |
| Conjuntos de categorías | Bienvenida: "Todo", "Rumba", "Conciertos", "Planes con amigos", "Gratis este finde", "Comida", "Deporte", "Arte y teatro"; Agenda: "Para ti", "Lo que repostea tu gente", "Rumba", "Conciertos", "Gratis", "Comida", "Deporte", "Arte y teatro"; Mapa: "Todo", "Rumba", "Conciertos", "Gratis", "Comida", "Deporte", "Arte y teatro" | Mismas categorías base y mismo rótulo ("Gratis") en todas; filtros sociales solo con sesión; en la landing "Con parches abiertos" en lugar de "Planes con amigos" | H39; recomendado |
| Conteos de los chips de ciudad | Siguen la categoría elegida en Agenda; fijos en Bienvenida; el ranking del mapa no tiene `aria-label` | Siempre siguen los filtros activos; siempre con `aria-label="{Ciudad}, {n} planes"` | Recomendado |
| Opciones excluyentes | Botones con `aria-pressed` (fecha, localidad, "¿Para quién?", medio de pago, tipo de persona, destino del repost, encuesta) | Grupos de radio (`fieldset`/`legend` o `role="radiogroup"`) | H59 |
| Filtro de fecha | Solo en Agenda y Mapa; no filtra; desborda a 320 px | Filtra de verdad, con estado vacío honesto; hace salto de línea | H39, H8 |
| Vista Lista / Mapa | Solo en Agenda (Mapa no tiene "Lista") | En las dos pantallas | H41 |
| Pestañas | `role="tablist"` sin flechas (Perfil, Evento; paneles marcados solo en Evento); filtros con `aria-pressed` llamados "pestañas" en Main | Patrón ARIA de pestañas completo en Perfil y Evento; los del feed siguen como filtros | H59 |
| Interruptores | "Dividir el pago" (Evento): `role="switch"`, 46 × 28, encendido `#C23A24`, apagado `#D9CEC3`, sin transición. "Silenciar notificaciones" (Chat): `aria-pressed`, 44 × 26, encendido `#17120F`, apagado `#EAE1D8`, transición de 160 ms | Un interruptor con `role="switch"`, 46 × 28, apagado con ≥ 3:1 (ej. `#857870`), estado también en texto y transición corta anulada con movimiento reducido | H52, R5; recomendado |
| Indicador de pasos | Registro: lista vertical, círculos de 30 px, hecho = "✓" (carácter) sobre blanco, actual amarillo, pendiente invisible; Checkout: fila horizontal, círculos de 26 px, hecho = palomita SVG sobre `#B9E07A`, actual `#17120F`, pendiente borde `#D9CEC3` | Mismo lenguaje en ambos (palomita SVG, hecho verde, actual oscuro, pendiente con borde visible) y anuncio del paso | H52, H49; recomendado |
| Barras de progreso | 8 px con radio 4 y relleno redondeado (Main), 8 px con relleno sin radio (Evento), 6 px (Chat y Registro) | Una barra de 8 px con relleno redondeado y `role="progressbar"` o texto equivalente | Recomendado |

#### Tarjetas y contenido

| Qué | Variantes encontradas | Canónica recomendada | Fuente |
|---|---|---|---|
| Tarjeta de evento | 7 variantes con estructura distinta (pública, marketplace, compacta del mapa, adjunta de Main, parecida de Evento, con estado de Perfil, compartida del chat); imagen 4/3, 16/10 o 104 px fijos; degradado al 55 % o 58 % | Un componente TarjetaEvento con variantes y un solo enlace por tarjeta | H53 ("tarjeta de evento… se reutiliza"), H36 |
| Título de tarjeta | `<a>` sin encabezado; DM Sans 700 de `1.05rem` (Bienvenida, Agenda, Perfil) o `.98rem` (Mapa, Evento); Archivo 800 de `1.15rem` (Main), `1.05rem` (plan fijado) o `1.02rem` (chat) | `h3` con enlace; DM Sans 700 `1.05rem` en tarjetas de catálogo; Archivo 800 solo en tarjetas destacadas (adjunta, compartida, plan fijado) | H59; recomendado |
| Placa de fecha | 7 tamaños (ver `.date`): mínimo 46/44/42/34/32 px (más el cuadro de 46 × 46 de los datos clave), número de `1.3rem` a `1rem`, posición 12/10/6 px | 3 tamaños: grande (tarjetas, 46 px), mediana (adjuntas y compartidas, 42–44 px), pequeña (miniaturas, 32 px); mes desde el dato | Recomendado |
| Categoría | `.7rem` (casi todas), `.68rem` (Mapa, repost), `.66rem` (Chat) | `.7rem` | Recomendado |
| Guardar | Corazón de 44 px sobre la foto (Bienvenida, Agenda), corazón de 36 px con borde (Mapa), marcador de 40 px sin acción (Main); en Main el corazón es "Me gusta" | Marcador para Guardar en todas (44 px sobre foto, 36 px en listas); corazón solo para "Me gusta" | H41, H38 |
| Repostear | Ventana con destino y comentario (Agenda) vs instantáneo (Mapa, Chat); quitar el repost es instantáneo en todas | Un solo patrón (recomendado: la ventana de Agenda) en las tres | H41 |
| Botón de compra de la tarjeta | `min-height: 44px; padding: 11px 15px` (Bienvenida), `min-height: 40px; padding: 10px 14px` (Agenda), `height: 36px; padding: 0 14px; .8rem` (Mapa); texto "Comprar" / "Ver plan" | Un tamaño (40 px; 36 px solo en la lista compacta) y texto según el modo de compra ("Ver plan", "Comprar en [BOLETERA]", "Comprar") | H1, P1; recomendado |
| Precio | "Desde $45.000" sin cargo en tarjetas, evento, chat y barra móvil; total con cargo solo en el checkout; tres funciones de formato distintas | Una función de formato y el mismo texto con aclaración del cargo en todas | H21 |
| Línea social | "186 van · 3 parches abiertos" (Bienvenida), "Laura y 13 más lo repostearon" (Agenda), "24 van · 3 amigos" con "3 amigos" fijo (Main), "Laura, Andrés, Sofía y 10 amigos más van" (Evento) | Componente LíneaSocial con datos reales y las mismas cifras entre pantallas | H37 |
| Datos del mismo evento | Hora 9:00 p. m. (Main), "Puertas 8:00 · Show 9:30" (Evento), 8:00 p. m. (Chat); "24 van" (Main) vs "186 van" (Evento); "4 de 6 cupos" que no se actualiza; "12 miembros" vs "6 de 8 cupos" del mismo parche | Un solo modelo de datos | H37, H25, H53 |
| Rejilla de tarjetas | `minmax(250px)` (Bienvenida), `minmax(260px)` (Agenda), `minmax(210px)` (Perfil), `minmax(200px)` (Evento) | Un mínimo para la tarjeta de catálogo (recomendado 260 px) y mínimos por bloque que eviten filas sueltas | H61; recomendado |
| Separadores | `#F1EAE3` dentro de tarjetas y listas; `#EAE1D8` en bordes y cabeceras | Mantener los dos: `--line` para bordes, `--line-soft` para separadores internos | Recomendado |
| Radios de esquina | 10, 12, 14, 16, 18, 20, 22, 24 y 28 px en contenedores | Escala: 12 (íconos y campos), 14–16 (opciones y cajas internas), 18 (tarjetas de evento y listas), 20 (tarjetas de contenido), 24 (paneles y modales), 28 (bloques héroe y oscuros); los 22 px de programación y plano pasan a 20 | Recomendado |
| Avatares | 14 tamaños (22 a 128 px); iniciales `#17120F` sobre fondo oscuro en Registro (invisibles) | Escala 24 / 32 / 40 / 48 / 72 / 128 (+ 68 con anillo para historias); color de letra definido por fondo (amarillo sobre oscuro) | H52; recomendado |
| Calificaciones | "4 de 5" en texto (Perfil) vs 5 estrellas `#E0A21B` (Main) | Estrellas con el número en texto | Recomendado |
| Recuerdos | Cuadros con franja oscura y texto (Perfil) vs cuadros sin texto de 10 px de radio (Evento) | Un componente con y sin pie | Recomendado |

#### Formularios, botones y ventanas

| Qué | Variantes encontradas | Canónica recomendada | Fuente |
|---|---|---|---|
| Campos de texto | Alto 42/44/46/48 px; borde `#D9CEC3` (Registro, checkout) o `#EAE1D8` (Chat, Main, Evento muro); radio 12, 14 o 999 px; fondo `#FBF7F3` o `#FFFFFF`; rótulo `.84rem`, `.86rem`, `.88rem` o `.9rem`; `outline: 0` en 13 campos | Un campo de formulario de 48 px (`border-radius: 12px`, borde con ≥ 3:1, rótulo `.88rem` 700) y un campo en píldora de 44 px para escribir mensajes; foco visible siempre; errores por campo | H23, H51, H52 |
| Foco | 3 px `#C23A24` (Evento, Chat, Mapa; amarillo en el panel oscuro del mapa) vs foco del navegador (Bienvenida, Registro, Main, Agenda, Perfil) | Regla global del código base con `#C23A24` (amarillo sobre oscuro) | H51, R2 |
| Deshabilitado | `#B9AEA4` + blanco (Registro, 2,18:1); `#EAE1D8` + `#6E6259` (Chat, 4,57:1); `opacity: .45` / `.4` (Evento, Mapa) | `#EAE1D8` + `#6E6259` con `aria-disabled="true"` y el motivo visible | H7; recomendado |
| Alturas del botón primario | 36, 38, 40, 42, 44, 46, 48, 52 y 54 px | Tres tamaños: 36 (solo listas densas), 44 (por defecto) y 52 (acción principal de un flujo) | Recomendado |
| Colores al alternar | "Seguir" pasa de oscuro a blanco; "Voy", "Repostear", "Agregar al calendario" pasan de blanco a oscuro; "Unirme" pasa de rojo a oscuro | Mantener los tres patrones documentados en N69 y aplicarlos siempre igual por tipo de acción | Recomendado |
| "Ver en el mapa" | Píldora de contorno oscuro 42 px (Bienvenida), contorno claro 38 px (Main), enlace subrayado (Agenda, Evento), botón oscuro 42 px (Evento, ubicación), texto rojo con pin (Mapa) | Dos estilos: enlace subrayado (en cabeceras de sección) y botón de contorno con ícono (en tarjetas y franjas); siempre abre la ciudad o el evento correctos | H42; recomendado |
| Insignia "Nuevo" | 3 tamaños (`1px 7px .68rem`, `1px 8px .7rem`, `2px 9px .72rem`) + etiqueta cuadrada en Mapa | Una insignia en píldora (`.7rem`) | H62; recomendado |
| Ventanas modales | `z-index` 20 / 30 / 40; ancho 520 o 540 px; cierre con Escape y clic afuera solo en algunas; el panel de información del chat en celular no es diálogo | N68 | H7 |
| Botón cerrar | 40 px `#FBF7F3` (Agenda, Chat), 44 px `#FFFFFF` (checkout), 36 px transparente (aviso) | 40 px `#FBF7F3` con X de 16 px (44 px en celular) | Recomendado |
| Estados vacíos | Cajas con relleno 40/36/32 px, radio 18 o 20, borde punteado o sin borde, con o sin ícono; acciones en 40 o 44 px | Un componente con variantes "en página" (caja punteada) y "en panel" (con ícono), acción de 44 px | Recomendado |
| Opción con radio | Radio de 20 px (localidad, destino) o 18 px (medio de pago); fondo elegido = tinte de la localidad, `#FBF7F3` o blanco con anillo interior | Un radio de 20 px y un fondo elegido por contexto (tinte en localidades, `#FBF7F3` en el resto) | Recomendado |

#### Notas finales para quien implemente

- **Capturas viejas:** `agenda-repost.jpg` y `mapa-medellin.jpg` muestran "Boletas ↗" y, la primera, un encabezado sin el ícono de Mensajes. Manda el código ("Comprar").
- **Errores de consola en Evento (H58):** los íconos con ruta en plantilla (`{{po.d}}`, `{{m.d}}`) disparan errores antes de resolverse; en producción, íconos como componentes y pruebas que fallen ante errores de consola.
- **Encuesta:** con 1 voto el pie dice "1 votos" (singular sin manejar). **Registro:** "1 elegidos" (H45).
- **Agenda, Bienvenida y Mapa usan `href: 'Evento.dc.html'` para los 19 eventos** (H36): cada tarjeta, historia, noticia y plan fijado debe abrir su propio evento con URL propia (`/bogota/eventos/noche-de-salsa-y-boleros-2026-10-09`, H34).
- **Pines de la landing (H60) y del mapa en celular:** los centros quedan a 14–16 px (landing) y a 36,3 px en el mapa (Medellín y Pereira a 390 px, con pines de 36 px: se tocan); revisar tamaños mínimos táctiles al construir con datos reales.
- **Mapa entre 1014 y 1099 px:** el panel de resultados se estira a 4955 px; asegurar el scroll interno en ese rango.
- **Main sin `@media`:** el reordenamiento para celular y tableta (H15) es obligatorio, no opcional.
