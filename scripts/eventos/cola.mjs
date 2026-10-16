// Cola de eventos nuevos (eventos-nuevos.jsonl): lo que deja el adaptador y lee `npm run eventos -- importar`.
// Cada línea lleva el evento ya normalizado (`normalizado`), las alertas de las reglas, las imágenes candidatas y el
// original completo, para que la persona que revisa vea de dónde salió cada dato.
import { eventoNormalizado, validarReglas, posibleDuplicado, FORMATO_EVENTO } from './evento.mjs';
import { desdeInvestigacion, desdeV1, imagenDesdeInvestigacion, eventoInvestigacion, imagenInvestigacion, correccionInvestigacion, FORMATO_INVESTIGACION } from './normalizar.mjs';

export const FORMATO_COLA = 'fulleventos-cola/1';

const errores = (zodError) => zodError.issues.map((x) => `${x.path.join('.') || 'línea'}: ${x.message}`).join('; ');

// Normaliza y valida; devuelve { normalizado, alertas } o lanza Error con el detalle
export const prepararEvento = ({ evento, avisos }, { hoy, imagenes = [] }) => {
  const v = eventoNormalizado.safeParse(evento);
  if (!v.success) throw new Error(errores(v.error));
  return { normalizado: { formato: FORMATO_EVENTO, ...v.data }, alertas: [...avisos, ...validarReglas(v.data, { hoy, imagenes })] };
};

export const lineaColaV1 = (linea, hoy) => prepararEvento(desdeV1(linea), { hoy, imagenes: linea.imagenes });

// Duplicados dentro del mismo lote: misma ref, mismo slug o mismo municipio + fecha + título parecido
export const marcarDuplicadosEnLote = (lineas) => {
  let encontrados = 0;
  lineas.forEach((a, i) => {
    for (const b of lineas.slice(0, i)) {
      const mismo = a.ref === b.ref ? 'la misma ref' : a.normalizado.slug === b.normalizado.slug ? 'el mismo slug' : posibleDuplicado(a.normalizado, b.normalizado) ? 'municipio, fecha y título parecidos' : null;
      if (mismo) {
        a.alertas.push({ tipo: 'duplicado', gravedad: 'bloquea', detalle: `Posible duplicado de ${b.ref} (${mismo}) en el mismo lote` });
        encontrados++;
        break;
      }
    }
  });
  return encontrados;
};

// Formato de investigación: entradas ya leídas ({ linea, valor, archivo }) de varios archivos
export const adaptarInvestigacion = ({ entradas, hoy, existentes = [] }) => {
  const reporte = { formato: FORMATO_INVESTIGACION, eventos: 0, eventos_existentes: 0, eventos_nuevos: 0, rechazados_en_origen: [], noticias_ignoradas: 0, imagenes: 0, imagenes_sin_evento: [], correcciones: [], errores: [] };
  const eventos = [];
  const imagenesPorSlug = new Map();
  const correcciones = [];
  for (const e of entradas) {
    if (e.tipo === 'noticia') {
      reporte.noticias_ignoradas++;
      continue;
    }
    const esquema = { evento: eventoInvestigacion, imagen: imagenInvestigacion, correccion: correccionInvestigacion }[e.tipo];
    const v = esquema.safeParse(e.valor);
    if (!v.success) {
      reporte.errores.push({ archivo: e.archivo, linea: e.linea, error: errores(v.error) });
      continue;
    }
    if (e.tipo === 'evento') eventos.push({ ...e, valor: v.data });
    if (e.tipo === 'imagen') {
      reporte.imagenes++;
      const lista = imagenesPorSlug.get(v.data.event_slug) ?? [];
      lista.push(imagenDesdeInvestigacion(v.data));
      imagenesPorSlug.set(v.data.event_slug, lista);
    }
    if (e.tipo === 'correccion') correcciones.push(v.data);
  }

  const cola = [];
  const slugsOrigen = new Set();
  for (const e of eventos) {
    const r = e.valor;
    reporte.eventos++;
    if (r.slug) slugsOrigen.add(r.slug);
    if (r.verification_status === 'rejected') {
      reporte.rechazados_en_origen.push({ ref: r.external_id ?? r.slug, titulo: r.title, archivo: e.archivo });
      continue;
    }
    const imagenes = imagenesPorSlug.get(r.slug) ?? [];
    let preparado;
    try {
      preparado = prepararEvento(desdeInvestigacion(r), { hoy, imagenes });
    } catch (err) {
      reporte.errores.push({ archivo: e.archivo, linea: e.linea, ref: r.external_id ?? r.slug, error: err.message });
      continue;
    }
    const n = preparado.normalizado;
    // ¿Ya existe en el sitio (src/data/eventos.ts)? Hoy no tienen código DIVIPOLA: se compara ciudad del sitio + fecha
    const existente = existentes.find((x) => n.ciudad_sitio && x.ciudad === n.ciudad_sitio && x.fecha === n.fecha && posibleDuplicado({ ...n, municipio_codigo: 'x' }, { ...x, municipio_codigo: 'x' }));
    if (existente) {
      reporte.eventos_existentes++;
      preparado.alertas.push({ tipo: 'duplicado', gravedad: 'bloquea', detalle: `Ya existe en el sitio como ${existente.id}` });
    } else reporte.eventos_nuevos++;
    cola.push({
      formato: FORMATO_COLA,
      origen: FORMATO_INVESTIGACION,
      ref: n.ref,
      normalizado: n,
      alertas: preparado.alertas,
      imagenes,
      posibles_duplicados: existente ? [{ id: existente.id, titulo: existente.titulo }] : [],
      archivo_origen: e.archivo,
      linea_origen: e.linea,
      original: r,
    });
  }

  for (const slug of imagenesPorSlug.keys()) if (!slugsOrigen.has(slug)) reporte.imagenes_sin_evento.push(slug);

  // Correcciones: se comprueba que el archivo de eventos ya las tenga; no se aplican solas
  for (const c of correcciones) {
    const ev = eventos.find((e) => e.valor.slug === c.event_slug)?.valor;
    if (!ev) {
      reporte.correcciones.push({ evento: c.event_slug, estado: 'evento_no_encontrado' });
      continue;
    }
    const aplicada = Object.entries(c.new_values).every(([k, v]) => JSON.stringify(ev[k]) === JSON.stringify(v));
    reporte.correcciones.push({ evento: c.event_slug, campos: c.corrected_fields, estado: aplicada ? 'aplicada' : 'no_aplicada' });
    if (!aplicada) {
      const linea = cola.find((l) => l.original.slug === c.event_slug);
      linea?.alertas.push({ tipo: 'correccion', gravedad: 'bloquea', detalle: `Hay una corrección de ${c.corrected_fields.join(', ')} que no está aplicada: ${c.correction_reason ?? ''}`.trim() });
    }
  }

  return { cola, reporte };
};

// Conteo de alertas por gravedad y tipo, para el reporte
export const resumenAlertas = (cola) => {
  const r = { bloquea: 0, revisar: 0, aviso: 0, por_tipo: {}, eventos_con_bloqueo: 0 };
  for (const l of cola) {
    if (l.alertas.some((a) => a.gravedad === 'bloquea')) r.eventos_con_bloqueo++;
    for (const a of l.alertas) {
      r[a.gravedad]++;
      r.por_tipo[a.tipo] = (r.por_tipo[a.tipo] ?? 0) + 1;
    }
  }
  return r;
};
