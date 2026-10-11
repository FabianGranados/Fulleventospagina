// Fotos reales de los eventos desde Cloudflare R2 (docs/imagenes-r2.md).
// El HTML sale con el degradado de cada evento como marcador (<FotoEvento>). En el navegador se pide UNA vez el
// índice público `indice/eventos-v1.json` (lo regenera el importador) y, si el evento tiene foto publicada, se
// agrega un <img> con srcset encima del degradado. Si no hay índice, foto o conexión, queda el degradado: nunca
// se rompe la tarjeta. Así una foto nueva aparece sin volver a desplegar el sitio.
import { IMAGENES_URL } from '../config';

export interface FotoIndice {
  // Versión del archivo (16 hex del sha256): cambia con cada foto nueva, así las URL pueden ser inmutables
  v: string;
  // Ancho de cada variante → ruta del objeto en R2
  variantes: Record<string, string>;
  ancho: number;
  alto: number;
  alt: string;
  credito?: string;
}

export interface Indice {
  version: 1;
  generado: string;
  eventos: Record<string, FotoIndice>;
}

// Solo rutas que el importador puede haber escrito: evita que un índice alterado meta URL de otros sitios
const RUTA_VALIDA = /^eventos\/[a-z0-9_-]{1,64}\/[a-f0-9]{16}-\d{3,4}\.webp$/;
const ESPERA_MS = 6000;

// Tamaños con los que el navegador elige la variante (proporciones de cada tarjeta, ver FotoEvento.astro)
const TAMANOS: Record<string, string> = {
  tarjeta: '(max-width: 767px) 72vw, 360px',
  detalle: '(max-width: 1279px) 100vw, 1240px',
  mini: '120px',
  media: '(max-width: 767px) 92vw, 560px',
};

const base = (): string => {
  // Gancho solo para las pruebas locales (Playwright en localhost); en producción manda IMAGENES_URL
  const prueba = (globalThis as { __FE_IMAGENES_URL__?: string }).__FE_IMAGENES_URL__;
  if (prueba && ['localhost', '127.0.0.1'].includes(location.hostname)) return prueba.replace(/\/+$/, '');
  return IMAGENES_URL;
};

let pedido: Promise<Indice | null> | undefined;

export const cargarIndice = (): Promise<Indice | null> => {
  const raiz = base();
  if (!raiz) return Promise.resolve(null);
  pedido ??= (async () => {
    const control = new AbortController();
    const reloj = setTimeout(() => control.abort(), ESPERA_MS);
    try {
      const r = await fetch(`${raiz}/indice/eventos-v1.json`, { credentials: 'omit', signal: control.signal });
      if (!r.ok) return null;
      const datos = (await r.json()) as Indice;
      return datos && datos.version === 1 && datos.eventos && typeof datos.eventos === 'object' ? datos : null;
    } catch {
      return null;
    } finally {
      clearTimeout(reloj);
    }
  })();
  return pedido;
};

// srcset con las variantes válidas, de menor a mayor
export const srcsetDe = (raiz: string, foto: FotoIndice): string =>
  Object.entries(foto.variantes ?? {})
    .filter(([ancho, ruta]) => /^\d{3,4}$/.test(ancho) && RUTA_VALIDA.test(ruta))
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([ancho, ruta]) => `${raiz}/${ruta} ${ancho}w`)
    .join(', ');

const pintarUna = (marco: HTMLElement, foto: FotoIndice, raiz: string) => {
  if (marco.querySelector('img')) return;
  const srcset = srcsetDe(raiz, foto);
  if (!srcset) return;
  const tamano = marco.dataset.tamano ?? 'tarjeta';
  const img = document.createElement('img');
  // En las tarjetas la foto acompaña al título (decorativa); en el detalle lleva su texto alternativo
  img.alt = marco.dataset.conAlt !== undefined ? foto.alt : '';
  img.decoding = 'async';
  img.loading = tamano === 'detalle' ? 'eager' : 'lazy';
  if (tamano === 'detalle') img.setAttribute('fetchpriority', 'high');
  img.sizes = TAMANOS[tamano] ?? TAMANOS.tarjeta;
  img.srcset = srcset;
  img.src = srcset.split(', ').at(-1)!.split(' ')[0];
  if (foto.ancho && foto.alto) {
    img.width = foto.ancho;
    img.height = foto.alto;
  }
  img.addEventListener('load', () => marco.classList.add('cargada'), { once: true });
  // Foto borrada o caída de R2: se quita y queda el degradado
  img.addEventListener('error', () => img.remove(), { once: true });
  marco.append(img);
  if (img.complete && img.naturalWidth) marco.classList.add('cargada');
};

// Pinta las fotos de todos los marcadores dentro de `raiz` (también sirve para tarjetas creadas después)
export const pintarFotos = async (raiz: ParentNode = document): Promise<number> => {
  const marcos = [...raiz.querySelectorAll<HTMLElement>('[data-foto-evento]')];
  if (!marcos.length) return 0;
  const indice = await cargarIndice();
  if (!indice) return 0;
  const url = base();
  let pintadas = 0;
  for (const marco of marcos) {
    const foto = indice.eventos[marco.dataset.fotoEvento ?? ''];
    if (foto) {
      pintarUna(marco, foto, url);
      pintadas++;
    }
  }
  return pintadas;
};
