#!/usr/bin/env node
// Base D1 LOCAL del sitio (etapa B, docs/etapa-b-eventos-d1.md). Nada de esto toca Cloudflare: la base es el archivo
// SQLite que wrangler/miniflare guarda en .wrangler/state y que el sitio lee con EVENTOS_D1=local.
//
//   npm run d1:local -- preparar          Crea la base local, aplica las migraciones y carga los 19 eventos de
//                                         ejemplo (demo = 1) como publicados. Se puede repetir: no duplica nada.
//   npm run d1:local -- ruta              Muestra el archivo de la base local.
//   npm run d1:local -- fotos-de-prueba   B3: fotos de demostración (generadas aquí) para e1, e3 y e12, por el
//                                         importador de imágenes en modo local: entran pendientes, una persona de
//                                         la demo las aprueba y quedan en registros/r2-local.
//   npm run d1:local -- servir-fotos      Sirve registros/r2-local en http://localhost:4580 (el "bucket" local).
//                                         Compila con PUBLIC_IMAGENES_URL=http://localhost:4580 para verlas.
//   npm run d1:local -- imagenes <…>      Cualquier comando de `npm run imagenes` en modo --local sobre esta base.
//   npm run d1:local -- <comando…>        Cualquier comando de `npm run eventos` (importar, pendientes, ver, resolver,
//                                         aprobar, publicar…) pero sobre la base que lee el sitio, no sobre registros/.
//
// Con EVENTOS_D1_ESTADO=<carpeta> todo trabaja sobre otra base (la de `npm run test:d1`). Solo ahí funciona
//   npm run d1:local -- sembrar-pruebas   30 eventos de prueba publicados, para probar la paginación y los filtros.
//
// Los eventos de ejemplo pasan por las mismas compuertas que cualquier otro (entran pendientes y se aprueban y
// publican con nombre). Quien los aprueba es la etiqueta de la carga de ejemplo: son los datos que el sitio ya
// mostraba. Un evento real (de Gemini o de una persona) lo aprueba una persona con `aprobar --por "Nombre"`.
import http from 'node:http';
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';
import { createRequire } from 'node:module';
import { abrirSqlite, crearAlmacenLocal } from '../imagenes/almacenes.mjs';
import { eventos } from '../../src/data/eventos.ts';
import { categoriaDesdeV1 } from '../../src/data/categorias-oficiales.ts';
import { slug } from '../../src/lib/formato.ts';

const raiz = process.cwd();
const estado = process.env.EVENTOS_D1_ESTADO ? resolve(raiz, process.env.EVENTOS_D1_ESTADO) : null;
const carpeta = join(estado ?? join(raiz, '.wrangler', 'state'), 'v3', 'd1', 'miniflare-D1DatabaseObject');
const APROBADO_POR = 'Carga de ejemplo local (src/data/eventos.ts)';
const PUERTO_FOTOS = 4580;

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
  if (!buscar().length) {
    const otra = estado ? ['--persist-to', estado] : [];
    wrangler('d1', 'execute', 'fulleventos', '--local', '-c', 'wrangler.local.jsonc', ...otra, '--command', 'SELECT 1');
  }
  const [ruta] = buscar();
  if (!ruta) throw new Error('No se encontró la base D1 local en .wrangler/state');
  return ruta;
};

// Un evento entra pendiente y pasa por las compuertas de la base hasta publicado (las mismas de cualquier evento)
const cargarPublicado = async (db, fila, por, motivo) => {
  const columnas = Object.keys(fila);
  await db.ejecutar(
    `INSERT INTO eventos (${columnas.join(', ')}) VALUES (${columnas.map(() => '?').join(', ')})`,
    columnas.map((c) => fila[c]),
  );
  const ahora = new Date().toISOString();
  await db.ejecutar(
    `UPDATE eventos SET estado = 'aprobado', aprobado_por = ?, aprobado_en = ?, revisado_por = ?, motivo_estado = ? WHERE id = ?`,
    [por, ahora, por, motivo, fila.id],
  );
  await db.ejecutar(`UPDATE eventos SET estado = 'publicado', publicado_en = ?, revisado_por = ? WHERE id = ?`, [ahora, por, fila.id]);
};

const resumen = async (db, ruta) => {
  const [{ publicados }] = await db.consultar(`SELECT COUNT(*) AS publicados FROM eventos WHERE estado = 'publicado'`);
  const [{ pendientes }] = await db.consultar(`SELECT COUNT(*) AS pendientes FROM eventos WHERE estado = 'pendiente_revision'`);
  const [{ fotos }] = await db.consultar(`SELECT COUNT(*) AS fotos FROM imagenes_evento WHERE estado = 'publicada'`);
  console.log(`Base D1 local: ${ruta}`);
  console.log(`Publicados: ${publicados} · pendientes de revisión: ${pendientes} · fotos publicadas: ${fotos}`);
};

const preparar = async () => {
  const ruta = rutaBase();
  const db = await abrirSqlite(ruta); // aplica migraciones/ (idempotentes)
  let nuevos = 0;
  for (const e of eventos) {
    const [{ n } = { n: 0 }] = await db.consultar('SELECT COUNT(*) AS n FROM eventos WHERE id = ?', [e.id]);
    if (n) continue;
    const municipio = MUNICIPIOS[e.ciudad];
    await cargarPublicado(
      db,
      {
        id: e.id, ref_externa: `demo:${e.id}`, slug: slug(e.titulo), titulo: e.titulo, categoria: categoriaDesdeV1[e.categoria] ?? null,
        categoria_origen: e.categoria, resumen: e.resumen ?? null, fecha: e.fecha, estado_fecha: 'confirmada',
        municipio_codigo: municipio, departamento_codigo: municipio.slice(0, 2), ciudad_sitio: e.ciudad, lugar: e.lugar,
        tipo_precio: e.precio ? 'pago' : 'gratis', precio_desde: e.precio || null, demo: 1, bg1: e.bg1, bg2: e.bg2,
        procedencia: JSON.stringify({ formato: 'eventos-de-ejemplo', archivo: 'src/data/eventos.ts', id: e.id }),
      },
      APROBADO_POR,
      'Evento de ejemplo que el sitio ya mostraba (demo = 1)',
    );
    nuevos++;
  }
  console.log(`Eventos de ejemplo cargados ahora: ${nuevos}`);
  await resumen(db, ruta);
  db.cerrar();
  console.log('Para ver el sitio leyendo esta base: npm run dev:d1 (o npm run build:d1 y npm run preview:d1)');
};

// Solo en una base aparte (EVENTOS_D1_ESTADO): eventos de prueba para la paginación (más de 24 en un filtro), en
// ciudades del sitio y en un municipio que no lo es (Manizales). Nunca en la base con la que trabajas.
const sembrarPruebas = async () => {
  if (!estado) throw new Error('sembrar-pruebas solo funciona con EVENTOS_D1_ESTADO (la base de npm run test:d1)');
  const ruta = rutaBase();
  const db = await abrirSqlite(ruta);
  const POR = 'Datos de prueba automática (tests/d1.spec.ts)';
  const lugares = [
    { ciudad: 'bogota', municipio: '11001', lugar: 'Parque de prueba' },
    { ciudad: null, municipio: '17001', lugar: 'Plaza de prueba' },
  ];
  let nuevos = 0;
  for (let i = 1; i <= 30; i++) {
    const id = `ev_prueba${String(i).padStart(4, '0')}`;
    const [{ n } = { n: 0 }] = await db.consultar('SELECT COUNT(*) AS n FROM eventos WHERE id = ?', [id]);
    if (n) continue;
    const l = lugares[i % 2];
    const titulo = `Plan de prueba ${i}`;
    await cargarPublicado(
      db,
      {
        id, ref_externa: `prueba:${i}`, slug: slug(titulo), titulo, categoria: i % 3 ? 'deportes' : 'mascotas',
        resumen: 'Evento de prueba automática: solo existe en la base de las pruebas.', fecha: `2026-10-${String(9 + (i % 4)).padStart(2, '0')}`,
        estado_fecha: 'confirmada', municipio_codigo: l.municipio, departamento_codigo: l.municipio.slice(0, 2), ciudad_sitio: l.ciudad,
        lugar: l.lugar, tipo_precio: i % 5 ? 'pago' : 'gratis', precio_desde: i % 5 ? 10000 : null,
        procedencia: JSON.stringify({ formato: 'prueba-automatica', archivo: 'scripts/eventos/d1-local.mjs' }),
      },
      POR,
      'Evento de prueba automática en la base aparte de las pruebas',
    );
    nuevos++;
  }
  // Y uno que se queda pendiente: las pruebas revisan que nunca aparezca
  const [{ n: hayPendiente } = { n: 0 }] = await db.consultar(`SELECT COUNT(*) AS n FROM eventos WHERE id = 'ev_pendiente01'`);
  if (!hayPendiente) {
    await db.ejecutar(
      `INSERT INTO eventos (id, ref_externa, slug, titulo, categoria, fecha, municipio_codigo, departamento_codigo, ciudad_sitio,
         lugar, tipo_precio, procedencia) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ['ev_pendiente01', 'prueba:pendiente', 'plan-pendiente-sin-revisar', 'Plan pendiente sin revisar', 'deportes', '2026-10-10',
        '11001', '11', 'bogota', 'Lugar pendiente', 'gratis', JSON.stringify({ formato: 'prueba-automatica' })],
    );
  }
  console.log(`Eventos de prueba cargados ahora: ${nuevos} (y uno pendiente que no se debe ver)`);
  await resumen(db, ruta);
  db.cerrar();
};

const servir = (carpetaServida, puerto, { cors = false } = {}) =>
  new Promise((ok) => {
    const tipos = { '.json': 'application/json', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png' };
    const s = http.createServer((req, res) => {
      const ruta = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      const archivo = normalize(join(carpetaServida, ruta));
      if (!archivo.startsWith(carpetaServida)) return res.writeHead(403).end();
      if (!existsSync(archivo) || statSync(archivo).isDirectory()) return res.writeHead(404).end('no existe');
      res.writeHead(200, { 'content-type': tipos[extname(archivo)] ?? 'application/octet-stream', ...(cors ? { 'access-control-allow-origin': '*' } : {}) });
      res.end(readFileSync(archivo));
    });
    s.listen(puerto, '127.0.0.1', () => ok(s));
  });

// Fotos de demostración por el camino real del importador (modo local): Gemini → adaptar → importar (pendientes) →
// aprobar como persona → variantes en el bucket local. La "fuente oficial" es un servidor en localhost, que solo
// admite la política de esta demo (la de producción exige https y dominios permitidos).
const fotosDePrueba = async () => {
  const [{ default: sharp }, { adaptar }, { aprobar, importar, pendientes }, { cargarEventos, crearCatalogo }, { POLITICA_BASE }] =
    await Promise.all([
      import('sharp'),
      import('../imagenes/adaptar.mjs'),
      import('../imagenes/importador.mjs'),
      import('../imagenes/catalogo.mjs'),
      import('../imagenes/politica.mjs'),
    ]);
  const PUERTO_FUENTE = 4581;
  const politica = Object.freeze({ ...POLITICA_BASE, protocolos: ['http:'], dominiosPermitidos: ['localhost'], permitirIpPrivadas: true });
  const fotos = {
    e3: ['rock', 'Rock en el Movistar Arena', 'bogota-2026-10-10-rock-en-el-movistar-arena', 'Bogotá', '2026-10-10', 10],
    e12: ['vallenato', 'Vallenato en el Gran Malecón', 'barranquilla-2026-10-10-vallenato-en-el-gran-malecon', 'Barranquilla', '2026-10-10', 120],
    e1: ['salsa', 'Noche de salsa y boleros en vivo', 'bogota-2026-10-09-noche-de-salsa-y-boleros-en-vivo', 'Bogotá', '2026-10-09', 30],
  };
  const imagenes = {};
  for (const [nombre, titulo, , , , h] of Object.values(fotos)) {
    imagenes[`/${nombre}.jpg`] = await sharp(
      Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="2000">
        <defs><radialGradient id="g" cx="45%" cy="30%"><stop offset="0" stop-color="hsl(${h},85%,65%)"/><stop offset="1" stop-color="hsl(${h + 50},55%,18%)"/></radialGradient></defs>
        <rect width="100%" height="100%" fill="url(#g)"/>
        <text x="80" y="200" font-family="sans-serif" font-size="110" font-weight="700" fill="#fff" opacity=".9">DEMO</text>
        <text x="80" y="300" font-family="sans-serif" font-size="56" fill="#fff" opacity=".85">${titulo}</text>
      </svg>`),
    )
      .jpeg({ quality: 85 })
      .toBuffer();
  }
  const fuente = await new Promise((ok) => {
    const s = http.createServer((req, res) => {
      const archivo = imagenes[new URL(req.url, 'http://x').pathname];
      if (!archivo) return res.writeHead(404).end();
      res.writeHead(200, { 'content-type': 'image/jpeg' }).end(archivo);
    });
    s.listen(PUERTO_FUENTE, '127.0.0.1', () => ok(s));
  });
  try {
    const prensa = `http://localhost:${PUERTO_FUENTE}/prensa`;
    const fuentes = [{ nombre: 'Fuente oficial de demostración', url: prensa, oficial: true }];
    const gemini = Object.entries(fotos)
      .map(([id, [nombre, titulo, ref, ciudad, fecha]]) =>
        JSON.stringify({
          formato: 'fulleventos-eventos-imagenes/1',
          ref,
          evento: { id, titulo, ciudad, fecha, fuentes },
          imagenes: [
            {
              url: `http://localhost:${PUERTO_FUENTE}/${nombre}.jpg`,
              pagina: prensa,
              texto_alternativo: `Imagen de demostración para ${titulo}`,
              credito: 'Imagen de demostración generada localmente',
              fuente: fuentes[0],
              derechos: {
                estado: 'confirmado',
                licencia: 'Imagen propia de demostración',
                evidencias: [{ texto: 'Generada por scripts/eventos/d1-local.mjs (fotos-de-prueba)' }],
                verificado_en: new Date().toISOString().slice(0, 10),
              },
            },
          ],
        }),
      )
      .join('\n');
    const { ciudades } = await import('../../src/data/ciudades.ts');
    const lista = await cargarEventos();
    const a = adaptar({ contenido: gemini, archivo: 'fotos-de-prueba.jsonl', eventos: lista, ciudades });
    // Modo local del importador (el mismo de `npm run imagenes -- --local`), sobre la base que lee el sitio
    process.env.EVENTOS_SQLITE_LOCAL = rutaBase();
    // Con la base de las pruebas (EVENTOS_D1_ESTADO), también el bucket queda aparte
    const almacen = await crearAlmacenLocal(raiz, estado ? join(estado, 'registros') : undefined);
    const urlPublica = `http://localhost:${PUERTO_FOTOS}`;
    const r = await importar({ contenido: a.imagenesJsonl, almacen, catalogo: crearCatalogo(lista), politica, urlPublica });
    console.log(`Importadas: ${r.pendientes} pendientes de revisión · ${r.duplicadas ?? 0} ya estaban`);
    const ids = (await pendientes(almacen)).map((f) => f.id);
    const ap = ids.length ? await aprobar({ ids, por: 'Demostración local', almacen, politica, urlPublica }) : [];
    console.log(`Aprobadas por "Demostración local" y publicadas: ${ap.filter((x) => x.resultado === 'publicada').length}`);
    console.log(`Bucket local: ${almacen.r2.carpeta}`);
    await resumen(almacen.db, process.env.EVENTOS_SQLITE_LOCAL);
    almacen.db.cerrar();
    console.log(`Para verlas: npm run d1:local -- servir-fotos y, en otra terminal, PUBLIC_IMAGENES_URL=${urlPublica} npm run dev:d1`);
  } finally {
    fuente.close();
  }
};

const [comando, ...resto] = process.argv.slice(2);
if (comando === 'preparar') await preparar();
else if (comando === 'ruta') console.log(rutaBase());
else if (comando === 'sembrar-pruebas') await sembrarPruebas();
else if (comando === 'fotos-de-prueba') await fotosDePrueba();
else if (comando === 'servir-fotos') {
  await servir(join(estado ? join(estado, 'registros') : join(raiz, 'registros'), 'r2-local'), PUERTO_FOTOS, { cors: true });
  console.log(`Bucket local en http://localhost:${PUERTO_FOTOS} (Ctrl+C para terminar)`);
} else {
  // Los comandos de revisión (o los de imágenes, en modo --local), sobre la base que lee el sitio
  const imagenes = comando === 'imagenes';
  const cli = join(raiz, 'scripts', imagenes ? 'imagenes' : 'eventos', 'cli.mjs');
  const args = imagenes ? [...resto, '--local'] : [...(comando ? [comando] : []), ...resto];
  const r = spawnSync(process.execPath, [cli, ...args], { stdio: 'inherit', env: { ...process.env, EVENTOS_SQLITE_LOCAL: rutaBase() } });
  process.exit(r.status ?? 1);
}
