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

### 2.22 Primer lanzamiento sin venta propia (8 de octubre de 2026)

El cliente decidió que en el primer lanzamiento no habrá pasarela de pagos: **Fulleventos no vende boletas**. El evento se muestra completo, con precios y localidades, pero la compra se hace en la boletera o el sitio oficial. Esto resuelve P1 para el primer lanzamiento con el modo "boletera externa". P3 (pasarela) y P4 (cargo por servicio) quedan para la fase 2.

- **Botón de compra.**
  - **Qué:** "Comprar en {vende} ↗" lleva a la boletera en otra pestaña (`target="_blank" rel="noopener"`), con un texto solo para lectores de pantalla: "(abre en otra pestaña)". Es el componente `components/eventos/BotonBoletera.astro`, que usan la tarjeta lateral y la barra de celular (en la barra, compacto: "Comprar ↗", con la boletera en el nombre accesible).
  - **Sin enlace:** si un evento de pago no tiene `urlVenta`, el botón se ve igual pero inactivo (`aria-disabled="true"`, sin enlace) y debajo dice "Demostración: falta el enlace oficial de venta de este evento.". Así está todo el demo, porque las boleteras son `[BOLETERA]` (P8, H1) y no se inventan URLs.
  - **Eventos gratis:** siguen sin botón de compra.
- **Tarjeta lateral: solo lista de precios.**
  - **Qué:** "Boletas", "Desde $45.000", "+ cargo por servicio", la insignia "En venta", cada localidad con su precio y disponibilidad (por ejemplo "Últimas 12"), el botón a la boletera y la nota "La compra se hace en el sitio de {vende}. Fulleventos no vende boletas ni recibe pagos.". Sin cantidad ni subtotal.
  - **Localidades:** el plano y la lista quedan como información, sin elegir zona (elegirla solo servía para comprar). La nota pasa a "Precios en pesos colombianos. El cargo por servicio lo cobra {vende} al comprar.".
- **"Ya tengo boleta" marcado a mano.**
  - **Qué:** en los eventos de pago, junto a "Voy" y "Me interesa", un botón "Ya tengo boleta" que alterna con `aria-pressed`. En el demo el estado es local, como los otros dos.
  - **Por qué:** sin venta propia Fulleventos no sabe quién compró. Los parches siguen mostrando quién ya tiene boleta: los datos de `parches.ts` y `asistencia.ts` pasan a significar "lo marcó", con las mismas cifras.
- **Qué se quitó de la interfaz:** "Mis boletas" del perfil, el visor "Tus boletas" con QR, la ventana de compra con "Para mi parche" (comprar para otros) y "Dividir el pago" del chat. "Comprar mi boleta" del chat pasa a "Ver boletas" (lleva a la página del evento). El CTA de las tarjetas de evento pasa de "Comprar" a "Ver boletas" (los gratis siguen con "Ver plan"). Los textos legales y el paso 3 de "Cómo funciona" ya no prometen la compra dentro de Fulleventos.
- **Interruptor `VENTA_PROPIA` (`src/config.ts`).**
  - **Qué:** con `false` (primer lanzamiento) no se renderizan VentanaCompra, BoletaDigital, Cantidad ni el visor, y `compra.ts` no se incluye en el JavaScript. Con `true` vuelve la compra dentro de Fulleventos tal como estaba (demostración sin backend).
  - **Por qué:** la compra propia y el pago dividido son la fase 2. Las reglas de Pagos de CLAUDE.md siguen aplicando cuando se encienda.
- **Campo `urlVenta`.** `Evento` (en `src/data/eventos.ts`) tiene un campo opcional `urlVenta`, con la URL oficial de venta. Si existe, también es la `url` de las ofertas del JSON-LD (schema.org).

### 2.23 Descripción corta de cada evento (8 de octubre de 2026)

- **Qué:** los eventos sin ficha completa (todos menos e1) muestran la sección "Sobre el evento" con una descripción de una o dos frases (campo `resumen` en `src/data/eventos.ts`). También aparece en los atajos de la página y en la descripción del JSON-LD.
- **Por qué:** el cliente pidió una descripción breve. Antes esos eventos pasaban de los datos clave directo a la ubicación.
- **Cómo se escribió:** solo con lo que se sabe del evento (categoría, lugar, ciudad y si la entrada es libre). No se inventan artistas, horarios, servicios ni cifras. En producción el texto lo escribe el organizador.

### 2.24 Vista pública y sesión de demostración (8 de octubre de 2026)

Un visitante sin cuenta que entraba a un evento desde la Bienvenida veía la página "con sesión": el encabezado de la app con el avatar "CV", "Laura, Andrés, Sofía y 4 amigos más van", los parches con su muro, etc. Lo mismo pasaba en Agenda y Mapa. Todavía no hay autenticación real (llega con el backend), así que el cliente decidió una **sesión de demostración** que funciona como funcionará la real. Esto resuelve H33.

- **Decisión.**
  - Por defecto todo el mundo es visitante. Al "Entrar" o al terminar el Registro se inicia la sesión de demostración (la de Camila Vargas, la usuaria del demo) y el navegador la recuerda. "Cerrar sesión" vuelve a visitante.
  - **Públicas:** Bienvenida, Evento (`/evento/:ciudad/:slug`), Agenda y Mapa. Con sesión pasan a la vista de Camila.
  - **Piden sesión:** Inicio, Mensajes (`/mensajes` y `/mensajes/*`), `/yo` y `/perfil/*`. Sin sesión llevan a `/entrar?volver=<ruta actual>`.
- **Mecanismo (`src/lib/sesion.ts`).**
  - La sesión es la clave `fe-sesion-demo` = `'1'` en `localStorage`. Las funciones son `haySesion()`, `iniciarSesion()`, `cerrarSesion()` y `rutaVolver()`. Todo acceso al almacenamiento va en `try/catch`: si falla (ventana privada, almacenamiento bloqueado) cuenta como "sin sesión", y Entrar y Registro lo dicen en pantalla.
  - `rutaVolver()` solo acepta rutas internas: empiezan por `/`, no por `//`, sin `\` ni caracteres de control, y no son `/entrar` ni `/registro`. Si no, va a `/inicio`.
  - `<html>` sale del servidor con `data-sesion="no"`. Un script muy corto al principio del `<head>` de `layouts/Base.astro`, antes de los estilos, lee la clave y pone `data-sesion="si"`: la página se pinta de una vez en su versión, sin parpadeo. Sin JavaScript se ve la versión de visitante.
  - En las páginas que piden sesión (prop `requiereSesion` de Base), ese mismo script las oculta y hace `location.replace('/entrar?volver=…')` con la ruta, los filtros y el ancla. Si la sesión cambia en otra pestaña o al volver con "Atrás", la página se recarga.
  - Dos clases globales en `styles/base.css`: `.solo-sesion` (se oculta sin sesión) y `.solo-visitante` (se oculta con sesión).
  - Evento, Agenda, Mapa y Bienvenida renderizan los dos encabezados, `EncabezadoVisitante` con `solo-visitante` y `EncabezadoApp` con `solo-sesion`. Cada uno maneja solo sus propios elementos, el ajuste de `scroll-padding-top` (H16) lo hace solo el visible, y Agenda, Mapa y "Este finde" escuchan el selector de ciudad y el buscador de los dos.
  - Los botones con estado de la usuaria ("Voy", "Me interesa", "Ya tengo boleta", "Repostear") salen del servidor como los ve el visitante. Con sesión, el script de la página aplica el estado de Camila.
- **Qué ve el visitante en cada pantalla.**
  - **Encabezado:** el de visitante (N2) con "Entrar" y "Crear cuenta". Fuera de la Bienvenida, "Cómo funciona" va a `/#como-funciona`, "Agenda" a `/agenda` y buscar lleva a la Agenda. "Entrar" y "Crear cuenta" llevan `?volver=` con la página actual, también con sus filtros.
  - **Evento:** todo lo público (descripción, programación, localidades y precios, lo que debes saber, ubicación, organizador, botón de la boletera y planes parecidos). En lugar de los amigos que van, "186 van · 340 interesados". En lugar de los parches y el muro: "Hay N parches abiertos para este plan. Crea tu cuenta para unirte o armar el tuyo.", con "Crear cuenta" y "Entrar".
  - **Agenda:** antetítulo "Agenda" en vez de "Agenda para ti" y una bajada sin gustos. La categoría "Para ti" se llama "Todo" (como en el Mapa) y "Lo que repostea tu gente" no aparece (si llega en la URL, se ignora). En cada tarjeta, el total de reposts ("14 reposts") sin nombres ni avatares de amigos, y sin la marca "Reposteaste".
  - **Mapa:** sin "Mi ciudad: Bogotá" (es la ciudad de Camila) y sin el estado "Reposteado".
  - **Bienvenida:** igual que antes. Con sesión, el encabezado pasa a ser el de la app y se oculta el bloque "Únete" (invita a crear la cuenta que ya se tiene).
- **Acciones que piden cuenta.** Sin sesión no se ejecutan: abren la ventana "Crea tu cuenta para {acción}" (`components/ui/VentanaCuenta.astro`, sobre el Modal compartido, una por página). Tiene el botón "Crear cuenta" (a `/registro?volver=<ruta actual>`) y el enlace "Ya tengo cuenta · Entrar" (a `/entrar?volver=<ruta actual>`). Se marcan con `data-requiere-cuenta="para …"`:
  - **Evento:** "Voy" ("para decir que vas"), "Me interesa", "Ya tengo boleta", "Invitar amigos", "Armar parche", "Seguir" y "Escribir al organizador", y "Ver las N fotos" (lleva a un perfil). "Unirme" queda dentro de los parches, que el visitante no ve.
  - **Agenda y Mapa:** "Repostear" y "Guardar" (marcador). En la Bienvenida el marcador sigue local sin cuenta, como estaba.
  - "Compartir" (copiar el enlace) y "Copiar dirección" funcionan sin cuenta.
- **Pantalla Entrar (`/entrar`). Diseño provisional:** H12 pide diseñarla bien, con verificación del celular, recuperación de la cuenta y registro de consentimientos.
  - Tiene el estilo del Registro: su encabezado (solo el logo), la misma tarjeta y botones de 52 px.
  - Contenido: "Entra a Fulleventos", la nota "Demostración: entras como Camila Vargas.", "Continuar con Google", "Continuar con mi celular" y "¿No tienes cuenta? Crear cuenta" (a `/registro`, conservando `volver`).
  - En el demo, cualquiera de los dos botones inicia la sesión al instante y vuelve a `volver` (o a Inicio). No se piden contraseñas ni datos reales. Si ya hay sesión, la pantalla lleva directo al destino.
- **Registro.** "Ir a mi feed" del paso 3 inicia la sesión de demostración y lleva a `volver` (por defecto `/inicio`). Si `volver` es otra página (por ejemplo el evento desde el que se pidió la cuenta), el botón dice "Continuar". "¿Ya tienes cuenta? Entrar" conserva `volver`.
- **Cerrar sesión.** Botón "Cerrar sesión" en Mi perfil (`/yo`), junto a "Guardados" y "Ajustes y privacidad". Cierra la sesión de demostración y lleva a la Bienvenida como visitante.
- **Pruebas.** `tests/pantallas.spec.ts` hace dos pasadas. Sin sesión revisa todas las páginas, salvo las que piden sesión, de las que comprueba que lleven a `/entrar?volver=<ruta>`. Con sesión revisa `/agenda/`, `/mapa/`, `/inicio/`, `/mensajes/`, `/yo/` y un evento. Las comprobaciones son las mismas: sin scroll horizontal a 320, 390, 768 y 1280 px, y axe sin violaciones a 390 y 1280 px.
- **En producción** la sesión la da el backend: una cookie de sesión segura y las páginas que piden sesión protegidas en el servidor, no en el navegador. La vista de cada evento, agenda y mapa se arma con los datos de quien entra. `lib/sesion.ts`, el script de Base y la nota "Demostración" se reemplazan entonces, pero las clases `solo-sesion` / `solo-visitante`, la ventana "Crea tu cuenta" y el parámetro `volver` siguen sirviendo.

### 2.25 Centro de noticias (8 de octubre de 2026)

El cliente pidió el centro de noticias: "va a ser nuestra principal manera de contenido, porque todo lo que saquemos de ahí se va a automatizar y será contenido". Hasta ahora las noticias eran un bloque fijo de la Bienvenida, sin enlaces (decisión 2.14). **Esta decisión reemplaza "noticias sin enlaces" de 2.14 y resuelve el destino de las noticias de H36:** cada noticia abre su propia página.

- **Formato pensado para automatizar.**
  - **Qué:** cada noticia es un archivo Markdown en `src/content/noticias/<slug>.md`, dentro de una colección de contenido de Astro (`src/content.config.ts`, loader `glob`). El nombre del archivo es la dirección: `/noticias/<slug>`.
  - **Frontmatter validado:** `titulo`, `bajada` (1–2 frases), `fecha` (AAAA-MM-DD), `ciudad` (id de `src/data/ciudades.ts` o `nacional`), `tema` (lista cerrada: conciertos, rumba, deporte, teatro, comida, festivales y guías, en `src/data/noticias.ts`), `eventos` (ids de `src/data/eventos.ts`, puede ir vacío), `destacada`, y los opcionales `antetitulo`, `imagen` (`src` + `alt`) y `fuente` (`nombre` + `url`). El cuerpo es el texto en Markdown.
  - **Por qué:** un sistema que escriba archivos con ese frontmatter publica noticias sin tocar código. Si un archivo trae un tema, una ciudad o un evento que no existen, o le falta un campo, la compilación falla y dice qué archivo y qué campo están mal: nunca se publica una noticia rota.
  - **Guía para quien automatice:** `src/content/noticias/LEEME.md`, que la colección ignora. Explica cada campo, el cuerpo y las reglas de contenido.
  - **Una sola fuente:** `src/data/noticias.ts` ya no tiene noticias, solo la lista de temas. La Bienvenida, `/noticias` y cada noticia leen la colección con `src/lib/noticias.ts`.
  - **Descartado:** dejar las noticias en un archivo `.ts` (obliga a tocar código para publicar) y un CMS externo (dependencia nueva sin decidir).
- **Página `/noticias` (pública).**
  - Como Evento, Agenda y Mapa (decisión 2.24): los dos encabezados y solo uno visible. Antetítulo "Lo que se mueve", título "Noticias de la escena", una bajada y la nota "Contenido de ejemplo".
  - La destacada va grande arriba (la más reciente marcada `destacada`; si no hay, la más reciente). Debajo, las demás en rejilla de la más nueva a la más vieja. En celular las tarjetas de la lista son compactas (miniatura a la izquierda y sin bajada) para que no ocupe una pantalla cada noticia.
  - **Filtros por ciudad y por tema:** chips con `aria-pressed`, solo con las ciudades y los temas que tienen noticias, y en la URL (`?ciudad=&tema=`, H42). Una noticia "cae" en su ciudad y en las ciudades de sus eventos (la guía nacional de planes gratis aparece al filtrar por Pereira o Pasto). Con un filtro, la destacada entra en la lista en su orden. Estado vacío: "Todavía no hay noticias de {tema} en {ciudad}." con "Ver todas las noticias". El número de resultados se anuncia a los lectores de pantalla.
  - **Sin JavaScript** se ven todas las noticias y los filtros no aparecen (no quedan controles que no hacen nada).
- **Página de cada noticia `/noticias/:slug`.**
  - Prerenderizada e indexable (H34), con "Contenido de ejemplo" y "Volver a noticias" arriba y abajo.
  - Antetítulo ({Tema} · {Ciudad} o el `antetitulo` del archivo), título (h1), bajada, fecha larga ("6 de octubre de 2026"), tiempo de lectura (200 palabras por minuto) y la fuente si la hay.
  - "Compartir" copia el enlace (o abre el menú de compartir del celular) con el aviso en `role="status"`, igual que el Evento. Funciona sin cuenta.
  - La imagen del archivo o, si no hay, el degradado del sitio con los colores del primer evento relacionado o del tema.
  - Cuerpo con tipografía de lectura: columna de 680 px (unos 65 caracteres por línea), 1,08 rem e interlineado 1,7.
  - "Eventos de esta noticia" ("El evento de esta noticia" si es uno) con la tarjeta pública de evento (`TarjetaEvento`); su marcador queda local, como en la Bienvenida.
  - "Más noticias": 3 relacionadas, con más peso si comparten tema, ciudad o eventos, y luego por fecha.
  - JSON-LD `NewsArticle` sin URL absolutas mientras no haya `site` en `astro.config.mjs` (igual que el Evento). Título de página "{Título} · Fulleventos" y la bajada como descripción.
- **Fechas absolutas.** Las listas dicen "6 de octubre · 1 min de lectura" en vez de "Hace 3 horas" (texto del prototipo). Las páginas son estáticas: una fecha relativa quedaría mal al día siguiente de compilar.
- **Navegación.**
  - **Bienvenida:** la destacada y las 3 noticias más recientes, cada una con enlace a su página (toda la tarjeta es clicable con un solo enlace por noticia), y "Ver todas las noticias" junto a "Contenido de ejemplo".
  - **Visitante:** "Noticias" en el menú del encabezado (en computador y en el menú plegable de celular), después de "Agenda". Siempre lleva a `/noticias`, también desde la Bienvenida, como "Mapa".
  - **Con sesión:** "Noticias" en el menú "Secciones" de Inicio, con un ícono nuevo de periódico (`noticias` en `Icono.astro`). **Descartado:** un ícono más en el encabezado de la app, porque a 320 px los íconos ya bajan a otra línea y el avatar queda solo en una tercera.
- **Contenido de ejemplo.** 10 noticias: las 4 del handoff (con sus títulos, bajada y antetítulos literales; las 3 de la lista reciben una bajada nueva) y 6 nuevas, repartidas entre Bogotá, Medellín, Cali, Barranquilla, Cartagena y nacionales, en los 7 temas y enlazadas a eventos del demo cuando tiene sentido. Una es una guía: "Cinco planes gratis este finde en Colombia".
  - **Cómo se escribieron:** solo con lo que dicen los datos del demo (lugar, ciudad, fecha, si es gratis). No hay cifras nuevas, citas ni declaraciones de personas o entidades reales, ni artistas confirmados. La hora de cada evento no se copia (H37): está en su tarjeta.
  - **Marcadores que faltan (P8):** `[BOLETERA]`, `[ENLACE OFICIAL]`, `[NOMBRE DEL CLUB]` y `[DIRECCIÓN]`. Se reemplazan antes de publicar con datos reales.
- **Pruebas.** `/noticias` y las 10 noticias entran solas en `npm test`. La pasada con sesión suma `/noticias/` y una noticia.

### 2.26 Crear evento y publicaciones (8 de octubre de 2026)

"Crear evento" llevaba a `/crear-evento`, que no existía (404; decisión 2.15). El cliente pidió que la gente pueda crear eventos nuevos o, si el evento ya está en Fulleventos, hacer una publicación más formal que una entrada del muro.

- **Una pantalla, dos caminos (`/crear-evento`, pide sesión).**
  - **Qué:** empieza con "¿Qué quieres publicar?" y dos opciones como tarjetas con radio: "Un evento nuevo" y "Una publicación sobre un evento". Cada camino tiene "Paso N de M" con barra de progreso y "Atrás". Cada paso es un formulario real con errores junto al campo, resumen de errores y el foco en el primer campo con error. Al cambiar de paso, el foco va al título y se anuncia (H7, H49).
  - **Entradas directas:** `?modo=nuevo`, `?modo=publicacion`, `?evento=<id>` (abre el paso de escribir con ese evento), `?tipo=resena|invitacion|info` y `?texto=`. La URL se actualiza con el camino y el evento, así que al recargar se vuelve al mismo punto (H42). Sin sesión lleva a `/entrar?volver=…`.
  - **Encabezado:** el botón pasa de "Crear evento" a "Publicar", con el ícono +, porque ahora lleva a los dos caminos. Es más corto y no rompe el encabezado entre 320 y 1280 px.
- **Camino A · Evento nuevo (4 pasos).**
  - **Lo básico:** nombre, categoría (las de los datos: Rumba, Conciertos, Deporte, Arte y teatro y Comida) y una descripción corta de 20 a 280 caracteres. "Gratis" no es categoría: se elige en el paso de boletas.
  - **Cuándo y dónde:** fecha (no antes del "hoy" del demo), hora de inicio (debajo se ve "Se verá así: 8:00 p. m."), ciudad, lugar y dirección o barrio.
  - **Boletas:** "Gratis" o "Con boleta". Con boleta son obligatorios el precio desde (se ve "Desde $45.000"), quién vende y el **enlace oficial de venta**: una URL http(s) válida, y si se escribe sin `https://` se le agrega. Debajo va la nota "Fulleventos no vende boletas: el botón de compra llevará a este enlace." (decisión 2.22). Edad mínima opcional (14, 16 o 18).
  - **Foto y revisión:** foto opcional con vista previa local (no se sube a ningún lado), "¿Eres el organizador?" (sí / "No, solo lo estoy compartiendo"), una vista previa con el aspecto de la tarjeta pública de la agenda y un resumen por bloques con "Editar". Editar lleva al paso y su botón dice "Volver a la revisión".
  - **Antiduplicados:** mientras se escribe el nombre se buscan eventos parecidos en `src/data/eventos.ts`, sin tildes ni mayúsculas. Cada palabra pesa menos cuanto más títulos la tienen, para que "noche de salsa" traiga la salsa y no todas las "noches". Si hay de 1 a 3 coincidencias, aparece "¿Es alguno de estos? Ya están en Fulleventos" con "Publicar sobre este evento" (lleva al camino B con ese evento) y "Ver evento" (en otra pestaña, para no perder lo escrito). Se anuncia con una región `aria-live="polite"`.
  - **Moderación:** al enviar se ve "Tu evento quedó en revisión. Te avisamos cuando esté publicado.". Nada se publica sin revisión, porque reportar y bloquear (H9, H13) y el criterio de organizador verificado (P9) siguen pendientes. En el demo el evento **no se guarda**, y lo dicen la nota de la pantalla y la del éxito.
- **Camino B · Publicación sobre un evento.**
  - **Elegir:** un buscador por nombre, ciudad, lugar o categoría y la lista de eventos como opciones seleccionables. Primero van "Tus planes" (los eventos a los que Camila va o donde está en un parche, según `asistencia.ts`) y después "Más eventos en Fulleventos". Si no hay resultados, se ofrece "Publicar un evento nuevo" con lo buscado como nombre.
  - **Escribir:** tipo (Invitación al plan / Reseña o recomendación / Información útil), título (máx. 90), texto (máx. 1.000, con contador), hasta 4 fotos con vista previa y "Quitar", y "¿Quién la ve?": Pública, Solo mis amigos o Mi parche (solo si la usuaria tiene parche en ese evento, `parches.ts`).
  - **Revisar y publicar:** la vista previa es la misma tarjeta que se ve después. Al publicar sale "Publicaste en {evento}" con "Ver en el evento" y "Ir a mi inicio".
- **Publicación formal y entrada del muro.** El muro sigue siendo para comentarios cortos (su envío sigue en "Próximamente"). La publicación tiene una tarjeta propia (`components/publicaciones/TarjetaPublicacion.astro`), con el tipo en una insignia amarilla, quién la ve, el título grande, la autora, el texto, las fotos y el evento en una mini tarjeta enlazada. Es una sola plantilla para todas las pantallas, que llena `lib/publicaciones.ts`.
- **Dónde aparece.**
  - **Evento con muro (e1):** dentro de la pestaña "Muro", arriba de los comentarios. "Ver en el evento" lleva a `#publicaciones` y abre esa pestaña.
  - **Eventos sin ficha completa:** en una sección nueva, "Publicaciones", que también aparece en los atajos.
  - **Inicio:** arriba del feed, en "Tus publicaciones". Las pestañas y el filtro de ciudad no la ocultan.
  - **Accesos para escribir:** "Escribir una publicación" en el evento, junto a "Armar parche" o en la sección "Publicaciones". Sin sesión pide la cuenta (`data-requiere-cuenta`). En el compositor de Inicio, "Etiquetar evento", "Reseña" y "Publicar" llevan al camino B, y "Publicar" lleva lo escrito como `?texto=`. "Foto" sigue en "Próximamente".
- **Demostración.** La publicación se guarda solo en este navegador (`localStorage`, clave `fe-publicaciones-demo`, siempre con `try/catch`), y la tarjeta lo dice con un botón "Eliminar". Las fotos se reducen en el navegador (máx. 1.000 px, JPEG) para que quepan. Si no caben, se guarda sin ellas y se avisa. Si el navegador no deja guardar, se avisa y no se avanza. Lo leído se valida campo por campo y todo el texto se pinta como texto, nunca como HTML.
- **En producción** el backend guarda el evento nuevo con estado "En revisión", con coordenadas para el mapa (H14). También guarda las publicaciones con moderación, reportar y bloquear, y aplica en el servidor quién puede ver cada una. Las fotos se suben a un almacenamiento propio. `lib/publicaciones.ts` y su clave de `localStorage` se reemplazan, pero la tarjeta y los dos caminos siguen sirviendo.

- **Corrección del 9 de octubre (Noticias con sesión).** El cliente no encontraba Noticias con la sesión iniciada: solo estaba en "Secciones" de Inicio. Se agrega el ícono de Noticias (periódico) al encabezado de la app, entre Mapa y Mensajes, marcado como página actual en `/noticias`. Reemplaza lo "descartado" en 2.25: en celular los íconos ya bajaban a su propia fila, así que uno más no rompe nada (las pruebas a 320 px siguen sin scroll horizontal).

### 2.27 Primer bloque de mejoras para celular (9 de octubre de 2026)

Viene de la auditoría de UX en celular (hallazgos UX1, UX2, UX5–UX11, UX14 y UX15). El cliente aprobó este primer bloque. En computador (768 px y más) el encabezado y el resto de las pantallas quedan exactamente como estaban.

- **Encabezado con sesión de una sola fila (UX1).**
  - **Qué:** por debajo de 768 px el encabezado de la app pasa de 227 px (4 filas: logo / buscador / 6 íconos / "Publicar" y avatar) a 61 px. **Variante completa:** logo (32 px de alto, `--tope-logo`), lupa, "+" y avatar, cada uno de 44 × 44. La lupa despliega debajo de la fila el mismo buscador (campo y ciudad), con `aria-expanded` y `aria-controls`, el foco en el campo al abrir y Escape para cerrar y volver a la lupa. Sin JavaScript el buscador se ve abierto y la lupa no aparece (como el menú del visitante, 2.18). **Variantes de detalle:** "Volver" queda solo como flecha de 44 × 44 (el texto "Volver" sigue para lectores de pantalla), el logo centrado en la rejilla de 3 columnas y el avatar a la derecha. Se quitan en celular la fila de íconos, la campana, "Mapa" y Mensajes de `detalle-perfil`: están en la barra inferior.
  - **Nombres:** el "+" se llama "Publicar", igual que el botón con texto de computador (mismo destino: `/crear-evento`, que deja elegir entre un evento nuevo y una publicación).
  - **El encabezado sigue sin ser fijo en celular** (2.14, 2.15), así que el `scroll-padding-top` sigue en 12 px; en computador no cambia.
- **Barra de navegación inferior (N70, ahora diseñada; UX2).**
  - **Qué:** `components/layout/BarraNavegacion.astro`, solo con sesión y por debajo de 768 px. Fija abajo, fondo `--surface`, borde superior `--line`, 56 px más el área segura (`env(safe-area-inset-bottom)`). Cinco pestañas a todo el ancho, con ícono y texto de 12 px: **Inicio** (`/inicio`), **Explorar** (`/agenda`; activa en Agenda y Mapa, que ya tienen el selector "Lista / Mapa"), **Noticias** (`/noticias` y cada noticia), **Mensajes** (con la insignia de chats sin leer y el mismo nombre accesible que el ícono del encabezado: "Mensajes, 3 chats sin leer") y **Tú** (`/yo`).
  - **Noticias con pestaña propia** por decisión del cliente: "no tiene que salir grande pero sí visible: es una de las entradas para darnos a conocer".
  - **Publicar no va en la barra:** es el "+" del encabezado.
  - **Pestaña activa:** `aria-current="page"`, color `--ink`, texto en negrita, trazo más grueso y una raya arriba (no solo el color).
  - **Un solo "Principal" visible:** en celular el nav de íconos del encabezado está oculto, y en computador la barra no se ve.
  - **Dónde va:** en todas las páginas con `EncabezadoApp` (Inicio, Agenda, Mapa, Noticias, cada noticia, Evento, Mensajes, `/yo`, perfiles, `/crear-evento` y la Bienvenida), con `solo-sesion` en las públicas. Con sesión, el `body` reserva su alto abajo (`--espacio-barra-nav`) para que no tape el final de la página ni el pie, y el `scroll-padding-bottom` evita que el foco quede debajo (WCAG 2.4.11).
  - **Conversación a pantalla completa:** la barra no se muestra en `/mensajes/<conversación>` en celular. Taparía el campo de escribir, que va pegado abajo, y la conversación ya tiene su flecha para volver a la lista. En la lista de Mensajes sí está.
  - **Evento:** la barra de compra se apila encima de la barra inferior cuando hay sesión.
- **Ventana "Crea tu cuenta" como hoja inferior y retomar la acción (UX5, UX6).**
  - **Forma `hoja` del Modal:** por debajo de 520 px se pega abajo, a todo el ancho, con radio de 20 px solo arriba, alto automático (máximo 90 % de la pantalla, con scroll interno) y el fondo oscurecido que deja ver la página. Sube con una animación corta, sin movimiento con `prefers-reduced-motion`. En pantallas grandes es igual a `centrada`. La usan la ventana de cuenta y "Repostear evento" (su contenido cabe: unos 620 px a 390 × 740). El botón cerrar mide 44 × 44 en todas las formas.
  - **Retomar:** los controles con `data-requiere-cuenta` llevan `data-retomar="<clave>"`. La ventana arma `volver` con la ruta actual, `?accion=<clave>` y un ancla a su bloque (por ejemplo `/evento/bogota/…?accion=voy#acciones-evento`). Al volver con sesión, la ventana (que está en cada página con acciones de cuenta) quita el parámetro y el ancla de la URL con `history.replaceState`, desplaza hasta el control y le da el foco. El ancla se quita porque, si el navegador la procesa después del script, mueve el foco al documento.
  - **Acciones simples y seguras** (Voy, Me interesa, Ya tengo boleta y Guardar): llevan además `data-retomar-aviso`. Se ejecutan si no estaban hechas y se muestra el aviso `role="status"`: "Listo: vas a {evento}.", "Listo: marcaste que te interesa {evento}.", "Listo: marcaste que ya tienes boleta para {evento}." y "Listo: guardaste {evento}.". El aviso aparece arriba (para no tapar las barras de abajo) y se va a los 8 segundos.
  - **Acciones que abren flujos** (Armar parche, Escribir una publicación, Invitar amigos, Repostear, Seguir, Escribir al organizador y Ver las fotos): solo llevan hasta el botón, sin aviso.
  - La clave se compara tal cual con los controles de la página: una clave desconocida se ignora. `rutaVolver()` sigue rechazando rutas externas y acepta la consulta y el ancla.
- **Bienvenida con sesión e Inicio con un solo "Publicar" (UX7, UX8, UX9).**
  - **Héroe con sesión:** "Ir a mi inicio" (→ `/inicio`) y "Ver la agenda" (→ `#agenda`) en lugar de "Crear mi cuenta gratis" y "Ver la agenda sin registrarme".
  - **Compositor en celular:** una fila con avatar, campo y un botón redondo de enviar. Las opciones (Etiquetar evento, Armar parche, Foto, Reseña) aparecen al enfocar o tocar el campo, en una fila con desplazamiento lateral, y se quedan visibles (si se ocultaran al perder el foco, en iOS se perdería el toque). Sin JavaScript se ven siempre.
  - **Nombres sin duplicar:** el botón del compositor se llama "Publicar lo que escribiste" (en computador sigue diciendo "Publicar" y el resto queda para lectores), porque envía lo escrito. El "+" del encabezado sigue siendo "Publicar" y lleva a elegir qué publicar.
  - **"Tu semana" y "Tus parches"** (antes al final, a unos 3.500 px) van en celular justo después del compositor, en formato compacto (`components/inicio/ResumenCelular.astro`): cada uno en una fila de tarjetas con desplazamiento lateral. En celular se ocultan las tarjetas grandes y el enlace "Tus parches" del menú "Secciones". Los cálculos se comparten en `components/inicio/resumen.ts`. En computador no cambia.
- **Filas de chips con desplazamiento lateral (UX10).**
  - **Qué:** en `/noticias`, por debajo de 768 px, Ciudad y Tema van cada uno en una fila con desplazamiento horizontal, con el rótulo encima. Las pestañas del feed de Inicio también: "Cerca de ti" ya no cae sola en otra línea. Es el mismo patrón de la Agenda y "Este finde" (2.14): relleno para que el anillo de foco no se recorte, desvanecido en el borde y `position: relative` en la fila.
  - **Chips de 44 px** de alto en celular en Noticias, Agenda, "Este finde" y las pestañas de Inicio.
- **`/crear-evento`, camino B (UX11).**
  - **Sin avance automático:** al elegir un evento, la fila "Atrás / Continuar" queda fija abajo, encima de la barra inferior. No se avanza solo porque en un grupo de radios las flechas cambian la elección: se pasaría de paso sin querer (WCAG 3.2.2).
  - **Lista recortada:** sin búsqueda se ven "Tus planes" y los 5 próximos del resto, con el botón "Ver más eventos" (el foco va al primero que aparece). La búsqueda sigue buscando en todos. Un evento elegido se ve siempre, aunque sea de los de más.
- **Barra de compra del evento más liviana (UX14, UX15).**
  - **Sin `urlVenta`:** el botón compacto de la barra se ve claramente inactivo: fondo `--surface-sunken`, texto `--muted` (5:1), borde punteado y sin flecha. La nota "Demostración: falta el enlace oficial…" ya no se ve en la barra (sigue en la tarjeta lateral). En la barra queda solo para lectores, como descripción del botón.
  - **Se oculta** mientras la tarjeta de boletas o la sección de localidades están en pantalla (IntersectionObserver). No se esconde si tiene el foco. "Ir a las boletas" lleva entonces a las localidades.
  - **Eventos gratis:** siguen sin barra.
  - **Espacio inferior** del contenido: 80 px más el área segura (antes 84 o 116 px). Con sesión en celular, el `body` suma la barra inferior. El `scroll-padding-bottom` se calcula con lo que tapan las dos barras.
- **Pruebas.** La pasada con sesión de `npm test` suma la Bienvenida (`/`) y una conversación (`/mensajes/salseros-de-jueves/`), que ahora cambian con la barra inferior: de 287 a 299 pruebas.
- **Queda para los siguientes bloques:**
  - Tarjeta compacta en Agenda, noticia y `/yo` (UX3).
  - Reordenar el evento en celular (UX4).
  - Chat (UX12).
  - Perfiles (UX13).
  - Objetivos táctiles que siguen por debajo de 44 px, por ejemplo en el Mapa (UX16).
  - Registro (UX17).
  - Mapa en celular (UX18).

### 2.28 Filas que se deslizan sin desvanecido (9 de octubre de 2026)

- **Qué:** se quita el desvanecido del borde derecho de todas las filas con desplazamiento lateral: historias, "Tu semana", "Tus parches", pestañas del feed, opciones del compositor, chips de Agenda, "Este finde", Noticias y Mapa, ranking de ciudades y atajos del evento. En celular esas filas llegan hasta el borde de la pantalla (margen derecho negativo igual al margen lateral y relleno del mismo tamaño), así que el siguiente elemento se asoma desde el borde, como en las apps.
- **Por qué:** el cliente lo vio en su celular y no le gustó: el desvanecido parecía un corte. Reemplaza la pista de "hay más" de las decisiones 2.14 y 2.27 (H61): ahora la pista es el elemento que se asoma.

### 2.29 Rediseño del perfil y rueda de ajustes (9 de octubre de 2026)

Viene de la auditoría de UX del perfil (hallazgos PF1–PF14) y de la propuesta de diseño que la acompañó. El cliente pidió "arreglar la parte de perfil, dejarlo bien bonito; debería haber una rueda de configuración con cosas como cerrar sesión y cambiar cuenta". Afecta a `/yo` (Mi perfil) y a `/perfil/:usuario`.

- **Dirección visual.** Perfil "de app social", compacto: portada corta con el lenguaje del héroe, avatar montado sobre ella, una sola fila de acciones, cifras discretas y el contenido en pestañas. Ya no hay botones de cuenta sueltos ("Guardados", "Ajustes y privacidad", "Cerrar sesión" bajo la tarjeta): la cuenta va en la rueda. A 390 px el primer plan de `/yo` pasa de 1.106 px a 700 px desde el borde superior.
- **Token nuevo `--fondo-portada` (cambio al handoff 4.10).** En `styles/tokens.css`: tres manchas (rosada, durazno y morada) sobre `--hero`. Lo aprobó el cliente con el pedido de dejar el perfil "bien bonito". La tarjeta le suma encima una mancha con el color del avatar de cada persona (PF13), para que no todos los perfiles se vean iguales. La página 404 usa la misma portada.
- **Encabezado.**
  - Se quita la variante `detalle-perfil` de `EncabezadoApp` (solo la usaba el perfil) con sus estilos.
  - `/yo` usa la variante `completo` con `activa="yo"`: el avatar del encabezado lleva `aria-current="page"` y un anillo doble (no solo color). Sin "Volver". La barra inferior marca "Tú".
  - `/perfil/:usuario` usa la variante `detalle`, como Evento: "Volver", logo centrado e íconos en computador; flecha, logo y avatar en celular.
- **Tarjeta de perfil (`CabeceraPerfil`).** En celular: portada de 112 px, avatar de 96 px (88 px a 320), nombre, "@usuario · Barrio, Ciudad" (el barrio solo en el propio, H30), acciones, bio, cifras en línea ("13 planes · 3 ciudades…") y gustos. En computador: portada de 184 px, avatar de 136 px, nombre y acciones en la misma fila; desde 1024 px, bio y gustos a la izquierda y las cifras en baldosas a la derecha (entre 768 y 1023 px las cifras bajan bajo la bio).
- **Acciones.**
  - **Mi perfil:** "Editar perfil" (con lápiz) y la **rueda** (44 × 44, `aria-label="Ajustes"`, `aria-haspopup="dialog"`). "Editar perfil" llevaba a `/yo/editar`, que no existe: ahora anuncia "Próximamente podrás editar tu perfil." (H38).
  - **Otra persona:** "Seguir", "Mensaje" y "Más opciones" ("…"). "Seguir" se recuerda en el navegador (clave `fe-seguidos-demo`, siempre con `try/catch`) y anuncia "Ahora sigues a {Nombre}." o "Ya no sigues a {Nombre}." (PF11).
- **Rueda de ajustes (`components/perfil/VentanaAjustes.astro`).** Hoja del Modal compartido (`id="ajustes"`, ancho 440). `/yo#ajustes` la abre al cargar. Contenido y qué hace cada opción en el demo:
  - **Cuenta activa** (no es botón): avatar, "Camila Vargas" y "@camivargas".
  - **Cuenta → "Cambiar de cuenta":** sub-vista en el mismo diálogo, con "Ajustes" para volver (el foco vuelve a la fila), "Cuentas en este dispositivo", la cuenta de Camila marcada "Activa" y "Usar otra cuenta", que cierra la sesión de demostración y abre `/entrar?volver=/yo`. Nota: "En la demostración solo existe la cuenta de Camila." **"Mis boletas"** aparece aquí solo con `VENTA_PROPIA` (decisión 2.22).
  - **Preferencias:** "Notificaciones", "Privacidad" y "Ciudad y gustos" (subtítulo calculado: "Bogotá · 5 gustos"). **Tus datos:** "Privacidad y datos" (Ley 1581). **Ayuda y legal:** "Centro de ayuda", "Términos y condiciones" y "Política de tratamiento de datos". Todas sin pantalla todavía: llevan la píldora "Próximamente" y al tocarlas anuncian "Próximamente podrás {acción}." en un aviso pegado abajo de la hoja (`role="status"`, se borra a los 6 segundos).
  - **"Cerrar sesión"**, aparte y en rojo de acción, **con confirmación** en el mismo diálogo: "¿Cerrar sesión en este dispositivo?" con "Cerrar sesión" (`--brand`) y "Cancelar". Al confirmar cierra la sesión de demostración y lleva a la Bienvenida como visitante. Reemplaza el botón suelto de la decisión 2.24.
  - Al cerrar el diálogo (X, Escape o fuera) vuelve a la lista principal y el foco a la rueda. Las sub-vistas aparecen con un fundido de 150 ms, sin movimiento con `prefers-reduced-motion`.
- **Hoja "Opciones" del perfil ajeno (`VentanaOpcionesPerfil.astro`, H9).** "Compartir perfil" copia la dirección y anuncia "Copiamos el enlace del perfil."; "Invitar a un plan", "Reportar" y "Bloquear a {Nombre}" dicen "Próximamente" mientras no estén diseñados con su moderación.
- **Cifras calculadas (PF6).** `cifrasPerfil(id)` en `src/data/perfil.ts`, la única fuente para Mi perfil y para la tarjeta de Inicio (`CuentaLateral`; se borra `contadores` de `inicio.ts`). Planes = próximos planes + recuerdos (Camila: 5 + 8 = 13); Ciudades = ciudades distintas de esos planes y recuerdos (3); Parches = parches de los que es miembro (3). Seguidores y Siguiendo siguen siendo las del prototipo (412 y 289). Antes eran 38 / 5 / 7 fijas y no coincidían con lo que se veía en las pestañas. No son clicables en esta versión.
- **Pestañas.** Fila deslizante que llega al borde en celular (2.28), con el conteo real al lado (solo si es mayor que cero). Mi perfil: Próximos planes · Parches · Recuerdos · Reseñas · Guardados (`/yo?pestana=guardados`, el enlace de Inicio, ya abre Guardados). Otra persona: Próximos planes · Recuerdos · Reseñas.
- **Paneles.**
  - **Próximos planes:** en celular, filas compactas (`FilaPlan`: miniatura con la fecha, categoría y estado en la misma línea, título y "Vie 9 oct · 8:00 p. m. · Bogotá"); en computador, `TarjetaPlan` en fila deslizante de 220 px entre 768 y 1177 px y en 5 columnas desde 1178 px. Toda la fila o tarjeta es el enlace al evento (PF10).
  - **Parches** (solo Mi perfil): `FilaParche` con el color del parche, "12 miembros · {evento} · Vie 9 oct" y chevrón; lleva a su conversación.
  - **Recuerdos:** 2 columnas en celular y 4 en computador. **Reseñas:** como antes, máximo 760 px.
  - **Guardados:** guardar en Agenda y Mapa todavía no deja registro en el demo, así que siempre muestra el estado vacío.
  - **Estados vacíos** con un componente compartido (`components/ui/EstadoVacio.astro`).
- **Perfil de otra persona (PF1).** "@lauram · Bogotá" (ciudad de los datos, sin barrio) y "2 parches en común: Salseros de jueves y Rockeros del Arena", con enlace a cada chat. Si es amiga, sus próximos planes son los eventos de esos parches, con estado "En parche"; si no, el estado vacío del handoff. No se inventan bio, gustos, cifras ni "amigos en común".
- **Organizador y 404 (PF2).** `/perfil/galeria-cafe-libro` no existe. "Ver las N fotos" (Evento) pasa a ser un botón que con sesión anuncia "Próximamente podrás ver las fotos de ediciones pasadas." (sin sesión sigue abriendo "Crea tu cuenta"), y "Ver perfil del organizador" del chat queda inactivo con la píldora "Próximamente". Nueva página `src/pages/404.astro` con el diseño del sitio (los dos encabezados según la sesión, "Ir al inicio" y "Ver la agenda"); el servidor de pruebas la sirve con estado 404, como Cloudflare.
- **Íconos nuevos** en `Icono.astro`: `rueda`, `salir`, `lapiz`, `cambiarCuenta`, `personaMas`, `ayuda`, `siguiente`, `bandera` y `hoja` (hoja de texto para Términos y Política: `documento` es la cédula de Evento).
- **Pruebas.** La pasada con sesión de `npm test` suma `/perfil/lauram/`: de 299 a 305 pruebas.
- **Textos nuevos por aprobar:**
  - Rueda: "Ajustes", "Cuenta", "Cambiar de cuenta", "Preferencias", "Notificaciones" / "Planes, parches y mensajes", "Privacidad" / "Quién ve tus planes y tu barrio", "Ciudad y gustos", "Tus datos", "Privacidad y datos" / "Descarga, corrige o elimina tus datos (Ley 1581)", "Ayuda y legal", "Centro de ayuda", "Términos y condiciones", "Política de tratamiento de datos", "Próximamente", "Cerrar sesión".
  - "Próximamente podrás elegir qué avisos te llegan / elegir quién ve tus planes y tu barrio / cambiar tu ciudad y tus gustos / descargar, corregir o eliminar tus datos / consultar el centro de ayuda / leer los términos y condiciones / leer la política de tratamiento de datos / editar tu perfil / invitar a {Nombre} a un plan / reportar perfiles / bloquear perfiles / ver las fotos de ediciones pasadas."
  - "Cuentas en este dispositivo", "Activa", "Usar otra cuenta", "En la demostración solo existe la cuenta de Camila.", "¿Cerrar sesión en este dispositivo?", "Volverás a la página de bienvenida como visitante.", "Cancelar".
  - Opciones: "Opciones", "Más opciones", "Compartir perfil", "Copiamos el enlace del perfil.", "Invitar a un plan", "Reportar", "Bloquear a {Nombre}".
  - "Editar perfil", "Ahora sigues a {Nombre}.", "Ya no sigues a {Nombre}.", "{N} parches en común:", "Perfil del organizador".
  - Estados vacíos: "Aún no tienes planes. Explora la agenda", "Aún no estás en ningún parche. Ármalo desde la página de un evento.", "Aquí quedarán los planes a los que vayas.", "{Nombre} todavía no tiene recuerdos a la vista.", "Cuando vayas a un plan, podrás contar qué tal estuvo.", "{Nombre} todavía no ha escrito reseñas.", "Aún no has guardado planes. Toca el marcador de un evento para tenerlo aquí." y "Ver la agenda".
  - 404: "No encontramos esta página", "Puede que el enlace esté mal escrito o que la página ya no exista.", "Ir al inicio".

### 2.30 "Este finde" en filas por categoría (10 de octubre de 2026)

- **Qué:** la sección "Este finde en Colombia" de la Bienvenida deja de ser una rejilla de tarjetas (4 columnas en computador) y pasa a una fila con desplazamiento lateral por categoría, una debajo de otra, en este orden: **Rumba · Conciertos · Gratis este finde · Deporte · Arte y teatro · Comida**. Las tarjetas son las mismas (`TarjetaEvento`, sin cambios de diseño). Un evento puede estar en dos filas (por ejemplo, un concierto gratis). Dentro de cada fila se mantiene el orden intercalado por ciudad (4.3, 6.5).
- **Por qué:** pedido del cliente: "esas tarjetas me gustan, pero deberían ser desplazables horizontalmente según la categoría". Reemplaza el carrusel que quedó pendiente en la decisión 2.14 (H44).
- **Cada fila** (`components/eventos/FilaEventos.astro`):
  - **Cabecera:** `h3` con la categoría y el conteo en gris ("Rumba · 6 planes") y, a la derecha, "Ver todos" → `/agenda?categoria=<id>` (con `&ciudad=<id>` si hay una ciudad elegida). Los títulos de las tarjetas pasan a `h4` dentro de las filas.
  - **Computador (768 px y más):** dos botones redondos de 44 × 44, "Ver planes anteriores de {categoría}" y "Ver más planes de {categoría}", que avanzan las tarjetas que se ven enteras, con desplazamiento suave (sin animación con `prefers-reduced-motion`). Se desactivan en cada extremo; si la flecha que tenía el foco se desactiva, el foco pasa a la otra. Cuando la fila cabe entera (Deporte, Arte y teatro, Comida) las flechas no se muestran.
  - **Celular:** sin flechas; se desliza con el dedo. La fila llega al borde de la pantalla y la tarjeta siguiente se asoma, sin desvanecido (2.28).
  - **Medidas:** tarjetas de 280 px en computador (a 1280 px se ven 4 enteras y se asoma la 5.ª) y de 260 px en celular (`min(260px, 80vw)`), con 16 px de separación (12 px en celular). Ajuste por tarjeta (`scroll-snap`), barra de desplazamiento oculta y relleno vertical para el anillo de foco (patrón de 2.14). Con el teclado, Tab recorre las tarjetas y el navegador desplaza la fila hasta la enfocada.
- **Se quitan:** los chips de categoría (cada fila ya es una categoría; con ellos se va también "Con parches abiertos", que en la Bienvenida no tiene fila) y el botón "Ver N planes más" con su límite de 8 tarjetas.
- **Filtro de ciudad:** se mantienen los chips de ciudad, su sincronización con el selector de ciudad de los encabezados y la actualización de "Ver en el mapa". Al elegir una ciudad cada fila muestra solo sus planes, actualiza su conteo y vuelve al inicio; las filas que quedan vacías se ocultan. El anuncio para lectores dice, por ejemplo, "Bogotá: 6 planes en 6 categorías." (los planes se cuentan una sola vez aunque estén en dos filas). Si no queda ninguna fila, se muestra el estado vacío de siempre: "No hay planes en {ciudad} este finde." con "Ver todos los planes del país".
- **Guardar (demo):** si un evento está en dos filas, marcar uno marca también su copia.
- **No cambia** la página `/agenda` ni el resto de la Bienvenida.

### 2.31 La búsqueda de la Bienvenida lleva a resultados (10 de octubre de 2026)

- **Qué:** en la Bienvenida, buscar con texto en el encabezado lleva a `/agenda?q=<texto>&ciudad=<ciudad>`, que ya filtra por lo escrito ("2 planes para «salsa»…"). Sin texto, sigue bajando a "Este finde".
- **Por qué:** el cliente buscó desde el celular y la lupa "no lo llevaba a nada": la decisión 2.15 hacía que en la Bienvenida la búsqueda solo bajara a "Este finde" e ignorara lo escrito. Con sesión ya iba a la agenda; ahora los dos encabezados se comportan igual.

### 2.32 Hero de intención (10 de octubre de 2026)

El cliente dijo del héroe anterior: "me gusta pero no entiendo bien el fin y no me dan ganas de interactuar… no tanto texto, más al grano y colores de intención". Tras un estudio de referentes (Eventbrite, Fever, DICE, Resident Advisor, Luma…) aprobó esta propuesta. Los patrones que se toman de ellos: **titular corto**, **buscador protagonista**, **chips de intención**, **contenido real** (cifras calculadas, nunca de adorno), **valor antes que cuenta** (se puede usar todo sin registrarse), **color con significado** y **sin carruseles**.

- **Qué reemplaza:**
  - De la 2.13: la etiqueta "Arma tu parche", el titular y los destinos de los enlaces del héroe ("Ver la agenda sin registrarme" sale: el buscador y los chips ya llevan a la agenda).
  - La 2.19 completa (titular minimalista de computador, botón con flecha y tarjeta flotante "Destacado este finde") y la 2.20 (degradado en las letras; se quitan los tokens `--peach-suave` y `--pink-suave`).
  - La parte de la 2.18 que dejó "Crear cuenta" solo en el menú de celular: ahora también está en el héroe, como enlace.
  - Se mantienen la foto con su carga (AVIF/WebP, prioridad alta, `alt=""`), la capa oscura de computador, la prueba social oculta (2.13) y el ajuste de celular (sin alto mínimo, radio de 22 px).
- **Estructura** (`components/bienvenida/Hero.astro`), igual en todos los anchos:
  - **Un solo `h1`:** "Tu plan de este finde, con tu gente". Archivo 900, blanco, `clamp(2.1rem, 6.4vw, 4.2rem)`, interlineado 1, `letter-spacing: -0.03em`, `text-wrap: balance`. Sin degradado ni titular de bloques: se acaba el truco de los dos `h1`.
  - **Línea de apoyo:** "Planes en toda Colombia, quién va y parche para ir." (DM Sans 400, 1,02 rem en celular y 1,15 rem en computador, `--on-dark-muted`).
  - **Buscador** (`form role="search"`, nombre "Buscar planes", a `/agenda` por GET): campo `q` con marcador "Salsa, rock, fútbol, teatro…", selector `ciudad` ("Toda Colombia" y las ciudades) y botón "Buscar", el único rojo (`--brand`) del héroe. Caja blanca: píldora en una fila desde 600 px; en celular, campo arriba y ciudad + botón debajo, con radio `--radius-lg`. Con texto va a `/agenda?q=…&ciudad=…`; sin texto baja a "Este finde" y la ciudad elegida filtra sus filas (mismo comportamiento que el buscador del encabezado, 2.31; la lógica es común, `lib/buscador.ts`). Sin JavaScript va a `/agenda` con los parámetros. El foco del campo se marca en toda la caja con el anillo amarillo.
  - **Chips de intención** (`nav` "Planes por categoría"): enlaces a la agenda filtrada, no botones. Rumba, Conciertos, Gratis, Deporte, Arte y teatro y Comida, cada uno con su color de relleno y texto `--ink`, más "Ver en el mapa" (neutro, contorno blanco) y, con sesión, "Lo que repostea tu gente" (neutro, `?categoria=amigos`). Cada uno lleva el conteo real de planes del finde en un círculo y su nombre accesible es "Rumba 6 planes". Un chip sin planes no se pinta. Al elegir ciudad (en el héroe o en los chips de ciudad de "Este finde"), los enlaces suman `&ciudad=<id>` y los conteos se recalculan. 44 px de alto; en celular la fila se desliza de lado hasta el borde del héroe, sin desvanecido (2.28); desde 768 px baja de línea.
  - **Cifra real:** "**19 planes** este finde en **11 ciudades**", calculada; con ciudad, "**2 planes** este finde en Cali". Es región `aria-live="polite"`.
  - **Cuenta:** "Crear mi cuenta gratis" como enlace subrayado (en la línea de la cifra en computador y en su propia línea en celular); con sesión, "Ir a mi inicio".
- **Capa oscura en celular:** más clara arriba (70 %, donde el titular va sobre la foto) y más oscura abajo (90 %, donde van el formulario y los chips).
- **Encabezado de visitante sin buscador en la Bienvenida:** `EncabezadoVisitante` recibe `buscador={false}` solo en `/`, porque el buscador está en el héroe. Las demás páginas no cambian; el encabezado con sesión conserva su lupa.
- **Medidas:** a 390 × 844 el formulario (248–333 px) y los chips (341–401 px) quedan en el primer pantallazo y el título "Este finde en Colombia" se ve (590–618 px). A 1280 × 800 se ve el inicio de "Este finde" (título a 697 px).
- **Colores por categoría** (cambia la nota 5 de la sección 3: hasta ahora no había un color fijo por categoría). Fuente única en `src/data/categorias.ts` (`id`, `texto`, `color`) y tokens `--cat-*` en `tokens.css`. Se usan en los chips del héroe y como marca (punto de 10 px) junto al título de cada fila de "Este finde" (`FilaEventos`, prop `color`). El color nunca es el único indicador: el nombre siempre está escrito. Los pasteles van como relleno con texto `--ink`, nunca como texto sobre la crema. Las tarjetas y los chips de la Agenda quedan para una fase 2.

  | Categoría | Token | Color | Texto `--ink` encima |
  |---|---|---|---|
  | Rumba | `--cat-rumba` | `--pink` `#EE93BC` | 8,44:1 |
  | Conciertos | `--cat-conciertos` | `--lilac` `#A3A8F0` | 8,33:1 |
  | Gratis | `--cat-gratis` | `--lime` `#B9E07A` | 12,40:1 |
  | Deporte | `--cat-deporte` | `--aqua` `#8FD3D0` | 10,97:1 |
  | Arte y teatro | `--cat-teatro` | `--peach` `#F3B27E` | 10,16:1 |
  | Comida | `--cat-comida` | `--yellow` `#F6DC6A` | 13,60:1 |

  El botón "Buscar" lleva texto blanco sobre `--brand` (5,35:1).
- **Textos:** "Tu plan de este finde, con tu gente" lo eligió el cliente. Están por aprobar: la línea de apoyo, el marcador del buscador, los nombres de los chips ("Gratis" sin "este finde"), la cifra y "Ir a mi inicio" en este lugar.
- **Descartado:** carrusel de destacados (insinúa diapositivas y aleja del objetivo), botón principal "Crear mi cuenta gratis" (la cuenta no es lo primero que se pide) y el titular con pregunta del boceto ("¿Qué hacemos este finde?").
