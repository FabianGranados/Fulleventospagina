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
