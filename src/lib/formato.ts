export const cifra = (n: number) => n.toLocaleString('es-CO');

export const pesos = (n: number) => '$' + cifra(n);

export const planes = (n: number) => `${n} ${n === 1 ? 'plan' : 'planes'}`;

export const ciudadesTexto = (n: number) => `${n} ${n === 1 ? 'ciudad' : 'ciudades'}`;

// Día y mes abreviado sin el punto que agrega Intl ("oct." → "oct")
export const placaFecha = (iso: string) => {
  const fecha = new Date(`${iso}T12:00:00-05:00`);
  const dia = fecha.toLocaleDateString('es-CO', { day: 'numeric', timeZone: 'America/Bogota' });
  const mes = fecha
    .toLocaleDateString('es-CO', { month: 'short', timeZone: 'America/Bogota' })
    .replace('.', '');
  return { dia, mes };
};

export const slug = (texto: string) =>
  texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const rutaEvento = (ciudad: string, titulo: string) => `/evento/${ciudad}/${slug(titulo)}`;

// "2026-10-09" + "8:00 p. m." → "2026-10-09T20:00:00-05:00" (zona America/Bogota, sin horario de verano; H34)
export const isoConHora = (fecha: string, hora: string) => {
  const m = hora.match(/^(\d{1,2}):(\d{2})\s*([ap])\.\s*m\.$/);
  if (!m) return fecha;
  const h = (Number(m[1]) % 12) + (m[3] === 'p' ? 12 : 0);
  return `${fecha}T${String(h).padStart(2, '0')}:${m[2]}:00-05:00`;
};

// Hora con espacios de no separación, para que no se parta entre "p." y "m." (detalle fino 33 de Inicio)
export const horaSinCorte = (hora: string) => hora.replace(/ /g, '\u00A0');
