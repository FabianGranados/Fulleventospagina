// Datos de ejemplo de la Agenda (handoff 4.6, "Datos de ejemplo"). En producción vienen del backend (H53).
// Línea social de cada evento: quién aparece, reposts totales (incluye a "quien"), colores de los
// 2 avatares y si lo repostearon tus amigos cercanos (filtro "Lo que repostea tu gente").
import type { ColorAvatar } from '../components/ui/Avatar.astro';

export interface SocialAgenda {
  quien: string;
  reposts: number;
  colores: [ColorAvatar, ColorAvatar];
  amigos: boolean;
}

// c1 #F3B27E · c2 #A3A8F0 · c3 #EE93BC · c4 #B9E07A · c5 #F6DC6A · c6 #8FD3D0
export const socialAgenda: Record<string, SocialAgenda> = {
  e1: { quien: 'Laura', reposts: 14, colores: ['c1', 'c3'], amigos: true },
  e2: { quien: 'Andrés', reposts: 31, colores: ['c2', 'c4'], amigos: true },
  e3: { quien: 'Daniel', reposts: 52, colores: ['c6', 'c5'], amigos: false },
  e4: { quien: 'Sofía', reposts: 88, colores: ['c3', 'c4'], amigos: true },
  e5: { quien: 'Juan Pablo', reposts: 9, colores: ['c4', 'c1'], amigos: true },
  e6: { quien: 'Mafe', reposts: 21, colores: ['c5', 'c2'], amigos: false },
  e7: { quien: 'Valentina', reposts: 17, colores: ['c2', 'c6'], amigos: true },
  e8: { quien: 'Mateo', reposts: 64, colores: ['c4', 'c6'], amigos: false },
  e9: { quien: 'Isa', reposts: 7, colores: ['c1', 'c2'], amigos: false },
  e10: { quien: 'Caro', reposts: 23, colores: ['c3', 'c5'], amigos: true },
  e11: { quien: 'Felipe', reposts: 12, colores: ['c6', 'c4'], amigos: false },
  e12: { quien: 'Nata', reposts: 40, colores: ['c5', 'c6'], amigos: false },
  e13: { quien: 'Laura', reposts: 19, colores: ['c1', 'c2'], amigos: true },
  e14: { quien: 'Sebas', reposts: 26, colores: ['c2', 'c1'], amigos: true },
  e15: { quien: 'Tomás', reposts: 8, colores: ['c4', 'c3'], amigos: false },
  e16: { quien: 'Majo', reposts: 5, colores: ['c2', 'c5'], amigos: false },
  e17: { quien: 'Simón', reposts: 11, colores: ['c6', 'c1'], amigos: false },
  e18: { quien: 'Ana María', reposts: 6, colores: ['c3', 'c6'], amigos: false },
  e19: { quien: 'Dani', reposts: 4, colores: ['c4', 'c2'], amigos: false },
};

// Estado inicial del prototipo: "Festival de jazz al parque" ya reposteado por la usuaria
export const reposteadosIniciales = ['e2'];

// Categorías de la Agenda (textos exactos del prototipo)
export const categoriasAgenda = [
  { id: 'all', texto: 'Para ti' },
  { id: 'amigos', texto: 'Lo que repostea tu gente' },
  { id: 'rumba', texto: 'Rumba' },
  { id: 'conciertos', texto: 'Conciertos' },
  { id: 'gratis', texto: 'Gratis' },
  { id: 'comida', texto: 'Comida' },
  { id: 'deporte', texto: 'Deporte' },
  { id: 'teatro', texto: 'Arte y teatro' },
];

// Fechas (H39: filtran de verdad). El prototipo no define qué día es "hoy": el demo lo fija en el
// viernes 9 de octubre de 2026, primer día del fin de semana de ejemplo (9 al lunes festivo 12).
// "Próxima semana" va del martes 13 al domingo 18. En producción, "hoy" sale del reloj del servidor
// (zona America/Bogota).
export const fechasAgenda = [
  { id: 'hoy', texto: 'Hoy', desde: '2026-10-09', hasta: '2026-10-09', titulo: 'Hoy', periodo: 'hoy' },
  { id: 'finde', texto: 'Este finde', desde: '2026-10-09', hasta: '2026-10-12', titulo: 'Este finde', periodo: 'este finde' },
  { id: 'semana', texto: 'Próxima semana', desde: '2026-10-13', hasta: '2026-10-18', titulo: 'La próxima semana', periodo: 'la próxima semana' },
];

// Destinos del repost (N16)
export const destinosRepost = [
  { id: 'feed', titulo: 'En mi feed', detalle: 'Lo ven todos tus seguidores', aviso: 'tu feed' },
  { id: 'parche', titulo: 'En un parche', detalle: 'Salseros de jueves · 12 miembros', aviso: 'el parche Salseros de jueves' },
  { id: 'amigos', titulo: 'Solo a amigos cercanos', detalle: 'Una lista que tú eliges', aviso: 'tus amigos cercanos' },
];

// Línea social (4.6 §7). Si la usuaria reposteó: "Tú, {quien} y {n} más"; si no: "{quien} y {n} más".
export const lineaRepost = (s: SocialAgenda, reposteado: boolean) => {
  const resto = s.reposts - 1;
  const base = reposteado ? `Tú, ${s.quien}` : s.quien;
  return resto > 0 ? `${base} y ${resto} más lo repostearon` : `${base} lo repostearon`;
};
