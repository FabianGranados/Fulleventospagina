// Personas de ejemplo del prototipo (07, "Asignación de colores a personas"). Un solo nombre por persona (H62).
// En producción vienen del backend (H53). La usuaria con sesión del demo es Camila Vargas.
import type { ColorAvatar } from '../components/ui/Avatar.astro';

export interface Persona {
  id: string;
  nombre: string;
  iniciales: string;
  color: ColorAvatar;
}

export const personas: Persona[] = [
  { id: 'camivargas', nombre: 'Camila Vargas', iniciales: 'CV', color: 'c6' },
  { id: 'lauram', nombre: 'Laura Martínez', iniciales: 'LM', color: 'c1' },
  { id: 'andresr', nombre: 'Andrés Ramírez', iniciales: 'AR', color: 'c2' },
  { id: 'sofiac', nombre: 'Sofía Cárdenas', iniciales: 'SC', color: 'c3' },
  { id: 'juanpablo', nombre: 'Juan Pablo Rojas', iniciales: 'JP', color: 'c4' },
  { id: 'mafe', nombre: 'María F. Gómez', iniciales: 'MG', color: 'c5' },
  { id: 'danielt', nombre: 'Daniel Torres', iniciales: 'DT', color: 'c6' },
  { id: 'valeq', nombre: 'Valentina Quintero', iniciales: 'VQ', color: 'c2' },
  { id: 'natah', nombre: 'Natalia Herrera', iniciales: 'NH', color: 'c5' },
  { id: 'caror', nombre: 'Carolina Ruiz', iniciales: 'CR', color: 'c3' },
  { id: 'sebasb', nombre: 'Sebastián Becerra', iniciales: 'SB', color: 'c6' },
  { id: 'majop', nombre: 'Majo Pineda', iniciales: 'MJ', color: 'c4' },
];

export const usuaria = personas[0];

export const persona = (id: string) => personas.find((p) => p.id === id);
