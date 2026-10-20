// Etapa B2 (docs/etapa-b-eventos-d1.md): el único lugar donde el sitio obtiene los eventos. Con la base D1 (binding
// DB, hoy solo en local con EVENTOS_D1=local) lee los eventos PUBLICADOS; sin ella, los de ejemplo de
// src/data/eventos.ts, como siempre. Nunca muestra eventos pendientes, aprobados sin publicar, rechazados ni retirados.
//
// Los 19 eventos de ejemplo viven en D1 con demo = 1 y su mismo id (e1…e19): de eventos.ts se toman solo los datos
// que D1 todavía no guarda (gente que va, parches, colores, quién vende y puertas/show). Los eventos nuevos traen
// sus datos tal como se aprobaron, sin inventar gente, reposts ni precios.
import { eventos as eventosDemo, type Evento } from '../data/eventos';
import { ciudades } from '../data/ciudades';
import { categoriaOficial } from '../data/categorias-oficiales';
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
  lugar: string | null;
  organizador: string | null;
  tipo_precio: 'gratis' | 'pago' | 'mixto' | 'desconocido';
  precio_desde: number | null;
  url_oficial: string | null;
  url_venta: string | null;
  demo: number;
  bg1: string | null;
  bg2: string | null;
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

// El binding solo existe dentro del Worker con wrangler.local.jsonc. En la compilación normal no hay base.
const baseD1 = async (): Promise<D1Database | undefined> => {
  try {
    const { env } = await import('cloudflare:workers');
    return (env as { DB?: D1Database }).DB;
  } catch {
    return undefined;
  }
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
    fecha: f.fecha,
    lugar: f.lugar ?? f.municipio_nombre ?? '',
    precio: f.precio_desde ?? 0,
    tipoPrecio: f.tipo_precio,
    vende: demo?.vende ?? (gratis ? 'Entrada libre' : (f.organizador ?? 'el sitio oficial')),
    urlVenta: f.url_venta ?? f.url_oficial ?? demo?.urlVenta,
    resumen: f.resumen ?? demo?.resumen,
    hora: demo?.hora ?? (f.hora ? hora12(f.hora) : undefined),
    ...(f.bg1 && f.bg2 ? { bg1: f.bg1, bg2: f.bg2 } : {}),
    deD1: true,
  };
};

let cache: Promise<Evento[]> | undefined;

// Eventos publicados, ordenados por fecha. En una misma solicitud se consulta una sola vez.
export const obtenerEventos = (): Promise<Evento[]> =>
  (cache ??= (async () => {
    const db = await baseD1();
    if (!db) return eventosDemo;
    const { results } = await db
      .prepare(
        `SELECT e.id, e.titulo, e.categoria, e.resumen, e.fecha, e.hora, e.ciudad_sitio, m.nombre AS municipio_nombre,
                e.lugar, e.organizador, e.tipo_precio, e.precio_desde, e.url_oficial, e.url_venta, e.demo, e.bg1, e.bg2
           FROM eventos e LEFT JOIN municipios m ON m.codigo = e.municipio_codigo
          WHERE e.estado = 'publicado'
          ORDER BY e.fecha, e.hora, e.titulo`,
      )
      .all<FilaEvento>();
    return results.map(aEvento);
  })()).finally(() => {
    // Sin caché entre solicitudes: cada visita lee lo publicado en ese momento
    cache = undefined;
  });

// ¿Los eventos salen de D1? (para mostrarlo en la demostración local)
export const leeDeD1 = async () => Boolean(await baseD1());
