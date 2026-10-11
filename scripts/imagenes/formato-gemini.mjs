// Formato `fulleventos_event_images.jsonl` (v1): lo que entrega Gemini Deep Research. Una línea por EVENTO, con
// los datos del evento (también de eventos que todavía no existen en Fulleventos) y sus imágenes, cada una con su
// fuente, licencia y evidencias. Guía para Gemini: docs/gemini-eventos-imagenes.md · JSON Schema:
// docs/esquemas/fulleventos_event_images.v1.schema.json.
//
// Deep Research no siempre respeta un formato al pie de la letra, así que la lectura es tolerante y deja constancia
// de cada arreglo: bloques ```json, texto antes o después, comillas tipográficas, comas finales, null / "N/A",
// "sí"/"no" como booleanos y fechas DD/MM/AAAA. Lo que no se puede interpretar se reporta y no se inventa.
import { z } from 'astro/zod';

export const FORMATO = 'fulleventos-eventos-imagenes/1';

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

const fuente = z.object({
  nombre: z.string().trim().min(2).max(120),
  url,
  tipo: z.enum(['organizador', 'escenario', 'boletera', 'artista', 'gobierno', 'prensa', 'otro']).optional(),
  oficial: z.boolean().optional(),
  consultado_en: fecha.optional(),
});

const evidencia = z
  .object({ url: url.optional(), texto: z.string().trim().max(1000).optional(), cita: z.string().trim().max(1000).optional() })
  .refine((e) => e.url || e.texto || e.cita, 'La evidencia necesita url, texto o cita');

export const imagenV1 = z.object({
  url,
  pagina: url.optional(),
  tipo: z.enum(['principal', 'afiche', 'galeria']).default('principal'),
  texto_alternativo: z.string().trim().min(10).max(300),
  credito: z.string().trim().max(200).optional(),
  autor: z.string().trim().max(200).optional(),
  ancho: z.number().int().positive().optional(),
  alto: z.number().int().positive().optional(),
  fuente: fuente.extend({ oficial: z.boolean() }),
  derechos: z.object({
    estado: z.enum(['confirmado', 'pendiente', 'rechazado', 'desconocido']),
    licencia: z.string().trim().max(500).optional(),
    licencia_url: url.optional(),
    evidencias: z.array(evidencia).max(20).default([]),
    verificado_en: fecha.optional(),
  }),
});

export const eventoV1 = z.object({
  id: z.string().regex(/^[a-z0-9_-]{1,64}$/).optional(),
  titulo: z.string().trim().min(3).max(200),
  ciudad: z.string().trim().min(2).max(60),
  departamento: z.string().trim().max(60).optional(),
  fecha,
  fecha_fin: fecha.optional(),
  hora: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Hora HH:MM (24 h)').optional(),
  lugar: z.string().trim().max(200).optional(),
  direccion: z.string().trim().max(300).optional(),
  categoria: z.enum(['Rumba', 'Conciertos', 'Deporte', 'Arte y teatro', 'Comida', 'Otro']).optional(),
  gratis: z.boolean().optional(),
  precio_desde: z.number().nonnegative().optional(),
  moneda: z.string().length(3).default('COP'),
  organizador: z.string().trim().max(200).optional(),
  url_oficial: url.optional(),
  url_venta: url.optional(),
  resumen: z.string().trim().max(1000).optional(),
  estado_evento: z.enum(['programado', 'aplazado', 'cancelado', 'agotado']).default('programado'),
  fuentes: z.array(fuente).min(1, 'El evento necesita al menos una fuente').max(20),
});

export const lineaV1 = z.object({
  formato: z.literal(FORMATO).optional(),
  // Clave estable del evento en la investigación: la misma en todas las corridas (idempotencia)
  ref: z.string().trim().min(3).max(200),
  evento: eventoV1,
  imagenes: z.array(imagenV1).max(10).default([]),
  notas: z.string().max(2000).optional(),
});

// ---------- Lectura tolerante ----------

const VACIOS = new Set(['', 'n/a', 'na', 'no disponible', 'desconocido/no aplica', 'null', 'none', '-', '—']);

// null, "", "N/A"… → ausente; "sí"/"no" → booleano en campos booleanos; DD/MM/AAAA → AAAA-MM-DD
const BOOLEANOS = new Set(['oficial', 'gratis']);
const FECHAS = new Set(['fecha', 'fecha_fin', 'verificado_en', 'consultado_en']);
export const limpiar = (valor, clave = '', avisos = []) => {
  if (valor === null || valor === undefined) return undefined;
  if (Array.isArray(valor)) return valor.map((v) => limpiar(v, clave, avisos)).filter((v) => v !== undefined);
  if (typeof valor === 'object') {
    const salida = {};
    for (const [k, v] of Object.entries(valor)) {
      const limpio = limpiar(v, k, avisos);
      if (limpio !== undefined) salida[k] = limpio;
    }
    return salida;
  }
  if (typeof valor === 'string') {
    const t = valor.trim();
    if (VACIOS.has(t.toLowerCase())) return undefined;
    if (BOOLEANOS.has(clave)) {
      if (/^(s[ií]|true|verdadero|yes)$/i.test(t)) return true;
      if (/^(no|false|falso)$/i.test(t)) return false;
    }
    if (FECHAS.has(clave)) {
      const m = t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (m) {
        avisos.push(`${clave}: "${t}" se leyó como día/mes/año`);
        return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
      }
      const iso = t.match(/^(\d{4}-\d{2}-\d{2})T/);
      if (iso) return iso[1];
    }
    if (['precio_desde', 'ancho', 'alto'].includes(clave) && /^\$?\s*[\d.,]+$/.test(t)) {
      const n = Number(t.replace(/[$\s.]/g, '').replace(',', '.'));
      if (Number.isFinite(n)) {
        avisos.push(`${clave}: "${t}" se leyó como ${n}`);
        return n;
      }
    }
    return t;
  }
  return valor;
};

const intentarJson = (texto, avisos) => {
  try {
    return JSON.parse(texto);
  } catch {
    /* sigue con los arreglos */
  }
  let arreglado = texto.replace(/,\s*([}\]])/g, '$1');
  if (arreglado !== texto) {
    try {
      const v = JSON.parse(arreglado);
      avisos.push('se quitaron comas finales');
      return v;
    } catch {
      /* sigue */
    }
  }
  arreglado = arreglado.replace(/[“”]/g, '"');
  try {
    const v = JSON.parse(arreglado);
    avisos.push('se cambiaron comillas tipográficas por comillas rectas');
    return v;
  } catch (e) {
    throw new Error(`JSON inválido: ${e.message}`);
  }
};

// Devuelve [{ linea, valor?, error?, avisos[] }] y la cantidad de líneas de texto ignoradas
export const leerArchivoGemini = (contenido) => {
  const lineas = contenido.replace(/^﻿/, '').split(/\r?\n/);
  const entradas = [];
  let ignoradas = 0;
  const cuerpo = lineas.map((l) => l.trim());
  // Un archivo que es una lista JSON completa (a veces Deep Research entrega eso)
  const unido = cuerpo.filter((l) => !/^```/.test(l)).join('\n').trim();
  if (unido.startsWith('[')) {
    const avisos = [];
    try {
      const lista = intentarJson(unido, avisos);
      if (Array.isArray(lista)) {
        return { entradas: lista.map((valor, i) => ({ linea: i + 1, valor, avisos: [...avisos] })), ignoradas: 0 };
      }
    } catch {
      /* se intenta línea por línea */
    }
  }
  cuerpo.forEach((texto, i) => {
    if (!texto) return;
    // Bloques ```json, títulos, viñetas y comentarios del informe
    if (!texto.startsWith('{')) {
      ignoradas++;
      return;
    }
    const avisos = [];
    try {
      entradas.push({ linea: i + 1, valor: intentarJson(texto.replace(/,\s*$/, ''), avisos), avisos });
    } catch (e) {
      entradas.push({ linea: i + 1, error: e.message, avisos });
    }
  });
  return { entradas, ignoradas };
};
