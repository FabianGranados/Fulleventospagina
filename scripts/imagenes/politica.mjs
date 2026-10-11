// Política del importador de imágenes: límites de seguridad y de costo (docs/imagenes-r2.md).
// Se puede ajustar con scripts/imagenes/politica.json (opcional, en el repositorio: no lleva secretos).
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export const POLITICA_BASE = Object.freeze({
  // Descarga
  protocolos: ['https:'],
  // Dominios desde los que siempre se puede descargar (CDN de boleteras u organizadores con acuerdo).
  // Se compara el dominio exacto o un subdominio: "ejemplo.com" permite "img.ejemplo.com".
  dominiosPermitidos: [],
  // Si la fuente es oficial, también se permite descargar del mismo dominio de la página de la fuente
  permitirDominioDeLaFuente: true,
  // Nunca a localhost, redes privadas, enlaces locales, metadatos de nube, etc. Solo se apaga en las pruebas.
  permitirIpPrivadas: false,
  maxRedirecciones: 3,
  esperaMs: 20_000,

  // Archivo
  maxBytesImagen: 15 * 1024 * 1024,
  formatos: ['jpeg', 'png', 'webp', 'avif'],
  anchoMinimo: 480,
  altoMinimo: 300,
  maxPixeles: 60_000_000, // ~ 7.700 × 7.700: corta las "bombas" de descompresión
  variantes: [480, 960, 1600],
  calidadWebp: 80,

  // Derechos: con true, lo que llega marcado como verificado por un agente (Gemini) queda pendiente hasta que
  // una persona lo apruebe con `npm run imagenes -- aprobar`. Solo se publica solo lo que verificó una persona.
  exigirRevisionHumana: true,

  // Costo por ejecución
  maxRegistros: 500,
  maxBytesDescargaTotal: 400 * 1024 * 1024,

  // Objetos en R2
  cacheImagenes: 'public, max-age=31536000, immutable', // la URL cambia con cada foto nueva
  cacheIndice: 'public, max-age=300', // el índice se reemplaza; 5 minutos en el borde
});

export const cargarPolitica = (raiz = process.cwd(), extra = {}) => {
  const ruta = join(raiz, 'scripts', 'imagenes', 'politica.json');
  const archivo = existsSync(ruta) ? JSON.parse(readFileSync(ruta, 'utf8')) : {};
  return Object.freeze({ ...POLITICA_BASE, ...archivo, ...extra });
};

// Errores con código estable: van al registro de la importación y a la tabla importaciones_errores
export class ErrorImagen extends Error {
  constructor(codigo, mensaje, { reintentable = false } = {}) {
    super(mensaje);
    this.codigo = codigo;
    this.reintentable = reintentable;
  }
}
