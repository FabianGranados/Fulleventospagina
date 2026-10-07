// Estado de la usuaria del demo (Camila Vargas) frente a los eventos: un solo dato para Inicio, Evento,
// Perfil y Mensajes (H37, H53). "Voy" y "Tengo boleta" son cosas distintas (H37): se puede ir sin boleta
// todavía (la salsa) y tener boleta (el clásico). En producción sale del servidor por usuario (H12).
import { usuaria } from './personas';
import { parches, type Parche } from './parches';
import { eventos } from './eventos';

const YO = usuaria.id;

export const asistencia = {
  // Eventos donde marcó "Voy"
  voy: ['e1', 'e2', 'e4'],
  // Eventos que le interesan ("Me interesa")
  interesa: ['e3', 'e8'],
  // Eventos de los que ya tiene boleta ("7 de 12 con boleta" en Salseros no la incluye; en el clásico sí)
  boletas: ['e4'],
};

// Amigos de la usuaria: los que se pueden elegir en "Nuevo parche" y "Nuevo chat" (4.9), en ese orden
export const AMIGOS = ['lauram', 'andresr', 'sofiac', 'juanpablo', 'mafe', 'danielt', 'valeq'];

export const misParches = parches.filter((p) => p.miembros.includes(YO));

export const enParche = (evento: string) => misParches.find((p) => p.evento === evento);
export const va = (evento: string) => asistencia.voy.includes(evento);
export const leInteresa = (evento: string) => asistencia.interesa.includes(evento);
export const tieneBoleta = (evento: string) => asistencia.boletas.includes(evento);

// Quiénes tienen boleta en un parche, con la usuaria si es miembro y ya la tiene
export const conBoletaDe = (p: Parche) =>
  p.miembros.includes(YO) && p.evento && tieneBoleta(p.evento) ? [...p.conBoleta, YO] : p.conBoleta;

// Estado de un plan con una sola regla de prioridad (8.2.8, "Detalles finos": "En parche" > "Va" > "Le interesa")
export type EstadoPlan = 'parche' | 'va' | 'interesa';
export const estadoPlan = (evento: string): EstadoPlan | null =>
  enParche(evento) ? 'parche' : va(evento) ? 'va' : leInteresa(evento) ? 'interesa' : null;

// "Próximos planes" del perfil: todo evento con estado, por fecha ascendente
export const planesDeUsuaria = () =>
  eventos
    .filter((e) => estadoPlan(e.id))
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .map((e) => ({ evento: e.id, estado: estadoPlan(e.id)! }));

// Amigos que van a un evento: los que están en algún parche de ese evento. Es lo único que dicen los datos
// de ejemplo sobre a qué va cada amigo; no se inventan cifras (H37: "3 amigos" estaba fijo).
export const amigosQueVan = (evento: string) => {
  const ids = new Set(parches.filter((p) => p.evento === evento).flatMap((p) => p.miembros));
  return AMIGOS.filter((id) => ids.has(id));
};

// Miembros del parche (sin la usuaria) que todavía no tienen boleta: a ellos se les puede comprar (H25)
export const sinBoleta = (p: Parche) => p.miembros.filter((id) => id !== YO && !p.conBoleta.includes(id));
export const conBoletaSinMi = (p: Parche) => p.miembros.filter((id) => id !== YO && p.conBoleta.includes(id));
