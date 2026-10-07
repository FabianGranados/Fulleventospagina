// Datos de ejemplo del Registro (handoff 4.4, "Datos de ejemplo"). En producción vienen del backend (H53).
import type { ColorAvatar } from '../components/ui/Avatar.astro';
import { persona } from './personas';

export const pasos = ['Tu cuenta', 'Tus gustos', 'Tu gente'] as const;

// Llaves estables (slug) y el texto solo como etiqueta (detalle fino 15)
export const gustos = [
  { id: 'salsa', etiqueta: 'Salsa' },
  { id: 'rock', etiqueta: 'Rock' },
  { id: 'electronica', etiqueta: 'Electrónica' },
  { id: 'regueton', etiqueta: 'Reguetón' },
  { id: 'jazz', etiqueta: 'Jazz' },
  { id: 'conciertos', etiqueta: 'Conciertos' },
  { id: 'futbol', etiqueta: 'Fútbol' },
  { id: 'stand-up', etiqueta: 'Stand-up' },
  { id: 'teatro', etiqueta: 'Teatro' },
  { id: 'comida', etiqueta: 'Comida' },
  { id: 'planes-gratis', etiqueta: 'Planes gratis' },
  { id: 'festivales', etiqueta: 'Festivales' },
];

export const MINIMO_GUSTOS = 3;

export interface Sugerencia {
  id: string;
  nombre: string;
  iniciales: string;
  // Las personas usan los colores .c1–.c6; los organizadores, tinta con letras amarillas (sección 3)
  color?: ColorAvatar;
  organizador?: boolean;
  motivo: string;
  // Sugerencias que salen de la libreta de contactos: no se muestran sin ese permiso (H28)
  requiereContactos?: boolean;
}

const desdePersona = (id: string, motivo: string, requiereContactos = false): Sugerencia => {
  const p = persona(id)!;
  return { id: p.id, nombre: p.nombre, iniciales: p.iniciales, color: p.color, motivo, requiereContactos };
};

// Mismo orden del prototipo. Ids compartidos con el resto de pantallas (inconsistencia u1–u5 del handoff).
export const sugerencias: Sugerencia[] = [
  desdePersona('lauram', 'Está en tus contactos', true),
  desdePersona('andresr', 'Está en tus contactos', true),
  desdePersona('sofiac', 'Le gusta la salsa y el fútbol'),
  desdePersona('mafe', 'Va a 4 eventos que te gustan'),
  {
    id: 'galeriacafelibro',
    nombre: 'Galería Café Libro',
    iniciales: 'GC',
    organizador: true,
    motivo: 'Lugar · organiza eventos de salsa',
  },
];
