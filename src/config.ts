// Interruptores del sitio.

// VENTA_PROPIA · Compra de boletas dentro de Fulleventos (fase 2).
// En el primer lanzamiento Fulleventos NO vende boletas (decisión 2.22, 8 de octubre de 2026): cada evento
// muestra sus precios y localidades, y el botón lleva a la boletera o al sitio oficial (`urlVenta` en
// src/data/eventos.ts). Así se resuelve P1 para el lanzamiento con el modo "boletera externa"; la pasarela
// (P3) y el cargo por servicio (P4) quedan para la fase 2.
// El código de la compra propia (VentanaCompra, BoletaDigital, Cantidad, compra.ts, "Mis boletas", "Para mi
// parche" y el pago dividido del chat) se conserva apagado. Con `false` esas piezas no se renderizan ni se
// carga su JavaScript. Al ponerlo en `true` vuelve la compra dentro de Fulleventos tal como estaba.
export const VENTA_PROPIA = false;

// IMAGENES_URL · Dominio público del bucket R2 con las fotos de los eventos (docs/imagenes-r2.md).
// Se lee de la variable PUBLIC_IMAGENES_URL al compilar (archivo .env, que no se sube a GitHub). Vacía = apagado:
// las tarjetas muestran el degradado de siempre y el navegador no pide nada a R2. Con el dominio puesto, cada
// página pide un solo índice (indice/eventos-v1.json) y pinta las fotos publicadas, sin volver a desplegar.
// No es un secreto: es una URL pública. Las claves de Cloudflare nunca van en el frontend.
export const IMAGENES_URL: string = (import.meta.env.PUBLIC_IMAGENES_URL ?? '').trim().replace(/\/+$/, '');
