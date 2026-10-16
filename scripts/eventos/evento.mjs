// Evento normalizado de la etapa B (`fulleventos-evento/1`): la forma única en que llega un evento al importador,
// venga del formato anterior de Gemini (fulleventos-eventos-imagenes/1) o del formato de investigación
// (gemini-investigacion/1). Aquí también están las reglas de validación que se conservan del lote de prueba:
// fuentes insuficientes, fechas vencidas, duplicados, derechos de imágenes y datos que no se pueden inventar.
//
// Una alerta tiene { tipo, gravedad, detalle }:
//   bloquea  → el evento no se puede aprobar hasta resolverla (o con --forzar y un motivo escrito por una persona)
//   revisar  → la persona que aprueba debe mirarla
//   aviso    → informativa
import { z } from 'astro/zod';
import { categoriasOficiales } from '../../src/data/categorias-oficiales.ts';
import { normalizar, slug } from '../../src/lib/formato.ts';

export const FORMATO_EVENTO = 'fulleventos-evento/1';
export const IDS_CATEGORIA = categoriasOficiales.map((c) => c.id);
export const TIPOS_PRECIO = ['gratis', 'pago', 'mixto', 'desconocido'];

const fecha = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha AAAA-MM-DD');
const url = z
  .string()
  .max(2048)
  .refine((s) => {
    try {
      return ['https:', 'http:'].includes(new URL(s).protocol);
    } catch {
      return false;
    }
  }, 'URL inválida');

export const fuenteEvento = z.object({
  nombre: z.string().trim().max(200).optional(),
  url,
  tipo: z.string().trim().max(40).optional(),
  oficial: z.boolean().optional(),
  consultado_en: fecha.optional(),
  principal: z.boolean().optional(),
});

export const eventoNormalizado = z
  .object({
    ref: z.string().trim().min(3).max(200),
    titulo: z.string().trim().min(3).max(200),
    slug: z.string().regex(/^[a-z0-9-]{3,120}$/),
    categoria: z.enum(IDS_CATEGORIA).nullable(),
    categoria_origen: z.string().max(80).optional(),
    subcategoria: z.string().trim().max(80).optional(),
    etiquetas: z.array(z.string().trim().max(60)).max(20).default([]),
    resumen: z.string().trim().max(1000).optional(),
    descripcion: z.string().trim().max(5000).optional(),
    fecha,
    fecha_fin: fecha.optional(),
    hora: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional(),
    hora_fin: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional(),
    zona_horaria: z.literal('America/Bogota').default('America/Bogota'),
    estado_fecha: z.enum(['confirmada', 'provisional', 'desconocida']).default('desconocida'),
    estado_evento: z.enum(['programado', 'aplazado', 'cancelado', 'agotado', 'finalizado']).default('programado'),
    modalidad: z.enum(['presencial', 'virtual', 'mixta']).default('presencial'),
    municipio_codigo: z.string().regex(/^\d{5}$/).nullable(),
    municipio: z.string().max(120).optional(),
    departamento_codigo: z.string().regex(/^\d{2}$/).nullable(),
    departamento: z.string().max(120).optional(),
    ciudad_sitio: z.string().max(40).nullable().default(null),
    lugar: z.string().trim().max(200).optional(),
    direccion: z.string().trim().max(300).optional(),
    latitud: z.number().min(-5).max(14).optional(),
    longitud: z.number().min(-82).max(-66).optional(),
    precision_ubicacion: z.enum(['exacta', 'aproximada', 'municipio']).optional(),
    organizador: z.string().trim().max(200).optional(),
    url_organizador: url.optional(),
    tipo_precio: z.enum(TIPOS_PRECIO),
    precio_desde: z.number().int().nonnegative().optional(),
    precio_hasta: z.number().int().nonnegative().optional(),
    moneda: z.literal('COP').default('COP'),
    url_oficial: url.optional(),
    url_venta: url.optional(),
    url_registro: url.optional(),
    restriccion_edad: z.string().trim().max(40).optional(),
    apto_familia: z.boolean().optional(),
    fuentes: z.array(fuenteEvento).max(20),
    estado_investigacion: z.string().max(40).optional(),
  })
  // Precios: nunca se inventa una cifra. Gratis no lleva precio; desconocido no lleva precio; pago y mixto pueden
  // venir sin cifra (la interfaz dirá "Consultar precio").
  .superRefine((e, ctx) => {
    if (e.tipo_precio === 'gratis' && ((e.precio_desde ?? 0) > 0 || e.precio_hasta !== undefined)) {
      ctx.addIssue({ code: 'custom', path: ['precio_desde'], message: 'Un evento gratis no puede tener precio' });
    }
    if (e.tipo_precio === 'desconocido' && (e.precio_desde !== undefined || e.precio_hasta !== undefined)) {
      ctx.addIssue({ code: 'custom', path: ['tipo_precio'], message: 'Si hay precio, el tipo no es desconocido' });
    }
    if (e.precio_desde !== undefined && e.precio_hasta !== undefined && e.precio_hasta < e.precio_desde) {
      ctx.addIssue({ code: 'custom', path: ['precio_hasta'], message: 'El precio máximo es menor que el mínimo' });
    }
    if (e.fecha_fin && e.fecha_fin < e.fecha) ctx.addIssue({ code: 'custom', path: ['fecha_fin'], message: 'Termina antes de empezar' });
  });

// ---------- Fuentes ----------

const BOLETERAS = ['tuboleta.com', 'ticketmaster.co', 'eticket.co', 'primerafila.com.co', 'taquillalive.com', 'passline.com', 'tuticket.com.co', 'ticketshop.com.co', 'colboletos.com'];
const REDES = ['facebook.com', 'instagram.com', 'x.com', 'twitter.com', 'tiktok.com', 'youtube.com', 'linktr.ee'];
// No dicen nada del evento: ayuda de buscadores, paneles de conocimiento, acortadores, buscadores de imágenes
const NO_VALIDAS = ['support.google.com', 'google.com', 'www.google.com', 'gstatic.com', 'bing.com', 'bit.ly', 'wikipedia.org'];
// Sitios comerciales que publican agendas sin ser organizadores (blogs de transporte, alquiler, turismo genérico).
// Lista abierta: se amplía cuando aparezca otro. Sirven como pista, no como fuente.
export const SECUNDARIAS = ['flotalamacarena.com', 'localiza.com', 'despegar.com', 'booking.com', 'tripadvisor.com', 'civitatis.com'];

const dominio = (u) => {
  try {
    return new URL(u).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return '';
  }
};
const esDe = (host, lista) => lista.some((d) => host === d || host.endsWith(`.${d}`));

export const clasificarFuente = (u) => {
  const host = dominio(u);
  let ruta = '/';
  try {
    ruta = new URL(u).pathname;
  } catch {
    /* url inválida: la rechaza el esquema */
  }
  if (esDe(host, NO_VALIDAS)) return 'no_valida';
  if (esDe(host, REDES)) return 'red_social';
  if (esDe(host, SECUNDARIAS)) return 'secundaria';
  if (ruta === '' || ruta === '/' || /^\/(es|en|es-co)\/?$/.test(ruta)) return 'portada';
  if (host.endsWith('.gov.co') || host.endsWith('.edu.co')) return 'gobierno';
  if (esDe(host, BOLETERAS)) return 'boletera';
  return 'otra';
};
export const esBoletera = (u) => esDe(dominio(u), BOLETERAS);

// ---------- Reglas ----------

const ANIO = /\b(20\d{2})\b/g;

export const validarReglas = (e, { hoy, imagenes = [] }) => {
  const alertas = [];
  const a = (tipo, gravedad, detalle) => alertas.push({ tipo, gravedad, detalle });

  // Vigencia
  const termina = e.fecha_fin ?? e.fecha;
  if (termina < hoy) a('vencido', 'bloquea', `El evento terminó el ${termina}`);
  if (['cancelado', 'finalizado'].includes(e.estado_evento)) a('estado_evento', 'bloquea', `Estado del evento: ${e.estado_evento}`);
  if (e.estado_fecha !== 'confirmada') a('fecha', 'revisar', `Fecha ${e.estado_fecha}`);
  const anios = [...new Set([...e.titulo.matchAll(ANIO)].map((m) => m[1]))];
  if (anios.length && !anios.includes(e.fecha.slice(0, 4)) && !anios.includes(termina.slice(0, 4))) {
    a('edicion', 'revisar', `El título menciona ${anios.join(', ')} pero el evento es en ${e.fecha.slice(0, 4)}`);
  }

  // Fuentes
  if (!e.fuentes.length) a('fuente_insuficiente', 'bloquea', 'El evento no tiene ninguna fuente');
  const tipos = e.fuentes.map((f) => ({ ...f, clase: clasificarFuente(f.url) }));
  const principal = tipos.find((f) => f.principal) ?? tipos[0];
  if (principal) {
    const motivo = { no_valida: 'no habla del evento (ayuda o buscador)', red_social: 'es una red social', secundaria: 'es un sitio comercial que no organiza el evento', portada: 'es la portada del sitio, no la página del evento' }[principal.clase];
    if (motivo) a('fuente_insuficiente', 'bloquea', `La fuente principal ${motivo}: ${principal.url}`);
  }
  const utiles = tipos.filter((f) => ['gobierno', 'boletera', 'otra'].includes(f.clase));
  if (tipos.length && !utiles.length) a('fuente_insuficiente', 'bloquea', 'Ninguna fuente sirve para confirmar el evento');
  else if (tipos.length === 1) a('fuente_insuficiente', 'revisar', 'Una sola fuente: falta una confirmación independiente');
  if (tipos.length && !tipos.some((f) => f.oficial === true || f.clase === 'gobierno' || f.clase === 'boletera')) {
    a('fuente_insuficiente', 'revisar', 'Ninguna fuente está marcada como oficial (organizador, escenario, boletera o entidad pública)');
  }

  // Ubicación y categoría (no se adivinan)
  if (!e.municipio_codigo) a('municipio', 'bloquea', 'Sin municipio DIVIPOLA');
  if (!e.categoria) a('categoria', 'bloquea', `La categoría "${e.categoria_origen ?? '—'}" no es una de las 14 oficiales`);
  if (e.precision_ubicacion && e.precision_ubicacion !== 'exacta') a('ubicacion', 'aviso', `Ubicación con precisión "${e.precision_ubicacion}"`);

  // Precio (nunca se inventa)
  if (['pago', 'mixto'].includes(e.tipo_precio) && e.precio_desde === undefined) a('precio', 'aviso', 'Sin cifra de precio: se mostrará "Consultar precio"');
  if (e.tipo_precio === 'desconocido') a('precio', 'aviso', 'No se sabe si es gratis o pago');

  // Enlaces y organizador
  if (e.url_venta && /\/images?\//i.test(new URL(e.url_venta).pathname)) a('url_venta', 'revisar', 'El enlace de venta apunta a una carpeta de imágenes, no a la ficha de compra');
  if (e.url_venta && clasificarFuente(e.url_venta) === 'portada') a('url_venta', 'revisar', 'El enlace de venta es la portada de la boletera');
  if (e.organizador && BOLETERAS.some((b) => normalizar(e.organizador).replace(/\s/g, '').includes(b.split('.')[0]))) {
    a('organizador', 'revisar', `"${e.organizador}" es la boletera, no el organizador`);
  }

  // Imágenes: solo con permiso comprobable (licencia o documento enlazado + coincidencia visual confirmada)
  for (const img of imagenes) {
    const motivos = motivosImagen(img);
    if (motivos.length) a('derechos_imagen', 'aviso', `Imagen ${img.url ?? '(sin URL)'} no se puede usar: ${motivos.join('; ')}`);
  }
  return alertas;
};

export const motivosImagen = (img) => {
  const m = [];
  if (!img.url) m.push('sin URL de la imagen');
  else if (['no_valida'].includes(clasificarFuente(img.url))) m.push('alojada en un buscador');
  const d = img.derechos ?? {};
  if (d.estado !== 'confirmado') m.push(`derechos "${d.estado ?? 'desconocido'}"`);
  const conDocumento = d.licencia_url || (d.evidencias ?? []).some((x) => x.url);
  if (!conDocumento) m.push('sin licencia ni documento de permiso enlazado');
  if (img.coincidencia_visual && img.coincidencia_visual !== 'confirmada') m.push(`coincidencia visual "${img.coincidencia_visual}"`);
  if (!img.texto_alternativo) m.push('sin texto alternativo');
  return m;
};

// ---------- Duplicados ----------

const palabras = (t) => new Set(normalizar(t).split(' ').filter((p) => p.length > 2 && !/^(20\d\d|del|las|los|con|para)$/.test(p)));
export const parecido = (a, b) => {
  const x = palabras(a);
  const y = palabras(b);
  if (!x.size || !y.size) return 0;
  let comunes = 0;
  for (const p of x) if (y.has(p)) comunes++;
  return comunes / Math.min(x.size, y.size);
};

// Mismo municipio, fechas que se cruzan y título parecido (≥ 0,6 de las palabras del más corto)
export const posibleDuplicado = (a, b) =>
  a.municipio_codigo &&
  a.municipio_codigo === b.municipio_codigo &&
  a.fecha <= (b.fecha_fin ?? b.fecha) &&
  b.fecha <= (a.fecha_fin ?? a.fecha) &&
  (slug(a.titulo) === slug(b.titulo) || parecido(a.titulo, b.titulo) >= 0.6);

export const hoyBogota = (ahora = new Date()) => new Date(ahora.getTime() - 5 * 3600 * 1000).toISOString().slice(0, 10);
