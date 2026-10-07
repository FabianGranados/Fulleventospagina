[← Índice del handoff](../README.md)

## 4.4 Registro (`Registro.dc.html`)

**Ruta propuesta:** `/registro` (los 3 pasos son estado interno: en el prototipo la URL no cambia al pasar de paso) · **Quién la ve:** visitante sin sesión (llega desde la landing `/`) · **Propósito:** crear la cuenta en 3 pasos ("Tu cuenta", "Tus gustos", "Tu gente"): datos básicos o Google, elegir al menos 3 gustos para armar la agenda y seguir a amigos o lugares antes de entrar al feed. En el lienzo el tablero se llama "2 · Registro · Gustos y gente" (1280 × 1000, `data-props='{"$preview":{"width":1280,"height":1000}}'`).

- `<title>`: "Fulleventos · Crear cuenta". `<html lang="es">`.
- Fuentes (Google Fonts, `display=swap`): **Archivo** 800 y 900; **DM Sans** con eje óptico `opsz 9..40` en pesos 400, 500 y 700. Nada más se carga.
- Estilos globales del `<helmet>` (únicas reglas de hoja de estilo de la pantalla; todo lo demás es inline):
  - `body{margin:0;background:#FBF7F3}`
  - `a{color:#17120F;text-decoration:none}a:hover{color:#C23A24}` (en esta pantalla el hover no tiene efecto visible: todos los enlaces tienen `color` inline, que gana; ver "Detalles finos").
  - `button{font-family:inherit;cursor:pointer}` (no hereda `font-size`).
  - `input{font-family:inherit}` (no hereda `color` ni `font-size`).
- No hay `@media`, `@container`, `transition`, `animation` ni `prefers-reduced-motion` en el archivo. No hay `<meta name="viewport">` (H35).

### Navegación de entrada y salida

| Elemento | Destino | Notas |
|---|---|---|
| **Entrada:** "Crear cuenta" (nav de Bienvenida, `Bienvenida.dc.html:54`) | `Registro.dc.html` → `/registro`, paso 1 | Botón píldora negro #17120F, texto #FFFFFF, `padding: 11px 18px`, 700. |
| **Entrada:** "Crear mi cuenta gratis" (héroe de Bienvenida, `:71`) | `/registro`, paso 1 | Botón blanco, `padding: 15px 26px`. |
| **Entrada:** "Continuar con Google" (bloque "Únete" de Bienvenida, `:258`) | `/registro`, paso 1 | Es un `<a>` que solo abre Registro en el paso 1: el usuario tiene que volver a tocar "Continuar con Google" aquí. Inconsistencia (ver "Detalles finos"). |
| **Entrada:** "Continuar con mi celular" (Bienvenida, `:259`) | `/registro`, paso 1 | No lleva el foco al campo "Celular o correo". |
| Logo "fulleventos" (encabezado) | `Bienvenida.dc.html` → `/` | Enlace de texto. |
| "Entrar" (encabezado, dentro de "¿Ya tienes cuenta? Entrar") | `Main.dc.html` → `/inicio` | En el prototipo entra directo al feed sin pantalla de inicio de sesión. H12/H33 exigen diseñar la pantalla "Entrar" (ruta sugerida `/entrar`, por diseñar). |
| "Continuar con Google" (paso 1) | Paso 2 (estado interno, misma URL) | Ejecuta `next`: no abre OAuth ni guarda nada (H12). |
| "Continuar" (paso 1) | Paso 2 | Avanza aunque los 3 campos estén vacíos (H23, H45). |
| "Atrás" (paso 2) | Paso 1 | Lo escrito en el paso 1 se pierde (H45). |
| "Continuar" (paso 2) | Paso 3 | Solo si hay 3 o más gustos elegidos; si no, está `disabled`. |
| "Atrás" (paso 3) | Paso 2 | Los gustos elegidos se conservan. |
| "Buscar amigos en mis contactos" (paso 3) | Ninguno | Botón sin `onClick` (H38, H12, H28). |
| "Ir a mi feed" (paso 3) | `Main.dc.html` → `/inicio` | Es un `<a>` con aspecto de botón. Funciona con 0 personas seguidas. |
| "[Términos]" y "[Política de privacidad]" (paso 1) | Ninguno | Texto plano entre corchetes, **no son enlaces**. En producción deben ser enlaces a los documentos (H5, H28). |

### Estructura sección por sección

**Contenedor raíz (envuelve todo):** `div` con `min-height: 100vh; background: #FBF7F3; color: #17120F; font-family: 'DM Sans', system-ui, sans-serif; font-size: 16px; line-height: 1.5`.

**Contenedor principal (`<main>`):** `max-width: 1240px; margin: 0 auto; padding: 8px 24px 64px; display: flex; flex-wrap: wrap; gap: 24px; align-items: stretch`. Contiene dos hijos: el panel lateral (`<aside>`, `flex: 1 1 340px`) y la tarjeta del formulario (`<section>`, `flex: 1.3 1 420px`). Como `max-width` se aplica con `box-sizing: content-box`, el ancho total máximo es 1288 px (1240 + 24 + 24); a 1440 px de ventana el contenido arranca en x = 100 px. Con `align-items: stretch`, en dos columnas el panel y la tarjeta miden siempre lo mismo de alto.

**Componentes del código base que se reutilizan en toda la pantalla** (`diseno/referencia/preview-demo.html`): las variables de `:root` (`--bg #FBF7F3`, `--surface #FFFFFF`, `--ink #17120F`, `--muted #6E6259`, `--line #EAE1D8`, `--brand #D9452F`, `--yellow #F6DC6A`, `--peach #F3B27E`, `--pink #EE93BC`, `--hero #140E10`, `--display` Archivo, `--ui` DM Sans), `.wrap` (max-width 1240 + 24 px laterales) y la regla `:focus-visible { outline: 3px solid var(--brand); outline-offset: 2px; }`. Tokens que esta pantalla usa y **no existen** en el código base, así que hay que crearlos: `#C23A24` (relleno de CTA y barra de progreso), `#D9CEC3` (borde de campo y de chip apagado), `#B9AEA4` (botón deshabilitado y borde punteado), `#F1EAE3` (divisor de filas) y `rgba(255,255,255,.65)` (texto de paso pendiente).

#### 1. Encabezado

- **Layout:** `<header>` con `max-width: 1240px; margin: 0 auto; padding: 14px 24px; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px`. Sin fondo propio (se ve el #FBF7F3 del contenedor), sin borde, sin sombra y **no es sticky**. Alto renderizado: 66 px desde 390 px de ancho; a 360 px y 320 px el texto de la derecha baja a una segunda línea y el encabezado mide 100 px.
- **Contenido en orden:**
  1. Logo: enlace con el texto "fulleventos" (en minúsculas en el código). DM Sans 700, `font-size: 1.6rem` (25,6 px), `letter-spacing: -0.03em` (−0,768 px), `line-height` 1,5 (38,4 px), color #D9452F. Mide 128 × 38 px. Es el mismo `.logo` del código base (que también usa DM Sans, no Archivo).
  2. Texto "¿Ya tienes cuenta? " en `font-size: .9rem` (14,4 px), color #6E6259, seguido del enlace "Entrar": 700, color #17120F, `border-bottom: 2px solid #17120F` (subrayado como borde, no `text-decoration`). El enlace mide 44 × 20 px.
- **Datos dinámicos:** ninguno.
- **Componente:** encabezado de visitante (no el de la app con sesión). H41 pide un único componente de encabezado para visitantes; el de Registro es una variante mínima (logo + "¿Ya tienes cuenta? Entrar"). Reutilizar `.logo` y el patrón `.more` del código base para "Entrar" (allí es `border-bottom: 2px solid var(--ink)` con hover a `--brand`).

#### 2. Panel lateral de progreso (`<aside>`)

- **Layout:** `flex: 1 1 340px; border-radius: 28px; color: #FFFFFF; padding: clamp(28px, 4vw, 48px); box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; gap: 28px; min-height: 420px`. Sin borde ni sombra, sin `overflow: hidden`.
  - Fondo (4 capas, en este orden):
    `radial-gradient(circle at 74% 30%, rgba(214,140,70,.55) 0, transparent 26%), radial-gradient(circle at 80% 85%, rgba(190,70,80,.45) 0, transparent 30%), radial-gradient(ellipse at 8% 40%, rgba(70,30,80,.55) 0, transparent 45%), #140E10`.
    Es una variante del `.hero` del código base, que tiene 4 manchas en vez de 3: `circle at 74% 30%` hasta `transparent 22%` (no 26 %); `circle at 92% 78%` hasta 26 % (no `80% 85%` hasta 30 %); una mancha extra `radial-gradient(circle at 60% 92%, rgba(230,170,80,.25) 0, transparent 18%)` en tercera posición; y la misma elipse `8% 40%` hasta 45 %. Además el `.hero` base lleva `overflow: hidden`, `min-height: 520px` y `justify-content: center`. Copiar los valores de Registro, no los del código base.
  - Padding medido: 28 px a 390 px; 30,72 px a 768 px; 33,28 px a 832 px; 40,96 px a 1024 px; 48 px a 1280 px.
  - Medidas: 342 × 420 px a 390; 720 × 420 a 768; 535 × 690 a 1280 en el paso 1 (521 en el paso 2 y 679 en el paso 3, porque se estira al alto de la tarjeta).
- **Contenido en orden:**
  1. **Etiqueta de paso:** texto "Paso {{stepNum}} de 3" → "Paso 1 de 3", "Paso 2 de 3", "Paso 3 de 3"; se ve "PASO 1 DE 3" por `text-transform: uppercase`. `align-self: flex-start; background: #F6DC6A; color: #17120F; font-family: 'Archivo'; font-weight: 800; font-size: .9rem` (14,4 px); `padding: 4px 10px`; `line-height` heredado 1,5. Esquinas rectas (sin radio). Mide 109 × 30 px. Es el `.tag` del código base en su versión móvil (`font-size: .9rem`, sin `margin-left`), con dos diferencias: Registro no lleva `letter-spacing: .01em` y usa `padding: 4px 10px` (el `.tag` base usa `5px 12px`). La etiqueta "Tu gente ya está aquí" de Bienvenida (`Bienvenida.dc.html:253`) usa el mismo padding de 4px 10px pero `font-size: .85rem`.
  2. **Titular `<h1>` "Tu próximo plan empieza aquí"** (decorativo, se ve "TU PRÓXIMO / PLAN EMPIEZA / AQUÍ"): `margin: 0; font-family: 'Archivo'; font-weight: 900; text-transform: uppercase; letter-spacing: -0.035em; line-height: .98; font-size: clamp(2rem, 4vw, 3.2rem); color: #17120F; display: flex; flex-direction: column; align-items: flex-start`. Tamaño medido: 32 px hasta 800 px de ancho, 33,28 px a 832, 40,96 px a 1024 y 51,2 px desde 1280.
     Tres `<span>`, cada uno con `padding: .1em .22em .06em` y fondo en degradado horizontal:
     - "Tu próximo": `linear-gradient(90deg, #F3B27E, #EE93BC)` (durazno → rosado).
     - "plan empieza": `linear-gradient(90deg, #EE93BC, #F3B27E)` (rosado → durazno) y `margin-left: .8em` (25,6 px a 32 px de fuente; 41 px a 51,2 px).
     - "aquí": `linear-gradient(90deg, #F3B27E, #EE93BC)`.
     Cada span es un bloque (ítem flex), así que si su texto se parte en dos líneas el resaltado es **un solo rectángulo** que cubre ambas líneas (no un resaltado por línea). "PLAN EMPIEZA" se parte en dos líneas a 390 px y a 1280 px, y queda en una línea a 768 px.
     Es el `.headline` del código base, con estas diferencias: allí el tamaño es `clamp(2.3rem, 5.8vw, 4.9rem)` (aquí `clamp(2rem, 4vw, 3.2rem)`); los spans son `display: block; width: fit-content; max-width: 100%` (aquí son ítems de un flex en columna con `align-items: flex-start`); el segundo span lleva `margin-left: 1.15em` y el tercero `margin-left: .4em; max-width: 13ch`, y por debajo de 820 px los márgenes se anulan. En Registro solo el segundo span tiene margen (.8em) y nunca se anula.
  3. **Lista de pasos `<ol>`:** `margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 12px`. Tres `<li>` con `display: flex; align-items: center; gap: 12px; color: {{st.fg}}`, en 16 px DM Sans 400 (heredado), alto 30 px.
     - Punto numerado: `width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center; font-weight: 700; font-size: .85rem` (13,6 px); `background: {{st.dotBg}}; color: {{st.dotFg}}`. Contiene el número ("1", "2", "3") o el carácter "✓" (U+2713, texto, no SVG) si el paso ya se completó.
     - Etiqueta: "Tu cuenta", "Tus gustos", "Tu gente".
- **Datos dinámicos** (de `renderVals()`):
  - `stepNum = s.step` (1, 2 o 3).
  - Para cada paso `n` (1 a 3): `done = n < s.step`; `cur = n === s.step`.
    - Texto del punto: `done ? '✓' : String(n)`.
    - Color de la etiqueta (`fg`): `#FFFFFF` si es el actual o ya está hecho; `rgba(255,255,255,.65)` si está pendiente.
    - Fondo del punto (`dotBg`): `#F6DC6A` si es el actual; `#FFFFFF` si está hecho; `transparent` si está pendiente.
    - Color del número (`dotFg`): **siempre `#17120F`**. En los pasos pendientes el número queda #17120F sobre el fondo oscuro #140E10 (1,03:1): es invisible (H52). En las capturas, "Tus gustos" y "Tu gente" aparecen sin número en el paso 1.
  - Resumen de estados del indicador:

    | Paso actual | Punto 1 | Punto 2 | Punto 3 |
    |---|---|---|---|
    | 1 | "1" sobre #F6DC6A, etiqueta #FFFFFF | "2" invisible (transparente), etiqueta blanca al 65 % | "3" invisible, etiqueta blanca al 65 % |
    | 2 | "✓" #17120F sobre #FFFFFF, etiqueta #FFFFFF | "2" sobre #F6DC6A, etiqueta #FFFFFF | "3" invisible, etiqueta blanca al 65 % |
    | 3 | "✓" sobre #FFFFFF | "✓" sobre #FFFFFF | "3" sobre #F6DC6A, etiqueta #FFFFFF |

- **Componente:** nuevo, "Indicador de pasos" (etiqueta + lista), que reutiliza `.tag`, `.headline` y el fondo `.hero` del código base. El mismo patrón de pasos existe en el checkout de Evento (4 pasos con `aria-current="step"`); conviene un único componente de stepper para ambos.

#### 3. Tarjeta del formulario (`<section aria-label="Formulario de registro">`) y barra de progreso

- **Layout de la tarjeta:** `flex: 1.3 1 420px; min-width: 0; background: #FFFFFF; border: 1px solid #EAE1D8; border-radius: 28px; padding: clamp(24px, 4vw, 48px); box-sizing: border-box; display: flex; flex-direction: column; gap: 22px`. Sin sombra. No hay `<form>`: es una `<section>` con nombre accesible.
  - Padding medido: 24 px a 390; 30,72 px a 768; 48 px a 1280.
  - Medidas a 1280 px: x = 583, ancho 673 px; alto 690 px (paso 1), 521 px (paso 2) y 679 px (paso 3). A 390 px: 342 px de ancho; alto 661 / 618 / 717 px. A 768 px: 720 px de ancho; alto 655 / 351 / 644 px.
- **Barra de progreso (primer hijo, común a los 3 pasos):**
  - Riel: `height: 6px; border-radius: 3px; background: #EAE1D8; overflow: hidden`.
  - Relleno: `height: 100%; width: {{progress}}%; background: #C23A24; border-radius: 3px`. Sin transición: el ancho cambia de golpe.
  - `progress = Math.round(s.step / 3 * 100)` → **33**, **67** y **100**. Medido a 1280 px: 190, 385 y 575 px sobre un riel de 575 px.
  - No tiene `role="progressbar"` ni texto: es solo visual (la información equivalente está en "Paso N de 3").
- **Contenido siguiente:** uno solo de los tres bloques de paso (`<sc-if>`), que se montan y desmontan; ver secciones 4, 5 y 6.
- **Componente:** nuevo, "Tarjeta de formulario" (superficie blanca `--surface`, borde `--line`, radio 28 px) y "Barra de progreso".

#### 4. Paso 1 · "Crea tu cuenta"

- **Layout:** `div` con `display: flex; flex-direction: column; gap: 18px`. Visible cuando `isStep1 = (s.step === 1)`. Todos los hijos ocupan el ancho completo de la tarjeta (575 px a 1280; 292 px a 390; 657 px a 768).
- **Contenido en orden:**
  1. **Encabezado del paso** (un `div` con dos hijos):
     - `<h2>` "Crea tu cuenta": `margin: 0; font-family: 'Archivo'; font-weight: 900; font-size: 1.9rem` (30,4 px); `letter-spacing: -0.03em` (−0,912 px); `line-height: 1.05` (31,92 px); color heredado #17120F. **Sin** mayúsculas.
     - `<p>` "Gratis. Solo tarda un minuto.": `margin: 6px 0 0; color: #6E6259`; 16 px / 1,5.
  2. **Botón "Continuar con Google"**: `height: 52px; border-radius: 999px; border: 1px solid #17120F; background: #FFFFFF; color: #17120F; font-weight: 700; font-size: .95rem` (15,2 px); `display: flex; align-items: center; justify-content: center; gap: 10px`. Ícono a la izquierda: "G" de Google dibujada **solo con trazo** (no es el logo a color): SVG 18 × 18, `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `stroke-width="2.2"`, `stroke-linecap="round"`, `aria-hidden="true"`, con 4 trazados (los cuatro segmentos de la G). `onClick = next`.
  3. **Separador "o con tus datos"**: `div` con `display: flex; align-items: center; gap: 12px; color: #6E6259; font-size: .85rem` (13,6 px). Dos líneas a los lados: `span` con `flex: 1; height: 1px; background: #EAE1D8`. Texto: "o con tus datos" (en minúscula). Alto 20 px.
  4. **Campo "Nombre"**: `<label>` con `display: flex; flex-direction: column; gap: 6px; font-weight: 700; font-size: .9rem` (14,4 px) que envuelve el texto "Nombre" y el `<input>`:
     `type="text"`, `autocomplete="name"`, `placeholder="Cómo te llamas"`; estilo `height: 48px; border: 1px solid #D9CEC3; border-radius: 12px; padding: 0 14px; font-size: 1rem; font-weight: 400; background: #FBF7F3; outline: 0`. Alto renderizado **50 px** (el `input` usa `box-sizing: content-box`: 48 + 2 de borde). El `<label>` completo mide 78 px.
  5. **Campo "Celular o correo"**: mismo `<label>` y mismo estilo de `input`; `type="text"`, `autocomplete="email"`, `placeholder="300 123 4567 o tu@correo.com"`.
  6. **Campo "Barrio o localidad"**: mismo estilo; `type="text"`, **sin** `autocomplete`, `placeholder="Ej. Chapinero"`.
  7. **Botón "Continuar"**: `height: 52px; border-radius: 999px; border: 0; background: #C23A24; color: #FFFFFF; font-weight: 700; font-size: 1rem`. `onClick = next`. Ancho completo.
  8. **Texto legal**: `<p>` "Al continuar aceptas los [Términos] y la [Política de privacidad]." con `margin: 0; font-size: .78rem` (12,48 px); `color: #6E6259`; `line-height` 1,5 (18,72 px). Los corchetes son marcadores literales; no hay enlaces.
- **Posiciones medidas:**
  - 1280 × 900: barra en y = 123; h2 en 151; Google en 231; separador en 301; inputs en 367, 463 y 559; Continuar en 627; texto legal en 697. Todo cabe en la primera pantalla.
  - 390 × 844: barra en y = 543; h2 en 571; Google en 651; separador en 721; inputs en 787, 883 y 979; Continuar en 1047–1099; texto legal en 1117 (2 líneas, 37 px). Alto total de la página: 1243 px. El primer campo y todo lo que sigue quedan **debajo** de la primera pantalla (H45, H28).
- **Datos dinámicos:** ninguno. Los `input` no tienen `value` ni `onChange`: el texto vive solo en el DOM y se pierde al desmontar el paso.
- **Componente:**
  - "Campo de texto" (etiqueta + input): unificarlo con los campos del checkout de Evento (`Evento.dc.html:643-656`), que ya usan `value`/`onChange`, `box-sizing: border-box` (48 px totales), fondo #FFFFFF, `color: #17120F` y etiqueta de `.86rem`. En Registro el fondo es #FBF7F3, la etiqueta `.9rem` y no hay color de texto: hay que elegir una variante (ver "Detalles finos").
  - "Botón primario" (`#C23A24`, píldora de 52 px) y "Botón secundario con borde" (blanco, borde #17120F): nuevos como componentes; el código base solo tiene `.btn-dark`, `.btn-light` y `.ticket`.
  - "Botón Continuar con Google": nuevo (en Bienvenida existe una versión como enlace sobre fondo oscuro: blanco sin borde, `Bienvenida.dc.html:258`).
  - "Separador con texto": nuevo.

#### 5. Paso 2 · "¿Qué planes te gustan?"

- **Layout:** `div` con `display: flex; flex-direction: column; gap: 18px`. Visible cuando `isStep2`.
- **Contenido en orden:**
  1. `<h2>` "¿Qué planes te gustan?" (mismo estilo que el h2 del paso 1; a 390 px y menos ocupa 2 líneas, 64 px) y `<p>` "Elige al menos 3. Así armamos tu agenda." (`margin: 6px 0 0; color: #6E6259`).
  2. **Grupo de gustos:** `div` con `role="group"`, `aria-label="Gustos"`, `display: flex; flex-wrap: wrap; gap: 10px`. 12 botones (chips) en este orden fijo: "Salsa", "Rock", "Electrónica", "Reguetón", "Jazz", "Conciertos", "Fútbol", "Stand-up", "Teatro", "Comida", "Planes gratis", "Festivales".
     Cada chip: `<button aria-pressed="{{l.pressed}}">` con `height: 46px; border-radius: 999px; padding: 0 18px; font-size: .95rem` (15,2 px); `font-weight: 500; border: 1px solid {{l.border}}; background: {{l.bg}}; color: {{l.fg}}; display: flex; align-items: center; gap: 8px` (el `gap` no se usa: no hay ícono). Anchos medidos: Salsa 75, Rock 73, Electrónica 119, Reguetón 106, Jazz 68, Conciertos 117, Fútbol 84, Stand-up 107, Teatro 83, Comida 94, Planes gratis 129, Festivales 108 px.
     - Apagado: fondo #FFFFFF, texto #17120F, borde #D9CEC3, `aria-pressed="false"`.
     - Elegido: fondo #17120F, texto #FFFFFF, borde #17120F, `aria-pressed="true"`.
     - Filas resultantes: a 1280 px, 5 + 5 + 2 (alto del grupo 158 px); a 768 px, 6 + 6 (102 px); a 390 px, 3 + 2 + 2 + 2 + 2 + 1 (326 px).
  3. **Fila de acciones:** `div` con `display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; margin-top: 8px` (separación visual con el grupo: 18 + 8 = 26 px).
     - Botón "Atrás": `height: 48px; border: 0; background: transparent; font-weight: 700; color: #17120F; padding: 0 8px`. **Sin `font-size`**: se ve a 13,33 px (tamaño por defecto del navegador para botones). Mide 51 × 48 px. `onClick = back`.
     - Contador: `span` con `font-size: .88rem` (14,08 px), color #6E6259. Texto: "{{likesCount}} elegidos" → "0 elegidos", "1 elegidos" (error de concordancia, H45), "2 elegidos", "3 elegidos"…
     - Botón "Continuar": `height: 52px; border-radius: 999px; border: 0; padding: 0 28px; background: {{continueBg}}; color: #FFFFFF; font-weight: 700; font-size: 1rem`; `disabled` cuando hay menos de 3 gustos. Mide 134 × 52 px. `onClick = next`.
- **Datos dinámicos:**
  - `likes = likeDefs.map(label => …)` con `on = !!s.likes[label]` (la llave del estado es el **texto** del chip, con tildes).
  - `likesCount = likeDefs.filter(l => s.likes[l]).length`.
  - `can = s.step !== 2 || likesCount >= 3`; `cantContinue = !can`; `continueBg = can ? '#C23A24' : '#B9AEA4'`.
  - Atributo `disabled`: el runtime lo pone vacío (`disabled=""`) cuando `cantContinue` es verdadero y lo quita cuando es falso (verificado).
- **Componente:**
  - "Chip conmutable" (multi-selección con `aria-pressed`): reutilizar `.chip` del código base (`.chip[aria-pressed="true"] { background: var(--ink); color: #fff; border-color: var(--ink); }`, `.chip:hover { border-color: var(--ink); }`) con una talla grande: el código base usa `padding: 9px 16px; font-size: .9rem; border: 1px solid var(--line)`, y Registro usa alto fijo de 46 px, `padding: 0 18px`, `.95rem` y borde #D9CEC3. Además, en el código base `.chips` es una fila con scroll horizontal y aquí los chips **hacen salto de línea** (`flex-wrap: wrap`).
  - "Selector de gustos" (grupo + mínimo 3 + contador): nuevo.
  - "Botón de texto" ("Atrás"): nuevo.

#### 6. Paso 3 · "Encuentra a tu gente"

- **Layout:** `div` con `display: flex; flex-direction: column; gap: 14px` (**14 px**, no 18 como en los pasos 1 y 2). Visible cuando `isStep3`.
- **Contenido en orden:**
  1. `<h2>` "Encuentra a tu gente" (mismo estilo; 2 líneas a 390 px) y `<p>` "Sigue a amigos y a personas con tus gustos para ver a qué van." (`margin: 6px 0 0; color: #6E6259`).
  2. **Botón "Buscar amigos en mis contactos"**: `height: 48px; border-radius: 14px; border: 1px dashed #B9AEA4; background: #FBF7F3; color: #17120F; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px`. **Sin `font-size`**: se ve a 13,33 px. Ícono de celular: SVG 18 × 18, `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `stroke-width="2"`, `stroke-linecap="round"`, `stroke-linejoin="round"`, `aria-hidden="true"`; `<rect x="6" y="2" width="12" height="20" rx="2">` + `<path d="M11 18h2">`. **Sin `onClick`**: no hace nada.
  3. **Lista de personas** (5 filas, `<sc-for>`). Cada fila: `div` con `display: flex; align-items: center; gap: 12px; padding: 6px 0; border-bottom: 1px solid #F1EAE3` (la última fila también lleva borde). Alto 57 px (67 px a 390 px cuando el motivo ocupa 2 líneas).
     - Avatar: `span` de `width: 44px; height: 44px; flex-shrink: 0; border-radius: 50%; background: {{u.c}}; display: grid; place-items: center; font-weight: 700; font-size: .8rem` (12,8 px); color heredado #17120F. Muestra las iniciales (`{{u.ini}}`). No es un enlace.
     - Texto: `div` con `flex: 1; min-width: 0; line-height: 1.3`; nombre en `<b style="font-size: .95rem">` (15,2 px, 700) y motivo en `<span style="display: block; font-size: .8rem; color: #6E6259">` (12,8 px). Sin truncado: el motivo hace salto de línea.
     - Botón seguir: `<button aria-pressed="{{u.pressed}}">` con `height: 40px; border-radius: 999px; padding: 0 16px; font-size: .84rem` (13,44 px); `font-weight: 700; border: 1px solid #17120F; background: {{u.bg}}; color: {{u.fg}}`. Texto "Seguir" (76 px de ancho) o "Siguiendo" (99 px de ancho: el botón crece 23 px al cambiar de estado y le quita ese ancho al bloque de texto, que es `flex: 1`).
       - Sin seguir: fondo #17120F, texto #FFFFFF, `aria-pressed="false"`, "Seguir".
       - Siguiendo: fondo #FFFFFF, texto #17120F, borde #17120F, `aria-pressed="true"`, "Siguiendo".
  4. **Fila de acciones:** igual a la del paso 2 (`flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; margin-top: 8px`), sin contador:
     - Botón "Atrás" (mismo estilo, 13,33 px). `onClick = back`.
     - Enlace "Ir a mi feed" → `Main.dc.html`: `height: 52px; border-radius: 999px; padding: 0 28px; background: #C23A24; color: #FFFFFF; font-weight: 700; display: flex; align-items: center; gap: 8px`; 16 px heredado. Ícono flecha a la derecha: SVG 16 × 16, `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `stroke-width="2.4"`, `stroke-linecap="round"`, `stroke-linejoin="round"`, `aria-hidden="true"`, `<path d="M5 12h14M13 6l6 6-6 6">`. Mide 166 × 52 px.
- **Datos dinámicos:** `people` = 5 registros fijos (ver "Datos de ejemplo") a los que se suma: `on = !!s.follow[u.id]`; `pressed = on ? 'true' : 'false'`; `label = on ? 'Siguiendo' : 'Seguir'`; `bg = on ? '#FFFFFF' : '#17120F'`; `fg = on ? '#17120F' : '#FFFFFF'`; `toggle = () => this.flip('follow', u.id)`. Los motivos ("Está en tus contactos", "Le gusta la salsa y el fútbol"…) son texto fijo: no dependen de los gustos elegidos en el paso 2.
- **Componente:**
  - "Fila de persona con Seguir": **compartirla con Main** ("Gente con tus gustos", `Main.dc.html:289-297`), que usa la misma lógica (`Seguir`/`Siguiendo`, mismos colores) con tallas más chicas: avatar 40 px (enlace a Perfil), nombre `.9rem`, motivo `.78rem`, botón de 36 px, `padding: 0 14px`, `.8rem`, `padding: 8px 0` y sin borde inferior. Registro: avatar 44 px (no enlazado), nombre `.95rem`, motivo `.8rem`, botón de 40 px, `padding: 0 16px`, `.84rem`, `padding: 6px 0` y borde #F1EAE3. El código base tiene `.av` (avatar de iniciales con `.c1`–`.c6`; ojo: `.av` base mide 34 px, `.72rem` y lleva `border: 2px solid var(--hero)` y `margin-left: -9px` para apilarse) y `.join` (conmutador con `aria-pressed`), que sirven de base. **Cuidado: la lógica de color de `.join` es la inversa.** En el código base el estado apagado es transparente con borde `--line` (#EAE1D8) y el estado `aria-pressed="true"` (y el hover) es relleno #17120F con texto blanco; en Registro (y en Main) el estado sin seguir ("Seguir", `aria-pressed="false"`) es el relleno #17120F y el estado activo ("Siguiendo") es blanco con borde #17120F. Respetar la lógica de Registro.
  - "Botón punteado de acción secundaria" (contactos): nuevo.
  - "Enlace con aspecto de botón primario + flecha": nuevo (mismo estilo que el botón primario).

#### 7. Pie de página

- **No existe.** Registro no tiene `<footer>` (la auditoría lo confirma, H5). Debajo de la tarjeta solo queda el `padding-bottom` de 64 px del `<main>`.
- **Lo que hay que implementar:** el pie legal común a todas las pantallas que pide H5 (ver "Correcciones obligatorias de la auditoría").

### Datos de ejemplo

**Estado inicial (`this.state`):**

| Campo | Valor inicial | Uso |
|---|---|---|
| `step` | `1` | Paso visible (1 a 3) |
| `likes` | `{}` | Mapa `{ [texto del gusto]: true/false }` |
| `follow` | `{}` | Mapa `{ [id de persona]: true/false }` |

**Pasos (`stepLabels`):**

| n | Etiqueta |
|---|---|
| 1 | "Tu cuenta" |
| 2 | "Tus gustos" |
| 3 | "Tu gente" |

**Gustos (`likeDefs`, en este orden):**

| # | Texto exacto |
|---|---|
| 1 | "Salsa" |
| 2 | "Rock" |
| 3 | "Electrónica" |
| 4 | "Reguetón" |
| 5 | "Jazz" |
| 6 | "Conciertos" |
| 7 | "Fútbol" |
| 8 | "Stand-up" |
| 9 | "Teatro" |
| 10 | "Comida" |
| 11 | "Planes gratis" |
| 12 | "Festivales" |

**Personas sugeridas (`people`, en este orden):**

| id | ini | c (fondo del avatar) | name | why |
|---|---|---|---|---|
| u1 | LM | #F3B27E | "Laura Martínez" | "Está en tus contactos" |
| u2 | AR | #A3A8F0 | "Andrés Ramírez" | "Está en tus contactos" |
| u3 | SC | #EE93BC | "Sofía Cárdenas" | "Le gusta la salsa y el fútbol" |
| u4 | MG | #F6DC6A | "María F. Gómez" | "Va a 4 eventos que te gustan" |
| u5 | GC | #17120F | "Galería Café Libro" | "Lugar · organiza eventos de salsa" |

Los nombres, iniciales y colores coinciden con los de Main, Chat y Evento (`Chat.dc.html:582-593`, `Main.dc.html:390-397` y `:464`). En Chat, Galería Café Libro es organizador con avatar #17120F, iniciales #F6DC6A, radio 14 px y Archivo 900 (`Chat.dc.html:707`).

**Inconsistencias con Main que hay que resolver en el modelo de datos:** los `id` no son compartidos (en Registro `u1` es Laura Martínez; en "Gente con tus gustos" de Main, `u1` es María F. Gómez, `Main.dc.html:464`), y en Main el motivo empieza por la ciudad ("Bogotá · Va a 4 eventos que te gustan"), mientras que en Registro no lleva ciudad ("Va a 4 eventos que te gustan"). En producción usar un identificador único por persona en todas las pantallas.

**Placeholders y valores por defecto de los campos:**

| Etiqueta | `type` | `autocomplete` | Placeholder | Valor inicial |
|---|---|---|---|---|
| "Nombre" | text | name | "Cómo te llamas" | vacío |
| "Celular o correo" | text | email | "300 123 4567 o tu@correo.com" | vacío |
| "Barrio o localidad" | text | (ninguno) | "Ej. Chapinero" | vacío |

**Valores calculados por paso:**

| step | stepNum | progress | isStep1/2/3 | can (sin gustos) | continueBg (sin gustos) |
|---|---|---|---|---|---|
| 1 | 1 | 33 | true / false / false | true | #C23A24 (no se usa en el paso 1) |
| 2 | 2 | 67 | false / true / false | false (true con 3 o más) | #B9AEA4 (#C23A24 con 3 o más) |
| 3 | 3 | 100 | false / false / true | true | #C23A24 (no se usa en el paso 3) |


---
Ver también: [5. Responsive](../05-responsive.md) · [6. Estados interactivos](../06-estados-interactivos.md) · [8. Detalles finos](../08-detalles-finos.md)
