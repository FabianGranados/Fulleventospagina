// Las 14 categorías oficiales de Fulleventos (taxonomía de la "Investigación Nacional Fulleventos Colombia",
// fase 1, 11 oct 2026): mutuamente excluyentes, una por evento. Las usan el importador de eventos (etapa B) y la
// tabla `categorias` de D1 (migraciones/0002_eventos.sql), que debe tener exactamente estos ids.
//
// `sitio` es la categoría de plan que hoy muestra la interfaz (src/data/categorias.ts, 6 chips con color). Mientras
// la interfaz no tenga las 14 (B2), un evento con `sitio: null` no aparece en las filas por categoría, pero sí en la
// agenda y el mapa. No se cambia la categoría del evento para que "encaje".
import type { NombreIcono } from '../components/ui/Icono.astro';

export interface CategoriaOficial {
  id: string;
  nombre: string;
  alcance: string;
  sitio: 'rumba' | 'conciertos' | 'deporte' | 'teatro' | 'comida' | null;
  // Ícono de la categoría (etapa B2): nombre de components/ui/Icono.astro, en los filtros de la Agenda y "Ver todas"
  icono: NombreIcono;
  // Foto de la tarjeta de la categoría (opción C, aprobada el 19 oct 2026): archivo en src/assets/categorias/<id>.jpg.
  // Pexels: uso libre, también comercial, sin atribución obligatoria (https://www.pexels.com/license/).
  foto: { autor: string; pexels: number };
}

export const urlFotoPexels = (c: CategoriaOficial) => `https://www.pexels.com/photo/${c.foto.pexels}/`;

export const categoriasOficiales: CategoriaOficial[] = [
  { id: 'rumba-y-vida-nocturna', nombre: 'Rumba y vida nocturna', alcance: 'Discotecas, fiestas temáticas y entretenimiento nocturno para adultos.', sitio: 'rumba', icono: 'destellos', foto: { autor: 'Isabella Mendes', pexels: 30196899 } },
  { id: 'conciertos-y-festivales', nombre: 'Conciertos y festivales', alcance: 'Música en vivo, festivales de varios días y recitales masivos.', sitio: 'conciertos', icono: 'musica', foto: { autor: 'Bence Szemerey', pexels: 7192878 } },
  { id: 'arte-y-cultura', nombre: 'Arte y cultura', alcance: 'Teatro, exposiciones, danza, museos, literatura y cine.', sitio: 'teatro', icono: 'mascaras', foto: { autor: 'Heber Vazquez', pexels: 20059728 } },
  { id: 'deportes', nombre: 'Deportes', alcance: 'Torneos profesionales, carreras, exhibiciones y competencias recreativas.', sitio: 'deporte', icono: 'balon', foto: { autor: 'Beachbumology', pexels: 20433896 } },
  { id: 'gastronomia', nombre: 'Gastronomía', alcance: 'Catas, festivales culinarios, aperturas y mercados de comida.', sitio: 'comida', icono: 'cubiertos', foto: { autor: 'Tuan Vy', pexels: 36243530 } },
  { id: 'naturaleza-y-aventura', nombre: 'Naturaleza y aventura', alcance: 'Senderismo, ecoturismo, avistamiento de aves y recorridos al aire libre.', sitio: null, icono: 'montana', foto: { autor: 'Juan Felipe Ramírez', pexels: 28154581 } },
  { id: 'familia-y-ninos', nombre: 'Familia y niños', alcance: 'Programación infantil, títeres, parques y actividades para menores.', sitio: null, icono: 'familia', foto: { autor: 'Kampus Production', pexels: 8954791 } },
  { id: 'negocios-y-emprendimiento', nombre: 'Negocios y emprendimiento', alcance: 'Congresos, ruedas de negocios, seminarios y ferias sectoriales.', sitio: null, icono: 'maletin', foto: { autor: 'Pavel Danilyuk', pexels: 8761540 } },
  { id: 'educacion-y-tecnologia', nombre: 'Educación y tecnología', alcance: 'Talleres, conferencias académicas, hackathons y lanzamientos tecnológicos.', sitio: null, icono: 'birrete', foto: { autor: 'Tima Miroshnichenko', pexels: 5380607 } },
  { id: 'bienestar-y-estilo-de-vida', nombre: 'Bienestar y estilo de vida', alcance: 'Yoga, ferias de salud, meditación y desarrollo personal.', sitio: null, icono: 'loto', foto: { autor: 'Vitaly Gariev', pexels: 36715606 } },
  { id: 'ferias-y-mercados', nombre: 'Ferias y mercados', alcance: 'Mercados de pulgas, ferias artesanales, exposiciones comerciales y bazares.', sitio: null, icono: 'carpa', foto: { autor: 'Elias Jara', pexels: 16063764 } },
  { id: 'comunidad-y-tradiciones', nombre: 'Comunidad y tradiciones', alcance: 'Fiestas patronales, carnavales, desfiles cívicos y celebraciones folclóricas.', sitio: null, icono: 'guirnalda', foto: { autor: 'Jimmy Casas Ospina', pexels: 13653677 } },
  { id: 'gaming-y-entretenimiento', nombre: 'Gaming y entretenimiento', alcance: 'eSports, convenciones de cómics, cosplay y cultura pop.', sitio: null, icono: 'control', foto: { autor: 'Alef Morais', pexels: 34179707 } },
  { id: 'mascotas', nombre: 'Mascotas', alcance: 'Exposiciones caninas, jornadas de adopción y ferias para animales de compañía.', sitio: null, icono: 'huella', foto: { autor: 'Matheus Bertelli', pexels: 16652369 } },
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

export const categoriaOficial = (id: string | null | undefined) => categoriasOficiales.find((c) => c.id === id);

// Agenda de una categoría oficial, con la ciudad elegida si no es todo el país (etapa B2)
export const rutaCategoriaOficial = (id: string, ciudad = 'all') => {
  const p = new URLSearchParams({ categoria: id });
  if (ciudad !== 'all') p.set('ciudad', ciudad);
  return `/agenda?${p}`;
};
