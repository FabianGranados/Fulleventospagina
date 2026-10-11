// Fila con desplazamiento lateral y flechas "Anterior"/"Siguiente" (decisión 2.30): las filas de eventos
// (FilaEventos) y las tarjetas de categorías del héroe (decisión 2.34). Las flechas se desactivan en cada extremo
// y se ocultan si no hay nada que desplazar. Quien usa la fila puede ocultar elementos (li[hidden]) y emitir
// "fila-eventos:reiniciar" sobre la raíz para volver al inicio y recalcular las flechas.
// Marcado: raíz [data-fila-eventos], pista [data-fila-pista], flechas [data-fila-flechas] con
// [data-fila-anterior] y [data-fila-siguiente].
const suave = () => (matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth');

export const activarFila = (fila: HTMLElement) => {
  const pista = fila.querySelector<HTMLElement>('[data-fila-pista]')!;
  const flechas = fila.querySelector<HTMLElement>('[data-fila-flechas]')!;
  const anterior = fila.querySelector<HTMLButtonElement>('[data-fila-anterior]')!;
  const siguiente = fila.querySelector<HTMLButtonElement>('[data-fila-siguiente]')!;

  const desactivar = (boton: HTMLButtonElement, valor: boolean, otro: HTMLButtonElement) => {
    if (boton.disabled === valor) return;
    // Si el botón con el foco se desactiva, el foco pasa a la otra flecha para no perderse en la página
    const teniaFoco = document.activeElement === boton;
    boton.disabled = valor;
    if (valor && teniaFoco && !otro.disabled) otro.focus();
  };

  const actualizar = () => {
    const max = pista.scrollWidth - pista.clientWidth;
    // Sin nada que desplazar, las flechas no se muestran
    flechas.hidden = max <= 2;
    const enInicio = pista.scrollLeft <= 2;
    const enFinal = pista.scrollLeft >= max - 2;
    // Primero se activa la flecha que corresponda, para que el foco tenga a dónde pasar
    if (enInicio) {
      desactivar(siguiente, enFinal, anterior);
      desactivar(anterior, true, siguiente);
    } else {
      desactivar(anterior, false, siguiente);
      desactivar(siguiente, enFinal, anterior);
    }
  };

  // Avanza o retrocede los elementos que se ven enteros (al menos uno)
  const mover = (sentido: 1 | -1) => {
    const primera = pista.querySelector<HTMLElement>('li:not([hidden])');
    if (!primera) return;
    const espacio = parseFloat(getComputedStyle(pista).columnGap) || 0;
    const paso = primera.offsetWidth + espacio;
    const cuantas = Math.max(1, Math.floor((pista.clientWidth + espacio) / paso));
    pista.scrollBy({ left: sentido * cuantas * paso, behavior: suave() });
  };

  anterior.addEventListener('click', () => mover(-1));
  siguiente.addEventListener('click', () => mover(1));

  let pendiente = 0;
  pista.addEventListener(
    'scroll',
    () => {
      cancelAnimationFrame(pendiente);
      pendiente = requestAnimationFrame(actualizar);
    },
    { passive: true },
  );
  new ResizeObserver(actualizar).observe(pista);

  fila.addEventListener('fila-eventos:reiniciar', () => {
    pista.scrollLeft = 0;
    actualizar();
  });

  actualizar();
};
