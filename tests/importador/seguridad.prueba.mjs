// Seguridad del importador: SSRF, dominios, validación real del archivo, límites y secretos.
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { ipPrivada, revisarUrl, lookupSeguro, descargar } from '../../scripts/imagenes/red.mjs';
import { detectarFormato, procesarImagen } from '../../scripts/imagenes/archivo.mjs';
import { POLITICA_BASE } from '../../scripts/imagenes/politica.mjs';
import { revisar } from '../../scripts/revisar-secretos.mjs';
import { imagen, politicaPrueba, servidor } from './ayudas.mjs';

const P = { ...POLITICA_BASE, dominiosPermitidos: ['cdn-oficial.com.co'] };

describe('Direcciones internas o privadas', () => {
  for (const ip of ['::ffff:a00:1', '::ffff:7f00:1', 'fec0::1', '100::1', '2001::1', '2001:0:4136:e378::1', '127.0.0.1', '10.1.2.3', '172.20.0.1', '192.168.1.1', '169.254.169.254', '100.64.0.1', '0.0.0.0', '::1', '::', 'fe80::1', 'fd00::1', '::ffff:10.0.0.1', '::ffff:127.0.0.1', '64:ff9b::a00:1', 'no-es-ip']) {
    test(`bloquea ${ip}`, () => assert.equal(ipPrivada(ip), true));
  }
  for (const ip of ['8.8.8.8', '104.16.1.1', '2606:4700::1111', '::ffff:8.8.8.8']) {
    test(`permite ${ip}`, () => assert.equal(ipPrivada(ip), false));
  }
});

describe('URL permitidas (política de producción)', () => {
  const rechaza = (url, ctx = {}) => assert.throws(() => revisarUrl(url, P, ctx), (e) => e.codigo === 'url_no_permitida');
  test('solo https', () => rechaza('http://cdn-oficial.com.co/a.jpg'));
  test('sin IP en la URL', () => rechaza('https://169.254.169.254/latest/meta-data'));
  test('sin IPv6 en la URL', () => rechaza('https://[::1]/a.jpg'));
  test('sin usuario ni contraseña', () => rechaza('https://u:p@cdn-oficial.com.co/a.jpg'));
  test('sin puertos raros', () => rechaza('https://cdn-oficial.com.co:8443/a.jpg'));
  test('sin localhost', () => rechaza('https://localhost/a.jpg'));
  test('sin otros esquemas', () => rechaza('file:///etc/passwd'));
  test('dominio que no está en la lista', () => rechaza('https://otro-sitio.com/a.jpg'));
  test('un dominio que solo termina parecido no pasa', () => rechaza('https://falso-cdn-oficial.com.co/a.jpg'));
  test('dominio de la lista y sus subdominios', () => {
    assert.ok(revisarUrl('https://cdn-oficial.com.co/a.jpg', P));
    assert.ok(revisarUrl('https://img.cdn-oficial.com.co/a.jpg', P));
  });
  test('el host exacto de la fuente oficial se permite; el de una fuente no oficial no', () => {
    assert.ok(revisarUrl('https://www.idartes.gov.co/a.jpg', P, { fuenteUrl: 'https://www.idartes.gov.co/evento', fuenteOficial: true }));
    rechaza('https://www.idartes.gov.co/a.jpg', { fuenteUrl: 'https://www.idartes.gov.co/evento', fuenteOficial: false });
  });
  test('la fuente no abre subdominios ni sufijos públicos', () => {
    rechaza('https://media.idartes.gov.co/a.jpg', { fuenteUrl: 'https://www.idartes.gov.co/evento', fuenteOficial: true });
    rechaza('https://evil.com.co/x.jpg', { fuenteUrl: 'https://com.co/', fuenteOficial: true });
    rechaza('https://evil.co/x.jpg', { fuenteUrl: 'https://co/', fuenteOficial: true });
  });
});

describe('Resolución DNS segura', () => {
  const resolverA = (ip) => (_h, _o, cb) => cb(null, [{ address: ip, family: ip.includes(':') ? 6 : 4 }]);
  test('rechaza un dominio permitido que resuelve a la red interna', async () => {
    const error = await new Promise((ok) => lookupSeguro(P, resolverA('10.0.0.7'))('cdn-oficial.com.co', {}, (e) => ok(e)));
    assert.equal(error.codigo, 'url_no_permitida');
  });
  test('rechaza un dominio que resuelve a los metadatos de la nube', async () => {
    await assert.rejects(
      descargar('https://cdn-oficial.com.co/a.jpg', { ...P, esperaMs: 2000 }, {}, resolverA('169.254.169.254')),
      (e) => e.codigo === 'url_no_permitida',
    );
  });
  test('deja pasar una IP pública', async () => {
    const r = await new Promise((ok) => lookupSeguro(P, resolverA('104.16.1.1'))('cdn-oficial.com.co', {}, (e, ip) => ok(e ?? ip)));
    assert.equal(r, '104.16.1.1');
  });
});

describe('Descarga', () => {
  test('redirecciones: revisa cada salto y corta los bucles', async () => {
    const srv = await servidor({
      '/bucle': (_q, res) => res.writeHead(302, { location: '/bucle' }).end(),
      '/afuera': (_q, res) => res.writeHead(302, { location: 'http://169.254.169.254/latest' }).end(),
    });
    try {
      const pol = politicaPrueba();
      await assert.rejects(descargar(`${srv.base}/bucle`, pol), (e) => e.codigo === 'url_no_permitida' && /redirecciones/.test(e.message));
      // El destino de la redirección se revisa otra vez: 169.254.169.254 no está en los dominios permitidos
      await assert.rejects(descargar(`${srv.base}/afuera`, pol), (e) => e.codigo === 'url_no_permitida' && /169\.254\.169\.254/.test(e.message));
    } finally {
      await srv.cerrar();
    }
  });

  test('corta archivos más grandes que el límite aunque no digan su tamaño', async () => {
    const srv = await servidor({
      '/gigante': (_q, res) => {
        res.writeHead(200, { 'content-type': 'image/jpeg' });
        const parte = Buffer.alloc(64 * 1024, 1);
        let n = 0;
        const t = setInterval(() => (n++ < 40 && !res.destroyed ? res.write(parte) : (clearInterval(t), res.end())), 1);
      },
    });
    try {
      await assert.rejects(descargar(`${srv.base}/gigante`, politicaPrueba({ maxBytesImagen: 256 * 1024 })), (e) => e.codigo === 'archivo_muy_grande');
    } finally {
      await srv.cerrar();
    }
  });

  test('un 500 de la fuente queda como falla temporal (reintentable)', async () => {
    const srv = await servidor({ '/caida': (_q, res) => res.writeHead(503).end() });
    try {
      await assert.rejects(descargar(`${srv.base}/caida`, politicaPrueba()), (e) => e.codigo === 'descarga_fallida' && e.reintentable);
    } finally {
      await srv.cerrar();
    }
  });
});

describe('Validación real del archivo', () => {
  test('reconoce JPEG, PNG, WebP y AVIF por sus bytes', async () => {
    assert.equal(detectarFormato(await imagen(600, 400, undefined, 'jpeg')), 'jpeg');
    assert.equal(detectarFormato(await imagen(600, 400, undefined, 'png')), 'png');
    assert.equal(detectarFormato(await imagen(600, 400, undefined, 'webp')), 'webp');
    assert.equal(detectarFormato(await imagen(600, 400, undefined, 'avif')), 'avif');
  });
  for (const [nombre, contenido] of [
    ['SVG con script', '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>'],
    ['HTML disfrazado de .jpg', '<!doctype html><html><body>hola</body></html>'],
    ['GIF', 'GIF89a\x01\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00'],
    ['texto', 'esto no es una imagen, aunque se llame foto.jpg'],
  ]) {
    test(`rechaza ${nombre}`, async () => {
      await assert.rejects(procesarImagen(Buffer.from(contenido), POLITICA_BASE), (e) => e.codigo === 'archivo_invalido');
    });
  }
  test('rechaza un JPEG con cabecera válida pero dañado', async () => {
    const roto = Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), Buffer.alloc(200, 7)]);
    await assert.rejects(procesarImagen(roto, POLITICA_BASE), (e) => e.codigo === 'archivo_invalido');
  });
  test('rechaza imágenes muy pequeñas', async () => {
    await assert.rejects(procesarImagen(await imagen(300, 200), POLITICA_BASE), (e) => e.codigo === 'imagen_muy_pequena');
  });
  test('rechaza imágenes con demasiados píxeles (bomba de descompresión)', async () => {
    await assert.rejects(procesarImagen(await imagen(2000, 2000, undefined, 'png'), { ...POLITICA_BASE, maxPixeles: 1_000_000 }), (e) => e.codigo === 'archivo_invalido');
  });
  test('convierte a WebP en 480, 960 y 1600 px sin agrandar y sin metadatos', async () => {
    const r = await procesarImagen(await imagen(2400, 1600), POLITICA_BASE);
    assert.deepEqual(r.variantes.map((v) => v.ancho), [480, 960, 1600]);
    for (const v of r.variantes) assert.equal(detectarFormato(v.buffer), 'webp');
    assert.equal(r.version.length, 16);
    assert.equal(r.alto, 1067);
    const chica = await procesarImagen(await imagen(800, 600), POLITICA_BASE);
    assert.deepEqual(chica.variantes.map((v) => v.ancho), [480]);
  });
});

describe('Secretos', () => {
  test('detecta credenciales y no marca los ejemplos', () => {
    const dir = mkdtempSync(join(tmpdir(), 'fe-secretos-'));
    // Armados por partes para que este mismo archivo no parezca tener credenciales
    writeFileSync(join(dir, 'malo.env'), 'CLOUDFLARE_API_' + 'TOKEN=' + 'abcdefghijklmnopqrstuvwxyz0123456789ABCD\n');
    writeFileSync(join(dir, 'llave.txt'), '-----BEGIN ' + 'PRIVATE KEY-----\nxxx\n');
    writeFileSync(join(dir, 'ejemplo.md'), 'CLOUDFLARE_API_TOKEN=TU_TOKEN_AQUI\nCLOUDFLARE_API_TOKEN=\n');
    const h = revisar(dir, [join(dir, 'malo.env'), join(dir, 'llave.txt'), join(dir, 'ejemplo.md')]);
    assert.deepEqual(h.map((x) => x.archivo).sort(), ['llave.txt', 'malo.env']);
  });
});
