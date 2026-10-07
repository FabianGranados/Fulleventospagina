// Detalle de ejemplo de la página de evento (handoff 4.8, "Datos de ejemplo").
// Solo existe para e1 ("Noche de salsa y boleros en vivo"); los otros eventos usan la plantilla
// con los datos de src/data/eventos.ts y omiten estas secciones. En producción vienen del backend (H53).
// Los marcadores [ASÍ] se conservan: el dato real lo entrega el negocio.
import type { NombreIcono } from '../components/ui/Icono.astro';

export interface Localidad {
  id: 'general' | 'pref' | 'vip';
  nombre: string; // tarjeta lateral
  completo: string; // lista, checkout y boleta
  corto: string; // "Tienes 2 boletas · General"
  precio: number;
  unidad: 'por persona' | 'por mesa';
  descripcion: string;
  disponibilidad: string;
  caliente: boolean;
  maximo: number; // tope por compra
  puestos: number; // personas por unidad (mesa VIP = 4)
  color: string;
  tinte: string;
}

export interface Momento {
  hora: string;
  titulo: string;
  descripcion: string;
  color: string;
  etiqueta?: string;
}

export interface Parche {
  id: string;
  iniciales: string;
  color: string;
  nombre: string;
  descripcion: string;
  usados: number;
  maximo: number;
  // Camila ya es miembro de "Salseros de jueves" (H25)
  propio?: boolean;
}

export interface MensajeMuro {
  persona: string; // id de src/data/personas.ts
  hace: string;
  texto: string;
}

export interface Politica {
  titulo: string;
  texto: string;
  color: string;
  icono: NombreIcono;
}

export interface DetalleEvento {
  id: string;
  puertas: string;
  puertasIso: string; // hora con zona -05:00 (H34, H37)
  show: string;
  showIso: string;
  zona: string;
  lugarNombre: string;
  edad: string;
  edadDetalle: string;
  mayoresDe18: boolean;
  fechaRelativa: string;
  interesados: number;
  amigos: { texto: string; avatares: { iniciales: string; color: string }[]; mas: number };
  descripcion: string[];
  etiquetas: string[];
  programacion: Momento[];
  localidades: Localidad[];
  parches: Parche[];
  conteoMuro: number;
  muro: MensajeMuro[];
  politicas: Politica[];
  direccion: string;
  organizador: { nombre: string; iniciales: string; seguidores: string };
  parcheCompra: { nombre: string; iniciales: string; miembros: string; miembrosMas: number };
  amigosParche: string[]; // ids de src/data/personas.ts
  similares: string[]; // ids de src/data/eventos.ts
  ciudadesSimilares: string;
  recuerdos: string[];
  fotosRecuerdos: number;
}

export const detalles: Record<string, DetalleEvento> = {
  e1: {
    id: 'e1',
    // Hora canónica del evento (H37)
    puertas: '8:00 p. m.',
    puertasIso: '2026-10-09T20:00:00-05:00',
    show: '9:30 p. m.',
    showIso: '2026-10-09T21:30:00-05:00',
    zona: 'Zona T',
    lugarNombre: 'Galería Café Libro',
    edad: '+18',
    edadDetalle: 'Con documento original',
    mayoresDe18: true,
    // Texto fijo del prototipo; en producción se calcula con la fecha del servidor (H53)
    fechaRelativa: 'este viernes',
    interesados: 340,
    amigos: {
      texto: 'Laura, Andrés, Sofía y 10 amigos más',
      avatares: [
        { iniciales: 'LM', color: '#F3B27E' },
        { iniciales: 'AR', color: '#A3A8F0' },
        { iniciales: 'SC', color: '#EE93BC' },
        { iniciales: 'MG', color: '#F6DC6A' },
      ],
      mas: 9,
    },
    descripcion: [
      'Una noche para bailar pegadito en Galería Café Libro. La orquesta [NOMBRE DE LA ORQUESTA] toca salsa brava, salsa romántica y boleros de siempre, en vivo y con [NÚMERO DE MÚSICOS] músicos en tarima.',
      '¿Nunca has bailado? Llega temprano: a las 8:30 p. m. hay clase de salsa gratis con [NOMBRE DEL PROFESOR O ACADEMIA]. Después, pista abierta hasta el cierre con DJ.',
    ],
    etiquetas: ['Salsa', 'Boleros', 'Música en vivo', 'Clase gratis', 'Zona T'],
    programacion: [
      { hora: '8:00 p. m.', titulo: 'Apertura de puertas', descripcion: 'Entra con tu documento y la boleta en el celular', color: '#F6DC6A' },
      { hora: '8:30 p. m.', titulo: 'Clase de salsa gratis', descripcion: 'Pasos básicos con [NOMBRE DEL PROFESOR O ACADEMIA]', color: '#F3B27E' },
      { hora: '9:30 p. m.', titulo: 'Orquesta en vivo', descripcion: '[NOMBRE DE LA ORQUESTA] · salsa brava y boleros', color: '#EE93BC', etiqueta: 'Plato fuerte' },
      { hora: '1:00 a. m.', titulo: 'Cierre con DJ', descripcion: '[NOMBRE DEL DJ] hasta el cierre · [HORA DE CIERRE]', color: '#A3A8F0' },
    ],
    localidades: [
      { id: 'general', nombre: 'General', completo: 'General', corto: 'General', precio: 45000, unidad: 'por persona', descripcion: 'De pie · acceso a pista y barra', disponibilidad: 'Disponible', caliente: false, maximo: 8, puestos: 1, color: '#B9E07A', tinte: '#E8F4D6' },
      { id: 'pref', nombre: 'Preferencial', completo: 'Preferencial (mesa compartida)', corto: 'Preferencial', precio: 70000, unidad: 'por persona', descripcion: 'Silla en mesa compartida, cerca de la pista', disponibilidad: 'Últimas 12', caliente: true, maximo: 8, puestos: 1, color: '#A3A8F0', tinte: '#E3E5FB' },
      { id: 'vip', nombre: 'Mesa VIP para 4', completo: 'Mesa VIP para 4', corto: 'Mesa VIP', precio: 320000, unidad: 'por mesa', descripcion: 'Mesa junto al escenario · [CONSUMO INCLUIDO]', disponibilidad: 'Disponible', caliente: false, maximo: 1, puestos: 4, color: '#F6DC6A', tinte: '#FBF1C6' },
    ],
    parches: [
      { id: 'g1', iniciales: 'SL', color: '#F6DC6A', nombre: 'Salseros de jueves', descripcion: 'Laura M. · Pre en la casa de Laura a las 7:30, luego caminamos', usados: 6, maximo: 8, propio: true },
      { id: 'g2', iniciales: 'PN', color: '#EE93BC', nombre: 'Primera vez bailando', descripcion: 'Mafe G. · Para los que llegan a la clase de 8:30', usados: 3, maximo: 10 },
      { id: 'g3', iniciales: 'UB', color: '#A3A8F0', nombre: 'Uber compartido desde Suba', descripcion: 'Daniel T. · Salimos 8:15 p. m.', usados: 3, maximo: 4 },
    ],
    conteoMuro: 24,
    muro: [
      { persona: 'sofiac', hace: 'hace 20 min', texto: '¿Alguien sabe si hay guardarropa? Voy saliendo del trabajo.' },
      { persona: 'lauram', hace: 'hace 1 h', texto: 'La última vez tocaron hasta las 2. Lleven zapatos cómodos.' },
      { persona: 'andresr', hace: 'hace 3 h', texto: 'Me apunto al parche de Laura. ¿Hay que llevar algo?' },
    ],
    politicas: [
      { titulo: 'Documento original', texto: 'Evento para mayores de 18. Presenta cédula, cédula de extranjería o pasaporte en la entrada.', color: '#A3A8F0', icono: 'documento' },
      { titulo: 'No hay reingreso', texto: 'Si sales del lugar, la boleta ya no te deja volver a entrar.', color: '#EE93BC', icono: 'prohibido' },
      { titulo: 'Parqueadero', texto: '[CONFIRMAR CON EL ORGANIZADOR]. Si puedes, ven en transporte público o comparte carro con tu parche.', color: '#8FD3D0', icono: 'parqueadero' },
      { titulo: 'Accesibilidad', texto: 'Acceso para silla de ruedas y baños accesibles: [CONFIRMAR CON EL ORGANIZADOR].', color: '#B9E07A', icono: 'accesibilidad' },
      // H11: sin "o desde tu correo" (el correo solo confirma)
      { titulo: 'Boleta digital', texto: 'Muestra el QR desde Fulleventos. No tienes que imprimir nada.', color: '#F6DC6A', icono: 'qr' },
      { titulo: 'Cambios y devoluciones', texto: 'Si el evento cambia de fecha o se cancela: [POLÍTICA DE LA BOLETERA].', color: '#F3B27E', icono: 'devoluciones' },
    ],
    direccion: '[DIRECCIÓN]',
    organizador: { nombre: 'Galería Café Libro', iniciales: 'GC', seguidores: '12,4 mil seguidores' },
    parcheCompra: { nombre: 'Salseros de jueves', iniciales: 'SL', miembros: '12 miembros', miembrosMas: 4 },
    amigosParche: ['lauram', 'andresr', 'sofiac', 'juanpablo', 'mafe', 'danielt', 'valeq'],
    similares: ['e10', 'e7', 'e13'],
    ciudadesSimilares: 'Rumba este finde por fuera de Bogotá',
    recuerdos: [
      'radial-gradient(circle at 30% 30%, #F6DC6A 0, transparent 50%), #B5372B',
      'radial-gradient(circle at 70% 40%, #EE93BC 0, transparent 55%), #5A2340',
      'radial-gradient(circle at 50% 70%, #F3B27E 0, transparent 50%), #2A1A16',
      'radial-gradient(circle at 60% 30%, #A3A8F0 0, transparent 50%), #1E1630',
      'radial-gradient(circle at 40% 60%, #F3B27E 0, transparent 55%), #8A2E1F',
      'radial-gradient(circle at 70% 70%, #EE93BC 0, transparent 50%), #140E10',
    ],
    fotosRecuerdos: 128,
  },
};

// Medios de pago del paso 3 (nombres en texto plano, sin logos: decisión 2.4)
export const mediosPago: { id: string; nombre: string; descripcion: string; icono: NombreIcono }[] = [
  { id: 'nequi', nombre: 'Nequi', descripcion: 'Apruebas en tu app', icono: 'celular' },
  { id: 'pse', nombre: 'PSE', descripcion: 'Débito a tu cuenta bancaria', icono: 'banco' },
  { id: 'card', nombre: 'Tarjeta crédito/débito', descripcion: 'Crédito a cuotas o débito', icono: 'tarjeta' },
  { id: 'davi', nombre: 'Daviplata', descripcion: 'Apruebas en tu app', icono: 'celular' },
  { id: 'bcol', nombre: 'Botón Bancolombia', descripcion: 'Desde tu cuenta Bancolombia', icono: 'banco' },
];

export const bancosPse: { id: string; nombre: string }[] = [
  { id: '', nombre: 'Elige tu banco' },
  { id: 'bancolombia', nombre: 'Bancolombia' },
  { id: 'bogota', nombre: 'Banco de Bogotá' },
  { id: 'davivienda', nombre: 'Davivienda' },
  { id: 'bbva', nombre: 'BBVA' },
  { id: 'occidente', nombre: 'Banco de Occidente' },
  { id: 'popular', nombre: 'Banco Popular' },
  { id: 'cajasocial', nombre: 'Banco Caja Social' },
  { id: 'avvillas', nombre: 'Banco AV Villas' },
  { id: 'otro', nombre: 'Otro banco' },
];

// Patrón decorativo del QR (17 × 17): no es un código real
export const patronQr = [
  '11111110001111111',
  '10000010001000001',
  '10111010101011101',
  '10111010101011101',
  '10111010001011101',
  '10000010101000001',
  '11111110101111111',
  '00000000100000000',
  '10010011101101011',
  '00000000001000001',
  '11111110010101011',
  '10000010101101100',
  '10111010101000100',
  '10111010000000100',
  '10111010001111111',
  '10000010111001101',
  '11111110010100010',
];

// Cargo de demostración (P4 pendiente; H31)
export const CARGO_DEMO = 0.08;
