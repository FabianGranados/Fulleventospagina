# Imágenes de eventos con Cloudflare R2

Fotos reales de los eventos guardadas en R2 y mostradas en todo el sitio **sin volver a desplegar**. Un importador recibe lo que encuentra Gemini Deep Research, revisa los derechos, descarga de forma segura, optimiza y publica.

Estado: **etapa A lista en la rama `imagenes-r2`, sin activar en producción.** Los eventos siguen en `src/data/eventos.ts`. Moverlos a D1 para crear eventos sin tocar código es la etapa B (ver el final).

## Cómo funciona

```
Gemini (JSONL) ──► npm run imagenes -- importar ──► valida · descarga segura · WebP 480/960/1600
                                                     │
                       Cloudflare D1 "fulleventos" ◄─┤ (registro, derechos, estado, auditoría)
                       R2 "fulleventos-imagenes"   ◄─┘ eventos/{id}/{version}-{ancho}.webp
                                                       indice/eventos-v1.json  (solo las publicadas)
                                │
         imagenes.fulleventos.com.co (dominio propio, caché de Cloudflare)
                                │
  Navegador: la página trae el degradado de siempre ─► pide UN índice ─► agrega <img srcset> encima
```

- **Sin servidor nuevo.** El sitio sigue siendo estático y el Worker no cambia. El navegador lee un índice público de R2.
- **URL inmutables.** El nombre del objeto lleva los primeros 16 caracteres del sha256 del archivo. Una foto nueva tiene una URL nueva, así que se puede guardar en caché un año y no hace falta purgar nada. Solo el índice se reemplaza (caché de 5 minutos).
- **Respaldo garantizado.** Si no hay índice, foto o conexión, o la variable está vacía, la tarjeta se ve igual que hoy, con el degradado de su evento.
- **Nada sin derechos se sube.** Lo pendiente queda solo como fila en D1: no se descarga ni se guarda en R2.

## Archivos

| Archivo | Qué hace |
|---|---|
| `src/components/eventos/FotoEvento.astro` | Marcador de la foto. Se usa en `TarjetaAfiche` (Bienvenida, Agenda, destacados, "Planes parecidos"), `TarjetaEvento`, `HeroeEvento` (detalle), `TarjetaCompacta` (Mapa), `TarjetaNoticia` y la noticia (foto del primer evento si la noticia no trae la suya), `Publicacion` (Inicio), `TarjetaPlan` y `FilaPlan` (Perfil). |
| `src/lib/fotos-eventos.ts` | Carga el índice una vez por página y pinta las fotos (`pintarFotos()` también sirve para tarjetas creadas después). Ignora las rutas que no tengan el formato del importador. |
| `src/config.ts` | `IMAGENES_URL`, que sale de `PUBLIC_IMAGENES_URL`. |
| `migraciones/0001_imagenes_evento.sql` | Tablas `imagenes_evento`, `importaciones` e `importaciones_errores`. |
| `scripts/imagenes/` | Importador: `cli.mjs`, `importador.mjs`, `red.mjs` (descarga segura), `archivo.mjs` (validación y WebP), `esquema.mjs`, `catalogo.mjs`, `almacenes.mjs` y `politica.mjs` (límites). |
| `scripts/imagenes/esquema-gemini.json` · `docs/imagenes-gemini.md` | Formato que debe entregar Gemini, con un prompt listo para usar. |
| `scripts/revisar-secretos.mjs` | Revisa que no haya credenciales en los archivos de Git. |
| `tests/fotos-eventos.spec.ts` · `tests/importador/` | Pruebas. |

Componentes que **aún no** muestran la foto, porque usan otros datos: la vista previa de `VentanaRepost`, `MosaicoRecuerdo` (recuerdos del perfil) y los adjuntos del chat. Siguen con el degradado.

## Modelo de datos (`imagenes_evento`)

Requisito → columna: identificador del evento → `evento_id` · URL pública → `url_publica` (más `variantes` en JSON) · ruta en R2 → `ruta_r2` · URL de origen → `url_origen` · fuente oficial → `fuente_nombre`, `fuente_url` y `fuente_oficial` · tipo → `tipo` · texto alternativo → `texto_alternativo` · derechos → `derechos_estado`, `licencia`, `derechos_evidencia` y `verificado_por` · fecha de verificación → `verificado_en` · estado de procesamiento → `estado` y `error` · placeholder → `placeholder`. Además guarda `sha256`, `version`, las medidas, los pesos, `credito`, `motivo_reemplazo` y las fechas.

Estados: `pendiente_revision` → (aprobar) → `publicada` (una por evento y tipo) · `lista` (subida, pero el evento ya tenía foto) · `rechazada` · `error` (se reintenta en la siguiente importación) · `retirada`.

Unicidad: (`evento_id`, `url_origen`), (`evento_id`, `sha256`) y una sola `publicada` por (`evento_id`, `tipo`). Por eso **importar dos veces el mismo archivo no duplica nada**.

## Configuración en Cloudflare (la haces tú)

Hazlo en este orden. Nada de esto toca el sitio publicado.

1. **Activar R2:** panel → *R2 Object Storage* → activar. Pide un medio de pago aunque el uso quede dentro del plan gratuito.
2. **Crear el bucket** `fulleventos-imagenes`, con ubicación automática y clase *Standard*. El plan gratuito solo cubre Standard.
3. **Dominio público:** bucket → *Settings* → *Custom Domains* → `imagenes.fulleventos.com.co`. La zona ya está en tu cuenta.
4. **Desactivar el acceso por `r2.dev`:** *Settings* → *Public Development URL* → *Disable*. Así solo se sirve por tu dominio, con caché y WAF.
5. **CORS** (lo necesita el índice, que se pide con `fetch`; las imágenes no): bucket → *Settings* → *CORS Policy*:
   ```json
   [{ "AllowedOrigins": ["https://www.fulleventos.com.co", "https://fulleventos.com.co", "http://localhost:4321"],
      "AllowedMethods": ["GET", "HEAD"], "AllowedHeaders": [], "MaxAgeSeconds": 86400 }]
   ```
6. **Caché del índice:** Cloudflare no guarda `.json` en caché por defecto. En la zona → *Caching* → *Cache Rules* → regla para `hostname eq "imagenes.fulleventos.com.co"` → *Eligible for cache*, respetando el `Cache-Control` del origen. Las imágenes `.webp` ya se guardan sin la regla.
7. **Crear la base D1** desde la carpeta del proyecto (pide iniciar sesión en el navegador):
   ```bash
   npx wrangler d1 create fulleventos
   npx wrangler d1 execute fulleventos --remote --file migraciones/0001_imagenes_evento.sql
   ```
   La migración solo crea tablas nuevas (`IF NOT EXISTS`) y se puede repetir sin riesgo.
8. **Token de API** (*Manage account* → *Account API tokens* → *Create*), con **solo** los permisos *Account · D1 · Edit* y *Account · Workers R2 Storage · Edit*, limitado a tu cuenta. Ponle fecha de vencimiento.
9. **Variables** en dos archivos que Git ignora (modelo en `.env.example`):
   - `.env.importador`: `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`, `D1_DATABASE_ID` (sale en `npx wrangler d1 list`), `R2_BUCKET` e `IMAGENES_URL_PUBLICA`.
   - `.env`: `PUBLIC_IMAGENES_URL=https://imagenes.fulleventos.com.co`.
10. **Publicar el índice vacío** con `npm run imagenes -- indice` y comprobar que `https://imagenes.fulleventos.com.co/indice/eventos-v1.json` responde.
11. **Desplegar una sola vez** el sitio con `PUBLIC_IMAGENES_URL` puesta (`npm run build` y luego tu `wrangler deploy` de siempre). Desde ahí las fotos nuevas aparecen sin desplegar.

## Uso del importador

```bash
npm run imagenes -- importar resultados-gemini.jsonl --simular   # revisa sin descargar ni guardar
npm run imagenes -- importar resultados-gemini.jsonl             # importa de verdad (Cloudflare)
npm run imagenes -- pendientes                                   # lo que espera revisión de derechos
npm run imagenes -- aprobar 12 15 --por "Óscar Fabián" --licencia "Kit de prensa" --evidencia "https://…"
npm run imagenes -- publicar 18 --motivo "Afiche final"            # publica una ya subida (lista) en lugar de la actual
npm run imagenes -- retirar e3 --motivo "El organizador pidió quitarla"
npm run imagenes -- indice                                       # vuelve a publicar el índice
```

Con `--local` todo queda en `registros/` (SQLite y una carpeta como bucket), para probar sin Cloudflare. Cada ejecución deja un registro detallado en `registros/importacion-*.jsonl` y en las tablas `importaciones` e `importaciones_errores`.

**Qué se publica solo:** solo lo que llega con `derechos.estado = "confirmado"`, fuente oficial, licencia, evidencia, fecha de verificación y, mientras `exigirRevisionHumana` sea `true`, la aprobación de una persona con `aprobar`. El importador ignora el `verificado_por` del archivo: todo lo que llega de Gemini cuenta como verificado por un agente y queda **pendiente** hasta que lo apruebes. Es a propósito, porque la IA puede equivocarse sobre los permisos o ser engañada por una página. Si una descarga falla después de aprobar, una nueva importación no deshace la aprobación.

**Reemplazos:** si el evento ya tiene foto publicada, la nueva queda como `lista` salvo que el registro traiga `"reemplazar": true` y un `motivo_reemplazo`. Una `lista` se puede publicar después reenviándola con `reemplazar` o con `publicar <id> --motivo`, sin descargarla otra vez. La anterior no se borra de R2.

## Seguridad

- **Credenciales:** solo en `.env.importador` (ignorado por Git) o en los Secrets de GitHub si algún día se automatiza. El frontend solo conoce la URL pública. `npm run revisar:secretos` revisa los archivos de Git, y `npm test` lo corre. **El repositorio es público**, así que esto importa.
- **Subidas no autorizadas:** no existe ningún endpoint público de subida. Escribir en R2 o D1 exige el token, que tiene permisos mínimos y vence.
- **SSRF:** solo `https` en puertos estándar, sin IP en la URL y sin usuario ni contraseña. Solo dominios permitidos: `dominiosPermitidos` (con subdominios) o el host exacto de la página de la fuente oficial (sin subdominios). Una redirección o un DNS bloqueados no se vuelven a intentar en cada importación. La descarga tiene un plazo total, no solo un tiempo máximo entre bytes. La IP se revisa en el mismo `lookup` de la conexión: se rechazan localhost, las redes privadas, `169.254.0.0/16` (metadatos de nube), CGNAT, multicast, IPv6 local y las IPv4 mapeadas. Cada redirección se revisa de nuevo (máximo 3).
- **Archivos:** se valida la firma real de los bytes (JPEG, PNG, WebP o AVIF; SVG, GIF y HTML se rechazan). Máximo 15 MB y 60 megapíxeles, para frenar las bombas de descompresión. Se exigen al menos 480 × 300 px, no se aceptan animaciones y se reprocesa todo con sharp, lo que quita los metadatos EXIF (GPS, cámara).
- **Índice:** el navegador solo acepta rutas `eventos/{id}/{16 hex}-{ancho}.webp` del propio dominio. Un índice alterado no puede meter URL de otros sitios.
- **Abuso y costo:** máximo 500 registros y 400 MB de descarga por ejecución, y 3 variantes por imagen. Las URL inmutables se sirven desde la caché. Opcional: una regla de *Rate limiting* del WAF para `imagenes.fulleventos.com.co`.

Ajustes en `scripts/imagenes/politica.json` (opcional). Por ejemplo, para permitir el CDN de un organizador con acuerdo:

```json
{ "dominiosPermitidos": ["cdn.organizador-oficial.com"] }
```

## Costos (verificados el 11 de octubre de 2026)

Fuentes: [precios de R2](https://developers.cloudflare.com/r2/pricing/) (página actualizada el 1 de octubre de 2026) y [precios de D1](https://developers.cloudflare.com/d1/platform/pricing/) (actualizada el 21 de abril de 2026).

| Servicio | Gratis cada mes | Después |
|---|---|---|
| R2 almacenamiento (Standard) | 10 GB-mes | US$0,015 por GB-mes |
| R2 Clase A (escrituras: `PutObject`) | 1 millón | US$4,50 por millón |
| R2 Clase B (lecturas: `GetObject`, `HeadObject`) | 10 millones | US$0,36 por millón |
| R2 salida de datos | Siempre gratis | — |
| D1, plan gratuito de Workers | 5 millones de filas leídas por día, 100.000 escritas por día, 5 GB | — |

**Estimación para Fulleventos:** cada foto ocupa unos 0,4 a 0,5 MB sumando sus tres variantes. Con **5.000 eventos con foto** serían unos **2,5 GB** (dentro de los 10 GB gratis) y unas 20.000 escrituras por carga completa (2 % del millón gratis). Las lecturas solo cuentan cuando la caché no tiene el archivo. Con URL inmutables y el índice cacheado 5 minutos, incluso un millón de visitas al mes debería quedar muy por debajo de los 10 millones. **Costo esperado: US$0 al mes** en ese volumen. Lo que más puede crecer son las lecturas Clase B si se desactiva la caché. Revisa el consumo en *R2* → *Metrics*.

## Pruebas

```bash
npm run test:importador   # 73 pruebas: SSRF, archivos, idempotencia, derechos y revisión humana, reemplazos, fallas de R2/D1…
npm run revisar:secretos
npm test                  # todo lo anterior + build + Playwright (pantallas existentes + fotos)
```

## Activar en producción (pendiente)

1. Revisar y fusionar la rama `imagenes-r2` en `rediseno-pagina`.
2. Hacer los pasos 1 a 11 de "Configuración en Cloudflare".
3. Pedir a Gemini el primer lote con `docs/imagenes-gemini.md`. Correrlo con `--simular`, luego importar, revisar `pendientes` y aprobar lo que tenga permiso real.
4. Revisar en el sitio y vigilar *R2* → *Metrics* la primera semana.

## Etapa B (siguiente): eventos sin tocar código

Mover `src/data/eventos.ts` a una tabla `eventos` en D1 (la misma base) y renderizar Evento, Agenda, Mapa y Bienvenida bajo demanda con `@astrojs/cloudflare` y una binding D1, con caché en el borde. `imagenes_evento.evento_id` pasa a ser llave foránea y `catalogo.mjs` lee de D1. Así un agente también puede **crear** eventos, y la foto del detalle puede ir en el HTML (y en `og:image`) desde el servidor.
