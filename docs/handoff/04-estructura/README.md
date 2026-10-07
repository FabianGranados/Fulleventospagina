[← Índice del handoff](../README.md)

## 4. Estructura de la página, sección por sección

### 4.1 Mapa de pantallas, rutas y flujos

| # | Pantalla | Archivo del prototipo | Ruta propuesta | Quién la ve |
|---|---|---|---|---|
| 1 | Bienvenida: landing pública y marketplace nacional | `Bienvenida.dc.html` | `/` | Visitante (y usuario con sesión) |
| 2 | Registro en 3 pasos | `Registro.dc.html` | `/registro` | Visitante |
| 3 | Inicio: feed social | `Main.dc.html` | `/inicio` | Con sesión |
| 4 | Agenda: marketplace con repost | `Agenda.dc.html` | `/agenda` (con filtros en la URL: `?ciudad=medellin&categoria=rumba&fecha=finde`) | Con sesión; falta su versión pública (H33) |
| 5 | Mapa de eventos | `Mapa.dc.html` | `/mapa` (`?ciudad=…`) | Con sesión; recomendable también público |
| 6 | Evento con compra | `Evento.dc.html` | `/evento/:ciudad/:slug` (indexable, con Open Graph y schema.org/Event, H34) | Público para ver; la compra pide sesión |
| 7 | Mensajes (chat) | `Chat.dc.html` | `/mensajes` y `/mensajes/:conversacion` | Con sesión |
| 8 | Perfil | `Perfil.dc.html` | `/perfil/:usuario` (el propio: `/yo`, H46) | Con sesión |

**No diseñadas pero necesarias** (ver auditoría): iniciar sesión y recuperar cuenta (H12); "Mis boletas" (H20); estados de pago pendiente, rechazado, reserva vencida, agotado, carga y error (H17); variantes del evento "Gratis" y "Comprar en [BOLETERA]" (H1); notificaciones (H54); reportar y bloquear (H9); panel de organizadores (H14); páginas legales (H5, H27, H28).

**Flujos principales:**

1. **Descubrir sin cuenta:** Bienvenida → "Ver la agenda sin registrarme" o filtros → tarjeta de evento → Evento (público) → "Comprar boletas" → pide iniciar sesión o registrarse → vuelve al checkout.
2. **Registrarse:** Bienvenida → "Crear cuenta" / "Crear mi cuenta gratis" / "Continuar con Google" / "Continuar con mi celular" → Registro, paso 1 Tu cuenta → paso 2 Tus gustos (mínimo 3) → paso 3 Tu gente → "Ir a mi feed" → Inicio.
3. **Decidir con amigos:** Inicio → publicación con evento → "Voy" / "Unirme al parche" → Evento → Parches → "Unirme".
4. **Repostear:** Agenda → "Repostear" → ventana (comentario + dónde compartir) → "Repostear" → aviso "Ver en mi feed" → Inicio.
5. **Explorar el país:** Mapa → tocar una ciudad (zoom + lista) → tarjeta → Evento.
6. **Comprar para el parche:** Evento → elegir zona en el plano o en la tarjeta → cantidad → "Comprar boletas" → paso 1 "Para mi parche" + "Dividir el pago" → paso 2 datos → paso 3 medio de pago + términos → "Pagar $X" → paso 4 boleta con QR → "Avisar a mi parche" → Chat del parche (los amigos ven su enlace o solicitud de pago).
7. **Coordinar:** Chat → parche → plan fijado ("Comprar mi boleta") / encuesta / compartir evento → panel de miembros (quién tiene boleta).

**Navegación global con sesión** (la canónica debe ser **una sola**, H41): logo → Inicio · búsqueda + selector de ciudad "Toda Colombia" · íconos Inicio, Agenda, Mapa, Mensajes (con insignia de no leídos), Notificaciones · botón "Crear evento" · avatar → Perfil. En celular, la auditoría recomienda una **barra inferior** con estos destinos (H40).


### 4.2 Datos compartidos entre pantallas

Estos datos de ejemplo se repiten en Bienvenida, Agenda, Mapa, Main, Evento y Chat. En producción vienen del backend, pero **sirven como datos semilla** y como referencia del formato. Fin de semana de ejemplo: del viernes 9 al lunes festivo 12 de octubre de 2026.

**Ciudades** (posición del pin en % del recuadro del mapa; `ox`/`oy` = desplazamiento en px de la etiqueta para evitar choques; `lab` = lado de la etiqueta):

| id | Ciudad | left % | top % | ox | oy | Etiqueta | Eventos |
|---|---|---|---|---|---|---|---|
| bogota | Bogotá | 41.8 | 47.4 | 0 | 0 | right | 6 |
| medellin | Medellín | 30.2 | 38.6 | 0 | 0 | left | 3 |
| cali | Cali | 22.8 | 54.6 | 0 | 0 | below | 2 |
| barranquilla | Barranquilla | 36.2 | 11.7 | 0 | 0 | above | 1 |
| cartagena | Cartagena | 30.9 | 14.9 | -38 | 18 | below | 1 |
| santamarta | Santa Marta | 40.8 | 10.1 | 46 | -20 | right | 1 |
| bucaramanga | Bucaramanga | 49.1 | 33.6 | 0 | 0 | right | 1 |
| pereira | Pereira | 29.3 | 46.8 | 0 | 0 | left | 1 |
| villavicencio | Villavicencio | 45.2 | 50.6 | 28 | 30 | right | 1 |
| pasto | Pasto | 17.1 | 67.4 | 0 | 0 | below | 1 |
| leticia | Leticia | 73.5 | 97 | 0 | 0 | right | 1 |

**Eventos** (precio en COP; 0 = "Gratis"; `bg1`/`bg2` = colores del marcador de foto):

| id | Evento | Categoría | Etiquetas | Ciudad | Día | Lugar | Precio | Vende | bg1 | bg2 |
|---|---|---|---|---|---|---|---|---|---|---|
| e1 | Noche de salsa y boleros en vivo | Rumba | rumba | Bogotá | Vie 9 oct | Galería Café Libro · Zona T | $45.000 | TuBoleta | `#E8A04F` | `#B5372B` |
| e2 | Festival de jazz al parque | Conciertos | conciertos, gratis | Bogotá | Sáb 10 oct | Parque El Country · Usaquén | Gratis | Idartes | `#4F6DD8` | `#1E2550` |
| e3 | Rock en el Movistar Arena | Conciertos | conciertos | Bogotá | Sáb 10 oct | Movistar Arena · Salitre | $180.000 | TuBoleta | `#D9452F` | `#2B0F12` |
| e4 | Santa Fe vs. Millonarios | Deporte | deporte | Bogotá | Dom 11 oct | Estadio El Campín · Teusaquillo | $60.000 | Ticketmaster | `#C4302B` | `#1F3A8A` |
| e5 | Stand-up: risas de domingo | Arte y teatro | teatro | Bogotá | Dom 11 oct | Teatro Libre · Chapinero | $55.000 | TuBoleta | `#EE93BC` | `#5A2340` |
| e6 | Mercado gastronómico de las Américas | Comida | comida, gratis | Bogotá | Sáb 10 oct | Plaza de los Artesanos | Gratis | Entrada libre | `#F6DC6A` | `#C46A2B` |
| e7 | Noche de reguetón en Provenza | Rumba | rumba | Medellín | Vie 9 oct | Barrio Provenza · El Poblado | $50.000 | Fever | `#6B3FA0` | `#0E0A1A` |
| e8 | Atlético Nacional vs. Junior | Deporte | deporte | Medellín | Lun 12 oct (festivo) | Estadio Atanasio Girardot | $70.000 | Ticketmaster | `#3E9B63` | `#0F2A1C` |
| e9 | Milonga en Manrique | Rumba | rumba | Medellín | Sáb 10 oct | Casa del tango · Manrique | $25.000 | TuBoleta | `#B88A5A` | `#3A2414` |
| e10 | Viejoteca de salsa caleña | Rumba | rumba | Cali | Sáb 10 oct | Juanchito | $40.000 | TuBoleta | `#F3B27E` | `#8A2E1F` |
| e11 | Concierto de músicas del Pacífico | Conciertos | conciertos | Cali | Dom 11 oct | Teatro Municipal | $35.000 | TuBoleta | `#8FD3D0` | `#12343A` |
| e12 | Vallenato en el Gran Malecón | Conciertos | conciertos, gratis | Barranquilla | Sáb 10 oct | Gran Malecón del Río | Gratis | Entrada libre | `#F6DC6A` | `#1E5A7A` |
| e13 | Noche de champeta en Getsemaní | Rumba | rumba | Cartagena | Vie 9 oct | Plaza de la Trinidad · Getsemaní | $30.000 | Fever | `#EE93BC` | `#4A1A3A` |
| e14 | Atardecer electrónico en la playa | Rumba | rumba | Santa Marta | Sáb 10 oct | Playa El Rodadero | $90.000 | Fever | `#F3B27E` | `#1E2550` |
| e15 | Festival de cerveza artesanal | Comida | comida | Bucaramanga | Dom 11 oct | Parque San Pío | $25.000 | TuBoleta | `#E8A04F` | `#5A3A14` |
| e16 | Noche de trova en el lago | Conciertos | conciertos, gratis | Pereira | Vie 9 oct | Parque Lago Uribe Uribe | Gratis | Entrada libre | `#A3A8F0` | `#2A2550` |
| e17 | Joropo en Los Fundadores | Conciertos | conciertos, gratis | Villavicencio | Dom 11 oct | Parque Los Fundadores | Gratis | Entrada libre | `#B9E07A` | `#2A3A14` |
| e18 | Concierto andino en la plaza | Conciertos | conciertos, gratis | Pasto | Sáb 10 oct | Plaza de Nariño | Gratis | Entrada libre | `#8FD3D0` | `#2A1F3A` |
| e19 | Música y comida en el malecón del Amazonas | Comida | comida, gratis | Leticia | Dom 11 oct | Malecón de Leticia | Gratis | Entrada libre | `#B9E07A` | `#12343A` |

> La columna "Vende" muestra nombres de boleteras reales (TuBoleta, Ticketmaster, Fever). La auditoría (H1) pide **reemplazarlos por [BOLETERA] o rotularlos como ejemplo** mientras no haya un acuerdo comercial, y la página de Evento ya usa [BOLETERA].


### Pantallas


- [4.3 Bienvenida](01-bienvenida.md)

- [4.4 Registro](02-registro.md)

- [4.5 Inicio (feed)](03-inicio.md)

- [4.6 Agenda](04-agenda.md)

- [4.7 Mapa](05-mapa.md)

- [4.8 Evento y compra](06-evento.md)

- [4.9 Mensajes (chat)](07-mensajes.md)

- [4.10 Perfil](08-perfil.md)
