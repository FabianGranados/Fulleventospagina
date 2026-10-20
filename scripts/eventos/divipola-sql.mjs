#!/usr/bin/env node
// Escribe migraciones/0003_divipola.sql desde src/data/divipola.json: departamentos y municipios con su código
// DIVIPOLA. Usa ON CONFLICT … DO UPDATE para que una lista nueva del DANE actualice nombres sin borrar filas (los
// eventos apuntan a municipios.codigo). Archivo generado: no se edita a mano.
//
//   npm run divipola:sql
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const raiz = join(import.meta.dirname, '..', '..');
const sql = (v) => `'${String(v).replace(/'/g, "''")}'`;

export const generarSql = (datos) => {
  const deptos = new Map();
  for (const m of datos.municipios) deptos.set(m.departamento_codigo, m.departamento);
  const lineas = [
    '-- Migración 0003 · Municipios de Colombia (DIVIPOLA, DANE). GENERADO con `npm run divipola:sql`: no editar a mano.',
    `-- Fuente: ${datos.fuente.replace(/\n/g, ' ')}`,
    `-- ${deptos.size} departamentos y ${datos.municipios.length} entradas (municipios, áreas no municipalizadas e islas). Segura de repetir; actualiza nombres sin borrar.`,
    '',
    'INSERT INTO departamentos (codigo, nombre) VALUES',
    [...deptos].sort(([a], [b]) => a.localeCompare(b)).map(([c, n]) => `  (${sql(c)}, ${sql(n)})`).join(',\n'),
    'ON CONFLICT (codigo) DO UPDATE SET nombre = excluded.nombre;',
    '',
  ];
  // Bloques de 200 filas: cada sentencia queda muy por debajo del límite de tamaño de D1
  for (let i = 0; i < datos.municipios.length; i += 200) {
    const bloque = datos.municipios.slice(i, i + 200);
    const num = (v) => (v === undefined ? 'NULL' : String(v));
    lineas.push('INSERT INTO municipios (codigo, nombre, departamento_codigo, tipo, latitud, longitud) VALUES');
    lineas.push(bloque.map((m) => `  (${sql(m.codigo)}, ${sql(m.nombre)}, ${sql(m.departamento_codigo)}, ${sql(m.tipo ?? 'municipio')}, ${num(m.latitud)}, ${num(m.longitud)})`).join(',\n'));
    lineas.push('ON CONFLICT (codigo) DO UPDATE SET nombre = excluded.nombre, departamento_codigo = excluded.departamento_codigo, tipo = excluded.tipo, latitud = excluded.latitud, longitud = excluded.longitud;', '');
  }
  return lineas.join('\n');
};

if (process.argv[1]?.endsWith('divipola-sql.mjs')) {
  const datos = JSON.parse(readFileSync(join(raiz, 'src', 'data', 'divipola.json'), 'utf8'));
  writeFileSync(join(raiz, 'migraciones', '0003_divipola.sql'), generarSql(datos));
  console.log(`migraciones/0003_divipola.sql con ${datos.municipios.length} municipios`);
}
