// Texto fijo del handoff (4.3, tabla de noticias). Sin enlace hasta que exista la página de noticia (H36).
export interface Noticia {
  antetitulo: string;
  titulo: string;
  bajada?: string;
  tiempo: string;
}

export const destacada: Noticia = {
  antetitulo: 'Cartel confirmado · Bogotá',
  titulo: 'El festival de noviembre en el Simón Bolívar revela su cartel completo',
  bajada: 'Tres escenarios, más de 40 artistas y entrada por días. La preventa abre este jueves.',
  tiempo: 'Hace 3 horas · 4 min de lectura',
};

export const lista: Noticia[] = [
  {
    antetitulo: 'Venta de boletas · Bogotá',
    titulo: 'Se agotó la primera fase para el concierto del Movistar Arena; anuncian segunda fecha',
    tiempo: 'Hace 5 horas',
  },
  {
    antetitulo: 'Nuevo lugar · Medellín',
    titulo: 'Abre en El Poblado un club con programación de electrónica de jueves a sábado',
    tiempo: 'Ayer',
  },
  {
    antetitulo: 'Gratis · Barranquilla',
    titulo: 'Vallenato en vivo en el Gran Malecón del Río todos los sábados de octubre',
    tiempo: 'Hace 2 días',
  },
];
