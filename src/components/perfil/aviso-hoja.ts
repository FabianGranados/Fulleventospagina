// Aviso de una hoja de opciones (AvisoHoja.astro, decisión 2.29): "Próximamente podrás …", "Copiamos el enlace…".
// Lo anuncia el role="status" y se borra a los 6 segundos o al cerrar el diálogo.
const temporizadores = new WeakMap<HTMLElement, number>();

export const limpiarAviso = (aviso: HTMLElement) => {
  clearTimeout(temporizadores.get(aviso));
  aviso.textContent = '';
};

export const avisarEnHoja = (origen: Element, texto: string) => {
  const aviso = origen.closest('dialog')?.querySelector<HTMLElement>('[data-aviso-hoja]');
  if (!aviso) return;
  limpiarAviso(aviso);
  // Un cuadro después, para que el lector de pantalla lo anuncie aunque el texto se repita
  requestAnimationFrame(() => {
    aviso.textContent = texto;
  });
  temporizadores.set(aviso, window.setTimeout(() => limpiarAviso(aviso), 6000));
};

document.querySelectorAll<HTMLElement>('[data-aviso-hoja]').forEach((aviso) => {
  aviso.closest('dialog')?.addEventListener('close', () => limpiarAviso(aviso));
});
