// Municipios de Colombia por código DIVIPOLA (DANE). Datos en src/data/divipola.json, generados con
// `npm run divipola -- <archivo>` (scripts/eventos/divipola-generar.mjs). Los eventos se ubican SIEMPRE por código
// de municipio (5 dígitos); el nombre solo sirve para encontrarlo cuando la investigación no trae el código.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { normalizar } from '../../src/lib/formato.ts';

const datos = JSON.parse(readFileSync(join(import.meta.dirname, '..', '..', 'src', 'data', 'divipola.json'), 'utf8'));
export const fuenteDivipola = datos.fuente;
export const municipios = datos.municipios;

// Ciudades que hoy tiene la interfaz (src/data/ciudades.ts) → código DIVIPOLA. B2 usará el código en las rutas
// nuevas; mientras tanto, el importador guarda también el id del sitio para las que ya existen.
export const CIUDADES_SITIO = {
  bogota: '11001',
  medellin: '05001',
  cali: '76001',
  barranquilla: '08001',
  cartagena: '13001',
  santamarta: '47001',
  bucaramanga: '68001',
  pereira: '66001',
  villavicencio: '50001',
  pasto: '52001',
  leticia: '91001',
};
const SITIO_POR_CODIGO = new Map(Object.entries(CIUDADES_SITIO).map(([id, c]) => [c, id]));

// Clave de comparación: sin tildes, sin "D.C.", sin signos ("Cartagena de Indias" también se encuentra como "Cartagena")
const clave = (t) =>
  normalizar(String(t ?? ''))
    .replace(/\b(d c|distrito capital|distrito turistico y cultural|distrito especial)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const porCodigo = new Map(municipios.map((m) => [m.codigo, m]));
const porNombre = new Map();
const agregar = (k, m) => {
  if (!k) return;
  const lista = porNombre.get(k) ?? [];
  if (!lista.includes(m)) lista.push(m);
  porNombre.set(k, lista);
};
for (const m of municipios) {
  agregar(clave(m.nombre), m);
  // Nombres oficiales largos que la gente escribe cortos
  const corto = clave(m.nombre).replace(/ de indias$/, '').replace(/^guadalajara de /, '').replace(/^santiago de /, '').replace(/^san jose de cucuta$/, 'cucuta');
  agregar(corto, m);
}
const deptoClave = (t) => clave(t).replace(/^(departamento del?|archipielago de) /, '');

export const municipioPorCodigo = (codigo) => porCodigo.get(String(codigo ?? '').padStart(5, '0')) ?? null;
export const ciudadSitio = (codigo) => SITIO_POR_CODIGO.get(codigo) ?? null;

// Resuelve el municipio. Devuelve { municipio } o { error } — nunca adivina entre homónimos.
export const resolverMunicipio = ({ codigo, nombre, departamento, departamentoCodigo: depto } = {}) => {
  const departamentoCodigo = depto ? String(depto).trim().padStart(2, '0') : undefined;
  if (codigo) {
    const m = municipioPorCodigo(codigo);
    if (!m) return { error: `El código DIVIPOLA ${codigo} no existe en la lista de municipios` };
    if (nombre && clave(nombre) && !porNombre.get(clave(nombre))?.includes(m) && !clave(m.nombre).startsWith(clave(nombre))) {
      return { error: `El código ${codigo} es de ${m.nombre} (${m.departamento}), no de "${nombre}"` };
    }
    if (departamentoCodigo && departamentoCodigo !== m.departamento_codigo) {
      return { error: `El código ${codigo} es de ${m.departamento}, no del departamento ${departamentoCodigo}` };
    }
    return { municipio: m };
  }
  let candidatos = porNombre.get(clave(nombre)) ?? [];
  if (!candidatos.length) return { error: `"${nombre}" no aparece en la lista DIVIPOLA de municipios` };
  if (departamentoCodigo) candidatos = candidatos.filter((m) => m.departamento_codigo === departamentoCodigo);
  else if (departamento) {
    const d = deptoClave(departamento);
    candidatos = candidatos.filter((m) => deptoClave(m.departamento).startsWith(d) || d.startsWith(deptoClave(m.departamento)));
  }
  if (candidatos.length === 1) return { municipio: candidatos[0] };
  if (!candidatos.length) return { error: `"${nombre}" no está en el departamento "${departamento ?? departamentoCodigo}"` };
  return { error: `"${nombre}" existe en varios departamentos (${candidatos.map((m) => `${m.departamento} ${m.codigo}`).join(', ')}): falta el departamento o el código` };
};
