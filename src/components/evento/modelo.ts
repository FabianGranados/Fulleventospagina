// Arma los datos que necesita la página de un evento a partir de src/data/eventos.ts
// y, si existe, del detalle de src/data/evento.ts (hoy solo e1).
import { eventos, type Evento } from '../../data/eventos';
import { nombreCiudad } from '../../data/ciudades';
import { detalles, type DetalleEvento, type Localidad } from '../../data/evento';
import { cifra, pesos, rutaEvento } from '../../lib/formato';

const fechaDe = (iso: string) => new Date(`${iso}T12:00:00-05:00`);
const parte = (iso: string, opciones: Intl.DateTimeFormatOptions) =>
  fechaDe(iso).toLocaleDateString('es-CO', { ...opciones, timeZone: 'America/Bogota' }).replace('.', '');
const mayuscula = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

// Conectores que no deben cerrar la primera franja del titular
const CONECTORES = new Set(['y', 'de', 'del', 'en', 'el', 'la', 'a', 'al', 'vs', 'vs.', 'con', 'por']);

// Parte el título en dos franjas de largo parecido (como "Noche de salsa" / "y boleros en vivo")
export const lineasTitulo = (titulo: string): string[] => {
  const palabras = titulo.split(' ');
  if (palabras.length < 3) return [titulo];
  let mejor = 1;
  let diferencia = Infinity;
  for (let i = 1; i < palabras.length; i++) {
    if (CONECTORES.has(palabras[i - 1].toLowerCase())) continue;
    const d = Math.abs(palabras.slice(0, i).join(' ').length - palabras.slice(i).join(' ').length);
    if (d < diferencia) {
      diferencia = d;
      mejor = i;
    }
  }
  return [palabras.slice(0, mejor).join(' '), palabras.slice(mejor).join(' ')];
};

export interface ModeloEvento {
  evento: Evento;
  detalle?: DetalleEvento;
  ciudad: string;
  url: string;
  gratis: boolean;
  dia: string;
  mes: string;
  fechaLarga: string; // "Viernes 9 de octubre"
  fechaCorta: string; // "Vie 9 oct"
  anio: string;
  lugarNombre: string;
  lugarDetalle: string; // "Zona T, Bogotá"
  lugarCompleto: string; // "Galería Café Libro · Zona T, Bogotá"
  precioDesde: string;
  localidades: Localidad[];
  organizador: string;
  similares: Evento[];
  textoSimilares: string;
}

export const modeloEvento = (evento: Evento): ModeloEvento => {
  const detalle = detalles[evento.id];
  const ciudad = nombreCiudad(evento.ciudad);
  const [nombreLugar, zonaLugar] = evento.lugar.split(' · ');
  const lugarDetalle = zonaLugar ? `${zonaLugar}, ${ciudad}` : ciudad;

  // Sin plano de localidades para el evento: una sola boleta al precio publicado (pendiente de datos reales)
  const localidades: Localidad[] =
    detalle?.localidades ??
    (evento.precio
      ? [
          {
            id: 'general',
            nombre: 'Boleta',
            completo: 'Boleta',
            corto: 'Boleta',
            precio: evento.precio,
            unidad: 'por persona',
            descripcion: '',
            disponibilidad: '',
            caliente: false,
            maximo: 8,
            puestos: 1,
            color: '#B9E07A',
            tinte: '#E8F4D6',
          },
        ]
      : []);

  const similares = detalle
    ? detalle.similares.map((id) => eventos.find((e) => e.id === id)!).filter(Boolean)
    : eventos.filter((e) => e.categoria === evento.categoria && e.ciudad !== evento.ciudad).slice(0, 3);

  return {
    evento,
    detalle,
    ciudad,
    url: rutaEvento(evento.ciudad, evento.titulo),
    gratis: evento.precio === 0,
    dia: parte(evento.fecha, { day: 'numeric' }),
    mes: parte(evento.fecha, { month: 'short' }),
    fechaLarga: mayuscula(parte(evento.fecha, { weekday: 'long', day: 'numeric', month: 'long' }).replace(',', '')),
    fechaCorta: mayuscula(
      `${parte(evento.fecha, { weekday: 'short' })} ${parte(evento.fecha, { day: 'numeric' })} ${parte(evento.fecha, { month: 'short' })}`,
    ),
    anio: parte(evento.fecha, { year: 'numeric' }),
    lugarNombre: detalle?.lugarNombre ?? nombreLugar,
    lugarDetalle,
    lugarCompleto: `${evento.lugar}, ${ciudad}`,
    precioDesde: evento.precio ? `Desde ${pesos(evento.precio)}` : 'Gratis',
    localidades,
    organizador: detalle?.organizador.nombre ?? '[ORGANIZADOR]',
    similares,
    textoSimilares: detalle?.ciudadesSimilares ?? `${evento.categoria} este finde por fuera de ${ciudad}`,
  };
};

export const textoVan = (n: number) => `${cifra(n)} van`;
