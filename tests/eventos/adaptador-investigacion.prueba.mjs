// Adaptador con el formato de investigación de Gemini (gemini-investigacion/1) y las reglas de validación que se
// conservan: fuentes insuficientes, fechas vencidas, duplicados, derechos de imágenes, categorías, municipios y precios.
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { adaptar } from '../../scripts/imagenes/adaptar.mjs';
import { clasificarFuente, motivosImagen, validarReglas, eventoNormalizado } from '../../scripts/eventos/evento.mjs';
import { fechaHoraBogota, categoriaOficial, tipoDeLinea } from '../../scripts/eventos/normalizar.mjs';
import { categoriasOficiales } from '../../src/data/categorias-oficiales.ts';
import { ciudades } from '../../src/data/ciudades.ts';
import { HOY, adaptarMuestra, archivosMuestra, eventosSitio, lineas, porRef, tipos } from './ayudas.mjs';

const cola = () => lineas(adaptarMuestra().eventosNuevosJsonl);

describe('Formato de investigación de Gemini', () => {
  test('reconoce cada archivo, deja fuera los rechazados y las noticias, y no inventa eventos', () => {
    const { reporte } = adaptarMuestra();
    assert.equal(reporte.formato, 'gemini-investigacion/1');
    assert.equal(reporte.investigacion.eventos, 8);
    assert.deepEqual(reporte.investigacion.rechazados_en_origen.map((r) => r.ref), ['PRB-OLD']);
    assert.equal(reporte.investigacion.noticias_ignoradas, 1);
    assert.equal(reporte.investigacion.imagenes, 3);
    assert.deepEqual(reporte.investigacion.imagenes_sin_evento, ['evento-que-no-existe']);
    assert.deepEqual(reporte.errores, []);
    assert.equal(cola().length, 7);
  });

  test('convierte los campos al evento normalizado (DIVIPOLA, 14 categorías, hora de Colombia)', () => {
    const rio = porRef(cola(), 'PRB-RIO26').normalizado;
    assert.equal(rio.categoria, 'conciertos-y-festivales');
    assert.equal(rio.municipio_codigo, '08001');
    assert.equal(rio.departamento_codigo, '08');
    assert.equal(rio.ciudad_sitio, 'barranquilla');
    assert.equal(rio.fecha, '2026-11-20');
    assert.equal(rio.hora, '15:00');
    assert.equal(rio.hora_fin, '23:30');
    assert.equal(rio.estado_investigacion, 'verified');
    assert.deepEqual(rio.fuentes.map((f) => f.url), ['https://www.boletas.example/eventos/festival-rio', 'https://www.alcaldia-prueba.gov.co/agenda/festival-rio']);
    // Municipio por nombre + departamento cuando no viene el código
    const carnaval = porRef(cola(), 'PRB-CAR27').normalizado;
    assert.equal(carnaval.municipio_codigo, '52001');
    assert.equal(carnaval.categoria, 'comunidad-y-tradiciones');
    assert.equal(carnaval.ciudad_sitio, 'pasto');
    // Municipio que no está en la interfaz: queda con su código y sin ciudad del sitio
    const feria = porRef(cola(), 'PRB-GAS26').normalizado;
    assert.equal(feria.municipio_codigo, '50689');
    assert.equal(feria.ciudad_sitio, null);
  });

  test('precios gratis, pago, mixto y desconocido sin inventar cifras', () => {
    const c = cola();
    const rio = porRef(c, 'PRB-RIO26').normalizado;
    assert.deepEqual([rio.tipo_precio, rio.precio_desde, rio.precio_hasta], ['pago', 50000, 120000]);
    const carnaval = porRef(c, 'PRB-CAR27').normalizado;
    assert.deepEqual([carnaval.tipo_precio, carnaval.precio_desde], ['gratis', undefined]);
    const feria = porRef(c, 'PRB-GAS26');
    assert.deepEqual([feria.normalizado.tipo_precio, feria.normalizado.precio_desde], ['mixto', undefined]);
    assert.ok(feria.alertas.some((a) => a.tipo === 'precio' && /Consultar precio/.test(a.detalle)));
    const adopcion = porRef(c, 'PRB-MAS26');
    assert.equal(adopcion.normalizado.tipo_precio, 'desconocido'); // "donation" no se convierte en gratis
    assert.ok(adopcion.alertas.some((a) => /Aporte voluntario/.test(a.detalle)));
    // El esquema rechaza cifras inventadas o contradictorias
    const base = { ...rio };
    assert.equal(eventoNormalizado.safeParse({ ...base, tipo_precio: 'gratis', precio_desde: 1000, precio_hasta: undefined }).success, false);
    assert.equal(eventoNormalizado.safeParse({ ...base, tipo_precio: 'desconocido' }).success, false);
    assert.equal(eventoNormalizado.safeParse({ ...base, precio_desde: 90000, precio_hasta: 10000 }).success, false);
    assert.equal(eventoNormalizado.safeParse({ ...base, tipo_precio: 'pago', precio_desde: undefined, precio_hasta: undefined }).success, true);
  });

  test('fuentes insuficientes: portada, red social sola, ayuda de Google y fuente única', () => {
    const c = cola();
    const detalle = (ref) => porRef(c, ref).alertas.filter((a) => a.tipo === 'fuente_insuficiente').map((a) => `${a.gravedad}: ${a.detalle}`).join(' | ');
    assert.match(detalle('PRB-CAR27'), /bloquea: La fuente principal es la portada/);
    assert.match(detalle('PRB-GAS26'), /bloquea: La fuente principal es una red social/);
    assert.match(detalle('PRB-PAR26'), /bloquea: La fuente principal no habla del evento/);
    assert.match(detalle('PRB-CAR27'), /bloquea: Ninguna fuente sirve/);
    // Una sola fuente que sí sirve: se revisa, no bloquea
    assert.match(detalle('PRB-ALB26'), /revisar: Una sola fuente/);
    assert.doesNotMatch(detalle('PRB-ALB26'), /bloquea/);
    // Boletera con la página del evento + alcaldía: sin alertas de fuentes
    assert.equal(detalle('PRB-RIO26'), '');
    assert.equal(clasificarFuente('https://www.tuboleta.com/es/eventos/x'), 'boletera');
    assert.equal(clasificarFuente('https://www.tuboleta.com/'), 'portada');
    assert.equal(clasificarFuente('https://www.localiza.com/colombia/es-co/feria'), 'secundaria');
    assert.equal(clasificarFuente('https://tunja-boyaca.gov.co/calendario'), 'gobierno');
  });

  test('fechas vencidas, duplicados en el lote y con el sitio, categoría y municipio sin resolver', () => {
    const c = cola();
    assert.ok(tipos(porRef(c, 'PRB-PAR26'), 'bloquea').includes('vencido'));
    assert.ok(!tipos(porRef(c, 'PRB-RIO26')).includes('vencido'));
    // El mismo festival con otra ref y otra fuente
    const bis = porRef(c, 'PRB-RIO26-BIS');
    assert.ok(bis.alertas.some((a) => a.tipo === 'duplicado' && a.gravedad === 'bloquea' && /PRB-RIO26/.test(a.detalle)));
    assert.equal(adaptarMuestra().reporte.duplicados_en_lote, 1);
    // Categoría que no es de las 14 y municipio homónimo sin departamento
    const alban = porRef(c, 'PRB-ALB26');
    assert.equal(alban.normalizado.categoria, null);
    assert.deepEqual(tipos(alban, 'bloquea').sort(), ['categoria', 'municipio', 'municipio']);
    assert.match(alban.alertas.find((a) => a.tipo === 'municipio').detalle, /varios departamentos/);
    // Un evento que ya existe en src/data/eventos.ts se marca como duplicado
    const conSitio = adaptar({ archivos: archivosMuestra(), eventos: [...eventosSitio, { id: 'e99', titulo: 'Festival de Prueba del Río', ciudad: 'barranquilla', fecha: '2026-11-20' }], ciudades, hoy: HOY });
    const rio = porRef(lineas(conSitio.eventosNuevosJsonl), 'PRB-RIO26');
    assert.ok(rio.alertas.some((a) => /Ya existe en el sitio como e99/.test(a.detalle)));
    assert.equal(conSitio.reporte.eventos_existentes, 2); // el festival y su duplicado
  });

  test('imágenes: solo con permiso comprobable; una afirmación de Gemini no basta', () => {
    const c = cola();
    const rio = porRef(c, 'PRB-RIO26');
    assert.deepEqual(motivosImagen(rio.imagenes[0]), []);
    assert.equal(rio.imagenes[0].derechos.licencia_url, 'https://www.boletas.example/prensa/condiciones');
    assert.equal(rio.imagenes[0].original.rights_holder, 'Fundación Río de Prueba'); // no se pierde el original
    const carnaval = porRef(c, 'PRB-CAR27');
    const motivos = motivosImagen(carnaval.imagenes[0]).join('; ');
    assert.match(motivos, /sin licencia ni documento/);
    assert.match(motivos, /coincidencia visual "incierta"/);
    assert.match(motivos, /sin texto alternativo/);
    assert.ok(carnaval.alertas.some((a) => a.tipo === 'derechos_imagen'));
  });

  test('correcciones: comprueba que estén aplicadas y bloquea si no lo están', () => {
    const { reporte } = adaptarMuestra();
    assert.deepEqual(reporte.investigacion.correcciones.map((x) => [x.evento, x.estado]), [
      ['feria-gastronomica-demo-2026-san-martin', 'aplicada'],
      ['jornada-adopcion-demo-2026-medellin', 'no_aplicada'],
    ]);
    assert.ok(porRef(cola(), 'PRB-MAS26').alertas.some((a) => a.tipo === 'correccion' && a.gravedad === 'bloquea'));
  });

  test('es determinista y mantiene el formato anterior en el mismo lote', () => {
    assert.equal(adaptarMuestra().eventosNuevosJsonl, adaptarMuestra().eventosNuevosJsonl);
    const v1 = readFileSync(join(import.meta.dirname, '..', 'importador', 'muestras', 'fulleventos_event_images.jsonl'), 'utf8');
    const mezcla = adaptar({ archivos: [...archivosMuestra(), { archivo: 'v1.jsonl', contenido: v1 }], eventos: eventosSitio, ciudades, hoy: HOY });
    assert.equal(mezcla.reporte.formato, 'mixto');
    const nuevos = lineas(mezcla.eventosNuevosJsonl);
    const salsa = nuevos.find((n) => n.ref === 'gemini-baq-2026-11-14-salsa-malecon');
    assert.equal(salsa.normalizado.municipio_codigo, '08001');
    assert.ok(salsa.normalizado.categoria === null || categoriasOficiales.some((x) => x.id === salsa.normalizado.categoria));
    assert.ok(nuevos.some((n) => n.ref === 'PRB-RIO26'));
  });

  test('ayudas: zona horaria, categorías por nombre o id y tipo de línea', () => {
    assert.deepEqual(fechaHoraBogota('2026-11-20T20:00:00Z'), { fecha: '2026-11-20', hora: '15:00' });
    assert.deepEqual(fechaHoraBogota('2026-11-21T02:00:00-05:00'), { fecha: '2026-11-21', hora: '02:00' });
    assert.match(fechaHoraBogota('2026-11-20T20:00:00').error, /sin zona horaria/);
    assert.equal(categoriaOficial('GASTRONOMÍA'), 'gastronomia');
    assert.equal(categoriaOficial('familia-y-ninos'), 'familia-y-ninos');
    assert.equal(categoriaOficial('Teatro'), null);
    assert.equal(categoriasOficiales.length, 14);
    assert.equal(tipoDeLinea({ ref: 'x', evento: {} }), 'v1');
    assert.equal(tipoDeLinea({ title: 'x', start_datetime: 'y' }), 'evento');
    assert.equal(tipoDeLinea({ event_slug: 'x', rights_status: 'unknown' }), 'imagen');
    assert.equal(tipoDeLinea({ title: 'x', source_url: 'y', published_at: 'z' }), 'noticia');
  });

  test('las reglas avisan de una edición que no coincide con la fecha', () => {
    const rio = porRef(cola(), 'PRB-RIO26').normalizado;
    const alertas = validarReglas({ ...rio, titulo: 'Festival de Prueba del Río 2025' }, { hoy: HOY });
    assert.ok(alertas.some((a) => a.tipo === 'edicion'));
  });
});
