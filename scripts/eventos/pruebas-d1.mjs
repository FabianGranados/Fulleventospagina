#!/usr/bin/env node
// `npm run test:d1` (etapa B3): el sitio en modo D1 con una base LOCAL aparte (.wrangler/pruebas-d1), que se crea
// de cero en cada corrida. No toca la base con la que trabajas (.wrangler/state) ni Cloudflare.
//   1. Base nueva: migraciones, los 19 eventos de ejemplo, 30 de prueba (paginación) y uno pendiente que no se ve.
//   2. Fotos de prueba por el importador de imágenes en modo local (bucket aparte).
//   3. Compila con EVENTOS_D1=local y corre tests/d1.spec.ts contra `astro preview` (playwright.d1.config.ts).
import { spawnSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import { join } from 'node:path';

const raiz = process.cwd();
const estado = join(raiz, '.wrangler', 'pruebas-d1');
const env = { ...process.env, EVENTOS_D1: 'local', EVENTOS_D1_ESTADO: estado, PUBLIC_IMAGENES_URL: 'http://localhost:4580' };

const correr = (titulo, comando, args) => {
  console.log(`\n▸ ${titulo}`);
  const r = spawnSync(comando, args, { cwd: raiz, env, stdio: 'inherit' });
  if (r.status !== 0) process.exit(r.status ?? 1);
};

rmSync(estado, { recursive: true, force: true });
const d1 = join(raiz, 'scripts', 'eventos', 'd1-local.mjs');
correr('Base D1 de prueba', process.execPath, [d1, 'preparar']);
correr('Eventos de prueba', process.execPath, [d1, 'sembrar-pruebas']);
correr('Fotos de prueba (importador en modo local)', process.execPath, [d1, 'fotos-de-prueba']);
correr('Compilación en modo D1', process.execPath, [join(raiz, 'node_modules', 'astro', 'bin', 'astro.mjs'), 'build']);
correr('Pruebas del modo D1', process.execPath, [join(raiz, 'node_modules', '@playwright', 'test', 'cli.js'), 'test', '-c', 'playwright.d1.config.ts']);
