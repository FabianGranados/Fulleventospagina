[← Índice del handoff](../README.md)

## 4.3 Bienvenida (`Bienvenida.dc.html`)

**Ruta propuesta:** `/` (con anclas internas `/#como-funciona`, `/#mapa`, `/#noticias`, `/#agenda`) · **Quién la ve:** visitante sin sesión (no hay avatar, ni datos de amigos, ni nombre de usuario). El prototipo no define qué pasa si alguien con sesión entra a `/` (por definir). · **Propósito:** es la puerta de entrada pública y el "marketplace nacional" (así la titula el lienzo: "1 · Bienvenida · Marketplace nacional"). Cuenta la propuesta de valor (descubrir planes, ver quién va, armar parche), muestra el mapa y la agenda de "este finde" de toda Colombia sin registrarse, y empuja a crear la cuenta.

> Ficha técnica del archivo: `<html lang="es">`, `<title>Fulleventos Colombia</title>`, vista previa del lienzo de 1280 × 4440 (`data-props='{"$preview":{"width":1280,"height":4440}}'`). Es el archivo con el que abre el lienzo (`canvas.json` → `"launch": {"file": "Bienvenida.dc.html"}`). No tiene `<meta name="viewport">` (ver H35). En Chromium no hubo errores de consola.

### Navegación de entrada y salida

**Entradas a esta pantalla**

| Desde | Elemento | Notas |
|---|---|---|
| Registro (`Registro.dc.html:23`) | Logo "fulleventos" | Es el único enlace del prototipo que vuelve a Bienvenida. En las otras 6 pantallas el logo lleva a `Main.dc.html` (inicio con sesión). |
| La propia Bienvenida (`:24`) | Logo "fulleventos" | Se enlaza a sí misma (recarga la página). |
| Lienzo de diseño | Archivo de arranque | `canvas.json` abre primero esta pantalla. |

**Salidas desde esta pantalla** (todos los enlaces y botones en orden de aparición)

| Elemento | Destino en el prototipo | Ruta propuesta | Notas |
|---|---|---|---|
| Logo "fulleventos" (encabezado) | `Bienvenida.dc.html` | `/` | Recarga la landing. |
| Campo "¿Qué plan buscas?" | Ninguno | `/buscar?q=` (pantalla por diseñar, H41) | No tiene lógica: escribir y pulsar Enter no hace nada (no hay `<form>`). |
| Selector de ciudad (`select name="ciudad"`) | Misma página | — | Cambia el filtro de ciudad de la sección Agenda (estado `city`), sin desplazar la página ni anunciar nada. |
| Botón redondo "Buscar" (lupa) | Ninguno | `/buscar?q=&ciudad=` | Clic muerto (H38). |
| "Cómo funciona" (nav) | `#como-funciona` | `/#como-funciona` | Salto instantáneo; la sección queda pegada arriba bajo el encabezado fijo: a 390 px el eyebrow y el h2 quedan tapados (encabezado de 215 px); a 1280 px solo se tapan los 6 px superiores del eyebrow (eyebrow en y = 72, encabezado de 78 px). Medido. |
| "Mapa" + insignia "Nuevo" (nav) | `Mapa.dc.html` | `/mapa` | Abre la versión con sesión del mapa (H33). |
| "Agenda" (nav) | `#agenda` | `/#agenda` | Ojo: lleva a la sección de esta página, NO a la pantalla Agenda. |
| "Entrar" (nav) | `Main.dc.html` | Debe ir a la pantalla "Entrar" (por diseñar, H12/H33), p. ej. `/entrar` | Hoy entra directo al feed de Camila sin iniciar sesión. |
| "Crear cuenta" (nav, botón negro) | `Registro.dc.html` | `/registro` | |
| "Crear mi cuenta gratis" (héroe) | `Registro.dc.html` | `/registro` | |
| "Ver la agenda sin registrarme" (héroe) | `#agenda` | `/#agenda` | |
| "Abrir el mapa de eventos" (bloque mapa) | `Mapa.dc.html` | `/mapa` | |
| 11 pines del mini-mapa | `Mapa.dc.html` (todos el mismo) | `/mapa?ciudad=<id>` (H42, H60) | Hoy no pasan la ciudad: el Mapa abre en "Toda Colombia". |
| Noticia destacada (tarjeta completa) | `Evento.dc.html` | Por definir (no existe pantalla de noticia) | Abre el evento de salsa, que no tiene nada que ver (H36). |
| 3 noticias de la lista | `Evento.dc.html` | Por definir | Ídem. |
| "Ver en el mapa" (cabecera Agenda) | `Mapa.dc.html` | `/mapa?ciudad=<ciudad elegida>` | No pasa la ciudad elegida en los chips. |
| "Ver toda la agenda" | `Agenda.dc.html` | `/agenda` (versión pública, H33) | Hoy abre "Agenda para ti" con el avatar de Camila. |
| Chips de ciudad (12) y de categoría (8) | Misma página | — | Filtran la grilla. |
| Corazón "Guardar …" de cada tarjeta | Misma página | — | Alterna guardado local; no pide cuenta. |
| Título de cada tarjeta de evento | `Evento.dc.html` (todos el mismo) | `/evento/:slug` | H36. |
| "Comprar" / "Ver plan" de cada tarjeta | `Evento.dc.html` (todos el mismo; `href: 'Evento.dc.html'` en `:409`) | `/evento/:slug` | H36, H1. |
| "Ver N planes más" / "Ver menos planes" | Misma página | — | Expande/contrae la grilla. |
| "Ver todos los planes del país" (estado vacío) | Misma página | — | Limpia filtros. |
| "Continuar con Google" (bloque Únete) | `Registro.dc.html` | `/registro` (con OAuth real, H12) | No pasa el método elegido: cae en el paso 1 de Registro, que vuelve a ofrecer "Continuar con Google". |
| "Continuar con mi celular" | `Registro.dc.html` | `/registro` (con OTP, H12) | No pasa el método elegido. Ojo: el paso 1 de Registro NO tiene un botón "celular"; ofrece "Continuar con Google" y, "o con tus datos", los campos "Nombre", "Celular o correo" y "Barrio o localidad". |
| "Entrar" (bloque Únete) | `Main.dc.html` | Pantalla "Entrar" (por diseñar) | Igual que el "Entrar" del encabezado. |
| Pie de página | Sin enlaces | — | H5 exige enlaces legales. |

### Estructura sección por sección

#### 0. Contenedor raíz, fuentes y estilos globales

- **Layout:** un `div` raíz con `min-height: 100vh; background: #FBF7F3; color: #17120F; font-family: 'DM Sans', system-ui, sans-serif; font-size: 16px; line-height: 1.5`. Dentro: `header` (fijo), `main` y `footer`. El `main` mide `max-width: 1240px; margin: 0 auto; padding: 8px 24px 0` (caja de contenido; con el padding, el ancho total máximo es 1288 px). El ancho útil es `min(ancho de ventana − 48, 1240)`: 342 px a 390, 720 px a 768, 1232 px a 1280. El margen lateral es 24 px en TODOS los anchos (no baja a 16 px en celular).
- **Fuentes (Google Fonts, `display=swap`, con `preconnect` a fonts.googleapis.com):** `Archivo` pesos 800 y 900 (títulos, etiquetas amarillas, números) y `DM Sans` con eje óptico `opsz 9..40` en pesos 400, 500 y 700 (todo lo demás). No se cargan otros pesos: no usar 600.
- **CSS global del `<helmet>` (exacto):**
  ```css
  body{margin:0;background:#FBF7F3}
  a{color:#17120F;text-decoration:none}a:hover{color:#C23A24}
  button{font-family:inherit;cursor:pointer}
  input,select{font-family:inherit}
  ```
  No hay `@media`, `@container`, `:focus-visible`, `transition`, `animation` ni `prefers-reduced-motion` en este archivo. Todo lo demás son estilos en línea.
- **Origen / reutilización:** los tokens vienen del código base del cliente (`diseno/referencia/preview-demo.html`, `:root`): `--bg #FBF7F3`, `--surface #FFFFFF`, `--ink #17120F`, `--muted #6E6259`, `--line #EAE1D8`, `--brand #D9452F`, `--brand-hover #BF3923`, `--yellow #F6DC6A`, `--peach #F3B27E`, `--pink #EE93BC`, `--hero #140E10`, `--display 'Archivo', 'Arial Black', 'Helvetica Neue', sans-serif`, `--ui 'DM Sans', system-ui, -apple-system, 'Segoe UI', sans-serif`. El prototipo añade `#C23A24` como rojo de acción (botón "Buscar", CTA de tarjetas, eyebrows, categorías, antetítulos, corazón guardado y `a:hover`; en esta pantalla NO hay estilo de foco, en Evento y Mapa sí se usa para el foco) y deja `#D9452F` como color de interfaz solo para el logo (además aparece como color de degradado: `bg1` de e3 y `rgba(217,69,47,.8)` en la imagen de la noticia destacada); también usa `#A3A8F0` (lila), `#B9E07A` (verde), `#8FD3D0` (aguamarina), `#D8CEC6` (texto claro sobre oscuro) y `#F3ECE5` (fondo de contador). Contrastes medidos: blanco sobre `#C23A24` = 5,35:1; blanco sobre `#D9452F` = 4,34:1 (no sirve para texto pequeño); `#C23A24` sobre `#FBF7F3` = 5,02:1; `#6E6259` sobre `#FBF7F3` = 5,54:1 y sobre blanco 5,91:1; `#D8CEC6` sobre `#140E10` = 12,33:1.

#### 1. Encabezado fijo (header)

- **Layout:** `<header>` con `position: sticky; top: 0; z-index: 5; background: #FBF7F3`. Sin borde ni sombra (al hacer scroll no hay línea que lo separe). Contenedor interno: `max-width: 1240px; margin: 0 auto; padding: 14px 24px; display: flex; flex-wrap: wrap; align-items: center; gap: 12px 24px`. Altura medida: 78 px (≥ 1180 px de ancho, una fila), 134 px (650–1179 px), 184 px (554–649 px), 215 px (< 554 px).
- **Contenido en orden:**
  1. **Logo** `<a>` con el texto exacto "fulleventos" (minúsculas): DM Sans 700, `1.6rem` (25,6 px), `letter-spacing: -0.03em`, color `#D9452F`, line-height 1.5 → caja de 128 × 38 px. No cambia de color al pasar el mouse (su color en línea gana al `a:hover`).
  2. **Buscador** `div role="search"`: `flex: 1 1 300px; max-width: 520px; display: flex; align-items: center; background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 999px; padding: 4px 4px 4px 18px; gap: 10px`. Mide 544 × 50 px cuando alcanza su máximo (520 + padding + borde). NO tiene `min-width: 0` (causa del desborde en celular, H8). Contiene:
     - Ícono lupa 18 × 18 (`viewBox 0 0 24 24`, `fill="none"`, `stroke="#6E6259"`, `stroke-width="2"`, `stroke-linecap="round"`, `aria-hidden`): `<circle cx="11" cy="11" r="7">` + `<path d="m20 20-3.5-3.5">`. `flex-shrink: 0`.
     - `<input type="search" placeholder="¿Qué plan buscas?" aria-label="Buscar planes">`: `flex: 1; min-width: 0; border: 0; outline: 0; background: transparent; font-size: .95rem` (15,2 px), color `#17120F`. Placeholder con el gris por defecto del navegador (medido `#757575`, 4,61:1 sobre blanco).
     - `<label>` del selector: `display: flex; align-items: center; gap: 4px; padding-left: 12px; border-left: 1px solid #EAE1D8; font-size: .9rem; white-space: nowrap; flex-shrink: 0`. Dentro: ícono pin 16 × 16 (`stroke="currentColor"` → sale `#17120F`, `stroke-width 2`, `linecap round`): `<path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z">` + `<circle cx="12" cy="10" r="2.5">`; un `<span>` oculto visualmente con el texto "Ciudad" (`position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap`); y el `<select name="ciudad">`: `height: 40px; max-width: 8.6em; border: 0; background: transparent; font-size: .9rem` (14,4 px), `font-weight: 500`, color `#17120F`, `cursor: pointer`, flecha nativa del sistema (`appearance: auto`). Ancho medido 122 px. Opciones exactas (valor = texto): `all` = "Toda Colombia", `bogota` = "Bogotá", `medellin` = "Medellín", `cali` = "Cali", `barranquilla` = "Barranquilla", `cartagena` = "Cartagena", `santamarta` = "Santa Marta", `bucaramanga` = "Bucaramanga", `pereira` = "Pereira", `villavicencio` = "Villavicencio", `pasto` = "Pasto", `leticia` = "Leticia".
     - Botón `type="button" aria-label="Buscar"`: 40 × 40, `border-radius: 50%`, sin borde, fondo `#C23A24`, color `#FFFFFF`, `display: grid; place-items: center; flex-shrink: 0`. Ícono lupa 16 × 16 con `stroke-width 2.5` en blanco.
  3. **Navegación** `<nav aria-label="Principal">`: `margin-left: auto; display: flex; flex-wrap: wrap; align-items: center; gap: 8px 20px; font-size: .92rem` (14,72 px), `font-weight: 500`. Ancho total 506 px en una línea. Enlaces en orden:
     - "Cómo funciona" (`#como-funciona`).
     - "Mapa" + insignia "Nuevo" (`Mapa.dc.html`): el enlace es `display: inline-flex; align-items: center; gap: 6px`. Insignia: `background: #F6DC6A; color: #17120F; border-radius: 999px; padding: 1px 7px; font-size: .68rem` (10,88 px), `font-weight: 700; line-height: 1.4` → 48 × 17 px. La palabra "Nuevo" NO cambia de color al hover (color en línea); "Mapa" sí.
     - "Agenda" (`#agenda`).
     - "Entrar" (`Main.dc.html`) en `font-weight: 700`.
     - "Crear cuenta" (`Registro.dc.html`): `background: #17120F; color: #FFFFFF; border-radius: 999px; padding: 11px 18px; font-weight: 700` → 131 × 44 px.
- **Datos dinámicos:** el `<select>` muestra `value="{{city}}"` (estado `city`, inicial `'all'`) y está sincronizado en ambos sentidos con los chips de ciudad de la Agenda. `onChange` lee `ev.target.value` y, si no está vacío, hace `setState({ city: valor, showAll: false })`.
- **Origen / reutilización:** del código base: `.top` (sticky, fondo `--bg`), `.logo`, `.search` (allí era `<form role="search">` con `onsubmit` prevenido, `padding 5px 5px 5px 18px`, sombra `0 1px 2px rgba(23,18,15,.04)`, `max-width 480px`, botón `.go` de 38 px en `--brand` con hover `#BF3923`, placeholder `#9A8E85`), `.nav` y `.btn-dark` (hover `#33291F`). El prototipo cambió: ciudad fija "Bogotá" → `<select>` con 12 opciones; nav "Noticias / Agenda / Mis planes / Crear evento / Entrar" → "Cómo funciona / Mapa Nuevo / Agenda / Entrar / Crear cuenta" (para visitante); quitó la sombra del buscador y los hover.

#### 2. Héroe "Arma tu parche" (`<section aria-label="Bienvenida">`)

- **Layout:** `position: relative; border-radius: 28px; overflow: hidden; color: #FFFFFF; padding: 56px clamp(22px, 5vw, 64px) 52px; min-height: 520px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: center`. Fondo exacto:
  ```css
  background: radial-gradient(circle at 74% 30%, rgba(214,140,70,.55) 0, transparent 22%),
              radial-gradient(circle at 92% 78%, rgba(190,70,80,.45) 0, transparent 26%),
              radial-gradient(circle at 60% 92%, rgba(230,170,80,.25) 0, transparent 18%),
              radial-gradient(ellipse at 8% 40%, rgba(70,30,80,.55) 0, transparent 45%),
              #140E10;
  ```
  Queda 8 px debajo del encabezado (padding superior del `main`). Medidas: 1232 × 693 px a 1280; 720 × 562 a 768; 342 × 677 a 390 (el contenido supera los 520 px mínimos en los tres anchos). Padding lateral medido: 64 px (1280), 38,4 px (768), 22 px (390).
- **Contenido en orden:**
  1. **Nota de foto** (marcador): texto exacto "[Foto real de un evento en Colombia]". `position: absolute; top: 20px; right: 20px; font-size: .72rem` (11,52 px), color `rgba(255,255,255,.8)`, `border: 1px solid rgba(255,255,255,.35); border-radius: 999px; padding: 4px 10px`. Indica que el degradado se reemplaza por una foto real.
  2. **Etiqueta amarilla** texto fuente "Arma tu parche" (se ve "ARMA TU PARCHE"): `align-self: flex-start; background: #F6DC6A; color: #17120F; font-family: 'Archivo'; font-weight: 800; font-size: 1.05rem` (16,8 px), `text-transform: uppercase; padding: 5px 12px; margin-left: clamp(0px, 3vw, 44px)` (38,4 px a 1280; 23 px a 768; 11,7 px a 390). Sin margen inferior: queda pegada encima del h1. 181 × 35 px.
  3. **`<h1>`** en tres bloques: `margin: 0; font-family: 'Archivo'; font-weight: 900; text-transform: uppercase; letter-spacing: -0.035em; line-height: .98; font-size: clamp(2.3rem, 5.8vw, 4.9rem)` (36,8 px hasta 634 px de ancho; 44,54 px a 768; 74,24 px a 1280; tope 78,4 px desde 1352 px), color `#17120F`, `display: flex; flex-direction: column; align-items: flex-start`. Cada línea es un `<span>` con `padding: .1em .22em .06em` y fondo degradado; los bloques quedan pegados uno sobre otro, sin separación:
     - "De la rumba" → `background: linear-gradient(90deg, #F3B27E, #EE93BC)`; sin margen.
     - "del viernes" → `linear-gradient(90deg, #EE93BC, #F3B27E)` (invertido); `margin-left: clamp(0em, 2vw, 1.15em)` (25,6 px a 1280; 15,4 px a 768; 7,8 px a 390).
     - "al concierto del sábado" → `linear-gradient(90deg, #F3B27E, #EE93BC)`; `margin-left: clamp(0em, 1vw, .4em)` (12,8 / 7,7 / 3,9 px); `max-width: 13ch` → se parte en 2 líneas ("AL CONCIERTO / DEL SÁBADO") en tableta y escritorio, y en 3 ("AL / CONCIERTO / DEL SÁBADO") a 390 px. El degradado pinta el bloque completo, no línea por línea.
  4. **Bajada** `<p>`: texto exacto "Descubre planes en Bogotá, Medellín, Cali, Barranquilla y todo el país, mira quién de tus amigos va y arma parche para no llegar solo." `margin: 26px 0 0; max-width: 48ch; font-size: 1.1rem` (17,6 px), color `rgba(255,255,255,.9)`, line-height 1.5.
  5. **Fila de acciones**: `display: flex; flex-wrap: wrap; align-items: center; gap: 16px 22px; margin-top: 26px`.
     - "Crear mi cuenta gratis" (`Registro.dc.html`): `background: #FFFFFF; color: #17120F; border-radius: 999px; padding: 15px 26px; font-weight: 700` → 227 × 54 px.
     - "Ver la agenda sin registrarme" (`#agenda`): color `#FFFFFF`, `font-weight: 700; border-bottom: 2px solid #FFFFFF; padding-bottom: 1px` (subrayado grueso hecho con borde). 228 × 27 px.
  6. **Prueba social**: `display: flex; align-items: center; gap: 10px; font-size: .88rem` (14,08 px), `line-height: 1.3`, color `rgba(255,255,255,.88)`, `margin-top: 26px`.
     - 4 círculos decorativos sin texto: `width/height: 34px; border-radius: 50%; border: 2px solid #140E10` (caja real 38 × 38 porque no hay `box-sizing`), fondos en orden `#F3B27E`, `#A3A8F0`, `#EE93BC`, `#B9E07A`; del segundo en adelante `margin-left: -9px` (se enciman). El contenedor tiene `flex-shrink: 0`.
     - Texto exacto: "**[N] personas** en **[N] ciudades** ya tienen plan este finde" (los `<b>` en `#FFFFFF`, peso 700).
- **Datos dinámicos:** ninguno en el prototipo. "[N] personas" y "[N] ciudades" son marcadores literales; en producción deben salir de datos reales (fuente por definir; no inventar cifras).
- **Origen / reutilización:** `.hero`, `.photo-note`, `.tag`, `.headline` y `.btn-light` del código base (allí la etiqueta tenía `letter-spacing: .01em` y `margin-left: 44px` fijo; las líneas 2 y 3 tenían `margin-left` fijos de `1.15em` y `.4em`; el botón decía "Encuentra tu plan"; la prueba social era "Laura, Andrés y **12 amigos más** tienen plan este finde" con iniciales en los avatares, y `.btn-light:hover` era `#F3ECE6`). El prototipo agregó la bajada, el segundo CTA, cambió el texto social a cifras genéricas para visitante y quitó las iniciales.

#### 3. Cómo funciona (`<section id="como-funciona">`)

- **Layout:** `padding-top: 72px`. Rejilla `display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px`. Resultado: 1 columna < 548 px; 2 columnas de 548 a 807 px (a 768 queda 2 + 1, H61); 3 columnas ≥ 808 px (397 px cada una a 1280).
- **Contenido en orden:**
  1. **Eyebrow** `<p>` texto fuente "Cómo funciona" (se ve "CÓMO FUNCIONA"): `margin: 0 0 6px; font-size: .74rem` (11,84 px), `font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #C23A24`.
  2. **`<h2>`** "Planes mejores, con tu gente": `margin: 0 0 28px; font-family: 'Archivo'; font-weight: 900; font-size: clamp(1.7rem, 3.2vw, 2.4rem)` (27,2 px hasta 850 px; 38,4 px desde 1200 px), `letter-spacing: -0.03em; line-height: 1.05`. Sin mayúsculas forzadas. A 390 px ocupa 2 líneas.
  3. **Tres tarjetas** (`div`): `background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 20px; padding: 24px; display: flex; flex-direction: column; gap: 10px`. Cada una:
     - Cuadro numerado `<span>` 48 × 48, `border-radius: 14px`, `display: grid; place-items: center; font-family: 'Archivo'; font-weight: 900; font-size: 1.3rem` (20,8 px), color heredado `#17120F`. Fondos: "1" `#F6DC6A`, "2" `#EE93BC`, "3" `#A3A8F0`.
     - `<h3>` `margin: 0; font-size: 1.15rem` (18,4 px), DM Sans 700 (peso por defecto del h3), line-height 1.5.
     - `<p>` `margin: 0; color: #6E6259`, 16 px.
     - Textos exactos:
       - 1 · "Descubre" — "Rumba, conciertos, fútbol, teatro y planes gratis de todo el país, en un solo lugar. Búscalos por ciudad o explóralos en el mapa."
       - 2 · "Mira quién va" — "Sigue a tus amigos y ve a qué eventos van, qué guardan y qué recomiendan."
       - 3 · "Arma parche" — "Crea un grupo para ir juntos o únete a uno abierto, y compra tus boletas sin salir de Fulleventos." (promesa a corregir, H1).
- **Datos dinámicos:** ninguno.
- **Origen / reutilización:** bloque NUEVO (no existe en el código base). Reutiliza `.eyebrow` y `h2` del código base (allí el h2 tenía `text-wrap: balance`).

#### 4. Mapa de eventos (`<section id="mapa" aria-labelledby="mapa-titulo">`)

- **Layout:** sección con `padding-top: 72px`. Caja oscura interna: `position: relative; overflow: hidden; border-radius: 28px; color: #FFFFFF; padding: clamp(28px, 5vw, 56px); display: flex; flex-wrap: wrap; align-items: center; gap: 36px 48px`. Fondo exacto:
  ```css
  background: radial-gradient(circle at 78% 18%, rgba(246,220,106,.16) 0, transparent 32%),
              radial-gradient(circle at 70% 88%, rgba(238,147,188,.18) 0, transparent 38%),
              radial-gradient(ellipse at 6% 30%, rgba(70,30,80,.5) 0, transparent 45%),
              #140E10;
  ```
  Dos hijos: columna de texto `flex: 1 1 340px; min-width: 0` y columna del mapa `flex: 1 1 280px; max-width: 400px; margin: 0 auto`. Van lado a lado desde 796 px (a 1280: texto 672 px + mapa 400 px, centrados en vertical); por debajo se apilan (texto arriba, mapa centrado debajo).
- **Contenido en orden (columna de texto):**
  1. **Etiqueta** "Nuevo · Mapa de eventos" (se ve "NUEVO · MAPA DE EVENTOS"): `display: inline-block; background: #F6DC6A; color: #17120F; font-family: 'Archivo'; font-weight: 800; font-size: .85rem` (13,6 px), `text-transform: uppercase; padding: 4px 10px; margin-bottom: 14px`.
  2. **`<h2 id="mapa-titulo">`** "Todo el país en un mapa" (se ve en mayúsculas): `margin: 0; font-family: 'Archivo'; font-weight: 900; font-size: clamp(1.8rem, 3.6vw, 2.8rem)` (28,8 → 44,8 px), `letter-spacing: -0.03em; line-height: 1.02; text-transform: uppercase`.
  3. **`<p>`** "De la costa al Amazonas: mira qué planes hay este finde en cada ciudad y a dónde va tu gente, estés donde estés." `margin: 14px 0 0; color: #D8CEC6; max-width: 46ch`.
  4. **Lista** `<ul>`: `list-style: none; margin: 22px 0 0; padding: 0; display: flex; flex-direction: column; gap: 12px; font-size: .95rem`. Cada `<li>`: `display: flex; align-items: center; gap: 12px`, con una baldosa de ícono `36 × 36; flex-shrink: 0; border-radius: 12px; background: rgba(255,255,255,.08); display: grid; place-items: center` y un ícono de 18 × 18 (`stroke="currentColor"`, `stroke-width 2`, `linecap round`, `linejoin round`):
     - Ícono pin en `#F6DC6A` (mismo trazo del pin del encabezado) — "Toca una ciudad y ve todos sus planes"
     - Ícono filtro en `#EE93BC` (`<path d="M4 6h16M7 12h10M10 18h4">`, tres líneas de largo decreciente) — "Filtra por rumba, conciertos, deporte o planes gratis"
     - Ícono dos personas en `#8FD3D0` (`<circle cx="9" cy="8" r="3.5">`, `<path d="M2.5 20a6.5 6.5 0 0 1 13 0">`, `<path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a6.5 6.5 0 0 1 3.5 5.5">`) — "Mira a qué van tus amigos, en tu ciudad o de viaje"
  5. **Fila de acción**: `display: flex; flex-wrap: wrap; align-items: center; gap: 14px 20px; margin-top: 28px`.
     - Botón-enlace "Abrir el mapa de eventos" (`Mapa.dc.html`): `display: inline-flex; align-items: center; gap: 10px; background: #FFFFFF; color: #17120F; border-radius: 999px; padding: 15px 26px; font-weight: 700` → 275 × 54 px. Ícono mapa plegado 18 × 18 (`stroke 2`, round/round): `<path d="M9 4 3 6.5V20l6-2.5 6 2.5 6-2.5V4l-6 2.5z">` + `<path d="M9 4v13.5M15 6.5V20">`.
     - Resumen `<span>` `font-size: .88rem; color: #D8CEC6`: "**{{mapTotal}}** este finde en **{{mapCities}}**" con los `<b>` en `#FFFFFF` → se ve "**19 planes** este finde en **11 ciudades**". A 390 px baja a su propia línea.
- **Contenido en orden (columna del mapa):**
  1. **Contenedor del mini-mapa** `div role="group" aria-label="Mapa de Colombia con los planes de este finde por ciudad"`: `position: relative; width: 100%; aspect-ratio: 130 / 175; container-type: inline-size`. Mide 400 × 538 a 768 y 1280; 286 × 385 a 390; se encoge a 280 px justo después de pasar a dos columnas (796 px).
  2. **SVG de fondo** `viewBox="0 0 130 175"`, `aria-hidden="true" focusable="false"`, `position: absolute; inset: 0; width: 100%; height: 100%`:
     - Retícula punteada: `<path d="M0 43.75H130M0 87.5H130M0 131.25H130M32.5 0V175M65 0V175M97.5 0V175" fill="none" stroke="#FFFFFF" stroke-opacity=".07" stroke-width=".4" stroke-dasharray="1 2">`.
     - Silueta de Colombia: `fill="#2B2124" stroke="#F3B27E" stroke-opacity=".6" stroke-width=".6" stroke-linejoin="round"`, trazado exacto:
       ```
       M21.4 43.2 L26.5 46.0 L27.5 49.5 L27.2 45.5 L30.7 41.5 L38.2 36.0 L39.2 34.5 L38.5 30.0 L39.5 26.0 L42.5 22.0 L46.5 20.0 L51.0 19.0 L52.9 17.6 L58.0 17.0 L65.9 14.6 L70.0 12.0 L73.3 8.0 L78.3 5.4 L81.0 8.0 L81.7 11.5 L75.5 14.5 L72.5 19.0 L66.5 25.5 L64.5 33.0 L61.5 39.0 L67.5 43.5 L71.0 47.0 L70.3 51.0 L73.0 56.0 L83.0 59.5 L94.0 59.2 L101.0 60.5 L120.2 68.0 L117.0 78.0 L116.5 86.0 L119.0 91.3 L123.0 102.0 L124.0 111.0 L126.3 118.3 L116.0 119.0 L113.0 113.0 L101.0 112.0 L96.0 117.5 L94.5 123.5 L94.5 131.0 L99.0 137.5 L100.5 144.0 L97.0 152.0 L95.5 163.0 L95.6 172.2 L91.0 168.0 L92.0 158.0 L84.0 154.0 L75.0 153.0 L66.0 154.5 L60.0 151.0 L53.0 142.0 L47.2 132.0 L41.0 129.0 L32.0 127.0 L26.0 126.0 L18.5 121.5 L14.0 118.0 L6.5 115.5 L7.0 112.0 L9.0 108.0 L16.0 104.3 L20.0 98.0 L23.0 91.2 L21.0 85.0 L20.5 75.0 L20.5 68.0 L17.0 60.0 L17.5 55.0 L20.5 50.5 L22.0 47.0 Z
       ```
  3. **11 pines** (uno por ciudad, enlaces `<a href="Mapa.dc.html">`): `position: absolute; left: {left}%; top: {top}%; transform: translate(-50%, -50%); box-sizing: border-box; width/height: clamp(20px, 6.5cqw, 26px); border-radius: 50%; border: 2px solid #140E10; background: #F6DC6A; color: #17120F; display: grid; place-items: center; font-family: 'Archivo'; font-weight: 900; font-size: clamp(.64rem, 2.9cqw, .78rem); line-height: 1; box-shadow: 0 0 0 4px rgba(246,220,106,.2)` (halo amarillo). Contenido: el número de planes. Tamaño medido (crece de forma continua con el ancho del mini-mapa): 20 px con mapa ≤ 307 px (a 390 px de pantalla, mapa de 286 px; y en dos columnas solo entre 796 y ~857 px); entre ~858 y ~1062 px de pantalla crece gradualmente (21,3 px a 900; 24,2 px a 1000; 25,6 px a 1050); 26 px con mapa de 400 px (≥ ~1062 px en dos columnas, y apilado entre ~504 y 795 px; apilado por debajo de 504 px el mapa mide menos de 400 y el pin queda entre 20 y 26, p. ej. 24 px a 473). La cifra del pin: `clamp(.64rem, 2.9cqw, .78rem)` → 11,6 px con mapa de 400; 10,24 px mínimo. Cada pin lleva `aria-label` y `title` (tooltip nativo).
     - **Rótulo de ciudad** (`<span aria-hidden="true">` dentro del pin): `position: absolute; top: 50%; left: {labelLeft}; right: {labelRight}; margin-top: {dy}px; transform: translateY(-50%); white-space: nowrap; font-family: 'DM Sans'; font-weight: 700; font-size: clamp(.62rem, 2.8cqw, .74rem)` (11,2 px con mapa de 400; 9,92 px mínimo), color `#FFFFFF`, `text-shadow: 0 0 3px #140E10, 0 0 6px #140E10`. A la derecha: `left: calc(100% + 6px); right: auto`; a la izquierda: `left: auto; right: calc(100% + 6px)`.
  4. **Leyenda** `<p>`: `margin: 14px 0 0; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: .8rem; color: #D8CEC6`, con un punto `12 × 12`, `border-radius: 50%`, `#F6DC6A`, y el texto "Número de planes este finde por ciudad".
- **Datos dinámicos:**
  - `planes(n) = n + (n === 1 ? ' plan' : ' planes')`.
  - `mapTotal = planes(all.length)` → "19 planes".
  - `mapCities = activeCities + ' ciudades'`, con `activeCities` = ciudades con al menos 1 evento → "11 ciudades" (sin singular: con 1 ciudad diría "1 ciudades").
  - `mapPins`: las 11 ciudades ordenadas por `top` ascendente (de norte a sur; ese es el orden del DOM y del Tab). Para cada una: `count = countBy[id] || 0`; `aria = 'Ver planes en ' + nombre + ' (' + planes(n) + ' este finde)'` (ej. "Ver planes en Bogotá (6 planes este finde)"); `title = nombre + ': ' + planes(n) + ' este finde'` (ej. "Bogotá: 6 planes este finde"); lado y desplazamiento vertical del rótulo según la tabla `labelPos` (ver Datos de ejemplo).
- **Origen / reutilización:** bloque NUEVO (no existe en el código base). El mini-mapa es una versión reducida del mapa de `Mapa.dc.html` (mismos ids de ciudad); crear un componente `MiniMapaColombia` que reciba ciudades con conteo.

#### 5. Noticias de la escena (`<section id="noticias">`)

- **Layout:** `padding-top: 72px`. Cabecera `display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 16px; margin-bottom: 24px` (título a la izquierda, nota a la derecha; la nota baja debajo del título por debajo de 484 px). Cuerpo `display: flex; flex-wrap: wrap; gap: 24px` con dos hijos: noticia destacada `flex: 1.25 1 320px` y lista `flex: 1 1 280px; display: flex; flex-direction: column`. Lado a lado desde 674 px (a 1280: 659 + 549 px; a 768: 374 + 322 px).
- **Contenido en orden:**
  1. Eyebrow "Lo que se mueve" (mismo estilo del eyebrow de Cómo funciona).
  2. `<h2>` "Noticias de la escena" (mismo estilo del h2 de Cómo funciona pero `margin: 0`).
  3. Nota "Contenido de ejemplo": `font-size: .78rem; color: #6E6259`.
  4. **Noticia destacada** `<article>`: `background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 20px; overflow: hidden`. Todo es un enlace `<a href="Evento.dc.html" style="display: block">`:
     - Imagen `div role="img" aria-label="[Imagen de la noticia]"` con `aspect-ratio: 16 / 9` y fondo `radial-gradient(circle at 30% 35%, rgba(246,220,106,.85) 0, transparent 30%), radial-gradient(circle at 75% 65%, rgba(217,69,47,.8) 0, transparent 40%), #2A1A16`.
     - Cuerpo `padding: 18px 20px 20px`:
       - Antetítulo "Cartel confirmado · Bogotá": `font-size: .7rem` (11,2 px), `font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: #C23A24`.
       - `<h3>` "El festival de noviembre en el Simón Bolívar revela su cartel completo": `margin: 4px 0 8px; font-family: 'Archivo'; font-weight: 800; font-size: 1.35rem` (21,6 px), `letter-spacing: -0.02em; line-height: 1.12`.
       - `<p>` "Tres escenarios, más de 40 artistas y entrada por días. La preventa abre este jueves.": `margin: 0; color: #6E6259; font-size: .93rem`.
       - `<p>` "Hace 3 horas · 4 min de lectura": `margin: 10px 0 0; font-size: .8rem; color: #6E6259`.
  5. **Lista de 3 noticias**: cada una es `<a href="Evento.dc.html" style="display: block">` con antetítulo (mismo estilo), `<h4>` `margin: 2px 0 0; font-size: 1.02rem` (16,32 px), `line-height: 1.3`, DM Sans 700, y `<p>` de tiempo `margin: 6px 0 0; font-size: .8rem; color: #6E6259`. Separadores: la 1.ª tiene `padding: 0 0 16px; border-bottom: 1px solid #EAE1D8`; la 2.ª `padding: 16px 0; border-bottom: 1px solid #EAE1D8`; la 3.ª `padding: 16px 0` sin borde. Textos exactos en la tabla de Datos de ejemplo.
- **Datos dinámicos:** ninguno (texto fijo).
- **Origen / reutilización:** `.feature`, `.kicker`, `.meta`, `.news-list`, `.news-item` y `.sample` del código base (allí la imagen era 4/3, la rejilla era `grid` 1.25fr/1fr, el h3/h4 tenía `text-wrap: balance` y al hover del enlace el título se volvía `--brand`). El prototipo QUITÓ la columna "Tu gente" (actividad de amigos con botones "Me uno"), porque un visitante no tiene amigos; agregó la ciudad a cada antetítulo y cambió 2 noticias a otras ciudades.

#### 6. Agenda "Este finde en Colombia" (`<section id="agenda">`)

- **Layout:** `padding-top: 72px`. De arriba abajo: cabecera, fila de chips de ciudad, fila de chips de categoría, estado vacío (condicional), rejilla de tarjetas y botón "Ver más" (condicional).

##### 6.1 Cabecera
- **Layout:** `display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 16px; margin-bottom: 20px`. Título y enlaces en una fila desde 689 px; por debajo, los enlaces bajan debajo del título.
- **Contenido en orden:** eyebrow "Agenda"; `<h2>` "Este finde en Colombia" (estilo h2 claro, `margin: 0`; el texto NO cambia al elegir ciudad); grupo de enlaces `display: flex; flex-wrap: wrap; align-items: center; gap: 12px 20px`:
  - "Ver en el mapa" (`Mapa.dc.html`): `display: inline-flex; align-items: center; gap: 8px; height: 42px; box-sizing: border-box; border: 1px solid #17120F; border-radius: 999px; padding: 0 16px; font-size: .9rem; font-weight: 700`, ícono mapa plegado de 16 × 16 → 162 × 42 px.
  - "Ver toda la agenda" (`Agenda.dc.html`): `font-size: .9rem; font-weight: 700; border-bottom: 2px solid #17120F; padding-bottom: 1px`.

##### 6.2 Chips de ciudad (`div role="group" aria-label="Filtrar por ciudad"`)
- **Layout:** `display: flex; gap: 8px; overflow-x: auto; padding-bottom: 6px; margin-bottom: 8px`. El contenido mide 1604 px y nunca cabe (máximo útil 1240): siempre hay scroll horizontal; a 1280 quedan ocultos 372 px (Villavicencio, Pasto y Leticia) sin degradado ni flechas (H61). La barra de scroll es la nativa (no se oculta).
- **Contenido en orden:** 12 `<button>`: "Toda Colombia" y luego las 11 ciudades en el orden del arreglo `cities` (Bogotá, Medellín, Cali, Barranquilla, Cartagena, Santa Marta, Bucaramanga, Pereira, Villavicencio, Pasto, Leticia). Estilo de cada chip: `flex-shrink: 0; display: inline-flex; align-items: center; gap: 8px; height: 42px; border-radius: 999px; padding: 0 7px 0 15px` (asimétrico: el contador queda cerca del borde derecho), `font-size: .9rem; font-weight: 500; white-space: nowrap; border: 1px solid {border}; background: {bg}; color: {fg}`.
  - Solo "Toda Colombia" lleva antes el ícono pin de 16 × 16 (`stroke 2`, `linecap round`).
  - Nombre de la ciudad y luego el contador `<span>`: `min-width: 28px; height: 28px; box-sizing: border-box; padding: 0 8px; border-radius: 999px; display: inline-grid; place-items: center; font-size: .78rem; font-weight: 700; background: {countBg}; color: #17120F`.
  - Colores: sin presionar `bg #FFFFFF`, `fg #17120F`, `border #EAE1D8`, contador `#F3ECE5`; presionado `bg #17120F`, `fg #FFFFFF`, `border #17120F`, contador `#F6DC6A` (amarillo) con número `#17120F`.
- **Datos dinámicos:** `count` = 19 para "Toda Colombia" (`all.length`) y `countBy[ciudad]` para las demás. `aria-label = nombre + ', ' + planes(n)` (ej. "Toda Colombia, 19 planes", "Barranquilla, 1 plan"). `aria-pressed = 'true'|'false'` según `state.city`. Los contadores NO cambian con el filtro de categoría (siempre son el total de la ciudad).

##### 6.3 Chips de categoría (`div role="group" aria-label="Filtrar por categoría"`)
- **Layout:** `display: flex; gap: 8px; overflow-x: auto; padding-bottom: 6px; margin-bottom: 22px`. Contenido 916 px: hace scroll por debajo de 964 px de pantalla; desde ahí cabe completo.
- **Contenido en orden:** 8 `<button>` con texto exacto: "Todo", "Rumba", "Conciertos", "Planes con amigos", "Gratis este finde", "Comida", "Deporte", "Arte y teatro". Estilo: `flex-shrink: 0; height: 42px; border-radius: 999px; padding: 0 16px; font-size: .9rem; font-weight: 500; border: 1px solid {border}; background: {bg}; color: {fg}` (mismos colores de presionado/no presionado que los chips de ciudad; no llevan contador ni `aria-label`).
- **Datos dinámicos:** `aria-pressed` según `state.filter`. Reglas de filtrado: `'all'` = todo; `'amigos'` = eventos con al menos 1 parche abierto (`social[id][1] > 0`); el resto = el id está en `tags` del evento.

##### 6.4 Estado vacío (`<sc-if value="{{empty}}">`)
- **Layout:** `text-align: center; padding: 40px 16px; background: #FFFFFF; border: 1px dashed #EAE1D8; border-radius: 18px`. Aparece encima de la rejilla (que queda vacía). A 1280 mide 1232 × 164 px.
- **Contenido en orden:** `<p>` `margin: 0 0 14px; color: #6E6259` con `{{emptyMsg}}`; botón "Ver todos los planes del país": `height: 44px; border-radius: 999px; border: 1px solid #17120F; background: #FFFFFF; color: #17120F; padding: 0 20px; font-size: .9rem; font-weight: 700` (≈ 242 × 44 px).
- **Datos dinámicos:** `empty = ordered.length === 0`. Mensaje:
  - ciudad elegida y categoría ≠ "Todo": `'No hay planes de esta categoría en ' + ciudad + ' este finde.'` → ej. "No hay planes de esta categoría en Medellín este finde." (es el único caso alcanzable con los datos de ejemplo).
  - ciudad elegida y categoría "Todo": `'No hay planes en ' + ciudad + ' este finde.'` (inalcanzable hoy: todas las ciudades tienen ≥ 1).
  - "Toda Colombia": `'No hay planes en esta categoría este finde.'` (inalcanzable hoy: todas las categorías tienen ≥ 1 en el país).

##### 6.5 Rejilla y tarjeta de evento
- **Layout de la rejilla:** `display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 22px`. Columnas: 1 (< 570 px), 2 (570–841), 3 (842–1113), 4 (≥ 1114). Las tarjetas de una misma fila se estiran a la misma altura (a 1280: fila 1 de 425 px, fila 2 de 445 px).
- **Tarjeta** `<article>`: `background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 18px; overflow: hidden; display: flex; flex-direction: column`. Sin sombra, sin hover.
  1. **Imagen** `div`: `position: relative; aspect-ratio: 4 / 3; background: radial-gradient(circle at 70% 30%, {bg1} 0, transparent 55%), {bg2}` (290 × 217 a 1280; 347 × 260 a 768; 340 × 255 a 390).
     - **Fecha** `<span>`: `position: absolute; top: 12px; left: 12px; background: #FFFFFF; border-radius: 10px; padding: 5px 9px 4px; text-align: center; line-height: 1; min-width: 46px` (64 × 45 px). Dentro: `<b>` con el día `display: block; font-family: 'Archivo'; font-size: 1.25rem` (20 px), `font-weight: 900`; y `<span>` con "oct" (escrito fijo en minúsculas, se ve "OCT"): `font-size: .66rem` (10,56 px), `font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #6E6259`.
     - **Guardar** `<button aria-label="Guardar {título}" aria-pressed="…">`: `position: absolute; top: 10px; right: 10px; width: 44px; height: 44px; border-radius: 50%; border: 0; background: rgba(255,255,255,.94); display: grid; place-items: center; color: {saveColor}`. Ícono corazón 18 × 18 (`fill="{saveFill}"`, `stroke="currentColor"`, `stroke-width 2`, `stroke-linejoin round`): `<path d="M12 20s-7-4.4-9.2-8.6C1.3 8.4 3.2 5 6.6 5c2 0 3.4 1.1 4.4 2.5C12 6.1 13.4 5 15.4 5c3.4 0 5.3 3.4 3.8 6.4C19 15.6 12 20 12 20z">`. Sin guardar: color `#17120F`, relleno `none`. Guardado: color `#C23A24`, relleno `currentColor` (corazón rojo lleno).
  2. **Cuerpo** `div`: `padding: 14px 16px 16px; display: flex; flex-direction: column; flex: 1`.
     - Categoría `<span>` `{cat}` (se ve en mayúsculas): `font-size: .7rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: #C23A24`.
     - Título `<a href="Evento.dc.html">` `{t}`: `font-size: 1.05rem` (16,8 px), `font-weight: 700; line-height: 1.25; margin: 4px 0 6px`. Es un enlace, NO un encabezado.
     - Lugar `<span>` `font-size: .85rem; color: #6E6259`: "{v} · " + `<span style="color: #17120F; font-weight: 700">{ciudad}</span>` (ej. "Galería Café Libro · Zona T · **Bogotá**").
     - Línea social `<span>`: `display: flex; align-items: center; gap: 6px; font-size: .78rem; color: #6E6259; margin-top: 10px`, con ícono persona 14 × 14 (`stroke 2`, `linecap round`: `<circle cx="9" cy="8" r="3.5">` + `<path d="M2.5 20a6.5 6.5 0 0 1 13 0">`) y el texto `{social}`.
     - Fila de compra: `display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-top: auto; padding-top: 14px` (el `margin-top: auto` la pega al fondo, así los precios de una fila quedan alineados).
       - Precio `<span>` `font-weight: 700; font-size: .95rem`: `{priceLabel}` y debajo `<span style="display: block; font-weight: 400; font-size: .72rem; color: #6E6259">{b}</span>` (boletera / "Entrada libre" / entidad).
       - Botón-enlace `<a href="{href}" aria-label="{ctaAria}">{cta}</a>`: `display: inline-flex; align-items: center; gap: 6px; min-height: 44px; box-sizing: border-box; background: #C23A24; color: #FFFFFF; border-radius: 999px; padding: 11px 15px; font-size: .82rem` (13,12 px), `font-weight: 700; white-space: nowrap` (≈ 87 × 44 px). Sin ícono.
- **Datos dinámicos (fórmulas exactas):**
  - `matching = all.filter(e => matchCat(e) && (city === 'all' || e.city === city))`.
  - **Orden intercalado por ciudad** ("para que las primeras tarjetas muestren todo el país"): se agrupan los eventos por ciudad en el orden del arreglo `cities` y se toma por rondas el 1.º de cada ciudad, luego el 2.º, etc.; dentro de cada ciudad se respeta el orden del arreglo `all`. NO es orden cronológico. Con "Toda Colombia / Todo": e1, e7, e10, e12, e13, e14, e15, e16, e17, e18, e19, e2, e8, e11, e3, e9, e4, e5, e6.
  - `LIMIT = 8`: se ven `ordered.slice(0, 8)` salvo que `showAll` sea `true`.
  - `priceLabel = p ? 'Desde $' + p.toLocaleString('es-CO') : 'Gratis'` → "Desde $45.000", "Desde $180.000", "Gratis" (punto de miles, sin espacio tras `$`, sin decimales).
  - `cta = p ? 'Comprar' : 'Ver plan'`; `ctaAria = p ? 'Comprar boletas para ' + t : 'Ver plan: ' + t` (ej. "Comprar boletas para Rock en el Movistar Arena", "Ver plan: Festival de jazz al parque").
  - `social = van.toLocaleString('es-CO') + ' van' + (parches ? ' · ' + parches + (parches === 1 ? ' parche abierto' : ' parches abiertos') : '')` → "186 van · 3 parches abiertos", "1.200 van · 8 parches abiertos", "120 van · 1 parche abierto", "88 van".
  - `savedPressed = 'true'|'false'`, `saveColor = guardado ? '#C23A24' : '#17120F'`, `saveFill = guardado ? 'currentColor' : 'none'`.

##### 6.6 "Ver N planes más" (`<sc-if value="{{hasMore}}">`)
- **Layout:** contenedor `display: flex; justify-content: center; margin-top: 28px`; botón `height: 48px; border-radius: 999px; border: 1px solid #17120F; background: #FFFFFF; color: #17120F; padding: 0 24px; font-size: .92rem; font-weight: 700` (174 × 48 px con "Ver 11 planes más"), `aria-expanded="{{moreExpanded}}"`.
- **Datos dinámicos:** `hidden = ordered.length - 8`; `hasMore = hidden > 0` (se sigue mostrando expandido, para poder contraer); etiqueta `showAll ? 'Ver menos planes' : (hidden === 1 ? 'Ver 1 plan más' : 'Ver ' + hidden + ' planes más')`. Con los datos de ejemplo solo aparecen "Ver 11 planes más" (Toda Colombia / Todo) y "Ver 7 planes más" (Toda Colombia / Planes con amigos).
- **Origen / reutilización (toda la sección 6):** del código base: `.sec-head`, `.more`, `.chips`/`.chip` (allí `padding 9px 16px`, `scrollbar-width: none`, hover `border-color: --ink`), `.grid` (allí columnas fijas 4/3/2/1 por `@media`), `.card` (con hover `translateY(-3px)` + `0 12px 28px rgba(23,18,15,.10)`, transición `200ms ease-out`, anulada con `prefers-reduced-motion`), `.date`, `.save` (36 px), `.cat`, `.where`, `.going` (avatares de amigos + "3 amigos van"), `.buy`, `.price` (con `font-variant-numeric: tabular-nums`), `.ticket` ("Boletas" + ícono de flecha externa, abría tuboleta.com en pestaña nueva; hover `#BF3923`) y `.empty`. NUEVOS en el prototipo: fila de chips de ciudad con contador, ciudad en la tarjeta, línea social "N van · N parches abiertos", CTA "Comprar" interno, botón "Ver N planes más" y estado vacío con acción. La tarjeta es la misma de `Agenda.dc.html` (que cambia la línea social por reposts) y de `Mapa.dc.html` (variante compacta): crear UN componente `TarjetaEvento` con variantes.

#### 7. Únete (`<section aria-label="Únete">`)

- **Layout:** `margin-top: 80px; background: #17120F; color: #FFFFFF; border-radius: 28px; padding: clamp(28px, 5vw, 56px); display: flex; flex-wrap: wrap; align-items: center; gap: 28px`. Hijos: texto `flex: 1 1 380px` y botones `flex: 1 1 280px; display: flex; flex-direction: column; gap: 10px; max-width: 360px`. Lado a lado desde 818 px (a 1280: 732 + 360 px); por debajo se apilan y los botones quedan alineados a la izquierda con 360 px (768) o todo el ancho (286 px a 390).
- **Contenido en orden:**
  1. Etiqueta "Tu gente ya está aquí" (se ve en mayúsculas): mismo estilo que "Nuevo · Mapa de eventos" (`#F6DC6A`, Archivo 800, `.85rem`, `padding: 4px 10px; margin-bottom: 14px`, `display: inline-block`).
  2. `<h2>` "Ve a qué van tus amigos y súmate al parche": `margin: 0; font-family: 'Archivo'; font-weight: 900; font-size: clamp(1.8rem, 3.6vw, 2.8rem); letter-spacing: -0.03em; line-height: 1.02; text-transform: uppercase`.
  3. `<p>` "Crea tu cuenta en un minuto, elige tu ciudad y lo que te gusta, y te mostramos los planes de tu gente.": `margin: 14px 0 0; color: #D8CEC6; max-width: 48ch`.
  4. "Continuar con Google" (`Registro.dc.html`): `display: flex; align-items: center; justify-content: center; gap: 10px; height: 52px; border-radius: 999px; background: #FFFFFF; color: #17120F; font-weight: 700`. Sin ícono (el `gap` sugiere que iba uno; en Registro sí tiene la "G" de 18 px).
  5. "Continuar con mi celular" (`Registro.dc.html`): igual pero `border: 1px solid rgba(255,255,255,.4); color: #FFFFFF` y sin fondo. Mide 54 px de alto (52 + 2 de borde, porque no tiene `box-sizing: border-box`).
  6. `<p>` `margin: 4px 0 0; font-size: .84rem; color: #D8CEC6; text-align: center`: "¿Ya tienes cuenta? " + enlace "Entrar" (`Main.dc.html`) `color: #FFFFFF; font-weight: 700; border-bottom: 1px solid #FFFFFF`.
- **Datos dinámicos:** ninguno.
- **Origen / reutilización:** bloque NUEVO. Reutilizar los botones de acceso de `Registro.dc.html` (mismo texto "Continuar con Google", con ícono).

#### 8. Pie de página (`<footer>`)

- **Layout:** `margin-top: 72px; border-top: 1px solid #EAE1D8`. Interior `max-width: 1240px; margin: 0 auto; padding: 28px 24px 40px; display: flex; flex-wrap: wrap; gap: 12px 28px; justify-content: space-between; font-size: .85rem; color: #6E6259`. En una fila desde 931 px; por debajo, dos líneas.
- **Contenido en orden:** "© 2026 Fulleventos · Colombia" y "Compra segura dentro de Fulleventos. Las boletas las emite la boletera oficial del evento o el organizador." Sin enlaces.
- **Datos dinámicos:** ninguno (el año está fijo).
- **Origen / reutilización:** `footer` del código base, que decía "© 2026 Fulleventos · Bogotá, Colombia" y "Las boletas se compran en las boleteras oficiales. Fulleventos no vende entradas." El cambio de texto es parte del riesgo H1; el pie debe rehacerse como pie legal (H5).

### Datos de ejemplo

**Ciudades** (`cities`, en este orden; es el orden de los chips, del intercalado y de las opciones del select)

| Orden | id | Nombre | left (%) | top (%) | Rótulo del pin (lado, dy px) | Planes (`countBy`) | Orden del pin en el DOM/Tab (norte → sur) |
|---|---|---|---|---|---|---|---|
| 1 | bogota | Bogotá | 41.8 | 47.4 | derecha, −9 | 6 | 7 |
| 2 | medellin | Medellín | 30.2 | 38.6 | izquierda, 0 | 3 | 5 |
| 3 | cali | Cali | 22.8 | 54.6 | izquierda, 0 | 2 | 9 |
| 4 | barranquilla | Barranquilla | 36.2 | 11.7 | izquierda, −8 | 1 | 2 |
| 5 | cartagena | Cartagena | 30.9 | 14.9 | izquierda, 5 | 1 | 3 |
| 6 | santamarta | Santa Marta | 40.8 | 10.1 | derecha, −2 | 1 | 1 |
| 7 | bucaramanga | Bucaramanga | 49.1 | 33.6 | derecha, 0 | 1 | 4 |
| 8 | pereira | Pereira | 29.3 | 46.8 | izquierda, 0 | 1 | 6 |
| 9 | villavicencio | Villavicencio | 45.2 | 50.6 | derecha, 5 | 1 | 8 |
| 10 | pasto | Pasto | 17.1 | 67.4 | izquierda, 0 | 1 | 10 |
| 11 | leticia | Leticia | 73.5 | 97 | izquierda, 0 | 1 | 11 |

`left`/`top` son porcentajes sobre el lienzo de 130 × 175 del SVG, no coordenadas geográficas. Más el chip inicial "Toda Colombia" (id `all`, 19 planes).

**Eventos** (`all`, 19 registros; todos en octubre de 2026: viernes 9, sábado 10, domingo 11 y lunes festivo 12. El código solo guarda el día `d`; el mes "oct" está escrito en la plantilla y el año y los días de la semana se deducen del calendario de 2026 y del pie "© 2026"; Mapa lo dice explícito en `Mapa.dc.html:456`: "…, del viernes 9 al lunes festivo 12 de octubre. …"). "Van" y "Parches" vienen del objeto `social` (`[personas que van, parches abiertos]`).

| Pos. intercalada | id | Título (`t`) | Categoría (`cat`) | `tags` | Ciudad | Día (`d`) | Lugar (`v`) | Precio `p` (COP) | Se ve | Línea bajo el precio (`b`) | `bg1` | `bg2` | Van | Parches | Línea social | CTA |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | e1 | Noche de salsa y boleros en vivo | Rumba | rumba | Bogotá | 9 | Galería Café Libro · Zona T | 45000 | Desde $45.000 | TuBoleta | #E8A04F | #B5372B | 186 | 3 | 186 van · 3 parches abiertos | Comprar |
| 12 | e2 | Festival de jazz al parque | Conciertos | conciertos, gratis | Bogotá | 10 | Parque El Country · Usaquén | 0 | Gratis | Idartes | #4F6DD8 | #1E2550 | 640 | 5 | 640 van · 5 parches abiertos | Ver plan |
| 15 | e3 | Rock en el Movistar Arena | Conciertos | conciertos | Bogotá | 10 | Movistar Arena · Salitre | 180000 | Desde $180.000 | TuBoleta | #D9452F | #2B0F12 | 1200 | 8 | 1.200 van · 8 parches abiertos | Comprar |
| 17 | e4 | Santa Fe vs. Millonarios | Deporte | deporte | Bogotá | 11 | Estadio El Campín · Teusaquillo | 60000 | Desde $60.000 | Ticketmaster | #C4302B | #1F3A8A | 2100 | 12 | 2.100 van · 12 parches abiertos | Comprar |
| 18 | e5 | Stand-up: risas de domingo | Arte y teatro | teatro | Bogotá | 11 | Teatro Libre · Chapinero | 55000 | Desde $55.000 | TuBoleta | #EE93BC | #5A2340 | 92 | 1 | 92 van · 1 parche abierto | Comprar |
| 19 | e6 | Mercado gastronómico de las Américas | Comida | comida, gratis | Bogotá | 10 | Plaza de los Artesanos | 0 | Gratis | Entrada libre | #F6DC6A | #C46A2B | 410 | 2 | 410 van · 2 parches abiertos | Ver plan |
| 2 | e7 | Noche de reguetón en Provenza | Rumba | rumba | Medellín | 9 | Barrio Provenza · El Poblado | 50000 | Desde $50.000 | Fever | #6B3FA0 | #0E0A1A | 320 | 4 | 320 van · 4 parches abiertos | Comprar |
| 13 | e8 | Atlético Nacional vs. Junior | Deporte | deporte | Medellín | 12 | Estadio Atanasio Girardot | 70000 | Desde $70.000 | Ticketmaster | #3E9B63 | #0F2A1C | 1800 | 9 | 1.800 van · 9 parches abiertos | Comprar |
| 16 | e9 | Milonga en Manrique | Rumba | rumba | Medellín | 10 | Casa del tango · Manrique | 25000 | Desde $25.000 | TuBoleta | #B88A5A | #3A2414 | 64 | 1 | 64 van · 1 parche abierto | Comprar |
| 3 | e10 | Viejoteca de salsa caleña | Rumba | rumba | Cali | 10 | Juanchito | 40000 | Desde $40.000 | TuBoleta | #F3B27E | #8A2E1F | 150 | 2 | 150 van · 2 parches abiertos | Comprar |
| 14 | e11 | Concierto de músicas del Pacífico | Conciertos | conciertos | Cali | 11 | Teatro Municipal | 35000 | Desde $35.000 | TuBoleta | #8FD3D0 | #12343A | 210 | 0 | 210 van | Comprar |
| 4 | e12 | Vallenato en el Gran Malecón | Conciertos | conciertos, gratis | Barranquilla | 10 | Gran Malecón del Río | 0 | Gratis | Entrada libre | #F6DC6A | #1E5A7A | 980 | 3 | 980 van · 3 parches abiertos | Ver plan |
| 5 | e13 | Noche de champeta en Getsemaní | Rumba | rumba | Cartagena | 9 | Plaza de la Trinidad · Getsemaní | 30000 | Desde $30.000 | Fever | #EE93BC | #4A1A3A | 275 | 2 | 275 van · 2 parches abiertos | Comprar |
| 6 | e14 | Atardecer electrónico en la playa | Rumba | rumba | Santa Marta | 10 | Playa El Rodadero | 90000 | Desde $90.000 | Fever | #F3B27E | #1E2550 | 340 | 3 | 340 van · 3 parches abiertos | Comprar |
| 7 | e15 | Festival de cerveza artesanal | Comida | comida | Bucaramanga | 11 | Parque San Pío | 25000 | Desde $25.000 | TuBoleta | #E8A04F | #5A3A14 | 120 | 1 | 120 van · 1 parche abierto | Comprar |
| 8 | e16 | Noche de trova en el lago | Conciertos | conciertos, gratis | Pereira | 9 | Parque Lago Uribe Uribe | 0 | Gratis | Entrada libre | #A3A8F0 | #2A2550 | 88 | 0 | 88 van | Ver plan |
| 9 | e17 | Joropo en Los Fundadores | Conciertos | conciertos, gratis | Villavicencio | 11 | Parque Los Fundadores | 0 | Gratis | Entrada libre | #B9E07A | #2A3A14 | 230 | 1 | 230 van · 1 parche abierto | Ver plan |
| 10 | e18 | Concierto andino en la plaza | Conciertos | conciertos, gratis | Pasto | 10 | Plaza de Nariño | 0 | Gratis | Entrada libre | #8FD3D0 | #2A1F3A | 160 | 0 | 160 van | Ver plan |
| 11 | e19 | Música y comida en el malecón del Amazonas | Comida | comida, gratis | Leticia | 11 | Malecón de Leticia | 0 | Gratis | Entrada libre | #B9E07A | #12343A | 70 | 0 | 70 van | Ver plan |

Con "Toda Colombia / Todo" se ven al inicio las posiciones 1 a 8 (e1, e7, e10, e12, e13, e14, e15, e16), tal como muestran las tres capturas.

**Chips de categoría** (`chipDefs`) y conteos

| id | Texto | Regla | Toda Colombia | Bogotá | Medellín | Cali | Barranquilla | Cartagena | Santa Marta | Bucaramanga | Pereira | Villavicencio | Pasto | Leticia |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| all | Todo | todos | 19 ("Ver 11 planes más") | 6 | 3 | 2 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| rumba | Rumba | tag `rumba` | 6 | 1 | 2 | 1 | 0 | 1 | 1 | 0 | 0 | 0 | 0 | 0 |
| conciertos | Conciertos | tag `conciertos` | 7 | 2 | 0 | 1 | 1 | 0 | 0 | 0 | 1 | 1 | 1 | 0 |
| amigos | Planes con amigos | parches abiertos > 0 | 15 ("Ver 7 planes más") | 6 | 3 | 1 | 1 | 1 | 1 | 1 | 0 | 1 | 0 | 0 |
| gratis | Gratis este finde | tag `gratis` | 7 | 2 | 0 | 0 | 1 | 0 | 0 | 0 | 1 | 1 | 1 | 1 |
| comida | Comida | tag `comida` | 3 | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 1 |
| deporte | Deporte | tag `deporte` | 2 | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| teatro | Arte y teatro | tag `teatro` | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

Cada 0 muestra el estado vacío "No hay planes de esta categoría en {Ciudad} este finde."

**Noticias** (texto fijo, todas enlazan a `Evento.dc.html`)

| Posición | Antetítulo | Título | Bajada | Tiempo |
|---|---|---|---|---|
| Destacada | Cartel confirmado · Bogotá | El festival de noviembre en el Simón Bolívar revela su cartel completo | Tres escenarios, más de 40 artistas y entrada por días. La preventa abre este jueves. | Hace 3 horas · 4 min de lectura |
| Lista 1 | Venta de boletas · Bogotá | Se agotó la primera fase para el concierto del Movistar Arena; anuncian segunda fecha | — | Hace 5 horas |
| Lista 2 | Nuevo lugar · Medellín | Abre en El Poblado un club con programación de electrónica de jueves a sábado | — | Ayer |
| Lista 3 | Gratis · Barranquilla | Vallenato en vivo en el Gran Malecón del Río todos los sábados de octubre | — | Hace 2 días |

**Otros datos fijos**

| Bloque | Datos |
|---|---|
| Avatares del héroe | 4 círculos sin texto: `#F3B27E`, `#A3A8F0`, `#EE93BC`, `#B9E07A` |
| Pasos de "Cómo funciona" | 1 `#F6DC6A` "Descubre"; 2 `#EE93BC` "Mira quién va"; 3 `#A3A8F0` "Arma parche" (textos en la sección 3) |
| Lista del bloque Mapa | pin `#F6DC6A`; filtro `#EE93BC`; personas `#8FD3D0` (textos en la sección 4) |
| Opciones del select | las 12 de la sección 1 |


---
Ver también: [5. Responsive](../05-responsive.md) · [6. Estados interactivos](../06-estados-interactivos.md) · [8. Detalles finos](../08-detalles-finos.md)
