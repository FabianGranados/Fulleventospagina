# Handoff de diseño: página de inicio de Fulleventos

Este documento es la **única fuente de verdad** para implementar la página de inicio en React + Tailwind.

- **Referencia visual:** `preview-demo.html` en la raíz del repo, en la rama `claude/awesome-hypatia-nkao9x`. Es un archivo HTML independiente; se abre directo en el navegador. Si algo de este documento no coincide con ese archivo, **gana este documento**, porque aquí se corrigen los detalles que el prototipo deja pendientes (están marcados con **[Corregir al implementar]**).
- **Archivos obsoletos.** No se deben usar como referencia de diseño:
  - `design-system.html` y la sección "Sistema de diseño" de `WIREFRAMES_Y_FLUJO.md`: paleta rosa `#FF3D81`, tipografías Sora e Inter. Se descartaron.
  - `styles.css`, `script.js` y `assets/`: son del sitio anterior de servicios de DJ.

  Las secciones de flujo de usuario y de las demás páginas en `WIREFRAMES_Y_FLUJO.md` siguen siendo válidas como contexto.

---

## 1. Objetivo de la página y público

**Qué es Fulleventos.** Una red social y agenda de eventos en Colombia. Empieza por Bogotá. Reúne en un solo lugar los planes que hoy están dispersos entre boleteras, medios y sitios del gobierno. Muestra la información completa y verificada de cada evento y **redirige a la boletera oficial** para la compra (TuBoleta, Ticketmaster, Fever, etc.).

**Fulleventos no vende boletas.** Esto debe quedar claro en la interfaz: botón con ícono de enlace externo y aviso en el pie de página.

**Objetivo de la página de inicio**, en orden de prioridad:
1. **Enganchar** en los primeros segundos con un mensaje local y con energía ("Arma tu parche").
2. **Hacer sentir la parte social:** tus amigos ya tienen plan, y tú puedes unirte.
3. **Informar** con noticias de la escena (carteles, boletas agotadas, lugares nuevos, planes gratis).
4. **Llevar a la agenda**, que funciona como un marketplace de eventos. Cada evento lleva a la boletera oficial.

**Público.** Personas de 18 a 35 años en Bogotá que buscan qué hacer, sobre todo de jueves a domingo, y que deciden planes en grupo con amigos. El tono es colombiano, cercano y bogotano ("parche", "rumba", "finde", "Me uno"), sin caer en lo infantil.

**Monetización.** No afecta esta página por ahora. La fase 1 se enfoca en construir comunidad, sin publicidad visible.

---

## 2. Decisiones de diseño, con el porqué y lo descartado

| # | Decisión | Por qué | Qué se descartó y por qué |
|---|---|---|---|
| 1 | Plataforma de **descubrimiento con redirección** a boleteras oficiales | Es la propuesta de valor: agregar la información dispersa sin competir con TuBoleta. | El sitio original de servicios de DJ y sonido: era otro negocio. La venta propia de boletas: queda para una fase futura. |
| 2 | Hosting en **Cloudflare** (Pages para el frontend, Workers y D1 para el backend) | Decisión del dueño del proyecto. | Vercel + Supabase, que se había recomendado al principio. |
| 3 | **Se descartó el primer sistema visual**: degradado rosa `#FF3D81` → naranja `#FFB547`, Sora + Inter, emojis como íconos, tarjetas genéricas | El dueño dijo que "se ve muy IA": limpio pero sin personalidad. | Todo ese sistema. No reutilizar los tokens de `tailwind.config.js` actuales. |
| 4 | Un intento intermedio de hero "formal": fondo oscuro `#15111B`, alineado a la izquierda, cifras debajo | El dueño pidió algo más formal. | Se reemplazó por la dirección "parche" cuando el dueño trajo esa referencia. **De ese intento se conservan tres reglas:** sin emojis (íconos SVG de línea), todo en español sin mezclar inglés, y nunca mostrar métricas inventadas como "10K+ people". |
| 5 | **Dirección visual "parche"**: fondo crema cálido, rojo coral, titular en mayúsculas muy pesado sobre bloques de color durazno/rosa, etiqueta amarilla, tarjeta de hero oscura con foto | Referencia que trajo el dueño: se siente local, editorial, con energía y humana. | — |
| 6 | **Hero con pocas opciones**: un solo botón ("Encuentra tu plan") más la prueba social de amigos | El dueño pidió "no tantas opciones en el hero". Una sola acción clara convierte mejor. | Los botones de categoría dentro del hero (venían en la referencia y en versiones anteriores), el buscador grande dentro del hero y la fila de cifras. |
| 7 | Las **categorías se mueven a la agenda** como filtros | Ahí sí se usan: filtran la lista que se tiene enfrente. | Tenerlas en el hero, donde no filtran nada visible. |
| 8 | La prueba social es "**Laura, Andrés y 12 amigos más tienen plan este finde**" | Es lo que convierte la página en red social: "tu gente ya está aquí". Invita a registrarse. | Las cifras globales ("2.350 eventos", "100% verificados"): son impersonales y en ese momento eran inventadas. |
| 9 | **Sección de noticias** justo debajo del hero | El dueño lo pidió explícitamente ("obvio tienen que ir noticias"). Da razones para volver todos los días. | — |
| 10 | Panel **"Tu gente"** (actividad de amigos) al lado de las noticias | Es la parte de red social: ver qué planean los amigos y unirse con un clic. | — |
| 11 | **Agenda tipo marketplace** debajo, "como lo hicimos" | Pedido del dueño. Mantiene el modelo de redirección. | — |
| 12 | Marca **"fulleventos"** en minúscula y color coral; **"Arma tu parche"** como frase de campaña | La referencia decía "parche" como nombre. Se mantuvo la marca existente y "parche" pasó a ser el lema. | Renombrar la marca a "parche". **Pendiente de confirmación final del dueño**, aunque aprobó el diseño con esto. |
| 13 | Navegación: "Noticias", "Agenda", "Mis planes", "Crear evento", "Entrar" | Los enlaces apuntan a las secciones reales de la página. | "Explorar" (de la referencia), reemplazado por "Agenda". La campana de notificaciones y el avatar del Navbar actual. |
| 14 | Se agregó un filtro **"Todo"** al inicio de los chips | Hace falta un estado por defecto y una forma de quitar el filtro. | — |
| 15 | Eventos gratis: muestran "**Gratis**" y el botón "**Ver plan**", sin ícono externo | No hay boleta que comprar. | Mostrar "Boletas" en un evento gratuito. |
| 16 | **Un solo tema claro** (crema). El hero es oscuro por diseño, no por ser modo oscuro. | Es la identidad de la referencia. | El modo oscuro: no se diseñó. No implementarlo en esta fase. |
| 17 | Se eliminó la sección "¿Organizas eventos?" y el pie de página de 4 columnas del `Home.jsx` actual | El botón "Crear evento" del encabezado ya cubre a los organizadores. El pie se simplificó a 2 textos. | Esa sección y ese pie. |
| 18 | Contenido de ejemplo marcado como "**Contenido de ejemplo**" | No presentar noticias falsas como reales. | — |

---

## 3. Sistema visual

### 3.1 Colores

Todos los colores son tokens. No se deben usar valores literales dentro de los componentes.

| Token | Hex / valor | Uso |
|---|---|---|
| `bg` | `#FBF7F3` | Fondo de la página y del encabezado (crema cálido) |
| `surface` | `#FFFFFF` | Tarjetas, panel "Tu gente", buscador, chips |
| `ink` | `#17120F` | Texto principal, botón oscuro, chip activo, texto del titular |
| `muted` | `#6E6259` | Texto secundario (lugares, fechas, metadatos) |
| `line` | `#EAE1D8` | Bordes y separadores |
| `brand` | `#D9452F` | Rojo coral: logo, botón "Boletas", botón de buscar, etiquetas de sección, categorías, anillo de foco |
| `brand-hover` | `#BF3923` | Hover de los botones de color `brand` |
| `ink-hover` | `#33291F` | Hover del botón "Crear evento" |
| `chip-hover-light` | `#F3ECE6` | Hover del botón blanco "Encuentra tu plan" |
| `yellow` | `#F6DC6A` | Etiqueta "Arma tu parche" |
| `peach` | `#F3B27E` | Degradado del titular |
| `pink` | `#EE93BC` | Degradado del titular |
| `hero` | `#140E10` | Fondo base de la tarjeta del hero, y borde de los avatares dentro del hero |
| `placeholder` | `#9A8E85` | Texto de ejemplo en el buscador **[Corregir al implementar: contraste aprox. 3,2:1; subirlo a `#857970` o más oscuro]** |

**Colores de avatar.** Se asignan por persona y siempre van con texto `ink`:

| Clase | Hex |
|---|---|
| `c1` | `#F3B27E` (durazno) |
| `c2` | `#A3A8F0` (lavanda) |
| `c3` | `#EE93BC` (rosa) |
| `c4` | `#B9E07A` (verde lima) |
| `c5` | `#F6DC6A` (amarillo) |
| `c6` | `#8FD3D0` (aguamarina) |

**Transparencias fijas:**
- Etiqueta de la foto: texto `rgba(255,255,255,.75)` y borde `rgba(255,255,255,.3)`.
- Texto de amigos en el hero: `rgba(255,255,255,.88)`.
- Botón de guardar sobre la imagen: fondo `rgba(255,255,255,.92)`.
- Sombra del buscador: `0 1px 2px rgba(23,18,15,.04)`.
- Sombra de tarjeta en hover: `0 12px 28px rgba(23,18,15,.10)`.

**Contrastes verificados:** `muted` sobre `bg` ≈ 5,6:1; `brand` sobre blanco ≈ 5,6:1; blanco sobre `brand` ≈ 5,6:1. Todos cumplen AA.

### 3.2 Tipografías (Google Fonts)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@800;900&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&display=swap" rel="stylesheet">
```

| Rol | Familia y respaldo | Pesos |
|---|---|---|
| `display` (titulares, número de la fecha, etiqueta amarilla) | `'Archivo', 'Arial Black', 'Helvetica Neue', sans-serif` | 800, 900 |
| `ui` (todo lo demás, incluido el logo) | `'DM Sans', system-ui, -apple-system, 'Segoe UI', sans-serif` | 400, 500, 700 |

Hay que reemplazar el enlace a Sora/Inter que está hoy en `index.html`.

### 3.3 Escala tipográfica (valores exactos)

| Elemento | Familia | Tamaño | Peso | Interlineado | Espaciado entre letras | Otros |
|---|---|---|---|---|---|---|
| Cuerpo base (`body`) | ui | 16px | 400 | 1.5 | — | — |
| Logo "fulleventos" | ui | 1.6rem | 700 | — | -0.03em | color `brand`, en minúsculas |
| Enlaces de navegación | ui | .92rem | 500 | — | — | — |
| Botón "Crear evento" | ui | .9rem | 700 | — | — | — |
| Texto del buscador | ui | .95rem | 400 | — | — | — |
| Ciudad en el buscador | ui | .9rem | 400 | — | — | `white-space: nowrap` |
| Etiqueta "Arma tu parche" | display | 1.05rem (.9rem en ≤820px) | 800 | — | .01em | mayúsculas |
| **Titular del hero (h1)** | display | `clamp(2.3rem, 5.8vw, 4.9rem)` | 900 | .98 | -0.035em | mayúsculas, color `ink` |
| Botón "Encuentra tu plan" | ui | 1rem | 700 | — | — | — |
| Texto de amigos (hero) | ui | .88rem | 400 (nombres y "12 amigos más" en 700) | 1.3 | — | — |
| Iniciales en avatar (34px) | ui | .72rem | 700 | — | — | — |
| Etiqueta de sección ("Lo que se mueve") | ui | .74rem | 700 | — | .12em | mayúsculas, color `brand` |
| Título de sección (h2) | display | `clamp(1.7rem, 3.2vw, 2.4rem)` | 900 | 1.05 | -0.03em | `text-wrap: balance` |
| "Ver toda la agenda" | ui | .9rem | 700 | — | — | subrayado de 2px |
| "Contenido de ejemplo" | ui | .78rem | 400 | — | — | color `muted` |
| Etiqueta de noticia ("Cartel confirmado") | ui | .7rem | 700 | — | .1em | mayúsculas, color `brand` |
| Título de la noticia destacada (h3) | display | 1.35rem | 800 | 1.12 | -0.02em | balance |
| Resumen de la noticia destacada | ui | .93rem | 400 | 1.5 | — | color `muted` |
| Metadatos ("Hace 3 horas") | ui | .8rem | 400 | — | — | color `muted` |
| Título de noticia de la lista (h4) | ui | 1.02rem | 700 | 1.3 | — | balance |
| "Tu gente" (h3) | ui | 1rem | 700 | — | — | — |
| Subtítulo de "Tu gente" | ui | .85rem | 400 | — | — | color `muted` |
| Texto de actividad | ui | .88rem | 400 (nombres y planes en 700) | 1.35 | — | — |
| Línea secundaria de actividad | ui | .76rem | 400 | — | — | color `muted` |
| Botón "Me uno" | ui | .78rem | 700 | — | — | — |
| Chip de filtro | ui | .9rem | 500 | — | — | — |
| Número del día en la fecha | display | 1.25rem | 900 | 1 | — | — |
| Mes en la fecha | ui | .66rem | 700 | 1 | .06em | mayúsculas, color `muted` |
| Categoría de la tarjeta | ui | .7rem | 700 | — | .1em | mayúsculas, color `brand` |
| Título de la tarjeta (h3) | ui | 1.05rem | 700 | 1.25 | — | balance |
| Lugar de la tarjeta | ui | .85rem | 400 | — | — | color `muted` |
| "3 amigos van" | ui | .78rem | 400 | — | — | color `muted` |
| Iniciales en avatar (24px) | ui | .58rem | 700 | — | — | — |
| Precio | ui | .95rem | 700 | — | — | `font-variant-numeric: tabular-nums` |
| Boletera bajo el precio | ui | .72rem | 400 | — | — | color `muted`, en bloque |
| Botón "Boletas" / "Ver plan" | ui | .82rem | 700 | — | — | `white-space: nowrap` |
| Pie de página | ui | .85rem | 400 | — | — | color `muted` |

### 3.4 Espaciado y medidas

- **Contenedor (`.wrap`):** `max-width: 1240px`, centrado, `padding-inline: 24px` (16px en ≤520px). El encabezado, el contenido principal y el pie usan el mismo contenedor.
- **Encabezado:** altura 76px; separación de 24px entre logo, buscador y navegación; 22px entre enlaces de navegación.
- **Buscador:** `max-width: 480px`; relleno `5px 5px 5px 18px`; separación interna de 10px; la ciudad tiene `padding-left: 14px` y un borde izquierdo de 1px `line`; botón circular de 38px.
- **Botón "Crear evento":** relleno `10px 18px`.
- **Hero:** relleno `56px 64px 52px`; `min-height: 520px`; contenido en columna, centrado verticalmente.
  - Etiqueta amarilla: relleno `5px 12px`, `margin-left: 44px`, alineada al inicio y pegada al primer bloque del titular, **sin separación**.
  - Bloques del titular: relleno `.1em .22em .06em`; ancho al contenido (`width: fit-content`).
    - Bloque 2: `margin-left: 1.15em`.
    - Bloque 3: `margin-left: .4em` y `max-width: 13ch`, lo que fuerza el salto "AL CONCIERTO / DEL SÁBADO" dentro del mismo bloque.
  - Pie del hero: `margin-top: 34px`; separación de 18px en vertical y 22px en horizontal.
  - Botón blanco: relleno `15px 26px`.
  - Avatares: 34px, superpuestos con `margin-left: -9px`; separación de 10px hasta el texto.
  - Etiqueta de la foto: `top: 20px; right: 20px`; relleno `4px 10px`.
- **Secciones:** `padding-block: 64px 8px`. El encabezado de sección tiene `margin-bottom: 24px` y 6px entre la etiqueta y el h2.
- **Bloque de noticias + "Tu gente":** columnas `2fr` y `1fr`, separación de 28px. Dentro de las noticias: columnas `1.25fr` (destacada) y `1fr` (lista), separación de 20px.
  - Noticia destacada: imagen 4:3; texto con relleno `18px 20px 20px`; 8px bajo el título; 10px sobre los metadatos.
  - Ítems de la lista: `padding-block: 16px`. El primero no tiene relleno superior y el último no tiene borde inferior.
- **Panel "Tu gente":** relleno 20px; 4px bajo el título; 14px bajo el subtítulo. Cada actividad tiene `padding-block: 12px`, separación de 12px y avatar de 36px. El botón "Me uno" tiene relleno `6px 12px`.
- **Chips:** separación de 8px; relleno `9px 16px`; `margin-bottom: 22px`; `padding-bottom: 6px` (deja aire a la barra de desplazamiento oculta).
- **Grilla de eventos:** separación de 22px (14px en ≤820px).
  - Tarjeta: imagen 4:3.
  - Fecha: `top/left: 12px`, relleno `5px 9px 4px`, `min-width: 46px`.
  - Botón guardar: `top/right: 12px`, 36×36px.
  - Texto: relleno `14px 16px 16px`; título con margen `4px 0 6px`; fila de amigos con `margin-top: 10px` y avatares de 24px superpuestos (`margin-left: -7px`).
  - Fila de compra: `margin-top: auto` (se ancla abajo) y `padding-top: 14px`.
  - Botón "Boletas": relleno `9px 14px`; separación de 6px hasta el ícono.
- **Pie:** `margin-top: 72px`; `padding-block: 28px 40px`; borde superior de 1px `line`; separación entre los dos textos de 12px en vertical y 28px en horizontal.

### 3.5 Bordes y radios

| Elemento | Radio | Borde |
|---|---|---|
| Hero | 28px (22px en ≤820px) | ninguno |
| Noticia destacada y panel "Tu gente" | 20px | 1px `line` |
| Tarjeta de evento | 18px | 1px `line` |
| Fecha (tarjeta) | 10px | ninguno |
| Buscador, chips, todos los botones con forma de píldora, etiqueta de la foto | 999px | 1px `line` (buscador, chips, "Me uno") |
| Avatares y botones circulares | 50% | avatares del hero: 2px color `hero`; avatares de la tarjeta: 2px blanco; avatares de "Tu gente": sin borde |
| Etiqueta amarilla y bloques del titular | **0** (esquinas rectas, a propósito) | ninguno |

### 3.6 Sombras

Solo hay tres sombras. No se deben agregar más.
1. Buscador: `0 1px 2px rgba(23,18,15,.04)`.
2. Tarjeta de evento en hover: `0 12px 28px rgba(23,18,15,.10)`.
3. Ninguna otra superficie tiene sombra en reposo. La separación se logra con bordes `line`.

### 3.7 Fondos con degradado

- **Hero.** Cinco capas, en este orden, sobre `#140E10`. Simula una foto de concierto con luces desenfocadas mientras no haya foto real:
  ```css
  radial-gradient(circle at 74% 30%, rgba(214,140,70,.55) 0, transparent 22%),
  radial-gradient(circle at 92% 78%, rgba(190,70,80,.45) 0, transparent 26%),
  radial-gradient(circle at 60% 92%, rgba(230,170,80,.25) 0, transparent 18%),
  radial-gradient(ellipse at 8% 40%, rgba(70,30,80,.55) 0, transparent 45%),
  #140E10
  ```
- **Bloques del titular.** Los bloques 1 y 3 van con `linear-gradient(90deg, #F3B27E, #EE93BC)` (durazno → rosa). El bloque 2 va **invertido**: `linear-gradient(90deg, #EE93BC, #F3B27E)`. La alternancia es intencional.
- **Imagen de la noticia destacada (relleno):**
  ```css
  radial-gradient(circle at 30% 35%, rgba(246,220,106,.85) 0, transparent 30%),
  radial-gradient(circle at 75% 65%, rgba(217,69,47,.8) 0, transparent 40%),
  #2A1A16
  ```
- **Imagen de tarjeta (relleno):** `radial-gradient(circle at 70% 30%, <color1> 0, transparent 55%), <color2>`. Los colores de cada evento están en la sección 4.5.

### 3.8 Animaciones

- La **única** transición definida en el prototipo: la tarjeta de evento, con `transition: transform 200ms ease-out, box-shadow 200ms ease-out`. En hover hace `translateY(-3px)` y aplica la sombra 2.
- Con `prefers-reduced-motion: reduce`, la tarjeta no tiene transición ni se mueve.
- Los cambios de color en botones, chips y enlaces son **instantáneos** en el prototipo. **[Corregir al implementar]** Agregar `transition: background-color, color, border-color 150ms ease-out` a botones, chips y enlaces. Nada más: no animar alto ni ancho, y no agregar animaciones de entrada.
- No hay animaciones de carga, parallax ni carruseles.

---

## 4. Estructura de la página, sección por sección (textos exactos)

Orden en el DOM: `header.top` → `main.wrap` (hero → noticias → agenda) → `footer`.

### 4.1 Encabezado (sticky)

- `position: sticky; top: env(safe-area-inset-top, 0px); z-index: 20`. El fondo es `bg`, sin borde inferior ni sombra.
- De izquierda a derecha:
  1. **Logo:** texto `fulleventos`, enlace a `/`.
  2. **Buscador** (`<form role="search">`, el envío no recarga la página):
     - Ícono de lupa de 18px, color `muted`.
     - `<input type="search">` con placeholder **"¿Qué plan buscas?"** y `aria-label="Buscar planes"`.
     - Divisor vertical y luego el selector de ciudad: ícono de pin de 16px + **"Bogotá"**.
     - Botón circular de color `brand` con lupa blanca de 16px y `aria-label="Buscar"`.
  3. **Navegación** (alineada a la derecha con `margin-left: auto`):
     - Enlace **"Noticias"** → `#noticias`
     - Enlace **"Agenda"** → `#agenda`
     - Enlace **"Mis planes"**
     - Botón oscuro **"Crear evento"**
     - Enlace **"Entrar"**
- **Comportamiento esperado:** la ciudad será un selector en el futuro; por ahora es un texto fijo. Buscar, "Mis planes", "Crear evento" y "Entrar" todavía no tienen destino. Dejarlos listos para conectar con rutas.

### 4.2 Hero (`<section aria-label="Bienvenida">`)

Tarjeta oscura con esquinas redondeadas, dentro del contenedor (no ocupa todo el ancho de la pantalla).

1. **Etiqueta de la foto** (arriba a la derecha): `[Foto real de un evento en Bogotá]`. **Es un marcador de diseño; no se publica.** Ver la sección 8.
2. **Etiqueta amarilla:** `Arma tu parche` (se ve en mayúsculas por CSS).
3. **Titular `<h1>`**, con tres bloques. Escribirlos en el código en minúsculas normales; las mayúsculas las pone CSS:
   - Bloque 1: `De la rumba`
   - Bloque 2: `del viernes`
   - Bloque 3: `al concierto del sábado`

   Se lee: "DE LA RUMBA / DEL VIERNES / AL CONCIERTO / DEL SÁBADO".
4. **Pie del hero:**
   - Botón blanco con forma de píldora **"Encuentra tu plan"**, enlace a `#agenda`.
   - Grupo de amigos: 4 avatares superpuestos (`LM` c1, `AR` c2, `SC` c3, `JP` c4). Al lado, en dos líneas: **"Laura, Andrés y _12 amigos más_"** (los nombres en peso normal y "12 amigos más" en negrita blanca), y debajo **"tienen plan este finde"**.

   Los nombres y el número salen de los datos del usuario. Ver la sección 8 para el caso sin sesión.

### 4.3 Noticias (`<section id="noticias">`)

**Encabezado de sección:**
- Etiqueta: **"Lo que se mueve"**
- h2: **"Noticias de la escena"**
- A la derecha: **"Contenido de ejemplo"**. Quitarlo cuando las noticias sean reales.

**Columna izquierda, noticia destacada** (toda la tarjeta es un enlace):
- Imagen 4:3, con `role="img"` y `aria-label="Imagen de la noticia"`. Con foto real, usar `<img alt>` descriptivo.
- Etiqueta: **"Cartel confirmado"**
- Título: **"El festival de noviembre en el Simón Bolívar revela su cartel completo"**
- Resumen: **"Tres escenarios, más de 40 artistas y entrada por días. La preventa abre este jueves."**
- Metadatos: **"Hace 3 horas · 4 min de lectura"**

**Columna central, lista de 3 noticias** (cada una es un enlace):

| Etiqueta | Título | Metadatos |
|---|---|---|
| Venta de boletas | Se agotó la primera fase para el concierto del Movistar Arena; anuncian segunda fecha | Hace 5 horas |
| Nuevo lugar | Abre en Chapinero un club con programación de electrónica de jueves a sábado | Ayer |
| Gratis | Teatro al aire libre en los parques de Usaquén y Teusaquillo durante todo octubre | Hace 2 días |

**Columna derecha, panel "Tu gente"** (`<aside aria-label="Actividad de tus amigos">`):
- Título: **"Tu gente"**
- Subtítulo: **"Lo que están planeando tus amigos"**
- Cuatro actividades. Cada una tiene avatar, texto, línea secundaria y el botón **"Me uno"**:

| Avatar | Texto (en negrita lo indicado con **) | Línea secundaria |
|---|---|---|
| LM (c1) | **Laura M.** va a **Noche de salsa en Galería Café Libro** | Vie 9 oct · hace 1 h |
| AR (c2) | **Andrés R.** guardó **Festival de jazz al parque** | Sáb 10 oct · hace 3 h |
| SC (c3) | **Sofía C.** armó un parche para **Santa Fe vs. Millonarios** | Dom 11 oct · 4 van |
| JP (c4) | **Juan P.** recomienda **Stand-up en Teatro Libre** | "Me dolió la barriga de reír" (con comillas tipográficas “ ”) |

Los verbos de actividad son: **va a**, **guardó**, **armó un parche para**, **recomienda**. Son los tipos de actividad que debe soportar el modelo de datos.

### 4.4 Agenda (`<section id="agenda">`)

**Encabezado de sección:**
- Etiqueta: **"Agenda"**
- h2: **"Este finde en Bogotá"**
- A la derecha, el enlace **"Ver toda la agenda"**, con subrayado de 2px.

**Chips de filtro** (`role="group"`, `aria-label="Filtrar por categoría"`). Son de selección única y aparecen en este orden:

| Texto | Clave del filtro |
|---|---|
| Todo | `all` (activo por defecto) |
| Rumba | `rumba` |
| Conciertos | `conciertos` |
| Planes con amigos | `amigos` |
| Gratis este finde | `gratis` |
| Comida | `comida` |
| Deporte | `deporte` |
| Arte y teatro | `teatro` |

**Grilla de tarjetas.** La anatomía de cada tarjeta, de arriba a abajo:
1. **Imagen 4:3**, con:
   - Fecha arriba a la izquierda: día en número grande y mes abreviado en mayúsculas, por ejemplo **"9"** / **"OCT"**.
   - Botón de guardar (corazón) arriba a la derecha, con `aria-label="Guardar {título}"`.
2. **Categoría**, en mayúsculas y color `brand`.
3. **Título.**
4. **Lugar:** "Nombre del lugar · Barrio".
5. **Amigos que van** (solo si hay al menos uno): avatares de 24px **sin iniciales**, solo el color, y el texto "**1 amigo va**" o "**N amigos van**".
6. **Fila de compra:**
   - A la izquierda, el precio: "**Desde $45.000**", o "**Gratis**" si cuesta 0. Debajo va el nombre de la boletera o la fuente.
   - A la derecha, el botón:
     - Eventos de pago: **"Boletas ↗"** (flecha diagonal de 13px). Abre la boletera en otra pestaña (`target="_blank" rel="noopener"`).
     - Eventos gratis: **"Ver plan"**, sin flecha. Va al detalle del evento.

**Estado vacío** (si un filtro no tiene resultados): el texto **"No hay planes en esta categoría este finde."**, centrado y de color `muted`, ocupando toda la fila.

### 4.5 Datos de ejemplo de la agenda (exactos)

Fechas: viernes 9 al domingo 11 de octubre de 2026. El precio va en COP; 0 significa gratis.

| # | Título | Categoría | Filtros | Día | Lugar | Precio | Boletera / fuente | Colores de imagen (1, 2) | Amigos (avatares) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Noche de salsa y boleros en vivo | Rumba | rumba, amigos | 9 | Galería Café Libro · Zona T | 45000 | TuBoleta | `#E8A04F`, `#B5372B` | 3 (c1, c5) |
| 2 | Festival de jazz al parque | Conciertos | conciertos, gratis | 10 | Parque El Country · Usaquén | 0 | Idartes | `#4F6DD8`, `#1E2550` | 1 (c2) |
| 3 | Rock en el Movistar Arena | Conciertos | conciertos | 10 | Movistar Arena · Salitre | 180000 | TuBoleta | `#D9452F`, `#2B0F12` | 0 |
| 4 | Santa Fe vs. Millonarios | Deporte | deporte, amigos | 11 | Estadio El Campín · Teusaquillo | 60000 | Ticketmaster | `#C4302B`, `#1F3A8A` | 4 (c3, c6, c4) |
| 5 | Stand-up: risas de domingo | Arte y teatro | teatro, amigos | 11 | Teatro Libre · Chapinero | 55000 | TuBoleta | `#EE93BC`, `#5A2340` | 1 (c4) |
| 6 | Mercado gastronómico de las Américas | Comida | comida, gratis, amigos | 10 | Plaza de los Artesanos | 0 | Entrada libre | `#F6DC6A`, `#C46A2B` | 2 (c5, c1) |
| 7 | Techno hasta el amanecer | Rumba | rumba | 9 | Club en Chapinero | 70000 | Fever | `#6B3FA0`, `#0E0A1A` | 1 (c6) |
| 8 | Obra: La casa de Bernarda Alba | Arte y teatro | teatro | 9 | Teatro Colón · La Candelaria | 40000 | TuBoleta | `#B88A5A`, `#3A2414` | 0 |

Hay dos inconsistencias en los datos: en las filas 1 y 4 el número de amigos (3 y 4) es mayor que los avatares listados (2 y 3). El prototipo muestra los avatares disponibles y el número real. **[Corregir al implementar]** Mostrar como máximo 3 avatares; el número es el total.

### 4.6 Pie de página

Dos textos en una fila (se apilan si no caben):
- Izquierda: **"© 2026 Fulleventos · Bogotá, Colombia"**. Generar el año con `new Date().getFullYear()`.
- Derecha: **"Las boletas se compran en las boleteras oficiales. Fulleventos no vende entradas."**

---

## 5. Comportamiento responsive

El prototipo trabaja de escritorio hacia abajo, con `max-width`. En Tailwind, que trabaja desde móvil hacia arriba, se traduce así:

| Ancho | Encabezado | Hero | Noticias + "Tu gente" | Grilla de eventos | Otros |
|---|---|---|---|---|---|
| **> 1080px** (escritorio) | Una fila: logo, buscador, navegación completa | Relleno `56px 64px 52px`, alto mínimo 520px, radio 28px, desplazamientos del titular activos | 3 columnas: destacada, lista y panel | **4 columnas**, separación 22px | — |
| **821–1080px** (tablet horizontal) | Igual que escritorio | Igual | El panel "Tu gente" **baja** y ocupa todo el ancho debajo de las noticias. Las noticias siguen en 2 columnas. | **3 columnas** | — |
| **521–820px** (tablet vertical / móvil grande) | Se parte en dos filas: logo + "Crear evento" + "Entrar" arriba; el **buscador pasa abajo a todo el ancho**. Se ocultan "Noticias", "Agenda" y "Mis planes". El alto pasa a ser automático, con relleno vertical de 12px y separación de 12px. | Relleno `64px 22px 32px`, **sin alto mínimo**, radio 22px. Etiqueta amarilla **sin desplazamiento** y a .9rem. **Los bloques 2 y 3 del titular sin desplazamiento.** | Todo en **1 columna**: destacada, lista y panel | **2 columnas**, separación 14px | — |
| **≤ 520px** (móvil) | Igual que arriba; en el buscador se oculta el texto "Bogotá" y queda solo el pin | Igual que arriba | 1 columna | **1 columna** | Margen lateral del contenedor de 16px |

**Reglas que aplican en todos los anchos:**
- Los chips se desplazan **horizontalmente** dentro de su fila, con la barra de desplazamiento oculta. La página nunca debe tener desplazamiento horizontal: se verificó en 390px.
- El titular escala solo con `clamp()`: mínimo 36,8px y máximo 78,4px.
- **[Corregir al implementar]** En el prototipo, "Entrar" sigue visible en móvil gracias a un `style="display:inline"` en línea que gana sobre la regla que oculta los enlaces. En React, hacerlo explícito: ocultar solo "Noticias", "Agenda" y "Mis planes" (por ejemplo con `hidden md:inline`) y dejar "Crear evento" y "Entrar" siempre visibles.
- Los breakpoints del prototipo (1080 y 820) no coinciden con los de Tailwind (1024 y 768). Se pueden usar los de Tailwind (`lg` = 1024, `md` = 768) y una regla adicional en 520px (por ejemplo `screens: { xs: '520px' }`) si el resultado visual es el mismo. No importa el número exacto; importa qué se reacomoda en cada etapa.

---

## 6. Estados interactivos

| Elemento | Reposo | Hover | Foco (teclado) | Activo / clic |
|---|---|---|---|---|
| Enlaces de navegación | `ink` | color `brand` | anillo global* | navega |
| Botón "Crear evento" | fondo `ink`, texto blanco | fondo `#33291F` | anillo global | (sin destino aún) |
| Botón de buscar (circular) | `brand` | `#BF3923` | anillo global | envía el formulario sin recargar |
| Botón "Encuentra tu plan" | blanco, texto `ink` | `#F3ECE6` | anillo global | desplaza a `#agenda` |
| Noticia destacada y de la lista | título `ink` | **el título** pasa a `brand` | anillo global | abre la noticia |
| "Ver toda la agenda" | `ink` con subrayado `ink` | texto y subrayado `brand` | anillo global | — |
| Botón "Me uno" | transparente, borde `line`, texto `ink` | fondo `ink`, texto blanco | anillo global | alterna `aria-pressed`. Si es `true`, el texto cambia a **"Vas"** y se mantiene oscuro. Otro clic lo devuelve a "Me uno". |
| Chip | blanco, borde `line` | borde `ink` | anillo global | selección única: el chip pulsado pasa a fondo `ink` con texto blanco y `aria-pressed="true"`, los demás quedan en `false`, y la grilla se filtra **sin recargar** |
| Tarjeta de evento | sin sombra | sube 3px y aplica la sombra 2 (200ms ease-out) | — | — |
| Botón guardar (corazón) | círculo blanco al 92%, corazón con contorno `ink` | — | anillo global | alterna `aria-pressed`. Si es `true`, el corazón se pinta **relleno** en `brand`. |
| Botón "Boletas" | `brand` | `#BF3923` | anillo global | abre la boletera en una pestaña nueva |

\* **Anillo de foco global:** `:focus-visible { outline: 3px solid #D9452F; outline-offset: 2px; }`. Aplica a todo; no quitarlo.

**Estado que hoy vive solo en la página.** En el prototipo, guardar, "Me uno" y el chip activo se pierden al recargar. En la versión real:
- Guardar y "Me uno" van a la API (requieren sesión).
- El filtro activo debería reflejarse en la URL (por ejemplo `?categoria=rumba`) para poder compartirlo.

---

## 7. Código base: qué reutilizar y qué crear

### 7.1 Estado actual del proyecto (verificado el 7 de octubre de 2026)

`npm install` funciona, pero **`npm run build` falla**. El proyecto React nunca ha compilado. El error es:

```
[postcss] src/styles/index.css: The `font-body` class does not exist.
```

El origen está en el plugin de `tailwind.config.js`:
- La clase `.input` usa `font-body`, que no existe.
- También usa `focus:ring-3`, que no es una clase estándar de Tailwind 3.
- Hace `@apply` de la clase de componente propia `badge` dentro de `addComponents`.
- Pone `textTransform` dentro de `fontSize`, una clave que Tailwind no admite.

Además, `src/styles/index.css` usa variables CSS que no existen (`var(--neutral-100)`, `var(--primary-500)`) y aplica `transition` a todos los elementos con el selector `*`.

### 7.2 Archivo por archivo

| Archivo | Acción | Detalle |
|---|---|---|
| `package.json` | **Reutilizar** | React 18, Vite 5, Tailwind 3 y lucide-react ya están. No hace falta agregar dependencias. |
| `vite.config.js`, `postcss.config.js` | **Reutilizar** sin cambios | — |
| `index.html` (raíz) | **Modificar** | Cambiar el enlace de Sora/Inter por el de Archivo/DM Sans (sección 3.2), agregar los `preconnect`, `theme-color` `#FBF7F3` y el favicon. |
| `src/main.jsx` | **Reutilizar** sin cambios | — |
| `tailwind.config.js` | **Reescribir** | Quitar toda la paleta primary/accent/neutral y el plugin `addComponents`. Definir en `theme.extend`: `colors` (los tokens de la sección 3.1, incluidos `avatar.c1` a `c6`), `fontFamily.display` y `fontFamily.ui`, `borderRadius` (`card: 18px`, `panel: 20px`, `hero: 28px`), `boxShadow` (`search` y `card-hover`) y `maxWidth.wrap: 1240px`. |
| `src/styles/index.css` | **Reescribir** | Dejar solo: las directivas `@tailwind`, el fondo y la tipografía de `body`, el `:focus-visible` global, la regla para ocultar la barra de los chips, `scroll-margin-top` en las secciones con ancla (ver sección 8) y el bloque de `prefers-reduced-motion`. Quitar el `*` con transición, la barra de desplazamiento rosa y las variables inexistentes. |
| `src/App.jsx` | **Modificar** | Componer `<Header/>`, `<main className="wrap">` con `<Home/>`, y `<Footer/>`. Cambiar `bg-neutral-50` por `bg-bg`. |
| `src/components/Navbar.jsx` | **Reemplazar** por `Header.jsx` | La estructura es distinta: buscador con forma de píldora y ciudad, enlaces de texto y sin menú hamburguesa (el diseño no tiene menú en móvil). Se puede reutilizar el import de lucide (`Search`). |
| `src/components/Hero.jsx` | **Reescribir** | No se conserva nada del diseño. Tiene imports sin usar (`MapPin`, `Music`, `Calendar`, `Zap`), filtros, buscador y cifras en inglés, todo descartado. |
| `src/components/EventCard.jsx` | **Reescribir** | Se puede conservar el patrón de estado local `liked`, que pasa a ser `saved` con `aria-pressed`. Cambia toda la anatomía: fecha, guardar sobre la imagen, amigos, precio con boletera y botón de enlace externo. |
| `src/pages/Home.jsx` | **Reescribir** | Pasa a componer `Hero`, `NewsSection` y `Agenda`. Eliminar la sección "¿Organizas eventos?", el pie de página interno y el botón "Ver más eventos". Mover los datos de ejemplo a `src/data/`. |
| `src/utils/` (vacía) | **Usar** | Para `formatCOP`. |
| `preview-demo.html` | **Conservar** como referencia visual | No forma parte del build. |
| `design-system.html`, `styles.css`, `script.js` | **Obsoletos** | No usar. Se pueden borrar cuando el dueño lo confirme. |

### 7.3 Componentes nuevos

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.jsx          (logo, SearchBar y nav)
│   │   ├── SearchBar.jsx       (input, ciudad y botón; props: city, onSearch)
│   │   └── Footer.jsx
│   ├── ui/
│   │   ├── Avatar.jsx          (props: initials?, color: 'c1'..'c6', size: 24|34|36, ring: 'hero'|'white'|'none')
│   │   ├── AvatarStack.jsx     (props: people[], max=3, size, ring; superposición -9px o -7px según el tamaño)
│   │   ├── SectionHeading.jsx  (props: eyebrow, title, aside: ReactNode)
│   │   ├── Chip.jsx            (props: pressed, onClick, children)
│   │   └── PillButton.jsx      (variantes: dark | light | brand | outline; tamaños sm | md | lg)
│   ├── home/
│   │   ├── Hero.jsx            (HeroTag, HeroHeadline con lines[], CTA y FriendsProof)
│   │   ├── NewsSection.jsx     (NewsFeature, NewsItem y FriendsActivity)
│   │   ├── NewsFeature.jsx
│   │   ├── NewsItem.jsx
│   │   ├── FriendsActivity.jsx (lista de ActivityItem)
│   │   ├── ActivityItem.jsx    (avatar, texto con verbo, meta y JoinButton)
│   │   └── Agenda.jsx          (SectionHeading, CategoryChips, EventGrid y estado vacío)
│   └── events/
│       ├── EventCard.jsx
│       ├── DateBadge.jsx       (props: day, month)
│       ├── SaveButton.jsx      (props: title, saved, onToggle)
│       └── TicketButton.jsx    (props: price, url, provider; decide entre "Boletas ↗" y "Ver plan")
├── data/
│   ├── events.js               (los 8 eventos de la sección 4.5)
│   ├── news.js                 (las 4 noticias de la sección 4.3)
│   └── activity.js             (las 4 actividades de la sección 4.3)
└── utils/
    └── format.js               (formatCOP: 0 → "Gratis"; n → "$" + n.toLocaleString('es-CO'))
```

**Íconos.** Usar lucide-react, que ya está instalado y coincide con los SVG del prototipo:

| Ícono | Uso | Tamaño | Grosor de trazo |
|---|---|---|---|
| `Search` | lupa del buscador | 18px | 2 |
| `Search` | lupa del botón circular | 16px | 2.5 |
| `MapPin` | ciudad | 16px | 2 |
| `Heart` | guardar; relleno con `fill="currentColor"` cuando está activo | 18px | 2 |
| `ArrowUpRight` | botón "Boletas" | 13px | 2.5 |

**Modelo de datos sugerido para un evento.** Agrega los campos que el diseño necesita y que el prototipo no tiene:

```js
{
  id, title, category, categoryKeys: ['rumba','amigos'],
  startsAt: '2026-10-09T22:00:00-05:00',   // fecha y hora (el prototipo solo guarda el día)
  venue: 'Galería Café Libro', neighborhood: 'Zona T',
  priceFrom: 45000,                         // 0 = gratis
  provider: 'TuBoleta', ticketUrl: 'https://…/evento-específico',
  promoter: '…',                            // requerido por la estrategia de información completa
  imageUrl, imageAlt, imageFallback: ['#E8A04F', '#B5372B'],
  friendsGoing: { count: 3, people: [{ initials:'LM', color:'c1' }, …] }
}
```

---

## 8. Detalles finos que se pueden perder

1. **Espacios entre los bloques del titular en JSX.** En el HTML, los tres `<span>` están en líneas separadas y el navegador los une con espacio. En JSX, los saltos de línea entre elementos **se eliminan**, y un lector de pantalla (o copiar el texto) leería "De la rumbadel viernesal concierto…". Agregar `{' '}` entre bloques, o renderizar `lines.map(...)` con espacio al final de cada línea.
2. **Mayúsculas por CSS, no en el texto.** Los textos van escritos normal ("De la rumba") y se transforman con `uppercase`. Así el lector de pantalla no los deletrea y el SEO lee bien.
3. **Etiqueta amarilla pegada al titular**, sin separación. El efecto de "collage" depende de eso.
4. **El bloque 2 del titular invierte el degradado** (rosa → durazno) y los otros dos van durazno → rosa.
5. **Bloque 3 con `max-width: 13ch`.** Es lo que fuerza "AL CONCIERTO / DEL SÁBADO" en dos líneas dentro de un solo bloque. Usar `width: fit-content`. No usar `display: inline` con `box-decoration-break`, porque daría dos rectángulos separados.
6. **Esquinas rectas** en la etiqueta amarilla y en los bloques del titular, en contraste con todo lo demás, que es redondeado.
7. **Borde de los avatares según el fondo:** en el hero, 2px del color `#140E10`, para que parezcan recortados; en la tarjeta, 2px blanco; en "Tu gente", sin borde.
8. **Avatares de la tarjeta sin iniciales.** Son solo círculos de color, a propósito: es una señal pequeña.
9. **La foto real del hero necesita un oscurecimiento.** Cuando se reemplacen los degradados por una foto, agregar un degradado oscuro en la parte inferior izquierda, por ejemplo `linear-gradient(to top right, rgba(20,14,16,.85), transparent 60%)`. Así el texto blanco de amigos sigue legible. Los bloques del titular tienen su propio fondo y no lo necesitan.
10. **La etiqueta "[Foto real de un evento en Bogotá]" no se publica.** Es una nota de diseño.
11. **Sin sesión no hay amigos.** Si el usuario no ha iniciado sesión, el hero y "Tu gente" no pueden mostrar amigos reales. Propuesta (**pendiente de aprobación del dueño**):
    - En el hero: "**Únete y mira qué planes tienen tus amigos**", con el botón "Entrar".
    - En el panel: mostrar el mismo panel con un llamado a iniciar sesión.

    **Nunca inventar nombres.**
12. **Plural en "amigos":** "1 amigo va" y "N amigos van". Si son 0, no se muestra la fila.
13. **Precio en formato colombiano:** "$45.000" (con punto de miles, generado con `toLocaleString('es-CO')`), con el prefijo "Desde " solo si es mayor que 0. Las cifras van con `tabular-nums`.
14. **Eventos gratis:** sin prefijo "Desde", el texto "Gratis" y el botón "Ver plan" **sin** flecha externa. La línea de la boletera muestra la fuente ("Idartes", "Entrada libre").
15. **La fila de compra va anclada abajo** (`margin-top: auto` en una columna flex). Así los botones quedan alineados entre tarjetas aunque los títulos ocupen distinto número de líneas.
16. **Todos los enlaces de "Boletas" apuntan hoy a `https://www.tuboleta.com`**, aunque la tarjeta diga Ticketmaster o Fever. **[Corregir al implementar]** Usar el `ticketUrl` de cada evento.
17. **A la tarjeta le falta la hora.** La estrategia del producto promete información completa (fecha, **hora**, lugar, **promotor** y boletera oficial), y es el diferencial frente a las boleteras. El prototipo solo muestra el día. **[Corregir al implementar]** Agregar la hora en la línea del lugar ("Vie 9 oct · 10:00 p. m. · Galería Café Libro"), o debajo de la fecha. El promotor puede ir solo en la página de detalle.
18. **El encabezado sticky tapa el título de la sección** al saltar a `#agenda` o `#noticias`. **[Corregir al implementar]** Agregar `scroll-margin-top: 96px` a esas secciones, y `scroll-behavior: smooth` en `html` respetando `prefers-reduced-motion`.
19. **Margen seguro en iPhone:** el encabezado usa `top: env(safe-area-inset-top, 0px)`, no `0`. Agregar `viewport-fit=cover` en el meta viewport si se quiere ocupar toda la pantalla.
20. **Barra oculta en los chips:** se oculta con `scrollbar-width: none` y `::-webkit-scrollbar { display: none }`. El `padding-bottom: 6px` deja aire para el foco del teclado.
21. **"Me uno" cambia a "Vas"** al activarse. No es solo un cambio de color.
22. **Los títulos usan `text-wrap: balance`** (h2, noticias y tarjetas) para evitar palabras sueltas en la última línea.
23. **Las etiquetas de sección y las categorías** llevan espaciado de letras de .1 a .12em en mayúsculas. Sin eso se ven apretadas.
24. **Textos en español en todas partes,** incluidos `aria-label`, `alt` y mensajes vacíos. No mezclar inglés.
25. **Sin emojis.** Solo íconos de línea de lucide.
26. **Contexto de fechas:** el texto "este finde" y las fechas del 9 al 11 de octubre son del prototipo. Con datos reales, "Este finde en Bogotá" debe calcular el viernes a domingo siguiente, y los textos de tiempo relativo ("Hace 3 horas", "Ayer") se generan desde la fecha de publicación.
27. **El encabezado no tiene borde ni sombra.** Al hacer scroll, las tarjetas pasan por debajo del fondo crema. Si se ve mal con contenido real, se puede agregar un borde de 1px `line` solo cuando hay scroll, pero no está en el diseño aprobado.
28. **Tema único.** No agregar `dark:`. Declarar `color-scheme: light` para que los controles nativos no se pongan oscuros.

---

## Orden de implementación sugerido

1. Arreglar el build: reescribir `tailwind.config.js` y `index.css` con los tokens nuevos, y comprobar que `npm run build` pasa.
2. Crear los componentes de `ui/` y `utils/format.js`.
3. Crear `Header` y `Footer` y armar `App.jsx`.
4. Crear `Hero`.
5. Crear `NewsSection` con `FriendsActivity`.
6. Crear `Agenda` con `EventCard` y el filtrado.
7. Comparar lado a lado con `preview-demo.html` en 1440, 1024, 768 y 390px, y aplicar los puntos marcados **[Corregir al implementar]**.
