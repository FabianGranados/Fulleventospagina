# Etapa B: eventos en D1 antes de la carga masiva

**Recomendación: adelantar la etapa B antes de cargar miles de eventos.** La etapa A (fotos en R2) sirve como está para los eventos actuales y para los primeros cientos. Por encima de eso, la forma en que el sitio recibe los eventos deja de escalar.

## Por qué (medido en la rama `imagenes-r2`, 11 de octubre de 2026)

| Punto | Hoy (19 eventos) | Con miles de eventos |
|---|---|---|
| Dónde viven los eventos | `src/data/eventos.ts`, importado por 33 archivos | Cada lote de Gemini exigiría editar código, compilar y desplegar: justo lo que se quiere evitar. |
| Agenda y Mapa | Llevan **todas** las tarjetas en el HTML y filtran en el navegador (`agenda` 125 KB y `mapa` 164 KB con 19 eventos, unos 5 a 8 KB por evento) | Con 5.000 eventos serían decenas de MB por página. |
| Páginas de evento | Prerenderizadas, una por evento (`getStaticPaths`) | Caben en el límite de archivos estáticos (20.000 en el plan Free y 100.000 en Paid, según los [límites de Workers](https://developers.cloudflare.com/workers/platform/limits/)), pero cada evento nuevo pide un despliegue. |
| Índice de fotos (etapa A) | 6 KB | Unos 1,7 MB sin comprimir con 5.000 eventos, descargados en **cada** página. Sirve hasta unos cientos de eventos. |
| Eventos nuevos de Gemini | — | El importador de la etapa A no puede asociar fotos a eventos que no existen: el adaptador los deja en `eventos-nuevos.jsonl`, la cola de esta etapa. |

## Diseño propuesto

Misma base D1 `fulleventos`, mismo Worker y sin servicios nuevos.

1. **B1 · Datos (sin tocar el sitio).** Tablas `eventos` y `fuentes_evento` y un importador `npm run eventos -- importar eventos-nuevos.jsonl` que reutiliza el adaptador. Será idempotente por `ref` y dejará todo en `pendiente_revision`, con detección de duplicados (misma ciudad y fecha, título parecido). Las fotos de esos eventos entran después por el importador que ya existe.
2. **B2 · Lectura en el servidor.** Un módulo único `src/lib/datos-eventos.ts` que lee D1 (binding en `wrangler.jsonc`) y, en desarrollo, puede usar `eventos.ts`. Evento, Agenda, Mapa y Bienvenida pasan a renderizarse bajo demanda (`prerender = false`) con filtros y paginación en el servidor (ciudad, fechas y categoría, por ejemplo 24 por página) y caché en el borde (`Cache-Control` corto más `stale-while-revalidate`). Los 19 eventos de ejemplo se migran como datos marcados `demo = 1`.
3. **B3 · Fotos en el HTML.** El servidor pone el `<img srcset>` y el `og:image` desde `imagenes_evento`, así que deja de hacer falta el índice global. `FotoEvento` sigue siendo el componente y el degradado sigue siendo el respaldo.
4. **B4 · Publicación.** Una persona aprueba los eventos (comando o, después, un panel con acceso protegido). Solo los `publicado` se muestran.

Borrador del esquema (**propuesta, no aplicada**):

```sql
CREATE TABLE eventos (
  id TEXT PRIMARY KEY,                 -- "ev_" + aleatorio; los actuales conservan e1…e19
  ref_externa TEXT UNIQUE,             -- ref de Gemini (idempotencia)
  slug TEXT NOT NULL, ciudad TEXT NOT NULL, departamento TEXT,
  titulo TEXT NOT NULL, categoria TEXT, fecha TEXT NOT NULL, fecha_fin TEXT, hora TEXT,
  lugar TEXT, direccion TEXT, gratis INTEGER, precio_desde INTEGER, moneda TEXT DEFAULT 'COP',
  organizador TEXT, url_oficial TEXT, url_venta TEXT, resumen TEXT,
  estado_evento TEXT DEFAULT 'programado',
  estado TEXT NOT NULL CHECK (estado IN ('pendiente_revision','publicado','rechazado','retirado')),
  demo INTEGER NOT NULL DEFAULT 0, bg1 TEXT, bg2 TEXT,
  procedencia TEXT, creado_en TEXT, actualizado_en TEXT,
  UNIQUE (ciudad, slug, fecha)
);
CREATE INDEX ix_eventos_listado ON eventos (estado, ciudad, fecha);
CREATE TABLE fuentes_evento (id INTEGER PRIMARY KEY, evento_id TEXT NOT NULL REFERENCES eventos(id),
  nombre TEXT, url TEXT, tipo TEXT, oficial INTEGER, consultado_en TEXT, UNIQUE (evento_id, url));
```

**Costo:** D1 en el plan gratuito de Workers permite 5 millones de filas leídas por día y 100.000 escritas por día ([precios de D1](https://developers.cloudflare.com/d1/platform/pricing/)). Con caché en el borde, las lecturas por visita son pocas. Las páginas bajo demanda sí cuentan como invocaciones del Worker: hoy el sitio sirve solo archivos estáticos. Conviene vigilar el límite de solicitudes diarias del plan del Worker.

**Riesgos:** el render en el servidor cambia cómo se generan Agenda, Mapa y Evento. Las 305 pruebas de pantallas que existen sirven de red de seguridad. La auditoría H34 pide que las páginas de evento sigan siendo indexables, y eso se mantiene con SSR.

## Estado de B1 (16 de octubre de 2026, rama `etapa-b-eventos`)

**B1 está implementado y probado solo en local.** No se ha aplicado ninguna migración en Cloudflare ni se ha desplegado nada.

| Pieza | Archivo |
|---|---|
| Migración de eventos, fuentes, alertas, imágenes candidatas, historial y las 14 categorías | `migraciones/0002_eventos.sql` |
| Municipios DIVIPOLA oficiales del DANE (1.122 entradas, 33 departamentos), generada | `migraciones/0003_divipola.sql` (`npm run divipola:sql`) |
| Lista DIVIPOLA y búsqueda por código o por nombre (sin adivinar entre homónimos) | `src/data/divipola.json`, `scripts/eventos/divipola.mjs` |
| Las 14 categorías oficiales y su equivalencia con los 6 chips actuales | `src/data/categorias-oficiales.ts` |
| Evento normalizado y reglas de validación | `scripts/eventos/evento.mjs` |
| Lectura del formato de investigación de Gemini y del formato anterior | `scripts/eventos/normalizar.mjs`, `scripts/eventos/cola.mjs` |
| Adaptador (acepta los dos formatos, varios archivos o una carpeta) | `scripts/imagenes/adaptar.mjs` |
| Importador y revisión | `scripts/eventos/importador.mjs`, `npm run eventos` |
| Pruebas (36 nuevas) | `tests/eventos/` |

### Flujo

```
carpeta de Gemini (o fulleventos_event_images.jsonl)
  └─ npm run imagenes -- adaptar <carpeta|archivos…> [--hoy AAAA-MM-DD]
       ├─ eventos-nuevos.jsonl  → npm run eventos -- importar … (--simular primero; --local por defecto)
       ├─ imagenes-importador.jsonl (fotos de eventos que ya existen en el sitio)
       └─ reporte.json (errores, rechazados en origen, correcciones, alertas por tipo)
npm run eventos -- pendientes | ver <id> | resolver <alerta> | aprobar <id> | publicar <id> | rechazar | retirar | devolver
```

### Estados y compuertas

`pendiente_revision` → `aprobado` → `publicado`, más `rechazado` y `retirado`. La base (triggers de 0002) impide:
insertar un evento que no esté pendiente, aprobar sin persona o con alertas que bloquean sin resolver, publicar algo que
no esté aprobado, cambiar el contenido de un evento aprobado o publicado sin devolverlo a revisión, y borrar uno
aprobado o publicado. El importador además rechaza aprobaciones a nombre de "agente", "Gemini" o "Claude" y no
aprueba eventos vencidos. `--forzar` exige un motivo escrito, que queda como resolución de cada alerta. Las alertas que
bloquean no se pueden borrar (solo resolver con nombre y explicación), `INSERT OR REPLACE` no puede pisar un evento
aprobado y el contenido aprobado no puede cambiar ni al pasar a publicado.

**Ojo al cambiar triggers después de aplicar 0002:** usan `IF NOT EXISTS`, así que una corrección futura necesita una
migración nueva con `DROP TRIGGER` y el `CREATE TRIGGER` corregido.

### Reglas de validación (alertas)

| Tipo | Gravedad | Cuándo |
|---|---|---|
| `vencido` | bloquea | Terminó antes de hoy (además, el importador no lo carga salvo `--incluir-vencidos`) |
| `fuente_insuficiente` | bloquea | Fuente principal en una ayuda o buscador, red social, sitio comercial ajeno o portada; o ninguna fuente útil |
| `fuente_insuficiente` | revisar | Una sola fuente, o ninguna marcada como oficial |
| `duplicado` | bloquea | Misma ref o slug en el lote; mismo municipio, fechas cruzadas y título parecido (en el lote, en D1 o en `eventos.ts`) |
| `municipio` / `categoria` | bloquea | Sin código DIVIPOLA válido (o homónimo sin departamento); categoría fuera de las 14 |
| `correccion` | bloquea | Gemini trae una corrección que no está aplicada en el evento |
| `estado_evento` | bloquea | Cancelado o finalizado |
| `fecha`, `edicion`, `url_venta`, `organizador` | revisar | Fecha provisional; año del título distinto; venta que apunta a imágenes o a la portada; la boletera figura como organizador |
| `precio` | aviso | Pago o mixto sin cifra ("Consultar precio"); precio desconocido |
| `derechos_imagen` | aviso | La imagen no tiene licencia o documento enlazado, coincidencia visual confirmada y texto alternativo |

### Precios

`gratis`, `pago`, `mixto` y `desconocido`. Ninguna cifra se inventa: pago y mixto pueden ir sin precio; gratis y
desconocido no pueden llevar cifra (la base lo valida con CHECK). El "donation" de Gemini se guarda como desconocido con
una alerta.

### DIVIPOLA

`src/data/divipola.json` es la lista oficial del DANE ("DIVIPOLA - Códigos municipios", datos.gov.co, CC BY-SA 4.0,
actualizada el 24 de enero de 2025): 1.122 entradas, que son 1.103 municipios (con Bogotá y Nuevo Belén de Bajirá),
18 áreas no municipalizadas y 1 isla, cada una con su tipo y sus coordenadas. Reemplazó a una copia anterior que no
tenía Nuevo Belén de Bajirá y escribía mal Jamundí. Para actualizarla: ver `docs/licencias-datos.md`. La migración 0003
actualiza nombres sin borrar filas.

## Estado de B2 (20 de octubre de 2026, rama `etapa-b2`, solo en local)

Nada de B2 toca Cloudflare: no hay binding en `wrangler.jsonc`, no se desplegó y no se corrió ninguna migración remota.

- **De dónde salen los eventos:** `src/lib/datos-eventos.ts` (`obtenerEventos()`) es el único lugar. Con el binding
  `DB` lee solo los eventos con `estado = 'publicado'`; sin binding (la compilación normal y la publicación actual)
  devuelve los de `src/data/eventos.ts`, como siempre. Lo usan la Bienvenida (`/`), la Agenda y la página del evento.
- **Base D1 local:** `wrangler.local.jsonc` declara el binding `DB` solo para local (nunca para desplegar ni para
  `--remote`). `npm run d1:local -- preparar` crea la base en `.wrangler/state`, aplica las migraciones y carga los
  19 eventos de ejemplo como `demo = 1`, pasando por las compuertas (entran pendientes, se aprueban con la etiqueta
  "Carga de ejemplo local" y se publican). `npm run d1:local -- <comando>` corre cualquier comando de
  `npm run eventos` (importar, pendientes, aprobar, publicar, retirar…) sobre esa misma base.
- **Ver el sitio leyendo D1:** `npm run dev:d1`, o `npm run build:d1` y `npm run preview:d1`. Con `EVENTOS_D1=local`
  la integración de `astro.config.mjs` vuelve bajo demanda `/`, `/agenda` y `/evento/[ciudad]/[slug]` (Astro solo lee
  `prerender` literal, por eso se hace con `astro:route:setup`). El aviso "getStaticPaths() ignored" es esperado en
  ese modo. Un evento retirado o sin publicar da la página 404 del sitio.
- **Los eventos de ejemplo** guardan en D1 sus datos de evento; la gente que va, los parches, los colores, quién vende
  y la hora de puertas/show se completan desde `eventos.ts` (solo para `demo = 1`). Los eventos nuevos se muestran sin
  gente, reposts ni precios inventados (`textoPrecio`: "Gratis", "Desde $…", "Consultar precio" o "Precio por
  confirmar").
- **Las 14 categorías en la interfaz (opción C):** en la portada, las 6 a 8 con más planes del finde, con su foto de
  `src/assets/categorias/` y una tarjeta "Ver todas" que abre la hoja con las 14 (ícono y conteo, siguen la ciudad).
  En la Agenda, la hoja "Categoría" tiene las 14 con ícono y conteo, y "Gratis" es un botón aparte (`aria-pressed`,
  `?gratis=1`). Los enlaces viejos `?categoria=rumba` o `?categoria=gratis` siguen funcionando.

### Entorno de pruebas en Cloudflare (preparado, sin desplegar)

- `wrangler.pruebas.jsonc`: Worker `fulleventos-pruebas` (`workers_dev`) con la base D1 `fulleventos-pruebas`
  (binding `DB`), que ya tiene las migraciones 0001–0003 y los 19 eventos de ejemplo publicados. No apunta a
  `fulleventospagina` ni a producción.
- `npm run build:pruebas` (`EVENTOS_D1=pruebas`): mismas páginas bajo demanda que el modo local, con esa config.
  Las páginas llevan `noindex, nofollow` aunque producción deje de llevarlo (`SITIO_PRUEBAS` en `Base.astro`).
- Después de `build:pruebas`, `npx wrangler deploy --dry-run` muestra lo que se subiría (usa la config redirigida
  `dist/server/wrangler.json`). Desplegar y cualquier comando `--remote` necesitan autorización.
- El adaptador agrega un binding `SESSION` (KV) sin id: al desplegar, wrangler crea ese KV solo.

### Pendiente para B3 y antes de producción

- El Mapa, Inicio, el perfil y las noticias siguen con `eventos.ts` y las 6 categorías del sitio.
- Paginación en el servidor y caché en el borde para la Agenda (hoy se pintan todos los publicados y se pagina en el
  navegador).
- Rutas por municipio (hoy un municipio que no es ciudad del sitio usa `slug(municipio)` en la URL del evento).
- La foto del evento desde `imagenes_evento` (B3).
- Binding D1 real en `wrangler.jsonc` y migraciones remotas: solo con autorización.

## Mientras tanto

- Se puede activar la etapa A con los eventos actuales o los primeros cientos.
- Conviene empezar ya a pedirle a Gemini el formato `fulleventos_event_images.jsonl` (docs/gemini-eventos-imagenes.md) y correr `adaptar`: los eventos nuevos se acumulan en la cola sin tocar producción.
- No hay que editar `eventos.ts` a mano para meter eventos de Gemini.
