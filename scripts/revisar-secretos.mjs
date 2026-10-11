#!/usr/bin/env node
// Busca credenciales en los archivos que Git sube (el repositorio es público). Falla con código 1 si encuentra algo.
// Uso: npm run revisar:secretos            (archivos de Git)
//      node scripts/revisar-secretos.mjs <carpeta>   (otra carpeta, para las pruebas)
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

export const PATRONES = [
  ['Token de la API de Cloudflare', /\bCLOUDFLARE_API_TOKEN\s*[:=]\s*["']?(?!\$|<|TU_|\.\.\.|xxx)[A-Za-z0-9_-]{30,}/],
  ['Clave global de Cloudflare', /\bCLOUDFLARE_API_KEY\s*[:=]\s*["']?[a-f0-9]{30,}/i],
  ['Clave secreta de R2 / S3', /\b(?:R2|AWS)_SECRET_ACCESS_KEY\s*[:=]\s*["']?[A-Za-z0-9/+=]{30,}/],
  ['ID de acceso de AWS', /\bAKIA[0-9A-Z]{16}\b/],
  ['Llave privada', /-----BEGIN (?:RSA |EC |OPENSSH |PGP )?PRIVATE KEY-----/],
  ['Token de GitHub', /\bgh[pousr]_[A-Za-z0-9]{36,}\b/],
  ['Encabezado Bearer con token', /authorization['"]?\s*:\s*['"]Bearer [A-Za-z0-9_-]{30,}['"]/i],
];

const BINARIOS = /\.(png|jpe?g|webp|avif|gif|ico|woff2?|ttf|otf|pdf|zip|sqlite)$/i;

const archivosDeGit = (raiz) =>
  execFileSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard'], { cwd: raiz, encoding: 'utf8' })
    .split('\0')
    .filter(Boolean)
    .map((r) => join(raiz, r));

const recorrer = (dir) =>
  readdirSync(dir).flatMap((n) => {
    if (['node_modules', '.git', 'dist'].includes(n)) return [];
    const ruta = join(dir, n);
    return statSync(ruta).isDirectory() ? recorrer(ruta) : [ruta];
  });

export const revisar = (raiz, archivos) => {
  const hallazgos = [];
  for (const archivo of archivos) {
    if (BINARIOS.test(archivo) || archivo.endsWith('package-lock.json')) continue;
    let texto;
    try {
      texto = readFileSync(archivo, 'utf8');
    } catch {
      continue;
    }
    texto.split('\n').forEach((linea, i) => {
      for (const [nombre, patron] of PATRONES) {
        if (patron.test(linea)) hallazgos.push({ archivo: relative(raiz, archivo), linea: i + 1, nombre });
      }
    });
  }
  return hallazgos;
};

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('revisar-secretos.mjs')) {
  const carpeta = process.argv[2];
  const raiz = carpeta ?? process.cwd();
  const hallazgos = revisar(raiz, carpeta ? recorrer(carpeta) : archivosDeGit(raiz));
  if (hallazgos.length) {
    console.error('Posibles credenciales en archivos que se subirían a GitHub:');
    for (const h of hallazgos) console.error(`  ${h.archivo}:${h.linea} · ${h.nombre}`);
    console.error('Muévelas a .env.importador o .dev.vars (ignorados por Git) y cámbialas en Cloudflare si ya se subieron.');
    process.exitCode = 1;
  } else {
    console.log('Sin credenciales en los archivos del repositorio.');
  }
}
