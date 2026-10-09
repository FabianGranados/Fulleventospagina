// Datos de ejemplo del Perfil (handoff 4.10, "Datos de ejemplo"). En producción vienen del backend (H53).
// Solo Camila Vargas tiene perfil en el prototipo; las demás personas muestran lo que hay en personas.ts.

// El estado de la persona frente a cada plan ("Va", "Le interesa", "En parche") sale de asistencia.ts,
// el mismo dato de Inicio y Evento (H37).

import { misParches, planesDeUsuaria } from './asistencia';
import { eventos } from './eventos';
import { usuaria } from './personas';

export interface Recuerdo {
  titulo: string;
  ciudad: string;
  mes: string; // texto del diseño: "Sep 2026" (sin punto, mayúscula inicial)
  bg1: string;
  bg2: string;
}

export interface Resena {
  titulo: string;
  estrellas: number; // de 1 a 5
  texto: string;
  mes: string;
  utiles: number;
}

export interface Perfil {
  barrio?: string; // solo para quien la persona autorice (H30)
  ciudad: string; // id de ciudades.ts
  biografia: string;
  // Las únicas cifras que no salen de los datos: las del prototipo (handoff 4.10). Planes, ciudades y parches se
  // calculan con cifrasPerfil (PF6, decisión 2.29).
  seguidores: number;
  siguiendo: number;
  gustos: string[];
  recuerdos: Recuerdo[]; // del más reciente al más antiguo
  resenas: Resena[]; // de la más reciente a la más antigua
}

export const perfiles: Record<string, Perfil> = {
  camivargas: {
    barrio: 'Chapinero',
    ciudad: 'bogota',
    biografia:
      'Salsera de jueves, rockera de sábado. Si hay concierto gratis en un parque, ahí estoy. Siempre busco gente para armar parche.',
    seguidores: 412,
    siguiendo: 289,
    gustos: ['Salsa', 'Rock', 'Planes gratis', 'Stand-up', 'Fútbol'],
    recuerdos: [
      { titulo: 'Techno hasta el amanecer', ciudad: 'bogota', mes: 'Sep 2026', bg1: '#6B3FA0', bg2: '#0E0A1A' },
      { titulo: 'Feria de las Flores', ciudad: 'medellin', mes: 'Ago 2026', bg1: '#F6DC6A', bg2: '#3E9B63' },
      { titulo: 'Rock al Parque', ciudad: 'bogota', mes: 'Jul 2026', bg1: '#D9452F', bg2: '#2B0F12' },
      { titulo: 'Mercado de las Américas', ciudad: 'bogota', mes: 'Jun 2026', bg1: '#F6DC6A', bg2: '#C46A2B' },
      { titulo: 'La casa de Bernarda Alba', ciudad: 'bogota', mes: 'May 2026', bg1: '#B88A5A', bg2: '#3A2414' },
      { titulo: 'Salsa al Parque', ciudad: 'bogota', mes: 'Abr 2026', bg1: '#E8A04F', bg2: '#B5372B' },
      { titulo: 'Stand-up en Teatro Libre', ciudad: 'bogota', mes: 'Mar 2026', bg1: '#EE93BC', bg2: '#5A2340' },
      { titulo: 'Carnaval de Barranquilla', ciudad: 'barranquilla', mes: 'Feb 2026', bg1: '#EE93BC', bg2: '#1E5A7A' },
    ],
    resenas: [
      {
        titulo: 'Techno hasta el amanecer',
        estrellas: 4,
        texto: 'El sonido estuvo brutal. La fila para entrar fue larga, lleguen antes de las 11.',
        mes: 'Sep 2026',
        utiles: 17,
      },
      {
        titulo: 'Rock al Parque',
        estrellas: 5,
        texto: 'Tres días que no olvido. El parche de la app nos salvó para encontrarnos.',
        mes: 'Jul 2026',
        utiles: 42,
      },
    ],
  },
};

export const perfil = (id: string): Perfil | undefined => perfiles[id];

// Color de cada gusto por posición, en el ciclo del prototipo (4.10, sección 6)
export const coloresGusto = ['var(--peach)', 'var(--lilac)', 'var(--lime)', 'var(--pink)', 'var(--yellow)'];

// Cifras del perfil, calculadas de los datos (PF6, decisión 2.29). Una sola fuente para Perfil e Inicio
// (CuentaLateral): antes eran 38 / 5 / 7 fijas y no coincidían con lo que se veía en las pestañas.
// - Planes: próximos planes + recuerdos. "Planes" en lugar de "Eventos" (H37).
// - Ciudades: ciudades distintas de esos planes y recuerdos.
// - Parches: parches de los que es miembro.
// Solo existen para quien tiene perfil con datos (Camila en el demo): de las demás no se inventan cifras.
export interface CifrasPerfil {
  planes: number;
  ciudades: number;
  parches: number;
  seguidores: number;
  siguiendo: number;
}

export const cifrasPerfil = (id: string): CifrasPerfil | undefined => {
  const p = perfil(id);
  if (!p) return undefined;
  // Asistencia y parches solo están cargados para la usuaria del demo (asistencia.ts)
  const proximos = id === usuaria.id ? planesDeUsuaria() : [];
  const ciudadesProximos = proximos.map((x) => eventos.find((e) => e.id === x.evento)?.ciudad).filter(Boolean);
  return {
    planes: proximos.length + p.recuerdos.length,
    ciudades: new Set([...ciudadesProximos, ...p.recuerdos.map((r) => r.ciudad)]).size,
    parches: id === usuaria.id ? misParches.length : 0,
    seguidores: p.seguidores,
    siguiendo: p.siguiendo,
  };
};
