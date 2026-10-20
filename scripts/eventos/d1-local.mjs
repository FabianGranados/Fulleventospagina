#!/usr/bin/env node
// Base D1 LOCAL del sitio (etapa B2, docs/etapa-b-eventos-d1.md). Nada de esto toca Cloudflare: la base es el archivo
// SQLite que wrangler/miniflare guarda en .wrangler/state y que el sitio lee con EVENTOS_D1=local.
//
//   npm run d1:local -- preparar      Crea la base local, aplica las migraciones y carga los 19 eventos de ejemplo
//                                     (demo = 1) como publicados. Se puede repetir: no duplica nada.
//   npm run d1:local -- ruta          Muestra el archivo de la base local.
//   npm run d1:local -- <comando…>    Cualquier comando de `npm run eventos` (importar, pendientes, ver, resolver,
//                                     aprobar, publicar…) pero sobre la base que lee el sitio, no sobre registros/.
//
// Los eventos de ejemplo pasan por las mismas compuertas que cualquier otro (entran pendientes y se aprueban y
// publican con nombre). Quien los aprueba es la etiqueta de la carga de ejemplo: son los datos que el sitio ya
// mostraba. Un evento real (de Gemini o de una persona) lo aprueba una persona con `aprobar --por "Nombre"`.
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import { abrirSqlite } from '../imagenes/almacenes.mjs';
import { eventos } from '../../src/data/eventos.ts';
import { categoriaDesdeV1 } from '../../src/data/categorias-oficiales.ts';
import { slug } from '../../src/lib/formato.ts';

const raiz = process.cwd();
const carpeta = join(raiz, '.wrangler', 'state', 'v3', 'd1', 'miniflare-D1DatabaseObject');
const APROBADO_POR = 'Carga de ejemplo local (src/data/eventos.ts)';

// Municipio DIVIPOLA de cada ciudad del sitio
const MUNICIPIOS = {
  bogota: '11001', medellin: '05001', cali: '76001', barranquilla: '08001', cartagena: '13001', santamarta: '47001',
  bucaramanga: '68001', pereira: '66001', villavicencio: '50001', pasto: '52001', leticia: '91001',
};

const wrangler = (...args) => {
  const require = createRequire(import.meta.url);
  const bin = join(require.resolve('wrangler/package.json'), '..', 'bin', 'wrangler.js');
  return execFileSync(process.execPath, [bin, ...args], { cwd: raiz, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
};

// El archivo de la base: miniflare lo crea la primera vez que alguien usa el binding
const rutaBase = () => {
  const buscar = () =>
    existsSync(carpeta)
      ? readdirSync(carpeta)
          .filter((f) => f.endsWith('.sqlite') && f !== 'metadata.sqlite')
          .map((f) => join(carpeta, f))
          .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs)
      : [];
  if (!buscar().length) wrangler('d1', 'execute', 'fulleventos', '--local', '-c', 'wrangler.local.jsonc', '--command', 'SELECT 1');
  const [ruta] = buscar();
  if (!ruta) throw new Error('No se encontró la base D1 local en .wrangler/state');
  return ruta;
};

const preparar = async () => {
  const ruta = rutaBase();
  const db = await abrirSqlite(ruta); // aplica migraciones/ (idempotentes)
  const ahora = new Date().toISOString();
  let nuevos = 0;
  for (const e of eventos) {
    const [{ n } = { n: 0 }] = await db.consultar('SELECT COUNT(*) AS n FROM eventos WHERE id = ?', [e.id]);
    if (n) continue;
    const municipio = MUNICIPIOS[e.ciudad];
    await db.ejecutar(
      `INSERT INTO eventos (id, ref_externa, slug, titulo, categoria, categoria_origen, resumen, fecha, estado_fecha,
         municipio_codigo, departamento_codigo, ciudad_sitio, lugar, tipo_precio, precio_desde, demo, bg1, bg2, procedencia)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'confirmada', ?, ?, ?, ?, ?, ?, 1, ?, ?, ?)`,
      [
        e.id, `demo:${e.id}`, slug(e.titulo), e.titulo, categoriaDesdeV1[e.categoria] ?? null, e.categoria, e.resumen ?? null,
        e.fecha, municipio, municipio.slice(0, 2), e.ciudad, e.lugar, e.precio ? 'pago' : 'gratis', e.precio || null,
        e.bg1, e.bg2, JSON.stringify({ formato: 'eventos-de-ejemplo', archivo: 'src/data/eventos.ts', id: e.id }),
      ],
    );
    const motivo = 'Evento de ejemplo que el sitio ya mostraba (demo = 1)';
    await db.ejecutar(
      `UPDATE eventos SET estado = 'aprobado', aprobado_por = ?, aprobado_en = ?, revisado_por = ?, motivo_estado = ? WHERE id = ?`,
      [APROBADO_POR, ahora, APROBADO_POR, motivo, e.id],
    );
    await db.ejecutar(`UPDATE eventos SET estado = 'publicado', publicado_en = ?, revisado_por = ? WHERE id = ?`, [ahora, APROBADO_POR, e.id]);
    nuevos++;
  }
  const [{ publicados }] = await db.consultar(`SELECT COUNT(*) AS publicados FROM eventos WHERE estado = 'publicado'`);
  const [{ pendientes }] = await db.consultar(`SELECT COUNT(*) AS pendientes FROM eventos WHERE estado = 'pendiente_revision'`);
  db.cerrar();
  console.log(`Base D1 local: ${ruta}`);
  console.log(`Eventos de ejemplo cargados ahora: ${nuevos} · publicados: ${publicados} · pendientes de revisión: ${pendientes}`);
  console.log('Para ver el sitio leyendo esta base: npm run dev:d1 (o npm run build:d1 y npm run preview:d1)');
};

const [comando, ...resto] = process.argv.slice(2);
if (comando === 'preparar') await preparar();
else if (comando === 'ruta') console.log(rutaBase());
else {
  // Los comandos de revisión, sobre la base que lee el sitio
  const r = spawnSync(process.execPath, [join(raiz, 'scripts', 'eventos', 'cli.mjs'), ...(comando ? [comando] : []), ...resto], {
    stdio: 'inherit',
    env: { ...process.env, EVENTOS_SQLITE_LOCAL: rutaBase() },
  });
  process.exit(r.status ?? 1);
}
