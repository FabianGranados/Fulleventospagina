// Pruebas de todas las páginas generadas: sin scroll horizontal (H8) y sin violaciones de axe (WCAG 2.2 AA).
// Corre después de `astro build` (npm test lo hace solo).
// Dos pasadas (decisión 2.24): sin sesión (visitante) en todas las páginas y con la sesión de demostración en las
// que cambian con ella. Las que piden sesión (Inicio, Mensajes, /yo y /perfil/*), sin sesión deben llevar a
// /entrar?volver=<ruta>; su contenido se revisa en la pasada con sesión.
import { test, expect, type Page } from '@playwright/test';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const raiz = join(process.cwd(), 'dist', 'client');
const axe = readFileSync(join(process.cwd(), 'node_modules', 'axe-core', 'axe.min.js'), 'utf8');
// Misma clave que src/lib/sesion.ts
const CLAVE_SESION = 'fe-sesion-demo';

const paginas = (dir: string): string[] =>
  readdirSync(dir).flatMap((nombre) => {
    const ruta = join(dir, nombre);
    if (statSync(ruta).isDirectory()) return nombre === '_astro' ? [] : paginas(ruta);
    return nombre === 'index.html' ? ['/' + relative(raiz, dir).split(sep).filter(Boolean).join('/')] : [];
  });

const rutas = paginas(raiz).map((r) => (r === '/' ? '/' : `${r}/`));

const PIDEN_SESION = /^\/(inicio|mensajes|yo|perfil)(\/|$)/;
const pideSesion = (ruta: string) => PIDEN_SESION.test(ruta);

// Pasada con sesión: las públicas que cambian con ella, las que la piden y un evento
const RUTAS_CON_SESION = ['/agenda/', '/mapa/', '/inicio/', '/mensajes/', '/yo/', '/evento/bogota/noche-de-salsa-y-boleros-en-vivo/'];

const revisar = (ruta: string, sesion: boolean) => {
  const preparar = async (page: Page, ancho: number) => {
    if (sesion) await page.addInitScript((clave) => localStorage.setItem(clave, '1'), CLAVE_SESION);
    await page.setViewportSize({ width: ancho, height: 900 });
    await page.goto(ruta);
    await expect(page.locator('html')).toHaveAttribute('data-sesion', sesion ? 'si' : 'no');
  };

  for (const ancho of [320, 390, 768, 1280]) {
    test(`sin scroll horizontal a ${ancho} px`, async ({ page }) => {
      await preparar(page, ancho);
      const anchoDocumento = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(anchoDocumento).toBe(ancho);
    });
  }

  for (const ancho of [390, 1280]) {
    test(`axe sin violaciones a ${ancho} px`, async ({ page }) => {
      await preparar(page, ancho);
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
    });
  }
};

for (const ruta of rutas) {
  test.describe(ruta, () => {
    if (pideSesion(ruta)) {
      test('sin sesión lleva a Entrar con ?volver=', async ({ page }) => {
        await page.goto(ruta);
        await page.waitForURL((url) => url.pathname.replace(/\/$/, '') === '/entrar');
        expect(new URL(page.url()).searchParams.get('volver')).toBe(ruta);
      });
      return;
    }
    revisar(ruta, false);
  });
}

for (const ruta of RUTAS_CON_SESION) {
  test.describe(`${ruta} con sesión`, () => revisar(ruta, true));
}
