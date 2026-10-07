// Datos semilla del handoff (4.2 y 4.3). En producción vienen del backend (H53).
export interface Ciudad {
  id: string;
  nombre: string;
  // Posición del pin en el mini-mapa de Bienvenida, en % del lienzo de 130 × 175
  left: number;
  top: number;
  rotulo: 'derecha' | 'izquierda';
  dy: number;
}

export const ciudades: Ciudad[] = [
  { id: 'bogota', nombre: 'Bogotá', left: 41.8, top: 47.4, rotulo: 'derecha', dy: -9 },
  { id: 'medellin', nombre: 'Medellín', left: 30.2, top: 38.6, rotulo: 'izquierda', dy: 0 },
  { id: 'cali', nombre: 'Cali', left: 22.8, top: 54.6, rotulo: 'izquierda', dy: 0 },
  { id: 'barranquilla', nombre: 'Barranquilla', left: 36.2, top: 11.7, rotulo: 'izquierda', dy: -8 },
  { id: 'cartagena', nombre: 'Cartagena', left: 30.9, top: 14.9, rotulo: 'izquierda', dy: 5 },
  { id: 'santamarta', nombre: 'Santa Marta', left: 40.8, top: 10.1, rotulo: 'derecha', dy: -2 },
  { id: 'bucaramanga', nombre: 'Bucaramanga', left: 49.1, top: 33.6, rotulo: 'derecha', dy: 0 },
  { id: 'pereira', nombre: 'Pereira', left: 29.3, top: 46.8, rotulo: 'izquierda', dy: 0 },
  { id: 'villavicencio', nombre: 'Villavicencio', left: 45.2, top: 50.6, rotulo: 'derecha', dy: 5 },
  { id: 'pasto', nombre: 'Pasto', left: 17.1, top: 67.4, rotulo: 'izquierda', dy: 0 },
  { id: 'leticia', nombre: 'Leticia', left: 73.5, top: 97, rotulo: 'izquierda', dy: 0 },
];

export const nombreCiudad = (id: string) => ciudades.find((c) => c.id === id)?.nombre ?? id;
