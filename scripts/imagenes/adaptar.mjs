// Adaptador: fulleventos_event_images.jsonl (Gemini, una línea por evento) → archivos de trabajo.
//
//   imagenes-importador.jsonl  imágenes de eventos que YA existen en Fulleventos, en el formato del importador
//                              (scripts/imagenes/esquema.mjs), con `procedencia` = la imagen original completa,
//                              las fuentes del evento, la ref y la línea: no se pierde ninguna fuente, licencia
//                              ni evidencia, aunque el importador no tenga una columna para cada dato.
//   eventos-nuevos.jsonl       eventos que no existen todavía (con sus imágenes), tal cual vinieron y ya limpios,
//                              más posibles duplicados. Es la cola para la etapa B (eventos en D1).
//   reporte.json               conteos, avisos de lectura y errores por línea.
//
// No descarga nada, no escribe en Cloudflare y no cambia ningún dato: solo lee y escribe estos tres archivos.
//
// También acepta el formato de la investigación nacional de Gemini (gemini-investigacion/1: eventos, imágenes y
// correcciones en archivos separados, campos en inglés; ver scripts/eventos/normalizar.mjs). Se pueden pasar varios
// archivos a la vez (`archivos`). Todo evento nuevo sale en la cola con su versión normalizada y sus alertas.
import { leerArchivoGemini, limpiar, lineaV1, FORMATO } from './formato-gemini.mjs';
import { normalizar, slug } from '../../src/lib/formato.ts';
import { tipoDeLinea, FORMATO_INVESTIGACION } from '../eventos/normalizar.mjs';
import { adaptarInvestigacion, lineaColaV1, marcarDuplicadosEnLote, resumenAlertas } from '../eventos/cola.mjs';
import { hoyBogota } from '../eventos/evento.mjs';

const recortar = (texto, max) => (texto && texto.length > max ? `${texto.slice(0, max - 1)}…` : texto);

export const idCiudad = (texto, ciudades) => {
  const n = normalizar(texto).replace(/\b(d\.?\s?c\.?|distrito capital)\b/g, '').replace(/[^a-z]/g, '');
  return ciudades.find((c) => c.id === n || normalizar(c.nombre).replace(/[^a-z]/g, '') === n)?.id ?? n;
};

// Evidencias + URL de la licencia en un solo texto para la columna `derechos_evidencia` (el detalle va en procedencia)
const textoEvidencia = (d) => {
  const partes = d.evidencias.map((e) => [e.url, e.cita ? `"${e.cita}"` : null, e.texto].filter(Boolean).join(' — '));
  if (d.licencia_url) partes.push(`Licencia: ${d.licencia_url}`);
  return partes.length ? recortar(partes.join(' | '), 1000) : undefined;
};

export const aRegistroImportador = (linea, imagen, eventoId, contexto) => ({
  evento: { id: eventoId },
  imagen: {
    url: imagen.url,
    tipo: imagen.tipo,
    texto_alternativo: imagen.texto_alternativo,
    credito: recortar(imagen.credito ?? (imagen.autor ? `Foto: ${imagen.autor}` : undefined), 200),
  },
  fuente: { nombre: imagen.fuente.nombre, url: imagen.fuente.url, oficial: imagen.fuente.oficial },
  derechos: {
    estado: imagen.derechos.estado,
    licencia: recortar(imagen.derechos.licencia, 200),
    evidencia: textoEvidencia(imagen.derechos),
    verificado_en: imagen.derechos.verificado_en,
    verificado_por: 'agente',
  },
  ref_externa: linea.ref,
  procedencia: {
    formato: FORMATO,
    archivo: contexto.archivo,
    linea: contexto.linea,
    ref: linea.ref,
    imagen, // la imagen original completa (fuente, licencia, licencia_url, todas las evidencias, autor, página…)
    evento_fuentes: linea.evento.fuentes,
  },
});

// Comprueba que todo URL y texto de licencia/evidencia de la imagen original siga en el registro convertido
export const sinPerdida = (imagen, registro) => {
  const destino = JSON.stringify(registro);
  const recoger = (v, salida = []) => {
    if (typeof v === 'string') salida.push(v);
    else if (Array.isArray(v)) v.forEach((x) => recoger(x, salida));
    else if (v && typeof v === 'object') Object.values(v).forEach((x) => recoger(x, salida));
    return salida;
  };
  return recoger(imagen).filter((t) => !destino.includes(JSON.stringify(t).slice(1, -1)));
};

export const adaptar = ({ contenido, archivo = 'fulleventos_event_images.jsonl', archivos, eventos, ciudades, hoy = hoyBogota() }) => {
  // Lectura de uno o varios archivos; cada línea queda marcada con su archivo y su formato
  const todas = [];
  let ignoradas = 0;
  for (const a of archivos ?? [{ archivo, contenido }]) {
    const leido = leerArchivoGemini(a.contenido);
    ignoradas += leido.ignoradas;
    for (const e of leido.entradas) todas.push({ ...e, archivo: a.archivo, tipo: e.error ? 'v1' : tipoDeLinea(e.valor) ?? 'v1' });
  }
  const entradas = todas.filter((e) => e.tipo === 'v1');
  const deInvestigacion = todas.filter((e) => e.tipo !== 'v1');
  const porId = new Map(eventos.map((e) => [e.id, e]));
  const porClave = new Map(eventos.map((e) => [`${e.ciudad}|${e.fecha}|${slug(e.titulo)}`, e]));
  const reporte = {
    archivo,
    formato: FORMATO,
    lineas_ignoradas: ignoradas,
    eventos: 0,
    eventos_existentes: 0,
    eventos_nuevos: 0,
    imagenes: 0,
    imagenes_a_importar: 0,
    imagenes_de_eventos_nuevos: 0,
    refs_repetidas: 0,
    errores: [],
    avisos: [],
  };
  const importar = [];
  const nuevos = [];
  const vistos = new Set();

  for (const entrada of entradas) {
    if (entrada.avisos?.length) reporte.avisos.push({ linea: entrada.linea, avisos: entrada.avisos });
    if (entrada.error) {
      reporte.errores.push({ linea: entrada.linea, error: entrada.error });
      continue;
    }
    const avisos = [];
    const v = lineaV1.safeParse(limpiar(entrada.valor, '', avisos));
    if (avisos.length) reporte.avisos.push({ linea: entrada.linea, avisos });
    if (!v.success) {
      reporte.errores.push({
        linea: entrada.linea,
        ref: entrada.valor?.ref,
        error: v.error.issues.map((x) => `${x.path.join('.') || 'línea'}: ${x.message}`).join('; '),
      });
      continue;
    }
    const linea = v.data;
    reporte.eventos++;
    reporte.imagenes += linea.imagenes.length;
    if (vistos.has(linea.ref)) {
      // La misma ref dos veces en el archivo: se procesa (el importador es idempotente), pero se avisa
      reporte.refs_repetidas++;
      reporte.avisos.push({ linea: entrada.linea, avisos: [`ref repetida: ${linea.ref}`] });
    }
    vistos.add(linea.ref);

    const ciudad = idCiudad(linea.evento.ciudad, ciudades);
    const existente =
      (linea.evento.id && porId.get(linea.evento.id)) || porClave.get(`${ciudad}|${linea.evento.fecha}|${slug(linea.evento.titulo)}`);

    if (existente) {
      reporte.eventos_existentes++;
      for (const imagen of linea.imagenes) {
        const registro = aRegistroImportador(linea, imagen, existente.id, { archivo, linea: entrada.linea });
        if (JSON.stringify(registro.procedencia).length > 16000) {
          reporte.errores.push({ linea: entrada.linea, ref: linea.ref, error: 'La procedencia de la imagen supera 16 KB; recorta evidencias' });
          continue;
        }
        const perdidos = sinPerdida(imagen, registro);
        if (perdidos.length) {
          reporte.errores.push({ linea: entrada.linea, ref: linea.ref, error: `Se perderían datos: ${perdidos.join(', ')}` });
          continue;
        }
        importar.push(registro);
        reporte.imagenes_a_importar++;
      }
      continue;
    }

    // Evento nuevo: va a la cola de la etapa B con todo lo que trajo
    const posibles = eventos
      .filter((e) => e.ciudad === ciudad && e.fecha === linea.evento.fecha)
      .map((e) => ({ id: e.id, titulo: e.titulo }));
    let preparado;
    try {
      preparado = lineaColaV1(linea, hoy);
    } catch (e) {
      preparado = { normalizado: null, alertas: [{ tipo: 'formato', gravedad: 'bloquea', detalle: `No se pudo normalizar: ${e.message}` }] };
    }
    nuevos.push({ ...linea, formato: FORMATO, ciudad_id: ciudad, linea_origen: entrada.linea, archivo_origen: entrada.archivo ?? archivo, posibles_duplicados: posibles, ...preparado });
    reporte.eventos_nuevos++;
    reporte.imagenes_de_eventos_nuevos += linea.imagenes.length;
  }

  // Formato de investigación (si vino) y duplicados entre todas las líneas de la cola
  if (deInvestigacion.length) {
    const inv = adaptarInvestigacion({ entradas: deInvestigacion, hoy, existentes: eventos });
    reporte.formato = entradas.length ? 'mixto' : FORMATO_INVESTIGACION;
    reporte.investigacion = inv.reporte;
    reporte.eventos += inv.reporte.eventos;
    reporte.eventos_existentes += inv.reporte.eventos_existentes;
    reporte.eventos_nuevos += inv.reporte.eventos_nuevos;
    for (const e of inv.reporte.errores) reporte.errores.push(e);
    nuevos.push(...inv.cola);
  }
  const validas = nuevos.filter((n) => n.normalizado);
  reporte.duplicados_en_lote = marcarDuplicadosEnLote(validas);
  reporte.fecha_corte = hoy;
  reporte.alertas = resumenAlertas(validas);

  return {
    reporte,
    imagenesJsonl: importar.map((r) => JSON.stringify(r)).join('\n') + (importar.length ? '\n' : ''),
    eventosNuevosJsonl: nuevos.map((r) => JSON.stringify(r)).join('\n') + (nuevos.length ? '\n' : ''),
  };
};
