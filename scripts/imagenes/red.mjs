// Descarga segura de imágenes (protección contra SSRF).
// - Solo https y solo dominios permitidos (lista de la política o el dominio de la fuente oficial).
// - Ni IP escritas en la URL ni nombres que resuelvan a direcciones internas o privadas. La validación se hace en
//   el mismo `lookup` que usa la conexión, así un DNS que cambia entre la revisión y la conexión no la salta.
// - Redirecciones contadas y revisadas una por una; tamaño máximo cortando el flujo; tiempo máximo.
import http from 'node:http';
import https from 'node:https';
import dns from 'node:dns';
import net from 'node:net';
import { ErrorImagen } from './politica.mjs';

// ---------- Direcciones IP ----------

const ipv4ANumero = (ip) => ip.split('.').reduce((n, o) => n * 256 + Number(o), 0);
const enRango = (ip, base, bits) => {
  const mascara = bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0;
  return ((ipv4ANumero(ip) & mascara) >>> 0) === ((ipv4ANumero(base) & mascara) >>> 0);
};

const RANGOS_V4 = [
  ['0.0.0.0', 8], // "esta" red
  ['10.0.0.0', 8], // privada
  ['100.64.0.0', 10], // CGNAT
  ['127.0.0.0', 8], // loopback
  ['169.254.0.0', 16], // enlace local (metadatos de nube: 169.254.169.254)
  ['172.16.0.0', 12], // privada
  ['192.0.0.0', 24], // asignaciones IETF
  ['192.0.2.0', 24], // documentación
  ['192.88.99.0', 24], // 6to4 relay
  ['192.168.0.0', 16], // privada
  ['198.18.0.0', 15], // pruebas de rendimiento
  ['198.51.100.0', 24], // documentación
  ['203.0.113.0', 24], // documentación
  ['224.0.0.0', 4], // multicast
  ['240.0.0.0', 4], // reservada y broadcast
];

export const ipPrivada = (ip) => {
  const tipo = net.isIP(ip);
  if (tipo === 4) return RANGOS_V4.some(([base, bits]) => enRango(ip, base, bits));
  if (tipo === 6) {
    const v = ip.toLowerCase().split('%')[0];
    // IPv4 dentro de IPv6 (::ffff:10.0.0.1, ::10.0.0.1, 64:ff9b::10.0.0.1)
    const v4 = v.match(/(\d{1,3}(?:\.\d{1,3}){3})$/);
    if (v4) return ipPrivada(v4[1]) || !v.startsWith('::ffff:');
    // IPv4 mapeada escrita en hexadecimal (::ffff:a00:1)
    const hex = v.match(/^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/);
    if (hex) {
      const [a, b] = [parseInt(hex[1], 16), parseInt(hex[2], 16)];
      return ipPrivada(`${a >> 8}.${a & 255}.${b >> 8}.${b & 255}`);
    }
    if (v === '::' || v === '::1') return true;
    const primero = parseInt(v.split(':')[0] || '0', 16);
    if ((primero & 0xfe00) === 0xfc00) return true; // fc00::/7 única local
    if ((primero & 0xffc0) === 0xfe80) return true; // fe80::/10 enlace local
    if ((primero & 0xffc0) === 0xfec0) return true; // fec0::/10 sitio local (obsoleta)
    if (/^100:0{0,4}:0{0,4}:0{0,4}:/.test(v) || v.startsWith('100::')) return true; // 100::/64 descarte
    if (/^2001:0{0,4}:/.test(v) || v.startsWith('2001::')) return true; // 2001::/32 Teredo
    if ((primero & 0xff00) === 0xff00) return true; // ff00::/8 multicast
    if (v.startsWith('2001:db8') || v.startsWith('2001:0db8')) return true; // documentación
    if (v.startsWith('64:ff9b:')) return true; // NAT64 (puede apuntar a la red interna)
    if (v.startsWith('2002:')) return true; // 6to4 (lleva una IPv4 adentro)
    return false;
  }
  return true; // lo que no es IP válida no pasa
};

// ---------- Dominios ----------

const dominioCoincide = (host, dominio) => {
  const d = dominio.toLowerCase().replace(/^\*?\./, '');
  return host === d || host.endsWith(`.${d}`);
};

// ¿Se puede descargar esta URL? Devuelve el URL normalizado o lanza ErrorImagen('url_no_permitida').
export const revisarUrl = (texto, politica, { fuenteUrl, fuenteOficial } = {}) => {
  let url;
  try {
    url = new URL(texto);
  } catch {
    throw new ErrorImagen('url_no_permitida', `URL inválida: ${String(texto).slice(0, 200)}`);
  }
  if (!politica.protocolos.includes(url.protocol)) {
    throw new ErrorImagen('url_no_permitida', `Protocolo no permitido (${url.protocol}); solo ${politica.protocolos.join(', ')}`);
  }
  if (url.username || url.password) throw new ErrorImagen('url_no_permitida', 'La URL no puede llevar usuario ni contraseña');
  const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, '').replace(/\.$/, '');
  if (net.isIP(host) && !politica.permitirIpPrivadas) {
    throw new ErrorImagen('url_no_permitida', 'No se descarga de direcciones IP escritas en la URL');
  }
  if (url.port && !['443', '80'].includes(url.port) && !politica.permitirIpPrivadas) {
    throw new ErrorImagen('url_no_permitida', `Puerto no permitido (${url.port})`);
  }
  const permitidos = [...politica.dominiosPermitidos];
  if (politica.permitirDominioDeLaFuente && fuenteOficial && fuenteUrl) {
    try {
      // Solo el host exacto de la página oficial (sin subdominios ni sufijos como "com.co")
      const f = new URL(fuenteUrl);
      const fh = f.hostname.toLowerCase().replace(/\.$/, '');
      if (f.protocol === 'https:' && !net.isIP(fh) && fh.split('.').length >= 2 && host === fh) return url;
    } catch {
      /* fuente inválida: solo cuenta la lista */
    }
  }
  if (!permitidos.some((d) => dominioCoincide(host, d))) {
    throw new ErrorImagen(
      'url_no_permitida',
      `El dominio ${host} no está permitido. Agrégalo a dominiosPermitidos en scripts/imagenes/politica.json si es una fuente oficial.`,
    );
  }
  return url;
};

// lookup que rechaza direcciones internas: lo usa la propia conexión (sin ventana para un cambio de DNS)
export const lookupSeguro = (politica, resolver = dns.lookup) => (hostname, opciones, cb) => {
  resolver(hostname, { ...opciones, all: true }, (error, direcciones) => {
    if (error) return cb(error);
    const lista = Array.isArray(direcciones) ? direcciones : [{ address: direcciones, family: opciones?.family ?? 4 }];
    if (!lista.length) return cb(new ErrorImagen('url_no_permitida', `${hostname} no resuelve`));
    if (!politica.permitirIpPrivadas) {
      const interna = lista.find((d) => ipPrivada(d.address));
      if (interna) {
        return cb(new ErrorImagen('url_no_permitida', `${hostname} resuelve a una dirección interna (${interna.address})`));
      }
    }
    if (opciones?.all) return cb(null, lista);
    cb(null, lista[0].address, lista[0].family);
  });
};

// ---------- Descarga ----------

const pedirUna = (url, politica, resolver) =>
  new Promise((resolve, reject) => {
    const modulo = url.protocol === 'https:' ? https : http;
    const req = modulo.request(
      url,
      {
        method: 'GET',
        lookup: lookupSeguro(politica, resolver),
        headers: {
          'user-agent': 'FulleventosImportador/1.0 (+https://www.fulleventos.com.co)',
          accept: 'image/avif,image/webp,image/png,image/jpeg;q=0.9,*/*;q=0.1',
        },
        timeout: politica.esperaMs,
      },
      (res) => {
        const codigo = res.statusCode ?? 0;
        if (codigo >= 300 && codigo < 400 && res.headers.location) {
          res.resume();
          return resolve({ redireccion: new URL(res.headers.location, url).toString() });
        }
        if (codigo !== 200) {
          res.resume();
          return reject(
            new ErrorImagen('descarga_fallida', `La fuente respondió ${codigo}`, { reintentable: codigo >= 500 || codigo === 429 }),
          );
        }
        const largo = Number(res.headers['content-length'] ?? 0);
        if (largo > politica.maxBytesImagen) {
          res.destroy();
          return reject(new ErrorImagen('archivo_muy_grande', `El archivo pesa ${largo} bytes (máximo ${politica.maxBytesImagen})`));
        }
        const partes = [];
        let total = 0;
        res.on('data', (parte) => {
          total += parte.length;
          if (total > politica.maxBytesImagen) {
            res.destroy();
            reject(new ErrorImagen('archivo_muy_grande', `El archivo supera ${politica.maxBytesImagen} bytes`));
            return;
          }
          partes.push(parte);
        });
        res.on('end', () => resolve({ bytes: Buffer.concat(partes), tipoContenido: String(res.headers['content-type'] ?? '') }));
        res.on('error', (e) => reject(new ErrorImagen('descarga_fallida', e.message, { reintentable: true })));
      },
    );
    req.on('timeout', () => req.destroy(new ErrorImagen('descarga_fallida', 'Tiempo de espera agotado', { reintentable: true })));
    // Plazo total (el timeout de arriba solo mide silencios): un servidor lento no retiene al importador
    const plazo = setTimeout(
      () => req.destroy(new ErrorImagen('descarga_fallida', `La descarga superó ${politica.esperaMs} ms`, { reintentable: true })),
      politica.esperaMs,
    );
    req.on('close', () => clearTimeout(plazo));
    req.on('error', (e) =>
      reject(e instanceof ErrorImagen ? e : new ErrorImagen('descarga_fallida', e.message, { reintentable: true })),
    );
    req.end();
  });

export const descargar = async (texto, politica, contexto = {}, resolver = dns.lookup) => {
  let actual = texto;
  for (let saltos = 0; saltos <= politica.maxRedirecciones; saltos++) {
    const url = revisarUrl(actual, politica, contexto);
    const r = await pedirUna(url, politica, resolver);
    if (!r.redireccion) return { ...r, urlFinal: url.toString() };
    actual = r.redireccion;
  }
  throw new ErrorImagen('url_no_permitida', `Más de ${politica.maxRedirecciones} redirecciones`);
};
