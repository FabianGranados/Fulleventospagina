// Importador de eventos (etapa B1). Lee la cola eventos-nuevos.jsonl que deja el adaptador y guarda en D1 (tabla
// `eventos`, migraciones/0002_eventos.sql) TODO como 'pendiente_revision'. Las reglas de validación se vuelven a
// correr con la fecha de hoy y quedan como alertas; las que bloquean impiden aprobar.
//
// Idempotente por `ref_externa`: repetir el mismo archivo no duplica nada. Un evento ya aprobado, publicado,
// rechazado o retirado no se modifica: si la investigación trae datos distintos, se deja una alerta.
// No descarga imágenes ni publica nada. Mismo `almacen` que el importador de imágenes (scripts/imagenes/almacenes.mjs).
import { createHash, randomBytes } from 'node:crypto';
import { eventoNormalizado, validarReglas, posibleDuplicado, clasificarFuente, motivosImagen, hoyBogota } from './evento.mjs';

export class ErrorEvento extends Error {
  constructor(codigo, mensaje) {
    super(mensaje);
    this.codigo = codigo;
  }
}

export const idEvento = (ref) => `ev_${createHash('sha1').update(ref).digest('hex').slice(0, 12)}`;
const ahora = () => new Date().toISOString();
const json = (v) => JSON.stringify(v ?? null);

// Columnas de contenido (las que una persona aprueba). Si cambian, el evento debe volver a revisión.
const CONTENIDO = ['slug', 'titulo', 'categoria', 'categoria_origen', 'subcategoria', 'etiquetas', 'resumen', 'descripcion', 'fecha', 'fecha_fin', 'hora', 'hora_fin', 'estado_fecha', 'estado_evento', 'modalidad', 'municipio_codigo', 'departamento_codigo', 'ciudad_sitio', 'lugar', 'direccion', 'latitud', 'longitud', 'precision_ubicacion', 'organizador', 'url_organizador', 'tipo_precio', 'precio_desde', 'precio_hasta', 'url_oficial', 'url_venta', 'url_registro', 'restriccion_edad', 'apto_familia'];

const aFila = (n) => ({
  ...Object.fromEntries(CONTENIDO.map((c) => [c, n[c] ?? null])),
  etiquetas: json(n.etiquetas ?? []),
  apto_familia: n.apto_familia === undefined ? null : Number(n.apto_familia),
});
const mismaFila = (a, b) => CONTENIDO.every((c) => String(a[c] ?? '') === String(b[c] ?? ''));

// Quien aprueba es una persona con nombre, no un agente
const NO_PERSONAS = /^(agente|gemini|claude|ia|ai|bot|sistema|automatico|automático)$/i;
const exigirPersona = (por) => {
  if (!por || por.trim().length < 3 || NO_PERSONAS.test(por.trim())) throw new ErrorEvento('revision', 'Indica el nombre de la persona que revisa (--por "Nombre")');
  return por.trim();
};

const leerCola = (contenido) =>
  contenido
    .split(/\r?\n/)
    .map((l, i) => ({ texto: l.trim(), linea: i + 1 }))
    .filter((l) => l.texto)
    .map(({ texto, linea }) => {
      try {
        return { linea, valor: JSON.parse(texto) };
      } catch (e) {
        return { linea, error: `JSON inválido: ${e.message}` };
      }
    });

// ---------- Importar ----------

export const importarEventos = async ({ contenido, archivo = 'eventos-nuevos.jsonl', almacen, hoy = hoyBogota(), incluirVencidos = false, aviso = () => {} }) => {
  const { db } = almacen;
  const lote = `lot_${ahora().replace(/\D/g, '').slice(0, 14)}_${randomBytes(2).toString('hex')}`;
  await db.ejecutar('INSERT INTO lotes_eventos (id, archivo, sha256, iniciado_en) VALUES (?, ?, ?, ?)', [lote, archivo, createHash('sha256').update(contenido).digest('hex'), ahora()]);
  const r = { lote, total: 0, nuevos: 0, actualizados: 0, sin_cambios: 0, conservados: 0, vencidos_omitidos: 0, errores: 0, con_bloqueo: 0, detalles: [] };
  const anotar = (d) => {
    r.detalles.push(d);
    aviso(d);
  };

  for (const entrada of leerCola(contenido)) {
    r.total++;
    const base = { linea: entrada.linea };
    try {
      if (entrada.error) throw new ErrorEvento('formato', entrada.error);
      const l = entrada.valor;
      if (!l.normalizado) throw new ErrorEvento('formato', 'La línea no trae el evento normalizado: pásala primero por `npm run imagenes -- adaptar`');
      const v = eventoNormalizado.safeParse(l.normalizado);
      if (!v.success) throw new ErrorEvento('formato', v.error.issues.map((x) => `${x.path.join('.')}: ${x.message}`).join('; '));
      const n = v.data;
      base.ref = n.ref;
      base.titulo = n.titulo;

      if ((n.fecha_fin ?? n.fecha) < hoy && !incluirVencidos) {
        r.vencidos_omitidos++;
        anotar({ ...base, resultado: 'vencido', mensaje: `Terminó el ${n.fecha_fin ?? n.fecha}: no se importa` });
        continue;
      }

      // Alertas: las de las reglas se recalculan hoy; se conservan las que solo sabe el adaptador (duplicados en el
      // lote, correcciones, conversión de formato)
      const reglas = validarReglas(n, { hoy, imagenes: l.imagenes ?? [] });
      const tiposReglas = new Set(reglas.map((a) => `${a.tipo}|${a.detalle}`));
      const alertas = [...reglas, ...(l.alertas ?? []).filter((a) => !tiposReglas.has(`${a.tipo}|${a.detalle}`) && ['duplicado', 'correccion', 'formato', 'precio', 'municipio', 'fecha', 'fuente_insuficiente'].includes(a.tipo))];
      const id = idEvento(n.ref);

      // Sin municipio no se puede comparar por lugar: al menos mismo slug y fecha con otra ref
      if (!n.municipio_codigo) {
        const iguales = await db.consultar('SELECT id, titulo FROM eventos WHERE municipio_codigo IS NULL AND slug = ? AND fecha = ? AND ref_externa <> ?', [n.slug, n.fecha, n.ref]);
        for (const c of iguales) alertas.push({ tipo: 'duplicado', gravedad: 'bloquea', detalle: `Posible duplicado de ${c.id} "${c.titulo}"` });
      }
      // Duplicados contra lo que ya está en D1 (otra ref, mismo municipio, fechas que se cruzan, título parecido)
      if (n.municipio_codigo) {
        const cercanos = await db.consultar(
          'SELECT id, ref_externa, titulo, fecha, fecha_fin, municipio_codigo, estado FROM eventos WHERE municipio_codigo = ? AND ref_externa <> ? AND fecha <= ? AND COALESCE(fecha_fin, fecha) >= ?',
          [n.municipio_codigo, n.ref, n.fecha_fin ?? n.fecha, n.fecha],
        );
        for (const c of cercanos) {
          if (!posibleDuplicado(n, c)) continue;
          alertas.push({ tipo: 'duplicado', gravedad: 'bloquea', detalle: `Posible duplicado de ${c.id} "${c.titulo}"` });
          // También en el otro, si sigue pendiente: así el resultado no depende del orden de importación
          if (c.estado === 'pendiente_revision') {
            await db.ejecutar('INSERT OR IGNORE INTO eventos_alertas (evento_id, tipo, gravedad, detalle) VALUES (?, ?, ?, ?)', [c.id, 'duplicado', 'bloquea', `Posible duplicado de ${id} "${n.titulo}"`]);
          }
        }
      }

      const fila = aFila(n);
      const procedencia = json({ formato: l.origen ?? l.formato, archivo: l.archivo_origen ?? archivo, linea: l.linea_origen ?? entrada.linea, lote, original: l.original ?? l.evento ?? null, imagenes: l.imagenes ?? [] });
      const [actual] = await db.consultar('SELECT * FROM eventos WHERE ref_externa = ?', [n.ref]);

      if (actual && actual.estado !== 'pendiente_revision') {
        r.conservados++;
        if (!mismaFila(actual, fila)) {
          await db.ejecutar('INSERT OR IGNORE INTO eventos_alertas (evento_id, tipo, gravedad, detalle) VALUES (?, ?, ?, ?)', [actual.id, 'cambio_en_fuente', 'revisar', `La investigación del lote ${lote} trae datos distintos; el evento (${actual.estado}) no se modificó`]);
        }
        anotar({ ...base, id: actual.id, resultado: 'conservado', mensaje: `Ya está ${actual.estado}: no se modifica` });
        continue;
      }

      const columnas = Object.keys(fila);
      if (!actual) {
        await db.ejecutar(
          `INSERT INTO eventos (id, ref_externa, ${columnas.join(', ')}, estado_investigacion, lote_id, procedencia) VALUES (?, ?, ${columnas.map(() => '?').join(', ')}, ?, ?, ?)`,
          [id, n.ref, ...columnas.map((c) => fila[c]), n.estado_investigacion ?? null, lote, procedencia],
        );
        r.nuevos++;
      } else if (mismaFila(actual, fila)) {
        r.sin_cambios++;
      } else {
        await db.ejecutar(`UPDATE eventos SET ${columnas.map((c) => `${c} = ?`).join(', ')}, estado_investigacion = ?, lote_id = ?, procedencia = ?, actualizado_en = ? WHERE id = ?`, [
          ...columnas.map((c) => fila[c]),
          n.estado_investigacion ?? null,
          lote,
          procedencia,
          ahora(),
          actual.id,
        ]);
        r.actualizados++;
      }
      const eventoId = actual?.id ?? id;

      // Fuentes: se reemplazan por las de la investigación más reciente
      await db.ejecutar('DELETE FROM fuentes_evento WHERE evento_id = ?', [eventoId]);
      for (const f of n.fuentes) {
        await db.ejecutar('INSERT OR IGNORE INTO fuentes_evento (evento_id, url, nombre, tipo, clase, oficial, principal, consultado_en) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [
          eventoId, f.url, f.nombre ?? null, f.tipo ?? null, clasificarFuente(f.url), f.oficial === undefined ? null : Number(f.oficial), Number(Boolean(f.principal)), f.consultado_en ?? null,
        ]);
      }
      // Alertas: primero se insertan las de hoy (o se reabren si las había cerrado el importador) y después se cierran
      // las abiertas que ya no aparecen. Nunca queda un momento sin las alertas que bloquean, y las que resolvió una
      // persona se conservan.
      const claves = new Set(alertas.map((a) => `${a.tipo}|${a.detalle}`));
      for (const a of alertas) {
        await db.ejecutar(
          `INSERT INTO eventos_alertas (evento_id, tipo, gravedad, detalle) VALUES (?, ?, ?, ?)
           ON CONFLICT (evento_id, tipo, detalle) DO UPDATE SET gravedad = excluded.gravedad, resuelta_en = NULL, resuelta_por = NULL, resolucion = NULL
           WHERE eventos_alertas.resuelta_por LIKE 'importador%'`,
          [eventoId, a.tipo, a.gravedad, a.detalle],
        );
      }
      const abiertas = await db.consultar('SELECT id, tipo, detalle FROM eventos_alertas WHERE evento_id = ? AND resuelta_en IS NULL', [eventoId]);
      for (const x of abiertas.filter((x) => !claves.has(`${x.tipo}|${x.detalle}`))) {
        await db.ejecutar('UPDATE eventos_alertas SET resuelta_en = ?, resuelta_por = ?, resolucion = ? WHERE id = ?', [ahora(), `importador (${lote})`, 'Ya no aparece al validar la investigación más reciente', x.id]);
      }
      // Imágenes candidatas (no se descargan)
      for (const img of l.imagenes ?? []) {
        const motivos = motivosImagen(img);
        await db.ejecutar(
          `INSERT INTO eventos_imagenes_candidatas (evento_id, url, pagina, derechos_estado, utilizable, motivos, datos) VALUES (?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT (evento_id, url) DO UPDATE SET derechos_estado = excluded.derechos_estado, utilizable = excluded.utilizable, motivos = excluded.motivos, datos = excluded.datos`,
          [eventoId, img.url ?? null, img.pagina ?? null, img.derechos?.estado ?? 'desconocido', Number(!motivos.length), json(motivos), json(img)],
        );
      }
      const bloqueos = alertas.filter((a) => a.gravedad === 'bloquea').length;
      if (bloqueos) r.con_bloqueo++;
      anotar({ ...base, id: eventoId, resultado: actual ? (mismaFila(actual, fila) ? 'sin_cambios' : 'actualizado') : 'nuevo', mensaje: `pendiente_revision · ${alertas.length} alerta(s), ${bloqueos} bloquean` });
    } catch (e) {
      r.errores++;
      const mensaje = /UNIQUE constraint failed: eventos\.municipio_codigo/.test(e.message)
        ? 'Ya hay otro evento con el mismo municipio, slug y fecha (otra ref): posible duplicado, revísalo antes de importar'
        : e.message;
      anotar({ ...base, resultado: 'error', mensaje });
    }
  }
  const { detalles, ...cifras } = r;
  await db.ejecutar('UPDATE lotes_eventos SET terminado_en = ?, resumen = ? WHERE id = ?', [ahora(), json(cifras), lote]);
  return r;
};

// ---------- Revisión ----------

export const pendientesEventos = (almacen) =>
  almacen.db.consultar(
    `SELECT e.id, e.ref_externa, e.titulo, e.fecha, e.categoria, m.nombre AS municipio, e.tipo_precio, e.precio_desde, e.estado_investigacion,
            SUM(CASE WHEN a.gravedad = 'bloquea' AND a.resuelta_en IS NULL THEN 1 ELSE 0 END) AS bloquean,
            SUM(CASE WHEN a.gravedad = 'revisar' AND a.resuelta_en IS NULL THEN 1 ELSE 0 END) AS revisar
     FROM eventos e LEFT JOIN municipios m ON m.codigo = e.municipio_codigo LEFT JOIN eventos_alertas a ON a.evento_id = e.id
     WHERE e.estado = 'pendiente_revision' GROUP BY e.id ORDER BY e.fecha, e.titulo`,
  );

export const detalleEvento = async (almacen, id) => {
  const [evento] = await almacen.db.consultar('SELECT * FROM eventos WHERE id = ?', [id]);
  if (!evento) throw new ErrorEvento('no_encontrado', `No existe el evento ${id}`);
  const [fuentes, alertas, imagenes, historial] = await Promise.all([
    almacen.db.consultar('SELECT url, clase, oficial, principal FROM fuentes_evento WHERE evento_id = ? ORDER BY principal DESC, id', [id]),
    almacen.db.consultar('SELECT id, tipo, gravedad, detalle, resuelta_por, resolucion FROM eventos_alertas WHERE evento_id = ? ORDER BY resuelta_en IS NOT NULL, gravedad, id', [id]),
    almacen.db.consultar('SELECT url, derechos_estado, utilizable, motivos FROM eventos_imagenes_candidatas WHERE evento_id = ?', [id]),
    almacen.db.consultar('SELECT de, a, por, motivo, en FROM eventos_revisiones WHERE evento_id = ? ORDER BY id', [id]),
  ]);
  return { evento, fuentes, alertas, imagenes, historial };
};

const estadoDe = async (db, id) => {
  const [e] = await db.consultar('SELECT id, estado, fecha, fecha_fin FROM eventos WHERE id = ?', [id]);
  if (!e) throw new ErrorEvento('no_encontrado', `No existe el evento ${id}`);
  return e;
};

export const resolverAlerta = async ({ alertaId, por, resolucion, almacen }) => {
  const persona = exigirPersona(por);
  if (!resolucion || resolucion.trim().length < 10) throw new ErrorEvento('revision', 'Escribe cómo se resolvió (al menos 10 caracteres)');
  const { cambios } = await almacen.db.ejecutar('UPDATE eventos_alertas SET resuelta_en = ?, resuelta_por = ?, resolucion = ? WHERE id = ? AND resuelta_en IS NULL', [ahora(), persona, resolucion.trim(), alertaId]);
  if (!cambios) throw new ErrorEvento('no_encontrado', `La alerta ${alertaId} no existe o ya está resuelta`);
};

// Aprobar: una persona revisó el contenido. Con alertas que bloquean hace falta --forzar y un motivo, que queda
// como resolución de cada alerta. Un evento vencido no se aprueba nunca.
export const aprobarEvento = async ({ id, por, forzar = false, motivo, almacen, hoy = hoyBogota() }) => {
  const persona = exigirPersona(por);
  const e = await estadoDe(almacen.db, id);
  if (e.estado !== 'pendiente_revision') throw new ErrorEvento('estado', `El evento está ${e.estado}; solo se aprueba uno pendiente_revision`);
  if ((e.fecha_fin ?? e.fecha) < hoy) throw new ErrorEvento('vencido', `El evento terminó el ${e.fecha_fin ?? e.fecha}`);
  const bloqueos = await almacen.db.consultar("SELECT id, tipo, detalle FROM eventos_alertas WHERE evento_id = ? AND gravedad = 'bloquea' AND resuelta_en IS NULL", [id]);
  if (bloqueos.length) {
    if (!forzar) throw new ErrorEvento('bloqueado', `Alertas que bloquean:\n${bloqueos.map((b) => `  #${b.id} ${b.tipo}: ${b.detalle}`).join('\n')}\nResuélvelas (resolver <alerta> --por --motivo) o usa --forzar con --motivo`);
    if (!motivo || motivo.trim().length < 10) throw new ErrorEvento('revision', '--forzar exige --motivo con al menos 10 caracteres');
    for (const b of bloqueos) await resolverAlerta({ alertaId: b.id, por: persona, resolucion: `Forzado al aprobar: ${motivo.trim()}`, almacen });
  }
  const en = ahora();
  await almacen.db.ejecutar("UPDATE eventos SET estado = 'aprobado', aprobado_por = ?, aprobado_en = ?, revisado_por = ?, motivo_estado = ?, actualizado_en = ? WHERE id = ?", [persona, en, persona, motivo?.trim() ?? null, en, id]);
  return { id, estado: 'aprobado' };
};

// Publicar: solo un evento aprobado. En B1 esto solo cambia el estado (el sitio todavía no lee D1: B2).
export const publicarEvento = async ({ id, por, almacen, hoy = hoyBogota() }) => {
  const persona = exigirPersona(por);
  const e = await estadoDe(almacen.db, id);
  if (e.estado !== 'aprobado') throw new ErrorEvento('estado', `El evento está ${e.estado}; solo se publica uno aprobado`);
  if ((e.fecha_fin ?? e.fecha) < hoy) throw new ErrorEvento('vencido', `El evento terminó el ${e.fecha_fin ?? e.fecha}`);
  const en = ahora();
  await almacen.db.ejecutar("UPDATE eventos SET estado = 'publicado', publicado_en = ?, revisado_por = ?, actualizado_en = ? WHERE id = ?", [en, persona, en, id]);
  return { id, estado: 'publicado' };
};

const cambiarConMotivo = async ({ id, por, motivo, almacen }, estado, desde) => {
  const persona = exigirPersona(por);
  if (!motivo || motivo.trim().length < 10) throw new ErrorEvento('revision', 'Escribe el motivo (--motivo, al menos 10 caracteres)');
  const e = await estadoDe(almacen.db, id);
  if (!desde.includes(e.estado)) throw new ErrorEvento('estado', `El evento está ${e.estado}; no se puede pasar a ${estado}`);
  const limpiar = estado === 'pendiente_revision' ? ', aprobado_por = NULL, aprobado_en = NULL, publicado_en = NULL' : '';
  await almacen.db.ejecutar(`UPDATE eventos SET estado = ?, revisado_por = ?, motivo_estado = ?, actualizado_en = ?${limpiar} WHERE id = ?`, [estado, persona, motivo.trim(), ahora(), id]);
  return { id, estado };
};

export const rechazarEvento = (o) => cambiarConMotivo(o, 'rechazado', ['pendiente_revision', 'aprobado']);
export const retirarEvento = (o) => cambiarConMotivo(o, 'retirado', ['publicado', 'aprobado']);
export const devolverARevision = (o) => cambiarConMotivo(o, 'pendiente_revision', ['aprobado', 'publicado', 'rechazado', 'retirado']);
