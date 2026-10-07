// Pruebas de todas las páginas generadas: sin scroll horizontal (H8) y sin violaciones de axe (WCAG 2.2 AA).
// Corre después de `astro build` (npm test lo hace solo).
import { test, expect } from '@playwright/test';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const raiz = join(process.cwd(), 'dist', 'client');
const axe = readFileSync(join(process.cwd(), 'node_modules', 'axe-core', 'axe.min.js'), 'utf8');

const paginas = (dir: string): string[] =>
  readdirSync(dir).flatMap((nombre) => {
    const ruta = join(dir, nombre);
    if (statSync(ruta).isDirectory()) return nombre === '_astro' ? [] : paginas(ruta);
    return nombre === 'index.html' ? ['/' + relative(raiz, dir).split(sep).filter(Boolean).join('/')] : [];
  });

const rutas = paginas(raiz).map((r) => (r === '/' ? '/' : `${r}/`));

for (const ruta of rutas) {
  test.describe(ruta, () => {
    for (const ancho of [320, 390, 768, 1280]) {
      test(`sin scroll horizontal a ${ancho} px`, async ({ page }) => {
        await page.setViewportSize({ width: ancho, height: 900 });
        await page.goto(ruta);
        const anchoDocumento = await page.evaluate(() => document.documentElement.scrollWidth);
        expect(anchoDocumento).toBe(ancho);
      });
    }

    for (const ancho of [390, 1280]) {
      test(`axe sin violaciones a ${ancho} px`, async ({ page }) => {
        await page.setViewportSize({ width: ancho, height: 900 });
        await page.goto(ruta);
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
  });
}
