// Utilidades de las pruebas de la etapa B1. Nada de esto toca Cloudflare: la base es SQLite en memoria con las
// mismas migraciones de migraciones/.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { adaptar } from '../../scripts/imagenes/adaptar.mjs';
import { crearAlmacenMemoria } from '../../scripts/imagenes/almacenes.mjs';
import { ciudades } from '../../src/data/ciudades.ts';

export const HOY = '2026-10-15';
export const CARPETA = join(import.meta.dirname, 'muestras', 'investigacion');

export const archivosMuestra = () =>
  readdirSync(CARPETA)
    .filter((f) => f.endsWith('.jsonl'))
    .sort()
    .map((f) => ({ archivo: f, contenido: readFileSync(join(CARPETA, f), 'utf8') }));

export const eventosSitio = [{ id: 'e12', titulo: 'Vallenato en el Gran Malecón', ciudad: 'barranquilla', fecha: '2026-10-10' }];

export const adaptarMuestra = (extra = {}) => adaptar({ archivos: archivosMuestra(), eventos: eventosSitio, ciudades, hoy: HOY, ...extra });

export const lineas = (jsonl) => jsonl.trim().split('\n').filter(Boolean).map((l) => JSON.parse(l));
export const porRef = (cola, ref) => cola.find((l) => l.ref === ref);
export const tipos = (linea, gravedad) => linea.alertas.filter((a) => !gravedad || a.gravedad === gravedad).map((a) => a.tipo);

export const almacen = () => crearAlmacenMemoria();
