// Las 14 categorías oficiales de Fulleventos (taxonomía de la "Investigación Nacional Fulleventos Colombia",
// fase 1, 11 oct 2026): mutuamente excluyentes, una por evento. Las usan el importador de eventos (etapa B) y la
// tabla `categorias` de D1 (migraciones/0002_eventos.sql), que debe tener exactamente estos ids.
//
// `sitio` es la categoría de plan que hoy muestra la interfaz (src/data/categorias.ts, 6 chips con color). Mientras
// la interfaz no tenga las 14 (B2), un evento con `sitio: null` no aparece en las filas por categoría, pero sí en la
// agenda y el mapa. No se cambia la categoría del evento para que "encaje".
export interface CategoriaOficial {
  id: string;
  nombre: string;
  alcance: string;
  sitio: 'rumba' | 'conciertos' | 'deporte' | 'teatro' | 'comida' | null;
}

export const categoriasOficiales: CategoriaOficial[] = [
  { id: 'rumba-y-vida-nocturna', nombre: 'Rumba y vida nocturna', alcance: 'Discotecas, fiestas temáticas y entretenimiento nocturno para adultos.', sitio: 'rumba' },
  { id: 'conciertos-y-festivales', nombre: 'Conciertos y festivales', alcance: 'Música en vivo, festivales de varios días y recitales masivos.', sitio: 'conciertos' },
  { id: 'arte-y-cultura', nombre: 'Arte y cultura', alcance: 'Teatro, exposiciones, danza, museos, literatura y cine.', sitio: 'teatro' },
  { id: 'deportes', nombre: 'Deportes', alcance: 'Torneos profesionales, carreras, exhibiciones y competencias recreativas.', sitio: 'deporte' },
  { id: 'gastronomia', nombre: 'Gastronomía', alcance: 'Catas, festivales culinarios, aperturas y mercados de comida.', sitio: 'comida' },
  { id: 'naturaleza-y-aventura', nombre: 'Naturaleza y aventura', alcance: 'Senderismo, ecoturismo, avistamiento de aves y recorridos al aire libre.', sitio: null },
  { id: 'familia-y-ninos', nombre: 'Familia y niños', alcance: 'Programación infantil, títeres, parques y actividades para menores.', sitio: null },
  { id: 'negocios-y-emprendimiento', nombre: 'Negocios y emprendimiento', alcance: 'Congresos, ruedas de negocios, seminarios y ferias sectoriales.', sitio: null },
  { id: 'educacion-y-tecnologia', nombre: 'Educación y tecnología', alcance: 'Talleres, conferencias académicas, hackathons y lanzamientos tecnológicos.', sitio: null },
  { id: 'bienestar-y-estilo-de-vida', nombre: 'Bienestar y estilo de vida', alcance: 'Yoga, ferias de salud, meditación y desarrollo personal.', sitio: null },
  { id: 'ferias-y-mercados', nombre: 'Ferias y mercados', alcance: 'Mercados de pulgas, ferias artesanales, exposiciones comerciales y bazares.', sitio: null },
  { id: 'comunidad-y-tradiciones', nombre: 'Comunidad y tradiciones', alcance: 'Fiestas patronales, carnavales, desfiles cívicos y celebraciones folclóricas.', sitio: null },
  { id: 'gaming-y-entretenimiento', nombre: 'Gaming y entretenimiento', alcance: 'eSports, convenciones de cómics, cosplay y cultura pop.', sitio: null },
  { id: 'mascotas', nombre: 'Mascotas', alcance: 'Exposiciones caninas, jornadas de adopción y ferias para animales de compañía.', sitio: null },
];

// Categorías del formato anterior de Gemini (fulleventos-eventos-imagenes/1) → oficial. "Otro" no tiene
// equivalente: el evento queda sin categoría y con una alerta que bloquea la aprobación hasta que una persona elija.
export const categoriaDesdeV1: Record<string, string | null> = {
  Rumba: 'rumba-y-vida-nocturna',
  Conciertos: 'conciertos-y-festivales',
  Deporte: 'deportes',
  'Arte y teatro': 'arte-y-cultura',
  Comida: 'gastronomia',
  Otro: null,
};
