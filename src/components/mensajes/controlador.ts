// Comportamiento del chat en el navegador (6.2.7). Demo local: no hay red ni tiempo real (P6, H13).
// Regla común "enviar" del prototipo: lo que publica Camila va al final con hora "Ahora", marca la
// conversación como leída y la sube al primer lugar de la lista.
import { AMIGOS, YO, ciudadDe, type Conversacion, type Mensaje, type Reaccion } from '../../data/mensajes';
import * as E from './estado';
import * as P from './plantillas';

type Encuesta = Extract<Mensaje, { tipo: 'encuesta' }>;

export const iniciar = () => {
  const raiz = document.querySelector<HTMLElement>('[data-mensajes]');
  if (!raiz) return;
  const $ = <T extends HTMLElement = HTMLElement>(sel: string, base: ParentNode = raiz) => base.querySelector<T>(sel)!;

  const paginaAbierta = raiz.dataset.abierta!;
  const paginaVista = raiz.dataset.vista as 'lista' | 'chat';
  const e = E.estadoInicial(paginaAbierta, paginaVista, paginaVista === 'chat');

  const ancho = matchMedia('(min-width: 1180px)');
  const celular = matchMedia('(max-width: 899px)');

  const encabezado = document.querySelector<HTMLElement>('[data-encabezado]');
  const lista = $('[data-lista]');
  const filas = $('[data-filas]');
  const resumen = $('[data-resumen]');
  const h1 = $('[data-h1]');
  const buscar = $<HTMLInputElement>('[data-buscar]');
  const filtros = $('[data-filtros]');
  const conv = $('[data-conv]');
  const barra = $('[data-barra]');
  const plan = $('[data-plan]');
  let historial = $('[data-historial]');
  const info = $('[data-info]');
  const compositor = $<HTMLFormElement>('[data-compositor]');
  const bandeja = $('[data-bandeja]');
  const botonBandeja = $('[data-accion="bandeja"]');
  const botonMas = $('[data-accion="adjuntos"]');
  const borrador = $<HTMLInputElement>('[data-borrador]');
  const enviar = $<HTMLButtonElement>('[data-enviar]');
  const anuncio = $('[data-anuncio]');

  const conversacion = () => E.todas(e)[E.abiertaId(e)];
  const focar = (sel: string, base: ParentNode = raiz) => base.querySelector<HTMLElement>(sel)?.focus();

  // Región viva permanente (H49): filtrar la lista, abrir una conversación y salir de un parche
  let pendiente = 0;
  const anunciar = (texto: string) => {
    anuncio.textContent = '';
    clearTimeout(pendiente);
    pendiente = window.setTimeout(() => (anuncio.textContent = texto), 60);
  };

  const anunciarLista = () => {
    const n = E.filtradas(e).length;
    anunciar(n ? `Mostrando ${n} ${n === 1 ? 'chat' : 'chats'}` : E.textoListaVacia(e));
  };

  // Repinta una región solo si cambió y devuelve el foco al mismo control (data-foco)
  const ultimo = new Map<HTMLElement, string>();
  const pintarEn = (region: HTMLElement, html: string) => {
    if (ultimo.get(region) === html) return;
    const activo = document.activeElement as HTMLElement | null;
    const clave = activo && region.contains(activo) ? activo.dataset.foco : undefined;
    region.innerHTML = html;
    ultimo.set(region, html);
    if (clave) focar(`[data-foco="${clave}"]`, region);
  };

  // El encabezado compartido cuenta conversaciones sin leer (N1): se actualiza al leer
  const actualizarEncabezado = (n: number) => {
    const enlace = encabezado?.querySelector<HTMLAnchorElement>('a[href="/mensajes"]');
    if (!enlace) return;
    enlace.setAttribute('aria-label', n ? `Mensajes, ${n} ${n === 1 ? 'chat sin leer' : 'chats sin leer'}` : 'Mensajes');
    const insignia = enlace.querySelector('.insignia');
    if (insignia) {
      if (n) insignia.textContent = String(n);
      else insignia.remove();
    }
  };

  const estadoEnviar = () => {
    const listo = (e.borradores[conversacion().id] ?? '').trim().length > 0;
    enviar.setAttribute('aria-disabled', String(!listo));
  };

  const pintar = () => {
    const c = conversacion();
    pintarEn(filas, P.listaHTML(e));
    const n = E.conversacionesSinLeer(e);
    resumen.textContent = E.textoResumen(n);
    actualizarEncabezado(n);
    pintarEn(barra, P.barraHTML(e, ancho.matches));
    pintarEn(plan, P.planHTML(e));
    pintarEn(info, P.infoHTML(e));
    conv.setAttribute('aria-label', `Conversación con ${E.nombreConv(c)}`);
    info.setAttribute('aria-label', P.etiquetaInfo(c));
    info.dataset.ancho = e.infoAncho ? 'on' : 'off';
    info.dataset.angosto = e.infoAngosto ? 'on' : 'off';
    raiz.dataset.pane = e.panel;
    borrador.placeholder = E.placeholderDe(c);
    const texto = e.borradores[c.id] ?? '';
    if (borrador.value !== texto) borrador.value = texto;
    estadoEnviar();
    bandeja.hidden = !e.bandeja;
    botonBandeja.setAttribute('aria-expanded', String(e.bandeja));
  };

  // ---------- Historial ----------

  // Al cambiar de conversación se reemplaza el registro entero: una región viva nueva no se anuncia
  // (solo se anuncian los mensajes que llegan después) y el scroll vuelve al último mensaje (detalle 32)
  let hiloDe = E.abiertaId(e);
  const reemplazarHistorial = () => {
    const c = conversacion();
    const nuevo = historial.cloneNode(false) as HTMLElement;
    nuevo.setAttribute('aria-label', `Mensajes de ${E.nombreConv(c)}`);
    const hilo = historial.querySelector('[data-hilo]')!.cloneNode(false) as HTMLElement;
    hilo.innerHTML = P.hiloHTML(e);
    nuevo.append(hilo);
    historial.replaceWith(nuevo);
    historial = nuevo;
    hiloDe = c.id;
  };

  // Al publicar se agregan solo los elementos nuevos; el anterior pierde su hora si sigue la racha
  const agregarAlHistorial = () => {
    const c = conversacion();
    if (hiloDe !== c.id) return reemplazarHistorial();
    const hilo = historial.querySelector<HTMLElement>('[data-hilo]')!;
    hilo.querySelector('[data-sep-nuevos]')?.remove();
    hilo.querySelector('[data-vacio-conv]')?.remove();
    const items = hilo.querySelectorAll<HTMLElement>('[data-item]');
    const flujo = E.flujo(e, c);
    const ya = items.length;
    if (ya && E.continuaRacha(flujo, ya - 1)) items[ya - 1].querySelector('[data-meta]')?.remove();
    hilo.insertAdjacentHTML('beforeend', flujo.slice(ya).map((_, k) => P.elementoHTML(e, c, flujo, ya + k)).join(''));
    // column-reverse: 0 es el fondo. Al enviar se baja al último mensaje (detalle 32)
    historial.scrollTop = 0;
  };

  const publicar = (nuevos: Mensaje[]) => {
    const c = conversacion();
    const conIds = nuevos.map((m, i) => ({ ...m, id: `m${e.seq + i}`, hora: 'Ahora' }) as Mensaje);
    e.enviados[c.id] = [...(e.enviados[c.id] ?? []), ...conIds];
    e.leidas[c.id] = true;
    e.orden = [c.id, ...e.orden.filter((x) => x !== c.id)];
    e.seq += conIds.length;
    agregarAlHistorial();
    pintar();
  };

  const tomarBorrador = () => {
    const id = conversacion().id;
    const texto = (e.borradores[id] ?? '').trim();
    e.borradores[id] = '';
    return texto;
  };

  // ---------- Navegación entre conversaciones (la conversación viaja en la dirección, H42) ----------

  const tituloPagina = (c: Conversacion, vista: 'lista' | 'chat') =>
    vista === 'chat' && c.slug ? `Fulleventos · Mensajes · ${E.nombreConv(c)}` : 'Fulleventos · Mensajes';

  const guardarHistoria = (modo: 'push' | 'replace', vista: 'lista' | 'chat', desdeLista = false) => {
    const c = conversacion();
    const url = vista === 'chat' ? P.rutaConversacion(c) : '/mensajes';
    const datos = { mensajes: true, abierta: c.id, panel: e.panel, desdeLista };
    if (modo === 'push' && url !== location.pathname) history.pushState(datos, '', url);
    else history.replaceState(datos, '', url);
    document.title = tituloPagina(c, vista);
  };

  const quitarDialogoInfo = () => {
    info.setAttribute('role', 'complementary');
    info.removeAttribute('aria-modal');
    for (const el of [encabezado, lista, conv]) if (el) el.inert = false;
  };

  const abrirConversacion = (id: string, desdeLista: boolean) => {
    const cambia = E.abiertaId(e) !== id;
    e.abierta = id;
    e.panel = 'chat';
    e.leidas[id] = true;
    e.bandeja = false;
    e.confirmandoSalida = false;
    if (e.infoAngosto) quitarDialogoInfo();
    e.infoAngosto = false;
    cerrarAdjuntos();
    if (cambia || hiloDe !== id) reemplazarHistorial();
    pintar();
    guardarHistoria('push', 'chat', desdeLista);
    anunciar(`Conversación con ${E.nombreConv(conversacion())}`);
    // En celular la fila desaparece: el foco pasa al nombre de la conversación (H7)
    if (celular.matches) focar('[data-titulo-conv]', barra);
  };

  const volverALista = () => {
    const c = conversacion();
    if (history.state?.mensajes && history.state.desdeLista) {
      history.back();
      return;
    }
    e.panel = 'lista';
    e.bandeja = false;
    if (e.infoAngosto) quitarDialogoInfo();
    e.infoAngosto = false;
    pintar();
    guardarHistoria('replace', 'lista');
    focar(`[data-foco="fila-${c.id}"]`, filas);
    if (!filas.contains(document.activeElement)) h1.focus();
  };

  addEventListener('popstate', (ev) => {
    const s = ev.state as { mensajes?: boolean; abierta: string; panel: 'lista' | 'chat' } | null;
    if (!s?.mensajes) return;
    const anterior = E.abiertaId(e);
    const mapa = E.todas(e);
    if (mapa[s.abierta] && !e.salidas[s.abierta]) e.abierta = s.abierta;
    e.panel = s.panel;
    e.bandeja = false;
    e.confirmandoSalida = false;
    if (e.infoAngosto) quitarDialogoInfo();
    e.infoAngosto = false;
    if (E.abiertaId(e) !== hiloDe) reemplazarHistorial();
    pintar();
    document.title = tituloPagina(conversacion(), location.pathname === '/mensajes' ? 'lista' : 'chat');
    if (celular.matches && e.panel === 'lista') {
      focar(`[data-foco="fila-${anterior}"]`, filas);
      if (!filas.contains(document.activeElement)) h1.focus();
    }
  });

  // ---------- Panel de información: columna desde 1180 px, ventana por debajo (H7) ----------

  const abrirInfoAngosto = () => {
    e.infoAngosto = true;
    pintar();
    info.setAttribute('role', 'dialog');
    info.setAttribute('aria-modal', 'true');
    for (const el of [encabezado, lista, conv]) if (el) el.inert = true;
    focar('[data-foco="cerrar-info"]', info);
  };

  const cerrarInfo = () => {
    e.infoAncho = false;
    e.infoAngosto = false;
    e.confirmandoSalida = false;
    quitarDialogoInfo();
    pintar();
    focar('[data-foco="info"]', barra);
  };

  ancho.addEventListener('change', () => {
    if (ancho.matches && e.infoAngosto) {
      e.infoAngosto = false;
      quitarDialogoInfo();
    }
    pintar();
  });

  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && e.infoAngosto && !ancho.matches && !document.querySelector('dialog[open]')) {
      ev.preventDefault();
      cerrarInfo();
    }
  });

  // ---------- Salir del parche ----------

  const salirDelParche = () => {
    const c = conversacion();
    e.salidas[c.id] = true;
    e.abierta = e.orden.find((x) => x !== c.id && !e.salidas[x] && E.todas(e)[x]) ?? e.abierta;
    e.panel = 'lista';
    e.confirmandoSalida = false;
    e.bandeja = false;
    if (e.infoAngosto) quitarDialogoInfo();
    e.infoAngosto = false;
    reemplazarHistorial();
    pintar();
    guardarHistoria('replace', 'lista');
    anunciar(`Saliste de ${E.nombreConv(c)}`);
    if (celular.matches) h1.focus();
    else focar(`[data-foco="fila-${E.abiertaId(e)}"]`, filas);
  };

  // ---------- Compositor ----------

  const cerrarAdjuntos = () => {
    compositor.removeAttribute('data-adjuntos-abiertos');
    botonMas.setAttribute('aria-expanded', 'false');
  };

  compositor.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const texto = tomarBorrador();
    if (!texto) return;
    const desdeBoton = document.activeElement === enviar;
    e.bandeja = false;
    cerrarAdjuntos();
    publicar([{ id: '', tipo: 'texto', de: YO, texto, hora: '' }]);
    if (desdeBoton) borrador.focus();
  });

  borrador.addEventListener('input', () => {
    e.borradores[conversacion().id] = borrador.value;
    estadoEnviar();
  });

  // El campo es de una línea: Mayús+Enter no envía (6.2.7)
  borrador.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' && ev.shiftKey) ev.preventDefault();
  });

  // ---------- Lista: búsqueda y filtros ----------

  let esperaBusqueda = 0;
  buscar.addEventListener('input', () => {
    e.q = buscar.value;
    pintar();
    clearTimeout(esperaBusqueda);
    esperaBusqueda = window.setTimeout(anunciarLista, 600);
  });

  filtros.addEventListener('change', (ev) => {
    const radio = ev.target as HTMLInputElement;
    e.filtro = radio.value as E.Filtro;
    pintar();
    anunciarLista();
  });

  const verTodos = () => {
    e.filtro = 'todos';
    e.q = '';
    buscar.value = '';
    filtros.querySelector<HTMLInputElement>('input[value="todos"]')!.checked = true;
    pintar();
    anunciarLista();
    buscar.focus();
  };

  // ---------- Acciones (delegadas) ----------

  const actualizarEncuesta = (input: HTMLInputElement) => {
    const idEncuesta = input.dataset.encuesta!;
    if (e.votos[idEncuesta] === input.value) delete e.votos[idEncuesta];
    else e.votos[idEncuesta] = input.value;
    const m = E.mensajesDe(e, conversacion()).find((x) => x.id === idEncuesta) as Encuesta;
    const d = E.datosEncuesta(e, m);
    const nodo = historial.querySelector<HTMLElement>(`div[data-encuesta="${idEncuesta}"]`)!;
    for (const o of d.opciones) {
      const opcion = nodo.querySelector<HTMLElement>(`[data-opcion="${o.id}"]`)!;
      opcion.classList.toggle('elegida', o.elegida);
      opcion.querySelector<HTMLInputElement>('input')!.checked = o.elegida;
      opcion.querySelector<HTMLElement>('.opcion-relleno')!.style.width = `${o.pct}%`;
      opcion.querySelector('[data-n]')!.textContent = String(o.n);
      opcion.querySelector('[data-votos]')!.textContent = `, ${o.votos}`;
    }
    nodo.querySelector('[data-pie]')!.textContent = d.pie;
  };

  const alternarReaccion = (b: HTMLElement) => {
    const tipo = b.dataset.tipo as Reaccion;
    const clave = `${b.dataset.mensaje}:${tipo}`;
    e.reacciones[clave] = !e.reacciones[clave];
    const r = E.datosReaccion(e, b.dataset.mensaje!, tipo, Number(b.dataset.base));
    b.classList.toggle('marcada', r.marcada);
    b.setAttribute('aria-pressed', String(r.marcada));
    b.setAttribute('aria-label', r.etiqueta);
    b.querySelector('[data-n]')!.textContent = String(r.n);
  };

  const alternarRepost = (b: HTMLElement) => {
    const id = b.dataset.mensaje!;
    e.reposteados[id] = !e.reposteados[id];
    b.classList.toggle('marcada', e.reposteados[id]);
    b.setAttribute('aria-pressed', String(e.reposteados[id]));
    b.querySelector('[data-texto]')!.textContent = e.reposteados[id] ? 'Reposteado' : 'Repostear';
  };

  raiz.addEventListener('click', (ev) => {
    const t = ev.target as HTMLElement;
    const fila = t.closest<HTMLElement>('[data-abrir]');
    if (fila) {
      // Abrir en otra pestaña sigue funcionando: la fila es un enlace a /mensajes/:conversacion
      if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey || ev.button !== 0) return;
      ev.preventDefault();
      abrirConversacion(fila.dataset.abrir!, true);
      return;
    }
    const accion = t.closest<HTMLElement>('[data-accion]');
    if (!accion || !raiz.contains(accion)) return;
    const c = conversacion();
    switch (accion.dataset.accion) {
      case 'volver':
        volverALista();
        break;
      case 'info':
        if (ancho.matches) {
          e.infoAncho = !e.infoAncho;
          pintar();
        } else abrirInfoAngosto();
        break;
      case 'cerrar-info':
        cerrarInfo();
        break;
      case 'silenciar':
        e.silenciadas[c.id] = !e.silenciadas[c.id];
        pintar();
        break;
      case 'ver-todos':
        verTodos();
        break;
      case 'votar':
        actualizarEncuesta(accion as HTMLInputElement);
        break;
      case 'reaccion':
        alternarReaccion(accion);
        break;
      case 'repostear':
        alternarRepost(accion);
        break;
      case 'adjuntos': {
        const abiertos = !compositor.hasAttribute('data-adjuntos-abiertos');
        compositor.toggleAttribute('data-adjuntos-abiertos', abiertos);
        botonMas.setAttribute('aria-expanded', String(abiertos));
        if (!abiertos && e.bandeja) {
          e.bandeja = false;
          pintar();
        }
        break;
      }
      case 'bandeja':
        e.bandeja = !e.bandeja;
        pintar();
        break;
      case 'compartir':
        e.bandeja = false;
        cerrarAdjuntos();
        publicar([{ id: '', tipo: 'evento', de: YO, evento: accion.dataset.evento!, hora: '' }]);
        borrador.focus();
        break;
      case 'encuesta': {
        const texto = tomarBorrador();
        e.bandeja = false;
        cerrarAdjuntos();
        publicar([
          {
            id: '',
            tipo: 'encuesta',
            de: YO,
            pregunta: texto || '¿A qué hora nos vemos?',
            opciones: [['a', '7:00 p. m.', 0], ['b', '8:00 p. m.', 0], ['c', '9:00 p. m.', 0]],
            hora: '',
          },
        ]);
        borrador.focus();
        break;
      }
      case 'foto': {
        const texto = tomarBorrador();
        e.bandeja = false;
        cerrarAdjuntos();
        publicar([{ id: '', tipo: 'foto', de: YO, alt: '[Foto que compartiste]', pie: texto || undefined, colores: ['#F6DC6A', '#C46A2B', '#EE93BC'], hora: '' }]);
        borrador.focus();
        break;
      }
      case 'dividir':
        // Demo: en producción el pago dividido sale solo de una compra real, con monto, plazo y
        // una solicitud de pago del sistema (H18, H29; pendientes P3 y P4)
        e.dividido[c.id] = !e.dividido[c.id];
        if (e.dividido[c.id]) publicar([{ id: '', tipo: 'sistema', icono: 'pago', texto: `${E.cortoDe(YO)} activó el pago dividido: cada uno paga su parte`, hora: '' }]);
        else pintar();
        break;
      case 'salir':
        e.confirmandoSalida = true;
        pintar();
        focar('[data-confirmar]', info);
        break;
      case 'me-quedo':
        e.confirmandoSalida = false;
        pintar();
        focar('[data-foco="salir"]', info);
        break;
      case 'si-salir':
        salirDelParche();
        break;
    }
  });

  // ---------- Ventana "Nuevo parche" / "Nuevo chat" (N57) ----------

  const dialogo = document.getElementById('nuevo-chat') as HTMLDialogElement;
  const form = dialogo.querySelector<HTMLFormElement>('[data-form-nuevo]')!;
  const titulo = document.getElementById('nuevo-chat-titulo')!;
  const ayuda = $('[data-ayuda]', form);
  const principal = $('[data-principal]', form);
  const campos = form.elements as HTMLFormControlsCollection & {
    tipo: RadioNodeList;
    nombre: HTMLInputElement;
    evento: HTMLSelectElement;
    persona: RadioNodeList;
  };
  let enfocarCompositor = false;

  const elegidos = () => AMIGOS.filter((id) => form.querySelector<HTMLInputElement>(`input[name="amigos"][value="${id}"]`)!.checked);

  const validar = () => {
    const parche = campos.tipo.value === 'parche';
    const nombre = campos.nombre.value.trim();
    const n = elegidos().length;
    if (parche) {
      // H48: el nombre de un parche no puede imitar una cuenta oficial (texto de ayuda propuesto)
      if (nombre && E.nombreProhibido(nombre)) return { listo: false, texto: 'No uses «oficial», «verificado» ni «Fulleventos» en el nombre.' };
      if (!nombre && !n) return { listo: false, texto: 'Ponle nombre y elige al menos a un amigo.' };
      if (!nombre) return { listo: false, texto: 'Falta el nombre del parche.' };
      if (!n) return { listo: false, texto: 'Elige al menos a un amigo.' };
      return { listo: true, texto: `Serán ${n + 1} en el parche, contándote a ti.` };
    }
    const persona = campos.persona.value;
    return persona
      ? { listo: true, texto: `Abrirás tu chat con ${E.cortoDe(persona)}.` }
      : { listo: false, texto: 'Elige con quién quieres hablar.' };
  };

  const actualizarVentana = () => {
    const parche = campos.tipo.value === 'parche';
    titulo.textContent = parche ? 'Nuevo parche' : 'Nuevo chat';
    $('[data-solo-parche]', form).hidden = !parche;
    $('[data-amigos-parche]', form).hidden = !parche;
    $('[data-amigos-persona]', form).hidden = parche;
    $('[data-aviso-evento]', form).hidden = !campos.evento.value;
    const v = validar();
    if (ayuda.textContent !== v.texto) ayuda.textContent = v.texto;
    principal.textContent = parche ? 'Crear parche' : 'Abrir chat';
    principal.setAttribute('aria-disabled', String(!v.listo));
  };

  // Llegar con ?nuevo=parche[&evento=<id>] o ?nuevo=chat[&persona=<id>] (H38, H42) abre la ventana con el
  // evento o la persona ya elegidos. Se aplica una sola vez, en la primera apertura.
  let preseleccion: { evento?: string; persona?: string } | null = null;

  // El select solo trae los eventos de la bandeja: un evento ligado desde otra pantalla se agrega
  const asegurarEvento = (id: string) => {
    if ([...campos.evento.options].some((o) => o.value === id)) return true;
    let ev: E.EventoChat;
    try {
      ev = E.eventoDe(id);
    } catch {
      return false;
    }
    campos.evento.add(new Option(`${ev.titulo} · ${E.fechaCorta(ev)} · ${ev.ciudad}`, id));
    return true;
  };

  // La lista de "Nuevo chat" son los amigos; otra persona del demo (por ejemplo, desde su perfil) se agrega arriba
  const asegurarPersona = (id: string) => {
    if (form.querySelector(`input[name="persona"][value="${CSS.escape(id)}"]`)) return true;
    const nombre = E.nombreDe(id);
    const grupo = $('[data-amigos-persona] .rejilla-amigos', form);
    const modelo = grupo.querySelector<HTMLLabelElement>('label');
    if (!nombre || !modelo) return false;
    const fila = modelo.cloneNode(true) as HTMLLabelElement;
    const radio = fila.querySelector<HTMLInputElement>('input')!;
    radio.value = id;
    radio.checked = false;
    const av = fila.querySelector<HTMLElement>('.av-amigo')!;
    av.textContent = E.inicialesDe(id);
    av.className = av.className.replace(/\bc[1-6]\b/, E.colorDe(id));
    fila.querySelector('.amigo-texto b')!.textContent = nombre;
    fila.querySelector('.amigo-texto span')!.textContent = ciudadDe[id] ?? '';
    grupo.prepend(fila);
    return true;
  };

  // Cada vez que se abre, la ventana arranca vacía (detalle fino 43) en el modo del botón que la abrió
  dialogo.addEventListener('modal:abierta', (ev) => {
    const origen = (ev as CustomEvent<{ origen: HTMLElement }>).detail.origen;
    form.reset();
    campos.tipo.value = origen.dataset.modo === 'persona' ? 'persona' : 'parche';
    if (preseleccion) {
      const { evento, persona } = preseleccion;
      preseleccion = null;
      if (evento && asegurarEvento(evento)) campos.evento.value = evento;
      if (persona && asegurarPersona(persona)) campos.persona.value = persona;
    }
    actualizarVentana();
    // El foco entra a la ventana en "Cerrar" en todos los anchos (H7, M5). Sin fijarlo, a 390 px el foco que
    // pone showModal() terminaba en el body al abrir "Nuevo chat" con el teclado.
    dialogo.querySelector<HTMLElement>('.cerrar')?.focus();
  });

  form.addEventListener('input', actualizarVentana);
  form.addEventListener('change', actualizarVentana);

  dialogo.addEventListener('close', () => {
    if (!enfocarCompositor) return;
    enfocarCompositor = false;
    // Después de que la ventana devuelva el foco al botón que la abrió, se pasa a la conversación nueva
    setTimeout(() => borrador.focus(), 0);
  });

  const reiniciarLista = () => {
    e.filtro = 'todos';
    e.q = '';
    buscar.value = '';
    filtros.querySelector<HTMLInputElement>('input[value="todos"]')!.checked = true;
  };

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    if (!validar().listo) return;
    reiniciarLista();
    if (campos.tipo.value === 'parche') {
      const nombre = campos.nombre.value.trim();
      const amigos = elegidos();
      const id = `g${e.seq}`;
      const nuevo: Conversacion = {
        id,
        slug: '',
        tipo: 'parche',
        nombre,
        iniciales: E.inicialesParche(nombre),
        color: E.PALETA_PARCHES[e.seq % E.PALETA_PARCHES.length],
        evento: campos.evento.value || undefined,
        admin: YO,
        miembros: [YO, ...amigos],
        conBoleta: [],
        noLeidos: 0,
        nuevos: 0,
        hora: 'Ahora',
        mensajes: [
          { id: `${id}-d`, tipo: 'fecha', texto: 'Hoy' },
          { id: `${id}-s1`, tipo: 'sistema', icono: 'grupo', texto: `${E.cortoDe(YO)} creó el parche «${nombre}»`, hora: 'Ahora' },
          { id: `${id}-s2`, tipo: 'sistema', icono: 'grupo', texto: `${E.cortoDe(YO)} añadió a ${E.unirNombres(amigos.map(E.cortoDe))}`, hora: 'Ahora' },
        ],
      };
      e.extra[id] = nuevo;
      e.orden = [id, ...e.orden];
      e.seq += 1;
      enfocarCompositor = true;
      dialogo.close();
      abrirConversacion(id, false);
      return;
    }
    const persona = campos.persona.value;
    const mapa = E.todas(e);
    const existente = Object.keys(mapa).find((id) => mapa[id].tipo === 'persona' && mapa[id].con === persona && !e.salidas[id]);
    if (!existente) {
      const id = `dm-${persona}`;
      e.extra[id] = { id, slug: '', tipo: 'persona', con: persona, estado: '', noLeidos: 0, nuevos: 0, hora: 'Ahora', mensajes: [{ id: `${id}-d`, tipo: 'fecha', texto: 'Hoy' }] };
      e.orden = [id, ...e.orden.filter((x) => x !== id)];
    }
    enfocarCompositor = true;
    dialogo.close();
    abrirConversacion(existente ?? `dm-${persona}`, false);
  });

  // ---------- Arranque ----------

  // El primer pintado viene del servidor: se registra para no repintar lo que no cambió
  ultimo.set(filas, P.listaHTML(e));
  ultimo.set(barra, P.barraHTML(e, true));
  ultimo.set(plan, P.planHTML(e));
  ultimo.set(info, P.infoHTML(e));
  const consulta = new URLSearchParams(location.search);
  const nuevo = consulta.get('nuevo');
  // La consulta ?nuevo= solo abre la ventana al llegar: no se queda en la dirección
  history.replaceState({ mensajes: true, abierta: paginaAbierta, panel: paginaVista, desdeLista: false }, '', location.pathname);
  pintar();

  if (nuevo === 'parche' || nuevo === 'chat') {
    preseleccion = { evento: consulta.get('evento') ?? undefined, persona: consulta.get('persona') ?? undefined };
    const modo = nuevo === 'chat' ? 'persona' : 'parche';
    const boton = raiz.querySelector<HTMLElement>(`[data-abrir-modal="nuevo-chat"][data-modo="${modo}"]`);
    // Se abre con el clic del botón para que, al cerrar, el foco vuelva a él (Modal, H7). Espera a que el
    // script del Modal registre su escucha de clics.
    let abierta = false;
    const abrir = () => {
      if (abierta) return;
      abierta = true;
      boton?.click();
    };
    if (document.readyState === 'complete') setTimeout(abrir, 0);
    else {
      document.addEventListener('DOMContentLoaded', abrir, { once: true });
      addEventListener('load', abrir, { once: true });
    }
  }
};
