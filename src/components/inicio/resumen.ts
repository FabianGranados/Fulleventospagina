// Cálculos compartidos de "Tu semana" y "Tus parches" de Inicio: los usan las columnas de computador
// (Descubre, CuentaLateral) y el resumen compacto de celular (ResumenCelular, decisión 2.27). Una sola fuente (H37).
import { tuSemana } from '../../data/inicio';
import { eventos } from '../../data/eventos';
import { conversaciones } from '../../data/mensajes';
import { totalMiembros, type Parche } from '../../data/parches';
import { horaSinCorte, placaFecha, rutaEvento } from '../../lib/formato';

export const semana = tuSemana.map((s) => {
  const e = eventos.find((ev) => ev.id === s.evento)!;
  const dia = new Date(`${e.fecha}T12:00:00-05:00`)
    .toLocaleDateString('es-CO', { weekday: 'short', timeZone: 'America/Bogota' })
    .replace('.', '');
  return {
    titulo: e.titulo,
    href: rutaEvento(e.ciudad, e.titulo),
    numero: placaFecha(e.fecha).dia,
    dia,
    // La hora sale del evento (H37); sin hora, solo el detalle
    detalle: [e.hora && horaSinCorte(e.hora), s.detalle].filter(Boolean).join(' · '),
  };
});

export const confirmados = semana.length === 1 ? '1 plan confirmado' : `${semana.length} planes confirmados`;

// Una regla para todos (detalle fino 48): con cupo máximo, "N de M cupos"; sin cupo, "N miembros" y los
// mensajes nuevos de su chat, el mismo dato que el separador "N mensajes nuevos" de Mensajes (H37)
const nuevosDe = (p: Parche) => conversaciones.find((c) => c.id === p.id)?.nuevos ?? 0;
export const estadoParche = (p: Parche) => {
  const n = totalMiembros(p);
  if (p.cupos) return `${n} de ${p.cupos} cupos`;
  const nuevos = nuevosDe(p);
  return `${n} miembros${nuevos ? ` · ${nuevos} ${nuevos === 1 ? 'nuevo' : 'nuevos'}` : ''}`;
};

export const fondoParche: Record<string, string> = {
  c1: 'var(--peach)',
  c2: 'var(--lilac)',
  c3: 'var(--pink)',
  c4: 'var(--lime)',
  c5: 'var(--yellow)',
  c6: 'var(--aqua)',
};
