#!/usr/bin/env node
// Uso: npm run eventos -- <comando> [opciones]   (guía en docs/etapa-b-eventos-d1.md)
//
//   importar <eventos-nuevos.jsonl> [--incluir-vencidos]   Guarda la cola del adaptador como pendiente_revision.
//   pendientes                                    Lista los eventos que esperan revisión, con sus alertas.
//   ver <id>                                      Muestra un evento: fuentes, alertas, imágenes e historial.
//   resolver <alerta_id> --por "Nombre" --motivo "…"      Marca una alerta como resuelta por una persona.
//   aprobar <id> --por "Nombre" [--forzar --motivo "…"]   Aprueba (no se puede con alertas que bloquean sin resolver).
//   publicar <id> --por "Nombre"                  Publica un evento aprobado (en B1 solo cambia el estado).
//   rechazar <id> --por "Nombre" --motivo "…"
//   retirar <id> --por "Nombre" --motivo "…"
//   devolver <id> --por "Nombre" --motivo "…"     Vuelve a pendiente_revision y borra la aprobación.
//
// Modos: --local (por defecto) usa registros/imagenes-local.sqlite, la misma base local del importador de imágenes.
//        --simular usa una base en memoria que se descarta al terminar.
//        Etapa B1: NO hay modo remoto. Escribir en el D1 de producción queda para después de la autorización.
import { existsSync, readFileSync } from 'node:fs';
import { basename } from 'node:path';
import { parseArgs } from 'node:util';
import { crearAlmacenLocal, crearAlmacenMemoria } from '../imagenes/almacenes.mjs';
import { importarEventos, pendientesEventos, detalleEvento, resolverAlerta, aprobarEvento, publicarEvento, rechazarEvento, retirarEvento, devolverARevision, ErrorEvento } from './importador.mjs';

const { values: op, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    local: { type: 'boolean', default: true },
    simular: { type: 'boolean', default: false },
    remoto: { type: 'boolean', default: false },
    por: { type: 'string' },
    motivo: { type: 'string' },
    forzar: { type: 'boolean', default: false },
    'incluir-vencidos': { type: 'boolean', default: false },
    hoy: { type: 'string' },
    ayuda: { type: 'boolean', short: 'h', default: false },
  },
});
const [comando, ...args] = positionals;
const ICONOS = { nuevo: '+', actualizado: '~', sin_cambios: '=', conservado: '•', vencido: '⌛', error: '!' };

const ayuda = () => console.log(readFileSync(new URL(import.meta.url), 'utf8').split('\n').slice(1, 17).map((l) => l.replace(/^\/\/ ?/, '')).join('\n'));

const main = async () => {
  if (!comando || op.ayuda) return ayuda();
  if (op.remoto) throw new ErrorEvento('configuracion', 'El modo remoto no está habilitado en la etapa B1: falta la autorización para escribir en el D1 de producción.');
  if (op.hoy && !/^\d{4}-\d{2}-\d{2}$/.test(op.hoy)) throw new ErrorEvento('configuracion', '--hoy va como AAAA-MM-DD');
  const almacen = op.simular ? await crearAlmacenMemoria() : await crearAlmacenLocal(process.cwd());
  const hoy = op.hoy ? { hoy: op.hoy } : {};
  const baseLocal = process.env.EVENTOS_SQLITE_LOCAL ? 'base D1 local del sitio (npm run d1:local)' : 'registros/imagenes-local.sqlite';
  console.log(`Modo: ${op.simular ? 'simulación (base en memoria, no guarda nada)' : `local (${baseLocal})`}`);

  if (comando === 'importar') {
    const ruta = args[0];
    if (!ruta || !existsSync(ruta)) throw new ErrorEvento('configuracion', 'Indica el archivo: importar <eventos-nuevos.jsonl>');
    const r = await importarEventos({
      contenido: readFileSync(ruta, 'utf8'),
      archivo: basename(ruta),
      almacen,
      incluirVencidos: op['incluir-vencidos'],
      ...hoy,
      aviso: (d) => console.log(`${ICONOS[d.resultado] ?? '?'} línea ${d.linea} ${d.ref ?? ''} ${d.resultado}: ${d.mensaje}`),
    });
    const { detalles, ...cifras } = r;
    console.log('\nResumen:', cifras);
    if (r.errores) process.exitCode = 2;
    return;
  }

  if (comando === 'pendientes') {
    const filas = await pendientesEventos(almacen);
    if (!filas.length) return console.log('No hay eventos pendientes.');
    for (const f of filas) {
      const precio = f.tipo_precio === 'gratis' ? 'gratis' : f.precio_desde != null ? `desde $${f.precio_desde.toLocaleString('es-CO')}` : f.tipo_precio;
      console.log(`${f.id} · ${f.fecha} · ${f.titulo}\n   ${f.municipio ?? 'sin municipio'} · ${f.categoria ?? 'sin categoría'} · ${precio} · Gemini: ${f.estado_investigacion ?? '—'} · alertas: ${f.bloquean} bloquean, ${f.revisar} por revisar`);
    }
    return;
  }

  if (comando === 'ver') {
    const d = await detalleEvento(almacen, args[0]);
    const { procedencia, ...e } = d.evento;
    console.log(e);
    console.log('Fuentes:', d.fuentes);
    for (const a of d.alertas) console.log(`  #${a.id} [${a.gravedad}] ${a.tipo}: ${a.detalle}${a.resuelta_por ? ` — resuelta por ${a.resuelta_por}: ${a.resolucion}` : ''}`);
    console.log('Imágenes candidatas:', d.imagenes);
    console.log('Historial:', d.historial);
    return;
  }

  if (comando === 'resolver') {
    await resolverAlerta({ alertaId: Number(args[0]), por: op.por, resolucion: op.motivo, almacen });
    return console.log(`Alerta #${args[0]} resuelta.`);
  }

  const acciones = { aprobar: aprobarEvento, publicar: publicarEvento, rechazar: rechazarEvento, retirar: retirarEvento, devolver: devolverARevision };
  if (acciones[comando]) {
    if (!args[0]) throw new ErrorEvento('configuracion', `Indica el id: ${comando} <id> --por "Nombre"`);
    const r = await acciones[comando]({ id: args[0], por: op.por, motivo: op.motivo, forzar: op.forzar, almacen, ...hoy });
    return console.log(`${r.id} → ${r.estado}`);
  }

  ayuda();
  process.exitCode = 1;
};

main().catch((e) => {
  console.error(`Error${e.codigo ? ` (${e.codigo})` : ''}: ${e.message}`);
  process.exitCode = 1;
});
