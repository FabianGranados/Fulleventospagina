// Utilidades de las pruebas del importador: imágenes de prueba, servidor HTTP local y un "D1" falso que responde
// como la API REST de Cloudflare pero guarda en SQLite en memoria. Nada de esto toca Cloudflare.
import http from 'node:http';
import sharp from 'sharp';
import { POLITICA_BASE } from '../../scripts/imagenes/politica.mjs';
import { crearAlmacenMemoria } from '../../scripts/imagenes/almacenes.mjs';
import { crearCatalogo } from '../../scripts/imagenes/catalogo.mjs';

export const imagen = (ancho, alto, color = { r: 200, g: 60, b: 40 }, formato = 'jpeg') =>
  sharp({ create: { width: ancho, height: alto, channels: 3, background: color } })
    [formato]()
    .toBuffer();

// Política de pruebas: deja usar http://localhost porque el servidor de prueba es local. Solo existe aquí.
export const politicaPrueba = (extra = {}) =>
  Object.freeze({
    ...POLITICA_BASE,
    protocolos: ['http:'],
    dominiosPermitidos: ['localhost'],
    permitirIpPrivadas: true,
    // La mayoría de las pruebas revisan el flujo de publicación; la compuerta humana tiene sus propias pruebas
    exigirRevisionHumana: false,
    ...extra,
  });

export const servidor = async (rutas) => {
  const visitas = new Map();
  const s = http.createServer((req, res) => {
    visitas.set(req.url, (visitas.get(req.url) ?? 0) + 1);
    const r = rutas[req.url];
    if (!r) {
      res.writeHead(404).end('no existe');
      return;
    }
    if (typeof r === 'function') return r(req, res);
    res.writeHead(200, { 'content-type': r.tipo ?? 'image/jpeg' }).end(r.cuerpo);
  });
  await new Promise((ok) => s.listen(0, '127.0.0.1', ok));
  const base = `http://localhost:${s.address().port}`;
  return { base, visitas, cerrar: () => new Promise((ok) => s.close(ok)) };
};

export const eventosPrueba = [
  { id: 'e1', titulo: 'Noche de salsa y boleros en vivo', ciudad: 'bogota', fecha: '2026-10-09', bg1: '#E8A04F', bg2: '#B5372B' },
  { id: 'e3', titulo: 'Rock en el Movistar Arena', ciudad: 'bogota', fecha: '2026-10-10', bg1: '#D9452F', bg2: '#2B0F12' },
  { id: 'e14', titulo: 'Atardecer electrónico en la playa', ciudad: 'santamarta', fecha: '2026-10-10', bg1: '#F3B27E', bg2: '#1E2550' },
];

export const catalogoPrueba = () => crearCatalogo(eventosPrueba);
export const almacenPrueba = () => crearAlmacenMemoria();

// Registro válido de Gemini; `cambios` se mezcla encima
export const registro = (base, cambios = {}) => {
  const r = {
    evento: { id: 'e3' },
    imagen: { url: `${base}/img/rock.jpg`, tipo: 'principal', texto_alternativo: 'Escenario del Movistar Arena con luces rojas', credito: 'Foto: Movistar Arena' },
    fuente: { nombre: 'Movistar Arena', url: `${base}/prensa`, oficial: true },
    derechos: { estado: 'confirmado', licencia: 'Kit de prensa del organizador', evidencia: `${base}/prensa#uso`, verificado_en: '2026-10-01', verificado_por: 'persona' },
  };
  // `evento` se reemplaza entero (id, ciudad + slug o título + fecha); los demás objetos se mezclan
  for (const [k, v] of Object.entries(cambios)) r[k] = k !== 'evento' && v && typeof v === 'object' && !Array.isArray(v) ? { ...r[k], ...v } : v;
  return r;
};

export const jsonl = (...registros) => registros.map((r) => (typeof r === 'string' ? r : JSON.stringify(r))).join('\n');
