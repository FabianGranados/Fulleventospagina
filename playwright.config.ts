import { defineConfig } from '@playwright/test';

// Puerto configurable para no reutilizar el servidor de otra copia del proyecto
const puerto = Number(process.env.PUERTO_PRUEBAS ?? 4322);

export default defineConfig({
  testDir: 'tests',
  // Las del modo D1 van aparte (npm run test:d1, playwright.d1.config.ts)
  testIgnore: 'd1.spec.ts',
  timeout: 60_000,
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${puerto}`,
    launchOptions: process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {},
  },
  webServer: {
    command: `node tests/servidor-estatico.mjs ${puerto}`,
    url: `http://localhost:${puerto}/`,
    reuseExistingServer: false,
  },
});
