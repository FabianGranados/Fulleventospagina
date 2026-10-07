// Íconos de trazo del chat, con el trazo exacto de diseno/prototipo/Chat.dc.html (8.2.7, detalle 58).
// Viven en TypeScript porque las partes del chat que cambian se pintan también en el navegador
// (plantillas.ts) y Icono.astro solo existe en el servidor.
const trazos = {
  lupa: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  cerrar: '<path d="M6 6l12 12M18 6 6 18"/>',
  volver: '<path d="M15 18l-6-6 6-6"/>',
  mas: '<path d="M12 5v14M5 12h14"/>',
  mensajeMas: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/><path d="M12 8.5v7M8.5 12h7"/>',
  personaMas: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M19 8v6M16 11h6"/>',
  campana: '<path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/>',
  silenciado:
    '<path d="M8.7 3.6A6 6 0 0 1 18 8c0 3.2.6 5.4 1.3 6.8M17 17H3s3-2 3-9c0-.5 0-1 .1-1.4"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/><path d="m3 3 18 18"/>',
  calendario: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  calendarioMas: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M12 13v5M9.5 15.5h5"/>',
  boleta: '<path d="M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4z"/><path d="M14 7v2M14 11v2M14 15v2"/>',
  boletaLisa: '<path d="M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4z"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  chinche: '<path d="M9 4h6l-1 5 3 3v2H7v-2l3-3z"/><path d="M12 14v6"/>',
  palomita: '<path d="m5 12 5 5L20 7"/>',
  dobleCheck: '<path d="m2 13 4 4 8-9M10 15l2 2 9-10"/>',
  pesos:
    '<path d="M12 3v18"/><path d="M16.5 7.5c-.8-1.2-2.4-2-4.5-2-2.5 0-4 1.2-4 3s1.6 2.4 4 3 4 1.4 4 3.2-1.7 3-4.2 3c-2.1 0-3.7-.8-4.5-2"/>',
  repost: '<path d="M17 2l4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/>',
  flecha: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  encuesta: '<path d="M6 20V11M12 20V5M18 20v-6"/>',
  foto: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.5"/><path d="m21 16-5-5-9 8"/>',
  enviar: '<path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/>',
  salir: '<path d="M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 17l-5-5 5-5M5 12h11"/>',
  encanta:
    '<path d="M12 20s-7-4.4-9.2-8.6C1.3 8.4 3.2 5 6.6 5c2 0 3.4 1.1 4.4 2.5C12 6.1 13.4 5 15.4 5c3.4 0 5.3 3.4 3.8 6.4C19 15.6 12 20 12 20z"/>',
  prendido:
    '<path d="M12 21c3.9 0 6.5-2.6 6.5-6.3 0-3.4-2.2-5.6-3.9-8-.4 1.8-1.3 2.9-2.5 3.3.2-2.7-.8-5.3-3-7.5.2 3.7-3.6 6.3-3.6 12.2 0 3.7 2.6 6.3 6.5 6.3z"/>',
  gusta: '<path d="M7 10v10H4V10z"/><path d="M7 10l4-7c1.4 0 2.4 1.2 2.1 2.6L12.5 9H19a2 2 0 0 1 2 2.3l-1.2 6.9A2.2 2.2 0 0 1 17.6 20H7"/>',
} as const;

export type NombreIcono = keyof typeof trazos;

// Ícono decorativo (aria-hidden): el nombre accesible lo da el botón o el texto que lo acompaña
export const icono = (nombre: NombreIcono, tamano = 20, grosor = 2, clase = '') =>
  `<svg${clase ? ` class="${clase}"` : ''} width="${tamano}" height="${tamano}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${grosor}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${trazos[nombre]}</svg>`;

// N58 · Insignia de cuenta verificada: sí lleva nombre ("Cuenta verificada")
export const verificado = (tamano: 15 | 17) =>
  `<svg class="verificado" width="${tamano}" height="${tamano}" viewBox="0 0 24 24" role="img" aria-label="Cuenta verificada" focusable="false"><path d="M12 2.5l2.4 1.8 3-.1.9 2.8 2.4 1.8-.9 2.9.9 2.9-2.4 1.8-.9 2.8-3-.1L12 21.5l-2.4-1.8-3 .1-.9-2.8-2.4-1.8.9-2.9-.9-2.9 2.4-1.8.9-2.8 3 .1z" fill="#C23A24"/><path d="m8.5 12.2 2.3 2.3 4.7-4.9" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
