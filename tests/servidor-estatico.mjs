// Sirve dist/client para las pruebas (las páginas son estáticas). Uso: node tests/servidor-estatico.mjs [puerto]
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const raiz = join(process.cwd(), 'dist', 'client');
const puerto = Number(process.argv[2] ?? 4322);
const tipos = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
};

const resolver = async (ruta) => {
  const limpia = normalize(decodeURIComponent(ruta.split('?')[0])).replace(/^(\.\.[/\\])+/, '');
  for (const candidato of [join(raiz, limpia), join(raiz, limpia, 'index.html'), join(raiz, `${limpia}.html`)]) {
    if (!candidato.startsWith(raiz)) continue;
    try {
      if ((await stat(candidato)).isFile()) return candidato;
    } catch {}
  }
  return null;
};

createServer(async (req, res) => {
  const archivo = await resolver(req.url ?? '/');
  if (!archivo) {
    res.writeHead(404).end('No encontrado');
    return;
  }
  res.writeHead(200, { 'content-type': tipos[extname(archivo)] ?? 'application/octet-stream' });
  res.end(await readFile(archivo));
}).listen(puerto, () => console.log(`Sirviendo dist/client en http://localhost:${puerto}`));
