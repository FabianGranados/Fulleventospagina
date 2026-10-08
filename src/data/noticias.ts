// Centro de noticias (decisión 2.25). Las noticias NO viven aquí: cada una es un archivo Markdown en
// src/content/noticias/<slug>.md (formato en src/content/noticias/LEEME.md, validado en src/content.config.ts).
// Este archivo solo tiene las listas cerradas que comparten la validación y las pantallas.

// Temas de la lista cerrada, en el orden de los filtros de /noticias
export const TEMAS = {
  conciertos: 'Conciertos',
  rumba: 'Rumba',
  deporte: 'Deporte',
  teatro: 'Teatro',
  comida: 'Comida',
  festivales: 'Festivales',
  guias: 'Guías',
} as const;

export type Tema = keyof typeof TEMAS;

export const temas = Object.keys(TEMAS) as [Tema, ...Tema[]];

// "nacional" para las noticias que no son de una sola ciudad (guías de todo el país, por ejemplo)
export const NACIONAL = 'nacional';
export const NOMBRE_NACIONAL = 'Toda Colombia';
