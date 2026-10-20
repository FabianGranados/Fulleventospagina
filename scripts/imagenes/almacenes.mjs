// Dónde se guardan los datos (D1) y los archivos (R2). Tres modos con la misma interfaz:
// - cloudflare: D1 por la API REST (consultas con parámetros) y R2 con `wrangler r2 object put --remote`.
// - local: SQLite en registros/imagenes-local.sqlite y una carpeta como bucket (para probar sin Cloudflare).
// - memoria: todo en memoria (pruebas y --simular).
// db.consultar(sql, params) → filas · db.ejecutar(sql, params) → { cambios, ultimoId } · r2.subir(clave, buffer, op)
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync, mkdtempSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { ErrorImagen } from './politica.mjs';

// Todas las migraciones en orden (0001 imágenes, 0002 eventos, 0003 municipios…): la base local y la de memoria
// quedan iguales a la de D1. Cada migración es segura de repetir.
const CARPETA_MIGRACIONES = join(import.meta.dirname, '..', '..', 'migraciones');
export const MIGRACIONES = readdirSync(CARPETA_MIGRACIONES).filter((f) => /^\d{4}_.+\.sql$/.test(f)).sort().map((f) => join(CARPETA_MIGRACIONES, f));

// ---------- Reintentos (fallas temporales de R2, D1 o la red) ----------

export const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

export const reintentar = async (fn, { intentos = 3, baseMs = 500, alReintentar } = {}) => {
  let ultimo;
  for (let i = 1; i <= intentos; i++) {
    try {
      return await fn(i);
    } catch (e) {
      ultimo = e;
      if (e?.reintentable === false || i === intentos) break;
      alReintentar?.(e, i);
      await esperar(baseMs * 2 ** (i - 1));
    }
  }
  throw ultimo;
};

// ---------- SQLite (memoria o archivo local) ----------

export const abrirSqlite = async (ruta) => {
  // node:sqlite es estable en la práctica pero Node 22 avisa que es experimental; se silencia ese aviso
  const emitir = process.emitWarning;
  process.emitWarning = (w, ...resto) => (String(w).includes('SQLite') ? undefined : emitir.call(process, w, ...resto));
  const { DatabaseSync } = await import('node:sqlite');
  process.emitWarning = emitir;
  if (ruta !== ':memory:') mkdirSync(dirname(ruta), { recursive: true });
  const db = new DatabaseSync(ruta);
  for (const m of MIGRACIONES) db.exec(readFileSync(m, 'utf8'));
  const normalizar = (params) => params.map((p) => (p === undefined ? null : typeof p === 'boolean' ? Number(p) : p));
  return {
    consultar: async (sql, params = []) => db.prepare(sql).all(...normalizar(params)),
    ejecutar: async (sql, params = []) => {
      const r = db.prepare(sql).run(...normalizar(params));
      return { cambios: Number(r.changes), ultimoId: Number(r.lastInsertRowid) };
    },
    cerrar: () => db.close(),
  };
};

export const crearAlmacenMemoria = async () => {
  const objetos = new Map();
  return {
    modo: 'memoria',
    db: await abrirSqlite(':memory:'),
    r2: {
      objetos,
      subir: async (clave, buffer, op) => void objetos.set(clave, { buffer, ...op }),
    },
  };
};

export const crearAlmacenLocal = async (raiz = process.cwd(), base = join(raiz, 'registros')) => {
  const carpeta = join(base, 'r2-local');
  return {
    modo: 'local',
    // EVENTOS_SQLITE_LOCAL (npm run d1:local, etapa B2): la base D1 local que lee el sitio, en vez de registros/
    db: await abrirSqlite(process.env.EVENTOS_SQLITE_LOCAL || join(base, 'imagenes-local.sqlite')),
    r2: {
      carpeta,
      subir: async (clave, buffer) => {
        const destino = join(carpeta, ...clave.split('/'));
        mkdirSync(dirname(destino), { recursive: true });
        writeFileSync(destino, buffer);
      },
    },
  };
};

// ---------- Cloudflare ----------

const variable = (nombre, env) => {
  const v = env[nombre]?.trim();
  if (!v) throw new ErrorImagen('configuracion', `Falta la variable ${nombre} (ver docs/imagenes-r2.md, .env.importador)`);
  return v;
};

// Ejecuta wrangler sin shell (los argumentos no se interpretan) y sin mostrar el token
const ejecutarWrangler = (args, env) =>
  new Promise((resolve, reject) => {
    const require = createRequire(import.meta.url);
    const bin = join(dirname(require.resolve('wrangler/package.json')), 'bin', 'wrangler.js');
    const hijo = spawn(process.execPath, [bin, ...args], { env, stdio: ['ignore', 'pipe', 'pipe'] });
    let salida = '';
    hijo.stdout.on('data', (d) => (salida += d));
    hijo.stderr.on('data', (d) => (salida += d));
    hijo.on('error', reject);
    hijo.on('close', (codigo) => (codigo === 0 ? resolve(salida) : reject(new Error(salida.slice(-600) || `wrangler salió con ${codigo}`))));
  });

export const crearAlmacenCloudflare = ({ env = process.env, fetchFn = fetch, ejecutar = ejecutarWrangler, baseMs = 800 } = {}) => {
  const cuenta = variable('CLOUDFLARE_ACCOUNT_ID', env);
  const token = variable('CLOUDFLARE_API_TOKEN', env);
  const baseD1 = variable('D1_DATABASE_ID', env);
  const bucket = env.R2_BUCKET?.trim() || 'fulleventos-imagenes';
  const url = `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(cuenta)}/d1/database/${encodeURIComponent(baseD1)}/query`;

  // Las lecturas se reintentan ante cualquier falla temporal. Las escrituras solo ante 429 (rechazada antes de
  // ejecutarse): tras un corte de red o un 5xx podría haberse aplicado y repetirla chocaría con los índices únicos.
  const d1 = (sql, params) => {
    const lectura = /^\s*select/i.test(sql);
    return reintentar(
      async () => {
        let r;
        try {
          r = await fetchFn(url, {
            method: 'POST',
            headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
            body: JSON.stringify({ sql, params: params.map((p) => (p === undefined ? null : typeof p === 'boolean' ? Number(p) : p)) }),
          });
        } catch (e) {
          throw new ErrorImagen('d1', `Sin conexión con D1: ${e.message}`, { reintentable: lectura });
        }
        const cuerpo = await r.json().catch(() => ({}));
        if (!r.ok || cuerpo.success === false) {
          const detalle = (cuerpo.errors ?? []).map((e) => e.message).join('; ') || `HTTP ${r.status}`;
          throw new ErrorImagen('d1', `D1 rechazó la consulta: ${detalle}`, { reintentable: r.status === 429 || (lectura && r.status >= 500) });
        }
        return cuerpo.result?.[0] ?? { results: [], meta: {} };
      },
      { baseMs },
    );
  };

  return {
    modo: 'cloudflare',
    bucket,
    db: {
      consultar: async (sql, params = []) => (await d1(sql, params)).results ?? [],
      ejecutar: async (sql, params = []) => {
        const { meta = {} } = await d1(sql, params);
        return { cambios: Number(meta.changes ?? 0), ultimoId: Number(meta.last_row_id ?? 0) };
      },
    },
    r2: {
      subir: async (clave, buffer, { tipo, cache }) => {
        if (!/^[a-z0-9/_.-]+$/.test(clave)) throw new ErrorImagen('r2', `Clave de objeto inválida: ${clave}`);
        const carpeta = mkdtempSync(join(tmpdir(), 'fe-r2-'));
        const archivo = join(carpeta, 'objeto');
        writeFileSync(archivo, buffer);
        try {
          await reintentar(
            () =>
              ejecutar(
                ['r2', 'object', 'put', `${bucket}/${clave}`, '--file', archivo, '--content-type', tipo, '--cache-control', cache, '--remote'],
                { ...env, CLOUDFLARE_ACCOUNT_ID: cuenta, CLOUDFLARE_API_TOKEN: token, WRANGLER_SEND_METRICS: 'false' },
              ).catch((e) => {
                throw new ErrorImagen('r2', `No se pudo subir ${clave} a R2: ${e.message}`, { reintentable: true });
              }),
            { baseMs },
          );
        } finally {
          rmSync(carpeta, { recursive: true, force: true });
        }
      },
    },
  };
};
