[← Índice del handoff](README.md)

## 1. Objetivo de la página y público

### Objetivo

Fulleventos es una **red social de eventos para toda Colombia**: un solo lugar para **descubrir planes**, **ver a qué van tus amigos**, **armar un "parche"** (un grupo para ir juntos a un evento) y **comprar la boleta sin salir de la página**.

Nació como un marketplace de eventos de Bogotá (el código base del cliente, `diseno/referencia/preview-demo.html`) y se convirtió en red social con alcance nacional. Combina tres capas que deben sentirse como un solo producto:

1. **Marketplace (descubrir).** Agenda nacional de eventos con filtros por ciudad, categoría y fecha, más un **mapa de Colombia** con todos los eventos.
2. **Social (decidir con tu gente).** Feed de amigos, reposts de eventos, "quién va", parches con cupos, chat individual y de grupo, perfiles con planes y recuerdos.
3. **Transaccional (ir).** Página de evento con localidades y compra en 4 pasos dentro de la página. Incluye la opción de **comprar para el parche y dividir el pago** (cada amigo paga su parte).

**Promesa de marca** (textos del producto): "Arma tu parche" · "De la rumba del viernes al concierto del sábado" · "Planes mejores, con tu gente".

### Público

El cliente no definió un perfil demográfico. Lo siguiente se **infiere del diseño y el tono** y debe validarse:

| Público | Qué necesita | Dónde está en el diseño |
|---|---|---|
| **Visitante sin cuenta** (llega por un enlace, buscador o redes) | Entender en segundos qué es Fulleventos, ver planes reales sin registrarse y decidir crear la cuenta. | Bienvenida (marketplace público + mapa), y luego Registro. |
| **Usuario con cuenta**: personas que salen a planes en Colombia (rumba, conciertos, fútbol, teatro, gastronomía, planes gratis) y deciden con amigos. Muchos eventos son **+18**. | Ver qué hay este finde en su ciudad o en otra, saber quién de su gente va, armar parche, comprar rápido con medios locales (Nequi, PSE, Daviplata, Botón Bancolombia, tarjeta) y coordinar por chat. | Inicio (feed), Agenda, Mapa, Evento con compra, Chat (Mensajes) y Perfil. |
| **Organizadores** (bares, teatros, productoras; p. ej. "Galería Café Libro") | Publicar eventos, vender boletas, responder preguntas. | Hoy solo aparecen como cuenta verificada en el chat y como tarjeta "Organiza" en el evento. **El panel de organizadores no está diseñado** (auditoría H14). |

**Tono:** español de Colombia, tuteo, cercano y "parchado": "finde", "parche", "rumba", "¿Quién se apunta?". Nunca se usa "usted".

**Contexto de uso:** el celular primero. La auditoría encontró que la experiencia móvil es la que más corrección necesita (H6, H8, H15, H40, H43). Gran parte del tráfico vendrá de enlaces compartidos por WhatsApp, así que la vista previa al compartir (Open Graph) importa (H34).

### Métricas de éxito sugeridas (no definidas por el cliente; validar)

- Visitante → cuenta creada.
- Usuarios con al menos un "Voy" o un parche por semana.
- Eventos compartidos o reposteados.
- Conversión de vista de evento → compra.
- Parches que completan cupos.
