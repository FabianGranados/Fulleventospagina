// Esquema de cada registro que entrega Gemini Deep Research (JSON o JSONL). Documentado para el agente en
// docs/imagenes-gemini.md, con el JSON Schema equivalente en scripts/imagenes/esquema-gemini.json.
import { z } from 'astro/zod';

const fecha = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha AAAA-MM-DD');
// Gemini debe entregar https://. El esquema solo exige una URL web; el protocolo permitido lo decide la política
// del importador (en producción, solo https), que se revisa antes de cualquier descarga.
const urlWeb = z
  .string()
  .max(2048)
  .refine((s) => {
    try {
      return ['https:', 'http:'].includes(new URL(s).protocol);
    } catch {
      return false;
    }
  }, 'Debe ser una URL https://');

export const registroGemini = z
  .object({
    // Cómo encontrar el evento: por id, por ciudad + slug de la URL, o por título + fecha (+ ciudad)
    evento: z
      .object({
        id: z.string().regex(/^[a-z0-9_-]{1,64}$/).optional(),
        ciudad: z.string().max(40).optional(),
        slug: z.string().max(160).optional(),
        titulo: z.string().max(200).optional(),
        fecha: fecha.optional(),
      })
      .refine((e) => e.id || (e.ciudad && e.slug) || (e.titulo && e.fecha), {
        message: 'El evento necesita id, o ciudad y slug, o título y fecha',
      }),
    imagen: z.object({
      url: urlWeb,
      tipo: z.enum(['principal', 'afiche', 'galeria']).default('principal'),
      texto_alternativo: z.string().trim().min(10).max(300),
      credito: z.string().trim().max(200).optional(),
    }),
    fuente: z.object({
      nombre: z.string().trim().min(2).max(120),
      url: urlWeb,
      oficial: z.boolean(),
    }),
    derechos: z.object({
      estado: z.enum(['confirmado', 'pendiente', 'rechazado', 'desconocido']),
      licencia: z.string().trim().max(200).optional(),
      evidencia: z.string().trim().max(1000).optional(),
      verificado_en: fecha.optional(),
      // "persona" (alguien del equipo revisó) o "agente" (lo afirmó Gemini u otra IA)
      verificado_por: z.enum(['persona', 'agente']).default('agente'),
    }),
    // Reemplazar la foto ya publicada del evento exige decir por qué
    reemplazar: z.boolean().default(false),
    motivo_reemplazo: z.string().trim().min(5).max(300).optional(),
  })
  .refine((r) => !r.reemplazar || r.motivo_reemplazo, {
    message: 'Para reemplazar una foto publicada hace falta motivo_reemplazo',
    path: ['motivo_reemplazo'],
  });

// Lee JSON (lista u objeto con "imagenes") o JSONL. Devuelve [{ linea, texto | error }]
export const leerEntradas = (contenido) => {
  const limpio = contenido.replace(/^﻿/, '').trim();
  if (!limpio) return [];
  if (limpio.startsWith('[') || (limpio.startsWith('{') && /^\{\s*"imagenes"\s*:/.test(limpio))) {
    try {
      const datos = JSON.parse(limpio);
      const lista = Array.isArray(datos) ? datos : datos.imagenes;
      if (!Array.isArray(lista)) return [{ linea: 1, error: 'El JSON debe ser una lista o { "imagenes": [...] }' }];
      return lista.map((valor, i) => ({ linea: i + 1, valor }));
    } catch (e) {
      return [{ linea: 1, error: `JSON inválido: ${e.message}` }];
    }
  }
  return limpio
    .split(/\r?\n/)
    .map((texto, i) => ({ linea: i + 1, texto: texto.trim() }))
    .filter((l) => l.texto && !l.texto.startsWith('//'))
    .map(({ linea, texto }) => {
      try {
        return { linea, valor: JSON.parse(texto) };
      } catch (e) {
        return { linea, error: `JSON inválido: ${e.message}` };
      }
    });
};
