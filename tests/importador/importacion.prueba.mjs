// Flujo completo del importador con un "bucket" y una base en memoria (sin Cloudflare).
import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { importar, aprobar, retirar, construirIndice } from '../../scripts/imagenes/importador.mjs';
import { crearAlmacenCloudflare } from '../../scripts/imagenes/almacenes.mjs';
import { almacenPrueba, catalogoPrueba, imagen, jsonl, politicaPrueba, registro, servidor } from './ayudas.mjs';

let srv;
const fotos = {};
before(async () => {
  fotos.rock = await imagen(2000, 1300, { r: 200, g: 30, b: 30 });
  fotos.rock2 = await imagen(1800, 1200, { r: 30, g: 30, b: 200 });
  fotos.playa = await imagen(1200, 900, { r: 250, g: 180, b: 90 }, 'png');
  fotos.salsa = await imagen(1000, 800, { r: 20, g: 160, b: 90 }, 'webp');
  srv = await servidor({
    '/img/rock.jpg': { cuerpo: fotos.rock },
    '/img/rock-copia.jpg': { cuerpo: fotos.rock },
    '/img/rock-nueva.jpg': { cuerpo: fotos.rock2 },
    '/img/playa.png': { cuerpo: fotos.playa, tipo: 'image/png' },
    '/img/salsa.webp': { cuerpo: fotos.salsa, tipo: 'image/webp' },
    '/img/falsa.jpg': { cuerpo: Buffer.from('<html>no soy una foto</html>'), tipo: 'image/jpeg' },
  });
});
after(() => srv.cerrar());

const contar = async (almacen, donde = '1 = 1') =>
  (await almacen.db.consultar(`SELECT COUNT(*) AS n FROM imagenes_evento WHERE ${donde}`))[0].n;

const correr = async (almacen, contenido, extra = {}) =>
  importar({ contenido, almacen, catalogo: catalogoPrueba(), politica: politicaPrueba(), urlPublica: 'https://imagenes.ejemplo', ...extra });

describe('Importación', () => {
  test('publica una imagen válida: R2 (3 variantes + índice) y D1 con todos los datos', async () => {
    const almacen = await almacenPrueba();
    const r = await correr(almacen, jsonl(registro(srv.base)));
    assert.equal(r.publicadas, 1, JSON.stringify(r.detalles));
    const claves = [...almacen.r2.objetos.keys()].sort();
    assert.equal(claves.length, 4);
    assert.ok(claves.includes('indice/eventos-v1.json'));
    assert.ok(claves.every((c) => c === 'indice/eventos-v1.json' || /^eventos\/e3\/[a-f0-9]{16}-(480|960|1600)\.webp$/.test(c)));
    assert.equal(almacen.r2.objetos.get(claves[0]).cache, 'public, max-age=31536000, immutable');

    const [f] = await almacen.db.consultar('SELECT * FROM imagenes_evento');
    assert.equal(f.evento_id, 'e3');
    assert.equal(f.estado, 'publicada');
    assert.equal(f.fuente_nombre, 'Movistar Arena');
    assert.equal(f.derechos_estado, 'confirmado');
    assert.equal(f.verificado_en, '2026-10-01');
    assert.equal(f.formato_original, 'jpeg');
    assert.equal(f.ancho, 1600);
    assert.match(f.url_publica, /^https:\/\/imagenes\.ejemplo\/eventos\/e3\/[a-f0-9]{16}-1600\.webp$/);
    assert.equal(f.placeholder, '#D9452F #2B0F12');

    const indice = JSON.parse(almacen.r2.objetos.get('indice/eventos-v1.json').buffer);
    assert.equal(indice.version, 1);
    assert.deepEqual(Object.keys(indice.eventos), ['e3']);
    assert.equal(indice.eventos.e3.alt, 'Escenario del Movistar Arena con luces rojas');
    assert.equal(almacen.r2.objetos.get('indice/eventos-v1.json').cache, 'public, max-age=300');
  });

  test('es idempotente: repetir el mismo archivo no duplica filas, objetos ni descargas', async () => {
    const almacen = await almacenPrueba();
    const archivo = jsonl(
      registro(srv.base),
      registro(srv.base, { evento: { ciudad: 'Santa Marta', slug: 'atardecer-electronico-en-la-playa' }, imagen: { url: `${srv.base}/img/playa.png`, texto_alternativo: 'Atardecer en la playa El Rodadero' } }),
      registro(srv.base, { evento: { id: 'e1' }, derechos: { estado: 'pendiente' } }),
    );
    const primera = await correr(almacen, archivo);
    assert.equal(primera.publicadas, 2);
    assert.equal(primera.pendientes, 1);
    const filas = await contar(almacen);
    const objetos = almacen.r2.objetos.size;
    const descargas = srv.visitas.get('/img/rock.jpg');

    const segunda = await correr(almacen, archivo);
    assert.equal(segunda.publicadas, 0);
    assert.equal(segunda.duplicadas, 3);
    assert.equal(await contar(almacen), filas);
    assert.equal(almacen.r2.objetos.size, objetos);
    assert.equal(srv.visitas.get('/img/rock.jpg'), descargas);
  });

  test('derechos sin confirmar o confirmados solo por el agente: pendiente y sin descargar', async () => {
    const almacen = await almacenPrueba();
    const antes = srv.visitas.get('/img/salsa.webp') ?? 0;
    const r = await correr(
      almacen,
      jsonl(
        registro(srv.base, { evento: { id: 'e1' }, imagen: { url: `${srv.base}/img/salsa.webp` }, derechos: { verificado_por: 'agente' } }),
        registro(srv.base, { evento: { id: 'e1' }, imagen: { url: `${srv.base}/img/salsa.webp?v=2` }, derechos: { estado: 'desconocido' } }),
        registro(srv.base, { evento: { id: 'e1' }, imagen: { url: `${srv.base}/img/salsa.webp?v=3` }, fuente: { oficial: false } }),
        registro(srv.base, { evento: { id: 'e1' }, imagen: { url: `${srv.base}/img/salsa.webp?v=4` }, derechos: { licencia: undefined } }),
      ),
      { politica: politicaPrueba({ exigirRevisionHumana: true }) },
    );
    assert.equal(r.pendientes, 4, JSON.stringify(r.detalles));
    assert.equal(srv.visitas.get('/img/salsa.webp') ?? 0, antes);
    assert.equal(almacen.r2.objetos.size, 0);
    assert.equal(await contar(almacen, "estado = 'pendiente_revision'"), 4);
  });

  test('derechos rechazados: se registra como rechazada y no se descarga', async () => {
    const almacen = await almacenPrueba();
    const r = await correr(almacen, jsonl(registro(srv.base, { derechos: { estado: 'rechazado' } })));
    assert.equal(r.rechazadas, 1);
    assert.equal(almacen.r2.objetos.size, 0);
  });

  test('errores por registro no detienen la importación', async () => {
    const almacen = await almacenPrueba();
    const r = await correr(
      almacen,
      jsonl(
        '{esto no es json',
        { evento: { id: 'e3' }, imagen: { url: 'ftp://x' } },
        registro(srv.base, { evento: { id: 'e999' } }),
        registro(srv.base, { evento: { titulo: 'Rock en el Movistar Arena', fecha: '2026-12-31' } }),
        registro(srv.base, { imagen: { url: `${srv.base}/img/falsa.jpg` } }),
        registro(srv.base, { imagen: { url: `${srv.base}/img/no-existe.jpg` } }),
        registro(srv.base, { imagen: { url: 'http://127.0.0.2/interno.jpg' } }),
        registro(srv.base),
      ),
      { politica: politicaPrueba({ dominiosPermitidos: ['localhost'] }) },
    );
    const codigos = r.detalles.map((d) => d.codigo ?? d.resultado);
    assert.deepEqual(codigos, ['json_invalido', 'esquema_invalido', 'evento_no_encontrado', 'evento_no_encontrado', 'archivo_invalido', 'descarga_fallida', 'url_no_permitida', 'publicada']);
    assert.equal(r.publicadas, 1);
    const errores = await almacen.db.consultar('SELECT codigo FROM importaciones_errores');
    assert.equal(errores.length, 7);
    const [imp] = await almacen.db.consultar('SELECT * FROM importaciones');
    assert.equal(imp.total, 8);
    assert.ok(imp.terminada_en);
  });

  test('una descarga fallida se reintenta en la siguiente importación', async () => {
    const almacen = await almacenPrueba();
    let caida = true;
    const s2 = await servidor({ '/a.jpg': (_q, res) => (caida ? res.writeHead(503).end() : res.writeHead(200, { 'content-type': 'image/jpeg' }).end(fotos.rock)) });
    try {
      const archivo = jsonl(registro(s2.base));
      assert.equal((await correr(almacen, archivo.replace('/img/rock.jpg', '/a.jpg'))).errores, 1);
      caida = false;
      assert.equal((await correr(almacen, archivo.replace('/img/rock.jpg', '/a.jpg'))).publicadas, 1);
      assert.equal(await contar(almacen), 1);
    } finally {
      await s2.cerrar();
    }
  });

  test('no reemplaza la foto publicada sin motivo; con reemplazar + motivo sí', async () => {
    const almacen = await almacenPrueba();
    await correr(almacen, jsonl(registro(srv.base)));
    const v1 = (await construirIndice(almacen.db)).eventos.e3.v;

    const sinMotivo = await correr(almacen, jsonl(registro(srv.base, { imagen: { url: `${srv.base}/img/rock-nueva.jpg` } })));
    assert.equal(sinMotivo.listas, 1);
    assert.equal((await construirIndice(almacen.db)).eventos.e3.v, v1);

    const invalido = await correr(almacen, jsonl(registro(srv.base, { imagen: { url: `${srv.base}/img/rock-nueva.jpg?b` }, reemplazar: true })));
    assert.equal(invalido.rechazadas, 1, 'reemplazar sin motivo no pasa el esquema');

    // La "lista" anterior ya existe; se pide reemplazar desde otra URL con el mismo archivo → duplicado
    const dup = await correr(almacen, jsonl(registro(srv.base, { imagen: { url: `${srv.base}/img/rock-copia.jpg` }, reemplazar: true, motivo_reemplazo: 'El organizador publicó el afiche final' })));
    assert.equal(dup.duplicadas, 1);

    const nueva = await imagen(1700, 1100, { r: 90, g: 200, b: 90 });
    const s2 = await servidor({ '/final.jpg': { cuerpo: nueva } });
    try {
      const r = await correr(almacen, jsonl(registro(s2.base, { reemplazar: true, motivo_reemplazo: 'El organizador publicó el afiche final', imagen: { url: `${s2.base}/final.jpg` } })));
      assert.equal(r.publicadas, 1, JSON.stringify(r.detalles));
    } finally {
      await s2.cerrar();
    }
    const v3 = (await construirIndice(almacen.db)).eventos.e3.v;
    assert.notEqual(v3, v1);
    assert.equal(await contar(almacen, "evento_id = 'e3' AND estado = 'publicada'"), 1);
    // La foto anterior sigue en R2 (las URL viejas en caché no se rompen)
    assert.ok([...almacen.r2.objetos.keys()].some((k) => k.includes(v1)));
  });

  test('el mismo archivo desde otra URL es duplicado', async () => {
    const almacen = await almacenPrueba();
    await correr(almacen, jsonl(registro(srv.base)));
    const r = await correr(almacen, jsonl(registro(srv.base, { imagen: { url: `${srv.base}/img/rock-copia.jpg` } })));
    assert.equal(r.duplicadas, 1);
    assert.equal(await contar(almacen, "estado = 'publicada'"), 1);
  });

  test('aprobar una pendiente la descarga y publica; retirar la quita del índice', async () => {
    const almacen = await almacenPrueba();
    const humana = politicaPrueba({ exigirRevisionHumana: true });
    await correr(almacen, jsonl(registro(srv.base)), { politica: humana });
    const [p] = await almacen.db.consultar("SELECT id FROM imagenes_evento WHERE estado = 'pendiente_revision'");
    await assert.rejects(aprobar({ ids: [p.id], almacen, politica: politicaPrueba() }), /Indica quién aprueba/);
    await assert.rejects(aprobar({ ids: [p.id], por: 'Ana', reemplazar: true, almacen, politica: humana }), /motivo/);
    const [a] = await aprobar({ ids: [p.id], por: 'Óscar Fabián', almacen, politica: humana });
    assert.equal(a.resultado, 'publicada', a.mensaje);
    const [f] = await almacen.db.consultar('SELECT verificado_por, derechos_evidencia FROM imagenes_evento WHERE id = ?', [p.id]);
    assert.equal(f.verificado_por, 'persona');
    assert.match(f.derechos_evidencia, /Aprobada por Óscar Fabián/);
    assert.ok((await construirIndice(almacen.db)).eventos.e3);

    assert.equal(await retirar({ eventoId: 'e3', motivo: 'El organizador pidió quitarla', almacen, politica: politicaPrueba() }), p.id);
    const indice = JSON.parse(almacen.r2.objetos.get('indice/eventos-v1.json').buffer);
    assert.deepEqual(indice.eventos, {});
  });

  test('simular no descarga ni guarda nada', async () => {
    const almacen = await almacenPrueba();
    const antes = srv.visitas.get('/img/rock.jpg') ?? 0;
    const r = await correr(almacen, jsonl(registro(srv.base), registro(srv.base, { derechos: { estado: 'pendiente' } })), { simular: true });
    assert.equal(r.simuladas, 1);
    assert.equal(r.pendientes, 1);
    assert.equal(await contar(almacen), 0);
    assert.equal(srv.visitas.get('/img/rock.jpg') ?? 0, antes);
  });

  test('límite de registros por ejecución', async () => {
    const almacen = await almacenPrueba();
    const r = await correr(almacen, jsonl(registro(srv.base, { derechos: { estado: 'pendiente' } }), registro(srv.base, { evento: { id: 'e1' }, derechos: { estado: 'pendiente' } })), {
      politica: politicaPrueba({ maxRegistros: 1 }),
    });
    assert.equal(r.pendientes, 1);
    assert.equal(r.detalles[1].codigo, 'limite');
  });

  test('acepta JSON con lista o con { "imagenes": [...] }', async () => {
    const almacen = await almacenPrueba();
    const a = await correr(almacen, JSON.stringify([registro(srv.base, { derechos: { estado: 'pendiente' } })]));
    const b = await correr(almacen, JSON.stringify({ imagenes: [registro(srv.base, { evento: { id: 'e1' }, derechos: { estado: 'pendiente' } })] }));
    assert.equal(a.pendientes + b.pendientes, 2);
  });
});


describe('Revisión humana y casos de la auditoría', () => {
  test('el archivo no puede declararse revisado por una persona', async () => {
    const almacen = await almacenPrueba();
    const r = await correr(almacen, jsonl(registro(srv.base)), { politica: politicaPrueba({ exigirRevisionHumana: true }) });
    assert.equal(r.pendientes, 1, JSON.stringify(r.detalles));
    assert.equal(almacen.r2.objetos.size, 0);
    const [f] = await almacen.db.consultar('SELECT verificado_por FROM imagenes_evento');
    assert.equal(f.verificado_por, 'agente');
  });

  test('reimportar no deshace una aprobación humana cuya descarga falló', async () => {
    const almacen = await almacenPrueba();
    const humana = politicaPrueba({ exigirRevisionHumana: true });
    let caida = true;
    const s2 = await servidor({ '/a.jpg': (_q, res) => (caida ? res.writeHead(503).end() : res.writeHead(200, { 'content-type': 'image/jpeg' }).end(fotos.rock)) });
    try {
      const archivo = jsonl(registro(s2.base, { imagen: { url: `${s2.base}/a.jpg` } }));
      await correr(almacen, archivo, { politica: humana });
      const [p] = await almacen.db.consultar('SELECT id FROM imagenes_evento');
      const [a] = await aprobar({ ids: [p.id], por: 'Ana', almacen, politica: humana });
      assert.equal(a.resultado, 'error');
      caida = false;
      const r = await correr(almacen, archivo, { politica: humana });
      assert.equal(r.publicadas, 1, JSON.stringify(r.detalles));
      const [f] = await almacen.db.consultar('SELECT verificado_por, derechos_evidencia FROM imagenes_evento');
      assert.equal(f.verificado_por, 'persona');
      assert.match(f.derechos_evidencia, /Aprobada por Ana/);
    } finally {
      await s2.cerrar();
    }
  });

  test('una imagen "lista" se publica con reemplazar + motivo, sin volver a descargarla', async () => {
    const almacen = await almacenPrueba();
    await correr(almacen, jsonl(registro(srv.base)));
    const nueva = registro(srv.base, { imagen: { url: `${srv.base}/img/rock-nueva.jpg` } });
    assert.equal((await correr(almacen, jsonl(nueva))).listas, 1);
    const descargas = srv.visitas.get('/img/rock-nueva.jpg');
    const r = await correr(almacen, jsonl({ ...nueva, reemplazar: true, motivo_reemplazo: 'Afiche final del organizador' }));
    assert.equal(r.publicadas, 1, JSON.stringify(r.detalles));
    assert.equal(srv.visitas.get('/img/rock-nueva.jpg'), descargas);
    const [pub] = await almacen.db.consultar("SELECT url_origen FROM imagenes_evento WHERE estado = 'publicada'");
    assert.match(pub.url_origen, /rock-nueva/);
    const indice = JSON.parse(almacen.r2.objetos.get('indice/eventos-v1.json').buffer);
    assert.equal(Object.keys(indice.eventos).length, 1);
  });

  test('una redirección hacia un dominio no permitido no se vuelve a descargar en cada importación', async () => {
    const almacen = await almacenPrueba();
    const s2 = await servidor({ '/r.jpg': (_q, res) => res.writeHead(302, { location: 'http://otro-dominio.invalid/x.jpg' }).end() });
    try {
      const archivo = jsonl(registro(s2.base, { imagen: { url: `${s2.base}/r.jpg` } }));
      assert.equal((await correr(almacen, archivo)).rechazadas, 1);
      assert.equal((await correr(almacen, archivo)).duplicadas, 1);
      assert.equal(s2.visitas.get('/r.jpg'), 1);
    } finally {
      await s2.cerrar();
    }
  });
});

// ---------- Adaptador de Cloudflare con API y wrangler simulados ----------

// "D1" que responde como la API REST pero guarda en SQLite en memoria; falla las primeras `fallas` consultas
const d1Falso = async (fallas = 0) => {
  const local = await almacenPrueba();
  let n = 0;
  const llamadas = [];
  const fetchFn = async (url, op) => {
    llamadas.push({ url, auth: op.headers.authorization });
    const { sql: consulta } = JSON.parse(op.body);
    if (/^\s*select/i.test(consulta) && n++ < fallas) return new Response(JSON.stringify({ success: false, errors: [{ message: 'falla temporal' }] }), { status: 503 });
    const { sql, params } = JSON.parse(op.body);
    const esLectura = /^\s*select/i.test(sql);
    const r = esLectura ? { results: await local.db.consultar(sql, params), meta: {} } : await local.db.ejecutar(sql, params).then((x) => ({ results: [], meta: { changes: x.cambios, last_row_id: x.ultimoId } }));
    return new Response(JSON.stringify({ success: true, result: [r] }), { status: 200 });
  };
  return { fetchFn, llamadas, local };
};

const ENV = { CLOUDFLARE_ACCOUNT_ID: 'cuenta-de-prueba', CLOUDFLARE_API_TOKEN: 'token-de-prueba', D1_DATABASE_ID: 'base-de-prueba' };

describe('Adaptador de Cloudflare (simulado)', () => {
  test('sin variables de entorno no arranca', () => {
    assert.throws(() => crearAlmacenCloudflare({ env: {} }), (e) => e.codigo === 'configuracion');
  });

  test('fallas temporales de R2 y D1: reintenta y termina bien', async () => {
    const d1 = await d1Falso(1);
    const subidas = [];
    let fallasR2 = 2;
    const ejecutar = async (args, env) => {
      assert.equal(env.CLOUDFLARE_API_TOKEN, 'token-de-prueba');
      if (fallasR2-- > 0) throw new Error('R2 503 Service Unavailable');
      subidas.push(args);
    };
    const almacen = crearAlmacenCloudflare({ env: ENV, fetchFn: d1.fetchFn, ejecutar, baseMs: 1 });
    const r = await correr(almacen, jsonl(registro(srv.base)));
    assert.equal(r.publicadas, 1, JSON.stringify(r.detalles));
    assert.equal(subidas.length, 4);
    assert.deepEqual(subidas[0].slice(0, 4), ['r2', 'object', 'put', subidas[0][3]]);
    assert.ok(subidas[0][3].startsWith('fulleventos-imagenes/eventos/e3/'));
    assert.ok(subidas[0].includes('--remote'));
    assert.ok(d1.llamadas.every((l) => l.url.includes('/accounts/cuenta-de-prueba/d1/database/base-de-prueba/query')));
  });

  test('una escritura en D1 con 503 no se repite (podría haberse aplicado)', async () => {
    let escrituras = 0;
    const fetchFn = async (_u, op) => {
      if (!/^\s*select/i.test(JSON.parse(op.body).sql)) escrituras++;
      return new Response(JSON.stringify({ success: false, errors: [{ message: 'falla' }] }), { status: 503 });
    };
    const almacen = crearAlmacenCloudflare({ env: ENV, fetchFn, ejecutar: async () => {}, baseMs: 1 });
    await assert.rejects(almacen.db.ejecutar('INSERT INTO importaciones (id) VALUES (?)', ['x']));
    assert.equal(escrituras, 1);
  });

  test('R2 caído del todo: el registro queda en error, los demás siguen y no se publica nada roto', async () => {
    const d1 = await d1Falso();
    const ejecutar = async () => {
      throw new Error('R2 503 Service Unavailable');
    };
    const almacen = crearAlmacenCloudflare({ env: ENV, fetchFn: d1.fetchFn, ejecutar, baseMs: 1 });
    const r = await correr(
      almacen,
      jsonl(registro(srv.base), registro(srv.base, { evento: { id: 'e1' }, derechos: { estado: 'pendiente' } })),
    );
    assert.equal(r.errores, 1);
    assert.equal(r.pendientes, 1);
    assert.equal(await contar(d1.local, "estado = 'publicada'"), 0);
    assert.equal(await contar(d1.local, "estado = 'error'"), 1);
  });
});
