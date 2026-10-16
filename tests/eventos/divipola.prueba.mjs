// Municipios DIVIPOLA: lista completa, búsqueda por código y por nombre, homónimos y generación del SQL.
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { municipios, municipioPorCodigo, resolverMunicipio, ciudadSitio, CIUDADES_SITIO } from '../../scripts/eventos/divipola.mjs';
import { generar, nombrePropio } from '../../scripts/eventos/divipola-generar.mjs';
import { generarSql } from '../../scripts/eventos/divipola-sql.mjs';
import { ciudades } from '../../src/data/ciudades.ts';
import { almacen } from './ayudas.mjs';

describe('DIVIPOLA', () => {
  test('trae todos los municipios de los 33 departamentos (32 + Bogotá), sin códigos repetidos', () => {
    assert.ok(municipios.length >= 1100, `solo hay ${municipios.length}`);
    assert.equal(new Set(municipios.map((m) => m.codigo)).size, municipios.length);
    assert.equal(new Set(municipios.map((m) => m.departamento_codigo)).size, 33);
    for (const m of municipios) {
      assert.match(m.codigo, /^\d{5}$/);
      assert.equal(m.codigo.slice(0, 2), m.departamento_codigo);
    }
  });

  test('las ciudades de la interfaz tienen su código y existen', () => {
    for (const c of ciudades) assert.ok(CIUDADES_SITIO[c.id], `falta el código de ${c.id}`);
    for (const [id, codigo] of Object.entries(CIUDADES_SITIO)) {
      assert.ok(municipioPorCodigo(codigo), `${codigo} no existe`);
      assert.equal(ciudadSitio(codigo), id);
    }
    assert.equal(municipioPorCodigo('11001').nombre, 'Bogotá, D.C.');
  });

  test('encuentra por nombre con variantes y respeta el departamento', () => {
    assert.equal(resolverMunicipio({ nombre: 'BOGOTÁ D.C.' }).municipio.codigo, '11001');
    assert.equal(resolverMunicipio({ nombre: 'Cartagena' }).municipio.codigo, '13001');
    assert.equal(resolverMunicipio({ nombre: 'san martin', departamento: 'Meta' }).municipio.codigo, '50689');
    assert.equal(resolverMunicipio({ nombre: 'Tunja' }).municipio.departamento, 'Boyacá');
  });

  test('no adivina entre homónimos ni acepta códigos que no coinciden', () => {
    assert.match(resolverMunicipio({ nombre: 'Albán' }).error, /varios departamentos/);
    assert.equal(resolverMunicipio({ nombre: 'Albán', departamento: 'Nariño' }).municipio.codigo, '52019');
    assert.match(resolverMunicipio({ codigo: '99999' }).error, /no existe/);
    assert.match(resolverMunicipio({ codigo: '05001', nombre: 'Cali' }).error, /es de Medellín/);
    assert.match(resolverMunicipio({ codigo: '05001', departamentoCodigo: '76' }).error, /Antioquia/);
    assert.match(resolverMunicipio({ nombre: 'Ciudad Inventada' }).error, /no aparece/);
  });

  test('el generador lee el CSV del DANE y escribe nombres propios', () => {
    const csv = '﻿Código Departamento;Nombre Departamento;Código Municipio;Nombre Municipio\n05;ANTIOQUIA;05001;MEDELLÍN\n50;META;50689;SAN MARTÍN\n11;BOGOTÁ, D.C.;11001;BOGOTÁ. D.C.';
    const m = generar(csv, 'divipola.csv');
    assert.deepEqual(m.map((x) => [x.codigo, x.nombre, x.departamento]), [['05001', 'Medellín', 'Antioquia'], ['11001', 'Bogotá, D.C.', 'Bogotá, D. C.'], ['50689', 'San Martín', 'Meta']]);
    assert.equal(nombrePropio('SAN JOSÉ DEL GUAVIARE'), 'San José del Guaviare');
    assert.throws(() => generar('Código Municipio;Nombre Municipio\n05001;A\n05001;B', 'x.csv'), /repetido/);
  });

  test('la migración 0003 carga todos los municipios y se puede repetir', async () => {
    const a = await almacen();
    const [n] = await a.db.consultar('SELECT COUNT(*) AS m, (SELECT COUNT(*) FROM departamentos) AS d FROM municipios');
    assert.equal(n.m, municipios.length);
    assert.equal(n.d, 33);
    // Repetir el SQL (como una lista nueva del DANE) no duplica ni falla
    const sql = generarSql({ fuente: 'prueba', municipios });
    for (const sentencia of sql.split(/;\s*\n/).filter((s) => s.trim() && !s.trim().startsWith('--'))) await a.db.ejecutar(sentencia.replace(/^(--.*\n)+/, ''));
    const [m] = await a.db.consultar('SELECT COUNT(*) AS m FROM municipios');
    assert.equal(m.m, municipios.length);
  });
});
