// Estado y comportamiento de la compra en la página de evento (N30, N35–N46).
// FASE 2: solo se carga con VENTA_PROPIA = true (src/config.ts, decisión 2.22). "Voy" y "Me interesa"
// están en asistencia.ts porque funcionan en los dos modos.
// DEMOSTRACIÓN SIN BACKEND: no hay pasarela, no se cobra y no se emiten boletas reales (P1–P4).
// En producción los cupos, precios, cargo, reservas y órdenes salen del servidor (H2, H3).

interface Localidad {
  id: string;
  nombre: string;
  completo: string;
  corto: string;
  precio: number;
  maximo: number;
  puestos: number;
}

interface Amigo {
  id: string;
  nombre: string;
  corto: string;
  iniciales: string;
  color: string;
}

export interface DatosCompra {
  titulo: string;
  localidades: Localidad[];
  amigos: Amigo[];
  parche: string | null;
  mayores18: boolean;
  cargo: number;
  saludoPista: boolean;
  inicioIso: string | null;
  fecha: string;
  lugar: string;
  url: string;
}

interface Orden {
  loc: Localidad;
  cantidadTexto: string;
  propias: number;
  divide: boolean;
  pendientes: Amigo[];
  pagado: number;
  medio: string;
  titular: string;
  correo: string;
  orden: string;
  vipApartada: boolean;
}

const pesos = (n: number) => '$' + Math.round(n).toLocaleString('es-CO');
const plural = (n: number, uno: string, varios: string) => `${n} ${n === 1 ? uno : varios}`;

const NOMBRES_PASO = ['Boletas', 'Tus datos', 'Pago', 'Listo'];
const ROTULOS_PASO = ['Boletas', 'Datos', 'Pago', 'Listo'];
const MEDIOS: Record<string, string> = {
  nequi: 'Nequi',
  pse: 'PSE',
  card: 'Tarjeta crédito/débito',
  davi: 'Daviplata',
  bcol: 'Botón Bancolombia',
};

export const iniciarCompra = (datos: DatosCompra, marcarVoy: (va: boolean) => void) => {
  const $ = <T extends Element = HTMLElement>(sel: string, raiz: ParentNode = document) => raiz.querySelector<T>(sel as string) as T;
  const $$ = <T extends Element = HTMLElement>(sel: string, raiz: ParentNode = document) => [...raiz.querySelectorAll<T>(sel)];

  const ventana = $<HTMLDialogElement>('[data-ventana-compra]');
  if (!ventana) return;

  const estado = {
    loc: datos.localidades[0].id,
    cantidad: 1, // H22
    paraQuien: 'yo' as 'yo' | 'parche',
    elegidos: datos.amigos.length ? [datos.amigos[0].id] : ([] as string[]),
    dividir: false,
    paso: 1,
    intentado: [false, false, false, false],
    medio: '',
    ordenes: [] as Orden[],
    calendario: false,
  };
  let abridor: HTMLElement | null = null;
  let mensajeRecorte = '';

  const localidad = () => datos.localidades.find((l) => l.id === estado.loc)!;
  const cupoAmigos = (l: Localidad) => (l.puestos > 1 ? l.puestos - 1 : l.maximo - 1);

  const calcular = () => {
    const l = localidad();
    const parche = estado.paraQuien === 'parche';
    const k = parche ? estado.elegidos.length : 0;
    const vip = l.puestos > 1;
    const unidades = parche ? (vip ? 1 : 1 + k) : Math.min(Math.max(estado.cantidad, 1), l.maximo);
    const personas = unidades * l.puestos;
    const subtotal = unidades * l.precio;
    const cargo = Math.round(subtotal * datos.cargo);
    const total = subtotal + cargo;
    const divide = parche && estado.dividir && k > 0;
    const n = 1 + k;
    const parte = divide ? Math.round(total / n) : total;
    const unidad = vip ? (unidades === 1 ? 'mesa' : 'mesas') : unidades === 1 ? 'boleta' : 'boletas';
    return { l, parche, k, vip, unidades, personas, subtotal, cargo, total, divide, n, parte, unidad };
  };

  // ---------- Pintar todo lo que depende del estado ----------
  const pintar = () => {
    const c = calcular();

    // Localidad única en plano, lista, tarjeta y paso 1 (N30)
    const grupos = new Set($$<HTMLInputElement>('input[data-loc]').map((r) => r.name));
    grupos.forEach((nombre) => {
      const marcado = $<HTMLInputElement>(`input[name="${nombre}"]:checked`);
      if (marcado?.value !== estado.loc) {
        const r = $<HTMLInputElement>(`input[name="${nombre}"][value="${estado.loc}"]`);
        if (r) r.checked = true;
      }
    });
    $$('[data-loc-opcion]').forEach((o) => o.toggleAttribute('data-elegida', o.dataset.locOpcion === estado.loc));

    // Cantidad (tarjeta y paso 1)
    const bloqueada = c.parche || c.vip;
    $$('[data-cantidad]').forEach((n) => (n.textContent = String(c.unidades)));
    const pista = c.parche
      ? `Tú + ${c.k} de ${datos.parche}`
      : c.vip
        ? 'Una mesa es para 4 personas'
        : `Máximo ${c.l.maximo} por compra`;
    $$('[data-pista-cantidad]').forEach((p) => (p.textContent = pista));
    $$<HTMLButtonElement>('[data-menos]').forEach((b) => {
      b.setAttribute('aria-disabled', String(bloqueada || c.unidades <= 1));
      b.setAttribute('aria-label', c.vip ? 'Quitar una mesa' : 'Quitar una boleta');
    });
    $$<HTMLButtonElement>('[data-mas]').forEach((b) => {
      b.setAttribute('aria-disabled', String(bloqueada || c.unidades >= c.l.maximo));
      b.setAttribute('aria-label', c.vip ? 'Agregar una mesa' : 'Agregar una boleta');
    });

    // Tarjeta lateral y barra (precio sin cargo + "cargo por servicio", decisión 2.14)
    $$('[data-linea-subtotal]').forEach((s) => (s.textContent = `Subtotal · ${c.unidades} ${c.unidad} × ${pesos(c.l.precio)}`));
    $$('[data-subtotal]').forEach((s) => (s.textContent = pesos(c.subtotal)));
    const resumenOrdenes = textoOrdenes();
    $$('[data-barra-sub]').forEach(
      (s) => (s.textContent = resumenOrdenes ? resumenOrdenes.titulo : `${c.l.nombre} · ${c.unidades} ${c.unidad} · ${pesos(c.subtotal)}`),
    );
    $$('[data-texto-comprar]').forEach((s) => (s.textContent = estado.ordenes.length ? 'Comprar más boletas' : 'Comprar boletas'));
    const estadoCompra = $('[data-estado-compra]');
    if (estadoCompra && resumenOrdenes) {
      estadoCompra.hidden = false;
      $('[data-estado-titulo]').textContent = resumenOrdenes.titulo;
      $('[data-estado-sub]').textContent = resumenOrdenes.sub;
    }
    $$('[data-barra-compra] [data-ver-boleta]').forEach((b) => (b.hidden = !estado.ordenes.length));

    // Paso 1: para quién, parche e interruptor
    $$<HTMLInputElement>('[data-para-quien]').forEach((r) => (r.checked = r.value === estado.paraQuien));
    const soloYo = $('[data-solo-para-mi]');
    if (soloYo) soloYo.hidden = c.parche;
    const bloqueParche = $('[data-bloque-parche]');
    if (bloqueParche) {
      bloqueParche.hidden = !c.parche;
      $('[data-van-parche]').textContent = `Van ${1 + c.k}`;
      const cupo = cupoAmigos(c.l);
      $$<HTMLButtonElement>('[data-miembro]').forEach((b) => {
        const elegido = estado.elegidos.includes(b.dataset.miembro!);
        b.setAttribute('aria-pressed', String(elegido));
        b.setAttribute('aria-disabled', String(!elegido && estado.elegidos.length >= cupo));
      });
      // Solo se elige entre quienes no tienen boleta; los demás se listan aparte (H25)
      $('[data-cupo-parche]').textContent = c.vip
        ? `Una mesa VIP es para 4: elige hasta 3 amigos.`
        : `Máximo ${c.l.maximo} boletas por compra.`;
      $('[data-aviso-recorte]').textContent = mensajeRecorte;
      const sw = $('[data-dividir]');
      const activo = estado.dividir && c.k > 0;
      sw.setAttribute('aria-checked', String(activo));
      sw.setAttribute('aria-disabled', String(c.k === 0));
      $('[data-estado-dividir]').textContent = activo ? 'Activado' : 'Desactivado';
      $('[data-nota-dividida]').hidden = !c.divide;
      $('[data-nota-parte]').textContent = `Tú pagas 1 de ${c.n} · ${pesos(c.parte)}.`;
    }

    // Paso 2: asistentes
    pintarAsistentes(c);

    // Paso 3: panel del medio
    const panel = estado.medio === 'nequi' || estado.medio === 'davi' ? 'billetera' : estado.medio;
    $$('[data-panel-medio]').forEach((p) => (p.hidden = p.dataset.panelMedio !== panel));
    if (panel === 'billetera') {
      const app = estado.medio === 'nequi' ? 'Nequi' : 'Daviplata';
      $('[data-billetera-rotulo]').textContent = `Celular registrado en ${app}`;
      $('[data-billetera-nota]').textContent =
        app === 'Nequi'
          ? 'Te llegará una notificación a tu app Nequi para aprobar el pago.'
          : 'Te llegará una notificación en Daviplata para aprobar el pago.';
    }

    // Pie: resumen y botón principal
    $('[data-r-linea]').textContent = `${c.unidades} × ${c.l.completo} (${pesos(c.l.precio)})`;
    $('[data-r-subtotal]').textContent = pesos(c.subtotal);
    $('[data-r-cargo]').textContent = pesos(c.cargo);
    $('[data-r-total]').textContent = pesos(c.total);
    $('[data-r-dividido]').hidden = !c.divide;
    $('[data-r-n]').textContent = `Tú pagas 1 de ${c.n}`;
    $('[data-r-parte]').textContent = pesos(c.parte);

    const textos = ['Continuar', 'Continuar al pago', `Pagar ${pesos(c.parte)}`];
    $('[data-texto-siguiente]').textContent = textos[estado.paso - 1] ?? '';
    const errores = validar(estado.paso);
    const siguiente = $('[data-siguiente]');
    siguiente.setAttribute('aria-disabled', String(errores.length > 0));
    $('[data-pista]').textContent = errores.length ? pistaCorta(estado.paso, errores) : '';
    pintarErroresCampos();
  };

  // ---------- Pasos ----------
  const pintarPaso = () => {
    $$('[data-paso]').forEach((p) => (p.hidden = Number(p.dataset.paso) !== estado.paso));
    $$('[data-indicador]').forEach((li) => {
      const n = Number(li.dataset.indicador);
      const hecho = n < estado.paso || estado.paso === 4;
      const actual = n === estado.paso;
      li.dataset.estado = hecho ? 'hecho' : actual ? 'actual' : 'pendiente';
      if (actual) li.setAttribute('aria-current', 'step');
      else li.removeAttribute('aria-current');
      $('[data-estado-indicador]', li).textContent = hecho ? ', hecho' : actual ? ', paso actual' : '';
    });
    $('[data-paso-compacto]').textContent = `Paso ${estado.paso} de 4 · ${ROTULOS_PASO[estado.paso - 1]}`;
    $('[data-reloj]').hidden = estado.paso === 4;
    $('[data-pie]').hidden = estado.paso === 4;
    $('[data-atras]').hidden = estado.paso === 1 || estado.paso === 4;
    $('[data-errores]').hidden = true;
  };

  const irAPaso = (n: number, anunciar = true) => {
    estado.paso = n;
    pintarPaso();
    pintar();
    // El cuerpo arranca arriba y el foco va al título del paso (H6, H7); el paso se anuncia (H49)
    $('[data-cuerpo]').scrollTop = 0;
    $('.panel', ventana)?.scrollTo?.(0, 0);
    $<HTMLElement>(`[data-paso="${n}"] [data-titulo-paso]`)?.focus();
    if (anunciar) anuncio(`Paso ${n} de 4: ${NOMBRES_PASO[n - 1]}`);
  };

  const anuncio = (texto: string) => {
    const region = $('[data-anuncio-paso]');
    region.textContent = '';
    setTimeout(() => (region.textContent = texto), 60);
  };

  // ---------- Validación (H23) ----------
  interface ErrorCampo {
    id: string;
    mensaje: string;
  }

  const valor = (id: string) => ($<HTMLInputElement>(`#${id}`)?.value ?? '').trim();
  const celularValido = (v: string) => /^3\d{9}$/.test(v.replace(/[\s-]/g, ''));

  const validar = (paso: number): ErrorCampo[] => {
    const e: ErrorCampo[] = [];
    if (paso === 1) {
      const c = calcular();
      if (c.parche && c.k === 0) e.push({ id: 'co-miembros', mensaje: 'Elige al menos un amigo del parche.' });
      if (datos.mayores18 && !$<HTMLInputElement>('#co-mayores').checked)
        e.push({ id: 'co-mayores', mensaje: 'Confirma que todos los asistentes son mayores de 18.' });
    }
    if (paso === 2) {
      if (!valor('co-nombre')) e.push({ id: 'co-nombre', mensaje: 'Escribe tu nombre completo.' });
      const doc = valor('co-documento');
      const tipo = valor('co-tipo');
      if (!doc) e.push({ id: 'co-documento', mensaje: 'Escribe tu número de documento para continuar.' });
      else if (tipo === 'CC' && !/^\d{6,10}$/.test(doc))
        e.push({ id: 'co-documento', mensaje: 'La cédula lleva solo números, de 6 a 10 dígitos, sin puntos ni espacios.' });
      else if (tipo !== 'CC' && !/^[A-Za-z0-9]+$/.test(doc))
        e.push({ id: 'co-documento', mensaje: 'El número de documento lleva solo letras y números, sin puntos ni espacios.' });
      const correo = valor('co-correo');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo))
        e.push({ id: 'co-correo', mensaje: 'Escribe un correo válido, por ejemplo nombre@correo.com.' });
      if (!celularValido(valor('co-celular')))
        e.push({ id: 'co-celular', mensaje: 'Escribe un celular de 10 dígitos que empiece por 3.' });
    }
    if (paso === 3) {
      if (!estado.medio) e.push({ id: 'co-medios', mensaje: 'Elige cómo quieres pagar.' });
      if (estado.medio === 'pse' && !valor('co-banco')) e.push({ id: 'co-banco', mensaje: 'Elige tu banco para pagar con PSE.' });
      if ((estado.medio === 'nequi' || estado.medio === 'davi') && !celularValido(valor('co-billetera')))
        e.push({
          id: 'co-billetera',
          mensaje: `Escribe el celular registrado en ${MEDIOS[estado.medio]}: 10 dígitos que empiecen por 3.`,
        });
      if (!$<HTMLInputElement>('#co-terminos').checked)
        e.push({ id: 'co-terminos', mensaje: 'Acepta los términos de la compra para pagar.' });
      if (!$<HTMLInputElement>('#co-datos').checked)
        e.push({ id: 'co-datos', mensaje: 'Autoriza el tratamiento de tus datos para pagar.' });
    }
    return e;
  };

  // Pista corta bajo el botón (textos del prototipo)
  const pistaCorta = (paso: number, e: ErrorCampo[]) => {
    if (paso === 2) return e.some((x) => x.id === 'co-documento' && !valor('co-documento'))
      ? 'Escribe tu número de documento para continuar.'
      : 'Completa tus datos para continuar.';
    if (paso === 3 && (e[0].id === 'co-terminos' || e[0].id === 'co-datos'))
      return 'Acepta los términos y la política de datos para pagar.';
    return e[0].mensaje;
  };

  // Errores por campo: solo después del primer intento de avanzar en ese paso
  const pintarErroresCampos = () => {
    const paso = estado.paso;
    const e = estado.intentado[paso - 1] ? validar(paso) : [];
    $$('[data-error-de]', $(`[data-paso="${paso}"]`) ?? document).forEach((p) => {
      const error = e.find((x) => x.id === p.dataset.errorDe);
      p.textContent = error?.mensaje ?? '';
      const campo = $(`#${p.dataset.errorDe}`);
      if (error) campo?.setAttribute('aria-invalid', 'true');
      else campo?.removeAttribute('aria-invalid');
    });
    ['co-mayores', 'co-terminos', 'co-datos'].forEach((id) => {
      const caja = $(`#${id}-caja`);
      if (!caja) return;
      const invalido = e.some((x) => x.id === id);
      caja.toggleAttribute('data-invalido', invalido);
      const input = $(`#${id}`);
      if (invalido) input.setAttribute('aria-invalid', 'true');
      else input.removeAttribute('aria-invalid');
    });
  };

  const mostrarResumenErrores = (e: ErrorCampo[]) => {
    const caja = $('[data-errores]');
    caja.replaceChildren();
    const titulo = document.createElement('b');
    titulo.textContent = e.length === 1 ? 'Falta un dato para continuar:' : `Faltan ${e.length} datos para continuar:`;
    const lista = document.createElement('ul');
    e.forEach((x) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#${x.id}`;
      a.textContent = x.mensaje;
      a.addEventListener('click', (ev) => {
        ev.preventDefault();
        const destino = $(`#${x.id}`);
        const enfocable = destino?.matches('fieldset') ? $<HTMLElement>('input', destino) : destino;
        enfocable?.focus();
      });
      li.append(a);
      lista.append(li);
    });
    caja.append(titulo, lista);
    caja.hidden = false;
    $('[data-cuerpo]').scrollTop = 0;
    caja.focus();
  };

  // ---------- Asistentes del paso 2 ----------
  const nombresAsistentes: Record<number, string> = {};
  const pintarAsistentes = (c: ReturnType<typeof calcular>) => {
    const bloque = $('[data-asistentes]');
    const lista = $('[data-asistentes-lista]');
    const total = c.personas;
    bloque.hidden = total <= 1;
    if (total <= 1) return;
    $('[data-asistentes-pista]').textContent = c.divide
      ? 'Tus amigos completan sus datos cuando pagan su parte.'
      : 'Opcional. También lo puedes completar después desde Mis boletas.';
    const amigos = c.parche ? datos.amigos.filter((a) => estado.elegidos.includes(a.id)) : [];
    const firma = JSON.stringify([total, amigos.map((a) => a.id), c.divide]);
    if (lista.dataset.firma === firma) return;
    lista.dataset.firma = firma;
    lista.replaceChildren();
    for (let n = 2; n <= total; n++) {
      const amigo = amigos[n - 2];
      if (amigo) {
        const fila = document.createElement('div');
        fila.className = 'amigo';
        fila.innerHTML = `<span class="av" aria-hidden="true"></span><span><b></b><span></span></span>`;
        const av = $('.av', fila);
        av.textContent = amigo.iniciales;
        av.style.background = amigo.color;
        $('b', fila).textContent = `Boleta ${n} · ${amigo.nombre}`;
        $('span span', fila).textContent = c.divide ? 'Lo completan ellos al pagar su parte' : 'La boleta queda a su nombre';
        lista.append(fila);
      } else {
        const campo = document.createElement('div');
        campo.className = 'campo';
        const id = `co-asistente-${n}`;
        campo.innerHTML = `<label for="${id}"></label><input id="${id}" type="text" autocomplete="off" placeholder="Opcional" />`;
        $('label', campo).textContent = `Boleta ${n} · Nombre del asistente`;
        const input = $<HTMLInputElement>('input', campo);
        input.value = nombresAsistentes[n] ?? '';
        input.addEventListener('input', () => (nombresAsistentes[n] = input.value));
        lista.append(campo);
      }
    }
  };

  // ---------- Órdenes (H26: lista de órdenes y acumulado) ----------
  const textoOrdenes = () => {
    if (!estado.ordenes.length) return null;
    const propias = estado.ordenes.reduce((s, o) => s + o.propias, 0);
    const ultima = estado.ordenes[estado.ordenes.length - 1];
    const titulo =
      estado.ordenes.length === 1
        ? `Tienes ${plural(propias, 'boleta', 'boletas')} · ${ultima.loc.corto}`
        : `Tienes ${plural(propias, 'boleta', 'boletas')} en ${estado.ordenes.length} órdenes`;
    const pendientes = estado.ordenes.reduce((s, o) => s + o.pendientes.length, 0);
    const sub = pendientes
      ? `${plural(pendientes, 'pago pendiente', 'pagos pendientes')} de tu parche`
      : 'También te llegaron al correo';
    return { titulo, sub };
  };

  const plantilla = $<HTMLTemplateElement>('#plantilla-boleta');
  const boleta = (o: Orden) => {
    const nodo = plantilla.content.firstElementChild!.cloneNode(true) as HTMLElement;
    $('[data-b-loc]', nodo).textContent = o.loc.completo;
    $('[data-b-cantidad]', nodo).textContent = o.cantidadTexto;
    $('[data-b-titular]', nodo).textContent = o.titular;
    $('[data-b-orden]', nodo).textContent = o.orden;
    if (o.vipApartada) {
      const faltan = o.pendientes.length;
      $('[data-b-estado]', nodo).textContent = 'Mesa apartada';
      $('[data-b-qr]', nodo).hidden = true;
      const ap = $('[data-b-apartada]', nodo);
      ap.hidden = false;
      ap.textContent = `Mesa apartada · ${faltan === 1 ? 'falta 1 pago' : `faltan ${faltan} pagos`} · vence [PLAZO]`;
    }
    return nodo;
  };

  // ---------- Pagar (demostración: aprueba al instante, sin pasarela) ----------
  const pagar = () => {
    const c = calcular();
    const pendientes = c.divide ? datos.amigos.filter((a) => estado.elegidos.includes(a.id)) : [];
    const cantidadTexto = c.divide
      ? c.vip
        ? `Pagaste 1 de ${c.n} partes (${c.personas} puestos)`
        : `Tu boleta · 1 de ${c.personas}`
      : c.vip
        ? `${plural(c.unidades, 'mesa', 'mesas')} · ${c.personas} personas`
        : plural(c.personas, 'boleta', 'boletas');
    const orden: Orden = {
      loc: c.l,
      cantidadTexto,
      propias: c.divide ? 1 : c.personas,
      divide: c.divide,
      pendientes,
      pagado: c.parte,
      medio: MEDIOS[estado.medio],
      titular: valor('co-nombre'),
      correo: valor('co-correo'),
      // Número de demostración; en producción lo genera el servidor (H2, H26)
      orden: `#FE-2026-10-${String(421 + estado.ordenes.length).padStart(5, '0')}`,
      vipApartada: c.vip && c.divide,
    };
    estado.ordenes.push(orden);

    const nombre = orden.titular.split(' ')[0];
    $('[data-saludo]').textContent = datos.saludoPista ? `¡Listo, ${nombre}! Nos vemos en la pista` : `¡Listo, ${nombre}!`;
    $('[data-mensaje-listo]').textContent = c.divide
      ? `Pagaste tu parte (${pesos(orden.pagado)}) con ${orden.medio}. ${
          pendientes.length === 1 ? 'Tu amigo recibió' : 'Tus amigos recibieron'
        } su solicitud de pago dentro de la app, en el chat de ${datos.parche}.`
      : `Pagaste ${pesos(orden.pagado)} con ${orden.medio}. Tus boletas ya están en Mis boletas.`;
    $('[data-boleta-destino]').replaceChildren(boleta(orden));
    const pagos = $('[data-pagos-parche]');
    pagos.hidden = !pendientes.length;
    $('[data-pagos-lista]').replaceChildren(
      ...pendientes.map((a) => {
        const li = document.createElement('li');
        li.innerHTML = '<span class="av" aria-hidden="true"></span><span class="nombre"></span><span class="pendiente">Solicitud enviada · pendiente</span>';
        const av = $('.av', li);
        av.textContent = a.iniciales;
        av.style.background = a.color;
        $('.nombre', li).textContent = a.nombre;
        return li;
      }),
    );
    $('[data-linea-correo]').textContent = `La boleta también te llega al correo ${orden.correo}.`;
    marcarVoy(true);
    irAPaso(4, false);
    anuncio('Paso 4 de 4: Listo');
  };

  // ---------- Abrir y cerrar ----------
  const abrir = (desde: HTMLElement) => {
    abridor = desde;
    if (estado.paso === 4) {
      // "Comprar más boletas": reinicia medio, banco, división y casillas; conserva lo demás
      estado.medio = '';
      estado.dividir = false;
      estado.intentado = [false, false, false, false];
      $$<HTMLInputElement>('input[data-medio]').forEach((r) => (r.checked = false));
      $<HTMLSelectElement>('#co-banco').value = '';
      ['co-terminos', 'co-datos', 'co-mayores'].forEach((id) => {
        const c = $<HTMLInputElement>(`#${id}`);
        if (c) c.checked = false;
      });
      estado.paso = 1;
    }
    pintarPaso();
    pintar();
    ventana.showModal();
    document.documentElement.classList.add('con-ventana');
    $<HTMLElement>('[data-cerrar-compra]').focus();
    anuncio(`Paso ${estado.paso} de 4: ${NOMBRES_PASO[estado.paso - 1]}`);
  };

  ventana.addEventListener('close', () => {
    document.documentElement.classList.remove('con-ventana');
    abridor?.focus();
  });
  // Clic en el fondo oscuro
  ventana.addEventListener('click', (ev) => {
    if (ev.target === ventana) ventana.close();
  });
  $$('[data-cerrar-compra]').forEach((b) => b.addEventListener('click', () => ventana.close()));
  $$<HTMLButtonElement>('[data-abrir-compra]').forEach((b) => b.addEventListener('click', () => abrir(b)));

  // ---------- Eventos de los controles ----------
  document.addEventListener('change', (ev) => {
    const t = ev.target as HTMLInputElement;
    if (t.matches('input[data-loc]')) {
      estado.loc = t.value;
      // Recorta los amigos al cupo de la nueva localidad y lo avisa (H24)
      const cupo = cupoAmigos(localidad());
      mensajeRecorte = '';
      if (estado.elegidos.length > cupo) {
        estado.elegidos = estado.elegidos.slice(0, cupo);
        mensajeRecorte = `La mesa VIP es para 4: quedaron elegidos ${plural(cupo, 'amigo', 'amigos')}.`;
      }
      pintar();
    } else if (t.matches('[data-para-quien]')) {
      estado.paraQuien = t.value as 'yo' | 'parche';
      pintar();
    } else if (t.matches('[data-medio]')) {
      estado.medio = t.value;
      pintar();
    } else if (ventana.contains(t)) {
      pintar();
    }
  });
  ventana.addEventListener('input', () => pintar());

  $$<HTMLButtonElement>('[data-menos], [data-mas]').forEach((b) =>
    b.addEventListener('click', () => {
      if (b.getAttribute('aria-disabled') === 'true') return;
      const l = localidad();
      estado.cantidad = Math.min(l.maximo, Math.max(1, estado.cantidad + (b.matches('[data-mas]') ? 1 : -1)));
      pintar();
    }),
  );

  $$<HTMLButtonElement>('[data-miembro]').forEach((b) =>
    b.addEventListener('click', () => {
      if (b.getAttribute('aria-disabled') === 'true') return;
      const id = b.dataset.miembro!;
      estado.elegidos = estado.elegidos.includes(id) ? estado.elegidos.filter((x) => x !== id) : [...estado.elegidos, id];
      mensajeRecorte = '';
      pintar();
    }),
  );

  $('[data-dividir]')?.addEventListener('click', (ev) => {
    const sw = ev.currentTarget as HTMLElement;
    if (sw.getAttribute('aria-disabled') === 'true') return;
    estado.dividir = !estado.dividir;
    pintar();
  });

  $('[data-ver-detalle]').addEventListener('click', (ev) => {
    const b = ev.currentTarget as HTMLElement;
    const abierto = b.getAttribute('aria-expanded') !== 'true';
    b.setAttribute('aria-expanded', String(abierto));
    b.textContent = abierto ? 'Ocultar detalle' : 'Ver detalle';
    $('[data-resumen]').toggleAttribute('data-abierto', abierto);
  });

  $('[data-siguiente]').addEventListener('click', () => {
    const paso = estado.paso;
    estado.intentado[paso - 1] = true;
    const e = validar(paso);
    if (e.length) {
      pintar();
      mostrarResumenErrores(e);
      return;
    }
    if (paso === 3) pagar();
    else irAPaso(paso + 1);
  });
  $('[data-form-datos]').addEventListener('submit', (ev) => {
    ev.preventDefault();
    $<HTMLButtonElement>('[data-siguiente]').click();
  });
  $('[data-atras]').addEventListener('click', () => irAPaso(estado.paso - 1));

  // "Agregar al calendario" descarga un .ics de verdad (H54)
  $('[data-calendario]').addEventListener('click', (ev) => {
    const b = ev.currentTarget as HTMLElement;
    estado.calendario = !estado.calendario;
    b.setAttribute('aria-pressed', String(estado.calendario));
    $('[data-calendario-texto]').textContent = estado.calendario ? 'Agregado al calendario' : 'Agregar al calendario';
    if (!estado.calendario) return;
    const inicio = datos.inicioIso
      ? `DTSTART:${new Date(datos.inicioIso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`
      : `DTSTART;VALUE=DATE:${datos.fecha.replace(/-/g, '')}`;
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Fulleventos//Evento//ES',
      'BEGIN:VEVENT',
      `UID:${datos.url.replace(/\W/g, '')}@fulleventos`,
      inicio,
      `SUMMARY:${datos.titulo}`,
      `LOCATION:${datos.lugar}`,
      `URL:${location.origin}${datos.url}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
    const enlace = document.createElement('a');
    enlace.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    enlace.download = 'evento-fulleventos.ics';
    enlace.click();
    setTimeout(() => URL.revokeObjectURL(enlace.href), 1000);
  });

  // "Ver boleta" abre un visor aparte con todas las órdenes (H26); lo abre el Modal compartido
  $$('[data-ver-boleta]').forEach((b) =>
    b.addEventListener('click', () => {
      $('[data-visor-boletas]').replaceChildren(...estado.ordenes.map(boleta));
    }),
  );

  pintarPaso();
  pintar();
};
