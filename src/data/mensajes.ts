// Datos de ejemplo del chat (handoff 4.9, "Datos de ejemplo"). El chat no tiene backend ni tiempo real
// (decisión pendiente P6; auditoría H9, H13, H29 y H30): todo vive en el navegador y se pierde al recargar.
// Las personas salen de personas.ts y los eventos de eventos.ts (un solo bloque de datos, H37 y H53).
// "Hoy" ficticio del ejemplo: martes 6 de octubre de 2026 (4.9, ficha técnica). Las horas y las fechas
// relativas de los mensajes ("Ayer", "Dom 4 oct") son texto fijo; en producción las calcula el servidor (H53).
export { HOY_DEMO as HOY } from './demo';
import { parchePorId } from './parches';
import { conBoletaDe } from './asistencia';

// La usuaria del demo (Camila Vargas) en personas.ts
export const YO = 'camivargas';

// Ciudad de cada persona: el chat la muestra en la ventana de amigos, en la barra de un chat nuevo y en el panel
export const ciudadDe: Record<string, string> = {
  camivargas: 'Bogotá',
  lauram: 'Bogotá',
  andresr: 'Medellín',
  sofiac: 'Bogotá',
  juanpablo: 'Bogotá',
  mafe: 'Bogotá',
  danielt: 'Bogotá',
  valeq: 'Medellín',
  natah: 'Bogotá',
  caror: 'Bogotá',
  sebasb: 'Bogotá',
  majop: 'Bogotá',
};

// Amigos que se pueden elegir en "Nuevo parche" / "Nuevo chat", en este orden (estado de la usuaria)
export { AMIGOS } from './asistencia';

// Cuenta de organizador. Qué se verifica está pendiente (P9, H48); "Responde en ~1 h" es texto fijo (H14).
export const organizador = {
  id: 'galeria-cafe-libro',
  nombre: 'Galería Café Libro',
  iniciales: 'GC',
  estado: 'Organizador verificado · Responde en ~1 h',
  eventos: ['e1'],
};

// Datos del evento que solo usa el chat: etiqueta de la píldora y nombre corto de la bandeja.
// La hora sale de eventos.ts, igual que en Inicio y Evento (H37). El rock no tiene hora.
export const eventoChat: Record<string, { etiqueta: string; corto: string }> = {
  e1: { etiqueta: 'Salsa', corto: 'Noche de salsa y boleros' },
  e4: { etiqueta: 'Fútbol', corto: 'Santa Fe vs. Millonarios' },
  e3: { etiqueta: 'Rock', corto: 'Rock en el Movistar Arena' },
  e7: { etiqueta: 'Reguetón', corto: 'Reguetón en Provenza' },
};

// Orden de los eventos en la bandeja "Compartir" y en la ventana "Nuevo parche"
export const EVENTOS_CHAT = ['e1', 'e4', 'e3', 'e7'];

export type Reaccion = 'encanta' | 'prendido' | 'gusta';

export type Mensaje =
  | { id: string; tipo: 'fecha'; texto: string }
  | { id: string; tipo: 'sistema'; icono: 'boleta' | 'pago' | 'grupo'; texto: string; hora: string }
  | { id: string; tipo: 'texto'; de: string; texto: string; hora: string; reacciones?: [Reaccion, number][] }
  | { id: string; tipo: 'evento'; de: string; evento: string; hora: string; reacciones?: [Reaccion, number][] }
  | {
      id: string;
      tipo: 'encuesta';
      de: string;
      pregunta: string;
      opciones: [string, string, number][];
      hora: string;
      reacciones?: [Reaccion, number][];
    }
  | {
      id: string;
      tipo: 'foto';
      de: string;
      alt: string;
      pie?: string;
      colores?: [string, string, string];
      hora: string;
      reacciones?: [Reaccion, number][];
    };

export interface Conversacion {
  id: string;
  // Dirección de la conversación: /mensajes/:slug (H42)
  slug: string;
  tipo: 'parche' | 'persona' | 'organizador';
  // Parche: nombre, iniciales, color del avatar (.c1–.c6), evento ligado, quien lo creó, miembros y quiénes tienen boleta
  nombre?: string;
  iniciales?: string;
  color?: string;
  evento?: string;
  admin?: string;
  miembros?: string[];
  conBoleta?: string[];
  cupos?: number;
  // Persona u organizador
  con?: string;
  estado?: string;
  noLeidos: number;
  nuevos: number;
  hora: string;
  mensajes: Mensaje[];
}

// Datos de un parche para su conversación: salen de parches.ts (H25, H37), con la boleta de la usuaria
// de asistencia.ts. Así el chat, Inicio y Evento cuentan los mismos miembros y boletas.
const deParche = (id: string) => {
  const p = parchePorId(id)!;
  return {
    id: p.id,
    slug: p.slug,
    tipo: 'parche' as const,
    nombre: p.nombre,
    iniciales: p.iniciales,
    color: p.color,
    evento: p.evento,
    admin: p.admin,
    miembros: p.miembros,
    conBoleta: conBoletaDe(p),
    cupos: p.cupos,
  };
};

// Avisos de compra sin cantidad ni localidad (H30): "Andrés ya tiene su boleta".
// Los textos que escribe la gente se conservan tal cual del prototipo, sin emoji.
export const conversaciones: Conversacion[] = [
  {
    ...deParche('salseros'),
    noLeidos: 3,
    nuevos: 3,
    hora: '9:41 a. m.',
    mensajes: [
      { id: 's0', tipo: 'fecha', texto: 'Ayer' },
      { id: 's1', tipo: 'texto', de: 'lauram', texto: '¡Gente! Quedó confirmado: el viernes nos vamos para la noche de salsa y boleros.', hora: '7:02 p. m.' },
      { id: 's2', tipo: 'evento', de: 'lauram', evento: 'e1', hora: '7:02 p. m.' },
      { id: 's3', tipo: 'texto', de: 'juanpablo', texto: 'Me apunto. ¿Hasta qué hora tocan?', hora: '7:15 p. m.' },
      { id: 's4', tipo: 'texto', de: 'lauram', texto: 'La última vez tocaron hasta las 2. Lleven zapatos cómodos.', hora: '7:18 p. m.', reacciones: [['encanta', 4], ['prendido', 2]] },
      { id: 's5', tipo: 'fecha', texto: 'Hoy' },
      { id: 's6', tipo: 'sistema', icono: 'boleta', texto: 'Andrés ya tiene su boleta', hora: '8:05 a. m.' },
      { id: 's7', tipo: 'texto', de: 'andresr', texto: 'Listo, compré la mía y la de Vale. Llego a Bogotá el jueves.', hora: '8:06 a. m.', reacciones: [['gusta', 3]] },
      { id: 's8', tipo: 'texto', de: 'camivargas', texto: '¡Qué nivel! Yo compro la mía hoy en la noche.', hora: '8:20 a. m.' },
      {
        id: 's9',
        tipo: 'encuesta',
        de: 'sofiac',
        pregunta: '¿Dónde hacemos la previa?',
        opciones: [['o1', 'Donde Laura, en Chapinero', 5], ['o2', 'Un bar en la Zona T', 3], ['o3', 'Directo al evento', 1]],
        hora: '9:30 a. m.',
      },
      { id: 's10', tipo: 'foto', de: 'mafe', alt: '[Foto: la pista en la edición pasada]', pie: 'Así quedó la pista la última vez', colores: ['#F3B27E', '#5A2340', '#E8A04F'], hora: '9:38 a. m.' },
      { id: 's11', tipo: 'texto', de: 'sofiac', texto: 'Voto por donde Laura: queda cerca y caminamos juntos.', hora: '9:41 a. m.' },
    ],
  },
  {
    id: 'laura',
    slug: 'laura-martinez',
    tipo: 'persona',
    con: 'lauram',
    estado: 'En línea',
    noLeidos: 1,
    nuevos: 1,
    hora: '9:12 a. m.',
    mensajes: [
      { id: 'l0', tipo: 'fecha', texto: 'Ayer' },
      { id: 'l1', tipo: 'texto', de: 'camivargas', texto: 'Lau, ¿a qué hora es la previa en tu casa el viernes?', hora: '6:40 p. m.' },
      { id: 'l2', tipo: 'texto', de: 'lauram', texto: 'Desde las 7:30. Trae algo de picar si puedes.', hora: '6:52 p. m.', reacciones: [['encanta', 1]] },
      { id: 'l3', tipo: 'fecha', texto: 'Hoy' },
      { id: 'l4', tipo: 'texto', de: 'lauram', texto: 'Y compra hoy la boleta, no la dejes para el viernes.', hora: '9:12 a. m.' },
    ],
  },
  {
    id: 'galeria',
    slug: organizador.id,
    tipo: 'organizador',
    con: organizador.id,
    estado: organizador.estado,
    noLeidos: 1,
    nuevos: 1,
    hora: '8:30 a. m.',
    mensajes: [
      { id: 'g0', tipo: 'fecha', texto: 'Ayer' },
      { id: 'g1', tipo: 'texto', de: 'camivargas', texto: 'Hola, ¿a qué hora abren puertas el viernes?', hora: '9:10 p. m.' },
      { id: 'g2', tipo: 'fecha', texto: 'Hoy' },
      { id: 'g3', tipo: 'texto', de: organizador.id, texto: '¡Hola, Camila! Abrimos a las 8:00 p. m. y la clase de baile gratis arranca a las 8:30 p. m.', hora: '8:30 a. m.' },
    ],
  },
  {
    ...deParche('clasico'),
    noLeidos: 0,
    nuevos: 0,
    hora: 'Ayer',
    mensajes: [
      { id: 'c0', tipo: 'fecha', texto: 'Ayer' },
      { id: 'c1', tipo: 'texto', de: 'sofiac', texto: 'Armé el parche para el clásico. Nos vemos a las 2 en la tienda de la 57 y caminamos al estadio.', hora: '3:10 p. m.' },
      { id: 'c2', tipo: 'sistema', icono: 'boleta', texto: 'Sofía ya tiene su boleta', hora: '3:12 p. m.' },
      { id: 'c3', tipo: 'texto', de: 'camivargas', texto: '¡Gracias, Sofi! Ya te pasé lo mío.', hora: '3:20 p. m.' },
      { id: 'c4', tipo: 'sistema', icono: 'grupo', texto: 'Juan Pablo y Daniel se unieron al parche', hora: '5:02 p. m.' },
      { id: 'c5', tipo: 'texto', de: 'juanpablo', texto: '¿Todos somos de Santa Fe o hay infiltrados?', hora: '5:10 p. m.' },
      { id: 'c6', tipo: 'texto', de: 'danielt', texto: 'Yo soy de Millos, pero voy en paz.', hora: '5:14 p. m.', reacciones: [['prendido', 3]] },
      { id: 'c7', tipo: 'texto', de: 'danielt', texto: 'Faltan dos cupos. ¿Invitamos a Mafe?', hora: '6:40 p. m.' },
      { id: 'c8', tipo: 'texto', de: 'camivargas', texto: 'Yo le escribo.', hora: '6:45 p. m.' },
    ],
  },
  {
    id: 'andres',
    slug: 'andres-ramirez',
    tipo: 'persona',
    con: 'andresr',
    estado: 'Activo hace 2 h',
    noLeidos: 0,
    nuevos: 0,
    hora: 'Ayer',
    mensajes: [
      { id: 'a0', tipo: 'fecha', texto: 'Ayer' },
      { id: 'a1', tipo: 'texto', de: 'andresr', texto: 'Llego a Bogotá el jueves en la noche para la salsa.', hora: '4:15 p. m.' },
      { id: 'a2', tipo: 'texto', de: 'camivargas', texto: '¡Qué bien! ¿Y cuándo me recibes en Medellín?', hora: '4:20 p. m.' },
      { id: 'a3', tipo: 'evento', de: 'andresr', evento: 'e7', hora: '4:30 p. m.' },
      { id: 'a4', tipo: 'texto', de: 'andresr', texto: 'Cuando quieras. Nos vemos en el parque Lleras y arrancamos para Provenza.', hora: '4:31 p. m.' },
    ],
  },
  {
    ...deParche('rockeros'),
    noLeidos: 0,
    nuevos: 0,
    hora: 'Dom',
    mensajes: [
      { id: 'r0', tipo: 'fecha', texto: 'Dom 4 oct' },
      { id: 'r1', tipo: 'texto', de: 'juanpablo', texto: '¿Alguien tiene el setlist de la gira?', hora: '7:10 p. m.' },
      { id: 'r2', tipo: 'texto', de: 'valeq', texto: 'Yo llego directo del trabajo. Nos vemos en la entrada.', hora: '7:25 p. m.' },
      { id: 'r3', tipo: 'sistema', icono: 'boleta', texto: 'Daniel ya tiene su boleta', hora: '8:02 p. m.' },
      {
        id: 'r4',
        tipo: 'foto',
        de: 'danielt',
        alt: '[Foto: la fila del concierto pasado]',
        pie: 'Así estaba la fila la última vez: lleguen temprano.',
        colores: ['#D9452F', '#2B0F12', '#F3B27E'],
        hora: '8:10 p. m.',
      },
      { id: 'r5', tipo: 'texto', de: 'lauram', texto: 'Yo llevo tapones para los oídos para el que quiera.', hora: '8:30 p. m.', reacciones: [['gusta', 4]] },
    ],
  },
  {
    id: 'sofia',
    slug: 'sofia-cardenas',
    tipo: 'persona',
    con: 'sofiac',
    estado: 'Activa hace 20 min',
    noLeidos: 0,
    nuevos: 0,
    hora: 'Sáb',
    mensajes: [
      { id: 'f0', tipo: 'fecha', texto: 'Sáb 3 oct' },
      { id: 'f1', tipo: 'texto', de: 'sofiac', texto: '¿Vas al clásico del domingo 11?', hora: '11:02 a. m.' },
      { id: 'f2', tipo: 'texto', de: 'camivargas', texto: '¡Obvio! Ya estoy en el parche.', hora: '11:05 a. m.' },
      { id: 'f3', tipo: 'texto', de: 'sofiac', texto: 'Perfecto, te guardo puesto al lado.', hora: '11:06 a. m.', reacciones: [['encanta', 1]] },
    ],
  },
];

// La conversación que abre /mensajes por defecto (4.9)
export const CONVERSACION_INICIAL = 'salseros';

export const conversacionPorSlug = (s: string) => conversaciones.find((c) => c.slug === s);

// Chats sin leer al cargar (conversaciones, no mensajes: detalle fino 1). La misma cifra en el encabezado,
// en el menú de Inicio y en Mensajes (H13, detalle fino 23 de Inicio)
export const chatsSinLeer = conversaciones.filter((c) => c.noLeidos > 0).length;

// Enlaces de otras pantallas al chat (H42): la conversación va en la dirección (/mensajes/:slug).
// Sin conversación, "Mensaje" abre la ventana "Nuevo chat" con la persona elegida.
export const rutaChatCon = (personaId: string) => {
  const c = conversaciones.find((x) => x.tipo !== 'parche' && x.con === personaId);
  return c ? `/mensajes/${c.slug}` : `/mensajes?nuevo=chat&persona=${encodeURIComponent(personaId)}`;
};
export const rutaNuevoParche = (eventoId?: string) =>
  eventoId ? `/mensajes?nuevo=parche&evento=${encodeURIComponent(eventoId)}` : '/mensajes?nuevo=parche';
