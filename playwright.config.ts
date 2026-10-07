import { defineConfig } from '@playwright/test';

const puerto = 4322;

export default defineConfig({
  testDir: 'tests',
  timeout: 60_000,
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${puerto}`,
    launchOptions: process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {},
  },
  webServer: {
    command: `node tests/servidor-estatico.mjs ${puerto}`,
    url: `http://localhost:${puerto}/`,
    reuseExistingServer: !process.env.CI,
  },
});
