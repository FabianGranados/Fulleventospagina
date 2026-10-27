import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// Etapa B (docs/etapa-b-eventos-d1.md): con EVENTOS_D1=local el sitio usa wrangler.local.jsonc, que trae la base
// D1 local (binding DB), y las páginas que muestran eventos se renderizan bajo demanda leyendo los publicados
// (lib/datos-eventos.ts): Bienvenida, Agenda y Evento (B2) y Mapa, Inicio, perfiles y noticias (B3). Sin la variable
// (lo que se publica hoy) todo sigue igual: páginas estáticas con src/data/eventos.ts y sin binding.
// Con EVENTOS_D1=pruebas es igual que local, pero con wrangler.pruebas.jsonc: el Worker fulleventos-pruebas y su
// base D1 en Cloudflare, aparte de producción. En ese modo Base.astro pide no indexar.
const modoD1 = process.env.EVENTOS_D1;
const configD1 = { local: 'wrangler.local.jsonc', pruebas: 'wrangler.pruebas.jsonc' }[modoD1];
const BAJO_DEMANDA = new Set([
  '/',
  '/agenda',
  '/evento/[ciudad]/[slug]',
  '/mapa',
  '/inicio',
  '/yo',
  '/perfil/[usuario]',
  '/noticias',
  '/noticias/[slug]',
]);
// Carpeta de la base local (por defecto .wrangler/state). Las pruebas de `npm run test:d1` usan una propia para no
// tocar la base con la que trabajas (scripts/eventos/d1-local.mjs la crea igual).
const estadoD1 = process.env.EVENTOS_D1_ESTADO;

// Astro 7 solo acepta `export const prerender = true|false` literal: el modo se decide aquí, en el hook de rutas
const paginasConD1 = {
  name: 'fulleventos-paginas-con-d1',
  hooks: {
    'astro:route:setup': ({ route }) => {
      if (configD1 && BAJO_DEMANDA.has(route.component.replace(/^src\/pages/, '').replace(/(\/index)?\.astro$/, '') || '/')) {
        route.prerender = false;
      }
    },
  },
};

export default defineConfig({
  adapter: cloudflare(
    configD1 ? { configPath: configD1, remoteBindings: false, ...(estadoD1 && { persistState: { path: estadoD1 } }) } : {},
  ),
  integrations: [paginasConD1],
  vite: { define: { 'import.meta.env.SITIO_PRUEBAS': JSON.stringify(modoD1 === 'pruebas') } },
});
