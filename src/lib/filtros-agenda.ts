// Filtros y páginas de la Agenda (etapa B3). Una sola regla para el servidor (página bajo demanda con D1: filtra y
// pagina antes de mandar el HTML) y para el navegador (página estática: filtra las tarjetas que ya están).
// Los filtros viven en la URL (H42): /agenda?ciudad=medellin&categoria=deportes&gratis=1&fecha=semana&q=salsa&pagina=2
import { categoriaOficialDe, ciudadDe, esGratis, type Evento } from '../data/eventos';
import { ciudades } from '../data/ciudades';
import { categoriaAgendaDesdeSitio, categoriasAgenda, fechasAgenda, socialAgenda } from '../data/agenda';
import { slug } from './formato';

// Planes por página en el servidor (B3). La página estática sigue mostrando 8 y "Ver N planes más" (H47).
export const POR_PAGINA = 24;

export interface FiltrosAgenda {
  ciudad: string;
  categoria: string;
  gratis: boolean;
  fecha: string;
  q: string;
  pagina: number;
}

export const FILTROS_INICIALES: FiltrosAgenda = { ciudad: 'all', categoria: 'all', gratis: false, fecha: 'finde', q: '', pagina: 1 };

const idsCiudad = new Set(['all', ...ciudades.map((c) => c.id)]);
const idsCategoria = new Set(categoriasAgenda.map((c) => c.id));
export const fechaAgenda = (id: string) => fechasAgenda.find((f) => f.id === id) ?? fechasAgenda.find((f) => f.id === 'finde')!;

// Lo que no se reconoce vuelve al valor inicial: una URL vieja o alterada nunca rompe la página
export const leerFiltros = (p: URLSearchParams): FiltrosAgenda => {
  const pedida = p.get('categoria') ?? 'all';
  // Enlaces viejos con las 6 categorías del sitio (?categoria=rumba → la oficial; ?categoria=gratis → Gratis)
  const categoria = categoriaAgendaDesdeSitio[pedida] ?? pedida;
  const ciudad = p.get('ciudad') ?? 'all';
  const fecha = p.get('fecha') ?? 'finde';
  const pagina = Number.parseInt(p.get('pagina') ?? '1', 10);
  return {
    ciudad: idsCiudad.has(ciudad) ? ciudad : 'all',
    categoria: idsCategoria.has(categoria) ? categoria : 'all',
    gratis: p.get('gratis') === '1' || pedida === 'gratis',
    fecha: fechasAgenda.some((f) => f.id === fecha) ? fecha : 'finde',
    q: (p.get('q') ?? '').trim().slice(0, 80),
    pagina: Number.isFinite(pagina) && pagina > 1 ? Math.min(pagina, 1000) : 1,
  };
};

// "?ciudad=…&categoria=…" sin los valores iniciales ("" si no hay filtros). La página 1 no se escribe.
export const consultaAgenda = (f: FiltrosAgenda) => {
  const p = new URLSearchParams();
  if (f.q) p.set('q', f.q);
  if (f.ciudad !== 'all') p.set('ciudad', f.ciudad);
  if (f.categoria !== 'all') p.set('categoria', f.categoria);
  if (f.gratis) p.set('gratis', '1');
  if (f.fecha !== 'finde') p.set('fecha', f.fecha);
  if (f.pagina > 1) p.set('pagina', String(f.pagina));
  const s = p.toString();
  return s ? `?${s}` : '';
};

// Texto sin tildes para la búsqueda (el mismo de data-texto en TarjetaMarketplace)
export const textoBuscable = (e: Evento) => slug(`${e.titulo} ${e.lugar} ${ciudadDe(e)} ${e.categoria}`).replace(/-/g, ' ');
const palabras = (q: string) => slug(q).replace(/-/g, ' ').split(' ').filter(Boolean);

// Todos los filtros menos la ciudad (los conteos de las ciudades salen de aquí). `categoria` permite contar con otra.
export const pasaSinCiudad = (e: Evento, f: FiltrosAgenda, categoria = f.categoria) => {
  const fecha = fechaAgenda(f.fecha);
  if (e.fecha < fecha.desde || e.fecha > fecha.hasta) return false;
  if (categoria === 'amigos' && !socialAgenda[e.id]?.amigos) return false;
  if (categoria !== 'all' && categoria !== 'amigos' && categoriaOficialDe(e) !== categoria) return false;
  if (f.gratis && !esGratis(e)) return false;
  if (f.q) {
    const texto = textoBuscable(e);
    if (!palabras(f.q).every((p) => texto.includes(p))) return false;
  }
  return true;
};

const enCiudad = (e: Evento, f: FiltrosAgenda) => f.ciudad === 'all' || e.ciudad === f.ciudad;

// Orden de la Agenda (4.6 §7): intercalado por ciudad, Bogotá primero; los municipios de D1 que no son ciudad del
// sitio van al final
export const intercalar = (lista: Evento[]) => {
  const grupos = ciudades.map((c) => lista.filter((e) => e.ciudad === c.id));
  const salida: Evento[] = [];
  for (let i = 0; grupos.some((g) => g[i]); i++) for (const g of grupos) if (g[i]) salida.push(g[i]);
  return [...salida, ...lista.filter((e) => !ciudades.some((c) => c.id === e.ciudad))];
};

export interface ResultadoAgenda {
  total: number;
  paginas: number;
  pagina: number;
  // Planes de la página pedida
  planes: Evento[];
  ciudades: number;
  conteoCiudad: Record<string, number>;
  conteoCategoria: Record<string, number>;
}

// Filtra, ordena y corta una página (servidor)
export const resultadoAgenda = (eventos: Evento[], f: FiltrosAgenda, porPagina = POR_PAGINA): ResultadoAgenda => {
  const base = eventos.filter((e) => pasaSinCiudad(e, f));
  const coinciden = intercalar(f.ciudad === 'all' ? base : base.filter((e) => e.ciudad === f.ciudad));
  const paginas = Math.max(1, Math.ceil(coinciden.length / porPagina));
  const pagina = Math.min(f.pagina, paginas);
  const conteoCiudad: Record<string, number> = { all: base.length };
  for (const e of base) conteoCiudad[e.ciudad] = (conteoCiudad[e.ciudad] ?? 0) + 1;
  const conteoCategoria = Object.fromEntries(
    categoriasAgenda
      .filter((c) => c.icono)
      .map((c) => [c.id, eventos.filter((e) => enCiudad(e, f) && pasaSinCiudad(e, f, c.id)).length]),
  );
  return {
    total: coinciden.length,
    paginas,
    pagina,
    planes: coinciden.slice((pagina - 1) * porPagina, pagina * porPagina),
    ciudades: new Set(coinciden.map((e) => e.ciudad)).size,
    conteoCiudad,
    conteoCategoria,
  };
};
