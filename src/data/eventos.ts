// Datos semilla del handoff (4.3, tabla de eventos). En producción vienen del backend (H53).
// Horas: la canónica de e1 son las puertas a las 8:00 p. m. y el show a las 9:30 p. m. (8.1 #9); las demás
// son las que traían Inicio y el chat. Los eventos sin hora en ninguna fuente quedan sin hora.
// "vende": las boleteras reales se muestran como [BOLETERA] hasta tener acuerdos (H1).
export interface Evento {
  id: string;
  titulo: string;
  categoria: string;
  etiquetas: string[];
  ciudad: string;
  fecha: string; // AAAA-MM-DD, zona America/Bogota
  lugar: string;
  precio: number; // COP; 0 = gratis
  vende: string;
  // URL oficial de venta (boletera o sitio del organizador). El botón "Comprar en {vende}" lleva ahí
  // (decisión 2.22). En el demo no hay ninguna porque las boleteras son [BOLETERA] (P8, H1): no se inventan.
  urlVenta?: string;
  bg1: string;
  bg2: string;
  van: number;
  parches: number;
  // Hora de inicio que muestran todas las pantallas (H37). Sin dato en el handoff, el evento queda sin hora.
  hora?: string;
  // Solo si el evento distingue apertura de puertas y show (la hora es la de puertas)
  puertas?: string;
  show?: string;
}

const BOLETERA = '[BOLETERA]';

export const eventos: Evento[] = [
  { id: 'e1', titulo: 'Noche de salsa y boleros en vivo', categoria: 'Rumba', etiquetas: ['rumba'], ciudad: 'bogota', fecha: '2026-10-09', lugar: 'Galería Café Libro · Zona T', precio: 45000, vende: BOLETERA, bg1: '#E8A04F', bg2: '#B5372B', van: 186, parches: 3, hora: '8:00 p. m.', puertas: '8:00 p. m.', show: '9:30 p. m.' },
  { id: 'e2', titulo: 'Festival de jazz al parque', categoria: 'Conciertos', etiquetas: ['conciertos', 'gratis'], ciudad: 'bogota', fecha: '2026-10-10', lugar: 'Parque El Country · Usaquén', precio: 0, vende: 'Idartes', bg1: '#4F6DD8', bg2: '#1E2550', van: 640, parches: 5, hora: '2:00 p. m.' },
  { id: 'e3', titulo: 'Rock en el Movistar Arena', categoria: 'Conciertos', etiquetas: ['conciertos'], ciudad: 'bogota', fecha: '2026-10-10', lugar: 'Movistar Arena · Salitre', precio: 180000, vende: BOLETERA, bg1: '#D9452F', bg2: '#2B0F12', van: 1200, parches: 8 },
  { id: 'e4', titulo: 'Santa Fe vs. Millonarios', categoria: 'Deporte', etiquetas: ['deporte'], ciudad: 'bogota', fecha: '2026-10-11', lugar: 'Estadio El Campín · Teusaquillo', precio: 60000, vende: BOLETERA, bg1: '#C4302B', bg2: '#1F3A8A', van: 2100, parches: 12, hora: '4:00 p. m.' },
  { id: 'e5', titulo: 'Stand-up: risas de domingo', categoria: 'Arte y teatro', etiquetas: ['teatro'], ciudad: 'bogota', fecha: '2026-10-11', lugar: 'Teatro Libre · Chapinero', precio: 55000, vende: BOLETERA, bg1: '#EE93BC', bg2: '#5A2340', van: 92, parches: 1, hora: '7:00 p. m.' },
  { id: 'e6', titulo: 'Mercado gastronómico de las Américas', categoria: 'Comida', etiquetas: ['comida', 'gratis'], ciudad: 'bogota', fecha: '2026-10-10', lugar: 'Plaza de los Artesanos', precio: 0, vende: 'Entrada libre', bg1: '#F6DC6A', bg2: '#C46A2B', van: 410, parches: 2 },
  { id: 'e7', titulo: 'Noche de reguetón en Provenza', categoria: 'Rumba', etiquetas: ['rumba'], ciudad: 'medellin', fecha: '2026-10-09', lugar: 'Barrio Provenza · El Poblado', precio: 50000, vende: BOLETERA, bg1: '#6B3FA0', bg2: '#0E0A1A', van: 320, parches: 4, hora: '10:00 p. m.' },
  { id: 'e8', titulo: 'Atlético Nacional vs. Junior', categoria: 'Deporte', etiquetas: ['deporte'], ciudad: 'medellin', fecha: '2026-10-12', lugar: 'Estadio Atanasio Girardot', precio: 70000, vende: BOLETERA, bg1: '#3E9B63', bg2: '#0F2A1C', van: 1800, parches: 9 },
  { id: 'e9', titulo: 'Milonga en Manrique', categoria: 'Rumba', etiquetas: ['rumba'], ciudad: 'medellin', fecha: '2026-10-10', lugar: 'Casa del tango · Manrique', precio: 25000, vende: BOLETERA, bg1: '#B88A5A', bg2: '#3A2414', van: 64, parches: 1 },
  { id: 'e10', titulo: 'Viejoteca de salsa caleña', categoria: 'Rumba', etiquetas: ['rumba'], ciudad: 'cali', fecha: '2026-10-10', lugar: 'Juanchito', precio: 40000, vende: BOLETERA, bg1: '#F3B27E', bg2: '#8A2E1F', van: 150, parches: 2 },
  { id: 'e11', titulo: 'Concierto de músicas del Pacífico', categoria: 'Conciertos', etiquetas: ['conciertos'], ciudad: 'cali', fecha: '2026-10-11', lugar: 'Teatro Municipal', precio: 35000, vende: BOLETERA, bg1: '#8FD3D0', bg2: '#12343A', van: 210, parches: 0 },
  { id: 'e12', titulo: 'Vallenato en el Gran Malecón', categoria: 'Conciertos', etiquetas: ['conciertos', 'gratis'], ciudad: 'barranquilla', fecha: '2026-10-10', lugar: 'Gran Malecón del Río', precio: 0, vende: 'Entrada libre', bg1: '#F6DC6A', bg2: '#1E5A7A', van: 980, parches: 3, hora: '5:00 p. m.' },
  { id: 'e13', titulo: 'Noche de champeta en Getsemaní', categoria: 'Rumba', etiquetas: ['rumba'], ciudad: 'cartagena', fecha: '2026-10-09', lugar: 'Plaza de la Trinidad · Getsemaní', precio: 30000, vende: BOLETERA, bg1: '#EE93BC', bg2: '#4A1A3A', van: 275, parches: 2 },
  { id: 'e14', titulo: 'Atardecer electrónico en la playa', categoria: 'Rumba', etiquetas: ['rumba'], ciudad: 'santamarta', fecha: '2026-10-10', lugar: 'Playa El Rodadero', precio: 90000, vende: BOLETERA, bg1: '#F3B27E', bg2: '#1E2550', van: 340, parches: 3 },
  { id: 'e15', titulo: 'Festival de cerveza artesanal', categoria: 'Comida', etiquetas: ['comida'], ciudad: 'bucaramanga', fecha: '2026-10-11', lugar: 'Parque San Pío', precio: 25000, vende: BOLETERA, bg1: '#E8A04F', bg2: '#5A3A14', van: 120, parches: 1 },
  { id: 'e16', titulo: 'Noche de trova en el lago', categoria: 'Conciertos', etiquetas: ['conciertos', 'gratis'], ciudad: 'pereira', fecha: '2026-10-09', lugar: 'Parque Lago Uribe Uribe', precio: 0, vende: 'Entrada libre', bg1: '#A3A8F0', bg2: '#2A2550', van: 88, parches: 0 },
  { id: 'e17', titulo: 'Joropo en Los Fundadores', categoria: 'Conciertos', etiquetas: ['conciertos', 'gratis'], ciudad: 'villavicencio', fecha: '2026-10-11', lugar: 'Parque Los Fundadores', precio: 0, vende: 'Entrada libre', bg1: '#B9E07A', bg2: '#2A3A14', van: 230, parches: 1 },
  { id: 'e18', titulo: 'Concierto andino en la plaza', categoria: 'Conciertos', etiquetas: ['conciertos', 'gratis'], ciudad: 'pasto', fecha: '2026-10-10', lugar: 'Plaza de Nariño', precio: 0, vende: 'Entrada libre', bg1: '#8FD3D0', bg2: '#2A1F3A', van: 160, parches: 0 },
  { id: 'e19', titulo: 'Música y comida en el malecón del Amazonas', categoria: 'Comida', etiquetas: ['comida', 'gratis'], ciudad: 'leticia', fecha: '2026-10-11', lugar: 'Malecón de Leticia', precio: 0, vende: 'Entrada libre', bg1: '#B9E07A', bg2: '#12343A', van: 70, parches: 0 },
];

export const conteoCiudad = (ciudad: string) => eventos.filter((e) => e.ciudad === ciudad).length;
