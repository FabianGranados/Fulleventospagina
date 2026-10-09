# Fulleventos

Red social de eventos para toda Colombia: descubrir planes (agenda y mapa), ver a qué va tu gente, armar "parches" (grupos para ir juntos a un evento), chatear y comprar la boleta dentro de la página.

## Estado del repositorio

La implementación está en marcha en `src/` (ver "Stack"). La Bienvenida se construye por secciones; la primera es el héroe. El diseño y la documentación de referencia son:

| Ruta | Qué es |
|---|---|
| `src/` | Código de producción (Astro). `styles/tokens.css` tiene los tokens de la sección 3 del handoff; `styles/base.css`, el reseteo, el foco global y el contenedor; `components/ui/` las piezas compartidas; `components/<pantalla>/` las de cada pantalla. |
| `docs/handoff/README.md` | **Fuente de verdad para implementar.** Índice del handoff: objetivo, decisiones, sistema visual, estructura de las 8 pantallas, responsive, estados, componentes y detalles finos. |
| `docs/auditoria-2026-10-07.md` | Auditoría del prototipo (hallazgos H1–H62) con plan de acción. |
| `docs/handoff-inventario-estilos.md` | Inventario automático de colores, tamaños, radios, sombras y breakpoints. |
| `diseno/prototipo/*.dc.html` | Prototipo de las 8 pantallas (formato Design Components). Es especificación, **no código para copiar**. |
| `diseno/capturas/*.jpg` | Capturas reales de cada pantalla a 390, 768 y 1280 px, más flujos (compra, chat, mapa, repost). |
| `diseno/referencia/preview-demo.html` | Código base original del cliente. La sección 7 del handoff dice qué se reutiliza. |
| `.claude/agents/auditor-web.md` | Agente auditor de código y aplicaciones web. |

## Antes de implementar algo

1. Lee `docs/handoff/README.md` y luego las secciones 1, 2 y 3.
2. Para cada pantalla, lee su sección 4 (estructura y textos), 5 (responsive), 6 (estados) y 8 (detalles finos y **correcciones obligatorias de la auditoría**). La sección 7 indica qué componentes reutilizar y cuáles crear.
3. **Orden de autoridad** si algo no coincide: handoff > correcciones obligatorias de la auditoría > prototipo y capturas. Cuando el prototipo y la auditoría se contradicen, se implementa lo que pide la auditoría.
4. **El stack ya está definido** (ver "Stack"). No instales dependencias nuevas sin preguntar.

## Stack

Decidido por el cliente el 7 de octubre de 2026.

- **Astro** (`astro`) con páginas generadas en el servidor o prerenderizadas. Así las páginas de evento son indexables y compartibles (H34) y se envía muy poco JavaScript (H57). La interactividad va en scripts pequeños o islas, solo donde haga falta (filtros, búsqueda).
- **Hosting en Cloudflare** con `@astrojs/cloudflare`. El adaptador compila para Cloudflare Workers con archivos estáticos y trae `wrangler` como dependencia par.
- **Estilos:** CSS con variables, como el código base (`diseno/referencia/preview-demo.html`). Nada de Tailwind ni CSS-in-JS. Los tokens globales van en `src/styles/tokens.css` y los estilos de cada componente, con alcance, dentro del `.astro`.
  - Para estilizar un componente hijo desde el padre, usa `.padre :global(.clase)`: en Astro 7 el alcance no pasa por la prop `class`.
- **Nombres de tokens:** los de la sección 3 del handoff. `--brand` = `#C23A24` (acción) y `--brand-logo` = `#D9452F` (solo el logo). La sección 7 usa otros nombres (`--brand` para el logo y `--action`); manda la sección 3.
- **Pruebas:** `axe-core` (dependencia de desarrollo) con Playwright, que ya está en el entorno. Hay que medir a 390, 768 y 1280 px y comprobar que no hay scroll horizontal a 320 px.
- **Comandos:** `npm run dev`, `npm run build` (sale en `dist/`) y `npm run preview`.
- **Prueba automática:** `npm test` compila y corre `tests/pantallas.spec.ts`, que descubre solo todas las páginas de `dist/client` y revisa que no haya scroll horizontal a 320, 390, 768 y 1280 px y que axe no encuentre violaciones a 390 y 1280 px. Hace una pasada sin sesión (las páginas que piden sesión deben llevar a `/entrar`) y otra con la sesión de demostración (`RUTAS_CON_SESION`). Toda pantalla nueva debe pasarla. Para correrla en paralelo con otra copia del proyecto, usa un puerto propio: `PUERTO_PRUEBAS=4510 npm test`.

## Piezas compartidas (no duplicar)

- `layouts/Base.astro`: `titulo`, `descripcion`, `tamanoBase` (16 en pantallas públicas, 15 en las de sesión) y `requiereSesion` (Inicio, Mensajes, `/yo`, `/perfil/*` y `/crear-evento`: sin sesión llevan a `/entrar?volver=<ruta>`).
- Sesión de demostración (decisión 2.24, H33):
  - `lib/sesion.ts`: `haySesion()`, `iniciarSesion()`, `cerrarSesion()`, `rutaVolver()` (solo rutas internas) y `conVolver()`; clave `fe-sesion-demo` en `localStorage`, siempre con `try/catch`.
  - `<html data-sesion="no|si">` lo fija un script temprano de Base. Clases globales `solo-sesion` y `solo-visitante` (en `styles/base.css`) para mostrar una u otra versión. Evento, Agenda, Mapa, Noticias y Bienvenida renderizan los dos encabezados con esas clases.
  - `components/ui/VentanaCuenta.astro`: ventana "Crea tu cuenta para {acción}" (una por página, en hoja). Sin sesión, todo control con `data-requiere-cuenta="para …"` la abre en vez de ejecutarse. Con `data-retomar="<clave>"` el `volver` lleva `?accion=<clave>` y, al volver con sesión, se lleva el foco al control; si además tiene `data-retomar-aviso` (solo acciones simples: Voy, Me interesa, Ya tengo boleta, Guardar) se ejecuta y se anuncia (decisión 2.27).
  - Los botones con estado de la usuaria salen del servidor como los ve el visitante; con sesión, el script de la página aplica el estado de Camila. No dejes nombres de amigos ni datos de Camila fuera de `solo-sesion` en las páginas públicas.
- `components/layout/EncabezadoVisitante.astro` (N2) y `EncabezadoApp.astro` (N1, variantes `completo` y `detalle`, con `activa` y `noLeidos`; `activa="yo"` marca el avatar en Mi perfil), más `Pie.astro`. Por debajo de 768 px `EncabezadoApp` es una sola fila (decisión 2.27): logo, lupa que despliega el buscador, "+" ("Publicar") y avatar, o flecha "Volver", logo y avatar en las de detalle; sus íconos de secciones se ocultan.
- `components/layout/BarraNavegacion.astro` (N70, decisión 2.27): barra inferior de 5 pestañas (Inicio, Explorar, Noticias, Mensajes, Tú), solo con sesión y por debajo de 768 px. Prop `activa` (`inicio`, `explorar`, `noticias`, `mensajes` o `tu`) y `noLeidos`. Va en toda página con `EncabezadoApp` (con `class="solo-sesion"` en las públicas). Define `--espacio-barra-nav` (alto + área segura) para el `padding-bottom` del `body` y para apilar encima otras barras fijas; no se muestra en la conversación de chat a pantalla completa.
- `components/ui/`:
  - `Logo` (imagen de la marca; `fondo="claro"` u `"oscuro"`; archivos en `src/assets/marca/`, favicon e íconos en `public/`);
  - `Icono` (agregar íconos ahí, con el trazo exacto del prototipo; los del perfil, decisión 2.29: `rueda`, `salir`, `lapiz`, `cambiarCuenta`, `personaMas`, `ayuda`, `siguiente`, `bandera` y `hoja`);
  - `Avatar`, `PilaAvatares`, `Etiqueta`, `Titular`, `Boton`, `EnlaceSubrayado` y `EncabezadoSeccion`;
  - `Modal` (N68, con `<dialog>`; se abre con `data-abrir-modal="id"`; formas `centrada`, `lateral` y `hoja`: por debajo de 520 px pegada abajo a todo el ancho, en pantallas grandes centrada);
  - `EstadoVacio` (ícono, texto y acción opcional; decisión 2.29).
- `components/eventos/TarjetaEvento.astro` (N15, variante pública), `components/eventos/VentanaRepost.astro` (N16, Agenda y Mapa) y `components/eventos/BotonBoletera.astro` ("Comprar en {vende} ↗" hacia la boletera; inactivo con nota de demostración si el evento no tiene `urlVenta`).
- Publicaciones sobre un evento (decisión 2.26): `components/publicaciones/TarjetaPublicacion.astro` es la plantilla única de la tarjeta (una vez por página; Inicio, Evento y `/crear-evento`). `lib/publicaciones.ts` la llena (`crearTarjeta`) y pinta cada `[data-publicaciones-demo]` (`data-evento`, `data-nivel`). También guarda en el demo con la clave `fe-publicaciones-demo` de `localStorage`, siempre con `try/catch`. Tiene además `rutaPublicar(evento)`. `PublicacionesEvento.astro` es la sección de los eventos sin muro. Los pasos de `/crear-evento` están en `components/crear-evento/` (`flujo.ts` para la validación y el cambio de paso). `registro/Campo.astro` acepta además `textarea`, `time`, `url` y `ayuda`.
- Perfil (decisión 2.29), en `components/perfil/`: `VistaPerfil` (la usan `/yo` y `/perfil/:usuario`), `CabeceraPerfil`, `VentanaAjustes` (rueda de ajustes, Modal `id="ajustes"`, con las sub-vistas "Cambiar de cuenta" y la confirmación de cerrar sesión; `/yo#ajustes` la abre), `VentanaOpcionesPerfil` (hoja "Opciones" del perfil ajeno, `id="opciones-perfil"`), `ListaOpciones` + `AvisoHoja` (filas de 52 px con "Próximamente" anunciado), `FilaPlan` (plan compacto de celular), `FilaParche`, `TarjetaPlan`, `Pestanas` (con conteo) y `BotonSeguir` (clave `fe-seguidos-demo`). Las cifras del perfil (planes, ciudades, parches, seguidores, siguiendo) salen solo de `cifrasPerfil(id)` en `data/perfil.ts`, también en Inicio: no las escribas fijas. Las páginas que no existen caen en `src/pages/404.astro`.
- `src/config.ts`: interruptor `VENTA_PROPIA` (decisión 2.22). En `false` (primer lanzamiento) Fulleventos no vende boletas y no se renderiza ni carga la compra propia (VentanaCompra, BoletaDigital, Cantidad, `compra.ts`, "Mis boletas", pago dividido); en `true` vuelve la compra de la fase 2.
- Datos semilla en `src/data/`: `ciudades`, `eventos` (con `conteoCiudad`), `noticias` (solo la lista cerrada de temas: las noticias están en la colección), `personas` (la usuaria del demo es Camila Vargas) `demo` (`HOY_DEMO`, el único "hoy" del demo), `parches` (miembros, cupos y quién tiene boleta) y `asistencia` (a qué va la usuaria del demo, sus boletas y sus amigos). La hora de cada evento está en `eventos.ts`: no la copies en otros archivos (H37). Cada pantalla tiene además su propio archivo de datos (`agenda`, `mapa`, `inicio`, `evento`, `mensajes`, `perfil`, `registro`). Formatos en `src/lib/formato.ts`: `cifra`, `pesos`, `planes`, `placaFecha`, `slug`, `rutaEvento`, `normalizar` (sin tildes, para buscar), `fechaCorta` ("Vie 9 oct") y `hora12` ("20:00" → "8:00 p. m.").
- **Noticias (decisión 2.25):** colección de contenido de Astro. Cada noticia es `src/content/noticias/<slug>.md` (el nombre del archivo es la URL); el frontmatter se valida en `src/content.config.ts` y el formato está explicado para quien automatice en `src/content/noticias/LEEME.md` (fuera de la colección). Se leen solo con `src/lib/noticias.ts` (`noticiasOrdenadas`, `separarDestacada`, `rutaNoticia`, `antetitulo`, `eventosDe`, `relacionadas`…) y se pintan con `components/noticias/TarjetaNoticia.astro`. No vuelvas a poner noticias en archivos `.ts`.
- Rutas: `/`, `/registro`, `/entrar` (diseño provisional, H12), `/inicio`, `/agenda`, `/mapa`, `/evento/:ciudad/:slug`, `/noticias`, `/noticias/:slug`, `/mensajes`, `/perfil/:usuario`, `/yo` y `/crear-evento` (botón "Publicar" del encabezado: evento nuevo o publicación sobre un evento; `?modo=nuevo|publicacion&evento=<id>`).

## Reglas que no se negocian

- **Textos:** los del handoff son literales; se copian tal cual. Los marcadores `[ASÍ]` (NIT, pasarela, boletera, nombre de la orquesta…) nunca se publican con corchetes: se pide el dato real al usuario.
- **Idioma y formato:** español de Colombia con tuteo. Precios con `toLocaleString('es-CO')` → "$45.000" o "Gratis". Horas como "8:00 p. m.". Siempre "Toda Colombia" (no "Todo Colombia").
- **Color:**
  - `#D9452F` solo para el logo.
  - Botones e insignias con texto blanco: `#C23A24`, por contraste.
  - Tokens y valores exactos en la sección 3 del handoff.
- **Accesibilidad WCAG 2.2 AA:**
  - etiqueta `viewport` en todas las páginas;
  - foco visible en todo lo interactivo;
  - modales con foco atrapado, cierre con Escape y retorno del foco;
  - `aria-pressed` en los botones que alternan;
  - formularios reales con `<label>` y errores anunciados;
  - respetar `prefers-reduced-motion`.
- **Sin emoji** en la interfaz: los íconos son SVG de trazo.
- **No inventar contenido** ni cifras presentadas como reales.
- **No mostrar marcas reales de boleteras** (TuBoleta, Ticketmaster, Fever) como vendedoras sin un acuerdo (H1).
- **Pagos:**
  - los datos de tarjeta solo se escriben en los campos tokenizados de la pasarela; nunca pasan por servidores propios;
  - la boleta se emite solo cuando el webhook de la pasarela confirma el pago;
  - los cupos y precios se calculan en el servidor;
  - en el pago dividido, cada amigo paga su parte directo a la pasarela: Fulleventos nunca guarda la plata del parche.
- **Chat:** no se abre al público sin reportar, bloquear y moderación (H9, H13).

## Decisiones pendientes

No implementes estas partes sin confirmarlas con el usuario. El detalle está en `docs/handoff/02-decisiones.md`, sección 2.12.

- **P1. Modo de compra por evento:** gratis / boletera externa / venta propia. *Primer lanzamiento: sin venta propia, la compra es en la boletera (decisión 2.22).*
- **P2. Operador de boletería** (MinCultura, PULEP).
- **P3. Pasarela de pagos.** *Queda para la fase 2: el primer lanzamiento es sin venta propia (decisión 2.22).*
- **P4. Cargo por servicio.**
- **P5. Proveedor del mapa.**
- **P6. Si el chat sale en el MVP.**
- **P7. Política de edad.**
- **P8. Datos legales reales.**
- **P9. Criterio de "organizador verificado".**

La recomendación de la auditoría es lanzar primero un MVP de descubrimiento (cuentas, agenda, mapa y compra por redirección a la boletera) y dejar la venta propia y el pago dividido para una fase posterior.

## Sobre el prototipo `.dc.html`

Es la especificación visual y de comportamiento, no una base de código:
- los estilos están en línea, pero en producción se convierten en tokens y componentes;
- el estado vive en cada pantalla y se pierde al navegar;
- los pagos, reservas, QR, chat y notificaciones son simulados;
- algunos detalles existen solo por limitaciones del lienzo de diseño (por ejemplo, evitar `<form>`, o los `span.sc-interp`) y no se copian;
- el prototipo navegable está en https://claude.ai/artifact/1G7P2YCrnkBpgtdai9aWSQ (privado del dueño).

## Al terminar una pantalla o flujo

- Compárala contra sus capturas en `diseno/capturas/` a 390, 768 y 1280 px.
- Revisa la sección 8 del handoff ("Detalles finos").
- Pide una revisión al agente `auditor-web`.

## Convenciones del repositorio

- Rama de trabajo: `rediseno-pagina` (no trabajar directo en `main`). El código React anterior quedó guardado en la rama `respaldo-react-viejo`.
- Mensajes de commit en español, describiendo el porqué del cambio.
- Comunícate con el usuario en español.

## Antes de publicar con datos reales

- Quitar `noindex` de `src/layouts/Base.astro` y `Disallow: /` de `public/robots.txt`, y configurar `site` en `astro.config.mjs` (H34).
- Reemplazar todos los marcadores `[ASÍ]` con datos reales (P8) y quitar los avisos de demostración de la compra.
