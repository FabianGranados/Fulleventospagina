-- Migración 0002 · Eventos en D1 (etapa B1: datos, sin tocar el sitio). Cloudflare D1 (SQLite).
-- Solo crea tablas, índices y triggers nuevos: no toca ni borra nada existente. Es segura de repetir.
-- NO aplicar en producción sin autorización (docs/etapa-b-eventos-d1.md). Prueba local: npm run eventos -- --local …
--
-- Reglas que la base hace cumplir aunque un script se equivoque:
--   · todo evento entra como 'pendiente_revision';
--   · para pasar a 'aprobado' hace falta quien aprueba y no puede haber alertas que bloquean sin resolver;
--   · solo un evento 'aprobado' puede pasar a 'publicado' (el sitio, en B2, mostrará solo los publicados);
--   · cambiar el contenido de un evento aprobado o publicado obliga a devolverlo a revisión;
--   · un evento publicado no se borra: se retira.
-- Los municipios (DIVIPOLA) se cargan en 0003_divipola.sql; las 14 categorías oficiales, aquí.

-- ---------- Catálogos ----------

CREATE TABLE IF NOT EXISTS categorias (
  id      TEXT PRIMARY KEY,              -- src/data/categorias-oficiales.ts
  nombre  TEXT NOT NULL,
  orden   INTEGER NOT NULL
);

INSERT OR IGNORE INTO categorias (id, nombre, orden) VALUES
  ('rumba-y-vida-nocturna', 'Rumba y vida nocturna', 1),
  ('conciertos-y-festivales', 'Conciertos y festivales', 2),
  ('arte-y-cultura', 'Arte y cultura', 3),
  ('deportes', 'Deportes', 4),
  ('gastronomia', 'Gastronomía', 5),
  ('naturaleza-y-aventura', 'Naturaleza y aventura', 6),
  ('familia-y-ninos', 'Familia y niños', 7),
  ('negocios-y-emprendimiento', 'Negocios y emprendimiento', 8),
  ('educacion-y-tecnologia', 'Educación y tecnología', 9),
  ('bienestar-y-estilo-de-vida', 'Bienestar y estilo de vida', 10),
  ('ferias-y-mercados', 'Ferias y mercados', 11),
  ('comunidad-y-tradiciones', 'Comunidad y tradiciones', 12),
  ('gaming-y-entretenimiento', 'Gaming y entretenimiento', 13),
  ('mascotas', 'Mascotas', 14);

CREATE TABLE IF NOT EXISTS departamentos (
  codigo  TEXT PRIMARY KEY CHECK (length(codigo) = 2),   -- DIVIPOLA, 2 dígitos
  nombre  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS municipios (
  codigo              TEXT PRIMARY KEY CHECK (length(codigo) = 5),   -- DIVIPOLA, 5 dígitos
  nombre              TEXT NOT NULL,
  departamento_codigo TEXT NOT NULL REFERENCES departamentos (codigo),
  -- El DANE distingue municipios, áreas no municipalizadas (Amazonía y Orinoquía) y una isla
  tipo                TEXT NOT NULL DEFAULT 'municipio' CHECK (tipo IN ('municipio', 'area_no_municipalizada', 'isla')),
  latitud             REAL,              -- centro del municipio según el DANE
  longitud            REAL
);
CREATE INDEX IF NOT EXISTS ix_municipios_departamento ON municipios (departamento_codigo);

-- ---------- Eventos ----------

CREATE TABLE IF NOT EXISTS lotes_eventos (
  id           TEXT PRIMARY KEY,         -- lot_AAAAMMDD_HHMMSS_xxxx
  archivo      TEXT NOT NULL,
  sha256       TEXT NOT NULL,
  iniciado_en  TEXT NOT NULL,
  terminado_en TEXT,
  resumen      TEXT                      -- JSON con los conteos
);

CREATE TABLE IF NOT EXISTS eventos (
  id                  TEXT PRIMARY KEY,  -- "ev_" + 12 hex de la ref (estable); los del sitio conservarán e1…e19 (B2)
  ref_externa         TEXT NOT NULL UNIQUE,
  slug                TEXT NOT NULL,
  titulo              TEXT NOT NULL,
  categoria           TEXT REFERENCES categorias (id),   -- NULL = sin categoría oficial (alerta que bloquea)
  categoria_origen    TEXT,
  subcategoria        TEXT,
  etiquetas           TEXT NOT NULL DEFAULT '[]',        -- JSON
  resumen             TEXT,
  descripcion         TEXT,

  fecha               TEXT NOT NULL CHECK (fecha GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]'),
  fecha_fin           TEXT CHECK (fecha_fin IS NULL OR fecha_fin >= fecha),
  hora                TEXT,              -- HH:MM, hora de Colombia
  hora_fin            TEXT,
  zona_horaria        TEXT NOT NULL DEFAULT 'America/Bogota',
  estado_fecha        TEXT NOT NULL DEFAULT 'desconocida' CHECK (estado_fecha IN ('confirmada', 'provisional', 'desconocida')),
  estado_evento       TEXT NOT NULL DEFAULT 'programado'
                      CHECK (estado_evento IN ('programado', 'aplazado', 'cancelado', 'agotado', 'finalizado')),
  modalidad           TEXT NOT NULL DEFAULT 'presencial' CHECK (modalidad IN ('presencial', 'virtual', 'mixta')),

  municipio_codigo    TEXT REFERENCES municipios (codigo),
  departamento_codigo TEXT REFERENCES departamentos (codigo),
  ciudad_sitio        TEXT,              -- id de src/data/ciudades.ts si la ciudad ya existe en la interfaz
  lugar               TEXT,
  direccion           TEXT,
  latitud             REAL,
  longitud            REAL,
  precision_ubicacion TEXT CHECK (precision_ubicacion IS NULL OR precision_ubicacion IN ('exacta', 'aproximada', 'municipio')),

  organizador         TEXT,
  url_organizador     TEXT,
  -- Precio: nunca se inventa una cifra. Pago o mixto pueden ir sin cifra ("Consultar precio").
  tipo_precio         TEXT NOT NULL CHECK (tipo_precio IN ('gratis', 'pago', 'mixto', 'desconocido')),
  precio_desde        INTEGER CHECK (precio_desde IS NULL OR precio_desde >= 0),
  precio_hasta        INTEGER CHECK (precio_hasta IS NULL OR precio_hasta >= 0),
  moneda              TEXT NOT NULL DEFAULT 'COP',
  url_oficial         TEXT,
  url_venta           TEXT,
  url_registro        TEXT,
  restriccion_edad    TEXT,
  apto_familia        INTEGER CHECK (apto_familia IS NULL OR apto_familia IN (0, 1)),

  -- Revisión
  estado              TEXT NOT NULL DEFAULT 'pendiente_revision'
                      CHECK (estado IN ('pendiente_revision', 'aprobado', 'publicado', 'rechazado', 'retirado')),
  estado_investigacion TEXT,             -- lo que dijo Gemini ("verified"…): informativo, no autoriza nada
  revisado_por        TEXT,              -- quien hizo el último cambio de estado
  motivo_estado       TEXT,              -- por qué (obligatorio al rechazar, retirar o forzar)
  aprobado_por        TEXT,
  aprobado_en         TEXT,
  publicado_en        TEXT,
  demo                INTEGER NOT NULL DEFAULT 0 CHECK (demo IN (0, 1)),
  bg1                 TEXT,
  bg2                 TEXT,
  lote_id             TEXT REFERENCES lotes_eventos (id),
  procedencia         TEXT NOT NULL,     -- JSON: formato, archivo, línea y el registro original completo
  creado_en           TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  actualizado_en      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),

  CHECK (NOT (tipo_precio = 'gratis' AND COALESCE(precio_desde, 0) > 0)),
  CHECK (NOT (tipo_precio = 'gratis' AND precio_hasta IS NOT NULL)),
  CHECK (NOT (tipo_precio = 'desconocido' AND (precio_desde IS NOT NULL OR precio_hasta IS NOT NULL))),
  CHECK (precio_desde IS NULL OR precio_hasta IS NULL OR precio_hasta >= precio_desde),
  CHECK (estado NOT IN ('aprobado', 'publicado') OR (aprobado_por IS NOT NULL AND aprobado_en IS NOT NULL)),
  CHECK (aprobado_por IS NULL OR length(trim(aprobado_por)) >= 3),
  CHECK (motivo_estado IS NULL OR length(trim(motivo_estado)) >= 10 OR estado NOT IN ('rechazado', 'retirado')),
  CHECK (estado <> 'publicado' OR publicado_en IS NOT NULL),
  CHECK (estado NOT IN ('rechazado', 'retirado') OR motivo_estado IS NOT NULL)
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_eventos_lugar_slug_fecha ON eventos (municipio_codigo, slug, fecha);
CREATE INDEX IF NOT EXISTS ix_eventos_listado ON eventos (estado, municipio_codigo, fecha);
CREATE INDEX IF NOT EXISTS ix_eventos_categoria ON eventos (estado, categoria, fecha);
CREATE INDEX IF NOT EXISTS ix_eventos_departamento ON eventos (estado, departamento_codigo, fecha);

CREATE TABLE IF NOT EXISTS fuentes_evento (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  evento_id     TEXT NOT NULL REFERENCES eventos (id),
  url           TEXT NOT NULL,
  nombre        TEXT,
  tipo          TEXT,                    -- organizador, escenario, boletera, gobierno, prensa…
  clase         TEXT NOT NULL,           -- clasificación automática: gobierno, boletera, red_social, secundaria, portada, no_valida, otra
  oficial       INTEGER CHECK (oficial IS NULL OR oficial IN (0, 1)),
  principal     INTEGER NOT NULL DEFAULT 0 CHECK (principal IN (0, 1)),
  consultado_en TEXT,
  UNIQUE (evento_id, url)
);

-- Alertas de las reglas de validación. Las que bloquean impiden aprobar hasta que una persona las resuelva.
CREATE TABLE IF NOT EXISTS eventos_alertas (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  evento_id    TEXT NOT NULL REFERENCES eventos (id),
  tipo         TEXT NOT NULL,            -- vencido, fuente_insuficiente, duplicado, municipio, categoria, precio…
  gravedad     TEXT NOT NULL CHECK (gravedad IN ('bloquea', 'revisar', 'aviso')),
  detalle      TEXT NOT NULL,
  creada_en    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  resuelta_en  TEXT,
  resuelta_por TEXT,
  resolucion   TEXT,
  CHECK (resuelta_en IS NULL OR (length(trim(resuelta_por)) >= 3 AND length(trim(resolucion)) >= 10)),
  UNIQUE (evento_id, tipo, detalle)
);
CREATE INDEX IF NOT EXISTS ix_eventos_alertas_abiertas ON eventos_alertas (evento_id, gravedad) WHERE resuelta_en IS NULL;

-- Imágenes que trajo la investigación. Aquí NO se descargan: con permiso comprobado y aprobación pasan por el
-- importador de imágenes (npm run imagenes) a imagenes_evento y R2.
CREATE TABLE IF NOT EXISTS eventos_imagenes_candidatas (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  evento_id        TEXT NOT NULL REFERENCES eventos (id),
  url              TEXT,
  pagina           TEXT,
  derechos_estado  TEXT NOT NULL,
  utilizable       INTEGER NOT NULL DEFAULT 0 CHECK (utilizable IN (0, 1)),   -- 1 solo con permiso comprobable
  motivos          TEXT NOT NULL DEFAULT '[]',                                 -- JSON: por qué no se puede usar
  datos            TEXT NOT NULL,                                              -- JSON: la imagen original completa
  UNIQUE (evento_id, url)
);

-- Historial de cambios de estado (lo llena un trigger)
CREATE TABLE IF NOT EXISTS eventos_revisiones (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  evento_id  TEXT NOT NULL REFERENCES eventos (id),
  de         TEXT,
  a          TEXT NOT NULL,
  por        TEXT,
  motivo     TEXT,
  en         TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS ix_eventos_revisiones_evento ON eventos_revisiones (evento_id);

-- ---------- Triggers: nadie publica sin aprobación ----------

CREATE TRIGGER IF NOT EXISTS eventos_entran_pendientes
BEFORE INSERT ON eventos
WHEN NEW.estado <> 'pendiente_revision' OR NEW.aprobado_por IS NOT NULL OR NEW.publicado_en IS NOT NULL
BEGIN SELECT RAISE(ABORT, 'Todo evento entra como pendiente_revision, sin aprobación ni publicación'); END;

CREATE TRIGGER IF NOT EXISTS eventos_no_reemplazar_aprobados
BEFORE INSERT ON eventos
WHEN EXISTS (SELECT 1 FROM eventos WHERE (id = NEW.id OR ref_externa = NEW.ref_externa) AND estado <> 'pendiente_revision')
BEGIN SELECT RAISE(ABORT, 'Ya existe ese evento y no está pendiente: no se puede reemplazar'); END;

CREATE TRIGGER IF NOT EXISTS eventos_aprobar_desde_pendiente
BEFORE UPDATE OF estado ON eventos
WHEN NEW.estado = 'aprobado' AND OLD.estado <> 'aprobado' AND OLD.estado <> 'pendiente_revision'
BEGIN SELECT RAISE(ABORT, 'Solo un evento pendiente_revision se puede aprobar'); END;

CREATE TRIGGER IF NOT EXISTS eventos_aprobar_sin_bloqueos
BEFORE UPDATE OF estado ON eventos
WHEN NEW.estado IN ('aprobado', 'publicado') AND EXISTS (
  SELECT 1 FROM eventos_alertas WHERE evento_id = NEW.id AND gravedad = 'bloquea' AND resuelta_en IS NULL)
BEGIN SELECT RAISE(ABORT, 'El evento tiene alertas que bloquean sin resolver'); END;

CREATE TRIGGER IF NOT EXISTS eventos_publicar_solo_aprobados
BEFORE UPDATE OF estado ON eventos
WHEN NEW.estado = 'publicado' AND OLD.estado NOT IN ('aprobado', 'publicado')
BEGIN SELECT RAISE(ABORT, 'Solo un evento aprobado se puede publicar'); END;

-- Cubre también aprobado → publicado: no se puede publicar un contenido distinto del que se aprobó
CREATE TRIGGER IF NOT EXISTS eventos_aprobado_no_cambia_contenido
BEFORE UPDATE ON eventos
WHEN OLD.estado IN ('aprobado', 'publicado') AND NEW.estado IN ('aprobado', 'publicado') AND (
  NEW.slug IS NOT OLD.slug OR NEW.titulo IS NOT OLD.titulo OR NEW.categoria IS NOT OLD.categoria OR NEW.categoria_origen IS NOT OLD.categoria_origen OR
  NEW.subcategoria IS NOT OLD.subcategoria OR NEW.etiquetas IS NOT OLD.etiquetas OR NEW.resumen IS NOT OLD.resumen OR NEW.descripcion IS NOT OLD.descripcion OR
  NEW.fecha IS NOT OLD.fecha OR NEW.fecha_fin IS NOT OLD.fecha_fin OR NEW.hora IS NOT OLD.hora OR NEW.hora_fin IS NOT OLD.hora_fin OR
  NEW.estado_fecha IS NOT OLD.estado_fecha OR NEW.estado_evento IS NOT OLD.estado_evento OR NEW.modalidad IS NOT OLD.modalidad OR NEW.municipio_codigo IS NOT OLD.municipio_codigo OR
  NEW.departamento_codigo IS NOT OLD.departamento_codigo OR NEW.ciudad_sitio IS NOT OLD.ciudad_sitio OR NEW.lugar IS NOT OLD.lugar OR NEW.direccion IS NOT OLD.direccion OR
  NEW.latitud IS NOT OLD.latitud OR NEW.longitud IS NOT OLD.longitud OR NEW.precision_ubicacion IS NOT OLD.precision_ubicacion OR NEW.organizador IS NOT OLD.organizador OR
  NEW.url_organizador IS NOT OLD.url_organizador OR NEW.tipo_precio IS NOT OLD.tipo_precio OR NEW.precio_desde IS NOT OLD.precio_desde OR NEW.precio_hasta IS NOT OLD.precio_hasta OR
  NEW.moneda IS NOT OLD.moneda OR NEW.url_oficial IS NOT OLD.url_oficial OR NEW.url_venta IS NOT OLD.url_venta OR NEW.url_registro IS NOT OLD.url_registro OR
  NEW.restriccion_edad IS NOT OLD.restriccion_edad OR NEW.apto_familia IS NOT OLD.apto_familia)
BEGIN SELECT RAISE(ABORT, 'Cambiar un evento aprobado o publicado exige devolverlo a pendiente_revision'); END;

CREATE TRIGGER IF NOT EXISTS eventos_publicados_no_se_borran
BEFORE DELETE ON eventos
WHEN OLD.estado IN ('aprobado', 'publicado')
BEGIN SELECT RAISE(ABORT, 'Un evento aprobado o publicado no se borra: se retira'); END;

CREATE TRIGGER IF NOT EXISTS eventos_alertas_no_se_borran
BEFORE DELETE ON eventos_alertas
WHEN OLD.gravedad = 'bloquea' AND OLD.resuelta_en IS NULL
BEGIN SELECT RAISE(ABORT, 'Una alerta que bloquea no se borra: se resuelve indicando quién y cómo'); END;

-- Al volver a revisión se borra la aprobación anterior, para que nadie publique con una aprobación vieja
CREATE TRIGGER IF NOT EXISTS eventos_volver_a_revision
BEFORE UPDATE OF estado ON eventos
WHEN NEW.estado = 'pendiente_revision' AND OLD.estado <> 'pendiente_revision' AND (NEW.aprobado_por IS NOT NULL OR NEW.publicado_en IS NOT NULL)
BEGIN SELECT RAISE(ABORT, 'Al volver a pendiente_revision hay que quitar aprobado_por, aprobado_en y publicado_en'); END;

CREATE TRIGGER IF NOT EXISTS eventos_historial
AFTER UPDATE OF estado ON eventos
WHEN NEW.estado IS NOT OLD.estado
BEGIN
  INSERT INTO eventos_revisiones (evento_id, de, a, por, motivo) VALUES (NEW.id, OLD.estado, NEW.estado, NEW.revisado_por, NEW.motivo_estado);
END;
