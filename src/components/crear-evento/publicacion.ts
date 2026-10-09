// Camino B de /crear-evento: una publicación sobre un evento que ya está en Fulleventos (decisión 2.26).
// Elegir el evento (con "Tus planes" primero), escribir (tipo, título, texto, fotos y quién la ve), revisar con la
// misma tarjeta de Inicio y del muro, y publicar. DEMOSTRACIÓN: se guarda solo en este navegador
// (lib/publicaciones.ts); en producción la guarda el backend y pasa por moderación (H9, H13).
import { eventos } from '../../data/eventos';
import { enParche } from '../../data/asistencia';
import { rutaEvento, normalizar } from '../../lib/formato';
import {
  crearTarjeta,
  guardarPublicacion,
  lineaEvento,
  MAX_FOTOS,
  nuevoId,
  reducirFoto,
  TIPOS,
  type Audiencia,
  type PublicacionDemo,
  type TipoPublicacion,
} from '../../lib/publicaciones';
import { $, $$, contar, crearValidador, elegido, mostrarError, valor } from './flujo';

const MAX_FOTO = 10 * 1024 * 1024;
const TIPOS_FOTO = ['image/jpeg', 'image/png', 'image/webp'];

interface Opciones {
  ir: (vista: string) => void;
  aEventoNuevo: (nombre: string) => void;
  alElegirEvento: (evento: string) => void;
}

export const iniciarPublicacion = ({ ir, aEventoNuevo, alElegirEvento }: Opciones) => {
  const b1 = $<HTMLFormElement>('form[data-vista="b1"]');
  const b2 = $<HTMLFormElement>('form[data-vista="b2"]');
  const b3 = $<HTMLFormElement>('form[data-vista="b3"]');

  // ---------- 1 · Elegir el evento ----------
  const buscar = $<HTMLInputElement>('[data-buscar-evento]');
  const items = $$<HTMLElement>('[data-item-evento]');
  const grupos = $$<HTMLElement>('[data-grupo-eventos]');
  const sinResultados = $<HTMLElement>('[data-sin-resultados]');
  const anuncioBusqueda = $<HTMLElement>('[data-anuncio-busqueda]');
  const verMas = $<HTMLButtonElement>('[data-ver-mas-eventos]');
  let esperaAnuncio = 0;
  // Sin búsqueda se ven "Tus planes" y los 5 próximos; "Ver más eventos" muestra el resto (decisión 2.27).
  // El evento elegido se ve siempre, aunque sea de los de más.
  let todos = false;

  const filtrar = () => {
    const terminos = normalizar(buscar.value).split(' ').filter(Boolean);
    const recortar = !terminos.length && !todos;
    let visibles = 0;
    let ocultosDeMas = 0;
    items.forEach((li) => {
      const coincide = terminos.every((t) => li.dataset.busqueda!.includes(t));
      const deMas = recortar && li.hasAttribute('data-extra') && !$<HTMLInputElement>('input', li).checked;
      if (coincide && deMas) ocultosDeMas++;
      const ve = coincide && !deMas;
      li.hidden = !ve;
      if (ve) visibles++;
    });
    verMas.hidden = ocultosDeMas === 0;
    grupos.forEach((g) => (g.hidden = !$$<HTMLElement>('[data-item-evento]', g).some((li) => !li.hidden)));
    sinResultados.hidden = visibles > 0;
    $<HTMLElement>('[data-termino]').textContent = buscar.value.trim();
    clearTimeout(esperaAnuncio);
    esperaAnuncio = window.setTimeout(() => {
      anuncioBusqueda.textContent = terminos.length
        ? visibles
          ? `${visibles} ${visibles === 1 ? 'evento encontrado' : 'eventos encontrados'}`
          : 'No encontramos eventos con esa búsqueda'
        : '';
    }, 400);
  };
  buscar.addEventListener('input', filtrar);
  verMas.addEventListener('click', () => {
    const antes = new Set(items.filter((li) => !li.hidden));
    todos = true;
    filtrar();
    // El foco va al primer evento que apareció
    const nuevo = items.find((li) => !li.hidden && !antes.has(li));
    if (nuevo) $<HTMLInputElement>('input', nuevo).focus();
  });
  // Con un evento elegido, la fila de "Continuar" queda fija abajo
  const marcarEleccion = () => b1.classList.toggle('con-eleccion', Boolean(elegido('pub-evento')));
  b1.addEventListener('change', marcarEleccion);
  filtrar();
  // Enter en el buscador no envía el paso
  buscar.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') ev.preventDefault();
  });
  $<HTMLButtonElement>('[data-a-evento-nuevo]').addEventListener('click', () => aEventoNuevo(buscar.value.trim()));

  const v1 = crearValidador(b1, {
    'pub-evento': () => (elegido('pub-evento') ? '' : 'Elige el evento sobre el que quieres publicar.'),
  });

  const opcionParche = $<HTMLElement>('[data-opcion-parche]');
  const eventoActual = () => eventos.find((e) => e.id === elegido('pub-evento'));

  // Prepara el paso 2 para el evento elegido: su nombre y, si la usuaria tiene parche ahí, "Mi parche"
  const prepararEvento = () => {
    const e = eventoActual();
    if (!e) return;
    $<HTMLElement>('[data-elegido-titulo]').textContent = e.titulo;
    $<HTMLElement>('[data-elegido-linea]').textContent = lineaEvento(e);
    const parche = enParche(e.id);
    opcionParche.hidden = !parche;
    $<HTMLElement>('[data-nombre-parche]').textContent = parche ? `Solo la gente de ${parche.nombre}.` : '';
    if (!parche && elegido('pub-audiencia') === 'parche') {
      $<HTMLInputElement>('input[name="pub-audiencia"][value="publica"]').checked = true;
    }
    alElegirEvento(e.id);
  };

  b1.addEventListener('submit', (ev) => {
    ev.preventDefault();
    if (!v1.intentar()) return;
    prepararEvento();
    ir('b2');
  });

  // ---------- 2 · Escribir ----------
  const inputFotos = $<HTMLInputElement>('#pub-fotos');
  const listaFotos = $<HTMLUListElement>('[data-fotos-elegidas]');
  const plantillaFoto = $<HTMLTemplateElement>('template[data-plantilla-foto]');
  let fotos: { archivo: File; url: string }[] = [];
  let errorFotos = '';

  const pintarFotos = () => {
    listaFotos.replaceChildren(
      ...fotos.map((f, i) => {
        const li = plantillaFoto.content.firstElementChild!.cloneNode(true) as HTMLElement;
        const img = $<HTMLImageElement>('[data-foto-img]', li);
        img.src = f.url;
        img.alt = `Foto ${i + 1} de ${fotos.length}`;
        const quitar = $<HTMLButtonElement>('[data-foto-quitar]', li);
        quitar.textContent = `Quitar foto ${i + 1}`;
        quitar.addEventListener('click', () => {
          URL.revokeObjectURL(f.url);
          fotos.splice(i, 1);
          errorFotos = '';
          mostrarError('pub-fotos', '');
          pintarFotos();
          const siguiente = listaFotos.querySelectorAll<HTMLButtonElement>('[data-foto-quitar]')[Math.min(i, fotos.length - 1)];
          (siguiente ?? inputFotos).focus();
        });
        return li;
      }),
    );
    listaFotos.hidden = fotos.length === 0;
  };

  inputFotos.addEventListener('change', () => {
    const nuevas = [...(inputFotos.files ?? [])];
    inputFotos.value = '';
    errorFotos = '';
    for (const archivo of nuevas) {
      if (fotos.length >= MAX_FOTOS) {
        errorFotos = `Puedes subir hasta ${MAX_FOTOS} fotos.`;
        break;
      }
      if (!TIPOS_FOTO.includes(archivo.type)) {
        errorFotos = 'Las fotos deben ser JPG, PNG o WebP.';
        continue;
      }
      if (archivo.size > MAX_FOTO) {
        errorFotos = 'Una de las fotos pesa más de 10 MB. Elige una más liviana.';
        continue;
      }
      fotos.push({ archivo, url: URL.createObjectURL(archivo) });
    }
    mostrarError('pub-fotos', errorFotos);
    pintarFotos();
  });

  const v2 = crearValidador(b2, {
    'pub-tipo': () => (elegido('pub-tipo') ? '' : 'Elige el tipo de publicación.'),
    'pub-titulo': () => (!valor('pub-titulo') ? 'Escribe un título.' : valor('pub-titulo').length < 3 ? 'El título debe tener al menos 3 letras.' : ''),
    'pub-texto': () => (!valor('pub-texto') ? 'Escribe el texto de tu publicación.' : valor('pub-texto').length < 10 ? 'Cuéntalo en al menos 10 caracteres.' : ''),
    'pub-fotos': () => errorFotos,
    'pub-audiencia': () => (elegido('pub-audiencia') ? '' : 'Elige quién puede ver tu publicación.'),
  });
  const contarTexto = contar('pub-texto');

  const borrador = (): PublicacionDemo => {
    const e = eventoActual()!;
    const audiencia = elegido('pub-audiencia') as Audiencia;
    return {
      id: nuevoId(),
      evento: e.id,
      tipo: elegido('pub-tipo') as TipoPublicacion,
      titulo: valor('pub-titulo'),
      texto: valor('pub-texto'),
      fotos: fotos.map((f) => f.url),
      audiencia,
      ...(audiencia === 'parche' && { parche: enParche(e.id)?.id }),
      creada: new Date().toISOString(),
    };
  };

  const previa = $<HTMLElement>('[data-previa-publicacion]');
  b2.addEventListener('submit', (ev) => {
    ev.preventDefault();
    if (!v2.intentar()) return;
    const tarjeta = crearTarjeta(borrador(), { nivel: 3, vistaPrevia: true });
    previa.replaceChildren(...(tarjeta ? [tarjeta] : []));
    $<HTMLElement>('[data-error-guardar]').hidden = true;
    ir('b3');
  });

  // ---------- 3 · Publicar ----------
  let publicando = false;
  b3.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    if (publicando) return;
    publicando = true;
    const boton = $<HTMLButtonElement>('[type="submit"]', b3);
    boton.setAttribute('aria-disabled', 'true');
    boton.textContent = 'Publicando…';
    const p = borrador();
    // Las fotos se reducen en el navegador para que quepan en el almacenamiento local (no se suben a ningún lado)
    const reducidas = await Promise.all(fotos.map((f) => reducirFoto(f.archivo).catch(() => '')));
    p.fotos = reducidas.filter(Boolean);
    const resultado = guardarPublicacion(p);
    publicando = false;
    boton.removeAttribute('aria-disabled');
    boton.textContent = 'Publicar';
    if (resultado === 'error') {
      $<HTMLElement>('[data-error-guardar]').hidden = false;
      boton.focus();
      return;
    }
    const e = eventoActual()!;
    $<HTMLElement>('[data-publicado-en]').textContent = e.titulo;
    $<HTMLElement>('[data-nota-fotos]').hidden = resultado !== 'sin-fotos';
    $<HTMLAnchorElement>('[data-ver-en-evento]').href = `${rutaEvento(e.ciudad, e.titulo)}#publicaciones`;
    ir('b-listo');
  });

  return {
    // ?evento=<id>: deja el evento elegido (devuelve false si no existe)
    seleccionar(id: string) {
      const radio = document.querySelector<HTMLInputElement>(`input[name="pub-evento"][value="${CSS.escape(id)}"]`);
      if (!radio) return false;
      radio.checked = true;
      v1.limpiar();
      marcarEleccion();
      filtrar();
      prepararEvento();
      return true;
    },
    // ?tipo= y ?texto= (desde el compositor de Inicio)
    prellenar(tipo: string | null, texto: string | null) {
      if (tipo && tipo in TIPOS) {
        const radio = document.querySelector<HTMLInputElement>(`input[name="pub-tipo"][value="${tipo}"]`);
        if (radio) radio.checked = true;
      }
      if (texto) {
        $<HTMLTextAreaElement>('#pub-texto').value = texto.slice(0, 1000);
        contarTexto();
      }
    },
    reiniciar() {
      [b1, b2, b3].forEach((f) => f.reset());
      [v1, v2].forEach((v) => v.limpiar());
      fotos.forEach((f) => URL.revokeObjectURL(f.url));
      fotos = [];
      errorFotos = '';
      pintarFotos();
      previa.replaceChildren();
      buscar.value = '';
      todos = false;
      filtrar();
      marcarEleccion();
      contarTexto();
    },
  };
};
