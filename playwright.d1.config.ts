import { defineConfig } from '@playwright/test';

// Pruebas del sitio en modo D1 (etapa B3): `npm run test:d1` prepara la base aparte y compila antes de llegar aquí.
const puerto = Number(process.env.PUERTO_PRUEBAS_D1 ?? 4662);

export default defineConfig({
  testDir: 'tests',
  testMatch: 'd1.spec.ts',
  timeout: 60_000,
  reporter: 'list',
  use: {
    baseURL: `http://127.0.0.1:${puerto}`,
    launchOptions: process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {},
  },
  webServer: {
    // EVENTOS_D1 y EVENTOS_D1_ESTADO llegan de scripts/eventos/pruebas-d1.mjs
    command: `node node_modules/astro/bin/astro.mjs preview --port ${puerto} --host 127.0.0.1 --ignore-lock`,
    url: `http://127.0.0.1:${puerto}/`,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
