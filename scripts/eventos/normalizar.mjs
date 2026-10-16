// Convierte lo que entrega Gemini al evento normalizado (scripts/eventos/evento.mjs). Dos formatos de entrada:
//
// 1. fulleventos-eventos-imagenes/1 (formato anterior, docs/gemini-eventos-imagenes.md): una línea por evento con
//    `ref`, `evento` e `imagenes`, campos en español. Lo valida scripts/imagenes/formato-gemini.mjs.
// 2. gemini-investigacion/1 (formato de la investigación nacional, oct 2026): varios archivos con campos en inglés.
//    - fulleventos_events_verified.jsonl / _review.jsonl / _rejected.jsonl: un evento por línea (external_id, slug,
//      category, start_datetime, municipality_code, price_type, primary_source_url…)
//    - fulleventos_event_images.jsonl / fulleventos_images_review.jsonl: una IMAGEN por línea, unida por event_slug
//    - fulleventos_corrections.jsonl: correcciones con valores anteriores y nuevos
//    El estado "verified" de Gemini se guarda como dato (`estado_investigacion`) y no autoriza nada.
import { z } from 'astro/zod';
import { categoriasOficiales, categoriaDesdeV1 } from '../../src/data/categorias-oficiales.ts';
import { normalizar, slug } from '../../src/lib/formato.ts';
import { resolverMunicipio, ciudadSitio } from './divipola.mjs';

export const FORMATO_INVESTIGACION = 'gemini-investigacion/1';

const texto = z.string().trim();
const opcional = (s) => s.nullish().transform((v) => (v === null || v === '' ? undefined : v));

export const eventoInvestigacion = z.object({
  external_id: opcional(texto.max(120)),
  title: texto.min(3).max(200),
  slug: opcional(texto.max(160)),
  category: texto.max(80),
  subcategory: opcional(texto.max(80)),
  tags: z.array(texto.max(60)).nullish(),
  short_description: opcional(texto.max(1000)),
  description: opcional(texto.max(5000)),
  seo_description: opcional(texto.max(500)),
  start_datetime: texto,
  end_datetime: opcional(texto),
  timezone: opcional(texto),
  date_status: opcional(texto),
  event_status: opcional(texto),
  attendance_mode: opcional(texto),
  country_code: opcional(texto),
  department: opcional(texto.max(120)),
  department_code: opcional(z.union([texto, z.number()]).transform(String)),
  municipality: opcional(texto.max(120)),
  municipality_code: opcional(z.union([texto, z.number()]).transform(String)),
  venue_name: opcional(texto.max(200)),
  address: opcional(texto.max(300)),
  latitude: z.number().nullish(),
  longitude: z.number().nullish(),
  location_precision: opcional(texto),
  organizer_name: opcional(texto.max(200)),
  organizer_url: opcional(texto),
  price_type: opcional(texto),
  price_min_cop: z.number().nullish(),
  price_max_cop: z.number().nullish(),
  ticket_url: opcional(texto),
  registration_url: opcional(texto),
  age_restriction: opcional(texto.max(40)),
  family_friendly: z.boolean().nullish(),
  primary_source_url: opcional(texto),
  source_urls: z.array(texto).nullish(),
  verification_status: opcional(texto),
  last_verified_at: opcional(texto),
  next_verification_at: opcional(texto),
  discovered_at: opcional(texto),
  publication_status: opcional(texto),
});

export const imagenInvestigacion = z.object({
  event_slug: texto.min(1),
  image_url: opcional(texto),
  source_page_url: opcional(texto),
  image_type: opcional(texto),
  width: z.number().int().positive().nullish(),
  height: z.number().int().positive().nullish(),
  rights_holder: opcional(texto.max(200)),
  license_url: opcional(texto),
  permission_evidence: opcional(texto.max(1000)),
  rights_status: opcional(texto),
  visual_match_status: opcional(texto),
  verified_at: opcional(texto),
  alt_text: opcional(texto.max(300)),
});

export const correccionInvestigacion = z.object({
  event_slug: texto,
  corrected_fields: z.array(texto),
  previous_values: z.record(z.string(), z.any()),
  new_values: z.record(z.string(), z.any()),
  support_sources: z.array(texto).default([]),
  correction_reason: opcional(texto),
});

// Reconoce el formato de una línea ya leída
export const tipoDeLinea = (v) => {
  if (!v || typeof v !== 'object') return null;
  if ('evento' in v && 'ref' in v) return 'v1';
  if ('start_datetime' in v && 'title' in v) return 'evento';
  if ('event_slug' in v && ('image_url' in v || 'rights_status' in v)) return 'imagen';
  if ('event_slug' in v && 'corrected_fields' in v) return 'correccion';
  // Noticias de la investigación: no son eventos (las maneja el centro de noticias, no B1)
  if ('source_url' in v && 'title' in v && ('published_at' in v || 'related_events' in v)) return 'noticia';
  return null;
};

// ---------- Ayudas ----------

const CATEGORIA_POR_NOMBRE = new Map(categoriasOficiales.flatMap((c) => [[normalizar(c.nombre), c.id], [normalizar(c.id), c.id]]));
export const categoriaOficial = (t) => (t ? CATEGORIA_POR_NOMBRE.get(normalizar(t)) ?? null : null);

const PRECIO = { free: 'gratis', paid: 'pago', mixed: 'mixto', unknown: 'desconocido', gratis: 'gratis', pago: 'pago', mixto: 'mixto', desconocido: 'desconocido' };
const ESTADO_FECHA = { confirmed: 'confirmada', provisional: 'provisional', tentative: 'provisional', unknown: 'desconocida' };
const ESTADO_EVENTO = { scheduled: 'programado', postponed: 'aplazado', rescheduled: 'aplazado', cancelled: 'cancelado', canceled: 'cancelado', sold_out: 'agotado', completed: 'finalizado' };
const MODALIDAD = { offline: 'presencial', online: 'virtual', mixed: 'mixta', hybrid: 'mixta' };
const PRECISION = { exact: 'exacta', approximate: 'aproximada', city: 'municipio' };
const DERECHOS = { permission_confirmed: 'confirmado', confirmed: 'confirmado', unknown: 'desconocido', pending: 'pendiente', requested: 'pendiente', denied: 'rechazado', rejected: 'rechazado' };
const VISUAL = { confirmed: 'confirmada', uncertain: 'incierta', mismatch: 'no_coincide' };
const TIPO_IMAGEN = { promotional: 'principal', press_kit: 'principal', poster: 'afiche', gallery: 'galeria', logo: 'logo' };

// ISO con zona → fecha y hora en Bogotá (UTC−5, sin horario de verano)
export const fechaHoraBogota = (iso) => {
  if (!iso) return {};
  if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) return { fecha: iso };
  const d = new Date(iso);
  if (Number.isNaN(d.getTime()) || !/([+-]\d{2}:?\d{2}|Z)$/.test(iso)) return { error: `Fecha sin zona horaria o inválida: ${iso}` };
  const b = new Date(d.getTime() - 5 * 3600 * 1000).toISOString();
  return { fecha: b.slice(0, 10), hora: b.slice(11, 16) };
};

const urlValida = (u) => {
  try {
    return ['https:', 'http:'].includes(new URL(u).protocol) ? u : undefined;
  } catch {
    return undefined;
  }
};

export const slugEvento = (titulo, fecha, municipio) => {
  const base = slug(titulo).slice(0, 80);
  const anio = fecha.slice(0, 4);
  const partes = [base, base.includes(anio) ? null : anio, municipio && !base.includes(slug(municipio)) ? slug(municipio) : null];
  return partes.filter(Boolean).join('-').slice(0, 120).replace(/-$/, '');
};

const ubicar = ({ codigo, nombre, departamento, departamentoCodigo }, avisos) => {
  if (!codigo && !nombre) return { municipio_codigo: null, departamento_codigo: departamentoCodigo ?? null };
  const r = resolverMunicipio({ codigo, nombre, departamento, departamentoCodigo });
  if (r.error) {
    avisos.push({ tipo: 'municipio', gravedad: 'bloquea', detalle: r.error });
    return { municipio_codigo: null, departamento_codigo: departamentoCodigo ?? null, municipio: nombre, departamento };
  }
  const m = r.municipio;
  return { municipio_codigo: m.codigo, municipio: m.nombre, departamento_codigo: m.departamento_codigo, departamento: m.departamento, ciudad_sitio: ciudadSitio(m.codigo) };
};

// ---------- Formato de investigación ----------

export const imagenDesdeInvestigacion = (i) => ({
  url: urlValida(i.image_url),
  pagina: urlValida(i.source_page_url),
  tipo: TIPO_IMAGEN[i.image_type] ?? i.image_type ?? 'principal',
  ancho: i.width ?? undefined,
  alto: i.height ?? undefined,
  texto_alternativo: i.alt_text,
  fuente: { nombre: i.rights_holder, url: urlValida(i.source_page_url) },
  derechos: {
    estado: DERECHOS[i.rights_status] ?? 'desconocido',
    licencia_url: urlValida(i.license_url),
    // La "evidencia" de Gemini suele ser una afirmación: se guarda como texto, no cuenta como documento
    evidencias: i.permission_evidence ? [{ texto: i.permission_evidence, ...(urlValida(i.permission_evidence) ? { url: i.permission_evidence } : {}) }] : [],
    verificado_en: i.verified_at?.slice(0, 10),
  },
  coincidencia_visual: VISUAL[i.visual_match_status] ?? 'incierta',
  original: i,
});

// Devuelve { evento, avisos } — avisos son alertas de conversión (se suman a las de las reglas)
export const desdeInvestigacion = (r) => {
  const avisos = [];
  const ini = fechaHoraBogota(r.start_datetime);
  const fin = fechaHoraBogota(r.end_datetime);
  if (ini.error) throw new Error(ini.error);
  if (fin.error) avisos.push({ tipo: 'fecha', gravedad: 'revisar', detalle: fin.error });
  if (r.timezone && r.timezone !== 'America/Bogota') avisos.push({ tipo: 'fecha', gravedad: 'revisar', detalle: `Zona horaria ${r.timezone}` });
  if (r.country_code && r.country_code !== 'CO') throw new Error(`El evento no es en Colombia (${r.country_code})`);

  let tipoPrecio = PRECIO[r.price_type ?? 'unknown'];
  if (r.price_type === 'donation') {
    tipoPrecio = 'desconocido';
    avisos.push({ tipo: 'precio', gravedad: 'revisar', detalle: 'Aporte voluntario: se guardó como precio desconocido' });
  } else if (!tipoPrecio) {
    tipoPrecio = 'desconocido';
    avisos.push({ tipo: 'precio', gravedad: 'revisar', detalle: `Tipo de precio "${r.price_type}" no reconocido` });
  }
  let desde = r.price_min_cop ?? undefined;
  let hasta = r.price_max_cop ?? undefined;
  // Gratis con 0 es lo mismo que gratis sin cifra; gratis con cifra > 0 lo rechaza el esquema
  if (tipoPrecio === 'gratis' && !desde && !hasta) {
    desde = undefined;
    hasta = undefined;
  }
  if (tipoPrecio === 'desconocido' && (desde !== undefined || hasta !== undefined)) {
    tipoPrecio = 'pago';
    avisos.push({ tipo: 'precio', gravedad: 'revisar', detalle: 'Tenía cifra de precio con tipo desconocido: se tomó como pago' });
  }

  const lugar = ubicar({ codigo: r.municipality_code, nombre: r.municipality, departamento: r.department, departamentoCodigo: r.department_code }, avisos);
  const categoria = categoriaOficial(r.category);
  const fuentes = [];
  const vistas = new Set();
  for (const [i, u] of [r.primary_source_url, ...(r.source_urls ?? [])].entries()) {
    const v = urlValida(u);
    if (!u) continue;
    if (!v) {
      avisos.push({ tipo: 'fuente_insuficiente', gravedad: 'revisar', detalle: `Fuente con URL inválida: ${u}` });
      continue;
    }
    if (vistas.has(v)) continue;
    vistas.add(v);
    fuentes.push({ url: v, principal: i === 0 || undefined });
  }

  const evento = {
    ref: r.external_id ?? r.slug ?? slugEvento(r.title, ini.fecha, r.municipality),
    titulo: r.title,
    slug: r.slug && /^[a-z0-9-]{3,120}$/.test(r.slug) ? r.slug : slugEvento(r.title, ini.fecha, lugar.municipio ?? r.municipality),
    categoria,
    categoria_origen: r.category,
    subcategoria: r.subcategory,
    etiquetas: r.tags ?? [],
    resumen: r.short_description,
    descripcion: r.description,
    fecha: ini.fecha,
    fecha_fin: fin.fecha && fin.fecha !== ini.fecha ? fin.fecha : undefined,
    hora: ini.hora && ini.hora !== '00:00' ? ini.hora : undefined,
    hora_fin: fin.hora,
    estado_fecha: ESTADO_FECHA[r.date_status] ?? 'desconocida',
    estado_evento: ESTADO_EVENTO[r.event_status] ?? 'programado',
    modalidad: MODALIDAD[r.attendance_mode] ?? 'presencial',
    ...lugar,
    lugar: r.venue_name,
    direccion: r.address,
    latitud: r.latitude ?? undefined,
    longitud: r.longitude ?? undefined,
    precision_ubicacion: PRECISION[r.location_precision],
    organizador: r.organizer_name,
    url_organizador: urlValida(r.organizer_url),
    tipo_precio: tipoPrecio,
    precio_desde: desde,
    precio_hasta: hasta,
    url_venta: urlValida(r.ticket_url),
    url_registro: urlValida(r.registration_url),
    restriccion_edad: r.age_restriction,
    apto_familia: r.family_friendly ?? undefined,
    fuentes,
    estado_investigacion: r.verification_status,
  };
  return { evento, avisos };
};

// ---------- Formato anterior (v1) ----------

export const desdeV1 = (linea) => {
  const avisos = [];
  const v = linea.evento;
  const categoria = v.categoria ? categoriaDesdeV1[v.categoria] ?? categoriaOficial(v.categoria) : null;
  const lugar = ubicar({ nombre: v.ciudad, departamento: v.departamento }, avisos);
  let tipoPrecio = 'desconocido';
  if (v.gratis === true) tipoPrecio = 'gratis';
  else if (v.precio_desde > 0 || v.gratis === false) tipoPrecio = 'pago';
  const evento = {
    ref: linea.ref,
    titulo: v.titulo,
    slug: slugEvento(v.titulo, v.fecha, lugar.municipio ?? v.ciudad),
    categoria,
    categoria_origen: v.categoria,
    resumen: v.resumen,
    fecha: v.fecha,
    fecha_fin: v.fecha_fin,
    hora: v.hora,
    estado_fecha: 'desconocida',
    estado_evento: { programado: 'programado', aplazado: 'aplazado', cancelado: 'cancelado', agotado: 'agotado' }[v.estado_evento] ?? 'programado',
    ...lugar,
    lugar: v.lugar,
    direccion: v.direccion,
    organizador: v.organizador,
    tipo_precio: tipoPrecio,
    precio_desde: tipoPrecio === 'gratis' ? undefined : v.precio_desde === undefined ? undefined : Math.round(v.precio_desde),
    url_oficial: v.url_oficial,
    url_venta: v.url_venta,
    fuentes: v.fuentes.map((f, i) => ({ ...f, principal: i === 0 || undefined })),
  };
  if (v.gratis === true && v.precio_desde > 0) avisos.push({ tipo: 'precio', gravedad: 'bloquea', detalle: 'Dice gratis y trae precio' });
  return { evento, avisos };
};
