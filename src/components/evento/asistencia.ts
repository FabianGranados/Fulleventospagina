// "Voy" / "Vas a ir" y "Me interesa" con sus conteos (también en eventos gratis, sin compra), y
// "Ya tengo boleta" (decisión 2.22: se marca a mano porque la compra se hace en la boletera).
// En el demo el estado es solo local, como en el prototipo; en producción se guarda por usuario (H12).
// La página es pública (decisión 2.24): el servidor pinta los botones como los ve el visitante (sin pulsar) y con la
// sesión de demostración se aplica el estado de la usuaria, guardado en data-sesion-pulsado. Sin sesión, los
// botones piden cuenta (VentanaCuenta) y estos manejadores no llegan a ejecutarse.
import { haySesion } from '../../lib/sesion';

export const iniciarAsistencia = () => {
  const $ = (sel: string) => document.querySelector<HTMLElement>(sel);
  const $$ = (sel: string) => [...document.querySelectorAll<HTMLElement>(sel)];
  // Con sesión arrancan como los dejó la usuaria (data/asistencia.ts, H37)
  if (haySesion()) {
    $$('[data-sesion-pulsado="true"]').forEach((b) => b.setAttribute('aria-pressed', 'true'));
    const voy = $('[data-voy]');
    if (voy?.getAttribute('aria-pressed') === 'true') $('[data-texto-voy]')!.textContent = 'Vas a ir';
  }
  const estado = {
    va: $('[data-voy]')?.getAttribute('aria-pressed') === 'true',
    interes: $('[data-interes]')?.getAttribute('aria-pressed') === 'true',
  };
  const conteos = () => {
    $$('[data-conteo-van]').forEach((s) => {
      const n = (Number(s.dataset.base) + (estado.va ? 1 : 0)).toLocaleString('es-CO');
      s.textContent = s.hasAttribute('data-solo-numero') ? n : `${n} van`;
    });
    // H26: "Me interesa" suma al contador de interesados
    $$('[data-conteo-interes]').forEach(
      (s) => (s.textContent = (Number(s.dataset.base) + (estado.interes ? 1 : 0)).toLocaleString('es-CO')),
    );
  };
  const marcarVoy = (va: boolean) => {
    estado.va = va;
    const b = $('[data-voy]');
    b?.setAttribute('aria-pressed', String(va));
    $('[data-texto-voy]')!.textContent = va ? 'Vas a ir' : 'Voy';
    conteos();
  };
  $('[data-voy]')?.addEventListener('click', () => marcarVoy(!estado.va));
  $('[data-interes]')?.addEventListener('click', (ev) => {
    estado.interes = !estado.interes;
    (ev.currentTarget as HTMLElement).setAttribute('aria-pressed', String(estado.interes));
    conteos();
  });
  $('[data-tengo-boleta]')?.addEventListener('click', (ev) => {
    const b = ev.currentTarget as HTMLElement;
    b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true'));
  });

  return marcarVoy;
};
