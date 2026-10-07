// Plantillas de las partes del chat que cambian con el estado (N47–N56). Se usan en el servidor para el
// primer pintado (set:html) y en el navegador al cambiar el estado, así hay una sola fuente de marcado.
// Los estilos están en BandejaMensajes.astro (selectores :global bajo .app-mensajes).
import { YO, type Conversacion, type Mensaje } from '../../data/mensajes';
import { icono, verificado } from './iconos';
import {
  abiertaId,
  avatarConv,
  continuaRacha,
  cortoDe,
  colorDe,
  datosEncuesta,
  datosParche,
  datosReaccion,
  esFila,
  eventoDe,
  fechaCorta,
  filtradas,
  flujo,
  inicialesDe,
  nombreConv,
  nombreDe,
  noLeidosDe,
  perfilDe,
  planesEnComun,
  sigueRacha,
  subtitulo,
  subtituloInfo,
  textoFaltan,
  textoListaVacia,
  textoPrecio,
  todas,
  vistaPrevia,
  type ElementoFlujo,
  type Estado,
} from './estado';

export const esc = (s: string | number) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const si = (cond: unknown, html: string) => (cond ? html : '');
const fondoFoto = (bg1: string, bg2: string) => `background: radial-gradient(circle at 70% 30%, ${bg1} 0, transparent 58%), ${bg2}`;

export const rutaConversacion = (c: Conversacion) => (c.slug ? `/mensajes/${c.slug}` : '/mensajes');

const avatar = (c: Conversacion, tamano: 44 | 48 | 72) => {
  const a = avatarConv(c);
  return `<span class="av av-${tamano} ${a.clase}" aria-hidden="true">${esc(a.iniciales)}</span>`;
};

// ---------- N47 · Lista de conversaciones ----------

const filaLista = (e: Estado, c: Conversacion, abierta: boolean) => {
  const n = noLeidosDe(e, c);
  const enviados = (e.enviados[c.id]?.length ?? 0) > 0;
  const ev = c.evento ? eventoDe(c.evento) : null;
  return `<li><a href="${rutaConversacion(c)}" class="fila${n ? ' con-nuevos' : ''}" data-abrir="${c.id}" data-foco="fila-${c.id}"${abierta ? ' aria-current="true"' : ''}>
  ${avatar(c, 48)}
  <span class="fila-texto">
    <span class="fila-l1"><b class="fila-nombre">${esc(nombreConv(c))}</b>${si(c.tipo === 'organizador', verificado(15))}${si(
      e.silenciadas[c.id],
      `<svg class="fila-silenciada" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="Silenciado" focusable="false"><path d="M8.7 3.6A6 6 0 0 1 18 8c0 3.2.6 5.4 1.3 6.8M17 17H3s3-2 3-9c0-.5 0-1 .1-1.4"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/><path d="m3 3 18 18"/></svg>`,
    )}<span class="fila-hora">${esc(enviados ? 'Ahora' : c.hora || 'Ahora')}</span></span>
    <span class="fila-l2"><span class="fila-previa">${esc(vistaPrevia(e, c))}</span>${si(
      n,
      `<span class="contador" aria-hidden="true">${n}</span><span class="solo-lectores">, ${n === 1 ? '1 mensaje sin leer' : `${n} mensajes sin leer`}</span>`,
    )}</span>
    ${si(ev, `<span class="pildora-evento">${icono('calendario', 12, 2.4)}${esc(ev ? `${fechaCorta(ev)} · ${ev.etiqueta}` : '')}</span>`)}
    ${si(c.tipo === 'organizador', '<span class="pildora-org">Organizador · Responde en ~1 h</span>')}
  </span>
</a></li>`;
};

export const listaHTML = (e: Estado) => {
  const mapa = todas(e);
  const ids = filtradas(e);
  const abierta = abiertaId(e);
  if (!ids.length) {
    return `<div class="lista-vacia"><p>${esc(textoListaVacia(e))}</p><button type="button" class="boton-contorno" data-accion="ver-todos" data-foco="ver-todos">Ver todos los chats</button></div>`;
  }
  return `<ul class="filas">${ids.map((id) => filaLista(e, mapa[id], id === abierta)).join('')}</ul>`;
};

// ---------- N48 · Barra superior de la conversación ----------

export const barraHTML = (e: Estado, ancho: boolean) => {
  const c = todas(e)[abiertaId(e)];
  const ev = c.evento ? eventoDe(c.evento) : null;
  const etiquetaInfo = c.tipo === 'parche' ? 'Info del grupo' : 'Info del chat';
  const infoVisible = ancho ? e.infoAncho : e.infoAngosto;
  const silenciada = !!e.silenciadas[c.id];
  return `<button type="button" class="volver-lista" data-accion="volver" aria-label="Volver a tus chats" data-foco="volver">${icono('volver', 20, 2.2)}</button>
  ${avatar(c, 44)}
  <div class="barra-nombre">
    <div class="barra-fila"><h2 class="barra-titulo" tabindex="-1" data-titulo-conv>${esc(nombreConv(c))}</h2>${si(c.tipo === 'organizador', verificado(17))}</div>
    <span class="barra-sub">${si(c.estado === 'En línea', '<span class="en-linea" aria-hidden="true"></span>')}<span class="barra-sub-texto">${esc(subtitulo(c))}</span></span>
  </div>
  <div class="barra-acciones">
    ${si(ev, `<a href="${esc(ev?.ruta ?? '')}" class="icono-barra" aria-label="Ver evento">${icono('boleta')}</a>`)}
    <button type="button" class="icono-barra" data-accion="info" data-foco="info" aria-label="${etiquetaInfo}" aria-pressed="${infoVisible}">${icono('info')}</button>
    <button type="button" class="icono-barra" data-accion="silenciar" data-foco="silenciar" aria-label="Silenciar chat" aria-pressed="${silenciada}">${icono(silenciada ? 'silenciado' : 'campana')}</button>
  </div>`;
};

// ---------- N51 · Plan fijado ----------

export const planHTML = (e: Estado) => {
  const c = todas(e)[abiertaId(e)];
  if (c.tipo !== 'parche' || !c.evento) return '';
  const ev = eventoDe(c.evento);
  const { total, conBoleta, yoTengo } = datosParche(c);
  const pct = total ? Math.round((conBoleta / total) * 100) : 0;
  const accion = yoTengo
    ? `<a href="${esc(ev.ruta)}" class="ya-tienes"><span class="ya-tienes-circulo">${icono('palomita', 14, 3)}</span>Ya tienes boleta</a>`
    : `<div class="comprar"><a href="${esc(ev.ruta)}" class="boton-comprar">${icono('boleta', 17, 2.2)}Comprar mi boleta</a><span class="comprar-precio">${esc(textoPrecio(ev.precio))}<br>+ cargo por servicio</span></div>`;
  return `<div class="plan-envoltura"><section class="plan" aria-label="Plan fijado del parche">
  <span class="plan-foto" role="img" aria-label="[Foto del evento]" style="${fondoFoto(ev.bg1, ev.bg2)}"><span class="placa placa-plan" aria-hidden="true"><b>${esc(ev.d)}</b><span>${esc(ev.mes)}</span></span></span>
  <div class="plan-texto">
    <span class="antetitulo">${icono('chinche', 13, 2.4)}Plan fijado · ${esc(textoFaltan(ev.faltan))}</span>
    <a href="${esc(ev.ruta)}" class="plan-titulo">${esc(ev.titulo)}</a>
    <span class="plan-meta">${esc(`${fechaCorta(ev)}${ev.hora ? ` · ${ev.hora}` : ''} · ${ev.lugar} · ${ev.ciudad}`)}</span>
    <div class="plan-progreso">
      <div class="barra-boletas" role="img" aria-label="${conBoleta} de ${total} miembros ya tienen boleta"><div class="barra-relleno" style="width: ${pct}%"></div></div>
      <span class="plan-conteo" aria-hidden="true"><b>${conBoleta} de ${total}</b> ya tienen boleta</span>
    </div>
  </div>
  ${accion}
</section></div>`;
};

// ---------- N49–N54 · Historial ----------

const REACCION_ICONO = { encanta: 'encanta', prendido: 'prendido', gusta: 'gusta' } as const;

const reaccionesHTML = (e: Estado, m: Mensaje) => {
  if (!('reacciones' in m) || !m.reacciones?.length) return '';
  return `<div class="reacciones">${m.reacciones
    .map(([tipo, base]) => {
      const r = datosReaccion(e, m.id, tipo, base);
      return `<button type="button" class="reaccion r-${tipo}${r.marcada ? ' marcada' : ''}" data-accion="reaccion" data-mensaje="${m.id}" data-tipo="${tipo}" data-base="${base}" aria-pressed="${r.marcada}" aria-label="${esc(r.etiqueta)}">${icono(REACCION_ICONO[tipo], 15, 2.2)}<span data-n>${r.n}</span></button>`;
    })
    .join('')}</div>`;
};

export const opcionEncuestaHTML = (idEncuesta: string, o: ReturnType<typeof datosEncuesta>['opciones'][number]) =>
  `<label class="opcion-encuesta${o.elegida ? ' elegida' : ''}" data-opcion="${o.id}">
    <input type="radio" class="solo-lectores" name="encuesta-${idEncuesta}" value="${o.id}" data-accion="votar" data-encuesta="${idEncuesta}"${o.elegida ? ' checked' : ''}>
    <span class="opcion-relleno" style="width: ${o.pct}%" aria-hidden="true"></span>
    <span class="opcion-punto" aria-hidden="true">${icono('palomita', 10, 4)}</span>
    <span class="opcion-texto">${esc(o.texto)}</span>
    <span class="opcion-votos"><span aria-hidden="true" data-n>${o.n}</span><span class="solo-lectores" data-votos>, ${esc(o.votos)}</span></span>
  </label>`;

const contenidoFila = (e: Estado, m: Extract<Mensaje, { de: string }>, propio: boolean, primeroAjeno: boolean) => {
  if (m.tipo === 'texto') {
    return `<p class="burbuja${propio ? ' propia' : primeroAjeno ? ' pico' : ''}">${si(propio, '<span class="solo-lectores">Tú: </span>')}${esc(m.texto)}</p>`;
  }
  if (m.tipo === 'evento') {
    const ev = eventoDe(m.evento);
    const rep = !!e.reposteados[m.id];
    return `<article class="evento-compartido">
      <div class="evento-foto" role="img" aria-label="[Foto del evento]" style="${fondoFoto(ev.bg1, ev.bg2)}"><span class="placa placa-tarjeta" aria-hidden="true"><b>${esc(ev.d)}</b><span>${esc(ev.mes)}</span></span></div>
      <div class="evento-cuerpo">
        <span class="evento-categoria">${esc(ev.categoria)}</span>
        <h3 class="evento-titulo"><a href="${esc(ev.ruta)}">${esc(ev.titulo)}</a></h3>
        <span class="evento-meta">${esc(`${fechaCorta(ev)} · ${ev.lugar} · ${ev.ciudad}`)}</span>
        <span class="evento-precio">${esc(textoPrecio(ev.precio))}</span>
        <span class="evento-cargo">+ cargo por servicio</span>
        <div class="evento-acciones">
          <button type="button" class="repostear${rep ? ' marcada' : ''}" data-accion="repostear" data-mensaje="${m.id}" aria-pressed="${rep}">${icono('repost', 15, 2.2)}<span data-texto>${rep ? 'Reposteado' : 'Repostear'}</span></button>
          <a href="${esc(ev.ruta)}" class="ver-evento" aria-label="Ver evento: ${esc(ev.titulo)}">${icono('flecha', 16, 2.4)}</a>
        </div>
      </div>
    </article>`;
  }
  if (m.tipo === 'encuesta') {
    const d = datosEncuesta(e, m);
    return `<div class="encuesta" data-encuesta="${m.id}">
      <span class="antetitulo antetitulo-encuesta">${icono('encuesta', 13, 2.6)}Encuesta</span>
      <fieldset class="encuesta-opciones">
        <legend class="encuesta-pregunta">${esc(m.pregunta)}</legend>
        ${d.opciones.map((o) => opcionEncuestaHTML(m.id, o)).join('')}
      </fieldset>
      <span class="encuesta-pie" data-pie>${esc(d.pie)}</span>
    </div>`;
  }
  const [bg1, bg2, bg3] = m.colores ?? ['#F6DC6A', '#5A2340', '#EE93BC'];
  return `<div class="foto">
    <div class="foto-imagen" role="img" aria-label="${esc(m.alt)}" style="background: radial-gradient(circle at 28% 30%, ${bg1} 0, transparent 50%), radial-gradient(circle at 76% 72%, ${bg3} 0, transparent 42%), ${bg2}"><span class="foto-rotulo" aria-hidden="true">${esc(m.alt)}</span></div>
    ${si(m.pie, `<p class="foto-pie">${esc(m.pie ?? '')}</p>`)}
  </div>`;
};

export const elementoHTML = (e: Estado, c: Conversacion, lista: ElementoFlujo[], i: number) => {
  const m = lista[i];
  if (m.tipo === 'fecha') return `<div class="sep-fecha" data-item><span aria-hidden="true"></span>${esc(m.texto)}<span aria-hidden="true"></span></div>`;
  if (m.tipo === 'nuevos') return `<div class="sep-nuevos" data-item data-sep-nuevos><span aria-hidden="true"></span>${esc(m.texto)}<span aria-hidden="true"></span></div>`;
  if (m.tipo === 'sistema') {
    const ic = m.icono === 'boleta' ? icono('boletaLisa', 13, 2.4) : m.icono === 'pago' ? icono('pesos', 13, 2.4) : icono('personaMas', 13, 2.4);
    return `<div class="sistema" data-item><span class="sistema-pildora"><span class="sistema-icono i-${m.icono}">${ic}</span><span class="sistema-texto"><b>${esc(m.texto)}</b> <span class="sistema-hora">· ${esc(m.hora)}</span></span></span></div>`;
  }
  if (!esFila(m)) return '';
  const propio = m.de === YO;
  const sigue = sigueRacha(lista, i);
  const conAvatar = !propio && c.tipo === 'parche';
  const conHora = !continuaRacha(lista, i) && !!m.hora;
  const avatarHTML = conAvatar
    ? sigue
      ? '<span class="av-hueco" aria-hidden="true"></span>'
      : `<a href="${perfilDe(m.de)}" class="av av-32 circulo ${colorDe(m.de)}" aria-label="${esc(`${inicialesDe(m.de)}, perfil de ${nombreDe(m.de)}`)}">${esc(inicialesDe(m.de))}</a>`
    : '';
  return `<div class="msg ${propio ? 'propio' : 'ajeno'}${sigue ? ' sigue' : ''}" data-item data-fila data-de="${m.de}">
  ${avatarHTML}
  <div class="msg-col">
    ${si(conAvatar && !sigue, `<span class="msg-nombre">${esc(nombreDe(m.de))}</span>`)}
    ${contenidoFila(e, m, propio, !sigue)}
    ${reaccionesHTML(e, m)}
    ${si(conHora, `<span class="msg-hora" data-meta>${esc(m.hora)}${si(propio, icono('dobleCheck', 14, 2.2))}</span>`)}
  </div>
</div>`;
};

export const vacioConversacion = (c: Conversacion) =>
  `<p class="conv-vacia" data-vacio-conv>${esc(
    c.tipo === 'parche' ? 'Arranquen el plan: escriban, compartan un evento o armen una encuesta.' : `Escríbele a ${cortoDe(c.con!)} para arrancar el plan.`,
  )}</p>`;

export const hiloHTML = (e: Estado) => {
  const c = todas(e)[abiertaId(e)];
  const lista = flujo(e, c);
  const vacio = !lista.some((m) => m.tipo !== 'fecha' && m.tipo !== 'nuevos');
  return lista.map((_, i) => elementoHTML(e, c, lista, i)).join('') + si(vacio, vacioConversacion(c));
};

// ---------- N56 · Panel de información ----------

export const infoHTML = (e: Estado) => {
  const c = todas(e)[abiertaId(e)];
  const ev = c.evento ? eventoDe(c.evento) : null;
  const etiqueta = c.tipo === 'parche' ? 'Info del grupo' : 'Info del chat';
  const silenciada = !!e.silenciadas[c.id];
  const comun = planesEnComun(e, c);
  const { total, conBoleta } = datosParche(c);

  const identidad = `<div class="info-identidad">
    <span class="av av-72 ${avatarConv(c).clase}" aria-hidden="true">${esc(avatarConv(c).iniciales)}</span>
    <h2 class="info-nombre" id="info-nombre">${esc(nombreConv(c))}${si(c.tipo === 'organizador', verificado(17))}</h2>
    <span class="info-sub">${esc(subtituloInfo(c))}</span>
    ${si(
      c.tipo !== 'parche',
      `<a href="${perfilDe(c.con!)}" class="ver-perfil">${c.tipo === 'organizador' ? 'Ver perfil del organizador' : 'Ver perfil'}</a>`,
    )}
  </div>`;

  const eventoParche = ev
    ? `<div class="info-bloque info-evento"><h3 class="info-antetitulo">Evento del parche</h3>
      <a href="${esc(ev.ruta)}" class="info-evento-enlace"><span class="mini-foto mini-52" role="img" aria-label="[Foto del evento]" style="${fondoFoto(ev.bg1, ev.bg2)}"></span><span class="mini-texto"><b>${esc(ev.titulo)}</b><span>${esc(`${fechaCorta(ev)} · ${ev.lugar} · ${ev.ciudad}`)}</span></span></a></div>`
    : '';

  // Orden: Camila, luego con boleta, luego sin boleta (detalle fino 23)
  const puntaje = (k: string) => (k === YO ? 0 : c.conBoleta?.includes(k) ? 1 : 2);
  const miembros =
    c.tipo === 'parche'
      ? `<div class="info-bloque"><div class="info-fila-titulo"><h3 class="info-h3">Miembros · ${total}</h3>${si(ev, `<span class="info-conteo">${conBoleta} de ${total} con boleta</span>`)}</div>
      <ul class="miembros">${(c.miembros ?? [])
        .slice()
        .sort((a, b) => puntaje(a) - puntaje(b))
        .map((k) => {
          const rol = k === c.admin ? (k === YO ? 'Creaste el parche' : 'Creó el parche') : '';
          const tiene = !!c.conBoleta?.includes(k);
          return `<li class="miembro"><span class="av av-34 circulo ${colorDe(k)}" aria-hidden="true">${esc(inicialesDe(k))}</span>
            <span class="miembro-texto"><span class="miembro-nombre">${esc(k === YO ? `Tú (${cortoDe(YO)})` : nombreDe(k))}</span>${si(rol, `<span class="miembro-rol">${rol}</span>`)}</span>
            ${si(ev && tiene, `<span class="tiene-boleta"><span class="tiene-circulo" aria-hidden="true">${icono('palomita', 11, 3.4)}</span>Tiene boleta</span>`)}${si(ev && !tiene, '<span class="sin-boleta">Sin boleta</span>')}</li>`;
        })
        .join('')}</ul></div>`
      : '';

  const dividido = !!e.dividido[c.id];
  const dividir = ev
    ? `<div class="info-bloque"><button type="button" class="boton-dividir${dividido ? ' marcada' : ''}" data-accion="dividir" data-foco="dividir" aria-pressed="${dividido}">${icono('pesos', 17, 2.2)}${dividido ? 'Pago dividido activo' : 'Dividir pago del parche'}</button>
      <p class="nota-dividir">Cada uno paga su parte de la boleta desde su cuenta: nadie tiene que adelantar la plata de todos.</p></div>`
    : '';

  const enComun = comun.length
    ? `<div class="info-bloque info-comun"><h3 class="info-h3">${c.tipo === 'organizador' ? 'Sus próximos eventos' : 'Planes en común'}</h3>${comun
        .map(
          ({ ev: x, via }) =>
            `<a href="${esc(x.ruta)}" class="info-evento-enlace"><span class="mini-foto mini-46" role="img" aria-label="[Foto del evento]" style="${fondoFoto(x.bg1, x.bg2)}"></span><span class="mini-texto mini-chico"><b>${esc(x.titulo)}</b><span>${esc(`${fechaCorta(x)} · ${x.ciudad}${via ? ` · ${via}` : ''}`)}</span></span></a>`,
        )
        .join('')}</div>`
    : '';

  const salir =
    c.tipo !== 'parche'
      ? ''
      : e.confirmandoSalida
        ? `<div class="confirmar-salida" role="group" aria-label="Confirmar salida del parche"><p tabindex="-1" data-foco="confirmar" data-confirmar>¿Seguro que quieres salir de <b>${esc(nombreConv(c))}</b>? Ya no verás los mensajes ni el plan.</p>
          <div class="confirmar-botones"><button type="button" class="boton-contorno chico" data-accion="me-quedo" data-foco="me-quedo">Me quedo</button><button type="button" class="boton-rojo chico" data-accion="si-salir" data-foco="si-salir">Sí, salir</button></div></div>`
        : `<button type="button" class="salir" data-accion="salir" data-foco="salir">${icono('salir', 19)}Salir del parche</button>`;

  return `<div class="info-cabeza"><span class="info-rotulo">${etiqueta}</span><button type="button" class="cerrar-info" data-accion="cerrar-info" data-foco="cerrar-info" aria-label="Cerrar información">${icono('cerrar', 16, 2.4)}</button></div>
  ${identidad}${eventoParche}${miembros}${dividir}${enComun}
  <div class="info-ajustes">
    <button type="button" class="interruptor" role="switch" aria-checked="${silenciada}" data-accion="silenciar" data-foco="silenciar-panel">${icono('silenciado', 19)}<span class="interruptor-texto">Silenciar notificaciones</span><span class="pista" aria-hidden="true"><span class="perilla"></span></span></button>
    ${salir}
  </div>`;
};

export const etiquetaInfo = (c: Conversacion) => (c.tipo === 'parche' ? 'Info del grupo' : 'Info del chat');
