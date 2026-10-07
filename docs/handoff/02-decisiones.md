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
