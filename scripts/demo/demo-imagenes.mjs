#!/usr/bin/env node
// Demostración local de punta a punta, sin Cloudflare y sin tocar producción:
//   Gemini (archivo de ejemplo) → adaptar → importar → aprobar → bucket local → sitio compilado aparte → navegador.
//
//   npm run demo:imagenes                 prepara todo y deja dos servidores locales hasta Ctrl+C
//   npm run demo:imagenes -- --preparar   prepara sin dejar servidores (para pruebas)
//
// Aislamiento:
// - Datos en registros/demo/ (SQLite + carpeta como bucket). No usa .env.importador ni credenciales.
// - El sitio se compila en dist-demo/ (no en dist/) con PUBLIC_IMAGENES_URL=http://localhost:4580.
// - Astro deja en .wrangler/deploy/config.json a dónde apunta `wrangler deploy`; la demo lo restaura al terminar
//   la compilación para que un despliegue nunca tome dist-demo.
// - Las imágenes de la demo son generadas aquí (marcadas "DEMO"); la "fuente oficial" es un servidor local.
import http from 'node:http';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import sharp from 'sharp';
import { adaptar } from '../imagenes/adaptar.mjs';
import { aprobar, importar, pendientes } from '../imagenes/importador.mjs';
import { crearAlmacenLocal } from '../imagenes/almacenes.mjs';
import { cargarEventos, crearCatalogo } from '../imagenes/catalogo.mjs';
import { POLITICA_BASE } from '../imagenes/politica.mjs';

const raiz = process.cwd();
const soloPreparar = process.argv.includes('--preparar');
const DEMO = join(raiz, 'registros', 'demo');
const P_FUENTE = 4581;
const P_R2 = 4580;
const P_SITIO = 4570;

// Política SOLO para la demo: la "fuente oficial" es http://localhost. La de producción no permite esto.
const politicaDemo = Object.freeze({ ...POLITICA_BASE, protocolos: ['http:'], dominiosPermitidos: ['localhost'], permitirIpPrivadas: true });

const servir = (carpeta, puerto, { cors = false } = {}) =>
  new Promise((ok) => {
    const tipos = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2' };
    const s = http.createServer((req, res) => {
      let ruta = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      if (ruta.endsWith('/')) ruta += 'index.html';
      const archivo = normalize(join(carpeta, ruta));
      if (!archivo.startsWith(carpeta)) return res.writeHead(403).end();
      const final = existsSync(archivo) && statSync(archivo).isDirectory() ? join(archivo, 'index.html') : archivo;
      if (!existsSync(final)) return res.writeHead(404).end('no existe');
      res.writeHead(200, { 'content-type': tipos[extname(final)] ?? 'application/octet-stream', ...(cors ? { 'access-control-allow-origin': '*' } : {}) });
      res.end(readFileSync(final));
    });
    s.listen(puerto, '127.0.0.1', () => ok(s));
  });

const imagenDemo = (texto, h) =>
  sharp(
    Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="2000">
      <defs><radialGradient id="g" cx="45%" cy="30%"><stop offset="0" stop-color="hsl(${h},85%,65%)"/><stop offset="1" stop-color="hsl(${h + 50},55%,18%)"/></radialGradient></defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
      ${Array.from({ length: 24 }, (_, i) => `<circle cx="${(i * 173) % 1600}" cy="${(i * 239) % 2000}" r="${50 + (i % 5) * 30}" fill="#fff" opacity=".18"/>`).join('')}
      <text x="80" y="200" font-family="sans-serif" font-size="110" font-weight="700" fill="#fff" opacity=".9">DEMO</text>
      <text x="80" y="300" font-family="sans-serif" font-size="56" fill="#fff" opacity=".85">${texto}</text>
    </svg>`),
  )
    .jpeg({ quality: 85 })
    .toBuffer();

const lineaGemini = (ref, evento, imagenes) => JSON.stringify({ formato: 'fulleventos-eventos-imagenes/1', ref, evento, imagenes });
const imagen = (nombre, alt) => ({
  url: `http://localhost:${P_FUENTE}/${nombre}.jpg`,
  pagina: `http://localhost:${P_FUENTE}/prensa`,
  texto_alternativo: alt,
  credito: 'Imagen de demostración generada localmente',
  fuente: { nombre: 'Fuente oficial de demostración', url: `http://localhost:${P_FUENTE}/prensa`, oficial: true },
  derechos: {
    estado: 'confirmado',
    licencia: 'Imagen propia de demostración',
    evidencias: [{ texto: 'Generada por scripts/demo/demo-imagenes.mjs' }],
    verificado_en: new Date().toISOString().slice(0, 10),
  },
});
const fuentes = [{ nombre: 'Fuente oficial de demostración', url: `http://localhost:${P_FUENTE}/prensa`, oficial: true }];

const main = async () => {
  console.log('1/6 Preparando carpeta aislada registros/demo …');
  rmSync(DEMO, { recursive: true, force: true });
  mkdirSync(join(DEMO, 'fuente'), { recursive: true });

  const fotos = { rock: ['Rock en el Movistar Arena', 10], vallenato: ['Vallenato en el Gran Malecón', 120], salsa: ['Noche de salsa y boleros', 30], jazz: ['Festival de jazz al parque', 220] };
  for (const [n, [t, h]] of Object.entries(fotos)) writeFileSync(join(DEMO, 'fuente', `${n}.jpg`), await imagenDemo(t, h));
  const fuente = await servir(join(DEMO, 'fuente'), P_FUENTE);

  console.log('2/6 Archivo de Gemini de ejemplo (3 eventos existentes y 1 nuevo) → adaptar …');
  const gemini = [
    lineaGemini('bogota-2026-10-10-rock-en-el-movistar-arena', { id: 'e3', titulo: 'Rock en el Movistar Arena', ciudad: 'Bogotá', fecha: '2026-10-10', fuentes }, [imagen('rock', 'Imagen de demostración para el concierto de rock')]),
    lineaGemini('barranquilla-2026-10-10-vallenato-en-el-gran-malecon', { titulo: 'Vallenato en el Gran Malecón', ciudad: 'Barranquilla', fecha: '2026-10-10', fuentes }, [imagen('vallenato', 'Imagen de demostración para el vallenato en el malecón')]),
    lineaGemini('bogota-2026-10-09-noche-de-salsa-y-boleros-en-vivo', { titulo: 'Noche de salsa y boleros en vivo', ciudad: 'Bogotá D.C.', fecha: '2026-10-09', fuentes }, [imagen('salsa', 'Imagen de demostración para la noche de salsa')]),
    lineaGemini('manizales-2026-11-21-evento-nuevo-de-demostracion', { titulo: 'Evento nuevo de demostración', ciudad: 'Manizales', fecha: '2026-11-21', fuentes }, [imagen('jazz', 'Imagen de demostración para un evento que aún no existe')]),
  ].join('\n');
  writeFileSync(join(DEMO, 'fulleventos_event_images.jsonl'), gemini);
  const { ciudades } = await import('../../src/data/ciudades.ts');
  const eventos = await cargarEventos();
  const a = adaptar({ contenido: gemini, archivo: 'fulleventos_event_images.jsonl', eventos, ciudades });
  writeFileSync(join(DEMO, 'imagenes-importador.jsonl'), a.imagenesJsonl);
  writeFileSync(join(DEMO, 'eventos-nuevos.jsonl'), a.eventosNuevosJsonl);
  console.log(`    ${a.reporte.imagenes_a_importar} imágenes a importar · ${a.reporte.eventos_nuevos} evento nuevo en la cola de la etapa B`);

  console.log('3/6 Importar (quedan pendientes: nadie las ha revisado) …');
  const almacen = await crearAlmacenLocal(raiz, DEMO);
  const r = await importar({ contenido: a.imagenesJsonl, almacen, catalogo: crearCatalogo(eventos), politica: politicaDemo, urlPublica: `http://localhost:${P_R2}` });
  console.log(`    pendientes: ${r.pendientes} · publicadas: ${r.publicadas}`);

  console.log('4/6 Aprobar como persona (simula la revisión humana) …');
  const ids = (await pendientes(almacen)).map((f) => f.id);
  const ap = await aprobar({ ids, por: 'Demostración local', almacen, politica: politicaDemo, urlPublica: `http://localhost:${P_R2}` });
  console.log(`    ${ap.filter((x) => x.resultado === 'publicada').length} publicadas en el bucket local`);
  fuente.close();

  console.log('5/6 Compilando el sitio en dist-demo/ (dist/ y el despliegue no se tocan) …');
  const config = join(raiz, '.wrangler', 'deploy', 'config.json');
  const antes = existsSync(config) ? readFileSync(config) : null;
  const b = spawnSync(process.execPath, [join(raiz, 'node_modules', 'astro', 'bin', 'astro.mjs'), 'build', '--outDir', 'dist-demo'], {
    stdio: 'inherit',
    env: { ...process.env, PUBLIC_IMAGENES_URL: `http://localhost:${P_R2}` },
  });
  if (antes) writeFileSync(config, antes);
  else rmSync(config, { force: true });
  if (b.status !== 0) throw new Error('Falló la compilación de la demo');

  if (soloPreparar) return console.log('6/6 Listo (--preparar): sin servidores.');
  await servir(join(DEMO, 'r2-local'), P_R2, { cors: true });
  await servir(join(raiz, 'dist-demo', 'client'), P_SITIO);
  console.log(`6/6 Demo lista:
    Sitio:   http://localhost:${P_SITIO}/   (mira "Lo que más se mueve", /agenda, /mapa y /evento/bogota/rock-en-el-movistar-arena)
    Bucket:  http://localhost:${P_R2}/indice/eventos-v1.json
    Datos:   registros/demo/imagenes-local.sqlite · cola de eventos nuevos: registros/demo/eventos-nuevos.jsonl
    Ctrl+C para terminar.`);
};

main().catch((e) => {
  console.error(`Error en la demo: ${e.message}`);
  process.exitCode = 1;
});
