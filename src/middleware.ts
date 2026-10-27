// Caché de las páginas bajo demanda (etapa B3). Solo actúa en las que se arman en el servidor con D1
// (EVENTOS_D1, astro.config.mjs); las estáticas salen como archivos y no pasan por aquí.
// - Páginas públicas: poco tiempo y "stale-while-revalidate", así un evento retirado deja de verse en minutos.
// - Páginas de la cuenta (Inicio, Mi perfil, perfiles, Mensajes, Publicar) o con cookies: nunca se guardan.
import { defineMiddleware } from 'astro:middleware';

export const CACHE_PUBLICA = 'public, max-age=60, stale-while-revalidate=300';
export const SIN_CACHE = 'private, no-store';

// Rutas con datos de la usuaria (las mismas que piden sesión en Base.astro: requiereSesion)
const DE_SESION = /^\/(inicio|yo|perfil|mensajes|crear-evento)(\/|$)/;

export const onRequest = defineMiddleware(async (contexto, siguiente) => {
  const respuesta = await siguiente();
  if (contexto.isPrerendered) return respuesta;
  const html = respuesta.headers.get('content-type')?.includes('text/html');
  if (!html) return respuesta;
  const privada =
    DE_SESION.test(contexto.url.pathname) || respuesta.headers.has('set-cookie') || respuesta.status !== 200;
  // Copia de las cabeceras: las de algunas respuestas no se pueden cambiar
  const cabeceras = new Headers(respuesta.headers);
  cabeceras.set('cache-control', privada ? SIN_CACHE : CACHE_PUBLICA);
  if (privada) cabeceras.delete('cdn-cache-control');
  return new Response(respuesta.body, { status: respuesta.status, statusText: respuesta.statusText, headers: cabeceras });
});
