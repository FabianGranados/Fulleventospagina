#!/usr/bin/env node
// Genera src/data/divipola.json (municipios de Colombia con su código DIVIPOLA del DANE) a partir de un archivo
// fuente. No se conecta a internet: el archivo se descarga a mano y se pasa como argumento.
//
//   npm run divipola -- --datos-gov                 Descarga la lista oficial de datos.gov.co (DANE, gdxc-w37w)
//   npm run divipola -- <archivo.csv|archivo.json> [--fuente "texto de procedencia"]
//
// Formatos aceptados:
// - JSON de datos abiertos (datos.gov.co, conjunto gdxc-w37w "DIVIPOLA- Códigos municipios" del DANE): lista de
//   { cod_mpio, nom_mpio, tipo_municipio, latitud, longitud }. Es la fuente oficial que se usa.
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

const TIPOS = { municipio: 'municipio', 'area no municipalizada': 'area_no_municipalizada', isla: 'isla' };
const tipoDe = (t) => TIPOS[String(t ?? 'Municipio').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()] ?? 'municipio';
const numero = (v) => {
  const n = Number(String(v ?? '').replace(',', '.'));
  return v === undefined || v === null || v === '' || !Number.isFinite(n) ? undefined : Math.round(n * 1e6) / 1e6;
};

export const generar = (contenido, archivo) => {
  const crudos = archivo.endsWith('.json')
    ? JSON.parse(contenido).map((x) => ({
        codigo: String(x.cod_mpio ?? x.mpioCode ?? x.codigo).padStart(5, '0'),
        nombre: x.nom_mpio ?? x.mpioName ?? x.nombre,
        tipo: tipoDe(x.tipo_municipio),
        latitud: numero(x.latitud),
        longitud: numero(x.longitud),
      }))
    : leerCsv(contenido);
  // El archipiélago no está en departamentos.ts como polígono (va en el recuadro `islas`), pero sí es departamento
  const deptos = new Map([...departamentos.map((d) => [d.cod, d.nombre]), ['88', 'San Andrés, Providencia y Santa Catalina']]);
  const vistos = new Set();
  const municipios = [];
  for (const { codigo, nombre, tipo = 'municipio', latitud, longitud } of crudos) {
    if (!/^\d{5}$/.test(codigo)) throw new Error(`Código inválido: ${codigo}`);
    if (vistos.has(codigo)) throw new Error(`Código repetido: ${codigo}`);
    vistos.add(codigo);
    const dep = codigo.slice(0, 2);
    if (!deptos.has(dep)) throw new Error(`El departamento ${dep} (de ${codigo}) no está en departamentos.ts`);
    const fila = { codigo, nombre: nombrePropio(nombre), departamento_codigo: dep, departamento: deptos.get(dep), tipo };
    if (latitud !== undefined && longitud !== undefined) Object.assign(fila, { latitud, longitud });
    municipios.push(fila);
  }
  municipios.sort((a, b) => a.codigo.localeCompare(b.codigo));
  return municipios;
};

const DATOS_GOV = 'https://www.datos.gov.co/resource/gdxc-w37w.json?$limit=5000';

if (process.argv[1]?.endsWith('divipola-generar.mjs')) {
  const { values, positionals } = parseArgs({ allowPositionals: true, options: { fuente: { type: 'string' }, 'datos-gov': { type: 'boolean', default: false } } });
  let [archivo] = positionals;
  let contenido;
  let fuente = values.fuente;
  if (values['datos-gov']) {
    const r = await fetch(DATOS_GOV);
    if (!r.ok) throw new Error(`datos.gov.co respondió ${r.status}`);
    contenido = await r.text();
    archivo = 'gdxc-w37w.json';
    fuente ??= `DANE, DIVIPOLA "Códigos municipios" (datos.gov.co, gdxc-w37w, CC BY-SA 4.0), descargado el ${new Date().toISOString().slice(0, 10)}`;
  } else if (archivo) contenido = readFileSync(archivo, 'utf8');
  else {
    console.log('Uso: npm run divipola -- --datos-gov   o   npm run divipola -- <archivo.csv|archivo.json> [--fuente "procedencia"]');
    process.exit(1);
  }
  const municipios = generar(contenido, archivo);
  const salida = { fuente: fuente ?? archivo, generado: new Date().toISOString().slice(0, 10), total: municipios.length, municipios };
  const destino = join(import.meta.dirname, '..', '..', 'src', 'data', 'divipola.json');
  writeFileSync(destino, JSON.stringify(salida, null, 1) + '\n');
  const tipos = municipios.reduce((a, m) => ({ ...a, [m.tipo]: (a[m.tipo] ?? 0) + 1 }), {});
  console.log(`${municipios.length} entradas (${JSON.stringify(tipos)}) en ${destino}. Ahora: npm run divipola:sql`);
}
