// Lectura de la colección de noticias (decisión 2.25): una sola fuente, los archivos de src/content/noticias.
import { getCollection, type CollectionEntry } from 'astro:content';
import { nombreCiudad } from '../data/ciudades';
import { eventos, type Evento } from '../data/eventos';
import { NACIONAL, NOMBRE_NACIONAL, TEMAS } from '../data/noticias';

export type Noticia = CollectionEntry<'noticias'>;

// De la más nueva a la más vieja; con la misma fecha, por título para que el orden no cambie entre compilaciones
export const noticiasOrdenadas = async (): Promise<Noticia[]> =>
  (await getCollection('noticias')).sort(
    (a, b) => b.data.fecha.localeCompare(a.data.fecha) || a.data.titulo.localeCompare(b.data.titulo, 'es'),
  );

// La destacada más reciente; si ninguna lo está, la más reciente
export const separarDestacada = (lista: Noticia[]) => {
  const destacada = lista.find((n) => n.data.destacada) ?? lista[0];
  return { destacada, resto: lista.filter((n) => n !== destacada) };
};

export const rutaNoticia = (n: Noticia) => `/noticias/${n.id}`;

export const nombreLugar = (ciudad: string) => (ciudad === NACIONAL ? NOMBRE_NACIONAL : nombreCiudad(ciudad));

export const antetitulo = (n: Noticia) => n.data.antetitulo ?? `${TEMAS[n.data.tema]} · ${nombreLugar(n.data.ciudad)}`;

export const eventosDe = (n: Noticia): Evento[] =>
  n.data.eventos.map((id) => eventos.find((e) => e.id === id)).filter((e): e is Evento => Boolean(e));

// Ciudades donde "cae" la noticia para el filtro: la suya y las de sus eventos (una guía nacional con un plan en
// Leticia aparece al filtrar por Leticia)
export const ciudadesDe = (n: Noticia) =>
  [...new Set([n.data.ciudad, ...eventosDe(n).map((e) => e.ciudad)])].filter((c) => c !== NACIONAL);

// Fondo de la imagen cuando la noticia no trae foto: los colores de su primer evento o los del tema
const FONDOS_TEMA: Record<string, [string, string]> = {
  conciertos: ['#4F6DD8', '#1E2550'],
  rumba: ['#EE93BC', '#4A1A3A'],
  deporte: ['#3E9B63', '#0F2A1C'],
  teatro: ['#A3A8F0', '#2A2550'],
  comida: ['#F6DC6A', '#C46A2B'],
  festivales: ['#F3B27E', '#8A2E1F'],
  guias: ['#8FD3D0', '#12343A'],
};

export const fondoNoticia = (n: Noticia) => {
  const e = eventosDe(n)[0];
  const [bg1, bg2] = e ? [e.bg1, e.bg2] : FONDOS_TEMA[n.data.tema];
  return `--bg1: ${bg1}; --bg2: ${bg2}`;
};

// Tiempo de lectura con 200 palabras por minuto, mínimo 1
export const minutosLectura = (n: Noticia) => {
  const palabras = `${n.data.bajada} ${n.body ?? ''}`.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(palabras / 200));
};

const fecha = (iso: string) => new Date(`${iso}T12:00:00-05:00`);

// "6 de octubre de 2026"
export const fechaLarga = (iso: string) =>
  fecha(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Bogota' });

// "6 de octubre" (las listas; el año sale en la página de la noticia)
export const fechaCorta = (iso: string) =>
  fecha(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', timeZone: 'America/Bogota' });

export const metaNoticia = (n: Noticia) => `${fechaCorta(n.data.fecha)} · ${minutosLectura(n)} min de lectura`;

// Relacionadas: mismo tema y misma ciudad pesan más; luego las más recientes
export const relacionadas = (n: Noticia, todas: Noticia[], cuantas = 3) =>
  todas
    .filter((o) => o.id !== n.id)
    .map((o) => {
      const comparten = o.data.eventos.some((id) => n.data.eventos.includes(id));
      const puntos =
        (o.data.tema === n.data.tema ? 2 : 0) +
        (o.data.ciudad === n.data.ciudad && o.data.ciudad !== NACIONAL ? 2 : 0) +
        (comparten ? 1 : 0) +
        (ciudadesDe(o).some((c) => ciudadesDe(n).includes(c)) ? 1 : 0);
      return { o, puntos };
    })
    .sort((a, b) => b.puntos - a.puntos || b.o.data.fecha.localeCompare(a.o.data.fecha))
    .slice(0, cuantas)
    .map(({ o }) => o);
