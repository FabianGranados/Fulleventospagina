// Importador de imágenes de eventos: JSON/JSONL de Gemini → validación → descarga segura → WebP → R2 → D1.
// Idempotente: (evento, URL de origen) y (evento, sha256 del archivo) son únicos, y las claves de R2 llevan la
// versión del contenido, así que repetir un archivo no duplica filas ni objetos. Un error en un registro se anota
// y se sigue con el siguiente. Nada sin derechos confirmados (y, por defecto, revisados por una persona) se descarga
// ni se publica.
import { createHash, randomBytes } from 'node:crypto';
import { descargar, revisarUrl } from './red.mjs';
import { procesarImagen } from './archivo.mjs';
import { leerEntradas, registroGemini } from './esquema.mjs';
import { ErrorImagen } from './politica.mjs';

const CLAVE_INDICE = 'indice/eventos-v1.json';
const ahoraIso = () => new Date().toISOString();
const hoy = () => new Date().toISOString().slice(0, 10);

// ---------- Acceso a D1 ----------

const COLUMNAS = [
  'evento_id', 'tipo', 'url_origen', 'fuente_nombre', 'fuente_url', 'fuente_oficial', 'derechos_estado', 'licencia',
  'derechos_evidencia', 'verificado_en', 'verificado_por', 'credito', 'texto_alternativo', 'sha256', 'version',
  'ruta_r2', 'variantes', 'url_publica', 'ancho', 'alto', 'formato_original', 'bytes_original', 'bytes_r2', 'estado',
  'error', 'placeholder', 'motivo_reemplazo', 'importacion_id', 'procedencia', 'ref_externa',
];

const repositorio = (db) => ({
  porOrigen: async (eventoId, url) =>
    (await db.consultar('SELECT * FROM imagenes_evento WHERE evento_id = ? AND url_origen = ?', [eventoId, url]))[0],
  porHash: async (eventoId, sha) =>
    (await db.consultar('SELECT * FROM imagenes_evento WHERE evento_id = ? AND sha256 = ?', [eventoId, sha]))[0],
  porId: async (id) => (await db.consultar('SELECT * FROM imagenes_evento WHERE id = ?', [id]))[0],
  publicada: async (eventoId, tipo) =>
    (await db.consultar("SELECT * FROM imagenes_evento WHERE evento_id = ? AND tipo = ? AND estado = 'publicada'", [eventoId, tipo]))[0],
  insertar: async (campos) => {
    const cols = COLUMNAS.filter((c) => campos[c] !== undefined);
    const r = await db.ejecutar(
      `INSERT INTO imagenes_evento (${cols.join(', ')}) VALUES (${cols.map(() => '?').join(', ')})`,
      cols.map((c) => campos[c]),
    );
    return r.ultimoId;
  },
  actualizar: async (id, campos) => {
    const cols = COLUMNAS.filter((c) => campos[c] !== undefined);
    if (!cols.length) return;
    await db.ejecutar(
      `UPDATE imagenes_evento SET ${cols.map((c) => `${c} = ?`).join(', ')}, actualizado_en = ? WHERE id = ?`,
      [...cols.map((c) => campos[c]), ahoraIso(), id],
    );
  },
});

// ---------- Reglas de derechos ----------

// Explica por qué una solicitud no puede publicarse todavía (o null si puede)
export const faltaParaPublicar = (s, politica, fecha = hoy()) => {
  if (s.derechos_estado !== 'confirmado') return `derechos ${s.derechos_estado}`;
  if (!s.fuente_oficial) return 'la fuente no es oficial';
  if (!s.licencia) return 'falta la licencia o el permiso';
  if (!s.derechos_evidencia) return 'falta la evidencia del permiso';
  if (!s.verificado_en) return 'falta la fecha de verificación';
  if (s.verificado_en > fecha) return 'la fecha de verificación está en el futuro';
  if (politica.exigirRevisionHumana && s.verificado_por !== 'persona') return 'falta la revisión de una persona';
  return null;
};

const desdeRegistro = (r, evento) => ({
  evento_id: evento.id,
  tipo: r.imagen.tipo,
  url_origen: r.imagen.url,
  fuente_nombre: r.fuente.nombre,
  fuente_url: r.fuente.url,
  fuente_oficial: r.fuente.oficial ? 1 : 0,
  derechos_estado: r.derechos.estado,
  licencia: r.derechos.licencia,
  derechos_evidencia: r.derechos.evidencia,
  verificado_en: r.derechos.verificado_en,
  // Lo que diga el archivo no cuenta: solo `aprobar` (una persona) marca 'persona'. Así un registro no puede
  // saltarse la revisión humana declarándola él mismo.
  verificado_por: 'agente',
  credito: r.imagen.credito,
  texto_alternativo: r.imagen.texto_alternativo,
  placeholder: `${evento.bg1} ${evento.bg2}`,
  procedencia: r.procedencia ? JSON.stringify(r.procedencia) : undefined,
  ref_externa: r.ref_externa,
  reemplazar: r.reemplazar,
  motivo_reemplazo: r.motivo_reemplazo,
});

// ---------- Procesar una solicitud ----------

const nuevoId = () => {
  const t = new Date().toISOString().replace(/[-:]/g, '').replace('T', '_').slice(0, 15);
  return `imp_${t}_${randomBytes(2).toString('hex')}`;
};

const codigoDe = (error) => String(error ?? '').match(/^\[(\w+)\]/)?.[1];
const urlPermitida = (s, politica) => {
  try {
    revisarUrl(s.url_origen, politica, { fuenteUrl: s.fuente_url, fuenteOficial: Boolean(s.fuente_oficial) });
    return true;
  } catch {
    return false;
  }
};

// Devuelve { resultado, id?, mensaje? }. resultado: publicada | lista | pendiente | duplicada | rechazada | error | simulada
export const procesarSolicitud = async (s, ctx) => {
  const { almacen, politica, importacionId, simular = false, descargarFn = descargar, procesarFn = procesarImagen } = ctx;
  const repo = repositorio(almacen.db);
  const fila = await repo.porOrigen(s.evento_id, s.url_origen);

  // Una foto ya subida (lista o retirada) se publica sin volver a descargarla si se pide reemplazar con motivo
  if (fila && ['lista', 'retirada'].includes(fila.estado) && s.reemplazar && s.motivo_reemplazo && !simular) {
    return promover(fila, s.motivo_reemplazo, ctx);
  }
  // Lo que ya está procesado no se vuelve a tocar
  if (fila && ['publicada', 'lista', 'retirada'].includes(fila.estado)) {
    return { resultado: 'duplicada', id: fila.id, mensaje: `Ya registrada (#${fila.id}, ${fila.estado})` };
  }
  // Una rechazada solo se reintenta si ahora llegan derechos confirmados o si se rechazó por el dominio y la
  // política ya lo permite (alguien lo agregó a dominiosPermitidos)
  if (fila?.estado === 'rechazada') {
    const derechosNuevos = fila.derechos_estado !== 'confirmado' && s.derechos_estado === 'confirmado';
    const porDominio = codigoDe(fila.error) === 'url_no_permitida' && urlPermitida(s, politica);
    if (!derechosNuevos && !porDominio) {
      return { resultado: 'duplicada', id: fila.id, mensaje: `Ya registrada como rechazada (#${fila.id})` };
    }
  }

  // Una persona ya aprobó los derechos (por ejemplo, falló la descarga después de `aprobar`): una nueva
  // importación del archivo de Gemini no puede bajar esa aprobación
  if (fila?.verificado_por === 'persona' && s.verificado_por !== 'persona') {
    for (const c of ['derechos_estado', 'licencia', 'derechos_evidencia', 'verificado_en', 'verificado_por']) s = { ...s, [c]: fila[c] };
  }

  const guardar = async (campos) => {
    const datos = { ...s, ...campos, importacion_id: importacionId };
    if (simular) return fila?.id;
    if (fila) {
      await repo.actualizar(fila.id, datos);
      return fila.id;
    }
    return repo.insertar(datos);
  };

  if (s.derechos_estado === 'rechazado') {
    const id = await guardar({ estado: 'rechazada', error: '[derechos] derechos rechazados' });
    return { resultado: 'rechazada', id, mensaje: 'Derechos rechazados: no se descarga' };
  }

  const falta = faltaParaPublicar(s, politica);
  if (falta) {
    const igual = fila?.estado === 'pendiente_revision' && fila.error === `[derechos] ${falta}`;
    const id = await guardar({ estado: 'pendiente_revision', error: `[derechos] ${falta}` });
    return { resultado: igual ? 'duplicada' : 'pendiente', id, mensaje: `Pendiente de revisión: ${falta}` };
  }

  // Derechos confirmados: revisar la URL antes de cualquier conexión
  try {
    revisarUrl(s.url_origen, politica, { fuenteUrl: s.fuente_url, fuenteOficial: Boolean(s.fuente_oficial) });
  } catch (e) {
    const id = await guardar({ estado: 'rechazada', error: `[${e.codigo}] ${e.message}` });
    return { resultado: 'rechazada', id, codigo: e.codigo, mensaje: e.message };
  }
  if (simular) return { resultado: 'simulada', mensaje: 'Se descargaría, optimizaría y publicaría' };

  let archivo;
  try {
    const { bytes } = await descargarFn(s.url_origen, politica, { fuenteUrl: s.fuente_url, fuenteOficial: Boolean(s.fuente_oficial) });
    ctx.bytesDescargados = (ctx.bytesDescargados ?? 0) + bytes.length;
    archivo = await procesarFn(bytes, politica);
  } catch (e) {
    const temporal = !(e instanceof ErrorImagen) || e.reintentable || e.codigo === 'descarga_fallida';
    // Bloqueos de red (redirección o DNS hacia algo no permitido) no se reintentan aunque la URL original pase
    const codigo = e.codigo === 'url_no_permitida' ? 'url_bloqueada' : (e.codigo ?? 'error');
    const id = await guardar({ estado: temporal ? 'error' : 'rechazada', error: `[${codigo}] ${e.message}` });
    return { resultado: temporal ? 'error' : 'rechazada', id, codigo: e.codigo ?? 'error', mensaje: e.message };
  }

  // El mismo archivo ya está registrado para este evento (desde otra URL)
  const gemela = await repo.porHash(s.evento_id, archivo.sha256);
  if (gemela && gemela.id !== fila?.id) {
    const id = await guardar({ estado: 'rechazada', error: `[duplicado] Archivo duplicado de la imagen #${gemela.id}` });
    return { resultado: 'duplicada', id, mensaje: `El mismo archivo ya está en la imagen #${gemela.id}` };
  }

  // Subir a R2 antes de tocar D1: el índice nunca apunta a un objeto que no existe
  const prefijo = `eventos/${s.evento_id}/${archivo.version}`;
  const variantes = {};
  try {
    for (const v of archivo.variantes) {
      const clave = `${prefijo}-${v.ancho}.webp`;
      await almacen.r2.subir(clave, v.buffer, { tipo: 'image/webp', cache: politica.cacheImagenes });
      variantes[v.ancho] = clave;
    }
  } catch (e) {
    const id = await guardar({ estado: 'error', error: `[${e.codigo ?? 'r2'}] ${e.message}` });
    return { resultado: 'error', id, codigo: e.codigo ?? 'r2', mensaje: e.message };
  }

  const datosArchivo = {
    sha256: archivo.sha256,
    version: archivo.version,
    ruta_r2: prefijo,
    variantes: JSON.stringify(variantes),
    url_publica: ctx.urlPublica ? `${ctx.urlPublica}/${variantes[Math.max(...Object.keys(variantes).map(Number))]}` : undefined,
    ancho: archivo.ancho,
    alto: archivo.alto,
    formato_original: archivo.formato,
    bytes_original: archivo.bytesOriginal,
    bytes_r2: archivo.variantes.reduce((t, v) => t + v.bytes, 0),
    error: '',
  };

  // ¿Se muestra? Solo si el evento no tiene foto publicada, o si se pidió reemplazarla con motivo
  const actual = await repo.publicada(s.evento_id, s.tipo);
  if (actual && !s.reemplazar) {
    const id = await guardar({ ...datosArchivo, estado: 'lista' });
    return { resultado: 'lista', id, mensaje: `Subida, pero el evento ya tiene la imagen #${actual.id} publicada (usa reemplazar)` };
  }
  if (actual) await repo.actualizar(actual.id, { estado: 'lista', motivo_reemplazo: `Reemplazada: ${s.motivo_reemplazo}` });
  ctx.indiceSucio = true; // pase lo que pase abajo, el índice se vuelve a generar desde D1
  try {
    const id = await guardar({ ...datosArchivo, estado: 'publicada' });
    return { resultado: 'publicada', id, mensaje: actual ? `Reemplaza a la imagen #${actual.id}` : 'Publicada' };
  } catch (e) {
    if (actual) await repo.actualizar(actual.id, { estado: 'publicada' }).catch(() => {});
    throw e;
  }
};

// Publica una imagen ya subida a R2 (lista o retirada) en lugar de la actual, con motivo
export const promover = async (fila, motivo, ctx) => {
  const repo = repositorio(ctx.almacen.db);
  if (!motivo || motivo.trim().length < 5) throw new ErrorImagen('configuracion', 'Hace falta un motivo para publicar en lugar de la actual');
  if (!fila.variantes || !fila.version) throw new ErrorImagen('configuracion', `La imagen #${fila.id} no tiene archivos en R2`);
  const actual = await repo.publicada(fila.evento_id, fila.tipo);
  if (actual?.id === fila.id) return { resultado: 'duplicada', id: fila.id, mensaje: 'Ya está publicada' };
  if (actual) await repo.actualizar(actual.id, { estado: 'lista', motivo_reemplazo: `Reemplazada: ${motivo}` });
  ctx.indiceSucio = true;
  try {
    await repo.actualizar(fila.id, { estado: 'publicada', motivo_reemplazo: motivo, error: '' });
  } catch (e) {
    if (actual) await repo.actualizar(actual.id, { estado: 'publicada' }).catch(() => {});
    throw e;
  }
  return { resultado: 'publicada', id: fila.id, mensaje: actual ? `Reemplaza a la imagen #${actual.id} (sin descargar de nuevo)` : 'Publicada (sin descargar de nuevo)' };
};

export const publicarExistente = async ({ id, motivo, almacen, politica }) => {
  const fila = await repositorio(almacen.db).porId(id);
  if (!fila || !['lista', 'retirada'].includes(fila.estado)) throw new ErrorImagen('configuracion', fila ? `La imagen #${id} está ${fila.estado}` : `No existe la imagen #${id}`);
  const ctx = { almacen, politica };
  const r = await promover(fila, motivo, ctx);
  if (ctx.indiceSucio) await publicarIndice(almacen, politica);
  return r;
};

// ---------- Índice público ----------

export const construirIndice = async (db) => {
  const filas = await db.consultar(
    "SELECT evento_id, version, variantes, ancho, alto, texto_alternativo, credito FROM imagenes_evento WHERE estado = 'publicada' AND tipo = 'principal' ORDER BY evento_id",
  );
  return {
    version: 1,
    generado: ahoraIso(),
    eventos: Object.fromEntries(
      filas.map((f) => [
        f.evento_id,
        {
          v: f.version,
          variantes: JSON.parse(f.variantes),
          ancho: Number(f.ancho),
          alto: Number(f.alto),
          alt: f.texto_alternativo,
          ...(f.credito ? { credito: f.credito } : {}),
        },
      ]),
    ),
  };
};

export const publicarIndice = async (almacen, politica) => {
  const indice = await construirIndice(almacen.db);
  await almacen.r2.subir(CLAVE_INDICE, Buffer.from(JSON.stringify(indice)), {
    tipo: 'application/json; charset=utf-8',
    cache: politica.cacheIndice,
  });
  return indice;
};

// ---------- Importar un archivo completo ----------

export const importar = async ({ contenido, archivo = 'entrada.jsonl', almacen, catalogo, politica, simular = false, aviso = () => {}, ...dependencias }) => {
  const importacionId = nuevoId();
  const ctx = { almacen, politica, importacionId, simular, ...dependencias };
  const resumen = { id: importacionId, total: 0, publicadas: 0, listas: 0, pendientes: 0, duplicadas: 0, rechazadas: 0, errores: 0, simuladas: 0, detalles: [] };
  const anotar = async (d) => {
    resumen.detalles.push(d);
    const campo = { publicada: 'publicadas', lista: 'listas', pendiente: 'pendientes', duplicada: 'duplicadas', rechazada: 'rechazadas', error: 'errores', simulada: 'simuladas' }[d.resultado];
    resumen[campo]++;
    aviso(d);
    if (!simular && ['error', 'rechazada'].includes(d.resultado)) {
      await almacen.db
        .ejecutar('INSERT INTO importaciones_errores (importacion_id, linea, evento_ref, codigo, mensaje) VALUES (?, ?, ?, ?, ?)', [
          importacionId, d.linea, d.evento ?? null, d.codigo ?? d.resultado, String(d.mensaje).slice(0, 1000),
        ])
        .catch(() => {});
    }
  };

  const entradas = leerEntradas(contenido);
  if (!simular) {
    await almacen.db.ejecutar('INSERT INTO importaciones (id, archivo, sha256_archivo, iniciada_en) VALUES (?, ?, ?, ?)', [
      importacionId, archivo, createHash('sha256').update(contenido).digest('hex'), ahoraIso(),
    ]);
  }

  for (const [i, entrada] of entradas.entries()) {
    resumen.total++;
    const base = { linea: entrada.linea };
    try {
      if (i >= politica.maxRegistros) {
        await anotar({ ...base, resultado: 'error', codigo: 'limite', mensaje: `Se superó el máximo de ${politica.maxRegistros} registros por ejecución` });
        continue;
      }
      if ((ctx.bytesDescargados ?? 0) > politica.maxBytesDescargaTotal) {
        await anotar({ ...base, resultado: 'error', codigo: 'limite', mensaje: 'Se superó el máximo de descarga por ejecución' });
        continue;
      }
      if (entrada.error) {
        await anotar({ ...base, resultado: 'rechazada', codigo: 'json_invalido', mensaje: entrada.error });
        continue;
      }
      const v = registroGemini.safeParse(entrada.valor);
      if (!v.success) {
        const mensaje = v.error.issues.map((x) => `${x.path.join('.') || 'registro'}: ${x.message}`).join('; ');
        await anotar({ ...base, resultado: 'rechazada', codigo: 'esquema_invalido', mensaje });
        continue;
      }
      const evento = catalogo.resolver(v.data.evento);
      const r = await procesarSolicitud(desdeRegistro(v.data, evento), ctx);
      await anotar({ ...base, evento: evento.id, ...r });
    } catch (e) {
      // Un registro no detiene la importación
      await anotar({ ...base, resultado: e.codigo?.startsWith('evento_') ? 'rechazada' : 'error', codigo: e.codigo ?? 'error', mensaje: e.message });
    }
  }

  if (ctx.indiceSucio && !simular) {
    try {
      await publicarIndice(almacen, politica);
    } catch (e) {
      await anotar({ linea: null, resultado: 'error', codigo: 'indice', mensaje: `No se pudo publicar el índice: ${e.message}. Corre "indice" otra vez.` });
    }
  }
  if (!simular) {
    await almacen.db.ejecutar(
      'UPDATE importaciones SET terminada_en = ?, total = ?, publicadas = ?, listas = ?, pendientes = ?, duplicadas = ?, rechazadas = ?, errores = ? WHERE id = ?',
      [ahoraIso(), resumen.total, resumen.publicadas, resumen.listas, resumen.pendientes, resumen.duplicadas, resumen.rechazadas, resumen.errores, importacionId],
    );
  }
  return resumen;
};

// ---------- Revisión humana ----------

const solicitudDeFila = (f) => ({ ...f, reemplazar: false });

// Aprueba imágenes pendientes después de revisar sus derechos: las descarga, optimiza y publica
export const aprobar = async ({ ids, por, licencia, evidencia, reemplazar = false, motivo, almacen, politica, ...dependencias }) => {
  if (!por || por.trim().length < 2) throw new ErrorImagen('configuracion', 'Indica quién aprueba con --por "Nombre"');
  if (reemplazar && (!motivo || motivo.trim().length < 5)) throw new ErrorImagen('configuracion', 'Para reemplazar la foto publicada indica --motivo "…"');
  const repo = repositorio(almacen.db);
  const ctx = { almacen, politica, importacionId: nuevoId(), ...dependencias };
  const salida = [];
  for (const id of ids) {
    const fila = await repo.porId(id);
    if (!fila || !['pendiente_revision', 'error'].includes(fila.estado)) {
      salida.push({ id, resultado: 'error', mensaje: fila ? `Está ${fila.estado}, no pendiente` : 'No existe' });
      continue;
    }
    const s = {
      ...solicitudDeFila(fila),
      derechos_estado: 'confirmado',
      licencia: licencia ?? fila.licencia,
      derechos_evidencia: evidencia ?? fila.derechos_evidencia,
      verificado_en: hoy(),
      verificado_por: 'persona',
      credito: fila.credito ?? undefined,
      reemplazar,
      motivo_reemplazo: motivo,
    };
    s.derechos_evidencia = `${s.derechos_evidencia ?? ''} · Aprobada por ${por.trim()} el ${hoy()}`.replace(/^ · /, '');
    salida.push({ id, ...(await procesarSolicitud(s, ctx)) });
  }
  if (ctx.indiceSucio) await publicarIndice(almacen, politica);
  return salida;
};

// Deja de mostrar la foto de un evento (vuelve el degradado). No borra el objeto de R2.
export const retirar = async ({ eventoId, motivo, almacen, politica }) => {
  const repo = repositorio(almacen.db);
  const actual = await repo.publicada(eventoId, 'principal');
  if (!actual) return null;
  await repo.actualizar(actual.id, { estado: 'retirada', motivo_reemplazo: `Retirada: ${motivo}` });
  await publicarIndice(almacen, politica);
  return actual.id;
};

export const pendientes = (almacen) =>
  almacen.db.consultar(
    "SELECT id, evento_id, url_origen, fuente_nombre, fuente_url, licencia, derechos_evidencia, error, creado_en FROM imagenes_evento WHERE estado IN ('pendiente_revision', 'error') ORDER BY id",
  );
