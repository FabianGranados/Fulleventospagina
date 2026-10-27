#!/usr/bin/env node
// `npm run test:d1` (etapa B3): el sitio en modo D1 con una base LOCAL aparte (.wrangler/pruebas-d1), que se crea
// de cero en cada corrida. No toca la base con la que trabajas (.wrangler/state) ni Cloudflare.
//   1. Base nueva: migraciones, los 19 eventos de ejemplo, 30 de prueba (paginación) y uno pendiente que no se ve.
//   2. Fotos de prueba por el importador de imágenes en modo local (bucket aparte).
//   3. Compila con EVENTOS_D1=local en dist-pruebas-d1/ (dist/ y lo que se desplegaría no se tocan) y corre
//      tests/d1.spec.ts contra `astro preview` de esa carpeta (playwright.d1.config.ts).
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const raiz = process.cwd();
const estado = join(raiz, '.wrangler', 'pruebas-d1');
const env = { ...process.env, EVENTOS_D1: 'local', EVENTOS_D1_ESTADO: estado, PUBLIC_IMAGENES_URL: 'http://localhost:4580' };

const correr = (titulo, comando, args) => {
  console.log(`\n▸ ${titulo}`);
  const r = spawnSync(comando, args, { cwd: raiz, env, stdio: 'inherit' });
  if (r.status !== 0) throw Object.assign(new Error(`Falló: ${titulo}`), { codigo: r.status ?? 1 });
};

try {
  rmSync(estado, { recursive: true, force: true });
  const d1 = join(raiz, 'scripts', 'eventos', 'd1-local.mjs');
  correr('Base D1 de prueba', process.execPath, [d1, 'preparar']);
  correr('Eventos de prueba', process.execPath, [d1, 'sembrar-pruebas']);
  correr('Fotos de prueba (importador en modo local)', process.execPath, [d1, 'fotos-de-prueba']);
  // Astro deja en .wrangler/deploy/config.json a dónde apunta `wrangler deploy` (y la vista previa lo usa para
  // encontrar el Worker): se restaura al terminar las pruebas para que un despliegue nunca tome dist-pruebas-d1
  const despliegue = join(raiz, '.wrangler', 'deploy', 'config.json');
  const antes = existsSync(despliegue) ? readFileSync(despliegue) : null;
  try {
    correr('Compilación en modo D1', process.execPath, [join(raiz, 'node_modules', 'astro', 'bin', 'astro.mjs'), 'build', '--outDir', 'dist-pruebas-d1']);
    correr('Pruebas del modo D1', process.execPath, [join(raiz, 'node_modules', '@playwright', 'test', 'cli.js'), 'test', '-c', 'playwright.d1.config.ts']);
  } finally {
    if (antes) writeFileSync(despliegue, antes);
    else rmSync(despliegue, { force: true });
  }
} catch (e) {
  console.error(e.message);
  process.exitCode = e.codigo ?? 1;
}
