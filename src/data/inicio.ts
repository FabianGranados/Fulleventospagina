// Datos de ejemplo de Inicio (handoff 4.5, "Datos de ejemplo"). En producción vienen del backend (H53).
// Las publicaciones referencian el evento por id (e1…e19 de eventos.ts) y a las personas por id (personas.ts).
import type { ColorAvatar } from '../components/ui/Avatar.astro';
import { eventos } from './eventos';
import { totalMiembros } from './parches';
import { amigosQueVan, enParche, tieneBoleta, va } from './asistencia';

export type Pestana = 'amigos' | 'parches' | 'resenas' | 'cerca';

export const pestanas: { id: Pestana; texto: string }[] = [
  { id: 'amigos', texto: 'Amigos' },
  { id: 'parches', texto: 'Parches abiertos' },
  { id: 'resenas', texto: 'Reseñas' },
  { id: 'cerca', texto: 'Cerca de ti' },
];

// Contadores de la usuaria con sesión (tarjeta de perfil)
export const contadores = { planes: 38, seguidores: 412, siguiendo: 289 };

export interface Publicacion {
  id: string;
  autor: string; // id de personas.ts
  accion: string;
  tiempo: string;
  ciudadAutor: string;
  texto: string;
  evento: string; // id de eventos.ts
  pestanas: Pestana[];
  meGusta: number;
  comentarios: number;
  parche?: string; // id de parches.ts
  estrellas?: number;
}

// Textos del prototipo con dos recortes de la auditoría:
// p1 sin "Tengo dos boletas de más" (H32: no invitar a la reventa informal) y
// p4 y p2 sin el punto de encuentro (H30: solo lo ven los miembros aprobados del parche).
export const publicaciones: Publicacion[] = [
  {
    id: 'p1',
    autor: 'lauram',
    accion: 'va a un evento',
    tiempo: 'Hace 1 h',
    ciudadAutor: 'Bogotá',
    texto: '¿Quién se apunta el viernes? La orquesta en vivo es una locura.',
    evento: 'e1',
    pestanas: ['amigos', 'cerca'],
    meGusta: 24,
    comentarios: 6,
  },
  {
    id: 'p4',
    autor: 'andresr',
    accion: 'abrió un parche',
    tiempo: 'Hace 2 h',
    ciudadAutor: 'Medellín',
    texto: '¿Alguien de Bogotá se viene a Medellín por el puente? Armé parche para el viernes en Provenza.',
    evento: 'e7',
    pestanas: ['amigos', 'parches'],
    meGusta: 27,
    comentarios: 9,
    parche: 'provenza',
  },
  {
    id: 'p2',
    autor: 'sofiac',
    accion: 'armó un parche',
    tiempo: 'Hace 3 h',
    ciudadAutor: 'Bogotá',
    texto: 'Armé parche para el clásico. Faltan dos.',
    evento: 'e4',
    pestanas: ['amigos', 'parches', 'cerca'],
    meGusta: 18,
    comentarios: 11,
    parche: 'clasico',
  },
  {
    id: 'p5',
    autor: 'natah',
    accion: 'compartió un plan gratis',
    tiempo: 'Hace 5 h',
    ciudadAutor: 'Barranquilla',
    texto:
      'Para los que vienen a la costa este puente: el sábado hay vallenato gratis en el Malecón, frente al río. Lleguen temprano que se llena.',
    evento: 'e12',
    pestanas: ['amigos'],
    meGusta: 45,
    comentarios: 12,
  },
  {
    id: 'p3',
    autor: 'juanpablo',
    accion: 'reseñó un evento',
    tiempo: 'Ayer',
    ciudadAutor: 'Bogotá',
    texto: 'Me dolió la barriga de reír. El cierre con improvisación del público vale cada peso. Vayan en grupo.',
    evento: 'e5',
    pestanas: ['amigos', 'resenas'],
    meGusta: 52,
    comentarios: 14,
    estrellas: 5,
  },
];

// "Dónde está tu gente": iniciales, nombre corto, ciudad (id de ciudades.ts), color y si ya se vio
export interface Historia {
  iniciales: string;
  nombre: string;
  ciudad: string;
  color: ColorAvatar;
  vista: boolean;
}

export const historias: Historia[] = [
  { iniciales: 'LM', nombre: 'Laura', ciudad: 'bogota', color: 'c1', vista: false },
  { iniciales: 'AR', nombre: 'Andrés', ciudad: 'medellin', color: 'c2', vista: false },
  { iniciales: 'NH', nombre: 'Nata', ciudad: 'barranquilla', color: 'c5', vista: false },
  { iniciales: 'CR', nombre: 'Caro', ciudad: 'cali', color: 'c3', vista: false },
  { iniciales: 'SB', nombre: 'Sebas', ciudad: 'santamarta', color: 'c6', vista: true },
  { iniciales: 'MJ', nombre: 'Majo', ciudad: 'pereira', color: 'c4', vista: true },
  { iniciales: 'DR', nombre: 'Dani', ciudad: 'leticia', color: 'c2', vista: true },
];

// "Tu semana": los planes con "Voy" o boleta de la usuaria (asistencia.ts), por fecha. El detalle sale
// de los mismos datos: el parche de la usuaria ("parche de 12"), "gratis" o los amigos que van.
export const tuSemana = eventos
  .filter((e) => va(e.id) || tieneBoleta(e.id))
  .sort((a, b) => a.fecha.localeCompare(b.fecha))
  .map((e) => {
    const parche = enParche(e.id);
    const amigos = amigosQueVan(e.id).length;
    const detalle = parche
      ? `parche de ${totalMiembros(parche)}`
      : e.precio === 0
        ? 'gratis'
        : amigos
          ? `con ${amigos} ${amigos === 1 ? 'amigo' : 'amigos'}`
          : '';
    return { evento: e.id, detalle };
  });

export const genteGustos: { persona: string; motivo: string }[] = [
  { persona: 'mafe', motivo: 'Bogotá · Va a 4 eventos que te gustan' },
  { persona: 'danielt', motivo: 'Bogotá · Amigo de Laura y Andrés' },
  { persona: 'valeq', motivo: 'Medellín · Le encanta el techno' },
];

// ciudad: id de ciudades.ts, o null para el alcance nacional ("Toda Colombia", H62)
export const tendencias: { ciudad: string | null; tema: string; planes: number; etiqueta: string }[] = [
  { ciudad: 'bogota', tema: 'Fútbol', planes: 1150, etiqueta: '#ClásicoCapitalino' },
  { ciudad: 'medellin', tema: 'Rumba', planes: 900, etiqueta: '#ProvenzaDeViernes' },
  { ciudad: null, tema: 'Salsa', planes: 870, etiqueta: '#ViernesDeSalsa' },
  { ciudad: 'barranquilla', tema: 'Gratis', planes: 640, etiqueta: '#VallenatoEnElMalecón' },
  { ciudad: 'cali', tema: 'Conciertos', planes: 410, etiqueta: '#PacíficoEnVivo' },
];
