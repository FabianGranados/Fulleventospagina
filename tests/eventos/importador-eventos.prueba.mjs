// Importador de eventos (B1) y compuertas de revisión: todo entra pendiente, nada se aprueba con alertas que
// bloquean, nada se publica sin aprobar, y la base lo hace cumplir aunque un script se salte el importador.
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { importarEventos, aprobarEvento, publicarEvento, rechazarEvento, retirarEvento, devolverARevision, resolverAlerta, pendientesEventos, detalleEvento, idEvento } from '../../scripts/eventos/importador.mjs';
import { HOY, adaptarMuestra, almacen, lineas } from './ayudas.mjs';
import { resolverMunicipio } from '../../scripts/eventos/divipola.mjs';

const cola = () => adaptarMuestra().eventosNuevosJsonl;
const importarMuestra = async (a, extra = {}) => importarEventos({ contenido: cola(), almacen: a, hoy: HOY, ...extra });
const RIO = idEvento('PRB-RIO26');
// Solo el festival (sin su duplicado del mismo lote): un evento sin alertas que bloquean
const lineaRio = () => lineas(cola()).find((l) => l.ref === 'PRB-RIO26');
const importarRio = (a) => importarEventos({ contenido: JSON.stringify(lineaRio()), almacen: a, hoy: HOY });
const estado = async (a, id) => (await a.db.consultar('SELECT estado FROM eventos WHERE id = ?', [id]))[0]?.estado;
const rechaza = (promesa, patron) => assert.rejects(promesa, patron);

describe('Importador de eventos', () => {
  test('guarda todo como pendiente_revision, omite los vencidos y no publica nada', async () => {
    const a = await almacen();
    const r = await importarMuestra(a);
    assert.equal(r.total, 7);
    assert.equal(r.nuevos, 6);
    assert.equal(r.vencidos_omitidos, 1); // el partido del 11 de octubre
    assert.equal(r.errores, 0, JSON.stringify(r.detalles.filter((d) => d.resultado === 'error')));
    const filas = await a.db.consultar('SELECT estado, COUNT(*) AS n FROM eventos GROUP BY estado');
    assert.deepEqual(filas.map((f) => [f.estado, f.n]), [['pendiente_revision', 6]]);
    assert.equal((await a.db.consultar("SELECT COUNT(*) AS n FROM eventos WHERE estado = 'publicado'"))[0].n, 0);
    // Con --incluir-vencidos entra, pero con la alerta que bloquea
    const b = await almacen();
    await importarMuestra(b, { incluirVencidos: true });
    const par = await detalleEvento(b, idEvento('PRB-PAR26'));
    assert.ok(par.alertas.some((x) => x.tipo === 'vencido' && x.gravedad === 'bloquea'));
  });

  test('guarda fuentes clasificadas, alertas, imágenes candidatas y la procedencia completa', async () => {
    const a = await almacen();
    await importarMuestra(a);
    const d = await detalleEvento(a, RIO);
    assert.equal(d.evento.municipio_codigo, '08001');
    assert.equal(d.evento.categoria, 'conciertos-y-festivales');
    assert.equal(d.evento.tipo_precio, 'pago');
    assert.equal(d.evento.precio_desde, 50000);
    assert.deepEqual(d.fuentes.map((f) => f.clase).sort(), ['gobierno', 'otra']);
    assert.equal(JSON.parse(d.evento.procedencia).original.external_id, 'PRB-RIO26');
    assert.deepEqual(d.imagenes.map((i) => i.utilizable), [1]);
    const carnaval = await detalleEvento(a, idEvento('PRB-CAR27'));
    assert.deepEqual(carnaval.imagenes.map((i) => i.utilizable), [0]);
    assert.match(carnaval.imagenes[0].motivos, /sin licencia/);
    const pend = await pendientesEventos(a);
    assert.equal(pend.length, 6);
    assert.ok(pend.find((p) => p.id === idEvento('PRB-ALB26')).bloquean >= 2);
  });

  test('es idempotente: repetir el lote no duplica eventos, fuentes ni alertas', async () => {
    const a = await almacen();
    await importarMuestra(a);
    const contar = async () => (await a.db.consultar('SELECT (SELECT COUNT(*) FROM eventos) e, (SELECT COUNT(*) FROM fuentes_evento) f, (SELECT COUNT(*) FROM eventos_alertas) al, (SELECT COUNT(*) FROM eventos_imagenes_candidatas) i'))[0];
    const antes = await contar();
    const r = await importarMuestra(a);
    assert.equal(r.nuevos, 0);
    assert.equal(r.sin_cambios, 6);
    assert.deepEqual(await contar(), antes);
  });

  test('detecta duplicados contra lo que ya está en D1 aunque lleguen en otro lote', async () => {
    const a = await almacen();
    const todas = lineas(cola());
    const rio = todas.find((l) => l.ref === 'PRB-RIO26');
    const bis = todas.find((l) => l.ref === 'PRB-RIO26-BIS');
    bis.alertas = bis.alertas.filter((x) => x.tipo !== 'duplicado'); // como si viniera sola en otro archivo
    await importarEventos({ contenido: JSON.stringify(rio), almacen: a, hoy: HOY });
    await importarEventos({ contenido: JSON.stringify(bis), almacen: a, hoy: HOY });
    const d = await detalleEvento(a, idEvento('PRB-RIO26-BIS'));
    assert.ok(d.alertas.some((x) => x.tipo === 'duplicado' && x.gravedad === 'bloquea' && x.detalle.includes(RIO)));
    // El primero también queda marcado: el resultado no depende del orden
    const primero = await detalleEvento(a, RIO);
    assert.ok(primero.alertas.some((x) => x.tipo === 'duplicado' && x.detalle.includes(idEvento('PRB-RIO26-BIS'))));
  });

  test('rechaza líneas sin normalizar o con datos inválidos sin detener el lote', async () => {
    const a = await almacen();
    const buena = lineas(cola()).find((l) => l.ref === 'PRB-RIO26');
    const mala = { ...buena, ref: 'X', normalizado: { ...buena.normalizado, ref: 'PRB-MALA', tipo_precio: 'gratis' } };
    const r = await importarEventos({ contenido: ['{roto', JSON.stringify({ ref: 'cruda', evento: {} }), JSON.stringify(mala), JSON.stringify(buena)].join('\n'), almacen: a, hoy: HOY });
    assert.equal(r.errores, 3);
    assert.equal(r.nuevos, 1);
    assert.match(r.detalles[1].mensaje, /adaptar/);
    assert.match(r.detalles[2].mensaje, /gratis no puede tener precio/);
  });
});

describe('Revisión humana', () => {
  test('aprobar: persona con nombre, sin alertas que bloquean; publicar solo lo aprobado', async () => {
    const a = await almacen();
    await importarRio(a);
    await rechaza(aprobarEvento({ id: RIO, por: 'Gemini', almacen: a, hoy: HOY }), /persona/);
    await rechaza(publicarEvento({ id: RIO, por: 'Óscar Fabián', almacen: a, hoy: HOY }), /solo se publica uno aprobado/);
    await aprobarEvento({ id: RIO, por: 'Óscar Fabián', almacen: a, hoy: HOY });
    assert.equal(await estado(a, RIO), 'aprobado');
    await publicarEvento({ id: RIO, por: 'Óscar Fabián', almacen: a, hoy: HOY });
    assert.equal(await estado(a, RIO), 'publicado');
    const h = (await detalleEvento(a, RIO)).historial.map((x) => `${x.de}→${x.a} (${x.por})`);
    assert.deepEqual(h, ['pendiente_revision→aprobado (Óscar Fabián)', 'aprobado→publicado (Óscar Fabián)']);
  });

  test('las alertas que bloquean se resuelven una a una o se fuerzan con un motivo', async () => {
    const a = await almacen();
    await importarMuestra(a);
    const id = idEvento('PRB-CAR27');
    await rechaza(aprobarEvento({ id, por: 'Óscar Fabián', almacen: a, hoy: HOY }), /Alertas que bloquean/);
    await rechaza(aprobarEvento({ id, por: 'Óscar Fabián', forzar: true, almacen: a, hoy: HOY }), /--motivo/);
    const bloqueos = (await detalleEvento(a, id)).alertas.filter((x) => x.gravedad === 'bloquea');
    await rechaza(resolverAlerta({ alertaId: bloqueos[0].id, por: 'Óscar Fabián', resolucion: 'ok', almacen: a }), /10 caracteres/);
    await resolverAlerta({ alertaId: bloqueos[0].id, por: 'Óscar Fabián', resolucion: 'Confirmado en la página de programación oficial', almacen: a });
    await aprobarEvento({ id, por: 'Óscar Fabián', forzar: true, motivo: 'Corpocarnaval confirmó las fechas por teléfono', almacen: a, hoy: HOY });
    const d = await detalleEvento(a, id);
    assert.equal(d.evento.estado, 'aprobado');
    assert.ok(d.alertas.filter((x) => x.gravedad === 'bloquea').every((x) => x.resuelta_por === 'Óscar Fabián'));
  });

  test('un evento vencido no se aprueba ni se publica', async () => {
    const a = await almacen();
    await importarRio(a);
    await rechaza(aprobarEvento({ id: RIO, por: 'Óscar Fabián', almacen: a, hoy: '2026-11-21' }), /terminó/);
  });

  test('rechazar, retirar y devolver exigen motivo; devolver borra la aprobación', async () => {
    const a = await almacen();
    await importarRio(a);
    await rechaza(rechazarEvento({ id: RIO, por: 'Óscar Fabián', almacen: a }), /motivo/);
    await aprobarEvento({ id: RIO, por: 'Óscar Fabián', almacen: a, hoy: HOY });
    await publicarEvento({ id: RIO, por: 'Óscar Fabián', almacen: a, hoy: HOY });
    await retirarEvento({ id: RIO, por: 'Óscar Fabián', motivo: 'El organizador aplazó el festival', almacen: a });
    assert.equal(await estado(a, RIO), 'retirado');
    await devolverARevision({ id: RIO, por: 'Óscar Fabián', motivo: 'Hay nueva fecha para revisar', almacen: a });
    const [e] = await a.db.consultar('SELECT estado, aprobado_por, publicado_en FROM eventos WHERE id = ?', [RIO]);
    assert.deepEqual({ ...e }, { estado: 'pendiente_revision', aprobado_por: null, publicado_en: null });
  });

  test('reimportar no toca un evento aprobado: deja una alerta si la investigación cambió', async () => {
    const a = await almacen();
    await importarRio(a);
    await aprobarEvento({ id: RIO, por: 'Óscar Fabián', almacen: a, hoy: HOY });
    const cambiada = lineaRio();
    cambiada.normalizado.lugar = 'Otro parque';
    const r = await importarEventos({ contenido: JSON.stringify(cambiada), almacen: a, hoy: HOY });
    assert.equal(r.conservados, 1);
    const d = await detalleEvento(a, RIO);
    assert.equal(d.evento.lugar, 'Parque del Río');
    assert.equal(d.evento.estado, 'aprobado');
    assert.ok(d.alertas.some((x) => x.tipo === 'cambio_en_fuente'));
  });
});

describe('La base impide publicar sin aprobación (triggers de 0002)', () => {
  const insertar = (a, cambios = {}) => {
    const fila = { id: 'ev_manual', ref_externa: 'manual', slug: 'evento-manual', titulo: 'Evento manual', fecha: '2026-12-01', tipo_precio: 'gratis', procedencia: '{}', ...cambios };
    const cols = Object.keys(fila);
    return a.db.ejecutar(`INSERT INTO eventos (${cols.join(', ')}) VALUES (${cols.map(() => '?').join(', ')})`, Object.values(fila));
  };

  test('no se puede insertar un evento ya aprobado o publicado', async () => {
    const a = await almacen();
    await rechaza(insertar(a, { estado: 'publicado', publicado_en: 'x', aprobado_por: 'x', aprobado_en: 'x' }), /pendiente_revision/);
    await rechaza(insertar(a, { aprobado_por: 'alguien' }), /pendiente_revision/);
    await insertar(a);
    assert.equal(await estado(a, 'ev_manual'), 'pendiente_revision');
  });

  test('no se puede saltar la aprobación ni aprobar con alertas abiertas', async () => {
    const a = await almacen();
    await insertar(a);
    await rechaza(a.db.ejecutar("UPDATE eventos SET estado = 'publicado', publicado_en = 'x', aprobado_por = 'x', aprobado_en = 'x' WHERE id = 'ev_manual'"), /Solo un evento aprobado/);
    await rechaza(a.db.ejecutar("UPDATE eventos SET estado = 'aprobado' WHERE id = 'ev_manual'"), /CHECK constraint/); // sin quién aprobó
    await a.db.ejecutar("INSERT INTO eventos_alertas (evento_id, tipo, gravedad, detalle) VALUES ('ev_manual', 'fuente_insuficiente', 'bloquea', 'x')");
    await rechaza(a.db.ejecutar("UPDATE eventos SET estado = 'aprobado', aprobado_por = 'Ana', aprobado_en = 'x' WHERE id = 'ev_manual'"), /alertas que bloquean/);
  });

  test('un evento aprobado no cambia de contenido ni se borra; los precios se validan en la base', async () => {
    const a = await almacen();
    await insertar(a);
    await a.db.ejecutar("UPDATE eventos SET estado = 'aprobado', aprobado_por = 'Ana', aprobado_en = 'x' WHERE id = 'ev_manual'");
    await rechaza(a.db.ejecutar("UPDATE eventos SET fecha = '2026-12-02' WHERE id = 'ev_manual'"), /devolverlo a pendiente_revision/);
    await rechaza(a.db.ejecutar("DELETE FROM eventos WHERE id = 'ev_manual'"), /se retira/);
    await rechaza(a.db.ejecutar("UPDATE eventos SET estado = 'pendiente_revision' WHERE id = 'ev_manual'"), /quitar aprobado_por/);
    await rechaza(insertar(a, { id: 'ev_p1', ref_externa: 'p1', slug: 'p1', tipo_precio: 'gratis', precio_desde: 5000 }), /CHECK constraint/);
    await rechaza(insertar(a, { id: 'ev_p2', ref_externa: 'p2', slug: 'p2', tipo_precio: 'desconocido', precio_desde: 5000 }), /CHECK constraint/);
    await rechaza(insertar(a, { id: 'ev_p3', ref_externa: 'p3', slug: 'p3', tipo_precio: 'regalado' }), /CHECK constraint/);
    await insertar(a, { id: 'ev_p4', ref_externa: 'p4', slug: 'p4', tipo_precio: 'mixto' }); // mixto sin cifra: permitido
    await rechaza(insertar(a, { id: 'ev_p5', ref_externa: 'p5', slug: 'p5', categoria: 'teatro' }), /FOREIGN KEY/); // solo las 14
    await rechaza(insertar(a, { id: 'ev_p6', ref_externa: 'p6', slug: 'p6', municipio_codigo: '99999' }), /FOREIGN KEY/); // solo DIVIPOLA
  });
});

describe('Revisión independiente (hallazgos corregidos)', () => {
  const insertar = (a, cambios = {}) => {
    const fila = { id: 'ev_r', ref_externa: 'r', slug: 'evento-r', titulo: 'Evento R', fecha: '2026-12-01', tipo_precio: 'gratis', procedencia: '{}', ...cambios };
    const cols = Object.keys(fila);
    return a.db.ejecutar(`INSERT INTO eventos (${cols.join(', ')}) VALUES (${cols.map(() => '?').join(', ')})`, Object.values(fila));
  };
  const aprobar = (a, id = 'ev_r') => a.db.ejecutar("UPDATE eventos SET estado = 'aprobado', aprobado_por = 'Ana Ruiz', aprobado_en = 'x' WHERE id = ?", [id]);

  test('no se publica un contenido distinto del aprobado, ni cambiando columnas secundarias', async () => {
    const a = await almacen();
    await insertar(a);
    await aprobar(a);
    await rechaza(a.db.ejecutar("UPDATE eventos SET estado = 'publicado', publicado_en = 'x', titulo = 'Otro', tipo_precio = 'pago', precio_desde = 999999 WHERE id = 'ev_r'"), /devolverlo a pendiente_revision/);
    await a.db.ejecutar("UPDATE eventos SET estado = 'publicado', publicado_en = 'x' WHERE id = 'ev_r'");
    for (const cambio of ["modalidad = 'virtual'", "url_registro = 'https://x.example'", "hora_fin = '23:00'", "etiquetas = '[\"x\"]'", "ciudad_sitio = 'cali'", 'latitud = 4.6']) {
      await rechaza(a.db.ejecutar(`UPDATE eventos SET ${cambio} WHERE id = 'ev_r'`), /devolverlo a pendiente_revision/, cambio);
    }
  });

  test('las alertas que bloquean no se borran y se resuelven con nombre y explicación', async () => {
    const a = await almacen();
    await insertar(a);
    await a.db.ejecutar("INSERT INTO eventos_alertas (evento_id, tipo, gravedad, detalle) VALUES ('ev_r', 'duplicado', 'bloquea', 'x')");
    await rechaza(a.db.ejecutar("DELETE FROM eventos_alertas WHERE evento_id = 'ev_r'"), /no se borra/);
    await rechaza(a.db.ejecutar("UPDATE eventos_alertas SET resuelta_en = 'x', resuelta_por = '', resolucion = '' WHERE evento_id = 'ev_r'"), /CHECK constraint/);
    await rechaza(a.db.ejecutar("UPDATE eventos SET estado = 'aprobado', aprobado_por = '', aprobado_en = 'x' WHERE id = 'ev_r'"), /alertas que bloquean|CHECK/);
  });

  test('INSERT OR REPLACE no pisa un evento aprobado', async () => {
    const a = await almacen();
    await insertar(a);
    await aprobar(a);
    await rechaza(a.db.ejecutar("INSERT OR REPLACE INTO eventos (id, ref_externa, slug, titulo, fecha, tipo_precio, procedencia) VALUES ('ev_r', 'r', 'evento-r', 'T', '2026-12-01', 'gratis', '{}')"), /no se puede reemplazar/);
    assert.equal(await estado(a, 'ev_r'), 'aprobado');
  });

  test('reimportar cierra las alertas que ya no aplican y las reabre si vuelven, sin borrarlas', async () => {
    const a = await almacen();
    const l = lineaRio();
    l.normalizado.fuentes = [l.normalizado.fuentes[0]]; // una sola fuente → alerta "revisar"
    await importarEventos({ contenido: JSON.stringify(l), almacen: a, hoy: HOY });
    const abiertas = async () => (await a.db.consultar('SELECT tipo FROM eventos_alertas WHERE evento_id = ? AND resuelta_en IS NULL', [RIO])).map((x) => x.tipo);
    assert.ok((await abiertas()).includes('fuente_insuficiente'));
    await importarRio(a); // con las dos fuentes
    assert.ok(!(await abiertas()).includes('fuente_insuficiente'));
    const [cerrada] = await a.db.consultar("SELECT resuelta_por FROM eventos_alertas WHERE evento_id = ? AND tipo = 'fuente_insuficiente'", [RIO]);
    assert.match(cerrada.resuelta_por, /^importador/);
    await importarEventos({ contenido: JSON.stringify(l), almacen: a, hoy: HOY });
    assert.ok((await abiertas()).includes('fuente_insuficiente'));
  });

  test('acepta códigos de departamento y municipio sin el cero inicial', () => {
    const r = resolverMunicipio({ codigo: 5001, departamentoCodigo: 5 });
    assert.equal(r.municipio?.codigo, '05001');
  });
});
