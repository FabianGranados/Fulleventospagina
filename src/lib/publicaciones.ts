// Publicaciones sobre un evento (decisión 2.26): la versión formal de lo que se escribe en el muro, con tipo,
// título, texto, fotos y quién la ve. Se escriben en /crear-evento (camino "Una publicación sobre un evento").
//
// DEMOSTRACIÓN: sin backend, la publicación se guarda solo en este navegador (localStorage, clave
// `fe-publicaciones-demo`) y se muestra en el muro del evento y arriba del feed de Inicio. En producción la
// guarda el servidor, pasa por moderación (reportar y bloquear, H9 y H13) y respeta quién la puede ver.
// Todo acceso al almacenamiento va en try/catch: si falla, no hay publicaciones guardadas.
//
// La tarjeta es una sola para las tres pantallas: la plantilla de components/publicaciones/TarjetaPublicacion.astro,
// que se llena aquí con crearTarjeta(). Todo el texto entra con textContent (nunca como HTML).
import { eventos, type Evento } from '../data/eventos';
import { nombreCiudad } from '../data/ciudades';
import { parchePorId } from '../data/parches';
import { fechaCorta, placaFecha, rutaEvento } from './formato';

export const CLAVE_PUBLICACIONES = 'fe-publicaciones-demo';

// Entrada directa al camino "Una publicación sobre un evento" de /crear-evento
export const rutaPublicar = (evento?: string) =>
  `/crear-evento?modo=publicacion${evento ? `&evento=${encodeURIComponent(evento)}` : ''}`;

export const MAX_TITULO = 90;
export const MAX_TEXTO = 1000;
export const MAX_FOTOS = 4;

export type TipoPublicacion = 'invitacion' | 'resena' | 'info';
export type Audiencia = 'publica' | 'amigos' | 'parche';

export const TIPOS: Record<TipoPublicacion, string> = {
  invitacion: 'Invitación al plan',
  resena: 'Reseña o recomendación',
  info: 'Información útil',
};

export const AUDIENCIAS: Record<Audiencia, string> = {
  publica: 'Pública',
  amigos: 'Solo mis amigos',
  parche: 'Mi parche',
};

export interface PublicacionDemo {
  id: string;
  evento: string; // id de eventos.ts
  tipo: TipoPublicacion;
  titulo: string;
  texto: string;
  fotos: string[]; // data:image/jpeg reducidas en el navegador
  audiencia: Audiencia;
  parche?: string; // id de parches.ts cuando la audiencia es "parche"
  creada: string; // ISO
}

const esTexto = (v: unknown, max: number): v is string => typeof v === 'string' && v.length > 0 && v.length <= max;

// Lo guardado puede venir de otra versión del demo o estar dañado: se valida campo por campo
const valida = (p: unknown): p is PublicacionDemo => {
  if (!p || typeof p !== 'object') return false;
  const o = p as Record<string, unknown>;
  return (
    esTexto(o.id, 60) &&
    typeof o.evento === 'string' &&
    eventos.some((e) => e.id === o.evento) &&
    typeof o.tipo === 'string' &&
    o.tipo in TIPOS &&
    esTexto(o.titulo, MAX_TITULO) &&
    esTexto(o.texto, MAX_TEXTO) &&
    Array.isArray(o.fotos) &&
    o.fotos.length <= MAX_FOTOS &&
    o.fotos.every((f) => typeof f === 'string' && f.startsWith('data:image/')) &&
    typeof o.audiencia === 'string' &&
    o.audiencia in AUDIENCIAS &&
    esTexto(o.creada, 40)
  );
};

export const leerPublicaciones = (): PublicacionDemo[] => {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE_PUBLICACIONES) ?? '[]');
    return Array.isArray(datos) ? datos.filter(valida) : [];
  } catch {
    return [];
  }
};

const escribir = (lista: PublicacionDemo[]) => {
  try {
    localStorage.setItem(CLAVE_PUBLICACIONES, JSON.stringify(lista));
    return true;
  } catch {
    return false;
  }
};

// "ok"; "sin-fotos" si las fotos no cupieron en el navegador y se guardó solo el texto; "error" si no se pudo guardar
export const guardarPublicacion = (p: PublicacionDemo): 'ok' | 'sin-fotos' | 'error' => {
  const lista = leerPublicaciones();
  if (escribir([p, ...lista])) return 'ok';
  if (p.fotos.length && escribir([{ ...p, fotos: [] }, ...lista])) return 'sin-fotos';
  return 'error';
};

export const borrarPublicacion = (id: string) => escribir(leerPublicaciones().filter((p) => p.id !== id));

export const nuevoId = () => `pub-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

// Reduce la foto en el navegador (máx. 1.000 px, JPEG) para que quepa en el almacenamiento local.
// No se sube a ningún lado.
export const reducirFoto = (archivo: File, lado = 1000): Promise<string> =>
  new Promise((resolver, rechazar) => {
    const url = URL.createObjectURL(archivo);
    const img = new Image();
    img.onload = () => {
      const escala = Math.min(1, lado / Math.max(img.naturalWidth, img.naturalHeight));
      const lienzo = document.createElement('canvas');
      lienzo.width = Math.max(1, Math.round(img.naturalWidth * escala));
      lienzo.height = Math.max(1, Math.round(img.naturalHeight * escala));
      lienzo.getContext('2d')!.drawImage(img, 0, 0, lienzo.width, lienzo.height);
      URL.revokeObjectURL(url);
      resolver(lienzo.toDataURL('image/jpeg', 0.72));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      rechazar(new Error('No se pudo leer la imagen'));
    };
    img.src = url;
  });

// "Ahora", "Hace 5 min", "Hace 3 h" o "Vie 9 oct"
export const hace = (iso: string, ahora = Date.now()) => {
  const min = Math.floor((ahora - new Date(iso).getTime()) / 60000);
  if (!Number.isFinite(min) || min < 1) return 'Ahora';
  if (min < 60) return `Hace ${min} min`;
  if (min < 24 * 60) return `Hace ${Math.floor(min / 60)} h`;
  return fechaCorta(new Date(iso).toLocaleDateString('en-CA', { timeZone: 'America/Bogota' }));
};

export const textoAudiencia = (p: Pick<PublicacionDemo, 'audiencia' | 'parche'>) => {
  const parche = p.audiencia === 'parche' && p.parche ? parchePorId(p.parche) : undefined;
  return parche ? `Mi parche: ${parche.nombre}` : AUDIENCIAS[p.audiencia];
};

export const lineaEvento = (e: Evento) =>
  [fechaCorta(e.fecha), e.hora, e.lugar.split(' · ')[0], nombreCiudad(e.ciudad)].filter(Boolean).join(' · ');

interface OpcionesTarjeta {
  nivel?: 2 | 3;
  // En la vista previa no hay "Eliminar" ni enlace al evento (se perdería lo escrito)
  vistaPrevia?: boolean;
}

// Llena la plantilla compartida. Devuelve null si la página no tiene la plantilla.
export const crearTarjeta = (p: PublicacionDemo, { nivel = 2, vistaPrevia = false }: OpcionesTarjeta = {}) => {
  const plantilla = document.querySelector<HTMLTemplateElement>('template[data-plantilla-publicacion]');
  const e = eventos.find((ev) => ev.id === p.evento);
  if (!plantilla || !e) return null;
  const tarjeta = plantilla.content.firstElementChild!.cloneNode(true) as HTMLElement;
  const $ = <T extends HTMLElement>(sel: string) => tarjeta.querySelector<T>(sel)!;

  tarjeta.dataset.id = p.id;
  $('[data-tipo]').textContent = TIPOS[p.tipo];
  $('[data-audiencia]').textContent = textoAudiencia(p);
  tarjeta.querySelectorAll<HTMLElement>('[data-icono-audiencia]').forEach((i) => (i.hidden = i.dataset.iconoAudiencia !== p.audiencia));

  // Mismo encabezado con el nivel que pida la página (h2 en Inicio, h3 dentro de una sección del evento)
  let titulo = $('[data-titulo]');
  if (nivel === 3) {
    const h3 = document.createElement('h3');
    [...titulo.attributes].forEach((a) => h3.setAttribute(a.name, a.value));
    titulo.replaceWith(h3);
    titulo = h3;
  }
  titulo.id = `titulo-${p.id}${vistaPrevia ? '-previa' : ''}`;
  titulo.textContent = p.titulo;
  tarjeta.setAttribute('aria-labelledby', titulo.id);

  const meta = $('[data-meta]');
  const tiempo = document.createElement('time');
  tiempo.dateTime = p.creada;
  tiempo.textContent = vistaPrevia ? 'Ahora' : hace(p.creada);
  meta.replaceChildren(tiempo, ` · ${nombreCiudad(e.ciudad)}`);

  $('[data-texto]').textContent = p.texto;

  const fotos = $('[data-fotos]');
  fotos.dataset.cantidad = String(p.fotos.length);
  fotos.hidden = p.fotos.length === 0;
  fotos.replaceChildren(
    ...p.fotos.map((src, i) => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = `Foto ${i + 1} de ${p.fotos.length} de la publicación`;
      img.loading = 'lazy';
      img.decoding = 'async';
      return img;
    }),
  );

  const { dia, mes } = placaFecha(e.fecha);
  const enlace = $<HTMLAnchorElement>('[data-evento-enlace]');
  if (vistaPrevia) enlace.removeAttribute('href');
  else enlace.href = rutaEvento(e.ciudad, e.titulo);
  $('[data-miniatura]').style.cssText = `--bg1: ${e.bg1}; --bg2: ${e.bg2}`;
  $('[data-dia]').textContent = dia;
  $('[data-mes]').textContent = mes;
  $('[data-categoria]').textContent = e.categoria;
  $('[data-evento-titulo]').textContent = e.titulo;
  $('[data-donde]').textContent = lineaEvento(e);

  const pie = $('[data-pie]');
  if (vistaPrevia) pie.remove();
  else $('[data-eliminar-sr]').textContent = ` la publicación «${p.titulo}»`;

  return tarjeta;
};

// Pinta las publicaciones guardadas en cada contenedor [data-publicaciones-demo] de la página:
// data-evento filtra por evento; data-nivel fija el nivel del título; el bloque [data-bloque-publicaciones]
// que lo contiene se oculta mientras no haya ninguna si tiene data-ocultar-vacio.
export const pintarListas = () => {
  const lista = leerPublicaciones();
  document.querySelectorAll<HTMLElement>('[data-publicaciones-demo]').forEach((caja) => {
    const propias = caja.dataset.evento ? lista.filter((p) => p.evento === caja.dataset.evento) : lista;
    const nivel = caja.dataset.nivel === '3' ? 3 : 2;
    caja.replaceChildren(...propias.map((p) => crearTarjeta(p, { nivel })).filter((t): t is HTMLElement => !!t));
    const bloque = caja.closest<HTMLElement>('[data-bloque-publicaciones]');
    if (bloque?.hasAttribute('data-ocultar-vacio')) bloque.hidden = propias.length === 0;
  });
};
