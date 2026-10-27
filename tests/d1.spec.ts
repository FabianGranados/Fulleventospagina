// Sitio en modo D1 (etapa B3), contra la base LOCAL aparte que arma `npm run test:d1` (scripts/eventos/pruebas-d1.mjs):
// los 19 eventos de ejemplo, 30 de prueba publicados (en Bogotá y en Manizales, que no es ciudad del sitio), uno
// pendiente que nunca debe verse y fotos de prueba para e1, e3 y e12. Revisa la paginación y los filtros en el
// servidor (también sin JavaScript), la caché, las fotos y las páginas que pasaron a leer D1.
import { test, expect, type Page } from '@playwright/test';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const axe = readFileSync(join(process.cwd(), 'node_modules', 'axe-core', 'axe.min.js'), 'utf8');
const CLAVE_SESION = 'fe-sesion-demo';
const BUCKET = join(process.cwd(), '.wrangler', 'pruebas-d1', 'registros', 'r2-local');

// El "bucket" (http://localhost:4580) lo sirve la prueba desde la carpeta del importador local
const servirFotos = async (page: Page, { caidas = false } = {}) =>
  page.route('http://localhost:4580/**', (route) => {
    const archivo = join(BUCKET, decodeURIComponent(new URL(route.request().url()).pathname));
    if (caidas || !existsSync(archivo)) return route.fulfill({ status: 404, body: 'no existe' });
    return route.fulfill({ status: 200, contentType: 'image/webp', body: readFileSync(archivo) });
  });

const tarjetasAgenda = (page: Page) => page.locator('[data-rejilla] [data-tarjeta]:not([hidden])');

const sinViolaciones = async (page: Page) => {
  await page.addScriptTag({ content: axe });
  const violaciones = await page.evaluate(async () => {
    // @ts-expect-error axe se inyecta arriba
    const r = await window.axe.run(document, {
      runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'],
    });
    return r.violations.map(
      (v: { id: string; nodes: { target: string[] }[] }) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`,
    );
  });
  expect(violaciones).toEqual([]);
};

test.describe('Agenda: filtros y páginas en el servidor', () => {
  test('pagina de a 24, con "Anterior" y "Siguiente" que funcionan sin JavaScript', async ({ browser }) => {
    const contexto = await browser.newContext({ javaScriptEnabled: false });
    const page = await contexto.newPage();
    await page.goto('/agenda');
    // 19 de ejemplo + 30 de prueba, todos del finde
    await expect(page.locator('[data-resultados]')).toContainText('49 planes');
    await expect(tarjetasAgenda(page)).toHaveCount(24);
    const nav = page.getByRole('navigation', { name: 'Páginas de la agenda' });
    await expect(nav).toContainText('Página 1 de 3');
    await expect(nav.getByRole('link', { name: /Anterior/ })).toHaveCount(0);

    await nav.getByRole('link', { name: /Siguiente/ }).click();
    await expect(page).toHaveURL(/\/agenda\?pagina=2$/);
    await expect(tarjetasAgenda(page)).toHaveCount(24);
    await expect(nav).toContainText('Página 2 de 3');

    await nav.getByRole('link', { name: /Siguiente/ }).click();
    await expect(tarjetasAgenda(page)).toHaveCount(1);
    await expect(nav.getByRole('link', { name: /Siguiente/ })).toHaveCount(0);
    await nav.getByRole('link', { name: /Anterior/ }).click();
    await expect(page).toHaveURL(/pagina=2/);

    // Ninguna tarjeta se repite entre páginas
    const ids = new Set<string>();
    for (const n of [1, 2, 3]) {
      await page.goto(`/agenda?pagina=${n}`);
      for (const id of await tarjetasAgenda(page).evaluateAll((ts) => ts.map((t) => (t as HTMLElement).dataset.id!))) {
        expect(ids.has(id)).toBe(false);
        ids.add(id);
      }
    }
    expect(ids.size).toBe(49);
    await contexto.close();
  });

  test('los filtros de la URL se resuelven en el servidor y conservan la página', async ({ browser }) => {
    const contexto = await browser.newContext({ javaScriptEnabled: false });
    const page = await contexto.newPage();

    await page.goto('/agenda?ciudad=bogota&categoria=deportes');
    // 1 de ejemplo (Santa Fe vs. Millonarios) + 10 de prueba en Bogotá
    await expect(page.locator('[data-resultados]')).toContainText('11 planes en Bogotá este finde');
    await expect(page.locator('h1')).toHaveText('Este finde en Bogotá');
    await expect(page.locator('[data-filtro="ciudad"]')).toContainText('Bogotá');
    await expect(page.locator('[data-filtro="categoria"]')).toContainText('Deportes');

    await page.goto('/agenda?categoria=mascotas&gratis=1');
    await expect(page.locator('[data-filtro-gratis]')).toHaveAttribute('aria-pressed', 'true');
    for (const t of await tarjetasAgenda(page).all()) {
      await expect(t).toHaveAttribute('data-oficial', 'mascotas');
      await expect(t).toHaveAttribute('data-gratis', 'true');
    }

    // Enlaces viejos con las 6 categorías del sitio
    await page.goto('/agenda?categoria=rumba');
    await expect(page.locator('[data-filtro="categoria"]')).toContainText('Rumba y vida nocturna');
    await page.goto('/agenda?categoria=gratis');
    await expect(page.locator('[data-filtro-gratis]')).toHaveAttribute('aria-pressed', 'true');

    // Sin planes: estado vacío del servidor
    await page.goto('/agenda?fecha=semana');
    await expect(tarjetasAgenda(page)).toHaveCount(0);
    await expect(page.locator('[data-vacio]')).toBeVisible();
    await expect(page.locator('[data-vacio-mensaje]')).toContainText('La próxima semana no hay planes');

    // Página fuera de rango: la última; valores raros: los iniciales
    await page.goto('/agenda?pagina=99');
    await expect(page.getByRole('navigation', { name: 'Páginas de la agenda' })).toContainText('Página 3 de 3');
    await page.goto('/agenda?ciudad=<script>&categoria=nada&pagina=-4');
    await expect(page.locator('[data-resultados]')).toContainText('49 planes');

    // La búsqueda también la aplica el servidor
    await page.goto('/agenda?q=plan%20de%20prueba%2017');
    await expect(tarjetasAgenda(page)).toHaveCount(1);
    await contexto.close();
  });

  test('con JavaScript, cambiar un filtro pide la página filtrada y vuelve a la página 1', async ({ page }) => {
    await page.goto('/agenda?pagina=2');
    await page.locator('[data-filtro-gratis]').click();
    await expect(page).toHaveURL(/\/agenda\?gratis=1$/);
    await expect(page.locator('[data-filtro-gratis]')).toHaveAttribute('aria-pressed', 'true');

    await page.locator('[data-filtro="categoria"]').click();
    await page.locator('#filtro-categoria label').filter({ hasText: 'Mascotas' }).click();
    await expect(page).toHaveURL(/categoria=mascotas/);
    await expect(page).toHaveURL(/gratis=1/);
    await expect(page.locator('[data-filtro="categoria"]')).toContainText('Mascotas');
  });

  test('nunca muestra un evento pendiente', async ({ page, request }) => {
    await page.goto('/agenda?q=pendiente');
    await expect(tarjetasAgenda(page)).toHaveCount(0);
    expect((await request.get('/evento/bogota/plan-pendiente-sin-revisar')).status()).toBe(404);
    for (const ruta of ['/', '/mapa', '/agenda?ciudad=bogota&categoria=deportes']) {
      expect(await (await request.get(ruta)).text()).not.toContain('Plan pendiente sin revisar');
    }
  });
});

test.describe('Mapa con D1 y las 14 categorías', () => {
  test('cuenta las categorías, filtra con "Gratis" y muestra los municipios que no son ciudad del sitio', async ({ page }) => {
    await page.goto('/mapa');
    await expect(page.locator('[data-panel-conteo]')).toHaveText('49 planes');
    // Manizales (D1) aparece en la lista, sin "Ver en el mapa" porque no tiene pin
    const manizales = page.locator('[data-grupo-ciudad="manizales"]');
    await expect(manizales).toBeAttached();
    await expect(page.locator('[data-tarjeta][data-ciudad="manizales"] [data-ver-mapa]')).toHaveCount(0);
    // Caldas se colorea por sus planes aunque Manizales no tenga pin
    await expect(page.locator('path[data-dpto="17"]')).not.toHaveAttribute('data-nivel', '0');

    await page.locator('[data-filtro="categoria"]').click();
    const mascotas = page.locator('#filtro-categoria label').filter({ hasText: 'Mascotas' });
    await expect(mascotas.locator('[data-conteo]')).toContainText('10');
    await mascotas.click();
    await page.locator('#filtro-categoria [data-ver-resultados]').click();
    await expect(page).toHaveURL(/categoria=mascotas/);
    await expect(page.locator('[data-panel-conteo]')).toHaveText('10 planes');

    await page.locator('[data-filtro-gratis]').click();
    await expect(page).toHaveURL(/gratis=1/);
    await expect(page.locator('[data-panel-conteo]')).toHaveText('2 planes');
    // "Lista" lleva a la Agenda con los mismos filtros
    await expect(page.locator('[data-vista-lista]')).toHaveAttribute('href', /categoria=mascotas.*gratis=1|gratis=1.*categoria=mascotas/);
  });
});

test.describe('Caché', () => {
  test('páginas públicas con caché corta y las de la cuenta sin caché', async ({ request }) => {
    for (const ruta of ['/', '/agenda', '/agenda?pagina=2', '/mapa', '/noticias', '/evento/bogota/rock-en-el-movistar-arena']) {
      const cache = (await request.get(ruta)).headers()['cache-control'];
      expect(cache, ruta).toContain('stale-while-revalidate');
      expect(cache, ruta).toMatch(/max-age=\d{1,3}\b/);
    }
    for (const ruta of ['/inicio', '/yo', '/perfil/lauram']) {
      expect((await request.get(ruta)).headers()['cache-control'], ruta).toBe('private, no-store');
    }
  });
});

test.describe('Fotos desde imagenes_evento', () => {
  test('el servidor pone la foto publicada en el HTML y en og:image; sin foto, el degradado', async ({ page, request }) => {
    const html = await (await request.get('/evento/bogota/rock-en-el-movistar-arena')).text();
    expect(html).toMatch(/<meta property="og:image" content="http:\/\/localhost:4580\/eventos\/e3\/[a-f0-9]{16}-1600\.webp"/);
    expect(html).toMatch(/<img[^>]+srcset="http:\/\/localhost:4580\/eventos\/e3\/[a-f0-9]{16}-480\.webp 480w/);
    const sinFoto = await (await request.get('/evento/bogota/santa-fe-vs-millonarios')).text();
    expect(sinFoto).not.toContain('og:image');
    expect(sinFoto).not.toContain('data-foto-servidor');

    await servirFotos(page);
    await page.goto('/evento/bogota/rock-en-el-movistar-arena');
    const foto = page.locator('[data-foto-evento="e3"] img');
    await expect(foto).toHaveJSProperty('complete', true);
    expect(await foto.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
  });

  test('si la foto no carga, se quita y queda el degradado', async ({ page }) => {
    await servirFotos(page, { caidas: true });
    await page.goto('/evento/bogota/rock-en-el-movistar-arena');
    await expect(page.locator('[data-foto-evento="e3"] img')).toHaveCount(0);
    await expect(page.locator('[data-foto-evento="e3"]')).not.toHaveClass(/cargada/);
  });
});

test.describe('Páginas que pasaron a leer D1', () => {
  test('Inicio, perfiles y noticias responden; lo que no existe da 404', async ({ page, request }) => {
    await page.addInitScript((clave) => localStorage.setItem(clave, '1'), CLAVE_SESION);
    for (const ruta of ['/inicio', '/yo', '/perfil/lauram', '/noticias', '/noticias/cinco-planes-gratis-este-finde-en-colombia']) {
      const r = await page.goto(ruta);
      expect(r?.status(), ruta).toBe(200);
      await expect(page.locator('h1').first()).toBeAttached();
    }
    for (const ruta of ['/perfil/nadie', '/noticias/no-existe', '/evento/bogota/no-existe']) {
      expect((await request.get(ruta)).status(), ruta).toBe(404);
    }
  });

  for (const ruta of ['/agenda?pagina=2', '/agenda?categoria=mascotas&gratis=1', '/mapa', '/inicio', '/yo', '/noticias']) {
    for (const ancho of [390, 1280]) {
      test(`${ruta} sin scroll horizontal ni violaciones de axe a ${ancho} px`, async ({ page }) => {
        await page.addInitScript((clave) => localStorage.setItem(clave, '1'), CLAVE_SESION);
        await page.setViewportSize({ width: ancho, height: 900 });
        await page.goto(ruta);
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(ancho);
        await sinViolaciones(page);
      });
    }
  }
});
