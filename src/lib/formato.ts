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

// Texto sin tildes, en min\u00FAscula y con espacios simples, para comparar y buscar ("Bogot\u00E1" = "bogota")
export const normalizar = (texto: string) =>
  texto
    .normalize('NFD')
    .replace(/[\u0300-\u036F]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

// "2026-10-09" \u2192 "Vie 9 oct" (formato de publicaciones, chat y repost; secci\u00F3n 3, "Fechas")
export const fechaCorta = (iso: string) => {
  const fecha = new Date(`${iso}T12:00:00-05:00`);
  const parte = (o: Intl.DateTimeFormatOptions) =>
    fecha.toLocaleDateString('es-CO', { ...o, timeZone: 'America/Bogota' }).replace('.', '');
  const dia = parte({ weekday: 'short' });
  return `${dia.charAt(0).toUpperCase()}${dia.slice(1)} ${parte({ day: 'numeric' })} ${parte({ month: 'short' })}`;
};

// Hora de un <input type="time"> ("20:00") en formato colombiano: "8:00 p. m." (secci\u00F3n 3, "Horas")
export const hora12 = (valor: string) => {
  const m = valor.match(/^(\d{1,2}):(\d{2})/);
  if (!m) return '';
  const h = Number(m[1]);
  return `${h % 12 || 12}:${m[2]} ${h < 12 ? 'a. m.' : 'p. m.'}`;
};

// Nombre accesible de Mensajes con los chats sin leer: "Mensajes, 3 chats sin leer" (encabezado y barra inferior)
export const sinLeerTexto = (n: number) => (n ? `${n} ${n === 1 ? 'chat sin leer' : 'chats sin leer'}` : '');
export const nombreMensajes = (n: number) => (n ? `Mensajes, ${sinLeerTexto(n)}` : 'Mensajes');
