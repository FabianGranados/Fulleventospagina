// Datos propios de la pantalla Mapa (handoff 4.7, "Datos de ejemplo"). En producción vienen del backend
// con coordenadas reales (H53) y el proveedor de mapas está pendiente (P5).
import { ciudades, type Ciudad } from './ciudades';

// ox/oy: desplazamiento del punto (px) cuando el mapa está alejado, para que no se monten las ciudades vecinas.
// lab: lado donde va el nombre de la ciudad. Las posiciones (left/top) son las de src/data/ciudades.ts.
type Lado = 'derecha' | 'izquierda' | 'abajo' | 'arriba';

const ajustes: Record<string, { ox: number; oy: number; lado: Lado }> = {
  bogota: { ox: 0, oy: 0, lado: 'derecha' },
  medellin: { ox: 0, oy: 0, lado: 'izquierda' },
  cali: { ox: 0, oy: 0, lado: 'abajo' },
  barranquilla: { ox: 0, oy: 0, lado: 'arriba' },
  cartagena: { ox: -38, oy: 18, lado: 'abajo' },
  santamarta: { ox: 46, oy: -20, lado: 'derecha' },
  bucaramanga: { ox: 0, oy: 0, lado: 'derecha' },
  pereira: { ox: 0, oy: 0, lado: 'izquierda' },
  villavicencio: { ox: 28, oy: 30, lado: 'derecha' },
  pasto: { ox: 0, oy: 0, lado: 'abajo' },
  leticia: { ox: 0, oy: 0, lado: 'derecha' },
};

export interface CiudadMapa extends Ciudad {
  ox: number;
  oy: number;
  lado: Lado;
}

export const ciudadesMapa: CiudadMapa[] = ciudades.map((c) => ({ ...c, ...ajustes[c.id] }));

// Proyección equirectangular (decisión 2.8): x = (lon + 79.5) × 10, y = (13 − lat) × 10, viewBox 0 0 130 175.
export const contornoColombia =
  'M21.4 43.2 L26.5 46.0 L27.5 49.5 L27.2 45.5 L30.7 41.5 L38.2 36.0 L39.2 34.5 L38.5 30.0 L39.5 26.0 L42.5 22.0 L46.5 20.0 L51.0 19.0 L52.9 17.6 L58.0 17.0 L65.9 14.6 L70.0 12.0 L73.3 8.0 L78.3 5.4 L81.0 8.0 L81.7 11.5 L75.5 14.5 L72.5 19.0 L66.5 25.5 L64.5 33.0 L61.5 39.0 L67.5 43.5 L71.0 47.0 L70.3 51.0 L73.0 56.0 L83.0 59.5 L94.0 59.2 L101.0 60.5 L120.2 68.0 L117.0 78.0 L116.5 86.0 L119.0 91.3 L123.0 102.0 L124.0 111.0 L126.3 118.3 L116.0 119.0 L113.0 113.0 L101.0 112.0 L96.0 117.5 L94.5 123.5 L94.5 131.0 L99.0 137.5 L100.5 144.0 L97.0 152.0 L95.5 163.0 L95.6 172.2 L91.0 168.0 L92.0 158.0 L84.0 154.0 L75.0 153.0 L66.0 154.5 L60.0 151.0 L53.0 142.0 L47.2 132.0 L41.0 129.0 L32.0 127.0 L26.0 126.0 L18.5 121.5 L14.0 118.0 L6.5 115.5 L7.0 112.0 L9.0 108.0 L16.0 104.3 L20.0 98.0 L23.0 91.2 L21.0 85.0 L20.5 75.0 L20.5 68.0 L17.0 60.0 L17.5 55.0 L20.5 50.5 L22.0 47.0 Z';

export const cordilleras = [
  {
    d: 'M31 112 L36.5 106 L42 101 L45 94 L47 87 L47.5 78 L49.5 71 L51 65 L56.5 59.3 L56 50 L55 41 L51 37.6 L47.5 36 L46.5 31 L46 27.5 L47 20.5',
    opacidad: 0.32,
    grosor: 1.2,
  },
  {
    d: 'M28 108 L29.6 96 L33 89 L36 82.5 L38 76 L39 69 L40.5 62 L43 50 L46.5 42 L49 38.5',
    opacidad: 0.26,
    grosor: 1,
  },
];

// "mar": siempre visible (más pequeño en mapas angostos); "pais": se oculta en mapas angostos.
export const rotulosGeo = [
  { texto: 'Mar Caribe', left: 16, top: 7, giro: 0, tipo: 'mar' },
  { texto: 'Océano Pacífico', left: 6, top: 48, giro: -90, tipo: 'mar' },
  { texto: 'Panamá', left: 8, top: 24, giro: 0, tipo: 'pais' },
  { texto: 'Venezuela', left: 86, top: 24, giro: 0, tipo: 'pais' },
  { texto: 'Ecuador', left: 9, top: 82, giro: 0, tipo: 'pais' },
  { texto: 'Perú', left: 44, top: 93, giro: 0, tipo: 'pais' },
  { texto: 'Brasil', left: 90, top: 80, giro: 0, tipo: 'pais' },
] as const;

export const categoriasMapa = [
  { id: 'all', texto: 'Todo' },
  { id: 'rumba', texto: 'Rumba' },
  { id: 'conciertos', texto: 'Conciertos' },
  { id: 'gratis', texto: 'Gratis' },
  { id: 'comida', texto: 'Comida' },
  { id: 'deporte', texto: 'Deporte' },
  { id: 'teatro', texto: 'Arte y teatro' },
];

// Filtro de fecha real (H39). El demo fija "hoy" en el 7 de octubre de 2026 y los eventos de ejemplo
// solo cubren el puente del 9 al 12 de octubre; en producción el rango sale del servidor (America/Bogota).
export const fechasMapa = [
  { id: 'hoy', texto: 'Hoy', desde: '2026-10-07', hasta: '2026-10-07', frase: 'hoy', rango: 'hoy, miércoles 7 de octubre' },
  {
    id: 'finde',
    texto: 'Este finde',
    desde: '2026-10-09',
    hasta: '2026-10-12',
    frase: 'este finde',
    rango: 'del viernes 9 al lunes festivo 12 de octubre',
  },
  {
    id: 'semana',
    texto: 'Próxima semana',
    desde: '2026-10-13',
    hasta: '2026-10-18',
    frase: 'la próxima semana',
    rango: 'del martes 13 al domingo 18 de octubre',
  },
] as const;

// Ciudad de la usuaria del demo (Camila Vargas). En producción sale de su perfil (H45).
export const miCiudad = 'bogota';

// Patrón de Bienvenida (H47): primeros planes y "Ver N planes más"
export const LIMITE_LISTA = 8;
