// Fotos de los eventos desde R2 (src/lib/fotos-eventos.ts y FotoEvento.astro). No toca Cloudflare: el "bucket"
// se simula con page.route y el sitio se apunta a él con el gancho de pruebas __FE_IMAGENES_URL__ (solo vale en
// localhost). Revisa que la foto aparezca sin cambiar las proporciones de las tarjetas, que sin foto o con fallas
// quede el degradado y que un índice alterado no pueda meter URL de otros sitios.
import { test, expect, type Page, type Route } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const R2 = 'http://localhost/__r2-prueba';
const axe = readFileSync(join(process.cwd(), 'node_modules', 'axe-core', 'axe.min.js'), 'utf8');
const VERSION = 'a1b2c3d4e5f60718';

let webp: Buffer;
test.beforeAll(async () => {
  webp = await sharp({ create: { width: 960, height: 1200, channels: 3, background: { r: 30, g: 120, b: 200 } } })
    .webp({ quality: 60 })
    .toBuffer();
});

const entrada = (id: string) => ({
  v: VERSION,
  variantes: Object.fromEntries([480, 960, 1600].map((w) => [String(w), `eventos/${id}/${VERSION}-${w}.webp`])),
  ancho: 1600,
  alto: 2000,
  alt: `Foto oficial de prueba del evento ${id}`,
});

const indiceBase = () => ({
  version: 1,
  generado: '2026-10-11T00:00:00Z',
  // e3 Rock en el Movistar Arena, e2 Festival de jazz al parque. e4 (Santa Fe vs. Millonarios) no tiene foto.
  eventos: { e3: entrada('e3'), e2: entrada('e2'), e12: entrada('e12'), e1: entrada('e1') } as Record<string, unknown>,
});

interface Opciones {
  indice?: object | 'error' | 'ausente';
  imagenes?: 'ok' | 'ausentes';
}

const preparar = async (page: Page, { indice = indiceBase(), imagenes = 'ok' }: Opciones = {}) => {
  const pedidos = { indice: 0, imagenes: 0, ajenos: [] as string[] };
  await page.addInitScript((url) => ((window as unknown as { __FE_IMAGENES_URL__: string }).__FE_IMAGENES_URL__ = url), R2);
  await page.route(`${R2}/**`, async (route: Route) => {
    const url = new URL(route.request().url());
    if (url.pathname.endsWith('/indice/eventos-v1.json')) {
      pedidos.indice++;
      if (indice === 'error') return route.fulfill({ status: 500, body: 'falla temporal' });
      if (indice === 'ausente') return route.fulfill({ status: 404, body: 'no existe' });
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(indice) });
    }
    pedidos.imagenes++;
    if (imagenes === 'ausentes') return route.fulfill({ status: 404, body: 'no existe' });
    return route.fulfill({ status: 200, contentType: 'image/webp', body: webp });
  });
  // Cualquier pedido fuera de localhost sería una URL inyectada por el índice
  page.on('request', (r) => {
    const host = new URL(r.url()).hostname;
    if (!['localhost', '127.0.0.1'].includes(host) && !host.endsWith('googleapis.com') && !host.endsWith('gstatic.com')) {
      pedidos.ajenos.push(r.url());
    }
  });
  const errores: string[] = [];
  page.on('pageerror', (e) => errores.push(e.message));
  return { pedidos, errores };
};

const tarjeta = (page: Page, id: string) => page.locator(`.afiche[data-id="${id}"]`).first();

for (const ancho of [390, 1280]) {
  test(`Bienvenida a ${ancho} px: foto en la tarjeta sin cambiar su tamaño`, async ({ page }) => {
    await page.setViewportSize({ width: ancho, height: 900 });
    // Primero sin fotos, para medir la tarjeta tal como es hoy
    await page.goto('/');
    const antes = await tarjeta(page, 'e3').boundingBox();

    const { pedidos, errores } = await preparar(page);
    await page.goto('/');
    const t = tarjeta(page, 'e3');
    await t.scrollIntoViewIfNeeded();
    const img = t.locator('.foto-evento img');
    await expect(img).toHaveCount(1);
    await expect(t.locator('.foto-evento')).toHaveClass(/cargada/);
    const despues = await t.boundingBox();
    expect(Math.round(despues!.width)).toBe(Math.round(antes!.width));
    expect(Math.round(despues!.height)).toBe(Math.round(antes!.height));
    // La foto cubre toda la tarjeta, recortada (object-fit: cover), y el texto sigue encima y legible
    const caja = await img.boundingBox();
    expect(Math.round(caja!.width)).toBe(Math.round(despues!.width));
    await expect(img).toHaveCSS('object-fit', 'cover');
    await expect(img).toHaveAttribute('loading', 'lazy');
    await expect(img).toHaveAttribute('srcset', /480w.*960w.*1600w/);
    await expect(t.locator('.titulo a')).toBeVisible();
    // e4 no tiene foto en el índice: conserva el degradado
    await expect(tarjeta(page, 'e4').locator('.foto-evento img')).toHaveCount(0);
    // Un solo índice por página, nada fuera del "bucket"
    expect(pedidos.indice).toBe(1);
    expect(pedidos.ajenos).toEqual([]);
    expect(errores).toEqual([]);
  });
}

test('Detalle del evento: foto con texto alternativo, sin el aviso [Foto del evento] y sin violaciones de axe', async ({ page }) => {
  await preparar(page);
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/evento/bogota/rock-en-el-movistar-arena/');
  const img = page.locator('.heroe .foto-evento img');
  await expect(img).toHaveAttribute('alt', 'Foto oficial de prueba del evento e3');
  await expect(img).toHaveAttribute('loading', 'eager');
  await expect(page.locator('.heroe .foto-evento')).toHaveClass(/cargada/);
  await expect(page.locator('.nota-foto')).toBeHidden();
  await expect(page.locator('#titulo-evento')).toBeVisible();
  await page.addScriptTag({ content: axe });
  const violaciones = await page.evaluate(async () => {
    const r = await (window as unknown as { axe: { run: (o: object) => Promise<{ violations: { id: string }[] }> } }).axe.run({
      runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'],
    });
    return r.violations.map((v) => v.id);
  });
  expect(violaciones).toEqual([]);
});

test('Evento sin foto: queda el degradado y el aviso del marcador', async ({ page }) => {
  await preparar(page);
  await page.goto('/evento/bogota/santa-fe-vs-millonarios/');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('.heroe .foto-evento img')).toHaveCount(0);
  await expect(page.locator('.nota-foto')).toBeVisible();
});

test('Agenda, Mapa y noticias usan las mismas fotos', async ({ page }) => {
  await preparar(page);
  await page.goto('/agenda/');
  await expect(page.locator('.afiche[data-id="e3"] .foto-evento img').first()).toHaveCount(1);
  await page.goto('/mapa/');
  // Lista del panel del mapa (miniatura compacta)
  await expect(page.locator('[data-id="e1"] .miniatura .foto-evento img').first()).toHaveCount(1);
  // Noticia sin foto propia ligada al evento e12 (vallenato en el Gran Malecón)
  await page.goto('/noticias/vallenato-en-el-gran-malecon-todos-los-sabados-de-octubre/');
  await expect(page.locator('.imagen .foto-evento img').first()).toHaveCount(1);
});

test('Índice caído (R2 con falla temporal): degradados, sin errores', async ({ page }) => {
  const { pedidos, errores } = await preparar(page, { indice: 'error' });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  expect(pedidos.indice).toBe(1);
  await expect(page.locator('.foto-evento img')).toHaveCount(0);
  expect(errores).toEqual([]);
});

test('Índice inexistente (bucket vacío): degradados, sin errores', async ({ page }) => {
  const { errores } = await preparar(page, { indice: 'ausente' });
  await page.goto('/agenda/');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('.foto-evento img')).toHaveCount(0);
  expect(errores).toEqual([]);
});

test('Imagen listada pero borrada de R2: se quita y queda el degradado', async ({ page }) => {
  const { errores } = await preparar(page, { imagenes: 'ausentes' });
  await page.goto('/evento/bogota/rock-en-el-movistar-arena/');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('.heroe .foto-evento img')).toHaveCount(0);
  await expect(page.locator('.nota-foto')).toBeVisible();
  expect(errores).toEqual([]);
});

test('Índice alterado: las rutas que no son del importador se ignoran', async ({ page }) => {
  const indice = indiceBase();
  indice.eventos.e3 = { ...entrada('e3'), variantes: { '960': 'https://sitio-ajeno.example/x.webp', '480': '../../secreto-480.webp' } };
  indice.eventos.e2 = { ...entrada('e2'), variantes: { '960': 'eventos/e2/"onerror="alert(1)-960.webp' } };
  const { pedidos, errores } = await preparar(page, { indice });
  await page.goto('/evento/bogota/rock-en-el-movistar-arena/');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('.heroe .foto-evento img')).toHaveCount(0);
  expect(pedidos.ajenos).toEqual([]);
  expect(errores).toEqual([]);
});

test('Sin PUBLIC_IMAGENES_URL (producción hoy): no se pide nada a R2', async ({ page }) => {
  let pedidos = 0;
  await page.route('**/indice/eventos-v1.json', (r) => {
    pedidos++;
    return r.abort();
  });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  expect(pedidos).toBe(0);
  await expect(page.locator('[data-foto-evento]').first()).toBeAttached();
});
