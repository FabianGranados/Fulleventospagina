import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// Etapa B2 (docs/etapa-b-eventos-d1.md): con EVENTOS_D1=local el sitio usa wrangler.local.jsonc, que trae la base
// D1 local (binding DB), y Bienvenida, Agenda y Evento se renderizan bajo demanda leyendo los eventos publicados
// (lib/datos-eventos.ts). Sin la variable (lo que se publica hoy) todo sigue igual: páginas estáticas con
// src/data/eventos.ts y sin binding.
const d1Local = process.env.EVENTOS_D1 === 'local';
const BAJO_DEMANDA = new Set(['/', '/agenda', '/evento/[ciudad]/[slug]']);

// Astro 7 solo acepta `export const prerender = true|false` literal: el modo se decide aquí, en el hook de rutas
const paginasConD1 = {
  name: 'fulleventos-paginas-con-d1',
  hooks: {
    'astro:route:setup': ({ route }) => {
      if (d1Local && BAJO_DEMANDA.has(route.component.replace(/^src\/pages/, '').replace(/(\/index)?\.astro$/, '') || '/')) {
        route.prerender = false;
      }
    },
  },
};

export default defineConfig({
  adapter: cloudflare(d1Local ? { configPath: 'wrangler.local.jsonc', remoteBindings: false } : {}),
  integrations: [paginasConD1],
});
