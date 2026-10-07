// Estado del chat y datos derivados (6.2.7, "Estado inicial"). Es el mismo en el servidor (primer pintado)
// y en el navegador. Sin backend: lo que Camila envía vive en memoria y se pierde al recargar (P6, H13).
import {
  conversaciones,
  ciudadDe,
  eventoChat,
  organizador,
  HOY,
  YO,
  type Conversacion,
  type Mensaje,
  type Reaccion,
} from '../../data/mensajes';
import { persona } from '../../data/personas';
import { eventos } from '../../data/eventos';
import { ciudades } from '../../data/ciudades';
import { pesos, placaFecha, rutaEvento } from '../../lib/formato';

export type Filtro = 'todos' | 'parches' | 'personas' | 'noleidos';

export interface Estado {
  abierta: string;
  // Qué columna se ve por debajo de 900 px
  panel: 'lista' | 'chat';
  filtro: Filtro;
  q: string;
  leidas: Record<string, boolean>;
  orden: string[];
  extra: Record<string, Conversacion>;
  enviados: Record<string, Mensaje[]>;
  borradores: Record<string, string>;
  votos: Record<string, string>;
  reacciones: Record<string, boolean>;
  reposteados: Record<string, boolean>;
  silenciadas: Record<string, boolean>;
  dividido: Record<string, boolean>;
  salidas: Record<string, boolean>;
  confirmandoSalida: boolean;
  // Panel de información: columna desde 1180 px (abierta por defecto) y ventana por debajo (cerrada)
  infoAncho: boolean;
  infoAngosto: boolean;
  bandeja: boolean;
  seq: number;
}

export const estadoInicial = (abierta: string, panel: 'lista' | 'chat', leida: boolean): Estado => ({
  abierta,
  panel,
  filtro: 'todos',
  q: '',
  // /mensajes abre "Salseros de jueves" sin marcarla leída (detalle fino 2); abrir una conversación por su
  // dirección equivale a tocarla en la lista, así que sí la marca
  leidas: leida ? { [abierta]: true } : {},
  orden: conversaciones.map((c) => c.id),
  extra: {},
  enviados: {},
  borradores: {},
  votos: {},
  reacciones: {},
  reposteados: {},
  silenciadas: { rockeros: true },
  dividido: {},
  salidas: {},
  confirmandoSalida: false,
  infoAncho: true,
  infoAngosto: false,
  bandeja: false,
  seq: 1,
});

// ---------- Personas ----------

// Nombre de pila para vistas previas, avisos y el compositor ("Sofía: …", "Escríbele a Laura").
// Sale del único nombre de cada persona en personas.ts (H62): Juan Pablo es un nombre compuesto.
const COMPUESTOS: Record<string, string> = { juanpablo: 'Juan Pablo' };

export const nombreDe = (id: string) => (id === organizador.id ? organizador.nombre : (persona(id)?.nombre ?? ''));
export const cortoDe = (id: string) =>
  id === organizador.id ? organizador.nombre : (COMPUESTOS[id] ?? nombreDe(id).split(' ')[0]);
export const inicialesDe = (id: string) => (id === organizador.id ? organizador.iniciales : (persona(id)?.iniciales ?? ''));
export const colorDe = (id: string) => persona(id)?.color ?? 'c6';
export const perfilDe = (id: string) => (id === YO ? '/yo' : `/perfil/${id}`);

// ---------- Eventos ----------

export interface EventoChat {
  id: string;
  titulo: string;
  categoria: string;
  etiqueta: string;
  corto: string;
  hora: string;
  dia: string;
  d: string;
  mes: string;
  lugar: string;
  ciudad: string;
  precio: number;
  bg1: string;
  bg2: string;
  ruta: string;
  faltan: number;
}

const DIA = 86_400_000;
const mediodia = (iso: string) => new Date(`${iso}T12:00:00-05:00`);
const nombreCiudad = (id: string) => ciudades.find((c) => c.id === id)?.nombre ?? id;

export const eventoDe = (id: string): EventoChat => {
  const e = eventos.find((x) => x.id === id)!;
  const { dia: d, mes } = placaFecha(e.fecha);
  const semana = mediodia(e.fecha)
    .toLocaleDateString('es-CO', { weekday: 'short', timeZone: 'America/Bogota' })
    .replace('.', '');
  return {
    id,
    titulo: e.titulo,
    categoria: e.categoria,
    etiqueta: eventoChat[id]?.etiqueta ?? e.categoria,
    corto: eventoChat[id]?.corto ?? e.titulo,
    // Una sola hora por evento (eventos.ts, H37)
    hora: e.hora ?? '',
    dia: semana.charAt(0).toUpperCase() + semana.slice(1),
    d,
    mes,
    // El lugar del dato trae la zona ("Galería Café Libro · Zona T"); el chat no la muestra (4.9)
    lugar: e.lugar.split(' · ')[0],
    ciudad: nombreCiudad(e.ciudad),
    precio: e.precio,
    bg1: e.bg1,
    bg2: e.bg2,
    ruta: rutaEvento(e.ciudad, e.titulo),
    faltan: Math.round((mediodia(e.fecha).getTime() - mediodia(HOY).getTime()) / DIA),
  };
};

// "Faltan N días" con singular y el mismo día (detalle fino 20)
export const textoFaltan = (n: number) => (n <= 0 ? 'Hoy' : n === 1 ? 'Mañana' : `Faltan ${n} días`);
// Formato único del precio con el cargo aparte (H21, decisión 2.14)
export const textoPrecio = (n: number) => (n === 0 ? 'Gratis' : `Desde ${pesos(n)}`);
export const fechaCorta = (ev: EventoChat) => `${ev.dia} ${ev.d} ${ev.mes}`;

// ---------- Conversaciones ----------

export const todas = (e: Estado): Record<string, Conversacion> => ({
  ...Object.fromEntries(conversaciones.map((c) => [c.id, c])),
  ...e.extra,
});

export const visibles = (e: Estado) => {
  const mapa = todas(e);
  return e.orden.filter((id) => mapa[id] && !e.salidas[id]);
};

export const abiertaId = (e: Estado) => {
  const mapa = todas(e);
  return mapa[e.abierta] && !e.salidas[e.abierta] ? e.abierta : visibles(e)[0];
};

export const nombreConv = (c: Conversacion) => (c.tipo === 'parche' ? c.nombre! : nombreDe(c.con!));

export const avatarConv = (c: Conversacion) => {
  if (c.tipo === 'parche') return { iniciales: c.iniciales!, clase: `cuadrado display ${c.color}` };
  if (c.tipo === 'organizador') return { iniciales: organizador.iniciales, clase: 'cuadrado display organizador' };
  return { iniciales: inicialesDe(c.con!), clase: `circulo ${colorDe(c.con!)}` };
};

export const mensajesDe = (e: Estado, c: Conversacion) => c.mensajes.concat(e.enviados[c.id] ?? []);
export const hayEnviados = (e: Estado, c: Conversacion) => (e.enviados[c.id]?.length ?? 0) > 0;
export const noLeidosDe = (e: Estado, c: Conversacion) => (c.noLeidos && !e.leidas[c.id] && !hayEnviados(e, c) ? c.noLeidos : 0);
export const conversacionesSinLeer = (e: Estado) => {
  const mapa = todas(e);
  return visibles(e).filter((id) => noLeidosDe(e, mapa[id]) > 0).length;
};

export const textoResumen = (n: number) => (n === 0 ? 'Al día' : n === 1 ? '1 chat sin leer' : `${n} chats sin leer`);

export const vistaPrevia = (e: Estado, c: Conversacion) => {
  const lista = mensajesDe(e, c).filter((m) => m.tipo !== 'fecha');
  const m = lista[lista.length - 1];
  if (!m) return 'Chat nuevo · escribe el primer mensaje';
  if (m.tipo === 'sistema') return m.texto;
  const pre = m.de === YO ? 'Tú: ' : c.tipo === 'parche' ? `${cortoDe(m.de)}: ` : '';
  if (m.tipo === 'evento') return `${pre}compartió «${eventoDe(m.evento).titulo}»`;
  if (m.tipo === 'encuesta') return `${pre}Encuesta: ${m.pregunta}`;
  if (m.tipo === 'foto') return `${pre}envió una foto`;
  return pre + m.texto;
};

const normalizar = (x: string) =>
  x
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

// Busca en el nombre, en el evento del parche y en los eventos compartidos en la conversación (H41)
const textoBuscable = (e: Estado, c: Conversacion) => {
  const titulos = new Set<string>();
  if (c.evento) titulos.add(eventoDe(c.evento).titulo);
  for (const m of mensajesDe(e, c)) if (m.tipo === 'evento') titulos.add(eventoDe(m.evento).titulo);
  return normalizar([nombreConv(c), ...titulos].join(' '));
};

export const filtradas = (e: Estado) => {
  const mapa = todas(e);
  const q = normalizar(e.q.trim());
  return visibles(e).filter((id) => {
    const c = mapa[id];
    if (e.filtro === 'parches' && c.tipo !== 'parche') return false;
    if (e.filtro === 'personas' && c.tipo === 'parche') return false;
    if (e.filtro === 'noleidos' && !noLeidosDe(e, c)) return false;
    return !q || textoBuscable(e, c).includes(q);
  });
};

export const textoListaVacia = (e: Estado) =>
  e.filtro === 'noleidos' && !e.q.trim() ? 'Estás al día: no tienes mensajes sin leer.' : 'No encontramos chats con ese filtro.';

// ---------- Datos de la conversación abierta ----------

export const datosParche = (c: Conversacion) => {
  const miembros = c.miembros ?? [];
  const conBoleta = miembros.filter((k) => c.conBoleta?.includes(k)).length;
  return { total: miembros.length, conBoleta, yoTengo: !!c.conBoleta?.includes(YO) };
};

export const subtitulo = (c: Conversacion) => {
  if (c.tipo === 'parche') {
    const { total, conBoleta } = datosParche(c);
    const libres = c.cupos ? c.cupos - total : 0;
    return (
      `${total} miembros` +
      (c.cupos ? ` · ${libres} ${libres === 1 ? 'cupo libre' : 'cupos libres'}` : '') +
      (c.evento ? ` · ${conBoleta} con boleta` : '')
    );
  }
  if (c.tipo === 'organizador') return organizador.estado;
  return c.estado || ciudadDe[c.con!] || '';
};

export const subtituloInfo = (c: Conversacion) => {
  if (c.tipo === 'parche') return `Parche · ${datosParche(c).total} miembros`;
  if (c.tipo === 'organizador') return organizador.estado;
  return `${ciudadDe[c.con!]} · ${c.estado || 'Amigo en Fulleventos'}`;
};

export const placeholderDe = (c: Conversacion) =>
  c.tipo === 'parche' ? 'Escríbele al parche' : `Escríbele a ${cortoDe(c.con!)}`;

// "Planes en común": eventos de los parches (que siguen en la lista) donde están Camila y esa persona
export const planesEnComun = (e: Estado, c: Conversacion) => {
  if (c.tipo === 'organizador') return organizador.eventos.map((id) => ({ ev: eventoDe(id), via: '' }));
  if (c.tipo !== 'persona') return [];
  const mapa = todas(e);
  const vistos = new Set<string>();
  const salida: { ev: EventoChat; via: string }[] = [];
  for (const id of visibles(e)) {
    const g = mapa[id];
    if (g.tipo === 'parche' && g.evento && g.miembros?.includes(c.con!) && g.miembros.includes(YO) && !vistos.has(g.evento)) {
      vistos.add(g.evento);
      salida.push({ ev: eventoDe(g.evento), via: g.nombre! });
    }
  }
  return salida;
};

// ---------- Historial ----------

export type ElementoFlujo = Mensaje | { id: string; tipo: 'nuevos'; texto: string };

const DE_FILA = new Set(['texto', 'evento', 'encuesta', 'foto']);
export const esFila = (m: ElementoFlujo): m is Extract<Mensaje, { de: string }> => DE_FILA.has(m.tipo);

// Mensajes en orden con el separador "N mensajes nuevos" antes de los últimos no leídos (8.2):
// se muestra mientras Camila no haya enviado nada en la conversación
export const flujo = (e: Estado, c: Conversacion): ElementoFlujo[] => {
  const lista: ElementoFlujo[] = mensajesDe(e, c).slice();
  if (c.nuevos && !hayEnviados(e, c)) {
    lista.splice(c.mensajes.length - c.nuevos, 0, {
      id: `nuevos-${c.id}`,
      tipo: 'nuevos',
      texto: c.nuevos === 1 ? '1 mensaje nuevo' : `${c.nuevos} mensajes nuevos`,
    });
  }
  return lista;
};

// Agrupación por autor ("racha", 8.4): sigue si el anterior también es de fila y del mismo autor
export const sigueRacha = (lista: ElementoFlujo[], i: number) => {
  const m = lista[i];
  const previo = lista[i - 1];
  return !!previo && esFila(m) && esFila(previo) && previo.de === m.de;
};
export const continuaRacha = (lista: ElementoFlujo[], i: number) => !!lista[i + 1] && sigueRacha(lista, i + 1);

export const ETIQUETA_REACCION: Record<Reaccion, string> = { encanta: 'Me encanta', prendido: 'Prendido', gusta: 'Me gusta' };

export const datosEncuesta = (e: Estado, m: Extract<Mensaje, { tipo: 'encuesta' }>) => {
  const elegida = e.votos[m.id];
  const conteos = m.opciones.map((o) => o[2] + (elegida === o[0] ? 1 : 0));
  const suma = conteos.reduce((a, b) => a + b, 0);
  const votos = (n: number) => `${n} ${n === 1 ? 'voto' : 'votos'}`;
  const opcion = m.opciones.find((o) => o[0] === elegida);
  return {
    opciones: m.opciones.map((o, k) => ({
      id: o[0],
      texto: o[1],
      n: conteos[k],
      votos: votos(conteos[k]),
      pct: suma ? Math.round((conteos[k] / suma) * 100) : 0,
      elegida: elegida === o[0],
    })),
    // El pie maneja el singular (detalle fino 20)
    pie: opcion
      ? `Votaste por «${opcion[1]}» · ${votos(suma)} · Toca otra opción para cambiar`
      : `${suma ? votos(suma) + ' · ' : ''}Toca una opción para votar`,
  };
};

export const datosReaccion = (e: Estado, idMensaje: string, tipo: Reaccion, base: number) => {
  const marcada = !!e.reacciones[`${idMensaje}:${tipo}`];
  const n = base + (marcada ? 1 : 0);
  return { marcada, n, etiqueta: `${ETIQUETA_REACCION[tipo]}, ${n}` };
};

// Iniciales de un parche nuevo: sin palabras vacías (6.2.7, "Lo que hace Crear parche")
const VACIAS = new Set(['de', 'del', 'la', 'el', 'los', 'las', 'y', 'en']);
export const inicialesParche = (nombre: string) => {
  const palabras = nombre.split(/\s+/).filter((w) => w && !VACIAS.has(normalizar(w)));
  const w0 = palabras[0] ?? nombre;
  return ((w0[0] ?? 'P') + (palabras[1] ? palabras[1][0] : (w0[1] ?? ''))).toUpperCase();
};

// Paleta de parches nuevos (#F3B27E, #EE93BC, #8FD3D0, #B9E07A, #F6DC6A, #A3A8F0) en clases de avatar
export const PALETA_PARCHES = ['c1', 'c3', 'c6', 'c4', 'c5', 'c2'];

export const unirNombres = (lista: string[]) =>
  lista.length <= 1 ? lista.join('') : `${lista.slice(0, -1).join(', ')} y ${lista[lista.length - 1]}`;

// Nombres de parche que imitan una cuenta oficial (H48)
export const nombreProhibido = (nombre: string) => /oficial|verificad|fulleventos/.test(normalizar(nombre));
