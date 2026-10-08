// Camino A de /crear-evento: un evento nuevo en 4 pasos (decisión 2.26).
// Incluye el antiduplicados (si el nombre se parece a un evento que ya está, se ofrece publicar sobre ese) y la
// vista previa con el aspecto de la tarjeta pública. DEMOSTRACIÓN: al enviar no se guarda nada; en producción el
// backend lo guarda "En revisión" hasta que el equipo lo apruebe (moderación, H9, H13 y P9).
import { eventos } from '../../data/eventos';
import { nombreCiudad } from '../../data/ciudades';
import { hora12, normalizar, pesos, placaFecha, rutaEvento } from '../../lib/formato';
import { lineaEvento } from '../../lib/publicaciones';
import { $, $$, contar, crearValidador, elegido, mostrarError, valor } from './flujo';

const MAX_PRECIO = 20_000_000;
const MAX_FOTO = 10 * 1024 * 1024;
const TIPOS_FOTO = ['image/jpeg', 'image/png', 'image/webp'];

// ---------- Antiduplicados ----------
// Palabras de 3 o más letras sin conectores. Cada palabra pesa menos cuanto más títulos la tienen ("noche" está
// en 4 títulos; "salsa", en 2): así "noche de salsa" trae la salsa y no todas las noches.
const VACIAS = new Set(['de', 'del', 'la', 'el', 'los', 'las', 'en', 'y', 'a', 'al', 'con', 'por', 'para', 'un', 'una', 'vs']);
const palabras = (t: string) => normalizar(t).split(' ').filter((p) => p.length >= 3 && !VACIAS.has(p));
const titulos = eventos.map((e) => ({ e, palabras: palabras(e.titulo) }));
const coincide = (q: string, w: string) => w.startsWith(q) || (q.length >= 5 && q.startsWith(w));
const peso = (q: string) => 1 / Math.max(1, titulos.filter((t) => t.palabras.some((w) => coincide(q, w))).length);

export const parecidos = (nombre: string, maximo = 3) => {
  const q = palabras(nombre);
  if (normalizar(nombre).length < 4 || !q.length) return [];
  const total = q.reduce((s, p) => s + peso(p), 0);
  return titulos
    .map(({ e, palabras: w }) => ({ e, puntos: q.filter((p) => w.some((x) => coincide(p, x))).reduce((s, p) => s + peso(p), 0) / total }))
    .filter((r) => r.puntos >= 0.5)
    .sort((a, b) => b.puntos - a.puntos || a.e.fecha.localeCompare(b.e.fecha))
    .slice(0, maximo)
    .map((r) => r.e);
};

// "45.000", "$45000" o "45 000" → 45000; null si no es una cifra entera
const leerPrecio = (v: string) => {
  const limpio = v.replace(/[$\s.,]/g, '');
  return /^\d+$/.test(limpio) ? Number(limpio) : null;
};

// Acepta "boletera.com/evento" y le agrega https://
const normalizarUrl = (v: string) => (v && !/^[a-z][a-z0-9+.-]*:/i.test(v) ? `https://${v}` : v);
const urlValida = (v: string) => {
  try {
    const u = new URL(v);
    return (u.protocol === 'https:' || u.protocol === 'http:') && u.hostname.includes('.') && !u.hostname.endsWith('.');
  } catch {
    return false;
  }
};

interface Opciones {
  ir: (vista: string) => void;
  hoy: string;
  publicarSobre: (evento: string) => void;
}

export const iniciarEventoNuevo = ({ ir, hoy, publicarSobre }: Opciones) => {
  const forms = Object.fromEntries(['a1', 'a2', 'a3', 'a4'].map((id) => [id, $<HTMLFormElement>(`form[data-vista="${id}"]`)]));
  const fecha = $<HTMLInputElement>('#ev-fecha');
  fecha.min = hoy;

  // ---------- Paso 1 · Lo básico ----------
  const nombre = $<HTMLInputElement>('#ev-nombre');
  const cajaDuplicados = $<HTMLElement>('[data-duplicados]');
  const listaDuplicados = $<HTMLUListElement>('[data-lista-duplicados]');
  const anuncioDuplicados = $<HTMLElement>('[data-anuncio-duplicados]');
  const plantillaDuplicado = $<HTMLTemplateElement>('template[data-plantilla-duplicado]');
  let ultimos = '';
  let espera = 0;

  const buscarDuplicados = () => {
    const encontrados = parecidos(nombre.value);
    const clave = encontrados.map((e) => e.id).join(',');
    if (clave === ultimos) return;
    ultimos = clave;
    listaDuplicados.replaceChildren(
      ...encontrados.map((e) => {
        const li = plantillaDuplicado.content.firstElementChild!.cloneNode(true) as HTMLElement;
        $('[data-dup-titulo]', li).textContent = e.titulo;
        $('[data-dup-linea]', li).textContent = lineaEvento(e);
        const publicar = $<HTMLButtonElement>('[data-dup-publicar]', li);
        // El nombre accesible empieza por el texto visible (WCAG 2.5.3)
        publicar.setAttribute('aria-label', `Publicar sobre este evento: ${e.titulo}`);
        publicar.addEventListener('click', () => publicarSobre(e.id));
        const ver = $<HTMLAnchorElement>('[data-dup-ver]', li);
        ver.href = rutaEvento(e.ciudad, e.titulo);
        ver.setAttribute('aria-label', `Ver evento: ${e.titulo} (abre en otra pestaña)`);
        return li;
      }),
    );
    cajaDuplicados.hidden = encontrados.length === 0;
    anuncioDuplicados.textContent = encontrados.length
      ? `${encontrados.length === 1 ? 'Hay un evento parecido que ya está' : `Hay ${encontrados.length} eventos parecidos que ya están`} en Fulleventos: ${encontrados.map((e) => e.titulo).join('; ')}.`
      : '';
  };

  nombre.addEventListener('input', () => {
    clearTimeout(espera);
    espera = window.setTimeout(buscarDuplicados, 300);
  });

  const v1 = crearValidador(forms.a1, {
    'ev-nombre': () => (!valor('ev-nombre') ? 'Escribe el nombre del evento.' : valor('ev-nombre').length < 3 ? 'El nombre debe tener al menos 3 letras.' : ''),
    'ev-categoria': () => (valor('ev-categoria') ? '' : 'Elige una categoría.'),
    'ev-descripcion': () =>
      !valor('ev-descripcion') ? 'Escribe una descripción corta.' : valor('ev-descripcion').length < 20 ? 'Cuéntalo en al menos 20 caracteres.' : '',
  });
  const contarDescripcion = contar('ev-descripcion');

  // ---------- Paso 2 · Cuándo y dónde ----------
  const hora = $<HTMLInputElement>('#ev-hora');
  const horaVista = $<HTMLElement>('[data-hora-colombiana]');
  hora.addEventListener('change', () => {
    horaVista.textContent = hora.value ? `Se verá así: ${hora12(hora.value)}` : '';
  });

  const v2 = crearValidador(forms.a2, {
    'ev-fecha': () => {
      const f = valor('ev-fecha');
      if (!f) return 'Elige la fecha del evento.';
      if (!/^\d{4}-\d{2}-\d{2}$/.test(f)) return 'Revisa la fecha.';
      return f < hoy ? 'La fecha no puede ser anterior a hoy.' : '';
    },
    'ev-hora': () => (valor('ev-hora') ? '' : 'Escribe la hora de inicio.'),
    'ev-ciudad': () => (valor('ev-ciudad') ? '' : 'Elige la ciudad.'),
    'ev-lugar': () => (valor('ev-lugar') ? '' : 'Escribe el nombre del lugar.'),
    'ev-direccion': () => (valor('ev-direccion') ? '' : 'Escribe la dirección o el barrio.'),
  });

  // ---------- Paso 3 · Boletas ----------
  const conBoleta = $<HTMLElement>('[data-con-boleta]');
  const precio = $<HTMLInputElement>('#ev-precio');
  const precioVisto = $<HTMLElement>('[data-precio-visto]');
  const url = $<HTMLInputElement>('#ev-url');
  const esConBoleta = () => elegido('ev-entrada') === 'boleta';

  $$<HTMLInputElement>('input[name="ev-entrada"]').forEach((r) =>
    r.addEventListener('change', () => {
      conBoleta.hidden = !esConBoleta();
    }),
  );
  precio.addEventListener('input', () => {
    const n = leerPrecio(precio.value);
    precioVisto.textContent = n ? `Se verá así: Desde ${pesos(n)}` : '';
  });
  url.addEventListener('blur', () => {
    url.value = normalizarUrl(url.value.trim());
  });

  const v3 = crearValidador(forms.a3, {
    'ev-entrada': () => (elegido('ev-entrada') ? '' : 'Elige si la entrada es gratis o con boleta.'),
    'ev-precio': () => {
      if (!esConBoleta()) return '';
      const v = valor('ev-precio');
      if (!v) return 'Escribe el precio de la boleta más barata.';
      const n = leerPrecio(v);
      if (n === null) return 'Escribe el precio solo con números, por ejemplo 45000.';
      if (n === 0) return 'Si no se paga, elige «Gratis».';
      return n > MAX_PRECIO ? 'Revisa el precio: parece demasiado alto.' : '';
    },
    'ev-vende': () => (!esConBoleta() || valor('ev-vende') ? '' : 'Escribe quién vende las boletas.'),
    'ev-url': () => {
      if (!esConBoleta()) return '';
      const v = normalizarUrl(valor('ev-url'));
      if (!v) return 'Pega el enlace oficial de venta.';
      return urlValida(v) ? '' : 'Revisa el enlace: debe ser una dirección web completa, como https://…';
    },
  });

  // ---------- Paso 4 · Foto y revisión ----------
  const foto = $<HTMLInputElement>('#ev-foto');
  const fotoElegida = $<HTMLElement>('[data-foto-elegida]');
  const fotoPrevia = $<HTMLImageElement>('[data-foto-previa]');
  const teFoto = $<HTMLImageElement>('[data-te-foto]');
  let urlFoto = '';
  let errorFoto = '';

  const quitarFoto = () => {
    if (urlFoto) URL.revokeObjectURL(urlFoto);
    urlFoto = '';
    foto.value = '';
    fotoElegida.hidden = true;
    teFoto.hidden = true;
    teFoto.removeAttribute('src');
    fotoPrevia.removeAttribute('src');
  };

  foto.addEventListener('change', () => {
    const archivo = foto.files?.[0];
    errorFoto = '';
    if (urlFoto) URL.revokeObjectURL(urlFoto);
    urlFoto = '';
    if (archivo) {
      if (!TIPOS_FOTO.includes(archivo.type)) errorFoto = 'La foto debe ser JPG, PNG o WebP.';
      else if (archivo.size > MAX_FOTO) errorFoto = 'La foto pesa más de 10 MB. Elige una más liviana.';
    }
    mostrarError('ev-foto', errorFoto);
    if (!archivo || errorFoto) {
      if (errorFoto) foto.value = '';
      fotoElegida.hidden = true;
      teFoto.hidden = true;
      return;
    }
    urlFoto = URL.createObjectURL(archivo);
    fotoPrevia.src = urlFoto;
    teFoto.src = urlFoto;
    fotoElegida.hidden = false;
    teFoto.hidden = false;
  });

  $<HTMLButtonElement>('[data-quitar-foto]').addEventListener('click', () => {
    quitarFoto();
    foto.focus();
  });

  const v4 = crearValidador(forms.a4, {
    'ev-foto': () => errorFoto,
    'ev-organizador': () => (elegido('ev-organizador') ? '' : 'Cuéntanos si organizas el evento o solo lo compartes.'),
  });

  // Vista previa (tarjeta pública) y resumen de lo escrito
  const llenarRevision = () => {
    const texto = (sel: string, t: string) => ($(sel).textContent = t);
    const f = valor('ev-fecha');
    const ciudad = nombreCiudad(valor('ev-ciudad'));
    const gratis = !esConBoleta();
    const n = leerPrecio(valor('ev-precio')) ?? 0;
    const placa = $<HTMLElement>('[data-te-placa]');
    if (f) {
      const { dia, mes } = placaFecha(f);
      texto('[data-te-dia]', dia);
      texto('[data-te-mes]', mes);
    }
    placa.hidden = !f;
    texto('[data-te-categoria]', valor('ev-categoria'));
    texto('[data-te-titulo]', valor('ev-nombre'));
    texto('[data-te-lugar]', valor('ev-lugar'));
    texto('[data-te-ciudad]', ciudad);
    texto('[data-te-precio]', gratis ? 'Gratis' : `Desde ${pesos(n)}`);
    $<HTMLElement>('[data-te-cargo]').hidden = gratis;
    texto('[data-te-vende]', gratis ? 'Entrada libre' : valor('ev-vende'));
    texto('[data-te-cta]', gratis ? 'Ver plan' : 'Ver boletas');

    const dato = (clave: string, t: string) => ($(`[data-dato="${clave}"]`).textContent = t);
    dato('ev-nombre', valor('ev-nombre'));
    dato('ev-categoria', valor('ev-categoria'));
    dato('ev-descripcion', valor('ev-descripcion'));
    const fechaLarga = f
      ? new Date(`${f}T12:00:00-05:00`).toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Bogota' }).replace(',', '')
      : '';
    dato('cuando', `${fechaLarga.charAt(0).toUpperCase()}${fechaLarga.slice(1)} · ${hora12(valor('ev-hora'))}`);
    dato('donde', `${valor('ev-lugar')} · ${valor('ev-direccion')}, ${ciudad}`);
    dato('entrada', gratis ? 'Gratis' : `Desde ${pesos(n)} · vende ${valor('ev-vende')}`);
    dato('ev-url', gratis ? '' : normalizarUrl(valor('ev-url')));
    $$<HTMLElement>('[data-dato-con-boleta]').forEach((el) => (el.hidden = gratis));
    const edad = valor('ev-edad');
    dato('ev-edad', edad ? `Mayores de ${edad} años` : 'Sin edad mínima');
  };

  // "Editar" desde la revisión: al continuar en ese paso se vuelve directo a la revisión
  let editando = false;
  const botonesContinuar = $$<HTMLButtonElement>('form[data-vista="a1"] [type="submit"], form[data-vista="a2"] [type="submit"], form[data-vista="a3"] [type="submit"]');
  const marcarEdicion = (si: boolean) => {
    editando = si;
    botonesContinuar.forEach((b) => (b.textContent = si ? 'Volver a la revisión' : 'Continuar'));
  };
  $$<HTMLButtonElement>('[data-editar]').forEach((b) =>
    b.addEventListener('click', () => {
      marcarEdicion(true);
      ir(b.dataset.editar!);
    }),
  );

  const siguiente = (n: number) => {
    if (editando || n === 4) {
      marcarEdicion(false);
      llenarRevision();
      ir('a4');
    } else ir(`a${n}`);
  };

  forms.a1.addEventListener('submit', (ev) => {
    ev.preventDefault();
    if (v1.intentar()) siguiente(2);
  });
  forms.a2.addEventListener('submit', (ev) => {
    ev.preventDefault();
    if (v2.intentar()) siguiente(3);
  });
  forms.a3.addEventListener('submit', (ev) => {
    ev.preventDefault();
    if (v3.intentar()) siguiente(4);
  });
  forms.a4.addEventListener('submit', (ev) => {
    ev.preventDefault();
    // Por si alguien volvió a un paso anterior y lo dejó a medias
    for (const [v, vista] of [[v1, 'a1'], [v2, 'a2'], [v3, 'a3']] as const) {
      if (!v.intentar()) {
        marcarEdicion(true);
        ir(vista);
        return;
      }
    }
    if (v4.intentar()) ir('a-listo');
  });

  return {
    // Llega desde "Publicar un evento nuevo" del camino B con lo que buscó
    prellenarNombre(texto: string) {
      if (texto && !nombre.value) {
        nombre.value = texto.slice(0, 90);
        buscarDuplicados();
      }
    },
    reiniciar() {
      Object.values(forms).forEach((f) => f.reset());
      [v1, v2, v3, v4].forEach((v) => v.limpiar());
      marcarEdicion(false);
      quitarFoto();
      errorFoto = '';
      conBoleta.hidden = true;
      horaVista.textContent = '';
      precioVisto.textContent = '';
      cajaDuplicados.hidden = true;
      listaDuplicados.replaceChildren();
      anuncioDuplicados.textContent = '';
      ultimos = '';
      contarDescripcion();
    },
  };
};
