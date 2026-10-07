[← Índice del handoff](README.md)

## 6. Estados interactivos

### 6.1 Reglas comunes

- **Foco visible:** contorno de 3 px `#C23A24` con separación (ver 3, "Foco y estados globales"). La auditoría encontró **13 campos de texto sin indicador de foco** (H51); todos deben tenerlo.
- **Botones que alternan** (Voy, Me interesa, Me gusta, Seguir, Guardar, Repostear, Unirme, chips de filtro, opciones de pago y de parche): cambian su texto o color **y** su `aria-pressed`. Estado activo típico: fondo `#17120F` con texto blanco, o corazón relleno `#C23A24`.
- **Filtros:** el chip activo usa fondo tinta `#17120F` y texto blanco; el inactivo, fondo blanco con borde `#EAE1D8`.
- **Botones deshabilitados:** deben usar `aria-disabled` y explicar por qué (por ejemplo "Escribe tu número de documento para continuar."). La auditoría pide no usar `disabled` a secas en el checkout, porque el lector de pantalla no los anuncia (H7).
- **Ventanas modales** (repost, nuevo parche, checkout): llevan `role="dialog"` y `aria-modal="true"`. Al abrir, el foco entra a la ventana y queda atrapado en ella; se cierran con Escape, y al cerrar el foco vuelve al botón que la abrió (H7). El fondo es `rgba(23,18,15,.55)`.
- **Anuncios a lector de pantalla:** los cambios de resultados ("19 planes en 11 ciudades"), el aviso de repost y los pasos del checkout deben anunciarse con `aria-live` (H49).
- **Movimiento:** todo zoom o transición se desactiva con `prefers-reduced-motion: reduce`.

### 6.2 Por pantalla

#### 6.2.1 Bienvenida

##### Estados e interacciones

Estado inicial de la lógica: `{ filter: 'all', city: 'all', saved: {}, showAll: false }`. No existe ningún `transition` ni `animation` en el archivo: todos los cambios son instantáneos.

| Elemento | Disparador | Resultado | Cambio visual exacto | Transición |
|---|---|---|---|---|
| Enlaces SIN color en línea: "Cómo funciona", "Mapa", "Agenda", "Entrar" (nav), noticias (destacada y lista), título de tarjeta, "Ver en el mapa", "Ver toda la agenda" | Hover | Ninguno | Texto `#17120F` → `#C23A24` (regla global `a:hover`). En noticias cambian también el h3/h4 (heredan); el antetítulo (ya es `#C23A24`), la bajada y la hora NO cambian (tienen color en línea). En "Mapa", la insignia "Nuevo" no cambia. En "Ver en el mapa" el borde sigue `#17120F` (no usa `currentColor`) y el ícono sí cambia. En "Ver toda la agenda" el subrayado (borde) sigue `#17120F`. | Ninguna |
| Enlaces CON color en línea: logo, "Crear cuenta", "Crear mi cuenta gratis", "Ver la agenda sin registrarme", "Abrir el mapa de eventos", pines, "Comprar"/"Ver plan", "Continuar con Google", "Continuar con mi celular", "Entrar" del bloque Únete | Hover | Ninguno | Ningún cambio (solo cursor de mano). Medido en Chromium. | Ninguna |
| Todos los `<button>` (chips, Guardar, Buscar, Ver más, vaciar filtros) | Hover | Ninguno | Ningún cambio visual; `cursor: pointer` por la regla global. | Ninguna |
| Pines del mini-mapa | Hover | Muestra el `title` nativo | Tooltip del sistema "Bogotá: 6 planes este finde" (etc.). | — |
| Cualquier enlace, botón o `select` | Foco con teclado | — | Anillo de foco POR DEFECTO del navegador (Chromium: `outline: auto 1px`, color del sistema). No hay estilo propio. | Ninguna |
| Campo de búsqueda | Foco | — | Ninguno: `outline: 0` y el contenedor no cambia (H51). Solo se ve el cursor de texto. | Ninguna |
| Campo de búsqueda | Escribir / Enter | Nada (no hay formulario ni lógica) | — | — |
| Botón "Buscar" | Clic | Nada (H38) | — | — |
| Selector de ciudad | Cambio (`onChange`) | `city = valor`, `showAll = false`. La rejilla se filtra; el chip correspondiente queda presionado. | Ver fila de chip de ciudad. La página NO se desplaza ni se anuncia: si el usuario está arriba, no ve el cambio. El h2 sigue diciendo "Este finde en Colombia". | Ninguna |
| Chip de ciudad | Clic | `city = id`, `showAll = false`; el `<select>` del encabezado se sincroniza (verificado). | No presionado → presionado: fondo `#FFFFFF` → `#17120F`; texto `#17120F` → `#FFFFFF`; borde `#EAE1D8` → `#17120F`; contador `#F3ECE5` → `#F6DC6A` (número sigue `#17120F`). El ícono pin de "Toda Colombia" usa `currentColor` (pasa a blanco). `aria-pressed` "false" → "true"; el chip anterior vuelve al estado no presionado. | Ninguna |
| Chip de categoría | Clic | `filter = id`, `showAll = false` | Mismos colores de presionado (sin contador). | Ninguna |
| Combinación sin resultados (ej. Medellín + Conciertos) | Cambio de filtro | `empty = true` | Desaparecen tarjetas y "Ver más"; aparece la caja punteada con "No hay planes de esta categoría en Medellín este finde." y el botón "Ver todos los planes del país". No hay anuncio para lector de pantalla. | Ninguna |
| "Ver todos los planes del país" | Clic | `filter = 'all'`, `city = 'all'`, `showAll = false` (NO borra los guardados) | Vuelven las 8 primeras tarjetas y "Ver 11 planes más"; chips "Toda Colombia" y "Todo" presionados; el select vuelve a "Toda Colombia". El botón desaparece y el foco cae al `<body>` (medido). | Ninguna |
| "Ver N planes más" | Clic | `showAll = true` | Se agregan las tarjetas restantes debajo (19 en total con Toda Colombia); la etiqueta pasa a "Ver menos planes"; `aria-expanded` "false" → "true". El foco se queda en el botón. | Ninguna |
| "Ver menos planes" | Clic | `showAll = false` | Vuelven a quedar 8 tarjetas; etiqueta "Ver N planes más"; `aria-expanded` "false"; el foco sigue en el botón. No hay desplazamiento programado, pero como la página se acorta (11 tarjetas menos) el navegador recorta el scroll al nuevo final: el usuario aparece de golpe al final de la página (bloque Únete y pie) y el botón queda arriba. Medido con el botón centrado antes del clic: queda en y = 247 a 1280 (visible), en y = 105 a 768 (tapado por el encabezado de 134 px) y en y = 52 a 390 (tapado por el encabezado de 215 px). Recomendación (no está en la auditoría): al contraer, mantener el botón a la vista con `scrollIntoView` y `scroll-padding-top`. | Ninguna (salto) |
| Cualquier filtro estando expandido | Clic | `showAll` vuelve a `false` | La lista se recorta a 8 de nuevo. | Ninguna |
| Corazón "Guardar {título}" | Clic | `saved[id] = !saved[id]` | Color `#17120F` → `#C23A24` y relleno `none` → `currentColor` (corazón rojo lleno); fondo `rgba(255,255,255,.94)` sin cambio; `aria-pressed` "false" → "true". El `aria-label` NO cambia. Se conserva al cambiar filtros; se pierde al recargar. No pide cuenta. | Ninguna |
| Enlaces de ancla ("Cómo funciona", "Agenda", "Ver la agenda sin registrarme") | Clic | Salto a la sección (`scroll-behavior: auto`) | La sección queda pegada al borde superior y el encabezado fijo la tapa: a 1280 el eyebrow queda a 72 px y el encabezado mide 78 px; a 390 el encabezado de 215 px tapa eyebrow y h2. | Instantáneo |
| Pines, CTA "Comprar"/"Ver plan", noticias, botones de acceso | Clic | Navegación (ver tabla de navegación) | — | — |
| Estado deshabilitado, error, éxito, carga | — | No existen en esta pantalla | — | — |


##### Accesibilidad ya presente

- `lang="es"`, `<title>` "Fulleventos Colombia", un solo `<h1>` y un solo `<main>`.
- Puntos de referencia: `<header>`, `<nav aria-label="Principal">`, `<main>`, `<footer>`, `div role="search"`, regiones con nombre: `section aria-label="Bienvenida"`, `section aria-labelledby="mapa-titulo"` y `section aria-label="Únete"` (las secciones "Cómo funciona", "Noticias" y "Agenda" no tienen nombre accesible).
- Encabezados: h1 → h2 "Planes mejores, con tu gente" → h3 ×3 → h2 "Todo el país en un mapa" → h2 "Noticias de la escena" → h3 destacada → h4 ×3 (H59 pide corregir) → h2 "Este finde en Colombia" → h2 "Ve a qué van tus amigos y súmate al parche". Las tarjetas de evento no tienen encabezado.
- Nombres accesibles: campo `aria-label="Buscar planes"`; select nombrado "Ciudad" por un `<label>` con texto oculto visualmente; botón `aria-label="Buscar"`; CTA de tarjetas con `aria-label` que empieza por el texto visible ("Comprar boletas para …", "Ver plan: …"); corazones "Guardar {título}"; chips de ciudad "Bogotá, 6 planes"; pines "Ver planes en Bogotá (6 planes este finde)" con su rótulo visual en `aria-hidden`; imagen de noticia `role="img" aria-label="[Imagen de la noticia]"`; mini-mapa `role="group"` con nombre y SVG `aria-hidden="true" focusable="false"`; todos los íconos SVG con `aria-hidden="true"`.
- Estados: `aria-pressed` ("true"/"false") en chips de ciudad, chips de categoría y corazones; `aria-expanded` en "Ver N planes más"; grupos de chips con `role="group"` y nombre ("Filtrar por ciudad", "Filtrar por categoría").
- Objetivos táctiles: chips 42 px, corazón 44 × 44, CTA de tarjeta ≥ 44, botón "Ver más" 48, botón "Crear cuenta" 44, botones del héroe/mapa 54, botones de acceso 52–54, botón "Buscar" 40. Pines de 20 a 26 px (H60).
- Toda la página se puede recorrer con teclado (77 paradas de Tab: 9 del encabezado, 2 del héroe, 12 del mapa, 4 de noticias, 2 de cabecera de agenda, 20 chips, 3 por tarjeta × 8, "Ver más" y 3 del bloque Únete). El primer "Comprar" es la parada 52.
- axe-core (WCAG 2.2 AA + buenas prácticas) solo reporta `label-content-name-mismatch` en 22 nodos: los 11 pines y 11 de los 12 chips de ciudad. La auditoría (H59) las considera en su mayoría inofensivas.
- Contraste: todos los textos medidos superan 4,5:1 (ver valores en la sección 0).
- NO presentes: estilo de foco propio (se usa el del navegador; el campo de búsqueda no muestra foco), enlace "Saltar al contenido", región viva para anunciar filtros o resultados, `aria-controls` en "Ver más", `scroll-padding`/`scroll-margin` para el encabezado fijo, `prefers-reduced-motion` (no hace falta hoy porque no hay movimiento) y `<meta name="viewport">`.


#### 6.2.2 Registro

##### Estados e interacciones

| Elemento | Disparador | Resultado | Cambio visual exacto | Transición |
|---|---|---|---|---|
| Pantalla | Carga | Estado inicial `{ step: 1, likes: {}, follow: {} }` | Paso 1 visible; "PASO 1 DE 3"; barra al 33 %; punto 1 amarillo | Ninguna |
| Logo "fulleventos" | Hover | Ninguno | Ninguno: queda #D9452F (el `color` inline gana a `a:hover{color:#C23A24}`) | Ninguna |
| Logo | Clic | Navega a `/` (Bienvenida) | — | — |
| "Entrar" | Hover | Ninguno | Ninguno: queda #17120F con borde #17120F | Ninguna |
| "Entrar" | Clic | Navega a `/inicio` (Main) sin pedir credenciales | — | — |
| Enlaces y botones | Foco con teclado | — | Anillo de foco **por defecto del navegador** (en Chromium: `outline: auto 1px`, color calculado rgb(16,16,16)). La pantalla no define `:focus-visible` | Ninguna |
| Campos de texto | Foco | — | **Ninguno**: `outline: 0` y el borde sigue #D9CEC3 (H51). Solo se ve el cursor | Ninguna |
| Campos de texto | Escribir | El texto queda solo en el DOM | Texto en #000000 (negro del navegador, no #17120F), 16 px, 400 | — |
| Campos de texto | Enter | Nada (no hay `<form>`) | — | — |
| "Continuar con Google" | Clic, Enter o Espacio | `next()`: como `can` es verdadero en el paso 1, `step` pasa a 2 | Se desmonta el paso 1 y se monta el 2; etiqueta "PASO 2 DE 3"; barra al 67 %; punto 1 → "✓" sobre #FFFFFF; punto 2 → amarillo | Ninguna |
| "Continuar" (paso 1) | Clic, Enter o Espacio | `next()` → paso 2, **sin validar** (con los 3 campos vacíos también avanza) | Igual que la fila anterior | Ninguna |
| Cambio de paso | `next` o `back` | El bloque del paso anterior se desmonta | El foco cae en `<body>` (el botón pulsado desaparece) y nada se anuncia. En Chromium el siguiente Tab depende de dónde estaba el botón (verificado): tras "Continuar" o "Continuar con Google" del paso 1 va al chip "Salsa"; tras "Continuar" del paso 2 va a "Buscar amigos en mis contactos"; tras "Atrás" del paso 3 sale de la página; tras "Atrás" del paso 2 vuelve al logo. El scroll **no** vuelve arriba: a 390 × 844, después de "Continuar" la página queda en `scrollY = 356` | Ninguna |
| Chip de gusto | Clic, Enter o Espacio | `flip('likes', label)` alterna el gusto; recalcula `likesCount` | Apagado → elegido: fondo #FFFFFF → #17120F, texto #17120F → #FFFFFF, borde #D9CEC3 → #17120F; `aria-pressed` "false" → "true" (y al revés) | Ninguna |
| Chip de gusto | Hover | — | Ninguno (sin regla de hover; el cursor es `pointer`) | — |
| Contador | Cambio de `likesCount` | — | "0 elegidos" → "1 elegidos" → "2 elegidos" → "3 elegidos"… | Ninguna |
| "Continuar" (paso 2) | Estado con menos de 3 gustos | `disabled=""`; un clic no hace nada | Fondo #B9AEA4, texto #FFFFFF; el cursor sigue siendo `pointer` (no hay regla `:disabled`); no se puede enfocar con Tab | — |
| "Continuar" (paso 2) | Llega a 3 gustos | Se habilita | Fondo #B9AEA4 → #C23A24 | Ninguna |
| "Continuar" (paso 2) | Baja de 3 a 2 gustos | Se deshabilita otra vez | Fondo #C23A24 → #B9AEA4 | Ninguna |
| "Continuar" (paso 2) habilitado | Clic, Enter o Espacio | `next()` → paso 3 | "PASO 3 DE 3"; barra al 100 %; puntos 1 y 2 con "✓"; punto 3 amarillo | Ninguna |
| "Atrás" (paso 2) | Clic | `back()` → paso 1 | Los 3 campos reaparecen **vacíos** (verificado: "Camila" se pierde) | Ninguna |
| "Atrás" (paso 3) | Clic | `back()` → paso 2 | Los gustos elegidos se conservan (p. ej. "3 elegidos") | Ninguna |
| Volver a pasar por el paso 2 | `next` desde el paso 1 | — | Los gustos y los "Siguiendo" se conservan mientras no se recargue la página; los campos del paso 1 no | — |
| "Buscar amigos en mis contactos" | Clic | Nada (sin `onClick`; el DOM no cambia) | Ninguno | — |
| "Seguir" | Clic, Enter o Espacio | `flip('follow', id)` | "Seguir" (fondo #17120F, texto #FFFFFF) → "Siguiendo" (fondo #FFFFFF, texto #17120F, borde #17120F); `aria-pressed` "false" → "true". Otro clic lo devuelve | Ninguna |
| "Ir a mi feed" | Hover | — | Ninguno: queda #FFFFFF sobre #C23A24 | — |
| "Ir a mi feed" | Clic | Navega a `/inicio` (Main), siga a alguien o no | — | — |
| Recarga | F5 | Todo vuelve al estado inicial (no hay almacenamiento) | — | — |
| Error, carga, éxito | — | **No existen** en el prototipo: no hay mensajes de validación, ni estado de "Creando tu cuenta…", ni confirmación | — | — |

**Validaciones:** la única regla existente es "al menos 3 gustos" en el paso 2. Su único mensaje es el texto fijo "Elige al menos 3. Así armamos tu agenda.", que no está asociado al botón (`aria-describedby`). El paso 1 no valida nada y no tiene ningún mensaje de error. Las reglas que exige la auditoría están en "Correcciones obligatorias". El patrón de mensaje que ya existe en el producto es el del checkout de Evento: un `<p>` debajo del botón con `margin: -4px 0 0; text-align: center; font-size: .78rem; color: #6E6259` y textos como "Completa tus datos para continuar." (`Evento.dc.html:1055`, `:871`). H23 pide superarlo con errores por campo.


##### Accesibilidad ya presente

- `lang="es"` y `<title>` "Fulleventos · Crear cuenta".
- Landmarks: `<header>`, `<main>`, `<aside>` (complementario, sin nombre) y `<section aria-label="Formulario de registro">` (región con nombre). No hay `<nav>` ni `<footer>`.
- Encabezados: un `<h1>` ("Tu próximo plan empieza aquí", dentro del `<aside>`) y un `<h2>` por paso ("Crea tu cuenta", "¿Qué planes te gustan?", "Encuentra a tu gente").
- Lista ordenada (`<ol>`) para los pasos. No usa `aria-current="step"` ni texto oculto de "completado": el lector lee "✓ Tu cuenta".
- Etiquetas visibles que envuelven cada `<input>` (asociación implícita); `autocomplete="name"` y `autocomplete="email"`.
- `role="group"` con `aria-label="Gustos"` para los chips; `aria-pressed` en los 12 chips y en los 5 botones "Seguir"/"Siguiendo".
- `disabled` real en "Continuar" del paso 2 (el lector lo anuncia como atenuado, pero sale del orden de Tab; H7 pide cambiarlo).
- Todos los SVG llevan `aria-hidden="true"` y los botones tienen texto visible.
- Objetivos táctiles: 52 px (botones principales), 48 px ("Atrás", contactos), 46 px (chips), 40 px ("Seguir"), 50 px (campos).
- Contraste que sí cumple: #6E6259 sobre #FFFFFF 5,91:1; #FFFFFF sobre #C23A24 5,35:1; #17120F sobre #F6DC6A 13,6:1; #17120F sobre los avatares #F3B27E 10,16:1, #EE93BC 8,44:1, #A3A8F0 8,33:1; etiqueta pendiente (blanco al 65 % sobre #140E10) unos 8,35:1.
- axe-core (1280 px, pasos 1, 2 y 3): 0 violaciones automáticas; revisiones de contraste "incompletas" (por los degradados y fondos que axe no puede resolver): 8 en los pasos 1 y 2, y 9 en el paso 3. Los problemas reales los encontró la revisión manual (H51, H52).
- **No hay:** estilo propio de foco (`:focus-visible`), región `aria-live` para anunciar el cambio de paso, `prefers-reduced-motion` (no hace falta hoy porque no hay movimiento), `required`/`aria-required`, `aria-invalid` ni `aria-describedby`, ni texto solo para lectores de pantalla.


#### 6.2.3 Inicio (feed)

##### Estados e interacciones

**Estado inicial:** `{ tab: 'amigos', city: 'all', liked: {}, going: { p1: true }, joined: {}, follow: {} }`. Se ven 5 publicaciones; Laura arranca en "Vas" con "24 van · 3 amigos". No hay franja de ciudad ni estado vacío.

**Reglas generales:**
- No hay ninguna transición ni animación: todos los cambios de color, texto y ancho son instantáneos.
- El estado de "Me gusta", "Voy", "Unirme" y "Seguir" se guarda por `id`, así que se conserva al cambiar de pestaña o de ciudad.
- Todo se pierde al salir de la pantalla: no hay persistencia.

| Elemento | Disparador | Resultado | Cambio visual exacto | Transición |
|---|---|---|---|---|
| Selector de ciudad | Cambio de opción (ratón o teclado) | `city = valor`. Filtra las publicaciones por la ciudad del evento. La pestaña elegida se conserva. | Con publicaciones: aparece la franja de ciudad "Planes de tu gente en {Ciudad}". Sin publicaciones: aparece el estado vacío y desaparecen la franja y las publicaciones. El selector muestra el nombre elegido. Historias, columnas laterales y mini-mapa no cambian. | Ninguna |
| "Ver todo Colombia" (franja o estado vacío) | Clic | `city = 'all'` (`clearCity`). La pestaña **no** se reinicia. | Desaparece la franja o el estado vacío y vuelven las publicaciones de la pestaña. El selector vuelve a "Toda Colombia". | Ninguna |
| "Ver en el mapa" (franja) | Clic | Navega a `Mapa.dc.html` | El mapa abre en "Toda Colombia" (H42). | — |
| "Ver {ciudad} en el mapa" (estado vacío) | Clic | Navega a `Mapa.dc.html` | El mapa abre en "Toda Colombia" (H42). Hoy se lee "VerCalien el mapa" (error de espacios). | — |
| Pestañas "Amigos", "Parches abiertos", "Reseñas", "Cerca de ti" | Clic, o Enter o Espacio con foco | `tab = id`. Filtra por etiqueta. Volver a pulsar la activa no hace nada. | Activa: fondo #FFFFFF → #17120F, texto #17120F → #FFFFFF, borde #EAE1D8 → #17120F, `aria-pressed` "false" → "true". La anterior hace el cambio inverso. | Ninguna |
| "Voy" / "Vas" | Clic | Alterna `going[p.id]` | "Voy" con fondo #FFFFFF y texto #17120F → "Vas" con fondo #17120F y texto #FFFFFF (el borde #17120F no cambia). `aria-pressed` "false" → "true". El conteo sube 1 ("34 van" → "35 van"; Laura baja de "24 van" a "23 van" al quitarlo). "3 amigos" no cambia. | Ninguna |
| "Unirme al parche" / "Estás en el parche" | Clic | Alterna `joined[p.id]` | Fondo #C23A24 → #17120F, texto "Unirme al parche" → "Estás en el parche", `aria-pressed` "false" → "true". Cupos "5 de 8" → "6 de 8" con la barra de 63 % a 75 %; "4 de 6" → "5 de 6" con la barra de 67 % a 83 %. El botón crece 8 px, así que el riel se acorta (457,8 → 449,7 px a 1280). La tarjeta "Tus parches" no se actualiza. No pide confirmación ni aprobación (H30). | Ninguna |
| Me gusta | Clic | Alterna `liked[p.id]` | Color #6E6259 → #C23A24, corazón vacío → relleno (`fill: none` → `currentColor`), número +1, `aria-label` "Me gusta, 24" → "Me gusta, 25", `aria-pressed` "false" → "true". | Ninguna |
| Seguir / Siguiendo | Clic | Alterna `follow[u.id]` | "Seguir" con fondo #17120F y texto #FFFFFF → "Siguiendo" con fondo #FFFFFF y texto #17120F; el borde #17120F no cambia; el botón crece de 69,7 a 92,2 px. `aria-pressed` "false" → "true". | Ninguna |
| "Mis parches" (menú lateral) | Clic | Salta al ancla `#parches` (la URL queda con `#parches`) | Salto instantáneo, sin desplazamiento suave. La tarjeta queda arriba del todo, **tapada por el encabezado fijo** (69 px a 1280). | Ninguna |
| Campana, "Crear evento", "Etiquetar evento", "Armar parche", "Foto", "Reseña", "Publicar", "Más opciones", "Comentarios", "Compartir", "Guardar evento" | Clic | Nada (11 botones sin acción, H38) | Ninguno; el cursor es la mano (`cursor: pointer`). | — |
| Buscador del encabezado | Escribir o Enter | Nada | El texto se escribe; no hay resultados. | — |
| Campo del compositor | Escribir | Nada (no está atado al estado) | El texto se escribe en negro #000000. | — |
| Enlaces sin color propio | Hover | — | Texto e íconos `currentColor` pasan de #17120F a #C23A24. Aplica a: íconos Agenda, Mapa y Mensajes del encabezado; los 7 ítems del menú lateral (texto e ícono); nombre e iniciales de la tarjeta de perfil; nombres e iniciales de "Tus parches"; avatar "CV" del encabezado (iniciales); avatar y nombre del autor de cada publicación; título del evento adjunto; "Ver en el mapa" de la franja; nombre e iniciales de "Gente con tus gustos"; hashtag de cada tendencia. | Ninguna |
| Enlaces con color inline | Hover | — | **No cambian:** logo (#D9452F), ícono "Inicio" actual (#FFFFFF), los 3 planes de "Tu semana" (#FFFFFF), tarjeta del mini-mapa (#17120F), "Ver {ciudad} en el mapa" (#FFFFFF), nombre y ciudad de las historias, "@camivargas", subtítulos de "Tus parches", ciudad y tema de las tendencias. Las iniciales de las historias **sí** se ponen rojas. | — |
| Botones | Hover | — | Ningún cambio de color, fondo ni borde (no hay reglas `:hover` para botones). Solo el cursor de mano. | — |
| Cualquier enlace, botón o selector | Foco con teclado | — | Anillo de foco por defecto del navegador (`outline: auto 1px`, oscuro en Chromium). No hay estilo propio (ver "Correcciones obligatorias", H51). | — |
| Buscador y campo del compositor | Foco | — | **Ningún indicador** (`outline: 0`), solo el cursor de texto (H51). | — |
| Estado vacío | `posts.length === 0` | — | Ver sección 10. | — |
| Carga, error, deshabilitado y éxito | — | **No existen** en esta pantalla (H17 pide esqueletos de carga y errores con "Reintentar" en las listas). | — | — |


##### Accesibilidad ya presente

- `lang="es"` y `<title>` "Fulleventos · Inicio".
- **Puntos de referencia:**
  - `<header>` (banner) con `<nav aria-label="Principal">`;
  - `<main>` único;
  - `<aside aria-label="Tu cuenta">` con `<nav aria-label="Secciones">`;
  - `<section aria-label="Feed">`;
  - `<aside aria-label="Descubre">`.
- **Búsqueda:** contenedor con `role="search"`; campo `type="search"` con `aria-label="Buscar"`; `<select name="ciudad">` con nombre accesible "Ciudad" (texto oculto dentro de su `<label>`).
- **Página actual:** `aria-current="page"` en "Inicio" del encabezado y del menú lateral.
- **Botones y enlaces de solo ícono (o ícono + número) con nombre:** "Inicio", "Agenda de eventos", "Mapa de eventos", "Mensajes, 3 sin leer", "Notificaciones", "Tu perfil", "Más opciones", "Me gusta, N", "Comentarios, N" y "Guardar evento". "Compartir" también tiene `aria-label="Compartir"`, aunque muestra el texto visible "Compartir" (redundante, pero coincide).
- **Conteos dentro del nombre:** las insignias "3" tienen `aria-hidden="true"` porque el conteo va en el `aria-label` ("Mensajes, 3 sin leer"); "Me gusta, 24" y "Comentarios, 6" dicen el número.
- **Botones alternables con `aria-pressed`:** pestañas del feed, "Voy/Vas", "Unirme al parche/Estás en el parche", "Me gusta" y "Seguir/Siguiendo".
- **Grupos con nombre:** `role="group"` con `aria-label="Publicar un plan"` (compositor) y `aria-label="Filtrar feed"` (pestañas).
- **Etiquetas:** el campo del compositor tiene la etiqueta oculta "Publica tu plan" dentro de su `<label>`.
- **Imágenes simuladas:** la foto del evento tiene `role="img"` con `aria-label="[Foto del evento]"`; la calificación tiene `role="img"` con `aria-label="Calificación 5 de 5"`.
- **Decorativos ocultos:** todos los SVG tienen `aria-hidden="true"`; el mini-mapa completo tiene `aria-hidden="true"`, así que su enlace se llama "Ver qué pasa en todo el país".
- **Historias:** nombre accesible propio ("Sube tu plan", "Historia de Laura en Bogotá").
- **Títulos:** `<h2>` en "Tus parches", "3 planes confirmados", "Mapa de eventos", "Gente con tus gustos" y "Tendencias en Colombia".
- **Elementos nativos:** todos los controles son `<a href>`, `<button>`, `<input>` o `<select>` reales; no hay `div` clicables.
- **Objetivos táctiles:** los botones miden de 36 a 44 px de alto (acciones del compositor 36, "Más opciones" 36, "Seguir" 36, selector de ciudad 36, pestañas 38, "Voy" 38, "Ver en el mapa" y "Ver todo Colombia" de la franja 38, acciones de la publicación 40, avatar "CV" 40, encabezado 44, estado vacío 44, menú lateral 44,5). Hay enlaces más bajos: los 5 enlaces de "Tendencias en Colombia" (34,9 px) y los enlaces de texto en línea (nombre del autor 20 px, título del evento adjunto 21,2 px por línea, nombres de "Gente con tus gustos" 18 px por línea; el campo de búsqueda en sí mide 22 px, dentro de un contenedor de 44). Los enlaces en línea entran en la excepción de WCAG 2.5.8, pero en producción conviene que el avatar y el nombre de cada persona compartan un solo objetivo grande.
- **Contraste de texto:** todo el texto cumple 4,5:1, salvo el placeholder del compositor (#757575 sobre #FBF7F3: 4,32:1). Medidas de referencia:

  | Combinación | Contraste |
  |---|---|
  | Blanco sobre #C23A24 | 5,35:1 |
  | #6E6259 sobre blanco | 5,91:1 |
  | #6E6259 sobre crema | 5,54:1 |
  | #D8CEC6 sobre #17120F | 12:1 |
  | #17120F sobre #F6DC6A | 13,6:1 |
  | #D9452F (logo) sobre crema | 4,07:1 (texto grande: 24,8 px y 700) |

- **Movimiento:** no hay animaciones, así que no hace falta `prefers-reduced-motion`. Si se agregan transiciones en producción, deben respetarlo.
- **Lo que falta** (se detalla en las correcciones):
  - estilo de foco propio;
  - `h1`;
  - encabezado por publicación;
  - enlace "Saltar al contenido";
  - anuncio de los cambios del filtro (`aria-live`).
- **Resultado de axe-core** (a 1280 y 390 px): `page-has-heading-one` (1) y `label-content-name-mismatch` en 14 elementos: avatar "CV" ("Tu perfil"), "Mensajes, 3 sin leer" del menú, las 7 historias de personas y los 5 avatares de autor ("Perfil de Laura Martínez" frente al texto visible "LM").
- **Teclado:** hacen falta **40 Tabs** desde el inicio para llegar al primer elemento de la primera publicación.


#### 6.2.4 Agenda

##### Estados e interacciones

| Elemento | Disparador | Resultado | Cambio visual exacto | Transición |
|---|---|---|---|---|
| Estado inicial | Carga | `filter 'all'`, `city 'all'`, `when 'finde'`, `saved {}`, `reposted { e2: true }`, `modal null`, `target 'feed'`, `toast ''` | "Para ti", "Toda Colombia 19" y "Este finde" marcados; 19 tarjetas; "Festival de jazz al parque" con marca "Reposteaste" y botón "Reposteado" | Ninguna |
| Enlaces sin color en línea: íconos Inicio, Mapa y Mensajes; avatar "CV"; vista "Mapa"; título de tarjeta; "Ver todos los planes en el mapa" | Hover | — | Texto e ícono (`currentColor`) `#17120F` → `#C23A24`. En "CV" cambia solo el texto (el fondo sigue `#8FD3D0`). En "Ver todos los planes en el mapa" el borde inferior sigue `#17120F` | Ninguna (instantáneo) |
| Logo, ícono Agenda activo, vista "Lista", CTA "Comprar"/"Ver plan", "Ver en mi feed" | Hover | — | Sin cambio (color en línea) | — |
| Todos los `<button>` (chips, fecha, guardar, repostear, enviar, campana, "Crear evento", botones de la ventana y del aviso) | Hover | — | Sin cambio visual; solo `cursor: pointer` | — |
| Tarjeta `<article>` | Hover | — | Sin cambio (el código base tenía elevación de 3 px y sombra) | — |
| Cualquier botón, enlace o `select` | Foco con teclado | — | Solo el anillo por defecto del navegador (Chromium: `outline: auto 1px`, color del sistema; desfase 1 px en enlaces y 0 en botones). No hay estilo propio (H51) | — |
| Campo de búsqueda y `textarea` de la ventana | Foco | — | **Ningún indicador** (`outline: 0`); el borde del contenedor no cambia (H51) | — |
| Campo de búsqueda | Escribir / Enter | Nada | — | — |
| Selector de ciudad del encabezado | `change` | `city = valor` | Título "Este finde en {Ciudad}", chip correspondiente marcado, conteo y lista filtrados. La fila de chips **no** se desplaza para mostrar el chip marcado (p. ej. "Leticia" queda fuera de vista) | — |
| Chip de ciudad | Clic | `city = id` | Chip: fondo/borde `#FFFFFF`/`#EAE1D8` → `#17120F`/`#17120F`, texto `#17120F` → `#FFFFFF`, contador `#F3ECE5` → `#F6DC6A`; el chip anterior vuelve a apagado; `aria-pressed` cambia; el `<select>` muestra la misma ciudad | — |
| Chip de categoría | Clic | `filter = id` | Mismo cambio de colores (sin contador); los contadores de los 12 chips de ciudad se recalculan | — |
| "Hoy" / "Este finde" / "Próxima semana" | Clic | `when = id` | Solo cambia el botón marcado (`transparent`/`#17120F` → `#17120F`/`#FFFFFF`) y su `aria-pressed`. Título, conteos y lista **no cambian** (H39) | — |
| Vista "Lista" / ícono Agenda | Clic | Recarga `Agenda.dc.html` | Se pierde todo el estado | — |
| Vista "Mapa" / "Ver todos los planes en el mapa" | Clic | Navega a `Mapa.dc.html` | Mapa en "Toda Colombia" | — |
| Filtros sin resultados | Combinación con 0 eventos | `empty = true` | Aparece el recuadro punteado con el mensaje y "Ver todos los planes del país"; la línea dice "0 planes en {Ciudad} este finde" | — |
| "Ver todos los planes del país" | Clic | `city 'all'`, `filter 'all'` | Vuelve a "Toda Colombia" + "Para ti" con 19 planes; la fecha marcada no cambia | — |
| Corazón "Guardar {título}" | Clic | Invierte `saved[id]` | `aria-pressed` `false` → `true`; color `#17120F` → `#C23A24`; `fill` `none` → `currentColor`. Otro clic lo revierte. Se conserva al cambiar filtros | — |
| "Repostear" (tarjeta no reposteada) | Clic | `modal = id`, `target = 'feed'` | Se abre la ventana centrada sobre un fondo `rgba(23,18,15,.55)`. El foco **se queda en el botón de la tarjeta**, detrás del fondo (H7) | Ninguna (aparece de golpe) |
| Opción de destino | Clic | `target = id` | La elegida: borde `#EAE1D8` → `#17120F`, fondo `#FFFFFF` → `#FBF7F3`, punto `transparent` → `#17120F`, `aria-pressed="true"`; las otras vuelven a apagadas. Lo escrito en el comentario se conserva mientras la ventana siga abierta | — |
| "Cerrar" (X) / "Cancelar" | Clic | `modal = null` | Se cierra la ventana; no hay repost. El foco cae al `body` (se pierde). Al volver a abrir, el comentario está vacío y "En mi feed" vuelve a estar marcado | — |
| Escape / clic en el fondo oscuro | Teclado / clic | **Nada** (H7) | La ventana sigue abierta | — |
| Tab con la ventana abierta | Teclado | El foco recorre la página de fondo | Hacen falta 92 Tabs desde el botón "Repostear" de la primera tarjeta para entrar a la ventana; al salir de "Repostear" (último botón) el foco vuelve al encabezado de la página (H7) | — |
| "Repostear" (dentro de la ventana) | Clic | `reposted[id] = true`, `modal = null`, `toast = 'Reposteaste «…» en …'` | La tarjeta muestra la marca amarilla "Reposteaste", el botón pasa a "Reposteado" (fondo `#17120F`, texto `#FFFFFF`, `aria-pressed="true"`) y la línea social pasa a "Tú, {who} y {n} más lo repostearon". Aparece el aviso negro arriba de la línea de resultados (si ya había uno, se reemplaza su texto). Lo escrito en el comentario se descarta. El foco cae al `body` | Ninguna. Si el usuario está abajo en la lista, el aviso queda fuera de la pantalla (medido a 390 al repostear "Rock en el Movistar Arena": entre 7.516 y 7.734 px por encima de la vista, según dónde haya quedado el desplazamiento); el navegador compensa el desplazamiento y la tarjeta no salta |
| "Reposteado" (tarjeta ya reposteada) | Clic | Borra `reposted[id]` y `toast = ''` | Sin confirmación: la tarjeta vuelve a "Repostear" (blanco), desaparece la marca, la línea vuelve a "{who} y {n} más lo repostearon" y **se cierra cualquier aviso abierto**, aunque sea de otro evento | — |
| "Cerrar aviso" (X) | Clic | `toast = ''` | Desaparece el aviso; el contenido sube | — |
| "Ver en mi feed" | Clic | Navega a `Main.dc.html` | El repost no aparece en el feed (limitación del prototipo) | — |
| "Enviar a un amigo", "Notificaciones", "Crear evento" | Clic | Nada (H38) | — | — |
| Validaciones, error, carga | — | No existen en esta pantalla | No hay estados de carga, error ni "sin conexión" (H17). El repost no tiene validación (el comentario es opcional) | — |


##### Accesibilidad ya presente

- `lang="es"`; `<title>` "Fulleventos · Agenda"; un solo `<main>`; `<header>` y `<footer>`; un único `<h1>` ("Este finde en {Ciudad}") y un `<h2>` en la ventana.
- Navegaciones con nombre: `<nav aria-label="Principal">` y `<nav aria-label="Vista">`; `aria-current="page"` en el ícono de Agenda y en "Lista".
- Buscador con `role="search"`, campo con `aria-label="Buscar eventos"`; `select` con etiqueta oculta "Ciudad" (técnica de texto visualmente oculto con `clip`).
- Íconos sin texto con nombre: "Inicio", "Agenda de eventos", "Mapa de eventos", "Mensajes, 3 sin leer" (la insignia "3" está `aria-hidden` y el dato va en el nombre), "Notificaciones", "Tu perfil", "Cerrar aviso", "Cerrar", "Enviar a un amigo". Todos los SVG llevan `aria-hidden="true"`.
- Grupos con nombre: `role="group"` con `aria-label` "Fecha", "Filtrar por ciudad" y "Filtrar por categoría".
- Estados de alternancia con `aria-pressed` en fecha, chips de ciudad y categoría, guardar, repostear y destinos de la ventana.
- Chips de ciudad con nombre que incluye el conteo y el singular/plural correcto ("Barranquilla, 1 plan"). axe-core marca `label-content-name-mismatch` en 12 nodos (el avatar "CV" → "Tu perfil" y 11 chips de ciudad, porque el texto visible es "Toda Colombia19" sin separador); ver H59.
- Nombres de acción específicos por tarjeta: "Guardar {título}", "Comprar boletas para {título}" o "Ver plan: {título}".
- Marcadores de imagen con `role="img"` y `aria-label="[Foto del evento]"` (texto de marcador, no definitivo).
- Aviso con `role="status"` (aparece junto con su contenido, un patrón que varios lectores no anuncian, H49).
- Ventana con `role="dialog"`, `aria-modal="true"` y `aria-label="Repostear evento"`; `textarea` con etiqueta oculta "Comentario"; destinos agrupados en `<fieldset>` con `<legend>` "¿Dónde lo compartes?".
- Tamaños táctiles: 44 px (íconos del encabezado, guardar, "Crear evento", botón del estado vacío), 42 px (chips), 40 px (avatar, CTA, repostear, enviar, cerrar ventana), 38 px (vista y fecha), 36 px (cerrar aviso), 46 px (botones de la ventana), 52 px (destinos). Todos superan los 24 px de WCAG 2.5.8.
- Movimiento: no hay animaciones ni transiciones, así que `prefers-reduced-motion` no aplica hoy (si se agregan, respetarlo como en Mapa y Chat).
- Lo que **no** hay: estilo de foco propio, enlace "Saltar al contenido", encabezados por tarjeta, región viva para los cambios de resultados, manejo de foco en la ventana.


#### 6.2.5 Mapa

##### Estados e interacciones

**Estado inicial:** `{ city: null, zoom: 1, filter: 'all', when: 'finde', saved: {}, reposted: { e2: true } }`. Se ve:
- "Toda Colombia" marcado, zoom "1×" con "Alejar" deshabilitado y 11 pines amarillos.
- El panel en "TODO EL PAÍS / Toda Colombia · 19 planes" con 19 tarjetas agrupadas por ciudad.
- "Este finde" y "Todo" marcados, y "Toda Colombia" en el selector del encabezado.

**Reglas generales:**
- Hay tres funciones de estado:
  - `resetMap()` → `{ city: null, zoom: 1 }`.
  - `pickCity(id)` → `{ city: id, zoom: Math.max(zoomActual, 2) }`: elegir una ciudad nunca aleja; si ya estaba en 2,5× o 3×, se queda ahí.
  - Zoom: paso 0,5, mínimo 1, máximo 3.
- El filtro de categoría **no** borra la ciudad ni el zoom. Si la ciudad elegida queda sin planes, su pin desaparece pero el mapa sigue centrado en ella, y el panel muestra el estado vacío.
- Elegir en el selector del encabezado una ciudad sin planes para la categoría activa también centra el mapa en un lugar sin pin.
- Guardar y repostear se guardan por `id` de evento, así que se conservan al cambiar de filtro o de ciudad. Se pierden al salir: no hay persistencia, y Agenda y Main no se enteran (en producción es estado del usuario, compartido entre pantallas).
- Ningún cambio desplaza la página a propósito ni anuncia nada al lector de pantalla (H42, H49). Pero cuando la lista se acorta (al elegir ciudad o filtrar), la página baja de alto y el navegador recorta el scroll: el usuario queda en un punto arbitrario, sin ver ni el mapa ni la lista (a 390, de 5913 a 1191 px tras "Ver en el mapa: Leticia"; es la evidencia de H42).

| Elemento | Disparador | Resultado | Cambio visual exacto | Transición |
|---|---|---|---|---|
| Selector de ciudad (encabezado) | Cambio de opción | Una ciudad → `pickCity(id)`. "Toda Colombia" (`all`) → `resetMap()` | Igual que tocar el pin de esa ciudad o "Toda Colombia". El selector muestra la ciudad. | Las del mapa (abajo) |
| Buscador | Escribir, Enter | Nada | Ninguno. **Sin** indicador de foco (`outline: 0`, H51); solo se ve el cursor de texto. | — |
| Íconos "Inicio", "Agenda de eventos", "Mensajes" | Hover | — | El ícono pasa de #17120F a #C23A24 (regla global `a:hover`). Sin fondo. La insignia "3" no cambia. | Ninguna |
| Ícono "Mapa de eventos" (actual) | Hover | — | Ninguno (color blanco inline). | — |
| Avatar "CV" | Hover | — | Las letras "CV" pasan a #C23A24; el círculo #8FD3D0 no cambia. | Ninguna |
| Logo | Hover | — | Ninguno (color inline #D9452F). | — |
| "Notificaciones", "Crear evento" | Clic | Nada (H38) | Ninguno. No hay hover en ningún botón de la pantalla. | — |
| "Hoy" / "Este finde" / "Próxima semana" | Clic | `when = id` | El elegido pasa a fondo #17120F y texto #FFFFFF, con `aria-pressed="true"`; el anterior vuelve a transparente con #17120F. **Nada más cambia**: ni el resumen, ni las tarjetas, ni el título (H39). | Ninguna |
| Chip de categoría | Clic | `filter = id` | Chip: fondo #FFFFFF → #17120F, texto → #FFFFFF, borde #EAE1D8 → #17120F. Cambian el resumen ("6 planes en 5 ciudades, …"), la leyenda, los pines (aparecen o desaparecen y cambian de tamaño), los conteos de los encabezados de ciudad, la lista y el ranking. La ciudad y el zoom se conservan. | Ninguna intencional: los pines cambian de tamaño, aparecen y desaparecen de golpe. En el prototipo hay un artefacto que no se debe copiar: los pines se reutilizan por posición en la lista, así que el botón de un pin desplazado se desliza 460 ms desde el desplazamiento (`ox`/`oy`) del pin que antes ocupaba esa posición (ver "Detalles finos"). |
| "Toda Colombia" (control del mapa) | Clic | `resetMap()`, aunque ya esté marcado; también devuelve el zoom a 1× si se había acercado sin ciudad | Se marca blanco y "Mi ciudad" vuelve a translúcido. El pin elegido vuelve a amarillo, el mapa vuelve al país completo, el panel vuelve a "TODO EL PAÍS / Toda Colombia · N planes" con encabezados de ciudad y "Ver en el mapa", el selector vuelve a "Toda Colombia" y el ranking se desmarca. | `transform` 460 ms `cubic-bezier(.22,.8,.24,1)` |
| "Mi ciudad: Bogotá" | Clic | `pickCity('bogota')`. **No alterna** (los pines y el ranking sí alternan): si ya está marcado y el zoom es 2× o más, no pasa nada; si se había alejado a 1× o 1,5× con Bogotá elegida, vuelve a 2× y la centra (verificado) | Botón blanco con texto #17120F; "Toda Colombia" translúcido; Bogotá en rojo con halo y centrada a 2× (`translate(-33.60%, -44.80%) scale(2)`); panel "CIUDAD ELEGIDA / Bogotá · 6 planes". | 460 ms |
| "Acercar" | Clic | `zoom + 0,5` hasta 3 | Etiqueta "1×" → "1,5×" → "2×" → "2,5×" → "3×". El mapa escala hacia el centro, o hacia la ciudad si hay una. Pines y etiquetas mantienen su tamaño. Los pines desplazados se acercan a su sitio real y las líneas guía se acortan. En 3×, "Acercar" queda `disabled` (opacidad 0,4) y **el foco se pierde** al `body` (H7). | `transform` 460 ms curva `(.22,.8,.24,1)`; pines `left`/`top` 460 ms `ease`; líneas `width` 460 ms `ease` |
| "Alejar" | Clic | `zoom − 0,5` hasta 1. **No** borra la ciudad | Inverso de "Acercar". En 1× queda `disabled` y se pierde el foco. Con ciudad elegida, a 1,5× la ciudad queda a medio camino del centro y a 1× el mapa muestra el país completo con el pin todavía rojo y el panel todavía en la ciudad. | Igual |
| Pin no elegido | Clic, Enter o Espacio | `pickCity(id)` | Pin: #F6DC6A → #C23A24, número #17120F → #FFFFFF, sombra → doble halo rojo, nombre en pastilla blanca con texto #17120F y `z-index` 60. El anterior elegido vuelve a amarillo. El mapa centra la ciudad a 2× (o al zoom actual si era mayor). "Toda Colombia" se desmarca y "Mi ciudad" se marca solo si es Bogotá. El selector del encabezado cambia. El panel muestra solo esa ciudad, sin encabezados de grupo ni "Ver en el mapa", y con "Ver todo Colombia". El ranking marca la ciudad en negro. | Mapa 460 ms; color del pin 200 ms; sombra 200 ms |
| Pin elegido | Clic | `resetMap()` (alterna) | Todo vuelve al estado "Toda Colombia" a 1×. | Igual |
| Pin | Foco con teclado | — | Anillo `outline: 3px solid #F6DC6A; outline-offset: 2px` (amarillo por estar en `data-fe="dark"`). Al recorrer con Tab, el navegador desplaza el marco para mostrar el pin y el mapa queda descuadrado (H50). | — |
| Pin | Hover | — | Ninguno, aparte del cursor de mano. | — |
| "Ver todo Colombia" (cabecera del panel o estado vacío) | Clic | `resetMap()` | Igual que "Toda Colombia". | 460 ms |
| Título del evento | Hover | — | Texto #17120F → #C23A24, sin subrayado. | Ninguna |
| Título del evento / "Comprar" / "Ver plan" | Clic | Navega a `Evento.dc.html` | "Comprar" no cambia con hover (color blanco inline). El código base tenía `.ticket:hover { background: #BF3923 }`. | — |
| "Repostear" | Clic | Alterna `reposted[id]`. Instantáneo: sin ventana, sin confirmación y sin aviso (en Agenda abre una ventana, H41) | "Repostear" con fondo #FFFFFF y texto #17120F ↔ "Reposteado" con fondo #17120F y texto #FFFFFF. Borde #17120F fijo. `aria-pressed` cambia. El ancho del botón cambia con el texto. | Ninguna |
| Guardar (corazón) | Clic | Alterna `saved[id]` | Corazón vacío #17120F ↔ relleno #C23A24 (`fill: currentColor`). `aria-pressed` cambia. El borde #EAE1D8 no cambia. | Ninguna |
| "Ver en el mapa" | Clic | `pickCity(ciudadDelEvento)` | Mismo resultado que tocar el pin. Todos los botones "Ver en el mapa" desaparecen, así que **el foco se pierde** (cae al `body`, verificado). **No** hace scroll al mapa: a 390 y 768 el usuario no ve el cambio (H42). A 390, la página se acorta y el scroll queda recortado (de 5913 a 1191 px con Leticia), con el mapa fuera de la vista. | 460 ms |
| "Ver todas las categorías" (estado vacío) | Clic | `filter = 'all'` | "Todo" se marca y la lista vuelve a llenarse con la ciudad elegida. | — |
| Chip del ranking no elegido | Clic | `pickCity(id)` | Chip negro con texto blanco (burbuja amarilla fija) y el resto igual que tocar el pin. No hace scroll hacia el mapa. | 460 ms |
| Chip del ranking elegido | Clic | `resetMap()` | Vuelve a blanco. | 460 ms |
| Panel lateral (1100 px o más) | Rueda o arrastre | Scroll interno de la lista | La cabecera queda quieta. | — |
| Cualquier botón, enlace o `select` fuera del panel oscuro | Foco con teclado | — | `outline: 3px solid #C23A24; outline-offset: 2px`. | — |
| Usuario con `prefers-reduced-motion: reduce` | — | — | Las 33 transiciones `[data-fx]` pasan a `none`: zoom, centrado, cambio de color del pin y líneas guía cambian de golpe. | Ninguna |

**Estados que no existen en el prototipo y hay que diseñar o implementar:** carga (esqueleto del mapa y de la lista), error con "Reintentar" (H17), sin resultados para "Hoy" o "Próxima semana" (H39), sin conexión, y la versión de visitante (H33).


##### Accesibilidad ya presente

La auditoría lo destaca como "Mapa accesible": conservarlo.
- `<html lang="es">`, un único `<main>`, un `<h1>` ("Todo lo que pasa en Colombia este finde"), `<h2>` en el panel ("Toda Colombia · 19 planes") y en "Ciudades con más planes", y `<h3>` por ciudad en la lista.
- **Regiones:**
  - `role="search"` en el buscador; `<nav aria-label="Principal">` con `aria-current="page"` en "Mapa de eventos".
  - `<section aria-label="Mapa de Colombia con los eventos">`, `<aside aria-label="Planes en el mapa">` y `<section aria-labelledby="fe-ciudades">`.
  - Grupos con nombre: `role="group"` con `aria-label` "Fecha", "Filtrar por categoría", "Zoom del mapa" y "Ciudades".
- **Nombres accesibles:**
  - Buscador "Buscar eventos" y selector "Ciudad" (con etiqueta visualmente oculta).
  - Íconos del encabezado: "Inicio", "Agenda de eventos", "Mapa de eventos", "Mensajes, 3 sin leer" (la insignia es `aria-hidden`), "Notificaciones" y "Tu perfil".
  - Pines: "Bogotá, 6 eventos". Zoom: "Alejar" y "Acercar". Guardar: "Guardar {título}". CTA: "Comprar boletas para {título}" o "Ver plan: {título}". "Ver en el mapa: {ciudad}".
- **Estados:** `aria-pressed` en fecha, categorías, "Toda Colombia", "Mi ciudad", pines, ranking, "Repostear" y Guardar. `disabled` en el zoom en sus límites.
- **Lista como alternativa en texto del mapa:** el `<h3>` de cada ciudad lleva un ", " oculto para que se lea "Bogotá, 6 planes".
- **Decorativos ocultos:** la silueta SVG, la retícula, las etiquetas geográficas, las líneas guía y todos los íconos SVG llevan `aria-hidden="true"`. La "foto" lleva `role="img" aria-label="[Foto del evento]"` (marcador: en producción, el texto alternativo real de la foto).
- **Foco visible:** 3 px #C23A24 con separación de 2 px en botones, enlaces y `select`; amarillo #F6DC6A dentro del panel oscuro. **Falta** en el campo de búsqueda (H51).
- **Objetivos táctiles:** pines de 36 px o más; botones de 36 a 44 px.
- **Movimiento reducido:** `prefers-reduced-motion` quita las 33 transiciones.
- **Lo que falta:**
  - región viva (H49);
  - `radiogroup` para la fecha (H59);
  - "Saltar al contenido" (H59);
  - nombre que empiece por el texto visible en el avatar ("CV, tu perfil") y en los pines (axe `label-content-name-mismatch`: 12 casos, el avatar y los 11 pines; el visible es "6 Bogotá" y el nombre "Bogotá, 6 eventos");
  - nombre del chip del ranking: hoy se lee "Bogotá 6", sin la palabra "planes".


#### 6.2.6 Evento y compra

##### Estados e interacciones

**Estado inicial** (`constructor`, `:885-893`). En producción, lo que aquí es estado local pasa a ser estado del servidor (asistencia, interés, seguimiento, membresías, reservas, órdenes) o del formulario:

| Clave | Valor inicial | Qué controla |
|---|---|---|
| `tab` | `'parches'` | Pestaña "Parches (3)" / "Muro (24)". |
| `going` | `false` | "Voy" / "Vas a ir" y el conteo 186/187. |
| `interested` | `false` | "Me interesa". |
| `org` | `false` | "Seguir" / "Siguiendo". |
| `joined` | `{}` | Parches a los que se unió (por id). |
| `copied` | `false` | "Copiar dirección" / "Dirección copiada". |
| `loc` | `'general'` | Localidad elegida (sincronizada en plano, lista, tarjeta y ventana). |
| `qty` | `2` | Cantidad con "Solo para mí". **H22: debe arrancar en 1.** |
| `open` | `false` | Ventana de compra abierta. |
| `step` | `1` | Paso de la compra (1 a 4). |
| `forWho` | `'me'` | "Solo para mí" (`'me'`) o "Para mi parche" (`'parche'`). |
| `picked` | `{ lm: true }` | Amigos elegidos: Laura viene elegida. |
| `split` | `false` | Interruptor "Dividir el pago". |
| `name` | `'Camila Vargas'` | Nombre completo. |
| `docType` | `'CC'` | Tipo de documento. |
| `docNum` | `''` | Número de documento (vacío: es lo que falta en el paso 2). |
| `email` | `'camila.vargas@correo.co'` | Correo. |
| `phone` | `'300 123 4567'` | Celular. |
| `attendees` | `{}` | Nombres opcionales de asistentes, por número de boleta. |
| `method` | `''` | Medio de pago (ninguno). |
| `bank` | `''` | Banco PSE (ninguno). |
| `persona` | `'natural'` | Tipo de persona PSE: `'natural'` ("Natural") o `'juridica'` ("Jurídica"). |
| `walletPhone` | `'300 123 4567'` | Celular de Nequi/Daviplata. |
| `terms` | `false` | Casilla de términos. |
| `purchased` | `null` | Última compra (una sola; H26). |
| `calAdded` | `false` | "Agregar al calendario". |

**Ninguna interacción de la pantalla tiene transición ni animación:** todos los cambios (colores, textos, perilla del interruptor, paneles, pasos) son instantáneos. Si en producción se agregan transiciones, deben anularse con `prefers-reduced-motion: reduce`, como hace el código base con `.card`.

| Elemento | Disparador | Resultado | Cambio visual exacto | Transición |
|---|---|---|---|---|
| Enlaces sin `color` inline: "Volver al feed", íconos del encabezado, avatar "CV", "Ver localidades", "Ver parches", atajos de sección, "Escribir al organizador", "Ver más planes en el mapa", títulos de planes parecidos, "Ver las 128 fotos", avatares del muro y "Ver mis boletas" | `:hover` | — | Texto e íconos (`currentColor`) #17120F → **#C23A24**. Los bordes inferiores de los enlaces subrayados **siguen** #17120F; los fondos no cambian. | Ninguna |
| Enlaces con `color` inline: logo (#D9452F), "Ver en el mapa" (#FFFFFF) y "Avisar a mi parche" (#FFFFFF) | `:hover` | — | Sin cambio visible. | — |
| Todos los `<button>` | `:hover` | — | **Sin estilo de hover**: solo `cursor: pointer`. El código base sí tiene hover en sus botones (`.ticket:hover` → `--brand-hover`, `.btn-dark:hover` → #33291F, `.chip:hover` → borde `--ink`), pero el prototipo no lo usa: decisión abierta para producción. | — |
| `button`, `a`, `input`, `select` | `:focus-visible` (teclado) | — | `outline: 3px solid #C23A24; outline-offset: 2px`. El foco del mouse no muestra contorno. Ningún campo tiene `outline: 0`, así que todos muestran el foco (el patrón que H51 pide copiar a las demás pantallas). | Ninguna |
| Botones `disabled` (−/+, "Continuar"/"Pagar", chips de miembros, interruptor) | Estado | No responden | `opacity: .45; cursor: default`. El rojo #C23A24 al 45 % sobre blanco se ve rosado. | — |
| "Voy" | Clic | `going` alterna. El conteo pasa de 186 a 187 en el héroe y en "quién va". | Fondo #FFFFFF → #17120F; texto e ícono #17120F → #FFFFFF; texto "Voy" → "Vas a ir"; `aria-pressed` false → true. Se puede volver a "Voy" aunque ya se haya comprado (H26). | Ninguna |
| "Me interesa" | Clic | `interested` alterna. "340 interesados" **no** cambia (H26). | Texto e ícono #17120F → #C23A24; estrella sin relleno → rellena; `aria-pressed` false → true. Fondo y borde (#EAE1D8) no cambian. | Ninguna |
| "Invitar amigos", Compartir, Notificaciones, "Armar parche", "Enviar" (muro) | Clic | Nada (sin `onClick`, H38) | — | — |
| Atajos de sección y "Ver localidades" / "Ver parches" | Clic / Enter | Salto al ancla y cambio del `hash` | La sección queda a 140 px del borde superior (`scroll-margin-top`). Sin desplazamiento suave (`scroll-behavior: auto`). | Ninguna |
| Zona del plano (VIP izquierda o derecha, Preferencial, General) | Clic / Enter / Espacio | `pickLoc(id)`: `loc` = la zona. Además recorta `picked` a los primeros `capFor(loc)` amigos elegidos (3 en VIP, 7 en las demás), sin aviso (H24). | Zona elegida: fondo tinte → color pleno (#B9E07A / #A3A8F0 / #F6DC6A), borde transparente → 2 px #17120F, sombra `0 6px 18px rgba(23,18,15,.18)` e insignia de visto. Las dos VIP se encienden juntas. Al mismo tiempo cambian la lista, la tarjeta lateral, la barra móvil y la ventana. | Ninguna |
| Opción de la lista de precios | Clic | Igual que la zona | Opción elegida: fondo #FFFFFF → tinte (#E8F4D6 / #E3E5FB / #FBF1C6); borde 1.5 px #EAE1D8 → #17120F. | Ninguna |
| Opción de localidad de la tarjeta lateral o de la ventana (paso 1) | Clic | Igual que la zona | Fondo → tinte; borde → #17120F; punto del radio transparente → #17120F. | Ninguna |
| Pestaña "Parches (3)" / "Muro (24)" | Clic | `tab` cambia; se muestra el panel correspondiente | Pestaña activa: texto #6E6259 → #17120F y subrayado de 3 px transparente → #C23A24; `aria-selected` "false" → "true". Las flechas del teclado **no** mueven entre pestañas (H59); las dos están en el orden de Tab. | Ninguna |
| "Unirme" | Clic | `joined[id]` alterna; cupos usados +1 (6 → 7 de 8, barra 75 % → 88 % en "Salseros de jueves") | Fondo #C23A24 → #17120F; "Unirme" → "Estás dentro"; `aria-pressed` → "true". Entra sin aprobación (H30); a Camila se le ofrece "Unirme" a "Salseros de jueves" aunque ya es miembro (H25). | Ninguna |
| Campo del muro | Escritura | Se escribe en el campo (no controlado) | Texto negro #000000, 15,2 px. | — |
| "Copiar dirección" | Clic | `copied = true`, **sin vuelta atrás** (un segundo clic no cambia nada). No copia al portapapeles. | Texto "Copiar dirección" → "Dirección copiada"; `aria-pressed` → "true". Colores iguales. | Ninguna |
| "Seguir" (organizador) | Clic | `org` alterna. "12,4 mil seguidores" no cambia. | Fondo #17120F → #FFFFFF; texto #FFFFFF → #17120F; "Seguir" → "Siguiendo". El borde #17120F se mantiene. | Ninguna |
| "−" / "+" (tarjeta lateral y paso 1) | Clic | `qty` = `max(1, qMe − 1)` o `min(loc.max, qMe + 1)`. El número se anuncia (`aria-live="polite"`). | "−" deshabilitado en 1; "+" deshabilitado en 8 (General y Preferencial). Con Mesa VIP (máximo 1) los dos quedan deshabilitados y se muestra 1. Con "Para mi parche" los dos quedan deshabilitados y la cantidad es 1 + amigos. Al deshabilitarse, el botón pierde el foco (H7). | Ninguna |
| "Comprar boletas" / "Comprar más boletas" (tarjeta) y "Comprar" (barra) | Clic | `open = true`. Si la ventana estaba en el paso 4 (ya se compró), vuelve al paso 1 y reinicia `terms`, `method`, `bank` y `split`; conserva todo lo demás (localidad, cantidad, "¿Para quién?", amigos, nombre, documento, correo, celular, nombres de asistentes, tipo de persona PSE, celular de Nequi/Daviplata y `calAdded`, así que en la segunda compra el paso 4 ya muestra "Agregado al calendario"). Si se había cerrado en el paso 2 o 3, reabre en ese paso con lo escrito. | Aparece la ventana con el fondo oscuro. El foco **se queda** en el botón que la abrió (H7). | Ninguna |
| "Ver boleta" (tarjeta y barra, solo con compra) | Clic | `open = true; step = 4`. Si había otra compra a medias, la interrumpe (H26). | Ventana en el paso 4 con la boleta de la última compra. | Ninguna |
| Fondo oscuro de la ventana | Clic | `open = false` | La ventana desaparece. El estado se conserva. El foco cae al `body` (H7). | Ninguna |
| "Cerrar la compra" (X) | Clic | `open = false` | Igual. | Ninguna |
| Escape | Tecla, con el foco **dentro** de la ventana | `open = false` | Igual. Con el foco fuera de la ventana (por ejemplo, recién abierta) Escape no hace nada (H7). | — |
| "Solo para mí" / "Para mi parche" | Clic | `forWho` cambia. Con parche: cantidad = 1 + amigos (o 1 mesa en VIP), el bloque "Cantidad" se oculta y aparece el bloque del parche. | Opción elegida: fondo transparente → #17120F; título #17120F → #FFFFFF; subtítulo #6E6259 → `rgba(255,255,255,.78)`. | Ninguna |
| Chip de miembro | Clic | Alterna en `picked`. Tope: 7 amigos en General/Preferencial y 3 en VIP. Al llegar al tope, los no elegidos se deshabilitan. | Elegido: borde #EAE1D8 → #17120F, fondo #FFFFFF → #FBF7F3 y visto a la derecha; "Van N" se actualiza. Deshabilitado: opacidad .45. | Ninguna |
| Interruptor "Dividir el pago" | Clic | `split` alterna. Solo tiene efecto si hay al menos 1 amigo. | Pista #D9CEC3 → #C23A24; perilla `left` 3 px → 21 px; `aria-checked` → "true"; aparece la nota "Tú pagas 1 de N · $X." y la fila amarilla en el resumen; el botón de pago pasa a "Pagar {parte}". Sin amigos: deshabilitado (opacidad .45) y mostrado apagado, pero `split` conserva su valor y **se vuelve a encender solo** al elegir un amigo. | **Ninguna** (la perilla salta) |
| "Continuar" (paso 1) | Clic | Paso 2. **Bloqueo:** "Para mi parche" sin amigos → deshabilitado, con la pista **"Elige al menos un amigo del parche."** | Pasos: el 1 pasa a hecho (verde con visto) y el 2 a actual (negro). El scroll del contenedor **no** vuelve arriba (H6). | Ninguna |
| Campos del paso 2 | Escritura (`onChange` en cada tecla) | Actualizan `name`, `docType`, `docNum`, `email`, `phone` y `attendees[n]` | — | — |
| "Continuar al pago" (paso 2) | Clic | Paso 3. **Bloqueo:** si `docNum` está vacío → **"Escribe tu número de documento para continuar."**; si el documento está lleno pero falta nombre, correo o celular → **"Completa tus datos para continuar."** Solo se valida que no estén vacíos (con `trim`): "no-es-un-correo" pasa (H23). | Botón deshabilitado y pista debajo mientras falte algo. | Ninguna |
| "Atrás" (pasos 2 y 3) | Clic | `step − 1`, con lo escrito conservado | — | Ninguna |
| Medio de pago | Clic | `method` = el medio; aparece su panel | Elegido: borde #EAE1D8 → #17120F más sombra interior de 1 px #17120F; punto del radio → #17120F. | Ninguna |
| "Banco" (PSE) | Cambio | `bank` = valor | — | — |
| "Natural" / "Jurídica" | Clic | `persona` cambia | Elegido: fondo #17120F y texto #FFFFFF; el otro: transparente y #17120F. | Ninguna |
| Celular de Nequi/Daviplata | Escritura | `walletPhone` | No se valida: se puede pagar con el campo vacío (H23). | — |
| Casilla de términos | Clic / Espacio / Enter (es un `button`) | `terms` alterna | Cuadro: borde #17120F / fondo #FFFFFF → borde y fondo #C23A24 con visto blanco; `aria-checked` → "true". | Ninguna |
| "Pagar $X" (paso 3) | Clic | **Bloqueos**, en este orden: sin medio → **"Elige cómo quieres pagar."**; PSE sin banco → **"Elige tu banco para pagar con PSE."**; sin términos → **"Acepta los términos y la política de datos para pagar."** Si todo está, pasa al paso 4 **al instante** (sin estado "procesando", H2 y H17), guarda `purchased` y pone `going = true`. | Paso 4: los 4 pasos en verde, sin temporizador ni pie. El botón desaparece con el foco encima (H7). | Ninguna |
| "Agregar al calendario" | Clic | `calAdded` alterna. No genera ningún archivo `.ics` ni enlace. | Fondo #FFFFFF → #17120F; texto #17120F → #FFFFFF; "Agregar al calendario" → "Agregado al calendario". | Ninguna |
| "Volver al evento" | Clic | Cierra la ventana (queda en el paso 4) | — | — |
| Estado después de comprar | Automático | La tarjeta lateral muestra el bloque `role="status"` (por ejemplo, "Tienes 2 boletas · General" / "También te llegaron al correo" / "Ver boleta"); el botón dice "Comprar más boletas"; la barra móvil muestra "Tienes 2 boletas · General" y el botón "Ver boleta"; "Voy" queda en "Vas a ir" y el conteo en 187. | — | Ninguna |

**Estados que existen en el prototipo:** inicial; elegido o presionado (`aria-pressed`, `aria-selected`, `aria-checked`); deshabilitado (opacidad .45); éxito (paso 4 y bloque "Tienes N boletas"); "pendiente" (pagos del parche). **Estados que no existen y que hay que diseñar** (H17): pago procesando, esperando aprobación en Nequi o Daviplata, redirección y regreso de PSE o Bancolombia, pago rechazado, pago en verificación, reserva vencida, localidad agotada, carga y error de red. Tampoco hay mensajes de error por campo (H23), estado vacío del muro, ni confirmación antes de quitar "Voy" teniendo boletas (H26).

**Fórmulas** (`renderVals`, `:897-1300`):
- `cop(n) = '$' + Math.round(n).toLocaleString('es-CO')` → "$45.000", "$97.200", "$172.800" (punto de miles, sin espacio después de "$", sin decimales).
- `FEE_RATE = 0.08` (cargo de demostración).
- `capFor(l) = l.seats > 1 ? l.seats − 1 : l.max − 1` → 7 (General), 7 (Preferencial), 3 (VIP).
- `k` = amigos elegidos, recortados a `capFor(loc)`.
- `qMe = min(max(qty, 1), loc.max)`.
- `q = parche ? (VIP ? 1 : 1 + k) : qMe`.
- `persons = q × loc.seats` (en VIP, 1 mesa = 4 personas).
- `subtotal = q × loc.price`; `fee = Math.round(subtotal × 0.08)`; `total = subtotal + fee`.
- `split = parche && s.split && k > 0`; `splitN = 1 + k`; `share = split ? Math.round(total / splitN) : total`.
- Ejemplos verificados:

  | Caso | Resumen | Cargo | Total | Paga Camila |
  |---|---|---|---|---|
  | 2 General | "2 × General ($45.000)" $90.000 | $7.200 | $97.200 | $97.200 |
  | 1 General | $45.000 | $3.600 | $48.600 | $48.600 |
  | Parche + Laura, dividido | "2 × General ($45.000)" $90.000 | $7.200 | $97.200 | "Tú pagas 1 de 2" $48.600 |
  | Parche + 7 amigos, dividido | "8 × General ($45.000)" $360.000 | $28.800 | $388.800 | 1 de 8: $48.600 |
  | Parche + 3 amigos, General, dividido | "4 × General ($45.000)" $180.000 | $14.400 | $194.400 | 1 de 4: $48.600 |
  | Parche + 7 amigos, Preferencial, dividido | "8 × Preferencial ($70.000)" $560.000 | $44.800 | $604.800 | 1 de 8: $75.600 |
  | Mesa VIP solo | "1 × Mesa VIP para 4 ($320.000)" $320.000 | $25.600 | $345.600 | $345.600 |
  | Mesa VIP + 3 amigos, dividido | igual | $25.600 | $345.600 | 1 de 4: $86.400 |
  | Mesa VIP + Laura, dividido | igual | $25.600 | $345.600 | 1 de 2: $172.800 (H24) |

- Textos de la compra guardada (`purchased`):
  - `owned = split ? 1 : persons`;
  - `qtyLabel` = `split` → "Tu boleta · 1 de {persons}"; VIP → "{q} {mesa|mesas} · {persons} personas" ("1 mesa · 4 personas"); en otro caso → "{persons} boleta" / "{persons} boletas";
  - `pending` = amigos elegidos (si `split`);
  - `paid = share`;
  - `methodName` = nombre del medio ("Nequi", "PSE", "Tarjeta crédito/débito", "Daviplata", "Botón Bancolombia").
- `doneMsg`:
  - sin dividir: "Pagaste {cop(paid)} con {methodName}. Tus boletas ya están en Mis boletas." (ejemplo: "Pagaste $97.200 con Nequi. Tus boletas ya están en Mis boletas.");
  - dividido: "Pagaste tu parte ({cop(paid)}) con {methodName}. {Tu amigo recibió | Tus amigos recibieron} su link de pago en el chat de Salseros de jueves." (ejemplo: "Pagaste tu parte ($48.600) con Daviplata. Tu amigo recibió su link de pago en el chat de Salseros de jueves.").
- `tkLoc` = nombre completo de la localidad ("General", "Preferencial (mesa compartida)", "Mesa VIP para 4"); `tkQty = qtyLabel`; `tkHolder = name || 'Camila Vargas'` (sale del estado **actual**, no de la compra).
- `emailLine = 'La boleta también te llega al correo ' + email + '.'` (con el correo tal como esté escrito, aunque no sea válido).


##### Accesibilidad ya presente

- `<html lang="es">`; un solo `<main>`; `<header>`, `<nav aria-label="Principal">`, `<nav aria-label="En esta página">`, `<aside aria-label="Comprar boletas">`, `<footer>`. La barra móvil es `<div role="region" aria-label="Comprar boletas">`, con el mismo nombre que el aside; nunca están visibles a la vez (el otro queda en `display: none`).
- Otras regiones con nombre: `<section aria-label="Datos clave del evento">` y, en el paso 4, `<article aria-label="Tu boleta digital">`.
- Jerarquía de títulos: `<h1 id="fe-title">` (nombre del evento) → `<h2>` por sección ("Sobre el evento", "Programación", "Localidades", "Parches para este evento", "Lo que debes saber", "Ubicación y organizador", "Planes parecidos en otras ciudades", "Recuerdos de ediciones pasadas") → `<h3>` en cada parche. En la ventana: `<h2 id="fe-co-title">` y `<h3>` por bloque. Las secciones usan `aria-labelledby` con el id de su `h2`. Las mayúsculas son de CSS, así que el lector lee el texto en mayúscula inicial.
- Íconos decorativos con `aria-hidden="true"`. Los elementos decorativos del plano ("Escenario", "Pista", "Entrada", cuadros y círculos), el riel de la programación, los recuadros de ícono, el radio visual, la perilla del interruptor y la perforación de la boleta también son `aria-hidden`.
- Imágenes marcadas: `role="img"` con `aria-label` "[Foto del evento]" (héroe, miniatura de la ventana y planes parecidos), "[Mapa de la ubicación]", "[Foto de asistente]" y "[QR de la boleta] · dibujo decorativo, no es un código real".
- Botones de solo ícono con nombre: "Inicio", "Agenda de eventos", "Mapa de eventos", "Mensajes, 3 sin leer" (la insignia "3" es `aria-hidden` y el número va en el nombre), "Notificaciones", "Tu perfil", "Compartir evento", "Cerrar la compra", "Quitar una boleta"/"Agregar una boleta" (o "… una mesa") y "Perfil de {nombre}".
- Zonas del plano con nombre completo y precio ("Zona general, de pie · $45.000 por persona", etc.).
- Estados expuestos: `aria-pressed` ("Voy", "Me interesa", zonas, localidades, "Unirme", "Copiar dirección", "Seguir", "¿Para quién?", miembros, medios de pago, tipo de persona, "Agregar al calendario"); `aria-selected` en las pestañas (`role="tablist"`/`"tab"`/`"tabpanel"`, paneles con `aria-label`); `role="switch"` + `aria-checked` en "Dividir el pago" (H59 dice que está bien hecho); `role="checkbox"` + `aria-checked` en los términos; `aria-current="step"` en el paso actual.
- Grupos con nombre: "Plano del lugar: elige una zona", "Precios por localidad", "Miembros del parche", "Resumen de la compra", y los grupos con `aria-labelledby` ("Localidad", "Cantidad", "¿Para quién?", "¿Cómo quieres pagar?", "Tipo de persona").
- Regiones vivas: el número de la cantidad (`aria-live="polite"`); `role="status"` en "Tienes N boletas…" y en la confirmación del paso 4.
- Ventana con `role="dialog"`, `aria-modal="true"`, `aria-labelledby="fe-co-title"`, Escape (solo con el foco adentro) y botón de cerrar de 44 px.
- Formularios: todas las etiquetas son visibles y envuelven su control; el campo del muro tiene una etiqueta oculta para lector ("Escribe en el muro", técnica de `clip`). Atributos `autocomplete`: `name`, `email`, `tel`, `cc-number`, `cc-exp`, `cc-csc`, `cc-name`. `inputmode="numeric"` en documento, tarjeta, vencimiento y CVV.
- Foco visible de 3 px #C23A24 con 2 px de separación en botones, enlaces, campos y listas.
- Tamaños táctiles: los botones y enlaces con forma de botón miden de 36 a 54 px de alto (los más bajos son "Ver boleta" de la tarjeta lateral, con 36 px, y "Seguir", con 38 px). Los enlaces de texto miden lo que su línea: "Ver localidades" 19 px, "Ver parches" 24 px, "Ver más planes en el mapa" 24 px, "Ver las 128 fotos" 23 px y los títulos de planes parecidos 20 px. La auditoría no los marcó; en producción conviene verificarlos contra WCAG 2.5.8 (24 px o espacio libre suficiente alrededor).
- Contrastes medidos: #6E6259 sobre #FFFFFF da 5,91:1 y sobre #FBF7F3, 5,54:1; blanco sobre #C23A24 da 5,35:1; #17120F sobre #B9E07A da 12,4:1 y sobre #F6DC6A, 13,6:1. El logo #D9452F sobre #FBF7F3 da 4,07:1 (pasa como texto grande).
- No hay `prefers-reduced-motion` porque no hay movimiento. No hay enlace "Saltar al contenido" (H59).


#### 6.2.7 Mensajes (chat)

##### Estados e interacciones

**Estado inicial (`this.state`)** y lo que significa cada clave:

| Clave | Valor inicial | Qué guarda |
|---|---|---|
| `city` | `'all'` | Ciudad del selector del encabezado (no filtra nada). |
| `openId` | `'salseros'` | Conversación abierta. Si se sale de ella, se usa la primera de la lista. |
| `pane` | `'list'` | Qué se ve por debajo de 900 px: `list` o `chat`. |
| `filter` | `'todos'` | Filtro de la lista: `todos`, `parches`, `personas`, `noleidos`. |
| `q` | `''` | Texto del buscador de chats. |
| `read` | `{}` | Conversaciones marcadas como leídas en esta sesión. |
| `order` | `['salseros','laura','galeria','clasico','andres','rockeros','sofia']` | Orden de la lista. |
| `extra` | `{}` | Conversaciones creadas en la sesión (parches y chats nuevos). |
| `sent` | `{}` | Mensajes de Camila agregados en la sesión, por conversación. |
| `drafts` | `{}` | Borrador del compositor, por conversación. |
| `votes` | `{}` | Opción votada por Camila en cada encuesta. |
| `reacted` | `{}` | Reacciones marcadas (`idMensaje:tipo`). |
| `reposted` | `{}` | Tarjetas de evento reposteadas, por id de mensaje. |
| `muted` | `{ rockeros: true }` | Conversaciones silenciadas. |
| `split` | `{}` | Pago dividido activo, por conversación. |
| `left` | `{}` | Parches de los que Camila salió. |
| `leaving` | `false` | Confirmación de salida abierta. |
| `infoWide` | `true` | Panel visible desde 1180 px. |
| `infoNarrow` | `false` | Cajón abierto por debajo de 1180 px. |
| `tray` | `false` | Bandeja "Compartir" abierta. |
| `seq` | `1` | Contador para ids y para el color de los parches nuevos. |
| `modal` | `''` | Ventana: `''`, `group` o `dm`. |
| `mName`, `mEvent`, `mPicked`, `mPerson` | `''`, `''`, `{}`, `''` | Campos de la ventana. |

**Se ve al cargar (1280 × 900):** "Salseros de jueves" abierto y marcado en la lista (pero todavía con su "3"), "3 chats sin leer" e insignia "3" en el ícono de mensajes; plan fijado de la salsa con "Comprar mi boleta"; historial abajo del todo: lo primero visible arriba es el pie de la encuesta ("9 votos · Toca una opción para votar"), luego la foto de María F. Gómez y el último mensaje de Sofía. El separador "3 mensajes nuevos" **no** queda a la vista: está justo encima de la encuesta, 252,2 px por arriba del borde visible del historial (medido: separador en y = 68,9, historial desde y = 321,1), y hay que subir para verlo (confirmado en `Chat-1280.jpg`). Panel "Info del grupo" abierto con "Info" presionado; "Rockeros del Arena" con la campana tachada; "Enviar" deshabilitado.

**Regla común "enviar"** (`push`): todo lo que publica Camila (texto, evento, encuesta, foto, aviso de pago dividido) se agrega al final de la conversación con hora "Ahora", marca la conversación como leída, la sube al primer lugar de la lista y, como ya hay mensajes enviados, quita su contador, cambia su hora a "Ahora" y hace desaparecer el separador "mensajes nuevos". Enviar texto, encuesta o foto **consume el borrador**. Enviar texto, evento, encuesta o foto cierra la bandeja "Compartir" (`tray: false`); el aviso de pago dividido **no** la cierra (su `push` solo pasa `{ split }`), así que a ≥ 1180 px, con el panel y la bandeja abiertos a la vez, la bandeja sigue abierta.

| Elemento | Disparador | Resultado | Cambio visual exacto | Transición |
|---|---|---|---|---|
| Selector de ciudad | Cambio de opción | `city = valor` (si no es vacío) | Solo cambia el texto del selector. Nada se filtra (H38). | — |
| Buscador del encabezado | Escribir, Enter | Nada | Ninguno. Sin indicador de foco (`outline: 0`, H51). | — |
| Íconos "Inicio", "Agenda de eventos", "Mapa de eventos" | Hover | — | Ícono #17120F → #C23A24 (regla global `a:hover`). Sin fondo. | Ninguna |
| Ícono "Mensajes" (actual) | Hover | — | Ninguno (color blanco inline). | — |
| Avatar "CV" | Hover | — | Letras "CV" → #C23A24; el círculo #8FD3D0 no cambia. | Ninguna |
| Logo | Hover | — | Ninguno (color inline #D9452F). | — |
| "Notificaciones", "Crear evento" | Clic | Nada (H38) | Ninguno. **Ningún botón de la pantalla tiene hover.** | — |
| "Nuevo chat" | Clic | `modal = 'dm'`, `mPerson = ''` | Abre la ventana "Nuevo chat" con nadie elegido. El foco **se queda** en el botón, detrás del fondo (H7). | Aparece de golpe |
| "Nuevo parche" | Clic | `modal = 'group'`, `mName = ''`, `mEvent = ''`, `mPicked = {}` | Abre "Nuevo parche" vacío (siempre se reinicia). | Aparece de golpe |
| Buscador de chats | Escribir | `q = valor` | La lista se filtra en cada tecla; si no queda nada, estado vacío "No encontramos chats con ese filtro." Sin indicador de foco (H51). | Ninguna |
| Filtro "Todos" / "Parches" / "Personas" / "No leídos" | Clic | `filter = id` | El elegido pasa a fondo #17120F y texto #FFFFFF con `aria-pressed="true"`; el anterior vuelve a transparente. La lista se filtra. Con "No leídos" y todo leído: "Estás al día: no tienes mensajes sin leer." | Ninguna |
| "Ver todos los chats" (estado vacío) | Clic | `filter = 'todos'`, `q = ''` | Vuelve la lista completa; el buscador queda vacío y "Todos" marcado. | — |
| Fila de conversación | Clic | `openId = id`, `pane = 'chat'`, `read[id] = true`, `tray = false`, `leaving = false`, `infoNarrow = false` | La fila pasa a fondo #FBF7F3 con borde #EAE1D8 y `aria-current="true"`; si tenía no leídos, su contador desaparece, la hora y la vista previa pasan a #6E6259 y peso 400, y bajan el resumen ("2 chats sin leer"), la insignia del encabezado y su `aria-label`. Cambian la barra, el plan, el historial, el compositor (con su borrador) y el panel. Por debajo de 900 px se oculta la lista y se ve la conversación, **sin mover la página**: se conserva el `scrollY` que tenía la lista (medido: de 150 sigue en 150; de 219 sigue en 219). El separador "mensajes nuevos" sigue en el historial. El foco queda en la fila, que en celular desaparece: el foco cae al `body`. | Ninguna. El scroll del historial **no** se reinicia (ver "Detalles finos"). |
| Fila de conversación | Hover | — | Ninguno. | — |
| "Volver a tus chats" (< 900 px) | Clic | `pane = 'list'`, `tray = false`, `infoNarrow = false` | Vuelve la lista. La página **no** vuelve arriba: conserva el desplazamiento, recortado al alto de la lista (medido a 390 × 844: con la conversación bajada a 1200 px, vuelve a la lista en `scrollY = 219`, el máximo de una página de 1063 px). El foco cae al `body`. | — |
| "Ver evento" (barra) | Clic | Navega a `Evento.dc.html` | Hover: ícono → #C23A24. | — |
| Info, versión ancha (≥ 1180 px) | Clic | `infoWide = !infoWide` | Panel visible ↔ oculto. Botón: fondo #17120F / ícono #FFFFFF ↔ transparente / #17120F. La conversación pasa de 562 a 859 px de ancho y el plan fijado se reacomoda en una fila. | Ninguna |
| Info, versión angosta (< 1180 px) | Clic | `infoNarrow = !infoNarrow` | Abre el cajón (900–1179 px) o la pantalla completa (< 900 px). Mismo cambio de colores en el botón. En la práctica no sirve para cerrar: una vez abierto, el cajón o la pantalla completa tapan este mismo botón (ver sección 10), así que se cierra con "Cerrar información". | Ninguna |
| "Cerrar información" | Clic | `infoWide = false`, `infoNarrow = false`, `leaving = false` | Cierra el panel en cualquier ancho. Si después se agranda la ventana a 1180 px o más, el panel sigue cerrado. | — |
| Escape con el cajón o la pantalla completa abiertos | Tecla | Nada | El panel sigue abierto (H7). | — |
| "Silenciar chat" (barra) o "Silenciar notificaciones" (panel) | Clic | `muted[id] = !muted[id]` | Barra: campana → campana tachada, fondo transparente → #17120F, ícono #17120F → #FFFFFF, `aria-pressed` true. Panel: pista #EAE1D8 → #17120F, perilla 3 → 21 px. Lista: aparece la campana tachada de 14 px junto al nombre. Al revés al apagar. | Perilla: `left` 160 ms `ease` |
| Título del plan fijado | Hover / clic | Navega a `Evento.dc.html` | Hover: texto → #C23A24. | — |
| "Comprar mi boleta" | Hover / clic | Navega a `Evento.dc.html` | Hover: ninguno (color blanco inline). | — |
| "Ya tienes boleta" | Hover / clic | Navega a `Evento.dc.html` | Hover: texto → #C23A24 sobre el verde (la palomita blanca no cambia). | — |
| Barra de progreso del plan | Cambio de datos | — | El relleno anima su ancho al cambiar `pct` (en el prototipo solo pasa al cambiar de parche). | `width` 300 ms `ease` |
| Avatar de otra persona en el historial | Hover / clic | Navega a `Perfil.dc.html` | Hover: ninguno (color #17120F inline). Abre el perfil de Camila (H46). | — |
| Título de tarjeta de evento / flecha "Ver evento: …" | Hover / clic | Navega a `Evento.dc.html` | Hover: título → #C23A24; flecha → #C23A24. | — |
| "Repostear" (tarjeta en el chat) | Clic | `reposted[idMensaje] = !…` | "Repostear" ↔ "Reposteado"; fondo #FFFFFF ↔ #17120F; texto #17120F ↔ #FFFFFF; `aria-pressed`. No hay contador, aviso ni ventana. Es por mensaje: la misma salsa compartida dos veces se marca por separado. | Ninguna |
| Opción de encuesta | Clic | Si no había voto o era otra: `votes[idEncuesta] = opción`. Si era la misma: se borra el voto | Elegida: borde #EAE1D8 → #17120F, relleno #F3ECE5 → #F6DC6A, círculo blanco → #17120F con palomita blanca, `aria-pressed` true. Todos los conteos, anchos, `aria-label` y el pie se recalculan ("Votaste por «Un bar en la Zona T» · 10 votos · Toca otra opción para cambiar"). Al quitar el voto vuelve a "9 votos · Toca una opción para votar". | Rellenos: `width` 300 ms `ease` |
| Reacción | Clic | Alterna `reacted['idMensaje:tipo']` | Fondo #FFFFFF → #F6DC6A, borde #EAE1D8 → #17120F, conteo + 1, `aria-label` "Me encanta, 5". Al revés al desmarcar. | Ninguna |
| "Compartir evento" | Clic | `tray = !tray` | Abre o cierra la bandeja sobre el campo (el compositor pasa de 65 a 115 px y el historial se acorta). Botón: transparente / #17120F ↔ #17120F / #FFFFFF; `aria-expanded`. | Ninguna |
| Evento de la bandeja | Clic | Publica una tarjeta de evento de Camila (regla "enviar") | La tarjeta aparece a la derecha, sin avatar, con hora "Ahora" y doble check. Vista previa de la lista: "Tú: compartió «Rock en el Movistar Arena»". La bandeja se cierra. | — |
| "Crear encuesta" | Clic | Publica una encuesta de Camila: pregunta = borrador recortado o, si está vacío, "¿A qué hora nos vemos?"; opciones "7:00 p. m.", "8:00 p. m." y "9:00 p. m." con 0 votos | Encuesta a la derecha; pie "Toca una opción para votar"; vista previa de la lista "Tú: Encuesta: ¿A qué hora nos vemos?" con el borrador vacío, o "Tú: Encuesta: {borrador}" si había texto escrito (por ejemplo, con "¿Qué día?" en el campo: "Tú: Encuesta: ¿Qué día?"). No hay editor de opciones: las tres horas son siempre las mismas. | — |
| "Enviar foto" | Clic | Publica una foto de Camila: `alt` "[Foto que compartiste]", pie = borrador recortado (si hay) | Tarjeta de foto a la derecha; vista previa "Tú: envió una foto". No abre selector de archivos. | — |
| Campo del compositor | Escribir | `drafts[id] = valor` | Con texto (no solo espacios), "Enviar" pasa de #EAE1D8 / #6E6259 / deshabilitado a #C23A24 / #FFFFFF / habilitado. Sin indicador de foco (H51). | Ninguna |
| Campo del compositor | Enter (sin Mayús) | `preventDefault` + enviar texto | Si el borrador recortado está vacío no pasa nada. Si no, aparece la burbuja tinta con "Ahora" y doble check, el campo se vacía y el foco **se queda** en el campo. Mayús+Enter no hace nada (el campo es de una línea). | — |
| "Enviar" | Clic | Enviar texto | Igual que Enter, pero como el botón se deshabilita con el foco encima, el foco cae al `body` (H7). | — |
| "Dividir pago del parche" | Clic | Activa: `split[id] = true` + publica "Camila activó el pago dividido: cada uno paga su parte". Desactiva: `split[id] = false` sin aviso | "Dividir pago del parche" (blanco) ↔ "Pago dividido activo" (tinta, texto blanco), `aria-pressed`. El aviso del sistema queda en el historial aunque se desactive, y cada vez que se vuelve a activar se publica **otro** aviso igual (se pueden acumular). El estado es por conversación (`split[id]`). | Ninguna |
| "Salir del parche" | Clic | `leaving = true` | El botón se cambia por la confirmación en línea. El foco cae al `body`. | — |
| "Me quedo" | Clic | `leaving = false` | Vuelve el botón "Salir del parche". El foco cae al `body`. | — |
| "Sí, salir" | Clic | `left[id] = true`, `openId` = siguiente de la lista, `pane = 'list'`, `leaving = false`, `infoNarrow = false`, `tray = false` | El parche desaparece de la lista y del cálculo de "Planes en común". En escritorio se abre la siguiente conversación (con "Salseros", Laura), que **no** se marca leída: sigue con su "1" estando abierta. En celular se vuelve a la lista. El foco cae al `body`. No hay aviso ni forma de deshacer. | — |
| Ventana · "Parche (grupo)" / "Con una persona" | Clic | `modal = 'group'` / `'dm'` | Cambian el título, el segmento marcado, los campos visibles, la leyenda, la forma de las casillas (cuadrada / círculo), la ayuda y el botón principal. Lo escrito y elegido en cada modo se conserva al ir y volver. | Ninguna |
| Ventana · nombre del parche | Escribir | `mName = valor` (máx. 40) | Se recalcula la ayuda y el botón principal. Sin indicador de foco (H51). | — |
| Ventana · evento del plan | Cambio | `mEvent = valor` | Aparece o desaparece "El evento queda fijado arriba del chat y todos ven quién ya tiene boleta." (la ventana crece 29,2 px: de 665,3 a 694,5 a 1280). El `select` sí muestra el anillo de foco. | — |
| Ventana · tarjeta de amigo (modo parche) | Clic | Alterna `mPicked[k]` | Borde #EAE1D8 → #17120F (1,5 px), fondo #FFFFFF → #FBF7F3, casilla cuadrada blanca → tinta con palomita, `aria-pressed`. Se pueden elegir varios. | Ninguna |
| Ventana · tarjeta de amigo (modo persona) | Clic | `mPerson = k`, o `''` si ya estaba elegido | Igual, con casilla circular; elegir otro desmarca el anterior. | Ninguna |
| "Crear parche" | Clic (habilitado) | Crea el parche (ver abajo) y lo abre | La ventana se cierra; el parche nuevo aparece primero en la lista y abierto, con los filtros en "Todos", la búsqueda vacía y la conversación visible también en celular. El foco cae al `body`. | — |
| "Abrir chat" | Clic (habilitado) | Si ya existe un chat con esa persona (Laura, Andrés, Sofía), lo abre y lo marca leído (sin moverlo de lugar). Si no, crea `dm-{clave}` vacío, lo pone primero y lo abre | La ventana se cierra; filtros en "Todos" y búsqueda vacía. Chat nuevo: barra con el nombre "Daniel Torres" y debajo el subtítulo "Bogotá" (sin punto "En línea"), separador "HOY", texto "Escríbele a Daniel para arrancar el plan.", vista previa "Chat nuevo · escribe el primer mensaje", hora "Ahora". | — |
| "Crear parche" / "Abrir chat" deshabilitados | Clic | Nada | Fondo #EAE1D8, texto #6E6259, cursor normal. La ayuda dice qué falta. | — |
| "Cerrar", "Cancelar" o clic en el fondo oscuro | Clic | `modal = ''` | La ventana desaparece; lo escrito se conserva en el estado. Al volver a abrir, cada botón reinicia **solo su modo**: "Nuevo parche" borra `mName`, `mEvent` y `mPicked` pero no `mPerson`; "Nuevo chat" borra `mPerson` pero no el nombre, el evento ni los amigos del parche. Ejemplo: escribir "Previa" en "Nuevo parche", cancelar, abrir "Nuevo chat" y pasar a "Parche (grupo)" muestra otra vez "Previa" y los amigos marcados. El foco cae al `body`. | — |
| Escape | Tecla | `modal = ''` **solo si el foco está dentro de la ventana** | Al abrirla el foco no entra (hacen falta 43 Tabs), así que justo después de abrir Escape no hace nada (H7). | — |

**Lo que hace "Crear parche"** (`createGroup`):
- `id = 'g' + seq`; `kind: 'group'`; `admin: 'me'`; `members = ['me', ...elegidos en el orden de la lista de amigos]`; `tickets = {}`; `time: 'Ahora'`; `ev = mEvent` (o sin evento).
- Iniciales: se quitan las palabras vacías "de", "del", "la", "el", "los", "las", "y", "en" (comparadas sin tildes ni mayúsculas); iniciales = primera letra de la primera palabra + primera letra de la segunda palabra (o la segunda letra de la primera si solo hay una), en mayúsculas. Ejemplos: "Previa del viernes" → "PV"; "Rumba" → "RU"; "de la" (solo palabras vacías) → "DE".
- Color: `['#F3B27E', '#EE93BC', '#8FD3D0', '#B9E07A', '#F6DC6A', '#A3A8F0'][seq % 6]`. Con `seq = 1` (nada enviado antes) sale #EE93BC; el siguiente, #8FD3D0. Como `seq` también sube con cada mensaje enviado, el color depende de cuánto se haya escrito antes.
- Mensajes iniciales: separador "Hoy"; sistema (ícono de grupo) "Camila creó el parche «{nombre}»" · "Ahora"; sistema "Camila añadió a {nombres cortos}" · "Ahora", con los nombres unidos así: uno → "Laura"; dos → "Laura y Vale"; tres o más → "Laura, Mafe y Vale".
- Con evento: barra "4 miembros · 0 con boleta", plan fijado con "0 de 4 ya tienen boleta", barra al 0 %, "Comprar mi boleta" y "Dividir pago del parche"; miembros "Tú (Camila) · Creaste el parche · Sin boleta" y los demás "Sin boleta". Sin evento: barra "2 miembros", sin plan, sin "Ver evento", sin "Evento del parche", sin "Dividir pago" y sin estado de boleta en los miembros.
- Reinicia `modal`, `mName`, `mEvent`, `mPicked`, `filter = 'todos'`, `q = ''`, `tray`, `leaving` e `infoNarrow`; `pane = 'chat'`; `seq + 1`.

**Validaciones y mensajes:** no hay mensajes de error; solo la ayuda en vivo de la ventana (textos exactos en la sección 17) y los botones deshabilitados ("Enviar", "Crear parche", "Abrir chat"). No hay estados de carga, de error de red ni de mensaje no enviado (H17, H13).

**Foco después de cada acción (medido con teclado):** se conserva en la fila de la lista (escritorio), en "Info", en "Silenciar chat", en las opciones de encuesta, en las reacciones y en el campo después de Enter. Se pierde (cae al `body`) después de: "Enviar" con clic, elegir un evento de la bandeja (la bandeja se cierra), "Salir del parche", "Me quedo", "Sí, salir", abrir una conversación o volver en celular, y cerrar la ventana por cualquier vía. En producción, cada uno de estos casos debe mover el foco a un destino estable (H7).


##### Accesibilidad ya presente

- `lang="es"`; un solo `<main>`; `<nav aria-label="Principal">`; `role="search"` en el buscador del encabezado; `aria-current="page"` en el ícono de mensajes, con `aria-label` dinámico ("Mensajes, 3 chats sin leer") y la insignia numérica `aria-hidden`.
- Jerarquía de títulos: `h1` "Mensajes"; `h2` con el nombre de la conversación (barra) y otra vez en el panel; `h3` "Evento del parche", "Miembros · N" y "Planes en común" / "Sus próximos eventos"; `h2` del título de la ventana.
- Regiones con nombre: `section aria-label="Tus conversaciones"`, `section aria-label="Conversación con {nombre}"`, `aside aria-label="Info del grupo|Info del chat"`, `section aria-label="Plan fijado del parche"`.
- **Historial con `role="log"`** y `aria-label="Mensajes de {nombre}"`: los mensajes nuevos se anuncian de forma cortés. La auditoría pide conservarlo (H49, H56).
- Textos ocultos para lector de pantalla (patrón `position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap`): "Ciudad", "Buscar en tus chats", "Escribe un mensaje", ", N mensajes sin leer" en cada fila y "Enviar" en celular.
- Todos los botones de solo ícono tienen `aria-label`: "Notificaciones", "Tu perfil", "Volver a tus chats", "Ver evento", "Info del grupo/chat", "Silenciar chat", "Compartir evento", "Crear encuesta", "Enviar foto", "Cerrar información", "Cerrar", "Perfil de {nombre}", "Ver evento: {título}".
- Botones de alternancia con `aria-pressed`: filtros, Info, silenciar (barra y panel), repostear, opciones de encuesta, reacciones, "Dividir pago del parche", "Tipo de chat" y tarjetas de amigos. `aria-expanded` en "Compartir evento". `aria-current` en la fila abierta.
- Nombres accesibles calculados que dicen el estado: opciones de encuesta ("Donde Laura, en Chapinero, 5 votos"), reacciones ("Me encanta, 4"), barra del plan como `role="img"` ("7 de 12 miembros ya tienen boleta").
- Íconos con significado como `role="img"` con nombre: "Cuenta verificada" y "Silenciado". Los decorativos llevan `aria-hidden`. Las fotos de marcador son `role="img"` con `aria-label` ("[Foto del evento]", "[Foto: la pista en la edición pasada]").
- Grupos con nombre: "Filtrar chats", "Elige un evento para compartir", la pregunta de cada encuesta, "Confirmar salida del parche", "Tipo de chat"; la lista de amigos es un `fieldset` con `legend`.
- Ventana con `role="dialog"`, `aria-modal="true"`, `aria-labelledby="ch-modal-title"`, cierre con Escape (si el foco está dentro), con "Cerrar", "Cancelar" y clic en el fondo.
- Etiquetas visibles en los campos de la ventana ("Nombre del parche", "Evento del plan (opcional)").
- Foco visible de 3 px #C23A24 con separación de 2 px en botones, enlaces y `select` (no en los campos de texto, H51).
- La mayoría de los objetivos táctiles miden entre 40 y 52 px. Quedan por debajo los filtros (36 px de alto), las reacciones (36 px de alto), los segmentos "Parche (grupo)" / "Con una persona" (38 px de alto), el enlace "Ver perfil" / "Ver perfil del organizador" (38 px de alto) y los avatares de los mensajes (32 × 32).
- No se envían mensajes vacíos ni de solo espacios; Enter envía.
- `prefers-reduced-motion` quita las 3 transiciones.
- axe-core (medido): solo `label-content-name-mismatch` en el avatar "CV" ("Tu perfil") y en los avatares de los mensajes ("Perfil de Sofía Cárdenas" con texto visible "SC"); 4 casos a 1280 y 1 a 390 (H59).


#### 6.2.8 Perfil

##### Estados e interacciones

| Elemento | Disparador | Resultado | Cambio visual exacto | Transición |
|---|---|---|---|---|
| Pantalla | Carga | Estado `{ tab: 'planes', follow: false }` | "Próximos planes" seleccionada, "Seguir" negro, Seguidores "412" | Ninguna |
| "Volver al feed" | Hover | — | Texto y chevrón #17120F → **#C23A24** (regla global `a:hover`; el SVG usa `currentColor`) | Ninguna: el cambio es instantáneo |
| "Volver al feed" / logo | Clic o Enter | Navega a Inicio (`Main.dc.html`) | — | — |
| Logo "fulleventos" | Hover | — | **Ninguno**: queda #D9452F, porque el `color` inline gana a `a:hover` | — |
| "Mapa" | Hover | — | Texto e ícono #17120F → #C23A24. Borde (#EAE1D8) y fondo (#FFFFFF) no cambian | Ninguna |
| "Mapa" | Clic | Navega a Mapa | — | — |
| Ícono de mensajes | Hover | — | Ícono #17120F → #C23A24. La insignia sigue #C23A24 con "3" blanco; el borde no cambia | Ninguna |
| Ícono de mensajes | Clic | Navega al Chat ("Salseros de jueves") | — | — |
| "Seguir" | Clic, Enter o Espacio | `follow` pasa a `true`; Seguidores = 413 | Botón "Seguir" (fondo #17120F, texto #FFFFFF, borde #17120F, 91,4 px) → "Siguiendo" (fondo #FFFFFF, texto #17120F, borde #17120F, 117,3 px). `aria-pressed` "false" → "true". En la lista, "412" → "413". El foco se queda en el botón | Ninguna |
| "Siguiendo" | Clic, Enter o Espacio | `follow` vuelve a `false`; Seguidores = 412 | Lo inverso. **No pide confirmación** para dejar de seguir | Ninguna |
| "Seguir" / "Siguiendo" | Cambio de ancho | Salto de diseño | El botón crece 25,9 px. Entre **754 y 779 px** de ventana ese crecimiento hace que "Siguiendo" y "Mensaje" bajen a una segunda línea (x = 57, y + 60 px) y la tarjeta pase de 510,4 a 570,4 px de alto. A 768 px se ve en la captura de tableta si se pulsa "Seguir". Por debajo de 754 px ya estaban en la segunda línea y desde 780 px caben en la primera. A 1280 px el bloque del nombre se encoge y el botón crece hacia la izquierda: "Mensaje" no se mueve (x = 1120,7) | Ninguna |
| "Seguir" | Hover | — | **Ninguno** (no hay regla); el cursor es `pointer` | — |
| "Mensaje" | Hover | — | Texto #17120F → #C23A24. El borde #EAE1D8 no cambia | Ninguna |
| "Mensaje" | Clic | Navega al Chat (no a una conversación con Camila) | — | — |
| Pestaña no seleccionada | Hover | — | **Ninguno**: sigue #6E6259 y sin subrayado; cursor `pointer` | — |
| Pestaña | Clic, Enter o Espacio | `tab` cambia; se desmonta el panel anterior y se monta el nuevo | La anterior: texto #17120F → #6E6259 y subrayado #C23A24 → transparente. La nueva: lo inverso. `aria-selected` se actualiza. El foco se queda en la pestaña pulsada. A 390 px, al pulsar "Reseñas" (con clic real o con Tab + Enter) la fila de pestañas **no** se desplaza (`scrollLeft` sigue en 0): "Reseñas" queda seleccionada pero cortada. La página **no** se desplaza hasta el panel ni vuelve arriba | Ninguna |
| Pestaña seleccionada | Clic otra vez | Nada (mismo estado) | — | — |
| Pestaña | Flecha derecha o izquierda, Inicio, Fin | **Nada**: no hay manejo de teclado; las 3 pestañas están en el orden de Tab (sin `tabindex` itinerante) | — | — |
| Título de tarjeta de plan | Hover | — | Texto #17120F → #C23A24. La tarjeta no se eleva ni gana sombra | Ninguna |
| Título de tarjeta de plan | Clic | Navega a Evento (siempre el mismo, H36) | — | — |
| Foto, fecha, estado o lugar de la tarjeta | Clic | Nada (no son enlaces) | — | — |
| Mosaico de recuerdo | Hover | — | **Ninguno visible**: el `<a>` pasa a #C23A24, pero los textos tienen color inline (#FFFFFF y #E2D8D0) | — |
| Mosaico de recuerdo | Clic | Navega a Evento | — | — |
| Título de reseña | Hover | — | #17120F → #C23A24 | Ninguna |
| Título de reseña | Clic | Navega a Evento | — | — |
| Cualquier enlace o botón | Foco con teclado | — | Anillo **por defecto del navegador**: en Chromium, `outline: auto 1px`, color calculado rgb(16, 16, 16), `outline-offset` 0 px en botones y 1 px en enlaces. La pantalla no define `:focus-visible`. Sobre "Seguir" (negro) el anillo casi no se distingue | Ninguna |
| Recarga o volver a la pantalla | — | Todo vuelve al estado inicial: el "Siguiendo" se pierde | — | — |
| Vacío, carga, error, éxito | — | **No existen** | — | — |

**Validaciones:** ninguna, porque la pantalla no tiene campos. Los únicos estados de botón son `aria-pressed` en "Seguir" y `aria-selected` en las pestañas. No hay estado deshabilitado.

**Orden de Tab inicial (14 paradas):** "Volver al feed" → "fulleventos" → "Mapa" → "Mensajes, 3 sin leer" → "Seguir" → "Mensaje" → "Próximos planes" → "Recuerdos" → "Reseñas" → los 5 títulos de evento, en orden. En "Recuerdos", los 5 primeros siguen igual y luego vienen los 8 mosaicos (17 paradas). En "Reseñas", los 2 títulos (11 paradas).


##### Accesibilidad ya presente

- `lang="es"` y `<title>` "Fulleventos · Perfil".
- Landmarks: `<header>` (banner), `<main>` y `<section aria-label="Perfil">` (región con nombre). No hay `<nav>` ni `<footer>`.
- Encabezados: un solo `<h1>` "Camila Vargas". No hay `h2` ni `h3`: ni las pestañas ni las tarjetas tienen encabezado.
- Estadísticas como lista de descripción semántica (`<dl>` con `<div>` que agrupan `<dt>` y `<dd>`). El lector lee "Eventos 38", "Ciudades 5", etc.
- "Seguir" es un `<button>` nativo con `aria-pressed`. En el árbol de accesibilidad de Chromium se expone como botón "Seguir" no presionado y, al activarlo, como "Siguiendo" presionado. El texto exacto que dice cada lector está por confirmar con NVDA y VoiceOver. Enter y Espacio funcionan.
- Pestañas con `role="tablist"` y nombre ("Contenido del perfil"), `role="tab"` y `aria-selected`. Son `<button>` nativos, así que se activan con Enter o Espacio y conservan el foco.
- El ícono de mensajes tiene nombre accesible "Mensajes, 3 sin leer" y la insignia visual es `aria-hidden="true"`.
- Todos los SVG llevan `aria-hidden="true"`. Los demás controles tienen texto visible.
- Las fotos de marcador tienen `role="img"` con nombre: "[Foto de portada]" y "[Foto del evento]".
- Cada mosaico de recuerdo tiene `aria-label` con título, ciudad y mes ("Techno hasta el amanecer, Bogotá · Sep 2026").
- Objetivos táctiles: 44 px de alto en "Volver al feed", "Mapa", Mensajes, "Seguir" y "Mensaje"; 48 px en las pestañas; mosaicos de 200 px o más. El logo mide 124,9 × 37,2 px. Los títulos de las tarjetas son enlaces de texto de 21 a 42 px de alto.
- Contraste medido, todo en AA o más:

  | Texto | Contraste |
  |---|---|
  | #6E6259 sobre #FFFFFF | 5,91:1 |
  | #6E6259 sobre #FBF7F3 | 5,54:1 |
  | #C23A24 sobre #FFFFFF | 5,35:1 |
  | #C23A24 sobre #FBF7F3 | 5,02:1 |
  | #8A5A00 sobre #FFFFFF | 5,93:1 |
  | #FFFFFF sobre #17120F | 18,59:1 |
  | #17120F sobre los 5 colores de gustos y el avatar | de 8,33:1 a 13,6:1 |
  | Logo #D9452F sobre #FBF7F3 | 4,07:1 (texto grande: 24,8 px en negrita) |
  | Franja de recuerdos | 6,43:1 o más |

- **axe-core** (390 y 1280 px):
  - "Próximos planes" y "Reseñas": 0 violaciones.
  - "Recuerdos": 8 alertas `label-content-name-mismatch`. El `aria-label` ("…, Bogotá · Sep 2026") no contiene literalmente el texto visible, que el navegador concatena sin coma. Son de bajo impacto, pero ver "Detalles finos".
- **No hay:**
  - estilo de foco propio;
  - `role="tabpanel"`, `aria-controls` ni navegación con flechas en las pestañas;
  - enlace "Saltar al contenido";
  - `aria-live` (no hace falta para seguir, porque `aria-pressed` ya se anuncia);
  - `prefers-reduced-motion` (no hace falta hoy: no hay movimiento);
  - `type="button"` en los botones (inofensivo aquí porque no hay `<form>`, pero Evento sí lo pone).
