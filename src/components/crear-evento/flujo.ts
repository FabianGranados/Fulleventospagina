// Piezas comunes de los pasos de /crear-evento (decisión 2.26): cambio de vista con foco y anuncio (H7, H49) y
// validación con error junto al campo, resumen de errores y foco al primer error (H23), como el Registro.

export type Regla = () => string;

export const $ = <T extends Element>(sel: string, raiz: ParentNode = document) => raiz.querySelector<T>(sel)!;
export const $$ = <T extends Element>(sel: string, raiz: ParentNode = document) => [...raiz.querySelectorAll<T>(sel)];

// Controles de un campo: el input/select/textarea con ese id, o los radios de un fieldset con ese id
export const controles = (id: string): HTMLElement[] => {
  const el = document.getElementById(id);
  if (!el) return [];
  return el.tagName === 'FIELDSET' ? $$<HTMLInputElement>('input', el) : [el];
};

const enfocable = (id: string) => {
  const lista = controles(id) as HTMLInputElement[];
  return lista.find((c) => c.checked) ?? lista[0];
};

// aria-describedby original (la ayuda del campo) para sumarle el error sin perderla
const describe = (c: HTMLElement) => {
  if (!c.dataset.describeBase) c.dataset.describeBase = c.getAttribute('aria-describedby') ?? '-';
  return c.dataset.describeBase === '-' ? '' : c.dataset.describeBase;
};

export const mostrarError = (id: string, mensaje: string) => {
  const caja = document.getElementById(`${id}-error`);
  if (caja) {
    $<HTMLElement>('[data-texto-error]', caja).textContent = mensaje;
    caja.hidden = !mensaje;
  }
  controles(id).forEach((c) => {
    const base = describe(c);
    if (mensaje) {
      c.setAttribute('aria-invalid', 'true');
      c.setAttribute('aria-describedby', [base, `${id}-error`].filter(Boolean).join(' '));
    } else {
      c.removeAttribute('aria-invalid');
      if (base) c.setAttribute('aria-describedby', base);
      else c.removeAttribute('aria-describedby');
    }
  });
};

// Valida un paso. Después del primer intento, los errores se actualizan mientras la persona corrige.
export const crearValidador = (form: HTMLElement, reglas: Record<string, Regla>) => {
  const resumen = $<HTMLElement>('[data-resumen]', form);
  const lista = $<HTMLUListElement>('[data-lista-errores]', form);
  let intentado = false;

  const validar = () => {
    const errores = Object.entries(reglas).map(([id, regla]) => ({ id, mensaje: regla() }));
    errores.forEach(({ id, mensaje }) => mostrarError(id, mensaje));
    const conError = errores.filter((e) => e.mensaje);
    lista.replaceChildren(
      ...conError.map(({ id, mensaje }) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${id}`;
        a.dataset.campo = id;
        a.textContent = mensaje;
        li.append(a);
        return li;
      }),
    );
    resumen.hidden = conError.length === 0;
    return conError;
  };

  const revalidar = () => {
    if (intentado) validar();
  };
  form.addEventListener('input', revalidar);
  form.addEventListener('change', revalidar);

  // Los enlaces del resumen llevan el foco al campo
  lista.addEventListener('click', (ev) => {
    const a = (ev.target as HTMLElement).closest<HTMLAnchorElement>('a[data-campo]');
    if (!a) return;
    ev.preventDefault();
    enfocable(a.dataset.campo!)?.focus();
  });

  return {
    // true si el paso está bien; si no, muestra los errores y lleva el foco al primero
    intentar() {
      intentado = true;
      const conError = validar();
      if (conError.length) enfocable(conError[0].id)?.focus();
      return conError.length === 0;
    },
    limpiar() {
      intentado = false;
      Object.keys(reglas).forEach((id) => mostrarError(id, ''));
      resumen.hidden = true;
      lista.replaceChildren();
    },
  };
};

// Contador "N de M caracteres" de un campo de texto
export const contar = (id: string) => {
  const campo = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | null;
  const contador = document.querySelector<HTMLElement>(`[data-contador="${id}"]`);
  if (!campo || !contador) return () => {};
  const maximo = Number(contador.dataset.maximo);
  const actualizar = () => {
    contador.textContent = `${campo.value.length.toLocaleString('es-CO')} de ${maximo.toLocaleString('es-CO')} caracteres`;
  };
  campo.addEventListener('input', actualizar);
  actualizar();
  return actualizar;
};

export const valor = (id: string) => (document.getElementById(id) as HTMLInputElement | null)?.value.trim() ?? '';

export const elegido = (nombre: string) =>
  document.querySelector<HTMLInputElement>(`input[name="${nombre}"]:checked`)?.value ?? '';

// Cambio de vista: oculta las demás, actualiza el progreso, enfoca el título y lo anuncia
export interface Vista {
  id: string;
  camino?: 'a' | 'b';
  numero?: number;
  nombre: string;
}

export const crearNavegacion = (vistas: Vista[], alCambiar?: (v: Vista) => void) => {
  const bloques = $$<HTMLElement>('[data-vista]');
  const progreso = $<HTMLElement>('[data-progreso]');
  const riel = $<HTMLElement>('[data-riel]');
  const anuncio = $<HTMLElement>('[data-anuncio]');
  const caminos = { a: 'Evento nuevo', b: 'Publicación' };
  const totales = { a: vistas.filter((v) => v.camino === 'a' && v.numero).length, b: vistas.filter((v) => v.camino === 'b' && v.numero).length };
  let actual = vistas[0];

  const ir = (id: string, { enfocar = true } = {}) => {
    const v = vistas.find((x) => x.id === id)!;
    actual = v;
    bloques.forEach((b) => (b.hidden = b.dataset.vista !== id));
    const conProgreso = !!(v.camino && v.numero);
    progreso.hidden = !conProgreso;
    let texto = v.nombre;
    if (conProgreso) {
      const total = totales[v.camino!];
      $<HTMLElement>('[data-progreso-camino]').textContent = caminos[v.camino!];
      $<HTMLElement>('[data-progreso-texto]').textContent = `Paso ${v.numero} de ${total}`;
      $<HTMLElement>('[data-relleno]').style.width = `${Math.round((v.numero! / total) * 100)}%`;
      riel.setAttribute('aria-valuemax', String(total));
      riel.setAttribute('aria-valuenow', String(v.numero));
      riel.setAttribute('aria-valuetext', `Paso ${v.numero} de ${total}`);
      texto = `Paso ${v.numero} de ${total}: ${v.nombre}`;
    }
    alCambiar?.(v);
    if (!enfocar) return;
    const titulo = document.getElementById(`${id}-titulo`);
    titulo?.focus({ preventScroll: true });
    const tarjeta = titulo?.closest('section');
    if (tarjeta && tarjeta.getBoundingClientRect().top < 0) tarjeta.scrollIntoView({ block: 'start' });
    anuncio.textContent = texto;
  };

  return { ir, actual: () => actual };
};
