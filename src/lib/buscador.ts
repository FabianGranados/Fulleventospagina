// Buscador de la Bienvenida (decisiones 2.31 y 2.32), común al del encabezado de visitante y al del héroe.
// Con texto se envía tal cual: el formulario va a /agenda?q=<texto>&ciudad=<ciudad> (también sin JavaScript).
// Sin texto, en una página con "Este finde" (#agenda) baja a esa sección y le lleva el foco al título; la ciudad
// elegida ya filtró sus filas (AgendaFinde sincroniza todo `select[data-selector-ciudad]`).
export const bajarSiVacio = (form: HTMLFormElement) =>
  form.addEventListener('submit', (ev) => {
    if (ev.defaultPrevented) return;
    const texto = String(new FormData(form).get('q') ?? '').trim();
    const agenda = document.querySelector<HTMLElement>('#agenda');
    if (texto || !agenda) return;
    ev.preventDefault();
    agenda.scrollIntoView();
    document.querySelector<HTMLElement>('#agenda-titulo')?.focus();
  });
