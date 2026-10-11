// Categorías de plan y su color de intención (decisión 2.32): fuente única para el héroe de la Bienvenida,
// las filas de "Este finde" y los chips de la Agenda. El `id` es la etiqueta de los eventos (`etiquetas` en
// eventos.ts) y el valor que acepta `?categoria=` de /agenda. El color es el nombre de un token de tokens.css
// (`--cat-*`); siempre va con el nombre escrito al lado y como relleno con texto `--ink`, nunca como texto.
// El ícono es el de su tarjeta en el héroe (decisión 2.34), un nombre de components/ui/Icono.astro.
import type { NombreIcono } from '../components/ui/Icono.astro';

export interface Categoria {
  id: string;
  texto: string;
  // Título de la fila en "Este finde" cuando no es el mismo texto (decisión 2.30)
  fila?: string;
  color: string;
  icono: NombreIcono;
}

export const categorias: Categoria[] = [
  { id: 'rumba', texto: 'Rumba', color: 'cat-rumba', icono: 'destellos' },
  { id: 'conciertos', texto: 'Conciertos', color: 'cat-conciertos', icono: 'musica' },
  { id: 'gratis', texto: 'Gratis', fila: 'Gratis este finde', color: 'cat-gratis', icono: 'etiqueta' },
  { id: 'deporte', texto: 'Deporte', color: 'cat-deporte', icono: 'balon' },
  { id: 'teatro', texto: 'Arte y teatro', color: 'cat-teatro', icono: 'mascaras' },
  { id: 'comida', texto: 'Comida', color: 'cat-comida', icono: 'cubiertos' },
];

export const categoria = (id: string) => categorias.find((c) => c.id === id);

// Valor CSS del color de una categoría: "var(--cat-rumba)"
export const colorCategoria = (c: Categoria) => `var(--${c.color})`;

// Agenda de una categoría, con la ciudad elegida si no es todo el país ("Ver todos" de "Este finde" y chips del
// héroe). También sirve para "Lo que repostea tu gente" (`amigos`), que no es una categoría con color.
export const rutaCategoria = (id: string, ciudad = 'all') => {
  const p = new URLSearchParams({ categoria: id });
  if (ciudad !== 'all') p.set('ciudad', ciudad);
  return `/agenda?${p}`;
};
