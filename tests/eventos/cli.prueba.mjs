// Línea de comandos de eventos: en B1 no existe el modo remoto y la simulación no deja archivos.
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { adaptarMuestra } from './ayudas.mjs';

const CLI = join(import.meta.dirname, '..', '..', 'scripts', 'eventos', 'cli.mjs');
const correr = (args, cwd) => spawnSync(process.execPath, [CLI, ...args], { cwd, encoding: 'utf8', env: { ...process.env, CLOUDFLARE_API_TOKEN: '', CLOUDFLARE_ACCOUNT_ID: '' } });

describe('npm run eventos', () => {
  test('el modo remoto está deshabilitado en B1', () => {
    const r = correr(['pendientes', '--remoto'], mkdtempSync(join(tmpdir(), 'fe-cli-')));
    assert.equal(r.status, 1);
    assert.match(r.stderr, /modo remoto no está habilitado/);
  });

  test('--simular importa en memoria y no crea la base local', () => {
    const dir = mkdtempSync(join(tmpdir(), 'fe-cli-'));
    const archivo = join(dir, 'eventos-nuevos.jsonl');
    writeFileSync(archivo, adaptarMuestra().eventosNuevosJsonl);
    const r = correr(['importar', archivo, '--simular', '--hoy', '2026-10-15'], dir);
    assert.equal(r.status, 0, r.stderr);
    assert.match(r.stdout, /simulación/);
    assert.match(r.stdout, /nuevos: 6/);
    assert.equal(existsSync(join(dir, 'registros')), false);
  });
});
