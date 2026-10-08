[← Índice del handoff](README.md)

## 2. Decisiones de diseño (y lo que se descartó)

Las decisiones van en el orden en que se tomaron en la conversación con el cliente. Cada una dice **qué se decidió**, **por qué** y **qué se descartó**. Al final hay una lista de **decisiones pendientes** que deben resolverse antes de construir ciertas partes.

### 2.1 Punto de partida: conservar la identidad del marketplace original

- **Qué:** se partió del código del cliente (`diseno/referencia/preview-demo.html`, "Fulleventos Bogotá") y se mantuvieron:
  - la paleta (crema `#FBF7F3`, tinta `#17120F`, rojo `#D9452F`, amarillo `#F6DC6A`, durazno `#F3B27E`, rosado `#EE93BC`);
  - las tipografías (Archivo 800/900 para titulares y DM Sans para la interfaz);
  - el **hero oscuro**, con la etiqueta amarilla "Arma tu parche" y el titular en mayúsculas resaltado con degradado durazno→rosado;
  - las tarjetas de evento con la fecha en una placa blanca, el corazón de guardar y el precio con la boletera;
  - los chips de filtro en píldora;
  - el tono colombiano.
- **Por qué:** el cliente ya tenía una marca visual reconocible y bien resuelta. Convertirla en red social no exigía cambiar de identidad, sino ampliarla.
- **Descartado:** rediseñar desde cero o cambiar la paleta.

### 2.2 Concepto central: el "parche"

- **Qué:** la unidad social del producto es el **parche**: un grupo de personas que van juntas a un evento. Tiene nombre, miembros, cupos ("4 de 6 cupos" con barra de progreso), un evento ligado, un chat de grupo y, en la compra, la opción de pagar dividido.
- **Por qué:** es lo que diferencia a Fulleventos de una boletera. La gente no decide sola a qué evento ir: decide con su gente. Además, "parche" es lenguaje natural del público.
- **Descartado:** un modelo de "seguidores de eventos" sin grupos. Se mantuvo como complemento ("Voy", "Me interesa"), pero no como centro.

### 2.3 Primera versión social: Inicio, Evento y Perfil

- **Qué:** tres pantallas iniciales.
  - **Inicio (feed):** tres columnas.
    - Izquierda: tu cuenta, la navegación y tus parches.
    - Centro: historias "dónde está tu gente", el compositor "¿Qué plan tienes…?", los filtros Amigos / Parches abiertos / Reseñas / Cerca de ti y las publicaciones con evento adjunto.
    - Derecha: "Tu semana", gente con tus gustos y tendencias.
  - **Evento:** hero, Voy / Me interesa / Invitar / Boletas, quién va, pestañas Parches / Muro / Información, ubicación y organizador.
  - **Perfil:** portada, estadísticas, gustos y pestañas Próximos planes / Recuerdos / Reseñas.
- **Por qué:** cubren el ciclo descubrir → decidir con amigos → ir → recordar.
- **Aceptado por el cliente:** "ME ENCANTA LA IDEA, VAMOS A DEJARLA ASÍ".

### 2.4 Reglas de calidad desde el primer diseño

Aplican a toda la implementación.

- **Rojo de marca solo para el logo.** Los rellenos con texto blanco (botones, insignias) usan `#C23A24`, no `#D9452F`. **Por qué:** `#D9452F` con texto blanco da unos 4,0:1 y no cumple el contraste mínimo WCAG AA de 4,5:1 en texto normal. `#C23A24` sí lo cumple.
- **Íconos SVG de trazo, nunca emoji.** **Por qué:** consistencia visual y control de color y tamaño. Los emoji se ven distintos en cada sistema.
- **Sin "lorem ipsum" ni cifras inventadas presentadas como reales.** Lo desconocido va como marcador `[ASÍ]` y el contenido de demostración se rotula "Contenido de ejemplo".
- **Fotos como marcadores** (degradados con la etiqueta "[Foto…]") hasta tener fotos reales. **Por qué:** no usar imágenes de terceros sin derechos.
- **Medios de pago y boleteras nombrados en texto plano**, sin logos. **Por qué:** los logos son marcas registradas. En producción se pueden usar los recursos oficiales de cada proveedor, siguiendo sus guías de marca.
- **Elementos reales y accesibles:** `<button>`, `<a href>`, `<input>` con `<label>`, `aria-pressed` en los botones que alternan y `aria-label` en los botones de solo ícono.

### 2.5 Ver el diseño como página (demo)

- **Qué:** el prototipo se abre en pantalla completa, como sitio web, y no como lienzo con todas las pantallas.
- **Por qué:** el cliente quería ver "un demo de la página".

### 2.6 Lo primero que ve un visitante: Bienvenida + Registro

- **Pregunta del cliente:** "¿qué es lo primero que ve la persona al entrar a la web?".
- **Qué:**
  - **Bienvenida** es la página pública de entrada. Es el marketplace original ampliado: hero + "Cómo funciona" + noticias + agenda con filtros + bloque de cierre para unirse.
  - **Registro**, en 3 pasos:
    1. Tu cuenta: nombre, celular o correo, barrio.
    2. Tus gustos: mínimo 3.
    3. Tu gente: seguir amigos y lugares.

    Al terminar lleva al feed.
- **Por qué:** el feed solo tiene sentido con sesión (sin amigos ni parches, un visitante lo vería vacío). El cliente pidió explícitamente **no perder la idea de "página como el marketplace de eventos"**. El paso de gustos y gente existe para que el feed no arranque vacío.
- **Descartado:**
  - mostrar el feed a visitantes;
  - obligar a registrarse para ver la agenda: se puede "Ver la agenda sin registrarme".
- **En el demo,** "Entrar" lleva directo al feed como si ya hubiera cuenta. En producción hay que diseñar el inicio de sesión (auditoría H12, H33).

### 2.7 Marketplace para usuarios con cuenta, con repost (Agenda)

- **Qué:** la pantalla **Agenda** es el marketplace dentro de la sesión.
  - Cada tarjeta de evento tiene **Repostear** y **Enviar a un amigo**, más la línea social "X y N más lo repostearon".
  - Repostear abre una ventana con:
    - un comentario opcional ("¿Quién se apunta?");
    - la vista previa del evento;
    - **dónde compartirlo**: "En mi feed" / "En un parche" / "Solo a amigos cercanos".
  - Al confirmar sale un aviso con "Ver en mi feed". La tarjeta queda marcada "Reposteaste" y el contador sube en uno.
  - Volver a tocar "Reposteado" quita el repost.
  - Hay un filtro "Lo que repostea tu gente".
- **Por qué:** el cliente pidió "un apartado como el marketplace donde pueda repostear los eventos". El repost convierte el descubrimiento en conversación social.
- **Limitación del prototipo:** el repost no aparece en el feed. En producción debe aparecer como publicación.

### 2.8 Alcance nacional y mapa de eventos

- **Qué:**
  - Todo el producto pasa de "Bogotá" a **"Toda Colombia"**, con 11 ciudades de ejemplo (Bogotá, Medellín, Cali, Barranquilla, Cartagena, Santa Marta, Bucaramanga, Pereira, Villavicencio, Pasto, Leticia) y 19 eventos.
  - Hay un selector de ciudad en el encabezado y chips de ciudad con conteo ("Bogotá 6").
  - Nueva pantalla **Mapa**:
    - Colombia dibujada sobre fondo oscuro, con un **pin por ciudad** cuyo tamaño crece con la cantidad de eventos y muestra el número.
    - Al tocar una ciudad, el mapa **hace zoom hacia ella** y la lista lateral muestra solo sus planes.
    - Botones "Toda Colombia", "Mi ciudad: Bogotá" y acercar/alejar.
    - Filtros de categoría y fecha, más la franja "Ciudades con más planes".
  - Mini-mapas de entrada en Bienvenida ("Todo el país en un mapa") y en el feed; enlaces "Ver en el mapa" en Agenda y Evento; estadística "Ciudades" en el Perfil.
- **Por qué:** el cliente pidió "hacerlo más ambicioso, a nivel nacional, con un mapa donde se vean todos los eventos".
- **Decisiones técnicas del mapa:**
  - **Proyección:** equirectangular simple, `x = (lon + 79.5) × 10`, `y = (13 − lat) × 10`, en `viewBox="0 0 130 175"`. El contorno de Colombia es un `path` dibujado a partir de unos 80 puntos de la frontera (está en `diseno/prototipo/Mapa.dc.html`).
  - **Pines:** son **botones HTML** posicionados en porcentaje (`left`/`top`) sobre el SVG, **no** figuras dentro del SVG, para que sean enfocables, tengan nombre accesible ("Bogotá, 6 eventos") y respondan al clic.
  - **Zoom:** `transform: scale(Z)` del contenido. Los pines se contraescalan (`scale(1/Z)`) para conservar su tamaño, y el zoom se desactiva con `prefers-reduced-motion`.
- **Descartado:**
  - **Mapas de terceros (tiles) en el prototipo,** porque el entorno de diseño no permite red externa. **En producción** hay que elegir proveedor (MapLibre/Mapbox, Google Maps u otro) y conservar la estética oscura, los pines con conteo y el zoom por ciudad (auditoría H57).
  - **"Todo Colombia":** se unificó a **"Toda Colombia"**, por gramática ("Colombia" es femenino) y consistencia.
  - **San Andrés y Providencia** quedan fuera del recuadro del mapa. Si hay eventos allí, se necesita un recuadro aparte (no diseñado).

### 2.9 Chat: conversaciones individuales y de grupo (parches)

- **Qué:** nueva pantalla **Mensajes**.
  - **Lista de conversaciones:** personas, parches y cuentas de organizadores verificadas ("Responde en ~1 h"), con filtros Todos / Parches / Personas / No leídos, búsqueda, conteo de no leídos y una píldora con el evento del parche.
  - **Conversación de un parche:**
    - un **plan fijado** arriba ("Faltan 3 días · 7 de 12 ya tienen boleta", con "Comprar mi boleta");
    - mensajes propios en burbuja tinta y ajenos en burbuja blanca con avatar;
    - **mensajes del sistema** ("Andrés compró 2 boletas · General");
    - **eventos compartidos**;
    - **encuestas votables** ("¿Dónde hacemos la previa?");
    - fotos, reacciones y un compositor para compartir evento, crear encuesta o enviar foto.
  - **Panel de información:** el evento del parche, los miembros con "Tiene boleta" / "Sin boleta", "Dividir pago del parche", silenciar y salir.
  - **"Nuevo parche":** ventana para crear un grupo, ligarlo a un evento y elegir amigos.
- **Por qué:** el cliente lo pidió ("un chat donde se puedan hacer grupos o chats individuales"). Además, el parche necesita un lugar para coordinarse.
- **Pendiente para producción** (auditoría H9, H13, H29, H30):
  - reportar y bloquear;
  - pedir aceptación antes de meter a alguien en un parche;
  - moderación;
  - que una solicitud de pago se distinga de un enlace pegado por un usuario;
  - privacidad de dónde y cuándo estará cada persona.

### 2.10 Página de evento rediseñada y compra dentro de Fulleventos

- **Qué:**
  - **Página de evento:**
    - datos clave (fecha, puertas y show, lugar, edad +18, precio);
    - "Sobre el evento", programación en línea de tiempo y **plano de localidades** cuyas zonas se seleccionan y se sincronizan con la tarjeta de compra;
    - parches del evento, muro, "Lo que debes saber" (políticas), ubicación con "Ver en el mapa" y organizador con "Escribir al organizador";
    - planes parecidos en otras ciudades y recuerdos.
  - **Compra en 4 pasos** en un panel lateral, sin salir de la página:
    1. **Boletas:** localidad, cantidad y "¿Para quién?" (Solo para mí / Para mi parche, con "Dividir el pago").
    2. **Datos:** documento, correo, celular y asistentes.
    3. **Pago:** Nequi, PSE, tarjeta crédito/débito, Daviplata o Botón Bancolombia, con los campos de tarjeta dentro de un recuadro "[PASARELA]", más la casilla de términos.
    4. **Listo:** boleta digital con QR, estado de los pagos del parche, "Avisar a mi parche", "Agregar al calendario" y "Ver mis boletas".

    Muestra un aviso de reserva ("Tus boletas están reservadas por 9:58") y el resumen del pedido con "Cargo por servicio (8%)".
- **Por qué:** el cliente pidió "la compra de su boleta por API para no sacarlos de la página". Dividir el pago resuelve el problema real de "¿quién pone la plata?" en un parche.
- **Lo que se aprendió con la investigación** (detalle y fuentes en `docs/auditoria-2026-10-07.md`, "Camino recomendado"):
  - **Las grandes boleteras de Colombia no ofrecen una API de compra para terceros.**
    - Ticketmaster (que absorbió a Eticket y La Tiquetera) tiene una Partner API solo para socios aprobados, y Colombia no aparece en su lista de mercados.
    - TuBoleta, Primera Fila y Taquilla Live no publican API.
    - Fever tiene una plataforma B2B con reservas, sujeta a aprobación.
    - Eventbrite solo ofrece un widget que crea cada organizador.
  - **Vender boletas propias es viable con una pasarela colombiana con checkout embebido:**
    - Wompi tiene la mayor cobertura de medios locales, pero no divide el pago.
    - ePayco divide el pago de forma nativa.
    - Mercado Pago divide el pago, pero no lista Nequi ni Daviplata.
    - Bold ofrece checkout embebido.
    - **Stripe no está disponible para empresas colombianas.**
  - **Vender boletas propias de espectáculos tiene requisitos legales:**
    - Ley 1493 de 2011: autorización como operador de boletería o alianza con uno, y registro de cada evento en PULEP.
    - Facturación electrónica DIAN.
    - Estatuto del Consumidor: información de quién vende, precio total antes de pagar y retracto.
    - Ley 1581 de 2012 de datos personales.
- **Decisiones que se mantienen del diseño:**
  - **Pago dividido sin custodia de dinero.** Cada amigo paga **su parte directamente a la pasarela** con su propio enlace o intento de pago, y Fulleventos nunca guarda una "vaca" ni una billetera interna. **Por qué:** evita el riesgo regulatorio de captar dinero del público y simplifica las devoluciones.
  - **Los datos de tarjeta solo se escriben en campos de la pasarela** (tokenización en el navegador), para no entrar en el alcance PCI DSS. En el prototipo ese recuadro dice "Campos seguros de [PASARELA]".
  - **"Boletas" ya no lleva a tuboleta.com.** Todos los botones de compra llevan a la página del evento.
  - **El texto legal cambió** de "Las boletas se compran en las boleteras oficiales. Fulleventos no vende entradas." a "Compra segura dentro de Fulleventos. Las boletas las emite la boletera oficial del evento o el organizador."
- **Descartado:**
  - **Redirigir siempre a la boletera:** el cliente no quería sacar a los usuarios de la página. La auditoría lo recomienda **solo como modo de respaldo por evento**; ver 2.12.
  - **Hacer scraping de boleteras:** no está autorizado.
  - **Stripe:** no opera para empresas colombianas.
  - **Que Fulleventos recaude y luego reparta el pago del parche:** riesgo legal.
  - **Pedir claves bancarias dentro de Fulleventos:** Nequi y Daviplata se aprueban en la app de cada uno, y PSE y Botón Bancolombia redirigen a su entidad.

### 2.11 Auditoría experta y su efecto en el diseño

- **Qué:** un agente auditor (`.claude/agents/auditor-web.md`) revisó las 8 pantallas en Chromium a 390, 768 y 1280 px, con axe-core y con teclado.
  - Encontró **62 hallazgos** (16 altos, 41 medios, 5 bajos, ninguno crítico).
  - Los 41 que llegaron como altos los revisó un segundo auditor que intentó refutarlos: ninguno fue refutado y 24 se ajustaron.
- **Decisión:** **las correcciones de diseño de la auditoría son obligatorias en la implementación** (ver la sección 8 de cada pantalla y el plan "Ahora: esta semana en el diseño" del informe). Las más visibles:
  - la etiqueta `viewport`;
  - quitar el scroll horizontal del Chat y la Bienvenida en celular;
  - el foco en el checkout y los modales;
  - la cantidad por defecto en 1;
  - el precio con cargo incluido;
  - un bloque "Vendido por" con razón social, NIT y PQR;
  - un aviso de retracto y devoluciones antes de pagar;
  - la autorización de datos separada de los términos;
  - la fecha de nacimiento y la confirmación +18;
  - los estados de pago pendiente, rechazado, reserva vencida y agotado;
  - "Mis boletas";
  - reportar y bloquear en el chat;
  - la versión pública del evento;
  - un encabezado único.
- **Recomendación de la auditoría sobre el lanzamiento:** primero un **MVP de descubrimiento** (cuentas, agenda, mapa y compra con redirección a la boletera); después la venta propia con pasarela y el pago dividido.

### 2.12 Decisiones pendientes (deben resolverse antes de construir esas partes)

| # | Decisión | Opciones | Recomendación actual | Quién decide |
|---|---|---|---|---|
| P1 | **Modo de compra por evento** | Gratis ("Voy") / Boletera externa (botón que abre su sitio y vuelve a marcar "Ya compré") / Venta propia (checkout embebido) | Mostrar el modo en cada tarjeta y en el evento. El diseño actual solo dibuja la venta propia: falta diseñar las variantes "Gratis" y "Comprar en [BOLETERA]" (auditoría H1). | Fundador + abogado |
| P2 | **Operador de boletería** | Autorización propia ante MinCultura / alianza con un operador autorizado | Validar con abogado (auditoría H4). | Fundador + abogado |
| P3 | **Pasarela de pagos** | Wompi / ePayco / Mercado Pago / Bold / combinación | Probar en sandbox: cobertura de los 5 medios + split o payouts (auditoría H19). | Fundador + tecnología |
| P4 | **Cargo por servicio** | 8 % del prototipo (demo) u otro modelo | Revisar que cubra la comisión de la pasarela en boletas baratas y en el pago dividido (auditoría H31). Mostrarlo incluido en el precio (H21). | Fundador |
| P5 | **Proveedor de mapa** | MapLibre/Mapbox, Google Maps u otro | Conservar la estética del prototipo (auditoría H57). | Tecnología |
| P6 | **¿El chat sale en el MVP?** | Sí, con moderación / después | No abrirlo sin reportar, bloquear y moderación (auditoría H9, H13). | Fundador |
| P7 | **Política de edad** | Fecha de nacimiento en el registro + confirmación +18 en la compra | Requerida (auditoría H10). | Fundador + abogado |
| P8 | **Datos legales reales** | Razón social, NIT, dirección, PQR, políticas de retracto y devolución, política de datos | Requeridos antes de vender (auditoría H5, H27, H28). | Fundador + abogado |
| P9 | **Insignia de organizador verificado** | Qué se verifica y cómo | Definir el criterio (auditoría H48). | Fundador |
| P10 | **Foto real del héroe de Bienvenida** (resuelta: foto de Pexels, ver `src/assets/hero/LEEME.md`) | Foto propia con derechos de uso / foto de banco con licencia | Elegir una foto de un evento en Colombia con derechos de uso y definir la capa oscura que garantice el contraste del texto blanco (detalle fino 18 de Bienvenida). Mientras tanto se usa el fondo degradado (decisión 2.13). | Fundador + diseño |
| P11 | **Datos de la prueba social del héroe** | Qué cuenta como "tener plan" (marcar "Voy", comprar boleta, estar en un parche) y de dónde salen las cifras | Definir la fuente real de "[N] personas" y "[N] ciudades" este finde. El componente ya está listo y se muestra en cuanto reciba datos (decisión 2.13). | Fundador + tecnología |
| P12 | **Descripción para buscadores y vista previa al compartir** | Texto propuesto en `src/layouts/Base.astro` / otro | Aprobar o cambiar la descripción propuesta (decisión 2.15). | Fundador |

### 2.13 Decisiones tomadas al implementar la Bienvenida (7 de octubre de 2026)

Las tomó el cliente al revisar el plan de implementación del héroe.

- **Prueba social oculta hasta tener datos reales.**
  - **Qué:** la línea "[N] personas en [N] ciudades ya tienen plan este finde", con sus 4 avatares, no se muestra. El componente queda listo y aparece solo cuando reciba cifras reales.
  - **Por qué:** los marcadores con corchetes no se publican y no hay que inventar cifras. Todavía no existe la fuente de los datos (pendiente P11).
  - **Descartado:** mostrar el marcador "[N]" o una cifra de ejemplo.
- **Fondo degradado sin la nota de foto.**
  - **Qué:** el héroe usa el fondo con manchas de luz del prototipo, sin la nota "[Foto real de un evento en Colombia]".
  - **Por qué:** la nota es un marcador de diseño y no hay foto real todavía (pendiente P10).
  - **Descartado:** conservar la nota visible.
- **Ajuste del héroe en celular del código base.**
  - **Qué:** por debajo de 820 px el héroe no tiene alto mínimo y su radio baja a 22 px.
  - **Por qué:** con el alto mínimo de 520 px y el radio de 28 px del prototipo, el bloque ocupa más pantalla de la necesaria en celular.
  - **Descartado:** mantener en celular el `min-height: 520px` y el radio de 28 px del prototipo.
- **Hover del botón claro.**
  - **Qué:** "Crear mi cuenta gratis" pasa a fondo `#F3ECE6` al pasar el mouse (hover del `.btn-light` del código base). Resuelve la decisión abierta R1 solo para este botón.
  - **Descartado:** dejarlo sin efecto, como en el prototipo.
- **Destinos de los enlaces del héroe.**
  - **Qué:** "Crear mi cuenta gratis" apunta a `/registro` y "Ver la agenda sin registrarme" a `#agenda`, aunque esas partes todavía no estén construidas.
- **Orden de la página (auditoría H44).**
  - **Qué:** héroe → "Este finde en Colombia" → "Cómo funciona" → Mapa → Únete → Noticias.
  - **Por qué:** en el prototipo el primer "Comprar" aparecía después de 5,5 pantallas en celular. Así los planes a la venta quedan justo después del héroe.
  - **Descartado:** el orden del prototipo (héroe → Cómo funciona → Mapa → Noticias → Agenda → Únete).

### 2.14 Decisiones para terminar la Bienvenida (7 de octubre de 2026)

El cliente pidió construir el producto "tal cual" el prototipo, con las correcciones obligatorias de la auditoría, pantalla por pantalla. Para la Bienvenida eligió lo siguiente.

- **Precio con el cargo (H21).** Las tarjetas dicen "Desde $45.000" y debajo "+ cargo por servicio", sin calcular el porcentaje (pendiente P4). **Descartado:** "Desde $48.600 con cargos" y dejar el precio sin mencionar el cargo.
- **Boleteras (H1).** TuBoleta, Ticketmaster y Fever se reemplazan por "[BOLETERA]" y la agenda lleva la nota "Contenido de ejemplo". Las fuentes de los eventos gratis ("Entrada libre", "Idartes") se mantienen. **Descartado:** mostrar los nombres reales con la nota.
- **Mini-mapa (H60).** Todo el mini-mapa es un solo enlace a `/mapa`; los pines son decorativos. **Descartado:** un enlace por ciudad, que exigiría pines de 24–28 px y agrupar la costa ("Costa Caribe · 3"), sin diseño.
- **Noticias (H36).** Se muestran sin enlace hasta que exista la página de noticia. Por eso las cuatro llevan `h3` (H59). **Descartado:** enlazar a rutas que todavía no existen.
- **Encabezado en celular (H40, H8).** Por debajo de 768 px el encabezado no es fijo. Por debajo de 480 px el selector de ciudad baja a su propia línea dentro del buscador. **Descartado:** el ajuste del código base (ocultar los enlaces del menú).
- **"Este finde" en celular (H44).** Rejilla de una columna, como el prototipo. El carrusel de 4 a 6 tarjetas queda pendiente de diseño.
- **Pie de página (H5).** Los dos textos del prototipo. El pie legal se hace con los datos reales (P8) y el modo de compra (P1).
- **Buscador.** Se conserva "¿Qué plan buscas?". El texto unificado (H41) se decide al construir las pantallas con sesión.

Ajustes de implementación que se derivan de la auditoría, sin texto nuevo inventado:

- **H39.** El chip "Planes con amigos" pasa a llamarse "Con parches abiertos".
- **H1.** El paso 3 de "Cómo funciona" pierde el absoluto "sin salir de Fulleventos": "Crea un grupo para ir juntos o únete a uno abierto, y compra tus boletas."
- **H61.** "Cómo funciona" pasa directo de 1 a 3 columnas (desde 720 px) y no deja una tarjeta sola. Los chips pasan a dos líneas desde 768 px; por debajo se desplazan de lado con un desvanecido en el borde.
- **H59.** Los nombres accesibles de los chips de ciudad empiezan por el texto visible: "Bogotá 6 planes".

### 2.15 Construir el resto de pantallas de corrido (7 de octubre de 2026)

El cliente pidió terminar las pantallas que faltan sin detenerse entre una y otra ("todo de corrido") y aprobó las recomendaciones que estaban abiertas:

- **"Buscar" (H38, H41).** Mientras no exista la pantalla de resultados, en la Bienvenida buscar lleva a "Este finde en Colombia" con la ciudad elegida. En las pantallas con sesión lleva a `/agenda` con la ciudad.
- **Prueba automática (H8).** `npm test` compila el sitio y, con `@playwright/test` y axe-core, revisa cada página generada: sin scroll horizontal a 320, 390, 768 y 1280 px, y sin violaciones de WCAG 2.2 AA a 390 y 1280 px.
- **Descripción para buscadores (H34).** Se propone "Descubre planes en toda Colombia, mira a qué van tus amigos y arma parche: rumba, conciertos, fútbol, teatro y planes gratis este finde." Está armada con frases del producto y queda pendiente de aprobación (P12). Se agregan las etiquetas Open Graph básicas.
- **Margen lateral.** `clamp(16px, 4vw, 24px)` en todo el producto (H41), también en celular.
- **Encabezado con sesión en celular (H40).** Igual que el de visitante: deja de ser fijo por debajo de 768 px. La barra inferior de 5 pestañas queda pendiente de diseño (N70).
- **Texto del buscador con sesión (H41).** "Busca planes, gente o lugares", el texto unificado que recomienda la sección 7.
- **"Volver al feed" pasa a "Volver" (H41).** Regresa a la pantalla de origen cuando se llegó desde Fulleventos; si no, va a Inicio.
- **Sin diseño todavía, se dejan visibles pero sin destino propio:** "Crear evento" lleva a `/crear-evento` (formulario de organizadores, H14 y H38) y "Notificaciones" no abre nada (H54).

### 2.16 Decisiones al construir las pantallas con sesión (7 de octubre de 2026)

Las 7 pantallas restantes se construyeron en paralelo, cada una por un agente distinto, con las mismas reglas del handoff. Estas son las decisiones de interpretación que tomaron y que el cliente debe conocer. El detalle está en el código y en los comentarios de cada componente.

**Comunes a todo el sitio**
- **"Hoy" del demo:** el martes 6 de octubre de 2026 en todas las pantallas (`src/data/demo.ts`, H37), como fija la ficha técnica de Mensajes (4.9). Con los datos de ejemplo, el filtro "Hoy" de Agenda y Mapa muestra su estado vacío, porque no hay eventos ese día.
- **Guardar con marcador (H41):** en todas las tarjetas (Bienvenida, Agenda y Mapa). El corazón queda solo para "Me gusta" en Inicio.
- **Filtros como radios nativos (H59):** ciudad, categoría, fecha, pestañas del feed, encuestas y opciones de compra son radios dentro de `fieldset`/`legend`, con estilo de píldora o tarjeta.
- **Filtros y pestañas en la URL (H42):** `?ciudad=`, `?categoria=`, `?fecha=`, `?pestana=` y `?q=` se leen al cargar y se actualizan al cambiar.
- **Encabezados:** cuando el orden de encabezados lo exigía (axe, H59), los títulos de tarjetas y publicaciones quedaron como `h2` en vez de `h3`.
- **Botones sin destino diseñado (H38):** muestran "Próximamente" o quedan con `aria-disabled`. Por ejemplo: "Enviar a un amigo", Etiquetar, Foto, Reseña, Comentarios, Más opciones, "Buscar amigos en mis contactos" y "Enviar" del muro.
- **Destinos que todavía no existen:** `/entrar` (H12), `/mis-boletas` (H20), `/crear-evento` (H14), `/yo/editar`, `/guardados` y `/ajustes`.

**Por pantalla**
- **Registro:**
  - Se agregan "Ciudad" (lista obligatoria), "Fecha de nacimiento" (H10) y una casilla aparte para la autorización de datos (H28).
  - En celular el bloque decorativo se reduce a una franja con "PASO N DE 3" (H45).
  - Los textos de error son propios ("Escribe tu nombre.", "El celular debe tener 10 dígitos y empezar por 3.", etc.).
  - Laura y Andrés ("Está en tus contactos") no se muestran sin el permiso de contactos.
- **Inicio:**
  - El feed va primero en celular y tableta (H15).
  - Se quitan del texto de ejemplo la reventa (H32) y los puntos de encuentro (H30).
  - Cada historia abre el mapa de su ciudad, porque el visor de historias no está diseñado.
- **Agenda:**
  - Fechas reales: "Hoy", "Este finde" (9 al 12) y "Próxima semana" (13 al 18).
  - La búsqueda `?q=` filtra por título, lugar, ciudad y categoría.
  - El aviso del repost queda en el flujo, como en el prototipo.
- **Mapa:**
  - La hoja inferior de celular no está diseñada. Para resolver H42, al elegir una ciudad la página baja a la lista y el foco va a su título.
  - Sin ciudad elegida, la lista se agrupa por ciudad; con ciudad, por día.
  - Pines con nombre "Bogotá 6 planes".
- **Evento:**
  - Los 18 eventos sin detalle usan la misma plantilla sin las secciones que solo tienen datos para e1. Los pagos venden una sola opción, "Boleta".
  - La compra es una demostración rotulada: "Cargo por servicio (8%, de ejemplo)", "9:58 (demostración)" y el aviso "no se cobra nada ni se emite una boleta real". Los campos de tarjeta son una maqueta inerte dentro de "Campos seguros de [PASARELA]".
  - "Agregar al calendario" descarga un `.ics`.
  - El checkout usa su propio `<dialog>`, porque necesita una cabecera con pasos y temporizador.
- **Mensajes:**
  - Una dirección por conversación (`/mensajes/<id>`).
  - La conversación de celular abre a pantalla completa en el último mensaje (H43).
  - Los avisos de compra no dicen cantidad ni localidad (H30).
  - Textos de interfaz propios para aprobar: "Mostrando N chats", "Saliste de {parche}" y "No uses «oficial», «verificado» ni «Fulleventos» en el nombre.".
- **Perfil:**
  - Al abrir el propio perfil por `/perfil/camivargas` se muestra "Mi perfil".
  - Las demás personas solo muestran nombre, iniciales y un estado vacío, sin inventar biografías.
  - "Planes" reemplaza a "Eventos" (H37).

**Sigue sin diseño (N70) y quedó pendiente**
- Barra inferior móvil (H40).
- Pantalla "Entrar" (H12), versiones públicas (H33) y resultados de búsqueda (H41).
- Reportar y bloquear (H9), invitaciones y tipos de parche (H30), "Solicitud de pago" (H29) y verificación de organizadores (H48).
- Estados de carga, error y pago (H17).
- "Mis boletas" (H20), pie legal (H5) y variantes de compra por modo (P1).
- Carrusel de "Este finde" en celular (H44) y tarjeta compacta de Agenda en celular (H47).
- Favicon: el del sitio anterior usa la paleta descartada. (Resuelto en 2.21.)

### 2.17 Correcciones de la auditoría del sitio implementado (7 de octubre de 2026)

El agente auditor revisó el sitio completo y no encontró hallazgos críticos: 1 alto, 7 medios y 6 bajos. Se corrigieron todos menos los que dependen del cliente. Decisiones de interpretación:

- **Un solo modelo de datos (H37, H53):** la hora de cada evento vive en `src/data/eventos.ts`; los parches, en `src/data/parches.ts`; el estado de la usuaria del demo (a qué va, qué le interesa, sus boletas y sus amigos), en `src/data/asistencia.ts`.
- **"Salseros de jueves":** el handoff no fija el dato. Se usa el del chat: 12 miembros, 7 con boleta y sin cupo máximo. Evento ya no dice "6 de 8 cupos".
- **"Para mi parche" (H25):** solo se puede elegir a quienes no tienen boleta. Los que ya la tienen aparecen aparte con el rótulo "Ya tienen boleta".
- **Estado de cada plan (8.2.8):** "En parche" > "Vas" > "Te interesa", igual en Evento, Inicio y Perfil.
- **Amigos que van:** se calculan con los amigos de la usuaria que están en un parche del evento. Por eso e1 pasa de "3 amigos" a "7 amigos" y de "10 amigos más" a "4 amigos más".
- **"N nuevos" de Inicio:** sale del chat (3).
- **Enlaces a Mensajes (H42):** van a `/mensajes/<conversación>`. "Armar parche" abre `/mensajes?nuevo=parche&evento=<id>`, y "Mensaje" a alguien sin conversación abre `/mensajes?nuevo=chat&persona=<id>`.
- **Mapa (H41):** repostea con la misma ventana de la Agenda, que pasó a `src/components/eventos/`, y tiene el selector "Lista / Mapa" que lleva a la Agenda con los mismos filtros.
- **No indexar mientras sea demostración (H34):** etiqueta `noindex, nofollow` en `Base.astro` y `public/robots.txt` con `Disallow: /`. **Hay que quitarlas al publicar con datos reales.**
- **Aviso de demostración** junto a la boleta del paso 4 y en "Tus boletas", y la nota "Contenido de ejemplo" en las páginas de evento.
- **Títulos de página:** "{Título} · Fulleventos" en todo el sitio (la portada sigue "Fulleventos Colombia").
- **Sin resolver:**
  - La historia de Andrés (llega a Bogotá el jueves y abre un parche en Medellín el viernes): 8.2.3 y 8.2.7 la señalan, pero no dicen cómo resolverla.
  - Los marcadores `[ASÍ]` de Evento: hacen falta los datos reales (P8). Son un bloqueo de publicación.
  - El perfil del organizador (`/perfil/galeria-cafe-libro`): no está diseñado.
  - La unificación de las 7 tarjetas de evento y de los formatos repetidos: es un refactor aparte.

### 2.18 Hero de la Bienvenida al 100 % (7 de octubre de 2026)

El cliente pidió terminar el frontend antes del backend, empezando por el héroe. Decisiones:

- **Foto del héroe (P10).**
  - **Qué:** foto de banco gratuita (Unsplash o Pexels, licencia libre) de un concierto o rumba en Colombia. Se escoge y descarga a mano, porque el entorno de desarrollo no tiene acceso a esos sitios.
  - **Cómo se pone:** se deja el archivo en `src/assets/hero/foto.jpg` (también sirve `.jpeg`, `.png` o `.webp`). El héroe la detecta solo, la convierte a AVIF y WebP en 4 tamaños y la carga con prioridad alta (H57). Sin archivo se sigue viendo el fondo con manchas de luz (decisión 2.13).
  - **Capa oscura (detalle fino 18):** degradado horizontal de `#140E10` al 94 % a la izquierda (donde va el texto) al 25 % a la derecha (donde se luce la foto). En celular, el texto ocupa todo el ancho y la capa queda pareja (78 % → 90 %). La foto es decorativa (`alt=""`): el texto del héroe ya cuenta todo.
- **Encabezado de visitante compacto en celular.**
  - **Qué:** por debajo de 768 px, la primera fila muestra el logo, "Entrar" y un botón de menú. El buscador queda debajo, a todo el ancho. "Cómo funciona", "Mapa", "Agenda", "Entrar" y "Crear cuenta" quedan dentro del menú desplegable.
  - **Por qué:** antes el encabezado ocupaba 264 px y el titular del héroe empezaba a media pantalla. Ahora ocupa unos 165 px. "Crear cuenta" sale de la primera fila porque no cabe a 320 px, y el héroe ya la repite como botón principal ("Crear mi cuenta gratis").
  - **Accesibilidad:** el botón usa `aria-expanded` y `aria-controls`. Escape cierra el menú y devuelve el foco al botón, y al tocar un enlace el menú se cierra. Sin JavaScript, el menú se ve abierto y el botón no aparece.
- **Prueba social:** sigue oculta hasta que el backend entregue cifras reales (P11). No se inventan números.

### 2.19 Héroe minimalista en computador (7 de octubre de 2026)

El cliente pidió un héroe minimalista en computador, a partir de una referencia (foto a todo el ancho, titular limpio, un botón con flecha y una tarjeta flotante de producto), y que en celular quede como estaba.

- **Desde 821 px (computador y tableta horizontal):**
  - Titular en DM Sans 700, blanco, sin mayúsculas ni bloques de degradado: "De la rumba del viernes al concierto del sábado". El texto no cambia, solo su estilo.
  - Sin la etiqueta "Arma tu parche".
  - El botón "Crear mi cuenta gratis" lleva una flecha que se mueve 3 px al pasar el mouse (sin movimiento con `prefers-reduced-motion`). "Ver la agenda sin registrarme" se mantiene (decisión 2.13).
- **Desde 1024 px:** una tarjeta flotante abajo a la derecha con el plan destacado. Es el equivalente de la tarjeta de producto de la referencia: "Destacado este finde", título, lugar, ciudad, fecha y hora, y precio con "+ cargo por servicio". Toda la tarjeta es un enlace al evento. En el demo es e1 ("Noche de salsa y boleros en vivo"); en producción lo elige el equipo editorial desde el backend.
- **Celular (hasta 820 px):** igual que antes, con la etiqueta amarilla y el titular de bloques con degradado (decisión 2.13).
- **Un solo h1:** los dos titulares están en el HTML, pero solo uno se muestra según el ancho. El otro tiene `display: none`, así que nunca hay dos h1 en el árbol accesible.
- **Descartado:** los puntos de carrusel de la referencia. Insinúan varias diapositivas que no existen y serían un control que no hace nada.

### 2.20 Color en el titular minimalista (7 de octubre de 2026)

- **Qué:** el titular de computador lleva en las letras el degradado durazno → rosado de la marca, en tonos suaves (`--peach-suave #F8D3B6` y `--pink-suave #F4C0D8`). La segunda línea va al revés, como alterna el titular de bloques en celular.
- **Por qué:** el cliente quiso conservar los colores de la marca, pero "no tan intensos". Los dos tonos superan 12:1 de contraste sobre el fondo oscuro del héroe.

### 2.21 Logo e íconos de la marca (8 de octubre de 2026)

- **Archivos:** el cliente entregó el logo (PNG con fondo transparente, hecho a partir de su tablero de marca). Están en `src/assets/marca/`: `logo-claro.png` ("eventos" en negro, para fondos claros), `logo-oscuro.png` ("eventos" en blanco), `simbolo.png` (el tiquete solo) e `icono-app.png` (el cuadrado con degradado).
- **Dónde va:** el componente `components/ui/Logo.astro` reemplaza el logo de texto en los tres encabezados (visitante, app y registro). Los tres tienen fondo claro, así que usan `logo-claro`. La versión oscura queda lista para fondos oscuros (`<Logo fondo="oscuro">`). Mide 48 px de alto en computador y 40 px en celular, y se sirve en WebP a 1x, 2x y 3x.
- **Favicon e ícono de app:** salen de `icono-app.png` y quedan en `public/`: `favicon.ico` (16, 32 y 48 px), `favicon-32.png`, `apple-touch-icon.png` (180 px) e `icono-192.png` / `icono-512.png` para `manifest.webmanifest`. Con esto se cierra el pendiente del favicon de la sección 2.16.
- **Color del logo:** el rojo `#D9452F` ("solo para el logo") ya no se usa en los encabezados porque ahora el logo es la imagen. El token `--brand-logo` sigue existiendo para los degradados que lo usan.
