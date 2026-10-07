// Parches de ejemplo: un solo bloque de datos para Inicio, Evento, Agenda y Mensajes (H25, H37, H53).
// Antes cada pantalla tenía su copia y no coincidían ("Salseros de jueves": "6 de 8 cupos" en Evento y
// "12 miembros" en el chat e Inicio). En producción salen del servidor.
//
// Salseros de jueves: el handoff no fija cuál de los dos datos manda (8.2.6, H25 solo pide unificarlos).
// Se toman los del chat (4.9, tabla de conversaciones): 12 miembros, 7 con boleta y sin cupo máximo, que
// también usan Inicio ("12 miembros") y la ventana de repost de Agenda ("Salseros de jueves · 12 miembros").
import type { ColorAvatar } from '../components/ui/Avatar.astro';

export interface Parche {
  id: string;
  // Dirección de su conversación: /mensajes/:slug (H42). Solo existe para los parches de la usuaria.
  slug: string;
  nombre: string;
  iniciales: string;
  color: ColorAvatar;
  evento?: string; // id de eventos.ts
  admin: string; // id de personas.ts: quien creó el parche
  // Miembros conocidos en los datos de ejemplo (ids de personas.ts), con quien lo creó
  miembros: string[];
  // Miembros que no están entre las personas de ejemplo (el prototipo solo da el conteo): no se inventan
  otrosMiembros?: number;
  // Cupo máximo; sin cupo, el parche no tiene tope (detalle fino 48 de Inicio)
  cupos?: number;
  // Quiénes ya tienen boleta del evento, sin contar a la usuaria del demo (su boleta va en asistencia.ts)
  conBoleta: string[];
  // Texto público del parche en la página del evento. El punto de encuentro solo debería verlo un miembro
  // aprobado (H30): queda como en el prototipo hasta diseñar los tipos de parche.
  descripcion?: string;
  // Solo existe el tipo "abierto" diseñado; "con aprobación" y "privado" están pendientes (H30, N70)
  tipo: 'abierto';
}

export const parches: Parche[] = [
  {
    id: 'salseros',
    slug: 'salseros-de-jueves',
    nombre: 'Salseros de jueves',
    iniciales: 'SL',
    color: 'c5',
    evento: 'e1',
    admin: 'lauram',
    miembros: ['camivargas', 'lauram', 'andresr', 'valeq', 'juanpablo', 'sofiac', 'mafe', 'danielt', 'natah', 'caror', 'sebasb', 'majop'],
    conBoleta: ['lauram', 'andresr', 'valeq', 'juanpablo', 'sofiac', 'mafe', 'danielt'],
    descripcion: 'Laura M. · Pre en la casa de Laura a las 7:30, luego caminamos',
    tipo: 'abierto',
  },
  {
    id: 'primeravez',
    slug: 'primera-vez-bailando',
    nombre: 'Primera vez bailando',
    iniciales: 'PN',
    color: 'c3',
    evento: 'e1',
    admin: 'mafe',
    miembros: ['mafe'],
    otrosMiembros: 2,
    cupos: 10,
    conBoleta: [],
    descripcion: 'Mafe G. · Para los que llegan a la clase de 8:30',
    tipo: 'abierto',
  },
  {
    id: 'uber',
    slug: 'uber-compartido-desde-suba',
    nombre: 'Uber compartido desde Suba',
    iniciales: 'UB',
    color: 'c2',
    evento: 'e1',
    admin: 'danielt',
    miembros: ['danielt'],
    otrosMiembros: 2,
    cupos: 4,
    conBoleta: [],
    descripcion: 'Daniel T. · Salimos 8:15 p. m.',
    tipo: 'abierto',
  },
  {
    id: 'rockeros',
    slug: 'rockeros-del-arena',
    nombre: 'Rockeros del Arena',
    iniciales: 'RK',
    color: 'c2',
    evento: 'e3',
    admin: 'juanpablo',
    miembros: ['camivargas', 'juanpablo', 'valeq', 'danielt', 'lauram', 'mafe', 'sebasb', 'majop'],
    conBoleta: ['juanpablo', 'valeq', 'danielt', 'lauram', 'mafe'],
    tipo: 'abierto',
  },
  {
    id: 'clasico',
    slug: 'clasico-capitalino',
    nombre: 'Clásico capitalino',
    iniciales: 'CC',
    color: 'c4',
    evento: 'e4',
    admin: 'sofiac',
    miembros: ['camivargas', 'sofiac', 'juanpablo', 'danielt'],
    cupos: 6,
    conBoleta: ['sofiac'],
    tipo: 'abierto',
  },
  {
    id: 'provenza',
    slug: 'provenza-de-viernes',
    nombre: 'Provenza de viernes',
    iniciales: 'PV',
    color: 'c1',
    evento: 'e7',
    admin: 'andresr',
    miembros: ['andresr'],
    otrosMiembros: 4,
    cupos: 8,
    conBoleta: [],
    tipo: 'abierto',
  },
];

export const parchePorId = (id: string) => parches.find((p) => p.id === id);

export const totalMiembros = (p: Parche) => p.miembros.length + (p.otrosMiembros ?? 0);

export const parchesDelEvento = (evento: string) => parches.filter((p) => p.evento === evento);
