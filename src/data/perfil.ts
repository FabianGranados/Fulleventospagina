// Datos de ejemplo del Perfil (handoff 4.10, "Datos de ejemplo"). En producción vienen del backend (H53).
// Solo Camila Vargas tiene perfil en el prototipo; las demás personas muestran lo que hay en personas.ts.

// Estado de la persona frente a un plan. Se escribe en segunda persona en Mi perfil y en tercera en
// el perfil ajeno (H37 y la tabla "Estado de asistencia" de la sección 7).
export type EstadoPlan = 'va' | 'interesa' | 'parche';

export interface Estadistica {
  etiqueta: string;
  valor: number;
}

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
  estadisticas: Estadistica[];
  gustos: string[];
  planes: { evento: string; estado: EstadoPlan }[]; // ids de eventos.ts, por fecha ascendente
  recuerdos: Recuerdo[]; // del más reciente al más antiguo
  resenas: Resena[]; // de la más reciente a la más antigua
}

export const perfiles: Record<string, Perfil> = {
  camivargas: {
    barrio: 'Chapinero',
    ciudad: 'bogota',
    biografia:
      'Salsera de jueves, rockera de sábado. Si hay concierto gratis en un parque, ahí estoy. Siempre busco gente para armar parche.',
    // "Planes" en lugar de "Eventos": un solo término con Inicio (H37, recomendación de la sección 8)
    estadisticas: [
      { etiqueta: 'Planes', valor: 38 },
      { etiqueta: 'Ciudades', valor: 5 },
      { etiqueta: 'Seguidores', valor: 412 },
      { etiqueta: 'Siguiendo', valor: 289 },
      { etiqueta: 'Parches', valor: 7 },
    ],
    gustos: ['Salsa', 'Rock', 'Planes gratis', 'Stand-up', 'Fútbol'],
    planes: [
      { evento: 'e1', estado: 'va' },
      { evento: 'e2', estado: 'va' },
      { evento: 'e3', estado: 'interesa' },
      { evento: 'e4', estado: 'parche' },
      { evento: 'e8', estado: 'interesa' },
    ],
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
