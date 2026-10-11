-- Migración 0001 · Imágenes de eventos (Cloudflare D1, SQLite)
-- Solo crea tablas e índices nuevos: no toca ni borra nada existente. Es segura de repetir (IF NOT EXISTS).
-- Aplicar: npx wrangler d1 execute fulleventos --remote --file migraciones/0001_imagenes_evento.sql   (docs/imagenes-r2.md)
--
-- Hoy los eventos viven en src/data/eventos.ts (ids "e1", "e2"…); evento_id guarda ese id. Cuando los eventos
-- pasen a D1 (etapa B) se agrega la llave foránea a la tabla de eventos sin cambiar esta tabla.

CREATE TABLE IF NOT EXISTS imagenes_evento (
  id                 INTEGER PRIMARY KEY AUTOINCREMENT,
  evento_id          TEXT    NOT NULL,
  -- principal: la que usan las tarjetas y el detalle. Las demás quedan registradas para usos futuros.
  tipo               TEXT    NOT NULL DEFAULT 'principal'
                     CHECK (tipo IN ('principal', 'afiche', 'galeria')),

  -- Origen y derechos
  url_origen         TEXT    NOT NULL,             -- URL exacta del archivo descargado
  fuente_nombre      TEXT    NOT NULL,             -- "Movistar Arena", "Idartes"…
  fuente_url         TEXT,                         -- página oficial donde aparece la imagen
  fuente_oficial     INTEGER NOT NULL DEFAULT 0 CHECK (fuente_oficial IN (0, 1)),
  derechos_estado    TEXT    NOT NULL
                     CHECK (derechos_estado IN ('confirmado', 'pendiente', 'rechazado', 'desconocido')),
  licencia           TEXT,                         -- "Kit de prensa del organizador", "CC BY 4.0"…
  derechos_evidencia TEXT,                         -- URL o texto que respalda el permiso
  verificado_en      TEXT,                         -- AAAA-MM-DD en que alguien verificó los derechos
  verificado_por     TEXT    CHECK (verificado_por IN ('persona', 'agente')), -- quién afirmó los derechos
  credito            TEXT,                         -- "Foto: Juana Pérez / Idartes"
  texto_alternativo  TEXT    NOT NULL,

  -- Archivo procesado (vacío mientras no se haya descargado)
  sha256             TEXT,                         -- hash del archivo original: detecta duplicados
  version            TEXT,                         -- primeros 16 hex del sha256; va en el nombre del objeto
  ruta_r2            TEXT,                         -- prefijo del objeto: eventos/{evento_id}/{version}
  variantes          TEXT,                         -- JSON {"480": "eventos/e3/…-480.webp", "960": …, "1600": …}
  url_publica        TEXT,                         -- URL de la variante más grande
  ancho              INTEGER,
  alto               INTEGER,
  formato_original   TEXT,                         -- jpeg | png | webp | avif
  bytes_original     INTEGER,
  bytes_r2           INTEGER,                      -- suma de las variantes guardadas en R2

  -- Estado de procesamiento:
  --   pendiente_revision  registrada, sin descargar (derechos sin confirmar). Nunca se publica sola.
  --   lista               descargada y subida, pero no es la que se muestra (ya había otra publicada).
  --   publicada           la que se muestra para (evento_id, tipo). Solo una a la vez.
  --   rechazada           derechos rechazados o archivo inválido.
  --   error               falló la descarga o el procesamiento; se puede reintentar.
  --   retirada            se dejó de mostrar a propósito.
  estado             TEXT    NOT NULL
                     CHECK (estado IN ('pendiente_revision', 'lista', 'publicada', 'rechazada', 'error', 'retirada')),
  error              TEXT,
  -- Respaldo cuando no hay foto: hoy el degradado de la tarjeta (bg1/bg2 del evento) o la categoría
  placeholder        TEXT,
  motivo_reemplazo   TEXT,

  importacion_id     TEXT,
  creado_en          TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  actualizado_en     TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

-- Idempotencia: la misma URL para el mismo evento se registra una sola vez…
CREATE UNIQUE INDEX IF NOT EXISTS ux_imagenes_evento_origen ON imagenes_evento (evento_id, url_origen);
-- …y el mismo archivo (aunque venga de otra URL) también.
CREATE UNIQUE INDEX IF NOT EXISTS ux_imagenes_evento_hash ON imagenes_evento (evento_id, sha256) WHERE sha256 IS NOT NULL;
-- Una sola imagen publicada por evento y tipo
CREATE UNIQUE INDEX IF NOT EXISTS ux_imagenes_evento_publicada ON imagenes_evento (evento_id, tipo) WHERE estado = 'publicada';
CREATE INDEX IF NOT EXISTS ix_imagenes_evento_estado ON imagenes_evento (estado);

-- Una fila por ejecución del importador
CREATE TABLE IF NOT EXISTS importaciones (
  id              TEXT    PRIMARY KEY,             -- imp_AAAAMMDD_HHMMSS_xxxx
  archivo         TEXT    NOT NULL,                -- nombre del archivo de Gemini (sin ruta)
  sha256_archivo  TEXT    NOT NULL,
  iniciada_en     TEXT    NOT NULL,
  terminada_en    TEXT,
  total           INTEGER NOT NULL DEFAULT 0,
  publicadas      INTEGER NOT NULL DEFAULT 0,
  listas          INTEGER NOT NULL DEFAULT 0,
  pendientes      INTEGER NOT NULL DEFAULT 0,
  duplicadas      INTEGER NOT NULL DEFAULT 0,
  rechazadas      INTEGER NOT NULL DEFAULT 0,
  errores         INTEGER NOT NULL DEFAULT 0
);

-- Errores por registro: el importador sigue con los demás
CREATE TABLE IF NOT EXISTS importaciones_errores (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  importacion_id  TEXT    NOT NULL,
  linea           INTEGER,
  evento_ref      TEXT,
  codigo          TEXT    NOT NULL,
  mensaje         TEXT    NOT NULL,
  creado_en       TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS ix_importaciones_errores_importacion ON importaciones_errores (importacion_id);
