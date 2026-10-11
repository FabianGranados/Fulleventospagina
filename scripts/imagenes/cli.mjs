#!/usr/bin/env node
// Uso: npm run imagenes -- <comando> [opciones]   (guía completa en docs/imagenes-r2.md)
//
//   adaptar <fulleventos_event_images.jsonl> [--salida carpeta]   Convierte lo de Gemini (no guarda en Cloudflare).
//   importar <archivo.json|jsonl>   Importa imágenes (formato del importador).
//   pendientes                      Lista las imágenes que esperan revisión de derechos.
//   aprobar <id...> --por "Nombre" [--licencia "…"] [--evidencia "…"] [--reemplazar --motivo "…"]
//   publicar <id> --motivo "…"       Publica una imagen ya subida (lista o retirada) en lugar de la actual.
//   retirar <evento_id> --motivo "…"   Deja de mostrar la foto (vuelve el degradado).
//   indice                          Vuelve a publicar indice/eventos-v1.json desde D1.
//
// Modos: por defecto Cloudflare (lee .env.importador). --local usa SQLite y una carpeta en registros/.
//        --simular valida el archivo, encuentra los eventos y revisa URL y derechos sin descargar ni guardar nada.
import { existsSync, mkdirSync, readFileSync, appendFileSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { parseArgs } from 'node:util';
import { cargarPolitica, ErrorImagen } from './politica.mjs';
import { crearAlmacenCloudflare, crearAlmacenLocal, crearAlmacenMemoria } from './almacenes.mjs';
import { cargarEventos, crearCatalogo } from './catalogo.mjs';
import { adaptar } from './adaptar.mjs';
import { aprobar, importar, pendientes, publicarExistente, publicarIndice, retirar } from './importador.mjs';

const { values: op, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    local: { type: 'boolean', default: false },
    simular: { type: 'boolean', default: false },
    por: { type: 'string' },
    licencia: { type: 'string' },
    evidencia: { type: 'string' },
    reemplazar: { type: 'boolean', default: false },
    motivo: { type: 'string' },
    salida: { type: 'string' },
    ayuda: { type: 'boolean', short: 'h', default: false },
  },
});

const [comando, ...args] = positionals;
const raiz = process.cwd();

const ayuda = () => {
  const texto = readFileSync(new URL(import.meta.url), 'utf8').split('\n').slice(1, 14).map((l) => l.replace(/^\/\/ ?/, ''));
  console.log(texto.join('\n'));
};

const abrirAlmacen = async () => {
  if (op.simular) return crearAlmacenMemoria();
  if (op.local) return crearAlmacenLocal(raiz);
  const archivoEnv = join(raiz, '.env.importador');
  if (existsSync(archivoEnv)) process.loadEnvFile(archivoEnv);
  return crearAlmacenCloudflare();
};

const ICONOS = { publicada: '✔', lista: '•', pendiente: '…', duplicada: '=', rechazada: '✘', error: '!', simulada: '○' };

const main = async () => {
  if (!comando || op.ayuda) return ayuda();

  // adaptar no toca D1 ni R2: solo lee el archivo de Gemini y escribe tres archivos de trabajo
  if (comando === 'adaptar') {
    const ruta = args[0];
    if (!ruta || !existsSync(ruta)) throw new ErrorImagen('configuracion', 'Indica el archivo: adaptar <fulleventos_event_images.jsonl>');
    const { ciudades } = await import('../../src/data/ciudades.ts');
    const salida = op.salida ?? join(raiz, 'registros', `adaptado-${new Date().toISOString().replace(/[:.]/g, '-')}`);
    mkdirSync(salida, { recursive: true });
    const r = adaptar({ contenido: readFileSync(ruta, 'utf8'), archivo: basename(ruta), eventos: await cargarEventos(), ciudades });
    writeFileSync(join(salida, 'imagenes-importador.jsonl'), r.imagenesJsonl);
    writeFileSync(join(salida, 'eventos-nuevos.jsonl'), r.eventosNuevosJsonl);
    writeFileSync(join(salida, 'reporte.json'), JSON.stringify(r.reporte, null, 2));
    const { errores, avisos, ...cifras } = r.reporte;
    console.log('Adaptación:', cifras);
    for (const e of errores) console.log(`✘ línea ${e.linea}${e.ref ? ` (${e.ref})` : ''}: ${e.error}`);
    if (avisos.length) console.log(`${avisos.length} línea(s) con arreglos de formato: ver reporte.json`);
    console.log(`Archivos en ${salida}
Siguiente paso: npm run imagenes -- importar ${join(salida, 'imagenes-importador.jsonl')} --simular`);
    if (errores.length) process.exitCode = 2;
    return;
  }
  const politica = cargarPolitica(raiz);
  const almacen = await abrirAlmacen();
  const urlPublica = (process.env.IMAGENES_URL_PUBLICA ?? '').replace(/\/+$/, '') || undefined;
  console.log(`Modo: ${op.simular ? 'simulación (no guarda nada)' : almacen.modo}`);

  if (comando === 'importar') {
    const ruta = args[0];
    if (!ruta || !existsSync(ruta)) throw new ErrorImagen('configuracion', 'Indica el archivo: importar <archivo.jsonl>');
    const catalogo = crearCatalogo(await cargarEventos());
    mkdirSync(join(raiz, 'registros'), { recursive: true });
    const registro = join(raiz, 'registros', `importacion-${new Date().toISOString().replace(/[:.]/g, '-')}.jsonl`);
    const resumen = await importar({
      contenido: readFileSync(ruta, 'utf8'),
      archivo: basename(ruta),
      almacen,
      catalogo,
      politica,
      simular: op.simular,
      urlPublica,
      aviso: (d) => {
        console.log(`${ICONOS[d.resultado] ?? '?'} línea ${d.linea ?? '-'} ${d.evento ?? ''} ${d.resultado}: ${d.mensaje}`);
        if (!op.simular) appendFileSync(registro, JSON.stringify({ ...d, en: new Date().toISOString() }) + '\n');
      },
    });
    const { detalles, ...cifras } = resumen;
    console.log('\nResumen:', cifras);
    if (!op.simular) console.log(`Registro detallado: ${registro}`);
    if (resumen.errores) process.exitCode = 2;
    return;
  }

  if (comando === 'pendientes') {
    const filas = await pendientes(almacen);
    if (!filas.length) return console.log('No hay imágenes pendientes.');
    for (const f of filas) {
      console.log(`#${f.id} ${f.evento_id} · ${f.fuente_nombre}\n   imagen: ${f.url_origen}\n   fuente: ${f.fuente_url}\n   licencia: ${f.licencia ?? '—'} · evidencia: ${f.derechos_evidencia ?? '—'}\n   motivo: ${f.error}`);
    }
    return;
  }

  if (comando === 'aprobar') {
    const ids = args.map(Number).filter(Number.isInteger);
    if (!ids.length) throw new ErrorImagen('configuracion', 'Indica los ids: aprobar 12 13 --por "Nombre"');
    const salida = await aprobar({ ids, por: op.por, licencia: op.licencia, evidencia: op.evidencia, reemplazar: op.reemplazar, motivo: op.motivo, almacen, politica, urlPublica });
    for (const s of salida) console.log(`${ICONOS[s.resultado] ?? '?'} #${s.id} ${s.resultado}: ${s.mensaje}`);
    return;
  }

  if (comando === 'publicar') {
    const id = Number(args[0]);
    if (!Number.isInteger(id) || !op.motivo) throw new ErrorImagen('configuracion', 'Uso: publicar <id> --motivo "…"');
    const r = await publicarExistente({ id, motivo: op.motivo, almacen, politica });
    console.log(`${ICONOS[r.resultado]} #${r.id} ${r.resultado}: ${r.mensaje}`);
    return;
  }

  if (comando === 'retirar') {
    if (!args[0] || !op.motivo) throw new ErrorImagen('configuracion', 'Uso: retirar <evento_id> --motivo "…"');
    const id = await retirar({ eventoId: args[0], motivo: op.motivo, almacen, politica });
    console.log(id ? `Imagen #${id} retirada; el índice ya no la incluye.` : 'Ese evento no tiene foto publicada.');
    return;
  }

  if (comando === 'indice') {
    const indice = await publicarIndice(almacen, politica);
    console.log(`Índice publicado con ${Object.keys(indice.eventos).length} eventos.`);
    return;
  }

  ayuda();
  process.exitCode = 1;
};

main().catch((e) => {
  console.error(`Error${e.codigo ? ` (${e.codigo})` : ''}: ${e.message}`);
  process.exitCode = 1;
});
