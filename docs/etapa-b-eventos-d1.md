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

## Mientras tanto

- Se puede activar la etapa A con los eventos actuales o los primeros cientos.
- Conviene empezar ya a pedirle a Gemini el formato `fulleventos_event_images.jsonl` (docs/gemini-eventos-imagenes.md) y correr `adaptar`: los eventos nuevos se acumulan en la cola sin tocar producción.
- No hay que editar `eventos.ts` a mano para meter eventos de Gemini.
