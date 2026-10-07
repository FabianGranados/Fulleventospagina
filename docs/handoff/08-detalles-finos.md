[← Índice del handoff](README.md)

## 8. Detalles finos que podrían perderse

### 8.1 Globales (de la conversación y de las pruebas)

**Mapa y geografía**
1. **Proyección del mapa:** `x = (lon + 79.5) × 10`, `y = (13 − lat) × 10`, `viewBox="0 0 130 175"`. El `path` del contorno de Colombia (unos 80 vértices, empieza en `M21.4 43.2`) está en `diseno/prototipo/Mapa.dc.html` y en los mini-mapas de Bienvenida e Inicio. El contenedor del mapa usa `aspect-ratio: 130 / 175` para que no se deforme.
2. **Leticia** se movió a `top: 97 %` (su posición real, 98,3 %, quedaba pegada al borde). **San Andrés** queda fuera del recuadro: si hay eventos allí, hace falta un recuadro aparte.
3. **Los pines del mapa son botones HTML** encima del SVG, no figuras dentro del SVG. Al hacer zoom, el contenido escala y **los pines se contraescalan** (`scale(1/Z)`) para mantener su tamaño. El zoom va de 1× a 3× en pasos de 0,5, y al elegir una ciudad sube a mínimo 2×.

**Errores ya resueltos (no repetirlos)**
4. **Texto oculto para lector de pantalla dentro de una lista con scroll:** un `span` con `position: absolute` dentro de una lista con `overflow-y: auto` estiraba la página del Mapa a 5.000 px. La lista con scroll necesita `position: relative`. Ya está corregido en el prototipo; no repetirlo.
5. **Formularios:** el prototipo evita `<form>` con botón *submit* solo porque recargaba el lienzo de diseño. **En producción sí se usan `<form>` reales** con `onSubmit` (y `preventDefault` donde corresponda), para que Enter envíe y los lectores de pantalla reconozcan el formulario.
6. **Errores de consola en Evento** (`<path> attribute d: Expected moveto…`): son del motor del prototipo, que pinta la plantilla antes de calcularla. No aplican a producción (H58).

**Textos y formatos**
7. **"Toda Colombia"** (no "Todo Colombia") en el selector, los chips y los títulos.
8. **Formato de precios:** `n.toLocaleString('es-CO')` → "$45.000". Gratis = "Gratis". El prefijo es "Desde " cuando hay varias localidades. El servidor debe tener ICU completo para que el separador de miles sea el punto.
9. **Fechas del ejemplo:** fin de semana del **viernes 9 al lunes festivo 12 de octubre de 2026**. Las horas se escriben "9:00 p. m." (con espacio y puntos). En Evento, "Puertas 8:00 p. m. · Show 9:30 p. m.". La auditoría encontró que el mismo evento muestra 9:00 en Inicio y 8:00 en Evento y Chat (H37): **la hora canónica son las puertas a las 8:00 p. m. y el show a las 9:30 p. m.**

**Marca y legal**
10. **Rojo:** `#D9452F` solo en el logo "fulleventos" (texto de 1,55–1,6 rem, peso 700, `letter-spacing: -0.03em`). En botones e insignias con texto blanco, `#C23A24`.
11. **Texto legal del pie:** "Compra segura dentro de Fulleventos. Las boletas las emite la boletera oficial del evento o el organizador." Debe ajustarse según la decisión P1, y añadir el bloque "Vendido por" con datos reales (H5).
12. **Nombres de boleteras reales** (TuBoleta, Ticketmaster, Fever) bajo los precios: reemplazarlos por [BOLETERA] o rotularlos como ejemplo hasta que haya acuerdos (H1).

**Contenido y medios**
13. **Sin emoji** en ninguna parte, tampoco en el chat de ejemplo. Los íconos son SVG de trazo.
14. **Marcadores de foto:** `radial-gradient(circle at 70% 30%, <bg1> 0, transparent 55%), <bg2>`, con `role="img"` y `aria-label="[Foto del evento]"`. En producción se reemplazan por fotos reales con `alt` descriptivo, conservando las proporciones (4:3 en tarjetas, 16:9 en noticias).

**Datos que hoy viven en el navegador**
15. **El cargo por servicio de 8 %** se calcula en el navegador. En producción lo calcula el servidor (H3), y el precio mostrado debe incluirlo (H21).
16. **El temporizador "9:58"** del checkout es un texto fijo. En producción es una cuenta regresiva real de la reserva, anunciada de forma accesible y con estado de "reserva vencida" (H3, H17).
17. **El QR de la boleta es decorativo** ("[QR de la boleta]"). En producción es un QR firmado, uno por asistente, y se valida en la puerta (H11).

### 8.2 Por pantalla

#### 8.2.1 Bienvenida

##### Correcciones obligatorias de la auditoría

**Hallazgos de prototipo/diseño que afectan esta pantalla**

- **H8 (Alta) · Desborde horizontal en celular.** Hoy la página mide 473 px de 320 a 472 px y el botón "Buscar" queda fuera de la pantalla. Implementar: `min-width: 0` en el contenedor del buscador y, por debajo de unos 480 px, pasar el selector de ciudad a otra línea o convertirlo en un ícono (con solo `min-width: 0` el campo queda de 75 px y se lee "¿Qué pla"). Agregar una prueba automática que verifique que el ancho del documento a 320 px es 320.
- **H35 (Media) · Viewport.** Agregar `<meta name="viewport" content="width=device-width, initial-scale=1">`, junto con H8 (si se pone sin arreglar H8, el desborde aparece en todos los celulares).
- **H40 + H16 (Media + Alta) · Encabezado de celular demasiado alto y foco tapado.** El encabezado mide 215 px a 390 (25 % de la pantalla) y con Shift+Tab deja 43 controles tapados a 390 px, 21 a 768 px y los pines de Santa Marta y Barranquilla a 1280 px (medido también con Tab: los pines quedan a y = 40–65 px, bajo un encabezado de 78 px). Implementar: encabezado móvil de una fila (56–64 px) con logo, lupa y acceso, que se esconda al bajar; o quitarle el `sticky` por debajo de unos 768 px. Además, `scroll-padding-top` según la altura real del encabezado (90 px sirven en escritorio; con el encabezado actual en celular harían falta 230 px). Esto también arregla los saltos de ancla que hoy dejan el título debajo del encabezado.
- **H41 (Media) · Encabezado y búsqueda inconsistentes.** Hay cinco variantes de encabezado. Implementar un componente de encabezado para visitantes (este) y otro para la app con sesión. La búsqueda tiene 3 textos distintos ("¿Qué plan buscas?" aquí; "Busca eventos, lugares o artistas" en Agenda y Mapa; "Busca planes, gente o lugares" en Main) y ninguna lógica: unificar y crear la pantalla de resultados con estados vacío y de carga. Unificar el margen lateral (aquí 24 px en celular; otras pantallas usan 16 px).
- **H38 (Media) · Botón muerto.** "Buscar" (`:46`) no hace nada: conectarlo a la búsqueda o quitarlo.
- **H44 (Media) · Los planes a la venta están muy abajo.** Primer "Comprar" en y = 4623 a 390×844 (5,5 pantallas) y en y = 3267 a 1280×900 (3,6 pantallas). Lo que pide la auditoría: subir "Este finde" justo después del héroe (en celular, como carrusel de 4 a 6 tarjetas), bajar Noticias al final y mantener corto "Cómo funciona". El orden exacto de los demás bloques no está fijado; una propuesta coherente es héroe → "Este finde en Colombia" → "Cómo funciona" → Mapa → Únete → Noticias (por confirmar).
- **H33 (Media) · El visitante termina en pantallas con sesión.** "Ver toda la agenda" abre "Agenda para ti" con el avatar de Camila; "Comprar" abre Evento con "Volver al feed"; el mapa abre la versión con sesión; "Entrar" va directo al feed. Implementar versiones públicas de Agenda, Mapa y Evento con encabezado "Entrar / Crear cuenta", pedir la cuenta solo al tocar "Comprar", "Voy" o "Unirme" y devolver al usuario al mismo punto después de registrarse. Diseñar la pantalla "Entrar". (Qué pasa al tocar el corazón "Guardar" sin cuenta no está definido: por decidir.)
- **H36 (Media) · Todas las tarjetas abren el mismo evento.** Cada tarjeta (título y CTA) debe abrir su propio evento (`/evento/:slug`); un evento gratis debe abrir una página de evento gratis (sin "Comprar"). Las noticias no deben abrir un evento cualquiera: necesitan su destino propio (por definir).
- **H21 (Media) · Precio sin cargo por servicio.** "Desde $45.000" no incluye el 8 %. Usar el mismo formato en todas las pantallas: "Desde $45.000 + cargo por servicio" o "Desde $48.600 con cargos" (2 × $45.000 + 8 % = $97.200 es el cálculo de referencia del checkout).
- **H39 (Media) · Filtro engañoso.** "Planes con amigos" filtra en realidad los eventos con parches abiertos (`:387`) y un visitante no tiene amigos: renombrarlo a "Con parches abiertos".
- **H37 (Media) · Datos que cambian entre pantallas.** Bienvenida está en la lista: usar un solo bloque de datos para "van", "parches abiertos", hora y estado (hoy "186 van" coincide con Evento, pero Main muestra "24 van · 3 amigos" fijo para todos). Ver también H53.
- **H45 (Media) · Promesa de ciudad.** Únete dice "elige tu ciudad" (`:255`) pero Registro solo pide "Barrio o localidad · Ej. Chapinero". Registro debe pedir "Ciudad" (lista) y dejar el barrio opcional; si no, cambiar el texto de esta pantalla.
- **H5 (Alta) · No se ve quién vende.** El pie solo tiene dos textos y 0 enlaces (`:265-270`). Implementar un pie legal con [RAZÓN SOCIAL], NIT, dirección, teléfono, correo, PQR, enlace a sic.gov.co, Términos y Política de tratamiento, con un único nombre por documento.
- **H51 (Media) · Campo sin foco visible.** El buscador tiene `outline: 0` (`:27`) y la pantalla no define foco. Implementar `:focus-within` en el contenedor (borde de 2 px `#C23A24`) y la regla global de Evento: `button:focus-visible, a:focus-visible, input:focus-visible, select:focus-visible { outline: 3px solid #C23A24; outline-offset: 2px }`. Sobre los bloques oscuros (héroe, Mapa, Únete) conviene el contorno `#F6DC6A`, como hace Mapa con `[data-fe~="dark"] button:focus-visible { outline-color: #F6DC6A }`.
- **H59 (Baja) · Semántica.** La lista de noticias salta de h3 a h4 (`:163-180`): las tres noticias deben ser del mismo nivel que la destacada (h3). Agregar h3 por tarjeta de evento, "Saltar al contenido" (hoy son 52 Tabs hasta el primer "Comprar") y nombres accesibles que empiecen por el texto visible (pines: p. ej. "6, Bogotá: ver planes"; chips: "Bogotá 6 planes").
- **H60 (Baja) · Pines de 20 px que se enciman.** A 390 px, 5 pines chocan con su vecino: Santa Marta, Barranquilla y Cartagena, y Bogotá con Villavicencio (centros a 14 y 16 px); también se enciman en escritorio (ver captura de 1280: Barranquilla y Santa Marta se tocan, Bogotá y Villavicencio también). Hoy pasa WCAG 2.5.8 solo porque todos llevan al mismo destino que el botón "Abrir el mapa de eventos". Si cada pin abre su ciudad: mínimo 24–28 px y agrupar la costa en un pin "Costa Caribe · 3". Si no: convertir todo el mini-mapa en un solo enlace.
- **H61 (Baja) · Chips cortados y fila suelta.** La fila de ciudades esconde 372 px a 1280 px sin pista: permitir 2 líneas o agregar degradado y flechas. "Cómo funciona" queda 2 + 1 a 768 px (en realidad de 548 a 807 px): la auditoría pide "una rejilla automática (`grid auto-fit`) con anchos mínimos pensados para cada bloque". La solución exacta no está definida; cualquier regla que evite la fila suelta (por ejemplo, pasar directo de 1 a 3 columnas) cumple.
- **H62 (Baja) · Glosario.** Aquí conviven "Toda Colombia" (select y chip), "todo el país" / "Todo el país en un mapa" y "Este finde en Colombia", "Ver todos los planes del país". Fijar un glosario corto y usarlo en todas las pantallas.
- **H42 (Media, aplica por los enlaces al Mapa).** Los pines y "Ver en el mapa" deben abrir el Mapa en la ciudad correspondiente (en producción `/mapa?ciudad=cali`).
- **H49 (Media, la corrección es "en cada pantalla").** Agregar una región viva permanente y oculta (`role="status"`) que anuncie "Mostrando 3 planes en Medellín", "No hay planes de esta categoría en Medellín este finde." o "Mostrando 19 planes" al filtrar o expandir.
- **Mismo patrón de H7 (foco perdido).** Al pulsar "Ver todos los planes del país" el botón desaparece y el foco cae al `<body>`: llevar el foco al h2 de la Agenda o a la primera tarjeta.
- **H17 (Media, "Evento y todas").** Diseñar esqueletos de carga y error con "Reintentar" para la rejilla de eventos, el mini-mapa y los conteos.
- **H47 (positivo, conservar).** El límite de 8 tarjetas con "Ver N planes más" de esta pantalla es el patrón que la auditoría pide copiar en Agenda y Mapa: no quitarlo.

**Hallazgos de producción que cambian esta pantalla**

- **H1 (Alta) · Modelo de compra.** Las tarjetas muestran marcas reales (TuBoleta, Ticketmaster, Fever; también Idartes) como vendedoras y "Comprar" abre la compra interna. La tarjeta 3 de "Cómo funciona" promete "compra tus boletas sin salir de Fulleventos" (`:102`) y el pie dice "Compra segura dentro de Fulleventos" (`:268`). En diseño: cambiar las marcas por [BOLETERA] o marcar "Contenido de ejemplo" también en la Agenda; condicionar el CTA al canal ("Compra aquí" / "Compra en [boletera]"); quitar el absoluto "sin salir de Fulleventos". En producción (camino recomendado por la auditoría): un campo "fuente" por evento con tres modos, mostrado en cada tarjeta: gratis → "Voy" o confirmación de asistencia; ticketera externa → botón "Comprar en [boletera]" que abre su sitio (con enlace de afiliado si existe) y luego vuelve a Fulleventos para marcar "Ya compré" y armar el parche; venta propia → checkout embebido con pasarela colombiana. Nunca scraping.
- **H12 (Alta) · Cuentas.** "Entrar" (`:53`, `:260`) debe llevar a un inicio de sesión real; "Continuar con Google" con OAuth y "Continuar con mi celular" con código de verificación; registrar consentimientos.
- **H34 (Media) · SEO y vista previa.** La landing necesita título y descripción propios, Open Graph, URL canónica y páginas generadas en el servidor; cada tarjeta debe enlazar a una URL única por evento (p. ej. `/bogota/eventos/noche-de-salsa-y-boleros-2026-10-09`).
- **H53 (Media) · Un solo modelo de datos.** Los 19 eventos están copiados en `Bienvenida.dc.html:296-314` y en otras 3 pantallas. En producción, eventos, ciudades (con coordenadas reales, no porcentajes), conteos de "van" y parches deben venir de la base y las fechas calcularse con la hora del servidor (zona America/Bogota). Esto incluye los tiempos relativos de Noticias ("Hace 3 horas", "Hace 5 horas", "Ayer", "Hace 2 días"), hoy texto fijo, y el mes "oct", hoy escrito a mano.
- **H47 (producción).** "Ver N planes más" debe paginar desde la base de datos (unos 20 eventos por página, "Cargar más").


##### Detalles finos

1. **Mayúsculas por CSS, no en el texto.** Eyebrows, etiquetas amarillas, h1, h2 de los bloques oscuros, categorías, antetítulos y "oct" están escritos en minúsculas o tipo oración en el código y se ven en mayúsculas por `text-transform: uppercase`. Mantenerlo así (los lectores de pantalla leen el texto natural).
2. **Mes fijo.** "oct" está escrito a mano en la tarjeta; solo el día viene del dato. En producción, calcular la abreviatura del mes (y quitar el punto que agrega `Intl` en español: "oct.").
3. **Orden intercalado, no cronológico.** Las 8 primeras tarjetas son "una por ciudad" en el orden Bogotá, Medellín, Cali, Barranquilla, Cartagena, Santa Marta, Bucaramanga, Pereira; por eso las fechas aparecen como 9, 9, 10, 10, 9, 10, 11, 9. Con una ciudad elegida se usa el orden del arreglo de datos.
4. **Singular/plural.** "1 plan" / "N planes"; "1 parche abierto" / "N parches abiertos"; "Ver 1 plan más" / "Ver N planes más"; pero `mapCities` siempre dice "ciudades" (con una sola ciudad diría "1 ciudades": corregir).
5. **Formato de números.** `toLocaleString('es-CO')` → punto de miles ("1.200 van", "Desde $180.000"), sin espacio después de `$`, sin decimales. El código base tenía `font-variant-numeric: tabular-nums` en el precio; el prototipo no.
6. **"van" sin sustantivo.** La línea social dice "186 van", no "186 personas van". Si no hay parches, solo "88 van".
7. **Los contadores de los chips de ciudad no dependen de la categoría.** Con "Conciertos" activo, el chip de Medellín sigue diciendo 3 y al tocarlo sale el estado vacío.
8. **Dos de los tres mensajes vacíos son inalcanzables** con los datos de ejemplo; igual hay que implementarlos ("No hay planes en {Ciudad} este finde." y "No hay planes en esta categoría este finde.").
9. **"Ver todos los planes del país" no borra los guardados**; solo reinicia ciudad, categoría y expansión.
10. **Cambiar cualquier filtro contrae la lista** (`showAll = false`). "Ver menos planes" no tiene desplazamiento programado: al acortarse la página, el navegador lleva al usuario al final (Únete y pie) y en celular y tableta el botón enfocado queda bajo el encabezado fijo (ver Estados e interacciones).
11. **El select del encabezado y los chips comparten estado**: cambiar uno actualiza el otro. Pero el h2 "Este finde en Colombia" no cambia con la ciudad y el select no lleva a la Agenda.
12. **Dos "agendas" distintas.** "Agenda" del menú y "Ver la agenda sin registrarme" van a `#agenda` (esta página); "Ver toda la agenda" va a la pantalla Agenda.
13. **El logo de esta pantalla apunta a sí misma**; en las demás pantallas apunta a Main.
14. **Alturas desiguales en Únete:** "Continuar con Google" mide 52 px y "Continuar con mi celular" 54 px (borde sin `box-sizing: border-box`). Igualarlas a 52 con `border-box`.
15. **Avatares del héroe de 38 px reales** (34 + borde de 2 px por lado), encimados −9 px y con borde del color del fondo (`#140E10`) para simular el recorte.
16. **Bloques del h1 pegados.** La etiqueta "ARMA TU PARCHE" no tiene margen inferior y los tres bloques del h1 se tocan; los desplazamientos a la izquierda usan `clamp()` con `vw` (en el código base eran fijos de 44 px, 1.15em y .4em, mucho más marcados).
17. **"al concierto del sábado" con `max-width: 13ch`** se parte en 2 líneas en escritorio y en 3 en celular; el degradado cubre todo el bloque.
18. **Marcadores literales que no deben llegar a producción con cifras inventadas:** "[Foto real de un evento en Colombia]", "[N] personas", "[N] ciudades", "[Imagen de la noticia]". Si el héroe lleva foto real, falta definir la capa oscura que garantice contraste del texto blanco (por definir).
19. **Imágenes:** tarjeta de evento 4/3; noticia destacada 16/9 (el código base usaba 4/3). Hoy son degradados radiales con `bg1`/`bg2`.
20. **Pines dependientes del contenedor:** tamaño `clamp(20px, 6.5cqw, 26px)`; justo al pasar a dos columnas (796 px) el mini-mapa se encoge de 400 a 280 px y los pines a 20 px. Los rótulos se desplazan con `dy` (Bogotá −9 px hacia arriba, Villavicencio +5 hacia abajo, Barranquilla −8, Cartagena +5, Santa Marta −2) para no chocar; llevan `text-shadow` doble para leerse sobre la silueta.
21. **Orden de los pines por latitud del dibujo** (`top` ascendente): define el orden del Tab (Santa Marta primero, Leticia último).
22. **Halo de los pines:** `box-shadow: 0 0 0 4px rgba(246,220,106,.2)`; es la única sombra de la pantalla. No hay sombras en tarjetas ni encabezado.
23. **Tarjetas sin hover.** El código base tenía elevación al hover (`translateY(-3px)` + `0 12px 28px rgba(23,18,15,.10)`, `200ms ease-out`, anulada con `prefers-reduced-motion`) y hover en botones (`.go` y `.ticket` a `#BF3923`, `.btn-dark` a `#33291F`, `.btn-light` a `#F3ECE6`, `.chip` borde `#17120F`, `.more` a `--brand`). El prototipo los perdió porque usa estilos en línea; recuperarlos es una decisión pendiente (si se recuperan, respetar `prefers-reduced-motion`).
24. **Foco:** el código base tenía `:focus-visible { outline: 3px solid var(--brand); outline-offset: 2px }`; esta pantalla lo perdió (H51).
25. **Rejilla:** el `margin-top: auto` de la fila de precio alinea precios y botones en la base de cada fila de tarjetas aunque los títulos ocupen 1 o 2 líneas.
26. **Chips:** el de ciudad tiene `white-space: nowrap` y padding asimétrico `0 7px 0 15px`; el de categoría no tiene `nowrap` pero no se parte porque `flex-shrink: 0`. Solo "Toda Colombia" lleva ícono. La barra de scroll de las filas es la nativa (el código base la ocultaba con `scrollbar-width: none`).
27. **Colores de los íconos del buscador:** la lupa es `#6E6259`; el pin del selector usa `currentColor` y sale `#17120F`.
28. **Encabezado fijo sin línea inferior ni sombra**, mismo fondo que la página, `z-index: 5`. El héroe arranca 8 px debajo.
29. **Espaciado vertical entre bloques:** 72 px (Cómo funciona, Mapa, Noticias, Agenda), 80 px antes de Únete y 72 px antes del pie.
30. **Dos estilos de h2:** en fondo claro `clamp(1.7rem, 3.2vw, 2.4rem)`, line-height 1.05, sin mayúsculas; en bloques oscuros `clamp(1.8rem, 3.6vw, 2.8rem)`, line-height 1.02, en mayúsculas.
31. **Insignia "Nuevo"** en el menú y "Nuevo · Mapa de eventos" en el bloque: la auditoría (H62) advierte que Mapa repite "Nuevo" 5 veces; definir dónde vive esa etiqueta y hasta cuándo.
32. **Campo `b` mezcla cosas:** boletera (TuBoleta, Ticketmaster, Fever), entidad organizadora (Idartes, en un evento gratis) y "Entrada libre". En el modelo de datos separar "fuente de venta" y "organizador".
33. **Inconsistencias de contenido de ejemplo:** la noticia "Se agotó la primera fase para el concierto del Movistar Arena" convive con "Rock en el Movistar Arena · Desde $180.000" a la venta; solo Noticias dice "Contenido de ejemplo", la Agenda no (H1).
34. **"Este finde" incluye el lunes festivo 12** (e8 Atlético Nacional vs. Junior es el día 12).
35. **El corazón funciona sin cuenta** y no cambia su `aria-label` al guardarse (el estado va en `aria-pressed`).
36. **La noticia destacada es un enlace que envuelve imagen, título, bajada y meta**; su nombre accesible empieza por "[Imagen de la noticia]". En producción, imagen decorativa (`alt=""`) o nombre del enlace igual al titular.
37. **"Ver N planes más" no tiene `aria-controls`** y al expandir no mueve el foco a la primera tarjeta nueva.
38. **Estados que solo se ven interactuando:** chip presionado con contador amarillo, corazón rojo lleno, estado vacío punteado, "Ver menos planes", tooltip de los pines, color `#C23A24` de los enlaces al hover.
39. **Únete sin ícono de Google**, mientras Registro sí lo tiene (`<svg>` 18 × 18, `stroke-width 2.2`); unificar con el mismo componente de botón de acceso.
40. **"Continuar con Google" y "Continuar con mi celular" no pasan el método a Registro**: el usuario vuelve a ver la misma elección en el paso 1.
41. **Selector de ciudad con `max-width: 8.6em`** (≈ 124 px a 14,4 px); el ancho real lo da la opción más larga (122 px). Si se cambia la fuente o se agregan ciudades con nombres más largos, revisar que no se corte.
42. **`role="search"` está en un `div`, no en un `<form>`**: Enter no envía nada. En producción usar `<form role="search">` (como el código base) con envío a la pantalla de resultados.
43. **Desborde a 390 px:** la captura de 390 mide 473 px de ancho; el resto del contenido sí respeta los 342 px útiles. No tomar la captura como diseño intencional.
44. **Tamaño del logo distinto entre pantallas:** aquí (y en Registro) el logo mide `1.6rem`; en Agenda, Chat, Evento, Main, Mapa y Perfil mide `1.55rem`. Al crear el componente de encabezado, fijar un solo tamaño (decisión pendiente).
45. **Anclas sin enlace:** `#mapa` y `#noticias` existen como `id`, pero ningún enlace de la página apunta a ellas (el "Mapa" del menú va a la pantalla Mapa). Solo `#como-funciona` y `#agenda` se usan.
46. **Responsive que el código base tenía y el prototipo perdió** (referencia útil para H8/H40, no es obligatorio copiarlo): en `preview-demo.html`, por debajo de 820 px se ocultaban los enlaces del menú, el buscador pasaba a su propia fila a todo el ancho (`order: 3; flex-basis: 100%`), el héroe pasaba a `padding: 64px 22px 32px; min-height: 0; border-radius: 22px`, la etiqueta perdía su sangría y los bloques del h1 sus `margin-left`; por debajo de 520 px el margen lateral bajaba a 16 px y se ocultaba el nombre de la ciudad del buscador (quedaba solo el ícono). El prototipo no tiene ninguna `@media`.
47. **Los valores que muestra la página dependen del motor de plantillas:** cada `{{…}}` se pinta dentro de un `<span class="sc-interp">` (artefacto del runtime del prototipo). No replicar esos `span` en producción; por ejemplo, la cifra del pin y su rótulo son hermanos dentro del `<a>`.


#### 8.2.2 Registro

##### Correcciones obligatorias de la auditoría

**De prototipo o diseño (implementar distinto al prototipo):**

1. **H45 · El paso 1 avanza vacío, borra lo escrito, no pide la ciudad y el formulario queda bajo un bloque decorativo.**
   - Guardar lo escrito entre pasos: campos **controlados** (con valor en el estado, como `Evento.dc.html:644-656`). "Atrás" debe mostrar los datos ya escritos.
   - Validar antes de avanzar (ver H23).
   - Pedir **"Ciudad" como lista desplegable** (obligatoria) y dejar el barrio como **opcional**. El placeholder "Ej. Chapinero" es de Bogotá; la landing promete "elige tu ciudad" (`Bienvenida.dc.html:255`: "Crea tu cuenta en un minuto, elige tu ciudad y lo que te gusta, y te mostramos los planes de tu gente.").
   - Corregir singular y plural del contador: "1 elegidos" no puede aparecer.
   - En celular, reducir el bloque decorativo (`<aside>`) a una franja de unos **80 px** con "Paso 1 de 3", para que el formulario quede en la primera pantalla (hoy el primer campo está en y = 787 a 390 × 844 y el bloque oscuro se repite en los 3 pasos; la auditoría lo cifra en "unos 470 px", medido es 420 px de panel + 24 px de separación con la tarjeta).
2. **H23 · Validar los datos y explicar los errores de forma accesible.**
   - Errores por campo con `aria-invalid` y `aria-describedby`. Correo: formato válido. Celular: 10 dígitos que empiecen por 3.
   - Marcar "obligatorio" en la etiqueta.
   - Al intentar continuar, un resumen de errores arriba; el botón queda activo con `aria-disabled` y, al pulsarlo, muestra los errores.
   - El campo único "Celular o correo" tiene `autocomplete="email"` aunque admite celular: la validación debe distinguir los dos formatos.
   - En producción, validar también en el servidor.
3. **H7 · El foco se pierde al cambiar de paso.**
   - En "Continuar" del paso 2 cambiar `disabled` por `aria-disabled="true"` y conservar el chequeo `if (!can) return`.
   - Después de cada cambio de paso, llevar el foco al encabezado del paso (h2) y anunciarlo (en producción la auditoría lo pide como "llevar el foco al encabezado y anunciar 'Paso 2 de 4: Tus datos'"; aquí sería "Paso 2 de 3: Tus gustos").
4. **H49 · Anunciar el cambio de paso al lector de pantalla.** Una región viva vacía y permanente, visualmente oculta, con `role="status"`, donde se escriba el mensaje del paso. Hoy solo cambia "Paso {{stepNum}} de 3" (`Registro.dc.html:30`).
5. **H51 · Indicador de foco en los 3 campos.** Quitar `outline: 0` (`:58`, `:60`, `:62`) o marcar el contenedor con `:focus-within` (borde de 2 px #C23A24). Copiar a la pantalla la regla de `Evento.dc.html:19`: `button:focus-visible,a:focus-visible,input:focus-visible,select:focus-visible{outline:3px solid #C23A24;outline-offset:2px}`.
6. **H52 · Contraste.**
   - Números de los pasos pendientes: hoy #17120F sobre fondo transparente (1,03:1). Usar blanco al 65 % con un borde claro.
   - Avatar de Galería Café Libro: hoy iniciales #17120F sobre #17120F (invisibles). Definir el color de texto de cada avatar (amarillo para organizadores, como en el Chat).
   - Placeholders: hoy #757575 del navegador (4,32:1 sobre #FBF7F3). Usar #6E6259 (5,54:1).
   - Bordes de campo: hoy #D9CEC3 (1,45:1 sobre #FBF7F3; 1,55:1 sobre blanco). La auditoría sugiere al menos 3:1, por ejemplo #857870 (4,27:1 sobre blanco); queda por confirmar si es obligatorio porque la etiqueta visible ya identifica el campo.
7. **H28 · Aviso de datos y permiso de contactos.**
   - Poner el texto legal **antes** de los dos botones ("Continuar con Google" y "Continuar"): hoy queda debajo y, a 390 × 844, en y = 1116, fuera de la primera pantalla; quien entra con Google no lo ve.
   - Los enlaces a los documentos van fuera de cualquier botón y abren **en un panel**, sin perder lo ya llenado. Si hay casilla de autorización, que sea nativa, con etiqueta corta y los enlaces por fuera; autorización de datos separada de los términos y, si habrá publicidad, una casilla opcional aparte.
   - Una **pantalla propia para el permiso de contactos**, o cambiar el texto "Está en tus contactos" (hoy se muestra sin que el usuario haya dado permiso).
   - En producción, guardar la prueba de cada autorización (H12).
8. **H5 · Pie legal e identificación del vendedor.** Registro no tiene pie: agregar el pie legal común con [RAZÓN SOCIAL], NIT, dirección, teléfono, correo, PQR, enlace a sic.gov.co, Términos y Política de tratamiento. Usar **un único nombre por documento**: hoy Registro dice "[Política de privacidad]" (`:64`) y Evento "[Política de tratamiento de datos]" (`Evento.dc.html:774`); la Política de tratamiento y el Aviso de privacidad son documentos distintos (Decreto 1377 de 2013).
9. **H10 · Control de edad (parte de diseño, S).** Agregar **fecha de nacimiento** al registro. La política (18+ en toda la app, o de 14 a 17 años con autorización de los padres) la define un abogado.
10. **H38 · Botones que no hacen nada.** "Buscar amigos en mis contactos" (`:93`): conectarlo (con el permiso de H28), mostrar "Próximamente" o quitarlo.
11. **H35 · Etiqueta viewport.** `<meta name="viewport" content="width=device-width, initial-scale=1">`.
12. **H12 y H33 · Pantalla "Entrar".** "¿Ya tienes cuenta? Entrar" no puede llevar directo al feed: diseñar la pantalla "Entrar" y la verificación. Pedir la cuenta en el momento de la acción ("Comprar", "Voy", "Unirme") y, después de registrarse, **devolver al usuario al mismo punto** (hoy "Ir a mi feed" siempre lleva a Main).
13. **H41 · Patrones únicos.** Un componente de encabezado para visitantes y un margen lateral único en celular (Registro usa 24 px; otras pantallas usan 16 px).

**De producción que cambian esta pantalla:**

- **H12 · Cuentas:** ingreso con Google (OAuth real; hoy "Continuar con Google" solo pasa al paso 2) y con celular más código de verificación (SMS o WhatsApp); límite de intentos, aviso de inicio de sesión en un dispositivo nuevo, sesiones activas y recuperación de cuenta. Guardar cada consentimiento (usuario, versión del texto, fecha y canal) con **una casilla aparte para publicidad**; hoy el consentimiento es solo la frase "Al continuar aceptas…". Cuentas de organizador separadas y verificadas.
- **H10:** ocultar los eventos +18 a los menores y bloquear los mensajes directos de adultos que no sean contactos.
- **H30:** el barrio que se pide aquí aparece en el perfil ("@camivargas · Chapinero, Bogotá", `Perfil.dc.html:44`). Agregar el ajuste "Quién ve mis planes", con el barrio visible solo para los amigos.
- **H14:** el registro no ofrece el tipo de cuenta "organizador"; se resuelve con el panel de organizadores (fase 3).
- **H53:** entidades de datos involucradas: usuario, seguidores, ciudad y consentimiento.
- **H55:** analítica y monitoreo (Registro está entre las pantallas afectadas), con consentimiento de cookies.
- **H57:** fuentes alojadas en el propio servidor y precargadas (H57 no lista Registro entre sus pantallas, pero la regla de fuentes es global y Registro carga las mismas de Google Fonts).
- **H17 (Evento "y todas"):** la auditoría constata que no hay estados de carga ni de error en ninguna pantalla. Registro tampoco los tiene: hay que diseñar al menos el estado de envío al crear la cuenta o al volver de Google, y el error con opción de reintentar sin perder lo escrito (no hay textos para esto en el prototipo; quedan por redactar).
- **H7 (producción):** además de lo del prototipo, "En cada paso, llevar el foco al encabezado y anunciar…" y "Probar con NVDA, VoiceOver y TalkBack".


##### Detalles finos

1. **Altura real de los campos:** el `input` dice `height: 48px` pero se ve de **50 px** porque usa `box-sizing: content-box` (48 + 1 + 1). Si la implementación usa `* { box-sizing: border-box }` (como el código base), medirán 48 px. Elegir uno; las capturas muestran 50 px. En Evento los campos miden 48 px (`box-sizing: border-box`).
2. **Color del texto escrito:** los `input` no definen `color` y no lo heredan, así que el texto sale en **#000000** (negro del navegador), no en #17120F. Evento sí usa `color: #17120F`. Recomendado #17120F.
3. **Fondo de los campos:** #FBF7F3 (crema) sobre la tarjeta blanca. En el checkout de Evento son #FFFFFF. Decidir si el componente de campo tiene dos variantes.
4. **Tamaño de la etiqueta:** `.9rem` en Registro y `.86rem` en Evento.
5. **Botones sin `font-size`:** "Atrás" (pasos 2 y 3) y "Buscar amigos en mis contactos" se ven a **13,33 px** (tamaño por defecto del navegador para `<button>`, porque la regla global solo hereda la familia). El resto de botones fija su tamaño. Si se fija explícitamente, usar 13,33 px para respetar las capturas o decidir un valor del sistema.
6. **Placeholders:** usan el gris por defecto del navegador (#757575); no hay `::placeholder` definido. La corrección H52 los pasa a #6E6259.
7. **El hover global no se ve:** `a:hover{color:#C23A24}` existe, pero el logo (#D9452F), "Entrar" (#17120F) e "Ir a mi feed" (#FFFFFF) tienen color inline, así que **ningún elemento de Registro cambia al pasar el mouse**. Tampoco hay hover en botones ni chips. El código base sí tiene hovers (`.chip:hover` borde `--ink`, `.more:hover` color y borde `--brand`, `.btn-dark:hover` #33291F, `--brand-hover` #BF3923): si el componente compartido los trae, aplicarlos aquí también (decisión pendiente).
8. **Botón deshabilitado:** fondo #B9AEA4 con texto blanco (2,18:1; los controles deshabilitados están exentos de contraste) y cursor `pointer`. En Evento, Mapa y Chat el patrón es otro: `button:disabled{cursor:default;opacity:.45}` (Evento), `.4` (Mapa) o solo `cursor:default` (Chat). Unificar.
9. **Sin transiciones ni animaciones:** la barra de progreso, los chips, los "Seguir" y el cambio de paso son instantáneos. No inventar animaciones; si se agregan, respetar `prefers-reduced-motion`.
10. **El scroll no vuelve arriba al cambiar de paso:** a 390 px, después de "Continuar" la página queda en `scrollY = 356`. Con el foco en el h2 (H7) el problema se resuelve. Tampoco el foco se reubica: queda en `<body>` y el siguiente Tab cae en un sitio distinto según el botón pulsado (ver la fila "Cambio de paso" de la tabla de estados).
11. **Persistencia parcial:** los gustos (`likes`) y los seguidos (`follow`) sobreviven a "Atrás" y "Continuar"; los 3 campos del paso 1 no (son no controlados y se desmontan). Al recargar se pierde todo.
12. **"Continuar con Google" no es OAuth:** hace exactamente lo mismo que "Continuar" (`onClick="{{next}}"`). Además, el "Continuar con Google" de Bienvenida es un enlace que abre Registro en el paso 1, donde hay que volver a tocar "Continuar con Google". En producción, el de Bienvenida debería lanzar OAuth directamente.
13. **Ícono de Google:** es una "G" de trazo monocromo (`stroke-width 2.2`), no el logo oficial a color. Fuera de las fuentes del proyecto: las pautas de marca de Google para el botón de inicio de sesión suelen exigir el logo oficial; verificarlo al implementar.
14. **Sin `<form>`:** Enter en un campo no hace nada y ningún botón tiene `type`. Si la implementación envuelve los campos en un `<form>`, poner `type="button"` en "Continuar con Google", en los chips, en "Seguir", en "Atrás" y en el de contactos, y `type="submit"` solo en "Continuar".
15. **Llaves del estado con tildes:** `s.likes` usa el texto visible como llave ("Electrónica", "Reguetón", "Fútbol"). En producción usar identificadores estables (slugs) y dejar el texto solo como etiqueta.
16. **Separación vertical distinta por paso:** `gap` de 18 px en los pasos 1 y 2, y de **14 px** en el paso 3. La fila de acciones suma `margin-top: 8px` (26 px en el paso 2 y 22 px en el paso 3). La tarjeta usa `gap: 22px` entre la barra y el paso.
17. **Resaltado del titular:** cada línea del h1 es un bloque con su propio degradado y padding `.1em .22em .06em`; el segundo bloque invierte el degradado (rosado → durazno) y se corre `.8em`. Cuando "PLAN EMPIEZA" se parte en dos líneas, el resaltado es un rectángulo único, no uno por línea. El texto del h1 es #17120F sobre el degradado, aunque el panel tiene `color: #FFFFFF`.
18. **Distribución del panel:** `justify-content: space-between` + `min-height: 420px`; en escritorio el panel se estira al alto de la tarjeta, así que la posición del titular y de la lista cambia según el paso (690, 521 y 679 px de alto a 1280).
19. **El h1 está dentro del `<aside>`:** el título principal de la página es el eslogan decorativo y vive en un landmark complementario; el título real del formulario es un h2.
20. **Logo en DM Sans 700,** no en Archivo, igual que el `.logo` del código base.
21. **"Entrar" se subraya con `border-bottom: 2px`;** en el bloque "Únete" de Bienvenida el mismo enlace usa `border-bottom: 1px solid #FFFFFF`.
22. **Etiqueta "Paso N de 3":** se escribe en minúsculas y se muestra en mayúsculas por CSS (`text-transform: uppercase`), con esquinas rectas.
23. **Carácter "✓":** los pasos completados usan el carácter U+2713 en texto. DM Sans **no** tiene ese glifo (verificado en Chromium: lo dibuja una fuente del sistema, en el entorno de prueba Inter Bold), así que su forma cambia según el dispositivo. Un ícono SVG daría un resultado estable.
24. **Avatares no enlazados:** en Registro los avatares y nombres no llevan a Perfil; en Main sí (`href="Perfil.dc.html"`).
25. **Avatar de organizador:** en Registro, Galería Café Libro es un círculo; en Chat los organizadores tienen radio 14 px, iniciales #F6DC6A y Archivo 900. Unificar (y corregir H52).
26. **Última fila con borde:** el `border-bottom: 1px solid #F1EAE3` también aparece debajo de Galería Café Libro, justo encima de la fila de acciones.
27. **Motivos fijos:** "Le gusta la salsa y el fútbol" o "Va a 4 eventos que te gustan" no dependen de los gustos que eligió el usuario; en producción deben calcularse con datos reales.
28. **Sin truncado:** ni nombres ni motivos usan `ellipsis` ni `line-clamp`; el motivo hace salto de línea (`min-width: 0` en el bloque de texto).
29. **"Ir a mi feed" no exige nada:** se puede terminar sin seguir a nadie. No hay "Omitir": ese enlace cumple esa función.
30. **"Continuar" del paso 2 alineado a la izquierda en pantallas angostas:** a 360 px o menos se va a una segunda línea pegado a la izquierda, porque `space-between` con un solo ítem lo alinea al inicio. "Ir a mi feed" (paso 3, sin contador en la fila) aguanta en la misma línea hasta 360 px y solo salta, también a la izquierda, a 320 px.
31. **"Celular o correo" con `autocomplete="email"`:** el navegador solo sugerirá correos aunque el campo acepte celular; el campo de barrio no tiene `autocomplete`. Ningún campo tiene `name`, `id`, `required`, `inputmode` ni `maxlength`.
32. **Texto legal con marcadores:** "[Términos]" y "[Política de privacidad]" son placeholders entre corchetes que hay que reemplazar por enlaces reales con el nombre definitivo de cada documento (H5).
33. **Sección con nombre pero sin formulario:** `aria-label="Formulario de registro"` en una `<section>` que no es un `<form>`.
34. **Pantalla sin `z-index`, `position`, `overflow` de página ni elementos fijos;** el único `overflow: hidden` es el del riel de la barra de progreso.
35. **Ancho máximo efectivo de 1288 px** (1240 de contenido + 48 de padding con `content-box`); el encabezado y el `<main>` comparten esa regla y quedan alineados.
36. **Inconsistencia con la landing:** Bienvenida promete "elige tu ciudad" y Registro no la pide (H45); el Mapa tiene fijo "Mi ciudad: Bogotá" (`Mapa.dc.html:104`).


#### 8.2.3 Inicio (feed)

##### Correcciones obligatorias de la auditoría

Hallazgos del informe `docs/auditoria-2026-10-07.md` que tocan esta pantalla. Lo que piden **se implementa así**, aunque el prototipo haga otra cosa.

**De diseño (prototipo)**

- **H15 (Alta) · El feed queda enterrado en celular y tableta.** Hoy las tres columnas se apilan en el orden de escritorio: la primera publicación queda en y = 1443 a 390 px y en y = 1209 a 768 px; a 768 la columna izquierda ocupa 260 de 720 px; a 1024 "Descubre" baja al final. Implementar:
  - La auditoría propone un rediseño con dos puntos de quiebre: "Hacia 1120 px, 'Descubre' se oculta o pasa a ocupar todo el ancho" y "En tableta y celular, la barra izquierda se vuelve una barra inferior". En concreto:
  - **≥ ~1120 px:** las tres columnas, como en el prototipo.
  - **Por debajo de ~1120 px (tableta horizontal):** "Descubre" se oculta o pasa a ocupar todo el ancho. Nunca debe quedar una columna de 340 px alineada a la izquierda con espacio vacío.
  - **Celular y tableta vertical:**
    - lo primero son las historias y el feed (compositor, pestañas, publicaciones);
    - el menú lateral pasa a la barra inferior (H40);
    - la auditoría no dice dónde van la tarjeta de perfil y "Tus parches" en celular; propuesta (no de la auditoría): moverlos a Perfil y a Mensajes, que ya muestran esos datos;
    - "Tu semana", el mini-mapa y "Gente con tus gustos" ("las sugerencias") pasan a tarjetas intercaladas entre publicaciones o a un carrusel.
  - **Arreglo mínimo aceptable** (S, según la auditoría): reglas `@media` que apunten a cada `aside` por su `aria-label` y les cambien `order`, `display` y `max-width`, para que el feed vaya primero y nada quede a media anchura.
- **H40 · El encabezado ocupa 224 px en celular.** Implementar en celular:
  - un encabezado de una fila de 56 a 64 px (logo, lupa que abre la búsqueda y avatar) que se esconda al bajar;
  - una barra inferior con 5 pestañas con texto: "Inicio", "Agenda", "Mapa", "Mensajes" (con la insignia) y "Perfil";
  - "Crear evento" como acción secundaria, fuera de la fila principal;
  - la auditoría no ubica el selector de ciudad en el encabezado móvil; propuesta (no de la auditoría): dentro de la búsqueda o como chip encima del feed.
- **H59 · Semántica.** Implementar:
  - `<h1>` visualmente oculto "Tu feed";
  - un `<h3>` por publicación (por ejemplo, el nombre del evento o "Laura Martínez va a un evento");
  - el enlace "Saltar al contenido" como primer elemento enfocable, que lleve al feed (hoy hacen falta 40 Tabs);
  - nombres accesibles que empiecen por el texto visible: "CV, tu perfil" en lugar de "Tu perfil" (ejemplo de la auditoría); aplicando la misma regla a las otras 13 alertas de axe, por ejemplo "LM, perfil de Laura Martínez" y "LM, historia de Laura en Bogotá" (textos propuestos);
  - la auditoría pide grupos de radio (`fieldset` y `legend`, o `role="radiogroup"`) para las opciones de una sola respuesta y el patrón de pestañas de ARIA para las pestañas, y lo mide en Evento y Mapa. Las pestañas del feed de Inicio ("Amigos", "Parches abiertos", "Reseñas", "Cerca de ti") son del mismo tipo (excluyentes, hoy botones `aria-pressed` independientes): aplicar el mismo patrón por coherencia.
- **H51 · Campos sin indicador de foco** (`Main.dc.html:28` y `:136`). Quitar `outline: 0` del buscador y del compositor. Marcar el contenedor del buscador con `:focus-within` (borde de 2 px #C23A24) y darle al campo del compositor el foco común. Aplicar a toda la pantalla la regla de `Evento.dc.html:19`: `button:focus-visible, a:focus-visible, input:focus-visible, select:focus-visible { outline: 3px solid #C23A24; outline-offset: 2px }`. En la tarjeta oscura "Tu semana" (enlaces sobre #17120F, donde #C23A24 solo da 3,47:1), usar #F6DC6A (13,6:1) como en `Mapa.dc.html:20` (`[data-fe~="dark"] button:focus-visible{outline-color:#F6DC6A}`). En el mini-mapa **no**: su enlace está dentro de una tarjeta blanca y el contorno (con `outline-offset: 2px`) se dibuja sobre blanco, donde #F6DC6A da 1,37:1; ahí va #C23A24 (5,35:1). (Este detalle es propuesta derivada; la auditoría solo pide la regla común y el `:focus-within`.)
- **H38 · 11 botones sin acción en Inicio** (`:63`, `:66`, `:140`, `:142`, `:144`, `:146`, `:148`, `:190`, `:242`, `:244`, `:246`). Lo que pide la auditoría: "Conectar los que ya tienen pantalla" y, "para los demás, mostrar 'Próximamente' o quitarlos". En Inicio:
  - **"Guardar evento"** igual que en Agenda (lo pide la auditoría): alternable con `aria-pressed` y marcador relleno al guardar.
  - **"Armar parche"** abre "Nuevo parche" del Chat (lo pide la auditoría).
  - **"Crear evento":** agregar `type="button"` (le falta en Agenda, Main y Mapa) y abrir un formulario de contacto para organizadores (la auditoría lo sugiere; ver H14).
  - **"Más opciones"** abre el menú de reportar y bloquear (H9 propone usar justo este botón).
  - **Campana:** centro de notificaciones (H54) o "Próximamente".
  - **"Etiquetar evento", "Foto", "Reseña", "Publicar", "Comentarios" y "Compartir":** "Próximamente" o quitarlos hasta que tengan pantalla. En producción necesitan su función (selector de evento, subida de foto, reseña con calificación, envío con estados de envío y error, hilo de comentarios, hoja de compartir con la URL propia del evento según H34), pero **nada de eso está diseñado**: no inventarlo sin diseño.
- **H36 · Todas las tarjetas abren el mismo evento.**
  - Arreglo de la auditoría en el diseño: duplicar Evento para 2 o 3 casos (pagado, gratis, fútbol) o marcar "Demo: solo este evento", y hacer que "Sube tu plan" abra el campo para publicar (no Evento).
  - En producción (H34): cada título de evento adjunto y cada plan de "Tu semana" enlaza a su propio evento (`/evento/:ciudad/:slug`). Las historias hoy abren Evento; qué abre una historia de verdad (un visor de historias) no está diseñado.
  - Las tendencias abren Agenda sin filtro; filtrarlas por ciudad es propuesta (ver "Navegación de entrada y salida").
- **H46 · Todos los perfiles abren el de Camila.** Avatar y nombre de cada autor y de "Gente con tus gustos" enlazan a `/perfil/:usuario`. Los enlaces propios (avatar del encabezado, tarjeta de perfil) abren la variante "Mi perfil".
- **H42 · Saltos que pierden el contexto.**
  - "Ver {ciudad} en el mapa" y "Ver en el mapa" de la franja deben abrir el Mapa con esa ciudad elegida (`/mapa?ciudad=cali`).
  - "Tus parches" debe abrir la conversación de cada parche (`/mensajes/:conversacion`), no siempre "Salseros de jueves" (la auditoría lo pide en general: "Abrir el Mapa y el Chat en la ciudad o conversación correcta").
- **H37 · El mismo evento muestra datos distintos.** En Inicio:
  - la hora de e1 dice "9:00 p. m." en Inicio (y en "Tu semana"), "Puertas 8:00 p. m." y "Show 9:30 p. m." en Evento (`Evento.dc.html:87-88`) y 8:00 p. m. en el Chat. Usar un solo dato ("Un solo bloque de datos de ejemplo, revisado"). La auditoría no dice cuál es la correcta: confirmarlo con el cliente; si el evento tiene puertas y show, mostrar la misma hora en todas las pantallas;
  - "N van · 3 amigos" tiene "3 amigos" fijo: debe calcularse, y los avatares deben ser los amigos reales que van;
  - "Vas" (Inicio), "Va" (Perfil) y "Voy" (Evento): diferenciar "Voy" de "Tengo boleta";
  - "Tu semana" cuenta como confirmado un plan que el Chat marca "Sin boleta";
  - "Clásico capitalino": el lateral dice "4 de 6" y el post sube a "5 de 6" sin que el lateral cambie, así que deben salir del mismo dato;
  - "Planes 38" aquí frente a "Eventos 38" en Perfil: un solo nombre;
  - las historias de ejemplo deben ser coherentes: en el Chat Andrés dice "Llego a Bogotá el jueves en la noche para la salsa" (`Chat.dc.html:668`), pero en Inicio abre un parche para el viernes en Medellín ("Noche de reguetón en Provenza", Vie 9 oct · 10:00 p. m.);
  - la reseña de Juan Pablo es de "Ayer" sobre un evento del domingo 11 que todavía no pasó: reseñas solo después del evento y solo de asistentes.
- **H25 · Se ofrece "Unirme" a quien ya está.** Camila es miembro del "Clásico capitalino", pero la publicación de Sofía le ofrece "Unirme al parche". Si el usuario ya es miembro, mostrar el estado "Estás dentro" o "Estás en el parche" desde el inicio, y unificar los datos del parche entre el lateral, el post, el Chat y Evento.
- **H30 · Se expone dónde y cuándo estará cada persona.**
  - Las publicaciones de parche muestran en público el punto de encuentro ("nos vemos a las 9 en el parque Lleras", "Nos vemos a las 2 en la tienda de la 57"), y "Unirme al parche" entra sin aprobación (`Main.dc.html:394`, `:441-443`).
  - Implementar tres tipos de parche: abierto, con aprobación y privado. El punto de encuentro solo lo ven los miembros aprobados. (Los textos "Solicitar unirme" y "Solicitud enviada" para el parche con aprobación son propuesta: no están en el prototipo ni en la auditoría.)
  - Detectar "casa de" o direcciones en textos públicos.
  - Mostrar consejos de seguridad al unirse.
  - Agregar el ajuste "Quién ve mis planes".
- **H9 · Reportar y bloquear.** La auditoría pide "un menú en cada mensaje, persona, publicación y parche con 'Reportar' (con motivos), 'Bloquear' y 'Salir y reportar'", y propone usar el "Más opciones" de `:190`. En Inicio: "Reportar" y "Bloquear" en cada publicación ("Salir y reportar" aplica a los parches). Entrar a un parche como invitación que se acepta ("Laura te invitó a…"), un ajuste "Quién puede escribirme y agregarme" y que el administrador pueda sacar miembros.
- **H20 · "Mis boletas" no existe.** Agregar "Mis boletas" al menú lateral (`:96-101`), en el lugar de la barra inferior que corresponda en celular y en el menú del avatar.
- **H5 · No se ve quién vende.** El único texto legal es el párrafo de la columna derecha (`:307`). Agregar acceso a lo legal desde el menú o el perfil, y un pie legal con [RAZÓN SOCIAL], NIT, dirección, teléfono, correo, PQR, enlace a sic.gov.co, Términos y Política de tratamiento. En celular, el pie debe quedar alcanzable aunque el feed sea largo (por ejemplo, desde el menú del perfil).
- **H62 · Textos.**
  - "Ver todo Colombia" (`:167` y `:176`) pasa a "Ver toda Colombia", y el mensaje vacío "vuelve a todo Colombia" (`:521`) a "vuelve a toda Colombia".
  - Unificar el nombre del alcance nacional ("Toda Colombia" en el selector, "Colombia" en los textos, "Todo el país" en tendencias y en el botón del mini-mapa).
  - Unificar "Mis parches" (menú) y "Tus parches" (tarjeta).
  - No repetir "Nuevo": la auditoría lo mide en Mapa (5 lugares); en Inicio aparece 2 veces (menú lateral y tarjeta "Mapa de eventos"). Aplicar el mismo glosario.
- **H41 · Navegación y patrones inconsistentes** ("Las 8"; evidencia en Inicio: búsqueda `Main.dc.html:28`). Implementar:
  - un solo componente de encabezado para la app con sesión (con una variante "detalle") y otro para visitantes; el de Inicio es la base (ver sección 1: hoy difiere del de Mapa en `z-index` y margen lateral);
  - una pantalla de resultados de búsqueda con sus estados vacío y de carga: hoy el buscador de Inicio no hace nada y su placeholder ("Busca planes, gente o lugares") difiere del de Agenda y Mapa ("Busca eventos, lugares o artistas") y del de Bienvenida ("¿Qué plan buscas?");
  - el ícono de marcador para guardar (como ya hace Inicio) y el corazón solo para "Me gusta";
  - un margen lateral único en celular (Inicio usa 24 px fijos; Mapa usa `clamp(16px, 4vw, 24px)`; el código base baja a 16 px a ≤ 520 px);
  - que "Volver" regrese a la pantalla de origen (afecta a quien vuelve a Inicio desde Evento y Perfil).
- **H33 · Versión pública y "Entrar".** Inicio es solo para usuarios con sesión: sin sesión debe redirigir a `/entrar` o `/`, y "Entrar" de Bienvenida y Registro debe pasar por el inicio de sesión.
- **H35 · Falta la etiqueta viewport.** `<meta name="viewport" content="width=device-width, initial-scale=1">`.
- **H21 · Precio con cargo.** Inicio hoy no muestra precios. Si se agrega el precio al evento adjunto, debe usar el mismo formato que el resto: "Desde $45.000 + cargo por servicio" o el total con cargos.
- **H1 · Modo de compra.** El texto "Compra segura dentro de Fulleventos. Las boletas las emite la boletera oficial del evento o el organizador." (`:307`) debe condicionarse al modo de compra de cada evento (gratis, boletera externa o venta propia).
- **Alineado con H52** (la auditoría lo mide en Registro y Chat; aquí pasa lo mismo): el placeholder del compositor sobre crema da 4,32:1. Usar #6E6259 en los placeholders.

**De producción que cambian esta pantalla**

- **H13:** chat en tiempo real. La insignia de "Mensajes" debe venir del conteo real y actualizarse en vivo; la misma cifra en el encabezado y en el menú.
- **H54:** la campana abre un centro de notificaciones con preferencias por tipo.
- **H14 y H4:** "Crear evento" lleva al flujo de organizador (fase 1: formulario de contacto o curaduría; fase 3: panel con PULEP, localidades y cupos).
- **H32:** reventa. La publicación de Laura ("Tengo dos boletas de más") es el caso típico: detectar publicaciones de "vendo boleta" o "boletas de más" y mostrar la opción oficial de transferir.
- **H53:** un solo modelo de datos. Las publicaciones ya referencian el evento por `id` (`ev`), y eso hay que conservarlo. Usuario, publicación, evento, parche, miembros y conteos salen del servidor; las fechas relativas ("Hace 1 h", "Ayer") se calculan con la hora del servidor en la zona `America/Bogota`.
- **H17** (es hallazgo de prototipo, "Evento y todas"; va aquí porque necesita datos reales): esqueletos de carga y errores con "Reintentar" en las listas, el mapa y el chat; en Inicio, el feed, las historias y las columnas. La paginación o carga continua del feed (hoy no hay límite) no la pide la auditoría para Inicio (H47 la pide para Agenda y Mapa, con el patrón "Ver N planes más" de Bienvenida), pero es necesaria con datos reales.
- **H12:** sesión real; el nombre de pila del placeholder y los datos del perfil vienen de la cuenta.
- **H34:** "Compartir" usa la URL propia del evento, con Open Graph.


##### Detalles finos

1. **"VerCalien el mapa":** el botón rojo del estado vacío pierde los espacios alrededor del nombre de la ciudad porque el enlace es flex y la ciudad es un nodo aparte. Debe decir "Ver Cali en el mapa".
2. **`rem` sobre 16 px, no sobre los 15 px del contenedor.** Conversiones usadas:

   | rem | px |
   |---|---|
   | .64 | 10,24 |
   | .66 | 10,56 |
   | .68 | 10,88 |
   | .7 | 11,2 |
   | .72 | 11,52 |
   | .74 | 11,84 |
   | .76 | 12,16 |
   | .78 | 12,48 |
   | .8 | 12,8 |
   | .84 | 13,44 |
   | .85 | 13,6 |
   | .86 | 13,76 |
   | .88 | 14,08 |
   | .9 | 14,4 |
   | .95 | 15,2 |
   | .97 | 15,52 |
   | 1 | 16 |
   | 1.05 | 16,8 |
   | 1.15 | 18,4 |
   | 1.2 | 19,2 |
   | 1.5 | 24 |
   | 1.55 | 24,8 |

   El texto sin tamaño propio mide 15 px.
3. **`content-box` por todas partes.** Tamaños renderizados que difieren del código:
   - anillo de historia: 74 px, no 68;
   - placa de fecha: 62 × 43,2;
   - avatares de "van": 28 px, no 24;
   - "Ver qué pasa en todo el país" y los enlaces con `box-sizing: border-box` sí miden lo declarado.

   El código base del cliente **sí** usa `* { box-sizing: border-box }`: si se reutiliza, hay que ajustar estos valores para conservar lo renderizado (por ejemplo, anillo de 74 px con `padding: 3px`, placa con `min-width: 62px`, avatares de "van" de 28 px con borde de 2 px).
4. **Ícono comprimido:** a 1280 px "Mapa de eventos" del menú ocupa dos líneas y su SVG se aplasta a 15,2 px de ancho (los íconos del menú no tienen `flex-shrink: 0`). En producción, todos los íconos con `flex-shrink: 0`.
5. **Ítem actual del menú 2 px más alto** (46,5 frente a 44,5) por su borde de 1 px, y su ícono se corre 1 px. Para evitarlo, dar a todos los ítems un borde transparente.
6. **Las historias siempre desbordan** (738 px). No hay pista visual de "hay más" y la barra de scroll no está oculta (`padding-bottom: 4px` le deja espacio). Decidir: degradado y flechas, u ocultar la barra con `scrollbar-width: none` y dejar una pista (H61, mismo patrón).
7. **Anillo de historias:** degradado `135deg, #F3B27E → #D9452F` para las que se leen como no vistas (Laura, Andrés, Nata, Caro; el prototipo no calcula "vista") (el único uso del rojo de marca fuera del logo) y #EAE1D8 para las vistas y para "Tu plan". El círculo interior tiene 3 px de borde crema #FBF7F3 que separa el anillo del color.
8. **Efecto lateral del hover global:** como `a:hover` cambia el `color` del enlace, también se ponen rojas las iniciales de los avatares enlazados (historias, autores, "Gente con tus gustos", "Tus parches", tarjeta de perfil, avatar del encabezado). Seguramente no es intencional: en producción, limitar el hover rojo a los textos y dejar las iniciales en #17120F.
9. **Enlaces que no cambian con el hover** por tener color inline: logo, "Inicio" actual, "Tu semana", tarjeta del mini-mapa, "Ver {ciudad} en el mapa". Los botones no tienen ningún hover. Si se agregan estados hover en producción, son decisión nueva, no del prototipo.
10. **Sin transiciones:** los toggles, la barra de cupos y los filtros cambian de golpe.
11. **La barra de cupos se acorta al unirse,** porque "Estás en el parche" es 8 px más ancho que "Unirme al parche" (riel de 457,8 a 449,7 px a 1280). Si se quiere estable, dar al botón un ancho mínimo.
12. **Redondeo de cupos:** `Math.round(62.5)` = 63 % (Provenza, 5 de 8).
13. **Laura arranca en "Vas"** (`going: { p1: true }`) con el dato base 23: el "24 van" visible ya incluye a Camila. En producción, el conteo del servidor ya incluye al usuario; no sumar dos veces.
14. **"3 amigos" fijo** en las 5 publicaciones, y los 3 círculos de "van" son siempre #F3B27E, #A3A8F0 y #EE93BC, sin iniciales.
15. **El filtro de ciudad solo filtra publicaciones.** No cambian historias, "Tus parches", "Tu semana", el mini-mapa, "Gente con tus gustos" ni "Tendencias en Colombia".
16. **La pestaña se conserva al cambiar o limpiar la ciudad** ("Ver todo Colombia" no vuelve a "Amigos"), y los toggles se conservan entre filtros porque se guardan por `id`.
17. **La franja de ciudad y el estado vacío son excluyentes:** la franja solo aparece si hay al menos una publicación.
18. **Estado vacío con "Toda Colombia":** no ocurre con los datos de ejemplo, pero el código produciría "…en Colombia…", un "Ver todo Colombia" que no hace nada y "Ver Colombia en el mapa". Diseñar ese caso en producción.
19. **Dos tamaños de "Ver todo Colombia":** 38 px, `.84rem`, `padding 0 14px` en la franja; 44 px, `.9rem`, `padding 0 20px` en el estado vacío.
20. **Texto escrito en el compositor en negro #000000** (el campo no define `color`). Poner #17120F.
21. **Placeholders truncados sin puntos suspensivos:** el del buscador a 390 px ("Busca planes, g") y el del compositor. Considerar un placeholder más corto en celular.
22. **El selector de ciudad** tiene `max-width: 8.6em` (123,84 px), flecha nativa y valor atado al estado: al limpiar la ciudad vuelve a "Toda Colombia".
23. **Mensajes sin leer "3" repetido** en el encabezado y en el menú, ambos fijos: una sola fuente en producción.
24. **"Mis parches" lleva a `#parches`,** y como no hay `scroll-margin-top` ni `scroll-padding-top`, la tarjeta "Tus parches" queda tapada por el encabezado fijo. El mismo problema tendrá cualquier elemento enfocado con Shift+Tab bajo el encabezado (patrón de H16). Usar `scroll-padding-top` igual a la altura del encabezado.
25. **El encabezado tiene `z-index: 5`.** Nada más de la pantalla usa `z-index`; los menús y diálogos que se agreguen (H9, notificaciones) deben ir por encima.
26. **Las columnas laterales no son fijas:** en escritorio, debajo de ellas queda crema vacío mientras el feed sigue. Si en producción se hacen `sticky`, hay que revisar que "Descubre" (1511 px de alto) quepa o tenga su propio scroll.
27. **"Guardados" y "Recuerdos" abren Perfil en "Próximos planes";** Perfil no tiene pestaña "Guardados". En producción: `/yo?pestana=guardados` y `/yo?pestana=recuerdos`, y crear la vista "Guardados".
28. **"Explorar agenda" usa el ícono de lupa,** mientras el encabezado usa el calendario para Agenda. Unificar.
29. **El corazón es "Me gusta" y el marcador es "Guardar"** (en Agenda el corazón es "Guardar"; H41). Mantener esta convención en todas las pantallas.
30. **En la publicación solo el título del evento es enlace;** la foto y la placa de fecha no. La placa está **dentro** del `role="img"`, y según ARIA los hijos de un `img` son presentacionales: la fecha podría no leerse. En producción, usar `<img alt="…">` y la fecha como `<time datetime="2026-10-09">` fuera de la imagen.
31. **Mayúsculas por CSS:** "Rumba" → "RUMBA", "oct" → "OCT", "vie" → "VIE", "Tu semana" → "TU SEMANA", "3 planes confirmados" → "3 PLANES CONFIRMADOS", "Tus parches" → "TUS PARCHES". En los datos van en minúscula o en tipo oración; no escribirlos en mayúsculas.
32. **Línea de lugar:** los " · " internos del lugar se convierten en ", " y luego se agrega " · " + ciudad en negrita. "Gran Malecón del Río" no tiene " · ", así que queda igual.
33. **Horas con espacios normales** ("9:00 p. m."), así que pueden partirse entre "p." y "m.". En producción, unir con espacio de no separación.
34. **El logo es DM Sans 700,** no Archivo. Los días de "Tu semana" piden 700 en Archivo, pero se pintan con la cara 800 porque solo se cargan 800 y 900. Si producción carga Archivo 700, se verán más delgados que en el prototipo: cargar solo 800 y 900 o fijar 800.
35. **Los `<h2>` no tienen peso declarado:** usan el negrita por defecto (700). "Tus parches" y "3 planes confirmados" tienen estilos propios; los demás miden 1rem.
36. **No hay `<footer>`:** el último elemento de la página es el párrafo legal de la columna derecha.
37. **"Ver qué pasa en todo el país" es un `span` dentro del enlace,** no un botón. A 1280 px se parte en dos líneas con la flecha a la derecha.
38. **Mini-mapa:**
    - pines ordenados de menor a mayor para que Bogotá ("6") quede encima;
    - etiquetas dibujadas después de los pines;
    - solo 5 ciudades con nombre;
    - Leticia en `top: 97%`: por la proyección le correspondería ≈ 98,4 % (y = 172,15 de 175, justo en la punta del contorno, `L95.6 172.2`); el valor está ajustado hacia arriba y es el mismo en Agenda, Bienvenida y Mapa. Copiarlo tal cual;
    - marco `width: min(100%, 240px)` (214 px a 1280; 240 apilado);
    - todo `aria-hidden` y dentro de un solo enlace, así que no hay pines enfocables.
39. **"Gente con tus gustos" a 1280 px:** columna de texto de solo 108 px, con nombres y motivos partidos en 2 y 3 líneas. Es lo esperado en el prototipo; si se quiere evitar, reducir el botón o permitir que baje.
40. **Botones alternables cuyo texto cambia ("Voy/Vas", "Unirme…/Estás…", "Seguir/Siguiendo") y que además usan `aria-pressed`:** el lector anuncia un nombre distinto en cada estado. Recomendación: dejar el texto fijo con `aria-pressed`, o cambiar el texto sin `aria-pressed`, y aplicarlo igual en todas las pantallas.
41. **Botones sin `type`:** pestañas, "Voy", "Unirme", "Me gusta", "Seguir", "Más opciones", "Comentarios", "Compartir", "Guardar", campana y "Crear evento". Hoy no hay formulario, pero en producción, si alguno queda dentro de un `<form>`, enviaría el formulario. Poner `type="button"` en todos.
42. **No hay anuncio de cambios:** al filtrar por pestaña o ciudad, la lista cambia en silencio. Agregar una región `role="status"` oculta con "Mostrando 3 planes de tu gente en Bogotá" o "Sin planes en Cali en esta pestaña" (patrón de H49).
43. **Estrellas en #E0A21B sobre blanco (2,25:1)** como gráfico; tienen texto alternativo "Calificación 5 de 5", y el número de estrellas no es un dato (siempre 5).
44. **Borde punteado del estado vacío #EAE1D8 (1,29:1)** y riel de la barra #EAE1D8 sobre crema (1,21:1): son decorativos, porque el texto da la información.
45. **Mensaje del estado vacío con `max-width: 46ch`** (unos 472 px a 15 px), centrado.
46. **Hashtags con tildes** ("#ClásicoCapitalino", "#VallenatoEnElMalecón", "#PacíficoEnVivo"): si en producción son enlaces o parámetros de URL, normalizar (`/agenda?tema=clasico-capitalino`) sin perder la tilde en pantalla. "1.150 planes" lleva punto de miles.
47. **"Tu semana" recorta el título** ("Noche de salsa y boleros" frente a "Noche de salsa y boleros en vivo") y no cambia con "Voy" en el feed.
48. **Los parches del lateral muestran datos distintos según el tipo:** "12 miembros · 2 nuevos", "8 miembros" o "4 de 6 cupos" (solo el Clásico tiene cupo máximo). En producción, una regla clara: con cupo máximo, "N de M cupos"; sin cupo, "N miembros" y los nuevos si los hay.
49. **Orden del feed:** el del arreglo (p1, p4, p2, p5, p3), que coincide con lo más reciente primero ("Hace 1 h" … "Ayer"). En producción, orden cronológico inverso del servidor.
50. **Sin límite de publicaciones ni paginación;** el texto de cada publicación no se trunca (no hay "Ver más").
51. **`hint-placeholder-count`** (8 historias, 4 pestañas, 4 publicaciones, 11 pines, 5 etiquetas, 3 personas, 5 tendencias) es solo una pista del motor del prototipo para dibujar la plantilla vacía; no es un límite.
52. **"Salseros de jueves" va a un evento del viernes** (e1, Vie 9 oct), según el Chat (`Chat.dc.html:609`). Es el nombre del grupo, no la fecha del plan; si en pruebas confunde, renombrarlo en los datos de ejemplo.
53. **Contenido de ejemplo con marcas reales:** los eventos traen "TuBoleta", "Ticketmaster", "Fever" e "Idartes" en el campo `b`. Inicio no los muestra hoy, pero no deben aparecer si se agrega el precio (H1).


#### 8.2.4 Agenda

##### Correcciones obligatorias de la auditoría

**Del prototipo (deben quedar distintas a como están en el prototipo):**

- **H5 · Quién vende (Alta).** El pie (`:174-179`) solo tiene dos textos y 0 enlaces. Implementar el pie legal común con [RAZÓN SOCIAL], NIT, dirección, teléfono, correo, PQR, enlace a sic.gov.co, Términos y Política de tratamiento (con un único nombre para cada documento). Los datos reales los define el abogado.
- **H7 · Ventana modal (Alta).** Hoy la ventana "Repostear" no se cierra con Escape ni tocando afuera (`Agenda.dc.html:181-183`, sin `onKeyDown`), el foco se queda en la tarjeta detrás del fondo (la auditoría mide 91 Tabs para entrar a 1280; en este handoff, 92 Tabs contando desde el botón "Repostear" de la primera tarjeta hasta "Cerrar"), Tab sale de la ventana hacia el encabezado y al cerrar el foco se pierde. Implementar: (1) foco inicial dentro de la ventana (en el prototipo, `sc-camel-auto-focus` en el botón "Cerrar"; en producción, `<dialog>` con `showModal()`, React Aria o Radix); (2) el resto de la página `inert` (header, main y footer) mientras esté abierta; (3) Escape y clic en el fondo cierran; (4) al cerrar o confirmar, el foco vuelve al botón "Repostear"/"Reposteado" que la abrió; (5) foco atrapado dentro.
- **H8 · Desborde a 320 px (Alta).** El selector de fecha (309,5 px) desborda 14 px a 320 px. Dejar que haga salto de línea o que tenga su propio desplazamiento horizontal. Agregar una prueba automática de ancho de página a 320 px.
- **H21 · Precio sin el cargo (Media).** Las tarjetas dicen "Desde $45.000" y el 8 % solo aparece en el checkout. Usar en todas las pantallas el mismo formato: "Desde $45.000 + cargo por servicio" o "Desde $48.600 con cargos" (la elección depende de la decisión P4 sobre el cargo). Si se elige la segunda, con el 8 % del prototipo los valores serían: $45.000 → $48.600; $50.000 → $54.000; $40.000 → $43.200; $30.000 → $32.400; $90.000 → $97.200; $25.000 → $27.000; $70.000 → $75.600; $35.000 → $37.800; $180.000 → $194.400; $60.000 → $64.800; $55.000 → $59.400.
- **H33 · Versión pública (Media).** La auditoría: hoy "Ver toda la agenda" de Bienvenida abre "Agenda para ti" con el avatar de Camila; hacen falta versiones públicas con encabezado "Entrar / Crear cuenta" y todo el contenido visible, pidiendo la cuenta solo en el momento de la acción (allí se nombran "Comprar", "Voy" o "Unirme") y devolviendo al usuario al mismo punto después de registrarse; y diseñar la pantalla "Entrar" (H12). Adaptación de este handoff para Agenda (no está en la auditoría, por confirmar con el cliente): en la versión pública quitar lo que depende de la sesión ("Para ti", "Lo que repostea tu gente", la línea "Tú, …", el avatar "CV") y pedir la cuenta al tocar "Comprar", "Repostear" o "Guardar".
- **H35 · Viewport (Media).** Agregar `<meta name="viewport" content="width=device-width, initial-scale=1">` (junto con H8).
- **H36 · Todas las tarjetas abren el mismo evento (Media).** `href: 'Evento.dc.html'` para los 19 (`:328`): "Rock en el Movistar Arena · Desde $180.000" abre un evento de $45.000 y "Ver plan" de un gratis (p. ej. "Vallenato en el Gran Malecón") abre un evento pagado con "Comprar". En el prototipo, la auditoría pide duplicar Evento para 2 o 3 casos (pagado, gratis, fútbol) o marcar "Demo: solo este evento". En producción, cada tarjeta enlaza a su `/evento/:slug` (ver H34); un evento gratis debe abrir una página sin checkout.
- **H38 · Botones muertos (Media).** En esta pantalla: campana (`:59`), "Crear evento" (`:61`, además sin `type="button"`) y "Enviar a un amigo" (`:165`). Conectarlos o mostrar "Próximamente", o quitarlos. Para "Crear evento", la auditoría sugiere un formulario de contacto para organizadores.
- **H39 · La fecha no filtra (Media).** "Hoy" y "Próxima semana" solo cambian el botón (`:246-248`). Filtrar de verdad y actualizar con la fecha el título ("Este finde en…"), la línea de resultados ("… este finde"), los conteos de los chips y el mensaje vacío. Si no hay planes: un estado vacío honesto (ejemplo de la auditoría: "Hoy no hay planes en tu ciudad: mira el finde"). Si no se va a filtrar, quitar el control. El prototipo no define qué día es "hoy" ni qué fechas cubre "Próxima semana" (por definir).
- **H40 · Encabezado de 224 px en celular (Media).** Ocupa el 26,5 % de 390 × 844 (y más en 360 × 640). Implementar el encabezado móvil de una fila (56 a 64 px, con logo, lupa y avatar) que se esconda al bajar, más una barra inferior con 5 pestañas con texto (Inicio, Agenda, Mapa, Mensajes, Perfil) y "Crear" como acción secundaria.
- **H41 · Patrones inconsistentes (Media).** Para esta pantalla: un solo componente de encabezado con sesión; búsqueda con pantalla de resultados (hoy no busca); el selector "Lista / Mapa" debe existir también en Mapa para volver; margen lateral único (Agenda usa 24 px fijos, Mapa `clamp(16px, 4vw, 24px)`); **un solo patrón para repostear** (aquí abre ventana, en Mapa es instantáneo, `Agenda.dc.html:335-342` frente a `Mapa.dc.html:415`); y **ícono de marcador para "Guardar"** (aquí es un corazón, que en Main significa "Me gusta").
- **H47 · Sin paginar (Media).** A 390 px la página mide 11.110 px (972 nodos, 42 por tarjeta). En el prototipo/diseño: el patrón de Bienvenida (8 tarjetas + "Ver N planes más"), una tarjeta compacta horizontal en celular (miniatura de 88 px) y agrupación por día. En producción: paginación desde la base de datos (unos 20 por página) con "Cargar más" y virtualización por encima de 100.
- **H49 · Cambios no anunciados (Media).** El aviso "Reposteaste…" aparece junto con su `role="status"` (`:108-111`) y los cambios de filtro no se anuncian. Agregar una región viva permanente, vacía y visualmente oculta (`role="status"`) donde se escriban mensajes como "Mostrando 6 planes en Bogotá" o "Reposteaste «…» en tu feed".
- **H51 · Campos sin foco visible (Media).** El buscador (`:28`) y el comentario (`:192`) tienen `outline: 0`. Quitarlo o marcar el contenedor con `:focus-within` (borde de 2 px `#C23A24`), y aplicar en toda la pantalla la regla de Evento: `button:focus-visible, a:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible { outline: 3px solid #C23A24; outline-offset: 2px; }` (la de `Evento.dc.html:19`, que no incluye `textarea`; aquí sí hace falta).
- **H59 · Semántica (Baja).** En esta pantalla: el avatar se llama "Tu perfil" pero dice "CV" → nombre que empiece por el texto visible ("CV, tu perfil"); los chips de ciudad tienen la misma alerta de axe (texto visible "Toda Colombia19") → separar el número o empezar el nombre igual que el texto visible; un `h3` por tarjeta (hoy el título es solo un enlace); enlace "Saltar al contenido". Por coherencia con H59, los grupos de opción única (fecha, ciudad, categoría y destino del repost) deben anunciarse como excluyentes (radio nativo o `role="radiogroup"`).
- **H61 · Chips cortados (Baja).** A 1280 la fila de ciudades esconde 372 px (Villavicencio, Pasto, Leticia) sin pista. Dejar que la fila ocupe 2 líneas o agregar un degradado y flechas. La parte de "filas sueltas en tableta" de H61 la auditoría la mide en Evento, Bienvenida y Perfil, no en Agenda; en este handoff se observa lo mismo aquí: a 768 la rejilla deja "Mercado gastronómico de las Américas" sola en la última fila (19 tarjetas en 2 columnas). La auditoría recomienda rejillas automáticas con anchos mínimos pensados para cada bloque.
- **H17 · Estados de carga y error (Media; la auditoría la lista para "Evento y todas").** Buscar "cargando", "error", "reintentar" o "sin conexión" en Agenda da 0 resultados. Diseñar e implementar esqueletos de carga para la rejilla y un error con "Reintentar" para la lista, como pide la auditoría para "las listas, el mapa y el chat".
- **H62 · Textos (Baja).** Aquí el alcance nacional se llama "Toda Colombia" (chip y `select`), "Colombia" (h1), "todo el país" (bajada y mensaje vacío) y "del país" (botón vacío). Definir un glosario corto y aplicarlo.

**Relacionados que la auditoría no listó para Agenda, pero que se reproducen aquí (medidos en este handoff):**

- **Mismo patrón de H16 (focos tapados por la barra fija).** A 390 × 844, con Shift+Tab, 82 de los 121 controles del contenido quedan 100 % debajo del encabezado de 224 px. Agregar `scroll-padding-top` igual a la altura real del encabezado en cada punto de quiebre (69 / 125 / 171 / 220 / 224 px hoy) o, mejor, compactar el encabezado (H40).
- **Mismo patrón de H6 (ventana sin espacio en pantallas bajas).** La ventana no tiene `max-height` ni desplazamiento: a 844 × 390 empieza en y −93 y su botón "Repostear" termina fuera de la pantalla (no se puede confirmar); a 320 × 568 la X queda fuera. Usar `max-height: calc(100vh - 32px); overflow-y: auto` como la ventana del Chat, o pantalla completa en celular.
- **Mismo hallazgo de H52 (placeholders).** El placeholder del comentario usa el gris por defecto `#757575` sobre `#FBF7F3` (4,32:1). Usar `#6E6259` (5,54:1).
- **Mismo hallazgo de H42 (saltos que pierden contexto).** "Mapa", "Ver todos los planes en el mapa" y las Tendencias de Main no pasan ciudad ni categoría. En producción, rutas con parámetros (`/mapa?ciudad=cali`, `/agenda?ciudad=bogota&categoria=deporte`).

**De producción que cambian esta pantalla:**

- **H1 · Modelo de compra (Alta).** Las tarjetas muestran marcas reales en el campo `b` (en Agenda: TuBoleta 7 veces, Ticketmaster 2 y Fever 3; lo mismo en Mapa) como si vendieran dentro de Fulleventos, y no hay aviso de "ejemplo". En el diseño, ya: cambiar las marcas por [BOLETERA] o agregar "Contenido de ejemplo"; condicionar el texto del CTA al canal de venta ("Compra aquí" o "Compra en [boletera]"); revisar la promesa del pie "Compra segura dentro de Fulleventos". En producción, cada evento tiene un campo "fuente" con tres modos de compra (ver "Camino recomendado" de la auditoría); nunca hacer scraping.
- **H4 · Venta propia (Alta).** Mientras no se resuelva (MinCultura, PULEP, DIAN), el "Comprar" de la tarjeta no puede llevar a una venta propia.
- **H14 · Organizadores (Alta).** "Crear evento" (`:61`) no hace nada y representa todo el lado del organizador; el catálogo de la Agenda depende del panel interno de curaduría de la fase 1 (lugar con dirección y coordenadas, ciudad, fuente y enlace de compra); el panel de organizador es de la fase 3.
- **H34 · SEO (Media).** Con JavaScript apagado el título dice "Este finde en {{cityLabel}}". La Agenda debe generarse en el servidor, con `<title>` y descripción propios por ciudad y categoría (páginas por ciudad y categoría, sitemap).
- **H53 · Un solo modelo de datos (Media).** Los 19 eventos están copiados en Agenda (`:261-279`), Bienvenida, Main y Mapa. En producción vienen de la base de datos (evento con zona America/Bogota, fuente, enlace externo, etc.); el estado de "guardado" y "reposteado" debe ser el mismo en todas las pantallas (hoy Agenda y Mapa arrancan cada uno con su propio `reposted: { e2: true }`).
- **H54 · Notificaciones (Media).** La campana (`:59`) no hace nada: notificaciones push y un centro de notificaciones dentro de la app, con preferencias por tipo de notificación.
- **H57 · Rendimiento (Media).** Metas de Core Web Vitals en el 75 % de las visitas (LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1) y menos de unos 150 KB comprimidos de JavaScript inicial. Fotos reales en AVIF o WebP, con varios tamaños y dimensiones fijas (la proporción 4:3 ya está), y carga diferida salvo la foto principal (en una rejilla, la auditoría no precisa cuántas; criterio sugerido: las de la primera fila visible). Fuentes alojadas en el propio servidor y precargadas.


##### Detalles finos

**Textos y microcopys**
1. El eyebrow se escribe "Agenda para ti" y se muestra en mayúsculas por CSS; la categoría de la tarjeta igual ("Rumba" → "RUMBA"); el mes se escribe "oct" y en la tarjeta se ve "OCT". En cambio, en la vista previa de la ventana el mes va **en minúsculas** ("9 oct · Galería Café Libro · Zona T · Bogotá"), porque esa línea no tiene `text-transform`. No escribir los textos en mayúsculas en el origen.
2. Singular y plural exactos: "1 plan" / "N planes" (también "0 planes"), "1 ciudad" / "N ciudades". El aviso usa comillas latinas «» y termina en punto.
3. "este finde" está fijo en el h1, en la línea de resultados y en el mensaje vacío, sin importar la fecha marcada (H39).
4. La bajada es fija: los gustos "(salsa, rock, fútbol y planes gratis)" y "empezando por Bogotá" no salen del perfil ni de la ciudad elegida. En producción, los gustos deberían venir del paso 2 del Registro y la ciudad del usuario (por definir con el cliente; hoy no hay lógica).
5. "Para ti" no personaliza nada: es "todos los eventos". El criterio de orden y de selección "para ti" está por definir.
6. "Lo que repostea tu gente" usa el campo `fr` (reposteado por amigos cercanos); el repost propio no lo afecta.
7. El campo `b` mezcla tres cosas: la boletera ("TuBoleta", "Ticketmaster", "Fever"), "Entrada libre" y un organizador ("Idartes" en el jazz al parque, el único gratis que no dice "Entrada libre"). Definir qué representa esa línea (ver H1).
8. La línea social no maneja casos borde: con `r = 1` diría "Laura y 0 más lo repostearon"; con `r = 0` se rompe; si `who` fuera el propio usuario diría "Tú, Tú…". En el demo no ocurre (mínimo `r = 4`). Definir textos para 0, 1 y 2 personas.
9. El aviso para "Solo a amigos cercanos" dice "Reposteaste «…» en tus amigos cercanos." (redacción forzada; mejor "con tus amigos cercanos", por confirmar con el cliente). Y "Ver en mi feed" aparece siempre, aunque el repost haya ido a un parche o a amigos.
10. El nombre del parche "Salseros de jueves · 12 miembros" está fijo: no hay forma de elegir otro parche; "Una lista que tú eliges" no tiene pantalla para elegir la lista. Ambos están por diseñar.
11. El placeholder del comentario es exactamente "Añade un comentario. Ej.: ¿Quién se apunta?" (con "Ej.:" y signos de apertura).
12. Nombres del alcance nacional distintos en la misma pantalla (H62) y textos distintos a los de Bienvenida para el mismo componente: allí la primera categoría es "Todo" y la de amigos "Planes con amigos"; sus mensajes vacíos son "No hay planes de esta categoría en {Ciudad} este finde." / "No hay planes en {Ciudad} este finde." / "No hay planes en esta categoría este finde."; Mapa usa `'No hay ' + what + (sel ? ' en ' + sel.name : '') + ' este finde.'` (`Mapa.dc.html:485`, la ciudad solo si hay una elegida). Unificar.
13. El placeholder del buscador es "Busca eventos, lugares o artistas" (con `aria-label` "Buscar eventos"); en Main es "Busca planes, gente o lugares" (con `aria-label` "Buscar"). A 390 px solo se lee "Busca eventos,".

**Valores por defecto y lógica**
14. Al abrir la ventana, el destino siempre vuelve a "En mi feed" y el comentario arranca vacío.
15. Quitar un repost ("Reposteado") no pide confirmación y además borra cualquier aviso abierto, aunque sea de otro evento.
16. El aviso no se cierra solo, sobrevive a los cambios de filtro y vive en el flujo: si el usuario repostea una tarjeta de abajo, no lo ve. Convertirlo en un aviso flotante (por ejemplo, fijo abajo) o desplazar la vista, y anunciarlo con la región viva (H49).
17. "Ver todos los planes del país" limpia ciudad y categoría pero no la fecha, ni el buscador, ni guardados/reposts.
18. El selector del encabezado y los chips comparten el mismo estado `city`. Elegir una ciudad en el `select` no desplaza la fila de chips hasta el chip marcado (Leticia queda fuera de vista).
19. Los conteos de los chips de ciudad dependen de la categoría; los chips con 0 no se deshabilitan ni se ocultan.
20. Orden de la rejilla: "round-robin" por ciudad con Bogotá primero (es la ciudad de Camila), para que la primera fila ya muestre el país. Dentro de una ciudad no hay orden por fecha. Si se mantiene la idea en producción, la ciudad que va primero debe ser la del usuario.
21. Formato de precio: `toLocaleString('es-CO')` → punto de miles ("$180.000"), sin decimales, sin espacio entre "$" y el número, y siempre con "Desde". Para 0, "Gratis" (la categoría "Gratis" coincide hoy con `p = 0`; en producción conviene derivarla del precio).
22. El estado "guardado" y "reposteado" vive solo en la memoria de la pantalla: al recargar (incluido el clic en "Lista" o en el ícono de Agenda) se pierde.

**Estilos que se pierden fácil**
23. Tamaño base 15 px pero `rem` sobre 16 px: no convertir `.9rem` a 13,5 px.
24. Logo de `1.55rem` aquí y `1.6rem` en Bienvenida.
25. El contador del chip de ciudad siempre lleva texto `#17120F`, también sobre el chip negro (va sobre amarillo `#F6DC6A`). El padding del chip de ciudad es asimétrico (`0 7px 0 15px`) para que el contador quede a 7 px del borde.
26. Solo "Toda Colombia" lleva el ícono pin.
27. El marcador de foto usa `transparent 55%` en la tarjeta y `transparent 58%` en la vista previa de la ventana.
28. Los avatares de la línea social miden 22 px + 2 px de borde blanco por lado (26 px reales, sin `box-sizing`) y se enciman 7 px. No llevan iniciales. Igual pasa con el círculo de radio de los destinos de la ventana (20 px + 2 px de borde = 24 px reales) y con la fecha de la tarjeta (`min-width: 46px` + 9 px de padding por lado = 64 px). Si la implementación usa un reinicio global `box-sizing: border-box` (como el código base o Tailwind), hay que declarar 26 px y 24 px para conservar el tamaño visual.
29. El precio no usa `tabular-nums` (el código base sí). Si se agrega, aplicarlo igual en todas las tarjetas.
30. El CTA de la tarjeta mide `min-height: 40px` con `padding: 10px 14px`; en Bienvenida es `min-height: 44px` con `padding: 11px 15px`, y en Mapa `height: 36px`. Unificar.
31. "Cancelar" y "Repostear" de la ventana no tienen `font-size` y salen a 13,33 px (por defecto del navegador), más pequeños que los demás botones (13,44–14,4 px). Al implementar hay que fijar un tamaño; mantener 13,33 px solo si se quiere reproducir el prototipo al píxel.
32. El borde de los destinos es de 1,5 px (se ve de 1 px en pantallas de densidad 1).
33. El `h2` de esta ventana es DM Sans 700 de 18,4 px; el de la ventana del Chat es Archivo 900 de 22,4 px (`1.4rem`). Unificar al crear el componente modal.
34. El subrayado de "Ver todos los planes en el mapa" es un `border-bottom: 2px` + `padding-bottom: 1px` (no `text-decoration`); al pasar el mouse cambia el texto pero no el borde.
35. "Ver en mi feed" es amarillo `#F6DC6A` y no cambia al pasar el mouse.
36. La fila de resultados tiene `margin-bottom: -6px`: el espacio real hasta la rejilla es 16 px, no 22.
37. La tarjeta no es clicable entera: solo el título y el CTA. La imagen no enlaza.
38. Ningún texto se trunca (no hay `ellipsis` ni `line-clamp`): los títulos y lugares largos pasan a 2 líneas y las filas de la rejilla se igualan a la tarjeta más alta; el bloque de precio y las acciones quedan abajo por `margin-top: auto` y `flex: 1` en el cuerpo. No romper esa alineación.
39. Las filas de chips reservan 4 px abajo (`padding-bottom: 4px`) y no ocultan la barra de desplazamiento (el código base la ocultaba con `scrollbar-width: none`).

**Capas, posición y desplazamiento**
40. `z-index`: encabezado 5 (Mapa usa 70), capa de la ventana 20 (la del Chat usa 40). La ventana tapa el encabezado. Ninguna pieza de la tarjeta tiene `z-index`, así que el encabezado fijo las cubre al hacer scroll.
41. Con la ventana abierta, la página de fondo se sigue desplazando con la rueda (no hay bloqueo de scroll).
42. Pantallas bajas: la ventana se sale por arriba y por abajo (ver correcciones). Pantallas angostas: desborde de 14 px a 320 px por el selector de fecha.

**Cosas que solo se ven en un estado**
43. La marca amarilla "Reposteaste" (abajo a la izquierda de la foto) solo aparece en tarjetas reposteadas; al inicio solo en "Festival de jazz al parque" (fila 3, columna 4 a 1280).
44. El estado vacío solo aparece con ciudad + categoría sin eventos (p. ej. Medellín + "Arte y teatro", Leticia + "Deporte"); en el demo nunca hay 0 resultados con "Toda Colombia". Aun así, el código produciría "0 planes en 0 ciudades este finde" (plural con 0).
45. El aviso a 390 px ocupa 119 px ("…en tu feed.", 2 líneas de texto) o 141,5 px ("…en el parche Salseros de jueves.", 3 líneas) y pone el enlace y la X en una segunda fila, alineados a la izquierda. Su alto depende siempre del largo del título del evento y del destino.

**Inconsistencias con otras pantallas y con las fuentes**
46. `agenda-repost.jpg` se volvió a tomar con el código actual: muestra "Comprar" en las tarjetas y el ícono de Mensajes con la insignia "3".
47. El repost en Mapa es instantáneo (sin ventana) y su estado no se comparte con Agenda (H41, H53).
48. El corazón aquí es "Guardar"; en Main el corazón es "Me gusta" (H41: usar marcador para guardar).
49. Bienvenida usa `minmax(250px, 1fr)` en su rejilla de tarjetas; Agenda `minmax(260px, 1fr)`. Los puntos de quiebre de columnas no coinciden entre las dos pantallas.
50. Los `hint-placeholder-count` / `hint-placeholder-val` de `<sc-for>` y `<sc-if>` son solo del formato del prototipo: no tienen equivalente en producción.
51. El `$preview` del lienzo declara 3140 px de alto; la página real mide 3132 px a 1280 y 3140 px desde 1288 px de ancho (cuando el contenedor llega a su `max-width`).
52. La decisión 2.7 dice que al repostear "el contador sube en uno", pero lo único que cambia en pantalla es que se antepone "Tú, ": el número de "N más" no cambia (`count = r + 1` y se resta 2 en vez de 1). Lo que sube en uno es el total implícito de personas. Si en producción se quiere que se vea un número mayor, hay que cambiar la plantilla; si no, documentar que "N más" no incluye al usuario ni a `who`.
53. El botón "Repostear" de la tarjeta es un botón de alternancia (`aria-pressed`) pero, cuando está apagado, abre una ventana; cuando está encendido, quita el repost sin abrir nada. Un mismo control con dos comportamientos distintos según su estado.


#### 8.2.5 Mapa

##### Correcciones obligatorias de la auditoría

Hallazgos de `docs/auditoria-2026-10-07.md` que tocan esta pantalla. Lo que piden **se implementa así**, aunque el prototipo haga otra cosa.

**De diseño (prototipo)**

- **H7 (Alta) · Foco perdido.** "Acercar" y "Alejar" se deshabilitan con el foco encima y "Ver en el mapa" desaparece al elegir ciudad. En los dos casos el foco cae al `body` y el siguiente Tab vuelve al inicio. Implementar:
  - En el zoom, `aria-disabled="true"` en lugar de `disabled`, conservando el chequeo de límites (`if (Z >= 3) return`) y el aspecto atenuado (opacidad 0,4, cursor normal).
  - **No** ocultar "Ver en el mapa" al elegir una ciudad: dejarlo visible y cambiarle el texto (la auditoría no fija el texto; definirlo con diseño).
  - (Recomendación de este documento, no está en la auditoría) Si algún botón con el foco se va a desmontar, mover el foco a un destino estable (por ejemplo, el título del panel). La auditoría (H7, producción) solo pide llevar el foco al encabezado en cada paso del checkout y probar con NVDA, VoiceOver y TalkBack.
- **H8 (Alta) · Scroll de lado a 320 px.** El selector de fecha (309,5 px, sin `flex-wrap`) desborda la página 6 px. Implementar `flex-wrap` o scroll propio en ese grupo. Agregar una prueba automática del ancho de página a 320 px.
- **H5 (Alta) · Pie sin datos del vendedor.** El pie solo dice "© 2026 Fulleventos · Colombia" y "Compra segura dentro de Fulleventos…", con 0 enlaces. Implementar el pie legal común:
  - [RAZÓN SOCIAL], NIT, dirección, teléfono, correo;
  - PQR, enlace a sic.gov.co, Términos y Política de tratamiento;
  - un único nombre para cada documento.
- **H21 · Precio sin cargo.** "Desde $45.000" no incluye el 8 % ni aclara el IVA. Implementar el mismo formato en todas las pantallas: "Desde $45.000 + cargo por servicio" o "Desde $48.600 con cargos".
- **H33 · Versión pública.** El visitante que llega desde la landing ve la versión con sesión. Implementar `/mapa` público: encabezado de visitante con "Entrar / Crear cuenta" y todo el contenido visible. La auditoría pide la cuenta "solo al tocar 'Comprar', 'Voy' o 'Unirme'" y "devolver al usuario al mismo punto después de registrarse"; en esta pantalla eso equivale a "Comprar", "Repostear" y "Guardar" (extensión de este documento), y el "mismo punto" incluye ciudad, categoría y zoom. También pide diseñar la pantalla "Entrar" (H12).
- **H35 · Viewport.** Agregar `<meta name="viewport" content="width=device-width, initial-scale=1">`.
- **H36 · Todas las tarjetas abren el mismo evento** (`Mapa.dc.html:410`). Cada título y CTA debe abrir **su** evento (`/evento/:slug`, H34). "Ver plan" de un evento gratis no puede llevar a un checkout pagado. En el prototipo, la auditoría propone duplicar Evento para 2 o 3 casos (pagado, gratis, fútbol) o marcar "Demo: solo este evento".
- **H38 · Botones muertos.** "Notificaciones" (`:65`) y "Crear evento" (`:67`, además sin `type="button"`). Conectarlos o mostrar "Próximamente"; para "Crear evento", la auditoría sugiere un formulario de contacto para organizadores. El buscador tampoco busca: necesita pantalla de resultados con estados vacío y de carga (H41).
- **H39 · La fecha no filtra.** "Hoy" y "Próxima semana" solo cambian el botón marcado (`:308-310`) y el resumen sigue diciendo "del viernes 9 al lunes festivo 12 de octubre" (`:456`). Implementar:
  - filtrado real por fecha;
  - actualizar el resumen, el `h1` ("este finde"), la leyenda, los conteos, `panelSub` ("Lo que hay este finde en…") y `emptyMsg` ("… este finde.");
  - si no hay planes, un estado vacío honesto ("Hoy no hay planes en tu ciudad: mira el finde");
  - si no se va a filtrar, quitar el control.
- **H40 · Encabezado de 224 px en celular.** Implementar un encabezado móvil de una fila (56 a 64 px: logo, lupa y avatar) que se esconda al bajar, una barra inferior con 5 pestañas con texto ("Inicio", "Agenda", "Mapa", "Mensajes", "Perfil") y "Crear" como acción secundaria.
- **H41 · Patrones inconsistentes.**
  - Agregar el camino "Lista" (Agenda tiene el selector "Lista / Mapa"; Mapa no lo tiene), conservando ciudad y categoría.
  - Un solo patrón para repostear: hoy es instantáneo aquí y abre una ventana en Agenda.
  - Ícono de marcador para "Guardar", porque en Main el corazón es "Me gusta".
  - Un único componente de encabezado (mismo `z-index`, mismo margen lateral) y un margen lateral único en todo el producto.
- **H42 · El resultado no se ve en celular y los saltos pierden el contexto.**
  - Por debajo de 980 px, al elegir ciudad, mostrar una hoja que sube desde abajo con los planes de la ciudad, o un botón flotante "Ver 3 planes en Medellín".
  - "Ver en el mapa" debe desplazar hasta el mapa y resaltar el pin (hoy "Ver en el mapa: Leticia" deja el mapa fuera de vista).
  - Todos los enlaces que llegan al mapa desde Main, Bienvenida, Agenda y Evento deben abrir la ciudad correcta (`/mapa?ciudad=cali`).
- **H45 · "Mi ciudad: Bogotá" está fijo.** Tomar la ciudad del perfil del usuario (Registro debe pedir "Ciudad" como lista desplegable). Sin ciudad conocida (visitante), ocultar el botón u ofrecer elegirla.
- **H47 · Sin paginación.** El Mapa tiene 1.026 nodos. En el diseño, usar el patrón de Bienvenida (8 planes + "Ver N planes más"), conservar la tarjeta compacta de 88 px y agrupar por día. En producción, ver la sección siguiente.
- **H49 · Cambios en silencio.** El panel se actualiza sin anunciarse (`:159-161`, 0 `aria-live`). Implementar una región viva vacía y permanente (visualmente oculta, `role="status"`) donde se escriba, por ejemplo, "Mostrando 6 planes en Bogotá" o "Mostrando 19 planes en toda Colombia".
- **H50 · Tab descuadra el mapa.** Al llegar a Leticia con Tab, el marco se desplaza 748 px. Después de "Toda Colombia" sigue corrido 436 px hasta recargar. Con zoom 3× hay pines enfocables invisibles (5 a 1280 px y 6 a 390 px). Implementar:
  - `overflow: clip` en el marco del mapa (`:115`) en lugar de `hidden`;
  - sacar del orden de Tab los pines fuera de vista (`tabIndex = -1`), o centrar el mapa en el pin que recibe el foco.
- **H51 · Buscador sin foco visible.** Quitar `outline: 0` o marcar el contenedor con `:focus-within` (borde de 2 px #C23A24), y usar en todas las pantallas la misma regla de foco de 3 px #C23A24.
- **H52 · Placeholders.** La auditoría mide 4,32:1 del gris por defecto sobre crema en otras pantallas. Aquí el campo es blanco (unos 4,6:1), pero el criterio es único: placeholders en #6E6259 (5,54:1) en todo el producto.
- **H59 · Semántica.**
  - La fecha es de respuesta única: usar un grupo de radio nativo (`fieldset` + `legend`) o `role="radiogroup"` en lugar de botones `aria-pressed` (`:84`).
  - El avatar debe llamarse "CV, tu perfil" (`:68`).
  - Agregar "Saltar al contenido".
  - Nombres accesibles que empiecen por el texto visible. La auditoría pone de ejemplo el avatar y aclara que "la mayoría de estas últimas alertas son inofensivas"; extenderlo a los 11 pines (axe marca 12 casos de `label-content-name-mismatch` en esta pantalla, verificado) es decisión de este documento.
- **H61 · Filas cortadas sin pista.** El ranking esconde Villavicencio, Pasto y Leticia a 1280 sin aviso. Dejar que la fila ocupe 2 líneas o agregar un degradado y flechas. Lo mismo aplica a los chips de categoría por debajo de 725 px.
- **H62 · Textos.**
  - "Ver todo Colombia" → "Ver toda Colombia" (`:164` y `:179`), y "mira todo Colombia" → "mira toda Colombia" (`:486`).
  - Unificar el nombre del alcance nacional: hoy conviven "Toda Colombia" (`:102`, `:480`), "Todo el país" (`:78`, `:479`) y "Colombia".
  - La etiqueta "Nuevo" se repite en 5 lugares del producto ligados al mapa (aquí "Nuevo · Todo el país", `:78`; en Main `:93` y `:268`; en Bienvenida `:51` y `:110`): definir dónde va.
  - La auditoría pide "un glosario corto y corregir la concordancia".
- **H1 (parte de diseño, S) · Marcas reales como boleteras.** El campo `b` muestra TuBoleta (7 veces), Ticketmaster (2) y Fever (3) bajo el precio, y no hay aviso de "ejemplo". Implementar:
  - [BOLETERA] o el rótulo "Contenido de ejemplo" mientras no haya acuerdo;
  - textos según el canal de venta del evento: "Comprar" o "Compra aquí" (venta propia), "Comprar en [boletera]" (externa, abre su sitio) y "Ver plan" o "Voy" (gratis);
  - la auditoría pide quitar el absoluto "No sales de Fulleventos" (texto de Evento) y cita como promesa del mismo tipo el pie "Compra segura dentro de Fulleventos" (`Mapa.dc.html:237`): en esta pantalla, retirarlo del pie.
- **H17 · Estados de carga y error.** Esqueletos de carga y errores con "Reintentar" en la lista y en el mapa.

**De producción (cambian esta pantalla)**

- **H1 / H4 · Modo de compra.** El CTA de cada tarjeta depende del campo "fuente" del evento (gratis / ticketera externa / venta propia). La venta propia exige MinCultura, PULEP y DIAN.
- **H14 · Catálogo.** "Crear evento" lleva al panel de organizador. El panel de curaduría debe guardar lugar con dirección y **coordenadas**, ciudad, fuente y enlace de compra: el mapa depende de ellas.
- **H34 · SEO y compartir.**
  - URL única por evento (`/bogota/eventos/noche-de-salsa-y-boleros-2026-10-09`), que es a donde deben apuntar título y CTA.
  - Páginas por ciudad y categoría, sitemap y páginas generadas en el servidor (el mapa público debe poder leerse sin JavaScript al menos en su lista).
- **H47 · Paginación.**
  - Unos 20 eventos por página con "Cargar más" y virtualización por encima de 100.
  - El mapa debe pedir solo los eventos del área visible y agrupar los marcadores.
- **H53 · Modelo de datos único.** Hoy el mapa usa porcentajes del dibujo en lugar de coordenadas (`:253-264`) y cada pantalla copia los 19 eventos. En producción:
  - ciudad y lugar con lat/lng;
  - zona horaria America/Bogota;
  - un solo origen de datos para Mapa, Agenda, Main y Bienvenida;
  - la auditoría sugiere MapLibre (por confirmar).
- **H54 · Notificaciones.** La campana necesita centro de notificaciones.
- **H57 · Rendimiento.** El mapa se carga solo al abrirlo; imágenes en AVIF/WebP con varios tamaños, dimensiones fijas y carga diferida; fuentes alojadas en el propio servidor y precargadas; menos de unos 150 KB comprimidos de JavaScript inicial; metas LCP ≤ 2,5 s, INP ≤ 200 ms y CLS ≤ 0,1 en el 75 % de las visitas.
- **H12 · Cuentas** (la auditoría no lista Mapa en H12; esto es una inferencia). Sin cuentas verificadas, repostear y guardar no pueden persistir: en producción el estado se guarda en el servidor por usuario.


##### Detalles finos

**Errores del prototipo no listados en la auditoría (corregir):**
- Entre 1014 y 1099 px de ventana, mapa y panel van lado a lado pero la regla `contain: size` solo entra desde 1100. El panel oscuro del mapa se estira a 4955 px de alto, con miles de píxeles de fondo vacío (verificado a 1024 px). El cambio a "lista con scroll interno" debe coincidir con el paso a dos columnas.
- La lista se ordena por el orden fijo de `CITIES`, no por número de planes. Con "Rumba", la lista arranca en Bogotá (1 plan) aunque el ranking ponga a Medellín (2) de primera.
- Con un filtro activo, si la ciudad elegida queda sin planes, su pin desaparece, el mapa queda centrado en un punto vacío y el panel dice "Pasto · 0 planes". Elegir desde el selector del encabezado una ciudad sin planes produce lo mismo.
- Al cambiar de categoría, la repetición de pines (`sc-for`) reutiliza los elementos por posición y no por ciudad. El ancla (`left`/`top` en %) salta de inmediato a la ciudad nueva, pero el botón hereda el desplazamiento en px del pin que antes ocupaba esa posición y se desliza 460 ms (`ease`). Con "Rumba" (verificado): Cartagena ocupa la posición 4 que era de Barranquilla, así que su botón arranca sobre su punto real (desplazamiento 0, 0) y se desliza hasta (−38, 18); Santa Marta ocupa la posición 5 que era de Cartagena, así que arranca en (−38, 18) y se desliza hasta (46, −20), y su línea guía (reutilizada) cambia de 42,0 a 50,2 px de largo con transición mientras el ángulo salta. En producción, usar la ciudad como clave de cada pin.
- `Z = 1` con ciudad elegida es un estado posible (elegir y luego "Alejar" dos veces): país completo, pin rojo, panel de la ciudad y "Toda Colombia" sin marcar.

**Textos y microcopys:**
- `aria-label` del pin con "evento(s)" frente a "plan(es)" en todo lo visible.
- El mensaje vacío sin ciudad ("No hay planes de Rumba este finde.") no se ve con los datos de ejemplo, pero existe.
- El conteo del panel admite "0 planes".
- "Mi ciudad: Bogotá" no alterna (pulsar de nuevo no deselecciona; solo vuelve a 2× si el zoom estaba en 1× o 1,5×), mientras los pines y el ranking sí alternan. "Toda Colombia" del mapa reinicia también el zoom aunque ya esté marcado.
- `panelSub` sin ciudad usa comillas angulares: "Usa «Ver en el mapa» para ubicar cada plan.".
- El separador "·" es punto medio (U+00B7) en la etiqueta, el título del panel y el lugar de la tarjeta.
- La etiqueta del zoom usa "×" (U+00D7) y coma decimal ("1,5×").
- El mes "oct" está escrito fijo en la placa de fecha; en producción sale de la fecha del evento (abreviatura en minúscula, en mayúsculas por CSS).
- La categoría de la tarjeta se escribe "Rumba" en los datos y se ve "RUMBA" por `text-transform`. En los mensajes vacíos se usa con mayúscula inicial ("planes de Arte y teatro").
- La etiqueta "Nuevo · Todo el país" hereda el `uppercase` del antetítulo y no tiene radio. El antetítulo es un `<p>` en `flex` con `gap: 10px`.
- El placeholder del buscador ("Busca eventos, lugares o artistas") y su `aria-label` ("Buscar eventos") no coinciden, y cambian de pantalla en pantalla.
- Por `max-width: 8.6em`, el selector de ciudad no crece más de 123,84 px.

**Medidas y cálculos de borde:**
- Los pines no escalan con el zoom (`scale(1/Z)` en el ancla), pero sí con el ancho del lienzo (unidades `cqw`, piso de 36 px y texto de 13 px). Hay que reproducir **las dos** cosas.
- El desplazamiento de Cartagena, Santa Marta y Villavicencio está en píxeles de pantalla y se reduce linealmente hasta 0 en 3×. Cartagena va a la izquierda y abajo, Santa Marta a la derecha y arriba, y Villavicencio a la derecha y abajo, para no chocar con Barranquilla y Bogotá.
- `transform-origin: 0 0` y `translate` en porcentaje **del propio lienzo**: si se cambia el origen, todas las fórmulas cambian.
- `vector-effect: non-scaling-stroke` en el país y las cordilleras: el trazo mide lo mismo a 1× y a 3×. La retícula de puntos sí escala.
- Las tres transiciones del mapa usan la misma duración (460 ms) pero curvas distintas: capa del mapa y anclas con `cubic-bezier(.22,.8,.24,1)`; posición del pin y longitud de las líneas con `ease`; color y sombra del pin en 200 ms `ease`.
- Las capas usan `z-index: 40 - n`, así que los pines con menos planes quedan **encima** de los grandes. El elegido sube a 60 y las etiquetas geográficas van en 1, con `pointer-events: none`.
- El nombre de la ciudad va **dentro** del botón del pin: tocar el nombre también elige la ciudad.
- Los círculos de la leyenda (10, 15 y 21 px) no corresponden a los tamaños reales de los pines (40 a 70 px).
- La consulta `@container` depende del ancho del lienzo, no de la ventana. Si el mapa se pone en otra columna, hay que conservar la consulta de contenedor.
- `aspect-ratio: 130 / 175` y `max-width: 560px` fijan el lienzo. En escritorio queda centrado en un marco más ancho, con franjas de retícula a los lados.
- `overflow: hidden` en el marco: cambiar a `clip` (H50).

**Diferencias de componentes compartidos:**
- El encabezado de esta pantalla tiene `z-index: 70` y margen `clamp(16px, 4vw, 24px)`; en Agenda y Main, 5 y 24 px.
- El pie usa `padding: 24px … 36px` y `gap: 10px 28px`; en Agenda, 28/40 y 12/28.
- `main` termina con 48 px; en Agenda, 64.
- Esta pantalla define reglas de `:focus-visible` que Agenda y Main no tienen.
- El chip de ciudad del ranking (44 px, 700, burbuja de 30 px siempre amarilla) es distinto del de Agenda (42 px, 500, burbuja de 28 px).

**Otros detalles:**
- No hay `tabular-nums` en ningún precio ni conteo (el `.price` del código base sí lo usaba). Tampoco hay truncado (`ellipsis`, `line-clamp`) en ninguna parte: títulos, lugares y nombres se parten en las líneas que necesiten. Los pines y sus nombres usan `white-space: nowrap`.
- Tampoco hay hover en ningún botón: chips, pines, zoom, repostear, guardar y ranking solo cambian el cursor. El código base sí tenía `.chip:hover { border-color: var(--ink) }`, `.ticket:hover { background: #BF3923 }` y `.btn-dark:hover { background: #33291F }`; si se agregan, son una decisión nueva, no del prototipo.
- El hover del título del evento y de los íconos del encabezado viene de la regla global `a:hover`.
- Las filas de chips no ocultan la barra de scroll, al contrario del código base.
- El repost inicial de e2 ("Festival de jazz al parque") hace que la segunda tarjeta arranque con "Reposteado" en negro. Es intencional en la demo: muestra los dos estados.
- **Decisión de modelo de compra:** en el código base del cliente el botón decía "Boletas" con flecha y abría tuboleta.com en otra pestaña, y el pie decía "Las boletas se compran en las boleteras oficiales. Fulleventos no vende entradas.". El prototipo lo cambió a "Comprar" dentro de Fulleventos (la captura `mapa-medellin.jpg` todavía muestra "Boletas"). La auditoría (H1) recomienda volver a separar por canal: "Comprar en [boletera]" para externas.
- La landing promete en su bloque del mapa "Mira a qué van tus amigos, en tu ciudad o de viaje" (`Bienvenida.dc.html`), pero esta pantalla no muestra nada de amigos. Definirlo antes de construir.
- Las capturas `Mapa-390.jpg` y `Mapa-768.jpg` son de página completa. Para ver el corte real en pantalla hay que tener en cuenta el encabezado fijo de 224 y 125 px.


#### 8.2.6 Evento y compra

##### Correcciones obligatorias de la auditoría

**Del prototipo (hay que implementarlas distinto a como están en el código):**

- **H5 · Quién vende.**
  - Agregar al pie el bloque legal: [RAZÓN SOCIAL], NIT, dirección, teléfono, correo, PQR, enlace a sic.gov.co, "Términos" y "Política de tratamiento".
  - En el paso 3, encima de "Pagar", agregar el bloque **"Vendido por [ ] · NIT [ ] · Organiza [ ] · Boleta emitida por [ ]"**.
  - Usar un único nombre por documento: hoy aquí dice "[Política de tratamiento de datos]" y en Registro "[Política de privacidad]". La Política de tratamiento y el Aviso de privacidad son documentos distintos.
- **H6 · Ventana de compra con poca altura.**
  - Convertir la ventana en una columna flexible: cabecera y pie **fuera** de la zona con scroll, y un contenedor con scroll propio por paso, que siempre arranque arriba.
  - Mínimo aceptable: `scroll-padding` en el contenedor (probado: 270 px arriba y 215 px abajo dejan 0 campos ocultos a 360 × 640 y a 1280 × 720).
  - Con `@media (max-height: 600–720px)`: compactar la cabecera ("Paso 2 de 4" en una línea, temporizador abajo, sin subtítulo), reducir el resumen a "Total $97.200 · Ver detalle" y quitar el `sticky` si hace falta.
  - En celular, ventana a pantalla completa.
  - Probar a 320 × 256 y a 640 × 360.
- **H7 · Teclado y lector de pantalla.**
  - Usar `aria-disabled="true"` en lugar de `disabled` en "Continuar", "Pagar" y "Quitar una boleta", y conservar el chequeo que impide avanzar.
  - Volver inerte (`inert`) el encabezado, el `<main>`, el pie y la barra de compra mientras la ventana está abierta.
  - Al abrir, llevar el foco al botón "Cerrar la compra"; Escape debe cerrar desde cualquier punto; al cerrar, devolver el foco al botón que abrió la ventana.
  - En cada cambio de paso, llevar el foco al título del paso.
  - En producción: `<dialog>` con `showModal()`, React Aria o Radix. Probar con NVDA, VoiceOver y TalkBack.
- **H9 · Moderación.**
  - Menú con "Reportar" (con motivos) y "Bloquear" en cada mensaje del muro, en cada parche y en el organizador.
  - El muro necesita moderación.
  - Unirse a un parche debe ser una solicitud o una invitación que se acepta, no una entrada directa.
- **H16 · Foco tapado por las barras fijas.**
  - `html { scroll-padding-top: 90px }`, que pasa a 140 px desde 980 px.
  - `scroll-padding-bottom: 84px` por debajo de 979 px.
  - Probado: 0 controles tapados a 390, 768 y 1280 px.
- **H17 · Estados de pago.**
  - Diseñar e implementar:
    - "Procesando…" (botón deshabilitado);
    - "Aprueba el pago en tu app Nequi/Daviplata (tienes X min)", con cancelar o cambiar de medio;
    - "Te llevamos a tu banco" y "Volviste de PSE: estamos confirmando tu pago";
    - "Pago rechazado: intenta con otro medio", sin perder lo llenado;
    - "Pago en verificación: te avisamos por correo";
    - "Tu reserva venció, ¿la renovamos?";
    - "Se agotó esta localidad";
    - estados de carga y de error con "Reintentar".
  - El temporizador solo se muestra después de elegir localidad y cantidad, y con una cuenta regresiva real.
  - Pedir o precargar los datos antes de que arranque la reserva, para sacar del tramo con reloj todo lo posible (recomendación del W3C para WCAG 2.2.1).
- **H20 · "Mis boletas".** "Ver mis boletas", el texto "Tus boletas ya están en Mis boletas" y "También lo puedes completar después desde Mis boletas" deben llevar a una pantalla nueva `/mis-boletas`. Debe tener:
  - boletas próximas y pasadas;
  - QR a pantalla completa;
  - nombre de cada asistente;
  - estado de las partes de pago;
  - "Transferir" y "Solicitar devolución".
- **H21 · Precio con cargo.**
  - En la barra móvil y en la tarjeta lateral: **"Total $97.200 (incluye cargo por servicio)"**, en lugar del subtotal.
  - En el resumen: "Cargo por servicio (IVA incluido)", o el desglose.
  - El "Desde $45.000" debe seguir el mismo formato en todas las pantallas ("Desde $45.000 + cargo por servicio" o "Desde $48.600 con cargos").
- **H22 · Cantidad inicial.** Arrancar en **1** (no en 2), o pedir la cantidad de forma explícita. Subir el selector de cantidad para que quede junto a la localidad en el paso 1 (hoy, a 390 × 844, queda debajo del primer pantallazo).
- **H23 · Validaciones.**
  - Errores por campo con `aria-invalid` y `aria-describedby`:
    - CC: solo números, de 6 a 10 dígitos;
    - pasaporte: alfanumérico;
    - correo: formato válido;
    - celular: 10 dígitos que empiecen por 3.
  - Marcar "obligatorio" en las etiquetas.
  - Al intentar continuar, mostrar un resumen de errores arriba; el botón queda activo con `aria-disabled` y muestra los errores al pulsarlo.
  - "MM/AA" como texto de ayuda visible.
  - Exigir el celular de Nequi y Daviplata.
  - Agregar el PPT a los tipos de documento.
  - En producción, validar también en el servidor.
- **H24 · Mesa VIP con pago dividido.**
  - Mientras la mesa no esté pagada completa, mostrar **"Mesa apartada · falta 1 pago · vence [PLAZO]"** en lugar de "Boleta oficial" y QR.
  - Usar una etiqueta coherente ("pagaste 1 de 2 partes (4 puestos)").
  - Explicar en el paso 1 quién usa los puestos 3 y 4, o dividir siempre entre los 4 puestos.
  - Avisar cuando se recortan amigos al pasar a VIP.
- **H25 · Parche en la compra.**
  - Mostrar el estado de cada miembro ("Ya tiene boleta", deshabilitado) y dejar elegir a quienes no la tienen.
  - Unificar los datos del parche: "12 miembros" frente a "6 de 8 cupos".
  - Mostrar "Estás dentro" a Camila en "Salseros de jueves".
- **H26 · Estado después de comprar.**
  - Guardar las compras como lista de órdenes y mostrar el acumulado ("Tienes 6 boletas en 2 órdenes").
  - "Ver boleta" abre un visor aparte que no toca el checkout.
  - Advertir si se quita "Voy" teniendo boletas.
  - Sumar al contador de interesados con "Me interesa".
  - Saludar con el nombre del titular, no con "Camila" fijo.
  - Un número de orden por compra.
- **H27 · Retracto y devoluciones.** Encima de "Pagar", un bloque con:
  - "Retracto: aplica / no aplica porque el evento es el [fecha]";
  - "Si cancelan o cambian el evento: te devolvemos [%] en [X] días al mismo medio de pago";
  - quién hace la devolución;
  - enlace a la política completa.
- **H28 · Datos personales.**
  - Junto al número de documento, un aviso corto: para qué se pide (boleta nominativa y control de acceso), con quién se comparte ([ORGANIZADOR], [BOLETERA], [PASARELA]), por cuánto tiempo, y un enlace a la política.
  - Dos casillas separadas (términos de la compra y autorización de datos), más una tercera opcional si habrá publicidad.
  - Casillas nativas con etiqueta corta y los enlaces **por fuera** de la casilla, abiertos en un panel sin perder lo llenado.
- **H30 · Privacidad.**
  - "Avisar a mi parche" debe ser siempre voluntario y no publicar ni cantidad ni localidad.
  - Parches de tres tipos (abierto, con aprobación, privado); el punto de encuentro ("Pre en la casa de Laura…", "Uber compartido desde Suba · 8:15 p. m.") solo lo ven los miembros aprobados.
  - Consejos de seguridad al unirse y opción de reportar el parche (H9).
  - Detectar "casa de" o direcciones en las descripciones públicas de los parches.
- **H33 · Versión pública.** Encabezado "Entrar / Crear cuenta" para visitantes, todo el contenido visible, y la cuenta pedida solo al tocar "Comprar", "Voy" o "Unirme", devolviendo al usuario al mismo punto después de registrarse.
- **H35 · Viewport.** `<meta name="viewport" content="width=device-width, initial-scale=1">`. Sin esta etiqueta, en un celular real la página se dibuja a 980 px y la barra móvil no aparece.
- **H36 · Una página por evento.** Cada tarjeta y cada plan parecido abren su propio evento (`/evento/:slug`). Hay que diseñar las variantes "Gratis" (solo "Voy") y "Comprar en [BOLETERA]" (ver H1).
- **H37 · Datos coherentes.**
  - Una sola hora en todo el producto: hoy Inicio dice 9:00 p. m., el Chat 8:00 p. m. y aquí "Puertas 8:00 · Show 9:30".
  - Diferenciar "Voy" de "Tengo boleta".
  - Mismos conteos de asistentes en todas las pantallas.
- **H38 · Botones muertos.**
  - "Armar parche" abre "Nuevo parche" del Chat con este evento ligado.
  - "Notificaciones", "Invitar amigos", "Compartir" y "Enviar" del muro: conectarlos (H34, H54) o mostrar "Próximamente".
- **H40 · Encabezado móvil.** Una fila de 56 a 64 px (logo, lupa y avatar) que se esconde al bajar, más una barra inferior con 5 pestañas con texto: Inicio, Agenda, Mapa, Mensajes, Perfil. Hay que resolverlo junto con la barra de compra (no pueden competir dos barras fijas abajo).
- **H41 · Navegación.** "Volver" regresa a la pantalla de origen, no siempre al feed. Usar el mismo componente de encabezado (variante "detalle") en todas las pantallas.
- **H42 · Contexto al saltar.** "Ver en el mapa" abre `/mapa?ciudad=bogota` con el lugar resaltado; "Escribir al organizador" abre la conversación con Galería Café Libro.
- **H48 · Organizador verificado.** Mostrar la insignia en la tarjeta del organizador y en el checkout, con la explicación de qué se verificó.
- **H49 · Anuncios.** Una región viva vacía y permanente (visualmente oculta, `role="status"`) donde se escriba "Paso 2 de 4: Tus datos" al cambiar de paso. Conservar el `aria-live` de la cantidad.
- **H52 · Contraste.**
  - Pista apagada del interruptor y bordes de campo con al menos 3:1 (por ejemplo, #857870, que da 4,27:1 sobre blanco; hoy #D9CEC3 da 1,55:1).
  - El estado del interruptor también en texto.
  - Placeholders en #6E6259 (5,54:1) en lugar del gris por defecto #757575 (4,32:1 sobre crema en "MM/AA" y "CVV").
- **H58 · Errores de consola.** Los íconos de políticas y medios de pago deben ser componentes, para que no aparezcan los errores de `{{po.d}}` y `{{m.d}}`.
- **H59 · Semántica.**
  - Grupos de radio nativos (`fieldset` + `legend` + `input type="radio"`) o `role="radiogroup"` para: localidad (plano, lista, tarjeta y paso 1), "¿Para quién?", medio de pago y tipo de persona.
  - Pestañas "Parches / Muro" con el patrón ARIA completo (flechas, `aria-controls`, `tabindex` itinerante) o como dos botones normales.
  - Enlaces "Saltar al contenido" e **"Ir a comprar boletas"** (hoy son 43 Tabs hasta "Comprar boletas").
  - Avatar del encabezado con nombre que empiece por el texto visible ("CV, tu perfil").
  - Mismo criterio en las zonas del plano (la auditoría cita `Evento.dc.html:242`): hoy el nombre "Zona preferencial con mesas compartidas · $70.000 por persona" no contiene el texto visible "Zona preferencial · mesas compartidas", y "Zona general, de pie · …" no contiene "Zona general · de pie". Quien usa control por voz dice lo que ve y no pasa nada.
- **H61 · Tableta.** Los datos clave no deben quedar en 4 + 1 a 768 px ni partir "Show 9:30 p. m.". Ajustar los anchos mínimos de la rejilla (por ejemplo, 3 + 2 con mínimos pensados para el contenido), y dar pista visual (degradado o flechas) a la fila de atajos cuando tiene scroll.

**De producción que cambian esta pantalla:**
- **H1:** el modo de compra se define por evento (Gratis / Boletera externa / Venta propia) y se muestra aquí y en el checkout. Quitar "Compras sin salir de Fulleventos" y "No sales de Fulleventos" (o condicionarlos al canal), y no presentar marcas reales como boleteras.
- **H2:** la boleta solo sale cuando el webhook de la pasarela confirma el pago aprobado. Máquina de estados de la orden e idempotencia (doble clic o recarga no cobran dos veces). El número de orden lo genera el servidor.
- **H3:** cupos, reservas, precios, cargo, IVA, tope por compra y temporizador en el servidor, con reservas atómicas. Avisos accesibles del temporizador (`role="alert"` a los 2 min y a los 30 s) y, si se puede, "Necesito más tiempo". "Últimas 12" debe venir del inventario real.
- **H4:** mostrar "PULEP: [CÓDIGO]" en los datos clave, el checkout y la boleta ("No aplica" si no son artes escénicas). En el paso 2, "¿Necesitas factura a nombre de empresa?" con NIT, razón social y correo de facturación.
- **H10:** en eventos +18, una casilla obligatoria en el paso 1: **"Confirmo que todos los asistentes son mayores de 18"**. Agregar TI donde aplique y PPT.
- **H11:** una boleta con su propio QR por asistente ("Boleta 1 de 2", con el nombre de cada titular). QR firmado de un solo uso. Quitar "o desde tu correo" del texto de "Boleta digital".
- **H12:** verificación de la cuenta antes de pagar.
- **H13 y H29:** el pago dividido se avisa con una tarjeta del sistema **"Solicitud de pago · Fulleventos"** en el chat, no con un "link". Cambiar los textos "link de pago" por "solicitud de pago dentro de la app" (interruptor, nota, `doneMsg` y píldora "Link enviado · pendiente").
- **H14:** el organizador, su información y su verificación vienen del panel de organizadores.
- **H18:** reglas del pago dividido visibles antes de pagar: plazo, recordatorios, qué pasa si un amigo no paga, mesa confirmada solo al 100 %, rechazar la solicitud y redondeo absorbido por el último pago. Hoy el texto dice "[PLAZO DE RESERVA]".
- **H19:** campos de tarjeta en el widget o en iframe de la pasarela (Wompi Widget, Mercado Pago Bricks, ePayco.js o Kushki Hosted Fields), con una política de seguridad de contenido estricta y sin analítica en esa página.
- **H31:** el cargo pasa a ser porcentaje más un mínimo fijo por boleta, con un monto mínimo por parte en el pago dividido.
- **H32:** "Transferir boleta" desde "Mis boletas".
- **H34:** título, descripción, Open Graph (imagen de 1200 × 630 con foto, fecha y lugar), URL canónica y schema.org/Event (fecha con zona −05:00, lugar con dirección y coordenadas, precio en COP). Página generada en el servidor. "Compartir" e "Invitar amigos" comparten esa URL.
- **H53:** un solo modelo de datos (evento, localidad, reserva, orden, parte de pago, boleta, parche, mensaje…). "Este viernes" y "hace 20 min" se calculan con la hora del servidor.
- **H54:** "Agregar al calendario" y el correo con la boleta deben funcionar de verdad; la campana abre el centro de notificaciones.
- **H55:** analítica del embudo (ver evento, empezar compra, medio de pago, pago aprobado o rechazado, parche creado, parte pagada) y pruebas con Playwright y axe.
- **H56:** número de orden en texto, "Agregar a Apple o Google Wallet" y un aviso para subir el brillo al mostrar el QR. Exigir accesibilidad a la pasarela y a los bancos.
- **H57:** la foto del héroe con dimensiones fijas y sin carga diferida; el resto en AVIF o WebP con carga diferida; mapa cargado solo al verlo; fuentes alojadas en el propio servidor.


##### Detalles finos

**Tipografía y medidas**
- Los `rem` van sobre 16 px, aunque el contenedor raíz tenga 15 px. Todo texto sin tamaño propio hereda **15 px** (por ejemplo, el párrafo de "quién va", los mensajes del muro, "Galería Café Libro" de la ubicación y `doneMsg`).
- Botones sin `font-size` propio, que en el prototipo quedan en **13,33 px**: "Enviar" (muro), "Atrás" y "Volver al evento". Si se iguala la tipografía en producción, debe ser una decisión explícita.
- Los avatares de "quién va" miden **46 px** dibujados (40 + borde blanco de 3 px por lado, `content-box`), con solape de −12 px.
- Las mayúsculas son de CSS (`text-transform`). El texto fuente va en mayúscula inicial: "Rumba · Vie 9 oct", "Noche de salsa", "Sobre el evento", "¡Listo, Camila! Nos vemos en la pista", "Compra tus boletas", "Boleta oficial", "Plato fuerte" y los rótulos ("Fecha", "Hora", "Localidad", "Cantidad", "Titular", "Orden", "Organiza", "Escenario", "Pista", "Entrada"). No hay que escribirlos en mayúscula en el contenido.
- **No** se usa `font-variant-numeric: tabular-nums` en ningún precio ni en el contador (el código base sí lo usa en `.price`). Los totales del resumen pueden "bailar" al cambiar de cantidad.
- El campo del muro escribe en **#000000** (no en #17120F) y a 15,2 px; los campos del checkout sí fijan #17120F y 16 px (lo que además evita el zoom automático de iOS).
- El título "Recuerdos de ediciones pasadas" es el único `h2` en DM Sans de 1rem sin mayúsculas.
- "Cantidad" va como rótulo en mayúsculas por CSS (.72rem, 700, `letter-spacing: .1em`, #6E6259) en la tarjeta lateral, y como título normal en `<b>` de .95rem, sin mayúsculas, en el paso 1.

**Formatos y microcopys**
- Dinero: "$45.000" (signo pegado, punto de miles, sin decimales) con `toLocaleString('es-CO')`. Horas: "8:00 p. m." / "1:00 a. m." (con espacios y puntos). Miles abreviados: "12,4 mil" (coma decimal). Porcentaje: "(8%)" sin espacio.
- Separadores: punto medio "·" (U+00B7) con un espacio a cada lado; signo de multiplicar "×" (U+00D7) en "2 × General ($45.000)" y "2 boletas × $45.000"; raya "—" en "Campos seguros de [PASARELA] — tus datos…"; signos de apertura "¿" y "¡".
- Singular y plural calculados: "1 boleta" / "2 boletas", "1 mesa" / "2 mesas", "1 pago pendiente" / "2 pagos pendientes", "Tu amigo recibió" / "Tus amigos recibieron".
- Placeholders exactos: "Pregunta o comenta algo del evento", "Sin puntos ni espacios", "Opcional", "0000 0000 0000 0000", "MM/AA", "CVV", "CAMILA VARGAS". Opción vacía del banco: "Elige tu banco".
- Concordancia distinta en dos lugares: el héroe dice "340 interesados" y "quién va" dice "340 interesadas" ("personas … interesadas").
- La línea de stock "Disponible" se muestra en la tarjeta lateral y en el paso 1, pero **no** en la lista de la sección Localidades (ahí solo aparece la píldora "Últimas 12").
- Los nombres de localidad cambian según el lugar: "Preferencial" (tarjeta lateral, resumen y barra), "Preferencial (mesa compartida)" (lista, paso 1 y boleta) y "Preferencial" en "Tienes 1 boleta · Preferencial"; "Mesa VIP para 4" (tarjeta y paso 1) y "Mesa VIP" en "Tienes 4 boletas · Mesa VIP".
- "Desde $45.000" es texto fijo en tres lugares (dato clave, tarjeta lateral, barra móvil) y no se calcula.
- La barra móvil dice "Comprar" incluso después de comprar; la tarjeta lateral cambia a "Comprar más boletas".
- El atajo dice "Parches y muro" pero la sección se titula "Parches para este evento"; el atajo "Ubicación" lleva a "Ubicación y organizador".
- "Muro (24)" muestra solo 3 mensajes; "Parches (3)" es fijo.
- Nombres que cambian entre bloques: "Laura M." (parche) y "Laura Martínez" (muro y checkout); "Mafe G." (parche) y "María F. Gómez" (checkout), que parecen la misma persona pero el código no las relaciona; "Daniel T." frente a "Daniel Torres".
- "Salseros de jueves" aparece como parche público del evento ("6 de 8 cupos", con "Unirme") y como parche de Camila en el checkout ("12 miembros") (H25).

**Comportamiento**
- Una sola localidad para todo: plano, lista, tarjeta lateral, barra y paso 1 se sincronizan en los dos sentidos. Las dos zonas VIP del plano son un solo valor.
- Cambiar de localidad (en cualquier lugar, también con la ventana cerrada) recorta en silencio los amigos elegidos al cupo nuevo (3 en VIP), y no los recupera al volver a General.
- `qty` se guarda aparte: con VIP se muestra 1, pero al volver a General reaparece la cantidad anterior (por ejemplo, 8).
- Con "Para mi parche" elegido y la ventana cerrada, la tarjeta lateral muestra "Tú + {k} de Salseros de jueves" y deja el selector −/+ deshabilitado.
- El interruptor "Dividir el pago" guarda su valor aunque se deshabilite al quedar sin amigos, y se vuelve a encender solo al elegir uno.
- Laura viene elegida por defecto en "Para mi parche" (`picked: { lm: true }`), así que al cambiar a parche ya dice "Van 2".
- El titular de la boleta (`tkHolder`) y la línea de correo se leen del estado **actual**: si después de pagar se edita el nombre o el correo, la boleta cambia. En producción salen de la orden guardada.
- "Comprar más boletas" reinicia solo `step`, `terms`, `method`, `bank` y `split`. Conserva el documento, los nombres de asistentes (guardados por número de boleta) y "¿Para quién?".
- "Ver boleta" abre la última compra; si había otra compra a medias, la reemplaza en pantalla (vuelve al paso 4).
- "Copiar dirección" no tiene vuelta atrás ni copia nada.
- El celular de Nequi/Daviplata (`walletPhone`) es un estado aparte del "Celular" del paso 2: los dos arrancan en "300 123 4567", pero editar uno no cambia el otro.
- `calAdded` no se reinicia con "Comprar más boletas": después de una segunda compra, el paso 4 ya dice "Agregado al calendario".
- Pagar pone automáticamente "Vas a ir" (`going = true`).
- El scroll de la ventana se arrastra de un paso al siguiente (a 390 px, el paso 3 abrió con `scrollTop` 90); la confirmación "¡Listo, Camila!" puede quedar fuera de vista (H6).
- La página de fondo sigue desplazándose con la ventana abierta (no hay bloqueo de scroll) y Tab sale de la ventana al fondo después de "Continuar" (H7).
- Escape solo cierra si el foco está dentro de la ventana; al abrirla, el foco se queda en el botón "Comprar".
- Los anclas saltan sin animación; `scroll-margin-top: 140px` se aplica en todos los anchos (a 390 px, con un encabezado de 125 px, la sección queda a 15 px de él).
- No hay "scroll spy": los atajos no marcan la sección actual.

**Capas, fijos y desbordes**
- `z-index`, de menor a mayor: atajos 4 (fijos solo desde 980 px), encabezado 5, barra móvil 15 y ventana 30. La cabecera y el pie de la ventana tienen `z-index: 2` dentro de ella.
- Los atajos usan márgenes negativos (`-22px 0 -18px`) y fondo #FBF7F3 para tapar lo que pasa por debajo cuando están fijos. Si se cambia el `gap` de la columna (36 px), hay que recalcularlos.
- La tarjeta de compra se pega a `top: 88px` = 69 px del encabezado + 19 px de aire. Si el encabezado cambia de alto, hay que mover ese valor, el `top: 69px` de los atajos y el `scroll-margin-top`.
- Recortes con `ellipsis`: el subtítulo de la barra móvil ("Tienes 2 boletas · Ge…" a 390 px) y los rótulos del indicador de pasos. `white-space: nowrap` en atajos, pestañas, rótulos de pasos y subtítulo de la barra.
- `overflow-x: auto` en los atajos y en las pestañas, **sin** ocultar la barra de scroll (el código base la oculta) y sin pista visual.
- `overflow: hidden` en el héroe, en las tarjetas de planes parecidos, en la tarjeta de ubicación, en la boleta (para las muescas) y en la barra de cupos.
- La rejilla de planes parecidos usa `auto-fill`: entre 896 y 969 px deja una cuarta columna vacía. Las demás rejillas usan `auto-fit`.
- Entre 980 y 1014 px el plano y la lista vuelven a apilarse, y entre 980 y 1032 px se apilan la ubicación y el organizador, porque aparece el aside y la columna se angosta. Justo a 980 px "Armar parche" baja debajo del título, y a 980–981 px "Ver parches" baja a otra fila en "quién va".
- A 768 px los cuadros de recuerdos miden 223 px (el bloque queda muy alto).

**Visual**
- El degradado del título del héroe es un rectángulo por `span`, también cuando el texto se parte en dos líneas.
- El héroe no tiene foto real; el marcador "[Foto del evento]" queda arriba a la derecha.
- El plano es ilustrativo, no está a escala. Las zonas no elegidas se ven en su tinte claro y la elegida en color pleno, con borde, sombra y visto.
- Las muescas de la boleta se dibujan con círculos del color de fondo de la ventana (#FBF7F3). Si la boleta se muestra sobre otro fondo (por ejemplo, en "Mis boletas"), hay que cambiar ese color.
- El borde punteado de la tarjeta de pago (#6E6259, 1,5 px) marca el espacio reservado para la pasarela.
- El paso 4 marca los 4 pasos como hechos, incluido "Listo".
- La ventana en escritorio no está centrada: es un panel arriba a la derecha con 12 px de margen.
- No hay ningún hover en los botones ni en las tarjetas de planes parecidos (el `.card` del código base sube 3 px con sombra al pasar el mouse).

**Inconsistencias con otras pantallas**
- El encabezado de Evento (volver + logo centrado + íconos) no tiene buscador ni "Crear evento", a diferencia de Inicio, Agenda y Mapa (H41).
- La hora del evento no coincide entre Inicio (9:00 p. m.), Chat (8:00 p. m.) y Evento (puertas 8:00, show 9:30) (H37).
- Inicio dice "24 van · 3 amigos" y Evento "186 van" y "10 amigos más" (H37).
- Perfil dice "Va", Inicio "Vas" y Evento arranca en "Voy" (H37).
- El Chat dice que los 7 amigos elegibles ya tienen boleta ("7 de 12 con boleta"), pero el checkout los ofrece para comprarles (H25).
- La boletera de este evento en Agenda es "TuBoleta" (`b: 'TuBoleta'`), mientras Evento dice "[BOLETERA]" (H1).


#### 8.2.7 Mensajes (chat)

##### Correcciones obligatorias de la auditoría

Hallazgos de `docs/auditoria-2026-10-07.md` que tocan esta pantalla. Lo que piden **se implementa así**, aunque el prototipo haga otra cosa.

**De diseño (prototipo)**

- **H8 (Alta) · Scroll de lado en la lista en celular.** Por debajo de 708 px de ventana la página mide 708 px porque la lista (`Chat.dc.html:80`) no tiene `min-width: 0` cuando pasa a `width: auto; flex: 1 1 auto` (`:23`). Implementar `min-width: 0` en la columna de la lista en el modo de una columna (la auditoría lo probó: el desborde baja a 0; "con eso basta"). Verificado aquí a 320 px con esa regla: la página mide 320 px y los botones "Nuevo chat" / "Nuevo parche" (`white-space: nowrap`) miden 121 px cada uno con su texto entero, sin margen de sobra. En producción, una prueba automática del ancho de página a 320 px (lo pide la auditoría).
- **H35 · Viewport.** Agregar `<meta name="viewport" content="width=device-width, initial-scale=1">`, a la vez que H8 (si no, en un celular real la página se dibuja a 980 px).
- **H43 · La conversación en celular abre en los mensajes más viejos.** Por debajo de 900 px el historial pierde su scroll y el anclaje al último mensaje. Implementar:
  - la conversación a **pantalla completa, sin el encabezado de la app**;
  - el historial con **scroll propio** (alto `100dvh` menos la barra superior y el compositor), conservando `column-reverse` para que abra en el último mensaje;
  - los 3 botones de adjuntar ("Compartir evento", "Crear encuesta", "Enviar foto") **agrupados en un solo botón "+"**, para que el campo de texto tenga espacio (hoy se lee "Escríbele al pa" y a 360 px el botón "Enviar" salta de línea).
  - Con el scroll propio se corrigen además dos efectos medidos en el prototipo: al abrir una conversación la página conserva el `scrollY` de la lista (nunca muestra el último mensaje) y, al enviar con la página arriba, la burbuja nueva queda fuera de vista.
- **H7 (Alta) · Foco y ventanas.** En el Chat:
  - "Enviar" se deshabilita con el foco encima: usar `aria-disabled="true"` en lugar de `disabled`, conservando el chequeo de borrador vacío y el aspecto (#EAE1D8 / #6E6259). Aplicar el mismo patrón a "Crear parche" y "Abrir chat" es una extensión de este documento (la auditoría solo nombra Continuar, Pagar, Enviar, Acercar y Quitar): sirve para que el teclado llegue al botón y el lector lea por qué no está listo.
  - La ventana "Nuevo parche / Nuevo chat": el fondo (encabezado y `main`) debe quedar `inert` mientras está abierta; el foco debe entrar a la ventana al abrirla (en el formato del prototipo, `sc-camel-auto-focus` en "Cerrar"); Escape debe cerrar desde cualquier punto; en producción, devolver el foco al botón que la abrió. Hoy hacen falta 43 Tabs para entrar.
  - El panel de información en celular (pantalla completa) y en 900–1179 px (cajón): `role="dialog"`, `aria-modal="true"`, cierre con Escape, foco adentro al abrir y de vuelta en "Info" al cerrar.
  - En producción, usar `<dialog>` con `showModal()`, o React Aria / Radix.
- **H9 (Alta) · Reportar, bloquear e invitaciones.** El panel solo ofrece dividir el pago, silenciar y salir, y al crear un parche los amigos quedan adentro sin aceptar ("Camila añadió a Laura y Vale", `:1067-1075`). Implementar:
  - un menú en cada mensaje, persona y parche con "Reportar" (con motivos), "Bloquear" y "Salir y reportar" (también en los chats con personas y con el organizador, que hoy no tienen ninguna acción);
  - entrar a un parche como **invitación que se acepta** ("Laura te invitó a…"): el mensaje del sistema y la lista de miembros deben distinguir invitados pendientes;
  - un ajuste "Quién puede escribirme y agregarme";
  - que el administrador pueda sacar miembros.
- **H30 · Se expone dónde y cuándo estará cada persona.** El chat publica solo quién compró, cuántas boletas y en qué localidad ("Andrés compró 2 boletas · General", "Sofía compró 2 boletas · Oriental", "Daniel compró 1 boleta · General", `:620`, `:655`, `:683`) y marca a cada miembro con "Tiene boleta" / "Sin boleta" (`:394-399`). Implementar:
  - el aviso de compra **siempre voluntario** y **sin cantidad ni localidad** ("Andrés ya tiene su boleta");
  - un ajuste "Quién ve mis planes" (amigos, parche o nadie);
  - tres tipos de parche (abierto, con aprobación y privado); el punto de encuentro ("la tienda de la 57", "donde Laura, en Chapinero") solo lo ven los miembros aprobados;
  - consejos de seguridad al unirse y la opción de reportar el parche.
- **H48 · Insignia "Organizador verificado".** Sale en la lista, la barra y el panel (`:112`, `:154`, `:366`, `:639`) sin explicar qué se verificó, y el nombre de un parche es texto libre de 40 caracteres con iniciales como avatar (`:469`), así que "Galería Café Libro · Oficial" se vería casi igual. Implementar:
  - definir qué se verifica: RUT o NIT, cámara de comercio, PULEP del productor y cuenta bancaria a nombre de la empresa (en producción lo respaldan las cuentas de organizador verificadas de H12);
  - una explicación "Qué significa verificado" accesible desde la insignia (y la misma insignia en Evento y el checkout);
  - bloquear nombres de parche que contengan "oficial", "verificado" o "Fulleventos";
  - mantener la diferencia visual del organizador (avatar tinta con letras amarillas y píldora "Organizador · Responde en ~1 h").
- **H46 · Todos los perfiles abren el de Camila.** Los avatares de los mensajes (`:241`), "Ver perfil" y "Ver perfil del organizador" llevan a `Perfil.dc.html`. Implementar `/perfil/:usuario` de cada persona (variante "Perfil de otra persona" con Seguir, Mensaje y Reportar o Bloquear) y la página del organizador.
- **H36 · Todos los eventos abren la salsa.** "Ver evento", el título del plan, "Comprar mi boleta" (en Rockeros abre un evento de $45.000 en lugar de $180.000), "Ya tienes boleta", las tarjetas compartidas y los eventos del panel van a `Evento.dc.html`. Implementar `/evento/:slug` de cada evento.
- **H42 · Contexto perdido entre pantallas.** "Escribir al organizador" (Evento) abre "Salseros de jueves". Implementar la conversación en la URL (`/mensajes/:conversacion`) y crear la conversación con el organizador si no existe. Lo mismo para "Tus parches" de Main y "Mensaje" de Perfil.
- **H41 · Búsqueda y patrones.** Buscar "provenza" no encuentra la conversación con Andrés donde se compartió ese evento (`:754`). Implementar una búsqueda de chats que incluya los eventos compartidos (y, si se decide, el texto de los mensajes), con estados vacío y de carga. El buscador del encabezado necesita su pantalla de resultados. Repostear debe tener un solo patrón en todo el producto (aquí es instantáneo y sin contador).
- **H38 · Botones muertos.** "Notificaciones" (`:69`), "Crear evento" (`:71`) y el selector de ciudad (`:1106`, cambia el valor y no filtra nada). Conectarlos o mostrar "Próximamente". Si la ciudad no aplica a los chats, sacarla de esta pantalla o explicar qué hace.
- **H51 · Campos sin indicador de foco.** El buscador del encabezado (`:35`), el de chats (`:95`), el campo del compositor (`:350`) y el nombre del parche (`:469`) tienen `outline: 0` inline, que le gana a la regla de foco. Quitar `outline: 0` o marcar el contenedor con `:focus-within` (borde de 2 px #C23A24), y usar la regla común de 3 px #C23A24 con 2 px de separación.
- **H52 · Contraste.** Pista apagada de "Silenciar notificaciones" #EAE1D8 sobre blanco = 1,29:1 (`:1150`): usar al menos 3:1 (por ejemplo #857870, 4,27:1 sobre blanco) y decir el estado también en texto. Bordes de campo (#EAE1D8, 1,29–1,55:1) a revisar. Placeholders en #6E6259 (5,54:1) en vez del gris por defecto (#757575, 4,32:1 sobre crema).
- **H59 · Semántica.** Lo que la auditoría nombra para el Chat es el avatar "CV" (`Chat.dc.html:72`), que se llama "Tu perfil": debe llamarse "CV, tu perfil" (nombre que empiece por el texto visible). El mismo criterio, aplicado por este documento al resto de la pantalla (la auditoría lo pide para las opciones de una sola respuesta de Evento y Mapa, no las enumera en el Chat): los avatares de los mensajes ("SC, perfil de Sofía Cárdenas"; axe los marca, ver "Accesibilidad ya presente"); los filtros "Todos / Parches / Personas / No leídos", el selector "Parche (grupo) / Con una persona" y la elección de una persona en "Nuevo chat" son de opción única pero están hechos con `aria-pressed`: usar `role="radiogroup"` / radios nativos (`fieldset` y `legend`) o el patrón de pestañas de ARIA.
- **H21 · Precio sin cargo.** "Desde $45.000" en el plan fijado (`:855`) y en las tarjetas compartidas (`:959`) no incluye el 8 % ni aclara el IVA. Usar el formato único del producto: "Desde $45.000 + cargo por servicio" o "Desde $48.600 con cargos".
- **H25 · Datos del parche.** "7 de 12 con boleta" (`:610-611`) contradice el checkout de Evento, que ofrece comprarles a los 7 que ya tienen boleta. Unificar los datos del parche entre Chat, Evento y Main y, en el checkout "Para mi parche", dejar elegir solo a quienes no tienen boleta.
- **H37 · El mismo evento con datos distintos.** El chat dice 8:00 p. m. para la salsa (`:599`), Evento dice "Puertas 8:00 · Show 9:30" e Inicio 9:00 p. m.; Main dice "Salseros · 2 nuevos" y aquí hay 3; la historia de Andrés no cuadra (llega a Bogotá el jueves para la salsa del viernes y el mismo viernes propone Provenza en Medellín, `:668`). Usar un solo bloque de datos de ejemplo y, en producción, un solo modelo (H53). Diferenciar "Voy" de "Tengo boleta".
- **H5 (Alta) · Datos legales.** El Chat no tiene pie de página. Dar acceso a lo legal (razón social, NIT, PQR, enlace a la SIC, Términos y Política de tratamiento) desde el menú o el perfil.
- **H17 · Estados faltantes.** Diseñar esqueletos de carga y errores con "Reintentar" para la lista y la conversación (y, en producción, el estado de mensaje no enviado).
- **H40 · Encabezado en celular.** (La auditoría no lista el Chat en H40, pero es el mismo encabezado de Main, Agenda y Mapa.) Aquí ocupa 224 px a 390. Un encabezado móvil de una fila y una barra inferior con 5 pestañas con texto (Inicio, Agenda, Mapa, Mensajes, Perfil); en la conversación abierta, sin encabezado (H43).
- **H49 · Anuncios.** Conservar `role="log"` en el historial; los demás cambios (filtrar la lista, abrir una conversación, salir de un parche) deben escribirse en una región viva `role="status"` permanente.

**De producción que cambian esta pantalla**

- **H13 (Alta) · Chat en tiempo real.** Los mensajes viven en el estado de la página, con hora "Ahora", y se pierden al salir. Implementar mensajería en tiempo real (por ejemplo, Supabase Realtime o WebSockets) con historial paginado; solo los miembros de un parche leen sus mensajes; estados de enviado y leído (hoy el doble check es fijo); notificaciones push; reportar y bloquear con panel de moderación, revisión automática de imágenes, límites de envío y un canal de emergencia; advertencia en los enlaces externos; política de retención de mensajes (Ley 1581, plazo por confirmar con abogado). Si el chat sale en el MVP, no abrirlo sin H9, H13, H29 y H30 (decisión pendiente P6).
- **H29 · Enlaces de pago falsos.** Hoy un texto como "Paguen su parte aquí: https://…" se publica como una burbuja normal. Implementar una **tarjeta del sistema "Solicitud de pago · Fulleventos"** con monto, evento, localidad, quién la pide, fecha límite y un botón "Pagar mi parte" que abre el checkout dentro de la app; solo el sistema la genera y no se puede reenviar ni imitar; detectar enlaces, números de cuenta y palabras como "consigna" o "transferencia" y advertir; y un aviso fijo: "Fulleventos nunca te pide pagar por enlaces externos ni transferirle a una persona". Cambiar "link de pago" por "solicitud de pago dentro de la app" en Evento.
- **H18 · Pago dividido.** Camila (que no administra Salseros) lo activa y solo sale "cada uno paga su parte", sin monto, destinatarios ni plazo; desactivarlo no avisa nada (`:406-408`, `:1158-1166`). En producción: dividir el pago **solo desde una compra real**; mostrar antes las reglas (plazo, recordatorios, qué pasa al vencer); que el amigo pueda rechazar; confirmar unidades indivisibles (mesas) solo al 100 %; límite de reservas por persona y evento; modelo de "partes de pago" con enlace, monto y vencimiento pagadas directo a la pasarela.
- **H32 · Transferencia y reventa.** "Ya te pasé lo mío" (`:656`) muestra plata pasando por fuera. Ofrecer "Transferir boleta a un amigo" oficial y, si el organizador lo permite, reventa con precio tope.
- **H10 · Edad.** No hay filtro por edad en parches ni mensajes. Definir la política de edad; en producción, bloquear los mensajes directos de adultos que no sean contactos a menores y ocultar eventos +18 a menores.
- **H1 / H4 · Modo de compra.** "Comprar mi boleta" supone venta propia. Mostrar el modo de compra de cada evento (gratis, "Comprar en [BOLETERA]" o venta propia) también en el plan fijado y en las tarjetas compartidas (decisión pendiente P1).
- **H14 · Organizadores.** El organizador solo existe como perfil y como chat; definir la cuenta de organizador y quién responde sus mensajes ("Responde en ~1 h" debe calcularse).
- **H53 · Modelo de datos.** El chat trae su propia copia parcial de eventos (`:598`) y fechas relativas fijas ("Faltan 3 días", `:849`). Usar el modelo único (usuario, parche, mensaje, encuesta, reporte, bloqueo, notificación…) y calcular las fechas relativas con la hora del servidor (zona America/Bogota).
- **H54 · Notificaciones.** La campana no hace nada (`:69`). Centro de notificaciones y push, con preferencias por tipo; "Silenciar chat" debe respetarse en el servidor.
- **H55 · Analítica.** Medir "parche creado" y "parte del pago dividido pagada" dentro del embudo, con consentimiento.
- **H56 · Accesibilidad.** Mantener `role="log"` y no anunciar "escribiendo…" en cada tecla.
- **H57 · Rendimiento.** Línea base: Chat pesa 20.728 bytes comprimido y 639 nodos. Con fotos reales, tiempo real y analítica: AVIF/WebP con varios tamaños, carga diferida, virtualizar o paginar historiales largos, y las metas de Core Web Vitals del informe (LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1, menos de ~150 KB de JavaScript inicial).
- **H12 / H33 · Cuentas.** (La auditoría no lista el Chat en H12 ni en H33; se aplica porque es una pantalla solo con sesión.) El chat exige sesión: redirigir a "Entrar" y volver a la conversación pedida después, como pide H33 ("devolver al usuario al mismo punto después de registrarse").


##### Detalles finos

1. El conteo de no leídos del encabezado y del resumen es de **conversaciones**, no de mensajes: Salseros tiene 3 mensajes nuevos y cuenta 1. Textos exactos: "3 chats sin leer", "1 chat sin leer", "Al día".
2. Al cargar, Salseros está abierta pero sigue contando como no leída (su "3" se ve en la fila marcada). Solo se marca leída al tocarla o al enviar algo. Lo mismo pasa con la conversación que se abre sola después de "Sí, salir".
3. El separador "N mensajes nuevos" no desaparece al leer: solo cuando Camila envía algo en esa conversación. En producción debe depender del último mensaje leído.
4. El separador de fecha va en mayúsculas con `letter-spacing: .1em` (#6E6259); el de nuevos va en rojo #C23A24, **sin** mayúsculas, con líneas de 1,5 px al 50 % de opacidad.
5. Agrupación por autor: el primer mensaje de una racha lleva nombre, avatar visible, `margin-top: 12px` y pico arriba a la izquierda (`4px 18px 18px 18px`); los siguientes, avatar invisible pero ocupando lugar, `margin-top: 3px` y radio 18 parejo. La hora solo va en el último de la racha, así que un mensaje con reacciones seguido de otro del mismo autor muestra las reacciones pero no la hora.
6. Las burbujas de Camila siempre tienen el pico abajo a la derecha (`18px 18px 4px 18px`), incluso las seguidas; nunca llevan avatar ni nombre.
7. En chats con persona y con el organizador no hay avatares ni nombres sobre las burbujas ajenas.
8. El doble check (`m2 13 4 4 8-9M10 15l2 2 9-10`) solo aparece en los mensajes de Camila y es siempre igual: no representa entregado ni leído.
9. Las tarjetas de evento, encuestas y fotos de Camila también van a la derecha y llevan hora y doble check; no tienen fondo tinta.
10. `overflow-wrap: anywhere` en las burbujas: un enlace o palabra larga se parte en cualquier punto en vez de desbordar.
11. Ancho de las burbujas: `max-width: min(78%, 440px)` de la fila (410 px a 1280 con el panel abierto). La tarjeta de evento mide 290 px (+2 de borde), la encuesta 300 (con borde incluido) y la foto 260 (+2), todas con `max-width: 100%`.
12. Vista previa de la lista: "Tú: compartió «…»" y "Tú: envió una foto" mezclan segunda y tercera persona; en parches el prefijo es el **nombre corto** ("Sofía:", "Laura:", "Mafe:"), no el completo. Las comillas son angulares « ».
13. Los mensajes del sistema van sin prefijo en la vista previa ("Camila activó el pago dividido: cada uno paga su parte").
14. La hora de la lista pasa a "Ahora" en cuanto Camila envía algo, aunque la conversación tenga hora fija.
15. La lista se ordena por "última actividad de Camila en la sesión", no por la hora del último mensaje.
16. Truncados con "…": nombre y vista previa en la lista, nombre en la barra superior, nombres de miembros, rótulo de la foto. El subtítulo de la barra superior se corta **sin** "…" porque su `span` es `display: flex` (ver "12 miembros ·" a 390). Los títulos de eventos, el nombre del panel y los textos de la confirmación no se truncan.
17. Las píldoras de evento de la lista usan la **etiqueta** ("Salsa", "Fútbol", "Rock", "Reguetón") y no la categoría; la tarjeta compartida usa la categoría ("RUMBA", "DEPORTE", "CONCIERTOS").
18. La hora del evento solo aparece en el plan fijado (`meta`). La tarjeta compartida y "Evento del parche" del panel usan `día d oct · lugar · ciudad` sin hora; "Planes en común" / "Sus próximos eventos" usan `día d oct · ciudad` (más `· parche` en personas), sin hora ni lugar; las opciones del selector de la ventana usan `título · día d oct · ciudad`. El rock no tiene hora en ningún lado.
19. El mes "oct" está escrito a mano, no sale del dato: en las placas de fecha del plan y de la tarjeta ("OCT") y en las cadenas de JavaScript de la píldora de la lista, `meta` y `metaShort` del plan, `evMeta` de la tarjeta, "Planes en común" y las opciones del selector de la ventana. Con eventos de otro mes saldría mal.
20. "Faltan N días" no maneja el singular ni "Hoy" / "Mañana"; "N cupos libres" tampoco maneja el singular. El pie de la encuesta dice "1 votos" con un solo voto (el `aria-label` de la opción sí dice "1 voto").
21. Porcentajes con `Math.round`: Rockeros 5 de 8 = 62,5 % → 63 %. La barra del plan mide hasta 120 px (`flex: 0 1 120px`) y se encoge.
22. "Ya tienes boleta" reemplaza "Comprar mi boleta" y quita el precio; solo pasa en Clásico capitalino (Camila tiene boleta). En el panel, Camila aparece primero como "Tú (Camila)" con su estado.
23. Orden de miembros: Camila, luego con boleta, luego sin boleta, respetando el orden del dato dentro de cada grupo. "Creó el parche" / "Creaste el parche" va debajo del nombre del administrador.
24. "Dividir pago del parche" y su nota solo existen en parches **con evento**; los parches sin evento tampoco muestran "Ver evento", plan fijado ni estado de boleta de los miembros, y su contador "N de M con boleta" queda como un `span` vacío.
25. "Planes en común" se calcula desde los parches compartidos y deja de incluir un parche del que Camila salió; "Sus próximos eventos" del organizador viene del dato.
26. Placeholder del compositor: "Escríbele al parche", "Escríbele a Laura" (nombre corto) y "Escríbele a Galería Café Libro" (texto fijo en el código: un segundo organizador diría lo mismo). Igual de fijos para el organizador: las iniciales y colores del avatar (`avatarOf` devuelve siempre "GC", #17120F y #F6DC6A para `kind: 'org'`, sin leer `P.gc`), el subtítulo del panel ("Organizador verificado · Responde en ~1 h", escrito en `infoSub` en vez de leer `C.status`) y la píldora "Organizador · Responde en ~1 h" de la lista (en la plantilla). En producción, todo debe salir de la cuenta del organizador.
27. El borrador es por conversación y sobrevive al cambiar de chat. Enviar texto, crear encuesta o enviar foto lo consumen: la encuesta usa el borrador como pregunta y la foto como pie.
28. El campo es `input type="text"`: Mayús+Enter no hace salto de línea y no hay mensajes de varias líneas. Si se quieren, usar `textarea` con autoajuste y conservar "Enter envía, Mayús+Enter salta".
29. "Enviar" deshabilitado no baja la opacidad (Mapa sí usa `opacity: .4`): el aspecto lo dan #EAE1D8 y #6E6259.
30. En celular "Enviar" queda como círculo de 44 px y la palabra "Enviar" sigue en el DOM como texto oculto; no quitarla.
31. A 360 px el botón "Enviar" salta solo a una segunda línea del compositor y a 320 px saltan campo y botón (`flex-wrap: wrap` con `flex: 1 1 120px`): se corrige con el botón "+" de H43.
32. Scroll del historial en escritorio: abre abajo gracias a `column-reverse`; si se envía estando abajo, sigue abajo, pero si el usuario subió, el mensaje nuevo queda fuera de vista (no hay salto al final). Además, al cambiar de conversación el scroll **no** se reinicia: se conserva el desplazamiento de la anterior (con Salseros subido 444 px, Clásico abrió subido 184 px). En producción, reiniciar al fondo al cambiar de conversación (por ejemplo, con una `key` por conversación) y bajar al fondo al enviar.
33. El plan fijado no hace scroll: en ventanas bajas o con el panel abierto se come espacio del historial (157 px a 1280; 180 px a 1180). A 1280 × 600 quedan 220 px de historial.
34. El cajón de 900–1179 px no tiene fondo oscuro y deja usar la lista; al abrir otra conversación se cierra (`infoNarrow = false`). En ≥ 1180 px, en cambio, el panel sigue abierto al cambiar de conversación. El cajón tapa los botones "Ver evento", Info y "Silenciar chat" de la barra superior y el botón "Enviar": mientras está abierto no se puede enviar ni cerrarlo con Info.
35. `infoWide` e `infoNarrow` son independientes: cerrar el cajón en tableta no cambia lo que se ve en escritorio, pero "Cerrar información" apaga los dos.
36. Los dos botones Info (ancho y angosto) tienen el mismo `aria-label` y viven a la vez en el DOM; solo uno se muestra según el ancho. En producción basta uno con dos comportamientos.
37. "Silenciar chat" (barra) y "Silenciar notificaciones" (panel) son el mismo estado; la barra cambia de ícono (campana ↔ campana tachada) pero no de texto accesible.
38. "Salir del parche" usa una confirmación en línea (no una ventana) con "¿Seguro que quieres salir de **{nombre}**? Ya no verás los mensajes ni el plan." / "Me quedo" / "Sí, salir". No hay forma de deshacer ni aviso de que se salió, y los demás miembros no ven un mensaje del sistema.
39. Activar el pago dividido publica un mensaje del sistema y sube la conversación; desactivarlo no publica nada y el mensaje anterior se queda.
40. Las reacciones solo se alternan sobre las que ya existen; no hay selector para agregar una reacción nueva ni reacciones en los mensajes de Camila.
41. "Repostear" en la tarjeta del chat es por **mensaje** (no por evento) y no comparte con nadie ni suma contadores; en Agenda abre una ventana con destino y en Mapa es instantáneo (H41).
42. La bandeja "Compartir" tiene scroll horizontal sin pista visual (el cuarto evento queda escondido) y se cierra sola al compartir, al abrir otra conversación y al volver a la lista.
43. Ventana: "Nuevo parche" siempre se abre con el nombre, el evento y los amigos vacíos y "Nuevo chat" sin nadie elegido, pero cada botón reinicia solo lo de su modo: cambiar de modo **dentro** de la ventana muestra lo que quedó del otro modo, incluso de una ventana cancelada antes (medido: "Previa" y Laura marcada reaparecen al abrir "Nuevo chat" y pasar a "Parche (grupo)"). En producción, reiniciar todo al abrir. El nombre se recorta y se limita a 40 caracteres; las iniciales saltan "de, del, la, el, los, las, y, en"; un nombre de solo palabras vacías ("de la") da "DE".
44. El color de un parche nuevo depende de `seq`, que también sube con cada mensaje enviado: no es determinista desde el punto de vista del usuario. En producción, guardar el color al crear.
45. "Abrir chat" con alguien que ya tiene conversación (Laura, Andrés, Sofía) la abre y la marca leída sin moverla de lugar; con alguien nuevo (Juan Pablo, Mafe, Daniel, Vale) crea el chat vacío arriba con "Chat nuevo · escribe el primer mensaje" y "Escríbele a {nombre} para arrancar el plan.". Los chats nuevos no tienen estado: el subtítulo cae a la ciudad ("Bogotá") y el panel dice "Bogotá · Amigo en Fulleventos".
46. Crear un parche o un chat reinicia los filtros a "Todos" y borra la búsqueda, para que la conversación nueva se vea.
47. Estado vacío de la lista: con "No leídos" y sin búsqueda dice "Estás al día: no tienes mensajes sin leer."; en cualquier otro caso "No encontramos chats con ese filtro."; el botón siempre es "Ver todos los chats" y borra filtro **y** búsqueda.
48. "Personas" incluye la cuenta del organizador (Galería Café Libro), que no es una persona.
49. La búsqueda ignora tildes y mayúsculas y recorta espacios ("  clasico " encuentra "Clásico capitalino"), pero solo mira el nombre y el evento del parche.
50. Estados "En línea" (con punto verde #B9E07A y anillo de 1,5 px #17120F), "Activo hace 2 h" y "Activa hace 20 min" son texto fijo con género; solo "En línea" pinta el punto.
51. El avatar del organizador es el único con letras amarillas (#F6DC6A sobre #17120F); la auditoría pide usar esa regla en todas las pantallas (en Registro las iniciales tienen el mismo color del fondo, H52).
52. Cuadrado redondeado = parche u organizador (radio 14 px en la lista, avatar de 48, y en la barra, avatar de 44; radio 20 px en el panel, avatar de 72); círculo = persona. Iniciales de parches y organizador en Archivo 900; de personas en DM Sans 700.
53. La insignia del ícono de mensajes en esta pantalla va en `top: 4px; right: 4px` con anillo `0 0 0 2px #17120F`; en las demás va en 6 px sin anillo, y en Perfil en −3 px. Unificar en el componente del encabezado.
54. El encabezado deja de ser fijo por debajo de 900 px **solo en esta pantalla** (en Main, Agenda y Mapa sigue fijo).
55. "Crear evento" sí tiene `type="button"` aquí (en Agenda, Main y Mapa no).
56. El historial usa `role="log"` sin `aria-live` explícito (el rol ya implica `polite`); no agregar anuncios de "escribiendo…".
57. Todo el texto de los marcadores de foto va entre corchetes ("[Foto del evento]", "[Foto: la fila del concierto pasado]", "[Foto que compartiste]"): son marcadores hasta tener fotos reales (decisión 2.4).
58. Íconos: todos de trazo (nunca emoji), `stroke-linecap` y `stroke-linejoin` redondos; grosores 2 (navegación y compositor), 2,2 (botones de acción, reacciones, check de hora), 2,4 (píldora de evento, chinche, sistema, cerrar, flecha), 2,6 (barras de encuesta), 3 a 4 (palomitas). El corazón y la llama van en #C23A24; el pulgar en tinta.
59. Transiciones: solo tres, `width 300ms ease` (barra del plan y rellenos de encuesta) y `left 160ms ease` (perilla del interruptor). Nada más anima: ni la ventana, ni el cajón, ni el cambio de conversación.
60. Hover: solo los enlaces sin color inline cambian a #C23A24 (íconos de navegación, avatar "CV", "Ver evento", título del plan, "Ya tienes boleta", títulos y flecha de las tarjetas, "Evento del parche", "Ver perfil", eventos del panel). Los botones no tienen hover. El código base sí tenía hover en `.btn-dark` (#33291F), `.ticket` (#BF3923), `.chip` y `.join`; si se agregan, es una decisión nueva.
61. No hay `tabular-nums` en contadores, horas ni precios (el código base sí lo usaba en `.price`: `font-variant-numeric: tabular-nums`).
62. Fecha ficticia: los datos suponen hoy martes 6 de octubre de 2026; "Salseros **de jueves**" va a un evento del **viernes** (el nombre es del grupo, no del evento).
63. El texto de "Galería Café Libro" ("Abrimos a las 8:00 p. m. y la clase de baile gratis arranca a las 8:30 p. m.") es la única fuente de la hora de puertas en el Chat y coincide con "Puertas 8:00" de Evento; la hora del plan (8:00 p. m., dato `hour` de e1) coincide con esa hora de puertas y no con la del show ("Show 9:30" en Evento) ni con las 9:00 p. m. de Inicio (H37: hay que decidir una sola).
64. El parche "Clásico capitalino" dice "4 miembros · 2 cupos libres" y Main dice "4 de 6 cupos": es el mismo dato (6 − 4 = 2), presentado distinto; Daniel escribe "Faltan dos cupos" en letras.
65. Por debajo de 900 px la columna oculta queda en `display: none`: en la vista de conversación desaparece el `h1` "Mensajes" (y la región "Tus conversaciones") y la página se queda sin `h1`; en la vista de lista desaparecen la conversación y su `h2`. Con la conversación a pantalla completa de H43, darle un título de nivel 1 (visible u oculto) a esa vista.
66. Al cargar, el separador "3 mensajes nuevos" queda fuera de vista, por encima del borde del historial: con `column-reverse` el historial abre en el último mensaje, no en el primero sin leer. Implementar igual que el prototipo (abrir en el último mensaje); abrir con el separador a la vista sería una decisión nueva que el prototipo no toma.


#### 8.2.8 Perfil

##### Correcciones obligatorias de la auditoría

**Hallazgos del prototipo/diseño que nombran a Perfil:**

- **H46 · El perfil propio se ve como uno ajeno (Media, S–M).**
  - **Qué pasa:** Camila ve "Seguir" y "Mensaje" en su propio perfil y puede seguirse a sí misma (412 → 413). Además, todos los avatares y nombres del producto abren el perfil de Camila (`Perfil.dc.html:43-48`, `:176-181`).
  - **Implementar dos variantes:**
    1. **"Mi perfil"** (`/yo`), sin "Seguir" ni "Mensaje", con: **"Editar perfil"**, **"Mis boletas"**, **"Guardados"** y **"Ajustes y privacidad"** (textos de la auditoría).
       - Propuesta de ubicación, por validar con diseño: "Editar perfil" en el lugar de los dos botones, con el estilo de píldora secundaria (borde #EAE1D8, fondo blanco, 44 px). "Mis boletas", "Guardados" y "Ajustes y privacidad" como accesos visibles bajo la tarjeta o en un menú.
       - "Guardados" puede ser una cuarta pestaña solo en Mi perfil, porque el menú de Inicio ya enlaza "Guardados" al perfil (propuesta).
       - Propuesta de este documento (la auditoría no lo dice): verbos en segunda persona, "Vas" / "Te interesa" / "En parche", como ya hace Inicio con "Vas".
    2. **"Perfil de otra persona"** (`/perfil/:usuario`), con **"Seguir"**, **"Mensaje"** y **"Reportar o Bloquear"** (ver H9). Verbos en tercera persona, como hoy: "Va" / "Le interesa" / "En parche".
  - Cada enlace de avatar o nombre debe llevar al usuario correcto (la auditoría: "tocar a Laura o a cualquier avatar del Chat abre el perfil de Camila"). Los propios (avatar del encabezado, tarjeta de cuenta) van a `/yo`.
  - Propuesta (no está en la auditoría): si el usuario abre `/perfil/<su propio usuario>`, mostrar Mi perfil.
- **H20 · "Mis boletas" no existe (Media, S).**
  - **Qué pasa:** "Ver mis boletas" lleva al Perfil, que no tiene ninguna boleta; la palabra "boleta" aparece 0 veces en esta pantalla.
  - **Implementar:** una pantalla propia "Mis boletas" (no una pestaña del perfil ajeno), accesible desde el menú de Inicio y desde el avatar, con boletas próximas y pasadas, QR a pantalla completa, nombre de cada asistente, estado de las partes de pago, "Transferir" (H32) y "Solicitar devolución" (H27).
  - En Mi perfil, el acceso "Mis boletas" lleva ahí, y "Ver mis boletas" del paso 4 de la compra también.
- **H30 · Se expone dónde y cuándo estará cada persona (Media, M).**
  - **Qué pasa:** el perfil muestra el barrio ("Chapinero") y los próximos planes con fecha, lugar y ciudad a cualquiera (`Perfil.dc.html:44`, `:147-153`).
  - **Implementar:**
    - Ajuste **"Quién ve mis planes"** (amigos, parche o nadie). "Próximos planes" solo se muestra a quien corresponda. Propuesta (no está en la auditoría): quien no tiene permiso ve un estado vacío neutro, sin revelar que hay planes ocultos.
    - **El barrio solo lo ven los amigos.** A los demás se les muestra solo la ciudad: "@camivargas · Bogotá".
    - Sección **"Privacidad y datos"**, con descargar los datos, corregirlos, eliminar la cuenta y revocar la autorización. Se llega desde "Ajustes y privacidad" de Mi perfil.
- **H9 · No hay cómo reportar ni bloquear (Alta, M).**
  - **Qué pasa:** el perfil ajeno solo ofrece "Seguir" y "Mensaje" (`Perfil.dc.html:48`).
  - **Implementar en el perfil de otra persona:**
    - Un menú con **"Reportar"** (con motivos) y **"Bloquear"**. Propuesta: un botón circular de 44 px "Más opciones", con el estilo del ícono de Mensajes del encabezado, junto a "Mensaje".
    - Respetar el ajuste **"Quién puede escribirme y agregarme"** (texto de la auditoría). Propuesta: si la persona no lo permite, "Mensaje" no aparece o se reemplaza.
    - Propuesta (no está en la auditoría): al bloquear, el perfil deja de mostrar planes, recuerdos y reseñas, y desaparecen "Seguir" y "Mensaje".
    - La auditoría también pide "Salir y reportar" en los parches, el ingreso a parches como invitación que se acepta ("Laura te invitó a…") y que el administrador pueda sacar miembros; eso vive en Chat y Evento, no en esta pantalla.
- **H37 · El mismo evento muestra datos distintos según la pantalla (Media, S).**
  - **Contadores:** Perfil dice "Eventos 38" e Inicio dice "Planes 38" (`Perfil.dc.html:54`). Hay que usar **un solo término** en las dos pantallas. Recomendación de este documento (la auditoría no elige): "Planes", como Inicio y la pestaña "Próximos planes". Decisión de producto, que entra en el glosario corto que pide H62.
  - La auditoría además pide para H37: "Un solo bloque de datos de ejemplo, revisado" y "Reseñas solo después del evento y solo de asistentes".
  - **Estado:** Inicio dice "Vas", Perfil dice "Va" y Evento arranca en "Voy".
    - Diferenciar "Voy" de "Tengo boleta", y usar la misma fuente de datos en todas las pantallas.
    - La persona gramatical puede variar ("Vas" en Mi perfil, "Va" en el perfil ajeno), pero el estado debe ser el mismo.
    - Hoy e1 y e3 tienen parche de Camila en Chat e Inicio ("Salseros de jueves" y "Rockeros del Arena"), y aun así el perfil dice "Va" y "Le interesa", no "En parche" (ver "Detalles finos").
- **H61 · Filas sueltas en tableta (Baja, S).**
  - **Qué pasa:** a 768 px "Próximos planes" queda en **3 + 2** (y "Recuerdos" en 3 + 3 + 2).
  - **Implementar** lo que pide la auditoría: "una rejilla automática (`grid auto-fit`) con anchos mínimos pensados para cada bloque". Ojo: con 5 planes, ningún `minmax` razonable llena la fila a 720 px: con 210 px salen 3 columnas, y para 5 columnas cada tarjeta tendría que medir 128 px. `auto-fit` en lugar de `auto-fill` solo cambia algo cuando hay menos tarjetas que columnas, así que por sí solo no evita el 3 + 2.
  - Opciones (propuestas de este documento, no de la auditoría):
    - Una fila con scroll horizontal y `scroll-snap` por debajo de unos 980 px, con tarjetas de unos 220 px y una pista visual de que hay más (degradado o flechas, que H61 también exige para filas cortadas). Es el patrón de carrusel que H44 propone para "Este finde" en celular.
    - Limitar a un múltiplo de columnas con "Ver todos los planes".
  - Elegir una de las dos con diseño. Lo obligatorio es no dejar la fila suelta sin intención.
- **H5 · No se ve quién vende (Alta, S).**
  - **Qué pasa:** Perfil no tiene pie de página.
  - **Implementar:**
    - El **pie legal** común: [RAZÓN SOCIAL], NIT, dirección, teléfono, correo, PQR, enlace a sic.gov.co, Términos y Política de tratamiento, con un único nombre para cada documento.
    - **Acceso a lo legal** "desde el menú o el perfil en Main, Chat y Perfil" (texto de la auditoría). Propuesta de ubicación: en Mi perfil, dentro de "Ajustes y privacidad".

**Hallazgos de "Las 8" pantallas o de patrones que esta pantalla repite:**

- **H35 · Falta la etiqueta viewport (Media, S):** agregar `<meta name="viewport" content="width=device-width, initial-scale=1">`. Perfil es de las que no se desbordan: con la etiqueta, a 320 px `scrollWidth` = 320.
- **H41 · Navegación inconsistente (Media, M):**
  - Usar el **componente único de encabezado con sesión** (variante "detalle"), no esta quinta variante.
  - "Volver" regresa a la pantalla de origen, no siempre a Inicio. Este encabezado repite el problema de `Perfil.dc.html:23`.
  - Un solo margen lateral para todo el producto: Perfil usa 24 px fijos y otras pantallas, `clamp(16px, 4vw, 24px)`.
- **H40 · Encabezado móvil (Media, M):** en celular, encabezado de una fila (56 a 64 px) y **barra inferior** con "Inicio, Agenda, Mapa, Mensajes y Perfil", con Perfil marcado como actual en esta pantalla. Hoy, a 390 px, el encabezado de Perfil ocupa 125 px en 2 filas. No es fijo, así que no tapa contenido (H16 no aplica aquí).
- **H51 · Foco visible (Media, S):** Perfil "no define un estilo de foco propio". Agregar la regla de `Evento.dc.html:19`: `button:focus-visible, a:focus-visible { outline: 3px solid #C23A24; outline-offset: 2px }`. Comprobar que se ve sobre "Seguir" negro (con la separación de 2 px el contorno rojo queda sobre el blanco de la tarjeta) y sobre los mosaicos oscuros de "Recuerdos". La tarjeta y el mosaico tienen `overflow: hidden`, pero el enlace del mosaico es el propio elemento con `overflow`, así que su contorno exterior sí se dibuja.
  - **Ojo con las pestañas (medido en Chromium inyectando esa regla):** el `tablist` tiene `overflow-x: auto`, que obliga a `overflow-y: auto`, y mide lo mismo que las pestañas (48 px). Por eso el contorno de 3 px con separación de 2 px **queda recortado**: no se ven ni el borde de arriba ni el de abajo, y en "Próximos planes" tampoco el izquierdo; solo asoma una barra vertical roja en el hueco de 4 px de la derecha. Lo mismo pasa hoy en Evento (`Evento.dc.html:19` + `:304`). Hay que resolverlo en el componente de pestañas, por ejemplo con `outline-offset: -3px` en las pestañas o dando al `tablist` un relleno interior de 5 px compensado con margen negativo (propuestas; la auditoría no lo menciona).
- **H36 · Todas las tarjetas abren el mismo evento (Media, M):** los 5 títulos, los 8 recuerdos y las 2 reseñas apuntan a `Evento.dc.html`. En producción cada uno va a su `/evento/:ciudad/:slug`. Los eventos pasados de "Recuerdos" necesitan una vista de evento terminado (sin "Comprar"), que no está diseñada.
- **H59 · Semántica (Baja, S),** aplicada por analogía (Perfil no está en la lista de pantallas del hallazgo, pero repite los mismos patrones):
  - Pestañas con el **patrón de pestañas de ARIA**: flechas izquierda y derecha, Inicio y Fin; `tabindex="0"` solo en la seleccionada y `-1` en las demás; `aria-controls` hacia un contenedor `role="tabpanel"` con `aria-labelledby`. La alternativa que acepta la auditoría es usar botones normales sin `role="tab"`.
  - Un **`h3` por tarjeta** de evento (como `.card h3` del código base) y por reseña, y un `h2` visualmente oculto por panel si se quiere navegar por encabezados.
  - Enlace **"Saltar al contenido"**.
- **H42 · Saltos que pierden el contexto (Media, M),** por analogía: "Mensaje" debe abrir la conversación con esa persona, no el Chat en "Salseros de jueves".

**Hallazgos de producción que cambian esta pantalla:**

- **H53 · Modelo de datos único:** el perfil tiene una copia parcial de los eventos (`Perfil.dc.html:148`). En producción, los planes, recuerdos y reseñas salen de la base de datos. De la lista de entidades de la auditoría aplican **usuario**, **seguidores**, **lugar** y **ciudad**, **evento** (con zona America/Bogota), **parche**, **reporte** y **bloqueo**. **Ojo:** la lista de la auditoría **no** incluye una entidad de **asistencia o interés** ("Va", "Le interesa", "En parche") ni de **reseña** (con calificación y "útil"); esta pantalla las necesita, así que hay que agregarlas al modelo. Las fechas ("oct", "Sep 2026") se calculan con zona America/Bogota; la auditoría pide calcular las fechas relativas con la hora del servidor.
- **H12 · Cuentas** (por analogía: H12 no nombra a Perfil): "Editar perfil" y "Seguir" deberían exigir sesión verificada, y los cambios del perfil guardarse en el servidor.
- **H13 · Chat con moderación:** "Reportar" y "Bloquear" del perfil alimentan el panel de moderación. "Mensaje" abre una conversación real con permisos.
- **H11 · Boletas con QR por asistente** (H11 nombra a Perfil entre las pantallas afectadas): una boleta con QR por asistente ("Boleta 1 de 2", con el nombre de cada titular), firmado y de un solo uso. Se muestran en "Mis boletas" (H20), accesible desde Mi perfil. Que nunca aparezcan en el perfil que ven otros es una deducción de este documento (H30, Ley 1581), no un texto de la auditoría.
- **H47 · Paginación,** por analogía: "Recuerdos" y "Reseñas" crecerán sin tope (38 eventos según la estadística). Paginar desde el servidor con "Cargar más", o con el patrón de Bienvenida "Ver N … más".
- **H57 · Rendimiento:** portada, avatar y fotos de eventos en AVIF o WebP, con varios tamaños y dimensiones fijas. Los altos ya están definidos: portada de 200 px, foto de tarjeta 4:3 y mosaico 1:1. Carga diferida para todo lo que está debajo de la tarjeta de perfil.
- **H17 · Estados de carga y error:** esqueletos de la tarjeta de perfil y de cada panel, y error con "Reintentar".
- **H54 · Notificaciones:** si "Seguir" genera un aviso a la persona seguida, debe respetar las preferencias de notificación. El prototipo no lo define.


##### Detalles finos

**Microcopys, textos y signos:**

- "Siguiendo" aparece **dos veces**: como texto del botón (al seguir) y como etiqueta de la estadística "Siguiendo 289". Con control por voz, "clic en Siguiendo" es ambiguo. Considerar un nombre accesible más explícito para el botón, p. ej. `aria-label="Siguiendo a Camila"`, que empiece por el texto visible (H59).
- El separador es siempre " · " (espacio, punto medio U+00B7, espacio) en el @usuario, en los lugares, en los recuerdos y en el pie de las reseñas. Dentro de `v`, el lugar ya trae su propio " · " ("Galería Café Libro · Zona T"), así que el texto final tiene dos ("Galería Café Libro · Zona T · Bogotá").
- Los marcadores llevan corchetes: "[Foto de portada]" y "[Foto del evento]". **No se publican con corchetes:** en producción, `alt` real o `alt=""`.
- "oct" está escrito en minúscula en la plantilla y se ve "OCT" por CSS. Algunos lectores pueden deletrear "O-C-T". Mejor usar `<time datetime="2026-10-09">`, con un texto accesible como "9 de octubre", y dejar las mayúsculas solo visuales.
- Los meses de Recuerdos y Reseñas usan abreviatura propia: "Sep", "Ago", "Jul", "Jun", "May", "Abr", "Mar" y "Feb", con mayúscula inicial y sin punto. `Intl.DateTimeFormat('es-CO', { month: 'short' })` da "sept." en minúscula. Para igualar el diseño hace falta un formateador propio o aceptar el cambio. Decidirlo y usarlo igual en todo el producto.
- "personas lo encontraron útil" está fijo en plural. Con 1 debe decir "1 persona lo encontró útil", y con 0 conviene ocultar el texto. El prototipo no maneja el singular.
- La calificación es solo texto ("4 de 5", #8A5A00, sin estrellas). En Inicio, la reseña de Juan Pablo muestra **5 estrellas SVG rellenas #E0A21B** con `role="img" aria-label="Calificación 5 de 5"` (`Main.dc.html:196-203`). Hay que unificar en un componente "Calificación". Mínimo: que el texto accesible diga "Calificación 4 de 5" y no solo "4 de 5". Se usa #8A5A00 y no #E0A21B porque es texto pequeño y necesita 4,5:1.
- El @usuario y la ubicación van en la misma línea y el mismo `<p>`. Separarlos en datos permite ocultar el barrio (H30) sin rehacer la línea.

**Valores por defecto y orden:**

- La pestaña inicial siempre es "Próximos planes". Los enlaces "Recuerdos" y "Guardados" del menú de Inicio deberían abrir su pestaña o vista, y hoy no lo hacen.
- "Seguir" arranca apagado: `follow: false` y 412 seguidores.
- Órdenes: planes por fecha ascendente; recuerdos y reseñas por fecha descendente. Estadísticas en el orden Eventos, Ciudades, Seguidores, Siguiendo, Parches. Gustos en el orden en que los guardó el usuario.
- Los únicos números calculados son Seguidores (`412 + follow`), los textos de lugar y las etiquetas de los recuerdos. Los demás son fijos: "Ciudades 5" no se puede deducir de los datos de ejemplo (que solo cubren Bogotá, Medellín y Barranquilla) y "Parches 7" no coincide con los 3 parches que lista Inicio. Es aceptable en datos de muestra, pero en producción deben ser conteos reales.

**Truncados, ajuste de línea y números:**

- No hay ningún `text-overflow: ellipsis`, `line-clamp` ni `white-space: nowrap`, salvo en las pestañas. Los títulos largos de evento y de lugar hacen salto de línea completo: a 1280 px casi todas las tarjetas tienen título y lugar en 2 líneas. Con nombres reales más largos las tarjetas crecerán: decidir si se limita a 2 líneas con `line-clamp`. Hoy no se limita.
- El bloque del nombre tiene `min-width: 0`, así que un nombre muy largo se parte en varias líneas en lugar de desbordar. Por debajo de 349 px "Camila Vargas" ya ocupa 2 líneas.
- No hay `tabular-nums` en las estadísticas; el código base sí lo usa en precios. Agregarlo para que 412 → 413 no cambie de ancho.
- La biografía tiene `max-width: 56ch` (575,4 px). No crece más aunque haya espacio, y por eso las estadísticas quedan "flotando" en el centro a 1280 px, sin alinearse con los botones de la derecha.

**Capas, sticky y overflow:**

- No hay `z-index` en ninguna parte. El avatar se monta sobre la portada solo por orden del DOM y por el margen negativo (−64 px); no lleva `position`. Si en producción la portada tiene `position: relative` o una imagen con `z-index`, el avatar puede quedar debajo: darle `position: relative; z-index: 1`.
- El `overflow: hidden` de la tarjeta de perfil recorta la portada a las esquinas de 28 px. El avatar no se recorta porque está dentro de la tarjeta, debajo del borde superior.
- La insignia "3" sobresale 3 px por fuera del círculo de Mensajes (`top/right: -3px`). Si el contenedor del encabezado tuviera `overflow: hidden`, se cortaría.
- La fila de pestañas tiene `overflow-x: auto`. En Chromium con barras de desplazamiento clásicas (Windows), a menos de 415 px aparece una barra horizontal visible bajo las pestañas, que suma alto. En macOS y en móvil la barra es superpuesta y no se ve, y "Reseñas" queda cortada **sin pista**. Corregirlo con H61 en mente:
  - Opción mínima: reducir el `padding` horizontal de las pestañas a 10 px por debajo de 420 px. Las 3 pasan a medir 330,8 px en total, así que caben desde 379 px de ventana (342 px útiles a 390). Por debajo de 379 px seguiría haciendo falta el scroll con pista.
  - Otra opción: degradado y flechas.

  Esto es una sugerencia; la auditoría no menciona estas pestañas en concreto.
- El `overflow-x: auto` de la fila de pestañas recorta cualquier contorno de foco exterior de las pestañas (ver H51 en "Correcciones obligatorias"): el anillo de foco tiene que ir hacia dentro o el contenedor necesita relleno.
- El subrayado de la pestaña activa (3 px, `border-bottom`) se dibuja sobre la línea base de 1 px, que es un `box-shadow` interior del `tablist`. Si se implementa la línea base como `border-bottom` del contenedor, el subrayado quedará 1 px por encima de ella.

**Comportamientos que solo se ven en un estado:**

- **Salto al seguir en tableta:** entre 754 y 779 px de ancho, pulsar "Seguir" baja "Siguiendo" y "Mensaje" a otra línea (+60 px de alto). Para evitarlo, dar al botón un ancho mínimo que quepa "Siguiendo" (117,3 px; p. ej. `min-width: 118px`) o reservarlo con `inline-grid` y los dos textos superpuestos. Es una recomendación, el prototipo no lo hace.
- **Recuerdos en celular:** 8 cuadrados de 342 px suman casi 3000 px de scroll. Si se pagina (H47), empezar con 4 o 6.
- **Hover del mosaico:** no tiene ningún efecto visible. Si se agrega uno (p. ej. aclarar la franja), que no dependa solo del color.
- **Fecha y estado dentro de la foto:** van dentro del `div role="img"`. Chromium los expone, pero según ARIA los hijos de `img` son presentacionales, y VoiceOver o Safari pueden no leer "9 OCT" ni "Va". En producción, ponerlos como hermanos de la imagen y no como hijos.
- **Nombre de los mosaicos:** el `aria-label` de cada recuerdo reemplaza al texto visible. axe lo marca porque el texto visible no está literalmente dentro del nombre. Basta con quitar el `aria-label` y dejar que el nombre salga del contenido, o usar `aria-label="Techno hasta el amanecer, Bogotá, Sep 2026"`, que empiece por el título visible.
- **Avatar leído como texto:** el lector anuncia "CV" como texto suelto antes del `h1`. En producción, foto con `alt=""` o iniciales con `aria-hidden="true"`, porque el nombre ya está en el `h1`.

**Inconsistencias con otras pantallas:**

- **Estado de los planes frente a los parches:**
  - Según Chat (`Chat.dc.html:609`, `:675`) e Inicio ("Tus parches"), Camila es miembro de "Salseros de jueves" (e1) y de "Rockeros del Arena" (e3), pero el perfil dice e1 "Va" y e3 "Le interesa". Solo e4 (Clásico capitalino) dice "En parche".
  - Además, "Va", "Le interesa" y "En parche" no son excluyentes: se puede ir y estar en parche.
  - Definir con producto una regla de prioridad (p. ej. "En parche" > "Va" > "Le interesa") o mostrar el parche como una marca aparte.
  - "Tu semana" de Inicio cuenta e1, e2 y e4 como "3 planes confirmados" ("parche de 4" para el clásico), lo que coincide con "Va", "Va" y "En parche" del perfil.
- **Botón Seguir:** el mismo patrón de colores existe en 4 pantallas con 4 tamaños distintos: Perfil 44 px (`0 22px`, `.92rem`), Registro 40 px (`0 16px`, `.84rem`, `Registro.dc.html:99`), Evento 38 px (`0 14px`, `.82rem`, `Evento.dc.html:393`) e Inicio 36 px (`0 14px`, `.8rem`, `Main.dc.html:295`). Solo Evento pone `type="button"`. Hacerlo un componente con tamaños.
- **Pestañas:** son idénticas a las de Evento (`aria-label="Parches y muro"` en su `tablist`), pero Evento sí pone `type="button"` y `role="tabpanel"` con `aria-label` en cada panel ("Parches" y "Muro", `Evento.dc.html:311` y `:330`). Perfil no tiene ninguno de los dos.
- **Encabezado:** Perfil es la única pantalla con sesión que no tiene encabezado fijo, avatar, campana ni íconos de Inicio y Agenda. Su grupo de acciones queda a la izquierda cuando baja a la segunda fila, mientras que el `<nav>` de Evento (con `margin-left: auto`) queda a la derecha.
- **Logo:** 1.55rem aquí y en la app con sesión (Main, Agenda, Mapa, Evento, Chat); 1.6rem en Bienvenida, Registro y el código base.
- **Tarjeta de plan frente a `.card` del código base:**
  - Fecha con `min-width: 44px` (46 px en `.date`), día de 1.2rem (1.25rem) y mes de .64rem (.66rem).
  - Título como `<a>` en lugar de `h3` y sin `text-wrap: balance`.
  - Se perdió el hover de tarjeta: `transform: translateY(-3px)` con sombra `0 12px 28px rgba(23,18,15,.10)`, en 200 ms `ease-out`, desactivado con `prefers-reduced-motion`.

  Si se recupera el hover en el componente único de tarjeta, incluir también aquí la regla de movimiento reducido.
- **Contadores de Inicio:** la tarjeta de cuenta dice "Planes 38 · Seguidores 412 · Siguiendo 289". Al pulsar "Seguir" en el perfil, Inicio no cambia: en el prototipo cada pantalla tiene su propio estado. En producción, un solo dato.
- **Destinos que hoy caen en el Perfil por error:** "Ver las 128 fotos" (galería del evento), "Ver mis boletas" (Mis boletas) y "Ver perfil del organizador" (perfil de organizador). No reproducir esos enlaces apuntando al perfil del usuario.
- **Bordes de bajo contraste:** el borde #EAE1D8 de "Mensaje", "Mapa" y el círculo de Mensajes da 1,21:1 sobre #FBF7F3 y 1,29:1 sobre #FFFFFF. No incumple, porque el texto o el ícono identifican el control, pero la auditoría (H52) recomienda #857870 para los bordes de controles cuando importa que el borde se vea.
