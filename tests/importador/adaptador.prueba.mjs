// Adaptador fulleventos_event_images.jsonl → importador. Usa una muestra con los defectos típicos de un informe
// de Deep Research (texto alrededor, bloques ```, comillas tipográficas, comas finales, "N/A", "sí", fechas
// DD/MM/AAAA, líneas cortadas, refs repetidas) y eventos que no existen todavía.
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { adaptar, sinPerdida, idCiudad } from '../../scripts/imagenes/adaptar.mjs';
import { importar } from '../../scripts/imagenes/importador.mjs';
import { crearCatalogo, cargarEventos } from '../../scripts/imagenes/catalogo.mjs';
import { ciudades } from '../../src/data/ciudades.ts';
import { almacenPrueba } from './ayudas.mjs';
import { POLITICA_BASE } from '../../scripts/imagenes/politica.mjs';

const muestra = readFileSync(join(import.meta.dirname, 'muestras', 'fulleventos_event_images.jsonl'), 'utf8');
const eventos = await cargarEventos();
const correr = () => adaptar({ contenido: muestra, eventos, ciudades });
const lineas = (jsonl) => jsonl.trim().split('\n').filter(Boolean).map((l) => JSON.parse(l));

describe('Adaptador de Gemini', () => {
  test('separa eventos existentes y nuevos, y reporta lo que no pudo leer', () => {
    const { reporte } = correr();
    assert.equal(reporte.eventos, 5);
    assert.equal(reporte.eventos_existentes, 3); // e3 (dos veces) y e2 encontrado por título + ciudad + fecha
    assert.equal(reporte.eventos_nuevos, 2); // Barranquilla 14 nov y Manizales (ciudad que aún no existe)
    assert.equal(reporte.imagenes_a_importar, 3);
    assert.equal(reporte.imagenes_de_eventos_nuevos, 1);
    assert.equal(reporte.refs_repetidas, 1);
    assert.equal(reporte.lineas_ignoradas, 4); // texto, ``` de apertura y cierre, notas
    assert.deepEqual(reporte.errores.map((e) => e.linea), [8, 9]);
    assert.match(reporte.errores[0].error, /al menos una fuente/);
    const avisos = reporte.avisos.flatMap((a) => a.avisos).join(' | ');
    for (const esperado of ['comas finales', 'comillas tipográficas', 'día/mes/año', 'se leyó como 40000', 'ref repetida']) {
      assert.ok(avisos.includes(esperado), `falta el aviso "${esperado}"`);
    }
  });

  test('no pierde fuentes, licencias ni evidencias', () => {
    const r = lineas(correr().imagenesJsonl);
    const rock = r.find((x) => x.imagen.url.endsWith('rock-1600.jpg'));
    assert.equal(rock.evento.id, 'e3');
    assert.equal(rock.fuente.nombre, 'Movistar Arena');
    assert.equal(rock.derechos.licencia, 'Kit de prensa: uso editorial con crédito');
    assert.match(rock.derechos.evidencia, /condiciones — "Las imágenes de este kit pueden usarse/);
    assert.match(rock.derechos.evidencia, /sección de prensa del escenario/);
    assert.match(rock.derechos.evidencia, /Licencia: https:\/\/www\.arena\.example\/prensa\/condiciones/);
    assert.equal(rock.imagen.credito, 'Foto: Laura Gómez');
    assert.equal(rock.ref_externa, 'gemini-bog-2026-10-10-rock-movistar');
    // La procedencia guarda la imagen original completa y las fuentes del evento
    assert.equal(rock.procedencia.imagen.derechos.evidencias.length, 2);
    assert.equal(rock.procedencia.imagen.pagina, 'https://www.arena.example/prensa');
    assert.equal(rock.procedencia.evento_fuentes[0].consultado_en, '2026-10-11');
    for (const x of r) assert.deepEqual(sinPerdida(x.procedencia.imagen, x), []);
    // Gemini no puede declarar revisión humana
    assert.ok(r.every((x) => x.derechos.verificado_por === 'agente'));
  });

  test('limpia valores: "sí" → true, "N/A" → ausente, fecha DD/MM/AAAA → ISO', () => {
    const jazz = lineas(correr().imagenesJsonl).find((x) => x.evento.id === 'e2');
    assert.equal(jazz.fuente.oficial, true);
    assert.equal(jazz.derechos.verificado_en, '2026-10-11');
    assert.equal(jazz.imagen.tipo, 'afiche');
  });

  test('los eventos nuevos quedan completos en la cola, con posibles duplicados', () => {
    const nuevos = lineas(correr().eventosNuevosJsonl);
    assert.deepEqual(nuevos.map((n) => n.ref), ['gemini-baq-2026-11-14-salsa-malecon', 'gemini-mzl-2026-11-21-feria-teatro']);
    const [salsa, teatro] = nuevos;
    assert.equal(salsa.ciudad_id, 'barranquilla');
    assert.equal(salsa.evento.hora, '20:00');
    assert.equal(salsa.evento.fuentes[0].url, 'https://www.malecon.example/salsa');
    assert.equal(salsa.imagenes[0].derechos.evidencias[0].texto, 'Se pidió permiso por correo al organizador');
    assert.equal(teatro.ciudad_id, 'manizales');
    assert.equal(teatro.evento.precio_desde, 40000);
    assert.deepEqual(teatro.posibles_duplicados, []);
  });

  test('es determinista: dos corridas dan los mismos archivos', () => {
    const a = correr();
    const b = correr();
    assert.equal(a.imagenesJsonl, b.imagenesJsonl);
    assert.equal(a.eventosNuevosJsonl, b.eventosNuevosJsonl);
  });

  test('la salida pasa el esquema del importador y guarda la procedencia en D1', async () => {
    const almacen = await almacenPrueba();
    const r = await importar({ contenido: correr().imagenesJsonl, almacen, catalogo: crearCatalogo(eventos), politica: POLITICA_BASE });
    assert.equal(r.rechazadas, 0, JSON.stringify(r.detalles));
    assert.equal(r.pendientes, 3); // nada se publica sin revisión humana
    const filas = await almacen.db.consultar('SELECT ref_externa, procedencia, derechos_evidencia FROM imagenes_evento ORDER BY id');
    assert.equal(filas.length, 3);
    assert.equal(JSON.parse(filas[0].procedencia).imagen.derechos.licencia_url, 'https://www.arena.example/prensa/condiciones');
    assert.equal(filas[0].ref_externa, 'gemini-bog-2026-10-10-rock-movistar');
    // Reimportar el mismo resultado no duplica
    const otra = await importar({ contenido: correr().imagenesJsonl, almacen, catalogo: crearCatalogo(eventos), politica: POLITICA_BASE });
    assert.equal(otra.duplicadas, 3);
  });

  test('reconoce ciudades con variantes de escritura', () => {
    assert.equal(idCiudad('Bogotá D.C.', ciudades), 'bogota');
    assert.equal(idCiudad('SANTA MARTA', ciudades), 'santamarta');
    assert.equal(idCiudad('Medellín', ciudades), 'medellin');
  });
});
