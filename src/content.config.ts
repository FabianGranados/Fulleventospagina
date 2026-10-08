// Colecciones de contenido (decisión 2.25). El formato de cada noticia está explicado en
// src/content/noticias/LEEME.md para quien automatice la publicación: un sistema que escriba archivos con este
// frontmatter publica noticias sin tocar código. Si un archivo no cumple el esquema, la compilación falla y dice
// qué campo está mal, así nunca se publica una noticia rota.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { ciudades } from './data/ciudades';
import { eventos } from './data/eventos';
import { NACIONAL, temas } from './data/noticias';

const idsCiudad = [NACIONAL, ...ciudades.map((c) => c.id)] as [string, ...string[]];
const idsEvento = eventos.map((e) => e.id) as [string, ...string[]];

// YAML convierte 2026-10-06 sin comillas en una fecha: se acepta igual y se guarda como texto AAAA-MM-DD
const fecha = z.preprocess(
  (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v),
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha va como AAAA-MM-DD, por ejemplo 2026-10-06.'),
);

const noticias = defineCollection({
  // Todos los .md de la carpeta menos el LEEME. El nombre del archivo es la dirección: <slug>.md → /noticias/<slug>
  loader: glob({ pattern: ['*.md', '!LEEME.md'], base: './src/content/noticias' }),
  schema: z.object({
    titulo: z.string().min(10).max(140),
    // Una o dos frases: va debajo del título y en la descripción para buscadores
    bajada: z.string().min(20).max(280),
    fecha,
    ciudad: z.enum(idsCiudad),
    tema: z.enum(temas),
    // Ids de src/data/eventos.ts relacionados con la noticia (pueden ser ninguno)
    eventos: z.array(z.enum(idsEvento)).default([]),
    destacada: z.boolean().default(false),
    // Opcional: reemplaza el antetítulo automático "{Tema} · {Ciudad}"
    antetitulo: z.string().max(60).optional(),
    // Opcional: URL absoluta (https://…) o ruta de un archivo en public/ (/noticias/foto.jpg), con su texto alternativo
    imagen: z
      .object({
        src: z.string().refine((s) => s.startsWith('/') || /^https:\/\//.test(s), 'La imagen va con https:// o como /ruta en public/.'),
        alt: z.string().min(3),
      })
      .optional(),
    // Opcional: de dónde salió la noticia cuando se automatiza desde otras fuentes
    fuente: z
      .object({
        nombre: z.string().min(2),
        url: z.url().optional(),
      })
      .optional(),
  }),
});

export const collections = { noticias };
