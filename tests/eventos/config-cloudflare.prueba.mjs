// Configuraciones de Cloudflare de la etapa B: la de pruebas apunta solo al Worker y la base de pruebas, la local no
// tiene nada remoto y la de producción (wrangler.jsonc) sigue sin base D1. Así un `npm run build:pruebas` o un
// `npm run build:d1` nunca terminan desplegando o escribiendo sobre producción por un cambio descuidado.
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// JSONC → JSON: quita los comentarios de línea (las URL de "$schema" no tienen "//")
const leer = (archivo) => {
  const texto = readFileSync(archivo, 'utf8');
  return { texto, datos: JSON.parse(texto.replace(/^\s*\/\/.*$/gm, '')) };
};

describe('Configuración de Cloudflare', () => {
  test('wrangler.pruebas.jsonc: solo el Worker fulleventos-pruebas y la base fulleventos-pruebas', () => {
    const { datos } = leer('wrangler.pruebas.jsonc');
    assert.equal(datos.name, 'fulleventos-pruebas');
    assert.equal(datos.workers_dev, true);
    assert.deepEqual(datos.d1_databases, [
      { binding: 'DB', database_name: 'fulleventos-pruebas', database_id: '5f81a0fe-33bb-45aa-9b58-a52554e1de53', migrations_dir: 'migraciones' },
    ]);
    // (el comentario del archivo sí lo nombra, para advertirlo; los valores no)
    assert.ok(!JSON.stringify(datos).includes('fulleventospagina'), 'no puede nombrar el Worker de producción');
    assert.equal(datos.routes, undefined, 'sin rutas propias: solo workers.dev');
  });

  test('wrangler.local.jsonc: base solo local y wrangler.jsonc (producción) sin base D1', () => {
    const local = leer('wrangler.local.jsonc').datos;
    assert.equal(local.d1_databases[0].database_id, 'fulleventos-solo-local');
    const produccion = leer('wrangler.jsonc').datos;
    assert.equal(produccion.name, 'fulleventospagina');
    assert.equal(produccion.d1_databases, undefined);
  });

  test('astro.config.mjs usa cada configuración solo en su modo', () => {
    const config = readFileSync('astro.config.mjs', 'utf8');
    assert.match(config, /local: 'wrangler\.local\.jsonc', pruebas: 'wrangler\.pruebas\.jsonc'/);
    assert.match(config, /remoteBindings: false/);
    const paquete = JSON.parse(readFileSync('package.json', 'utf8'));
    assert.equal(paquete.scripts['build:pruebas'], 'EVENTOS_D1=pruebas astro build');
    assert.ok(!Object.values(paquete.scripts).some((s) => /--remote|wrangler deploy/.test(s)), 'ningún script despliega ni usa --remote');
  });
});
