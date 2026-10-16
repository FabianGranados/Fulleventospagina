#!/usr/bin/env node
// Genera src/data/divipola.json (municipios de Colombia con su código DIVIPOLA del DANE) a partir de un archivo
// fuente. No se conecta a internet: el archivo se descarga a mano y se pasa como argumento.
//
//   npm run divipola -- <archivo.csv|archivo.json> [--fuente "texto de procedencia"]
//
// Formatos aceptados:
// - CSV oficial del DANE (DIVIPOLA, "Códigos municipios"): columnas con "Código Municipio" y "Nombre Municipio"
//   (los nombres exactos de las columnas cambian entre versiones; se buscan por palabras).
// - JSON: lista de { mpioCode, mpioName, deptoName } (paquete npm `divipola`, MIT) o { codigo, nombre }.
//
// Los nombres de los departamentos salen de src/data/departamentos.ts (MGN del DANE), que ya usa el mapa.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { departamentos } from '../../src/data/departamentos.ts';

const MINUSCULAS = new Set(['de', 'del', 'la', 'las', 'los', 'el', 'y', 'e', 'en', 'a']);

// "SAN JOSÉ DEL GUAVIARE" → "San José del Guaviare"; "BOGOTÁ. D.C." → "Bogotá, D.C."
export const nombrePropio = (texto) =>
  texto
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\. D\.C\.$/i, ', D.C.')
    .toLocaleLowerCase('es-CO')
    .split(' ')
    .map((p, i) => {
      if (/^d\.c\.$/.test(p)) return 'D.C.';
      if (i > 0 && MINUSCULAS.has(p)) return p;
      return p.replace(/(^|[-(–])(\p{L})/gu, (_, a, b) => a + b.toLocaleUpperCase('es-CO'));
    })
    .join(' ');

const leerCsv = (texto) => {
  const filas = texto.replace(/^﻿/, '').split(/\r?\n/).filter((l) => l.trim());
  const sep = filas[0].includes(';') ? ';' : ',';
  const celdas = (l) => l.split(sep).map((c) => c.replace(/^"|"$/g, '').trim());
  const cab = celdas(filas[0]).map((c) => c.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase());
  const iCod = cab.findIndex((c) => c.includes('codigo') && c.includes('municipio'));
  const iNom = cab.findIndex((c) => c.includes('nombre') && c.includes('municipio'));
  if (iCod < 0 || iNom < 0) throw new Error('El CSV necesita las columnas "Código Municipio" y "Nombre Municipio"');
  return filas.slice(1).map((l) => {
    const c = celdas(l);
    return { codigo: c[iCod].padStart(5, '0'), nombre: c[iNom] };
  });
};

export const generar = (contenido, archivo) => {
  const crudos = archivo.endsWith('.json')
    ? JSON.parse(contenido).map((x) => ({ codigo: String(x.mpioCode ?? x.codigo).padStart(5, '0'), nombre: x.mpioName ?? x.nombre }))
    : leerCsv(contenido);
  // El archipiélago no está en departamentos.ts como polígono (va en el recuadro `islas`), pero sí es departamento
  const deptos = new Map([...departamentos.map((d) => [d.cod, d.nombre]), ['88', 'San Andrés, Providencia y Santa Catalina']]);
  const vistos = new Set();
  const municipios = [];
  for (const { codigo, nombre } of crudos) {
    if (!/^\d{5}$/.test(codigo)) throw new Error(`Código inválido: ${codigo}`);
    if (vistos.has(codigo)) throw new Error(`Código repetido: ${codigo}`);
    vistos.add(codigo);
    const dep = codigo.slice(0, 2);
    if (!deptos.has(dep)) throw new Error(`El departamento ${dep} (de ${codigo}) no está en departamentos.ts`);
    municipios.push({ codigo, nombre: nombrePropio(nombre), departamento_codigo: dep, departamento: deptos.get(dep) });
  }
  municipios.sort((a, b) => a.codigo.localeCompare(b.codigo));
  return municipios;
};

if (process.argv[1]?.endsWith('divipola-generar.mjs')) {
  const { values, positionals } = parseArgs({ allowPositionals: true, options: { fuente: { type: 'string' } } });
  const [archivo] = positionals;
  if (!archivo) {
    console.log('Uso: npm run divipola -- <archivo.csv|archivo.json> [--fuente "procedencia"]');
    process.exit(1);
  }
  const municipios = generar(readFileSync(archivo, 'utf8'), archivo);
  const salida = {
    fuente: values.fuente ?? archivo,
    generado: new Date().toISOString().slice(0, 10),
    total: municipios.length,
    municipios,
  };
  const destino = join(import.meta.dirname, '..', '..', 'src', 'data', 'divipola.json');
  writeFileSync(destino, JSON.stringify(salida, null, 1) + '\n');
  console.log(`${municipios.length} municipios en ${destino}. Ahora: npm run divipola:sql`);
}
