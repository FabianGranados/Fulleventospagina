// Etapa B (docs/etapa-b-eventos-d1.md): el único lugar donde el sitio obtiene los eventos. Con la base D1 (binding
// DB: en local con EVENTOS_D1=local y en el Worker de pruebas con EVENTOS_D1=pruebas) lee los eventos PUBLICADOS;
// sin ella, los de ejemplo de src/data/eventos.ts, como siempre. Nunca muestra eventos pendientes, aprobados sin
// publicar, rechazados ni retirados.
//
// Los 19 eventos de ejemplo viven en D1 con demo = 1 y su mismo id (e1…e19): de eventos.ts se toman solo los datos
// que D1 todavía no guarda (gente que va, parches, colores, quién vende y puertas/show). Los eventos nuevos traen
// sus datos tal como se aprobaron, sin inventar gente, reposts ni precios.
//
// B3: con cada evento viene su foto principal PUBLICADA de imagenes_evento (si la hay), para que el servidor la
// ponga en el HTML y en og:image. Sin foto queda el degradado bg1/bg2.
import { eventos as eventosDemo, type Evento, type FotoEvento } from '../data/eventos';
import { ciudades } from '../data/ciudades';
import { categoriaOficial } from '../data/categorias-oficiales';
import { IMAGENES_URL } from '../config';
import { hora12, slug } from './formato';

interface FilaEvento {
  id: string;
  titulo: string;
  categoria: string | null;
  resumen: string | null;
  fecha: string;
  hora: string | null;
  ciudad_sitio: string | null;
  municipio_nombre: string | null;
  departamento_codigo: string | null;
  lugar: string | null;
  organizador: string | null;
  tipo_precio: 'gratis' | 'pago' | 'mixto' | 'desconocido';
  precio_desde: number | null;
  url_oficial: string | null;
  url_venta: string | null;
  demo: number;
  bg1: string | null;
  bg2: string | null;
  foto_version: string | null;
  foto_variantes: string | null;
  foto_ancho: number | null;
  foto_alto: number | null;
  foto_alt: string | null;
  foto_credito: string | null;
}

// Colores de respaldo (sin foto) para los eventos nuevos: por categoría, de la paleta de los de ejemplo
const FONDOS: Record<string, [string, string]> = {
  'rumba-y-vida-nocturna': ['#EE93BC', '#3A1530'],
  'conciertos-y-festivales': ['#A3A8F0', '#1E2550'],
  'arte-y-cultura': ['#F3B27E', '#3A1F14'],
  deportes: ['#8FD3D0', '#12343A'],
  gastronomia: ['#F6DC6A', '#3A2A10'],
};
const FONDO_GENERAL: [string, string] = ['#B9E07A', '#1F2A14'];

// Solo rutas que el importador puede haber escrito (igual que lib/fotos-eventos.ts): una fila alterada no puede
// meter URL de otros sitios en el HTML
const RUTA_VALIDA = /^eventos\/[a-z0-9_-]{1,64}\/[a-f0-9]{16}-\d{3,4}\.webp$/;

// El binding solo existe dentro del Worker (wrangler.local.jsonc o wrangler.pruebas.jsonc). En la compilación
// normal no hay base.
const baseD1 = async (): Promise<D1Database | undefined> => {
  try {
    const { env } = await import('cloudflare:workers');
    return (env as { DB?: D1Database }).DB;
  } catch {
    return undefined;
  }
};

// Foto publicada → srcset absoluto. Sin dominio público de R2 (IMAGENES_URL vacía) no hay foto: queda el degradado.
const fotoDe = (f: FilaEvento): FotoEvento | undefined => {
  if (!IMAGENES_URL || !f.foto_variantes || !f.foto_version) return undefined;
  let variantes: Record<string, string>;
  try {
    variantes = JSON.parse(f.foto_variantes);
  } catch {
    return undefined;
  }
  const lista = Object.entries(variantes)
    .filter(([ancho, ruta]) => /^\d{3,4}$/.test(ancho) && typeof ruta === 'string' && RUTA_VALIDA.test(ruta))
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([ancho, ruta]) => ({ ancho: Number(ancho), url: `${IMAGENES_URL}/${ruta}` }));
  if (!lista.length) return undefined;
  return {
    srcset: lista.map((v) => `${v.url} ${v.ancho}w`).join(', '),
    src: lista.at(-1)!.url,
    ancho: f.foto_ancho ?? undefined,
    alto: f.foto_alto ?? undefined,
    alt: f.foto_alt ?? '',
    credito: f.foto_credito ?? undefined,
  };
};

const aEvento = (f: FilaEvento): Evento => {
  const demo = f.demo ? eventosDemo.find((e) => e.id === f.id) : undefined;
  const oficial = categoriaOficial(f.categoria);
  const enSitio = ciudades.find((c) => c.id === f.ciudad_sitio);
  const [bg1, bg2] = FONDOS[f.categoria ?? ''] ?? FONDO_GENERAL;
  const gratis = f.tipo_precio === 'gratis';
  return {
    // Lo de demostración que D1 no guarda todavía (B2): se completa con eventos.ts
    ...(demo ?? { van: 0, parches: 0, bg1, bg2 }),
    id: f.id,
    titulo: f.titulo,
    categoria: oficial?.nombre ?? demo?.categoria ?? 'Plan',
    etiquetas: [...(oficial?.sitio ? [oficial.sitio] : []), ...(gratis ? ['gratis'] : [])],
    categoriaOficial: f.categoria ?? undefined,
    ciudad: enSitio?.id ?? slug(f.municipio_nombre ?? 'colombia'),
    ciudadNombre: enSitio ? undefined : (f.municipio_nombre ?? undefined),
    departamento: f.departamento_codigo ?? undefined,
    fecha: f.fecha,
    lugar: f.lugar ?? f.municipio_nombre ?? '',
    precio: f.precio_desde ?? 0,
    tipoPrecio: f.tipo_precio,
    vende: demo?.vende ?? (gratis ? 'Entrada libre' : (f.organizador ?? 'el sitio oficial')),
    urlVenta: f.url_venta ?? f.url_oficial ?? demo?.urlVenta,
    resumen: f.resumen ?? demo?.resumen,
    hora: demo?.hora ?? (f.hora ? hora12(f.hora) : undefined),
    ...(f.bg1 && f.bg2 ? { bg1: f.bg1, bg2: f.bg2 } : {}),
    foto: fotoDe(f),
    deD1: true,
  };
};

let cache: Promise<Evento[]> | undefined;

// Eventos publicados, ordenados por fecha. Llamadas simultáneas comparten una sola consulta; no hay caché entre
// solicitudes (cada visita lee lo publicado en ese momento). En las páginas usa eventosPublicados(Astro.locals).
export const obtenerEventos = (): Promise<Evento[]> =>
  (cache ??= (async () => {
    const db = await baseD1();
    if (!db) return eventosDemo;
    const { results } = await db
      .prepare(
        `SELECT e.id, e.titulo, e.categoria, e.resumen, e.fecha, e.hora, e.ciudad_sitio, m.nombre AS municipio_nombre,
                e.departamento_codigo, e.lugar, e.organizador, e.tipo_precio, e.precio_desde, e.url_oficial,
                e.url_venta, e.demo, e.bg1, e.bg2,
                i.version AS foto_version, i.variantes AS foto_variantes, i.ancho AS foto_ancho, i.alto AS foto_alto,
                i.texto_alternativo AS foto_alt, i.credito AS foto_credito
           FROM eventos e
           LEFT JOIN municipios m ON m.codigo = e.municipio_codigo
           LEFT JOIN imagenes_evento i ON i.evento_id = e.id AND i.tipo = 'principal' AND i.estado = 'publicada'
          WHERE e.estado = 'publicado'
          ORDER BY e.fecha, e.hora, e.titulo`,
      )
      .all<FilaEvento>();
    return results.map(aEvento);
  })()).finally(() => {
    cache = undefined;
  });

// Lo que se guarda en Astro.locals durante una solicitud
interface Locales {
  eventosPublicados?: Promise<Evento[]>;
  listaPublicados?: Evento[];
  fotosEventos?: Map<string, FotoEvento>;
}

// Eventos publicados de ESTA solicitud: la página y sus componentes consultan D1 una sola vez. También deja a mano
// las fotos para <FotoEvento> (fotoDeLaSolicitud), que así no necesita que cada tarjeta le pase la foto.
export const eventosPublicados = (locals: object): Promise<Evento[]> => {
  const l = locals as Locales;
  l.eventosPublicados ??= obtenerEventos().then((lista) => {
    l.listaPublicados = lista;
    l.fotosEventos = new Map(lista.filter((e) => e.foto).map((e) => [e.id, e.foto!]));
    return lista;
  });
  return l.eventosPublicados;
};

// La misma lista, ya resuelta, para componentes que no pueden esperar (la página la pidió antes). Sin ella
// (página que no la pidió), undefined: el componente usa src/data/eventos.ts como siempre.
export const publicadosDeLaSolicitud = (locals: object): Evento[] | undefined => (locals as Locales).listaPublicados;

export const fotoDeLaSolicitud = (locals: object, id: string): FotoEvento | undefined =>
  (locals as Locales).fotosEventos?.get(id);

// ¿Los eventos salen de D1? (para mostrarlo en la demostración local)
export const leeDeD1 = async () => Boolean(await baseD1());
