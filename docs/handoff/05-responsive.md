[← Índice del handoff](README.md)

## 5. Comportamiento responsive

### 5.1 Principios comunes

- **Layouts fluidos, sin ancho fijo:**
  - contenedor de `max-width: 1240px`, centrado, con `padding-inline: 24px` (16 px en celular);
  - columnas con `flex-wrap` y bases `flex: 999 1 560px` para el contenido principal y `flex: 1 1 280–380px` para las laterales, de modo que **las laterales se apilan solas** cuando no caben;
  - rejillas con `repeat(auto-fill, minmax(250–260px, 1fr))`.
- **Tres anchos de referencia** (las capturas en `diseno/capturas/` están a estos anchos):
  - **390 px:** celular, una columna.
  - **768 px:** tablet, laterales apiladas o 2–3 columnas de tarjetas.
  - **1280 px:** escritorio, 3 columnas en Inicio, 2 en Evento, Mapa y Chat, y 4 tarjetas por fila en Agenda.
- **Filas de chips:** hacen scroll horizontal y ocultan la barra de scroll. La auditoría pide una pista visual de que hay más (H61).
- **Barras fijas:**
  - el encabezado es `position: sticky; top: 0`;
  - en Evento, la tarjeta de compra es `sticky` en escritorio y se vuelve **barra inferior fija** por debajo de 980 px;
  - el checkout es un panel lateral `fixed` y en celular ocupa toda la pantalla.
- **Correcciones obligatorias** (la sección 5 de cada pantalla da el detalle):
  - etiqueta `<meta name="viewport" content="width=device-width, initial-scale=1">` en todas (H35);
  - `min-width: 0` donde haya hijos flex con texto largo, para eliminar el scroll horizontal en Chat y Bienvenida (H8);
  - en celular, que el encabezado no ocupe más de unos 64 px y que la navegación pase a una barra inferior (H40);
  - que el feed aparezca antes de la columna lateral en Inicio (H15);
  - que el checkout funcione con zoom al 200 % y con el celular en horizontal (H6);
  - que el chat abra en el último mensaje (H43);
  - en el mapa, que al tocar una ciudad se muestre el resultado (H42).

### 5.2 Por pantalla

#### 5.2.1 Bienvenida

**Mecanismo:** el archivo NO tiene `@media` ni `@container` en reglas. Todo el responsive sale de `flex-wrap` con `flex-basis`, de `grid` con `auto-fit`/`auto-fill` + `minmax`, de `clamp()` con `vw` y de unidades `cqw` dentro del mini-mapa (`container-type: inline-size`). Por eso los "puntos de quiebre" son emergentes. Medidos píxel a píxel en Chromium:

| Ancho de ventana | Qué cambia | Regla que lo produce |
|---|---|---|
| < 473 px | La página se desborda: mide 473 px de ancho (H8). | `role="search"` sin `min-width: 0` (mínimo de contenido 449 px) + `label` con `flex-shrink: 0`. |
| < 484 px | "Contenido de ejemplo" baja debajo del título de Noticias. | `flex-wrap` de la cabecera. |
| 548 px | "Cómo funciona" pasa de 1 a 2 columnas. | `repeat(auto-fit, minmax(240px, 1fr))`, gap 20. |
| 554 px | Encabezado de 215 → 184 px (la nav cabe en una línea). | `flex-wrap` de la nav. |
| 570 px | Agenda pasa de 1 a 2 columnas. | `repeat(auto-fill, minmax(250px, 1fr))`, gap 22. |
| 583 px | Los dos CTA del héroe quedan en una fila. | `flex-wrap`, 227 + 22 + 228 px. |
| 634 px | El h1 empieza a crecer desde 36,8 px. | `clamp(2.3rem, 5.8vw, 4.9rem)`. |
| 650 px | Encabezado de 184 → 134 px (logo y buscador en la misma fila; nav en la segunda, alineada a la derecha). | `flex-wrap` + `margin-left: auto` de la nav. |
| 674 px | Noticias: destacada y lista lado a lado. | `flex: 1.25 1 320px` + `flex: 1 1 280px` + gap 24. |
| 689 px | Cabecera de Agenda: título y enlaces en la misma fila. | `flex-wrap` + `space-between`. |
| 796 px | Bloque Mapa: texto y mini-mapa lado a lado (el mini-mapa se encoge de 400 a 280 px y los pines a 20 px). | `flex: 1 1 340px` + `flex: 1 1 280px` + gap 48 + `padding: clamp(28px,5vw,56px)`. |
| 808 px | "Cómo funciona" pasa a 3 columnas. | `auto-fit`. |
| 818 px | Bloque Únete: texto y botones lado a lado. | `flex: 1 1 380px` + `flex: 1 1 280px` + gap 28. |
| 842 px | Agenda pasa a 3 columnas. | `auto-fill`. |
| ~858 → ~1062 px | El mini-mapa crece de ~308 a 400 px y sus pines de 20 a 26 px (rótulos de 9,92 a 11,2 px). | `clamp(…cqw…)` con `container-type: inline-size`. |
| 931 px | Pie en una sola fila. | `flex-wrap` + `space-between`. |
| 964 px | Los chips de categoría caben sin scroll. | Contenido de 916 px. |
| 1114 px | Agenda pasa a 4 columnas (máximo posible). | `auto-fill`. |
| 1180 px | Encabezado en una sola fila (78 px). | `flex-wrap` del encabezado. |
| 1352 px | El h1 llega a su tope de 78,4 px. | `clamp`. |
| Siempre | La fila de chips de ciudad hace scroll horizontal (1604 px de contenido). | `overflow-x: auto`. |

**A 390 px (celular)** — confirmado con `Bienvenida-390.jpg` (la captura mide 473 px de ancho por el desborde):
- Encabezado fijo de 215 px (25 % de una pantalla de 844): fila 1 logo; fila 2 buscador de 449 px que se sale de la pantalla (el selector "Toda Colombia" queda entre x = 296 y 418, cortado por el borde de la pantalla en x = 390, y el botón "Buscar" entre x = 428 y 468, totalmente fuera de la vista); filas 3 y 4 la nav ("Cómo funciona · Mapa Nuevo · Agenda" y "Entrar · Crear cuenta").
- Héroe 342 × 677: padding lateral 22 px, h1 de 36,8 px con la tercera línea partida en 3 ("AL / CONCIERTO / DEL SÁBADO"), CTA apilados (botón blanco y debajo el enlace subrayado) y prueba social en 3 líneas.
- "Cómo funciona" en 1 columna (tarjetas de 242, 194 y 218 px de alto).
- Mapa apilado: texto, CTA de 275 × 54 con el resumen "19 planes este finde en 11 ciudades" debajo, y mini-mapa de 286 × 385 con pines de 20 px que se enciman en la costa y en Bogotá/Villavicencio (H60).
- Noticias apiladas (destacada y luego la lista).
- Agenda: título; "Ver en el mapa" y "Ver toda la agenda" en una fila; dos filas de chips con scroll horizontal; tarjetas en 1 columna de 342 × 442 px. El primer "Comprar" aparece en y = 4623 (5,5 pantallas, H44).
- Únete apilado con botones de ancho completo; pie apilado en 3 líneas (el "©" en una y el texto de compra segura partido en dos). Alto total de la página: 8752 px.

**A 768 px (tableta)** — confirmado con `Bienvenida-768.jpg`:
- Encabezado de 134 px: logo + buscador de 544 px en la fila 1 y la nav en la fila 2, alineada a la derecha.
- Héroe 720 × 562, h1 de 44,5 px, CTA en una fila.
- "Cómo funciona" en 2 + 1 (la tercera tarjeta sola, H61).
- Mapa apilado con el mini-mapa centrado de 400 × 538 y pines de 26 px.
- Noticias lado a lado (374 + 322 px).
- Agenda con cabecera en una fila, chips con scroll (ciudades cortadas en "Cart…"; categorías cortadas en "D…") y tarjetas en 2 columnas de 349 px.
- Únete apilado (botones de 360 px a la izquierda); pie en 2 líneas. Alto total 5934 px.

**A 1280 px (escritorio)** — confirmado con `Bienvenida-1280.jpg`:
- Encabezado en una fila de 78 px.
- Héroe 1232 × 693, h1 de 74,24 px.
- "Cómo funciona" en 3 columnas de 397 px.
- Mapa en 2 columnas (texto 672 px + mapa 400 × 538).
- Noticias 659 + 549 px.
- Agenda en 4 columnas de 291,5 px; la fila de ciudades oculta Villavicencio, Pasto y Leticia (372 px) sin pista visual; las categorías caben.
- Únete en 2 columnas; pie en una fila. Alto total 4421 px.

**Barras fijas:** solo el encabezado (`sticky`, `z-index: 5`). No hay barra inferior. No hay elementos ocultos por ancho (nada usa `display: none`); lo único que "se oculta" es lo que queda fuera de las filas de chips con scroll.


#### 5.2.2 Registro

- **Breakpoints del archivo:** ninguno. No hay `@media` ni `@container`. Todo el cambio de layout sale de `flex-wrap: wrap` en `<main>`, con bases de `340px` (panel) y `420px` (tarjeta) más `gap: 24px`, y de los `clamp()`:
  - **Corte de dos columnas a una:** 340 + 24 + 420 = 784 px de contenido, más 48 px de padding lateral = **832 px** de ventana. Verificado: a 831 px se apilan (panel de 783 px de ancho arriba y tarjeta abajo); a 832 px quedan lado a lado (340 y 420 px). Por encima, el espacio sobrante se reparte 1 : 1,3 (a 1280 px: 535 y 673 px).
  - `padding` del panel `clamp(28px, 4vw, 48px)`: 28 px hasta 700 px; 48 px desde 1200 px.
  - `padding` de la tarjeta `clamp(24px, 4vw, 48px)`: 24 px hasta 600 px; 48 px desde 1200 px.
  - Tamaño del h1 `clamp(2rem, 4vw, 3.2rem)`: 32 px hasta 800 px; 51,2 px desde 1280 px.
  - Encabezado `flex-wrap: wrap`: a 360 px o menos "¿Ya tienes cuenta? Entrar" baja a una segunda línea (100 px de alto).
  - Filas de acciones de los pasos 2 y 3 (`flex-wrap: wrap; justify-content: space-between`): en el paso 2, a 360 px y 320 px, "Continuar" baja a una segunda línea y queda **alineado a la izquierda** (x = 49; un solo ítem en la línea con `space-between`). En el paso 3, a 360 px "Atrás" e "Ir a mi feed" siguen en una línea; solo a 320 px "Ir a mi feed" baja a la segunda línea, también alineado a la izquierda. A 390 px todo cabe en una línea: "Atrás" en x = 49, "0 elegidos" en x = 119, "Continuar" en x = 207.
  - A 320 px también se parte "TU PRÓXIMO" (el titular queda en 5 líneas y el panel crece a 428 px, por encima de su `min-height` de 420) y el h2 "Crea tu cuenta" ocupa 2 líneas (64 px). A 360 px los chips quedan en 6 filas de 2 y el motivo de Galería Café Libro ocupa 3 líneas (fila de 88 px).
- **Móvil, 390 px (captura `Registro-390.jpg`):** una columna, márgenes laterales de 24 px. Encabezado de 66 px. Panel oscuro de 342 × 420 px (y = 74 a 494) con la etiqueta, el titular en 4 líneas ("TU PRÓXIMO / PLAN / EMPIEZA / AQUÍ") y los 3 pasos. La tarjeta empieza en y = 518. El primer campo está en y = 787, "Continuar" termina en y = 1099 y el texto legal está en y = 1117 (fuera de los 844 px de la primera pantalla). Alto total: 1243 px (paso 1), 1200 px (paso 2) y 1299 px (paso 3). Sin scroll horizontal (`scrollWidth` = 390; también a 320 y 360 px). Chips en 6 filas. En el paso 3 los motivos de Sofía, María F. y Galería ocupan 2 líneas.
- **Tableta, 768 px (captura `Registro-768.jpg`):** una columna; el panel ocupa todo el ancho (720 × 420 px), con el titular en 3 líneas y una gran zona vacía a la derecha donde se ven las manchas de color. Tarjeta de 720 px; campos y botones de 657 px de ancho; el texto legal cabe en una línea. Chips en 2 filas de 6. En el paso 2 la página mide 1024 px (cabe en la pantalla).
- **Escritorio, 1280 px (captura `Registro-1280.jpg`):** dos columnas (panel de 535 px, tarjeta de 673 px), ambas de 690 px de alto en el paso 1. En el panel, con `justify-content: space-between`, la etiqueta queda arriba, el titular en el centro (51,2 px, "PLAN EMPIEZA" en 2 líneas) y los pasos abajo. Todo el formulario cabe en 900 px de alto. Chips en 3 filas (5 + 5 + 2).
- **Más de 1288 px:** el encabezado y el `<main>` se centran con `max-width: 1240px` de contenido.
- **Fijos, ocultos, scroll horizontal:** no hay nada sticky ni fixed, nada se oculta en ningún ancho y no hay scroll horizontal.


#### 5.2.3 Inicio (feed)

**En el archivo no hay `@media` ni `@container`.** Todos los cambios salen de `flex-wrap`, las bases `flex` y los `max-width` de las columnas y del buscador. Los umbrales se midieron en Chromium recorriendo de 300 a 1500 px en pasos de 2 px (ancho de ventana sin barra de scroll):

| Elemento | Regla que lo produce | Umbrales medidos |
|---|---|---|
| Columnas | `aside 1 1 220px (max 260)` + `section 999 1 520px` + `aside 1 1 280px (max 340)` con `gap: 24px` y 24 px de padding | **≥ 1116 px:** 3 columnas (220 + 24 + 520 + 24 + 280 = 1068 de contenido). **812–1114 px:** 2 columnas (izquierda de 220 + feed); "Descubre" baja a una segunda línea **después de todo**, alineada a la izquierda, con 340 px de ancho (a 1024 px queda debajo del feed, H15). **≤ 810 px:** 1 columna en el orden del código: "Tu cuenta" (260 px, alineada a la izquierda), feed (100 %) y "Descubre" (340 px). **≥ 1288 px:** el contenido se centra con 1240 px máximo. |
| Encabezado | `flex-wrap` del contenedor + `flex: 1 1 260px; max-width: 500px` del buscador + `margin-left: auto` y `flex-wrap` de la navegación | **≥ 908:** 1 fila, 69 px. **482–906:** 2 filas (logo + buscador / navegación a la derecha), 125 px. **454–480:** 3 filas (logo + buscador / íconos + "Crear evento" / avatar), 171 px. **432–452:** 4 filas (logo / buscador / íconos + "Crear evento" / avatar), 220 px. **≤ 430:** 4 filas (logo / buscador / 5 íconos / "Crear evento" + avatar), 224 px. |
| Evento adjunto | `flex: 1 1 180px` + `flex: 2 1 260px` (con 32 px de padding) en un contenedor `flex-wrap` | Lado a lado si el feed mide ≥ 512 px (ventana ≥ 560 px en 1 columna; siempre en 2 y 3 columnas). Debajo, apilado: foto arriba (100 % × 150 px) e información abajo. |
| Compositor | `flex-wrap` de la fila de acciones + `margin-left: auto` en "Publicar" | 1 fila con feed ≥ 636 px (ventana 684–810, 928–1114 o ≥ 1232); 2 filas con feed 344–635 (ventana 392–683, 812–927 o 1116–1231); 3 filas con ventana 314–391; 4 filas por debajo. |
| Pestañas | `flex-wrap` | 1 fila con feed ≥ 450 px (ventana ≥ 498 en 1 columna); 2 filas por debajo. |
| Bloque de parche | `flex: 1 1 200px` + botón en contenedor `flex-wrap` | Botón al lado de la barra con feed ≥ 426 px (ventana ≥ 474); debajo y alineado a la izquierda por debajo. |
| Fila "N van · 3 amigos" + "Voy" | `flex-wrap` + `space-between` | Misma línea con feed ≥ 320 px (ventana ≥ 368); el botón baja por debajo. |
| Franja de ciudad | `flex-wrap` + `space-between` | Una fila a 1280; dos filas (texto / botones) a 390. |
| Historias | `overflow-x: auto` | Siempre con scroll horizontal (738 px de contenido; el feed máximo es 692 px). |
| Menú lateral | Columna de 220 px | "Mapa de eventos" ocupa dos líneas cuando la columna mide 220 px (≥ 812 px); una línea con 260 px. |
| Botón "Ver qué pasa en todo el país" | `min-height: 44px` + texto centrado | Dos líneas con tarjeta de 280 px (≥ 1116) o en ventanas < 334 px; una línea en el resto. |
| Desborde horizontal de la página | `min-width: 0` en el buscador y en el feed | **Ninguno** entre 300 y 1500 px. |
| Barras fijas | `position: sticky` en el encabezado | Solo el encabezado (z-index 5). Las columnas laterales no son fijas. No hay barra inferior. |

**A 390 px (celular), confirmado con `Main-390.jpg`:**
- Encabezado de 224 px en 4 filas: "fulleventos"; buscador de 342 px con el placeholder cortado ("Busca planes, g") y "Toda Colombia" a la derecha; los 5 íconos alineados a la derecha; "Crear evento" + avatar "CV" a la derecha.
- Debajo, en una sola columna:
  - la tarjeta de perfil, el menú y "Tus parches", de 260 px de ancho y con 82 px vacíos a la derecha;
  - las historias (3 y media visibles), en y = 978;
  - el compositor (342 × 214, acciones en 3 filas);
  - las pestañas en 2 filas;
  - la primera publicación en **y = 1443** (1,7 pantallas de 844 px de alto, H15). Las publicaciones tienen el evento apilado (foto de 302 × 150 arriba), los títulos en 2 líneas y el botón del parche debajo de la barra;
  - al final, "Descubre" (340 px): "Tu semana", el mini-mapa (marco de 240 px), "Gente con tus gustos", "Tendencias en Colombia" y el texto legal.
- Alto total: 6224 px.

**A 768 px (tableta), confirmado con `Main-768.jpg`:**
- Encabezado de 125 px en 2 filas: logo + buscador de 500 px / navegación a la derecha.
- Una columna:
  - perfil, menú y parches de 260 px, con 460 px vacíos a la derecha;
  - el feed a 720 px desde y = 879: historias (con "Dani" cortado 18 px), compositor en una fila, pestañas en una fila y publicaciones con el evento lado a lado (foto de 249 px). La primera publicación está en **y = 1209**;
  - después del feed, "Descubre" con 340 px de ancho y 380 px vacíos a la derecha.
- Alto total: 4771 px.

**A 1280 px (escritorio), confirmado con `Main-1280.jpg`:**
- Encabezado de 69 px en una fila.
- Tres columnas de 220, 684 y 280 px.
- Primera publicación en y = 423.
- "Mapa de eventos" del menú en dos líneas; botón del mini-mapa en dos líneas.
- "Gente con tus gustos" con nombres y motivos partidos.
- Alto total: 2519 px.

**Entre 812 y 1115 px (tableta horizontal y portátil pequeño):** columna izquierda de 220 px + feed; "Descubre" aparece solo al final, debajo de todo.

Los cambios que la auditoría exige para celular y tableta (feed primero, barra inferior, encabezado de una fila) están en "Correcciones obligatorias" (H15, H40).


#### 5.2.4 Agenda

**Reglas que hacen el cambio** (no hay `@media` ni `@container` en el archivo):
- Encabezado: `flex-wrap: wrap` con `gap: 12px 20px`, buscador `flex: 1 1 260px; max-width: 500px; min-width: 0`, navegación `margin-left: auto; flex-wrap: wrap; justify-content: flex-end; gap: 6px`.
- Cabecera de la página: columna de título `flex: 1 1 420px`; controles `flex-wrap: wrap; gap: 10px`; h1 `clamp(1.9rem, 3.6vw, 2.8rem)`.
- Filas de chips: `overflow-x: auto` + `flex-shrink: 0` (desplazamiento horizontal, nunca se parten en 2 líneas).
- Línea de resultados y pie: `flex-wrap: wrap`.
- Rejilla: `repeat(auto-fill, minmax(260px, 1fr))`.
- Ventana: `max-width: 520px` + `padding: 16px` de la capa.

**Puntos de quiebre medidos (ancho de ventana):**

| Elemento | Comportamiento por ancho |
|---|---|
| Encabezado | ≥ 907 px: una fila (logo, buscador, navegación), 69 px de alto. 482–906 px: logo + buscador arriba y la navegación completa abajo, alineada a la derecha, 125 px. 453–481 px: logo + buscador arriba; navegación abajo en 2 filas (el avatar baja solo), 171 px. 432–452 px: logo, buscador y navegación en 3 bloques, con el avatar solo en la última fila, 220 px. < 432 px: logo / buscador a todo el ancho / 5 íconos (alineados a la derecha) / "Crear evento" + avatar, **224 px** |
| Título y controles | ≥ 984 px: controles a la derecha del título, alineados abajo. < 984 px: controles debajo de la bajada |
| Vista + Fecha | ≥ 548 px: en la misma fila. < 548 px: una debajo de la otra (10 px de separación) |
| h1 | 30,4 px hasta 844 px; crece con `3.6vw` hasta 44,8 px desde 1245 px |
| Fila de ciudades | Siempre con desplazamiento horizontal (1604 px de contenido) |
| Fila de categorías | Cabe completa desde 947 px; por debajo, desplaza |
| Línea de resultados | ≥ 514 px: una fila con el enlace a la derecha. < 514 px: el enlace baja a otra línea |
| Rejilla | 1 columna < 590 px; 2 de 590 a 871; 3 de 872 a 1153; 4 desde 1154 |
| Pie | ≥ 931 px: los dos textos en una fila. < 931 px: uno debajo del otro |
| Contenedor | Centrado con `max-width: 1240px` desde 1288 px (a 1440 el contenido empieza en x = 100) |
| Desborde horizontal | **< 334 px**: el selector de fecha (309,5 px, no se encoge ni hace salto de línea) desborda: 14 px a 320 px (H8) |

**A 390 px (celular, captura `Agenda-390.jpg`, 390 × 11.110 px):** el encabezado fijo ocupa 224 px (26,5 % de una pantalla de 844 px): logo; buscador de 342 px donde el campo mide 127 px y el placeholder se lee "Busca eventos,"; 5 íconos alineados a la derecha; "Crear evento" + avatar. Debajo: eyebrow, h1 en 2 líneas ("Este finde en / Colombia"), bajada en 4 líneas, selector "Lista / Mapa" y, debajo, "Hoy / Este finde / Próxima semana". Las dos filas de chips se desplazan de lado (a la vista solo "Toda Colombia 19", "Bogotá 6" y el borde de "Medellín"; "Para ti", "Lo que repostea tu gente" y el borde de "Rumba"). "19 planes en 11 ciudades este finde" y, debajo, "Ver todos los planes en el mapa". Una columna de 19 tarjetas de 342 × 510 px (531 px las de título en 2 líneas): la rejilla sola mide 10.132 px medidos en este handoff (la auditoría, en H47, da 9.732 px para "la lista sola"; esa cifra no se reprodujo, pero el total de 11.110 px sí coincide). Pie en 3 líneas. El aviso de repost mide 342 × 119 px con "…en tu feed." (2 líneas de texto) y 342 × 141,5 px con "…en el parche Salseros de jueves." (3 líneas); en ambos casos "Ver en mi feed" y la X bajan a una segunda fila. La ventana de repost mide 358 × 616 px y cabe en 844 px de alto.

**A 768 px (tableta, captura `Agenda-768.jpg`, 768 × 6089 px):** encabezado de 125 px en 2 filas (logo + buscador de 500 px; navegación a la derecha). h1 en una línea a 30,4 px, bajada en 2 líneas, "Lista / Mapa" y el selector de fecha en una sola fila debajo. Chips cortados a la derecha ("Cart…", "Dep…") sin pista visual (H61). Línea de resultados en una fila. Rejilla de 2 columnas de 349 px (tarjetas de 515,5 / 536,5 px); la última tarjeta ("Mercado gastronómico de las Américas") queda sola a la izquierda. Pie en 2 líneas.

**A 1280 px (escritorio, captura `Agenda-1280.jpg`, 1280 × 3132 px):** encabezado de 69 px en una fila. Título a la izquierda (h1 de 44,8 px) y, a la derecha y alineados abajo, "Lista / Mapa" y "Hoy / Este finde / Próxima semana". Fila de ciudades visible hasta "Pereira 1" (Villavicencio, Pasto y Leticia ocultos); fila de categorías completa. Rejilla de 4 columnas de 291,5 px; 5 filas, la última con 3 tarjetas. Pie en una fila.

**Barras fijas:** solo el encabezado (`sticky`). En celular, al recorrer la página hacia atrás con Shift+Tab, **82 de los 121 controles del contenido quedan 100 % tapados** por el encabezado de 224 px (medido a 390 × 844; a 768 × 1024 y a 1280 × 900, solo 1). Es el mismo patrón de H16, que la auditoría solo listó para Evento y Bienvenida.

**Capturas y versión del diseño:** `agenda-repost.jpg` (1280 × 900, ventana abierta) es de una iteración anterior: sus tarjetas con precio dicen "Boletas ↗" (las gratis ya dicen "Ver plan") y su encabezado no tiene el ícono de Mensajes. Manda el código: "Comprar" / "Ver plan" sin flecha y 5 íconos en la navegación. Fuera de eso, la ventana coincide con el código.


#### 5.2.5 Mapa

**Reglas del archivo que producen los cambios:**
- `@container (max-width: 420px)` sobre el lienzo del mapa (`container-type: inline-size`): oculta los países y achica los mares a `.6rem` / `.12em`. El lienzo llega a 420 px con la ventana en unos **489 px**: los países se ven desde 490 px.
- `@media (min-width: 1100px)`: panel lateral con `contain: size` y lista con `min-height: 0; overflow-y: auto` (scroll interno).
- `@media (prefers-reduced-motion: reduce)`: sin transiciones.
- Cambios por `flex-wrap`, `flex-basis` y `clamp()` (medidos en Chromium):

| Elemento | Regla | Cambio |
|---|---|---|
| Encabezado | `flex-wrap`, buscador `flex: 1 1 260px`, nav `margin-left: auto` | 1 fila (69 px) desde 907 px; 2 filas (125 px) de 471 a 906; 171 px de 441 a 470; 220 px de 417 a 440; 224 px hasta 416. |
| Márgenes laterales | `clamp(16px, 4vw, 24px)` en encabezado, `main` y pie | 16 px hasta 400 px, 24 px desde 600. |
| Cabecera de la página | texto `flex: 1 1 520px` + selector de fecha | Selector de fecha a la derecha desde 894 px; debajo y a la izquierda por debajo. |
| `h1` | `clamp(1.9rem, 3.6vw, 2.8rem)` | 30,4 px hasta unos 845 px de ventana; 44,8 px desde 1245. |
| Selector de fecha | sin `flex-wrap` | 309,5 px fijos: desborda la página por debajo de 326 px (6 px a 320, H8). |
| Chips de categoría | `overflow-x: auto` | Scroll horizontal por debajo de 725 px. |
| Fila mapa + panel | mapa `flex: 999 1 560px`, panel `flex: 1 1 380px` | Lado a lado desde 1014 px; apilados por debajo. Entre 1014 y 1099, error del panel estirado a 4955 px (sección 5). |
| Relleno del panel del mapa | `clamp(14px, 2vw, 20px)` | 14 px hasta 700, 20 px desde 1000. |
| Controles del mapa | `flex-wrap` | 1 fila desde 545 px; 2 filas de 393 a 544; 3 filas por debajo de 393. |
| Lienzo del mapa | `width: min(100%, 560px)` | 560 px desde 638 px de ventana (apilado) y desde 1056 px (lado a lado). Entre 1014 y 1055 se reduce a 518-559 px (518 a 1014, 528 a 1024, 559 a 1055). |
| Pines | `clamp(36px, {cq}cqw, {size}px)` | Proporcionales al lienzo, con piso de 36 px. |
| Leyenda | `flex-wrap` | 1 línea desde 619 px; 2 líneas de 416 a 618 y de 1014 a 1036; 3 líneas por debajo de 416. |
| Fila de acciones de la tarjeta | `flex-wrap` + `margin-left: auto` | "Ver en el mapa" baja a otra línea cuando la columna de texto es angosta: en el panel de 380 px y en celular. A 768 cabe en la misma línea. |
| Ranking de ciudades | `overflow-x: auto` | Con "Todo", scroll horizontal en **todos** los anchos (1499 px de contenido frente a un máximo de 1240). La pista "Toca una ciudad para verla en el mapa" va a la derecha del título desde unos 600 px y debajo en celular. |
| Pie | `flex-wrap` + `space-between` | 1 línea a 1280 (81,4 px de alto); apilado a 768 (111,8 px) y a 390 (132,2 px, con el segundo texto en 2 líneas). |

**A 390 px (celular, captura `Mapa-390.jpg` y capturas de viewport verificadas):**
- El encabezado fijo mide 224 px en 4 filas: logo; buscador con el placeholder cortado ("Busca eventos, lug") y "Toda Colombia" con flecha; los 5 íconos alineados a la derecha; "Crear evento" + "CV".
- Debajo van el antetítulo con la etiqueta en una línea, el `h1` de 30,4 px en dos líneas, el resumen en 3 líneas y el selector de fecha a la izquierda (309,5 px).
- Los chips de categoría hacen scroll: se ven "Todo", "Rumba", "Conciertos" y "Gratis" cortado.
- El panel del mapa ocupa todo el ancho (358 px, 745,5 px de alto, y=575):
  - controles en 3 líneas ("Toda Colombia" / "Mi ciudad: Bogotá" / zoom);
  - lienzo de 328 × 441,5 px sin países, con "MAR CARIBE" y "OCÉANO PACÍFICO" pequeños;
  - pines de 36 px (Bogotá 38,1). Los centros de Medellín y Pereira quedan a unos 36 px (2,95 px en x y 36,2 px en y): los dos círculos de 36 px se tocan;
  - leyenda en 3 líneas.
- El panel lateral va **debajo del mapa** (desde y=1344), crece con su contenido (5083 px, sin scroll interno) y las 19 tarjetas se apilan. "Ver en el mapa" va en su propia línea, a la derecha.
- "Ciudades con más planes" va casi al final (título en y≈6464, con la pista debajo; fila de ciudades en y≈6529), con scroll horizontal. El pie va apilado (132 px).
- Página total: 6757 px. Tocar un pin o "Ver en el mapa" cambia la lista fuera de la vista (H42). Con "Ver en el mapa: Leticia" (medido con la tarjeta centrada en pantalla), la página se acorta de 6757 a 2035 px, el navegador recorta el scroll de 5913 a 1191 px y el mapa queda arriba, fuera de la vista (y = −616).

**A 768 px (tableta, captura `Mapa-768.jpg`):**
- Encabezado de 2 filas (125 px): logo + buscador de 500 px arriba; íconos, "Crear evento" y avatar abajo a la derecha.
- `h1` de 30,4 px, selector de fecha debajo a la izquierda y los 7 chips en una sola fila sin scroll.
- El mapa ocupa los 720 px (914 px de alto), con controles en una fila, lienzo de 560 × 753,8 centrado, todos los rótulos geográficos, pines de 40 a 65 px y leyenda en una línea.
- El panel lateral va debajo a todo el ancho (3944 px) y "Ver en el mapa" va en la misma línea que "Repostear" y el corazón.
- Ranking con scroll. El pie ya va apilado (111,8 px de alto: los dos textos en líneas separadas). Página total: 5618 px. Al tocar Medellín, la lista queda en y≈1434, fuera de la pantalla (H42).

**A 1280 px (escritorio, capturas `Mapa-1280.jpg` y `mapa-medellin.jpg`):**
- Encabezado de una fila (69 px) y `h1` de 44,8 px en dos líneas, con el selector de fecha a la derecha alineado abajo. Los 7 chips en una fila.
- Mapa (825,7 px) y panel (382,3 px) lado a lado con el mismo alto (923,5 px). La lista hace scroll dentro del panel y su cabecera queda quieta.
- Ranking con scroll: Villavicencio cortada; Pasto y Leticia ocultas.
- Pie en una línea. Página total: 1544 px.
- `mapa-medellin.jpg` se volvió a tomar con el código actual: muestra "Comprar" en las tarjetas y el ícono de Mensajes con la insignia "3".

**Barras fijas:** solo el encabezado (`sticky`, `top: 0`, `z-index: 70`). No hay barra inferior, ni botón flotante, ni panel fijo.


#### 5.2.6 Evento y compra

**Reglas que hacen el cambio** (no hay `@container`):
- `@media (min-width: 980px)`: la tarjeta de compra se vuelve `sticky; top: 88px` y los atajos `sticky; top: 69px; z-index: 4`.
- `@media (max-width: 979px)`: se oculta el `<aside>`, aparece la barra de compra fija y el contenedor raíz gana `padding-bottom: 84px`.
- Todo lo demás sale de `flex-wrap` con bases `flex` y de rejillas `auto-fit`/`auto-fill`:

| Bloque | Regla | Cambios medidos |
|---|---|---|
| Encabezado | `flex-wrap: wrap`; logo con `margin-inline: auto`; nav con `margin-left: auto` | 1 fila (69 px) desde 631 px; 2 filas (125 px) entre 326 y 630; 3 filas (171 px) entre 301 y 325 (incluido 320). |
| Relleno lateral | `clamp(16px, 4vw, 24px)` en encabezado, `<main>`, pie y barra | 16 px hasta 400 px; 4vw hasta 600; 24 px desde 600. |
| Héroe | `padding: clamp(28px, 5vw, 48px) clamp(20px, 5vw, 56px)`; título `clamp(2.2rem, 5vw, 4.2rem)` | Título de 35,2 px hasta 704 px, 5vw hasta 1344 y 67,2 px desde ahí. Datos del héroe: 3 filas por debajo de 591 px, 2 entre 591 y 959, 1 desde 960. |
| Datos clave | `repeat(auto-fit, minmax(170px, 1fr))` | 1 / 2 / 3 / 4 / 5 columnas con cortes en 394, 583, 758 y 932 px. |
| Fila de acciones | `flex-wrap` | 2 filas por debajo de 563 px. |
| "Quién va" | `flex-wrap`, texto `flex: 1 1 220px` | 1 fila desde 614 px (salvo a 980 y 981 px: 2 filas); 2 entre 396 y 613; 3 por debajo de 396. |
| Contenido + aside | `flex: 999 1 560px` / `flex: 1 1 340px` + `@media` | Aside visible desde 980 px. |
| Atajos | `overflow-x: auto`, 818 px de contenido | Scroll horizontal por debajo de 866 px y entre 980 y 1233 px. |
| Plano + lista | `flex: 1 1 320px` / `flex: 1 1 260px` | Lado a lado entre 646 y 979 px y desde 1015 px. |
| Tarjeta de parche | `flex-wrap`, texto `flex: 1 1 240px` | 1 fila desde 490 px; botón en su propia fila entre 380 y 489; 3 filas por debajo de 380. |
| Políticas | `repeat(auto-fit, minmax(220px, 1fr))` | 1 / 2 / 3 / 4 / 2 / 3 columnas con cortes en 492, 732, 964, 980 y 1101 px. |
| Ubicación + organizador | `flex: 1.3 1 300px` / `flex: 1 1 260px` | Lado a lado entre 664 y 979 px y desde 1033 px. Botones "Ver en el mapa" / "Copiar dirección" en 2 filas por debajo de 378, entre 664 y 740 y entre 1033 y 1109 px. |
| Planes parecidos + recuerdos | `flex: 2 1 560px` / `flex: 1 1 300px` | Lado a lado desde 970 px. |
| Rejilla de planes parecidos | `repeat(auto-fill, minmax(200px, 1fr))` | 1 / 2 / 3 / 4 (una vacía) / 2 / 3 columnas con cortes en 453, 680, 896, 970 y 1078 px. |
| Pie | `flex-wrap`, `space-between` | 1 fila desde 931 px. |
| Ventana de compra | `width: min(520px, calc(100% − 24px))` | 520 px desde 544 px de ancho; por debajo, todo el ancho menos 24 px. Medios de pago: `auto-fill, minmax(140px, 1fr)` → 3 columnas a 520 px, 2 a 366 px. |

**A 390 px (celular; capturas `Evento-390.jpg` y `evento-celular.jpg`):**
- Encabezado fijo de 125 px en dos filas.
- Héroe de 358 × 380 con el título en 4 líneas ("NOCHE DE / SALSA / Y BOLEROS EN / VIVO").
- Datos clave en 1 columna (412 px de alto).
- Acciones en 2 filas; "quién va" apilado.
- Atajos con scroll horizontal (se ven "Sobre el evento", "Programación" y parte de "Localidades").
- Plano y lista apilados; tarjetas de parche con el botón abajo; políticas en 1 columna; ubicación y organizador apilados; planes parecidos en 1 columna con imágenes de 356 × 223; recuerdos debajo, con cuadros de 103 px; pie en 2 filas.
- **Barra de compra fija** de 69 px abajo. No hay tarjeta lateral.
- La página mide 7316 px.
- La ventana de compra ocupa 366 × 820 px (`compra-celular.jpg`); su cabecera mide 229 px y su pie, de 174 a 215 px, así que a 844 px de alto quedan entre 400 y 440 px para el contenido.

**A 768 px (tableta; `Evento-768.jpg`):**
- Encabezado de una fila (69 px).
- Datos clave en 4 + 1, con "Show 9:30 p. m." partido (H61).
- Acciones en una fila.
- Atajos con scroll horizontal; plano y lista lado a lado (381 + 321 px); políticas en 3 + 3; ubicación y organizador lado a lado; planes parecidos en 3 columnas.
- Recuerdos a todo el ancho, con cuadros de **223 px** (bloque muy alto).
- Barra de compra fija; sin aside.
- La página mide 4788 px.

**A 1280 px (escritorio; `Evento-1280.jpg` y `compra-*.jpg`):**
- Contenido de 864 px y aside de 340 px con la tarjeta de compra fija a 88 px del borde superior.
- Atajos fijos a 69 px, justo debajo del encabezado, sin scroll (caben a ese ancho).
- Datos clave en 5 columnas; plano y lista lado a lado (453 + 393 px); políticas en 3 + 3; planes parecidos (767 px, 3 columnas) junto a recuerdos (441 px).
- Sin barra móvil. La página mide 3857 px.
- La ventana de compra es un panel de 520 px arriba a la derecha (x = 748), con cabecera de 205 px y pie de 174 a 215 px.

**Lo que se oculta o se fija:**
- Oculto por debajo de 980 px: el aside. Oculta desde 980 px: la barra móvil.
- Fijos: el encabezado (siempre), los atajos (desde 980 px), la tarjeta de compra (desde 980 px), la barra de compra (por debajo de 980 px), y la cabecera y el pie de la ventana.
- Scroll horizontal: los atajos y la lista de pestañas (`overflow-x: auto`; las pestañas nunca llegan a desbordar). La página no tiene scroll horizontal en ningún ancho de 320 a 1480 px.

**Ventanas bajas (H6):** con 844 × 390 (celular en horizontal) o 640 × 360 (zoom al 200 %), la cabecera y el pie fijos de la ventana dejan un espacio negativo para el contenido (−13 y −43 px). No se ve ningún control del paso 1. Hay que corregirlo (ver "Correcciones obligatorias").


#### 5.2.7 Mensajes (chat)

**Puntos de quiebre del archivo** (todos son `@media` de ventana; no hay `@container`):

| Regla | Ancho | Qué cambia |
|---|---|---|
| `@media (min-width: 900px)` | ≥ 900 px | Raíz `height: 100vh` (sin scroll de página); shell `min-height: 520px`; se oculta "Volver a tus chats". |
| `@media (min-width: 1180px)` | ≥ 1180 px | El panel de información es una columna fija que se muestra u oculta con `infoWide`; se oculta el botón Info angosto. |
| `@media (max-width: 1179px)` | ≤ 1179 px | Se oculta el botón Info ancho; el panel se muestra solo con `infoNarrow` y como cajón superpuesto (`absolute`, 320 px, sombra); la lista baja a 300 px. |
| `@media (max-width: 899px)` | ≤ 899 px | Una sola columna a la vez según `data-pane`; encabezado no fijo; historial sin scroll propio; barra superior y compositor `sticky`; panel a pantalla completa; "Enviar" solo ícono. |
| `@media (prefers-reduced-motion: reduce)` | — | Quita las 3 transiciones (`data-fx`). |

Reglas de flex que hacen el resto del trabajo: el encabezado (`flex-wrap: wrap`, buscador `flex: 1 1 260px`), el plan fijado (`flex-wrap: wrap`, texto `flex: 1 1 220px`), la fila del compositor (`flex-wrap: wrap`, campo `flex: 1 1 120px`), los filtros (`flex: 1 0 auto`, contenedor con `overflow-x: auto`), la rejilla de amigos (`repeat(auto-fill, minmax(200px, 1fr))`) y la bandeja "Compartir" (`overflow-x: auto`).

**Escritorio, 1280 px** (captura `Chat-1280.jpg`, confirmada):
- Encabezado de 1 fila (69 px), fijo. Shell de 1192 × 799 en (44, 85).
- Tres columnas: lista 331 px (330 + borde), conversación 562 px, panel 297 px (296 + borde). Cada una con su scroll; la página no se mueve.
- Plan fijado de 157 px (texto en 3 líneas, "Comprar mi boleta" a la derecha). Historial visible: 497 px de alto. Compositor 65 px con "Enviar" con texto.
- Con el panel cerrado, la conversación mide 859 px y el plan baja a 104 px.
- Ventanas bajas: con 600 px de alto la página hace 7 px de scroll y el historial queda en 220 px de alto; el mínimo de 520 px del shell no deja encoger más.

**Entre 1180 y 1279 px:** igual que escritorio con columnas más angostas. A 1180 la conversación mide 502 px y el plan fijado ya pone "Comprar mi boleta" en una segunda fila (180 px de alto).

**Entre 900 y 1179 px** (medido a 1024 × 768 y 1100 × 900):
- Encabezado de 1 fila desde 907 px; de 900 a 906 px ocupa 2 filas (125 px).
- Dos columnas: lista 301 px y conversación con el resto (673 px a 1024). El panel no se ve hasta tocar Info.
- Info abre un cajón de 321 px pegado a la derecha del shell, encima de la conversación y del compositor, con sombra a la izquierda (`-16px 0 40px rgba(23,18,15,.16)`). No oscurece el resto ni bloquea los clics en la lista.
- Los botones "Nuevo chat" / "Nuevo parche" miden 130 px; el placeholder del buscador de chats se corta.

**Tableta, 768 px** (captura `Chat-768.jpg`, confirmada):
- Encabezado no fijo de 2 filas (125 px): logo + buscador de 500 px; navegación alineada a la derecha debajo.
- `<main>` con `padding: 12px 16px 16px`; shell de 736 px con radio 20.
- Vista de lista (inicial): la lista ocupa todo el ancho (734 px); filtros de 159 a 179 px cada uno; vistas previas completas en una línea. La página mide 1024 px (cabe).
- Al tocar una conversación: se oculta la lista y aparece la conversación a todo el ancho con "Volver" (chevrón). La barra superior queda pegada arriba al bajar y el compositor pegado abajo. El historial ya no tiene scroll propio: la página mide 2100 px y el usuario ve primero el encabezado, la barra, el plan fijado (104 px en una fila) y los mensajes **más viejos** (H43).
- Info abre una pantalla completa (768 × 1024) sobre todo, sin fondo oscuro.
- "Enviar" es un círculo de 44 px solo con el avión.

**Celular, 390 px** (capturas `Chat-390.jpg`, `chat-celular-lista.jpg` y `chat-celular-conversacion.jpg`, confirmadas):
- Encabezado no fijo de 4 filas (224,2 px): logo; buscador (placeholder "Busca planes, g" y "Toda Colombia"); 5 íconos; "Crear evento" + avatar.
- **Vista de lista: la página se desborda a 708 px de ancho** (en cualquier ventana de menos de 708 px). La lista mide 690,8 px porque, al pasar a `width: auto; flex: 1 1 auto` sin `min-width: 0`, toma el ancho mínimo de su contenido (los dos botones `nowrap` y las vistas previas). Se cortan "Nuevo parche", "3 chats sin leer", los filtros, las horas y los contadores (H8). `Chat-390.jpg` es la captura de página completa a 708 px; `chat-celular-lista.jpg` es lo que ve el celular.
- **Vista de conversación:** página de 2494 px de alto (Salseros). Barra superior pegada arriba (66 px) con el nombre cortado ("Salseros…" y "12 miembros ·"), plan fijado apilado (233 px: foto + texto, y "Comprar mi boleta" debajo), historial completo y compositor pegado abajo (65 px) con campo de 136 px ("Escríbele al pa"). Al abrir una conversación la página **no** se mueve: conserva el `scrollY` que tenía la lista. Con la lista arriba (lo normal), lo primero que se ve es el encabezado de la app, la barra, el plan y "AYER"; con la lista bajada (máximo 219 px a 390 × 844), la conversación aparece desde un punto intermedio. En ningún caso se ve el último mensaje. Además, al enviar con la página arriba, la burbuja nueva se agrega al final de la página (que crece 43 px con un texto corto) y queda fuera de vista.
- La captura `chat-celular-conversacion.jpg` muestra **"Clásico capitalino"** (no Salseros), con la página arriba: título cortado "Clásico …", subtítulo cortado sin "…" ("4 miembros · 2"), plan fijado apilado con "Ya tienes boleta" en una segunda fila, separador "AYER" y los primeros mensajes; el compositor pegado abajo con "Escríbele al pa".
- Info: pantalla completa (390 × 844) con su propio scroll; tapa el encabezado.
- Ventana "Nuevo chat": 358 × 723, amigos en 1 columna. "Nuevo parche": 358 × 812 con scroll interno. En los dos modos el pie se parte en dos filas: ayuda + "Cancelar" arriba y el botón principal ("Abrir chat" o "Crear parche") solo, abajo a la derecha.
- Bandeja "Compartir": fila con scroll horizontal; se ve "Noche de salsa y boleros" y el borde del segundo.

**Más angosto que 390 px:**
- A 375 px todo cabe en el compositor (campo de 121 px).
- **A 360 px** la fila del compositor se parte: los 3 íconos y el campo (158 px) arriba y el botón "Enviar" solo, a la izquierda, en una segunda línea (compositor de 117 px).
- **A 320 px** se parten así: los 3 íconos arriba; campo (210 px) y "Enviar" abajo. El nombre de la conversación en la barra queda en 14 px de ancho (prácticamente invisible).
- El desborde de la lista (708 px) se mantiene en 320, 360 y 375 px.

**Barras fijas y capas (`z-index`):** encabezado 5 (`sticky` desde 900 px, `static` por debajo); barra superior y compositor 4 (`sticky` solo por debajo de 900 px); cajón de información 6 (900–1179 px, `absolute` dentro del shell) o 30 (por debajo de 900 px, `fixed`); ventana modal 40 (`fixed`). Nada hace scroll horizontal salvo los filtros (contenedor con `overflow-x: auto`, que a 1280 cabe), la bandeja "Compartir" y, por error, la página entera en la vista de lista en celular.


#### 5.2.8 Perfil

**Breakpoints del archivo:** ninguno. No hay `@media` ni `@container`. Todos los cambios salen de `flex-wrap` con estas bases. Umbrales medidos en Chromium, ventana de 300 a 1300 px, de 1 en 1 px:

| Bloque | Regla que produce el cambio | Umbrales medidos (ancho de ventana) |
|---|---|---|
| Encabezado | `flex-wrap: wrap`; 123,3 + 124,9 + 148,2 px de ítems + 2 × 20 px de hueco + 48 px de padding | **69 px** de alto (1 fila) desde 485 px. **125 px** (2 filas) de 317 a 484 px: fila 1 "Volver al feed" + logo; fila 2 "Mapa" + Mensajes, **alineados a la izquierda** (x = 24). **174 px** (3 filas) por debajo de 317 px |
| Identidad | Avatar 128 + 24 + bloque de nombre `flex-basis: 260px` + 24 + botones 203,8 (229,7 con "Siguiendo") + 64 de padding + 2 de borde | **Una fila** (avatar, nombre y botones) desde 754 px (780 px con "Siguiendo"). **Dos filas** (avatar + nombre; los botones abajo a la izquierda) de 526 a 753 px. **Tres filas** (avatar, nombre, botones) por debajo de 526 px |
| Nombre | `h1` de 32 px, sin `clamp` | "Camila Vargas" pasa a 2 líneas por debajo de 349 px. El @usuario pasa a 2 líneas por debajo de 346 px |
| Biografía y estadísticas | Biografía `flex: 1 1 320px` + 40 + `<dl>` de 380,2 px + 66 | Estadísticas **a la derecha** de la biografía desde 855 px; **debajo** por debajo de 855 px |
| Estadísticas | `<dl>` con `flex-wrap`, `gap: 12px 28px` | 1 fila desde 495 px; 2 filas (3 + 2) de 336 a 494 px; 3 filas (2 + 2 + 1) por debajo de 336 px |
| Gustos | `flex-wrap`, `gap: 8px` | 1 fila desde 532 px; 2 filas (3 + 2) de 359 a 531 px; 3 filas por debajo de 359 px |
| Pestañas | `overflow-x: auto`, `flex-shrink: 0`, `nowrap`, 366,8 px de contenido | Hay **scroll horizontal dentro de la fila** por debajo de 415 px. A 390 px "Reseñas" queda cortada en "Reseña" (25 px fuera), sin degradado ni flecha que lo indique, y la fila no se desplaza sola al seleccionarla ni al enfocarla con Tab |
| Próximos planes | `repeat(auto-fill, minmax(210px, 1fr))`, `gap: 20px` | 1 / 2 / 3 / 4 / 5 columnas desde 0 / 488 / 718 / 948 / 1178 px |
| Recuerdos | `repeat(auto-fill, minmax(200px, 1fr))`, `gap: 12px` | 1 / 2 / 3 / 4 / 5 columnas desde 0 / 460 / 672 / 884 / 1096 px |
| Reseñas | `max-width: 760px`; fila superior con `flex-wrap` | La calificación baja bajo el título por debajo de 354 px. El primer texto ocupa 1 línea desde 600 px, 2 líneas de 356 a 599 px y 3 por debajo |
| Contenedor | `max-width: 1240px` en el encabezado y el `main` | Se centra desde 1288 px |

- **Móvil, 390 px** (captura `Perfil-390.jpg`, 390 × 2939):
  - Encabezado de 125 px en 2 filas, que **se va con el scroll** porque no es fijo.
  - La tarjeta de perfil ocupa de y = 149 a y = 954 (804,6 px):
    - portada de 340 × 200;
    - avatar de y = 286 a y = 414, montado 64 px sobre la portada;
    - "Camila Vargas" en y = 442, en 1 línea, y el @usuario en y = 478;
    - "Seguir" y "Mensaje" en y = 516, alineados a la izquierda en x = 57;
    - biografía en 4 líneas (y = 588);
    - estadísticas en 2 filas, "Eventos · Ciudades · Seguidores" y "Siguiendo · Parches";
    - gustos en 2 filas, "Salsa · Rock · Planes gratis" y "Stand-up · Fútbol".
  - Pestañas en y = 978, con "Reseñas" cortada.
  - Rejilla de 1 columna: 5 tarjetas de 342 × 349 px, con foto de 255 px.
  - En "Recuerdos", 8 cuadrados de 342 px apilados: la página llega a 3934 px.
  - Sin scroll horizontal de página (`scrollWidth` = ancho de ventana, también a 320 y 360 px).
- **Tableta, 768 px** (captura `Perfil-768.jpg`, 768 × 1391):
  - Encabezado de 69 px en una fila: "Volver al feed" a la izquierda, logo centrado en el espacio libre (x = 309) y "Mapa" + Mensajes a la derecha.
  - Identidad en **una fila**: avatar en x = 57, nombre en x = 209, botones de x = 507 a x = 711, alineados abajo.
  - Biografía en 2 líneas, con las estadísticas **debajo** en 1 fila. Gustos en 1 fila.
  - "Próximos planes" en 3 columnas de 226,7 px: **3 + 2**, con un hueco vacío a la derecha de la segunda fila (H61).
  - "Recuerdos" en 3 + 3 + 2. "Reseñas" con tarjetas de 720 px.
  - Pulsar "Seguir" a este ancho baja los botones a una segunda fila (ver "Estados").
- **Escritorio, 1280 px** (captura `Perfil-1280.jpg`, 1280 × 1005):
  - Encabezado de 69 px; logo en x = 565.
  - Identidad en una fila con los botones a la derecha (x = 1019 a 1223).
  - Biografía (575,4 px, 2 líneas) y estadísticas al lado (x = 672 a 1052), alineadas arriba. Gustos en 1 fila.
  - "Próximos planes" en **5 columnas** de 230,4 px: todos en una sola fila, y el contenido mide 1005 px (cabe en el tablero de 1040).
  - "Recuerdos" en 5 + 3 (236,8 px). "Reseñas" a 760 px de ancho, alineadas a la izquierda, con 472 px vacíos a la derecha (1232 − 760).
- **Barras fijas, ocultos, scroll:** nada es sticky ni fixed. Nada se oculta en ningún ancho. Solo hay scroll horizontal dentro de la fila de pestañas, y solo por debajo de 415 px.
