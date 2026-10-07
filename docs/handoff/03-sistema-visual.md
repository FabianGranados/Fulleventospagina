[← Índice del handoff](README.md)

## 3. Sistema visual

Esta sección describe el lenguaje visual **común a las 8 pantallas** (Bienvenida, Registro, Inicio/Main, Agenda, Mapa, Evento, Chat y Perfil). Lo que es propio de una sola pantalla está en su ficha (secciones 4 a 6). Aquí está lo que se repite, con su valor exacto, dónde aparece y qué hay que normalizar.

**Cómo leer esta sección**

- **Fuente de cada dato.** Todos los valores salen del código de `diseno/prototipo/*.dc.html` (estilos en línea, `<helmet><style>` y la clase `Component`). Se verificaron en Chromium con el arnés de pruebas a 390, 768 y 1280 px. Cuando un valor viene del código base del cliente (`diseno/referencia/preview-demo.html`) y **no** está en el prototipo, se dice "del código base".
- **Tokens.** El prototipo no usa variables CSS: todo está escrito en línea. Los nombres de token (`--bg`, `--ink`…) son **propuestos** para producción. Donde el código base ya tenía un nombre (`--bg`, `--surface`, `--ink`, `--muted`, `--line`, `--brand`, `--brand-hover`, `--yellow`, `--peach`, `--pink`, `--hero`, `--display`, `--ui`), se conserva.
- **Unidades.** `rem` sobre una raíz de 16 px (`1rem = 16px`). Entre paréntesis va el equivalente en px. Los `clamp()` se dan con sus valores resueltos a 390, 768 y 1280 px.
- **Contraste.** Razón WCAG 2.x calculada con la fórmula de luminancia relativa. Umbrales: 4,5:1 para texto normal, 3:1 para texto grande (desde 24 px, o desde 18,66 px en negrita) y 3:1 para componentes y gráficos (WCAG 1.4.11).
- **Etiquetas.** "**Prototipo**" es lo que hoy existe. "**Propuesta**" es una recomendación de esta entrega que no está en ninguna fuente y que el equipo debe validar. "**Auditoría Hxx**" es una corrección obligatoria del informe `docs/auditoria-2026-10-07.md`.

---

### Colores

#### Paleta núcleo de marca

| Token propuesto | Hex | Uso exacto | Pantallas | Contraste medido |
|---|---|---|---|---|
| `--brand-logo` | `#D9452F` | **Solo** el logotipo "fulleventos" (DM Sans 700, 1,55–1,6 rem). Además aparece como color **decorativo** (nunca detrás de texto): anillo de las historias en Inicio (`linear-gradient(135deg, #F3B27E, #D9452F)`), `bg1` del placeholder del evento e3 "Rock en el Movistar Arena", del recuerdo "Rock al Parque" (Perfil) y de la foto "la fila del concierto pasado" (Chat), y `rgba(217,69,47,.8)` en la imagen de la noticia destacada (Bienvenida). | Las 8 | Logo sobre `#FBF7F3`: **4,07:1**; sobre `#FFFFFF`: 4,34:1. Pasa porque el logo es texto grande en negrita (umbral 3:1) y además los logotipos están exentos (WCAG 1.4.3). Blanco sobre `#D9452F`: **4,34:1** → **no** sirve para texto normal. |
| `--brand` (rojo de acción) | `#C23A24` | Todos los **rellenos con texto o ícono blanco**: botones primarios ("Comprar", "Continuar", "Publicar", "Repostear", "Pagar $…", "Unirme", "Comprar mi boleta", "Enviar"), botón redondo "Buscar" de Bienvenida, insignias de no leídos, insignia "Últimas 12", pin del mapa seleccionado, insignia de cuenta verificada. Como **texto**: antetítulos de sección y de categoría ("CÓMO FUNCIONA", "RUMBA"), "Salir del parche", "Ver en el mapa" del Mapa, separador "N mensajes nuevos", existencias escasas ("Últimas 12" en la tarjeta de compra), hora de las conversaciones con mensajes sin leer en la lista del Chat (`timeColor: v.unread ? '#C23A24' : '#6E6259'`), texto "Me interesa" activo (Evento). Como **línea o gráfico**: contorno de foco, subrayado de la pestaña activa, barras de progreso (registro, cupos de parche, boletas del parche), corazón de "Guardado"/"Me gusta" activo, ícono de pin en la franja de ciudad de Inicio, interruptor "Dividir el pago" encendido, casilla de términos marcada, color de los enlaces al pasar el mouse. | Las 8 | Blanco sobre `#C23A24`: **5,35:1**. `#C23A24` sobre `#FBF7F3`: **5,02:1**; sobre `#FFFFFF`: **5,35:1**; sobre `#E8F4D6`: 4,67:1; sobre `#FBF1C6`: 4,71:1; sobre `#E3E5FB`: **4,30:1 (falla, ver "Detalles finos")**; sobre `#F6DC6A`: 3,91:1 (no usar para texto pequeño). Como contorno de foco: 5,02:1 sobre crema, 3,57:1 sobre `#140E10` y 3,47:1 sobre `#17120F` (pasa 3:1 de componente, pero en fondos oscuros el prototipo usa amarillo). |
| `--brand-hover` | **Pendiente** | El prototipo **no tiene** ningún hover de botón. El código base tenía `--brand-hover: #BF3923` para oscurecer `#D9452F`. Ese valor **no sirve** con el nuevo rojo: `#BF3923` (5,49:1 con blanco) y `#C23A24` (5,35:1) son casi idénticos y el cambio no se notaría. **Propuesta:** usar un rojo más oscuro que ya existe en la paleta, `#B5372B` (blanco encima: 5,92:1). Decisión del equipo de diseño. | — | — |
| `--yellow` | `#F6DC6A` | Etiquetas rectangulares en mayúsculas ("ARMA TU PARCHE", "NUEVO · MAPA DE EVENTOS", "TU SEMANA", "PASO 1 DE 3", "RUMBA · VIE 9 OCT"), insignias "Nuevo", pines del mapa y de los mini-mapas, contador de la ciudad activa en los chips, aviso de reserva "Tus boletas están reservadas por 9:58", fila "Tú pagas 1 de N", "Link enviado · pendiente", "Reposteaste", opción de encuesta elegida, reacción activa, píldora "Organizador · Responde en ~1 h", paso actual del registro, número 1 de "Cómo funciona", avatar de "María F. Gómez"/"Natalia Herrera", iniciales del organizador sobre tinta, contorno de foco sobre el mapa oscuro, enlace "Ver en mi feed" del aviso oscuro. | Las 8 | `#17120F` sobre amarillo: **13,60:1**. Amarillo sobre `#140E10`: 13,97:1; sobre `#17120F`: 13,60:1. Amarillo sobre blanco: 1,37:1 → **nunca** como texto ni como único indicador sobre fondos claros. |
| `--peach` | `#F3B27E` | Mitad del degradado del titular resaltado (con rosado), avatar de "Laura Martínez", gusto "Salsa" en Perfil, ícono "Hora" en Evento, política "Cambios y devoluciones", punto de programación "Clase de salsa gratis", contorno del país en el mini-mapa de Bienvenida (`stroke-opacity: .6`), resplandor del mapa (`rgba(243,178,126,.18)`), inicio del anillo de historias. | Las 8 | `#17120F` encima: 10,16:1. |
| `--pink` | `#EE93BC` | Otra mitad del titular resaltado, número 2 de "Cómo funciona", avatar de "Sofía Cárdenas"/"Carolina Ruiz", gusto "Stand-up", ícono "Lugar", política "No hay reingreso", punto "Orquesta en vivo", borde punteado de la "Pista" (Evento), ícono rosado sobre oscuro (Bienvenida, mapa). | Las 8 | `#17120F` encima: 8,44:1. Rosado sobre `#140E10`: 8,67:1. |

#### La regla del rojo: `#D9452F` solo para el logo, `#C23A24` para todo lo demás

1. **Qué dice la regla.** El rojo original del cliente, `#D9452F`, queda **solo** para el logotipo "fulleventos" y para usos puramente decorativos (degradados, placeholders de fotos). Todo rojo que lleve texto o ícono blanco encima, o que sea texto rojo pequeño, usa `#C23A24`.
2. **Por qué.** Blanco sobre `#D9452F` da **4,34:1**, por debajo del 4,5:1 que exige WCAG AA para texto normal. Los botones del producto usan texto de 13 a 16 px, que no cuenta como texto grande. Blanco sobre `#C23A24` da **5,35:1** y pasa. `#C23A24` como texto sobre crema da 5,02:1 y también pasa; `#D9452F` sobre crema da 4,07:1 y no pasa.
3. **Por qué el logo sí puede usar `#D9452F`.** Es un logotipo (exento en WCAG 1.4.3) y además es texto grande en negrita (24,8–25,6 px, peso 700), cuyo umbral es 3:1.
4. **Diferencia con el código base.** En `preview-demo.html`, `--brand: #D9452F` pintaba el logo (`.logo`), los antetítulos (`.eyebrow`), las categorías (`.kicker`, `.cat`), los botones `.ticket`, el botón `.go`, el corazón de guardar activo (`.save[aria-pressed="true"]`), los hovers (`.nav a:hover`, `.more:hover`, títulos de noticia) y el `:focus-visible`. Al migrar, **todos** esos usos pasan a `#C23A24`, **menos el logo**, que se queda en `#D9452F`.
5. **Dato a corregir en otra parte del documento.** La decisión 2.4 dice que blanco sobre `#D9452F` "da unos 4,0:1". El valor medido es **4,34:1**. La conclusión no cambia (no cumple 4,5:1).

#### Texto

| Token propuesto | Hex | Uso exacto | Pantallas | Contraste medido |
|---|---|---|---|---|
| `--ink` | `#17120F` | Texto principal en todo el producto. También relleno de los botones oscuros ("Crear cuenta", "Crear evento", "Seguir", "Nuevo parche"), de los chips y segmentos activos, del ícono de navegación de la página actual, de las burbujas propias del chat, de las etiquetas "Plato fuerte" y del estado de Perfil ("Va", "Le interesa", "En parche"), del bloque "Únete" (Bienvenida) y "Tu semana" (Inicio), del aviso de repost (Agenda) y del avatar del organizador "GC". | Las 8 | Sobre `#FBF7F3`: **17,44:1**. Sobre `#FFFFFF`: 18,59:1. Sobre los acentos: amarillo 13,60; durazno 10,16; rosado 8,44; lila 8,33; lima 12,40; aguamarina 10,97. Sobre `#F3ECE5`: 15,88; `#EAE1D8`: 14,39. |
| `--muted` | `#6E6259` | Texto secundario: lugar y ciudad de las tarjetas, horas, contadores, ayudas de formulario, "oct" de la placa de fecha, pie de página, "Contenido de ejemplo", etiquetas de datos ("FECHA", "LOCALIDAD"), íconos secundarios (lupa del buscador, "Más opciones", comentarios). También es el texto del botón "Enviar"/"Crear parche"/"Abrir chat" apagado en Chat y el borde punteado de 1,5 px del recuadro "[PASARELA]". | Las 8 | Sobre `#FBF7F3`: **5,54:1**. Sobre `#FFFFFF`: 5,91:1. Sobre `#F3ECE5`: 5,05; `#EAE1D8`: 4,57; `#F1F8E6`: 5,43; `#E8F4D6`: 5,16; `#E3E5FB`: 4,75; `#FBF1C6`: 5,20; `#FCE9F2`: 5,09; `#F8DCEA`: 4,62; `#EDE5DC`: 4,74. Sobre amarillo: 4,32 (no se usa así; no usar). |
| `--on-dark` | `#FFFFFF` | Texto sobre `#140E10`, `#17120F` y `#C23A24`. | Las 8 | Sobre `#140E10`: 19,09; sobre `#17120F`: 18,59; sobre `#C23A24`: 5,35. |
| `--on-dark-muted` | `#D8CEC6` | Texto secundario sobre oscuro: bajadas de los bloques oscuros de Bienvenida, leyenda del mini-mapa, "vie/sáb/dom" y subtítulos de "Tu semana" (Inicio), nivel de zoom "1×" y leyenda del Mapa. | Bienvenida, Main, Mapa | Sobre `#140E10`: **12,33:1**; sobre `#17120F`: 12,00:1. |
| (normalizar a `--on-dark-muted`) | `#E2D8D0` | Subtítulo de cada recuerdo en Perfil ("Bogotá · Sep 2026") sobre la franja `rgba(20,14,16,.72)`. | Perfil | Peor caso medido (franja sobre fondo amarillo `#F6DC6A`): 6,43:1. |
| Transparencias de blanco | `rgba(255,255,255,.65 / .78 / .8 / .88 / .9 / .92)` | `.9`: bajada del héroe de Bienvenida. `.92`: datos del héroe de Evento. `.88`: prueba social del héroe y metadatos de la boleta. `.8`: nota "[Foto real…]"/"[Foto del evento]" y "BOLETA OFICIAL". `.78`: subtexto del segmento activo "¿Para quién?". `.65`: pasos pendientes del registro. | Bienvenida, Evento, Registro | Sobre `#140E10`: .65 → 8,35; .78 → 11,67; .8 → 12,28; .88 → 14,77; .9 → 15,47; .92 → 16,16. Peor caso del héroe (texto .9 sobre la mancha durazno `rgba(214,140,70,.55)`): 5,72:1. |
| `--rating` (normalizar) | `#8A5A00` | Texto "4 de 5" / "5 de 5" de las reseñas en Perfil. | Perfil | Sobre blanco: 5,93:1. |
| (normalizar a `--rating`) | `#E0A21B` | Relleno de las 5 estrellas de la reseña en Inicio. | Main | Sobre blanco: **2,25:1**. Falla 3:1 de gráfico informativo (ver "Detalles finos"). |
| `--placeholder` (Auditoría H52) | Hoy: gris del navegador `#757575` | Ningún campo define `::placeholder`, así que Chromium usa `#757575`. | Las que tienen campos | `#757575` sobre crema: 4,32:1; sobre blanco: 4,61:1. La auditoría pide `#6E6259` (5,54:1 sobre crema). El código base usaba `#9A8E85` (3,19:1 sobre blanco): **no recuperarlo**. |

#### Superficies, líneas y bordes

| Token propuesto | Hex | Uso exacto | Pantallas | Contraste medido |
|---|---|---|---|---|
| `--bg` | `#FBF7F3` | Fondo de página (`body` y contenedor raíz), encabezados (menos Registro, cuyo `header` no declara fondo y es transparente sobre la página), fondo de campos de texto en Registro, Inicio, Agenda y Chat, fondo del panel de conversación del Chat, fondo del diálogo de compra, botones redondos "Cerrar" (40 px), botones "−/+" de cantidad, fila del parche en una publicación, conversación seleccionada en la lista del Chat, opción elegida en la ventana de repost, en el selector de amigos (Chat) y en los miembros del parche del paso 1 del checkout (`bg: on ? '#FBF7F3' : '#FFFFFF'`), aviso del pago dividido, contenedor del segmento "Tipo de persona" (PSE; radio 14 px, `padding: 4px`), borde interior de 3 px de las historias, recortes semicirculares de la boleta. | Las 8 | Texto `#17120F`: 17,44; `#6E6259`: 5,54. |
| `--surface` | `#FFFFFF` | Tarjetas, paneles, ventanas modales (Agenda y Chat), buscador del encabezado, chips inactivos, botones secundarios, placas de fecha, pie fijo del diálogo de compra, barra de compra móvil. | Las 8 | Texto `#17120F`: 18,59; `#6E6259`: 5,91. |
| `--surface-sunken` | `#F3ECE5` | Fondo del contador de un chip de ciudad inactivo ("Bogotá **6**") y relleno de la barra de una opción de encuesta no elegida. | Agenda, Bienvenida, Chat | Texto `#17120F`: 15,88. |
| `--line` | `#EAE1D8` | Borde por defecto de 1 px de tarjetas, paneles, chips inactivos, buscador, campos (Inicio, Agenda, Chat, muro de Evento), divisores del encabezado y del pie, línea base de las pestañas (`box-shadow: inset 0 -1px 0 #EAE1D8`), pista de las barras de progreso, pista del interruptor apagado en Chat, fondo del botón deshabilitado en Chat, borde punteado de los estados vacíos, línea de la línea de tiempo de la programación, separadores de fecha del chat. | Las 8 | Como borde: 1,29:1 sobre blanco y 1,21:1 sobre crema. Sirve como divisor decorativo, **no** como único límite de un control (ver Auditoría H52). |
| `--line-soft` | `#F1EAE3` | Divisores **internos** de una tarjeta: fila de acciones de la tarjeta de Agenda, barra de acciones de la publicación (Inicio), filas de personas en Registro, filas de resultados en Mapa, separadores de la programación, borde superior del interruptor "Dividir el pago". | Agenda, Evento, Main, Mapa, Registro | 1,19:1 sobre blanco (decorativo). |
| `--line-input` | `#D9CEC3` | Borde de 1 px de los campos de texto de Registro y del checkout (datos, tarjeta, PSE, billetera), borde de los chips de gustos inactivos en Registro, pista del interruptor "Dividir el pago" apagado, círculo y conector de los pasos pendientes del checkout, línea punteada de 2 px que separa la boleta. | Evento, Registro | 1,55:1 sobre blanco. La pista apagada del interruptor **falla** 3:1 (Auditoría H52). |
| `--line-strong` | `#17120F` | Borde de 1 px de botones secundarios ("Ver en el mapa", "Ver todos los planes del país", "Seguir", "Repostear", "Voy", "Escribir al organizador"), borde de 1,5 px de la opción elegida, borde de 2 px del subrayado de enlaces ("Ver toda la agenda"), borde inferior de 2 px de los encabezados de ciudad en la lista del Mapa, contorno de 2 px de radios y casillas personalizados. | Las 8 | 18,59:1 sobre blanco. |
| `--disabled-fill` (normalizar) | `#B9AEA4` | Fondo del botón "Continuar" deshabilitado en el paso 2 de Registro y borde punteado de "Buscar amigos en mis contactos". | Registro | Blanco encima: **2,18:1** (es un control deshabilitado, exento; pero se lee mal). |
| `--map-placeholder` | `#EDE5DC` | Fondo del dibujo "[Mapa de la ubicación]" en Evento (con calles blancas en degradado). | Evento | `#6E6259` encima ("[Mapa]"): 4,74:1. |

#### Acentos y avatares

Seis colores pastel se usan como acentos y como fondo de avatares. Todos llevan texto `#17120F` encima.

| Token propuesto | Hex | Nombre | Dónde se usa | Contraste de `#17120F` encima |
|---|---|---|---|---|
| `--peach` | `#F3B27E` | Durazno | Avatar "LM" (Laura). Ver tabla de marca. | 10,16:1 |
| `--lilac` | `#A3A8F0` | Lila | Avatares "AR" (Andrés) y "VQ" (Valentina), parche "Rockeros del Arena" (RK), número 3 de "Cómo funciona", ícono "Edad", política "Documento original", punto "Cierre con DJ", localidad Preferencial, gusto "Rock". | 8,33:1 |
| `--pink` | `#EE93BC` | Rosado | Avatares "SC" (Sofía) y "CR" (Caro), parche "Primera vez bailando". | 8,44:1 |
| `--lime` | `#B9E07A` | Lima | Avatares "JP" (Juan Pablo) y "MJ" (Majo), parche "Clásico capitalino" (CC), ícono "Precio", política "Accesibilidad", localidad General, gusto "Planes gratis". También es el color de **éxito** (ver Estados). | 12,40:1 |
| `--yellow` | `#F6DC6A` | Amarillo | Avatares "MG" (María F./Mafe) y "NH" (Natalia), parche "Salseros de jueves" (SL), localidad Mesa VIP, política "Boleta digital", punto "Apertura de puertas", gusto "Fútbol". | 13,60:1 |
| `--aqua` | `#8FD3D0` | Aguamarina | Avatar "CV" (Camila, la usuaria), "DT" (Daniel), "SB" (Sebas); política "Parqueadero"; ícono del mapa en Bienvenida; mensaje del sistema de pago; cordilleras del Mapa (`stroke-opacity: .32` y `.26`). | 10,97:1 |

Reglas y orden:

1. **Orden canónico de la paleta de avatares** (clases `.c1` a `.c6` del código base): `#F3B27E`, `#A3A8F0`, `#EE93BC`, `#B9E07A`, `#F6DC6A`, `#8FD3D0`.
2. **Avatares de parches nuevos** (Chat, al crear un parche): `['#F3B27E', '#EE93BC', '#8FD3D0', '#B9E07A', '#F6DC6A', '#A3A8F0'][seq % 6]`. Es otro orden; en producción conviene un solo orden y asignar el color de forma estable (por ejemplo, por el identificador).
3. **Organizadores:** fondo `#17120F` con iniciales `#F6DC6A` (13,60:1), en Archivo 900, con radio de cuadrado redondeado (14 px). En Registro, el avatar "GC" tiene fondo `#17120F` y las iniciales heredan `#17120F` (1:1, invisibles): es un error (Auditoría H52).
4. **Personas:** círculo (`border-radius: 50%`), iniciales DM Sans 700. **Parches y organizadores:** cuadrado redondeado (10–14 px; 20 px a 72 px de tamaño), iniciales Archivo 900.
5. **No hay un color fijo por categoría.** La etiqueta de categoría ("RUMBA", "CONCIERTOS") siempre es `#C23A24`, y los acentos se reparten por posición, no por significado. Si el negocio quiere asociar color y categoría, es una decisión nueva.
6. **Sobre fondos oscuros**, los acentos funcionan como color de ícono: amarillo 13,97:1, rosado 8,67:1 y aguamarina 11,27:1 sobre `#140E10`; dentro de la caja `rgba(255,255,255,.08)` dan 11,57, 7,18 y 9,33:1.

#### Oscuros

| Token propuesto | Hex | Uso exacto | Pantallas |
|---|---|---|---|
| `--hero` | `#140E10` | Base de todos los fondos oscuros con degradado: héroe de Bienvenida, bloque "Todo el país en un mapa", bloque decorativo de Registro, héroe de Evento, cabecera de la boleta, miniatura del checkout, sección del mapa en Mapa, mini-mapa de Inicio. Borde de 2 px de los avatares del héroe, de los pines del mini-mapa y de los puntos de conexión del Mapa; borde de 3 px de los pines del Mapa. | Bienvenida, Evento, Main, Mapa, Registro |
| `--ink` (como superficie) | `#17120F` | Bloques oscuros **planos** (sin degradado): "Únete" (Bienvenida), "Tu semana" (Inicio), aviso de repost (Agenda). | Bienvenida, Main, Agenda |
| `--map-land` | `#2E2220` | Relleno del contorno de Colombia en el Mapa y en el mini-mapa de Inicio. | Main, Mapa |
| (normalizar a `--map-land`) | `#2B2124` | Relleno del país en el mini-mapa de Bienvenida. | Bienvenida |
| `--map-border` | `#8A6A55` | Contorno del país (Mapa: 1,4 px; Inicio: 1,2 px; `vector-effect: non-scaling-stroke`). | Main, Mapa |
| `--map-label-sea` | `#7FA3A6` | "MAR CARIBE", "OCÉANO PACÍFICO" (decorativos, `aria-hidden`). | Mapa |
| `--map-label-land` | `#9C8B80` | "PANAMÁ", "VENEZUELA", "ECUADOR", "PERÚ", "BRASIL" (decorativos). | Mapa |
| `--photo-dark` | `#2A1A16` | Base de la imagen de la noticia destacada, de la portada de Perfil y de un recuerdo de Evento. | Bienvenida, Evento, Perfil |
| (suelto) | `#1E1630` | Base de un recuerdo de Evento. | Evento |

Contrastes sobre `#140E10`: etiquetas de mar 6,99:1 y de países 5,83:1 (decorativas); `#D8CEC6` 12,33:1; blanco 19,09:1. El contorno del país frente al fondo: `#2E2220` contra `#140E10` da 1,24:1 (la forma se lee por el borde `#8A6A55`, 3,13:1 contra el relleno).

#### Tintes de localidad y de estado (solo en Evento)

| Token propuesto | Hex | Uso exacto |
|---|---|---|
| `--tint-lime` | `#E8F4D6` | Fondo de la localidad **General** cuando está elegida (lista de localidades, tarjeta de compra y paso 1). En el plano: fondo de la zona cuando **no** está elegida (elegida = `#B9E07A`). |
| `--tint-lilac` | `#E3E5FB` | Igual, para **Preferencial** (elegida en el plano = `#A3A8F0`). |
| `--tint-yellow` | `#FBF1C6` | Igual, para **Mesa VIP** (elegida en el plano = `#F6DC6A`). |
| `--tint-success` | `#F1F8E6` | Fondo del aviso "Tienes N boletas · General" (con borde 1,5 px `#B9E07A`). |
| `--tint-pink-1` / `--tint-pink-2` | `#FCE9F2` / `#F8DCEA` | Rayas de la "Pista" en el plano: `repeating-linear-gradient(135deg, #FCE9F2 0 10px, #F8DCEA 10px 20px)`. |

Regla de los tintes: la muestra fuerte (`swatch`) marca la localidad (cuadradito de 16 px en la lista y zona elegida en el plano) y el tinte claro es el fondo de la opción elegida. Texto encima: `#17120F` (16,23, 14,93 y 16,37:1) y `#6E6259` (5,16, 4,75 y 5,20:1).

#### Placeholders de fotos por evento (pares `bg1` / `bg2`)

Mientras no haya fotos reales, cada evento se pinta con un degradado de dos colores (fórmula en "Degradados y fondos especiales"). El par es parte del dato del evento y se repite igual en Bienvenida, Agenda, Mapa, Inicio, Evento, Chat y Perfil.

| Evento | `bg1` (brillo) | `bg2` (fondo) |
|---|---|---|
| e1 Noche de salsa y boleros en vivo | `#E8A04F` | `#B5372B` |
| e2 Festival de jazz al parque | `#4F6DD8` | `#1E2550` |
| e3 Rock en el Movistar Arena | `#D9452F` | `#2B0F12` |
| e4 Santa Fe vs. Millonarios | `#C4302B` | `#1F3A8A` |
| e5 Stand-up: risas de domingo | `#EE93BC` | `#5A2340` |
| e6 Mercado gastronómico de las Américas | `#F6DC6A` | `#C46A2B` |
| e7 Noche de reguetón en Provenza | `#6B3FA0` | `#0E0A1A` |
| e8 Atlético Nacional vs. Junior | `#3E9B63` | `#0F2A1C` |
| e9 Milonga en Manrique | `#B88A5A` | `#3A2414` |
| e10 Viejoteca de salsa caleña | `#F3B27E` | `#8A2E1F` |
| e11 Concierto de músicas del Pacífico | `#8FD3D0` | `#12343A` |
| e12 Vallenato en el Gran Malecón | `#F6DC6A` | `#1E5A7A` |
| e13 Noche de champeta en Getsemaní | `#EE93BC` | `#4A1A3A` |
| e14 Atardecer electrónico en la playa | `#F3B27E` | `#1E2550` |
| e15 Festival de cerveza artesanal | `#E8A04F` | `#5A3A14` |
| e16 Noche de trova en el lago | `#A3A8F0` | `#2A2550` |
| e17 Joropo en Los Fundadores | `#B9E07A` | `#2A3A14` |
| e18 Concierto andino en la plaza | `#8FD3D0` | `#2A1F3A` |
| e19 Música y comida en el malecón del Amazonas | `#B9E07A` | `#12343A` |

Otros placeholders con color fijo:

- **Recuerdos de Perfil** (`bg1` / `bg2`): "Techno hasta el amanecer" `#6B3FA0`/`#0E0A1A`; "Feria de las Flores" `#F6DC6A`/`#3E9B63`; "Rock al Parque" `#D9452F`/`#2B0F12`; "Mercado de las Américas" `#F6DC6A`/`#C46A2B`; "La casa de Bernarda Alba" `#B88A5A`/`#3A2414`; "Salsa al Parque" `#E8A04F`/`#B5372B`; "Stand-up en Teatro Libre" `#EE93BC`/`#5A2340`; "Carnaval de Barranquilla" `#EE93BC`/`#1E5A7A`.
- **Fotos del chat** (`bg1` / `bg3` / `bg2`): "[Foto: la pista en la edición pasada]" `#F3B27E`/`#E8A04F`/`#5A2340`; "[Foto: la fila del concierto pasado]" `#D9452F`/`#F3B27E`/`#2B0F12`; "[Foto que compartiste]" `#F6DC6A`/`#EE93BC`/`#C46A2B`. Valores por defecto si faltan: `#F6DC6A`, `#EE93BC`, `#5A2340`.
- **Recuerdos de ediciones pasadas** (Evento, 6 cuadros): ver "Degradados y fondos especiales".
- **Sin evento** (Chat, plan o tarjeta vacía): `bg1 = bg2 = #EAE1D8`.

Contraste: no aplica a la foto (decorativa, con `role="img"` y `aria-label="[Foto del evento]"`). Lo que va **encima** sí tiene contraste propio: la placa de fecha es blanca (texto 18,59:1) y el botón de guardar es `rgba(255,255,255,.94)`. Según el color que quede debajo del botón, el corazón `#17120F` da entre **16,35:1** (peor caso, sobre `#0E0A1A` de e7) y 18,23:1 (sobre `#F6DC6A`), y el corazón activo `#C23A24` entre **4,71:1** (peor caso, sobre `#0E0A1A`) y 5,25:1; sobre el rojo `#D9452F` de e3 da 4,95:1. Todo pasa el 3:1 de ícono.

#### Transparencias `rgba`

| Valor | Uso exacto | Pantallas |
|---|---|---|
| `rgba(23,18,15,.55)` | **Fondo oscuro detrás de las ventanas** (repost, checkout, nuevo chat/parche). | Agenda, Evento, Chat |
| `rgba(23,18,15,.66)` | Píldora del texto alternativo sobre una foto del chat. Blanco encima, peor caso (foto amarilla): 7,16:1. | Chat |
| `rgba(20,14,16,.9)` | Etiqueta del nombre de la ciudad junto a un pin del Mapa (no elegida). | Mapa |
| `rgba(20,14,16,.72)` | Franja inferior con título y fecha de cada recuerdo (Perfil). Blanco encima: 9,03:1 en el peor caso. | Perfil |
| `rgba(255,255,255,.94)` | Fondo del botón redondo "Guardar" sobre la foto de la tarjeta. | Agenda, Bienvenida |
| `rgba(255,255,255,.08)` | Fondo de las cajas de ícono de 36 px (bloque del mapa en Bienvenida), de los botones inactivos "Toda Colombia"/"Mi ciudad: Bogotá" sobre el mapa oscuro y color de los puntos de la trama del mini-mapa de Inicio. | Bienvenida, Main, Mapa |
| `rgba(255,255,255,.12)` | Puntos de la trama del mapa grande. | Mapa |
| `rgba(255,255,255,.07)` | Borde del marco interior del mapa. La retícula del mini-mapa de Bienvenida usa `#FFFFFF` con `stroke-opacity: .07`. | Mapa, Bienvenida |
| `rgba(255,255,255,.3)` | Borde de los botones inactivos sobre el mapa oscuro y del grupo de zoom. | Mapa |
| `rgba(255,255,255,.35)` | Borde de la nota "[Foto…]" en los héroes. | Bienvenida, Evento |
| `rgba(255,255,255,.4)` | Borde del botón "Continuar con mi celular" (bloque "Únete"). | Bienvenida |
| `rgba(255,255,255,.65)` a `.92` | Textos claros secundarios sobre oscuro (ver tabla Texto). | Bienvenida, Evento, Registro |
| `rgba(246,220,106,.75)` | Línea que une un pin desplazado con su ubicación real (Cartagena, Santa Marta, Villavicencio). | Mapa |
| `rgba(246,220,106,.2)` | Halo de 4 px de los pines del mini-mapa (`box-shadow`). | Bienvenida |
| `rgba(194,58,36,.6)` y `rgba(194,58,36,.22)` | Halo doble del pin elegido (4 px y 12 px). | Mapa |
| `rgba(243,178,126,.18)` | Resplandor del país (`filter: drop-shadow`). | Mapa |
| `rgba(0,0,0,.35/.4/.45/.7)` | Sombras de pines y etiquetas del mapa, y sombra de texto del mini-mapa. Ver "Sombras". | Main, Mapa |
| `rgba(23,18,15,.07/.08/.14/.16/.18/.3/.35)` | Sombras sobre fondo claro. Ver "Sombras". | Agenda, Chat, Evento |
| Manchas de color de los fondos oscuros | `rgba(214,140,70,…)`, `rgba(190,70,80,…)`, `rgba(230,170,80,…)`, `rgba(70,30,80,…)`, `rgba(246,220,106,…)`, `rgba(238,147,188,…)`, `rgba(217,69,47,.8)`, `rgba(232,160,79,…)`, `rgba(181,55,43,…)`: ver "Degradados y fondos especiales". | Bienvenida, Evento, Mapa, Perfil, Registro |
| `opacity: .5` sobre `#C23A24` | Las dos líneas de 1,5 px del separador "N mensajes nuevos". | Chat |

#### Estados (éxito, atención, error, deshabilitado)

| Estado | Color | Dónde aparece hoy | Contraste |
|---|---|---|---|
| **Éxito / confirmado** | `#B9E07A` (lima) + `#17120F` | Insignia "En venta", pasos completados del checkout (círculo lima con borde tinta y check), círculo de 52 px de "¡Listo, Camila!", "Ya tienes boleta", "Tiene boleta" (círculo de 20 px con check), punto "En línea" (9 px con anillo `0 0 0 1.5px #17120F`), mensaje del sistema "compró 2 boletas", aviso "Tienes N boletas" (fondo `#F1F8E6`, borde 1,5 px `#B9E07A`, círculo tinta con check lima). | Tinta sobre lima: 12,40:1. Lima sobre blanco: 1,50:1 → el lima **nunca** es la única señal: siempre va con texto o check. |
| **Atención / pendiente / novedad** | `#F6DC6A` (amarillo) + `#17120F` | "Tus boletas están reservadas por **9:58**", "Link enviado · pendiente", "Tú pagas 1 de N", insignias "Nuevo", "Reposteaste". | 13,60:1 |
| **Urgencia / alerta / no leído** | `#C23A24` + `#FFFFFF` | Relleno rojo con texto blanco: insignia "Últimas 12" (lista de localidades), contadores de no leídos, botón "Sí, salir". Texto rojo sobre claro (sin relleno): botón de texto "Salir del parche" (fondo transparente sobre blanco), "Últimas 12" en la tarjeta de compra y en el paso 1, hora de un chat con no leídos. | 5,35:1 (blanco sobre rojo y rojo sobre blanco); 5,02:1 rojo sobre crema |
| **Error de formulario** | **No existe en el prototipo** | No hay mensajes de error por campo (Auditoría H23 pide `aria-invalid`, `aria-describedby`, resumen de errores y "obligatorio" en la etiqueta). **Propuesta:** texto de error en `#C23A24` (5,02:1 sobre crema, 5,35:1 sobre blanco), siempre con ícono y texto, y borde del campo de 2 px `#C23A24`. Las pantallas de pago rechazado, reserva vencida y agotado tampoco existen (Auditoría H17). | — |
| **Deshabilitado** | Tres tratamientos distintos | Evento: `button:disabled{cursor:default;opacity:.45}` (blanco sobre el rojo al 45 % sobre blanco = `#E4A69C`: 2,05:1). Mapa: `opacity:.4` (ícono blanco al 40 % sobre el mapa: 3,80:1). Chat: sin opacidad; el botón cambia a fondo `#EAE1D8` con texto `#6E6259` (4,57:1) y `cursor: default`. Registro: fondo `#B9AEA4` con texto blanco (2,18:1) y **cursor de mano** (no hay regla `:disabled`). | Los controles deshabilitados están exentos de contraste en WCAG, pero hay que unificar (ver "Foco y estados globales"). |
| **Seleccionado / activo** | `#17120F` + `#FFFFFF`, o borde `#17120F` | Ver "Foco y estados globales". | 18,59:1 |
| **Calificación** | `#8A5A00` (texto), `#E0A21B` (estrellas) | Reseñas de Perfil e Inicio. | 5,93:1 y 2,25:1 |

#### Colores sueltos o casi duplicados: qué normalizar

| Color | Dónde | Casi igual a | Recomendación |
|---|---|---|---|
| `#2B2124` | País del mini-mapa de Bienvenida | `#2E2220` (Mapa, Inicio) | Usar `#2E2220` en los tres mapas. |
| `#E2D8D0` | Subtítulo de recuerdos (Perfil) | `#D8CEC6` | Usar `#D8CEC6`. |
| `#F3ECE5` | Contador de chip, barra de encuesta | `#F1EAE3` (divisor), `#F3ECE6` (hover del código base) | Mantener `#F3ECE5` como superficie hundida y `#F1EAE3` como divisor; si se recupera el hover del botón blanco, usar `#F3ECE5` en lugar de `#F3ECE6`. |
| `#D9CEC3` | Bordes de campo en Registro y Evento | `#EAE1D8` (bordes de campo en Inicio, Agenda, Chat) | Un solo borde de campo para todo el producto. Como los dos fallan 3:1, la Auditoría H52 propone `#857870` (4,27:1 sobre blanco, 4,01:1 sobre crema) para bordes de campo y pistas de interruptor apagadas. |
| `#B9AEA4` | Botón deshabilitado de Registro | — | Eliminar al unificar el estado deshabilitado. |
| `#8A5A00` y `#E0A21B` | Calificaciones | — | Un solo token `--rating`. Si las estrellas deben verse, necesitan 3:1 (por ejemplo `#8A5A00`) o acompañarse del texto "5 de 5". |
| `#EDE5DC` | Placeholder del mapa de ubicación | `#EAE1D8` | Desaparece cuando haya mapa real (decisión P5). |
| `#1E1630`, `#7FA3A6`, `#9C8B80`, `#8A6A55` | Ilustraciones del mapa y recuerdos | — | Dejarlos como tokens de ilustración (`--map-*`), fuera de la paleta de interfaz. |
| `#C4302B` | `bg1` de e4 | `#C23A24` | Es solo color de placeholder; no confundir con el rojo de acción. |

#### Colores del código base que el prototipo no usa

Están en `preview-demo.html`. Sirven de referencia si se recuperan los estados hover (ver "Foco y estados globales").

| Valor | Uso en el código base | Estado en el prototipo |
|---|---|---|
| `#BF3923` (`--brand-hover`) | Hover de `.go` (botón Buscar) y `.ticket` (botón Boletas). | No existe. No sirve con `#C23A24` (ver `--brand-hover`). |
| `#33291F` | Hover de `.btn-dark` ("Crear evento"). | No existe. Recuperable para botones `#17120F`. |
| `#F3ECE6` | Hover de `.btn-light` (botón blanco del héroe). | No existe. Normalizar a `#F3ECE5`. |
| `#9A8E85` | `::placeholder` del buscador. | No existe. **No recuperar** (3,19:1). |
| `rgba(23,18,15,.04)` | Sombra del buscador `0 1px 2px`. | Se quitó. |
| `rgba(23,18,15,.10)` | Sombra de la tarjeta al pasar el mouse `0 12px 28px`. | Se quitó. |
| `#FFF` | Abreviatura de blanco. | El prototipo escribe `#FFFFFF`. |
| `rgba(255,255,255,.75)` y borde `rgba(255,255,255,.3)` | Texto y borde de `.photo-note` ("[Foto real de un evento en Bogotá]"). | El prototipo usa `.8` y `.35` (y el texto dice "en Colombia"). |
| `rgba(255,255,255,.92)` | Fondo del botón `.save` (36 px). | El prototipo usa `.94` y 44 px. |

---

### Degradados y fondos especiales

Todas las declaraciones se copian tal cual. El orden de las capas importa: la primera queda encima.

#### Fondos oscuros con manchas de luz ("ambiente de rumba")

**Héroe de Bienvenida** (`section aria-label="Bienvenida"`, `border-radius: 28px`, `min-height: 520px`):

```css
background: radial-gradient(circle at 74% 30%, rgba(214,140,70,.55) 0, transparent 22%),
            radial-gradient(circle at 92% 78%, rgba(190,70,80,.45) 0, transparent 26%),
            radial-gradient(circle at 60% 92%, rgba(230,170,80,.25) 0, transparent 18%),
            radial-gradient(ellipse at 8% 40%, rgba(70,30,80,.55) 0, transparent 45%),
            #140E10;
```

Es idéntico al `.hero` del código base.

**Bloque decorativo de Registro** (`aside`, `border-radius: 28px`, `min-height: 420px`):

```css
background: radial-gradient(circle at 74% 30%, rgba(214,140,70,.55) 0, transparent 26%),
            radial-gradient(circle at 80% 85%, rgba(190,70,80,.45) 0, transparent 30%),
            radial-gradient(ellipse at 8% 40%, rgba(70,30,80,.55) 0, transparent 45%),
            #140E10;
```

**Bloque "Todo el país en un mapa"** (Bienvenida, `border-radius: 28px`):

```css
background: radial-gradient(circle at 78% 18%, rgba(246,220,106,.16) 0, transparent 32%),
            radial-gradient(circle at 70% 88%, rgba(238,147,188,.18) 0, transparent 38%),
            radial-gradient(ellipse at 6% 30%, rgba(70,30,80,.5) 0, transparent 45%),
            #140E10;
```

**Sección del mapa** (Mapa, `section data-fe="dark"`, `border-radius: 28px`):

```css
background: radial-gradient(circle at 80% 16%, rgba(214,140,70,.32) 0, transparent 30%),
            radial-gradient(circle at 14% 90%, rgba(190,70,80,.3) 0, transparent 34%),
            radial-gradient(ellipse at 4% 8%, rgba(70,30,80,.6) 0, transparent 45%),
            radial-gradient(circle at 50% 55%, rgba(230,170,80,.1) 0, transparent 42%),
            #140E10;
```

**Héroe de Evento** (`min-height: 380px`, `border-radius: 28px`). Usa los colores del propio evento (e1: `#E8A04F` = `rgb(232,160,79)` y `#B5372B` = `rgb(181,55,43)`):

```css
background: radial-gradient(circle at 74% 30%, rgba(232,160,79,.65) 0, transparent 26%),
            radial-gradient(circle at 90% 80%, rgba(181,55,43,.6) 0, transparent 30%),
            radial-gradient(ellipse at 8% 40%, rgba(70,30,80,.55) 0, transparent 45%),
            #140E10;
```

**Cabecera de la boleta digital** (paso 4 del checkout):

```css
background: radial-gradient(circle at 85% 20%, rgba(232,160,79,.6) 0, transparent 40%),
            radial-gradient(ellipse at 0% 100%, rgba(70,30,80,.7) 0, transparent 55%),
            #140E10;
```

**Miniatura del evento en el checkout** (48 × 48 px, radio 12 px):

```css
background: radial-gradient(circle at 70% 30%, rgba(232,160,79,.9) 0, transparent 55%),
            radial-gradient(circle at 20% 80%, rgba(181,55,43,.8) 0, transparent 50%),
            #140E10;
```

**Regla inferida para producción** (solo existe un evento con página propia, así que esto es una deducción): el héroe, la boleta y la miniatura del checkout de cada evento se tiñen con su `bg1` (alfa .65 en el héroe, .6 en la boleta, .9 en la miniatura) y su `bg2` (alfa .6 en el héroe, .8 en la miniatura), siempre con la mancha violeta `rgba(70,30,80,…)` a la izquierda y la base `#140E10`. Cuando haya fotos reales, la foto reemplaza este fondo y hay que poner una capa oscura que garantice el contraste del texto blanco.

**Bloques oscuros planos:** "Únete" (Bienvenida) `background: #17120F`; "Tu semana" (Inicio) `#17120F`; aviso de repost (Agenda) `#17120F`.

#### Titular con resaltado durazno → rosado

Patrón de los titulares principales en mayúsculas (Bienvenida, Registro y Evento). El `h1` es `display: flex; flex-direction: column; align-items: flex-start` y **cada línea es un `<span>`** con su propio fondo, de modo que el resaltado abraza el texto de cada línea:

```css
/* línea 1 y 3 */ background: linear-gradient(90deg, #F3B27E, #EE93BC); padding: .1em .22em .06em;
/* línea 2      */ background: linear-gradient(90deg, #EE93BC, #F3B27E); padding: .1em .22em .06em;
```

- El texto es `#17120F` (10,16:1 sobre durazno y 8,44:1 sobre rosado), Archivo 900, mayúsculas, `letter-spacing: -0.035em`, `line-height: .98`.
- La dirección del degradado **se alterna** entre líneas.
- Las líneas van escalonadas a la derecha:
  - Bienvenida: línea 2 `margin-left: clamp(0em, 2vw, 1.15em)`; línea 3 `margin-left: clamp(0em, 1vw, .4em); max-width: 13ch` (por eso "al concierto del sábado" ocupa dos renglones dentro de un mismo bloque).
  - Registro: línea 2 `margin-left: .8em` (fijo).
  - Evento: línea 2 `margin-left: 1em` (fijo).
  - En el código base eran fijos (`1.15em` y `.4em`) y se anulaban por debajo de 820 px; el prototipo de Bienvenida los volvió fluidos con `clamp()`.
- Si una línea se parte en dos, el fondo cubre las dos como un solo rectángulo (es una caja de bloque, no `box-decoration-break`).
- Encima del titular va una **etiqueta amarilla** rectangular sin radio (ver Tipografía).

#### Placeholders de foto

Fórmula base (tarjetas de evento, Bienvenida, Agenda, Perfil):

```css
background: radial-gradient(circle at 70% 30%, var(--bg1) 0, transparent 55%), var(--bg2);
```

Variantes del prototipo:

| Dónde | Declaración |
|---|---|
| Tarjeta de Bienvenida y Agenda (4:3), Próximos planes de Perfil (4:3) | `radial-gradient(circle at 70% 30%, bg1 0, transparent 55%), bg2` |
| Evento adjunto a una publicación (Inicio, `min-height: 150px`), vista previa del repost (110 px de ancho), resultados del Mapa (88 × 88 px), planes parecidos de Evento (16:10), tarjeta de evento y plan fijado del Chat (104 px de alto / 64 × 64 px), miniaturas del panel del Chat (52 y 46 px), círculo de 30 px de la bandeja "Compartir" | `radial-gradient(circle at 70% 30%, bg1 0, transparent 58%), bg2` |
| Recuerdos de Perfil (1:1) | `radial-gradient(circle at 40% 35%, bg1 0, transparent 55%), bg2` |
| Fotos del chat (4:3) | `radial-gradient(circle at 28% 30%, bg1 0, transparent 50%), radial-gradient(circle at 76% 72%, bg3 0, transparent 42%), bg2` |
| Noticia destacada (16:9, Bienvenida) | `radial-gradient(circle at 30% 35%, rgba(246,220,106,.85) 0, transparent 30%), radial-gradient(circle at 75% 65%, rgba(217,69,47,.8) 0, transparent 40%), #2A1A16` |
| Portada de Perfil (200 px de alto) | `radial-gradient(circle at 20% 40%, rgba(238,147,188,.7) 0, transparent 30%), radial-gradient(circle at 80% 60%, rgba(246,220,106,.6) 0, transparent 28%), #2A1A16` |

Recuerdos de ediciones pasadas (Evento, 6 cuadros 1:1, radio 10 px):

1. `radial-gradient(circle at 30% 30%, #F6DC6A 0, transparent 50%), #B5372B`
2. `radial-gradient(circle at 70% 40%, #EE93BC 0, transparent 55%), #5A2340`
3. `radial-gradient(circle at 50% 70%, #F3B27E 0, transparent 50%), #2A1A16`
4. `radial-gradient(circle at 60% 30%, #A3A8F0 0, transparent 50%), #1E1630`
5. `radial-gradient(circle at 40% 60%, #F3B27E 0, transparent 55%), #8A2E1F`
6. `radial-gradient(circle at 70% 70%, #EE93BC 0, transparent 50%), #140E10`

Reglas: todos llevan `role="img"` y `aria-label` entre corchetes ("[Foto del evento]", "[Foto de portada]", "[Foto de asistente]", "[Imagen de la noticia]"). Proporciones que se deben conservar con fotos reales: 4:3 en tarjetas, 16:9 en la noticia, 16:10 en planes parecidos, 1:1 en recuerdos, 88 × 88 px en la lista del Mapa. La diferencia entre 55 % y 58 % del brillo no tiene función: en producción se puede usar un solo valor. **Auditoría H57:** cuando lleguen las fotos reales, servirlas en AVIF o WebP, con varios tamaños y **dimensiones fijas** (las proporciones de arriba, para no causar saltos de diseño) y con carga diferida, salvo la foto principal (héroe de Evento).

#### Otros fondos especiales

- **Anillo de historias** (Inicio): `background: linear-gradient(135deg, #F3B27E, #D9452F)` en un `span` de `width/height: 68px` con `padding: 3px` y sin `box-sizing`, así que el anillo mide **74 × 74 px** en pantalla; el avatar interior mide 68 px y tiene `border: 3px solid #FBF7F3`. Las historias de "Tu plan", Sebas, Majo y Dani llevan el anillo `#EAE1D8` liso (el prototipo no explica la diferencia; se interpreta como historia ya vista).
- **Trama de puntos del mapa grande:** capa `inset: -60% -45%` con `background-image: radial-gradient(rgba(255,255,255,.12) 1px, transparent 1.5px); background-size: 16px 16px` (se mueve con el zoom).
- **Trama del mini-mapa de Inicio:** `background-color: #140E10; background-image: radial-gradient(rgba(255,255,255,.08) 1px, transparent 1.5px); background-size: 14px 14px; border-radius: 16px; padding: 14px`.
- **Retícula del mini-mapa de Bienvenida** (dentro del SVG): `<path d="M0 43.75H130M0 87.5H130M0 131.25H130M32.5 0V175M65 0V175M97.5 0V175" stroke="#FFFFFF" stroke-opacity=".07" stroke-width=".4" stroke-dasharray="1 2">`.
- **Contorno de Colombia:** el mismo `path` de unos 80 vértices (empieza en `M21.4 43.2`) en `viewBox="0 0 130 175"`:
  - Bienvenida: `fill="#2B2124" stroke="#F3B27E" stroke-opacity=".6" stroke-width=".6" stroke-linejoin="round"`.
  - Inicio: `fill="#2E2220" stroke="#8A6A55" stroke-width="1.2" stroke-linejoin="round" vector-effect="non-scaling-stroke"`.
  - Mapa: `fill="#2E2220" stroke="#8A6A55" stroke-width="1.4"`, igual, y el SVG lleva `filter: drop-shadow(0 0 22px rgba(243,178,126,.18))`.
- **Cordilleras** (solo Mapa): dos `path` con `stroke="#8FD3D0"`, `stroke-opacity` `.32` (1,2 px) y `.26` (1 px), `stroke-linecap/linejoin: round`, `vector-effect: non-scaling-stroke`.
- **Mapa de ubicación** (Evento, 170 px de alto): `linear-gradient(90deg, transparent 47%, #FFFFFF 47%, #FFFFFF 53%, transparent 53%), linear-gradient(0deg, transparent 58%, #FFFFFF 58%, #FFFFFF 63%, transparent 63%), #EDE5DC` con un pin relleno `#C23A24` de 34 px (círculo interior blanco).
- **Pista** (plano de Evento): `border: 2px dashed #EE93BC; background: repeating-linear-gradient(135deg, #FCE9F2 0 10px, #F8DCEA 10px 20px)`.
- **Escenario** (plano de Evento): `background: #17120F; border-radius: 10px 10px 36px 36px; height: 48px`.
- **QR decorativo** (boleta): rejilla de 17 × 17 celdas en una caja de 124 × 124 px (`padding: 7px`, borde 1 px `#EAE1D8`, radio 10 px); celda llena `#17120F`, vacía `transparent`.

---

### Tipografía

#### Familias y carga

URL exacta, igual en las 8 pantallas y en el código base:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@800;900&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&display=swap" rel="stylesheet">
```

(En el HTML del prototipo el `&` va escapado como `&amp;`.)

| Familia | Pesos cargados | Rol | Pila del prototipo | Pila del código base (recomendada) |
|---|---|---|---|---|
| **Archivo** | 800, 900 | Titulares de impacto, números grandes (placas de fecha, estadísticas, pines, pasos de "Cómo funciona"), iniciales de parches y organizadores, etiquetas amarillas (800), títulos de evento en tarjetas de publicación y chat (800). | `'Archivo', sans-serif` | `'Archivo', 'Arial Black', 'Helvetica Neue', sans-serif` (`--display`) |
| **DM Sans** | 400, 500, 700, con eje óptico `opsz` 9..40 | Todo lo demás: interfaz, cuerpo, botones, etiquetas, **logo** "fulleventos" (700). | `'DM Sans', system-ui, sans-serif` | `'DM Sans', system-ui, -apple-system, 'Segoe UI', sans-serif` (`--ui`) |

Detalles de carga:

1. **`display=swap`**: el texto se muestra primero con la fuente de respaldo y cambia cuando llega la web font.
2. **Eje óptico.** DM Sans se pide con el rango `opsz` 9..40, así que el navegador ajusta el diseño del glifo al tamaño (`font-optical-sizing: auto` por defecto). No hay que hacer nada más, pero si se aloja la fuente en el propio servidor hay que conservar la versión variable con ese eje.
3. **Verificado en Chromium (`document.fonts`):** se cargan Archivo 800 y 900 y DM Sans 400, 500 y 700, solo cuando la pantalla los usa. Registro no usa DM Sans 500; Agenda y Perfil no usan Archivo 800. (Chat **sí** usa Archivo 800: títulos de evento de la tarjeta compartida y del plan fijado.)
4. **El código base además tenía** `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`, que el prototipo perdió. Recuperarlo.
5. **Producción (Auditoría H57):** fuentes alojadas en el propio servidor y precargadas (`<link rel="preload" as="font" type="font/woff2" crossorigin>`). Hoy las fuentes de Google suman unos 98 KB (dato de la auditoría). **Propuesta** (no está en la auditoría): un subconjunto latino que incluya `¿ ¡ « » · × — ñ` y vocales tildadas.
6. **No hay Archivo 700.** Cuando un `<b>` en Archivo no declara peso (números de "Tu semana" en Inicio), el navegador pide 700 y usa la cara más cercana disponible, **800**. Declarar el peso explícito (800 o 900) en producción.
7. **Tamaño base del contenedor.** Bienvenida y Registro declaran `font-size: 16px` en el contenedor raíz; Inicio, Agenda, Mapa, Evento, Chat y Perfil declaran **`15px`**. Los tamaños en `rem` no cambian (dependen de la raíz de 16 px); solo cambia el texto que **hereda** (párrafos y elementos sin tamaño propio): 16 px en las pantallas públicas y 15 px en las de sesión. `line-height: 1.5` en todas.

#### Escala tipográfica completa (valores reales del prototipo)

Abreviaturas: **A** = Archivo, **D** = DM Sans, **MAY** = `text-transform: uppercase`.

**Display y titulares**

| Rol | Familia y peso | Tamaño | px a 390 / 768 / 1280 | `line-height` | `letter-spacing` | Transformación | Dónde |
|---|---|---|---|---|---|---|---|
| Display del héroe | A 900 | `clamp(2.3rem, 5.8vw, 4.9rem)` | 36,8 / ≈44,5 / ≈74,2 | `.98` | `-0.035em` | MAY | h1 "De la rumba / del viernes / al concierto del sábado" (Bienvenida) |
| Display de evento | A 900 | `clamp(2.2rem, 5vw, 4.2rem)` | 35,2 / 38,4 / 64 | `.98` | `-0.035em` | MAY | h1 "Noche de salsa / y boleros en vivo" (Evento) |
| Display de formulario | A 900 | `clamp(2rem, 4vw, 3.2rem)` | 32 / 32 / 51,2 | `.98` | `-0.035em` | MAY | h1 "Tu próximo / plan empieza / aquí" (Registro) |
| Título de página (h1) | A 900 | `clamp(1.9rem, 3.6vw, 2.8rem)` | 30,4 / 30,4 / 44,8 | `1.02` | `-0.03em` | — | "Este finde en {ciudad}" (Agenda), "Todo lo que pasa en Colombia este finde" (Mapa, `max-width: 21ch`) |
| Titular de bloque oscuro (h2) | A 900 | `clamp(1.8rem, 3.6vw, 2.8rem)` | 28,8 / 28,8 / 44,8 | `1.02` | `-0.03em` | MAY | "Todo el país en un mapa", "Ve a qué van tus amigos y súmate al parche" (Bienvenida) |
| Titular de sección (h2) | A 900 | `clamp(1.7rem, 3.2vw, 2.4rem)` | 27,2 / 27,2 / 38,4 | `1.05` | `-0.03em` | — | "Planes mejores, con tu gente", "Noticias de la escena", "Este finde en Colombia" (Bienvenida) |
| Titular de sección compacto (h2) | A 900 | `1.5rem` (24) | 24 | `1.05` | `-0.03em` | MAY | Secciones de Evento ("Sobre el evento", "Programación", "Localidades", "Parches para este evento", "Lo que debes saber", "Ubicación y organizador", "Planes parecidos en otras ciudades"), "3 planes confirmados" (Inicio) |
| Subtítulo de sección (h2) | A 900 | `clamp(1.4rem, 2.4vw, 1.75rem)` | 22,4 / 22,4 / 28 | `1.1` | `-0.02em` | — | "Ciudades con más planes" (Mapa) |
| Título de formulario (h2) | A 900 | `1.9rem` (30,4) | — | `1.05` | `-0.03em` | — | "Crea tu cuenta", "¿Qué planes te gustan?", "Encuentra a tu gente" (Registro) |
| Nombre de perfil (h1) | A 900 | `2rem` (32) | — | `1.05` | `-0.03em` | — | "Camila Vargas" |
| Título de pantalla del chat (h1) | A 900 | `1.75rem` (28) | — | `1` | `-0.03em` | — | "Mensajes" |
| Título del panel del mapa (h2) | A 900 | `1.55rem` (24,8) | — | `1.1` | `-0.02em` | — | "Toda Colombia" / nombre de ciudad (+ "· 19 planes" en D 700 1rem `#6E6259`, `letter-spacing: 0`) |
| Confirmación de compra (h3) | A 900 | `1.55rem` | — | `1.05` | `-0.03em` | MAY | "¡Listo, Camila! Nos vemos en la pista" |
| Precio destacado | A 900 | `1.7rem` (27,2) | — | heredado | `-0.02em` | — | "Desde $45.000" (tarjeta de compra) |
| Título de ventana (h2) | A 900 | `1.4rem` (22,4) | — | heredado | `-0.02em` | — | "Nuevo parche" / "Nuevo chat" |
| Título del checkout (h2) | A 900 | `1.2rem` (19,2) | — | heredado | `-0.02em` | MAY | "Compra tus boletas" |
| Título de noticia destacada (h3) | A 800 | `1.35rem` (21,6) | — | `1.12` | `-0.02em` | — | Bienvenida |
| Título de la boleta | A 900 | `1.35rem` | — | `1.02` | `-0.03em` | MAY | "Noche de salsa y boleros en vivo" |
| Título de evento adjunto | A 800 | `1.15rem` (18,4) | — | `1.15` | `-0.02em` | — | Publicación de Inicio |
| Título de evento en el chat | A 800 | `1.05rem` (plan fijado) / `1.02rem` (tarjeta) | — | `1.2` | `-0.01em` | — | Chat |
| Logo "fulleventos" | **D 700** | `1.6rem` (25,6) en Bienvenida y Registro; `1.55rem` (24,8) en las demás | — | `1.5` (heredado) | `-0.03em` | minúsculas | Encabezados |

**Números y cifras en Archivo**

| Rol | Peso | Tamaño | Dónde |
|---|---|---|---|
| Iniciales del avatar grande de Perfil | 900 | `2.4rem` (38,4) | "CV" (círculo de 128 px) |
| Estadísticas de Perfil (`dd`) | 900 | `1.6rem` (25,6) | 38, 5, 412, 289, 7 |
| Número de paso ("Cómo funciona") | 900 | `1.3rem` (20,8) | 1, 2, 3 |
| Número de la placa de fecha | 900 | `1.25rem` (Bienvenida, Agenda) · `1.3rem` (datos clave de Evento) · `1.2rem` (Inicio, Perfil, planes parecidos) · `1.15rem` (tarjeta del chat) · `1.05rem` (plan fijado) · `1rem` (Mapa) | 9, 10, 11, 12 |
| Día en "Tu semana" | **sin peso → 800** | `1.2rem` | Inicio |
| Pines del Mapa | 900 | `clamp(13px, fs/5.6 cqw, fs px)`, con `fs = round(tamaño × .36)` y `tamaño = min(70, 40 + 5 × (n − 1))` px → 1 plan: 14 px; 2: 16 px; 3: 18 px; 6: 23 px | Mapa |
| Pines del mini-mapa | 900 | Bienvenida: `clamp(.64rem, 2.9cqw, .78rem)`; Inicio: 11 px (≥ 5 planes), 10 px (≥ 3), 9 px (resto) | Bienvenida, Inicio |
| Iniciales de parches y organizadores | 900 | `.8rem` (avatares de 36 px de "Tus parches", Inicio); `.9rem` (parche de 44 px en el paso 1 del checkout); `.86rem` en la lista del chat; `.82rem` en la barra; `1.25rem` en el panel (72 px). **En la página de Evento**, los avatares de parche (52 px) y del organizador "GC" (48 px) **no declaran tamaño** y heredan los 15 px del contenedor raíz. | Inicio, Evento, Chat |
| "Escenario" (plano) | 900 | `.9rem`, `letter-spacing: .14em`, MAY | Evento |
| "Pista" (plano) | 900 | `.95rem`, `letter-spacing: .04em`, MAY | Evento |

**Etiquetas amarillas rectangulares** (A 800, MAY, fondo `#F6DC6A`, texto `#17120F`, sin radio)

| Texto | Tamaño | `padding` | Dónde |
|---|---|---|---|
| "Arma tu parche" | `1.05rem` | `5px 12px` (+ `margin-left: clamp(0px, 3vw, 44px)`) | Héroe de Bienvenida |
| "Rumba · Vie 9 oct" | `.95rem` | `4px 11px` | Héroe de Evento |
| "Paso {n} de 3" | `.9rem` | `4px 10px` | Registro |
| "Nuevo · Mapa de eventos", "Tu gente ya está aquí" | `.85rem` | `4px 10px` (+ `margin-bottom: 14px`) | Bienvenida |
| "Tu semana" | `.8rem` | `3px 9px` | Inicio |
| "Rumba · Vie 9 oct" (boleta) | `.78rem` | `3px 9px` | Evento, paso 4 |
| "Nuevo · Todo el país" | `.72rem`, `letter-spacing: .04em` | `3px 8px` | Mapa |

El código base tenía `letter-spacing: .01em` en la etiqueta del héroe; el prototipo no.

**Interfaz y cuerpo (DM Sans)**

| Rol | Tamaño | Peso | Otros | Dónde (ejemplos) |
|---|---|---|---|---|
| Bajada del héroe | `1.1rem` (17,6) | 400 | `max-width: 48ch`, `rgba(255,255,255,.9)` | Bienvenida |
| Título de tarjeta de evento | `1.05rem` (16,8) | 700 | `line-height: 1.25` | Bienvenida, Agenda, Perfil |
| Título de tarjeta compacta | `.98rem` (15,68) | 700 | `line-height: 1.25` | Lista del Mapa, planes parecidos (Evento) |
| Título de paso de "Cómo funciona" (h3), título de ventana de repost (h2), nombre en el panel del chat (h2) | `1.15rem` (18,4) | 700 (por defecto del encabezado) | — | Bienvenida, Agenda, Chat |
| Nombre en la barra del chat (h2) | `1.05rem` | 700 | `ellipsis` | Chat |
| Cuerpo largo | `1rem` (16) | 400 | `max-width: 66ch` | "Sobre el evento" |
| Cuerpo heredado | 16 px (Bienvenida, Registro) / 15 px (resto) | 400 | `line-height: 1.5` | Párrafos sin tamaño propio |
| Texto de publicación | `.97rem` (15,52) | 400 | — | Inicio |
| Bajada de la noticia destacada | `.93rem` (14,88) | 400 | `#6E6259` | "Tres escenarios, más de 40 artistas y entrada por días. La preventa abre este jueves." (Bienvenida); valor único, normalizar a `.94rem` o `.92rem` |
| Burbuja del chat | `.94rem` (15,04) | 400 | `line-height: 1.42`, `overflow-wrap: anywhere` | Chat |
| Campos de texto | `1rem` (Registro, checkout) / `.95rem` (buscadores, compositores, textarea, ventana del chat) / `.9rem` (búsqueda de chats, select del evento) | 400 | — | Ver "Detalles finos" (zoom de iOS) |
| Etiqueta de campo (`label`) | `.9rem` (Registro) / `.86rem` (datos del checkout) / `.84rem` (pago) / `.88rem` (ventana del chat) | 700 | — | Formularios |
| Navegación de texto | `.92rem` | 500 | — | Bienvenida |
| Chip de filtro | `.9rem` | 500 | — | Bienvenida, Agenda, Mapa; `.88rem` en Inicio; `.95rem` en gustos de Registro |
| Botón primario grande | `1rem` | 700 | — | "Continuar" (Registro), "Comprar boletas", botón del pie del checkout |
| Botón estándar | `.9rem`–`.95rem` | 700 | — | "Crear evento", "Voy", "Ver todos los planes del país" |
| Botón pequeño | `.82rem`–`.86rem` | 700 | — | "Comprar" de tarjeta (`.82rem`), "Repostear" (`.84rem`), segmentos de fecha (`.86rem`) |
| Botón mínimo | `.78rem`–`.8rem` | 700 | — | "Repostear" del Mapa (`.78rem`), "Comprar" del Mapa (`.8rem`), "Seguir" de Inicio (`.8rem`), filtros del chat (`.8rem`) |
| Precio de tarjeta | `.95rem` | 700 | Nombre de la boletera debajo: `.72rem` 400 `#6E6259` | Bienvenida, Agenda. En el Mapa: precio `.88rem` (`line-height: 1.2`) y boletera `.7rem`. En planes parecidos (Evento): precio `.86rem`, sin boletera |
| Meta (lugar · ciudad) | `.85rem` | 400 `#6E6259`, ciudad en 700 `#17120F` | — | Tarjetas |
| Meta pequeña | `.8rem` / `.78rem` | 400 `#6E6259` | — | Horas, "Hace 3 horas", subtítulos de listas |
| Línea social | `.78rem` | 400 `#6E6259` | — | "186 van · 3 parches abiertos", "Laura y 13 más lo repostearon" |
| Texto legal y pie | `.85rem` (pie) / `.78rem` (Registro, checkout) / `.76rem` (Inicio) | 400 `#6E6259` | — | — |

**Antetítulos y etiquetas pequeñas (MAY)**

| Rol | Tamaño | Peso | `letter-spacing` | Color | Dónde |
|---|---|---|---|---|---|
| Antetítulo de sección | `.74rem` (11,84) | 700 | `.12em` | `#C23A24` | "CÓMO FUNCIONA", "LO QUE SE MUEVE", "AGENDA", "AGENDA PARA TI", "MAPA DE EVENTOS" (`margin: 0 0 6px`; en Mapa `0 0 8px`) |
| Antetítulo de panel | `.72rem` | 700 | `.12em` | `#C23A24` | "TODO EL PAÍS" / "CIUDAD ELEGIDA" (Mapa) |
| Antetítulo de panel lateral | `.7rem` | 700 | `.12em` | `#C23A24` / `#6E6259` | "EVENTO DEL PARCHE" (rojo), "INFO DEL GRUPO" (gris) (Chat) |
| "TUS PARCHES" (h2) | `.78rem` | 700 (por defecto) | `.12em` | `#C23A24` | Inicio |
| Categoría de tarjeta (kicker) | `.7rem` (11,2) | 700 | `.1em` | `#C23A24` | "RUMBA", "CARTEL CONFIRMADO · BOGOTÁ"; `.68rem` en el Mapa, la ventana de repost y el plan fijado; `.66rem` en la tarjeta del chat |
| Etiqueta de dato | `.7rem` | 700 | `.1em` | `#6E6259` | "FECHA", "HORA", "LUGAR", "EDAD", "PRECIO" (Evento); `.72rem` en la tarjeta de compra ("BOLETAS", "LOCALIDAD", "CANTIDAD"); `.68rem` en la boleta |
| Encabezado de ciudad (h3) | `.74rem` | 700 | `.1em` | `#17120F`, conteo en 500 `#6E6259` `.04em` | Lista del Mapa |
| "ORGANIZA" | `.72rem` | 700 | `.08em` | `#6E6259` | Evento |
| Separador de fecha del chat | `.7rem` | 700 | `.1em` | `#6E6259` | "AYER", "HOY", "DOM 4 OCT" |
| "oct" de la placa de fecha | `.66rem` (Bienvenida, Agenda) · `.64rem` (Inicio, Perfil, planes parecidos) · `.62rem` (datos clave de Evento, tarjeta del chat) · `.6rem` (plan fijado) · `.58rem` (Mapa) | 700 | `.06em` | `#6E6259` | Se escribe en minúscula ("oct") y se muestra en mayúscula por CSS |
| Etiqueta "PLATO FUERTE" | `.7rem` | 700 | `.04em` | blanco sobre `#17120F` | Programación |
| Etiquetas del mapa | Mar: `.72rem` / `.22em`; países: `.66rem` / `.14em` | 700 | — | `#7FA3A6` / `#9C8B80` | Mapa (por debajo de 420 px de mapa: mar `.6rem` / `.12em`, países ocultos) |

**Insignias y contadores**

| Rol | Tamaño | Peso | Otros |
|---|---|---|---|
| Insignia de no leídos en ícono | `.66rem` | 700 | 18 × 18 px mínimo, radio 9 px, `padding: 0 4px`, `line-height: 1` |
| Insignia de no leídos en lista | `.72rem` (menú de Inicio) / `.7rem` (lista del chat) | 700 | 22 px / 20 px de alto |
| "Nuevo" (píldora amarilla) | `.68rem` (nav de Bienvenida, `padding: 1px 7px`, `line-height: 1.4`) · `.7rem` (menú de Inicio, `1px 8px`) · `.72rem` (tarjeta del mini-mapa, `2px 9px`) | 700 | — |
| Contador de chip de ciudad | `.78rem` | 700 | 28 × 28 px mínimo; ranking del Mapa: `.8rem`, 30 px |
| Estado sobre foto ("Va", "Le interesa", "En parche"), "Reposteaste", "En venta" | `.74rem` | 700 | `padding: 4px 10px`, radio 999 px |
| "Últimas 12" | `.72rem` | 700 | `padding: 2px 10px` |
| Píldoras del chat (evento, organizador) | `.72rem` | 700 | `padding: 2px 9px` |

**Pesos usados**

- **900:** solo Archivo (titulares, cifras, iniciales de parches).
- **800:** solo Archivo (etiquetas amarillas, títulos de evento en publicaciones y chat, noticia destacada).
- **700:** DM Sans (botones, títulos de tarjeta, etiquetas, enlaces, logo, encabezados `h2`–`h4` sin peso explícito, `<b>`).
- **500:** DM Sans (chips de filtro, navegación de texto, select de ciudad, opciones de encuesta, acciones del compositor).
- **400:** DM Sans (cuerpo, campos, nombre de la boletera bajo el precio).

**`line-height`** usados: `.98` (display), `1` (h1 del chat, placas, insignias, pines), `1.02` (h1 de página, titulares oscuros, boleta), `1.05` (h2), `1.1` (títulos del Mapa), `1.12` (noticia), `1.15` (evento adjunto), `1.2`, `1.25` (títulos de tarjeta y listas), `1.3` (meta y bloques de dos líneas), `1.35`, `1.4` (políticas, muro, insignia "Nuevo"), `1.42` (burbuja), `1.45` (aviso de pago dividido) y `1.5` (base).

**`letter-spacing`** usados: `-0.035em` (display), `-0.03em` (h1/h2 en Archivo 900 y logo), `-0.02em` (títulos en Archivo 800 y títulos de ventana), `-0.01em` (títulos de evento del chat), `0` (resets en el Mapa), `.04em`, `.06em` (fechas), `.08em`, `.1em` (categorías y etiquetas de datos), `.12em` (antetítulos), `.14em` (escenario, países) y `.22em` (mares).

**`text-transform: uppercase`**: display de los tres héroes, titulares de bloques oscuros, todos los h2 de Evento, "3 planes confirmados", etiquetas amarillas, antetítulos y categorías, "oct", separadores de fecha del chat, etiquetas del mapa, "Escenario", "Pista", "Compra tus boletas", boleta. **Nunca** se escribe el texto en mayúsculas en el código: siempre en caja normal y se transforma con CSS (el lector de pantalla lee la palabra normal).

**`text-wrap: balance` y `tabular-nums`: no están en el prototipo.** El código base sí los tenía:

- `text-wrap: balance` en `h2`, `.feature h3`, `.news-item h4` y `.card h3`.
- `font-variant-numeric: tabular-nums` en `.price`.

**Propuesta:** recuperarlos en producción. `balance` en todos los titulares (h1–h4) y títulos de tarjeta. `tabular-nums` en precios, totales del checkout, contadores, temporizador "9:58", nivel de zoom y estadísticas, para que las cifras no bailen al cambiar.

**Recortes de texto:** `white-space: nowrap; overflow: hidden; text-overflow: ellipsis` en el nombre y la vista previa de cada chat, el nombre de la barra del chat, el subtítulo de la barra de compra móvil y las etiquetas de los pasos del checkout. `overflow-wrap: anywhere` en las burbujas del chat.

---

### Espaciado

#### Contenedor y márgenes laterales

- **Ancho máximo:** `max-width: 1240px; margin: 0 auto` en encabezado, `main` y pie de las 8 pantallas (igual que `.wrap` del código base).
- **Margen lateral (gutter):**
  - `24px` fijos: Bienvenida, Registro, Inicio, Agenda, Chat (desde 900 px) y Perfil.
  - `clamp(16px, 4vw, 24px)`: Mapa y Evento (encabezado, `main`, pie y barra de compra). Da 16 px hasta 400 px de ancho, crece con la pantalla y llega a 24 px desde 600 px.
  - `16px`: Chat por debajo de 900 px (`padding: 12px 16px 16px`).
  - Código base: 24 px, y 16 px por debajo de 520 px.
- **Auditoría H41** pide un margen lateral único. **Propuesta:** `padding-inline: clamp(16px, 4vw, 24px)` en todo el producto (ya está en las dos pantallas más recientes y respeta los 16 px en celular).

#### Separación vertical entre secciones

| Pantalla | Separación |
|---|---|
| Bienvenida | `main` con `padding: 8px 24px 0`. Cada sección: `padding-top: 72px`. Bloque "Únete": `margin-top: 80px`. Pie: `margin-top: 72px`. (Código base: `padding-block: 64px 8px`.) |
| Registro | `main`: `padding: 8px 24px 64px`, `gap: 24px` entre las dos columnas. Dentro del formulario: `gap: 22px`; dentro de cada paso: `gap: 18px` (paso 3: `14px`). |
| Inicio | `main`: `padding: 24px 24px 64px`, `gap: 24px` entre columnas. Feed: `gap: 18px`. Columnas laterales: `gap: 16px`. |
| Agenda | `main`: `padding: 28px 24px 64px`, `gap: 22px`. |
| Mapa | `main`: `padding: 28px clamp(16px, 4vw, 24px) 48px`, `gap: 22px`. "Ciudades con más planes": `padding-top: 14px`. |
| Evento | `main`: `padding: 24px clamp(…) 64px`, `gap: 24px`. Columna principal: `gap: 36px` entre secciones. Bloque final ("Planes parecidos"): `margin-top: 16px; padding-top: 32px; border-top: 1px solid #EAE1D8`. |
| Chat | `main`: `padding: 16px 24px` (desde 900 px). |
| Perfil | `main`: `padding: 24px 24px 64px`, `gap: 24px`. |
| Pies de página | `padding: 28px 24px 40px` (Mapa: `24px … 36px`), `gap: 12px 28px` (Mapa: `10px 28px`). |

Patrón de encabezado de sección (`.sec-head` del código base): `display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 16px; margin-bottom: 24px` (20 px en la agenda de Bienvenida).

#### Escala de `gap` y `padding` usada

| Valor | Frecuencia aproximada | Rol típico |
|---|---|---|
| `2px` | 12 | Grupos de botones de ícono pegados (zoom, compositor), filas de la lista del chat, título y meta en tarjetas compactas |
| `4px` | 20 | Íconos de navegación en fila, ítems de un grupo segmentado, "−/+" de cantidad, celdas de datos clave |
| `5px`–`7px` | 9 | Chat (píldoras, reacciones), "Toda Colombia" (`7px`) |
| `6px` | 70 | Ícono + texto en botones pequeños, etiqueta + campo (`label`), avatares apilados |
| `8px` | 83 | Ícono + texto en botones, filas de chips, botones vecinos |
| `10px` | 71 | Ícono + texto en botones medianos, grupos de tarjetas internas, avatar + texto |
| `12px` | 68 | Avatar + texto en filas, campos del formulario, lista de beneficios |
| `14px` | 21 | Bloques internos de paneles, resultados del Mapa |
| `16px` | 15 | Encabezados de sección, paneles laterales, ventanas modales |
| `18px` | 5 | Feed de Inicio, columnas de localidades |
| `20px` | 3 | Tarjetas de "Cómo funciona", rejilla de Perfil |
| `22px` | 6 | Rejillas de tarjetas de evento, `main` de Agenda y Mapa |
| `24px` | 7 | Columnas principales, noticias |
| `28px` | 3 | Columnas de Evento, bloque "Únete" |
| `36px` | 1 | Secciones de la columna principal de Evento |
| Compuestos | — | `12px 20px` y `12px 24px` (encabezados), `8px 20px`, `16px 22px` (CTA del héroe), `36px 48px` (bloque del mapa), `14px 20px`, `12px 28px` (pies), `8px 16px`, `10px 16px` |

**Paddings internos frecuentes**

| Componente | `padding` |
|---|---|
| Cuerpo de tarjeta de evento | `14px 16px 16px` (igual que el código base); tarjeta compacta: `12px 14px 14px` |
| Panel o tarjeta blanca | `18px` (Inicio), `18px 20px` (Evento, Perfil), `16px` (políticas), `20px` (tarjeta de compra, "Tu semana") |
| Ventana modal | `22px` (Agenda, Chat) |
| Encabezado | `14px 24px` (Bienvenida), `12px 24px` (sesión) |
| Héroe | `56px clamp(22px, 5vw, 64px) 52px` (Bienvenida); `clamp(28px, 5vw, 48px) clamp(20px, 5vw, 56px)` (Evento); `clamp(28px, 4vw, 48px)` (Registro) |
| Bloques oscuros de Bienvenida | `clamp(28px, 5vw, 56px)` |
| Formulario de Registro | `clamp(24px, 4vw, 48px)` |
| Chips | `0 16px` (filtro), `0 7px 0 15px` (con contador), `0 7px 0 16px` (ranking "Ciudades con más planes" del Mapa, 44 px), `0 14px` (acciones), `0 18px` (gustos de Registro, 46 px), `6px 14px` (gustos de Perfil) |
| Botones píldora | `0 14px` a `0 28px`; héroe `15px 26px`; "Crear cuenta" `11px 18px` |
| Placa de fecha | `5px 9px 4px` (Mapa `4px 6px 3px`, plan fijado `4px 7px 3px`) |
| Estado vacío | `40px 16px` (Bienvenida, Agenda), `36px 16px` (Inicio), `36px 6px` (Mapa), `32px 12px` (Chat) |

**Propuesta de tokens de espacio** (sin redondear: los valores intermedios 6, 10, 14, 18 y 22 son parte del ritmo del diseño): `--space-2: 2px`, `-4`, `-6`, `-8`, `-10`, `-12`, `-14`, `-16`, `-18`, `-20`, `-22`, `-24`, `-28`, `-32`, `-36`, `-40`, `-48`, `-56`, `-64`, `-72`, `-80`.

#### Alturas de control y objetivos táctiles

| Alto | Dónde |
|---|---|
| 54 px | "Comprar boletas" (tarjeta de compra) |
| 52 px | Botones principales de Registro, "Continuar con Google" / "Continuar con mi celular" (Bienvenida), botón del pie del checkout y "Atrás", "Avisar a mi parche", alto mínimo de las opciones del repost y del selector de amigos |
| 48 px | Campos del checkout (datos) y de Registro (en Registro se declaran `height: 48px` **sin** `box-sizing: border-box`, así que miden **50 px** en pantalla con el borde), "Voy" / "Me interesa" / "Invitar amigos", pestañas, "Ver N planes más", "Atrás" de Registro, "Comprar" de la barra móvil, botones del paso 4 |
| 46 px | Campos de pago y de la ventana del chat, botones "Cancelar" / "Repostear" / "Crear parche", chips de gustos, "Escribir al organizador" |
| 44 px | Íconos del encabezado, buscador, botón de guardar sobre la foto, alto mínimo del CTA de tarjeta en Bienvenida, campos de compositor, botones de estados vacíos, ranking de ciudades, botones del perfil, "Cerrar la compra" |
| 42 px | Chips de filtro (Bienvenida, Agenda, Mapa), "Ver en el mapa", buscador de chats, "Unirme" (Evento), botones de ubicación |
| 40 px | Avatar del encabezado, alto mínimo del CTA "Comprar" / "Ver plan" de las tarjetas de Agenda (`min-height: 40px`), "Repostear" y "Enviar a un amigo" (Agenda), botones "Cerrar" de ventanas, "−/+", atajos de sección de Evento, "Toda Colombia" / "Mi ciudad", zoom, botones del chat |
| 38 px | Pestañas del feed, segmentos "Hoy / Este finde / Próxima semana", "Lista / Mapa", "Voy" y "Unirme al parche" (Inicio), "Seguir" del organizador |
| 36 px | Acciones del compositor de Inicio, "Seguir" de Inicio, botones del Mapa en la lista, filtros del chat, reacciones, "Más opciones", cerrar aviso |

La auditoría reporta objetivos de 40 a 54 px como fortaleza. Los de 36 px pasan WCAG 2.5.8 (mínimo 24 px), pero en celular conviene llevarlos a 40 px o más.

#### Medidas de texto y anchos de componentes

- **Medidas de lectura:** `66ch` (Sobre el evento), `62ch` (intro de Agenda y Mapa), `56ch` (bio de Perfil), `48ch` (bajadas de Bienvenida), `46ch` (bloque del mapa, estado vacío de Inicio), `34ch` (estado vacío del chat), `21ch` (h1 del Mapa), `13ch` (tercera línea del héroe).
- **Anchos:** buscador `max-width: 520px` (Bienvenida) / `500px` (sesión), select de ciudad `max-width: 8.6em`, columnas de Inicio `max-width: 260px` y `340px`, tarjeta de compra `max-width: 380px`, mapa `width: min(100%, 560px)`, mini-mapa de Bienvenida `max-width: 400px`, botones del bloque "Únete" `max-width: 360px`, reseñas `max-width: 760px`, ventanas `max-width: 520px` (Agenda) y `540px` (Chat), checkout `width: min(520px, calc(100% - 24px))`, lista del chat `330px` (300 px entre 900 y 1179 px), panel de información `296px` (`min(320px, 100%)` como cajón), burbuja `max-width: min(78%, 440px)`, tarjeta de evento en el chat `290px`, encuesta `300px`, foto `260px`.

---

### Bordes y radios

#### Escala de radios

| Radio | Uso |
|---|---|
| `999px` | Todo lo que es píldora: botones, chips, buscador, segmentos, insignias, campos de compositor, pistas de los interruptores. Es el radio más usado (151 veces). |
| `50%` | Avatares de personas, botones de ícono redondos (guardar, cerrar, "−/+", zoom), pines, radios personalizados, puntos de leyenda. |
| `28px` | Bloques grandes: héroes (Bienvenida, Evento), bloque del mapa y "Únete" (Bienvenida), columnas de Registro, tarjeta de Perfil, sección del mapa (Mapa). |
| `24px` | Paneles y ventanas: panel lateral del Mapa, ventana de repost, ventana del chat, diálogo del checkout, tarjeta de compra, datos clave del evento, contenedor del chat (escritorio). |
| `22px` | Programación, plano de localidades y boleta digital (Evento). |
| `20px` | Tarjetas de contenido: "Cómo funciona", noticia destacada, tarjetas y publicaciones de Inicio, ubicación y organizador, parche en el checkout, marco interior del mapa, contenedor del chat en celular. |
| `18px` | Tarjetas de evento (Bienvenida, Agenda, Perfil, planes parecidos), estados vacíos, parches y políticas (Evento), reseñas, localidades de la lista, segmento "¿Para quién?", plan fijado y tarjetas del chat, recuadros de pago. |
| `16px` | Evento adjunto a una publicación, franja de ciudad (Inicio), aviso de repost, vista previa del repost, recuerdos de Perfil, mini-mapa de Inicio, conversaciones de la lista del chat, localidades del paso 1, medios de pago, aviso "Tienes N boletas", confirmación de salida del parche, muro (`4px 16px 16px 16px`). |
| `14px` | Cajas de número de "Cómo funciona" (48 px), avatares de parches (52 px) y de grupos/organizadores en el chat (48 y 44 px), zonas del plano, opciones del repost, localidades de la tarjeta de compra (`min-height: 56px`), contenedor del segmento "Tipo de persona" (PSE), miniaturas del Mapa (88 px) y del plan fijado (64 px), selector de amigos, campos de la ventana del chat, textarea del repost, "Buscar amigos en mis contactos". |
| `12px` | Campos de texto (Registro, checkout), íconos del encabezado (cuadrados de 44 px), menú lateral de Inicio, cajas de ícono de 36 px (Bienvenida) y de 46 px (datos clave), políticas (40 px), aviso de reserva, opciones de encuesta, miniatura del checkout. |
| `10px` | Placas de fecha, avatares de parches de 36 px (Inicio), botones del segmento PSE ("Natural" / "Jurídica"), recuerdos de Evento, QR, fila "Tú pagas 1 de N", insignia de no leídos de la lista del chat (20 px de alto). |
| `9px` | Insignias de no leídos (18 px de alto), placa del plan fijado. |
| `8px` | Placa de fecha del Mapa. |
| `6px` | Casilla de términos (22 px), casillas del selector de amigos en modo grupo. |
| `5px` | Muestra de color de localidad (16 px). |
| `4px` | Barras de progreso de 8 px, sillas del plano (14 px), esquina de la burbuja ajena y del muro. |
| `3px` | Barras de progreso de 6 px (Registro, plan fijado). |

Radios compuestos: escenario `10px 10px 36px 36px`; burbuja propia `18px 18px 4px 18px`; burbuja ajena `4px 18px 18px 18px` (primera del grupo) o `18px` (siguientes); muro de Evento `4px 16px 16px 16px`; chat en celular: barra `20px 20px 0 0` y compositor `0 0 20px 20px`.

**Propuesta de tokens:** `--radius-pill: 999px`, `--radius-2xl: 28px`, `--radius-xl: 24px`, `--radius-lg: 20px`, `--radius-card: 18px`, `--radius-md: 16px`, `--radius-sm: 14px`, `--radius-field: 12px`, `--radius-xs: 10px`, más los casos especiales (22, 9, 8, 6, 5, 4, 3) como valores locales. El 22 px de Evento se puede normalizar a 24 px (decisión de diseño).

#### Grosores, colores y estilos de borde

| Borde | Uso |
|---|---|
| `1px solid #EAE1D8` | Borde por defecto de tarjetas, paneles, chips inactivos, buscadores y campos de compositor; divisores del encabezado (`border-bottom`) y del pie (`border-top`). |
| `1px solid #D9CEC3` | Campos de formulario de Registro y del checkout. |
| `1px solid #17120F` | Botones secundarios (contorno tinta). |
| `1.5px solid #17120F` / `#EAE1D8` | Opciones seleccionables (localidades, medios de pago, repost, encuesta, amigos, miembros del parche): tinta si está elegida, línea si no. |
| `2px solid #17120F` | Radios y casillas personalizados, sillas del plano, puntos de la programación, círculo de éxito del paso 4. |
| `2px solid {tinta o transparente}` | Zonas del plano (tinta si está elegida). |
| `3px solid #C23A24` (inferior) | Pestaña activa (Perfil, Evento). Inactiva: `transparent`. Línea base: `box-shadow: inset 0 -1px 0 #EAE1D8`. |
| `2px solid #17120F` (inferior) | Encabezado de ciudad en la lista del Mapa. |
| `1px dashed #EAE1D8` | Estados vacíos; separador del subtotal en la tarjeta de compra (`border-top`). |
| `1px dashed #B9AEA4` | "Buscar amigos en mis contactos" (Registro). |
| `1.5px dashed #6E6259` | Recuadro "Campos seguros de [PASARELA]". |
| `2px dashed #EE93BC` | "Pista" del plano. |
| `2px dashed #D9CEC3` | Perforación de la boleta. |
| `1px solid rgba(255,255,255,.35)` / `.4` / `.3` / `.07` | Bordes sobre fondo oscuro (ver Transparencias). |
| Bordes de avatar | `2px solid #140E10` (héroe y pines del mini-mapa), `2px solid #FFFFFF` (avatares apilados de 22–24 px), `3px solid #FFFFFF` (quién va, 40 px), `3px solid #FBF7F3` (historias), `5px solid #FFFFFF` (avatar de Perfil, 128 px), `3px solid #140E10` (pines del Mapa). |

**Subrayados de enlace:** no se usa `text-decoration`. Los enlaces de texto destacados llevan `border-bottom: 2px solid #17120F`, con `padding-bottom: 1px` en "Ver toda la agenda", "Ver todos los planes en el mapa", "Ver parches" y "Ver más planes en el mapa", y **sin** `padding-bottom` en "Ver las 128 fotos", "Ver localidades" y "Entrar" del encabezado de Registro (unificar en 1 px). Sobre oscuro: `2px solid #FFFFFF` ("Ver la agenda sin registrarme") y `1px solid #FFFFFF` ("Entrar" del bloque "Únete"). Solo dos botones de texto de Evento usan `text-decoration: underline; text-underline-offset: 3px` ("Ver boleta" y "Volver al evento").

**Divisores:** `#EAE1D8` entre secciones y encabezados; `#F1EAE3` dentro de las tarjetas; separador con texto en Registro ("o con tus datos") y en el chat ("AYER"): dos líneas de 1 px `#EAE1D8` con `flex: 1` a cada lado. El separador "N mensajes nuevos" usa líneas de 1,5 px `#C23A24` al 50 % de opacidad.

---

### Sombras

El prototipo es casi plano: las tarjetas **no** tienen sombra. Las sombras se reservan para lo que flota.

| Declaración | Uso | Pantallas |
|---|---|---|
| `0 24px 60px rgba(23,18,15,.3)` | Ventanas modales (repost, nuevo chat/parche). | Agenda, Chat |
| `0 24px 60px rgba(23,18,15,.35)` | Diálogo lateral del checkout. | Evento |
| `0 14px 40px rgba(23,18,15,.07)` | Tarjeta de compra fija (lateral). | Evento |
| `0 -10px 30px rgba(23,18,15,.08)` | Barra de compra fija inferior (menos de 980 px). | Evento |
| `0 14px 34px rgba(23,18,15,.14)` | Boleta digital (paso 4). | Evento |
| `0 6px 18px rgba(23,18,15,.18)` | Zona del plano elegida (si no, `none`). | Evento |
| `inset 0 0 0 1px #17120F` | Medio de pago elegido (suma 1 px al borde de 1,5 px; si no, `none`). | Evento |
| `0 1px 3px rgba(23,18,15,.3)` | Perilla blanca de los interruptores. | Chat, Evento |
| `-16px 0 40px rgba(23,18,15,.16)` | Panel de información como cajón (entre 900 y 1179 px). Por debajo de 900 px: `none`. | Chat |
| `inset 0 -1px 0 #EAE1D8` | Línea base de las pestañas. | Evento, Perfil |
| `0 0 0 2px #17120F` | Anillo de la insignia de no leídos sobre el ícono activo (tinta). | Chat |
| `0 0 0 1.5px #17120F` | Anillo del punto "En línea". | Chat |
| `0 0 0 2px #140E10` | Pines del mini-mapa de Inicio; punto de la ubicación real en el Mapa. | Main, Mapa |
| `0 0 0 4px rgba(246,220,106,.2)` | Halo de los pines del mini-mapa. | Bienvenida |
| `0 6px 14px rgba(0,0,0,.4)` | Pin del Mapa (no elegido). | Mapa |
| `0 0 0 4px rgba(194,58,36,.6), 0 0 0 12px rgba(194,58,36,.22), 0 8px 22px rgba(0,0,0,.45)` | Pin del Mapa elegido. | Mapa |
| `0 2px 8px rgba(0,0,0,.35)` | Etiqueta del nombre de la ciudad junto al pin. | Mapa |
| `filter: drop-shadow(0 0 22px rgba(243,178,126,.18))` | Resplandor del país. | Mapa |
| `text-shadow: 0 0 3px #140E10, 0 0 6px #140E10` | Nombres de ciudad del mini-mapa. | Bienvenida |
| `text-shadow: 0 1px 3px rgba(0,0,0,.7)` | Nombres de ciudad del mini-mapa. | Main |

Sombras del código base que el prototipo quitó: buscador `0 1px 2px rgba(23,18,15,.04)` y tarjeta al pasar el mouse `0 12px 28px rgba(23,18,15,.10)` (ver "Movimiento").

**Propuesta de tokens:** `--shadow-modal: 0 24px 60px rgba(23,18,15,.3)` (unificar el .35 del checkout), `--shadow-sticky: 0 14px 40px rgba(23,18,15,.07)`, `--shadow-bar: 0 -10px 30px rgba(23,18,15,.08)`, `--shadow-raised: 0 14px 34px rgba(23,18,15,.14)`, `--shadow-drawer: -16px 0 40px rgba(23,18,15,.16)`, `--shadow-knob: 0 1px 3px rgba(23,18,15,.3)`, `--shadow-card-hover: 0 12px 28px rgba(23,18,15,.10)` (si se recupera el hover).

---

### Movimiento

#### Transiciones del prototipo

No hay ninguna `animation` ni `@keyframes` en las 8 pantallas. Estas son todas las transiciones:

| Elemento | Propiedad, duración y curva | Pantalla |
|---|---|---|
| Contenido del mapa (zoom y desplazamiento) | `transform 460ms cubic-bezier(.22,.8,.24,1)` | Mapa |
| Contraescala de etiquetas geográficas y de cada pin | `transform 460ms cubic-bezier(.22,.8,.24,1)` | Mapa |
| Botón del pin (posición, color, halo) | `left 460ms ease, top 460ms ease, background-color 200ms ease, box-shadow 200ms ease` | Mapa |
| Línea de conexión de un pin desplazado | `width 460ms ease` | Mapa |
| Barra "N de M ya tienen boleta" (plan fijado) | `width 300ms ease` | Chat |
| Barra de cada opción de encuesta | `width 300ms ease` | Chat |
| Perilla del interruptor "Silenciar notificaciones" | `left 160ms ease` | Chat |

**Sin transición** (cambio instantáneo): chips, botones que alternan, pestañas, pasos del checkout, ventanas modales (aparecen y desaparecen de golpe), perilla del interruptor "Dividir el pago" en Evento (salta de `left: 3px` a `21px`), barras de cupos de Inicio y Evento.

#### Zoom del mapa (detalle)

- **Escala:** de 1× a 3× en pasos de 0,5. Al elegir una ciudad, el zoom sube a `max(zoom actual, 2)`.
- **Transformación** del contenido (`transform-origin: 0 0`): `translate(tx%, ty%) scale(Z)`, con `tx = px·(1 − Z) + k·(50 − px)` y `ty = py·(1 − Z) + k·(50 − py)`. `px` y `py` son la posición de la ciudad elegida en % (o 50 si no hay ciudad), y `k = min(1, max(0, Z − 1))` si hay ciudad (0 si no). La ciudad elegida queda centrada.
- **Contraescala:** cada pin y cada etiqueta geográfica lleva `transform: scale(1/Z)` para conservar su tamaño en pantalla.
- **Separación de pines vecinos:** los pines con desplazamiento (`ox`, `oy` en px) se mueven `ox·f` y `oy·f`, con `f = max(0, min(1, (3 − Z)/2))`. A 3× quedan en su lugar real y la línea de conexión mide 0.
- **Indicador:** "1×", "1,5×", "2×"… (coma decimal y signo ×).

#### Hover de tarjetas (del código base, perdido en el prototipo)

```css
.card { transition: transform 200ms ease-out, box-shadow 200ms ease-out; }
.card:hover { transform: translateY(-3px); box-shadow: 0 12px 28px rgba(23,18,15,.10); }
@media (prefers-reduced-motion: reduce) { .card { transition: none; } .card:hover { transform: none; } }
```

El prototipo **no** tiene ningún hover en tarjetas (medido en Chromium: `transform: none`, `box-shadow: none`, sin transición). Recuperarlo es una **decisión pendiente** (ver "Foco y estados globales"). Si se recupera, respetar `prefers-reduced-motion` igual que el código base.

#### `prefers-reduced-motion`

- **Mapa y Chat:** `@media (prefers-reduced-motion: reduce){[data-fx]{transition:none !important}}`. Verificado: con movimiento reducido, los 33 elementos `[data-fx]` del Mapa y los 5 del Chat quedan en `transition: none`. El zoom sigue funcionando, pero salta sin animación.
- **Evento, Agenda, Bienvenida, Inicio, Registro, Perfil:** no tienen la regla porque no tienen transiciones.
- **Producción:** toda transición nueva (hover de tarjetas, apertura de ventanas, cajones, hoja inferior del Mapa de la Auditoría H42, desplazamientos suaves) debe anularse con esa media query. Si se usa `scroll-behavior: smooth`, también.

#### Recomendaciones de duración (propuesta)

Mantener las tres familias que ya existen: **160–200 ms `ease`** para microinteracciones (interruptores, color, halo), **300 ms `ease`** para barras de progreso y **460 ms `cubic-bezier(.22,.8,.24,1)`** para cambios de vista del mapa. Si se agregan aperturas de ventanas o cajones, usar 200–300 ms.

---

### Iconografía

#### Estilo

- **SVG en línea**, `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`. El ícono toma el color del texto de su botón o enlace. **Excepciones con color fijo en el trazo:** `stroke="#6E6259"` en la lupa de los buscadores (encabezado y búsqueda de chats) y en la campana tachada de 14 px "Silenciado" de la lista del chat; `stroke="#C23A24"` en el pin de la franja "Planes de tu gente en…" (Inicio), el calendario de 12 px de la píldora de evento en la lista del chat y los íconos de reacción "Me encanta" (corazón) y "Prendido" (llama); `stroke="#F6DC6A"` en la palomita del aviso oscuro de repost (Agenda).
- **Terminaciones:** `stroke-linecap="round"` y casi siempre `stroke-linejoin="round"`.
- **Grosor de trazo** según el tamaño y el peso visual:
  - `2`: grosor por defecto en 16–22 px.
  - `2.2`: íconos de botones de acción ("Repostear", "Ver en el mapa" del Mapa, "Lista", "Comprar mi boleta", "Enviar").
  - `2.4`: cerrar (X), zoom, palomita del aviso, píldoras del chat, encuesta, temporizador.
  - `2.5`: lupa del botón rojo "Buscar" (Bienvenida).
  - `2.6`: flechas pequeñas de 14 px, "−/+" de cantidad, palomita de "Vas a ir", "Reposteaste".
  - `3` a `4`: palomitas muy pequeñas (10–14 px) para que se lean: `3` (pasos y zonas), `3.2` (casilla de términos), `3.4` ("Tiene boleta"), `3.6` (selector de amigos), `4` (encuesta).
- **Excepciones con relleno** (`fill="currentColor"`): estrellas de la reseña (Inicio), estrella de "Me interesa" activo, corazón de "Guardado"/"Me gusta" activo (`fill="{{…}}"`), "Más opciones" (tres círculos), pin de la ubicación (34 px, con círculo interior `#FFFFFF`) e insignia de cuenta verificada (sello `#C23A24` con palomita blanca de 2,2 px).
- **Accesibilidad:** todo ícono decorativo lleva `aria-hidden="true"`. Los botones de solo ícono llevan `aria-label` ("Buscar", "Notificaciones", "Cerrar", "Acercar", "Alejar", "Compartir evento", "Enviar a un amigo", "Más opciones", "Guardar {evento}"). Los íconos con significado propio llevan `role="img"` y `aria-label` ("Cuenta verificada", "Silenciado").
- **Tamaños usados:** 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 26 y 34 px. Por rol:
  - 20 px: navegación del encabezado (en cuadros de 44 px), barra de acciones de publicaciones, compositor y barra del chat.
  - 18 px: botones grandes, lupa del buscador, menú lateral de Inicio, cajas de 36 px, "Volver".
  - 16 px: íconos junto a texto en botones y chips, pin del selector de ciudad.
  - 14–15 px: botones pequeños y metadatos.
  - 12–13 px: dentro de píldoras e insignias.
  - 22 px: cajas de datos clave (46 px) y medios de pago.
  - 26 px: círculo de éxito.
  - 34 px: pin del mapa de ubicación.
- **El código base** usaba el mismo estilo y un ícono de flecha externa (`M7 17 17 7M9 7h8v8`, 13 px, trazo 2,5) en "Boletas ↗". El prototipo lo eliminó porque la compra ya no sale del sitio.

#### Prohibido: emoji

No se usan emoji en ninguna parte (ni en la interfaz ni en el chat de ejemplo): los emoji cambian según el sistema y no se controlan el color ni el tamaño. Las reacciones del chat son íconos SVG ("Me encanta" = corazón, "Prendido" = llama, "Me gusta" = pulgar).

**Única excepción encontrada:** Registro muestra los pasos completados con el carácter `✓` (U+2713) como texto (`n: done ? '✓' : String(n)`). Reemplazarlo por el SVG de palomita (`m5 12 5 5L20 7`), como hace el indicador de pasos del checkout.

#### Catálogo de íconos

| Ícono | Trazado (`d` o elementos, viewBox 24) | Significado y dónde | Tamaño / trazo |
|---|---|---|---|
| Lupa | `<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>` | Buscar (buscadores, botón "Buscar", "Explorar agenda" en el menú de Inicio). Color `#6E6259` en los campos. | 16–18 / 2 (2,5 en el botón rojo) |
| Pin de ubicación | `M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z` + `<circle cx="12" cy="10" r="2.5"/>` | Ciudad y lugar: selector de ciudad, chip "Toda Colombia", "Lugar", "Ver en el mapa" del Mapa, franja de ciudad de Inicio, lista de Bienvenida. Relleno en el mapa de ubicación. | 14–22 / 2–2,2; 34 relleno |
| Casa | `M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z` | Inicio (navegación) y "Mi ciudad: Bogotá". | 16–20 / 2 |
| Calendario | `<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>` | Agenda (navegación), "Etiquetar evento", "Agregar al calendario", píldora del evento en la lista del chat. | 12–20 / 2–2,4 |
| Calendario con + | Calendario + `M12 13v5M9.5 15.5h5` | "Compartir evento" en el compositor del chat. | 20 / 2 |
| Mapa plegado | `M9 4 3 6.5V20l6-2.5 6 2.5 6-2.5V4l-6 2.5z` + `M9 4v13.5M15 6.5V20` | Mapa (navegación), "Ver en el mapa", "Abrir el mapa de eventos", "Mapa" de Perfil y Agenda. | 15–20 / 2–2,2 |
| Mapa plegado (variante) | `M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z` + `M9 4v14M15 6v14` | Estado vacío del panel del Mapa. **Variante distinta**: unificar con la anterior. | 22 / 2 |
| Globo | `<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>` | "Toda Colombia" sobre el mapa. | 16 / 2 |
| Globo de chat | `M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z` | Mensajes (navegación), comentarios, "Escribir al organizador", "Avisar a mi parche", aviso de pago dividido. | 18–20 / 2 |
| Globo de chat con + | Globo + `M12 8.5v7M8.5 12h7` | "Nuevo chat". | 16 / 2 |
| Campana | `M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9` + `M10.3 21a1.9 1.9 0 0 0 3.4 0` | Notificaciones; chat no silenciado; aviso de Nequi/Daviplata. | 16–20 / 2 |
| Campana tachada | `M8.7 3.6A6 6 0 0 1 18 8c0 3.2.6 5.4 1.3 6.8M17 17H3s3-2 3-9c0-.5 0-1 .1-1.4` + `M10.3 21a1.9 1.9 0 0 0 3.4 0` + `m3 3 18 18` | Silenciado (lista, barra y panel del chat). | 14–20 / 2 |
| Corazón | `M12 20s-7-4.4-9.2-8.6C1.3 8.4 3.2 5 6.6 5c2 0 3.4 1.1 4.4 2.5C12 6.1 13.4 5 15.4 5c3.4 0 5.3 3.4 3.8 6.4C19 15.6 12 20 12 20z` (solo `linejoin`) | **Dos significados:** "Guardar" en Bienvenida, Agenda y Mapa; "Me gusta" en Inicio y "Me encanta" en el chat (trazo `#C23A24`). Activo: relleno `currentColor` en `#C23A24`. | 15–20 / 2–2,2 |
| Marcador | `M6 3h12v18l-6-4-6 4z` | "Guardados" (menú de Inicio) y "Guardar evento" en las publicaciones. La Auditoría H41 pide usar **este** ícono para guardar en todo el producto. | 18–20 / 2 |
| Compartir (caja con flecha) | `M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v13` | "Compartir" de las publicaciones (Inicio). | 20 / 2 |
| Compartir (variante) | `M12 3v12M7 8l5-5 5 5` + `M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6` | "Compartir evento" (Evento). **Variante distinta**: unificar. | 18 / 2 |
| Repost | `M17 2l4 4-4 4` + `M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4` + `M21 13v2a3 3 0 0 1-3 3H3` | Repostear / Reposteado / "Reposteaste". | 13–16 / 2,2–2,6 |
| Avión de papel | `M22 2 11 13M22 2l-7 20-4-9-9-4z` | "Enviar a un amigo", "Invitar amigos", "Enviar" (chat). | 16–18 / 2–2,2 |
| Palomita | `m5 12 5 5L20 7` | Confirmado: aviso de repost, "Voy/Vas a ir", zona elegida, pasos completados, "Tiene boleta", éxito, casilla, encuesta, amigo elegido. | 10–26 / 2,4–4 |
| Doble palomita | `m2 13 4 4 8-9M10 15l2 2 9-10` | Mensaje propio enviado (meta del chat). | 14 / 2,2 |
| Cerrar | `M6 6l12 12M18 6 6 18` | Cerrar ventanas, cajones y avisos. | 16 / 2,4 |
| Menos / Más | `M5 12h14` / `M12 5v14M5 12h14` | Cantidad, zoom, "Armar parche" (Evento). | 16–18 / 2,2–2,6 |
| Flecha a la derecha | `M5 12h14M13 6l6 6-6 6` | "Ir a mi feed", "Ver qué pasa en todo el país", botón del pie del checkout, "Ver evento" en el chat. | 14–16 / 2,4–2,6 |
| Chevrón izquierdo | `M15 18l-6-6 6-6` | "Volver al feed", "Volver a tus chats", "Ver todo Colombia" (Mapa). | 15–20 / 2–2,2 |
| Flecha arriba | `M12 19V5M6 11l6-6 6 6` | "Entrada" en el plano. | 14 / 2,4 |
| Personas (dos) | `<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a6.5 6.5 0 0 1 3.5 5.5"/>` | "Mira a qué van tus amigos" (Bienvenida). Variante en el héroe de Evento ("186 van"): `M2.5 20c.8-3.5 3.4-5.5 6.5-5.5s5.7 2 6.5 5.5` + `M16 4.5a3.5 3.5 0 0 1 0 7M18 14.8c2 .7 3.2 2.5 3.6 5.2`. | 16–18 / 2 |
| Persona | `<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/>` | Línea social de la tarjeta ("186 van"). | 14 / 2 |
| Persona con + | Persona + `M19 8v6M16 11h6` (en el mismo `path`) | "Armar parche" (Inicio), "Nuevo parche", mensaje del sistema de grupo. | 13–16 / 2–2,4 |
| Grupo | `<circle cx="9" cy="8" r="3.5"/><circle cx="17" cy="9" r="2.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M15 14.5a5 5 0 0 1 6.5 5"/>` | "Mis parches" (menú de Inicio). | 18 / 2 |
| Filtro (embudo de líneas) | `M4 6h16M7 12h10M10 18h4` | "Filtra por rumba…" (Bienvenida). | 18 / 2 |
| Lista | `M9 6h11M9 12h11M9 18h11` + `M4 6h.01M4 12h.01M4 18h.01` | Vista "Lista" (Agenda). | 16 / 2,2 |
| Imagen | `<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.5"/><path d="m21 16-5-5-9 8"/>` | "Foto" (Inicio), "Enviar foto" (Chat). | 16–20 / 2 |
| Galería | `<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 15 5-4 4 3 3-2 6 4"/>` | "Recuerdos" (menú de Inicio). | 18 / 2 |
| Estrella | `m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z` | "Reseña", "Me interesa" (relleno al activarse), calificación (relleno `#E0A21B`). | 16–18 / 2 o relleno |
| Más opciones | Tres `<circle r="1.8">` en x = 5, 12, 19 (relleno) | Menú de la publicación. | 18 / relleno |
| Reloj | `<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>` | Fecha y hora del evento. | 16–22 / 2 |
| Temporizador | `<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 1.5M9 2h6"/>` | "Tus boletas están reservadas por 9:58". | 16 / 2,2 |
| Documento de identidad | `M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM6 10a2 2 0 1 0 4 0a2 2 0 1 0-4 0M5 16c.6-1.4 1.7-2 3-2s2.4.6 3 2M14 10h5M14 14h4` | "Edad" y "Documento original". | 20–22 / 2 |
| Boleta | `M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4z` (+ perforación `M14 6v12` con `stroke-dasharray="2 2"` en "Precio") | "Comprar boletas", "Ver mis boletas", "Precio". | 16–22 / 2 |
| Boleta (variante del chat) | `M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4z` (+ `M14 7v2M14 11v2M14 15v2`) | "Ver evento", "Comprar mi boleta", mensaje "compró 2 boletas". **Variante distinta**: unificar con la anterior. | 13–20 / 2–2,4 |
| Candado | `<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>` | "Pago seguro", "Campos seguros de [PASARELA]". | 16 / 2 |
| Escudo con palomita | `M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6z` + `m9 12 2 2 4-4` | "Tu pago se procesa por API…". | 16 / 2 |
| Sobre | `<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>` | "La boleta también te llega al correo…". | 16 / 2 |
| Celular | `M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM11 18h2` | Nequi y Daviplata (medios de pago). Variante en Registro ("Buscar amigos en mis contactos"): `<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/>`. | 18–22 / 2 |
| Banco | `M3 10h18M5 10v7M9.5 10v7M14.5 10v7M19 10v7M3 20h18M12 3l9 5H3z` | PSE y Botón Bancolombia. | 22 / 2 |
| Tarjeta | `M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM2 10h20M6 15h4` | Tarjeta crédito/débito. | 22 / 2 |
| Prohibido | `M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18zM5.6 5.6l12.8 12.8` | "No hay reingreso". | 20 / 2 |
| Parqueadero | `M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM9 17V7h4a3 3 0 0 1 0 6H9` | "Parqueadero". | 20 / 2 |
| Accesibilidad | `M10.5 4.5a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0M5 8l7 1 7-1M12 9v5l-3 6M12 14l3 6` | "Accesibilidad". | 20 / 2 |
| QR | `M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 18h2v2h-2zM14 18h2M18 14h2` | "Boleta digital". | 20 / 2 |
| Flechas circulares | `M20 11a8 8 0 0 0-14.9-4M4 4v4h4M4 13a8 8 0 0 0 14.9 4M20 20v-4h-4` | "Cambios y devoluciones". | 20 / 2 |
| Información | `<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>` | "Info del grupo / del chat". | 20 / 2 |
| Barras (encuesta) | `M6 20V11M12 20V5M18 20v-6` | "Crear encuesta", "ENCUESTA". | 13–20 / 2,2–2,6 |
| Chincheta | `M9 4h6l-1 5 3 3v2H7v-2l3-3z` + `M12 14v6` | "PLAN FIJADO". | 13 / 2,4 |
| Moneda | `M12 3v18` + `M16.5 7.5c-.8-1.2-2.4-2-4.5-2-2.5 0-4 1.2-4 3s1.6 2.4 4 3 4 1.4 4 3.2-1.7 3-4.2 3c-2.1 0-3.7-.8-4.5-2` | "Dividir pago del parche", mensaje del sistema de pago. | 13–17 / 2,2–2,4 |
| Salir | `M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 17l-5-5 5-5M5 12h11` | "Salir del parche". | 19 / 2 |
| Llama | `M12 21c3.9 0 6.5-2.6 6.5-6.3 0-3.4-2.2-5.6-3.9-8-.4 1.8-1.3 2.9-2.5 3.3.2-2.7-.8-5.3-3-7.5.2 3.7-3.6 6.3-3.6 12.2 0 3.7 2.6 6.3 6.5 6.3z` | Reacción "Prendido" (trazo `#C23A24`). | 15 / 2,2 |
| Pulgar | `M7 10v10H4V10z` + `M7 10l4-7c1.4 0 2.4 1.2 2.1 2.6L12.5 9H19a2 2 0 0 1 2 2.3l-1.2 6.9A2.2 2.2 0 0 1 17.6 20H7` | Reacción "Me gusta". | 15 / 2,2 |
| Sello de verificado | `M12 2.5l2.4 1.8 3-.1.9 2.8 2.4 1.8-.9 2.9.9 2.9-2.4 1.8-.9 2.8-3-.1L12 21.5l-2.4-1.8-3 .1-.9-2.8-2.4-1.8.9-2.9-.9-2.9 2.4-1.8.9-2.8 3 .1z` relleno `#C23A24` + `m8.5 12.2 2.3 2.3 4.7-4.9` trazo `#FFFFFF` 2,2 | "Cuenta verificada" (organizador). | 15–17 |
| "G" de Google (contorno) | Cuatro `path` desde `M20.5 12.2c0-.6…` | "Continuar con Google" (Registro), en trazo `currentColor` 2,2. **En producción** se debe usar el botón oficial de Google con su logo a color, según sus guías de marca. | 18 / 2,2 |

**Medios de pago y boleteras:** se nombran en texto plano, sin logos (decisión 2.4). Los íconos de medio de pago son genéricos (celular, banco, tarjeta).

---

### Elevación y capas

#### `z-index` usados

| Valor | Elemento | Pantalla |
|---|---|---|
| `1` | Etiquetas geográficas del mapa. | Mapa |
| `2` | Encabezado y pie fijos **dentro** del diálogo del checkout. | Evento |
| `4` | Barra de atajos de sección (`sticky; top: 69px`, desde 980 px). | Evento |
| `4` | Barra superior y compositor de la conversación (`sticky`, por debajo de 900 px). | Chat |
| `5` | Encabezado `sticky; top: 0`. | Bienvenida, Inicio, Agenda, Evento, Chat |
| `6` | Panel de información como cajón (`absolute`, entre 900 y 1179 px). | Chat |
| `15` | Barra de compra fija inferior (`fixed`, por debajo de 980 px). | Evento |
| `20` | Ventana "Repostear evento" (`fixed; inset: 0`). | Agenda |
| `30` | Diálogo del checkout (`fixed; inset: 0`). | Evento |
| `30` | Panel de información a pantalla completa (`fixed; inset: 0`, por debajo de 900 px). | Chat |
| `40` | Ventana "Nuevo parche / Nuevo chat" (`fixed; inset: 0`). | Chat |
| `40 − n` | Pines del mapa no elegidos (n = número de planes: los grandes quedan debajo de los pequeños). | Mapa |
| `60` | Pin elegido. | Mapa |
| `70` | Encabezado `sticky` del Mapa. | Mapa |

**Por qué el Mapa usa 70:** los pines (hasta 60) no están dentro de un contexto de apilamiento propio, así que al bajar la página pasarían por encima de un encabezado con `z-index: 5`. **Propuesta:** poner `isolation: isolate` (o `position: relative; z-index: 0`) en el contenedor del mapa. Así los pines quedan encerrados y el encabezado puede volver al mismo valor que en las demás pantallas.

#### Elementos fijos y pegajosos

| Elemento | Posición | Detalle |
|---|---|---|
| Encabezado | `position: sticky; top: 0` | Bienvenida, Inicio, Agenda, Mapa, Evento y Chat (en Chat, `static` por debajo de 900 px). Registro y Perfil: **no** es fijo. Fondo `#FBF7F3` (Registro no declara fondo: transparente); borde inferior 1 px `#EAE1D8` en todas menos Bienvenida y Registro. Alto medido: **69 px** en escritorio (78 px en Bienvenida); **125 px** a 768 px (134 px en Bienvenida; 69 px en Evento y Perfil); **224 px** a 390 px en Inicio, Agenda, Mapa y Chat (215 px en Bienvenida; 125 px en Evento y Perfil). Registro tiene un encabezado simple no fijo de 66 px en todos los anchos. La Auditoría H40 pide un encabezado móvil de 56 a 64 px. |
| Atajos de sección | `sticky; top: 69px; z-index: 4` (≥ 980 px) | Evento. Depende del alto exacto del encabezado (69 px). Margen negativo `-22px 0 -18px` y fondo `#FBF7F3`. |
| Tarjeta de compra | `sticky; top: 88px` (≥ 980 px) | Evento. |
| Anclas de sección | `scroll-margin-top: 140px` | Evento (6 secciones). Sirve para los saltos por ancla, no para el foco con Tab (Auditoría H16 pide `scroll-padding`). |
| Barra de compra | `fixed; left: 0; right: 0; bottom: 0; z-index: 15` (< 980 px) | Evento. Fondo blanco, borde superior `#EAE1D8`, sombra `0 -10px 30px rgba(23,18,15,.08)`, `padding: 10px clamp(16px, 4vw, 24px)`. La raíz suma `padding-bottom: 84px` para que no tape el final. |
| Diálogo del checkout | `absolute; top: 12px; right: 12px` dentro de una capa `fixed; inset: 0; z-index: 30` | Evento. `width: min(520px, calc(100% - 24px)); max-height: calc(100% - 24px); overflow-y: auto`; fondo **`#FBF7F3`**, radio 24 px. Encabezado `sticky; top: 0` (fondo `#FBF7F3`) y pie `sticky; bottom: 0` (fondo `#FFFFFF`), los dos con `z-index: 2`. La Auditoría H6 pide cambiar este esquema (columna flexible y un scroll por paso). |
| Ventanas centradas | `fixed; inset: 0; display: flex; align-items: center; justify-content: center; padding: 16px` | Agenda (`z-index: 20`, ventana `max-width: 520px`) y Chat (`z-index: 40`, `max-width: 540px; max-height: calc(100vh - 32px); overflow-y: auto`). Fondo de la ventana `#FFFFFF`. |
| Cajón de información | Ver tabla de `z-index` | Chat. |

#### Fondo detrás de las ventanas

`background: rgba(23,18,15,.55)` en las tres ventanas.

- En Evento y Chat es una capa aparte (`position: absolute; inset: 0`, `aria-hidden="true"`) que **cierra al tocarla**.
- En Agenda el fondo es el propio contenedor y **no** cierra al tocarlo ni con Escape (Auditoría H7).
- El cajón del Chat en celular **no** tiene fondo oscuro ni `role="dialog"` (Auditoría H7).

**Propuesta de escala de capas:** `--z-map-content: 0` (con aislamiento), `--z-sticky-subnav: 4`, `--z-header: 10`, `--z-bottom-bar: 15`, `--z-drawer: 30`, `--z-modal: 40`, `--z-toast: 50`. Todas las ventanas deben ser modales de verdad: `inert` en el fondo, foco atrapado, Escape y foco de vuelta al botón que la abrió (Auditoría H7).

---

### Foco y estados globales

#### Reglas globales del `<helmet>` (exactas)

Comunes a las 8 pantallas:

```css
body{margin:0;background:#FBF7F3}
a{color:#17120F;text-decoration:none}a:hover{color:#C23A24}
button{font-family:inherit;cursor:pointer}
input,select{font-family:inherit}          /* Agenda y Chat: input,textarea,select · Evento: input,select,textarea · Registro: input · Perfil: ninguna */
```

Solo en algunas pantallas:

| Pantalla | Regla |
|---|---|
| Evento | `button:disabled{cursor:default;opacity:.45}` · `button:focus-visible,a:focus-visible,input:focus-visible,select:focus-visible{outline:3px solid #C23A24;outline-offset:2px}` |
| Chat | `button:disabled{cursor:default}` · `button:focus-visible,a:focus-visible,select:focus-visible,input:focus-visible{outline:3px solid #C23A24;outline-offset:2px}` |
| Mapa | `button:disabled{cursor:default;opacity:.4}` · `button:focus-visible,a:focus-visible,select:focus-visible{outline:3px solid #C23A24;outline-offset:2px}` · `[data-fe~="dark"] button:focus-visible{outline-color:#F6DC6A}` |
| Código base | `:focus-visible { outline: 3px solid var(--brand); outline-offset: 2px; }` (con `#D9452F`) y `* { box-sizing: border-box; margin: 0; padding: 0; }` |

El prototipo **no** tiene `box-sizing: border-box` global: lo declara elemento por elemento. En producción, usar el reset global del código base.

#### Contorno de foco (medido en Chromium con el teclado)

| Pantalla | Botones y enlaces | Campos de texto |
|---|---|---|
| Evento, Chat, Mapa | `outline: 3px solid #C23A24; outline-offset: 2px` | Evento: los campos sí muestran el contorno (no tienen `outline: 0`). Chat: `outline: 0` en línea **gana** a la regla → **sin indicador**. Mapa: el buscador tiene `outline: 0` y la regla no incluye `input` → **sin indicador**. |
| Mapa, dentro del mapa oscuro | `outline: 3px solid #F6DC6A; outline-offset: 2px` | — |
| Bienvenida, Registro, Inicio, Agenda, Perfil | **Anillo por defecto del navegador** (`outline: auto 1px`, gris oscuro), sin separación en botones y con 1 px en enlaces | `outline: 0` en línea → **sin indicador** |

La Auditoría H51 encontró **13 campos de texto sin indicador de foco**: Bienvenida (buscador), Inicio (buscador y compositor), Agenda (buscador y comentario del repost), Mapa (buscador), Chat (buscador, búsqueda de chats, compositor y nombre del parche) y Registro (los 3 campos).

**Regla para producción (obligatoria, Auditoría H51):**

```css
:focus-visible { outline: 3px solid #C23A24; outline-offset: 2px; }
.superficie-oscura :focus-visible { outline-color: #F6DC6A; }   /* héroes, mapa, bloques #17120F y #140E10 */
```

- Quitar todos los `outline: 0` en línea de los campos.
- **Alternativa** que permite la auditoría para los campos píldora: marcar el contenedor con `:focus-within` y un borde de 2 px `#C23A24`.
- Contrastes del contorno: `#C23A24` 5,02:1 sobre crema y 5,35:1 sobre blanco; `#F6DC6A` 13,97:1 sobre `#140E10`. Sobre `#17120F`, `#C23A24` da solo 3,47:1: en los bloques tinta ("Únete", "Tu semana", aviso de repost) usar amarillo.
- **Foco tapado por barras fijas (Auditoría H16):** `scroll-padding` por punto de quiebre, según el alto real del encabezado. Valores que la auditoría probó: **Evento** `html{scroll-padding-top:90px}`, 140 px desde 980 px, y `scroll-padding-bottom:84px` por debajo de 979 px (0 controles tapados a 390, 768 y 1280 px). **Bienvenida:** 90 px sirven en escritorio, pero en celular harían falta 230 px; es mejor compactar ese encabezado a una fila o quitarle el `sticky` por debajo de unos 768 px (H40). En el checkout, la auditoría (H6) probó `scroll-padding` de 270 px arriba y 215 px abajo en el contenedor del diálogo como arreglo mínimo.

#### Hover

**En el prototipo solo existe un hover:** `a:hover{color:#C23A24}`, sin transición. Consecuencias medidas:

- **Cambia** el texto (y los íconos, porque usan `currentColor`) de los enlaces **sin color en línea**: navegación de texto de Bienvenida, íconos de navegación no activos, títulos de tarjeta, noticias, "Ver toda la agenda", "Ver en el mapa", avatares enlazados.
- En los enlaces subrayados con borde, el **borde no cambia** (sigue `#17120F`) porque no usa `currentColor`.
- **Efecto no deseado:** las **iniciales** de los avatares enlazados (historias, autores, "Gente con tus gustos", "Tus parches", avatar "CV" del encabezado) también se ponen rojas. En producción, limitar el hover rojo al texto.
- **No cambian** los enlaces con color en línea: logo, CTA rojos "Comprar" / "Ver plan" (medido: siguen `#C23A24` / `#FFFFFF`), botones-enlace blancos u oscuros, ícono de la página actual, "Tu semana".
- **Ningún `<button>` tiene hover** (chips, segmentos, "Crear evento", guardar, repostear…): solo cambia el cursor a mano.
- **Ninguna tarjeta tiene hover.**

**Hover del código base** (referencia para producción, **decisión pendiente** recuperarlos):

| Elemento | Hover en el código base | Adaptación propuesta al prototipo |
|---|---|---|
| Botón rojo (`.go`, `.ticket`) | Fondo `#BF3923` | Fondo `--brand-hover` (pendiente; candidato `#B5372B`). |
| Botón tinta (`.btn-dark`) | Fondo `#33291F` | Igual. |
| Botón blanco (`.btn-light`) | Fondo `#F3ECE6` | `#F3ECE5`. |
| Chip (`.chip`) | Borde `#17120F` (`var(--ink)`) | Igual, solo en chips inactivos. |
| Enlace subrayado (`.more`) | Color y borde `var(--brand)` | Color y borde `#C23A24`. |
| Título de noticia | Color `var(--brand)` | `#C23A24` (ya ocurre por herencia). |
| Tarjeta (`.card`) | `translateY(-3px)` + `0 12px 28px rgba(23,18,15,.10)`, 200 ms `ease-out` | Igual, anulado con `prefers-reduced-motion`. |
| Botón "Me uno" (`.join`) | Fondo tinta, texto blanco | Aplica a "Unirme" / "Seguir" si se decide. |
| Enlaces de navegación (`.nav a`) | Color `var(--brand)` | `#C23A24` (ya ocurre). |

Sobre fondos oscuros, el hover **no** debe ser `#C23A24` (3,47:1 sobre `#17120F`). Usar subrayado o amarillo `#F6DC6A`.

#### Deshabilitado

Hoy hay tres tratamientos (ver "Estados"). Además, el checkout y otros botones usan `disabled` justo cuando tienen el foco, y el foco se pierde (Auditoría H7).

**Regla para producción:**

1. En los botones que guían un flujo (Continuar, Pagar, Enviar, Acercar, Quitar, Crear parche) usar `aria-disabled="true"` en lugar de `disabled`, mantener el foco y mostrar por qué no se puede avanzar, como ya hace el pie del checkout ("Escribe tu número de documento para continuar.").
2. Un solo aspecto visual. **Propuesta:** fondo `#EAE1D8` con texto `#6E6259` (4,57:1, el tratamiento del Chat), `cursor: not-allowed` o `default`, sin opacidad (la opacidad sobre el rojo deja el texto a 2,05:1).
3. Quitar `#B9AEA4` de Registro y el cursor de mano en los botones deshabilitados.

#### Selección y estados que alternan (patrones globales)

Todos los botones que alternan llevan `aria-pressed` (o `aria-selected` en pestañas, `aria-checked` en interruptor y casilla, `aria-current` en navegación y pasos).

| Patrón | Inactivo | Activo |
|---|---|---|
| Chip de filtro / segmento / pestaña del feed / filtro del chat | Fondo `#FFFFFF` (o `transparent` dentro de un grupo), borde 1 px `#EAE1D8`, texto `#17120F` | Fondo `#17120F`, borde `#17120F`, texto `#FFFFFF` (18,59:1) |
| Botón alternable **sobre fondo oscuro** ("Toda Colombia" / "Mi ciudad: Bogotá" del Mapa; 40 px, `padding: 0 15px`, `.84rem` 700) | Fondo `rgba(255,255,255,.08)`, borde 1 px `rgba(255,255,255,.3)`, texto `#FFFFFF` | **Inverso**: fondo `#FFFFFF`, borde `#FFFFFF`, texto `#17120F` (no tinta, porque el fondo ya es oscuro) |
| Contador del chip de ciudad | Fondo `#F3ECE5` | Fondo `#F6DC6A` (texto siempre `#17120F`) |
| Navegación del encabezado | Ícono `#17120F`, fondo transparente | `aria-current="page"`, fondo `#17120F`, ícono blanco, cuadro de 44 px con radio 12 px |
| Menú lateral de Inicio | Sin fondo | Fondo `#FFFFFF`, borde `#EAE1D8`, peso 700 |
| Botón social de contorno ("Voy", "Seguir", "Repostear", "Agregar al calendario", "Dividir pago del parche") | Fondo `#FFFFFF`, borde y texto `#17120F` ("Seguir": al revés, tinta lleno → blanco al seguir) | Fondo `#17120F`, texto `#FFFFFF`; el texto cambia ("Voy" → "Vas" / "Vas a ir", "Repostear" → "Reposteado", "Seguir" → "Siguiendo", "Agregar al calendario" → "Agregado al calendario", "Dividir pago del parche" → "Pago dividido activo") |
| Unirse a un parche | Fondo `#C23A24`, texto blanco ("Unirme", "Unirme al parche") | Fondo `#17120F` ("Estás dentro", "Estás en el parche") |
| Corazón (guardar / me gusta) | Trazo `#17120F` (tarjetas) o `#6E6259` (publicaciones), sin relleno | Trazo y relleno `#C23A24` |
| "Me interesa" | Estrella sin relleno, texto `#17120F` | Estrella rellena y texto `#C23A24` |
| Pestaña (`role="tab"`) | Texto `#6E6259`, borde inferior transparente | Texto `#17120F`, borde inferior 3 px `#C23A24` |
| Opción con radio (localidad, repost, medio de pago) | Borde 1,5 px `#EAE1D8`, fondo blanco; radio de 20 px (18 px en medios de pago) con borde 2 px `#17120F` y punto transparente | Borde 1,5 px `#17120F`; fondo `#FBF7F3` (repost), tinte de la localidad, o blanco con `inset 0 0 0 1px #17120F` (medios de pago); punto de 10 px (8 px) `#17120F` |
| Zona del plano | Fondo del tinte, borde transparente, sin sombra | Fondo de la muestra, borde 2 px `#17120F`, sombra `0 6px 18px rgba(23,18,15,.18)` y círculo tinta de 20 px con palomita |
| Opción de encuesta | Borde `#EAE1D8`, barra `#F3ECE5`, círculo blanco | Borde `#17120F`, barra `#F6DC6A`, círculo `#17120F` con palomita blanca |
| Reacción | Fondo `#FFFFFF`, borde `#EAE1D8` | Fondo `#F6DC6A`, borde `#17120F`, contador +1 |
| Casilla (términos) | 22 px, radio 6 px, borde 2 px `#17120F`, fondo blanco | Borde y fondo `#C23A24`, palomita blanca de 13 px |
| Casilla del selector de amigos | 22 px, radio 6 px (grupo) o 50 % (chat individual), borde 2 px `#17120F` | Fondo `#17120F`, palomita blanca |
| Interruptor | Evento: 46 × 28 px, pista `#D9CEC3`, perilla de 22 px en `left: 3px`. Chat: 44 × 26 px, pista `#EAE1D8`, perilla de 20 px | Evento: pista `#C23A24`, perilla en `left: 21px`, sin transición. Chat: pista `#17120F`, perilla en `left: 21px` con transición de 160 ms |
| Pasos del checkout | Círculo de 26 px blanco, borde 1,5 px `#D9CEC3`, etiqueta `#6E6259` peso 500 | Actual: fondo `#17120F`, número blanco, etiqueta peso 700. Hecho: fondo `#B9E07A`, borde `#17120F`, palomita; conector de 2 px `#17120F` (pendiente: `#D9CEC3`) |
| Pasos del registro | Círculo de 30 px transparente con número `#17120F` sobre `#140E10` (invisible: 1,03:1, Auditoría H52). **Corrección H52:** número en blanco al 65 % con un borde claro. Etiqueta `rgba(255,255,255,.65)` | Actual: fondo `#F6DC6A`. Hecho: fondo `#FFFFFF` con "✓" (reemplazar por SVG). Etiqueta blanca |
| Pin del mapa | Fondo `#F6DC6A`, texto `#17120F`, etiqueta oscura | Fondo `#C23A24`, texto blanco, halo doble rojo, etiqueta blanca con texto tinta, `z-index: 60` |

**Unificar** los dos interruptores (tamaño, color de pista encendida y transición). La pista apagada debe llegar a 3:1 (Auditoría H52 propone `#857870`), y el estado debe decirse también en texto.

#### Cursores

`cursor: pointer` en todo `button` (regla global) y en los `select` de ciudad; `default` en los deshabilitados de Evento, Chat y Mapa. Los enlaces usan el cursor por defecto del navegador para `<a href>`.

---

### Breakpoints globales

#### Todas las reglas `@media` y `@container` del prototipo

| Regla | Pantalla | Qué cambia |
|---|---|---|
| `@media (min-width: 980px)` | Evento | `[data-fe~="buycard"]{position:sticky;top:88px}` y `[data-fe~="secnav"]{position:sticky;top:69px;z-index:4}`: la tarjeta de compra y los atajos de sección quedan pegados al bajar. |
| `@media (max-width: 979px)` | Evento | `[data-fe~="aside"]{display:none}` (se oculta la tarjeta de compra lateral), `[data-fe~="buybar"]{display:flex}` (aparece la barra de compra inferior) y `[data-fe~="root"]{padding-bottom:84px}`. Fuera de la media query, la barra está en `display:none`. |
| `@media (min-width: 900px)` | Chat | `[data-ch~="root"]{height:100vh}` (la página no se desplaza: el chat ocupa la pantalla), `[data-ch~="shell"]{min-height:520px}`, `[data-ch~="back"]{display:none !important}` (sin botón "Volver a tus chats"). |
| `@media (min-width: 1180px)` | Chat | `[data-info-wide="off"]{display:none !important}` (el panel de información va en línea y se oculta si se cierra) y `[data-ch~="tg-narrow"]{display:none !important}`. |
| `@media (max-width: 1179px)` | Chat | `[data-ch~="tg-wide"]{display:none !important}`, `[data-info-narrow="off"]{display:none !important}`, `[data-ch~="list"]{width:300px !important}` y el panel de información se vuelve cajón: `position:absolute !important; top:0; right:0; bottom:0; z-index:6; width:min(320px, 100%) !important; box-shadow:-16px 0 40px rgba(23,18,15,.16)`. |
| `@media (max-width: 899px)` | Chat | El encabezado deja de ser fijo (`static`). `main` con `padding: 12px 16px 16px`. Contenedor con `overflow: visible` y radio 20 px. Se ve **un panel a la vez** (`[data-pane="list"]` oculta la conversación y `[data-pane="chat"]` oculta la lista). El historial pierde su scroll propio (`overflow: visible`, `padding: 8px 12px 16px`). La barra superior queda `sticky; top: 0; z-index: 4` (radio `20px 20px 0 0`) y el compositor `sticky; bottom: 0; z-index: 4` (radio `0 0 20px 20px`). El panel de información ocupa toda la pantalla (`fixed; inset: 0; z-index: 30`, sin sombra). El botón "Enviar" queda solo con el ícono (44 px; el texto pasa a solo lectores de pantalla). |
| `@media (min-width: 1100px)` | Mapa | `[data-fe~="side"]{contain:size}` y `[data-fe~="list"]{min-height:0;overflow-y:auto}`: el panel lateral toma el alto del mapa y la lista se desplaza por dentro. |
| `@container (max-width: 420px)` | Mapa | Cuando la caja del mapa (`container-type: inline-size`, `width: min(100%, 560px)`) mide 420 px o menos: se ocultan los países (`[data-fe~="geo"]{display:none}`) y los mares bajan a `.6rem` con `letter-spacing: .12em` (`!important`). Ocurre en celular (a 390 px la caja mide unos 330 px). |
| `@media (prefers-reduced-motion: reduce)` | Mapa, Chat | `[data-fx]{transition:none !important}`. |
| Unidades de contenedor `cqw` | Bienvenida, Mapa | El mini-mapa de Bienvenida es contenedor (`container-type: inline-size`, máx. 400 px): pines `clamp(20px, 6.5cqw, 26px)`, número `clamp(.64rem, 2.9cqw, .78rem)`, nombre `clamp(.62rem, 2.8cqw, .74rem)`. Pines del Mapa: `clamp(36px, (tamaño/5,6)cqw, tamaño px)`. |

**Código base** (referencia): `@media (max-width: 1080px)` (rejilla de tarjetas a 3 columnas; `.pulse`, el bloque "noticias + panel de amigos", pasa a una columna), `(max-width: 820px)` (se ocultan los enlaces de navegación; el encabezado deja su alto fijo de 76 px y envuelve con `padding-block: 12px; gap: 12px`; el buscador baja a una fila completa; el héroe se compacta a `padding: 64px 22px 32px`, `min-height: 0` y radio 22 px; la etiqueta pierde su margen y baja a `.9rem`; las líneas 2 y 3 del titular pierden su sangría; `.news`, la noticia destacada + la lista, pasa a una columna; rejilla a 2 columnas con `gap: 14px`) y `(max-width: 520px)` (margen lateral 16 px, rejilla a 1 columna, se oculta el nombre de la ciudad en el buscador).

#### Puntos de quiebre implícitos (sin media query)

Casi todo el responsive del prototipo es **fluido**: columnas con `flex-wrap` y bases flexibles, rejillas `auto-fill` / `auto-fit` y `clamp()`. Esto genera puntos de quiebre "naturales":

| Dónde | Regla | Cambia aproximadamente en |
|---|---|---|
| Inicio, 3 columnas | `flex: 1 1 220px` + `999 1 520px` + `1 1 280px` + gaps | Las 3 caben desde unos 1116 px (Auditoría H15). Por debajo, "Descubre" baja; luego todo se apila **en el orden de escritorio** (el feed queda enterrado). |
| Evento, 2 columnas | `999 1 560px` + `1 1 340px` + gap 28 | ≈ 976 px; coincide con la media query de 980. |
| Mapa, mapa + lista | `999 1 560px` + `1 1 380px` + gap 24 | ≈ 1012 px. |
| Registro, 2 columnas | `1 1 340px` + `1.3 1 420px` + gap 24 | ≈ 832 px. |
| Rejillas de tarjetas | Con `repeat(auto-fill, …)`: `minmax(250px, 1fr)` (eventos de Bienvenida), `minmax(260px, 1fr)` (Agenda), `minmax(210px, 1fr)` (próximos planes de Perfil), `minmax(200px, 1fr)` (planes parecidos de Evento, recuerdos de Perfil y selector de amigos de la ventana del Chat), `minmax(140px, 1fr)` (medios de pago). Con `repeat(auto-fit, …)`: `minmax(240px, 1fr)` ("Cómo funciona"), `minmax(170px, 1fr)` (datos clave de Evento), `minmax(220px, 1fr)` (políticas "Lo que debes saber"). Fijas: `repeat(3, minmax(0, 1fr))` (recuerdos de ediciones pasadas de Evento, siempre 3), `repeat(4, …)` (pasos del checkout), `repeat(2, …)` ("¿Para quién?", tipo de persona, datos de la boleta), `repeat(3, …)` (estadísticas de Inicio) | Medido: a 1280 px, 4 columnas en Bienvenida y Agenda, 5 en Perfil; a 768 px, 2 en Bienvenida y Agenda, 3 en Perfil (3+2), 4 en datos clave (4+1) y "Cómo funciona" en 2 (2+1). La Auditoría H61 pide evitar esas filas con un elemento suelto en tableta. |
| Márgenes y tamaños fluidos | `clamp(16px, 4vw, 24px)`, `clamp(22px, 5vw, 64px)`, titulares en `clamp()` | Continuo. |

#### Recomendación de breakpoints unificados (propuesta)

Cuatro puntos, alineados con los valores que ya existen:

| Token | Valor | Qué pasa por debajo / desde ahí | De dónde sale |
|---|---|---|---|
| `--bp-sm` | 520 px | Por debajo: rejillas de tarjetas a 1 columna o tarjeta compacta horizontal (Auditoría H47), buscador compacto, selector de ciudad en otra línea o como ícono (Auditoría H8). | Código base (520) |
| `--bp-md` | 768 px | Por debajo: **encabezado móvil de una fila** (56–64 px, logo, lupa y avatar) y **barra inferior** con Inicio, Agenda, Mapa, Mensajes y Perfil (Auditoría H40); feed antes de las columnas laterales (H15); bloque decorativo de Registro reducido a una franja de unos 80 px (H45); diálogo del checkout a pantalla completa (H6). | Ancho de tableta de las capturas |
| `--bp-lg` | 980 px | Desde ahí: tarjeta de compra lateral pegajosa (Evento), chat en dos paneles (hoy desde 900 px), mapa y lista lado a lado con la lista desplazable (hoy desde 1100 px; hacerlo con una rejilla de dos columnas `minmax(0,1fr) 380px`). Por debajo: barra de compra inferior y hoja inferior con los planes de la ciudad en el Mapa (H42). | Evento (980) |
| `--bp-xl` | 1180 px | Desde ahí: panel de información del chat en línea; tercera columna "Descubre" en Inicio. | Chat (1180) |

Mover el chat de 900 a 980 px y el mapa de 1100 a 980 px son **cambios propuestos**: hay que verificarlos visualmente antes de adoptarlos. Siempre agregar `prefers-reduced-motion` y probar a 320 px sin scroll horizontal (Auditoría H8) y con zoom al 200 % (H6).

---

### Reglas de redacción y contenido

#### Tono

- **Español de Colombia, tuteo**, nunca "usted": "Descubre", "Arma tu parche", "Crea tu cuenta", "Escríbele directo", "¿Ya tienes cuenta?".
- **Cercano y local:** "finde", "parche", "rumba", "plan", "pista", "¿Quién se apunta?", "¡Qué nivel!", "Yo soy de Millos, pero voy en paz.".
- **Botones en caja de oración** (solo la primera letra en mayúscula): "Crear mi cuenta gratis", "Ver la agenda sin registrarme", "Comprar boletas", "Ver todos los planes del país". Nunca Title Case.
- **Las mayúsculas se hacen con CSS** (`text-transform`), nunca escribiendo el texto en mayúsculas.
- **Signos de apertura** siempre: "¿Qué plan buscas?", "¡Listo, Camila!".
- **Sin emoji** (ver Iconografía).
- **Lenguaje de género:** el prototipo concuerda con la persona ("Activo hace 2 h" para Andrés, "Activa hace 20 min" para Sofía; "Tu amigo recibió" / "Tus amigos recibieron"). En producción, si no se conoce el género de la persona, usar una forma que no lo marque (**propuesta:** "Última vez hace 2 h").

#### Nombres y glosario

La columna "No usar" es **propuesta** de esta entrega, salvo donde se cita la Auditoría H62 o H20.

| Usar | No usar | Notas |
|---|---|---|
| "Toda Colombia" | "Todo Colombia" | Concordancia: "Colombia" es femenino. Hoy dicen **"Ver todo Colombia"** dos botones de Inicio (franja de ciudad y estado vacío) y dos del Mapa (panel y estado vacío), y "vuelve a todo Colombia" (Inicio) y "mira todo Colombia" (Mapa). Corregir a "Ver toda Colombia" (Auditoría H62). |
| "Toda Colombia" como nombre del alcance nacional | Mezclar "Todo el país", "Colombia" y "Toda Colombia" | Hoy conviven: selector y chips "Toda Colombia"; antetítulo del panel y etiqueta "Nuevo · Todo el país"; tendencias "Todo el país"; títulos "Este finde en Colombia". Definir en el glosario cuándo se usa cada uno (Auditoría H62). |
| "fulleventos" (logo, minúsculas) / "Fulleventos" (en frases) | "FullEventos", "Full Eventos" | — |
| "parche" (grupo para ir juntos), "boleta", "localidad", "finde", "plan" | "ticket", "entrada" como sinónimo de boleta, "zona" como sinónimo de localidad | **Propuesta** (no está en las fuentes). Ojo: el prototipo ya usa "entrada" en otros sentidos ("Entrada libre" como vendedor de los planes gratis, "Entrada" de la puerta en el plano, "en la entrada" en el chat) y una vez como boleta ("entrada por días", noticia destacada de Bienvenida: cambiarla a "boletas por día"). También usa "zona" para las áreas del plano ("Toca una zona del plano o de la lista para elegirla.", "Plano del lugar: elige una zona", "Zona general · de pie", "Zona preferencial · mesas compartidas"): decidir si el plano habla de zonas y la compra de localidades, o unificar. |
| "Mis parches" o "Tus parches" (uno solo) | Las dos en la misma barra | Hoy Inicio tiene "Mis parches" en el menú y "Tus parches" en la tarjeta (Auditoría H62). |
| "Mis boletas" | — | Se promete en tres textos ("Ver mis boletas", "Opcional. También lo puedes completar después desde Mis boletas.", "Pagaste {monto} con {medio}. Tus boletas ya están en Mis boletas.") y la pantalla no existe (Auditoría H20). |
| "Nuevo" con moderación | Repetir la etiqueta "Nuevo" | La Auditoría H62 señala que "Nuevo" se repite en 5 lugares del Mapa. Usarla una sola vez por pantalla. |

#### Fechas

| Formato | Ejemplo exacto | Dónde |
|---|---|---|
| Placa de fecha | "9" + "oct" (escrito en minúscula, se ve "OCT") | Tarjetas |
| Día corto + número + mes | "Vie 9 oct", "Sáb 10 oct", "Dom 11 oct", "Lun 12 oct" | Publicaciones, chat, repost, opciones del selector de evento. Plantilla: `dayName[d] + ' ' + d + ' oct'`, con `dayName = { 9: 'Vie', 10: 'Sáb', 11: 'Dom', 12: 'Lun' }`. |
| Día en "Tu semana" | "vie", "sáb", "dom" (en minúscula, se ven en mayúscula) | Inicio |
| Fecha larga | "Viernes 9 de octubre" | Evento |
| Fecha larga con año | "Viernes 9 de octubre 2026" | Boleta. **Falta "de"**: debe decir "9 de octubre de 2026". |
| Año y cercanía | "2026 · este viernes" | Evento |
| Rango | "del viernes 9 al lunes festivo 12 de octubre" | Mapa |
| Mes y año | "Sep 2026", "Ago 2026", "Jul 2026"… | Perfil (recuerdos y reseñas) |
| Separadores del chat | "Ayer", "Hoy", "Dom 4 oct", "Sáb 3 oct" (se ven en mayúscula) | Chat |
| Hora de la lista del chat | "9:41 a. m.", "Ayer", "Dom", "Sáb", "Ahora" | Chat |
| Cuenta regresiva | "Faltan 3 días" | Plan fijado |
| Tiempo relativo | "Hace 1 h · Bogotá", "Hace 3 horas", "Hace 5 horas", "Ayer", "Hace 2 días", "hace 20 min", "hace 1 h", "hace 3 h", "Activo hace 2 h", "Activa hace 20 min" | Inicio, Bienvenida, Evento, Chat. Mezcla "h" y "horas": unificar (propuesta: "hace 3 h" en listas y "Hace 3 horas" solo en noticias). |

**Calendario de ejemplo:** fin de semana del viernes 9 al lunes festivo 12 de octubre de 2026.

#### Horas

- Formato de 12 horas con "a. m." / "p. m." en minúscula, con puntos y espacios: "9:00 p. m.", "8:30 p. m.", "1:00 a. m.", "9:41 a. m.".
- **Hora canónica del evento de ejemplo:** "Puertas 8:00 p. m. · Show 9:30 p. m." (Auditoría H37: Inicio dice 9:00 p. m. y debe corregirse).
- **Detalle de maquetación (propuesta):** unir número y "p. m." con espacios de no separación (`8:00 p. m.`) o `white-space: nowrap`. A 768 px, "Show 9:30 p. m." se parte en dos renglones (Auditoría H61).

#### Precios y cifras

- **Formato:** `'$' + n.toLocaleString('es-CO')` → "$45.000", "$180.000", "$97.200". Sin espacio después de `$`, punto como separador de miles y sin decimales (`Math.round` en el checkout). El servidor debe tener ICU completo para que `es-CO` dé punto y no coma.
- **Tarjetas:** "Desde $45.000" si tiene precio; "Gratis" si vale 0. Debajo va el vendedor en gris ("TuBoleta", "Ticketmaster", "Fever", "Idartes", "Entrada libre"). Los nombres de boleteras reales deben reemplazarse por "[BOLETERA]" o rotularse como ejemplo (Auditoría H1).
- **CTA según el precio:** "Comprar" (con `aria-label` "Comprar boletas para {evento}") o "Ver plan" (con `aria-label` "Ver plan: {evento}").
- **Localidades:** "$45.000" + "por persona"; "$320.000" + "por mesa".
- **Checkout:** "{q} × {localidad} ({precio})" → "2 × General ($45.000)"; "Cargo por servicio (8%)" (se escribe "8%" sin espacio en la interfaz); "Total"; "Tú pagas 1 de {N}"; botón "Pagar {monto}" → "Pagar $97.200".
- **Subtotal de la tarjeta:** "Subtotal · 2 boletas × $45.000".
- **Corrección obligatoria (Auditoría H21):** el precio visible debe incluir el cargo por servicio o decirlo de forma explícita, con el mismo formato en todas las pantallas. La auditoría da dos opciones ("Desde $45.000 + cargo por servicio" o "Desde $48.600 con cargos"); la elección es la decisión pendiente P4.
- **Otras cifras:** miles con punto ("1.200 van", "1.150 planes"); decimales con coma ("12,4 mil seguidores", zoom "1,5×"); signo de multiplicar `×` ("2 × General", "1×"); "+18" para la edad; "+9" en el avatar de desborde; "~1 h" en "Responde en ~1 h".
- **Plurales calculados** (no escribir "plan(es)"): `n === 1 ? '1 plan' : n + ' planes'`; "1 ciudad / N ciudades"; "1 parche abierto / N parches abiertos"; "1 boleta / N boletas"; "1 mesa / N mesas"; "1 voto / N votos"; "1 mensaje sin leer / N mensajes sin leer"; "1 chat sin leer / N chats sin leer"; "Ver 1 plan más / Ver N planes más". Error conocido: Registro dice "1 elegidos" (Auditoría H45).

#### Marcadores `[ASÍ]`

Todo dato que el negocio debe llenar va **entre corchetes y en mayúsculas**, y **no puede publicarse así**:

- Datos del evento: "[NOMBRE DE LA ORQUESTA]", "[NÚMERO DE MÚSICOS]", "[NOMBRE DEL PROFESOR O ACADEMIA]", "[NOMBRE DEL DJ]", "[HORA DE CIERRE]", "[DIRECCIÓN]", "[CONSUMO INCLUIDO]", "[CONFIRMAR DISTRIBUCIÓN CON EL ORGANIZADOR]", "[CONFIRMAR CON EL ORGANIZADOR]", "[POLÍTICA DE LA BOLETERA]".
- Comercio y pagos: "[BOLETERA]", "[PASARELA]", "[PLAZO DE RESERVA]".
- Cifras de la landing: "[N] personas", "[N] ciudades".
- Documentos legales (en caja de oración, también entre corchetes): "[Términos]", "[Política de privacidad]", "[Términos y condiciones]", "[Política de tratamiento de datos]".
- Medios sin contenido real: "[Foto real de un evento en Colombia]", "[Foto del evento]", "[Foto de portada]", "[Foto de asistente]", "[Imagen de la noticia]", "[Mapa de la ubicación]", "[Mapa]", "[QR de la boleta]", "[Foto: la pista en la edición pasada]", "[Foto: la fila del concierto pasado]", "[Foto que compartiste]", "[Foto]".
- Lo que pide la auditoría para el pie legal (H5): "[RAZÓN SOCIAL]", NIT, dirección, teléfono, correo, PQR y enlace a sic.gov.co.

Estilo visual del marcador de foto en los héroes: píldora en la esquina (`top: 20px; right: 20px`), `.72rem`, texto `rgba(255,255,255,.8)`, borde 1 px `rgba(255,255,255,.35)`, radio 999 px, `padding: 4px 10px`.

El contenido de demostración se rotula **"Contenido de ejemplo"** en `#6E6259`: `.78rem` junto al título "Noticias de la escena" (Bienvenida) y `.76rem` al final de la columna "Descubre" de Inicio (pegado al texto legal con " · ").

#### Textos legales exactos (prototipo)

- **Pie de página** (Bienvenida, Agenda, Mapa y Evento): "© 2026 Fulleventos · Colombia" y "Compra segura dentro de Fulleventos. Las boletas las emite la boletera oficial del evento o el organizador."
- **Inicio** (al final de "Descubre"): "Compra segura dentro de Fulleventos. Las boletas las emite la boletera oficial del evento o el organizador. · Contenido de ejemplo"
- Registro, Chat y Perfil **no tienen pie** (Auditoría H5 pide acceso a lo legal en todas).
- **Registro:** "Al continuar aceptas los [Términos] y la [Política de privacidad]."
- **Evento:**
  - "+ cargo por servicio"
  - "Precios en pesos colombianos. El cargo por servicio lo ves antes de pagar."
  - "Pago seguro · Boleta oficial emitida por [BOLETERA]. Compras sin salir de Fulleventos."
  - "Campos seguros de [PASARELA] — tus datos de tarjeta no pasan por Fulleventos" (único guion largo `—` del producto)
  - "**Acepto términos y política de datos.** Leí los [Términos y condiciones] de la compra y la [Política de tratamiento de datos] de Fulleventos y [BOLETERA]."
  - "Tu pago se procesa por API con [BOLETERA] o con la pasarela de Fulleventos ([PASARELA]). No sales de Fulleventos."
  - "Emitida por [BOLETERA] · Un ingreso por persona · Presenta tu documento"
- **Texto descartado** del código base (no usar): "Las boletas se compran en las boleteras oficiales. Fulleventos no vende entradas."
- **Correcciones obligatorias de la auditoría:**
  - H5: pie legal completo en todas las pantallas y bloque "Vendido por [ ] · NIT [ ] · Organiza [ ] · Boleta emitida por [ ]" en el pago.
  - H27: bloque de retracto y devoluciones encima de "Pagar".
  - H28: aviso de privacidad junto al documento y casillas separadas para términos y datos.
  - Un solo nombre por documento legal: la Política de tratamiento y el Aviso de privacidad son documentos distintos.

#### Puntuación y separadores

- **Punto medio con espacios ` · `** para separar datos en una línea: "Galería Café Libro · Zona T", "Vie 9 oct · 9:00 p. m. · Galería Café Libro, Zona T" (evento adjunto a una publicación de Inicio: plantilla `dayName[e.d] + ' ' + e.d + ' oct · ' + p.hour + ' · ' + e.v.split(' · ').join(', ')`, es decir, el `·` interno del lugar se cambia por coma), "12 miembros · 2 nuevos". Es el separador de todo el producto (172 apariciones del carácter `·` en el código; 169 con espacio a cada lado).
- **Comillas latinas « »** para citar títulos dentro de una frase: "Reposteaste «Noche de salsa y boleros en vivo» en tu feed.", "Laura: compartió «…»", "Usa «Ver en el mapa» para ubicar cada plan."
- **Nombres en mensajes del sistema:** "Andrés compró 2 boletas · General", "Camila creó el parche «{nombre}»", "Camila añadió a Laura y Vale".
- **Enumeraciones** con "y" antes del último ("Laura, Andrés y Vale"), calculadas con `joinNames`.
- **`aria-label`** con el mismo orden que el texto visible, sumando el dato que falta: "Bogotá, 6 planes", "Bogotá, 6 eventos", "Me gusta, 24", "Mensajes, 3 sin leer". La Auditoría H59 pide que empiecen por el texto visible ("CV, tu perfil" y no "Tu perfil").

---

### Detalles finos del sistema visual

Contradicciones entre pantallas, riesgos y cosas fáciles de perder al implementar.

1. **"Últimas 12" no cumple contraste cuando Preferencial está elegida.** En la tarjeta de compra y en el paso 1 del checkout, el texto de existencias va en `#C23A24` (`.74rem` / `.7rem`, peso 700) sobre el tinte de la opción elegida. Para Preferencial ese tinte es `#E3E5FB` y da **4,30:1** (medido en Chromium: `rgb(194,58,36)` sobre `rgb(227,229,251)`, 11,84 px). No está en la auditoría. Solución: oscurecer el texto (por ejemplo, la insignia blanca sobre `#C23A24` que ya usa la lista de localidades) o aclarar el tinte.
2. **El rojo de la decisión 2.4.** El documento dice que blanco sobre `#D9452F` da "unos 4,0:1"; el valor exacto es 4,34:1. La regla se mantiene.
3. **Dos tamaños de logo:** 1,6 rem (Bienvenida, Registro) y 1,55 rem (las demás). Unificar en el componente de encabezado (Auditoría H41).
4. **Dos tamaños de texto base:** 16 px en las pantallas públicas y 15 px en las de sesión. Solo afecta al texto que hereda. Decidir si se mantiene (más denso dentro de la app) o se unifica en 16 px.
5. **Campos con letra menor de 16 px.** Los buscadores, los compositores, el campo del muro de Evento, el textarea del repost y los campos de la ventana del chat usan `.95rem` (15,2 px) o `.9rem` (14,4 px); los selectores de ciudad del encabezado y el select de evento de la ventana del chat, `.9rem`. En Safari de iPhone, un campo con menos de 16 px hace zoom automático al enfocarlo. En producción, usar 16 px en los campos en celular.
6. **Bordes de campo distintos:** `#D9CEC3` en Registro y checkout; `#EAE1D8` en Inicio, Agenda y Chat. Ninguno llega a 3:1. Unificar (Auditoría H52 propone `#857870`).
7. **Fondos de campo distintos:** `#FBF7F3` en Registro, compositores, pago y ventana del chat; `#FFFFFF` en los datos del checkout y en el muro de Evento.
8. **Fondo de ventanas distinto:** el diálogo del checkout es crema (`#FBF7F3`, con pie blanco); las ventanas de Agenda y Chat son blancas. Mantenerlo si es intencional (el checkout se siente como una "página" lateral) o unificar.
9. **Tres estilos de deshabilitado** (opacidad .45 en Evento, .4 en Mapa, colores propios en Chat y Registro) y Registro con cursor de mano en un botón deshabilitado.
10. **Dos interruptores distintos** (Evento 46 × 28 con pista roja y sin animación; Chat 44 × 26 con pista tinta y 160 ms).
11. **Foco inconsistente:** 3 pantallas con contorno de marca y 5 con el anillo del navegador; 13 campos sin indicador (Auditoría H51). Además, el contorno rojo sobre bloques `#17120F` da 3,47:1: usar amarillo, como ya hace el Mapa.
12. **El hover global pinta de rojo las iniciales de los avatares enlazados.** Limitarlo al texto.
13. **Los enlaces subrayados con borde no cambian el subrayado al pasar el mouse** (el código base sí lo hacía con `.more:hover`).
14. **El corazón tiene dos significados:** "Guardar" en Bienvenida, Agenda y Mapa, y "Me gusta" en Inicio y el chat; en Inicio "Guardar" es un marcador. La Auditoría H41 pide el marcador para guardar en todo el producto.
15. **Íconos duplicados con trazados distintos:** dos mapas plegados, dos íconos de compartir, dos boletas, dos íconos de personas y dos celulares. Unificar en una sola librería de íconos.
16. **El carácter `✓` en Registro** es texto, no SVG (única excepción a la regla de íconos).
17. **Archivo 700 no está cargada.** Los números de "Tu semana" (Inicio) son `<b>` en Archivo sin peso y se ven en 800. Declarar el peso.
18. **Estrellas de la reseña en Inicio** (`#E0A21B`): 2,25:1 sobre blanco. Perfil muestra la calificación como texto "4 de 5" en `#8A5A00` (5,93:1). Unificar el token y mostrar el número junto a las estrellas.
19. **Dos estilos de h2 de sección:** en caja mixta (Bienvenida "Planes mejores, con tu gente", Mapa "Ciudades con más planes") y en mayúsculas (todo Evento, bloques oscuros de Bienvenida, "3 planes confirmados"). Es un patrón: las mayúsculas van en bloques oscuros y en la página de evento. Mantenerlo y documentarlo en el componente de título.
20. **`clamp(1.8rem, 3.6vw, 2.8rem)` y `clamp(1.9rem, 3.6vw, 2.8rem)`** solo se diferencian en el mínimo (28,8 frente a 30,4 px). Se pueden unificar en un solo token.
21. **Placas de fecha con 6 variantes** de tamaño (número de 1 a 1,3 rem; "oct" de .58 a .66 rem; ancho mínimo de 32 a 46 px; radio 8 a 10 px sobre foto). Medidas: Bienvenida y Agenda `min-width: 46px`, `top/left: 12px`; Inicio, Perfil y planes parecidos `44px`, `10–12px`; tarjeta del chat `42px`; plan fijado `34px`, radio 9 px, `padding: 4px 7px 3px`; Mapa `32px`, radio 8 px, `padding: 4px 6px 3px`, `top/left: 6px`. La de los datos clave de Evento es distinta: caja fija de 46 × 46 px, sin fondo blanco, con borde 1 px `#EAE1D8` y radio 12 px. Al crear el componente, definir tres tamaños (grande para tarjetas, mediano para listas, pequeño para miniaturas) en lugar de seis.
22. **Placeholder de foto con 55 % o 58 %** según la pantalla, sin razón funcional.
23. **El mapa usa `z-index: 70` en el encabezado** solo por los pines; con `isolation: isolate` en el mapa se evita.
24. **Encabezado fijo y anclas:** los atajos de Evento usan `top: 69px` y las secciones `scroll-margin-top: 140px`, valores ligados al alto actual del encabezado. Si el encabezado cambia (Auditoría H40/H41), recalcularlos o usar una variable `--header-h`.
25. **Sin `text-wrap: balance` ni `tabular-nums`** en el prototipo, aunque el código base los tenía. Recuperarlos.
26. **Barras de scroll de las filas de chips:** el prototipo deja la barra del sistema (con `padding-bottom` de 4–6 px para dejarle espacio); el código base la ocultaba (`scrollbar-width: none` y `::-webkit-scrollbar { display: none; }`). Si se oculta, **hay que** agregar una pista de que hay más (degradado o flechas) o dejar que la fila ocupe dos renglones (Auditoría H61).
27. **El amarillo y el lima no sirven solos sobre fondos claros** (1,37:1 y 1,50:1 contra blanco). Siempre llevan texto tinta encima o un borde tinta.
28. **`#D9452F` sí aparece fuera del logo**, pero solo como color decorativo (anillo de historias y placeholders). No es una violación de la regla, pero conviene que el token tenga un nombre que lo deje claro (`--brand-logo`).
29. **Viewport.** Ninguna pantalla declara `<meta name="viewport" content="width=device-width, initial-scale=1">`; todo lo responsive descrito aquí solo funciona en un celular real si se agrega (Auditoría H35).
30. **Hover del rojo de acción pendiente.** Si se recuperan los hovers del código base, el `#BF3923` original no se distinguiría de `#C23A24`. Elegir un valor más oscuro (candidato de la paleta: `#B5372B`) antes de implementar.
31. **Campos sin color de texto.** Los 3 campos de Registro, el compositor de Inicio ("¿Qué plan tienes, Camila? Etiqueta un evento con @"), el campo del muro de Evento ("Pregunta o comenta algo del evento") y el textarea del repost (Agenda) no declaran `color`, así que el texto escrito sale en el negro del navegador (`#000000`, medido en Chromium) y no en `#17120F`. Los demás campos declaran `color: #17120F`. En producción, todos los campos en `#17120F`.
32. **Pines del mini-mapa de Bienvenida (Auditoría H60).** Miden `clamp(20px, 6.5cqw, 26px)` y a 390 px cinco pines se enciman (Santa Marta, Barranquilla y Cartagena; Bogotá con Villavicencio). Si cada pin va a abrir su propia ciudad: tamaño mínimo de 24 a 28 px y agrupar la costa en un pin "Costa Caribe · 3". Si no, convertir todo el mini-mapa en un solo enlace.
