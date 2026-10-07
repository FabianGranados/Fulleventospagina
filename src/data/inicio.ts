// Datos de ejemplo de Inicio (handoff 4.5, "Datos de ejemplo"). En producción vienen del backend (H53).
// Las publicaciones referencian el evento por id (e1…e19 de eventos.ts) y a las personas por id (personas.ts).
import type { ColorAvatar } from '../components/ui/Avatar.astro';

export type Pestana = 'amigos' | 'parches' | 'resenas' | 'cerca';

export const pestanas: { id: Pestana; texto: string }[] = [
  { id: 'amigos', texto: 'Amigos' },
  { id: 'parches', texto: 'Parches abiertos' },
  { id: 'resenas', texto: 'Reseñas' },
  { id: 'cerca', texto: 'Cerca de ti' },
];

// Hora de cada evento que muestra Inicio. e1: hora canónica de puertas (H37; Evento dice
// "Puertas 8:00 p. m. · Show 9:30 p. m."). El resto, la del prototipo.
export const horaEvento: Record<string, string> = {
  e1: '8:00 p. m.',
  e2: '2:00 p. m.',
  e4: '4:00 p. m.',
  e5: '7:00 p. m.',
  e7: '10:00 p. m.',
  e12: '5:00 p. m.',
};

// Contadores de la usuaria con sesión (tarjeta de perfil)
export const contadores = { planes: 38, seguidores: 412, siguiendo: 289 };

export interface Parche {
  id: string;
  nombre: string;
  // Avatar cuadrado: solo los parches que se listan en "Tus parches"
  iniciales?: string;
  fondo?: string;
  evento: string;
  // Con cupo máximo se muestra "N de M cupos"; sin cupo, "N miembros" (detalle fino 48)
  miembros: number;
  cupoMax?: number;
  nuevos?: number;
  // La usuaria ya es miembro (H25): el conteo la incluye
  soyMiembro: boolean;
  // Solo existe el tipo "abierto" diseñado; "con aprobación" y "privado" están pendientes (H30, N70)
  tipo: 'abierto';
}

export const parches: Parche[] = [
  { id: 'salseros', nombre: 'Salseros de jueves', iniciales: 'SL', fondo: 'var(--yellow)', evento: 'e1', miembros: 12, nuevos: 2, soyMiembro: true, tipo: 'abierto' },
  { id: 'rockeros', nombre: 'Rockeros del Arena', iniciales: 'RK', fondo: 'var(--lilac)', evento: 'e3', miembros: 8, soyMiembro: true, tipo: 'abierto' },
  { id: 'clasico', nombre: 'Clásico capitalino', iniciales: 'CC', fondo: 'var(--lime)', evento: 'e4', miembros: 4, cupoMax: 6, soyMiembro: true, tipo: 'abierto' },
  { id: 'provenza', nombre: 'Provenza de viernes', evento: 'e7', miembros: 5, cupoMax: 8, soyMiembro: false, tipo: 'abierto' },
];

// Parches que aparecen en la columna "Tus parches" (los de la usuaria)
export const misParches = parches.filter((p) => p.soyMiembro);

export interface Publicacion {
  id: string;
  autor: string; // id de personas.ts
  accion: string;
  tiempo: string;
  ciudadAutor: string;
  texto: string;
  evento: string; // id de eventos.ts
  pestanas: Pestana[];
  voy: boolean; // la usuaria ya marcó "Voy" (el conteo de eventos.ts ya la incluye)
  meGusta: number;
  comentarios: number;
  parche?: string; // id de parches
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
    voy: true,
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
    voy: false,
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
    voy: false,
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
    voy: false,
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
    voy: false,
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

// "Tu semana": planes con "Voy" o boleta de la usuaria (fijo en el prototipo)
export const tuSemana: { evento: string; detalle: string }[] = [
  { evento: 'e1', detalle: 'con 3 amigos' },
  { evento: 'e2', detalle: 'gratis' },
  { evento: 'e4', detalle: 'parche de 4' },
];

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
