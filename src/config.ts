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
