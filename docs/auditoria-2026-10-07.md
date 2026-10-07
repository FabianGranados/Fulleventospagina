# Auditoría de Fulleventos: prototipo de diseño
(fecha: 7 de octubre de 2026; auditor: agente auditor-web)

## Resumen ejecutivo

El prototipo cuenta bien la historia de Fulleventos. El sistema visual es coherente, los cálculos en pesos están bien y no hubo ningún error de JavaScript. El checkout ya muestra el total antes de pagar, deja la tarjeta en manos de la pasarela y no le guarda a nadie la plata del parche. Pero hoy solo muestra el camino feliz, y hay tres riesgos que conviene resolver antes de construir:

1. **El modelo de compra.** Prometer boletas de TuBoleta, Ticketmaster o Fever "sin salir de Fulleventos" no tiene una API abierta que lo permita. Vender boletas propias exige autorización de MinCultura, registro en PULEP y facturación DIAN (H1, H4).
2. **Pagos y boletas simulados.** El pago se aprueba al instante, los cupos y precios se calculan en el navegador y el QR es fijo. Copiado a producción, eso significa boletas sin cobrar, sobreventa y reventa duplicada (H2, H3, H11).
3. **Seguridad de la comunidad y cumplimiento.** No hay cómo reportar ni bloquear, no hay control de edad en una red de rumba +18 y no se ve quién vende (H9, H10, H5).

Además, en celular y con teclado el checkout tiene barreras serias (H6, H7, H8) que se corrigen con cambios pequeños, ya probados en una copia.

**Recomendación:** esta semana, corregir el diseño (casi todo es esfuerzo S). En paralelo, decidir con un abogado el modelo de venta. Lanzar primero un MVP de descubrimiento con compra por redirección a la boletera, y dejar la venta propia y el pago dividido para después.

## Calificación por área

| Área | Estado | Comentario breve |
|---|---|---|
| Código y flujos | Mejorable | Los totales en COP están bien y no hay errores de JavaScript. Fallan los estados de pago, las validaciones, "Mis boletas", los datos que se contradicen entre pantallas y 25 botones que no hacen nada. |
| Accesibilidad | Mejorable | La base es sólida: teclado, etiquetas, contraste y movimiento reducido. Pero en el checkout el foco se pierde, las ventanas no se comportan como modales y con zoom al 200 % no se puede comprar. Los arreglos son pequeños y ya están probados. |
| Responsive y UI | Mejorable | En escritorio todo es coherente. En celular hay scroll de lado (Chat y landing), el encabezado ocupa hasta un tercio de la pantalla, el feed queda enterrado y falta la etiqueta viewport. |
| Seguridad y privacidad | Crítico para abrir al público | La intención es buena con la tarjeta y el pago dividido. Faltan reportar y bloquear, control de edad, privacidad de los planes y la confirmación de pagos en el servidor. |
| Cumplimiento legal | Crítico para vender | No se ve quién vende ni se informa el retracto, y falta el aviso de privacidad donde se pide el documento. La venta propia exige MinCultura, PULEP y DIAN. Hay marcas reales presentadas como boleteras. Todo debe validarlo un abogado. |
| Preparación para producción | Crítico (esperable en un prototipo) | No hay backend, cuentas, reservas, confirmación de pagos por webhook, QR real, chat en tiempo real ni panel de organizadores. |
| SEO y rendimiento | Mejorable | El rendimiento de hoy es sano (22 KB comprimidos, 40 ms por tecla con la CPU 4 veces más lenta). Falta construir el SEO y la vista previa para WhatsApp: no hay URL por evento, ni Open Graph, ni schema.org. |

## Lo que está bien hecho

Esto conviene no romperlo al corregir:

- **Cálculos y formato en COP correctos.** 2 × $45.000 + 8 % da $97.200 y el botón dice "Pagar $97.200". Las partes del pago dividido cuadran exacto ($48.600 × 8 = $388.800; $86.400 × 4 = $345.600) y el formato `es-CO` es el mismo en todo el producto (`Evento.dc.html:899-957`). En ningún flujo probado hubo errores de JavaScript.
- **Checkout bien armado:**
  - 4 pasos con indicador.
  - Subtotal, cargo y total a la vista desde el paso 1 (`Evento.dc.html:855-860`).
  - La casilla de términos arranca desmarcada y es obligatoria (`:892`, `:1059`).
  - Explica por qué no deja avanzar.
  - Si se cierra y se vuelve a abrir, conserva lo escrito.
  - Tope de 8 boletas por compra (`:904`, `:1196`).
  - El plano, las localidades y la tarjeta de compra se mantienen sincronizados.
- **Buena intención con la tarjeta.** Los campos no guardan nada en el estado (no tienen `value` ni `onChange`) y el recuadro dice "Campos seguros de [PASARELA]" (`Evento.dc.html:704-717`). Después de pagar, el número de tarjeta ya no está en la página.
- **El pago dividido no custodia plata.** Cada amigo paga su parte directo (`Evento.dc.html:629`, `Chat.dc.html:408`), que es lo que recomienda la investigación previa. En el chat, el aviso del pago dividido es un mensaje del sistema y no un enlace pegado por un usuario (`Chat.dc.html:1165`).
- **Medios de pago locales.** Nequi, PSE, tarjeta con cuotas, Daviplata y Botón Bancolombia, explicados sin pedir claves dentro de Fulleventos (`Evento.dc.html:752`, `:1277`).
- **Marcadores honestos.** [BOLETERA], [PASARELA], el QR marcado como "no es un código real" (`Evento.dc.html:813`) y "Contenido de ejemplo". La boleta solo muestra el nombre del titular, no el documento. La restricción +18 y el documento original están a la vista (`:104-106`, `:1137`).
- **Chat sólido.** Filtros, envío con Enter, no manda mensajes vacíos, encuestas, compartir eventos, crear parche con validación, salir con confirmación, silenciar e insignia de verificado. Usa `role="log"`. En escritorio abre en el último mensaje (`column-reverse`, `Chat.dc.html:213`).
- **Mapa accesible.**
  - Zoom con límites y selección sincronizada.
  - Pines que son botones con nombre ("Bogotá, 6 eventos"), `aria-pressed` y 36 px o más.
  - La lista lateral sirve de alternativa en texto.
  - Respeta `prefers-reduced-motion` (las transiciones bajan de 33 a 0).
- **Base de accesibilidad:**
  - La compra completa se puede hacer solo con teclado.
  - Etiquetas visibles y `autocomplete` correcto en el checkout (`Evento.dc.html:643-717`).
  - Contraste: se midieron unas 2.800 cajas de texto y solo un texto queda bajo el umbral.
  - Foco visible de 3 px #C23A24 en Evento, Chat y Mapa.
  - `lang="es"`, un solo `main`, navegación con nombre.
  - Objetivos táctiles de 40 a 54 px.
  - El espaciado de texto (WCAG 1.4.12) no corta nada.
- **Sistema visual coherente.** Mismas fuentes (Archivo y DM Sans) y la misma paleta en las 8 pantallas. Los datos base de los 19 eventos coinciden en 4 pantallas. El calendario cuadra: del viernes 9 al lunes festivo 12 de octubre de 2026.
- **Partes del responsive ya resueltas:**
  - 6 de las 8 pantallas no se desbordan a 360 px.
  - Por debajo de 980 px, Evento cambia el panel lateral por una barra inferior y deja 84 px de margen.
  - Estados vacíos con una acción útil.
  - Bienvenida limita a 8 planes con "Ver N planes más", que es el patrón a copiar.
- **Rendimiento sano y sin rastreadores de terceros.** Ya existe un arnés con Playwright y axe-core (`tools/dcharness.js`) que se puede reutilizar para las pruebas de producción.

## Hallazgos del prototipo (lo que se puede corregir ya en el diseño)

> **Cómo leer las referencias:**
> - Las referencias `Archivo.dc.html:línea` apuntan al código de cada pantalla del lienzo de diseño (versión del 7 de octubre de 2026).
> - Las rutas `audit-tmp/…`, `auditoria/…` y `tools/…` son los scripts y capturas de trabajo que usaron los auditores.
> - Los IDs siguen un solo orden de severidad e impacto en todo el informe. Por eso esta sección salta números: los que faltan están en "Requisitos para producción".
> - Cuando un hallazgo tiene una parte de diseño y otra de producción, va donde está la primera acción.

| ID | Hallazgo | Severidad | Pantallas | Esfuerzo |
|---|---|---|---|---|
| H5 | No se ve quién vende: faltan razón social, NIT, PQR y enlace a la SIC | Alta | Bienvenida, Agenda, Mapa, Evento, Main, Registro, Chat, Perfil | S |
| H6 | Checkout con zoom, en horizontal o en celular pequeño: la cabecera y el pie fijos tapan el contenido | Alta | Evento | S–M |
| H7 | El foco se pierde en cada paso de la compra y las ventanas no se comportan como modales | Alta | Evento, Agenda, Chat, Mapa, Registro | S |
| H8 | Scroll de lado en celular: Chat y Bienvenida | Alta | Chat, Bienvenida, Agenda, Mapa | S |
| H9 | No hay cómo reportar ni bloquear, y a uno lo meten a un parche sin preguntarle | Alta | Chat, Evento, Main, Perfil | M |
| H15 | En celular y tableta, el feed de Inicio queda enterrado bajo la barra lateral | Alta | Main | S–M |
| H16 | Elementos con foco quedan 100 % tapados por las barras fijas | Alta | Evento, Bienvenida | S |
| H17 | Faltan las pantallas de pago pendiente, rechazado, reserva vencida, agotado, carga y error | Media | Evento y todas | M |
| H20 | "Mis boletas" no existe | Media | Evento, Perfil, Main | S |
| H21 | El precio que se ve no incluye el 8 % y no se aclara el IVA | Media | Bienvenida, Agenda, Mapa, Main, Chat, Evento | S |
| H22 | La cantidad arranca en 2 boletas | Media | Evento | S |
| H23 | El checkout y el registro no validan datos ni explican los errores | Media | Evento, Registro | S |
| H24 | Mesa VIP con pago dividido: montos y boletas no cuadran | Media | Evento | S–M |
| H25 | "Para mi parche" ofrece comprarles a quienes ya tienen boleta | Media | Evento, Chat, Main | S |
| H26 | Después de comprar, el estado queda inconsistente | Media | Evento | S |
| H27 | No se informan el retracto ni las devoluciones antes de pagar | Media | Evento | S |
| H28 | Se piden datos sin decir para qué, y la autorización va amarrada a los términos | Media | Evento, Registro | S |
| H30 | Se expone dónde y cuándo estará cada persona | Media | Chat, Perfil, Evento, Main | M |
| H33 | Falta la versión pública de las pantallas para quien no tiene cuenta | Media | Bienvenida, Agenda, Evento, Mapa, Main | M |
| H35 | Falta la etiqueta viewport | Media | Las 8 | S |
| H36 | Todas las tarjetas abren el mismo evento | Media | Bienvenida, Agenda, Mapa, Main, Chat | M |
| H37 | El mismo evento muestra datos distintos según la pantalla | Media | Main, Evento, Chat, Perfil, Bienvenida | S |
| H38 | 25 botones no hacen nada | Media | Main, Evento, Agenda, Mapa, Chat, Bienvenida, Registro | M |
| H39 | Los filtros de fecha no filtran | Media | Agenda, Mapa, Bienvenida | S |
| H40 | En celular, el encabezado fijo ocupa entre un cuarto y un tercio de la pantalla | Media | Bienvenida, Main, Agenda, Mapa, Evento | M |
| H41 | Navegación y patrones inconsistentes entre pantallas | Media | Las 8 | M |
| H42 | Mapa en celular sin resultado visible, y saltos entre pantallas que pierden el contexto | Media | Mapa, Main, Evento, Chat | M |
| H43 | Chat en celular: abre en los mensajes más viejos | Media | Chat | M |
| H44 | En la landing, los planes a la venta aparecen después de 5 pantallas | Media | Bienvenida | S |
| H45 | Registro: avanza vacío, borra lo escrito y no pide la ciudad | Media | Registro, Bienvenida, Mapa | S |
| H46 | El perfil propio se ve como uno ajeno | Media | Perfil, Main, Chat | S–M |
| H47 | Agenda y Mapa muestran todos los eventos sin paginar | Media | Agenda, Mapa | S |
| H48 | La insignia "Organizador verificado" no explica qué se verificó | Media | Chat, Evento | M |
| H49 | Los cambios no se le anuncian al lector de pantalla | Media | Mapa, Evento, Registro, Agenda | S |
| H50 | Mapa: recorrer los pines con Tab lo descuadra | Media | Mapa | S |
| H51 | 13 campos de texto sin indicador de foco | Media | Bienvenida, Main, Agenda, Mapa, Chat, Registro | S |
| H52 | Contraste insuficiente: interruptores, bordes, números de pasos y un avatar | Media | Chat, Evento, Registro | S |
| H58 | Errores en la consola al cargar Evento | Baja | Evento | S |
| H59 | Detalles de semántica para lector de pantalla y control por voz | Baja | Evento, Mapa, Main, Agenda, Bienvenida, Chat | S |
| H60 | Mini-mapa de la landing con pines de 20 px que se enciman | Baja | Bienvenida | S |
| H61 | Chips cortados sin pista y filas sueltas en tableta | Baja | Bienvenida, Agenda, Mapa, Evento, Perfil | S |
| H62 | Textos: "Ver todo Colombia" y nombres que cambian | Baja | Main, Mapa, Agenda, Bienvenida | S |

### H5 · No se ve quién vende: faltan razón social, NIT, contacto, PQR y enlace a la SIC (Alta)

**Qué pasa:** el pie de página solo dice "© 2026 Fulleventos · Colombia" y "Compra segura dentro de Fulleventos. Las boletas las emite la boletera oficial del evento o el organizador", sin un solo enlace. En el paso de pago no queda claro quién vende entre el organizador, [BOLETERA] y la pasarela. Además, los documentos legales tienen nombres distintos según la pantalla.

**Evidencia:**
- Pies de página en `Bienvenida.dc.html:265-270`, `Agenda.dc.html:174-179`, `Mapa.dc.html:234-239` y `Evento.dc.html:509-514`, con 0 enlaces (verificado en Chromium).
- `Main.dc.html:307` es solo un párrafo en la columna lateral. Registro, Chat y Perfil no tienen pie de página.
- Buscar "NIT", "PQR" o "Superintendencia" en las 8 pantallas da 0 resultados.
- `Evento.dc.html:779` dice "por API con [BOLETERA] o con la pasarela de Fulleventos".
- `Registro.dc.html:64` dice "[Política de privacidad]" y `Evento.dc.html:774` dice "[Política de tratamiento de datos]".

**Por qué importa:**
- Según research.json, la Ley 1480 de 2011, art. 50 (modificada por la Ley 2439 de 2024), exige identificar al vendedor, tener un mecanismo de PQR y un enlace a la autoridad de consumo. Los literales vigentes están por confirmar.
- La SIC ya le formuló pliego de cargos a TuBoleta por el deber de información.
- El comprador no sabe a quién reclamar, y eso termina en quejas y reversiones de pago.

**Cómo arreglarlo:**
- **En el diseño (S):**
  - Un pie legal en todas las pantallas con [RAZÓN SOCIAL], NIT, dirección, teléfono, correo, PQR, enlace a sic.gov.co, Términos y Política de tratamiento.
  - Acceso a lo legal desde el menú o el perfil en Main, Chat y Perfil.
  - En el paso 3, un bloque "Vendido por [ ] · NIT [ ] · Organiza [ ] · Boleta emitida por [ ]".
  - Un único nombre para cada documento. Según el Decreto 1377 de 2013, la Política de tratamiento y el Aviso de privacidad son documentos distintos.
- **En producción:**
  - Datos reales, un sistema de PQR con número de radicado y acuse por correo.
  - Si Fulleventos actúa como "portal de contacto" (art. 53), igual debe mostrar quién vende. Esto está por confirmar con un abogado.

### H6 · Checkout con zoom al 200 %, celular en horizontal o celular pequeño: la cabecera y el pie fijos tapan el contenido (Alta)

**Qué pasa:** el diálogo de compra tiene un encabezado fijo (de 205 a 266 px según el ancho, con pasos y temporizador) y un pie fijo (de 174 a 201 px). Los 4 pasos comparten un solo contenedor con scroll. Cuando la ventana es baja, no queda espacio para el contenido. Además, el scroll se arrastra de un paso al siguiente, y el campo en el que se está escribiendo puede quedar debajo del pie.

**Evidencia:**
- Código: `Evento.dc.html:530` (contenedor), `:533` (encabezado *sticky*) y `:854` (pie *sticky*). No hay `scroll-padding`.
- A 844×390 (celular en horizontal) y a 640×360 (portátil de 1280×720 con zoom al 200 %), el espacio para el contenido es negativo (−13 y −43 px). Ninguno de los 7 controles del paso 1 se ve en ninguna posición del scroll, y a 844×390 tampoco se ve ninguno de los 6 campos del paso 2.
- A 360×640 queda cerca del 30 % de la pantalla para el contenido.
- Si el usuario baja 122 px en el paso 1, el paso 2 abre desplazado y oculta "Tus datos". En el paso 4, a 390×844, el título "¡Listo, Camila!" queda a −40 px, fuera de la vista.
- Con Tab, el campo con el foco queda 100 % oculto: "Celular" a 390×844, 4 campos a 375×667 y "Número de documento" a 360×640, mientras el pie dice "Escribe tu número de documento para continuar".
- Capturas: `audit-tmp/adv-zoom/dlg-844x390-*.png`, `audit-tmp/verif-co/v-360-foco-doc-oculto.png` y `audit-tmp/ev-390-step4.png`.

**Por qué importa:** para las personas con baja visión que usan zoom, y para cualquiera que gire el celular, la compra queda bloqueada (WCAG 1.4.4 y 1.4.10). Quien llena el formulario con teclado no ve el campo en el que escribe (WCAG 2.4.11). Y justo al terminar, el usuario no ve la confirmación de que todo salió bien.

**Cómo arreglarlo:**
- Convertir el diálogo en una columna flexible: el encabezado y el pie quedan fuera de la zona con scroll, y cada paso tiene su propio contenedor con scroll dentro de su `sc-if`, para que siempre arranque arriba.
- Arreglo mínimo: `scroll-padding` en el contenedor. Probado: 270 px arriba y 215 px abajo dejan 0 campos ocultos a 360×640 y a 1280×720.
- Con `@media (max-height: 600-720px)`:
  - Compactar el encabezado: "Paso 2 de 4" en una sola línea, el temporizador abajo y sin subtítulo.
  - Reducir el resumen a "Total $97.200 · Ver detalle".
  - Quitar el *sticky* si hace falta. Como los estilos son inline, la regla necesita un atributo `data-fe` y `!important`.
- En celular, mostrar el diálogo a pantalla completa.
- Probar a 320×256 y 640×360.
- **En producción:** llevar el foco al título de cada paso.

### H7 · Teclado y lector de pantalla: el foco se pierde en cada paso de la compra y las ventanas no se comportan como modales (Alta)

**Qué pasa:**
1. "Continuar" y "Pagar" se deshabilitan (`disabled`) o desaparecen justo cuando tienen el foco. El foco cae al cuerpo de la página y el siguiente Tab vuelve al inicio.
2. Al abrir una ventana, el foco se queda en el botón de atrás. En Evento ese botón queda 100 % tapado. Tab recorre la página de fondo, Escape solo cierra si el foco ya está adentro y, al cerrar, el foco se pierde.
3. En Agenda, la ventana "Repostear" no se cierra con Escape ni tocando afuera.
4. En el Chat en celular, el panel de información cubre toda la pantalla sin `role="dialog"` y Escape no lo cierra.

**Evidencia:**
- Código: `Evento.dc.html:867` (`disabled="{{cantNext}}"`), `:853`, `:530` y `:1227` (Escape solo funciona dentro del diálogo); `Agenda.dc.html:181-183` (sin `onKeyDown`); `Chat.dc.html:23`, `:358`, `:456` y `:1238`.
- Medido a 1280 px:
  - Después de "Continuar", hacen falta 52 Tabs para volver a "Tarjeta" (48 por detrás del fondo oscuro). Después de "Pagar", hacen falta 55 hasta "Volver al evento".
  - Para entrar a la ventana: 5 Tabs en Evento, 91 en Agenda y 43 en Chat. Con la compra abierta, 32 de 40 Tabs caen fuera de la ventana.
  - El árbol de accesibilidad sigue mostrando todo el fondo.
- El mismo patrón, con un costo de apenas 1 Tab, aparece en Mapa ("Acercar", "Ver en el mapa"), Chat ("Enviar"), Evento ("Quitar una boleta") y Registro ("Continuar").
- Scripts: `audit-tmp/verif-foco/`, `audit-tmp/adv-dlg/` y `audit-tmp/vfy/`.

**Por qué importa:** quien usa solo teclado o lector de pantalla queda perdido detrás del fondo oscuro en cada paso, y lo más probable es que abandone. Incumple WCAG 2.4.3 (nivel A) y 2.4.11 (el botón con foco queda tapado).

**Cómo arreglarlo:** todo esto se probó en una copia temporal, sin tocar el proyecto.
- **Ya en el prototipo (S):**
  - Cambiar `disabled` por `aria-disabled="true"` en Continuar, Pagar, Enviar, Acercar y Quitar, y conservar el chequeo `if (!can) return`. Con eso se pasa de 52 Tabs a 1 y de 55 a 2.
  - Poner `inert="{{bgInert}}"` (vale `''` con la ventana abierta y `undefined` cerrada) en header, main, footer y la barra de compra de Evento, Agenda y Chat. El runtime lo respeta.
  - Para que el foco entre a la ventana, usar `sc-camel-auto-focus` en el botón Cerrar. El `autofocus` en minúscula no funciona en este runtime.
  - Para que Escape funcione desde cualquier punto, poner `onKeyDown="{{dialogKey}}"` en el contenedor raíz (`Evento.dc.html:25`).
  - Agregar Escape y clic en el fondo a la ventana de Agenda.
  - Ponerle `role="dialog"`, `aria-modal` y Escape al panel de información del Chat en celular.
  - No ocultar "Ver en el mapa" al elegir una ciudad: dejarlo y cambiarle el texto.
- **En producción (M):**
  - Devolver el foco al botón que abrió la ventana. No se encontró cómo hacerlo en este formato (por confirmar).
  - Usar `<dialog>` con `showModal()`, o React Aria o Radix.
  - En cada paso, llevar el foco al encabezado y anunciar "Paso 2 de 4: Tus datos".
  - Probar con NVDA, VoiceOver y TalkBack.

### H8 · Scroll de lado en celular: la lista del Chat mide 691 px y el buscador de Bienvenida se sale (Alta)

**Qué pasa:**
- En el Chat (vista de lista), la página mide 708 px de ancho en cualquier celular de 320 a 600 px. "Nuevo parche", "3 chats sin leer", los filtros, las horas y los contadores quedan por fuera.
- En Bienvenida, la página mide 473 px de 320 a 430 px. El botón "Buscar" queda entre x=428 y x=468, fuera de la pantalla, y el selector de ciudad sale cortado.

**Evidencia:**
- Chat: en `Chat.dc.html:23`, por debajo de 899 px la lista pasa a `width:auto; flex:1 1 auto`, y `:80` no tiene `min-width:0` (la sección vecina, en `:145`, sí lo tiene).
- Bienvenida: el `role="search"` de `Bienvenida.dc.html:25` no tiene `min-width:0`, mientras Main, Agenda, Mapa y Chat sí. Además, `:29` tiene `flex-shrink:0`.
- A 320 px también se desbordan Agenda (14 px) y Mapa (6 px), por el selector de fecha.
- Capturas: `auditoria/Chat-390.png`, `auditoria/Bienvenida-390.png` y `audit-tmp/resp/chat-390-lista-viewport.png`.
- Con `min-width:0`, el desborde baja a 0 (probado).

**Por qué importa:** el chat es la función social central y la landing es la puerta de entrada, y las dos se mueven de lado. Incumple WCAG 1.4.10 (Reflow). Hoy, sin la etiqueta viewport (H35), un celular real muestra todo diminuto en lugar del desborde. En cuanto se agregue esa etiqueta, el desborde aparecerá en todos los celulares.

**Cómo arreglarlo (S):**
- Chat: agregar `min-width:0` a `[data-ch~="list"]` dentro de la media query de `Chat.dc.html:23`. Con eso basta.
- Bienvenida: agregar `min-width:0` al buscador y, por debajo de unos 480 px, pasar el selector de ciudad a otra línea o convertirlo en un ícono. Con solo `min-width:0`, el campo queda de 75 px y se lee "¿Qué pla".
- Agenda y Mapa: dejar que el selector de fecha haga salto de línea o tenga su propio scroll.
- En producción, una prueba automática que verifique el ancho de la página a 320 px.

### H9 · No hay cómo reportar ni bloquear, y a uno lo meten a un parche sin preguntarle (Alta)

**Qué pasa:**
- No existe "reportar", "bloquear" ni "denunciar" en ninguna pantalla.
- El panel del chat solo ofrece dividir el pago, silenciar y salir.
- Al crear un parche, los amigos quedan adentro de una vez ("Camila añadió a Laura y Vale"), y el creador no puede sacar a nadie.
- El muro del evento no tiene moderación y "Más opciones" en las publicaciones no hace nada.
- El evento invita a unirse a parches de desconocidos.

**Evidencia:**
- Buscar esas palabras en las 8 pantallas da 0 resultados.
- `Chat.dc.html:425-447`, `:1067-1075` y `:1068`; `Main.dc.html:190` (sin `onClick`); `Evento.dc.html:329-347`, `:298`, `:396-397` y `:1110`; `Perfil.dc.html:48`.
- Script: `audit-tmp/verif-chat-mod.js`.
- Matiz: en la demo solo se puede agregar a alguien de la lista de 7 amigos (`Chat.dc.html:595`).

**Por qué importa:** acoso, spam y estafas sin salida para la víctima, en una red de rumba +18 que junta a desconocidos. Las tiendas lo exigen: la guía 1.2 de Apple pide filtrar, reportar, bloquear y publicar un contacto, y Google Play tiene una política equivalente para contenido de usuarios. Si Fulleventos será app nativa está por confirmar.

**Cómo arreglarlo:**
- **En el diseño (M):**
  - Un menú en cada mensaje, persona, publicación y parche con "Reportar" (con motivos), "Bloquear" y "Salir y reportar". Se puede usar el "Más opciones" de `Main.dc.html:190` y el panel del chat.
  - Entrar a un parche como invitación que se acepta ("Laura te invitó a…").
  - Un ajuste "Quién puede escribirme y agregarme".
  - Que el administrador pueda sacar miembros.
- **En producción:** ver H13.

### H15 · En celular y tableta, el feed de Inicio queda enterrado bajo la barra lateral (Alta)

**Qué pasa:** Main no se adapta a pantallas angostas. Las tres columnas se apilan en el orden de escritorio, así que el perfil, los 7 enlaces del menú y "Tus parches" aparecen antes del feed.

**Evidencia:**
- `Main.dc.html:72`, `:74` (`max-width: 260px`), `:118` y `:254` (`340px`).
- El primer post aparece en y=1443 a 390×844 (1,7 pantallas) y en y=1209 a 768×1024. A 768 px, la columna ocupa 260 de 720 px y el resto queda en blanco.
- Las tres columnas solo caben a partir de unos 1116 px. A 1024 px, "Descubre" baja al final del feed.
- Capturas: `audit-tmp/resp/Main-390_00.png`, `audit-tmp/resp/Main-768_00.png` y `audit-tmp/verif-main/Main-1024-scrolled.png`.

**Por qué importa:** la pantalla principal del usuario con sesión no muestra lo principal (a qué planes va su gente) sin un scroll largo.

**Cómo arreglarlo:**
- Arreglo mínimo (S): reglas `@media` en el `<helmet>` (`Main.dc.html:13-18`) que apunten a cada `aside` por su `aria-label` para cambiarles `order`, `display` y `max-width`.
- Rediseño (M), con dos puntos de quiebre:
  - Hacia 1120 px, "Descubre" se oculta o pasa a ocupar todo el ancho.
  - En tableta y celular, la barra izquierda se vuelve una barra inferior. Primero van las historias y el feed, y "Tu semana", el mini-mapa y las sugerencias pasan a tarjetas intercaladas o a un carrusel.

### H16 · Elementos con foco quedan 100 % tapados por las barras fijas (WCAG 2.4.11) (Alta)

**Qué pasa:** al navegar con Tab o con Shift+Tab, el control con el foco queda debajo de la barra "Comprar" o del encabezado fijo, así que no se ve dónde está el foco.

**Evidencia:**
- Evento a 390 px: 11 controles quedan 100 % bajo la barra de compra de 69 px (`Evento.dc.html:516`), entre ellos los atajos "Sobre el evento" a "Ubicación", "General", "Armar parche", las pestañas y "Unirme". Con Shift+Tab, otros 11 quedan bajo el encabezado de 125 px ("Me interesa", "Voy", "Ver localidades"…).
- Bienvenida con Shift+Tab:
  - A 390 px, el encabezado mide 215 px y deja 43 controles tapados.
  - A 768 px, deja 21.
  - A 1280 px, los pines de Santa Marta y Barranquilla quedan tapados.
- Solo hay `scroll-margin-top`, que sirve para los saltos por ancla pero no para el Tab.
- Es el patrón de la falla F110 de WCAG. El caso "General" a 1280 px (tapado entre el 54 % y el 60 %) es del criterio 2.4.12, nivel AAA, así que no cuenta para AA.
- Capturas: `audit-tmp/adv-cover/`.

**Por qué importa:** quien navega con teclado no sabe qué va a activar al oprimir Enter.

**Cómo arreglarlo (S):** `scroll-padding` por punto de quiebre, según la altura real del encabezado.
- **Evento:** `html{scroll-padding-top:90px}` (140 px desde 980 px) y `scroll-padding-bottom:84px` por debajo de 979 px. Probado: 0 controles tapados a 390, 768 y 1280 px.
- **Bienvenida:** 90 px sirven en escritorio, pero en celular hacen falta 230 px. Es mejor compactar ese encabezado a una sola fila o quitarle el *sticky* por debajo de unos 768 px (ver H40).

### H17 · Faltan las pantallas de pago pendiente, rechazado, reserva vencida, agotado, carga y error (Media)

**Qué pasa:**
- El checkout pasa de "Pagar" a "¡Listo!" sin estados intermedios. La propia pantalla dice que hay que aprobar en la app de Nequi o Daviplata, o en la ventana del banco con PSE y Bancolombia, pero no muestra esa espera.
- El temporizador dice "Tus boletas están reservadas" desde el paso 1, cuando todavía no se ha elegido nada, y no corre.
- "No sales de Fulleventos" contradice que PSE y Bancolombia abren la ventana del banco.
- No hay estados de carga ni de error en ninguna pantalla.

**Evidencia:**
- `Evento.dc.html:1062-1080`, `:1277`, `:752`, `:767`, `:779`, `:560`, `:1232` y `:905`.
- Buscar "rechaz", "esperando", "procesando", "venci", "cargando", "error", "reintentar" o "sin conexión" en las 8 pantallas da 0 resultados. El único "pendiente" es el de los amigos del parche (`:829`).
- Scripts: `audit-tmp/verify-pay.js` y `audit-tmp/checkout-states.js`.

**Por qué importa:** los casos más comunes de un pago real en Colombia no están diseñados, así que el equipo técnico los va a improvisar y el usuario no sabrá si pagó.

**Cómo arreglarlo (M):** diseñar estas pantallas.
- "Procesando…", con el botón deshabilitado.
- "Aprueba el pago en tu app Nequi o Daviplata (tienes X min)", con opción de cancelar o cambiar de medio.
- "Te llevamos a tu banco" y "Volviste de PSE: estamos confirmando tu pago".
- "Pago rechazado: intenta con otro medio", sin perder lo que ya se llenó.
- "Pago en verificación: te avisamos por correo".
- "Tu reserva venció, ¿la renovamos?".
- "Se agotó esta localidad".

Además:
- Mostrar el temporizador solo después de elegir localidad y cantidad, con una cuenta regresiva real.
- Pedir o precargar los datos antes de que arranque la reserva. Es lo que recomienda el W3C para que la compra con tiempo límite cumpla WCAG 2.2.1.
- Esqueletos de carga y errores con "Reintentar" en las listas, el mapa y el chat.
- Lo que hace falta en el servidor está en H2 y H3.

### H20 · "Mis boletas" no existe (Media)

**Qué pasa:** tres textos prometen "Mis boletas", pero el botón "Ver mis boletas" lleva al perfil, donde no hay ninguna boleta.

**Evidencia:**
- `Evento.dc.html:841-842`, `:1266` y `:1288`.
- `Perfil.dc.html:132-135` solo tiene las pestañas "Próximos planes", "Recuerdos" y "Reseñas", y la palabra "boleta" aparece 0 veces en Perfil. El menú de `Main.dc.html:96-101` tampoco tiene una entrada.
- Captura: `audit-tmp/perfil-tras-compra.png`.
- No bloquea: "Volver al evento" y "Ver boleta" (`:419`, `:522`) vuelven a abrir la boleta.

**Por qué importa:** justo después de pagar es el momento de más ansiedad, y en la puerta del evento es lo que la persona necesita.

**Cómo arreglarlo:**
- **En el diseño (S):** una pantalla propia, accesible desde el menú de Main y desde el avatar, con:
  - boletas próximas y pasadas;
  - QR a pantalla completa;
  - nombre de cada asistente;
  - estado de las partes de pago;
  - "Transferir" (H32) y "Solicitar devolución" (H27).
- **En producción (L):** órdenes guardadas en el servidor, QR dinámico y funcionamiento sin conexión.

### H21 · El precio que se ve no incluye el cargo por servicio, y no se aclara el IVA (Media)

**Qué pasa:** las tarjetas dicen "Desde $45.000". La barra móvil y el panel muestran el subtotal ("2 boletas · $90.000"). El 8 % solo aparece en el checkout (total $97.200), y nunca se dice si incluye IVA.

**Evidencia:**
- `Evento.dc.html:1215`, `:449-450`, `:409` ("+ cargo por servicio", sin porcentaje), `:289`, `:900`, `:857` y `:953-954`.
- `Bienvenida.dc.html:406`; `Chat.dc.html:855` y `:959`.
- Según research.json, la Ley 1480, art. 50, exige mostrar el precio total con cargos, y el cargo de la plataforma causa IVA del 19 %. El resumen del checkout sí cumple.

**Por qué importa:** el +8 % aparece por sorpresa al final, lo que genera abandono y reclamos. Si el "Desde" sin cargo incumple la ley es una interpretación que está por confirmar con un abogado.

**Cómo arreglarlo (S):**
- En la barra móvil y en el panel: "Total $97.200 (incluye cargo por servicio)".
- En las tarjetas: "Desde $45.000 + cargo por servicio" o "Desde $48.600 con cargos", con el mismo formato en todas las pantallas.
- En el resumen: "Cargo por servicio (IVA incluido)", o el desglose.

### H22 · La cantidad arranca en 2 boletas (Media)

**Qué pasa:** el estado inicial es de 2 boletas, y en celular el selector de cantidad no se ve sin bajar.

**Evidencia:** `Evento.dc.html:887` (`qty: 2`). La barra móvil dice "2 boletas · $90.000". En el paso 1, a 390×844, el selector queda debajo del primer pantallazo (`audit-tmp/resp/ev-390-co1.png`).

**Por qué importa:** quien va solo puede pagar dos boletas sin darse cuenta, y eso trae devoluciones y contracargos.

**Cómo arreglarlo (S):** arrancar en 1 o pedir la cantidad de forma explícita, y subir el selector para que quede junto a la localidad.

### H23 · El checkout y el registro no validan los datos ni explican los errores de forma accesible (Media)

**Qué pasa:**
- Solo se revisa que los campos no estén vacíos. Pasan el documento "abc" o "123", el correo "no-es-un-correo" y el celular "1".
- Se puede pagar con tarjeta dejando los campos vacíos, o con Nequi sin escribir el celular.
- La confirmación dice "La boleta también te llega al correo no-es-un-correo".
- Ningún campo está marcado como obligatorio. La pista "Escribe tu número de documento…" aparece debajo del botón deshabilitado, sin anunciarse, y "MM/AA" solo existe como placeholder.
- Registro avanza con todo vacío.
- Falta el PPT entre los tipos de documento.

**Evidencia:**
- `Evento.dc.html:1050-1051`, `:652-653` (sin `required`, `aria-required`, `aria-invalid` ni `aria-describedby`), `:870-871`, `:705-717`, `:712` y `:647-651`.
- `Registro.dc.html:57-63`.
- Scripts: `ev2.js`, `ev4.js` y `audit-tmp/a11y/ev-checkout2.js`.

**Por qué importa:**
- Saldrían boletas a nombre de documentos inválidos, y en un evento +18 se pide el documento en la puerta.
- Habría correos que nunca llegan.
- Quien usa lector de pantalla no sabe por qué no puede pagar (WCAG 3.3.1, 3.3.2 y 4.1.3).

**Cómo arreglarlo (S):**
- Errores por campo con `aria-invalid` y `aria-describedby`:
  - CC: solo números, de 6 a 10 dígitos.
  - Pasaporte: alfanumérico.
  - Correo: formato válido.
  - Celular: 10 dígitos que empiecen por 3.
- Marcar "obligatorio" en la etiqueta.
- Al intentar continuar, mostrar un resumen de errores arriba. El botón queda activo con `aria-disabled` y, al pulsarlo, muestra los errores.
- Poner "MM/AA" como texto de ayuda visible.
- Exigir el celular de Nequi y Daviplata.
- Agregar el PPT.
- **En producción:** validar también en el servidor. Los datos de la tarjeta los valida la pasarela.

### H24 · Mesa VIP con pago dividido: lo que se paga y las boletas no cuadran, y sale "Boleta oficial" antes de completar (Media)

**Qué pasa:** con un solo amigo, la pantalla dice "Tú pagas 1 de 2 · $172.800", o sea, la mitad de la mesa. Pero la boleta dice "BOLETA OFICIAL · Tu boleta · 1 de 4" y ya trae QR. Los puestos 3 y 4 solo tienen un nombre opcional y terminan sin titular ni QR. El parche dice "Van 2", y al pasar a VIP los amigos se recortan a 3 sin aviso. Los montos sí cuadran: 2 × $172.800 = $345.600.

**Evidencia:** `Evento.dc.html:950-957`, `:1069-1072`, `:829`, `:668-670` y `:1011-1028`. Captura: `audit-tmp/vipsplit-dialog.png`.

**Por qué importa:** no queda claro cuántas personas entran ni quién paga los puestos vacíos, y eso le resta confianza al diferenciador del producto.

**Cómo arreglarlo (S–M):**
- Mientras la mesa no esté pagada, mostrar "Mesa apartada · falta 1 pago · vence [PLAZO]" en lugar de "Boleta oficial" y QR.
- Usar una etiqueta coherente: "pagaste 1 de 2 partes (4 puestos)".
- Explicar en el paso 1 quién usa los puestos 3 y 4, o dividir siempre entre los 4 puestos.
- Avisar cuando se recortan amigos.
- Las reglas de negocio están en H18.

### H25 · "Para mi parche" ofrece comprarles boleta a quienes ya la tienen, y no a quienes les falta (Media)

**Qué pasa:**
- Los 7 amigos que se pueden elegir en el checkout son justo los 7 que, según el chat, ya tienen boleta.
- Los 4 que no la tienen solo aparecen como "Y 4 miembros más" y no se pueden elegir.
- El parche dice "6 de 8 cupos" en un lugar y "12 miembros" en otro.
- A Camila, que ya es miembro, se le ofrece "Unirme".

**Evidencia:** `Evento.dc.html:909-917`, `:1247`, `:1100` y `:609`; `Chat.dc.html:610-611` ("7 de 12 con boleta"); `Main.dc.html:108`.

**Por qué importa:** en producción saldrían boletas duplicadas y vendrían devoluciones. En pruebas con usuarios, la historia estrella (comprar con el parche) no se sostiene.

**Cómo arreglarlo (S):**
- Mostrar el estado de cada miembro ("Ya tiene boleta", deshabilitado) y dejar elegir a quienes no la tienen.
- Unificar los datos del parche.
- Mostrar "Estás dentro" a Camila.

### H26 · Después de comprar, el estado queda inconsistente: una segunda compra borra la primera (Media)

**Qué pasa:**
- La compra se guarda en una sola variable que se sobrescribe. Después de comprar una Mesa VIP dividida y luego 2 boletas General, solo queda "Tienes 2 boletas · General".
- "Ver boleta" interrumpe una compra en curso.
- Se puede volver de "Vas a ir" a "Voy" teniendo boletas.
- "340 interesados" no cambia aunque se marque "Me interesa".
- La pantalla saluda "¡Listo, Camila!" aunque el titular sea Juan Pérez.
- El número de orden es el mismo en todas las compras.

**Evidencia:** `Evento.dc.html:1065-1078`, `:1216`, `:1219-1224`, `:66`, `:144`, `:788` y `:810` (`#FE-2026-10-00421`). Script: `ev3.js`.

**Por qué importa:** el usuario creería que perdió su mesa o el pago pendiente de su parche.

**Cómo arreglarlo (S):**
- Guardar las compras como lista de órdenes y mostrar el acumulado ("Tienes 6 boletas en 2 órdenes").
- Abrir "Ver boleta" en un visor aparte que no toque el checkout.
- Advertir si se quita "Voy" teniendo boletas.
- Sumar al contador de interesados.
- Usar el nombre del titular y generar un número de orden por compra.

### H27 · No se informan el retracto ni las devoluciones antes de pagar (Media)

**Qué pasa:** el paso de pago no menciona retracto, devolución ni cancelación. El único lugar con algo parecido es "Cambios y devoluciones: [POLÍTICA DE LA BOLETERA]", en la sección "Lo que debes saber".

**Evidencia:**
- Paso 3 en `Evento.dc.html:685-780` (verificado en Chromium; captura `audit-tmp/step3-390.png`). La palabra "retracto" aparece 0 veces en las 8 pantallas. La mención está en `Evento.dc.html:1142`.
- Según research.json:
  - El art. 47 de la Ley 1480 da 5 días hábiles de retracto. Que aplique a boletas de eventos que son en más de 5 días hábiles es una interpretación.
  - El art. 50, literal c, obliga a informar el retracto en el comercio electrónico (la redacción exacta está por confirmar).
  - La Circular SIC 004 de 2022 regula las cancelaciones, y la SIC ordenó a Tuticket reembolsar 17 eventos cancelados.
- El plazo de devolución está por confirmar: research.json dice 30 días, pero según búsquedas la Ley 2439 de 2024 lo habría bajado a 15 días calendario.

**Por qué importa:** el comprador paga sin saber si puede arrepentirse ni cómo le devuelven la plata. Eso trae quejas ante la SIC y reversiones. En producción sería un incumplimiento.

**Cómo arreglarlo:**
- **En el diseño (S):** un bloque corto encima de "Pagar" con:
  - "Retracto: aplica / no aplica porque el evento es el [fecha]".
  - "Si cancelan o cambian el evento: te devolvemos [%] en [X] días al mismo medio de pago".
  - Quién hace la devolución.
  - Enlace a la política completa.
- "Solicitar devolución" dentro de "Mis boletas" (H20).
- **En producción:** la política real y el proceso de devolución. Un abogado debe decir si el cargo por servicio también se devuelve.

### H28 · Se piden datos sin decir para qué ni con quién se comparten, y la autorización va amarrada a los términos (Media)

**Qué pasa:**
- El paso 2 pide el documento con un solo texto: "La boleta sale a tu nombre…". El dato nuevo es el número de documento, más los nombres opcionales de otros asistentes.
- La autorización llega en el paso 3, en una sola casilla que mezcla los términos con la política de Fulleventos y de [BOLETERA]. Al organizador no se le menciona.
- Los enlaces a los documentos legales quedarían dentro de un botón, algo que el HTML no permite.
- En Registro, el texto legal queda debajo de "Continuar con Google", fuera de la primera pantalla.
- El paso 3 de Registro dice "Está en tus contactos" sin que el usuario haya dado permiso.

**Evidencia:**
- `Evento.dc.html:640-658` y `:770-775`. La casilla sí es obligatoria (`:1059`), y eso está bien.
- `Registro.dc.html:54-55`, `:64` (en y=1116 px con una pantalla de 844) y `:155-156`.
- Decreto 1377 de 2013: el art. 5 pide la autorización a más tardar al recolectar los datos y exige informar las finalidades. Según el art. 7, el silencio no cuenta como autorización.
- Scripts: `audit-tmp/priv-check.js` y `audit-tmp/priv-check2.js`.

**Por qué importa:**
- Si en producción el paso 2 ya le envía los datos a la boletera para reservar, la autorización llegaría tarde (por confirmar).
- Quien entra con Google no ve el aviso.
- No se pueden leer los términos antes de aceptarlos.

**Cómo arreglarlo (S):**
- Un aviso corto junto al documento: para qué se pide (boleta nominativa y control de acceso), con quién se comparte ([ORGANIZADOR], [BOLETERA], [PASARELA]), por cuánto tiempo, y un enlace a la política.
- Dos casillas separadas: términos de la compra y autorización de datos. Si se va a hacer publicidad, una tercera casilla opcional.
- Una casilla nativa con una etiqueta corta y los enlaces por fuera. Los enlaces abren en un panel sin perder lo ya llenado.
- En Registro, poner el texto legal antes de los dos botones y una pantalla propia para el permiso de contactos (o cambiar el texto "Está en tus contactos").
- **En producción:** guardar la prueba de cada autorización (ver H12).

### H30 · Se expone dónde y cuándo estará cada persona: compras publicadas por defecto y parches abiertos con punto de encuentro (Media)

**Qué pasa:**
- El chat del parche publica solo quién compró, cuántas boletas y en qué localidad, y marca a cada miembro con "Tiene boleta" o "Sin boleta".
- El perfil muestra el barrio y los próximos planes con fecha y lugar.
- El checkout trata "Avisar a mi parche" como algo voluntario, lo que contradice la publicación automática.
- No hay ningún ajuste de privacidad.
- Los parches públicos del evento dicen "Pre en la casa de Laura a las 7:30" y "Uber compartido desde Suba · 8:15 p. m.", y "Unirme" deja entrar sin aprobación.

**Evidencia:**
- `Chat.dc.html:620`, `:655`, `:683` y `:394-399`.
- `Perfil.dc.html:44` y `:147-153`.
- `Evento.dc.html:836`, `:1100-1102` y `:1112-1116`.
- `Main.dc.html:394` y `:441-443`.
- Buscar "privacidad" o "Eliminar cuenta" da 0 resultados fuera del texto legal.

**Por qué importa:** cualquiera puede saber dónde y a qué hora va a estar una persona, lo que crea riesgo de acoso o robo y presión social. Un desconocido podría llegar al punto de encuentro antes de una rumba +18. Según research.json, los chats y las compras son datos personales (Ley 1581), y el titular tiene derecho a conocerlos, corregirlos y suprimirlos.

**Cómo arreglarlo (M):**
- Que avisar de una compra sea siempre voluntario, y sin cantidad ni localidad.
- Un ajuste "Quién ve mis planes" (amigos, parche o nadie), con el barrio visible solo para los amigos.
- Una sección "Privacidad y datos" con descargar los datos, corregirlos, eliminar la cuenta y revocar la autorización.
- Tres tipos de parche: abierto, con aprobación y privado. El punto de encuentro solo lo ven los miembros aprobados.
- Detectar "casa de" o direcciones en las descripciones públicas.
- Consejos de seguridad al unirse y la opción de reportar el parche (H9).

### H33 · El visitante sin cuenta termina en pantallas de usuario con sesión: falta la página pública del evento (Media)

**Qué pasa:** desde la landing pública, "Ver toda la agenda" abre "Agenda para ti" con el avatar de Camila, "Comprar" abre Evento con "Volver al feed", el mapa abre la versión con sesión y "Entrar" lleva directo al feed, sin pantalla de inicio de sesión.

**Evidencia:** `Bienvenida.dc.html:51`, `:53`, `:195` y `:409`; `Evento.dc.html:30` y `:49`; `Registro.dc.html:24`.

**Por qué importa:** las páginas de evento, agenda y mapa son las que Google posiciona y las que la gente comparte por WhatsApp. Deben funcionar sin sesión y pedir cuenta solo en el momento de la acción.

**Cómo arreglarlo (M):**
- Versiones públicas con encabezado "Entrar / Crear cuenta" y todo el contenido visible.
- Pedir la cuenta solo al tocar "Comprar", "Voy" o "Unirme", y devolver al usuario al mismo punto después de registrarse.
- Diseñar la pantalla "Entrar" (ver H12).

### H35 · Falta la etiqueta viewport: abierto directo en un celular, se ve la versión de escritorio en miniatura (Media)

**Qué pasa:** ninguna pantalla declara la etiqueta viewport y el runtime tampoco la agrega. Por eso, en un celular real, la página se dibuja a 980 px y se reduce.

**Evidencia:**
- Emulando un celular real (Chromium con `isMobile`, 390 px), las 8 pantallas se dibujan a 980 px con escala 0,40. En Evento, la barra de compra móvil queda oculta.
- Probado en copias: con la línea dentro de `<helmet>`, el runtime la sube al `<head>` y 6 de las 8 pantallas quedan a 390 px. Bienvenida y Chat se desbordan (H8).
- Dentro de un iframe que sí tiene viewport (como lo haría un visor), Evento se ve bien aun sin la etiqueta. Cómo lo muestra el visor real del lienzo está por confirmar.
- Script y capturas: `audit-tmp/adv-viewport/`.

**Por qué importa:** si alguien abre el prototipo en su propio celular durante una prueba, lo verá diminuto y sin la barra de compra.

**Cómo arreglarlo (S):** agregar `<meta name="viewport" content="width=device-width, initial-scale=1">` dentro de `<helmet>` en las 8 pantallas, al mismo tiempo que se corrige H8.

### H36 · Todas las tarjetas abren la misma página de evento (Media)

**Qué pasa:** los 19 eventos enlazan al mismo archivo. "Rock en el Movistar Arena · Desde $180.000" abre un evento de $45.000, y "Ver plan" de un evento gratis (Vallenato en el Gran Malecón) abre un evento pagado con botón "Comprar". Las noticias, "Sube tu plan" en Main y "Comprar mi boleta" del parche Rockeros en el Chat también abren la salsa.

**Evidencia:** `href: 'Evento.dc.html'` en `Agenda.dc.html:328`, `Bienvenida.dc.html:409` y `Mapa.dc.html:410`, más 24 enlaces fijos en las plantillas.

**Por qué importa:** en pruebas, los usuarios creen que cambió el precio o el evento, y eso produce falsos hallazgos de usabilidad.

**Cómo arreglarlo (M):**
- Duplicar Evento para 2 o 3 casos (pagado, gratis, fútbol), o marcar "Demo: solo este evento".
- Hacer que "Sube tu plan" abra el campo para publicar.
- En producción, ver H34.

### H37 · El mismo evento muestra hora, asistentes y estado distintos según la pantalla (Media)

**Qué pasa:**
- **Hora:** 9:00 p. m. en Inicio; "Puertas 8:00 · Show 9:30" en Evento; 8:00 p. m. en el Chat.
- **Asistentes:** "24 van · 3 amigos" en Inicio (texto fijo para todos los posts) frente a "186 van" y "10 amigos más" en Evento.
- **Estado:** Inicio dice "Vas", Perfil dice "Va" y Evento arranca en "Voy". "Tu semana" cuenta el evento como confirmado, pero el Chat dice "Sin boleta".
- **Clásico capitalino:** el lateral dice "4 de 6 cupos" y el post ofrece "Unirme" aunque Camila ya es miembro. Al unirse, el post sube a "5 de 6" y el lateral sigue en "4 de 6".
- **Contadores:** "Planes 38" frente a "Eventos 38".
- **Historias de ejemplo:** Andrés llega a Bogotá el jueves y el mismo viernes abre un parche en Medellín. Juan Pablo reseñó "ayer" el stand-up del domingo 11, que todavía no ha pasado.

**Evidencia:**
- `Main.dc.html:81`, `:114`, `:259`, `:390`, `:393-396`, `:404-405` y `:430`.
- `Evento.dc.html:64`, `:87-88`, `:144`, `:886` y `:1176`.
- `Chat.dc.html:599`, `:621` y `:668`.
- `Perfil.dc.html:54`.

**Por qué importa:** la hora es el dato que la gente usa para llegar. Las contradicciones restan confianza y se notan en las pruebas con usuarios.

**Cómo arreglarlo (S):**
- Un solo bloque de datos de ejemplo, revisado.
- Diferenciar "Voy" de "Tengo boleta".
- Reseñas solo después del evento y solo de asistentes.
- En producción, ver H53.

### H38 · 25 botones no hacen nada, incluidos "Crear evento" y la campana de notificaciones (Media)

**Qué pasa:** botones sin ninguna acción en casi todas las pantallas. Ningún buscador del encabezado filtra, y el selector de ciudad del Chat no hace nada.

**Evidencia:**
- **Main (11):** `:63`, `:66`, `:140`, `:142`, `:144`, `:146`, `:148`, `:190`, `:242`, `:244`, `:246`.
- **Evento (5):** Notificaciones `:46`, Invitar amigos `:130`, Compartir `:132`, Armar parche `:300`, Enviar del muro `:335`.
- **Agenda (3):** `:59`, `:61`, `:165`.
- **Mapa (2):** `:65`, `:67`.
- **Chat (2):** `:69`, `:71`.
- **Bienvenida:** Buscar `:46`.
- **Registro:** contactos `:93`.
- Selector de ciudad: `Chat.dc.html:1106`.
- A "Crear evento" le falta `type="button"` en Agenda, Main y Mapa.

**Por qué importa:** son clics muertos en las pruebas. "Crear evento" representa todo el lado del organizador.

**Cómo arreglarlo (M):**
- Conectar los que ya tienen pantalla: "Armar parche" a "Nuevo parche" del Chat, y "Guardar" de Main igual que en Agenda.
- Para los demás, mostrar "Próximamente" o quitarlos. En "Crear evento", un formulario de contacto para organizadores sirve además como validación comercial.
- Ver H14 y H54.

### H39 · Los filtros de fecha no filtran, y la landing ofrece "Planes con amigos" a quien no tiene cuenta (Media)

**Qué pasa:** "Hoy" y "Próxima semana" solo cambian el botón marcado. El título sigue en "Este finde en Colombia", siguen las 19 tarjetas y el texto "del viernes 9 al lunes festivo 12" no cambia. En la landing, "Planes con amigos" en realidad filtra los eventos con parches abiertos.

**Evidencia:** `Agenda.dc.html:246-248`, `Mapa.dc.html:308-310` y `:456`, `Bienvenida.dc.html:387`. Script: `audit-tmp/resp/when.js`.

**Por qué importa:** el usuario cree que hay planes para hoy, o que el filtro está roto.

**Cómo arreglarlo (S):**
- Filtrar de verdad y actualizar el título y los conteos.
- Si no hay planes, un estado vacío honesto ("Hoy no hay planes en tu ciudad: mira el finde"). Si no, quitar el control.
- Renombrar el filtro de la landing a "Con parches abiertos".

### H40 · En celular, el encabezado fijo ocupa entre un cuarto y un tercio de la pantalla (Media)

**Qué pasa:** el encabezado *sticky* reparte logo, búsqueda, ciudad, 5 íconos sin texto, "Crear evento" y avatar en 3 o 4 filas.

**Evidencia:**
- Mide 215 px en Bienvenida y 224 px en Main, Agenda y Mapa. Eso es entre el 25 % y el 27 % de una pantalla de 390×844, y entre el 34 % y el 35 % de una de 360×640.
- En Evento, 125 px de encabezado más los 69 px de la barra de compra.
- `Agenda.dc.html:22`; íconos en `Main.dc.html:49-68`. Captura: `audit-tmp/resp/agenda-390-scroll.png`.

**Por qué importa:** se ve muy poco contenido por pantalla, hay que adivinar qué significa cada ícono, y empeora H16.

**Cómo arreglarlo (M):**
- Un encabezado móvil de una fila (56 a 64 px, con logo, lupa y avatar) que se esconda al bajar.
- Una barra inferior con 5 pestañas con texto: Inicio, Agenda, Mapa, Mensajes y Perfil.
- "Crear" como acción secundaria.

### H41 · Navegación y patrones inconsistentes: cinco encabezados, "Volver al feed" fijo y una búsqueda que no busca (Media)

**Qué pasa:**
- Hay cinco variantes de encabezado.
- "Volver al feed" siempre lleva a Main, aunque el usuario venga de Agenda, Mapa o la landing.
- La búsqueda tiene 3 textos distintos y ninguna lógica.
- Agenda tiene un selector "Lista / Mapa", pero Mapa no tiene "Lista" para volver.
- Los márgenes laterales en celular son de 16 px en unas pantallas y de 24 px en otras.
- Repostear abre una ventana en Agenda y es instantáneo en Mapa.
- "Guardar" es un corazón en Agenda, pero en Main el corazón es "Me gusta".
- En el Chat, buscar "provenza" no encuentra la conversación donde se compartió ese evento.

**Evidencia:**
- Encabezados: `Bienvenida.dc.html:49-55`, `Evento.dc.html:27-52` y `Perfil.dc.html:21-34`.
- "Volver al feed": `Evento.dc.html:29` y `Perfil.dc.html:23`.
- Búsqueda: `Bienvenida.dc.html:27` y `:45`, `Main.dc.html:28`, `Agenda.dc.html:28`.
- Selector Lista/Mapa: `Agenda.dc.html:76-81`. Repostear: `Agenda.dc.html:335-342` y `Mapa.dc.html:415`. Chat: `Chat.dc.html:754`.

**Por qué importa:** el usuario tiene que aprender reglas distintas en cada pantalla, y la búsqueda (una vía principal para descubrir planes) no tiene pantalla de resultados.

**Cómo arreglarlo (M):**
- Un componente de encabezado para la app con sesión (con una variante "detalle") y otro para visitantes.
- Que "Volver" regrese a la pantalla de origen.
- Una pantalla de resultados de búsqueda con sus estados vacío y de carga.
- Un solo patrón para repostear y el ícono de marcador para guardar.
- Una búsqueda de chats que incluya los eventos compartidos.
- Un margen lateral único.

### H42 · Mapa en celular: tocar una ciudad o "Ver en el mapa" no muestra el resultado, y los saltos entre pantallas pierden el contexto (Media)

**Qué pasa:**
- A 768 px, al tocar Medellín el mapa hace zoom, pero la lista queda en y=1434 px, fuera de la pantalla.
- "Ver en el mapa: Leticia" deja al usuario con el mapa fuera de vista.
- "Ver Cali en el mapa" (desde Main) abre "Toda Colombia".
- "Escribir al organizador" abre el Chat en "Salseros de jueves", no en la conversación con Galería Café Libro.

**Evidencia:** `Mapa.dc.html:210` y `:429`, `Main.dc.html:177`, `Evento.dc.html:396`. Capturas: `audit-tmp/resp/mapa-768-medellin.png` y `audit-tmp/resp/mapa-390-vermapa-despues.png` (el scroll vertical pasa de 5913 a 1191).

**Por qué importa:** en celular, la función estrella del mapa parece no responder.

**Cómo arreglarlo (M):**
- Por debajo de 980 px, una hoja que sube desde abajo con los planes de la ciudad, o un botón flotante "Ver 3 planes en Medellín".
- Desplazar hasta el mapa y resaltar el pin.
- Abrir el Mapa y el Chat en la ciudad o conversación correcta, si el formato lo permite (por confirmar).
- **En producción:** direcciones con parámetros, por ejemplo `/mapa?ciudad=cali`.

### H43 · Chat en celular: la conversación abre en los mensajes más viejos, debajo del encabezado de la app (Media)

**Qué pasa:** por debajo de 899 px el historial deja de tener scroll propio, así que se mueve toda la página y se pierde el anclaje al último mensaje que sí funciona en escritorio.

**Evidencia:** `Chat.dc.html:23` y `:213`. A 390 px la página mide 2494 px y lo primero que se ve es "AYER". El nombre aparece cortado ("Salseros…") y el campo de texto muestra "Escríbele al pa". Captura: `audit-tmp/resp/chat-390-conv-viewport.png`.

**Por qué importa:** en un chat la gente espera ver lo último, y aquí tiene que bajar toda la página cada vez que entra.

**Cómo arreglarlo (M):**
- Abrir la conversación a pantalla completa, sin el encabezado de la app.
- Darle al historial su propio scroll (alto de 100dvh menos la barra superior y el campo de texto) y conservar `column-reverse`.
- Agrupar los 3 íconos de adjuntar en un solo botón "+".

### H44 · En la landing, los planes a la venta aparecen después de 5 pantallas en celular (Media)

**Qué pasa:** el orden de las secciones es héroe, Cómo funciona, Mapa, Noticias y, al final, "Este finde en Colombia".

**Evidencia:** el primer botón "Comprar" está en y=4623 a 390×844 (5,5 pantallas) y en y=3267 a 1280×900 (3,6 pantallas). Script: `audit-tmp/resp/bien-order.js`.

**Por qué importa:** quien llega desde un anuncio o un enlace no ve rápido qué hay este fin de semana. Eso significa menos clics a eventos y menos registros.

**Cómo arreglarlo (S):**
- Subir "Este finde" justo después del héroe (en celular, como carrusel de 4 a 6 tarjetas).
- Bajar Noticias al final.
- Mantener corto "Cómo funciona".

### H45 · Registro: el paso 1 avanza vacío, lo escrito se borra, no pide la ciudad y el formulario queda bajo un bloque decorativo (Media)

**Qué pasa:**
- "Continuar" pasa al paso 2 con todo vacío, y si el usuario se devuelve, lo que escribió desapareció.
- Solo pide "Barrio o localidad · Ej. Chapinero", un término de Bogotá, aunque la landing promete "elige tu ciudad" y el Mapa tiene fijo "Mi ciudad: Bogotá".
- El contador dice "1 elegidos".
- A 390×844 el primer campo está en y=787 y "Continuar" termina en y=1099. El bloque oscuro de unos 470 px se repite en los 3 pasos.

**Evidencia:** `Registro.dc.html:58-63`, `:61` y `:81`; `Bienvenida.dc.html:255`. Captura: `audit-tmp/resp/reg-390-p2-full.png`.

**Por qué importa:** una app nacional depende de la ciudad para personalizar, y perder lo escrito al devolverse genera abandono.

**Cómo arreglarlo (S):**
- Guardar lo escrito entre pasos y validar (H23).
- Pedir "Ciudad" como lista desplegable y dejar el barrio como opcional.
- Corregir singular y plural.
- En celular, reducir el bloque decorativo a una franja de unos 80 px con "Paso 1 de 3".
- El permiso de contactos está en H28. La verificación por código y la edad, en H12 y H10.

### H46 · El perfil propio muestra "Seguir" y "Mensaje", y todos los perfiles abren el de Camila (Media)

**Qué pasa:** Camila puede seguirse a sí misma (sus seguidores suben de 412 a 413), y tocar a Laura o a cualquier avatar del Chat abre el perfil de Camila.

**Evidencia:** `Perfil.dc.html:43-48` y `:176-181`, `Main.dc.html:185`, `Chat.dc.html:241`.

**Por qué importa:** confunde en las pruebas, y no existe un lugar para editar el perfil ni para llegar a la privacidad (H30) o a "Mis boletas" (H20).

**Cómo arreglarlo (S–M):**
- Una variante "Mi perfil" con Editar perfil, Mis boletas, Guardados y Ajustes y privacidad.
- Otra variante "Perfil de otra persona" con Seguir, Mensaje y Reportar o Bloquear.

### H47 · Agenda y Mapa muestran todos los eventos sin paginar (Media)

**Qué pasa:** todas las tarjetas se muestran de una vez y cada una es muy alta en celular.

**Evidencia:**
- A 390 px, Agenda mide 11.110 px (la lista sola, 9.732 px) con 972 nodos (42 por tarjeta). Mapa tiene 1.026 nodos. Lighthouse empieza a advertir desde unos 800.
- Cada tarjeta mide entre 510 y 530 px.
- Bienvenida sí limita a 8 tarjetas con "Ver N planes más" (`:281`, `:399`, `:444`).

**Por qué importa:** con un catálogo real habrá un scroll interminable, más consumo de datos móviles y lentitud.

**Cómo arreglarlo:**
- **En el prototipo (S):** el mismo patrón de Bienvenida, una tarjeta compacta horizontal en celular (miniatura de 88 px) y agrupación por día.
- **En producción:**
  - Paginación desde la base de datos (unos 20 eventos por página) con "Cargar más".
  - Virtualizar las listas de más de 100.
  - Que el mapa pida solo los eventos del área visible y agrupe los marcadores.

### H48 · La insignia "Organizador verificado" no explica qué se verificó y no aparece donde se paga (Media)

**Qué pasa:** la insignia sale en el Chat, pero no en la tarjeta del organizador del evento. Además, el nombre de un parche es texto libre de hasta 40 caracteres y los avatares son iniciales, así que un parche llamado "Galería Café Libro · Oficial" se vería casi igual al organizador.

**Evidencia:** `Chat.dc.html:112`, `:154`, `:366`, `:639` y `:469`; `Evento.dc.html:389-397`.

**Por qué importa:** los usuarios pueden confiar en una cuenta que imita al organizador o, al revés, desconfiar del real justo en la página de pago.

**Cómo arreglarlo (M):**
- Definir qué se verifica: RUT o NIT, cámara de comercio, PULEP del productor y cuenta bancaria a nombre de la empresa.
- Mostrar la insignia igual en el evento y en el checkout, con una explicación de "Qué significa verificado".
- Bloquear nombres que contengan "oficial", "verificado" o "Fulleventos".

### H49 · Los cambios importantes no se le anuncian al lector de pantalla (WCAG 4.1.3) (Media)

**Qué pasa:** al elegir una ciudad en el mapa o al cambiar de paso en el checkout o en el registro, la pantalla cambia en silencio.

**Evidencia:**
- El panel del mapa se actualiza sin anunciarlo (`Mapa.dc.html:159-161`; "aria-live en panel: 0").
- El checkout solo cambia `aria-current="step"` (`Evento.dc.html:545`).
- El registro solo cambia "Paso {{stepNum}} de 3" (`Registro.dc.html:30`).
- El aviso "Reposteaste…" aparece junto con su `role="status"` (`Agenda.dc.html:108-111`), un patrón que varios lectores no anuncian (por confirmar con NVDA y VoiceOver).

**Por qué importa:** una persona ciega toca una ciudad o "Continuar" y no sabe si pasó algo.

**Cómo arreglarlo (S):** en cada pantalla, una región viva vacía y permanente (visualmente oculta, con `role="status"`) donde se escriben mensajes como "Mostrando 6 planes en Bogotá" o "Paso 2 de 4: Tus datos". Conservar lo que ya funciona: `aria-live` en la cantidad y `role="log"` en el chat.

### H50 · Mapa: recorrer los pines con Tab descuadra el mapa y no hay forma de devolverlo (Media)

**Qué pasa:** al llegar a Leticia con Tab, el mapa se desplaza 748 px. Después de "Toda Colombia" sigue corrido 436 px, y la mitad norte del país queda fuera de vista hasta recargar. Con zoom 3× hay pines enfocables que no se ven: 5 a 1280 px y 6 a 390 px.

**Evidencia:** `Mapa.dc.html:115` (`overflow: hidden`). Scripts: `audit-tmp/a11y/mapa-scroll.js` y `mapa-clip.js`. Captura: `mapa-after-reset.png`.

**Por qué importa:** quien explora con teclado o con magnificador deja el mapa roto para el resto de la sesión, también para el mouse.

**Cómo arreglarlo (S):**
- Usar `overflow: clip` en lugar de `hidden`.
- Sacar del orden de Tab los pines que quedan fuera de vista (`tabIndex=-1`), o centrar el mapa en el pin que recibe el foco.

### H51 · 13 campos de texto sin indicador de foco, y estilo de foco distinto entre pantallas (Media)

**Qué pasa:** al enfocar estos campos no cambia nada, por el estilo inline `outline: 0`. En el Chat, la regla de foco que ya existe pierde contra ese estilo. Bienvenida, Main, Agenda, Registro y Perfil no definen un estilo de foco propio.

**Evidencia:** `Bienvenida.dc.html:27`; `Main.dc.html:28` y `:136`; `Agenda.dc.html:28` y `:192`; `Mapa.dc.html:34`; `Chat.dc.html:35`, `:95`, `:350` y `:469`; `Registro.dc.html:58`, `:60` y `:62`. Script: `audit-tmp/a11y/focus-inputs.js`. Para WCAG 2.4.7 el cursor de texto cuenta como indicador mínimo, así que no es un incumplimiento estricto.

**Por qué importa:** las personas con baja visión o con dificultades de atención no distinguen en qué campo están.

**Cómo arreglarlo (S):**
- Quitar `outline: 0`, o marcar el contenedor con `:focus-within` (borde de 2 px #C23A24).
- Copiar a las 8 pantallas la regla de `Evento.dc.html:19` (3 px #C23A24 con separación).

### H52 · Contraste insuficiente: interruptores apagados, bordes, placeholders, números de pasos y un avatar (Media)

**Qué pasa:** varios elementos no se distinguen bien del fondo.

**Evidencia:**
- **Interruptores apagados:** "Silenciar notificaciones" da 1,29:1 (`Chat.dc.html:1150`) y "Dividir el pago" da 1,55:1 (`Evento.dc.html:1251`). Incumplen WCAG 1.4.11.
- **Bordes de campo:** entre 1,29:1 y 1,55:1. Si incumplen está por confirmar, porque la etiqueta visible ya identifica el campo.
- **Placeholders:** el gris por defecto (#757575) sobre crema da 4,32:1 en "MM/AA", "CVV" y los campos de Registro y Chat.
- **Números de pasos en Registro:** los pasos pendientes dan 1,03:1 (`Registro.dc.html:39`, `:136-138`). Es el único texto real bajo el umbral en las 8 pantallas, aunque el impacto práctico es bajo porque "Paso 1 de 3" da la misma información.
- **Avatar de Galería Café Libro en Registro:** las iniciales tienen el mismo color que el fondo (`:97`, `:159`).
- Capturas: `registro-pasos.png` y `audit-tmp/resp/reg-390-p3-full.png`.

**Por qué importa:** las personas con baja visión, los adultos mayores o quien usa el celular al sol no saben si un interruptor está prendido.

**Cómo arreglarlo (S):**
- Pista apagada y bordes con al menos 3:1, por ejemplo #857870 (4,27:1 sobre blanco), y el estado también en texto.
- Placeholders en #6E6259 (5,54:1).
- Números de pasos en blanco al 65 % con un borde claro.
- Definir el color de texto de cada avatar (amarillo para organizadores, como en el Chat).

### H58 · Errores en la consola al cargar Evento (Baja)

**Qué pasa:** al cargar Evento, la consola muestra dos errores de íconos con la plantilla sin resolver. Ya dibujada la página, los íconos se ven bien.

**Evidencia:** `<path> attribute d: Expected moveto path command … "{{po.d}}"` y `"{{m.d}}"` (`Evento.dc.html:356` y `:693`), en `audit-report.json`. Ya renderizada la página quedan 0 íconos sin resolver.

**Por qué importa:** es ruido que puede esconder errores reales.

**Cómo arreglarlo (S):**
- Por confirmar si el formato permite evitarlo, por ejemplo con íconos como componentes.
- En producción, que las pruebas fallen si hay errores en la consola (H55).

### H59 · Detalles de semántica para lector de pantalla y control por voz (Baja)

**Qué pasa:**
- Las opciones de una sola respuesta (localidad, "¿Para quién?", medio de pago, tipo de persona, fecha en Mapa) son botones de alternancia, así que el lector no dice que son excluyentes.
- Las pestañas "Parches / Muro" no responden a las flechas.
- Main no tiene título principal (h1) y los posts no tienen encabezado.
- No hay enlace "Saltar al contenido": se necesitan 43 Tabs para llegar a "Comprar boletas" en Evento.
- El avatar "CV" se llama "Tu perfil".

**Evidencia:**
- `Evento.dc.html:571`, `:582-585`, `:691`, `:748-749`, `:304-306` y `:242`; `Mapa.dc.html:84`.
- `Main.dc.html:183`; `Bienvenida.dc.html:163-180` (salta de h3 a h4).
- Avatar en `Agenda.dc.html:62`, `Chat.dc.html:72`, `Evento.dc.html:49`, `Main.dc.html:67` y `Mapa.dc.html:68`.
- axe-core: `page-has-heading-one` y `label-content-name-mismatch`. La mayoría de estas últimas alertas son inofensivas.
- El interruptor de `Evento.dc.html:621` está bien hecho.

**Por qué importa:** quien usa lector de pantalla entiende peor las opciones y no puede saltar entre eventos. Quien usa control por voz dice "clic en CV" y no pasa nada.

**Cómo arreglarlo (S):**
- Grupos de radio nativos (`fieldset` y `legend`), o `role="radiogroup"`.
- Para las pestañas, el patrón de pestañas de ARIA o dos botones normales.
- Un h1 oculto "Tu feed" y un h3 por evento o publicación.
- "Saltar al contenido" y, en Evento, "Ir a comprar boletas".
- Nombres accesibles que empiecen por el texto visible ("CV, tu perfil").

### H60 · Mini-mapa de la landing: pines de 20 px que se enciman (Baja)

**Qué pasa:** a 390 px, 5 pines chocan con su vecino: Santa Marta, Barranquilla y Cartagena, y Bogotá con Villavicencio. También se enciman en escritorio.

**Evidencia:** `Bienvenida.dc.html:140`. Los centros quedan a 14 y 16 px. Script: `audit-tmp/resp/pins.js`; captura: `audit-tmp/resp/bien-pins-1280.png`. Hoy pasa WCAG 2.5.8 por la excepción de control equivalente: todos llevan al Mapa, igual que el botón de 52 px.

**Por qué importa:** al tocar con el dedo se abre la ciudad equivocada.

**Cómo arreglarlo (S):**
- Si cada pin va a abrir su propia ciudad, subir el tamaño mínimo a 24-28 px y agrupar la costa en un pin "Costa Caribe · 3".
- Si no, convertir todo el mini-mapa en un solo enlace.

### H61 · Chips cortados sin pista y filas sueltas en tableta (Baja)

**Qué pasa:** las filas de chips esconden ciudades sin avisar, y en tableta varias rejillas quedan con un elemento suelto.

**Evidencia:**
- A 1280 px, la fila de ciudades de Bienvenida y Agenda esconde 372 px (Villavicencio, Pasto y Leticia) sin degradado ni flechas, y lo mismo pasa en Mapa (`audit-tmp/resp/Mapa-1280_01.png`).
- A 768 px:
  - Los datos clave de Evento quedan en 4+1 y "Show 9:30 p. m." se parte en dos.
  - "Cómo funciona" de Bienvenida queda en 2+1.
  - Perfil queda en 3+2.

**Por qué importa:** ciudades enteras quedan casi invisibles y la tableta se ve descuidada.

**Cómo arreglarlo (S):**
- Dejar que la fila de chips ocupe 2 líneas, o agregar un degradado y flechas.
- Usar una rejilla automática (`grid auto-fit`) con anchos mínimos pensados para cada bloque.

### H62 · Textos: "Ver todo Colombia" y nombres que cambian entre pantallas (Baja)

**Qué pasa:**
- Dice "Ver todo Colombia" en lugar de "toda Colombia".
- El alcance nacional se nombra a la vez "Toda Colombia", "Todo el país" y "Colombia".
- "Mis parches" y "Tus parches" aparecen en la misma barra.
- La etiqueta "Nuevo" se repite en 5 lugares del Mapa.

**Evidencia:** `Main.dc.html:95`, `:105`, `:167`, `:176` y `:521`; `Mapa.dc.html:164`, `:179`, `:479-480` y `:486`.

**Por qué importa:** baja la percepción de cuidado del producto.

**Cómo arreglarlo (S):** un glosario corto y corregir la concordancia.

## Requisitos para producción

Varios hallazgos del prototipo tienen también una parte de producción (H5, H7, H9, H17, H20, H27, H28, H47). Aquí van los que dependen de backend, de contratos o de proveedores.

### Pagos y boletería

| ID | Hallazgo | Severidad | Pantallas | Esfuerzo |
|---|---|---|---|---|
| H1 | La compra "sin salir de Fulleventos" de boletas de ticketeras no tiene vía técnica ni comercial confirmada | Alta | Bienvenida, Agenda, Mapa, Main, Evento | L (S en el diseño) |
| H2 | El pago y la boleta deben confirmarse en el servidor | Alta | Evento | L |
| H3 | Cupos, reservas y precios deben vivir en el servidor; temporizador accesible | Alta | Evento | L |
| H11 | Emisión real de boletas, con un QR seguro por asistente y control en la puerta | Alta | Evento, Perfil | L |
| H18 | Pago dividido: faltan las reglas de plazo, incumplimiento y mesas | Media | Evento, Chat | M |
| H19 | Elegir pasarela y usar sus campos seguros | Media | Evento | M |
| H31 | El cargo del 8 % puede no cubrir la pasarela | Media | Evento | S |
| H32 | No hay forma oficial de transferir o revender boletas | Media | Main, Chat, Evento | L |

#### H1 · La compra "sin salir de Fulleventos" de boletas de TuBoleta, Ticketmaster o Fever no tiene hoy una vía técnica ni comercial confirmada (Alta)

**Qué pasa:** las tarjetas muestran marcas reales como vendedoras y su botón "Comprar" abre el checkout dentro de Fulleventos, que promete "Boleta oficial emitida por [BOLETERA]. Compras sin salir de Fulleventos". En Agenda y Mapa no hay ningún aviso de "ejemplo".

**Evidencia:**
- Marcas en el campo `b` de `Agenda.dc.html:261-279`, `Mapa.dc.html:267-281` y `Bienvenida.dc.html:296-310`, visibles en `Agenda.dc.html:159`, `Mapa.dc.html:201` y `Bienvenida.dc.html:237`. El botón "Comprar" lleva a Evento (`Agenda.dc.html:326-328`).
- Promesas en `Evento.dc.html:458`, `:629` y `:779`, y en `Bienvenida.dc.html:102`. El pie "Compra segura dentro de Fulleventos" aparece en Agenda `:177`, Bienvenida `:268`, Evento `:512`, Main `:307` y Mapa `:237`.
- En Chromium, Agenda y Mapa muestran TuBoleta 7 veces, Ticketmaster 2 y Fever 3.
- Según research.json:
  - TuBoleta, Primera Fila y Taquilla Live no publican API de compra ni programa de socios.
  - La Partner API de Ticketmaster es solo para socios aprobados, y Colombia no aparece en su lista de mercados.
  - La API B2B de Fever exige aprobación y su cobertura en Colombia no está confirmada.

**Por qué importa:**
- Es la propuesta de valor central: de ella dependen la compra dentro de la página, el pago dividido y la boleta con QR.
- Mostrar marcas reales como si fueran socias genera riesgo de marca y de confianza, sobre todo si el prototipo se muestra a inversionistas o a las boleteras.
- Lanzar con ese texto podría leerse como publicidad engañosa (Ley 1480; por confirmar con un abogado).

**Cómo arreglarlo:**
- **En el diseño, ya (S):**
  - Cambiar las marcas por [BOLETERA] o agregar "Contenido de ejemplo" en Agenda y Mapa.
  - Condicionar los textos al canal de venta ("Compra aquí" o "Compra en [boletera]").
  - Quitar el absoluto "No sales de Fulleventos".
- **En producción (L):**
  - Tres modos de compra por evento, con un campo "fuente". Ver "Camino recomendado".
  - Gestión comercial en paralelo.
  - Nunca hacer scraping: según research.json, no está autorizado.

#### H2 · El pago se da por aprobado al instante: la boleta solo puede salir cuando la pasarela confirme (Alta)

**Qué pasa:** al tocar "Pagar", el flujo salta directo a la boleta. Con Nequi aparece "¡Listo, Camila! Pagaste $97.200 con Nequi" unos 0,1 segundos después, aunque la misma pantalla dice que hay que aprobar el pago en la app.

**Evidencia:**
- `Evento.dc.html:1062-1079`, `:1277`, `:752`, `:767` y `:810` (número de orden fijo).
- Scripts: `audit-tmp/pago-async.js` (73 ms) y `audit-tmp/verify-pay.js` (Nequi con el celular vacío, PSE y tarjeta con los campos vacíos).
- Según research.json, la firma de integridad de Wompi se genera en el servidor. Según la documentación de Wompi, PENDING no es un estado final y los cambios llegan por webhook (`transaction.updated`).

**Por qué importa:** si producción copia este flujo, se emitirían boletas sin la plata confirmada, o se mostraría un éxito falso cuando el banco rechace. Sin protección contra pagos repetidos, un doble clic o una recarga podría cobrar dos veces. Esto último no se puede reproducir hoy, porque el botón desaparece al pagar.

**Cómo arreglarlo (L):**
- Una máquina de estados para cada orden: creada, esperando pago, pagada, rechazada o vencida, y reembolsada.
- La fuente de verdad es el webhook firmado de la pasarela, no la pantalla de regreso. Se verifica su firma y se procesa una sola vez por transacción.
- Una llave de idempotencia por intento de pago, para que un pago repetido no se procese dos veces.
- Emitir la boleta solo con el pago APROBADO.
- Conciliar a diario contra el reporte de la pasarela, con alertas si falla un webhook.
- El servidor genera el número de orden.
- Las pantallas que ve el usuario están en H17.

#### H3 · Cupos, reservas y precios viven en el navegador, y el temporizador está congelado (Alta)

**Qué pasa:**
- "Tus boletas están reservadas por 9:58" es un texto fijo que no corre.
- "Últimas 12" también es fijo.
- El cargo del 8 % y los totales se calculan en el navegador.
- "Máximo 8 por compra" solo existe en la pantalla.
- El plazo de reserva del parche está como [PLAZO DE RESERVA].

**Evidencia:** `Evento.dc.html:560` (después de 3 segundos sigue en 9:58), `:900`, `:904-906`, `:905`, `:949-954`, `:629` y `:1232`.

**Por qué importa:**
- En producción habría sobreventa (dos personas pagando la última boleta), reservas bloqueadas para siempre y montos que se podrían alterar desde el navegador.
- Quien usa lector de pantalla o tiene un celular lento puede perder las boletas si la reserva vence sin aviso (WCAG 2.2.1). El W3C acepta la compra de boletas como excepción, siempre que se saque del tramo con reloj todo lo que se pueda.

**Cómo arreglarlo (L):**
- Una tabla de localidades con capacidad, vendidas y reservadas.
- Reservas que descuenten cupos de forma atómica ("solo si todavía quedan"), con vencimiento y liberación automática.
- El temporizador se calcula con la hora que da el servidor.
- Precio, cargo, IVA y firma de la pasarela, calculados en el servidor. El detalle de la firma de Wompi está por confirmar en su documentación.
- El máximo por compra y por usuario, validado en el servidor.
- Antes de lanzar, una prueba con 50 compradores simultáneos por las últimas 12 sillas.
- Accesibilidad:
  - Avisos con `role="alert"` a los 2 minutos y a los 30 segundos, sin anunciar cada segundo.
  - Un botón "Necesito más tiempo", solo si la boletera o la pasarela lo permiten (por confirmar).

#### H11 · Boletas: falta emitirlas de verdad, con un QR seguro por asistente y control en la puerta (Alta)

**Qué pasa:**
- El QR es un dibujo fijo, marcado con honestidad como decorativo.
- Una compra de 2 boletas muestra un solo QR con un solo titular, mientras el pie dice "Un ingreso por persona" y el paso 2 pide un nombre por boleta.
- El texto dice "Muestra el QR desde Fulleventos o desde tu correo".

**Evidencia:**
- `Evento.dc.html:925-932`, `:813`, `:806-819`, `:810`, `:668-670`, `:1020`, `:1141`, `:1291` y `:1294`. Captura: `audit-tmp/qr-step4.png`.
- Según research.json, Taquilla Live lanzó en 2026 una app con QR dinámico contra el fraude.

**Por qué importa:**
- Un QR fijo que llega por correo se reenvía o se captura y se vende dos veces: el primero que entra deja por fuera al comprador legítimo.
- Con un solo QR para dos, el amigo no puede entrar por su cuenta, y eso rompe la compra para el parche.

**Cómo arreglarlo:**
- **En el diseño, ya (S):**
  - Una boleta con QR por asistente ("Boleta 1 de 2", con el nombre de cada titular).
  - Quitar "o desde tu correo" y dejar el correo solo como confirmación, con un enlace a la boleta en la app.
- **En producción (L):**
  - Cada boleta con ID único y un QR firmado de un solo uso: dinámico si lo controla Fulleventos, o el del sistema de acceso de la boletera.
  - Si Fulleventos vende directo, una app o página de validación en la puerta que marque cada boleta como usada una sola vez y aguante conexión intermitente.
  - Un QR nuevo al transferir y anulado al reembolsar.
  - Números de orden que no se puedan adivinar.
  - En la puerta, mostrar solo los datos necesarios (Ley 1581).
  - Si emite la boletera, el formato del QR depende de un acuerdo (por confirmar).

#### H18 · Pago dividido: no está definido qué pasa si un amigo no paga, cuánto dura la reserva ni qué pasa con una mesa incompleta (Media)

**Qué pasa:**
- Cada amigo queda en "Link enviado · pendiente", sin fecha ni acciones.
- En el chat, Camila (que no administra el parche) activa el pago dividido y solo sale "cada uno paga su parte", sin monto, destinatarios ni plazo. Desactivarlo no avisa nada.
- Evento promete "Les llega su link de pago en el chat", y el chat no lo muestra.

**Evidencia:**
- `Evento.dc.html:624`, `:629`, `:822-833`, `:905` y `:956-960`; `Chat.dc.html:406-408`, `:609` y `:1158-1166`.
- Con 7 amigos en Preferencial se apartan 8 cupos de una localidad "Últimas 12" pagando 1/8 del total.
- Según research.json, el pago dividido nativo solo está confirmado en Mercado Pago y ePayco, y se recomienda un pago por persona directo a la pasarela.

**Por qué importa:** cupos perdidos, peleas por plata en el parche, reclamos de reembolso y una forma fácil de acaparar cupos.

**Cómo arreglarlo (M):**
- Mostrar las reglas antes de pagar:
  - El plazo (por ejemplo, 24 horas o hasta X horas antes del evento).
  - Los recordatorios.
  - Qué pasa al vencer: se libera sin cobrar, o quien armó el parche paga lo que falta.
- En unidades que no se pueden partir (una mesa), confirmar solo al 100 %. Si no se completa, liberar y reembolsar de forma automática.
- Un límite de reservas simultáneas por persona y evento.
- Que el amigo pueda rechazar la solicitud.
- Que el último en pagar absorba los pesos del redondeo.
- En el chat, dividir el pago solo desde una compra real.
- Modelo de datos: una orden con varias "partes de pago", cada una con su enlace, monto y vencimiento, pagadas directo a la pasarela.
- Preguntarle a la boletera si permite reservar una unidad con varios pagos parciales (por confirmar).

#### H19 · Elegir pasarela y usar sus campos seguros: ninguna confirmada tiene los 5 medios y el pago dividido nativo a la vez (Media)

**Qué pasa:** el prototipo ofrece cinco medios de pago, y los campos de tarjeta están dibujados como campos de la propia página. El borde punteado los marca como espacio reservado para la pasarela.

**Evidencia:**
- `Evento.dc.html:704-727` y `:918-924`. En Chromium hay 0 iframes, y los campos no tienen `value` ni `onChange`. Script: `audit-tmp/pay.js`.
- Según research.json (armado con resúmenes de búsqueda; por confirmar en sandbox):
  - Wompi cubre los 5 medios, no divide el pago y le paga a terceros con su API de Payouts.
  - ePayco tiene "Pagos Divididos" y acepta Nequi y Daviplata. Botón Bancolombia no está confirmado.
  - Mercado Pago divide el pago, pero no lista Nequi ni Daviplata como medios directos (Nequi aparece como banco dentro de PSE).
  - Stripe no está disponible para empresas colombianas.
  - PayU y Bold: pago dividido no confirmado.

**Por qué importa:**
- Si los campos se programan como propios, el número de tarjeta pasa por el código de Fulleventos. Eso obliga a una certificación PCI DSS completa y deja la tarjeta expuesta a scripts maliciosos.
- Con Wompi, todo el dinero entra a la cuenta de Fulleventos, que responde por la custodia, los reembolsos y los pagos a organizadores. Esto hay que validarlo con un abogado financiero.

**Cómo arreglarlo (M):**
- Primero definir el modelo: Fulleventos como comercio (con Payouts), marketplace con el dinero directo al organizador, o venta a través de la boletera.
- Luego probar en sandbox los medios, PSE dentro del widget y el pago dividido.
- Usar el widget o los campos en iframe de la pasarela (Wompi Widget, Mercado Pago Bricks, ePayco.js, Kushki Hosted Fields).
- En la página de pago:
  - Una política de seguridad de contenido estricta.
  - Ningún script de analítica ni píxel de publicidad.
  - Un inventario de los scripts que corren.
  - Nunca guardar en registros lo que se escribe ahí.
- 3-D Secure y CVV, en manos de la pasarela.
- En el diseño, cambiar los 4 campos por un recuadro "Aquí van los campos de [PASARELA]".
- Los requisitos exactos del cuestionario PCI más liviano (SAQ A) están por confirmar en el texto oficial.

#### H31 · El cargo del 8 % puede no cubrir la pasarela en boletas baratas y en el pago dividido (Media)

**Qué pasa:** con un cargo fijo del 8 %, el margen se va casi todo en la comisión de la pasarela justo en los planes baratos y en el pago dividido.

**Evidencia:** `Evento.dc.html:900` (`FEE_RATE = 0.08`). Cálculo con la tarifa de Wompi de research.json (2,65 % + $700 + IVA del 19 % sobre la comisión), suponiendo que el 8 % ya incluye IVA y que Fulleventos asume la comisión:
- **1 boleta General** (total $48.600): cargo de $3.600, de los cuales la pasarela se lleva $2.366. Quedan $660.
- **2 boletas en un solo pago:** quedan $2.152.
- **Las mismas 2 boletas con pago dividido:** quedan $1.319, porque cada pago adicional suma unos $833 fijos.
- **Una boleta de $15.000:** se pierden $335.
- Con Mercado Pago o ePayco el costo es mayor.

**Por qué importa:** el margen es bajo o negativo en el corazón social del producto.

**Cómo arreglarlo (S):**
- Modelar el cargo como porcentaje más un mínimo fijo por boleta.
- Definir quién asume la comisión: comprador, organizador o plataforma.
- Un monto mínimo por parte en el pago dividido.
- Validar las tarifas reales al firmar con la pasarela.

#### H32 · No hay forma oficial de transferir o revender boletas, pero el feed ya invita a hacerlo (Media)

**Qué pasa:** la gente ya ofrece boletas y se pasa plata por el chat, pero la app no tiene ninguna forma oficial de hacerlo.

**Evidencia:**
- `Main.dc.html:391` ("Tengo dos boletas de más") y `Chat.dc.html:656` ("Ya te pasé lo mío").
- Buscar "transferir" o "reventa" da 0 resultados.
- Según research.json, TuBoleta tiene su plataforma de reventa entre fans, "Pásala".

**Por qué importa:** la reventa se hace a mano con pantallazos y transferencias por Nequi, que es el terreno típico de las estafas. La víctima culpa a la plataforma.

**Cómo arreglarlo (L):**
- "Transferir boleta a un amigo": la vuelve a emitir a su nombre e invalida el QR anterior.
- Si el organizador lo permite, reventa con precio tope (máximo el original) y pago por la pasarela.
- Detectar publicaciones de "vendo boleta" y mostrar la opción oficial.
- Dejar la regla escrita en los términos.

### Chat y comunidad

| ID | Hallazgo | Severidad | Pantallas | Esfuerzo |
|---|---|---|---|---|
| H13 | Chat en tiempo real con historial, permisos y moderación | Alta | Chat, Main, Evento, Perfil | L |
| H29 | Un enlace de pago falso en el chat se vería igual que una solicitud real | Media | Chat, Evento | M |

#### H13 · Chat en tiempo real con historial, permisos y moderación (Alta)

**Qué pasa:** los mensajes viven solo en el estado de la pantalla, con hora "Ahora", y se pierden al salir. Aun así, el pago del parche se apoya en el chat.

**Evidencia:**
- Mensajes en `Chat.dc.html:549-571`. El checkout promete enlaces de pago en el chat (`Evento.dc.html:624`, `:629` y `:1287`).
- Buscar "reportar", "bloquear" o "denunciar" en Chat, Main, Perfil y Evento da 0 resultados (`audit-tmp/chatcheck.js`).
- A favor: el pago dividido aparece como mensaje del sistema (`Chat.dc.html:1165`).

**Por qué importa:** es la capa social del producto. Sin permisos ni moderación, abre la puerta al acoso y a la suplantación con enlaces de pago falsos. Las tiendas exigen reportar y bloquear (ver H9).

**Cómo arreglarlo (L):**
- Mensajería en tiempo real (por ejemplo, Supabase Realtime o WebSockets) con historial paginado.
- Solo los miembros de un parche leen sus mensajes.
- Estados de enviado y leído, y notificaciones push.
- Reportar y bloquear (H9), con un panel de moderación, revisión automática de imágenes, límites de envío y un canal de emergencia.
- Advertencia en los enlaces externos.
- Una política de cuánto tiempo se guardan los mensajes, que son datos personales (Ley 1581). El plazo está por confirmar con un abogado.

#### H29 · Un enlace de pago falso en el chat se vería igual que una solicitud real (Media)

**Qué pasa:** el checkout promete "link de pago en el chat", pero el chat no tiene ningún tipo de mensaje para solicitudes de pago. Un enlace escrito por un usuario sale como una burbuja normal, sin advertencia. Hoy ese enlace no se puede tocar.

**Evidencia:**
- `Evento.dc.html:624`, `:629`, `:829` y `:1287`; `Chat.dc.html:228-236`, `:859` y `:925-936`.
- En Chromium, el texto "Paguen su parte aqui: https://fulleventos-pagos.co/pse?ref=123" se publica sin advertencia (captura `audit-tmp/seg/C2-chat-link-falso.png`; scripts en `audit-tmp/verif-c2/`).
- Mitigación parcial: la insignia "Organizador verificado".

**Por qué importa:** si la gente se acostumbra a pagar desde enlaces en el chat, un estafador o una cuenta robada puede imitar PSE y robar claves o plata. El daño recae en el usuario y en la confianza en la marca.

**Cómo arreglarlo (M):**
- **En el diseño:** una tarjeta del sistema "Solicitud de pago · Fulleventos" con monto, evento, localidad, quién la pide, fecha límite y un botón "Pagar mi parte" que abre el checkout dentro de la app. Cambiar el texto "link de pago" por "solicitud de pago dentro de la app".
- **En producción:**
  - Solo el sistema genera esas tarjetas, y no se pueden reenviar ni imitar.
  - Detectar enlaces, números de cuenta y palabras como "consigna" o "transferencia", y mostrar una advertencia.
  - Un aviso fijo: "Fulleventos nunca te pide pagar por enlaces externos ni transferirle a una persona".

### Datos y legal

Ver también H5, H27 y H28, del prototipo, que tienen su parte de producción.

| ID | Hallazgo | Severidad | Pantallas | Esfuerzo |
|---|---|---|---|---|
| H4 | Vender boletas propias exige autorización de MinCultura, PULEP y facturación DIAN | Alta | Evento, Agenda, Main, Mapa, Chat | L |
| H10 | No hay control de edad: el registro no pide la fecha de nacimiento y la compra +18 no confirma la edad | Alta | Registro, Evento, Chat | M (S en el diseño) |

#### H4 · Vender boletas propias exige autorización de MinCultura, PULEP y facturación DIAN (Alta)

**Qué pasa:** el prototipo contempla que Fulleventos cobre con su propia pasarela y que los organizadores creen eventos. Pero no aparecen ni el PULEP, ni la factura, ni quién opera la venta.

**Evidencia:**
- `Evento.dc.html:161` (música en vivo), `:779`, `:819` y `:1142`, y los botones "Crear evento".
- Buscar "PULEP", "factura" o "IVA" en las 8 pantallas da 0 resultados.
- PSE pregunta el tipo de persona (jurídica), pero no hay campos de NIT ni razón social (`Evento.dc.html:748-749`).
- Según research.json y búsquedas propias:
  - El Decreto 1080 de 2015 (arts. 2.9.2.2.2 y 2.9.2.2.3) exige autorización de MinCultura para operar boletería en línea de espectáculos de artes escénicas, que incluyen la música en vivo. Los requisitos incluyen un objeto social de software de boletería y dar acceso a los servidores a la autoridad tributaria.
  - MinCultura sigue autorizando operadores en 2026, también pequeños.
  - El productor registra el evento en PULEP al menos 15 días antes.
  - Las boletas de 3 UVT o más causan una contribución parafiscal del 10 %.
  - La Resolución DIAN 000165 de 2023 creó el documento equivalente electrónico de la boleta, obligatorio desde el 1 de noviembre de 2024.
  - El cargo por servicio se factura con IVA del 19 %.

**Por qué importa:** mientras esto no se resuelva, la venta propia no puede salir a producción, por el riesgo regulatorio (el tipo de sanción está por confirmar). Las empresas que compran mesas tampoco pueden pedir factura a su nombre.

**Cómo arreglarlo (L):** decidirlo con un abogado antes de construir el checkout.
- **(a)** Tramitar la autorización como operador.
- **(b)** Aliarse con un operador ya autorizado. Ojo: una marca blanca como Ticketplus licencia software, pero no transfiere la autorización. El operador autorizado tiene que ser quien contrata con el productor y emite la boleta.
- Además:
  - Pedir el PULEP al crear cada evento y mostrar "PULEP: [CÓDIGO]" en los datos clave, el checkout y la boleta ("No aplica" para eventos que no son artes escénicas). Si es obligatorio mostrarlo está por confirmar: solo hay fuentes secundarias.
  - Definir por contrato quién emite el documento equivalente. Todo apunta al operador (por confirmar).
  - Facturar el cargo con un proveedor habilitado por la DIAN.
  - En el paso 2, agregar "¿Necesitas factura a nombre de empresa?" con NIT, razón social y correo de facturación.
- **Por confirmar:**
  - El régimen para eventos deportivos y gastronómicos, que no son artes escénicas.
  - Una posible excepción en la Resolución DIAN 0008 de 2024.
  - Si un revendedor conectado a un operador autorizado necesita su propia autorización.

#### H10 · Sin control de edad: el registro no pide la fecha de nacimiento y la compra +18 no confirma la edad (Alta)

**Qué pasa:**
- El registro solo pide nombre, celular o correo y barrio.
- El evento es +18, pero ningún paso de la compra pregunta la edad del comprador ni de los acompañantes, cuyos nombres además son opcionales.
- El documento solo puede ser CC, CE o pasaporte.
- No hay ningún filtro por edad en los parches ni en los mensajes.

**Evidencia:**
- `Registro.dc.html:57-64`; `Evento.dc.html:104-106`, `:644-651`, `:696`, `:1050-1059` y `:1137`.
- En Chromium, los pasos 1 a 3 tienen 0 menciones de "18", "mayor", "edad" o "menor".
- Marco legal:
  - La Ley 1581, art. 7, condicionada por la sentencia C-748 de 2011, y el Decreto 1377, art. 12, exigen la autorización del representante legal para tratar datos de menores.
  - La Ley 1801, art. 38, prohíbe permitir la entrada de menores a sitios con alcohol. Esa obligación es sobre todo del organizador o del lugar; si también alcanza a la plataforma está por confirmar.

**Por qué importa:** un menor puede abrir una cuenta, chatear con adultos desconocidos y comprar boletas +18 que luego le niegan en la puerta. Eso trae reclamos, reversiones, tratamiento de datos de menores sin autorización y un riesgo reputacional alto.

**Cómo arreglarlo:**
- Definir una política: 18+ en toda la app, o de 14 a 17 años con autorización de los padres y funciones limitadas.
- **En el diseño, ya (S):** fecha de nacimiento en el registro y, en eventos +18, una casilla obligatoria en el paso 1: "Confirmo que todos los asistentes son mayores de 18".
- **En producción (M):**
  - Ocultar los eventos +18 a los menores.
  - Bloquear los mensajes directos de adultos que no sean contactos.
  - Agregar TI donde aplique, y PPT, que además sirve a muchos migrantes venezolanos.

### Plataforma

| ID | Hallazgo | Severidad | Pantallas | Esfuerzo |
|---|---|---|---|---|
| H12 | Cuentas: no hay inicio de sesión, verificación, recuperación ni registro de consentimientos | Alta | Registro, Bienvenida, Evento | M–L |
| H14 | No hay panel para organizadores ni forma de cargar el catálogo | Alta | Agenda, Chat, Main, Mapa | L |
| H34 | Las páginas de evento no se pueden compartir bien ni indexar | Media | Evento, Agenda, Bienvenida, Mapa | M |
| H53 | El prototipo es la especificación, no el código: falta un modelo de datos único y una arquitectura | Media | Las 8 | L |
| H54 | La campana no hace nada y el checkout promete correos que nadie envía | Media | Agenda, Chat, Evento, Main, Mapa | M |
| H55 | No hay analítica, monitoreo ni pruebas automáticas | Media | Evento, Chat, Registro | M |
| H56 | La accesibilidad de pasarela, banco, Nequi y QR hay que exigírsela a los proveedores | Media | Evento, Chat | M |
| H57 | Falta un presupuesto de rendimiento | Media | Evento, Chat, Agenda, Mapa | M |

#### H12 · Cuentas: no hay inicio de sesión, verificación del celular, recuperación ni registro de consentimientos (Alta)

**Qué pasa:**
- "Entrar" lleva directo al feed.
- "Continuar con Google" solo pasa al siguiente paso.
- El celular o el correo no se verifican.
- El consentimiento es apenas la frase "Al continuar aceptas…", sin casilla ni opción aparte para publicidad.
- "Buscar amigos en mis contactos" no hace nada.

**Evidencia:**
- `Registro.dc.html:24`, `:54-55`, `:59`, `:64` y `:93-94`; `Bienvenida.dc.html:53` y `:260`.
- En el arnés: "tras Google PASO 2 DE 3" y "contactos cambia DOM? false".
- La compra sí tiene una casilla obligatoria (`Evento.dc.html:770-774`, `:1058`): es el patrón a repetir.

**Por qué importa:** sin cuentas verificadas no hay compras, chats ni parches confiables, y una cuenta robada podría pedirle plata al parche (H29). La Ley 1581 exige una autorización previa, expresa e informada que se pueda consultar después (research.json). Cómo se prueba esa autorización (Decreto 1377, art. 8) está por confirmar con un abogado.

**Cómo arreglarlo (M–L):**
- Ingreso con Google y con celular más código de verificación (por SMS o WhatsApp).
- Límite de intentos, aviso de inicio de sesión en un dispositivo nuevo, lista de sesiones activas y recuperación de cuenta.
- Pedir verificación otra vez antes de pagar o transferir una boleta.
- Tarjetas guardadas solo como tokens de la pasarela.
- Guardar cada consentimiento (usuario, versión del texto, fecha y canal), con una casilla aparte para publicidad.
- Cuentas de organizador separadas y verificadas (NIT y cuenta bancaria), que respaldan la insignia de H48.
- Diseñar ya la pantalla "Entrar" y la verificación.

#### H14 · No hay panel para organizadores ni forma de cargar el catálogo (Alta)

**Qué pasa:** "Crear evento" no hace nada en 4 pantallas, no existe un tipo de cuenta para organizadores, y el organizador solo aparece como perfil y como chat.

**Evidencia:** `Agenda.dc.html:61`, `Chat.dc.html:71`, `Main.dc.html:66` y `Mapa.dc.html:67` (al hacer clic no cambian ni la dirección ni la página); `Evento.dc.html:389-398`; el registro no ofrece tipo organizador.

**Por qué importa:** sin eventos no hay producto, y los eventos de ticketeras sin API hay que cargarlos a mano.

**Cómo arreglarlo (L):**
- **Fase 1:** un panel interno de curaduría con lugar (dirección y coordenadas), ciudad, fuente y enlace de compra.
- **Fase 3:** un panel de organizador para:
  - crear eventos con PULEP, localidades, cupos, máximo por compra y edad mínima;
  - ver ventas y asistentes (los datos de los compradores se comparten solo con su autorización o con una finalidad informada, según research.json);
  - validar boletas en la puerta;
  - manejar pagos y reembolsos.

#### H34 · Las páginas de evento no se pueden compartir bien ni indexar (SEO y vista previa en WhatsApp) (Media)

**Qué pasa:** las páginas no tienen descripción, ni datos para la vista previa en redes, ni URL canónica, ni datos estructurados. El título es genérico ("Fulleventos · Evento") y todos los eventos usan el mismo archivo. Los botones "Compartir evento" e "Invitar amigos" no hacen nada.

**Evidencia:**
- 0 etiquetas de descripción, Open Graph, canónica o JSON-LD en cada una de las 8 pantallas. `Evento.dc.html:5` (título); `:130-132` (Compartir e Invitar).
- Con JavaScript apagado, que es como leen la página WhatsApp y Facebook:
  - Evento muestra 82 marcadores "{{…}}".
  - El título de Agenda dice "Este finde en {{cityLabel}}" (`audit-tmp/seo-nojs.js`).
  - Esto es propio del formato del prototipo, pero muestra el riesgo de una app que solo se arma en el navegador.

**Por qué importa:** los enlaces compartidos por WhatsApp, el canal natural para armar parche, saldrán sin foto ni título. Sin una URL por evento, Google no puede indexar cada uno.

**Cómo arreglarlo (M):**
- Una URL única por ciudad y evento, por ejemplo `/bogota/eventos/noche-de-salsa-y-boleros-2026-10-09`.
- Páginas generadas en el servidor.
- En cada evento:
  - Título y descripción propios.
  - Etiquetas Open Graph, con una imagen de 1200×630 que lleve foto, fecha y lugar.
  - URL canónica.
  - Datos estructurados schema.org/Event: fecha con zona -05:00, lugar con dirección y coordenadas, y precio en COP.
- Páginas por ciudad y categoría, y un sitemap.
- Conservar los eventos pasados como "finalizado".
- Si Google muestra resultados enriquecidos de eventos en Colombia está por confirmar.
- En el prototipo: títulos descriptivos en `<title>`.

#### H53 · El prototipo es la especificación, no el código: falta un modelo de datos único y una arquitectura (Media)

**Qué pasa:** cada pantalla trae su propia copia de los datos de ejemplo, algo propio del formato y no un error. Pero no se puede "publicar" como aplicación, porque no tiene dónde conectar un backend.

**Evidencia:**
- Los 19 eventos están copiados en `Agenda.dc.html:261-279`, `Bienvenida.dc.html:296-314`, `Main.dc.html:347-365` y `Mapa.dc.html:267-285`. Hoy coinciden en los campos base.
- Hay versiones parciales en `Chat.dc.html:598`, `Evento.dc.html:1146` y `Perfil.dc.html:148`.
- Las fechas relativas son texto fijo (`Chat.dc.html:849`, `Evento.dc.html:79`), y el mapa usa porcentajes en lugar de coordenadas (`Mapa.dc.html:253-264`).
- El runtime (`support.js`, 187.897 bytes) arma todo en el navegador, Evento tiene 405 elementos con estilos en línea y los datos viven dentro de `renderVals()` (`Evento.dc.html:897-950`).

**Por qué importa:** si en producción cada pantalla calcula sus propios datos, la agenda, el mapa y el checkout van a mostrar cosas distintas.

**Cómo arreglarlo (L):**
- Un solo modelo de datos en la base, con estas entidades:
  - usuario, seguidores, organizador (con NIT y cuenta);
  - lugar (con coordenadas) y ciudad;
  - evento (con zona America/Bogota, estado, edad mínima, PULEP, fuente y enlace externo);
  - localidad, reserva, orden, parte de pago, pago, boleta e ingreso en la puerta;
  - parche, mensaje, encuesta, reporte y bloqueo;
  - consentimiento, notificación, liquidación y reembolso.
- Las fechas relativas, calculadas siempre con la hora del servidor.
- Arquitectura sugerida por el auditor (es una opinión razonable, por confirmar):
  - Next.js en Vercel, con páginas generadas en el servidor.
  - Supabase: base de datos, cuentas, tiempo real, archivos, reglas por fila y tareas programadas, en una región de EE. UU. Según research.json, la SIC considera a EE. UU. un país con nivel adecuado de protección. El código por celular necesita un proveedor de SMS, que tiene costo.
  - Wompi o ePayco con widget.
  - Correo transaccional (Resend o SES), MapLibre, Sentry y PostHog.
- Del prototipo se reutilizan los colores, las tipografías, los componentes (la tarjeta de evento y el encabezado) y los textos.

#### H54 · Notificaciones: la campana no hace nada y el checkout promete correos que nadie envía (Media)

**Qué pasa:** la campana de notificaciones no tiene ninguna acción, y la confirmación de compra dice que llegan correos que el sistema no envía.

**Evidencia:** campana sin acción en `Agenda.dc.html:59`, `Chat.dc.html:69`, `Evento.dc.html:46`, `Main.dc.html:63` y `Mapa.dc.html:65`. Textos en `Evento.dc.html:1083`, `:1287` y `:1294`.

**Por qué importa:** si no llega el correo con la boleta, el usuario pierde la confianza justo después de pagar.

**Cómo arreglarlo (M):**
- Correos automáticos: confirmación con la boleta, recibo del cargo, recordatorio antes del evento, y aviso de cambio o cancelación con el procedimiento de devolución (Circular SIC 004 de 2022).
- Notificaciones push y un centro de notificaciones dentro de la app.
- WhatsApp Business para recordatorios (el costo está por confirmar).
- Preferencias por tipo de notificación.

#### H55 · No hay analítica, monitoreo ni pruebas automáticas (Media)

**Qué pasa:** no hay ninguna medición, ni monitoreo de errores, ni pruebas automáticas del producto.

**Evidencia:** 0 referencias a gtag, PostHog, Sentry u otra analítica en los 8 archivos. Sí existe el arnés con Playwright y axe-core (`tools/dcharness.js`, `audit.js`).

**Por qué importa:** sin medir, no se sabe dónde se cae la compra. Sin monitoreo, un webhook roto puede pasar días sin que nadie lo note.

**Cómo arreglarlo (M):**
- Medir el embudo: ver evento, empezar compra, elegir medio de pago, pago aprobado o rechazado, parche creado y parte del pago dividido pagada. También la retención semanal. Con PostHog o GA4, con consentimiento de cookies.
- Sentry y alertas cuando fallen los webhooks o la conciliación.
- Pruebas del cálculo de precios, de las reservas con muchos compradores a la vez y de la compra completa con Playwright y axe, reutilizando el arnés.
- Una prueba de carga antes de un lanzamiento grande.

#### H56 · Accesibilidad de pasarela, banco, Nequi y QR: hay que exigírsela a los proveedores (Media)

**Qué pasa:** en producción, los campos de la pasarela, la autenticación del banco y la aprobación en Nequi los pinta un tercero, y Fulleventos no controla su accesibilidad.

**Evidencia:** `Evento.dc.html:707`, `:752`, `:813` y `:1277`. La Resolución MinTIC 1519 de 2020 y la Ley 1618 de 2013 obligan a las entidades públicas. Para una empresa privada como Fulleventos, la obligación directa está por confirmar con un abogado. Aliados públicos como Idartes sí están obligados.

**Por qué importa:** una persona ciega puede quedarse atascada en un iframe inaccesible, y la culpa recae en la marca Fulleventos.

**Cómo arreglarlo (M):**
- Pedir el informe de conformidad de accesibilidad (VPAT/ACR) y probar con lector de pantalla antes de elegir proveedor.
- Preferir campos incrustados con etiquetas en español y mensajes de error personalizables, e iframes con título descriptivo.
- En la boleta: número de orden en texto, "Agregar a Apple o Google Wallet" y un aviso para subir el brillo.
- En el chat: mantener `role="log"` y no anunciar "escribiendo…" en cada tecla.

#### H57 · Rendimiento: falta un presupuesto para cuando lleguen las fotos, el mapa y el chat reales (Media)

**Qué pasa:** el peso de verdad llegará con las fotos reales, el mapa interactivo, el chat en tiempo real y la analítica, y hoy no hay metas definidas.

**Evidencia** (la línea base de hoy es sana):
- Evento pesa 22.205 bytes comprimido y Chat 20.728, con 602 y 639 nodos.
- El runtime pesa 63 KB comprimido, más unos 47 KB de React.
- Las fuentes de Google suman unos 98 KB.
- Con la CPU 4 veces más lenta, cada tecla tarda 40 ms (máximo 80).
- No hay imágenes reales, y el mapa es un dibujo.
- La doble descarga de la página es del modo de vista previa del editor y no aplica a producción.

**Por qué importa:** sin un presupuesto, la experiencia se degrada en un Android de gama media con datos móviles.

**Cómo arreglarlo (M):**
- Metas de Core Web Vitals en el 75 % de las visitas: LCP de 2,5 s o menos, INP de 200 ms o menos y CLS de 0,1 o menos. Además, menos de unos 150 KB comprimidos de JavaScript inicial.
- Imágenes en AVIF o WebP, con varios tamaños y dimensiones fijas, y carga diferida salvo la foto principal.
- El mapa se carga solo al abrirlo.
- Fuentes alojadas en el propio servidor y precargadas.
- Medir con usuarios reales y con Lighthouse en cada cambio.

## Camino recomendado para la compra de boletas

**Lo confirmado.** Con la investigación disponible, comprar boletas de las grandes ticketeras sin salir de Fulleventos no es un camino para el lanzamiento:
- TuBoleta, Primera Fila y Taquilla Live no publican una API de compra para terceros ni un programa de socios.
- La API de Ticketmaster que permite comprar (Partner API) es solo para socios aprobados (confirmado por búsqueda), y Colombia no aparece en su lista de mercados. Su programa de distribución (Distributed Commerce) lo activa el organizador con un acuerdo comercial.
- Fever tiene una plataforma B2B con reservas, pero sujeta a aprobación y sin cobertura confirmada en Colombia.
- Hacer scraping no está autorizado.

Al mismo tiempo, vender boletas propias de conciertos y otros espectáculos de artes escénicas exige cuatro cosas: autorización de MinCultura como operador de boletería en línea (Decreto 1080 de 2015, art. 2.9.2.2.3) o una alianza con un operador autorizado que sea quien contrate con el productor y emita la boleta; el registro del evento en PULEP; el documento equivalente electrónico de la DIAN; y facturar con IVA el cargo por servicio (H1, H4).

**La recomendación** es definir el modo de compra evento por evento y mostrarlo en cada tarjeta y en el checkout:
1. **Gratis:** "Voy" o confirmación de asistencia.
2. **Ticketera externa:** un botón "Comprar en TuBoleta" que abre su sitio (con enlace de afiliado si existe) y luego vuelve a Fulleventos para marcar "Ya compré" y armar el parche. Así la capa social funciona sin depender de vender.
3. **Venta propia,** para organizadores que venden directo: checkout embebido con una pasarela colombiana. En las pasarelas:
   - Wompi cubre los cinco medios del prototipo, pero no divide el pago (le paga a los organizadores con Payouts).
   - ePayco divide de forma nativa y acepta Nequi y Daviplata (Botón Bancolombia, por confirmar).
   - Mercado Pago divide, pero no lista Nequi ni Daviplata como medios directos.
   - Stripe no está disponible para empresas colombianas.

En cualquier caso:
- La boleta se emite solo cuando el webhook confirma el pago aprobado (H2).
- Los cupos se reservan en el servidor (H3).
- El QR es firmado y personal (H11).
- En el pago dividido, cada amigo paga su parte directo a la pasarela, sin una "vaca" guardada en Fulleventos, que es lo que ya propone el diseño (H18).

**Lo que queda por confirmar.**
- research.json se armó con fragmentos de búsqueda, porque el proxy bloqueó la lectura completa de docs.wompi.co, developer.ticketmaster.com y varios sitios .gov.co. Las tarifas, los medios de pago y la división de cada pasarela deben verificarse en sandbox.
- Con un abogado:
  - quién emite el documento equivalente;
  - si un revendedor conectado a un operador autorizado necesita autorización propia;
  - qué régimen aplica a partidos de fútbol y festivales gastronómicos, que no son artes escénicas;
  - el alcance de la Resolución DIAN 0008 de 2024.
- En paralelo, la gestión comercial:
  - aplicar al programa de afiliados y a la plataforma de distribución de Fever;
  - probar la Discovery API de Ticketmaster con `countryCode=CO` para el catálogo;
  - preguntarles a TuBoleta, Primera Fila y Taquilla Live por integraciones privadas.

## Plan de acción

### Ahora: esta semana en el diseño

**Cambios rápidos (esfuerzo S, la mayoría de una línea; varios ya probados en una copia):**
1. H35 (etiqueta viewport) y H8 (`min-width:0` en Chat y Bienvenida), juntos.
2. H7: `aria-disabled`, `inert`, `sc-camel-auto-focus`, Escape en el contenedor raíz y en Agenda, y `role="dialog"` en el panel del Chat.
3. H6 y H16: `scroll-padding`, un contenedor de scroll por paso, y `@media` por altura en el checkout.
4. H1, parte de diseño: marcas reales cambiadas por [BOLETERA] o "ejemplo", y textos según el canal de venta.
5. H21 (total con cargo), H22 (cantidad en 1), H23 (validaciones y errores) y H25, H26 (estado del parche y de las compras).
6. H5 (pie legal y bloque "Vendido por"), H27 (bloque de retracto), H28 (aviso de privacidad y casillas separadas) y H10, parte de diseño (fecha de nacimiento y casilla +18).
7. H15 (arreglo mínimo con `@media`), H44, H45, H39, H37 y H62.
8. Accesibilidad de detalle: H49, H50, H51, H52 y H59.

**Pantallas por diseñar (esfuerzo M):**
- H17 (estados de pago, reserva, carga y error), H20 ("Mis boletas"), H11 (una boleta por asistente) y H24 (mesa VIP).
- H9 (reportar, bloquear e invitaciones), H29 (tarjeta "Solicitud de pago") y H30 (privacidad y tipos de parche).
- H33 (versión pública y pantalla "Entrar"), H46 ("Mi perfil") y H48 (verificación de organizadores).
- H40 y H41 (encabezado móvil, barra inferior y patrones únicos), H42, H43, H36, H38 y H47.

### Antes de lanzar

El lanzamiento recomendado es un MVP público con descubrimiento, cuentas y compra por redirección a la ticketera.

- **Decisiones con un abogado:**
  - H1: el modo de compra por evento y los textos.
  - H4: operador propio o alianza, y PULEP.
  - H10: la política de edad.
  - H5, H27 y H28: datos legales reales, sistema de PQR y políticas de retracto y devolución.
- **Plataforma mínima:**
  - H53: modelo de datos y arquitectura.
  - H14, fase 1: panel de curaduría.
  - H12: cuentas, verificación y registro de consentimientos.
  - H34: URL por evento, Open Graph y schema.org.
  - H47: paginación en el servidor.
  - H55: analítica, Sentry y pruebas.
  - H57: presupuesto de rendimiento.
  - H54: correos básicos.
- **Si el chat sale en el MVP:** no abrirlo sin H9 y H13 (reportar, bloquear y moderación), H29 y H30.

### Después del lanzamiento

Por fases:
- **Fase 2, social:** chat en tiempo real con moderación (H13), notificaciones push (H54) y privacidad de planes y parches (H30).
- **Fase 3, antes de activar la venta propia (bloqueantes):**
  - H4 resuelto.
  - H19: pasarela elegida y probada en sandbox, con campos seguros.
  - H31: modelo del cargo.
  - H2: webhooks, idempotencia y conciliación.
  - H3: reservas atómicas, precios en el servidor y temporizador accesible.
  - H11: QR firmado y validación en la puerta.
  - H56: accesibilidad de los proveedores.
  - H14, fase 3: panel de organizador.
  - H48: verificación de organizadores.
  - H54: correos transaccionales con la boleta y avisos de cancelación.
- **Fase 4, pago dividido del parche:** H18 (reglas de plazo, incumplimiento y mesas) y la parte de producción de H24.
- **Fase 5:** H32 (transferencia y reventa con tope) e integraciones (plataforma B2B de Fever y acuerdos con ticketeras). Seguimiento continuo de H57 y H55.

## Metodología y límites

**Qué se probó y cómo:**
- Lectura del código de las 8 pantallas `.dc.html`.
- Navegador real: Chromium con Playwright, mediante el arnés `tools/dcharness.js`. Se probó a 390, 768 y 1280 px, y además a 320, 360, 375, 412, 1024, 360×740, 640×360 (para simular zoom al 200 %) y 844×390 (celular en horizontal), con emulación de celular real (`isMobile`).
- axe-core en los tres anchos base, junto con desbordes, objetivos táctiles, enlaces y errores de consola (`auditoria/audit-report.json` y capturas en `auditoria/`).
- Navegación solo con teclado (Tab, Shift+Tab, Enter, Espacio y Escape), contando los Tabs y revisando el árbol de accesibilidad.
- Contraste medido por píxeles en unas 2.800 cajas de texto, porque axe dejó más de 70 textos sin evaluar por los degradados.
- Espaciado de texto, movimiento reducido, CPU 4 veces más lenta, peso y nodos, y una carga con JavaScript apagado.
- Correcciones probadas en copias temporales, sin modificar el proyecto.
- Contraste con la investigación previa (`tools/research.json`) y búsquedas web puntuales.
- Los scripts y capturas quedaron en `audit-tmp/`.

**Cómo se consolidó:**
- Cinco auditores por dimensión: código y flujos; accesibilidad; responsive y UI; seguridad, privacidad y legal; y arquitectura y producción. Reportaron 109 hallazgos, que se unieron en 62 (H1 a H62).
- Los 41 hallazgos que llegaron como altos pasaron por una verificación adversarial, es decir, otro auditor intentó refutarlos y los reprodujo por su cuenta:
  - 17 se confirmaron tal cual.
  - 24 se confirmaron con matices: se bajó la severidad, se corrigió el ámbito entre prototipo y producción, o se precisó la evidencia.
  - 0 se refutaron.
- Los 68 hallazgos medios y bajos restantes no pasaron por esa verificación.

**Límites:**
- No hay backend, así que los pagos, reservas, webhooks y el chat en tiempo real se evaluaron como diseño y como requisito, no en funcionamiento.
- Solo se usó Chromium: no se probó en Firefox ni Safari, ni en dispositivos físicos. El comportamiento del teclado virtual en un equipo real y la forma en que el visor del lienzo maneja la etiqueta viewport están por confirmar.
- No se probó con lectores de pantalla reales (NVDA, VoiceOver, TalkBack). Lo que anuncian queda por confirmar.
- El proxy bloqueó la lectura completa de fuentes como w3.org, docs.wompi.co, developer.ticketmaster.com, developers.google.com y varios sitios .gov.co. Parte de la investigación sale de fragmentos de búsqueda.
- Todo lo legal (Ley 1480, Ley 1581, MinCultura, PULEP, DIAN, Código de Policía) es orientativo y debe validarlo un abogado.
- Los datos del prototipo son de ejemplo. Cifras como "9 de 12 eventos pagos" describen la demo, no el mercado real.